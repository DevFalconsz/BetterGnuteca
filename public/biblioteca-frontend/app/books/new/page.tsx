"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Book } from "@/lib/types"
import { createBook, uploadPdf } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload, Lightbulb } from "lucide-react"

export default function NewBookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<Partial<Book>>({
    titulo: "",
    authors: [], // Initialize as an empty array of Author objects
    paginas: 0,
    disponivel: true,
    dataPublicacao: "",
  })
  const [authorInput, setAuthorInput] = useState<string>("") // State to manage raw author input string

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const authorsArray = authorInput
        .split(",")
        .map((name) => ({ name: name.trim() }))
        .filter((author) => author.name.length > 0)

      const bookToCreate: Book = {
        ...formData as Book,
        authors: authorsArray,
      }

      const book = await createBook(bookToCreate)

      if (selectedFile && book.id) {
        await uploadPdf(book.id, selectedFile)
      }

      router.push("/books")
    } catch (err) {
      setError("Erro ao criar livro. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Novo Livro</h1>
        <Button variant="outline" onClick={() => router.push("/books")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Digite o título do livro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authors">Autores *</Label>
                <Input
                  id="authors"
                  required
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  placeholder="Nome do autor (separe por vírgulas para múltiplos autores)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paginas">Páginas *</Label>
                <Input
                  id="paginas"
                  type="number"
                  required
                  min="1"
                  value={formData.paginas || ""}
                  onChange={(e) => setFormData({ ...formData, paginas: Number.parseInt(e.target.value) })}
                  placeholder="250"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataPublicacao">Data de Publicação *</Label>
                <Input
                  id="dataPublicacao"
                  type="date"
                  required
                  value={formData.dataPublicacao}
                  onChange={(e) => setFormData({ ...formData, dataPublicacao: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disponivel">Status</Label>
                <Select
                  value={formData.disponivel ? "true" : "false"}
                  onValueChange={(value) => setFormData({ ...formData, disponivel: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Disponível</SelectItem>
                    <SelectItem value="false">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Arquivo PDF (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Clique para selecionar um arquivo PDF</p>
                <p className="text-xs text-muted-foreground">Tamanho máximo: 10MB</p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Campos marcados com * são obrigatórios</p>
                <p>• O arquivo PDF pode ser adicionado posteriormente</p>
                <p>• Certifique-se de que as informações estão corretas antes de salvar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/books")}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
