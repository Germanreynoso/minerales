"use client"

import { motion } from "framer-motion"
import { FlaskConical, Hexagon, Palette } from "lucide-react"
import { MineralImage } from "@/components/mineral-image"
import type { Mineral } from "@/lib/types"

interface MineralCardProps {
  mineral: Mineral
  onClick: () => void
  index: number
}

export function MineralCard({ mineral, onClick, index }: MineralCardProps) {
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
        <div className="relative">
          <MineralImage mineral={mineral} className="relative h-48" priority={index < 4} />
          <div className="absolute top-4 left-4 z-10">
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
