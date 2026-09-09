import dayjs from 'dayjs';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { focusTimeModel } from '../models/focus-time.model';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message.util';

export class FocusTimeController {
  store = async (request: Request, response: Response) => {
    // coerce.date() em vez de date(): o que chega no body é JSON, onde data
    // só existe como string. O coerce converte a string em Date antes de
    // validar — sem ele, todo POST cairia no 422.
    const schema = z.object({
      timeFrom: z.coerce.date(),
      timeTo: z.coerce.date(),
    });

    const focusTime = schema.safeParse(request.body);

    if (!focusTime.success) {
      const errors = buildValidationErrorMessage(focusTime.error.issues);

      return response.status(422).json({ message: errors });
    }

    // Daqui para baixo não precisa de ?. em focusTime.data: o return acima
    // encerra o caso de falha, então o TypeScript já estreitou o tipo e sabe
    // que success é true e data existe.
    const timeFrom = dayjs(focusTime.data.timeFrom);
    const timeTo = dayjs(focusTime.data.timeTo);

    const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom);

    if (isTimeToBeforeTimeFrom) {
      return response
        .status(400)
        .json({ message: 'timeTo cannot be in the past.' });
    }

    const createdFocusTime = await focusTimeModel.create({
      timeFrom: timeFrom.toDate(),
      timeTo: timeTo.toDate(),
    });

    return response.status(201).json(createdFocusTime);
  };
}
