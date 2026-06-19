# Spec - Deploy e Separação de Repositórios

## 1. Objetivo

Definir a arquitetura operacional mínima para o HortiFácil, separando frontend e backend em repositórios distintos e preparando deploy leve para Vercel, VPS `lobojow` e MongoDB Atlas.

## 2. Atores

- desenvolvedor
- tech lead
- DevOps
- Vercel
- VPS `lobojow`
- MongoDB Atlas

## 3. Fluxo Principal

1. o time mantém um repositório exclusivo do frontend
2. o time mantém um repositório exclusivo do backend
3. o frontend é publicado na Vercel
4. o backend é publicado de forma independente na VPS `lobojow`
5. o backend se conecta ao MongoDB Atlas por variável de ambiente
6. o frontend consome a API pública do backend via URL configurada por ambiente
7. a VPS expõe apenas o necessário para a API e monitoramento

Observação operacional atual:

- o frontend seguirá em trilha própria com OpenDesign
- este repositório atual corresponde à trilha do backend

## 4. Regras de Negócio

- frontend e backend não devem compartilhar o mesmo repositório final
- o frontend deve permanecer fora da VPS sempre que possível
- o backend deve ser dockerizado
- não usar MongoDB local na VPS
- não usar componentes pesados incompatíveis com a capacidade da `lobojow`
- a API deve expor `healthcheck`
- a API deve expor Swagger/OpenAPI em ambiente controlado
- variáveis sensíveis devem vir de ambiente
- CORS deve permitir apenas origens esperadas do frontend

## 5. Casos de Erro

- variável `MONGODB_URI` ausente deve impedir subida saudável da API
- URL do frontend não configurada corretamente deve bloquear CORS esperado
- falha no Atlas deve refletir em `healthcheck` degradado
- container sem memória suficiente deve ser tratado com configuração enxuta e observabilidade mínima

## 6. Contrato de API

### `GET /api/v1/health`

Response `200` quando saudável:

```json
{
  "status": "ok",
  "service": "hortifacil-api",
  "database": "ok"
}
```

### `GET /api/docs`

Disponibiliza Swagger/OpenAPI quando habilitado por ambiente.

## 7. Modelo de Dados

### Variáveis de ambiente mínimas do backend

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=change-me
FRONTEND_URL=https://app-hortifacil.vercel.app
STORE_DEFAULT_TIMEZONE=America/Manaus
```

### Estrutura operacional mínima

```txt
frontend-repo -> Vercel
backend-repo -> Docker -> VPS lobojow
database -> MongoDB Atlas
```

## 8. Critérios de Aceite

- existe separação clara entre frontend e backend
- o frontend consegue apontar para a API por variável de ambiente
- o backend sobe via container leve
- a API responde em `healthcheck`
- a infraestrutura respeita as limitações da VPS `lobojow`

## 9. Checklist de Testes

- validar build e deploy independentes de frontend e backend
- validar conexão do backend com MongoDB Atlas
- validar `healthcheck` saudável
- validar CORS com a origem da Vercel
- validar ausência de dependência de banco local na VPS
