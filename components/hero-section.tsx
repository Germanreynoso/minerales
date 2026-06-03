"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onExplore: () => void
  onChatOpen: () => void
}

interface Particle {
  x: number
  y: number
  duration: number
  delay: number
}

export function HeroSection({ onExplore, onChatOpen }: HeroSectionProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles = [...Array(20)].map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden pt-20 md:pt-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/10" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              y: [null, -100],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "loop",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Base de conocimiento interactiva
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Explora el mundo de los{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                minerales
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl text-pretty">
              Base de datos interactiva para estudiar propiedades, composición química, 
              óptica mineral y ambientes geológicos.
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button
                size="lg"
                onClick={onExplore}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:hover:scale-105"
              >
                Explorar minerales
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onChatOpen}
                className="w-full sm:w-auto rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base font-medium border-border hover:bg-card hover:border-primary/50 transition-all sm:hover:scale-105"
              >
                <Bot className="w-5 h-5 mr-2" />
                Consultar asistente
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-8 pt-8 border-t border-border"
            >
              {[
                { value: "20", label: "Minerales" },
                { value: "5", label: "Grupos" },
                { value: "7", label: "Sistemas cristalinos" },
              ].map((stat, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

           {/* Right content - Hero image */}
           <motion.div
             initial={{ opacity: 0, scale: 0.9, x: 50 }}
             animate={{ opacity: 1, scale: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="relative"
           >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              
              {/* Main image container */}
              <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-2xl">
                 <img
                   src="/WhatsApp Image 2026-06-03 at 08.49.39.jpeg"
                   alt="Colección de minerales y cristales"
                   className="w-full h-full object-cover"
                 />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                
                {/* Floating cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Mineralogía Óptica</p>
                      <p className="text-sm text-muted-foreground">Identificación microscópica</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating element 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 p-4 rounded-2xl bg-card border border-border shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Filosilicatos</span>
                </div>
              </motion.div>

              {/* Floating element 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 p-4 rounded-2xl bg-card border border-border shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm font-medium">Sistema Monoclínico</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
