<?php declare(strict_types=1);

/* ============================================================================
   doctor.php — the integrity gate.

   Almost everything valuable in this repository is a CROSS-REFERENCE, and a
   cross-reference is the one kind of content that rots without a symptom. A
   broken build shouts. A pointer to a chapter renamed six weeks ago says
   nothing at all, to anybody, ever — and the reader who follows it concludes
   the repository is sloppy rather than that one line is.

   Written in PHP because the accounts service and the reference system are, and
   a tool you cannot read in the language you are teaching is a bad advert for
   it. Deliberately dependency-free: it must run on a machine with no Composer
   install and no database.

   Report an ERROR for something definitely wrong and a WARNING for something
   probably wrong. Only errors set the exit code, because a gate people learn to
   ignore is worse than no gate.

   Usage:  php tools/doctor.php  [--fix-lock]
   ============================================================================ */

$root = dirname(__DIR__);

/* Which subject? Default to the only one that exists today; the CI job runs it
   once per subject so a failure names the subject in its own line. */
$subject = 'php';
foreach (array_slice($argv, 1) as $a) {
    if (!str_starts_with($a, '--')) { $subject = $a; }
}
$site = "{$root}/subjects/{$subject}/site";
if (!is_dir($site)) {
    fwrite(STDERR, "no such subject: {$subject}  (looked in {$site})" . PHP_EOL);
    exit(2);
}
echo PHP_EOL . "  subject: {$subject}" . PHP_EOL;

$errors = [];
$warnings = [];
$checks = [];

function err(string $check, string $msg): void   { $GLOBALS['errors'][]   = [$check, $msg]; }
function warn(string $check, string $msg): void  { $GLOBALS['warnings'][] = [$check, $msg]; }
function done(string $check, string $note): void { $GLOBALS['checks'][$check] = $note; }

/* ---------------------------------------------------------------------------
   Reading the JS data files.

   These are plain <script> data islands, not modules, so there is nothing to
   import. Parsing them with a regex is a deliberate trade: it keeps this tool
   dependency-free and readable, at the cost of assuming the files keep their
   current shape. The shape is enforced by the checks below — if somebody
   reformats chapters.js so this stops matching, the manifest check fails loudly
   rather than silently passing on zero entries. That guard is the reason the
   trade is acceptable.
   --------------------------------------------------------------------------- */

$chaptersJs = file_get_contents($site . '/assets/chapters.js');

preg_match_all('/^\s*n:\s*"([^"]*)",\s*id:\s*"([^"]+)"/m', $chaptersJs, $m, PREG_SET_ORDER);
$manifest = [];
foreach ($m as $row) {
    $manifest[] = ['n' => $row[1], 'id' => $row[2]];
}

if (count($manifest) === 0) {
    err('site/manifest', 'parsed ZERO chapters from chapters.js — the file shape changed and this tool can no longer read it');
}

$ids = array_column($manifest, 'id');

/* ------------------------------------------------- 1. manifest <-> files --- */
$files = array_values(array_filter(
    scandir($site . '/chapters'),
    static fn ($f) => str_ends_with($f, '.html')
));
$fileIds = array_map(static fn ($f) => substr($f, 0, -5), $files);

foreach ($ids as $id) {
    if (!in_array($id, $fileIds, true)) {
        err('site/manifest', "manifest entry has no chapter file: {$id}.html");
    }
}
foreach ($fileIds as $f) {
    if (!in_array($f, $ids, true)) {
        err('site/manifest', "orphan chapter file, not in the manifest: {$f}.html");
    }
}
$dupes = array_diff_assoc($ids, array_unique($ids));
foreach ($dupes as $d) {
    err('site/manifest', "duplicate chapter id in the manifest: {$d}");
}
done('site/manifest', count($ids) . ' entries, ' . count($fileIds) . ' files');

/* --------------------------------------------- 2. body data-chapter tag --- */
/* learn.js reads document.body.dataset.chapter to decide which chapter's
   progress it is recording. A copied file with a stale attribute records the
   wrong chapter's score — silent, and it corrupts the mastery number. */
$bad = 0;
foreach ($fileIds as $id) {
    $html = file_get_contents("{$site}/chapters/{$id}.html");
    if (!preg_match('/<body data-chapter="([^"]+)"/', $html, $b)) {
        err('site/data-chapter', "{$id}.html has no data-chapter attribute");
        $bad++;
    } elseif ($b[1] !== $id) {
        err('site/data-chapter', "{$id}.html declares data-chapter=\"{$b[1]}\" — progress would be recorded against the wrong chapter");
        $bad++;
    }
}
done('site/data-chapter', ($bad === 0 ? 'all ' . count($fileIds) . ' match their filename' : "{$bad} wrong"));

/* --------------------------------------------------- 3. script contract --- */
/* Script ORDER is a contract: chapters.js -> banks -> store.js -> site.js ->
   consumers. store.js must exist before anything reads window.LF. */
$required = ['chapters.js', 'store.js', 'site.js', 'quiz.js', 'learn.js'];
$bad = 0;
foreach ($fileIds as $id) {
    $html = file_get_contents("{$site}/chapters/{$id}.html");
    preg_match_all('~<script src="\.\./assets/([^"]+)"~', $html, $s);
    $loaded = $s[1];
    foreach ($required as $r) {
        if (!in_array($r, $loaded, true)) {
            err('site/scripts', "{$id}.html does not load {$r}");
            $bad++;
        }
    }
    $store = array_search('store.js', $loaded, true);
    $siteJs = array_search('site.js', $loaded, true);
    if ($store !== false && $siteJs !== false && $store > $siteJs) {
        err('site/scripts', "{$id}.html loads store.js after site.js — consumers will see no window.LF");
        $bad++;
    }
}
done('site/scripts', $bad === 0 ? 'load order intact in all ' . count($fileIds) : "{$bad} problems");

/* ------------------------------------------------------ 4. local links --- */
$pages = glob($site . '/*.html');
foreach ($fileIds as $id) { $pages[] = "{$site}/chapters/{$id}.html"; }
$broken = 0;
foreach ($pages as $page) {
    $dir = dirname($page);
    $html = file_get_contents($page);
    /* Strip <script> blocks first. Pages build links by string concatenation
       ('chapters/' + c.id + '.html'), and scanning those produces confident
       nonsense — the first version of this check reported six such "broken"
       links and two real ones, which is how a gate teaches you to ignore it. */
    $html = preg_replace('~<script[^>]*>.*?</script>~is', '', $html);
    /* And code samples, for exactly the same reason. A chapter teaching Blade
       escaping shows href="{{ $url }}"; one teaching WordPress shows a printf
       with href="%s". Those are illustrations, not links, and reporting them
       recreates the failure above — noise beside the real findings. <pre> first,
       so <pre><code> goes in one piece, then inline <code>. */
    $html = preg_replace('~<pre\b[^>]*>.*?</pre>~is', '', $html);
    $html = preg_replace('~<code\b[^>]*>.*?</code>~is', '', $html);
    preg_match_all('~(?:href|src)="([^"#?][^"]*)"~', $html, $links);
    foreach ($links[1] as $href) {
        if (preg_match('~^(https?:|mailto:|data:|//)~', $href)) { continue; }
        $target = $dir . '/' . strtok($href, '#?');
        if (!file_exists($target)) {
            err('site/links', basename($page) . " -> {$href} does not resolve");
            $broken++;
        }
    }
}
done('site/links', $broken === 0 ? count($pages) . ' pages, every local link resolves' : "{$broken} broken");

/* -------------------------------------------------------- 5. quiz bank --- */
$bankSrc = '';
foreach (['quizzes-1.js', 'quizzes-2.js', 'quizzes-3.js'] as $f) {
    $bankSrc .= file_get_contents("{$site}/assets/{$f}") . "\n";
}

/* Split into "chapter-id": [ ... ] blocks. */
preg_match_all('~"([a-z0-9][a-z0-9\-]*)":\s*\[(.*?)\n  \],~s', $bankSrc, $blocks, PREG_SET_ORDER);
$bank = [];
foreach ($blocks as $b) {
    $chapter = $b[1];
    $body = $b[2];
    /* Each question is a { q: ... } object. Count them, and check every `c`
       index is inside its own `a` array — an out-of-range index marks a correct
       answer that does not exist, and the learner can never score it. */
    preg_match_all('~\{\s*q:.*?(?=\n\n|\n\s*\{\s*q:|$)~s', $body, $qs);
    $questions = $qs[0];
    $bank[$chapter] = count($questions);
    foreach ($questions as $i => $q) {
        preg_match_all('~a:\s*\[(.*?)\],\s*\n?\s*c:~s', $q, $am);
        if (!isset($am[1][0])) { continue; }
        $optionCount = preg_match_all('~"(?:[^"\\\\]|\\\\.)*"~', $am[1][0]);
        preg_match('~\bc:\s*(\[[^\]]*\]|\d+)~', $q, $cm);
        if (!isset($cm[1])) { continue; }
        $correct = str_starts_with($cm[1], '[')
            ? array_map('intval', preg_split('~\D+~', trim($cm[1], '[]'), -1, PREG_SPLIT_NO_EMPTY))
            : [(int) $cm[1]];
        foreach ($correct as $c) {
            if ($c < 0 || $c >= $optionCount) {
                err('site/quiz-bank', "{$chapter}#{$i}: correct index {$c} is outside its {$optionCount} options");
            }
        }
    }
}
foreach (array_keys($bank) as $chapter) {
    if (!in_array($chapter, $ids, true)) {
        err('site/quiz-bank', "questions exist for a chapter not in the manifest: {$chapter}");
    }
}
$totalQ = array_sum($bank);
done('site/quiz-bank', "{$totalQ} questions across " . count($bank) . ' chapters');

/* -------------------------------------------------------- 6. quiz ids ---- */
/* THE APPEND-ONLY LOCK. A question's id is "<chapter>#<index>", and that id is
   the key a learner's spaced-repetition schedule is stored under. Reordering or
   deleting a question silently reassigns somebody's review history to a
   different question. Nothing else in the system can detect that, so the
   lockfile records every id ever issued and this check refuses to let one
   disappear. --fix-lock adds newly appended ids; it will never remove one. */
$lockPath = "{$root}/subjects/{$subject}/quiz-ids.lock";
$current = [];
foreach ($bank as $chapter => $count) {
    for ($i = 0; $i < $count; $i++) { $current[] = "{$chapter}#{$i}"; }
}
sort($current);

if (!file_exists($lockPath)) {
    file_put_contents($lockPath, implode("\n", $current) . "\n");
    warn('site/quiz-ids', 'lockfile did not exist; created it with ' . count($current) . ' ids');
    done('site/quiz-ids', 'lockfile created');
} else {
    $locked = array_values(array_filter(array_map('trim', file($lockPath))));
    $missing = array_diff($locked, $current);
    $added = array_diff($current, $locked);
    foreach ($missing as $id) {
        err('site/quiz-ids', "question id no longer exists: {$id} — a question was reordered or deleted, and somebody's review schedule now points at the wrong question");
    }
    if ($added && in_array('--fix-lock', $argv, true)) {
        $merged = array_unique(array_merge($locked, $current));
        sort($merged);
        file_put_contents($lockPath, implode("\n", $merged) . "\n");
        done('site/quiz-ids', count($added) . ' new ids appended to the lock');
    } elseif ($added) {
        warn('site/quiz-ids', count($added) . ' new question ids not yet in the lock — run: php tools/doctor.php --fix-lock');
        done('site/quiz-ids', count($locked) . ' locked, ' . count($added) . ' new');
    } else {
        done('site/quiz-ids', count($locked) . ' ids, none lost');
    }
}

/* ------------------------------------------------ 7. kid / pro pairing --- */
/* NOT one of the blueprint's eleven — added because it broke here. Blueprint
   §3.2 requires both explanations on every concept, because the Both/Simple/Pro
   switch depends on the pairing. A section with only a pro box renders as a
   heading with nothing under it in Simple mode: silent, and it makes the
   chapter useless as a self-test, which is the switch's entire purpose. */
$written = 0; $bad = 0;
foreach ($fileIds as $id) {
    $html = file_get_contents("{$site}/chapters/{$id}.html");
    if (str_contains($html, 'This chapter is not written yet')) { continue; }
    $written++;
    $kid = substr_count($html, 'class="box kid"');
    $pro = substr_count($html, 'class="box pro"');
    if ($kid !== $pro) {
        err('site/kid-pro', "{$id}.html has {$kid} kid vs {$pro} pro boxes — Simple mode will render a blank section");
        $bad++;
    }
}
done('site/kid-pro', $bad === 0 ? "{$written} written chapters, all paired" : "{$bad} unpaired");

/* ------------------------------------------------------ 8. prose counts --- */
/* Blueprint §11.2: the original's counts check was sentence-anchored, so prose
   written after the anchor list drifted in silence. Inverted here, as the
   blueprint instructs — any number adjacent to the noun is CHECKED, and the
   allowlist below is the explicit set of legitimate exceptions. */
$statusPath = "{$root}/docs/BUILD-STATUS-{$subject}.md";
if (!file_exists($statusPath)) {
    warn('docs/counts', basename($statusPath) . ' not found');
} else {
    $md = file_get_contents($statusPath);
    $stubCount = count($fileIds) - $written;
    $truth = [
        'chapters'  => count($ids),
        'questions' => $totalQ,
    ];
    /* THE ALLOWLIST. Blueprint §11.2 says invert the check — every number
       adjacent to the noun is checked, and legitimate exceptions are named
       explicitly — and warns to budget for this list. Each entry needs a
       reason, or it becomes a place to hide a stale number. */
    $allow = [
        '~\d+ chapters of 47~'   => 'written-of-total phrasing; the first number is the written count, not the total',
        '~\d+ chapters answer~'  => 'the req/extra coverage split',
        '~47 chapters~'           => 'the total, which is what we are comparing against',
        '~43[02] questions~'      => "the blueprint's target, not this build's count",
        '~28 modules~'            => 'a target from blueprint §12',
    ];

    foreach (['chapters', 'questions'] as $noun) {
        preg_match_all('~(\d+)\s+' . $noun . '~i', $md, $hits, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);
        foreach ($hits as $h) {
            /* Match the allowlist against a WINDOW around the hit, not against
               the "<n> <noun>" fragment alone. The exceptions are phrasings —
               "10 chapters of 47" — and the fragment can never carry enough
               context to recognise one. A window rather than the whole line, so
               a legitimate number elsewhere on the line cannot excuse a wrong
               one sitting beside it. */
            $frag = $h[0][0];
            $off  = $h[0][1];
            $context = substr($md, max(0, $off - 24), strlen($frag) + 48);

            $excused = false;
            foreach ($allow as $pattern => $_why) {
                if (preg_match($pattern, $context)) { $excused = true; break; }
            }
            if ($excused) { continue; }

            if ((int) $h[1][0] !== $truth[$noun]) {
                $line = substr_count(substr($md, 0, $off), "\n") + 1;
                err('docs/counts', "BUILD-STATUS.md line {$line}: \"{$frag}\" but there are {$truth[$noun]}");
            }
        }
    }

    /* THE COUNTS TABLE. Every row is checked against a measured value.

       This was added after a negative test: changing "| Quiz questions | 70 |"
       to 68 did NOT fail the gate, because the noun-adjacent scan above looks
       for "<n> questions" and a table row puts the label first. The
       authoritative table — the thing a reader actually trusts — was the one
       part of the document nothing verified. Blueprint §11.2 again: a gate that
       only inspects what it was told about reports green for the same reason a
       missing gate does. */
    $glossaryJs = file_get_contents($site . '/assets/glossary.js');
    $italianoJs = file_get_contents($site . '/assets/italiano.js');

    $rows = [
        'Site chapters \(files \+ manifest entries\)' => count($ids),
        'Chapters actually written'                   => $written,
        'Chapters that are honest placeholders'       => $stubCount,
        'Quiz questions'                              => $totalQ,
        'Chapters with questions'                     => count($bank),
        'Glossary terms'                              => preg_match_all('~^\s*\{\s*en:~m', $glossaryJs),
        'Italian chapter panels'                      => preg_match_all('~^\s{2}"[a-z0-9][a-z0-9\-]*":\s*\{~m', $italianoJs),
    ];

    $rowsChecked = 0;
    foreach ($rows as $label => $actual) {
        if (preg_match('~^\| ' . $label . ' \| \*{0,2}(\d+)\*{0,2} \|~m', $md, $r)) {
            $rowsChecked++;
            if ((int) $r[1] !== $actual) {
                err('docs/counts', "BUILD-STATUS.md table says \"{$r[0]}\" but the measured value is {$actual}");
            }
        } else {
            warn('docs/counts', "no table row found for \"" . stripslashes($label) . "\" — it may have been renamed, and is now unchecked");
        }
    }

    /* The written/placeholder split is stated in a table; check the two figures. */
    if (preg_match('~Chapters actually written \| \*\*(\d+)\*\*~', $md, $w) && (int) $w[1] !== $written) {
        err('docs/counts', "BUILD-STATUS.md says {$w[1]} chapters written, actual: {$written}");
    }
    if (preg_match('~honest placeholders \| \*\*(\d+)\*\*~', $md, $p) && (int) $p[1] !== $stubCount) {
        err('docs/counts', "BUILD-STATUS.md says {$p[1]} placeholders, actual: {$stubCount}");
    }
    done('docs/counts', "{$written} written / {$stubCount} placeholder / {$totalQ} questions");
}

/* ------------------------------------------------- 9. service worker ---- */
/* Blueprint §11.4: the cache name is manual and nothing enforces bumping it.
   sw.js now derives it from subject.js (key + "-v" + cacheVersion), which moves
   the manual step somewhere a human will actually see it, but does NOT solve the
   real problem: nothing here can tell that content changed and the version did
   not. Said plainly rather than implied, because a check that overstates what it
   covers is worse than the gap it hides. */
$swSrc = file_get_contents($site . '/sw.js');
if (!str_contains($swSrc, 'importScripts("assets/subject.js")')) {
    err('site/sw-cache', 'sw.js does not importScripts subject.js, so its cache name cannot be per-subject');
} else {
    /* Parse the key locally rather than reusing $k from a later check — a
       cross-check ordering dependency is exactly the kind of thing that breaks
       silently when somebody reorders the file. */
    $sjRaw = file_get_contents($site . '/assets/subject.js');
    preg_match('~cacheVersion:\s*(\d+)~', $sjRaw, $cv);
    preg_match('~key:\s*"([^"]+)"~', $sjRaw, $kk);
    if (!$cv) {
        err('site/sw-cache', 'subject.js declares no cacheVersion');
    } else {
        done('site/sw-cache', 'derived: ' . ($kk[1] ?? '?') . '-v' . $cv[1] . ' — NOT verified against content; see the gaps in BUILD-STATUS');
    }
}

/* ------------------------------------------------- 10. engine drift ---- */
/* /engine is the single source of truth; tools/sync-engine.php copies it into
   each subject so every site stays self-contained and file://-openable. That
   only works if drift is an ERROR rather than something you find out about
   weeks later, having fixed the same bug twice in two places. */
$ENGINE_FILES = [
    'assets/store.js', 'assets/site.js', 'assets/quiz.js', 'assets/learn.js',
    'assets/viva.js', 'assets/simulate.js', 'assets/notes.js', 'assets/account.js',
    'assets/auth-page.js', 'assets/cv.js', 'assets/italiano-panel.js',
    'assets/style.css', 'assets/learn.css', 'sw.js',
];
$drifted = 0;
foreach ($ENGINE_FILES as $rel) {
    $canonical = $root . '/engine/' . basename($rel);
    $copy      = $site . '/' . $rel;
    if (!file_exists($canonical)) { err('site/engine', 'missing from /engine: ' . basename($rel)); $drifted++; continue; }
    if (!file_exists($copy))      { err('site/engine', "missing from the subject: {$rel} — run php tools/sync-engine.php"); $drifted++; continue; }
    if (md5_file($canonical) !== md5_file($copy)) {
        err('site/engine', "{$rel} has drifted from /engine — edit the canonical copy, then run php tools/sync-engine.php");
        $drifted++;
    }
}
done('site/engine', $drifted === 0 ? count($ENGINE_FILES) . ' files match /engine' : "{$drifted} drifted");

/* ------------------------------------------------- 11. subject config --- */
/* subject.js MUST load before store.js: the localStorage namespace comes from
   it, and if it loads late the engine falls back to "academy" and a learner's
   progress lands in a bucket shared with every other subject. */
$missingSubj = 0; $wrongOrder = 0;
foreach ($pages as $page) {
    $html = file_get_contents($page);
    $subjPos  = strpos($html, 'assets/subject.js');
    $storePos = strpos($html, 'assets/store.js');
    if ($subjPos === false) { err('site/subject', basename($page) . ' does not load subject.js'); $missingSubj++; continue; }
    if ($storePos !== false && $subjPos > $storePos) {
        err('site/subject', basename($page) . ' loads subject.js AFTER store.js — the storage namespace would fall back to "academy"');
        $wrongOrder++;
    }
}
$subjJs = $site . '/assets/subject.js';
if (!file_exists($subjJs)) {
    err('site/subject', 'assets/subject.js does not exist');
} else {
    $sj = file_get_contents($subjJs);
    if (!preg_match('~key:\s*"([^"]+)"~', $sj, $k)) {
        err('site/subject', 'subject.js declares no localStorage key');
    } else {
        done('site/subject', 'namespace "' . $k[1] . '", loaded first on all ' . count($pages) . ' pages');
    }
}

/* ------------------------------------------------ 12. theme boot ------- */
/* Every page must carry the inline snippet that puts the saved theme on <html>
   before the first paint. Without it a visitor whose theme differs from their
   OS setting sees the wrong theme flash and correct itself: site.js reads the
   preference, and site.js loads at the bottom of the document.

   It is inline in 187 pages rather than an engine file because a <script src>
   in <head> is a render-blocking request, and a round trip before first paint
   is a worse trade than the flash it would prevent. tools/head-theme.php owns
   the text; this only asserts that every page has the CURRENT version of it,
   so a hand-edited page or a newly added one cannot silently go without. */
$bootMissing = 0;
foreach ($pages as $page) {
    if (!str_contains(file_get_contents($page), '<script data-theme-boot>')) {
        err('site/theme-boot', basename($page) . ' has no theme-boot snippet — run php tools/head-theme.php ' . $subject);
        $bootMissing++;
    }
}
if ($bootMissing === 0) {
    /* Stale copies matter as much as missing ones: --check re-renders the
       snippet and compares, so an edit to head-theme.php that was never
       applied is caught here rather than shipping half-updated. */
    exec('php ' . escapeshellarg(__DIR__ . '/head-theme.php') . ' ' . escapeshellarg($subject) . ' --check', $o, $rc);
    if ($rc !== 0) {
        err('site/theme-boot', 'the snippet is out of date on some pages — run php tools/head-theme.php ' . $subject);
    } else {
        done('site/theme-boot', 'present and current on all ' . count($pages) . ' pages');
    }
}

/* ------------------------------------------------ 13. brand ------------ */
/* Every page must carry the inline <style> that puts THIS subject's accent on
   :root. Without it the page falls through to engine/style.css, which still
   holds the .NET purple every one of these sites was cloned from — and that is
   a silent failure: a wrong-but-plausible colour looks like a design decision,
   not a bug, so nothing ever reports it.

   It is inline for the same reason the theme boot is, with one addition: a
   per-subject brand.css would be a render-blocking round trip before first
   paint to carry six colours, and inline needs no JavaScript either.
   tools/head-brand.php owns the text and reads the colours out of subject.js;
   this asserts every page has the CURRENT version, so a colour edited in
   subject.js but never stamped is caught here rather than shipping. */
$brandMissing = 0;
foreach ($pages as $page) {
    if (!str_contains(file_get_contents($page), '<style data-brand>')) {
        err('site/brand', basename($page) . ' has no brand snippet — run php tools/head-brand.php ' . $subject);
        $brandMissing++;
    }
}
if ($brandMissing === 0) {
    exec('php ' . escapeshellarg(__DIR__ . '/head-brand.php') . ' ' . escapeshellarg($subject) . ' --check', $bo, $brc);
    if ($brc !== 0) {
        err('site/brand', 'the accent is out of date on some pages — run php tools/head-brand.php ' . $subject);
    } else {
        preg_match('~base:\s*"(#[0-9a-fA-F]{3,8})"~', file_get_contents($site . '/assets/subject.js'), $bm);
        done('site/brand', ($bm[1] ?? '?') . ' light, current on all ' . count($pages) . ' pages');
    }
}

/* ------------------------------------------------------------- report ---- */
$w = 26;
echo "\n";
foreach ($checks as $name => $note) {
    $hasError = (bool) array_filter($errors, static fn ($e) => $e[0] === $name);
    echo ($hasError ? '  FAIL  ' : '  ok    ') . str_pad($name, $w) . $note . "\n";
}

if ($warnings) {
    echo "\n";
    foreach ($warnings as [$check, $msg]) { echo "  WARN  {$check}: {$msg}\n"; }
}
if ($errors) {
    echo "\n";
    foreach ($errors as [$check, $msg]) { echo "  ERROR {$check}: {$msg}\n"; }
}

$e = count($errors); $n = count($warnings);
echo "\n" . ($e === 0
    ? "  {$e} errors, {$n} warnings — gate passed\n\n"
    : "  {$e} errors, {$n} warnings — gate FAILED\n\n");

exit($e === 0 ? 0 : 1);
