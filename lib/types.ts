export interface Mineral {
  id: string
  name: string
  formula: string
  siORatio: string
  group: string
  crystallineSystem: string
  color: string
  pleochroism: string
  relief: string
  form: string
  cleavage: string
  twinning: string
  birefringence: string
  interferenceColors: string
  opticalCharacter: string
  extinction: string
  elongation: string
  alteration: string
  distinctiveTraits: string
  refractiveIndex?: string
  observations?: string
  paragenesis: string
  hardness: string
  density: string
  geologicalEnvironment: string
  image: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface MineralsData {
  minerals: Mineral[]
  groups: string[]
  crystallineSystems: string[]
  faq: FAQ[]
  quizQuestions: QuizQuestion[]
}
