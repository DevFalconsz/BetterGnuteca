import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/books"

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params
    const response = await fetch(`${BACKEND_URL}/files/${filename}`, { cache: "no-store" })

    if (!response.ok) {
      return NextResponse.json({ error: "Falha ao carregar PDF" }, { status: response.status })
    }

    const blob = await response.blob()
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar PDF" }, { status: 500 })
  }
}
