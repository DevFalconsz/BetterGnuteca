/**
 * Interface que representa um Livro no sistema da Biblioteca.
 * Corresponde à entidade Book do backend Spring Boot.
 */
export interface Book {
  id?: number;
  titulo: string;
  autor: string;
  paginas: number;
  disponivel: boolean;
  dataPublicacao: string; // ISO date string (YYYY-MM-DD)
  pdfPath?: string;
}
