import mineralsData from "@/data/minerals.json"
import courseData from "@/data/mineralogy-course.json"
import type { Mineral, MineralsData } from "@/lib/types"

const data = mineralsData as MineralsData

/** Minúsculas + sin acentos, para matchear nombres de minerales de forma robusta. */
function normalize(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
}

/** Ficha completa (se envía SOLO para los minerales relevantes a la consulta). */
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

/** Tokens de nombre/id (≥4 letras) usados para detectar menciones de un mineral en el texto. */
function aliasTokens(m: Mineral): string[] {
  return normalize(`${m.name} ${m.id}`)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 4)
}

/** Selecciona hasta `max` minerales mencionados explícitamente en el texto del usuario. */
function selectMinerals(userText: string, max = 2): Mineral[] {
  const q = normalize(userText)
  if (!q) return []
  const matched: Mineral[] = []
  for (const m of data.minerals) {
    if (aliasTokens(m).some((t) => q.includes(t))) {
      matched.push(m)
      if (matched.length >= max) break
    }
  }
  return matched
}

/** FAQ relevante a la consulta (evita mandar las 12 siempre). */
function selectFaq(userText: string, max = 2) {
  const words = normalize(userText)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 5)
  if (!words.length) return []
  return data.faq
    .filter((f) => {
      const fn = normalize(`${f.question} ${f.answer}`)
      return words.some((w) => fn.includes(w))
    })
    .slice(0, max)
}

/**
 * Construye la base de conocimiento para el system prompt del GeoBot.
 *
 * Estrategia de recuperación (retrieval): en lugar de volcar las ~40 fichas
 * completas en cada request (que excede el límite de TPM de Groq), se envía:
 *  - un índice compacto de TODO el catálogo (para que el bot sepa qué existe), y
 *  - la ficha COMPLETA solo de los minerales mencionados en la consulta,
 *  - más las tablas/conceptos del curso y la FAQ relevante.
 */
export function buildGeoBotKnowledgeBase(userText = ""): string {
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

  // Índice compacto: solo nombres (se envía SIEMPRE). Las fichas completas se
  // recuperan por retrieval solo para los minerales mencionados en la consulta.
  const index = data.minerals.map((m) => m.name).join(", ")

  const matched = selectMinerals(userText)
  const fichas = matched.length
    ? matched.map(formatMineral).join("\n")
    : "_(El estudiante aún no mencionó un mineral del catálogo. Guía con criterios generales y el índice; cuando nombre uno, dispondrás de su ficha completa.)_"

  const faqSel = selectFaq(userText)
  const faq = faqSel.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")

  return `BASE DE CONOCIMIENTO — ${courseData.source}

Prioriza SIEMPRE esta información (fichas de la cátedra) sobre conocimiento genérico externo.

## Grupos mineralógicos (curso)
${courseData.groups.map((g) => `- ${g.name}: Si:O = ${g.siORatio}`).join("\n")}

## Índice del catálogo (${data.minerals.length} minerales disponibles)
${index}

## Fichas relevantes a la consulta
${fichas}

## Tablas y criterios diagnósticos
${diagnostic}

## Conceptos clave del curso
${concepts}${faq ? `\n\n## Preguntas frecuentes relacionadas\n${faq}` : ""}`
}
