"use client"

import { useState, useMemo, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { GlobalSearch } from "@/components/global-search"
import { MineralCatalog } from "@/components/mineral-catalog"
import { MineralDetail } from "@/components/mineral-detail"
import { MineralComparator } from "@/components/mineral-comparator"
import { FAQSection } from "@/components/faq-section"
import { GeoBot } from "@/components/geo-bot"
import { QuizSection } from "@/components/quiz-section"
import { StatisticsSection } from "@/components/statistics-section"
import { Footer } from "@/components/footer"
import mineralsData from "@/data/minerals.json"
import type { Mineral, MineralsData } from "@/lib/types"

interface SearchFilters {
  groups: string[]
  crystallineSystems: string[]
  hardnessRange: [number, number]
  colors: string[]
  opticalCharacter: string[]
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    groups: [],
    crystallineSystems: [],
    hardnessRange: [1, 10],
    colors: [],
    opticalCharacter: [],
  })
  const [selectedMineral, setSelectedMineral] = useState<Mineral | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  const catalogRef = useRef<HTMLDivElement>(null)

  const data = mineralsData as MineralsData

  // Filter minerals based on search and filters
  const filteredMinerals = useMemo(() => {
    return data.minerals.filter((mineral) => {
      // Search query match
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableFields = [
          mineral.name,
          mineral.formula,
          mineral.group,
          mineral.crystallineSystem,
          mineral.color,
          mineral.geologicalEnvironment,
        ]
        const matchesSearch = searchableFields.some((field) =>
          field.toLowerCase().includes(query)
        )
        if (!matchesSearch) return false
      }

      // Group filter
      if (filters.groups.length > 0 && !filters.groups.includes(mineral.group)) {
        return false
      }

      // Crystalline system filter
      if (filters.crystallineSystems.length > 0) {
        const mineralSystems = mineral.crystallineSystem
          .split(" y ")
          .map((s) => s.trim())
        const hasMatchingSystem = mineralSystems.some((system) =>
          filters.crystallineSystems.includes(system)
        )
        if (!hasMatchingSystem) return false
      }

      // Color filter
      if (filters.colors.length > 0) {
        const mineralColor = mineral.color.toLowerCase()
        const hasMatchingColor = filters.colors.some((color) =>
          mineralColor.includes(color.toLowerCase())
        )
        if (!hasMatchingColor) return false
      }

      // Optical character filter
      if (filters.opticalCharacter.length > 0) {
        const hasMatchingCharacter = filters.opticalCharacter.some((character) =>
          mineral.opticalCharacter.includes(character)
        )
        if (!hasMatchingCharacter) return false
      }

      return true
    })
  }, [data.minerals, searchQuery, filters])

  const handleMineralClick = (mineral: Mineral) => {
    setSelectedMineral(mineral)
    setIsDetailOpen(true)
  }

  const handleExplore = () => {
    const catalogElement = document.getElementById("catalog")
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation onChatOpen={() => setIsChatOpen(true)} />

      {/* Hero Section */}
      <HeroSection 
        onExplore={handleExplore} 
        onChatOpen={() => setIsChatOpen(true)} 
      />

      {/* Global Search */}
      <GlobalSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        availableGroups={data.groups}
        availableSystems={data.crystallineSystems}
      />

      {/* Mineral Catalog */}
      <div ref={catalogRef}>
        <MineralCatalog
          minerals={filteredMinerals}
          onMineralClick={handleMineralClick}
        />
      </div>

      {/* Mineral Comparator */}
      <MineralComparator minerals={data.minerals} />

      {/* Quiz Section */}
      <QuizSection questions={data.quizQuestions} />

      {/* Statistics Section */}
      <StatisticsSection minerals={data.minerals} />

      {/* FAQ Section */}
      <FAQSection faqs={data.faq} />

      {/* Footer */}
      <Footer />

      {/* Mineral Detail Panel */}
      <MineralDetail
        mineral={selectedMineral}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* GeoBot Chatbot */}
      <GeoBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
      />
    </main>
  )
}
