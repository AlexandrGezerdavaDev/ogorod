import type { Locale } from "@/i18n/config"

export type LocalizedText = Record<Locale, string>

export type PlantProfile = {
  imageUrl: string
  yield: LocalizedText
  plantTime: LocalizedText
  maturity: LocalizedText
  watering: LocalizedText
  soil: LocalizedText
  climate: LocalizedText
  light: LocalizedText
  sowingDepth: LocalizedText
}

const dash: LocalizedText = {
  uk: "—",
  en: "—",
  ru: "—",
}

const DEFAULT_PROFILE: PlantProfile = {
  imageUrl: "",
  yield: dash,
  plantTime: dash,
  maturity: dash,
  watering: dash,
  soil: dash,
  climate: dash,
  light: dash,
  sowingDepth: dash,
}

const PROFILES: Record<string, PlantProfile> = {
  kb_species_solanum_lycopersicum: {
    imageUrl: "/plants/tomato.svg",
    yield: {
      uk: "4–6 кг з куща",
      en: "4–6 kg per plant",
      ru: "4–6 кг с куста",
    },
    plantTime: {
      uk: "Квітень–травень (розсада)",
      en: "April–May (seedlings)",
      ru: "Апрель–май (рассада)",
    },
    maturity: {
      uk: "90–120 днів від сходів",
      en: "90–120 days from sprouting",
      ru: "90–120 дней от всходов",
    },
    watering: {
      uk: "2–3 рази на тиждень, рівномірно",
      en: "2–3 times a week, evenly",
      ru: "2–3 раза в неделю, равномерно",
    },
    soil: {
      uk: "Пухкий, родючий, pH 6.0–6.8",
      en: "Loose, fertile, pH 6.0–6.8",
      ru: "Рыхлый, плодородный, pH 6.0–6.8",
    },
    climate: {
      uk: "Теплолюбна, без заморозків",
      en: "Warmth-loving, frost-free",
      ru: "Теплолюбивая, без заморозков",
    },
    light: {
      uk: "Повне сонце, 6+ год",
      en: "Full sun, 6+ hours",
      ru: "Полное солнце, 6+ ч",
    },
    sowingDepth: {
      uk: "0.5–1 см",
      en: "0.5–1 cm",
      ru: "0.5–1 см",
    },
  },
  kb_species_cucumis_sativus: {
    imageUrl: "/plants/cucumber.svg",
    yield: {
      uk: "3–5 кг з куща",
      en: "3–5 kg per plant",
      ru: "3–5 кг с куста",
    },
    plantTime: {
      uk: "Травень–червень",
      en: "May–June",
      ru: "Май–июнь",
    },
    maturity: {
      uk: "45–60 днів",
      en: "45–60 days",
      ru: "45–60 дней",
    },
    watering: {
      uk: "Щодня в спеку, рясно",
      en: "Daily in heat, generously",
      ru: "Ежедневно в жару, обильно",
    },
    soil: {
      uk: "Легкий суглинок, вологий",
      en: "Light loam, moist",
      ru: "Лёгкий суглинок, влажный",
    },
    climate: {
      uk: "Тепло, захист від вітру",
      en: "Warm, sheltered from wind",
      ru: "Тепло, защита от ветра",
    },
    light: {
      uk: "Повне сонце / легка півтінь",
      en: "Full sun / light shade",
      ru: "Полное солнце / лёгкая тень",
    },
    sowingDepth: {
      uk: "1–2 см",
      en: "1–2 cm",
      ru: "1–2 см",
    },
  },
  kb_species_capsicum_annuum: {
    imageUrl: "/plants/pepper.svg",
    yield: {
      uk: "1–2 кг з куща",
      en: "1–2 kg per plant",
      ru: "1–2 кг с куста",
    },
    plantTime: {
      uk: "Травень (після заморозків)",
      en: "May (after frost)",
      ru: "Май (после заморозков)",
    },
    maturity: {
      uk: "70–90 днів",
      en: "70–90 days",
      ru: "70–90 дней",
    },
    watering: {
      uk: "2 рази на тиждень",
      en: "Twice a week",
      ru: "2 раза в неделю",
    },
    soil: {
      uk: "Дренований, багатий на органіку",
      en: "Drained, rich in organic matter",
      ru: "Дренированный, богатый органикой",
    },
    climate: {
      uk: "Теплолюбна культура",
      en: "Warmth-loving crop",
      ru: "Теплолюбивая культура",
    },
    light: {
      uk: "Повне сонце",
      en: "Full sun",
      ru: "Полное солнце",
    },
    sowingDepth: {
      uk: "0.5 см",
      en: "0.5 cm",
      ru: "0.5 см",
    },
  },
  kb_species_raphanus_sativus: {
    imageUrl: "/plants/radish.svg",
    yield: {
      uk: "1–2 кг / м²",
      en: "1–2 kg / m²",
      ru: "1–2 кг / м²",
    },
    plantTime: {
      uk: "Березень–травень, серпень",
      en: "March–May, August",
      ru: "Март–май, август",
    },
    maturity: {
      uk: "25–40 днів",
      en: "25–40 days",
      ru: "25–40 дней",
    },
    watering: {
      uk: "Регулярно, не пересушувати",
      en: "Regularly, do not dry out",
      ru: "Регулярно, не пересушивать",
    },
    soil: {
      uk: "Легкий, без кірки",
      en: "Light, no crust",
      ru: "Лёгкий, без корки",
    },
    climate: {
      uk: "Прохолодна весна / осінь",
      en: "Cool spring / autumn",
      ru: "Прохладная весна / осень",
    },
    light: {
      uk: "Сонце або півтінь",
      en: "Sun or partial shade",
      ru: "Солнце или полутень",
    },
    sowingDepth: {
      uk: "1–1.5 см",
      en: "1–1.5 cm",
      ru: "1–1.5 см",
    },
  },
  kb_species_ocimum_basilicum: {
    imageUrl: "/plants/basil.svg",
    yield: {
      uk: "200–400 г зелені з куща",
      en: "200–400 g greens per plant",
      ru: "200–400 г зелени с куста",
    },
    plantTime: {
      uk: "Травень–червень",
      en: "May–June",
      ru: "Май–июнь",
    },
    maturity: {
      uk: "40–60 днів до зрізу",
      en: "40–60 days to first cut",
      ru: "40–60 дней до срезки",
    },
    watering: {
      uk: "Помірно, коли підсихає верх",
      en: "Moderate, when topsoil dries",
      ru: "Умеренно, когда подсыхает верх",
    },
    soil: {
      uk: "Легкий, добре дренований",
      en: "Light, well drained",
      ru: "Лёгкий, хорошо дренированный",
    },
    climate: {
      uk: "Тепло, без холодних ночей",
      en: "Warm, no cold nights",
      ru: "Тепло, без холодных ночей",
    },
    light: {
      uk: "Повне сонце",
      en: "Full sun",
      ru: "Полное солнце",
    },
    sowingDepth: {
      uk: "0.3–0.5 см",
      en: "0.3–0.5 cm",
      ru: "0.3–0.5 см",
    },
  },
  kb_species_mentha_piperita: {
    imageUrl: "/plants/mint.svg",
    yield: {
      uk: "Багаторічний зріз зелені",
      en: "Perennial green harvests",
      ru: "Многолетняя срезка зелени",
    },
    plantTime: {
      uk: "Квітень–травень",
      en: "April–May",
      ru: "Апрель–май",
    },
    maturity: {
      uk: "З другого місяця росту",
      en: "From the second month of growth",
      ru: "Со второго месяца роста",
    },
    watering: {
      uk: "Часто, ґрунт вологий",
      en: "Often, keep soil moist",
      ru: "Часто, почва влажная",
    },
    soil: {
      uk: "Вологий суглинок",
      en: "Moist loam",
      ru: "Влажный суглинок",
    },
    climate: {
      uk: "Помірний, тіньовитривала",
      en: "Temperate, shade-tolerant",
      ru: "Умеренный, теневыносливая",
    },
    light: {
      uk: "Півтінь / сонце",
      en: "Partial shade / sun",
      ru: "Полутень / солнце",
    },
    sowingDepth: {
      uk: "Кореневище / 0.5 см",
      en: "Rhizome / 0.5 cm",
      ru: "Корневище / 0.5 см",
    },
  },
  kb_species_fragaria_ananassa: {
    imageUrl: "/plants/strawberry.svg",
    yield: {
      uk: "0.5–1 кг з куща за сезон",
      en: "0.5–1 kg per plant per season",
      ru: "0.5–1 кг с куста за сезон",
    },
    plantTime: {
      uk: "Квітень або серпень–вересень",
      en: "April or August–September",
      ru: "Апрель или август–сентябрь",
    },
    maturity: {
      uk: "Перший урожай на 2-й рік / ремонтантні — у рік посадки",
      en: "First crop in year 2 / everbearing in planting year",
      ru: "Первый урожай на 2-й год / ремонтантные — в год посадки",
    },
    watering: {
      uk: "2–3 рази на тиждень у плодоношення",
      en: "2–3 times a week while fruiting",
      ru: "2–3 раза в неделю в плодоношение",
    },
    soil: {
      uk: "Легкий, кислуватий pH 5.5–6.5",
      en: "Light, slightly acidic pH 5.5–6.5",
      ru: "Лёгкий, слабокислый pH 5.5–6.5",
    },
    climate: {
      uk: "Помірний, з укриттям на зиму",
      en: "Temperate, winter protection",
      ru: "Умеренный, с укрытием на зиму",
    },
    light: {
      uk: "Повне сонце",
      en: "Full sun",
      ru: "Полное солнце",
    },
    sowingDepth: {
      uk: "Розсада / вуса — на рівні ґрунту",
      en: "Transplants / runners at soil level",
      ru: "Рассада / усы — на уровне почвы",
    },
  },
}

export function getPlantProfile(speciesId: string | null | undefined): PlantProfile {
  if (!speciesId) {
    return DEFAULT_PROFILE
  }
  return PROFILES[speciesId] ?? DEFAULT_PROFILE
}

export function profileText(value: LocalizedText, locale: Locale) {
  return value[locale] ?? value.uk
}

export const PLANT_TRAIT_KEYS = [
  "yield",
  "plantTime",
  "maturity",
  "watering",
  "soil",
  "climate",
  "light",
  "sowingDepth",
] as const satisfies ReadonlyArray<keyof Omit<PlantProfile, "imageUrl">>

export type PlantTraitKey = (typeof PLANT_TRAIT_KEYS)[number]
