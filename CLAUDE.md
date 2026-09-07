# Elite Tracker (DevClub Elite)

## Sobre este projeto
App de produtividade full-stack (hábitos diários + pomodoro), projeto da
formação DevClub Elite. Este é um projeto de ESTUDO. Meu objetivo é aprender,
não só ter o código pronto.

## COMO VOCÊ DEVE TRABALHAR COMIGO (regras importantes)
- Vá em PASSOS PEQUENOS. Faça uma coisa de cada vez.
- ANTES de criar/editar arquivos, explique o plano e o raciocínio, e ESPERE
  minha confirmação. Não construa a feature inteira sem eu pedir.
- Ao instalar uma dependência, diga em uma linha PARA QUE ela serve.
- Comente no código as partes não óbvias.
- Quando eu escrever algo que vai dar problema depois, me avise na hora.
- Ao terminar uma etapa, proponha a próxima — mas não comece sozinho.

## Stack (RNFs — obrigatória)
- Back: Node + Express + TypeScript, MongoDB (Mongoose), Zod para validação.
- Front: React + Vite + TypeScript, CSS por componente, React Router, Axios, Day.js.
- Auth: GitHub OAuth + JWT.

## Requisitos Funcionais
1. Autenticar com GitHub.  2. Deslogar.
3. Criar hábito.  4. Listar hábitos.  5. Excluir hábito.
6. Marcar/desmarcar hábito concluído no dia.  7. Estatísticas de um hábito.
8. Criar tempo de foco.  9. Criar tempo de descanso.
10. Estatísticas mensais/diárias do tempo de foco.

## Regras de Negócio
- Sessão dura 8h (JWT expiresIn 8h).
- Nome de hábito é único, case-insensitive.
- Toda operação vale só para dados do próprio usuário: TODA query filtra por
  userId vindo do TOKEN, nunca do body/params.

## Design da API
| Método | Rota | Faz |
|---|---|---|
| POST   | /habits                         | Cria hábito |
| GET    | /habits                         | Lista hábitos |
| DELETE | /habits/:id                     | Exclui hábito |
| PATCH  | /habits/:id/toggle              | Marca/desmarca no dia |
| GET    | /habits/:id/metrics?date=       | Estatísticas do hábito |
| POST   | /focus-times                    | Registra tempo de foco concluído |
| GET    | /focus-times/metrics/month?date=| Estatísticas de foco no mês |
| GET    | /focus-times/metrics/day?date=  | Estatísticas de foco no dia |
| POST   | /auth                           | Login com GitHub |

## Design visual (Figma)
- Tema escuro (~#0A1929), destaque azul (~#1E6FFF), vermelho para ação destrutiva.
- Sidebar estreita + duas colunas (conteúdo | estatísticas). Timer circular central.

## Nota sobre o Pomodoro
Pausar/retomar/cancelar é estado do FRONT-END. O back só recebe a sessão quando
ela termina (POST /focus-times), nunca a cada segundo.

## Estrutura — monorepo com npm workspaces
```
DevClub-Elite/
├── package.json      ← workspaces + Biome + scripts. SÓ ferramentas.
├── package-lock.json ← um só, para o repositório inteiro
├── node_modules/     ← quase tudo mora aqui (hoisting)
├── biome.json  .gitignore  .vscode/  CLAUDE.md
├── backend/          ← Express + TS   → porta 4000
└── frontend/         ← React + Vite   → porta 5173
```
`"workspaces": ["backend", "frontend"]` no package.json da raiz. Consequências:
- `npm install` roda UMA vez, na raiz, e instala os dois.
- Dependência nova vai para o workspace certo, nunca na raiz:
  `npm i <pacote> -w backend` / `npm i <pacote> -w frontend`.
- Na raiz, só ferramenta do repositório (hoje: Biome).
- `backend/node_modules` não existe — subiu tudo para a raiz. É normal.
- `frontend/node_modules` tem só o que não pôde subir: o front usa
  TypeScript ~6.0.2 (travado pelo Vite) e o back usa 7.0.2.

## Comandos (rodar sempre da RAIZ)
- Dev back: `npm run dev:back` → http://localhost:4000
- Dev front: `npm run dev:front` → http://localhost:5173
- Build: `npm run build:back` / `npm run build:front`

### Formatação e lint — Biome
Ferramenta única para back e front. Config na RAIZ (`biome.json`), versão
travada em 2.5.12. O oxlint que vem no template do Vite foi REMOVIDO para não
ter dois linters no mesmo código.
- **`npm run check`** ← o comando do projeto: formata + lint + organiza imports
- `npm run format`: só formata
- `npm run lint`: só reporta problemas, não altera nada

Regras: 2 espaços, aspas simples, ponto e vírgula sempre, linha de 80 colunas.

### Variáveis de ambiente
`backend/.env` → `PORT=4000`. `frontend/.env` → `VITE_API_URL=http://localhost:4000`.
No Vite, só variáveis com prefixo `VITE_` chegam ao navegador — e ficam
públicas. Segredo (JWT secret, client secret do GitHub) só no back.
