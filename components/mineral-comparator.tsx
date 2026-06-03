"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeftRight, Check, X, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Mineral } from "@/lib/types"

interface MineralComparatorProps {
  minerals: Mineral[]
}

const COMPARISON_FIELDS: { key: keyof Mineral; label: string }[] = [
  { key: "formula", label: "Fórmula Química" },
  { key: "group", label: "Grupo Mineralógico" },
  { key: "crystallineSystem", label: "Sistema Cristalino" },
  { key: "color", label: "Color" },
  { key: "pleochroism", label: "Pleocroísmo" },
  { key: "relief", label: "Relieve" },
  { key: "cleavage", label: "Clivaje" },
  { key: "birefringence", label: "Birrefringencia" },
  { key: "interferenceColors", label: "Colores de Interferencia" },
  { key: "opticalCharacter", label: "Carácter Óptico" },
  { key: "extinction", label: "Extinción" },
  { key: "hardness", label: "Dureza" },
  { key: "geologicalEnvironment", label: "Ambiente Geológico" },
]

export function MineralComparator({ minerals }: MineralComparatorProps) {
  const [mineral1Id, setMineral1Id] = useState<string>("")
  const [mineral2Id, setMineral2Id] = useState<string>("")

  const mineral1 = minerals.find((m) => m.id === mineral1Id)
  const mineral2 = minerals.find((m) => m.id === mineral2Id)

  const swapMinerals = () => {
    const temp = mineral1Id
    setMineral1Id(mineral2Id)
    setMineral2Id(temp)
  }

  const clearSelection = () => {
    setMineral1Id("")
    setMineral2Id("")
  }

  return (
    <section id="comparator" className="py-12 md:py-20 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Comparador de Minerales
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selecciona dos minerales para comparar sus propiedades lado a lado y 
            facilitar su identificación y diferenciación.
          </p>
        </motion.div>

        {/* Selection controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 sm:p-6 rounded-2xl bg-card border border-border">
            {/* Mineral 1 selector */}
            <div className="flex-1 w-full">
              <label className="text-sm text-muted-foreground mb-2 block">
                Primer mineral
              </label>
              <Select value={mineral1Id} onValueChange={setMineral1Id}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar mineral..." />
                </SelectTrigger>
                <SelectContent>
                  {minerals.map((mineral) => (
                    <SelectItem
                      key={mineral.id}
                      value={mineral.id}
                      disabled={mineral.id === mineral2Id}
                    >
                      {mineral.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap button */}
            <Button
              variant="outline"
              size="icon"
              onClick={swapMinerals}
              disabled={!mineral1Id || !mineral2Id}
              className="rounded-full mt-6 md:mt-0"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>

            {/* Mineral 2 selector */}
            <div className="flex-1 w-full">
              <label className="text-sm text-muted-foreground mb-2 block">
                Segundo mineral
              </label>
              <Select value={mineral2Id} onValueChange={setMineral2Id}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar mineral..." />
                </SelectTrigger>
                <SelectContent>
                  {minerals.map((mineral) => (
                    <SelectItem
                      key={mineral.id}
                      value={mineral.id}
                      disabled={mineral.id === mineral1Id}
                    >
                      {mineral.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear button */}
            {(mineral1Id || mineral2Id) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSelection}
                className="rounded-full mt-6 md:mt-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Comparison table */}
        {mineral1 && mineral2 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Mobile: card layout */}
            <div className="md:hidden space-y-3">
              {COMPARISON_FIELDS.map((field, index) => {
                const value1 = mineral1[field.key]
                const value2 = mineral2[field.key]
                const isSame = value1 === value2

                return (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-4 rounded-2xl bg-card border border-border"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                      {isSame && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                      {field.label}
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <p className="text-xs text-primary font-medium mb-1">{mineral1.name}</p>
                        <p className="text-sm text-foreground">{value1}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/20">
                        <p className="text-xs text-secondary font-medium mb-1">{mineral2.name}</p>
                        <p className="text-sm text-foreground">{value2}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid grid-cols-3 bg-muted">
                <div className="p-4 font-semibold text-foreground border-r border-border">
                  Propiedad
                </div>
                <div className="p-4 font-semibold text-primary text-center border-r border-border">
                  <div className="flex items-center justify-center gap-2">
                    <Gem className="w-4 h-4" />
                    {mineral1.name}
                  </div>
                </div>
                <div className="p-4 font-semibold text-secondary text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Gem className="w-4 h-4" />
                    {mineral2.name}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {COMPARISON_FIELDS.map((field, index) => {
                  const value1 = mineral1[field.key]
                  const value2 = mineral2[field.key]
                  const isSame = value1 === value2

                  return (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="grid grid-cols-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-4 text-sm text-muted-foreground border-r border-border flex items-center gap-2">
                        {isSame && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                        {field.label}
                      </div>
                      <div className="p-4 text-sm text-foreground border-r border-border">
                        {value1}
                      </div>
                      <div className="p-4 text-sm text-foreground">
                        {value2}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <ArrowLeftRight className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Selecciona dos minerales para ver la comparación
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
