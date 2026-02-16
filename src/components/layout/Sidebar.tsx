'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModuleIcon } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { getModulos, calcularDashboardStats, calcularProgressoModulo } from '@/lib/modulos'
import {
  LayoutDashboard,
  BookOpen,
  Award,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  BookMarked,
  TrendingUp,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ isOpen, onClose, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const modulos = getModulos()
  const [isModulosExpanded, setIsModulosExpanded] = useState(true)

  // Persiste estado de expansão dos módulos
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-modulos-expanded')
    if (saved !== null) {
      setIsModulosExpanded(saved === 'true')
    }
  }, [])

  const toggleModulosExpanded = () => {
    const newState = !isModulosExpanded
    setIsModulosExpanded(newState)
    localStorage.setItem('sidebar-modulos-expanded', String(newState))
  }

  // Calcular progresso
  const stats = user ? calcularDashboardStats(user.progress) : null

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700',
          'transform transition-all duration-300 ease-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        <div className="flex flex-col h-full">

          {/* Progress Card */}
          {user && stats && !isCollapsed && (
            <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-unimed-green-500 to-unimed-green-600 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Progresso</p>
                  <p className="text-2xl font-bold">{stats.licoesCompletas}/{stats.totalLicoes}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="opacity-90">Lições completas</span>
                  <span className="font-semibold">{stats.progressoGeral}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${stats.progressoGeral}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Collapsed Progress Mini */}
          {user && stats && isCollapsed && (
            <div className="p-2 m-2 rounded-xl bg-gradient-to-br from-unimed-green-500 to-unimed-green-600 text-white" title={`${stats.progressoGeral}% completo`}>
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center mx-auto">
                <span className="text-sm font-bold">{stats.progressoGeral}%</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={cn(
            'flex-1 py-2 space-y-1 overflow-y-auto custom-scrollbar',
            isCollapsed ? 'px-2' : 'px-3'
          )}>
            {/* Dashboard */}
            <Link
              href="/dashboard"
              onClick={onClose}
              title={isCollapsed ? 'Dashboard' : undefined}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200',
                'text-sm font-medium',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                pathname === '/dashboard'
                  ? 'bg-unimed-green-50 dark:bg-unimed-green-900/20 text-unimed-green-600 shadow-sm'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
              )}
            >
              <LayoutDashboard className={cn('w-5 h-5', pathname === '/dashboard' ? 'text-unimed-green-500' : 'text-surface-400 dark:text-surface-500')} />
              {!isCollapsed && (
                <>
                  Dashboard
                  {pathname === '/dashboard' && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-unimed-green-500" />
                  )}
                </>
              )}
            </Link>

            {/* Módulos Section Header */}
            {!isCollapsed ? (
              <button
                onClick={toggleModulosExpanded}
                className="pt-4 pb-2 px-4 flex items-center justify-between w-full group hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-lg mx-0 transition-colors"
              >
                <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  Módulos
                </p>
                <ChevronDown className={cn(
                  'w-4 h-4 text-surface-400 dark:text-surface-500 transition-transform',
                  !isModulosExpanded && '-rotate-90'
                )} />
              </button>
            ) : (
              <button
                onClick={toggleModulosExpanded}
                title={isModulosExpanded ? 'Recolher módulos' : 'Expandir módulos'}
                className="flex items-center justify-center w-full p-3 rounded-xl transition-all duration-200 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700"
              >
                <ChevronDown className={cn(
                  'w-4 h-4 text-surface-400 dark:text-surface-500 transition-transform',
                  !isModulosExpanded && '-rotate-90'
                )} />
              </button>
            )}

            {isModulosExpanded && modulos.map(modulo => {
              const isActive = pathname.includes(`/modulos/${modulo.id}`)
              const progresso = user ? calcularProgressoModulo(modulo.id, user.progress?.completedLessons ?? []) : 0
              const isCompleto = user?.progress?.completedModules?.includes(modulo.id)

              return (
                <Link
                  key={modulo.id}
                  href={`/modulos/${modulo.id}`}
                  onClick={onClose}
                  title={isCollapsed ? modulo.titulo : undefined}
                  className={cn(
                    'flex items-center rounded-xl transition-all duration-200',
                    'text-sm font-medium',
                    isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-2.5',
                    isActive
                      ? 'bg-unimed-green-50 dark:bg-unimed-green-900/20 text-unimed-green-600'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
                  )}
                >
                  <span className={cn('flex items-center justify-center', isCollapsed && isCompleto && 'relative')}>
                    <ModuleIcon name={modulo.icone} className="w-5 h-5" />
                    {isCollapsed && isCompleto && (
                      <CheckCircle2 className="w-3 h-3 text-green-500 absolute -bottom-1 -right-1" />
                    )}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate">{modulo.titulo}</span>
                      {isCompleto ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : progresso > 0 ? (
                        <span className="text-xs text-surface-400 dark:text-surface-500">{progresso}%</span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-surface-300 dark:text-surface-500" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}

            {/* Separator */}
            <div className="pt-4 pb-2">
              <hr className="border-surface-100 dark:border-surface-700" />
            </div>

            {/* Glossário */}
            <Link
              href="/glossario"
              onClick={onClose}
              title={isCollapsed ? 'Glossário' : undefined}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200',
                'text-sm font-medium',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                pathname === '/glossario'
                  ? 'bg-unimed-green-50 dark:bg-unimed-green-900/20 text-unimed-green-600 shadow-sm'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
              )}
            >
              <BookMarked className={cn('w-5 h-5', pathname === '/glossario' ? 'text-unimed-green-500' : 'text-surface-400 dark:text-surface-500')} />
              {!isCollapsed && 'Glossário'}
            </Link>

            {/* Meu Progresso */}
            <Link
              href="/progresso"
              onClick={onClose}
              title={isCollapsed ? 'Meu Progresso' : undefined}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200',
                'text-sm font-medium',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                pathname === '/progresso'
                  ? 'bg-unimed-green-50 dark:bg-unimed-green-900/20 text-unimed-green-600 shadow-sm'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
              )}
            >
              <TrendingUp className={cn('w-5 h-5', pathname === '/progresso' ? 'text-unimed-green-500' : 'text-surface-400 dark:text-surface-500')} />
              {!isCollapsed && 'Meu Progresso'}
            </Link>

            {/* Certificado */}
            <Link
              href="/certificado"
              onClick={onClose}
              title={isCollapsed ? 'Certificado' : undefined}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200',
                'text-sm font-medium',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                pathname === '/certificado'
                  ? 'bg-unimed-green-50 dark:bg-unimed-green-900/20 text-unimed-green-600 shadow-sm'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
              )}
            >
              <Award className={cn('w-5 h-5', pathname === '/certificado' ? 'text-unimed-green-500' : 'text-surface-400 dark:text-surface-500')} />
              {!isCollapsed && 'Certificado'}
            </Link>

            {/* Ajuda */}
            <Link
              href="/ajuda"
              onClick={onClose}
              title={isCollapsed ? 'Ajuda' : undefined}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200',
                'text-sm font-medium',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                pathname === '/ajuda'
                  ? 'bg-unimed-green-50 dark:bg-unimed-green-900/20 text-unimed-green-600 shadow-sm'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
              )}
            >
              <HelpCircle className={cn('w-5 h-5', pathname === '/ajuda' ? 'text-unimed-green-500' : 'text-surface-400 dark:text-surface-500')} />
              {!isCollapsed && 'Ajuda'}
            </Link>
          </nav>

          {/* Footer */}
          <div className={cn(
            'border-t border-surface-100 dark:border-surface-700',
            isCollapsed ? 'p-2' : 'p-4'
          )}>
            {!isCollapsed && (
              <div className="text-center">
                <p className="text-xs text-surface-400 dark:text-surface-500">Unimed Cariri</p>
                <p className="text-xs text-surface-400 dark:text-surface-500">Treinamento v1.0</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
