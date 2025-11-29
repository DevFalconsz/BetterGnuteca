import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';
import { Author } from '../models/author.model';
import { AuthorService } from '../services/author.service';

/**
 * Componente responsável por exibir os detalhes completos de um livro.
 * Inclui visualização de PDF quando disponível.
 */
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  
  book: Book | null = null;
  loading = true;
  error = '';
  pdfUrl = '';
  showPdfViewer = false;
  authors: Author[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    this.loadAuthors();
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      if (id) {
        this.loadBook(id);
      }
    });
  }

  loadAuthors(): void {
    this.authorService.getAllAuthors().subscribe({
      next: (authors: Author[]) => {
        this.authors = authors;
      },
      error: (err: any) => {
        this.error = 'Failed to load authors.';
      }
    });
  }

  /**
   * Carrega os detalhes de um livro específico.
   * @param id ID do livro
   */
  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book: any) => {
        this.book = {
          ...book,
          authorIds: book.authors ? book.authors.map((a: Author) => a.id) : []
        };
        this.setupPdfUrl();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar livro:', error);
        this.error = 'Erro ao carregar os detalhes do livro.';
        this.loading = false;
      }
    });
  }

  /**
   * Retorna os nomes dos autores com base nos IDs.
   * @param authorIds Array de IDs de autores
   * @returns String com nomes dos autores separados por vírgula
   */
  getAuthorNames(authorIds: number[]): string {
    if (!authorIds || authorIds.length === 0) {
      return 'Nenhum autor';
    }
    return authorIds.map(id => this.authors.find(a => a.id === id)?.name || 'Autor Desconhecido').join(', ');
  }

  /**
   * Configura a URL do PDF se disponível.
   */
  setupPdfUrl(): void {
    if (this.book && this.book.pdfPath) {
      const filename = this.book.pdfPath.split('/').pop() || '';
      this.pdfUrl = this.bookService.getPdfUrl(filename);
    }
  }

  /**
   * Alterna a exibição do visualizador de PDF.
   */
  togglePdfViewer(): void {
    this.showPdfViewer = !this.showPdfViewer;
  }

  /**
   * Navega para a página de edição do livro.
   */
  editBook(): void {
    if (this.book && this.book.id) {
      this.router.navigate(['/books/edit', this.book.id]);
    }
  }

  /**
   * Exclui o livro após confirmação.
   */
  deleteBook(): void {
    if (this.book && this.book.id) {
      if (confirm(`Tem certeza que deseja excluir o livro "${this.book.titulo}"?`)) {
        this.bookService.deleteBook(this.book.id).subscribe({
          next: () => {
            this.router.navigate(['/books']);
          },
          error: (error: any) => {
            console.error('Erro ao excluir livro:', error);
            alert('Erro ao excluir o livro. Tente novamente.');
          }
        });
      }
    }
  }

  /**
   * Volta para a lista de livros.
   */
  goBack(): void {
    this.router.navigate(['/books']);
  }

  /**
   * Abre o PDF em uma nova aba.
   */
  openPdfInNewTab(): void {
    if (this.pdfUrl) {
      window.open(this.pdfUrl, '_blank');
    }
  }

  /**
   * Faz download do PDF.
   */
  downloadPdf(): void {
    if (this.pdfUrl && this.book) {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download = `${this.book.titulo}.pdf`;
      link.click();
    }
  }
}
