import type { routing } from "@/i18n/routing";
import type career from "@/messages/en/career.json";
import type company from "@/messages/en/company.json";
import type contacts from "@/messages/en/contacts.json";
import type dealers from "@/messages/en/dealers.json";
import type common from "@/messages/en/common.json";
import type home from "@/messages/en/home.json";
import type news from "@/messages/en/news.json";
import type product from "@/messages/en/product.json";
import type products from "@/messages/en/products.json";
import type references from "@/messages/en/references.json";
import type timberCranes from "@/messages/en/timber-cranes.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      Common: typeof common;
      Home: typeof home;
      Products: typeof products;
      Company: typeof company;
      References: typeof references;
      Dealers: typeof dealers;
      TimberCranes: typeof timberCranes;
      Career: typeof career;
      News: typeof news;
      Contacts: typeof contacts;
      Product: typeof product;
    };
  }
}
