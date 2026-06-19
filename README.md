# HortiFácil API

Backend NestJS do HortiFácil.

## Escopo deste repositório

- este repositório cobre apenas a API backend
- o frontend ficará em repositório separado, conduzido pelo OpenDesign
- MongoDB local nao faz parte da arquitetura
- a base de dados oficial prevista e o MongoDB Atlas

## Stack

- NestJS
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- Swagger/OpenAPI
- Docker

## Estrutura principal

```txt
src/
  auth/
  categories/
  common/
  customers/
  deliveries/
  health/
  orders/
  products/
  promotions/
  settings/
  stores/
  users/
specs/
```

## Primeiros passos

1. copiar `.env.example` para `.env`
2. preencher `MONGODB_URI` e `JWT_SECRET`
3. instalar dependencias com `npm install`
4. subir em desenvolvimento com `npm run start:dev`
5. criar loja e admin inicial com `npm run seed:bootstrap`
6. rodar testes com `npm test`

## Variaveis de ambiente minimas

```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=change-me
JWT_EXPIRES_IN=8h
FRONTEND_URL=http://localhost:3001
SWAGGER_ENABLED=true
```

## Endpoints base

- `GET /api/v1/health`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/docs`

## Testes

Suite atual disponível:

- `npm test`

Cobertura inicial implementada:

- validação de ambiente
- utilitários de slug
- utilitários de WhatsApp
- fluxo principal do `AuthService` com mocks

## Seed inicial

Use o script abaixo depois de configurar o `.env`:

```bash
npm run seed:bootstrap
```

Esse seed cria ou atualiza:

- loja inicial
- configuracoes da loja
- usuario administrativo inicial

## Deploy

- frontend fora da VPS
- backend dockerizado para a VPS `lobojow`
- Atlas como banco remoto
