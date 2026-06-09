import re

files = ['index.html', 'about.html', 'services.html', 'products.html', 'team.html', 'careers.html']

socials = [
    (
        'href="#" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all" aria-label="LinkedIn"',
        'href="https://www.linkedin.com/company/prasanna-technologies-pvt-ltd/" target="_blank" rel="noopener" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all" aria-label="LinkedIn"'
    ),
    (
        'href="#" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all" aria-label="Facebook"',
        'href="https://www.facebook.com/prasannatechnologies/" target="_blank" rel="noopener" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all" aria-label="Facebook"'
    ),
    (
        'href="#" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all" aria-label="YouTube"',
        'href="https://youtube.com/@prasannatechnologies" target="_blank" rel="noopener" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all" aria-label="YouTube"'
    ),
]

ANIM_CSS = """
    /* Smooth spring reveal */
    .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    /* Hero entrance */
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeInRight { from { opacity:0; transform:translateX(36px); } to { opacity:1; transform:translateX(0); } }
    .animate-1 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
    .animate-2 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s  both; }
    .animate-3 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
    .animate-4 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.48s both; }
    .animate-img { animation: fadeInRight 1.1s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
    /* Card lift */
    .card-lift { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s cubic-bezier(0.22,1,0.36,1); }
    .card-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,30,64,0.13); }
    /* Group image zoom */
    .group img { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); }
    /* Global micro-interactions */
    a, button { transition: color 0.18s, background-color 0.18s, border-color 0.18s, opacity 0.18s, transform 0.15s, box-shadow 0.18s; }"""

OLD_REVEAL = '.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }\n    .reveal.visible { opacity: 1; transform: translateY(0); }'

hero_patches = {
    'index.html': [
        (
            'class="text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-2">\n        Technology for Better Governance',
            'class="animate-1 text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-2">\n        Technology for Better Governance'
        ),
        (
            'class="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-white">\n        Software Built',
            'class="animate-2 text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-white">\n        Software Built'
        ),
        (
            'class="text-lg text-primary-fixed/75 max-w-lg leading-relaxed">\n        Prasanna Technologies develops',
            'class="animate-3 text-lg text-primary-fixed/75 max-w-lg leading-relaxed">\n        Prasanna Technologies develops'
        ),
        (
            'class="flex flex-wrap gap-4 pt-2">',
            'class="animate-4 flex flex-wrap gap-4 pt-2">'
        ),
        (
            'class="hidden md:block">\n      <img src="./prasannatechnologies.com_6066f744',
            'class="animate-img hidden md:block">\n      <img src="./prasannatechnologies.com_6066f744'
        ),
    ],
    'about.html': [
        (
            'class="text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        About Prasanna Technologies',
            'class="animate-1 text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        About Prasanna Technologies'
        ),
        (
            'class="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-white mb-6">\n        Two Decades',
            'class="animate-2 text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-white mb-6">\n        Two Decades'
        ),
        (
            'class="text-lg text-primary-fixed/75 max-w-xl leading-relaxed">\n        A technology company focused',
            'class="animate-3 text-lg text-primary-fixed/75 max-w-xl leading-relaxed">\n        A technology company focused'
        ),
    ],
    'services.html': [
        (
            'class="text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        Strategic Technology Solutions',
            'class="animate-1 text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        Strategic Technology Solutions'
        ),
        (
            'class="text-4xl md:text-[56px] font-bold leading-tight tracking-tight text-white mb-6">\n        Engineering Excellence',
            'class="animate-2 text-4xl md:text-[56px] font-bold leading-tight tracking-tight text-white mb-6">\n        Engineering Excellence'
        ),
    ],
    'products.html': [
        (
            'class="text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        Strategic Solutions',
            'class="animate-1 text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        Strategic Solutions'
        ),
        (
            'class="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-white mb-6">\n        Empowering Enterprise',
            'class="animate-2 text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-white mb-6">\n        Empowering Enterprise'
        ),
    ],
    'team.html': [
        (
            'class="text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        The People Behind the Platform',
            'class="animate-1 text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        The People Behind the Platform'
        ),
        (
            'class="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-white mb-6">\n        200+ Professionals',
            'class="animate-2 text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-white mb-6">\n        200+ Professionals'
        ),
    ],
    'careers.html': [
        (
            'class="text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        Join Prasanna Technologies',
            'class="animate-1 text-xs font-bold tracking-widest uppercase text-secondary-fixed-dim block mb-6">\n        Join Prasanna Technologies'
        ),
        (
            'class="text-4xl md:text-[52px] font-bold leading-tight tracking-tight text-white mb-6">\n        Work That Makes',
            'class="animate-2 text-4xl md:text-[52px] font-bold leading-tight tracking-tight text-white mb-6">\n        Work That Makes'
        ),
    ],
}

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Social links
    for old, new in socials:
        content = content.replace(old, new)

    # 2. CSS: replace old reveal with new animation block (CRLF and LF variants)
    replaced = False
    for sep in ['\n', '\r\n']:
        old_pat = OLD_REVEAL.replace('\n', sep)
        if old_pat in content:
            content = content.replace(old_pat, ANIM_CSS.strip())
            replaced = True
            break
    if not replaced and 'animate-1' not in content:
        content = content.replace('  </style>', ANIM_CSS + '\n  </style>', 1)

    # 3. Hero animation classes
    if fname in hero_patches:
        for old, new in hero_patches[fname]:
            if old in content:
                content = content.replace(old, new)
            else:
                print(f'  MISS in {fname}: {old[:60]}')

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {fname}')

print('All done.')
