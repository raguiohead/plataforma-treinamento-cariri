# 🔑 Usuário Administrador

Para acesso irrestrito à plataforma, utilize o login de administrador:

- **E-mail:** `admin@unimedcariri.com.br`
- **Senha:** definida na variável de ambiente `ADMIN_PASSWORD`

As credenciais do admin são configuradas via variáveis de ambiente para segurança.

### Variáveis de ambiente necessárias

Crie um arquivo `.env.local` na raiz do projeto com:

```
ADMIN_EMAIL=admin@unimedcariri.com.br
ADMIN_PASSWORD=Un1m3d@C4r1r1#Adm2026!
```

No Vercel, adicione as mesmas variáveis em **Project Settings > Environment Variables**.

# Treinamento Unimed Cariri

Plataforma de treinamento para colaboradores da Unimed Cariri.

## 🚀 Tecnologias

- **Next.js 14** - App Router
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **Zod** - Validação de formulários
- **Lucide React** - Ícones
- **jsPDF** - Geração de certificados em PDF

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start
```

## 🎨 Design System

### Cores

- **Verde Unimed**: `#00A859`
- **Azul Unimed**: `#0066CC`

### Componentes

- `Button` - Botões com variantes (primary, secondary, outline, ghost, danger)
- `Card` - Cards com variantes (default, elevated, bordered, gradient)
- `Badge` - Badges para status e XP
- `ProgressBar` - Barras de progresso lineares e circulares
- `Input` - Campos de entrada com suporte a ícones e validação

## 📁 Estrutura de Pastas

```text
src/
├── app/                    # Rotas Next.js (App Router)
│   ├── auth/               # Páginas de autenticação
│   │   ├── login/
│   │   └── cadastro/
│   ├── dashboard/          # Dashboard principal
│   ├── modulos/            # Módulos e lições
│   ├── quiz/               # Sistema de quizzes
│   ├── glossario/          # Glossário de termos
│   ├── progresso/          # Timeline de progresso
│   ├── certificado/        # Certificado de conclusão
│   └── page.tsx            # Página inicial (redirect)
├── components/
│   ├── layout/             # Header, Sidebar, AppLayout
│   └── ui/                 # Componentes do Design System
├── data/                   # Dados (módulos, quizzes, glossário)
├── lib/                    # Utilitários e validações
├── stores/                 # Zustand stores
└── types/                  # TypeScript types
```


## 🔐 Autenticação

- **Usuários comuns**: cadastro e login persistem localmente no navegador (localStorage)
- **Admin**: login validado via API segura usando variáveis de ambiente

1. **Cadastro**: Crie uma conta com nome, email e senha
2. **Login**: Acesse com suas credenciais
3. **Persistência**: Sessão mantida no navegador

## 🎮 Gamificação

- **XP**: Pontos de experiência ganhos ao completar lições
- **Níveis**: Suba de nível a cada 100 XP
- **Conquistas**: Desbloqueie badges especiais
- **Streak**: Mantenha uma sequência de dias estudando

## 📚 Módulos de Treinamento

1. **Sistema Unimed** - Introdução à cooperativa
2. **Planos de Saúde** - Tipos de contratação e cobertura
3. **Contratos** - Regulamentação e normas
4. **Atendimento** - Intercâmbio e procedimentos
5. **Urgência e Emergência** - Protocolos de atendimento
6. **Benefícios e Reajustes** - FAC, FAS e reajustes

## � Sistema de Quizzes

- **40+ questões** distribuídas entre os 6 módulos
- **3 tentativas** por questão com feedback imediato
- **Explicações** detalhadas após resposta
- **Nota final** calculada automaticamente
- **Refazer** quiz a qualquer momento

## 📖 Glossário

- **30 termos** técnicos do setor de saúde
- **Busca** por termo ou sigla
- **Organização** alfabética com índice rápido
- **Exemplos** práticos de uso

## 🏆 Certificado de Conclusão

O certificado é liberado quando o colaborador:

- Completa **todas as 20 lições** dos 6 módulos
- Realiza **todos os 6 quizzes**

O certificado inclui:

- Nome completo do colaborador
- Data de conclusão
- Nota média dos quizzes
- Tempo total de estudo
- QR Code de verificação
- Download em **PDF**

## 🛠️ Scripts Disponíveis

```bash
npm run dev       # Desenvolvimento
npm run build     # Build de produção
npm run start     # Servidor de produção
npm run lint      # Linting com ESLint
npm run format    # Formatação com Prettier
```

## 🌐 Deploy

O projeto está configurado para deploy automático na **Vercel**:

```bash
npm install -g vercel
vercel --prod
```

## 📝 Licença

Projeto interno Unimed Cariri © 2026
