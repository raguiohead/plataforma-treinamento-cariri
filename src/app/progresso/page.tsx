'use client'

import { AppLayout } from '@/components/layout'
import { Card, Button, Badge, ProgressBar, ModuleIcon } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { getModulos, calcularDashboardStats, calcularProgressoModulo, formatarTempo } from '@/lib/modulos'
import { calcularQuizStats, getQuizResult, verificarRequisitosCertificado } from '@/lib/quizzes'
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Award,
  Target,
  Calendar,
  TrendingUp,
  Play,
} from 'lucide-react'
import Link from 'next/link'

export default function ProgressoPage() {
  const { user } = useAuthStore()
  const modulos = getModulos()

  if (!user) return null

  const dashStats = calcularDashboardStats(user.progress)
  const quizStats = calcularQuizStats(user.progress)
  const requisitos = verificarRequisitosCertificado(user.progress)
  const completedLessons = user.progress?.completedLessons ?? []
  const completedModules = user.progress?.completedModules ?? []
  const startDate = user.createdAt

  // Formatar data
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
              Meu Progresso
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Acompanhe sua jornada de aprendizado
            </p>
          </div>

          {requisitos.podeEmitir && (
            <Link href="/certificado">
              <Button>
                <Award className="w-4 h-4 mr-2" />
                Emitir Certificado
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-unimed-green-100 dark:bg-unimed-green-900/40 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-unimed-green-600 dark:text-unimed-green-400" />
            </div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white">{dashStats.progressoGeral}%</div>
            <div className="text-sm text-surface-500 dark:text-surface-400">Progresso Geral</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white">{dashStats.licoesCompletas}/{dashStats.totalLicoes}</div>
            <div className="text-sm text-surface-500 dark:text-surface-400">Lições Completas</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white">{quizStats.quizzesCompletos}/{quizStats.totalQuizzes}</div>
            <div className="text-sm text-surface-500 dark:text-surface-400">Quizzes Realizados</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white">{formatarTempo(dashStats.tempoEstudo)}</div>
            <div className="text-sm text-surface-500 dark:text-surface-400">Tempo de Estudo</div>
          </Card>
        </div>

        {/* Timeline Header */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-surface-500 dark:text-surface-400" />
            <div>
              <span className="text-sm text-surface-500 dark:text-surface-400">Início do treinamento: </span>
              <span className="font-medium text-surface-900 dark:text-white">{formatDate(startDate)}</span>
            </div>
          </div>
        </Card>

        {/* Modules Timeline */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">Módulos do Treinamento</h2>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-surface-200 dark:bg-surface-700" />

            <div className="space-y-6">
              {modulos.map((modulo, index) => {
                const isCompleto = completedModules.includes(modulo.id)
                const progressoModulo = calcularProgressoModulo(modulo.id, completedLessons)
                const quizResult = getQuizResult(`quiz-${modulo.id}`, user.progress)
                const licoesCompletasModulo = modulo.licoes.filter(l => 
                  completedLessons.includes(l.id)
                ).length
                const emAndamento = progressoModulo > 0 && !isCompleto

                return (
                  <div key={modulo.id} className="relative pl-16">
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 w-5 h-5 rounded-full border-4 ${
                      isCompleto 
                        ? 'bg-green-500 border-green-200' 
                        : emAndamento
                        ? 'bg-blue-500 border-blue-200'
                        : 'bg-surface-200 border-surface-100'
                    }`} />

                    <Card className={`${isCompleto ? 'border-green-200' : emAndamento ? 'border-blue-200' : ''}`}>
                      {/* Header */}
                      <div className="p-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${modulo.cor}15` }}
                          >
                            <ModuleIcon name={modulo.icone} className="w-6 h-6" style={{ color: modulo.cor }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-surface-900 dark:text-white">{modulo.titulo}</h3>
                              {isCompleto && (
                                <Badge variant="success" size="sm">Completo</Badge>
                              )}
                              {emAndamento && (
                                <Badge variant="info" size="sm">Em andamento</Badge>
                              )}
                            </div>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                              {licoesCompletasModulo} de {modulo.licoes.length} lições • {formatarTempo(modulo.duracao)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="px-4 pb-4">
                        <ProgressBar value={progressoModulo} size="sm" />
                      </div>

                      {/* Lessons Checklist */}
                      <div className="px-4 pb-4 border-t border-surface-100 dark:border-surface-700">
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {modulo.licoes.map((licao, licaoIndex) => {
                            const licaoCompleta = completedLessons.includes(licao.id)
                            
                            return (
                              <div 
                                key={licao.id}
                                className={`flex items-center gap-2 p-2 rounded-lg ${licaoCompleta ? 'bg-green-50 dark:bg-green-900/20' : 'bg-surface-50 dark:bg-surface-700/50'}`}
                              >
                                {licaoCompleta ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-surface-300 dark:text-surface-500 flex-shrink-0" />
                                )}
                                <span className={`text-sm truncate ${licaoCompleta ? 'text-green-700 dark:text-green-300' : 'text-surface-600 dark:text-surface-400'}`}>
                                  {licaoIndex + 1}. {licao.titulo}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Quiz Result */}
                      <div className="px-4 pb-4 border-t border-surface-100 dark:border-surface-700">
                        <div className="pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${quizResult ? quizResult.percentual >= 60 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30' : 'bg-surface-100 dark:bg-surface-700'}`}>
                              <Target className={`w-5 h-5 ${quizResult ? quizResult.percentual >= 60 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400' : 'text-surface-400 dark:text-surface-500'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-surface-900 dark:text-white">Quiz do Módulo</p>
                              {quizResult ? (
                                <p className="text-sm text-surface-500 dark:text-surface-400">
                                  Resultado: {quizResult.acertos}/{quizResult.total} ({quizResult.percentual}%)
                                </p>
                              ) : (
                                <p className="text-sm text-surface-500 dark:text-surface-400">Não realizado</p>
                              )}
                            </div>
                          </div>

                          <Link href={`/quiz/${modulo.id}`}>
                            <Button variant={quizResult ? 'outline' : 'primary'} size="sm">
                              {quizResult ? 'Refazer' : (
                                <>
                                  <Play className="w-4 h-4 mr-1" />
                                  Iniciar
                                </>
                              )}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Certificate Requirements */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
            Requisitos para Certificado
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50">
              <div className="flex items-center gap-3">
                {requisitos.licoesConcluidas >= requisitos.totalLicoes ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-surface-300 dark:text-surface-500" />
                )}
                <div>
                  <p className="font-medium text-surface-900 dark:text-white">Completar todas as lições</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {requisitos.licoesConcluidas} de {requisitos.totalLicoes} lições
                  </p>
                </div>
              </div>
              <ProgressBar 
                value={(requisitos.licoesConcluidas / requisitos.totalLicoes) * 100} 
                size="sm" 
                className="w-24"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50">
              <div className="flex items-center gap-3">
                {requisitos.quizzesConcluidos >= requisitos.totalQuizzes ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-surface-300 dark:text-surface-500" />
                )}
                <div>
                  <p className="font-medium text-surface-900 dark:text-white">Realizar todos os quizzes</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {requisitos.quizzesConcluidos} de {requisitos.totalQuizzes} quizzes
                  </p>
                </div>
              </div>
              <ProgressBar 
                value={(requisitos.quizzesConcluidos / requisitos.totalQuizzes) * 100} 
                size="sm" 
                className="w-24"
              />
            </div>

            {requisitos.notaMedia > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                <div className="flex items-center gap-3">
                  <Award className={`w-6 h-6 ${requisitos.notaMedia >= 60 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`} />
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">Nota média nos quizzes</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{requisitos.notaMedia}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {requisitos.podeEmitir ? (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="font-bold text-green-700 dark:text-green-300">Parabéns! Você completou todos os requisitos!</p>
              <Link href="/certificado" className="mt-3 inline-block">
                <Button>
                  <Award className="w-4 h-4 mr-2" />
                  Emitir Meu Certificado
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600 rounded-xl text-center">
              <p className="text-surface-600 dark:text-surface-400">
                Continue estudando para desbloquear seu certificado!
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
