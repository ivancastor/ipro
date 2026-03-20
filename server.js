require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.ADMIN_PASSWORD || "Adm63@F";

// ── Resend (email de termos) ─────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_bLjps7NU_4vVZ44XjbAZGn1wSbYQWrmDP";
const RESEND_FROM = process.env.RESEND_FROM || "iPro Assistência <termos@duegroup.axolutions.com.br>";
const resend = new Resend(RESEND_API_KEY);

// ── Supabase ─────────────────────────────────────────────
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("[Supabase] ERRO: Variáveis SUPABASE_URL e SUPABASE_SERVICE_KEY não definidas.");
}
const supabase = createClient(
  process.env.SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_KEY || "placeholder"
);

// ── Evolution API (WhatsApp automático) ──────────────────
const EVOLUTION_URL      = process.env.EVOLUTION_API_URL  || "https://evolution.cosmosomsoc.lat";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "sv distribuidora";
const EVOLUTION_APIKEY   = process.env.EVOLUTION_APIKEY   || "D3CAE83B749A-4871-AD6A-52D92D228C46";

// ── Asaas Payment ─────────────────────────────────────────
const ASAAS_API_KEY      = process.env.ASAAS_API_KEY || "";
const ASAAS_ENV          = process.env.ASAAS_ENV || "sandbox";
const ASAAS_WEBHOOK_TOK  = process.env.ASAAS_WEBHOOK_TOKEN || "";
const ASAAS_BASE         = ASAAS_ENV === "production"
  ? "https://api.asaas.com/v3"
  : "https://sandbox.asaas.com/api/v3";

async function asaasRequest(method, endpoint, body) {
  const url = `${ASAAS_BASE}${endpoint}`;
  if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY não configurada no servidor");
  const opts = {
    method,
    headers: { "Content-Type": "application/json", "access_token": ASAAS_API_KEY.replace(/^"|"$/g, "") }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const rawText = await res.text();
  let json = {};
  try { json = JSON.parse(rawText); } catch { json = {}; }
  if (!res.ok) {
    const msg = (json.errors && json.errors[0]?.description)
      || json.error || json.message
      || `Asaas HTTP ${res.status}: ${rawText.slice(0, 200)}`;
    console.error(`[Asaas] ${method} ${url} → ${res.status}:`, rawText.slice(0, 500));
    throw new Error(msg);
  }
  return json;
}

async function asaasGetOrCreateCustomer(nome, cpf, email, phone) {
  const cpfClean = (cpf || "").replace(/\D/g, "");
  // Try to find existing customer by CPF
  if (cpfClean) {
    const search = await asaasRequest("GET", `/customers?cpfCnpj=${cpfClean}&limit=1`);
    if (search.data && search.data.length > 0) return search.data[0];
  }
  const customerBody = { name: nome || "Cliente", notificationDisabled: false };
  if (cpfClean) customerBody.cpfCnpj = cpfClean;
  if (email) customerBody.email = email;
  const phoneClean = (phone || "").replace(/\D/g, "").replace(/^55/, "");
  if (phoneClean) customerBody.mobilePhone = phoneClean;
  return asaasRequest("POST", "/customers", customerBody);
}

function normalizePhone(phone) {
  // Remove tudo que não seja dígito
  let digits = phone.replace(/\D/g, "");
  // Se já começa com 55 (código Brasil) e tem 12-13 dígitos, usa como está
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  // Caso contrário, adiciona 55
  return "55" + digits;
}

async function sendWhatsApp(phone, text) {
  const number = normalizePhone(phone);
  const url = `${EVOLUTION_URL}/message/sendText/${encodeURIComponent(EVOLUTION_INSTANCE)}`;
  const payload = { number, text };
  console.log("[Evolution] ▶ Enviando mensagem");
  console.log("[Evolution]   URL:", url);
  console.log("[Evolution]   Para:", number);
  console.log("[Evolution]   Mensagem:", text.substring(0, 80) + (text.length > 80 ? "..." : ""));
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": EVOLUTION_APIKEY },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    if (!res.ok) {
      console.error("[Evolution] ✗ Falha HTTP", res.status, body);
      return { ok: false, status: res.status, body };
    }
    console.log("[Evolution] ✓ Enviado com sucesso", res.status, body.substring(0, 200));
    return { ok: true, status: res.status, body };
  } catch (e) {
    console.error("[Evolution] ✗ Erro de conexão:", e.message);
    return { ok: false, status: 0, body: e.message };
  }
}

// ── Middleware ────────────────────────────────────────────
app.use(cors());

// ── Static files with aggressive caching for images ──────
const path = require("path");
app.use(express.static(__dirname, {
  maxAge: '0',
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(png|jpg|jpeg|webp|avif|svg|gif|ico)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// ── Helper: build terms acceptance email HTML ────────────
function buildTermosEmailHtml(info) {
  const preco = info.preco ? `R$ ${Number(info.preco).toFixed(2).replace('.', ',')}` : '—';
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#1a1a1a;padding:28px 32px;text-align:center">
      <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0">iPro Assistência Técnica Apple</h1>
      <p style="color:rgba(255,255,255,.6);font-size:12px;margin:8px 0 0">Aceite Digital de Termos e Condições</p>
    </div>
    <div style="padding:32px">
      <div style="background:#e8f5e9;border:2px solid #4caf50;border-radius:14px;padding:20px;margin-bottom:24px;text-align:center">
        <p style="font-size:24px;margin:0 0 8px">✅</p>
        <p style="font-size:16px;font-weight:700;color:#2e7d32;margin:0 0 4px">Termos Aceitos Digitalmente</p>
        <p style="font-size:12px;color:#558b2f;margin:0">Este documento confirma o aceite dos Termos e Condições</p>
      </div>

      <h2 style="font-size:14px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px;border-bottom:1px solid #eee;padding-bottom:8px">Dados do Signatário</h2>
      <table style="width:100%;font-size:14px;margin-bottom:24px" cellpadding="6">
        <tr><td style="color:#888;width:40%">Nome completo</td><td style="font-weight:600;color:#1a1a1a">${info.nome || '—'}</td></tr>
        <tr><td style="color:#888">CPF</td><td style="font-weight:600;color:#1a1a1a">${info.cpf || '—'}</td></tr>
        <tr><td style="color:#888">E-mail</td><td style="font-weight:600;color:#1a1a1a">${info.email || '—'}</td></tr>
        <tr><td style="color:#888">Data e hora do aceite</td><td style="font-weight:600;color:#1a1a1a">${info.dataAceite || '—'}</td></tr>
      </table>

      <h2 style="font-size:14px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px;border-bottom:1px solid #eee;padding-bottom:8px">Serviço Agendado</h2>
      <table style="width:100%;font-size:14px;margin-bottom:24px" cellpadding="6">
        <tr><td style="color:#888;width:40%">Dispositivo</td><td style="font-weight:600;color:#1a1a1a">${info.produto || '—'}</td></tr>
        <tr><td style="color:#888">Modelo</td><td style="font-weight:600;color:#1a1a1a">${info.modelo || '—'}</td></tr>
        <tr><td style="color:#888">Serviço</td><td style="font-weight:600;color:#1a1a1a">${info.servico || '—'}</td></tr>
        ${info.opcao && info.opcao !== '---' ? `<tr><td style="color:#888">Opção</td><td style="font-weight:600;color:#1a1a1a">${info.opcao}</td></tr>` : ''}
        ${info.preco ? `<tr><td style="color:#888">Valor estimado</td><td style="font-weight:700;color:#1a6cff">${preco}</td></tr>` : ''}
      </table>

      <h2 style="font-size:14px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px;border-bottom:1px solid #eee;padding-bottom:8px">Termos Aceitos</h2>
      <div style="margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #f5f5f5"><span style="color:#4caf50;font-weight:700">✓</span><span style="font-size:13px;color:#1a1a1a">Termos de garantia</span></div>
        <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #f5f5f5"><span style="color:#4caf50;font-weight:700">✓</span><span style="font-size:13px;color:#1a1a1a">Termos de peças</span></div>
        <div style="display:flex;align-items:center;gap:8px;padding:10px 0"><span style="color:#4caf50;font-weight:700">✓</span><span style="font-size:13px;color:#1a1a1a">Termos de agendamento e pagamento</span></div>
      </div>

      <div style="background:#f5f5f7;border-radius:14px;padding:20px;margin-bottom:24px;text-align:center">
        <p style="font-size:13px;color:#555;margin:0 0 12px">Para consultar os Termos e Condições completos, acesse:</p>
        <a href="https://ipro-kappa.vercel.app/termos.html" style="display:inline-block;background:#1a6cff;color:#fff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px">📄 Ver Termos e Condições</a>
      </div>

      <p style="font-size:11px;color:#aaa;text-align:center;margin:0">Dúvidas? Entre em contato via WhatsApp (19) 99406-3782.</p>
    </div>
    <div style="background:#f5f5f7;padding:20px 32px;text-align:center;border-top:1px solid #eee">
      <p style="font-size:12px;color:#888;margin:0"><strong style="color:#555">iPro Assistência Técnica Apple</strong></p>
      <p style="font-size:11px;color:#aaa;margin:4px 0 0">CNPJ: 32.819.954/0001-17 · Rua Jorge Krug, 69 – Vila Itapura – Campinas/SP</p>
    </div>
  </div>
  <p style="font-size:10px;color:#bbb;text-align:center;margin:16px 0 0">Este é um e-mail automático. Por favor, não responda.</p>
</div>
</body></html>`;
}

// ── Helper: build WhatsApp message for agendamento ───────
function buildAgendamentoMsg(agend) {
  const SEP = '━━━━━━━━━━━━━━━━━━';
  const modeloStr = agend.modelo_nome || '—';
  const isOrcamento = agend.tipo_solicitacao === 'orcamento';
  const isNotebook = agend.produto_nome && agend.produto_nome.toLowerCase().includes('notebook');

  if (isNotebook && isOrcamento) {
    return (
      `SOLICITAÇÃO DE ORÇAMENTO ONLINE\n\n` +
      `Olá ${agend.nome}, recebemos sua solicitação de orçamento.\n\n` +
      `${SEP}\n\n` +
      `🔹 DADOS DO CLIENTE\n\n` +
      `👤 Nome: ${agend.nome}\n` +
      `📞 WhatsApp: ${agend.whatsapp}\n` +
      `\n${SEP}\n\n` +
      `🔹 INFORMAÇÕES DO NOTEBOOK\n\n` +
      `💻 Dispositivo: ${agend.produto_nome}\n` +
      `📦 Modelo: ${modeloStr}\n` +
      `🔧 Serviço: ${agend.servico_nome}\n` +
      (agend.descricao_defeito ? `📝 Descrição do defeito: ${agend.descricao_defeito}\n` : '') +
      `\n${SEP}\n\n` +
      `📊 STATUS DO PEDIDO:\n\n` +
      `⏳ Orçamento recebido. Aguarde a confirmação.`
    );
  } else if (isNotebook) {
    const dataFormatted = agend.data ? new Date(agend.data + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
    const horaFormatted = agend.horario ? agend.horario.slice(0, 5) : '—';
    return (
      `PEDIDO DE AGENDAMENTO DE ATENDIMENTO\n\n` +
      `Olá ${agend.nome}, recebemos sua solicitação.\n` +
      `Confira os dados abaixo:\n\n` +
      `${SEP}\n\n` +
      `🔹 DADOS DO CLIENTE\n\n` +
      `👤 Nome: ${agend.nome}\n` +
      `📞 WhatsApp: ${agend.whatsapp}\n` +
      `\n${SEP}\n\n` +
      `🔹 INFORMAÇÕES DO NOTEBOOK\n\n` +
      `💻 Dispositivo: ${agend.produto_nome}\n` +
      `📦 Modelo: ${modeloStr}\n` +
      `🔧 Serviço: ${agend.servico_nome}\n` +
      (agend.descricao_defeito ? `📝 Descrição do defeito: ${agend.descricao_defeito}\n` : '') +
      `\n${SEP}\n\n` +
      `🔹 AGENDAMENTO\n\n` +
      `📅 Data solicitada: ${dataFormatted}\n` +
      `⏰ Horário: ${horaFormatted}\n\n` +
      `${SEP}\n\n` +
      `📊 STATUS DO PEDIDO:\n\n` +
      `⏳ Agendamento recebido. Aguarde a confirmação.`
    );
  } else {
    const dataFormatted = agend.data ? new Date(agend.data + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
    const horaFormatted = agend.horario ? agend.horario.slice(0, 5) : '—';
    return (
      `PEDIDO DE AGENDAMENTO DE ATENDIMENTO\n\n` +
      `Olá ${agend.nome}, recebemos sua solicitação.\n` +
      `Confira os dados abaixo:\n\n` +
      `${SEP}\n\n` +
      `🔹 DADOS DO CLIENTE\n\n` +
      `👤 Nome: ${agend.nome}\n` +
      `🪪 CPF: ${agend.cpf}\n` +
      `📧 Email: ${agend.email}\n` +
      `📞 WhatsApp: ${agend.whatsapp}\n` +
      `\n${SEP}\n\n` +
      `🔹 INFORMAÇÕES DO DISPOSITIVO\n\n` +
      `📱 Dispositivo: ${agend.produto_nome}\n` +
      `📦 Modelo: ${modeloStr}\n` +
      `🔧 Serviço solicitado: ${agend.servico_nome}${agend.opcao_nome && agend.opcao_nome !== '---' ? ' - ' + agend.opcao_nome : ''}\n` +
      `${SEP}\n\n` +
      `🔹 AGENDAMENTO\n\n` +
      `📅 Data solicitada: ${dataFormatted}\n` +
      `⏰ Horário: ${horaFormatted}\n` +
      `⚡ Prioridade: Rápido\n\n` +
      `${SEP}\n\n` +
      `📊 STATUS DO PEDIDO:\n\n` +
      `⏳ Agendamento recebido. Aguarde a confirmação.`
    );
  }
}
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ── Auth middleware ──────────────────────────────────────
function authAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token necessário" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === (process.env.ADMIN_PASSWORD || "Adm63@F")) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "12h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Senha incorreta" });
});

// ═══════════════════════════════════════════════════════════
// PRODUTOS (dispositivos)
// ═══════════════════════════════════════════════════════════
app.get("/api/produtos", async (req, res) => {
  const { data, error } = await supabase
    .from("produtos").select("*").order("ordem");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/produtos", authAdmin, async (req, res) => {
  const { nome, imagem, ordem, ativo } = req.body;
  const { data, error } = await supabase
    .from("produtos").insert({ nome, imagem: imagem || "", ordem: ordem || 0, ativo: ativo !== false }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/produtos/:id", authAdmin, async (req, res) => {
  const { nome, imagem, ordem, ativo } = req.body;
  const { data, error } = await supabase
    .from("produtos").update({ nome, imagem, ordem, ativo }).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/produtos/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("produtos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// MODELOS (por produto: iPhone 13, iPhone 14, etc.)
// ═══════════════════════════════════════════════════════════
app.get("/api/modelos", async (req, res) => {
  let q = supabase.from("modelos").select("*").order("ordem");
  if (req.query.produto_id) q = q.eq("produto_id", req.query.produto_id);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/modelos", authAdmin, async (req, res) => {
  const { produto_id, nome, ordem, ativo } = req.body;
  const { data, error } = await supabase
    .from("modelos").insert({ produto_id, nome, ordem: ordem || 0, ativo: ativo !== false }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/modelos/:id", authAdmin, async (req, res) => {
  const { nome, ordem, ativo } = req.body;
  const { data, error } = await supabase
    .from("modelos").update({ nome, ordem, ativo }).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/modelos/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("modelos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// SERVIÇOS (por modelo)
// ═══════════════════════════════════════════════════════════
app.get("/api/servicos", async (req, res) => {
  let q = supabase.from("servicos").select("*").order("ordem");
  if (req.query.modelo_id) q = q.eq("modelo_id", req.query.modelo_id);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/servicos", authAdmin, async (req, res) => {
  const { modelo_id, nome, ordem, ativo } = req.body;
  const { data, error } = await supabase
    .from("servicos").insert({ modelo_id, nome, ordem: ordem || 0, ativo: ativo !== false }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/servicos/:id", authAdmin, async (req, res) => {
  const { nome, ordem, ativo } = req.body;
  const { data, error } = await supabase
    .from("servicos").update({ nome, ordem, ativo }).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/servicos/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("servicos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// OPÇÕES
// ═══════════════════════════════════════════════════════════
app.get("/api/opcoes", async (req, res) => {
  let q = supabase.from("opcoes").select("*").order("ordem");
  if (req.query.servico_id) q = q.eq("servico_id", req.query.servico_id);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/opcoes", authAdmin, async (req, res) => {
  const { servico_id, nome, preco, descricao, tempo_estimado, ordem, ativo } = req.body;
  const { data, error } = await supabase
    .from("opcoes").insert({ servico_id, nome, preco: preco || 0, descricao: descricao || "", tempo_estimado: tempo_estimado || "", ordem: ordem || 0, ativo: ativo !== false }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/opcoes/:id", authAdmin, async (req, res) => {
  const { nome, preco, descricao, tempo_estimado, ordem, ativo, pagamento_parcial } = req.body;
  const updateObj = {};
  if (nome !== undefined) updateObj.nome = nome;
  if (preco !== undefined) updateObj.preco = preco;
  if (descricao !== undefined) updateObj.descricao = descricao;
  if (tempo_estimado !== undefined) updateObj.tempo_estimado = tempo_estimado;
  if (ordem !== undefined) updateObj.ordem = ordem;
  if (ativo !== undefined) updateObj.ativo = ativo;
  if (pagamento_parcial !== undefined) updateObj.pagamento_parcial = pagamento_parcial;
  const { data, error } = await supabase
    .from("opcoes").update(updateObj).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/opcoes/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("opcoes").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// SEMINOVOS
// ═══════════════════════════════════════════════════════════
app.get("/api/seminovos", async (req, res) => {
  const { data, error } = await supabase
    .from("seminovos").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/seminovos", authAdmin, async (req, res) => {
  const { titulo, categoria, descricao, preco, preco_original, imagens, especificacoes, ativo } = req.body;
  const { data, error } = await supabase
    .from("seminovos").insert({ titulo, categoria, descricao, preco, preco_original: preco_original || 0, imagens: imagens || [], especificacoes: especificacoes || [], ativo: ativo !== false }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/seminovos/:id", authAdmin, async (req, res) => {
  const { titulo, categoria, descricao, preco, preco_original, imagens, especificacoes, ativo } = req.body;
  const { data, error } = await supabase
    .from("seminovos").update({ titulo, categoria, descricao, preco, preco_original, imagens, especificacoes, ativo }).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/seminovos/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("seminovos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// UPLOAD (Supabase Storage)
// ═══════════════════════════════════════════════════════════
app.post("/api/upload", authAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nenhum arquivo" });
  const folder = req.body.folder || "geral";
  const safeName = Date.now() + "-" + req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `${folder}/${safeName}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

  if (error) return res.status(500).json({ error: error.message });

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
  res.json({ url: urlData.publicUrl, path: filePath });
});

// ═══════════════════════════════════════════════════════════
// HORÁRIOS
// ═══════════════════════════════════════════════════════════
app.get("/api/horarios", async (req, res) => {
  const { data, error } = await supabase
    .from("horarios").select("*").eq("ativo", true).order("dia_semana").order("horario");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/horarios", authAdmin, async (req, res) => {
  const { dia_semana, horario } = req.body;
  const { data, error } = await supabase
    .from("horarios").insert({ dia_semana, horario, ativo: true }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/horarios/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("horarios").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// DIAS BLOQUEADOS
// ═══════════════════════════════════════════════════════════
app.get("/api/dias-bloqueados", async (req, res) => {
  const { data, error } = await supabase
    .from("dias_bloqueados").select("*").order("data");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/dias-bloqueados", authAdmin, async (req, res) => {
  const { data: d, motivo, tipo } = req.body;
  const { data, error } = await supabase
    .from("dias_bloqueados").insert({ data: d, motivo: motivo || "", tipo: tipo || "bloqueado" }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/dias-bloqueados/:id", authAdmin, async (req, res) => {
  const { motivo, tipo } = req.body;
  const { data, error } = await supabase
    .from("dias_bloqueados").update({ motivo: motivo || "", tipo: tipo || "bloqueado" }).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/dias-bloqueados/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("dias_bloqueados").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// REGRAS SEMANAIS RECORRENTES
// ═══════════════════════════════════════════════════════════
app.get("/api/regras-recorrentes", authAdmin, async (req, res) => {
  const { data, error } = await supabase.from("regras_recorrentes").select("*").order("dia_semana");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/regras-recorrentes", authAdmin, async (req, res) => {
  const { dia_semana, tipo, motivo } = req.body;
  if (dia_semana === undefined || dia_semana === null) return res.status(400).json({ error: "dia_semana obrigatório" });
  // Upsert: remove regra existente para o mesmo dia da semana
  await supabase.from("regras_recorrentes").delete().eq("dia_semana", parseInt(dia_semana));
  const { data, error } = await supabase.from("regras_recorrentes")
    .insert({ dia_semana: parseInt(dia_semana), tipo: tipo || "bloqueado", motivo: motivo || "" }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/regras-recorrentes/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("regras_recorrentes").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// NOTEBOOK CONFIG (nome e imagem do card Notebook)
// ═══════════════════════════════════════════════════════════
app.get("/api/notebook-config", async (req, res) => {
  const { data, error } = await supabase.from("notebook_config").select("*").eq("id", 1).single();
  if (error) return res.json({ id: 1, nome: "Notebook em geral", imagem: "" });
  res.json(data);
});

app.put("/api/notebook-config", authAdmin, async (req, res) => {
  const { nome, imagem } = req.body;
  const update = {};
  if (nome !== undefined) update.nome = nome;
  if (imagem !== undefined) update.imagem = imagem;
  const { data, error } = await supabase.from("notebook_config").upsert({ id: 1, ...update }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ═════════════════════════════════════════════════════════
// NOTEBOOK SERVIÇOS (tipos de serviço para Notebook em geral)
// ═══════════════════════════════════════════════════════════
app.get("/api/notebook-servicos", async (req, res) => {
  const { data, error } = await supabase.from("notebook_servicos").select("*").order("ordem");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/notebook-servicos", authAdmin, async (req, res) => {
  const { nome, ordem, ativo, preco, descricao, tempo_estimado } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });
  const insert = { nome, ordem: ordem || 0 };
  if (ativo !== undefined) insert.ativo = ativo;
  if (preco !== undefined) insert.preco = parseFloat(preco) || 0;
  if (descricao !== undefined) insert.descricao = descricao;
  if (tempo_estimado !== undefined) insert.tempo_estimado = tempo_estimado;
  const { data, error } = await supabase.from("notebook_servicos").insert(insert).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/notebook-servicos/:id", authAdmin, async (req, res) => {
  const { nome, ordem, ativo, preco, descricao, tempo_estimado } = req.body;
  const update = {};
  if (nome !== undefined) update.nome = nome;
  if (ordem !== undefined) update.ordem = ordem;
  if (ativo !== undefined) update.ativo = ativo;
  if (preco !== undefined) update.preco = parseFloat(preco) || 0;
  if (descricao !== undefined) update.descricao = descricao;
  if (tempo_estimado !== undefined) update.tempo_estimado = tempo_estimado;
  const { data, error } = await supabase.from("notebook_servicos").update(update).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/notebook-servicos/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("notebook_servicos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// AGENDAMENTOS
// ═══════════════════════════════════════════════════════════
app.get("/api/agendamentos", authAdmin, async (req, res) => {
  let q = supabase.from("agendamentos").select("*").order("created_at", { ascending: false });
  if (req.query.status) q = q.eq("status", req.query.status);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Cliente cria agendamento (público)
app.post("/api/agendamentos", async (req, res) => {
  const { produto_nome, modelo_nome, servico_nome, opcao_nome, opcao_preco, opcao_descricao, data: dt, horario, nome, cpf, email, whatsapp, cep, endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_uf, ciente_aviso_peca, descricao_defeito, tipo_solicitacao, aceite_termos_digital, termos_nome, termos_cpf } = req.body;

  // Capture client IP server-side (works behind Vercel/proxy)
  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '';
  console.log('[IP Capture] x-forwarded-for:', req.headers['x-forwarded-for'], '| resolved:', clientIp);

  const isOrcamento = tipo_solicitacao === 'orcamento';
  const isNotebookBooking = !!(produto_nome && produto_nome.toLowerCase().includes('notebook'));

  if (!produto_nome || !servico_nome || !nome || !whatsapp) {
    return res.status(400).json({ error: "Campos obrigatórios: produto, serviço, nome e WhatsApp" });
  }
  // Agendamento normal (Apple device) requer data/horário e dados completos
  if (!isOrcamento && !isNotebookBooking && (!dt || !horario || !cpf || !email)) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios para agendamento" });
  }
  // Notebook agendamento requer apenas data/horário
  if (!isOrcamento && isNotebookBooking && (!dt || !horario)) {
    return res.status(400).json({ error: "Data e horário são obrigatórios para agendamento" });
  }

  // Verificar se o horário já foi reservado (apenas para agendamento com data)
  if (!isOrcamento && dt && horario) {
    const { data: clash } = await supabase
      .from("agendamentos")
      .select("id")
      .eq("data", dt)
      .eq("horario", horario)
      .in("status", ["pendente", "aprovado"])
      .limit(1);
    if (clash && clash.length > 0) {
      return res.status(409).json({ error: "slot_taken", message: "Este horário acabou de ser reservado por outro cliente. Por favor, escolha outro horário." });
    }
  }

  const insertObj = {
    produto_nome, modelo_nome: modelo_nome || "", servico_nome, opcao_nome: opcao_nome || "---",
    opcao_preco: opcao_preco || 0, opcao_descricao: opcao_descricao || "",
    data: dt || null, horario: horario || null, nome, cpf: cpf || "", email: email || "", whatsapp,
    ciente_aviso_peca: ciente_aviso_peca !== undefined ? ciente_aviso_peca : null,
    descricao_defeito: descricao_defeito || "",
    tipo_solicitacao: tipo_solicitacao || "agendamento",
    ip: clientIp,
    status: "pendente",
    aceite_termos_digital: aceite_termos_digital || false,
    termos_nome: termos_nome || "",
    termos_cpf: termos_cpf || ""
  };
  // Address fields (only include if provided — columns may not exist yet)
  if (cep || endereco_rua || endereco_cidade) {
    Object.assign(insertObj, {
      cep: cep || "", endereco_rua: endereco_rua || "", endereco_numero: endereco_numero || "",
      endereco_complemento: endereco_complemento || "", endereco_bairro: endereco_bairro || "",
      endereco_cidade: endereco_cidade || "", endereco_uf: endereco_uf || ""
    });
  }

  let { data, error } = await supabase.from("agendamentos").insert(insertObj).select().single();
  // If address columns don't exist yet, retry without them
  if (error && error.message && error.message.includes("column")) {
    const { cep: _c, endereco_rua: _r, endereco_numero: _n, endereco_complemento: _co, endereco_bairro: _b, endereco_cidade: _ci, endereco_uf: _u, ciente_aviso_peca: _cap, descricao_defeito: _dd, tipo_solicitacao: _ts, ip: _ip, aceite_termos_digital: _atd, termos_nome: _tn, termos_cpf: _tc, ...baseObj } = insertObj;
    const retry = await supabase.from("agendamentos").insert(baseObj).select().single();
    data = retry.data; error = retry.error;
  }
  if (error) return res.status(500).json({ error: error.message });

  // Send WhatsApp confirmation to client and return whatsappLink for frontend fallback
  const msg = buildAgendamentoMsg(data);
  const wResult = await sendWhatsApp(data.whatsapp, msg);
  const whatsappSent = wResult.ok;
  const whatsappLink = `https://api.whatsapp.com/send?phone=${normalizePhone(data.whatsapp)}&text=${encodeURIComponent(msg)}`;

  // Send terms acceptance email via Resend (if accepted digitally and has email)
  let emailTermosSent = false;
  if (aceite_termos_digital && email) {
    try {
      const dataFormatada = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const htmlEmail = buildTermosEmailHtml({
        nome: termos_nome || nome,
        cpf: termos_cpf || cpf,
        email,
        ip: clientIp,
        dataAceite: dataFormatada,
        produto: produto_nome,
        modelo: modelo_nome,
        servico: servico_nome,
        opcao: opcao_nome,
        preco: opcao_preco
      });
      const emailResult = await resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        subject: 'Aceite Digital dos Termos e Condições — iPro Assistência',
        html: htmlEmail
      });
      emailTermosSent = !!(emailResult && emailResult.data && emailResult.data.id);
      console.log('[Resend] ✓ Email de termos enviado:', emailResult?.data?.id || 'sem id');
    } catch (emailErr) {
      console.error('[Resend] ✗ Erro ao enviar email de termos:', emailErr.message);
    }
  }

  res.json({ ...data, whatsappLink, whatsappSent, emailTermosSent });
});

// Admin aprova
app.put("/api/agendamentos/:id/aprovar", authAdmin, async (req, res) => {
  const { data: agend, error: fetchErr } = await supabase
    .from("agendamentos").update({ status: "aprovado" }).eq("id", req.params.id).select().single();
  if (fetchErr) return res.status(500).json({ error: fetchErr.message });

  // Build approval message (reuse helper, swap status line)
  let msg = buildAgendamentoMsg(agend)
    .replace('⏳ Orçamento recebido. Aguarde a confirmação.', '✅ Orçamento aprovado. Entraremos em contato com os detalhes.')
    .replace('⏳ Agendamento recebido. Aguarde a confirmação.', '✅ Agendamento aprovado com sucesso!');

  const wResult = await sendWhatsApp(agend.whatsapp, msg);
  const whatsappSent = wResult.ok;

  // Fallback link caso o envio automático falhe
  const whatsappLink = `https://api.whatsapp.com/send?phone=${normalizePhone(agend.whatsapp)}&text=${encodeURIComponent(msg)}`;

  res.json({ ...agend, whatsappLink, whatsappSent, _evolutionStatus: wResult.status, _evolutionBody: wResult.body });
});

// Admin recusa
app.put("/api/agendamentos/:id/recusar", authAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("agendamentos").update({ status: "recusado" }).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin remarca (não cria novo, apenas muda data/horário mantendo o mesmo registro)
app.put("/api/agendamentos/:id/remarcar", authAdmin, async (req, res) => {
  const { nova_data, novo_horario, mensagem: extraMsg } = req.body;
  if (!nova_data || !novo_horario) {
    return res.status(400).json({ error: "Campos obrigatórios: nova_data, novo_horario" });
  }

  // Buscar dados do agendamento antes de atualizar (para mensagem WhatsApp)
  const { data: agendOld } = await supabase
    .from("agendamentos").select("*").eq("id", req.params.id).single();

  // Verificar conflito com outros agendamentos (pendentes ou aprovados),
  // ignorando o próprio agendamento que está sendo remarcado.
  const { data: clash, error: clashErr } = await supabase
    .from("agendamentos")
    .select("id")
    .eq("data", nova_data)
    .eq("horario", novo_horario)
    .in("status", ["pendente", "aprovado"])
    .neq("id", req.params.id)
    .limit(1);

  if (clashErr) return res.status(500).json({ error: clashErr.message });
  if (clash && clash.length > 0) {
    return res.status(409).json({ error: "slot_taken", message: "Este horário já está reservado para outro cliente." });
  }

  const { data, error } = await supabase
    .from("agendamentos")
    .update({ data: nova_data, horario: novo_horario, status: "pendente" })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Enviar WhatsApp automático via Evolution API
  let whatsappSent = false;
  if (agendOld) {
    const SEP_R = '━━━━━━━━━━━━━━━━━━';
    const remodelStr = agendOld.modelo_nome || '—';
    const newDate = new Date(nova_data + 'T12:00:00').toLocaleDateString('pt-BR');
    const newHora = novo_horario.slice(0, 5);
    const rePrioridade = agendOld.opcao_nome && agendOld.opcao_nome !== '---' ? agendOld.opcao_nome : '—';
    const reDescricao = agendOld.opcao_descricao || agendOld.opcao_nome || agendOld.servico_nome;
    const msg =
      `PEDIDO DE AGENDAMENTO DE ATENDIMENTO\n\n` +
      `Olá ${agendOld.nome}, recebemos sua solicitação.\n` +
      `Confira os dados abaixo:\n\n` +
      `${SEP_R}\n\n` +
      `🔹 DADOS DO CLIENTE\n\n` +
      `👤 Nome: ${agendOld.nome}\n` +
      `🪪 CPF: ${agendOld.cpf}\n` +
      `📧 Email: ${agendOld.email}\n` +
      `📞 WhatsApp: ${agendOld.whatsapp}\n\n` +
      `${SEP_R}\n\n` +
      `🔹 INFORMAÇÕES DO DISPOSITIVO\n\n` +
      `📱 Dispositivo: ${agendOld.produto_nome}\n` +
      `📦 Modelo: ${remodelStr}\n` +
      `🔧 Serviço solicitado: ${agendOld.servico_nome}${agendOld.opcao_nome && agendOld.opcao_nome !== '---' ? ' - ' + agendOld.opcao_nome : ''}\n` +
      `${SEP_R}\n\n` +
      `🔹 AGENDAMENTO\n\n` +
      `📅 Data solicitada: ${newDate}\n` +
      `⏰ Horário: ${newHora}\n` +
      `⚡ Prioridade: ${`Rápido`}\n\n` +
      `${SEP_R}\n\n` +
      `📊 STATUS DO PEDIDO:\n\n` +
      `⚠️ Alteração de data e horário solicitada.` +
      (extraMsg ? `\n\n📝 Mensagem da iPro:\n${extraMsg}` : '');
    const wResult = await sendWhatsApp(agendOld.whatsapp, msg);
    whatsappSent = wResult.ok;

    // Fallback link
    const whatsappLink = `https://api.whatsapp.com/send?phone=${normalizePhone(agendOld.whatsapp)}&text=${encodeURIComponent(msg)}`;
    return res.json({ ...data, whatsappSent, whatsappLink, _evolutionStatus: wResult.status, _evolutionBody: wResult.body });
  }

  res.json(data);
});

app.delete("/api/agendamentos/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("agendamentos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ═══════════════════════════════════════════════════════════
// TESTE EVOLUTION API (admin)
// ═══════════════════════════════════════════════════════════
app.post("/api/whatsapp-test", authAdmin, async (req, res) => {
  const { phone, text } = req.body;
  if (!phone || !text) return res.status(400).json({ error: "phone e text são obrigatórios" });
  const number = normalizePhone(phone);
  const url = `${EVOLUTION_URL}/message/sendText/${encodeURIComponent(EVOLUTION_INSTANCE)}`;
  console.log("[Evolution/Test] ▶ Teste manual");
  console.log("[Evolution/Test]   URL:", url);
  console.log("[Evolution/Test]   Instance:", EVOLUTION_INSTANCE);
  console.log("[Evolution/Test]   ApiKey prefix:", EVOLUTION_APIKEY.substring(0, 8) + "...");
  console.log("[Evolution/Test]   Para:", number);
  console.log("[Evolution/Test]   Texto:", text);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": EVOLUTION_APIKEY },
      body: JSON.stringify({ number, text }),
    });
    const body = await r.text();
    console.log("[Evolution/Test] Resposta HTTP", r.status, body);
    res.json({ httpStatus: r.status, ok: r.ok, url, number, instance: EVOLUTION_INSTANCE, body: (() => { try { return JSON.parse(body); } catch { return body; } })() });
  } catch (e) {
    console.error("[Evolution/Test] Erro:", e.message);
    res.status(500).json({ error: e.message, url, number, instance: EVOLUTION_INSTANCE });
  }
});

// ═══════════════════════════════════════════════════════════
// HORÁRIOS DISPONÍVEIS PARA UM DIA (público — booking form)
// ═══════════════════════════════════════════════════════════
app.get("/api/horarios-disponiveis", async (req, res) => {
  const { data: dateStr } = req.query;
  if (!dateStr) return res.status(400).json({ error: "Param data obrigatório" });

  const dt = new Date(dateStr + "T12:00:00");
  const diaSemana = dt.getDay();

  // Verificar se é dia bloqueado (data específica tem prioridade sobre regra recorrente)
  const { data: bloqueados } = await supabase
    .from("dias_bloqueados").select("*").eq("data", dateStr);
  if (bloqueados && bloqueados.length) {
    // Entrada específica: respeita tipo
    if (!bloqueados[0].tipo || bloqueados[0].tipo === "bloqueado") {
      return res.json({ bloqueado: true, motivo: bloqueados[0].motivo, horarios: [] });
    }
    // tipo='excecao': continua e mostra horários normalmente
  } else {
    // Sem entrada específica: checar regra recorrente por dia da semana
    const { data: regrasResult } = await supabase
      .from("regras_recorrentes").select("tipo, motivo").eq("dia_semana", diaSemana).limit(1);
    if (regrasResult && regrasResult.length && regrasResult[0].tipo === "bloqueado") {
      return res.json({ bloqueado: true, motivo: regrasResult[0].motivo, horarios: [] });
    }
  }

  // Pegar horários configurados para esse dia da semana
  const { data: horariosConfig } = await supabase
    .from("horarios").select("horario").eq("dia_semana", diaSemana).eq("ativo", true).order("horario");

  // Pegar agendamentos já feitos nesse dia (aprovados + pendentes)
  const { data: agends } = await supabase
    .from("agendamentos").select("horario").eq("data", dateStr).in("status", ["pendente", "aprovado"]);

  const ocupados = new Set((agends || []).map(a => a.horario));
  const horarios = (horariosConfig || []).map(h => ({
    horario: h.horario,
    ocupado: ocupados.has(h.horario)
  }));

  res.json({ bloqueado: false, horarios });
});

// ═══════════════════════════════════════════════════════════
// DISPONIBILIDADE POR MÊS (público — calendário do cliente)
// GET /api/disponibilidade?ano=2026&mes=3
// ═══════════════════════════════════════════════════════════
app.get("/api/disponibilidade", async (req, res) => {
  const ano = parseInt(req.query.ano) || new Date().getFullYear();
  const mes = parseInt(req.query.mes) || (new Date().getMonth() + 1);

  const pad = (n) => String(n).padStart(2, "0");
  const startDate = `${ano}-${pad(mes)}-01`;
  const daysInMonth = new Date(ano, mes, 0).getDate();
  const endDate = `${ano}-${pad(mes)}-${pad(daysInMonth)}`;

  try {
  const [bloqRes, horRes, agendRes, regrasRes] = await Promise.all([
    supabase.from("dias_bloqueados").select("*").gte("data", startDate).lte("data", endDate),
    supabase.from("horarios").select("dia_semana, horario").eq("ativo", true),
    supabase.from("agendamentos").select("data, horario").gte("data", startDate).lte("data", endDate).in("status", ["pendente", "aprovado"]),
    supabase.from("regras_recorrentes").select("dia_semana, tipo, motivo")
  ]);

  // Mapa de restrições específicas por data
  const restricaoMap = {};
  (bloqRes.data || []).forEach(b => { restricaoMap[b.data] = b; });
  // Mapa de regras recorrentes por dia da semana
  const regrasMap = {};
  (regrasRes.data || []).forEach(r => { regrasMap[r.dia_semana] = r; });

  // slots configurados por dia da semana: { 0: Set{"08:00","09:00",...}, ... }
  const slotsByWeekday = {};
  (horRes.data || []).forEach(h => {
    if (!slotsByWeekday[h.dia_semana]) slotsByWeekday[h.dia_semana] = new Set();
    slotsByWeekday[h.dia_semana].add(h.horario);
  });

  // slots já reservados por data: { "2026-03-10": Set{"08:00",...}, ... }
  const bookedByDate = {};
  (agendRes.data || []).forEach(a => {
    if (!bookedByDate[a.data]) bookedByDate[a.data] = new Set();
    bookedByDate[a.data].add(a.horario);
  });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const result = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${ano}-${pad(mes)}-${pad(d)}`;
    const dt = new Date(dateStr + "T12:00:00");
    const dayOfWeek = dt.getDay();
    const daySlots = slotsByWeekday[dayOfWeek];
    const booked = bookedByDate[dateStr];
    const isFuture = dt >= today;
    const hasSlots = !!(daySlots && daySlots.size > 0);
    const isLotado = hasSlots && booked && booked.size >= daySlots.size;
    // Restrição efetiva: data específica tem prioridade sobre regra recorrente
    const specificRestriction = restricaoMap[dateStr];
    const recurringRule = regrasMap[dt.getDay()];
    const effectiveRestriction = specificRestriction || recurringRule;
    const effectiveTipo = effectiveRestriction ? (effectiveRestriction.tipo || "bloqueado") : null;
    const effectiveMotivo = effectiveRestriction ? (effectiveRestriction.motivo || "") : null;
    const isAdminBlocked = effectiveTipo === "bloqueado";
    result.push({
      data: dateStr,
      disponivel: isFuture && !isAdminBlocked && hasSlots && !isLotado,
      tipo: effectiveTipo,
      motivo: effectiveMotivo,
      lotado: !!(isFuture && !isAdminBlocked && hasSlots && isLotado)
    });
  }
  res.json(result);
  } catch (e) {
    // Fallback: retorna disponibilidade simples sem restrições (ex: tabelas ainda não criadas)
    console.error("[disponibilidade] erro:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ═══════════════════════════════════════════════════════════
// FAQ POR SERVIÇO
// ═══════════════════════════════════════════════════════════
app.get("/api/faq", async (req, res) => {
  try {
    let q = supabase.from("service_faq").select("*").eq("ativo", true).order("ordem").order("created_at");
    if (req.query.produto_id) q = q.eq("produto_id", req.query.produto_id);
    if (req.query.modelo_id) q = q.eq("modelo_id", req.query.modelo_id);
    if (req.query.servico_id) q = q.eq("servico_id", req.query.servico_id);
    if (req.query.opcao_id) q = q.eq("opcao_id", req.query.opcao_id);
    if (req.query.notebook_id) q = q.eq("notebook_id", parseInt(req.query.notebook_id));
    if (req.query.nb_servico_id) q = q.eq("nb_servico_id", req.query.nb_servico_id);
    const { data, error } = await q;
    if (error) return res.json([]);
    res.json(data || []);
  } catch { res.json([]); }
});

app.post("/api/faq", authAdmin, async (req, res) => {
  const { produto_id, modelo_id, servico_id, opcao_id, notebook_id, nb_servico_id, pergunta, resposta, ordem } = req.body;
  if (!pergunta || !resposta) return res.status(400).json({ error: "Campos obrigatórios: pergunta, resposta" });
  const { data, error } = await supabase.from("service_faq")
    .insert({ produto_id, modelo_id, servico_id, opcao_id, notebook_id, nb_servico_id, pergunta, resposta, ordem: ordem || 0, ativo: true }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/faq/:id", authAdmin, async (req, res) => {
  const { pergunta, resposta, ordem, ativo } = req.body;
  const { data, error } = await supabase.from("service_faq")
    .update({ pergunta, resposta, ordem, ativo }).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/faq/:id", authAdmin, async (req, res) => {
  const { error } = await supabase.from("service_faq").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ─────────────────────────────────────────────────────────
// ASAAS PAYMENT
// ─────────────────────────────────────────────────────────

// Cria cobrança PIX — chamado pelo frontend antes de criar o agendamento
app.post("/api/asaas/criar-cobranca", async (req, res) => {
  try {
    const { booking_data, preco_total } = req.body;
    if (!booking_data || !preco_total || parseFloat(preco_total) <= 0) {
      return res.status(400).json({ error: "booking_data e preco_total são obrigatórios" });
    }

    const precoNum    = parseFloat(preco_total);
    const valorEntrada = Math.max(parseFloat((precoNum * 0.20).toFixed(2)), 1.0);
    const nome  = booking_data.nome  || "Cliente";
    const cpf   = booking_data.cpf   || "";
    const email = booking_data.email || "";
    const phone = booking_data.whatsapp || "";

    const customer = await asaasGetOrCreateCustomer(nome, cpf, email, phone);

    // Vencimento: hoje (Asaas exige data, cobranças PIX são pagas imediatamente)
    const hoje = new Date();
    const dueDate = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,"0")}-${String(hoje.getDate()).padStart(2,"0")}`;

    const payment = await asaasRequest("POST", "/payments", {
      customer: customer.id,
      billingType: "PIX",
      value: valorEntrada,
      dueDate,
      description: `iPro — Entrada 20%: ${booking_data.servico_nome || ""} (${booking_data.produto_nome || ""})`,
      externalReference: `ipro_${Date.now()}`,
    });

    // Buscar QR code PIX
    const pixData = await asaasRequest("GET", `/payments/${payment.id}/pixQrCode`);

    // Guardar booking pendente no Supabase
    const { error: dbErr } = await supabase.from("pagamentos_pendentes").insert({
      asaas_payment_id: payment.id,
      asaas_customer_id: customer.id,
      booking_data,
      valor_total: precoNum,
      valor_entrada: valorEntrada,
      status: "aguardando_pagamento",
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    });
    if (dbErr) console.error("[Asaas] Erro ao salvar pagamento pendente:", dbErr.message);

    console.log(`[Asaas] ✓ Cobrança criada: ${payment.id} | R$ ${valorEntrada} | ${nome}`);
    res.json({
      payment_id: payment.id,
      pix_code: pixData.payload,
      pix_qrcode_image: pixData.encodedImage,   // base64 PNG
      invoice_url: payment.invoiceUrl || null,   // link de pagamento para enviar ao cliente
      valor_entrada: valorEntrada,
      valor_total: precoNum,
    });
  } catch (e) {
    console.error("[Asaas] Erro criar-cobranca:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Polling de status — frontend verifica a cada 3s
app.get("/api/asaas/status/:payment_id", async (req, res) => {
  try {
    const { data: pending } = await supabase
      .from("pagamentos_pendentes")
      .select("status, agendamento_id")
      .eq("asaas_payment_id", req.params.payment_id)
      .single();

    if (pending) return res.json({ status: pending.status, agendamento_id: pending.agendamento_id });

    // Fallback: consultar diretamente na Asaas
    const payment = await asaasRequest("GET", `/payments/${req.params.payment_id}`);
    res.json({ status: payment.status, asaas_status: payment.status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Webhook Asaas — recebe eventos de pagamento
app.post("/api/asaas/webhook", async (req, res) => {
  try {
    const token = req.headers["asaas-access-token"] || req.headers["access_token"] || "";
    if (ASAAS_WEBHOOK_TOK && token !== ASAAS_WEBHOOK_TOK) {
      console.warn("[Asaas/Webhook] Token inválido recebido:", token);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const event   = req.body.event;
    const payment = req.body.payment;
    console.log("[Asaas/Webhook] Evento:", event, "| ID:", payment?.id, "| Status:", payment?.status);

    if (["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"].includes(event) && payment?.id) {
      const { data: pending } = await supabase
        .from("pagamentos_pendentes")
        .select("*")
        .eq("asaas_payment_id", payment.id)
        .eq("status", "aguardando_pagamento")
        .single();

      if (!pending) {
        console.log("[Asaas/Webhook] Já processado ou não encontrado:", payment.id);
        return res.json({ ok: true });
      }

      const bk = pending.booking_data;

      const insertObj = {
        produto_nome:          bk.produto_nome,
        modelo_nome:           bk.modelo_nome     || "",
        servico_nome:          bk.servico_nome,
        opcao_nome:            bk.opcao_nome       || "---",
        opcao_preco:           bk.opcao_preco      || 0,
        opcao_descricao:       bk.opcao_descricao  || "",
        data:                  bk.data             || null,
        horario:               bk.horario          || null,
        nome:                  bk.nome,
        cpf:                   bk.cpf              || "",
        email:                 bk.email            || "",
        whatsapp:              bk.whatsapp,
        cep:                   bk.cep              || "",
        endereco_rua:          bk.endereco_rua     || "",
        endereco_numero:       bk.endereco_numero  || "",
        endereco_complemento:  bk.endereco_complemento || "",
        endereco_bairro:       bk.endereco_bairro  || "",
        endereco_cidade:       bk.endereco_cidade  || "",
        endereco_uf:           bk.endereco_uf      || "",
        ciente_aviso_peca:     bk.ciente_aviso_peca ?? null,
        descricao_defeito:     bk.descricao_defeito || "",
        tipo_solicitacao:      bk.tipo_solicitacao  || "agendamento",
        ip:                    bk.ip               || "",
        status:                "pendente",
        aceite_termos_digital: bk.aceite_termos_digital || false,
        termos_nome:           bk.termos_nome      || "",
        termos_cpf:            bk.termos_cpf       || "",
        asaas_payment_id:      payment.id,
        valor_entrada_pago:    pending.valor_entrada,
      };

      const { data: agend, error: insertErr } = await supabase
        .from("agendamentos").insert(insertObj).select().single();

      if (insertErr) {
        console.error("[Asaas/Webhook] Erro ao criar agendamento:", insertErr.message);
        // Try without Asaas-specific fields if columns don't exist yet
        delete insertObj.asaas_payment_id; delete insertObj.valor_entrada_pago;
        const retry = await supabase.from("agendamentos").insert(insertObj).select().single();
        if (retry.error) return res.status(500).json({ error: retry.error.message });
        Object.assign(insertObj, { id: retry.data.id });
      }

      const agendFinal = agend || insertObj;

      // Marcar pendente como pago
      await supabase.from("pagamentos_pendentes")
        .update({ status: "pago", agendamento_id: agendFinal.id })
        .eq("asaas_payment_id", payment.id);

      // WhatsApp para o cliente
      const msg = buildAgendamentoMsg(agendFinal);
      sendWhatsApp(agendFinal.whatsapp, msg).catch(e => console.error("[Asaas/Webhook] WA cliente:", e.message));

      // WhatsApp para a iPro (admin)
      const adminPhone = process.env.WHATSAPP_NUMERO || "5519994063782";
      const adminMsg = `🔔 *NOVO AGENDAMENTO — PAGAMENTO CONFIRMADO*\n\n${msg}`;
      sendWhatsApp(adminPhone, adminMsg).catch(() => {});

      // E-mail de termos (se aceito)
      if (bk.aceite_termos_digital && bk.email) {
        try {
          const dataFormatada = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
          const htmlEmail = buildTermosEmailHtml({
            nome: bk.termos_nome || bk.nome, cpf: bk.termos_cpf || bk.cpf,
            email: bk.email, ip: bk.ip || "", dataAceite: dataFormatada,
            produto: bk.produto_nome, modelo: bk.modelo_nome,
            servico: bk.servico_nome, opcao: bk.opcao_nome, preco: bk.opcao_preco
          });
          await resend.emails.send({
            from: RESEND_FROM, to: [bk.email],
            subject: "Agendamento Confirmado — iPro Assistência", html: htmlEmail
          });
        } catch (emailErr) { console.error("[Asaas/Webhook] Email:", emailErr.message); }
      }

      console.log("[Asaas/Webhook] ✅ Agendamento criado:", agendFinal.id);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error("[Asaas/Webhook] Erro:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────
// Fallback: serve index.html para rotas não-API (SPA/static)
// ─────────────────────────────────────────────────────────
app.get("*", (req, res, next) => {
  // Não interceptar chamadas de API
  if (req.path.startsWith("/api/")) return next();
  const filePath = path.join(__dirname, req.path === "/" ? "index.html" : req.path);
  res.sendFile(filePath, err => {
    if (err) res.sendFile(path.join(__dirname, "index.html"));
  });
});

// ─────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n  iPro Server rodando em http://localhost:${PORT}`);
    console.log(`  Admin: http://localhost:${PORT}/admin.html\n`);
  });
}

module.exports = app;
