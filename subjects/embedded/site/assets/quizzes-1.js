/* ==========================================================================
   quizzes-1.js -- the question bank, part 1.

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
   not the entity. Square brackets inside an option string also break the
   doctor's parser -- spell the thing in words instead.

   COVERAGE. This file holds the chapters written so far. The remaining
   chapters have no questions because they have no prose, and a question
   written against a placeholder is a question written against nothing.
   docs/BUILD-STATUS-embedded.md lists which is which.
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {

  /* ------------------------------------------------------- 00-the-job-posting --- */
  "00-the-job-posting": [
    { q: "The Formigine advert says the role works 'sia su firmware di sistemi embedded, che su software PLC'. Why is that the most informative sentence in the posting?",
      a: ["It means the salary is higher", "It means the job straddles two worlds that are usually separate, which is the gap the role exists to fill", "It means the company has no dedicated PLC programmer", "It means PLC work is the larger half of the job"],
      c: 1,
      why: "Firmware engineers who write C rarely read ladder, and PLC programmers rarely write C. A candidate comfortable at that seam is scarce, and the advert is describing exactly that seam." },

    { q: "In the responsibility line 'Sviluppare e ottimizzare firmware', what does the verb 'ottimizzare' tell you about the work?",
      a: ["That the code will be written from scratch", "That you will be handed working code and asked to make it fit or meet a deadline it currently misses, which is a measurement skill first", "That performance is not important", "That the company uses an unusual compiler"],
      c: 1,
      why: "You cannot optimise what you have not measured, which is why the chapter on measuring timing exists and why estimating instead of measuring is the failure mode." },

    { q: "The advert asks for 'conoscenza approfondita dei protocolli di comunicazione seriale e Ethernet'. Why is treating that as one requirement a mistake?",
      a: ["Ethernet is obsolete in industry", "They are two different skills: serial means owning the timing down to the inter-character gap, Ethernet means a TCP/IP stack and somebody else's network in the middle", "Serial protocols are a subset of Ethernet", "The advert means only Ethernet and lists serial for legacy reasons"],
      c: 1,
      why: "A candidate who has done only one and answers as though they are the same skill is found out in about two follow-up questions." },

    { q: "Which single line of the Formigine advert is the one real hard technical gate, and what softens it?",
      a: ["The degree line, softened by naming four faculties", "The STM32 line, softened by the parenthesis admitting academic and internship experience", "The English line, softened by 'buona' rather than 'ottima'", "The RTOS line, softened by the training path"],
      c: 1,
      why: "Esperienza (anche accademica o di stage) su ambiente di sviluppo STM32 is the one specific tool named. The parenthesis explicitly admits university and internship work, and does not exclude a personal project." },

    { q: "What does the phrase 'inserito in un percorso di formazione' change about how you should prepare for the interview?",
      a: ["Nothing; it is standard filler", "It means they are buying trajectory, so the interview tests how you think and whether you will admit what you do not know", "It means the technical round will be skipped", "It means the salary is not negotiable"],
      c: 1,
      why: "For a training role a confident wrong answer is worse than an honest boundary, because being wrong at a bench costs a day and a board." },

    { q: "What is the hardware boundary this course states on its own front page, and why is it stated there?",
      a: ["That no C++ can be taught without a compiler licence", "That bring-up and instrument work need a real board, so the chapters that need one say so, and the honest claim is worth more than the inflated one", "That STM32 cannot be studied without CubeIDE", "That protocols cannot be learned without a PLC"],
      c: 1,
      why: "In this field the inflated claim is caught quickly, because the interviewer can put a board on the table. Naming the boundary first is what makes the rest of the claims credible." },

    { q: "The Formigine advert quotes CCNL Metalmeccanica with 13 mensilita and a RAL of 26 to 32K. What monthly gross does a RAL of 28,000 correspond to?",
      a: ["About 2,333 euro, dividing by 12", "About 2,154 euro, dividing by 13", "About 1,900 euro after tax", "It cannot be derived from the RAL"],
      c: 1,
      why: "Thirteen instalments, not twelve, with the extra one paid in December. That matches the advert's own stated 2,000 to 2,800 monthly band." },

    { q: "Why does the advert's line 'Collaborare con il team hardware per il debug e la validazione dei sistemi' matter more than software candidates usually assume?",
      a: ["Because the hardware team writes the firmware specification", "Because there is a hardware team in the building and you will be at a bench with them, which is what decides how the first six months go", "Because it implies you will design PCBs", "Because validation is a formality handled by a test department"],
      c: 1,
      why: "Working out together whether a bug is in the code or in the board is a distinct skill, and it is why Part 10 of this course is four chapters long." },
  ],

  /* --------------------------------------------------- 03-types-and-integers --- */
  "03-types-and-integers": [
    { q: "What does the C standard actually guarantee about the size of an int?",
      a: ["Exactly 32 bits on all modern targets", "Only a minimum range, equivalent to at least 16 bits", "The same size as a pointer", "The same size as a long"],
      c: 1,
      why: "It is 32 bits on arm-none-eabi and 16 on an 8-bit AVR. Code that assumes a width is portable only by luck, which is why hardware and protocol code uses stdint.h." },

    { q: "On ARM, is plain char signed or unsigned, and why does it matter?",
      a: ["Signed, same as x86, so it does not matter", "Unsigned, unlike x86 gcc where it is signed, so a test for a negative char behaves differently on host and target", "It is always unsigned everywhere", "The standard requires it to be signed"],
      c: 1,
      why: "Whether plain char is signed is implementation-defined. For bytes, write uint8_t and the question never arises." },

    { q: "Two uint8_t variables hold 200 and 100. What is the value and type of their sum in C?",
      a: ["44, as a uint8_t, because it wraps at 8 bits", "300, as an int, because both operands are promoted to int before the addition", "Undefined behaviour because of overflow", "300, as a uint8_t"],
      c: 1,
      why: "Integer promotion converts anything narrower than int to int before almost any arithmetic. It only becomes 44 if you assign the result back to a uint8_t." },

    { q: "Why is the comparison of an int holding minus one against an unsigned int holding one false in C?",
      a: ["Because minus one is not representable as an int", "Because the usual arithmetic conversions bring both to unsigned when the ranks are equal, so minus one becomes a very large positive value", "Because comparing different types is undefined behaviour", "Because the compiler optimises the comparison away"],
      c: 1,
      why: "When ranks match, the unsigned type wins the conversion. The same rule is why a countdown loop using size_t and testing for greater than or equal to zero never ends." },

    { q: "What is the difference between signed and unsigned integer overflow in C?",
      a: ["Both wrap modulo two to the power N", "Unsigned wrapping is defined; signed overflow is undefined behaviour, and the optimiser assumes it cannot happen", "Signed wraps and unsigned saturates", "Both are undefined behaviour"],
      c: 1,
      why: "It is why timer-difference arithmetic is correct across a rollover only with unsigned counters, and why a signed millisecond counter is a bug waiting for uptime to reach about 24.8 days." },

    { q: "A uint16_t CRC value is shifted left by 16 places and assigned to a uint32_t. What is wrong with that expression?",
      a: ["Nothing; the assignment widens it correctly", "The operand is promoted to int first, so the shift reaches and passes the sign bit, and on a 16-bit int target it is undefined outright", "Shifting a uint16_t is always undefined", "The result is correct but slower than a multiplication"],
      c: 1,
      why: "Cast before you shift when the result is wider than the operand: cast the value to uint32_t and then shift." },

    { q: "What happens when you shift a 32-bit value right by 32 places in C?",
      a: ["The result is reliably zero", "It is undefined behaviour, and on ARM it often returns the value unchanged because the hardware shifter uses only the low five bits", "The compiler rejects it", "The result is reliably the sign bit repeated"],
      c: 1,
      why: "Shifting by an amount greater than or equal to the width of the promoted type is undefined, and the ARM behaviour is a common surprise." },

    { q: "When should you prefer uint_fast8_t over uint8_t?",
      a: ["Whenever the value fits in eight bits", "For loop counters and local arithmetic, where forcing exactly eight bits costs masking instructions and the exact width is not part of any contract", "For protocol frames, where speed matters most", "Never; it is a deprecated type"],
      c: 1,
      why: "Use exact-width types where the width is part of a contract, which means hardware registers, protocol frames and stored structures. Use fast types where only the range matters." },

    { q: "Which two compiler warning flags catch most of the signed, unsigned and conversion mistakes in this chapter at build time?",
      a: ["-Wall and -O2", "-Wconversion and -Wsign-compare", "-pedantic and -std=c99", "-Wshadow and -Wunused"],
      c: 1,
      why: "Firmware teams turn these on and then turn on -Werror, because this class of bug is cheap to catch at compile time and expensive to find in the field." },
  ],

  /* --------------------------------------------------- 06-const-and-volatile --- */
  "06-const-and-volatile": [
    { q: "What does the volatile qualifier tell the compiler?",
      a: ["That the variable is shared between threads and access to it is atomic", "That every read and write in the source must really happen, in order, and none may be optimised away", "That the variable must be stored in a CPU register", "That the variable's value is unknown at compile time"],
      c: 1,
      why: "It is a statement about the compiler's freedom, not about the variable's contents. That framing is what the interview question is actually testing." },

    { q: "Name the three situations in embedded code that require volatile.",
      a: ["Any global variable, any pointer, and any array", "A memory-mapped peripheral register, a variable written by an ISR, and a buffer written by DMA", "Constants in flash, stack variables, and function parameters", "Anything accessed from more than one function"],
      c: 1,
      why: "All three are things that change without the code the compiler can see changing them, which is exactly the assumption volatile withdraws." },

    { q: "A main loop waits on a flag set by an interrupt, and the flag is not declared volatile. What does an optimising compiler do?",
      a: ["It generates the loop correctly but more slowly", "It loads the flag once, and since nothing it can see changes it, turns the wait into an unconditional infinite loop", "It issues an error", "It automatically inserts a memory barrier"],
      c: 1,
      why: "It works at -O0 and breaks at -O2, which is the signature of a missing volatile and the reason it wastes so much time." },

    { q: "Does declaring a counter volatile make incrementing it safe when an ISR also increments it?",
      a: ["Yes, volatile makes the access atomic", "No: the increment is still load, add, store, and can be interrupted between any two of those", "Yes, on ARM, because the bus is 32 bits wide", "Only if the counter is 8 bits"],
      c: 1,
      why: "Volatile guaranteed the memory traffic happens; it guaranteed nothing about it happening indivisibly. Shared counters need a critical section, an RTOS primitive, or an atomic type." },

    { q: "Why does a wait loop on a hardware status register work without you writing volatile yourself?",
      a: ["Because hardware registers are exempt from optimisation", "Because the CMSIS headers already declare the peripheral struct members volatile", "Because the compiler detects the address range", "Because status registers are read-only"],
      c: 1,
      why: "If you roll your own register definitions and omit the qualifier, the wait loop never exits, and the cause is invisible in the source." },

    { q: "What does const tell you, and what does it not tell you?",
      a: ["That the object can never change, by anyone", "That this code will not change the object; it says nothing about anything else changing it", "That the object lives in flash, always", "That the object is thread-safe"],
      c: 1,
      why: "It constrains the program, not the object. That is why const volatile is meaningful rather than contradictory." },

    { q: "On a microcontroller, what is the practical memory effect of declaring a large lookup table const at file scope?",
      a: ["It costs twice the RAM because of the initialiser", "It goes in rodata and is placed in flash, instead of costing both flash for the initialiser and RAM for the runtime copy", "It makes no difference to placement", "It is copied to RAM at startup either way"],
      c: 1,
      why: "On a part with 20 KB of SRAM, a 4 KB table is the difference between fitting and not fitting." },

    { q: "What does a declaration of const volatile uint32_t describe in embedded code?",
      a: ["A contradiction that most compilers reject", "A read-only hardware status register: your code must not write it, and it changes without your code's involvement", "A constant that may be cached", "A variable stored in backup RAM"],
      c: 1,
      why: "The two qualifiers are not opposites. One constrains your program, the other withdraws an assumption from the compiler." },

    { q: "Besides volatile, what else is needed for a DMA buffer on a Cortex-M7 with a data cache?",
      a: ["Nothing; volatile is sufficient", "Cache maintenance or a non-cacheable MPU region, because volatile says nothing to the hardware about visibility", "A larger buffer alignment only", "Disabling interrupts around every access"],
      c: 1,
      why: "Volatile constrains the compiler. It does not constrain the cache, the write buffer or another bus master." },
  ],

  /* ------------------------------------------------------ 11-avoiding-malloc --- */
  "11-avoiding-malloc": [
    { q: "What is the main reason firmware avoids dynamic allocation, and why is it not simply 'not enough memory'?",
      a: ["Because malloc is slow on ARM", "Because without an MMU, fragmentation leaves permanent holes, so a request can fail while plenty of total memory is free", "Because the C library is too large", "Because the heap is stored in flash"],
      c: 1,
      why: "A desktop hides fragmentation behind virtual memory by mapping scattered physical pages contiguously. A Cortex-M has no MMU, so the holes are real." },

    { q: "Why is heap fragmentation a particularly difficult failure to catch in testing?",
      a: ["It only occurs at low temperatures", "It is time-dependent: the device works on the bench and through a week of testing, then fails after weeks in the field with no log entry explaining it", "It only affects parts with less than 16 KB of RAM", "Compilers warn about it at build time"],
      c: 1,
      why: "There is no test that reliably provokes it, which is why the field prefers designs where the failure cannot happen at all." },

    { q: "Why is malloc disqualifying inside code with a deadline?",
      a: ["Because it returns null too often", "Because it walks a free list whose length depends on heap history, so the call has no useful worst-case bound, and it usually takes a lock", "Because it disables interrupts for a fixed 2 ms", "Because it cannot be called from C++"],
      c: 1,
      why: "The lock is also one of the concrete reasons it must never appear in an interrupt handler." },

    { q: "What can static allocation prove that a heap cannot?",
      a: ["That the program has no bugs", "That the program fits, at build time, from the linker's own output", "That the stack will never overflow", "That timing deadlines are met"],
      c: 1,
      why: "With a heap, whether it fits depends on runtime behaviour, and the honest statement becomes 'we think so'. That is why safety standards restrict dynamic allocation hard." },

    { q: "Why can a fixed-block memory pool not fragment?",
      a: ["Because it is stored in flash", "Because every block is the same size, so any free block satisfies any request", "Because it never frees blocks", "Because it uses a binary tree to compact free space"],
      c: 1,
      why: "Allocation is also O(1), since it just unlinks the head of the free list. Several pools of different block sizes cover most real needs." },

    { q: "What is the real design decision when you add a ring buffer to a firmware project?",
      a: ["Whether to use a power-of-two capacity", "What happens when it is full: overwrite the oldest, or refuse the newest", "Whether to store the head and tail as pointers or indices", "Whether to allocate it on the stack"],
      c: 1,
      why: "It is a product decision, not a coding one. For a log, overwrite. For a command queue, refuse and report." },

    { q: "Is allocating at startup and never freeing an acceptable strategy in firmware?",
      a: ["No, any use of malloc is forbidden by all standards", "Yes: with no frees there is no fragmentation and no unbounded call in a hot path, and many products with a TCP/IP stack work this way", "Only if the heap is smaller than 1 KB", "Only in C++ projects"],
      c: 1,
      why: "The objections to a heap are fragmentation and unbounded timing. Allocate-once-at-init removes both." },

    { q: "Name three ways malloc enters a project that claims not to use it.",
      a: ["Interrupt handlers, the linker script, and the watchdog", "The RTOS task creation call, some printf implementations, and C++ containers or captured lambdas", "The startup code, the vector table, and the NVIC", "Only through direct calls, which is why grep is sufficient"],
      c: 1,
      why: "Vendor middleware such as USB stacks and file systems also allocate internally. The way to find out is the map file or a breakpoint on malloc, not grep." },

    { q: "What is the risk in an sbrk implementation that hands out heap memory without checking?",
      a: ["It fragments the flash", "The heap growing up can collide with the stack growing down, which is one of the nastier field failures", "It slows down every malloc call", "It prevents the linker from producing a map file"],
      c: 1,
      why: "A correct sbrk that refuses rather than colliding is worth writing, because the collision corrupts memory silently." },
  ],

  /* -------------------------------------------------- 26-interrupts-and-nvic --- */
  "26-interrupts-and-nvic": [
    { q: "Why can a Cortex-M interrupt handler be written as an ordinary C function with no special keyword?",
      a: ["Because the compiler detects the function name and adds a prologue", "Because the core automatically stacks the caller-saved register set, and the compiler saves the rest if the handler uses them", "Because handlers run in the same mode as normal code", "Because ARM requires all functions to save all registers"],
      c: 1,
      why: "The core stacks R0 to R3, R12, LR, PC and xPSR on entry. That is exactly the caller-saved set, which is what makes the ordinary C calling convention sufficient." },

    { q: "On a Cortex-M, does a higher priority interrupt have a larger or smaller numeric priority value?",
      a: ["Larger, so priority 5 beats priority 0", "Smaller, so priority 0 beats priority 5", "The sign of the value decides, not the magnitude", "Priority values are unordered identifiers"],
      c: 1,
      why: "Reset, NMI and HardFault have fixed negative priorities and always win. Everything else is configurable within the implemented bits." },

    { q: "How many interrupt priority bits do STM32 parts implement, and where do they sit in the priority byte?",
      a: ["All eight bits, in the natural order", "Four bits, in the upper half of the byte, which is why priority 1 appears as 0x10 in the raw register", "Two bits, in the lower half", "Eight bits, but only the lower four are used"],
      c: 1,
      why: "Because of the placement, you use the CMSIS priority setter rather than writing the register byte by hand." },

    { q: "What is tail-chaining on a Cortex-M?",
      a: ["Linking several handlers into one vector entry", "Skipping the unstack and restack pair when another exception is already pending on return, and going straight to the next handler", "Deferring an interrupt to a lower priority level", "Chaining DMA transfers without CPU involvement"],
      c: 1,
      why: "Late arrival is the companion optimisation: a higher-priority exception appearing during stacking redirects the core without starting over." },

    { q: "What is the standard shape of a well-written interrupt handler?",
      a: ["Do all the work in the handler so the main loop stays simple", "Read the hardware, clear the flag, post one item to a queue or set one flag, and return; parse and compute in a task", "Disable all interrupts, do the work, re-enable them", "Call the RTOS delay function to yield to other tasks"],
      c: 1,
      why: "While the handler runs, everything of equal or lower priority waits, so its duration enters the worst-case latency of all of them." },

    { q: "Why must an interrupt handler never block, for example by waiting on another peripheral's flag?",
      a: ["Because blocking calls are slower in handler mode", "Because the thing it is waiting for may be delivered by an interrupt that the running handler is itself blocking", "Because the compiler cannot generate a wait loop in a handler", "Because blocking calls require a stack frame the core does not provide"],
      c: 1,
      why: "It is the same reason a HAL delay call inside a handler is a design error rather than a style preference." },

    { q: "Why are malloc and printf forbidden inside an interrupt handler?",
      a: ["They are too large to fit in flash", "The allocator takes a lock the interrupted code may already hold, and printf is enormous and typically blocking", "They require floating point support", "They cannot be linked into handler mode code"],
      c: 1,
      why: "Both problems are about what the interrupted code was doing, which the handler cannot know." },

    { q: "A handler clears its peripheral flag on its very last line and occasionally runs twice for one event. What is happening?",
      a: ["The interrupt is being triggered twice by noise on the pin", "The write travels through a write buffer and may not have reached the peripheral before the exception returns, so the NVIC still sees the line asserted", "The NVIC priority is set too low", "The compiler has reordered the clear"],
      c: 1,
      why: "Clear the flag early in the handler, or follow the clear with a read-back or a data synchronisation barrier so the write has provably landed." },

    { q: "What is the consequence of forgetting to clear a peripheral interrupt flag at all?",
      a: ["The interrupt fires once and is then disabled", "The handler re-enters immediately and forever, so the system appears frozen and main never runs again", "The NVIC escalates it to a HardFault", "Nothing, until another interrupt of the same priority arrives"],
      c: 1,
      why: "Most peripheral interrupts stay pending until the source flag is cleared in the peripheral, not in the NVIC." },

    { q: "Why does interrupt nesting create a stack-depth requirement?",
      a: ["Because each handler allocates a new stack", "Because a higher-priority interrupt pre-empts a running handler, so the worst-case stack must survive the deepest legal nesting chain", "Because the NVIC copies the stack on entry", "Because nested handlers cannot share the main stack pointer"],
      c: 1,
      why: "Nesting is enabled by default, and it is a feature. It also means stack sizing is a worst-case analysis rather than a measurement of the typical path." },
  ],

  /* ----------------------------------------------- 37-what-real-time-means --- */
  "37-what-real-time-means": [
    { q: "What makes a system real-time?",
      a: ["That it responds within microseconds", "That its correctness depends on when the result is produced as well as on what it is, so a late answer is a wrong answer", "That it runs an RTOS", "That it has no operating system at all"],
      c: 1,
      why: "Answering 'fast' rather than 'predictable' is the single most commonly scored error in an embedded interview." },

    { q: "A control loop has a mean latency of 40 microseconds and a worst case of 9 milliseconds. What is its latency for real-time purposes?",
      a: ["40 microseconds, since that is the typical case", "9 milliseconds, with the system usually idle", "The median of the two", "It cannot be stated without the standard deviation"],
      c: 1,
      why: "The worst case is the number that matters, which is also why caches, buffering and dynamic allocation improve the average while widening the tail." },

    { q: "What distinguishes a hard deadline from a firm one?",
      a: ["Hard deadlines are shorter", "Missing a hard deadline is a system failure; missing a firm one means the result has zero value but causes no damage", "Firm deadlines apply only to communication", "There is no practical difference"],
      c: 1,
      why: "A soft deadline is the third case: a late result still has some value, degrading with lateness. Most real products contain all three at once." },

    { q: "In a typical firmware system, which term usually dominates the worst-case response time?",
      a: ["The handler's own execution time", "The longest critical section anywhere in the system, because nothing can pre-empt during it", "The context switch time of the RTOS", "The time spent in the idle task"],
      c: 1,
      why: "One badly placed interrupt disable around a 2 ms flash write sets a 2 ms floor on the worst-case latency of every interrupt in the product." },

    { q: "What does the 'real-time' in 'real-time operating system' actually guarantee?",
      a: ["That your application will meet its deadlines", "That the kernel's own operations are bounded and the highest-priority ready task runs; nothing about your code", "That interrupts are never disabled", "That no task can ever be starved"],
      c: 1,
      why: "You can miss every deadline in a product on a perfectly good RTOS, and a bare superloop with no RTOS at all can be entirely real-time." },

    { q: "What does WCET stand for and why is it hard to establish?",
      a: ["Weighted Cycle Estimation Time; it requires a profiler", "Worst-case execution time; it is undecidable in general, and caches and branch prediction make measurement pessimistic or optimistic depending on method", "Worst-case event trigger; it depends on the interrupt controller", "Windowed Clock Error Tolerance; it depends on the crystal"],
      c: 1,
      why: "In practice on a Cortex-M you measure with a pin and a scope over a long run including the awkward paths, take the maximum, and leave headroom." },

    { q: "The rate-monotonic utilisation bound approaches about 69 percent for large task counts. What does exceeding it mean?",
      a: ["The task set is definitely not schedulable", "The task set may still be schedulable, but utilisation alone no longer proves it and real analysis is needed", "The RTOS will refuse to create the tasks", "Priorities must be reassigned by deadline instead of by rate"],
      c: 1,
      why: "The bound is sufficient, not necessary. Knowing that utilisation alone does not prove schedulability is the point, not memorising the number." },

    { q: "Why does jitter matter separately from latency?",
      a: ["It does not; jitter is just a measure of average latency", "Because a system with large jitter is unpredictable even when it is usually quick, and predictability is what real-time means", "Because jitter only affects communication protocols", "Because jitter is what the watchdog measures"],
      c: 1,
      why: "Latency is how long the response takes; jitter is how much that time varies. A real-time design is one where you can state the worst number and defend it." },
  ],

  /* --------------------------------------------------- 41-priority-inversion --- */
  "41-priority-inversion": [
    { q: "Describe bounded priority inversion.",
      a: ["A high-priority task waits while a low-priority task holds a shared mutex, for the length of that critical section", "A low-priority task never runs because higher ones always do", "Two tasks each wait for a lock the other holds", "The scheduler runs tasks in the wrong order"],
      c: 1,
      why: "Bounded inversion is normal and unavoidable. It is the unbounded case that is the bug." },

    { q: "What turns bounded priority inversion into unbounded priority inversion?",
      a: ["The high-priority task timing out", "A medium-priority task that shares nothing becoming ready, pre-empting the lock holder and starving it, so the wait no longer depends on the critical section", "The mutex being taken recursively", "The low-priority task raising its own priority"],
      c: 1,
      why: "Once the blocking time depends on unrelated medium-priority work, no worst-case analysis of the high-priority task is possible." },

    { q: "How does priority inheritance fix unbounded priority inversion?",
      a: ["By lowering the medium-priority task", "By raising the lock holder to the waiter's priority until it releases, so nothing in between can pre-empt it", "By making the high-priority task spin instead of block", "By releasing the mutex automatically after a timeout"],
      c: 1,
      why: "The high-priority task's blocking time is then bounded by the critical section again, which is what makes analysis possible." },

    { q: "Why can a binary semaphore not provide priority inheritance?",
      a: ["Because it is always faster than a mutex", "Because a semaphore has no owner, so there is nobody for the kernel to promote", "Because semaphores cannot be used between tasks", "Because inheritance requires a recursive lock"],
      c: 1,
      why: "This is the concrete reason the rule 'mutex for mutual exclusion, semaphore for signalling' is a rule rather than a stylistic preference." },

    { q: "What happened to Mars Pathfinder in July 1997?",
      a: ["A memory leak exhausted the heap", "An information bus mutex held by a low-priority meteorological task, while a medium-priority communications task ran, made a high-priority bus task miss its deadline, and the watchdog reset the spacecraft", "A cosmic ray flipped a bit in the vector table", "A stack overflow corrupted the telemetry buffer"],
      c: 1,
      why: "It is the best-documented real-time bug in history, and the fix was a configuration change rather than an algorithm." },

    { q: "What was the actual fix applied to Mars Pathfinder?",
      a: ["A rewrite of the meteorological task", "Enabling priority inheritance on that mutex, a capability the kernel already had but which had not been switched on", "Increasing the watchdog timeout", "Removing the communications task from the schedule"],
      c: 1,
      why: "They also found it only because tracing could be enabled on the flight software and on an identical unit on the ground. A bug you cannot observe is a bug you cannot fix." },

    { q: "Does priority inheritance prevent deadlock?",
      a: ["Yes, it is the standard deadlock prevention mechanism", "No: if two tasks take two mutexes in opposite orders they still wait for each other, now at elevated priority", "Yes, but only with recursive mutexes", "Only when combined with a timeout"],
      c: 1,
      why: "The fix for that is a global lock ordering, or not holding two locks at once." },

    { q: "Why must an interrupt handler never take a mutex?",
      a: ["Because mutexes are stored in RAM the handler cannot reach", "Because a handler is not a task and has no priority the scheduler can raise, so the inversion is unbounded by construction", "Because taking a mutex always allocates memory", "Because the mutex API is slower than a semaphore"],
      c: 1,
      why: "Signal a task from the handler and let the task take the lock. That is the FromISR pattern." },

    { q: "What is the priority ceiling protocol, and how does it differ from inheritance?",
      a: ["It lowers the priority of waiting tasks instead of raising the holder", "Each resource carries a ceiling equal to the highest priority of any task that can take it, and a task is raised to that ceiling on acquisition; it also prevents deadlock", "It is the same mechanism under a different name", "It applies only to semaphores"],
      c: 1,
      why: "It is stronger and more intrusive, needing the whole resource and priority map up front, which is why it appears in safety-critical designs more than in general firmware." },
  ],

  /* --------------------------------------------------------- 50-modbus-rtu --- */
  "50-modbus-rtu": [
    { q: "In Modbus RTU, which device is allowed to initiate a message?",
      a: ["Any device on the bus", "Only the master; slaves answer and never initiate", "The device with the lowest address", "Whichever device detects the line is idle"],
      c: 1,
      why: "Addresses run 1 to 247, and address 0 is broadcast, which is write-only and unacknowledged." },

    { q: "Which two Modbus data tables are writable?",
      a: ["Discrete inputs and input registers", "Coils and holding registers", "Input registers and holding registers", "All four are writable"],
      c: 1,
      why: "Coils and discrete inputs are single bits; input and holding registers are 16 bits. Discrete inputs and input registers are read-only." },

    { q: "How is the end of a Modbus RTU frame marked?",
      a: ["By a dedicated end-of-frame byte", "By silence on the line of at least 3.5 character times", "By a length field in the header", "By the CRC value itself"],
      c: 1,
      why: "A gap greater than 1.5 character times within a frame means the frame is incomplete and must be discarded. It makes RTU a protocol about timing, not just about bytes." },

    { q: "Which field of a Modbus RTU frame is little-endian?",
      a: ["The register addresses", "The CRC-16, which is the only little-endian field in an otherwise big-endian protocol", "The quantity field", "The function code"],
      c: 1,
      why: "Getting this backwards produces a frame the master rejects with no other diagnostic, which is why it is worth memorising." },

    { q: "How should a Modbus slave respond to a request for a register that does not exist?",
      a: ["With silence, so the master times out", "With the function code plus 0x80 and exception code 02, illegal data address", "With a zero value", "By resetting the connection"],
      c: 1,
      why: "Silence is indistinguishable from a dead cable. Returning a correct exception is the difference between a debuggable device and an undebuggable one." },

    { q: "Documentation refers to holding register 40018. What address and function code does that mean on the wire?",
      a: ["Address 40018, function code 03", "Address 17, function code 03", "Address 18, function code 04", "Address 40017, function code 06"],
      c: 1,
      why: "The Modicon convention numbers entities from 1 with a leading table digit, so 40001 is address 0. When your value is consistently one register away from what you expected, this is why." },

    { q: "Which word order does the Modbus specification define for a 32-bit value spanning two registers?",
      a: ["High word first, always", "Low word first, always", "None: the specification does not say, both orders ship, and both are called Modbus", "It depends on the function code used"],
      c: 1,
      why: "State it in your register map document, and test it with a value whose halves differ, such as 0x12345678 rather than 0x00000001." },

    { q: "What is the clean way to implement Modbus RTU frame reception on an STM32?",
      a: ["An interrupt per received byte with a software timer measuring the gaps", "DMA into a buffer plus the UART idle-line interrupt, computing the length from the remaining DMA count", "Polling the receive register in the main loop", "A dedicated timer peripheral counting character times"],
      c: 1,
      why: "One interrupt per frame instead of one per byte, with the framing done by hardware rather than by software timing." },

    { q: "On RS-485, which flag should release the driver enable after transmitting a Modbus response?",
      a: ["The transmit-buffer-empty flag, as soon as the last byte is handed over", "The transmission-complete flag, after the last bit has physically left the shift register", "The receive-idle flag", "Either; they are equivalent"],
      c: 1,
      why: "Releasing on transmit-buffer-empty truncates the final character, and the symptom at the master is an intermittent CRC error rather than an obvious fault." },

    { q: "Above 19200 baud, how does the Modbus specification say the frame timings should be handled?",
      a: ["Scale them with the baud rate as at lower speeds", "Use fixed values of 1.750 ms and 0.750 ms rather than scaling", "Disable framing timeouts entirely", "Switch to Modbus ASCII"],
      c: 1,
      why: "At high speeds the character times become short enough that chasing them in software stops being worthwhile." },
  ],

  /* ------------------------------------------------------- 56-what-a-plc-is --- */
  "56-what-a-plc-is": [
    { q: "What are the stages of a PLC scan cycle?",
      a: ["Poll interrupts, run tasks, service the watchdog", "Read all inputs into a process image, execute the program on that snapshot, write all outputs, do housekeeping", "Read one input, act on it, move to the next", "Execute the program continuously and sample inputs on demand"],
      c: 1,
      why: "The program operates on a snapshot copied at the top of the scan, never on live I/O, and that single fact explains most of a PLC's behaviour." },

    { q: "Your board pulses a digital output to a PLC for 200 microseconds. What happens?",
      a: ["The PLC latches it in hardware and sees it on the next scan", "The PLC usually never sees it, because the pulse is shorter than one scan and is not present when the inputs are sampled", "The PLC raises an input error", "The PLC extends the pulse automatically"],
      c: 1,
      why: "Scan times are typically 1 to 20 ms. Hold the signal for several scans, use a handshake, or route genuinely fast events to a high-speed counter input." },

    { q: "Why is a PLC deterministic in a way that ordinary firmware is not?",
      a: ["Because its processor is faster", "Because the architecture forbids dynamic allocation and recursion, bounds loops, and puts a watchdog on the scan time itself", "Because it runs a certified real-time kernel", "Because it has no interrupts at all in hardware"],
      c: 1,
      why: "It is the extreme end of the static-allocation argument, enforced by the language rather than by team discipline." },

    { q: "Which of the five IEC 61131-3 languages is a software engineer most likely to reach for, and which one dominates in practice on machines?",
      a: ["Instruction List for writing, Function Block Diagram in practice", "Structured Text for writing, Ladder Diagram in practice", "Ladder for writing, Structured Text in practice", "Sequential Function Chart for both"],
      c: 1,
      why: "Ladder dominates because maintenance staff can read it at 03:00, which is its entire justification and a very good one." },

    { q: "What is a FUNCTION_BLOCK in IEC 61131-3, in terms a C programmer would recognise?",
      a: ["A plain function with no state", "An object with state that persists between calls, effectively a class with one method", "A macro expanded at compile time", "An interrupt service routine"],
      c: 1,
      why: "The standard timer blocks TON, TOF and TP and the edge detectors R_TRIG and F_TRIG are all function blocks, and all depend on that persistent state." },

    { q: "Why is there no sleep function in a PLC program?",
      a: ["Because the language has no timing primitives", "Because blocking the scan would stop the machine; timing is done with timer function blocks instead", "Because sleep is only available in Structured Text", "Because the scan watchdog would reset the CPU after any delay"],
      c: 1,
      why: "A timer block is evaluated every scan and reports whether its time has elapsed, which keeps the scan running." },

    { q: "Why is an industrial emergency stop wired normally closed?",
      a: ["To reduce current consumption", "So that a cut cable or a failed contact stops the machine, rather than silently disabling the stop button", "Because normally open contacts are more expensive", "Because the PLC cannot read a normally open input"],
      c: 1,
      why: "Fail-safe by wiring, not by code. It is the clearest single example of the way safety is reasoned about on the industrial side." },

    { q: "Which PLC environment do Emilia-Romagna adverts typically name, and which one is freely available to learn on?",
      a: ["Codesys in adverts, Siemens for learning", "Siemens TIA Portal in adverts, Codesys for learning", "Both name Codesys", "Both name Siemens"],
      c: 1,
      why: "The IEC 61131-3 concepts transfer; TIA Portal's hardware configuration, tag tables and project organisation do not. TIA has a time-limited trial, so use it last and in one concentrated block." },

    { q: "What is the retentive memory area of a PLC, and why should you ask about it early?",
      a: ["The area reserved for the operating system", "The memory that survives a power cut, which determines what the machine remembers and is a prerequisite for designing any fail-safe state", "A cache for frequently used variables", "The area holding the process image of the inputs"],
      c: 1,
      why: "Deciding what the machine does after a power loss mid-cycle is one of the hard parts of PLC work, and it depends entirely on what was retained." },
  ],

  /* -------------------------------------------------- 58-talking-to-the-plc --- */
  "58-talking-to-the-plc": [
    { q: "In a typical board-to-PLC integration, which side is the Modbus master and why?",
      a: ["The board, because it produces the data", "The PLC, because it owns the machine's timing, its scan cycle gives a natural polling rhythm, and the automation engineer prefers adding one more slave", "Whichever device boots first", "Neither; Modbus is peer to peer"],
      c: 1,
      why: "Being the slave means you can never volunteer information, which is the constraint that drives the rest of the design." },

    { q: "If your board is a Modbus slave, what bounds the latency of an alarm it detects?",
      a: ["The board's own internal cycle time", "The master's polling interval, since the alarm must sit in a register until it is polled", "The baud rate of the serial link", "The PLC's scan time only"],
      c: 1,
      why: "That makes the poll rate a design input to be negotiated. Anything genuinely safety-related should get a hard-wired digital output instead of a register." },

    { q: "Why should a fault status bit latch until explicitly acknowledged?",
      a: ["To reduce bus traffic", "Because a fault that appears and clears between two polls would otherwise never be seen by the master", "Because Modbus requires latching for coils", "Because the PLC cannot write to status registers"],
      c: 1,
      why: "It is the same latch as a seal-in rung in the PLC's own world, which is why the pattern is familiar to the engineer on the other side." },

    { q: "What is the reliable way to accept a command from a Modbus master exactly once?",
      a: ["A single command bit that the board clears after acting", "A command word plus an incrementing sequence number, which the board echoes in a status register after executing", "A timestamp in two registers", "Writing the command twice and comparing"],
      c: 1,
      why: "A bare command bit is executed twice on a retry, or zero times if you clear it and the master never observed the change." },

    { q: "Why send a temperature as tenths of a degree in a single integer register rather than as an IEEE-754 float?",
      a: ["Floats are not representable in Modbus at all", "It avoids the word-order ambiguity of a two-register value, avoids the PLC's float handling, and is what the automation engineer expects", "Integers transmit faster on RS-485", "Floats require function code 04"],
      c: 1,
      why: "Scaled integers also make the register map document simpler, because scaling is one column rather than a format discussion." },

    { q: "Why must a disconnected sensor not report 0 degrees Celsius over Modbus?",
      a: ["Because zero is reserved by the protocol", "Because zero is a plausible temperature, so an explicit invalid value or a validity bit in the status word is needed instead", "Because signed registers cannot hold zero", "Because the PLC treats zero as a communication error already"],
      c: 1,
      why: "Reserving a value such as 0x8000 for a signed 16-bit register, or carrying a validity bit, makes the failure visible rather than plausible." },

    { q: "What should a board do when the master stops polling it?",
      a: ["Nothing; it is the master's problem", "Decide, after a configured timeout of typically three missed intervals, whether to hold the last command or revert to a safe default, and record that decision in the register map document", "Reset itself immediately", "Switch to master mode and poll the PLC"],
      c: 1,
      why: "Whether holding or reverting is safer depends on the product: for a pump in a cooling loop, keeping it running is usually safer; for a heater, the opposite." },

    { q: "Why does a heartbeat counter solve a problem that reading a value cannot?",
      a: ["It reduces the number of registers needed", "Because a frozen value is indistinguishable from a correct one, while a frozen counter is immediately detectable", "Because counters are transmitted more reliably", "Because it lets the slave initiate a message"],
      c: 1,
      why: "A temperature of 45 degrees that is four minutes old looks exactly like a current temperature of 45 degrees." },

    { q: "What should a register map document record for every row?",
      a: ["Address and name only", "Address with its stated convention, name, type, unit, scaling, valid range, access, and the value on startup or fault", "Address, name and the C type used in the firmware", "Only the writable registers, since read-only ones are self-explanatory"],
      c: 1,
      why: "It is the interface contract, and producing a good one is a disproportionate amount of the value a firmware engineer adds to an integration." },

    { q: "Which test value exposes a word-order mistake in a 32-bit Modbus value, and which one hides it?",
      a: ["0x00000001 exposes it; 0x12345678 hides it", "0x12345678 exposes it; 0x00000001 can pass by accident", "Both expose it equally", "Neither; word order can only be checked against the specification"],
      c: 1,
      why: "Test with a value whose halves differ, or the bug survives testing and appears at commissioning." },
  ],

  /* -------------------------------------------------------------- 70-the-cv --- */
  "70-the-cv": [
    { q: "Why does an applicant tracking system require you to write both 'C/C++' and 'C, C++' on a CV?",
      a: ["To fill space in the skills section", "Because it matches literal strings and will not expand one spelling into the other", "Because recruiters prefer the second form", "Because the two forms mean different things technically"],
      c: 1,
      why: "The same applies to RTOS and FreeRTOS, STM32 and ARM Cortex-M, seriale and UART and RS-485. The advert itself is the keyword list, already written for you." },

    { q: "Which CV formatting choices actually break automated parsing?",
      a: ["Using a serif font and one page", "Multi-column layouts, image-based PDFs, skill rating graphics, and information inside headers or footers", "Listing dates in reverse chronological order", "Including a photograph"],
      c: 1,
      why: "A multi-column layout parses into interleaved nonsense, and a rating graphic parses as nothing and means nothing to a human either." },

    { q: "What does a firmware lead read a junior CV for?",
      a: ["The length of the technology list", "One thing the candidate actually built that can be discussed for twenty minutes", "The university attended", "Certifications"],
      c: 1,
      why: "The list gets you past the filter; the project gets you the offer. One real project beats eleven listed technologies every time." },

    { q: "What is the test for whether a bullet belongs on your CV?",
      a: ["Whether it uses a keyword from the advert", "Whether you would be glad to be asked about it for twenty minutes", "Whether it contains a number", "Whether it fits on one line"],
      c: 1,
      why: "A CV full of numbers you cannot defend is worse than a vague one, because every noun on it is now a question the interviewer may ask." },

    { q: "Why should personal work sit under a heading such as PROGETTI PERSONALI?",
      a: ["To keep the CV to one page", "Because the heading disambiguates for free, and a bullet phrased like a job description will otherwise be read as employment", "Because recruiters skip unlabelled sections", "Because it is required by the Europass format"],
      c: 1,
      why: "Writing something like 'firmware development for industrial cooling systems' without that heading reads as employment, and a recruiter will read it that way." },

    { q: "Why is 'C++: avanzato' in a self-assessment table a bad idea even for a strong candidate?",
      a: ["Because self-assessment tables are not read", "Because it costs nothing to type and a great deal to defend, inviting questions the candidate did not want", "Because C++ should never be listed for embedded roles", "Because levels must follow the CEFR scale"],
      c: 1,
      why: "Drop the levels and let the project section carry the evidence. If a form forces a level, be one notch more conservative than you feel." },

    { q: "Why is listing STM32 without having opened CubeIDE specifically dangerous for this advert?",
      a: ["Because STM32 is not actually used by the company", "Because it is the advert's one hard technical gate, so the first follow-up will be something concrete about the tool", "Because the ATS rejects the term", "Because STM32 implies you also claim Cortex-M7"],
      c: 1,
      why: "Questions about the .ioc file, code regeneration overwriting your edits, or HAL versus LL are trivial to survive if you have used the tool and unsurvivable if you have not." },

    { q: "What does roughly fifty euro of hardware change about what you may claim?",
      a: ["Nothing; claims depend on employment only", "It moves you from 'has studied the model' to 'has built and debugged something', which is a different and defensible band", "It lets you claim production experience", "It replaces the need for a project section"],
      c: 1,
      why: "A Nucleo, a breadboard, a USB-serial adapter and a cheap logic analyser is the cheapest upgrade available anywhere in this course." },

    { q: "Which claims does this course alone not support?",
      a: ["Understanding of the Cortex-M exception model", "Bring-up of a board nobody has run before, a shipped product, a field return diagnosed from a log, or certification", "Knowledge of RTOS failure modes", "Understanding of protocol framing"],
      c: 1,
      why: "Do not imply any of them, and check that no bullet's phrasing implies them either." },
  ],

  /* ------------------------------------------------------- 71-the-interview --- */
  "71-the-interview": [
    { q: "What does RAL mean and how is it converted to a monthly figure under this advert's contract?",
      a: ["Net annual pay, divided by 12", "Annual gross before tax and employee contributions, excluding TFR, divided by 13 because the contract has 13 mensilita", "Monthly gross multiplied by 14", "Annual gross including TFR, divided by 12"],
      c: 1,
      why: "A RAL of 28,000 is about 2,154 euro gross per month, which matches the advert's own stated 2,000 to 2,800 band." },

    { q: "Why should you ask for the livello and not only the RAL?",
      a: ["Because the livello determines the job title", "Because the level sets your future contractual minimums and your position in any company-wide increase", "Because the RAL is fixed by law at each level", "Because HR cannot discuss RAL before the level is agreed"],
      c: 1,
      why: "Within CCNL Metalmeccanica a junior engineer typically enters around D1 or D2 in the current level structure." },

    { q: "What is apprendistato professionalizzante, and what does it oblige the employer to do?",
      a: ["A fixed-term contract with no training obligation", "A permanent contract with a training period, available up to age 29, obliging the employer to provide structured training and a tutor in exchange for under-level pay and contribution relief", "An unpaid internship of up to six months", "A probation period that can be extended indefinitely"],
      c: 1,
      why: "For a role advertised as a percorso di formazione, asking what the training plan actually contains is a fair question rather than a hostile one." },

    { q: "The advert says 'Contratto a tempo determinato iniziale'. What single question should that prompt?",
      a: ["Whether the contract can be made permanent immediately", "How many of the company's recent fixed-term hires were confirmed", "Whether overtime is paid", "Whether the probation period counts toward the term"],
      c: 1,
      why: "A company that converts everybody will say so happily, and the word 'iniziale' implies intent to convert." },

    { q: "Why is naming a salary figure below the advert's published band a mistake?",
      a: ["It signals flexibility, which helps", "Nobody will offer more than you ask, so it costs several thousand euro a year and does not make you a safer hire, only a cheaper one", "It violates the CCNL minimum", "Recruiters automatically round it up to the band"],
      c: 1,
      why: "Anchor inside their own published band, which is unarguable, and put the level and the training plan on the table at the same time." },

    { q: "Besides base pay, which elements of a Metalmeccanica package are negotiable and often easier for a company to concede?",
      a: ["Only the notice period", "Buoni pasto, premio di risultato, flexible hours, training budget, and who pays for hardware and licences", "Only the number of mensilita", "Nothing; the CCNL fixes everything"],
      c: 1,
      why: "Meal vouchers are common in this sector and untaxed up to a limit, and several of these are cheaper for a company to say yes to than base pay." },

    { q: "In a technical round for a training role, what is the best response to a question you cannot answer?",
      a: ["A confident guess, since hesitation looks weak", "What you do know that is adjacent, how you would find out, and an explicit statement of the boundary", "Changing the subject to something you do know", "Asking to skip the question"],
      c: 1,
      why: "Confident-wrong is genuinely disqualifying at a bench, where being wrong costs a day and a board." },

    { q: "What is TFR and how does it relate to the RAL quoted in an advert?",
      a: ["It is part of the RAL and is paid monthly", "It is severance accrued at roughly one month's pay per year, paid on leaving, and it sits on top of the RAL", "It is the employer's pension contribution and is not accessible to the employee", "It is a bonus paid only on redundancy"],
      c: 1,
      why: "You also choose whether it stays with the company or is directed to a pension fund." },

    { q: "Why is arriving with no questions for the interviewer described as the cheapest avoidable mistake in the hour?",
      a: ["Because it shortens the interview", "Because the questions are the part of the hour you control, and good ones demonstrate knowledge better than answering does", "Because HR scores candidates on question count", "Because it prevents you from learning the salary"],
      c: 1,
      why: "Asking which protocol they use toward customer PLCs, or how they know which firmware binary is on a machine in the field, is a question only somebody who has thought about the work asks." },
  ],

});
