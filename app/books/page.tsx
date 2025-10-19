"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Book } from "@/lib/types"
import { getAllBooks, deleteBook, getPdfUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Plus,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  AlertCircle,
  BookMarked,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<{ id: number; titulo: string } | null>(null)

  useEffect(() => {
    loadBooks()
  }, [])

  async function loadBooks() {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllBooks()
      setBooks(data)
    } catch (err) {
      setError("Erro ao carregar livros. Verifique se o servidor está rodando.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteBook(id)
      setBooks(books.filter((book) => book.id !== id))
      setDeleteDialogOpen(false)
      setBookToDelete(null)
    } catch (err) {
      setError("Erro ao excluir livro")
    }
  }

  const stats = {
    total: books.length,
    disponivel: books.filter((b) => b.disponivel).length,
    indisponivel: books.filter((b) => !b.disponivel).length,
    comPdf: books.filter((b) => b.pdfPath).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Biblioteca</h1>
        </div>
        <Button onClick={() => router.push("/books/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Novo Livro
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={loadBooks} className="ml-auto bg-transparent">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {books.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <BookMarked className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disponíveis</p>
                  <p className="text-3xl font-bold text-green-600">{stats.disponivel}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Indisponíveis</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.indisponivel}</p>
                </div>
                <XCircle className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Com PDF</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.comPdf}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {books.length === 0 && !error && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum livro cadastrado</h3>
            <p className="text-muted-foreground mb-6">Comece adicionando seu primeiro livro à biblioteca</p>
            <Button onClick={() => router.push("/books/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Livro
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Books Table */}
      {books.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Livros Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Título</th>
                    <th className="text-left py-3 px-4 font-semibold">Autor</th>
                    <th className="text-left py-3 px-4 font-semibold">Páginas</th>
                    <th className="text-left py-3 px-4 font-semibold">Publicação</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">PDF</th>
                    <th className="text-center py-3 px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium">{book.titulo}</td>
                      <td className="py-4 px-4 text-muted-foreground">{book.autor}</td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary">{book.paginas}</Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {new Date(book.dataPublicacao).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={book.disponivel ? "default" : "secondary"}
                          className={
                            book.disponivel ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"
                          }
                        >
                          {book.disponivel ? "Disponível" : "Indisponível"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {book.pdfPath ? (
                          <a
                            href={getPdfUrl(book.pdfPath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            Ver PDF
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/books/view/${book.id}`)}
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/books/edit/${book.id}`)}
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setBookToDelete({ id: book.id!, titulo: book.titulo })
                              setDeleteDialogOpen(true)
                            }}
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o livro <strong>{bookToDelete?.titulo}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bookToDelete && handleDelete(bookToDelete.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
