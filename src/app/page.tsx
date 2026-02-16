'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center">
        {/* Logo animado */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-unimed-green-500 to-unimed-green-600 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">U</span>
          </div>
        </div>
        
        {/* Spinner */}
        <div className="w-8 h-8 border-4 border-unimed-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-surface-600 font-medium">Carregando...</p>
      </div>
    </div>
  )
}
