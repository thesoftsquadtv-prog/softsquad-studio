# Young-adult Soft Squad designs (same 260x310 box so the engine is unchanged).
# Grown-up proportions + layered, current outfits (jackets over tops, wide trousers, midi dress, sneakers, bags, jewellery).
INK="#2a2438"
def face(m,skin,lashes=False):
    s=f'<ellipse cx="91" cy="66" rx="6" ry="9" fill="{skin}"/><ellipse cx="169" cy="66" rx="6" ry="9" fill="{skin}"/>'
    s+=f'<ellipse cx="130" cy="62" rx="38" ry="43" fill="{skin}"/>'
    lash=lambda x:(f'<path d="M{x-6} 59 l-4 -3 M{x+6} 59 l4 -3" stroke="{INK}" stroke-width="2" stroke-linecap="round"/>' if lashes else '')
    if m=="read":   # awake, gazing down at the page: big soft brown eyes under relaxed lids
        for x,o in ((115,-1),(145,1)):
            s+=f'<g transform="translate({x} 70) scale(1.0) translate({-x} -70)">'
            s+=f'<path d="M{x-8} 66 q8 -2.5 16 0 q-1 12 -8 12 q-7 0 -8 -12z" fill="#ffffff"/>'
            s+=f'<ellipse cx="{x}" cy="72.5" rx="5.6" ry="6" fill="#6b4352"/>'
            s+=f'<ellipse cx="{x}" cy="73.5" rx="3.2" ry="3.6" fill="#2e1f2a"/>'
            s+=f'<circle cx="{x+2}" cy="71" r="1.9" fill="#fff"/><circle cx="{x-2}" cy="75.5" r="0.9" fill="#fff" opacity=".8"/>'
            s+=f'<path d="M{x-8} 66 q8 -2.5 16 0 v-6 h-16z" fill="{skin}"/>'
            s+=f'<path d="M{x-8.6} 66.2 q8.6 -3.4 17.2 0" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
            s+=f'<path d="M{x+o*8.6} 66.2 l{o*3.4} -2.2" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>'
            s+='</g>'
        s+=f'<path d="M108 55 q7 -3 14 -1 M138 54 q7 -2 14 1" stroke="{INK}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".65"/>'
        s+=f'<path d="M124 84 q6 4 12 0" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
        s+='<ellipse cx="104" cy="81" rx="8" ry="4" fill="#ff8fa3" opacity=".24"/><ellipse cx="156" cy="81" rx="8" ry="4" fill="#ff8fa3" opacity=".24"/>'
    elif m=="sleep":
        s+=f'<path d="M108 66 q7 4 14 0 M138 66 q7 4 14 0" stroke="{INK}" stroke-width="3" fill="none" stroke-linecap="round"/>'
        s+=f'<ellipse cx="130" cy="85" rx="3.4" ry="4" fill="#b5566a"/>'
    elif m=="calm":
        s+=f'<path d="M108 64 q7 6 14 0 M138 64 q7 6 14 0" stroke="{INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
        s+=f'<path d="M123 82 q7 5 14 0" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
        s+=f'<path d="M107 53 q8 -4 15 -2 M138 51 q7 -2 15 2" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>'
    elif m=="happy":
        s+=f'<path d="M108 66 q7 -9 14 0 M138 66 q7 -9 14 0" stroke="{INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
        s+=f'<path d="M120 80 q10 11 20 0z" fill="#d9606c" stroke="{INK}" stroke-width="2.4" stroke-linejoin="round"/>'
        s+=f'<path d="M107 53 q8 -5 15 -2 M138 51 q7 -3 15 2" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>'
    elif m=="listen":  # "wait… where is that coming from?": eyes glancing to the side, brows up, small o mouth
        for x in (115,145): s+=f'<ellipse cx="{x}" cy="65" rx="5.4" ry="7" fill="{INK}" transform="translate(-3 0)"/><circle cx="{x-1}" cy="62.4" r="2.1" fill="#fff"/>'+lash(x)
        s+=f'<path d="M107 50 q8 -6 15 -3 M138 47 q7 -3 15 3" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
        s+=f'<ellipse cx="131" cy="85" rx="4.2" ry="5" fill="#b5566a" stroke="{INK}" stroke-width="2"/>'
    elif m=="forced":  # rehearsed "everything's great!": wide eyes, brows up, big stiff toothy grin, sweat drop
        for x in (115,145): s+=f'<ellipse cx="{x}" cy="64" rx="6.2" ry="8" fill="{INK}"/><circle cx="{x+2}" cy="61" r="2.3" fill="#fff"/>'+lash(x)
        s+=f'<path d="M106 48 q8 -6 16 -3 M138 45 q8 -3 16 3" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
        s+=f'<path d="M115 79 h30 q0 11 -15 11 q-15 0 -15 -11z" fill="#ffffff" stroke="{INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M116 80 h28" stroke="{INK}" stroke-width="1.4" opacity=".35"/>'
        s+='<path d="M161 54 q-5 8 0 12 q5 -4 0 -12z" fill="#8cc4f0"/>'
    elif m=="deadpan":  # unimpressed: heavy half-closed lids, flat brows, flat mouth
        for x in (115,145):
            s+=f'<ellipse cx="{x}" cy="67" rx="5.4" ry="6.2" fill="{INK}"/><circle cx="{x+1.6}" cy="68.6" r="1.6" fill="#fff"/>'
            s+=f'<path d="M{x-8} 66.5 h16 v-10 h-16z" fill="{skin}"/><path d="M{x-7.6} 66.6 h15.2" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"/>'
        s+=f'<path d="M107 55 h15 M138 55 h15" stroke="{INK}" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>'
        s+=f'<path d="M124 84 h12" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"/>'
    elif m=="sad":
        for x in (115,145): s+=f'<ellipse cx="{x}" cy="66" rx="5" ry="6.5" fill="{INK}"/><circle cx="{x+1.8}" cy="63.5" r="1.9" fill="#fff"/>'+lash(x)
        s+=f'<path d="M107 56 L122 51 M153 56 L138 51" stroke="{INK}" stroke-width="2.8" stroke-linecap="round"/>'
        s+=f'<path d="M123 89 q7 -6 14 0" stroke="{INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>'
        s+='<path d="M113 74 q-3 6 0 9 q3 -3 0 -9z" fill="#8cc4f0"/>'
    else:
        for x in (115,145): s+=f'<ellipse cx="{x}" cy="65" rx="5.4" ry="7" fill="{INK}"/><circle cx="{x+2}" cy="62.4" r="2.1" fill="#fff"/>'+lash(x)
        s+=f'<path d="M107 53 q8 -5 15 -2 M138 51 q7 -3 15 2" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
        s+=f'<path d="M121 81 q9 8 18 0" stroke="{INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>'
    s+='<ellipse cx="105" cy="78" rx="7" ry="3.4" fill="#ff8fa3" opacity=".25"/><ellipse cx="155" cy="78" rx="7" ry="3.4" fill="#ff8fa3" opacity=".25"/>'
    return s
def arms(m,col,skin,cuff=None):
    if m=="happy":   P=["M94 120 q-32 -6 -42 -58","M166 120 q32 -6 42 -58"]; ends=[(52,62),(208,62)]
    elif m=="sad":   P=["M94 120 q-12 50 30 60","M166 120 q12 50 -30 60"]; ends=[(124,180),(136,180)]
    elif m=="listen": P=["M94 120 q-12 42 -6 80","M166 120 q26 -12 12 -50"]; ends=[(88,200),(176,70)]
    elif m=="forced": # left arm stiff at side, right fist thumbs-up at chest height
        s=f'<path d="M94 120 q-10 40 -6 78" stroke="{col}" stroke-width="17" fill="none" stroke-linecap="round"/><path d="M166 120 q24 26 20 -10" stroke="{col}" stroke-width="17" fill="none" stroke-linecap="round"/>'
        if cuff: s+=f'<circle cx="88" cy="198" r="9.5" fill="{cuff}"/><circle cx="186" cy="110" r="9.5" fill="{cuff}"/>'
        s+=f'<circle cx="88" cy="198" r="8" fill="{skin}"/>'
        # thumbs-up seen from the front: curled fingers stacked as a rounded block, thumb rising from its top inner (body-side) corner, tilted out
        s+=f'<path d="M181 92 q-1.5 -9 1 -12 q3 -3 5.5 0 q1.5 4 0.5 12z" fill="{skin}" stroke="rgba(0,0,0,.22)" stroke-width="1"/>'
        s+=f'<rect x="178" y="91" width="19" height="19" rx="7" fill="{skin}"/>'
        s+=f'<path d="M186 96.5 h10 M186 101 h10.5 M186 105.5 h10" stroke="rgba(0,0,0,.2)" stroke-width="1.3" stroke-linecap="round"/>'
        s+=f'<path d="M180 94 q3 3 6 2" stroke="rgba(0,0,0,.2)" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
        return s
    elif m=="deadpan": # arms crossed over the chest, the right forearm on top
        s=f'<path d="M94 120 q-12 30 4 38 q22 6 52 -4" stroke="{col}" stroke-width="17" fill="none" stroke-linecap="round"/>'
        s+=f'<circle cx="152" cy="153" r="7.5" fill="{skin}"/>'
        s+=f'<path d="M166 120 q12 32 -4 42 q-22 8 -50 0" stroke="{col}" stroke-width="17" fill="none" stroke-linecap="round"/>'
        s+=f'<circle cx="108" cy="162" r="7.5" fill="{skin}"/>'
        return s
    elif m=="calm":  P=["M94 120 q-6 40 20 70","M166 120 q6 40 -20 70"]; ends=[(114,190),(146,190)]
    else:            P=["M94 120 q-14 42 -8 82","M166 120 q34 -8 42 -56"]; ends=[(86,202),(208,64)]
    s="".join(f'<path d="{p}" stroke="{col}" stroke-width="17" fill="none" stroke-linecap="round"/>' for p in P)
    if cuff: s+="".join(f'<circle cx="{x}" cy="{y}" r="9.5" fill="{cuff}"/>' for x,y in ends)
    s+="".join(f'<circle cx="{x}" cy="{y}" r="8" fill="{skin}"/>' for x,y in ends)
    return s
def sneakers(c,sole="#ffffff"):
    return (f'<path d="M96 284 q0 -8 12 -8 h10 q8 0 10 10 v6 h-32z" fill="{c}"/><path d="M132 286 q2 -10 10 -10 h10 q12 0 12 8 v8 h-32z" fill="{c}"/>'
            f'<rect x="94" y="290" width="36" height="6" rx="3" fill="{sole}"/><rect x="130" y="290" width="36" height="6" rx="3" fill="{sole}"/>')
def bottoms(kind,c,skin):
    if kind=="wide":  return f'<path d="M98 194 h31 l1 90 h-38z M131 194 h31 l6 90 h-38z" fill="{c}"/><path d="M130 200 v80" stroke="rgba(0,0,0,.12)" stroke-width="2"/>'
    if kind=="cargo": return f'<rect x="101" y="194" width="27" height="92" rx="9" fill="{c}"/><rect x="132" y="194" width="27" height="92" rx="9" fill="{c}"/><rect x="104" y="232" width="14" height="16" rx="3" fill="rgba(0,0,0,.12)"/><rect x="142" y="232" width="14" height="16" rx="3" fill="rgba(0,0,0,.12)"/>'
    if kind=="dress": return f'<path d="M100 194 h60 l14 66 q-44 10 -88 0z" fill="{c}"/><rect x="110" y="258" width="14" height="28" rx="6" fill="{skin}"/><rect x="136" y="258" width="14" height="28" rx="6" fill="{skin}"/>'
    return f'<rect x="102" y="194" width="25" height="92" rx="10" fill="{c}"/><rect x="133" y="194" width="25" height="92" rx="10" fill="{c}"/>'
def outfit(top,jacket=None,jl=None):
    s=f'<path d="M92 122 q2 -16 22 -18 h32 q20 2 22 18 l-4 76 q-34 6 -68 0z" fill="{top}"/>'
    if jacket:  # open jacket/cardigan over the top
        jl=jl or jacket
        s+=f'<path d="M92 122 q2 -16 22 -18 h6 l6 96 q-17 2 -34 -2z" fill="{jacket}"/><path d="M168 122 q-2 -16 -22 -18 h-6 l-6 96 q17 2 34 -2z" fill="{jacket}"/>'
        s+=f'<path d="M114 104 l8 26 l-6 4z M146 104 l-8 26 l6 4z" fill="{jl}"/>'
    return s
def adult(m,skin,top,bottom_c,shoe_c,no_arms=False,bottom="slim",jacket=None,lapel=None,sleeve=None,hair_back="",hair_front="",extra_back="",extra="",lashes=False,belt=None,strap=""):
    sh='<ellipse cx="130" cy="298" rx="62" ry="8" fill="#000" opacity=".08"/>'
    neck=f'<rect x="121" y="96" width="18" height="16" rx="6" fill="{skin}"/>'
    b=bottoms(bottom,bottom_c,skin)+sneakers(shoe_c)
    belt_s=f'<rect x="98" y="192" width="64" height="7" rx="3" fill="{belt}"/><rect x="126" y="191" width="9" height="9" rx="2" fill="#ffd166"/>' if belt else ''
    return sh+hair_back+extra_back+b+outfit(top,jacket,lapel)+belt_s+neck+strap+('' if no_arms else arms(m,sleeve or jacket or top,skin))+face(m,skin,lashes)+hair_front+extra

HAIR={
 # Milo: oversized sage hoodie under an open denim jacket, cargo trousers, chunky sneakers, crossbody bag
 "Milo":dict(skin="#f2c9a5",top="#a8cfac",jacket="#6f8fb8",lapel="#5c7aa2",bottom="cargo",bottom_c="#4a4e5e",shoe_c="#f4f1ea",
   strap='<path d="M100 112 l62 82" stroke="#3b3540" stroke-width="5" stroke-linecap="round"/><rect x="152" y="182" width="26" height="20" rx="6" fill="#3b3540"/>',
   extra='<path d="M110 106 q20 14 40 0" stroke="#8fbf95" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M126 114 v18 M134 114 v18" stroke="#f4f1ea" stroke-width="2.6" stroke-linecap="round"/>'
         '<path d="M90 62 q-6 -48 40 -48 q46 0 40 48 q-8 -18 -20 -23 q2 10 -6 13 q-4 -13 -18 -15 q-6 13 -18 13 q0 -10 -5 -15 q-7 12 -13 27z" fill="#6b4a32"/>'),
 # Juno: cream oversized cardigan over a lilac tee, wide-leg jeans, headphones, tote bag
 "Juno":dict(skin="#e8b48f",top="#b8a6e6",jacket="#f1e6d6",lapel="#e2d3bd",bottom="wide",bottom_c="#5d7fb5",shoe_c="#f4d35e",lashes=True,
   hair_back='<path d="M88 58 q-8 84 6 104 h72 q14 -20 6 -104z" fill="#3b2a4a"/>',
   extra='<path d="M90 68 q0 -52 40 -52 q40 0 40 52 q-10 -15 -20 -19 q-10 11 -20 11 q-10 0 -20 -11 q-10 4 -20 19z" fill="#3b2a4a"/>'
         '<path d="M86 64 q-2 -56 44 -58 q46 2 44 58" stroke="#ff8fa3" stroke-width="5" fill="none"/><rect x="80" y="54" width="13" height="24" rx="6" fill="#ff8fa3"/><rect x="167" y="54" width="13" height="24" rx="6" fill="#ff8fa3"/>'
         '<path d="M160 118 q20 30 14 70" stroke="#c9b28f" stroke-width="4" fill="none"/><rect x="160" y="182" width="34" height="38" rx="6" fill="#e8dcc6"/><circle cx="177" cy="200" r="6" fill="#ff8fa3"/>'),
 # Kemi: tailored mustard blazer over white top, belted black wide trousers, gold hoops, long braids
 "Kemi":dict(skin="#7a4f36",top="#ffffff",jacket="#e0a43a",lapel="#c98c26",bottom="wide",bottom_c="#2a2734",shoe_c="#2a2734",belt="#2a2734",lashes=True,
   hair_back='<path d="M97 58 q-14 60 -8 128" stroke="#1d1410" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M163 58 q14 60 8 128" stroke="#1d1410" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M104 60 q-8 50 -2 104" stroke="#1d1410" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M156 60 q8 50 2 104" stroke="#1d1410" stroke-width="9" fill="none" stroke-linecap="round"/>',
   extra='<path d="M90 64 q2 -50 40 -50 q38 0 40 50 q-14 -28 -40 -30 q-26 2 -40 30z" fill="#1d1410"/><path d="M130 15 v20" stroke="#3a2a22" stroke-width="2"/>'
         '<circle cx="90" cy="80" r="6" stroke="#ffd166" stroke-width="2.6" fill="none"/><circle cx="170" cy="80" r="6" stroke="#ffd166" stroke-width="2.6" fill="none"/>'),
 # Amara: sage midi dress with a soft pink cardigan, white sneakers, high curly bun, gold necklace
 "Amara":dict(skin="#8a5a3b",top="#9cc9a8",jacket="#f4a6b8",lapel="#e48aa0",bottom="dress",bottom_c="#9cc9a8",shoe_c="#ffffff",lashes=True,
   hair_back='<circle cx="130" cy="14" r="26" fill="#2b1d16"/><circle cx="112" cy="20" r="12" fill="#2b1d16"/><circle cx="148" cy="20" r="12" fill="#2b1d16"/>',
   extra='<path d="M90 66 q2 -52 40 -52 q38 0 40 52 q-14 -26 -40 -28 q-26 2 -40 28z" fill="#2b1d16"/>'
         '<circle cx="91" cy="78" r="3.4" fill="#ffd166"/><circle cx="169" cy="78" r="3.4" fill="#ffd166"/><path d="M118 108 q12 12 24 0" stroke="#ffd166" stroke-width="2" fill="none"/><circle cx="130" cy="114" r="3" fill="#ffd166"/>'),
}
def person_adult(name,m,no_arms=False): return adult(m,no_arms=no_arms,**HAIR[name])
