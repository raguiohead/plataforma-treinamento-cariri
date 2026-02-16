'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button, Input, Card } from '@/components/ui'
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import logoUnimed from '@/img/logo-unimedcariri.png'

const emailSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
})

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Valida e-mail
    const result = emailSchema.safeParse({ email })
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }

    setIsLoading(true)

    // Simula envio de e-mail (em produção, conectar com backend)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="animate-fade-in">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          <Image
            src={logoUnimed}
            alt="Unimed Cariri"
            width={120}
            height={48}
            className="mx-auto mb-4"
            priority
          />
        </div>

        <Card variant="bordered" padding="lg" className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
            E-mail enviado!
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Enviamos instruções para redefinir sua senha para{' '}
            <strong className="text-surface-700 dark:text-surface-300">{email}</strong>.
            Verifique sua caixa de entrada e spam.
          </p>

          <div className="space-y-3">
            <Button
              fullWidth
              variant="outline"
              onClick={() => {
                setIsSuccess(false)
                setEmail('')
              }}
            >
              Enviar novamente
            </Button>
            <Link href="/auth/login" className="block">
              <Button fullWidth variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Voltar ao login
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8">
        <Image
          src={logoUnimed}
          alt="Unimed Cariri"
          width={120}
          height={48}
          className="mx-auto mb-4"
          priority
        />
        <p className="text-sm text-surface-500 dark:text-surface-400">Plataforma de Treinamento</p>
      </div>

      {/* Form Card */}
      <Card variant="bordered" padding="lg">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Recuperar senha</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Digite seu e-mail para receber instruções de redefinição de senha.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-slide-up">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            error={error ? ' ' : undefined}
            leftIcon={<Mail className="w-5 h-5" />}
            autoComplete="email"
            disabled={isLoading}
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Enviar instruções
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-700 text-center">
          <p className="text-surface-600 dark:text-surface-400">
            Lembrou a senha?{' '}
            <Link
              href="/auth/login"
              className="text-unimed-green-600 hover:text-unimed-green-700 dark:text-unimed-green-400 dark:hover:text-unimed-green-300 font-semibold"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
