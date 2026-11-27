// 用途別のページの英語版（/en/…）。2026-11-25 追加。日本語は src/content/usecases.ts（スラッグは同じ）。
// 事実は、英語のトップページとヘルプに書いてあることだけ。配信の状態（いまは日本の App Store。Android・Mac は近日公開）を変えたら、ここも直す。
// 価格は金額を書かない（英語圏では、まだ売っていないため）。
import { APP_STORE_URL } from "@/components/nav";
import type { UseCase } from "@/content/usecases";

const A = (href: string, text: string) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

const availability = `<p>MOTHERSHIP for iPhone and iPad is on the ${A(APP_STORE_URL, "App Store")}. It's currently available in Japan, with more countries on the way. The Android and Mac apps are coming soon.</p>`;

const outside = (device: string) => ({
  h2: "Connecting when you're away from home",
  html: `<p>On your home Wi-Fi, MOTHERSHIP finds your registered Mac and connects on its own. Away from home, install <b>Tailscale</b> (a VPN service that's free for personal use) on your Mac and your ${device}, and sign in to the same account on both. There's no router setup.</p>
<ul>
<li>If your Mac goes to sleep, you can't connect. Turn on "Keep Mac awake while waiting" in MOTHERSHIP HOST.</li>
<li>If you move from Wi-Fi to cellular, it reconnects automatically.</li>
<li>Video and input travel directly between your Mac and your ${device}. They don't pass through MOTHERSHIP's servers.</li>
</ul>
<p>The full walkthrough is in <a href="/en/help/#outside">Help: Use it away from home</a>.</p>`,
  video: "outside" as const,
});

const pricing = {
  h2: "Pricing",
  html: `<ul>
<li><b>Every feature is free for 14 days.</b></li>
<li>After that, it's a <b>one-time purchase</b>. There's no subscription.</li>
<li>One purchase covers up to 3 Macs.</li>
<li>No account to create.</li>
</ul>
<p>See <a href="/en/#pricing">Pricing</a> for details.</p>`,
};

const voice = (device: string) => ({
  h2: "Say the long parts",
  html: `<p>Hold the mic button on your ${device} and talk. Your voice goes to your Mac, and the words are typed into whatever app is open. The on-screen keyboard stays out of the way, so you keep the whole screen.</p>
<p>Voice input needs two things on your Mac: Aqua Voice (a dictation app from another company) and BlackHole 2ch (a free virtual audio device). Setup is covered in <a href="/en/help/#voice">Help: Set up voice input</a>. Without Aqua Voice, you can still type with the in-app keyboard or your ${device}'s keyboard.</p>`,
  video: "voice" as const,
});

const setup = (device: string, os: string) => ({
  h2: "Getting started in 3 steps",
  html: `<ol>
<li>Install <a href="/en/#download">MOTHERSHIP HOST</a> on your Mac at home (macOS 14 or later, Apple silicon or Intel). Turn on the two permissions it asks for: Screen Recording and Accessibility.</li>
<li>Install MOTHERSHIP on your ${device} from the ${A(APP_STORE_URL, "App Store")} (${os}).</li>
<li>Scan the QR code shown on your Mac to register your ${device}, then tap Connect.</li>
</ol>
<p>You'll find an illustrated walkthrough in <a href="/en/help/">Help</a>.</p>
${availability}`,
});

const aiSetup = {
  h2: "Getting started with MOTHERSHIP",
  html: `<ol>
<li>Install <a href="/en/#download">MOTHERSHIP HOST</a> on your Mac at home (macOS 14 or later, Apple silicon or Intel).</li>
<li>Install MOTHERSHIP on your iPhone or iPad from the ${A(APP_STORE_URL, "App Store")}.</li>
<li>Scan the QR code shown on your Mac to register your device, then tap Connect.</li>
</ol>
<p>To use it away from home, install Tailscale on your Mac and your phone (<a href="/en/help/#outside">Use it away from home</a>). To give instructions by voice, install Aqua Voice and BlackHole 2ch on your Mac (<a href="/en/help/#voice">Set up voice input</a>).</p>
${availability}`,
};

const STORE = { label: "Get it on the App Store", href: APP_STORE_URL };

export const USE_CASES_EN: UseCase[] = [
  {
    lang: "en",
    slug: "mac-remote-desktop-ipad",
    title: "Control Your Mac from an iPad: Remote Desktop with Sharp Text",
    description:
      "How to control your Mac from an iPad. MOTHERSHIP gives your Mac a display in the same shape as your iPad, so text stays sharp instead of shrinking. Tap to click, talk to type, and connect from anywhere with Tailscale. One-time purchase, no subscription.",
    kicker: "From your iPad",
    h1: "Control your Mac from an iPad",
    lead: "Here's how to use your Mac or Mac mini at home from an iPad. MOTHERSHIP adds a display to your Mac in the same shape as your iPad's screen, so everything on your Mac is the size it's meant to be.",
    image: { src: "/images/usecases/ipad-en.jpg", alt: "MOTHERSHIP showing a Mac's screen on an iPad: your iPad becomes a big screen for your Mac.", width: 1050, height: 1400, caption: "Your Mac's screen fills the whole iPad." },
    sections: [
      {
        h2: "How it's different from ordinary screen sharing",
        html: `<p>Most remote desktop and screen sharing apps shrink your Mac's monitor to fit. An iPad and a Mac monitor aren't the same shape, so you get empty bars above and below, and the text gets small.</p>
<p>While you're connected, MOTHERSHIP adds <b>a dedicated display that matches your iPad's size and shape</b>. Pixels line up one to one, so small terminal text and the numbers in a table are readable without zooming. Turn your iPad and the display switches between portrait and landscape.</p>`,
      },
      {
        h2: "What you can do from your iPad",
        html: `<ul>
<li><b>Control it by touch</b>: Wherever you tap is where you click. Touch and hold to right-click, and scroll with two fingers.</li>
<li><b>Three-finger swipes</b>: Swipe up for Mission Control, or left and right to switch desktops.</li>
<li><b>A real Mac keyboard</b>: The in-app keyboard and shortcut bar send ⌘C, ⌘V, and ⌘Tab with a single tap.</li>
<li><b>Three picture-quality modes</b>: Balanced (up to 60 fps), Text Priority, and Smoothness Priority.</li>
<li><b>Pinch to zoom</b>: The part you're looking at is re-captured at a higher resolution.</li>
</ul>
<p>It's not suited to fast-action games. MOTHERSHIP controls Macs only; it can't control Windows or Linux PCs.</p>`,
      },
      voice("iPad"),
      setup("iPad", "iPadOS 27 or later"),
      outside("iPad"),
      pricing,
    ],
    faq: [
      { q: "Can I control my Mac at home from my iPad when I'm away?", a: "Yes. Install Tailscale (a VPN service that's free for personal use) on your Mac and your iPad, and you can connect from anywhere. There's no router setup." },
      { q: "Is the Mac's text readable on an iPad?", a: "Yes. Your Mac gets a dedicated display in the same shape as your iPad, so text isn't shrunk. Pinch to zoom when you want a closer look." },
      { q: "Is there a subscription?", a: "No. After the 14-day free trial, it's a one-time purchase." },
    ],
    store: STORE,
  },
  {
    lang: "en",
    slug: "mac-remote-desktop-iphone",
    title: "Control Your Mac from an iPhone: Remote Desktop You Can Actually Read",
    description:
      "How to control your Mac from an iPhone. MOTHERSHIP gives your Mac a display shaped like your iPhone, so text isn't shrunk on the small screen. Tap to click and dictate long text by voice. Connect from anywhere with Tailscale. One-time purchase.",
    kicker: "From your iPhone",
    h1: "Control your Mac from an iPhone",
    lead: "Here's how to use your Mac at home from an iPhone. Two things make a Mac hard to use on a phone: the text is tiny, and long messages are painful to type. MOTHERSHIP was built to fix both.",
    image: { src: "/images/usecases/iphone-en.jpg", alt: "MOTHERSHIP showing a Mac's screen on an iPhone, in the shape of the iPhone instead of shrunk to fit.", width: 644, height: 1400, caption: "Your Mac's screen in the shape of your iPhone, not shrunk to fit." },
    sections: [
      {
        h2: "Why the text is readable on an iPhone",
        html: `<p>Show a 27-inch monitor on an iPhone as it is, and the text is too small to read. That's what ordinary remote desktop apps do: they shrink your Mac's monitor to fit.</p>
<p>While you're connected, MOTHERSHIP adds <b>a dedicated display that matches your iPhone's size and shape</b>. It fills the screen with pixels lined up one to one, so even small terminal text is sharp. Turn your iPhone sideways and you get a landscape display. For screens full of fine print, switch the picture quality to Text Priority.</p>`,
      },
      {
        h2: "Run your Mac with your fingers",
        html: `<ul>
<li><b>Direct touch</b>: Wherever you tap is where you click. When the AI on your Mac asks for your OK, just tap the button.</li>
<li><b>Touch and hold to right-click, two fingers to scroll.</b> Swipe up with three fingers for Mission Control.</li>
<li><b>For small targets</b>: Switch to a mode that turns the whole screen into a trackpad.</li>
<li><b>A real Mac keyboard</b>: The in-app keyboard and shortcut bar send ⌘C, ⌘V, and ⌘Tab.</li>
</ul>`,
      },
      voice("iPhone"),
      {
        h2: "When it comes in handy",
        html: `<ul>
<li>You've handed a job to Claude Code, Codex, or another AI on your Mac and headed out. Check on it from your phone, and if it's stopped, tell it what to do next.</li>
<li>You need a quick look at a file or document that only lives on your Mac at home.</li>
<li>You want to use the Mac on your desk from the couch.</li>
</ul>
<p>MOTHERSHIP has no AI features of its own. It shows and controls your Mac's screen as it is, so AI in the terminal, in your editor, or in the browser all work the way they always do. It doesn't notify you when a job finishes.</p>`,
      },
      setup("iPhone", "iOS 27 or later"),
      outside("iPhone"),
      pricing,
    ],
    faq: [
      { q: "Can I really read my Mac's text on an iPhone?", a: "Yes. Your Mac gets a dedicated display in the same shape as your iPhone, so text isn't shrunk. Pinch to zoom when you want a closer look. For lots of fine print, the Text Priority picture-quality mode is a good fit." },
      { q: "Can I control my Mac at home from my iPhone when I'm away?", a: "Yes. Install Tailscale (a VPN service that's free for personal use) on your Mac and your iPhone, and you can connect from anywhere. There's no router setup." },
      { q: "Can I use Claude Code or Codex from my iPhone?", a: "Yes. MOTHERSHIP shows and controls your Mac's screen as it is, so Claude Code and Codex running in the terminal work the way they always do. MOTHERSHIP has no AI features of its own." },
      { q: "How much data does it use?", a: "It adjusts automatically to what's happening on screen and to your connection. While the screen is still, it sends almost nothing." },
    ],
    store: STORE,
  },
  {
    lang: "en",
    slug: "mac-remote-desktop-android",
    title: "Control Your Mac from Android: Phones, Tablets, and Foldables",
    description:
      "How to control your Mac from an Android phone, tablet, or foldable. MOTHERSHIP gives your Mac a display in the shape of your device. Tested on the Galaxy Z Fold7. Coming soon to Google Play. One-time purchase, no subscription.",
    kicker: "From Android",
    h1: "Control your Mac from an Android phone or tablet",
    lead: "Here's how to use your Mac at home from an Android phone, tablet, or foldable. MOTHERSHIP for Android is coming soon to Google Play.",
    image: { src: "/images/usecases/android-en.jpg", alt: "MOTHERSHIP showing a Mac's screen on an unfolded foldable phone.", width: 1600, height: 900, caption: "Unfold your phone, and your Mac's screen takes that shape." },
    sections: [
      {
        h2: "Android and Mac, connected directly",
        html: `<p>To control your Mac from Android, you install MOTHERSHIP HOST on the Mac and MOTHERSHIP on your Android device, then scan the QR code shown on your Mac. There's no account to create.</p>
<p>Ordinary remote desktop apps shrink your Mac's monitor to fit. While you're connected, MOTHERSHIP adds <b>a dedicated display in the same shape as the device in your hand</b>, so text isn't shrunk even on a small screen.</p>`,
      },
      {
        h2: "On a foldable, change the shape and the screen follows",
        html: `<ul>
<li><b>Closed (cover screen)</b>: Your Mac's screen and a small trackpad, for a quick check on progress.</li>
<li><b>Unfolded</b>: Your Mac gets a display in the shape of the open screen, and fills it.</li>
<li><b>Half-folded on a desk</b>: The top half is your Mac's screen; the bottom half is shortcuts and a trackpad (or a keyboard).</li>
<li><b>Held like a book</b>: Your Mac's screen on the left, trackpad and keyboard on the right.</li>
</ul>
<p>It's built to run on foldables with Android 13 or later. The model we've tested on real hardware is the Galaxy Z Fold7.</p>`,
      },
      {
        h2: "Phones and tablets, too",
        html: `<p>The same app installs on phones and tablets running Android 13 or later. On a tablet it works like the iPad app, with a display shaped to the screen and a larger keyboard.</p>
<ul>
<li>Tap to click, touch and hold to right-click, scroll with two fingers.</li>
<li>Switch to a mode that turns the whole screen into a trackpad.</li>
<li>The in-app keyboard and shortcut bar send ⌘C, ⌘V, and ⌘Tab.</li>
</ul>`,
      },
      voice("Android device"),
      outside("Android device"),
      {
        h2: "Availability",
        html: `<p>MOTHERSHIP for Android is coming soon to Google Play. We'll announce it in <a href="/en/news/">News</a> when it's out. MOTHERSHIP HOST, the app for your Mac, is <a href="/en/#download">ready to download now</a>.</p>
<p>Have an iPhone or iPad? See <a href="/en/mac-remote-desktop-iphone/">Control your Mac from an iPhone</a> or <a href="/en/mac-remote-desktop-ipad/">from an iPad</a>.</p>`,
      },
      pricing,
    ],
    faq: [
      { q: "Can I control a Mac from an Android phone?", a: "Yes. Install MOTHERSHIP HOST on your Mac and MOTHERSHIP on your Android device, then scan the QR code shown on your Mac. MOTHERSHIP for Android is coming soon to Google Play." },
      { q: "Which foldable phones does it work on?", a: "It's built to run on foldables with Android 13 or later. The model we've tested on real hardware is the Galaxy Z Fold7. We'll announce other models as we test them." },
      { q: "Does it work on Android tablets?", a: "Yes. The same app installs on tablets running Android 13 or later. On a tablet it works like the iPad app, with a virtual display shaped to the screen and a larger keyboard." },
      { q: "How is it different from Samsung DeX?", a: "DeX lets you use your phone's apps on a big, PC-style screen. MOTHERSHIP is an app for controlling your Mac at home from your phone." },
    ],
    store: null,
    soon: "Coming soon to Google Play",
  },
  {
    lang: "en",
    slug: "mac-mini-remote-desktop",
    title: "Control a Mac mini from Your iPad or iPhone: Your AI Machine, in Your Hand",
    description:
      "How to control a Mac mini from an iPad or iPhone. Leave Claude Code, Codex, or other AI running on a Mac mini at home, then check on it and give the next instruction from your device. Sharp text, voice input, and remote access with Tailscale. One-time purchase.",
    kicker: "Your Mac mini",
    h1: "Control a Mac mini from your iPad or iPhone",
    lead: "Here's how to use a Mac mini that stays at home from your iPad or iPhone. If your Mac mini is the machine you hand jobs to AI on, you can watch it, control it, and tell it what to do next from wherever you are.",
    image: { src: "/images/usecases/mac-mini-en.jpg", alt: "Tapping Allow on an iPad to answer an AI that's waiting for approval on a Mac at home.", width: 1050, height: 1400, caption: "Answer the AI on your Mac mini from the device in your hand." },
    sections: [
      {
        h2: "A Mac mini that works for your AI",
        html: `<p>Leave Claude Code, Codex, or another AI running on a Mac mini, and the work keeps going while you're away. The trouble is that <b>when the AI stops to ask for your OK, you don't know unless you're there</b>, and <b>you can't give it the next instruction</b>.</p>
<p>MOTHERSHIP shows your Mac mini's screen on your iPad or iPhone and lets you control it. Open it when you're curious, see how far things have gotten, tap the approval button, and say what to do next. AI in the terminal, in your editor, or in the browser all look the way they always do. There's nothing to set up on the AI side.</p>
<p>MOTHERSHIP has no AI features of its own, and it doesn't notify you when a job finishes.</p>`,
      },
      {
        h2: "A display made for the screen in your hand",
        html: `<p>While you're connected, MOTHERSHIP adds <b>a dedicated display that matches your iPad or iPhone's size and shape</b> to your Mac mini. It doesn't shrink a big monitor to fit, the way ordinary screen sharing does, so text stays sharp. The dedicated display disappears automatically when you disconnect.</p>
<p>You can also mirror the monitor you normally use, as it is.</p>`,
      },
      {
        h2: "Settings for a Mac that stays on",
        html: `<ul>
<li><b>Keep it awake</b>: If your Mac goes to sleep, the job you handed off stops, and so does remote access. Turn on "Keep Mac awake while waiting" in MOTHERSHIP HOST.</li>
<li><b>Open at Login</b>: With this on, MOTHERSHIP HOST starts listening automatically after you log in. After a restart, you can't connect until someone logs in to the Mac.</li>
<li><b>One device at a time</b>: One device can be connected to a Mac at a time. Connect from another device and it takes over.</li>
<li><b>Automatic disconnect</b>: After a period with no input, it disconnects on its own (30 minutes by default).</li>
</ul>
<p>More in <a href="/en/help/#keep-awake">Help: Keep your Mac awake</a>.</p>`,
      },
      voice("iPad or iPhone"),
      {
        h2: "Getting started in 3 steps",
        html: `<ol>
<li>Install <a href="/en/#download">MOTHERSHIP HOST</a> on your Mac mini (macOS 14 or later, Apple silicon or Intel). Turn on the two permissions it asks for: Screen Recording and Accessibility.</li>
<li>Install MOTHERSHIP on your iPad or iPhone from the ${A(APP_STORE_URL, "App Store")} (iOS 27 / iPadOS 27 or later).</li>
<li>Scan the QR code shown on your Mac mini to register your device, then tap Connect.</li>
</ol>
<p>You'll do the first-time setup (the two permissions and the QR code) while looking at the Mac mini's own screen. There's an illustrated walkthrough in <a href="/en/help/">Help</a>.</p>
${availability}`,
      },
      outside("iPad or iPhone"),
      pricing,
    ],
    faq: [
      { q: "Can I control a Mac mini from an iPad or iPhone?", a: "Yes. Install MOTHERSHIP HOST on your Mac mini and MOTHERSHIP on your iPad or iPhone, then scan the QR code shown on your Mac mini." },
      { q: "Can I use Claude Code or Codex on my Mac mini while I'm away?", a: "Yes. MOTHERSHIP shows and controls your Mac's screen as it is, so Claude Code and Codex running in the terminal work the way they always do. To connect from away, install Tailscale on your Mac and your device. MOTHERSHIP has no AI features of its own." },
      { q: "Do I leave the Mac mini on while I'm out?", a: "Yes. If your Mac goes to sleep, you can't connect. Turn on \"Keep Mac awake while waiting\" in MOTHERSHIP HOST." },
      { q: "Does it work after the Mac mini restarts?", a: "You can't connect until someone logs in to the Mac, because MOTHERSHIP HOST isn't running yet. After login, it starts listening automatically (if \"Open at Login\" is on)." },
    ],
    store: STORE,
  },
  {
    lang: "en",
    slug: "claude-code-from-phone",
    title: "Claude Code from Your Phone: Remote Control vs. Controlling Your Whole Mac",
    description:
      "Ways to use Claude Code from your phone, compared: Anthropic's own Remote Control, Claude Code on the web, and controlling your whole Mac screen with MOTHERSHIP. What each is good at, and what to pick when you also want to see the browser preview and your other apps.",
    kicker: "Claude Code, from your phone",
    h1: "How to use Claude Code from your phone",
    lead: "You hand a job to Claude Code on your Mac and step away. There's more than one way to check on it and give the next instruction. Here are Anthropic's own features and the whole-screen approach, with what each is good at (as of November 2026).",
    image: { src: "/images/usecases/ai-en.jpg", alt: "Tapping Allow on an iPhone to answer an AI that's waiting for approval on a Mac at home.", width: 644, height: 1400, caption: "It shows your Mac's screen as it is, so you can tap the approval button yourself." },
    sections: [
      {
        h2: "Three ways to do it",
        html: `<table>
<thead><tr><th>Method</th><th>Where it runs</th><th>What you see on your phone</th></tr></thead>
<tbody>
<tr><th>Remote Control (official)</th><td>Claude Code on your own Mac</td><td>The Claude Code conversation</td></tr>
<tr><th>Claude Code on the web (official)</th><td>Anthropic's cloud</td><td>The Claude Code conversation</td></tr>
<tr><th>Your whole Mac screen (MOTHERSHIP)</th><td>Your own Mac</td><td>Everything on your Mac's screen</td></tr>
</tbody>
</table>
<p>The requirements and steps for the official features can change, so check ${A("https://code.claude.com/docs/en/remote-control", "the Claude Code documentation")} for the current details.</p>`,
      },
      {
        h2: "When the official Remote Control is the right fit",
        html: `<p>Remote Control is Anthropic's feature for driving a Claude Code session on your Mac from the Claude app on your phone or from a browser. Your files and tools stay on your Mac; only the conversation comes to your phone.</p>
<ul>
<li>The work moves forward through the conversation with Claude Code alone.</li>
<li>You want a quick reply in an interface made for a phone.</li>
<li>You don't want to install anything else.</li>
</ul>
<p>Trying the official feature first is the easiest place to start.</p>`,
      },
      {
        h2: "When controlling the whole screen is the right fit",
        html: `<p>MOTHERSHIP is a remote desktop app that shows your Mac's screen on your phone and lets you control it. It isn't a tool made for Claude Code, but it helps in cases like these:</p>
<ul>
<li><b>You want to see beyond the terminal</b>: the browser preview, a simulator, your editor, a design app. Look at what Claude Code built with your own eyes.</li>
<li><b>You're running several AIs or tools at once</b>: Claude Code, Codex, whatever else. Switching is just switching windows, with nothing to set up on the AI side.</li>
<li><b>You want to carry on in your usual terminal</b>: you control the session that's already open on your Mac.</li>
<li><b>You want to give long instructions by voice</b>: hold the mic and talk, and the words are typed into your Mac (Aqua Voice required on the Mac).</li>
</ul>
<p>To keep text readable on a phone, MOTHERSHIP gives your Mac a dedicated display in the same shape as your phone. It doesn't shrink your Mac's monitor, so terminal text stays sharp.</p>`,
      },
      {
        h2: "What MOTHERSHIP doesn't do",
        html: `<ul>
<li><b>It doesn't notify you when a job finishes.</b> You open it when you're curious and see how things are going.</li>
<li>It has no AI features of its own. It shows and controls your Mac's screen.</li>
<li>If your Mac goes to sleep, you can't connect. Turn on "Keep Mac awake while waiting" in MOTHERSHIP HOST.</li>
<li>To use it away from home, you need Tailscale on your Mac and your phone.</li>
</ul>
<p>It isn't either/or. You can answer through the official feature most of the time, and open MOTHERSHIP only when you want to check something on screen.</p>`,
      },
      aiSetup,
      pricing,
    ],
    faq: [
      { q: "Can I use Claude Code from my phone?", a: "Yes. Besides Anthropic's own Remote Control and Claude Code on the web, you can use a remote desktop app like MOTHERSHIP to control your whole Mac screen from your phone." },
      { q: "Is MOTHERSHIP an official Claude Code app?", a: "No. MOTHERSHIP is an independently developed remote desktop app. It is not certified, sponsored, or endorsed by Anthropic. It has no AI features of its own." },
      { q: "Does MOTHERSHIP notify me when Claude Code finishes?", a: "No. MOTHERSHIP has no feature that notifies you when a job finishes. You open it when you're curious and check on progress." },
      { q: "Can I really read terminal text on a phone-size screen?", a: "Yes. Your Mac gets a dedicated display in the same shape as your device, so text isn't shrunk. Pinch to zoom when you want a closer look. For lots of fine print, the Text Priority picture-quality mode is a good fit." },
    ],
    store: STORE,
  },
  {
    lang: "en",
    slug: "codex-from-phone",
    title: "Codex from Your Phone: The ChatGPT App vs. Controlling Your Whole Mac",
    description:
      "Ways to use Codex from your phone, compared: connecting to Codex on your Mac from the ChatGPT mobile app, and controlling your whole Mac screen with MOTHERSHIP. What each is good at, and what to pick when you also want to see previews and your other apps.",
    kicker: "Codex, from your phone",
    h1: "How to use Codex from your phone",
    lead: "You hand a job to Codex on your Mac and step away. Here are two ways to check on it and give the next instruction: OpenAI's own mobile feature, and controlling your whole Mac screen (as of November 2026).",
    image: { src: "/images/usecases/ai-en.jpg", alt: "Tapping Allow on an iPhone to answer an AI that's waiting for approval on a Mac at home.", width: 644, height: 1400, caption: "It shows your Mac's screen as it is, so you can tap the approval button yourself." },
    sections: [
      {
        h2: "Two ways to do it",
        html: `<table>
<thead><tr><th>Method</th><th>What you see on your phone</th><th>Good for</th></tr></thead>
<tbody>
<tr><th>The ChatGPT mobile app (official)</th><td>Codex tasks and conversations</td><td>Checking tasks, approving commands, reviewing diffs</td></tr>
<tr><th>Your whole Mac screen (MOTHERSHIP)</th><td>Everything on your Mac's screen</td><td>Working with previews and other apps in view</td></tr>
</tbody>
</table>
<p>The requirements and steps for the official feature can change, so check ${A("https://learn.chatgpt.com/docs/mobile", "OpenAI's documentation")} for the current details.</p>`,
      },
      {
        h2: "When the official mobile app is the right fit",
        html: `<p>From the ChatGPT mobile app, you can open Codex on a connected computer to check on tasks in progress, approve commands, review diffs, and start new tasks. Your files and terminal stay on the computer.</p>
<ul>
<li>The work moves forward through the conversation with Codex alone.</li>
<li>You want to approve and review quickly in an interface made for a phone.</li>
<li>You don't want to install anything else.</li>
</ul>`,
      },
      {
        h2: "When controlling the whole screen is the right fit",
        html: `<p>MOTHERSHIP is a remote desktop app that shows your Mac's screen on your phone and lets you control it. It isn't a tool made for Codex, but it helps in cases like these:</p>
<ul>
<li><b>You want to see beyond Codex</b>: the browser preview, a simulator, your editor. Look at what Codex built with your own eyes.</li>
<li><b>You want to carry on with Codex in your terminal</b>: you control the screen that's already open on your Mac.</li>
<li><b>You're running several AIs or tools at once</b>: Codex, Claude Code, whatever else. Switching is just switching windows.</li>
<li><b>You want to give long instructions by voice</b>: hold the mic and talk, and the words are typed into your Mac (Aqua Voice required on the Mac).</li>
</ul>
<p>To keep text readable on a phone, MOTHERSHIP gives your Mac a dedicated display in the same shape as your phone, so nothing is shrunk to fit.</p>`,
      },
      {
        h2: "What MOTHERSHIP doesn't do",
        html: `<ul>
<li><b>It doesn't notify you when a job finishes.</b> You open it when you're curious and see how things are going.</li>
<li>It has no AI features of its own. It shows and controls your Mac's screen.</li>
<li>It controls Macs only. It can't control Windows or Linux PCs.</li>
<li>If your Mac goes to sleep, you can't connect. To use it away from home, you need Tailscale on your Mac and your phone.</li>
</ul>`,
      },
      aiSetup,
      pricing,
    ],
    faq: [
      { q: "Can I use Codex from my phone?", a: "Yes. Besides OpenAI's own ChatGPT mobile app, you can use a remote desktop app like MOTHERSHIP to control your whole Mac screen from your phone." },
      { q: "Is MOTHERSHIP an official Codex app?", a: "No. MOTHERSHIP is an independently developed remote desktop app. It is not certified, sponsored, or endorsed by OpenAI. It has no AI features of its own." },
      { q: "Which AI tools does it work with?", a: "Any AI that runs on your Mac. MOTHERSHIP shows and controls your Mac's screen as it is, so AI in the terminal, in your editor, or in the browser all work the way they always do." },
      { q: "Is there a subscription?", a: "No. After the 14-day free trial, it's a one-time purchase." },
    ],
    store: STORE,
  },
];

export const getUseCaseEn = (slug: string) => USE_CASES_EN.find((u) => u.slug === slug)!;

export const USE_CASE_LINKS_EN = [
  { href: "/en/mac-remote-desktop-iphone/", label: "Control your Mac from an iPhone" },
  { href: "/en/mac-remote-desktop-ipad/", label: "From an iPad" },
  { href: "/en/mac-remote-desktop-android/", label: "From Android" },
  { href: "/en/mac-mini-remote-desktop/", label: "Control a Mac mini" },
  { href: "/en/claude-code-from-phone/", label: "Claude Code from your phone" },
  { href: "/en/codex-from-phone/", label: "Codex from your phone" },
] as const;
