<?php declare(strict_types=1);

/* ============================================================================
   lib/rules.php — reading the Golden rules out of the chapters.

   The chapters are the only hand-authored source of a rule in this repository.
   Three things downstream need to read them:

     tools/viva-extract.php   → course/GOLDEN-RULES.md
     tools/module-cards.php   → part 4 of each deep-course module
     (anything else later)

   They share this file rather than each growing their own regex, because three
   slightly different parsers of the same markup is exactly how the copies start
   disagreeing — which is the failure this whole pipeline exists to avoid.

   Nothing here writes anything. It reads chapters and returns data.
   ============================================================================ */

/**
 * Chapter HTML → the markdown subset viva.js's md() understands: `code` and
 * **bold**. Everything else becomes plain text, because md() escapes first and
 * then re-introduces only those forms — so any tag left here would be shown to
 * the learner as literal angle brackets.
 */
function rules_to_markdown(string $html): string
{
    $s = preg_replace('~<code>(.*?)</code>~s', '`$1`', $html);
    $s = preg_replace('~</?em>~', '', $s);          // md() has no italic form
    $s = preg_replace('~</?strong>~', '', $s);      // the caller adds the ** itself
    $s = strip_tags($s);
    $s = html_entity_decode($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $s = preg_replace('~\s+~u', ' ', $s);
    return trim($s);
}

/**
 * The spaced-repetition key, derived from the claim text so that reordering the
 * deck costs nothing and rewording a rule resets that one card.
 */
function rules_slug(string $claim): string
{
    $s = str_replace('`', '', $claim);
    $s = mb_strtolower($s, 'UTF-8');
    $s = preg_replace('~[^a-z0-9]+~u', '-', $s);
    $s = trim($s, '-');
    if (mb_strlen($s) > 70) {
        $s = mb_substr($s, 0, 70);
        $s = preg_replace('~-[^-]*$~', '', $s);     // never cut mid-word
    }
    return $s;
}

/**
 * The chapter manifest, read from the same chapters.js the site's sidebar uses,
 * so headings and `part` labels cannot drift from what the learner sees.
 *
 * @return list<array{n:string,id:string,part:string,title:string}>
 */
function rules_chapters(string $root, string $subject): array
{
    $path = "{$root}/subjects/{$subject}/site/assets/chapters.js";
    if (!file_exists($path)) {
        throw new RuntimeException("no chapters.js for subject: {$subject}");
    }
    $manifest = file_get_contents($path);

    preg_match('~const PARTS = \[(.*?)\];~s', $manifest, $pm);
    preg_match_all('~"([^"]*)"~', $pm[1] ?? '', $partNames);
    $parts = $partNames[1];

    preg_match_all(
        '~\{\s*n:\s*"([^"]*)",\s*id:\s*"([^"]*)",\s*part:\s*PARTS\[(\d+)\],\s*\n\s*title:\s*"([^"]*)"~',
        $manifest, $m, PREG_SET_ORDER
    );

    $chapters = [];
    foreach ($m as $c) {
        $chapters[] = ['n' => $c[1], 'id' => $c[2], 'part' => $parts[(int) $c[3]] ?? '', 'title' => $c[4]];
    }
    if (!$chapters) {
        throw new RuntimeException("could not parse chapters.js for subject: {$subject}");
    }
    return $chapters;
}

/**
 * Every Golden rule in the subject, keyed by slug, in chapter order.
 *
 * A claim restated in a later chapter is one rule that two chapters earn, not two
 * cards asking the same question: it is merged, and `refs` accumulates.
 *
 * @return array<string, array{slug:string,claim:string,why:string,chapter:string,
 *                             id:string,title:string,part:string,
 *                             refs:list<array{n:string,id:string}>}>
 */
function rules_read(string $root, string $subject): array
{
    $site  = "{$root}/subjects/{$subject}/site";
    $rules = [];

    foreach (rules_chapters($root, $subject) as $ch) {
        $html = @file_get_contents("{$site}/chapters/{$ch['id']}.html");
        if ($html === false) { continue; }
        if (!preg_match('~<div class="rules">(.*?)</ul>~s', $html, $block)) { continue; }
        preg_match_all('~<li>(.*?)</li>~s', $block[1], $items, PREG_SET_ORDER);

        foreach ($items as $li) {
            if (!preg_match('~^\s*<strong>(.*?)</strong>(.*)$~s', $li[1], $parts)) {
                fwrite(STDERR, "  skipped a rule with no leading <strong> in {$ch['id']}\n");
                continue;
            }
            $claim = rules_to_markdown($parts[1]);
            $why   = rules_to_markdown($parts[2]);

            /* A leading dash is the chapter's typography joining claim to reason; the
               deck renders the two separately, so it would show up as a stray glyph. */
            $why = trim(preg_replace('~^[\x{2014}\x{2013}-]\s*~u', '', $why));

            /* A why that opens with a comma or semicolon is the same sentence carrying
               on. The engine joins claim and why with a bare space, so that punctuation
               has to travel with the claim or the card reads "the first call , as a
               range". It also tells the deck the claim is a fragment. */
            if (preg_match('~^([,;:])\s*(.*)$~s', $why, $lead)) {
                $claim .= $lead[1];
                $why    = trim($lead[2]);
            }

            $slug = rules_slug($claim);
            if (isset($rules[$slug])) {
                $rules[$slug]['refs'][] = ['n' => $ch['n'], 'id' => $ch['id']];
                if ($rules[$slug]['why'] === '') { $rules[$slug]['why'] = $why; }
                continue;
            }

            $rules[$slug] = [
                'slug'    => $slug,
                'claim'   => $claim,
                'why'     => $why,
                'chapter' => $ch['n'],
                'id'      => $ch['id'],
                'title'   => $ch['title'],
                'part'    => $ch['part'],
                'refs'    => [['n' => $ch['n'], 'id' => $ch['id']]],
            ];
        }
    }

    return $rules;
}
