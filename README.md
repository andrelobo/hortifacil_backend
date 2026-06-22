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

## Swagger

- documentação disponível em `GET /api/docs`
- habilitado por padrão
- desativável com `SWAGGER_ENABLED=false`
- Bearer Auth já configurado na interface
- documentação atual enriquecida com:
  - tags por módulo
  - descrição de endpoints
  - exemplos de payload
  - parâmetros de rota e query
  - indicação visual das rotas protegidas por JWT

## Testes

Comandos disponíveis:

- `npm test`
- `npm run test:watch`

Estado atual validado:

- `10` suítes
- `50` testes passando
- `npm test` validado após a expansão da cobertura de domínio
- `npm run build` validado após a expansão da cobertura de domínio

Cobertura automatizada implementada:

- `src/common/config/env.validation.spec.ts`
  - validação de variáveis obrigatórias
  - validação de `PORT`
- `src/common/utils/slugify.util.spec.ts`
  - normalização de acentos
  - limpeza de separadores e caracteres
- `src/common/utils/whatsapp.util.spec.ts`
  - formatação monetária
  - geração da mensagem de pedido
  - geração da URL do WhatsApp
- `src/auth/auth.service.spec.ts`
  - login com sucesso
  - usuário inexistente
  - usuário inativo
  - senha inválida
- `src/settings/settings.service.spec.ts`
  - leitura administrativa
  - validação de WhatsApp obrigatório
  - defaults em atualização
  - leitura pública da loja padrão
- `src/categories/categories.service.spec.ts`
  - criação com slug e defaults
  - conflito por slug duplicado
  - listagem pública
  - atualização com rename e slug
  - validação de existência da categoria
- `src/products/products.service.spec.ts`
  - validação de preço promocional
  - criação com defaults
  - validação de categoria vinculada
  - filtros públicos
  - atualização com remoção de categoria
  - validação de produtos disponíveis
- `src/orders/orders.service.spec.ts`
  - criação pública de pedido com snapshots e payload do WhatsApp
  - ausência de loja padrão
  - ausência de WhatsApp configurado
  - normalização inválida de telefone
  - listagem administrativa
  - detalhe inexistente
  - atualização de status
- `src/customers/customers.service.spec.ts`
  - upsert a partir do pedido com telefone normalizado
  - incremento de contadores de pedidos
  - listagem administrativa
  - detalhe inexistente
  - atualização de campos editáveis
- `src/promotions/promotions.service.spec.ts`
  - criação com datas, relacionamentos e defaults
  - validação de período inválido
  - listagem pública da loja padrão
  - ausência de loja padrão ativa
  - atualização de campos e relacionamentos

Cobertura ainda pendente:

- testes de integração HTTP
- testes e2e com rotas reais

## CI

Pipeline atual disponível no GitHub Actions:

- install com `npm ci`
- execução de `npm test`
- execução de `npm run build`

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
