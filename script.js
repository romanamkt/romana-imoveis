// Romana Imóveis — página inicial
// Os imóveis vêm de imoveis.js; formatação e WhatsApp de util.js.

// Texto de fundo da busca: vai alternando exemplos do que dá para procurar
const EXEMPLOS = [
  "O que você quer ver?",
  "Casa em Ouro Branco",
  "Lote em condomínio",
  "Sítio ou fazenda",
  "Apartamento",
  "Terreno",
];

// Palavras que a pessoa pode digitar para cada categoria
const SINONIMOS = {
  casa: "casa residencia",
  apartamento: "apartamento apto ap",
  terreno: "terreno lote loteamento",
  rural: "sitio fazenda chacara rural roca",
  comercial: "comercial loja sala galpao ponto",
};
// Palavras ignoradas na busca ("casa em Ouro Branco" = "casa Ouro Branco")
const IGNORAR = new Set(["em", "no", "na", "nos", "nas", "de", "do", "da", "dos", "das", "e", "ou", "com", "para", "a", "o"]);

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

// Busca livre: cada palavra digitada precisa aparecer no imóvel, em qualquer
// ordem (ex.: "casa siderurgia", "sítio em Ouro Branco"); aceita plural
// Palavras de tipo ("casa", "lote", "sítio"...) filtram pela categoria, para
// "lote" não achar uma casa que tem "lote de 300 m²" na descrição
const CATEGORIA_DA_PALAVRA = {};
for (const [cat, palavras] of Object.entries(SINONIMOS)) {
  for (const p of palavras.split(" ")) CATEGORIA_DA_PALAVRA[p] = cat;
}

function combina(i, termo) {
  const texto = normalizar(`${i.titulo} ${i.tipo} ${i.bairro} ${i.cidade} ${(i.destaques || []).join(" ")}`);
  return termo.split(/\s+/)
    .filter(p => p && !IGNORAR.has(p))
    .every(p => {
      const singular = p.length > 3 && p.endsWith("s") ? p.slice(0, -1) : p;
      const cat = CATEGORIA_DA_PALAVRA[p] || CATEGORIA_DA_PALAVRA[singular];
      if (cat) return i.categoria === cat;
      return texto.includes(p) || texto.includes(singular);
    });
}

function render() {
  const termo = normalizar($q.value.trim());
  const lista = IMOVEIS.filter(i =>
    temModo(i, modo) &&
    (!categoria || i.categoria === categoria) &&
    (!termo || combina(i, termo))
  );

  if (lista.length) {
    $cards.innerHTML = lista.map(cardHTML).join("");
    $cards.scrollLeft = 0;
    atualizarCarrossel(document.getElementById("destaques"));
    return;
  }

  // Nenhum resultado: convida a falar com a Romana
  const zap = linkWhatsApp(termo
    ? `Olá, Romana! Procuro: ${$q.value.trim()}.`
    : "Olá, Romana! Gostaria de saber sobre imóveis disponíveis.");
  $cards.innerHTML = `
    <div class="cards__empty">
      <p>${termo ? "Nenhum imóvel encontrado para “<span></span>”." : "Em breve novos imóveis por aqui."}
      Conte para a Romana o que você procura.</p>
      <a class="btn-zap" href="${zap}" target="_blank" rel="noopener"><svg><use href="#i-whatsapp"/></svg>Falar com Romana</a>
    </div>`;
  const alvo = $cards.querySelector("span");
  if (alvo) alvo.textContent = $q.value.trim();
  atualizarCarrossel(document.getElementById("destaques"));
}

// Carrosséis por categoria (Casas, Lotes, Sítios): mostram todos os imóveis
// da categoria e só aparecem quando há algum cadastrado
function renderCategorias() {
  document.querySelectorAll(".highlights[data-cat]").forEach(secao => {
    const lista = IMOVEIS.filter(i => i.categoria === secao.dataset.cat);
    secao.hidden = !lista.length;
    secao.querySelector(".cards").innerHTML = lista.map(cardHTML).join("");
    atualizarCarrossel(secao);
  });
}

// Setas (computador) e "Ver todos": as setas ficam apagadas no começo/fim,
// e somem junto com o "Ver todos" quando todos os cards já cabem na tela
function atualizarCarrossel(secao) {
  const cards = secao.querySelector(".cards");
  const aberto = cards.classList.contains("cards--all");
  const sobra = cards.scrollWidth - cards.clientWidth > 4;
  const [ant, prox] = secao.querySelectorAll(".nav-btn");
  ant.hidden = prox.hidden = aberto || !sobra;
  ant.disabled = cards.scrollLeft < 4;
  prox.disabled = cards.scrollLeft + cards.clientWidth >= cards.scrollWidth - 4;
  secao.querySelector(".link-more").hidden = !aberto && !sobra;
}

document.querySelectorAll(".highlights").forEach(secao => {
  const cards = secao.querySelector(".cards");
  const verTodos = secao.querySelector(".link-more");
  verTodos.addEventListener("click", () => {
    const abrir = !cards.classList.contains("cards--all");
    cards.classList.toggle("cards--all", abrir);
    cards.scrollLeft = 0;
    verTodos.setAttribute("aria-expanded", abrir);
    verTodos.firstChild.textContent = abrir ? "Ver menos " : "Ver todos ";
    if (!abrir) secao.scrollIntoView({ behavior: "smooth" });
    atualizarCarrossel(secao);
  });
  secao.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cards.scrollBy({ left: btn.dataset.dir * cards.clientWidth * 0.9, behavior: "smooth" });
    });
  });
  cards.addEventListener("scroll", () => atualizarCarrossel(secao), { passive: true });
});
window.addEventListener("resize", () => {
  document.querySelectorAll(".highlights").forEach(atualizarCarrossel);
});

// Seletor Comprar / Investir
function mudarModo(novo) {
  modo = novo;
  document.querySelectorAll(".segmented__opt").forEach(b => {
    const ativo = b.dataset.mode === novo;
    b.classList.toggle("is-active", ativo);
    b.setAttribute("aria-selected", ativo);
  });
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

// Alterna o texto de fundo a cada 3 s (para quando a pessoa clica na busca)
let exemplo = 0;
setInterval(() => {
  if (document.activeElement === $q || $q.value) return;
  exemplo = (exemplo + 1) % EXEMPLOS.length;
  $q.placeholder = EXEMPLOS[exemplo];
}, 3000);

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

// Favoritos (o mesmo imóvel pode estar em mais de um carrossel: marca todos)
document.querySelector("main").addEventListener("click", e => {
  const btn = e.target.closest(".fav");
  if (!btn) return;
  const id = btn.dataset.id;
  favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
  document.querySelectorAll(`.fav[data-id="${CSS.escape(id)}"]`).forEach(b => {
    b.classList.toggle("is-on", favoritos.has(id));
    b.setAttribute("aria-pressed", favoritos.has(id));
  });
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
renderCategorias();
