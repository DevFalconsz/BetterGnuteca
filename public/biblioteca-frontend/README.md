# Sistema de Biblioteca - Frontend Angular

Sistema moderno e minimalista de gerenciamento de biblioteca desenvolvido em Angular 18.

## 🚀 Funcionalidades

- ✅ CRUD completo de livros
- 📄 Upload e visualização de arquivos PDF
- 📊 Dashboard com estatísticas
- 🎨 Design minimalista e responsivo
- 🔍 Interface intuitiva e moderna

## 🛠️ Tecnologias

- **Angular 18** - Framework principal
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **Font Awesome** - Ícones
- **CSS3** - Estilização moderna

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Angular CLI 18+

## 🔧 Instalação

1. Clone o repositório
\`\`\`bash
git clone <url-do-repositorio>
cd biblioteca-frontend
\`\`\`

2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

3. Configure a URL da API
Edite o arquivo `src/environments/environment.ts` e configure a URL do backend:
\`\`\`typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
\`\`\`

## 🚀 Executando o projeto

### Modo de desenvolvimento
\`\`\`bash
npm start
# ou
ng serve
\`\`\`

Acesse `http://localhost:4200` no navegador.

### Build de produção
\`\`\`bash
npm run build
# ou
ng build
\`\`\`

Os arquivos de build estarão na pasta `dist/`.

## 📁 Estrutura do Projeto

\`\`\`
src/
├── app/
│   ├── components/          # Componentes da aplicação
│   │   ├── book-list/       # Lista de livros
│   │   ├── book-form/       # Formulário de livros
│   │   └── book-detail/     # Detalhes do livro
│   ├── models/              # Modelos de dados
│   ├── services/            # Serviços (API)
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
├── assets/                  # Arquivos estáticos
├── environments/            # Configurações de ambiente
└── styles.css              # Estilos globais
\`\`\`

## 🎨 Design

O projeto utiliza um design minimalista e moderno com:
- Paleta de cores neutras com acentos azuis
- Tipografia limpa e legível
- Espaçamento generoso
- Cards com sombras sutis
- Layout totalmente responsivo
- Animações suaves

## 🔗 Rotas

- `/` - Redireciona para `/books`
- `/books` - Lista de todos os livros
- `/books/new` - Formulário para criar novo livro
- `/books/edit/:id` - Formulário para editar livro
- `/books/view/:id` - Visualizar detalhes do livro

## 🌐 API Backend

O frontend espera que o backend esteja rodando em `http://localhost:8080` com os seguintes endpoints:

- `GET /books` - Listar todos os livros
- `GET /books/{id}` - Buscar livro por ID
- `POST /books` - Criar novo livro
- `PUT /books/{id}` - Atualizar livro
- `DELETE /books/{id}` - Excluir livro
- `POST /books/{id}/upload-pdf` - Upload de PDF
- `GET /books/files/{filename}` - Buscar arquivo PDF

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para gerenciamento moderno de bibliotecas.
