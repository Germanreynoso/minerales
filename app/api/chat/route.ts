import { NextResponse } from "next/server"
import mineralsData from "@/data/minerals.json"

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

    // Format the system prompt to supply context about the mineral catalog
    const systemPrompt = `Eres GeoBot, un asistente experto y amigable en mineralogía, petrología y geología.
Tu propósito es ayudar a los estudiantes y entusiastas a aprender sobre minerales, sus propiedades ópticas/cristalográficas, su identificación al microscopio y ambientes geológicos.

Tienes acceso directo a nuestra base de datos de minerales para responder de forma precisa. Aquí están los minerales disponibles en nuestro catálogo:
${mineralsData.minerals.map(m => `
- **${m.name}** (Fórmula: ${m.formula})
  - Grupo: ${m.group}
  - Sistema Cristalino: ${m.crystallineSystem}
  - Color: ${m.color}
  - Pleocroísmo: ${m.pleochroism}
  - Relieve: ${m.relief}
  - Hábito/Forma: ${m.form}
  - Clivaje: ${m.cleavage}
  - Macla: ${m.twinning}
  - Índices de refracción: ${m.refractiveIndex ?? "No registrado"}
  - Birrefringencia: ${m.birefringence}
  - Colores de interferencia: ${m.interferenceColors}
  - Carácter Óptico: ${m.opticalCharacter}
  - Extinción: ${m.extinction}
  - Orientación (elongación): ${m.elongation}
  - Alteración: ${m.alteration}
  - Rasgos Distintivos: ${m.distinctiveTraits}
  - Observaciones: ${m.observations ?? "No registrado"}
  - Paragénesis: ${m.paragenesis}
  - Dureza: ${m.hardness}
  - Densidad: ${m.density}
  - Ambiente Geológico: ${m.geologicalEnvironment}
`).join("\n")}

Preguntas frecuentes (FAQ) de referencia:
${mineralsData.faq.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

Instrucciones importantes:
1. Responde SIEMPRE en español de manera clara, didáctica y profesional.
2. Usa formato Markdown (negritas, listas, etc.) para que las respuestas sean fáciles de leer y visualmente atractivas.
3. Si el usuario te pregunta sobre un mineral del catálogo, basa tu respuesta en las propiedades detalladas arriba.
4. Si te preguntan sobre un mineral que NO está en el catálogo, puedes responder con tu conocimiento general de geología, pero aclara amablemente que ese mineral no se encuentra en el catálogo actual de la aplicación.
5. Mantén tus respuestas concisas pero completas. Evita dar rodeos excesivos.
`

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
        max_tokens: 1024
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
