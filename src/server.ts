import { app } from './app.ts';
import { env } from './env/schema.ts';

app.listen(env.PORT, () => {
  console.log('Server is running on port 3000. 🚀');
});
