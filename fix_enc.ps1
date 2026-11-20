$content = Get-Content .github/workflows/foundation-ci.yml -Raw
$content = $content -replace "âœ…", "✅"
$content = $content -replace "âŒ", "❌"
$content = $content -replace "â›"", "⛔"
$content = $content -replace "â€"", "—"
$content = $content -replace "Â·", "·"
[IO.File]::WriteAllText(".github/workflows/foundation-ci.yml", $content, [Text.Encoding]::UTF8)
