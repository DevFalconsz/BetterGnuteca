"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { Book } from "@/lib/types"
import { getBookById, deleteBook, getPdfUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  BookOpen,
  User,
  Calendar,
  FileCheck,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
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

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number.parseInt(params.id as string)

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  useEffect(() => {
    loadBook()
  }, [id])

  async function loadBook() {
    try {
      setLoading(true)
      const data = await getBookById(id)
      setBook(data)
    } catch (err) {
      setError("Erro ao carregar livro")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteBook(id)
      router.push("/books")
    } catch (err) {
      setError("Erro ao excluir livro")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error || "Livro não encontrado"}</p>
            <Button onClick={() => router.push("/books")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Lista
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Detalhes do Livro</h1>
        <Button variant="outline" onClick={() => router.push("/books")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Book Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informações do Livro</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/books/edit/${id}`)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                  Excluir
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Título</p>
                    <p className="text-lg font-semibold">{book.titulo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Autor</p>
                    <p className="text-lg">{book.autor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Páginas</p>
                      <Badge variant="secondary" className="text-base">
                        {book.paginas}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Publicação</p>
                      <p className="text-base">{new Date(book.dataPublicacao).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge
                      variant={book.disponivel ? "default" : "secondary"}
                      className={
                        book.disponivel ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"
                      }
                    >
                      {book.disponivel ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PDF Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Arquivo PDF
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!book.pdfPath ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum PDF disponível</h3>
                  <p className="text-muted-foreground mb-6">Este livro ainda não possui um arquivo PDF anexado</p>
                  <Button onClick={() => router.push(`/books/edit/${id}`)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Adicionar PDF
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium">PDF Disponível</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowPdfViewer(!showPdfViewer)}>
                        {showPdfViewer ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Ocultar
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getPdfUrl(book.pdfPath!), "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Nova Aba
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = getPdfUrl(book.pdfPath!)
                          link.download = `${book.titulo}.pdf`
                          link.click()
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {showPdfViewer && (
                    <div className="border rounded-lg overflow-hidden">
                      <iframe src={getPdfUrl(book.pdfPath)} className="w-full h-[600px]" title="PDF Viewer" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ID do Livro</span>
                <span className="font-medium">#{book.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total de Páginas</span>
                <span className="font-medium">{book.paginas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ano</span>
                <span className="font-medium">{new Date(book.dataPublicacao).getFullYear()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">PDF Anexado</span>
                <span className={book.pdfPath ? "text-green-600 font-medium" : "text-destructive font-medium"}>
                  {book.pdfPath ? "Sim" : "Não"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => router.push(`/books/edit/${id}`)}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar Livro
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/books")}>
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Todos
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                Excluir
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o livro <strong>{book.titulo}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
