# Leovox Task — Orquestrador de Tarefas por Linguagem Natural

**Autor:** Leonardo Gonçalves Sobral

---

## Visão Geral

O **Leovox Task** é um gerenciador de produtividade de última geração que permite criar e organizar tarefas usando **linguagem natural**. Através de integração com **Groq AI** (LLaMA 3.3 70B), o sistema interpreta descrições em texto livre e extrai automaticamente título, descrição, data de vencimento, prioridade, categoria e tags.

### Principais Funcionalidades

- **Chat com IA**: Descreva tarefas em linguagem natural e a IA organiza tudo automaticamente
- **CRUD Completo de Tarefas**: Criar, listar, editar, deletar e alterar status
- **Dashboard Inteligente**: Visão geral com estatísticas em tempo real
- **Filtros e Busca**: Filtre por status, prioridade, categoria e busca textual
- **Lembretes Automáticos**: Notificações por e-mail antes do vencimento
- **Design System Leovox**: Interface dark com verde-limão (#00FF41), animações fluidas

---

## Arquitetura

O projeto utiliza uma arquitetura **desacoplada** com dois serviços independentes:

| Componente | Tecnologia | Porta Padrão |
|---|---|---|
| **Backend (API)** | Laravel 10 + PHP 8.2 | `localhost:8000` |
| **Frontend** | Next.js 15 + React 19 | `localhost:3000` |

### Stack Tecnológica

**Backend:**
- Laravel 10 (PHP 8.2+)
- Laravel Sanctum (autenticação via token)
- Eloquent ORM + PostgreSQL
- Groq API (LLaMA 3.3 70B Versatile)
- Cron Jobs para lembretes

**Frontend:**
- Next.js 15 + React 19 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (animações)
- Radix UI + shadcn/ui (componentes)
- lucide-react (iconografia)
- Axios (HTTP client)

---

## Estrutura de Diretórios

```
leovox-task/
├── leovox-task-backend/          # API Laravel
│   ├── app/
│   │   ├── Console/Commands/     # Comando de lembretes
│   │   ├── Http/Controllers/Api/ # AuthController, TaskController, CronController
│   │   ├── Models/               # User, Task
│   │   ├── Notifications/        # TaskReminderNotification
│   │   └── Services/             # GroqService
│   ├── config/
│   │   ├── cors.php              # CORS configurado para frontend
│   │   └── services.php          # Configuração do Groq
│   ├── database/migrations/      # Migrations (users, tasks)
│   ├── routes/api.php            # Rotas da API
│   └── .env.example              # Variáveis de ambiente
│
├── leovox-task-frontend/         # Frontend Next.js
│   ├── public/assets/            # Logos SVG da Leovox
│   ├── src/
│   │   ├── app/                  # Páginas (App Router)
│   │   │   ├── (auth)/           # Login, Register
│   │   │   ├── (authenticated)/  # Dashboard, Tasks, Chat
│   │   │   ├── globals.css       # Design System
│   │   │   └── layout.tsx        # Layout raiz
│   │   ├── components/           # Componentes React
│   │   │   ├── chat/             # ChatInterface
│   │   │   ├── layout/           # Sidebar
│   │   │   ├── tasks/            # TaskCard, TaskList, StatsCard, CreateTaskDialog
│   │   │   └── ui/               # Button, Input, Card, Badge
│   │   ├── contexts/             # AuthContext
│   │   ├── hooks/                # useDebounce
│   │   ├── lib/                  # api.ts, utils.ts
│   │   └── types/                # TypeScript interfaces
│   └── .env.example              # Variáveis de ambiente
│
└── README.md                     # Este arquivo
```

---

## Pré-requisitos

- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **pnpm** (ou npm/yarn)
- **PostgreSQL** >= 14
- **Conta Groq** (API Key gratuita em https://console.groq.com)

---

## Instalação e Configuração

### 1. Backend (Laravel)

```bash
cd leovox-task-backend

# Instalar dependências
composer install

# Copiar arquivo de ambiente
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Configurar o .env com suas credenciais:
# - DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
# - GROQ_API_KEY (obtenha em https://console.groq.com)
# - FRONTEND_URL (ex: http://localhost:3000)

# Executar migrations
php artisan migrate

# Iniciar o servidor de desenvolvimento
php artisan serve
```

O backend estará disponível em `http://localhost:8000`.

### 2. Frontend (Next.js)

```bash
cd leovox-task-frontend

# Instalar dependências
pnpm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Configurar o .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Iniciar o servidor de desenvolvimento
pnpm dev
```

O frontend estará disponível em `http://localhost:3000`.

---

## API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/register` | Registrar novo usuário |
| POST | `/api/login` | Login (retorna token) |
| POST | `/api/logout` | Logout (revoga token) |
| GET | `/api/user` | Dados do usuário autenticado |

### Tarefas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/tasks` | Listar tarefas (com filtros e paginação) |
| POST | `/api/tasks` | Criar tarefa manualmente |
| GET | `/api/tasks/{id}` | Detalhes de uma tarefa |
| PUT | `/api/tasks/{id}` | Atualizar tarefa |
| DELETE | `/api/tasks/{id}` | Deletar tarefa |
| PATCH | `/api/tasks/{id}/status` | Atualizar status |
| POST | `/api/tasks/ai/parse` | Criar tarefa via IA (linguagem natural) |

### Dashboard

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/dashboard/stats` | Estatísticas do dashboard |

### Parâmetros de Filtro (GET /api/tasks)

| Parâmetro | Valores | Descrição |
|---|---|---|
| `status` | `todo`, `in_progress`, `done` | Filtrar por status |
| `priority` | `low`, `medium`, `high`, `urgent` | Filtrar por prioridade |
| `category` | string | Filtrar por categoria |
| `search` | string | Busca por título/descrição |
| `sort_by` | `created_at`, `due_date`, `priority`, `title` | Ordenar por campo |
| `sort_dir` | `asc`, `desc` | Direção da ordenação |
| `per_page` | número | Itens por página |

---

## Variáveis de Ambiente

### Backend (.env)

```env
APP_NAME="Leovox Task"
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=leovox_task
DB_USERNAME=postgres
DB_PASSWORD=sua_senha

GROQ_API_KEY=sua_chave_groq
GROQ_MODEL=llama-3.3-70b-versatile

MAIL_MAILER=smtp
MAIL_HOST=seu_smtp_host
MAIL_PORT=587
MAIL_USERNAME=seu_email
MAIL_PASSWORD=sua_senha_email
MAIL_FROM_ADDRESS=noreply@leovox.com
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Lembretes Automáticos

Para ativar os lembretes por e-mail, configure o cron do Laravel:

```bash
# Adicionar ao crontab do servidor:
* * * * * cd /caminho/para/leovox-task-backend && php artisan schedule:run >> /dev/null 2>&1
```

O sistema verificará a cada 15 minutos se há tarefas com vencimento nas próximas 24 horas e enviará notificações por e-mail.

---

## Deploy em Produção

### Backend (Laravel)

1. Configure o servidor com PHP 8.2+, Composer, PostgreSQL
2. Clone o repositório e execute `composer install --optimize-autoloader --no-dev`
3. Configure o `.env` com as variáveis de produção
4. Execute `php artisan migrate --force`
5. Configure o cron job para `php artisan schedule:run`
6. Configure Nginx/Apache como proxy reverso

### Frontend (Next.js)

1. Configure o `.env.local` com a URL da API de produção
2. Execute `pnpm build` para gerar o build otimizado
3. Execute `pnpm start` ou use o output `standalone` para deploy
4. Pode ser hospedado na Vercel, Netlify, ou qualquer servidor Node.js

---

## Design System

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#00FF41` | Acento principal (verde-limão) |
| `--color-background` | `#0A0A0A` | Fundo principal |
| `--color-surface` | `#1A1A1A` | Cards e painéis |
| `--color-text` | `#FFFFFF` | Texto principal |
| `--color-text-secondary` | `#A1A1A1` | Texto secundário |
| `--color-danger` | `#FF4444` | Erros e urgente |
| `--color-warning` | `#FFB800` | Alertas |
| `--font-heading` | Rajdhani | Títulos |
| `--font-body` | Inter | Corpo de texto |

---

## Licença

Projeto proprietário — Leovox. Todos os direitos reservados.

**Desenvolvido por Leonardo Gonçalves Sobral** — 2026
