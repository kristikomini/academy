/* ==========================================================================
   glossary.js — two kinds of word, and they are different problems.

   1. TECHNICAL terms that stay English inside an Italian sentence. The trap
      here is not the English ones — it is the handful that ARE translated
      (collaudo, avvio in produzione, presa in carico) and that you will not
      recognise if you only ever read English documentation.

   2. PROCESS and CONTRACT terms that are entirely Italian, appear in every
      advert and every first phone call, and are where a technically strong
      candidate loses an interview to somebody who knows what RAL means.

   Fields: en · it · cat (grouping) · where (chapter number) · def

   STATUS: CATEGORIES ONLY. The term list is empty and that is deliberate.

   The contract and process vocabulary (RAL, CCNL, colloquio conoscitivo,
   presa in carico) is genuinely identical across subjects and could be lifted
   from the PHP academy — but its `where` fields point at PHP chapter numbers,
   and a glossary whose cross-references are silently wrong is precisely the rot
   tools/doctor.php exists to prevent. It gets copied when the numbers are
   remapped, not before.
   ========================================================================== */

window.GLOSSARY_CATEGORIES = [
  "Contract and pay",
  "The hiring process",
  "The working day",
  "The project",
  "Technical — the words that get translated",
  "Technical — Kafka and streaming",
  "Technical — data",
];

window.GLOSSARY = [];
