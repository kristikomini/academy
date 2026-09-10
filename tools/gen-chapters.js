/* Generates a skeleton chapter file for every manifest entry that does not have
   one yet. Existing files are NEVER overwritten — once a chapter is written by
   hand this script must leave it alone. Run it after adding manifest entries. */
const fs = require("fs"), path = require("path");
const SUBJECT = process.argv[2] || "php";
global.self = {};
require("../subjects/" + SUBJECT + "/site/assets/subject.js");
require("../subjects/" + SUBJECT + "/site/assets/chapters.js");
const { CHAPTERS, PARTS, SUBJECT: SUBJ } = global.self;
/* Brand comes from subject.js rather than being hardcoded, so a new subject does
   not inherit another subject's name in every chapter <title>. */
const BRAND = (SUBJ && SUBJ.name) || "Academy";
const dir = path.join(__dirname, "..", "subjects", SUBJECT, "site", "chapters");
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

let made = 0, kept = 0;
for (const c of CHAPTERS) {
  const file = path.join(dir, c.id + ".html");
  if (fs.existsSync(file)) { kept++; continue; }
  const advert = c.req
    ? `<p>This chapter answers <em>"${esc(c.req)}"</em> &mdash; a line that appeared in the adverts this course was built from.</p>`
    : `<p><strong>Not in any advert.</strong> ${esc(c.extra)}</p>`;
  fs.writeFileSync(file, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${c.n} &middot; ${esc(c.title)} &mdash; ${BRAND}</title>
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="manifest" href="../manifest.webmanifest">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#161925" media="(prefers-color-scheme: dark)">
<link rel="stylesheet" href="../assets/style.css">
<link rel="stylesheet" href="../assets/learn.css">
</head>
<body data-chapter="${c.id}">
<div class="layout">
  <aside class="sidebar" id="sidebar"></aside>
  <main class="main">

<p class="crumbs">${esc(c.part)} <span>&rsaquo;</span> Chapter ${c.n}</p>
<h1>${esc(c.title)}</h1>
<p class="lede">${esc(c.blurb)}</p>

<div class="box note">
  <div class="box-title">From the advert</div>
  ${advert}
</div>

<nav id="toc"></nav>

<h2 id="not-yet-written">This chapter is not written yet</h2>

<div class="box trap">
  <div class="box-title">&#9888; Honest status</div>
  <p>The manifest entry, the navigation, the search index and the offline cache all work &mdash;
  this page is a real chapter in every respect except the one that matters. It is a placeholder,
  and it is labelled as one rather than being padded out with filler that would read as content.</p>
  <p>Planned coverage: <em>${esc(c.tags.split(" ").slice(0, 10).join(", "))}</em>.</p>
</div>

<div id="pager"></div>
  </main>
</div>
<script src="../assets/subject.js"></script>
<script src="../assets/chapters.js"></script>
<script src="../assets/quizzes-1.js"></script>
<script src="../assets/quizzes-2.js"></script>
<script src="../assets/quizzes-3.js"></script>
<script src="../assets/store.js"></script>
<script src="../assets/site.js"></script>
<script src="../assets/quiz.js"></script>
<script src="../assets/learn.js"></script>
<script src="../assets/notes.js"></script>
<script src="../assets/account.js"></script>
<script src="../assets/italiano.js"></script>
<script src="../assets/italiano-panel.js"></script>
</body>
</html>
`);
  made++;
}
console.log("generated " + made + ", left alone " + kept);
