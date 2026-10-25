"use client";

import { ArrowRight, CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { EMAILS, GENERAL } from "@/lib/contacts";
import { cn } from "@/lib/utils";

type FieldKey = "name" | "company" | "email" | "phone" | "street" | "postcode" | "town" | "country" | "message";

const FIELDS: { key: Exclude<FieldKey, "message">; required?: true; type?: string; autoComplete: string }[] = [
  { key: "name", required: true, autoComplete: "name" },
  { key: "company", required: true, autoComplete: "organization" },
  { key: "email", required: true, type: "email", autoComplete: "email" },
  { key: "phone", type: "tel", autoComplete: "tel" },
  { key: "street", autoComplete: "street-address" },
  { key: "postcode", autoComplete: "postal-code" },
  { key: "town", autoComplete: "address-level2" },
  { key: "country", required: true, autoComplete: "country-name" },
];

/* On white: fields outlined in line-strong like the service point search, focus an ink inset plus the yellow ring, an error a 2px ink inset. */
const LABEL = "mb-1.5 block font-display text-sm leading-[1.2] font-semibold text-ink";
const INPUT =
  "min-h-11 w-full rounded-none bg-white px-3 pt-[11px] pb-2.5 text-base leading-[1.4] text-ink caret-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] focus:shadow-[inset_0_0_0_1px_var(--color-ink),0_0_0_3px_var(--color-yellow)] focus:outline-none aria-[invalid=true]:shadow-[inset_0_0_0_2px_var(--color-ink)] aria-[invalid=true]:focus:shadow-[inset_0_0_0_2px_var(--color-ink),0_0_0_3px_var(--color-yellow)]";

function Required() {
  return (
    <span aria-hidden="true" className="ml-1 font-bold text-ink">
      *
    </span>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm leading-[1.35] font-medium text-ink">
      <CircleAlert className="mt-px size-4 shrink-0 fill-yellow text-ink" strokeWidth={2.2} aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * kesla.com's contact request form, with its real fields, labels and
 * required marks. The concept site has nowhere to send it, so a valid submit
 * says so and gives Kesla's real sales address and number instead of a
 * success message. What the visitor typed stays in the form.
 */
export function ContactForm() {
  const t = useTranslations("Contacts.form");
  const products = t.raw("productList") as string[];
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey | "products", string>>>({});
  const [sent, setSent] = useState(false);

  function validate(data: FormData) {
    const found: Partial<Record<FieldKey | "products", string>> = {};
    for (const field of FIELDS) {
      const value = String(data.get(field.key) ?? "").trim();
      if (field.required && !value) found[field.key] = t("errors.required", { field: t(field.key) });
    }
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.email = t("errors.email");
    if (data.getAll("products").length === 0) found.products = t("errors.products");
    if (!String(data.get("message") ?? "").trim()) found.message = t("errors.required", { field: t("message") });
    return found;
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(new FormData(event.currentTarget));
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      setSent(false);
      const target =
        first === "products"
          ? form.current?.querySelector<HTMLInputElement>('input[name="products"]')
          : form.current?.querySelector<HTMLElement>(`#contact-${first}`);
      target?.focus();
      return;
    }
    setSent(true);
  }

  /** Clears a field's error as soon as it is fixed. */
  function revalidate(key: FieldKey | "products") {
    if (!errors[key] || !form.current) return;
    const found = validate(new FormData(form.current));
    if (found[key]) return;
    setErrors((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  const described = (key: FieldKey | "products") => (errors[key] ? `contact-${key}-error` : undefined);

  return (
    <form ref={form} noValidate onSubmit={submit} className="grid gap-x-[18px] gap-y-4 min-[721px]:grid-cols-2">
      <p className="text-sm text-mute min-[721px]:col-span-2">
        {t.rich("required", { star: (c) => <span className="font-bold text-ink">{c}</span> })}
      </p>

      {FIELDS.map(({ key, required, type, autoComplete }) => (
        <div key={key} className="min-w-0">
          <label htmlFor={`contact-${key}`} className={LABEL}>
            {t(key)}
            {required && <Required />}
          </label>
          <input
            id={`contact-${key}`}
            name={key}
            type={type ?? "text"}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={errors[key] ? true : undefined}
            aria-describedby={described(key)}
            onChange={() => revalidate(key)}
            className={INPUT}
          />
          {errors[key] && <ErrorText id={`contact-${key}-error`}>{errors[key]}</ErrorText>}
        </div>
      ))}

      <fieldset aria-describedby={described("products")} className="min-w-0 min-[721px]:col-span-2">
        <legend className={LABEL}>
          {t("products")}
          <Required />
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {products.map((product) => (
            <label
              key={product}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 px-3 pt-[9px] pb-2 text-[0.9375rem] leading-none font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] outline-offset-2 transition-colors duration-200 ease-out hover:shadow-[inset_0_0_0_1px_var(--color-ink)] has-checked:bg-yellow has-checked:text-black has-checked:shadow-none has-focus-visible:outline-3 has-focus-visible:outline-ink has-focus-visible:outline-solid"
            >
              <input
                type="checkbox"
                name="products"
                value={product}
                onChange={() => revalidate("products")}
                className="size-4 shrink-0 accent-ink focus-visible:outline-none"
              />
              {product}
            </label>
          ))}
        </div>
        {errors.products && <ErrorText id="contact-products-error">{errors.products}</ErrorText>}
      </fieldset>

      <div className="min-w-0 min-[721px]:col-span-2">
        <label htmlFor="contact-message" className={LABEL}>
          {t("message")}
          <Required />
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={described("message")}
          onChange={() => revalidate("message")}
          className={cn(INPUT, "min-h-[120px] resize-y")}
        />
        {errors.message && <ErrorText id="contact-message-error">{errors.message}</ErrorText>}
      </div>

      <div className="flex flex-col items-start min-[721px]:col-span-2">
        <Button type="submit" className="focus-visible:outline-ink max-[721px]:min-h-12">
          {t("send")}
          <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
        </Button>
        <div role="status" className="w-full">
          {sent && (
            <p className="cut-frame mt-4 w-full px-4 pt-3.5 pb-3 text-ink [--cut:14px] [--frame-color:var(--color-line-strong)] [--frame-fill:var(--color-white)] [&_a]:text-ink [&_a]:underline [&_a]:decoration-yellow [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-[3px]">
              {t.rich("concept", {
                mail: (c) => <a href={`mailto:${EMAILS.sales}`}>{c}</a>,
                tel: (c) => (
                  <a href={GENERAL.href} className="whitespace-nowrap tabular-nums">
                    {c}
                  </a>
                ),
              })}
            </p>
          )}
          {!sent && Object.keys(errors).length > 0 && (
            <p className="mt-4 text-sm font-medium text-ink">{t("errors.summary")}</p>
          )}
        </div>
      </div>
    </form>
  );
}
