import { ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import { PhotoHead } from "@/components/site/photo-head";
import { Link } from "@/i18n/navigation";
import { FAMILY_KEYS, type FamilyKey } from "@/lib/routes";

import cranesPhoto from "../../../public/images/hero-truck-crane.jpg";
import loggingPhoto from "../../../public/images/c-logging.jpg";
import tractorPhoto from "../../../public/images/c-tractor.jpg";
import { FamilyPhoto } from "./family-selection";

const PHOTOS: Record<FamilyKey, StaticImageData> = {
  cranes: cranesPhoto,
  logging: loggingPhoto,
  tractor: tractorPhoto,
};

/**
 * The black page head as a Photo Head: breadcrumb, title and intro on the
 * left, and a photo of the chosen base machine on the right, cut in at the
 * logo block's angle over a yellow edge. The three photos are stacked and
 * cross-fade on a pick. It splits at 901px, where the picker cards below
 * change layout, and keeps a deep bottom padding for the cards to overlap.
 */
export async function ProductsHead() {
  const t = await getTranslations("Products");

  return (
    <PhotoHead
      labelledBy="products-title"
      split={901}
      shade
      padding="pt-[clamp(32px,4vw,56px)] pb-7 min-[901px]:pb-[clamp(88px,10vw,128px)]"
      photo={FAMILY_KEYS.map((key) => (
        <FamilyPhoto key={key} family={key}>
          <Image
            src={PHOTOS[key]}
            alt={t(`families.${key}.imageAlt`)}
            fill
            priority={key === "cranes"}
            placeholder="blur"
            sizes="(min-width: 901px) 46vw, 100vw"
            className="object-cover"
          />
        </FamilyPhoto>
      ))}
    >
      <nav aria-label={t("breadcrumb.label")}>
        <ol className="mt-[18px] mb-[18px] flex items-center gap-2 font-display text-lg leading-[1.2] font-semibold text-on-dark">
          <li className="flex items-center gap-2">
            <Link
              href="/"
              className="relative text-on-dark-mute transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-yellow"
            >
              {t("breadcrumb.home")}
            </Link>
            <ChevronRight className="size-3 shrink-0 text-on-dark-mute" strokeWidth={2.5} aria-hidden="true" />
          </li>
          <li aria-current="page">{t("title")}</li>
        </ol>
      </nav>
      <h1
        id="products-title"
        className="text-[clamp(2.625rem,5.6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.015em] text-white uppercase"
      >
        {t("title")}
      </h1>
      <p className="mt-[18px] max-w-[52ch] text-lg text-on-dark">{t("intro")}</p>
    </PhotoHead>
  );
}
