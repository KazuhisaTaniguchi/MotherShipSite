import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, faqLd } from "@/lib/seo";
import { USE_CASE_LINKS, type UseCase } from "@/content/usecases";

// 用途別のページの形（お知らせの記事と同じ組み方：見出しの帯＋本文）。中身は src/content/usecases.ts
export function UseCasePage({ page }: { page: UseCase }) {
  const path = `/${page.slug}/`;
  return (
    <main id="main" className="page-main">
      <JsonLd data={[breadcrumbLd([{ name: "MOTHERSHIP", path: "/" }, { name: page.h1, path }]), faqLd(page.faq, "ja")]} />
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
                {/* このサイトのファイル（src/content/usecases.ts）に書いた HTML だけを出す */}
                <div dangerouslySetInnerHTML={{ __html: s.html }} />
              </section>
            ))}
            <section>
              <h2>よくある質問</h2>
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
              <span className="pill pill-soft">Google Playで近日公開</span>
            )}
            <Link className="btn btn-ghost" href="/#download">MOTHERSHIP HOST（Mac用）を入れる</Link>
          </div>
          <nav className="usecase-more" aria-label="ほかの使い方">
            <p>ほかの使い方</p>
            <ul>
              {USE_CASE_LINKS.filter((l) => l.href !== path).map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
              <li><Link href="/">MOTHERSHIPのトップページ</Link></li>
            </ul>
          </nav>
        </div>
      </article>
    </main>
  );
}
