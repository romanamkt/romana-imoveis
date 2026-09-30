// Romana Imóveis — página de detalhes (imovel.html?id=...)

const $pd = document.getElementById("pd");
const id = new URLSearchParams(location.search).get("id");
const imovel = IMOVEIS.find(i => i.id === id);

document.getElementById("year").textContent = new Date().getFullYear();

if (!imovel) {
  $pd.innerHTML = `
    <section class="pd-missing">
      <h1>Imóvel não encontrado</h1>
      <p>Ele pode ter sido vendido ou o link está incorreto.</p>
      <a class="btn-zap" href="${linkWhatsApp("Olá, Romana! Gostaria de saber sobre imóveis disponíveis.")}" target="_blank" rel="noopener">
        <svg><use href="#i-whatsapp"/></svg>Falar com Romana
      </a>
    </section>`;
} else {
  renderImovel(imovel);
}

function renderImovel(i) {
  const local = [i.bairro, i.cidade].filter(Boolean).join(", ");
  const preco = brl.format(i.preco);
  const precoTexto = precoDoImovel(i); // com "A partir de" quando for o caso
  const finalidade = temModo(i, "comprar") && temModo(i, "investir")
    ? "Para morar ou investir"
    : temModo(i, "investir") ? "Para investir" : "À venda";

  document.title = `${i.titulo} — ${i.cidade} | Romana Imóveis`;
  document.querySelector('meta[name="description"]')
    .setAttribute("content", `${i.titulo} em ${local} — ${precoTexto.toLowerCase()}. ${i.descricao.split("\n")[0]}`);

  // Link da página só entra na mensagem quando o site estiver publicado (http/https)
  const url = location.protocol.startsWith("http") ? `\n${location.href}` : "";
  const zap = linkWhatsApp(`Olá, Romana! Tenho interesse no imóvel "${i.titulo}" (${i.cidade}) — ${precoTexto.toLowerCase()}.${url}`);

  const specs = especificacoes(i, 6)
    .map(s => `<li><svg><use href="#${s.icone}"/></svg>${escapar(s.texto)}</li>`).join("");

  const destaques = (i.destaques || [])
    .map(d => `<li><svg><use href="#i-check"/></svg>${escapar(d)}</li>`).join("");

  const paragrafos = i.descricao.split(/\n\s*\n/)
    .map(p => `<p>${escapar(p)}</p>`).join("");

  const thumbs = i.fotos.length > 1
    ? `<div class="pd-thumbs">${i.fotos.map((f, n) => `
        <button class="pd-thumb${n === 0 ? " is-active" : ""}" data-n="${n}" aria-label="Ver foto ${n + 1}">
          <img src="${f}" alt="" loading="lazy" />
        </button>`).join("")}</div>`
    : "";

  $pd.innerHTML = `
    <section class="pd-gallery" aria-label="Fotos do imóvel">
      <div class="pd-main">
        <div class="pd-track" id="pd-track">
          ${i.fotos.map((f, n) => `
            <img class="pd-slide" src="${f}" alt="${escapar(i.titulo)} — foto ${n + 1}" ${n ? 'loading="lazy"' : ""} />`).join("")}
        </div>
        ${i.fotos.length > 1 ? `
          <button class="pd-nav pd-nav--prev" aria-label="Foto anterior"><svg><use href="#i-back"/></svg></button>
          <button class="pd-nav pd-nav--next" aria-label="Próxima foto"><svg><use href="#i-back"/></svg></button>
          <span class="pd-count"><span id="pd-n">1</span> / ${i.fotos.length}</span>` : ""}
      </div>
      ${thumbs}
    </section>

    <div class="pd-grid">
      <article class="pd-info">
        <p class="pd-eyebrow">${escapar(i.tipo)} · ${finalidade}</p>
        <h1 class="pd-title">${escapar(i.titulo)}</h1>
        <p class="pd-loc"><svg><use href="#i-pin"/></svg>${escapar(local)}</p>

        ${specs ? `<ul class="pd-specs">${specs}</ul>` : ""}

        <h2 class="pd-h2">Sobre o imóvel</h2>
        <div class="pd-desc">${paragrafos}</div>

        ${destaques ? `<h2 class="pd-h2">Destaques</h2><ul class="pd-list">${destaques}</ul>` : ""}
      </article>

      <aside class="pd-aside">
        <div class="pd-card">
          <p class="pd-card__label">${i.precoAPartir ? "A partir de" : "Valor"}</p>
          <p class="pd-card__price">${preco}</p>
          ${i.area ? `<p class="pd-card__sub">${i.area >= 10000 && !i.areaMax
            ? `${formatarArea(i.area)} · ${num.format(i.area)} m²`
            : i.areaAPartir ? `Lotes a partir de ${formatarArea(i.area)}`
            : `${i.areaMax ? "Lotes de " : ""}${areaDoImovel(i)}`}</p>` : ""}
          <a class="btn-zap pd-card__cta" href="${zap}" target="_blank" rel="noopener">
            <svg><use href="#i-whatsapp"/></svg>Tenho interesse
          </a>
          <button class="pd-share" type="button"><svg><use href="#i-share"/></svg><span>Compartilhar</span></button>
          <p class="pd-card__note">Atendimento direto com a Romana pelo WhatsApp.</p>
        </div>
      </aside>
    </div>

    <!-- Barra fixa no celular -->
    <div class="pd-bar">
      <div>
        <p class="pd-bar__price">${i.precoAPartir ? `<small>a partir de</small> ` : ""}${preco}</p>
        <p class="pd-bar__loc">${escapar(i.cidade)}</p>
      </div>
      <a class="btn-zap" href="${zap}" target="_blank" rel="noopener"><svg><use href="#i-whatsapp"/></svg>Tenho interesse</a>
    </div>`;

  // Carrossel: arrastar (scroll-snap), setas e miniaturas ficam sincronizados
  const $track = document.getElementById("pd-track");
  const total = i.fotos.length;
  const atual = () => Math.round($track.scrollLeft / $track.clientWidth);
  const irPara = n => {
    const alvo = (n + total) % total; // volta ao início depois da última
    $track.scrollTo({ left: alvo * $track.clientWidth, behavior: "smooth" });
  };

  if (total > 1) {
    document.querySelector(".pd-nav--prev").addEventListener("click", () => irPara(atual() - 1));
    document.querySelector(".pd-nav--next").addEventListener("click", () => irPara(atual() + 1));
    document.querySelectorAll(".pd-thumb").forEach(b =>
      b.addEventListener("click", () => irPara(Number(b.dataset.n))));

    let pendente;
    $track.addEventListener("scroll", () => {
      cancelAnimationFrame(pendente);
      pendente = requestAnimationFrame(() => {
        const n = atual();
        document.getElementById("pd-n").textContent = n + 1;
        document.querySelectorAll(".pd-thumb").forEach(t =>
          t.classList.toggle("is-active", Number(t.dataset.n) === n));
      });
    });

    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") irPara(atual() - 1);
      if (e.key === "ArrowRight") irPara(atual() + 1);
    });
  }

  // Compartilhar: menu nativo no celular, senão copia o link
  const $share = document.querySelector(".pd-share");
  $share.addEventListener("click", async () => {
    const dados = { title: i.titulo, text: `${i.titulo} — ${precoTexto}`, url: location.href };
    try {
      if (navigator.share) { await navigator.share(dados); return; }
      await navigator.clipboard.writeText(location.href);
      $share.querySelector("span").textContent = "Link copiado!";
      setTimeout(() => { $share.querySelector("span").textContent = "Compartilhar"; }, 2000);
    } catch {}
  });
}
