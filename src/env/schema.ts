import z from 'zod';

const zodSchema = z.object({
  PORT: z.coerce.number().default(3000),
  API_KEY: z.string(),
});

export const env = zodSchema.parse(process.env);
