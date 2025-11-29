import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/book-list.component';
import { BookFormComponent } from './components/book-form.component';
import { BookDetailComponent } from './components/book-detail.component';
import { AuthorListComponent } from './components/author-list/author-list.component';
import { AuthorFormComponent } from './components/author-form/author-form.component';
import { AuthorDetailComponent } from './components/author-detail/author-detail.component';

/**
 * Configuração das rotas da aplicação.
 * Define as URLs e os componentes correspondentes.
 */
const routes: Routes = [
  // Rota padrão - redireciona para a lista de livros
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  
  // Rota para listar todos os livros
  { path: 'books', component: BookListComponent },
  
  // Rota para listar todos os autores
  { path: 'authors', component: AuthorListComponent },
  
  // Rota para criar um novo autor
  { path: 'authors/new', component: AuthorFormComponent },

  // Rota para visualizar detalhes de um autor específico
  { path: 'authors/:id', component: AuthorDetailComponent },

  // Rota para editar um autor específico
  { path: 'authors/edit/:id', component: AuthorFormComponent },

  // Rota para criar um novo livro
  { path: 'books/new', component: BookFormComponent },
  
  // Rota para visualizar detalhes de um livro específico
  { path: 'books/view/:id', component: BookDetailComponent },
  
  // Rota para editar um livro específico
  { path: 'books/edit/:id', component: BookFormComponent },
  
  // Rota curinga - redireciona para a lista de livros caso a URL não seja encontrada
  { path: '**', redirectTo: '/books' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
