# ヘルプページの図（29 個。17〜29 は 2026-11-21 追加：かんたんにまとめると・困ったとき）を組み立てる。
# 使い方：python3 build.py [mock/design のパス]（省くと、このファイルの 2 つ上のフォルダー）
#   help.html の図（<!-- fig:番号 --> の間）を書き直し、図のスタイルと動き（@keyframes）を help-figs.css に書く。
#   共通の部品のスタイルは、となりの kit.css（help-figs.css の前半になる）。
# 動きは「秒」で書き、ここで % に直す（計算まちがいを防ぐため）。
import re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
DESIGN = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(HERE))

# ---------------------------------------------------------------- 道具
OUT = []          # 生成する @keyframes


def pct(t, T):
    return ('%.2f' % (100.0 * t / T)).rstrip('0').rstrip('.') + '%'


def KF(name, T, pts):
    """pts = [(秒, 'css 宣言'), ...]。最初と最後は 0%・100% に延ばす"""
    pts = sorted(pts, key=lambda p: p[0])
    if pts[0][0] > 0:
        pts = [(0, pts[0][1])] + pts
    if pts[-1][0] < T:
        pts = pts + [(T, pts[-1][1])]
    body = ' '.join('%s { %s }' % (pct(t, T), css) for t, css in pts)
    OUT.append('@keyframes %s { %s }' % (name, body))
    return name


def STEPS(name, T, seq, dur=.2):
    """seq = [(秒, 'css'), ...]。その秒まで前の値を保ち、dur 秒で次の値に変わる"""
    pts = [(0, seq[0][1])]
    for (t, css), prev in zip(seq[1:], seq[:-1]):
        pts.append((t, prev[1]))
        pts.append((t + dur, css))
    return KF(name, T, pts)


def CUR(name, T, path, clicks=()):
    """矢印（カーソル）。path = [(秒, x, y), ...]（em）。clicks の秒で、押すしぐさ（少し縮む）"""
    pts = [(t, x, y, 1) for t, x, y in path]
    for c in clicks:
        prev = [p for p in path if p[0] <= c][-1]
        x, y = prev[1], prev[2]
        pts += [(c - .04, x, y, 1), (c, x, y, .78), (c + .16, x, y, 1)]
    pts.sort(key=lambda p: p[0])
    return KF(name, T, [(t, 'transform: translate(%sem, %sem) scale(%s)' % (x, y, s)) for t, x, y, s in pts])


MARK = '<svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg>'
QR = '<svg viewBox="0 0 19 19"><use href="#hs-qr"/></svg>'
CURSOR = '<svg class="hf-cur {c}" viewBox="0 0 12 16"><path d="M1 1v12l3.2-2.8 2 4.6 2-.9-2-4.5H11z" fill="#14203a" stroke="#fff" stroke-width="1" stroke-linejoin="round"/></svg>'


def mbar(tray=''):
    return '<div class="hf-mbar"><i></i><b></b><b></b><b></b><span class="hf-tray %s">%s</span><u></u><u></u></div>' % (tray, MARK)


def wbar(title):
    return '<div class="hf-wbar"><i></i><i></i><i></i><b>%s</b></div>' % title


def pop(rows, cls=''):
    return '<div class="hf-pop %s">%s</div>' % (cls, ''.join(rows))


R_TITLE = '<div class="hf-r"><b>MOTHERSHIP HOST</b><small>接続を待っています</small></div>'


def r_dev(btn_cls=''):
    return '<div class="hf-r"><span>登録済みの端末</span><em class="hf-btn %s">端末を追加…</em></div>' % btn_cls


def r_perm(label, dot_cls='', btn_cls='', btn=True):
    b = '<em class="hf-btn %s">設定を開く</em>' % btn_cls if btn else ''
    return '<div class="hf-r"><i class="hf-dot %s"></i><span>%s</span>%s</div>' % (dot_cls, label, b)


def r_tg(label, cls='', row_cls=''):
    return '<div class="hf-r %s"><span>%s</span><i class="hf-tg %s"></i></div>' % (row_cls, label, cls)


def fig(cls, label, inner, tall=False, room=False):
    c = 'hf %s%s%s' % (cls, ' is-tall' if tall else '', ' is-room' if room else '')
    return '<div class="%s" role="img" aria-label="%s"><div class="hf-in" aria-hidden="true">%s</div></div>' % (c, label, inner)


LAP = lambda cls, inner, bar='': '<div class="hf-lap %s"><div class="hf-scr">%s%s</div><div class="hf-base"></div></div>' % (cls, bar, inner)
WINS = '<span class="hf-w hf-w1"><b></b><i></i><i></i><i></i></span><span class="hf-w hf-w2"><b></b><em><i></i><i></i><i></i><i></i></em></span>'
LAPBAR = '<div class="hf-lbar"><i></i><b></b><b></b><span class="hf-tray">%s</span></div>' % MARK

FIGS = []      # 置き換える HTML（灰色の枠の順）
CSS = []       # 図ごとのスタイル

# ================================================================ 図 1：全体の流れ（リンクつき）
FIGS.append('''<nav class="hflow" aria-label="使いはじめるまでの流れ">
            <ol class="hflow-main">
              <li><a href="#setup-mac"><b>1</b><span>Macに入れる</span><small>2つの許可をオンにする</small></a></li>
              <li><a href="#setup-pair"><b>2</b><span>デバイスを登録する</span><small>MacのQRコードを読み取る</small></a></li>
              <li><a href="#setup-connect"><b>3</b><span>つなぐ</span><small>家のWi-Fiで使える</small></a></li>
            </ol>
            <p class="hflow-opt-title">ここから先は、必要な人だけ</p>
            <ul class="hflow-opt">
              <li><a href="#voice"><span>声で書く準備</span><small>Aqua Voice と BlackHole 2ch</small></a></li>
              <li><a href="#outside"><span>外から使う準備</span><small>Tailscale</small></a></li>
            </ul>
          </nav>''')

# ================================================================ 図 2：開く → メニューバーにアイコン → メニュー
T = 9.5
CSS.append('''
/* 図 2：アプリを開く → メニューバーにアイコンが出る → クリックでメニュー（9.5 秒） */
.hf2 { --d: 9.5s; --fz: 7s; }
.hf2-finder { left: 1.2em; top: 3em; width: 12.6em; height: 11.5em; animation: %s var(--d) ease infinite; }
.hf2-finder .hf-wbody > i { position: absolute; width: 2.4em; height: 2.4em; border-radius: 24%%; background: #dfe5f0; }
.hf2-finder .hf-wbody > i:nth-of-type(1) { left: 1.2em; top: 1em; }
.hf2-finder .hf-wbody > i:nth-of-type(2) { left: 9em; top: 1em; }
.hf2-finder .hf-wbody > i:nth-of-type(3) { left: 1.2em; top: 5.4em; }
.hf2-finder .hf-wbody > i:nth-of-type(4) { left: 5.1em; top: 5.4em; }
.hf2-finder .hf-wbody > i:nth-of-type(5) { left: 9em; top: 5.4em; }
.hf2-app { position: absolute; left: 5.1em; top: 1em; width: 2.4em; }
.hf2-app .hf-ico { width: 2.4em; height: 2.4em; animation: %s var(--d) ease infinite; }
.hf2-app small { position: absolute; left: 50%%; top: calc(100%% + .6em); transform: translateX(-50%%); font-size: .58em; font-weight: 700; white-space: nowrap; }
.hf2-tray { animation: %s var(--d) ease infinite, %s var(--d) ease infinite; }
.hf2-pop { animation: %s var(--d) ease infinite; }
.hf2-cur { animation: %s var(--d) ease-in-out infinite; }
''' % (
    STEPS('hf2-finder', T, [(0, 'opacity: 1; transform: none'), (2.5, 'opacity: 0; transform: scale(.96)')], .5),
    KF('hf2-app', T, [(1.5, 'transform: none'), (1.7, 'transform: scale(1.2)'), (1.95, 'transform: none'), (2.1, 'transform: scale(1.1)'), (2.3, 'transform: none')]),
    STEPS('hf2-tray', T, [(0, 'opacity: 0'), (2.2, 'opacity: 1')]),
    KF('hf2-ring', T, [(2.2, 'box-shadow: 0 0 0 0 rgba(var(--blue-rgb), .75)'), (3.3, 'box-shadow: 0 0 0 .9em rgba(var(--blue-rgb), 0)')]),
    STEPS('hf2-pop', T, [(0, 'opacity: 0; transform: scale(.9)'), (4.45, 'opacity: 1; transform: none')], .3),
    CUR('hf2-cur', T, [(0, 12, 16), (.6, 12, 16), (1.4, 7.6, 7.2), (3.2, 7.6, 7.2), (4.2, 27.9, 1), (5, 27.9, 1), (5.8, 21, 17.6)], [1.5, 1.8, 4.35]),
))
FIGS.append(fig('hf2', 'MOTHERSHIP HOSTを開くと、Macのメニューバーにアイコンが出る。アイコンをクリックすると、メニューが開く様子',
    mbar('hf2-tray')
    + '<div class="hf-win hf2-finder">' + wbar('アプリケーション') + '<div class="hf-wbody"><span class="hf2-app"><span class="hf-ico">' + MARK + '</span><small>MOTHERSHIP HOST</small></span><i></i><i></i><i></i><i></i><i></i></div></div>'
    + pop([R_TITLE, r_dev(), r_perm('画面収録'), r_perm('アクセシビリティ'), r_tg('ログイン時に起動'), r_tg('待機中も Mac をスリープさせない')], 'hf2-pop')
    + CURSOR.format(c='hf2-cur')))

# ================================================================ 図 3：設定を開く → システム設定 → スイッチをオン
T = 12
CSS.append('''
/* 図 3：「設定を開く」→ システム設定でスイッチをオン。2 つの許可を順に（12 秒） */
.hf3 { --d: 12s; --fz: 9s; }
.hf3-win { left: 1.4em; top: 12.4em; width: 21em; height: 11em; transform-origin: 60%% 0; animation: %s var(--d) ease infinite; }
.hf3-h { position: relative; height: 1.5em; font-weight: 800; }
.hf3-h span { position: absolute; left: 0; top: 0; line-height: 1.5; }
.hf3-h span:nth-child(1) { animation: %s var(--d) ease infinite; }
.hf3-h span:nth-child(2) { opacity: 0; animation: %s var(--d) ease infinite; }
.hf3-app { display: flex; align-items: center; gap: .6em; height: 2.6em; margin-top: .6em; padding: 0 .7em; border-radius: .6em; background: #f4f6fb; }
.hf3-app .hf-ico { width: 1.5em; height: 1.5em; }
.hf3-app b { font-size: .92em; }
.hf3-app .hf-tg { margin-left: auto; animation: %s var(--d) ease infinite; }
.hf3-win .hf-skel { margin-top: .8em; }
.hf3-win .hf-skel + .hf-skel { width: 60%%; }
.hf3-d1 { animation: %s var(--d) ease infinite; }
.hf3-d2 { animation: %s var(--d) ease infinite; }
.hf3-b1 { animation: %s var(--d) ease infinite; }
.hf3-b2 { animation: %s var(--d) ease infinite; }
.hf3-cur { animation: %s var(--d) ease-in-out infinite; }
''' % (
    STEPS('hf3-win', T, [(0, 'opacity: 0; transform: scale(.92)'), (1.5, 'opacity: 1; transform: none')], .4),
    STEPS('hf3-ha', T, [(0, 'opacity: 1'), (5.3, 'opacity: 0')], .15),
    STEPS('hf3-hb', T, [(0, 'opacity: 0'), (5.35, 'opacity: 1')], .15),
    KF('hf3-tg', T, [(3.1, '--tg: 0'), (3.3, '--tg: 1'), (5.3, '--tg: 1'), (5.38, '--tg: 0'), (6.9, '--tg: 0'), (7.1, '--tg: 1')]),
    STEPS('hf3-d1', T, [(0, '--ok: 0'), (3.6, '--ok: 1')]),
    STEPS('hf3-d2', T, [(0, '--ok: 0'), (7.4, '--ok: 1')]),
    KF('hf3-b1', T, [(1.25, 'background: #e6ecf8; opacity: 1'), (1.36, 'background: #b3c5f5; opacity: 1'), (1.7, 'background: #e6ecf8; opacity: 1'), (3.6, 'background: #e6ecf8; opacity: 1'), (3.8, 'background: #e6ecf8; opacity: 0')]),
    KF('hf3-b2', T, [(5.15, 'background: #e6ecf8; opacity: 1'), (5.26, 'background: #b3c5f5; opacity: 1'), (5.6, 'background: #e6ecf8; opacity: 1'), (7.4, 'background: #e6ecf8; opacity: 1'), (7.6, 'background: #e6ecf8; opacity: 0')]),
    CUR('hf3-cur', T, [(0, 18, 14.5), (.4, 18, 14.5), (1.2, 28.3, 8.05), (2.2, 28.3, 8.05), (3, 19.6, 18.6), (4.3, 19.6, 18.6), (5.1, 28.3, 10.05), (6, 28.3, 10.05), (6.8, 19.6, 18.6), (7.6, 19.6, 18.6), (8.4, 24, 21.5)], [1.3, 3.1, 5.2, 6.9]),
))
FIGS.append(fig('hf3', 'メニューの「設定を開く」を押すと、Macのシステム設定が開く。「MOTHERSHIP HOST」のスイッチをオンにすると、メニューの印が緑のチェックに変わる。「画面収録」と「アクセシビリティ」の2つで、同じことをする様子',
    mbar()
    + pop([R_TITLE, r_dev(), r_perm('画面収録', 'hf3-d1', 'hf3-b1'), r_perm('アクセシビリティ', 'hf3-d2', 'hf3-b2')])
    + '<div class="hf-win hf3-win">' + wbar('システム設定') + '<div class="hf-wbody"><p class="hf3-h"><span>画面収録</span><span>アクセシビリティ</span></p><div class="hf3-app"><span class="hf-ico">' + MARK + '</span><b>MOTHERSHIP HOST</b><i class="hf-tg"></i></div><div class="hf-skel"></div><div class="hf-skel"></div></div></div>'
    + CURSOR.format(c='hf3-cur'), tall=True))

# ================================================================ 図 4：端末を追加… → QR コードのウィンドウ
T = 8
CSS.append('''
/* 図 4：メニューの「端末を追加…」→ QR コードのウィンドウ（8 秒） */
.hf4 { --d: 8s; --fz: 5s; }
.hf4-win { left: 1.4em; top: 2.8em; width: 12.6em; height: 15.6em; transform-origin: 70%% 20%%; animation: %s var(--d) ease infinite; }
.hf4-win .hf-wbody { display: grid; justify-items: center; align-content: center; gap: .7em; }
.hf4-qr { width: 8em; padding: .5em; border-radius: .5em; background: #fff; animation: %s var(--d) ease infinite; }
.hf4-qr svg { display: block; width: 100%%; height: auto; }
.hf4-win p { font-size: .66em; line-height: 1.5; text-align: center; color: var(--ink-2); }
.hf4-btn { animation: %s var(--d) ease infinite; }
.hf4-cur { animation: %s var(--d) ease-in-out infinite; }
''' % (
    STEPS('hf4-win', T, [(0, 'opacity: 0; transform: scale(.88)'), (1.6, 'opacity: 1; transform: none')], .4),
    KF('hf4-ring', T, [(2.4, 'box-shadow: 0 0 0 0 rgba(var(--blue-rgb), .65)'), (3.5, 'box-shadow: 0 0 0 .8em rgba(var(--blue-rgb), 0)')]),
    KF('hf4-btn', T, [(1.35, 'background: #e6ecf8'), (1.46, 'background: #b3c5f5'), (1.9, 'background: #e6ecf8')]),
    CUR('hf4-cur', T, [(0, 14.5, 18), (.4, 14.5, 18), (1.3, 27.95, 6.05), (1.8, 27.95, 6.05), (2.6, 20, 18.4)], [1.4]),
))
FIGS.append(fig('hf4', 'Macのメニューで「端末を追加…」を押すと、QRコードのウィンドウが開く様子',
    mbar()
    + pop([R_TITLE, r_dev('hf4-btn'), r_perm('画面収録', 'is-ok', btn=False), r_perm('アクセシビリティ', 'is-ok', btn=False), r_tg('ログイン時に起動'), r_tg('待機中も Mac をスリープさせない')])
    + '<div class="hf-win hf4-win">' + wbar('端末を追加') + '<div class="hf-wbody"><span class="hf4-qr">' + QR + '</span><p>残り 4 分 59 秒<br>1 回だけ使えます</p></div></div>'
    + CURSOR.format(c='hf4-cur')))

# ================================================================ 図 5：デバイスのカメラで QR コードを読む
T = 8.5
CSS.append('''
/* 図 5：デバイスのカメラで、Mac の QR コードを読み取る（8.5 秒） */
.hf5 { --d: 8.5s; --fz: 6s; }
.hf5-lap { left: 2em; top: 2.6em; font-size: .8em; }
.hf5-card, .hf5-done { position: absolute; left: 50%%; top: 55%%; width: 10.6em; padding: .7em .9em .9em; background: #fff; border-radius: .9em; box-shadow: 0 1em 2.2em -1em rgba(var(--navy-rgb), .55); text-align: center; transform: translate(-50%%, -50%%); }
.hf5-card { animation: %s var(--d) ease infinite; }
.hf5-card b { display: block; margin-bottom: .5em; font-size: .9em; line-height: 1.3; }
.hf5-card svg, .hf5-qrs svg { display: block; width: 100%%; height: auto; }
.hf5-done { display: grid; justify-items: center; gap: .5em; padding: 1.4em .8em; opacity: 0; animation: %s var(--d) ease infinite; }
.hf5-done i { display: grid; place-items: center; width: 2.4em; height: 2.4em; border-radius: 50%%; background: #2fae54; color: #fff; font-size: 1.2em; font-style: normal; font-weight: 800; }
.hf5-done b { font-size: .86em; line-height: 1.45; }
.hf5-ph { right: 2em; top: 2.2em; width: 9.8em; height: 16.6em; animation: %s var(--d) ease infinite; }
.hf5-cam { position: absolute; inset: 0; background: #131c36; }
.hf5-qrs { position: absolute; left: 50%%; top: 42%%; width: 5.2em; padding: .45em; background: #fff; border-radius: .4em; transform: translate(-50%%, -50%%); animation: %s var(--d) ease infinite; }
.hf5-find { position: absolute; left: 50%%; top: 42%%; width: 7.4em; height: 7.4em; transform: translate(-50%%, -50%%); animation: %s var(--d) ease infinite; }
.hf5-find i { position: absolute; width: 1.5em; height: 1.5em; border: .26em solid var(--cyan); }
.hf5-find i:nth-child(1) { left: 0; top: 0; border-right: 0; border-bottom: 0; border-radius: .5em 0 0 0; }
.hf5-find i:nth-child(2) { right: 0; top: 0; border-left: 0; border-bottom: 0; border-radius: 0 .5em 0 0; }
.hf5-find i:nth-child(3) { left: 0; bottom: 0; border-right: 0; border-top: 0; border-radius: 0 0 0 .5em; }
.hf5-find i:nth-child(4) { right: 0; bottom: 0; border-left: 0; border-top: 0; border-radius: 0 0 .5em 0; }
.hf5-scan { position: absolute; left: 10%%; right: 10%%; top: 27%%; height: .26em; border-radius: .2em; background: var(--cyan); box-shadow: 0 0 .8em .2em rgba(var(--cyan-rgb), .7); opacity: 0; animation: %s var(--d) ease-in-out infinite; }
.hf5-ok { position: absolute; left: 50%%; top: 42%%; display: grid; place-items: center; width: 1.9em; height: 1.9em; border-radius: 50%%; background: #2fae54; color: #fff; font-size: 1.9em; font-weight: 800; box-shadow: 0 .2em .6em rgba(0, 0, 0, .35); transform: translate(-50%%, -50%%); animation: %s var(--d) ease infinite; }
.hf5-cam em { position: absolute; left: 0; right: 0; bottom: 1.6em; font-size: .78em; font-style: normal; font-weight: 700; line-height: 1.3; color: var(--on-dark-2); text-align: center; white-space: nowrap; }
''' % (
    STEPS('hf5-card', T, [(0, 'opacity: 1'), (4, 'opacity: 0')]),
    STEPS('hf5-done', T, [(0, 'opacity: 0'), (4.15, 'opacity: 1')], .3),
    STEPS('hf5-ph', T, [(0, 'opacity: 0; transform: translate(3em, 4em)'), (.4, 'opacity: 1; transform: none')], .6),
    STEPS('hf5-qrs', T, [(0, 'opacity: 1'), (3.5, 'opacity: .3')], .25),
    STEPS('hf5-find', T, [(0, 'opacity: 0; transform: translate(-50%, -50%) scale(1.3)'), (1, 'opacity: 1; transform: translate(-50%, -50%)')], .3),
    KF('hf5-scan', T, [(1.25, 'top: 27%; opacity: 0'), (1.35, 'top: 27%; opacity: 1'), (2.3, 'top: 57%; opacity: 1'), (3.3, 'top: 27%; opacity: 1'), (3.45, 'top: 27%; opacity: 0')]),
    KF('hf5-ok', T, [(3.5, 'opacity: 0; transform: translate(-50%, -50%) scale(.3)'), (3.75, 'opacity: 1; transform: translate(-50%, -50%) scale(1.14)'), (3.9, 'opacity: 1; transform: translate(-50%, -50%)')]),
))
FIGS.append(fig('hf5', 'デバイスのカメラをMacのQRコードに向けて読み取ると、デバイスにチェックが出て、Macに「登録しました」と表示される様子',
    LAP('hf5-lap', '<div class="hf5-card"><b>端末を追加</b>' + QR + '</div><div class="hf5-done"><i>✓</i><b>iPhone を<br>登録しました</b></div>', LAPBAR)
    + '<div class="hf-ph hf5-ph"><div class="hf5-cam"><span class="hf5-qrs">' + QR + '</span><span class="hf5-find"><i></i><i></i><i></i><i></i></span><span class="hf5-scan"></span><span class="hf5-ok">✓</span><em>QRコードを読み取る</em></div></div>',
    room=True))

# ================================================================ 図 6：「接続」をタップ → Mac の画面が映る
T = 8.5
CSS.append('''
/* 図 6：デバイスで「接続」をタップ → Mac の画面が映る（8.5 秒） */
.hf6 { --d: 8.5s; --fz: 6s; }
.hf6-lap { left: 2.2em; top: 5.8em; font-size: .62em; }
.hf6-wifi { position: absolute; left: 10.25em; top: 5.3em; width: 0; height: 0; }
.hf6-wifi i { position: absolute; left: 0; top: 0; border: .34em solid transparent; border-top-color: var(--blue); border-radius: 50%%; opacity: 0; animation: %s var(--d) ease infinite; }
.hf6-wifi i:nth-child(1) { width: 2.4em; height: 2.4em; margin: -1.2em 0 0 -1.2em; }
.hf6-wifi i:nth-child(2) { width: 4.4em; height: 4.4em; margin: -2.2em 0 0 -2.2em; animation-name: %s; }
.hf6-wifi i:nth-child(3) { width: 6.4em; height: 6.4em; margin: -3.2em 0 0 -3.2em; animation-name: %s; }
.hf6-ph { right: 2.2em; top: 1.4em; width: 12em; height: 18em; }
.hf6-list { position: absolute; inset: 0; padding: 1.7em .8em 0; background: #0f1730; }
.hf6-list > p { font-size: .8em; font-weight: 700; line-height: 1.3; color: var(--on-dark-3); }
.hf6-card { display: grid; gap: .25em; margin-top: .8em; padding: .8em; border-radius: .8em; background: #1c2749; border: .08em solid rgba(255, 255, 255, .14); animation: %s var(--d) ease infinite; }
.hf6-card b { font-size: 1em; line-height: 1.3; color: #fff; }
.hf6-card small { font-size: .62em; line-height: 1.4; color: #6fe0b0; white-space: nowrap; }
.hf6-card em { position: relative; margin-top: .5em; padding: .5em 0; border-radius: .55em; background: var(--blue); color: #fff; font-size: .92em; font-style: normal; font-weight: 800; line-height: 1.2; text-align: center; animation: %s var(--d) ease infinite; }
.hf6-card em::after { content: ""; position: absolute; left: 50%%; top: 50%%; width: 2.2em; height: 2.2em; margin: -.7em 0 0 -.5em; border-radius: 50%%; background: rgba(255, 255, 255, .3); border: .16em solid rgba(255, 255, 255, .95); opacity: 0; animation: %s var(--d) ease infinite; }
.hf6-desk { position: absolute; inset: 0; background: linear-gradient(160deg, #c9d8f4, #eaf0fb); animation: %s var(--d) ease infinite; }
.hf6-desk .hf-w1 { left: 7%%; right: 7%%; top: 7%%; height: 38%%; animation: %s var(--d) ease infinite; }
.hf6-desk .hf-w2 { left: 7%%; right: 7%%; top: 50%%; bottom: 8%%; animation: %s var(--d) ease infinite; }
''' % (
    KF('hf6-a1', T, [(.3, 'opacity: 0'), (.5, 'opacity: 1'), (.8, 'opacity: 0'), (1, 'opacity: 1'), (1.3, 'opacity: 0'), (4.2, 'opacity: 0'), (4.6, 'opacity: .55')]),
    KF('hf6-a2', T, [(.42, 'opacity: 0'), (.62, 'opacity: 1'), (.92, 'opacity: 0'), (1.12, 'opacity: 1'), (1.42, 'opacity: 0'), (4.3, 'opacity: 0'), (4.7, 'opacity: .55')]),
    KF('hf6-a3', T, [(.54, 'opacity: 0'), (.74, 'opacity: 1'), (1.04, 'opacity: 0'), (1.24, 'opacity: 1'), (1.54, 'opacity: 0'), (4.4, 'opacity: 0'), (4.8, 'opacity: .55')]),
    STEPS('hf6-card', T, [(0, 'opacity: 0; transform: translateY(.6em)'), (.9, 'opacity: 1; transform: none')], .4),
    KF('hf6-btn', T, [(2.45, 'background: var(--blue)'), (2.55, 'background: var(--blue-deep)'), (2.9, 'background: var(--blue)')]),
    KF('hf6-tap', T, [(2, 'opacity: 0; transform: scale(1.6)'), (2.3, 'opacity: 1; transform: scale(1)'), (2.5, 'opacity: 1; transform: scale(.8)'), (2.7, 'opacity: 1; transform: scale(1)'), (3, 'opacity: 0; transform: scale(1.3)')]),
    STEPS('hf6-desk', T, [(0, 'opacity: 0'), (3, 'opacity: 1')], .5),
    STEPS('hf6-w1', T, [(0, 'opacity: 0; transform: scale(.75)'), (3.5, 'opacity: 1; transform: none')], .4),
    STEPS('hf6-w2', T, [(0, 'opacity: 0; transform: scale(.75)'), (3.8, 'opacity: 1; transform: none')], .4),
))
FIGS.append(fig('hf6', 'デバイスに登録したMacが出て「自宅 LAN で接続できます」と表示される。「接続」をタップすると、Macの画面がデバイスに映る様子',
    LAP('hf6-lap', WINS, LAPBAR)
    + '<span class="hf6-wifi"><i></i><i></i><i></i></span>'
    + '<div class="hf-ph hf6-ph"><div class="hf6-list"><p>登録した Mac</p><div class="hf6-card"><b>Mac mini</b><small>● 自宅 LAN で接続できます</small><em>接続</em></div></div><div class="hf6-desk">' + WINS + '</div></div>',
    room=True))

# ================================================================ 図 7：声の通り道
FIGS.append('''<div class="hfv" role="img" aria-label="声の通り道の図。デバイスで話した声は、MacのMOTHERSHIP HOSTに届く。MOTHERSHIP HOSTは、その声を仮想のマイク「BlackHole 2ch」に流す。Aqua VoiceがBlackHole 2chの声を聞いて文字にし、開いているアプリに入力する。Macに入れるのは、BlackHole 2chとAqua Voiceの2つ">
            <div class="hfv-row" aria-hidden="true">
              <div class="hfv-node hfv-n1"><b>デバイス</b><span>🎤を押して話す</span></div>
              <i class="hfv-link hfv-l1"></i>
              <div class="hfv-mac">
                <p>Macの中</p>
                <div class="hfv-node hfv-n2"><b>MOTHERSHIP HOST</b><span>声を受け取って、流す</span></div>
                <i class="hfv-link hfv-l2"></i>
                <div class="hfv-node hfv-n3 is-need"><em>入れる</em><b>BlackHole 2ch</b><span>仮想のマイク</span></div>
                <i class="hfv-link hfv-l3"></i>
                <div class="hfv-node hfv-n4 is-need"><em>入れる</em><b>Aqua Voice</b><span>声を文字にする</span></div>
                <i class="hfv-link hfv-l4"></i>
                <div class="hfv-node hfv-n5"><b>開いているアプリ</b><span>文字が入る</span></div>
              </div>
            </div>
          </div>''')

# ================================================================ 図 8：Mac の前で fn を押している間だけ話す
T = 8.5
CSS.append('''
/* 図 8：Mac の前で、fn を押している間だけ話す → メモに文字が入る（8.5 秒） */
.hf8 { --d: 8.5s; --fz: 6.5s; }
.hf8-note { left: 4.5em; top: 1.6em; width: 24.3em; height: 8.4em; }
.hf8-text { font-size: 1.05em; line-height: 1.6; }
.hf8-text span { display: inline-block; overflow: hidden; white-space: nowrap; vertical-align: bottom; animation: %s var(--d) ease infinite; }
.hf8-bubble { position: absolute; left: 1.95em; top: 12.9em; display: flex; align-items: baseline; gap: .5em; padding: .55em .9em; background: #fff; border-radius: 1em 1em 1em .2em; box-shadow: 0 .6em 1.6em -.8em rgba(var(--navy-rgb), .5); font-size: .82em; font-weight: 700; white-space: nowrap; line-height: 1.3; animation: %s var(--d) ease infinite; }
.hf8-bubble b { color: var(--blue-deep); font-size: .86em; }
.hf8-pill { position: absolute; left: 25.75em; top: 13.25em; display: flex; align-items: center; gap: .6em; padding: .5em 1em; border-radius: 99em; background: var(--navy); color: #fff; font-size: .8em; font-weight: 700; white-space: nowrap; animation: %s var(--d) ease infinite; }
.hf8-deck { position: absolute; left: 0; right: 0; top: 14em; bottom: 0; background: linear-gradient(#d7deeb, #bfc9dc); }
.hf8-keys { position: absolute; left: 1.87em; top: 15.3em; display: flex; gap: .5em; }
.hf8-keys span { display: grid; place-items: center; width: 2.6em; height: 3em; border-radius: .5em; background: #fff; border: 1px solid #b6c0d4; border-bottom-width: .24em; font-size: 1em; font-weight: 700; }
.hf8-keys span:nth-child(5) { width: 11em; }
.hf8-keys span:first-child { animation: %s var(--d) ease infinite; }
.hf8-fin { animation: %s var(--d) ease infinite; }
''' % (
    STEPS('hf8-text', T, [(0, 'opacity: 0; max-width: 0'), (4.4, 'opacity: 1; max-width: 18em')]),
    KF('hf8-bubble', T, [(1.2, 'opacity: 0; transform: translateY(.4em)'), (1.5, 'opacity: 1; transform: none'), (3.6, 'opacity: 1; transform: none'), (3.9, 'opacity: 0; transform: none')]),
    KF('hf8-pill', T, [(.9, 'opacity: 0; transform: translateY(.4em)'), (1.2, 'opacity: 1; transform: none'), (4.1, 'opacity: 1; transform: none'), (4.4, 'opacity: 0; transform: none')]),
    KF('hf8-fn', T, [(.8, 'background: #fff; color: var(--ink); transform: none'), (.9, 'background: var(--blue); color: #fff; transform: translateY(.14em)'), (3.6, 'background: var(--blue); color: #fff; transform: translateY(.14em)'), (3.7, 'background: #fff; color: var(--ink); transform: none')]),
    KF('hf8-fin', T, [(.3, 'opacity: 0; transform: translate(3.7em, 17.4em) scale(1.5)'), (.6, 'opacity: 1; transform: translate(3.7em, 17.4em) scale(1)'), (.85, 'opacity: 1; transform: translate(3.7em, 17.4em) scale(.86)'), (3.6, 'opacity: 1; transform: translate(3.7em, 17.4em) scale(.86)'), (3.75, 'opacity: 1; transform: translate(3.7em, 17.4em) scale(1)'), (4, 'opacity: 0; transform: translate(3.7em, 17.4em) scale(1.4)')]),
))
FIGS.append(fig('hf8', 'Macの前で、キーボードのfnキーを押している間だけ話す。キーを離すと、話した文がメモに入る様子',
    '<div class="hf-win hf8-note">' + wbar('メモ') + '<div class="hf-wbody"><p class="hf8-text"><span>明日の会議は、10時からです。</span><i class="hf-caret"></i></p></div></div>'
    + '<p class="hf8-bubble"><b>話す</b>「明日の会議は、10時からです」</p>'
    + '<p class="hf8-pill"><span class="hf-wave"><i></i><i></i><i></i><i></i><i></i></span>聞き取り中</p>'
    + '<div class="hf8-deck"></div><div class="hf8-keys"><span>fn</span><span>⌃</span><span>⌥</span><span>⌘</span><span></span><span>⌘</span><span>⌥</span></div>'
    + '<i class="hf-fin hf8-fin"></i>'))

# ================================================================ 図 9：Spotlight で「ターミナル」
T = 9.5
CSS.append('''
/* 図 9：⌘＋スペース → 「ターミナル」と打つ → return → ターミナルが開く（9.5 秒） */
.hf9 { --d: 9.5s; --fz: 7s; }
.hf9-spot { position: absolute; left: 6.5em; top: 4.6em; width: 20.33em; height: 3em; display: flex; align-items: center; gap: .8em; padding: 0 1em; background: rgba(255, 255, 255, .97); border-radius: 1em; box-shadow: 0 1.4em 3.4em -1.2em rgba(var(--navy-rgb), .6); animation: %s var(--d) ease infinite; }
.hf9-spot > i { flex: none; position: relative; width: 1em; height: 1em; border: .18em solid var(--ink-3); border-radius: 50%%; }
.hf9-spot > i::after { content: ""; position: absolute; right: -.42em; bottom: -.3em; width: .5em; height: .18em; border-radius: .1em; background: var(--ink-3); transform: rotate(45deg); }
.hf9-type { display: inline-block; overflow: hidden; white-space: nowrap; font-size: 1.2em; font-weight: 700; line-height: 1.5; vertical-align: bottom; animation: %s var(--d) linear infinite; }
.hf9-spot .hf-caret { height: 1.5em; }
.hf9-res { position: absolute; left: 6.5em; top: 7.8em; width: 20.33em; height: 2.6em; display: flex; align-items: center; gap: .7em; padding: 0 1em; background: #dfe8fb; border-radius: .8em; box-shadow: 0 1.2em 3em -1.2em rgba(var(--navy-rgb), .5); animation: %s var(--d) ease infinite; }
.hf9-res i { flex: none; display: grid; place-items: center; width: 1.6em; height: 1.6em; border-radius: .35em; background: #14203a; color: #fff; font-size: .78em; font-style: normal; font-weight: 800; }
.hf9-res b { font-size: .95em; }
.hf9-res small { margin-left: auto; font-size: .7em; color: var(--ink-3); }
.hf9-ka, .hf9-kb { position: absolute; left: 50%%; top: 15.2em; display: flex; align-items: center; gap: .5em; transform: translateX(-50%%); font-size: 1em; font-weight: 800; }
.hf9-ka { animation: %s var(--d) ease infinite; }
.hf9-kb { animation: %s var(--d) ease infinite; }
.hf9-ka .hf-key { animation: %s var(--d) ease infinite; }
.hf9-kb .hf-key { animation: %s var(--d) ease infinite; }
.hf9-term { left: 4.5em; top: 3em; width: 24.3em; height: 13.2em; animation: %s var(--d) ease infinite; }
''' % (
    KF('hf9-spot', T, [(1, 'opacity: 0; transform: scale(.96)'), (1.25, 'opacity: 1; transform: none'), (4.3, 'opacity: 1; transform: none'), (4.5, 'opacity: 0; transform: none')]),
    KF('hf9-type', T, [(1.7, 'width: 0; animation-timing-function: steps(5, end)'), (2.9, 'width: 5em')]),
    KF('hf9-res', T, [(3, 'opacity: 0'), (3.2, 'opacity: 1'), (4.3, 'opacity: 1'), (4.5, 'opacity: 0')]),
    KF('hf9-ka', T, [(.2, 'opacity: 0'), (.45, 'opacity: 1'), (1.4, 'opacity: 1'), (1.6, 'opacity: 0')]),
    KF('hf9-kb', T, [(3.4, 'opacity: 0'), (3.6, 'opacity: 1'), (4.5, 'opacity: 1'), (4.7, 'opacity: 0')]),
    KF('hf9-pa', T, [(.8, 'background: #fff; color: var(--ink); transform: none'), (.88, 'background: var(--blue); color: #fff; transform: translateY(.14em)'), (1.15, 'background: var(--blue); color: #fff; transform: translateY(.14em)'), (1.25, 'background: #fff; color: var(--ink); transform: none')]),
    KF('hf9-pb', T, [(3.9, 'background: #fff; color: var(--ink); transform: none'), (3.98, 'background: var(--blue); color: #fff; transform: translateY(.14em)'), (4.2, 'background: var(--blue); color: #fff; transform: translateY(.14em)'), (4.3, 'background: #fff; color: var(--ink); transform: none')]),
    STEPS('hf9-term', T, [(0, 'opacity: 0; transform: scale(.9)'), (4.5, 'opacity: 1; transform: none')], .4),
))
FIGS.append(fig('hf9', 'commandキーとスペースキーを押すと、検索の欄が出る。「ターミナル」と打ってreturnキーを押すと、ターミナルのウィンドウが開く様子',
    mbar()
    + '<div class="hf9-spot"><i></i><p><span class="hf9-type">ターミナル</span><i class="hf-caret"></i></p></div>'
    + '<div class="hf9-res"><i>&gt;_</i><b>ターミナル</b><small>アプリケーション</small></div>'
    + '<div class="hf9-ka"><span class="hf-key">⌘</span>＋<span class="hf-key">スペース</span></div>'
    + '<div class="hf9-kb"><span class="hf-key">return</span></div>'
    + '<div class="hf-win hf9-term">' + wbar('ターミナル') + '<div class="hf-tbody"><p><span class="pr">user@Mac ~ %</span> <i class="hf-caret"></i></p></div></div>'))

# ================================================================ 図 10：ターミナルで Homebrew を入れる
T = 16
L = lambda n, t: STEPS('hf10-l%d' % n, T, [(0, 'opacity: 0'), (t, 'opacity: 1')], .15)
TAG = lambda n, a, b: KF('hf10-t%d' % n, T, [(a, 'opacity: 0; transform: translateX(.4em)'), (a + .3, 'opacity: 1; transform: none'), (b, 'opacity: 1; transform: none'), (b + .3, 'opacity: 0; transform: none')])
CSS.append('''
/* 図 10：ターミナルにコマンドを貼り付けて、Homebrew が入るまで（16 秒）。
   0.6 貼り付け → 2.0 Password → 5.5 Press RETURN → 7.5 ダウンロード → 10.6 Installation successful! → 11.3 Next steps */
.hf10 { --d: 16s; --fz: 13.5s; }
.hf10-term { left: 1.4em; top: 1.4em; width: 30.53em; height: 22.2em; }
.hf10-term p.l1 { animation: %s var(--d) ease infinite; }
.hf10-term p.l1 > span:last-child { border-radius: .2em; animation: %s var(--d) ease infinite; }
.hf10-term p.l2 { animation: %s var(--d) ease infinite; }
.hf10-term p.l3 { animation: %s var(--d) ease infinite; }
.hf10-term p.l3 .hf-caret { animation: hf-blink 1s steps(2) infinite; }
.hf10-term p.l4 { animation: %s var(--d) ease infinite; }
.hf10-term p.l5 { animation: %s var(--d) ease infinite; }
.hf10-term p.l6 { animation: %s var(--d) ease infinite; }
.hf10-term p.l7 { animation: %s var(--d) ease infinite; }
.hf10-bar { display: inline-block; width: 16em; height: .7em; border-radius: .4em; background: rgba(255, 255, 255, .16); overflow: hidden; vertical-align: middle; }
.hf10-bar i { display: block; height: 100%%; border-radius: inherit; background: #6ea8ff; animation: %s var(--d) linear infinite; }
.hf10-term p.l8 { color: #59d98e; font-weight: 700; animation: %s var(--d) ease infinite; }
.hf10-term p.l9 { animation: %s var(--d) ease infinite; }
.hf10-next { margin: .2em 0 0 1.2em; padding: .1em .6em; border: .1em dashed var(--cyan); border-radius: .4em; width: max-content; animation: %s var(--d) ease infinite; }
.hf10 .hf-tag i { background: var(--cyan); color: var(--navy-2); }
.hf10-t3 { right: 2.4em; top: 6.9em; animation: %s var(--d) ease infinite; }
.hf10-t5 { right: 2.4em; top: 9.8em; animation: %s var(--d) ease infinite; }
.hf10-t7 { right: 2.4em; top: 12.7em; animation: %s var(--d) ease infinite; }
.hf10-t11 { left: 3.2em; top: 20.9em; animation: %s var(--d) ease infinite; }
''' % (
    L(1, .6),
    KF('hf10-paste', T, [(.6, 'background: rgba(var(--cyan-rgb), .4)'), (1.3, 'background: rgba(var(--cyan-rgb), 0)')]),
    L(2, 1.6), L(3, 2.0), L(4, 5.0), L(5, 5.5), L(6, 7.5), L(7, 7.7),
    KF('hf10-bar', T, [(7.8, 'width: 3%'), (10.2, 'width: 100%')]),
    L(8, 10.6), L(9, 11.3),
    STEPS('hf10-next', T, [(0, 'opacity: 0'), (11.6, 'opacity: 1')], .15),
    TAG(3, 2.3, 4.6), TAG(5, 5.8, 7.2), TAG(7, 7.9, 10.3), TAG(11, 12, 15.2),
))
FIGS.append(fig('hf10', 'ターミナルにコマンドを貼り付けて実行する様子。「Password:」ではMacのパスワードを打つ（打った文字は出ない）。「Press RETURN/ENTER to continue」ではreturnキーを押す。数分待つと「Installation successful!」と出る。最後の「Next steps:」の下に出たコマンドを、コピーして実行する',
    '<div class="hf-win hf10-term">' + wbar('ターミナル') + '<div class="hf-tbody">'
    + '<p class="l1"><span class="pr">%</span> <span>/bin/bash -c "$(curl -fsSL https://…/install.sh)"</span></p>'
    + '<p class="l2"><span class="ar">==&gt;</span> Checking for sudo access…</p>'
    + '<p class="l3">Password: 🔑<i class="hf-caret"></i></p>'
    + '<p class="l4"><span class="ar">==&gt;</span> This script will install: /opt/homebrew</p>'
    + '<p class="l5">Press RETURN/ENTER to continue…</p>'
    + '<p class="l6"><span class="ar">==&gt;</span> Downloading and installing Homebrew…</p>'
    + '<p class="l7"><span class="hf10-bar"><i></i></span></p>'
    + '<p class="l8">==&gt; Installation successful!</p>'
    + '<p class="l9"><span class="ar">==&gt;</span> Next steps:</p>'
    + '<div class="hf10-next"><p>echo &gt;&gt; ~/.zprofile</p><p>eval "$(/opt/homebrew/bin/brew shellenv)"</p></div>'
    + '</div></div>'
    + '<span class="hf-tag hf10-t3"><i>打っても、文字は出ません</i></span>'
    + '<span class="hf-tag hf10-t5"><i>return キーを押す</i></span>'
    + '<span class="hf-tag hf10-t7"><i>数分かかります</i></span>'
    + '<span class="hf-tag hf10-t11"><i>↑ この行をコピーして、1行ずつ実行</i></span>',
    tall=True))

# ================================================================ 図 11：サウンド › 入力 に BlackHole 2ch
T = 7.5
CSS.append('''
/* 図 11：システム設定 › サウンド › 入力 の一覧に「BlackHole 2ch」が出る。選ぶのは、いつものマイクのまま（7.5 秒） */
.hf11 { --d: 7.5s; --fz: 6s; }
.hf-set { left: 1.6em; top: 1.5em; width: 30.13em; height: 17.8em; }
.hf-set .hf-wbody { display: flex; padding: 0; }
.hf-side { flex: none; position: relative; width: 8em; padding: .8em; display: grid; align-content: start; gap: .2em; background: #f1f3f8; border-right: 1px solid #e1e6ef; }
.hf-side span { position: relative; display: flex; align-items: center; height: 1.9em; padding: 0 .7em; border-radius: .5em; font-size: .82em; font-weight: 700; white-space: nowrap; }
.hf-side span.is-sel { background: var(--blue); color: #fff; }
.hf-side .hf-skel { margin: .7em .5em; }
.hf-main { flex: 1; min-width: 0; position: relative; padding: 1em 1.1em; }
.hf-main > h4 { font-size: 1.1em; font-weight: 800; line-height: 1.4; }
.hf11-seg { display: inline-flex; margin-top: .7em; padding: .15em; border-radius: .5em; background: #e9edf5; font-size: .78em; font-weight: 700; }
.hf11-seg span { padding: .3em 1.2em; border-radius: .4em; }
.hf11-seg span + span { background: #fff; box-shadow: 0 .1em .3em rgba(0, 0, 0, .15); }
.hf11-th, .hf11-row { display: flex; align-items: center; gap: .6em; padding: 0 .7em; }
.hf11-th { margin-top: .8em; height: 1.5em; font-size: .68em; color: var(--ink-3); }
.hf11-th span:first-child, .hf11-row b { width: 9.2em; }
.hf11-th span:first-child { width: 12.4em; }
.hf11-row { position: relative; height: 2.1em; border-radius: .5em; }
.hf11-row b { font-size: .9em; white-space: nowrap; }
.hf11-row small { font-size: .78em; color: var(--ink-2); }
.hf11-row.is-sel { background: #dfe8fb; }
.hf11-row .hf-tag { right: .5em; top: 50%%; margin-top: -.75em; }
.hf11-r2 { margin-top: .25em; animation: %s var(--d) ease infinite, %s var(--d) ease infinite; }
.hf11-r2 .hf-tag i { background: #2fae54; }
.hf11-r2 .hf-tag { animation: %s var(--d) ease infinite; }
.hf11-r1 .hf-tag { animation: %s var(--d) ease infinite; }
.hf11-level { display: flex; align-items: center; gap: .25em; margin-top: 2.2em; padding: 0 .7em; font-size: .72em; color: var(--ink-3); }
.hf11-level span { margin-right: .6em; }
.hf11-level i { width: .9em; height: .5em; border-radius: .2em; background: #d6dcea; }
.hf11-level i:nth-of-type(-n+4) { background: var(--blue); }
''' % (
    STEPS('hf11-r2', T, [(0, 'opacity: 0; transform: translateY(.4em)'), (1, 'opacity: 1; transform: none')], .4),
    KF('hf11-ring', T, [(1.5, 'box-shadow: 0 0 0 .16em rgba(var(--blue-rgb), 0)'), (1.9, 'box-shadow: 0 0 0 .16em rgba(var(--blue-rgb), .9)'), (2.6, 'box-shadow: 0 0 0 .16em rgba(var(--blue-rgb), .2)'), (3, 'box-shadow: 0 0 0 .16em rgba(var(--blue-rgb), .9)'), (3.8, 'box-shadow: 0 0 0 .16em rgba(var(--blue-rgb), .45)')]),
    STEPS('hf11-t2', T, [(0, 'opacity: 0'), (1.8, 'opacity: 1')], .3),
    STEPS('hf11-t1', T, [(0, 'opacity: 0'), (3.6, 'opacity: 1')], .3),
))
FIGS.append(fig('hf11', 'Macの「システム設定」の「サウンド」の「入力」の画面。一覧に「BlackHole 2ch」が増えている。選ばれているのは、いつものマイクのまま',
    '<div class="hf-win hf-set">' + wbar('システム設定') + '<div class="hf-wbody">'
    + '<div class="hf-side"><div class="hf-skel"></div><div class="hf-skel"></div><span class="is-sel">サウンド</span><div class="hf-skel"></div><div class="hf-skel"></div></div>'
    + '<div class="hf-main"><h4>サウンド</h4><div class="hf11-seg"><span>出力</span><span>入力</span></div>'
    + '<div class="hf11-th"><span>名前</span><span>種類</span></div>'
    + '<div class="hf11-row hf11-r1 is-sel"><b>MacBookのマイク</b><small>内蔵</small><span class="hf-tag"><i>選ぶのは、こちら</i></span></div>'
    + '<div class="hf11-row hf11-r2"><b>BlackHole 2ch</b><small>仮想</small><span class="hf-tag"><i>入っています</i></span></div>'
    + '<div class="hf11-level"><span>入力レベル</span><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'
    + '</div></div></div>'))

# ================================================================ 図 12：Aqua Voice のマイクを BlackHole 2ch に
T = 9
CSS.append('''
/* 図 12：Aqua Voice の設定 →「Audio」→ マイクを「BlackHole 2ch」に（9 秒）。画面は説明用の絵（区分の名前は公式の案内に合わせた。2026-11-21） */
.hf12 { --d: 9s; --fz: 7s; }
.hf12-sel { position: absolute; left: .8em; top: .8em; width: 6.4em; height: 1.56em; border-radius: .41em; background: var(--blue); animation: %s var(--d) ease infinite; }
.hf12 .hf-side span:nth-of-type(1) { animation: %s var(--d) ease infinite; }
.hf12 .hf-side span:nth-of-type(2) { animation: %s var(--d) ease infinite; }
.hf12-gen, .hf12-audio { position: absolute; inset: 1em 1.1em; }
.hf12-gen { display: grid; align-content: start; gap: 1.1em; animation: %s var(--d) ease infinite; }
.hf12-gen .hf-skel:nth-child(1) { width: 40%%; height: .8em; }
.hf12-gen .hf-skel:nth-child(3) { width: 70%%; }
.hf12-audio { opacity: 0; animation: %s var(--d) ease infinite; }
.hf12-audio h4 { font-size: 1.1em; font-weight: 800; line-height: 1.4; }
.hf12-mic { display: flex; align-items: center; justify-content: space-between; height: 2.1em; margin-top: 1em; }
.hf12-mic > b { font-size: .92em; }
.hf12-dd { position: relative; width: 12em; height: 2.1em; display: flex; align-items: center; padding: 0 .8em; border: 1px solid #c3ccdd; border-radius: .55em; background: #fff; animation: %s var(--d) ease infinite; }
.hf12-dd span { position: absolute; left: .8em; font-size: .84em; font-weight: 700; white-space: nowrap; }
.hf12-dd span:nth-of-type(1) { animation: %s var(--d) ease infinite; }
.hf12-dd span:nth-of-type(2) { opacity: 0; animation: %s var(--d) ease infinite; }
.hf12-dd::after { content: ""; position: absolute; right: .8em; top: 50%%; width: .45em; height: .45em; margin-top: -.35em; border-right: .14em solid var(--ink-2); border-bottom: .14em solid var(--ink-2); transform: rotate(45deg); }
.hf12-list { position: absolute; right: 0; top: 4.9em; width: 12em; padding: .3em; background: #fff; border-radius: .6em; box-shadow: 0 1em 2.6em -1em rgba(var(--navy-rgb), .6), 0 0 0 1px #dfe4ee; transform-origin: 50%% 0; opacity: 0; animation: %s var(--d) ease infinite; }
.hf12-list span { display: flex; align-items: center; gap: .4em; height: 1.9em; padding: 0 .6em; border-radius: .4em; font-size: .84em; font-weight: 700; white-space: nowrap; }
.hf12-list span::before { content: "✓"; width: 1em; color: var(--blue); opacity: 0; }
.hf12-list span:nth-child(1)::before { opacity: 1; }
.hf12-list span:nth-child(2) { animation: %s var(--d) ease infinite; }
.hf12-cur { animation: %s var(--d) ease-in-out infinite; }
''' % (
    STEPS('hf12-sel', T, [(0, 'transform: none'), (1.2, 'transform: translateY(1.76em)')], .15),
    STEPS('hf12-s1', T, [(0, 'color: #fff'), (1.2, 'color: var(--ink)')], .15),
    STEPS('hf12-s2', T, [(0, 'color: var(--ink)'), (1.2, 'color: #fff')], .15),
    STEPS('hf12-gen', T, [(0, 'opacity: 1'), (1.3, 'opacity: 0')]),
    STEPS('hf12-audio', T, [(0, 'opacity: 0'), (1.4, 'opacity: 1')], .3),
    KF('hf12-dd', T, [(4.9, 'box-shadow: 0 0 0 0 rgba(var(--blue-rgb), .8); border-color: #c3ccdd'), (5.3, 'box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), .35); border-color: var(--blue)'), (6.3, 'box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), 0); border-color: var(--blue)')]),
    STEPS('hf12-v1', T, [(0, 'opacity: 1'), (4.6, 'opacity: 0')], .15),
    STEPS('hf12-v2', T, [(0, 'opacity: 0'), (4.7, 'opacity: 1')], .15),
    KF('hf12-list', T, [(3, 'opacity: 0; transform: scaleY(.9)'), (3.2, 'opacity: 1; transform: none'), (4.6, 'opacity: 1; transform: none'), (4.8, 'opacity: 0; transform: none')]),
    KF('hf12-item', T, [(4.1, 'background: rgba(var(--blue-rgb), 0); color: var(--ink)'), (4.25, 'background: var(--blue); color: #fff')]),
    CUR('hf12-cur', T, [(0, 15, 16.5), (.4, 15, 16.5), (1.1, 5.6, 6.7), (2, 5.6, 6.7), (2.8, 24.6, 7.95), (3.6, 24.6, 7.95), (4.2, 24.6, 12.4), (5, 24.6, 12.4), (5.8, 19.5, 17)], [1.2, 2.9, 4.5]),
))
FIGS.append(fig('hf12', 'Aqua Voiceの設定で「Audio」を開き、マイクの一覧から「BlackHole 2ch」を選ぶ様子',
    '<div class="hf-win hf-set">' + wbar('Aqua Voice') + '<div class="hf-wbody">'
    + '<div class="hf-side"><i class="hf12-sel"></i><span>General</span><span>Audio</span><span>Keybindings</span></div>'
    + '<div class="hf-main"><div class="hf12-gen"><div class="hf-skel"></div><div class="hf-skel"></div><div class="hf-skel"></div><div class="hf-skel"></div></div>'
    + '<div class="hf12-audio"><h4>Audio</h4><div class="hf12-mic"><b>Microphone</b><div class="hf12-dd"><span>MacBookのマイク</span><span>BlackHole 2ch</span></div></div>'
    + '<div class="hf12-list"><span>MacBookのマイク</span><span>BlackHole 2ch</span><span>イヤホンのマイク</span></div></div>'
    + '</div></div></div>' + CURSOR.format(c='hf12-cur')))

# ================================================================ 図 13：Mac の前の声と、デバイスの声
FIGS.append('''<div class="hfv hfv-two" role="img" aria-label="声の通り道を2つ並べた図。Macの前で話すときは、Macのマイクの声を、MOTHERSHIP HOSTがBlackHole 2chに流す。デバイスから話すときは、デバイスのマイクの声を、MOTHERSHIP HOSTがBlackHole 2chに流す。どちらも、BlackHole 2chからAqua Voiceに届いて文字になる">
            <p class="hfv-case" aria-hidden="true"><span>Macの前で話すとき</span><span>デバイスから話すとき</span></p>
            <div class="hfv-row" aria-hidden="true">
              <div class="hfv-src">
                <div class="hfv-node hfv-sa"><b>Macのマイク</b><span>fnを押して話す</span></div>
                <div class="hfv-node hfv-sb"><b>デバイスのマイク</b><span>🎤を押して話す</span></div>
              </div>
              <i class="hfv-link hfv-m1"></i>
              <div class="hfv-node hfv-h1"><b>MOTHERSHIP HOST</b><span>どちらかの声を流す</span></div>
              <i class="hfv-link hfv-m2"></i>
              <div class="hfv-node hfv-h2"><b>BlackHole 2ch</b><span>仮想のマイク</span></div>
              <i class="hfv-link hfv-m3"></i>
              <div class="hfv-node hfv-h3"><b>Aqua Voice</b><span>文字にする</span></div>
            </div>
          </div>''')

# ================================================================ 図 14：デバイスの 🎤 → Mac に文字
T = 9.5
CSS.append('''
/* 図 14：デバイスの 🎤 を押している間だけ話す → 離すと、Mac の入力欄に文字が入る（9.5 秒） */
.hf14 { --d: 9.5s; --fz: 7s; }
.hf14-lap { left: 2.2em; top: 4.8em; font-size: .64em; }
.hf14-ai { position: absolute; left: 6%%; right: 6%%; top: 16%%; bottom: 8%%; display: flex; flex-direction: column; gap: .7em; background: #fff; border-radius: .6em; box-shadow: 0 .5em 1.2em -.6em rgba(var(--navy-rgb), .5); overflow: hidden; }
.hf14-ai > b { flex: none; height: 1.1em; background: var(--navy); }
.hf14-ai > i { flex: none; height: .5em; margin-inline: .9em; border-radius: .3em; background: #28508f; }
.hf14-ai > i:nth-of-type(2) { width: 58%%; }
.hf14-ai > i:nth-of-type(3) { width: 72%%; background: #8fb0e8; }
.hf14-in { margin: auto .8em .8em; display: flex; align-items: center; min-height: 2.4em; padding: .4em .7em; border: .14em solid var(--blue); border-radius: .6em; background: #f4f7fd; animation: %s var(--d) ease infinite; }
.hf14-in u { display: block; width: 74%%; height: .5em; border-radius: .3em; background: var(--ink); animation: %s var(--d) ease infinite; }
.hf14-ph { right: 2em; top: 1.3em; width: 12.4em; height: 18.2em; }
.hf14-desk { position: absolute; inset: 0; background: linear-gradient(160deg, #c9d8f4, #eaf0fb); }
.hf14-desk .hf14-ai { left: 6%%; right: 6%%; top: 4%%; bottom: auto; height: 60%%; gap: .55em; }
.hf14-desk .hf14-in { min-height: 3.1em; align-items: flex-start; }
.hf14-desk .hf14-in span { font-size: .7em; font-weight: 700; line-height: 1.5; animation: %s var(--d) ease infinite; }
.hf14-wave { position: absolute; left: 0; right: 0; bottom: 4.4em; display: flex; justify-content: center; color: var(--blue); animation: %s var(--d) ease infinite; }
.hf14-wave .hf-wave { height: 1.8em; }
.hf14-bar { position: absolute; left: 50%%; bottom: .9em; display: flex; gap: .35em; padding: .4em; border-radius: 99em; background: rgba(11, 16, 32, .92); transform: translateX(-50%%); }
.hf14-bar span { position: relative; display: grid; place-items: center; width: 2em; height: 2em; border-radius: 50%%; background: #263257; color: #fff; font-size: 1em; font-weight: 700; }
.hf14-bar span:first-child { animation: %s var(--d) ease infinite; }
.hf14-bar span:first-child::after { content: ""; position: absolute; z-index: 2; left: 50%%; top: 50%%; width: 1.5em; height: 1.5em; margin: -.5em 0 0 -.4em; border-radius: 50%%; background: rgba(255, 255, 255, .3); border: .14em solid rgba(255, 255, 255, .95); opacity: 0; animation: %s var(--d) ease infinite; }
.hf14-ta, .hf14-tb { left: 1.4em; top: 17.2em; }
.hf14-ta { animation: %s var(--d) ease infinite; }
.hf14-tb i { background: #2fae54; }
.hf14-tb { animation: %s var(--d) ease infinite; }
''' % (
    KF('hf14-flash', T, [(4.5, 'box-shadow: 0 0 0 0 rgba(var(--blue-rgb), .8)'), (4.8, 'box-shadow: 0 0 0 .4em rgba(var(--blue-rgb), .35)'), (5.8, 'box-shadow: 0 0 0 .4em rgba(var(--blue-rgb), 0)')]),
    STEPS('hf14-bartext', T, [(0, 'opacity: 0'), (4.5, 'opacity: 1')]),
    STEPS('hf14-text', T, [(0, 'opacity: 0'), (4.5, 'opacity: 1')]),
    KF('hf14-wave', T, [(.9, 'opacity: 0'), (1.1, 'opacity: 1'), (3.6, 'opacity: 1'), (3.8, 'opacity: 0')]),
    KF('hf14-mic', T, [(.8, 'background: #263257; box-shadow: 0 0 0 0 rgba(var(--rec-rgb), 0)'), (.9, 'background: var(--rec); box-shadow: 0 0 0 .35em rgba(var(--rec-rgb), .3)'), (3.6, 'background: var(--rec); box-shadow: 0 0 0 .35em rgba(var(--rec-rgb), .3)'), (3.7, 'background: #263257; box-shadow: 0 0 0 0 rgba(var(--rec-rgb), 0)')]),
    KF('hf14-fin', T, [(.4, 'opacity: 0; transform: scale(1.5)'), (.7, 'opacity: 1; transform: scale(1)'), (.85, 'opacity: 1; transform: scale(.86)'), (3.6, 'opacity: 1; transform: scale(.86)'), (3.75, 'opacity: 1; transform: scale(1)'), (4, 'opacity: 0; transform: scale(1.4)')]),
    KF('hf14-ta', T, [(1, 'opacity: 0'), (1.3, 'opacity: 1'), (3.6, 'opacity: 1'), (3.9, 'opacity: 0')]),
    STEPS('hf14-tb', T, [(0, 'opacity: 0'), (4.6, 'opacity: 1')], .3),
))
AI = lambda inner: '<div class="hf14-ai"><b></b><i></i><i></i><i></i><div class="hf14-in">%s</div></div>' % inner
FIGS.append(fig('hf14', 'デバイスの🎤ボタンを押している間だけ話す。ボタンを離すと、話した文がMacの入力欄に入る様子',
    LAP('hf14-lap', AI('<u></u>'), LAPBAR)
    + '<div class="hf-ph hf14-ph"><div class="hf14-desk">' + AI('<span>次は、グラフを直してください。</span>') + '<div class="hf14-wave"><span class="hf-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div><div class="hf14-bar"><span>🎤</span><span>⌫</span><span>⏎</span><span>⇥</span></div></div></div>'
    + '<span class="hf-tag hf14-ta"><i>押している間だけ、話す</i></span><span class="hf-tag hf14-tb"><i>離すと、Macに文字が入る</i></span>',
    room=True))

# ================================================================ 図 15：外から、Tailscale を通って
FIGS.append('''<div class="hfv hfv-out" role="img" aria-label="外出先のデバイスが、Tailscaleの暗号化された通り道を通って、家のMacにつながる図。操作はデバイスからMacへ、画面はMacからデバイスへ、直接やり取りする。MOTHERSHIPのサーバーは通らない">
            <div class="hfv-row" aria-hidden="true">
              <div class="hfv-node hfv-o1"><b>外出先のデバイス</b><span>モバイル回線や、外のWi-Fi</span></div>
              <div class="hfv-tunnel"><b>Tailscale</b><span>暗号化された通り道</span><i></i><i></i><i></i><i></i></div>
              <div class="hfv-node hfv-o2"><b>家のMac</b><span>MOTHERSHIP HOST</span></div>
            </div>
            <p class="hfv-legend" aria-hidden="true"><span>操作（デバイス → Mac）</span><span>画面（Mac → デバイス）</span></p>
            <p class="hfv-x" aria-hidden="true"><s>MOTHERSHIPのサーバー</s>は通りません。ルーターの設定も、要りません。</p>
          </div>''')

# ================================================================ 図 16：メニューで 2 つのスイッチをオン
T = 8
CSS.append('''
/* 図 16：メニューで「ログイン時に起動」「待機中も Mac をスリープさせない」をオン（8 秒） */
.hf16 { --d: 8s; --fz: 6s; }
.hf16 .hf-pop { width: 21.5em; }
.hf16-t1 { animation: %s var(--d) ease infinite; }
.hf16-t2 { animation: %s var(--d) ease infinite; }
.hf16-r1 { border-radius: .4em; animation: %s var(--d) ease infinite; }
.hf16-r2 { border-radius: .4em; animation: %s var(--d) ease infinite; }
.hf16-cur { animation: %s var(--d) ease-in-out infinite; }
''' % (
    STEPS('hf16-t1', T, [(0, '--tg: 0'), (1.3, '--tg: 1')]),
    STEPS('hf16-t2', T, [(0, '--tg: 0'), (2.5, '--tg: 1')]),
    KF('hf16-r1', T, [(1.3, 'box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), 0)'), (1.5, 'box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), .3)'), (2.3, 'box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), 0)')]),
    KF('hf16-r2', T, [(2.5, 'box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), 0)'), (2.7, 'box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), .3)'), (3.5, 'box-shadow: 0 0 0 .3em rgba(var(--blue-rgb), 0)')]),
    CUR('hf16-cur', T, [(0, 13.5, 17.5), (.4, 13.5, 17.5), (1.2, 29.6, 12.05), (1.9, 29.6, 12.05), (2.4, 29.6, 14.05), (2.9, 29.6, 14.05), (3.6, 19, 18.4)], [1.3, 2.5]),
))
FIGS.append(fig('hf16', 'MOTHERSHIP HOSTのメニューで、「ログイン時に起動」と「待機中も Mac をスリープさせない」のスイッチを、順にオンにする様子',
    mbar()
    + pop([R_TITLE, r_dev(), r_perm('画面収録', 'is-ok', btn=False), r_perm('アクセシビリティ', 'is-ok', btn=False), r_tg('ログイン時に起動', 'hf16-t1', 'hf16-r1'), r_tg('待機中も Mac をスリープさせない', 'hf16-t2', 'hf16-r2')])
    + CURSOR.format(c='hf16-cur')))

# ================================================================ 図 17〜29（2026-11-21 追加）
# 17：「かんたんにまとめると」の 5 行を、5 つの場面で（15 秒）。18〜29：困ったときの小さな図（.is-mini、16:9）
def A(name, ease='ease'):
    return 'animation: %s var(--d) %s infinite;' % (name, ease)


def ON(name, T, t_on, t_off=None, dur=.3, extra_off='', extra_on=''):
    """その秒から見える（t_off があれば、その秒で消える）"""
    seq = [(0, 'opacity: 0' + extra_off), (t_on, 'opacity: 1' + extra_on)]
    if t_off is not None:
        seq.append((t_off, 'opacity: 0' + extra_off))
    return STEPS(name, T, seq, dur)


def OKAT(name, T, t):
    return STEPS(name, T, [(0, '--ok: 0'), (t, '--ok: 1')], .25)


def TYPE(name, T, t0, t1, n, width='30em', t_off=None):
    pts = [(t0, 'max-width: 0; animation-timing-function: steps(%d, end)' % n), (t1, 'max-width: %s' % width)]
    if t_off is not None:
        pts += [(t_off, 'max-width: %s' % width), (t_off + .2, 'max-width: 0')]
    return KF(name, T, pts)


def RULES(cls, T, fz, rules):
    CSS.append('\n.%s { --d: %ss; --fz: %ss; }\n' % (cls, T, fz) + '\n'.join('%s { %s }' % r for r in rules) + '\n')


def MINI(cls, label, inner):
    return fig(cls + ' is-mini', label, inner)


BAN = lambda cls, text, ok=False: '<p class="hfm-ban %s%s"><i>%s</i><span>%s</span></p>' % ('is-ok ' if ok else '', cls, '✓' if ok else '!', text)
CK = lambda cls, text: '<p class="hfm-ck %s"><i></i><span>%s</span></p>' % (cls, text)
TAG = lambda cls, text: '<span class="hf-tag hfm-tag %s"><i>%s</i></span>' % (cls, text)
DESK = '<div class="hfm-desk">' + WINS + '</div>'
PHM = lambda cls, inner: '<div class="hf-ph hfm-ph %s">%s</div>' % (cls, inner)
FIN = lambda cls: '<span class="hf-fin %s"></span>' % cls


def TAP(name, T, taps):
    """指の跡。taps = [(秒, x, y), ...]（図の em）。その場所に出て、押して、消える"""
    pts = []
    for t, x, y in taps:
        tr = 'translate(%sem, %sem)' % (x, y)
        pts += [(t - .35, 'opacity: 0; transform: %s scale(1.5)' % tr), (t - .1, 'opacity: 1; transform: %s scale(1)' % tr),
                (t, 'opacity: 1; transform: %s scale(.82)' % tr), (t + .2, 'opacity: 1; transform: %s scale(1)' % tr), (t + .5, 'opacity: 0; transform: %s scale(1)' % tr)]
    return KF(name, T, pts)


# ---- 図 17：かんたんにまとめると（15 秒。3 秒ずつ 5 つの場面。下の札の番号が、上の 5 行に対応）
T = 15
RULES('hf17', T, 13.6, [
    ('.hf17-lap', 'font-size: .7em; left: 2.2em; top: 3.4em;'),
    ('.hf17-pop', A(ON('hf17-pop', T, .3, 2.8))),
    ('.hf17-d1', A(OKAT('hf17-d1', T, 1.1))),
    ('.hf17-d2', A(OKAT('hf17-d2', T, 1.9))),
    ('.hf17-qr', 'left: 6em; top: 2.6em; width: 12em; height: 12.2em; z-index: 3; ' + A(ON('hf17-qr', T, 3, 5.8))),
    ('.hf17-qr .hf-wbody', 'display: grid; place-items: center;'),
    ('.hf17-qr .hf-wbody svg', 'width: 7em; height: 7em;'),
    ('.hf17-said', 'position: absolute; z-index: 3; left: 3.2em; top: 11.2em; padding: .5em .8em; border-radius: .5em; background: #fff; box-shadow: 0 .6em 1.4em -.8em rgba(var(--navy-rgb), .6); font-size: 1.05em; font-weight: 700; white-space: nowrap; ' + A(ON('hf17-said', T, 10.9))),
    ('.hf17-ph', 'left: 23.4em; top: 1.6em; width: 8.6em; height: 15.6em;'),
    ('.hf17-cam', 'position: absolute; inset: 0; display: grid; place-items: center; background: #0b0f1a; ' + A(ON('hf17-cam', T, 3, 5.9))),
    ('.hf17-cam > span', 'position: relative; width: 5.6em; height: 5.6em; padding: .5em; border: .12em dashed rgba(255, 255, 255, .7); border-radius: .6em;'),
    ('.hf17-cam svg', 'display: block; width: 100%; height: 100%; ' + A(ON('hf17-camqr', T, 3.8))),
    ('.hf17-cam b', 'position: absolute; right: -.6em; bottom: -.6em; display: grid; place-items: center; width: 1.8em; height: 1.8em; border-radius: 50%; background: #2fae54; color: #fff; font-size: .9em; ' + A(ON('hf17-camok', T, 4.8))),
    ('.hf17-ph .hfm-desk', A(ON('hf17-desk', T, 6))),
    ('.hf17-bar', 'position: absolute; z-index: 2; left: .4em; right: .4em; bottom: .5em; display: flex; align-items: center; justify-content: center; gap: .5em; padding: .4em; border-radius: 1em; background: rgba(20, 32, 58, .88); color: #fff; ' + A(ON('hf17-bar', T, 9, 11.9))),
    ('.hf17-bar > b', 'display: grid; place-items: center; width: 1.9em; height: 1.9em; border-radius: 50%; font-size: .9em; ' + A(KF('hf17-mic', T, [(9.2, 'background: #263257'), (9.3, 'background: var(--rec)'), (10.7, 'background: var(--rec)'), (10.8, 'background: #263257')]))),
    ('.hf17-bar .hf-wave', 'color: #8fd0ff; ' + A(ON('hf17-wave', T, 9.3, 10.7))),
    ('.hf17-tun', 'position: absolute; z-index: 1; left: 19.95em; top: 7.6em; width: 3.2em; padding: .45em 0; border: .14em solid var(--blue); border-radius: 99em; background: #eef3ff; text-align: center; overflow: hidden; ' + A(ON('hf17-tun', T, 12))),
    ('.hf17-tun b', 'font-size: .5em; font-weight: 800; color: var(--blue-deep);'),
    ('.hf17-tun i', 'position: absolute; top: .2em; left: 0; width: .4em; height: .4em; border-radius: 50%; background: var(--blue); animation: hfv-go 1.6s linear infinite;'),
    ('.hf17-away', 'position: absolute; z-index: 3; left: 24.6em; top: .5em; padding: .15em .7em; border-radius: 99em; background: var(--navy); color: #fff; ' + A(ON('hf17-away', T, 12))),
    ('.hf17-away i', 'font-size: .62em; font-style: normal; font-weight: 800;'),
    ('.hf17-t', 'left: 1.6em; top: 17.6em;'),
    ('.hf17-t1', A(ON('hf17-t1', T, .2, 2.9))),
    ('.hf17-t2', A(ON('hf17-t2', T, 3.1, 5.9))),
    ('.hf17-t3', A(ON('hf17-t3', T, 6.1, 8.9))),
    ('.hf17-t4', A(ON('hf17-t4', T, 9.1, 11.9))),
    ('.hf17-t5', A(ON('hf17-t5', T, 12.1, 14.8))),
])
FIGS.append(fig('hf17', 'かんたんにまとめた流れの図。1 Macに入れて2つの許可をオンにする。2 デバイスでMacのQRコードを読み取る。3 「接続」でMacの画面が手もとに映る。4 声で書くには、Aqua VoiceとBlackHole 2chを入れる。デバイスの🎤を押して話すと、Macに文字が入る。5 外から使うには、Tailscaleを入れる',
    LAP('hf17-lap', WINS + pop([R_TITLE, r_perm('画面収録', 'hf17-d1', btn=False), r_perm('アクセシビリティ', 'hf17-d2', btn=False)], 'hf17-pop')
        + '<div class="hf-win hf17-qr">' + wbar('端末を追加') + '<div class="hf-wbody">' + QR + '</div></div>'
        + '<span class="hf17-said">次は、グラフを直して</span>', LAPBAR)
    + '<div class="hf17-tun"><b>Tailscale</b><i></i></div>'
    + '<span class="hf17-away"><i>外出先</i></span>'
    + '<div class="hf-ph hf17-ph"><div class="hf17-cam"><span>' + QR + '<b>✓</b></span></div>' + DESK
    + '<div class="hf17-bar"><b>🎤</b><span class="hf-wave"><i></i><i></i><i></i><i></i><i></i></span></div></div>'
    + ''.join('<span class="hf-tag hf17-t hf17-t%d"><i>%s</i></span>' % (n, s) for n, s in enumerate([
        '1 Macに入れて、2つの許可をオン', '2 MacのQRコードを読み取る', '3 「接続」で、画面が手もとに',
        '4 声で書く：Aqua Voice・BlackHole 2ch', '5 外から使う：Tailscale'], 1))))

# ---- 図 18：「Mac に BlackHole 2ch が入っていません」（8 秒）
T = 8
RULES('hf18', T, 7.2, [
    ('.hf18-bad', A(ON('hf18-bad', T, 0, 5))),
    ('.hf18-ok', 'opacity: 0; ' + A(ON('hf18-ok', T, 5.1))),
    ('.hf18-term', 'left: 12.3em; top: 1.2em; right: 1.2em; height: 8.4em;'),
    ('.hf18 .hf-tbody p', 'font-size: .62em;'),
    ('.hf18-cmd', 'display: inline-block; vertical-align: bottom; overflow: hidden; white-space: nowrap; ' + A(TYPE('hf18-cmd', T, .6, 2.2, 16, '30em'), 'linear')),
    ('.hf18-done', 'color: #7ee2a0; ' + A(ON('hf18-done', T, 2.7))),
    ('.hf18-re', 'position: absolute; left: 12.3em; top: 10.6em; display: flex; align-items: center; gap: .4em; padding: .45em .85em; border-radius: 99em; background: #fff; box-shadow: 0 .6em 1.4em -.8em rgba(var(--navy-rgb), .6); ' + A(ON('hf18-re', T, 3.3))),
    ('.hf18-re i', 'display: block; font-style: normal; font-weight: 800; color: var(--blue); ' + A(KF('hf18-spin', T, [(3.6, 'transform: none'), (4.8, 'transform: rotate(360deg)')]))),
    ('.hf18-re b', 'font-size: .74em;'),
    ('.hf18-t1', A(ON('hf18-t1', T, .3, 3.1))),
    ('.hf18-t2', A(ON('hf18-t2', T, 3.3, 5))),
    ('.hf18-t3', A(ON('hf18-t3', T, 5.2, 7.7))),
])
FIGS.append(MINI('hf18', 'デバイスに「Mac に BlackHole 2ch が入っていません」と出たときの図。MacのターミナルでBlackHole 2chを入れ（3-4）、Macを再起動すると、デバイスから話せるようになる',
    PHM('', DESK + BAN('hf18-bad', 'Mac に BlackHole 2ch が入っていません') + BAN('hf18-ok', '🎤 で話せます', True))
    + '<div class="hf-win hf18-term">' + wbar('ターミナル') + '<div class="hf-tbody"><p><span class="pr">$</span> <span class="hf18-cmd">brew install --cask blackhole-2ch</span></p><p class="hf18-done">🍺 blackhole-2ch was successfully installed!</p></div></div>'
    + '<span class="hf18-re"><i>↻</i><b>Macを再起動</b></span>'
    + TAG('hf18-t1', '3-4 で入れる') + TAG('hf18-t2', 'Macを再起動する') + TAG('hf18-t3', '話せるようになる')))

# ---- 図 19：「Aqua Voice が BlackHole 2ch から録音していません」（9 秒）
T = 9
RULES('hf19', T, 8, [
    ('.hf19-bad', A(ON('hf19-bad', T, 0, 6.4))),
    ('.hf19-ok', 'opacity: 0; ' + A(ON('hf19-ok', T, 6.5))),
    ('.hf19-c1', A(OKAT('hf19-c1', T, 1.2))),
    ('.hf19-c2', A(OKAT('hf19-c2', T, 3.4))),
    ('.hf19-c3', A(OKAT('hf19-c3', T, 5))),
    ('.hf19-old', 'color: var(--ink-3); ' + A(STEPS('hf19-old', T, [(0, 'opacity: 1'), (2.8, 'opacity: 0')]))),
    ('.hf19-new', 'color: var(--blue-deep); ' + A(ON('hf19-new', T, 2.8))),
    ('.hf19-sel', A(KF('hf19-sel', T, [(2.6, 'box-shadow: 0 0 0 0 rgba(var(--blue-rgb), 0)'), (2.8, 'box-shadow: 0 0 0 .25em rgba(var(--blue-rgb), .3)'), (3.6, 'box-shadow: 0 0 0 .25em rgba(var(--blue-rgb), 0)')]))),
    ('.hf19-fn', 'display: inline-block; padding: 0 .4em; border: 1px solid #b6c0d4; border-bottom-width: .18em; border-radius: .3em; background: #fff; font-family: inherit; font-weight: 800; ' + A(KF('hf19-fn', T, [(4.2, 'background: #fff; color: var(--ink)'), (4.3, 'background: var(--blue); color: #fff'), (4.9, 'background: var(--blue); color: #fff'), (5, 'background: #fff; color: var(--ink)')]))),
    ('.hf19-t1', A(ON('hf19-t1', T, .3, 6.2))),
    ('.hf19-t2', A(ON('hf19-t2', T, 6.5, 8.6))),
])
FIGS.append(MINI('hf19', 'デバイスに「Aqua Voice が BlackHole 2ch から録音していません」と出たときの図。Macで、Aqua Voiceが動いているか、マイクが「BlackHole 2ch」か、録音のキーがfnかを確かめると、録音できるようになる',
    PHM('', DESK + BAN('hf19-bad', 'Aqua Voice が BlackHole 2ch から録音していません') + BAN('hf19-ok', '🎤 で話せます', True))
    + '<div class="hfm-side hfm-card"><p class="hfm-h">Mac で確かめる</p>'
    + CK('hf19-c1', 'Aqua Voice が動いている')
    + CK('hf19-c2', 'マイク：<em class="hfm-sel hf19-sel"><b class="hf19-old">MacBook のマイク</b><b class="hf19-new">BlackHole 2ch</b></em>')
    + CK('hf19-c3', '録音のキー：<kbd class="hf19-fn">fn</kbd>') + '</div>'
    + TAG('hf19-t1', '3つを確かめる（3-5・3-1）') + TAG('hf19-t2', '録音できるようになる')))

# ---- 図 20：Macの前で、Aqua Voice が反応しなくなった（9 秒）
T = 9
RULES('hf20', T, 8.2, [
    ('.hf20-memo', 'left: 1.3em; top: 1.2em; width: 10em; height: 8.6em;'),
    ('.hf20-txt', 'font-size: .66em; font-weight: 700; line-height: 1.4; overflow: hidden; white-space: nowrap; ' + A(TYPE('hf20-txt', T, 6.4, 7.4, 6, '14em'), 'linear')),
    ('.hf20-fn', 'position: absolute; left: 1.3em; top: 10.6em; ' + A(KF('hf20-fn', T, [(5.6, 'background: #fff; color: var(--ink)'), (5.7, 'background: var(--blue); color: #fff'), (7.6, 'background: var(--blue); color: #fff'), (7.7, 'background: #fff; color: var(--ink)')]))),
    ('.hf20-wave', 'position: absolute; left: 5em; top: 11.4em; color: var(--blue); ' + A(ON('hf20-wave', T, 5.8, 7.4))),
    ('.hf20-c1', A(OKAT('hf20-c1', T, 1.2))),
    ('.hf20-c2', A(OKAT('hf20-c2', T, 2.6))),
    ('.hf20-c3', A(OKAT('hf20-c3', T, 4.6))),
    ('.hf20-old', 'color: var(--ink-3); ' + A(STEPS('hf20-old', T, [(0, 'opacity: 1'), (4, 'opacity: 0')]))),
    ('.hf20-new', 'color: var(--blue-deep); ' + A(ON('hf20-new', T, 4))),
    ('.hf20-t1', A(ON('hf20-t1', T, .3, 5.2))),
    ('.hf20-t2', A(ON('hf20-t2', T, 5.6, 8.6))),
])
FIGS.append(MINI('hf20', 'Macの前でAqua Voiceが反応しなくなったときの図。MOTHERSHIP HOSTのマイクの許可、MOTHERSHIP HOSTが動いていること、「サウンド」の入力がいつものマイクであることを確かめると、Macの前でfnを押して話したときに、また文字が入る',
    '<div class="hf-win hf20-memo">' + wbar('メモ') + '<div class="hf-wbody"><p class="hf20-txt">今日の打ち合わせのメモ</p></div></div>'
    + '<span class="hf-key hf20-fn">fn</span><span class="hf20-wave"><span class="hf-wave"><i></i><i></i><i></i><i></i><i></i><i></i></span></span>'
    + '<div class="hfm-side hfm-card"><p class="hfm-h">気をつけること（3つ）</p>'
    + CK('hf20-c1', 'MOTHERSHIP HOST のマイクを許可')
    + CK('hf20-c2', 'MOTHERSHIP HOST が動いている')
    + CK('hf20-c3', 'サウンドの入力：<em class="hfm-sel"><b class="hf20-old">BlackHole 2ch</b><b class="hf20-new">いつものマイク</b></em>') + '</div>'
    + TAG('hf20-t1', '3つを確かめる') + TAG('hf20-t2', 'Macの前でも、また文字になる')))

# ---- 図 21：Macの前で話すと、最初のことばが欠ける（9 秒。前半＝すぐ話す、後半＝ひと呼吸おく）
T = 9
RULES('hf21', T, 8.4, [
    ('.hf21-memo', 'left: 1.3em; top: 1.2em; right: 1.3em; height: 7.4em;'),
    ('.hf21-memo .hf-wbody p', 'position: absolute; left: .9em; top: 1em; font-size: .95em; font-weight: 700; line-height: 1.4; white-space: nowrap;'),
    ('.hf21-a', A(ON('hf21-a', T, 1.6, 4.3))),
    ('.hf21-a s', 'margin-right: .1em; padding: 0 .15em; border-radius: .2em; background: rgba(var(--rec-rgb), .15); color: var(--rec); text-decoration: line-through;'),
    ('.hf21-b', A(ON('hf21-b', T, 7.4))),
    ('.hf21-fn', 'position: absolute; left: 1.3em; top: 9.8em; ' + A(KF('hf21-fn', T, [(.5, 'background: #fff; color: var(--ink)'), (.6, 'background: var(--blue); color: #fff'), (1.6, 'background: var(--blue); color: #fff'), (1.7, 'background: #fff; color: var(--ink)'), (4.7, 'background: #fff; color: var(--ink)'), (4.8, 'background: var(--blue); color: #fff'), (7.4, 'background: var(--blue); color: #fff'), (7.5, 'background: #fff; color: var(--ink)')]))),
    ('.hf21-pause', 'position: absolute; left: 5.4em; top: 10.4em; display: flex; align-items: center; gap: .3em; padding: .35em .7em; border-radius: 99em; background: #fff; box-shadow: 0 .4em 1em -.6em rgba(var(--navy-rgb), .5); ' + A(ON('hf21-pause', T, 4.9, 6))),
    ('.hf21-pause b', 'font-size: .66em; font-weight: 800; color: var(--blue-deep);'),
    ('.hf21-wave', 'position: absolute; left: 13.6em; top: 10.6em; color: var(--blue); ' + A(KF('hf21-wave', T, [(.55, 'opacity: 0'), (.65, 'opacity: 1'), (1.6, 'opacity: 1'), (1.7, 'opacity: 0'), (5.9, 'opacity: 0'), (6, 'opacity: 1'), (7.3, 'opacity: 1'), (7.4, 'opacity: 0')]))),
    ('.hf21 .hfm-tag', 'left: 1.3em;'),
    ('.hf21-t1', A(ON('hf21-t1', T, .3, 4.3))),
    ('.hf21-t2', A(ON('hf21-t2', T, 4.6, 8.6))),
])
FIGS.append(MINI('hf21', 'Macの前で話すと最初のことばが欠けるときの図。fnキーを押してすぐに話すと「次は、」の「次」が欠ける。fnキーを押して、ひと呼吸おいてから話すと、最初から文字になる',
    '<div class="hf-win hf21-memo">' + wbar('メモ') + '<div class="hf-wbody"><p class="hf21-a"><s>次</s>は、グラフを直してください。</p><p class="hf21-b">次は、グラフを直してください。</p></div></div>'
    + '<span class="hf-key hf21-fn">fn</span><span class="hf21-pause"><b>ひと呼吸</b></span><span class="hf21-wave"><span class="hf-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></span>'
    + TAG('hf21-t1', '押してすぐ話すと、最初のことばが欠ける') + TAG('hf21-t2', 'fn を押して、ひと呼吸おいてから話す')))

# ---- 図 22：家で、デバイスに Mac が見つからない（10 秒）
T = 10
RULES('hf22', T, 9.2, [
    ('.hf22-list', 'position: absolute; inset: 0; padding: 1em .5em; background: #121a2e;'),
    ('.hf22-list > p', 'font-size: .62em; font-weight: 800; color: #fff;'),
    ('.hf22-row', 'margin-top: .6em; padding: .55em .6em; border-radius: .6em; background: rgba(255, 255, 255, .08);'),
    ('.hf22-row b', 'display: block; font-size: .66em; color: #fff;'),
    ('.hf22-row small', 'display: block; margin-top: .25em; font-size: .52em;'),
    ('.hf22-no', 'color: rgba(255, 255, 255, .55); ' + A(STEPS('hf22-no', T, [(0, 'opacity: 1'), (7.6, 'opacity: 0')]))),
    ('.hf22-yes', 'color: #7ee2a0; ' + A(ON('hf22-yes', T, 7.6))),
    ('.hf22-yes, .hf22-no', 'grid-area: 1 / 1; white-space: nowrap;'),
    ('.hf22-st', 'display: grid;'),
    ('.hf22-c1', A(OKAT('hf22-c1', T, 1.6))),
    ('.hf22-c2', A(OKAT('hf22-c2', T, 3.6))),
    ('.hf22-c3', A(OKAT('hf22-c3', T, 6))),
    ('.hf22-c3 .hf-tg', 'display: inline-block; vertical-align: middle; width: 2em; height: 1.1em; ' + A(STEPS('hf22-tg', T, [(0, '--tg: 0'), (5.4, '--tg: 1')]))),
    ('.hf22-c3 .hf-tg::after', 'width: .85em; height: .85em; left: .12em; top: .12em; transform: translateX(calc(var(--tg) * .9em));'),
    ('.hf22-ico', 'display: inline-block; width: 1.1em; height: 1.1em; border-radius: .25em; background: var(--grad-accent); vertical-align: middle;'),
    ('.hf22-ico svg', 'display: block; width: 100%; height: 100%;'),
    ('.hf22-t1', A(ON('hf22-t1', T, .3, 7.4))),
    ('.hf22-t2', A(ON('hf22-t2', T, 7.6, 9.6))),
])
FIGS.append(MINI('hf22', '家でデバイスにMacが見つからないときの図。Macとデバイスが同じWi-Fiか、MacのメニューバーにMOTHERSHIP HOSTのアイコンがあるか、iPhone・iPadの「ローカルネットワーク」でMOTHERSHIPがオンかを確かめると、Macが見つかる',
    PHM('', '<div class="hf22-list"><p>登録済みの Mac</p><div class="hf22-row"><b>自宅の Mac</b><small class="hf22-st"><span class="hf22-no">見つかりません</span><span class="hf22-yes">自宅 LAN で接続できます</span></small></div></div>')
    + '<div class="hfm-side hfm-card"><p class="hfm-h">確かめる（3つ）</p>'
    + CK('hf22-c1', 'Mac とデバイスが、同じ Wi-Fi')
    + CK('hf22-c2', 'メニューバーに <span class="hf22-ico">' + MARK + '</span> がある')
    + CK('hf22-c3', 'ローカルネットワーク <i class="hf-tg"></i>') + '</div>'
    + TAG('hf22-t1', '3つを確かめる') + TAG('hf22-t2', 'Mac が見つかる')))

# ---- 図 23：QR コードで登録できない（9 秒）
T = 9
RULES('hf23', T, 8, [
    ('.hf23-win', 'left: 12.3em; top: 1.2em; right: 1.2em; height: 13em;'),
    ('.hf23-qr', 'position: absolute; left: .9em; top: .9em; width: 5.6em; height: 5.6em; ' + A(KF('hf23-qr', T, [(2.6, 'opacity: .25; filter: grayscale(1)'), (2.9, 'opacity: 1; filter: none')]))),
    ('.hf23-qr svg', 'display: block; width: 100%; height: 100%;'),
    ('.hf23-msg', 'position: absolute; left: 7.4em; top: 1.6em; display: grid;'),
    ('.hf23-msg b', 'grid-area: 1 / 1; font-size: .7em; line-height: 1.5; white-space: nowrap;'),
    ('.hf23-x', 'color: var(--rec); ' + A(STEPS('hf23-x', T, [(0, 'opacity: 1'), (2.7, 'opacity: 0')]))),
    ('.hf23-o', 'color: var(--ink-2); ' + A(ON('hf23-o', T, 2.7))),
    ('.hf23-btn', 'position: absolute; left: 1.1em; top: 10.5em; ' + A(KF('hf23-btn', T, [(2.3, 'background: #e6ecf8'), (2.4, 'background: #c9d6f2'), (2.7, 'background: #e6ecf8')]))),
    ('.hf23-cur', A(CUR('hf23-cur', T, [(0, 30, 16), (.6, 30, 16), (1.9, 20.6, 11.9), (3.2, 20.6, 11.9), (3.9, 30, 15.5)], [2.4]), 'ease-in-out')),
    ('.hf23-cam', 'position: absolute; inset: 0; display: grid; place-items: center; background: #0b0f1a;'),
    ('.hf23-cam > span', 'position: relative; width: 5.4em; height: 5.4em; padding: .5em; border: .12em dashed rgba(255, 255, 255, .7); border-radius: .6em;'),
    ('.hf23-cam svg', 'display: block; width: 100%; height: 100%; ' + A(ON('hf23-camqr', T, 4.6))),
    ('.hf23-ok', 'opacity: 0; ' + A(ON('hf23-ok', T, 6))),
    ('.hf23-t1', A(ON('hf23-t1', T, .3, 4.2))),
    ('.hf23-t2', A(ON('hf23-t2', T, 4.5, 8.6))),
])
FIGS.append(MINI('hf23', 'QRコードで登録できないときの図。QRコードが使えるのは5分間・1回だけ。期限が切れたら、Macのウィンドウで「新しい登録リンクと QR コードを作成」を押し、新しいQRコードをデバイスで読み取ると、登録できる',
    PHM('', '<div class="hf23-cam"><span>' + QR + '</span></div>' + BAN('hf23-ok', '登録しました', True))
    + '<div class="hf-win hf23-win">' + wbar('端末を追加') + '<div class="hf-wbody"><span class="hf23-qr">' + QR + '</span><p class="hf23-msg"><b class="hf23-x">期限が切れました</b><b class="hf23-o">残り 4 分 59 秒<br>1 回だけ使えます</b></p><em class="hf-btn hf23-btn">新しい登録リンクと QR コードを作成</em></div></div>'
    + CURSOR.format(c='hf23-cur')
    + TAG('hf23-t1', '5分・1回だけ。切れたら、作り直す') + TAG('hf23-t2', '新しい QR コードを読み取る')))

# ---- 図 24：つながるのに、画面が映らない・操作できない（9 秒）
T = 9
RULES('hf24', T, 8, [
    ('.hf24-black', 'position: absolute; inset: 0; display: grid; place-items: center; background: #05070d; ' + A(STEPS('hf24-black', T, [(0, 'opacity: 1'), (5.6, 'opacity: 0')], .4))),
    ('.hf24-black b', 'font-size: .62em; color: rgba(255, 255, 255, .6);'),
    ('.hf24 .hf-pop', 'top: 1.2em; right: 1.2em; width: 19.8em;'),
    ('.hf24 .hf-r > span', 'font-size: .8em;'),
    ('.hf24-d1', A(OKAT('hf24-d1', T, 2.2))),
    ('.hf24-d2', A(OKAT('hf24-d2', T, 3.8))),
    ('.hf24-t1', A(ON('hf24-t1', T, .3, 5.2))),
    ('.hf24-t2', A(ON('hf24-t2', T, 5.6, 8.6))),
])
FIGS.append(MINI('hf24', 'つながるのに画面が映らない・操作できないときの図。MOTHERSHIP HOSTのメニューで「画面収録」と「アクセシビリティ」に緑のチェックが付くと、デバイスにMacの画面が映る',
    PHM('', DESK + '<div class="hf24-black"><b>画面が映りません</b></div>')
    + pop([R_TITLE, r_perm('画面収録', 'hf24-d1', btn=False), r_perm('アクセシビリティ', 'hf24-d2', btn=False)])
    + TAG('hf24-t1', 'Mac の許可を確かめる（ステップ1）') + TAG('hf24-t2', '緑のチェックで、映る')))

# ---- 図 25：外からつながらない（10 秒）
T = 10
RULES('hf25', T, 9.2, [
    ('.hf25-bad', A(ON('hf25-bad', T, 0, 7.6))),
    ('.hf25-ok', 'opacity: 0; ' + A(ON('hf25-ok', T, 7.7))),
    ('.hf25-c1', A(OKAT('hf25-c1', T, 1.6))),
    ('.hf25-c2', A(OKAT('hf25-c2', T, 3.2))),
    ('.hf25-c3', A(OKAT('hf25-c3', T, 6))),
    ('.hf25-in', 'display: inline-block; min-width: 4.6em; padding: .05em .4em; border: 1px solid #c9d3e6; border-radius: .3em; background: #f6f8fc; vertical-align: middle;'),
    ('.hf25-in b', 'display: inline-block; vertical-align: bottom; overflow: hidden; white-space: nowrap; ' + A(TYPE('hf25-in', T, 4.2, 5.6, 8, '6em'), 'linear')),
    ('.hf25-t1', A(ON('hf25-t1', T, .3, 7.4))),
    ('.hf25-t2', A(ON('hf25-t2', T, 7.7, 9.6))),
])
FIGS.append(MINI('hf25', '外からつながらないときの図。デバイスとMacのTailscaleがオンで同じアカウントか、Macが起きているかを確かめ、「アドレスを直接入力」にMacのTailscaleの名前を入れると、外からつながる',
    PHM('', DESK + BAN('hf25-bad', '接続できませんでした') + BAN('hf25-ok', '接続しました', True))
    + '<div class="hfm-side hfm-card"><p class="hfm-h">確かめる（3つ）</p>'
    + CK('hf25-c1', 'Tailscale がオン（同じアカウント）')
    + CK('hf25-c2', 'Mac が起きている（5）')
    + CK('hf25-c3', 'アドレス：<em class="hf25-in"><b>mac-mini</b></em>') + '</div>'
    + TAG('hf25-t1', '3つを確かめる') + TAG('hf25-t2', '外からつながる')))

# ---- 図 26：声で書けない（8 秒。→「声で書けないとき」へ）
T = 8
RULES('hf26', T, 7, [
    ('.hf26-bar', 'position: absolute; z-index: 2; left: .4em; right: .4em; bottom: .5em; display: flex; justify-content: center; gap: .4em; padding: .4em; border-radius: 1em; background: rgba(20, 32, 58, .88);'),
    ('.hf26-bar > b', 'display: grid; place-items: center; width: 1.9em; height: 1.9em; border-radius: 50%; font-size: .9em; ' + A(KF('hf26-mic', T, [(.5, 'background: #263257'), (.6, 'background: var(--rec)'), (2.3, 'background: var(--rec)'), (2.4, 'background: #263257')]))),
    ('.hf26-q', 'position: absolute; z-index: 3; left: 50%; top: 32%; width: 2.6em; height: 2.6em; margin-left: -1.3em; display: grid; place-items: center; border-radius: 50%; background: #fff; box-shadow: 0 .5em 1.2em -.6em rgba(0, 0, 0, .5); font-size: 1.1em; font-weight: 800; color: var(--ink-2); ' + A(ON('hf26-q', T, 2.5, 7.6))),
    ('.hf26-card li', 'display: flex; align-items: center; gap: .45em; min-height: 1.8em;'),
    ('.hf26-card li::before', 'content: "›"; font-weight: 800; color: var(--blue);'),
    ('.hf26-card li span', 'font-size: .68em; font-weight: 700; line-height: 1.3;'),
    ('.hf26-card li:nth-child(1)', A(ON('hf26-l1', T, 3.6))),
    ('.hf26-card li:nth-child(2)', A(ON('hf26-l2', T, 4.1))),
    ('.hf26-card li:nth-child(3)', A(ON('hf26-l3', T, 4.6))),
    ('.hf26-card li:nth-child(4)', A(ON('hf26-l4', T, 5.1))),
    ('.hf26-t1', A(ON('hf26-t1', T, .3, 3.3))),
    ('.hf26-t2', A(ON('hf26-t2', T, 3.5, 7.6))),
])
FIGS.append(MINI('hf26', '声で書けないときの図。デバイスの🎤を押して話しても文字が入らないときは、「声で書けないとき」の4つ（BlackHole 2ch、Aqua Voiceの録音、Macの前、最初のことば）を確かめる',
    PHM('', DESK + '<div class="hf26-bar"><b>🎤</b><b>⌫</b><b>⏎</b></div><span class="hf26-q">？</span>')
    + '<div class="hfm-side hfm-card hf26-card"><p class="hfm-h">「声で書けないとき」</p><ul>'
    + ''.join('<li><span>%s</span></li>' % s for s in ['BlackHole 2ch が入っていない', 'Aqua Voice が録音していない', 'Macの前で反応しない', '最初のことばが欠ける'])
    + '</ul></div>'
    + TAG('hf26-t1', '🎤 で話しても、文字が入らない') + TAG('hf26-t2', '「声で書けないとき」を見る')))

# ---- 図 27：「試用期間が終了しました」と出る（10 秒）
T = 10
RULES('hf27', T, 9.2, [
    ('.hf27-s', 'position: absolute; inset: 0; padding: 2.4em .8em 0; text-align: center; color: #fff; background: #121a2e;'),
    ('.hf27-s > p', 'margin-top: .5em !important; line-height: 1.45;'),
    ('.hf27-ttl', 'font-size: .7em; font-weight: 800;'),
    ('.hf27-sub', 'font-size: .54em; color: rgba(255, 255, 255, .7);'),
    ('.hf27-s .hfm-btn', 'top: 10.6em;'),
    ('.hf27-big', 'display: grid; place-items: center; width: 2.4em; height: 2.4em; margin: 0 auto; border-radius: 50%; background: #2fae54; font-size: 1.1em; font-weight: 800;'),
    ('.hf27-s1', A(STEPS('hf27-s1', T, [(0, 'opacity: 1'), (3, 'opacity: 0')]))),
    ('.hf27-s2', A(ON('hf27-s2', T, 3, 5.2))),
    ('.hf27-s3', A(ON('hf27-s3', T, 5.2, 7.8))),
    ('.hf27 .hfm-desk', A(ON('hf27-desk', T, 7.8))),
    ('.hf27-fin', A(TAP('hf27-fin', T, [(2.4, 6.05, 13.2), (7.1, 6.05, 13.2)]))),
    ('.hf27-st', 'display: grid; margin-top: .2em;'),
    ('.hf27-st b', 'grid-area: 1 / 1; justify-self: start; padding: .3em .8em; border-radius: 99em; font-size: .72em; font-weight: 800; color: #fff;'),
    ('.hf27-a', 'background: var(--rec); ' + A(STEPS('hf27-a', T, [(0, 'opacity: 1'), (7.3, 'opacity: 0')]))),
    ('.hf27-b', 'background: #2fae54; ' + A(ON('hf27-b', T, 7.3))),
    ('.hf27-note', 'margin-top: .6em !important; font-size: .6em; line-height: 1.5; color: var(--ink-2);'),
    ('.hf27-t1', A(ON('hf27-t1', T, .3, 4.9))),
    ('.hf27-t2', A(ON('hf27-t2', T, 5.2, 7.6))),
    ('.hf27-t3', A(ON('hf27-t3', T, 7.8, 9.6))),
])
FIGS.append(MINI('hf27', '「試用期間が終了しました」と出たときの図。デバイスで「購入する」を押して購入し、そのMacにつないで「この Mac をライセンスに加えますか？（3 台のうち 1 台目）」で「加える」を押すと、そのMacが購入済みになって使えるようになる',
    PHM('', DESK
        + '<div class="hf27-s hf27-s1"><p class="hf27-ttl">この Mac の試用期間が終了しました</p><p class="hf27-sub">続けて使うには、購入してください。1 回の購入で、Mac 3 台まで使えます</p><em class="hfm-btn"><span>購入する</span></em></div>'
        + '<div class="hf27-s hf27-s2"><p class="hf27-big">✓</p><p class="hf27-ttl">購入しました</p></div>'
        + '<div class="hf27-s hf27-s3"><p class="hf27-ttl">この Mac（自宅）をライセンスに加えますか？</p><p class="hf27-sub">（3 台のうち 1 台目）</p><em class="hfm-btn"><span>加える</span></em></div>')
    + FIN('hf27-fin')
    + '<div class="hfm-side hfm-card"><p class="hfm-h">この Mac</p><p class="hf27-st"><b class="hf27-a">試用終了</b><b class="hf27-b">購入済み</b></p><p class="hf27-note">購入したデバイスでつないで「ライセンスに加える」と、購入済みになります</p></div>'
    + TAG('hf27-t1', 'デバイスで購入する') + TAG('hf27-t2', '「ライセンスに加える」を選ぶ') + TAG('hf27-t3', 'その Mac で使える（3台まで）')))

# ---- 図 28：「この購入で使えるMacは3台までです」と出る（10 秒）
T = 10
RULES('hf28', T, 9.2, [
    ('.hf28-s', 'position: absolute; inset: 0; padding: 1em .55em 0; color: #fff; background: #121a2e;'),
    ('.hf28-s1', 'padding-top: 2.6em; text-align: center; ' + A(STEPS('hf28-s1', T, [(0, 'opacity: 1'), (2.9, 'opacity: 0')]))),
    ('.hf28-s1 p', 'margin-top: .5em !important; line-height: 1.45;'),
    ('.hf28-ttl', 'font-size: .66em; font-weight: 800;'),
    ('.hf28-sub', 'font-size: .54em; color: rgba(255, 255, 255, .7);'),
    ('.hf28-s2', A(ON('hf28-s2', T, 2.9))),
    ('.hf28-h', 'display: grid; font-size: .56em; font-weight: 800; line-height: 1.4; color: rgba(255, 255, 255, .85);'),
    ('.hf28-h span', 'grid-area: 1 / 1;'),
    ('.hf28-h3', A(KF('hf28-h3', T, [(5.2, 'opacity: 1'), (5.3, 'opacity: 0'), (7.1, 'opacity: 0'), (7.2, 'opacity: 1')]))),
    ('.hf28-h2', A(KF('hf28-h2', T, [(5.2, 'opacity: 0'), (5.3, 'opacity: 1'), (7.1, 'opacity: 1'), (7.2, 'opacity: 0')]))),
    ('.hf28-row', 'display: flex; align-items: center; justify-content: space-between; height: 2em; margin-top: .45em; padding: 0 .5em; border-radius: .5em; background: rgba(255, 255, 255, .08);'),
    ('.hf28-row b', 'font-size: .6em;'),
    ('.hf28-row em', 'padding: .2em .5em; border-radius: .35em; background: rgba(255, 255, 255, .14); font-size: .5em; font-style: normal; font-weight: 700;'),
    ('.hf28-r3', A(KF('hf28-r3', T, [(4.8, 'opacity: 1; background: rgba(255, 255, 255, .08)'), (4.9, 'opacity: 1; background: rgba(var(--rec-rgb), .45)'), (5.2, 'opacity: 0; background: rgba(var(--rec-rgb), .45)')]))),
    ('.hf28-slot', 'display: grid;'),
    ('.hf28-slot > p', 'grid-area: 1 / 1;'),
    ('.hf28-r4', 'opacity: 0;'),
    ('.hf28-r4', 'background: rgba(var(--blue-rgb), .35); ' + A(ON('hf28-r4', T, 7))),
    ('.hf28-fin', A(TAP('hf28-fin', T, [(4.7, 8.75, 10.15)]))),
    ('.hf28-card p', 'font-size: .64em; line-height: 1.5; color: var(--ink-2);'),
    ('.hf28-card p + p', 'margin-top: .5em !important;'),
    ('.hf28-card b', 'color: var(--ink);'),
    ('.hf28-t1', A(ON('hf28-t1', T, .3, 2.8))),
    ('.hf28-t2', A(ON('hf28-t2', T, 3.1, 6.7))),
    ('.hf28-t3', A(ON('hf28-t3', T, 7, 9.6))),
])
FIGS.append(MINI('hf28', '「この購入で使えるMacは3台までです」と出たときの図。デバイスの設定の「ライセンス」で、使わなくなったMacの「外す」を押すと、3台のうち1台分が空き、新しいMacを加えられる。つながずに外せるのは90日に1回',
    PHM('', '<div class="hf28-s hf28-s2"><p class="hf28-h"><span class="hf28-h3">この購入で使っている Mac（3／3 台）</span><span class="hf28-h2">この購入で使っている Mac（2／3 台）</span></p>'
        + '<p class="hf28-row"><b>Mac mini</b><em>外す</em></p><p class="hf28-row"><b>MacBook Pro</b><em>外す</em></p><div class="hf28-slot"><p class="hf28-row hf28-r3"><b>古い iMac</b><em>外す</em></p><p class="hf28-row hf28-r4"><b>新しい Mac</b><em>外す</em></p></div></div>'
        + '<div class="hf28-s hf28-s1"><p class="hf28-ttl">この購入で使える Mac は 3 台までです。</p><p class="hf28-sub">設定の［ライセンス］で、使わなくなった Mac を外せます</p></div>')
    + FIN('hf28-fin')
    + '<div class="hfm-side hfm-card hf28-card"><p class="hfm-h">外すとき</p><p>つながずに外せるのは、<b>90日に1回</b></p><p>Mac を手放すときは、その Mac の <b>MOTHERSHIP HOST のメニュー</b>で「この Mac のライセンスを外す」</p></div>'
    + TAG('hf28-t1', '「3台まで」と出たら') + TAG('hf28-t2', '使わない Mac を外す') + TAG('hf28-t3', '空いた枠を、新しい Mac に')))

# ---- 図 29：デバイスをなくした（9 秒）
T = 9
RULES('hf29', T, 8, [
    ('.hf29-win', 'left: 12.3em; top: 1.2em; right: 1.2em; height: 10.6em;'),
    ('.hf29-row', 'display: flex; align-items: center; justify-content: space-between; height: 2em; margin-bottom: .3em; padding: 0 .5em; border-radius: .45em; background: #f4f6fb;'),
    ('.hf29-row b', 'font-size: .72em;'),
    ('.hf29-row .hf-btn', 'font-size: .66em;'),
    ('.hf29-r2', A(KF('hf29-r2', T, [(2.4, 'opacity: 1; background: #f4f6fb'), (2.5, 'opacity: 1; background: rgba(var(--rec-rgb), .18)'), (3.2, 'opacity: 1; background: rgba(var(--rec-rgb), .18)'), (3.5, 'opacity: 0; background: rgba(var(--rec-rgb), .18)')]))),
    ('.hf29-cur', A(CUR('hf29-cur', T, [(0, 22, 16), (.6, 22, 16), (1.9, 29.4, 7.4), (3.2, 29.4, 7.4), (3.9, 24, 15)], [2.5]), 'ease-in-out')),
    ('.hf29-bad', 'opacity: 0; ' + A(ON('hf29-bad', T, 3.8))),
    ('.hf29-ts', 'position: absolute; left: 12.3em; top: 12.5em; display: flex; align-items: center; gap: .4em; padding: .4em .8em; border-radius: 99em; background: #fff; box-shadow: 0 .6em 1.4em -.8em rgba(var(--navy-rgb), .6); ' + A(ON('hf29-ts', T, 5.4))),
    ('.hf29-ts b', 'font-size: .66em; font-weight: 800;'),
    ('.hf29-t1', A(ON('hf29-t1', T, .3, 4.8))),
    ('.hf29-t2', A(ON('hf29-t2', T, 5.1, 8.6))),
])
FIGS.append(MINI('hf29', 'デバイスをなくしたときの図。MOTHERSHIP HOSTのメニューの「登録済みの端末」で、なくしたデバイスを削除すると、そのデバイスからはつなげなくなる。Tailscaleを使っている場合は、Tailscaleでもそのデバイスを外す',
    PHM('', DESK + BAN('hf29-bad', 'この Mac にはつなげません'))
    + '<div class="hf-win hf29-win">' + wbar('登録済みの端末') + '<div class="hf-wbody"><p class="hf29-row"><b>iPad Air</b><em class="hf-btn">削除</em></p><p class="hf29-row hf29-r2"><b>iPhone（なくした）</b><em class="hf-btn">削除</em></p><p class="hf29-row"><b>Pixel</b><em class="hf-btn">削除</em></p></div></div>'
    + '<span class="hf29-ts"><b>Tailscale でも、この端末を外す</b></span>'
    + CURSOR.format(c='hf29-cur')
    + TAG('hf29-t1', '「登録済みの端末」で削除') + TAG('hf29-t2', 'なくした端末からは、つなげない')))

# ---------------------------------------------------------------- 書き出し
# 図は help.html の中で <!-- fig:番号 --> … <!-- /fig:番号 --> にはさんである。もう一度実行すると、その間だけを書き直す。
assert len(FIGS) == 29, len(FIGS)
KIT = open(os.path.join(HERE, 'kit.css')).read()
css = KIT + '\n'.join(CSS) + '\n\n/* ---- 動き（tools/help-figs/build.py が、秒から % に直して書き出したもの）---- */\n' + '\n'.join(OUT) + '\n'
open(os.path.join(DESIGN, 'help-figs.css'), 'w').write(css)

path = os.path.join(DESIGN, 'help.html')
html = open(path).read()
wrap = lambda n, f: '<!-- fig:%d -->%s<!-- /fig:%d -->' % (n, f, n)
phs = re.findall(r'<figure class="help-ph">.*?</figure>', html, flags=re.S)
if phs:                                   # はじめて：灰色の枠を、上から順に図に置き換える
    assert len(phs) == 16, len(phs)
    for n, (ph, f) in enumerate(zip(phs, FIGS), 1):
        html = html.replace(ph, wrap(n, f), 1)
else:                                     # 2 回目から：印の間を書き直す
    for n, f in enumerate(FIGS, 1):
        pat = re.compile(r'<!-- fig:%d -->.*?<!-- /fig:%d -->' % (n, n), re.S)
        assert pat.search(html), n
        html = pat.sub(lambda m: wrap(n, f), html, count=1)
if 'class="svg-defs"' not in html:
    index = open(os.path.join(DESIGN, 'index.html')).read()
    defs = re.search(r'<svg class="svg-defs".*?</svg>', index, flags=re.S).group(0)
    html = html.replace('  <main id="main">', '  <!-- 図で使い回す絵（ロゴの印と、QR コードふうの模様。模様は本物の QR コードではない） -->\n  ' + defs + '\n\n  <main id="main">', 1)
if 'help-figs.css' not in html:
    html = html.replace('  <link rel="stylesheet" href="help.css">', '  <link rel="stylesheet" href="help.css">\n  <link rel="stylesheet" href="help-figs.css">', 1)
if '図は、説明のためのイメージです' not in html:
    html = html.replace('（アプリの画面では、「Mothership Host」「Mothership」と表示されます）。</p>', '（アプリの画面では、「Mothership Host」「Mothership」と表示されます）。図は、説明のためのイメージです。実際の画面とは、見た目がちがいます。</p>', 1)
assert 'help-figs.css' in html and 'help-ph' not in html and html.count('<!-- fig:') == 29
open(path, 'w').write(html)
print('figs:', len(FIGS), 'keyframes:', len(OUT), 'css bytes:', len(css))
