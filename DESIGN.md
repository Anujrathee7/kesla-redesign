---
name: Kesla
description: Kesla's own brand, kept and cleaned up. White pages cut by black bands, yellow for action, Exo caps and one cut corner.
colors:
  yellow: "#feb825"
  yellow-hi: "#ffcb55"
  black: "#121212"
  black-hi: "#2a2a2a"
  ink: "#1a1a1a"
  grey: "#575757"
  mute: "#6e6e6e"
  white: "#ffffff"
  paper: "#f7f7f7"
  warm: "#f0efec"
  line: "#dedcd6"
  line-strong: "#949189"
  on-dark: "#eceae5"
  on-dark-mute: "#aba8a1"
  dark-line: "#34332f"
  map: "#3b3a36"
typography:
  display:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 5.2vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.875rem, 3.4vw, 2.875rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.7vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  band:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(0.9375rem, 1.6vw, 1.1875rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.06em"
  band-title:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 4.4vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  nav:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
  nav-wide:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
  button:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.05em"
  label:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  chip:
    fontFamily: "Exo 2, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1
  body:
    fontFamily: "Hind, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "Hind, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  wrap: "1240px"
  section-y: "clamp(56px, 8vw, 104px)"
  heading-gap: "clamp(24px, 3vw, 40px)"
  grid-gap: "clamp(16px, 2.4vw, 32px)"
  row-y: "14px"
components:
  button-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "15px 22px 14px"
  button-yellow-hover:
    backgroundColor: "{colors.yellow-hi}"
  button-dark:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "15px 22px 14px"
  button-dark-hover:
    backgroundColor: "{colors.black-hi}"
  button-outline-light:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "15px 22px 14px"
  button-outline-light-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
  button-outline-dark:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "15px 22px 14px"
  button-outline-dark-hover:
    backgroundColor: "{colors.black}"
    textColor: "{colors.yellow}"
  button-outline-ink:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "15px 22px 14px"
  button-outline-ink-hover:
    backgroundColor: "{colors.black}"
    textColor: "{colors.yellow}"
  button-sm:
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "12px 16px 11px"
  language-switch-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    padding: "8px 10px 7px"
  language-switch:
    backgroundColor: "{colors.white}"
    textColor: "{colors.mute}"
    typography: "{typography.label}"
    padding: "8px 10px 7px"
  picker-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 20px 22px"
  picker-card-selected:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
  model-chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.chip}"
    rounded: "{rounded.none}"
    padding: "8px 10px 7px"
  social-chip:
    backgroundColor: "{colors.black}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
    padding: "11px 14px 10px"
  call-button:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    typography: "{typography.chip}"
    rounded: "{rounded.none}"
    height: "40px"
    width: "188px"
  call-button-hover:
    backgroundColor: "{colors.yellow-hi}"
  search-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "48px"
  play-badge:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    rounded: "{rounded.full}"
    size: "84px"
---

# Design System: Kesla

## Overview

**Creative North Star: "The Machine Shop Sign"**

This is Kesla's own established brand, kept on purpose and cleaned up rather than replaced. It reads like the painted sign and the machine itself: a black and yellow working palette, heavy uppercase Exo headings, and one clipped corner taken from the steel plate of a crane. White pages carry the reading, full-bleed black bands carry the story and the media, and yellow is spent only where something can be pressed, has been chosen, or must be noticed.

Density is moderate and orderly. Content sits in a 1240px column with generous section padding, and lists are ruled with hairlines instead of boxed into cards, so a family, a fact or a news item reads as a row in a catalogue, not a tile in a grid. Photography is real Kesla machinery, full bleed or cut-cornered, never decorated.

Motion is mechanical and short. One exponential ease-out moves photos, chevrons and link underlines on hover, the header nav wipes a yellow bar in from the left, a chosen product family cross-fades its head photo, and nothing moves on load.

**Key Characteristics:**
- White pages cut by full-bleed black bands, yellow for action, selection and emphasis.
- Exo 2 extra-bold uppercase headings over a humanist Hind body.
- One cut corner, bottom right, on panels, photos, cards and buttons. Everything else is square.
- A small, closed set of sheared edges near the logo block's lean: the logo block, the slanted yellow bands and the cut-in photo of every Photo Head (Products, Timber cranes, Dealers, News, the news article, Contacts).
- Every page opens on a black head with a breadcrumb and one H1, and nothing sits above a heading but the breadcrumb.
- Ruled lists with hairline dividers instead of cards.
- Hover is a photo push-in, a chevron nudge, a greyscale photo turning colour or a yellow underline. Nothing animates on load.

## Colors

A two-colour industrial palette: near-black and Kesla yellow on white, with warm greys doing all the quiet work.

### Primary
- **Kesla Yellow** (`yellow`): The action colour. Primary buttons, the slanted brand and family bands, the yellow edge behind a Photo Head's photo, the 6px top edge of the Contacts request form card, the selected picker card, the pressed topic chip in the News head, the specialist strip above the footer, the accent word in a headline ("PARTNER", "SINCE 1960", "KESLA"), call buttons, the chosen country on the Dealers map, the 3px rule over the open positions in the Career head, column headings on black, nav underline wipes and the current-page bar, link underlines, focus rings, text selection and the round family and play badges.
- **Lit Yellow** (`yellow-hi`): Hover state of yellow buttons only.

### Neutral
- **Kesla Black** (`black`): Hero and page heads, the video band, the Company history band, the News events band, footer, the logo block, dark buttons, the frame of outline-dark and outline-ink buttons and the inner fill of outline-light buttons.
- **Lifted Black** (`black-hi`): Hover state of dark buttons only.
- **Ink** (`ink`): Headings, link text, fact labels and model chips on white, the active language pill, the 3px rule under news and events titles, the placeholder behind a Photo Head's photo.
- **Body Grey** (`grey`): Running text on white.
- **Mute Grey** (`mute`): Dates, metadata labels, resting chevrons, inactive language codes.
- **White** (`white`): Page ground, headings on black, unselected picker cards.
- **Paper** (`paper`) and **Warm Grey** (`warm`): Image placeholders and ghost hover ground. Never a section background.
- **Hairline** (`line`): Dividers in ruled lists and fact lists, model chip frames, header bottom border, language switch frame, the 1px inset frame around cut-out product photos on white, and the resting underline of links in the service point table.
- **Strong Hairline** (`line-strong`): The 1px outline of a text field or dropdown on white (the Dealers search and country dropdown, the service point search), the 1px frame of the Dealers email and website squares, the Dealers panel's scrollbar thumb, the dash in an empty service point cell, and the fields, product chips and sent note of the Contacts request form. It holds 3:1 against white, where `line` does not, so a control's edge stays visible. Dividers stay `line`.
- **On-Dark** (`on-dark`) and **On-Dark Mute** (`on-dark-mute`): Body and secondary text on black bands, fact labels in the Company head, breadcrumb links on every head and datelines.
- **Dark Hairline** (`dark-line`): Dividers and chip borders on black.
- **Map Grey** (`map`): A country with Kesla dealers on the Dealers map, and its swatch in the map key. Countries without dealers are `warm`; the count badges on top are `black`.

### Named Rules
**The Yellow Is Spent Rule.** Yellow marks something to press, the one choice that is selected, a slanted band, or one accent word in a headline. It is never a decorative fill or a body text colour on white.

**The Band Rule.** Surfaces alternate between white and full-bleed black (or the full-bleed yellow strip and bands). There are no grey section grounds and no tinted cards between them.

**The Ring Swap Rule.** Focus is a 3px yellow outline at 2px offset. On a yellow ground (mark the container `on-yellow`) the ring turns black.

## Typography

**Display Font:** Exo 2 (with Helvetica Neue, Arial, sans-serif), weights 500 to 800, italic loaded for the bands.
**Body Font:** Hind (with Helvetica Neue, Arial, sans-serif), weights 400 to 600.

**Character:** Exo 2 stands in for kesla.com's Exo SemiBold headings and carries all the brand weight in uppercase. Hind stands in for the Frutiger body and stays plain and readable, so the two never compete.

### Hierarchy
- **Display** (800, uppercase, line-height 0.95, -0.015em): The one H1 per page, on black, sized by the kind of head (see Page Heads). The frontpage, Company and Career put the accent word on its own line in yellow. Title heads (Products, Career, Timber cranes) set it at clamp(2.625rem, 5.6vw, 5rem), Company caps it at 4.75rem, News runs clamp(2.5rem, 5vw, 4.5rem), and the working heads (Dealers, References, Contacts) clamp(2.25rem, 4.4vw, 3.75rem). The product page's H1 sits in its offer card at clamp(2.125rem, 3.4vw, 2.875rem). A news article's headline is the one H1 in mixed case, at clamp(1.5rem, 2.3vw, 2.125rem), line-height 1.12, because it is the release's own sentence. At that size the F-series headline runs four lines in the Photo Head's text column from 1200px to 1440px; three would need about 22px, too small for the page's one H1.
- **Headline** (800, uppercase): Section titles ("WHAT WE BUILD", "KESLA ON VIDEO"), always paired left with an optional "all" link on the right. Sub-category titles on the Products page run at clamp(1.625rem, 2.8vw, 2.375rem), line-height 1.
- **Title** (700 to 800, uppercase): Family names and card titles. Highlight titles run at 1.375rem, list-row names at body size with 0.02em tracking. News and events titles use 700 at clamp(1.5rem, 2.4vw, 1.875rem) with 0.02em tracking over a 3px ink rule. Picker card titles use 800 at clamp(1.125rem, 1.8vw, 1.4375rem), line-height 1.08.
- **Band** (800 italic, uppercase): The page's line in the brand band under the Company and Career heads.
- **Band Title** (800 italic, uppercase, black): The family name heading in a Products family band. Italic appears only in the two band styles.
- **Nav** (600): Header links in mixed case, 0.875rem from 1280px and 0.9375rem (Nav Wide) from 1536px. Mobile sheet links run at 1.125rem.
- **Button** (700, uppercase, 0.05em): All button labels. Small buttons drop to 0.875rem.
- **Label** (700, uppercase, 0.08em): Footer column headings, "Follow Kesla", news kind tags (at 0.75rem), the Defence header link. Fact labels on white use 700 at 0.875rem with 0.05em tracking in ink.
- **Chip** (600, mixed case): Model names in the model chip list.
- **Body** (400): Running text. Intros cap at 44 to 52ch. Dates, fact values and spec ranges use tabular numbers.
- **Body Small** (400, 0.9375rem): The second step of Hind: teasers, the "who and where" line under a row title, metadata under a job or dealer, notes under a list, live counts, how-to-apply lines, footer text. Small notes in tight rows drop to 0.875rem. Exo text at 0.9375rem is the Button or Nav Wide role, not this one.
- **Dateline** (Body Small, on-dark-mute on black, mixed case): The kind and date of a news item written as words ("Press release, 5 June 2026", "Lehdistötiedote, 5.6.2026") in a `<time>`, under the H1 or beside the row's link. Never tracked caps above the title.

### Named Rules
**The Caps Belong To Exo Rule.** Uppercase is set only in Exo 2. Hind is never uppercased.

**The One Accent Word Rule.** A display or headline may carry one yellow phrase, the closing words. Never more than one per heading.

**The No Eyebrow Rule.** Nothing sits above a heading but the breadcrumb. No tracked caps kicker, category, date or "Kesla dealers in" line over a title: the information goes into the title, a dateline under it, a fact row after it, or a screen-reader-only heading (the Contacts head's spare parts number is named by an sr-only `<h2>` and sits a deliberate clamp(26px, 3.2vw, 44px) step under the H1). Label-sized caps are allowed only as the heading of the list or field they name: a column heading on black, a field `<label>` or `<legend>`, a fact `<dt>`, the Career head's "OPEN NOW" over its own rows.

**The Finnish Fits Rule.** Finnish is set as Finnish, and the longest Finnish word decides the size. Figures take a decimal comma in every value and range ("8,0–9,5 m"). A no-break space (U+00A0) joins every number to its unit (m, mm, kNm, metrin) in both languages. A compound led by a letter or code keeps its plain hyphen and takes a word joiner (U+2060) straight after it, so it never breaks there: "Z-puomisina", "60-luvulta", "B4 -standardin", and in a rendered news headline "F-Series" / "F-sarjan" (the `headline()` helper in `src/lib/news.ts`; the page `<title>` keeps the plain hyphen alone). Never the non-breaking hyphen (U+2011): neither Exo 2 nor Hind has a glyph for it, so it falls back to Arial and looks thin next to the font's own hyphens (integration pass, 19 October 2026). A long Finnish title that would overflow its column carries a soft hyphen (U+00AD) at its compound seam ("Tukijalka­vaihtoehdot"); narrow card titles may hyphenate automatically. An H1 whose Finnish word outgrows its column is capped with a container query, min(its clamp, 100cqi / (longest word length × 0.66)), so "PUUTAVARANOSTURIT" never runs off a 390px phone and the frontpage's "VASTUULLINEN" stays in the hero's text column from 1024px (only the Finnish hero title is capped, since "RESPONSIBLE" fits); an accent phrase that must stay whole ("VUODESTA 1960") is set no-wrap and the clamp lowered until it fits.

## Layout

Every section is full bleed with an inner `wrap` of 1240px, centred, padded by the gutter (16px to 40px, and never less than the device's safe-area inset). The header row alone runs wider, to 1600px. Sections breathe on a fluid vertical rhythm of 56px to 104px; the news block uses 48px to 88px, Products sub-categories 40px to 64px, and the specialist strip a tight 30px over 28px.

Grids follow two ratios. Hero and media split 5:7 or 7:5 above 1024px (hero image on the right and bled to the viewport edge, main video left and the rest right). The family block is three equal columns above 768px, news and events two equal columns. Products sub-categories split 1:1 above 1000px, photo and text swapping sides on every other row. Everything collapses to one column on phones, with the hero image stacking under the text at 16:9.

A Photo Head holds its text in the left 54% (`max-width: calc(54% - 40px)` of the wrap) and bleeds the photo across the right 46% to the viewport edge above 1000px (above 900px on Products, where the picker changes layout). Above that split the head is at least clamp(340px, 27vw, 400px) tall, so the photo has room. The cut leans at one fixed angle whatever the head's height, so the floor no longer has to hold the lean. The Dealers head, a working head, and the News head, which is as tall as its title and topic chips, have no floor. Below the split the photo becomes a full-bleed strip under the text, clamp(200px, 46vw, 300px) tall on Products, Timber cranes and the news article, a short strip of clamp(140px, 34vw, 260px) and 130px on phones on News and Contacts, and nothing on Dealers, so the map and the list stay near the top. On Products the three picker cards overlap the bottom of the head by 64px to 104px in a three-column grid above 720px, and stack as rows with the photo on the left (38% wide) below that, overlapping by 32px.

Rows inside ruled lists are 9px to 18px tall in padding, divided by top hairlines with the last row closing on a bottom hairline. Fact and news rows become label-and-value grids from 640px (13em and 6.6em label columns); fact lists on white use an auto label column.

Page heads and two-column bodies switch at 1001px. Above it the head splits (5:7 for Career and References, 54:46 for every Photo Head, 8:4 for the product page, 1:1 for Company); at 1000px and below everything stacks, with a Photo Head's photo as a strip after the text. Contact rows tighten again below 561px, where call buttons become 48px squares.

The header changes layout as it widens. Below 1024px it is the logo block and the MENU trigger. From 1024px the language switch and the small yellow dealer button join, with the MENU sheet still holding the links. From 1280px the seven nav links (Products, References, Dealers, News, Company, Career, Contacts, all pages of this site) sit in the row and MENU goes. From 1440px the KESLA DEFENCE link joins. From 1536px the nav text grows to 0.9375rem and the link padding to 12px.

## Elevation & Depth

Flat. Depth comes from the black and white bands, from photography and from overlap (the picker cards sit over the bottom of the Products head), not from shadow. Two soft ambient shadows exist, both under round yellow badges that sit on top of photos, so the badge lifts off the image.

### Shadow Vocabulary
- **Badge lift** (`drop-shadow(0 4px 10px rgb(0 0 0 / 0.25))`): The family icon where it breaks the bottom edge of its photo.
- **Play lift** (`box-shadow: 0 6px 24px rgb(0 0 0 / 0.35)`): The round yellow play badge centred on a video still.

Two box-shadows draw lines, not depth: the 1px inset `line` frame around a cut-out product photo on white, and the picker card's focus ring (3px white then 3px ink).

### Named Rules
**The Flat Panel Rule.** Panels, buttons, rows, cards and photos carry no lifting shadow. Only a round yellow badge sitting over a photo may cast one.

## Shapes

Square by default (radius 0 everywhere). The signature is **one cut corner, bottom right**, a 45-degree clip: 14px on buttons, 10px on small buttons, 22px on family photos, picker cards, sub-category photos and the highlight panel, 26px on the main video. Buttons paint the cut on pseudo-elements behind the label instead of clipping the button, so the focus outline is never clipped: solid buttons fill a clipped `::before`, outlined buttons clip a 2px frame on `::before` and an inner fill on `::after` 1.17px smaller so the diagonal stroke stays 2px. Picker cards put the cut on an inner span for the same reason.

**The Closed Shear Rule.** Five sheared edges belong to the brand, and no others:
- **Logo block:** the header's black logo block, its right edge angled 26px in at the bottom.
- **Brand band:** the slanted yellow band that closes two heads: Company and Career. Its left edge leans in clamp(16px, 4vw, 60px) at the top. The text starts at the wrap edge, which clears the slant at every width. Every other head (the frontpage hero, Products, Timber cranes, References, Dealers, Contacts, the product page) closes square. The frontpage hero and Timber cranes lost their bands in the copy audit (TIMB-1, 19 October 2026), and News and the news article lost theirs on 20 October 2026, when the News topic chips moved into the head.
- **Products family band:** one slanted yellow band per family panel, under the picker, its left edge leaning in by `--shear` (clamp(24px, 5vw, 80px)) at the top. The heading is padded right by the overlap plus 6px so its first letter clears the slant.
- **Photo Head photo:** a real Kesla photo in the right 46% of a black head, cut in on its left edge at one fixed 20.5 degrees, close to the logo block's lean, over a yellow ground that shows as a 14px edge strip (14px along a row, about 13px square to the edge). The angle is the Products head's at 1440px, and it holds on every Photo Head at every width: the yellow ground is skewed with skewX(-20.5deg) from its bottom-left corner, the photo frame sits 14px in and inherits the skew, and an inner layer skews back so the photo stays upright. Until the integration pass of 19 October 2026 the cut was 22% of the photo's width, which leaned from about 12 degrees on the tall Contacts head to 28 on the short Dealers head. When the head stacks it becomes a strip whose top edge slants 18px down to the left, over an 8px yellow edge. One component, `PhotoHead` (`src/components/site/photo-head.tsx`), draws it on six heads: Products (the chosen family's machine), Timber cranes (the KESLA 2225, captioned on the photo), Dealers (a timber truck loading with a KESLA 2112Z), News (the KESLA twinAX harvester head), the news article (the release's own photo, the Sampo Rosenlew FR48 with a KESLA 9FT) and Contacts (the workshop photo). It started on Products and on Contacts ("Three doors", 19 October 2026), and spread to the other four when Anuj asked for one consistent head wherever the right side stood empty (19 October 2026).

The release's fact list marks each row with a 10px ink square whose bottom-right corner is cut to the middle: the cut corner at its smallest, not a shear.

Circles appear only as Kesla's yellow round family icons (76px on the frontpage, 48px in picker cards), the yellow play badge (84px, 46px small) and the yellow count beside "OPEN NOW" in the Career head. Thin square frames carry the language switch, the mobile menu trigger (2px ink), the model chips (1px `line`) and the social chips.

## Components

### Buttons
Heavy Exo caps in a square box with one cut corner. Confident, not decorated.
- **Shape:** square with the bottom-right cut (14px, 10px for small), painted behind the label so focus rings stay whole.
- **Yellow (primary):** yellow ground, black label, 15/22/14px padding, optional 16px arrow at 2.5 stroke after the label. Hover lightens to lit yellow.
- **Dark:** black ground, white label. Hover lifts to lifted black. The primary on the yellow strip and the "See all" action on Products sub-categories.
- **Outline-light:** 2px white frame on a black ground; on hover the fill turns white and the label black.
- **Outline-dark:** 2px black frame on yellow; on hover the fill turns black and the label yellow.
- **Outline-ink:** 2px black frame filled white, on a white ground; on hover the fill turns black and the label yellow.
- **Transition:** background, colour and box-shadow, 200ms ease-out. Focus is the yellow ring (black on yellow).
- **Pairing:** a primary and an outline sit side by side with a 12px gap. One yellow primary per band; on white a dark button pairs with outline-ink.

### Inputs / Fields
Square, white, no radius. A text field on white has a 1px `line-strong` inset outline, a leading 16px search icon and, once typed in, a clear button; the Dealers search is 48px tall, the service point search 54px. Focus swaps the outline for a 3px yellow inset. A dropdown under a section on white takes a 2px ink frame. The Contacts request form sits on white in a card (a 2px `line` frame with the 22px panel cut and a 6px yellow top edge). Its fields are at least 44px tall, outlined 1px `line-strong`, and focus is an ink inset plus a 3px yellow ring. An invalid field takes a 2px ink inset, with its message in ink beside a yellow-filled alert icon, never yellow text on white. The product checkboxes are 44px chips framed in `line-strong` that turn yellow when ticked, with an ink focus ring. Errors sit inline under the field, a summary points back up at them, and focus moves to the first problem.

### Ruled Lists
The system's answer to cards. Each row is a full-width link between hairlines (`line` on white, `dark-line` on black), name left and a 16px mute chevron right. On hover the chevron nudges 4px right and darkens to ink (200ms, ease-out-expo) and the name takes a 2px yellow underline at 4px offset. Variants: sub-category rows (text only), thumbnail rows (a 8:3 image column of 88px, 120px from 640px), fact rows (yellow Exo label, on-dark value on black; ink Exo label and ink tabular value on white, 9px rows), dated rows (mute tabular date, title, label-sized kind tag).

### Contact Lists
Two forms, chosen by what the visitor does next.
- **Dealers, by company:** each company once, its name over a 2px ink rule with its product chips and round family icons, then its contacts one line each, sorted by town: the town in a caps column, name and street, then one yellow call button carrying the number itself (40px tall, 188px wide, 8px cut, Exo 600 at 0.875rem, a filled phone icon), and 40px square email and website links in a 1px `line-strong` frame that turn black with a yellow icon on hover. Below 561px the call button becomes a 48px square, the number moves into the row, and the squares grow to 48px. One yellow button per contact row. Kesla's own people (India, Malaysia) show as black strips.
- **Contacts, the service point table:** a real table above 1000px (caption, sticky column header over a 3px ink rule, region row groups, the town as each row's header), and stacked entries with 48px link rows at 1000px and below: the workshop name as the entry's heading, then the town and region in a muted Body Small line under it (never a caps line above it), the notes and the address. Every value is a link with a 2px `line` underline that turns yellow on hover. No buttons and no yellow ground in the table. A number printed without an area code is plain text with no link.
- **Contacts doors and other contacts:** one desk or person per row with one small yellow Call or Write action (8px cut) on the right. The other contacts sit on white, not black, so the video band is the page's last black band before the footer. They are a ruled list under a 3px ink rule: the general number, sales and the four sites always open (the sites two by two, the GmbH number as a plain tel: link in the service point table's language), and invoicing, which only suppliers need, as the one fold.

### Model Chips
A plain list of model names, not links: square 1px `line` frames, Exo 600 at 0.875rem in ink, 8/10/7px padding, 6px apart, wrapping. No hover, no chevron. The way on is the sub-category's "See all" button.

### Photo Panels
Cut-corner image frames on a `warm` (or ink, on black) placeholder. On hover the photo scales to 1.04 (families) or 1.03 (highlight, video) over 700ms with ease-out-expo, clipped inside the frame. The family panel carries a 76px yellow round icon overlapping its bottom edge by 40px, inset 20px from the left. The highlight panel is a black block under its photo holding the title, a one-line dark-mute description and a yellow button-styled call to action. Products sub-category photos are static 7:4.4 panels with the 22px cut; a cut-out product shot sits contained on white inside a 1px `line` inset frame.

### Chips in a black head
The News topic filter sits in the black head under the H1: a toggle group (`aria-pressed`) of square chips, Exo 600 at 0.875rem in on-dark inside a 1px frame of on-dark-mute at 70% (about 4.4:1 on black), 12px side padding, 6px apart, wrapping inside the Photo Head's text column, with the count after the label in on-dark-mute at 0.75rem. Hover turns the frame and the label white. The pressed chip fills yellow with black text and its count in black at 75%, the one selected choice on the head. Focus is the usual yellow ring, which sits on the black ground. On a coarse pointer every chip is 44px tall. On phones the chips wrap under the title (three rows in English, four in Finnish) and the photo strip follows them. The pick lives in the hash (see Selection in the URL Hash) and a polite live region announces it; an "All N" button further down picks its topic, scrolls back up to the head and focuses the pressed chip. The chips are not sticky: the page is a few screens long and every "All N" button leads back to them. This is the only chip row on black; model chips on white are unchanged (Anuj, 20 October 2026).

### Family Picker
Three photo cards with Kesla's round family icons (48px), each a toggle button (`aria-pressed`) over a 16:9 photo, a base-machine title and the family name. The selected card is yellow with a colour photo and black text. The others are white with greyscale photos (contrast 1.05) that turn colour on hover over 400ms ease-out. Every card carries the 22px cut on its inner body. Focus is a 3px white then 3px ink ring, because the cards straddle the black head and the white page. The choice lives in the URL hash (`#cranes`, `#logging`, `#tractor`), swaps the family panel below, and cross-fades the head photo over 500ms ease-out, only after the visitor has picked (a deep link shows its family at once). A polite live region announces the pick.

### Selection in the URL Hash
Every on-page choice that changes what the page shows lives in the hash, never the query string, so pages stay static: the Products family (#cranes), the References country (#de, and #de-cranes for a group), the Dealers country (#fi), the News topic (#fairs), the product page's tab and the Timber cranes finder (#boom=z&r=9.5&t=120&sort=t). A pick writes the hash with `history.replaceState`, keeping Next's own history state, so it adds no history entry and does not scroll; the finder writes after 300ms of quiet. A shared store reads the hash on hydration and on `hashchange`, so a deep link shows its choice at once and the server renders the default. Only after the visitor picks (never for a deep link on load) does a polite live region say it in a few words, "Showing Austria" / "Valittuna: Itävalta"; the finder announces its live count instead. Where the default would flash before hydration, a small head script hides the start state (Dealers).

### Time-Bound Content
Anything that depends on today is computed where today is known, and never moves the layout when it arrives. Fair status ("On now", "Starts in N days", "Ended N days ago") is computed in the browser from the visitor's own date; the server renders the rows without status, and every row keeps one height so only colour and size change. Job posts close after 23:59 Helsinki time on their deadline, filtered on the server by a cached function (`"use cache"` with `cacheLife("minutes")`); with none open, the head and the list say so and the open application stays.

### Section Heading
Headline left, "all" link right, aligned to the baseline end, 24px to 40px above the content. The link is Exo 600 with a persistent 2px yellow underline 6px below and a trailing arrow (an up-right arrow for external links). On hover or focus a second 2px line in the link's colour (white on black) wipes in over it from the left over 400ms ease-out-expo; it is static under reduced motion. On black the link turns yellow.

### Navigation
- **Header:** one white row with a hairline bottom. Black logo block on the left with its angled edge, then from 1280px the seven Exo 600 links, every one a page of this site, from 1440px the Defence label link with an up-right arrow, and from 1024px the EN/FI switch and a small yellow "Find a dealer" button. Below 1280px an outlined MENU trigger holds the links.
- **Hover:** a 3px yellow bar wipes in from the left under the link (scale from 0, 200ms ease-out).
- **Current page:** the link for the page being shown, or a page under it, carries `aria-current="page"` and keeps the 3px yellow bar drawn. Links out to kesla.com are never current; the frontpage has no current item.
- **Breadcrumb:** the first thing in every black head. Exo 600 at 1.125rem in on-dark, earlier steps as on-dark-mute links that turn yellow on hover, a 12px on-dark-mute chevron between steps, the current page last as plain on-dark text with `aria-current="page"`. A step with no page of its own ("Press releases") is plain text and not current. The product page's five-step trail drops to 0.875rem and wraps.
- **Touch targets:** every control is at least 44px tall on a coarse pointer (`pointer-coarse:min-h-11`), including the MENU trigger, the video social chips and the Products sub-category buttons, which keep their compact height for a mouse. A text link that cannot grow without moving its row (the homepage "All news" and "All events", the footer legal links) gets its 44px from a transparent `::after` on a coarse pointer. On touch screens a row title's link stretches over its whole text column. Call and email squares on phones are 48px.
- **Language switch:** two square codes in a hairline frame; the active one is ink with white text.
- **Mobile sheet:** opens on the right (88vw, max 380px) with a black logo header, 1.125rem ruled rows with chevrons, the current page underlined in 3px yellow at 6px offset, and the language switch and yellow dealer button pinned to the bottom.

### Slanted Bands
Full-bleed yellow, left edge sheared (see The Closed Shear Rule), marked `on-yellow`.
- **Brand band:** under the Company and Career heads only, carrying the page's line and "SINCE 1960" split by an 8px black diamond, which drops out below 561px. The frontpage hero, Timber cranes, News and the news article close without it (19 and 20 October 2026).
- **Family band (Products):** one per family panel, under the picker, carrying the family name as an italic Band Title and a one-paragraph black intro (max 52ch) beside it, wrapping under it on narrow screens.

### Page Heads
Every page opens on a full-bleed black head: breadcrumb, one H1 (sizes in Typography), a 46ch to 54ch intro in on-dark, and the page's first job on the right above 1000px. Head padding and breadcrumb margins are shared, so heads line up from page to page. Variants:
- **Fact head** (Company): seven ruled facts with on-dark labels and square jump chips, closed by the brand band.
- **List head** (Career): the open items as ruled rows over a 3px yellow rule, closed by the brand band.
- **Picker head** (Products, References): the choice itself in or over the head, as picker cards or toggle tiles.
- **Photo Head** (Products, Timber cranes, Dealers, News, the news article, Contacts): the text in the left 54% and a real photo cut in over its yellow edge in the right 46% (see The Closed Shear Rule and Layout), built with `PhotoHead`. The News head has no floor and carries the topic chips under its H1 (see Chips in a black head). News and the article close square onto white. The Dealers head keeps its working-head padding and puts the factory sales frame (dark hairline, cut corner, the fallback contact and its call button) under the title. The article head holds the headline, the dateline and the two buttons only, and the release's lead opens the body as a lede (Body at clamp(1.1875rem, 1.6vw, 1.3125rem), weight 500, in ink).

**The Photo Head Rule.** A black head whose right side would otherwise stand empty takes the Photo Head, with a photo of the page's own subject, and two pages next to each other in the nav never share a photo. A head whose right side already holds the page's own content keeps it: Company's facts, Career's open positions, References' country tiles (the full-width picker is that head's job, and the head stays short so the newest story shows on the first screen) and the 2112Z gallery. The H1 sizes stay as listed under Typography, and the text column, buttons and breadcrumb are the same on every Photo Head.
- **Product head** (2112Z): the photo stage left (8 columns), an offer card right (4) with the H1, versions, figures and the yellow offer button.

### Products Head
A Photo Head (`PhotoHead`, split at 901px): a breadcrumb (Exo 600, on-dark-mute link with a 12px chevron, current page in on-dark), the H1 and a 52ch intro on the left, and the selected family's photo on the right, cut in over its yellow edge (see The Closed Shear Rule) with a 55% black gradient rising from the bottom. The three family photos are stacked and only the selected one shows.

### Article Body
The news article's body uses the whole wrap above 1000px. A 68ch reading column holds the lede, the first paragraph and then the first subhead with its list, and a rail of at least 300px sits beside it: At a glance next to the opening (label and value side by side once the rail is 420px wide, stacked below that), then the F-series models and the press contacts next to the first subhead. After that the parts that read across span the wrap: the operator benefits as ruled cells under a 3px ink rule (three across from 1001px, two from 641px, one on phones), the next two subheads side by side, the quote as a pull quote on a 6px ink rule (Exo 700 at clamp(1.375rem, 2.5vw, 2.125rem), at most 34em, on white so the video band stays the only black after the head), and the boilerplate in two muted columns over a hairline. The rail is not sticky, because it runs taller than a 900px window. At 1000px and below everything is one column in source order: the lede, the first paragraph, At a glance, the release, the quote, the models and contacts, then the boilerplate (Anuj, 20 October 2026).

### Specialist Strip
The full-bleed yellow strip above the footer on every page: an Exo 800 uppercase headline and one line of black body on the left, a dark button and an outline-dark button on the right.

### Video Block
On a black band: the main video in a 26px cut frame with an 84px yellow play badge that scales to 1.1 on hover (300ms, ease-out-expo), side videos as ruled rows with a small badge and a black "360°" corner tag in yellow, and social links as square chips (dark hairline border, on-dark label, 18px icon) that turn yellow in border and text on hover. The frontpage's block closes References, Dealers, News, the news article, Career and Contacts unchanged; Timber cranes and the 2112Z page fill the same block with their own videos. Products and Company have none since the copy audit (19 October 2026).

### Footer
Black, five columns on desktop (about text plus four link columns headed by yellow labels), links in on-dark that turn yellow on hover, and a legal row under a dark hairline.

## Do's and Don'ts

### Do:
- **Do** put every new section in a full-bleed band (white, black, or yellow) with a 1240px wrap and the fluid gutter.
- **Do** cut exactly one corner, bottom right, on buttons, cards and photo panels (14px buttons, 22px panels and cards, 26px for a lead video), and paint it behind the element so focus rings stay whole.
- **Do** list navigable things as ruled rows with a chevron, so a list of pages reads like the families list on the frontpage. Names that lead nowhere go in square hairline chips.
- **Do** use ease-out-expo (cubic-bezier(0.16, 1, 0.3, 1)) for image push-ins, chevron nudges and link wipes, and keep hover or a visitor's choice the only trigger.
- **Do** set headings in Exo 2 uppercase at 700 or 800, with at most one yellow accent phrase.
- **Do** switch the focus ring to black on yellow grounds.
- **Do** mark the current page's nav link with `aria-current="page"` so it keeps its yellow bar.
- **Do** use real Kesla machine photography and Kesla's own round yellow family icons.
- **Do** open every page with the black head, the breadcrumb first and one H1, and put a news item's kind and date in a dateline under the title.
- **Do** keep a page's choices in the URL hash, written with `history.replaceState`, and announce a pick in a few words only after the visitor makes it.
- **Do** make every control at least 44px tall on a coarse pointer, and call and email squares 48px on phones. A text link that cannot grow without moving its row gets the 44px from a transparent `::after` on touch.
- **Do** set Finnish with decimal commas, no-break spaces between numbers and units, a hyphen plus U+2060 in letter-led compounds, and an H1 cap that fits the longest Finnish word.
- **Do** outline text fields and dropdowns on white in `line-strong`, and keep `line` for dividers.

### Don't:
- **Don't** round corners on panels, buttons, chips or inputs. Circles are only the round yellow badges.
- **Don't** box content into shadowed or tinted cards. Use ruled rows, a cut-corner photo panel, or a picker card for a choice.
- **Don't** shear any edge outside the Closed Shear Rule: the logo block, the brand band under the Company and Career heads, one family band per Products family panel, and the Photo Head photo (Products, Timber cranes, Dealers, News, the news article, Contacts). These are approved and stay sheared. Shear nothing else: no other slanted photos, no slanted cards, buttons or section edges.
- **Don't** use yellow text on white, or yellow as a background for anything that is not an action, a selected choice, a slanted band, the head photo's edge or the specialist strip.
- **Don't** put an eyebrow, kicker or tracked caps label above a heading. Fold it into the title, a dateline or a fact row, or make it a screen-reader-only heading.
- **Don't** give a dense contact table buttons or yellow fills. Links carry it; yellow call buttons belong to rows where the call is the one action.
- **Don't** animate anything on load, and don't let a value computed after load (a date, a status) move the layout.
- **Don't** uppercase Hind body text.
