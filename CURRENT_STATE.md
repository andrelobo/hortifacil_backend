# CURRENT_STATE - HortiFácil

Data de referência: 2026-06-22

## Resumo Executivo

- o projeto está em fase de definição e especificação
- este repositório passa a ser a base do backend do HortiFácil
- o frontend ficará fora deste repositório backend, em trilha separada com OpenDesign
- a documentação inicial já registra a visão do produto e as decisões arquiteturais principais
- o fluxo oficial segue SDD, mas o backend já possui bootstrap inicial em código
- o ponto de retomada agora é operacionalizar o ambiente e validar o fluxo real do MVP

## Decisões Confirmadas

- o produto é um MVP/SaaS para hortifrutis, frutarias, mercadinhos e pequenos comércios
- o sistema terá catálogo público/PWA, painel administrativo e API backend
- o frontend deve ser hospedado fora da VPS, preferencialmente na Vercel
- o frontend será tratado pelo OpenDesign em repositório separado
- o backend deve ser leve, dockerizado e preparado para a VPS `lobojow`
- frontend e backend devem ficar em repositórios diferentes
- o backend agora está em repositório Git próprio e separado
- a estratégia de Git passa a ser branch por feature
- o `push` para o GitHub continua sendo feito pelo usuário
- o banco deve ser MongoDB Atlas
- não usar MongoDB local na VPS
- a área de licitações existe como frente prevista, mas não deve engolir o MVP principal

## Estado Real do Repositório

Arquivos existentes após esta etapa:

- `README.md`
- `context.md`
- `CURRENT_STATE.md`
- `.github/workflows/backend-ci.yml`
- `jest.config.ts`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `tsconfig.build.json`
- `nest-cli.json`
- `.env.example`
- `Dockerfile`
- `docker-compose.yml`
- `src/`
- `src/scripts/seed-bootstrap.ts`
- `specs/README.md`
- `specs/auth/mvp-auth.md`
- `specs/products/mvp-products.md`
- `specs/categories/mvp-categories.md`
- `specs/promotions/mvp-promotions.md`
- `specs/orders/mvp-orders-whatsapp.md`
- `specs/customers/mvp-customers.md`
- `specs/settings/mvp-settings.md`
- `specs/bids/bids-module-foundation.md`
- `specs/deploy/repo-split-and-hosting.md`

O que ainda não existe:

- pipeline de deploy para ambiente final
- testes de integração ponta a ponta

## Estado do Git

- repositório local próprio em `"/home/lobo/Área de trabalho/KODE/horti_facil/backend"`
- branch de base: `main`
- última branch consolidada nesta etapa: `feature/orders-customers-promotions-tests`
- remoto `origin` configurado para `https://github.com/andrelobo/hortifacil_backend.git`
- primeiro commit local do backend já criado
- regra atual: abrir uma branch nova para cada feature antes de implementar

## Checkpoint Técnico

Implementado:

- bootstrap NestJS
- autenticação JWT
- healthcheck
- módulos de `categories`, `products`, `settings`, `customers`, `promotions` e `orders`
- módulos internos de `stores` e `users`
- módulo `deliveries` criado apenas como placeholder vazio
- Dockerfile e `docker-compose.yml`
- seed inicial de loja, settings e admin
- base de testes automatizados com Jest e `ts-jest`
- pipeline inicial de CI com GitHub Actions para `npm ci`, `npm test` e `npm run build`
- correção de runtime nos schemas Mongoose para campos anuláveis em `categories` e `products`
- correção estrutural dos schemas Mongoose para `ObjectId` deixar de ser registrado como `Mixed`
- Swagger enriquecido com tags, auth, descrições e exemplos de payload nos DTOs
- primeira leva de testes de domínio para `settings`, `categories` e `products`
- cobertura de domínio ampliada para `orders`, `customers` e `promotions`

Superfície atual da API:

- prefixo global `api` e versionamento em `v1`
- Swagger em `GET /api/docs` quando `SWAGGER_ENABLED` nao estiver como `false`
- rotas públicas e administrativas já criadas para `auth`, `categories`, `products`, `settings`, `customers`, `promotions` e `orders`

Validado:

- `npm install`
- geração de `package-lock.json`
- checagem TypeScript sem emissão
- `npm run build`
- `npm test` com 10 suítes e 50 testes passando
- `npm run build` e `npm test` revalidados após a configuração do Swagger
- `npm run build` e `npm test` revalidados após a expansão da cobertura para `orders`, `customers` e `promotions`
- `.env` real criado com MongoDB Atlas configurado
- `npm run seed:bootstrap` com MongoDB Atlas real
- `GET /api/v1/health` com banco respondendo `ok`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/admin/settings`
- `PUT /api/v1/admin/settings`
- `GET /api/v1/public/settings`
- `POST /api/v1/admin/categories`
- `GET /api/v1/admin/categories`
- `PATCH /api/v1/admin/categories/:id`
- `GET /api/v1/public/categories`
- `POST /api/v1/admin/products`
- `GET /api/v1/admin/products`
- `PATCH /api/v1/admin/products/:id`
- `GET /api/v1/public/products`
- `GET /api/v1/public/products/:slug`
- `POST /api/v1/public/orders`
- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/:id`
- `PATCH /api/v1/admin/orders/:id/status`
- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:id`
- `PATCH /api/v1/admin/customers/:id`
- `POST /api/v1/admin/promotions`
- `GET /api/v1/admin/promotions`
- `PATCH /api/v1/admin/promotions/:id`
- `GET /api/v1/public/promotions`

Pendente de validação:

- primeira execução da GitHub Action após push
- testes de integração HTTP e e2e

## Ordem Recomendada de Retomada

1. abrir uma branch nova para a próxima feature
2. manter o `.env` real alinhado com Atlas e com as variáveis de seed
3. validar a GitHub Action no remoto
4. iniciar testes de integração HTTP do núcleo do MVP
5. consolidar containerização e deploy do backend
6. tratar a frente de licitações como fase separada ou recurso opcional

## Decisões Ainda em Aberto

- definir a convenção de nomes dos dois repositórios finais
- definir se o MVP começa single-store com preparo para multi-store ou já com multi-store mais explícito
- definir estratégia de hospedagem de imagens dos produtos
- decidir quando `deliveries` deixa de ser placeholder e entra no fluxo real

## Riscos Atuais

- aumentar o escopo cedo demais e atrasar a entrega do MVP
- misturar a frente de licitações com o núcleo operacional do catálogo e pedidos
- a CI foi configurada localmente, mas ainda precisa da primeira execução no GitHub
- adicionar componentes pesados demais para a capacidade real da VPS `lobojow`
- durante a validação local, a porta `3000` já estava ocupada por uma instância ativa da própria API, então novos boots devem reutilizar ou trocar a porta quando necessário

## Próxima Ação Recomendada

- abrir uma branch de feature antes da próxima implementação
- manter o seed e o `.env` reais como base de desenvolvimento
- validar a GitHub Action e preparar o deploy backend
- iniciar a camada de testes de integração HTTP
- deixar o frontend fora deste fluxo técnico imediato, sob responsabilidade do OpenDesign
