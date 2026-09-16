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

  /* -------------------------------------------------- 23-memory-mapped-io --- */
  "23-memory-mapped-io": [
    { q: "What is a peripheral register, physically?",
      a: ["A special CPU register reserved for input and output", "A fixed address inside the peripheral region, wired to logic rather than to memory cells, accessed with ordinary load and store instructions", "A memory location the DMA controller owns", "A cache line reserved by the bus matrix"],
      c: 1,
      why: "There is no special I/O instruction on ARM, unlike x86. The instruction is the same one you use for a variable; only the effect differs." },

    { q: "How does the CMSIS peripheral struct overlay work?",
      a: ["The compiler generates accessor functions for each register", "The struct member offsets are laid out to match the hardware register offsets exactly, and a pointer to the struct is defined at the peripheral base address", "The linker places the struct at the peripheral address at build time", "The MPU maps the struct onto the peripheral region at runtime"],
      c: 1,
      why: "So a member access compiles to a single store to a fixed address. Matching every member against the reference manual's register map table once makes the headers stop being magic." },

    { q: "What do the CMSIS qualifiers for a read-write and a read-only register expand to?",
      a: ["inline and static respectively", "volatile and volatile const respectively", "register and const respectively", "extern and static respectively"],
      c: 1,
      why: "This is why a poll loop on a status register works without you writing volatile yourself, and volatile const is exactly the read-only status register." },

    { q: "Why can inserting a debug read of a status register make a bug disappear?",
      a: ["The read slows the code down enough to avoid a race", "Many status flags are clear-on-read, so the read consumed the event your code was waiting for", "The read forces a cache flush", "The compiler reorders the surrounding code"],
      c: 1,
      why: "It also makes stepping in a debugger misleading, because some debuggers read peripheral views automatically." },

    { q: "Why is clearing a bit by ANDing with its complement wrong for a write-one-to-clear register?",
      a: ["It is too slow on a 32-bit bus", "It writes zero to the bit you meant, which does nothing, and writes one back to every other currently-set flag, clearing events you never saw", "It is not atomic with respect to interrupts", "It fails only on read-only registers"],
      c: 1,
      why: "For a write-one-to-clear register, write a plain mask containing only the bit you intend." },

    { q: "Why does the GPIO set-reset register exist when the output data register can already set and clear pins?",
      a: ["It is faster to decode", "It gives an atomic set or clear in one store, with no read-modify-write to race with an interrupt touching another pin on the same port", "It can address more pins", "The output data register is read-only on newer parts"],
      c: 1,
      why: "Writing bit n sets pin n and writing bit n plus 16 clears it. Using exclusive-or on the output data register is the read-modify-write bug in its most common disguise." },

    { q: "You write a peripheral register, read it back, and it is still zero. What is the most likely cause?",
      a: ["The register is write-only", "The peripheral's clock enable bit has not been set, so the registers do not exist: writes vanish and reads return zero with no fault", "The MPU is blocking the access", "The address is misaligned"],
      c: 1,
      why: "It is the most common single hour lost by somebody new to the part, and it is invisible because the code itself is correct." },

    { q: "Why do generated STM32 projects read the clock-enable register back immediately after setting an enable bit?",
      a: ["To confirm the write succeeded for error handling", "Because the write travels through a bus bridge and on several families an immediate access to the freshly-enabled peripheral can be lost, which is documented in the errata", "To flush the data cache", "Because the compiler would otherwise remove the write"],
      c: 1,
      why: "It is not superstition, and it is a good reason to read what CubeMX generates rather than skipping past it." },
  ],

  /* --------------------------------------------------- 24-startup-to-main --- */
  "24-startup-to-main": [
    { q: "What does a Cortex-M core read from the first two words of the vector table on reset?",
      a: ["A magic number and a checksum", "The initial Main Stack Pointer and the address of the reset handler", "The address of main and the size of the image", "The clock configuration and the flash wait states"],
      c: 1,
      why: "The hardware loading the stack pointer is unusual, and it is why C code can run immediately without a software bootstrap setting the stack pointer first." },

    { q: "Why are interrupt handlers on STM32 called by exact names such as USART1_IRQHandler?",
      a: ["The compiler recognises the naming convention", "The startup file defines the vector table with those symbols, each declared weak and aliased to an infinite loop, so a function you define with the right name replaces it at link time", "CubeMX registers them at runtime", "The NVIC looks up handlers by name"],
      c: 1,
      why: "Misspell it and your handler is never called, with no compiler warning and no linker error, while the interrupt lands in the default handler forever." },

    { q: "Why does an initialised global cost both flash and RAM while a const one costs only flash?",
      a: ["The compiler duplicates const data for speed", "The initialised global's value is stored in flash and copied into SRAM by the startup code, whereas const data stays in flash and is read from there", "Const data is compressed", "Initialised globals are allocated twice in RAM"],
      c: 1,
      why: "That copy loop, from the load address to the virtual address, is step one of the reset handler." },

    { q: "Where does the C guarantee that globals start at zero actually come from?",
      a: ["The compiler emits initialisation code at the top of main", "The startup code writes zeros across the bss section before main runs", "The hardware clears SRAM on reset", "The linker stores zeros in flash for those variables"],
      c: 1,
      why: "It is also why the guarantee does not extend to local variables, which nobody zeroes." },

    { q: "Why must the clock setup routine configure flash wait states before raising the main clock?",
      a: ["To reduce power consumption during the transition", "Because running the core faster than the flash can supply instructions without added wait states reads garbage from flash", "Because the PLL cannot lock otherwise", "Because the clock security system requires it"],
      c: 1,
      why: "Ordering matters here in a way that is easy to get wrong when hand-writing clock setup." },

    { q: "What does the libc init array call do, and why does it matter in C++?",
      a: ["It zeroes the heap, which matters for new", "It runs the constructors of file-scope C++ objects, which is why static C++ objects work at all and why their order across translation units is unspecified", "It registers exception handlers", "It initialises the standard library's locale tables"],
      c: 1,
      why: "That unspecified cross-file ordering is the static initialisation order problem." },

    { q: "Why do firmware main functions end in an infinite loop rather than returning?",
      a: ["The compiler requires it", "main is an ordinary function and nothing in the hardware knows its name, so if it returns control falls into whatever the startup file does next", "Returning triggers a HardFault", "The linker removes code after a return"],
      c: 1,
      why: "There is no operating system to return to." },

    { q: "A board resets repeatedly, returning to the reset vector. What is the most likely cause and how do you confirm it?",
      a: ["A stack overflow; check the stack watermark", "The watchdog is resetting before initialisation completes; check the reset-cause flags, which survive the reset", "A HardFault; read the fault status registers", "Brown-out; measure the supply rail"],
      c: 1,
      why: "Logging the reset cause at the top of main is five lines that pay for themselves on the first field return." },

    { q: "What is the safe rule about what the early clock setup routine may touch?",
      a: ["It may use any global, since it runs first", "Only hardware registers and local variables, never initialised globals, because whether the data section has been copied yet varies between startup files", "Only const data", "Only variables declared volatile"],
      c: 1,
      why: "Check your startup file's actual ordering before assuming either way." },
  ],

  /* ------------------------------------------------------------------ 27-dma --- */
  "27-dma": [
    { q: "What is a DMA controller, in terms of the bus?",
      a: ["A coprocessor that executes copy instructions on behalf of the CPU", "A second bus master that arbitrates alongside the core, so a transfer steals bus cycles but costs no instructions and no interrupt per byte", "A cache that prefetches peripheral data", "A dedicated memory region for peripheral buffers"],
      c: 1,
      why: "The distinction matters: it is not free, but what it saves is CPU time and interrupt overhead rather than bus bandwidth." },

    { q: "What does circular DMA mode do, and what is it for?",
      a: ["It retries failed transfers automatically", "On reaching the end of the buffer it wraps to the start and continues forever, which is what makes a receive ring buffer work with no CPU involvement", "It alternates between two peripherals", "It reverses the transfer direction at the end"],
      c: 1,
      why: "Combined with the UART idle-line interrupt it gives one interrupt per message rather than one per byte." },

    { q: "Why is the DMA half-transfer interrupt useful in circular mode?",
      a: ["It reports transfer errors early", "It lets you process the first half of the buffer while the controller is still filling the second, which is a double buffer using one buffer", "It halves the interrupt rate", "It signals that the peripheral clock has stabilised"],
      c: 1,
      why: "It is the standard idiom for continuous ADC sampling and audio, and forgetting it means the first half is overwritten while you are still reading it, at high rates only." },

    { q: "How do you determine how many bytes a DMA transfer has received so far?",
      a: ["Read a transferred-count register that counts up", "Subtract the remaining-count register, which counts down, from the buffer size", "Poll the peripheral's data register", "Compare the buffer against a known pattern"],
      c: 1,
      why: "That is precisely how the Modbus idle-line technique measures a variable-length frame." },

    { q: "Why must a DMA buffer never be a local array in a function that returns?",
      a: ["Local arrays are not aligned correctly", "The controller keeps writing into stack memory that other code is now using, which is a use-after-free with hardware doing the writing", "The compiler places locals in a section DMA cannot reach", "Local arrays cannot be declared volatile"],
      c: 1,
      why: "DMA buffers are static or file-scope, always." },

    { q: "Why can a DMA transfer silently fail on an STM32F4 or H7 depending on where the buffer is placed?",
      a: ["Because the buffer crosses a flash boundary", "Because some memories are unreachable by the DMA controller: the core-coupled RAM on F4, and the tightly-coupled data RAM for the main controllers on H7", "Because SRAM is write-protected by default", "Because the MPU blocks peripheral access by default"],
      c: 1,
      why: "It is a linker-script question, and it is the second most common DMA failure after buffer lifetime." },

    { q: "On a Cortex-M7 with the data cache enabled, what must you do around a DMA receive and a DMA transmit?",
      a: ["Nothing; the cache is coherent with DMA", "Invalidate the cache range after a receive completes and before reading, and clean it before starting a transmit", "Clean after receive and invalidate before transmit", "Disable interrupts around both"],
      c: 1,
      why: "The cache sits between the core and the bus while DMA sits on the bus, so on receive the core reads a stale line and on transmit DMA reads SRAM while the data is still in cache." },

    { q: "Why must a buffer subject to cache maintenance be 32-byte aligned and a multiple of 32 bytes?",
      a: ["Because DMA requires 32-byte transfers", "Because the clean and invalidate operations work on whole cache lines, so a partially covered line would corrupt a neighbouring variable", "Because the MPU regions have that granularity", "Because the bus matrix transfers in 32-byte bursts"],
      c: 1,
      why: "An MPU region marking the DMA buffers non-cacheable avoids the whole class of problem and is usually the better choice." },

    { q: "What is the characteristic symptom of a DMA cache-coherency bug?",
      a: ["An immediate HardFault on the first transfer", "It works in debug, works with small buffers, works most of the time, and corrupts occasionally under load", "The DMA transfer-error flag is set every time", "The peripheral stops generating requests"],
      c: 1,
      why: "That signature is the worst kind, because every quick test passes and the failure only appears in the field." },

    { q: "Why does a DMA request sometimes fail to trigger at all on an STM32F4-class part?",
      a: ["The peripheral clock is disabled", "Each peripheral can only reach certain channels or streams, fixed by a table in the reference manual, and a newer family's request multiplexer removes the restriction", "The DMA controller must be reset before each transfer", "The transfer width must match the bus width"],
      c: 1,
      why: "It is a common source of a DMA that never triggers on older families, and a non-problem on parts with a request multiplexer." },
  ],

});
