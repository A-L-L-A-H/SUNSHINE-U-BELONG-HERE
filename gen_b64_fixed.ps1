$c = Get-Content .github/workflows/foundation-ci.yml -Raw; $b = [Text.Encoding]::UTF8.GetBytes($c); $b64 = [Convert]::ToBase64String($b); [IO.File]::WriteAllText("b64_fixed.txt", $b64)
