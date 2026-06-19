# Spec - Orders MVP com Finalização via WhatsApp

## 1. Objetivo

Definir o fluxo de pedidos do HortiFácil para que o catálogo gere pedidos organizados no sistema e, ao mesmo tempo, preserve a finalização via WhatsApp, reduzindo perdas operacionais.

## 2. Atores

- cliente final
- administrador da loja
- operador interno
- API backend
- frontend público
- frontend administrativo

## 3. Fluxo Principal

1. o cliente navega no catálogo público e monta o carrinho
2. o cliente informa nome, telefone e endereço de entrega
3. o frontend envia o pedido para a API
4. a API recalcula preços com base nos produtos atuais e valida disponibilidade
5. a API cria o pedido com status inicial
6. a API retorna `orderId`, `orderCode`, resumo e a URL do WhatsApp com mensagem pré-formatada
7. o frontend redireciona o cliente para o WhatsApp
8. o pedido já aparece no painel administrativo para acompanhamento
9. a loja atualiza o status conforme o atendimento evolui

## 4. Regras de Negócio

- o pedido deve ser criado na API antes do redirecionamento para o WhatsApp
- a API é responsável pelo cálculo final do pedido
- o pedido deve armazenar snapshot dos itens e preços no momento da compra
- pedidos não dependem de conta autenticada do cliente no MVP
- telefone do WhatsApp da loja deve vir de `settings`
- status inicial recomendado: `pending_whatsapp_confirmation`
- status permitidos no MVP: `pending_whatsapp_confirmation`, `confirmed`, `preparing`, `out_for_delivery`, `completed`, `cancelled`
- o cliente pode incluir observações
- taxa de entrega pode ser zero no MVP, mas o campo deve existir

## 5. Casos de Erro

- produto inexistente deve retornar `400`
- produto indisponível deve retornar `400`
- carrinho vazio deve retornar `400`
- endereço incompleto deve retornar `400`
- telefone da loja não configurado deve retornar `422`
- acesso administrativo sem token deve retornar `401`
- atualização de status para valor inválido deve retornar `400`
- pedido não encontrado deve retornar `404`

## 6. Contrato de API

### `POST /api/v1/public/orders`

Request:

```json
{
  "customer": {
    "name": "Maria Souza",
    "phone": "5592999999999"
  },
  "deliveryAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "Manaus",
    "state": "AM",
    "zipCode": "69000000",
    "complement": "Casa amarela"
  },
  "items": [
    {
      "productId": "prd_001",
      "quantity": 2
    }
  ],
  "notes": "Entregar pela manhã"
}
```

Response `201`:

```json
{
  "orderId": "ord_001",
  "orderCode": "HF-1001",
  "status": "pending_whatsapp_confirmation",
  "subtotalCents": 1798,
  "deliveryFeeCents": 0,
  "totalCents": 1798,
  "whatsappUrl": "https://wa.me/5592999999999?text=Pedido%20HF-1001",
  "whatsappMessage": "Pedido HF-1001..."
}
```

### `GET /api/v1/admin/orders`

Response `200`:

```json
{
  "items": [
    {
      "id": "ord_001",
      "orderCode": "HF-1001",
      "customerName": "Maria Souza",
      "status": "pending_whatsapp_confirmation",
      "totalCents": 1798,
      "createdAt": "2026-06-18T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### `GET /api/v1/admin/orders/:id`

Retorna detalhes completos do pedido, incluindo itens, endereço e histórico de status.

### `PATCH /api/v1/admin/orders/:id/status`

Request:

```json
{
  "status": "confirmed"
}
```

Response `200`:

```json
{
  "id": "ord_001",
  "status": "confirmed"
}
```

## 7. Modelo de Dados

### Coleção `orders`

```json
{
  "_id": "ObjectId",
  "storeId": "ObjectId",
  "orderCode": "HF-1001",
  "customerSnapshot": {
    "name": "Maria Souza",
    "phone": "5592999999999"
  },
  "deliveryAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "Manaus",
    "state": "AM",
    "zipCode": "69000000",
    "complement": "Casa amarela"
  },
  "itemsSnapshot": [
    {
      "productId": "ObjectId",
      "name": "Tomate",
      "unitLabel": "kg",
      "unitPriceCents": 899,
      "quantity": 2,
      "lineTotalCents": 1798
    }
  ],
  "notes": "Entregar pela manhã",
  "subtotalCents": 1798,
  "deliveryFeeCents": 0,
  "totalCents": 1798,
  "status": "pending_whatsapp_confirmation",
  "source": "pwa",
  "whatsappMessage": "Pedido HF-1001...",
  "createdAt": "2026-06-18T00:00:00.000Z",
  "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

## 8. Critérios de Aceite

- o cliente consegue criar pedido pelo catálogo sem login
- o sistema cria o pedido antes de abrir o WhatsApp
- o painel administrativo mostra o pedido recém-criado
- o pedido guarda snapshot dos preços e produtos
- a loja consegue atualizar status no painel
- o fluxo resolve o problema de pedido perdido em conversas soltas

## 9. Checklist de Testes

- validar criação de pedido com carrinho válido
- validar rejeição de carrinho vazio
- validar rejeição de produto indisponível
- validar geração da URL do WhatsApp
- validar persistência do snapshot de itens
- validar listagem administrativa autenticada
- validar transição de status permitida no MVP
