$basePath = "c:\Users\crist\Desktop\projeto-ipro\ipro"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$oacute = [char]0x00F3  # ó — avoids PS1 file encoding issues

# ====================================================================================
# 1. index.html — add .nav-card img filter
# ====================================================================================
$file = "$basePath\index.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$c = $c.Replace(
    ".nav-item:hover .nav-card {`n      opacity: 1;`n      transform: translateX(-50%) translateY(0);`n    }`n`n    /* ===== Mobile menu slide from right ===== */",
    ".nav-item:hover .nav-card {`n      opacity: 1;`n      transform: translateX(-50%) translateY(0);`n    }`n    .nav-card img { filter: brightness(0) invert(1); }`n`n    /* ===== Mobile menu slide from right ===== */"
)
[System.IO.File]::WriteAllText($file, $c, $utf8NoBom)
Write-Host "index.html done"

# ====================================================================================
# Shared replacement blocks (same for servicos + quemSomos)
# ====================================================================================

$newNav = @"
      <!-- Menu Links (desktop: icon + hover card) -->
      <nav class="hidden md:flex items-center gap-1">
        <!-- Reparos -->
        <div class="nav-item">
          <a href="servicos.html" class="nav-icon-btn" aria-label="Reparos">
            <img src="images/chave-simples.svg"        width="26" height="26" alt="">
          </a>
          <div class="nav-card"><img src="images/chave-simples.svg"        style="flex-shrink:0;" width="14" height="14" alt="">Reparos</div>
        </div>
        <!-- Atendimento -->
        <div class="nav-item">
          <a href="https://api.whatsapp.com/send?phone=5519996666898&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento." target="_blank" rel="noopener" class="nav-icon-btn" aria-label="Atendimento">
            <img src="images/comentario-alt-middle.svg" width="24" height="24" alt="">
          </a>
          <div class="nav-card"><img src="images/comentario-alt-middle.svg" style="flex-shrink:0;" width="14" height="14" alt="">Atendimento</div>
        </div>
        <!-- Nossa hist${oacute}ria -->
        <div class="nav-item">
          <a href="quemSomos.html" class="nav-icon-btn" aria-label="Nossa hist${oacute}ria">
            <img src="images/livro-aberto-capa.svg"    width="26" height="22" alt="">
          </a>
          <div class="nav-card"><img src="images/livro-aberto-capa.svg"    style="flex-shrink:0;" width="14" height="11" alt="">Nossa hist${oacute}ria</div>
        </div>
        <!-- Depoimentos -->
        <div class="nav-item">
          <a href="index.html#depoimentos" class="nav-icon-btn" aria-label="Depoimentos">
            <img src="images/feixe-de-sorriso.svg"     width="24" height="24" alt="">
          </a>
          <div class="nav-card"><img src="images/feixe-de-sorriso.svg"     style="flex-shrink:0;" width="14" height="14" alt="">Depoimentos</div>
        </div>
        <!-- Contato -->
        <div class="nav-item">
          <a href="https://api.whatsapp.com/send?phone=5519996666898&text=Ol%C3%A1!%20Vim%20do%20site.%20" target="_blank" rel="noopener" class="nav-icon-btn" aria-label="Contato">
            <img src="images/circulo-telefone-flip.svg" width="22" height="24" alt="">
          </a>
          <div class="nav-card"><img src="images/circulo-telefone-flip.svg" style="flex-shrink:0;" width="13" height="15" alt="">Contato</div>
        </div>
      </nav>
"@

$newCssBlock = @"
    .nav-item:hover .nav-card {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .nav-card img { filter: brightness(0) invert(1); }

    /* ===== Mobile menu slide from right ===== */
    #mobile-backdrop {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #mobile-backdrop.menu-open {
      opacity: 1;
      pointer-events: auto;
    }
    #mobile-menu {
      transform: translateX(100%);
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #mobile-menu.menu-open {
      transform: translateX(0);
    }
    .mob-item {
      color: #0d1b2e;
      text-decoration: none;
    }
    .mob-item.mob-active {
      color: #0d1b2e;
    }
    .mob-icon {
      width: 2.5rem !important;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      flex-shrink: 0;
      border-radius: 10px;
      color: #0d1b2e;
      transition: background 0.2s, color 0.2s;
    }
    .mob-item.mob-active .mob-icon {
      background: #0d1b2e;
      color: white;
    }
    .mob-item.mob-active .mob-icon img {
      filter: brightness(0) invert(1);
    }
  </style>
"@

$newJsBlock = @"
    document.getElementById('year').textContent = new Date().getFullYear();

    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-backdrop');
    const closeBtn = document.getElementById('mobile-menu-close-btn');
    const spans = btn.querySelectorAll('span');
    let isOpen = false;

    function openMenu() {
      isOpen = true;
      menu.classList.add('menu-open');
      backdrop.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    }

    function closeMenu() {
      isOpen = false;
      menu.classList.remove('menu-open');
      backdrop.classList.remove('menu-open');
      document.body.style.overflow = '';
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }

    btn.addEventListener('click', () => { isOpen ? closeMenu() : openMenu(); });
    closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => { if (isOpen) closeMenu(); });
    });

    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('border-apple-border');
        nav.classList.remove('border-transparent');
      } else {
        nav.classList.remove('border-apple-border');
        nav.classList.add('border-transparent');
      }
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
"@

$mobilePanelCore = @"

  </div>
  </header>

  <!-- Mobile backdrop -->
  <div class="fixed inset-0 bg-black/50 z-40" id="mobile-backdrop"></div>

  <!-- Mobile Menu Panel -->
  <div class="fixed top-0 right-0 h-full w-[68%] max-w-xs bg-white z-50 flex flex-col" id="mobile-menu">

    <!-- Panel header: logo + close -->
    <div class="flex items-center justify-between px-5 pt-6 pb-5">
      <a href="index.html">
        <img src="images/logonova.png" alt="iPro" style="height:32px;width:auto;object-fit:contain;">
      </a>
      <button id="mobile-menu-close-btn" class="w-9 h-9 flex items-center justify-center text-[#1a1a1a] text-lg focus:outline-none" aria-label="Fechar menu">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Nav Items -->
    <nav class="flex flex-col px-6 flex-1 justify-start pt-10 gap-1">
"@

$mobItemsServicos = @"
      <a href="servicos.html" class="mob-item mob-active flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/chave-simples.svg"        width="26" height="26" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Reparos</span>
      </a>
      <a href="https://api.whatsapp.com/send?phone=5519996666898&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento." target="_blank" rel="noopener" class="mob-item flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/comentario-alt-middle.svg" width="24" height="24" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Atendimento</span>
      </a>
      <a href="quemSomos.html" class="mob-item flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/livro-aberto-capa.svg"    width="26" height="22" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Nossa hist${oacute}ria</span>
      </a>
      <a href="index.html#depoimentos" class="mob-item flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/feixe-de-sorriso.svg"     width="24" height="24" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Depoimentos</span>
      </a>
      <a href="https://api.whatsapp.com/send?phone=5519996666898&text=Ol%C3%A1!%20Vim%20do%20site.%20" target="_blank" rel="noopener" class="mob-item flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/circulo-telefone-flip.svg" width="22" height="24" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Contato</span>
      </a>
"@

$mobItemsQuem = @"
      <a href="servicos.html" class="mob-item flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/chave-simples.svg"        width="26" height="26" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Reparos</span>
      </a>
      <a href="https://api.whatsapp.com/send?phone=5519996666898&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento." target="_blank" rel="noopener" class="mob-item flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/comentario-alt-middle.svg" width="24" height="24" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Atendimento</span>
      </a>
      <a href="quemSomos.html" class="mob-item mob-active flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/livro-aberto-capa.svg"    width="26" height="22" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Nossa hist${oacute}ria</span>
      </a>
      <a href="index.html#depoimentos" class="mob-item flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/feixe-de-sorriso.svg"     width="24" height="24" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Depoimentos</span>
      </a>
      <a href="https://api.whatsapp.com/send?phone=5519996666898&text=Ol%C3%A1!%20Vim%20do%20site.%20" target="_blank" rel="noopener" class="mob-item flex items-center gap-2 py-[13px]">
        <span class="mob-icon flex items-center justify-center shrink-0">
          <img src="images/circulo-telefone-flip.svg" width="22" height="24" alt="">
        </span>
        <span class="text-[15px] font-medium whitespace-nowrap">Contato</span>
      </a>
"@

$mobilePanelEnd = @"
    </nav>

    <!-- WhatsApp CTA -->
    <div class="px-5 pb-8 pt-4">
      <a href="https://api.whatsapp.com/send?phone=5519996666898&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento." target="_blank" rel="noopener"
         class="flex items-center justify-center gap-3 w-full bg-[#1a6cff] hover:bg-[#005de8] active:bg-[#004cc5] text-white text-[15px] font-semibold rounded-2xl px-6 py-4 transition-colors duration-200">
        <i class="fa-brands fa-whatsapp text-xl"></i>
        Agendar atendimento
      </a>
    </div>

  </div>
"@

$mobilePanelServicos = $mobilePanelCore + $mobItemsServicos + $mobilePanelEnd
$mobilePanelQuem     = $mobilePanelCore + $mobItemsQuem     + $mobilePanelEnd

$oldCssEnding = "    .nav-item:hover .nav-card {`n      opacity: 1;`n      transform: translateX(-50%) translateY(0);`n    }`n  </style>"

$oldJsBlock = @"
    document.getElementById('year').textContent = new Date().getFullYear();

    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const spans = btn.querySelectorAll('span');
    let isOpen = false;

    btn.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        document.body.style.overflow = 'hidden';
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        document.body.style.overflow = '';
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if(isOpen) btn.click();
      });
    });

    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('border-apple-border');
        nav.classList.remove('border-transparent');
      } else {
        nav.classList.remove('border-apple-border');
        nav.classList.add('border-transparent');
      }
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
"@

# ====================================================================================
# PROCESS servicos.html
# ====================================================================================
$file = "$basePath\servicos.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Font Awesome CDN
$c = $c.Replace(
    '  <script src="https://cdn.tailwindcss.com"></script>',
    "  <link rel=`"stylesheet`" href=`"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css`" crossorigin=`"anonymous`" />`n  <script src=`"https://cdn.tailwindcss.com`"></script>"
)

# 2. CSS: add nav-card img filter + mobile CSS
$c = $c.Replace($oldCssEnding, $newCssBlock)

# 3. Replace desktop nav (regex since block contains large SVGs)
$c = [regex]::Replace($c, '(?s)      <!-- Menu Links \(desktop: icon \+ hover card\) -->.*?      </nav>', $newNav.TrimEnd())

# 4. Replace mobile overlay + properly close header + add new panel
$c = [regex]::Replace($c, '(?s)\r?\n    <!-- Mobile Menu Overlay -->.*?\r?\n  </header>', $mobilePanelServicos)

# 5. Replace JS
$c = $c.Replace($oldJsBlock, $newJsBlock)

[System.IO.File]::WriteAllText($file, $c, $utf8NoBom)
Write-Host "servicos.html done"

# ====================================================================================
# PROCESS quemSomos.html
# ====================================================================================
$file = "$basePath\quemSomos.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Font Awesome CDN
$c = $c.Replace(
    '  <script src="https://cdn.tailwindcss.com"></script>',
    "  <link rel=`"stylesheet`" href=`"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css`" crossorigin=`"anonymous`" />`n  <script src=`"https://cdn.tailwindcss.com`"></script>"
)

# 2. CSS
$c = $c.Replace($oldCssEnding, $newCssBlock)

# 3. Replace desktop nav
$c = [regex]::Replace($c, '(?s)      <!-- Menu Links \(desktop: icon \+ hover card\) -->.*?      </nav>', $newNav.TrimEnd())

# 4. Replace mobile overlay + add new panel
$c = [regex]::Replace($c, '(?s)\r?\n    <!-- Mobile Menu Overlay -->.*?\r?\n  </header>', $mobilePanelQuem)

# 5. Replace JS
$c = $c.Replace($oldJsBlock, $newJsBlock)

[System.IO.File]::WriteAllText($file, $c, $utf8NoBom)
Write-Host "quemSomos.html done"

Write-Host "`nAll files updated successfully."
