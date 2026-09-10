<?php declare(strict_types=1);

/* ============================================================================
   viva-deck.php — course/GOLDEN-RULES.md → site/assets/rules.js

   The Academy port of Desktop/C#/tools/viva-deck.cs. Same contract, same output
   shape, because both feed the same engine/viva.js: one object per Golden rule,
   `id` derived from the claim text so that reordering the deck costs nothing and
   rewording a rule resets that one card.

   Two differences from the C# generator, both forced by this subject's material:

   1. Every rule gets an `href`. viva.js prefers `href` over `refs` when it tells
      you where to go back to, and its `refs` branch says "Module N in course/" —
      wording inherited from a subject whose course really is modules. These
      subjects have chapters, so pointing straight at the chapter file is both
      accurate and more useful than a number.

   2. Far more `complete` cards. 75 of the rules here state themselves fully and
      the chapter adds no separate justification. An "explain" card for one of
      those would reveal nothing on the back, and a card you cannot mark yourself
      against is where self-marking drifts generous — which is the exact reason
      the `complete` kind exists.

   Usage: php tools/viva-deck.php <subject>
   ============================================================================ */

$root    = dirname(__DIR__);
$subject = $argv[1] ?? null;
if ($subject === null) { fwrite(STDERR, "usage: php tools/viva-deck.php <subject>\n"); exit(2); }

$mdPath = "{$root}/subjects/{$subject}/course/GOLDEN-RULES.md";
if (!file_exists($mdPath)) {
    fwrite(STDERR, "no GOLDEN-RULES.md for {$subject} — run tools/viva-extract.php first\n");
    exit(2);
}

/* ------------------------------------------------------------- the stem ---- */

/**
 * Where to cut a self-contained rule so that finishing it is a real recall test.
 *
 * Prefer a clause boundary — a rule written as "X; Y" or "X, Y" already tells you
 * where its two halves are. Failing that, cut at half the words. Returns null when
 * the claim is too short to hide anything, in which case the caller keeps it as an
 * explain card rather than shipping a card whose prompt is most of its answer.
 */
function stem(string $claim): ?string
{
    $words = preg_split('~\s+~u', $claim);
    if (count($words) < 4) { return null; }

    foreach ([';', ':', ','] as $mark) {
        $offset = 0;
        while (($at = mb_strpos($claim, $mark . ' ', $offset)) !== false) {
            $head = mb_substr($claim, 0, $at + 1);
            $tail = trim(mb_substr($claim, $at + 1));
            $hw   = count(preg_split('~\s+~u', trim($head)));
            $tw   = count(preg_split('~\s+~u', $tail));
            if ($hw >= 2 && $tw >= 2) { return trim($head); }
            $offset = $at + 1;
        }
    }

    $keep = (int) ceil(count($words) / 2);
    if (count($words) - $keep < 2) { $keep = count($words) - 2; }
    if ($keep < 1) { return null; }
    /* A stem ending on the opening half of a code span would show a stray
       backtick, so pull back to the last word that closes what it opens. */
    while ($keep > 1 && substr_count(implode(' ', array_slice($words, 0, $keep)), '`') % 2 !== 0) {
        $keep--;
    }
    return rtrim(implode(' ', array_slice($words, 0, $keep)), ' .');
}

/** The rule's own terms, for the literal "did you actually say it" check. */
function checkpoints(string $claim, string $why): array
{
    preg_match_all('~`([^`]+)`~u', $claim . ' ' . $why, $m);
    $out = [];
    foreach ($m[1] as $t) {
        $t = trim($t);
        if ($t !== '' && !in_array($t, $out, true)) { $out[] = $t; }
    }
    return array_slice($out, 0, 6);
}

/* ------------------------------------------------------------- the parse --- */

$lines   = explode("\n", file_get_contents($mdPath));
$deck    = [];
$section = null;                 // ['tier' => ..., 'part' => ..., 'module' => ..., 'href' => ...]
$seenIds = [];

$RULE = '~^\d+\.\s+\*\*(.+?)\*\*\s*(.*?)\s+—\s+((?:\[[^\]]*\]\([^)]*\)(?:\s*·\s*)?)+)$~u';

foreach ($lines as $ln => $line) {
    if (str_starts_with($line, '## ')) {
        $h = trim(mb_substr($line, 3));
        if (str_contains($h, 'twelve that decide')) {
            $section = ['tier' => 'twelve', 'part' => $h, 'module' => '', 'prefix' => 't12-'];
        } elseif (str_contains($h, 'separate a senior')) {
            $section = ['tier' => 'senior', 'part' => $h, 'module' => '', 'prefix' => 's6-'];
        } elseif (preg_match('~^\[Chapter (\S+) — (.+?)\]\(~u', $h, $c)) {
            $section = ['tier' => 'module', 'part' => "Chapter {$c[1]} — {$c[2]}",
                        'module' => $c[1], 'prefix' => 'm' . $c[1] . '-'];
        } else {
            $section = null;
        }
        continue;
    }

    if (!preg_match($RULE, $line, $m)) { continue; }
    if ($section === null) {
        fwrite(STDERR, "  line " . ($ln + 1) . ": a rule outside any section — skipped\n");
        continue;
    }

    $claim = trim($m[1]);
    $why   = trim($m[2]);

    preg_match_all('~\[([^\]]*)\]\(([^)]*)\)~', $m[3], $links, PREG_SET_ORDER);
    $refs = [];
    $href = '';
    foreach ($links as $i => $l) {
        $refs[] = $l[1];
        /* The markdown links out of course/, the engine reads paths from the
           subject root — so ../site/x becomes site/x. */
        if ($i === 0) { $href = preg_replace('~^\.\./~', '', $l[2]); }
    }

    /* A claim that does not close its own sentence is finished by the why; viva.js
       shows an ellipsis after it so the prompt does not read like a fragment. */
    $continues = $why !== '' && !preg_match('~[.?!]$~u', $claim);

    $rule = [
        'id'     => $section['prefix'] . preg_replace('~[^a-z0-9]+~', '-',
                        trim(mb_strtolower(str_replace('`', '', $claim), 'UTF-8'))),
        'kind'   => 'explain',
        'tier'   => $section['tier'],
        'module' => $section['module'],
        'part'   => $section['part'],
        'href'   => $href,
        'claim'  => $claim,
        'why'    => $why,
    ];
    $rule['id'] = rtrim($rule['id'], '-');

    if ($why === '') {
        $s = stem($claim);
        if ($s !== null) { $rule['kind'] = 'complete'; $rule['stem'] = $s; }
    }

    $rule['continues']   = $continues;
    $cp                  = checkpoints($claim, $why);
    if ($cp) { $rule['checkpoints'] = $cp; }
    $rule['refs']        = $refs;

    /* Two rules sharing an id would silently share one card's review schedule. */
    if (isset($seenIds[$rule['id']])) {
        fwrite(STDERR, "  DUPLICATE id {$rule['id']} — second occurrence skipped\n");
        continue;
    }
    $seenIds[$rule['id']] = true;

    $deck[] = $rule;
}

/* ------------------------------------------------------------- the checks -- */
/* The deck is the one artefact nobody proof-reads, because it is generated and
   367 cards long. These are the failures that would otherwise reach a session. */

$errors = [];
foreach ($deck as $r) {
    if ($r['kind'] === 'explain' && $r['why'] === '') {
        $errors[] = "{$r['id']}: explain card with nothing on the back";
    }
    if ($r['kind'] === 'complete' && ($r['stem'] ?? '') === '') {
        $errors[] = "{$r['id']}: complete card with no stem";
    }
    if ($r['kind'] === 'complete' && mb_strlen($r['stem']) >= mb_strlen($r['claim'])) {
        $errors[] = "{$r['id']}: the stem gives away the whole claim";
    }
    /* md() turns paired backticks into <code>. An odd one reaches the screen as a
       literal backtick, and on a `complete` card the stem is cut by a generator
       rather than written by hand — so it is the likeliest place for that. */
    foreach (['claim' => $r['claim'], 'why' => $r['why'], 'stem' => $r['stem'] ?? ''] as $field => $text) {
        if (substr_count($text, '`') % 2 !== 0) {
            $errors[] = "{$r['id']}: unbalanced backtick in the {$field}";
        }
    }
    /* An angle bracket is fine: viva.js escapes the text before re-introducing
       its own markup, so `List<String>` reaches the screen intact. An *entity*
       is the bug — it survives escaping and the learner reads "&lt;". This is
       the same failure that put `<code>` tags in the first thirty quiz
       questions, so it is checked here rather than left to a browser. */
    if (preg_match('~&(?:[a-z]+|#\d+);~i', $r['claim'] . $r['why'], $ent)) {
        $errors[] = "{$r['id']}: undecoded HTML entity {$ent[0]} — it would show literally";
    }
}
$tiers = ['twelve' => 0, 'senior' => 0, 'module' => 0];
foreach ($deck as $r) { $tiers[$r['tier']]++; }
if ($tiers['twelve'] !== 12) { $errors[] = "the twelve has {$tiers['twelve']} rules"; }
if ($tiers['senior'] !== 6)  { $errors[] = "the six has {$tiers['senior']} rules"; }

if ($errors) {
    fwrite(STDERR, "\n  {$subject}: deck NOT written —\n");
    foreach ($errors as $e) { fwrite(STDERR, "    {$e}\n"); }
    exit(1);
}

/* -------------------------------------------------------------- the write -- */

$header = <<<JS
/* ==========================================================================
   rules.js — the viva deck. GENERATED FILE, DO NOT EDIT.

   Source:      course/GOLDEN-RULES.md
   Regenerate:  php tools/viva-extract.php {$subject} && php tools/viva-deck.php {$subject}

   One card per Golden rule. `kind` is "explain" (say why the claim is true)
   or "complete" (finish the sentence), the second being for the rules the
   course states without a written justification — there has to be something
   on paper to mark yourself against, or self-marking drifts generous.

   `id` is the spaced-repetition key. It is derived from the claim text, so
   reordering the rules costs nothing and rewording one resets that card only.

   The chain starts at the chapters, not here: the `.rules` block of each
   chapter is the only place a rule is written by hand.
   ========================================================================== */
window.RULES =
JS;

$json = json_encode($deck, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
file_put_contents("{$root}/subjects/{$subject}/site/assets/rules.js", $header . ' ' . $json . ";\n");

$complete = 0;
foreach ($deck as $r) { if ($r['kind'] === 'complete') { $complete++; } }
echo "  {$subject}: " . count($deck) . " cards → site/assets/rules.js"
   . "  (twelve {$tiers['twelve']}, senior {$tiers['senior']}, chapters {$tiers['module']}"
   . "; {$complete} complete, " . (count($deck) - $complete) . " explain)\n";
