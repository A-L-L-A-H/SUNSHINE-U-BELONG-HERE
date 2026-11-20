@
 = Get-Content .github/workflows/foundation-ci.yml -Raw
 = [System.Text.Encoding]::UTF8.GetBytes()
 = [System.Convert]::ToBase64String()
gh api repos/A-L-L-A-H/SUNSHINE-U-BELONG-HERE/contents/.github/workflows/foundation-ci.yml -X PUT -f message=\ ci: create Foundation CI workflow fresh\ -f content= -f sha=\e69de29bb2d1d6434b8b29ae775ad8c2e48c5391\
@
