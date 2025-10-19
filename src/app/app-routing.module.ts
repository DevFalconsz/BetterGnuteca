import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/book-list.component';
import { BookFormComponent } from './components/book-form.component';
import { BookDetailComponent } from './components/book-detail.component';

/**
 * Configuração das rotas da aplicação.
 * Define as URLs e os componentes correspondentes.
 */
const routes: Routes = [
  // Rota padrão - redireciona para a lista de livros
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  
  // Rota para listar todos os livros
  { path: 'books', component: BookListComponent },
  
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
