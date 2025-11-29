import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css']
})
export class AuthorFormComponent implements OnInit {
  authorForm: FormGroup;
  isEditMode = false;
  authorId: number | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      dataNascimento: [''],
      nacionalidade: [''],
      biografia: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.authorId = +params['id'];
        this.loadAuthorData();
      }
    });
  }

  loadAuthorData(): void {
    if (this.authorId) {
      this.authorService.getAuthorById(this.authorId).subscribe({
        next: (author: Author) => {
          this.authorForm.patchValue(author);
        },
        error: (err: any) => {
          this.error = 'Erro ao carregar os dados do autor.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const authorData: Author = this.authorForm.value;

      const operation = this.isEditMode
        ? this.authorService.updateAuthor(this.authorId!, authorData)
        : this.authorService.createAuthor(authorData);

      operation.subscribe({
        next: (author: Author) => {
          this.success = `Autor ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/authors']);
          }, 2000);
        },
        error: (err: any) => {
          this.error = `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} o autor.`;
          this.loading = false;
        }
      });
    } else {
      this.authorForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/authors']);
  }
}
