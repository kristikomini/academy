<?php declare(strict_types=1);

/* ============================================================================
   viva-extract.php — chapters → course/GOLDEN-RULES.md

   WHY THIS TOOL EXISTS, AND WHY IT RUNS BACKWARDS TO THE BLUEPRINT.

   Blueprint §3.4 has GOLDEN-RULES.md as the authored artefact and site/assets/
   rules.js generated from it. That assumes the deep course (phase 5) was written
   first, which is how the C# subject was built.

   Here the chapters came first. Every chapter already carries a `.rules` block —
   292 rules in java, 275 in kafka — written as:

       <li><strong>claim</strong> why</li>

   which is exactly the claim/why pair the viva deck needs. Hand-writing them a
   second time into GOLDEN-RULES.md would create two copies of the same sentence
   that drift apart, which is the failure this repository's whole gate exists to
   prevent. So the chapters are the source of truth and this tool derives the
   markdown from them.

   The blueprint's contract is otherwise preserved: GOLDEN-RULES.md remains the
   input to viva-deck.php, and rules.js is still never hand-edited.

   TIERS. Which rules are "the twelve that decide interviews" and which are "the
   six that separate a senior candidate" is an editorial judgement that cannot be
   extracted. It lives in subjects/<subject>/course/viva-tiers.json, keyed by the
   rule's slug. Run with --candidates to print every slug with its chapter.

   Usage:
     php tools/viva-extract.php <subject>                 write GOLDEN-RULES.md
     php tools/viva-extract.php <subject> --candidates    list slugs, write nothing
   ============================================================================ */

$root    = dirname(__DIR__);
$subject = null;
$listOnly = in_array('--candidates', $argv, true);
foreach (array_slice($argv, 1) as $a) { if (!str_starts_with($a, '--')) { $subject = $a; } }

if ($subject === null) { fwrite(STDERR, "usage: php tools/viva-extract.php <subject> [--candidates]\n"); exit(2); }
$site = "{$root}/subjects/{$subject}/site";
if (!is_dir($site)) { fwrite(STDERR, "no such subject: {$subject}\n"); exit(2); }

require __DIR__ . '/lib/rules.php';

/* Reading the chapters is shared with tools/module-cards.php — see lib/rules.php
   for why that is one file rather than two nearly-identical regexes. */
$chapters = rules_chapters($root, $subject);
$rules    = rules_read($root, $subject);

/* ---------------------------------------------------------------- helpers -- */

/** One numbered markdown entry: claim in bold, reason in plain text, then the
 *  chapters that earn it. viva-deck.php parses exactly this shape back. */
function ruleLine(int $i, array $r): string
{
    $line = "{$i}. **{$r['claim']}**";
    if ($r['why'] !== '') { $line .= " {$r['why']}"; }
    $links = [];
    foreach ($r['refs'] as $ref) { $links[] = "[{$ref['n']}](../site/chapters/{$ref['id']}.html)"; }
    return $line . ' — ' . implode(' · ', $links);
}

if ($listOnly) {
    foreach ($rules as $r) {
        printf("%-4s %-72s %s\n", $r['chapter'], $r['slug'], mb_substr($r['claim'], 0, 60));
    }
    fwrite(STDERR, "\n  " . count($rules) . " rules across " . count($chapters) . " chapters\n");
    exit(0);
}

/* ------------------------------------------------------------- the tiers --- */

$tierFile = "{$root}/subjects/{$subject}/course/viva-tiers.json";
$tiers = ['twelve' => [], 'senior' => []];
if (file_exists($tierFile)) {
    $decoded = json_decode(file_get_contents($tierFile), true);
    if (is_array($decoded)) { $tiers = $decoded + $tiers; }
} else {
    fwrite(STDERR, "  note: {$tierFile} not found — every rule will be tier \"module\"\n");
}

/* Walk the tier lists, not the rules, so the order in viva-tiers.json is the
   order the learner meets them in. Chapter order is not rehearsal order. */
$byTier = [];
$seen   = [];
foreach (['twelve', 'senior'] as $t) {
    foreach ($tiers[$t] as $slug) {
        /* A tier entry naming a rule that no longer exists is a silent hole in
           the deck: it quietly reverts to "module" and the twelve becomes eleven. */
        if (!isset($rules[$slug])) {
            fwrite(STDERR, "  WARNING: tier '{$t}' names a rule that no longer exists: {$slug}
");
            continue;
        }
        if (isset($seen[$slug])) { continue; }
        $byTier[$t][] = $rules[$slug];
        $seen[$slug]  = true;
    }
}

/* --------------------------------------------------------------- emit md --- */

$promoted = [];
foreach (['twelve', 'senior'] as $t) {
    foreach ($byTier[$t] ?? [] as $r) { $promoted[$r['slug']] = true; }
}

$out = [];
$out[] = "# Golden rules — the whole course on one page";
$out[] = "";
$out[] = "**GENERATED FILE.** Written by `tools/viva-extract.php` from the `.rules` block of";
$out[] = "every chapter, and read by `tools/viva-deck.php` to produce `site/assets/rules.js`.";
$out[] = "Edit the chapter, not this file.";
$out[] = "";
$out[] = "Blueprint §3.4 has this file authored by hand and the chapters referring to it. In this";
$out[] = "subject the chapters were written first, so the arrow runs the other way — but the";
$out[] = "principle it protects is the same one: the rule exists in exactly one place, and";
$out[] = "everything downstream is derived from it.";
$out[] = "";
$out[] = "The tiers below come from `course/viva-tiers.json`, which is the one part of this";
$out[] = "document that is an editorial judgement rather than an extraction.";
$out[] = "";

$sections = [
    ['twelve', 'The twelve that decide interviews',
     'If you only rehearse twelve, rehearse these. Each links to the chapter that earns it.'],
    ['senior', 'The six that separate a senior candidate',
     'Not harder, but the ones that show you have operated something rather than only built it.'],
];

foreach ($sections as [$key, $heading, $lede]) {
    $list = $byTier[$key] ?? [];
    if (!$list) { continue; }
    $out[] = "## {$heading}";
    $out[] = "";
    $out[] = $lede;
    $out[] = "";
    $i = 1;
    foreach ($list as $r) { $out[] = ruleLine($i++, $r); }
    $out[] = "";
}

$currentChapter = null;
foreach ($rules as $r) {
    if (isset($promoted[$r['slug']])) { continue; }   // already listed above
    if ($r['chapter'] !== $currentChapter) {
        $currentChapter = $r['chapter'];
        $out[] = "## [Chapter {$r['chapter']} — {$r['title']}](../site/chapters/{$r['id']}.html)";
        $out[] = "";
        $out[] = "*{$r['part']}*";
        $out[] = "";
        $i = 1;
    }
    $out[] = ruleLine($i++, $r);
}

/* Re-walk to insert the blank line between a chapter's last rule and the next
   heading, which the single pass above cannot know about in advance. */
$final = [];
foreach ($out as $idx => $line) {
    if (str_starts_with($line, '## ') && $idx > 0 && $final && end($final) !== '') { $final[] = ''; }
    $final[] = $line;
}
$final[] = '';

$path = "{$root}/subjects/{$subject}/course/GOLDEN-RULES.md";
if (!is_dir(dirname($path))) { mkdir(dirname($path), 0777, true); }
file_put_contents($path, implode("\n", $final));

$counts = ['twelve' => count($byTier['twelve'] ?? []), 'senior' => count($byTier['senior'] ?? [])];
$module = count($rules) - $counts['twelve'] - $counts['senior'];
echo "  {$subject}: " . count($rules) . " rules → course/GOLDEN-RULES.md"
   . "  (twelve {$counts['twelve']}, senior {$counts['senior']}, module {$module})\n";
