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


  /* ------------------------------------------------------ 21-whats-on-the-die --- */
  "21-whats-on-the-die": [
    { q: "What is the most useful way to think about a peripheral on a microcontroller?",
      a: ["A library function provided by the vendor", "A concurrent hardware state machine that keeps working while the core does something else", "A region of RAM the core copies data into", "A coprocessor that executes its own instructions"],
      c: 1,
      why: "The questions change accordingly: not did my function run, but is it enabled, is it clocked, what state is it in." },

    { q: "Which four groups of registers does essentially every peripheral have?",
      a: ["Input, output, clock and reset", "Control, status, data and configuration", "Address, length, mode and priority", "Enable, interrupt, buffer and flag"],
      c: 1,
      why: "Recognising the pattern is what lets you read a chapter of a reference manual about a peripheral you have never used." },

    { q: "Why does it matter how a peripheral status flag is cleared?",
      a: ["Because clearing it too often wastes CPU cycles", "Because a flag cleared by the wrong mechanism stays set, so the interrupt re-fires forever and the system appears to hang", "Because the flag must be cleared before the peripheral clock is enabled", "Because the debugger cannot read a set flag"],
      c: 1,
      why: "Write-one-to-clear, cleared by reading the data register, or a software sequence: the manual says which, and getting it wrong is a rite of passage." },

    { q: "Writes to a peripheral's registers appear to do nothing and read back as zero. What is the most likely cause?",
      a: ["The peripheral is faulty", "Its clock enable bit in the RCC was never set, so the writes are discarded with no fault", "The MPU is blocking the region", "The registers are write-only"],
      c: 1,
      why: "It is the commonest beginner failure in embedded work, it is completely silent, and reading a register back after configuring it turns the whole class of bug into an assertion." },

    { q: "Besides the core, what else can be a master on the internal bus matrix?",
      a: ["Nothing; the core is the only master", "DMA controllers, and on larger parts Ethernet and USB", "The flash controller only", "Only peripherals that are explicitly enabled as masters in software"],
      c: 1,
      why: "Which is why an idle CPU does not mean idle memory, and why a DMA transfer can slow the core down." },

    { q: "How long does one byte take at 115200 baud, 8N1, and why is that number worth knowing?",
      a: ["About 9 microseconds, which is why polling is usually fine", "About 87 microseconds, which is roughly 15000 instructions at 168 MHz, and that arithmetic is the argument for interrupts and DMA", "About 870 microseconds, which is why UARTs need DMA", "It depends on the compiler's optimisation level"],
      c: 1,
      why: "Ten bits at 115200 baud. Peripherals are enormously slow relative to the core, and every design decision about polling versus interrupts follows from that ratio." },

    { q: "Which document tells you what a specific part number actually has on it, such as pinout and package?",
      a: ["The reference manual", "The datasheet", "The programming manual", "The errata sheet"],
      c: 1,
      why: "Reference manual for the peripherals and their registers, per family; programming manual for the core, usually ARM's; errata for where the silicon disagrees with all of them." },

    { q: "What distinguishes a microcontroller from a microprocessor?",
      a: ["Clock speed", "The microcontroller has memory and peripherals on the same die, boots from internal flash in microseconds and runs without an OS or MMU", "The microcontroller cannot run C code", "The microprocessor has no interrupts"],
      c: 1,
      why: "Embedded Linux on a CV means the second kind of part, and conflating the two in an interview is a visible mistake." },

    { q: "A peripheral's configuration setting silently does not take effect. What should you suspect?",
      a: ["The compiler optimised the write away", "That register is write-protected while the peripheral is enabled, as the reference manual states in one easily skimmed sentence", "The value was out of range and was clamped", "The peripheral needs a reset before every write"],
      c: 1,
      why: "Along with a disabled clock and the wrong alternate function, it is one of the correct-code-wrong-prerequisite family, and all of them are found by reading registers back." },

    { q: "Where should you look first when a peripheral behaves unexpectedly?",
      a: ["A forum or a tutorial for the same peripheral", "The reference manual's register description for your part", "The vendor HAL's source code", "The errata sheet, before anything else"],
      c: 1,
      why: "A forum answer is somebody else's part, silicon revision and clock configuration. The register description is yours." },
  ],

  /* -------------------------------------------------------------- 22-cortex-m --- */
  "22-cortex-m": [
    { q: "In the ARM calling convention on Cortex-M, where do the first four arguments and the return value travel?",
      a: ["On the stack, with the return value in R12", "In R0 to R3, with the return value in R0", "In R4 to R7, with the return value in R4", "In R0 to R3, with the return value on the stack"],
      c: 1,
      why: "R0 to R3 are caller-saved and R4 to R11 callee-saved. That one sentence is enough to read a disassembly and to write a C function called from assembly." },

    { q: "Why does Cortex-M have two stack pointers?",
      a: ["For redundancy in safety applications", "MSP is used by handlers and after reset, while PSP can give RTOS tasks their own stacks, which keeps interrupt usage off the task stacks", "One is for data and one for return addresses", "PSP is used only in unprivileged code on M0 parts"],
      c: 1,
      why: "It is exactly why an RTOS can have a separate interrupt stack, and why knowing which stack you are on is half of hard-fault debugging." },

    { q: "What does the core do automatically on exception entry?",
      a: ["Nothing; a wrapper written in assembly must save the registers", "It stacks eight words, namely R0 to R3, R12, LR, PC and xPSR, which are precisely the caller-saved registers", "It stacks all sixteen registers", "It switches to a separate register bank"],
      c: 1,
      why: "That hardware stacking is why a plain C function can be an interrupt handler with no special keyword and no assembly wrapper." },

    { q: "During debugging you see a value like 0xFFFFFFF9 in LR. What does it mean?",
      a: ["The stack is corrupted", "It is EXC_RETURN: the core is in a handler, and the value encodes which mode and stack to return to", "A function pointer was overwritten", "The core is executing from a reserved memory region"],
      c: 1,
      why: "On exception entry LR is loaded with a magic value rather than a return address. Seeing it is normal, not evidence of corruption." },

    { q: "What is tail-chaining?",
      a: ["Chaining DMA transfers so one starts when another ends", "Going straight from one exception handler to the next pending one without popping and pushing the stack frame", "Linking interrupt handlers into a single vector", "Deferring a low-priority interrupt until the main loop runs"],
      c: 1,
      why: "It makes back-to-back interrupts cheaper than the naive arithmetic suggests." },

    { q: "Why must the low bit of any code address on Cortex-M be 1?",
      a: ["To distinguish RAM addresses from flash addresses", "It is the Thumb bit, and Cortex-M executes only Thumb-2, so a cleared bit faults immediately", "To mark the address as privileged", "To satisfy the alignment requirement for instructions"],
      c: 1,
      why: "A function pointer with the low bit clear is a classic cause of a UsageFault, and the stacked PC makes it obvious." },

    { q: "After a hard fault, what is the fastest route to the cause?",
      a: ["Add printf statements and bisect the source", "Read the stacked PC to find the faulting instruction, then CFSR for the class and BFAR or MMFAR for the address", "Single-step from reset in the debugger", "Disable optimisation and rebuild"],
      c: 1,
      why: "The core has already written down what happened. Two minutes with the fault registers beats thirty minutes of guessing." },

    { q: "A BusFault reports an address in the 0x40000000 range. What is the usual explanation?",
      a: ["A stack overflow reaching into peripheral space", "A peripheral was accessed while its clock was disabled", "A DMA transfer with the wrong destination", "An MPU region was configured too small"],
      c: 1,
      why: "Peripheral space starts at 0x40000000, and an unclocked peripheral is the most common reason an access there faults." },

    { q: "What differs on a Cortex-M0 or M0+ that can break code written for an M4?",
      a: ["It has no interrupts controller", "It has no unaligned access and no bit-banding, and a reduced instruction set", "Its registers are 16-bit", "It cannot run C code compiled with GCC"],
      c: 1,
      why: "Migration downwards is where this bites: code that happily does an unaligned access on an M4 faults on an M0." },

    { q: "Why do DMA buffers need special treatment on a Cortex-M7?",
      a: ["Because the M7 has no DMA controller", "Because it has instruction and data caches, so the CPU can read stale data after a DMA write unless cache maintenance is performed", "Because its DMA cannot reach SRAM", "Because the M7 requires all buffers to be 32-byte aligned by the compiler"],
      c: 1,
      why: "And the debugger hides it, because the debugger reads memory directly rather than through the cache." },
  ],

  /* -------------------------------------------------------- 25-clocks-and-plls --- */
  "25-clocks-and-plls": [
    { q: "What is the state of every peripheral clock gate immediately after reset?",
      a: ["Enabled, so peripherals are ready to use", "Disabled, to save power, so a peripheral must be clocked before its registers respond", "Enabled only for peripherals on the AHB bus", "Undefined until the PLL locks"],
      c: 1,
      why: "Writes to an unclocked peripheral are discarded silently on most STM32 parts, which is why reading a register back is the fastest diagnostic there is." },

    { q: "In what order must flash wait states and core frequency be changed?",
      a: ["Frequency first, then wait states", "Wait states up before the frequency goes up, and down only after the frequency comes down", "They can be changed in any order", "Wait states must be set only once, at reset"],
      c: 1,
      why: "Flash is slower than the core. Running fast against a zero-wait-state setting is a hard fault at best." },

    { q: "Why must every wait for a clock ready flag have a timeout?",
      a: ["Because the flag can be set before the oscillator is stable", "Because a crystal that never starts otherwise hangs the board inside the clock configuration, before any diagnostics exist", "Because the RCC clears the flag automatically after a few milliseconds", "Because the watchdog cannot be started until the clock is ready"],
      c: 1,
      why: "Most published SystemClock_Config functions hang there. The fallback to the internal oscillator is what turns a dead crystal into a degraded mode instead of a dead board." },

    { q: "A timer's period comes out exactly double what you calculated. What is the classic explanation on STM32?",
      a: ["The prescaler register is a minus-one register", "A timer on an APB bus is clocked at twice the bus clock when that bus prescaler is not 1", "The timer is counting in centre-aligned mode", "The PLL multiplier was applied twice"],
      c: 1,
      why: "It is one line in the reference manual and it explains a large share of factor-of-two timing bugs." },

    { q: "Why is the internal RC oscillator marginal for asynchronous serial communication?",
      a: ["It cannot reach high enough frequencies", "At roughly plus or minus 1 percent over temperature it consumes most of the roughly 2 percent total error budget that a UART link allows between both ends", "It drifts only at start-up", "It cannot drive the UART peripheral clock at all"],
      c: 1,
      why: "It works on the bench at room temperature and fails in a hot cabinet. SPI and I2C carry their own clock, so accuracy does not matter there." },

    { q: "Besides oscillator error, what else contributes to baud rate error?",
      a: ["Nothing else", "The integer division of the peripheral clock to reach the target baud rate, which can be over 1 percent off by itself", "The length of the cable", "The number of stop bits configured"],
      c: 1,
      why: "The reference manual prints a table of realised rates and errors. The number you typed is not necessarily the number on the wire." },

    { q: "What does the Clock Security System do?",
      a: ["It prevents unauthorised changes to the clock configuration", "It detects an external oscillator that has stopped, switches back to the internal one and raises an NMI", "It disables peripheral clocks when the core sleeps", "It verifies the PLL lock range at start-up"],
      c: 1,
      why: "A machine whose crystal dies and silently keeps running at a different speed is doing something unpredictable at full power. The CSS turns that into a defined event." },

    { q: "Why must SystemCoreClock be updated after changing the clock tree?",
      a: ["The RCC reads it to configure the PLL", "Every delay and baud calculation in CMSIS-based code reads that variable, so a stale value makes timing wrong by a fixed ratio", "It is required by the HAL initialisation sequence", "Without it the debugger cannot compute breakpoint timing"],
      c: 1,
      why: "It is a plain C variable, not a hardware register, and nothing updates it for you unless you call the CMSIS helper." },

    { q: "How do you verify the clock frequency actually achieved on a board?",
      a: ["Read the PLL configuration registers back", "Route SYSCLK or HCLK to the MCO pin with a prescaler and measure it, or blink an LED from a timer set for exactly 1 Hz", "Trust CubeMX's clock view", "Compare the boot time against a known reference"],
      c: 1,
      why: "Thirty seconds, and it converts a belief into a measurement. Everything downstream depends on it being right." },

    { q: "Why can enabling a peripheral clock and writing its register in the very next instruction lose the write?",
      a: ["The compiler may reorder the two statements", "There is a documented delay between enabling a peripheral clock and being able to access the peripheral, which is why the HAL macros insert a read-back", "The write needs the peripheral to be reset first", "The RCC register is write-only"],
      c: 1,
      why: "ST's errata describe it. It is the subtler version of the disabled-clock trap, and it catches people who already know about the first one." },
  ],

  /* ----------------------------------------------- 28-low-power-and-watchdog --- */
  "28-low-power-and-watchdog": [
    { q: "What is the cheapest worthwhile low-power change in most firmware projects?",
      a: ["Lowering the core clock frequency", "Making the idle path __WFI() instead of a spin loop", "Disabling unused peripherals in software", "Switching from push-pull to open-drain outputs"],
      c: 1,
      why: "One line, no added complexity, and the core stops until the next interrupt with all state intact." },

    { q: "What distinguishes Standby mode from Sleep and Stop?",
      a: ["It is entered with WFE rather than WFI", "Waking from Standby is a reset, and RAM is lost apart from the backup domain", "It keeps peripherals clocked but stops the core", "It cannot be woken by the RTC"],
      c: 1,
      why: "So anything that must survive goes to backup registers or flash, and start-up code must be able to distinguish a power-on from a Standby wake-up." },

    { q: "Why can measuring current with a debugger attached mislead you?",
      a: ["The debugger adds a fixed offset that is easy to subtract", "SWD keeps the core powered and a halt can prevent the low-power mode being entered at all", "The debugger disables the internal regulator", "Current measurement requires the core to be halted"],
      c: 1,
      why: "And on a real board the consumption is often dominated by something outside the MCU entirely, such as regulator quiescent current or a bus pull-up." },

    { q: "Why is a floating input a low-power problem?",
      a: ["It raises the supply voltage seen by the core", "A floating CMOS input oscillates and can burn more current than the sleeping chip", "It prevents the core entering Stop mode", "It increases the wake-up time from Standby"],
      c: 1,
      why: "Unused pins go to analogue mode or get a defined pull. It is a one-line fix with a measurable effect." },

    { q: "Why is IWDG clocked from its own internal oscillator rather than the system clock?",
      a: ["To make its timing more accurate", "So it keeps counting even if the main clock tree has collapsed, which is precisely the failure it exists to catch", "To allow it to be disabled in software when needed", "Because the system clock is unavailable during flash writes"],
      c: 1,
      why: "The cost is accuracy: the LSI is only good to tens of percent, so the timeout must be chosen with that margin." },

    { q: "What is wrong with kicking the watchdog from a periodic timer interrupt?",
      a: ["Nothing, it is the most reliable place", "The ISR keeps running while the application is deadlocked, so the watchdog certifies that the timer works rather than that the application does", "It uses too much CPU time", "The watchdog cannot be kicked from an interrupt context"],
      c: 1,
      why: "It is always done for the most reasonable-sounding reason, namely that the main loop was occasionally too slow, and it neutralises the mechanism entirely." },

    { q: "What is the correct pattern for kicking a watchdog in an RTOS application?",
      a: ["Each task kicks the watchdog itself when it runs", "Each task reports that it ran, and a single supervisor kicks only when every task has reported within its expected period", "The idle task kicks it, since it runs whenever nothing else does", "The highest-priority task kicks it"],
      c: 1,
      why: "That turns one hung task into a reset, instead of a silent partial failure, and it lets a legitimately slow path declare its own longer deadline honestly." },

    { q: "Why should firmware read and record the reset cause at start-up?",
      a: ["Because the flags must be cleared before the watchdog can be re-enabled", "Because a product that resets periodically and cannot say why is one nobody can diagnose, while a watchdog-reset count is half a diagnosis already", "Because the bootloader needs it to decide which image to run", "Because the RCC will not start peripherals until the flags are read"],
      c: 1,
      why: "Power-on, pin, software, IWDG and WWDG are distinguishable, and counting them in non-volatile storage costs about twenty lines." },

    { q: "An IWDG runs from LSI, which stays alive in Stop mode. What does that mean for a device that sleeps for a long time?",
      a: ["The watchdog is suspended automatically during Stop", "The device will be reset by its own watchdog unless the period exceeds the sleep, or it wakes periodically just to kick", "Stop mode cannot be used with IWDG enabled", "The LSI stops, so the watchdog is harmless"],
      c: 1,
      why: "What is not acceptable is disabling the watchdog around the sleep, because the sleep path is where a hang is hardest to notice." },

    { q: "What is the honest limitation of a watchdog?",
      a: ["It only works while interrupts are enabled", "It is a recovery mechanism, not a correctness one: it converts a hang into a restart and cannot detect wrong output", "It cannot reset peripherals, only the core", "It requires an external supervisor chip to be trustworthy"],
      c: 1,
      why: "A device that restarts every thirty seconds and is counted as working is a hidden fault, not a protected system." },
  ],

  /* --------------------------------------------------- 29-the-stm32-family --- */
  "29-the-stm32-family": [
    { q: "In the part number STM32F407VGT6, what do the V and the G encode?",
      a: ["The voltage range and the silicon revision", "The pin count and the flash size", "The package and the temperature range", "The peripheral set and the core type"],
      c: 1,
      why: "V is 100 pins and G is 1 MB of flash. T is the LQFP package and 6 is the minus 40 to 85 degree range." },

    { q: "What usually eliminates candidate parts first in a real selection?",
      a: ["Clock speed", "The peripheral set, by count and kind, followed by whether the functions can actually be mapped onto available pins", "Unit price", "Flash size"],
      c: 1,
      why: "Each function appears only on certain pins through the alternate-function mux, so two functions you need can collide even on a part with plenty of pins." },

    { q: "Why can moving to a much faster core make a system less suitable for real-time work?",
      a: ["Faster cores have fewer interrupt priority levels", "Caches and a more complex bus matrix widen the spread between best and worst case, and real-time is about the worst case", "Faster cores cannot be clocked down", "The compiler cannot optimise for them as well"],
      c: 1,
      why: "The same argument as chapter 37: fast is not the same as predictable, and it is a good thing to be able to say in an interview." },

    { q: "How much flash headroom should a new project plan for?",
      a: ["None; buy exactly what fits", "Roughly half, because a bootloader, diagnostics and field update all arrive later", "Ten percent is standard practice", "As much as possible, since flash is free"],
      c: 1,
      why: "A project that fits in 100 percent of flash on day one does not fit on day two hundred." },

    { q: "Why is availability now treated as an engineering constraint rather than a purchasing detail?",
      a: ["Because distributors require design registration", "Because a technically perfect part with a fifty-week lead time is the wrong part, so choosing a family with pin-compatible alternatives is a risk control", "Because lifecycle status changes the errata", "Because lead time affects the unit price"],
      c: 1,
      why: "After the 2021 shortages nobody in this industry selects a part without checking longevity commitments and real lead times." },

    { q: "Which claim about porting code between STM32 families is accurate?",
      a: ["Code using only the HAL recompiles unchanged", "Peripherals with the same name are often different designs, so GPIO, ADC and cache behaviour differ in ways that compile cleanly and behave differently", "Only the clock configuration needs changing", "Porting requires changing only the linker script and the startup file"],
      c: 1,
      why: "What makes a port cheap is confining register access to the hardware layer, not choosing the same vendor." },

    { q: "What is the STM32MP1 line?",
      a: ["A low-power Cortex-M0+ family", "A Cortex-A part running Linux with a Cortex-M4 beside it, which is a different job from the rest of this course", "The automotive-qualified version of the F4", "A radio-enabled variant of the L4"],
      c: 1,
      why: "Keeping microcontroller work and embedded Linux work distinct on a CV matters, because they are different roles with different interviews." },

    { q: "Which STM32 family is aimed specifically at motor control and digital power?",
      a: ["F1", "G4, with its fast ADCs, advanced timers and comparators", "L0", "WB"],
      c: 1,
      why: "A cooling controller driving pumps and fans with feedback sits squarely in that space." },

    { q: "For learning this course, what hardware is a sensible minimum?",
      a: ["A full Eval board for the target family", "A Nucleo, a cheap logic analyser and a USB-to-RS485 adapter, roughly fifty euro in total", "Only a simulator, since no hardware is needed", "A custom board designed for the purpose"],
      c: 1,
      why: "That set unlocks the practical exercises in Parts 4 to 7, including talking Modbus RTU to your own board from a PC." },

    { q: "What can a development board not teach you?",
      a: ["Interrupt handling and DMA", "Board layout, EMC behaviour, a supply that sags when a relay closes, and connectors that vibrate loose", "Protocol implementation", "Clock configuration"],
      c: 1,
      why: "That boundary is stated on the front page of this course, and chapter 70 is about what it means for a CV." },
  ],

  /* ------------------------------------------------------------------ 31-gpio --- */
  "31-gpio": [
    { q: "What are the four GPIO modes on an STM32?",
      a: ["Read, write, bidirectional and tristate", "Input, output, alternate function and analogue", "Digital, analogue, interrupt and DMA", "Push-pull, open-drain, pull-up and pull-down"],
      c: 1,
      why: "Analogue mode disconnects the digital input buffer, which is both what the ADC needs and the lowest-power state for an unused pin." },

    { q: "Why does writing to ODR with a read-modify-write risk losing another pin's state?",
      a: ["ODR is write-only on some families", "The sequence is three operations, and an interrupt that changes a different pin in the same port between them is undone when the old value is written back", "The compiler may reorder the read and the write", "ODR is updated only at the next clock edge"],
      c: 1,
      why: "The bug appears occasionally and only under load, which is the worst possible signature." },

    { q: "How does the BSRR register work?",
      a: ["Writing a 1 toggles the corresponding pin", "The low 16 bits set pins and the high 16 bits reset them, with zeros ignored, so one write changes several pins atomically", "It mirrors ODR but is faster to access", "It sets the pin direction rather than its level"],
      c: 1,
      why: "No read is involved, so there is nothing for an interrupt to come between." },

    { q: "What is the difference between reading IDR and reading ODR?",
      a: ["They always return the same value on an output pin", "ODR is what you asked for, IDR is what the pin actually is, and on an open-drain output a difference means something external is holding the line", "IDR works only on input pins", "ODR reflects the pull-up configuration"],
      c: 1,
      why: "That difference is how a stuck I2C bus is detected." },

    { q: "What does the GPIO speed setting actually control?",
      a: ["The maximum frequency the pin can toggle at in software", "The slew rate of the output driver, trading edge speed against radiated emissions and ringing", "The sampling rate of the input buffer", "The current the pin can source"],
      c: 1,
      why: "Boards that fail EMC testing surprisingly often have every pin set to the fastest setting for no reason." },

    { q: "Why is open-drain required for I2C?",
      a: ["Because it is faster than push-pull", "Because several devices share the line and only pulling low, with a resistor providing the high, means no two drivers ever fight", "Because I2C uses 5 V signalling", "Because the internal pull-ups are only available in that mode"],
      c: 1,
      why: "It is also how a 3.3 V part can drive a 5 V input when the pin is five-volt tolerant and the other side has its own pull-up." },

    { q: "You reconfigure PA13 as a general-purpose output and the debugger can no longer connect. Why?",
      a: ["The pin is reserved for the internal reference", "PA13 is SWDIO, and the reconfiguration happens microseconds after reset, before a debugger can attach", "Configuring it triggers read protection level 2", "The port clock disables the debug interface"],
      c: 1,
      why: "The recovery is connect-under-reset, or booting the system bootloader with BOOT0. Everybody who has done it once checks the pin list forever after." },

    { q: "Why can two edge-triggered inputs not be on PA0 and PB0?",
      a: ["Both ports cannot be clocked simultaneously", "EXTI lines are shared by pin number across ports, so both map to EXTI0", "Port A has priority over port B in the NVIC", "PB0 cannot generate interrupts"],
      c: 1,
      why: "It is a schematic-level constraint discovered in firmware, and it is worth catching at review rather than after layout." },

    { q: "What is the correct way to debounce a mechanical contact?",
      a: ["A delay inside the interrupt handler", "Sampling on a periodic tick and requiring several consecutive agreeing samples, or ignoring changes for a settling period after the first edge", "Increasing the GPIO speed setting", "Enabling the internal pull-up and reading once"],
      c: 1,
      why: "A delay inside an ISR blocks everything else in the system, and it is the version everybody writes first." },

    { q: "A relay must stay open between power-on and the moment your initialisation code runs. Where does that requirement belong?",
      a: ["In the first lines of main, before anything else", "In the hardware: pins are inputs until configured, so a defined level in that window needs an external pull resistor", "In the bootloader", "In the option bytes"],
      c: 1,
      why: "Noticing this during a schematic review is one of the most useful contributions a firmware engineer makes to a board." },
  ],

  /* ------------------------------------------------------- 32-timers-and-pwm --- */
  "32-timers-and-pwm": [
    { q: "What is the update rate of a timer in terms of its registers?",
      a: ["f_clk divided by ARR", "f_clk divided by the product of PSC plus one and ARR plus one", "f_clk divided by PSC, times ARR", "f_clk divided by the sum of PSC and ARR"],
      c: 1,
      why: "Both are minus-one registers, which is responsible for a steady trickle of off-by-one frequency errors." },

    { q: "How should the split between prescaler and reload value be chosen?",
      a: ["Use the largest prescaler that works, to keep ARR small", "Use the smallest prescaler that keeps ARR inside the counter width, because the prescaler costs duty resolution", "They should be roughly equal", "Set the prescaler to zero whenever possible"],
      c: 1,
      why: "The same frequency with ARR at 9 instead of 999 gives ten duty steps instead of a thousand, and a fan that can only be driven in 10 percent jumps." },

    { q: "What does the preload bit on a PWM compare register prevent?",
      a: ["The output being stuck high after a duty change", "A glitched cycle when a new duty value is written after the counter has already passed it", "The timer being reconfigured while running", "Interrupt jitter on the update event"],
      c: 1,
      why: "With preload, the new value takes effect at the next update event. Without it, a smaller value written mid-cycle can produce a full-width pulse, which on a power stage is a real current spike." },

    { q: "What is dead-time insertion on an advanced timer for?",
      a: ["Filtering noise on the input capture pins", "Guaranteeing in hardware that the high-side and low-side switches of a bridge are never on simultaneously", "Delaying the start of PWM after a reset", "Inserting a gap between DMA transfers"],
      c: 1,
      why: "It is a hardware guarantee precisely because software cannot be trusted with it." },

    { q: "Why is input capture better than reading a pin in an interrupt for measuring pulse width?",
      a: ["It uses less flash", "The hardware latches the counter at the exact edge, so the measurement carries no software latency or jitter", "It does not require the timer clock to be enabled", "It can measure signals faster than the CPU clock"],
      c: 1,
      why: "PWM input mode goes further and captures period and width simultaneously using two channels on the same pin." },

    { q: "A capture-based period measurement is correct for fast signals and silently wrong for slow ones. Why?",
      a: ["The prescaler changes with frequency", "The counter wrapped more than once between captures, and unsigned subtraction only handles a single wrap", "The capture register overflows before it is read", "Slow signals do not trigger the capture edge"],
      c: 1,
      why: "Count update events to build a wider timestamp, or use a 32-bit timer. A slowly turning fan reporting high RPM is the classic symptom." },

    { q: "What should firmware do when no capture edge arrives at all?",
      a: ["Keep waiting, since the next edge must come eventually", "Treat it as a defined state such as stopped or disconnected, detected by a timeout", "Report the last valid measurement", "Reset the timer and retry indefinitely"],
      c: 1,
      why: "A measurement needs a defined out-of-range answer, and the absence of an event must be detectable in bounded time." },

    { q: "You enable a capture interrupt but never read CCR in the handler. What happens?",
      a: ["The capture value is lost but the system runs normally", "The flag stays set, so the interrupt re-fires immediately and the system appears to hang", "The timer stops counting", "The DMA request is raised instead"],
      c: 1,
      why: "The same status-flag family as chapter 21: know how each flag is cleared." },

    { q: "Why let a timer trigger the ADC rather than starting conversions in software?",
      a: ["It uses fewer ADC channels", "Samples are then taken at exact instants regardless of what the CPU is doing, which is what makes a control loop deterministic", "Software triggering is not supported on STM32", "It avoids needing DMA"],
      c: 1,
      why: "Software sampling jitters with whatever else the system was doing, and that jitter is invisible in the data and fatal to frequency analysis." },

    { q: "What is the general argument for replacing software delays with timers?",
      a: ["Timers use less flash than delay loops", "Hardware timing does not degrade under load, whereas a software delay is correct when idle and wrong exactly when the system is busy", "Delay loops are forbidden by MISRA", "Timers are more accurate at low frequencies only"],
      c: 1,
      why: "A spare timer free-running at 1 MHz is also the cheapest profiler in existence: read, call, read, subtract." },
  ],

  /* --------------------------------------------- 33-adc-and-the-analogue-chain --- */
  "33-adc-and-the-analogue-chain": [
    { q: "A 12-bit ADC measures against a 3.3 V supply specified at plus or minus 2 percent. What is the accuracy of the result?",
      a: ["About 0.02 percent, set by the resolution", "About 2 percent, because the whole chain is only as accurate as its reference", "About 0.1 percent after averaging", "It depends only on the sampling time"],
      c: 1,
      why: "Resolution is not accuracy. A 16-bit result on a 2 percent reference is a precisely reported wrong number." },

    { q: "What is a ratiometric measurement?",
      a: ["Measuring two channels and taking their ratio to cancel noise", "Powering the sensor from the same reference the ADC uses, so reference error cancels out of the result", "Scaling the raw count by a calibration ratio stored in flash", "Sampling at a rate proportional to the signal frequency"],
      c: 1,
      why: "It costs nothing and is frequently the right engineering answer when accuracy matters." },

    { q: "Why does a high source impedance cause low ADC readings?",
      a: ["The input leakage current drops the voltage", "The sample-and-hold capacitor charges through that impedance and does not reach the pin voltage within the configured sampling time", "The ADC reference sags under load", "The internal multiplexer attenuates high-impedance sources"],
      c: 1,
      why: "The datasheet states a maximum source impedance per sampling-time setting. A 100 k divider at the shortest setting reads low and looks like a calibration error." },

    { q: "Channel 2 of a scanned ADC appears to follow channel 1. What is the cause?",
      a: ["The channels are wired together on the board", "Charge is carried between channels because the sampling time is too short for the sample capacitor to settle on the new channel", "The DMA is writing results in the wrong order", "The channels were configured with different resolutions"],
      c: 1,
      why: "The cure is sampling time, not software, and adding 100 nF at the pin makes the whole problem smaller." },

    { q: "What can be done in software about aliasing?",
      a: ["Averaging removes it", "Nothing: anything above half the sampling rate returns disguised as a slow signal, and only a filter before the pin prevents it", "Increasing the ADC resolution removes it", "Sampling at random intervals removes it"],
      c: 1,
      why: "An RC low-pass before the pin is the only answer, and it is a schematic conversation rather than a firmware one." },

    { q: "By how much does averaging 16 samples reduce random noise, and what does it not help?",
      a: ["By 16 times, and it also removes periodic interference", "By about 4 times, the square root of N, and it does nothing against a periodic interferer such as mains or a switching supply", "By 2 times, and it removes aliasing", "It has no effect unless the samples are taken at different gains"],
      c: 1,
      why: "So 16 samples buy about two extra effective bits against noise, and zero bits against a 50 Hz interferer." },

    { q: "A reading is noisy. What should be done before adding a filter?",
      a: ["Increase the ADC resolution", "Capture raw samples and look at them, because a periodic pattern names an interferer while random scatter is genuine noise", "Add a moving average and confirm the display is stable", "Lower the sampling rate"],
      c: 1,
      why: "A filter added first does not remove the interference, it removes your ability to see it, and it will later hide a real measurement error." },

    { q: "How should a scaled measurement be stored and named in firmware?",
      a: ["As a float in volts, converted at the point of use", "As a scaled integer with the unit in the identifier, such as temp_c_x10, with a wide enough intermediate type in the arithmetic", "As the raw count, converted only for display", "As a fixed-point type defined by the vendor HAL"],
      c: 1,
      why: "Scaled integers are exact, are what a PLC expects, and keep floating point out of interrupt paths. The unit lives in the name or it lives in somebody's memory." },

    { q: "A raw reading sits at zero or at full scale. What does that usually mean?",
      a: ["The signal is genuinely at the limit of its range", "The sensor is probably disconnected or shorted, so it should be reported as a fault rather than as a plausible extreme value", "The ADC needs recalibration", "The sampling time is too long"],
      c: 1,
      why: "Reporting minus forty degrees because of a broken wire is worse than reporting a fault." },

    { q: "Why does industrial instrumentation use 4 to 20 mA rather than a voltage?",
      a: ["Because current is cheaper to generate", "Because a current loop is immune to voltage drop along a long cable, and 0 mA is distinguishable from a valid zero, so a broken wire is detectable", "Because ADCs measure current more accurately", "Because it allows multiple sensors on one pair"],
      c: 1,
      why: "The same instinct as a heartbeat counter: make the absence of a signal detectable rather than plausible." },
  ],

  /* ------------------------------------------------- 34-flash-and-bootloader --- */
  "34-flash-and-bootloader": [
    { q: "What is the asymmetry that shapes every flash-based design?",
      a: ["Reads are slower than writes", "Erase sets a whole sector to ones and is slow, while writing can only clear bits, so changing one byte back requires erasing its whole sector", "Writes must be aligned to 256-byte pages", "Flash can only be written once per power cycle"],
      c: 1,
      why: "Erase granularity plus write-only-clears is where the two-image layout, wear levelling and the power-cut rule all come from." },

    { q: "Why must the routine that writes flash sometimes run from RAM?",
      a: ["Because flash is read-protected during a write", "Because the flash is unreadable while being erased or written, so code executing from it, including any interrupt that can fire, would stall or fault", "Because the write routine is too large for flash", "Because the linker cannot place it in flash"],
      c: 1,
      why: "A sector erase takes tens to hundreds of milliseconds, which also has to fit inside the watchdog period." },

    { q: "What happens if read protection level 2 is set on an STM32?",
      a: ["Flash reads are blocked until the next power cycle", "The debug interface is disabled permanently and irreversibly, so the part can never be debugged again", "The chip mass-erases on the next debugger connection", "Option bytes become read-only but debugging still works"],
      c: 1,
      why: "Level 1 blocks debugger access and returning to level 0 mass-erases, which is the intended path. Level 2 is a production decision, never a development convenience." },

    { q: "What is the single design rule behind a safe field-update mechanism?",
      a: ["The update must complete within one watchdog period", "At every instant, including the instant power fails, a program that will run at the next power-up must still exist on the device", "The new image must be smaller than the old one", "The application must erase itself before receiving the new image"],
      c: 1,
      why: "A two-slot layout makes the switch atomic; a single-slot one is recoverable only because the bootloader survives and can ask for the image again." },

    { q: "What must a bootloader check before jumping to an application?",
      a: ["That the application's first instruction is valid Thumb code", "A magic number, a length and a CRC over the whole image, written into a header by the build process", "That the application was built with the same compiler version", "That the reset cause was not a watchdog reset"],
      c: 1,
      why: "That check is exactly what makes a half-written flash survivable rather than fatal." },

    { q: "An application runs correctly when flashed directly but crashes when launched by the bootloader. What is the classic cause?",
      a: ["The application was linked at the wrong optimisation level", "The bootloader left peripherals, interrupts or DMA enabled, so something fires into an application that has not installed its handlers yet", "The CRC check corrupted the first sector", "The stack pointer was not aligned to 8 bytes"],
      c: 1,
      why: "De-initialise everything you enabled, set VTOR, load the stack pointer from the first word, then branch to the second." },

    { q: "Why does a bootloader need an escape hatch such as a pin or a boot-failure counter?",
      a: ["To allow factory calibration data to be loaded", "Because a device whose only route to recovery is a working application can be bricked by a bad update", "To satisfy read protection requirements", "To allow the watchdog to be disabled during updates"],
      c: 1,
      why: "ST parts also carry a system bootloader in ROM, selectable with BOOT0, which cannot be bricked and is the last-resort path." },

    { q: "What does a CRC over a firmware image prove, and what does it not?",
      a: ["It proves both integrity and authenticity", "It proves the image is intact, not that it came from you; that needs a signature", "It proves the image matches the hardware revision", "It proves the transfer used the correct block size"],
      c: 1,
      why: "Signature verification is increasingly a legal requirement for connected products rather than a luxury." },

    { q: "Which test decides whether a field-update design is actually correct?",
      a: ["Updating a hundred times successfully", "Interrupting the update at random points, repeatedly and automatically, and checking what runs at the next power-up", "Verifying the CRC of every transferred block", "Measuring the total update time"],
      c: 1,
      why: "Almost every update mechanism is tested by updating and almost none by interrupting, yet the interruption is the only case the design exists for." },

    { q: "After an update, a device reads plausible nonsense from its stored parameters. What was missed?",
      a: ["The parameter area was not erased", "The parameter block layout changed between versions with no version field and no explicit migration on first boot", "The CRC did not cover the parameter area", "The parameters were stored in RAM rather than flash"],
      c: 1,
      why: "Version the block, migrate it explicitly, and say so in the release notes, because something happens to those parameters either way." },
  ],

});
