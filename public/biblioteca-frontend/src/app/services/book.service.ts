import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

/**
 * Serviço responsável por fazer as requisições HTTP para a API do backend.
 * Implementa todas as operações CRUD para a entidade Book.
 */
@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  // URL base da API do backend Spring Boot
  private apiUrl = '/api/books';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private http: HttpClient) { }

  /**
   * Busca todos os livros cadastrados.
   * @returns Observable com array de livros
   */
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  /**
   * Busca um livro específico pelo ID.
   * @param id ID do livro
   * @returns Observable com o livro encontrado
   */
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo livro.
   * @param book Dados do livro a ser criado
   * @returns Observable com o livro criado
   */
  createBook(book: Book): Observable<Book> {
    console.log('Enviando para a API (createBook):', book);
    return this.http.post<Book>(this.apiUrl, book, this.httpOptions);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    console.log(`Enviando para a API (updateBook ${id}):`, book);
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book, this.httpOptions);
  }

  /**
   * Exclui um livro.
   * @param id ID do livro a ser excluído
   * @returns Observable vazio
   */
  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Faz upload de um arquivo PDF para um livro específico.
   * @param id ID do livro
   * @param file Arquivo PDF a ser enviado
   * @returns Observable com o livro atualizado
   */
  uploadPdf(id: number, file: File): Observable<Book> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<Book>(`${this.apiUrl}/${id}/upload-pdf`, formData);
  }

  /**
   * Obtém a URL para visualizar/baixar um arquivo PDF.
   * @param filename Nome do arquivo PDF
   * @returns URL completa para o arquivo
   */
  getPdfUrl(filename: string): string {
    return `/api/books/files/${filename}`;
  }
}
