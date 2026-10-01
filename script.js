// Romana Imóveis — página inicial
// Os imóveis vêm de imoveis.js; formatação e WhatsApp de util.js.

const PLACEHOLDERS = {
  comprar: "Onde você quer morar?",
  investir: "Onde você quer investir?",
};

const $cards = document.getElementById("cards");
const $q = document.getElementById("q");
let modo = "comprar";
let categoria = null; // filtro vindo das pílulas (ex.: "rural")

// Favoritos persistidos no navegador
function lerFavoritos() {
  try { return new Set(JSON.parse(localStorage.getItem("ri-favs") || "[]")); } catch { return new Set(); }
}
const favoritos = lerFavoritos();
function salvarFavoritos() {
  try { localStorage.setItem("ri-favs", JSON.stringify([...favoritos])); } catch {}
}

function normalizar(s) {
  return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function cardHTML(i) {
  const fav = favoritos.has(i.id);
  const local = [i.bairro, i.cidade].filter(Boolean).join(", ");
  const specs = especificacoes(i)
    .map(s => `<span><svg><use href="#${s.icone}"/></svg>${escapar(s.texto)}</span>`)
    .join("");
  return `
    <article class="card">
      <div class="card__media">
        <img src="${i.fotos[0]}" alt="${escapar(i.titulo)} em ${escapar(local)}" loading="lazy" />
        ${i.tag ? `<span class="card__tag">${escapar(i.tag)}</span>` : ""}
        <button class="fav${fav ? " is-on" : ""}" data-id="${i.id}" aria-pressed="${fav}" aria-label="Favoritar">
          <svg><use href="#i-heart"/></svg>
        </button>
      </div>
      <div class="card__body">
        <p class="card__price"><small>${i.precoAPartir ? "A partir de" : "Valor"}</small>${brl.format(i.preco)}</p>
        <h3 class="card__title"><a class="card__link" href="imovel.html?id=${encodeURIComponent(i.id)}">${escapar(i.titulo)}</a></h3>
        <p class="card__loc">${escapar(local)}</p>
        ${specs ? `<div class="card__specs">${specs}</div>` : ""}
      </div>
    </article>`;
}

function render() {
  const termo = normalizar($q.value.trim());
  const lista = IMOVEIS.filter(i =>
    temModo(i, modo) &&
    (!categoria || i.categoria === categoria) &&
    (!termo || normalizar(`${i.titulo} ${i.tipo} ${i.bairro} ${i.cidade} ${(i.destaques || []).join(" ")}`).includes(termo))
  );

  if (lista.length) {
    $cards.innerHTML = lista.map(cardHTML).join("");
    return;
  }

  // Nenhum resultado: convida a falar com a Romana
  const zap = linkWhatsApp(termo
    ? `Olá, Romana! Procuro um imóvel em ${$q.value.trim()}.`
    : "Olá, Romana! Gostaria de saber sobre imóveis disponíveis.");
  $cards.innerHTML = `
    <div class="cards__empty">
      <p>${termo ? "Nenhum imóvel encontrado para “<span></span>”." : "Em breve novos imóveis por aqui."}
      Conte para a Romana o que você procura.</p>
      <a class="btn-zap" href="${zap}" target="_blank" rel="noopener"><svg><use href="#i-whatsapp"/></svg>Falar com Romana</a>
    </div>`;
  const alvo = $cards.querySelector("span");
  if (alvo) alvo.textContent = $q.value.trim();
}

// Seletor Comprar / Investir
function mudarModo(novo) {
  modo = novo;
  document.querySelectorAll(".segmented__opt").forEach(b => {
    const ativo = b.dataset.mode === novo;
    b.classList.toggle("is-active", ativo);
    b.setAttribute("aria-selected", ativo);
  });
  $q.placeholder = PLACEHOLDERS[modo];
}
document.querySelectorAll(".segmented__opt").forEach(btn => {
  btn.addEventListener("click", () => { mudarModo(btn.dataset.mode); render(); });
});

// Busca
document.querySelector(".search").addEventListener("submit", () => {
  render();
  document.getElementById("destaques").scrollIntoView({ behavior: "smooth" });
});
$q.addEventListener("input", () => { if (!$q.value) render(); });

// Pílulas de busca popular: definem modo e/ou categoria (clicar de novo desmarca)
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const cat = chip.dataset.cat || null;
    const jaAtivo = chip.classList.contains("is-active");
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
    $q.value = "";
    categoria = jaAtivo ? null : cat;
    if (!jaAtivo) {
      // a mesma pílula existe no hero e abaixo dele (mobile): marca as duas
      document.querySelectorAll(`.chip[data-key="${chip.dataset.key}"]`)
        .forEach(c => c.classList.add("is-active"));
    }
    mudarModo(chip.dataset.mode);
    render();
  });
});

// Favoritos
$cards.addEventListener("click", e => {
  const btn = e.target.closest(".fav");
  if (!btn) return;
  const id = btn.dataset.id;
  favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
  btn.classList.toggle("is-on");
  btn.setAttribute("aria-pressed", favoritos.has(id));
  salvarFavoritos();
});

// Menu mobile
const $menu = document.getElementById("menu");
const $menuBtn = document.querySelector(".menu-btn");
function abrirMenu(aberto) {
  $menu.hidden = !aberto;
  $menuBtn.setAttribute("aria-expanded", aberto);
  document.body.style.overflow = aberto ? "hidden" : "";
}
$menuBtn.addEventListener("click", () => abrirMenu(true));
$menu.addEventListener("click", e => {
  if (e.target === $menu || e.target.closest(".menu__close") || e.target.closest("a")) abrirMenu(false);
});
document.addEventListener("keydown", e => { if (e.key === "Escape") abrirMenu(false); });

document.getElementById("year").textContent = new Date().getFullYear();

render();
