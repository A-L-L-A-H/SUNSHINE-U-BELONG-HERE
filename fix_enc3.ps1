$c = Get-Content .github/workflows/foundation-ci.yml -Raw
$c = $c -replace "âœ…", "✅"
$c = $c -replace "âŒ", "❌"
$c = $c -replace "â›\"", "⛔"
$c = $c -replace "â€", "—"
$c = $c -replace "Â·", "·"
Set-Content -Path .github/workflows/foundation-ci.yml -Value $c -Encoding UTF8
