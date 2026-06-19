# CURRENT_STATE - HortiFácil

Data de referência: 2026-06-18

## Resumo Executivo

- o projeto está em fase de definição e especificação
- este repositório passa a ser a base do backend do HortiFácil
- o frontend ficará fora deste repositório, em trilha separada com OpenDesign
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
- o banco deve ser MongoDB Atlas
- não usar MongoDB local na VPS
- a área de licitações existe como frente prevista, mas não deve engolir o MVP principal

## Estado Real do Repositório

Arquivos existentes após esta etapa:

- `README.md`
- `context.md`
- `CURRENT_STATE.md`
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

- pipeline de deploy
- testes automatizados

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

Superfície atual da API:

- prefixo global `api` e versionamento em `v1`
- Swagger em `GET /api/docs` quando `SWAGGER_ENABLED` nao estiver como `false`
- rotas públicas e administrativas já criadas para `auth`, `categories`, `products`, `settings`, `customers`, `promotions` e `orders`

Validado:

- `npm install`
- geração de `package-lock.json`
- checagem TypeScript sem emissão

Pendente de validação:

- `npm run seed:bootstrap` com MongoDB Atlas real
- `npm run start:dev` com `.env` real
- `npm run build` em ambiente com escrita normal em `dist/`
- validação ponta a ponta das rotas já implementadas

## Ordem Recomendada de Retomada

1. copiar `.env.example` para `.env` e preencher variáveis reais
2. executar `npm run seed:bootstrap`
3. subir a API com `npm run start:dev`
4. validar login, settings, categories, products e orders
5. repetir `npm run build` em ambiente com escrita normal em `dist/`
6. consolidar containerização e deploy do backend
7. tratar a frente de licitações como fase separada ou recurso opcional

## Decisões Ainda em Aberto

- definir a convenção de nomes dos dois repositórios finais
- definir se o MVP começa single-store com preparo para multi-store ou já com multi-store mais explícito
- definir estratégia de hospedagem de imagens dos produtos
- decidir quando `deliveries` deixa de ser placeholder e entra no fluxo real

## Riscos Atuais

- aumentar o escopo cedo demais e atrasar a entrega do MVP
- misturar a frente de licitações com o núcleo operacional do catálogo e pedidos
- o install e a checagem TypeScript sem emissao ja foram validados, mas o build com escrita em `dist/` ainda esbarra em limitacao do ambiente de execucao
- adicionar componentes pesados demais para a capacidade real da VPS `lobojow`

## Próxima Ação Recomendada

- usar o seed para criar a loja e o admin iniciais
- subir a API localmente com `.env` real
- validar `auth`, `settings`, `categories`, `products` e `orders` em sequência
- validar `npm run build` novamente em ambiente com escrita normal em `dist/`
- deixar o frontend fora deste fluxo técnico imediato, sob responsabilidade do OpenDesign
