/* ==========================================================================
   italiano.js — the language layer.

   Two banks:
     IT_PHRASES   situational phrases, grouped. Rendered whole on italiano.html.
     IT_CHAPTERS  keyed by chapter id: one or two lines you would actually say
                  about that topic, plus the terms that STAY IN ENGLISH.

   The single most important rule in this file: technical nouns are not
   translated. Italian developers say "la query", "il deploy", "fare il merge",
   "il branch", "la cache". Saying "l'interrogazione" or "il ramo" is textbook
   Italian and marks you instantly as someone who learned the vocabulary from a
   book rather than from an office. The `keep` array on each chapter is the list
   of words to leave alone.

   The opposite trap is the process vocabulary, which IS fully Italian and which
   no technical course teaches: collaudo, presa in carico, avviamento,
   scadenza, consegna. Those are in the glossary and they are where a
   technically strong candidate loses a first phone call.

   COVERAGE IS DELIBERATELY PARTIAL. The panel simply does not appear on
   chapters with no entry. A half-written translation teaches a sentence you
   would not want to say in a room.

   STATUS: EMPTY. Both banks are empty, so no chapter shows the Italian panel
   yet. That is the correct failure mode for this file and the reason coverage
   was designed to be partial in the first place.
   ========================================================================== */

window.IT_PHRASES = [];

window.IT_CHAPTERS = {};
