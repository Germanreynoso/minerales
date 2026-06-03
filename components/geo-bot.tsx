"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Send, Sparkles, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface GeoBotProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

const SUGGESTED_QUESTIONS = [
  "¿Cómo diferencio muscovita de biotita?",
  "¿Qué es la clorita?",
  "¿Qué significa carácter óptico biáxico?",
  "¿Cómo identificar filosilicatos?",
]

const BOT_RESPONSES: Record<string, string> = {
  "muscovita": `La **muscovita** y la **biotita** son ambas micas del grupo de los filosilicatos, pero tienen diferencias clave:

**Color:**
- Muscovita: Incolora a gris claro (sin pleocroísmo)
- Biotita: Pardo oscuro con fuerte pleocroísmo (α = amarillo pálido, γ = pardo oscuro)

**Identificación al microscopio:**
- La muscovita aparece transparente/incolora en luz polarizada plana
- La biotita muestra colores pardos intensos y pleocroísmo muy evidente

**Halos pleocroicos:**
- La biotita frecuentemente presenta halos pleocroicos oscuros alrededor de inclusiones de circón, que no se ven en muscovita

Ambas tienen clivaje perfecto basal, extinción paralela y colores de interferencia de segundo a tercer orden.`,

  "clorita": `La **clorita** es un filosilicato muy importante en geología, especialmente como indicador de metamorfismo de bajo grado.

**Características principales:**
- **Fórmula:** (Mg,Fe,Al)₆[(Si,Al)₄O₁₀](OH)₈
- **Color:** Verde pálido a verde oscuro
- **Sistema:** Monoclínico y Triclínico

**Identificación óptica:**
- Color verde característico
- Birrefringencia MUY baja (0.000-0.015)
- **Birrefringencia anómala:** Frecuentemente muestra colores azul berlín en lugar de grises de primer orden
- Pleocroísmo débil (verde claro a verde oscuro)

**Origen:**
Es comúnmente un producto de alteración de biotita, hornblenda y otros minerales ferromagnesianos en condiciones de metamorfismo retrógrado o alteración hidrotermal.`,

  "biáxico": `El **carácter óptico biáxico** se refiere a minerales con dos ejes ópticos.

**Conceptos clave:**
- Los minerales biáxicos pertenecen a los sistemas ortorrómbico, monoclínico y triclínico
- Tienen **tres índices de refracción principales**: nα < nβ < nγ
- Poseen **dos direcciones** donde la luz viaja sin dividirse (ejes ópticos)

**Biáxico (+) vs Biáxico (-):**
- **Biáxico (+):** nβ está más cerca de nα. La bisectriz aguda (Bxa) coincide con Z (nγ)
- **Biáxico (-):** nβ está más cerca de nγ. La bisectriz aguda (Bxa) coincide con X (nα)

**Ángulo 2V:**
Es el ángulo entre los dos ejes ópticos. Varía de 0° a 90°:
- 2V pequeño: Las isogyras están juntas
- 2V grande: Las isogyras están muy separadas`,

  "filosilicatos": `Los **filosilicatos** (del griego "phyllon" = hoja) son silicatos con estructura laminar.

**Estructura:**
- Tetraedros SiO₄ comparten 3 de sus 4 oxígenos
- Forman hojas infinitas con relación Si:O de 2:5
- Las hojas se unen por cationes entre ellas

**Propiedades características:**
1. **Clivaje perfecto basal** {001} - se separan fácilmente en láminas
2. **Hábito tabular/laminar**
3. **Dureza baja** (2-3 en la escala de Mohs)
4. **Birrefringencia alta** en general

**Identificación al microscopio:**
- Buscar extinción paralela al clivaje
- Observar forma alargada/tabular
- Colores de interferencia vivos (micas)
- Aspecto "escamoso" característico

**Ejemplos principales:**
- Micas: muscovita, biotita, flogopita
- Arcillas: caolinita, illita, montmorillonita
- Clorita, serpentina, talco`,

  "default": `¡Hola! Soy **GeoBot**, tu asistente especializado en mineralogía, petrología y geología.

Puedo ayudarte con:
- Identificación de minerales al microscopio
- Propiedades ópticas y cristalográficas
- Diferenciación entre especies similares
- Conceptos de mineralogía óptica
- Ambientes geológicos y paragénesis

¿Qué te gustaría saber? Puedes preguntarme sobre cualquier mineral de la base de datos o conceptos de mineralogía.`
}

function getBotResponse(question: string): string {
  const q = question.toLowerCase()
  
  if (q.includes("muscovita") || q.includes("biotita") || q.includes("diferencio")) {
    return BOT_RESPONSES["muscovita"]
  }
  if (q.includes("clorita")) {
    return BOT_RESPONSES["clorita"]
  }
  if (q.includes("biáxico") || q.includes("biaxic") || q.includes("carácter óptico")) {
    return BOT_RESPONSES["biáxico"]
  }
  if (q.includes("filosilicato") || q.includes("filosilicatos")) {
    return BOT_RESPONSES["filosilicatos"]
  }
  
  return BOT_RESPONSES["default"]
}

export function GeoBot({ isOpen, onClose, onOpen }: GeoBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: BOT_RESPONSES["default"],
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getBotResponse(message),
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages((prev) => [...prev, botResponse])
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question)
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={onOpen}
              size="lg"
              className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">GeoBot</h3>
                    <p className="text-xs text-muted-foreground">
                      Asistente de mineralogía
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-secondary/20"
                        : "bg-primary/20"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-secondary" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-secondary text-secondary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="font-semibold">
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Preguntas sugeridas
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend(input)
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 rounded-xl"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
