# Spec - Products MVP

## 1. Objetivo

Definir o módulo de produtos do HortiFácil para suportar catálogo público simples, atualização frequente de preços e gestão administrativa enxuta.

## 2. Atores

- cliente final
- administrador da loja
- operador interno
- API backend
- frontend público
- frontend administrativo

## 3. Fluxo Principal

1. o administrador cadastra um produto no painel
2. a API valida os dados e salva o produto vinculado à loja
3. o produto fica disponível para o catálogo público quando estiver ativo
4. o cliente navega pelo catálogo e visualiza nome, preço, unidade e promoção
5. o administrador ajusta preço, disponibilidade ou destaque sempre que necessário
6. o catálogo público reflete as alterações aprovadas pela API

## 4. Regras de Negócio

- produto pertence a uma loja
- nome é obrigatório
- preço deve ser armazenado em centavos
- `promotionalPriceCents`, quando informado, deve ser menor que `priceCents`
- produto pode existir sem categoria no primeiro momento
- exclusão física deve ser evitada no MVP; preferir arquivamento
- produto só aparece no catálogo público quando estiver ativo e disponível
- imagem deve ser referenciada por URL; evitar processamento pesado local
- mudança de preço não deve alterar pedidos já criados

## 5. Casos de Erro

- payload inválido deve retornar `400`
- tentativa de criar produto sem nome deve retornar `400`
- preço inválido deve retornar `400`
- preço promocional maior ou igual ao preço base deve retornar `400`
- acesso administrativo sem autenticação deve retornar `401`
- tentativa de editar produto de outra loja deve retornar `403`
- produto não encontrado deve retornar `404`

## 6. Contrato de API

### `POST /api/v1/admin/products`

Request:

```json
{
  "name": "Tomate",
  "description": "Tomate saladete fresco",
  "unitLabel": "kg",
  "priceCents": 899,
  "promotionalPriceCents": 799,
  "categoryId": "cat_001",
  "imageUrl": "https://cdn.exemplo.com/tomate.jpg",
  "isAvailable": true,
  "isFeatured": true
}
```

Response `201`:

```json
{
  "id": "prd_001",
  "name": "Tomate",
  "slug": "tomate",
  "unitLabel": "kg",
  "priceCents": 899,
  "promotionalPriceCents": 799,
  "isAvailable": true,
  "isFeatured": true
}
```

### `GET /api/v1/admin/products`

Response `200`:

```json
{
  "items": [
    {
      "id": "prd_001",
      "name": "Tomate",
      "priceCents": 899,
      "promotionalPriceCents": 799,
      "isAvailable": true
    }
  ],
  "total": 1
}
```

### `PATCH /api/v1/admin/products/:id`

Request:

```json
{
  "priceCents": 999,
  "isAvailable": false
}
```

### `GET /api/v1/public/products`

Query suportada:

```txt
?categoryId=cat_001&featured=true&promotionOnly=true&search=tomate
```

Response `200`:

```json
{
  "items": [
    {
      "id": "prd_001",
      "name": "Tomate",
      "slug": "tomate",
      "unitLabel": "kg",
      "priceCents": 899,
      "promotionalPriceCents": 799,
      "imageUrl": "https://cdn.exemplo.com/tomate.jpg"
    }
  ]
}
```

### `GET /api/v1/public/products/:slug`

Retorna um produto público visível no catálogo.

## 7. Modelo de Dados

### Coleção `products`

```json
{
  "_id": "ObjectId",
  "storeId": "ObjectId",
  "categoryId": "ObjectId",
  "name": "Tomate",
  "slug": "tomate",
  "description": "Tomate saladete fresco",
  "unitLabel": "kg",
  "priceCents": 899,
  "promotionalPriceCents": 799,
  "imageUrl": "https://cdn.exemplo.com/tomate.jpg",
  "isAvailable": true,
  "isFeatured": true,
  "archivedAt": null,
  "createdAt": "2026-06-18T00:00:00.000Z",
  "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

## 8. Critérios de Aceite

- o administrador consegue criar, listar e editar produtos
- o catálogo público exibe apenas produtos disponíveis
- preço promocional aparece quando aplicável
- atualização de preço refletida no catálogo não altera pedidos passados
- o modelo é simples o bastante para pequenas lojas, mas já suporta vínculo com categoria e loja

## 9. Checklist de Testes

- validar criação de produto com dados válidos
- validar rejeição de preço promocional inválido
- validar listagem administrativa autenticada
- validar listagem pública somente com produtos visíveis
- validar edição de preço e disponibilidade
- validar isolamento por loja
