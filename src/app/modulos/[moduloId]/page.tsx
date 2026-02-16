'use client'

import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout'
import { Card, Button, Badge, ProgressBar, ModuleIcon } from '@/components/ui'
import { useAuthStore } from '@/stores'
import {
  getModuloById,
  calcularProgressoModulo,
  isModuloBloqueado,
  isLicaoBloqueada,
  formatarTempo,
} from '@/lib/modulos'
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Lock,
  Play,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { getQuizByModuloId, getQuizResult } from '@/lib/quizzes'

export default function ModuloPage() {
  const params = useParams()
  const { user } = useAuthStore()

  const moduloId = params.moduloId as string
  const modulo = getModuloById(moduloId)

  if (!modulo) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-surface-300 dark:text-surface-600" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Módulo não encontrado</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Este módulo não existe ou foi removido.</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const isBloqueado = user 
    ? isModuloBloqueado(moduloId, user.progress?.completedModules ?? []) 
    : true
  const progresso = user 
    ? calcularProgressoModulo(moduloId, user.progress?.completedLessons ?? []) 
    : 0
  const isCompleto = user?.progress?.completedModules?.includes(moduloId) ?? false

  // Encontra a primeira lição não completa para "Continuar"
  const completedLessons = user?.progress?.completedLessons ?? []
  const proximaLicao = modulo.licoes.find(
    l => !completedLessons.includes(l.id)
  )

  // Quiz do módulo
  const quiz = getQuizByModuloId(moduloId)
  const quizResult = user?.progress ? getQuizResult(quiz?.id ?? '', user.progress) : undefined
  const todasLicoesConcluidas = modulo.licoes.every(l => completedLessons.includes(l.id))

  if (isBloqueado) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex justify-center mb-4">
            <Lock className="w-16 h-16 text-surface-300 dark:text-surface-600" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Módulo Bloqueado</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6 text-center">
            Complete o módulo anterior para desbloquear<br />
            <strong>{modulo.titulo}</strong>
          </p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-6">
          <Link 
            href="/dashboard" 
            className="hover:text-surface-700 dark:hover:text-surface-300 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-surface-900 dark:text-white font-medium flex items-center gap-1">
            <ModuleIcon name={modulo.icone} className="w-4 h-4" />
            {modulo.titulo}
          </span>
        </div>

        {/* Header Card */}
        <Card 
          className="mb-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${modulo.cor}15, ${modulo.cor}05)` }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${modulo.cor}20` }}
            >
              <ModuleIcon name={modulo.icone} className="w-10 h-10" style={{ color: modulo.cor }} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                  {modulo.titulo}
                </h1>
                {isCompleto && (
                  <Badge variant="success">Concluído</Badge>
                )}
              </div>
              
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                {modulo.descricao}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {modulo.licoes.length} lições
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatarTempo(modulo.duracao)}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {(user?.progress?.completedLessons ?? []).filter((id: string) => 
                    modulo.licoes.some(l => l.id === id)
                  ).length || 0} concluídas
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="md:w-48">
              <div className="text-center mb-2">
                <span className="text-3xl font-bold" style={{ color: modulo.cor }}>
                  {progresso}%
                </span>
              </div>
              <ProgressBar value={progresso} size="lg" />
            </div>
          </div>

          {/* CTA */}
          {proximaLicao && (
            <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
              <Link href={`/modulos/${moduloId}/licoes/${proximaLicao.id}`}>
                <Button 
                  size="lg"
                  rightIcon={<Play className="w-5 h-5" />}
                >
                  {progresso > 0 ? 'Continuar' : 'Começar Módulo'}
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Lessons List */}
        <div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
            Lições do Módulo
          </h2>

          <div className="space-y-3">
            {modulo.licoes.map((licao, index) => {
              const isLicaoCompleta = user?.progress?.completedLessons?.includes(licao.id) ?? false
              const isLicaoBloq = user 
                ? isLicaoBloqueada(moduloId, licao.id, user.progress?.completedLessons ?? [])
                : true

              return (
                <Card
                  key={licao.id}
                  hover={!isLicaoBloq}
                  className={isLicaoBloq && !isLicaoCompleta ? 'opacity-60' : ''}
                >
                  <div className="flex items-center gap-4">
                    {/* Number/Status */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-bold
                      ${isLicaoCompleta 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : isLicaoBloq
                        ? 'bg-surface-100 dark:bg-surface-700 text-surface-400 dark:text-surface-500'
                        : 'bg-unimed-green-100 dark:bg-unimed-green-900/30 text-unimed-green-600 dark:text-unimed-green-400'
                      }
                    `}>
                      {isLicaoCompleta ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isLicaoBloq ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${isLicaoBloq && !isLicaoCompleta ? 'text-surface-400 dark:text-surface-500' : 'text-surface-900 dark:text-white'}`}>
                        {licao.titulo}
                      </h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {licao.duracao} min
                      </p>
                    </div>

                    {/* Status Badge */}
                    {isLicaoCompleta && (
                      <Badge variant="success" size="sm">Concluída</Badge>
                    )}

                    {/* Action */}
                    {!isLicaoBloq && (
                      <Link href={`/modulos/${moduloId}/licoes/${licao.id}`}>
                        <Button 
                          variant={isLicaoCompleta ? 'outline' : 'primary'}
                          size="sm"
                          rightIcon={<ChevronRight className="w-4 h-4" />}
                        >
                          {isLicaoCompleta ? 'Revisar' : 'Iniciar'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Quiz Card */}
          {quiz && (
            <Card className="p-6 mt-6">
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${quizResult 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : todasLicoesConcluidas
                    ? 'bg-unimed-green-100 dark:bg-unimed-green-900/30 text-unimed-green-600 dark:text-unimed-green-400'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-400 dark:text-surface-500'
                  }
                `}>
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-surface-900 dark:text-white">Quiz do Módulo</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {quizResult 
                      ? `Nota: ${quizResult.percentual}% (${quizResult.acertos}/${quizResult.total} acertos)`
                      : `${quiz.questoes.length} questões • Aprox. 10 min`
                    }
                  </p>
                </div>
                {quizResult ? (
                  <Link href={`/quiz/${moduloId}`}>
                    <Button variant="outline" size="sm">
                      Refazer Quiz
                    </Button>
                  </Link>
                ) : todasLicoesConcluidas ? (
                  <Link href={`/quiz/${moduloId}`}>
                    <Button variant="primary" size="sm">
                      Iniciar Quiz
                    </Button>
                  </Link>
                ) : (
                  <Badge variant="warning" size="sm">
                    Complete as lições
                  </Badge>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/dashboard">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
