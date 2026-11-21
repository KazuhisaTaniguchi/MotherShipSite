# HERO のアニメ（英語版。2026-11-21 に C 案で作り直し）を組み立てる。
# 使い方：python3 build.py [mock/design_en のパス]（省くと、このファイルの 2 つ上のフォルダー）
#   index.html の <!-- hx --> … <!-- /hx --> の間（HERO の図の HTML）と、hero-fold.css を書き直す。
# 動きは「秒」で書き（実際の秒。SPEED を変えると全体の速さが変わる）、ここで % に直す。
#   はじめに出だし（INTRO 秒。マイナスの秒で書く。速さは掛けない）：家の Mac が出る → 電波がポンポンと 6 回広がる → Mac が消えながら、Fold7 が出る
#   そのあと 19.4 秒（0 秒から。SPEED を掛ける）：
#   0–3.1    ふわっと出る → 開く → 一覧 →「Connect」→ Mac の画面に切り替わる
#   3.1–5.5  AI の進み具合（行が 1 本ずつ伸びる）→「OK to continue?」
#   5.5–8.0  指で確かめる（Allow を押す → 2 本指でスクロール →「✓ Report ready」）
#   8.0–11.8 声で頼む（🎤 を押して話す → 離すと文字 → 送る → いちばん高い棒が目立つ）
#   11.9–14.0 縦に持ち替える（枠を 90 度回す。中身は正立したまま形が変わる）→ 四隅の印がはまる「✓ Fits edge to edge」
#   14.1–15.9 2 本指で広げて拡大（広げた直後は少しぼやけ、すぐくっきり映し直す）
#   16.0–18.4 画面が消える → 本のように閉じる → カバー画面に Mac が映る
#   18.4–19.4 少し沈みながら消える → 間を置いて、次の周へ
# 図の中は em で組む（1em = 図の幅の 2.5%。図は 40em × 36em）。開いた Fold7 は横向き（折り目が横）で描き、途中で縦にする
import re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
DESIGN = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(HERE))
T = 19.4
SPEED = 1.4     # 再生の速さ（2026-11-21、ユーザーの指示で 1.4 倍）
# 開け閉めと、出だし・終わりのフェードは、速くすると滑らかさがなくなるので、もとの長さのままにする。
# その区間（下の秒は、速さを掛ける前の秒）だけ時間を SPEED 倍に延ばしてから、全体を SPEED 倍で再生する（＝そこだけ等倍）
SLOW = [(0, 1.3), (16.0, 17.14), (18.4, 19.1)]   # 出て開く／画面が消えて閉じる／消える
def W(t):
    return t + sum((min(t, b) - a) * (SPEED - 1) for a, b in SLOW if t > a)
STILL = 15.6    # 「視差効果を減らす」の設定で止める場面（縦にして、グラフを拡大したところ）
INTRO = 3.4     # 出だし（家の Mac と電波。2026-11-21、ユーザーの指示）の実際の秒。-INTRO 秒から 0 秒まで
START = -INTRO
fmt = lambda x: ('%.3f' % x).rstrip('0').rstrip('.')
def RT(t): return t if t < 0 else W(t) / SPEED   # 0 秒からの実際の秒（出だしはマイナス）
TOTAL = INTRO + RT(T)
DUR = fmt(TOTAL)   # 1 周の実際の秒
OUT = []
def pct(t): return ('%.2f' % (100.0 * (INTRO + RT(t)) / TOTAL)).rstrip('0').rstrip('.') + '%'
def KF(name, pts):
    pts = sorted(pts, key=lambda p: p[0])
    if pts[0][0] > START: pts = [(START, pts[0][1])] + pts
    if pts[-1][0] < T: pts = pts + [(T, pts[-1][1])]
    OUT.append('@keyframes %s { %s }' % (name, ' '.join('%s { %s }' % (pct(t), c) for t, c in pts)))
    return name
def A(name, ease='linear'): return 'animation: %s %ss %s infinite;' % (name, DUR, ease)
def AA(names): return 'animation: ' + ', '.join('%s %ss linear infinite' % (n, DUR) for n in names) + ';'
# 動きのかたち。区間のはじめのキーフレームに書くと、その区間に効く
EO = '; animation-timing-function: cubic-bezier(.22, 1, .36, 1)'     # すっと出て、ゆっくり止まる
EIO = '; animation-timing-function: cubic-bezier(.65, 0, .35, 1)'    # ゆっくり動き出して、ゆっくり止まる
SOFT = '; animation-timing-function: cubic-bezier(.4, 0, .2, 1)'     # 色・濃さの変化
EIN = '; animation-timing-function: ease-in'                          # 2 つの区間をなめらかにつなぐ（前半）
EOUT = '; animation-timing-function: ease-out'                        # （後半）
def FADE(name, a, b=None, d_in=.35, d_out=.25, y_in='.5em', y_out='-.35em'):
    """a 秒に下から出て、b 秒に上へ消える（b を省くと、出たまま）"""
    pts = [(a, 'opacity: 0; transform: translateY(%s)' % y_in + EO), (a + d_in, 'opacity: 1; transform: translateY(0)')]
    if b is not None: pts += [(b, 'opacity: 1; transform: translateY(0)' + EIO), (b + d_out, 'opacity: 0; transform: translateY(%s)' % y_out)]
    return KF(name, pts)
R = []   # (selector, css)
def TAP(cls, x, y, t):
    """指で 1 回押す：ななめ下から寄ってきて、押して（輪が広がる）、離れる"""
    tr = lambda dx, dy, s: 'transform: translate(%sem, %sem) scale(%s)' % (fmt(x + dx), fmt(y + dy), s)
    k = KF('hx-' + cls, [(t - .45, 'opacity: 0; ' + tr(.5, .8, 1.25) + EO), (t - .12, 'opacity: 1; ' + tr(0, 0, 1) + SOFT), (t, 'opacity: 1; ' + tr(0, 0, .8) + SOFT), (t + .14, 'opacity: 1; ' + tr(0, 0, 1) + EIO), (t + .45, 'opacity: 0; ' + tr(.3, .5, 1.15))])
    r = KF('hx-' + cls + '-r', [(t - .01, 'opacity: 0; transform: scale(1)'), (t, 'opacity: .9; transform: scale(1)' + EO), (t + .5, 'opacity: 0; transform: scale(2.4)')])
    return [('.hx-' + cls, A(k)), ('.hx-' + cls + '::after', A(r))]
PERS = 'perspective(60em) '      # はじめに開く（上の半分を起こす）
PERS2 = 'perspective(140em) '    # 最後に本のように閉じる
NAVY = 'rgba(var(--navy-rgb), .6)'

# ---- 0. 出だし（-3.4–0）：家の Mac がふわっと出て、AI が作業中（行が伸びる）。電波が Mac の右上から右上へ、ポンポンと 6 回飛ぶ。
#      Mac は少し小さくなりながら消え（-0.4–0.5 秒）、重なるように Fold7 が出る（下の .hx-in。0–0.7 秒）----
R += [('.hx-mac', A(KF('hx-mac', [(-3.4, 'opacity: 0; transform: translateY(.9em) scale(.97)' + EO), (-2.75, 'opacity: 1; transform: translateY(0) scale(1)'),
                                  (-.4, 'opacity: 1; transform: translateY(0) scale(1)' + EIO), (.5, 'opacity: 0; transform: translateY(-.3em) scale(.92)')])))]
for i, s in enumerate([-2.6, -2.25, -1.9], 1):
    R += [('.hx-mwin i:nth-of-type(%d)' % i, A(KF('hx-mw%d' % i, [(s, 'transform: scaleX(0)' + EO), (s + .5, 'transform: scaleX(1)')])))]
R += [('.hx-mtop', A(KF('hx-mtop', [(-1.6, 'background: #8fb0e8' + SOFT), (-1.2, 'background: var(--blue)')])))]
for i, p in enumerate([-2.55, -2.2, -1.85, -1.5, -1.15, -.8], 1):   # ポン、ポン、…（6 回）
    R += [('.hx-wave:nth-child(%d)' % i, A(KF('hx-wv%d' % i, [(p - .01, 'opacity: 0; transform: rotate(45deg) scale(.2)'), (p, 'opacity: 1; transform: rotate(45deg) scale(.2)' + EO), (p + 1.2, 'opacity: 0; transform: rotate(45deg) scale(1.5)')])))]
R += [('.hx-mdot', A(KF('hx-mdot', [(t, v) for p in [-2.55, -2.2, -1.85, -1.5, -1.15, -.8] for (t, v) in [(p - .01, 'transform: scale(1)'), (p, 'transform: scale(1.6)' + EO), (p + .3, 'transform: scale(1)')]])))]
R += [('.hx-c0', A(FADE('hx-c0', -3.0, -.6, d_in=.4, d_out=.22)))]

# ---- 全体：ふわっと出て、最後は少し沈みながら消える。消えたあと .3 秒おいて、次の周へ ----
R += [('.hx-in', 'position: absolute; inset: 0; font-size: 2.5cqw; line-height: 1.3; color: var(--ink); ' + A(KF('hx-in', [
    (0, 'opacity: 0; transform: translateY(.9em) scale(.97)' + EO), (.7, 'opacity: 1; transform: translateY(0) scale(1)'),
    (18.4, 'opacity: 1; transform: translateY(0) scale(1)' + SOFT), (19.1, 'opacity: 0; transform: translateY(.7em) scale(.97)')])))]

# ---- 1. 開いて、つなぐ（0–3.1）----
HV = KF('hx-hv', [(0, 'opacity: 1'), (1.7, 'opacity: 1'), (1.75, 'opacity: 0')])   # 上下の半分は、開いた 1 枚が出たら消す（あとで枠を回すため）
R += [('.hx-top', 'top: 1.6em; border-radius: 1.4em 1.4em .2em .2em; transform-origin: 50% 100%; ' + AA([KF('hx-top', [(.35, 'transform: ' + PERS + 'rotateX(100deg); animation-timing-function: cubic-bezier(.45, 0, .15, 1)'), (1.3, 'transform: ' + PERS + 'rotateX(0deg)')]), HV])),
      ('.hx-bot', 'top: 16.9em; border-radius: .2em .2em 1.4em 1.4em; box-shadow: 0 2em 3em -1.6em rgba(var(--navy-rgb), .5); ' + A(HV))]
R += [('.hx-lt', A(FADE('hx-lt', 1.3, d_in=.45, y_in='.7em'))),
      ('.hx-row', A(FADE('hx-row', 1.42, d_in=.5, y_in='.9em'))),
      ('.hx-conn', A(KF('hx-conn', [(2.15, 'background: var(--blue)' + SOFT), (2.21, 'background: #2a49d6' + SOFT), (2.45, 'background: #47578f')]))),
      ('.hx-conn span', A(KF('hx-connt', [(2.25, 'opacity: 1' + SOFT), (2.45, 'opacity: .5')]))),
      ('.hx-wait', A(KF('hx-wait', [(2.25, 'opacity: 0; transform: translateX(.5em)' + EO), (2.5, 'opacity: 1; transform: translateX(0)')])))]
R += TAP('f-conn', 32.1, 9.3, 2.15)
# 一覧 → Mac の画面：一覧は少し広がりながら消え、Mac の画面は少し小さいところから出る
FITIN = 'transform: translate(.49em, .44em) scale(.97)'       # 画面の中心から .97 倍（原点は左上）
ZOOM = 'transform: translate(-17.18em, -3.8em) scale(1.5)'    # 縦にしたあと：レポートの窓が画面のまん中に来る
NORM = 'transform: translate(0, 0) scale(1)'
R += [('.hx-list', A(KF('hx-list', [(2.65, 'opacity: 1; transform: scale(1)' + EIO), (2.98, 'opacity: 0; transform: scale(1.04)')]))),
      ('.hx-wall', A(KF('hx-wall', [(2.65, 'opacity: 0' + SOFT), (3.0, 'opacity: 1')]))),
      # ぼかし（filter）は、拡大のあいだだけ掛ける。ずっと掛けておくと、枠を回したあとの文字がにじむ（filter の層を拡大・縮小して描くため）
      ('.hx-desk', AA([KF('hx-desk', [(2.72, 'opacity: 0; ' + FITIN + EO), (3.2, 'opacity: 1; ' + NORM), (14.35, 'opacity: 1; ' + NORM + EIO), (15.0, 'opacity: 1; ' + ZOOM)]),
                       KF('hx-sharp', [(0, 'filter: none'), (14.34, 'filter: none'), (14.35, 'filter: blur(0)' + EIO), (15.0, 'filter: blur(.05em)'), (15.15, 'filter: blur(.05em)' + SOFT), (15.45, 'filter: blur(0)'), (15.46, 'filter: none')])])),
      ('.hx-vbar', A(KF('hx-vbar', [(2.95, 'opacity: 0; transform: translate(-50%, 1em)' + EO), (3.4, 'opacity: 1; transform: translate(-50%, 0)')])))]

# ---- 2. AI の進み具合（3.1–5.5）：行が 1 本ずつ伸びる。5 本目は「Allow」のあと ----
for i, s in enumerate([3.3, 3.65, 4.0, 4.35, 6.3], 1):
    R += [('.hx-work i:nth-child(%d)' % i, A(KF('hx-w%d' % i, [(s, 'transform: scaleX(0)' + EO), (s + .5, 'transform: scaleX(1)')])))]
R += [('.hx-ask', A(KF('hx-ask', [(4.85, 'opacity: 0; transform: translateY(.7em)' + EO), (5.25, 'opacity: 1; transform: translateY(0)'), (6.25, 'opacity: 1; transform: translateY(0)' + EIO), (6.55, 'opacity: 0; transform: translateY(.7em)')])))]

# ---- 3. 指で確かめる（5.5–8.0）----
R += TAP('f-ok', 17.3, 22.4, 5.95)
R += [('.hx-ok', A(KF('hx-ok', [(5.95, 'background: var(--blue)' + SOFT), (6.12, 'background: #34c759')]))),
      ('.hx-f2', A(KF('hx-f2', [(6.6, 'opacity: 0; transform: translate(12.7em, 15.7em)' + EO), (6.86, 'opacity: 1; transform: translate(12.4em, 15em)'), (6.9, 'opacity: 1; transform: translate(12.4em, 15em)' + EIO), (7.6, 'opacity: 1; transform: translate(12.4em, 11.6em)' + EIO), (7.9, 'opacity: 0; transform: translate(12.6em, 11.1em)')]))),
      ('.hx-logi', A(KF('hx-logi', [(6.9, 'transform: translateY(0)' + EIO), (7.6, 'transform: translateY(-3.4em)'), (10.97, 'transform: translateY(-3.4em)' + EIO), (11.42, 'transform: translateY(-6.2em)')]))),
      ('.hx-done', A(FADE('hx-done', 7.35, y_in='.4em')))]

# ---- 4. 声で頼む（8.0–11.8）----
REC = 'background: var(--rec); box-shadow: 0 0 0 .35em rgba(var(--rec-rgb), .3)'
IDLE = 'background: #263257; box-shadow: 0 0 0 0 rgba(var(--rec-rgb), 0)'
ring = [(8.44, 'opacity: 0; transform: scale(1)')]
for p in (8.45, 8.97, 9.49): ring += [(p, 'opacity: .75; transform: scale(1)' + EO), (p + .5, 'opacity: 0; transform: scale(2.1)'), (p + .51, 'opacity: 0; transform: scale(1)')]
mic = lambda dx, dy, s: 'transform: translate(%sem, %sem) scale(%s)' % (fmt(13.75 + dx), fmt(29.4 + dy), s)
R += [('.hx-f-mic', A(KF('hx-f-mic', [(7.95, 'opacity: 0; ' + mic(.5, .8, 1.25) + EO), (8.26, 'opacity: 1; ' + mic(0, 0, 1) + SOFT), (8.36, 'opacity: 1; ' + mic(0, 0, .82)), (10.0, 'opacity: 1; ' + mic(0, 0, .82) + SOFT), (10.12, 'opacity: 1; ' + mic(0, 0, 1) + EIO), (10.42, 'opacity: 0; ' + mic(.3, .5, 1.15))]))),
      ('.hx-mic', A(KF('hx-mic', [(8.35, IDLE + SOFT), (8.48, REC), (10.0, REC + SOFT), (10.18, IDLE)]))),
      ('.hx-mic::after', A(KF('hx-micring', ring))),
      ('.hx-said', A(KF('hx-said', [(8.55, 'opacity: 0; transform: translateY(.7em) scale(.94)' + EO), (8.92, 'opacity: 1; transform: translateY(0) scale(1)'), (10.05, 'opacity: 1; transform: translateY(0) scale(1)' + EIO), (10.35, 'opacity: 0; transform: translateY(-.5em) scale(1)')]))),
      ('.hx-hint', A(KF('hx-hint', [(0, 'opacity: 1'), (10.05, 'opacity: 1'), (10.15, 'opacity: 0'), (10.99, 'opacity: 0' + SOFT), (11.25, 'opacity: 1')]))),
      ('.hx-typed', A(KF('hx-typed', [(10.1, 'max-width: 0; animation-timing-function: steps(18, end)'), (10.75, 'max-width: 18em'), (10.97, 'max-width: 18em; animation-timing-function: steps(1, end)'), (10.99, 'max-width: 0')]))),
      ('.hx-enter', A(KF('hx-enter', [(10.9, 'background: #263257' + SOFT), (10.96, 'background: var(--blue)' + SOFT), (11.25, 'background: #263257')]))),
      ('.hx-me2', A(KF('hx-me2', [(10.97, 'opacity: 0; transform: translateY(.6em) scale(.94)' + EO), (11.35, 'opacity: 1; transform: translateY(0) scale(1)')]))),
      ('.hx-top4', A(KF('hx-top4', [(11.4, 'background: #8fb0e8; box-shadow: 0 0 0 0 rgba(var(--blue-rgb), 0)' + SOFT), (11.75, 'background: var(--blue); box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), .3)')]))),
      ('.hx-top4 s', A(KF('hx-toptag', [(11.55, 'opacity: 0' + SOFT), (11.85, 'opacity: 1')])))]
R += TAP('f-enter', 18.75, 29.4, 10.9)

# ---- 5. 縦に持ち替える（12.0–12.95）。枠（.hx-open）を 90 度回し、中身（.hx-scr）は同じ角度だけ逆に回して正立させたまま、横長 → 縦長に変える ----
t1, tm, t2 = 12.0, 12.475, 12.95
R += [('.hx-open', AA([KF('hx-open', [(1.2, 'opacity: 0' + SOFT), (1.6, 'opacity: 1'), (t2 + .1, 'opacity: 1'), (t2 + .12, 'opacity: 0')]),
                       KF('hx-turn', [(t1, 'transform: rotate(0deg) scale(1); box-shadow: 0 2em 4em -2em ' + NAVY + EIN), (tm, 'transform: rotate(45deg) scale(.86); box-shadow: 1.41em 1.41em 4em -2em ' + NAVY + EOUT), (t2, 'transform: rotate(90deg) scale(.9412); box-shadow: 2em 0 4em -2em ' + NAVY)])])),
      ('.hx-scr', A(KF('hx-scr', [(t1, 'left: 0; top: 0; width: 32.8em; height: 29.4em; transform: rotate(0deg)' + EIN), (tm, 'left: .85em; top: -.85em; width: 31.1em; height: 31.1em; transform: rotate(-45deg)' + EOUT), (t2, 'left: 1.7em; top: -1.7em; width: 29.4em; height: 32.8em; transform: rotate(-90deg)')]))),
      ('.hx-rep', A(KF('hx-repmv', [(t1, 'left: 17.4em; top: 2em' + EIO), (t2, 'left: 14em; top: 3.2em')]))),
      # 回し終わったら、回していない縦の端末（.hx-pt。文字がくっきり）を上に重ねて出し、回した枠は消す
      ('.hx-pt', A(KF('hx-pt', [(t2 - .03, 'opacity: 0' + SOFT), (t2 + .09, 'opacity: 1'), (16.3, 'opacity: 1'), (16.32, 'opacity: 0')])))]
# ぴったり合う：四隅の印が内側から隅へはまり（少し行き過ぎて戻る）、枠が 1 度光る
corner = lambda k: 'transform: translate(calc(var(--dx) * %sem), calc(var(--dy) * %sem))' % (k, k)
R += [('.hx-fitc', A(KF('hx-fitc', [(12.82, 'opacity: 0; ' + corner(2.6) + EO), (13.12, 'opacity: 1; ' + corner(-.2) + EIO), (13.32, 'opacity: 1; ' + corner(0)), (13.75, 'opacity: 1; ' + corner(0) + SOFT), (14.0, 'opacity: 0; ' + corner(0))]))),
      ('.hx-fito', A(KF('hx-fito', [(12.95, 'opacity: 0' + SOFT), (13.14, 'opacity: 1' + SOFT), (13.65, 'opacity: 0')]))),
      ('.hx-fitb', A(KF('hx-fitb', [(13.05, 'opacity: 0; transform: translate(-50%, .7em) scale(.92)' + EO), (13.42, 'opacity: 1; transform: translate(-50%, 0) scale(1)'), (13.8, 'opacity: 1; transform: translate(-50%, 0) scale(1)' + EIO), (14.05, 'opacity: 0; transform: translate(-50%, -.45em) scale(1)')])))]

# ---- 6. 2 本指で広げて拡大（14.1–15.9）。拡大そのものは、上の .hx-desk ----
pz = lambda x, y, s: 'transform: translate(%sem, %sem) scale(%s)' % (x, y, s)
R += [('.hx-pz1', A(KF('hx-pz1', [(14.08, 'opacity: 0; ' + pz(25.3, 16.3, 1.25) + EO), (14.3, 'opacity: 1; ' + pz(25.3, 16.3, .9)), (14.35, 'opacity: 1; ' + pz(25.3, 16.3, .9) + EIO), (15.0, 'opacity: 1; ' + pz(22.6, 19.6, .9) + EIO), (15.28, 'opacity: 0; ' + pz(22.6, 19.6, 1.2))]))),
      ('.hx-pz2', A(KF('hx-pz2', [(14.08, 'opacity: 0; ' + pz(27.0, 14.3, 1.25) + EO), (14.3, 'opacity: 1; ' + pz(27.0, 14.3, .9)), (14.35, 'opacity: 1; ' + pz(27.0, 14.3, .9) + EIO), (15.0, 'opacity: 1; ' + pz(29.9, 11.2, .9) + EIO), (15.28, 'opacity: 0; ' + pz(29.9, 11.2, 1.2))])))]

# ---- 7. 閉じる（16.0–18.4）：画面が消える → 左右の半分に入れ替え → 左を手前へ起こす → その裏のカバーが右に重なる。閉じた端末は中央へ ----
c0, c1, c2 = 16.3, 16.72, 17.14
ry = lambda a: 'transform: ' + PERS2 + 'rotateY(%sdeg)' % a
R += [('.hx-off', A(KF('hx-off', [(16.0, 'opacity: 0' + SOFT), (16.3, 'opacity: 1')]))),
      ('.hx-cl', A(KF('hx-cl', [(c0 - .02, 'opacity: 0; transform: translateX(0)'), (c0, 'opacity: 1; transform: translateX(0)' + EIO), (c2, 'opacity: 1; transform: translateX(-7.2em)')]))),
      ('.hx-pl', A(KF('hx-pl', [(c0, 'opacity: 1; background-color: #1d2333; ' + ry(0) + EIN), (c1, 'opacity: 1; background-color: #2b3554; ' + ry(90)), (c1 + .01, 'opacity: 0; background-color: #2b3554; ' + ry(90))]))),
      ('.hx-cov', A(KF('hx-cov', [(c1 - .01, 'opacity: 0; filter: brightness(1.6); ' + ry(-90)), (c1, 'opacity: 1; filter: brightness(1.6); ' + ry(-90) + EOUT), (c2, 'opacity: 1; filter: brightness(1); ' + ry(0))]))),
      ('.hx-cv', A(KF('hx-cv', [(17.2, 'opacity: 0' + SOFT), (17.65, 'opacity: 1')])))]

# ---- 場面の札（左下）：下から出て、上へ消える ----
caps = [(0.6, 2.9), (3.05, 5.4), (5.55, 7.9), (8.05, 11.8), (11.95, 14.0), (14.15, 15.9), (16.05, 18.3)]
for i, (a, b) in enumerate(caps, 1):
    R += [('.hx-c%d' % i, A(FADE('hx-c%d' % i, a, b, d_in=.4, d_out=.22)))]

STATIC = open(os.path.join(HERE, 'static.css'), encoding='utf-8').read()
REDUCED = '''@media (prefers-reduced-motion: reduce) {
  /* 縦にして、グラフを拡大したところ（%s 秒）で止める */
  .hx *, .hx *::before, .hx *::after { animation-delay: -%ss !important; animation-play-state: paused !important; }
  .hx-ui .hx-pause { display: none; }
}
''' % (fmt(STILL), fmt(INTRO + RT(STILL)))
css = STATIC + '\n'.join('%s { %s }' % r for r in R) + '\n' + REDUCED + '\n/* ---- 動き（tools/hero-fold/build.py が、秒から % に直して書き出したもの）---- */\n' + '\n'.join(OUT) + '\n'
open(os.path.join(DESIGN, 'hero-fold.css'), 'w', encoding='utf-8').write(css)
html = open(os.path.join(HERE, 'figure.html'), encoding='utf-8').read().strip()
# 縦の端末（.hx-pt）の中身：.hx-scr の写しを入れる（印 scr の間 → 印 scr2 のところへ。いちばん外の class だけ hx-scr2 に変える）
m = re.search(r'<!-- scr -->(.*?)<!-- /scr -->', html, re.S); assert m and html.count('<!-- scr2 -->') == 1
clone = m.group(1).replace('<div class="hx-scr">', '<div class="hx-scr2">', 1); assert clone != m.group(1)
html = html.replace('<!-- scr2 -->', clone).replace('<!-- scr -->', '').replace('<!-- /scr -->', '')
assert html.count('class="hx-cap ') == len(caps) + 1, '札の数が合わない（出だしの hx-c0 を入れて）'
p = os.path.join(DESIGN, 'index.html'); t = open(p, encoding='utf-8').read()
pat = re.compile(r'<!-- hx -->.*?<!-- /hx -->', re.S)
assert pat.search(t), 'index.html に <!-- hx --> の印がない'
t = pat.sub(lambda m: '<!-- hx -->' + html + '<!-- /hx -->', t, count=1)
open(p, 'w', encoding='utf-8').write(t)
print('keyframes:', len(OUT), 'css bytes:', len(css), '1 周:', DUR, '秒')
