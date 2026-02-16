import modulosData from '@/data/modulos.json'
import type { Modulo, ModulosData, DashboardStats, UserProgress } from '@/types'

// Carrega os módulos do JSON
export function getModulos(): Modulo[] {
  return (modulosData as ModulosData).modulos
}

// Busca um módulo específico pelo ID
export function getModuloById(moduloId: string): Modulo | undefined {
  return getModulos().find(m => m.id === moduloId)
}

// Busca uma lição específica
export function getLicaoById(moduloId: string, licaoId: string) {
  const modulo = getModuloById(moduloId)
  if (!modulo) return undefined
  return modulo.licoes.find(l => l.id === licaoId)
}

// Calcula o total de lições de todos os módulos
export function getTotalLicoes(): number {
  return getModulos().reduce((acc, m) => acc + m.licoes.length, 0)
}

// Calcula o tempo total de estudo disponível
export function getTotalDuracao(): number {
  return getModulos().reduce((acc, m) => acc + m.duracao, 0)
}

// Calcula as estatísticas do dashboard
export function calcularDashboardStats(progress: UserProgress): DashboardStats {
  const modulos = getModulos()
  const totalModulos = modulos.length
  const totalLicoes = getTotalLicoes()
  
  const modulosCompletos = progress?.completedModules?.length ?? 0
  const licoesCompletas = progress?.completedLessons?.length ?? 0
  
  const progressoGeral = totalLicoes > 0 
    ? Math.round((licoesCompletas / totalLicoes) * 100)
    : 0

  return {
    progressoGeral,
    modulosCompletos,
    licoesCompletas,
    tempoEstudo: progress?.tempoEstudo ?? 0,
    totalModulos,
    totalLicoes,
  }
}

// Verifica se um módulo está bloqueado (precisa completar o anterior)
export function isModuloBloqueado(moduloId: string, completedModules: string[] = []): boolean {
  const modulos = getModulos()
  const moduloAtual = modulos.find(m => m.id === moduloId)
  
  if (!moduloAtual || moduloAtual.ordem === 1) return false
  
  const moduloAnterior = modulos.find(m => m.ordem === moduloAtual.ordem - 1)
  if (!moduloAnterior) return false
  
  return !(completedModules ?? []).includes(moduloAnterior.id)
}

// Verifica se uma lição está bloqueada (precisa completar a anterior)
export function isLicaoBloqueada(
  moduloId: string, 
  licaoId: string, 
  completedLessons: string[] = []
): boolean {
  const modulo = getModuloById(moduloId)
  if (!modulo) return true
  
  const licaoIndex = modulo.licoes.findIndex(l => l.id === licaoId)
  if (licaoIndex <= 0) return false
  
  const licaoAnterior = modulo.licoes[licaoIndex - 1]
  return !(completedLessons ?? []).includes(licaoAnterior.id)
}

// Retorna a próxima lição a fazer
export function getProximaLicao(progress: UserProgress): { moduloId: string; licaoId: string } | null {
  if (!progress) return null
  const modulos = getModulos()
  const completedModules = progress.completedModules ?? []
  const completedLessons = progress.completedLessons ?? []
  
  for (const modulo of modulos) {
    // Verifica se o módulo está bloqueado
    if (isModuloBloqueado(modulo.id, completedModules)) continue
    
    // Encontra a primeira lição não concluída
    for (const licao of modulo.licoes) {
      if (!completedLessons.includes(licao.id)) {
        return { moduloId: modulo.id, licaoId: licao.id }
      }
    }
  }
  
  return null
}

// Retorna o status de um módulo
export function getModuloStatus(
  moduloId: string, 
  progress: UserProgress
): 'bloqueado' | 'em-andamento' | 'completo' {
  const modulo = getModuloById(moduloId)
  if (!modulo || !progress) return 'bloqueado'
  
  const completedModules = progress.completedModules ?? []
  const completedLessons = progress.completedLessons ?? []
  
  if (isModuloBloqueado(moduloId, completedModules)) {
    return 'bloqueado'
  }
  
  if (completedModules.includes(moduloId)) {
    return 'completo'
  }
  
  // Verifica se tem alguma lição completa
  const temLicaoCompleta = modulo.licoes.some(l => 
    completedLessons.includes(l.id)
  )
  
  return temLicaoCompleta ? 'em-andamento' : 'em-andamento'
}

// Calcula progresso de um módulo em porcentagem
export function calcularProgressoModulo(moduloId: string, completedLessons: string[] = []): number {
  const modulo = getModuloById(moduloId)
  if (!modulo || modulo.licoes.length === 0) return 0
  
  const lessons = completedLessons ?? []
  const licoesCompletas = modulo.licoes.filter(l => 
    lessons.includes(l.id)
  ).length
  
  return Math.round((licoesCompletas / modulo.licoes.length) * 100)
}

// Verifica se todas as lições de um módulo foram concluídas
export function isModuloCompleto(moduloId: string, completedLessons: string[]): boolean {
  const modulo = getModuloById(moduloId)
  if (!modulo) return false
  
  return modulo.licoes.every(l => completedLessons.includes(l.id))
}

// Navegação: obtém lição anterior
export function getLicaoAnterior(moduloId: string, licaoId: string): { moduloId: string; licaoId: string } | null {
  const modulos = getModulos()
  const moduloAtual = getModuloById(moduloId)
  if (!moduloAtual) return null
  
  const licaoIndex = moduloAtual.licoes.findIndex(l => l.id === licaoId)
  
  // Se não é a primeira lição do módulo, retorna a anterior
  if (licaoIndex > 0) {
    return { moduloId, licaoId: moduloAtual.licoes[licaoIndex - 1].id }
  }
  
  // Se é a primeira lição, vai para a última do módulo anterior
  const moduloAnterior = modulos.find(m => m.ordem === moduloAtual.ordem - 1)
  if (moduloAnterior && moduloAnterior.licoes.length > 0) {
    return { 
      moduloId: moduloAnterior.id, 
      licaoId: moduloAnterior.licoes[moduloAnterior.licoes.length - 1].id 
    }
  }
  
  return null
}

// Navegação: obtém próxima lição
export function getLicaoProxima(moduloId: string, licaoId: string): { moduloId: string; licaoId: string } | null {
  const modulos = getModulos()
  const moduloAtual = getModuloById(moduloId)
  if (!moduloAtual) return null
  
  const licaoIndex = moduloAtual.licoes.findIndex(l => l.id === licaoId)
  
  // Se não é a última lição do módulo, retorna a próxima
  if (licaoIndex < moduloAtual.licoes.length - 1) {
    return { moduloId, licaoId: moduloAtual.licoes[licaoIndex + 1].id }
  }
  
  // Se é a última lição, vai para a primeira do próximo módulo
  const proximoModulo = modulos.find(m => m.ordem === moduloAtual.ordem + 1)
  if (proximoModulo && proximoModulo.licoes.length > 0) {
    return { moduloId: proximoModulo.id, licaoId: proximoModulo.licoes[0].id }
  }
  
  return null
}

// Formata tempo em horas e minutos
export function formatarTempo(minutos: number): string {
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  if (mins === 0) return `${horas}h`
  return `${horas}h ${mins}min`
}
