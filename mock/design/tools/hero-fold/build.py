# HERO のアニメ（Galaxy Z Fold7 を開いて、Mac の AI を動かす。2026-11-21）を組み立てる。
# 使い方：python3 build.py [mock/design のパス]（省くと、このファイルの 2 つ上のフォルダー）
#   index.html の <!-- hx --> … <!-- /hx --> の間（HERO の図の HTML）と、hero-fold.css を書き直す。
#   本番（frontend）へは、hero-fold.css を src/styles/ に写し、HTML は components/HeroFold.tsx に写す。
# 動きは「秒」で書き、ここで % に直す。1 周 26 秒：
#   0–3.5 開いて、つなぐ／3.6–8 AI の進み具合を見る／8–12 指で確かめる（許可・スクロール）
#   12–17 声で書く（🎤 を押して話す → 離すと文字 → 送る）／17–25 半分に折って置く（上が画面、下がトラックパッド）
# 図の中は em で組む（1em = 図の幅の 2.5%。図は 40em × 36em）。開いた Fold7 は横向き（折り目が横）で描く
import re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
DESIGN = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(HERE))
T = 26
OUT = []
def pct(t): return ('%.2f' % (100.0 * t / T)).rstrip('0').rstrip('.') + '%'
def KF(name, pts):
    pts = sorted(pts, key=lambda p: p[0])
    if pts[0][0] > 0: pts = [(0, pts[0][1])] + pts
    if pts[-1][0] < T: pts = pts + [(T, pts[-1][1])]
    OUT.append('@keyframes %s { %s }' % (name, ' '.join('%s { %s }' % (pct(t), c) for t, c in pts)))
    return name
def ON(name, t_on, t_off=None, d=.3, off='opacity: 0', on='opacity: 1'):
    pts = [(0, off), (t_on, off), (t_on + d, on)]
    if t_off is not None: pts += [(t_off, on), (t_off + d, off)]
    return KF(name, pts)
def TAP(name, x, y, t):
    tr = lambda s: 'transform: translate(%sem, %sem) scale(%s)' % (x, y, s)
    return KF(name, [(t - .4, 'opacity: 0; ' + tr(1.5)), (t - .15, 'opacity: 1; ' + tr(1)), (t, 'opacity: 1; ' + tr(.8)), (t + .2, 'opacity: 1; ' + tr(1)), (t + .5, 'opacity: 0; ' + tr(1))])
def A(name, ease='ease'): return 'animation: %s %ss %s infinite;' % (name, T, ease)
PERS = 'perspective(60em) '
R = []   # (selector, css)
# 全体
R += [('.hx-in', 'position: absolute; inset: 0; font-size: 2.5cqw; line-height: 1.3; color: var(--ink); ' + A(KF('hx-in', [(0, 'opacity: 0'), (.4, 'opacity: 1'), (25.4, 'opacity: 1'), (26, 'opacity: 0')]), 'linear'))]
# 上下の半分（開く・折る）
R += [('.hx-top', 'top: 1.6em; border-radius: 1.4em 1.4em .2em .2em; transform-origin: 50% 100%; ' + A(KF('hx-top', [(.3, 'transform: ' + PERS + 'rotateX(100deg)'), (1.6, 'transform: ' + PERS + 'rotateX(0deg)')]), 'ease-out')),
      ('.hx-bot', 'top: 16.9em; border-radius: .2em .2em 1.4em 1.4em; transform-origin: 50% 0; box-shadow: 0 2em 3em -1.6em rgba(var(--navy-rgb), .5); ' + A(KF('hx-bot', [(17.4, 'transform: ' + PERS + 'rotateX(0deg)'), (18.6, 'transform: ' + PERS + 'rotateX(55deg)'), (23.8, 'transform: ' + PERS + 'rotateX(55deg)'), (24.8, 'transform: ' + PERS + 'rotateX(0deg)')]), 'ease-in-out')),
      ('.hx-tt, .hx-ctl', A(ON('hx-half-on', 16.9, 24.2)))]
# 開いた画面（1 枚）
R += [('.hx-open', A(ON('hx-open', 1.6, 17.0)))]
R += [('.hx-list', A(KF('hx-list', [(0, 'opacity: 1'), (3.4, 'opacity: 1'), (3.7, 'opacity: 0')]))),
      ('.hx-conn', A(KF('hx-conn', [(2.7, 'background: var(--blue)'), (2.8, 'background: #2a49d6'), (3.0, 'background: var(--blue)')]))),
      ('.hx-wait', A(ON('hx-wait', 2.9, 3.4, .2))),
      ('.hx-desk', A(ON('hx-desk', 3.4)))]
R += [('.hx-work', A(KF('hx-work', [(3.8, 'height: 0'), (5, 'height: 1.6em'), (6.4, 'height: 3.4em'), (7.4, 'height: 5.2em')]))),
      ('.hx-ask', A(KF('hx-ask', [(0, 'opacity: 0; transform: translateY(.6em)'), (6.8, 'opacity: 0; transform: translateY(.6em)'), (7.1, 'opacity: 1; transform: none'), (9.0, 'opacity: 1; transform: none'), (9.3, 'opacity: 0; transform: translateY(.6em)')]))),
      ('.hx-ok', A(KF('hx-ok', [(8.6, 'background: var(--blue)'), (8.7, 'background: #34c759')]))),
      ('.hx-logi', A(KF('hx-logi', [(9.6, 'transform: none'), (11, 'transform: translateY(-3.4em)'), (15.9, 'transform: translateY(-3.4em)'), (16.4, 'transform: translateY(-6.2em)')]), 'ease-in-out')),
      ('.hx-done', A(ON('hx-done', 10.6))),
      ('.hx-me2', A(ON('hx-me2', 16.2))),
      ('.hx-top4', A(KF('hx-top4', [(16.5, 'background: #8fb0e8; box-shadow: none'), (16.8, 'background: var(--blue); box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), .3)')]))),
      ('.hx-hint', A(KF('hx-hint', [(0, 'opacity: 1'), (15.0, 'opacity: 1'), (15.1, 'opacity: 0'), (16.2, 'opacity: 0'), (16.3, 'opacity: 1')]))),
      ('.hx-typed', A(KF('hx-typed', [(15.1, 'max-width: 0; animation-timing-function: steps(12, end)'), (15.9, 'max-width: 30em'), (16.1, 'max-width: 30em'), (16.2, 'max-width: 0')]), 'linear')),
      ('.hx-mic', A(KF('hx-mic', [(12.3, 'background: #263257; box-shadow: none'), (12.4, 'background: var(--rec); box-shadow: 0 0 0 .35em rgba(var(--rec-rgb), .3)'), (15.0, 'background: var(--rec); box-shadow: 0 0 0 .35em rgba(var(--rec-rgb), .3)'), (15.1, 'background: #263257; box-shadow: none')]))),
      ('.hx-enter', A(KF('hx-enter', [(16.0, 'background: #263257'), (16.1, 'background: var(--blue)'), (16.4, 'background: #263257')]))),
      ('.hx-said', A(KF('hx-said', [(0, 'opacity: 0; transform: translateY(.6em) scale(.95)'), (12.6, 'opacity: 0; transform: translateY(.6em) scale(.95)'), (12.9, 'opacity: 1; transform: none'), (15.0, 'opacity: 1; transform: none'), (15.3, 'opacity: 0; transform: none')])))]
# 指（図の em。開いた画面の内側は、左 3.6em・上 2.2em から）
R += [('.hx-f-conn', A(TAP('hx-f-conn', 32.1, 9.3, 2.8))),
      ('.hx-f-ok', A(TAP('hx-f-ok', 17.3, 22.4, 8.7))),
      ('.hx-f2', A(KF('hx-f2', [(9.4, 'opacity: 0; transform: translate(12.4em, 15em)'), (9.6, 'opacity: 1; transform: translate(12.4em, 15em)'), (11, 'opacity: 1; transform: translate(12.4em, 11.6em)'), (11.3, 'opacity: 0; transform: translate(12.4em, 11.6em)')]), 'ease-in-out')),
      ('.hx-f-mic', A(KF('hx-f-mic', [(12.0, 'opacity: 0; transform: translate(13.75em, 29.4em) scale(1.5)'), (12.3, 'opacity: 1; transform: translate(13.75em, 29.4em) scale(.85)'), (15.0, 'opacity: 1; transform: translate(13.75em, 29.4em) scale(.85)'), (15.3, 'opacity: 0; transform: translate(13.75em, 29.4em) scale(1.3)')]))),
      ('.hx-f-enter', A(TAP('hx-f-enter', 18.75, 29.4, 16.1)))]
# 半分に折ったあと：下のトラックパッドをなぞると、上のポインターが動き、クリックでレポートが前に
R += [('.hx-pf', A(KF('hx-pf', [(19.2, 'opacity: 0; transform: translate(20em, 9em)'), (19.4, 'opacity: 1; transform: translate(20em, 9em)'), (21.2, 'opacity: 1; transform: translate(12.5em, 5.6em)'), (21.6, 'opacity: 1; transform: translate(12.5em, 5.6em) scale(.8)'), (21.8, 'opacity: 1; transform: translate(12.5em, 5.6em)'), (22.2, 'opacity: 0; transform: translate(12.5em, 5.6em)')]), 'ease-in-out')),
      ('.hx-ptr', A(KF('hx-ptr', [(19.4, 'transform: translate(25em, 9.5em)'), (21.2, 'transform: translate(21.2em, 5.2em)')]), 'ease-in-out')),
      ('.hx-tt .hx-rep', A(KF('hx-ttrep', [(21.6, 'box-shadow: 0 .6em 1.4em -.8em rgba(var(--navy-rgb), .5)'), (21.7, 'box-shadow: 0 0 0 .2em var(--blue), 0 .6em 1.4em -.8em rgba(var(--navy-rgb), .5)')])))]
# 場面の札（左下）
caps = [(0.2, 3.4), (3.6, 7.9), (8.0, 11.9), (12.0, 16.9), (17.1, 25.0)]
for i, (a, b) in enumerate(caps, 1):
    R += [('.hx-c%d' % i, A(ON('hx-c%d' % i, a, b)))]
STATIC = open(os.path.join(HERE, 'static.css'), encoding='utf-8').read()
css = STATIC + '\n'.join('%s { %s }' % r for r in R) + '\n\n/* ---- 動き（tools/hero-fold/build.py が、秒から % に直して書き出したもの）---- */\n' + '\n'.join(OUT) + '\n'
open(os.path.join(DESIGN, 'hero-fold.css'), 'w', encoding='utf-8').write(css)
html = open(os.path.join(HERE, 'figure.html'), encoding='utf-8').read().strip()
p = os.path.join(DESIGN, 'index.html'); t = open(p, encoding='utf-8').read()
pat = re.compile(r'<!-- hx -->.*?<!-- /hx -->', re.S)
assert pat.search(t), 'index.html に <!-- hx --> の印がない'
t = pat.sub(lambda m: '<!-- hx -->' + html + '<!-- /hx -->', t, count=1)
open(p, 'w', encoding='utf-8').write(t)
print('keyframes:', len(OUT), 'css bytes:', len(css))
