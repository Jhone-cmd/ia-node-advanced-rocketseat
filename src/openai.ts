import type { ReadStream } from 'node:fs';
import OpenAI from 'openai';
import { zodResponseFormat, zodTextFormat } from 'openai/helpers/zod';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import type { ResponseCreateParamsNonStreaming } from 'openai/resources/responses/responses.mjs';
import z from 'zod';
import {
  produtosEmEstoque,
  produtosEmFalta,
  setarEmbeddingProduto,
  todosProdutos,
} from './db.ts';
import { env } from './env/schema.ts';

const client = new OpenAI({
  apiKey: env.API_KEY,
});

const schemaProducts = z.object({
  products: z.array(z.string()),
});

const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'produtos_em_estoque',
      description: 'Lista os produtos que estão em estoque.',
      parameters: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: 'function',
    function: {
      name: 'produtos_em_falta',
      description: 'Lista os produtos que estão em falta.',
      parameters: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

async function generateCompletion(
  messages: ChatCompletionMessageParam[],
  format: any
) {
  const completion = await client.chat.completions.parse({
    model: 'gpt-4o-mini',
    max_tokens: 100,
    response_format: format,
    tools,
    messages,
  });

  if (completion.choices[0].message.refusal) {
    throw new Error('Refusal');
  }

  const { tool_calls } = completion.choices[0].message;
  if (tool_calls) {
    const [tool_call] = tool_calls;
    const toolsMap = {
      produtos_em_estoque: produtosEmEstoque,
      produtos_em_falta: produtosEmFalta,
    };
    const functionToCall = toolsMap[tool_call.function.name];
    if (!functionToCall) {
      throw new Error('Function not found');
    }
    const result = functionToCall(tool_call.function.arguments);
    messages.push(completion.choices[0].message);
    messages.push({
      role: 'tool',
      tool_call_id: tool_call.id,
      content: result.toString(),
    });
    const completionWithToolResult: any = await generateCompletion(
      messages,
      zodResponseFormat(schemaProducts, 'produtos_schema')
    );
    return completionWithToolResult;
  }
  return completion;
}

export async function generateProducts(message: string) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'developer',
      content: `
          - Liste no máximo 3 produtos que atendam a necessidade do usuário.
          - Considere apenas os produtos disponíveis em estoque.
          - Responda em JSON no formato { products: string[] }`,
    },
    {
      role: 'user',
      content: message,
    },
  ];

  const completion = await generateCompletion(
    messages,
    zodResponseFormat(schemaProducts, 'produtos_schema')
  );

  return completion.choices[0].message.parsed;
}

export async function generateEmbedding(input: string) {
  try {
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return;
  }
}

export async function embedProdutos() {
  const produtos = todosProdutos();
  await Promise.allSettled(
    produtos.map(async (produto, index) => {
      const embedding = await generateEmbedding(
        `${produto.nome}: ${produto.descricao}`
      );

      if (!embedding) {
        return;
      }

      setarEmbeddingProduto(index, embedding);
    })
  );
}

async function generateResponse(params: ResponseCreateParamsNonStreaming) {
  const response = await client.responses.parse(params);

  if (response.output_parsed) {
    return response.output_parsed;
  }

  return null;
}

export async function generateCart(input: string, products: string[]) {
  return generateResponse({
    model: 'gpt-4o-mini',
    instructions: `Retorne uma lista de até 5 produtos que satisfação a necessidade do usuário. Os produtos disponíveis são os seguintes: ${JSON.stringify(products)}`,
    input,
    text: {
      format: zodTextFormat(schemaProducts, 'carrinho'),
    },
  });
}

export async function uploadFile(file: ReadStream) {
  const uploaded = await client.files.create({
    file,
    purpose: 'assistants',
  });

  console.dir(uploaded, { depth: null });
}

export async function createVector() {
  const vectorStore = await client.vectorStores.create({
    name: 'ia-node-search-class',
    file_ids: ['file-as4d5a6sd78wad8456xc'],
  });

  console.dir(vectorStore, { depth: null });
}
