import { ChevronRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { GALLERY, GALLERY_ALT, pick, type GalleryPhoto } from "@/lib/product-2112z";
import { localHref, timberCranesHref } from "@/lib/routes";

import g01 from "../../../public/images/product-2112z-01.jpg";
import g02 from "../../../public/images/product-2112z-02.jpg";
import g03 from "../../../public/images/product-2112z-03.jpg";
import g04 from "../../../public/images/product-2112z-04.jpg";
import g05 from "../../../public/images/product-2112z-05.jpg";
import g06 from "../../../public/images/product-2112z-06.jpg";
import g07 from "../../../public/images/product-2112z-07.jpg";
import g08 from "../../../public/images/product-2112z-08.jpg";
import g09 from "../../../public/images/product-2112z-09.jpg";
import g10 from "../../../public/images/product-2112z-10.jpg";
import g11 from "../../../public/images/product-2112z-11.jpg";
import g12 from "../../../public/images/product-2112z-12.jpg";
import g13 from "../../../public/images/product-2112z-13.jpg";
import { OfferCard } from "./offer-card";
import { ProductGallery, type GalleryItem } from "./product-gallery";

const PHOTOS: Record<GalleryPhoto, StaticImageData> = {
  1: g01,
  2: g02,
  3: g03,
  4: g04,
  5: g05,
  6: g06,
  7: g07,
  8: g08,
  9: g09,
  10: g10,
  11: g11,
  12: g12,
  13: g13,
};

const CRUMB_LINK =
  "relative text-on-dark-mute transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-yellow";

/**
 * "Black head": one full-width black band holding the photos and the offer
 * card side by side, under a breadcrumb that walks back through the category
 * and the family. At 1000px and below the card drops under the photos.
 */
export async function ProductHead() {
  const t = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;
  const products = localHref("products", locale);

  const photos: GalleryItem[] = GALLERY.map((key) => ({
    key,
    src: PHOTOS[key],
    alt: pick(GALLERY_ALT[key], locale),
  }));

  const trail = [
    { href: "/", label: t("breadcrumb.home"), internal: true },
    { href: products, label: t("breadcrumb.products") },
    { href: localHref("products", locale, "cranes"), label: t("breadcrumb.cranes") },
    { href: timberCranesHref(locale), label: t("breadcrumb.timber") },
  ];

  return (
    <section aria-labelledby="product-title" className="bg-black text-on-dark gutter">
      <div className="wrap pt-[clamp(20px,2.6vw,32px)] pb-[clamp(36px,4.4vw,56px)]">
        <nav aria-label={t("breadcrumb.label")}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-sm leading-[1.2] font-semibold text-on-dark">
            {trail.map((item) => (
              <li key={item.href} className="flex items-center gap-2 whitespace-nowrap">
                {item.internal ? (
                  <Link href={item.href} className={CRUMB_LINK}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className={CRUMB_LINK}>
                    {item.label}
                  </a>
                )}
                <ChevronRight className="size-3 shrink-0 text-on-dark-mute" strokeWidth={2.5} aria-hidden="true" />
              </li>
            ))}
            <li aria-current="page">{t("breadcrumb.current")}</li>
          </ol>
        </nav>

        <div className="mt-5 grid items-start gap-x-[clamp(28px,4vw,56px)] gap-y-8 min-[1001px]:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <ProductGallery photos={photos} />
          <OfferCard />
        </div>
      </div>
    </section>
  );
}
