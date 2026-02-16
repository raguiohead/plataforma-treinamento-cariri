'use client'

import { AppLayout } from '@/components/layout'
import { Card, Button, Badge, ProgressBar, ModuleIcon } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { 
  getModulos, 
  calcularDashboardStats, 
  getModuloStatus,
  calcularProgressoModulo,
  getProximaLicao,
  formatarTempo,
  getLicaoById,
} from '@/lib/modulos'
import { 
  BookOpen, 
  Award, 
  Clock, 
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
  Target,
  Hand,
  PartyPopper,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuthStore()

  if (!user) return null

  const modulos = getModulos()
  const stats = calcularDashboardStats(user.progress)
  const proximaLicao = getProximaLicao(user.progress)
  const canGetCertificate = stats.modulosCompletos === stats.totalModulos

  // Encontra a lição e módulo atual para "Continuar aprendendo"
  const moduloAtual = proximaLicao ? modulos.find(m => m.id === proximaLicao.moduloId) : null
  const licaoAtual = proximaLicao && moduloAtual 
    ? getLicaoById(proximaLicao.moduloId, proximaLicao.licaoId) 
    : null

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
              Olá, {user.name.split(' ')[0]}! <Hand className="w-7 h-7 text-amber-500" />
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Continue sua jornada de aprendizado na Unimed Cariri
            </p>
          </div>

          {/* Progress Overview */}
          <div className="flex items-center gap-3 px-4 py-3 bg-unimed-green-50 dark:bg-unimed-green-900/30 border border-unimed-green-200 dark:border-unimed-green-800 rounded-xl">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-unimed-green-100"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.progressoGeral * 1.508} 151`}
                  className="text-unimed-green-500 transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-unimed-green-600">
                {stats.progressoGeral}%
              </span>
            </div>
            <div>
              <p className="text-sm text-unimed-green-700 dark:text-unimed-green-400">Progresso geral</p>
              <p className="text-lg font-bold text-unimed-green-600 dark:text-unimed-green-300">
                {stats.licoesCompletas}/{stats.totalLicoes} lições
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-unimed-green-100 dark:bg-unimed-green-900/40 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-unimed-green-600 dark:text-unimed-green-400" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Módulos</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {stats.modulosCompletos}/{stats.totalModulos}
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-unimed-blue-100 dark:bg-unimed-blue-900/40 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-unimed-blue-600 dark:text-unimed-blue-400" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Lições</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {stats.licoesCompletas}/{stats.totalLicoes}
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Tempo de estudo</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {formatarTempo(stats.tempoEstudo)}
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-surface-500 dark:text-surface-400">Certificado</p>
              {canGetCertificate ? (
                <Link href="/certificado">
                  <span className="text-lg font-bold text-green-600 hover:underline">
                    Disponível!
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-surface-600">
                  {stats.totalModulos - stats.modulosCompletos} módulos restantes
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Continue Learning */}
        {moduloAtual && licaoAtual && (
          <Card variant="gradient" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <Badge variant="premium" size="sm" className="mb-4">
                Continuar aprendendo
              </Badge>
              <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                <ModuleIcon name={moduloAtual.icone} className="w-4 h-4" />
                <span>{moduloAtual.titulo}</span>
                <ChevronRight className="w-4 h-4" />
                <span>Lição {modulos.findIndex(m => m.id === moduloAtual.id) + 1}.{moduloAtual.licoes.findIndex(l => l.id === licaoAtual.id) + 1}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">
                {licaoAtual.titulo}
              </h2>
              <p className="opacity-90 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                ~{licaoAtual.duracao} min de leitura
              </p>
              <Link href={`/modulos/${moduloAtual.id}/licoes/${licaoAtual.id}`}>
                <Button
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  rightIcon={<Play className="w-4 h-4" />}
                >
                  Continuar
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Completed Message */}
        {!proximaLicao && stats.progressoGeral === 100 && (
          <Card variant="gradient" className="text-center py-8">
            <div className="flex justify-center mb-4">
              <PartyPopper className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Parabéns!</h2>
            <p className="opacity-90 mb-4">
              Você completou todo o treinamento da Unimed Cariri!
            </p>
            <Link href="/certificado">
              <Button
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white"
                rightIcon={<Award className="w-4 h-4" />}
              >
                Ver Certificado
              </Button>
            </Link>
          </Card>
        )}

        {/* Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">Módulos de Treinamento</h2>
            <span className="text-sm text-surface-500 dark:text-surface-400">
              {stats.totalModulos} módulos • {stats.totalLicoes} lições
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulos.map(modulo => {
              const status = getModuloStatus(modulo.id, user.progress)
              const progresso = calcularProgressoModulo(modulo.id, user.progress?.completedLessons ?? [])
              const isBloqueado = status === 'bloqueado'
              const isCompleto = status === 'completo'

              return (
                <Card
                  key={modulo.id}
                  hover={!isBloqueado}
                  className={isBloqueado ? 'opacity-60' : ''}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${modulo.cor}15` }}
                    >
                      <ModuleIcon name={modulo.icone} className="w-6 h-6" style={{ color: modulo.cor }} />
                    </div>
                    {isCompleto && (
                      <Badge variant="success" size="sm">Concluído</Badge>
                    )}
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

                  <h3 className="font-bold text-surface-900 dark:text-white mb-1">{modulo.titulo}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 line-clamp-2">{modulo.descricao}</p>

                  <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {modulo.licoes.length} lições
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatarTempo(modulo.duracao)}
                    </span>
                  </div>

                  {!isBloqueado && (
                    <>
                      {progresso > 0 && progresso < 100 && (
                        <ProgressBar value={progresso} size="sm" className="mb-4" />
                      )}
                      <Link href={`/modulos/${modulo.id}`}>
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
                      Complete o módulo anterior
                    </p>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Certificate CTA */}
        <Card hover className="group">
          <Link href="/certificado" className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-surface-900 dark:text-white">Certificado de Conclusão</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {canGetCertificate 
                    ? 'Parabéns! Seu certificado está disponível'
                    : `Complete ${stats.totalModulos - stats.modulosCompletos} módulo(s) restante(s)`
                  }
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-surface-400 dark:text-surface-500 group-hover:text-surface-600 dark:group-hover:text-surface-300 group-hover:translate-x-1 transition-all" />
          </Link>
        </Card>
      </div>
    </AppLayout>
  )
}
