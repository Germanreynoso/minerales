"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Gem, Search, BookOpen, BarChart3, HelpCircle, ArrowLeftRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  onChatOpen: () => void
}

const NAV_ITEMS = [
  { id: "search", label: "Buscar", icon: Search },
  { id: "catalog", label: "Catálogo", icon: Gem },
  { id: "comparator", label: "Comparar", icon: ArrowLeftRight },
  { id: "quiz", label: "Quiz", icon: BookOpen },
  { id: "statistics", label: "Estadísticas", icon: BarChart3 },
  { id: "faq", label: "FAQ", icon: HelpCircle },
]

export function Navigation({ onChatOpen }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Gem className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">
                Geo<span className="text-primary">Mineral</span>
              </span>
            </a>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={onChatOpen}
                variant="outline"
                className="hidden md:flex rounded-xl gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                GeoBot
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-xl"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 md:top-20 z-30 bg-card border-b border-border shadow-lg lg:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  )
                })}
                <button
                  onClick={() => {
                    onChatOpen()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  GeoBot - Asistente
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
