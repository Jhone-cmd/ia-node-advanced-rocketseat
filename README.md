**IA Node Fundamentals (Rocketseat)**

- **Descrição**: Projeto de demonstração sobre fundamentos de integração com modelos de linguagem em Node.js. Foi criado enquanto eu assistia às videoaulas da plataforma RocketSeat como material de estudo e prática.

**Funcionalidades**
- **Geração de texto**: Integração com a API `openai` para gerar respostas e completions.
- **Validação**: Uso de `zod` para validação de entradas e do formato das respostas.
- **Servidor HTTP**: API simples construída com `express` para expor endpoints que consomem o serviço de IA.
- **Estrutura modular**: Código separado em arquivos para inicialização do servidor, integração com OpenAI e validação de ambiente.

**Principais bibliotecas**
- **`openai`**: Cliente oficial da OpenAI para chamadas à API.
- **`express`**: Framework web para criar rotas e endpoints HTTP.
- **`zod`**: Validação e parsing de schemas.
- **`typescript`**: Tipagem estática e desenvolvimento com TS.

**Estrutura de pastas**
- **`src/`**: Código-fonte em TypeScript.
  - **`app.ts`**: Configuração e inicialização do app/Express.
  - **`server.ts`**: Ponto de entrada para rodar o servidor (script `dev`).
  - **`openai.ts`**: Lógica de integração com a API OpenAI e funções de geração.
  - **`db.ts`**: (se presente) abstração para persistência (se aplicável).
  - **`env/`**: Configuração de variáveis de ambiente e schema (usando `zod`).
    - **`schema.ts`**: Define as variáveis esperadas (ex.: `PORT`, `API_KEY`).

**Arquivo(s) importantes**
- **`package.json`**: Scripts e dependências do projeto.
- **`tsconfig.json`**: Configuração do TypeScript.
- **`biome.jsonc`**: Configuração de lint/format (dev tooling).

**Variáveis de ambiente**
- **`PORT`**: Porta onde o servidor irá rodar (padrão `3000`).
- **`API_KEY`**: Chave da API da OpenAI (obrigatória).

**Como rodar localmente**

1. Instalar dependências:

```bash
pnpm install
```

2. Criar um arquivo `.env` com as variáveis necessárias (exemplo):

```env
PORT=3000
API_KEY=your_openai_api_key_here
```

3. Rodar em modo de desenvolvimento:

```bash
pnpm run dev
```

Observação: o script `dev` usa `node --watch` sobre `src/server.ts` para recarregar automaticamente.

**Notas sobre desenvolvimento**
- O projeto foi feito como exercício prático assistindo as videoaulas da plataforma RocketSeat. O objetivo principal é demonstrar integrações básicas com APIs de IA, validação de schemas com `zod` e estruturação de um projeto Node+TS.
- Se desejar adicionar persistência, estude conectar um DB em `src/db.ts` ou adicionar um ORM/driver.

**Próximos passos sugeridos**
- Adicionar testes unitários e de integração.
- Criar um endpoint de exemplo no `src/app.ts` que demonstre a validação completa do fluxo (entrada -> validação -> chamada OpenAI -> validação da resposta -> retorno ao cliente).
- Automatizar lint/format e adicionar GitHub Actions para CI.

**Licença**
- Projeto de estudo — sem licença específica definida.

