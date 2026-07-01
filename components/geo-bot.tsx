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

const WELCOME_MESSAGE = `¡Hola! Soy **GeoBot**, tu asistente especializado en mineralogía, petrología y geología.

Puedo ayudarte con:
- Identificación de minerales al microscopio
- Propiedades ópticas y cristalográficas
- Diferenciación entre especies similares
- Conceptos de mineralogía óptica
- Ambientes geológicos y paragénesis

¿Qué te gustaría saber? Puedes preguntarme sobre cualquier mineral de la base de datos o conceptos de mineralogía.`

function formatMessageContent(content: string) {
  const lines = content.split("\n")
  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => {
        const trimmed = line.trim()
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ")
        let cleanLine = line
        if (isBullet) {
          cleanLine = trimmed.substring(2)
        }

        // Process bold text
        const parts = cleanLine.split("**")
        const formattedText = parts.map((part, i) => {
          if (i % 2 === 1) {
            return (
              <strong key={i} className="font-semibold text-foreground">
                {part}
              </strong>
            )
          }
          return part
        })

        if (isBullet) {
          return (
            <div key={index} className="flex items-start gap-1.5 pl-2 text-sm leading-relaxed">
              <span className="text-primary mt-1.5 select-none">•</span>
              <span>{formattedText}</span>
            </div>
          )
        }

        return (
          <p key={index} className="text-sm leading-relaxed min-h-[1rem]">
            {formattedText}
          </p>
        )
      })}
    </div>
  )
}

export function GeoBot({ isOpen, onClose, onOpen }: GeoBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
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

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        console.error("GeoBot API error:", response.status, errBody)
        throw new Error(response.status === 429 ? "RATE_LIMIT" : "API call failed")
      }

      const data = await response.json()

      const botResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content || "Lo siento, no pude obtener respuesta en este momento.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error calling GeoBot API:", error)
      const content =
        error instanceof Error && error.message === "RATE_LIMIT"
          ? "⏳ Estás yendo muy rápido para el límite gratuito de Groq (8k tokens/min). Esperá ~30 segundos y volvé a intentar."
          : "⚠️ Lo siento, ocurrió un error al comunicarme con el servidor. Por favor, intenta de nuevo."
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
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
            className="fixed z-40 bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] sm:bottom-6 sm:right-6"
          >
            <Button
              onClick={onOpen}
              size="lg"
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
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
            className="fixed z-50 flex flex-col overflow-hidden bg-card border border-border shadow-2xl inset-0 rounded-none sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:max-w-[calc(100vw-3rem)] sm:h-[600px] sm:max-h-[calc(100vh-6rem)] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-3">
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
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-4">
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
                    className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-secondary text-secondary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {formatMessageContent(message.content)}
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
              <div className="px-3 sm:px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Preguntas sugeridas
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs px-3 py-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors text-left max-w-full"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-border pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4">
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
