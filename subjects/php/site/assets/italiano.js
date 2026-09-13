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
   ========================================================================== */

window.IT_PHRASES = [
  {
    group: "Opening the call",
    items: [
      { it: "Buongiorno, sono Mario Rossi. Grazie per il tempo che mi dedica.",
        en: "Good morning, I'm Mario Rossi. Thank you for your time.",
        note: "Mario Rossi is the placeholder — say your own name. Use Lei (formal) until they move to tu. In smaller software houses they usually move within a minute; follow, do not lead." },
      { it: "Mi fa piacere. Preferisce che parliamo in italiano o in inglese?",
        en: "Happy to be here. Would you prefer we speak in Italian or English?",
        note: "Only ask if the advert was in English. Asking when the advert was Italian reads as low confidence." },
      { it: "Mi presento brevemente: sono laureato in Informatica a Camerino e lavoro principalmente con PHP, Laravel e MySQL.",
        en: "A quick introduction: I have a Computer Science degree from Camerino and I work mainly with PHP, Laravel and MySQL." },
    ],
  },
  {
    group: "Buying yourself time",
    items: [
      { it: "Mi lasci pensare un attimo, voglio darle una risposta precisa.",
        en: "Let me think for a second — I want to give you an accurate answer.",
        note: "Far better than filling the silence. Interviewers read a considered pause as confidence and a rushed wrong answer as the opposite." },
      { it: "Se ho capito bene, mi sta chiedendo come gestirei...",
        en: "If I've understood correctly, you're asking how I would handle..." },
      { it: "Posso farle una domanda per circoscrivere il problema?",
        en: "May I ask a question to narrow the problem down?",
        note: "Asking a clarifying question before answering a design question is itself part of the answer." },
    ],
  },
  {
    group: "Admitting a gap without losing the room",
    items: [
      { it: "Non l'ho mai usato in produzione, ma so a cosa serve e come si inserisce: ...",
        en: "I have never used it in production, but I know what it is for and where it fits: ...",
        note: "The strongest possible move. Never bluff — Italian technical interviewers probe, and a bluff that collapses costs more than the gap." },
      { it: "Questo non lo so. Come lo affronterei: partirei da...",
        en: "I don't know that one. Here is how I would approach it: I would start from...",
        note: "Say the first sentence and then keep talking. What is being measured is what you do when you don't know." },
      { it: "L'ho studiato ma non l'ho ancora applicato su un progetto reale.",
        en: "I've studied it but haven't applied it on a real project yet." },
    ],
  },
  {
    group: "Disagreeing politely",
    items: [
      { it: "Capisco il punto. La mia esperienza è stata diversa, in questo senso: ...",
        en: "I take the point. My experience has been different, in this sense: ..." },
      { it: "Dipende dal contesto: se il carico è basso sceglierei..., se invece...",
        en: "It depends on context: with low load I'd choose..., whereas if...",
        note: "\"Dipende\" is a good answer when you then say what it depends on. On its own it is an empty answer." },
    ],
  },
  {
    group: "Talking about your projects",
    items: [
      { it: "Le faccio un esempio concreto da un progetto che ho seguito.",
        en: "Let me give you a concrete example from a project I worked on." },
      { it: "Il problema era..., la soluzione che ho scelto è stata..., e il risultato è stato...",
        en: "The problem was..., the solution I chose was..., and the result was...",
        note: "Problem, action, result. Rehearse this shape for three projects and you will never be caught out by \"parlami di un progetto\"." },
      { it: "In quel caso ho sbagliato la stima iniziale, e da lì ho imparato a...",
        en: "In that case I got the initial estimate wrong, and from that I learned to...",
        note: "Have one real failure ready. Candidates who claim nothing ever went wrong are not believed." },
    ],
  },
  {
    group: "Asking about the work",
    items: [
      { it: "Quante persone ci sono nel team e come sono organizzate?",
        en: "How many people are on the team and how are they organised?" },
      { it: "Fate code review? Con quale processo?",
        en: "Do you do code review? What's the process?" },
      { it: "Che percentuale del lavoro è su progetti nuovi e quanta è manutenzione?",
        en: "What proportion of the work is new projects versus maintenance?",
        note: "The single most useful question you can ask a software house, and the answer is often 70% maintenance. Better to know now." },
      { it: "Chi decide le scelte architetturali?",
        en: "Who makes the architectural decisions?" },
      { it: "Avete test automatici? Su quale parte del codice?",
        en: "Do you have automated tests? On which part of the codebase?" },
    ],
  },
  {
    group: "Money and contract",
    items: [
      { it: "Qual è la RAL prevista per questa posizione?",
        en: "What is the gross annual salary (RAL) for this position?",
        note: "RAL = Retribuzione Annua Lorda, gross annual. Italian offers are always discussed in RAL, never monthly net. Know the difference before the call." },
      { it: "La mia aspettativa è nell'ordine di ... mila euro di RAL, ma sono flessibile in base al pacchetto complessivo.",
        en: "My expectation is in the region of ...k RAL, but I'm flexible depending on the overall package." },
      { it: "Che tipo di contratto e quale CCNL applicate?",
        en: "What type of contract, and which national collective agreement do you apply?",
        note: "CCNL Metalmeccanici and CCNL Commercio are the two common ones and they differ in holiday, notice period and pay scales." },
      { it: "È previsto un contratto di apprendistato?",
        en: "Is an apprenticeship contract envisaged?",
        note: "Under 30 you are eligible for apprendistato: lower cost to the employer, which is real negotiating room for you. Ask about the training plan." },
      { it: "Come gestite il lavoro da remoto?",
        en: "How do you handle remote work?" },
    ],
  },
  {
    group: "Closing",
    items: [
      { it: "Quali sono i prossimi passi del processo?",
        en: "What are the next steps in the process?",
        note: "Always ask. It gets you a timeline you can follow up against without seeming pushy." },
      { it: "La ringrazio, resto a disposizione per qualsiasi chiarimento.",
        en: "Thank you, I remain available for any clarification.",
        note: "Also the right closing line for the follow-up email." },
    ],
  },
];

/* --------------------------------------------------------------------------
   Per-chapter lines. `say` is what you would actually say out loud about that
   topic; `keep` is the technical vocabulary that stays English inside an
   Italian sentence.
   -------------------------------------------------------------------------- */
window.IT_CHAPTERS = {
  "01-php-platform": {
    say: [
      "PHP-FPM gestisce un pool di processi worker: ogni richiesta parte da uno stato pulito.",
      "OPcache tiene in memoria il bytecode compilato, così non si ricompila a ogni richiesta.",
    ],
    keep: ["PHP-FPM", "worker", "pool", "OPcache", "bytecode", "deploy"],
  },
  "02-php-fundamentals": {
    say: [
      "Uso sempre declare(strict_types=1): il type juggling di PHP è comodo ma nasconde i bug.",
      "Con il confronto largo due stringhe numeriche vengono confrontate come numeri.",
    ],
    keep: ["strict_types", "type juggling", "cast", "string", "array"],
  },
  "03-oop-in-php": {
    say: [
      "Preferisco le interfacce alle classi astratte quando mi serve solo un contratto.",
      "Gli enum backed di PHP 8.1 hanno sostituito quasi tutte le costanti di classe che scrivevo prima.",
    ],
    keep: ["interface", "trait", "enum", "readonly", "abstract", "final"],
  },
  "05-solid-and-patterns": {
    say: [
      "Il principio che uso di più è la dependency inversion: dipendo da un'interfaccia, non dall'implementazione.",
      "Il service container di Laravel è di fatto un'applicazione del pattern.",
    ],
    keep: ["SOLID", "dependency injection", "container", "pattern", "repository"],
  },
  "07-errors-and-async": {
    say: [
      "Le eccezioni le gestisco al bordo: loggo con un id di correlazione e all'utente mostro un messaggio pulito.",
      "In PHP 8 Error ed Exception sono fratelli, quindi al confine catturo Throwable, non solo Exception.",
    ],
    keep: ["exception", "throw", "catch", "Throwable", "log", "stack trace", "queue"],
  },
  "09-databases-and-mysql": {
    say: [
      "Uso sempre utf8mb4, perché utf8 in MySQL non è UTF-8 completo e rompe le emoji.",
      "InnoDB per tutto: serve il supporto alle transazioni e alle foreign key.",
    ],
    keep: ["InnoDB", "charset", "utf8mb4", "foreign key", "engine"],
  },
  "10-sql-querying": {
    say: [
      "Se filtro la tabella di destra nella WHERE, la LEFT JOIN diventa di fatto una INNER JOIN.",
      "Per prendere i primi N per gruppo uso una window function invece di una subquery correlata.",
    ],
    keep: ["query", "join", "LEFT JOIN", "GROUP BY", "window function", "CTE"],
  },
  "11-indexes-and-transactions": {
    say: [
      "Prima di ottimizzare guardo il piano con EXPLAIN: senza quello sto solo indovinando.",
      "L'ordine delle colonne in un indice composto conta: si usa da sinistra verso destra.",
    ],
    keep: ["index", "EXPLAIN", "query plan", "full scan", "deadlock", "isolation level"],
  },
  "12-orm-in-depth": {
    say: [
      "Il problema N+1 è la causa più comune di lentezza che ho visto con Eloquent: si risolve con l'eager loading.",
      "Doctrine è un data mapper, Eloquent è un active record: cambia dove metti la logica di dominio.",
    ],
    keep: ["ORM", "Eloquent", "Doctrine", "eager loading", "N+1", "migration", "seeder"],
  },
  "13-http-and-psr": {
    say: [
      "PUT è idempotente, POST no: ripetere la stessa PUT deve lasciare il sistema nello stesso stato.",
      "Restituisco 422 per una validazione fallita e 400 solo se la richiesta è proprio malformata.",
    ],
    keep: ["endpoint", "status code", "middleware", "header", "payload", "REST"],
  },
  "14-building-an-api": {
    say: [
      "Valido al bordo e trasformo la richiesta in un oggetto tipizzato: da lì in poi i dati sono affidabili.",
      "In risposta restituisco una resource, non il model: il model è una struttura interna, la risposta è un contratto.",
    ],
    keep: ["API", "endpoint", "payload", "JSON", "resource", "status code", "rate limiting"],
  },
  "15-api-security": {
    say: [
      "Le prepared statement non sono un'ottimizzazione: sono la difesa contro la SQL injection.",
      "Per le password uso password_hash con Argon2id, mai un hash veloce come MD5 o SHA-1.",
    ],
    keep: ["SQL injection", "XSS", "CSRF", "token", "hash", "escaping", "OWASP"],
  },
  "16-the-framework": {
    say: [
      "Il service container risolve le dipendenze dal type hint del costruttore.",
      "I middleware sono una pipeline: l'ordine in cui li registri è comportamento, non stile.",
    ],
    keep: ["container", "middleware", "service provider", "facade", "routing", "kernel"],
  },
  "16b-legacy-php": {
    say: [
      "Su un progetto legacy la prima settimana non tocco niente: lo faccio girare in locale, lo metto sotto Git e scrivo qualche test di caratterizzazione.",
      "Il rifacimento da zero non lo propongo quasi mai: sostituisco un pezzo alla volta lasciando in piedi il resto.",
    ],
    keep: ["legacy", "refactoring", "test", "Git", "baseline", "deploy"],
  },
  "19-server-rendered-ui": {
    say: [
      "In Blade uso le doppie graffe, che fanno l'escape da sole; la sintassi con i punti esclamativi la controllo una per una.",
      "Con Livewire resto in PHP, ma ogni interazione è una chiamata al server: va benissimo per un gestionale, meno per un'interfaccia molto reattiva.",
    ],
    keep: ["Blade", "Twig", "template", "escape", "Livewire", "Inertia", "component"],
  },
  "20-caching": {
    say: [
      "Uso il pattern cache-aside: leggo dalla cache, se manca leggo dal database e riscrivo.",
      "La parte difficile non è mettere in cache, è invalidare.",
    ],
    keep: ["cache", "Redis", "TTL", "cache-aside", "invalidation", "hit", "miss"],
  },
  "22-queues-and-messaging": {
    say: [
      "Tutto quello che è lento o può fallire lo metto in coda: email, PDF, chiamate a servizi esterni.",
      "Un job deve essere idempotente, perché prima o poi verrà eseguito due volte.",
    ],
    keep: ["queue", "job", "worker", "retry", "failed job", "idempotente", "Horizon"],
  },
  "23-architecture": {
    say: [
      "Tengo le dipendenze verso l'interno: il dominio non deve conoscere il framework.",
      "Non metto architettura dove non serve: su un CRUD di tre mesi bastano dei value object e un service layer chiaro.",
    ],
    keep: ["domain", "layer", "value object", "service", "repository", "CQRS", "DDD"],
  },
  "24-testing": {
    say: [
      "Scrivo test di integrazione sul database reale: un mock del database non prova quasi niente.",
      "La copertura dice quali righe sono state eseguite, non se il comportamento è corretto.",
    ],
    keep: ["test", "PHPUnit", "Pest", "mock", "stub", "coverage", "fixture"],
  },
  "25b-production-support": {
    say: [
      "Quando arriva una segnalazione la prendo in carico subito e do un riscontro, anche solo per dire che la sto guardando.",
      "Prima chiedo cosa è cambiato, poi riproduco il problema, poi scrivo il test che fallisce: in quest'ordine.",
    ],
    keep: ["log", "rollback", "hotfix", "deploy", "post-mortem", "alert"],
  },
  "26-git": {
    say: [
      "Faccio il rebase sul mio branch prima della pull request, così la storia resta leggibile.",
      "Sul branch condiviso non riscrivo mai la storia.",
    ],
    keep: ["branch", "merge", "rebase", "commit", "pull request", "conflict", "push"],
  },
  "27-tooling-and-xdebug": {
    say: [
      "Per il debug uso Xdebug con i breakpoint, non i var_dump: sui bug veri fa risparmiare ore.",
      "Tengo PHPStan con una baseline: il debito vecchio resta congelato e il codice nuovo deve passare.",
    ],
    keep: ["debug", "breakpoint", "Xdebug", "PHPStan", "baseline", "profiler", "IDE"],
  },
  "28-containers-and-composer": {
    say: [
      "Il composer.lock va committato: è quello che garantisce la stessa versione in produzione.",
      "Uso un build multi-stage per non portarmi le dipendenze di sviluppo nell'immagine finale.",
    ],
    keep: ["Docker", "container", "image", "build", "Compose", "Composer", "lock file", "autoload"],
  },
  "29-cloud-hosting": {
    say: [
      "In produzione il document root punta su public/ e APP_DEBUG è a false: sono le due cose che controllo per prime.",
      "Faccio deploy atomici con un symlink, così il rollback è ripuntare il link alla release precedente.",
    ],
    keep: ["deploy", "release", "rollback", "symlink", "document root", "backup", "environment"],
  },
  "30-ci-cd": {
    say: [
      "La pipeline gira in ordine di costo: prima lint e analisi statica, poi i test, e il deploy solo se passa tutto.",
      "Un test che fallisce a intermittenza lo sistemo lo stesso giorno, altrimenti nessuno guarda più la pipeline.",
    ],
    keep: ["pipeline", "CI", "build", "deploy", "test", "merge request", "artifact"],
  },
  "31-wordpress": {
    say: [
      "Non modifico mai il core né il tema padre: uso un child theme e gli hook.",
      "Le custom post type e ACF coprono la maggior parte delle richieste dei clienti.",
    ],
    keep: ["hook", "filter", "action", "plugin", "child theme", "custom post type"],
  },
  "32-ecommerce": {
    say: [
      "Il prezzo lo tengo in centesimi come intero: con i float l'IVA non torna mai.",
      "Lo scarico del magazzino deve avvenire nella stessa transazione dell'ordine.",
    ],
    keep: ["checkout", "cart", "gateway", "stock", "catalogo", "IVA", "ordine"],
  },
  "33-gestionali-and-sdi": {
    say: [
      "La fattura elettronica è un XML in formato FatturaPA che passa dal Sistema di Interscambio.",
      "Il codice destinatario di sette caratteri identifica il canale di recapito del cliente.",
    ],
    keep: ["XML", "FatturaPA", "SDI", "codice destinatario", "partita IVA", "gestionale"],
  },
  "34-agile": {
    say: [
      "Nel daily dico su cosa ho lavorato, su cosa lavoro e se sono bloccato: tre frasi.",
      "Se una stima si rivela sbagliata lo dico subito, non alla fine dello sprint.",
    ],
    keep: ["sprint", "daily", "standup", "backlog", "refinement", "retrospettiva", "story point"],
  },
  "35-teamwork": {
    say: [
      "Preferisco fare una domanda in più all'inizio che rifare il lavoro alla fine.",
      "In code review commento il codice, non la persona.",
    ],
    keep: ["code review", "feedback", "requisiti", "stakeholder", "task"],
  },
  "38-the-interview": {
    say: [
      "Le mie competenze principali sono PHP, Laravel e MySQL; sto approfondendo le architetture a eventi.",
      "Cerco un ruolo dove ci sia code review e qualcuno da cui imparare.",
    ],
    keep: ["stack", "RAL", "CCNL", "apprendistato", "remote", "onboarding"],
  },
};
