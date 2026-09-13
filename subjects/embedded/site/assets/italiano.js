/* ==========================================================================
   italiano.js -- the language layer.

   Two banks:
     IT_PHRASES   situational phrases, grouped. Rendered whole on italiano.html.
     IT_CHAPTERS  keyed by chapter id: one or two lines you would actually say
                  about that topic, plus the terms that STAY IN ENGLISH.

   The single most important rule in this file: technical nouns are not
   translated. Italian engineers say "il firmware", "il buffer", "l'interrupt",
   "il timer", "fare il flash", "il debug". Saying "il programma interno" or
   "la memoria tampone" is textbook Italian and marks you instantly as somebody
   who learned the vocabulary from a book rather than from a lab. The `keep`
   array on each chapter is the list of words to leave alone.

   The opposite trap is bigger in this subject than in any other, because the
   shop floor DOES translate: scheda, morsettiera, quadro elettrico, cablaggio,
   collaudo, messa in servizio, fermo impianto. Those are Italian words for
   things you will be asked about in Italian, and no English datasheet contains
   them.

   COVERAGE IS DELIBERATELY PARTIAL. The panel simply does not appear on
   chapters with no entry. A half-written translation teaches a sentence you
   would not want to say in a room.

   STATUS: EMPTY. Both banks are empty, so no chapter shows the Italian panel
   yet. That is the correct failure mode for this file and the reason coverage
   was designed to be partial in the first place.
   ========================================================================== */

window.IT_PHRASES = [];

window.IT_CHAPTERS = {};
