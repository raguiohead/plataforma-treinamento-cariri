'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores'
import { Button, Input, Card } from '@/components/ui'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import logoUnimed from '@/img/logo-unimedcariri.png'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})

  // Redireciona se já autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Limpa erros ao digitar
  useEffect(() => {
    if (error) clearError()
  }, [formData])

  const handleChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Valida com Zod
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof LoginFormData
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    // Tenta login
    const success = await login(formData)
    if (success) {
      router.push('/dashboard')
    }
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Entrar</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Acesse sua conta para continuar aprendendo</p>
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
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            leftIcon={<Mail className="w-5 h-5" />}
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            leftIcon={<Lock className="w-5 h-5" />}
            autoComplete="current-password"
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 text-unimed-green-500 focus:ring-unimed-green-500"
              />
              <span className="text-sm text-surface-600 dark:text-surface-400">Lembrar de mim</span>
            </label>
            <Link
              href="/auth/recuperar-senha"
              className="text-sm text-unimed-green-600 hover:text-unimed-green-700 font-medium"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Entrar
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-700 text-center">
          <p className="text-surface-600 dark:text-surface-400">
            Não tem uma conta?{' '}
            <Link
              href="/auth/cadastro"
              className="text-unimed-green-600 hover:text-unimed-green-700 dark:text-unimed-green-400 dark:hover:text-unimed-green-300 font-semibold"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </Card>

      {/* Demo credentials */}
      <div className="mt-6 p-4 rounded-lg bg-surface-100 dark:bg-surface-800 text-center">
        <p className="text-sm text-surface-600 dark:text-surface-400">
          <strong>Dica:</strong> Crie uma conta para começar ou use{' '}
          <button
            type="button"
            onClick={() =>
              setFormData({ email: 'demo@unimed.com', password: 'Demo123' })
            }
            className="text-unimed-green-600 hover:underline font-medium"
          >
            credenciais demo
          </button>
        </p>
      </div>
    </div>
  )
}
