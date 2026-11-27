import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { SetupVideo } from "@/components/SetupVideo";
import { breadcrumbLd, faqLd } from "@/lib/seo";
import { USE_CASE_LINKS, type UseCase } from "@/content/usecases";
import { USE_CASE_LINKS_EN } from "@/content/usecases-en";

// 用途別のページの形（お知らせの記事と同じ組み方：見出しの帯＋本文）。
// 中身は src/content/usecases.ts（日本語）と usecases-en.ts（英語。URL は /en/…）
const T = {
  ja: { home: "/", faq: "よくある質問", host: "MOTHERSHIP HOST（Mac用）を入れる", hostHref: "/#download", soon: "Google Playで近日公開", more: "ほかの使い方", top: "MOTHERSHIPのトップページ" },
  en: { home: "/en/", faq: "FAQ", host: "Get MOTHERSHIP HOST for your Mac", hostHref: "/en/#download", soon: "Coming soon to Google Play", more: "More ways to use it", top: "MOTHERSHIP home" },
} as const;

export function UseCasePage({ page }: { page: UseCase }) {
  const lang = page.lang ?? "ja";
  const t = T[lang];
  const path = lang === "en" ? `/en/${page.slug}/` : `/${page.slug}/`;
  const links = (lang === "en" ? USE_CASE_LINKS_EN : USE_CASE_LINKS).filter((l) => l.href !== path);
  return (
    <main id="main" className="page-main">
      <JsonLd data={[breadcrumbLd([{ name: "MOTHERSHIP", path: t.home }, { name: page.h1, path }]), faqLd(page.faq, lang)]} />
      <PageHero kicker={page.kicker} title={page.h1}>
        <p className="usecase-lead">{page.lead}</p>
      </PageHero>
      <article className="entry usecase">
        <div className="wrap">
          <figure className="usecase-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.image.src} alt={page.image.alt} width={page.image.width} height={page.image.height} loading="lazy" />
            <figcaption>{page.image.caption}</figcaption>
          </figure>
          <div className="entry-body">
            {page.sections.map((s) => (
              <section key={s.h2}>
                <h2>{s.h2}</h2>
                {/* このサイトのファイル（src/content/usecases*.ts）に書いた HTML だけを出す */}
                <div dangerouslySetInnerHTML={{ __html: s.html }} />
                {s.video && <SetupVideo id={s.video} lang={lang} />}
              </section>
            ))}
            <section>
              <h2>{t.faq}</h2>
              {page.faq.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>
          </div>
          <div className="usecase-cta">
            {page.store ? (
              <a className="btn btn-primary" href={page.store.href} target="_blank" rel="noopener noreferrer">{page.store.label} <span aria-hidden="true">→</span></a>
            ) : (
              <span className="pill pill-soft">{page.soon ?? t.soon}</span>
            )}
            {lang === "en" ? <a className="btn btn-ghost" href={t.hostHref}>{t.host}</a> : <Link className="btn btn-ghost" href={t.hostHref}>{t.host}</Link>}
          </div>
          <nav className="usecase-more" aria-label={t.more}>
            <p>{t.more}</p>
            <ul>
              {links.map((l) => (
                <li key={l.href}>{lang === "en" ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}</li>
              ))}
              <li>{lang === "en" ? <a href={t.home}>{t.top}</a> : <Link href={t.home}>{t.top}</Link>}</li>
            </ul>
          </nav>
        </div>
      </article>
    </main>
  );
}
