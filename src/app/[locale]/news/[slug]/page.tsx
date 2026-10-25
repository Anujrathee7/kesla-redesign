import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { HomeMedia } from "@/components/home/home-media";
import { ArticleBody, ArticleHead } from "@/components/news/article-parts";
import { routing, type Locale } from "@/i18n/routing";
import { pair } from "@/lib/news";
import { ARTICLE_SLUGS, ARTICLES } from "@/lib/news-articles";
import { NEWS } from "@/lib/news-data";

type ArticlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Only the articles the redesign renders exist; any other slug is a 404 from
 * `find`. (`dynamicParams` is not allowed with `cacheComponents`.)
 */
export function generateStaticParams() {
  return ARTICLE_SLUGS.map((slug) => ({ slug }));
}

function find(slug: string) {
  const article = ARTICLES[slug];
  const item = article ? NEWS.find((entry) => entry.slug === article.source) : undefined;
  return article && item ? { article, item } : null;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale: Locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const found = find(slug);
  if (!found) return {};

  return {
    title: pair(found.article.title, locale),
    description: pair(found.article.lead, locale),
  };
}

/**
 * A release as its own page, "For buyers": it opens like a product page,
 * with the release's figures at a glance and links to each model, so a buyer
 * reading about a launch is one click from the machine or a dealer.
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const found = find(slug);
  if (!found) notFound();
  const { article, item } = found;

  return (
    <>
      <article>
        <ArticleHead article={article} item={item} locale={locale} />
        <ArticleBody article={article} locale={locale} />
      </article>
      <HomeMedia />
    </>
  );
}
