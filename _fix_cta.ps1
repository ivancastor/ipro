$dir = "c:\Users\crist\Desktop\projeto-ipro\ipro"
$files = Get-ChildItem "$dir\*.html" | Where-Object { $_.Name -ne "index.html" -and $_.Name -notlike "assistencia-*" -and $_.Name -ne "quemSomos.html" -and $_.Name -ne "contato.html" }

$newCTA = '    <!-- CTA -->
    <section class="py-16 bg-[#1a1a1a] text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tighter mb-4" data-aos>Atendimento com agendamento</h2>
        <p class="text-lg text-white/50 mb-8" data-aos>Diagn' + [char]0xF3 + 'stico gratuito, atendimento personalizado e garantia de 1 ano.</p>
        <a href="https://api.whatsapp.com/send?phone=5519994063782&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20meu%20atendimento." target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-8 py-4 rounded-full text-[17px] font-semibold hover:scale-105 transition-transform" data-aos>
          Fa' + [char]0xE7 + 'a seu agendamento
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </section>'

$pattern = '(?s)    <!-- CTA -->\s*<section[^>]*>\s*<div class="max-w-4xl[^"]*">\s*<h2[^>]*>[^<]*</h2>\s*<p[^>]*>[^<]*</p>\s*<a[^>]*>.*?</a>\s*</div>\s*</section>'

$updated = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $before = $content
    $content = [regex]::Replace($content, $pattern, $newCTA)
    if ($content -ne $before) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        $updated++
        Write-Host "OK: $($file.Name)"
    } else {
        Write-Host "SKIP: $($file.Name)"
    }
}
Write-Host "`nTotal: $updated"
