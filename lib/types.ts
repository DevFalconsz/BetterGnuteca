export interface Book {
  id?: number
  titulo: string
  autor: string
  paginas: number
  disponivel: boolean
  dataPublicacao: string
  pdfPath?: string
}
