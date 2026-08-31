// All CodeMirror packages below are pinned to the same exact versions of their
// shared dependencies (@codemirror/state, @codemirror/view, etc.) via the `deps`
// query param. This avoids the classic ESM-CDN bug where two packages each pull
// in a slightly different copy of @codemirror/state, causing CodeMirror to think
// extensions from one copy are "foreign" to the other and throwing at runtime.
import { EditorView, keymap } from "https://esm.sh/@codemirror/view@6.43.9?deps=@codemirror/state@6.7.1";
import { basicSetup } from "https://esm.sh/codemirror@6.0.2?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.9,@codemirror/language@6.12.4,@codemirror/commands@6.11.0,@codemirror/autocomplete@6.20.3,@codemirror/search@6.7.1,@codemirror/lint@6.9.7";
import { html as htmlLang } from "https://esm.sh/@codemirror/lang-html@6.4.12?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.9,@codemirror/language@6.12.4,@codemirror/autocomplete@6.20.3";
import { css as cssLang } from "https://esm.sh/@codemirror/lang-css@6.3.1?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.9,@codemirror/language@6.12.4,@codemirror/autocomplete@6.20.3";
import { javascript as jsLang } from "https://esm.sh/@codemirror/lang-javascript@6.2.5?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.9,@codemirror/language@6.12.4,@codemirror/autocomplete@6.20.3";
import { oneDark } from "https://esm.sh/@codemirror/theme-one-dark@6.1.3?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.9,@codemirror/language@6.12.4";
import { indentWithTab } from "https://esm.sh/@codemirror/commands@6.11.0?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.9";

/* ============================================================
   Starter template
   ============================================================ */
const STARTER = {
  html: `<!-- STARTER TEMPLATE START -->
<h1>Hello, world</h1>
<p>Edit the HTML, CSS or JavaScript on the left — the preview updates as you type.</p>
<button id="pingBtn">Click me</button>
<!-- STARTER TEMPLATE END -->`,
  css: `/*STARTER TEMPLATE START*/
body {
  font-family: system-ui, sans-serif;
  padding: 2.5rem;
  color: #1b1e29;
}

h1 {
  color: #2f7a5a;
}

button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: #7ce7b8;
  cursor: pointer;
  font-weight: 600;
}
/*STARTER TEMPLATE END*/`,
  js: `//STARTER TEMPLATE START
document.getElementById('pingBtn').addEventListener('click', () => {
  console.log('Button clicked!');
});
//STARTER TEMPLATE END`
};

const DRAFT_KEY = "roshancode-draft";
const PROJECTS_KEY = "roshancode-projects";

/* ============================================================
   Load initial code: shared link > draft > starter
   ============================================================ */
function loadFromHash() {
  if (!location.hash.startsWith("#code=")) return null;
  try {
    const payload = decodeURIComponent(escape(atob(location.hash.slice(6))));
    const data = JSON.parse(payload);
    if (typeof data.html === "string") return data;
  } catch (e) { /* ignore malformed hash */ }
  return null;
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

const initial = loadFromHash() || loadDraft() || STARTER;
let currentProjectId = null;

/* ============================================================
   CodeMirror setup
   ============================================================ */
function makeEditor(parent, doc, lang) {
  return new EditorView({
    doc,
    parent,
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      lang,
      oneDark,
      EditorView.updateListener.of(update => {
        if (update.docChanged) onCodeChanged();
      }),
      EditorView.theme({ "&": { height: "100%" }, ".cm-scroller": { fontFamily: "inherit" } })
    ]
  });
}

const editors = {
  html: makeEditor(document.getElementById("pane-html"), initial.html ?? STARTER.html, htmlLang()),
  css: makeEditor(document.getElementById("pane-css"), initial.css ?? STARTER.css, cssLang()),
  js: makeEditor(document.getElementById("pane-js"), initial.js ?? STARTER.js, jsLang())
};

function getCode() {
  return {
    html: editors.html.state.doc.toString(),
    css: editors.css.state.doc.toString(),
    js: editors.js.state.doc.toString()
  };
}

function setCode(data) {
  for (const lang of ["html", "css", "js"]) {
    const view = editors[lang];
    const value = data[lang] ?? "";
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
  }
}

/* ============================================================
   Tabs
   ============================================================ */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("is-active"));
    document.querySelectorAll(".editor-pane").forEach(p => p.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.getElementById(`pane-${tab.dataset.lang}`).classList.add("is-active");
    editors[tab.dataset.lang].focus();
  });
});

/* ============================================================
   Preview rendering + console capture
   ============================================================ */
const frame = document.getElementById("previewFrame");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const consolePanel = document.getElementById("consolePanel");
const consoleLog = document.getElementById("consoleLog");
const autoRunCheckbox = document.getElementById("autoRun");

const CONSOLE_BRIDGE = [
  "(function(){",
  "  var send = function(kind, args){",
  "    try{",
  "      var parts = args.map(function(a){",
  "        if (a instanceof Error) return a.message;",
  "        if (typeof a === 'object') { try { return JSON.stringify(a); } catch(e){ return String(a); } }",
  "        return String(a);",
  "      });",
  "      parent.postMessage({ __signal: true, kind: kind, text: parts.join(' ') }, '*');",
  "    } catch(e) {}",
  "  };",
  "  ['log','warn','error','info'].forEach(function(kind){",
  "    var original = console[kind];",
  "    console[kind] = function(){ send(kind, Array.prototype.slice.call(arguments)); original.apply(console, arguments); };",
  "  });",
  "  window.addEventListener('error', function(e){ send('error', [e.message + ' (line ' + e.lineno + ')']); });",
  "})();"
].join("\n");

function buildDocument({ html, css, js }) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${css}
</style>
</head>
<body>
${html}

<script>
${CONSOLE_BRIDGE}
<\/script>

<script>
${js}
<\/script>
</body>
</html>`;
}

function addConsoleEntry(kind, text) {
  consolePanel.classList.add("has-logs");
  const entry = document.createElement("div");
  entry.className = "console-entry" + (kind === "error" ? " is-error" : kind === "warn" ? " is-warn" : "");
  entry.innerHTML = `<span class="tag">${kind}</span>${escapeHtml(text)}`;
  consoleLog.appendChild(entry);
  consoleLog.scrollTop = consoleLog.scrollHeight;
  if (kind === "error") setStatus("error");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// state: "live" | "error" | "paused" | "ready"
function setStatus(state) {
  statusDot.classList.remove("is-live", "is-error", "is-paused");
  if (state === "live") { statusDot.classList.add("is-live"); statusText.textContent = "live"; }
  else if (state === "error") { statusDot.classList.add("is-error"); statusText.textContent = "runtime error"; }
  else if (state === "paused") { statusDot.classList.add("is-paused"); statusText.textContent = "auto-run off"; }
  else { statusText.textContent = "ready"; }
}

window.addEventListener("message", e => {
  const data = e.data;
  if (data && data.__signal) addConsoleEntry(data.kind, data.text);
});

const runBtn = document.getElementById("runBtn");

function runCode() {
  const code = getCode();
  frame.srcdoc = buildDocument(code);
  // "live" means the preview is continuously syncing with your typing.
  // If auto-run is off, a manual Run still refreshes the preview, but the
  // status should keep saying auto-run is off rather than claiming "live".
  setStatus(autoRunCheckbox.checked ? "live" : "paused");
  runBtn.classList.remove("is-running");
  void runBtn.offsetWidth; // restart animation
  runBtn.classList.add("is-running");
  saveDraft(code);
}

let debounceTimer = null;
function onCodeChanged() {
  clearTimeout(debounceTimer);
  if (!autoRunCheckbox.checked) {
    // Auto-run is off: don't touch the preview, but keep the draft fresh.
    debounceTimer = setTimeout(() => saveDraft(getCode()), 500);
    return;
  }
  debounceTimer = setTimeout(runCode, 350);
}

function saveDraft(code) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(code)); } catch (e) { /* storage full/unavailable */ }
}

runBtn.addEventListener("click", runCode);
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Reset HTML, CSS and JavaScript back to the starter template? This can't be undone.")) {
    setCode(STARTER);
    currentProjectId = null;
    updateSaveButtonTitle();
    runCode();
  }
});
document.getElementById("clearConsoleBtn").addEventListener("click", () => {
  consoleLog.innerHTML = "";
  consolePanel.classList.remove("has-logs");
  setStatus(autoRunCheckbox.checked ? "live" : "paused");
});
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); runCode(); }
});

// Reflect auto-run state in the status light beside "Preview" immediately,
// and resume a live preview the moment it's switched back on.
autoRunCheckbox.addEventListener("change", () => {
  if (autoRunCheckbox.checked) {
    runCode(); // resume: refresh preview and flip the light back to "live"
  } else {
    setStatus("paused"); // no run happens, just flips the light off
  }
});

/* ============================================================
   Device switch
   ============================================================ */
const previewShell = document.getElementById("previewShell");
document.querySelectorAll(".device-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".device-btn").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    previewShell.style.width = btn.dataset.width;
  });
});

document.getElementById("fullscreenBtn").addEventListener("click", () => {
  if (previewShell.requestFullscreen) previewShell.requestFullscreen();
});

/* ============================================================
   Resizable divider (pointer-events based, buttery smooth)
   ============================================================ */
const divider = document.getElementById("divider");
const editorsPane = document.getElementById("editorsPane");
const workspace = document.getElementById("workspace");
const MIN_PCT = 22;
const MAX_PCT = 78;
let dragPointerId = null;

function clampPct(pct) {
  return Math.min(MAX_PCT, Math.max(MIN_PCT, pct));
}

function setSplitFromClientX(clientX) {
  const rect = workspace.getBoundingClientRect();
  const pct = clampPct(((clientX - rect.left) / rect.width) * 100);
  editorsPane.style.width = pct + "%";
}

divider.addEventListener("pointerdown", e => {
  dragPointerId = e.pointerId;
  divider.setPointerCapture(e.pointerId);
  divider.classList.add("is-dragging");
  document.body.classList.add("is-resizing");
  e.preventDefault();
});

divider.addEventListener("pointermove", e => {
  if (dragPointerId === null || e.pointerId !== dragPointerId) return;
  setSplitFromClientX(e.clientX);
});

function endDrag(e) {
  if (dragPointerId === null) return;
  if (divider.hasPointerCapture(dragPointerId)) {
    divider.releasePointerCapture(dragPointerId);
  }
  dragPointerId = null;
  divider.classList.remove("is-dragging");
  document.body.classList.remove("is-resizing");
}

divider.addEventListener("pointerup", endDrag);
divider.addEventListener("pointercancel", endDrag);
divider.addEventListener("lostpointercapture", endDrag);

// Keyboard resizing for accessibility (Left/Right arrows), since the
// divider is a focusable separator.
divider.addEventListener("keydown", e => {
  const rect = workspace.getBoundingClientRect();
  const currentPct = clampPct((editorsPane.getBoundingClientRect().width / rect.width) * 100);
  const step = e.shiftKey ? 8 : 2;
  if (e.key === "ArrowLeft") {
    editorsPane.style.width = clampPct(currentPct - step) + "%";
    e.preventDefault();
  } else if (e.key === "ArrowRight") {
    editorsPane.style.width = clampPct(currentPct + step) + "%";
    e.preventDefault();
  } else if (e.key === "Home") {
    editorsPane.style.width = MIN_PCT + "%";
    e.preventDefault();
  } else if (e.key === "End") {
    editorsPane.style.width = MAX_PCT + "%";
    e.preventDefault();
  }
});

/* ============================================================
   Toast helper
   ============================================================ */
const toast = document.getElementById("toast");
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("is-shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-shown"), 2200);
}

/* ============================================================
   Filename helpers for download
   ============================================================ */
function sanitizeFilename(name) {
  const cleaned = name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
  return cleaned || "New-Project";
}

function formatTimestamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

/* ============================================================
   Download as standalone file
   ============================================================ */
document.getElementById("downloadBtn").addEventListener("click", () => {
  const code = getCode();
  const blob = new Blob([buildDocument(code).replace(CONSOLE_BRIDGE, "")], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const projects = getProjects();
  const baseName = (currentProjectId && projects[currentProjectId]) ? projects[currentProjectId].name : "New-Project";
  a.download = `RoshanCode_${sanitizeFilename(baseName)}_${formatTimestamp()}.html`;

  a.click();
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${a.download}`);
});

/* ============================================================
   Share link
   ============================================================ */
document.getElementById("shareBtn").addEventListener("click", async () => {
  const code = getCode();
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(code))));
  const url = `${location.origin}${location.pathname}#code=${encoded}`;
  try {
    await navigator.clipboard.writeText(url);
    showToast("Share link copied to clipboard");
  } catch (e) {
    prompt("Copy this link:", url);
  }
});

/* ============================================================
   Projects: save / list / load / delete
   ============================================================ */
function getProjects() {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || {}; } catch (e) { return {}; }
}
function setProjects(obj) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(obj));
}

const saveBtn = document.getElementById("saveBtn");
const saveModalOverlay = document.getElementById("saveModalOverlay");
const saveModalTitle = document.getElementById("saveModalTitle");
const saveNameInput = document.getElementById("saveNameInput");
const saveConfirmBtn = document.getElementById("saveConfirmBtn");

// Tracks whether the currently-open "Save as" modal should force creating
// a brand-new project even though a project is already open (Shift+Click).
let forceSaveAsNew = false;

function updateSaveButtonTitle() {
  saveBtn.title = currentProjectId
    ? "Save (updates current project) — Shift+Click to save as new"
    : "Save project";
}
updateSaveButtonTitle();

function saveToProject(id, name, projects) {
  projects[id] = { name, ...getCode(), updatedAt: Date.now() };
  setProjects(projects);
  currentProjectId = id;
  updateSaveButtonTitle();
  renderProjectList();
}

saveBtn.addEventListener("click", e => {
  const projects = getProjects();
  const hasOpenProject = currentProjectId && projects[currentProjectId];

  // Normal click on an already-open project: quick-save in place, no dialog.
  if (hasOpenProject && !e.shiftKey) {
    const name = projects[currentProjectId].name;
    saveToProject(currentProjectId, name, projects);
    showToast(`Saved to "${name}"`);
    return;
  }

  // No project open yet -> always "save as new".
  // Project open + Shift+Click -> explicit "save as a new project".
  forceSaveAsNew = !!hasOpenProject && e.shiftKey;
  saveModalTitle.textContent = forceSaveAsNew ? "Save as new project" : "Save project";
  saveNameInput.value = forceSaveAsNew ? "" : (hasOpenProject ? projects[currentProjectId].name : "");
  saveModalOverlay.classList.add("is-open");
  setTimeout(() => saveNameInput.focus(), 50);
});

document.getElementById("saveCancelBtn").addEventListener("click", () => {
  saveModalOverlay.classList.remove("is-open");
});
saveModalOverlay.addEventListener("click", e => {
  if (e.target === saveModalOverlay) saveModalOverlay.classList.remove("is-open");
});

saveConfirmBtn.addEventListener("click", () => {
  const name = saveNameInput.value.trim() || "Untitled project";
  const projects = getProjects();
  const id = (currentProjectId && !forceSaveAsNew) ? currentProjectId : `p_${Date.now()}`;
  saveToProject(id, name, projects);
  forceSaveAsNew = false;
  saveModalOverlay.classList.remove("is-open");
  showToast(`Saved "${name}"`);
});
saveNameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") saveConfirmBtn.click();
});

const drawer = document.getElementById("projectsDrawer");
const overlay = document.getElementById("overlay");
function openDrawer() { drawer.classList.add("is-open"); overlay.classList.add("is-open"); renderProjectList(); }
function closeDrawer() { drawer.classList.remove("is-open"); overlay.classList.remove("is-open"); }
document.getElementById("projectsBtn").addEventListener("click", openDrawer);
document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

document.getElementById("newProjectBtn").addEventListener("click", () => {
  setCode({ html: "", css: "", js: "" });
  currentProjectId = null;
  updateSaveButtonTitle();
  runCode();
  closeDrawer();
  showToast("Started a new project");
});

function renderProjectList() {
  const projects = getProjects();
  const list = document.getElementById("projectList");
  const ids = Object.keys(projects).sort((a, b) => projects[b].updatedAt - projects[a].updatedAt);
  if (ids.length === 0) {
    list.innerHTML = `<div class="empty-state">No saved projects yet.<br>Use the save icon in the top bar to keep a copy here — everything is stored in your browser.</div>`;
    return;
  }
  list.innerHTML = "";
  ids.forEach(id => {
    const p = projects[id];
    const item = document.createElement("div");
    item.className = "project-item" + (id === currentProjectId ? " is-current" : "");
    const date = new Date(p.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    item.innerHTML = `<div class="pname">${escapeHtml(p.name)}</div><div class="pdate">${date}</div><button class="pdel" title="Delete">✕</button>`;
    item.addEventListener("click", e => {
      if (e.target.closest(".pdel")) return;
      setCode(p);
      currentProjectId = id;
      updateSaveButtonTitle();
      runCode();
      closeDrawer();
      showToast(`Loaded "${p.name}"`);
    });
    item.querySelector(".pdel").addEventListener("click", () => {
      if (confirm(`Delete "${p.name}"? This can't be undone.`)) {
        const proj = getProjects();
        delete proj[id];
        setProjects(proj);
        if (currentProjectId === id) {
          currentProjectId = null;
          updateSaveButtonTitle();
        }
        renderProjectList();
      }
    });
    list.appendChild(item);
  });
}

/* ============================================================
   Boot
   ============================================================ */
runCode();