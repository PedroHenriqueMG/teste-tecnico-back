# Login API

## Documentação da API

#### Como rodar a API

Dê um clone no projeto, e rode os seguintes comandos

```http
 docker-compose up -d
 npx prisma migrate dev
```

lembre-se de colovar um .env, seguindo o exemplo, no JWT_PASS coloque uma senha criptografada se possível

## Rotas disponiveis na API

#### /signup

| Parâmetro  | Tipo     | Descrição   |
| :--------- | :------- | :---------- |
| `email`    | `string` | Obrigatório |
| `name`     | `string` | Obrigatório |
| `password` | `string` | Obrigatório |

#### /login

| Parâmetro  | Tipo     | Descrição   |
| :--------- | :------- | :---------- |
| `email`    | `string` | Obrigatório |
| `password` | `string` | Obrigatório |

#### /

| Parâmetro      | Tipo     | Descrição   |
| :------------- | :------- | :---------- |
| `Bearer Token` | `string` | Obrigatório |
