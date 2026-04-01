// ═══════════════════════════════════════════════════════════
// iPro Agendamento — Multi-step booking form modal
// Fluxo: Produto → Modelo (dropdown) → Serviço (+ FAQ) →
//        Opção/Qualidade → Data (calendário azul/vermelho)
//        → Horário → Dados → Revisão → Termos popup
// ═══════════════════════════════════════════════════════════

// ─── Evolution API Config ────────────────────────────────────
var EVO_API_URL      = 'https://evolution.cosmosomsoc.lat';  // URL do servidor Evolution
var EVO_API_KEY      = 'D3CAE83B749A-4871-AD6A-52D92D228C46'; // API Key global
var EVO_INSTANCE     = 'sv distribuidora';                    // Nome da instância
var EVO_DEST_NUMBER  = '5519996666898';                       // Número da empresa (DDI+DDD+número)
// ─────────────────────────────────────────────────────────────

(function () {
  if (window.__agendLoaded) return;

  window.__agendLoaded = true;

  // ─── Standalone agendamento.html support ─────────────────────
  window.renderStandaloneAgendamento = function() {
    // Remove modal overlay if present
    const overlay = document.getElementById('agend-overlay');
    if (overlay) overlay.remove();
    // Remove modals if present
    const faqOverlay = document.getElementById('agend-faq-overlay');
    if (faqOverlay) faqOverlay.remove();
    const termsOverlay = document.getElementById('agend-terms-overlay');
    if (termsOverlay) termsOverlay.remove();
    const guideOverlay = document.getElementById('agend-guide-overlay');
    if (guideOverlay) guideOverlay.remove();

    // Create root container
    const root = document.getElementById('agendamento-root');
    if (!root) return;
    root.innerHTML = '';

    // Main booking box (same as modal, but as a page)
    const box = document.createElement('div');
    box.id = 'agend-box';
    box.style.background = '#fff';
    box.style.borderRadius = '24px';
    box.style.width = '100%';
    box.style.maxWidth = '640px';
    box.style.margin = '0 auto';
    box.style.boxShadow = '0 8px 40px rgba(0,0,0,.10)';
    box.style.overflow = 'visible';
    box.style.maxHeight = 'none';

    // Header
    box.innerHTML = `
      <div class="agend-header">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:8px">
          <h2 id="agend-title" style="font-size:16px;font-weight:800;margin:0;color:#1a1a1a;letter-spacing:-.2px;flex:1;text-align:center">Selecione o serviço</h2>
          <button onclick="window.agendShowGuide()" style="font-size:11px;color:#1a6cff;background:#f0f4ff;border:none;cursor:pointer;font-family:Inter,sans-serif;font-weight:700;display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border-radius:20px;flex-shrink:0" onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#f0f4ff'">&#9432; Como funciona?</button>
        </div>
        <div id="agend-progress" class="agend-progress"></div>
        <div style="height:1px;background:#f0eeeb;margin-top:10px"></div>
      </div>
      <div class="agend-body">
        <!-- Step 1: Produto → Modelo → Serviço → Opção -->
        <div class="agend-step agend-active" data-step="1">
          <div id="agend-sub1-produto" style="padding-top:20px"></div>
          <div id="agend-sub1-grupo" style="display:none;padding-top:20px"></div>
          <div id="agend-sub1-modelo" style="display:none;padding-top:20px"></div>
          <div id="agend-sub1-servico" style="display:none;padding-top:20px"></div>
          <div id="agend-sub1-opcao" style="display:none;padding-top:20px"></div>
          <div id="agend-sub1-notebook" style="display:none;padding-top:20px"></div>
        </div>
        <div class="agend-step" data-step="2" style="padding-top:20px"></div>
        <div class="agend-step" data-step="3" style="padding-top:20px"></div>
        <div class="agend-step" data-step="4" style="padding-top:20px"></div>
      </div>
    `;
    root.appendChild(box);

    // Render all booking steps into the correct containers
    // Step 1: Produto
    const prodDiv = document.getElementById('agend-sub1-produto');
    if (prodDiv) {
      prodDiv.innerHTML = `
        <div class="agend-step-header">
          <h3>Qual é seu dispositivo?</h3>
        </div>
        <p style="font-size:12px;color:#bbb;margin:4px 0 18px">Toque no aparelho para continuar</p>
        <div id="agend-produtos" class="agend-prod-grid"></div>
      `;
    }
    // Step 1: Grupo (séries)
    const grupoDiv = document.getElementById('agend-sub1-grupo');
    if (grupoDiv) {
      grupoDiv.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendBack('produto')">← Voltar</button>
        <div class="agend-step-header">
          <h3 id="agend-grupo-title">Qual a série?</h3>
        </div>
        <p style="font-size:12px;color:#aaa;margin-bottom:14px">Selecione a série do dispositivo</p>
        <div id="agend-grupos-cards" style="display:flex;flex-direction:column;gap:8px"></div>
      `;
    }
    // Step 1: Modelo
    const modeloDiv = document.getElementById('agend-sub1-modelo');
    if (modeloDiv) {
      modeloDiv.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendBack('grupo')">← Voltar</button>
        <div class="agend-step-header">
          <h3 id="agend-modelo-title">Qual o modelo?</h3>
        </div>
        <p style="font-size:12px;color:#aaa;margin-bottom:14px">Selecione o modelo do seu dispositivo</p>
        <div id="agend-modelos-cards" style="display:flex;flex-direction:column;gap:8px"></div>
      `;
    }
    // Step 1: Serviço
    const servicoDiv = document.getElementById('agend-sub1-servico');
    if (servicoDiv) {
      servicoDiv.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendBack('modelo')">← Voltar</button>
        <div class="agend-step-header">
          <h3>Qual serviço deseja?</h3>
        </div>
        <p style="font-size:12px;color:#aaa;margin-bottom:14px">Selecione o serviço que você precisa</p>
        <div id="agend-servicos" style="display:flex;flex-direction:column;gap:8px"></div>
      `;
    }
    // Step 1: Opção
    const opcaoDiv = document.getElementById('agend-sub1-opcao');
    if (opcaoDiv) {
      opcaoDiv.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendBack('servico')">← Voltar</button>
        <div class="agend-step-header">
          <h3 id="agend-opcao-title">Qualidade da peça</h3>
        </div>
        <p id="agend-opcao-subtitle" style="font-size:12px;color:#aaa;margin-bottom:14px">Escolha a qualidade da peça</p>
        <div id="agend-opcoes" style="display:flex;flex-direction:column;gap:8px"></div>
      `;
    }
    // Step 1: Notebook
    const nbDiv = document.getElementById('agend-sub1-notebook');
    if (nbDiv) {
      nbDiv.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendBack('produto')">← Voltar</button>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <div style="width:40px;height:40px;border-radius:12px;background:#e8eeff;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">💻</div>
          <div>
            <h3 style="font-size:16px;font-weight:800;margin:0;color:#1a1a1a">Notebook em geral</h3>
            <p style="font-size:11px;color:#aaa;margin:0">Preencha as informações do seu notebook</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Modelo do Notebook *</label>
            <input type="text" id="agend-nb-modelo" class="agend-input" placeholder="Ex: Dell Inspiron 15, Lenovo IdeaPad 3, Acer Nitro 5...">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Tipo de serviço *</label>
            <select id="agend-nb-servico" class="agend-input"><option value="">— Selecione o tipo de serviço —</option></select>
            <button type="button" id="agend-nb-servico-faq" style="display:none;width:100%;margin-top:7px;padding:8px 14px;border-radius:10px;background:#e8f0ff;color:#1a6cff;font-size:12px;font-weight:600;border:1px solid #c7d9f7;cursor:pointer;font-family:Inter,sans-serif" onclick="window.agendShowNbServicoFaq(this)"><i class="fa-solid fa-circle-question" style="font-size:11px;margin-right:5px"></i>Saiba mais sobre este serviço</button>
            <div id="agend-nb-preco-display" style="display:none;margin-top:8px;padding:8px 12px;border-radius:8px;background:#e8f5ed;color:#1a7a42;font-size:13px;font-weight:700;border:1px solid #b2dfcb"></div>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Fale mais sobre o defeito</label>
            <textarea id="agend-nb-descricao" class="agend-input" rows="3" placeholder="Descreva o problema que está enfrentando com o notebook..." style="resize:vertical;min-height:70px"></textarea>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Nome completo *</label>
            <input type="text" id="agend-nb-nome" class="agend-input" placeholder="Seu nome completo">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">CPF</label>
              <input type="text" id="agend-nb-cpf" class="agend-input" placeholder="000.000.000-00" maxlength="14" oninput="window.agendFormatCpf(this)">
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">E-mail</label>
              <input type="email" id="agend-nb-email-direct" class="agend-input" placeholder="seu@email.com">
            </div>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Celular / WhatsApp *</label>
            <input type="tel" id="agend-nb-celular" class="agend-input" placeholder="(11) 99999-9999" maxlength="15" oninput="window.agendFormatPhone(this)">
          </div>
        </div>
        <button onclick="window.nbContinuar()" style="margin-top:18px;width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:background .2s" onmouseover="this.style.background='#0057e6'" onmouseout="this.style.background='#1a6cff'">Continuar →</button>
      `;
    }
    // Step 2: Data + Horário
    const step2 = document.querySelector('.agend-step[data-step="2"]');
    if (step2) {
      step2.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendGoStep(1)">← Voltar</button>
        <div class="agend-step-header">
          <h3>Selecione a data</h3>
        </div>
        <p style="font-size:12px;color:#aaa;margin-bottom:14px">Dias em <span style="color:#1a6cff;font-weight:600">azul</span> estão disponíveis · Dias em <span style="color:#ef4444;font-weight:600">vermelho</span> indisponíveis</p>
        <div id="agend-calendar" style="margin-bottom:20px"></div>
        <div id="agend-horarios-section" style="display:none">
          <div class="agend-step-divider"></div>
          <div class="agend-step-header" style="margin-top:16px">
            <p class="agend-section-label" style="margin:0">Horários disponíveis</p>
          </div>
          <div id="agend-horarios" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(82px,1fr));gap:8px;margin-top:10px"></div>
        </div>
      `;
    }
    // Step 3: Dados pessoais
    const step3 = document.querySelector('.agend-step[data-step="3"]');
    if (step3) {
      step3.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendStep3Back()">← Voltar</button>
        <div class="agend-step-header">
          <h3>Seus dados de contato</h3>
        </div>
        <p id="agend-step3-desc" style="font-size:12px;color:#aaa;margin-bottom:16px">Preencha para confirmarmos seu agendamento via WhatsApp</p>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Nome completo *</label>
            <input type="text" id="agend-nome" class="agend-input" placeholder="Seu nome completo" required>
          </div>
          <div id="agend-step3-wpp-row" style="display:grid;grid-template-columns:1fr;gap:10px">
            <div>
              <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">WhatsApp *</label>
              <input type="tel" id="agend-whatsapp" class="agend-input" placeholder="(19) 99999-9999" maxlength="15" oninput="window.agendFormatPhone(this)">
            </div>
          </div>
          <div id="agend-step3-nb-email" style="display:none">
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">E-mail *</label>
            <input type="email" id="agend-nb-email" class="agend-input" placeholder="seu@email.com">
          </div>
          <div id="agend-step3-extra-fields">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">CPF *</label>
                <input type="text" id="agend-cpf" class="agend-input" placeholder="000.000.000-00" maxlength="14" oninput="window.agendFormatCpf(this)">
              </div>
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">E-mail *</label>
                <input type="email" id="agend-email" class="agend-input" placeholder="seu@email.com" required>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Confirme WhatsApp *</label>
                <input type="tel" id="agend-whatsapp2" class="agend-input" placeholder="(19) 99999-9999" maxlength="15" oninput="window.agendFormatPhone(this)">
              </div>
              <div></div>
            </div>
            <div style="border-top:1px solid #f0eeeb;padding-top:12px;margin-top:4px">
              <p style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px">Endereço</p>
              <div style="display:grid;grid-template-columns:140px 1fr;gap:10px;align-items:start">
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">CEP *</label>
                  <input type="text" id="agend-cep" class="agend-input" placeholder="00000-000" maxlength="9" oninput="window.agendFormatCep(this)">
                  <p id="agend-cep-status" style="font-size:10px;margin-top:3px;min-height:14px"></p>
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Rua</label>
                  <input type="text" id="agend-rua" class="agend-input" placeholder="Preenchido automaticamente" readonly style="background:#f5f5f7;color:#888">
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 100px 1fr;gap:10px;margin-top:10px">
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Bairro</label>
                  <input type="text" id="agend-bairro" class="agend-input" placeholder="—" readonly style="background:#f5f5f7;color:#888">
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Nº *</label>
                  <input type="text" id="agend-numero" class="agend-input" placeholder="Nº">
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Complemento</label>
                  <input type="text" id="agend-complemento" class="agend-input" placeholder="Apto, bloco...">
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 80px;gap:10px;margin-top:10px">
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Cidade</label>
                  <input type="text" id="agend-cidade" class="agend-input" placeholder="—" readonly style="background:#f5f5f7;color:#888">
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">UF</label>
                  <input type="text" id="agend-uf" class="agend-input" placeholder="—" readonly style="background:#f5f5f7;color:#888" maxlength="2">
                </div>
              </div>
            </div>
          </div>
        </div>
        <button onclick="window.agendGoStep(4)" style="margin-top:18px;width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:background .2s" onmouseover="this.style.background='#0057e6'" onmouseout="this.style.background='#1a6cff'">Continuar →</button>
      `;
    }
    // Step 4: Revisão
    const step4 = document.querySelector('.agend-step[data-step="4"]');
    if (step4) {
      step4.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendStep4Back()">← Voltar</button>
        <p class="agend-section-label">Revisão de dados</p>
        <p style="font-size:13px;color:#666;margin-bottom:14px">Confira os dados do seu agendamento antes de prosseguir</p>
        <div id="agend-review" style="display:flex;flex-direction:column;gap:6px;margin-bottom:18px"></div>
        <div id="agend-submit-error" style="display:none;background:#fef2f2;color:#dc2626;font-size:13px;padding:10px 14px;border-radius:10px;margin-bottom:14px"></div>
        <button id="agend-submit-btn" onclick="window.agendShowAvisos()" style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:background .2s" onmouseover="this.style.background='#0057e6'" onmouseout="this.style.background='#1a6cff'">Prosseguir →</button>
      `;
    }

    // Create overlays for standalone mode
    window._createAgendOverlays();
    if (!document.getElementById('agend-guide-overlay')) {
      const guideOvl = document.createElement('div');
      guideOvl.id = 'agend-guide-overlay';
      guideOvl.innerHTML = `<div id="agend-guide-box"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px"><h3 style="font-size:17px;font-weight:800;margin:0;color:#1a1a1a">Como funciona o agendamento?</h3><button onclick="window.agendCloseGuide()" style="width:32px;height:32px;border-radius:50%;background:#f5f5f7;border:none;cursor:pointer;font-size:14px;color:#888">✕</button></div><p style="font-size:13px;color:#555;line-height:1.8">1. Escolha o dispositivo → 2. Selecione o serviço e qualidade → 3. Escolha data e horário → 4. Confirme seus dados → 5. Aguarde aprovação via WhatsApp.</p><div style="margin-top:14px;background:#f0f4ff;border-radius:12px;padding:12px"><p style="font-size:12px;color:#1a6cff;font-weight:700;margin:0 0 3px">📍 Localização</p><p style="font-size:12px;color:#555;margin:0">Vila Itapura, Campinas — SP · WhatsApp: (19) 99406-3782</p></div><button onclick="window.agendCloseGuide()" style="margin-top:14px;width:100%;padding:13px;border-radius:14px;background:#1a1a1a;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;">Entendido, começar!</button></div>`;
      document.body.appendChild(guideOvl);
      guideOvl.addEventListener('click', e => { if (e.target === guideOvl) window.agendCloseGuide(); });
    }
    if (!document.getElementById('agend-faq-overlay')) {
      const faqOvl = document.createElement('div');
      faqOvl.id = 'agend-faq-overlay';
      faqOvl.innerHTML = `<div id="agend-faq-box"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px"><h3 id="agend-faq-title" style="font-size:17px;font-weight:800;margin:0;color:#1a1a1a"></h3><button onclick="window.agendCloseFaq()" style="width:32px;height:32px;border-radius:50%;background:#ff3b30;border:none;cursor:pointer;font-size:14px;color:#fff">✕</button></div><div id="agend-faq-items"></div></div>`;
      document.body.appendChild(faqOvl);
      faqOvl.addEventListener('click', e => { if (e.target === faqOvl) window.agendCloseFaq(); });
    }

    // Reset all booking state for fresh start
    step = 1;
    sel = { produto: null, grupo: null, modelo: null, servico: null, opcao: null, data: null, horario: null, cienteAvisoPeca: null };
    isNotebook = false;
    notebookSel = { modelo: '', servico: '', descricao: '', tipoSolicitacao: 'agendamento' };
    currentMonth = new Date();
    calAvailability = {};
    produtos = []; modelosData = []; servicosData = []; opcoesData = []; faqServicoData = [];
    notebookServicos = [];
    // Start booking flow
    showStep(1);
    loadProdutos();

    // ─── Link de Agendamento: pular direto pra opção ───────
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const linkToken = urlParams.get('link');
      if (!linkToken) return;
      try {
        const res = await fetch('/api/link-agendamento/' + encodeURIComponent(linkToken));
        if (!res.ok) return;
        const ld = await res.json();
        // Preencher seleções
        sel.produto = { id: ld.produto_id, nome: ld.produto_nome };
        sel.modelo = ld.modelo_id ? { id: ld.modelo_id, nome: ld.modelo_nome } : null;
        sel.servico = { id: ld.servico_id, nome: ld.servico_nome };
        // Carregar modelos para navegação Voltar
        try {
          const mr = await fetch('/api/modelos?produto_id=' + ld.produto_id);
          modelosData = await mr.json();
        } catch { modelosData = []; }
        const activeModels = modelosData.filter(m => m.ativo !== false);
        if (activeModels.length > 0) renderModeloCards(activeModels);
        // Carregar serviços para o Voltar funcionar
        const modeloOrProdId = ld.modelo_id || ld.produto_id;
        await loadServicos(modeloOrProdId);
        // Avançar direto para opção (qualidade da peça)
        await selectServico(sel.servico);
      } catch (e) {
        console.error('Erro ao carregar link de agendamento:', e);
      }
    })();
  };

  // ─── State ────────────────────────────────────────────────
  let step = 1;
  let produtos = [], modelosData = [], servicosData = [], opcoesData = [], faqServicoData = [];
  let sel = { produto: null, grupo: null, modelo: null, servico: null, opcao: null, data: null, horario: null, cienteAvisoPeca: null };
  let isNotebook = false;
  let notebookServicos = [];
  let notebookSel = { modelo: '', servico: '', descricao: '', tipoSolicitacao: 'agendamento' };
  let currentMonth = new Date();
  let availableSlots = [];
  let calAvailability = {}; // dateStr → true/false

  // ─── Static FAQ per step ──────────────────────────────────
  const STATIC_FAQ = {
    produto: {
      title: 'Saiba mais sobre o agendamento',
      items: [
        { q: 'O agendamento é gratuito?', a: 'Sim! Agendamento e diagnóstico são totalmente gratuitos e sem compromisso.' },
        { q: 'Posso cancelar meu agendamento?', a: 'Sim, basta entrar em contato via WhatsApp com no mínimo 2 horas de antecedência.' },
        { q: 'Quanto tempo dura o reparo?', a: 'Dependendo do serviço, pode ser feito enquanto você aguarda ou em até 24h.' },
        { q: 'Tem estacionamento perto?', a: 'Sim, há fácil acesso e estacionamento na região da loja em Vila Itapura, Campinas.' },
        { q: 'Preciso levar nota fiscal?', a: 'Não é obrigatório. O técnico realiza o diagnóstico e informa o orçamento completo.' }
      ]
    },
    modelo: {
      title: 'Saiba mais sobre o modelo',
      items: [
        { q: 'Como descubro o modelo exato?', a: 'Acesse Ajustes → Geral → Informações. O técnico também pode identificar presencialmente.' },
        { q: 'Atendemos todos os modelos?', a: 'Sim! Trabalhamos com todos os modelos, desde os mais antigos até os mais recentes.' },
        { q: 'O preço muda por modelo?', a: 'Sim, preços e peças podem variar conforme o modelo. O orçamento é confirmado no diagnóstico.' },
        { q: 'E se eu não souber o modelo exato?', a: 'Sem problema! Coloque o modelo aproximado — o técnico identifica presencialmente.' },
        { q: 'Existe diferença entre Pro e Max?', a: 'Sim, pode haver diferença de preço e peças. Informe o modelo correto para maior precisão.' }
      ]
    },
    servico: {
      title: 'Saiba mais sobre nossos serviços',
      items: [
        { q: 'Todos os serviços têm garantia?', a: 'Sim! 1 ano de garantia em serviços realizados com peças originais/premium.' },
        { q: 'O reparo é feito na hora?', a: 'A maioria dos reparos de tela e bateria são feitos em até 1h enquanto você aguarda.' },
        { q: 'Os técnicos são capacitados?', a: 'Sim, nossa equipe é treinada e especializada exclusivamente em dispositivos Apple.' },
        { q: 'Posso acompanhar o andamento?', a: 'Sim! Enviamos fotos e vídeos do reparo pelo WhatsApp em tempo real.' },
        { q: 'Fazem reparo de placa?', a: 'Sim! Temos laboratório especializado em reparo de placa-mãe (micro-solda).' }
      ]
    },
    opcao: {
      title: 'Saiba mais sobre as qualidades de peça',
      items: [
        { q: 'Qual a diferença entre Stand, Original e Premium?', a: 'Stand é peça genérica de bom custo-benefício. Original é a peça OEM de fábrica. Premium é a melhor versão disponível no mercado.' },
        { q: 'A peça Original é da Apple?', a: 'Peças originais são componentes fabricados no padrão Apple, com qualidade certificada.' },
        { q: 'A qualidade Premium vale a pena?', a: 'Premium é a mais escolhida por oferecer a melhor experiência — cores, toque e durabilidade superiores.' },
        { q: 'A garantia é a mesma para todas?', a: 'Sim, todos os serviços têm 1 ano de garantia independente da qualidade de peça escolhida.' },
        { q: 'Posso trocar a qualidade depois?', a: 'Pode! Entre em contato antes do reparo. Após realizado, a alteração não é possível.' }
      ]
    }
  };

  // ─── Inject CSS ───────────────────────────────────────────
  const css = document.createElement('style');
  css.textContent = `
    #agend-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.65);backdrop-filter:blur(10px);opacity:0;pointer-events:none;transition:opacity .3s}
    #agend-overlay.agend-open{opacity:1;pointer-events:auto}
    #agend-box{background:#fff;border-radius:28px;width:100%;max-width:640px;max-height:82vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(0,0,0,.3);transform:scale(.95) translateY(12px);transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .3s}
    #agend-overlay.agend-open #agend-box{transform:scale(1) translateY(0)}
    .agend-header{padding:22px 24px 0;flex-shrink:0;background:#fff;z-index:2;border-radius:28px 28px 0 0}
    .agend-body{padding:0 24px 32px;overflow-y:auto;flex:1;min-height:0}
    .agend-step{display:none}.agend-step.agend-active{display:block;animation:agendFade .28s ease}
    @keyframes agendFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .agend-progress{display:block;margin-bottom:14px}
    .agend-progress-dot{width:8px;height:8px;border-radius:50%;background:#e0ddd9;transition:all .25s}
    .agend-progress-dot.active{background:#1a6cff;width:24px;border-radius:4px}
    .agend-progress-dot.done{background:#1a6cff}
    .agend-section-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#aaa;margin-bottom:14px}
    .agend-modelo-card{border:2px solid transparent;border-radius:14px;padding:11px 14px;cursor:pointer;transition:all .18s;background:#f7f7f8;display:flex;align-items:center;gap:12px}
    .agend-modelo-card:hover{border-color:#1a6cff;background:#f0f4ff}
    .agend-modelo-card.selected{border-color:#1a6cff;background:#eef3ff}
    .agend-modelos-pag-btn{background:#f0f4ff;border:none;border-radius:10px;height:30px;min-width:30px;padding:0 10px;cursor:pointer;font-size:13px;color:#1a6cff;display:inline-flex;align-items:center;justify-content:center;transition:all .15s;font-family:Inter,sans-serif;font-weight:800;gap:4px}
    .agend-modelos-pag-btn:hover{background:#1a6cff;color:#fff}
    .agend-modelos-pag-num{font-size:13px;font-weight:700;color:#555;min-width:18px;text-align:center}
    .agend-card{border:2px solid #b8ccf7;border-radius:16px;padding:14px 16px;cursor:pointer;transition:all .18s;background:#f7f7f8;display:flex;align-items:center;gap:12px}
    .agend-card:hover{border-color:#1a6cff;background:#f0f4ff}
    .agend-card.selected{border-color:#1a6cff;background:#eef3ff}
    .agend-card-icon{width:38px;height:38px;border-radius:12px;background:#e8eeff;display:flex;align-items:center;justify-content:center;font-size:16px;color:#1a6cff;flex-shrink:0}
    .agend-card-big{border:2px solid #f0eeeb;border-radius:20px;overflow:hidden;cursor:pointer;transition:all .22s;background:#fafafa;text-align:center;display:flex;flex-direction:column;gap:0;padding:0}
    .agend-card-big:hover{border-color:#1a6cff;transform:translateY(-4px);box-shadow:0 12px 32px rgba(26,108,255,.15)}
    .agend-card-big:hover .agend-card-big-img{transform:scale(1.06)}
    .agend-card-big.selected{border-color:#1a6cff;box-shadow:0 4px 20px rgba(26,108,255,.2)}
    .agend-card-big-img-wrap{width:100%;overflow:hidden;background:#f0eeeb}
    .agend-card-big-img{width:100%;height:110px;object-fit:cover;display:block;transition:transform .4s ease}
    .agend-card-big-placeholder{width:100%;height:110px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e8eeff,#f0f4ff);font-size:40px}
    .agend-card-big-label{padding:10px 8px 12px;font-size:13px;font-weight:700;color:#1a1a1a;line-height:1.2}
    .agend-prod-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    @media(max-width:480px){.agend-prod-grid{grid-template-columns:repeat(2,1fr)}}
    .agend-cal-day{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;margin:0 auto}
    .agend-cal-day.today{font-weight:800;color:#1a6cff;box-shadow:inset 0 0 0 2px #1a6cff}
    .agend-cal-day.selected{background:#1a6cff!important;color:#fff!important;font-weight:700;border-radius:12px}
    .agend-cal-day.available{background:#dbeafe;color:#1a6cff;font-weight:600}
    .agend-cal-day.available:hover:not(.selected){background:#93c5fd;color:#1e40af}
    .agend-cal-day.unavailable{background:#fee2e2;color:#dc2626;cursor:not-allowed;font-weight:600}
    .agend-cal-day.blocked{background:#fecaca;color:#b91c1c;cursor:not-allowed;font-weight:600;opacity:.85}
    .agend-cal-day.no-slots{background:#f5f5f5;color:#d1d5db;cursor:default}
    .agend-cal-day.excecao{background:#fed7aa;color:#c2410c;font-weight:700;cursor:pointer;box-shadow:inset 0 0 0 2px #fb923c}
    .agend-cal-day.excecao:hover:not(.selected){background:#fdba74;color:#9a3412}
    .agend-cal-day.excecao.unavailable{background:#fef3c7;color:#b45309;cursor:not-allowed;box-shadow:inset 0 0 0 2px #fde68a;opacity:.7}
    .agend-cal-day.past{color:#d1d5db;cursor:default}
    .agend-cal-day.empty{cursor:default}
    .agend-time-slot{padding:11px 12px;border-radius:12px;border:2px solid #ebebeb;font-size:13px;font-weight:700;cursor:pointer;transition:all .18s;text-align:center;background:#fafafa;color:#1a1a1a}
    .agend-time-slot:hover{border-color:#1a6cff;color:#1a6cff;background:#f0f4ff}
    .agend-time-slot.selected{border-color:#1a6cff;background:#1a6cff;color:#fff}
    .agend-time-slot.ocupado{background:#f5f5f5;border-color:#e8e8e8;color:#ccc;cursor:not-allowed;text-decoration:line-through;pointer-events:none}
    .agend-input{width:100%;padding:11px 14px;border-radius:12px;border:1.5px solid #e8e8ea;outline:none;font-size:14px;font-family:Inter,sans-serif;transition:border-color .2s,box-shadow .2s;background:#fafafa;color:#1a1a1a;box-sizing:border-box}
    .agend-input:focus{border-color:#1a6cff;background:#fff;box-shadow:0 0 0 3px rgba(26,108,255,.12)}
    select.agend-input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;cursor:pointer}
    .agend-back-btn{display:inline-flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;font-size:12px;color:#888;font-weight:600;margin-bottom:18px;font-family:Inter,sans-serif;padding:4px 0;transition:color .15s}
    .agend-back-btn:hover{color:#1a6cff}
    .agend-step-divider{height:1px;background:#f0eeeb;margin:20px 0}
    .agend-review-row{display:flex;justify-content:space-between;align-items:center;padding:11px 14px;border-radius:12px;font-size:13px;background:#f7f7f8}
    .agend-review-row:nth-child(even){background:#f0f0f2}
    .agend-faq-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;border:2px solid #1a6cff;color:#1a6cff;font-size:12px;font-weight:800;cursor:pointer;background:transparent;font-family:Inter,sans-serif;transition:all .2s;flex-shrink:0;line-height:1}
    .agend-faq-btn:hover{background:#1a6cff;color:#fff}
    .agend-step-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
    .agend-step-header h3{font-size:16px;font-weight:800;margin:0;color:#1a1a1a;flex:1;letter-spacing:-.2px}
    #agend-faq-overlay{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.7);backdrop-filter:blur(12px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-faq-overlay.faq-open{opacity:1;pointer-events:auto}
    #agend-faq-box{background:#fff;border-radius:24px;width:100%;max-width:520px;max-height:85vh;overflow-y:auto;padding:28px;box-shadow:0 32px 80px rgba(0,0,0,.3);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-faq-overlay.faq-open #agend-faq-box{transform:scale(1) translateY(0)}
    .agend-faq-item{border-bottom:1px solid #f0eeeb;padding:14px 0}
    .agend-faq-item:last-child{border-bottom:none;padding-bottom:0}
    .agend-faq-q{font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:5px}
    .agend-faq-a{font-size:13px;color:#666;line-height:1.65}
    #agend-terms-overlay{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.8);backdrop-filter:blur(14px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-terms-overlay.terms-open{opacity:1;pointer-events:auto}
    #agend-terms-box{background:#fff;border-radius:24px;width:100%;max-width:520px;max-height:88vh;overflow-y:auto;padding:28px;box-shadow:0 32px 80px rgba(0,0,0,.35);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-terms-overlay.terms-open #agend-terms-box{transform:scale(1) translateY(0)}
    #agend-guide-overlay{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.7);backdrop-filter:blur(12px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-guide-overlay.guide-open{opacity:1;pointer-events:auto}
    #agend-guide-box{background:#fff;border-radius:24px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;padding:28px;box-shadow:0 32px 80px rgba(0,0,0,.3);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-guide-overlay.guide-open #agend-guide-box{transform:scale(1) translateY(0)}
    #agend-ciente-overlay{position:fixed;inset:0;z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.8);backdrop-filter:blur(14px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-ciente-overlay.ciente-open{opacity:1;pointer-events:auto}
    #agend-ciente-box{background:#fff;border-radius:24px;width:100%;max-width:480px;padding:28px;box-shadow:0 32px 80px rgba(0,0,0,.35);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-ciente-overlay.ciente-open #agend-ciente-box{transform:scale(1) translateY(0)}
    #agend-avisos-overlay{position:fixed;inset:0;z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.8);backdrop-filter:blur(14px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-avisos-overlay.avisos-open{opacity:1;pointer-events:auto}
    #agend-avisos-box{background:#fff;border-radius:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;padding:28px;box-shadow:0 32px 80px rgba(0,0,0,.35);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-avisos-overlay.avisos-open #agend-avisos-box{transform:scale(1) translateY(0)}
    #agend-termos-overlay{position:fixed;inset:0;z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.8);backdrop-filter:blur(14px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-termos-overlay.termos-open{opacity:1;pointer-events:auto}
    #agend-termos-box{background:#fff;border-radius:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;padding:28px;box-shadow:0 32px 80px rgba(0,0,0,.35);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-termos-overlay.termos-open #agend-termos-box{transform:scale(1) translateY(0)}
    #agend-termoscontent-overlay{position:fixed;inset:0;z-index:99999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.85);backdrop-filter:blur(14px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-termoscontent-overlay.termoscontent-open{opacity:1;pointer-events:auto}
    #agend-termoscontent-box{background:#fff;border-radius:24px;width:100%;max-width:600px;max-height:85vh;overflow-y:auto;padding:28px;box-shadow:0 32px 80px rgba(0,0,0,.35);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-termoscontent-overlay.termoscontent-open #agend-termoscontent-box{transform:scale(1) translateY(0)}
    #agend-termoscontent-box .termos-body h2{font-size:16px;font-weight:700;margin:20px 0 8px;color:#1a1a1a}
    #agend-termoscontent-box .termos-body p{font-size:13px;line-height:1.7;color:#555;margin-bottom:8px}
    #agend-termoscontent-box .termos-body strong{color:#1a1a1a}
    #agend-termoscontent-box .termos-body ul{font-size:13px;line-height:1.7;color:#555;padding-left:20px;list-style:disc;margin-bottom:12px}
    .nb-radio-option{display:flex;align-items:center;gap:12px;padding:16px;border-radius:14px;border:2px solid #e8e8ea;cursor:pointer;transition:all .2s;background:#fafafa}
    .nb-radio-option:hover{border-color:#1a6cff;background:#f0f4ff}
    .nb-radio-option.selected{border-color:#1a6cff;background:#eef3ff}
    #agend-decl-overlay{position:fixed;inset:0;z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.8);backdrop-filter:blur(14px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-decl-overlay.decl-open{opacity:1;pointer-events:auto}
    #agend-decl-box{background:#fff;border-radius:24px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;padding:24px 24px 20px;box-shadow:0 32px 80px rgba(0,0,0,.4);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-decl-overlay.decl-open #agend-decl-box{transform:scale(1) translateY(0)}
    .nb-radio-option input[type="radio"]{accent-color:#1a6cff;width:18px;height:18px;cursor:pointer}
    .nb-radio-label{font-size:14px;font-weight:700;color:#1a1a1a}
    .nb-radio-desc{font-size:12px;color:#888;margin-top:2px}
    .agend-guide-step{display:flex;align-items:flex-start;gap:14px;padding:6px 0}
    .agend-guide-num{width:28px;height:28px;border-radius:50%;background:#1a6cff;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
    .agend-guide-title{font-size:14px;font-weight:700;color:#1a1a1a;margin:0 0 3px}
    .agend-guide-desc{font-size:12px;color:#777;line-height:1.6;margin:0}
    .agend-guide-line{width:1.5px;height:16px;background:#e8e8ea;margin:0 0 0 13px}
    #agend-pix-overlay{position:fixed;inset:0;z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.88);backdrop-filter:blur(16px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-pix-overlay.pix-open{opacity:1;pointer-events:auto}
    #agend-pix-box{background:#fff;border-radius:24px;width:100%;max-width:440px;max-height:92vh;overflow-y:auto;padding:28px;box-shadow:0 32px 80px rgba(0,0,0,.4);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-pix-overlay.pix-open #agend-pix-box{transform:scale(1) translateY(0)}
    #agend-pix-qr{display:block;margin:12px auto;width:180px;height:180px;border-radius:12px;border:2px solid #e8e8ea}
    #agend-pix-code-wrap{background:#f4f4f6;border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:8px;margin-bottom:16px}
    #agend-pix-code-txt{flex:1;font-size:10px;color:#444;word-break:break-all;line-height:1.5;font-family:monospace}
    #agend-pix-copy-btn{flex-shrink:0;padding:8px 14px;border-radius:10px;background:#1a6cff;color:#fff;font-size:12px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap}
    #agend-pix-copy-btn:hover{background:#0057e6}
    #agend-pix-status{text-align:center;font-size:13px;font-weight:600;color:#888;padding:10px 0}
    #agend-pix-countdown{text-align:center;font-size:12px;color:#aaa;margin-top:4px}
    #agend-pix-success{display:none;text-align:center;padding:16px 0}
    #agend-contrato-confirm-overlay{position:fixed;inset:0;z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.88);backdrop-filter:blur(16px);opacity:0;pointer-events:none;transition:opacity .25s}
    #agend-contrato-confirm-overlay.cc-open{opacity:1;pointer-events:auto}
    #agend-contrato-confirm-box{background:#fff;border-radius:24px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;padding:0 28px 28px;box-shadow:0 32px 80px rgba(0,0,0,.4);transform:scale(.95) translateY(8px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
    #agend-contrato-confirm-overlay.cc-open #agend-contrato-confirm-box{transform:scale(1) translateY(0)}
    #agend-cc-hdr{position:sticky;top:0;background:#fff;z-index:10;margin:0 -28px;padding:20px 28px 14px;border-bottom:1px solid #f0eeeb}
    #agend-contrato-confirm-box .termos-body h2{font-size:15px;font-weight:700;margin:16px 0 6px;color:#1a1a1a}
    #agend-contrato-confirm-box .termos-body h3{font-size:13px;font-weight:700;margin:12px 0 4px;color:#1a1a1a}
    #agend-contrato-confirm-box .termos-body p{font-size:13px;line-height:1.7;color:#555;margin-bottom:8px}
    #agend-contrato-confirm-box .termos-body strong{color:#1a1a1a}
    #agend-contrato-confirm-box .termos-body ul{font-size:13px;line-height:1.7;color:#555;padding-left:20px;list-style:disc;margin-bottom:12px}
  `;
  document.head.appendChild(css);

  // ─── Inject booking HTML ──────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'agend-overlay';
  overlay.innerHTML = `
    <div id="agend-box">
      <div class="agend-header">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div>
            <p style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#aaa;margin:0 0 3px">iPro Assistência</p>
            <h2 id="agend-title" style="font-size:18px;font-weight:800;margin:0;color:#1a1a1a">Agendar atendimento</h2>
          </div>
          <button onclick="window.closeAgendamento()" style="width:34px;height:34px;border-radius:50%;background:#f0f0f2;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;color:#888;flex-shrink:0" title="Fechar">✕</button>
        </div>
        <div id="agend-progress" class="agend-progress"></div>
        <div style="display:flex;align-items:center;justify-content:flex-end;margin:6px 0 2px">
          <button onclick="window.agendShowGuide()" style="font-size:11px;color:#1a6cff;background:#f0f4ff;border:none;cursor:pointer;font-family:Inter,sans-serif;font-weight:700;display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;" onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#f0f4ff'">&#9432; Como funciona?</button>
        </div>
        <div style="height:1px;background:#f0eeeb"></div>
      </div>
      <div class="agend-body">

        <!-- Step 1: Produto → Modelo → Serviço → Opção -->
        <div class="agend-step agend-active" data-step="1">
          <div id="agend-sub1-produto" style="padding-top:20px">
            <div class="agend-step-header">
              <h3>Qual é seu dispositivo?</h3>
            </div>
            <p style="font-size:12px;color:#bbb;margin:4px 0 18px">Toque no aparelho para continuar</p>
            <div id="agend-produtos" class="agend-prod-grid"></div>
          </div>
          <div id="agend-sub1-grupo" style="display:none;padding-top:20px">
            <button class="agend-back-btn" onclick="window.agendBack('produto')">← Voltar</button>
            <div class="agend-step-header">
              <h3 id="agend-grupo-title">Qual a série?</h3>
            </div>
            <p style="font-size:12px;color:#bbb;margin:4px 0 16px">Selecione a série do dispositivo</p>
            <div id="agend-grupos-cards" style="display:flex;flex-direction:column;gap:8px"></div>
          </div>
          <div id="agend-sub1-modelo" style="display:none;padding-top:20px">
            <button class="agend-back-btn" onclick="window.agendBack('grupo')">← Voltar</button>
            <div class="agend-step-header">
              <h3 id="agend-modelo-title">Qual o modelo?</h3>
            </div>
            <p style="font-size:12px;color:#bbb;margin:4px 0 16px">Selecione o modelo do seu dispositivo</p>
            <div id="agend-modelos-cards" style="display:flex;flex-direction:column;gap:8px"></div>
          </div>
          <div id="agend-sub1-servico" style="display:none;padding-top:20px">
            <button class="agend-back-btn" onclick="window.agendBack('modelo')">← Voltar</button>
            <div class="agend-step-header">
              <h3>Qual serviço deseja?</h3>
            </div>
            <p style="font-size:12px;color:#bbb;margin:4px 0 16px">Selecione o serviço que você precisa</p>
            <div id="agend-servicos" style="display:flex;flex-direction:column;gap:10px"></div>
          </div>
          <div id="agend-sub1-opcao" style="display:none;padding-top:20px">
            <button class="agend-back-btn" onclick="window.agendBack('servico')">← Voltar</button>
            <div class="agend-step-header">
              <h3 id="agend-opcao-title">Qualidade da peça</h3>
            </div>
            <p id="agend-opcao-subtitle" style="font-size:12px;color:#bbb;margin:4px 0 16px">Escolha a qualidade da peça</p>
            <div id="agend-opcoes" style="display:flex;flex-direction:column;gap:10px"></div>
          </div>
          <div id="agend-sub1-notebook" style="display:none;padding-top:20px">
            <button class="agend-back-btn" onclick="window.agendBack('produto')">← Voltar</button>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
              <div style="width:40px;height:40px;border-radius:12px;background:#e8eeff;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">💻</div>
              <div>
                <h3 style="font-size:16px;font-weight:800;margin:0;color:#1a1a1a">Notebook em geral</h3>
                <p style="font-size:11px;color:#aaa;margin:0">Preencha as informações do seu notebook</p>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:14px">
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Modelo do Notebook *</label>
                <input type="text" id="agend-nb-modelo" class="agend-input" placeholder="Ex: Dell Inspiron 15, Lenovo IdeaPad 3, Acer Nitro 5...">
              </div>
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Tipo de serviço *</label>
                <select id="agend-nb-servico" class="agend-input">
                  <option value="">— Selecione o tipo de serviço —</option>
                </select>
                <button type="button" id="agend-nb-servico-faq" style="display:none;width:100%;margin-top:7px;padding:8px 14px;border-radius:10px;background:#e8f0ff;color:#1a6cff;font-size:12px;font-weight:600;border:1px solid #c7d9f7;cursor:pointer;font-family:Inter,sans-serif" onclick="window.agendShowNbServicoFaq(this)"><i class="fa-solid fa-circle-question" style="font-size:11px;margin-right:5px"></i>Saiba mais sobre este serviço</button>
                <div id="agend-nb-preco-display" style="display:none;margin-top:8px;padding:8px 12px;border-radius:8px;background:#e8f5ed;color:#1a7a42;font-size:13px;font-weight:700;border:1px solid #b2dfcb"></div>
              </div>
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Fale mais sobre o defeito</label>
                <textarea id="agend-nb-descricao" class="agend-input" rows="3" placeholder="Descreva o problema que está enfrentando com o notebook..." style="resize:vertical;min-height:70px"></textarea>
              </div>
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Nome completo *</label>
                <input type="text" id="agend-nb-nome" class="agend-input" placeholder="Seu nome completo">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">CPF</label>
                  <input type="text" id="agend-nb-cpf" class="agend-input" placeholder="000.000.000-00" maxlength="14" oninput="window.agendFormatCpf(this)">
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">E-mail</label>
                  <input type="email" id="agend-nb-email-direct" class="agend-input" placeholder="seu@email.com">
                </div>
              </div>
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Celular / WhatsApp *</label>
                <input type="tel" id="agend-nb-celular" class="agend-input" placeholder="(11) 99999-9999" maxlength="15" oninput="window.agendFormatPhone(this)">
              </div>
            </div>
            <button onclick="window.nbContinuar()" style="margin-top:18px;width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:background .2s" onmouseover="this.style.background='#0057e6'" onmouseout="this.style.background='#1a6cff'">Continuar →</button>
          </div>
        </div>

        <!-- Step 2: Data + Horário -->
        <div class="agend-step" data-step="2" style="padding-top:20px">
          <button class="agend-back-btn" onclick="window.agendGoStep(1)">← Voltar</button>
          <div class="agend-step-header">
            <h3>Selecione a data</h3>
          </div>
          <p style="font-size:12px;color:#bbb;margin:4px 0 18px">Dias em <span style="color:#1a6cff;font-weight:600">azul</span> estão disponíveis · Dias em <span style="color:#ef4444;font-weight:600">vermelho</span> indisponíveis</p>
          <div id="agend-calendar" style="margin-bottom:20px"></div>
          <div id="agend-horarios-section" style="display:none">
            <div class="agend-step-divider"></div>
            <div class="agend-step-header" style="margin-top:20px">
              <p class="agend-section-label" style="margin:0">Horários disponíveis</p>
            </div>
            <div id="agend-horarios" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:10px;margin-top:12px"></div>
          </div>
        </div>

        <!-- Step 3: Dados pessoais -->
        <div class="agend-step" data-step="3" style="padding-top:20px">
          <button class="agend-back-btn" onclick="window.agendStep3Back()">← Voltar</button>
          <div class="agend-step-header">
            <h3>Seus dados de contato</h3>
          </div>
          <p id="agend-step3-desc" style="font-size:12px;color:#bbb;margin:4px 0 20px">Preencha para confirmarmos seu agendamento via WhatsApp</p>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div>
              <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Nome completo *</label>
              <input type="text" id="agend-nome" class="agend-input" placeholder="Seu nome completo" required>
            </div>
            <div id="agend-step3-wpp-row" style="display:grid;grid-template-columns:1fr;gap:12px">
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">WhatsApp *</label>
                <input type="tel" id="agend-whatsapp" class="agend-input" placeholder="(19) 99999-9999" maxlength="15" oninput="window.agendFormatPhone(this)">
              </div>
            </div>
            <!-- Email for notebook mode -->
            <div id="agend-step3-nb-email" style="display:none">
              <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">E-mail *</label>
              <input type="email" id="agend-nb-email" class="agend-input" placeholder="seu@email.com">
            </div>
            <!-- Extra fields (hidden in notebook mode) -->
            <div id="agend-step3-extra-fields">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">CPF *</label>
                  <input type="text" id="agend-cpf" class="agend-input" placeholder="000.000.000-00" maxlength="14" oninput="window.agendFormatCpf(this)">
                </div>
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">E-mail *</label>
                  <input type="email" id="agend-email" class="agend-input" placeholder="seu@email.com" required>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
                <div>
                  <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Confirme WhatsApp *</label>
                  <input type="tel" id="agend-whatsapp2" class="agend-input" placeholder="(19) 99999-9999" maxlength="15" oninput="window.agendFormatPhone(this)">
                </div>
                <div></div>
              </div>
              <div style="border-top:1px solid #f0eeeb;padding-top:16px;margin-top:4px">
                <p style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px">Endereço</p>
                <div style="display:grid;grid-template-columns:140px 1fr;gap:12px;align-items:start">
                  <div>
                    <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">CEP *</label>
                    <input type="text" id="agend-cep" class="agend-input" placeholder="00000-000" maxlength="9" oninput="window.agendFormatCep(this)">
                    <p id="agend-cep-status" style="font-size:10px;margin-top:4px;min-height:14px"></p>
                  </div>
                  <div>
                    <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Rua</label>
                    <input type="text" id="agend-rua" class="agend-input" placeholder="Preenchido automaticamente" readonly style="background:#f5f5f7;color:#888">
                  </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 100px 1fr;gap:12px;margin-top:12px">
                  <div>
                    <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Bairro</label>
                    <input type="text" id="agend-bairro" class="agend-input" placeholder="—" readonly style="background:#f5f5f7;color:#888">
                  </div>
                  <div>
                    <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Nº *</label>
                    <input type="text" id="agend-numero" class="agend-input" placeholder="Nº">
                  </div>
                  <div>
                    <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Complemento</label>
                    <input type="text" id="agend-complemento" class="agend-input" placeholder="Apto, bloco...">
                  </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 80px;gap:12px;margin-top:12px">
                  <div>
                    <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Cidade</label>
                    <input type="text" id="agend-cidade" class="agend-input" placeholder="—" readonly style="background:#f5f5f7;color:#888">
                  </div>
                  <div>
                    <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">UF</label>
                    <input type="text" id="agend-uf" class="agend-input" placeholder="—" readonly style="background:#f5f5f7;color:#888" maxlength="2">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onclick="window.agendGoStep(4)" style="margin-top:22px;width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:background .2s" onmouseover="this.style.background='#0057e6'" onmouseout="this.style.background='#1a6cff'">Continuar →</button>
        </div>

        <!-- Step 4: Revisão -->
        <div class="agend-step" data-step="4" style="padding-top:20px">
          <button class="agend-back-btn" onclick="window.agendStep4Back()">← Voltar</button>
          <p class="agend-section-label">Revisão de dados</p>
          <p style="font-size:13px;color:#666;margin-bottom:18px">Confira os dados do seu agendamento antes de prosseguir</p>
          <div id="agend-review" style="display:flex;flex-direction:column;gap:7px;margin-bottom:20px"></div>
          <div id="agend-submit-error" style="display:none;background:#fef2f2;color:#dc2626;font-size:13px;padding:12px 16px;border-radius:12px;margin-bottom:16px"></div>
          <button id="agend-submit-btn" onclick="window.agendShowAvisos()" style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:background .2s" onmouseover="this.style.background='#0057e6'" onmouseout="this.style.background='#1a6cff'">Prosseguir →</button>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) window.closeAgendamento(); });

  // ─── FAQ Modal ────────────────────────────────────────────
  const faqOverlay = document.createElement('div');
  faqOverlay.id = 'agend-faq-overlay';
  faqOverlay.innerHTML = `
    <div id="agend-faq-box">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <h3 id="agend-faq-title" style="font-size:17px;font-weight:800;margin:0;color:#1a1a1a"></h3>
        <button onclick="window.agendCloseFaq()" style="width:32px;height:32px;border-radius:50%;background:#f5f5f7;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;color:#888">✕</button>
      </div>
      <div id="agend-faq-items"></div>
    </div>`;
  document.body.appendChild(faqOverlay);
  faqOverlay.addEventListener('click', e => { if (e.target === faqOverlay) window.agendCloseFaq(); });

  // ─── Terms/Success Modal ──────────────────────────────────
  // Created dynamically via _createAgendOverlays()

  // ─── Guide / Passo a passo Modal ──────────────────────────────────
  const guideOverlay = document.createElement('div');
  guideOverlay.id = 'agend-guide-overlay';
  guideOverlay.innerHTML = `
    <div id="agend-guide-box">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <h3 style="font-size:17px;font-weight:800;margin:0;color:#1a1a1a">Como funciona o agendamento?</h3>
        <button onclick="window.agendCloseGuide()" style="width:32px;height:32px;border-radius:50%;background:#f5f5f7;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;color:#888">✕</button>
      </div>
      <div>
        <div class="agend-guide-step">
          <div class="agend-guide-num">1</div>
          <div><p class="agend-guide-title">📱 Escolha o dispositivo</p><p class="agend-guide-desc">Selecione qual aparelho Apple precisa de reparo: iPhone, iPad, MacBook, iMac ou Apple Watch.</p></div>
        </div>
        <div class="agend-guide-line"></div>
        <div class="agend-guide-step">
          <div class="agend-guide-num">2</div>
          <div><p class="agend-guide-title">🔧 Serviço e qualidade da peça</p><p class="agend-guide-desc">Escolha o tipo de reparo (ex: troca de tela, bateria) e a qualidade da peça: Standard, Original ou Premium.</p></div>
        </div>
        <div class="agend-guide-line"></div>
        <div class="agend-guide-step">
          <div class="agend-guide-num">3</div>
          <div><p class="agend-guide-title">📅 Data e horário</p><p class="agend-guide-desc">Escolha um dia disponível (azul) e um horário. Dias vermelhos estão indisponíveis ou com todos os horários já reservados.</p></div>
        </div>
        <div class="agend-guide-line"></div>
        <div class="agend-guide-step">
          <div class="agend-guide-num">4</div>
          <div><p class="agend-guide-title">✍️ Seus dados de contato</p><p class="agend-guide-desc">Preencha nome, CPF, e-mail e WhatsApp. Confirmaremos o agendamento via WhatsApp.</p></div>
        </div>
        <div class="agend-guide-line"></div>
        <div class="agend-guide-step">
          <div class="agend-guide-num" style="background:#16a34a">✓</div>
          <div><p class="agend-guide-title">Aguarde a confirmação</p><p class="agend-guide-desc">Seu agendamento fica <strong>pendente de aprovação</strong>. Entraremos em contato via WhatsApp para confirmar. <strong>Não compareça sem confirmação.</strong></p></div>
        </div>
      </div>
      <div style="margin-top:20px;padding:14px;background:#f0f4ff;border-radius:14px">
        <p style="font-size:12px;color:#1a6cff;font-weight:700;margin:0 0 4px">📍 Localização</p>
        <p style="font-size:12px;color:#555;margin:0">Vila Itapura, Campinas — SP &nbsp;·&nbsp; WhatsApp: (19) 99406-3782</p>
      </div>
      <div style="margin-top:12px;background:#fffbeb;border:1.5px solid #fde68a;border-radius:14px;padding:12px">
        <p style="font-size:12px;color:#92400e;font-weight:700;margin:0 0 4px">⚠️ Importante</p>
        <p style="font-size:12px;color:#78350f;line-height:1.7;margin:0">Agendamento e diagnóstico são gratuitos. O orçamento final pode variar após diagnóstico presencial. Garantia de 1 ano nas peças originais e premium.</p>
      </div>
      <button onclick="window.agendCloseGuide()" style="margin-top:16px;width:100%;padding:13px;border-radius:14px;background:#1a1a1a;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;" onmouseover="this.style.background='#1a6cff'" onmouseout="this.style.background='#1a1a1a'">Entendido, começar!</button>
    </div>`;
  document.body.appendChild(guideOverlay);
  guideOverlay.addEventListener('click', e => { if (e.target === guideOverlay) window.agendCloseGuide(); });

  // ─── Avisos / Termos / Confirmação popups created via helper ───
  window._createAgendOverlays = function() {
    // Avisos Importantes popup
    if (!document.getElementById('agend-avisos-overlay')) {
      const avisosOvl = document.createElement('div');
      avisosOvl.id = 'agend-avisos-overlay';
      avisosOvl.innerHTML = `<div id="agend-avisos-box">
        <div style="text-align:center;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:50%;background:#fff8e1;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:24px">⚠️</div>
          <h3 style="font-size:17px;font-weight:800;margin:0 0 4px;color:#1a1a1a">Avisos Importantes</h3>
        </div>
        <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:16px;padding:16px;margin-bottom:18px">
          <ul style="font-size:12.5px;color:#78350f;line-height:2;margin:0;padding-left:16px;list-style:disc">
            <li>Seu agendamento está <strong>sujeito à confirmação</strong>. Após o envio, entraremos em contato via WhatsApp para validar e confirmar o horário.</li>
            <li>O atendimento é realizado <strong>somente com agendamento previamente confirmado</strong>.</li>
            <li>O valor informado pode sofrer <strong>alteração após a análise técnica</strong> presencial do aparelho.</li>
            <li>Para mais dúvidas acesse: <a href="javascript:void(0)" onclick="window.agendShowTermosContent()" style="color:#1a6cff;font-weight:700;text-decoration:underline">Termos e Condições</a></li>
          </ul>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
          <label style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;border:2px solid #e8e8ea;cursor:pointer;transition:all .2s;background:#fafafa" id="agend-avisos-concordo-label">
            <input type="radio" name="agend-avisos-choice" value="concordo" style="accent-color:#1a6cff;width:18px;height:18px" onchange="window._avisosRadioChanged()">
            <span style="font-size:14px;font-weight:600;color:#1a1a1a">Eu concordo</span>
          </label>
          <label style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;border:2px solid #e8e8ea;cursor:pointer;transition:all .2s;background:#fafafa" id="agend-avisos-naoconcordo-label">
            <input type="radio" name="agend-avisos-choice" value="naoconcordo" style="accent-color:#dc2626;width:18px;height:18px" onchange="window._avisosRadioChanged()">
            <span style="font-size:14px;font-weight:600;color:#1a1a1a">Eu não concordo</span>
          </label>
        </div>
        <button id="agend-avisos-btn" onclick="window.agendAvisosNext()" disabled style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:not-allowed;opacity:.4;font-family:Inter,sans-serif;transition:all .2s">Prosseguir →</button>
      </div>`;
      document.body.appendChild(avisosOvl);
    }

    // Termos + assinatura popup
    if (!document.getElementById('agend-termos-overlay')) {
      const termosOvl = document.createElement('div');
      termosOvl.id = 'agend-termos-overlay';
      termosOvl.innerHTML = `<div id="agend-termos-box">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="font-size:17px;font-weight:800;margin:0;color:#1a1a1a">Termos e Confirmação</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
          <label style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;border:2px solid #e8e8ea;cursor:pointer;transition:all .2s;background:#fafafa" class="agend-termos-check-label">
            <input type="checkbox" id="agend-check-garantia" style="accent-color:#1a6cff;width:18px;height:18px;margin-top:2px;flex-shrink:0" onchange="window._termosCheckChanged()">
            <span style="font-size:13px;color:#1a1a1a;line-height:1.5">Eu concordo com os <a href="javascript:void(0)" onclick="event.preventDefault();event.stopPropagation();window.agendShowTermosContent()" style="color:#1a6cff;font-weight:700;text-decoration:underline">termos de garantia</a></span>
          </label>
          <label style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;border:2px solid #e8e8ea;cursor:pointer;transition:all .2s;background:#fafafa" class="agend-termos-check-label">
            <input type="checkbox" id="agend-check-pecas" style="accent-color:#1a6cff;width:18px;height:18px;margin-top:2px;flex-shrink:0" onchange="window._termosCheckChanged()">
            <span style="font-size:13px;color:#1a1a1a;line-height:1.5">Eu concordo com os <a href="javascript:void(0)" onclick="event.preventDefault();event.stopPropagation();window.agendShowTermosContent()" style="color:#1a6cff;font-weight:700;text-decoration:underline">termos de peças</a></span>
          </label>
          <label id="agend-termos-check-label-3" style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;border:2px solid #e8e8ea;cursor:not-allowed;transition:all .2s;background:#fafafa;opacity:.45" class="agend-termos-check-label">
            <input type="checkbox" id="agend-check-agendamento" disabled style="accent-color:#1a6cff;width:18px;height:18px;margin-top:2px;flex-shrink:0;pointer-events:none" onchange="window._termosCheckChanged()">
            <span style="font-size:13px;color:#1a1a1a;line-height:1.5">Eu concordo com os <a href="javascript:void(0)" onclick="event.preventDefault();event.stopPropagation();window.agendShowTermosContent()" style="color:#1a6cff;font-weight:700;text-decoration:underline">termos de agendamento e pagamento</a> <span style="font-size:11px;color:#f59e0b;font-weight:700">(leia os termos completos primeiro)</span></span>
          </label>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Nome completo</label>
            <input type="text" id="agend-termos-nome" class="agend-input" placeholder="Seu nome completo">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">CPF</label>
            <input type="text" id="agend-termos-cpf" class="agend-input" placeholder="000.000.000-00" maxlength="14" oninput="window.agendFormatCpf(this)">
          </div>
        </div>
        <div id="agend-termos-error" style="display:none;background:#fef2f2;color:#dc2626;font-size:13px;padding:10px 14px;border-radius:10px;margin-bottom:14px"></div>
        <button id="agend-termos-btn" onclick="window.agendTermosConfirmar()" disabled style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:not-allowed;opacity:.4;font-family:Inter,sans-serif;transition:all .2s">Confirmar agendamento!</button>
      </div>`;
      document.body.appendChild(termosOvl);
    }

    // Final success overlay
    if (!document.getElementById('agend-terms-overlay')) {
      const termsOvl = document.createElement('div');
      termsOvl.id = 'agend-terms-overlay';
      termsOvl.innerHTML = `<div id="agend-terms-box">
        <div style="text-align:center;margin-bottom:20px">
          <div style="width:56px;height:56px;border-radius:50%;background:#e8f5e9;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:24px">✓</div>
          <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;color:#1a1a1a">Solicitação enviada!</h3>
          <p style="font-size:13px;color:#888;margin:0">Aguardando confirmação da iPro Assistência</p>
        </div>
        <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:16px;padding:16px;margin-bottom:18px">
          <p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 10px">⚠️ Avisos importantes</p>
          <ul style="font-size:12px;color:#78350f;line-height:1.9;margin:0;padding-left:16px">
            <li>Seu agendamento está <strong>pendente de aprovação</strong>. Entraremos em contato via WhatsApp.</li>
            <li><strong>Atendimento somente com agendamento confirmado.</strong></li>
            <li>O orçamento final pode variar após diagnóstico presencial do aparelho.</li>
            <li>Dúvidas? WhatsApp <strong>(19) 99406-3782</strong></li>
          </ul>
        </div>
        <button onclick="window.agendCloseTerms()" style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;" onmouseover="this.style.background='#0057e6'" onmouseout="this.style.background='#1a6cff'">Entendido, fechar</button>
      </div>`;
      document.body.appendChild(termsOvl);
    }

    // Termos e Condições content popup (popup on top of popup)
    if (!document.getElementById('agend-termoscontent-overlay')) {
      const tcOvl = document.createElement('div');
      tcOvl.id = 'agend-termoscontent-overlay';
      tcOvl.innerHTML = `<div id="agend-termoscontent-box">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h3 style="font-size:17px;font-weight:800;margin:0;color:#1a1a1a">📄 Termos e Condições</h3>
          <button onclick="window.agendCloseTermosContent()" style="width:36px;height:36px;border-radius:50%;border:none;background:#f5f5f5;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;color:#888;transition:all .2s" onmouseover="this.style.background='#e5e5e5'" onmouseout="this.style.background='#f5f5f5'">✕</button>
        </div>
        <div id="agend-termos-scroll-hint" style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;padding:10px 14px;margin-bottom:14px;font-size:12px;font-weight:700;color:#92400e;display:flex;align-items:center;gap:8px;transition:all .4s">
          📖 Role até o final para habilitar o aceite dos termos
        </div>
                <div class="termos-body" style="font-family:Inter,sans-serif">
          <h2 style="font-size:15px;font-weight:800;margin:0 0 8px;color:#1a1a1a">CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS, TERMO DE GARANTIA E JURÍDICA TOTAL</h2>
          <p style="font-size:12px;color:#888;margin:0 0 4px"><strong>xPro Assistência Técnica Premium</strong></p>
          <p style="font-size:12px;color:#888;margin:0 0 4px">FORNECEDOR: xPro Assistência Técnica Premium</p>
          <p style="font-size:12px;color:#888;margin:0 0 4px">CNPJ: 33.774.587/0001-45</p>
          <p style="font-size:12px;color:#888;margin:0 0 12px">ENDEREÇO: Rua Alvaro Muller, 795, Vila Itapura, Campinas - SP, CEP: 13023-181</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">I. DAS DISPOSIÇÕES PRELIMINARES E IDENTIFICAÇÃO</h2>
          <p>1. O presente instrumento regula a prestação de serviços técnicos especializados e o fornecimento de componentes eletrônicos pela xPro7, doravante denominada CONTRATADA, ao proprietário do dispositivo, doravante denominado CONTRATANTE.</p>
          <p>2. A CONTRATADA declara-se assistência técnica independente, atuando com plena autonomia técnica, sem qualquer vínculo, autorização ou parceria oficial com a fabricante Apple Inc. ou outras marcas (Art. 421 e 425 do Código Civil).</p>
          <p>3. O CONTRATANTE declara ciência inequívoca de que a intervenção técnica por empresa não autorizada implica na perda imediata de qualquer garantia de fábrica remanescente sobre o dispositivo (Art. 6º, III do CDC).</p>
          <p>4. Este contrato é regido pelo Código de Defesa do Consumidor (Lei 8.078/90) e pelo Código Civil (Lei 10.406⁄02), interpretados sob a égide da boa-fé objetiva (Art. 422 do CC).</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">II. DA NATUREZA DO SERVIÇO E RESPONSABILIDADE</h2>
          <p>1. A responsabilidade da CONTRATADA é objetiva quanto à prestação do serviço, nos termos do Art. 14 do CDC, respondendo por falhas técnicas comprovadas, ressalvadas as excludentes legais.</p>
          <p>2. Nos termos do Art. 14, §3º, I e II do CDC, a CONTRATADA fica isenta de responsabilidade quando comprovada a inexistência do defeito no serviço ou a culpa exclusiva do consumidor ou de terceiros.</p>
          <p>3. O serviço prestado possui natureza de obrigação de meio, consistindo na aplicação da melhor técnica disponível para a tentativa de reparo, não sendo garantido êxito absoluto em hardware severamente danificado.</p>
          <p>4. A impossibilidade de reparo em dispositivos com danos estruturais, oxidação severa ou curto-circuito em placa lógica não configura falha na prestação do serviço (Art. 20, §2º do CDC).</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">III. DO DIAGNÓSTICO E ORÇAMENTO</h2>
          <p>1. O diagnóstico inicial realizado no balcão possui caráter meramente preliminar, podendo ser alterado após testes técnicos aprofundados em bancada (Art. 40 do CDC).</p>
          <p>2. Qualquer alteração de orçamento dependerá de aprovação expressa do CONTRATANTE, podendo ser formalizada por meios eletrônicos (WhatsApp, SMS ou E-mail), com plena validade jurídica.</p>
          <p>3. A recusa do orçamento após a realização de análise técnica autoriza a cobrança de taxa de diagnóstico, previamente informada, para cobrir o tempo técnico e insumos (Art. 39, VI do CDC).</p>
          <p>4. A aprovação do orçamento via meios digitais autoriza o início da execução do serviço e constitui obrigação de pagamento, nos termos acordados entre as partes, servindo como prova de autorização, nos termos do Art. 369 do Código de Processo Civil.</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">IV. DOS RISCOS INERENTES AO MANUSEIO TÉCNICO</h2>
          <p>1. O CONTRATANTE declara ciência de que o dispositivo objeto do serviço pode apresentar desgaste natural decorrente do uso, tempo de utilização, ciclos de carga, envelhecimento de componentes ou condições anteriores à entrada em assistência.</p>
          <p>2. Tais fatores podem influenciar direta ou indiretamente no funcionamento do aparelho, podendo ocasionar falhas supervenientes, sem que isso caracterize falha na prestação do serviço pela CONTRATADA.</p>
          <p>3. Eventuais defeitos que venham a se manifestar após o reparo deverão ser analisados tecnicamente, sendo indispensável a comprovação de nexo causal entre o serviço executado e o problema apresentado para eventual responsabilização.</p>
          <p>4. Em aparelhos com danos estruturais (empenamentos ou quedas graves), o processo de abertura e fechamento pode agravar falhas preexistentes ou levar à perda total do dispositivo.</p>
          <p>5. O CONTRATANTE declara ciência de que dispositivos com danos estruturais, oxidação ou histórico de intervenções anteriores podem apresentar fragilidades ocultas, as quais podem se manifestar ou se agravar durante o procedimento técnico.</p>
          <p>6. O serviço prestado consiste em tentativa técnica de recuperação, podendo não haver êxito em razão das condições pré-existentes do aparelho.</p>
          <p>7. O CONTRATANTE declara ciência dos riscos inerentes ao processo de reparo, permanecendo a responsabilidade da CONTRATADA nos termos da legislação aplicável.</p>
          <p>8. Não haverá responsabilidade da CONTRATADA por danos decorrentes exclusivamente de vícios preexistentes, ocultos ou relacionados à condição estrutural do dispositivo, desde que não haja relação de causa e efeito com o serviço executado, mediante comprovação técnica.</p>
          <p>9. A responsabilidade da CONTRATADA limita-se aos componentes e serviços efetivamente objeto da intervenção técnica realizada.</p>
          <p>10. Não haverá responsabilidade da CONTRATADA por defeitos, falhas ou mau funcionamento de componentes não relacionados ao serviço executado, especialmente quando decorrentes do estado geral do aparelho, desgaste natural, oxidação, danos estruturais ou falhas preexistentes.</p>
          <p>11. Eventuais defeitos que venham a se manifestar após o reparo deverão ser analisados tecnicamente, sendo indispensável a comprovação de nexo causal entre o serviço realizado e o problema apresentado para eventual responsabilização da CONTRATADA.</p>
          <p>12. Na ausência de comprovação de relação direta entre o serviço executado e o defeito alegado, não haverá responsabilidade da CONTRATADA por falhas supervenientes.</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">V. DAS PEÇAS E RESTRIÇÕES DE SOFTWARE</h2>
          <p>1. Nos termos do Art. 21 do CDC, o CONTRATANTE autoriza o uso de componentes que podem ser: originais retirados, compatíveis premium ou compatíveis standard, conforme discriminado no orçamento.</p>
          <p>2. O CONTRATANTE declara ciência de que fabricantes (especialmente Apple Inc.) impõem restrições de software via "pareamento de hardware" (Serialization).</p>
          <p>3. Peças substituídas podem gerar avisos como "peça não reconhecida", "componente desconhecido", "usada" ou "histórico de peça".</p>
          <p>4. Tais avisos decorrem de restrições técnicas e de software impostas pelo fabricante, especialmente relacionadas a mecanismos de pareamento de hardware, não estando relacionados a defeito da peça ou falha na prestação do serviço.</p>
          <p>5. O CONTRATANTE declara ciência de que tais mensagens podem ocorrer inclusive na utilização de peças originais retiradas de outros dispositivos (semi-novas) ou peças compatíveis, não comprometendo, por si só, a funcionalidade essencial do aparelho.</p>
          <p>6. A exibição de tais mensagens de software não caracteriza vício, defeito ou má prestação de serviço, sendo uma limitação imposta pela fabricante original (Art. 31 do CDC).</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">VI. DA GARANTIA E SUAS CONDIÇÕES</h2>
          <p>1. O prazo de garantia legal é de 90 dias (Art. 26, II do CDC). A CONTRATADA poderá oferecer garantia contratual complementar, totalizando o prazo informado na Ordem de Serviço.</p>
          <p>2. A garantia cobre exclusivamente defeitos de fabricação dos componentes substituídos ou falhas diretas da execução técnica do serviço prestado.</p>
          <p>3. A garantia contratual cobre exclusivamente defeitos relacionados às peças substituídas ou à execução do serviço realizado pela CONTRATADA.</p>
          <p>4. A exclusão da garantia dependerá de comprovação técnica de que o dano apresentado decorre de mau uso, queda, impacto, contato com líquidos, intervenção de terceiros ou qualquer fator externo alheio ao serviço prestado.</p>
          <p>5. A simples ocorrência de dano no aparelho não implica, por si só, perda da garantia, sendo indispensável a verificação de nexo causal entre o evento danoso e a conduta do CONTRATANTE ou de terceiros.</p>
          <p>6. Na ausência de comprovação técnica de causa excludente, permanece a responsabilidade da CONTRATADA nos termos da legislação aplicável.</p>
          <p>7. O contato com líquidos (oxidação), ainda que em dispositivos com certificação de resistência à água (IP), poderá comprometer o funcionamento interno do aparelho e gerar danos progressivos.</p>
          <p>8. A presença de oxidação poderá ensejar a exclusão da garantia, desde que comprovado, por meio de análise técnica, que o defeito apresentado possui relação direta com o dano causado por contato com líquido.</p>
          <p>9. Em aparelhos previamente afetados por oxidação, o CONTRATANTE declara ciência de que poderão ocorrer falhas supervenientes em componentes distintos daqueles inicialmente reparados, em razão da propagação do dano interno.</p>
          <p>10. Nessas hipóteses, não haverá responsabilidade da CONTRATADA por defeitos decorrentes da evolução natural do dano por oxidação, desde que não haja nexo causal com o serviço executado.</p>
          <p>11. A intervenção de terceiros, abertura do dispositivo por pessoas não autorizadas ou rompimento de selos de garantia internos ou externos poderá implicar na perda da garantia, desde que comprovado, por meio de análise técnica, que tal intervenção possui relação direta com o defeito apresentado.</p>
          <p>12. Na ausência de comprovação de nexo causal entre a intervenção de terceiros e o defeito alegado, a garantia permanecerá válida nos termos deste contrato e da legislação aplicável.</p>
          <p>13. Atualizações de software realizadas pelo fabricante que venham a restringir funções de hardware (ex: Face ID, Touch ID) não são cobertas pela garantia da CONTRATADA.</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">VII. DO PAGAMENTO E DIREITO DE RETENÇÃO</h2>
          <p>1. Poderá ser exigido pagamento antecipado de até 20% (Arras) para reserva de bancada ou aquisição de peças específicas (Arts. 417 a 420 do Código Civil).</p>
          <p>2. Em caso de desistência imotivada após o início dos atos preparatórios, o valor das arras será retido proporcionalmente para compensar custos operacionais efetivamente incorridos.</p>
          <p>3. A entrega do dispositivo reparado está condicionada à quitação integral dos valores acordados, nos termos do Art. 476 do Código Civil (Exceção do Contrato não Cumprido).</p>
          <p>4. A CONTRATADA exerce o direito de retenção do bem (Art. 1.219 do CC) enquanto houver débito líquido e certo, não configurando abuso, mas exercício regular de direito.</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">VIII. DO ABANDONO E PROTEÇÃO DE DADOS</h2>
          <p>1. Considera-se o bem abandonado caso não seja retirado no prazo de 90 (noventa) dias após a notificação de conclusão do serviço (Art. 1.275 do Código Civil).</p>
          <p>2. A CONTRATADA realizará 03 (três) tentativas de contato comprovadas. Persistindo o silêncio, fica autorizada a alienar o bem para ressarcimento de custos e armazenamento.</p>
          <p>3. O backup integral dos dados é de responsabilidade exclusiva do CONTRATANTE, devendo ser realizado antes da entrega do dispositivo para reparo.</p>
          <p>4. O CONTRATANTE declara ciência de que procedimentos técnicos podem implicar na perda total ou parcial de dados armazenados no aparelho.</p>
          <p>5. A CONTRATADA não se responsabiliza por perda de dados, exceto nos casos em que comprovada falha direta na prestação do serviço.</p>
          <p>6. A entrega do aparelho sem a realização de backup prévio implica na aceitação dos riscos relacionados à eventual perda de informações.</p>
          <p>7. A CONTRATADA compromete-se com a LGPD (Lei 13.709⁄18), utilizando dados do cliente apenas para fins de faturamento, comunicações técnicas e exercício de direitos.</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">IX. DAS CLÁUSULAS ANTI-FRAUDE E PROVAS</h2>
          <p>1. A retirada do dispositivo pelo CONTRATANTE, após realização de testes funcionais, constitui presunção de aceitação quanto ao funcionamento do aparelho no momento da entrega, especialmente em relação a vícios aparentes.</p>
          <p>2. O aceite no ato da retirada não afasta o direito do consumidor de reclamar posteriormente quanto a vícios ocultos, nos termos do Código de Defesa do Consumidor.</p>
          <p>3. Eventuais alegações posteriores deverão ser acompanhadas da comprovação de que o defeito decorre de falha na prestação do serviço, observado o nexo causal entre o serviço executado e o problema apresentado.</p>
          <p>4. Na ausência de comprovação de falha técnica relacionada ao serviço prestado, não haverá responsabilidade da CONTRATADA por defeitos supervenientes.</p>
          <p>5. Em caso de contestação de pagamento junto à operadora (chargeback), a CONTRATADA poderá apresentar toda a documentação comprobatória da prestação do serviço, incluindo ordem de serviço, registros técnicos, comunicações eletrônicas e comprovantes de entrega.</p>
          <p>6. A contestação considerada indevida, especialmente após a efetiva prestação do serviço e retirada do dispositivo, poderá caracterizar indícios de má-fé, sujeitando o CONTRATANTE às medidas administrativas e judiciais cabíveis.</p>
          <p>7. A CONTRATADA poderá promover a cobrança dos valores devidos pelos meios legais disponíveis, inclusive com apresentação de provas à operadora de pagamento e, se necessário, ajuizamento de ação competente.</p>
          <p>8. Os registros técnicos, incluindo checklist de entrada/saída, fotografias e laudos de bancada, constituem prova técnica relevante da condição do aparelho (Art. 369 do CPC).</p>
          <p>9. O CONTRATANTE autoriza o registro fotográfico do dispositivo para fins de documentação técnica e prova de estado físico.</p>
          <h2 style="font-size:14px;font-weight:800;margin:16px 0 8px;color:#1a1a1a">X. DAS DISPOSIÇÕES FINAIS</h2>
          <p>1. As partes reconhecem a validade jurídica de assinaturas digitais e comunicações via aplicativos de mensagens para todos os fins de direito e prova documental.</p>
          <p>2. A CONTRATADA disponibilizará canal de atendimento para análise da reclamação, comprometendo-se a avaliar tecnicamente o caso e apresentar resposta fundamentada.</p>
          <p>3. O CONTRATANTE declara ciência de que a tentativa de solução prévia visa a resolução rápida e eficaz do conflito, podendo evitar custos, tempo e desgaste para ambas as partes.</p>
          <p>4. O não exercício da tentativa de solução prévia não impede o acesso ao Poder Judiciário, mas será considerado para fins de análise da boa-fé das partes.</p>
          <p>5. Fica eleito o foro do domicílio do consumidor (Art. 101, I do CDC) para dirimir quaisquer controvérsias oriundas deste contrato.</p>
          <p style="margin-top:16px;font-size:12px;font-weight:700;color:#1a1a1a">DECLARAÇÃO DE CIÊNCIA E ACEITE:</p>
          <p>O CONTRATANTE declara que leu, compreendeu e concorda com todos os 68 parágrafos, riscos e condições aqui expostos.</p>
        </div><button onclick="window.agendCloseTermosContent()" style="margin-top:16px;width:100%;padding:14px;border-radius:14px;background:#1a1a1a;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:all .2s" onmouseover="this.style.background='#1a6cff'" onmouseout="this.style.background='#1a1a1a'">Fechar</button>
      </div>`;
      document.body.appendChild(tcOvl);
      // Close on overlay click
      tcOvl.addEventListener('click', e => { if (e.target === tcOvl) window.agendCloseTermosContent(); });
    }

    // PIX payment overlay
    if (!document.getElementById('agend-pix-overlay')) {
      const pixOvl = document.createElement('div');
      pixOvl.id = 'agend-pix-overlay';
      pixOvl.innerHTML = `<div id="agend-pix-box">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
          <div style="flex:1;text-align:center">
            <div style="width:52px;height:52px;border-radius:50%;background:#e8f0ff;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:26px">💳</div>
            <h3 style="font-size:17px;font-weight:800;margin:0 0 4px;color:#1a1a1a">Pague a entrada via PIX</h3>
            <p style="font-size:13px;color:#888;margin:0" id="agend-pix-valor-legenda">Carregando...</p>
          </div>
          <button onclick="window.agendClosePix(true)" style="position:absolute;top:20px;right:20px;width:32px;height:32px;border-radius:50%;background:#f0f0f2;border:none;cursor:pointer;font-size:16px;color:#888;display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;line-height:1" title="Fechar e voltar">✕</button>
        </div>
        <img id="agend-pix-qr" src="" alt="QR Code PIX" style="display:none">
        <p style="font-size:11px;font-weight:700;color:#888;text-align:center;margin:6px 0 4px;text-transform:uppercase;letter-spacing:.05em">Ou copie o código PIX</p>
        <div id="agend-pix-code-wrap">
          <span id="agend-pix-code-txt">—</span>
          <button id="agend-pix-copy-btn" onclick="window.agendPixCopyCodigo()">Copiar</button>
        </div>
        <a id="agend-pix-link" href="#" target="_blank" rel="noopener" style="display:none;width:100%;box-sizing:border-box;padding:12px;border-radius:12px;background:#1a6cff;color:#fff;font-size:13px;font-weight:700;text-align:center;text-decoration:none;margin-bottom:12px;font-family:Inter,sans-serif">🔗 Abrir link de pagamento</a>
        <button id="agend-pix-link-copy" onclick="window.agendPixCopyLink()" style="display:none;width:100%;box-sizing:border-box;padding:10px;border-radius:12px;background:#f0f0f2;color:#1a1a1a;font-size:12px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;margin-bottom:14px">📋 Copiar link para enviar ao cliente</button>
        <div id="agend-pix-status">⏳ Aguardando pagamento...</div>
        <div id="agend-pix-countdown"></div>
        <div id="agend-pix-success">
          <div style="font-size:48px;margin-bottom:10px">✅</div>
          <p style="font-size:16px;font-weight:800;color:#16a34a;margin:0 0 6px">Pagamento confirmado!</p>
          <p style="font-size:13px;color:#555;margin:0 0 18px">Seu agendamento foi registrado. Aguarde o contato da iPro.</p>
          <button onclick="window.location.href='/index.html'" style="width:100%;padding:14px;border-radius:14px;background:#16a34a;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif">Fechar</button>
        </div>
        <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;padding:12px 14px;font-size:12px;color:#78350f;margin-top:14px;line-height:1.7" id="agend-pix-aviso">
          <strong>⚠️ Atenção:</strong> O agendamento só será confirmado após a identificação do pagamento. O código PIX expira em <strong>30 minutos</strong>.
        </div>
      </div>`;
      document.body.appendChild(pixOvl);
    }

    // Declarations overlay (dynamic content)
    if (!document.getElementById('agend-decl-overlay')) {
      const declOvl = document.createElement('div');
      declOvl.id = 'agend-decl-overlay';
      declOvl.innerHTML = `<div id="agend-decl-box"></div>`;
      document.body.appendChild(declOvl);
    }

    // Contrato Confirm popup (mandatory contract reading for Apple devices)
    if (!document.getElementById('agend-contrato-confirm-overlay')) {
      const ccOvl = document.createElement('div');
      ccOvl.id = 'agend-contrato-confirm-overlay';
      ccOvl.innerHTML = `<div id="agend-contrato-confirm-box">
        <!-- Sticky header with scroll progress -->
        <div id="agend-cc-hdr">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:36px;height:36px;border-radius:10px;background:#1a6cff;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🛡️</div>
            <div style="flex:1;min-width:0">
              <p style="font-size:13px;font-weight:800;margin:0;color:#1a1a1a;letter-spacing:-.2px">ATENÇÃO – LEIA ANTES DE CONTINUAR</p>
              <p id="agend-cc-scroll-hint" style="font-size:11px;color:#888;margin:2px 0 0">Role até o final para habilitar a confirmação</p>
            </div>
          </div>
          <div style="margin-top:10px;height:4px;background:#e8e8ea;border-radius:4px;overflow:hidden">
            <div id="agend-cc-progress" style="height:100%;width:0%;background:#1a6cff;border-radius:4px;transition:width .12s"></div>
          </div>
        </div>
        <!-- Contract body (embedded directly) -->
        <div id="agend-cc-contrato-body" style="padding:20px 0">
          <div class="termos-body" style="font-family:Inter,sans-serif">
            <h2 style="font-size:15px;font-weight:800;margin:0 0 8px;color:#1a1a1a">CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS, TERMO DE GARANTIA E JURÍDICA TOTAL</h2>
            <p style="font-size:12px;color:#888;margin:0 0 4px"><strong>xPro Assistência Técnica Premium</strong></p>
            <p style="font-size:12px;color:#888;margin:0 0 4px">FORNECEDOR: xPro Assistência Técnica Premium</p>
            <p style="font-size:12px;color:#888;margin:0 0 4px">CNPJ: 33.774.587/0001-45</p>
            <p style="font-size:12px;color:#888;margin:0 0 12px">ENDEREÇO: Rua Alvaro Muller, 795, Vila Itapura, Campinas - SP, CEP: 13023-181</p>
            <h3>I. DAS DISPOSIÇÕES PRELIMINARES E IDENTIFICAÇÃO</h3>
            <p>1. O presente instrumento regula a prestação de serviços técnicos especializados e o fornecimento de componentes eletrônicos pela xPro7, doravante denominada CONTRATADA, ao proprietário do dispositivo, doravante denominado CONTRATANTE.</p>
            <p>2. A CONTRATADA declara-se assistência técnica independente, atuando com plena autonomia técnica, sem qualquer vínculo, autorização ou parceria oficial com a fabricante Apple Inc. ou outras marcas (Art. 421 e 425 do Código Civil).</p>
            <p>3. O CONTRATANTE declara ciência inequívoca de que a intervenção técnica por empresa não autorizada implica na perda imediata de qualquer garantia de fábrica remanescente sobre o dispositivo (Art. 6º, III do CDC).</p>
            <p>4. Este contrato é regido pelo Código de Defesa do Consumidor (Lei 8.078/90) e pelo Código Civil (Lei 10.406⁄02), interpretados sob a égide da boa-fé objetiva (Art. 422 do CC).</p>
            <h3>II. DA NATUREZA DO SERVIÇO E RESPONSABILIDADE</h3>
            <p>1. A responsabilidade da CONTRATADA é objetiva quanto à prestação do serviço, nos termos do Art. 14 do CDC, respondendo por falhas técnicas comprovadas, ressalvadas as excludentes legais.</p>
            <p>2. Nos termos do Art. 14, §3º, I e II do CDC, a CONTRATADA fica isenta de responsabilidade quando comprovada a inexistência do defeito no serviço ou a culpa exclusiva do consumidor ou de terceiros.</p>
            <p>3. O serviço prestado possui natureza de obrigação de meio, consistindo na aplicação da melhor técnica disponível para a tentativa de reparo, não sendo garantido êxito absoluto em hardware severamente danificado.</p>
            <p>4. A impossibilidade de reparo em dispositivos com danos estruturais, oxidação severa ou curto-circuito em placa lógica não configura falha na prestação do serviço (Art. 20, §2º do CDC).</p>
            <h3>III. DO DIAGNÓSTICO E ORÇAMENTO</h3>
            <p>1. O diagnóstico inicial realizado no balcão possui caráter meramente preliminar, podendo ser alterado após testes técnicos aprofundados em bancada (Art. 40 do CDC).</p>
            <p>2. Qualquer alteração de orçamento dependerá de aprovação expressa do CONTRATANTE, podendo ser formalizada por meios eletrônicos (WhatsApp, SMS ou E-mail), com plena validade jurídica.</p>
            <p>3. A recusa do orçamento após a realização de análise técnica autoriza a cobrança de taxa de diagnóstico, previamente informada, para cobrir o tempo técnico e insumos (Art. 39, VI do CDC).</p>
            <p>4. A aprovação do orçamento via meios digitais autoriza o início da execução do serviço e constitui obrigação de pagamento, nos termos acordados entre as partes, servindo como prova de autorização, nos termos do Art. 369 do Código de Processo Civil.</p>
            <h3>IV. DOS RISCOS INERENTES AO MANUSEIO TÉCNICO</h3>
            <p>1. O CONTRATANTE declara ciência de que o dispositivo objeto do serviço pode apresentar desgaste natural decorrente do uso, tempo de utilização, ciclos de carga, envelhecimento de componentes ou condições anteriores à entrada em assistência.</p>
            <p>2. Tais fatores podem influenciar direta ou indiretamente no funcionamento do aparelho, podendo ocasionar falhas supervenientes, sem que isso caracterize falha na prestação do serviço pela CONTRATADA.</p>
            <p>3. Eventuais defeitos que venham a se manifestar após o reparo deverão ser analisados tecnicamente, sendo indispensável a comprovação de nexo causal entre o serviço executado e o problema apresentado para eventual responsabilização.</p>
            <p>4. Em aparelhos com danos estruturais (empenamentos ou quedas graves), o processo de abertura e fechamento pode agravar falhas preexistentes ou levar à perda total do dispositivo.</p>
            <p>5. O CONTRATANTE declara ciência de que dispositivos com danos estruturais, oxidação ou histórico de intervenções anteriores podem apresentar fragilidades ocultas, as quais podem se manifestar ou se agravar durante o procedimento técnico.</p>
            <p>6. O serviço prestado consiste em tentativa técnica de recuperação, podendo não haver êxito em razão das condições pré-existentes do aparelho.</p>
            <p>7. O CONTRATANTE declara ciência dos riscos inerentes ao processo de reparo, permanecendo a responsabilidade da CONTRATADA nos termos da legislação aplicável.</p>
            <p>8. Não haverá responsabilidade da CONTRATADA por danos decorrentes exclusivamente de vícios preexistentes, ocultos ou relacionados à condição estrutural do dispositivo, desde que não haja relação de causa e efeito com o serviço executado, mediante comprovação técnica.</p>
            <p>9. A responsabilidade da CONTRATADA limita-se aos componentes e serviços efetivamente objeto da intervenção técnica realizada.</p>
            <p>10. Não haverá responsabilidade da CONTRATADA por defeitos, falhas ou mau funcionamento de componentes não relacionados ao serviço executado, especialmente quando decorrentes do estado geral do aparelho, desgaste natural, oxidação, danos estruturais ou falhas preexistentes.</p>
            <p>11. Eventuais defeitos que venham a se manifestar após o reparo deverão ser analisados tecnicamente, sendo indispensável a comprovação de nexo causal entre o serviço realizado e o problema apresentado para eventual responsabilização da CONTRATADA.</p>
            <p>12. Na ausência de comprovação de relação direta entre o serviço executado e o defeito alegado, não haverá responsabilidade da CONTRATADA por falhas supervenientes.</p>
            <h3>V. DAS PEÇAS E RESTRIÇÕES DE SOFTWARE</h3>
            <p>1. Nos termos do Art. 21 do CDC, o CONTRATANTE autoriza o uso de componentes que podem ser: originais retirados, compatíveis premium ou compatíveis standard, conforme discriminado no orçamento.</p>
            <p>2. O CONTRATANTE declara ciência de que fabricantes (especialmente Apple Inc.) impõem restrições de software via "pareamento de hardware" (Serialization).</p>
            <p>3. Peças substituídas podem gerar avisos como "peça não reconhecida", "componente desconhecido", "usada" ou "histórico de peça".</p>
            <p>4. Tais avisos decorrem de restrições técnicas e de software impostas pelo fabricante, especialmente relacionadas a mecanismos de pareamento de hardware, não estando relacionados a defeito da peça ou falha na prestação do serviço.</p>
            <p>5. O CONTRATANTE declara ciência de que tais mensagens podem ocorrer inclusive na utilização de peças originais retiradas de outros dispositivos (semi-novas) ou peças compatíveis, não comprometendo, por si só, a funcionalidade essencial do aparelho.</p>
            <p>6. A exibição de tais mensagens de software não caracteriza vício, defeito ou má prestação de serviço, sendo uma limitação imposta pela fabricante original (Art. 31 do CDC).</p>
            <h3>VI. DA GARANTIA E SUAS CONDIÇÕES</h3>
            <p>1. O prazo de garantia legal é de 90 dias (Art. 26, II do CDC). A CONTRATADA poderá oferecer garantia contratual complementar, totalizando o prazo informado na Ordem de Serviço.</p>
            <p>2. A garantia cobre exclusivamente defeitos de fabricação dos componentes substituídos ou falhas diretas da execução técnica do serviço prestado.</p>
            <p>3. A garantia contratual cobre exclusivamente defeitos relacionados às peças substituídas ou à execução do serviço realizado pela CONTRATADA.</p>
            <p>4. A exclusão da garantia dependerá de comprovação técnica de que o dano apresentado decorre de mau uso, queda, impacto, contato com líquidos, intervenção de terceiros ou qualquer fator externo alheio ao serviço prestado.</p>
            <p>5. A simples ocorrência de dano no aparelho não implica, por si só, perda da garantia, sendo indispensável a verificação de nexo causal entre o evento danoso e a conduta do CONTRATANTE ou de terceiros.</p>
            <p>6. Na ausência de comprovação técnica de causa excludente, permanece a responsabilidade da CONTRATADA nos termos da legislação aplicável.</p>
            <p>7. O contato com líquidos (oxidação), ainda que em dispositivos com certificação de resistência à água (IP), poderá comprometer o funcionamento interno do aparelho e gerar danos progressivos.</p>
            <p>8. A presença de oxidação poderá ensejar a exclusão da garantia, desde que comprovado, por meio de análise técnica, que o defeito apresentado possui relação direta com o dano causado por contato com líquido.</p>
            <p>9. Em aparelhos previamente afetados por oxidação, o CONTRATANTE declara ciência de que poderão ocorrer falhas supervenientes em componentes distintos daqueles inicialmente reparados, em razão da propagação do dano interno.</p>
            <p>10. Nessas hipóteses, não haverá responsabilidade da CONTRATADA por defeitos decorrentes da evolução natural do dano por oxidação, desde que não haja nexo causal com o serviço executado.</p>
            <p>11. A intervenção de terceiros, abertura do dispositivo por pessoas não autorizadas ou rompimento de selos de garantia internos ou externos poderá implicar na perda da garantia, desde que comprovado, por meio de análise técnica, que tal intervenção possui relação direta com o defeito apresentado.</p>
            <p>12. Na ausência de comprovação de nexo causal entre a intervenção de terceiros e o defeito alegado, a garantia permanecerá válida nos termos deste contrato e da legislação aplicável.</p>
            <p>13. Atualizações de software realizadas pelo fabricante que venham a restringir funções de hardware (ex: Face ID, Touch ID) não são cobertas pela garantia da CONTRATADA.</p>
            <h3>VII. DO PAGAMENTO E DIREITO DE RETENÇÃO</h3>
            <p>1. Poderá ser exigido pagamento antecipado de até 20% (Arras) para reserva de bancada ou aquisição de peças específicas (Arts. 417 a 420 do Código Civil).</p>
            <p>2. Em caso de desistência imotivada após o início dos atos preparatórios, o valor das arras será retido proporcionalmente para compensar custos operacionais efetivamente incorridos.</p>
            <p>3. A entrega do dispositivo reparado está condicionada à quitação integral dos valores acordados, nos termos do Art. 476 do Código Civil (Exceção do Contrato não Cumprido).</p>
            <p>4. A CONTRATADA exerce o direito de retenção do bem (Art. 1.219 do CC) enquanto houver débito líquido e certo, não configurando abuso, mas exercício regular de direito.</p>
            <h3>VIII. DO ABANDONO E PROTEÇÃO DE DADOS</h3>
            <p>1. Considera-se o bem abandonado caso não seja retirado no prazo de 90 (noventa) dias após a notificação de conclusão do serviço (Art. 1.275 do Código Civil).</p>
            <p>2. A CONTRATADA realizará 03 (três) tentativas de contato comprovadas. Persistindo o silêncio, fica autorizada a alienar o bem para ressarcimento de custos e armazenamento.</p>
            <p>3. O backup integral dos dados é de responsabilidade exclusiva do CONTRATANTE, devendo ser realizado antes da entrega do dispositivo para reparo.</p>
            <p>4. O CONTRATANTE declara ciência de que procedimentos técnicos podem implicar na perda total ou parcial de dados armazenados no aparelho.</p>
            <p>5. A CONTRATADA não se responsabiliza por perda de dados, exceto nos casos em que comprovada falha direta na prestação do serviço.</p>
            <p>6. A entrega do aparelho sem a realização de backup prévio implica na aceitação dos riscos relacionados à eventual perda de informações.</p>
            <p>7. A CONTRATADA compromete-se com a LGPD (Lei 13.709⁄18), utilizando dados do cliente apenas para fins de faturamento, comunicações técnicas e exercício de direitos.</p>
            <h3>IX. DAS CLÁUSULAS ANTI-FRAUDE E PROVAS</h3>
            <p>1. A retirada do dispositivo pelo CONTRATANTE, após realização de testes funcionais, constitui presunção de aceitação quanto ao funcionamento do aparelho no momento da entrega, especialmente em relação a vícios aparentes.</p>
            <p>2. O aceite no ato da retirada não afasta o direito do consumidor de reclamar posteriormente quanto a vícios ocultos, nos termos do Código de Defesa do Consumidor.</p>
            <p>3. Eventuais alegações posteriores deverão ser acompanhadas da comprovação de que o defeito decorre de falha na prestação do serviço, observado o nexo causal entre o serviço executado e o problema apresentado.</p>
            <p>4. Na ausência de comprovação de falha técnica relacionada ao serviço prestado, não haverá responsabilidade da CONTRATADA por defeitos supervenientes.</p>
            <p>5. Em caso de contestação de pagamento junto à operadora (chargeback), a CONTRATADA poderá apresentar toda a documentação comprobatória da prestação do serviço, incluindo ordem de serviço, registros técnicos, comunicações eletrônicas e comprovantes de entrega.</p>
            <p>6. A contestação considerada indevida, especialmente após a efetiva prestação do serviço e retirada do dispositivo, poderá caracterizar indícios de má-fé, sujeitando o CONTRATANTE às medidas administrativas e judiciais cabíveis.</p>
            <p>7. A CONTRATADA poderá promover a cobrança dos valores devidos pelos meios legais disponíveis, inclusive com apresentação de provas à operadora de pagamento e, se necessário, ajuizamento de ação competente.</p>
            <p>8. Os registros técnicos, incluindo checklist de entrada/saída, fotografias e laudos de bancada, constituem prova técnica relevante da condição do aparelho (Art. 369 do CPC).</p>
            <p>9. O CONTRATANTE autoriza o registro fotográfico do dispositivo para fins de documentação técnica e prova de estado físico.</p>
            <h3>X. DAS DISPOSIÇÕES FINAIS</h3>
            <p>1. As partes reconhecem a validade jurídica de assinaturas digitais e comunicações via aplicativos de mensagens para todos os fins de direito e prova documental.</p>
            <p>2. A CONTRATADA disponibilizará canal de atendimento para análise da reclamação, comprometendo-se a avaliar tecnicamente o caso e apresentar resposta fundamentada.</p>
            <p>3. O CONTRATANTE declara ciência de que a tentativa de solução prévia visa a resolução rápida e eficaz do conflito, podendo evitar custos, tempo e desgaste para ambas as partes.</p>
            <p>4. O não exercício da tentativa de solução prévia não impede o acesso ao Poder Judiciário, mas será considerado para fins de análise da boa-fé das partes.</p>
            <p>5. Fica eleito o foro do domicílio do consumidor (Art. 101, I do CDC) para dirimir quaisquer controvérsias oriundas deste contrato.</p>
            <p style="margin-top:16px;font-size:12px;font-weight:700;color:#1a1a1a">DECLARAÇÃO DE CIÊNCIA E ACEITE:</p>
            <p>O CONTRATANTE declara que leu, compreendeu e concorda com todos os 68 parágrafos, riscos e condições aqui expostos.</p>
            <div style="margin-top:16px;padding:14px;background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px">
              <p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 4px">⚠️ Você chegou ao final do contrato</p>
              <p style="font-size:12px;color:#78350f;margin:0">Role a tela para cima para reler qualquer cláusula. Os campos de confirmação serão habilitados automaticamente.</p>
            </div>
          </div>
        </div>
        <!-- Form section (SIM input disabled until scrolled to end; nome/cpf pre-filled read-only) -->
        <div id="agend-cc-form-section" style="margin-top:8px;padding:20px;background:#f8f9ff;border-radius:16px;border:2px solid #dbeafe">
          <!-- Step indicator + termos link -->
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="position:relative;width:42px;height:42px;flex-shrink:0">
                <div style="width:42px;height:42px;border-radius:50%;background:#1a6cff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:800">3</div>
                <span style="position:absolute;top:-8px;right:-8px;font-size:16px">⚠️</span>
              </div>
              <p style="font-size:15px;font-weight:800;color:#1a1a1a;margin:0">Etapa 3 de 3</p>
            </div>
            <a href="javascript:void(0)" onclick="window.agendShowTermosContent()" style="font-size:12px;font-weight:700;color:#1a6cff;text-decoration:underline;white-space:nowrap">📄 Ver Termos de Uso</a>
          </div>
          <!-- Nome -->
          <div style="margin-bottom:10px">
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Nome Completo</label>
            <input type="text" id="agend-cc-nome" class="agend-input" placeholder="Seu nome completo" disabled style="background:#f5f5f7;color:#aaa" oninput="window._ccValidar()">
          </div>
          <!-- CPF -->
          <div style="margin-bottom:18px">
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">CPF</label>
            <input type="text" id="agend-cc-cpf" class="agend-input" placeholder="000.000.000-00" maxlength="14" disabled style="background:#f5f5f7;color:#aaa" oninput="window.agendFormatCpf(this);window._ccValidar()">
          </div>
          <!-- SIM confirmation -->
          <div style="margin-bottom:16px">
            <p style="font-size:13px;font-weight:600;color:#1a1a1a;margin:0 0 10px">Para continuar, digite <strong>SIM</strong> no campo abaixo</p>
            <input type="text" id="agend-cc-sim" class="agend-input" placeholder="SIM" disabled style="background:#f5f5f7;color:#aaa;text-align:center;font-size:16px;font-weight:800;letter-spacing:.12em;text-transform:uppercase" autocomplete="off" oninput="window._ccValidar()">
          </div>
          <div id="agend-cc-error" style="display:none;background:#fef2f2;color:#dc2626;font-size:13px;padding:10px 14px;border-radius:10px;margin-bottom:12px"></div>
          <button id="agend-cc-btn" onclick="window._ccConfirmar()" disabled style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:not-allowed;opacity:.4;font-family:Inter,sans-serif;transition:all .2s;margin-bottom:8px">✅ ACEITO E CONTINUAR</button>
          <button onclick="window._ccCancelar()" style="width:100%;padding:13px;border-radius:14px;background:#fff;border:2px solid #fca5a5;color:#dc2626;font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;transition:all .2s">❌ NÃO ACEITO / VOLTAR</button>
        </div>
        <!-- Success screen (hidden initially) -->
        <div id="agend-cc-success" style="display:none;text-align:center;padding:20px 0">
          <div style="width:56px;height:56px;border-radius:50%;background:#e8f0ff;border:3px solid #1a6cff;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px">✅</div>
          <h3 style="font-size:18px;font-weight:800;margin:0 0 6px;color:#1a1a1a">Termo Aceito!</h3>
          <p style="font-size:13px;color:#888;margin:0 0 20px">Todas as condições foram aceitas com sucesso.</p>
          <div style="background:#f7f7f8;border-radius:12px;padding:14px;margin-bottom:20px;text-align:left">
            <p style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px;text-align:center">DADOS CONFIRMADOS</p>
            <p id="agend-cc-success-nome" style="font-size:14px;font-weight:700;color:#1a1a1a;margin:0 0 2px;text-align:center"></p>
            <p id="agend-cc-success-cpf" style="font-size:13px;color:#666;margin:0;text-align:center"></p>
          </div>
          <button onclick="window._ccProsseguir()" style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:background .2s" onmouseover="this.style.background='#0057e6'" onmouseout="this.style.background='#1a6cff'">Prosseguir →</button>
        </div>
      </div>`;
      document.body.appendChild(ccOvl);
    }
  };
  window._createAgendOverlays();

  // ─── Contrato Confirm popup handlers ─────────────────────
  let _contratoScrolled = false;

  window.agendShowContratoConfirm = function() {
    // Reset scroll state
    _contratoScrolled = false;
    const hint = document.getElementById('agend-cc-scroll-hint');
    if (hint) { hint.textContent = 'Role até o final para habilitar a confirmação'; hint.style.color = '#888'; }
    const bar = document.getElementById('agend-cc-progress');
    if (bar) { bar.style.width = '0%'; bar.style.background = '#1a6cff'; }
    // Reset all fields to disabled/empty
    ['agend-cc-nome', 'agend-cc-cpf', 'agend-cc-sim'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.disabled = true; el.style.background = '#f5f5f7'; el.style.color = '#aaa'; }
    });
    const ccBtn = document.getElementById('agend-cc-btn');
    if (ccBtn) { ccBtn.disabled = true; ccBtn.style.opacity = '.4'; ccBtn.style.cursor = 'not-allowed'; }
    const ccErr = document.getElementById('agend-cc-error');
    if (ccErr) ccErr.style.display = 'none';
    // Hide success, show form
    const succ = document.getElementById('agend-cc-success');
    if (succ) succ.style.display = 'none';
    const formSec = document.getElementById('agend-cc-form-section');
    if (formSec) formSec.style.display = '';
    // Show overlay
    const ol = document.getElementById('agend-contrato-confirm-overlay');
    if (ol) ol.classList.add('cc-open');
    // Attach scroll listener and reset position
    const box = document.getElementById('agend-contrato-confirm-box');
    if (box) {
      box.scrollTop = 0;
      box.onscroll = window._ccScrollHandler;
      // Trigger once in case content is short enough to not need scrolling
      setTimeout(window._ccScrollHandler, 200);
    }
  };

  window._ccScrollHandler = function() {
    const box = document.getElementById('agend-contrato-confirm-box');
    if (!box) return;
    const scrolled = box.scrollTop + box.clientHeight;
    const total = box.scrollHeight;
    const pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 100;
    const bar = document.getElementById('agend-cc-progress');
    if (bar) bar.style.width = pct + '%';
    if (pct >= 95 && !_contratoScrolled) {
      _contratoScrolled = true;
      const hint = document.getElementById('agend-cc-scroll-hint');
      if (hint) { hint.textContent = '✅ Você chegou ao final — preencha os campos abaixo'; hint.style.color = '#16a34a'; }
      if (bar) bar.style.background = '#16a34a';
      // Enable all form inputs and pre-fill nome/cpf from step-3 data
      ['agend-cc-nome', 'agend-cc-cpf', 'agend-cc-sim'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) { el.disabled = false; el.style.background = ''; el.style.color = ''; }
      });
      const ccNome = document.getElementById('agend-cc-nome');
      const ccCpf = document.getElementById('agend-cc-cpf');
      if (ccNome && !ccNome.value) ccNome.value = (document.getElementById('agend-nome')?.value || '').trim();
      if (ccCpf && !ccCpf.value) ccCpf.value = (document.getElementById('agend-cpf')?.value || '').trim();
      window._ccValidar();
    }
  };

  window._ccValidar = function() {
    if (!_contratoScrolled) return;
    const nome = (document.getElementById('agend-cc-nome')?.value || '').trim();
    const cpf = (document.getElementById('agend-cc-cpf')?.value || '').replace(/\D/g, '');
    const sim = (document.getElementById('agend-cc-sim')?.value || '').trim().toUpperCase();
    const btn = document.getElementById('agend-cc-btn');
    const valid = nome.length >= 2 && cpf.length === 11 && sim === 'SIM';
    if (btn) { btn.disabled = !valid; btn.style.opacity = valid ? '1' : '.4'; btn.style.cursor = valid ? 'pointer' : 'not-allowed'; }
  };

  window._ccConfirmar = function() {
    const nome = (document.getElementById('agend-cc-nome')?.value || '').trim();
    const cpf = (document.getElementById('agend-cc-cpf')?.value || '').trim();
    const sim = (document.getElementById('agend-cc-sim')?.value || '').trim().toUpperCase();
    const err = document.getElementById('agend-cc-error');
    if (!nome || !cpf) { if (err) { err.textContent = 'Preencha nome completo e CPF.'; err.style.display = 'block'; } return; }
    if (cpf.replace(/\D/g, '').length < 11) { if (err) { err.textContent = 'CPF inválido.'; err.style.display = 'block'; } return; }
    if (sim !== 'SIM') { if (err) { err.textContent = 'Digite SIM para confirmar a leitura.'; err.style.display = 'block'; } return; }
    if (err) err.style.display = 'none';
    // Store acceptance data for agendSubmit
    window._termosAceiteData = { aceite_termos_digital: true, leu_contrato_completo: true, termos_nome: nome, termos_cpf: cpf };
    // Hide form, show success
    const formSec = document.getElementById('agend-cc-form-section');
    if (formSec) formSec.style.display = 'none';
    const succ = document.getElementById('agend-cc-success');
    if (succ) {
      document.getElementById('agend-cc-success-nome').textContent = nome;
      document.getElementById('agend-cc-success-cpf').textContent = cpf;
      succ.style.display = '';
    }
    const box = document.getElementById('agend-contrato-confirm-box');
    if (box) box.scrollTop = 0;
  };

  window._ccProsseguir = function() {
    document.getElementById('agend-contrato-confirm-overlay').classList.remove('cc-open');
    window.agendSubmit();
  };

  window._ccCancelar = function() {
    document.getElementById('agend-contrato-confirm-overlay').classList.remove('cc-open');
  };

  // ─── Termos Content popup handlers ─────────────────────────
  window.agendShowTermosContent = function() {
    const ol = document.getElementById('agend-termoscontent-overlay');
    if (!ol) return;
    const box = document.getElementById('agend-termoscontent-box');
    if (box) box.scrollTop = 0;
    ol.classList.add('termoscontent-open');
    if (!box) return;
    // Capture callback: set by _declOpenTermos, or default to enable 3rd termos checkbox
    const scrollCb = _pendingTermosCallback || function() {
      const cb3 = document.getElementById('agend-check-agendamento');
      const lbl3 = document.getElementById('agend-termos-check-label-3');
      if (cb3 && cb3.disabled) {
        cb3.disabled = false; cb3.style.pointerEvents = '';
        if (lbl3) { lbl3.style.opacity = '1'; lbl3.style.cursor = 'pointer'; }
        const hint = document.getElementById('agend-termos-scroll-hint');
        if (hint) { hint.textContent = '✅ Termos lidos! Puede marcar o último aceite.'; hint.style.color = '#16a34a'; hint.style.background = '#f0fdf4'; hint.style.borderColor = '#86efac'; }
      }
    };
    _pendingTermosCallback = null;
    // Attach scroll-to-bottom tracker
    if (box._termosScrollHandler) box.removeEventListener('scroll', box._termosScrollHandler);
    const onScroll = function() {
      if (box.scrollTop + box.clientHeight >= box.scrollHeight - 80) {
        box.removeEventListener('scroll', onScroll);
        box._termosScrollHandler = null;
        scrollCb();
      }
    };
    box._termosScrollHandler = onScroll;
    box.addEventListener('scroll', onScroll);
  };
  window.agendCloseTermosContent = function() {
    const ol = document.getElementById('agend-termoscontent-overlay');
    if (ol) ol.classList.remove('termoscontent-open');
  };

  // ─── Avisos / Termos popup handlers ────────────────────────
  window._avisosRadioChanged = function() {
    const chosen = document.querySelector('input[name="agend-avisos-choice"]:checked');
    const btn = document.getElementById('agend-avisos-btn');
    const concordoLabel = document.getElementById('agend-avisos-concordo-label');
    const naoLabel = document.getElementById('agend-avisos-naoconcordo-label');
    if (chosen) {
      btn.disabled = false; btn.style.opacity = '1'; btn.style.cursor = 'pointer';
      if (chosen.value === 'concordo') {
        concordoLabel.style.borderColor = '#1a6cff'; concordoLabel.style.background = '#f0f4ff';
        naoLabel.style.borderColor = '#e8e8ea'; naoLabel.style.background = '#fafafa';
      } else {
        naoLabel.style.borderColor = '#dc2626'; naoLabel.style.background = '#fef2f2';
        concordoLabel.style.borderColor = '#e8e8ea'; concordoLabel.style.background = '#fafafa';
      }
    }
  };

  window.agendShowAvisos = function() {
    window.agendSubmit();
  };

  window.agendAvisosNext = function() {
    const chosen = document.querySelector('input[name="agend-avisos-choice"]:checked');
    if (!chosen) return;
    if (chosen.value === 'naoconcordo') {
      document.getElementById('agend-avisos-overlay').classList.remove('avisos-open');
      alert('Você precisa concordar com os avisos para prosseguir com o agendamento.');
      return;
    }
    document.getElementById('agend-avisos-overlay').classList.remove('avisos-open');
    // Notebook/outros: vai direto para envio via WhatsApp, sem etapa de termos
    if (isNotebook) {
      window.agendSubmit();
      return;
    }
    // Dispositivos Apple: mostra popup de termos e assinatura
    window.agendShowTermos();
  };

  window.agendShowTermos = function() {
    // Reset termos popup
    ['agend-check-garantia','agend-check-pecas','agend-check-agendamento'].forEach(id => {
      const el = document.getElementById(id); if (el) el.checked = false;
    });
    // Prefill name and CPF from form dataaa
    const nomeEl = document.getElementById('agend-termos-nome');
    const cpfEl = document.getElementById('agend-termos-cpf');
    const formNome = document.getElementById('agend-nome');
    const formCpf = document.getElementById('agend-cpf');
    if (nomeEl && formNome) nomeEl.value = formNome.value.trim();
    if (cpfEl && formCpf) cpfEl.value = isNotebook ? '' : formCpf.value.trim();
    // Always show CPF field (required for all booking types)
    const cpfRow = cpfEl && cpfEl.closest ? cpfEl.closest('div') : null;
    if (cpfRow) cpfRow.style.display = '';
    const btn = document.getElementById('agend-termos-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '.4'; btn.style.cursor = 'not-allowed'; }
    const errEl = document.getElementById('agend-termos-error');
    if (errEl) errEl.style.display = 'none';
    window._termosCheckChanged();
    const ol = document.getElementById('agend-termos-overlay');
    if (ol) ol.classList.add('termos-open');
  };

  window._termosCheckChanged = function() {
    const c1 = document.getElementById('agend-check-garantia')?.checked;
    const c2 = document.getElementById('agend-check-pecas')?.checked;
    const c3 = document.getElementById('agend-check-agendamento')?.checked;
    const btn = document.getElementById('agend-termos-btn');
    const allChecked = c1 && c2 && c3;
    if (btn) {
      btn.disabled = !allChecked;
      btn.style.opacity = allChecked ? '1' : '.4';
      btn.style.cursor = allChecked ? 'pointer' : 'not-allowed';
    }
    // Highlight checked labels
    document.querySelectorAll('.agend-termos-check-label').forEach(label => {
      const cb = label.querySelector('input[type="checkbox"]');
      if (cb && cb.checked) {
        label.style.borderColor = '#1a6cff';
        label.style.background = '#f0f4ff';
      } else {
        label.style.borderColor = '#e8e8ea';
        label.style.background = '#fafafa';
      }
    });
  };

  window.agendTermosConfirmar = function() {
    const nome = (document.getElementById('agend-termos-nome')?.value || '').trim();
    const cpf = (document.getElementById('agend-termos-cpf')?.value || '').trim();
    const errEl = document.getElementById('agend-termos-error');
    if (!nome || !cpf) {
      if (errEl) { errEl.textContent = 'Preencha nome completo e CPF.'; errEl.style.display = 'block'; }
      return;
    }
    if (cpf.replace(/\D/g, '').length < 11) {
      if (errEl) { errEl.textContent = 'CPF inválido.'; errEl.style.display = 'block'; }
      return;
    }
    if (errEl) errEl.style.display = 'none';
    // Store terms acceptance data for submit
    window._termosAceiteData = { aceite_termos_digital: true, termos_nome: nome, termos_cpf: cpf };
    // Close termos popup
    document.getElementById('agend-termos-overlay').classList.remove('termos-open');
    // Now actually submit
    window.agendSubmit();
  };

  // ─── Progress dots ────────────────────────────────────────
  function renderProgress() {
    const c = document.getElementById('agend-progress');
    if (!c) return;
    c.innerHTML = '';
    c.style.cssText = 'display:block';
    const isNbOrcamento = isNotebook && notebookSel.tipoSolicitacao === 'orcamento';
    const isNbAgendamento = isNotebook && notebookSel.tipoSolicitacao !== 'orcamento';
    const stepLabels = isNbOrcamento ? ['Serviço', 'Dados', 'Revisão'] : isNbAgendamento ? ['Serviço', 'Data', 'Revisão'] : ['Serviço', 'Data', 'Dados', 'Revisão'];
    const totalSteps = stepLabels.length;
    // Map real step to display step for nb-orcamento (1→1, 3→2, 4→3) and nb-agendamento (1→1, 2→2, 4→3)
    let displayStep = step;
    if (isNbOrcamento) {
      if (step === 3) displayStep = 2;
      else if (step === 4) displayStep = 3;
    } else if (isNbAgendamento) {
      if (step === 4) displayStep = 3;
    }
    // Single row: each column = [dot above, label below], connected by horizontal lines
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:flex-start;gap:0;width:100%';
    for (let i = 1; i <= totalSteps; i++) {
      const col = document.createElement('div');
      col.style.cssText = 'display:flex;flex-direction:column;align-items:center;flex-shrink:0';
      const dot = document.createElement('div');
      dot.className = 'agend-progress-dot' + (i === displayStep ? ' active' : '') + (i < displayStep ? ' done' : '');
      const isActive = i === displayStep;
      const isDone = i < displayStep;
      const lbl = document.createElement('span');
      lbl.textContent = stepLabels[i - 1];
      lbl.style.cssText =
        'font-size:10px;font-weight:' + (isActive ? '700' : '500') +
        ';color:' + (isDone ? '#1a6cff' : isActive ? '#1a6cff' : '#ccc') +
        ';margin-top:7px;white-space:nowrap;transition:all .3s';
      col.appendChild(dot);
      col.appendChild(lbl);
      row.appendChild(col);
      if (i < totalSteps) {
        const line = document.createElement('div');
        line.style.cssText = 'flex:1;height:2px;border-radius:2px;background:' +
          (i < displayStep ? '#1a6cff' : '#e8e8ea') +
          ';transition:background .3s;align-self:flex-start;margin-top:3px';
        row.appendChild(line);
      }
    }
    c.appendChild(row);
  }

  // ─── Navigation ───────────────────────────────────────────
  function showStep(n) {
    step = n;
    document.querySelectorAll('.agend-step').forEach(s => s.classList.remove('agend-active'));
    const target = document.querySelector(`.agend-step[data-step="${n}"]`);
    if (target) target.classList.add('agend-active');
    renderProgress();
    _updateHeaderBack();
    if (n === 1) {
      _updateSubStepTitle();
    } else {
      const titles = { 2: 'Escolha data e horário', 3: 'Seus dados', 4: 'Revisão' };
      const titleEl = document.getElementById('agend-title');
      if (titleEl) titleEl.textContent = titles[n] || 'Agendar atendimento';
    }
    document.getElementById('agend-progress').style.display = 'flex';
    // Toggle step 3 extra fields (hidden for notebook, visible for normal)
    if (n === 3) {
      const extra = document.getElementById('agend-step3-extra-fields');
      const desc = document.getElementById('agend-step3-desc');
      if (extra) extra.style.display = isNotebook ? 'none' : '';
      const nbEmailRow = document.getElementById('agend-step3-nb-email');
      if (nbEmailRow) nbEmailRow.style.display = isNotebook ? '' : 'none';
      if (desc) desc.textContent = isNotebook ? 'Preencha para confirmarmos seu agendamento' : 'Preencha para confirmarmos seu agendamento via WhatsApp';
    }
  }

  window.agendGoStep = function (n) {
    if (n === 1) {
      if (isNotebook) {
        _showSub1('notebook');
      } else if (sel.opcao && opcoesData.filter(o => o.ativo !== false).length > 0) {
        _showSub1('opcao');
      } else if (sel.servico) {
        _showSub1('servico');
      }
    }
    if (n === 4) {
      const nome = document.getElementById('agend-nome').value.trim();
      const wpp = document.getElementById('agend-whatsapp').value.trim();
      if (isNotebook) {
        // Notebook agendamento: contact data was collected in step 1, pre-fill hidden fields
        if (!nome && notebookSel.nome) document.getElementById('agend-nome').value = notebookSel.nome;
        if (!wpp && notebookSel.celular) document.getElementById('agend-whatsapp').value = notebookSel.celular;
        const nbEmailField = document.getElementById('agend-nb-email');
        if (nbEmailField && !nbEmailField.value && notebookSel.email) nbEmailField.value = notebookSel.email;
        buildReview();
      } else {
        const cpf = document.getElementById('agend-cpf').value.trim();
        const email = document.getElementById('agend-email').value.trim();
        const wpp2 = document.getElementById('agend-whatsapp2').value.trim();
        const cep = (document.getElementById('agend-cep')?.value || '').replace(/\D/g, '');
        const numero = (document.getElementById('agend-numero')?.value || '').trim();
        const cidade = (document.getElementById('agend-cidade')?.value || '').trim();
        if (!nome || !cpf || !email || !wpp || !wpp2) { alert('Preencha todos os campos obrigatórios.'); return; }
        if (wpp !== wpp2) { alert('Os números de WhatsApp não conferem.'); return; }
        if (!_validarEmail(email)) { alert('E-mail inválido. Verifique e tente novamente.'); return; }
        if (!_validarCpf(cpf)) { alert('CPF inválido. Verifique os dígitos e tente novamente.'); return; }
        if (cep.length !== 8 || !cidade) { alert('Informe um CEP válido.'); return; }
        if (!numero) { alert('Informe o número do endereço.'); return; }
        buildReview();
      }
    }
    showStep(n);
  };

  function hideAllSub1() {
    ['agend-sub1-produto', 'agend-sub1-grupo', 'agend-sub1-modelo', 'agend-sub1-servico', 'agend-sub1-opcao', 'agend-sub1-notebook']
      .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    setTimeout(_updateHeaderBack, 0);
  }

  function _updateSubStepTitle() {
    const titleEl = document.getElementById('agend-title');
    if (!titleEl) return;
    const map = { notebook: 'Notebook em geral', opcao: 'Qualidade da peça', servico: 'Qual serviço deseja?', modelo: 'Qual o modelo?', grupo: 'Qual a série?', produto: 'Qual é seu dispositivo?' };
    for (const name of ['notebook','opcao','servico','modelo','grupo','produto']) {
      const el = document.getElementById('agend-sub1-' + name);
      if (el && el.style.display !== 'none') { titleEl.textContent = map[name]; return; }
    }
    titleEl.textContent = 'Qual é seu dispositivo?';
  }

  function _showSub1(name) {
    const map = { produto: 'Qual é seu dispositivo?', grupo: 'Qual a série?', modelo: 'Qual o modelo?', servico: 'Qual serviço deseja?', opcao: 'Qualidade da peça', notebook: 'Notebook em geral' };
    hideAllSub1();
    const el = document.getElementById('agend-sub1-' + name);
    if (el) el.style.display = '';
    const titleEl = document.getElementById('agend-title');
    if (titleEl) titleEl.textContent = map[name] || 'Agendar atendimento';
  }

  function _updateHeaderBack() {
    const btn = document.getElementById('agend-header-back-btn');
    if (!btn) return;
    let show = false;
    if (step === 1) {
      const prodDiv = document.getElementById('agend-sub1-produto');
      show = !(prodDiv && prodDiv.style.display !== 'none');
    } else {
      show = true;
    }
    btn.style.display = show ? 'inline-flex' : 'none';
  }

  window.agendHeaderBack = function() {
    if (step === 1) {
      const grupo = document.getElementById('agend-sub1-grupo');
      const modelo = document.getElementById('agend-sub1-modelo');
      const servico = document.getElementById('agend-sub1-servico');
      const opcao = document.getElementById('agend-sub1-opcao');
      const notebook = document.getElementById('agend-sub1-notebook');
      if (grupo && grupo.style.display !== 'none') window.agendBack('produto');
      else if (modelo && modelo.style.display !== 'none') window.agendBack('grupo');
      else if (servico && servico.style.display !== 'none') window.agendBack('modelo');
      else if (opcao && opcao.style.display !== 'none') window.agendBack('servico');
      else if (notebook && notebook.style.display !== 'none') window.agendBack('produto');
    } else if (step === 2) {
      window.agendGoStep(1);
    } else if (step === 3) {
      window.agendStep3Back();
    } else if (step === 4) {
      window.agendStep4Back();
    }
  };

  window.agendBack = function (to) {
    // Clear any inline FAQ expanders
    ['faq-produto-expand','faq-modelo-expand','faq-servico-expand','faq-opcao-expand'].forEach(id => {
      const el = document.getElementById(id); if (el) { el.innerHTML = ''; el.dataset.open = '0'; }
    });
    if (to === 'produto') {
      _showSub1('produto');
      sel.grupo = null; sel.modelo = null; sel.servico = null; sel.opcao = null;
    } else if (to === 'grupo') {
      // Go back to grupo step if grupos exist, otherwise go to produto
      const activeModels = modelosData.filter(m => m.ativo !== false);
      const hasGrupos = activeModels.some(m => m.grupo);
      sel.grupo = null; sel.modelo = null; sel.servico = null; sel.opcao = null;
      if (hasGrupos) {
        _showSub1('grupo');
      } else {
        _showSub1('produto');
        sel.produto = null;
      }
    } else if (to === 'modelo') {
      if (modelosData.filter(m => m.ativo !== false).length > 0) {
        _showSub1('modelo');
      } else {
        _showSub1('produto');
        sel.modelo = null;
      }
      sel.servico = null; sel.opcao = null;
    } else if (to === 'servico') {
      _showSub1('servico');
      sel.opcao = null;
    }
  };

  // ─── Open / Close ─────────────────────────────────────────
  window.openAgendamento = async function () {
    overlay.classList.add('agend-open');
    document.body.style.overflow = 'hidden';
    step = 1;
    sel = { produto: null, grupo: null, modelo: null, servico: null, opcao: null, data: null, horario: null, cienteAvisoPeca: null };
    isNotebook = false;
    notebookSel = { modelo: '', servico: '', descricao: '', preco: 0, tipoSolicitacao: 'agendamento' };
    currentMonth = new Date();
    calAvailability = {};
    faqServicoData = [];
    opcoesData = [];
    // Clear personal data fields and reset submit button on every open
    ['agend-nome','agend-cpf','agend-email','agend-whatsapp','agend-whatsapp2',
     'agend-cep','agend-rua','agend-bairro','agend-numero','agend-complemento','agend-cidade','agend-uf'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const cepStatus = document.getElementById('agend-cep-status');
    if (cepStatus) cepStatus.textContent = '';
    const submitBtn = document.getElementById('agend-submit-btn');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Prosseguir →'; }
    const errDiv = document.getElementById('agend-submit-error');
    if (errDiv) errDiv.style.display = 'none';
    _showSub1('produto');
    showStep(1); // render progress dots and mark step active
    const grid = document.getElementById('agend-produtos');
    if (grid) grid.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;padding:30px;gap:10px"><div style="width:20px;height:20px;border:2.5px solid #1a6cff;border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite"></div><span style="font-size:13px;color:#aaa">Carregando dispositivos...</span></div>';
    await loadProdutos();
  };

  window.closeAgendamento = function () {
    overlay.classList.remove('agend-open');
    document.body.style.overflow = '';
    // Reset submit button so next open doesn't show 'Enviando...' stuck state
    const btn = document.getElementById('agend-submit-btn');
    if (btn) { btn.disabled = false; btn.textContent = 'Prosseguir →'; }
  };

  // ─── FAQ helpers ──────────────────────────────────────────
  const FAQ_EXPAND_MAP = { produto: 'faq-produto-expand', modelo: 'faq-modelo-expand', servico: 'faq-servico-expand', opcao: 'faq-opcao-expand' };

  window._closeFaqExpand = function(id) {
    const el = document.getElementById(id);
    if (el) { el.dataset.open = '0'; el.innerHTML = ''; }
  };

  function renderFaqInline(containerId, title, items) {
    const el = document.getElementById(containerId);
    if (!el) return false;
    const isOpen = el.dataset.open === '1';
    if (isOpen) {
      el.dataset.open = '0';
      el.innerHTML = '';
      return true;
    }
    el.dataset.open = '1';
    const lastItemIndex = items.length - 1;
    el.innerHTML = `<div style="background:#f0f4ff;border-radius:14px;padding:12px 14px 10px;margin-top:6px;border:1px solid #dbeafe">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <p style="font-size:11px;font-weight:700;color:#1a6cff;margin:0;text-transform:uppercase;letter-spacing:.05em">${title}</p>
        <button onclick="window._closeFaqExpand('${containerId}')" style="width:22px;height:22px;border-radius:50%;background:#dbeafe;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;color:#1a6cff;flex-shrink:0" title="Fechar">✕</button>
      </div>
      ${items.map((i, idx) => `<div style="${idx < lastItemIndex ? 'margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #c7d9f7' : ''}">
        <p style="font-size:12px;font-weight:700;color:#1a1a1a;margin:0 0 3px">${i.q || i.pergunta}</p>
        <p style="font-size:12px;color:#555;margin:0;line-height:1.65">${i.a || i.resposta}</p>
      </div>`).join('')}
    </div>`;
    return true;
  }

  // Helper: fetch FAQ from DB for a given entity param, returns array or null
  async function fetchDbFaq(param, id) {
    try {
      const r = await fetch('/api/faq?' + param + '=' + id);
      const d = await r.json();
      return Array.isArray(d) && d.length ? d : null;
    } catch { return null; }
  }

  // Helper: show FAQ items — tries inline expand first, then popup modal
  function showFaqItems(title, items) {
    // items may be DB format (.pergunta/.resposta) or static (.q/.a)
    const normalized = items.map(i => ({ q: i.q || i.pergunta, a: i.a || i.resposta }));
    const faqOvl = document.getElementById('agend-faq-overlay');
    const titleEl = document.getElementById('agend-faq-title');
    const itemsEl = document.getElementById('agend-faq-items');
    if (!faqOvl || !titleEl || !itemsEl) return;
    titleEl.textContent = title;
    itemsEl.innerHTML = normalized.map(i =>
      `<div class="agend-faq-item"><div class="agend-faq-q">${i.q}</div><div class="agend-faq-a">${i.a}</div></div>`
    ).join('');
    faqOvl.classList.add('faq-open');
  }

  window.agendShowFaq = async function (key) {
    // For contextual entities (produto, modelo, servico), try loading from DB first
    let dbItems = null;
    let dynamicTitle = null;

    if (key === 'produto' && sel.produto) {
      dbItems = await fetchDbFaq('produto_id', sel.produto.id);
      if (dbItems) dynamicTitle = 'Saiba mais — ' + sel.produto.nome;
    } else if (key === 'modelo') {
      if (sel.modelo) {
        dbItems = await fetchDbFaq('modelo_id', sel.modelo.id);
        if (dbItems) dynamicTitle = 'Saiba mais — ' + sel.modelo.nome;
      }
      if (!dbItems && sel.produto) {
        dbItems = await fetchDbFaq('produto_id', sel.produto.id);
        if (dbItems) dynamicTitle = 'Saiba mais — ' + sel.produto.nome;
      }
    } else if (key === 'servico') {
      if (sel.modelo) {
        dbItems = await fetchDbFaq('modelo_id', sel.modelo.id);
        if (dbItems) dynamicTitle = 'Saiba mais sobre os serviços';
      }
    }

    if (!(dbItems && dbItems.length)) return;
    showFaqItems(dynamicTitle || 'Saiba mais', dbItems);
  };

  window.agendShowFaqServico = async function () {
    let items = faqServicoData && faqServicoData.length ? faqServicoData : null;

    if (!items && sel.servico) {
      items = await fetchDbFaq('servico_id', sel.servico.id);
    }

    if (items && items.length) {
      const title = sel.servico ? 'Saiba mais — ' + sel.servico.nome : 'Saiba mais';
      showFaqItems(title, items);
    }
  };

  // Per-card FAQ: generic function for any entity type
  window.agendShowCardFaq = async function (param, id, nome) {
    const items = await fetchDbFaq(param, id);
    if (items && items.length) {
      showFaqItems('Saiba mais — ' + nome, items);
    }
  };

  // Per-modelo FAQ: shown after selecting a model from dropdown
  window.agendShowFaqModelo = async function () {
    if (!sel.modelo) return;
    const items = await fetchDbFaq('modelo_id', sel.modelo.id);
    if (items && items.length) {
      showFaqItems('Saiba mais — ' + sel.modelo.nome, items);
    }
  };

  window.agendShowNbServicoFaq = async function(btn) {
    const svcId = btn.dataset.svcId;
    const svcNome = btn.dataset.svcNome;
    if (!svcId) return;
    const items = await fetchDbFaq('nb_servico_id', svcId);
    if (items && items.length) {
      showFaqItems('Saiba mais — ' + svcNome, items);
    }
  };

  window.agendCloseFaq = function () {
    const faqOvl = document.getElementById('agend-faq-overlay');
    if (faqOvl) faqOvl.classList.remove('faq-open');
  };
  window.agendCloseTerms = function () {
    const el = document.getElementById('agend-terms-overlay');
    if (el) el.classList.remove('terms-open');
    window._agendWhatsappLink = null;
    window.location.href = '/index.html';
  };
  window.agendShowGuide = function () {
    const el = document.getElementById('agend-guide-overlay');
    if (el) el.classList.add('guide-open');
  };
  window.agendCloseGuide = function () {
    const el = document.getElementById('agend-guide-overlay');
    if (el) el.classList.remove('guide-open');
  };

  // ─── Declarations popup ───────────────────────────────────
  let _declQueue = [];    // filtered declaracoes for current opcao
  let _declIndex = 0;     // current declaration step
  let _declCallback = null; // fn to call when all accepted
  let _declTimerDone = false;
  let _declTermosAberto = false;

  window._agendStartDeclaracoes = function (declaracoes, pagamentoParcial, callback) {
    _declQueue = (declaracoes || []).filter(d => !!(d.titulo || d.texto || d.texto_checkbox));
    if (!_declQueue.length) { callback(); return; }
    _declIndex = 0;
    _declCallback = callback;
    _declTimerDone = false;
    _declTermosAberto = false;
    _renderDeclStep();
  };

  function _renderDeclStep() {
    const d = _declQueue[_declIndex];
    const box = document.getElementById('agend-decl-box');
    if (!box) return;
    const total = _declQueue.length;
    const step = _declIndex + 1;
    const isLast = step === total;
    const checkLabel = d.texto_checkbox || 'Li e concordo com todas as condições acima';

    // Build progress dots
    let progressDots = '';
    if (total > 1) {
      progressDots = '<div style="display:flex;justify-content:center;gap:6px;margin-bottom:20px">';
      for (let i = 0; i < total; i++) {
        const done = i < _declIndex, active = i === _declIndex;
        progressDots += `<div style="width:${done ? '20px' : active ? '28px' : '8px'};height:8px;border-radius:99px;background:${done ? '#16a34a' : active ? '#f59e0b' : '#e0e0e6'};transition:all .35s"></div>`;
      }
      progressDots += '</div>';
    }

    const html = `
      ${progressDots}
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="position:relative;width:48px;height:48px;flex-shrink:0">
            <div style="width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #fbbf24;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#92400e">${step}</div>
            <div style="position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:50%;background:#fff;border:2px solid #fbbf24;display:flex;align-items:center;justify-content:center;font-size:11px">⚠️</div>
          </div>
          <div>
            <p style="font-size:16px;font-weight:800;margin:0;color:#1a1a1a;letter-spacing:-.3px">${d.titulo || 'Atenção'}</p>
            ${total > 1 ? `<p style="font-size:12px;color:#aaa;margin:3px 0 0;font-weight:600">Etapa ${step} de ${total}</p>` : ''}
          </div>
        </div>
      </div>
      <div style="border-radius:16px;border:2px solid #fde68a;overflow:hidden;margin-bottom:20px;box-shadow:0 2px 12px rgba(251,191,36,.12)">
        <div style="background:linear-gradient(90deg,#fef3c7,#fffbeb);padding:8px 14px;border-bottom:1px solid #fde68a;display:flex;align-items:center;gap:6px">
          <span style="font-size:14px">📋</span>
          <span style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.06em">Leia atentamente antes de continuar</span>
        </div>
        <div style="background:#fffdf5;padding:16px">
          <p style="font-size:13px;color:#78350f;line-height:1.85;margin:0;white-space:pre-line">${d.texto || ''}</p>
        </div>
      </div>
      ${isLast ? `
      <div id="agend-decl-terms-card" style="border-radius:14px;border:2px solid #fed7aa;background:#fff7ed;padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:12px;transition:all .35s">
        <div id="agend-decl-terms-icon" style="width:36px;height:36px;border-radius:10px;background:#fed7aa;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;transition:all .35s">📄</div>
        <div style="flex:1;min-width:0">
          <p style="font-size:12px;font-weight:800;color:#c2410c;margin:0 0 2px">Leitura dos Termos obrigatória</p>
          <p id="agend-decl-terms-status" style="font-size:11px;color:#9a3412;margin:0;transition:color .35s">Abra e leia os Termos de Uso antes de continuar</p>
        </div>
        <button id="agend-decl-terms-btn" onclick="window._declOpenTermos()" style="flex-shrink:0;padding:8px 14px;border-radius:10px;background:#ea580c;color:#fff;font-size:12px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap;transition:background .25s">Ler agora →</button>
      </div>` : ''}
      <div style="border-radius:14px;border:2px solid #e8e8ea;overflow:hidden;margin-bottom:16px">
        <label id="agend-decl-check-label" style="display:flex;align-items:flex-start;gap:12px;padding:14px;cursor:${isLast && !_declTermosAberto ? 'not-allowed' : 'pointer'};background:#fafafa;opacity:${isLast && !_declTermosAberto ? '.45' : '1'};transition:opacity .35s,cursor .35s">
          <input type="checkbox" id="agend-decl-check" ${isLast && !_declTermosAberto ? 'disabled' : ''} style="accent-color:#7c3aed;width:20px;height:20px;margin-top:1px;flex-shrink:0;${isLast && !_declTermosAberto ? 'pointer-events:none' : ''}" onchange="window._declValidate()">
          <span style="font-size:13px;color:#1a1a1a;line-height:1.5;font-weight:600">${checkLabel}</span>
        </label>
      </div>
      ${isLast ? `
      <div style="background:#f8f9ff;border-radius:14px;border:2px solid #dbeafe;padding:16px;margin-bottom:16px">
        <p style="font-size:11px;font-weight:700;color:#1a6cff;text-transform:uppercase;letter-spacing:.06em;margin:0 0 12px">📝 Confirmação de identidade</p>
        <div style="margin-bottom:10px">
          <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Nome Completo</label>
          <input type="text" id="agend-decl-nome" class="agend-input" placeholder="Seu nome completo" oninput="window._declValidate()">
        </div>
        <div style="margin-bottom:12px">
          <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">CPF</label>
          <input type="text" id="agend-decl-cpf" class="agend-input" placeholder="000.000.000-00" maxlength="14" oninput="window.agendFormatCpf(this);window._declValidate()">
        </div>
        <div>
          <p style="font-size:13px;font-weight:600;color:#1a1a1a;margin:0 0 8px">Para continuar, digite <strong>SIM</strong> no campo abaixo</p>
          <input type="text" id="agend-decl-sim" class="agend-input" placeholder="SIM" oninput="window._declValidate()" autocomplete="off" style="text-align:center;font-size:16px;font-weight:800;letter-spacing:.12em;text-transform:uppercase">
        </div>
      </div>` : ''}
      <button id="agend-decl-btn" onclick="window._declNext()" disabled style="width:100%;padding:15px;border-radius:14px;background:#16a34a;color:#fff;font-size:14px;font-weight:700;border:none;cursor:not-allowed;opacity:.35;font-family:Inter,sans-serif;transition:all .25s;margin-bottom:8px">${step < total ? '✅ ACEITO E AVANÇAR' : '✅ ACEITO E CONTINUAR'}</button>
      <button onclick="window._declBack()" style="width:100%;padding:13px;border-radius:14px;background:#f5f5f7;border:2px solid #e0ddd9;color:#555;font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;transition:all .2s;margin-bottom:8px">← VOLTAR</button>
      <button onclick="window._declCancel()" style="width:100%;padding:13px;border-radius:14px;background:#fff;border:2px solid #fca5a5;color:#dc2626;font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;transition:all .2s">❌ NÃO ACEITO</button>`;

    box.innerHTML = html;
    box.scrollTop = 0;
    if (isLast) {
      const nomeEl = document.getElementById('agend-decl-nome');
      const cpfEl = document.getElementById('agend-decl-cpf');
      if (nomeEl && !nomeEl.value) nomeEl.value = (document.getElementById('agend-nome')?.value || '').trim();
      if (cpfEl && !cpfEl.value) cpfEl.value = (document.getElementById('agend-cpf')?.value || '').trim();
    }
    const ovl = document.getElementById('agend-decl-overlay');
    if (ovl) ovl.classList.add('decl-open');
  }

  window._declValidate = function () {
    const cb = document.getElementById('agend-decl-check');
    const isLastStep = _declIndex === _declQueue.length - 1;
    const inp = document.getElementById('agend-decl-sim');
    const nomeEl = document.getElementById('agend-decl-nome');
    const cpfEl = document.getElementById('agend-decl-cpf');
    const simOk = !isLastStep || !!(inp && inp.value.trim().toUpperCase() === 'SIM');
    const nomeOk = !isLastStep || !!(nomeEl && nomeEl.value.trim().length >= 2);
    const cpfOk = !isLastStep || !!(cpfEl && cpfEl.value.replace(/\D/g, '').length === 11);
    const termsOk = !isLastStep || _declTermosAberto;
    const valid = !!(cb && cb.checked && simOk && nomeOk && cpfOk && termsOk);
    const btn = document.getElementById('agend-decl-btn');
    if (btn) {
      btn.disabled = !valid;
      btn.style.opacity = valid ? '1' : '.35';
      btn.style.cursor = valid ? 'pointer' : 'not-allowed';
    }
  };

  window._declNext = function () {
    // If completing the last step, store acceptance data
    if (_declIndex === _declQueue.length - 1) {
      const nome = (document.getElementById('agend-decl-nome')?.value || '').trim();
      const cpf = (document.getElementById('agend-decl-cpf')?.value || '').trim();
      window._termosAceiteData = { aceite_termos_digital: true, leu_contrato_completo: true, termos_nome: nome, termos_cpf: cpf };
    }
    _declIndex++;
    if (_declIndex >= _declQueue.length) {
      // All declarations accepted
      const ovl = document.getElementById('agend-decl-overlay');
      if (ovl) ovl.classList.remove('decl-open');
      if (_declCallback) _declCallback();
    } else {
      _renderDeclStep();
    }
  };

  window._declBack = function () {
    if (_declIndex > 0) {
      _declIndex--;
      _declTermosAberto = false;
      _renderDeclStep();
    } else {
      window._declCancel();
    }
  };

  window._declCancel = function () {
    const ovl = document.getElementById('agend-decl-overlay');
    if (ovl) ovl.classList.remove('decl-open');
    _declQueue = [];
    _declCallback = null;
  };

  window._declCheckUnlock = function() {
    const isLast = _declIndex === _declQueue.length - 1;
    const termsOk = !isLast || _declTermosAberto;
    if (!termsOk) return;
    const cb = document.getElementById('agend-decl-check');
    const lbl = document.getElementById('agend-decl-check-label');
    const banner = document.getElementById('agend-decl-lock-banner');
    const lockIcon = document.getElementById('agend-decl-lock-icon');
    const lockText = document.getElementById('agend-decl-lock-text');
    const lockCount = document.getElementById('agend-decl-lock-count');
    const lockBar = document.getElementById('agend-decl-lock-bar');
    if (cb) { cb.disabled = false; cb.style.pointerEvents = 'auto'; }
    if (lbl) { lbl.style.cursor = 'pointer'; lbl.style.opacity = '1'; }
    if (banner) { banner.style.background = '#f0fdf4'; banner.style.borderBottomColor = '#86efac'; }
    if (lockIcon) { lockIcon.style.background = '#bbf7d0'; lockIcon.textContent = '✅'; }
    if (lockText) { lockText.textContent = 'Pronto! Agora você pode confirmar a leitura abaixo'; lockText.style.color = '#16a34a'; }
    if (lockCount) lockCount.textContent = '';
    if (lockBar) { lockBar.style.background = '#16a34a'; lockBar.style.width = '100%'; }
  };

  window._declOpenTermos = function() {
    _pendingTermosCallback = function() {
      _declTermosAberto = true;
      const card = document.getElementById('agend-decl-terms-card');
      const statusEl = document.getElementById('agend-decl-terms-status');
      const btn = document.getElementById('agend-decl-terms-btn');
      const icon = document.getElementById('agend-decl-terms-icon');
      if (card) { card.style.borderColor = '#86efac'; card.style.background = '#f0fdf4'; }
      if (statusEl) { statusEl.textContent = '✅ Termos de Uso lidos — pode prosseguir'; statusEl.style.color = '#16a34a'; }
      if (btn) { btn.style.background = '#16a34a'; btn.textContent = '✅ Lido'; btn.disabled = true; btn.style.cursor = 'default'; }
      if (icon) { icon.style.background = '#bbf7d0'; icon.textContent = '✅'; }
      const cb = document.getElementById('agend-decl-check');
      const lbl = document.getElementById('agend-decl-check-label');
      if (cb) { cb.disabled = false; cb.style.pointerEvents = ''; }
      if (lbl) { lbl.style.opacity = '1'; lbl.style.cursor = 'pointer'; }
      window._declCheckUnlock();
    };
    window.agendShowTermosContent();
  };

  // ─── Format helpers ───────────────────────────────────────
  window.agendFormatCpf = function (el) {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    el.value = v;
  };

  function _validarCpf(cpf) {
    const d = cpf.replace(/\D/g, '');
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    let s = 0;
    for (let i = 0; i < 9; i++) s += +d[i] * (10 - i);
    let r = (s * 10) % 11; if (r >= 10) r = 0;
    if (r !== +d[9]) return false;
    s = 0;
    for (let i = 0; i < 10; i++) s += +d[i] * (11 - i);
    r = (s * 10) % 11; if (r >= 10) r = 0;
    return r === +d[10];
  }

  function _validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  window.agendFormatPhone = function (el) {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    el.value = v;
  };

  // ─── CEP format + ViaCEP lookup ──────────────────────────
  let _cepTimeout = null;
  window.agendFormatCep = function (el) {
    let v = el.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    el.value = v;
    clearTimeout(_cepTimeout);
    const digits = v.replace(/\D/g, '');
    const status = document.getElementById('agend-cep-status');
    if (digits.length === 8) {
      if (status) { status.textContent = 'Buscando...'; status.style.color = '#1a6cff'; }
      _cepTimeout = setTimeout(() => window.agendBuscaCep(digits), 400);
    } else {
      if (status) { status.textContent = ''; }
      ['agend-rua','agend-bairro','agend-cidade','agend-uf'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
    }
  };
  window.agendBuscaCep = async function (cep) {
    const status = document.getElementById('agend-cep-status');
    try {
      const res = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
      const data = await res.json();
      if (data.erro) {
        if (status) { status.textContent = '❌ CEP não encontrado'; status.style.color = '#dc2626'; }
        ['agend-rua','agend-bairro','agend-cidade','agend-uf'].forEach(id => {
          const el = document.getElementById(id); if (el) el.value = '';
        });
        return;
      }
      const rua = document.getElementById('agend-rua');
      const bairro = document.getElementById('agend-bairro');
      const cidade = document.getElementById('agend-cidade');
      const uf = document.getElementById('agend-uf');
      if (rua) rua.value = data.logradouro || '';
      if (bairro) bairro.value = data.bairro || '';
      if (cidade) cidade.value = data.localidade || '';
      if (uf) uf.value = data.uf || '';
      if (status) { status.textContent = '✅ Endereço encontrado'; status.style.color = '#16a34a'; }
      const numEl = document.getElementById('agend-numero');
      if (numEl && !numEl.value) setTimeout(() => numEl.focus(), 100);
    } catch {
      if (status) { status.textContent = '⚠️ Erro ao buscar CEP'; status.style.color = '#f59e0b'; }
    }
  };

  // ─── Step 1: Load products ────────────────────────────────
  async function loadProdutos() {
    try {
      const res = await fetch('/api/produtos'); produtos = await res.json();
    } catch { produtos = []; }
    const grid = document.getElementById('agend-produtos');
    grid.innerHTML = '';
    // Filter out Mac Mini and inactive
    const active = produtos.filter(p => p.ativo !== false && p.nome.toLowerCase() !== 'macmini');
    if (!active.length) { grid.innerHTML = '<p style="font-size:13px;color:#999">Nenhum dispositivo configurado.</p>'; return; }
    // Sort by desired order: iPhone, MacBook, Apple Watch, iPad, iMac
    const DEVICE_ORDER = ['iphone', 'macbook', 'apple watch', 'ipad', 'imac'];
    active.sort((a, b) => {
      const ai = DEVICE_ORDER.findIndex(o => a.nome.toLowerCase().includes(o));
      const bi = DEVICE_ORDER.findIndex(o => b.nome.toLowerCase().includes(o));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    active.forEach(p => {
      const card = document.createElement('div');
      card.className = 'agend-card-big';
      card.id = 'agend-prod-card-' + p.id;
      card.innerHTML = `
        <div class="agend-card-big-img-wrap">
          ${p.imagem ? `<img loading="lazy" src="${p.imagem}" class="agend-card-big-img" alt="${p.nome}">` : `<div class="agend-card-big-placeholder">${agendDeviceEmoji(p.nome)}</div>`}
        </div>
        <div class="agend-card-big-label">${p.nome}</div>
        <div style="border-top:1px solid #f0eeeb;padding:7px 8px;text-align:center" onclick="event.stopPropagation()">
          <button data-fp="produto_id" data-fi="${p.id}" data-fn="${p.nome.replace(/"/g, '&quot;')}" onclick="window.agendShowCardFaq(this.dataset.fp,this.dataset.fi,this.dataset.fn)" style="background:none;border:none;cursor:pointer;font-size:11px;color:#1a6cff;font-family:Inter,sans-serif;font-weight:600;display:inline-flex;align-items:center;gap:4px"><i class="fa-solid fa-circle-question" style="font-size:10px"></i> Saiba mais</button>
        </div>`;
      card.onclick = () => window.agendMarcarProduto(p);
      grid.appendChild(card);
    });
    // Add "Notebook em geral" card at the end
    let _nbCfg = { nome: 'Notebook em geral', imagem: '' };
    try { const r = await fetch('/api/notebook-config'); _nbCfg = await r.json(); } catch {}
    const nbCard = document.createElement('div');
    nbCard.className = 'agend-card-big';
    nbCard.id = 'agend-prod-card-notebook';
    const _nbNomeEsc = (_nbCfg.nome || 'Notebook em geral').replace(/"/g, '&quot;');
    nbCard.innerHTML = `
      <div class="agend-card-big-img-wrap">
        ${_nbCfg.imagem ? `<img loading="lazy" src="${_nbCfg.imagem}" class="agend-card-big-img" alt="${_nbNomeEsc}">` : `<div class="agend-card-big-placeholder">💻</div>`}
      </div>
      <div class="agend-card-big-label">${_nbCfg.nome || 'Notebook em geral'}</div>
      <div style="border-top:1px solid #f0eeeb;padding:7px 8px;text-align:center" onclick="event.stopPropagation()">
        <button data-fp="notebook_id" data-fi="1" data-fn="${_nbNomeEsc}" onclick="window.agendShowCardFaq(this.dataset.fp,this.dataset.fi,this.dataset.fn)" style="background:none;border:none;cursor:pointer;font-size:11px;color:#1a6cff;font-family:Inter,sans-serif;font-weight:600;display:inline-flex;align-items:center;gap:4px"><i class="fa-solid fa-circle-question" style="font-size:10px"></i> Saiba mais</button>
      </div>`;
    nbCard.onclick = () => window.agendSelectNotebook();
    grid.appendChild(nbCard);
  }

  function agendDeviceEmoji(nome) {
    const n = nome.toLowerCase();
    if (n.includes('iphone')) return '📱';
    if (n.includes('ipad')) return '📟';
    if (n.includes('watch')) return '⌚';
    if (n.includes('mac') || n.includes('book')) return '💻';
    return '📱';
  }

  // ─── Notebook em geral ────────────────────────────────────
  window.agendSelectNotebook = async function() {
    isNotebook = true;
    notebookSel = { modelo: '', servico: '', descricao: '', preco: 0, tipoSolicitacao: 'agendamento' };
    // Get notebook config for name
    let _nbNome = 'Notebook em geral';
    try { const r = await fetch('/api/notebook-config'); const c = await r.json(); _nbNome = c.nome || _nbNome; } catch {}
    sel.produto = { nome: _nbNome };
    sel.grupo = null; sel.modelo = null; sel.servico = null; sel.opcao = null;
    document.querySelectorAll('.agend-card-big').forEach(c => c.classList.remove('selected'));
    const nbCard = document.getElementById('agend-prod-card-notebook');
    if (nbCard) nbCard.classList.add('selected');
    // Load notebook service types
    try {
      const res = await fetch('/api/notebook-servicos');
      notebookServicos = (await res.json()).filter(s => s.ativo !== false);
    } catch { notebookServicos = []; }
    _showSub1('notebook');
    // Populate service dropdown
    const selEl = document.getElementById('agend-nb-servico');
    if (selEl) {
      selEl.innerHTML = '<option value="">— Selecione o tipo de serviço —</option>';
      notebookServicos.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.nome; opt.textContent = s.nome; opt.dataset.nbSvcId = s.id;
        opt.dataset.nbSvcPreco = s.preco || 0;
        selEl.appendChild(opt);
      });
      selEl.onchange = function() {
        const nbFaqBtn = document.getElementById('agend-nb-servico-faq');
        const nbPrecoDisplay = document.getElementById('agend-nb-preco-display');
        const selected = this.options[this.selectedIndex];
        const svcId = selected && selected.dataset.nbSvcId;
        const svcPreco = selected && parseFloat(selected.dataset.nbSvcPreco || 0);
        if (nbFaqBtn) {
          nbFaqBtn.style.display = (svcId && this.value) ? '' : 'none';
          if (svcId) { nbFaqBtn.dataset.svcId = svcId; nbFaqBtn.dataset.svcNome = this.value; }
        }
        if (nbPrecoDisplay) {
          if (svcPreco > 0) {
            const priceFormatted = svcPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const isDiagService = (this.value || '').toLowerCase().match(/diagn|or[çc]amento/);
            const prefix = isDiagService ? '' : 'a partir de: ';
            nbPrecoDisplay.innerHTML = prefix + priceFormatted + '<div style="margin-top:5px;font-size:11px;font-weight:600;color:#dc2626;padding:2px 0">⚠️ valores podem mudar após análise técnica na assistência</div>';
            nbPrecoDisplay.style.display = '';
          } else {
            nbPrecoDisplay.style.display = 'none';
          }
        }
      };
    }
    // Reset fields
    const nbModelo = document.getElementById('agend-nb-modelo');
    if (nbModelo) nbModelo.value = '';
    const nbDesc = document.getElementById('agend-nb-descricao');
    if (nbDesc) nbDesc.value = '';
    const nbNome = document.getElementById('agend-nb-nome');
    if (nbNome) nbNome.value = '';
    const nbCpf = document.getElementById('agend-nb-cpf');
    if (nbCpf) nbCpf.value = '';
    const nbEmailDirect = document.getElementById('agend-nb-email-direct');
    if (nbEmailDirect) nbEmailDirect.value = '';
    const nbCelular = document.getElementById('agend-nb-celular');
    if (nbCelular) nbCelular.value = '';
  };

  window.nbSelectTipo = function(tipo) {
    notebookSel.tipoSolicitacao = tipo;
    document.querySelectorAll('input[name="nb-tipo"]').forEach(r => { r.checked = r.value === tipo; });
    const optA = document.getElementById('nb-opt-agendar');
    const optO = document.getElementById('nb-opt-orcamento');
    if (optA) optA.classList.toggle('selected', tipo === 'agendamento');
    if (optO) optO.classList.toggle('selected', tipo === 'orcamento');
  };

  window.nbContinuar = async function() {
    const modelo = (document.getElementById('agend-nb-modelo')?.value || '').trim();
    const servico = (document.getElementById('agend-nb-servico')?.value || '').trim();
    const descricao = (document.getElementById('agend-nb-descricao')?.value || '').trim();
    const nome = (document.getElementById('agend-nb-nome')?.value || '').trim();
    const cpf = (document.getElementById('agend-nb-cpf')?.value || '').trim();
    const email = (document.getElementById('agend-nb-email-direct')?.value || '').trim();
    const celular = (document.getElementById('agend-nb-celular')?.value || '').trim();
    if (!modelo) { alert('Informe o modelo do notebook.'); return; }
    if (!servico) { alert('Selecione o tipo de serviço.'); return; }
    if (!nome) { alert('Informe seu nome completo.'); return; }
    if (!celular) { alert('Informe seu celular / WhatsApp.'); return; }
    if (email && !_validarEmail(email)) { alert('E-mail inválido. Verifique e tente novamente.'); return; }
    const selectedSvcOpt = document.getElementById('agend-nb-servico')?.selectedOptions[0];
    const preco = parseFloat(selectedSvcOpt?.dataset?.nbSvcPreco) || 0;
    // Store notebook contact data for later use
    notebookSel.modelo = modelo;
    notebookSel.servico = servico;
    notebookSel.descricao = descricao;
    notebookSel.preco = preco;
    notebookSel.nome = nome;
    notebookSel.cpf = cpf;
    notebookSel.email = email;
    notebookSel.celular = celular;
    notebookSel.tipoSolicitacao = 'agendamento';
    // Pre-fill step 3 hidden fields for review/submit
    const nomeField = document.getElementById('agend-nome');
    if (nomeField) nomeField.value = nome;
    const wppField = document.getElementById('agend-whatsapp');
    if (wppField) wppField.value = celular;
    const nbEmailField = document.getElementById('agend-nb-email');
    if (nbEmailField) nbEmailField.value = email;
    // Go to step 2 (calendar) for date/time selection
    showStep(2);
    await loadCalendarMonth();
    renderCalendar();
  };

  window.agendStep3Back = function() {
    if (isNotebook && notebookSel.tipoSolicitacao === 'orcamento') {
      // Orçamento: back to notebook sub-step (step 1)
      _showSub1('notebook');
      showStep(1);
    } else {
      // Agendamento (notebook or normal): back to date/time (step 2)
      showStep(2);
    }
  };

  window.agendStep4Back = function() {
    if (isNotebook) {
      // Notebook: back to calendar (step 2), skip step 3
      showStep(2);
    } else {
      // Regular: back to contact data (step 3)
      showStep(3);
    }
  };

  window.agendMarcarProduto = async function(p) {
    // Brief visual feedback then auto-advance
    document.querySelectorAll('.agend-card-big').forEach(c => c.classList.remove('selected'));
    const card = document.getElementById('agend-prod-card-' + p.id);
    if (card) card.classList.add('selected');
    // Auto-advance to model/service selection
    await selectProduto(p);
  };

  window.agendConfirmarProduto = async function() {
    if (!sel.produto) return;
    await selectProduto(sel.produto);
  };

  async function selectProduto(p) {
    sel.produto = p; sel.grupo = null; sel.modelo = null; sel.servico = null; sel.opcao = null;
    try {
      const res = await fetch('/api/modelos?produto_id=' + p.id); modelosData = await res.json();
    } catch { modelosData = []; }
    const activeModels = modelosData.filter(m => m.ativo !== false);
    if (activeModels.length > 0) {
      // Check if any model has a 'grupo' defined — use 2-step selection if so
      const gruposSet = new Set();
      activeModels.forEach(m => { if (m.grupo) gruposSet.add(m.grupo); });
      const grupos = Array.from(gruposSet);
      if (grupos.length > 1) {
        // Multiple series → show group selector first
        _showSub1('grupo');
        const titleEl = document.getElementById('agend-grupo-title');
        if (titleEl) titleEl.textContent = 'Qual a série do ' + p.nome + '?';
        renderGrupoCards(grupos, activeModels);
      } else {
        // No grouping or single group → go directly to model dropdown
        _showSub1('modelo');
        const titleEl = document.getElementById('agend-modelo-title');
        if (titleEl) titleEl.textContent = 'Qual o modelo do ' + p.nome + '?';
        renderModeloCards(activeModels);
      }
    } else {
      sel.modelo = null;
      await loadServicos(p.id);
    }
  }

  function renderGrupoCards(grupos, allActiveModels) {
    const container = document.getElementById('agend-grupos-cards');
    if (!container) return;
    container.innerHTML = '';
    grupos.forEach(g => {
      const modelsInGroup = allActiveModels.filter(m => m.grupo === g);
      const card = document.createElement('button');
      card.style.cssText = 'width:100%;text-align:left;padding:14px 16px;border-radius:14px;border:1.5px solid #e0ddd9;background:#fff;cursor:pointer;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:space-between;transition:all .15s;';
      card.innerHTML = `<span style="font-size:14px;font-weight:700;color:#1a1a1a">${g}</span><span style="font-size:12px;color:#bbb">${modelsInGroup.length > 1 ? modelsInGroup.length + ' modelos' : ''} →</span>`;
      card.onmouseover = () => { card.style.borderColor = '#1a6cff'; card.style.background = '#f0f4ff'; };
      card.onmouseout = () => { card.style.borderColor = '#e0ddd9'; card.style.background = '#fff'; };
      card.onclick = () => selectGrupo(g, modelsInGroup);
      container.appendChild(card);
    });
  }

  async function selectGrupo(grupoNome, modelsInGroup) {
    sel.grupo = grupoNome;
    if (!modelsInGroup) {
      modelsInGroup = modelosData.filter(m => m.ativo !== false && m.grupo === grupoNome);
    }
    if (modelsInGroup.length === 1) {
      // Only one model in this series → skip modelo step and go directly
      await selectModelo(modelsInGroup[0]);
    } else {
      _showSub1('modelo');
      const titleEl = document.getElementById('agend-modelo-title');
      if (titleEl) titleEl.textContent = 'Qual o modelo ' + grupoNome + '?';
      renderModeloCards(modelsInGroup);
    }
  }

  function renderModeloCards(modelos) {
    const container = document.getElementById('agend-modelos-cards');
    if (!container) return;
    const sel$ = document.createElement('select');
    sel$.className = 'agend-input';
    sel$.style.fontSize = '14px';
    sel$.innerHTML = '<option value="">— Escolher modelo —</option>';
    modelos.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.nome;
      sel$.appendChild(opt);
    });
    sel$.onchange = () => {
      const m = modelos.find(x => x.id === sel$.value);
      if (m) selectModelo(m);
    };
    container.innerHTML = '';
    container.appendChild(sel$);
  }

  async function selectModelo(m) {
    sel.modelo = m;
    await loadServicos(m.id);
  }

  async function loadServicos(modeloId) {
    try {
      const res = await fetch('/api/servicos?modelo_id=' + modeloId); servicosData = await res.json();
    } catch { servicosData = []; }
    _showSub1('servico');
    const list = document.getElementById('agend-servicos');
    list.innerHTML = '';
    const active = servicosData.filter(s => s.ativo !== false);
    if (!active.length) { list.innerHTML = '<p style="font-size:13px;color:#999">Nenhum serviço disponível.</p>'; return; }

    const LIMIT = 6;
    const principais = active.slice(0, LIMIT);
    const extras = active.slice(LIMIT);

    function buildServicoCard(s) {
      const card = document.createElement('div');
      card.className = 'agend-card';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'stretch';
      card.style.gap = '0';
      card.style.padding = '0';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:12px 14px">
          <div class="agend-card-icon"><img src="/images/maca.png" alt="" style="width:16px;height:16px;object-fit:contain"></div>
          <p style="font-size:13px;font-weight:700;margin:0;color:#1a1a1a;flex:1">${s.nome}</p>
          <span style="font-size:12px;color:#bbb">→</span>
        </div>
        <div style="border-top:1px solid #f0eeeb;padding:6px 0;display:flex;justify-content:center" onclick="event.stopPropagation()">
          <button data-fp="servico_id" data-fi="${s.id}" data-fn="${s.nome.replace(/"/g, '&quot;')}" onclick="window.agendShowCardFaq(this.dataset.fp,this.dataset.fi,this.dataset.fn)" style="background:none;border:none;cursor:pointer;font-size:11px;color:#1a6cff;font-family:Inter,sans-serif;font-weight:600;display:inline-flex;align-items:center;gap:4px"><i class="fa-solid fa-circle-question" style="font-size:10px"></i> Saiba mais</button>
        </div>`;
      card.onclick = () => selectServico(s);
      return card;
    }

    principais.forEach(s => list.appendChild(buildServicoCard(s)));

    if (extras.length) {
      // "Outros Serviços" expandable button
      const outrosBtn = document.createElement('button');
      outrosBtn.id = 'agend-outros-servicos-btn';
      outrosBtn.style.cssText = 'width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 16px;background:#f5f5f7;border:1.5px dashed #d0ccc8;border-radius:14px;cursor:pointer;font-size:13px;font-weight:700;color:#555;font-family:Inter,sans-serif;margin-top:2px;transition:background .2s';
      outrosBtn.innerHTML = '<i class="fa-solid fa-chevron-down" style="font-size:11px;color:#1a6cff"></i> Mais Serviços';
      outrosBtn.onmouseenter = () => { outrosBtn.style.background = '#ebebed'; };
      outrosBtn.onmouseleave = () => { outrosBtn.style.background = '#f5f5f7'; };

      const extrasWrap = document.createElement('div');
      extrasWrap.style.cssText = 'display:none;flex-direction:column;gap:8px;margin-top:2px';
      extras.forEach(s => extrasWrap.appendChild(buildServicoCard(s)));

      outrosBtn.onclick = () => {
        extrasWrap.style.display = 'flex';
        outrosBtn.style.display = 'none';
      };

      list.appendChild(outrosBtn);
      list.appendChild(extrasWrap);
    }
  }

  async function selectServico(s) {
    sel.servico = s; sel.opcao = null; opcoesData = []; faqServicoData = [];
    // Show opcao step immediately with loading state
    _showSub1('opcao');
    document.getElementById('agend-opcao-title').textContent = s.nome;
    document.getElementById('agend-opcao-subtitle').textContent = 'Escolha a qualidade da peça para ' + s.nome.toLowerCase();
    const list = document.getElementById('agend-opcoes');
    list.innerHTML = '<p style="font-size:13px;color:#999;text-align:center;padding:20px 0">Carregando opções...</p>';
    try {
      const [opcoesRes, faqRes] = await Promise.all([
        fetch('/api/opcoes?servico_id=' + s.id),
        fetch('/api/faq?servico_id=' + s.id)
      ]);
      try { const d = await opcoesRes.json(); opcoesData = Array.isArray(d) ? d : []; } catch { opcoesData = []; }
      try { const d = await faqRes.json(); faqServicoData = Array.isArray(d) ? d : []; } catch { faqServicoData = []; }
    } catch { opcoesData = []; faqServicoData = []; }

    let activeOpcoes = opcoesData.filter(o => o.ativo !== false);
    // Se o serviço não tem opções cadastradas, usar as 3 opções padrão
    if (!activeOpcoes.length) {
      activeOpcoes = [
        { id: null, nome: 'Standard', descricao: 'Peça genérica de bom custo-benefício', preco: 0, ativo: true },
        { id: null, nome: 'Original', descricao: 'Componente no padrão OEM de fábrica', preco: 0, ativo: true },
        { id: null, nome: 'Premium', descricao: 'Melhor versão disponível — cores, toque e durabilidade superiores', preco: 0, ativo: true }
      ];
    }
    list.innerHTML = '';
    activeOpcoes.forEach(o => {
      const preco = o.preco ? parseFloat(o.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
      const isPremium = o.nome.toLowerCase().includes('premium');
      const isOriginal = o.nome.toLowerCase().includes('original');
      const icon = isPremium ? '⭐' : isOriginal ? '✓' : '◈';
      const iconBg = isPremium ? '#fff8e1' : isOriginal ? '#e8f5e9' : '#e8eeff';
      const iconColor = isPremium ? '#f59e0b' : isOriginal ? '#22c55e' : '#1a6cff';
      const card = document.createElement('div');
      card.className = 'agend-card';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'stretch';
      card.style.gap = '4px';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px">
          <div class="agend-card-icon" style="background:${iconBg};color:${iconColor}">${icon}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px">
              <p style="font-size:13px;font-weight:700;margin:0;color:#1a1a1a">${o.nome}</p>

            </div>
            ${preco ? `<p style="font-size:12px;font-weight:700;color:#1a6cff;margin:2px 0 0">${preco}</p>` : ''}
          </div>
        </div>
        ${o.descricao ? `<p style="font-size:12px;color:#888;margin:4px 0 0 44px">${o.descricao}</p>` : ''}
        ${o.tempo_estimado ? `<p style="font-size:11px;color:#bbb;margin:2px 0 0 44px">⏱ ${o.tempo_estimado}</p>` : ''}
        ${o.id ? `<div style="border-top:1px solid #f0eeeb;padding:6px 14px;margin-top:4px" onclick="event.stopPropagation()"><button data-fp="opcao_id" data-fi="${o.id}" data-fn="${o.nome.replace(/"/g, '&quot;')}" onclick="window.agendShowCardFaq(this.dataset.fp,this.dataset.fi,this.dataset.fn)" style="background:none;border:none;cursor:pointer;font-size:11px;color:#1a6cff;font-family:Inter,sans-serif;font-weight:600;display:inline-flex;align-items:center;gap:4px"><i class="fa-solid fa-circle-question" style="font-size:10px"></i> Saiba mais</button></div>` : ''}`;
      card.onclick = async () => {
        sel.opcao = o;
        const goCalendar = async () => {
          showStep(2);
          await loadCalendarMonth();
          renderCalendar();
        };
        if (o.declaracoes && o.declaracoes.length) {
          window._agendStartDeclaracoes(o.declaracoes, null, goCalendar);
        } else {
          await goCalendar();
        }
      };
      list.appendChild(card);
    });
  }

  // ─── Step 2: Availability fetch ───────────────────────────
  async function loadCalendarMonth() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    try {
      const res = await fetch(`/api/disponibilidade?ano=${year}&mes=${month}`);
      const data = await res.json();
      calAvailability = {};
      data.forEach(d => { calAvailability[d.data] = { disponivel: d.disponivel, tipo: d.tipo || null, motivo: d.motivo || null, lotado: d.lotado || false }; });
    } catch { calAvailability = {}; }
  }

  // ─── Step 2: Calendar ────────────────────────────────────
  function renderCalendar() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const year = currentMonth.getFullYear(), month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const todayStr = formatDate(today);

    let html = `
      <div style="background:#f9f9fb;border-radius:16px;padding:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <button onclick="window.agendPrevMonth()" style="width:32px;height:32px;border-radius:10px;background:#fff;border:1px solid #e8e8ea;cursor:pointer;font-size:16px">‹</button>
          <span style="font-size:14px;font-weight:700">${monthNames[month]} ${year}</span>
          <button onclick="window.agendNextMonth()" style="width:32px;height:32px;border-radius:10px;background:#fff;border:1px solid #e8e8ea;cursor:pointer;font-size:16px">›</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center;margin-bottom:6px">
          ${dayNames.map(d => `<div style="font-size:11px;font-weight:600;color:#aaa;padding:3px">${d}</div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center">`;

    for (let i = 0; i < firstDay; i++) html += `<div class="agend-cal-day empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      const dateStr = formatDate(dt);
      const isPast = dt < today;
      const isToday = dateStr === todayStr;
      const isSelected = sel.data === dateStr;
      const info = calAvailability[dateStr] || {};
      const avail = info.disponivel;
      const tipo = info.tipo;
      const motivo = info.motivo;
      const lotado = info.lotado;

      let cls = 'agend-cal-day';
      let titleAttr = '';
      if (isSelected) {
        cls += ' selected';
        if (tipo === 'excecao') cls += ' excecao';
      } else if (isPast) {
        cls += ' past';
      } else if (tipo === 'bloqueado') {
        // Admin bloqueou este dia — vermelho, inclicavel
        cls += ' blocked';
        if (motivo) titleAttr = '🚫 ' + motivo;
      } else if (tipo === 'excecao') {
        // Dia de exceção — laranja; se lotado, fica apagado
        cls += avail ? ' excecao' : ' excecao unavailable';
        if (motivo) titleAttr = '⚠️ ' + motivo;
      } else if (avail === true) {
        cls += isToday ? ' available today' : ' available';
      } else if (lotado) {
        // Todos os horários já foram reservados — vermelho claro
        cls += ' unavailable';
        titleAttr = 'Lotado';
      } else {
        // Dia sem horários configurados (folga) — cinza
        cls += isToday ? ' no-slots today' : ' no-slots';
      }

      const clickable = !isPast && avail === true;
      const titleHtml = titleAttr ? ` title="${titleAttr.replace(/"/g, '&quot;')}"` : '';
      html += `<div class="${cls}"${titleHtml} ${clickable ? `onclick="window.agendSelectDate('${dateStr}')"` : ''}>${d}</div>`;
    }
    // Legenda
    html += `</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:10px;padding-top:10px;border-top:1px solid #f0eeeb">
        <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#666"><span style="width:13px;height:13px;border-radius:4px;background:#dbeafe;display:inline-block;flex-shrink:0"></span>Disponível</span>
        <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#666"><span style="width:13px;height:13px;border-radius:4px;background:#fed7aa;box-shadow:inset 0 0 0 2px #fb923c;display:inline-block;flex-shrink:0"></span>Exceção</span>
        <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#666"><span style="width:13px;height:13px;border-radius:4px;background:#fecaca;display:inline-block;flex-shrink:0"></span>Bloqueado</span>
        <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#666"><span style="width:13px;height:13px;border-radius:4px;background:#fee2e2;display:inline-block;flex-shrink:0"></span>Lotado</span>
        <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#666"><span style="width:13px;height:13px;border-radius:4px;background:#f5f5f5;display:inline-block;flex-shrink:0"></span>Sem atendimento</span>
      </div></div>`;
    document.getElementById('agend-calendar').innerHTML = html;
  }

  function formatDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  window.agendPrevMonth = async function () {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    await loadCalendarMonth();
    renderCalendar();
  };
  window.agendNextMonth = async function () {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    await loadCalendarMonth();
    renderCalendar();
  };

  window.agendSelectDate = async function (dateStr) {
    sel.data = dateStr; sel.horario = null;
    renderCalendar();
    const horariosSec = document.getElementById('agend-horarios-section');
    horariosSec.style.display = '';

    // Banner de exceção — cria uma vez, reutiliza
    let excBanner = document.getElementById('agend-excecao-banner');
    if (!excBanner) {
      excBanner = document.createElement('div');
      excBanner.id = 'agend-excecao-banner';
      excBanner.style.cssText = 'display:none;background:#fff7ed;border:1.5px solid #fbbf24;color:#92400e;border-radius:12px;padding:11px 14px;font-size:12px;line-height:1.5;margin-bottom:14px';
      horariosSec.insertBefore(excBanner, horariosSec.firstChild);
    }
    const excInfo = calAvailability[dateStr];
    if (excInfo && excInfo.tipo === 'excecao') {
      excBanner.innerHTML = `<strong style="font-size:12px">⚠️ Atenção — dia especial:</strong><br>${excInfo.motivo || 'Este dia possui uma observação do administrador.'}`;
      excBanner.style.display = '';
    } else {
      excBanner.style.display = 'none';
    }

    const grid = document.getElementById('agend-horarios');
    grid.innerHTML = '<p style="font-size:13px;color:#999">Carregando...</p>';
    try {
      const res = await fetch('/api/horarios-disponiveis?data=' + dateStr);
      const result = await res.json();
      if (result.bloqueado) {
        grid.innerHTML = '<p style="font-size:13px;color:#999">Este dia está bloqueado' + (result.motivo ? ': ' + result.motivo : '') + '.</p>';
        return;
      }
      availableSlots = result.horarios || [];
    } catch { availableSlots = []; }
    grid.innerHTML = '';
    if (!availableSlots.length) { grid.innerHTML = '<p style="font-size:13px;color:#999">Nenhum horário disponível nesta data.</p>'; return; }
    availableSlots.forEach(entry => {
      const h = typeof entry === 'string' ? entry : entry.horario;
      const ocupado = typeof entry === 'object' && entry.ocupado;
      const slot = document.createElement('div');
      slot.className = 'agend-time-slot' + (ocupado ? ' ocupado' : '');
      slot.textContent = h.slice(0, 5);
      if (ocupado) {
        slot.title = 'Horário indisponível';
      } else {
        slot.onclick = () => {
          sel.horario = h;
          grid.querySelectorAll('.agend-time-slot').forEach(s => s.classList.remove('selected'));
          slot.classList.add('selected');
          setTimeout(() => {
            if (isNotebook) {
              // Notebook: skip step 3, go directly to review
              buildReview();
              showStep(4);
            } else {
              showStep(3);
            }
          }, 300);
        };
      }
      grid.appendChild(slot);
    });
  };

  // ─── Step 4: Review ──────────────────────────────────────
  function buildReview() {
    // Always reset submit button when entering review step
    const submitBtn = document.getElementById('agend-submit-btn');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Prosseguir →'; }
    const errDiv = document.getElementById('agend-submit-error');
    if (errDiv) errDiv.style.display = 'none';

    let items;
    if (isNotebook) {
      const tipoLabel = notebookSel.tipoSolicitacao === 'orcamento' ? 'Orçamento online' : 'Agendamento';
      const dateFormatted = sel.data ? new Date(sel.data + 'T12:00:00').toLocaleDateString('pt-BR') : '';
      const isDiagNb = (notebookSel.servico || '').toLowerCase().match(/diagn|or[çc]amento/);
      const nbPreco = notebookSel.preco || 0;
      const nbPrecoStr = nbPreco > 0 ? (isDiagNb ? '' : 'a partir de ') + nbPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null;
      items = [
        { l: 'Dispositivo', v: 'Notebook em geral' },
        { l: 'Modelo', v: notebookSel.modelo },
        { l: 'Serviço', v: notebookSel.servico },
        notebookSel.descricao ? { l: 'Descrição do defeito', v: notebookSel.descricao } : null,
        nbPrecoStr ? { l: 'Valor estimado', v: nbPrecoStr } : null,
        { l: 'Tipo', v: tipoLabel },
        notebookSel.tipoSolicitacao === 'agendamento' ? { l: 'Data', v: dateFormatted } : null,
        notebookSel.tipoSolicitacao === 'agendamento' && sel.horario ? { l: 'Horário', v: sel.horario.slice(0, 5) } : null,
        { l: 'Nome', v: notebookSel.nome || document.getElementById('agend-nome').value.trim() },
        { l: 'E-mail', v: notebookSel.email || (document.getElementById('agend-nb-email')?.value || '').trim() },
        { l: 'WhatsApp', v: notebookSel.celular || document.getElementById('agend-whatsapp').value.trim() }
      ].filter(Boolean);
    } else {
      const preco = sel.opcao && sel.opcao.preco ? parseFloat(sel.opcao.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
      const dateFormatted = sel.data ? new Date(sel.data + 'T12:00:00').toLocaleDateString('pt-BR') : '';
      const rua = (document.getElementById('agend-rua')?.value || '').trim();
      const numero = (document.getElementById('agend-numero')?.value || '').trim();
      const complemento = (document.getElementById('agend-complemento')?.value || '').trim();
      const bairro = (document.getElementById('agend-bairro')?.value || '').trim();
      const cidade = (document.getElementById('agend-cidade')?.value || '').trim();
      const uf = (document.getElementById('agend-uf')?.value || '').trim();
      const cep = (document.getElementById('agend-cep')?.value || '').trim();
      let enderecoStr = '';
      if (rua) enderecoStr += rua;
      if (numero) enderecoStr += ', ' + numero;
      if (complemento) enderecoStr += ' - ' + complemento;
      if (bairro) enderecoStr += ', ' + bairro;
      if (cidade) enderecoStr += ' — ' + cidade;
      if (uf) enderecoStr += '/' + uf;
      items = [
        { l: 'Dispositivo', v: sel.produto ? sel.produto.nome : '' },
        sel.modelo ? { l: 'Modelo', v: sel.modelo.nome } : null,
        { l: 'Serviço', v: sel.servico ? sel.servico.nome : '' },
        sel.opcao && sel.opcao.nome !== '---' ? { l: 'Qualidade', v: sel.opcao.nome } : null,
        preco ? { l: 'Valor estimado', v: preco } : null,
        { l: 'Data', v: dateFormatted },
        { l: 'Horário', v: sel.horario ? sel.horario.slice(0, 5) : '' },
        { l: 'Nome', v: document.getElementById('agend-nome').value.trim() },
        { l: 'CPF', v: document.getElementById('agend-cpf').value.trim() },
        { l: 'E-mail', v: document.getElementById('agend-email').value.trim() },
        { l: 'WhatsApp', v: document.getElementById('agend-whatsapp').value.trim() },
        cep ? { l: 'CEP', v: cep } : null,
        enderecoStr ? { l: 'Endereço', v: enderecoStr } : null
      ].filter(Boolean);
    }
    document.getElementById('agend-review').innerHTML = items.filter(i => i.v).map(i =>
      `<div class="agend-review-row"><span style="color:#888">${i.l}</span><span style="font-weight:700;color:#1a1a1a">${i.v}</span></div>`
    ).join('');
  }

  // ─── Submit ──────────────────────────────────────────────
  window.agendSubmit = async function () {
    const btn = document.getElementById('agend-submit-btn');
    const errDiv = document.getElementById('agend-submit-error');
    errDiv.style.display = 'none';
    btn.disabled = true; btn.textContent = 'Enviando...';

    try {
      // ── NOTEBOOK: envio direto via WhatsApp para número específico ──
      if (isNotebook) {
        const nome = notebookSel.nome || document.getElementById('agend-nome').value.trim();
        const celular = notebookSel.celular || document.getElementById('agend-whatsapp').value.trim();
        const email = notebookSel.email || '';
        const cpf = notebookSel.cpf || '';
        const modelo = notebookSel.modelo || '';
        const servico = notebookSel.servico || '';
        const descricao = notebookSel.descricao || '';
        const preco = notebookSel.preco || 0;
        const SEP = '────────────────────';
        const isDiag = servico.toLowerCase().match(/diagn|or[çc]amento/);
        const precoStr = preco > 0 ? preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A confirmar';
        const precoFieldLabel = isDiag ? 'Taxa' : 'Valor estimado';
        const dataFmt = sel.data ? new Date(sel.data + 'T12:00:00').toLocaleDateString('pt-BR') : '';
        const horaFmt = sel.horario ? sel.horario.slice(0, 5) : '';
        let msg = '💻 *SOLICITAÇÃO DE AGENDAMENTO – NOTEBOOK*\n\n';
        msg += 'Recebemos sua solicitação de agendamento para atendimento técnico.\n\n';
        msg += '⚠️ *Importante:* Este agendamento é apenas uma solicitação e está sujeito à análise e confirmação da nossa equipe. Não compareça sem confirmação prévia.\n\n';
        msg += SEP + '\n';
        msg += '👤 *DADOS DO CLIENTE*\n';
        msg += 'Nome: ' + nome + '\n';
        msg += 'Telefone: ' + celular + '\n';
        if (email) msg += 'E-mail: ' + email + '\n';
        if (cpf) msg += 'CPF: ' + cpf + '\n';
        msg += SEP + '\n';
        msg += '💻 *EQUIPAMENTO E SERVIÇO*\n';
        msg += 'Equipamento: ' + modelo + '\n';
        msg += 'Serviço: ' + servico + '\n';
        msg += precoFieldLabel + ': ' + precoStr + '\n';
        if (dataFmt || horaFmt) {
          msg += SEP + '\n';
          msg += '📅 *PREFERÊNCIA DE ATENDIMENTO*\n';
          if (dataFmt) msg += 'Data: ' + dataFmt + '\n';
          if (horaFmt) msg += 'Horário: ' + horaFmt + '\n';
        }
        if (descricao) {
          msg += SEP + '\n';
          msg += '📝 *DESCRIÇÃO*\n';
          msg += descricao + '\n';
        }
        msg += SEP + '\n\n';
        msg += 'Em breve entraremos em contato para confirmação do agendamento.';
        // Enviar via backend (evita expor API key no browser)
        const nbBody = {
          produto_nome: 'Notebook',
          modelo_nome: modelo,
          servico_nome: servico,
          opcao_nome: '---',
          opcao_preco: preco,
          data: sel.data || null,
          horario: sel.horario || null,
          nome: nome,
          cpf: cpf || '',
          email: email || '',
          whatsapp: celular,
          descricao_defeito: descricao,
          tipo_solicitacao: notebookSel.tipoSolicitacao || 'agendamento'
        };
        const res = await fetch('/api/agendamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nbBody)
        });
        if (!res.ok) throw new Error('Erro ao enviar solicitação. Tente novamente.');
        btn.disabled = false; btn.textContent = 'Prosseguir →';
        // Fechar modal e mostrar sucesso específico notebook
        window.closeAgendamento();
        var nbSuccessOvl = document.getElementById('agend-terms-overlay');
        if (nbSuccessOvl) {
          var nbBox = document.getElementById('agend-terms-box');
          if (nbBox) {
            nbBox.innerHTML = '<div style="text-align:center;margin-bottom:20px">' +
              '<div style="width:56px;height:56px;border-radius:50%;background:#e8f5e9;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:24px">✓</div>' +
              '<h3 style="font-size:18px;font-weight:800;margin:0 0 4px;color:#1a1a1a">Solicitação enviada!</h3>' +
              '<p style="font-size:13px;color:#888;margin:0">Recebemos seu agendamento para <strong>' + modelo + '</strong></p>' +
            '</div>' +
            '<div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:16px;padding:16px;margin-bottom:18px">' +
              '<p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 10px">⚠️ Aviso importante</p>' +
              '<ul style="font-size:12px;color:#78350f;line-height:1.9;margin:0;padding-left:16px">' +
                '<li><strong>NÃO compareça à loja antes de receber a confirmação do agendamento.</strong></li>' +
                '<li>Entraremos em contato via WhatsApp para confirmar dia e horário.</li>' +
                '<li>O orçamento final pode variar após análise técnica presencial.</li>' +
                '<li>Dúvidas? WhatsApp <strong>(19) 99406-3782</strong></li>' +
              '</ul>' +
            '</div>' +
            '<button onclick="window.agendCloseTerms()" style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;" onmouseover="this.style.background=\'#0057e6\'" onmouseout="this.style.background=\'#1a6cff\'">Entendido, fechar</button>';
          }
          nbSuccessOvl.classList.add('terms-open');
        }
        return;
      }
      // ── DISPOSITIVOS APPLE: fluxo normal via backend + admin ──
      let body;
      const rua = (document.getElementById('agend-rua')?.value || '').trim();
      const num = (document.getElementById('agend-numero')?.value || '').trim();
      const comp = (document.getElementById('agend-complemento')?.value || '').trim();
      const bairro = (document.getElementById('agend-bairro')?.value || '').trim();
      const cidadeVal = (document.getElementById('agend-cidade')?.value || '').trim();
      const ufVal = (document.getElementById('agend-uf')?.value || '').trim();
      const cepVal = (document.getElementById('agend-cep')?.value || '').replace(/\D/g, '');
      body = {
        produto_nome: sel.produto ? sel.produto.nome : '',
        modelo_nome: sel.modelo ? sel.modelo.nome : '',
        servico_nome: sel.servico ? sel.servico.nome : '',
        opcao_nome: sel.opcao ? sel.opcao.nome : '---',
        opcao_preco: sel.opcao ? sel.opcao.preco : 0,
        opcao_descricao: sel.opcao ? sel.opcao.descricao || '' : '',
        data: sel.data,
        horario: sel.horario,
        nome: document.getElementById('agend-nome').value.trim(),
        cpf: document.getElementById('agend-cpf').value.trim(),
        email: document.getElementById('agend-email').value.trim(),
        whatsapp: document.getElementById('agend-whatsapp').value.trim(),
        cep: cepVal,
        endereco_rua: rua,
        endereco_numero: num,
        endereco_complemento: comp,
        endereco_bairro: bairro,
        endereco_cidade: cidadeVal,
        endereco_uf: ufVal,
        ciente_aviso_peca: true,
        tipo_solicitacao: 'agendamento'
      };
      // Append terms acceptance data if available
      if (window._termosAceiteData) {
        Object.assign(body, window._termosAceiteData);
        window._termosAceiteData = null;
      }

      // ── Asaas PIX payment — intercept only when pagamento_parcial is enabled ──
      const precoNum   = parseFloat(body.opcao_preco) || 0;
      const isOrcamento = body.tipo_solicitacao === 'orcamento';
      if (sel.opcao?.pagamento_parcial === true && precoNum > 0 && !isOrcamento) {
        btn.textContent = 'Gerando PIX...';
        const asaasRes = await fetch('/api/asaas/criar-cobranca', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking_data: body, preco_total: precoNum })
        });
        if (!asaasRes.ok) {
          const d = await asaasRes.json().catch(() => ({}));
          throw new Error(d.error || d.message || 'Erro ao gerar pagamento PIX. Verifique se a chave Asaas está configurada.');
        }
        const pixData = await asaasRes.json();
        window.closeAgendamento();
        window.agendShowPix(pixData);
        btn.disabled = false; btn.textContent = 'Prosseguir →';
        return;
      }
      // ────────────────────────────────────────────────────────

      const res = await fetch('/api/agendamentos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) {
        const d = await res.json();
        if (d.error === 'slot_taken') {
          // Horário tomado entre a seleção e o envio — voltar ao calendário
          sel.horario = null; sel.data = null;
          showStep(2);
          await loadCalendarMonth();
          renderCalendar();
          document.getElementById('agend-horarios-section').style.display = 'none';
          // Show banner inside step 2
          const msg = document.createElement('div');
          msg.style.cssText = 'background:#fef2f2;color:#dc2626;font-size:13px;padding:12px 16px;border-radius:12px;margin-bottom:14px;font-weight:600;border:1.5px solid #fecaca';
          msg.textContent = '⚠️ Este horário foi reservado instantes antes de você. Por favor, escolha outro.';
          const step2 = document.querySelector('.agend-step[data-step="2"]');
          if (step2) step2.insertBefore(msg, step2.firstChild);
          setTimeout(() => msg.remove(), 8000);
          btn.disabled = false; btn.textContent = 'Prosseguir →';
          return;
        }
        throw new Error(d.message || d.error || 'Erro ao agendar');
      }
      // Close booking modal and show terms/success popup
      window.closeAgendamento();
      const saved = await res.json();
      window._agendWhatsappLink = saved.whatsappLink || null;

      const termsOvl = document.getElementById('agend-terms-overlay');
      if (termsOvl) termsOvl.classList.add('terms-open');
    } catch (err) {
      errDiv.textContent = 'Erro: ' + err.message;
      errDiv.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Prosseguir →';
    }
  };

  // ─── PIX overlay handlers ────────────────────────────────
  let _pixPollTimer = null;
  let _pixCountdownTimer = null;

  window.agendShowPix = function(pixData) {
    window._agendCurrentPixId = pixData.payment_id;

    // Populate values
    const legenda = document.getElementById('agend-pix-valor-legenda');
    if (legenda) {
      const ent = parseFloat(pixData.valor_entrada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const tot = parseFloat(pixData.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      legenda.textContent = `Entrada: ${ent} (20% de ${tot})`;
    }

    // QR Code image (base64)
    const qrImg = document.getElementById('agend-pix-qr');
    if (qrImg && pixData.pix_qrcode_image) {
      qrImg.src = 'data:image/png;base64,' + pixData.pix_qrcode_image;
      qrImg.style.display = 'block';
    }

    // PIX code
    const codeTxt = document.getElementById('agend-pix-code-txt');
    if (codeTxt) codeTxt.textContent = pixData.pix_code || '—';
    window._agendCurrentPixCode = pixData.pix_code || '';

    // Invoice link (link de pagamento)
    const linkEl = document.getElementById('agend-pix-link');
    const linkCopyBtn = document.getElementById('agend-pix-link-copy');
    window._agendCurrentPixLink = pixData.invoice_url || '';
    if (linkEl && pixData.invoice_url) {
      linkEl.href = pixData.invoice_url;
      linkEl.style.display = 'block';
    }
    if (linkCopyBtn && pixData.invoice_url) linkCopyBtn.style.display = 'block';

    // Reset to waiting state
    const statusEl = document.getElementById('agend-pix-status');
    const successEl = document.getElementById('agend-pix-success');
    const avisEl = document.getElementById('agend-pix-aviso');
    const codeWrap = document.getElementById('agend-pix-code-wrap');
    if (statusEl) { statusEl.style.display = 'block'; statusEl.textContent = '⏳ Aguardando pagamento...'; statusEl.style.color = '#888'; }
    if (successEl) successEl.style.display = 'none';
    if (avisEl) avisEl.style.display = 'block';
    if (codeWrap) codeWrap.style.display = 'flex';
    if (qrImg) qrImg.style.display = pixData.pix_qrcode_image ? 'block' : 'none';

    // Countdown 30 min
    let secondsLeft = 30 * 60;
    const countdownEl = document.getElementById('agend-pix-countdown');
    function updateCountdown() {
      if (!countdownEl) return;
      if (secondsLeft <= 0) { countdownEl.textContent = 'PIX expirado.'; return; }
      const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
      const s = (secondsLeft % 60).toString().padStart(2, '0');
      countdownEl.textContent = `Expira em: ${m}:${s}`;
      secondsLeft--;
    }
    updateCountdown();
    clearInterval(_pixCountdownTimer);
    _pixCountdownTimer = setInterval(updateCountdown, 1000);

    // Start polling
    clearInterval(_pixPollTimer);
    _pixPollTimer = setInterval(async function() {
      try {
        const r = await fetch('/api/asaas/status/' + window._agendCurrentPixId);
        if (!r.ok) return;
        const d = await r.json();
        if (d.status === 'pago' || d.status === 'CONFIRMED' || d.status === 'RECEIVED') {
          clearInterval(_pixPollTimer); clearInterval(_pixCountdownTimer);
          if (statusEl) statusEl.style.display = 'none';
          if (countdownEl) countdownEl.style.display = 'none';
          if (avisEl) avisEl.style.display = 'none';
          if (codeWrap) codeWrap.style.display = 'none';
          if (qrImg) qrImg.style.display = 'none';
          if (linkEl) linkEl.style.display = 'none';
          if (linkCopyBtn) linkCopyBtn.style.display = 'none';
          if (successEl) successEl.style.display = 'block';
          // Redirecionar para index após 4 segundos
          setTimeout(function() { window.location.href = '/index.html'; }, 4000);
        }
      } catch(e) { /* silent */ }
    }, 3000);

    // Show overlay
    const ovl = document.getElementById('agend-pix-overlay');
    if (ovl) ovl.classList.add('pix-open');
  };

  window.agendClosePix = function(reopen) {
    clearInterval(_pixPollTimer); clearInterval(_pixCountdownTimer);
    const ovl = document.getElementById('agend-pix-overlay');
    if (ovl) ovl.classList.remove('pix-open');
    // Reopen agend modal at step 4 (revisar dados) when closing without payment
    if (reopen) {
      const agendOvl = document.getElementById('agend-overlay');
      if (agendOvl) agendOvl.classList.add('agend-open');
      window.agendGoStep(4);
    }
  };

  window.agendPixCopyLink = function() {
    const link = window._agendCurrentPixLink || '';
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      const btn = document.getElementById('agend-pix-link-copy');
      if (btn) { const orig = btn.textContent; btn.textContent = '✓ Link copiado!'; setTimeout(() => btn.textContent = orig, 2500); }
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = link; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    });
  };

  window.agendPixCopyCodigo = function() {
    const code = window._agendCurrentPixCode || '';
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.getElementById('agend-pix-copy-btn');
      if (btn) { const orig = btn.textContent; btn.textContent = '✓ Copiado!'; setTimeout(() => btn.textContent = orig, 2000); }
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    });
  };

})();
