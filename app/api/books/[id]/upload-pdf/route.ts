import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/books"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const formData = await request.formData()

    const response = await fetch(`${BACKEND_URL}/${id}/upload-pdf`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Falha ao fazer upload do PDF" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao fazer upload do PDF" }, { status: 500 })
  }
}
