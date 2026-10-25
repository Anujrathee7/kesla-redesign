import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { PhotoHead } from "@/components/site/photo-head";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { dealerName, FACTORY, phonesOf, telHref } from "@/lib/dealers";

import truckPhoto from "../../../public/images/product-2112z-yt-ZFH433GjXiw.jpg";
import { CallButton, SquareLink } from "./contact-actions";

/**
 * The short black head as a Photo Head: breadcrumb, title and Kesla's factory
 * sales on the left, so a buyer with no dealer nearby has a number before
 * they touch the map, and a timber truck at work cut in on the right. Anuj
 * moved the factory strip here from the bottom of the dealer panel
 * (19 October 2026); it moved under the title when the photo came in. The
 * head keeps its short working-head padding with no height floor, and on
 * phones it has no photo strip, so the map and the list stay near the top.
 */
export async function DealersHead() {
  const t = await getTranslations("Dealers");
  const name = dealerName(FACTORY, (await getLocale()) as Locale);
  const [, number] = phonesOf(FACTORY)[0];
  const email = FACTORY.email[0];
  // Kesla's switchboard, not a factory sales line: say so (copy audit DEAL-2).
  const general = t("phoneLabels.general");

  return (
    <PhotoHead
      labelledBy="dealers-title"
      strip="none"
      floor={false}
      padding="pt-[clamp(24px,3vw,40px)] pb-[clamp(28px,3.4vw,44px)]"
      photo={
        <Image
          src={truckPhoto}
          alt={t("imageAlt")}
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1001px) 46vw, 1px"
          className="object-cover object-[50%_40%]"
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
        id="dealers-title"
        className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
      >
        {t("meta.title")}
      </h1>
      <aside
        aria-label={name}
        className="mt-[clamp(18px,2.2vw,26px)] cut-frame grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-1.5 py-3.5 pr-4 pl-[18px] [--cut:16px] [--frame-color:var(--color-dark-line)] [--frame-fill:var(--color-black)] max-[561px]:pr-3 max-[561px]:pl-3.5"
      >
        <div className="min-w-0">
          <p className="font-display text-[1.0625rem] leading-[1.2] font-bold text-white">{t("factory.title")}</p>
          {/* Two deliberate lines: who and where, then which number. The name and
              the town each stay whole, so a narrow box breaks between them. */}
          <p className="mt-0.5 text-sm text-on-dark-mute">
            <span className="whitespace-nowrap">{name},</span>{" "}
            <span className="whitespace-nowrap">{t("factory.where")}</span>
            <span className="block">
              {general}
              {/* The call button hides the number below 561px, so it shows here instead. */}
              <span className="hidden whitespace-nowrap text-on-dark tabular-nums max-[561px]:inline"> {number}</span>
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <CallButton
            href={telHref(number, FACTORY.country)}
            number={number}
            label={t("company.call", { who: `${name}, ${general.toLowerCase()}`, number })}
            className="focus-visible:outline-white"
          />
          {email && (
            <SquareLink
              href={`mailto:${email}`}
              kind="email"
              dark
              label={t("factory.email", { address: email })}
              className="focus-visible:outline-white"
            />
          )}
        </div>
      </aside>
    </PhotoHead>
  );
}
