'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores'
import { Button, Input, Card } from '@/components/ui'
import { registerSchema, type RegisterFormData, departments } from '@/lib/validations'
import { Mail, Lock, User, Building, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore()

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})

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

  const handleChange =
    (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Valida com Zod
    const result = registerSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {}
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof RegisterFormData
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    // Tenta registro
    const success = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      department: formData.department?.trim() || undefined,
    })

    if (success) {
      router.push('/dashboard')
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500']

  return (
    <div className="animate-fade-in">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-unimed-green-500 to-unimed-green-600 flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-white">U</span>
        </div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Unimed Cariri</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">Plataforma de Treinamento</p>
      </div>

      {/* Form Card */}
      <Card variant="bordered" padding="lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Criar Conta</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Cadastre-se para começar sua jornada</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-slide-up">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome completo"
            type="text"
            placeholder="Seu nome"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            leftIcon={<User className="w-5 h-5" />}
            autoComplete="name"
            disabled={isLoading}
          />

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

          {/* Department Select */}
          <div className="w-full">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Departamento (opcional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
                <Building className="w-5 h-5" />
              </div>
              <select
                value={formData.department}
                onChange={handleChange('department')}
                className="input-base pl-10 appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="">Selecione seu departamento</option>
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
              autoComplete="new-password"
              disabled={isLoading}
            />
            {/* Password Strength */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  Força: {strengthLabels[passwordStrength - 1] || 'Muito fraca'}
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            leftIcon={<Lock className="w-5 h-5" />}
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="mt-6"
          >
            Criar Conta
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-700 text-center">
          <p className="text-surface-600 dark:text-surface-400">
            Já tem uma conta?{' '}
            <Link
              href="/auth/login"
              className="text-unimed-green-600 hover:text-unimed-green-700 dark:text-unimed-green-400 dark:hover:text-unimed-green-300 font-semibold"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </Card>

      {/* Benefits */}
      <div className="mt-6 space-y-3">
        {[
          'Acesso a todos os módulos de treinamento',
          'Quizzes interativos para testar conhecimento',
          'Acompanhe seu progresso em tempo real',
        ].map((benefit, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
            <CheckCircle className="w-4 h-4 text-unimed-green-500 flex-shrink-0" />
            {benefit}
          </div>
        ))}
      </div>
    </div>
  )
}
