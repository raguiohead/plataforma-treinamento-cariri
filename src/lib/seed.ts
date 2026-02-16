'use client'

import { useEffect } from 'react'

// Seed de usuário demo para facilitar testes
export function useInitDemoUser() {
  useEffect(() => {
    const USERS_STORAGE_KEY = 'unimed-training-users'
    const users = localStorage.getItem(USERS_STORAGE_KEY)
    
    if (!users) {
      const demoUser = {
        'demo@unimed.com': {
          id: 'demo-user-001',
          name: 'Usuário Demo',
          email: 'demo@unimed.com',
          password: 'Demo123',
          role: 'colaborador',
          department: 'atendimento',
          createdAt: new Date().toISOString(),
          progress: {
            totalXp: 450,
            level: 5,
            completedModules: ['1'],
            badges: [
              {
                id: 'badge-1',
                name: 'Primeiro Passo',
                description: 'Completou o primeiro módulo',
                icon: 'target',
                earnedAt: new Date().toISOString(),
              }
            ],
            streak: 3,
            lastAccessAt: new Date().toISOString(),
          },
        },
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUser))
    }
  }, [])
}
