export interface Author {
  id?: number;
  name: string;
}

export interface Book {
  id?: number;
  titulo: string;
  authors: Author[];
  paginas: number;
  disponivel: boolean;
  dataPublicacao: string;
  pdfPath?: string;
}
