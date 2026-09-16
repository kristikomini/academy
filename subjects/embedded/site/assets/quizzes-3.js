/* ==========================================================================
   quizzes-3.js -- the question bank, part 3.

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

   This file completes Part 6 and Part 7. With it, those two parts are the only
   ones where every chapter has both prose and questions -- which is deliberate,
   because an interviewer reaches for an RTOS and a protocol long before
   reaching for constexpr.
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {

  /* ---------------------------------------------------- 38-superloop-or-rtos --- */
  "38-superloop-or-rtos": [
    { q: "What is the correct structure of a superloop, as opposed to a naive one?",
      a: ["A list of function calls, each waiting for its own hardware", "Interrupts doing the urgent time-critical capture, and a main loop running non-blocking state machines over the results", "A single function containing all the logic inline", "A loop that polls every peripheral in priority order"],
      c: 1,
      why: "Each step function advances at most one transition and returns. Anything that would have blocked becomes a state to be in." },

    { q: "Can a superloop with no RTOS be a real-time system?",
      a: ["No, real-time requires a scheduler by definition", "Yes: worst-case response is bounded by the longest single pass through the loop, and if you can state that number you have a real-time system", "Only if interrupts are disabled throughout", "Only for soft deadlines"],
      c: 1,
      why: "It is arguably easier to prove real-time than a priority-scheduled system, because there is one number rather than a schedulability analysis." },

    { q: "What does having no tasks buy you, besides saving RAM?",
      a: ["Faster interrupt latency in all cases", "No races between tasks, because the only concurrency boundary is with interrupts rather than many pairwise ones, and one stack to analyse rather than N", "Automatic protection against stack overflow", "Freedom from needing a watchdog"],
      c: 1,
      why: "N tasks give N times N minus one over two pairwise concurrency boundaries. A superloop has one, and it is well understood." },

    { q: "Which situation is the strongest technical argument for adding an RTOS?",
      a: ["Having many peripherals", "Widely separated timescales, such as a 1 ms control loop alongside a 200 ms flash write, because hand-slicing the slow work is what a context switch does for free", "Having more than 64 KB of flash", "Wanting the project to look more professional"],
      c: 1,
      why: "Number of peripherals is not on the list. A superloop is the right architecture for a large fraction of shipped products." },

    { q: "What is the most common practical reason a project acquires an RTOS?",
      a: ["A requirement in the coding standard", "Blocking third-party middleware, such as a TCP/IP or USB stack, whose API assumes it can wait and which you do not get to rewrite", "The need for more than eight interrupt priorities", "Customer preference"],
      c: 1,
      why: "It is a perfectly honest reason, and being able to name it is better than a vague preference for one architecture." },

    { q: "What does it mean when a superloop step function has a state whose only purpose is waiting for another state machine to finish?",
      a: ["The design is working as intended", "You are hand-writing continuations, which is the smell that says a task, which the kernel manages for you, would be cheaper", "The step functions should be merged", "The loop needs a faster tick"],
      c: 1,
      why: "A task is essentially a continuation the kernel maintains. Once you are maintaining them yourself, the kernel's cost starts to look cheap." },

    { q: "Why is adding an RTOS to escape a badly written superloop a mistake?",
      a: ["RTOSes are slower than superloops", "The blocking call still blocks, so you import the problem and add shared state, priority assignment, per-task stacks and every RTOS failure mode on top", "It doubles the flash requirement", "It prevents the use of interrupts"],
      c: 1,
      why: "The honest sequence is: make everything non-blocking, measure the worst-case loop pass, and only then decide." },

    { q: "What is wrong with kicking the watchdog unconditionally at the bottom of a superloop?",
      a: ["Nothing; that is the standard place for it", "It then proves only that the loop is spinning, not that any step function is making progress", "It resets the watchdog timer too often", "It must be kicked from an interrupt instead"],
      c: 1,
      why: "Each step should have to report progress before the kick, or the watchdog is monitoring the wrong thing." },
  ],

  /* --------------------------------------------------- 39-tasks-and-scheduler --- */
  "39-tasks-and-scheduler": [
    { q: "What does a task consist of, beyond its function?",
      a: ["Only a function pointer and a priority", "Its own stack plus a control block holding saved registers, priority and state", "A shared stack and a private heap", "A copy of the vector table"],
      c: 1,
      why: "The private stack is why each task can be written as though it owns the CPU, and it is also why stack sizing becomes N problems instead of one." },

    { q: "What is the practical difference between a task being Blocked and being Ready?",
      a: ["None; both mean the task is not running", "Blocked costs no CPU at all, while Ready means it could run but something higher-priority is running", "Blocked tasks are removed from the scheduler permanently", "Ready tasks consume a tick each"],
      c: 1,
      why: "That distinction is most of RTOS reasoning: a task that busy-waits is Ready and starves everything below it, while one that blocks costs nothing." },

    { q: "When does a pre-emptive scheduler switch to a higher-priority task that has just become ready?",
      a: ["At the next tick interrupt", "Immediately, typically inside the interrupt that made it ready", "When the running task next calls a kernel function", "At the end of the current time slice"],
      c: 1,
      why: "This is why the tick rate is delay resolution rather than scheduling granularity, and why the yield-from-ISR macro exists." },

    { q: "On a Cortex-M, which two exceptions provide the entire scheduler mechanism?",
      a: ["NMI and HardFault", "PendSV for the context switch and SysTick for the periodic tick", "SVC and Reset", "Two general-purpose timer interrupts"],
      c: 1,
      why: "PendSV is deliberately set to the lowest priority so that a context switch can never pre-empt a real device interrupt." },

    { q: "Priority in an RTOS should be assigned according to what?",
      a: ["The importance of the task to the product", "Urgency, meaning deadline tightness, not importance", "The amount of CPU time the task needs", "The order tasks were written in"],
      c: 1,
      why: "Assigning by importance is the classic beginner error: the safety check feels most important, gets top priority, and starves the motor commutation with a 40 ms comparison." },

    { q: "What is rate-monotonic priority assignment?",
      a: ["Giving every task the same priority and time-slicing", "For periodic tasks whose deadline equals their period, assigning priority by rate: shorter period, higher priority", "Raising priority in proportion to CPU usage", "Assigning priority by measured execution time"],
      c: 1,
      why: "It is provably optimal among fixed-priority schemes, and naming it is worth more in an interview than any particular assignment." },

    { q: "What happens if a task never blocks?",
      a: ["The scheduler forces a yield at the next tick", "It starves everything of lower priority permanently, which is the number-one cause of RTOS bug reports", "The kernel raises a stack overflow", "Nothing; round-robin scheduling handles it"],
      c: 1,
      why: "Round-robin time slicing only applies among tasks of equal priority, so it does not rescue a lower-priority task." },

    { q: "Why use vTaskDelayUntil rather than vTaskDelay for periodic work?",
      a: ["It is faster to execute", "vTaskDelay waits from now, so the period becomes the delay plus however long the body took, and it drifts; vTaskDelayUntil wakes at a fixed absolute time", "vTaskDelay cannot be called from a task", "vTaskDelayUntil uses less stack"],
      c: 1,
      why: "A 3 ms body with vTaskDelay(10) gives a 13 ms period that wanders, which is not what 'every 10 ms' means." },

    { q: "How should a task's stack size be determined?",
      a: ["By a rule of thumb of 128 words per task", "From a measured high-water mark after running the system through its worst paths, plus real margin, re-checked after adding any library", "By dividing available RAM equally among tasks", "By the compiler, automatically"],
      c: 1,
      why: "Each stack must also absorb the deepest legal interrupt nesting chain, since interrupts stack onto whichever stack is current." },

    { q: "Why is the idle task worth paying attention to?",
      a: ["It should be eliminated to save RAM", "It frees memory from deleted tasks and is where the sleep instruction and CPU-load measurement go; a system whose idle task never runs has no headroom", "It runs at the highest priority", "It handles all interrupts"],
      c: 1,
      why: "How much time the idle task gets is the headroom number, and you want to know it rather than assume it." },
  ],

  /* ----------------------------------------------------- 42-isr-and-the-rtos --- */
  "42-isr-and-the-rtos": [
    { q: "Why can the ordinary blocking kernel API not be called from an interrupt handler?",
      a: ["It is too slow for interrupt context", "Its contract is to block the calling task, and in handler mode there is no calling task to move to the Blocked list", "Interrupt handlers run with the MPU disabled", "The kernel functions are not linked into handler-mode code"],
      c: 1,
      why: "The kernel cannot identify an owner to block, let alone context-switch out of an exception whose return path is already fixed." },

    { q: "How do the FromISR variants of kernel functions differ from the ordinary ones?",
      a: ["They are simply faster implementations", "They take no timeout, so they succeed or fail immediately, and they take a higher-priority-task-woken out-parameter", "They automatically disable interrupts for the duration", "They allocate from a separate heap"],
      c: 1,
      why: "Because there is no timeout, you must check the return value: a full queue in an ISR is data loss, and ignoring it produces a mysterious low-rate drop." },

    { q: "What is portYIELD_FROM_ISR for, and what happens if you omit it?",
      a: ["It clears the peripheral interrupt flag; omitting it causes re-entry", "It switches immediately to a higher-priority task the interrupt made ready; omitting it does not crash but silently adds up to one tick period to your most urgent path", "It re-enables interrupts; omitting it leaves them masked", "It is optional and has no effect"],
      c: 1,
      why: "That is the worst kind of bug: the system works, nothing is logged, and only a latency measurement reveals it." },

    { q: "How should the woken flag passed to the FromISR functions be handled?",
      a: ["Initialised to true and yielded after each call", "Initialised to false, passed to each FromISR call in the handler so it accumulates, and yielded once at the end", "Declared static so it persists between interrupts", "Ignored unless only one task is waiting"],
      c: 1,
      why: "It is an out-parameter that each call may set; one yield at the end covers all of them." },

    { q: "Why must an interrupt handler never take a mutex, not even a FromISR variant?",
      a: ["Mutexes are too slow for interrupt context", "There is no such variant by design: a handler is not a task and has no priority the scheduler can raise, so the priority inversion would be unbounded by construction", "Mutexes require dynamic allocation", "The MPU forbids it"],
      c: 1,
      why: "Signal a task from the handler and let the task take the lock." },

    { q: "What does configMAX_SYSCALL_INTERRUPT_PRIORITY control?",
      a: ["The maximum number of interrupts the kernel can handle", "The ceiling above which an interrupt may not call any kernel function at all, because the kernel masks up to that level to protect its data", "The priority assigned to the SysTick interrupt", "The number of priority bits implemented by the NVIC"],
      c: 1,
      why: "The kernel uses BASEPRI rather than disabling interrupts entirely, so genuinely urgent interrupts above the ceiling keep running even inside kernel critical sections. The price is that they may not touch the kernel." },

    { q: "Why is a CubeMX-configured peripheral interrupt likely to violate the kernel priority rule?",
      a: ["CubeMX disables the NVIC by default", "An interrupt with no explicitly assigned priority gets 0, which is numerically lowest and therefore the most urgent, placing it above the ceiling", "CubeMX assigns priority 15 to everything", "CubeMX generates handlers that call the non-FromISR API"],
      c: 1,
      why: "Remember the numbering is inverted: an interrupt that wants to call the kernel needs a priority number greater than or equal to the ceiling." },

    { q: "What does the failure look like when an interrupt above the syscall ceiling calls the kernel, and what catches it?",
      a: ["An immediate HardFault, easy to trace", "Intermittent queue or list corruption appearing under load days later; configASSERT with the port's interrupt-priority validation catches it on the first offending call", "A compiler warning at build time", "The kernel silently ignores the call"],
      c: 1,
      why: "Turning configASSERT on in development converts a whole class of intermittent corruption into a loud first-run stop." },
  ],

  /* ---------------------------------------------------- 43-timing-and-jitter --- */
  "43-timing-and-jitter": [
    { q: "What is the cheapest accurate way to measure how long a piece of firmware takes?",
      a: ["A printf with a timestamp at each end", "Set a spare GPIO pin high at the start and low at the end, and measure the pulse on a scope or logic analyser", "The debugger's stopwatch while single-stepping", "Counting instructions in the disassembly"],
      c: 1,
      why: "A GPIO write is one store instruction, so the instrument's own cost is negligible against anything worth measuring." },

    { q: "Why use the atomic set/reset register and bare registers for a timing probe rather than the HAL?",
      a: ["The HAL does not support GPIO writes", "A HAL call carries its own parameter checking inside the measurement path, and a read-modify-write on the output register is not atomic", "Registers are required for the pin to toggle fast enough to see", "The HAL disables interrupts during a GPIO write"],
      c: 1,
      why: "You want the probe to cost one instruction, so that what you measure is the code and not the instrument." },

    { q: "Which statistic should you read from a long timing run, and why?",
      a: ["The mean, because it smooths out noise", "The maximum, because in a real-time system the worst case is the number and the tail is the product", "The median, because it ignores outliers", "The standard deviation alone"],
      c: 1,
      why: "A mean of 40 microseconds over a million samples is a true statement that tells you nothing if one sample took 9 milliseconds." },

    { q: "How do you measure the latency between an interrupt and the task it wakes?",
      a: ["Subtract the tick count at each point", "Toggle one probe pin in the ISR and another at the top of the woken task, and measure the gap between them", "Use a single pin toggled twice", "Read the DWT counter in the task only"],
      c: 1,
      why: "That gap is the context-switch path, and it is the number that reveals a missing yield-from-ISR." },

    { q: "What is the DWT cycle counter, and why must the subtraction be unsigned?",
      a: ["A kernel-maintained tick count; unsigned avoids negative delays", "A free-running 32-bit hardware counter at the core clock; unsigned subtraction stays correct when the counter wraps", "A profiler built into the debugger; unsigned is a convention", "A peripheral timer; unsigned saves a register"],
      c: 1,
      why: "It is the same reason timer-difference arithmetic uses unsigned types generally, and at 168 MHz it wraps about every 25 seconds." },

    { q: "Why should a fast path keep a running maximum rather than a histogram?",
      a: ["Histograms are less accurate", "The counter read is cheap but the storage is not, and the maximum is the statistic that matters anyway", "A histogram requires floating point", "The maximum can be computed later from the mean"],
      c: 1,
      why: "A running maximum is one compare and one conditional store." },

    { q: "What is wrong with adding a printf inside the interrupt whose latency you are investigating?",
      a: ["It uses too much flash", "A blocking printf at 115200 baud takes about 87 microseconds per character, so it becomes the dominant term in its own measurement and usually makes the original symptom disappear", "It cannot be called from handler mode at all", "It resets the DWT counter"],
      c: 1,
      why: "The symptom disappearing is the worst outcome, because it looks like a fix." },

    { q: "Why are timing problems particularly unsuited to a debugger?",
      a: ["Debuggers cannot read timer registers", "Halting the core does not halt the peripherals, the DMA or the plant, so the world moves on while your code is stopped", "Breakpoints are limited to six on Cortex-M", "The debugger disables the DWT counter"],
      c: 1,
      why: "A pin and an instrument observe without stopping, which is exactly what a timing question requires." },

    { q: "What should you ask the hardware engineer for, early, to make timing work possible?",
      a: ["A faster crystal", "Two spare probe test points on the schematic, before the board is made", "An extra UART", "A larger flash part"],
      c: 1,
      why: "It costs nothing at schematic stage and is impossible to add once the board exists." },
  ],

  /* ------------------------------------------------- 44-freertos-concretely --- */
  "44-freertos-concretely": [
    { q: "What does configTICK_RATE_HZ actually control?",
      a: ["How often the scheduler considers switching tasks", "The resolution of delays and timeouts, and the rate of a periodic interrupt you pay for; it is not the scheduling granularity", "The maximum number of tasks", "The context-switch time"],
      c: 1,
      why: "A task made ready by an interrupt runs immediately, not at the next tick. Raising the tick rate to get better timing is almost always the wrong instrument." },

    { q: "Which FreeRTOS heap scheme allocates but never frees, and when is it sufficient?",
      a: ["heap_4, when tasks are deleted at runtime", "heap_1, when all tasks, queues and semaphores are created at startup and never deleted", "heap_5, when memory is in several regions", "heap_2, when block sizes are identical"],
      c: 1,
      why: "It is the safest scheme, and heap_4, which coalesces adjacent free blocks, is the sensible general choice when you do need frees." },

    { q: "What do the Static creation functions such as xTaskCreateStatic buy you?",
      a: ["Faster task creation", "No kernel heap at all, because the memory is yours, so the linker confirms it fits rather than you hoping at runtime", "Automatic stack overflow detection", "Support for more tasks"],
      c: 1,
      why: "It is what the no-malloc argument asks for, and what a safety-related project will require." },

    { q: "What is the most expensive default in FreeRTOSConfig.h?",
      a: ["A tick rate of 1000 Hz", "Leaving configASSERT undefined, since defining it catches interrupt-priority errors, stack overflows and API misuse on the first offending call", "Using heap_4 rather than heap_1", "Leaving time slicing enabled"],
      c: 1,
      why: "Without it those errors present as corruption days later instead of as a stop on the first run." },

    { q: "What goes wrong when xQueueCreate returns NULL and nobody checks?",
      a: ["The kernel retries the allocation at the next tick", "The first send to a null handle faults somewhere unrelated, so the board resets at startup and the evidence points at whatever ran last", "The queue is created with zero capacity and silently drops items", "The scheduler refuses to start"],
      c: 1,
      why: "Treat a creation failure as fatal and loud: there is no sensible recovery from the system not being buildable." },

    { q: "What is CMSIS-RTOS2?",
      a: ["An RTOS kernel from ARM", "A standard wrapper API that sits on top of FreeRTOS or another kernel, which is why CubeMX-generated code says osThreadNew rather than xTaskCreate", "The interrupt controller driver layer", "A tracing protocol over SWO"],
      c: 1,
      why: "It buys portability between kernels and costs a thin layer plus some loss of kernel-specific features." },

    { q: "How does Zephyr differ in scope from FreeRTOS?",
      a: ["It is a smaller, faster scheduler", "It is a kernel plus a device-driver model, device tree, Kconfig, networking and a package manager, rather than a scheduler and primitives alone", "It only runs on ARM Cortex-M", "It is a commercial product with per-seat licensing"],
      c: 1,
      why: "Much more capable and much more to learn, and its device-tree configuration is the biggest conceptual jump from CubeMX." },

    { q: "Which RTOS options carry independent safety certification for standards such as IEC 61508?",
      a: ["FreeRTOS and Zephyr", "SAFERTOS and ThreadX", "RT-Thread and embOS", "None; certification applies only to the application"],
      c: 1,
      why: "SAFERTOS is the independently certified sibling of FreeRTOS, and ThreadX carries pre-existing safety and security certifications." },

    { q: "What is the honest framing of RTOS experience in an interview?",
      a: ["Name every kernel you have read about", "The concepts, meaning tasks, priorities, blocking, the ISR boundary and priority inversion, are the transferable part and are identical everywhere; the API names are a week", "Claim the specific kernel the company uses", "Say that all RTOSes are interchangeable"],
      c: 1,
      why: "An advert saying 'an RTOS' expects you to have used one and to be able to move." },
  ],

  /* --------------------------------------------------- 45-the-physical-layer --- */
  "45-the-physical-layer": [
    { q: "Why does differential signalling reject noise that single-ended signalling cannot?",
      a: ["The voltage swing is larger", "Interference couples into both conductors of a twisted pair almost identically, so it appears as a common-mode offset and cancels in the difference the receiver measures", "The signal is transmitted twice and compared", "Differential drivers use error-correcting codes"],
      c: 1,
      why: "It is also why the ground potential difference between two ends of a long run stops mattering, within the transceiver's common-mode range." },

    { q: "What are the defining characteristics of RS-485 compared with RS-232?",
      a: ["Single-ended, point to point, up to 15 metres", "Differential, multi-drop with up to 32 unit loads, half duplex on one twisted pair, to about 1200 metres at low baud", "Differential, full duplex, one driver and one receiver only", "Single-ended with a larger voltage swing"],
      c: 1,
      why: "RS-422 is the full-duplex differential variant with one driver and up to ten receivers. RS-485's multi-drop capability is why Modbus lives on it." },

    { q: "What is the common-mode range of an RS-485 transceiver for, and what happens if it is exceeded?",
      a: ["It sets the maximum baud rate; exceeding it corrupts fast edges", "It tolerates the ground potential difference between the two ends; exceeding it breaks the link regardless of signal quality", "It defines the termination resistance needed", "It determines how many nodes can be attached"],
      c: 1,
      why: "Typically minus 7 V to plus 12 V. No amount of clean signalling helps once the common-mode voltage is outside it." },

    { q: "Where should the 120 ohm termination resistors go on an RS-485 bus?",
      a: ["At every node", "At the two physical ends of the bus only", "At the master only", "Nowhere, if the cable is under 100 metres"],
      c: 1,
      why: "Terminating every node loads the driver until nobody reaches threshold; terminating neither gives reflections that corrupt fast edges first, so it works at 9600 and fails at 115200." },

    { q: "Why should an RS-485 bus be daisy-chained rather than wired as a star?",
      a: ["Star wiring uses more cable", "Every branch is another end for the signal to reflect from, and a star wired in a panel is a classic field fault that is invisible in software", "Star wiring exceeds the unit-load limit", "Daisy chaining is required for addressing to work"],
      c: 1,
      why: "Stubs from the trunk to a device should be centimetres, not metres." },

    { q: "What is fail-safe biasing on RS-485, and what is the symptom of its absence?",
      a: ["A fuse that protects the transceiver; its absence risks damage", "Resistors that hold the idle state when no driver is enabled; without it the floating bus flips randomly and a UART reads frames arriving when nobody is transmitting", "A watchdog on the transceiver enable line", "A second termination resistor at the master"],
      c: 1,
      why: "Many modern transceivers include internal fail-safe, but not all, and the symptom is easy to mistake for a software bug." },

    { q: "Does differential signalling remove the need for a ground connection between devices?",
      a: ["Yes, that is the point of differential", "No: the common-mode range must be respected, so a third conductor or a shield bonded at one end only is needed for anything but a short run", "Yes, provided both ends are mains-powered", "No, but only above 500 kbit/s"],
      c: 1,
      why: "A shield bonded at both ends creates a circulating current, which is itself a noise source." },

    { q: "On half-duplex RS-485, when must the driver enable be released after transmitting?",
      a: ["As soon as the last byte is written to the data register", "On the transmit-buffer-empty flag", "On the transmission-complete flag, after the last bit has physically left the shift register", "One character time after the stop bit"],
      c: 1,
      why: "Releasing on transmit-buffer-empty truncates the final character by a predictable amount, and at the master it appears as an intermittent CRC error, which sends everybody to check the cable." },

    { q: "What is the symptom of A and B being swapped at one node of an RS-485 bus?",
      a: ["Framing errors at that node only", "Silence, with no error reported anywhere", "The bus locks up and no node can transmit", "Data arrives bit-inverted but otherwise intact"],
      c: 1,
      why: "Reversed polarity produces no diagnostic at all, which is what makes it a real and time-consuming field fault." },

    { q: "Why is an isolated RS-485 transceiver worth its cost on a machine with drives and contactors?",
      a: ["It increases the maximum baud rate", "It breaks the ground loop entirely and protects the microcontroller from a transient that would otherwise destroy it", "It removes the need for termination", "It allows more than 32 nodes"],
      c: 1,
      why: "Asking the hardware engineer whether the board is isolated is one of the more useful questions at a bench." },
  ],

  /* ----------------------------------------------------------------- 47-framing --- */
  "47-framing": [
    { q: "What does a read from a UART or a TCP socket actually return?",
      a: ["Exactly one message", "Whatever bytes had arrived: possibly half a message, possibly two and a half", "One message, or nothing if none is complete", "A whole number of messages, never a partial one"],
      c: 1,
      why: "It is equally true of a TCP socket, which is a byte stream with the same property. Assuming otherwise is the first of three false beliefs that each cost a day." },

    { q: "Why must resynchronisation be designed into a serial protocol handler rather than handled by restarting?",
      a: ["Restarting is slow", "The device is a machine in a plant that you cannot go and restart, so automatic recovery is the only thing standing between one corrupted byte and a permanently dead link", "Restarting loses the configuration", "The standard forbids restarting"],
      c: 1,
      why: "It is the requirement most often missed, and it is the difference between a demo and a product." },

    { q: "What is the main advantage of a delimiter-based framing scheme over a length prefix?",
      a: ["It is more compact on the wire", "It is self-resynchronising: after any corruption the next delimiter puts you back in step", "It needs no checksum", "It supports larger messages"],
      c: 1,
      why: "The cost is that the delimiter must never appear in the payload, so binary data needs escaping." },

    { q: "What does COBS provide that naive byte stuffing does not?",
      a: ["Error correction as well as framing", "A strictly bounded overhead of one byte per 254, instead of a data-dependent encoded length that can double in the worst case", "Compatibility with Modbus RTU", "Support for delimiters other than zero"],
      c: 1,
      why: "It removes all zero bytes from the payload, making 0x00 an unambiguous frame delimiter. For a binary protocol designed from scratch it is the answer worth knowing." },

    { q: "What is the weakness of a length-prefixed frame, and how is it mitigated?",
      a: ["It wastes bandwidth; mitigated by compression", "It is not self-resynchronising, since a corrupted length field misparses everything after it; mitigated with a sync word, a sanity check on the length, and a checksum that forces a rescan", "It cannot carry binary data; mitigated by escaping", "It requires fixed-size messages; mitigated by padding"],
      c: 1,
      why: "Once you consume the wrong number of bytes, every subsequent message is wrong until something puts you back in step." },

    { q: "How does Modbus RTU delimit frames, and what does that make framing into?",
      a: ["With a start byte, making it a parsing problem", "With silence on the line of 3.5 character times, making framing a timing property", "With a length field, making it an arithmetic problem", "With a CRC boundary, making it a checksum problem"],
      c: 1,
      why: "It needs no escaping and no overhead, which is why RTU frames are compact. It is hard on a general-purpose OS and natural on an MCU with UART idle-line detection." },

    { q: "How does CRC-16 compare with a simple additive checksum?",
      a: ["They detect the same errors; CRC is just faster", "CRC-16 catches all single and double bit errors, all odd numbers of errors and any burst up to 16 bits, while an additive checksum cannot even detect reordered bytes", "An additive checksum is stronger but slower", "CRC-16 only detects burst errors"],
      c: 1,
      why: "CRC-16 costs two bytes and a small table, which is cheap for what it buys. Use an additive checksum only where a standard demands it." },

    { q: "Why is an unchecked length field from a received frame a security bug on a networked device?",
      a: ["It leaks the buffer size to the attacker", "The attacker chooses the length, so a copy of up to 65535 bytes into a 256-byte buffer is a remote memory corruption", "It allows the attacker to slow the device down", "It exposes the CRC polynomial"],
      c: 1,
      why: "Check every received length against your actual buffer, and treat a failure as a reason to discard and resynchronise rather than to continue." },

    { q: "Why does every state in a frame parser need a timeout out of it?",
      a: ["To satisfy MISRA", "Because a parser waiting for bytes of a frame that will never arrive is a latch rather than a parser, and one pulled cable proves it", "To bound CPU usage", "Because the UART hardware requires it"],
      c: 1,
      why: "After an inter-character timeout it must discard and go back to hunting for a start." },

    { q: "Why write a frame parser as a state machine that consumes one byte at a time?",
      a: ["It uses less RAM than a buffered parser", "It never blocks, never assumes a read boundary, and compiles and runs on a PC where faults can be injected precisely", "It is required for DMA reception", "It is faster than parsing a whole buffer"],
      c: 1,
      why: "Framing is pure logic, so off-target testing is not a compromise here: it is better than testing on the board, because you can feed it a megabyte of garbage followed by a good frame." },
  ],

  /* --------------------------------------------------------------- 48-spi-and-i2c --- */
  "48-spi-and-i2c": [
    { q: "What error detection does SPI provide?",
      a: ["A parity bit per byte", "None at all: a missing device reads as whatever the floating input line happens to be, with no indication", "A CRC over each transfer", "An acknowledgement bit per byte"],
      c: 1,
      why: "This is why checking a who-am-I register at startup matters: it is the only error reporting SPI gives you, and it turns a silent wiring fault into a clear message." },

    { q: "What do CPOL and CPHA determine in SPI, and what happens if they are wrong?",
      a: ["The bit rate and word length; the transfer fails with an error", "The clock idle level and which edge samples data; the wrong combination gives shifted or garbage data with no error indication", "The chip-select polarity; the device is not selected", "The byte order; data arrives reversed"],
      c: 1,
      why: "Modes 0 and 3 are by far the most common, and the timing diagram in the datasheet is the authority when the prose is ambiguous." },

    { q: "Why do SPI driver APIs take both a transmit and a receive buffer?",
      a: ["To allow full-duplex error checking", "Because SPI is full duplex, so every transfer is an exchange: to read N bytes you must clock out N bytes of something", "Because the peripheral requires double buffering", "To support daisy-chained devices"],
      c: 1,
      why: "Passing NULL for one of them means send zeros or discard, rather than skip." },

    { q: "Why are I2C's SDA and SCL lines open-drain with pull-up resistors?",
      a: ["To reduce power consumption", "So no device drives the line high, which makes multi-controller arbitration and clock stretching possible, at the cost of rise time limiting the speed", "To allow 5 V and 3.3 V devices to be mixed safely", "Because the standard requires 5 V signalling"],
      c: 1,
      why: "Rise time is set by pull-up resistance and bus capacitance, so too many devices on too long a track means the edges never get high enough." },

    { q: "What happens on an I2C bus when you address a device that is not present?",
      a: ["The controller reads all ones with no indication", "The address byte is NACKed, which is a real error the driver can report", "The bus locks up immediately", "The transaction times out after one second"],
      c: 1,
      why: "This is the practical advantage over SPI: I2C acknowledges, so a missing device is detectable rather than silently producing plausible bytes." },

    { q: "What is a repeated START in I2C used for?",
      a: ["Recovering from a bus error", "Writing a register address and then reading the data without releasing the bus, which most sensor datasheets require", "Addressing a second device in the same transaction", "Extending a transfer beyond 8 bytes"],
      c: 1,
      why: "It is a START issued without an intervening STOP, so the controller keeps ownership of the bus across the two phases." },

    { q: "What is I2C clock stretching?",
      a: ["Slowing the clock to extend the maximum cable length", "A target holding SCL low when it needs more time, which the controller must wait for", "The controller lengthening the clock period during arbitration", "A technique for mixing 100 kHz and 400 kHz devices"],
      c: 1,
      why: "It is correct behaviour but occasionally implemented poorly on either side, and it is a common cause of interoperability problems with slow sensors and software I2C." },

    { q: "How can an I2C bus lock up in a way that resetting your microcontroller does not clear?",
      a: ["The pull-up resistors saturate", "The controller resets mid-read while a target is driving SDA low for a data bit; the target waits for more clocks, the controller sees SDA stuck low and cannot issue a START, which requires SDA to fall while SCL is high", "The peripheral clock is left disabled after reset", "Both devices try to drive SCL simultaneously"],
      c: 1,
      why: "It survives your reset because the stuck device is the other one. This is the question that separates people who have shipped an I2C product from people who have used one." },

    { q: "What is the standard I2C bus recovery sequence?",
      a: ["Toggle the power to the sensor", "Take SCL and SDA over as GPIO open-drain, clock SCL up to nine times until SDA releases, generate a manual STOP, then hand the pins back and re-init the peripheral", "Reset the I2C peripheral through its software-reset bit only", "Send a general-call reset to address zero"],
      c: 1,
      why: "Nine pulses let the target finish any byte it was part way through and then release SDA on the ACK slot. Run it once at startup in every robust driver." },

    { q: "Why can two identical I2C sensors be impossible to put on one bus?",
      a: ["Two devices cannot share pull-up resistors", "Many parts offer only one or two selectable addresses, so their addresses conflict", "The bus capacitance doubles beyond the limit", "Clock stretching from two devices is not resolvable"],
      c: 1,
      why: "The fixes are an address-select pin, a second I2C peripheral or a multiplexer, and it is much better discovered while reading the schematic than after the board is made." },
  ],

  /* ---------------------------------------------------------- 49-can-and-canopen --- */
  "49-can-and-canopen": [
    { q: "How does CAN resolve two nodes transmitting at the same time?",
      a: ["Both detect the collision, back off and retry after random delays", "Bit-wise arbitration on the identifier: dominant overwrites recessive, so a node that sends recessive and reads dominant withdraws immediately", "A master assigns time slots in advance", "The frames collide and are both discarded"],
      c: 1,
      why: "It is non-destructive: the highest-priority message continues undisturbed and arrives with no retransmission and no delay." },

    { q: "In CAN, which identifier has higher priority?",
      a: ["The numerically higher one", "The numerically lower one", "Extended identifiers always beat standard ones", "Priority is set by a separate field, not the identifier"],
      c: 1,
      why: "Because the bus is a wired-AND and dominant is logical zero. Identifier assignment is therefore a real-time design decision, not an administrative one." },

    { q: "How are CAN frames addressed?",
      a: ["By a destination node address in the header", "They are not: frames carry an identifier and every node filters on it, taking what concerns it", "By a source and destination pair", "By a broadcast address plus a node mask"],
      c: 1,
      why: "CAN is message-oriented rather than address-oriented, which is why the same frame can be consumed by several nodes at once." },

    { q: "What do the CAN transmit and receive error counters do at 128 and at 256?",
      a: ["They wrap around to zero", "At 128 the node goes error passive, and at 256 it goes bus off and stops transmitting until recovered", "At 128 it resets, and at 256 it disables the transceiver permanently", "They trigger an interrupt but change no behaviour"],
      c: 1,
      why: "It is deliberate: a node with a fault removes itself from the bus rather than jamming it. The counters are the best diagnostic any field bus offers, so expose them." },

    { q: "What is the CAN sample point, and why does a mismatch matter?",
      a: ["The moment the CRC is checked; a mismatch corrupts the checksum", "The position within the bit at which the level is read, typically 75 to 87.5 percent through; a mismatch works on the bench and errors on a long cable because propagation delay is what the segment placement compensates for", "The point at which arbitration ends; a mismatch causes priority inversion", "The rate at which the controller samples the bus for idle"],
      c: 1,
      why: "Every node must agree on bit rate and, in practice, have a compatible sample point." },

    { q: "What happens when one node on a CAN bus is set to the wrong bit rate?",
      a: ["That node simply cannot decode traffic and stays silent", "It misreads valid frames as malformed and transmits error frames, which being dominant bits destroy everyone else's messages, so the whole bus appears broken", "The bus negotiates down to the lowest common bit rate", "The other nodes ignore it automatically"],
      c: 1,
      why: "The node that is wrong frequently looks healthiest. Read every node's error counters before touching anything, and bring nodes up one at a time on a bench." },

    { q: "Why does a single CAN node transmitting with nothing else connected go bus off?",
      a: ["The termination is incorrect with one node", "Nobody fills the ACK slot, so every frame is counted as an error until the counter reaches 256", "The controller detects no clock reference", "It does not; this is normal operation"],
      c: 1,
      why: "A CAN node cannot successfully talk to itself, and 'my board transmits and immediately goes bus-off' is almost always this rather than a fault." },

    { q: "What is the CANopen object dictionary?",
      a: ["A file listing all node IDs on the network", "Every parameter and process value a device has, addressed by a 16-bit index and an 8-bit sub-index, with standard ranges fixed by the specification", "A translation table between CAN identifiers and device names", "The routing table used by a CANopen gateway"],
      c: 1,
      why: "Communication parameters live at 0x1000 to 0x1FFF and the device profile at 0x6000 to 0x9FFF, which is why a drive from one maker looks much like a drive from another. The EDS file describes it." },

    { q: "What is the difference between a PDO and an SDO in CANopen?",
      a: ["PDOs are for configuration, SDOs for process data", "A PDO carries real-time process values with no protocol overhead and no confirmation; an SDO is a confirmed read or write of any dictionary entry, used for configuration", "PDOs are broadcast and SDOs are point to point, but both carry process data", "SDOs are faster because they are unconfirmed"],
      c: 1,
      why: "Which dictionary entries a PDO carries is set by mapping, which is itself configured over SDO." },

    { q: "A CANopen device is on the bus but sends no process data. What is the most likely cause?",
      a: ["Its node ID conflicts with another device", "It is not in the Operational NMT state, and PDOs only flow in Operational", "Its heartbeat interval is set to zero", "Its EDS file has not been loaded by the master"],
      c: 1,
      why: "The NMT state machine runs Initialising, Pre-operational, Operational, Stopped, and an NMT start message that was never sent accounts for most of these reports." },
  ],


  /* ---------------------------------------------------------- 49a-iso-tp --- */
  "49a-iso-tp": [
    { q: "Why can UDS not run directly on CAN?",
      a: ["UDS uses a different physical layer from CAN", "A CAN frame carries at most 8 bytes and a diagnostic request or response is routinely longer, so ISO 15765-2 sits between them to segment and reassemble", "CAN has no addressing, so UDS needs an extra addressing layer only", "It can; ISO-TP is optional"],
      c: 1,
      why: "Naming the middle layer is the difference between reciting two acronyms and describing a stack. ISO-TP also supplies the flow control that lets a small device pace a PC tool." },

    { q: "Name the four ISO-TP frame types and say which one the receiver sends.",
      a: ["Single, First, Consecutive and Acknowledge; the receiver sends the Acknowledge", "Single, First, Consecutive and Flow Control; the receiver sends the Flow Control", "Start, Data, End and Retry; the receiver sends the Retry", "Request, Response, Continue and Abort; the receiver sends the Continue"],
      c: 1,
      why: "Flow Control coming from the receiver is the point of the protocol: it is how the side with the small buffer paces the side with the big one." },

    { q: "What sequence number does the first Consecutive Frame after a First Frame carry?",
      a: ["0, and it counts up through 15", "1, and the 4-bit counter wraps from 15 back to 0", "1, and the counter is 8 bits so it wraps at 255", "Whatever the Flow Control specified"],
      c: 1,
      why: "The First Frame is implicitly number 0. A gap in the sequence aborts the transfer; ISO-TP never retransmits." },

    { q: "In an ISO-TP Flow Control frame, what does a block size of 0 mean?",
      a: ["The transfer is aborted", "Send all remaining Consecutive Frames without stopping for another Flow Control", "Send one frame and wait", "Block size is negotiated again after the first block"],
      c: 1,
      why: "A PC tool typically asks for 0. A microcontroller with a single small reassembly buffer typically should not, because flow control is the only mechanism it has to slow the sender down." },

    { q: "How is STmin encoded in an ISO-TP Flow Control frame?",
      a: ["Always in microseconds, as a 16-bit value", "Values 0x00 to 0x7F are milliseconds, and values 0xF1 to 0xF9 are 100 to 900 microseconds", "Always in milliseconds, with 0xFF meaning no limit", "As a multiple of the CAN bit time"],
      c: 1,
      why: "Two different units in one byte, with a reserved hole between them, is exactly the kind of encoding that produces a thousand-fold error in one direction." },

    { q: "Why may a functionally addressed ISO-TP request carry only a Single Frame?",
      a: ["Functional addressing uses a shorter identifier with less room", "A segmented transfer needs one partner to send flow control and be paced, and functional addressing is aimed at every ECU at once", "The standard reserves segmentation for extended addressing", "It is a limitation of 11-bit identifiers"],
      c: 1,
      why: "Many receivers would each send their own Flow Control, and there would be no single connection to pace. Hence the broadcast identifier 0x7DF carries short requests only." },

    { q: "In the 11-bit addressing convention of ISO 15765-4, how does the response identifier relate to the request identifier?",
      a: ["It is the same identifier", "It is the request identifier plus 8, so a request on 0x7E0 is answered on 0x7E8", "It is 0x7DF for every response", "It is assigned by the tester in the First Frame"],
      c: 1,
      why: "0x7DF is the functional request, 0x7E0 to 0x7E7 are physical requests, and 0x7E8 to 0x7EF are the matching responses." },

    { q: "What happens when a second First Frame arrives on a connection that already has a reassembly in progress?",
      a: ["The two messages are queued and reassembled in order", "The new one replaces the one in progress, because there is one reassembly buffer per connection", "The receiver sends Flow Control with the Wait status until the first completes", "Both are discarded and the sender is told to retry"],
      c: 1,
      why: "Interleaving two segmented requests to the same ECU on the same connection does not work, and the symptom looks like data corruption rather than a protocol violation." },

    { q: "Which two ISO-TP timers expire most often in practice, and what do they mean?",
      a: ["N_As and N_Ar, the times to get a frame onto the wire", "N_Bs, the sender waiting for a Flow Control, and N_Cr, the receiver waiting for the next Consecutive Frame, both typically one second", "P2 and P2 star, the diagnostic response timers", "The S3 session timer and the watchdog timer"],
      c: 1,
      why: "P2 and the S3 timer belong to UDS, one layer up. Keeping the two sets of timers straight is a fast way to show you know where each layer ends." },

    { q: "An ISO-TP transfer that works on a bench fails in a loaded vehicle with an unexpected sequence number. What is the usual cause?",
      a: ["CAN frames are being lost by the bus itself under load", "STmin was set too small for what the receive path can sustain when the CPU and the bus are busy, so frames are overwritten before the task drains them", "The sender is using extended addressing and the receiver normal addressing", "The block size is too large for the sender"],
      c: 1,
      why: "CAN does not lose frames silently; your receive path does. Set STmin from a measured worst case under load, size block size to your buffer, and expose an abort counter the way you expose the CAN error counters." },
  ],

  /* -------------------------------------------------------------- 49b-uds --- */
  "49b-uds": [
    { q: "How is a positive UDS response related to the request, and what shape does a negative response take?",
      a: ["The response repeats the service identifier; a negative response is the identifier with the high bit set", "A positive response is the service identifier plus 0x40; a negative response is always 0x7F, the service identifier you sent, and one byte giving the reason", "A positive response is 0x00 followed by the data; a negative response is 0xFF", "Both use the same identifier and are distinguished by length"],
      c: 1,
      why: "So a request 0x22 comes back as 0x62. The negative response code is a designed diagnostic channel, and discarding it throws away the only evidence that says why." },

    { q: "What does the UDS negative response code 0x78 mean?",
      a: ["The service is not supported in the current session", "Request correctly received and a response is pending: not an error, and it moves the tester from the P2 timeout to the longer P2 star", "The request was rejected because security access is required", "The message length was incorrect"],
      c: 1,
      why: "Typical during a flash erase. A tester that treats it as a failure reports a broken ECU; one that accepts it forever hangs instead of timing out." },

    { q: "Where should a tester get its P2 and P2 star timeout values from?",
      a: ["From the ISO 14229 defaults, which are fixed", "From the positive response to DiagnosticSessionControl, which carries the ECU's own values", "From the flow control frame of the transport layer", "They are negotiated in the security access exchange"],
      c: 1,
      why: "Hardcoding 50 ms is guessing. The session response is where the ECU states them." },

    { q: "A UDS request is refused with negative response code 0x7E or 0x7F. What is the fix?",
      a: ["Retry the request with a longer timeout", "Change the diagnostic session, because those codes mean the service is supported but not in the session you are currently in", "Request security access first", "Use functional instead of physical addressing"],
      c: 1,
      why: "Those two are the sub-function and service not supported in the active session. Almost everything useful is gated behind a non-default session." },

    { q: "How does the UDS SecurityAccess service structure its sub-functions?",
      a: ["A single sub-function carrying both the seed request and the key", "Odd sub-functions request a seed and the following even sub-function sends the key, so 0x27 0x01 then 0x27 0x02", "The tester sends the key first and the ECU replies with a seed for verification", "The sub-function encodes the security level only, and the seed travels in a separate service"],
      c: 1,
      why: "A seed of all zeros means already unlocked, not a broken random number generator. The mandatory delay after repeated failures, signalled with 0x36 and 0x37, is the real security control." },

    { q: "What is the S3 timer in UDS, and what is the practical consequence of ignoring it?",
      a: ["The maximum time an ECU may take to answer, after which the tester aborts", "About five seconds of silence returns the ECU to the default session and drops security access, so a procedure with an operator pause fails halfway with securityAccessDenied", "The interval at which DTCs are re-evaluated", "The delay enforced after too many wrong keys"],
      c: 1,
      why: "TesterPresent every two seconds or so keeps the session alive, and it belongs in the transport layer of the tool rather than sprinkled through a test script." },

    { q: "Why does a correct tool sometimes send 0x3E 0x80 and receive nothing at all?",
      a: ["Because TesterPresent is never answered by design", "Because bit 7 of the sub-function is the suppress positive response bit, so the ECU stays silent on success and answers only on failure", "Because functional addressing suppresses all responses", "Because the ECU is in the default session"],
      c: 1,
      why: "Silence can mean success. A log that appears to show an unanswered request often shows a perfectly correct one." },

    { q: "In a UDS reprogramming sequence, what does the positive response to RequestDownload tell the tester?",
      a: ["The address at which the new software will be written", "The maximum block length the ECU will accept for the TransferData messages that follow", "The number of blocks the transfer will take", "The checksum algorithm to use"],
      c: 1,
      why: "A tester that ignores it and sends its own preferred size gets requestOutOfRange, and this is the most common integration defect in a flash bring-up." },

    { q: "What is the block sequence counter in the UDS TransferData service?",
      a: ["A 16-bit counter of bytes transferred so far", "A one-byte counter that identifies the block's position and wraps from 0xFF back to 0x00", "The CRC of the preceding block", "The ISO-TP sequence number reused at the application layer"],
      c: 1,
      why: "It identifies position modulo 256, not absolutely, so a client must track the absolute position itself." },

    { q: "Which part of the ECU answers diagnostic requests during reprogramming, and why does it matter?",
      a: ["The application, which suspends its normal tasks", "The bootloader in a protected sector, because the programming session stops the application, so a power cut mid-flash must still leave a device that boots into that bootloader", "A dedicated diagnostic coprocessor", "The gateway ECU on behalf of the target"],
      c: 1,
      why: "A design where an interrupted flash leaves no working bootloader is a device that comes back on a truck." },

    { q: "How do OBD-II and DoIP relate to UDS?",
      a: ["Both are alternative names for UDS", "OBD-II is a different service set sharing the bus and transport layer, while DoIP carries the same UDS services over Ethernet", "OBD-II is UDS over Ethernet and DoIP is UDS over CAN", "Both are obsolete predecessors of UDS"],
      c: 1,
      why: "Same bus, different service set; same services, different transport. Keeping the two distinctions straight is a cheap way to sound like somebody who has worked in the field." },
  ],

  /* --------------------------------------------- 64a-automotive-v-cycle --- */
  "64a-automotive-v-cycle": [
    { q: "What relationship does the V-model assert between its two sides?",
      a: ["The right side happens after the left side is finished", "Each step on the way up verifies the step at the same height on the way down, so anything with no definition of correct on the left cannot be tested on the right", "The left side is design and the right side is documentation", "The two sides are independent and may be done in either order"],
      c: 1,
      why: "That is the only idea in the diagram, and it is why untestable requirements are a process defect rather than a style complaint." },

    { q: "In Automotive SPICE, which process is software integration and integration test?",
      a: ["SWE.3", "SWE.5", "SYS.3", "SWE.6"],
      c: 1,
      why: "SWE.1 is software requirements, SWE.2 architecture, SWE.3 detailed design and code, SWE.4 unit verification, SWE.5 integration, SWE.6 software qualification. An integration engineer sits on SWE.5." },

    { q: "Why is a test case that traces to no requirement considered a finding?",
      a: ["It is not; only requirements without tests are findings", "Because traceability is bidirectional, and a test with no requirement means either an undocumented feature or a test measuring something nobody agreed to", "Because it slows the test suite down", "Because it cannot be automated"],
      c: 1,
      why: "The surprising half of bidirectional traceability, and a good thing to be able to state in an interview." },

    { q: "What makes a software requirement testable?",
      a: ["Being written by the architect rather than the customer", "One obligation per statement, a number with a unit and a tolerance instead of words like fast or robust, and a defined behaviour for the failure case", "Being stored in a requirements management tool", "Being traced to a system requirement"],
      c: 1,
      why: "The tool gives a requirement an identifier, a version, a status and links, which a sentence in a Word file lacks. It does not make an untestable sentence testable." },

    { q: "Name the four layers of AUTOSAR Classic.",
      a: ["HAL, middleware, application and diagnostics", "MCAL, BSW, RTE and SWC", "Bootloader, kernel, drivers and application", "MCAL, RTE, DCM and DEM"],
      c: 1,
      why: "MCAL is the only code that touches registers, BSW holds the standard services, the RTE is generated glue, and the SWCs are the application behaviour, often generated from models in propulsion work." },

    { q: "In an AUTOSAR stack, what are the DCM and the DEM?",
      a: ["The two halves of the communication stack, for CAN and Ethernet", "The diagnostic communication manager, which is the UDS server, and the diagnostic event manager, which owns the fault memory and its DTCs", "The device configuration and device event modules of the MCAL", "Calibration and measurement components"],
      c: 1,
      why: "They are the UDS chapter and the DTC status byte, appearing as configured BSW modules rather than as code you write." },

    { q: "Why does version discipline matter more in an AUTOSAR project than in hand-written firmware?",
      a: ["Because the compilers are proprietary", "Because a large part of the source is configuration in generated XML, so merge conflicts and reproducible builds behave differently from conflicts in C", "Because the code is safety-critical and therefore read-only", "Because suppliers deliver binaries rather than source"],
      c: 1,
      why: "Does the build reproduce bit for bit from a clean checkout is a real question in such a project, and the answer is frequently embarrassing." },

    { q: "What does a baseline consist of in an automotive release?",
      a: ["The released binary and its checksum", "The exact set of source, configuration and tool versions that produced the binary, because a qualified toolchain is part of the argument that the software is correct", "The requirements document at the time of release", "The test report and the defect list"],
      c: 1,
      why: "Which compiler version is a safety question under ISO 26262, not an administrative one." },

    { q: "Why is a green build that compiles all components together not evidence of successful integration?",
      a: ["Because compilation cannot detect syntax errors across components", "Because integration defects live in timing and interface semantics, so without measured cycle times, CPU load, stack high-water marks and bus load the suite passes every one of them", "Because static analysis has not run yet", "Because supplier components are delivered pre-compiled"],
      c: 1,
      why: "Compiling together is not integrating. An integration test that never measures a cycle time proves only that the linker succeeded." },

    { q: "What is the most effective way for an integration engineer to avoid being blamed for other teams' defects?",
      a: ["Escalate every failure to the programme manager on the day it appears", "Make every failure reproducible from a clean checkout with one command, bisect to a specific change rather than a suspected component, and write the defect against a requirement id with a measured number", "Only integrate components that have passed their own unit tests", "Keep a record of which team delivered late"],
      c: 1,
      why: "The signal looks wrong is an accusation; requirement 4711 says 10 ms plus or minus 1 ms and this baseline measures 24 ms is a fact with an owner." },
  ],


  /* ------------------------------------------------- 35-firmware-architecture --- */
  "35-firmware-architecture": [
    { q: "What are the three layers of a conventional firmware architecture, and which way may dependencies point?",
      a: ["Application, middleware and kernel, with dependencies in both directions", "Hardware, device and application, with dependencies pointing downwards only", "Drivers, HAL and vendor library, with the vendor library on top", "Interrupt, background and idle, ordered by priority"],
      c: 1,
      why: "The rule is mechanically checkable: an include from a lower layer to a higher one is a defect, and twenty lines of script in CI enforce it." },

    { q: "A driver needs to notify the application layer that a fault occurred. What is the correct mechanism?",
      a: ["Call the application's handler function directly", "The application registers a callback or the driver posts to a queue, so the dependency still points downwards", "Set a global flag that the application polls", "Raise a software interrupt handled in the application layer"],
      c: 1,
      why: "Dependency inversion costs one function pointer on a microcontroller. A call upwards makes the driver untestable and unportable at the same time." },

    { q: "Why is a peripheral name such as TIM3 allowed only in the hardware layer?",
      a: ["Because vendor headers cannot be included twice", "Because its appearance higher up means the layering has already leaked, and the upper layers can no longer be compiled for a host", "Because peripheral names change between compiler versions", "Because the linker resolves peripheral names last"],
      c: 1,
      why: "The host build is the architecture's own test: if the application still compiles for a PC the layering held, and if it does not, the vendor HAL travelled upwards." },

    { q: "What does an opaque type in a module header buy you?",
      a: ["Faster access to the struct fields", "Callers hold a pointer and cannot reach inside, so internals change without touching any other file", "Automatic thread safety", "Smaller binaries, because the struct is not emitted"],
      c: 1,
      why: "The struct is defined in the .c file. The test for a good header is whether a completely different implementation would force anybody else to edit code." },

    { q: "Why should a driver take an explicit instance pointer rather than using a hidden global?",
      a: ["It is required by MISRA C", "Because a second channel, or a test double, then costs nothing, while a singleton cannot be unit tested and cannot ship a two-channel variant", "Because globals cannot be placed in RAM by the linker", "Because instance pointers are faster to dereference"],
      c: 1,
      why: "Firmware written around singletons is firmware that has to be rewritten the day the product grows a second sensor." },

    { q: "Which two cross-cutting concerns should be decided at the very start of a firmware project?",
      a: ["Naming convention and indentation style", "Error reporting and the time source, because retrofitting either one is effectively a rewrite", "Compiler version and optimisation level", "RTOS choice and stack sizes"],
      c: 1,
      why: "One error type checked at the layer that can act on it, and one monotonic tick everything reads rather than private delay loops in drivers." },

    { q: "Where does a test seam earn its cost, and where is it architecture theatre?",
      a: ["Everywhere, so every module should be abstracted", "Where the logic is, such as a protocol parser, a control law or a state machine, and not around something like a GPIO toggle where there is nothing to test", "Only at the application layer", "Only where the vendor supplies more than one HAL"],
      c: 1,
      why: "Thin driver code is verified with a debugger and a scope, which is what those tools are for." },

    { q: "How does the vendor HAL typically leak into the application layer?",
      a: ["Through the linker script", "Somebody on a deadline calls a HAL function directly from the application because the generated handles are globals in the project root, it works, and the next person copies the pattern", "Because the HAL defines macros with common names", "Because CubeMX rewrites application files on regeneration"],
      c: 1,
      why: "The defences are confining generated code to the hardware layer, running the host build in CI so a violation fails a build in minutes, and checking the include graph mechanically." },

    { q: "Before adding an abstraction layer, what question should you be able to answer?",
      a: ["How much flash it will cost", "What the second implementation is, where the test fake counts as a valid answer and silence does not", "Whether MISRA permits function pointers", "Whether the RTOS supports it"],
      c: 1,
      why: "An abstraction with exactly one implementation that merely renames the vendor HAL costs weeks and abstracts nothing." },

    { q: "Why must a header contain extern declarations rather than variable definitions?",
      a: ["Because headers are compiled separately from source files", "Because a definition in a header becomes one copy per translation unit that includes it", "Because the linker places header variables in flash", "Because const variables cannot be initialised in a header"],
      c: 1,
      why: "The same linkage rules as chapter 5. Include guards, include what you use, and no vendor headers above the hardware layer are the rest of the hygiene a reviewer checks." },
  ],

  /* ---------------------------------------------- 36-build-and-linker-script --- */
  "36-build-and-linker-script": [
    { q: "An embedded build fails with 'undefined reference'. Which step failed, and what does it mean?",
      a: ["The compiler, meaning a missing header", "The linker, meaning the compiler was satisfied but nothing supplied that function at link time", "The preprocessor, meaning an unresolved macro", "The objcopy step, meaning the hex could not be produced"],
      c: 1,
      why: "Knowing which of preprocess, compile, link and objcopy failed explains most error messages immediately. Region overflowed is also the linker, and means the opposite kind of problem." },

    { q: "Why must architecture flags such as mcpu, mfpu and mfloat-abi be identical across every object file and prebuilt library?",
      a: ["Because the compiler caches them between translation units", "Because a mismatch gives either a link error about incompatible float ABIs or a binary that misbehaves once a float crosses a function boundary", "Because the linker script reads them", "Because the debugger cannot otherwise load symbols"],
      c: 1,
      why: "The silent version of this failure is far worse than the loud one, and it is a common cause of a project that works until the first floating-point API call." },

    { q: "Why should firmware be compiled with debug symbols even in a release configuration?",
      a: ["Because symbols make the code faster to execute", "Because symbols live in the ELF and not in the hex, so they cost nothing on the device and are the only way to decode a crash from the field", "Because MISRA requires it", "Because without them the linker cannot garbage-collect sections"],
      c: 1,
      why: "Archiving the ELF alongside the hex is the other half of this: five years later it is what turns a fault address into a function name." },

    { q: "What do -ffunction-sections and -fdata-sections with -Wl,--gc-sections achieve?",
      a: ["They place functions and data in separate memory regions", "They let the linker discard anything unreferenced instead of pulling in a whole object file for one function", "They speed up compilation by parallelising sections", "They reserve sections for a bootloader"],
      c: 1,
      why: "Usually the cheapest size win available on a project that is running out of flash." },

    { q: "In a linker script, what does placing .data with a line meaning greater-than RAM AT greater-than FLASH accomplish?",
      a: ["It duplicates the variables so both copies stay in sync", "It gives initialised globals a load address in flash and a run address in RAM, which is why startup copies the block before main", "It marks the section as read-only in RAM", "It reserves the same addresses in both memories"],
      c: 1,
      why: "The symbols around that section are exactly what the startup code from chapter 24 uses. Section .bss has no load address because it is zeroed instead." },

    { q: "Why does a large zero-initialised array cost RAM but no flash, while the same array initialised to non-zero values costs both?",
      a: ["Because the compiler compresses zeroes", "Because a zeroed array lives in .bss, which startup clears, while non-zero initial values must be stored in flash and copied into RAM", "Because .bss is allocated at run time from the heap", "Because the linker script excludes .bss from the image"],
      c: 1,
      why: "Changing an initialiser from all zeros to anything else can therefore add kilobytes of flash with no visible change to the source's size." },

    { q: "What does KEEP do in a linker script, and why does the interrupt vector table need it?",
      a: ["It marks the section read-only so nothing can write it", "It prevents section garbage collection from discarding the section, which is needed because nothing in C ever references the vector table", "It keeps the section at a fixed address across builds", "It preserves the section's debug symbols"],
      c: 1,
      why: "The vector table is found by the hardware at reset, not by a call, so to the linker it looks like dead code." },

    { q: "The linker reports no overflow, yet a variable changes value on its own at run time. What is the classic cause?",
      a: ["The optimiser reordered writes to that variable", "The stack grew into .bss, because the linker checks the static footprint and knows nothing about run-time call depth", "The flash wore out at that address", "The DMA controller was configured with the wrong width"],
      c: 1,
      why: "Defences: -fstack-usage plus a call-graph script, a filled guard region between stack and .bss, the MPU, and in an RTOS the per-task high-water mark." },

    { q: "What makes a firmware build reproducible, and how do you verify it?",
      a: ["Building always on the same machine", "A pinned toolchain, no __DATE__ or absolute paths baked in, and verification by building twice from clean and diffing the binaries", "Using -O0 so the optimiser cannot vary", "Committing the binary to Git after each build"],
      c: 1,
      why: "Different GCC versions produce different code and sizes, and a safety argument names the compiler version explicitly." },

    { q: "Where do product variants belong?",
      a: ["On long-lived branches, one per variant", "In the build system, built from one source tree with the variant name in the artefact name", "In separate repositories sharing a submodule", "In preprocessor conditionals inside main.c only"],
      c: 1,
      why: "The moment variants live on branches instead of in the build, merging becomes the product's main engineering cost." },
  ],

  /* ------------------------------------------------- 66-git-review-release --- */
  "66-git-review-release": [
    { q: "Why are long-lived feature branches a worse idea in firmware than in most software?",
      a: ["Because Git handles binary files badly", "Because the hardware moves under them, so a pin reassignment or driver change on main leaves the branch conflicting with reality rather than with text", "Because embedded repositories are larger", "Because CI cannot build more than one branch at a time"],
      c: 1,
      why: "Short branches, reviewed, merged and deleted, with a main that always builds and passes the host tests." },

    { q: "What should a firmware commit message record that the diff cannot show?",
      a: ["The list of files touched", "The reasoning, the board revision it was tested on, the measurement that proved it and the datasheet page behind a magic number", "The compiler version used", "The reviewer's name"],
      c: 1,
      why: "That is the difference between a log and an engineering record, and the reader is whoever bisects this in two years." },

    { q: "Why should a CubeMX regeneration go in its own commit?",
      a: ["Because generated code cannot be reviewed at all", "Because it touches hundreds of lines and mixing it with a real change makes both unreviewable, so it is kept separate and names the tool version", "Because Git cannot merge generated files", "Because the generated files must not be tracked"],
      c: 1,
      why: "The same reasoning applies to any vendor or generated artefact in the tree." },

    { q: "What is the single most productive question when reviewing firmware you cannot run?",
      a: ["Is the indentation consistent with the project style", "Is any variable touched by both an ISR and the main context, and if so is it volatile and accessed inside a critical section where needed", "Are all functions documented", "Does every file have a header comment"],
      c: 1,
      why: "Concurrency findings dominate real firmware reviews. Style belongs to the tools, and MISRA and static analysis belong in CI rather than in review comments." },

    { q: "Which of these is a proper review finding about a hardware wait loop?",
      a: ["The loop should use a for rather than a while", "An unbounded wait on a hardware flag needs a timeout and a defined behaviour when it expires", "The loop variable should be const", "The loop should be moved into an ISR"],
      c: 1,
      why: "Blocking in the wrong place, along with buffer checks, ignored error returns and interrupt-before-init, are the rest of the short checklist." },

    { q: "Why must a release binary be built by CI from a tag rather than on a developer's laptop?",
      a: ["Because CI machines are faster", "Because a laptop build cannot be reproduced and nobody knows what was in the working tree at the time", "Because tags cannot be created locally", "Because the toolchain licence requires it"],
      c: 1,
      why: "A pinned toolchain plus a clean checkout from the tag is what makes the artefact re-creatable years later." },

    { q: "What does embedding the output of git describe with the dirty flag into the firmware achieve?",
      a: ["It reduces the binary size by removing the version string", "A binary built from modified sources says so out loud, which makes the classic 'nobody knows what is on this board' failure self-diagnosing", "It allows the bootloader to verify the signature", "It guarantees a reproducible build"],
      c: 1,
      why: "It gives the tag, the distance from it, the short hash and the dirty marker, and the device should report it over its diagnostic interface." },

    { q: "Which artefacts should be archived for every release?",
      a: ["The hex file only, since everything else can be rebuilt", "Hex or binary, the ELF, the map, the build log with the toolchain version, and the test report", "The Git tag alone, since it identifies everything", "The source tarball and the release notes"],
      c: 1,
      why: "The ELF is how a crash address is decoded five years later, and the build log is what names the compiler version in a safety argument." },

    { q: "Who are firmware release notes written for?",
      a: ["Other firmware developers, as a summary of the commit log", "Production, service and the customer, stating what changed, what it fixes, what it breaks, and which hardware revisions and bootloader it is compatible with", "The auditor, as evidence of process compliance", "The version control system, as tag annotation"],
      c: 1,
      why: "If a parameter block changed layout, the notes must say what happens to an updated device's parameters, because something will happen either way." },

    { q: "Why is a device that cannot report its own version a problem beyond inconvenience?",
      a: ["Because the bootloader cannot verify compatibility", "Because the field population becomes unknown, which makes every later decision about recalls, update campaigns and root cause into guesswork", "Because Git cannot tag a release without it", "Because production cannot flash it"],
      c: 1,
      why: "It is two lines of code, and it is one of the clearest differences between a product and a prototype." },
  ],

  /* -------------------------------------------------- 67-technical-english --- */
  "67-technical-english": [
    { q: "In a datasheet, which column may you design against?",
      a: ["The typical column, since it reflects real parts", "The guaranteed minimum or maximum, because typical is not a promise", "Whichever column the application note quotes", "The average of minimum and maximum"],
      c: 1,
      why: "Designing against typical values is how a circuit works on the bench and fails across temperature and process spread." },

    { q: "What is the difference between shall, should and may in specification English?",
      a: ["They are stylistic variants of the same obligation", "Shall is an obligation, should is a recommendation you may deviate from with a reason, and may is a permission", "Shall is future tense, should is conditional, may is optional politeness", "Shall applies to hardware and should to software"],
      c: 1,
      why: "The same distinction runs through requirements documents and through MISRA's mandatory, required and advisory categories." },

    { q: "What is an errata sheet, and when should it be read?",
      a: ["A list of documentation typos, read when a manual seems wrong", "The list of ways the silicon does not behave as the manual says, with description, conditions, impact and workaround, and it is read before a long debugging session rather than after one", "A change log of manual revisions, read at project start only", "A list of deprecated peripherals, read before choosing a part"],
      c: 1,
      why: "Reading the errata first is a genuine professional marker, and it is a cheap sentence to be able to say truthfully in an interview." },

    { q: "What does the phrase 'the user must ensure that' signal in a reference manual?",
      a: ["That the peripheral enforces this condition and will report a fault", "That nothing enforces the condition, so violating it fails silently", "That the condition is checked by the HAL library", "That the behaviour is undefined only in debug builds"],
      c: 1,
      why: "Along with 'it is recommended to', which in a reference manual usually means everybody who ignored it lost a week." },

    { q: "What is the highest-value habit when writing a technical report or support ticket?",
      a: ["Apologising for one's English at the start", "Separating what you expected from what actually happened", "Quoting the full source file for completeness", "Describing the history of the project first"],
      c: 1,
      why: "Together with exact part and document revisions, the list of what you already tried, and one specific question at the end, it is what turns a form reply into a real answer." },

    { q: "In English, what does the word eventually mean?",
      a: ["Possibly, or if needed", "In the end, after some time", "Occasionally", "Unexpectedly"],
      c: 1,
      why: "The Italian eventualmente is possibly or if needed. The same family of false friends includes actually for currently, to control for to check, to pretend for to expect, and sensible for sensitive." },

    { q: "A colleague on a call says something you did not catch. What is the professional response?",
      a: ["Continue and infer the meaning from context to avoid interrupting", "Ask them to repeat, then repeat it back to confirm you understood", "Ask them to send it by email afterwards instead", "Switch the conversation to writing"],
      c: 1,
      why: "The only real failures on a technical call are silence and pretending to have understood. Asking for a repeat reads as careful, not weak." },

    { q: "How should a value such as 0x7E8 or 125 kbit/s be said on a poor-quality call?",
      a: ["As quickly as possible to avoid taking time", "Digit by digit, using the NATO alphabet for letters, and confirmed in writing afterwards", "By spelling it in the speaker's own language first", "By rounding to the nearest convenient value"],
      c: 1,
      why: "Getting a number wrong on a call costs somebody a day of work, and a two-line written summary afterwards is valued far beyond its cost." },

    { q: "Why does reading English well give a misleading sense of one's overall level?",
      a: ["Because technical documents use simplified grammar", "Because reading is passive and far easier, so the gap only appears when a sentence must be produced under time pressure", "Because reading builds vocabulary that speech does not use", "Because manuals are written by non-native speakers"],
      c: 1,
      why: "The fix is narrow: produce something in English daily, speak two minutes aloud weekly, and prepare three set pieces, namely your background, your project and one bug you solved." },

    { q: "What is the right way to state an English level on a CV for a junior role?",
      a: ["Round up, because everybody does and it opens more doors", "State the level you can defend, since it is testable in ninety seconds and an interview often switches language mid-conversation", "Omit it entirely and let the interview decide", "Claim a certificate level you studied for but did not sit"],
      c: 1,
      why: "B2 written, B1 spoken and improving is honest and costs almost nothing in a junior role. If they need more English than you have, the day of the interview is when you want to find out." },
  ],

});
