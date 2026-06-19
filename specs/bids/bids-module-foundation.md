# Spec - Bids Module Foundation

## 1. Objetivo

Definir a base do módulo de licitações do HortiFácil como uma trilha opcional de organização comercial e documental para lojas que também operam com esse tipo de oportunidade.

## 2. Atores

- proprietário da loja
- operador comercial
- administrador interno
- API backend
- frontend administrativo

## 3. Fluxo Principal

1. o administrador acessa a área de licitações no painel
2. o usuário cadastra uma nova licitação com dados básicos do edital
3. o usuário registra itens, prazos e observações
4. o usuário vincula links ou referências de documentos
5. a equipe acompanha o andamento pelo status da licitação
6. a loja registra o resultado final para consulta futura

## 4. Regras de Negócio

- o módulo é opcional por loja
- não faz parte do núcleo obrigatório do primeiro ciclo do MVP
- documentos devem ser referenciados por link ou metadata no início, evitando armazenamento pesado de arquivos
- não haverá OCR, scraping ou automações pesadas no MVP
- cada licitação pertence a uma loja
- uma licitação pode possuir vários itens e documentos de referência
- status recomendados: `draft`, `monitoring`, `preparing_documents`, `submitted`, `won`, `lost`, `cancelled`, `archived`

## 5. Casos de Erro

- payload inválido deve retornar `400`
- usuário não autenticado deve retornar `401`
- tentativa de acessar licitação de outra loja deve retornar `403`
- licitação inexistente deve retornar `404`
- documento sem URL ou descrição mínima deve retornar `400`
- item com quantidade inválida deve retornar `400`

## 6. Contrato de API

### `POST /api/v1/admin/bids`

Request:

```json
{
  "title": "Edital de hortifrúti para merenda escolar",
  "agencyName": "Prefeitura Exemplo",
  "noticeNumber": "PE-2026-001",
  "publishDate": "2026-06-18",
  "openingDate": "2026-06-30",
  "status": "draft",
  "notes": "Separar documentação fiscal"
}
```

Response `201`:

```json
{
  "id": "bid_001",
  "title": "Edital de hortifrúti para merenda escolar",
  "status": "draft"
}
```

### `GET /api/v1/admin/bids`

Response `200`:

```json
{
  "items": [
    {
      "id": "bid_001",
      "title": "Edital de hortifrúti para merenda escolar",
      "agencyName": "Prefeitura Exemplo",
      "status": "draft",
      "openingDate": "2026-06-30"
    }
  ],
  "total": 1
}
```

### `POST /api/v1/admin/bids/:id/items`

Request:

```json
{
  "description": "Tomate",
  "quantity": 300,
  "unitLabel": "kg",
  "targetPriceCents": 700
}
```

### `POST /api/v1/admin/bids/:id/documents`

Request:

```json
{
  "label": "Edital completo",
  "url": "https://exemplo.gov.br/edital.pdf"
}
```

## 7. Modelo de Dados

### Coleção `bids`

```json
{
  "_id": "ObjectId",
  "storeId": "ObjectId",
  "title": "Edital de hortifrúti para merenda escolar",
  "agencyName": "Prefeitura Exemplo",
  "noticeNumber": "PE-2026-001",
  "publishDate": "2026-06-18",
  "openingDate": "2026-06-30",
  "status": "draft",
  "notes": "Separar documentação fiscal",
  "createdAt": "2026-06-18T00:00:00.000Z",
  "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

### Coleção `bid_items`

```json
{
  "_id": "ObjectId",
  "bidId": "ObjectId",
  "description": "Tomate",
  "quantity": 300,
  "unitLabel": "kg",
  "targetPriceCents": 700
}
```

### Coleção `bid_documents`

```json
{
  "_id": "ObjectId",
  "bidId": "ObjectId",
  "label": "Edital completo",
  "url": "https://exemplo.gov.br/edital.pdf"
}
```

## 8. Critérios de Aceite

- a loja consegue cadastrar e listar licitações
- a loja consegue adicionar itens e documentos por referência
- o módulo permanece leve e opcional
- a modelagem não depende de processamento pesado na VPS
- a trilha de licitações fica separada do núcleo do MVP de pedidos

## 9. Checklist de Testes

- validar criação de licitação com dados mínimos
- validar rejeição de payload inválido
- validar criação de item com quantidade válida
- validar rejeição de documento sem URL
- validar isolamento por loja
