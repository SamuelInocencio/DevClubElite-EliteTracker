import type { Request, Response } from 'express';

import { habitModel } from '../models/habit.model';

export class HabitsController {
  // Repara: 'store' é uma arrow function guardada numa propriedade,
  // não um método normal. Isso é de propósito e importa.
  store = async (request: Request, response: Response): Promise<Response> => {
    const { name } = request.body;

    // Sem passar o array de datas: o Mongoose ja inicializa campos de array
    // como [] sozinho. Passar explicitamente seria redundante — e o nome teria
    // que ser isCompleted, que e como o campo se chama no model.
    const newHabit = await habitModel.create({ name });

    return response.status(201).json(newHabit);
  };
}
