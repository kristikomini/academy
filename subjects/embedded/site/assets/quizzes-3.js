/* ==========================================================================
   quizzes-3.js -- the question bank.

   Split across three files only so each stays editable. All three merge into
   one map keyed by chapter id.

   THE RULE THAT IS NOT NEGOTIABLE:
   A question's id is "<chapter-id>#<index>", and the index is its position in
   this array. That id is the key a learner's spaced-repetition schedule is
   stored under. APPEND ONLY. Never reorder, never delete. Reordering silently
   reassigns somebody's review history to the wrong questions, and nothing will
   tell you it happened. quiz-ids.lock exists to catch exactly this.

   `why` is shown on CORRECT answers too. Feedback that only appears on failure
   teaches people to guess and check.

   Every stem must stand alone two weeks later, out of context -- each question
   doubles as a flashcard. "Which of these is true?" is a bad stem for that
   reason; name the subject.

   QUIZ TEXT MUST BE PLAIN PROSE. quiz.js escapes stems, options and `why`, so
   an HTML tag or entity renders literally on the page. Write "greater than",
   not "&gt;". Square brackets inside an option string also break the doctor's
   parser -- spell the thing in words instead.
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {
});
