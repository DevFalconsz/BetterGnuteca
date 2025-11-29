
# Projeto Biblioteca

Este é um projeto full-stack de um sistema de gerenciamento de biblioteca, composto por um backend em Java com Spring Boot e um frontend em Angular.

## Estrutura de Arquivos

```
.
├── biblioteca-backend-final/
│   └── biblioteca/
│       ├── pom.xml
│       └── src/
│           ├── main/
│           │   ├── java/
│           │   └── resources/
│           └── test/
└── bibliotecafrontend_fixed/
    ├── angular.json
    ├── package.json
    └── src/
        ├── app/
        ├── environments/
        └── ...
```

## Backend (Spring Boot)

O backend é uma aplicação Java que utiliza o framework Spring Boot para fornecer uma API RESTful para o gerenciamento de livros e autores.

### Pré-requisitos

- Java 17 ou superior
- Maven

### Como Executar

1. Navegue até o diretório do backend:
   ```bash
   cd biblioteca-backend-final/biblioteca
   ```
2. Execute a aplicação com o Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
A aplicação estará disponível em `http://localhost:8080`.

## Frontend (Angular)

O frontend é uma aplicação em Angular que consome a API do backend para fornecer uma interface de usuário para o sistema de biblioteca.

### Pré-requisitos

- Node.js e npm (ou pnpm/yarn)

### Como Executar

1. Navegue até o diretório do frontend:
   ```bash
   cd bibliotecafrontend_fixed
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
   ou
   ```bash
   pnpm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
A aplicação estará disponível em `http://localhost:4200`.

## Como Usar o Projeto Completo

Para usar o projeto completo, tanto o backend quanto o frontend devem estar em execução. Siga os passos de execução para ambas as partes do projeto. O frontend irá se conectar automaticamente ao backend para buscar e enviar dados.
