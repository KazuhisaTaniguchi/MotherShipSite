#!/usr/bin/env python3
# 英語版のモック（mock/design_en）を、本番の英語ページ（/en/…）に取り込む。
# 使い方：frontend で  python3 scripts/sync-en.py
#   書き出すもの（手で直さない。モックを直してから、もう一度実行する）：
#     src/content/en/pages.ts   各ページの <main> の HTML・タイトル・説明、フッターの商標の文
#     src/styles/en.css         英語のときだけ効かせる CSS（文字組み、図の幅、英語版だけのカード）
#     public/en/en.js           英語ページの動き（HERO の一時停止、お問い合わせフォーム）
#     public/og-en.png          英語の OGP 画像
# 英語のページは、HTML をそのまま出す（React の部品には直さない）。リンクはここで本番の URL に書き換える。
import re, os, json, shutil, html as H
HERE = os.path.dirname(os.path.abspath(__file__))
FRONT = os.path.dirname(HERE)
MOCK = os.path.join(os.path.dirname(FRONT), 'mock', 'design_en')
rd = lambda p: open(os.path.join(MOCK, p), encoding='utf-8').read()

PAGES = {'index': '/en/', 'help': '/en/help/', 'contact': '/en/contact/', 'news': '/en/news/', 'terms-of-service': '/en/terms-of-service/', 'privacy-policy': '/en/privacy-policy/', '404': '/en/'}
JA = {'index': '/', 'help': '/help/', 'contact': '/contact/', 'news': '/news/', 'terms-of-service': '/terms-of-service/', 'privacy-policy': '/privacy-policy/', 'commercial-transactions': '/commercial-transactions/', '404': '/'}
def link(m):
    q, url = m.group(1), m.group(2)
    if re.match(r'(https?:|mailto:|#|/)', url): return m.group(0)
    path, _, frag = url.partition('#')
    mm = re.match(r'(\.\./design/)?([\w-]+)\.html$', path)
    assert mm, url
    table = JA if mm.group(1) else PAGES
    assert mm.group(2) in table, url
    return 'href=%s%s%s%s' % (q, table[mm.group(2)], ('#' + frag) if frag else '', q)
def clean(html):
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    html = re.sub(r'href=(")([^"]*)"', link, html)
    return re.sub(r'\n\s*\n+', '\n', html).strip()
def page(name):
    s = rd(name + '.html')
    title = H.unescape(re.search(r'<title>(.*?)</title>', s).group(1))
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    m = re.search(r'<main id="main"([^>]*)>(.*?)</main>', s, re.S)
    defs = re.search(r'<svg class="svg-defs".*?</svg>', s, re.S)
    body = m.group(2)
    if defs and defs.group(0) not in body: body = defs.group(0) + body      # ヘルプ：図で使い回す絵（<main> の外にある）
    cls = re.search(r'class="([^"]*)"', m.group(1))
    return dict(title=re.sub(r'\s*\|\s*MOTHERSHIP$', '', title), fullTitle=title, description=(H.unescape(d.group(1)) if d else ''), mainClass=(cls.group(1) if cls else ''), html=clean(body))

out = {}
top = page('index')
# トップ：お知らせの 3 件はサンプルなので、目印に置き換える（ページの側で、WordPress の英語のお知らせを入れる。0 件なら節ごと消す）
sec = re.search(r'<section class="section latest-news".*?</section>', top['html'], re.S); assert sec
block = re.sub(r'<ul class="latest-news-list">.*?</ul>', '<ul class="latest-news-list">%%NEWS_ITEMS%%</ul>', sec.group(0), flags=re.S)
top['html'] = top['html'].replace(sec.group(0), '%%NEWS%%'); top['newsSection'] = block
out['top'] = top
# よくある質問（検索エンジン向けの構造化データに使う。ページの <details> と同じ中身）
plain = lambda x: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', '', x))).strip()
faq = [dict(q=plain(q), a=plain(a_)) for q, a_ in re.findall(r'<details[^>]*>\s*<summary[^>]*>(.*?)</summary>(.*?)</details>', top['html'], re.S)]
assert len(faq) >= 20, len(faq)
out['help'] = page('help')
out['terms'] = page('terms-of-service')
out['privacy'] = page('privacy-policy')
c = page('contact')
assert c['html'].count('data-cf7-id=""') == 1
c['html'] = c['html'].replace('data-cf7-id=""', 'data-cf7-id="%%CF7_ID%%"')
assert c['html'].count('data-recaptcha-key=""') == 1
c['html'] = c['html'].replace('data-recaptcha-key=""', 'data-recaptcha-key="%%RECAPTCHA_KEY%%"')   # reCAPTCHA のサイトキーも同じ   # フォームの ID は、ページの側でビルドのときに入れる
out['contact'] = c
foot = rd('index.html'); foot = foot[foot.index('<footer'):]
out['trademarks'] = [clean(x) for x in re.findall(r'<p class="trademark">(.*?)</p>', foot, re.S)]

ts = '// scripts/sync-en.py が、mock/design_en から書き出したもの。手で直さない（モックを直して、もう一度実行する）\n'
ts += 'export type EnPage = { title: string; fullTitle: string; description: string; mainClass: string; html: string; newsSection?: string };\n'
for k in ('top', 'help', 'contact', 'terms', 'privacy'):
    ts += 'export const %s: EnPage = %s;\n' % (k.upper(), json.dumps(out[k], ensure_ascii=False))
ts += 'export const TRADEMARKS: string[] = %s;\n' % json.dumps(out['trademarks'], ensure_ascii=False)
ts += 'export const TOP_FAQ: { q: string; a: string }[] = %s;\n' % json.dumps(faq, ensure_ascii=False)
open(os.path.join(FRONT, 'src/content/en/pages.ts'), 'w', encoding='utf-8').write(ts)

# ---- en.css ----
styles = rd('styles.css')
a = styles.index('/* HERO：アプリの画面はまだ日本語'); b = styles.rindex('@media (prefers-reduced-motion: reduce) {')
only_en = styles[a:b].strip()
comp = rd('designSystem/components.css'); note = re.search(r'\.lang-note \{[^}]*\}', comp).group(0)
css = '''/* 英語のページ（/en/…。<html lang="en">）だけに効かせる CSS。scripts/sync-en.py が書き出したもの。手で直さない。
   もとは mock/design_en の、日本語版とちがうところ（designSystem/tokens.css・base.css・components.css、styles.css の「英語版だけ」、tools/help-figs の調整）。
   :where() で囲んで、もとの決まりと同じ強さにしてある（あとから読み込むので、こちらが勝つ。図ごとの細かい決まりには勝たない） */
html[lang="en"] {
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Hiragino Sans", "Noto Sans JP", sans-serif;
  --leading-display: 1.12; --leading-heading: 1.25; --leading-note: 1.6; --leading-body: 1.7;
  --tracking-heading: -.012em; --tracking-wide: .04em; --tracking-label: .06em;
}
:where(html[lang="en"]) i, :where(html[lang="en"]) em { font-style: normal; }
:where(html[lang="en"]) :is(p, li, dd, summary) { text-wrap: pretty; }
%s
/* 言語の切り替え（JA／EN）は、2026-11-22 からモックと同じく src/styles/components.css にある */
/* 図の中の文字 */
:where(html[lang="en"]) .vf-l4::after, :where(html[lang="en"]) .hfv-l4::after { content: "Aa"; }
/* ヘルプの図：英語の文言は長いので、メニューを広げて、文字を少し小さくする */
:where(html[lang="en"]) .hf-pop { width: 18.6em; }
:where(html[lang="en"]) .hf-r > span { font-size: .8em; }
:where(html[lang="en"]) .hf-btn { font-size: .72em; }
:where(html[lang="en"]) .hf4 .hf-pop { width: 18.3em; }
:where(html[lang="en"]) .hf4-win { left: .45em; }
:where(html[lang="en"]) .hf11-th span:first-child { width: 13.2em; }
:where(html[lang="en"]) .hf11-row b { font-size: .82em; width: 10.9em; }

/* ---- ここから、mock/design_en/styles.css の「英語版だけ」の写し ---- */
%s
@media (prefers-reduced-motion: reduce) {
  .of-pq *, .of-pq *::before, .of-pq *::after { animation-delay: -6s !important; animation-play-state: paused !important; }
}
''' % (note, only_en)
open(os.path.join(FRONT, 'src/styles/en.css'), 'w', encoding='utf-8').write(css)

# ---- en.js：HERO の一時停止と、お問い合わせフォーム（mock/design_en/contact.js）----
cj = rd('contact.js')
a = "    if (!id) {            // モック：送らない\n      showDone();\n      return;\n    }\n"; assert cj.count(a) == 1
cj = cj.replace(a, "    if (!id) {            // フォームの ID がまだ無い：送らない（「送信しました」と見せかけない）\n      status.textContent = 'The form is being set up. Please try again a little later.';\n      status.classList.add('is-error');\n      return;\n    }\n")
js = '''// 英語ページ（/en/…）の動き。scripts/sync-en.py が書き出したもの。手で直さない
// HERO のアニメ：一時停止のボタン
document.querySelectorAll('[data-hx-pause]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const paused = btn.closest('.hx').classList.toggle('is-paused');
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
  });
});
''' + cj
open(os.path.join(FRONT, 'public/en/en.js'), 'w', encoding='utf-8').write(js)
# en.js の中身が変わったら、読み込む URL も変える（ブラウザーが古いファイルを使い続けないように）。src/content/en/pages.ts に足す
import hashlib
ver = hashlib.sha1(js.encode('utf-8')).hexdigest()[:10]
open(os.path.join(FRONT, 'src/content/en/pages.ts'), 'a', encoding='utf-8').write('export const EN_JS_VERSION = "%s";\n' % ver)
shutil.copyfile(os.path.join(MOCK, 'og.png'), os.path.join(FRONT, 'public/og-en.png'))
print('pages:', {k: len(out[k]['html']) for k in ('top', 'help', 'contact', 'terms', 'privacy')}, 'en.css', len(css), 'en.js', len(js))
