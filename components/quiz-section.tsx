"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { QuizQuestion } from "@/lib/types"

interface QuizSectionProps {
  questions: QuizQuestion[]
}

export function QuizSection({ questions }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  useEffect(() => {
    setSelectedAnswer(null)
    setShowResult(false)
  }, [currentQuestion])

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)

    if (index === question.correctAnswer && !answeredQuestions.has(currentQuestion)) {
      setScore((prev) => prev + 1)
      setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion))
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setIsComplete(false)
    setAnsweredQuestions(new Set())
  }

  const getOptionClass = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? "border-primary bg-primary/10"
        : "border-border hover:border-primary/50 hover:bg-muted/50"
    }
    if (index === question.correctAnswer) {
      return "border-green-500 bg-green-500/10"
    }
    if (selectedAnswer === index) {
      return "border-red-500 bg-red-500/10"
    }
    return "border-border opacity-50"
  }

  return (
    <section id="quiz" className="py-12 md:py-20 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Quiz Interactivo
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pon a prueba tus conocimientos sobre mineralogía óptica con estas preguntas 
            de opción múltiple.
          </p>
        </motion.div>

        {/* Quiz content */}
        <div className="max-w-2xl mx-auto">
          {!isComplete ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-lg"
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Pregunta {currentQuestion + 1} de {questions.length}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {score} puntos
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-6">
                  {question.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      whileHover={!showResult ? { scale: 1.01 } : {}}
                      whileTap={!showResult ? { scale: 0.99 } : {}}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${getOptionClass(
                        index
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1 text-foreground">{option}</span>
                        {showResult && index === question.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {showResult &&
                          selectedAnswer === index &&
                          index !== question.correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Explanation */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-muted border border-border"
                  >
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Explicación: </span>
                      {question.explanation}
                    </p>
                  </motion.div>
                )}

                {/* Next button */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 flex justify-end"
                  >
                    <Button onClick={handleNext} className="rounded-xl gap-2">
                      {currentQuestion < questions.length - 1 ? (
                        <>
                          Siguiente
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Ver resultados
                          <Trophy className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            /* Results */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-card border border-border shadow-lg text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">
                ¡Quiz completado!
              </h3>

              <p className="text-muted-foreground mb-6">
                Has obtenido{" "}
                <span className="text-primary font-bold">{score}</span> de{" "}
                <span className="font-bold">{questions.length}</span> puntos
              </p>

              {/* Score visualization */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="text-primary"
                    strokeDasharray={`${(score / questions.length) * 352} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">
                    {Math.round((score / questions.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Message based on score */}
              <p className="text-lg text-foreground mb-8">
                {score === questions.length && "¡Perfecto! Dominas la mineralogía óptica."}
                {score >= questions.length * 0.7 &&
                  score < questions.length &&
                  "¡Excelente trabajo! Tienes muy buenos conocimientos."}
                {score >= questions.length * 0.5 &&
                  score < questions.length * 0.7 &&
                  "Buen intento. Sigue estudiando para mejorar."}
                {score < questions.length * 0.5 &&
                  "Necesitas repasar algunos conceptos. ¡No te rindas!"}
              </p>

              <Button onClick={handleRestart} className="rounded-xl gap-2">
                <RotateCcw className="w-4 h-4" />
                Intentar de nuevo
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
