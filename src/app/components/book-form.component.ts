import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

/**
 * Componente responsável pelo formulário de criação e edição de livros.
 * Permite criar novos livros e editar livros existentes.
 */
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

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicializa o formulário reativo com validações
    this.bookForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      autor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      paginas: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      disponivel: [true, Validators.required],
      dataPublicacao: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Verifica se está em modo de edição baseado na rota
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = +params['id'];
        this.loadBook();
      }
    });
  }

  /**
   * Carrega os dados de um livro para edição.
   */
  loadBook(): void {
    if (this.bookId) {
      this.loading = true;
      this.bookService.getBookById(this.bookId).subscribe({
        next: (book) => {
          this.bookForm.patchValue({
            titulo: book.titulo,
            autor: book.autor,
            paginas: book.paginas,
            disponivel: book.disponivel,
            dataPublicacao: book.dataPublicacao
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar livro:', error);
          this.error = 'Erro ao carregar os dados do livro.';
          this.loading = false;
        }
      });
    }
  }

  /**
   * Manipula a seleção de arquivo PDF.
   * @param event Evento de seleção de arquivo
   */
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

  /**
   * Submete o formulário para criar ou atualizar um livro.
   */
  onSubmit(): void {
    if (this.bookForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const bookData: Book = this.bookForm.value;

      const operation = this.isEditMode 
        ? this.bookService.updateBook(this.bookId!, bookData)
        : this.bookService.createBook(bookData);

      operation.subscribe({
        next: (book) => {
          this.success = this.isEditMode 
            ? 'Livro atualizado com sucesso!' 
            : 'Livro criado com sucesso!';
          
          // Se há um arquivo PDF selecionado, faz o upload
          if (this.selectedFile && book.id) {
            this.uploadPdf(book.id);
          } else {
            this.loading = false;
            // Redireciona após 2 segundos
            setTimeout(() => {
              this.router.navigate(['/books']);
            }, 2000);
          }
        },
        error: (error) => {
          console.error('Erro ao salvar livro:', error);
          this.error = 'Erro ao salvar o livro. Verifique os dados e tente novamente.';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Faz upload do arquivo PDF para o livro.
   * @param bookId ID do livro
   */
  uploadPdf(bookId: number): void {
    if (this.selectedFile) {
      this.bookService.uploadPdf(bookId, this.selectedFile).subscribe({
        next: () => {
          this.success += ' PDF enviado com sucesso!';
          this.loading = false;
          // Redireciona após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erro ao fazer upload do PDF:', error);
          this.error = 'Livro salvo, mas houve erro no upload do PDF.';
          this.loading = false;
        }
      });
    }
  }

  /**
   * Marca todos os campos do formulário como tocados para exibir validações.
   */
  markFormGroupTouched(): void {
    Object.keys(this.bookForm.controls).forEach(key => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica se um campo específico tem erro e foi tocado.
   * @param fieldName Nome do campo
   * @returns true se o campo tem erro e foi tocado
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtém a mensagem de erro para um campo específico.
   * @param fieldName Nome do campo
   * @returns Mensagem de erro
   */
  getFieldError(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} é obrigatório.`;
      if (field.errors['minlength']) return `${fieldName} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres.`;
      if (field.errors['maxlength']) return `${fieldName} deve ter no máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
      if (field.errors['min']) return `${fieldName} deve ser maior que ${field.errors['min'].min}.`;
      if (field.errors['max']) return `${fieldName} deve ser menor que ${field.errors['max'].max}.`;
    }
    return '';
  }

  /**
   * Cancela a operação e volta para a lista de livros.
   */
  cancel(): void {
    this.router.navigate(['/books']);
  }
}
