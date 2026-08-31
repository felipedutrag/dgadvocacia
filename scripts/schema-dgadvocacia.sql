-- ==============================================================================
-- SCHEMA COMPLETO DO PROJETO DG ADVOCACIA (SUPABASE)
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. TABELA: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT,
    oab TEXT,
    avatar_url TEXT,
    plan TEXT DEFAULT 'Pro Trial',
    plan_status TEXT DEFAULT 'active',
    petitions_limit INTEGER DEFAULT 30,
    petitions_used INTEGER DEFAULT 0,
    credits_reset_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
    extra_credits INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA: documents
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL DEFAULT 'Petição Sem Título',
    action_type TEXT DEFAULT 'Petição Inicial',
    facts TEXT,
    content_html TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    is_paid BOOLEAN NOT NULL DEFAULT false,
    word_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA: payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    document_id UUID,
    external_id TEXT NOT NULL,
    ggpix_transaction_id TEXT,
    amount_cents INTEGER NOT NULL DEFAULT 2900,
    status TEXT NOT NULL DEFAULT 'PENDING',
    pix_copy_paste TEXT,
    payer_name TEXT,
    payer_email TEXT,
    payer_document TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA: legal_knowledge (Base RAG)
CREATE TABLE IF NOT EXISTS public.legal_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA: processos
CREATE TABLE IF NOT EXISTS public.processos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    numero_processo TEXT NOT NULL,
    tribunal TEXT,
    partes TEXT,
    assunto TEXT,
    status TEXT,
    ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. TABELA: movimentacoes_processuais
CREATE TABLE IF NOT EXISTS public.movimentacoes_processuais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE,
    data_movimentacao TEXT NOT NULL,
    descricao TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON public.documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Processos
ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own processos" ON public.processos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own processos" ON public.processos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own processos" ON public.processos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own processos" ON public.processos FOR DELETE USING (auth.uid() = user_id);

-- Movimentações
ALTER TABLE public.movimentacoes_processuais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own movimentacoes" ON public.movimentacoes_processuais FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.processos WHERE processos.id = movimentacoes_processuais.processo_id AND processos.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own movimentacoes" ON public.movimentacoes_processuais FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.processos WHERE processos.id = movimentacoes_processuais.processo_id AND processos.user_id = auth.uid())
);
CREATE POLICY "Users can update their own movimentacoes" ON public.movimentacoes_processuais FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.processos WHERE processos.id = movimentacoes_processuais.processo_id AND processos.user_id = auth.uid())
);
CREATE POLICY "Users can delete their own movimentacoes" ON public.movimentacoes_processuais FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.processos WHERE processos.id = movimentacoes_processuais.processo_id AND processos.user_id = auth.uid())
);

-- ==============================================================================
-- 9. TRIGGERS & FUNCTIONS
-- ==============================================================================

-- Trigger para auto-criar profile ao cadastrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, oab)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Advogado'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'oab', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    oab = EXCLUDED.oab,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função de busca vetorial para a base de conhecimento (RAG)
CREATE OR REPLACE FUNCTION public.match_legal_knowledge(
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  source TEXT,
  topic TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    legal_knowledge.id,
    legal_knowledge.source,
    legal_knowledge.topic,
    legal_knowledge.content,
    (1 - (legal_knowledge.embedding <=> query_embedding))::float AS similarity
  FROM legal_knowledge
  WHERE (1 - (legal_knowledge.embedding <=> query_embedding)) > match_threshold
  ORDER BY legal_knowledge.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
