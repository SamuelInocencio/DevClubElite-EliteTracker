import 'dotenv/config'; // SEMPRE a primeira linha: popula process.env antes dos outros imports

import cors from 'cors';
import express from 'express';

import { setupMongo } from './database';
import { routes } from './routes'; // confirme o caminho real do seu arquivo de rotas

const app = express();

// Fallback pro 4000 caso PORT não esteja definida. O ?? só cai no 4000
// se PORT for null/undefined — diferente do || que cairia também com "" ou 0.
const PORT = process.env.PORT ?? 4000;

setupMongo()
  .then(() => {
    // Libera o front (que roda em outra porta) a chamar esta API. Sem isto o
    // navegador bloqueia toda requisição vinda do :5173.
    app.use(cors());
    app.use(express.json());
    app.use(routes);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at port ${PORT}!`);
    });
  })
  .catch((err) => {
    // Agora usamos o err (some o warning) e derrubamos o processo de propósito
    console.error('❌ Failed to start the server:', err);
    process.exit(1);
  });
