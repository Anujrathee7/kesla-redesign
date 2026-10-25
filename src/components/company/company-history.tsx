import { ArrowUpRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { SectionHeading } from "@/components/home/section-heading";
import type { Locale } from "@/i18n/routing";
import { BOOK_URL, DECADES, type Decade } from "@/lib/company";
import { keslaHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

import photo1960 from "../../../public/images/company-1960.jpg";
import photo1970 from "../../../public/images/company-1970.jpg";
import photo1980 from "../../../public/images/company-1980.jpg";
import photo1990 from "../../../public/images/company-1990.jpg";
import photo2000 from "../../../public/images/company-2000.jpg";
import photo2010 from "../../../public/images/company-2010.jpg";
import photo2020 from "../../../public/images/company-2020.jpg";

const PHOTOS: Record<Decade, StaticImageData> = {
  1960: photo1960,
  1970: photo1970,
  1980: photo1980,
  1990: photo1990,
  2000: photo2000,
  2010: photo2010,
  2020: photo2020,
};

/**
 * History: kesla.com's seven decade chapters as a strip of black and
 * white photos with their titles, then the way on to the full history
 * and the anniversary book.
 */
export async function CompanyHistory() {
  const t = await getTranslations("Company.history");
  const locale = (await getLocale()) as Locale;
  const book = t("book");
  const split = book.lastIndexOf(" ");
  const bookLead = book.slice(0, split);
  const bookLast = book.slice(split + 1);

  return (
    <section id="history" aria-labelledby="history-title" className="scroll-mt-4 bg-black text-on-dark gutter">
      <div className="wrap py-[clamp(56px,8vw,96px)]">
        <SectionHeading
          id="history-title"
          title={t("title")}
          tone="dark"
          link={{ href: keslaHref("history", locale), label: t("all") }}
        />
        <ol className="grid gap-x-[clamp(10px,1.4vw,18px)] min-[561px]:grid-cols-4 min-[561px]:gap-y-7 min-[1101px]:grid-cols-7">
          {DECADES.map((decade, i) => (
            <li
              key={decade}
              className="min-[561px]:block max-[560px]:grid max-[560px]:grid-cols-[72px_4.2em_minmax(0,1fr)] max-[560px]:items-center max-[560px]:gap-3.5 max-[560px]:border-t max-[560px]:border-dark-line max-[560px]:py-2.5 max-[560px]:last:border-b"
            >
              <span
                className={cn(
                  "relative block aspect-square overflow-hidden bg-ink",
                  i === DECADES.length - 1 && "[--cut:18px] min-[561px]:cut",
                )}
              >
                <Image src={PHOTOS[decade]} alt="" fill sizes="(min-width: 1101px) 160px, (min-width: 561px) 25vw, 72px" className="object-cover" />
              </span>
              <span className="block font-display text-[1.375rem] leading-none font-extrabold text-yellow tabular-nums min-[561px]:mt-3.5 min-[561px]:text-[1.625rem]">
                {decade}
              </span>
              <span className="block text-[0.9375rem] leading-[1.35] min-[561px]:mt-1.5">{t(`decades.d${decade}`)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-[560px]:text-base">
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener"
            className="relative font-display font-semibold text-yellow link-wipe [--wipe-color:var(--color-white)] after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']"
          >
            {/* The last word and the arrow never part, so the arrow cannot wrap onto a line of its own. */}
            {bookLead}{" "}
            <span className="whitespace-nowrap">
              {bookLast}
              <ArrowUpRight className="ml-1.5 inline size-4 align-[-2px]" strokeWidth={2.5} aria-hidden="true" />
            </span>
          </a>
        </p>
      </div>
    </section>
  );
}
