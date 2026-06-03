"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Gem, FlaskConical, Hexagon, Palette, Eye, Sparkles, Mountain, Layers, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Mineral } from "@/lib/types"

interface MineralDetailProps {
  mineral: Mineral | null
  isOpen: boolean
  onClose: () => void
}

interface PropertyCardProps {
  icon: React.ReactNode
  label: string
  value: string
  color?: string
}

function PropertyCard({ icon, label, value, color = "primary" }: PropertyCardProps) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/20 text-accent-foreground border-accent/30",
    muted: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-sm text-foreground leading-relaxed">{value}</p>
        </div>
      </div>
    </div>
  )
}

export function MineralDetail({ mineral, isOpen, onClose }: MineralDetailProps) {
  if (!mineral) return null

  // Generate gradient based on mineral color
  const getGradient = (color: string) => {
    const colorLower = color.toLowerCase()
    if (colorLower.includes("verde")) return "from-emerald-900/30 to-teal-900/10"
    if (colorLower.includes("pardo") || colorLower.includes("marrón")) return "from-amber-900/30 to-orange-900/10"
    if (colorLower.includes("negro")) return "from-slate-800/30 to-zinc-900/10"
    if (colorLower.includes("rosado") || colorLower.includes("rojo")) return "from-rose-900/30 to-pink-900/10"
    if (colorLower.includes("azul")) return "from-blue-900/30 to-indigo-900/10"
    return "from-gray-800/30 to-slate-900/10"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 bg-gradient-to-br ${getGradient(mineral.color)} border-b border-border`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center">
                      <Gem className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {mineral.group}
                      </span>
                      <h2 className="text-2xl font-bold text-foreground">{mineral.name}</h2>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full hover:bg-background/50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Formula highlight */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  <span className="font-mono text-lg text-foreground">{mineral.formula}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Crystallographic properties */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Hexagon className="w-4 h-4" />
                  Propiedades Cristalográficas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <PropertyCard
                    icon={<Hexagon className="w-4 h-4" />}
                    label="Sistema Cristalino"
                    value={mineral.crystallineSystem}
                    color="secondary"
                  />
                  <PropertyCard
                    icon={<GitBranch className="w-4 h-4" />}
                    label="Relación Si:O"
                    value={mineral.siORatio}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Layers className="w-4 h-4" />}
                    label="Forma"
                    value={mineral.form}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Layers className="w-4 h-4" />}
                    label="Clivaje"
                    value={mineral.cleavage}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<GitBranch className="w-4 h-4" />}
                    label="Macla"
                    value={mineral.twinning}
                    color="muted"
                  />
                </div>
              </div>

              {/* Optical properties */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Propiedades Ópticas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <PropertyCard
                    icon={<Palette className="w-4 h-4" />}
                    label="Color"
                    value={mineral.color}
                    color="accent"
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Pleocroísmo"
                    value={mineral.pleochroism}
                    color="primary"
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Relieve"
                    value={mineral.relief}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Birrefringencia"
                    value={mineral.birefringence}
                    color="primary"
                  />
                  <PropertyCard
                    icon={<Palette className="w-4 h-4" />}
                    label="Colores de Interferencia"
                    value={mineral.interferenceColors}
                    color="accent"
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Carácter Óptico"
                    value={mineral.opticalCharacter}
                    color="secondary"
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Extinción"
                    value={mineral.extinction}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Elongación"
                    value={mineral.elongation}
                    color="muted"
                  />
                </div>
              </div>

              {/* Physical properties */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Mountain className="w-4 h-4" />
                  Propiedades Físicas y Geológicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <PropertyCard
                    icon={<Gem className="w-4 h-4" />}
                    label="Dureza"
                    value={mineral.hardness}
                    color="primary"
                  />
                  <PropertyCard
                    icon={<Gem className="w-4 h-4" />}
                    label="Densidad"
                    value={mineral.density}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Mountain className="w-4 h-4" />}
                    label="Ambiente Geológico"
                    value={mineral.geologicalEnvironment}
                    color="secondary"
                  />
                  <PropertyCard
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Alteración"
                    value={mineral.alteration}
                    color="muted"
                  />
                </div>
              </div>

              {/* Distinctive traits */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Rasgos Distintivos
                </h3>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-foreground leading-relaxed">{mineral.distinctiveTraits}</p>
                </div>
              </div>

              {/* Paragenesis */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Mountain className="w-4 h-4" />
                  Paragénesis
                </h3>
                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                  <p className="text-foreground leading-relaxed">{mineral.paragenesis}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
