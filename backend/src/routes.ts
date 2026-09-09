import { Router } from 'express';
import packageJson from '../package.json';
import { FocusTimeController } from './controllers/focus-time.controller';
import { HabitsController } from './controllers/habits.controller';

export const routes = Router();

const habitsController = new HabitsController();
const focusTimeController = new FocusTimeController();

routes.get('/', (_request, response) => {
  const { name, description, version } = packageJson;

  return response.status(200).json({ name, description, version });
});

routes.get('/habits', habitsController.index);
routes.post('/habits', habitsController.store);
routes.delete('/habits/:id', habitsController.remove);
routes.patch('/habits/:id/toggle', habitsController.toggle);

routes.post('/focus-times', focusTimeController.store);

/**
 * M (Model) → Responsável por se comunicar com o banco;
 * V (View) → Mostrar isso para o usuário (React);
 * C (Controller) → Controla a requisição, chama a Model, define RN's e faz o (...)
 */
