import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export default function NotFound() {
  return (
    <main id="main" className="page-main">
      <PageHero kicker="404" title="ページが見つかりません" />
      <section className="entry">
        <div className="wrap">
          <p>お探しのページは、移動または削除された可能性があります。</p>
          <Link className="back-link" href="/">← トップページへ</Link>
        </div>
      </section>
    </main>
  );
}
