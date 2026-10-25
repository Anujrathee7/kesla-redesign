import Image from "next/image";
import { getTranslations } from "next-intl/server";

import dealerPhoto from "../../../public/images/product-2112z-dealer.jpg";
import { ProductDealerList } from "./product-dealer-list";

/**
 * "Ask a dealer for an offer": the page ends at a person. The heading, a
 * line on how Kesla sells and a photo on the left; the country picker and
 * that country's crane dealers on the right.
 */
export async function ProductDealers() {
  const t = await getTranslations("Product.dealers");

  return (
    <section id="dealers" aria-labelledby="product-dealers-title" className="scroll-mt-4 gutter">
      <div className="wrap grid items-start gap-x-[clamp(28px,5vw,72px)] gap-y-7 pt-[clamp(8px,2vw,24px)] pb-[clamp(56px,8vw,104px)] min-[1001px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <h2
            id="product-dealers-title"
            className="text-[clamp(1.75rem,3.2vw,2.625rem)] leading-none font-extrabold uppercase"
          >
            {t("title")}
          </h2>
          <p className="mt-3 max-w-[40ch]">{t("body")}</p>
          <Image
            src={dealerPhoto}
            alt=""
            placeholder="blur"
            sizes="(min-width: 1001px) 33vw, 100vw"
            className="mt-6 aspect-[2/1] w-full object-cover [--cut:22px] cut max-[1000px]:max-w-[480px]"
          />
        </div>
        <ProductDealerList />
      </div>
    </section>
  );
}
