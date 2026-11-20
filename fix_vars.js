const fs = require('fs');
const content = fs.readFileSync('.github/workflows/foundation-ci.yml', 'utf8');
const fixed = content.replace(/\$\{\{ vars\.CI_RUNNER \|\| 'ubuntu-latest' \}\}/g, 'ubuntu-latest');
fs.writeFileSync('.github/workflows/foundation-ci.yml', fixed, 'utf8');
console.log('Fixed vars.CI_RUNNER');
