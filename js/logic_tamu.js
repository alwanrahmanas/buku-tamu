"use strict";
const STORE_KEY = "bukutamu_db_v1";
const DB_FILENAME = "buku-tamu.db";
let SQL, db;

const fill = document.getElementById("bootFill");
const sub = document.getElementById("bootSub");
let _p = 0,
  _pt = setInterval(() => {
    _p = Math.min(_p + Math.random() * 22, 82);
    fill.style.width = _p + "%";
  }, 180);

async function initDB() {
  sub.textContent = "Memuat sql-wasm.wasm…";
  SQL = await initSqlJs({ locateFile: () => "libs/sql-wasm.wasm" });
  sub.textContent = "Membuka database…";
  await DBManager.init();
  // Coba muat dari file db/ dulu, lalu fallback ke localStorage
  const fromFolder = await tryLoadFromFolder();
  if (!fromFolder) {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      try {
        db = new SQL.Database(
          Uint8Array.from(atob(saved), (c) => c.charCodeAt(0)),
        );
      } catch {
        db = new SQL.Database();
      }
    } else db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS tamu(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL, instansi TEXT DEFAULT '',
      jabatan TEXT DEFAULT '', no_wa TEXT NOT NULL,
      keperluan TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
    CREATE INDEX IF NOT EXISTS idx_nama ON tamu(nama COLLATE NOCASE);
  `);
  clearInterval(_pt);
  fill.style.width = "100%";
  setTimeout(() => document.getElementById("boot").classList.add("gone"), 450);
}

async function tryLoadFromFolder() {
  const st = DBManager.status();
  if (!st.supported || !st.folderSet) return false;
  const r = await DBManager.load(DB_FILENAME);
  if (r.success && r.data) {
    try {
      db = new SQL.Database(r.data);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

function persist() {
  if (!db) return;
  try {
    const d = db.export();
    localStorage.setItem(STORE_KEY, btoa(String.fromCharCode(...d)));
  } catch (e) {
    console.warn(e);
  }
  // Auto-save ke folder jika sudah dipilih
  const st = DBManager.status();
  if (st.supported && st.folderSet) {
    DBManager.save(() => db.export(), DB_FILENAME).catch(console.warn);
  }
}

function dbRun(sql, p = []) {
  db.run(sql, p);
  persist();
}
function dbAll(sql, p = []) {
  const r = db.exec(sql, p);
  if (!r.length) return [];
  const { columns, values } = r[0];
  return values.map((row) =>
    Object.fromEntries(columns.map((c, i) => [c, row[i]])),
  );
}

// Autocomplete
let _items = [],
  _idx = -1,
  _sugg = null,
  _timer;
function onNama(v) {
  dismissSugg();
  clearTimeout(_timer);
  if (!v.trim()) {
    closeDD();
    return;
  }
  _timer = setTimeout(() => {
    const rows = dbAll(
      `SELECT t.* FROM tamu t INNER JOIN (SELECT nama,MAX(id) mid FROM tamu WHERE nama LIKE ? COLLATE NOCASE GROUP BY LOWER(nama)) l ON t.id=l.mid ORDER BY t.timestamp DESC LIMIT 6`,
      [v.trim() + "%"],
    );
    _items = rows.map((r) => ({
      ...r,
      keperluan: r.keperluan ? r.keperluan.split("|") : [],
    }));
    _idx = -1;
    const dd = document.getElementById("dd");
    if (!rows.length) {
      closeDD();
      return;
    }
    dd.innerHTML = _items
      .map(
        (m, i) =>
          `<div class="ddi" onmousedown="pick(${i})"><div class="dn">${esc(m.nama)}</div><div class="ds">${[m.instansi, m.jabatan].filter(Boolean).join(" · ") || "&nbsp;"}</div></div>`,
      )
      .join("");
    dd.classList.add("open");
  }, 140);
}
function pick(i) {
  const m = _items[i];
  if (!m) return;
  document.getElementById("fNama").value = m.nama;
  closeDD();
  _sugg = m;
  document.getElementById("suggName").textContent =
    `Selamat datang kembali, ${m.nama}!`;
  document.getElementById("suggDetail").textContent =
    `${m.instansi || "—"} · ${m.jabatan || "—"} · Data lama ditemukan. Gunakan?`;
  document.getElementById("suggBanner").classList.add("show");
}
function schedHide() {
  setTimeout(closeDD, 180);
}
function closeDD() {
  document.getElementById("dd").classList.remove("open");
}
function onKey(e) {
  const dd = document.getElementById("dd");
  if (!dd.classList.contains("open")) return;
  const its = dd.querySelectorAll(".ddi");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    _idx = Math.min(_idx + 1, its.length - 1);
    hiDD(its);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    _idx = Math.max(_idx - 1, -1);
    hiDD(its);
  } else if (e.key === "Enter" && _idx >= 0) {
    e.preventDefault();
    pick(_idx);
  } else if (e.key === "Escape") closeDD();
}
function hiDD(its) {
  its.forEach((el, i) => el.classList.toggle("hi", i === _idx));
}

// Suggestion
function applySugg() {
  if (!_sugg) return;
  sf("fInst", _sugg.instansi, 1);
  sf("fJab", _sugg.jabatan, 1);
  sf("fWa", _sugg.no_wa, 1);
  document.querySelectorAll(".kep").forEach((el) => {
    el.classList.remove("on");
    el.querySelector("input").checked = false;
  });
  dismissSugg();
}
function dismissSugg() {
  document.getElementById("suggBanner").classList.remove("show");
  _sugg = null;
}
function sf(id, v, mark) {
  const el = document.getElementById(id);
  el.value = v || "";
  el.classList.toggle("filled", !!mark && !!v);
}

// Checkbox
function toggleKep(lbl) {
  setTimeout(
    () => lbl.classList.toggle("on", lbl.querySelector("input").checked),
    0,
  );
}
function getKep() {
  return [...document.querySelectorAll("input[name=kep]:checked")].map(
    (c) => c.value,
  );
}

// Submit
function submitForm() {
  const nama = document.getElementById("fNama").value.trim();
  const noWa = document.getElementById("fWa").value.trim();
  const kep = getKep();
  if (!nama) {
    shake("fNama");
    return;
  }
  if (!noWa) {
    shake("fWa");
    return;
  }
  if (!kep.length) {
    shakeEl(document.querySelector(".kep-list"));
    return;
  }
  const btn = document.getElementById("btnDaftar");
  btn.disabled = true;
  document.getElementById("btnLabel").textContent = "Menyimpan…";
  document.getElementById("btnArr").className = "spin";
  setTimeout(() => {
    try {
      dbRun(
        `INSERT INTO tamu(nama,instansi,jabatan,no_wa,keperluan) VALUES(?,?,?,?,?)`,
        [
          nama,
          document.getElementById("fInst").value.trim(),
          document.getElementById("fJab").value.trim(),
          noWa,
          kep.join("|"),
        ],
      );
      document.getElementById("sucName").textContent = nama;
      document.getElementById("suc").classList.add("show");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      btn.disabled = false;
      document.getElementById("btnLabel").textContent = "Daftar Kunjungan";
      document.getElementById("btnArr").className = "arr";
      document.getElementById("btnArr").textContent = "→";
    }
  }, 500);
}
function resetForm() {
  document.getElementById("suc").classList.remove("show");
  ["fNama", "fInst", "fJab", "fWa"].forEach((id) => {
    const el = document.getElementById(id);
    el.value = "";
    el.classList.remove("filled", "err");
  });
  document.querySelectorAll(".kep").forEach((el) => {
    el.classList.remove("on");
    el.querySelector("input").checked = false;
  });
  dismissSugg();
  closeDD();
  document.getElementById("fNama").focus();
}
function shake(id) {
  shakeEl(document.getElementById(id));
  document.getElementById(id).classList.add("err");
}
function shakeEl(el) {
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "shake .4s ease";
  el.addEventListener("animationend", () => (el.style.animation = ""), {
    once: true,
  });
}
function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

initDB().catch((e) => {
  clearInterval(_pt);
  sub.textContent = "❌ Gagal: " + e.message;
  console.error(e);
});
