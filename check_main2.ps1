$c = (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/A-L-L-A-H/SUNSHINE-U-BELONG-HERE/main/.github/workflows/foundation-ci.yml" -UseBasicParsing).Content; $c.Contains("workflow_dispatch")
