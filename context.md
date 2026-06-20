# HortiFácil - Contexto do Projeto

## Visão Geral

O HortiFácil é um MVP/SaaS para hortifrutis, frutarias, mercadinhos e pequenos comércios que recebem pedidos por WhatsApp e precisam organizar catálogo, pedidos, clientes, promoções, entregas e a frente operacional ligada a licitações quando isso fizer parte do negócio.

Objetivo principal:

- transformar pedidos dispersos no WhatsApp em um fluxo simples e organizado
- oferecer um catálogo vendável e fácil de atualizar
- permitir operação leve, com baixo custo de infraestrutura
- criar uma base técnica enxuta para evoluir depois para SaaS multi-loja

## Problemas que o Produto Resolve

- pedidos perdidos no WhatsApp
- catálogo desorganizado
- preços que mudam com frequência
- falta de painel de pedidos
- dificuldade para divulgar promoções
- controle simples de clientes e entregas
- falta de organização para acompanhar a área de licitações quando aplicável

## Componentes do Produto

### 1. Catálogo Público / PWA

Responsabilidades:

- listar produtos
- organizar categorias
- destacar promoções
- oferecer carrinho simples
- finalizar pedido via WhatsApp
- coletar dados do cliente
- coletar endereço de entrega

Diretrizes:

- interface simples e vendável
- carregamento leve
- experiência boa em mobile
- PWA quando fizer sentido

### 2. Painel Administrativo

Responsabilidades:

- login
- dashboard
- cadastro de produtos
- gestão de categorias
- gestão de promoções
- gestão de pedidos
- gestão de clientes
- atualização de status do pedido
- configurações da loja
- visão futura para acompanhamento da área de licitações

Diretrizes:

- foco em operação rápida
- poucos cliques
- sem complexidade desnecessária para o MVP

### 3. API Backend

Responsabilidades:

- autenticação
- regras de negócio
- integração com MongoDB Atlas
- endpoints REST
- logs
- healthcheck
- documentação Swagger/OpenAPI

## Stack Definida

### Frontend

- React ou Next.js
- TypeScript
- TailwindCSS
- PWA quando aplicável
- deploy preferencial em Vercel
- Cloudflare Pages como alternativa secundária

Decisão de arquitetura:

- priorizar frontend fora da VPS sempre que possível
- manter o frontend desacoplado do backend para deploy simples e barato
- manter frontend e backend em repositórios diferentes
- pensar o frontend desde o início para deploy independente na Vercel
- o frontend será conduzido fora deste repositório, em trilha própria com OpenDesign

### Backend

- Node.js
- NestJS
- TypeScript
- REST API
- Swagger/OpenAPI
- JWT
- DTOs
- ValidationPipe
- arquitetura modular

Decisão de arquitetura:

- backend em repositório separado do frontend
- backend leve, dockerizado e preparado para rodar na VPS `lobojow`
- contrato de API estável para consumo pelo frontend hospedado externamente
- este repositório atual passa a ser a base de implementação do backend
- o backend já possui repositório Git próprio e separado do futuro frontend

### Banco de Dados

- MongoDB Atlas
- Mongoose
- nunca usar MongoDB local na VPS
- modelagem orientada a coleções simples e escaláveis

## Infraestrutura

VPS principal:

- nome: `lobojow`
- Oracle Cloud Always Free
- Ubuntu 20.04
- 1 vCPU
- 952 MB RAM
- 2 GB swap
- 45 GB disco
- IP público configurado
- SSH funcionando
- Docker funcionando
- Portainer funcionando
- UFW ativo
- portas liberadas: `22` e `9443`
- `rpcbind` removido

Uso recomendado da VPS `lobojow`:

- backend leve
- Docker / Portainer
- reverse proxy
- monitoramento
- serviços auxiliares

Evitar na VPS:

- MongoDB local
- PostgreSQL local
- Playwright pesado
- Chromium
- WhatsApp Web persistente
- Evolution API pesada
- IA local

## Diretrizes de DevOps

Prioridades:

- Dockerfile enxuto
- docker-compose
- variáveis de ambiente
- healthcheck
- logs estruturados
- backup de volumes
- deploy reproduzível
- segurança mínima desde o início
- UFW e NSG alinhados
- portas públicas mínimas
- Cloudflare opcional
- Uptime Kuma para monitoramento

Critério de decisão:

- toda decisão técnica deve considerar as limitações reais da VPS `lobojow`

## SDD / Spec Driven Development

O projeto deve ser conduzido por especificações antes do código.

Para cada funcionalidade, produzir antes:

1. objetivo
2. atores
3. fluxo principal
4. regras de negócio
5. casos de erro
6. contrato de API
7. modelo de dados
8. critérios de aceite
9. checklist de testes

Estrutura base de specs:

```md
/specs
  /auth
  /products
  /categories
  /orders
  /customers
  /promotions
  /settings
  /deploy
  /bids
```

Regra:

- cada spec deve poder virar tarefa de implementação

## Arquitetura Inicial do Backend

Estrutura prevista:

```txt
src/
  auth/
  users/
  stores/
  products/
  categories/
  promotions/
  customers/
  orders/
  deliveries/
  settings/
  health/
  common/
  scripts/
```

### Coleções Iniciais

- users
- stores
- products
- categories
- promotions
- customers
- orders
- deliveries
- settings
- audit_logs

Coleções futuras ou opcionais, conforme evolução da área de licitações:

- bids
- bid_documents
- bid_items

## Superfície Atual da API

Runtime já configurado:

- prefixo global `api`
- versionamento por URI em `v1`
- `ValidationPipe` global com `whitelist`, `transform` e bloqueio de campos extras
- CORS baseado em `FRONTEND_URL`
- Swagger habilitável por `SWAGGER_ENABLED`
- Jest configurado para testes automatizados com `ts-jest`
- GitHub Actions preparado para validar `npm ci`, `npm test` e `npm run build`

Rotas já implementadas nesta fase:

- `GET /api/v1/health`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/admin/categories`
- `GET /api/v1/admin/categories`
- `PATCH /api/v1/admin/categories/:id`
- `GET /api/v1/public/categories`
- `POST /api/v1/admin/products`
- `GET /api/v1/admin/products`
- `PATCH /api/v1/admin/products/:id`
- `GET /api/v1/public/products`
- `GET /api/v1/public/products/:slug`
- `GET /api/v1/admin/settings`
- `PUT /api/v1/admin/settings`
- `GET /api/v1/public/settings`
- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:id`
- `PATCH /api/v1/admin/customers/:id`
- `POST /api/v1/admin/promotions`
- `GET /api/v1/admin/promotions`
- `PATCH /api/v1/admin/promotions/:id`
- `GET /api/v1/public/promotions`
- `POST /api/v1/public/orders`
- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/:id`
- `PATCH /api/v1/admin/orders/:id/status`

Estado dos módulos:

- `stores` e `users` existem como suporte interno da autenticação e do vínculo com loja
- `deliveries` existe apenas como placeholder de módulo, sem rotas ou regras implementadas ainda
- `bids` permanece apenas no nível de spec, sem código iniciado neste repositório

## Princípios Técnicos

- MVP primeiro
- simplicidade antes de sofisticação
- baixo consumo de RAM
- evitar overengineering
- sem banco local pesado
- API clara
- frontend vendável visualmente
- código limpo e modular
- cada decisão técnica deve considerar a limitação da VPS `lobojow`

## Modelo Comercial

O HortiFácil deve ser pensado como um SaaS simples.

Planos possíveis:

- Básico: catálogo + pedidos via WhatsApp
- Profissional: painel + clientes + promoções + pedidos
- Futuro: entregas, relatórios, múltiplas lojas, domínio próprio e módulo de licitações

## Arquitetura de Repositórios

Estratégia recomendada:

- um repositório exclusivo para frontend
- um repositório exclusivo para backend
- frontend preparado para deploy na Vercel
- backend preparado para deploy independente na VPS `lobojow`
- a trilha de frontend fica fora deste repositório e será tratada pelo OpenDesign

Benefícios:

- pipelines de deploy separados
- menor acoplamento entre interface e API
- evolução independente de frontend e backend
- menor risco operacional durante releases

## Workflow de Git

Regra de trabalho adotada:

- este repositório `horti_facil` é o repositório próprio do backend
- a branch base atual é `main`
- cada feature deve nascer em branch própria
- evitar desenvolvimento direto em `main`
- o `push` para o GitHub será feito pelo usuário

Convenção recomendada de branches:

- `feature/auth-refino`
- `feature/products-admin`
- `feature/orders-flow`
- `fix/nome-do-ajuste`
- `chore/nome-da-tarefa`

Fluxo recomendado:

```bash
cd "/home/lobo/Área de trabalho/KODE/horti_facil"
git switch -c feature/nome-da-feature
```

## Direcionamento de Resposta Técnica

Sempre estruturar análises e decisões em:

1. decisão recomendada
2. justificativa
3. impacto técnico
4. próximos passos
5. comandos ou código quando aplicável

Evitar respostas genéricas.

Sempre considerar:

- capacidade real da VPS `lobojow`
- uso do MongoDB Atlas
- frontend fora da VPS sempre que possível
- backend leve e dockerizado
- possibilidade de vender o MVP para pequenos comércios

## Estado Atual do Repositório

Situação observada neste momento:

- este repositório passa a ser a base do backend do HortiFácil
- este backend já está em repositório Git próprio com remoto `origin` configurado
- o backend NestJS já possui bootstrap inicial, módulos centrais e configuração base
- as dependências já foram instaladas e a checagem TypeScript sem emissão passou
- já existem os módulos `auth`, `users`, `stores`, `health`, `categories`, `products`, `settings`, `customers`, `promotions`, `orders` e `deliveries`
- já existem `README.md`, `Dockerfile`, `docker-compose.yml`, `.env.example` e `seed-bootstrap`
- o repositório já possui documentação base de contexto e estado atual
- a estrutura inicial de `specs/` passa a orientar a implementação antes do código
- este repositório está sendo usado como base de planejamento e implementação do backend
- o frontend ficará em repositório distinto sob responsabilidade do OpenDesign

### Checkpoint de Retomada

Estado validado:

- `npm install` concluído
- `package-lock.json` gerado
- checagem com TypeScript sem emissão passou
- `npm run build` executado com sucesso em ambiente com escrita normal
- `npm test` executado com sucesso
- `.env` real já foi criado com MongoDB Atlas configurado
- `npm run seed:bootstrap` já foi validado com sucesso contra o Atlas
- `GET /api/v1/health` respondeu com banco `ok`
- `POST /api/v1/auth/login` e `GET /api/v1/auth/me` já foram validados com sucesso
- os schemas de `categories` e `products` já receberam ajuste de tipos explícitos para campos anuláveis usados pelo Mongoose
- os schemas com relacionamentos por `ObjectId` já foram corrigidos para evitar registro como `Mixed` no Mongoose
- `settings`, `categories`, `products`, `orders`, `customers` e `promotions` já foram validados em fluxo real com `.env` e Atlas
- a API já expõe a maior parte do núcleo do MVP em nível de controller/service e já passou pela validação real das rotas centrais implementadas do MVP

Ponto de retorno recomendado:

- fechar a branch de correção atual antes de abrir a próxima feature
- manter o `.env` real alinhado com o Atlas e com o seed administrativo
- validar a GitHub Action no remoto e preparar o deploy
- preparar os próximos ajustes pensando em deploy backend isolado na VPS `lobojow`
- manter o frontend fora deste fluxo, em repositório separado com OpenDesign

Comandos de retomada:

```bash
cd "/home/lobo/Área de trabalho/KODE/horti_facil"
git switch fix/admin-settings-lookup
npm run start:dev
```

## Próximos Passos Recomendados

1. validar a pipeline do GitHub Actions após o push
2. consolidar deploy e ambiente da VPS `lobojow`
3. manter `bids` como trilha opcional e separada do núcleo do MVP
