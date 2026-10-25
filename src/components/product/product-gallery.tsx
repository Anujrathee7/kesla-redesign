"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type GalleryItem = { key: number; src: StaticImageData; alt: string };

const ARROW =
  "absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center transition-colors duration-200 ease-out max-[640px]:size-11";

/**
 * A sideways row of thumbnails. The chosen one is lit with a yellow bar along
 * its bottom; the row scrolls itself so the chosen one is always in view.
 */
function Thumbs({
  photos,
  index,
  onPick,
  label,
  photoLabel,
  className,
}: {
  photos: readonly GalleryItem[];
  index: number;
  onPick: (index: number) => void;
  label: string;
  photoLabel: (n: number) => string;
  className?: string;
}) {
  const row = useRef<HTMLDivElement>(null);

  function pick(next: number) {
    onPick(next);
    reveal(row.current, next);
  }

  return (
    <div
      ref={row}
      role="group"
      aria-label={label}
      className={cn(
        "relative flex snap-x snap-mandatory gap-1.5 overflow-x-auto [scrollbar-color:var(--color-dark-line)_transparent] [scrollbar-width:thin]",
        className,
      )}
    >
      {photos.map((photo, i) => {
        const on = i === index;
        return (
          <button
            key={photo.key}
            type="button"
            aria-pressed={on}
            aria-label={photoLabel(i + 1)}
            onClick={() => pick(i)}
            className="group relative aspect-[7/4] w-28 shrink-0 snap-start overflow-hidden bg-ink focus-visible:outline-offset-[-3px] max-[640px]:w-[92px] after:absolute after:inset-0 after:content-[''] aria-pressed:after:shadow-[inset_0_-4px_0_var(--color-yellow)]"
          >
            <Image
              src={photo.src}
              alt=""
              sizes="112px"
              className={cn(
                "size-full object-cover transition-[opacity,transform] duration-[150ms,600ms] ease-out-expo group-hover:scale-[1.04] group-hover:opacity-100",
                on ? "opacity-100" : "opacity-60",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/** Keep the chosen thumbnail inside the row without moving the page. */
function reveal(row: HTMLElement | null, index: number) {
  const thumb = row?.children[index] as HTMLElement | undefined;
  if (!row || !thumb) return;
  // The row is `relative`, so offsetLeft is measured from its start.
  const left = thumb.offsetLeft;
  if (left < row.scrollLeft || left + thumb.offsetWidth > row.scrollLeft + row.clientWidth) {
    row.scrollLeft = left - 8;
  }
}

/**
 * The big photo with arrows, a "3 / 13" counter and all thirteen photos in a
 * sideways strip under it. Pressing the photo opens the viewer, a modal
 * dialog that shows the same photo full screen; the two share one position.
 */
export function ProductGallery({ photos }: { photos: readonly GalleryItem[] }) {
  const t = useTranslations("Product.gallery");
  const [index, setIndex] = useState(0);
  const [viewing, setViewing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const viewerStrip = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const total = photos.length;
  const photo = photos[index];
  const photoLabel = (n: number) => t("photo", { n, total });

  function go(next: number) {
    const wrapped = (next + total) % total;
    setIndex(wrapped);
    reveal(strip.current?.firstElementChild as HTMLElement | null, wrapped);
    reveal(viewerStrip.current?.firstElementChild as HTMLElement | null, wrapped);
  }

  function open() {
    setViewing(true);
    document.documentElement.style.overflow = "hidden";
    dialog.current?.showModal();
    // The viewer's contents render on the next frame; then focus its close button.
    requestAnimationFrame(() => {
      closeButton.current?.focus();
      reveal(viewerStrip.current?.firstElementChild as HTMLElement | null, index);
    });
  }

  function onClose() {
    setViewing(false);
    document.documentElement.style.overflow = "";
    reveal(strip.current?.firstElementChild as HTMLElement | null, index);
  }

  function onViewerKey(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") go(index + 1);
    else if (event.key === "ArrowLeft") go(index - 1);
  }

  return (
    <div className="min-w-0">
      <div className="relative aspect-[7/4] overflow-hidden bg-ink [--cut:22px] cut">
        <button
          type="button"
          onClick={open}
          aria-label={`${photo.alt}. ${t("open", { n: index + 1, total })}`}
          aria-haspopup="dialog"
          className="block size-full cursor-zoom-in focus-visible:outline-offset-[-3px]"
        >
          <Image
            key={photo.key}
            src={photo.src}
            alt=""
            fill
            priority={index === 0}
            placeholder="blur"
            sizes="(min-width: 1001px) 66vw, 100vw"
            className="object-cover"
          />
        </button>
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label={t("prev")}
          className={cn(ARROW, "left-0 bg-black/72 text-white hover:bg-black hover:text-yellow focus-visible:outline-offset-[-3px]")}
        >
          <ChevronLeft className="size-[18px]" strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label={t("next")}
          className={cn(ARROW, "right-0 bg-black/72 text-white hover:bg-black hover:text-yellow focus-visible:outline-offset-[-3px]")}
        >
          <ChevronRight className="size-[18px]" strokeWidth={2.5} aria-hidden="true" />
        </button>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 bg-black px-3 pt-[9px] pb-2 font-display text-[0.8125rem] leading-none font-bold tracking-[0.04em] text-white tabular-nums"
        >
          {index + 1} / {total}
        </span>
      </div>

      <div ref={strip}>
        <Thumbs
          photos={photos}
          index={index}
          onPick={setIndex}
          label={t("label")}
          photoLabel={photoLabel}
          className="mt-2 pb-2"
        />
      </div>

      <dialog
        ref={dialog}
        aria-label={t("viewer")}
        onClose={onClose}
        onKeyDown={onViewerKey}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 text-on-dark backdrop:bg-black open:grid open:grid-cols-[minmax(0,1fr)] open:grid-rows-[auto_minmax(0,1fr)_auto]"
      >
        {viewing && (
          <>
            <div className="flex items-center justify-between py-1.5 gutter">
              <p aria-live="polite" className="font-display text-sm leading-none font-bold tracking-[0.04em] tabular-nums">
                {photoLabel(index + 1)}
              </p>
              <button
                ref={closeButton}
                type="button"
                onClick={() => dialog.current?.close()}
                aria-label={t("close")}
                className="grid size-11 place-items-center text-white transition-colors hover:text-yellow"
              >
                <X className="size-5" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
            <div className="relative min-h-0 px-[clamp(8px,6vw,96px)]">
              <div className="relative size-full">
                <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" />
              </div>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label={t("prev")}
                className={cn(ARROW, "left-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] bg-yellow text-black hover:bg-yellow-hi focus-visible:outline-white")}
              >
                <ChevronLeft className="size-[18px]" strokeWidth={2.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label={t("next")}
                className={cn(ARROW, "right-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] bg-yellow text-black hover:bg-yellow-hi focus-visible:outline-white")}
              >
                <ChevronRight className="size-[18px]" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
            <div ref={viewerStrip} className="min-w-0 pt-3 pb-[max(14px,env(safe-area-inset-bottom))] gutter">
              <Thumbs
                photos={photos}
                index={index}
                onPick={setIndex}
                label={t("label")}
                photoLabel={photoLabel}
                className="justify-center-safe pb-1"
              />
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
