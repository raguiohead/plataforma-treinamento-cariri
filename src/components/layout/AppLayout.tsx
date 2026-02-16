'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  // Persiste estado da sidebar colapsada no localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setIsSidebarCollapsed(saved === 'true')
    }
  }, [])

  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  // Redireciona para login se não autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname.startsWith('/auth')) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Fecha sidebar ao mudar de rota
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-unimed-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-surface-600 dark:text-surface-400">Carregando...</p>
        </div>
      </div>
    )
  }

  // Não renderiza layout se não autenticado
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content */}
      <main className={cn(
        'min-h-[calc(100vh-4rem)] p-4 lg:p-6 transition-all duration-300',
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      )}>
        <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
      </main>
    </div>
  )
}
