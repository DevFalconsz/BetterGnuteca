# BetterGnuteca

## 📖 Introdução
O **BetterGnuteca** é um sistema de gerenciamento de biblioteca desenvolvido em **Java com Spring Boot**.  
Ele permite cadastrar, listar, atualizar e remover livros, oferecendo uma API REST simples e eficiente para controle de acervo.  

Este projeto tem como objetivo ser uma versão aprimorada e simplificada de sistemas de biblioteca tradicionais.

---

## 📂 Estrutura do Projeto
```
BetterGnuteca/
├── biblioteca/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/biblioteca/
│   │   │   │   ├── controller/   # Controladores REST
│   │   │   │   ├── model/        # Entidades do sistema
│   │   │   │   ├── repository/   # Interfaces JPA
│   │   │   │   └── service/      # Regras de negócio
│   │   │   └── resources/        # Configurações (application.properties)
│   │   └── test/                 # Testes automatizados
│   └── pom.xml                   # Configuração Maven
└── README.md
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Java 17+**
- **Maven 3.8+**
- Banco de dados configurado (por padrão: H2 em memória, configurável no `application.properties`)

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/DevFalconsz/BetterGnuteca.git
   cd BetterGnuteca/biblioteca
   ```

2. Compile o projeto:
   ```bash
   mvn clean install
   ```

3. Execute a aplicação:
   ```bash
   mvn spring-boot:run
   ```

4. A API estará disponível em:
   ```
   http://localhost:8080
   ```

---

## 📌 Endpoints da API

### 📚 Livros (`/books`)
- **GET** `/books` → Lista todos os livros
- **GET** `/books/{id}` → Retorna detalhes de um livro
- **POST** `/books` → Cadastra um novo livro  
  **Exemplo de JSON:**
  ```json
  {
    "title": "Dom Casmurro",
    "author": "Machado de Assis",
    "isbn": "978-8572326976"
  }
  ```
- **PUT** `/books/{id}` → Atualiza os dados de um livro existente
- **DELETE** `/books/{id}` → Remove um livro do acervo

---

## ⚙️ Configuração

O arquivo `application.properties` define parâmetros como banco de dados, porta da aplicação e logs.  
Exemplo padrão:
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

---

## 📦 Dependências

- **Spring Boot Starter Web** → Criação da API REST  
- **Spring Boot Starter Data JPA** → Persistência de dados  
- **H2 Database** (padrão, mas pode ser substituído por MySQL/PostgreSQL)  
- **Lombok** (para simplificação do código)  
- **JUnit 5** (para testes)  

---

## 🛠️ Contribuição

Contribuições são bem-vindas!  
Para colaborar:
1. Faça um fork do projeto  
2. Crie uma branch: `git checkout -b minha-feature`  
3. Commit suas alterações: `git commit -m 'Adiciona minha feature'`  
4. Push: `git push origin minha-feature`  
5. Abra um Pull Request  

---

## 📜 Licença
Este projeto está licenciado sob a licença **MIT**.  
Sinta-se livre para usar, modificar e distribuir.
