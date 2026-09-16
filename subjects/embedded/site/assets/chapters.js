/* ==========================================================================
   chapters.js -- the single source of truth for the whole site.
   The sidebar, the home-page cards and every prev/next button are generated
   from this array. Add a chapter here and it appears everywhere.

   Each entry:
     n     chapter number shown in the sidebar ("" for the home page)
     id    file name inside /chapters (without .html)
     title sidebar + card title
     part  section heading it sits under
     blurb one line, shown on the home-page card
     tags  extra words the sidebar search should match
     req   which line of the job posting this chapter answers
     extra set INSTEAD of req when the chapter is not in that advert at all,
           but the regional market asks for it anyway. The home page renders
           these as a second table so the advert coverage stays honest.

   ---------------------------------------------------------------------------
   THE CORPUS.

   1. THE ANCHOR ADVERT. Formigine (MO), a manufacturer of liquid-cooling
      components and systems for electrical and electronic devices, hiring an
      EMBEDDED SOFTWARE ENGINEER "inserito in un percorso di formazione" who
      will work "sia su firmware di sistemi embedded, che su software PLC".
      CCNL Metalmeccanica Industria, 13 mensilita', RAL 26-32K, full time
      08.30-17.30, initial fixed-term contract or apprendistato.

      It is unusually explicit, which is why it carries most of the `req`
      fields here on its own. Its responsibility and requirement lines:

        - "Sviluppare e ottimizzare firmware in C/C++ su microcontrollori e
           sistemi operativi Real-Time (RTOS)."
        - "Progettare l'architettura software per l'ambiente di sviluppo
           STM32."
        - "Implementare e testare protocolli di comunicazione seriale e di
           rete."
        - "Configurare l'interfaccia e la comunicazione tra schede elettroniche
           proprietarie e l'ecosistema dell'automazione industriale (PLC,
           sensori, attuatori)."
        - "Collaborare con il team hardware per il debug e la validazione dei
           sistemi."
        - "Ottima conoscenza della programmazione in C (e C++) in ambito
           embedded su sistemi operativi real-time."
        - "Esperienza (anche accademica o di stage) su ambiente di sviluppo
           STM32."
        - "Conoscenza approfondita dei protocolli di comunicazione seriale e
           Ethernet."
        - "Buona conoscenza della lingua inglese, scritta e parlata."
        - "Laurea in Ingegneria Elettronica, Informatica, dell'Automazione,
           Meccatronica o background tecnico equivalente."
        - Soft skills: "Predisposizione al problem solving", "Team working",
          "Gestione e rispetto delle scadenze/task assegnati".

   2. THE SURROUNDING MARKET, collected the same day. Modena and
      Emilia-Romagna firmware listings converge hard on a set this advert does
      not name: bare-metal AND FreeRTOS, ARM Cortex-M (STM32, NXP), Modbus
      RTU/TCP, CANopen, EtherCAT, PROFINET, EtherNet/IP, OPC UA, embedded Linux
      with Yocto or Buildroot, MISRA C with static analysis, IEC 61508
      functional safety, Git, written test plans, and hardware bring-up with an
      oscilloscope and a logic analyser. Those are `extra`, not `req`, because
      the anchor advert did not write them -- but they are why the course is
      this long.

   3. THE SECOND ADVERT, collected September 2026 and deliberately NOT promoted to
      `req`. An EMBEDDED INTEGRATION ENGINEER at a large engineering services
      company, Automotive, working on "sistemi embedded per applicazioni di
      propulsion". Its lines:

        - "Progettare, sviluppare e mantenere requisiti e architetture software."
        - "Implementare e integrare componenti software per applicazioni
           embedded."
        - "Supportare le attivita' di build e integrazione software."
        - "Esperienza in attivita' di integrazione software/hardware embedded."
        - "Comprensione del linguaggio C."
        - "Esperienza nell'utilizzo di protocolli di comunicazione, quali CAN e
           UDS."
        - "Dimestichezza con sistemi di versionamento del codice, preferibilmente
           Git."
        - "Conoscenza fluente della lingua inglese."

      Most of it already had a chapter: C is Parts 1 and 2, integration
      software/hardware is Parts 4, 5 and 10, CAN is 49, Git is 66, English is
      67, the architecture line is 35 and the build line is 36. Three things did
      not exist anywhere and were added as 49a, 49b and 64a -- ISO-TP, UDS, and
      the automotive V-cycle with its ASPICE vocabulary.

      They carry `extra`, not `req`, ON PURPOSE. index.html says "one posting"
      and "nothing in the advert is left uncovered", and the coverage table is
      generated from the `req` fields -- so a `req` sourced from a DIFFERENT
      advert would quietly turn a true claim into a false one. The chapters name
      this advert in their own "From the advert" box instead, which is honest at
      the point a reader is actually standing.

   WHAT THE RATIO MEANS. Most chapters carry an `extra`. That is the point: the
   advert says "programmazione in C (e C++) in ambito embedded" as eleven words,
   and Parts 1 to 4 are the expansion of those eleven words. A chapter only gets
   a `req` if a real advert line asked for THAT.

   ---------------------------------------------------------------------------
   TWO SEAMS WITH WORK THAT ALREADY EXISTS. Do not let them converge.

     * LogiFlow (the C# academy) chapters 32b, 32c and 32d already cover the
       Modbus register map, AGV and line deadlock, and serial framing with
       RS-485 and CAN -- all of it FROM THE PC SIDE, a .NET application talking
       to a machine it does not control. Chapters 45 to 50 here are the same
       wire seen from the firmware side, where the timing and the buffer are
       yours. Chapter 32d also carries the advert-triage table that separates a
       C#/.NET machine-interfacing job from a C/C++ firmware one; this course is
       what you do once that table says "firmware".

     * `Desktop/plc-lab` holds five IEC 61131-3 Structured Text programs with
       deliberate-breakage exercises. Part 9 covers only as much of the PLC
       world as a firmware engineer needs in order to be the device on the other
       end of the cable. It points at the lab; it does not restate it, and this
       course is not an attempt to become a PLC programmer.
   ========================================================================== */

const PARTS = [
  "Start here",
  "Part 1 — C, as the machine runs it",
  "Part 2 — Memory, pointers and the bugs that bite",
  "Part 3 — C++ on a microcontroller",
  "Part 4 — The microcontroller itself",
  "Part 5 — STM32, concretely",
  "Part 6 — Real-time and the RTOS",
  "Part 7 — Serial protocols",
  "Part 8 — Ethernet and the network",
  "Part 9 — The industrial edge",
  "Part 10 — Debugging, testing and quality",
  "Part 11 — The human requirements",
];

const CHAPTERS = [
  {
    n: "00", id: "00-the-job-posting", part: PARTS[0],
    title: "The job posting, and the boundary of this course",
    blurb: "The advert this course was built from, what it is really asking for, and the one thing a website cannot teach you.",
    tags: "advert annuncio formigine modena embedded software engineer ral ccnl metalmeccanica apprendistato percorso formazione boundary honesty",
    req: "the whole advert",
  },

  /* ---------------------------------------- Part 1: C, as the machine runs it */
  {
    n: "01", id: "01-why-c", part: PARTS[1],
    title: "Why C, and why it is still C",
    blurb: "Not nostalgia: what C gives a 64 KB part that nothing has replaced, and where that same property becomes the danger.",
    tags: "c language history portability abstraction zero overhead assembly toolchain rationale why rust ada alternatives",
    extra: "No advert explains why the language is C. Knowing the answer is what separates a candidate who chose the field from one who was assigned to it.",
  },
  {
    n: "02", id: "02-source-to-hex", part: PARTS[1],
    title: "From source to hex file",
    blurb: "Preprocessor, compiler, assembler, linker, objcopy. Five programs, and most build errors name exactly which one failed.",
    tags: "preprocessor compiler assembler linker objcopy translation unit object file symbol undefined reference toolchain gcc arm-none-eabi elf hex bin map include guard macro",
    extra: "The single most useful debugging skill in the first month, and no advert has ever asked for it in words.",
  },
  {
    n: "03", id: "03-types-and-integers", part: PARTS[1],
    title: "Types, sizes, and the integer rules that catch everyone",
    blurb: "int is not 32 bits because you want it to be. Fixed-width types, integer promotion, signed overflow, and the comparison that is always false.",
    tags: "types int char short long stdint uint8_t int32_t size_t integer promotion usual arithmetic conversion signed unsigned overflow undefined behaviour portability sizeof limits.h",
    req: "Ottima conoscenza della programmazione in C (e C++) in ambito embedded",
  },
  {
    n: "04", id: "04-bits-and-registers", part: PARTS[1],
    title: "Bits: masks, shifts and the register idiom",
    blurb: "Set, clear, toggle, test, and extract a field. Six lines of C you will write every day, and the read-modify-write race hiding in one of them.",
    tags: "bitwise mask shift set clear toggle test field bitfield read modify write atomic register hardware idiom bset bclr shift count undefined",
    extra: "Every embedded interview asks you to set bit 3 without touching the others. It is the field's handshake.",
  },
  {
    n: "05", id: "05-static-and-linkage", part: PARTS[1],
    title: "static, scope and the translation unit",
    blurb: "One keyword, three meanings, and the reason your global variable is visible from a file that should never have seen it.",
    tags: "static extern linkage internal external scope translation unit header guard global local persistent storage duration namespace pollution module boundary",
    extra: "Firmware is built from many small .c files with no module system. `static` is the module system, and most codebases use it badly.",
  },
  {
    n: "06", id: "06-const-and-volatile", part: PARTS[1],
    title: "const, volatile, and the compiler that deleted your poll loop",
    blurb: "The question asked in almost every embedded interview, and the empty while loop that proves you understand the answer.",
    tags: "const volatile restrict qualifier optimiser optimisation poll loop hardware register isr shared variable memory barrier const volatile pointer read only flash placement",
    extra: "Not in this advert, but volatile is the most frequently asked single question in embedded hiring, worldwide.",
  },
  {
    n: "07", id: "07-state-machines-in-c", part: PARTS[1],
    title: "State machines in C",
    blurb: "Switch, table, or function pointer. Firmware is mostly state machines, and choosing the shape early decides whether it stays readable.",
    tags: "state machine fsm switch table driven function pointer enum event transition guard action hierarchical statechart readability entry exit action",
    extra: "The dominant structural pattern in firmware, and one that transfers directly to the SFC chapter of the PLC world in Part 9.",
  },

  /* ----------------------------- Part 2: Memory, pointers and the bugs that bite */
  {
    n: "08", id: "08-pointers-and-arrays", part: PARTS[2],
    title: "Pointers and arrays, properly",
    blurb: "Declaration syntax read right, pointer arithmetic, decay, and why sizeof gives a different answer inside a function.",
    tags: "pointer array decay arithmetic dereference address null void pointer double pointer sizeof declaration syntax spiral rule const pointer pointer to const function pointer",
    extra: "The advert says C. This is the half of C that candidates claim and cannot defend at a whiteboard.",
  },
  {
    n: "09", id: "09-structs-and-alignment", part: PARTS[2],
    title: "Structs, unions, padding and alignment",
    blurb: "Why your 6-byte struct is 8 bytes, why reordering members saves RAM, and why casting a byte buffer to a struct is a trap on the wire.",
    tags: "struct union bitfield padding alignment packed attribute endianness serialisation protocol header cast aliasing memcpy portability unaligned access hard fault",
    extra: "The bridge between C and Part 7: every protocol frame is a struct somebody was tempted to cast.",
  },
  {
    n: "10", id: "10-the-memory-map", part: PARTS[2],
    title: "The memory map: .text, .data, .bss, stack and heap",
    blurb: "Where each variable physically lives, why a large const array costs no RAM, and how to read the linker map when it does not fit.",
    tags: "memory map text rodata data bss stack heap linker script section flash sram map file size region overflow static allocation arm-none-eabi-size",
    extra: "The first question when firmware stops fitting, and the map file answers it in one line.",
  },
  {
    n: "11", id: "11-avoiding-malloc", part: PARTS[2],
    title: "Why embedded code avoids malloc",
    blurb: "Fragmentation without an MMU, non-deterministic timing, and what firmware uses instead: pools, static buffers and ring buffers.",
    tags: "malloc free dynamic allocation fragmentation determinism heap static allocation memory pool fixed block ring buffer circular buffer object pool misra sbrk heap collision",
    extra: "A house rule in almost every firmware team, never written in an advert, and a question you will be asked.",
  },
  {
    n: "12", id: "12-stack-overflow", part: PARTS[2],
    title: "Stack overflow, and how you actually detect it",
    blurb: "No guard page, no exception, no message. The symptom is a variable changing by itself, and the technique is painting the stack.",
    tags: "stack overflow depth recursion local buffer painting watermark canary pattern fill msp psp stack size rtos task stack hard fault corruption mpu guard region",
    extra: "The single most confusing class of embedded bug, because the crash happens far from the cause.",
  },
  {
    n: "13", id: "13-undefined-behaviour", part: PARTS[2],
    title: "Undefined behaviour and the optimiser that exploits it",
    blurb: "Why the code worked at -O0 and broke at -O2, and why that is your bug rather than the compiler's.",
    tags: "undefined behaviour ub optimisation o0 o2 os strict aliasing signed overflow null check removed sequence point uninitialised sanitizer ubsan compiler assumption implementation defined",
    extra: "The explanation for the most common panicked sentence in firmware: it works in debug but not in release.",
  },
  {
    n: "14", id: "14-strings-and-buffers", part: PARTS[2],
    title: "Strings, buffers, and the functions never to use",
    blurb: "strcpy, strcat, sprintf, gets. What goes wrong, what to use instead, and why a buffer overflow on a networked device is a security bug.",
    tags: "string buffer overflow strcpy strncpy strlcpy strcat sprintf snprintf gets null terminator off by one bounds check security cve networked device fuzzing input validation",
    extra: "Once the board has an Ethernet port, this stops being a robustness question and becomes a security one.",
  },

  /* ------------------------------------- Part 3: C++ on a microcontroller */
  {
    n: "15", id: "15-cpp-cost-and-benefit", part: PARTS[3],
    title: "What C++ buys you here, and what it costs",
    blurb: "The advert writes it as '(e C++)' in brackets. That bracket is a real decision, and this is how the team on the other side made it.",
    tags: "cpp c++ embedded zero overhead abstraction cost binary size flash ram templates code bloat subset arm gcc g++ embedded c++ team policy standard version c++17",
    req: "Ottima conoscenza della programmazione in C (e C++) in ambito embedded su sistemi operativi real-time",
  },
  {
    n: "16", id: "16-classes-and-raii", part: PARTS[3],
    title: "Classes, RAII and deterministic destruction",
    blurb: "The one C++ feature that is unambiguously worth it on a microcontroller: a peripheral that cannot be left half-configured.",
    tags: "class constructor destructor raii scope guard resource acquisition is initialisation lock guard peripheral ownership encapsulation initialiser list member function rule of zero",
    extra: "RAII is the argument that wins the C-versus-C++ debate on its merits, and it is worth being able to make it.",
  },
  {
    n: "17", id: "17-constexpr-and-templates", part: PARTS[3],
    title: "constexpr, templates and moving work to compile time",
    blurb: "A lookup table computed by the compiler costs no cycles and no RAM. The same tool used carelessly quadruples your flash.",
    tags: "constexpr consteval template generic static_assert compile time lookup table code bloat instantiation type safety units strong typedef flash size template bloat explicit instantiation",
    extra: "The clearest embedded win in modern C++, and the clearest way to blow the flash budget.",
  },
  {
    n: "18", id: "18-what-to-switch-off", part: PARTS[3],
    title: "What to switch off: exceptions, RTTI, iostreams, heap",
    blurb: "-fno-exceptions, -fno-rtti, and no <iostream>. Which flags most firmware teams set, and the honest reason for each.",
    tags: "fno-exceptions fno-rtti iostream printf heap operator new nothrow flags subset embedded profile binary size determinism unwinding tables nofpu specs nano newlib",
    extra: "Being able to name these flags and justify them is a strong signal in an interview, because it means you have seen a real build.",
  },
  {
    n: "19", id: "19-virtual-and-the-vtable", part: PARTS[3],
    title: "Virtual functions, the vtable, and when it earns its keep",
    blurb: "What a virtual call actually costs in cycles and bytes, and the driver interface where paying it is the right call.",
    tags: "virtual vtable vptr dynamic dispatch polymorphism indirect call cycles overhead final override crtp static polymorphism driver interface hal abstraction devirtualisation pure virtual",
    extra: "The interview question behind it is really: do you know what your abstractions compile to.",
  },
  {
    n: "20", id: "20-mixing-c-and-cpp", part: PARTS[3],
    title: "Mixing C and C++: extern \"C\", headers and the ABI",
    blurb: "Your vendor HAL is C, your application is C++, and the linker error that results is the same one every time.",
    tags: "extern c name mangling abi linkage header guard ifdef __cplusplus linker undefined reference vendor hal cmsis interop callback function pointer static member trampoline",
    extra: "A guaranteed first-week problem on any STM32 project written in C++, since the HAL underneath is C.",
  },

  /* ----------------------------------- Part 4: The microcontroller itself */
  {
    n: "21", id: "21-whats-on-the-die", part: PARTS[4],
    title: "What is actually on the die",
    blurb: "Core, flash, SRAM, buses and peripherals. The block diagram on page one of every datasheet, and how to read it.",
    tags: "microcontroller die block diagram core flash sram bus matrix ahb apb peripheral datasheet reference manual mcu mpu soc package pinout errata harvard von neumann",
    extra: "Reading a datasheet and a reference manual is the actual day-one skill, and nothing else in this course works without it.",
  },
  {
    n: "22", id: "22-cortex-m", part: PARTS[4],
    title: "ARM Cortex-M: core, modes, registers",
    blurb: "M0 to M7, thread and handler mode, MSP and PSP, and the exception model everything else in Part 6 is built on.",
    tags: "arm cortex-m m0 m3 m4 m7 thumb registers r0 r13 sp lr pc psr msp psp thread handler mode privileged exception model systick nvic fpu dsp pendsv svc",
    extra: "Named by almost every firmware advert in the region even when this one did not; STM32 is a Cortex-M with peripherals around it.",
  },
  {
    n: "23", id: "23-memory-mapped-io", part: PARTS[4],
    title: "Memory-mapped I/O and the peripheral register",
    blurb: "A pin is an address. What that means for volatile, for pointers, and for the moment you write a register and nothing happens.",
    tags: "memory mapped io mmio peripheral register address volatile pointer base offset struct overlay cmsis bit field read only write only clear on read side effect peripheral clock enable",
    extra: "Where Part 1 and Part 2 collide with hardware, and the single idea the whole field is built on.",
  },
  {
    n: "24", id: "24-startup-to-main", part: PARTS[4],
    title: "The startup path: reset vector to main",
    blurb: "Everything that runs before the first line of your code: the vector table, .data copied from flash, .bss zeroed, and why main is not special.",
    tags: "reset vector table startup code crt0 bootloader data copy bss zero initialisation static constructors libc init main entry point linker script initial stack pointer 0x08000000",
    extra: "The first thing a debugger shows you when a board is bricked, and the place beginners never look.",
  },
  {
    n: "25", id: "25-clocks-and-plls", part: PARTS[4],
    title: "Clocks and PLLs",
    blurb: "Nothing works until the clock tree is right, and a UART at the wrong baud is almost always a clock problem rather than a UART problem.",
    tags: "clock tree pll hse hsi lse lsi oscillator crystal load capacitor prescaler divider sysclk hclk pclk apb ahb flash wait states baud rate error timing drift ppm clock security system",
    extra: "The most common cause of a peripheral that is configured correctly and still does not work.",
  },
  {
    n: "26", id: "26-interrupts-and-nvic", part: PARTS[4],
    title: "Interrupts, the NVIC and the rules for an ISR",
    blurb: "Priority, pre-emption, latency, and the short list of things an interrupt handler is allowed to do.",
    tags: "interrupt isr irq nvic priority grouping pre-emption nesting latency vector handler atomic critical section disable enable re-entrancy shared variable volatile flag deferred work tail chaining late arrival",
    req: "Sviluppare e ottimizzare firmware in C/C++ su microcontrollori e sistemi operativi Real-Time (RTOS)",
  },
  {
    n: "27", id: "27-dma", part: PARTS[4],
    title: "DMA",
    blurb: "Moving bytes without the CPU: the feature that makes high-rate serial possible, and the cache and coherency traps that come with it.",
    tags: "dma direct memory access channel stream circular mode half transfer complete interrupt double buffer cache coherency invalidate clean burst bus contention uart adc spi mpu non cacheable",
    extra: "The difference between a UART that keeps up at 921600 baud and one that drops bytes, and a favourite follow-up question.",
  },
  {
    n: "28", id: "28-low-power-and-watchdog", part: PARTS[4],
    title: "Low power, sleep modes and the watchdog",
    blurb: "Sleep, stop, standby, and what survives each. Plus the independent watchdog, and why petting it in a timer interrupt defeats it.",
    tags: "low power sleep stop standby wfi wfe wake up rtc backup domain retention current consumption watchdog iwdg wwdg timeout reset window kick pet task supervision reset cause flag",
    extra: "The watchdog half is universal; it is also the clearest example of a safety mechanism that is easy to install and easy to neutralise.",
  },

  /* ---------------------------------------- Part 5: STM32, concretely */
  {
    n: "29", id: "29-the-stm32-family", part: PARTS[5],
    title: "The STM32 family, and choosing a part",
    blurb: "F0 to H7, the part-number grammar, and how an engineer actually narrows thousands of options to three.",
    tags: "stm32 f0 f1 f4 f7 g0 g4 h7 l4 wb part number grammar suffix package pin count flash ram peripheral selection selector nucleo discovery evaluation board cost lifecycle longevity second source",
    req: "Esperienza (anche accademica o di stage) su ambiente di sviluppo STM32",
  },
  {
    n: "30", id: "30-cube-hal-ll-registers", part: PARTS[5],
    title: "CubeMX, CubeIDE, HAL, LL and the bare registers",
    blurb: "Four ways to write the same GPIO line. What each costs, what each hides, and the honest answer to 'do you use the HAL?'",
    tags: "cubemx cubeide hal ll low layer cmsis register bare metal generated code ioc file regeneration overwrite user code section abstraction portability debugging blocking timeout hal_delay",
    req: "Progettare l'architettura software per l'ambiente di sviluppo STM32",
  },
  {
    n: "31", id: "31-gpio", part: PARTS[5],
    title: "GPIO",
    blurb: "Input, output, alternate function, analogue. Push-pull versus open-drain, pull-ups, speed, and the pin that reads high forever.",
    tags: "gpio input output push pull open drain pull up pull down floating alternate function analog mode speed slew rate debounce button led drive strength external interrupt exti bsrr atomic",
    extra: "The first peripheral anyone touches, and the one with the most ways to be subtly wrong.",
  },
  {
    n: "32", id: "32-timers-and-pwm", part: PARTS[5],
    title: "Timers, PWM and input capture",
    blurb: "Prescaler, period, compare. Generating a waveform, measuring one, and counting an encoder, all from the same block.",
    tags: "timer prescaler arr auto reload counter compare capture pwm duty cycle frequency resolution one pulse encoder mode quadrature input capture output compare dead time complementary advanced timer update event",
    extra: "The most versatile peripheral on the chip, and the one that most often replaces a software loop you should not have written.",
  },
  {
    n: "33", id: "33-adc-and-the-analogue-chain", part: PARTS[5],
    title: "ADC, DAC and the analogue front end",
    blurb: "Resolution, reference, sampling time and noise. Turning a count into a temperature, and the errors that live in each step.",
    tags: "adc dac resolution bits reference voltage vref sampling time source impedance aliasing anti alias filter oversampling averaging calibration offset gain error scaling counts engineering units ntc thermistor pt100 4-20ma shunt",
    extra: "The chapter that connects directly to plc-lab exercise 5: scaling a raw count is the same problem on both sides of the wire.",
  },
  {
    n: "34", id: "34-flash-and-bootloader", part: PARTS[5],
    title: "Flash, option bytes and the bootloader",
    blurb: "Writing your own flash at runtime, storing settings that survive a power cut, and updating firmware in the field without bricking it.",
    tags: "flash erase sector page write endurance wear levelling eeprom emulation option bytes read protection rdp bootloader dfu system memory firmware update ota golden image rollback crc integrity dual bank power loss",
    extra: "Field update is where firmware stops being a student project, and the failure mode is a truck roll.",
  },
  {
    n: "35", id: "35-firmware-architecture", part: PARTS[5],
    title: "Designing the software architecture of a firmware project",
    blurb: "Layers, driver interfaces, a hardware abstraction you can test on a PC, and where the advert's word 'architettura' actually points.",
    tags: "architecture layering hal driver interface dependency inversion port adapter testability module boundary header api opaque handle init deinit error code naming convention directory structure coupling seam",
    req: "Progettare l'architettura software per l'ambiente di sviluppo STM32",
  },
  {
    n: "36", id: "36-build-and-linker-script", part: PARTS[5],
    title: "Makefile, CMake and the linker script",
    blurb: "Leaving the IDE. What the generated build is doing, and how to read the .ld file that decides where everything lands.",
    tags: "makefile cmake ninja toolchain file cross compile arm-none-eabi linker script ld memory region section placement entry point map file flags optimisation debug symbols ci build reproducible out of tree",
    extra: "The step that turns a project from an IDE artefact into something a build server can produce, which is what a team needs.",
  },

  /* --------------------------------------- Part 6: Real-time and the RTOS */
  {
    n: "37", id: "37-what-real-time-means", part: PARTS[6],
    title: "What 'real-time' actually means",
    blurb: "Not fast: predictable. Hard, firm and soft deadlines, worst-case execution time, and why average latency is the wrong number.",
    tags: "real time hard soft firm deadline determinism latency jitter worst case execution time wcet schedulability rate monotonic utilisation bound response time analysis predictability percentile tail",
    req: "Sviluppare e ottimizzare firmware in C/C++ su microcontrollori e sistemi operativi Real-Time (RTOS)",
  },
  {
    n: "38", id: "38-superloop-or-rtos", part: PARTS[6],
    title: "Superloop or RTOS: choosing honestly",
    blurb: "A while(1) with a state machine is a legitimate architecture. Knowing when it stops being one is the actual skill.",
    tags: "superloop main loop bare metal cooperative scheduler round robin time triggered rtos threshold complexity blocking call responsiveness ram overhead kernel decision criteria protothread",
    extra: "Market listings ask for 'bare-metal and/or RTOS' as a pair. Being able to argue either way is worth more than preferring one.",
  },
  {
    n: "39", id: "39-tasks-and-scheduler", part: PARTS[6],
    title: "Tasks, the scheduler and priorities",
    blurb: "Each task believes it owns the CPU. Ready, running, blocked, suspended, and how a priority choice becomes a missed deadline.",
    tags: "task thread stack tcb scheduler pre-emptive priority ready running blocked suspended context switch tick idle task starvation round robin same priority yield delay until periodic busy wait",
    req: "Sviluppare e ottimizzare firmware in C/C++ su microcontrollori e sistemi operativi Real-Time (RTOS)",
  },
  {
    n: "40", id: "40-queues-semaphores-mutexes", part: PARTS[6],
    title: "Queues, semaphores and mutexes",
    blurb: "Three primitives that look interchangeable and are not. Which one signals, which one counts, and which one owns.",
    tags: "queue mailbox semaphore binary counting mutex ownership recursive event group task notification producer consumer blocking timeout copy by value shared resource critical section race condition deadlock lost wakeup",
    extra: "Choosing wrongly here is the most common RTOS design error, and picking a mutex for signalling is the classic one.",
  },
  {
    n: "41", id: "41-priority-inversion", part: PARTS[6],
    title: "Priority inversion, and the rover that rebooted",
    blurb: "Mars Pathfinder, 1997. A high-priority task blocked by a low-priority one, and the inheritance protocol that fixes it.",
    tags: "priority inversion unbounded mars pathfinder 1997 mutex priority inheritance ceiling protocol watchdog reset deadlock livelock blocking time analysis vxworks case study medium priority preemption",
    extra: "The best-documented real-time bug in history, and the fastest way to show an interviewer you think about time rather than throughput.",
  },
  {
    n: "42", id: "42-isr-and-the-rtos", part: PARTS[6],
    title: "Interrupts and the RTOS: the FromISR rule",
    blurb: "Why calling the ordinary API from an interrupt hangs the system, and how work is deferred out of an ISR properly.",
    tags: "fromisr interrupt safe api yield higher priority task woken deferred interrupt handling daemon task timer task max syscall interrupt priority configmax basepri nesting critical section portable rules configassert",
    extra: "The first thing that goes wrong on a real RTOS project, and it fails silently rather than loudly.",
  },
  {
    n: "43", id: "43-timing-and-jitter", part: PARTS[6],
    title: "Timing, jitter, and how you measure it",
    blurb: "A GPIO pin and an oscilloscope beat any estimate. Cycle counters, trace, and measuring what you claim to have optimised.",
    tags: "timing measurement jitter gpio toggle oscilloscope dwt cycle counter systick timestamp trace itm swo profiling benchmark worst case interrupt latency measurement overhead observer effect histogram",
    extra: "The advert says 'ottimizzare'. Optimising without measuring is the thing this chapter exists to stop.",
  },
  {
    n: "44", id: "44-freertos-concretely", part: PARTS[6],
    title: "FreeRTOS concretely, and what else exists",
    blurb: "FreeRTOSConfig.h, the API you will actually type, and an honest map of Zephyr, ThreadX, RT-Thread, embOS and CMSIS-RTOS.",
    tags: "freertos config heap_1 heap_4 tick rate configuration api xtaskcreate vtaskdelay xqueuesend zephyr threadx azure rtos rt-thread embos cmsis-rtos2 osal licence mit certification safertos posix",
    extra: "The market asks for 'an RTOS' and means FreeRTOS about three times in four, but naming the alternatives shows you know it is a category.",
  },

  /* ------------------------------------------ Part 7: Serial protocols */
  {
    n: "45", id: "45-the-physical-layer", part: PARTS[7],
    title: "The physical layer, and why RS-485",
    blurb: "Voltage levels, single-ended versus differential, grounding and termination. Why a cable 200 m long changes the answer.",
    tags: "physical layer ttl rs232 rs422 rs485 differential common mode noise immunity ground loop isolation termination resistor 120 ohm fail safe biasing stub topology daisy chain cable length shield twisted pair half duplex direction control",
    req: "Conoscenza approfondita dei protocolli di comunicazione seriale e Ethernet",
  },
  {
    n: "46", id: "46-uart", part: PARTS[7],
    title: "UART",
    blurb: "Start bit, data, parity, stop. Baud mismatch, overrun, and the three ways to receive: polling, interrupt and DMA.",
    tags: "uart usart asynchronous baud rate start stop parity framing error overrun noise error rx tx polling interrupt dma idle line detection ring buffer flow control rts cts break loopback oversampling 8x 16x",
    req: "Implementare e testare protocolli di comunicazione seriale e di rete",
  },
  {
    n: "47", id: "47-framing", part: PARTS[7],
    title: "Framing: knowing where a message starts",
    blurb: "A byte stream is not a message stream. Delimiters, length prefixes, escaping, timeouts and checksums, and the resynchronisation you must design.",
    tags: "framing delimiter sentinel length prefix cobs byte stuffing escape slip crc checksum parity resynchronisation partial frame timeout inter character gap state machine parser robustness garbage malformed length",
    extra: "The bug that looks like a hardware fault and is not. LogiFlow chapter 32d covers the same idea from the PC side.",
  },
  {
    n: "48", id: "48-spi-and-i2c", part: PARTS[7],
    title: "SPI and I2C",
    blurb: "The two buses inside the box. Four wires and full duplex, or two wires and addressing, plus the I2C lockup that needs a manual recovery.",
    tags: "spi mosi miso sclk cs chip select mode cpol cpha full duplex daisy chain i2c sda scl open drain pull up address 7 bit ack nack clock stretching arbitration bus lockup recovery repeated start 100k 400k sensor datasheet",
    extra: "Every sensor on the board speaks one of these two, and the I2C recovery sequence is a real interview question.",
  },
  {
    n: "49", id: "49-can-and-canopen", part: PARTS[7],
    title: "CAN and CANopen",
    blurb: "A bus with no master, arbitration by identifier, and hardware error handling. Then CANopen: the object dictionary, PDO, SDO and NMT.",
    tags: "can bus arbitration identifier priority dominant recessive bit stuffing ack error frame error counter bus off tec rec sample point bit timing canopen object dictionary pdo sdo nmt heartbeat eds node id can-fd j1939 termination",
    extra: "Named across regional machinery and vehicle listings. LogiFlow 32d introduces the frame from the PC side; here you configure the controller.",
  },
  {
    n: "49a", id: "49a-iso-tp", part: PARTS[7],
    title: "ISO-TP: more than eight bytes over CAN",
    blurb: "ISO 15765-2, the transport layer between CAN and UDS: single, first, consecutive and flow-control frames, block size, STmin, and the timers that decide whether a reflash finishes.",
    tags: "iso-tp isotp iso 15765-2 transport layer segmentation reassembly single frame first frame consecutive frame flow control pci sequence number block size bs stmin separation time padding normal extended mixed addressing 7df 7e0 7e8 18da functional physical n_as n_ar n_bs n_cr n_cs timeout abort can fd escape socketcan isotpsend",
    extra: "Named indirectly by a second advert in the corpus, an automotive Embedded Integration Engineer role asking for 'CAN e UDS'. UDS does not run on CAN; it runs on this, and naming the layer between them is the difference between two acronyms and a stack.",
  },
  {
    n: "49b", id: "49b-uds", part: PARTS[7],
    title: "UDS: the diagnostic language of the ECU",
    blurb: "ISO 14229: services and the plus-0x40 response, negative response codes, sessions and security access, the 0x78 that is not an error, and the ten-message sequence that reflashes a control unit.",
    tags: "uds iso 14229 diagnostic service identifier sid positive response negative response nrc 7f 78 response pending p2 p2star session control 10 03 programming session security access 27 seed key 33 35 36 37 tester present 3e suppress positive response bit s3 timer read data by identifier 22 did f190 vin write 2e read dtc 19 status byte clear 14 routine control 31 request download 34 transfer data 36 transfer exit 37 ecu reset 11 communication control 28 control dtc setting 85 bootloader reflash obd2 j1979 doip iso 13400 dcm dem",
    extra: "The one line of the automotive Embedded Integration Engineer advert that nothing else in this course answers: 'protocolli di comunicazione, quali CAN e UDS'. Outside automotive UDS is rare; inside it, it is assumed the way Modbus is assumed on a factory floor.",
  },
  {
    n: "50", id: "50-modbus-rtu", part: PARTS[7],
    title: "Modbus RTU",
    blurb: "The lingua franca of the factory floor. Function codes, the four register spaces, CRC, the 3.5-character silence, and off-by-one addressing.",
    tags: "modbus rtu ascii serial rs485 master slave client server function code 01 02 03 04 05 06 15 16 coil discrete input holding register input register crc16 silent interval 3.5 character exception code address offset 40001 one based zero based polling timeout broadcast",
    extra: "The protocol most likely to be on the wire between the board in this advert and the PLC next to it. LogiFlow 32b covers the register map from the C# side.",
  },

  /* -------------------------------------- Part 8: Ethernet and the network */
  {
    n: "51", id: "51-ethernet-on-an-mcu", part: PARTS[8],
    title: "Ethernet on a microcontroller",
    blurb: "MAC, PHY, MII and RMII, descriptors and buffers. What the silicon does for you and what your firmware still has to do.",
    tags: "ethernet mac phy mii rmii magnetics rj45 descriptor ring buffer dma auto negotiation link status 10baset 100baset full duplex crc frame mtu promiscuous multicast switch mdio smi phy address",
    req: "Conoscenza approfondita dei protocolli di comunicazione seriale e Ethernet",
  },
  {
    n: "52", id: "52-tcp-ip-in-64kb", part: PARTS[8],
    title: "TCP/IP in 64 KB: lwIP",
    blurb: "A real stack on a part with no MMU. pbufs, zero-copy, the raw API against sockets, and what runs out first.",
    tags: "lwip tcp ip udp arp icmp dhcp dns pbuf zero copy raw api netconn socket api memory pool tcp_pcb window size nagle keepalive retransmission ram budget no mmu single thread callback tcpip_thread",
    extra: "The advert says Ethernet and means a stack. lwIP is what is running in the overwhelming majority of these products.",
  },
  {
    n: "53", id: "53-modbus-tcp", part: PARTS[8],
    title: "Modbus TCP",
    blurb: "The same registers over a socket. The MBAP header, why the CRC disappears, and the concurrency the serial version never had.",
    tags: "modbus tcp mbap header transaction identifier protocol identifier unit id port 502 no crc multiple connections concurrency reentrancy server client gateway serial bridge timeout keepalive half open connection connection limit",
    extra: "The usual upgrade path from chapter 50, and the point where a firmware engineer meets the IT network.",
  },
  {
    n: "54", id: "54-mqtt-and-the-plant-network", part: PARTS[8],
    title: "MQTT and the plant network",
    blurb: "Publish, subscribe, QoS and last will. Telemetry off the machine, and the firewall conversation that comes with it.",
    tags: "mqtt broker publish subscribe topic wildcard qos 0 1 2 retained message last will testament keepalive tls certificate port 1883 8883 telemetry iot sparkplug b cloud firewall outbound ot it segmentation purdue model",
    extra: "Increasingly common in regional listings once a product ships with Ethernet, and the protocol that gets a device onto a network IT will accept.",
  },
  {
    n: "55", id: "55-industrial-ethernet", part: PARTS[8],
    title: "Industrial Ethernet: PROFINET, EtherCAT, EtherNet/IP, OPC UA",
    blurb: "Four names that appear together in adverts and are not alternatives. What each is for, and which need a stack, a licence or dedicated silicon.",
    tags: "profinet rt irt profibus ethercat distributed clocks slave controller esc et1100 ethernet ip cip odva opc ua pubsub server companion specification tsn determinism conformance certification stack vendor licence cost gateway cycle time",
    extra: "Regional adverts list these as a set; knowing which one the customer's PLC speaks decides the whole architecture.",
  },

  /* --------------------------------------- Part 9: The industrial edge */
  {
    n: "56", id: "56-what-a-plc-is", part: PARTS[9],
    title: "What a PLC is, for a firmware engineer",
    blurb: "The scan cycle, the I/O image, IEC 61131-3, and why the machine on the other end of your cable thinks in a way your firmware does not.",
    tags: "plc programmable logic controller scan cycle read inputs execute write outputs io image table ladder ld structured text st fbd sfc il iec 61131-3 siemens tia portal codesys rack din rail retentive memory cpu load cycle time determinism latching seal in",
    req: "Configurare l'interfaccia e la comunicazione tra schede elettroniche proprietarie e l'ecosistema dell'automazione industriale (PLC, sensori, attuatori)",
  },
  {
    n: "57", id: "57-sensors-and-actuators", part: PARTS[9],
    title: "Sensors, actuators and the signals between them",
    blurb: "24 V logic, PNP and NPN, 4-20 mA and its live zero, thermocouples and RTDs, relays and the inductive kickback that resets your board.",
    tags: "sensor actuator 24v industrial logic pnp npn sinking sourcing digital input filter 4-20ma live zero 0-10v thermocouple rtd pt100 ntc loop powered transmitter relay contactor solenoid valve inductive kickback flyback diode snubber opto isolation surge transient emc e-stop normally closed",
    req: "Configurare l'interfaccia e la comunicazione tra schede elettroniche proprietarie e l'ecosistema dell'automazione industriale (PLC, sensori, attuatori)",
  },
  {
    n: "58", id: "58-talking-to-the-plc", part: PARTS[9],
    title: "Talking to the PLC: who is master, and what happens when the link drops",
    blurb: "The integration questions that decide the design: who polls whom, what the register map is, and what the machine does when your board stops answering.",
    tags: "integration master slave client server polling cycle register map documentation byte order word order endianness float 32 bit two registers watchdog heartbeat link loss fail safe state fallback default output timeout retry commissioning collaudo interoperability test acceptance",
    req: "Configurare l'interfaccia e la comunicazione tra schede elettroniche proprietarie e l'ecosistema dell'automazione industriale (PLC, sensori, attuatori)",
  },
  {
    n: "59", id: "59-the-product-liquid-cooling", part: PARTS[9],
    title: "The product behind this advert: liquid cooling",
    blurb: "Pumps, flow, temperature and leaks. What a cooling controller actually has to do, and the interview answer that shows you read who they are.",
    tags: "liquid cooling chiller pump flow rate sensor temperature delta t heat exchanger cold plate condensation dew point leak detection interlock alarm pid control hysteresis power electronics data centre inverter igbt thermal runaway safety shutdown derating",
    extra: "Not a technical requirement in the advert, but reading the company's own product description and arriving with questions about it is the cheapest differentiator there is.",
  },

  /* ------------------------------ Part 10: Debugging, testing and quality */
  {
    n: "60", id: "60-the-debugger", part: PARTS[10],
    title: "The debugger: SWD, breakpoints, and why they lie",
    blurb: "ST-LINK, J-Link and OpenOCD. Hardware breakpoints, watchpoints, and how stopping a core changes the behaviour you were trying to observe.",
    tags: "swd jtag st-link j-link openocd gdb hardware breakpoint watchpoint limit flash patch comparator single step halt core peripheral freeze timer continues heisenbug attach connect under reset hard fault handler cfsr hfsr stack frame unwinding post mortem",
    req: "Collaborare con il team hardware per il debug e la validazione dei sistemi",
  },
  {
    n: "61", id: "61-printf-and-tracing", part: PARTS[10],
    title: "Printf, tracing and the cost of looking",
    blurb: "A blocking printf in an interrupt changes the timing it was measuring. Cheaper instruments: SWO, RTT, a ring buffer and a pin.",
    tags: "printf semihosting retarget _write uart blocking timing distortion swo itm rtt segger trace ring buffer log level circular log post mortem flash log error code assert numeric id binary log timestamp overhead deferred logging",
    extra: "The first instinct everyone brings from PC programming, and the one that hides real-time bugs most effectively.",
  },
  {
    n: "62", id: "62-scope-and-logic-analyser", part: PARTS[10],
    title: "The oscilloscope and the logic analyser",
    blurb: "Two different instruments for two different questions. Triggering, probing, and reading a decoded bus next to an analogue edge.",
    tags: "oscilloscope logic analyser bandwidth sample rate probe ground lead inductance trigger edge pulse width protocol decode uart spi i2c can saleae sigrok rise time ringing overshoot noise floor differential probe isolation glitch single shot capture persistence",
    req: "Collaborare con il team hardware per il debug e la validazione dei sistemi",
  },
  {
    n: "63", id: "63-reading-a-schematic", part: PARTS[10],
    title: "Reading a schematic",
    blurb: "Enough to ask the hardware engineer the right question: nets, power rails, pull-ups, level shifters, and finding your pin on the sheet.",
    tags: "schematic netlist symbol reference designator r c u q net label power rail decoupling capacitor pull up pull down resistor divider level shifter transistor mosfet gate opto coupler connector pinout test point bom datasheet errata pcb layout ground plane bring up",
    req: "Collaborare con il team hardware per il debug e la validazione dei sistemi",
  },
  {
    n: "64", id: "64-testing-firmware", part: PARTS[10],
    title: "Testing firmware: off-target unit tests and HIL",
    blurb: "Compiling your logic for the PC and testing it there, faking the hardware at a seam, and what only a real board can tell you.",
    tags: "unit test off target host native build ceedling unity cmock googletest fake mock stub hardware abstraction seam dependency injection ci pipeline coverage integration test hardware in the loop hil test fixture regression smoke test acceptance collaudo validation verification golden data",
    extra: "Regional listings ask for written test plans; being able to describe a test that runs without a board is what makes CI possible at all.",
  },
  {
    n: "64a", id: "64a-automotive-v-cycle", part: PARTS[10],
    title: "The automotive V-cycle: requirements, architecture, integration",
    blurb: "What an automotive programme means by requisiti, architetture and attivita' di build e integrazione: the V-model, Automotive SPICE, where AUTOSAR fits, and what an integration engineer does on a Tuesday.",
    tags: "v model v cycle automotive spice aspice swe.1 swe.2 swe.3 swe.4 swe.5 swe.6 sys.1 sys.2 requirements engineering testable requirement traceability bidirectional doors polarion codebeamer iso 26262 asil functional safety autosar classic adaptive mcal bsw rte swc arxml dcm dem simulink model based software integration integration test build variant baseline reproducible build toolchain qualification a2l hex s19 hil restbus canoe canalyzer canape vector defect bisection cycle time cpu load bus load can matrix dbc",
    extra: "The second advert in the corpus asks for 'progettare, sviluppare e mantenere requisiti e architetture software' and 'supportare le attivita' di build e integrazione'. That is a different job from the rest of this course, and it is worth naming as one.",
  },
  {
    n: "65", id: "65-misra-and-safety", part: PARTS[10],
    title: "MISRA C, static analysis and functional safety",
    blurb: "Coding standards that forbid legal C, the tools that enforce them, and what IEC 61508 and a SIL rating actually demand.",
    tags: "misra c 2012 rule directive mandatory required advisory deviation static analysis cppcheck pc-lint polyspace coverity compiler warning werror iec 61508 sil iso 26262 asil do-178c traceability requirement review documentation certification safe subset defensive programming machinery directive iso 13849",
    extra: "Appears in regional safety-critical and machinery listings, and increasingly in machine-directive work. Knowing what MISRA is for matters more than memorising rules.",
  },
  {
    n: "66", id: "66-git-review-release", part: PARTS[10],
    title: "Git, code review and the release",
    blurb: "Branching for firmware, reviewing code you cannot run, tagging a build that ships in metal, and knowing which binary is in the field.",
    tags: "git branch tag merge rebase pull request code review checklist firmware version semantic versioning build number git hash embedded in binary reproducible build release note artefact archive traceability bootloader compatibility field return submodule vendor library",
    extra: "Universal in the market and absent from this advert. It is also how the hardware team's fix and yours end up in the same binary.",
  },

  /* -------------------------------- Part 11: The human requirements */
  {
    n: "67", id: "67-technical-english", part: PARTS[11],
    title: "Technical English",
    blurb: "The advert asks for written and spoken English. In this job it means the reference manual, the errata, the vendor forum and the supplier call.",
    tags: "english written spoken reference manual datasheet errata application note vendor support ticket forum supplier call meeting technical vocabulary false friend pronunciation acronym reading comprehension b1 b2 c1 interview in english",
    req: "Buona conoscenza della lingua inglese, scritta e parlata",
  },
  {
    n: "68", id: "68-the-degree-line", part: PARTS[11],
    title: "The degree line, and how to read it",
    blurb: "'Elettronica, Informatica, dell'Automazione, Meccatronica o background tecnico equivalente' names your degree and then opens the door wider. What that means for you.",
    tags: "laurea degree ingegneria elettronica informatica automazione meccatronica background tecnico equivalente perito itis screening filter transferable skill self taught portfolio evidence gap analysis apprendistato percorso di formazione junior training",
    req: "Laurea in Ingegneria Elettronica, Informatica, dell'Automazione, Meccatronica o background tecnico equivalente",
  },
  {
    n: "69", id: "69-soft-skills", part: PARTS[11],
    title: "Problem solving, team working, deadlines",
    blurb: "Three lines that look like filler. In a firmware team each has a concrete meaning, and each has a question that tests it.",
    tags: "soft skill problem solving debugging method hypothesis bisection team working hardware electronics mechanical production supplier customer deadline scadenza task stima estimate commitment communication escalation blocked asking for help star method behavioural interview",
    req: "Predisposizione al problem solving; Team working; Gestione e rispetto delle scadenze/task assegnati",
  },
  {
    n: "70", id: "70-the-cv", part: PARTS[11],
    title: "The CV and the ATS",
    blurb: "Claiming embedded honestly when your evidence is a course and a Nucleo board, and passing the keyword filter without lying to it.",
    tags: "cv curriculum ats applicant tracking keyword screening pdf format linkedin project portfolio github repository evidence honest claim overclaim boundary junior career change transferable software engineering degree cover letter italian english version",
    extra: "This subject carries the overclaim risk most sharply of the six, because the interviewer can hand you a board.",
  },
  {
    n: "71", id: "71-the-interview", part: PARTS[11],
    title: "The interview, the contract and the RAL",
    blurb: "The technical round you should expect, CCNL Metalmeccanica and 13 mensilita', RAL 26-32K, apprendistato, and the questions to ask them.",
    tags: "interview colloquio tecnico whiteboard volatile bit manipulation debugging scenario ral 26 32k ccnl metalmeccanica industria 13 mensilita livello impiegato apprendistato tempo determinato formigine modena orario full time domande da fare negoziazione controproposta percorso di crescita",
    req: "the whole advert",
  },
];

/* Make available to plain <script> pages (no modules -- this must run on file://).

   `self`, not `window`. They are the same object in a page, and in a SERVICE WORKER
   there is no `window` at all -- so writing `window.CHAPTERS` here would throw the
   moment sw.js does importScripts() on this file. It does exactly that, so the
   offline precache list is generated from this array rather than being a second
   copy of it that goes stale. */
self.PARTS = PARTS;
self.CHAPTERS = CHAPTERS;
