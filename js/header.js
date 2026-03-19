(function () {
  var placeholder = document.getElementById('site-header');
  if (!placeholder) return;

  // --- Inject CSS ---
  var style = document.createElement('style');
  style.textContent = [
    '/* ===== Nav hover cards ===== */',
    '.nav-item { position: relative; }',
    '.nav-icon-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: auto; height: auto; padding: 8px 14px 8px 10px; border-radius: 12px; color: #86868b; transition: color 0.18s ease, background 0.18s ease; text-decoration: none; }',
    '.nav-icon-btn:hover { color: #1a6cff; background: #f0f4ff; }',
    '.nav-icon-btn:hover img { filter: invert(32%) sepia(98%) saturate(700%) hue-rotate(198deg) brightness(95%); }',
    '.nav-item:hover > .nav-icon-btn { color: #1a6cff; background: #f0f4ff; }',
    '.nav-item:hover > .nav-icon-btn img { filter: invert(32%) sepia(98%) saturate(700%) hue-rotate(198deg) brightness(95%); }',
    '.nav-label { display: inline; font-size: 13px; font-weight: 600; white-space: nowrap; }',
    '.nav-icon-btn.nav-active { color: #1a6cff; background: #f0f4ff; }',
    '.nav-icon-btn.nav-active img { filter: invert(32%) sepia(98%) saturate(700%) hue-rotate(198deg) brightness(95%); }',
    '.nav-icon-btn.nav-active .nav-label { display: inline; }',
    '.nav-cta { align-items: center; gap: 8px; background: #1a6cff; color: #fff; border-radius: 12px; padding: 10px 18px; font-size: 13px; font-weight: 600; white-space: nowrap; text-decoration: none; transition: background 0.18s ease; }',
    '.nav-cta:hover { background: #0057e6; }',
    ".nav-card { position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%) translateY(-6px); background: #0d1b2e; color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 10px; white-space: nowrap; display: flex; align-items: center; gap: 8px; opacity: 0; transition: opacity 0.18s ease, transform 0.18s ease; pointer-events: none; z-index: 999; box-shadow: 0 4px 16px rgba(0,0,0,0.18); }",
    '.nav-item:hover > .nav-card { opacity: 1; transform: translateX(-50%) translateY(0); }',
    '.nav-card img { filter: brightness(0) invert(1); }',
    '/* ===== Mega Dropdown ===== */',
    '.nav-servicos { position: relative; }',
    '.nav-servicos .nav-icon-btn { cursor: pointer; }',
    '.mega-dropdown { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background: transparent; border-radius: 0; padding: 0; padding-top: 10px; opacity: 0; pointer-events: none; transition: opacity 0.22s ease, transform 0.22s ease; z-index: 1000; display: flex; flex-direction: column; min-width: 240px; overflow: visible; }',
    '.mega-dropdown-inner { display: flex; background: #0d1b2e; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.28); min-width: 240px; }',
    '.mega-dropdown.mega-open { opacity: 1; pointer-events: auto; }',
    '.mega-products { width: 240px; padding: 8px 0; flex-shrink: 0; }',
    '.mega-products a { display: block; padding: 11px 20px; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500; text-decoration: none; transition: background 0.15s, color 0.15s; white-space: nowrap; }',
    '.mega-products a:hover, .mega-products a.mega-prod-active { background: rgba(255,255,255,0.08); color: #fff; }',
    '.mega-services { width: 0; padding: 0; overflow: hidden; transition: width 0.25s ease, padding 0.25s ease; border-right: none; }',
    '.mega-dropdown.mega-svc-expanded .mega-services { width: 320px; padding: 8px 0; overflow: visible; }',
    '.mega-dropdown.mega-svc-expanded .mega-products { border-right: 1px solid rgba(255,255,255,0.08); }',
    '.nav-servicos .mega-dropdown.mega-open ~ .nav-card { opacity: 0 !important; pointer-events: none !important; }',
    '.mega-services-panel { display: none; }',
    '.mega-services-panel.mega-svc-active { display: block; }',
    '.mega-services-panel a { display: block; padding: 11px 20px; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500; text-decoration: none; transition: background 0.15s, color 0.15s; white-space: nowrap; border-bottom: 1px solid rgba(255,255,255,0.05); }',
    '.mega-services-panel a:last-child { border-bottom: none; }',
    '.mega-services-panel a:hover { background: rgba(255,255,255,0.08); color: #fff; }',
    '/* ===== Mobile menu ===== */',
    '#mobile-backdrop { opacity: 0; pointer-events: none; transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1); }',
    '#mobile-backdrop.menu-open { opacity: 1; pointer-events: auto; }',
    '#mobile-menu { transform: translateX(100%); transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }',
    '#mobile-menu.menu-open { transform: translateX(0); }',
    '.mob-item { color: #0d1b2e; text-decoration: none; border-radius: 12px; padding-left: 8px; padding-right: 8px; transition: background 0.18s ease, color 0.18s ease; }',
    '.mob-item:hover { background: #f0f4ff; color: #1a6cff; }',
    '.mob-item:hover .mob-icon { background: #1a6cff; color: white; }',
    '.mob-item:hover .mob-icon img { filter: brightness(0) invert(1); }',
    '.mob-item.mob-active { color: #0d1b2e; }',
    '.mob-icon { width: 2.5rem !important; height: 2.5rem; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; border-radius: 10px; color: #0d1b2e; transition: background 0.2s, color 0.2s; }',
    '.mob-item.mob-active .mob-icon { background: #1a6cff; color: white; }',
    '.mob-item.mob-active .mob-icon img { filter: brightness(0) invert(1); }',
    '/* Mobile accordion */',
    '.mob-servicos-toggle { cursor: pointer; }',
    '.mob-accordion { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }',
    '.mob-accordion.mob-acc-open { max-height: 800px; }',
    '.mob-sub-toggle { cursor: pointer; }',
    '.mob-sub-panel { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }',
    '.mob-sub-panel.mob-sub-open { max-height: 500px; }',
    '.mob-chevron { transition: transform 0.3s ease; }',
    '.mob-chevron.mob-chv-open { transform: rotate(180deg); }',
    '/* ===== Breakpoint 1100px ===== */',
    '.desk-only { display: none !important; }',
    '.mob-only { display: flex !important; }',
    '@media (min-width: 1100px) { .desk-only { display: flex !important; } .mob-only { display: none !important; } }',
    '/* ===== Selo responsivo ===== */',
    '.header-selo { height: 22px; width: auto; object-fit: contain; }',
    '@media (min-width: 1100px) { .header-selo { height: 36px; } }',
    '/* ===== Scroll border ===== */',
    '#navbar.is-scrolled { border-bottom-color: #d2d2d7 !important; }'
  ].join('\n');
  document.head.appendChild(style);

  // --- Inject HTML ---
  var html = `
  <!-- NAVIGATION -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-transparent transition-colors duration-300" id="navbar">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

      <!-- Brand / Logo -->
      <a href="index.html" class="flex items-center gap-2">
        <img loading="lazy" src="images/logonova.png" alt="iPro" style="height:44px;width:auto;object-fit:contain;">
        <img loading="lazy" src="images/selo.png" alt="" class="header-selo">
      </a>

      <!-- Menu Links (desktop: icon + hover card) -->
      <nav class="desk-only items-center gap-1 flex-1 justify-center">
        <!-- Home -->
        <div class="nav-item">
          <a href="index.html" class="nav-icon-btn" data-active-page="index.html" aria-label="Home">
            <img loading="lazy" src="images/home.png" width="22" height="22" alt="">
            <span class="nav-label">Home</span>
          </a>
          <div class="nav-card"><img loading="lazy" src="images/home.png" style="flex-shrink:0;" width="14" height="14" alt="">Home</div>
        </div>
        <!-- Serviços (mega dropdown) -->
        <div class="nav-item nav-servicos" id="nav-servicos">
          <a href="servicos.html" class="nav-icon-btn" aria-label="Serviços" id="servicos-toggle">
            <img loading="lazy" src="images/chave-simples.png" width="26" height="26" alt="">
            <span class="nav-label">Serviços</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style="margin-left:2px;"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <!-- Mega Dropdown -->
          <div class="mega-dropdown" id="mega-dropdown">
            <div class="mega-dropdown-inner">
            <div class="mega-products">
              <a href="assistencia-iphone-campinas.html" data-product="iphone">Assistência técnica iPhone</a>
              <a href="assistencia-macbook-campinas.html" data-product="macbook">Assistência técnica Macbook</a>
              <a href="assistencia-apple-watch-campinas.html" data-product="applewatch">Assistência técnica Apple Watch</a>
              <a href="assistencia-imac-campinas.html" data-product="imac">Assistência técnica iMac</a>
              <a href="assistencia-ipad-campinas.html" data-product="ipad">Assistência técnica iPad</a>
              <a href="assistencia-mac-mini-campinas.html" data-product="macmini">Assistência técnica Mac Mini</a>
            </div>
            <div class="mega-services">
              <!-- iPhone -->
              <div class="mega-services-panel" data-panel="iphone">
                <a href="troca-de-tela-iphone-campinas.html">Substituição de Tela</a>
                <a href="troca-de-bateria-iphone-campinas.html">Substituição de Bateria</a>
                <a href="troca-de-vidro-frontal-iphone-campinas.html">Troca de Vidro Frontal</a>
                <a href="troca-de-vidro-traseiro-iphone-campinas.html">Troca de Vidro Traseiro</a>
                <a href="reparo-de-face-id-iphone-campinas.html">Reparo de Face ID</a>
                <a href="reparo-de-conector-de-carga-iphone-campinas.html">Reparo do Conector de Carga</a>
                <a href="reparo-de-camera-traseira-iphone-campinas.html">Reparo de Câmera Traseira</a>
                <a href="assistencia-iphone-campinas.html">Reparo de Câmera Frontal</a>
                <a href="assistencia-iphone-campinas.html">Reparo de Alto-falantes</a>
                <a href="assistencia-iphone-campinas.html">Reparo do Microfone</a>
                <a href="assistencia-iphone-campinas.html">Reparo de Placa Lógica</a>
                <a href="assistencia-iphone-campinas.html">Troca do Sensor de Proximidade</a>
                <a href="assistencia-iphone-campinas.html">Reparo do Botão Lateral / Volume</a>
                <a href="assistencia-iphone-campinas.html">Diagnóstico Completo</a>
              </div>
              <!-- MacBook -->
              <div class="mega-services-panel" data-panel="macbook">
                <a href="troca-de-tela-macbook-campinas.html">Substituição de Tela</a>
                <a href="troca-de-bateria-macbook-campinas.html">Substituição de Bateria</a>
                <a href="assistencia-macbook-campinas.html">Reparo de Placa Lógica</a>
                <a href="assistencia-macbook-campinas.html">Reparo do Conector de Carga</a>
                <a href="assistencia-macbook-campinas.html">Reparo de Alto-falantes</a>
                <a href="troca-de-teclado-touchpad-macbook-campinas.html">Substituição de Teclado</a>
                <a href="troca-de-teclado-touchpad-macbook-campinas.html">Substituição de Trackpad</a>
                <a href="limpeza-completa-macbook-campinas.html">Limpeza Interna Completa</a>
                <a href="ins-de-ssd-m-sata-macbook-campinas.html">Upgrade de Armazenamento (SSD / M.2)</a>
                <a href="assistencia-macbook-campinas.html">Reinstalação do macOS</a>
                <a href="assistencia-macbook-campinas.html">Atualização do Sistema</a>
                <a href="assistencia-macbook-campinas.html">Backup e Migração de Dados</a>
                <a href="assistencia-macbook-campinas.html">Diagnóstico Completo de Hardware</a>
              </div>
              <!-- Apple Watch -->
              <div class="mega-services-panel" data-panel="applewatch">
                <a href="troca-de-tela-apple-watch-campinas.html">Substituição de Tela</a>
                <a href="troca-de-vidro-touch-apple-watch-campinas.html">Substituição de Vidro / Touch</a>
                <a href="troca-de-bateria-apple-watch-campinas.html">Substituição de Bateria</a>
                <a href="assistencia-apple-watch-campinas.html">Reparo de Placa</a>
                <a href="assistencia-apple-watch-campinas.html">Reparo do Conector de Carga</a>
                <a href="assistencia-apple-watch-campinas.html">Reparo da Coroa Digital</a>
                <a href="assistencia-apple-watch-campinas.html">Diagnóstico Completo</a>
              </div>
              <!-- iMac -->
              <div class="mega-services-panel" data-panel="imac">
                <a href="reparo-de-placa-imac-campinas.html">Reparo de Placa Lógica</a>
                <a href="reparo-de-fonte-imac-campinas.html">Reparo da Fonte de Alimentação</a>
                <a href="troca-de-tela-imac-campinas.html">Substituição de Tela</a>
                <a href="assistencia-imac-campinas.html">Substituição do Cooler / Ventoinha</a>
                <a href="assistencia-imac-campinas.html">Upgrade de Memória (RAM)</a>
                <a href="upgrade-de-SSD-e-M-sata-imac-campinas.html">Upgrade de Armazenamento (SSD / M.2)</a>
                <a href="limpeza-completa-imac-campinas.html">Limpeza Interna Completa</a>
                <a href="assistencia-imac-campinas.html">Reinstalação do macOS</a>
                <a href="assistencia-imac-campinas.html">Atualização do Sistema</a>
                <a href="assistencia-imac-campinas.html">Backup e Recuperação de Dados</a>
                <a href="assistencia-imac-campinas.html">Diagnóstico Completo de Hardware</a>
              </div>
              <!-- iPad -->
              <div class="mega-services-panel" data-panel="ipad">
                <a href="troca-de-tela-ipad-campinas.html">Substituição de Tela</a>
                <a href="troca-de-bateria-ipad-campinas.html">Substituição de Bateria</a>
                <a href="troca-de-vidro-frontal-ipad-campinas.html">Troca de Vidro Frontal</a>
                <a href="troca-de-vidro-traseiro-ipad-campinas.html">Troca de Vidro Traseiro</a>
                <a href="reparo-de-face-id-ipad-campinas.html">Reparo de Face ID</a>
                <a href="reparo-de-conector-de-carga-ipad-campinas.html">Reparo do Conector de Carga</a>
                <a href="reparo-de-camera-traseira-ipad-campinas.html">Reparo de Câmera Traseira</a>
                <a href="assistencia-ipad-campinas.html">Reparo de Câmera Frontal</a>
                <a href="assistencia-ipad-campinas.html">Reparo de Alto-falantes</a>
                <a href="assistencia-ipad-campinas.html">Reparo de Placa Lógica</a>
                <a href="assistencia-ipad-campinas.html">Backup e Migração de Dados</a>
                <a href="assistencia-ipad-campinas.html">Reinstalação do iPadOS</a>
                <a href="assistencia-ipad-campinas.html">Atualização do Sistema</a>
                <a href="assistencia-ipad-campinas.html">Diagnóstico Completo</a>
              </div>
              <!-- Mac Mini -->
              <div class="mega-services-panel" data-panel="macmini">
                <a href="reparo-de-placa-mac-mini-campinas.html">Reparo de Placa Lógica</a>
                <a href="reballing-de-cpu-mac-mini-campinas.html">Reballing de CPU</a>
                <a href="upgrade-do-mac-mini-campinas.html">Upgrade de Hardware</a>
                <a href="ins-de-ssd-ou-m-sata-mac-mini-campinas.html">Instalação de SSD / M.2</a>
                <a href="limpeza-completa-mac-mini-campinas.html">Limpeza Interna Completa</a>
                <a href="assistencia-mac-mini-campinas.html">Reinstalação do macOS</a>
                <a href="assistencia-mac-mini-campinas.html">Atualização do Sistema</a>
                <a href="assistencia-mac-mini-campinas.html">Backup e Recuperação de Dados</a>
                <a href="assistencia-mac-mini-campinas.html">Diagnóstico Completo de Hardware</a>
              </div>
            </div>
            </div>
          </div>
          <div class="nav-card"><img loading="lazy" src="images/chave-simples.png" style="flex-shrink:0;" width="14" height="14" alt="">Serviços</div>
        </div>
        <!-- Nossa história -->
        <div class="nav-item">
          <a href="quemSomos.html" class="nav-icon-btn" data-active-page="quemSomos.html" aria-label="Nossa história">
            <img loading="lazy" src="images/livro-aberto-capa.png" width="26" height="22" alt="">
            <span class="nav-label">Nossa história</span>
          </a>
          <div class="nav-card"><img loading="lazy" src="images/livro-aberto-capa.png" style="flex-shrink:0;" width="14" height="11" alt="">Nossa história</div>
        </div>
        <!-- Contato -->
        <div class="nav-item">
          <a href="contato.html" class="nav-icon-btn" data-active-page="contato.html" aria-label="Contato">
            <img loading="lazy" src="images/circulo-telefone-flip.png" width="22" height="24" alt="">
            <span class="nav-label">Contato</span>
          </a>
          <div class="nav-card"><img loading="lazy" src="images/circulo-telefone-flip.png" style="flex-shrink:0;" width="13" height="15" alt="">Contato</div>
        </div>
        <!-- Seminovos -->
        <div class="nav-item">
          <a href="seminovos.html" class="nav-icon-btn" data-active-page="seminovos.html" aria-label="Seminovos">
            <img loading="lazy" src="images/icone-seminovo.png" width="22" height="22" alt="">
            <span class="nav-label">Seminovos</span>
          </a>
          <div class="nav-card"><img loading="lazy" src="images/icone-seminovo.png" style="flex-shrink:0;" width="14" height="14" alt="">Seminovos</div>
        </div>
        <!-- Comprar -->
        <div class="nav-item">
          <a href="https://apple.ipro.net.br" target="_blank" rel="noopener" class="nav-icon-btn" aria-label="Comprar">
            <img loading="lazy" src="images/comprar.png" width="22" height="22" alt="">
            <span class="nav-label">Comprar</span>
          </a>
          <div class="nav-card"><img loading="lazy" src="images/comprar.png" style="flex-shrink:0;" width="14" height="14" alt="">Comprar</div>
        </div>
      </nav>

      <!-- CTA desktop -->
      <a href="agendamento.html" class="nav-cta desk-only" style="text-decoration:none;font-family:Inter,sans-serif">
        Faça seu agendamento
      </a>

      <!-- Right: mobile hamburger -->
      <div class="flex items-center">
        <!-- Mobile Hamburger -->
        <button class="mob-only flex-col gap-1.5 p-2 focus:outline-none" id="mobile-menu-btn" aria-label="Menu" style="margin-right:20px;">
          <span class="w-6 h-0.5 bg-[#1d1d1f] rounded-full transition-transform origin-center"></span>
          <span class="w-6 h-0.5 bg-[#1d1d1f] rounded-full transition-opacity"></span>
          <span class="w-6 h-0.5 bg-[#1d1d1f] rounded-full transition-transform origin-center"></span>
        </button>
      </div>

    </div>
  </header>

  <!-- Mobile backdrop -->
  <div class="fixed inset-0 bg-black/50 z-40" id="mobile-backdrop"></div>

  <!-- Mobile Menu Panel -->
  <div class="fixed top-0 right-0 h-full w-[68%] max-w-xs bg-white z-50 flex flex-col" id="mobile-menu">

    <!-- Panel header: logo + close -->
    <div class="flex items-center justify-between px-6 pt-7 pb-6">
      <a href="index.html" class="flex items-center gap-2">
        <img loading="lazy" src="images/logonova.png" alt="iPro" style="height:40px;width:auto;object-fit:contain;">
        <img loading="lazy" src="images/selo.png" alt="" style="height:22px;width:auto;object-fit:contain;">
      </a>
      <button id="mobile-menu-close-btn" class="w-10 h-10 flex items-center justify-center text-[#1a1a1a] text-2xl focus:outline-none" aria-label="Fechar menu">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Nav Items -->
    <nav class="flex flex-col px-6 flex-1 justify-center gap-3 overflow-y-auto">
      <!-- Home -->
      <a href="index.html" class="mob-item flex items-center gap-3 py-4" data-active-page="index.html">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img loading="lazy" src="images/home.png" width="22" height="22" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Home</span>
      </a>
      <!-- Serviços accordion -->
      <div>
        <div class="mob-item mob-servicos-toggle flex items-center gap-3 py-4" id="mob-servicos-toggle">
          <a href="servicos.html" class="flex items-center gap-3 flex-1">
            <span class="mob-icon flex items-center justify-center shrink-0">
              <img loading="lazy" src="images/chave-simples.svg" width="26" height="26" alt="">
            </span>
            <span class="text-[15px] font-medium whitespace-nowrap">Serviços</span>
          </a>
          <svg class="mob-chevron w-4 h-4 text-[#86868b] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </div>
        <div class="mob-accordion" id="mob-servicos-accordion">
          <div class="pl-4">
            <!-- iPhone sub -->
            <div>
              <div class="mob-sub-toggle flex items-center justify-between py-2.5 px-3 text-[13px] font-semibold text-[#0d1b2e] cursor-pointer rounded-lg hover:bg-[#f0f4ff] transition-colors">
                <span>iPhone</span>
                <svg class="mob-chevron w-3.5 h-3.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div class="mob-sub-panel">
                <div class="pl-3 pb-2 space-y-0.5">
                  <a href="troca-de-tela-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Tela</a>
                  <a href="troca-de-bateria-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Bateria</a>
                  <a href="troca-de-vidro-frontal-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Troca de Vidro Frontal</a>
                  <a href="troca-de-vidro-traseiro-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Troca de Vidro Traseiro</a>
                  <a href="reparo-de-face-id-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Face ID</a>
                  <a href="reparo-de-conector-de-carga-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo do Conector de Carga</a>
                  <a href="reparo-de-camera-traseira-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Câmera Traseira</a>
                  <a href="assistencia-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Câmera Frontal</a>
                  <a href="assistencia-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Alto-falantes</a>
                  <a href="assistencia-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo do Microfone</a>
                  <a href="assistencia-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Placa Lógica</a>
                  <a href="assistencia-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Troca do Sensor de Proximidade</a>
                  <a href="assistencia-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo do Botão Lateral / Volume</a>
                  <a href="assistencia-iphone-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Diagnóstico Completo</a>
                </div>
              </div>
            </div>
            <!-- Macbook sub -->
            <div>
              <div class="mob-sub-toggle flex items-center justify-between py-2.5 px-3 text-[13px] font-semibold text-[#0d1b2e] cursor-pointer rounded-lg hover:bg-[#f0f4ff] transition-colors">
                <span>Macbook</span>
                <svg class="mob-chevron w-3.5 h-3.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div class="mob-sub-panel">
                <div class="pl-3 pb-2 space-y-0.5">
                  <a href="troca-de-tela-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Tela</a>
                  <a href="troca-de-bateria-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Bateria</a>
                  <a href="assistencia-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Placa Lógica</a>
                  <a href="assistencia-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo do Conector de Carga</a>
                  <a href="assistencia-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Alto-falantes</a>
                  <a href="troca-de-teclado-touchpad-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Teclado</a>
                  <a href="troca-de-teclado-touchpad-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Trackpad</a>
                  <a href="limpeza-completa-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Limpeza Interna Completa</a>
                  <a href="ins-de-ssd-m-sata-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Upgrade de Armazenamento (SSD / M.2)</a>
                  <a href="assistencia-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reinstalação do macOS</a>
                  <a href="assistencia-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Atualização do Sistema</a>
                  <a href="assistencia-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Backup e Migração de Dados</a>
                  <a href="assistencia-macbook-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Diagnóstico Completo de Hardware</a>
                </div>
              </div>
            </div>
            <!-- Apple Watch sub -->
            <div>
              <div class="mob-sub-toggle flex items-center justify-between py-2.5 px-3 text-[13px] font-semibold text-[#0d1b2e] cursor-pointer rounded-lg hover:bg-[#f0f4ff] transition-colors">
                <span>Apple Watch</span>
                <svg class="mob-chevron w-3.5 h-3.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div class="mob-sub-panel">
                <div class="pl-3 pb-2 space-y-0.5">
                  <a href="troca-de-tela-apple-watch-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Tela</a>
                  <a href="troca-de-vidro-touch-apple-watch-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Vidro / Touch</a>
                  <a href="troca-de-bateria-apple-watch-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Bateria</a>
                  <a href="assistencia-apple-watch-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Placa</a>
                  <a href="assistencia-apple-watch-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo do Conector de Carga</a>
                  <a href="assistencia-apple-watch-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo da Coroa Digital</a>
                  <a href="assistencia-apple-watch-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Diagnóstico Completo</a>
                </div>
              </div>
            </div>
            <!-- iMac sub -->
            <div>
              <div class="mob-sub-toggle flex items-center justify-between py-2.5 px-3 text-[13px] font-semibold text-[#0d1b2e] cursor-pointer rounded-lg hover:bg-[#f0f4ff] transition-colors">
                <span>iMac</span>
                <svg class="mob-chevron w-3.5 h-3.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div class="mob-sub-panel">
                <div class="pl-3 pb-2 space-y-0.5">
                  <a href="reparo-de-placa-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Placa Lógica</a>
                  <a href="reparo-de-fonte-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo da Fonte de Alimentação</a>
                  <a href="troca-de-tela-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Tela</a>
                  <a href="assistencia-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição do Cooler / Ventoinha</a>
                  <a href="assistencia-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Upgrade de Memória (RAM)</a>
                  <a href="upgrade-de-SSD-e-M-sata-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Upgrade de Armazenamento (SSD / M.2)</a>
                  <a href="limpeza-completa-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Limpeza Interna Completa</a>
                  <a href="assistencia-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reinstalação do macOS</a>
                  <a href="assistencia-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Atualização do Sistema</a>
                  <a href="assistencia-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Backup e Recuperação de Dados</a>
                  <a href="assistencia-imac-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Diagnóstico Completo de Hardware</a>
                </div>
              </div>
            </div>
            <!-- iPad sub -->
            <div>
              <div class="mob-sub-toggle flex items-center justify-between py-2.5 px-3 text-[13px] font-semibold text-[#0d1b2e] cursor-pointer rounded-lg hover:bg-[#f0f4ff] transition-colors">
                <span>iPad</span>
                <svg class="mob-chevron w-3.5 h-3.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div class="mob-sub-panel">
                <div class="pl-3 pb-2 space-y-0.5">
                  <a href="troca-de-tela-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Tela</a>
                  <a href="troca-de-bateria-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Substituição de Bateria</a>
                  <a href="troca-de-vidro-frontal-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Troca de Vidro Frontal</a>
                  <a href="troca-de-vidro-traseiro-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Troca de Vidro Traseiro</a>
                  <a href="reparo-de-face-id-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Face ID</a>
                  <a href="reparo-de-conector-de-carga-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo do Conector de Carga</a>
                  <a href="reparo-de-camera-traseira-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Câmera Traseira</a>
                  <a href="assistencia-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Câmera Frontal</a>
                  <a href="assistencia-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Alto-falantes</a>
                  <a href="assistencia-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Placa Lógica</a>
                  <a href="assistencia-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Backup e Migração de Dados</a>
                  <a href="assistencia-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reinstalação do iPadOS</a>
                  <a href="assistencia-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Atualização do Sistema</a>
                  <a href="assistencia-ipad-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Diagnóstico Completo</a>
                </div>
              </div>
            </div>
            <!-- Mac Mini sub -->
            <div>
              <div class="mob-sub-toggle flex items-center justify-between py-2.5 px-3 text-[13px] font-semibold text-[#0d1b2e] cursor-pointer rounded-lg hover:bg-[#f0f4ff] transition-colors">
                <span>Mac Mini</span>
                <svg class="mob-chevron w-3.5 h-3.5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div class="mob-sub-panel">
                <div class="pl-3 pb-2 space-y-0.5">
                  <a href="reparo-de-placa-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reparo de Placa Lógica</a>
                  <a href="reballing-de-cpu-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reballing de CPU</a>
                  <a href="upgrade-do-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Upgrade de Hardware</a>
                  <a href="ins-de-ssd-ou-m-sata-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Instalação de SSD / M.2</a>
                  <a href="limpeza-completa-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Limpeza Interna Completa</a>
                  <a href="assistencia-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Reinstalação do macOS</a>
                  <a href="assistencia-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Atualização do Sistema</a>
                  <a href="assistencia-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Backup e Recuperação de Dados</a>
                  <a href="assistencia-mac-mini-campinas.html" class="block py-2 px-3 text-[12px] text-[#555] rounded-lg hover:bg-[#f0f4ff] hover:text-[#1a6cff] transition-colors">Diagnóstico Completo de Hardware</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a href="quemSomos.html" class="mob-item flex items-center gap-3 py-4" data-active-page="quemSomos.html">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img loading="lazy" src="images/livro-aberto-capa.svg" width="26" height="22" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Nossa história</span>
      </a>
      <a href="contato.html" class="mob-item flex items-center gap-3 py-4" data-active-page="contato.html">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img loading="lazy" src="images/circulo-telefone-flip.svg" width="22" height="24" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Contato</span>
      </a>
      <a href="seminovos.html" class="mob-item flex items-center gap-3 py-4" data-active-page="seminovos.html">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img loading="lazy" src="images/icone-seminovo.png" width="22" height="22" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Seminovos</span>
      </a>
      <a href="https://apple.ipro.net.br" target="_blank" rel="noopener" class="mob-item flex items-center gap-3 py-4">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img loading="lazy" src="images/comprar.png" width="22" height="22" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Comprar</span>
      </a>
    </nav>

    <!-- Agendamento CTA -->
    <div class="px-5 pb-8 pt-4">
      <button id="mob-agend-btn"
         class="flex items-center justify-center gap-3 w-full bg-[#1a6cff] hover:bg-[#005de8] active:bg-[#004cc5] text-white text-[15px] font-semibold rounded-2xl px-6 py-4 transition-colors duration-200 border-none cursor-pointer" style="font-family:Inter,sans-serif">
        <i class="fa-regular fa-calendar text-xl"></i>
        Agendar atendimento
      </button>
    </div>

  </div>`;

  placeholder.insertAdjacentHTML('beforebegin', html);
  placeholder.remove();

  // --- Nav active detection ---
  (function () {
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-icon-btn[data-active-page]').forEach(function (el) {
      if (el.getAttribute('data-active-page') === page) el.classList.add('nav-active');
    });
    document.querySelectorAll('#mobile-menu .mob-item[data-active-page]').forEach(function (el) {
      if (el.getAttribute('data-active-page') === page) el.classList.add('mob-active');
    });
    // Mark Serviços active on servicos.html and all individual service pages
    var nonServicePages = ['index.html', 'quemSomos.html', 'contato.html', ''];
    if (page === 'servicos.html' || (nonServicePages.indexOf(page) === -1 && page !== '')) {
      var servicosToggle = document.getElementById('servicos-toggle');
      if (servicosToggle) servicosToggle.classList.add('nav-active');
      var mobServicosToggle = document.getElementById('mob-servicos-toggle');
      if (mobServicosToggle) mobServicosToggle.classList.add('mob-active');
    }
  })();

  // --- Mega Dropdown (desktop) ---
  (function () {
    var toggle = document.getElementById('servicos-toggle');
    var dropdown = document.getElementById('mega-dropdown');
    var navServicos = document.getElementById('nav-servicos');
    var productLinks = dropdown.querySelectorAll('.mega-products a');
    var panels = dropdown.querySelectorAll('.mega-services-panel');
    var megaOpen = false;

    function showPanel(product) {
      productLinks.forEach(function (a) { a.classList.toggle('mega-prod-active', a.getAttribute('data-product') === product); });
      panels.forEach(function (p) { p.classList.toggle('mega-svc-active', p.getAttribute('data-panel') === product); });
      dropdown.classList.add('mega-svc-expanded');
    }

    function openMega() {
      megaOpen = true;
      dropdown.classList.add('mega-open');
      toggle.classList.add('nav-active');
    }

    function closeMega() {
      megaOpen = false;
      dropdown.classList.remove('mega-open');
      dropdown.classList.remove('mega-svc-expanded');
      toggle.classList.remove('nav-active');
      productLinks.forEach(function (a) { a.classList.remove('mega-prod-active'); });
      panels.forEach(function (p) { p.classList.remove('mega-svc-active'); });
    }

    navServicos.addEventListener('mouseenter', function () {
      openMega();
    });
    navServicos.addEventListener('mouseleave', function () {
      closeMega();
    });

    productLinks.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        showPanel(this.getAttribute('data-product'));
      });
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showPanel(this.getAttribute('data-product'));
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && megaOpen) closeMega();
    });
  })();

  // --- Mobile Accordion ---
  (function () {
    var mainToggle = document.getElementById('mob-servicos-toggle');
    var accordion = document.getElementById('mob-servicos-accordion');
    var mainChevron = mainToggle.querySelector('.mob-chevron');
    var subToggles = accordion.querySelectorAll('.mob-sub-toggle');

    mainChevron.addEventListener('click', function (e) {
      e.stopPropagation();
      accordion.classList.toggle('mob-acc-open');
      mainChevron.classList.toggle('mob-chv-open');
    });

    subToggles.forEach(function (st) {
      st.addEventListener('click', function () {
        var panel = st.nextElementSibling;
        var chevron = st.querySelector('.mob-chevron');
        panel.classList.toggle('mob-sub-open');
        if (chevron) chevron.classList.toggle('mob-chv-open');
      });
    });
  })();

  // --- Mobile menu ---
  var btn = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('mobile-menu');
  var backdrop = document.getElementById('mobile-backdrop');
  var closeBtn = document.getElementById('mobile-menu-close-btn');
  var spans = btn.querySelectorAll('span');
  var isOpen = false;

  function openMenu() {
    isOpen = true;
    menu.classList.add('menu-open');
    backdrop.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    var fb = document.querySelector('.agendamento-float'); if (fb) fb.style.display = 'none';
    spans[0].style.transform = 'translateY(8px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.remove('menu-open');
    backdrop.classList.remove('menu-open');
    document.body.style.overflow = '';
    var fb = document.querySelector('.agendamento-float'); if (fb) fb.style.display = '';
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }

  btn.addEventListener('click', function () { isOpen ? closeMenu() : openMenu(); });
  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { if (isOpen) closeMenu(); });
  });
  // Mobile agendamento CTA
  var mobAgendBtn = document.getElementById('mob-agend-btn');
  if (mobAgendBtn) {
    mobAgendBtn.addEventListener('click', function () {
      closeMenu();
      window.location.href = 'agendamento.html';
    });
  }

  // --- Scroll border ---
  var nav = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });

  // --- Floating Agendamento Button (hidden on mobile) ---
  (function () {
    var floatCss = document.createElement('style');
    floatCss.textContent = [
      '.agendamento-float { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: none; align-items: center; gap: 8px; padding: 14px 22px; border-radius: 50px; background: #1a6cff; color: #fff; box-shadow: 0 4px 20px rgba(26,108,255,0.4); transition: transform 0.25s ease, box-shadow 0.25s ease; text-decoration: none; font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; }',
      '.agendamento-float:hover { transform: scale(1.05); box-shadow: 0 6px 28px rgba(26,108,255,0.55); }',
      '.agendamento-float svg { width: 20px; height: 20px; fill: #fff; }',
      '@media(min-width:768px) { .agendamento-float { display: flex; } }'
    ].join('\n');
    document.head.appendChild(floatCss);

    var floatBtn = document.createElement('a');
    floatBtn.href = 'agendamento.html';
    floatBtn.className = 'agendamento-float';
    floatBtn.setAttribute('aria-label', 'Agendar atendimento');
    floatBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Agendar';
    document.body.appendChild(floatBtn);
  })();

})();
