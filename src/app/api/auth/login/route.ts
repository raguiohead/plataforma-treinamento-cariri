import { NextRequest, NextResponse } from 'next/server'

// Credenciais do admin via variáveis de ambiente (seguro no servidor)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Verifica se é o admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        isAdmin: true,
        user: {
          id: 'admin-001',
          name: 'Administrador',
          email: ADMIN_EMAIL,
          role: 'admin',
          department: 'TI',
          createdAt: '2024-01-01T00:00:00.000Z',
          progress: {
            completedModules: ['1', '2', '3', '4', '5', '6'],
            completedLessons: [],
            completedQuizzes: [],
            tempoEstudo: 0,
            xp: 9999,
            lastAccessAt: new Date().toISOString(),
          },
        },
      })
    }

    // Não é admin - retorna para validação local
    return NextResponse.json({
      success: false,
      isAdmin: false,
      message: 'not-admin',
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno' },
      { status: 500 }
    )
  }
}
