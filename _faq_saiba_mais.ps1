$dir = "C:\Users\crist\Desktop\projeto-ipro\ipro"
$cc = [char]0x00e7   # c cedilla
$ot = [char]0x00f5   # o tilde
$q  = '"'
$n  = "`n"

$files = Get-ChildItem $dir -Filter "*.html" | Where-Object {
    $_.Name -notmatch '^(index|contato|servicos|seminovos|quemSomos|admin)'
}

$arrowBlue   = "<svg class=${q}w-4 h-4 text-[#1a6cff] group-hover:translate-x-1 transition-transform${q} fill=${q}none${q} viewBox=${q}0 0 24 24${q} stroke=${q}currentColor${q} stroke-width=${q}2.5${q}><path stroke-linecap=${q}round${q} stroke-linejoin=${q}round${q} d=${q}M13 7l5 5m0 0l-5 5m5-5H6${q}/></svg>"
$arrowOrange = "<svg class=${q}w-4 h-4 text-[#ff9800] group-hover:translate-x-1 transition-transform${q} fill=${q}none${q} viewBox=${q}0 0 24 24${q} stroke=${q}currentColor${q} stroke-width=${q}2.5${q}><path stroke-linecap=${q}round${q} stroke-linejoin=${q}round${q} d=${q}M13 7l5 5m0 0l-5 5m5-5H6${q}/></svg>"

$smBlue   = "${n}            <div class=${q}mt-4 pt-3 border-t border-[#f0eeeb] flex items-center justify-between${q}>${n}              <span class=${q}text-sm font-semibold text-[#1a6cff]${q}>Saiba mais</span>${n}              ${arrowBlue}${n}            </div>"
$smOrange = "${n}            <div class=${q}mt-4 pt-3 border-t border-[#f0eeeb] flex items-center justify-between${q}>${n}              <span class=${q}text-sm font-semibold text-[#ff9800]${q}>Saiba mais</span>${n}              ${arrowOrange}${n}            </div>"

$count = 0
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $c = $c.Replace("`r`n", "`n")

    # 1. Add flex flex-col to the 3 FAQ card buttons
    foreach ($popup in @('faqPrazo', 'faqPagamento', 'faqAtencao')) {
        $btnOld = "onclick=${q}openFaqPopup('$popup')${q} class=${q}group bg-white rounded-2xl p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#e0ddd9]${q}>"
        $btnNew = "onclick=${q}openFaqPopup('$popup')${q} class=${q}group bg-white rounded-2xl p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#e0ddd9] flex flex-col${q}>"
        $c = $c.Replace($btnOld, $btnNew)
    }

    # 2. Prazo card — add Saiba mais (blue)
    $oldPrazo = "<p class=${q}text-sm text-[#999]${q}>Confira prazos e agendamento</p>${n}          </button>"
    $newPrazo = "<p class=${q}text-sm text-[#999] flex-1${q}>Confira prazos e agendamento</p>${smBlue}${n}          </button>"
    $c = $c.Replace($oldPrazo, $newPrazo)

    # 3. Pagamento card — add Saiba mais (blue)
    $pagText = "Veja op${cc}${ot}es e parcelamento"
    $oldPag = "<p class=${q}text-sm text-[#999]${q}>${pagText}</p>${n}          </button>"
    $newPag = "<p class=${q}text-sm text-[#999] flex-1${q}>${pagText}</p>${smBlue}${n}          </button>"
    $c = $c.Replace($oldPag, $newPag)

    # 4. Atencao card — add Saiba mais (orange)
    $atcText = "Termos e condi${cc}${ot}es do servi${cc}o"
    $oldAtc = "<p class=${q}text-sm text-[#999]${q}>${atcText}</p>${n}          </button>"
    $newAtc = "<p class=${q}text-sm text-[#999] flex-1${q}>${atcText}</p>${smOrange}${n}          </button>"
    $c = $c.Replace($oldAtc, $newAtc)

    [System.IO.File]::WriteAllText($f.FullName, $c, [System.Text.Encoding]::UTF8)
    $count++
}
Write-Host "Done! $count files updated."
