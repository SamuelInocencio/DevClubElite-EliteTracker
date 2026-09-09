import dayjs from 'dayjs';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { habitModel } from '../models/habit.model';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message.util';

export class HabitsController {
  // Repara: 'store' é uma arrow function guardada numa propriedade,
  // não um método normal. Isso é de propósito e importa: na rota o método é
  // PASSADO por referência (habitsController.store), e aí um método normal
  // perderia o 'this'. Arrow function captura o 'this' da instância.
  store = async (request: Request, response: Response): Promise<Response> => {
    const schema = z.object({ name: z.string() });

    // Passa o body inteiro para o schema: é ele quem decide o que é válido,
    // em vez de a gente escolher os campos na mão antes de validar.
    // safeParse não lança exceção — devolve { success, data | error } —,
    // por isso dá para tratar o erro com if, sem try/catch.
    const habit = schema.safeParse(request.body);

    if (!habit.success) {
      const errors = buildValidationErrorMessage(habit.error.issues);

      return response.status(422).json({ message: errors });
    }

    // Daqui para baixo usa-se habit.data.name, não o body cru: é o valor que
    // passou pelo schema, e o TypeScript já sabe que é string.
    const findHabit = await habitModel.findOne({ name: habit.data.name });

    // RN: nome de hábito é único. Checa antes de criar para devolver 400
    // em vez de deixar o banco guardar duplicado.
    if (findHabit) {
      return response.status(400).json({ message: 'Habit already exists.' });
    }

    const newHabit = await habitModel.create({
      name: habit.data.name,
      completedDates: [],
    });

    return response.status(201).json(newHabit);
  };

  // Lista todos os hábitos. Sem filtro por enquanto — quando entrar a
  // autenticação, esta query passa a filtrar por userId vindo do TOKEN.
  index = async (_request: Request, response: Response): Promise<Response> => {
    // sort({ name: 1 }) → ordem crescente por nome (o -1 seria decrescente).
    const habits = await habitModel.find().sort({ name: 1 });

    return response.status(200).json(habits);
  };

  // Exclui um hábito pelo id que vem na URL (/habits/:id).
  remove = async (request: Request, response: Response): Promise<Response> => {
    // Aqui o schema valida request.params, não o body: o dado suspeito
    // desta rota é o :id da URL.
    // O regex exige o formato de ObjectId do Mongo (24 dígitos hexadecimais).
    // Sem ele, um id malformado ('abc') faria o Mongoose lançar CastError na
    // query abaixo e a resposta viraria 500 em vez do 404 que queremos.
    const schema = z.object({ id: z.string().regex(/^[0-9a-f]{24}$/i) });

    const habit = schema.safeParse(request.params);

    if (!habit.success) {
      const errors = buildValidationErrorMessage(habit.error.issues);

      return response.status(422).json({ message: errors });
    }

    // Confirma que o hábito existe antes de tentar apagar. Sem isso,
    // deleteOne num id inexistente não reclama e a rota devolveria 204,
    // dizendo que apagou algo que nunca existiu.
    const findHabit = await habitModel.findOne({ _id: habit.data.id });

    if (!findHabit) {
      return response.status(404).json({ message: 'Habit not found.' });
    }

    await habitModel.deleteOne({ _id: habit.data.id });

    // 204 = "deu certo, e não tenho corpo de resposta para te devolver".
    // Por isso é .send() e não .json(): 204 não pode ter corpo.
    return response.status(204).send();
  };

  // Marca/desmarca o hábito como concluído no dia (PATCH /habits/:id/toggle).
  // PARCIAL: por enquanto só valida, confirma que o hábito existe e devolve a
  // data de hoje. A alternância em si (comparar com completedDates e gravar)
  // ainda não foi feita.
  toggle = async (request: Request, response: Response) => {
    const schema = z.object({
      id: z.string(),
    });

    const validated = schema.safeParse(request.params);

    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return response.status(422).json({ message: errors });
    }

    const findHabit = await habitModel.findOne({
      _id: validated.data.id,
    });

    if (!findHabit) {
      return response.status(404).json({ message: 'Habit not found.' });
    }

    // startOf('day') zera hora/minuto/segundo: sobra só a data, que é a
    // unidade que interessa para "concluí este hábito hoje".
    // toISOString() padroniza o formato dos dois lados da comparação abaixo.
    const now = dayjs().startOf('day').toISOString();

    // Procura o dia de hoje dentro das datas já marcadas. Cada item vem do
    // banco como Date, então passa pelo dayjs para virar a mesma string.
    const isHabitCompletedOnDate = findHabit
      .toObject()
      ?.completedDates.find(
        (item) => dayjs(String(item)).toISOString() === now,
      );

    // Já estava marcado hoje → desmarca ($pull remove o valor do array).
    if (isHabitCompletedOnDate) {
      const habitUpdated = await habitModel.findOneAndUpdate(
        {
          _id: validated.data.id,
        },
        {
          $pull: {
            completedDates: now,
          },
        },
        {
          // Sem isto o Mongoose devolveria o documento ANTES do update.
          returnDocument: 'after',
        },
      );

      return response.status(200).json(habitUpdated);
    }

    // Não estava marcado → marca ($push adiciona a data ao array).
    const habitUpdated = await habitModel.findOneAndUpdate(
      {
        _id: validated.data.id,
      },
      {
        $push: {
          completedDates: now,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    return response.status(200).json(habitUpdated);
  };
}
