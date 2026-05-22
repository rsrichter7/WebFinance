// ─── Webfinance — App Logic ───

// ─── Constants ───
const CATEGORIES = [
    "Boodschappen", "Verbouwing", "Huur / Hypotheek", "Vakantie", "Gas / Water / Licht",
    "Verzekeringen", "Abonnementen", "Internet & TV", "Horeca & Afhaal", "Shoppen",
    "Verzorging & Huishouden", "Auto-onderhoud & Parkeren", "Brandstof / Laden",
    "Gemeentelijke belastingen", "Salaris / Inkomsten", "Onvoorzien / Buffer", "Cadeaus"
];

const MONTHS_NL = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
const MONTHS_SHORT = ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];

const COLORS = [
    "#2563eb","#dc2626","#16a34a","#ea580c","#8b5cf6","#0d9488",
    "#d97706","#be185d","#4f46e5","#059669","#e11d48","#7c3aed",
    "#0284c7","#b91c1c","#15803d","#c2410c","#6d28d9"
];

// ─── State ───
let transactions = [
    { id:1, datum:"2026-01-15", bedrag:52.57, omschrijving:"Boodschappen", type:"Uitgave", categorie:"Boodschappen", waar:"Albert Heijn", vast:"Vast" },
    { id:2, datum:"2026-01-17", bedrag:63.50, omschrijving:"Nagellak SP Pink Gellac", type:"Uitgave", categorie:"Verzorging & Huishouden", waar:"SP Pink Gellac", vast:"Variabel" },
    { id:3, datum:"2026-01-20", bedrag:1650, omschrijving:"Aankoop meubels", type:"Uitgave", categorie:"Verbouwing", waar:"Meubels JTW Duiven", vast:"Variabel" },
    { id:4, datum:"2026-01-20", bedrag:1000, omschrijving:"Overboeking spaargeld", type:"Inkomst", categorie:"Salaris / Inkomsten", waar:"A.M.M. de Reus", vast:"Vast" },
    { id:5, datum:"2026-01-20", bedrag:1000, omschrijving:"Overboeking spaargeld", type:"Inkomst", categorie:"Salaris / Inkomsten", waar:"R.S. Richter", vast:"Vast" },
    { id:6, datum:"2026-02-01", bedrag:76.24, omschrijving:"Boodschappen", type:"Uitgave", categorie:"Boodschappen", waar:"Albert Heijn", vast:"Vast" },
    { id:7, datum:"2026-02-08", bedrag:1600, omschrijving:"Salaris Anne", type:"Inkomst", categorie:"Salaris / Inkomsten", waar:"A.M.M. de Reus", vast:"Vast" },
    { id:8, datum:"2026-02-08", bedrag:1600, omschrijving:"Salaris Ronald", type:"Inkomst", categorie:"Salaris / Inkomsten", waar:"R.S. Richter", vast:"Vast" },
    { id:9, datum:"2026-02-10", bedrag:184, omschrijving:"Energienota Essent", type:"Uitgave", categorie:"Gas / Water / Licht", waar:"Essent", vast:"Vast" },
    { id:10, datum:"2026-02-15", bedrag:433.80, omschrijving:"Gemeentelijke belastingen", type:"Uitgave", categorie:"Gemeentelijke belastingen", waar:"Gemeente Zevenaar", vast:"Vast" },
    { id:11, datum:"2026-02-18", bedrag:654.40, omschrijving:"Skipas Val Thorens", type:"Uitgave", categorie:"Vakantie", waar:"Setam Val Thorens", vast:"Variabel" },
    { id:12, datum:"2026-02-20", bedrag:300.50, omschrijving:"Skipas L Eskis", type:"Uitgave", categorie:"Vakantie", waar:"L Eskis Les Belleville", vast:"Variabel" },
    { id:13, datum:"2026-03-01", bedrag:2318.82, omschrijving:"Hypotheek", type:"Uitgave", categorie:"Huur / Hypotheek", waar:"WH Holding B.V.", vast:"Vast" },
    { id:14, datum:"2026-03-05", bedrag:1600, omschrijving:"Salaris Anne", type:"Inkomst", categorie:"Salaris / Inkomsten", waar:"A.M.M. de Reus", vast:"Vast" },
    { id:15, datum:"2026-03-05", bedrag:1600, omschrijving:"Salaris Ronald", type:"Inkomst", categorie:"Salaris / Inkomsten", waar:"R.S. Richter", vast:"Vast" },
    { id:16, datum:"2026-03-10", bedrag:4974, omschrijving:"Meubels", type:"Uitgave", categorie:"Verbouwing", waar:"Jansen Totaal Wonen", vast:"Variabel" },
    { id:17, datum:"2026-03-15", bedrag:487, omschrijving:"Behang", type:"Uitgave", categorie:"Verbouwing", waar:"Behangwinkel Westervoort", vast:"Variabel" },
    { id:18, datum:"2026-04-01", bedrag:2318.83, omschrijving:"Hypotheek", type:"Uitgave", categorie:"Huur / Hypotheek", waar:"WH Holding B.V.", vast:"Vast" },
    { id:19, datum:"2026-04-05", bedrag:1600, omschrijving:"Salaris Anne", type:"Inkomst", categorie:"Salaris / Inkomsten", waar:"A.M.M. de Reus", vast:"Vast" },
    { id:20, datum:"2026-04-05", bedrag:1600, omschrijving:"Salaris Ronald", type:"Inkomst", categorie:"Salaris / Inkomsten", waar:"R.S. Richter", vast:"Vast" },
    { id:21, datum:"2026-04-10", bedrag:331, omschrijving:"Gas / licht", type:"Uitgave", categorie:"Gas / Water / Licht", waar:"Essent", vast:"Vast" },
    { id:22, datum:"2026-04-15", bedrag:50.53, omschrijving:"Verzekering huis", type:"Uitgave", categorie:"Verzekeringen", waar:"NH1816", vast:"Vast" },
    { id:23, datum:"2026-05-01", bedrag:2318.83, omschrijving:"Hypotheek", type:"Uitgave", categorie:"Huur / Hypotheek", waar:"WH Holding B.V.", vast:"Vast" },
    { id:24, datum:"2026-05-03", bedrag:150.06, omschrijving:"Boodschappen", type:"Uitgave", categorie:"Boodschappen", waar:"Albert Heijn", vast:"Vast" },
    { id:25, datum:"2026-05-05", bedrag:52.82, omschrijving:"Klussen", type:"Uitgave", categorie:"Verbouwing", waar:"Hornbach", vast:"Variabel" },
    { id:26, datum:"2026-05-06", bedrag:50.53, omschrijving:"Verzekering", type:"Uitgave", categorie:"Verzekeringen", waar:"NH1816", vast:"Vast" },
    { id:27, datum:"2026-05-07", bedrag:17.70, omschrijving:"Huishouden", type:"Uitgave", categorie:"Verzorging & Huishouden", waar:"Kruidvat", vast:"Variabel" },
    { id:28, datum:"2026-05-08", bedrag:9.19, omschrijving:"Lunch station", type:"Uitgave", categorie:"Horeca & Afhaal", waar:"Kiosk", vast:"Variabel" },
];

let vasteLasten = [
    { id:1, startdatum:"2026-03-20", herhaling:"Maandelijks", bedrag:3.45, omschrijving:"Bankkosten", type:"Uitgave", categorie:"Abonnementen", vast:"Vast", waar:"Rabobank" },
    { id:2, startdatum:"2026-03-20", herhaling:"Maandelijks", bedrag:1.20, omschrijving:"Bankkosten extra pas", type:"Uitgave", categorie:"Abonnementen", vast:"Vast", waar:"Rabobank" },
    { id:3, startdatum:"2026-04-14", herhaling:"Maandelijks", bedrag:3.99, omschrijving:"Netflix", type:"Uitgave", categorie:"Abonnementen", vast:"Vast", waar:"Netflix" },
    { id:4, startdatum:"2026-04-15", herhaling:"Maandelijks", bedrag:38.50, omschrijving:"TV en internet", type:"Uitgave", categorie:"Internet & TV", vast:"Vast", waar:"Odido" },
    { id:5, startdatum:"2026-04-07", herhaling:"Maandelijks", bedrag:331, omschrijving:"Essent Gas/Energie", type:"Uitgave", categorie:"Gas / Water / Licht", vast:"Vast", waar:"Essent" },
    { id:6, startdatum:"2026-04-18", herhaling:"Maandelijks", bedrag:20, omschrijving:"Water", type:"Uitgave", categorie:"Gas / Water / Licht", vast:"Vast", waar:"Vitens NV" },
    { id:7, startdatum:"2026-04-15", herhaling:"Maandelijks", bedrag:2318.83, omschrijving:"Hypotheek", type:"Uitgave", categorie:"Huur / Hypotheek", vast:"Vast", waar:"WH Holding" },
    { id:8, startdatum:"2026-04-13", herhaling:"Maandelijks", bedrag:1600, omschrijving:"Bijdrage Anne", type:"Inkomst", categorie:"Salaris / Inkomsten", vast:"Vast", waar:"-" },
    { id:9, startdatum:"2026-04-13", herhaling:"Maandelijks", bedrag:1600, omschrijving:"Bijdrage Ronald", type:"Inkomst", categorie:"Salaris / Inkomsten", vast:"Vast", waar:"-" },
];

let spaardoelen = [
    { id:1, doel:"Vakantie 2026", streefbedrag:3000, huidig:0 },
    { id:2, doel:"Keuken", streefbedrag:15000, huidig:0 },
];

let nextId = 100;
let selectedMonth = 4; // mei
let dbSort = { field: "datum", dir: "desc" };

// ─── Helpers ───
function fmt(n) {
    return new Intl.NumberFormat("nl-NL", { style:"currency", currency:"EUR" }).format(n);
}

function fmtDate(dateStr) {
    const d = new Date(dateStr);
    return d.getDate() + " " + MONTHS_NL[d.getMonth()] + " " + d.getFullYear();
}

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

// ─── Tab Navigation ───
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initCategoryDropdowns();
    initInvoer();
    initDatabase();
    initVasteLasten();
    renderOverzicht();
});

function initTabs() {
    $$(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            $$(".tab-btn").forEach(b => b.classList.remove("active"));
            $$(".tab-content").forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            const tab = btn.dataset.tab;
            $(`#tab-${tab}`).classList.add("active");

            if (tab === "overzicht") renderOverzicht();
            if (tab === "database") renderDatabase();
            if (tab === "vaste-lasten") renderVasteLasten();
        });
    });
}

function initCategoryDropdowns() {
    ["#inp-categorie", "#db-categorie", "#vl-categorie"].forEach(sel => {
        const el = $(sel);
        if (!el) return;
        const isFilter = sel === "#db-categorie";
        if (!isFilter) {
            el.innerHTML = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");
        } else {
            el.innerHTML = '<option value="">Alle categorieën</option>' + CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");
        }
    });
}

// ─── Invoer Tab ───
function initInvoer() {
    $("#inp-datum").value = new Date().toISOString().split("T")[0];
    $("#btn-save").addEventListener("click", saveTransaction);
}

function saveTransaction() {
    const bedrag = parseFloat($("#inp-bedrag").value);
    const omschrijving = $("#inp-omschrijving").value.trim();
    if (!bedrag || !omschrijving) return;

    transactions.push({
        id: nextId++,
        datum: $("#inp-datum").value,
        bedrag,
        omschrijving,
        type: $("#inp-type").value,
        categorie: $("#inp-categorie").value,
        waar: $("#inp-waar").value.trim(),
        vast: $("#inp-vast").value
    });

    // Reset form
    $("#inp-bedrag").value = "";
    $("#inp-omschrijving").value = "";
    $("#inp-waar").value = "";
    $("#inp-datum").value = new Date().toISOString().split("T")[0];

    // Feedback
    const fb = $("#save-feedback");
    fb.classList.add("show");
    setTimeout(() => fb.classList.remove("show"), 2000);
}

// ─── Overzicht Tab ───
function renderOverzicht() {
    const year = 2026;
    const yearTx = transactions.filter(t => new Date(t.datum).getFullYear() === year);
    const monthTx = yearTx.filter(t => new Date(t.datum).getMonth() === selectedMonth);

    const mUit = monthTx.filter(t => t.type === "Uitgave").reduce((s,t) => s + t.bedrag, 0);
    const mInk = monthTx.filter(t => t.type === "Inkomst").reduce((s,t) => s + t.bedrag, 0);
    const yUit = yearTx.filter(t => t.type === "Uitgave").reduce((s,t) => s + t.bedrag, 0);
    const yInk = yearTx.filter(t => t.type === "Inkomst").reduce((s,t) => s + t.bedrag, 0);
    const mSaldo = mInk - mUit;

    // Stats cards
    $("#stats-cards").innerHTML = [
        { label: `Uitgaven ${MONTHS_NL[selectedMonth]}`, value: fmt(mUit), cls: "red" },
        { label: `Inkomsten ${MONTHS_NL[selectedMonth]}`, value: fmt(mInk), cls: "green" },
        { label: `Saldo ${MONTHS_NL[selectedMonth]}`, value: fmt(mSaldo), cls: mSaldo >= 0 ? "green" : "red" },
        { label: "Uitgaven 2026", value: fmt(yUit), cls: "orange" },
    ].map(s => `
        <div class="stat-card">
            <p class="stat-label">${s.label}</p>
            <p class="stat-value ${s.cls}">${s.value}</p>
        </div>
    `).join("");

    // Month selector
    $("#month-selector").innerHTML = MONTHS_SHORT.map((m, i) =>
        `<button class="month-btn ${i === selectedMonth ? 'active' : ''}" data-month="${i}">${m}</button>`
    ).join("");
    $$(".month-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            selectedMonth = parseInt(btn.dataset.month);
            renderOverzicht();
        });
    });

    // Pie chart - category breakdown for selected month
    const catData = {};
    monthTx.filter(t => t.type === "Uitgave").forEach(t => {
        catData[t.categorie] = (catData[t.categorie] || 0) + t.bedrag;
    });
    const pieData = Object.entries(catData).sort((a,b) => b[1]-a[1]).map(([name, value]) => ({ name, value }));
    drawPieChart("chart-pie", pieData);

    // Pie legend
    $("#pie-legend").innerHTML = pieData.map((d, i) =>
        `<div class="pie-legend-item"><div class="pie-legend-dot" style="background:${COLORS[i % COLORS.length]}"></div>${d.name}: ${fmt(d.value)}</div>`
    ).join("");

    // Bar chart - monthly overview
    const barData = [];
    for (let m = 0; m < 12; m++) {
        const mTx = yearTx.filter(t => new Date(t.datum).getMonth() === m);
        barData.push({
            label: MONTHS_SHORT[m],
            uitgaven: mTx.filter(t => t.type === "Uitgave").reduce((s,t) => s + t.bedrag, 0),
            inkomsten: mTx.filter(t => t.type === "Inkomst").reduce((s,t) => s + t.bedrag, 0),
        });
    }
    drawBarChart("chart-bar", barData);

    // Kostenverdeling
    const nRonald = 3138.98, nAnne = 3000;
    const totaal = nRonald + nAnne;
    const pctR = nRonald / totaal, pctA = nAnne / totaal;
    const gemUit = yUit / Math.max(selectedMonth + 1, 1);

    $("#kosten-grid").innerHTML = [
        { l: "Netto salaris Ronald", v: fmt(nRonald) },
        { l: "Netto salaris Anne", v: fmt(nAnne) },
        { l: "Gem. uitgaven / mnd", v: fmt(gemUit) },
        { l: "Verdeelmethode", v: "Naar ratio" },
        { l: `Aandeel Ronald (${(pctR*100).toFixed(1)}%)`, v: fmt(gemUit * pctR) },
        { l: `Aandeel Anne (${(pctA*100).toFixed(1)}%)`, v: fmt(gemUit * pctA) },
    ].map(r => `<div class="kosten-item"><div class="label">${r.l}</div><div class="value">${r.v}</div></div>`).join("");

    // Spaardoelen
    $("#spaardoelen-list").innerHTML = spaardoelen.map(s => {
        const pct = s.streefbedrag > 0 ? (s.huidig / s.streefbedrag * 100) : 0;
        return `
            <div class="spaardoel">
                <div class="spaardoel-header">
                    <span class="spaardoel-name">${s.doel}</span>
                    <span class="spaardoel-amounts">${fmt(s.huidig)} / ${fmt(s.streefbedrag)}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(pct,100)}%"></div></div>
                <p class="spaardoel-pct">${pct.toFixed(1)}% bereikt</p>
            </div>
        `;
    }).join("");

    // Top 5
    const catYear = {};
    yearTx.filter(t => t.type === "Uitgave").forEach(t => {
        catYear[t.categorie] = (catYear[t.categorie] || 0) + t.bedrag;
    });
    const top5 = Object.entries(catYear).sort((a,b) => b[1]-a[1]).slice(0,5);
    const maxTop = top5[0]?.[1] || 1;

    $("#top5-list").innerHTML = top5.map(([name, val], i) => `
        <div class="top5-item">
            <span class="top5-rank">${i+1}</span>
            <div class="top5-content">
                <div class="top5-header">
                    <span class="top5-name">${name}</span>
                    <span class="top5-amount">${fmt(val)}</span>
                </div>
                <div class="top5-bar"><div class="top5-bar-fill" style="width:${(val/maxTop*100)}%;background:${COLORS[i]}"></div></div>
            </div>
        </div>
    `).join("");
}

// ─── Canvas Charts ───
function drawPieChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 20, ri = r * 0.55;

    ctx.clearRect(0, 0, w, h);

    if (data.length === 0) {
        ctx.fillStyle = "#555";
        ctx.font = "14px 'DM Sans'";
        ctx.textAlign = "center";
        ctx.fillText("Geen data voor deze maand", cx, cy);
        return;
    }

    const total = data.reduce((s,d) => s + d.value, 0);
    let angle = -Math.PI / 2;

    data.forEach((d, i) => {
        const slice = (d.value / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.arc(cx, cy, ri, angle + slice, angle, true);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();
        angle += slice;
    });

    // Center text
    ctx.fillStyle = "#e8e6e3";
    ctx.font = "bold 18px 'JetBrains Mono'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fmt(total), cx, cy - 8);
    ctx.font = "11px 'DM Sans'";
    ctx.fillStyle = "#888";
    ctx.fillText("totaal", cx, cy + 12);
}

function drawBarChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const pad = { top: 20, right: 20, bottom: 30, left: 55 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    const maxVal = Math.max(...data.map(d => Math.max(d.uitgaven, d.inkomsten)), 1);
    const barGroupW = chartW / data.length;
    const barW = barGroupW * 0.3;
    const gap = barGroupW * 0.1;

    // Y-axis labels
    ctx.fillStyle = "#666";
    ctx.font = "10px 'DM Sans'";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 4; i++) {
        const val = (maxVal / 4) * i;
        const y = pad.top + chartH - (val / maxVal) * chartH;
        ctx.fillText("€" + Math.round(val), pad.left - 8, y);
        // Grid line
        ctx.strokeStyle = "#1e1e2a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
    }

    // Bars
    data.forEach((d, i) => {
        const x = pad.left + i * barGroupW;

        // Inkomsten (green)
        const hInk = (d.inkomsten / maxVal) * chartH;
        ctx.fillStyle = "#16a34a";
        roundRect(ctx, x + gap, pad.top + chartH - hInk, barW, hInk, 3);

        // Uitgaven (red)
        const hUit = (d.uitgaven / maxVal) * chartH;
        ctx.fillStyle = "#dc2626";
        roundRect(ctx, x + gap + barW + 2, pad.top + chartH - hUit, barW, hUit, 3);

        // X label
        ctx.fillStyle = "#666";
        ctx.font = "10px 'DM Sans'";
        ctx.textAlign = "center";
        ctx.fillText(d.label, x + barGroupW/2, h - 8);
    });

    // Legend
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(pad.left, 4, 10, 10);
    ctx.fillStyle = "#999";
    ctx.font = "10px 'DM Sans'";
    ctx.textAlign = "left";
    ctx.fillText("Inkomsten", pad.left + 14, 13);

    ctx.fillStyle = "#dc2626";
    ctx.fillRect(pad.left + 90, 4, 10, 10);
    ctx.fillStyle = "#999";
    ctx.fillText("Uitgaven", pad.left + 104, 13);
}

function roundRect(ctx, x, y, w, h, r) {
    if (h <= 0) return;
    r = Math.min(r, h/2, w/2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
}

// ─── Database Tab ───
function initDatabase() {
    $("#db-search").addEventListener("input", renderDatabase);
    $("#db-type").addEventListener("change", renderDatabase);
    $("#db-categorie").addEventListener("change", renderDatabase);

    $$("#db-table thead th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const field = th.dataset.sort;
            if (dbSort.field === field) {
                dbSort.dir = dbSort.dir === "asc" ? "desc" : "asc";
            } else {
                dbSort.field = field;
                dbSort.dir = "desc";
            }
            renderDatabase();
        });
    });
}

function renderDatabase() {
    const search = ($("#db-search")?.value || "").toLowerCase();
    const typeFilter = $("#db-type")?.value || "";
    const catFilter = $("#db-categorie")?.value || "";

    let filtered = [...transactions];
    if (typeFilter) filtered = filtered.filter(t => t.type === typeFilter);
    if (catFilter) filtered = filtered.filter(t => t.categorie === catFilter);
    if (search) filtered = filtered.filter(t =>
        t.omschrijving.toLowerCase().includes(search) || t.waar.toLowerCase().includes(search)
    );

    // Sort
    filtered.sort((a, b) => {
        let va = a[dbSort.field], vb = b[dbSort.field];
        if (dbSort.field === "bedrag") { va = a.bedrag; vb = b.bedrag; }
        if (va < vb) return dbSort.dir === "asc" ? -1 : 1;
        if (va > vb) return dbSort.dir === "asc" ? 1 : -1;
        return 0;
    });

    const totUit = filtered.filter(t => t.type === "Uitgave").reduce((s,t) => s + t.bedrag, 0);
    const totInk = filtered.filter(t => t.type === "Inkomst").reduce((s,t) => s + t.bedrag, 0);

    // Totals
    $("#db-totals").innerHTML = `
        <div class="db-total-badge"><span class="label">Uitgaven: </span><span class="value red">${fmt(totUit)}</span></div>
        <div class="db-total-badge"><span class="label">Inkomsten: </span><span class="value green">${fmt(totInk)}</span></div>
    `;

    // Table body
    $("#db-tbody").innerHTML = filtered.map(t => `
        <tr>
            <td>${fmtDate(t.datum)}</td>
            <td class="mono" style="font-weight:600;color:${t.type === 'Inkomst' ? '#16a34a' : '#dc2626'}">
                ${t.type === 'Inkomst' ? '+' : '−'} ${fmt(t.bedrag)}
            </td>
            <td>${t.omschrijving}</td>
            <td><span class="badge ${t.type === 'Inkomst' ? 'badge-inkomst' : 'badge-uitgave'}">${t.type}</span></td>
            <td>${t.categorie}</td>
            <td style="color:#888">${t.waar}</td>
            <td><span class="badge ${t.vast === 'Vast' ? 'badge-vast' : 'badge-variabel'}">${t.vast}</span></td>
            <td><button class="btn-delete" onclick="deleteTransaction(${t.id})" title="Verwijderen">×</button></td>
        </tr>
    `).join("");

    $("#db-footer").textContent = `${filtered.length} transactie${filtered.length !== 1 ? 's' : ''}`;
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    renderDatabase();
}

// ─── Vaste Lasten Tab ───
function initVasteLasten() {
    $("#btn-toggle-vl-form").addEventListener("click", () => {
        const card = $("#vl-form-card");
        const btn = $("#btn-toggle-vl-form");
        if (card.style.display === "none") {
            card.style.display = "block";
            btn.textContent = "Annuleren";
            btn.style.background = "linear-gradient(135deg, #555, #333)";
            $("#vl-datum").value = new Date().toISOString().split("T")[0];
        } else {
            card.style.display = "none";
            btn.textContent = "+ Vaste last toevoegen";
            btn.style.background = "";
        }
    });

    $("#btn-add-vl").addEventListener("click", () => {
        const bedrag = parseFloat($("#vl-bedrag").value);
        const omschrijving = $("#vl-omschrijving").value.trim();
        if (!bedrag || !omschrijving) return;

        vasteLasten.push({
            id: nextId++,
            startdatum: $("#vl-datum").value,
            herhaling: $("#vl-herhaling").value,
            bedrag,
            omschrijving,
            type: $("#vl-type").value,
            categorie: $("#vl-categorie").value,
            vast: "Vast",
            waar: $("#vl-waar").value.trim()
        });

        // Reset
        $("#vl-bedrag").value = "";
        $("#vl-omschrijving").value = "";
        $("#vl-waar").value = "";
        $("#vl-form-card").style.display = "none";
        $("#btn-toggle-vl-form").textContent = "+ Vaste last toevoegen";
        $("#btn-toggle-vl-form").style.background = "";

        renderVasteLasten();
    });

    renderVasteLasten();
}

function renderVasteLasten() {
    const totUit = vasteLasten.filter(v => v.type === "Uitgave").reduce((s,v) => s + v.bedrag, 0);
    const totInk = vasteLasten.filter(v => v.type === "Inkomst").reduce((s,v) => s + v.bedrag, 0);
    const rest = totInk - totUit;

    $("#vl-stats").innerHTML = `
        <div class="stat-card">
            <p class="stat-label">Totaal vaste lasten / mnd</p>
            <p class="stat-value red">${fmt(totUit)}</p>
        </div>
        <div class="stat-card">
            <p class="stat-label">Vaste inkomsten / mnd</p>
            <p class="stat-value green">${fmt(totInk)}</p>
        </div>
        <div class="stat-card">
            <p class="stat-label">Restant / mnd</p>
            <p class="stat-value ${rest >= 0 ? 'green' : 'red'}">${fmt(rest)}</p>
        </div>
    `;

    $("#vl-tbody").innerHTML = vasteLasten.map(v => `
        <tr>
            <td style="font-weight:500">${v.omschrijving}</td>
            <td class="mono" style="font-weight:600;color:${v.type === 'Inkomst' ? '#16a34a' : '#dc2626'}">
                ${v.type === 'Inkomst' ? '+' : '−'} ${fmt(v.bedrag)}
            </td>
            <td style="color:#888">${v.herhaling}</td>
            <td>${v.categorie}</td>
            <td style="color:#888">${v.waar}</td>
            <td><span class="badge ${v.type === 'Inkomst' ? 'badge-inkomst' : 'badge-uitgave'}">${v.type}</span></td>
            <td><button class="btn-delete" onclick="deleteVasteLast(${v.id})" title="Verwijderen">×</button></td>
        </tr>
    `).join("");
}

function deleteVasteLast(id) {
    vasteLasten = vasteLasten.filter(v => v.id !== id);
    renderVasteLasten();
}