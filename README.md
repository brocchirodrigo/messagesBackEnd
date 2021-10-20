# Backend para mensagens

Projeto desenvolvido no NLW Heat 2021 com as seguintes especificações.

1. Autenticado com o Oath Github para obter e logar os dados do usuário
2. Dados de autenticação salvos em um PostgresSQL para:
  * Schema Users (Obtidos do github)
  * Schema Messages (Criadas pelo usuário logado)

## Execução
* Ao clonar o projeto, executar o comando yarn para instalar as dependências.
* A definição da porta, chaves do github para aplicação Oath e o JWT secret gerado pelo usuário deverão ser configurados em um arquivo ".env".

### Utilização do Prisma
Antes de executar o projeto, será necessário aplicar as migrations com o comando yarn prisma migrate dev

## Rotas
URL de entrada: https://messageappnlw.herokuapp.com
 * POST /authenticate para obter o token
 * POST /messages para criar as mensagens
 * GET /user/profile para obter os dados do usuário logado
 * GET /messages/last3 para obter as últimas 3 mensagens
