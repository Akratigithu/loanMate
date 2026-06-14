import re
from pathlib import Path
src = Path('js/app.js').read_text(encoding='utf8')
en_match = re.search(r'en:\s*\{([\s\S]*?)\},\s*hi:', src)
hi_match = re.search(r'hi:\s*\{([\s\S]*?)\}\s*\};', src)
if not en_match or not hi_match:
    raise SystemExit(f'parse fail en={bool(en_match)} hi={bool(hi_match)}')
pattern = re.compile(r'^\s*([a-zA-Z0-9_]+):', re.MULTILINE)
en_keys = [m.group(1) for m in pattern.finditer(en_match.group(1))]
hi_keys = [m.group(1) for m in pattern.finditer(hi_match.group(1))]
dup = lambda keys: sorted({k for k in keys if keys.count(k) > 1})
print('EN duplicates', dup(en_keys))
print('HI duplicates', dup(hi_keys))
only_en = sorted(set(en_keys) - set(hi_keys))
only_hi = sorted(set(hi_keys) - set(en_keys))
print('onlyEn', len(only_en), only_en)
print('onlyHi', len(only_hi), only_hi)
print('EN count', len(en_keys), 'HI count', len(hi_keys))
