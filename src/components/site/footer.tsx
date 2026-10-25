import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { EXTERNAL, FAMILY_KEYS, keslaHref, localHref } from "@/lib/routes";

import { SOCIAL_KEYS, SOCIAL_NAMES } from "./social-icons";

const linkClass = "text-on-dark transition-colors hover:text-yellow";
/** The legal row's links are 20px of text: on touch an ::after grows the target to 44px without moving the row. */
const LEGAL_TOUCH =
  "relative pointer-coarse:after:absolute pointer-coarse:after:-inset-x-1 pointer-coarse:after:-inset-y-3 pointer-coarse:after:content-['']";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3.5 caps text-yellow">{title}</h2>
      <ul className="flex flex-col gap-2 text-[0.9375rem]">{children}</ul>
    </div>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("Common");
  const locale = (await getLocale()) as Locale;

  return (
    <footer className="bg-black text-on-dark-mute">
      <div className="gutter">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-8 pt-14 pb-10 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Image src="/images/logo-kesla-invert.svg" alt="Kesla" width={164} height={34} className="h-auto w-[140px]" />
            <p className="mt-4 max-w-[30ch] text-[0.9375rem]">{t("footer.about")}</p>
          </div>

          <Column title={t("footer.products")}>
            {FAMILY_KEYS.map((key) => (
              <li key={key}>
                <a className={linkClass} href={localHref("products", locale, key)}>
                  {t(`families.${key}.name`)}
                </a>
              </li>
            ))}
            <li>
              <a className={linkClass} href={EXTERNAL.defence}>
                KESLA Defence
              </a>
            </li>
          </Column>

          <Column title={t("footer.kesla")}>
            <li><a className={linkClass} href={localHref("company", locale)}>{t("footer.company")}</a></li>
            <li><a className={linkClass} href={localHref("career", locale)}>{t("footer.career")}</a></li>
            <li><a className={linkClass} href={localHref("references", locale)}>{t("footer.references")}</a></li>
            <li><a className={linkClass} href={localHref("news", locale)}>{t("footer.news")}</a></li>
          </Column>

          <Column title={t("footer.contact")}>
            <li><a className={linkClass} href={localHref("contacts", locale)}>{t("footer.factory")}</a></li>
            <li><a className={linkClass} href={localHref("dealers", locale)}>{t("footer.dealers")}</a></li>
            <li>
              <a className={linkClass} href={localHref("spareParts", locale)}>{t("footer.spareParts")}</a>{" "}
              <a className={`${linkClass} whitespace-nowrap tabular-nums`} href="tel:+358407092208">040 709 2208</a>
            </li>
            <li><a className={linkClass} href={EXTERNAL.extranet}>{t("footer.extranet")}</a></li>
          </Column>

          <Column title={t("footer.follow")}>
            {SOCIAL_KEYS.map((key) => (
              <li key={key}>
                <a className={linkClass} href={EXTERNAL[key]} target="_blank" rel="noopener">
                  {SOCIAL_NAMES[key]}
                </a>
              </li>
            ))}
          </Column>
        </div>
      </div>
      <div className="gutter">
        <div className="wrap flex flex-wrap gap-x-6 gap-y-2 border-t border-dark-line pt-5 pb-[max(20px,env(safe-area-inset-bottom))] text-sm">
          <span className="mr-auto">{t("footer.legal")}</span>
          <span>{t("concept")}</span>
          <a className={`${linkClass} ${LEGAL_TOUCH}`} href={keslaHref("privacy", locale)}>{t("footer.privacy")}</a>
          <a className={`${linkClass} ${LEGAL_TOUCH}`} href={keslaHref("terms", locale)}>{t("footer.terms")}</a>
        </div>
      </div>
    </footer>
  );
}
