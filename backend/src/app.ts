import cors from 'cors';
import express from 'express';

import { routes } from './routes';

// Este arquivo MONTA o Express, mas não liga o servidor.
// Quem chama o .listen() é o server.ts. Separar os dois deixa claro o que é
// "configuração do app" e o que é "ligar a máquina".
export const app = express();

// A ORDEM DOS MIDDLEWARES IMPORTA: eles rodam de cima pra baixo, na sequência
// em que foram registrados. Por isso cors e json vêm ANTES das rotas.

// Libera o navegador a chamar esta API de outra origem (o front roda em outra
// porta). Por enquanto está aberto pra todo mundo; quando o front existir,
// vamos restringir para a origem dele.
app.use(cors());

// Lê o corpo das requisições que chegam como JSON e coloca em request.body.
// Sem isso, request.body vem undefined nos POST/PATCH.
app.use(express.json());

app.use(routes);
