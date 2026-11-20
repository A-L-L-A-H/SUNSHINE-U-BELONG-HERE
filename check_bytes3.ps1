$c = Get-Content .github/workflows/foundation-ci.yml -Raw
$bytes = [Text.Encoding]::UTF8.GetBytes($c)
for ($i=0; $i -lt $bytes.Length; $i++) {
  if ($bytes[$i] -gt 127) {
    Write-Host ("Byte {0}: {1}" -f $i, $bytes[$i])
  }
}
