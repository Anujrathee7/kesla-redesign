import { cn } from "@/lib/utils";

/**
 * Layout classes per breakpoint. The head splits at 1001px like every other
 * page head; Products splits at 901px because its picker cards change layout
 * at 900px. Tailwind only sees whole class strings, so each split is spelled
 * out in full.
 */
const SPLIT = {
  1001: {
    head: "min-[1001px]:min-h-[clamp(340px,27vw,400px)]",
    text: "min-[1001px]:max-w-[calc(54%-40px)]",
    ground:
      "min-[1001px]:absolute min-[1001px]:inset-y-0 min-[1001px]:right-0 min-[1001px]:mr-0 min-[1001px]:ml-0 min-[1001px]:h-auto min-[1001px]:w-[46%] min-[1001px]:origin-bottom-left min-[1001px]:[clip-path:none] min-[1001px]:[transform:skewX(-20.5deg)]",
    photo:
      "min-[1001px]:top-0 min-[1001px]:left-3.5 min-[1001px]:[clip-path:none]",
    upright: "min-[1001px]:origin-bottom-left min-[1001px]:[transform:skewX(20.5deg)]",
    hidden: "max-[1001px]:hidden",
  },
  901: {
    head: "min-[901px]:min-h-[clamp(340px,27vw,400px)]",
    text: "min-[901px]:max-w-[calc(54%-40px)]",
    ground:
      "min-[901px]:absolute min-[901px]:inset-y-0 min-[901px]:right-0 min-[901px]:mr-0 min-[901px]:ml-0 min-[901px]:h-auto min-[901px]:w-[46%] min-[901px]:origin-bottom-left min-[901px]:[clip-path:none] min-[901px]:[transform:skewX(-20.5deg)]",
    photo:
      "min-[901px]:top-0 min-[901px]:left-3.5 min-[901px]:[clip-path:none]",
    upright: "min-[901px]:origin-bottom-left min-[901px]:[transform:skewX(20.5deg)]",
    hidden: "max-[901px]:hidden",
  },
} as const;

/** How tall the photo strip is once the head stacks, or no strip at all. */
const STRIP = {
  tall: "h-[clamp(200px,46vw,300px)]",
  short: "h-[clamp(140px,34vw,260px)] max-[721px]:h-[130px]",
  none: "",
} as const;

/** The default head padding, shared with the Company and Career heads so the heads line up. */
export const HEAD_PADDING = "pt-[clamp(32px,4vw,56px)] pb-[clamp(36px,5vw,64px)]";

/**
 * The Photo Head (DESIGN.md, Page Heads and The Closed Shear Rule): the black
 * head with its text in the left 54% and a real photo bled across the right
 * 46% to the viewport edge, cut in on its left edge at a fixed 20.5 degrees
 * over a yellow ground that shows as a 14px edge strip. When the head stacks,
 * the photo becomes a full-bleed strip under the text with its top edge
 * slanting 18px down to the left over an 8px yellow edge, or drops out
 * (`strip="none"`) where the page's job sits right under the head.
 *
 * The cut is a skewX on the yellow ground, from its bottom-left corner, so
 * it leans by the same angle whatever the head's height or width; a share of
 * the width would lean a short head far harder than a tall one. The photo
 * frame sits 14px in and inherits the skew, so the yellow edge keeps one
 * thickness, and an inner layer skews back so the photo stays upright. The
 * skewed ground runs past the viewport at the top right, where the head's
 * `overflow-hidden` trims it.
 *
 * Above the split the head is at least clamp(340px, 27vw, 400px) tall, so
 * the photo has room; the Dealers and News heads turn the floor off.
 *
 * `photo` is one or more `next/image` elements with `fill`; `caption` sits
 * bottom right on the photo over a dark gradient; `after` renders below the
 * black part, so the photo never covers it (no head uses it since the News
 * and article brand bands went, 20 October 2026).
 */
export function PhotoHead({
  as: Tag = "section",
  labelledBy,
  children,
  photo,
  caption,
  shade = false,
  split = 1001,
  strip = "tall",
  padding = HEAD_PADDING,
  floor = true,
  after,
}: {
  as?: "section" | "header" | "div";
  labelledBy?: string;
  /** The text column: breadcrumb, H1, intro, actions. */
  children: React.ReactNode;
  photo: React.ReactNode;
  caption?: React.ReactNode;
  /** A 55% black gradient rising from the bottom of the photo. */
  shade?: boolean;
  split?: keyof typeof SPLIT;
  strip?: keyof typeof STRIP;
  /** Padding of the text column's wrap. */
  padding?: string;
  /** The minimum head height above the split. Off for a working head that must stay short. */
  floor?: boolean;
  after?: React.ReactNode;
}) {
  const s = SPLIT[split];
  const Frame = caption ? "figure" : "div";

  return (
    <Tag aria-labelledby={labelledBy}>
      <div className={cn("relative overflow-hidden bg-black text-on-dark gutter", floor && s.head)}>
        <div className={cn("relative z-10 wrap", padding)}>
          <div className={s.text}>{children}</div>
        </div>

        <div
          className={cn(
            "relative -mr-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] -ml-[max(clamp(16px,4vw,40px),env(safe-area-inset-left,0px))] bg-yellow [clip-path:polygon(0_18px,100%_0,100%_100%,0_100%)]",
            STRIP[strip],
            strip === "none" && s.hidden,
            s.ground,
          )}
        >
          <Frame
            className={cn(
              "absolute inset-x-0 top-2 bottom-0 m-0 overflow-hidden bg-ink [clip-path:polygon(0_18px,100%_0,100%_100%,0_100%)]",
              s.photo,
            )}
          >
            <div
              className={cn(
                "absolute inset-0",
                (shade || caption) &&
                  "after:absolute after:inset-0 after:bg-[linear-gradient(0deg,rgb(10_10_10/0.55)_0%,rgb(10_10_10/0)_45%)] after:content-['']",
                s.upright,
              )}
            >
              {photo}
              {caption && (
                <figcaption className="absolute right-[max(clamp(16px,4vw,40px),env(safe-area-inset-right,0px))] bottom-3 z-10 font-display text-sm leading-[1.2] font-semibold tracking-[0.04em] text-white">
                  {caption}
                </figcaption>
              )}
            </div>
          </Frame>
        </div>
      </div>
      {after}
    </Tag>
  );
}
