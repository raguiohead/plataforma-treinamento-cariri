// Tipos base do usuário
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'colaborador' | 'gestor' | 'admin'
  department?: string
  createdAt: string
  progress: UserProgress
}

export interface UserProgress {
  completedModules: string[]
  completedLessons: string[]
  completedQuizzes: QuizResult[]    // Resultados dos quizzes
  currentModuleId?: string
  currentLessonId?: string
  lastAccessAt?: string
  certificateEarnedAt?: string
  tempoEstudo: number // em minutos
  xp: number // pontos de experiência
}

// Tipos de Quiz
export interface Questao {
  id: string
  pergunta: string
  opcoes: string[]              // 4 opções
  respostaCorreta: number       // índice 0-3
  explicacao: string
  trechoReferencia: string
}

export interface Quiz {
  id: string
  moduloId: string
  titulo: string
  questoes: Questao[]
}

export interface QuizzesData {
  quizzes: Quiz[]
}

export interface QuizResult {
  quizId: string
  moduloId: string
  acertos: number
  total: number
  percentual: number
  completedAt: string
}

// Tipos de Glossário
export interface TermoGlossario {
  id: string
  termo: string
  sigla?: string
  definicao: string
  exemplo?: string
  moduloId: string
}

export interface GlossarioData {
  termos: TermoGlossario[]
}

// Tipos de conteúdo das lições
export type ConteudoTipo = 'texto' | 'destaque' | 'importante' | 'definicao' | 'lista' | 'exemplo'

export interface ConteudoTexto {
  tipo: 'texto'
  conteudo: string
}

export interface ConteudoDestaque {
  tipo: 'destaque'
  conteudo: string
  cor: 'green' | 'blue' | 'amber'
}

export interface ConteudoImportante {
  tipo: 'importante'
  texto: string
}

export interface ConteudoDefinicao {
  tipo: 'definicao'
  termo: string
  explicacao: string
}

export interface ConteudoLista {
  tipo: 'lista'
  titulo: string
  itens: string[]
}

export interface ConteudoExemplo {
  tipo: 'exemplo'
  titulo: string
  conteudo: string
}

export type ConteudoItem = 
  | ConteudoTexto 
  | ConteudoDestaque 
  | ConteudoImportante 
  | ConteudoDefinicao 
  | ConteudoLista 
  | ConteudoExemplo

// Tipos de lições
export interface Licao {
  id: string
  titulo: string
  duracao: number // em minutos
  conteudo: ConteudoItem[]
}

// Tipos de módulos de treinamento
export interface Modulo {
  id: string
  ordem: number
  titulo: string
  descricao: string
  duracao: number // em minutos
  cor: string
  icone: string
  licoes: Licao[]
}

export interface ModulosData {
  modulos: Modulo[]
}

// Tipos para estatísticas do dashboard
export interface DashboardStats {
  progressoGeral: number        // 0-100%
  modulosCompletos: number      // X de 6
  licoesCompletas: number       // X de 20
  tempoEstudo: number           // minutos
  totalModulos: number
  totalLicoes: number
}

// Tipos de autenticação
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  department?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Certificado
export interface Certificate {
  id: string
  userName: string
  completedAt: string
  totalHours: number
}
