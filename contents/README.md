# Mothership LP コンテンツ

配色の案「08 Gradient」の HERO に合わせて作った、LP 全体の原稿と実画面の素材です。
作成：2026-11-19 Claude Code（MacBook Air）。アプリは `android-remote-for-mac` の `main` `a9c5093`。

| ファイル | 内容 |
|---|---|
| `lp-content.md` | LP の原稿（HERO からフッターまで全文）。ページに載せる文章はこのファイルだけを見れば足ります |
| `images/` | iOS シミュレーターで撮った実画面（中身を目で確認済み。個人情報なし） |
| `README.md` | このファイル。素材の一覧、撮影リスト、未確定事項、事実の根拠 |

## いまの状態

- 原稿：初版ができています（S0 メタ情報〜S10 フッター＋ボタンの文言集）。
- 画像：**未接続の画面 3 枚だけ**。Mac の画面が映った「接続中」の画面と動画は、今回は撮っていません（ペアリングのリンクを MacBook Air に渡せなかったため、ユーザーの判断で見送り）。HERO の中の画面は、当面いまの図形モックのままです。
- 実施していないこと：WordPress への組み込み、ブラウザでの表示確認、実機での撮影。

## 素材の一覧

| ファイル | 大きさ | 中身 | 使う場所（原稿） | 注意 |
|---|---|---|---|---|
| `images/app-iphone-connect-portrait.png` | 1206×2622 | iPhone 17：最初の画面（Mac の登録） | S6 使い方 ステップ2 | シミュレーターはカメラがないため「リンクで登録」の表示。実機は「QRコードを読み取ってペアリング」のボタンが出る。公開時は実機の画面に差し替え |
| `images/app-iphone-settings-license.png` | 1206×2622 | iPhone 17：設定の「ライセンス」（一度の購入で何台でも、の説明） | S7 料金 | 「購入する」に価格が出ていない（シミュレーターでは商品情報を読めないため）。公開時は価格の入った画面に差し替え |
| `images/app-ipad-connect-portrait.png` | 1640×2360 | iPad Air 11インチ：最初の画面 | S6 使い方（iPad 用の絵が要るとき） | 同上（リンクで登録の表示） |

どれもアプリの画面そのまま（端末の枠・ステータスバーなし、ダークの配色）。LP は明るい配色なので、端末の枠にはめて使う想定です。

## 撮影リスト（まだ無い素材）

| 優先 | 絵 | 使う場所 | 撮り方 |
|---|---|---|---|
| 高 | iPhone 横向きで Mac のデスクトップが映っている画面 | HERO のモック差し替え、F1 | 下の「接続中の画面の撮り方」 |
| 高 | iPhone 縦向きで Mac のデスクトップが映っている画面 | S6 ステップ3 | 同上 |
| 高 | アプリ内キーボード＋ショートカットバー | F2 | 同上（`ui-connected` の `p2-keyboard`・`l2-keyboard`） |
| 中 | 「文字入力」の欄（日本語を変換して送る） | F3 | 同上（`p3-text-input`） |
| 中 | Mac のメニューバーの Mothership Host（QR コードの窓、登録済みの端末） | S6 ステップ1・2、F5 | Mac mini で画面を撮る（個人情報の写り込みに注意） |
| 中 | 実機の「QRコードを読み取ってペアリング」の画面 | S6 ステップ2 | iPhone・iPad の実機 |
| 中 | 価格の入った「ライセンス」の画面 | S7 | StoreKit の設定を読ませたビルド、または TestFlight |
| 低 | 折りたたみスマホの上下分割（上＝Mac の画面、下＝トラックパッド） | F7 | Galaxy Z Fold7 の実機、または Fold 型エミュレーター |
| 低 | iPad に Mac の画面が映っている画面 | S3・S5 | 下の撮り方を iPad Air のシミュレーターで |
| 低 | 短い動画（つないで、キーボードを出して、文字を打つ） | HERO か F2 | `xcrun simctl io <ID> recordVideo`。シミュレーターは外からタップできないので、動きのある絵は実機の画面収録が向く |
| 低 | OGP 画像（1200×630） | S0 | HERO から作る |

### 接続中の画面の撮り方（次回用）

今回、シミュレーター用のビルドまでは済んでいます（MacBook Air の `ios-client/build-sim/`。.gitignore 済み）。iPhone 17（iOS 27.2）のシミュレーターにアプリが入っていて、Mac は未登録です。

1. Mac mini の Mothership Host →「端末を追加…」→「リンクをコピー」（5 分・1 回だけ有効）。リンクを MacBook Air に渡す（今回はここで止まりました。ユニバーサルクリップボードでは届かなかったので、チャットへの貼り付けなど別の渡し方が要ります）。
2. `QA連携/ステータス.md` の「ホストの接続ロック」に記入（ホストの接続は 1 つだけ。つなぐとほかの端末が切れる）。
3. `xcrun simctl launch --console-pty <ID> com.mothershipremote.client -pairURI "<リンク>" -autoConnect YES -display virtual -selfTest ui-connected`
   縦・横それぞれで、ツールバー → アプリ内キーボード → 文字入力 → 設定の順に画面が変わる。その間に `xcrun simctl io <ID> screenshot <ファイル>` で撮る（アプリが自分で描く `Documents/qa/uic-*.png` には Mac の映像が写らないので、`simctl` で撮る）。
4. 撮った画像は、Mac mini のデスクトップ（Dock・メニューバー・開いている窓）が写るので、1 枚ずつ確かめてから `images/` に入れる。ロックを「なし」に戻す。

仮想モニターには、何も置いていないデスクトップ（壁紙・メニューバー・Dock）が映ります。窓のある絵にするには、つないだまま Mac mini 側で窓を仮想モニターへ動かす必要があります。

## 未確定事項（公開前に決める・確かめる）

原稿の中では【未確定：…】と書いてあります。

| # | 項目 | いま分かっていること |
|---|---|---|
| 1 | ストアと配布の URL（App Store／Google Play／Host のダウンロード／Mac 版）、公開の時期 | まだどれも公開していない。未公開のボタンには「近日公開」の文言を用意 |
| 2 | 日本円の価格 | US$19.99 は決定。日本円は App Store の価格表から選ぶ予定（仕様書の目安は約 3,000 円） |
| 3 | iPhone・iPad の対応バージョン | いまのビルド設定は iOS／iPadOS 27.0 以上（`project.pbxproj` の `IPHONEOS_DEPLOYMENT_TARGET`）。下げるかどうかで LP の表記が変わる |
| 4 | Intel 搭載の Mac に対応するか | いまのビルドは arm64 だけ。原稿は「Appleシリコンで動作確認」としてある |
| 5 | Android・Mac 版からの購入 | iPhone・iPad（App Store）は実装済み。Android（Google Play）は確認済み・未取り込み、Mac 版は調査前 |
| 6 | Mac 版クライアントの入手先 | このサイトか、Mac App Store か（第 3 段階の調べ次第） |
| 7 | Mac がロックされているときの案内（FAQ の最後） | ロック解除の画面があるのは Mac 版だけ。iPhone・iPad・Android には無い（コードで確認）。公開までに対応するなら FAQ を書き換え、しないなら正直に書く |
| 8 | 画面の広さ 3 段階（F1） | iPhone・iPad の設定で確認。Android・Mac 版の同じ設定は未確認 |
| 9 | 遅延や通信量の数値を載せるか | 原稿には数値を入れていない（測定はあるが条件つきのため）。載せるなら条件を添える |
| 10 | サポート・お問い合わせ先、プライバシーポリシーの URL | 未作成（App Store の申請にも必要） |
| 11 | フッターの名義（© の後ろ） | 販売者は個人名で出る予定。サイトの名義は未決定 |
| 12 | HERO の文言 2 か所の直し | 「MACを」→「Macを」（商標の表記）、補足カードの言い回し。原稿 S1 に提案 |

## 事実と根拠（原稿の主張がどこから来ているか）

2026-11-19 に、仕様書（Obsidian の `10_Projects/android-remote-for-mac/`）とコード（`main` `a9c5093`）で確かめました。

| 原稿の主張 | 根拠 |
|---|---|
| デバイスと同じ大きさ・形の専用モニターを追加、切断で消える、向きで切り替わる | 仕様書 F-13、iPad版仕様書 §3、`SettingsView.swift`「向きに合わせて仮想モニターの大きさを切り替える」 |
| 止まると高画質で送り直す | `mac-host/Sources/HostRTC/RtcSession.swift:80`（静止時の高画質化、0.3 秒後） |
| 拡大した部分を高い解像度で取り込む | `SettingsView.swift`「拡大した部分を Mac で高い解像度で取り込む」 |
| 広さ 3 段階（1対1／120%／140%） | `SettingsView.swift`「仮想モニターの広さ」（iPhone・iPad） |
| いつものモニターも映せる | `MacRemoteFoldForIpadApp.swift`「どの画面を映しますか？」、仕様書 F-12 |
| 直接タッチ・トラックパッド・3 本指の操作 | 仕様書 §5.3、`SettingsView.swift`「直接タッチ（触った場所をクリック）」 |
| Mac 配列のキーボード、並べ替えできるショートカットバー | 仕様書 F-20〜F-25、アプリの「ショートカットバーの編集」 |
| 外付けのキーボード・マウス（iPhone はキーボードのみ） | iPad版仕様書 §5.5、`SettingsView.swift`（iPhone ではマウスの項目を出さない） |
| 日本語入力の 2 方式、英数・かな、刻印を Mac に合わせる | 仕様書 §5.4.2、F-23、`SettingsView.swift`「文字の入力・クリップボード」 |
| クリップボード（文字・画像）、ファイル、ドラッグ＆ドロップ、Mac の音 | 仕様書 §5.6〜5.8、iPad版仕様書 §5.6〜5.8、`ClipboardSync.swift`（画像は 20MB まで） |
| 自宅の画面を隠す、外出先は自動、切断でロック | `SettingsView.swift`「外出先から接続したら、自宅の Mac の画面を自動で隠す」、ホストの「画面を隠していたときは、切断したら Mac をロックする」 |
| TLS 1.3、Mothership のサーバーを通らない | ホストの表示「通信は TLS 1.3 で暗号化されています」、`RtcSession.swift:250`（`iceServers = []`。STUN・TURN なし） |
| 登録は QR、端末ごとの鍵は取り出せない | 仕様書 §9、`HostStore.swift`（iPhone・iPad・Mac は Secure Enclave）、`DeviceKey.kt`（Android Keystore） |
| Face ID・Touch ID・指紋でロック | `BiometricLock.swift`、Android の「アプリを開くときに指紋・顔認証などでロックを解除する」 |
| 接続・切断を通知、操作がないと切断（はじめは 30 分） | ホストの「接続・切断を通知する」、`SettingsView.swift`「操作がないときに切断」（既定 30） |
| ポートの開放は不要、接続元は自宅のネットワークと Tailscale だけ | 仕様書 §9、`SessionManager.swift:319`（`isAllowedPeer`） |
| 自宅では自動で見つかる、外出先は Tailscale、自動でつなぎ直す | 仕様書 F-02〜F-04、アプリの「アドレスを直接入力（Tailscale の名前も可）」「再接続しています…」 |
| 画質 3 種類、最大 60fps、通信量は自動調整 | `SettingsView.swift`「バランス（60fps）／文字優先（30fps）／滑らかさ優先」 |
| Mac は何台でも登録できる | 仕様書 F-05、iPad版仕様書 F-05 |
| 折りたたみの上下分割 | `android-client/…/ui/App.kt:380`（テーブルトップ）。動作確認は Galaxy Z Fold7 |
| 対応 OS | `mac-host/Package.swift`（macOS 14）、`macos-client/Package.swift`（macOS 15）、`android-client/app/build.gradle.kts`（minSdk 33＝Android 13）、`project.pbxproj`（iOS 27.0） |
| 試用 14 日（はじめての接続から）、買い切り US$19.99、1 回の購入で Mac 何台でも、復元 | `リリースと課金 仕様書（案）.md` §4・§6、ホストの表示「最初の接続から 14 日間、すべての機能を試せます」、`LicensePurchase.swift` |
| 試用が終わると接続できない | ホストの表示「試用期間が終了しました。端末から接続できません」 |
| アカウントの登録なし | 登録は QR コードのペアリングだけ（仕様書 §5.1）。アカウントの仕組みはコードに無い |
| スリープ中は不可・「待機中も Mac をスリープさせない」、ログイン前は不可・「ログイン時に起動」 | 仕様書 R-1・R-3、ホストのメニューの 2 つの切り替え |
| 同時につなげるのは 1 台、あとからつなぐと切り替わる | `SessionManager.swift:419`（新しい接続に切り替え） |
| 必要な許可は画面収録とアクセシビリティ | `mac-host/…/App.swift:464`、仕様書 §9 |
| 声で入力（🎤 を押している間だけ送る、外へ滑らせて取り消し、動かせるボタン、⌫・⏎、話すキー、Aqua Voice と BlackHole 2ch が要る、声を残さない） | `音声入力の中継 仕様書.md` §4・§6（V-14：声はログ・ファイルに残さない）、`SettingsView.swift:107`「音声入力（Mac の Aqua Voice）」、Android `ui/App.kt:937`、`MacRemoteFoldForIpadApp.swift`（削除・Return のボタン） |
| 端末をなくしたら、登録済みの端末から削除 | 仕様書 §9、ホストのメニュー「登録済みの端末」 |

## 原稿に入れなかった機能

- **統計の表示、圧縮方式の選択、計測モード**：開発者向けの設定のため。
- **Mac 版のデスクトップ切り替えのショートカット**（⌃⌥⌘←→ など）：Mac 版の使い方ページ向け。

## 表記のルール

- 製品名：操作する側は「Mothership」、Mac に入れる側は「Mothership Host」。ロゴは「MOTHERSHIP」。App Store に載せる名前は「Mothership Remote」の予定。フォルダ名の「MotherShip」は使わない。
- Apple の製品名は「Mac」「iPhone」「iPad」（「MAC」は使わない）。
- LP の文章では、英数字と日本語の間に空白を入れない（アプリの画面は「Mac を、手元の画面へ。」のように空白あり。引用するときはアプリの表記のまま）。
- 「端末」ではなく「デバイス」（HERO の言葉に合わせる）。アプリの画面の文言を引用するときだけ「端末」。
- 根拠のない「最速」「No.1」などは書かない。

## 注意

- このテーマは `.vscode/sftp.json` で本番サーバーにつながっていて、`uploadOnSave` がオンです。`contents/`・`design/`・`design2/` は `ignore` に入れてあります（2026-11-19。`design2/` は 2026-11-20 に `design/` へ名前が変わり、いまは無い）。新しい下書き用のフォルダを作るときは、同じように `ignore` へ足してください。
- 原稿をもとにした LP：`../design/`（Claude Code。はじめは `design2` という名前だった。HERO は自作のアニメ（イメージ）で、本物の動画を置けば差し替わる。「声で入力」の節あり）。色・文字・部品の決まりは `../design/designSystem/`。
