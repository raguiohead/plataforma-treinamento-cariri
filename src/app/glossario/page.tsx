'use client'

import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout'
import { Card, Button, Badge, ModuleIcon } from '@/components/ui'
import { getGlossario, filtrarGlossario } from '@/lib/quizzes'
import { getModuloById } from '@/lib/modulos'
import { 
  Search, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

export default function GlossarioPage() {
  const [busca, setBusca] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const termos = useMemo(() => filtrarGlossario(busca), [busca])

  // Normaliza letra removendo acentos (ex: Á -> A, É -> E)
  const normalizarLetra = (char: string): string => {
    return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
  }

  // Agrupa termos por letra inicial (sem acentos)
  const termosAgrupados = useMemo(() => {
    const grupos: Record<string, typeof termos> = {}
    
    termos.forEach(termo => {
      const primeiraLetra = (termo.sigla || termo.termo)[0]
      const letra = normalizarLetra(primeiraLetra)
      if (!grupos[letra]) {
        grupos[letra] = []
      }
      grupos[letra].push(termo)
    })

    // Ordena por letra
    return Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b))
  }, [termos])

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const expandAll = () => {
    setExpandedIds(new Set(termos.map(t => t.id)))
  }

  const collapseAll = () => {
    setExpandedIds(new Set())
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
              Glossário
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Termos e siglas utilizados no treinamento
            </p>
          </div>

          <Badge variant="default" size="lg">
            {termos.length} termos
          </Badge>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" />
            <input
              type="text"
              placeholder="Buscar termo, sigla ou definição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600
                       bg-white dark:bg-surface-800
                       focus:outline-none focus:ring-2 focus:ring-unimed-green-500 focus:border-transparent
                       text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <Button variant="ghost" size="sm" onClick={expandAll}>
              <ChevronDown className="w-4 h-4 mr-1" />
              Expandir Todos
            </Button>
            <Button variant="ghost" size="sm" onClick={collapseAll}>
              <ChevronUp className="w-4 h-4 mr-1" />
              Recolher Todos
            </Button>
          </div>
        </Card>

        {/* Terms List */}
        {termosAgrupados.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <Search className="w-16 h-16 text-surface-300 dark:text-surface-600" />
            </div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
              Nenhum termo encontrado
            </h2>
            <p className="text-surface-500 dark:text-surface-400">
              Tente buscar por outro termo ou sigla.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {termosAgrupados.map(([letra, termosGrupo]) => (
              <div key={letra}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-unimed-green-500 text-white flex items-center justify-center text-lg font-bold">
                    {letra}
                  </div>
                  <span className="text-sm text-surface-500 dark:text-surface-400">
                    {termosGrupo.length} {termosGrupo.length === 1 ? 'termo' : 'termos'}
                  </span>
                </div>

                <div className="space-y-3">
                  {termosGrupo.map((termo) => {
                    const isExpanded = expandedIds.has(termo.id)
                    const modulo = getModuloById(termo.moduloId)

                    return (
                      <Card key={termo.id} className="overflow-hidden">
                        <button
                          onClick={() => toggleExpand(termo.id)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-surface-500 dark:text-surface-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-surface-900 dark:text-white">
                                {termo.sigla && (
                                  <span className="text-unimed-green-600 mr-2">
                                    {termo.sigla}
                                  </span>
                                )}
                                {termo.termo}
                              </h3>
                              {!isExpanded && (
                                <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-1">
                                  {termo.definicao}
                                </p>
                              )}
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-surface-400 dark:text-surface-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-surface-400 dark:text-surface-500 flex-shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-surface-100 dark:border-surface-700">
                            <div className="pt-4 pl-13">
                              <p className="text-surface-700 dark:text-surface-300 mb-3">
                                {termo.definicao}
                              </p>

                              {termo.exemplo && (
                                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-lg mb-3">
                                  <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <strong>Exemplo:</strong> {termo.exemplo}
                                  </p>
                                </div>
                              )}

                              {modulo && (
                                <Link 
                                  href={`/modulos/${termo.moduloId}`}
                                  className="inline-flex items-center gap-2 text-sm text-unimed-green-600 hover:text-unimed-green-700 transition-colors"
                                >
                                  <ModuleIcon name={modulo.icone} className="w-4 h-4" />
                                  <span>Ver no módulo: {modulo.titulo}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick alphabet navigation */}
        {termosAgrupados.length > 0 && (
          <Card className="p-4">
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">Navegação rápida:</p>
            <div className="flex flex-wrap gap-2">
              {termosAgrupados.map(([letra]) => (
                <a
                  key={letra}
                  href={`#${letra}`}
                  className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-unimed-green-100 dark:hover:bg-unimed-green-900/30
                           hover:text-unimed-green-600 flex items-center justify-center 
                           text-sm font-medium text-surface-600 dark:text-surface-300 transition-colors"
                >
                  {letra}
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
