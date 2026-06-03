"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchFilters {
  groups: string[]
  crystallineSystems: string[]
  hardnessRange: [number, number]
  colors: string[]
  opticalCharacter: string[]
}

interface GlobalSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  availableGroups: string[]
  availableSystems: string[]
}

const COLORS = ["Incoloro", "Verde", "Pardo", "Negro", "Blanco", "Rosado", "Rojo"]
const OPTICAL_CHARACTERS = ["Biáxico (+)", "Biáxico (-)", "Uniáxico (+)", "Uniáxico (-)", "Isótropo"]

export function GlobalSearch({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableGroups,
  availableSystems,
}: GlobalSearchProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount =
    filters.groups.length +
    filters.crystallineSystems.length +
    filters.colors.length +
    filters.opticalCharacter.length

  const toggleArrayFilter = (
    key: keyof Pick<SearchFilters, "groups" | "crystallineSystems" | "colors" | "opticalCharacter">,
    value: string
  ) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    onFiltersChange({ ...filters, [key]: newArray })
  }

  const clearFilters = () => {
    onFiltersChange({
      groups: [],
      crystallineSystems: [],
      hardnessRange: [1, 10],
      colors: [],
      opticalCharacter: [],
    })
    onSearchChange("")
  }

  return (
    <section id="search" className="py-12 md:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Main search bar */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 rounded-2xl bg-card border border-border shadow-lg">
              <div className="flex-1 flex items-center gap-2 sm:gap-3 px-2 sm:px-4 min-w-0">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Buscar minerales..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-base min-w-0"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSearchChange("")}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                className={`rounded-xl px-4 gap-2 w-full sm:w-auto shrink-0 ${showFilters ? "bg-primary text-primary-foreground" : ""}`}
              >
                <Filter className="w-4 h-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Filtros avanzados</h3>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar filtros
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {/* Group filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl">
                      <span className="truncate">
                        {filters.groups.length > 0
                          ? `${filters.groups.length} grupos`
                          : "Grupo mineralógico"}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {availableGroups.map((group) => (
                      <DropdownMenuCheckboxItem
                        key={group}
                        checked={filters.groups.includes(group)}
                        onCheckedChange={() => toggleArrayFilter("groups", group)}
                      >
                        {group}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Crystalline system filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl">
                      <span className="truncate">
                        {filters.crystallineSystems.length > 0
                          ? `${filters.crystallineSystems.length} sistemas`
                          : "Sistema cristalino"}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {availableSystems.map((system) => (
                      <DropdownMenuCheckboxItem
                        key={system}
                        checked={filters.crystallineSystems.includes(system)}
                        onCheckedChange={() => toggleArrayFilter("crystallineSystems", system)}
                      >
                        {system}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Color filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl">
                      <span className="truncate">
                        {filters.colors.length > 0
                          ? `${filters.colors.length} colores`
                          : "Color"}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {COLORS.map((color) => (
                      <DropdownMenuCheckboxItem
                        key={color}
                        checked={filters.colors.includes(color)}
                        onCheckedChange={() => toggleArrayFilter("colors", color)}
                      >
                        {color}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Optical character filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl">
                      <span className="truncate">
                        {filters.opticalCharacter.length > 0
                          ? `${filters.opticalCharacter.length} selec.`
                          : "Carácter óptico"}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {OPTICAL_CHARACTERS.map((character) => (
                      <DropdownMenuCheckboxItem
                        key={character}
                        checked={filters.opticalCharacter.includes(character)}
                        onCheckedChange={() => toggleArrayFilter("opticalCharacter", character)}
                      >
                        {character}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Active filters tags */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                  {filters.groups.map((group) => (
                    <span
                      key={group}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm cursor-pointer hover:bg-primary/20"
                      onClick={() => toggleArrayFilter("groups", group)}
                    >
                      {group}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                  {filters.crystallineSystems.map((system) => (
                    <span
                      key={system}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm cursor-pointer hover:bg-secondary/20"
                      onClick={() => toggleArrayFilter("crystallineSystems", system)}
                    >
                      {system}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                  {filters.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/30 text-accent-foreground text-sm cursor-pointer hover:bg-accent/40"
                      onClick={() => toggleArrayFilter("colors", color)}
                    >
                      {color}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                  {filters.opticalCharacter.map((character) => (
                    <span
                      key={character}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm cursor-pointer hover:bg-muted/80"
                      onClick={() => toggleArrayFilter("opticalCharacter", character)}
                    >
                      {character}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
