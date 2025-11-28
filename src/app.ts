import express from 'express';
import { todosProdutos } from './db.ts';
import {
  embedProdutos,
  generateEmbedding,
  generateProducts,
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
    const input = req.body.input;
    await generateEmbedding(input);
    res.status(200).json('Embedding generated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
    return;
  }
});
