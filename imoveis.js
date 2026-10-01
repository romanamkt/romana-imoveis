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
   areaAPartir   true = mostra "A partir de 400 m²" (lotes com tamanhos variados)
   quartos, banheiros, vagas   opcionais — deixe null se não se aplica
   destaques  lista curta de diferenciais
   descricao  texto do anúncio (pode ter vários parágrafos com \n\n)
   fotos      caminhos das fotos, a primeira é a capa
   tag        etiqueta na foto do card (opcional)
   destaque   true = aparece em "Destaques da semana"
   ========================================================== */

window.IMOVEIS = [
  {
    id: "lote-entre-rios",
    modo: ["comprar", "investir"],
    categoria: "terreno",
    tipo: "Lote",
    titulo: "Lote plano no Condomínio Liberdade",
    cidade: "Entre Rios de Minas — MG",
    bairro: "Condomínio Liberdade",
    preco: 150000,
    area: 306,
    quartos: null,
    banheiros: null,
    vagas: null,
    destaques: ["Lote plano", "Murado em duas laterais", "Bem localizado"],
    descricao:
      "Excelente lote plano de 306 m², bem localizado no Condomínio Liberdade, em Entre Rios de Minas — MG.\n\n" +
      "Já é murado em duas laterais, pronto para você construir a casa da família ou investir.",
    fotos: [
      "assets/imoveis/lote-entre-rios/01.webp", // capa: lote e muro lateral
      "assets/imoveis/lote-entre-rios/02.webp", // vista do fundo do lote
    ],
    tag: "Lote plano",
    destaque: true,
  },
  {
    id: "casa-siderurgia",
    modo: "comprar",
    categoria: "casa",
    tipo: "Casa",
    titulo: "Casa com vista para a serra",
    cidade: "Ouro Branco — MG",
    bairro: "Siderurgia",
    preco: 577000,
    area: 300,
    quartos: 3,
    banheiros: 1,
    vagas: null,
    destaques: [
      "Lote de 300 m²", "90 m² construídos", "Garagem coberta",
      "Área com churrasqueira", "Vista para a serra", "Aceita financiamento",
    ],
    descricao:
      "Casa de 3 quartos no bairro Siderurgia, em Ouro Branco — MG, em ótima localização. São 90 m² de área construída em um lote de 300 m².\n\n" +
      "Tem garagem coberta, área com churrasqueira nos fundos, piso porcelanato nos ambientes internos e uma bela vista para a serra.\n\n" +
      "Pode ser financiada.",
    fotos: [
      "assets/imoveis/casa-siderurgia/01.webp", // capa: casa e garagem
      "assets/imoveis/casa-siderurgia/02.webp", // fachada
      "assets/imoveis/casa-siderurgia/03.webp", // portão da rua
      "assets/imoveis/casa-siderurgia/04.webp", // sala
      "assets/imoveis/casa-siderurgia/05.webp", // quarto com vista
      "assets/imoveis/casa-siderurgia/06.webp", // banheiro
      "assets/imoveis/casa-siderurgia/07.webp", // área com churrasqueira
      "assets/imoveis/casa-siderurgia/08.webp", // vista para a serra
    ],
    tag: "Aceita financiamento",
    destaque: true,
  },
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
    area: 400,
    areaAPartir: true,
    quartos: null,
    banheiros: null,
    vagas: null,
    destaques: [
      "Condomínio fechado", "Portaria", "Piscina", "Quadras", "Academia",
      "Pista de caminhada", "Ruas pavimentadas", "Piso intertravado",
      "Água e esgoto", "Rede elétrica", "Obras avançadas",
    ],
    descricao:
      "Lotes a partir de 400 m² em condomínio fechado em Ouro Branco — MG, com infraestrutura completa: ruas pavimentadas, piso intertravado, rede de água e esgoto e rede elétrica.\n\n" +
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
