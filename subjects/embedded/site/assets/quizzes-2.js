/* ==========================================================================
   quizzes-2.js -- the question bank, part 2.

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
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {

  /* ----------------------------------------------- 30-cube-hal-ll-registers --- */
  "30-cube-hal-ll-registers": [
    { q: "What is CubeMX, and what is its most valuable output?",
      a: ["A compiler, whose main output is optimised code", "A configurator that emits an .ioc project file and initialisation code; its real value is the clock-tree solver and the pin-conflict checker", "A debugger front end for ST-LINK", "A peripheral library that replaces the HAL"],
      c: 1,
      why: "Working out PLL dividers by hand from the reference manual is slow and error-prone, and refusing the tool to prove a point costs a day and gets the clock wrong." },

    { q: "What is the LL layer on STM32, and how does it differ from the HAL?",
      a: ["An older version of the HAL, now deprecated", "Thin inline functions over the registers with near-zero overhead, per-peripheral rather than portable across the range", "A hardware-in-the-loop test harness", "The assembly startup code"],
      c: 1,
      why: "Most people do not know LL exists, so mentioning it in an interview is a good signal on its own." },

    { q: "What is the correct shape of an answer to 'do you use the HAL?'",
      a: ["Always the HAL, because portability matters most", "Never the HAL, because real engineers use registers", "A criterion: the HAL where convenience is free, LL or registers where timing, size or control matters", "It depends only on the size of the flash"],
      c: 2,
      why: "There is a wrong confident answer in both directions. Stating the criterion is what shows you have made the decision rather than inherited it." },

    { q: "Why is HAL_Delay inside an interrupt handler worse than merely slow?",
      a: ["It allocates memory", "It depends on the SysTick interrupt, which the running handler may be blocking, so it can hang the system outright", "It is not linked in release builds", "It disables the MPU"],
      c: 1,
      why: "It is a specific case of the general rule that an interrupt handler must never block on something that an interrupt delivers." },

    { q: "What happens to code you add to main.c outside the USER CODE markers when the project is regenerated from the .ioc file?",
      a: ["It is preserved and moved to the end of the file", "It is overwritten and lost", "The generator refuses to run", "It is commented out for review"],
      c: 1,
      why: "Three habits make it a non-issue: keep the application out of main.c entirely, commit before regenerating, and move anything that must survive into a marker block." },

    { q: "Why write to the BSRR register rather than to ODR when setting a GPIO pin?",
      a: ["BSRR is faster to type", "BSRR sets and clears atomically in one store, while writing ODR is a read-modify-write that can lose a concurrent change from an interrupt", "ODR is read-only on most STM32 parts", "BSRR does not require the peripheral clock to be enabled"],
      c: 1,
      why: "It is the same read-modify-write race that appears whenever two contexts touch one register." },

    { q: "When is using the HAL a perfectly good engineering decision?",
      a: ["Never in a professional project", "For anything not in a hot path, such as initialisation, a configuration EEPROM or a status LED", "Only for GPIO", "Only when the project has more than 512 KB of flash"],
      c: 1,
      why: "Being productive is a real engineering value, and the code is readable by whoever maintains it next." },

    { q: "What is CubeIDE?",
      a: ["A cloud build service for STM32", "Eclipse bundled with CubeMX, the arm-none-eabi GCC toolchain and a GDB front end for ST-LINK, free of charge", "A proprietary compiler sold per seat", "A hardware programmer"],
      c: 1,
      why: "When an advert says 'ambiente di sviluppo STM32', this is most likely what it means." },
  ],

  /* ------------------------------------------ 40-queues-semaphores-mutexes --- */
  "40-queues-semaphores-mutexes": [
    { q: "What is the one question that picks between a queue, a semaphore and a mutex?",
      a: ["Which one the RTOS implements most efficiently", "Am I moving data, announcing an event, or protecting a resource", "How many tasks are involved", "Whether an interrupt is involved"],
      c: 1,
      why: "Those three questions map onto the three tools and almost never give an ambiguous answer." },

    { q: "Why does an RTOS queue transfer items by copy rather than by reference?",
      a: ["Because copying is faster than pointer arithmetic", "Because the sender may reuse or destroy its buffer immediately afterwards, so there is no lifetime question, and fixed capacity and item size make it safe without a heap", "Because pointers cannot be passed between tasks", "Because the kernel cannot dereference application pointers"],
      c: 1,
      why: "For large items you queue a pointer to a block from a pool instead, and ownership becomes your problem again. That is the trade." },

    { q: "What is wrong with using a binary semaphore plus a shared global variable to pass data between tasks?",
      a: ["Nothing; it is the standard pattern", "It is a badly written queue, with a race between the signal and the write", "Semaphores cannot be used between tasks", "It requires disabling interrupts"],
      c: 1,
      why: "If you are moving data, use a queue and stop there." },

    { q: "What does a mutex have that a semaphore does not, and why does it matter?",
      a: ["A larger internal buffer", "An owner, which is what makes priority inheritance possible because the kernel knows whom to promote", "A timeout parameter", "The ability to be taken from an interrupt"],
      c: 1,
      why: "It is the concrete reason 'mutex for mutual exclusion, semaphore for signalling' is a rule rather than a stylistic preference." },

    { q: "When is a counting semaphore the right choice?",
      a: ["Whenever more than two tasks are involved", "When counting events, or managing a pool of N identical interchangeable resources", "When data must be transferred", "When the resource must be protected from an ISR"],
      c: 1,
      why: "A binary semaphore does not count beyond one: two gives before a take are indistinguishable from one." },

    { q: "What is a task notification, and when does it replace a binary semaphore?",
      a: ["A logging mechanism for task state changes", "A value and state held inside the task's own control block, faster and smaller than a semaphore for the case of an ISR waking one specific task", "A way to broadcast to all tasks at once", "A priority change request"],
      c: 1,
      why: "The limitation is in the name: it targets one task, so it cannot be a broadcast or a many-to-one queue." },

    { q: "Two tasks each take two mutexes in opposite orders. What happens, and what fixes it?",
      a: ["Priority inheritance resolves it automatically", "Deadlock, and no primitive fixes it: the fix is a global lock ordering, or restructuring so one owning task holds both resources", "The kernel detects it and returns an error", "The lower-priority task is killed"],
      c: 1,
      why: "Nothing reports an error. The system simply goes quiet, which is why a watchdog is not optional." },

    { q: "Why should every blocking take use a timeout rather than waiting forever?",
      a: ["Because infinite waits are not supported by most kernels", "Because a task blocked for ever is invisible, whereas one that times out can log, recover or trip the watchdog", "Because timeouts reduce context-switch overhead", "Because the scheduler deletes tasks blocked longer than one tick"],
      c: 1,
      why: "It converts a silent hang into a diagnosable event, which is most of what debugging a deployed system depends on." },

    { q: "What does it mean if one task takes a mutex and a different task gives it back?",
      a: ["It is a valid optimisation for producer-consumer patterns", "It is a signalling scheme wearing a mutex's clothes, and a well-behaved kernel will refuse or assert; a semaphore was wanted", "It is required for priority inheritance to work", "It converts the mutex to a recursive mutex"],
      c: 1,
      why: "Ownership is the whole point of a mutex, and a give from a non-owner breaks it." },
  ],

  /* ----------------------------------------------------------------- 46-uart --- */
  "46-uart": [
    { q: "In a UART, what synchronises the receiver, given that there is no clock line?",
      a: ["A preamble byte sent before each message", "The falling edge of the start bit, on every character", "A shared crystal between the two devices", "The parity bit"],
      c: 1,
      why: "Both ends must already agree the bit time, which is the baud rate. The start bit only says when to begin counting." },

    { q: "How many bit-times does one byte take in 8N1 format, and why does the answer matter for Modbus?",
      a: ["8, which is why Modbus timings are in bytes", "10, and 8E1 or 8N2 is 11, which is the character time Modbus frame timing is built on", "9, including the parity bit", "12, including a guard interval"],
      c: 1,
      why: "Modbus RTU's 3.5-character silence is computed from that 11-bit character, which is why the protocol keeps two stop bits when parity is not used." },

    { q: "Roughly how much total clock error can a UART link tolerate between the two ends?",
      a: ["About 10 percent", "About 2 to 3 percent", "About 0.01 percent", "Any error, because the receiver resynchronises on every bit"],
      c: 1,
      why: "The receiver resynchronises once per character, not once per bit, so error accumulates across the character. It is why an internal RC oscillator is often not good enough over temperature." },

    { q: "A UART link works at 9600 baud and produces garbage at 115200 with the same code. What is the most likely cause?",
      a: ["A faulty cable", "Baud-rate error from the clock divider at that combination of clock frequency and baud rate", "An unhandled parity error", "The receive buffer being too small"],
      c: 1,
      why: "The reference manual tabulates the resulting error per baud rate per clock frequency. This is the single most common cause of a UART that sends garbage." },

    { q: "What does a UART framing error tell you specifically?",
      a: ["A byte arrived before the previous one was read", "The stop bit was not high, which means the wrong baud rate or a line cut mid-character", "A bit flipped, detected by parity", "The oversampling votes disagreed"],
      c: 1,
      why: "Framing, parity, noise and overrun each name a different fault. Logging which one occurred turns an unhelpful report into a diagnosis." },

    { q: "Whose fault is a UART overrun error, and what does it do on most STM32 parts?",
      a: ["The transmitter's; the peripheral requests a retransmission", "Yours: a byte arrived before you read the previous one, and reception then stops until the flag is cleared", "The cable's; it indicates electrical noise", "Nobody's; it is informational only"],
      c: 1,
      why: "The symptom is a link that works and then silently dies under load, and clearing it on several families requires reading the status register and then the data register in that order." },

    { q: "At roughly what point does one interrupt per received byte stop being a viable strategy?",
      a: ["Above 9600 baud", "Around a hundred thousand interrupts per second, for example 921600 baud, by which point the CPU is largely servicing the UART", "Only when more than one UART is in use", "It never stops being viable on a Cortex-M4"],
      c: 1,
      why: "The cost is fixed per byte: entry, exit and its share of latency, multiplied by the byte rate." },

    { q: "How does circular DMA plus idle-line detection let you receive a variable-length message?",
      a: ["The DMA controller parses the message and reports its length", "The IDLE interrupt fires when the line goes quiet, and you compute the received length from the DMA's remaining-count register", "The transfer-complete interrupt fires at the end of each message", "The UART inserts a length prefix automatically"],
      c: 1,
      why: "One interrupt per message instead of per byte, with the framing done in hardware, which is exactly what Modbus RTU's silence rule wants." },

    { q: "Why does halting at a breakpoint in a receive path cause overruns that never occur in a free-running system?",
      a: ["The debugger injects test data", "Halting the core does not stop the UART peripheral, so bytes keep arriving while nothing is reading them", "The debugger lowers the interrupt priority", "Breakpoints disable DMA transfers"],
      c: 1,
      why: "It is one instance of the general rule that stopping a core changes the behaviour you were trying to observe." },
  ],

});
