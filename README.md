# API de E-commerce

Esta é uma API para gerenciar produtos e carrinho de compras. Abaixo estão descritas as rotas disponíveis e exemplos de como usá-las.

## URL Base

A URL base para todas as requisições é:

```
http://localhost:3000
```

## Endpoints

### **Produtos**

#### 1. Buscar todos os produtos

Retorna todos os produtos cadastrados.

- **Método**: `GET`
- **Endpoint**: `/produtos`
- **Exemplo de requisição**:

  ```
  GET http://localhost:3000/produtos
  ```

#### 2. Criar um produto

Cria um novo produto no sistema.

- **Método**: `POST`
- **Endpoint**: `/produtos`
- **Cabeçalho**: `Content-Type: application/json`
- **Corpo da requisição**:
  ```
  {
    "name": "Produto 1",
    "description": "",
    "price": 12.54,
    "stock": 100
  }
  ```

#### 3. Atualizar um produto

Atualiza as informações de um produto existente.

- **Método**: `PATCH`
- **Endpoint**: `/produtos/{id}`
- **Cabeçalho**: `Content-Type: application/json`
- **Corpo da requisição**:
  ```
  {
    "name": "Produto editado 1",
    "description": "Descrição"
  }
  ```

---

### **Carrinho**

#### 1. Buscar o carrinho

Retorna todos os itens no carrinho do usuário.

- **Método**: `GET`
- **Endpoint**: `/carrinho`
- **Exemplo de requisição**:

```
GET http://localhost:3000/carrinho
```

#### 2. Adicionar item ao carrinho

Adiciona um produto ao carrinho.

- **Método**: `POST`
- **Endpoint**: `/carrinho/item/{produtoId}`
- **Cabeçalho**: `Content-Type: application/json`
- **Exemplo de requisição**:
  ```
  POST http://localhost:3000/carrinho/item/1
  ```

#### 3. Remover item do carrinho

Remove um produto do carrinho.

- **Método**: `DELETE`
- **Endpoint**: `/carrinho/item/{itemId}`
- **Exemplo de requisição**:
  ```
  DELETE http://localhost:3000/carrinho/item/1
  ```

#### 4. Atualizar quantidade de item no carrinho

Atualiza a quantidade de um item no carrinho.

- **Método**: `PATCH`
- **Endpoint**: `/carrinho/atualizar-quantidade-item/{itemId}`
- **Cabeçalho**: `Content-Type: application/json`
- **Exemplo de requisição**:
  ```
  PATCH http://localhost:3000/carrinho/atualizar-quantidade-item/2
  ```
- **Corpo da requisição**:
  ```
  {
    "quantity": 30
  }
  ```

#### 5. Finalizar compra (Checkout)

Realiza o checkout, finalizando a compra do carrinho e atualizando valores de estoque dos itens.

- **Método**: `POST`
- **Endpoint**: `/carrinho/checkout`
- **Exemplo de requisição**:
  ```
  POST http://localhost:3000/carrinho/checkout
  ```

---

## Estrutura de Respostas

Todas as respostas da API seguem o formato JSON. Abaixo está um exemplo de resposta para a criação de um produto:

```
{
  "id": 1,
  "name": "Produto 1",
  "description": "",
  "price": 12.54,
  "stock": 100
}
```

Para requisições de erro, o formato da resposta será o seguinte:

```
{
  "statusCode": 400,
  "message": "Erro na validação dos dados",
  "error": "Bad Request"
}
```

---

## Dependências

Para rodar essa API, é necessário ter o Node.js instalado, além dos seguintes pacotes:

- **Nest.js**: Framework para a construção da API.
- **TypeORM**: ORM para interagir com o banco de dados.
- **SQLite**: Banco de dados em memória para ambiente de desenvolvimento.

---

## Testes

Para rodar os testes da API, execute o seguinte comando:

```
npm run test
```

Isso irá rodar todos os testes do projeto.
