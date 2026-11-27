#!/usr/bin/env python3
"""stage.html（日本語）から stage-en.html（英語）を作る。使い方：python3 build-en.py
・HTML のかたまりで置き換えるもの（SNIPPETS）を先に、次にタグの間の文（TEXT）を置き換える
・置き換えたあとに日本語が残っていたら、止まる（stage.html に文を足したら、ここにも訳を足す）
・英語の言い回しは、英語版のヘルプ（frontend/src/content/en/pages.ts の HELP）に合わせる"""
import re, pathlib
here = pathlib.Path(__file__).parent
s = (here / "stage.html").read_text(encoding="utf-8")

SNIPPETS = [
  ('<html lang="ja">', '<html lang="en">'),
  ('<span>声で書く</span>準備', 'Set up <span>voice input</span>'),
  ('<span>外から使う</span>準備', 'Set up <span>remote access</span>'),
  ('これで、<span>声で書けます。</span>', 'Now you can <span>type by voice.</span>'),
  ('これで、<span>外からつなげます。</span>', 'Now you can <span>connect from anywhere.</span>'),
  ('入れたら、Macの前で試します。<kbd>fn</kbd>キーを押している間だけ話して、離します。', 'Then try it at your Mac: hold <kbd>fn</kbd>, speak, and let go.'),
  ('録音のキーは <kbd>fn</kbd> のままに。<small>（変えると、デバイスから話せません）</small>', 'Keep the recording key set to <kbd>fn</kbd>. <small>(If you change it, talking from your device won\'t work.)</small>'),
  ('「ターミナル」を開きます。<kbd>⌘</kbd>＋<kbd>スペース</kbd> →「ターミナル」と打って <kbd>return</kbd>。', 'Open Terminal: press <kbd>⌘</kbd>+<kbd>Space</kbd>, type “Terminal”, then press <kbd>return</kbd>.'),
  ('Homebrew（ソフトを入れる無料の道具）があるか、確かめます。<small>数字が出たら、次へ。</small>', 'Check whether you have Homebrew, a free tool for installing software. <small>See a version number? Skip ahead.</small>'),
  ('無ければ、ヘルプのコマンドを貼り付けて <kbd>return</kbd>。パスワードは、画面に出ません。', 'If not, paste the command from Help and press <kbd>return</kbd>. Your password won\'t show as you type.'),
  ('<s>MOTHERSHIPのサーバー</s> は通りません。ルーターの設定も、要りません。', 'They never pass through MOTHERSHIP servers. No router setup, either.'),
  ('✓ デバイスが、外からの<br>つなぎ先を覚えます', '✓ Device remembers<br>the route to your Mac'),
  ('>mothershipremote.com/help<', '>mothershipremote.com/en/help<'),
]
TEXT = {
  # 1 本目：声で書く準備
  "声で書く準備": "Voice input setup", "マイクを選ぶ": "Choose the mic", "MOTHERSHIP の準備ガイド": "MOTHERSHIP SETUP GUIDE",
  "「Aqua Voice」と「BlackHole 2ch」を、Macに入れます": "Install Aqua Voice and BlackHole 2ch on your Mac",
  "3ステップ": "3 steps", "はじめに1回だけ": "One-time setup", "作業は、すべてMacで": "All done on your Mac",
  "デバイスに話した声を、Macで文字にするための準備です。": "Get ready to turn what you say on your device into text on your Mac.",
  "デバイス": "Your device", "🎤を押して話す": "Hold 🎤 and speak", "Macの中": "On your Mac", "声を受け取る": "Receives audio",
  "入れる": "Install", "仮想のマイク": "Virtual mic", "声を文字にする": "Voice to text", "開いているアプリ": "The open app", "文字が入る": "Text is typed",
  "声は、この順番でMacの中を流れて、文字になります。": "Your voice travels through your Mac in this order and becomes text.",
  "Macに入れるのは、「Aqua Voice」と「BlackHole 2ch」の2つです。": "You only need to install two things: Aqua Voice and BlackHole 2ch.",
  "声を文字にする、音声入力のアプリ（Mac版）": "Voice dictation app (for Mac)", "ダウンロード ↓": "Download ↓",
  "Macに入れています…": "Installing on your Mac…", "Aqua Voice を入れました": "Aqua Voice installed",
  "公式サイト aquavoice.com から、Aqua Voice のMac版を入れます。": "Install Aqua Voice for Mac from the official site, aquavoice.com.",
  "メモ": "Notes", "明日の会議は、10時からです。": "Tomorrow's meeting starts at 10.", "fn を押している間だけ、話す": "Speak only while holding fn",
  "話す": "Say", "「明日の会議は、10時からです」": "“Tomorrow's meeting starts at 10.”", "聞き取り中": "Listening",
  "✓ 話した文が入れば、大丈夫": "✓ If your words appear, you're set",
  "＋": "+", "スペース": "Space", "ターミナル": "Terminal", "アプリケーション": "Application",
  "ここにコマンドを貼り付けて、return キーを押します": "Paste a command here, then press return",
  "まだ入っていません": "Not installed yet", "コマンドを貼り付ける": "Paste the command", "打っても、文字は出ません": "Nothing shows as you type",
  "return キーを押す": "Press return", "数分かかります": "Takes a few minutes", "成功です": "Success", "コピーして、1行ずつ実行": "Copy & run each line",
  "最後の「Next steps:」の下に出たコマンドも、コピーして1行ずつ実行します。": "Then copy the commands shown under “Next steps:” and run them one at a time.",
  "Macを再起動します": "Restart your Mac", "再起動するまで、BlackHole 2ch は使えません": "BlackHole 2ch won't work until you restart",
  "次のコマンドで、BlackHole 2ch（仮想のマイク）を入れます。": "Run this command to install BlackHole 2ch, the virtual microphone.",
  "入れ終わったら、Macを再起動します。": "When it finishes, restart your Mac.",
  "システム設定": "System Settings", "サウンド": "Sound", "出力": "Output", "入力": "Input", "MacBookのマイク": "MacBook Microphone", "内蔵": "Built-in",
  "選ぶのは、こちらのまま": "Keep this selected", "仮想": "Virtual", "✓ 入っています": "✓ Installed", "イヤホンのマイク": "Earbuds Microphone",
  "「システム設定」›「サウンド」›「入力」に BlackHole 2ch があれば、成功です。": "If BlackHole 2ch is listed in System Settings › Sound › Input, it worked.",
  "ここでは、BlackHole 2ch を選びません。いつものマイクのままにします。": "Don't select BlackHole 2ch here. Leave your usual microphone selected.",
  "マイクは「BlackHole 2ch」": "Microphone: BlackHole 2ch",
  "Aqua Voice の設定 ›「Audio」で、マイクを「BlackHole 2ch」にします。": "In Aqua Voice's settings, open Audio and set the microphone to BlackHole 2ch.",
  "次は、グラフを直してください。": "Next, fix the chart.", "● 接続中": "● Connected", "「次は、グラフを直してください。」": "“Next, fix the chart.”",
  "押している間だけ、話す →": "Speak only while holding →", "離すと、Macに文字が入る": "Release, and the text lands on your Mac",
  "準備は終わりです。デバイスの 🎤 を押したまま話して、離します。": "Setup is done. Hold 🎤 on your device, speak, and let go.",
  "少し待つと、話した文がMacに入ります。": "A moment later, what you said is typed on your Mac.",
  "準備ができました": "You're all set", "コマンドと、くわしい手順は「ヘルプ」に": "Commands and detailed steps are in Help",
  "Aqua Voice・Homebrew・BlackHole は、MOTHERSHIP とは別の会社などのソフトです。画面や入れ方は、変わることがあります。": "Aqua Voice, Homebrew, and BlackHole are made by companies and people other than MOTHERSHIP. Screens and steps may change.",
  "うまくいかないときは、ヘルプの「声で書けないとき」を見てください。": "If it doesn't work, see “When voice input isn't working” in Help.",
  # 2 本目：外から使う準備
  "外から使う準備": "Remote access setup", "アカウント": "Account", "アプリを入れる": "Install the app", "家でつなぐ": "Connect at home", "外で試す": "Test outside",
  "「Tailscale」を、Macとデバイスの両方に入れます": "Install Tailscale on both your Mac and your device",
  "4ステップ": "4 steps", "個人なら無料": "Free for personal use", "ルーターの設定は不要": "No router setup",
  "家の外から、家のMacにつなぐための準備です。": "Get ready to connect to your Mac at home from anywhere.",
  "外出先のデバイス": "Your device, away", "モバイル回線や、外のWi-Fi": "Cellular or outside Wi-Fi", "暗号化された通り道": "Encrypted tunnel", "家のMac": "Your Mac at home",
  "操作（デバイス → Mac）": "Input (device → Mac)", "画面（Mac → デバイス）": "Screen (Mac → device)",
  "Tailscale は、離れた機器どうしを安全につなぐサービスです。": "Tailscale is a service that securely connects devices in different places.",
  "操作も画面も、デバイスとMacが直接やり取りします。": "Input and screen go directly between your device and your Mac.",
  "離れた機器どうしを、安全につなぐサービス": "Securely connects devices in different places", "アカウントを作る": "Create an account", "アカウントができました": "Account created",
  "Tailscale の公式サイトで、アカウントを作ります。": "Create an account on the official Tailscale site.",
  "🖥️ 家のMac": "🖥️ Your Mac at home", "ログインします…": "Signing in…", "接続済み": "Connected", "tailscale.com か Mac App Store から": "tailscale.com or the Mac App Store",
  "同じアカウントでログイン": "Sign in to the same account", "📱 デバイス": "📱 Your device", "App Store か Google Play から": "App Store or Google Play",
  "Macとデバイスの両方に、Tailscale のアプリを入れます。": "Install the Tailscale app on both your Mac and your device.",
  "かならず、同じアカウントでログインします。": "Be sure to sign in to the same account on both.",
  "🏠 家のWi-Fi": "🏠 Home Wi-Fi", "🖥️ 自宅のMac": "🖥️ Home Mac", "● 見つかりました": "● Found", "接続": "Connect",
  "家のWi-Fiで、いちど MOTHERSHIP でMacにつなぎます。": "On your home Wi-Fi, connect to your Mac with MOTHERSHIP once.",
  "○ 外出先は Tailscale で接続": "○ Connects via Tailscale",
  "スマホのWi-Fiを切る（モバイル回線に）": "Turn off Wi-Fi on your phone (use cellular)", "Tailscale がオンなのを確かめる": "Make sure Tailscale is on",
  "MOTHERSHIP の「接続」をタップ": "Tap Connect in MOTHERSHIP", "Macの画面が映れば、準備は終わり": "If your Mac's screen appears, you're set",
  "出かける前に、試します。スマホのWi-Fiを切って、「接続」をタップ。": "Try it before you leave: turn off Wi-Fi on your phone and tap Connect.",
  "Macの画面が映れば、準備は終わりです。": "If your Mac's screen appears, you're all set.",
  "外では、Tailscale がオンなのを確かめて「接続」をタップするだけ": "When you're out, just make sure Tailscale is on and tap Connect",
  "Tailscale は、MOTHERSHIP とは別の会社のサービスです。画面や入れ方は、変わることがあります。": "Tailscale is a service from a company other than MOTHERSHIP. Screens and steps may change.",
  "つながらないときは、ヘルプの「外から使う」を見てください。": "If you can't connect, see “Use it away from home” in Help.",
}
head, body = s.split("<body>", 1)
head = head.replace('<html lang="ja">', '<html lang="en">').replace("<title>MOTHERSHIP セットアップ動画の舞台</title>", "<title>MOTHERSHIP setup videos (English stage)</title>")
head = head.replace("<!-- 開き方：", "<!-- build-en.py が stage.html から作ったもの。直すときは stage.html と build-en.py を直す。開き方：")
for a, b in SNIPPETS[1:]:
    assert a in body, f"見つからない：{a[:40]}"
    body = body.replace(a, b)
def rep(m):
    raw = m.group(1); t = raw.strip()
    if t in TEXT:
        return ">" + raw.replace(t, TEXT[t]) + "<"
    return m.group(0)
body = re.sub(r">([^<>]+)<", rep, body)
left = sorted(set(re.findall(r"[^<>\n]*[぀-ヿ一-鿿][^<>\n]*", re.sub(r"<!--.*?-->", "", body, flags=re.S))))
assert not left, "日本語が残っている：\n" + "\n".join(left)
(here / "stage-en.html").write_text(head + "<body>" + body, encoding="utf-8")
print("stage-en.html を書き出した")
