# ⚖️ DG Advocacia — Inteligência Jurídica & Registro de Marcas no INPI

<p align="center">
  <img src="public/icon.png" width="96" height="96" alt="DG Advocacia Logo" style="border-radius: 20px;" />
</p>

<p align="center">
  <strong>Plataforma jurídica de alta performance para consulta de anterioridades, diagnóstico preditivo com IA e monitoramento contínuo da RPI no INPI.</strong>
</p>

<p align="center">
  <a href="https://dgadvocacia.online"><strong>dgadvocacia.online »</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/GGPIX_API-32BCAD?style=for-the-badge&logo=pix&logoColor=white" alt="Pix Instantâneo" />
</p>

---

## 📋 Sumário Executivo

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura de Inteligência Artificial](#-arquitetura-de-inteligência-artificial-marcashield-ai)
- [Radar INPI & Monitoramento de Despachos](#-radar-inpi--monitoramento-de-despachos)
- [Stack Tecnológica](#-stack-tecnológica)
- [Rotas de API (Endpoints)](#-rotas-de-api-endpoints)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração e Instalação](#-configuração-e-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Conformidade Legal](#-conformidade-legal)

---

## 🏛️ Visão Geral

A plataforma da **DG Advocacia** une a excelência técnica em Direito da Propriedade Intelectual com tecnologia proprietária e inteligência artificial para proteger o ativo mais valioso de qualquer negócio: **a sua marca**.

Com integração direta e autenticada aos sistemas do **Instituto Nacional da Propriedade Industrial (INPI)**, o sistema permite:
1. Pesquisar anterioridades em segundos com filtros por Classificação Internacional de Nice (NCL) e Classificação de Viena (CFE);
2. Emitir diagnósticos jurídicos preditivos de viabilidade e risco fundamentados na **Lei nº 9.279/1996 (LPI)**;
3. Rastrear marcas registradas através do **Radar RPI**, identificando despachos, oposições e tentativas de registro de concorrentes em tempo real;
4. Contratar assessoria jurídica especializada e protocolar pedidos com liquidação instantânea via Pix.

---

## ✨ Funcionalidades Principais

### 🔍 1. Mecanismo de Busca & Raio-X no INPI
- **Busca por Nome & Classes Nice:** Consulta instantânea na base de marcas do INPI com extração dinâmica de processos, titulares, classes e status legal.
- **Busca por Classificação de Figuras (Viena / CFE):** Pesquisa gráfica estruturada por categoria, divisão e seção de imagens registradas.
- **Raio-X Completo do Processo (9 Dígitos / CodPedido):** Visualização detalhada do histórico de despachos, titulares, procuradores, classe de atividade e timeline oficial.
- **Proxy Autenticado de Logotipos:** Download e renderização segura de imagens e logomarcas oficiais diretamente da base do INPI contornando bloqueios de CORS e sessão.
- **Sincronização "Meus Pedidos":** Sincronização automatizada de processos favoritados na conta do INPI.

### 🤖 2. Diagnóstico Preditivo de Viabilidade (MarcaShield AI)
- **Score de Viabilidade (0 a 100):** Cálculo do índice de registrabilidade com base no Art. 124, XIX da LPI.
- **Análise Fonética, Gráfica e Ideológica:** Identificação de colidências potenciais mesmo com grafias divergentes.
- **Recomendações Estratégicas:** Parecer prévio orientando sobre a conveniência de depósito, necessidade de aditivos distintivos ou risco iminente de oposição.

### 📡 3. Radar INPI (Acompanhamento Contínuo)
- **Monitoramento da RPI:** Varredura semanal a cada publicação da Revista da Propriedade Industrial (terças-feiras).
- **Prevenção de Perda de Prazos:** Alertas antecipados para cumprimento de exigências formais, manifestação contra oposições e pagamento do decênio.
- **Gestão de Carteira:** Adição simplificada de processos pelo número de 9 dígitos com auto-preenchimento dos dados oficiais e proteção contra duplicidade (`upsert`).

### 💳 4. Gateway de Pagamentos Pix (GGPIX)
- **Checkout Dinâmico:** Geração de QR Code Pix e código Copia e Cola em tempo real com expiração configurada.
- **Webhooks & Sincronização:** Confirmação de recebimento automática e ativação imediata do serviço no Supabase.

---

## 🧠 Arquitetura de Inteligência Artificial (MarcaShield AI)

A plataforma implementa um pipeline em cascata com 3 níveis de resiliência:

```
[Requisição de Diagnóstico]
           │
           ▼
┌─────────────────────────────────────────┐
│ 1. Primário: Gemini 2.5 Flash (Google)   │  ──► Análise de alta precisão em < 1.5s
└─────────────────────────────────────────┘
           │ (Fallback em caso de falha/rate-limit)
           ▼
┌─────────────────────────────────────────┐
│ 2. Secundário: Llama 3.3-70B (Groq)     │  ──► Velocidade extrema e robustez
└─────────────────────────────────────────┘
           │ (Fallback de contingência)
           ▼
┌─────────────────────────────────────────┐
│ 3. Motor Heurístico Jurídico (LPI)      │  ──► Parecer determinístico baseado na LPI
└─────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) | Arquitetura moderna com Server & Client Components |
| **Linguagem** | TypeScript 5 | Tipagem estrita de ponta a ponta |
| **Estilização** | Tailwind CSS v4 + Shadcn UI | Design Dark Luxury com paleta institucional |
| **Banco de Dados** | Supabase (PostgreSQL) | Autenticação, RLS, gestão de perfis e marcas monitoradas |
| **Inteligência Artificial** | Google Gemini 2.5 Flash + Groq Llama 3.3 | Avaliação de viabilidade e risco marcário |
| **Integração Governamental** | INPI Service (Cheerio + Puppeteer + Session Engine) | Web crawler e parser de sessões autenticadas |
| **Pagamentos** | GGPIX API | Pagamentos instantâneos via Pix |
| **Comunicação Transacional** | Resend + Telegram Bot API | Disparo de relatórios por e-mail e alertas de despachos |

---

## 🌐 Rotas de API (Endpoints)

```
src/app/api/
├── auth/
│   ├── forgot-password/    # Solicitação de redefinição de senha
│   ├── register/           # Cadastro de novo cliente
│   └── update-password/    # Atualização segura de credenciais
├── inpi/
│   ├── check-trademark/    # Busca de marcas por Nome e Classe Nice
│   ├── figura/             # Busca por Classificação de Viena (CFE)
│   ├── image/              # Proxy autenticado de imagens/logotipos do INPI
│   ├── meus-pedidos/       # Sincronização de pedidos favoritados
│   ├── processo/           # Raio-X completo do processo (9 dígitos)
│   ├── ai-score/           # Diagnóstico preditivo de viabilidade (MarcaShield AI)
│   └── send-report/        # Envio de relatório jurídico por e-mail
├── marcas/
│   ├── route.ts            # CRUD de marcas monitoradas (GET, POST upsert, DELETE)
│   └── notificacoes/       # Consulta de alertas e despachos da RPI
├── payment/
│   ├── route.ts            # Criação de cobrança Pix via GGPIX
│   ├── status/             # Verificação de status de transação
│   ├── confirm-email/      # Confirmação pós-pagamento por e-mail
│   └── webhook/            # Callback de notificação de pagamento Pix
├── user/
│   └── profile/            # Gestão de dados do titular
└── webhooks/
    └── telegram/           # Disparo de notificações para canal oficial
```

---

## 📁 Estrutura do Projeto

```
dgadvocacia/
├── public/                     # Favicons oficiais e ativos estáticos
├── src/
│   ├── app/
│   │   ├── (auth)/             # Telas de login, registro e redefinição de senha
│   │   ├── dashboard/          # Painel do cliente (Consultas, Radar, Planos, Perfil)
│   │   │   ├── consultas/      # Módulo de busca e diagnóstico IA
│   │   │   └── marcas/         # Módulo do Radar INPI
│   │   ├── politica-de-privacidade/ # Termos em conformidade com a LGPD
│   │   ├── termos-de-uso/      # Condições gerais de contratação e LPI
│   │   ├── layout.tsx          # Layout raiz, SEO, metadados e Google Analytics
│   │   └── page.tsx            # Landing Page institucional e educativa
│   ├── components/
│   │   ├── brand-logo.tsx      # Identidade visual oficial DG Advocacia
│   │   └── ui/                 # Componentes de interface (Radix / Base-UI)
│   └── lib/
│       ├── email.ts            # Templates transacionais e cliente Resend
│       ├── inpi-service.ts     # Core de integração e parsing com o INPI
│       ├── supabase/           # Clientes Supabase (Client, Server, Admin)
│       └── telegram.ts         # Integração com Telegram Bot
└── scripts/                    # Scripts de migração SQL e utilitários
```

---

## 🚀 Configuração e Instalação

### Pré-requisitos
- **Node.js 20+**
- **npm**, **pnpm** ou **yarn**
- Projeto configurado no **Supabase**

### 1. Clonar o repositório
```bash
git clone https://github.com/felipedutrag/dgadvocacia.git
cd dgadvocacia
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie o arquivo `.env` na raiz do projeto com as credenciais necessárias:

```env
# URL da Aplicação
NEXT_PUBLIC_APP_URL=https://dgadvocacia.online

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Credenciais de Consulta INPI
INPI_USER=seu_usuario_inpi
INPI_PASS=sua_senha_inpi

# Inteligência Artificial
GEMINI_API_KEY=sua-gemini-api-key
GROQ_API_KEY=sua-groq-api-key

# Pagamentos (GGPIX)
GGPIX_API_KEY=sua-chave-ggpix
GGPIX_WEBHOOK_SECRET=seu-segredo-webhook

# E-mail (Resend)
RESEND_API_KEY=sua-chave-resend
```

### 4. Executar em modo de desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`.

### 5. Build de produção
```bash
npm run build
npm run start
```

---

## ⚖️ Conformidade Legal

- **Lei de Propriedade Industrial:** Desenvolvido em estrita consonância com a **Lei nº 9.279/1996 (LPI)** e resoluções do INPI.
- **Privacidade e Proteção de Dados:** Conformidade integral com a **Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)**, garantindo sigilo absoluto e criptografia SSL/TLS de 256 bits sobre todos os dados processuais e cadastrais.

---

<p align="center">
  <strong>DG Advocacia — Excelência Jurídica & Tecnologia em Propriedade Intelectual</strong><br/>
  © 2026 DG Advocacia. Todos os direitos reservados.
</p>