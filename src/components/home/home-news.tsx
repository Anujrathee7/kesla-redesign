import { getLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { KESLA, localHref } from "@/lib/routes";

type Entry = { date: string; title: string; kind: string; path: string };

/** kesla.com writes 15.10.2026 in every language, so this does too. */
function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function List({
  id,
  title,
  all,
  entries,
}: {
  id: string;
  title: string;
  all: { href: string; label: string };
  entries: Entry[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-b-[3px] border-ink pb-3.5">
        <h2 id={id} className="text-[clamp(1.5rem,2.4vw,1.875rem)] font-bold tracking-[0.02em] uppercase">
          {title}
        </h2>
        <a
          href={all.href}
          className="relative font-display text-sm font-semibold text-ink link-wipe pointer-coarse:after:absolute pointer-coarse:after:-inset-x-1 pointer-coarse:after:-inset-y-2.5 pointer-coarse:after:content-['']"
        >
          {all.label}
        </a>
      </div>
      <ul>
        {entries.map((entry) => (
          <li key={entry.path} className="border-b border-line">
            <a
              href={KESLA + entry.path}
              className="group grid items-baseline gap-1 py-4 text-ink sm:grid-cols-[6.6em_minmax(0,1fr)] sm:gap-4"
            >
              <time
                dateTime={entry.date}
                className="font-display text-sm leading-[1.3] font-semibold text-mute tabular-nums"
              >
                {formatDate(entry.date)}
              </time>
              <span className="min-w-0">
                <span className="text-[1.0625rem] leading-[1.4] font-medium decoration-yellow decoration-2 underline-offset-4 group-hover:underline">
                  {entry.title}
                </span>
                <span className="mt-1 block caps text-xs text-mute">{entry.kind}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** News and events side by side, out of the sidebar they were squeezed into. */
export async function HomeNews() {
  const t = await getTranslations("Home.news");
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-label={`${t("news")}, ${t("events")}`} className="gutter">
      <div className="wrap grid gap-[clamp(28px,5vw,72px)] py-[clamp(48px,7vw,88px)] md:grid-cols-2">
        <List
          id="news-title"
          title={t("news")}
          all={{ href: localHref("news", locale), label: t("allNews") }}
          entries={t.raw("newsItems") as Entry[]}
        />
        <List
          id="events-title"
          title={t("events")}
          all={{ href: localHref("news", locale, "fairs"), label: t("allEvents") }}
          entries={t.raw("eventItems") as Entry[]}
        />
      </div>
    </section>
  );
}
