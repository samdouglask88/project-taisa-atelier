# Taisa Ateliê — API

API em Node.js + Express + TypeScript para gerenciar agendamentos, clientes e serviços de um salão de beleza, com autenticação JWT, validação de entrada, hardening de segurança e notificações via WhatsApp.

Aplicação **single-tenant**: existe um único painel administrativo (staff do salão). Não há contas de cliente final — os clientes são apenas registros de CRM criados a partir do agendamento público.

## Sumário

- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Configuração (variáveis de ambiente)](#configuração-variáveis-de-ambiente)
- [Instalação e execução](#instalação-e-execução)
- [Scripts npm](#scripts-npm)
- [Segurança](#segurança)
- [Notificações WhatsApp](#notificações-whatsapp)
- [Modelos de dados](#modelos-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Serviços auxiliares (docker-compose)](#serviços-auxiliares-docker-compose)
- [Limitações conhecidas / próximos passos](#limitações-conhecidas--próximos-passos)

## Stack

- **Node.js** + **TypeScript**
- **Express 4**
- **MongoDB** via **Mongoose**
- **JWT** (`jsonwebtoken`) + **bcryptjs** para autenticação
- **Zod** para validação de schemas
- **helmet** + **express-rate-limit** + **cors** para hardening HTTP
- Fila própria de notificações (sem dependência externa) integrada à **Evolution API** (WhatsApp)

## Arquitetura

```
src/
├── server.ts                  # bootstrap: middlewares globais, rotas, conexão DB, fila de notificações
├── config/
│   └── database.ts            # conexão MongoDB
├── middlewares/
│   ├── authenticate.ts        # valida JWT do header Authorization
│   ├── validateRequest.ts     # valida req.body contra um schema Zod
│   └── rateLimiters.ts        # limitadores: API geral, login, booking público
├── schemas/                   # schemas Zod (fonte única de verdade da validação)
│   ├── authSchemas.ts
│   ├── clientSchemas.ts
│   ├── serviceSchemas.ts
│   └── appointmentSchemas.ts
├── routes/                    # define auth + validação por rota
├── controllers/                # regra de negócio; nunca usa req.body diretamente
├── models/                     # schemas Mongoose (Appointment, Client, Service, User, Notification, SecurityLog)
├── services/
│   └── notifications/          # templates + fila + cliente Evolution API (ver seção dedicada)
├── utils/
│   ├── stripUndefined.ts       # remove chaves undefined antes de create/update
│   └── securityLogger.ts       # log + alerta de tentativas de login
├── createAdminUser.ts           # script CLI para criar usuários staff (substitui registro público)
└── seed.ts                      # popula o catálogo inicial de serviços
```

## Configuração (variáveis de ambiente)

Copie `.env.example` para `.env` e ajuste os valores:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `PORT` | não (default `3333`) | Porta HTTP da API |
| `NODE_ENV` | não | `development` \| `production`. Em produção, exige `CORS_ORIGIN` explícito (ver abaixo) |
| `MONGODB_URI` | não (default local) | String de conexão MongoDB |
| `JWT_SECRET` | **sim** | Segredo usado para assinar/verificar tokens JWT. Use um valor longo e aleatório |
| `CORS_ORIGIN` | recomendado em produção | Lista de origens permitidas separadas por vírgula (ex: `https://taisaatelier.com.br,https://www.taisaatelier.com.br`). Sem essa variável, a API só aceita `localhost:5173` (dev) |
| `EVOLUTION_API_URL` | só p/ WhatsApp | URL base da instância Evolution API (ex: `http://localhost:8080`) |
| `EVOLUTION_API_KEY` | só p/ WhatsApp | API key configurada na Evolution API (`AUTHENTICATION_API_KEY` no `docker-compose.yml`) |
| `EVOLUTION_INSTANCE` | só p/ WhatsApp | Nome da instância do WhatsApp criada na Evolution API |

Sem as três variáveis do Evolution API configuradas, o envio de WhatsApp falha silenciosamente (a notificação fica marcada como `failed` no Mongo após esgotar as tentativas) — o resto da API continua funcionando normalmente.

## Instalação e execução

```bash
npm install

# subir n8n + Evolution API (opcional, necessário só para WhatsApp)
docker compose up -d

# criar o primeiro usuário staff (não há mais registro público)
npm run create-admin -- "Seu Nome" seu@email.com "senha-forte-123"

# popular catálogo inicial de serviços
npm run seed

# ambiente de desenvolvimento (respawn automático)
npm run dev
```

## Scripts npm

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe a API em modo desenvolvimento (`ts-node-dev --respawn`) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Executa o build compilado (`dist/server.js`) |
| `npm run seed` | Insere o catálogo inicial de serviços (só roda se a coleção estiver vazia) |
| `npm run create-admin -- "Nome" email senha` | Cria um usuário staff diretamente no banco. É o único jeito de criar contas — não existe endpoint público de registro |

## Segurança

Resumo dos controles implementados:

- **Autenticação JWT** (`middlewares/authenticate.ts`) protegendo todas as rotas de escrita e as listagens que expõem dados de clientes/agendamentos. `GET /services` é a única leitura pública (catálogo exibido no site antes do login).
- **Sem registro público**: `POST /auth/register` foi removido. Contas são criadas via `npm run create-admin`, evitando que qualquer visitante crie uma conta e acesse dados de clientes.
- **Validação com Zod** (`middlewares/validateRequest.ts` + `schemas/`): todo `POST`/`PUT` de escrita é validado contra um schema antes de chegar ao controller. Requisições inválidas retornam `400` com detalhes do erro.
- **Sem mass assignment**: nenhum controller passa `req.body` direto para `Model.create`/`findByIdAndUpdate`. Cada controller desestrutura exatamente os campos permitidos e usa `utils/stripUndefined.ts` para não sobrescrever campos não enviados com `undefined`/`null` em updates parciais.
- **helmet**: cabeçalhos de segurança HTTP padrão (`server.ts`).
- **CORS restrito**: origem configurável via `CORS_ORIGIN`; sem essa variável, produção cai para localhost apenas (com aviso no log).
- **Rate limiting** (`middlewares/rateLimiters.ts`):
  - `apiRateLimiter`: 300 requisições / 15 min, aplicado globalmente.
  - `loginRateLimiter`: 10 tentativas / 15 min por IP em `/auth/login` (não conta tentativas bem-sucedidas).
  - `bookingRateLimiter`: 20 requisições / 15 min em `/appointments/book` (rota pública, alvo comum de spam/abuso).
- **Logging de segurança e alertas** (`utils/securityLogger.ts` + model `SecurityLog`): toda tentativa de login (sucesso ou falha) é registrada com e-mail, IP e user-agent. Ao atingir **5 falhas em 15 minutos** para o mesmo e-mail, é emitido um log `[security-alert]` no console — ponto de extensão pronto para plugar e-mail/Slack/PagerDuty.

## Notificações WhatsApp

Serviço próprio em `src/services/notifications/`, sem dependências externas de fila (Redis/BullMQ), pensado para o volume de uma agenda de salão:

- **`templates.ts`** — mensagens para os eventos `booked` (agendamento recebido), `confirmado`, `cancelado`, `concluido` e `lembrete`.
- **`evolutionClient.ts`** — chama `POST {EVOLUTION_API_URL}/message/sendText/{EVOLUTION_INSTANCE}` com header `apikey` e body `{ number, text }`. O telefone é normalizado para incluir o DDI `55`. ⚠️ O payload assume o contrato v2 da Evolution API — confirme contra a versão realmente em uso.
- **`queue.ts`** — fila em memória, com cada notificação persistida no Mongo (model `Notification`) desde a criação. Falhas são reprocessadas com backoff exponencial (até 5 tentativas); ao esgotar, a notificação fica marcada como `failed` com o erro salvo em `lastError`. Ao reiniciar o servidor, `resumePendingNotifications()` (chamado em `server.ts`) recarrega qualquer notificação ainda `pending` do Mongo, então nada se perde num restart/crash.
- **`index.ts`** (`notifyAppointment`) — monta a mensagem e enfileira; qualquer erro de enfileiramento é apenas logado, nunca quebra a requisição HTTP que a disparou.

Disparos automáticos:

| Evento | Onde | Gatilho |
|---|---|---|
| `booked` | `AppointmentController.bookAppointment` | Toda vez que um agendamento é criado via `/appointments/book` (fluxo público do site) |
| `confirmado` / `cancelado` / `concluido` | `AppointmentController.updateAppointment` | Quando o `status` do agendamento é atualizado para um desses valores via `PUT /appointments/:id` |

`createAppointment` (criação manual pelo staff) **não** dispara notificação automaticamente, para não enviar mensagens em cargas administrativas/backfill de dados.

## Modelos de dados

| Model | Campos principais |
|---|---|
| `User` | `name`, `email` (único), `password` (hash bcrypt) |
| `Client` | `name`, `email` (único), `phone`, `address?`, `instagram?` |
| `Service` | `name`, `description`, `price`, `durationMinutes?`, `category`, `active` |
| `Appointment` | `client` (ref `Client`), `date`, `time`, `service`, `price`, `status`, `notes?` |
| `Notification` | `appointment?` (ref), `phone`, `event`, `message`, `status` (`pending`\|`sent`\|`failed`), `attempts`, `lastError?`, `sentAt?` |
| `SecurityLog` | `event`, `email?`, `ip?`, `userAgent?`, `success?` |

Status possíveis de `Appointment.status`: `pendente`, `confirmado`, `concluido`, `cancelado` (mais `scheduled`, valor legado mantido por compatibilidade).

## Endpoints da API

Legenda: 🔒 exige `Authorization: Bearer <token>` · 🌐 público.

### Auth

| Método | Rota | Acesso | Body | Observações |
|---|---|---|---|---|
| POST | `/auth/login` | 🌐 (rate limited) | `{ email, password }` | Retorna `{ token, user }`. Toda tentativa é logada em `SecurityLog` |

Não existe `POST /auth/register`. Use `npm run create-admin`.

### Services

| Método | Rota | Acesso | Body |
|---|---|---|---|
| GET | `/services` | 🌐 | — (lista apenas `active: true`) |
| POST | `/services` | 🔒 | `{ name, description, price, durationMinutes?, category, active? }` |
| PUT | `/services/:id` | 🔒 | subconjunto dos campos acima |
| DELETE | `/services/:id` | 🔒 | — |

### Clients

| Método | Rota | Acesso | Body |
|---|---|---|---|
| GET | `/clients` | 🔒 | — |
| POST | `/clients` | 🔒 | `{ name, email, phone, address?, instagram? }` |
| PUT | `/clients/:id` | 🔒 | subconjunto dos campos acima |
| DELETE | `/clients/:id` | 🔒 | — |

### Appointments

| Método | Rota | Acesso | Body |
|---|---|---|---|
| POST | `/appointments/book` | 🌐 (rate limited) | `{ nome, email, telefone, servicoNome, preco?, data, hora, observacoes? }` — cria/atualiza o `Client` pelo e-mail e o agendamento com status `pendente` |
| GET | `/appointments` | 🔒 | — lista todos, populado com `client`, ordenado por criação decrescente |
| POST | `/appointments` | 🔒 | `{ client, date, time, service, price, status?, notes? }` (criação manual pelo staff) |
| PUT | `/appointments/:id` | 🔒 | subconjunto de `{ date, time, service, price, status, notes }` |
| DELETE | `/appointments/:id` | 🔒 | — |

### Health check

| Método | Rota | Acesso |
|---|---|---|
| GET | `/` | 🌐 — `{ status: 'ok', service: 'taisa-atelier-api' }` |

## Serviços auxiliares (docker-compose)

`docker-compose.yml` sobe dois serviços de apoio (opcionais, só necessários para o fluxo de WhatsApp):

- **n8n** (`localhost:5678`) — automação de workflows. Login básico definido em `N8N_BASIC_AUTH_USER`/`N8N_BASIC_AUTH_PASSWORD` — **troque as credenciais padrão antes de expor esse serviço**.
- **evolution-api** (`localhost:8080`) — gateway WhatsApp. `AUTHENTICATION_API_KEY` deve ser igual ao `EVOLUTION_API_KEY` usado pela API — **troque o valor padrão** (`minha-chave-secreta`) antes de qualquer uso real.

## Limitações conhecidas / próximos passos

- O fluxo completo (login → booking → notificação WhatsApp) ainda não foi validado end-to-end contra um MongoDB e uma Evolution API reais — apenas `tsc --noEmit`/`npm run build` foram verificados.
- O alerta de tentativas de login falhas hoje só loga no console (`[security-alert]`); falta integração com um canal real de alerta (e-mail, Slack, PagerDuty).
- A fila de notificações é em memória e por processo — adequada para uma instância única. Se a API precisar rodar em múltiplas instâncias/horizontalmente, migrar para BullMQ + Redis.
- O payload enviado à Evolution API assume o contrato v2 (`POST /message/sendText/{instance}`); confirme contra a versão realmente instalada antes de ir para produção.
