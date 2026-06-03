"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Gem,
  FlaskConical,
  Hexagon,
  Palette,
  Eye,
  Sparkles,
  Mountain,
  Layers,
  GitBranch,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MineralImage } from "@/components/mineral-image"
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
  fullWidth?: boolean
}

function PropertyCard({ icon, label, value, color = "primary", fullWidth }: PropertyCardProps) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/20 text-accent-foreground border-accent/30",
    muted: "bg-muted text-muted-foreground border-border",
  }

  const displayValue = value?.trim() ? value : "Sin dato registrado"

  return (
    <div
      className={`p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors${fullWidth ? " md:col-span-2" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-sm text-foreground leading-relaxed">{displayValue}</p>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
      {icon}
      {children}
    </h3>
  )
}

export function MineralDetail({ mineral, isOpen, onClose }: MineralDetailProps) {
  if (!mineral) return null

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 w-full sm:max-w-2xl bg-card sm:border-l border-border shadow-2xl z-50 overflow-y-auto overscroll-contain"
          >
            <div className={`sticky top-0 z-10 border-b border-border pt-[env(safe-area-inset-top)]`}>
              <div className="relative">
                <MineralImage mineral={mineral} className="relative h-40 sm:h-48" priority />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className={`p-4 sm:p-6 bg-gradient-to-br ${getGradient(mineral.color)}`}>
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center flex-shrink-0">
                    <Gem className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {mineral.group}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{mineral.name}</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {/* Composición química, sistema cristalino y relación Si:O */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PropertyCard
                  icon={<FlaskConical className="w-4 h-4" />}
                  label="Composición química"
                  value={mineral.formula}
                  color="primary"
                />
                <PropertyCard
                  icon={<Hexagon className="w-4 h-4" />}
                  label="Sistema cristalino"
                  value={mineral.crystallineSystem}
                  color="secondary"
                />
                <PropertyCard
                  icon={<GitBranch className="w-4 h-4" />}
                  label="Relación Silicio:Oxígeno"
                  value={mineral.siORatio}
                  color="muted"
                />
              </div>

              {/* Propiedades ópticas */}
              <div>
                <SectionTitle icon={<Eye className="w-4 h-4" />}>Propiedades Ópticas</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Índices de refracción"
                    value={mineral.refractiveIndex ?? ""}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Palette className="w-4 h-4" />}
                    label="Color"
                    value={mineral.color}
                    color="accent"
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Relieve"
                    value={mineral.relief}
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
                  <PropertyCard
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Birrefringencia"
                    value={mineral.birefringence}
                    color="primary"
                  />
                  <PropertyCard
                    icon={<Palette className="w-4 h-4" />}
                    label="Color de interferencia"
                    value={mineral.interferenceColors}
                    color="accent"
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Carácter óptico y signo óptico"
                    value={mineral.opticalCharacter}
                    color="secondary"
                  />
                  <PropertyCard
                    icon={<Compass className="w-4 h-4" />}
                    label="Orientación"
                    value={mineral.elongation}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Extinción"
                    value={mineral.extinction}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Alteración"
                    value={mineral.alteration}
                    color="muted"
                  />
                  <PropertyCard
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Rasgos distintivos"
                    value={mineral.distinctiveTraits}
                    color="primary"
                    fullWidth
                  />
                  <PropertyCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Observaciones"
                    value={mineral.observations ?? ""}
                    color="muted"
                    fullWidth
                  />
                </div>
              </div>

              {/* Paragénesis */}
              <div>
                <SectionTitle icon={<Mountain className="w-4 h-4" />}>Paragénesis</SectionTitle>
                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                  <p className="text-sm text-foreground leading-relaxed">
                    {mineral.paragenesis?.trim() || "Sin dato registrado"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
