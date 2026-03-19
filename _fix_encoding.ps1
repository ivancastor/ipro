# Fix double-encoding (mojibake) caused by reading UTF-8 files as CP1252 then writing as UTF-8
# Works by: reading corrupted file as UTF-8 → encoding chars back to Latin-1 → re-decoding as UTF-8

$basePath = "c:\Users\crist\Desktop\projeto-ipro\ipro"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($fileName in @('index.html', 'servicos.html', 'quemSomos.html')) {
    $file = "$basePath\$fileName"

    # 1. Read raw bytes
    $bytes = [System.IO.File]::ReadAllBytes($file)

    # 2. Strip UTF-8 BOM (EF BB BF) if present — added by previous WriteAllText(UTF8)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        $bytes = $bytes[3..($bytes.Length - 1)]
    }

    # 3. Interpret the bytes as UTF-8 to get the mojibake string (Ã³ instead of ó etc.)
    $mojibake = [System.Text.Encoding]::UTF8.GetString($bytes)

    # 4. Re-encode mojibake string to Latin-1 bytes — this recovers the ORIGINAL UTF-8 bytes
    $latin1 = [System.Text.Encoding]::GetEncoding('iso-8859-1')
    $originalBytes = $latin1.GetBytes($mojibake)

    # 5. Decode those original UTF-8 bytes to get the correct Unicode string
    $fixed = [System.Text.Encoding]::UTF8.GetString($originalBytes)

    # 6. Also strip any BOM character from start of string (U+FEFF) just in case
    if ($fixed.Length -gt 0 -and $fixed[0] -eq [char]0xFEFF) {
        $fixed = $fixed.Substring(1)
    }

    # 7. Write back as UTF-8 without BOM
    [System.IO.File]::WriteAllText($file, $fixed, $utf8NoBom)
    Write-Host "$fileName fixed"
}

Write-Host "`nEncoding fix complete."
