-- ==========================================
-- SCHEMA: MARCAS INPI E MOVIMENTAÇÕES
-- ==========================================

-- 1. Criação da tabela de Marcas
CREATE TABLE IF NOT EXISTS public.marcas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    numero_inpi VARCHAR(50) NOT NULL,
    nome_marca VARCHAR(255) NOT NULL,
    titular VARCHAR(255),
    classe_nice VARCHAR(10),
    status_ipas VARCHAR(100),
    data_deposito DATE,
    imagem_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, numero_inpi) -- Evita duplicidade da mesma marca pro mesmo usuário
);

-- Habilitar RLS na tabela de marcas
ALTER TABLE public.marcas ENABLE ROW LEVEL SECURITY;

-- Políticas para marcas
CREATE POLICY "Usuários podem ver suas próprias marcas" 
    ON public.marcas FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias marcas" 
    ON public.marcas FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias marcas" 
    ON public.marcas FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias marcas" 
    ON public.marcas FOR DELETE 
    USING (auth.uid() = user_id);

-- 2. Criação da tabela de Movimentações INPI (Despachos)
CREATE TABLE IF NOT EXISTS public.movimentacoes_inpi (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    marca_id UUID NOT NULL REFERENCES public.marcas(id) ON DELETE CASCADE,
    rpi VARCHAR(20),
    data_publicacao DATE,
    codigo_despacho VARCHAR(50),
    titulo_despacho VARCHAR(255),
    descricao_despacho TEXT,
    prazo_dias INTEGER,
    prazo_data DATE,
    notificado_telegram BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS nas movimentações
ALTER TABLE public.movimentacoes_inpi ENABLE ROW LEVEL SECURITY;

-- Políticas para movimentações (O usuário só vê movimentações das suas marcas)
CREATE POLICY "Usuários podem ver movimentações de suas marcas" 
    ON public.movimentacoes_inpi FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.marcas m WHERE m.id = marca_id AND m.user_id = auth.uid()));

-- (Inserção será feita geralmente via back-end/webhook, então usaremos a Service Role ou políticas adequadas se for cliente)
CREATE POLICY "Serviço pode inserir movimentações" 
    ON public.movimentacoes_inpi FOR INSERT 
    WITH CHECK (true); -- Ajustar em produção se a inserção for client-side, mas recomendado server-side.

-- 3. Adição da coluna de Telegram no Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_chat_id VARCHAR(100);

-- Trigger para updated_at na tabela marcas
CREATE OR REPLACE FUNCTION update_marcas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_marcas_updated_at ON public.marcas;
CREATE TRIGGER trigger_update_marcas_updated_at
BEFORE UPDATE ON public.marcas
FOR EACH ROW
EXECUTE FUNCTION update_marcas_updated_at();
