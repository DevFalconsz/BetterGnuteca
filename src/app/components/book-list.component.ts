import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

/**
 * Componente responsável por exibir a lista de todos os livros cadastrados.
 * Permite visualizar, editar e excluir livros.
 */
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  
  books: Book[] = [];
  loading = true;
  error = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * Carrega todos os livros do backend.
   */
  loadBooks(): void {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar livros:', error);
        this.error = 'Erro ao carregar a lista de livros. Verifique se o backend está rodando.';
        this.loading = false;
      }
    });
  }

  /**
   * Navega para a página de edição de um livro.
   * @param id ID do livro a ser editado
   */
  editBook(id: number): void {
    this.router.navigate(['/books/edit', id]);
  }

  /**
   * Exclui um livro após confirmação do usuário.
   * @param id ID do livro a ser excluído
   * @param titulo Título do livro (para exibir na confirmação)
   */
  deleteBook(id: number, titulo: string): void {
    if (confirm(`Tem certeza que deseja excluir o livro "${titulo}"?`)) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.loadBooks(); // Recarrega a lista após exclusão
        },
        error: (error) => {
          console.error('Erro ao excluir livro:', error);
          alert('Erro ao excluir o livro. Tente novamente.');
        }
      });
    }
  }

  /**
   * Navega para a página de visualização de detalhes de um livro.
   * @param id ID do livro
   */
  viewBook(id: number): void {
    this.router.navigate(['/books/view', id]);
  }

  /**
   * Navega para a página de criação de um novo livro.
   */
  addNewBook(): void {
    this.router.navigate(['/books/new']);
  }

  /**
   * Obtém a URL do PDF de um livro, se disponível.
   * @param book Livro
   * @returns URL do PDF ou null
   */
  getPdfUrl(book: Book): string | null {
    if (book.pdfPath) {
      const filename = book.pdfPath.split('/').pop() || '';
      return this.bookService.getPdfUrl(filename);
    }
    return null;
  }

  /**
   * Retorna a contagem de livros disponíveis.
   */
  get availableBooksCount(): number {
    return this.books.filter(b => b.disponivel).length;
  }

  /**
   * Retorna a contagem de livros indisponíveis.
   */
  get unavailableBooksCount(): number {
    return this.books.filter(b => !b.disponivel).length;
  }

  /**
   * Retorna a contagem de livros com PDF anexado.
   */
  get booksWithPdfCount(): number {
    return this.books.filter(b => b.pdfPath).length;
  }
}
