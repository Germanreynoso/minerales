"use client"

import { motion } from "framer-motion"
import { BarChart3, Gem, Hexagon, Mountain } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { Mineral } from "@/lib/types"

interface StatisticsSectionProps {
  minerals: Mineral[]
}

const COLORS = ["#3FAF7D", "#1F5D73", "#D8C8A5", "#6B8E6B", "#8B7355"]

export function StatisticsSection({ minerals }: StatisticsSectionProps) {
  // Calculate group distribution
  const groupDistribution = minerals.reduce((acc, mineral) => {
    acc[mineral.group] = (acc[mineral.group] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const groupData = Object.entries(groupDistribution).map(([name, value]) => ({
    name,
    value,
  }))

  // Calculate crystalline system distribution
  const systemDistribution = minerals.reduce((acc, mineral) => {
    // Handle multiple systems (e.g., "Monoclínico y Triclínico")
    const systems = mineral.crystallineSystem.split(" y ")
    systems.forEach((system) => {
      const trimmed = system.trim()
      acc[trimmed] = (acc[trimmed] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const systemData = Object.entries(systemDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Calculate geological environment distribution
  const environmentKeywords = [
    "Rocas ígneas",
    "Metamórficas",
    "Sedimentario",
    "Hidrotermal",
    "Pegmatitas",
  ]

  const environmentDistribution = minerals.reduce((acc, mineral) => {
    environmentKeywords.forEach((keyword) => {
      if (mineral.geologicalEnvironment.toLowerCase().includes(keyword.toLowerCase())) {
        acc[keyword] = (acc[keyword] || 0) + 1
      }
    })
    return acc
  }, {} as Record<string, number>)

  const environmentData = Object.entries(environmentDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const stats = [
    {
      icon: <Gem className="w-5 h-5" />,
      label: "Minerales cargados",
      value: minerals.length,
      color: "primary",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Grupos mineralógicos",
      value: Object.keys(groupDistribution).length,
      color: "secondary",
    },
    {
      icon: <Hexagon className="w-5 h-5" />,
      label: "Sistemas cristalinos",
      value: Object.keys(systemDistribution).length,
      color: "accent",
    },
    {
      icon: <Mountain className="w-5 h-5" />,
      label: "Ambientes geológicos",
      value: environmentKeywords.length,
      color: "muted",
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg bg-card border border-border shadow-lg">
          <p className="text-sm font-medium text-foreground">{label || payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Cantidad: <span className="text-primary font-medium">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <section id="statistics" className="py-12 md:py-20">
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
              <BarChart3 className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Estadísticas
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visualiza la distribución de minerales por grupos, sistemas cristalinos
            y ambientes geológicos en nuestra base de datos.
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
                stat.color === "primary" ? "bg-primary/10 text-primary" :
                stat.color === "secondary" ? "bg-secondary/10 text-secondary" :
                stat.color === "accent" ? "bg-accent/20 text-accent-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Group distribution pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Distribución por Grupos
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={groupData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name.split(" ")[0]} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {groupData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {groupData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Crystalline system bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Sistemas Cristalinos
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={systemData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="#3FAF7D"
                    radius={[0, 4, 4, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Geological environment bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-card border border-border md:col-span-2"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Ambientes Geológicos
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={environmentData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                  >
                    {environmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
