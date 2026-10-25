import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/**
 * Kesla's button: Exo caps with one cut corner. Yellow is the action colour,
 * the outline variants sit on black, yellow or white grounds. The cut shape is
 * painted by pseudo-elements (`cut-fill`, `cut-frame`), never clipped onto the
 * button itself, so the focus ring around it stays visible.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2.5 font-display font-bold uppercase tracking-[0.05em] whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ease-out select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        yellow: "cut-fill text-black [--fill:var(--color-yellow)] hover:[--fill:var(--color-yellow-hi)]",
        dark: "cut-fill text-white [--fill:var(--color-black)] hover:[--fill:var(--color-black-hi)]",
        // On a black ground. The inner fill matches the ground and turns white on hover.
        "outline-light":
          "cut-frame text-white [--frame-color:var(--color-white)] [--frame-fill:var(--color-black)] hover:text-black hover:[--frame-fill:var(--color-white)]",
        // On a yellow ground.
        "outline-dark":
          "cut-frame text-black [--frame-color:var(--color-black)] [--frame-fill:var(--color-yellow)] hover:text-yellow hover:[--frame-fill:var(--color-black)]",
        // On a white ground: the same black frame, filled white.
        "outline-ink":
          "cut-frame text-black [--frame-color:var(--color-black)] [--frame-fill:var(--color-white)] hover:text-yellow hover:[--frame-fill:var(--color-black)]",
        ghost: "normal-case tracking-normal text-ink hover:bg-warm",
      },
      size: {
        default: "px-[22px] pt-[15px] pb-[14px] text-[0.9375rem] leading-none",
        sm: "px-4 pt-3 pb-[11px] text-sm leading-none [--cut:10px]",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "yellow",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "yellow",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
