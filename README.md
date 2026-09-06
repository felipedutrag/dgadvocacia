# ⚖️ DG Advocacia — B2B Legal Infrastructure & Intellectual Property Ecosystem

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Supabase_PostgreSQL_17-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase PostgreSQL 17" />
  <img src="https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini AI" />
  <img src="https://img.shields.io/badge/OAB_Ethical_Compliance-OAB%2FSP_459.254-gold?style=for-the-badge" alt="OAB Compliance" />
</p>

---

## 📌 Executive Overview

**DG Advocacia** (headed by **Dr. Felipe Dutra Gonçalves — OAB/SP nº 459.254**) is an enterprise legaltech platform and institutional B2B infrastructure designed for branding agencies, accounting firms, and business consultancies registering and protecting trademarks before the **INPI (Instituto Nacional da Propriedade Industrial)**.

While partner agencies focus on visual identity, client relations, and market positioning, DG Advocacia provides the **mission-critical legal backend**: prior art feasibility assessments, official gazette (RPI) telemetry, technical opposition filings, administrative appeals, judicial brand defense, and active OAB-compliant risk engineering.

The ecosystem blends modern web engineering (Next.js 16, React 19, Supabase Postgres 17) with specialized legal intelligence, including **"Dra. Sofia"** (an autonomous legal AI specialized in Brazilian Industrial Property Law — Lei nº 9.279/96) and a real-time partner collaboration cockpit.

---

## 🏛️ Ecosystem Architecture & B2B Flow

```mermaid
graph TD
    subgraph "Agency & Client Ingestion"
        A[Partner Agency / Account Manager] -->|Submit Brand & Class| B[INPI Feasibility Check Engine]
        A -->|Brand Creation Stage| C[Strategic Naming AI]
    end

    subgraph "Core Intelligence & Legal Automation"
        B --> D[Collision & Phonetic Analysis (Art. 124 LPI)]
        C --> D
        D --> E[Dra. Sofia - Active Legal AI Agent]
        E -->|Tool Calling: Search DB, Rules & Statutes| F[Technical Legal Feasibility Report]
    end

    subgraph "Operational Legal Dashboard & Vault"
        F --> G[Partner Dashboard Cockpit]
        G --> H[Process Telemetry & Realtime Alerts]
        G --> I[Petition & Contract Generator (TipTap + DOCX)]
        G --> J[Obsidian B2B Knowledge Vault]
    end

    subgraph "Cloud & Data Tier"
        G --> K[(Supabase PostgreSQL 17 + RLS)]
        E --> L[Google Gemini API]
        G --> M[Resend & Telegram Webhook Alerts]
    end
```

---

## ✨ Core Pillars & Architectural Highlights

### 1. 🤖 "Dra. Sofia" — Autonomous Legal AI
- **Specialized Statutory Prompts:** Built upon deep legal grounding in the Brazilian **LPI (Lei nº 9.279/1996)**, INPI trademark guidelines, and landmark jurisprudence from the Superior Court of Justice (STJ).
- **Gemini Tool Calling Integration:** Capable of dynamically retrieving procedural milestones, verifying Nice Class compatibility, and formatting structured legal memorandums.
- **Risk Classification Matrix:** Evaluates registrability according to absolute and relative bars (Art. 124, incisos VI, XIX, XXIII).

### 2. 💡 Strategic Naming AI Engine
- Generates distinctive, protectable trademarks designed to withstand registrability scrutiny at INPI.
- Prevents clients from investing in purely descriptive or evocative terminology that faces routine rejection under Art. 124, VI.
- Evaluates phonetic similarity, graphical variance, and cross-class coexistence feasibility.

### 3. 📊 Partner Management Cockpit (`/dashboard`)
- **Real-Time Client & Process Tracking:** Multi-tenant pipeline tracking filings, publication of applications, opposition windows, and granting certificates.
- **Multi-Class Management:** Tracks Nice classifications (NCL 1–45) across products and services with collision detection.
- **Automated Communication Gateways:** Dispatches status updates to partner agencies and clients via Resend (Transactional Email) and Telegram bot webhooks.

### 4. 📝 Legal Drafting & Petition Engine
- Integrated **TipTap v3** rich-text editor customized for legal briefs and extrajudicial notices.
- Direct export into clean, formatted Microsoft Word documents (`.docx`) and high-fidelity print layouts via `@tiptap` and `docx` generation engines.
- Legal template injection for oppositions (*manifestação a oposição*), resource appeals (*recurso administrativo*), and cease-and-desist notifications.

### 5. 📚 Integrated Obsidian Legal & Business Vault (`/vault`)
Contains the firm's structured B2B playbooks, scalable partnership frameworks, and doctrinal references:
- Reverse-partnership playbooks for marketing agencies and consultancies.
- Ethical OAB compliance guidelines (Código de Ética e Disciplina da OAB).
- Structured STF and STJ case law repositories covering intellectual property, commercial law, and constitutional guarantees.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Purpose |
|---|---|---|
| **Full-Stack Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Dynamic routing, Server Actions, and API endpoints |
| **Frontend Runtime** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) | Concurrent UI rendering with strict type contracts |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Sass](https://sass-lang.com/) | High-performance CSS engine with custom legal theme |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) | Unstyled accessible primitives and vector icons |
| **Database & Auth** | [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`) | PostgreSQL 17 with Row Level Security (RLS) policies |
| **Artificial Intelligence** | [Google Gemini](https://ai.google.dev/) (`@google/generative-ai`), Groq, OpenAI | Multi-model reasoning and legal conversational assistant |
| **Document Processing** | TipTap v3, `docx`, `html-to-docx` | WYSIWYG legal editing and Microsoft Word compilation |
| **Communication** | [Resend](https://resend.com/), Telegram Bot API | Transactional notifications and telemetry webhooks |

---

## 📂 Project Structure

```
dgadvocacia/
├── src/
│   ├── app/
│   │   ├── api/                 # REST & Webhook endpoints
│   │   │   ├── auth/            # Authentication & session handlers
│   │   │   ├── inpi/            # INPI trademark check endpoints
│   │   │   ├── marcas/          # Brand lifecycle management
│   │   │   ├── payment/         # Retainer & fee checkout endpoints
│   │   │   └── webhooks/        # Telegram & third-party integrations
│   │   ├── dashboard/           # Partner and attorney operations hub
│   │   │   ├── compliance/      # OAB & statutory compliance tracker
│   │   │   ├── consultas/       # Active advisory & consultation requests
│   │   │   ├── consultoria/     # Strategic legal consulting pipelines
│   │   │   ├── inovacao/        # Experimental legal tools & modules
│   │   │   ├── marcas/          # Trademark application tracker & status
│   │   │   └── naming/          # AI distinctive name generation tool
│   │   ├── login/ & register/   # Secure partner onboarding
│   │   ├── layout.tsx           # Global shell with corporate navigation
│   │   └── page.tsx             # Institutional B2B landing page
│   ├── components/              # Reusable UI widgets and dialogs
│   ├── lib/
│   │   ├── supabase/            # Client, server, and admin Supabase instances
│   │   ├── email.ts             # Resend email dispatch service
│   │   ├── telegram.ts          # Telegram telemetry and alert client
│   │   ├── tiptap-utils.ts      # TipTap AST-to-document utilities
│   │   └── peticao-template.ts  # Standardized legal petition blueprints
│   ├── utils/
│   │   └── docx.ts              # Native Microsoft Word document builder
│   └── styles/                  # SCSS theme tokens and CSS animations
├── vault/                       # Obsidian B2B legal strategy vault & STF digests
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Supabase PostgreSQL instance
- Google Gemini API Key
- (Optional) Resend API Key & Telegram Bot Token

### Setup Instructions

```bash
# 1. Clone repository
git clone https://github.com/felipedutrag/dgadvocacia.git
cd dgadvocacia

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
cp .env.example .env.local
```

Sample `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
RESEND_API_KEY=your-resend-key
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### Run Locally

```bash
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 🛡️ Professional & Ethical Standards

All operations, lead processing, and technological tools in this repository comply strictly with the **Estatuto da Advocacia e da OAB (Lei nº 8.906/1994)** and the **Código de Ética e Disciplina da OAB**, operating as a strictly technical, non-mercantile legal backend.

---

## 👤 Author & Legal Counsel

**Dr. Felipe Dutra Gonçalves**  
Advogado — OAB/SP nº 459.254  
- **Website:** [dgadvocacia.online](https://dgadvocacia.online)  
- **GitHub:** [@felipedutrag](https://github.com/felipedutrag)  
- **Email:** [felipedutra@outlook.com](mailto:felipedutra@outlook.com)
