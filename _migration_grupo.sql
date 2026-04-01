-- ═══════════════════════════════════════════════════════════
-- PASSO 1: Adicionar coluna 'grupo' na tabela modelos
-- Execute SEMPRE (IF NOT EXISTS protege contra reexecução)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE modelos ADD COLUMN IF NOT EXISTS grupo TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_modelos_grupo ON modelos (produto_id, grupo);

-- ═══════════════════════════════════════════════════════════
-- PASSO 2: Popular o campo 'grupo' em TODOS os modelos
-- Usa UPDATE com CASE cobrindo todos os dispositivos Apple.
-- NÃO apaga nenhum modelo — apenas define o agrupamento.
-- ═══════════════════════════════════════════════════════════

UPDATE modelos
SET grupo = CASE

  -- ─── iPhone ────────────────────────────────────────────
  WHEN nome ILIKE 'iPhone SE%'           THEN 'iPhone SE'
  WHEN nome ILIKE 'iPhone XR%'           THEN 'iPhone XR'
  WHEN nome ILIKE 'iPhone XS%'           THEN 'iPhone XS'
  WHEN nome ILIKE 'iPhone X%'            THEN 'iPhone X'
  WHEN nome ILIKE 'iPhone 11%'           THEN 'iPhone 11'
  WHEN nome ILIKE 'iPhone 12%'           THEN 'iPhone 12'
  WHEN nome ILIKE 'iPhone 13%'           THEN 'iPhone 13'
  WHEN nome ILIKE 'iPhone 14%'           THEN 'iPhone 14'
  WHEN nome ILIKE 'iPhone 15%'           THEN 'iPhone 15'
  WHEN nome ILIKE 'iPhone 16%'           THEN 'iPhone 16'
  WHEN nome ILIKE 'iPhone 17%'           THEN 'iPhone 17'

  -- ─── iPad ──────────────────────────────────────────────
  WHEN nome ILIKE 'iPad mini%'           THEN 'iPad mini'
  WHEN nome ILIKE 'iPad Air%'            THEN 'iPad Air'
  WHEN nome ILIKE 'iPad Pro%'            THEN 'iPad Pro'
  WHEN nome ILIKE 'iPad%'               THEN 'iPad'

  -- ─── Apple Watch ───────────────────────────────────────
  WHEN nome ILIKE 'Apple Watch SE%'      THEN 'Apple Watch SE'
  WHEN nome ILIKE 'Apple Watch Ultra%'   THEN 'Apple Watch Ultra'
  WHEN nome ILIKE 'Apple Watch Series%'  THEN 'Apple Watch Series'
  WHEN nome ILIKE 'Apple Watch%'         THEN 'Apple Watch'

  -- ─── MacBook ───────────────────────────────────────────
  WHEN nome ILIKE 'MacBook Air%'         THEN 'MacBook Air'
  WHEN nome ILIKE 'MacBook Pro%'         THEN 'MacBook Pro'
  WHEN nome ILIKE 'MacBook%'             THEN 'MacBook'

  -- ─── iMac ──────────────────────────────────────────────
  WHEN nome ILIKE 'iMac Pro%'            THEN 'iMac Pro'
  WHEN nome ILIKE 'iMac%'               THEN 'iMac'

  -- ─── Mac mini / Mac Pro / Mac Studio ───────────────────
  WHEN nome ILIKE 'Mac mini%'            THEN 'Mac mini'
  WHEN nome ILIKE 'Mac Pro%'             THEN 'Mac Pro'
  WHEN nome ILIKE 'Mac Studio%'          THEN 'Mac Studio'
  WHEN nome ILIKE 'Mac%'                THEN 'Mac'

  -- ─── Qualquer outro: mantém o grupo atual ou usa o nome inteiro ──
  ELSE COALESCE(grupo, nome)

END;

-- ═══════════════════════════════════════════════════════════
-- VERIFICAÇÃO: rode depois para confirmar o resultado
-- SELECT nome, grupo FROM modelos ORDER BY grupo, nome;
-- ═══════════════════════════════════════════════════════════
