/**
 * Kesla's service points in Finland, as published on the Finnish-only page
 * kesla.com/fi/yhteystiedot/huoltopisteet-suomessa (read 18 October 2026),
 * carried over unchanged from the approved mockup
 * (`variants/contacts-list-variants.html`). Names, addresses, numbers and
 * emails are kesla.com's, typos included. Phone labels are what kesla.com
 * prints: a contact person's name, or a desk ("päivystys", "varaosat",
 * "korjaamo", "Huolto") that `contacts.ts` translates.
 *
 * `TOWN_REGIONS` (each town's maakunta) is not Kesla data: an earlier agent
 * placed every town in its region for the mockup's region filter.
 */

export type Maakunta =
  | "Uusimaa"
  | "Kanta-Häme"
  | "Päijät-Häme"
  | "Kymenlaakso"
  | "Varsinais-Suomi"
  | "Satakunta"
  | "Pirkanmaa"
  | "Pohjanmaa"
  | "Etelä-Pohjanmaa"
  | "Keski-Pohjanmaa"
  | "Keski-Suomi"
  | "Pohjois-Karjala"
  | "Etelä-Karjala"
  | "Etelä-Savo"
  | "Pohjois-Savo"
  | "Pohjois-Pohjanmaa"
  | "Kainuu"
  | "Lappi";

export type ServicePointData = {
  name: string;
  /** Street, then postcode and town, as printed (often in capitals). */
  address: readonly string[];
  /** The town in capitals, the key into `TOWN_REGIONS`. */
  town: string;
  /** [label, number]; the label is empty, a person or a desk. */
  phones: readonly (readonly [string, string])[];
  email: readonly string[];
  web: readonly string[];
  /** A line printed under the name, English and Finnish. */
  notes?: readonly (readonly [en: string, fi: string])[];
};

export const SERVICE_POINTS: readonly ServicePointData[] = [
  { name: "Maantec Oy / Espoo", address: ["Muottipojankuja 1", "02780 ESPOO"], town: "ESPOO", phones: [["", "+358 400 810 649"]], email: ["juha@snm.fi"], web: [], notes: [["Parts shop and workshop", "Tarvikemyymälä ja korjaamo"]] },
  { name: "Kermik Oy / Mikko Keränen", address: ["Pajakaarre 12", "89400 Hyrynsalmi"], town: "HYRYNSALMI", phones: [["", "+358 040 565 8562"]], email: [], web: ["http://www.kermik.fi"] },
  { name: "Raskaskonehuolto Pyykkönen Oy", address: ["Vanhatie 4", "89400 HYRYNSALMI"], town: "HYRYNSALMI", phones: [["Antti Pyykkönen", "+358 500 232 974"]], email: ["antti.pyykkonen@pp4.inet.fi"], web: [] },
  { name: "Finnish RK-Group, Raskassarja / Hyvinkää", address: ["Arolamminkatu 2", "05880 HYVINKÄÄ"], town: "HYVINKÄÄ", phones: [["", "+358 20 759 8440"]], email: ["korjaamo.hyvinkaa@raskassarja.fi"], web: ["https://raskassarja.fi/"] },
  { name: "Finnish RK-Group, Raskassarja / Hämeenlinna", address: ["Terminaalitie 11", "13430 HÄMEENLINNA"], town: "HÄMEENLINNA", phones: [["", "+358 044 510 4490"]], email: ["korjaamo.hameenlinna@raskassarja.fi"], web: ["https://raskassarja.fi/"] },
  { name: "Kuljetus & Maansiirto Niskanen Oy", address: ["Ratapellonkatu 16", "74120 IISALMI"], town: "IISALMI", phones: [["", "+358 44 555 8925"]], email: ["jari.niskanen@kmniskanen.fi"], web: [], notes: [["Jari Niskanen", "Jari Niskanen"]] },
  { name: "Arskan Kone Oy", address: ["Hatuntie 50c", "82900 ILOMANTSI"], town: "ILOMANTSI", phones: [["Ari Haapalainen", "+358 500 273 422"]], email: ["toimisto@arskankoneoy.fi"], web: [] },
  { name: "Myllys Yhtiöt OY", address: ["Vihnekatu 2", "55800 IMATRA"], town: "IMATRA", phones: [["Janne Tiilikainen", "+358 500 3265 668"], ["Arja Tiilikainen", "+358 44 206 0398"]], email: ["janne.tiilikainen@myllysyhtiot.fi", "arja.tiilikainen@myllysyhtiot.fi"], web: [] },
  { name: "Konekorjaamo Riikonen Oy", address: ["Helatie 21", "80100 JOENSUU"], town: "JOENSUU", phones: [["Keijo Riikonen", "040 0576 541"]], email: ["keijo.riikonen@riiko.fi"], web: [] },
  { name: "Pro Truck Joensuu", address: ["Ivontie 9", "80260 JOENSUU"], town: "JOENSUU", phones: [["", "010 419 4521"]], email: ["arto.leppanen@protruckjoensuu.fi"], web: [] },
  { name: "TTT Erätaito Oy", address: ["Vanhanjoentie 76", "83900 JUUKA"], town: "JUUKA", phones: [["", "050 5944 053"]], email: ["tero.toivanen1976@gmail.com"], web: [], notes: [["Tero Toivanen", "Tero Toivanen"]] },
  { name: "Rautajärven Konehuolto Oy / Huoltokorjaamo Pirkanmaa", address: ["Lentolantie 13 A", "36220 KANGASALA"], town: "KANGASALA", phones: [["", "+358 44 744 8866"]], email: ["janne.sipila@rautajarven.fi"], web: ["https://rautajarven.fi/"] },
  { name: "Kannonkone Oy", address: ["Teollisuustie 1", "4330 KANNONKOSKI"], town: "KANNONKOSKI", phones: [["", "014 451 315"], ["", "+358 400 345 996"]], email: ["kannonkone@pp.inet.fi"], web: [] },
  { name: "Hymetec Oy", address: ["Laitilantie 911 B", "27500 KAUTTUA"], town: "KAUTTUA", phones: [["", "+358 40 775 0338"]], email: ["ossi@hymetec.fi"], web: [] },
  { name: "ESS Crane", address: ["Yrittäjänkatu 10", "68800 KOLPPI"], town: "KOLPPI", phones: [["", "006 7665 200"]], email: ["info@esscrane.fi"], web: [] },
  { name: "Konneservice Oy", address: ["Jokirannantie 265", "44300 KONNEVESI"], town: "KONNEVESI", phones: [["", "+358 44 767 5556"]], email: ["tero@konneservice.fi"], web: [] },
  { name: "HeaWYJob AB", address: ["Yrittäjätie 5", "68500 KRUUNUPYY"], town: "KRUUNUPYY", phones: [["", "+358 50 514 6679"]], email: [], web: [] },
  { name: "UM-Tuote Oy", address: ["Koljosentie 78", "88900 KUHMO"], town: "KUHMO", phones: [["", "+358 40 511 5020"]], email: ["um.tuote@kuhmo.net"], web: [] },
  { name: "KKP Tuotanto Oy", address: ["Tamppitie 2", "93600 Kuusamo"], town: "KUUSAMO", phones: [["", "+358 40 5191 268"]], email: ["kkp-tuatantooy@pp.inet.fi"], web: [] },
  { name: "Kuusmet Oy", address: ["Teollisuustie", "93600 KUUSAMO"], town: "KUUSAMO", phones: [["", "+358 405 082 013"]], email: ["konepaja@kuusmet.fi"], web: [] },
  { name: "Finnish RK-Group, Raskassarja / Lahti", address: ["Paanakatu 2", "15150 LAHTI"], town: "LAHTI", phones: [["", "+358 44 510 4427"]], email: ["korjaamo.lahti@raskassarja.fi"], web: ["https://raskassarja.fi/"] },
  { name: "Lapphuolto ja Korjauspalvelu Ky", address: ["Kankaantie 4", "62600 LAPPAJÄRVI"], town: "LAPPAJÄRVI", phones: [["", "06 566 1913"]], email: ["lapphuolto@luukku.com"], web: [] },
  { name: "Kongan Konepaja Ky", address: ["Virransalmentie 187", "52700 MÄNTYHARJU"], town: "MÄNTYHARJU", phones: [["", "+358 407 445 626"]], email: ["asko.moller@kongan.fi"], web: [] },
  { name: "Naaran Kuljetushuolto Oy", address: ["Lampitie 1", "76850 NAARAJÄRVI"], town: "NAARAJÄRVI", phones: [["Joonas Pekurinen", "+358 50 361 6836"]], email: ["joonas.pekurinen@kuljetushuolto.fi", "info@kuljetushuolto.fi"], web: ["https://www.kuljetushuolto.fi/"] },
  { name: "Haittamäki Oy", address: ["Torpantie 69", "85500 NIVALA"], town: "NIVALA", phones: [["Jussi Pirnes", "+358 50 380 7557"]], email: ["halli@haittamakioy.com"], web: [] },
  { name: "S ja V. Varis", address: ["Rahulantie 1 A", "50350 NOROLA"], town: "NOROLA", phones: [["", "015 321 440"], ["Jani", "+358 50 5548 189"]], email: ["korjaamo@korjaamovaris.fi", "tero.paajanen@korjaamovaris.fi", "jani.varis@korjaamovaris.fi"], web: [] },
  { name: "Rautajärven Konehuolto Oy / Huoltokorjaamo Uusimaa", address: ["Vanha Turuntie 873", "03100 NUMMELA"], town: "NUMMELA", phones: [["", "+358 44 737 3735"]], email: ["janne.sipila@rautajarven.fi"], web: ["https://rautajarven.fi/"] },
  { name: "Pekant Oy", address: ["Pikkukiventie 5", "90630 Oulu"], town: "OULU", phones: [["päivystys", "+358 50 445 4005"], ["varaosat", "+358 40 093 0590"], ["korjaamo", "+358 40 160 8949"]], email: ["info@pekant.fi", "myynti@pekant.fi", "korjaamo@pekant.fi"], web: [], notes: [["In emergencies they also help outside opening hours.", "Hätätilanteissa palvelemme myös aukioloaikojen ulkopuolella"]] },
  { name: "Raskone Oy", address: ["Moreenikuja 2", "90630 OULU"], town: "OULU", phones: [["", "010 2320 500"]], email: ["ilkka.sulkala@raskone.fi"], web: [] },
  { name: "Pihtiputaan ajokonekorjaamo", address: ["Rupontie 3", "44800 PIHTIPUDAS"], town: "PIHTIPUDAS", phones: [["Antero Turpeinen", "+358 400 268 962"]], email: ["antero.turpeinen@ajokone.fi"], web: [] },
  { name: "Metsäkonepalvelu Yli-Anttila OY", address: ["Raja-Hiltantie 5", "28500 PORI"], town: "PORI", phones: [["", "+358 44 013 8912"]], email: ["tomi.yli-anttila@yli-anttila.com"], web: ["https://tervetuloametsaan.fi/yritys/metsakonepalvelu-yli-anttila-oy/"] },
  { name: "Autohitsi Mika Luokkanen", address: ["Teollisuustie 6", "93100 PUDASJÄRVI"], town: "PUDASJÄRVI", phones: [["", "+358 40 099 8361"]], email: ["autohitsi.mikaluokkanen@gmail.com"], web: ["https://autohitsi-mika-luokkanen.webnode.fi/"] },
  { name: "Punkaharjun AM–Asennus Oy", address: ["Palomäentie 41", "PUNKAHARJU"], town: "PUNKAHARJU", phones: [["", "0207 434 840"], ["", "+358 400 603 033"]], email: ["kalle.toivanen@am-asennus.fi"], web: [] },
  { name: "Lapin Raskas-Osa Oy", address: ["Paljetie 1", "96300 ROVANIEMI"], town: "ROVANIEMI", phones: [["", "247 372 072"]], email: ["juha.kouri@raskas-osa.com"], web: [] },
  { name: "Isera Oy", address: ["Tehdaskatu 14", "24100 SALO"], town: "SALO", phones: [["Ismo Seppälä", "+358 40 584 4713"]], email: ["ismo.seppala@isera.fi"], web: [] },
  { name: "KM-huoltopalvelut", address: ["Ahertajantie 2", "SAVONLINNA"], town: "SAVONLINNA", phones: [["Risto Malmstedt", "+358 400 165 471"], ["Huolto", "+358 15 497 252"]], email: ["huolto@kmhuoltopalvelut.fi"], web: [] },
  { name: "Lakeuden Hydro Oy", address: ["Rajatie 46", "60100 SEINÄJOKI"], town: "SEINÄJOKI", phones: [["Juho Hirviniemi", "+358 440 661 007"]], email: ["juho.hirviniemi@lakeudenhydro.com"], web: [] },
  { name: "Karjalan Konehake Oy", address: ["Viljönkatu 4", "56800 SIMPELE"], town: "SIMPELE", phones: [["", "+358 400 397 513"]], email: ["konehake@gmail.com"], web: [] },
  { name: "Ranttiän Kone Oy", address: ["Söörmarkuntie 62", "29750 SÖÖRMARKKU"], town: "SÖÖRMARKKU", phones: [["", "+358 505 634 089"]], email: ["joni.rotkus@ranttiankone.fi"], web: [] },
  { name: "Maantec Oy / Hyrylä", address: ["Teollisuustie 1", "04300 TUUSULA"], town: "TUUSULA", phones: [["", "045 263 4400"]], email: ["sasu@maantec.fi"], web: [], notes: [["Parts shop and workshop", "Tarvikemyymälä ja korjaamo"]] },
  { name: "Maantec Oy / Maantiekylä", address: ["Kalliotie 5", "04360 TUUSULA"], town: "TUUSULA", phones: [["", "040 586 5559"]], email: ["sami@maantec.fi"], web: [], notes: [["Workshop", "Korjaamo"]] },
  { name: "Lakeuden Hydro Oy", address: ["Laturintie 4", "65101 VAASA"], town: "VAASA", phones: [["Stefan Vidjeskog", "+358 44 343 3454"]], email: ["stefan.vidjeskog@lakeudenhydro.com"], web: [] },
  { name: "Varkauden Kuorma-Autohuolto", address: ["Leijukuja 8", "78210 VARKAUS"], town: "VARKAUS", phones: [["", "0207 614 702"], ["Mikko Tuomainen", "+358 40 539 8170"]], email: ["huolto@kuorma-autohuolto.fi"], web: [] },
  { name: "Koneosapalvelu Oy", address: ["Teollisuustie 5", "35700 VILPPULA"], town: "VILPPULA", phones: [["Pekka Huhtinen", "+358 44 771 7116"]], email: ["Pekka.Huhtinen@koneosapalvelu.fi"], web: [] },
];

export const TOWN_REGIONS: Readonly<Record<string, Maakunta>> = {
  "ESPOO": "Uusimaa",
  "HYRYNSALMI": "Kainuu",
  "HYVINKÄÄ": "Uusimaa",
  "HÄMEENLINNA": "Kanta-Häme",
  "IISALMI": "Pohjois-Savo",
  "ILOMANTSI": "Pohjois-Karjala",
  "IMATRA": "Etelä-Karjala",
  "JOENSUU": "Pohjois-Karjala",
  "JUUKA": "Pohjois-Karjala",
  "KANGASALA": "Pirkanmaa",
  "KANNONKOSKI": "Keski-Suomi",
  "KAUTTUA": "Satakunta",
  "KOLPPI": "Pohjanmaa",
  "KONNEVESI": "Keski-Suomi",
  "KRUUNUPYY": "Keski-Pohjanmaa",
  "KUHMO": "Kainuu",
  "KUUSAMO": "Pohjois-Pohjanmaa",
  "LAHTI": "Päijät-Häme",
  "LAPPAJÄRVI": "Etelä-Pohjanmaa",
  "MÄNTYHARJU": "Etelä-Savo",
  "NAARAJÄRVI": "Etelä-Savo",
  "NIVALA": "Pohjois-Pohjanmaa",
  "NOROLA": "Etelä-Savo",
  "NUMMELA": "Uusimaa",
  "OULU": "Pohjois-Pohjanmaa",
  "PIHTIPUDAS": "Keski-Suomi",
  "PORI": "Satakunta",
  "PUDASJÄRVI": "Pohjois-Pohjanmaa",
  "PUNKAHARJU": "Etelä-Savo",
  "ROVANIEMI": "Lappi",
  "SALO": "Varsinais-Suomi",
  "SAVONLINNA": "Etelä-Savo",
  "SEINÄJOKI": "Etelä-Pohjanmaa",
  "SIMPELE": "Etelä-Karjala",
  "SÖÖRMARKKU": "Satakunta",
  "TUUSULA": "Uusimaa",
  "VAASA": "Pohjanmaa",
  "VARKAUS": "Pohjois-Savo",
  "VILPPULA": "Pirkanmaa",
};
