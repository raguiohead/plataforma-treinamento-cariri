import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ErrorBoundaryWrapper } from '@/components/providers/ErrorBoundaryWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Treinamento Unimed Cariri',
  description:
    'Plataforma de treinamento para colaboradores da Unimed Cariri. Aprenda sobre planos de saúde, contratos, atendimento e muito mais.',
  keywords: ['Unimed', 'Cariri', 'Treinamento', 'Saúde', 'Plano de Saúde'],
  authors: [{ name: 'Unimed Cariri' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/logo-unimedcariri.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <ErrorBoundaryWrapper>
          <ThemeProvider>{children}</ThemeProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  )
}
