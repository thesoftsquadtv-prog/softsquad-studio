# Character art: returns SVG strings (viewBox 0 0 260 310) per character + mood
import re, os
C=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','chars')+'/'
import os
ns={}
_cwd=os.getcwd(); os.chdir(C)
exec(open(C+'humans.py').read().split("cards=\"\"")[0],ns)
exec(open(C+'chibi.py').read().split("opts=[")[0],ns)
import sys as _s; _s.path.insert(0,C); from adults import person_adult
os.chdir(_cwd)
STYLE=os.environ.get('SQUAD_STYLE','adult')
person=ns['person']; toffee=ns['toffee']; CH=ns['CH']
D={n:kw for n,_,_,kw in CH}
D['Amara']=dict(skin="#8a5a3b",hair_back='<circle cx="60" cy="60" r="36" fill="#2b1d16"/><circle cx="200" cy="60" r="36" fill="#2b1d16"/>',
  hair_front='<path d="M50 120 q10 -78 80 -76 q70 -2 80 76 q-30 -38 -80 -40 q-50 2 -80 40z" fill="#2b1d16"/><path d="M84 46 q18 -8 34 0" stroke="#ffd166" stroke-width="7" fill="none" stroke-linecap="round"/>',
  top="#f4a6b8",top_dark="#e48aa0",pants="#5b6fa8",shoes="#ffffff")
def char(name,mood,deco=True):
    s=toffee(mood) if name=="Toffee" else (person_adult(name,mood) if STYLE=="adult" else person(mood,**D[name]))
    if not deco:  # strip the little star/heart/squiggle decorations
        s=re.sub(r'<g fill="#ffd166">.*?</g>','',s,flags=re.S)
        s=re.sub(r'<g stroke="#8a86a8".*?</g>','',s,flags=re.S)
        s=re.sub(r'<path d="M210 55 c0 -11.*?/>','',s,flags=re.S)
    return f'<svg viewBox="0 0 260 310" width="100%" height="100%" overflow="visible">{s}</svg>'
