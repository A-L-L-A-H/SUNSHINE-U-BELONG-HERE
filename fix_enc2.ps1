$c = Get-Content .github/workflows/foundation-ci.yml -Raw
$c = $c -replace ([char]0xE2 + [char]0x9C + [char]0x8D), "✅"
$c = $c -replace ([char]0xE2 + [char]0x9D + [char]0x92), "❌"
$c = $c -replace ([char]0xE2 + [char]0x9A + [char]0x9C), "⛔"
$c = $c -replace ([char]0xE2 + [char]0x80 + [char]0x94), "—"
$c = $c -replace ([char]0xC2 + [char]0xB7), "·"
[IO.File]::WriteAllText(".github/workflows/foundation-ci.yml", $c, [Text.Encoding]::UTF8)
