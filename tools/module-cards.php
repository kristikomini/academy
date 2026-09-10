<?php declare(strict_types=1);

/* ============================================================================
   module-cards.php — fills part 4 ("Golden rules") of every deep-course module.

   Blueprint §3.6 says part 4 of a module is "the card": the module compressed
   into a dozen sentences. In this subject those sentences already exist, in the
   `.rules` block of the site chapters the module covers — so hand-copying them
   into 28 module READMEs would create a third copy of every rule, drifting from
   the chapter and from GOLDEN-RULES.md the moment anyone edits one.

   Instead each module README declares which chapters its card is built from:

       <!-- CARD:03,07 -->
       ...anything here is overwritten...
       <!-- /CARD -->

   and this tool fills the block. The prose around it is hand-written; the card
   is generated. Run it after editing a chapter's rules, and after adding a module.

   Usage:
     php tools/module-cards.php <subject>            rewrite the cards
     php tools/module-cards.php <subject> --check    fail if any card is stale (CI)
   ============================================================================ */

require __DIR__ . '/lib/rules.php';

$root     = dirname(__DIR__);
$subject  = null;
$checkOnly = in_array('--check', $argv, true);
foreach (array_slice($argv, 1) as $a) { if (!str_starts_with($a, '--')) { $subject = $a; } }

if ($subject === null) {
    fwrite(STDERR, "usage: php tools/module-cards.php <subject> [--check]\n");
    exit(2);
}

$courseDir = "{$root}/subjects/{$subject}/course";
if (!is_dir($courseDir)) { fwrite(STDERR, "no course/ for subject: {$subject}\n"); exit(2); }

$rules = rules_read($root, $subject);

/** Every rule belonging to one chapter number, in the order the chapter states them. */
function cardFor(array $rules, array $wantChapters): array
{
    $out = [];
    foreach ($wantChapters as $want) {
        foreach ($rules as $r) {
            foreach ($r['refs'] as $ref) {
                if ($ref['n'] === $want) { $out[$want][] = $r; break; }
            }
        }
    }
    return $out;
}

$readmes = glob("{$courseDir}/module-*/README.md");
sort($readmes);

if (!$readmes) {
    echo "  {$subject}: no module READMEs yet — nothing to fill\n";
    exit(0);
}

$stale = [];
$filled = 0;
$cards  = 0;

foreach ($readmes as $path) {
    $text = file_get_contents($path);
    $name = basename(dirname($path));

    /* Line endings are not cosmetic here. These files get edited on Windows by
       editors and scripts that write CRLF, so a pattern anchored to a bare \n
       silently matches nothing and the tool cheerfully reports "already current".
       Match either, and write back whichever the file already uses. */
    $nl = str_contains($text, "\r\n") ? "\r\n" : "\n";

    $updated = preg_replace_callback(
        '~(<!-- CARD:([0-9,\s]+) -->\r?\n)(.*?)(<!-- /CARD -->)~s',
        function (array $m) use ($rules, $name, $nl, &$cards, &$stale) {
            $cards++;
            $want = array_map('trim', explode(',', $m[2]));
            $byChapter = cardFor($rules, $want);

            $lines = [];
            foreach ($want as $chapter) {
                $list = $byChapter[$chapter] ?? [];
                if (!$list) {
                    fwrite(STDERR, "  WARNING: {$name} asks for chapter {$chapter}, which has no rules\n");
                    continue;
                }
                if ($lines) { $lines[] = ""; }   // a blank line between chapters
                $title = $list[0]['title'];
                /* The chapter's own number and title, so the card says where each
                   half of it came from when a module covers more than one. */
                $lines[] = "**Chapter {$chapter} — {$title}**";
                $lines[] = "";
                $i = 1;
                foreach ($list as $r) {
                    $line = "{$i}. **{$r['claim']}**";
                    if ($r['why'] !== '') { $line .= " {$r['why']}"; }
                    $lines[] = $line;
                    $i++;
                }
            }

            return $m[1] . implode($nl, $lines) . $nl . $m[4];
        },
        $text
    );

    if ($updated === null) {
        fwrite(STDERR, "  regex failed on {$path}\n");
        exit(1);
    }

    if ($updated !== $text) {
        $stale[] = $name;
        if (!$checkOnly) { file_put_contents($path, $updated); $filled++; }
    }
}

if ($checkOnly) {
    if ($stale) {
        fwrite(STDERR, "  {$subject}: " . count($stale) . " module card(s) out of date with the chapters:\n");
        foreach ($stale as $n) { fwrite(STDERR, "    {$n}\n"); }
        fwrite(STDERR, "  run: php tools/module-cards.php {$subject}\n");
        exit(1);
    }
    echo "  {$subject}: {$cards} module card(s), all current\n";
    exit(0);
}

echo "  {$subject}: {$cards} card(s) across " . count($readmes) . " module(s)"
   . ($filled ? ", {$filled} rewritten" : ", already current") . "\n";
