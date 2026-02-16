'use client'

import {
  Building2,
  ClipboardList,
  Timer,
  Hotel,
  FileText,
  BookOpen,
  Target,
  Search,
  PartyPopper,
  Hand,
  type LucideProps,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mapeamento de nomes de ícones para componentes Lucide
const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  'building-2': Building2,
  'clipboard-list': ClipboardList,
  'timer': Timer,
  'hotel': Hotel,
  'file-text': FileText,
  'book-open': BookOpen,
  'target': Target,
  'search': Search,
  'party-popper': PartyPopper,
  'hand': Hand,
}

interface ModuleIconProps extends LucideProps {
  name: string
}

export function ModuleIcon({ name, className, ...props }: ModuleIconProps) {
  const Icon = iconMap[name] || BookOpen
  return <Icon className={cn('w-5 h-5', className)} {...props} />
}
