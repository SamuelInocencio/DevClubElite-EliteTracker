# Prompt — revisão de enxugamento

Prompt reutilizável para pedir uma revisão de código do Elite Tracker focada em
remover o que não cumpre função. Copie o bloco abaixo inteiro.

Escrito em 2026-09-07, quando o repositório tinha ~145 linhas de código-fonte e
~248 de configuração. Se os números mudarem muito, ajuste o parágrafo do
Objetivo — ele é o que aponta o revisor para o alvo certo.

---

```markdown
Faça uma revisão de ENXUGAMENTO neste monorepo (Elite Tracker, projeto de
estudo do DevClub Elite). Leia o CLAUDE.md antes de qualquer coisa e siga as
regras de trabalho dele.

## Objetivo
Remover tudo que existe no repositório sem cumprir função: sobras de template,
configuração duplicada, dependências não usadas, arquivos órfãos. O projeto tem
hoje ~145 linhas de código-fonte e ~248 de configuração — a gordura está muito
mais na configuração e nas sobras do scaffold do que no código que escrevemos.

## O que É alvo (procure isto)
1. Arquivos que nenhum outro arquivo referencia (assets, ícones, README de
   template, CSS morto).
2. Dependências declaradas em package.json que nada importa.
3. Configuração redundante: opções de tsconfig que já são o padrão da versão
   instalada, regras de .gitignore repetidas, campos de package.json sem uso.
4. Código gerado pelo scaffold que sobreviveu sem propósito.
5. Nomes e metadados errados (title do index.html, description de package.json,
   nome do workspace que não bate com a pasta).

## O que NÃO é alvo (não toque)
- COMENTÁRIOS EXPLICATIVOS. Este é um projeto de estudo; os comentários são
  entregável, não ruído. Não os condense, encurte nem remova — nem os que
  parecerem óbvios para você.
- A stack obrigatória dos RNFs (Express, TS, Mongoose, Zod, React, Vite,
  React Router, Axios, Day.js), mesmo que uma peça ainda não esteja em uso.
- Os .env.example — existem justamente para documentar variáveis.
- Separação server.ts / app.ts / routes.ts: é decisão de arquitetura, não
  duplicação.
- Nada que seja preparação combinada para uma etapa futura.

## Como proceder
1. Faça o inventário primeiro. Para CADA candidato a remoção, mostre:
   - caminho do arquivo (ou linhas)
   - a evidência de que não é usado (o grep que rodou, o resultado)
   - o risco de remover: nenhum / baixo / precisa checar
2. Agrupe em três listas: REMOVER, AJUSTAR e MANTER (com o motivo de manter).
3. NÃO altere nada ainda. Apresente e espere meu OK.
4. Depois do OK, aplique em blocos pequenos, um assunto por vez.

## Portões de verificação (rode depois de CADA bloco)
- `npm run check` na raiz → tem que terminar sem erro e sem aviso
- `cd backend && npx tsc --noEmit` → OK
- `cd frontend && npx tsc -b --noEmit` → OK
- `npm run dev:back` → GET http://localhost:4000/ responde 200
- `npm run dev:front` → http://localhost:5173/ responde 200 e renderiza
Se algum portão falhar, reverta o bloco e me diga o que aconteceu.

## Regra de ouro
Na dúvida entre remover e manter, MANTENHA e me pergunte. Um arquivo morto
custa 5 KB; um arquivo removido por engano custa uma hora de depuração.
```

---

## Por que o prompt é assim

- **"Leia o CLAUDE.md antes"** — sem isso o revisor não sabe que é projeto de
  estudo e otimiza para código enxuto em vez de código didático.
- **A seção "não toque" vem antes do trabalho** — é o que protege os
  comentários. Sem ela, o comentário de 6 linhas que explica o `!` do
  `main.tsx` vira uma linha, ou some.
- **"Mostre a evidência"** — força verificação em vez de palpite: a diferença
  entre "parece não usado" e "rodei `grep -rn 'hero.png' src/ index.html` e
  não retornou nada".
- **Portões após CADA bloco, não no fim** — se algo quebra, você sabe qual
  bloco quebrou.
- **"Na dúvida, mantenha"** — assimetria de custo. Precisa ser explícito,
  porque o instinto de um revisor é remover.

## Alvo conhecido, ainda não decidido

`frontend/` tem três arquivos de tsconfig (`tsconfig.json`, `tsconfig.app.json`,
`tsconfig.node.json`, 56 linhas somadas) contra um único de 41 no backend. É o
padrão do Vite e funciona; dá para simplificar, mas afasta do que o template
espera e o `npm run build` do front pode precisar de ajuste. Decidir antes de
rodar o prompt, senão ele vai levantar isso toda vez.
