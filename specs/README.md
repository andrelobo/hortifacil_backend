# Specs do HortiFácil

## Objetivo

Centralizar as especificações funcionais e operacionais do projeto antes do início da implementação.

## Regras Gerais

- cada spec deve ser implementável
- cada spec deve seguir o padrão: objetivo, atores, fluxo principal, regras de negócio, casos de erro, contrato de API, modelo de dados, critérios de aceite e checklist de testes
- o foco inicial é MVP
- a frente de licitações deve ser tratada como trilha própria para não contaminar o escopo central
- frontend e backend devem permanecer desacoplados e em repositórios diferentes
- este repositório documenta e implementa o backend; o frontend seguirá em trilha separada com OpenDesign

## Ordem Sugerida

1. `auth`
2. `products`
3. `categories`
4. `settings`
5. `orders`
6. `promotions`
7. `customers`
8. `deploy`
9. `bids`

## Specs Já Criadas

- `auth/mvp-auth.md`
- `products/mvp-products.md`
- `categories/mvp-categories.md`
- `promotions/mvp-promotions.md`
- `orders/mvp-orders-whatsapp.md`
- `customers/mvp-customers.md`
- `settings/mvp-settings.md`
- `bids/bids-module-foundation.md`
- `deploy/repo-split-and-hosting.md`

## Specs Pendentes

- nenhuma dentro do escopo base já definido para esta fase documental

## Decisão Arquitetural Global

- frontend em repositório separado, preparado para Vercel
- backend em repositório separado, preparado para a VPS `lobojow`
- MongoDB Atlas como banco oficial
- nenhum banco pesado local na VPS
- frontend fora deste repositório e fora do escopo imediato de implementação daqui
