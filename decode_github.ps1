$content = gh api repos/A-L-L-A-H/SUNSHINE-U-BELONG-HERE/contents/.github/workflows/foundation-ci.yml --jq ".content"
$bytes = [Convert]::FromBase64String($content)
$text = [Text.Encoding]::UTF8.GetString($bytes)
Set-Content -Path github_file.txt -Value $text -Encoding UTF8
