'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout'
import { Card, Button } from '@/components/ui'
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Book, 
  HelpCircle, 
  ChevronRight, 
  ExternalLink,
  Play,
  BookOpen,
  Award,
  Target,
  CheckCircle2,
  X,
} from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    question: 'Como acompanho meu progresso?',
    answer:
      'Você pode acompanhar seu progresso na página "Meu Progresso" ou no dashboard principal, que mostra quantas lições e módulos você já completou.',
  },
  {
    question: 'O que preciso para obter o certificado?',
    answer:
      'Para obter o certificado, você precisa completar todos os módulos e obter nota mínima de 70% nos quizzes de cada módulo.',
  },
  {
    question: 'Posso refazer as lições já completadas?',
    answer:
      'Sim! Você pode revisar qualquer lição já completada quantas vezes quiser para reforçar seu aprendizado.',
  },
  {
    question: 'Como funciona o quiz de cada módulo?',
    answer:
      'Ao final de cada módulo há um quiz para testar seus conhecimentos. Você precisa de 70% de acerto para concluir o módulo.',
  },
  {
    question: 'Posso acessar pelo celular?',
    answer:
      'Sim! A plataforma é totalmente responsiva e funciona perfeitamente em smartphones e tablets.',
  },
]

const guideSteps = [
  {
    icon: <Play className="w-6 h-6" />,
    title: 'Comece pelo Dashboard',
    description: 'O dashboard é seu ponto de partida. Ele mostra seu progresso geral e sugere a próxima lição a estudar.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Estude os Módulos',
    description: 'Acesse cada módulo em ordem. São 6 módulos com lições interativas sobre a Unimed e saúde suplementar.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Faça os Quizzes',
    description: 'Ao final de cada módulo, complete o quiz para testar seus conhecimentos. Você tem 3 tentativas por questão.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Conquiste o Certificado',
    description: 'Complete todos os módulos e quizzes para emitir seu certificado de conclusão do treinamento.',
  },
]

export default function AjudaPage() {
  const [showGuide, setShowGuide] = useState(false)
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">Central de Ajuda</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Encontre respostas para suas dúvidas ou entre em contato conosco
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card hover className="group cursor-pointer" onClick={() => setShowGuide(true)}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-unimed-green-100 dark:bg-unimed-green-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6 text-unimed-green-600 dark:text-unimed-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-surface-900 dark:text-white">Guia Rápido</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">Aprenda a usar a plataforma</p>
              </div>
              <ChevronRight className="w-5 h-5 text-surface-400 dark:text-surface-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          <Card hover className="group">
            <a href="mailto:servicedesk@unimedceara.com.br" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-unimed-blue-100 dark:bg-unimed-blue-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-unimed-blue-600 dark:text-unimed-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-surface-900 dark:text-white">E-mail</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">servicedesk@unimedceara.com.br</p>
              </div>
              <ExternalLink className="w-5 h-5 text-surface-400 dark:text-surface-500" />
            </a>
          </Card>

          <Card hover className="group">
            <a href="tel:+558530437800" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-surface-900 dark:text-white">Telefone</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">(85) 3043-7800</p>
              </div>
              <ExternalLink className="w-5 h-5 text-surface-400 dark:text-surface-500" />
            </a>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-unimed-green-500" />
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors list-none">
                  <span className="font-medium text-surface-900 dark:text-white">{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-surface-400 dark:text-surface-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </Card>

        {/* Contact Form */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-unimed-green-500" />
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Enviar Mensagem</h2>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Assunto</label>
              <select className="input-base">
                <option value="">Selecione o assunto</option>
                <option value="duvida">Dúvida sobre a plataforma</option>
                <option value="bug">Reportar um problema</option>
                <option value="sugestao">Sugestão de melhoria</option>
                <option value="outro">Outro assunto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Mensagem</label>
              <textarea
                rows={4}
                className="input-base resize-none"
                placeholder="Descreva sua dúvida ou problema..."
              />
            </div>

            <Button type="submit" rightIcon={<Mail className="w-4 h-4" />}>
              Enviar Mensagem
            </Button>
          </form>
        </Card>
      </div>

      {/* Guia Rápido Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-unimed-green-100 dark:bg-unimed-green-900/40 flex items-center justify-center">
                  <Book className="w-5 h-5 text-unimed-green-600 dark:text-unimed-green-400" />
                </div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">Guia Rápido</h2>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <X className="w-5 h-5 text-surface-500 dark:text-surface-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-surface-600 dark:text-surface-300">
                Bem-vindo à plataforma de treinamento da Unimed! Siga estes passos para aproveitar ao máximo seu aprendizado:
              </p>

              <div className="space-y-4">
                {guideSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                    <div className="w-12 h-12 rounded-xl bg-unimed-green-100 dark:bg-unimed-green-900/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-unimed-green-600 dark:text-unimed-green-400">{step.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-unimed-green-500 text-white text-sm font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-surface-900 dark:text-white">{step.title}</h3>
                      </div>
                      <p className="text-surface-600 dark:text-surface-300 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-unimed-green-50 dark:bg-unimed-green-900/20 border border-unimed-green-200 dark:border-unimed-green-800">
                <CheckCircle2 className="w-6 h-6 text-unimed-green-500 flex-shrink-0" />
                <p className="text-sm text-unimed-green-700 dark:text-unimed-green-300">
                  <strong>Dica:</strong> Você pode acessar qualquer lição já concluída para revisar o conteúdo quando precisar.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowGuide(false)}>
                  Fechar
                </Button>
                <Link href="/dashboard">
                  <Button onClick={() => setShowGuide(false)}>
                    Ir para o Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
