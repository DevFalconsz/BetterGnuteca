import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorFormComponent } from './components/author-form/author-form.component';
import { AuthorListComponent } from './components/author-list/author-list.component';
import { BookDetailComponent } from './components/book-detail.component';
import { BookFormComponent } from './components/book-form.component';
import { BookListComponent } from './components/book-list.component';
import { AuthorDetailComponent } from './components/author-detail/author-detail.component';
import { AuthorService } from './services/author.service';
import { BookService } from './services/book.service';
import { NgSelectModule } from '@ng-select/ng-select';

/**
 * Módulo principal da aplicação Angular.
 * Configura todos os componentes, serviços e dependências necessárias.
 */
@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookFormComponent,
    BookDetailComponent,
    AuthorListComponent,
    AuthorFormComponent,
    AuthorDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgSelectModule
  ],
  providers: [
    BookService,
    AuthorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
