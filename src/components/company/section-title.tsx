/**
 * A section headline without the "all" link, for sections where the title
 * sits in a column beside the content. A step smaller than `SectionHeading`,
 * as in the mockup, so "Where Kesla is made" holds one line at 1440px.
 */
export function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[clamp(1.75rem,3.2vw,2.75rem)] leading-none font-extrabold uppercase">
      {children}
    </h2>
  );
}
