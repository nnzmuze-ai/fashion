# RW — Guarda-roupa & Styling

App web (PWA) para catalogar roupas e acessórios por foto e montar outfits de acordo com estilos pessoais: **Office Goth**, **Rockstar Girlfriend**, **Whimsgoth**, **Western Goth** e uma pegada **Andrógina**.

## Funcionalidades

- **Onboarding** — seleção dos estilos que definem seu guarda-roupa.
- **Guarda-roupa** — catálogo de peças (foto, categoria, cor, estilo(s), estação) com filtros e busca.
- **Nova peça** — cadastro/edição com upload de foto (comprimida no dispositivo).
- **Gerador de outfits** — monta combinações a partir das peças reais do usuário, filtrando por estilo e ocasião, com explicação da combinação.
- **Lookbook** — looks salvos, marcação de uso e histórico.
- **Wishlist & sugestões** — raio-x da distribuição de estilos do guarda-roupa, sugestões de peças que fechariam lacunas entre estilos, e wishlist manual.

Tudo é salvo localmente no dispositivo (IndexedDB via Dexie) — não há backend.

## Stack

- React + TypeScript + Vite
- React Router (`HashRouter`)
- Dexie / IndexedDB para persistência local
- `vite-plugin-pwa` para instalação como app no celular

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```
