import type { Pair } from "@/lib/references";

/**
 * The articles the redesign renders itself, by local slug. Only the F-series
 * release of 5 June 2026 was designed; its English and Finnish text is
 * Kesla's own, as published on kesla.com (read 18 October 2026). Every other
 * item links to its page on kesla.com.
 */

export type ArticleBlock =
  | { type: "p"; text: Pair }
  | { type: "h2"; id: string; text: Pair }
  | { type: "ul"; items: readonly Pair[] }
  | { type: "dl"; rows: readonly { term: Pair; text: Pair }[] }
  | { type: "quote"; text: Pair; name: string; role: Pair };

/** A run of text; `{ b }` is set bold, as the mockup sets the release's figures. */
export type Segment = string | { b: string };

export type Contact = { name: string; role: Pair; phone?: string; email: string };

export type Article = {
  /** Slug of the item in `news-data.ts`. */
  source: string;
  title: Pair;
  lead: Pair;
  /** `caption` is the release's own "Picture 1." line. */
  image: { src: string; width: number; height: number; alt: Pair; caption: Pair };
  /** Model pages on kesla.com, linked from the article's sidebar. */
  models: readonly { name: string; href: Pair }[];
  /** "At a glance": the release's own figures, restated as label and value. */
  glance: readonly { term: Pair; value: readonly [en: readonly Segment[], fi: readonly Segment[]] }[];
  blocks: readonly ArticleBlock[];
  about: Pair;
  contact: Contact;
  images: Contact;
};

const MODEL_EN = "https://kesla.com/en/products/category/product/forwarder-cranes/";
const MODEL_FI = "https://kesla.com/fi/tuotteet/tuotekategoria/tuote/ajokoneet/";

const F_SERIES: Article = {
  source:
    "kesla-launches-new-f-series-forestry-cranes-performance-controllability-and-modularity-for-the-most-common-forwarder-classes",
  title: [
    "Kesla Launches New F-Series Forestry Cranes – Performance, Controllability and Modularity for the Most Common Forwarder Classes",
    "Kesla lanseeraa uudet F-sarjan metsäkonenosturit – tehokkuutta, hallittavuutta ja modulaarisuutta yleisimpiin ajokoneluokkiin",
  ],
  lead: [
    "As timber harvesting operations demand higher productivity, improved operator control and greater versatility across applications, Kesla introduces its new generation of forwarder cranes. The new F-series covers the size classes KESLA 9F/FT, 10F/FT, 12F/FT and 14F/FT. The range has been developed to meet these evolving industry requirements by combining performance, precision and modularity with proven durability and life-cycle efficiency.",
    "Puunkorjuun kasvavat vaatimukset tuottavuuden, hallittavuuden ja monikäyttöisyyden osalta ohjaavat alan kehitystä. Näihin tarpeisiin vastaten Kesla Oyj tuo markkinoille uuden sukupolven F-sarjan metsäkonenosturit kokoluokissa KESLA 9F/FT, 10F/FT, 12F/FT ja 14F/FT. Uusi F-sarja on suunniteltu vastaamaan modernin puunkorjuun vaatimuksiin yhdistämällä korkea suorituskyky, erinomaiset käyttöominaisuudet ja rakenteellinen kestävyys, osatekijät joista seuraa erinomainen taloudellisuus läpi elinkaaren.",
  ],
  image: {
    src: "/images/news-f-series.jpg",
    width: 1600,
    height: 1067,
    alt: [
      "A Sampo Rosenlew FR48 forwarder loading timber with a KESLA 9FT crane",
      "Sampo Rosenlew FR48 -kuormatraktori kuormaa puuta KESLA 9FT -nosturilla metsässä",
    ],
    caption: ["Picture 1. Sampo Rosenlew FR48 & KESLA 9FT", "Kuva 1. Sampo Rosenlew FR48 & KESLA 9FT"],
  },
  models: (["9F", "10F", "12F", "14F"] as const).map((n) => ({
    name: `KESLA ${n} / ${n}T`,
    href: [MODEL_EN + n.toLowerCase(), MODEL_FI + n.toLowerCase()] as const,
  })),
  glance: [
    {
      term: ["Size classes", "Kokoluokat"],
      value: [[{ b: "KESLA 9F/FT, 10F/FT, 12F/FT, 14F/FT" }], [{ b: "KESLA 9F/FT, 10F/FT, 12F/FT, 14F/FT" }]],
    },
    { term: ["Gross lifting moment", "Bruttonostomomentti"], value: [[{ b: "120–180 kNm" }], [{ b: "120–180 kNm" }]] },
    {
      term: ["Reach", "Ulottuma"],
      value: [
        [{ b: "8.2 m" }, " single extension (F), ", { b: "10.07 m" }, " double extension (FT)"],
        [{ b: "8,2 m" }, " yksijatkeinen (F), ", { b: "10,07 m" }, " kaksijatkeinen (FT)"],
      ],
    },
    {
      term: ["Pillar height", "Pilarikorkeus"],
      value: [["Two options for each model"], ["Kaksi vaihtoehtoa kullekin mallille"]],
    },
    {
      term: ["Also suits", "Soveltuu myös"],
      value: [["Feeding chippers and other industrial applications"], ["Hakkureiden syöttöön ja teollisuussovelluksiin"]],
    },
  ],
  blocks: [
    {
      type: "p",
      text: [
        "The four size classes in the new range offer a gross lifting moment of 120–180 kNm, covering a wide spectrum of the most common forwarder sizes. Each model is available both as a single-extension F-version (reach 8.2 m) and a double-extension FT-version (reach 10.07 m), enabling an optimal solution for varying operational and reach requirements. Two different pillar height options for each model allow flexible integration with different base machines and applications.",
        "Uuden malliston neljä eri kokoluokkaa ovat bruttonostomomentiltaan 120-180 kNm, mikä kattaa laajasti kuormatraktoreiden yleisimmät kokoluokat. Jokaisesta mallista on saatavana sekä yksijatkeinen F-versio (ulottuma 8,2 m) että kaksijatkeinen FT-versio (ulottuma 10,07 m), mikä mahdollistaa optimaalisen ratkaisun eri käyttö- ja ulottuvuusvaatimuksiin. Kunkin mallin kaksi eri pilarikorkeusvaihtoehtoa mahdollistaa sovittamisen eri alustakoneisiin ja käyttökohteisiin.",
      ],
    },
    {
      type: "h2",
      id: "range",
      text: ["Designed as a complete range from the ground up", "Suunniteltu alusta alkaen kokonaisuudeksi"],
    },
    {
      type: "p",
      text: [
        "The KESLA F-series has been developed as a unified product family, where key structural solutions and operational characteristics remain consistent throughout the range. This supports:",
        "KESLA F-sarja on kehitetty yhtenäisenä tuoteperheenä, jossa keskeiset rakenneratkaisut ja käyttöominaisuudet ovat yhtenäiset koko malliston läpi. Tämä tukee:",
      ],
    },
    {
      type: "ul",
      items: [
        ["efficient production,", "tehokasta tuotantoa,"],
        ["easy maintenance,", "helppoa huollettavuutta,"],
        ["a consistent user experience,", "yhtenäistä käyttökokemusta,"],
        ["smooth integration with OEM partner machines,", "sujuvaa integraatiota OEM-kumppaneiden koneisiin,"],
        ["efficient spare parts management.", "tehokasta varaosien hallintaa."],
      ],
    },
    {
      type: "p",
      text: [
        "During development, extensive customer feedback from existing cranes on the market was collected and combined with comprehensive field testing across different markets. The cranes have been tested in multiple applications and on various base machines, with highly positive user feedback – particularly regarding motion control, power feel and swing torque.",
        "Malliston kehitysvaiheessa on kerätty laajasti asiakaspalautteita markkinoilla olevista nostureista ja hyödynnetty laajaa kenttätestausta eri markkinoilla. Nostureita on testattu useissa sovelluksissa ja eri alustoilla, ja käyttökokemukset ovat olleet erittäin positiivisia erityisesti liikeratojen, voimantunnun ja kääntövoiman osalta.",
      ],
    },
    { type: "h2", id: "benefits", text: ["Key benefits for the operator", "Keskeiset hyödyt käyttäjälle"] },
    {
      type: "dl",
      rows: [
        {
          term: ["Performance", "Suorituskyky"],
          text: [
            "strong lifting torque and smooth power delivery across the entire working range.",
            "vahva nostomomentti ja tasainen voimantuotto koko liikeradalla.",
          ],
        },
        {
          term: ["Controllability", "Hallittavuus"],
          text: [
            "precise and predictable movements in all working situations.",
            "tarkka ja ennakoitava liike kaikissa työtilanteissa.",
          ],
        },
        {
          term: ["Geometry", "Geometria"],
          text: [
            "optimized boom dimensions, efficient operation with minimal crane movement.",
            "optimoidut mittasuhteet, tehokas työskentely minimaalisilla nosturin liikkeillä.",
          ],
        },
        {
          term: ["Durability", "Kestävyys"],
          text: [
            "thoroughly tested structure both in forest conditions and on test benches.",
            "kattavasti testattu rakenne sekä metsässä että testipenkissä.",
          ],
        },
        {
          term: ["Serviceability", "Huollettavuus"],
          text: ["designed for easy maintenance.", "suunnittelussa panostettu helppoon ylläpitoon."],
        },
        {
          term: ["Smart hydraulics", "Älykäs hydrauliikka"],
          text: [
            "proven hose routing solutions and component selection; internal hose routing inside the extension boom is a patented solution.",
            "toimiviksi todetut letkutusratkaisut ja komponenttivalinnat; jatkopuomin sisäinen letkureititys on patentoitu ratkaisu.",
          ],
        },
      ],
    },
    { type: "h2", id: "modular", text: ["Modularity and flexibility", "Modulaarisuutta ja joustavuutta"] },
    {
      type: "p",
      text: [
        "The modular design of the F-series enables a wide range of configuration options to meet different customer needs. The cranes are compatible with various link options and offer multiple pillar height alternatives, facilitating integration with different base machines and applications. The modular approach also minimizes the number of spare part items, supporting efficient product support.",
        "F-sarjan modulaarinen rakenne mahdollistaa useita kokoonpanovaihtoehtoja eri asiakastarpeisiin. Nosturit ovat yhteensopivia eri riipukevaihtoehtojen kanssa ja tarjolla on useita pilarikorkeusvaihtoehtoja, mikä helpottaa sovittamista eri alustakoneisiin ja käyttökohteisiin. Modulaarinen rakenne minimoi erilaisten varaosanimikkeiden määrän, mikä helpottaa toimivan tuotetuen järjestämistä.",
      ],
    },
    {
      type: "p",
      text: [
        "Thanks to the versatility of configurations, the new F-series cranes are also well suited for feeding chippers and other industrial applications.",
        "Erilaisten kokoonpanovaihtoehtojen ansiosta uudet F-sarjan nosturit soveltuvat erinomaisesti myös hakkureiden ym. syöttöön sekä erilaisiin teollisuussovelluksiin.",
      ],
    },
    {
      type: "h2",
      id: "strategy",
      text: ["Kesla’s strategic investment in the crane market", "Keslan strateginen panostus nosturimarkkinaan"],
    },
    {
      type: "p",
      text: [
        "The new F-series is a key element of Kesla’s strategy to strengthen its position as one of the leading manufacturers of forestry cranes. With this range, Kesla provides a comprehensive and competitive solution for the entire CTL harvesting chain.",
        "Uusi F-sarja on keskeinen osa Keslan strategiaa vahvistaa asemaansa yhtenä johtavista metsäkonenostureiden valmistajista. Malliston avulla Kesla tarjoaa markkinoiden kattavan ja kilpailukykyisen ratkaisun koko CTL-korjuuketjuun.",
      ],
    },
    {
      type: "quote",
      text: [
        "“The F-series represents a new level in Kesla’s crane development. By listening closely to crane users, we have combined our long experience with modern product development to create a product family that meets the needs of both machine manufacturers and contractors well into the future.”",
        "“F-sarja edustaa Keslan nosturikehityksen uutta tasoa. Olemme nosturien käyttäjiä kuunnellen yhdistäneet pitkän kokemuksemme ja modernin tuotekehityksen luodaksemme malliston, joka vastaa sekä konevalmistajien että koneyrittäjien tarpeisiin pitkälle tulevaisuuteen.”",
      ],
      name: "Mika Tahvanainen",
      role: ["Product Management Director, Kesla Plc", "tuotehallintajohtaja, Kesla Oyj"],
    },
  ],
  about: [
    "Kesla is a responsible partner that develops machinery, technology and services for the sustainable success of its customers, both in and outside the forest. Kesla’s four product groups are: stationary and industrial cranes, tractor equipment, logging equipment, and KESLA Defence. In 2025, the Group’s turnover was €34,4 million, of which 53% was attributable to export operations. Established in 1960, Kesla has production facilities in Joensuu, Kesälahti and Ilomantsi as well as a sales office in Appenweier, Germany. Kesla currently employs around 200 people. Kesla’s A series shares are listed on the Nasdaq Helsinki Ltd.",
    "Kesla on vastuullinen kumppani, joka kehittää työkoneita, teknologiaa ja palveluita asiakkaidensa kestävään menestykseen niin metsässä kuin sen ulkopuolellakin. Keslan liiketoiminta on keskittynyt neljään tuoteryhmään, jotka ovat auto- ja teollisuusnosturit, puunkorjuulaitteet, traktorivarusteet ja KESLA Defence. Konsernin liikevaihto oli 34,4 milj. euroa vuonna 2025. Viennin osuus liikevaihdosta oli 53 %. Vuonna 1960 perustetulla Keslalla on tuotantolaitokset Joensuussa, Kesälahdella ja Ilomantsissa sekä myyntiyhtiö Appenweierissa, Saksassa. Keslan palveluksessa on noin 200 henkilöä. Keslan A-osakkeet noteerataan Nasdaq Helsinki Oy:ssä.",
  ],
  contact: {
    name: "Mika Tahvanainen",
    role: ["Product Management Director, Kesla Plc", "tuotehallintajohtaja, Kesla Oyj"],
    phone: "+358 40 535 6567",
    email: "mika.tahvanainen@kesla.com",
  },
  images: {
    name: "Aleksandra Ihno",
    role: ["Marketing Manager", "markkinointipäällikkö"],
    email: "aleksandra.ihno@kesla.com",
  },
};

export const ARTICLES: Readonly<Record<string, Article>> = {
  "kesla-f-series-forestry-cranes": F_SERIES,
};

export const ARTICLE_SLUGS = Object.keys(ARTICLES);
