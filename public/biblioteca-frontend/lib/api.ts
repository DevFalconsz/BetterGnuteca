import type { Book } from "./types"

const API_URL = "/api/books"

export async function getAllBooks(): Promise<Book[]> {
  const response = await fetch(API_URL, { cache: "no-store" })
  if (!response.ok) throw new Error("Falha ao carregar livros")
  return response.json()
}

export async function getBookById(id: number): Promise<Book> {
  const response = await fetch(`${API_URL}/${id}`, { cache: "no-store" })
  if (!response.ok) throw new Error("Falha ao carregar livro")
  return response.json()
}

export async function createBook(book: Book): Promise<Book> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  })
  if (!response.ok) throw new Error("Falha ao criar livro")
  return response.json()
}

export async function updateBook(id: number, book: Book): Promise<Book> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  })
  if (!response.ok) throw new Error("Falha ao atualizar livro")
  return response.json()
}

export async function deleteBook(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Falha ao excluir livro")
}

export async function uploadPdf(id: number, file: File): Promise<Book> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_URL}/${id}/upload-pdf`, {
    method: "POST",
    body: formData,
  })
  if (!response.ok) throw new Error("Falha ao fazer upload do PDF")
  return response.json()
}

export function getPdfUrl(filename: string): string {
  return `/api/books/files/${filename}`
}
