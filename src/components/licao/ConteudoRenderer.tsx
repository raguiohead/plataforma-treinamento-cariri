'use client'

import { cn } from '@/lib/utils'
import type { ConteudoItem } from '@/types'
import { Lightbulb, AlertTriangle, BookOpen, List, FileText } from 'lucide-react'

interface ConteudoRendererProps {
  conteudo: ConteudoItem[]
}

export function ConteudoRenderer({ conteudo }: ConteudoRendererProps) {
  return (
    <div className="space-y-6">
      {conteudo.map((item, index) => (
        <ConteudoItem key={`${item.tipo}-${index}`} item={item} />
      ))}
    </div>
  )
}

function ConteudoItem({ item }: { item: ConteudoItem }) {
  switch (item.tipo) {
    case 'texto':
      return <TextoBlock conteudo={item.conteudo} />
    case 'destaque':
      return <DestaqueBlock conteudo={item.conteudo} cor={item.cor} />
    case 'importante':
      return <ImportanteBlock texto={item.texto} />
    case 'definicao':
      return <DefinicaoBlock termo={item.termo} explicacao={item.explicacao} />
    case 'lista':
      return <ListaBlock titulo={item.titulo} itens={item.itens} />
    case 'exemplo':
      return <ExemploBlock titulo={item.titulo} conteudo={item.conteudo} />
    default:
      return null
  }
}

// Bloco de texto simples
function TextoBlock({ conteudo }: { conteudo: string }) {
  return (
    <p className="text-surface-700 dark:text-surface-300 leading-relaxed text-lg">
      {conteudo}
    </p>
  )
}

// Bloco de destaque colorido
function DestaqueBlock({ conteudo, cor }: { conteudo: string; cor: 'green' | 'blue' | 'amber' }) {
  const colors = {
    green: 'bg-unimed-green-50 dark:bg-unimed-green-900/30 border-unimed-green-200 dark:border-unimed-green-700 text-unimed-green-800 dark:text-unimed-green-200',
    blue: 'bg-unimed-blue-50 dark:bg-unimed-blue-900/30 border-unimed-blue-200 dark:border-unimed-blue-700 text-unimed-blue-800 dark:text-unimed-blue-200',
    amber: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200',
  }

  const iconColors = {
    green: 'text-unimed-green-500 dark:text-unimed-green-400',
    blue: 'text-unimed-blue-500 dark:text-unimed-blue-400',
    amber: 'text-amber-500 dark:text-amber-400',
  }

  return (
    <div className={cn(
      'flex gap-4 p-5 rounded-xl border-l-4',
      colors[cor]
    )}>
      <Lightbulb className={cn('w-6 h-6 flex-shrink-0 mt-0.5', iconColors[cor])} />
      <p className="text-base leading-relaxed font-medium">
        {conteudo}
      </p>
    </div>
  )
}

// Bloco de alerta importante
function ImportanteBlock({ texto }: { texto: string }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
      <AlertTriangle className="w-6 h-6 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
          Importante
        </p>
        <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
          {texto}
        </p>
      </div>
    </div>
  )
}

// Bloco de definição
function DefinicaoBlock({ termo, explicacao }: { termo: string; explicacao: string }) {
  return (
    <div className="p-5 rounded-xl bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-unimed-blue-500 dark:text-unimed-blue-400" />
        <h4 className="font-bold text-surface-900 dark:text-white">{termo}</h4>
      </div>
      <p className="text-surface-600 dark:text-surface-300 leading-relaxed pl-7">
        {explicacao}
      </p>
    </div>
  )
}

// Bloco de lista
function ListaBlock({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div className="p-5 rounded-xl bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
      <div className="flex items-center gap-2 mb-3">
        <List className="w-5 h-5 text-unimed-green-500 dark:text-unimed-green-400" />
        <h4 className="font-bold text-surface-900 dark:text-white">{titulo}</h4>
      </div>
      <ul className="space-y-2 pl-7">
        {itens.map((item, index) => (
          <li key={`list-item-${index}-${item.slice(0, 20)}`} className="flex items-start gap-3 text-surface-700 dark:text-surface-300">
            <span className="w-2 h-2 rounded-full bg-unimed-green-400 mt-2 flex-shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Bloco de exemplo
function ExemploBlock({ titulo, conteudo }: { titulo: string; conteudo: string }) {
  return (
    <div className="p-5 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-purple-500 dark:text-purple-400" />
        <p className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
          {titulo}
        </p>
      </div>
      <p className="text-purple-800 dark:text-purple-200 leading-relaxed pl-7">
        {conteudo}
      </p>
    </div>
  )
}
