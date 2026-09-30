// Romana Imóveis — funções compartilhadas entre as páginas

const WHATSAPP = "5531972660650"; // 55 (Brasil) + 31 + número

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

// Áreas grandes (sítios, fazendas) aparecem em hectares
function formatarArea(m2) {
  if (!m2) return "";
  return m2 >= 10000 ? `${num.format(m2 / 10000)} ha` : `${num.format(m2)} m²`;
}

// Área do imóvel, com faixa quando houver areaMax (ex.: "300 a 500 m²")
function areaDoImovel(i) {
  if (!i.area) return "";
  if (i.areaAPartir) return `A partir de ${formatarArea(i.area)}`;
  if (!i.areaMax) return formatarArea(i.area);
  const [ini, fim] = [formatarArea(i.area), formatarArea(i.areaMax)];
  const unidade = fim.split(" ").pop();
  return ini.endsWith(unidade) ? `${ini.replace(` ${unidade}`, "")} a ${fim}` : `${ini} a ${fim}`;
}

// Um imóvel pode estar em "comprar", "investir" ou nos dois
function temModo(i, modo) {
  return [].concat(i.modo).includes(modo);
}

function precoDoImovel(i) {
  return (i.precoAPartir ? "A partir de " : "") + brl.format(i.preco);
}

function linkWhatsApp(mensagem) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

function plural(n, um, varios) {
  return `${n} ${n === 1 ? um : varios}`;
}

// Itens de ficha técnica: usa quartos/banheiros/vagas quando existem,
// senão completa com os destaques do imóvel (ex.: sítios)
function especificacoes(i, limite = 3) {
  const itens = [];
  if (i.area) itens.push({ icone: "i-area", texto: areaDoImovel(i) });
  if (i.quartos) itens.push({ icone: "i-bed", texto: plural(i.quartos, "quarto", "quartos") });
  if (i.banheiros) itens.push({ icone: "i-bath", texto: plural(i.banheiros, "banh.", "banhs.") });
  if (i.vagas) itens.push({ icone: "i-car", texto: plural(i.vagas, "vaga", "vagas") });
  for (const d of i.destaques || []) {
    if (itens.length >= limite) break;
    if (i.area && /hectare|m²|\bha\b/i.test(d)) continue; // área já aparece acima
    itens.push({ icone: "i-check", texto: d });
  }
  return itens.slice(0, limite);
}

function escapar(s) {
  const el = document.createElement("span");
  el.textContent = s ?? "";
  return el.innerHTML;
}
