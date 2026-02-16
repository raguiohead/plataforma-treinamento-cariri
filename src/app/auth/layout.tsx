import type { Metadata } from 'next'
import Image from 'next/image'
import logoUnimed from '@/img/logo-unimedcariri.png'

export const metadata: Metadata = {
  title: 'Autenticação | Treinamento Unimed Cariri',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right: Brand Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-unimed-green-500 via-unimed-green-600 to-unimed-blue-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-white text-center max-w-lg">
          {/* Logo */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-white backdrop-blur-sm flex items-center justify-center shadow-2xl p-4">
            <Image
              src={logoUnimed}
              alt="Unimed Cariri"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          <h2 className="text-4xl font-bold mb-4">Bem-vindo à Unimed Cariri</h2>
          <p className="text-xl opacity-90 mb-8">
            Plataforma de treinamento para desenvolver suas habilidades e conhecimentos.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur">
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm opacity-80">Módulos</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur">
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm opacity-80">Lições</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur">
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm opacity-80">Quizzes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
