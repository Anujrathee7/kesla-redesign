"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * EN / FI as two pressed-state buttons, the way kesla.com's flag menu
 * should have been. Keeps the current path and swaps only the locale.
 */
export function LanguageSwitch({ className }: { className?: string }) {
  const t = useTranslations("Common.language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next, scroll: false });
    });
  }

  return (
    <div role="group" aria-label={t("label")} className={cn("inline-flex border border-line", className)}>
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={code === locale}
          aria-label={t(code)}
          disabled={isPending}
          onClick={() => switchTo(code)}
          className="px-2.5 pt-2 pb-[7px] font-display text-[0.8125rem] leading-none font-bold text-mute uppercase transition-colors hover:text-ink aria-pressed:bg-ink aria-pressed:text-white"
        >
          {code}
        </button>
      ))}
    </div>
  );
}
