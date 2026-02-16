'use client'

import { AppLayout } from '@/components/layout'
import { Card, Button, Badge, ModuleIcon } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { 
  getModulos, 
  calcularDashboardStats, 
  getModuloStatus,
  formatarTempo,
  getTotalDuracao,
} from '@/lib/modulos'
import { calcularNotaMedia, verificarRequisitosCertificado } from '@/lib/quizzes'
import { gerarCertificadoPDF } from '@/lib/certificado'
import { Award, Download, Share2, CheckCircle2, Lock, Calendar, User, BookOpen, Clock, Target } from 'lucide-react'
import Link from 'next/link'

export default function CertificadoPage() {
  const { user, earnCertificate } = useAuthStore()
  const modulos = getModulos()

  if (!user) return null

  const stats = calcularDashboardStats(user.progress)
  const requisitos = verificarRequisitosCertificado(user.progress)
  const notaMedia = calcularNotaMedia(user.progress)
  const canGetCertificate = requisitos.podeEmitir
  const hasCertificate = !!user.progress?.certificateEarnedAt
  const totalDuracao = getTotalDuracao()

  const handleEmitCertificate = () => {
    earnCertificate()
  }

  const handleDownloadPDF = () => {
    gerarCertificadoPDF({
      nomeColaborador: user.name,
      departamento: user.department,
      dataEmissao: formatDate(user.progress?.certificateEarnedAt ?? new Date()),
      cargaHoraria: formatarTempo(totalDuracao),
      notaMedia,
      totalModulos: stats.totalModulos,
      totalLicoes: stats.totalLicoes,
    })
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(d)
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
            Certificado de Conclusão
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">
            Treinamento Unimed Cariri
          </p>
        </div>

        {/* Progress Card */}
        <Card className="p-6">
          <h2 className="font-bold text-surface-900 dark:text-white mb-4">Progresso do Treinamento</h2>
          
          <div className="space-y-3">
            {modulos.map((modulo) => {
              const status = getModuloStatus(modulo.id, user.progress)
              const isCompleto = status === 'completo'
              const isBloqueado = status === 'bloqueado'
              const emAndamento = status === 'em-andamento' && !isCompleto

              return (
                <div key={modulo.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleto 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                      : emAndamento
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-400'
                  }`}>
                    {isCompleto ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isBloqueado ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <ModuleIcon name={modulo.icone} className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isBloqueado ? 'text-surface-400' : 'text-surface-900 dark:text-white'
                    }`}>
                      {modulo.titulo}
                    </p>
                  </div>
                  {isCompleto && (
                    <Badge variant="success" size="sm">Concluído</Badge>
                  )}
                  {emAndamento && (
                    <Badge variant="info" size="sm">Em andamento</Badge>
                  )}
                  {isBloqueado && (
                    <Badge variant="default" size="sm">Pendente</Badge>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-surface-500 dark:text-surface-400">Progresso geral</span>
              <span className="font-semibold text-surface-900 dark:text-white">
                {stats.modulosCompletos}/{stats.totalModulos} módulos
              </span>
            </div>
            <div className="h-3 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-unimed-green-500 to-unimed-green-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.progressoGeral}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Certificate Display / CTA */}
        {hasCertificate ? (
          <Card className="p-8 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
            {/* Certificate Preview */}
            <div className="text-center mb-6">
              <Badge variant="premium" size="lg" className="mb-4">
                Certificado Emitido
              </Badge>
              
              <div className="border-4 border-double border-amber-300 rounded-lg p-8 bg-white shadow-soft">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-unimed-green-500 to-unimed-green-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">U</span>
                  </div>
                  <h3 className="text-lg font-bold text-surface-900">Unimed Cariri</h3>
                </div>
                
                <p className="text-sm text-surface-500 mb-2">Certificamos que</p>
                <h2 className="text-2xl font-bold text-surface-900 mb-4">{user.name}</h2>
                <p className="text-sm text-surface-500 mb-6">
                  concluiu com êxito o Treinamento de Capacitação<br />
                  <strong>Unimed Cariri - Formação de Colaboradores</strong>
                </p>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-surface-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(user.progress?.certificateEarnedAt ?? new Date())}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {stats.totalModulos} módulos
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatarTempo(totalDuracao)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Nota: {notaMedia}%
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="primary"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDownloadPDF}
              >
                Baixar PDF
              </Button>
              <Button 
                variant="outline"
                leftIcon={<Share2 className="w-4 h-4" />}
              >
                Compartilhar
              </Button>
            </div>
          </Card>
        ) : canGetCertificate ? (
          <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-surface-900 mb-2">
              Parabéns! Você completou o treinamento!
            </h2>
            <p className="text-surface-500 mb-6">
              Todos os {stats.totalModulos} módulos foram concluídos. Agora você pode emitir seu certificado.
            </p>
            <Button 
              size="lg"
              leftIcon={<Award className="w-5 h-5" />}
              onClick={handleEmitCertificate}
            >
              Emitir Certificado
            </Button>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <Lock className="w-10 h-10 text-surface-400" />
            </div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
              Certificado Bloqueado
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Complete todos os {stats.totalModulos} módulos do treinamento para desbloquear seu certificado.
              <br />
              Você concluiu {stats.modulosCompletos} de {stats.totalModulos} módulos até agora.
            </p>
            <Link href="/modulos">
              <Button 
                size="lg"
                leftIcon={<BookOpen className="w-5 h-5" />}
              >
                Continuar Treinamento
              </Button>
            </Link>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-4 bg-surface-50 dark:bg-surface-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-unimed-blue-100 dark:bg-unimed-blue-900/30 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-unimed-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Sobre o Certificado</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                O certificado de conclusão atesta que você completou todos os {stats.totalModulos} módulos 
                ({stats.totalLicoes} lições) do treinamento Unimed Cariri, com carga horária de {formatarTempo(totalDuracao)}. 
                Você poderá baixar o documento em PDF ou compartilhá-lo diretamente em suas redes profissionais.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
