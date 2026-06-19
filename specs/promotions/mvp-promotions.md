# Spec - Promotions MVP

## 1. Objetivo

Definir o módulo de promoções do HortiFácil para destacar oportunidades comerciais no catálogo e no painel administrativo sem depender de campanhas complexas.

## 2. Atores

- cliente final
- administrador da loja
- operador interno
- API backend
- frontend público
- frontend administrativo

## 3. Fluxo Principal

1. o administrador cria uma promoção no painel
2. a API valida período, título e regra de associação
3. a promoção é vinculada a produtos ou categorias
4. o catálogo público destaca a promoção ativa
5. o administrador encerra, edita ou desativa a promoção quando necessário

## 4. Regras de Negócio

- promoção pertence a uma loja
- promoção deve possuir título
- promoção pode apontar para produtos específicos ou categorias
- promoção pode existir mesmo sem banner de imagem
- promoção só aparece publicamente quando estiver ativa e dentro da vigência
- preço promocional do produto continua sendo validado no módulo de produtos
- o módulo de promoções complementa a divulgação, não substitui a regra de preço do produto

## 5. Casos de Erro

- payload inválido deve retornar `400`
- promoção sem título deve retornar `400`
- data final anterior à data inicial deve retornar `400`
- acesso administrativo sem autenticação deve retornar `401`
- promoção inexistente deve retornar `404`
- tentativa de editar promoção de outra loja deve retornar `403`

## 6. Contrato de API

### `POST /api/v1/admin/promotions`

Request:

```json
{
  "title": "Semana das Frutas",
  "description": "Ofertas especiais nas frutas selecionadas",
  "startsAt": "2026-06-20T00:00:00.000Z",
  "endsAt": "2026-06-27T23:59:59.000Z",
  "productIds": [
    "prd_001"
  ],
  "isActive": true
}
```

Response `201`:

```json
{
  "id": "prm_001",
  "title": "Semana das Frutas",
  "isActive": true
}
```

### `GET /api/v1/admin/promotions`

Retorna promoções para gestão interna.

### `PATCH /api/v1/admin/promotions/:id`

Permite editar texto, período, vínculos e status.

### `GET /api/v1/public/promotions`

Retorna promoções ativas e válidas para exibição no catálogo.

## 7. Modelo de Dados

### Coleção `promotions`

```json
{
  "_id": "ObjectId",
  "storeId": "ObjectId",
  "title": "Semana das Frutas",
  "description": "Ofertas especiais nas frutas selecionadas",
  "bannerUrl": null,
  "productIds": [
    "ObjectId"
  ],
  "categoryIds": [],
  "startsAt": "2026-06-20T00:00:00.000Z",
  "endsAt": "2026-06-27T23:59:59.000Z",
  "isActive": true,
  "createdAt": "2026-06-18T00:00:00.000Z",
  "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

## 8. Critérios de Aceite

- o administrador consegue criar e editar promoções
- o catálogo público exibe apenas promoções ativas e vigentes
- a promoção pode destacar produtos ou categorias
- a solução continua leve e simples para o MVP

## 9. Checklist de Testes

- validar criação de promoção com período válido
- validar rejeição de período inválido
- validar listagem pública somente de promoções ativas
- validar associação de produtos e categorias
- validar isolamento por loja
