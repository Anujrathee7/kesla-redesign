import type { StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import { FAMILY_KEYS, type FamilyKey } from "@/lib/routes";

import cranesPhoto from "../../../public/images/fam-cranes.jpg";
import loggingPhoto from "../../../public/images/fam-logging.jpg";
import tractorPhoto from "../../../public/images/fam-tractor.jpg";
import { FamilyPicker, type PickerOption } from "./family-picker";

const PHOTOS: Record<FamilyKey, StaticImageData> = {
  cranes: cranesPhoto,
  logging: loggingPhoto,
  tractor: tractorPhoto,
};

/** Resolves the copy on the server so the client picker ships no messages. */
export async function ProductsPicker() {
  const t = await getTranslations("Products");
  const tf = await getTranslations("Common.families");

  const options: PickerOption[] = FAMILY_KEYS.map((family) => ({
    family,
    base: t(`families.${family}.base`),
    name: tf(`${family}.name`),
    photo: PHOTOS[family],
    status: t("picker.status", { family: tf(`${family}.name`) }),
  }));

  return <FamilyPicker label={t("picker.label")} options={options} />;
}
