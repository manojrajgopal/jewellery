import re

with open('d:/infinitewavex/Work/Jewellers/frontend/src/data/services.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r"id:\s*'([^']+)',", r"id: '\g<1>',\n    link: '/services/\g<1>',", content)

with open('d:/infinitewavex/Work/Jewellers/frontend/src/data/services.ts', 'w', encoding='utf-8') as f:
    f.write(content)
