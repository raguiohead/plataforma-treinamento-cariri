'use client'

import { AppLayout } from '@/components/layout'
import { Card, Badge, Button, ProgressBar, ModuleIcon } from '@/components/ui'
import { useAuthStore } from '@/stores'
import {
  getModulos,
  calcularDashboardStats,
  getModuloStatus,
  calcularProgressoModulo,
  isModuloBloqueado,
  formatarTempo,
} from '@/lib/modulos'
import { 
  BookOpen, 
  Clock, 
  Lock, 
  CheckCircle2, 
  ChevronRight,
  Target,
} from 'lucide-react'
import Link from 'next/link'

export default function ModulosPage() {
  const { user } = useAuthStore()
  const modulos = getModulos()
  const stats = user ? calcularDashboardStats(user.progress) : null

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
            Módulos de Treinamento
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Complete todos os módulos para dominar os conhecimentos sobre a Unimed Cariri
          </p>
        </div>

        {/* Progress Overview */}
        {stats && (
          <Card className="bg-gradient-to-r from-unimed-green-500 to-unimed-blue-500 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-lg opacity-90">Progresso Geral</p>
                <p className="text-3xl font-bold">
                  {stats.modulosCompletos} de {stats.totalModulos} módulos completos
                </p>
              </div>
              <div className="w-full md:w-64">
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500" 
                    style={{ width: `${stats.progressoGeral}%` }} 
                  />
                </div>
                <p className="text-sm mt-2 opacity-90">
                  {stats.progressoGeral}% concluído • {stats.licoesCompletas}/{stats.totalLicoes} lições
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Modules List */}
        <div className="space-y-4">
          {modulos.map((modulo, index) => {
            const status = user ? getModuloStatus(modulo.id, user.progress) : 'bloqueado'
            const progresso = user ? calcularProgressoModulo(modulo.id, user.progress?.completedLessons ?? []) : 0
            const isBloqueado = status === 'bloqueado'
            const isCompleto = status === 'completo'
            const completedLessons = user?.progress?.completedLessons ?? []
            const licoesCompletas = user 
              ? modulo.licoes.filter(l => completedLessons.includes(l.id)).length 
              : 0

            return (
              <Card
                key={modulo.id}
                hover={!isBloqueado}
                className={isBloqueado ? 'opacity-60' : ''}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon & Order */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${modulo.cor}15` }}
                    >
                      <ModuleIcon name={modulo.icone} className="w-8 h-8" style={{ color: modulo.cor }} />
                    </div>
                    
                    <div className="md:hidden">
                      <span className="text-sm text-surface-400 dark:text-surface-500">Módulo {modulo.ordem}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="hidden md:inline text-sm text-surface-400 dark:text-surface-500">Módulo {modulo.ordem}</span>
                      {isCompleto && <Badge variant="success" size="sm">Concluído</Badge>}
                      {status === 'em-andamento' && progresso > 0 && (
                        <Badge variant="info" size="sm">{progresso}%</Badge>
                      )}
                      {isBloqueado && (
                        <Badge variant="default" size="sm">
                          <Lock className="w-3 h-3 mr-1" />
                          Bloqueado
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{modulo.titulo}</h3>
                    <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">{modulo.descricao}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {modulo.licoes.length} lições
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatarTempo(modulo.duracao)}
                      </span>
                      {!isBloqueado && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {licoesCompletas} concluídas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress & Action */}
                  <div className="flex flex-col items-end gap-3 md:w-48">
                    {!isBloqueado && (
                      <>
                        {progresso > 0 && progresso < 100 && (
                          <div className="w-full">
                            <ProgressBar value={progresso} size="sm" />
                          </div>
                        )}
                        <Link href={`/modulos/${modulo.id}`} className="w-full md:w-auto">
                          <Button 
                            variant={isCompleto ? 'outline' : 'primary'}
                            size="sm"
                            className="w-full"
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                          >
                            {isCompleto ? 'Revisar' : progresso > 0 ? 'Continuar' : 'Começar'}
                          </Button>
                        </Link>
                      </>
                    )}
                    
                    {isBloqueado && (
                      <p className="text-sm text-surface-400 dark:text-surface-500 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Complete o módulo {modulo.ordem - 1}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Info */}
        <Card className="bg-surface-50 dark:bg-surface-800/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-unimed-blue-100 dark:bg-unimed-blue-900/40 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-unimed-blue-600 dark:text-unimed-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Sobre o Treinamento</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                Este treinamento foi desenvolvido para capacitar colaboradores da Unimed Cariri 
                nos conhecimentos essenciais sobre planos de saúde, atendimento e processos internos. 
                Complete todos os módulos para emitir seu certificado de conclusão.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
