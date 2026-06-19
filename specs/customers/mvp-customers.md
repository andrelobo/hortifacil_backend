# Spec - Customers MVP

## 1. Objetivo

Definir o módulo de clientes do HortiFácil para organizar os dados gerados pelos pedidos e permitir histórico básico de atendimento no painel administrativo.

## 2. Atores

- administrador da loja
- operador interno
- API backend
- frontend administrativo

## 3. Fluxo Principal

1. o cliente faz um pedido pelo catálogo
2. a API identifica se o telefone já pertence a um cliente existente
3. a API cria ou atualiza o registro do cliente
4. o painel administrativo lista clientes com dados básicos
5. o operador consulta histórico resumido de pedidos por cliente

## 4. Regras de Negócio

- cliente é criado automaticamente a partir do pedido, sem cadastro público separado
- telefone é o principal identificador do cliente no MVP
- cliente pertence a uma loja
- histórico deve ser simples e suficiente para operação comercial
- não há autenticação de cliente final no MVP
- o registro do cliente deve permitir múltiplos pedidos

## 5. Casos de Erro

- acesso administrativo sem autenticação deve retornar `401`
- tentativa de acessar cliente de outra loja deve retornar `403`
- cliente inexistente deve retornar `404`
- payload administrativo inválido deve retornar `400`

## 6. Contrato de API

### `GET /api/v1/admin/customers`

Response `200`:

```json
{
  "items": [
    {
      "id": "cus_001",
      "name": "Maria Souza",
      "phone": "5592999999999",
      "orderCount": 3,
      "lastOrderAt": "2026-06-18T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### `GET /api/v1/admin/customers/:id`

Retorna dados do cliente e resumo dos pedidos vinculados.

### `PATCH /api/v1/admin/customers/:id`

Permite ajustes internos em nome, observações e endereço principal.

## 7. Modelo de Dados

### Coleção `customers`

```json
{
  "_id": "ObjectId",
  "storeId": "ObjectId",
  "name": "Maria Souza",
  "phone": "5592999999999",
  "defaultAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "Manaus",
    "state": "AM",
    "zipCode": "69000000",
    "complement": "Casa amarela"
  },
  "notes": "",
  "orderCount": 3,
  "lastOrderAt": "2026-06-18T00:00:00.000Z",
  "createdAt": "2026-06-18T00:00:00.000Z",
  "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

## 8. Critérios de Aceite

- clientes são criados ou atualizados automaticamente a partir de pedidos
- o painel administrativo lista clientes com histórico básico
- o operador consegue consultar dados principais do cliente
- o módulo permanece simples e útil para relacionamento comercial

## 9. Checklist de Testes

- validar criação automática de cliente em novo pedido
- validar atualização de cliente existente por telefone
- validar listagem administrativa autenticada
- validar detalhamento com histórico resumido
- validar isolamento por loja
