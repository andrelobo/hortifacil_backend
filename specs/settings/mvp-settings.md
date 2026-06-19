# Spec - Settings MVP

## 1. Objetivo

Definir o módulo de configurações da loja do HortiFácil, concentrando os dados operacionais necessários para catálogo público, pedidos e painel administrativo.

## 2. Atores

- administrador da loja
- API backend
- frontend administrativo
- frontend público

## 3. Fluxo Principal

1. o administrador acessa a área de configurações
2. o administrador informa nome da loja, telefone de WhatsApp, endereço e parâmetros operacionais
3. a API valida e salva as configurações
4. o frontend público consome essas configurações para exibir identidade e contato
5. o módulo de pedidos usa essas configurações para gerar o link de WhatsApp e comportamentos básicos de entrega

## 4. Regras de Negócio

- cada loja deve possuir um documento principal de configurações
- telefone de WhatsApp é obrigatório para o fluxo de pedidos
- configurações devem ser isoladas por loja
- a configuração pode conter taxa de entrega padrão, horário de funcionamento e mensagem de atendimento
- o MVP deve evitar customizações visuais complexas demais
- mudanças em configurações devem refletir rapidamente no frontend público

## 5. Casos de Erro

- acesso administrativo sem autenticação deve retornar `401`
- tentativa de acessar configuração de outra loja deve retornar `403`
- telefone de WhatsApp ausente deve retornar `400`
- payload inválido deve retornar `400`

## 6. Contrato de API

### `GET /api/v1/admin/settings`

Retorna as configurações da loja para edição administrativa.

### `PUT /api/v1/admin/settings`

Request:

```json
{
  "storeName": "HortiFácil Demo",
  "whatsappNumber": "5592999999999",
  "primaryColor": "#2F855A",
  "deliveryFeeCents": 0,
  "minimumOrderCents": 0,
  "businessHours": "Seg a Sab 07:00-18:00",
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "Manaus",
    "state": "AM",
    "zipCode": "69000000"
  }
}
```

Response `200`:

```json
{
  "storeName": "HortiFácil Demo",
  "whatsappNumber": "5592999999999",
  "deliveryFeeCents": 0,
  "minimumOrderCents": 0
}
```

### `GET /api/v1/public/settings`

Retorna somente os dados públicos necessários para o catálogo.

## 7. Modelo de Dados

### Coleção `settings`

```json
{
  "_id": "ObjectId",
  "storeId": "ObjectId",
  "storeName": "HortiFácil Demo",
  "whatsappNumber": "5592999999999",
  "logoUrl": null,
  "primaryColor": "#2F855A",
  "deliveryFeeCents": 0,
  "minimumOrderCents": 0,
  "businessHours": "Seg a Sab 07:00-18:00",
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "Manaus",
    "state": "AM",
    "zipCode": "69000000"
  },
  "createdAt": "2026-06-18T00:00:00.000Z",
  "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

## 8. Critérios de Aceite

- o administrador consegue salvar configurações da loja
- o telefone de WhatsApp fica disponível para o fluxo de pedidos
- o catálogo público consegue consumir dados públicos da loja
- o módulo continua leve e adequado ao MVP

## 9. Checklist de Testes

- validar leitura administrativa autenticada
- validar atualização de configurações
- validar rejeição sem telefone de WhatsApp
- validar leitura pública limitada aos campos necessários
- validar isolamento por loja
