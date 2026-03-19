// ═══════════════════════════════════════════════════════════
// iPro Agendamento — Multi-step booking form modal
// Fluxo: Produto → Modelo (dropdown) → Serviço (+ FAQ) →
//        Opção/Qualidade → Data (calendário azul/vermelho)
//        → Horário → Dados → Revisão → Termos popup
// ═══════════════════════════════════════════════════════════
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
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <h2 id="agend-title" style="font-size:16px;font-weight:800;margin:0;color:#1a1a1a;letter-spacing:-.2px">Selecione o serviço</h2>
          <button onclick="window.agendShowGuide()" style="font-size:11px;color:#1a6cff;background:#f0f4ff;border:none;cursor:pointer;font-family:Inter,sans-serif;font-weight:700;display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border-radius:20px;flex-shrink:0;margin-left:8px" onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#f0f4ff'">&#9432; Como funciona?</button>
        </div>
        <div id="agend-progress" class="agend-progress"></div>
        <div style="height:1px;background:#f0eeeb;margin-top:10px"></div>
      </div>
      <div class="agend-body">
        <!-- Step 1: Produto → Modelo → Serviço → Opção -->
        <div class="agend-step agend-active" data-step="1">
          <div id="agend-sub1-produto" style="padding-top:20px"></div>
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
    // Step 1: Modelo
    const modeloDiv = document.getElementById('agend-sub1-modelo');
    if (modeloDiv) {
      modeloDiv.innerHTML = `
        <button class="agend-back-btn" onclick="window.agendBack('produto')">← Voltar</button>
        <div class="agend-step-header">
          <h3 id="agend-modelo-title">Qual o modelo?</h3>
        </div>
        <p style="font-size:12px;color:#aaa;margin-bottom:14px">Selecione o modelo do seu dispositivo</p>
        <select id="agend-modelo-select" class="agend-input" style="margin-bottom:10px" onchange="window.agendModeloSelected(this.value,this.options[this.selectedIndex].text)">
          <option value="">— Selecione o modelo —</option>
        </select>
        <div id="agend-modelo-faq-link" style="display:none;margin-bottom:10px">
          <button onclick="window.agendShowFaqModelo()" style="background:none;border:none;cursor:pointer;font-size:12px;color:#1a6cff;font-family:Inter,sans-serif;font-weight:600;text-align:left;padding:0;display:inline-flex;align-items:center;gap:4px">
            <i class="fa-solid fa-circle-question" style="font-size:11px"></i> Saiba mais sobre este modelo
          </button>
        </div>
        <button id="agend-modelo-btn" onclick="window.agendConfirmarModelo()" disabled
          style="width:100%;padding:13px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:not-allowed;font-family:Inter,sans-serif;opacity:.4;transition:all .2s">
          Continuar →
        </button>
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
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Fale mais sobre o defeito</label>
            <textarea id="agend-nb-descricao" class="agend-input" rows="3" placeholder="Descreva o problema que está enfrentando com o notebook..." style="resize:vertical;min-height:70px"></textarea>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em">Como deseja prosseguir? *</label>
            <div style="display:flex;flex-direction:column;gap:8px">
              <label class="nb-radio-option selected" id="nb-opt-agendar" onclick="window.nbSelectTipo('agendamento')">
                <input type="radio" name="nb-tipo" value="agendamento" checked>
                <div><div class="nb-radio-label">📅 Quero agendar o atendimento</div><div class="nb-radio-desc">Escolha data e horário para levar seu notebook</div></div>
              </label>
              <label class="nb-radio-option" id="nb-opt-orcamento" onclick="window.nbSelectTipo('orcamento')">
                <input type="radio" name="nb-tipo" value="orcamento">
                <div><div class="nb-radio-label">💰 Quero o orçamento online</div><div class="nb-radio-desc">Receba o orçamento diretamente pelo WhatsApp</div></div>
              </label>
            </div>
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
        <button class="agend-back-btn" onclick="window.agendGoStep(3)">← Voltar</button>
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
      faqOvl.innerHTML = `<div id="agend-faq-box"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px"><h3 id="agend-faq-title" style="font-size:17px;font-weight:800;margin:0;color:#1a1a1a"></h3><button onclick="window.agendCloseFaq()" style="width:32px;height:32px;border-radius:50%;background:#f5f5f7;border:none;cursor:pointer;font-size:14px;color:#888">✕</button></div><div id="agend-faq-items"></div></div>`;
      document.body.appendChild(faqOvl);
      faqOvl.addEventListener('click', e => { if (e.target === faqOvl) window.agendCloseFaq(); });
    }

    // Reset all booking state for fresh start
    step = 1;
    sel = { produto: null, modelo: null, servico: null, opcao: null, data: null, horario: null, cienteAvisoPeca: null };
    isNotebook = false;
    notebookSel = { modelo: '', servico: '', descricao: '', tipoSolicitacao: 'agendamento' };
    currentMonth = new Date();
    calAvailability = {};
    produtos = []; modelosData = []; servicosData = []; opcoesData = []; faqServicoData = [];
    notebookServicos = [];
    // Start booking flow
    showStep(1);
    loadProdutos();
  };

  // ─── State ────────────────────────────────────────────────
  let step = 1;
  let produtos = [], modelosData = [], servicosData = [], opcoesData = [], faqServicoData = [];
  let sel = { produto: null, modelo: null, servico: null, opcao: null, data: null, horario: null, cienteAvisoPeca: null };
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
    #agend-box{background:#fff;border-radius:28px;width:100%;max-width:640px;max-height:93vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,.3);transform:scale(.95) translateY(12px);transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .3s}
    #agend-overlay.agend-open #agend-box{transform:scale(1) translateY(0)}
    .agend-header{padding:22px 24px 0;position:sticky;top:0;background:#fff;z-index:2;border-radius:28px 28px 0 0}
    .agend-body{padding:0 24px 32px}
    .agend-step{display:none}.agend-step.agend-active{display:block;animation:agendFade .28s ease}
    @keyframes agendFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .agend-progress{display:block;margin-bottom:14px}
    .agend-progress-dot{width:8px;height:8px;border-radius:50%;background:#e0ddd9;transition:all .25s}
    .agend-progress-dot.active{background:#1a6cff;width:24px;border-radius:4px}
    .agend-progress-dot.done{background:#1a6cff}
    .agend-section-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#aaa;margin-bottom:14px}
    .agend-card{border:2px solid transparent;border-radius:16px;padding:14px 16px;cursor:pointer;transition:all .18s;background:#f7f7f8;display:flex;align-items:center;gap:12px}
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
    .nb-radio-option input[type="radio"]{accent-color:#1a6cff;width:18px;height:18px;cursor:pointer}
    .nb-radio-label{font-size:14px;font-weight:700;color:#1a1a1a}
    .nb-radio-desc{font-size:12px;color:#888;margin-top:2px}
    .agend-guide-step{display:flex;align-items:flex-start;gap:14px;padding:6px 0}
    .agend-guide-num{width:28px;height:28px;border-radius:50%;background:#1a6cff;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
    .agend-guide-title{font-size:14px;font-weight:700;color:#1a1a1a;margin:0 0 3px}
    .agend-guide-desc{font-size:12px;color:#777;line-height:1.6;margin:0}
    .agend-guide-line{width:1.5px;height:16px;background:#e8e8ea;margin:0 0 0 13px}
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
          <div id="agend-sub1-modelo" style="display:none;padding-top:20px">
            <button class="agend-back-btn" onclick="window.agendBack('produto')">← Voltar</button>
            <div class="agend-step-header">
              <h3 id="agend-modelo-title">Qual o modelo?</h3>
            </div>
            <p style="font-size:12px;color:#bbb;margin:4px 0 16px">Selecione o modelo do seu dispositivo</p>
            <select id="agend-modelo-select" class="agend-input" style="margin-bottom:14px" onchange="window.agendModeloSelected(this.value,this.options[this.selectedIndex].text)">
              <option value="">— Selecione o modelo —</option>
            </select>
            <div id="agend-modelo-faq-link" style="display:none;margin-bottom:14px">
              <button onclick="window.agendShowFaqModelo()" style="background:none;border:none;cursor:pointer;font-size:12px;color:#1a6cff;font-family:Inter,sans-serif;font-weight:600;text-align:left;padding:0;display:inline-flex;align-items:center;gap:4px">
                <i class="fa-solid fa-circle-question" style="font-size:11px"></i> Saiba mais sobre este modelo
              </button>
            </div>
            <button id="agend-modelo-btn" onclick="window.agendConfirmarModelo()" disabled
              style="width:100%;padding:14px;border-radius:14px;background:#1a6cff;color:#fff;font-size:14px;font-weight:700;border:none;cursor:not-allowed;font-family:Inter,sans-serif;opacity:.4;transition:all .2s">
              Continuar →
            </button>
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
              </div>
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em">Fale mais sobre o defeito</label>
                <textarea id="agend-nb-descricao" class="agend-input" rows="3" placeholder="Descreva o problema que está enfrentando com o notebook..." style="resize:vertical;min-height:70px"></textarea>
              </div>
              <div>
                <label style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em">Como deseja prosseguir? *</label>
                <div style="display:flex;flex-direction:column;gap:8px">
                  <label class="nb-radio-option selected" id="nb-opt-agendar" onclick="window.nbSelectTipo('agendamento')">
                    <input type="radio" name="nb-tipo" value="agendamento" checked>
                    <div>
                      <div class="nb-radio-label">📅 Quero agendar o atendimento</div>
                      <div class="nb-radio-desc">Escolha data e horário para levar seu notebook</div>
                    </div>
                  </label>
                  <label class="nb-radio-option" id="nb-opt-orcamento" onclick="window.nbSelectTipo('orcamento')">
                    <input type="radio" name="nb-tipo" value="orcamento">
                    <div>
                      <div class="nb-radio-label">💰 Quero o orçamento online</div>
                      <div class="nb-radio-desc">Receba o orçamento diretamente pelo WhatsApp</div>
                    </div>
                  </label>
                </div>
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
          <button class="agend-back-btn" onclick="window.agendGoStep(3)">← Voltar</button>
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
          <label style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;border:2px solid #e8e8ea;cursor:pointer;transition:all .2s;background:#fafafa" class="agend-termos-check-label">
            <input type="checkbox" id="agend-check-agendamento" style="accent-color:#1a6cff;width:18px;height:18px;margin-top:2px;flex-shrink:0" onchange="window._termosCheckChanged()">
            <span style="font-size:13px;color:#1a1a1a;line-height:1.5">Eu concordo com os <a href="javascript:void(0)" onclick="event.preventDefault();event.stopPropagation();window.agendShowTermosContent()" style="color:#1a6cff;font-weight:700;text-decoration:underline">termos de agendamento e pagamento</a></span>
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
        <div class="termos-body" style="font-family:Inter,sans-serif">
          <h2>1. Identificação da Empresa</h2>
          <p>A <strong>iPro Assistência Técnica Apple</strong> é uma empresa especializada em manutenção e reparo de dispositivos Apple, inscrita no CNPJ sob o nº <strong>32.819.954/0001-17</strong>, com sede na Rua Jorge Krug, 69 – Vila Itapura, Campinas/SP – CEP 13023-210.</p>
          <p>A iPro é uma assistência técnica independente e <strong>não possui vínculo, parceria ou autorização oficial da Apple Inc.</strong> Os serviços prestados são de natureza técnica independente, realizados por profissionais qualificados.</p>

          <h2>2. Objeto dos Serviços</h2>
          <p>Os serviços prestados pela iPro incluem, mas não se limitam a: diagnóstico, manutenção preventiva e corretiva, reparo de hardware e software, troca de componentes, limpeza técnica, backup e migração de dados, atualização de sistemas operacionais e instalação de acessórios em dispositivos da marca Apple (iPhone, iPad, MacBook, iMac, Mac Mini, Apple Watch e similares).</p>
          <p>Os serviços disponíveis e seus respectivos valores são apresentados no site e no sistema de agendamento online, podendo ser atualizados a qualquer momento sem aviso prévio.</p>

          <h2>3. Agendamento e Atendimento</h2>
          <p><strong>3.1.</strong> O atendimento na iPro é realizado <strong>exclusivamente mediante agendamento prévio</strong>, que pode ser feito pelo site ou via WhatsApp.</p>
          <p><strong>3.2.</strong> O agendamento confirma a reserva de um horário específico. O cliente deve comparecer no horário agendado com tolerância máxima de <strong>15 minutos</strong>. Atrasos superiores poderão resultar no cancelamento automático do agendamento.</p>
          <p><strong>3.3.</strong> Cancelamentos ou remarcações devem ser solicitados com antecedência mínima de <strong>2 horas</strong> do horário agendado, via WhatsApp.</p>
          <p><strong>3.4.</strong> O horário de funcionamento é de segunda a sexta-feira, das 10h às 12h e das 13h30 às 16h30, exceto feriados.</p>

          <h2>4. Diagnóstico e Orçamento</h2>
          <p><strong>4.1.</strong> Todo serviço é precedido de um diagnóstico técnico para identificação precisa do problema. O diagnóstico pode ser realizado presencialmente ou de forma remota (para questões de software).</p>
          <p><strong>4.2.</strong> Os valores apresentados no site são <strong>estimativas</strong> baseadas nos serviços padrão. O orçamento final pode variar após o diagnóstico técnico presencial, caso sejam identificados problemas adicionais ou necessidade de peças específicas.</p>
          <p><strong>4.3.</strong> Diagnósticos que necessitem de desmontagem ou análise aprofundada poderão ter custo, informado previamente ao cliente.</p>

          <h2>5. Aprovação do Serviço</h2>
          <p><strong>5.1.</strong> Nenhum serviço será executado sem a <strong>aprovação expressa do cliente</strong>, seja presencial, via WhatsApp ou pelo sistema de agendamento online.</p>
          <p><strong>5.2.</strong> A aprovação do orçamento pelo sistema de agendamento online, incluindo a aceitação dos termos mediante fornecimento de nome completo e CPF, constitui <strong>aceite digital válido e vinculante</strong>, nos termos da legislação brasileira.</p>
          <p><strong>5.3.</strong> Após aprovação, o cliente autoriza a iPro a realizar o serviço descrito no orçamento.</p>

          <h2>6. Peças e Componentes</h2>
          <p><strong>6.1.</strong> A iPro utiliza peças de alta qualidade para todos os reparos. Dependendo da disponibilidade e do tipo de serviço, as peças podem ser <strong>originais Apple, originais removidas (seminovas em perfeito estado) ou compatíveis de alta qualidade</strong>.</p>
          <p><strong>6.2.</strong> O tipo de peça utilizada será informado ao cliente <strong>antes da execução do serviço</strong>. O cliente tem o direito de recusar o serviço caso não concorde com o tipo de peça oferecida.</p>
          <p><strong>6.3.</strong> Peças substituídas que forem removidas do dispositivo não serão devolvidas ao cliente, salvo solicitação expressa no momento da aprovação do serviço.</p>

          <h2>7. Peças Originais e Compatíveis</h2>
          <p><strong>7.1.</strong> <strong>Peças originais Apple:</strong> são componentes fabricados pela Apple ou por seus fornecedores autorizados. Oferecem máxima compatibilidade e funcionalidade com o ecossistema Apple, incluindo recursos como True Tone, Face ID e calibração de bateria.</p>
          <p><strong>7.2.</strong> <strong>Peças compatíveis de alta qualidade:</strong> são componentes produzidos por fabricantes terceiros, com especificações técnicas equivalentes ou próximas às originais. <strong>Alguns recursos exclusivos da Apple podem não funcionar</strong> com peças compatíveis (exemplo: True Tone, notificações de peça desconhecida, calibração automática de bateria).</p>
          <p><strong>7.3.</strong> Ao optar por peças compatíveis, o cliente declara estar ciente de que: (a) o dispositivo poderá exibir avisos de "peça desconhecida" ou "não genuína" nas configurações do sistema; (b) determinadas funcionalidades software-dependentes podem ser limitadas; (c) a iPro não se responsabiliza por limitações impostas por atualizações futuras do sistema operacional da Apple.</p>
          <p><strong>7.4.</strong> A escolha entre peça original e compatível, quando disponível, será sempre do cliente, mediante orientação técnica da iPro.</p>

          <h2>8. Garantia dos Serviços</h2>
          <p><strong>8.1.</strong> Todos os serviços realizados pela iPro possuem garantia mínima de <strong>90 (noventa) dias</strong>, contados a partir da data de entrega do equipamento ao cliente, conforme o Código de Defesa do Consumidor (Lei nº 8.078/1990).</p>
          <p><strong>8.2.</strong> A garantia cobre exclusivamente o serviço realizado e a peça substituída, ou seja, o <strong>mesmo defeito no mesmo componente</strong>. Defeitos em outros componentes ou decorrentes de causas diversas não são cobertos.</p>
          <p><strong>8.3.</strong> Para acionar a garantia, o cliente deve entrar em contato via WhatsApp e agendar um retorno para avaliação técnica.</p>

          <h2>9. Exclusões de Garantia</h2>
          <p>A garantia não se aplica nos seguintes casos:</p>
          <ul>
            <li>Danos causados por mau uso, quedas, impacto, pressão excessiva ou contato com líquidos após o reparo</li>
            <li>Tentativa de reparo por terceiros ou pelo próprio cliente após o serviço</li>
            <li>Violação dos lacres ou sinais de adulteração do equipamento</li>
            <li>Danos causados por variações de energia elétrica, curto-circuito ou descarga atmosférica</li>
            <li>Defeitos decorrentes de atualização de software ou sistema operacional realizada pelo cliente após o serviço</li>
            <li>Oxidação, corrosão ou danos por contato com líquidos (se o serviço original não foi tratamento de oxidação)</li>
            <li>Desgaste natural de componentes (bateria, borrachas, adesivos, etc.)</li>
            <li>Equipamentos com sinais de manipulação indevida, componentes não originais instalados por terceiros ou histórico de reparos anteriores não informados</li>
          </ul>

          <h2>10. Prazo de Execução</h2>
          <p><strong>10.1.</strong> O prazo estimado para cada serviço é informado no momento do agendamento e pode variar conforme a complexidade do reparo e a disponibilidade de peças.</p>
          <p><strong>10.2.</strong> Muitos serviços são realizados no <strong>mesmo dia</strong> (reparos rápidos como troca de tela, bateria, etc.). Serviços mais complexos podem demandar prazo adicional, que será comunicado ao cliente.</p>
          <p><strong>10.3.</strong> A iPro não se responsabiliza por atrasos decorrentes de falta de peças no mercado, greves de transportadoras ou outros eventos de força maior.</p>

          <h2>11. Formas de Pagamento</h2>
          <p><strong>11.1.</strong> O pagamento é realizado <strong>na retirada do equipamento</strong>, após a conclusão do serviço. Não é cobrado valor antecipado, salvo em casos específicos que necessitem encomenda de peças especiais (informado previamente).</p>
          <p><strong>11.2.</strong> São aceitas as seguintes formas de pagamento: <strong>Pix, dinheiro, cartão de débito e cartão de crédito</strong> (à vista ou parcelado, conforme disponibilidade).</p>
          <p><strong>11.3.</strong> Os valores dos serviços incluem mão de obra e peças, salvo indicação em contrário no orçamento.</p>

          <h2>12. Política de Cancelamento</h2>
          <p><strong>12.1.</strong> O cliente pode cancelar o agendamento a qualquer momento antes do início do serviço, <strong>sem custo</strong>.</p>
          <p><strong>12.2.</strong> Caso o serviço já tenha sido iniciado e o cliente deseje cancelar, poderão ser cobrados os custos de diagnóstico e mão de obra já empregada.</p>
          <p><strong>12.3.</strong> Se o cliente reprovar o orçamento após o diagnóstico, o equipamento será remontado e devolvido. Poderá haver cobrança de taxa de diagnóstico, se aplicável e previamente informada.</p>

          <h2>13. Responsabilidade sobre o Dispositivo</h2>
          <p><strong>13.1.</strong> A iPro se responsabiliza pelo dispositivo do cliente enquanto este estiver em sua posse, comprometendo-se a tratá-lo com o máximo cuidado técnico.</p>
          <p><strong>13.2.</strong> A iPro <strong>não se responsabiliza por dados, arquivos, fotos, vídeos, senhas ou qualquer conteúdo armazenado no dispositivo</strong>. É de responsabilidade exclusiva do cliente realizar backup antes de entregar o equipamento.</p>
          <p><strong>13.3.</strong> Casos, capinhas, películas, carregadores e acessórios não fazem parte do serviço e devem ser retirados pelo cliente antes da entrega do dispositivo.</p>

          <h2>14. Retirada do Equipamento</h2>
          <p><strong>14.1.</strong> O cliente será notificado via WhatsApp quando o serviço for concluído. A retirada deve ser feita no prazo máximo de <strong>30 (trinta) dias</strong> após a notificação de conclusão.</p>
          <p><strong>14.2.</strong> O equipamento só será entregue ao titular do agendamento ou a pessoa autorizada mediante apresentação de documento de identificação.</p>

          <h2>15. Abandono de Equipamento</h2>
          <p><strong>15.1.</strong> O equipamento não retirado no prazo de <strong>90 (noventa) dias</strong> após a notificação de conclusão do serviço será considerado abandonado, nos termos do art. 1.263 do Código Civil Brasileiro.</p>
          <p><strong>15.2.</strong> A iPro enviará ao menos 2 (duas) notificações via WhatsApp antes de considerar o equipamento abandonado. Após o prazo, a iPro poderá dar a destinação que julgar adequada ao equipamento, sem direito a indenização por parte do cliente.</p>

          <h2>16. Backup e Dados Pessoais</h2>
          <p><strong>16.1.</strong> É <strong>responsabilidade exclusiva do cliente</strong> realizar o backup de todos os dados, fotos, vídeos, contatos, mensagens e demais conteúdos armazenados no dispositivo antes de entregá-lo para reparo.</p>
          <p><strong>16.2.</strong> Alguns serviços podem resultar na formatação total do dispositivo (reinstalação de sistema, troca de placa lógica, etc.). Nesses casos, o cliente será informado previamente.</p>
          <p><strong>16.3.</strong> A iPro oferece serviço de backup e migração de dados como serviço avulso, mediante agendamento e pagamento específico.</p>

          <h2>17. Privacidade e LGPD</h2>
          <p><strong>17.1.</strong> Os dados pessoais coletados durante o agendamento (nome, CPF, e-mail, WhatsApp, endereço e IP) são utilizados exclusivamente para a prestação do serviço contratado, comunicação com o cliente e cumprimento de obrigações legais.</p>
          <p><strong>17.2.</strong> A iPro compromete-se a tratar os dados em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>, adotando medidas técnicas e organizacionais adequadas para proteger os dados contra acesso não autorizado, destruição, perda ou alteração.</p>
          <p><strong>17.3.</strong> Os dados pessoais não serão compartilhados com terceiros, exceto quando necessário para o cumprimento de obrigações legais ou por determinação judicial.</p>
          <p><strong>17.4.</strong> O cliente pode solicitar a exclusão de seus dados pessoais a qualquer momento, entrando em contato via WhatsApp ou e-mail, respeitados os prazos legais de guarda obrigatória.</p>

          <h2>18. Assinatura Digital e Aceite Eletrônico</h2>
          <p><strong>18.1.</strong> Ao confirmar o agendamento pelo sistema online, o cliente fornece seu nome completo e CPF como forma de <strong>assinatura digital</strong>, declarando ter lido, compreendido e aceito integralmente os presentes Termos e Condições.</p>
          <p><strong>18.2.</strong> Este aceite eletrônico possui <strong>validade jurídica</strong> nos termos da Medida Provisória nº 2.200-2/2001, que institui a Infraestrutura de Chaves Públicas Brasileira (ICP-Brasil) e reconhece a validade de documentos eletrônicos.</p>
          <p><strong>18.3.</strong> São registrados para fins de comprovação: nome completo, CPF, data e hora do aceite, endereço IP do dispositivo utilizado e os termos específicos aceitos pelo cliente.</p>
          <p><strong>18.4.</strong> O cliente declara que as informações fornecidas são verdadeiras e de sua responsabilidade, respondendo civil e criminalmente por eventuais falsidades.</p>

          <h2>19. Limitação de Responsabilidade</h2>
          <p><strong>19.1.</strong> A responsabilidade da iPro está limitada ao valor do serviço contratado. Em nenhuma hipótese a iPro será responsável por lucros cessantes, danos indiretos, perda de negócios ou quaisquer danos consequenciais.</p>
          <p><strong>19.2.</strong> A iPro não se responsabiliza por defeitos pré-existentes não identificáveis sem desmontagem completa, defeitos ocultos de fabricação ou problemas decorrentes do desgaste natural do equipamento.</p>
          <p><strong>19.3.</strong> Em caso de dano acidental durante o reparo causado pela iPro, a empresa se compromete a reparar o dano ou, quando não for possível, oferecer solução equivalente ao cliente.</p>

          <h2>20. Disposições Gerais</h2>
          <p><strong>20.1.</strong> Estes Termos e Condições podem ser atualizados a qualquer momento. A versão vigente será sempre a publicada no site da iPro. É responsabilidade do cliente consultar esta página periodicamente.</p>
          <p><strong>20.2.</strong> A eventual nulidade ou inaplicabilidade de qualquer cláusula destes Termos não afetará a validade das demais disposições.</p>
          <p><strong>20.3.</strong> Estes Termos são regidos pelas leis da República Federativa do Brasil.</p>
          <p><strong>20.4.</strong> Fica eleito o foro da <strong>Comarca de Campinas/SP</strong> para dirimir quaisquer questões oriundas destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>

          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e5e5;text-align:center">
            <p style="font-size:12px;color:#888;margin:0"><strong style="color:#555">iPro Assistência Técnica Apple</strong></p>
            <p style="font-size:11px;color:#aaa;margin:4px 0 0">CNPJ: 32.819.954/0001-17 · Campinas/SP</p>
          </div>
        </div>
        <button onclick="window.agendCloseTermosContent()" style="margin-top:16px;width:100%;padding:14px;border-radius:14px;background:#1a1a1a;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:Inter,sans-serif;transition:all .2s" onmouseover="this.style.background='#1a6cff'" onmouseout="this.style.background='#1a1a1a'">Fechar</button>
      </div>`;
      document.body.appendChild(tcOvl);
      // Close on overlay click
      tcOvl.addEventListener('click', e => { if (e.target === tcOvl) window.agendCloseTermosContent(); });
    }
  };
  window._createAgendOverlays();

  // ─── Termos Content popup handlers ─────────────────────────
  window.agendShowTermosContent = function() {
    const ol = document.getElementById('agend-termoscontent-overlay');
    if (ol) { ol.classList.add('termoscontent-open'); ol.querySelector('#agend-termoscontent-box').scrollTop = 0; }
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
    // Reset avisos popup
    document.querySelectorAll('input[name="agend-avisos-choice"]').forEach(r => r.checked = false);
    const btn = document.getElementById('agend-avisos-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '.4'; btn.style.cursor = 'not-allowed'; }
    const concordoLabel = document.getElementById('agend-avisos-concordo-label');
    const naoLabel = document.getElementById('agend-avisos-naoconcordo-label');
    if (concordoLabel) { concordoLabel.style.borderColor = '#e8e8ea'; concordoLabel.style.background = '#fafafa'; }
    if (naoLabel) { naoLabel.style.borderColor = '#e8e8ea'; naoLabel.style.background = '#fafafa'; }
    const ol = document.getElementById('agend-avisos-overlay');
    if (ol) ol.classList.add('avisos-open');
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
    // Show termos popup
    window.agendShowTermos();
  };

  window.agendShowTermos = function() {
    // Reset termos popup
    ['agend-check-garantia','agend-check-pecas','agend-check-agendamento'].forEach(id => {
      const el = document.getElementById(id); if (el) el.checked = false;
    });
    // Prefill name and CPF from form data
    const nomeEl = document.getElementById('agend-termos-nome');
    const cpfEl = document.getElementById('agend-termos-cpf');
    const formNome = document.getElementById('agend-nome');
    const formCpf = document.getElementById('agend-cpf');
    if (nomeEl && formNome) nomeEl.value = formNome.value.trim();
    if (cpfEl && formCpf) cpfEl.value = formCpf.value.trim();
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
    const stepLabels = isNbOrcamento ? ['Serviço', 'Dados', 'Revisão'] : ['Serviço', 'Data', 'Dados', 'Revisão'];
    const totalSteps = stepLabels.length;
    // Map real step to display step for nb-orcamento (1→1, 3→2, 4→3)
    let displayStep = step;
    if (isNbOrcamento) {
      if (step === 3) displayStep = 2;
      else if (step === 4) displayStep = 3;
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
    if (isNotebook) {
      const nbTitles = { 1: 'Notebook em geral', 2: 'Escolha data e horário', 3: 'Seus dados', 4: 'Revisão' };
      document.getElementById('agend-title').textContent = nbTitles[n] || 'Notebook em geral';
    } else {
      const titles = { 1: 'Selecione o serviço', 2: 'Escolha data e horário', 3: 'Seus dados', 4: 'Revisão' };
      document.getElementById('agend-title').textContent = titles[n] || 'Agendar atendimento';
    }
    document.getElementById('agend-progress').style.display = 'flex';
    // Toggle step 3 extra fields (hidden for notebook, visible for normal)
    if (n === 3) {
      const extra = document.getElementById('agend-step3-extra-fields');
      const desc = document.getElementById('agend-step3-desc');
      if (extra) extra.style.display = isNotebook ? 'none' : '';
      if (desc) desc.textContent = isNotebook ? 'Preencha para enviarmos o retorno via WhatsApp' : 'Preencha para confirmarmos seu agendamento via WhatsApp';
    }
  }

  window.agendGoStep = function (n) {
    if (n === 1) {
      if (isNotebook) {
        hideAllSub1(); document.getElementById('agend-sub1-notebook').style.display = '';
      } else if (sel.opcao && opcoesData.filter(o => o.ativo !== false).length > 0) {
        hideAllSub1(); document.getElementById('agend-sub1-opcao').style.display = '';
      } else if (sel.servico) {
        hideAllSub1(); document.getElementById('agend-sub1-servico').style.display = '';
      }
    }
    if (n === 4) {
      const nome = document.getElementById('agend-nome').value.trim();
      const wpp = document.getElementById('agend-whatsapp').value.trim();
      if (isNotebook) {
        // Notebook: only name + whatsapp required
        if (!nome || !wpp) { alert('Preencha nome e WhatsApp.'); return; }
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
        if (!email.includes('@')) { alert('E-mail inválido.'); return; }
        if (cep.length !== 8 || !cidade) { alert('Informe um CEP válido.'); return; }
        if (!numero) { alert('Informe o número do endereço.'); return; }
        buildReview();
      }
    }
    showStep(n);
  };

  function hideAllSub1() {
    ['agend-sub1-produto', 'agend-sub1-modelo', 'agend-sub1-servico', 'agend-sub1-opcao', 'agend-sub1-notebook']
      .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  }

  window.agendBack = function (to) {
    // Clear any inline FAQ expanders
    ['faq-produto-expand','faq-modelo-expand','faq-servico-expand','faq-opcao-expand'].forEach(id => {
      const el = document.getElementById(id); if (el) { el.innerHTML = ''; el.dataset.open = '0'; }
    });
    if (to === 'produto') {
      hideAllSub1();
      document.getElementById('agend-sub1-produto').style.display = '';
      sel.modelo = null; sel.servico = null; sel.opcao = null;
    } else if (to === 'modelo') {
      hideAllSub1();
      if (modelosData.filter(m => m.ativo !== false).length > 0) {
        document.getElementById('agend-sub1-modelo').style.display = '';
      } else {
        document.getElementById('agend-sub1-produto').style.display = '';
        sel.modelo = null;
      }
      sel.servico = null; sel.opcao = null;
    } else if (to === 'servico') {
      hideAllSub1();
      document.getElementById('agend-sub1-servico').style.display = '';
      sel.opcao = null;
    }
  };

  // ─── Open / Close ─────────────────────────────────────────
  window.openAgendamento = async function () {
    overlay.classList.add('agend-open');
    document.body.style.overflow = 'hidden';
    step = 1;
    sel = { produto: null, modelo: null, servico: null, opcao: null, data: null, horario: null, cienteAvisoPeca: null };
    isNotebook = false;
    notebookSel = { modelo: '', servico: '', descricao: '', tipoSolicitacao: 'agendamento' };
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
    showStep(1); // render title + progress dots immediately
    hideAllSub1();
    const subProd = document.getElementById('agend-sub1-produto');
    if (subProd) subProd.style.display = '';
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

    // Use DB items if found, else fall back to STATIC_FAQ
    let items, title;
    if (dbItems && dbItems.length) {
      items = dbItems;
      title = dynamicTitle || 'Saiba mais';
    } else {
      const staticData = STATIC_FAQ[key];
      if (!staticData) return;
      items = staticData.items;
      title = staticData.title;
    }

    // Always use popup
    showFaqItems(title, items);
  };

  window.agendShowFaqServico = async function () {
    let items = faqServicoData && faqServicoData.length ? faqServicoData : null;

    if (!items && sel.servico) {
      items = await fetchDbFaq('servico_id', sel.servico.id);
    }

    if (items && items.length) {
      const title = sel.servico ? 'Saiba mais — ' + sel.servico.nome : 'Saiba mais';
      showFaqItems(title, items);
    } else {
      window.agendShowFaq('opcao');
    }
  };

  // Per-card FAQ: generic function for any entity type
  window.agendShowCardFaq = async function (param, id, nome) {
    const items = await fetchDbFaq(param, id);
    if (items && items.length) {
      showFaqItems('Saiba mais — ' + nome, items);
    } else {
      // Fallback to static FAQ based on param type
      const keyMap = { produto_id: 'produto', modelo_id: 'modelo', servico_id: 'servico', opcao_id: 'opcao' };
      const staticData = STATIC_FAQ[keyMap[param]];
      if (staticData) showFaqItems(staticData.title, staticData.items);
    }
  };

  // Per-modelo FAQ: shown after selecting a model from dropdown
  window.agendShowFaqModelo = async function () {
    if (!sel.modelo) return;
    const items = await fetchDbFaq('modelo_id', sel.modelo.id);
    if (items && items.length) {
      showFaqItems('Saiba mais — ' + sel.modelo.nome, items);
    } else {
      const staticData = STATIC_FAQ['modelo'];
      if (staticData) showFaqItems(staticData.title, staticData.items);
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

  // ─── Format helpers ───────────────────────────────────────
  window.agendFormatCpf = function (el) {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    el.value = v;
  };

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
    notebookSel = { modelo: '', servico: '', descricao: '', tipoSolicitacao: 'agendamento' };
    // Get notebook config for name
    let _nbNome = 'Notebook em geral';
    try { const r = await fetch('/api/notebook-config'); const c = await r.json(); _nbNome = c.nome || _nbNome; } catch {}
    sel.produto = { nome: _nbNome };
    sel.modelo = null; sel.servico = null; sel.opcao = null;
    document.querySelectorAll('.agend-card-big').forEach(c => c.classList.remove('selected'));
    const nbCard = document.getElementById('agend-prod-card-notebook');
    if (nbCard) nbCard.classList.add('selected');
    // Load notebook service types
    try {
      const res = await fetch('/api/notebook-servicos');
      notebookServicos = (await res.json()).filter(s => s.ativo !== false);
    } catch { notebookServicos = []; }
    hideAllSub1();
    document.getElementById('agend-sub1-notebook').style.display = '';
    // Populate service dropdown
    const selEl = document.getElementById('agend-nb-servico');
    if (selEl) {
      selEl.innerHTML = '<option value="">— Selecione o tipo de serviço —</option>';
      notebookServicos.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.nome; opt.textContent = s.nome; opt.dataset.nbSvcId = s.id;
        selEl.appendChild(opt);
      });
      selEl.onchange = function() {
        const nbFaqBtn = document.getElementById('agend-nb-servico-faq');
        if (!nbFaqBtn) return;
        const selected = this.options[this.selectedIndex];
        const svcId = selected && selected.dataset.nbSvcId;
        nbFaqBtn.style.display = (svcId && this.value) ? '' : 'none';
        if (svcId) { nbFaqBtn.dataset.svcId = svcId; nbFaqBtn.dataset.svcNome = this.value; }
      };
    }
    // Reset fields
    const nbModelo = document.getElementById('agend-nb-modelo');
    if (nbModelo) nbModelo.value = '';
    const nbDesc = document.getElementById('agend-nb-descricao');
    if (nbDesc) nbDesc.value = '';
    // Reset radio buttons
    document.querySelectorAll('input[name="nb-tipo"]').forEach(r => { r.checked = r.value === 'agendamento'; });
    const optA = document.getElementById('nb-opt-agendar');
    const optO = document.getElementById('nb-opt-orcamento');
    if (optA) optA.classList.add('selected');
    if (optO) optO.classList.remove('selected');
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
    if (!modelo) { alert('Informe o modelo do notebook.'); return; }
    if (!servico) { alert('Selecione o tipo de serviço.'); return; }
    notebookSel.modelo = modelo;
    notebookSel.servico = servico;
    notebookSel.descricao = descricao;
    sel.modelo = { nome: modelo };
    sel.servico = { nome: servico };
    if (notebookSel.tipoSolicitacao === 'agendamento') {
      // Go to date/time selection (step 2)
      showStep(2);
      await loadCalendarMonth();
      renderCalendar();
    } else {
      // Orçamento online — skip to step 3 (simplified: just name + phone)
      showStep(3);
    }
  };

  window.agendStep3Back = function() {
    if (isNotebook && notebookSel.tipoSolicitacao === 'orcamento') {
      // Orçamento: back to notebook sub-step (step 1)
      showStep(1);
      hideAllSub1();
      document.getElementById('agend-sub1-notebook').style.display = '';
    } else {
      // Agendamento (notebook or normal): back to date/time (step 2)
      showStep(2);
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
    sel.produto = p; sel.modelo = null; sel.servico = null; sel.opcao = null;
    try {
      const res = await fetch('/api/modelos?produto_id=' + p.id); modelosData = await res.json();
    } catch { modelosData = []; }
    const activeModels = modelosData.filter(m => m.ativo !== false);
    if (activeModels.length > 0) {
      hideAllSub1();
      document.getElementById('agend-sub1-modelo').style.display = '';
      document.getElementById('agend-modelo-title').textContent = 'Qual o modelo do ' + p.nome + '?';
      const selectEl = document.getElementById('agend-modelo-select');
      selectEl.innerHTML = '<option value="">— Selecione o modelo —</option>';
      activeModels.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id; opt.textContent = m.nome; selectEl.appendChild(opt);
      });
      const btn = document.getElementById('agend-modelo-btn');
      btn.disabled = true; btn.style.opacity = '0.4'; btn.style.cursor = 'not-allowed';
    } else {
      sel.modelo = null;
      await loadServicos(p.id);
    }
  }

  window.agendModeloSelected = function (id, nome) {
    const btn = document.getElementById('agend-modelo-btn');
    const faqLink = document.getElementById('agend-modelo-faq-link');
    if (id) {
      sel.modelo = { id, nome };
      btn.disabled = false; btn.style.opacity = '1'; btn.style.cursor = 'pointer';
      if (faqLink) faqLink.style.display = '';
    } else {
      sel.modelo = null;
      btn.disabled = true; btn.style.opacity = '0.4'; btn.style.cursor = 'not-allowed';
      if (faqLink) faqLink.style.display = 'none';
    }
  };

  window.agendConfirmarModelo = async function () {
    if (!sel.modelo) return;
    await loadServicos(sel.modelo.id);
  };

  async function loadServicos(modeloId) {
    try {
      const res = await fetch('/api/servicos?modelo_id=' + modeloId); servicosData = await res.json();
    } catch { servicosData = []; }
    hideAllSub1();
    document.getElementById('agend-sub1-servico').style.display = '';
    const list = document.getElementById('agend-servicos');
    list.innerHTML = '';
    const active = servicosData.filter(s => s.ativo !== false);
    if (!active.length) { list.innerHTML = '<p style="font-size:13px;color:#999">Nenhum serviço disponível.</p>'; return; }
    active.forEach(s => {
      const card = document.createElement('div');
      card.className = 'agend-card';
      card.style.flexDirection = 'column';
      card.style.gap = '0';
      card.style.padding = '0';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:12px 14px">
          <div class="agend-card-icon">🔧</div>
          <p style="font-size:13px;font-weight:700;margin:0;color:#1a1a1a;flex:1">${s.nome}</p>
          <span style="font-size:12px;color:#bbb">→</span>
        </div>
        <div style="border-top:1px solid #f0eeeb;padding:6px 14px" onclick="event.stopPropagation()">
          <button data-fp="servico_id" data-fi="${s.id}" data-fn="${s.nome.replace(/"/g, '&quot;')}" onclick="window.agendShowCardFaq(this.dataset.fp,this.dataset.fi,this.dataset.fn)" style="background:none;border:none;cursor:pointer;font-size:11px;color:#1a6cff;font-family:Inter,sans-serif;font-weight:600;display:inline-flex;align-items:center;gap:4px"><i class="fa-solid fa-circle-question" style="font-size:10px"></i> Saiba mais</button>
        </div>`;
      card.onclick = () => selectServico(s);
      list.appendChild(card);
    });
  }

  async function selectServico(s) {
    sel.servico = s; sel.opcao = null; opcoesData = []; faqServicoData = [];
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
    hideAllSub1();
    document.getElementById('agend-sub1-opcao').style.display = '';
    document.getElementById('agend-opcao-title').textContent = s.nome;
    document.getElementById('agend-opcao-subtitle').textContent = 'Escolha a qualidade da peça para ' + s.nome.toLowerCase();
    const list = document.getElementById('agend-opcoes');
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
        showStep(2);
        await loadCalendarMonth();
        renderCalendar();
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
          setTimeout(() => showStep(3), 300);
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
      items = [
        { l: 'Dispositivo', v: 'Notebook em geral' },
        { l: 'Modelo', v: notebookSel.modelo },
        { l: 'Serviço', v: notebookSel.servico },
        notebookSel.descricao ? { l: 'Descrição do defeito', v: notebookSel.descricao } : null,
        { l: 'Tipo', v: tipoLabel },
        notebookSel.tipoSolicitacao === 'agendamento' ? { l: 'Data', v: dateFormatted } : null,
        notebookSel.tipoSolicitacao === 'agendamento' && sel.horario ? { l: 'Horário', v: sel.horario.slice(0, 5) } : null,
        { l: 'Nome', v: document.getElementById('agend-nome').value.trim() },
        { l: 'WhatsApp', v: document.getElementById('agend-whatsapp').value.trim() }
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
      let body;
      if (isNotebook) {
        body = {
          produto_nome: 'Notebook em geral',
          modelo_nome: notebookSel.modelo,
          servico_nome: notebookSel.servico,
          opcao_nome: '---',
          opcao_preco: 0,
          opcao_descricao: '',
          data: sel.data || null,
          horario: sel.horario || null,
          nome: document.getElementById('agend-nome').value.trim(),
          cpf: '',
          email: '',
          whatsapp: document.getElementById('agend-whatsapp').value.trim(),
          cep: '',
          endereco_rua: '', endereco_numero: '', endereco_complemento: '',
          endereco_bairro: '', endereco_cidade: '', endereco_uf: '',
          descricao_defeito: notebookSel.descricao || '',
          tipo_solicitacao: notebookSel.tipoSolicitacao || 'agendamento',
          ciente_aviso_peca: null
        };
      } else {
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
      }
      // Append terms acceptance data if available
      if (window._termosAceiteData) {
        Object.assign(body, window._termosAceiteData);
        window._termosAceiteData = null;
      }
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

})();
