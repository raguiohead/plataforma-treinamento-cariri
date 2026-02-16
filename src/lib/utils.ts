import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Sanitização de inputs para prevenir XSS
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Múltiplos espaços → 1 espaço
    .replace(/[<>]/g, '') // Remove caracteres HTML básicos
}

export function sanitizeName(name: string): string {
  return sanitizeInput(name)
    .replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '') // Apenas letras, espaços, hífen, apóstrofo
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
