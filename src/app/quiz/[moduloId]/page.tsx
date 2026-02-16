'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout'
import { Card, Button, Badge, ProgressBar } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { getQuizByModuloId, verificarResposta, getQuizResult } from '@/lib/quizzes'
import { getModuloById } from '@/lib/modulos'
import type { QuizResult } from '@/types'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  RotateCcw,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link'

const MAX_TENTATIVAS = 3

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { user, completeQuiz } = useAuthStore()

  const moduloId = params.moduloId as string
  const modulo = getModuloById(moduloId)
  const quiz = getQuizByModuloId(moduloId)

  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null)
  const [tentativas, setTentativas] = useState(0)
  const [acertou, setAcertou] = useState(false)
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false)
  const [respostas, setRespostas] = useState<{ acertou: boolean; tentativas: number }[]>([])
  const [quizFinalizado, setQuizFinalizado] = useState(false)

  // Verifica se já fez o quiz
  const resultadoAnterior = user && quiz ? getQuizResult(quiz.id, user.progress) : null

  useEffect(() => {
    // Reset state quando muda o quiz
    setQuestaoAtual(0)
    setRespostaSelecionada(null)
    setTentativas(0)
    setAcertou(false)
    setMostrarExplicacao(false)
    setRespostas([])
    setQuizFinalizado(false)
  }, [moduloId])

  if (!modulo || !quiz) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Quiz não encontrado</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Este quiz não existe ou foi removido.</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const questao = quiz.questoes[questaoAtual]
  const progresso = ((questaoAtual) / quiz.questoes.length) * 100
  const totalAcertos = respostas.filter(r => r.acertou).length

  const handleSelecionarResposta = (index: number) => {
    if (acertou || tentativas >= MAX_TENTATIVAS) return
    setRespostaSelecionada(index)
  }

  const handleConfirmar = () => {
    if (respostaSelecionada === null) return

    const estaCorreto = verificarResposta(questao, respostaSelecionada)
    
    if (estaCorreto) {
      setAcertou(true)
      setMostrarExplicacao(true)
      setRespostas([...respostas, { acertou: true, tentativas: tentativas + 1 }])
    } else {
      const novasTentativas = tentativas + 1
      setTentativas(novasTentativas)
      
      if (novasTentativas >= MAX_TENTATIVAS) {
        // Esgotou tentativas
        setMostrarExplicacao(true)
        setRespostas([...respostas, { acertou: false, tentativas: MAX_TENTATIVAS }])
      } else {
        // Pode tentar novamente
        setRespostaSelecionada(null)
      }
    }
  }

  const handleProximaQuestao = () => {
    if (questaoAtual + 1 >= quiz.questoes.length) {
      // Quiz finalizado
      const acertos = [...respostas].filter(r => r.acertou).length + (acertou ? 0 : 0) // já foi adicionado
      finalizarQuiz()
    } else {
      setQuestaoAtual(questaoAtual + 1)
      setRespostaSelecionada(null)
      setTentativas(0)
      setAcertou(false)
      setMostrarExplicacao(false)
    }
  }

  const finalizarQuiz = () => {
    const acertos = respostas.filter(r => r.acertou).length
    const total = quiz.questoes.length
    const percentual = Math.round((acertos / total) * 100)

    const resultado: QuizResult = {
      quizId: quiz.id,
      moduloId: quiz.moduloId,
      acertos,
      total,
      percentual,
      completedAt: new Date().toISOString(),
    }

    completeQuiz(resultado)
    setQuizFinalizado(true)
  }

  const handleRefazerQuiz = () => {
    setQuestaoAtual(0)
    setRespostaSelecionada(null)
    setTentativas(0)
    setAcertou(false)
    setMostrarExplicacao(false)
    setRespostas([])
    setQuizFinalizado(false)
  }

  // Tela de resultado
  if (quizFinalizado) {
    const acertos = respostas.filter(r => r.acertou).length
    const percentual = Math.round((acertos / quiz.questoes.length) * 100)
    const passou = percentual >= 60

    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${passou ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
              {passou ? (
                <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
              ) : (
                <RotateCcw className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
              {passou ? 'Parabéns!' : 'Continue Estudando!'}
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {passou 
                ? 'Você completou o quiz com sucesso!'
                : 'Revise o conteúdo e tente novamente.'
              }
            </p>

            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-surface-900 dark:text-white">{acertos}</div>
                <div className="text-sm text-surface-500 dark:text-surface-400">de {quiz.questoes.length} corretas</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${passou ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {percentual}%
                </div>
                <div className="text-sm text-surface-500 dark:text-surface-400">aproveitamento</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={handleRefazerQuiz}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Refazer Quiz
              </Button>
              <Link href={`/modulos/${moduloId}`}>
                <Button variant="secondary">
                  Voltar ao Módulo
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button>
                  Ir ao Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-4">
            <Link 
              href={`/modulos/${moduloId}`}
              className="hover:text-surface-700 dark:hover:text-surface-300 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              {modulo.titulo}
            </Link>
            <span>/</span>
            <span className="text-surface-900 dark:text-white font-medium">Quiz</span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4 mb-4">
            <ProgressBar value={progresso} size="md" className="flex-1" />
            <span className="text-sm font-medium text-surface-600 dark:text-surface-400 whitespace-nowrap">
              {questaoAtual + 1} de {quiz.questoes.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              Tentativa {tentativas + 1} de {MAX_TENTATIVAS}
            </Badge>
            {resultadoAnterior && (
              <Badge variant="default" size="sm">
                Melhor resultado: {resultadoAnterior.percentual}%
              </Badge>
            )}
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">
            {questao.pergunta}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {questao.opcoes.map((opcao, index) => {
              const isSelected = respostaSelecionada === index
              const isCorrect = index === questao.respostaCorreta
              const showResult = mostrarExplicacao

              let bgClass = 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-600 hover:border-surface-300 dark:hover:border-surface-500'
              let textClass = 'text-surface-700 dark:text-surface-300'

              if (showResult) {
                if (isCorrect) {
                  bgClass = 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600'
                  textClass = 'text-green-700 dark:text-green-300'
                } else if (isSelected && !isCorrect) {
                  bgClass = 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600'
                  textClass = 'text-red-700 dark:text-red-300'
                }
              } else if (isSelected) {
                bgClass = 'bg-unimed-green-50 dark:bg-unimed-green-900/30 border-unimed-green-500 dark:border-unimed-green-600'
                textClass = 'text-unimed-green-700'
              }

              return (
                <button
                  key={`option-${index}-${opcao.slice(0, 15)}`}
                  onClick={() => handleSelecionarResposta(index)}
                  disabled={mostrarExplicacao}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${bgClass} ${textClass} ${
                    !mostrarExplicacao ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      showResult && isCorrect 
                        ? 'bg-green-500 text-white'
                        : showResult && isSelected && !isCorrect
                        ? 'bg-red-500 text-white'
                        : isSelected 
                        ? 'bg-unimed-green-500 text-white'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                    }`}>
                      {showResult && isCorrect ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : showResult && isSelected && !isCorrect ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className="font-medium">{opcao}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback após responder */}
          {!mostrarExplicacao && tentativas > 0 && !acertou && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">
                  Resposta incorreta. Você tem {MAX_TENTATIVAS - tentativas} tentativa(s) restante(s).
                </span>
              </div>
            </div>
          )}

          {/* Explicação após acertar ou esgotar tentativas */}
          {mostrarExplicacao && (
            <div className={`mt-6 p-4 rounded-xl ${acertou ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${acertou ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
                  {acertou ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${acertou ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {acertou ? 'Correto!' : 'Resposta Correta:'}
                  </h4>
                  {!acertou && (
                    <p className="text-surface-700 dark:text-surface-300 font-medium mb-2">
                      {questao.opcoes[questao.respostaCorreta]}
                    </p>
                  )}
                  <div className="flex items-start gap-2 mt-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-surface-600 dark:text-surface-400">{questao.explicacao}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            {!mostrarExplicacao ? (
              <Button 
                onClick={handleConfirmar}
                disabled={respostaSelecionada === null}
              >
                Confirmar Resposta
              </Button>
            ) : (
              <Button onClick={handleProximaQuestao}>
                {questaoAtual + 1 >= quiz.questoes.length ? 'Ver Resultado' : 'Próxima Questão'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
