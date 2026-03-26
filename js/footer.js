(function () {
  var placeholder = document.getElementById('site-footer');
  if (!placeholder) return;

  var FOOTER_HTML = `
  <!-- stripe -->
  <div class="h-16 bg-[#f0eeeb]"></div>

  <!-- FOOTER -->
  <footer class="bg-[#0d1117] text-white relative" style="z-index:1;">
    <div class="max-w-7xl mx-auto px-6 pt-20 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

        <!-- Col 1: Brand + info -->
        <div>
          <a href="index.html" class="inline-flex items-center gap-2 mb-6">
            <img loading="lazy" src="images/logonova.png" alt="iPro" class="h-10 w-auto brightness-0 invert">
            <img loading="lazy" src="images/selo.png" alt="" class="h-8 w-auto brightness-0 invert">
          </a>
          <p class="text-white/40 text-sm leading-relaxed mb-2">iPro Assistência Técnica Apple</p>
          <p class="text-white/30 text-xs mb-6">CNPJ: 32.819.954/0001-17</p>
          <div class="flex gap-4">
            <a href="https://www.instagram.com/ipropremium/" target="_blank" rel="noopener" aria-label="Instagram" class="text-white/30 hover:text-[#1a6cff] transition-colors">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.33334 0.437744H26.6667C28.0811 0.437744 29.4377 1 30.4379 2.00098C31.4381 3.00171 32 4.35938 32 5.7749V27.123C32 28.5383 31.4381 29.896 30.4379 30.8967C29.4377 31.8977 28.0811 32.46 26.6667 32.46H5.33334C3.91885 32.46 2.56229 31.8977 1.5621 30.8967C0.56189 29.896 0 28.5383 0 27.123V5.7749C0 4.35938 0.56189 3.00171 1.5621 2.00098C2.56229 1 3.91885 0.437744 5.33334 0.437744ZM15.9998 8.44336C14.4175 8.44336 12.8708 8.91284 11.5552 9.79248C10.2396 10.6721 9.21423 11.9226 8.60873 13.3853C8.00323 14.8481 7.84479 16.4578 8.15347 18.0107C8.46216 19.5637 9.22409 20.9902 10.3429 22.1099C11.4617 23.2295 12.8872 23.9919 14.439 24.3008C15.9909 24.6096 17.5994 24.4512 19.0612 23.8452C20.523 23.2393 21.7725 22.2131 22.6515 20.8967C23.5306 19.5801 23.9998 18.0322 23.9998 16.449C23.9998 14.3257 23.1569 12.2896 21.6566 10.7881C20.1563 9.28687 18.1215 8.44336 15.9998 8.44336ZM24.6665 9.77759C25.7711 9.77759 26.6665 8.88159 26.6665 7.77637C26.6665 6.6709 25.7711 5.7749 24.6665 5.7749C23.5619 5.7749 22.6665 6.6709 22.6665 7.77637C22.6665 8.88159 23.5619 9.77759 24.6665 9.77759ZM15.9998 21.7861C14.9449 21.7861 13.9138 21.4731 13.0367 20.8865C12.1597 20.3 11.4761 19.4666 11.0724 18.4915C10.6687 17.5161 10.5631 16.4431 10.7689 15.4077C10.9747 14.3726 11.4826 13.4214 12.2285 12.675C12.9744 11.9287 13.9247 11.4204 14.9593 11.2144C15.9938 11.0085 17.0662 11.1143 18.0407 11.5181C19.0153 11.9221 19.8482 12.6062 20.4343 13.4839C21.0203 14.3616 21.3331 15.3933 21.3331 16.449C21.3331 17.8645 20.7712 19.2219 19.771 20.2229C18.7708 21.2236 17.4142 21.7861 15.9998 21.7861Z"/></svg>
            </a>
            <a href="https://www.facebook.com/iproassistenciaapple" target="_blank" rel="noopener" aria-label="Facebook" class="text-white/30 hover:text-[#1a6cff] transition-colors">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 16C0 24.8 7.2 32 16 32C24.8 32 32 24.8 32 16C32 7.2 24.8 0 16 0C7.2 0 0 7.2 0 16ZM17.4313 17.165V25.1182H14.0313V17.165H11.2278V14.0884H14.0909V11.7664C14.0909 9.15405 15.7611 7.70264 18.2664 7.70264C19.4594 7.70264 20.4734 7.76074 20.7716 7.81885V10.6052H19.0418C17.6699 10.6052 17.4313 11.2439 17.4313 12.1145V14.0884H20.6523L20.2348 17.165H17.4313Z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@ipro" target="_blank" rel="noopener" aria-label="TikTok" class="text-white/30 hover:text-[#1a6cff] transition-colors">
              <svg width="20" height="20" viewBox="0 0 32 37" fill="currentColor"><path d="M30.9279 8.03797C27.0869 8.03797 23.962 4.91307 23.962 1.07206C23.962 0.479916 23.4818 0 22.89 0H17.1483C16.5561 0 16.0762 0.479916 16.0762 1.07206V24.6122C16.0762 26.8703 14.2392 28.7073 11.9809 28.7073C9.72284 28.7073 7.88581 26.8703 7.88581 24.6122C7.88581 22.3539 9.72284 20.5169 11.9809 20.5169C12.573 20.5169 13.0529 20.037 13.0529 19.4448V13.7032C13.0529 13.1113 12.573 12.6311 11.9809 12.6311C5.37456 12.6311 0 18.0059 0 24.6122C0 31.2186 5.37456 36.5931 11.9809 36.5931C18.5872 36.5931 23.962 31.2186 23.962 24.6122V14.1923C26.0958 15.33 28.47 15.9238 30.9279 15.9238C31.5201 15.9238 32 15.4439 32 14.8517V9.11003C32 8.51816 31.5201 8.03797 30.9279 8.03797Z"/></svg>
            </a>
          </div>
        </div>

        <!-- Col 2: Navigation -->
        <div>
          <h4 class="text-xs font-mono tracking-[0.2em] uppercase text-white/30 mb-6">Navegação</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="index.html" class="text-white/60 hover:text-white transition-colors">Home</a></li>
            <li><a href="quemSomos.html" class="text-white/60 hover:text-white transition-colors">Sobre Nós</a></li>
            <li><a href="servicos.html" class="text-white/60 hover:text-white transition-colors">Serviços</a></li>
            <li><a href="https://apple.ipro.net.br" target="_blank" rel="noopener" class="text-white/60 hover:text-white transition-colors">Nossa Loja</a></li>
            <li><a href="contato.html" class="text-white/60 hover:text-white transition-colors">Contato</a></li>
            <li><a href="seminovos.html" class="text-white/60 hover:text-white transition-colors">Seminovos</a></li>
          </ul>
        </div>

        <!-- Col 3: Assistência -->
        <div>
          <h4 class="text-xs font-mono tracking-[0.2em] uppercase text-white/30 mb-6">Assistência</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="assistencia-iphone-campinas.html" class="text-white/60 hover:text-white transition-colors">Reparo de IPhone</a></li>
            <li><a href="assistencia-macbook-campinas.html" class="text-white/60 hover:text-white transition-colors">Reparo de MacBook</a></li>
            <li><a href="assistencia-ipad-campinas.html" class="text-white/60 hover:text-white transition-colors">Reparo de IPad</a></li>
            <li><a href="assistencia-apple-watch-campinas.html" class="text-white/60 hover:text-white transition-colors">Reparo de Apple Watch</a></li>
            <li><a href="assistencia-imac-campinas.html" class="text-white/60 hover:text-white transition-colors">Reparo de IMac</a></li>
            <li><a href="assistencia-mac-mini-campinas.html" class="text-white/60 hover:text-white transition-colors">Reparo de Mac Mini</a></li>
          </ul>
        </div>

        <!-- Col 4: Location -->
        <div>
          <h4 class="text-xs font-mono tracking-[0.2em] uppercase text-white/30 mb-6">Nossa loja</h4>
          <address class="not-italic text-sm text-white/60 leading-relaxed mb-5">
            Rua Jorge Krug, 69<br>
            Vila Itapura · Campinas/SP<br>
            CEP 13023-210
          </address>
          <p class="text-xs text-white/30 mb-2">Seg. a Sex. · 10h–12h / 13:30h–16:30h</p>
          <p class="text-xs text-yellow-400/80 mb-4">⚠ Atendimento somente com agendamento</p>
          <div class="flex flex-col gap-2">
            <a href="https://api.whatsapp.com/send?phone=5519996666898" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#1a6cff] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              (19) 99406-3782
            </a>
            <a href="tel:+551933245205"
               class="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0 0 .06 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/></svg>
              (19) 3324-5205
            </a>
          </div>
        </div>

      </div>

      <!-- Google Maps -->
      <div class="rounded-2xl overflow-hidden mb-12 border border-white/5">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1837.791080824106!2d-47.06049192651508!3d-22.891888684422504!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c994b9b3de51%3A0x15796f11193a7253!2siPro%20Assist%C3%AAncia%20T%C3%A9cnica%20Apple%20-%20Campinas!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
          width="100%" height="220" style="border:0;display:block;filter:grayscale(1) invert(0.9) contrast(0.85);"
          allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          title="iPro - Localização no Google Maps">
        </iframe>
      </div>

      <!-- SEO service links -->
      <div class="border-t border-white/5 pt-8 pb-4">
        <p class="text-xs font-mono tracking-[0.2em] uppercase text-white/20 mb-6">Serviços</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 text-xs text-white/30">
          <div>
            <p class="text-white/50 font-semibold uppercase tracking-widest text-[10px] mb-3">Reparo de iPhone</p>
            <ul class="space-y-2">
              <li><a href="assistencia-iphone-campinas.html" class="hover:text-white/70 transition-colors">Assistência técnica</a></li>
              <li><a href="troca-de-tela-iphone-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Tela</a></li>
              <li><a href="troca-de-bateria-iphone-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Bateria</a></li>
              <li><a href="troca-de-vidro-frontal-iphone-campinas.html" class="hover:text-white/70 transition-colors">Troca de Vidro Frontal</a></li>
              <li><a href="troca-de-vidro-traseiro-iphone-campinas.html" class="hover:text-white/70 transition-colors">Troca de Vidro Traseiro</a></li>
              <li><a href="reparo-de-face-id-iphone-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Face ID</a></li>
              <li><a href="reparo-de-conector-de-carga-iphone-campinas.html" class="hover:text-white/70 transition-colors">Reparo do Conector de Carga</a></li>
              <li><a href="reparo-de-camera-traseira-iphone-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Câmera Traseira</a></li>
              <li><a href="reparo-de-camera-frontal-iphone-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Câmera Frontal</a></li>
              <li><a href="reparo-de-alto-falante-iphone-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Alto-falantes</a></li>
              <li><a href="reparo-de-microfone-iphone-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Microfone</a></li>
              <li><a href="reparo-de-botoes-iphone-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Botões</a></li>
              <li><a href="reparo-de-sensor-de-proximidade-iphone-campinas.html" class="hover:text-white/70 transition-colors">Reparo Sensor de Proximidade</a></li>
              <li><a href="diagnostico-completo-iphone-campinas.html" class="hover:text-white/70 transition-colors">Diagnóstico Completo</a></li>
              <li><a href="backup-recuperacao-dados-iphone-campinas.html" class="hover:text-white/70 transition-colors">Backup e Recuperação de Dados</a></li>
              <li><a href="atualizacao-reinstalacao-ios-campinas.html" class="hover:text-white/70 transition-colors">Atualização / Reinstalação do iOS</a></li>
            </ul>
          </div>
          <div>
            <p class="text-white/50 font-semibold uppercase tracking-widest text-[10px] mb-3">Reparo de MacBook</p>
            <ul class="space-y-2">
              <li><a href="assistencia-macbook-campinas.html" class="hover:text-white/70 transition-colors">Assistência técnica</a></li>
              <li><a href="troca-de-tela-macbook-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Tela</a></li>
              <li><a href="troca-de-bateria-macbook-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Bateria</a></li>
              <li><a href="reparo-de-placa-macbook-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Placa Lógica</a></li>
              <li><a href="reparo-de-conector-de-carga-macbook-campinas.html" class="hover:text-white/70 transition-colors">Reparo do Conector de Carga</a></li>
              <li><a href="reparo-de-alto-falante-macbook-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Alto-falantes</a></li>
              <li><a href="troca-de-teclado-touchpad-macbook-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Teclado</a></li>
              <li><a href="troca-de-teclado-touchpad-macbook-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Trackpad</a></li>
              <li><a href="limpeza-completa-macbook-campinas.html" class="hover:text-white/70 transition-colors">Limpeza Interna Completa</a></li>
              <li><a href="ins-de-ssd-m-sata-macbook-campinas.html" class="hover:text-white/70 transition-colors">Upgrade de Armazenamento</a></li>
              <li><a href="reinstalacao-macos-macbook-campinas.html" class="hover:text-white/70 transition-colors">Reinstalação do macOS</a></li>
              <li><a href="atualizacao-sistema-macbook-campinas.html" class="hover:text-white/70 transition-colors">Atualização do Sistema</a></li>
              <li><a href="backup-migracao-dados-macbook-campinas.html" class="hover:text-white/70 transition-colors">Backup e Migração de Dados</a></li>
              <li><a href="diagnostico-completo-macbook-campinas.html" class="hover:text-white/70 transition-colors">Diagnóstico Completo</a></li>
            </ul>
          </div>
          <div>
            <p class="text-white/50 font-semibold uppercase tracking-widest text-[10px] mb-3">Reparo de Apple Watch</p>
            <ul class="space-y-2">
              <li><a href="assistencia-apple-watch-campinas.html" class="hover:text-white/70 transition-colors">Assistência técnica</a></li>
              <li><a href="troca-de-tela-apple-watch-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Tela</a></li>
              <li><a href="troca-de-vidro-touch-apple-watch-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Vidro / Touch</a></li>
              <li><a href="troca-de-bateria-apple-watch-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Bateria</a></li>
              <li><a href="reparo-de-coroa-digital-apple-watch-campinas.html" class="hover:text-white/70 transition-colors">Reparo da Coroa Digital</a></li>
              <li><a href="reparo-de-alto-falante-apple-watch-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Alto-falante</a></li>
              <li><a href="reparo-de-microfone-apple-watch-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Microfone</a></li>
              <li><a href="diagnostico-completo-apple-watch-campinas.html" class="hover:text-white/70 transition-colors">Diagnóstico Completo</a></li>
            </ul>
          </div>
          <div>
            <p class="text-white/50 font-semibold uppercase tracking-widests text-[10px] mb-3">Reparo de iMac</p>
            <ul class="space-y-2">
              <li><a href="assistencia-imac-campinas.html" class="hover:text-white/70 transition-colors">Assistência técnica</a></li>
              <li><a href="reparo-de-placa-imac-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Placa Lógica</a></li>
              <li><a href="reparo-de-fonte-imac-campinas.html" class="hover:text-white/70 transition-colors">Reparo da Fonte de Alimentação</a></li>
              <li><a href="troca-de-tela-imac-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Tela</a></li>
              <li><a href="troca-de-cooler-imac-campinas.html" class="hover:text-white/70 transition-colors">Substituição Cooler / Ventoinha</a></li>
              <li><a href="upgrade-de-ram-imac-campinas.html" class="hover:text-white/70 transition-colors">Upgrade de Memória (RAM)</a></li>
              <li><a href="upgrade-de-SSD-e-M-sata-imac-campinas.html" class="hover:text-white/70 transition-colors">Upgrade de Armazenamento</a></li>
              <li><a href="limpeza-completa-imac-campinas.html" class="hover:text-white/70 transition-colors">Limpeza Interna Completa</a></li>
              <li><a href="reinstalacao-macos-imac-campinas.html" class="hover:text-white/70 transition-colors">Reinstalação do macOS</a></li>
              <li><a href="atualizacao-sistema-imac-campinas.html" class="hover:text-white/70 transition-colors">Atualização do Sistema</a></li>
              <li><a href="backup-recuperacao-dados-imac-campinas.html" class="hover:text-white/70 transition-colors">Backup e Recuperação de Dados</a></li>
              <li><a href="diagnostico-completo-imac-campinas.html" class="hover:text-white/70 transition-colors">Diagnóstico Completo</a></li>
            </ul>
          </div>
          <div>
            <p class="text-white/50 font-semibold uppercase tracking-widest text-[10px] mb-3">Reparo de iPad</p>
            <ul class="space-y-2">
              <li><a href="assistencia-ipad-campinas.html" class="hover:text-white/70 transition-colors">Assistência técnica</a></li>
              <li><a href="troca-de-tela-ipad-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Tela</a></li>
              <li><a href="troca-de-bateria-ipad-campinas.html" class="hover:text-white/70 transition-colors">Substituição de Bateria</a></li>
              <li><a href="troca-de-vidro-frontal-ipad-campinas.html" class="hover:text-white/70 transition-colors">Troca de Vidro Frontal</a></li>
              <li><a href="troca-de-vidro-traseiro-ipad-campinas.html" class="hover:text-white/70 transition-colors">Troca de Vidro Traseiro</a></li>
              <li><a href="reparo-de-face-id-ipad-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Face ID</a></li>
              <li><a href="reparo-de-conector-de-carga-ipad-campinas.html" class="hover:text-white/70 transition-colors">Reparo do Conector de Carga</a></li>
              <li><a href="reparo-de-camera-traseira-ipad-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Câmera Traseira</a></li>
              <li><a href="reparo-de-camera-frontal-ipad-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Câmera Frontal</a></li>
              <li><a href="reparo-de-alto-falante-ipad-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Alto-falante</a></li>
              <li><a href="reparo-de-microfone-ipad-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Microfone</a></li>
              <li><a href="reparo-de-botoes-ipad-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Botões</a></li>
              <li><a href="backup-recuperacao-dados-ipad-campinas.html" class="hover:text-white/70 transition-colors">Backup e Recuperação de Dados</a></li>
              <li><a href="atualizacao-reinstalacao-ipados-campinas.html" class="hover:text-white/70 transition-colors">Reinstalação do iPadOS</a></li>
              <li><a href="diagnostico-completo-ipad-campinas.html" class="hover:text-white/70 transition-colors">Diagnóstico Completo</a></li>
            </ul>
          </div>
          <div>
            <p class="text-white/50 font-semibold uppercase tracking-widest text-[10px] mb-3">Reparo de Mac Mini</p>
            <ul class="space-y-2">
              <li><a href="assistencia-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Assistência técnica</a></li>
              <li><a href="reparo-de-placa-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Reparo de Placa Lógica</a></li>
              <li><a href="reballing-de-cpu-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Reballing de CPU</a></li>
              <li><a href="upgrade-do-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Upgrade de Hardware</a></li>
              <li><a href="ins-de-ssd-ou-m-sata-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Instalação de SSD / M.2</a></li>
              <li><a href="limpeza-completa-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Limpeza Interna Completa</a></li>
              <li><a href="reinstalacao-macos-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Reinstalação do macOS</a></li>
              <li><a href="atualizacao-sistema-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Atualização do Sistema</a></li>
              <li><a href="backup-recuperacao-dados-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Backup e Recuperação de Dados</a></li>
              <li><a href="diagnostico-completo-mac-mini-campinas.html" class="hover:text-white/70 transition-colors">Diagnóstico Completo</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p class="text-xs text-white/25">© <span id="year"></span> iPro Assistência Técnica Apple. Todos os direitos reservados.</p>
        <div class="flex items-center gap-4">
          <a href="termos.html" class="text-xs text-white/25 hover:text-white/60 transition-colors">Termos e Condições</a>
          <p class="text-xs text-white/20">Campinas · SP · Brasil</p>
        </div>
      </div>

    </div>
  </footer>`;

  placeholder.insertAdjacentHTML('beforebegin', FOOTER_HTML);
  placeholder.remove();

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
