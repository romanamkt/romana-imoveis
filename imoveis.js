/* ==========================================================
   ROMANA IMÓVEIS — LISTA DE IMÓVEIS
   ----------------------------------------------------------
   Para cadastrar um imóvel novo:
   1. Crie a pasta  assets/imoveis/<id>/  e coloque as fotos
      (01.webp, 02.webp, ...). A primeira é a foto de capa.
   2. Copie um bloco { ... } abaixo, cole no início da lista
      e troque os dados.
   3. Salve. O imóvel aparece na página inicial e ganha
      sua própria página: imovel.html?id=<id>

   Campos:
   id         texto sem espaços/acentos, único (vira o link)
   modo       "comprar", "investir" ou os dois: ["comprar", "investir"]
   categoria  "casa" | "apartamento" | "rural" | "terreno" | "comercial"
   tipo       ex.: "Sítio", "Casa", "Apartamento"
   titulo     título do anúncio
   cidade     ex.: "Itaverava — MG"
   bairro     opcional
   preco      número, sem pontos (750000 = R$ 750.000)
   precoAPartir  true = mostra "A partir de R$ ..." (lotes, lançamentos)
   area       em m² (210000 = 21 ha; acima de 10.000 m² aparece em hectares)
   areaMax    opcional, para faixa de metragem (area: 300, areaMax: 500 = "300 a 500 m²")
   quartos, banheiros, vagas   opcionais — deixe null se não se aplica
   destaques  lista curta de diferenciais
   descricao  texto do anúncio (pode ter vários parágrafos com \n\n)
   fotos      caminhos das fotos, a primeira é a capa
   tag        etiqueta na foto do card (opcional)
   destaque   true = aparece em "Destaques da semana"
   ========================================================== */

window.IMOVEIS = [
  {
    id: "residencial-lautos",
    modo: ["comprar", "investir"],
    categoria: "terreno",
    tipo: "Lotes em condomínio",
    titulo: "Residencial Lautòs",
    cidade: "Ouro Branco — MG",
    bairro: "",
    preco: 247000,
    precoAPartir: true,
    area: 300,
    areaMax: 500,
    quartos: null,
    banheiros: null,
    vagas: null,
    destaques: [
      "Condomínio fechado", "Portaria", "Piscina", "Quadras", "Academia",
      "Pista de caminhada", "Ruas pavimentadas", "Piso intertravado",
      "Água e esgoto", "Rede elétrica", "Obras avançadas",
    ],
    descricao:
      "Lotes de 300 a 500 m² em condomínio fechado em Ouro Branco — MG, com infraestrutura completa: ruas pavimentadas, piso intertravado, rede de água e esgoto e rede elétrica.\n\n" +
      "Área de lazer com piscina, quadras, academia e pista de caminhada. Obras em estágio avançado.\n\n" +
      "Uma ótima escolha tanto para construir a casa da família quanto para investir.",
    fotos: [
      "assets/imoveis/residencial-lautos/01.webp", // portaria
      "assets/imoveis/residencial-lautos/02.webp", // piscina e deck
    ],
    tag: "Obras avançadas",
    destaque: true,
  },
  {
    id: "sitio-itaverava",
    modo: "comprar",
    categoria: "rural",
    tipo: "Sítio",
    titulo: "Sítio com casa e olhos d'água",
    cidade: "Itaverava — MG",
    bairro: "",
    preco: 750000,
    area: 210000,
    quartos: null,
    banheiros: null,
    vagas: null,
    destaques: ["21 hectares", "Casa sede", "Olhos d'água"],
    descricao:
      "Sítio de 21 hectares (210.000 m²) em Itaverava — MG, com casa sede e olhos d'água na propriedade.\n\n" +
      "Cercado de verde e com vista para os morros da região, é uma ótima opção para quem busca tranquilidade, produção rural ou lazer em família.",
    fotos: [
      "assets/imoveis/sitio-itaverava/01.webp", // capa: porteira e estrada de acesso
      "assets/imoveis/sitio-itaverava/02.webp", // casa vista de cima
    ],
    tag: "Rural",
    destaque: true,
  },
];
