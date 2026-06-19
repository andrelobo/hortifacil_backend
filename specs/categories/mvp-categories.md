# Spec - Categories MVP

## 1. Objetivo

Definir o módulo de categorias do HortiFácil para organizar o catálogo público e facilitar a manutenção administrativa sem complexidade desnecessária.

## 2. Atores

- cliente final
- administrador da loja
- operador interno
- API backend
- frontend público
- frontend administrativo

## 3. Fluxo Principal

1. o administrador cria uma categoria no painel
2. a API valida nome, ordem e vínculo com a loja
3. a categoria fica disponível para associação com produtos
4. o catálogo público lista as categorias ativas
5. os produtos são agrupados ou filtrados por categoria
6. o administrador reordena ou desativa categorias quando necessário

## 4. Regras de Negócio

- categoria pertence a uma loja
- nome é obrigatório
- slug deve ser único por loja
- categoria pode existir sem imagem
- categoria desativada não deve aparecer no catálogo público
- produtos sem categoria podem continuar existindo no MVP
- exclusão física deve ser evitada; preferir desativação ou arquivamento

## 5. Casos de Erro

- nome ausente deve retornar `400`
- slug duplicado na mesma loja deve retornar `409`
- acesso administrativo sem autenticação deve retornar `401`
- tentativa de editar categoria de outra loja deve retornar `403`
- categoria inexistente deve retornar `404`

## 6. Contrato de API

### `POST /api/v1/admin/categories`

Request:

```json
{
  "name": "Frutas",
  "description": "Frutas frescas do dia",
  "sortOrder": 1,
  "isActive": true
}
```

Response `201`:

```json
{
  "id": "cat_001",
  "name": "Frutas",
  "slug": "frutas",
  "sortOrder": 1,
  "isActive": true
}
```

### `GET /api/v1/admin/categories`

Retorna categorias da loja para manutenção interna.

### `PATCH /api/v1/admin/categories/:id`

Permite editar nome, descrição, ordem e status.

### `GET /api/v1/public/categories`

Response `200`:

```json
{
  "items": [
    {
      "id": "cat_001",
      "name": "Frutas",
      "slug": "frutas",
      "sortOrder": 1
    }
  ]
}
```

## 7. Modelo de Dados

### Coleção `categories`

```json
{
  "_id": "ObjectId",
  "storeId": "ObjectId",
  "name": "Frutas",
  "slug": "frutas",
  "description": "Frutas frescas do dia",
  "sortOrder": 1,
  "isActive": true,
  "archivedAt": null,
  "createdAt": "2026-06-18T00:00:00.000Z",
  "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

## 8. Critérios de Aceite

- o administrador consegue criar e editar categorias
- o catálogo público lista apenas categorias ativas
- produtos podem ser associados a categorias
- a ordenação administrativa reflete na ordem pública

## 9. Checklist de Testes

- validar criação com dados válidos
- validar rejeição de slug duplicado
- validar listagem pública somente com categorias ativas
- validar edição de ordem e status
- validar isolamento por loja
