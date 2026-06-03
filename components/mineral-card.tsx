"use client"

import { motion } from "framer-motion"
import { Gem, FlaskConical, Hexagon, Palette } from "lucide-react"
import type { Mineral } from "@/lib/types"

interface MineralCardProps {
  mineral: Mineral
  onClick: () => void
  index: number
}

export function MineralCard({ mineral, onClick, index }: MineralCardProps) {
  // Generate a gradient based on mineral color description
  const getGradient = (color: string) => {
    const colorLower = color.toLowerCase()
    if (colorLower.includes("verde")) return "from-emerald-900/50 to-teal-900/30"
    if (colorLower.includes("pardo") || colorLower.includes("marrón")) return "from-amber-900/50 to-orange-900/30"
    if (colorLower.includes("negro")) return "from-slate-800/50 to-zinc-900/30"
    if (colorLower.includes("rosado") || colorLower.includes("rojo")) return "from-rose-900/50 to-pink-900/30"
    if (colorLower.includes("azul")) return "from-blue-900/50 to-indigo-900/30"
    return "from-gray-800/50 to-slate-900/30"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
        {/* Image section */}
        <div className={`relative h-48 bg-gradient-to-br ${getGradient(mineral.color)}`}>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30" />
          
          {/* Mineral icon/visual */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-24 h-24 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-xl"
            >
              <Gem className="w-12 h-12 text-primary" />
            </motion.div>
          </div>

          {/* Group badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground border border-border/50">
              {mineral.group}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {mineral.name}
          </h3>

          {/* Formula */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <FlaskConical className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-mono truncate">{mineral.formula}</span>
          </div>

          {/* Properties grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-secondary" />
              <span className="text-xs text-muted-foreground truncate">
                {mineral.crystallineSystem}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground truncate">
                {mineral.color.split(",")[0]}
              </span>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Dureza: {mineral.hardness}
            </span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Ver detalles →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
