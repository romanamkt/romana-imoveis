# Romana Imóveis

Site da Romana Imóveis — *Toda história merece um Lar.*

Site estático (HTML, CSS e JavaScript puro), publicado pelo GitHub Pages.

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Página inicial (hero, busca, destaques) |
| `imovel.html` | Página de cada imóvel (`imovel.html?id=<id>`) |
| `imoveis.js` | **Lista de imóveis** — é aqui que se cadastra |
| `util.js` | Formatação de preço/área e número do WhatsApp |
| `script.js` / `imovel.js` | Interações de cada página |
| `styles.css` | Visual do site |
| `assets/img/` | Fotos do hero (mobile e desktop) |
| `assets/imoveis/<id>/` | Fotos de cada imóvel (`01.webp` é a capa) |

## Cadastrar um imóvel

1. Crie a pasta `assets/imoveis/<id>/` com as fotos em WebP (`01.webp`, `02.webp`...).
2. Em `imoveis.js`, copie um bloco existente e troque os dados (os campos estão explicados no topo do arquivo).
3. Faça commit e push — o site atualiza sozinho em cerca de 1 minuto.

## WhatsApp

O número fica em `util.js` (`WHATSAPP`) e no botão "Falar com Romana" do `index.html`.
