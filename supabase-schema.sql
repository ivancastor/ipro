-- ═══════════════════════════════════════════════════════════
-- iPro — Schema Supabase
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- ═══════════════════════════════════════════════════════════

-- 1. PRODUTOS (dispositivos: iPhone, MacBook, iPad, etc.)
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  imagem TEXT DEFAULT '',
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MODELOS (por produto: iPhone 13, iPhone 14, etc.)
CREATE TABLE IF NOT EXISTS modelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SERVIÇOS (por modelo: Troca de tela, Troca de bateria, etc.)
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modelo_id UUID NOT NULL REFERENCES modelos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════════════════════
-- MIGRAÇÃO OBRIGATÓRIA (execute se a tabela já existia com produto_id)
-- Se você ver o erro "Could not find the 'modelo_id' column of 'servicos' in the schema cache",
-- execute os três comandos abaixo no SQL Editor do Supabase:
-- ═══════════════════════════════════════════════════════════
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS modelo_id UUID REFERENCES modelos(id) ON DELETE CASCADE;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'servicos' AND column_name = 'produto_id'
  ) THEN
    UPDATE servicos
    SET modelo_id = (SELECT id FROM modelos WHERE modelos.produto_id = servicos.produto_id LIMIT 1)
    WHERE modelo_id IS NULL;
    ALTER TABLE servicos DROP COLUMN produto_id;
  END IF;
END;
$$;

-- 4. OPÇÕES DE SERVIÇO (por serviço: Premium, Standard, etc. com preço)
CREATE TABLE IF NOT EXISTS opcoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  descricao TEXT DEFAULT '',
  tempo_estimado TEXT DEFAULT '',
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SEMINOVOS (produtos usados à venda)
CREATE TABLE IF NOT EXISTS seminovos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'iPhone',
  descricao TEXT DEFAULT '',
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  preco_original DECIMAL(10,2) DEFAULT 0,
  imagens TEXT[] DEFAULT '{}',
  especificacoes JSONB DEFAULT '[]',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. HORÁRIOS DISPONÍVEIS (configuração semanal)
CREATE TABLE IF NOT EXISTS horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  horario TIME NOT NULL,
  ativo BOOLEAN DEFAULT true,
  UNIQUE(dia_semana, horario)
);

-- 7. DIAS BLOQUEADOS (feriados, folgas, etc.)
CREATE TABLE IF NOT EXISTS dias_bloqueados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL UNIQUE,
  motivo TEXT DEFAULT '',
  tipo TEXT DEFAULT 'bloqueado' -- 'bloqueado' = dia fechado | 'excecao' = dia com observação, ainda agendável
);
-- Se a tabela já existia, rode no SQL Editor do Supabase:
-- ALTER TABLE dias_bloqueados ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'bloqueado';

-- 7b. REGRAS SEMANAIS RECORRENTES (bloqueia/exceção por dia da semana em todos os meses)
CREATE TABLE IF NOT EXISTS regras_recorrentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana INT NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Domingo … 6=Sábado
  tipo TEXT NOT NULL DEFAULT 'bloqueado', -- 'bloqueado' | 'excecao'
  motivo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (dia_semana)
);

-- 8. AGENDAMENTOS
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_nome TEXT NOT NULL,
  modelo_nome TEXT DEFAULT '',
  servico_nome TEXT NOT NULL,
  opcao_nome TEXT DEFAULT '---',
  opcao_preco DECIMAL(10,2) DEFAULT 0,
  opcao_descricao TEXT DEFAULT '',
  data DATE NOT NULL,
  horario TIME NOT NULL,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  cep TEXT DEFAULT '',
  endereco_rua TEXT DEFAULT '',
  endereco_numero TEXT DEFAULT '',
  endereco_complemento TEXT DEFAULT '',
  endereco_bairro TEXT DEFAULT '',
  endereco_cidade TEXT DEFAULT '',
  endereco_uf TEXT DEFAULT '',
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente','aprovado','recusado')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════
-- RLS (Row Level Security) — permite leitura pública, escrita via server
-- ═══════════════════════════════════════════════════════════

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE opcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminovos ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE dias_bloqueados ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE regras_recorrentes ENABLE ROW LEVEL SECURITY;

-- Leitura pública (anon key pode ler)
CREATE POLICY "Leitura pública produtos" ON produtos FOR SELECT USING (true);
CREATE POLICY "Leitura pública modelos" ON modelos FOR SELECT USING (true);
CREATE POLICY "Leitura pública servicos" ON servicos FOR SELECT USING (true);
CREATE POLICY "Leitura pública opcoes" ON opcoes FOR SELECT USING (true);
CREATE POLICY "Leitura pública seminovos" ON seminovos FOR SELECT USING (true);
CREATE POLICY "Leitura pública horarios" ON horarios FOR SELECT USING (true);
CREATE POLICY "Leitura pública dias_bloqueados" ON dias_bloqueados FOR SELECT USING (true);
CREATE POLICY "Leitura pública regras_recorrentes" ON regras_recorrentes FOR SELECT USING (true);

-- Inserção pública para agendamentos (cliente cria)
CREATE POLICY "Inserção pública agendamentos" ON agendamentos FOR INSERT WITH CHECK (true);
-- Leitura de agendamentos só via service key (server)
CREATE POLICY "Leitura agendamentos service" ON agendamentos FOR SELECT USING (auth.role() = 'service_role');

-- Escrita total via service_role (server com service key)
CREATE POLICY "Escrita total service produtos" ON produtos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Escrita total service modelos" ON modelos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Escrita total service servicos" ON servicos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Escrita total service opcoes" ON opcoes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Escrita total service seminovos" ON seminovos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Escrita total service horarios" ON horarios FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Escrita total service dias_bloqueados" ON dias_bloqueados FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Escrita total service regras_recorrentes" ON regras_recorrentes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Escrita total service agendamentos" ON agendamentos FOR ALL USING (auth.role() = 'service_role');

-- 9. FAQ POR SERVIÇO (perguntas frequentes gerenciadas pelo admin)

-- FAQ pode ser global ou ligada a produto, modelo, servico ou opcao.
-- Todos os IDs são opcionais (nullable). Se todos forem NULL, a FAQ é considerada global.
CREATE TABLE IF NOT EXISTS service_faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
  modelo_id UUID REFERENCES modelos(id) ON DELETE CASCADE,
  servico_id UUID REFERENCES servicos(id) ON DELETE CASCADE,
  opcao_id UUID REFERENCES opcoes(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE service_faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública service_faq" ON service_faq FOR SELECT USING (true);
CREATE POLICY "Escrita total service service_faq" ON service_faq FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════
-- STORAGE BUCKETS (criar via Dashboard > Storage)
-- ═══════════════════════════════════════════════════════════
-- Bucket: "avatars" (público) — já criado no Dashboard
--   - /produtos/   → imagens dos dispositivos
--   - /seminovos/  → fotos dos seminovos

-- ═══════════════════════════════════════════════════════════
-- MIGRATION: Adicionar campos de endereço na tabela agendamentos
-- Execute este bloco se a tabela já existir sem os campos de endereço
-- ═══════════════════════════════════════════════════════════
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS cep TEXT DEFAULT '';
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS endereco_rua TEXT DEFAULT '';
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS endereco_numero TEXT DEFAULT '';
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS endereco_complemento TEXT DEFAULT '';
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS endereco_bairro TEXT DEFAULT '';
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS endereco_cidade TEXT DEFAULT '';
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS endereco_uf TEXT DEFAULT '';

-- ═══════════════════════════════════════════════════════════
-- MIGRATION: Adicionar campo ciente_aviso_peca na tabela agendamentos
-- Execute este bloco no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════════
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS ciente_aviso_peca BOOLEAN DEFAULT NULL;

-- ═══════════════════════════════════════════════════════════
-- 10. NOTEBOOK SERVIÇOS (tipos de serviço pré-definidos para Notebook em geral)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notebook_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notebook_servicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública notebook_servicos" ON notebook_servicos FOR SELECT USING (true);
CREATE POLICY "Escrita total service notebook_servicos" ON notebook_servicos FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════
-- MIGRATION: Campos para Notebook em geral na tabela agendamentos
-- Execute este bloco no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════════
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS descricao_defeito TEXT DEFAULT '';
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS tipo_solicitacao TEXT DEFAULT 'agendamento';
-- Permitir data/horario NULL para solicitações de orçamento online
ALTER TABLE agendamentos ALTER COLUMN data DROP NOT NULL;
ALTER TABLE agendamentos ALTER COLUMN horario DROP NOT NULL;

-- ═══════════════════════════════════════════════════════════
-- 11. NOTEBOOK CONFIG (nome e imagem do card Notebook em geral)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notebook_config (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nome TEXT DEFAULT 'Notebook em geral',
  imagem TEXT DEFAULT ''
);
INSERT INTO notebook_config (id) VALUES (1) ON CONFLICT DO NOTHING;

ALTER TABLE notebook_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública notebook_config" ON notebook_config FOR SELECT USING (true);
CREATE POLICY "Escrita total service notebook_config" ON notebook_config FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════
-- 12. MIGRATION: Suporte a FAQ para Notebook em geral
-- Execute este bloco no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════════
ALTER TABLE service_faq ADD COLUMN IF NOT EXISTS notebook_id INT REFERENCES notebook_config(id) ON DELETE CASCADE;
ALTER TABLE service_faq ADD COLUMN IF NOT EXISTS nb_servico_id UUID REFERENCES notebook_servicos(id) ON DELETE CASCADE;
