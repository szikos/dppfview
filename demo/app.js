// --- Simple i18n dictionary (extend as needed) ---
const I18N = {
  en: {
    appTitle: "Furniture Digital Product Passport",
    login: "Login",
    logout: "Logout",
    installApp: "Install app",
    productSearch: "Product",
    search: "Search",
    scanQr: "Scan QR code",
    recentlyViewed: "Recently viewed",
    loginTitle: "User login",
    loginOptional: "Login is optional and only used to personalize your view.",
    email: "Email",
    password: "Password",
    scanQrTitle: "Scan QR code",
    scanQrInfo: "Demo mode: enter a product ID from the JSON file to simulate QR scan.",
    open: "Open",
    tabDashboard: "Dashboard",
    tabLifecycle: "Lifecycle",
    tabCircularity: "Circularity",
    tabEnvironment: "Environment",
    tabProvenance: "Provenance",
    overview: "Overview",
    material: "Material",
    dimensions: "Dimensions",
    weight: "Weight",
    warranty: "Warranty",
    certifications: "Certifications",
    lifecycleTimeline: "Lifecycle timeline",
    circularityTitle: "Circularity",
    repairability: "Repairability score",
    recycledContent: "Recycled content",
    recyclability: "Recyclability",
    circularityNotes: "Notes",
    environmentalData: "Environmental data",
    carbonFootprint: "Carbon footprint",
    energyUse: "Energy use in production",
    waterUse: "Water use",
    envLabels: "Environmental labels",
    provenanceChain: "Provenance chain"
  },
  de: {
    appTitle: "Digitaler Produktpass für Möbel",
    login: "Anmelden",
    logout: "Abmelden",
    installApp: "App installieren",
    productSearch: "Produkt",
    search: "Suchen",
    scanQr: "QR-Code scannen",
    recentlyViewed: "Zuletzt angesehen",
    loginTitle: "Benutzeranmeldung",
    loginOptional: "Anmeldung ist optional und dient nur der Personalisierung.",
    email: "E-Mail",
    password: "Passwort",
    scanQrTitle: "QR-Code scannen",
    scanQrInfo: "Demo: Produkt-ID aus der JSON-Datei eingeben, um einen Scan zu simulieren.",
    open: "Öffnen",
    tabDashboard: "Übersicht",
    tabLifecycle: "Lebenszyklus",
    tabCircularity: "Zirkularität",
    tabEnvironment: "Umwelt",
    tabProvenance: "Herkunft",
    overview: "Übersicht",
    material: "Material",
    dimensions: "Abmessungen",
    weight: "Gewicht",
    warranty: "Garantie",
    certifications: "Zertifizierungen",
    lifecycleTimeline: "Lebenszyklus-Zeitachse",
    circularityTitle: "Zirkularität",
    repairability: "Reparierbarkeits-Score",
    recycledContent: "Rezyklatanteil",
    recyclability: "Rezyklierbarkeit",
    circularityNotes: "Hinweise",
    environmentalData: "Umweltdaten",
    carbonFootprint: "CO₂-Fußabdruck",
    energyUse: "Energieverbrauch in der Produktion",
    waterUse: "Wasserverbrauch",
    envLabels: "Umweltlabels",
    provenanceChain: "Herkunftskette"
  },
  fr: {
    appTitle: "Passeport numérique produit pour meubles",
    login: "Connexion",
    logout: "Déconnexion",
    installApp: "Installer l’application",
    productSearch: "Produit",
    search: "Rechercher",
    scanQr: "Scanner le QR code",
    recentlyViewed: "Récemment consultés",
    loginTitle: "Connexion utilisateur",
    loginOptional: "La connexion est facultative et sert uniquement à personnaliser votre vue.",
    email: "E-mail",
    password: "Mot de passe",
    scanQrTitle: "Scanner le QR code",
    scanQrInfo: "Démo : saisissez un ID produit du fichier JSON pour simuler un scan.",
    open: "Ouvrir",
    tabDashboard: "Tableau de bord",
    tabLifecycle: "Cycle de vie",
    tabCircularity: "Circularité",
    tabEnvironment: "Environnement",
    tabProvenance: "Provenance",
    overview: "Aperçu",
    material: "Matériau",
    dimensions: "Dimensions",
    weight: "Poids",
    warranty: "Garantie",
    certifications: "Certifications",
    lifecycleTimeline: "Chronologie du cycle de vie",
    circularityTitle: "Circularité",
    repairability: "Score de réparabilité",
    recycledContent: "Contenu recyclé",
    recyclability: "Recyclabilité",
    circularityNotes: "Notes",
    environmentalData: "Données environnementales",
    carbonFootprint: "Empreinte carbone",
    energyUse: "Énergie utilisée en production",
    waterUse: "Consommation d’eau",
    envLabels: "Labels environnementaux",
    provenanceChain: "Chaîne de provenance"
  }
};

const STATE = {
  products: [],
  currentProduct: null,
  language: localStorage.getItem("dpp_lang") || "en",
  user: JSON.parse(localStorage.getItem("dpp_user") || "null")
};

const RECENT_KEY = "dpp_recent";
const MAX_RECENT = 8;

// --- DOM helpers ---
const $ = (id) => document.getElementById(id);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}

// --- i18n ---
function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.documentElement.lang = lang;
  localStorage.setItem("dpp_lang", lang);
}

// --- Recent list ---
function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function addRecent(product) {
  let recent = getRecent().filter((p) => p.id !== product.id);
  recent.unshift({
    id: product.id,
    name: product.name,
    brand: product.brand
  });
  if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  renderRecent();
}

function renderRecent() {
  const list = $("recentList");
  list.innerHTML = "";
  const recent = getRecent();
  if (!recent.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "—";
    list.appendChild(li);
    return;
  }
  recent.forEach((p) => {
    const li = document.createElement("li");
    li.className = "recent-item";
    li.innerHTML = `
      <span class="recent-item-title">${p.name}</span>
      <span class="recent-item-sub">${p.id} · ${p.brand}</span>
    `;
    li.addEventListener("click", () => {
      const prod = STATE.products.find((x) => x.id === p.id);
      if (prod) {
        setCurrentProduct(prod);
      } else {
        showToast("Product not found in demo data.");
      }
    });
    list.appendChild(li);
  });
}

// --- Product rendering ---
function setCurrentProduct(product) {
  STATE.currentProduct = product;
  $("productName").textContent = product.name;
  $("productId").textContent = product.id;
  $("productBrand").textContent = product.brand;
  $("productCategory").textContent = product.category;

  $("productMaterial").textContent = product.material;
  $("productDimensions").textContent = product.dimensions;
  $("productWeight").textContent = product.weight;
  $("productWarranty").textContent = product.warranty;

  const certs = $("productCerts");
  certs.innerHTML = "";
  (product.certifications || []).forEach((c) => {
    const li = document.createElement("li");
    li.className = "badge";
    li.textContent = c;
    certs.appendChild(li);
  });

  const timeline = $("lifecycleTimeline");
  timeline.innerHTML = "";
  (product.lifecycle || []).forEach((step) => {
    const li = document.createElement("li");
    li.className = "timeline-item";
    li.innerHTML = `
      <div class="timeline-title">${step.title}</div>
      <div class="timeline-date">${step.date}</div>
      <div class="muted" style="font-size:0.78rem;">${step.description}</div>
    `;
    timeline.appendChild(li);
  });

  $("repairScore").textContent = product.circularity.repairabilityScore;
  $("recycledContent").textContent = product.circularity.recycledContent;
  $("recyclability").textContent = product.circularity.recyclability;
  $("circularityNotes").textContent = product.circularity.notes;

  $("carbonFootprint").textContent = product.environment.carbonFootprint;
  $("energyUse").textContent = product.environment.energyUse;
  $("waterUse").textContent = product.environment.waterUse;

  const envLabels = $("envLabels");
  envLabels.innerHTML = "";
  (product.environment.labels || []).forEach((l) => {
    const li = document.createElement("li");
    li.className = "badge badge-outline";
    li.textContent = l;
    envLabels.appendChild(li);
  });

  const provList = $("provenanceList");
  provList.innerHTML = "";
  (product.provenance || []).forEach((p) => {
    const li = document.createElement("li");
    li.className = "provenance-item";
    li.innerHTML = `
      <div class="provenance-header">
        <span class="provenance-role">${p.role}</span>
        <span class="provenance-location">${p.location}</span>
      </div>
      <div class="provenance-meta">
        ${p.organization} · ${p.date}
      </div>
    `;
    provList.appendChild(li);
  });

  addRecent(product);
}

// --- Search ---
function searchProduct(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    STATE.products.find(
      (p) =>
        p.id.toLowerCase() === q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    ) || null
  );
}

// --- Tabs ---
function initTabs() {
  $$(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      $$(".tab").forEach((b) => b.classList.toggle("active", b === btn));
      $$(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.id === `tab-${tab}`);
      });
    });
  });
}

// --- Login (demo only, no real auth) ---
function updateAuthUI() {
  if (STATE.user) {
    $("loginBtn").classList.add("hidden");
    $("logoutBtn").classList.remove("hidden");
    $("loginPanel").classList.add("hidden");
  } else {
    $("loginBtn").classList.remove("hidden");
    $("logoutBtn").classList.add("hidden");
  }
}

function initLogin() {
  $("loginBtn").addEventListener("click", () => {
    $("loginPanel").classList.toggle("hidden");
  });

  $("logoutBtn").addEventListener("click", () => {
    STATE.user = null;
    localStorage.removeItem("dpp_user");
    updateAuthUI();
    showToast("Logged out.");
  });

  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("emailInput").value.trim();
    if (!email) return;
    STATE.user = { email };
    localStorage.setItem("dpp_user", JSON.stringify(STATE.user));
    updateAuthUI();
    showToast("Logged in (demo only).");
  });

  updateAuthUI();
}

// --- QR panel (demo) ---
function initQrPanel() {
  $("scanQrBtn").addEventListener("click", () => {
    $("qrPanel").classList.toggle("hidden");
    startQrScanner();
  });

  $("qrSubmitBtn").addEventListener("click", () => {
    const id = $("qrInput").value;
    const prod = searchProduct(id);
    if (prod) {
      setCurrentProduct(prod);
      $("qrPanel").classList.add("hidden");
    } else {
      showToast("Product not found.");
    }
  });
}


function startQrScanner() {
  if (!Html5Qrcode.getCameras) {
    showToast("QR scanning not supported on this browser.");
    $("qrScanner").innerHTML = `<p class="muted">Camera access not available. Try entering the product ID manually.</p>`;
    return;
  }

  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices.length === 0) {
        $("qrScanner").innerHTML = `<p class="muted">No camera found. Try entering the product ID manually.</p>`;
        return;
      }

      const qrScanner = new Html5Qrcode("qrScanner");
      qrScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: true
        },
        (decodedText) => {
          const prod = searchProduct(decodedText);
          if (prod) {
            setCurrentProduct(prod);
            $("qrPanel").classList.add("hidden");
            qrScanner.stop();
          } else {
            showToast("QR code not recognized.");
          }
        },
        (errorMessage) => {}
      ).catch((err) => {
        console.error("QR scanner error:", err);
        $("qrScanner").innerHTML = `<p class="muted">Camera access failed. Try entering the product ID manually.</p>`;
      });
    })
    .catch((err) => {
      console.error("Camera detection failed:", err);
      $("qrScanner").innerHTML = `<p class="muted">Camera not available. Try entering the product ID manually.</p>`;
    });
}


// --- Language selector ---
function initLanguage() {
  const select = $("languageSelect");
  select.value = STATE.language;
  applyLanguage(STATE.language);
  select.addEventListener("change", () => {
    STATE.language = select.value;
    applyLanguage(STATE.language);
  });
}

// --- PWA install prompt ---
let deferredPrompt = null;
function initPwaInstall() {
  const installBtn = $("installBtn");
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove("hidden");
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      showToast("App installation started.");
    }
    deferredPrompt = null;
    installBtn.classList.add("hidden");
  });
}

// --- Service worker registration ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .catch((err) => console.error("SW registration failed", err));
  });
}

// --- Init ---
async function init() {
  initTabs();
  initLogin();
  initQrPanel();
  initLanguage();
  initPwaInstall();
  renderRecent();

  try {
    const res = await fetch("data.json");
    const data = await res.json();
    STATE.products = data.products || [];
    if (STATE.products.length) {
      setCurrentProduct(STATE.products[0]);
    }
  } catch (e) {
    console.error(e);
    showToast("Failed to load demo data.");
  }

  $("productSearchBtn").addEventListener("click", () => {
    const q = $("productSearchInput").value;
    const prod = searchProduct(q);
    if (prod) {
      setCurrentProduct(prod);
    } else {
      showToast("Product not found.");
    }
  });

  $("productSearchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      $("productSearchBtn").click();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
