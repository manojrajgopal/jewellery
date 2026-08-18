import re

with open('d:/infinitewavex/Work/Jewellers/frontend/src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix categories
content = re.sub(r"category:\s*'Necklaces'", "category: 'necklaces'", content)
content = re.sub(r"category:\s*'Rings'", "category: 'rings'", content)
content = re.sub(r"category:\s*'Bracelets'", "category: 'bracelets'", content)
content = re.sub(r"category:\s*'Earrings'", "category: 'earrings'", content)
content = re.sub(r"category:\s*'Sets'", "category: 'sets'", content)

# Fix metals
content = re.sub(r"metal:\s*'22K Gold'", "metal: 'gold'", content)
content = re.sub(r"metal:\s*'18K Rose Gold'", "metal: 'rose-gold'", content)
content = re.sub(r"metal:\s*'Platinum'", "metal: 'platinum'", content)
content = re.sub(r"metal:\s*'18K White Gold'", "metal: 'platinum'", content)
content = re.sub(r"metal:\s*'24K Gold'", "metal: 'gold'", content)
content = re.sub(r"metal:\s*'18K Yellow Gold'", "metal: 'gold'", content)
content = re.sub(r"metal:\s*'14K Gold'", "metal: 'gold'", content)
content = re.sub(r"metal:\s*'22K Antique Gold'", "metal: 'gold'", content)

# Fix prices
def format_price(match):
    price = int(match.group(1))
    s = str(price)
    # format with indian commas e.g. 845000 -> 8,45,000
    if len(s) > 3:
        last3 = s[-3:]
        rest = s[:-3]
        groups = []
        while len(rest) > 2:
            groups.append(rest[-2:])
            rest = rest[:-2]
        if rest:
            groups.append(rest)
        groups.reverse()
        formatted = ','.join(groups) + ',' + last3
    else:
        formatted = s
    return f"price: '₹{formatted}'"

content = re.sub(r'price:\s*(\d+)', format_price, content)

with open('d:/infinitewavex/Work/Jewellers/frontend/src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)
