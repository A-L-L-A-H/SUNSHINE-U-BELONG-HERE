$b64 = Get-Content b64_fixed.txt -Raw; $bytes = [Convert]::FromBase64String($b64); $text = [Text.Encoding]::UTF8.GetString($bytes); Set-Content -Path decoded_fixed.txt -Value $text -Encoding UTF8
