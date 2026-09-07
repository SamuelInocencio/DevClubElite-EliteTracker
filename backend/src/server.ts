// Este import PRECISA vir primeiro: ele lê o arquivo .env e joga as variáveis
// dentro de process.env. Se viesse depois, quem lê process.env acharia vazio.
import 'dotenv/config';

import { app } from './app';

// Tudo que vem do .env chega como string (ou undefined, se a variável não
// existir). Por isso o Number() e o fallback para 4000.
const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
