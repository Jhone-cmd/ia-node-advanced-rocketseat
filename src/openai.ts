import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import z from 'zod';
import { produtosEmEstoque, produtosEmFalta } from './db.ts';
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
