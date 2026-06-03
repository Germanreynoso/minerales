import { NextResponse } from "next/server"
import { buildGeoBotKnowledgeBase } from "@/lib/mineralogy-knowledge"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error("GROQ_API_KEY is not defined in environment variables.")
      return NextResponse.json({ error: "API key configuration error" }, { status: 500 })
    }

    const knowledgeBase = buildGeoBotKnowledgeBase()

    const systemPrompt = `Eres GeoBot, asistente experto en mineralogía óptica (Cátedra de Mineralogía II).
Tu propósito es ayudar a identificar minerales al microscopio y explicar propiedades ópticas, cristalográficas y paragénesis.

${knowledgeBase}

Instrucciones importantes:
1. Responde SIEMPRE en español, claro y didáctico, como material de cátedra.
2. Usa Markdown (negritas, listas) para respuestas legibles.
3. Prioriza la base de conocimiento de la cátedra anterior; si un mineral no está en el catálogo, indícalo y responde con criterio del curso cuando aplique.
4. Para diferenciar piroxenos usa extinción: Opx paralela, Cpx inclinada (>22°); Cpx vs anfíboles: Cpx >22°, anfíboles <20°.
5. Respuestas concisas pero completas.`

    // Limit previous messages to keep history lightweight (e.g. last 10 messages)
    const recentMessages = messages.slice(-10)

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }))
    ]

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1536
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq API error response:", errorText)
      return NextResponse.json({ error: "Failed to fetch response from LLM provider" }, { status: 500 })
    }

    const responseData = await response.json()
    const content = responseData.choices?.[0]?.message?.content || ""

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error("Error in chat api route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
