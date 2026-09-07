import { Router } from 'express';

// O Router é um "mini-app" do Express: dá pra registrar rotas nele e depois
// plugar tudo de uma vez no app principal. É o índice das rotas da API.
export const routes = Router();

// GET / — health-check.
// Não toca em banco nem em autenticação de propósito: se essa rota responde,
// significa que o Express subiu e está aceitando requisições. Nada além disso.
// O "_" na frente de _request avisa (ao linter e a quem lê) que esse parâmetro
// não é usado de propósito. Não dá pra apagar: no Express o response só existe
// como SEGUNDO parâmetro, então o primeiro tem que estar lá ocupando a posição.
routes.get('/', (_request, response) => {
  return response.status(200).json({
    status: 'ok',
    message: 'Elite Tracker API',
  });
});
