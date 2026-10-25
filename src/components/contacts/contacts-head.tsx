import { ChevronRight, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { PhotoHead } from "@/components/site/photo-head";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SPARE_PARTS } from "@/lib/contacts";

import servicePhoto from "../../../public/images/contacts-service.jpg";

/**
 * The black head, "Three doors": breadcrumb, title and Kesla's spare part
 * sales on the left (the number large, Call and Write under it, then hours,
 * email, fax and address), and a workshop photo on the right: a Photo Head
 * (`PhotoHead`), like Products. At 1000px and below the photo becomes a short
 * strip under the text with a slanted top edge.
 * No open-now line, Anuj's call (19 October 2026). The title is "Contacts" and
 * the "Spare part sales" heading shows as the label over the number (copy
 * audit CONT-1, same day).
 */
export async function ContactsHead() {
  const t = await getTranslations("Contacts");
  const locale = (await getLocale()) as Locale;
  const number = SPARE_PARTS.phone[locale];

  const facts = [
    { key: "open", label: t("parts.open"), value: t("parts.hours") },
    { key: "email", label: t("parts.email"), value: SPARE_PARTS.email },
    { key: "fax", label: t("parts.fax"), value: SPARE_PARTS.fax },
    { key: "address", label: t("parts.address"), value: SPARE_PARTS.address },
  ];

  return (
    <PhotoHead
      labelledBy="contacts-title"
      strip="short"
      padding="pt-[clamp(30px,4vw,52px)] pb-[26px] min-[1001px]:pb-[clamp(30px,4vw,48px)]"
      photo={
        <Image
          src={servicePhoto}
          alt={t("imageAlt")}
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1001px) 46vw, 100vw"
          className="object-cover object-[40%_60%]"
        />
      }
    >
      <nav aria-label={t("breadcrumb.label")}>
        <ol className="mb-3 flex items-center gap-2 font-display text-lg leading-[1.2] font-semibold text-on-dark">
          <li className="flex items-center gap-2">
            <Link
              href="/"
              className="relative text-on-dark-mute transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-yellow"
            >
              {t("breadcrumb.home")}
            </Link>
            <ChevronRight className="size-3 shrink-0 text-on-dark-mute" strokeWidth={2.5} aria-hidden="true" />
          </li>
          <li aria-current="page">{t("breadcrumb.current")}</li>
        </ol>
      </nav>
      <h1
        id="contacts-title"
        className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
      >
        {t("title")}
      </h1>

      <div id="parts" className="mt-[clamp(26px,3.2vw,44px)] scroll-mt-4">
        <h2 className="caps mb-2.5 text-sm text-on-dark-mute">{t("parts.label")}</h2>
        <p className="font-display text-[clamp(1.9375rem,4.4vw,3.75rem)] leading-none font-extrabold tracking-[-0.01em] whitespace-nowrap text-white tabular-nums select-all">
          {number}
        </p>
        <div className="mt-[18px] flex flex-wrap gap-3">
          <Button asChild className="focus-visible:outline-white max-[721px]:flex-auto max-[721px]:px-3.5">
            <a href={SPARE_PARTS.phone.href}>
              <Phone className="fill-current" strokeWidth={0} aria-hidden="true" />
              {t("parts.call")}
            </a>
          </Button>
          <Button asChild variant="outline-light" className="max-[721px]:flex-auto max-[721px]:px-3.5">
            <a
              href={`mailto:${SPARE_PARTS.email}`}
              aria-label={t("parts.writeLabel", { address: SPARE_PARTS.email })}
            >
              <Mail strokeWidth={2.2} aria-hidden="true" />
              {t("parts.write")}
            </a>
          </Button>
        </div>
        <dl className="mt-[22px] grid grid-cols-2 gap-x-6 border-t border-dark-line max-[721px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] max-[721px]:gap-x-4">
          {facts.map(({ key, label, value }) => (
            <div key={key} className="min-w-0 border-b border-dark-line pt-2.5 pb-[9px]">
              <dt className="caps text-xs text-on-dark-mute">{label}</dt>
              <dd className="mt-1 text-base leading-[1.35] text-on-dark tabular-nums [overflow-wrap:anywhere] max-[721px]:text-[0.9375rem]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </PhotoHead>
  );
}
