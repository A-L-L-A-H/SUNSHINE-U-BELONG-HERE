$b64 = Get-Content b64.txt -Raw; $bytes = [Convert]::FromBase64String($b64); $text = [Text.Encoding]::UTF8.GetString($bytes); Set-Content -Path decoded.txt -Value $text -Encoding UTF8
