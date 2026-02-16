import quizzesData from '@/data/quizzes.json'
import glossarioData from '@/data/glossario.json'
import type { Quiz, Questao, QuizResult, TermoGlossario, UserProgress } from '@/types'

// ============ QUIZZES ============

export function getQuizzes(): Quiz[] {
  return quizzesData.quizzes as Quiz[]
}

export function getQuizByModuloId(moduloId: string): Quiz | undefined {
  return getQuizzes().find(q => q.moduloId === moduloId)
}

export function getQuizById(quizId: string): Quiz | undefined {
  return getQuizzes().find(q => q.id === quizId)
}

export function getTotalQuestoes(): number {
  return getQuizzes().reduce((acc, quiz) => acc + quiz.questoes.length, 0)
}

export function getQuizResult(quizId: string, progress: UserProgress): QuizResult | undefined {
  return (progress.completedQuizzes ?? []).find(q => q.quizId === quizId)
}

export function calcularNotaMedia(progress: UserProgress): number {
  const quizzes = progress.completedQuizzes ?? []
  if (quizzes.length === 0) return 0
  
  const somaPercentuais = quizzes.reduce((acc, q) => acc + q.percentual, 0)
  return Math.round(somaPercentuais / quizzes.length)
}

export function getTotalQuizzesCompletos(progress: UserProgress): number {
  return (progress.completedQuizzes ?? []).length
}

export function isQuizCompleto(moduloId: string, progress: UserProgress): boolean {
  return (progress.completedQuizzes ?? []).some(q => q.moduloId === moduloId)
}

export function verificarResposta(questao: Questao, respostaIndex: number): boolean {
  return questao.respostaCorreta === respostaIndex
}

// ============ GLOSSÁRIO ============

export function getGlossario(): TermoGlossario[] {
  return glossarioData.termos as TermoGlossario[]
}

export function getTermoById(id: string): TermoGlossario | undefined {
  return getGlossario().find(t => t.id === id)
}

export function filtrarGlossario(busca: string): TermoGlossario[] {
  const termos = getGlossario()
  if (!busca.trim()) return termos
  
  const buscaLower = busca.toLowerCase()
  return termos.filter(t => 
    t.termo.toLowerCase().includes(buscaLower) ||
    (t.sigla && t.sigla.toLowerCase().includes(buscaLower)) ||
    t.definicao.toLowerCase().includes(buscaLower)
  )
}

export function getTermosPorModulo(moduloId: string): TermoGlossario[] {
  return getGlossario().filter(t => t.moduloId === moduloId)
}

// ============ CERTIFICADO ============

export interface CertificadoRequirements {
  licoesConcluidas: number
  totalLicoes: number
  quizzesConcluidos: number
  totalQuizzes: number
  notaMedia: number
  podeEmitir: boolean
}

export function verificarRequisitosCertificado(progress: UserProgress): CertificadoRequirements {
  const completedLessons = progress.completedLessons ?? []
  const completedQuizzes = progress.completedQuizzes ?? []
  const totalQuizzes = getQuizzes().length
  const totalLicoes = 20 // Total fixo de lições
  
  return {
    licoesConcluidas: completedLessons.length,
    totalLicoes,
    quizzesConcluidos: completedQuizzes.length,
    totalQuizzes,
    notaMedia: calcularNotaMedia(progress),
    podeEmitir: completedLessons.length >= totalLicoes && completedQuizzes.length >= totalQuizzes,
  }
}

// ============ ESTATÍSTICAS ============

export interface QuizStats {
  totalQuizzes: number
  quizzesCompletos: number
  notaMedia: number
  totalQuestoes: number
  questoesAcertadas: number
}

export function calcularQuizStats(progress: UserProgress): QuizStats {
  const quizzes = progress.completedQuizzes ?? []
  const totalAcertos = quizzes.reduce((acc, q) => acc + q.acertos, 0)
  const totalQuestoes = quizzes.reduce((acc, q) => acc + q.total, 0)
  
  return {
    totalQuizzes: getQuizzes().length,
    quizzesCompletos: quizzes.length,
    notaMedia: calcularNotaMedia(progress),
    totalQuestoes,
    questoesAcertadas: totalAcertos,
  }
}
