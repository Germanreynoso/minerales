import mineralsData from "@/data/minerals.json"
import courseData from "@/data/mineralogy-course.json"
import type { Mineral, MineralsData } from "@/lib/types"

const data = mineralsData as MineralsData

function formatMineral(m: Mineral): string {
  return `
### ${m.name}
- **Composición química:** ${m.formula}
- **Grupo:** ${m.group} (Si:O ${m.siORatio})
- **Sistema cristalino:** ${m.crystallineSystem}
- **Índices de refracción:** ${m.refractiveIndex ?? "—"}
- **Color:** ${m.color}
- **Pleocroísmo:** ${m.pleochroism}
- **Relieve:** ${m.relief}
- **Forma:** ${m.form}
- **Clivaje:** ${m.cleavage}
- **Macla:** ${m.twinning}
- **Birrefringencia (δ):** ${m.birefringence}
- **Color de interferencia:** ${m.interferenceColors}
- **Carácter y signo ópticos:** ${m.opticalCharacter}
- **Orientación:** ${m.elongation}
- **Extinción:** ${m.extinction}
- **Alteración:** ${m.alteration}
- **Rasgos distintivos:** ${m.distinctiveTraits}
- **Observaciones:** ${m.observations ?? "—"}
- **Paragénesis:** ${m.paragenesis}`
}

export function buildGeoBotKnowledgeBase(): string {
  const diagnostic = courseData.diagnosticTables
    .map((t) => {
      if ("content" in t && t.content) {
        return `**${t.title}:** ${t.content}`
      }
      const rows = "rows" in t && t.rows
        ? t.rows.map((r) => `- ${"mineral" in r ? r.mineral : r.range}: ${"property" in r ? r.property : r.name}`).join("\n")
        : ""
      return `**${t.title}:**\n${rows}`
    })
    .join("\n\n")

  const concepts = courseData.concepts
    .map((c) => `**${c.title}:** ${c.content}`)
    .join("\n\n")

  const faq = data.faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")

  return `BASE DE CONOCIMIENTO — ${courseData.source}

Prioriza SIEMPRE esta información (fichas de la cátedra) sobre conocimiento genérico externo.

## Grupos mineralógicos (curso)
${courseData.groups.map((g) => `- ${g.name}: Si:O = ${g.siORatio}`).join("\n")}

## Tablas y criterios diagnósticos
${diagnostic}

## Conceptos clave del curso
${concepts}

## Fichas de minerales (catálogo completo)
${data.minerals.map(formatMineral).join("\n")}

## Preguntas frecuentes
${faq}`
}
