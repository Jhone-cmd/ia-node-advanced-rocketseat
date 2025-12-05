# IA Node Advanced

Projeto de exemplo que demonstra integração com a API de IA (OpenAI) usando Node.js e TypeScript. Este projeto foi feito assistindo às aulas da plataforma RocketSeat.

## Descrição

Aplicação simples em TypeScript que fornece uma base para trabalhar com a API `openai`, criando rotas e abstrações para enviar prompts, validar dados com `zod` e servir via `express`.

> Observação: este projeto foi desenvolvido acompanhando as aulas da RocketSeat.

## Funcionalidades

- Estrutura mínima em TypeScript para trabalhar com a API OpenAI.
- Endpoints HTTP com `express` (arquivo principal `src/server.ts`).
- Conexão/abstração com OpenAI (`src/openai.ts`).
- Validação de dados com `zod` (`src/env/schema.ts`).
- Exemplo de persistência/DB leve (`src/db.ts`).
- Conteúdo estático de referência em `static/recipes.md`.

## Bibliotecas principais

- `express` — servidor HTTP.
- `openai` — SDK oficial para integração com OpenAI.
- `zod` — validação e schemas.

Dependências de desenvolvimento:

- `typescript`, `@types/node`, `@types/express` — tipagem e build.
- `ultracite`, `@biomejs/biome` — ferramentas de desenvolvimento/configuração.

As versões exatas estão no `package.json` do projeto.

## Estrutura do projeto

Raiz do repositório:

```
biome.jsonc
package.json
pnpm-lock.yaml
tsconfig.json
src/
  app.ts
  db.ts
  openai.ts
  server.ts
  env/
    schema.ts
static/
  recipes.md
```

Descrição das pastas e arquivos principais:

- `src/` : código-fonte em TypeScript.
  - `server.ts` : ponto de entrada / configuração do servidor `express`.
  - `app.ts` : inicialização e configuração de middlewares (se presente).
  - `openai.ts` : lógica de integração com a API OpenAI.
  - `db.ts` : abstração simples de persistência (exemplo/local).
  - `env/schema.ts` : schemas de validação das variáveis de ambiente com `zod`.
- `static/` : arquivos estáticos / exemplos (ex.: `recipes.md`).

## Como rodar

1. Instale as dependências (usa `pnpm` conforme `package.json`):

```bash
pnpm install
```

2. Crie um arquivo `.env` na raiz com as variáveis necessárias (ex.: chave da OpenAI). O projeto usa um schema em `src/env/schema.ts` para validar o `.env`.

3. Rode em modo de desenvolvimento:

```bash
pnpm run dev
```

O script `dev` está definido em `package.json` e inicia o `node` apontando para `src/server.ts` com watch.

## Observações

- Ajuste e adicione rotas conforme necessário em `src/server.ts`.
- Verifique a versão do Node.js compatível com as dependências do projeto.
- Este repositório serve como base/estudo; adapte para produção segundo boas práticas (variáveis de ambiente seguras, logs, testes, etc.).

## Créditos

Projeto desenvolvido acompanhando as aulas da RocketSeat.
