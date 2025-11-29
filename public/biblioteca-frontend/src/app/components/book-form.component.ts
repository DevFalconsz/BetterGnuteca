import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';
import { Author } from '../models/author.model';
import { AuthorService } from '../services/author.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  
  bookForm: FormGroup;
  isEditMode = false;
  bookId: number | null = null;
  loading = false;
  error = '';
  success = '';
  selectedFile: File | null = null;
  authors: Author[] = [];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      authorIds: [[], Validators.required], 
      paginas: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      disponivel: [true, Validators.required],
      dataPublicacao: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAuthors();
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = +params['id'];
        this.loadBook();
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

  loadBook(): void {
    if (this.bookId) {
      this.loading = true;
      this.bookService.getBookById(this.bookId).subscribe({
        next: (book: any) => {
          this.bookForm.patchValue({
            titulo: book.titulo,
            paginas: book.paginas,
            disponivel: book.disponivel,
            dataPublicacao: book.dataPublicacao
          });
          
          const authorIds = book.authors ? book.authors.map((a: Author) => a.id) : [];
          this.bookForm.get('authorIds')?.setValue(authorIds);

          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar livro:', error);
          this.error = 'Erro ao carregar os dados do livro.';
          this.loading = false;
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.error = '';
      } else {
        this.error = 'Por favor, selecione apenas arquivos PDF.';
        this.selectedFile = null;
        event.target.value = '';
      }
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formValue = this.bookForm.value;

      const bookData: Book = {
        titulo: formValue.titulo,
        authorIds: formValue.authorIds,
        paginas: formValue.paginas,
        disponivel: formValue.disponivel,
        dataPublicacao: formValue.dataPublicacao
      };

      console.log('Dados do livro a serem enviados:', bookData);

      const operation = this.isEditMode 
        ? this.bookService.updateBook(this.bookId!, bookData)
        : this.bookService.createBook(bookData);

      operation.subscribe({
        next: (book: Book) => {
          this.success = this.isEditMode 
            ? 'Livro atualizado com sucesso!' 
            : 'Livro criado com sucesso!';
          
          if (this.selectedFile && book.id) {
            this.uploadPdf(book.id);
          } else {
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/books']);
            }, 2000);
          }
        },
        error: (error: any) => {
          console.error('Erro ao salvar livro:', error);
          this.error = 'Erro ao salvar o livro. Verifique os dados e tente novamente.';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  uploadPdf(bookId: number): void {
    if (this.selectedFile) {
      this.bookService.uploadPdf(bookId, this.selectedFile).subscribe({
        next: () => {
          this.success += ' PDF enviado com sucesso!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Erro ao fazer upload do PDF:', error);
          this.error = 'Livro salvo, mas houve erro no upload do PDF.';
          this.loading = false;
        }
      });
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.bookForm.controls).forEach(key => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `O campo é obrigatório.`;
      if (field.errors['minlength']) return `Deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres.`;
      if (field.errors['maxlength']) return `Deve ter no máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
      if (field.errors['min']) return `O valor deve ser maior que ${field.errors['min'].min}.`;
      if (field.errors['max']) return `O valor deve ser menor que ${field.errors['max'].max}.`;
    }
    return '';
  }

  cancel(): void {
    this.router.navigate(['/books']);
  }
}
