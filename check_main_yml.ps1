$c = Get-Content main_yml.txt -Raw; $c.Contains("workflow_dispatch")
