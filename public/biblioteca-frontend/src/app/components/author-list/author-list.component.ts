import { Component, OnInit } from '@angular/core';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  loading = true;
  error = '';
  success = '';

  constructor(private authorService: AuthorService) { }

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.loading = true;
    this.authorService.getAllAuthors().subscribe({
      next: (authors: Author[]) => {
        this.authors = authors;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load authors.';
        this.loading = false;
      }
    });
  }

  deleteAuthor(id: number): void {
    if (confirm('Tem certeza de que deseja excluir este autor?')) {
      this.authorService.deleteAuthor(id).subscribe({
        next: () => {
          this.success = 'Autor excluído com sucesso.';
          this.loadAuthors(); // Recarrega a lista
        },
        error: (err: any) => {
          this.error = 'Erro ao excluir o autor.';
        }
      });
    }
  }
}
