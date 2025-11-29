import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/books"

export async function GET() {
  try {
    const response = await fetch(BACKEND_URL, { cache: "no-store" })
    if (!response.ok) {
      return NextResponse.json({ error: "Falha ao carregar livros" }, { status: response.status })
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar com o backend" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      return NextResponse.json({ error: "Falha ao criar livro" }, { status: response.status })
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar livro" }, { status: 500 })
  }
}
