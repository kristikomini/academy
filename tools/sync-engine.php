<?php declare(strict_types=1);

/* ============================================================================
   sync-engine.php — one engine, many subjects.

   THE PROBLEM THIS SOLVES. The learning engine is genuinely subject-independent
   — diffing the C# and PHP copies after normalising the brand name gave ZERO
   differing lines across eleven files. So every subject wants the same engine,
   and the obvious answers are both wrong:

     * A shared folder referenced by relative path breaks the property the whole
       design rests on: each site must be openable from file:// and deployable
       on its own, with no build step.
     * Independent copies drift. Silently, and in the direction of whichever
       subject you happened to be working on that week.

   So: /engine is the single source of truth, this script copies it into each
   subject, and tools/doctor.php FAILS when a subject's copy no longer matches.
   Drift becomes an error instead of a discovery.

   Usage:
     php tools/sync-engine.php            copy the engine into every subject
     php tools/sync-engine.php --check    report drift, change nothing (exit 1)
     php tools/sync-engine.php php        one subject only
   ============================================================================ */

$root    = dirname(__DIR__);
$engine  = $root . '/engine';
$check   = in_array('--check', $argv, true);
$only    = null;
foreach (array_slice($argv, 1) as $a) {
    if (!str_starts_with($a, '--')) { $only = $a; }
}

/* The engine's own files. Anything NOT in here is subject-owned and is never
   touched: chapters.js, quizzes-*.js, glossary.js, italiano.js, subject.js,
   every chapter page, and every top-level page's prose. */
$ENGINE_FILES = [
    'assets/store.js',
    'assets/site.js',
    'assets/quiz.js',
    'assets/learn.js',
    'assets/viva.js',
    'assets/simulate.js',
    'assets/notes.js',
    'assets/account.js',
    'assets/auth-page.js',
    'assets/cv.js',
    'assets/italiano-panel.js',
    'assets/style.css',
    'assets/learn.css',
    'sw.js',
];

$subjects = array_values(array_filter(
    scandir($root . '/subjects'),
    static fn ($d) => $d[0] !== '.' && is_dir($root . '/subjects/' . $d)
));
if ($only !== null) {
    if (!in_array($only, $subjects, true)) {
        fwrite(STDERR, "unknown subject: {$only}\n");
        exit(2);
    }
    $subjects = [$only];
}

$drift = 0;
$copied = 0;

foreach ($subjects as $s) {
    $site = "{$root}/subjects/{$s}/site";
    if (!is_dir($site)) { continue; }
    echo "  {$s}\n";

    foreach ($ENGINE_FILES as $rel) {
        $src = $engine . '/' . basename($rel);
        $dst = $site . '/' . $rel;

        if (!file_exists($src)) {
            fwrite(STDERR, "    MISSING in /engine: " . basename($rel) . "\n");
            $drift++;
            continue;
        }

        $same = file_exists($dst) && md5_file($src) === md5_file($dst);
        if ($same) { continue; }

        if ($check) {
            echo "    DRIFT  {$rel}" . (file_exists($dst) ? '' : '  (absent)') . "\n";
            $drift++;
        } else {
            if (!is_dir(dirname($dst))) { mkdir(dirname($dst), 0777, true); }
            copy($src, $dst);
            echo "    sync   {$rel}\n";
            $copied++;
        }
    }
}

if ($check) {
    echo "\n" . ($drift === 0
        ? "  engine in sync across " . count($subjects) . " subject(s)\n"
        : "  {$drift} file(s) out of sync — run: php tools/sync-engine.php\n");
    exit($drift === 0 ? 0 : 1);
}

echo "\n  " . ($copied === 0 ? 'already in sync' : "{$copied} file(s) synced") . "\n";
exit($drift === 0 ? 0 : 1);
