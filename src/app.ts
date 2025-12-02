import { createReadStream } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { produtosSimilares, todosProdutos } from './db.ts';
import {
  createEmbeddingBatch,
  createEmbeddingBatchFile,
  createVector,
  embedProdutos,
  generateCart,
  generateEmbedding,
  generateProducts,
  getBatch,
  getBatchFileContent,
  uploadFile,
} from './openai.ts';

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/generate', async (req, res) => {
  try {
    const products = await generateProducts(req.body.message);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
    return;
  }
});

app.post('/process-embedding', async (_, res) => {
  await embedProdutos();
  console.log(todosProdutos());
  res.status(200).json('Embeddings processed successfully');
});

app.post('/embedding', async (req, res) => {
  try {
    const { input } = req.body;
    await generateEmbedding(input);
    res.status(200).json('Embedding generated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
    return;
  }
});

app.post('/cart', async (req, res) => {
  const { message } = req.body;
  const embedding = await generateEmbedding(message);
  if (!embedding) {
    res.status(500).json('Internal Server Error. Failed to generate embedding');
    return;
  }
  const produtos = produtosSimilares(embedding);
  res.status(200).json({
    produtos: produtos.map((produto) => ({
      nome: produto.nome,
      embedding: produto.embedding,
    })),
  });
});

app.post('/response', async (req, res) => {
  const { input } = req.body;

  const cart = await generateCart(
    input,
    todosProdutos().map((product) => product.nome)
  );
  res.status(200).json(cart);
});

app.post('/upload', async (_, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const file = createReadStream(
    path.join(__dirname, '..', 'static', 'recipes.md')
  );
  uploadFile(file);

  res.status(201).end();
});

app.post('/vector-store', async (_, res) => {
  await createVector();
  res.status(201).end();
});

app.post('/embedding-batch', async (_, res) => {
  const file = await createEmbeddingBatchFile(['sorvete', 'alface']);
  const batch = await createEmbeddingBatch(file.id);
  res.status(200).json(batch);
});

app.post('/embedding-batch/results', async (_, res) => {
  const batch = await getBatch('batch-as5d68as9d8afg8d79s564');

  if (batch.status !== 'completed' || !batch.output_file_id) {
    res.status(200).json(batch);
    return;
  }

  // console.log('TODO: process results', batch.output_file_id);
  const file = await getBatchFileContent(batch.output_file_id);

  res.status(200).json(file);
});
