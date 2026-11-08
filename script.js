const categoriesList = [
  { id: "Wszystkie", label: "✨ Wszystkie kategorie" },
  { id: "Malarstwo", label: "🎨 Malarstwo" },
  { id: "Grafika i Linoryt", label: "✒️ Grafika i Linoryt" },
  { id: "Ceramika i Szkło", label: "🏺 Ceramika i Szkło" },
  { id: "Rzeźba i Drewno", label: "🗿 Rzeźba i Drewno" },
  { id: "Fotografia Analogowa", label: "📷 Fotografia Analogowa" },
  { id: "Tekstylia i Makrama", label: "🧶 Tekstylia i Makrama" },
  { id: "Biżuteria Autorska", label: "💍 Biżuteria Autorska" },
  { id: "Plakat i Ilustracja", label: "🖼️ Plakat i Ilustracja" }
];

const initialArtworks = [
  {
    id: 101,
    title: "Nokturn nad Motławą",
    author: "@marta_asp",
    category: "Malarstwo",
    technique: "Olej i szpachla na płótnie",
    dimensions: "60 x 80 cm",
    price: 480,
    negotiatedPrice: null,
    shipping: 29,
    negotiable: true,
    custom: true,
    framed: true,
    unique: true,
    humanScore: "99.4%",
    likes: 34,
    liked: false,
    sold: false,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 102,
    title: "Zestaw 2 czarek Matcha 'Popiół'",
    author: "@glina_w_ogniu",
    category: "Ceramika i Szkło",
    technique: "Kamionka toczona na kole",
    dimensions: "2x 220 ml",
    price: 135,
    negotiatedPrice: null,
    shipping: 19,
    negotiable: false,
    custom: true,
    framed: false,
    unique: true,
    humanScore: "99.8%",
    likes: 52,
    liked: true,
    sold: false,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 103,
    title: "Linoryt 'Botanika Nocy' (Sygnowany 3/10)",
    author: "@kuba_ryt",
    category: "Grafika i Linoryt",
    technique: "Ręczna odbitka, papier bawełniany 300g",
    dimensions: "30 x 40 cm",
    price: 160,
    negotiatedPrice: null,
    shipping: 14,
    negotiable: true,
    custom: false,
    framed: true,
    unique: false,
    humanScore: "98.9%",
    likes: 29,
    liked: false,
    sold: false,
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 104,
    title: "Forma organiczna z czarnego dębu",
    author: "@dluto_studio",
    category: "Rzeźba i Drewno",
    technique: "Rzeźbione ręcznie dłutem, wosk pszczeli",
    dimensions: "42 x 18 x 15 cm",
    price: 690,
    negotiatedPrice: null,
    shipping: 29,
    negotiable: true,
    custom: false,
    framed: false,
    unique: true,
    humanScore: "99.7%",
    likes: 19,
    liked: false,
    sold: false,
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 105,
    title: "Srebrny sygnet 'Surowy Kwarc'",
    author: "@alchemia_srebra",
    category: "Biżuteria Autorska",
    technique: "Srebro próby 925, metoda wosku traconego",
    dimensions: "Rozmiar 16 (regulowany)",
    price: 290,
    negotiatedPrice: null,
    shipping: 14,
    negotiable: true,
    custom: true,
    framed: false,
    unique: true,
    humanScore: "99.2%",
    likes: 41,
    liked: false,
    sold: false,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 106,
    title: "Odbitka ciemniowa 'Bałtyk w listopadzie'",
    author: "@klisza_35mm",
    category: "Fotografia Analogowa",
    technique: "Powiększalnik, papier srebrowy Ilford",
    dimensions: "24 x 30 cm",
    price: 210,
    negotiatedPrice: null,
    shipping: 14,
    negotiable: false,
    custom: false,
    framed: true,
    unique: true,
    humanScore: "99.5%",
    likes: 23,
    liked: false,
    sold: false,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 107,
    title: "Gobelin tkany na krośnie 'Wydmy'",
    author: "@sploty_natury",
    category: "Tekstylia i Makrama",
    technique: "Wełna czesankowa Polskie Runo i len",
    dimensions: "50 x 90 cm",
    price: 380,
    negotiatedPrice: null,
    shipping: 19,
    negotiable: true,
    custom: true,
    framed: true,
    unique: true,
    humanScore: "99.6%",
    likes: 37,
    liked: false,
    sold: false,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 108,
    title: "Akwarela botaniczna 'Dziki Oset'",
    author: "@marta_asp",
    category: "Plakat i Ilustracja",
    technique: "Akwarela i tusz na papierze Arches",
    dimensions: "21 x 29.7 cm (A4)",
    price: 110,
    negotiatedPrice: null,
    shipping: 14,
    negotiable: true,
    custom: false,
    framed: true,
    unique: true,
    humanScore: "99.1%",
    likes: 16,
    liked: false,
    sold: false,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=700&q=80"
  }
];

let artworks = JSON.parse(
  localStorage.getItem("artvint_ai_items")
) || initialArtworks;

let currentUser = JSON.parse(
  localStorage.getItem("artvint_pro_user")
) || null;

let activeCategory = "Wszystkie";
let viewMode = "all";
let activeItemId = null;
let aiVerificationPassed = true;
let lastHumanScore = "99.1%";

function showToast(msg, type = "success") {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");

  const bg = type === "error"
    ? "bg-rose-700 text-white"
    : type === "info"
      ? "bg-teal-700 text-white"
      : "bg-stone-900 text-white";

  el.className =
    `${bg} px-4 py-3 rounded-2xl shadow-lg text-xs font-semibold flex items-center gap-2 transition-all`;

  el.innerHTML = `<span>🛡️</span> <span>${msg}</span>`;
  container.appendChild(el);

  setTimeout(() => el.remove(), 3500);
}

// Demonstracyjna symulacja AI-Shield.
function handleFileUpload(input) {
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];

  const isSuspiciousName =
    /(midjourney|dalle|dall-e|stable_diffusion|sdxl|ai_art|comfyui)/i
      .test(file.name.toLowerCase());

  const reader = new FileReader();

  reader.onload = function(event) {
    const img = new Image();

    img.onload = function() {
      const canvas = document.getElementById("ai-scanner-canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 64;
      canvas.height = 64;
      ctx.drawImage(img, 0, 0, 64, 64);

      runAiScanSimulation(
        isSuspiciousName ? "ai" : "human",
        `Plik: ${file.name} (${img.width}x${img.height}px)`
      );
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

function runAiScanSimulation(mode, fileInfo = "") {
  const box = document.getElementById("ai-scan-box");
  const bar = document.getElementById("ai-scan-bar");
  const status = document.getElementById("ai-scan-status");
  const badge = document.getElementById("ai-score-badge");
  const pubBtn = document.getElementById("publish-btn");

  box.classList.remove("hidden");

  bar.style.width = "15%";
  bar.className = "bg-teal-400 h-full transition-all duration-300";

  status.className = "text-xs font-mono text-slate-300";
  status.innerText =
    `🔍 Krok 1/3: Odczyt metadanych EXIF i profilu kolorów... ${fileInfo}`;

  badge.innerText = "Skanowanie...";
  badge.className =
    "text-[11px] font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full";

  setTimeout(() => {
    bar.style.width = "60%";
    status.innerText =
      "🧬 Krok 2/3: Analiza szumu matrycy i mikro-krawędzi pędzla (HTML5 Canvas)...";
  }, 450);

  setTimeout(() => {
    bar.style.width = "100%";

    if (mode === "ai") {
      aiVerificationPassed = false;

      bar.className = "bg-rose-500 h-full transition-all duration-300";
      badge.innerText = "🚨 WYKRYTO AI (96.4%)";
      badge.className =
        "text-[11px] font-mono bg-rose-600 text-white font-bold px-2.5 py-0.5 rounded-full";

      status.className =
        "text-xs font-mono text-rose-400 font-semibold";
      status.innerText =
        "❌ BLOKADA: Wykryto artefakty dyfuzji (Midjourney/DALL-E) oraz brak naturalnego ziarna optycznego. Publikacja zablokowana!";

      pubBtn.disabled = true;
      pubBtn.className =
        "w-full bg-rose-900/40 border border-rose-500 text-rose-200 font-semibold py-3 rounded-xl text-sm cursor-not-allowed";
      pubBtn.innerText =
        "🔒 Publikacja zablokowana przez AI-Shield (Wykryto grafikę AI)";

      showToast(
        "AI-Shield zablokował próbę wgrania obrazu wygenerowanego przez AI!",
        "error"
      );
    } else {
      aiVerificationPassed = true;

      const score = (98.4 + Math.random() * 1.4).toFixed(1) + "%";
      lastHumanScore = score;

      bar.className =
        "bg-emerald-400 h-full transition-all duration-300";

      badge.innerText = `✅ HUMAN: ${score}`;
      badge.className =
        "text-[11px] font-mono bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full";

      status.className =
        "text-xs font-mono text-emerald-300 font-semibold";
      status.innerText =
        `✓ Weryfikacja pozytywna (${score} Praca Autorska): Naturalny rozkład ziarna, brak sygnatur generatorów AI.`;

      pubBtn.disabled = false;
      pubBtn.className =
        "w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-xl text-sm transition shadow";
      pubBtn.innerText =
        "✅ Opublikuj zweryfikowane dzieło (0% prowizji)";

      showToast(
        `Zdjęcie przeszło weryfikację AI-Shield (Wynik: ${score} Human)!`,
        "info"
      );
    }
  }, 950);
}

function saveState() {
  localStorage.setItem("artvint_ai_items", JSON.stringify(artworks));
  localStorage.setItem("artvint_pro_user", JSON.stringify(currentUser));

  renderUserNav();
  renderCategories();
  renderItems();
}

function renderUserNav() {
  const area = document.getElementById("user-nav-area");

  document.getElementById("fav-count").innerText =
    artworks.filter(item => item.liked).length;

  if (currentUser) {
    area.innerHTML = `
      <div class="flex items-center gap-2 bg-stone-100 border border-stone-200 pl-3 pr-2 py-1 rounded-full">
        <div class="text-right hidden sm:block">
          <div class="text-xs font-bold text-stone-800 leading-none">
            ${currentUser.handle}
          </div>
          <div class="text-[10px] text-teal-700 font-medium">
            ${currentUser.role}
          </div>
        </div>
        <button onclick="logout()"
          class="bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-stone-200 transition">
          Wyloguj
        </button>
      </div>
    `;
  } else {
    area.innerHTML = `
      <button onclick="openModal('login-modal')"
        class="bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition">
        👤 Zaloguj się
      </button>
    `;
  }
}

function quickLogin(handle, name, role) {
  currentUser = { handle, name, role };

  closeModal("login-modal");
  showToast(`Zalogowano jako ${handle} (${role})`);
  saveState();
}

document.getElementById("login-form").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const raw = document.getElementById("login-username").value.trim();
    const handle = raw.startsWith("@")
      ? raw
      : "@" + raw.replace(/\s+/g, "_").toLowerCase();

    const role = document.getElementById("login-role").value;

    currentUser = { handle, name: raw, role };

    this.reset();
    closeModal("login-modal");
    showToast(`Witaj na pokładzie, ${handle}!`);
    saveState();
  }
);

function logout() {
  currentUser = null;
  viewMode = "all";

  showToast("Wylogowano z konta.");
  saveState();
}

function handleSellClick() {
  if (!currentUser) {
    showToast("Zaloguj się, aby wystawić swoje dzieło!", "info");
    openModal("login-modal");
    return;
  }

  openModal("add-modal");
}

function setViewMode(mode) {
  if (mode === "my" && !currentUser) {
    showToast("Zaloguj się, aby zobaczyć swoją pracownię!", "info");
    openModal("login-modal");
    return;
  }

  viewMode = mode;

  document.getElementById("view-all-btn").className = mode === "all"
    ? "text-xs font-semibold px-3 py-1 rounded-lg bg-stone-900 text-white"
    : "text-xs font-semibold px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200";

  document.getElementById("view-my-btn").className = mode === "my"
    ? "text-xs font-semibold px-3 py-1 rounded-lg bg-teal-700 text-white"
    : "text-xs font-semibold px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200";

  renderItems();
}

function renderCategories() {
  const bar = document.getElementById("category-bar");

  bar.innerHTML = categoriesList.map(category => {
    const active = activeCategory === category.id;

    return `
      <button onclick="selectCategory('${category.id}')"
        class="shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition ${
          active
            ? "bg-teal-700 text-white shadow-sm"
            : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
        }">
        ${category.label}
      </button>
    `;
  }).join("");
}

function selectCategory(categoryId) {
  activeCategory = categoryId;

  renderCategories();
  renderItems();
}

function resetFilters() {
  activeCategory = "Wszystkie";
  viewMode = "all";

  document.getElementById("search-input").value = "";
  document.getElementById("filter-min-price").value = "";
  document.getElementById("filter-max-price").value = "";
  document.getElementById("filter-sale-type").value = "all";
  document.getElementById("filter-feature").value = "all";
  document.getElementById("filter-availability").value = "available";
  document.getElementById("filter-sort").value = "popular";

  saveState();
}

function toggleLike(id) {
  artworks = artworks.map(item => item.id === id
    ? {
        ...item,
        liked: !item.liked,
        likes: item.liked ? item.likes - 1 : item.likes + 1
      }
    : item
  );

  saveState();
}

function openNegotiateModal(id) {
  if (!currentUser) {
    showToast("Zaloguj się, aby negocjować cenę z artystą!", "info");
    openModal("login-modal");
    return;
  }

  activeItemId = id;

  const item = artworks.find(item => item.id === id);
  const suggested = Math.round(item.price * 0.85);

  document.getElementById("negotiate-info").innerHTML = `
    <div class="bg-stone-50 p-3 rounded-2xl border flex justify-between items-center">
      <div>
        <div class="font-bold text-stone-900">${item.title}</div>
        <div class="text-xs text-stone-500">
          Autor: ${item.author} • Cena wyjściowa: ${item.price} zł
        </div>
      </div>
      <span class="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">
        Negocjacja
      </span>
    </div>
  `;

  document.getElementById("offer-price-input").value = suggested;
  openModal("negotiate-modal");
}

function submitOffer() {
  const offer = parseInt(
    document.getElementById("offer-price-input").value,
    10
  );

  const item = artworks.find(item => item.id === activeItemId);

  if (!offer || offer <= 0 || offer >= item.price) {
    showToast("Podaj kwotę niższą niż cena wyjściowa.", "info");
    return;
  }

  const minAcceptable = Math.round(item.price * 0.78);

  closeModal("negotiate-modal");

  if (offer >= minAcceptable) {
    artworks = artworks.map(item => item.id === activeItemId
      ? { ...item, negotiatedPrice: offer }
      : item
    );

    showToast(
      `Artysta ${item.author} zaakceptował Twoją ofertę ${offer} zł!`
    );
    saveState();
  } else {
    showToast(
      `Oferta ${offer} zł została odrzucona (minimum dla tej pracy to ok. ${minAcceptable} zł).`,
      "error"
    );
  }
}

function openBuyModal(id) {
  if (!currentUser) {
    showToast("Zaloguj się, aby przejść do zakupu!", "info");
    openModal("login-modal");
    return;
  }

  activeItemId = id;

  const item = artworks.find(item => item.id === id);
  const finalPrice = item.negotiatedPrice || item.price;
  const fee = Math.round(finalPrice * 0.05) + 6;
  const total = finalPrice + fee + item.shipping;

  document.getElementById("buy-details").innerHTML = `
    <div class="bg-stone-50 p-3.5 rounded-2xl border flex justify-between items-center">
      <div>
        <div class="font-bold text-stone-900">${item.title}</div>
        <div class="text-xs text-stone-500">
          ${item.author} • ${item.dimensions}
        </div>
      </div>
      <div class="text-right">
        ${item.negotiatedPrice ? `
          <span class="text-xs line-through text-stone-400 block">
            ${item.price} zł
          </span>
        ` : ""}
        <span class="font-bold text-teal-700 text-base">
          ${finalPrice} zł
        </span>
      </div>
    </div>

    <div class="space-y-2 pt-2 text-stone-600 text-xs">
      <div class="flex justify-between">
        <span>Kwota dla artysty (100% bez prowizji):</span>
        <span class="font-semibold">${finalPrice},00 zł</span>
      </div>
      <div class="flex justify-between">
        <span>🛡️ Ochrona Kupującego + Certyfikat AI-Shield:</span>
        <span class="font-semibold">${fee},00 zł</span>
      </div>
      <div class="flex justify-between">
        <span>📦 Bezpieczna przesyłka dzieła:</span>
        <span class="font-semibold">${item.shipping},00 zł</span>
      </div>
      <div class="flex justify-between border-t pt-2.5 text-sm font-bold text-stone-900">
        <span>Do zapłaty łącznie:</span>
        <span>${total},00 zł</span>
      </div>
    </div>
  `;

  openModal("buy-modal");
}

function confirmPurchase() {
  artworks = artworks.map(item => item.id === activeItemId
    ? { ...item, sold: true }
    : item
  );

  closeModal("buy-modal");
  showToast("Gratulacje! Dzieło zostało kupione.");
  saveState();
}

document.getElementById("add-form").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!aiVerificationPassed) {
      showToast(
        "Nie można opublikować pracy zablokowanej przez skaner AI-Shield!",
        "error"
      );
      return;
    }

    const title = document.getElementById("art-title").value.trim();
    const price = parseInt(
      document.getElementById("art-price").value,
      10
    );
    const category = document.getElementById("art-category").value;
    const technique = document.getElementById("art-tech").value.trim();
    const dimensions = document.getElementById("art-dim").value.trim();
    const negotiable = document.getElementById("opt-negotiable").checked;
    const custom = document.getElementById("opt-custom").checked;
    const framed = document.getElementById("opt-framed").checked;
    const unique = document.getElementById("opt-unique").checked;
    const shipping = parseInt(
      document.getElementById("art-shipping").value,
      10
    );
    const fileInput = document.getElementById("art-image-file");

    const finishAdding = image => {
      artworks.unshift({
        id: Date.now(),
        title,
        author: currentUser ? currentUser.handle : "@nowy_artysta",
        category,
        technique,
        dimensions,
        price,
        negotiatedPrice: null,
        shipping,
        negotiable,
        custom,
        framed,
        unique,
        humanScore: lastHumanScore,
        likes: 1,
        liked: false,
        sold: false,
        image
      });

      this.reset();
      document.getElementById("ai-scan-box").classList.add("hidden");

      closeModal("add-modal");
      showToast("Zweryfikowane dzieło zostało opublikowane w katalogu!");
      saveState();
    };

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();

      reader.onload = event => finishAdding(event.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      finishAdding(
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80"
      );
    }
  }
);

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
  document.getElementById(id).classList.add("flex");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
  document.getElementById(id).classList.remove("flex");
}

function renderItems() {
  const grid = document.getElementById("items-grid");
  const query = document.getElementById("search-input").value.toLowerCase();

  const minPrice = parseInt(
    document.getElementById("filter-min-price").value,
    10
  ) || 0;

  const maxPrice = parseInt(
    document.getElementById("filter-max-price").value,
    10
  ) || Infinity;

  const saleType = document.getElementById("filter-sale-type").value;
  const feature = document.getElementById("filter-feature").value;
  const availability = document.getElementById("filter-availability").value;
  const sortBy = document.getElementById("filter-sort").value;

  const filtered = artworks.filter(item => {
    const effectivePrice = item.negotiatedPrice || item.price;

    if (
      activeCategory !== "Wszystkie" &&
      item.category !== activeCategory
    ) return false;

    if (viewMode === "favorites" && !item.liked) return false;

    if (
      viewMode === "my" &&
      (!currentUser || item.author !== currentUser.handle)
    ) return false;

    if (availability === "available" && item.sold) return false;
    if (effectivePrice < minPrice || effectivePrice > maxPrice) return false;

    if (saleType === "negotiable" && !item.negotiable) return false;
    if (saleType === "custom" && !item.custom) return false;
    if (saleType === "buynow" && item.negotiable) return false;

    if (feature === "framed" && !item.framed) return false;
    if (feature === "unique" && !item.unique) return false;

    if (query) {
      const text =
        `${item.title} ${item.author} ${item.technique} ${item.category} ${item.dimensions}`
          .toLowerCase();

      if (!text.includes(query)) return false;
    }

    return true;
  });

  if (sortBy === "popular") {
    filtered.sort((a, b) => b.likes - a.likes);
  }

  if (sortBy === "newest") {
    filtered.sort((a, b) => b.id - a.id);
  }

  if (sortBy === "price-asc") {
    filtered.sort(
      (a, b) =>
        (a.negotiatedPrice || a.price) -
        (b.negotiatedPrice || b.price)
    );
  }

  if (sortBy === "price-desc") {
    filtered.sort(
      (a, b) =>
        (b.negotiatedPrice || b.price) -
        (a.negotiatedPrice || a.price)
    );
  }

  document.getElementById("results-counter").innerText =
    `Znaleziono: ${filtered.length} dzieł`;

  grid.innerHTML = filtered.map(item => {
    const finalPrice = item.negotiatedPrice || item.price;
    const fee = Math.round(finalPrice * 0.05) + 6;
    const score = item.humanScore || "99.2%";

    return `
      <div class="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between card-zoom">
        <div>
          <div class="px-4 py-2.5 flex justify-between items-center text-xs border-b border-stone-100">
            <span class="font-bold text-stone-800">${item.author}</span>
            <span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
              🛡️ ${score} Human
            </span>
          </div>

          <div class="relative h-60 bg-stone-100 overflow-hidden">
            <img
              src="${item.image}"
              alt="${item.title}"
              class="w-full h-full object-cover transition duration-500 ${
                item.sold ? "grayscale opacity-50" : ""
              }">

            <div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
              <span class="bg-stone-900/80 backdrop-blur text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                📐 ${item.dimensions}
              </span>

              ${item.unique ? `
                <span class="bg-amber-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  💎 Unikat 1/1
                </span>
              ` : ""}

              ${item.custom ? `
                <span class="bg-indigo-600/90 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  ✨ Zamówienia Custom
                </span>
              ` : ""}
            </div>

            ${item.sold ? `
              <div class="absolute inset-0 flex items-center justify-center bg-stone-950/50">
                <span class="bg-rose-600 text-white font-bold px-5 py-1.5 rounded-full text-xs uppercase tracking-widest shadow">
                  Sprzedane
                </span>
              </div>
            ` : ""}

            <button onclick="toggleLike(${item.id})"
              class="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <span>${item.liked ? "❤️" : "🤍"}</span>
              <span>${item.likes}</span>
            </button>
          </div>

          <div class="p-4 space-y-1.5">
            <div class="flex justify-between items-baseline">
              <div>
                ${item.negotiatedPrice ? `
                  <span class="text-xs line-through text-rose-500 mr-1">
                    ${item.price} zł
                  </span>
                ` : ""}
                <span class="text-lg font-extrabold text-stone-900">
                  ${finalPrice},00 zł
                </span>
              </div>
              <span class="text-[11px] text-teal-800 font-semibold">
                ${finalPrice + fee} zł z Ochroną 🛡️
              </span>
            </div>

            <h3 class="font-bold text-sm text-stone-900 line-clamp-1">
              ${item.title}
            </h3>
            <p class="text-xs text-stone-500 line-clamp-1">
              ${item.category} • ${item.technique}
            </p>

            <div class="flex gap-1.5 pt-1 flex-wrap">
              ${item.framed ? `
                <span class="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                  🖼️ Oprawione
                </span>
              ` : ""}
              ${item.negotiable ? `
                <span class="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md font-medium">
                  💬 Do negocjacji
                </span>
              ` : ""}
            </div>
          </div>
        </div>

        <div class="p-4 pt-0">
          ${item.sold ? `
            <button disabled
              class="w-full bg-stone-100 text-stone-400 font-semibold py-2.5 rounded-xl text-xs cursor-not-allowed">
              Praca w prywatnej kolekcji
            </button>
          ` : `
            <div class="flex gap-2">
              <button onclick="openBuyModal(${item.id})"
                class="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-sm">
                Kup teraz
              </button>

              ${item.negotiable ? `
                <button onclick="openNegotiateModal(${item.id})"
                  class="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-3 py-2.5 rounded-xl text-xs border border-stone-300 transition">
                  💬 Negocjuj
                </button>
              ` : ""}
            </div>
          `}
        </div>
      </div>
    `;
  }).join("");
}

saveState();

// Rozszerzenie demonstracyjne: administrator, artyści i portfolio.
// Uprawnienia w przeglądarce nie zastępują autoryzacji na serwerze.
(() => {
  const $ = id => document.getElementById(id);

  const esc = value => String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character])
  );

  const artist = user => !!user && [
    "Artystka",
    "Twórca / Artysta",
    "Administrator"
  ].includes(user.role);

  const admin = () => currentUser?.role === "Administrator";

  const canEdit = item => !!currentUser && (
    admin() ||
    (artist(currentUser) && item.author === currentUser.handle)
  );

  const demoUsers = [
    {
      handle: "@admin",
      name: "Administrator",
      role: "Administrator"
    },
    {
      handle: "@marta_asp",
      name: "Marta (Studentka ASP)",
      role: "Artystka"
    },
    {
      handle: "@piotr_kolekcjoner",
      name: "Piotr Nowak",
      role: "Kupujący"
    }
  ];

  let users;

  try {
    users = JSON.parse(
      localStorage.getItem("artvint_users_v2")
    ) || demoUsers;
  } catch {
    users = demoUsers;
  }

  initialArtworks.forEach(item => {
    if (!users.some(user => user.handle === item.author)) {
      users.push({
        handle: item.author,
        name: item.author,
        role: "Twórca / Artysta"
      });
    }
  });

  if (
    currentUser &&
    !users.some(user => user.handle === currentUser.handle)
  ) {
    users.push(currentUser);
  }

  if (currentUser) {
    currentUser = users.find(
      user => user.handle === currentUser.handle
    ) || null;
  }

  let profiles;

  try {
    profiles = JSON.parse(
      localStorage.getItem("artvint_portfolios_v2")
    ) || {};
  } catch {
    profiles = {};
  }

  let editingId = null;
  let editingAuthor = null;
  let portfolioHandle = null;
  let profileHandle = null;
  let screen = "market";

  function persist() {
    try {
      localStorage.setItem("artvint_users_v2", JSON.stringify(users));
      localStorage.setItem(
        "artvint_portfolios_v2",
        JSON.stringify(profiles)
      );
      localStorage.setItem("artvint_ai_items", JSON.stringify(artworks));
      localStorage.setItem(
        "artvint_pro_user",
        JSON.stringify(currentUser)
      );

      return true;
    } catch {
      showToast(
        "Brak miejsca na zapis. Wybierz mniejsze zdjęcie lub zwolnij miejsce w przeglądarce.",
        "error"
      );
      return false;
    }
  }

  const main = document.querySelector("main");
  const extra = document.createElement("section");

  extra.id = "artist-admin-panel";
  extra.className =
    "hidden bg-white border border-stone-200 rounded-2xl p-5 space-y-4";

  main.insertBefore(extra, $("items-grid"));

  $("view-my-btn").insertAdjacentHTML("afterend", `
    <button id="portfolio-nav"
      class="text-xs font-semibold px-3 py-1 rounded-lg bg-teal-50 text-teal-800">
      Moje portfolio
    </button>

    <button id="admin-nav"
      class="text-xs font-semibold px-3 py-1 rounded-lg bg-amber-100 text-amber-900">
      Panel administratora
    </button>
  `);

  $("portfolio-nav").onclick = () => {
    if (!artist(currentUser)) {
      showToast(
        "Portfolio jest dostępne dla artysty i administratora.",
        "info"
      );
      return;
    }

    openPortfolio(currentUser.handle);
  };

  $("admin-nav").onclick = () => {
    if (admin()) {
      screen = "admin";
      renderItems();
    }
  };

  const demoButton = document.createElement("button");

  demoButton.type = "button";
  demoButton.className =
    "w-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold py-2 rounded-xl";

  demoButton.textContent =
    "🛠️ Konto Administratora (@admin) — demo";

  demoButton.onclick = () => {
    quickLogin("@admin", "Administrator", "Administrator");
  };

  $("login-form").before(demoButton);

  $("art-shipping").parentElement.insertAdjacentHTML("beforebegin", `
    <label class="flex items-center gap-2 text-xs">
      <input id="portfolio-only" type="checkbox" class="accent-teal-700">
      Tylko portfolio — praca nie jest na sprzedaż
    </label>
  `);

  $("portfolio-only").onchange = () => {
    $("art-price").required = !$("portfolio-only").checked;
    $("art-price").disabled = $("portfolio-only").checked;
  };

  document.body.insertAdjacentHTML("beforeend", `
    <div id="profile-modal"
      class="fixed inset-0 bg-stone-950/60 hidden items-center justify-center z-40 p-4">

      <form id="profile-form"
        class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">

        <h2 class="text-xl font-bold">Edytuj portfolio</h2>

        <label class="block text-sm">
          Nazwa pracowni
          <input id="profile-name"
            maxlength="100"
            required
            class="block w-full border rounded-xl p-2">
        </label>

        <label class="block text-sm">
          O artyście
          <textarea id="profile-bio"
            maxlength="2000"
            rows="5"
            class="block w-full border rounded-xl p-2"></textarea>
        </label>

        <label class="block text-sm">
          Strona lub kontakt (https://)
          <input id="profile-url"
            type="url"
            placeholder="https://..."
            class="block w-full border rounded-xl p-2">
        </label>

        <div class="flex gap-3">
          <button class="bg-teal-700 text-white px-4 py-2 rounded-xl">
            Zapisz portfolio
          </button>

          <button type="button"
            id="profile-close"
            class="border px-4 py-2 rounded-xl">
            Anuluj
          </button>
        </div>
      </form>
    </div>
  `);

  $("profile-close").onclick = () => closeModal("profile-modal");

  const safeURL = value => {
    try {
      const url = new URL(value);

      return ["https:", "http:"].includes(url.protocol)
        ? url.href
        : "";
    } catch {
      return "";
    }
  };

  const oldToast = showToast;

  showToast = (message, type) => {
    oldToast(esc(message), type);
  };

  const oldNav = renderUserNav;

  renderUserNav = function() {
    const original = currentUser;

    if (currentUser) {
      currentUser = {
        ...currentUser,
        handle: esc(currentUser.handle),
        role: esc(currentUser.role)
      };
    }

    try {
      oldNav();
    } finally {
      currentUser = original;
    }

    $("admin-nav").classList.toggle("hidden", !admin());
    $("portfolio-nav").classList.toggle("hidden", !artist(currentUser));
    $("view-my-btn").classList.toggle("hidden", !artist(currentUser));
  };

  saveState = function() {
    persist();
    renderUserNav();
    renderCategories();
    renderItems();
  };

  quickLogin = function(handle, name, role) {
    let user = users.find(user => user.handle === handle);

    if (!user) {
      user = {
        handle,
        name,
        role: role === "Administrator" ? "Twórca / Artysta" : role
      };

      users.push(user);
    }

    currentUser = user;
    screen = "market";

    closeModal("login-modal");
    showToast(`Zalogowano jako ${user.handle} (${user.role})`);
    saveState();
  };

  $("login-form").addEventListener("submit", event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const name = $("login-username").value.trim();

    const handle = "@" + name
      .replace(/^@/, "")
      .replace(/\s+/g, "_")
      .toLowerCase();

    if (!/^@[\p{L}\p{N}_.-]{1,60}$/u.test(handle)) {
      showToast(
        "Nick: litery, cyfry, kropka, myślnik i podkreślenie.",
        "error"
      );
      return;
    }

    quickLogin(handle, name, $("login-role").value);
    event.target.reset();
  }, true);

  logout = function() {
    currentUser = null;
    screen = "market";
    viewMode = "all";

    closeModal("add-modal");
    closeModal("profile-modal");
    closeModal("buy-modal");
    closeModal("negotiate-modal");

    saveState();
    showToast("Wylogowano z konta.");
  };

  const oldView = setViewMode;

  setViewMode = function(mode) {
    if (mode === "my" && !artist(currentUser)) {
      showToast("Moja pracownia jest dostępna dla artysty.", "info");
      return;
    }

    screen = "market";
    oldView(mode);
  };

  const oldReset = resetFilters;

  resetFilters = function() {
    screen = "market";
    oldReset();
  };

  function prepareEditor(item = null, owner = currentUser?.handle) {
    if (!artist(currentUser) || (item && !canEdit(item))) {
      showToast("Brak uprawnień do edycji tej pracy.", "error");
      return;
    }

    editingId = item?.id ?? null;

    editingAuthor = item?.author || (
      admin() &&
      users.some(user => user.handle === owner && artist(user))
        ? owner
        : currentUser.handle
    );

    $("add-form").reset();

    $("art-price").disabled = false;
    $("art-price").required = true;

    $("ai-scan-box").classList.add("hidden");

    $("ai-score-badge").textContent = item
      ? "Zachowano zdjęcie pracy"
      : "Oczekuje na plik...";

    $("publish-btn").disabled = false;
    $("publish-btn").className =
      "w-full bg-teal-700 text-white font-semibold py-3 rounded-xl text-sm";

    $("publish-btn").textContent = item
      ? "Zapisz zmiany pracy"
      : "Dodaj pracę";

    aiVerificationPassed = !!item;
    lastHumanScore = item?.humanScore || "99.1%";

    if (item) {
      const fields = [
        ["art-title", "title"],
        ["art-price", "price"],
        ["art-category", "category"],
        ["art-tech", "technique"],
        ["art-dim", "dimensions"],
        ["art-shipping", "shipping"]
      ];

      for (const [field, key] of fields) {
        $(field).value = item[key];
      }

      for (const key of ["negotiable", "custom", "framed", "unique"]) {
        $("opt-" + key).checked = !!item[key];
      }

      $("portfolio-only").checked = !!item.portfolioOnly;
      $("portfolio-only").onchange();
    }

    openModal("add-modal");
  }

  handleSellClick = function() {
    if (!currentUser) {
      openModal("login-modal");
      return;
    }

    prepareEditor();
  };

  const oldUpload = handleFileUpload;

  handleFileUpload = function(input) {
    const file = input.files?.[0];

    aiVerificationPassed = false;

    if (!file) return;

    if (
      !/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type) ||
      file.size > 1500000
    ) {
      input.value = "";

      showToast(
        "Wybierz JPG, PNG, WebP, GIF lub AVIF do 1,5 MB.",
        "error"
      );
      return;
    }

    oldUpload(input);
  };

  const oldScan = runAiScanSimulation;

  runAiScanSimulation = function(mode, info) {
    aiVerificationPassed = false;
    oldScan(mode, info);
  };

  $("add-form").addEventListener("submit", async event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const existing = editingId === null
      ? null
      : artworks.find(item => item.id === editingId);

    if (
      !artist(currentUser) ||
      (editingId !== null && (!existing || !canEdit(existing)))
    ) {
      showToast("Brak uprawnień.", "error");
      return;
    }

    if (!aiVerificationPassed) {
      showToast(
        "Wybierz zdjęcie i poczekaj na zakończenie demonstracyjnej weryfikacji lub użyj przycisku demo.",
        "info"
      );
      return;
    }

    const portfolioOnly = $("portfolio-only").checked;
    const price = portfolioOnly ? 0 : Number($("art-price").value);
    const title = $("art-title").value.trim();
    const technique = $("art-tech").value.trim();
    const dimensions = $("art-dim").value.trim();

    if (
      !title ||
      !technique ||
      !dimensions ||
      !Number.isFinite(price) ||
      (!portfolioOnly && price < 10)
    ) {
      showToast("Uzupełnij dane pracy i poprawną cenę.", "error");
      return;
    }

    const session = currentUser.handle;

    let image = existing?.image ||
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80";

    const file = $("art-image-file").files?.[0];

    if (file) {
      try {
        image = await new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;

          reader.readAsDataURL(file);
        });
      } catch {
        showToast("Nie udało się odczytać zdjęcia.", "error");
        return;
      }
    }

    if (
      currentUser?.handle !== session ||
      !artist(currentUser) ||
      (existing && !canEdit(existing))
    ) {
      return;
    }

    const next = {
      ...existing,
      id: existing?.id ?? Date.now(),
      author: existing?.author ||
        (admin() ? editingAuthor : currentUser.handle),
      title,
      technique,
      dimensions,
      price,
      category: $("art-category").value,
      shipping: Number($("art-shipping").value),
      portfolioOnly,
      negotiatedPrice: null,
      humanScore: lastHumanScore,
      likes: existing?.likes ?? 0,
      liked: existing?.liked ?? false,
      sold: existing?.sold ?? false,
      image
    };

    for (const key of ["negotiable", "custom", "framed", "unique"]) {
      next[key] = $("opt-" + key).checked;
    }

    const previous = artworks;

    artworks = existing
      ? artworks.map(item => item.id === existing.id ? next : item)
      : [next, ...artworks];

    if (!persist()) {
      artworks = previous;
      return;
    }

    closeModal("add-modal");
    saveState();

    showToast(
      existing ? "Zapisano zmiany pracy." : "Dodano pracę do portfolio."
    );
  }, true);

  function editProfile(handle) {
    if (
      !admin() &&
      !(artist(currentUser) && currentUser.handle === handle)
    ) {
      return;
    }

    profileHandle = handle;

    const profile = profiles[handle] || {};

    $("profile-name").value = profile.name ||
      users.find(user => user.handle === handle)?.name ||
      handle;

    $("profile-bio").value = profile.bio || "";
    $("profile-url").value = profile.url || "";

    openModal("profile-modal");
  }

  $("profile-form").onsubmit = event => {
    event.preventDefault();

    if (
      !admin() &&
      !(artist(currentUser) && currentUser.handle === profileHandle)
    ) {
      return;
    }

    const url = $("profile-url").value.trim();

    if (url && !safeURL(url)) {
      showToast(
        "Podaj adres rozpoczynający się od https:// lub http://.",
        "error"
      );
      return;
    }

    const previous = profiles[profileHandle];

    profiles[profileHandle] = {
      name: $("profile-name").value.trim(),
      bio: $("profile-bio").value.trim(),
      url: safeURL(url)
    };

    if (!persist()) {
      if (previous) {
        profiles[profileHandle] = previous;
      } else {
        delete profiles[profileHandle];
      }

      return;
    }

    closeModal("profile-modal");
    renderItems();
    showToast("Zapisano portfolio.");
  };

  function openPortfolio(handle) {
    portfolioHandle = handle;
    screen = "portfolio";
    renderItems();
  }

  const button = (text, action) => {
    const element = document.createElement("button");

    element.type = "button";
    element.className =
      "px-3 py-2 rounded-xl border text-xs font-semibold hover:bg-stone-100";

    element.textContent = text;
    element.onclick = action;

    return element;
  };

  const oldRender = renderItems;

  renderItems = function() {
    renderUserNav();

    const isAdminScreen = screen === "admin" && admin();

    if (screen === "admin" && !admin()) {
      screen = "market";
    }

    extra.replaceChildren();
    extra.classList.toggle("hidden", screen === "market");

    if (screen === "portfolio") {
      const profile = profiles[portfolioHandle] || {};

      const heading = document.createElement("h2");
      heading.className = "text-2xl font-serif-art font-bold";
      heading.textContent = profile.name || portfolioHandle;

      const bio = document.createElement("p");
      bio.className = "text-sm whitespace-pre-wrap";
      bio.textContent = profile.bio ||
        "Artysta nie dodał jeszcze opisu swojej pracowni.";

      extra.append(heading, bio);

      if (safeURL(profile.url)) {
        const link = document.createElement("a");

        link.href = safeURL(profile.url);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "block text-teal-700 underline";
        link.textContent = "Strona artysty / kontakt";

        extra.append(link);
      }

      extra.append(
        button("Wróć do ofert", () => setViewMode("all"))
      );

      if (
        admin() ||
        (artist(currentUser) && currentUser.handle === portfolioHandle)
      ) {
        extra.append(
          button("Edytuj portfolio", () => editProfile(portfolioHandle))
        );
      }

      if (
        (
          admin() &&
          artist(users.find(user => user.handle === portfolioHandle))
        ) ||
        (artist(currentUser) && currentUser.handle === portfolioHandle)
      ) {
        extra.append(
          button("Dodaj pracę", () =>
            prepareEditor(null, portfolioHandle)
          )
        );
      }
    }

    if (isAdminScreen) {
      const heading = document.createElement("h2");

      heading.className = "text-xl font-bold";
      heading.textContent =
        "Panel administratora — prace, portfolio i konta";

      extra.append(
        heading,
        button("Dodaj pracę", () => prepareEditor()),
        button("Wróć do ofert", () => setViewMode("all"))
      );

      for (const user of users) {
        const row = document.createElement("div");

        row.className =
          "flex flex-wrap items-center gap-2 border-t pt-3 text-sm";

        const label = document.createElement("span");
        label.textContent = `${user.handle} — ${user.name}`;

        const select = document.createElement("select");
        select.className = "border rounded-lg p-2";

        for (const role of [
          "Administrator",
          "Twórca / Artysta",
          "Kolekcjoner"
        ]) {
          select.add(new Option(role, role));
        }

        select.value = user.role === "Artystka"
          ? "Twórca / Artysta"
          : user.role === "Kupujący"
            ? "Kolekcjoner"
            : user.role;

        select.disabled = user.handle === currentUser.handle;

        select.onchange = () => {
          if (!admin() || user.handle === currentUser.handle) return;

          const previous = user.role;
          user.role = select.value;

          if (!persist()) user.role = previous;

          saveState();
        };

        row.append(
          label,
          select,
          button("Portfolio", () => openPortfolio(user.handle)),
          button("Edytuj profil", () => editProfile(user.handle))
        );

        if (
          user.handle !== currentUser.handle &&
          user.handle !== "@admin"
        ) {
          row.append(button("Usuń konto", () => {
            if (
              !admin() ||
              !confirm(
                `Usunąć konto ${user.handle}, jego portfolio i wszystkie prace?`
              )
            ) {
              return;
            }

            const previousUsers = users;
            const previousArtworks = artworks;
            const previousProfile = profiles[user.handle];

            users = users.filter(item => item.handle !== user.handle);
            artworks = artworks.filter(
              item => item.author !== user.handle
            );

            delete profiles[user.handle];

            if (!persist()) {
              users = previousUsers;
              artworks = previousArtworks;

              if (previousProfile) {
                profiles[user.handle] = previousProfile;
              }
            }

            saveState();
          }));
        }

        extra.append(row);
      }
    }

    const original = artworks;
    const previousView = viewMode;
    const previousCategory = activeCategory;

    const filterIds = [
      "search-input",
      "filter-min-price",
      "filter-max-price",
      "filter-sale-type",
      "filter-feature",
      "filter-availability",
      "filter-sort"
    ];

    const filterValues = filterIds.map(id => $(id).value);

    try {
      if (screen !== "market") {
        viewMode = "all";
        activeCategory = "Wszystkie";

        const values = [
          "", "", "", "all", "all", "all", "newest"
        ];

        filterIds.forEach((id, index) => {
          $(id).value = values[index];
        });
      }

      artworks = original
        .filter(item => screen === "portfolio"
          ? item.author === portfolioHandle
          : isAdminScreen || viewMode === "my" || !item.portfolioOnly
        )
        .map(item => {
          const copy = { ...item };

          for (const key of [
            "title",
            "author",
            "technique",
            "category",
            "dimensions",
            "image",
            "humanScore"
          ]) {
            copy[key] = esc(copy[key]);
          }

          return copy;
        });

      oldRender();
    } finally {
      artworks = original;
      viewMode = previousView;
      activeCategory = previousCategory;

      filterIds.forEach((id, index) => {
        $(id).value = filterValues[index];
      });
    }

    for (const card of $("items-grid").children) {
      const like = card.querySelector('[onclick^="toggleLike"]');

      const id = Number(
        like?.getAttribute("onclick").match(/\d+/)?.[0]
      );

      const item = artworks.find(item => item.id === id);

      if (!item) continue;

      const author = card.querySelector(".font-bold.text-stone-800");

      if (author) {
        author.classList.add("cursor-pointer", "underline");
        author.onclick = () => openPortfolio(item.author);
      }

      if (item.portfolioOnly) {
        const bottom = card.lastElementChild;

        bottom.replaceChildren();

        const label = document.createElement("p");

        label.className = "text-sm text-teal-800";
        label.textContent = "Praca w portfolio — nie na sprzedaż";

        bottom.append(label);

        card.querySelector(".p-4.space-y-1\\.5 > div")?.remove();
      }

      if (canEdit(item)) {
        const controls = document.createElement("div");

        controls.className = "flex flex-wrap gap-2 p-4 pt-0";

        controls.append(
          button("Edytuj", () => prepareEditor(item)),
          button("Usuń", () => {
            if (
              !canEdit(item) ||
              !confirm(`Usunąć pracę „${item.title}”?`)
            ) {
              return;
            }

            const previous = artworks;

            artworks = artworks.filter(work => work.id !== item.id);

            if (!persist()) artworks = previous;

            saveState();
          })
        );

        if (!item.portfolioOnly) {
          controls.append(button(
            item.sold ? "Przywróć sprzedaż" : "Oznacz jako sprzedane",
            () => {
              if (!canEdit(item)) return;

              item.sold = !item.sold;

              if (!persist()) item.sold = !item.sold;

              saveState();
            }
          ));
        }

        card.append(controls);
      }
    }

    if (!$("items-grid").children.length) {
      const message = document.createElement("p");

      message.className = "col-span-full text-stone-500 py-8";
      message.textContent = screen === "portfolio"
        ? "Brak prac w portfolio."
        : "Brak prac spełniających kryteria.";

      $("items-grid").append(message);
    }
  };

  const oldBuy = openBuyModal;
  const oldNegotiate = openNegotiateModal;

  const tradable = id => artworks.some(
    item => item.id === id && !item.sold && !item.portfolioOnly
  );

  function safeItemModal(fn, id) {
    const original = artworks;

    try {
      artworks = original.map(item => ({
        ...item,
        title: esc(item.title),
        author: esc(item.author),
        dimensions: esc(item.dimensions)
      }));

      fn(id);
    } finally {
      artworks = original;
    }
  }

  openBuyModal = id => {
    if (tradable(id)) safeItemModal(oldBuy, id);
  };

  openNegotiateModal = id => {
    if (
      tradable(id) &&
      artworks.find(item => item.id === id).negotiable
    ) {
      safeItemModal(oldNegotiate, id);
    }
  };

  const oldConfirm = confirmPurchase;
  const oldOffer = submitOffer;

  confirmPurchase = () => {
    if (currentUser && tradable(activeItemId)) {
      oldConfirm();
    }
  };

  submitOffer = () => {
    if (
      currentUser &&
      tradable(activeItemId) &&
      artworks.find(item => item.id === activeItemId).negotiable
    ) {
      oldOffer();
    }
  };

  saveState();
})();