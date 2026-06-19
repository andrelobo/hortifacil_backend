# Spec - Auth MVP

## 1. Objetivo

Definir a autenticação mínima do painel administrativo do HortiFácil, permitindo login seguro para operadores da loja sem criar complexidade desnecessária no MVP.

## 2. Atores

- administrador da loja
- operador interno
- API backend
- frontend administrativo

## 3. Fluxo Principal

1. o usuário acessa o painel administrativo
2. o frontend exibe tela de login com e-mail e senha
3. o usuário envia as credenciais para a API
4. a API valida o usuário ativo e a senha
5. a API retorna um token JWT de acesso e os dados básicos do usuário e da loja
6. o frontend armazena a sessão e libera acesso às áreas administrativas
7. o frontend usa o token Bearer nas demais chamadas privadas
8. ao abrir novamente o painel, o frontend consulta `/auth/me` para validar a sessão

## 4. Regras de Negócio

- não existe auto cadastro público no MVP
- usuários administrativos são criados internamente
- apenas usuários ativos podem autenticar
- senha deve ser armazenada com hash seguro
- cada usuário pertence a uma loja
- o MVP pode operar inicialmente com uma loja principal, mas o modelo já deve suportar `storeId`
- o token deve ter expiração curta a moderada para reduzir risco
- logout no MVP pode ser client-side, removendo o token local

## 5. Casos de Erro

- credenciais inválidas devem retornar `401`
- usuário inativo deve retornar `403`
- token ausente ou inválido nas rotas protegidas deve retornar `401`
- tentativa de acessar recurso de outra loja deve retornar `403`
- payload inválido deve retornar `400`

## 6. Contrato de API

### `POST /api/v1/auth/login`

Request:

```json
{
  "email": "admin@loja.com",
  "password": "senhaSegura"
}
```

Response `200`:

```json
{
  "accessToken": "jwt-token",
  "expiresIn": 28800,
  "user": {
    "id": "usr_001",
    "name": "Administrador",
    "email": "admin@loja.com",
    "role": "admin",
    "storeId": "store_001"
  },
  "store": {
    "id": "store_001",
    "name": "HortiFácil Demo"
  }
}
```

### `GET /api/v1/auth/me`

Headers:

```txt
Authorization: Bearer <token>
```

Response `200`:

```json
{
  "user": {
    "id": "usr_001",
    "name": "Administrador",
    "email": "admin@loja.com",
    "role": "admin",
    "storeId": "store_001"
  },
  "store": {
    "id": "store_001",
    "name": "HortiFácil Demo"
  }
}
```

## 7. Modelo de Dados

### Coleção `users`

```json
{
  "_id": "ObjectId",
  "storeId": "ObjectId",
  "name": "Administrador",
  "email": "admin@loja.com",
  "passwordHash": "bcrypt-hash",
  "role": "admin",
  "isActive": true,
  "lastLoginAt": "2026-06-18T00:00:00.000Z",
  "createdAt": "2026-06-18T00:00:00.000Z",
  "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

### Coleção `stores`

```json
{
  "_id": "ObjectId",
  "name": "HortiFácil Demo",
  "slug": "hortifacil-demo",
  "isActive": true
}
```

## 8. Critérios de Aceite

- o login do painel funciona com e-mail e senha
- a API retorna JWT válido para usuário ativo
- rotas administrativas recusam acesso sem token
- o frontend consegue recuperar o usuário autenticado por `/auth/me`
- a modelagem já suporta vínculo com loja

## 9. Checklist de Testes

- validar login com credenciais corretas
- validar erro com senha incorreta
- validar erro com usuário inativo
- validar acesso autorizado em rota protegida
- validar rejeição de token ausente
- validar rejeição de token inválido
