import { type ZodIssue } from 'zod';

/**
 * Transforma a lista de problemas que o Zod devolve em mensagens legíveis.
 *
 * 'path' é o caminho até o campo que falhou. Vem como array porque o schema
 * pode ser aninhado: ['user', 'email'] → "user.email". Num campo raiz o array
 * tem um elemento só, e o join('.') não muda nada — mas o dia que o schema
 * crescer, isto aqui já está pronto.
 *
 * Nota: no Zod 4 o tipo ZodIssue está deprecado em favor de z.core.$ZodIssue
 * (é o mesmo tipo, só mudou de lugar). Funciona, mas o editor risca o nome.
 */
export function buildValidationErrorMessage(issues: ZodIssue[]): string[] {
  return issues.map((item) => `${item.path.join('.')}: ${item.message}`);
}
