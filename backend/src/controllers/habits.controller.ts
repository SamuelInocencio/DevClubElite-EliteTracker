import type { Request, Response } from 'express';

export class HabitsController {
  // A aula usa any[]. Trocado por { name: string }[] porque é exatamente o que
  // o store guarda — e "any" desliga a checagem de tipos justo onde o dado vem
  // de fora. Isto some quando o Mongoose entrar e os hábitos forem pro banco.
  private readonly habits: { name: string }[] = [];

  store = (request: Request, response: Response): Response => {
    const { name } = request.body;

    const newHabit = { name };

    this.habits.push(newHabit);

    return response.status(201).json(newHabit);
  };
}
