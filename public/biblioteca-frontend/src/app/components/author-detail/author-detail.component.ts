import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.css']
})
export class AuthorDetailComponent implements OnInit {
  author: Author | null = null;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.authorService.getAuthorById(+id).subscribe({
        next: (author: Author) => {
          this.author = author;
        },
        error: (err: any) => {
          this.error = 'Erro ao carregar os detalhes do autor.';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/authors']);
  }
}