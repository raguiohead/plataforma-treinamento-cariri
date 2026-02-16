'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore, useThemeStore } from '@/stores'
import { Menu, X, User, LogOut, Settings, ChevronDown, Sun, Moon, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  onMenuClick?: () => void
  isSidebarOpen?: boolean
  isSidebarCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Header({ onMenuClick, isSidebarOpen, isSidebarCollapsed, onToggleCollapse }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Determina se está em modo escuro
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calcular progresso
  const completedModules = user?.progress.completedModules.length ?? 0
  const totalModules = 4

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isSidebarOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            )}
          </button>

          <Link href="/dashboard" className="flex items-center gap-3">
            {/* Logo Unimed */}
            <Image
              src="/logo-unimedcariri.png"
              alt="Unimed Cariri"
              width={150}
              height={58}
              className="h-10 w-auto object-contain"
              priority
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-surface-900 dark:text-white">Unimed Cariri</h1>
              <p className="text-xs text-surface-500 dark:text-surface-400 -mt-0.5">Plataforma de Treinamento</p>
            </div>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-surface-600" />
            )}
          </button>

          {/* Profile Dropdown */}
          {user && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-unimed-blue-500 to-unimed-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white leading-tight">
                    {user.name.split(' ')[0]}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{completedModules}/{totalModules} módulos</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-surface-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-surface-800 rounded-xl shadow-elevated border border-surface-100 dark:border-surface-700 py-2 animate-fade-in">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-700">
                    <p className="font-semibold text-surface-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/perfil"
                      className="flex items-center gap-3 px-4 py-2.5 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Meu Perfil</span>
                    </Link>
                    <Link
                      href="/configuracoes"
                      className="flex items-center gap-3 px-4 py-2.5 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configurações</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-surface-100 dark:border-surface-700 pt-1">
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
