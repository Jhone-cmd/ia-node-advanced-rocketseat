import express from 'express';
import { generateProducts } from './openai.ts';

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
