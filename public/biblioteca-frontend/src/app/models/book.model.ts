/**
 * Interface que representa um Livro no sistema da Biblioteca.
 * Corresponde à entidade Book do backend Spring Boot.
 */
import { Author } from './author.model';

export interface Book {
  id?: number;
  titulo: string;
  authorIds: number[];
  paginas: number;
  disponivel: boolean;
  dataPublicacao: string;
  pdfPath?: string;
}

