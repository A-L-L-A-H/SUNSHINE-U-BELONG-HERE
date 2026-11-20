path = 'z:/repo/A-L-L-A-H/moonwitness-main/packages/moon-witness/src/services/rag-pipeline.ts'
content = open(path, 'r', encoding='utf-8').read()
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'return Berdasarkan' in line or 'return \\Berdasarkan' in line:
        lines[i] = '    return `Berdasarkan ${top.reference}: ${top.text_en ?? top.text_ar ?? \'\'}`'
content = '\n'.join(lines)
open(path, 'w', encoding='utf-8').write(content)
print('Done')
