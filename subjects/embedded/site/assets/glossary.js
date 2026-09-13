/* ==========================================================================
   glossary.js -- two kinds of word, and they are different problems.

   1. TECHNICAL terms that stay English inside an Italian sentence. In this
      subject almost all of them do: an Italian firmware engineer says "il
      firmware", "il buffer", "l'interrupt", "fare il flash". The trap is the
      handful that ARE translated and that you will not recognise if you only
      ever read English datasheets -- collaudo, messa in servizio, scheda,
      morsettiera, quadro elettrico.

   2. PROCESS and CONTRACT terms that are entirely Italian, appear in every
      advert and every first phone call, and are where a technically strong
      candidate loses an interview to somebody who knows what RAL means.

   Fields: en - it - cat (grouping) - where (chapter number) - def

   STATUS: CATEGORIES ONLY. The term list is empty and that is deliberate.

   The contract and process vocabulary (RAL, CCNL, colloquio conoscitivo,
   presa in carico) is genuinely identical across subjects and could be lifted
   from another academy -- but its `where` fields point at that subject's
   chapter numbers, and a glossary whose cross-references are silently wrong is
   precisely the rot tools/doctor.php exists to prevent. It gets copied when
   the numbers are remapped, not before.

   The industrial half of this glossary has no equivalent anywhere in the
   Academy and has to be written from scratch: the shop-floor vocabulary
   (quadro, morsettiera, bordo macchina, fermo impianto, collaudo) is the part
   that will actually be spoken at you in Formigine.
   ========================================================================== */

window.GLOSSARY_CATEGORIES = [
  "Contract and pay",
  "The hiring process",
  "The working day",
  "The project",
  "Technical - the words that get translated",
  "Technical - firmware and the toolchain",
  "Technical - the shop floor",
];

window.GLOSSARY = [];
