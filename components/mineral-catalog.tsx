"use client"

import { motion } from "framer-motion"
import { Gem } from "lucide-react"
import { MineralCard } from "./mineral-card"
import type { Mineral } from "@/lib/types"

interface MineralCatalogProps {
  minerals: Mineral[]
  onMineralClick: (mineral: Mineral) => void
}

export function MineralCatalog({ minerals, onMineralClick }: MineralCatalogProps) {
  if (minerals.length === 0) {
    return (
      <section id="catalog" className="py-12 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Gem className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron minerales
            </h3>
            <p className="text-muted-foreground">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="catalog" className="py-12 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Gem className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Catálogo de Minerales
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Explora nuestra colección de minerales con información detallada sobre sus propiedades 
            cristalográficas, ópticas y geológicas.
          </p>
          <p className="text-sm text-primary mt-2">
            {minerals.length} mineral{minerals.length !== 1 ? "es" : ""} encontrado{minerals.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Minerals grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {minerals.map((mineral, index) => (
            <MineralCard
              key={mineral.id}
              mineral={mineral}
              onClick={() => onMineralClick(mineral)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
