import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CRANE_COUNTRIES, craneDealersOf } from "@/lib/product-dealers";

import dealerImage from "../../../public/images/timber-dealer.jpg";
import { TimberDealerList } from "./timber-dealer-list";

/** The intro's counts, from the same source as the list below it. */
const DEALER_TOTAL = CRANE_COUNTRIES.reduce((sum, code) => sum + craneDealersOf(code).length, 0);
const COUNTRY_TOTAL = CRANE_COUNTRIES.length;

/** Caps the heading where its longest word fits the column, like the head's title ("PUUTAVARANOSTURIEN"). */
function titleSize(title: string): string {
  const longest = Math.max(...title.split(/\s+/).map((word) => word.length));
  return `min(clamp(1.75rem, 3.2vw, 2.625rem), calc(100cqi / ${(longest * 0.66).toFixed(2)}))`;
}

/** Every page ends at a person: the timber crane dealers by country. */
export async function TimberDealers() {
  const t = await getTranslations("TimberCranes.dealers");
  const title = t("title");

  return (
    <section id="dealers" aria-labelledby="dealers-title" className="scroll-mt-4 gutter">
      <div className="wrap grid items-start gap-x-[clamp(28px,5vw,72px)] gap-y-7 py-[clamp(40px,5.5vw,72px)] min-[1001px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div className="@container">
          <h2 id="dealers-title" className="leading-none font-extrabold uppercase" style={{ fontSize: titleSize(title) }}>
            {title}
          </h2>
          <p className="mt-3 max-w-[40ch]">
            {t("intro", { dealers: DEALER_TOTAL, countries: COUNTRY_TOTAL })}
          </p>
          <Image
            src={dealerImage}
            alt=""
            sizes="(min-width: 1001px) 33vw, 100vw"
            className="mt-6 aspect-[2/1] w-full object-cover [--cut:22px] cut"
          />
        </div>
        <TimberDealerList />
      </div>
    </section>
  );
}
