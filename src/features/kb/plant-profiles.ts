import type { Locale } from "@/i18n/config"

export type LocalizedText = Record<Locale, string>

const dash: LocalizedText = {
  uk: "—",
  en: "—",
  ru: "—",
}

function t(uk: string, en: string, ru: string): LocalizedText {
  return { uk, en, ru }
}

export const PROFILE_SECTIONS = [
  "taxonomy",
  "growing",
  "genetics",
  "usage",
] as const

export type ProfileSection = (typeof PROFILE_SECTIONS)[number]

export const SECTION_TRAIT_KEYS = {
  taxonomy: ["family", "genus", "species", "lifeCycle", "origin", "summary"],
  growing: [
    "plantTime",
    "sowingDepth",
    "light",
    "watering",
    "soil",
    "climate",
    "maturity",
    "yield",
    "seedRate",
    "seedlings",
    "companions",
    "pests",
    "fertilizer",
  ],
  genetics: ["varietyType", "pollination", "habit", "ploidy", "traits"],
  usage: ["purpose", "edibleParts", "culinary", "harvest", "storage"],
} as const

export type TaxonomyKey = (typeof SECTION_TRAIT_KEYS.taxonomy)[number]
export type GrowingKey = (typeof SECTION_TRAIT_KEYS.growing)[number]
export type GeneticsKey = (typeof SECTION_TRAIT_KEYS.genetics)[number]
export type UsageKey = (typeof SECTION_TRAIT_KEYS.usage)[number]
export type PlantTraitKey =
  | TaxonomyKey
  | GrowingKey
  | GeneticsKey
  | UsageKey

export type PlantProfile = {
  imageUrl: string
  taxonomy: Record<TaxonomyKey, LocalizedText>
  growing: Record<GrowingKey, LocalizedText>
  genetics: Record<GeneticsKey, LocalizedText>
  usage: Record<UsageKey, LocalizedText>
}

function section<K extends string>(
  keys: readonly K[],
  values?: Partial<Record<K, LocalizedText>>
): Record<K, LocalizedText> {
  return Object.fromEntries(
    keys.map((key) => [key, values?.[key] ?? dash])
  ) as Record<K, LocalizedText>
}

const DEFAULT_PROFILE: PlantProfile = {
  imageUrl: "",
  taxonomy: section(SECTION_TRAIT_KEYS.taxonomy),
  growing: section(SECTION_TRAIT_KEYS.growing),
  genetics: section(SECTION_TRAIT_KEYS.genetics),
  usage: section(SECTION_TRAIT_KEYS.usage),
}

const PROFILES: Record<string, PlantProfile> = {
  kb_species_solanum_lycopersicum: {
    imageUrl: "/plants/tomato.svg",
    taxonomy: section(SECTION_TRAIT_KEYS.taxonomy, {
      family: t("Пасльонові (Solanaceae)", "Solanaceae", "Паслёновые (Solanaceae)"),
      genus: t("Паслін (Solanum)", "Solanum", "Паслён (Solanum)"),
      species: t("Solanum lycopersicum", "Solanum lycopersicum", "Solanum lycopersicum"),
      lifeCycle: t("Однорічна плодова культура", "Annual fruit crop", "Однолетняя плодовая культура"),
      origin: t("Південна Америка, Анди", "South America, Andes", "Южная Америка, Анды"),
      summary: t(
        "Культивована рослина з їстівними ягодами — томатами.",
        "Cultivated plant with edible berries — tomatoes.",
        "Культивируемое растение со съедобными ягодами — томатами."
      ),
    }),
    growing: section(SECTION_TRAIT_KEYS.growing, {
      yield: t("4–6 кг з куща", "4–6 kg per plant", "4–6 кг с куста"),
      plantTime: t("Квітень–травень (розсада)", "April–May (seedlings)", "Апрель–май (рассада)"),
      maturity: t("90–120 днів від сходів", "90–120 days from sprouting", "90–120 дней от всходов"),
      watering: t("2–3 рази на тиждень, рівномірно", "2–3 times a week, evenly", "2–3 раза в неделю, равномерно"),
      soil: t("Пухкий, родючий, pH 6.0–6.8", "Loose, fertile, pH 6.0–6.8", "Рыхлый, плодородный, pH 6.0–6.8"),
      climate: t("Теплолюбна, без заморозків", "Warmth-loving, frost-free", "Теплолюбивая, без заморозков"),
      light: t("Повне сонце, 6+ год", "Full sun, 6+ hours", "Полное солнце, 6+ ч"),
      sowingDepth: t("0.5–1 см", "0.5–1 cm", "0.5–1 см"),

      seedRate: t("3–4 рослини / м²", "3–4 plants / m²", "3–4 растения / м²"),
      seedlings: t("Розсада 50–60 днів", "50–60 day seedlings", "Рассада 50–60 дней"),
      companions: t("Базилік, морква, цибуля", "Basil, carrot, onion", "Базилик, морковь, лук"),
      pests: t("Фітофтора, попелиця, білокрилка", "Late blight, aphids, whitefly", "Фитофтора, тля, белокрылка"),
      fertilizer: t("Калій і фосфор у плодоношення", "Potassium and phosphorus while fruiting", "Калий и фосфор в плодоношение"),
    }),
    genetics: section(SECTION_TRAIT_KEYS.genetics, {
      varietyType: t("Сорти та гібриди F1", "Open-pollinated and F1 hybrids", "Сорта и гибриды F1"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Детермінантні й індетермінантні форми", "Determinate and indeterminate habits", "Детерминантные и индетерминантные формы"),
      ploidy: t("Диплоїд, 2n = 24", "Diploid, 2n = 24", "Диплоид, 2n = 24"),
      traits: t("М’ясисті плоди, червона або рожева шкірка", "Fleshy fruit, red or pink skin", "Мясистые плоды, красная или розовая кожица"),
    }),
    usage: section(SECTION_TRAIT_KEYS.usage, {
      purpose: t("Їжа", "Food", "Еда"),
      edibleParts: t("Плоди", "Fruit", "Плоды"),
      culinary: t("Свіжі салати, соуси, сік, консервація", "Fresh salads, sauces, juice, canning", "Свежие салаты, соусы, сок, консервация"),
      harvest: t("Коли плоди забарвлені й пружні", "When fruit is colored and firm", "Когда плоды окрашены и упругие"),
      storage: t("Прохолодно, 10–13 °C, без холодильника", "Cool, 10–13 °C, not in the fridge", "Прохладно, 10–13 °C, без холодильника"),
    }),
  },
  kb_species_cucumis_sativus: {
    imageUrl: "/plants/cucumber.svg",
    taxonomy: section(SECTION_TRAIT_KEYS.taxonomy, {
      family: t("Гарбузові (Cucurbitaceae)", "Cucurbitaceae", "Тыквенные (Cucurbitaceae)"),
      genus: t("Огірок (Cucumis)", "Cucumis", "Огурец (Cucumis)"),
      species: t("Cucumis sativus", "Cucumis sativus", "Cucumis sativus"),
      lifeCycle: t("Однорічна ліана", "Annual vine", "Однолетняя лиана"),
      origin: t("Індія, Гімалаї", "India, Himalayas", "Индия, Гималаи"),
      summary: t(
        "Ліаноподібна культура з соковитими плодами для свіжого споживання та засолювання.",
        "Vining crop with juicy fruit for fresh eating and pickling.",
        "Лиановидная культура с сочными плодами для свежего потребления и засолки."
      ),
    }),
    growing: section(SECTION_TRAIT_KEYS.growing, {
      yield: t("3–5 кг з куща", "3–5 kg per plant", "3–5 кг с куста"),
      plantTime: t("Травень–червень", "May–June", "Май–июнь"),
      maturity: t("45–60 днів", "45–60 days", "45–60 дней"),
      watering: t("Щодня в спеку, рясно", "Daily in heat, generously", "Ежедневно в жару, обильно"),
      soil: t("Легкий суглинок, вологий", "Light loam, moist", "Лёгкий суглинок, влажный"),
      climate: t("Тепло, захист від вітру", "Warm, sheltered from wind", "Тепло, защита от ветра"),
      light: t("Повне сонце / легка півтінь", "Full sun / light shade", "Полное солнце / лёгкая тень"),
      sowingDepth: t("1–2 см", "1–2 cm", "1–2 см"),

      seedRate: t("2–3 рослини / м²", "2–3 plants / m²", "2–3 растения / м²"),
      seedlings: t("Прямий посів або розсада 20–25 днів", "Direct sow or 20–25 day seedlings", "Прямой посев или рассада 20–25 дней"),
      companions: t("Кріп, кукурудза, квасоля", "Dill, corn, beans", "Укроп, кукуруза, фасоль"),
      pests: t("Павутинний кліщ, борошниста роса", "Spider mite, powdery mildew", "Паутинный клещ, мучнистая роса"),
      fertilizer: t("Азот на старті, калій у плодоношення", "Nitrogen at start, potassium while fruiting", "Азот на старте, калий в плодоношение"),
    }),
    genetics: section(SECTION_TRAIT_KEYS.genetics, {
      varietyType: t("Бджолозапильні та партенокарпічні гібриди", "Bee-pollinated and parthenocarpic hybrids", "Пчелоопыляемые и партенокарпические гибриды"),
      pollination: t("Комахи або партенокарпія", "Insects or parthenocarpy", "Насекомые или партенокарпия"),
      habit: t("Ліана, потребує опори", "Vine, needs support", "Лиана, нужна опора"),
      ploidy: t("Диплоїд, 2n = 14", "Diploid, 2n = 14", "Диплоид, 2n = 14"),
      traits: t("Зелені циліндричні плоди, хрусткі", "Green cylindrical fruit, crisp", "Зелёные цилиндрические плоды, хрустящие"),
    }),
    usage: section(SECTION_TRAIT_KEYS.usage, {
      purpose: t("Їжа", "Food", "Еда"),
      edibleParts: t("Молоді плоди", "Young fruit", "Молодые плоды"),
      culinary: t("Свіжі салати, маринування, засолювання", "Fresh salads, pickling, brining", "Свежие салаты, маринование, засолка"),
      harvest: t("Регулярно, не перерощувати", "Regularly, do not let fruit overgrow", "Регулярно, не переращивать"),
      storage: t("Коротко, 7–10 °C, висока вологість", "Short term, 7–10 °C, high humidity", "Кратко, 7–10 °C, высокая влажность"),
    }),
  },
  kb_species_capsicum_annuum: {
    imageUrl: "/plants/pepper.svg",
    taxonomy: section(SECTION_TRAIT_KEYS.taxonomy, {
      family: t("Пасльонові (Solanaceae)", "Solanaceae", "Паслёновые (Solanaceae)"),
      genus: t("Перець (Capsicum)", "Capsicum", "Перец (Capsicum)"),
      species: t("Capsicum annuum", "Capsicum annuum", "Capsicum annuum"),
      lifeCycle: t("Однорічна в помірному кліматі", "Annual in temperate climates", "Однолетняя в умеренном климате"),
      origin: t("Центральна Америка", "Central America", "Центральная Америка"),
      summary: t(
        "Плодова культура солодких і гострих перців.",
        "Fruit crop of sweet and hot peppers.",
        "Плодовая культура сладких и острых перцев."
      ),
    }),
    growing: section(SECTION_TRAIT_KEYS.growing, {
      yield: t("1–2 кг з куща", "1–2 kg per plant", "1–2 кг с куста"),
      plantTime: t("Травень (після заморозків)", "May (after frost)", "Май (после заморозков)"),
      maturity: t("70–90 днів", "70–90 days", "70–90 дней"),
      watering: t("2 рази на тиждень", "Twice a week", "2 раза в неделю"),
      soil: t("Дренований, багатий на органіку", "Drained, rich in organic matter", "Дренированный, богатый органикой"),
      climate: t("Теплолюбна культура", "Warmth-loving crop", "Теплолюбивая культура"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("0.5 см", "0.5 cm", "0.5 см"),

      seedRate: t("4–6 рослин / м²", "4–6 plants / m²", "4–6 растений / м²"),
      seedlings: t("Розсада 60–70 днів", "60–70 day seedlings", "Рассада 60–70 дней"),
      companions: t("Базилік, морква, помідор", "Basil, carrot, tomato", "Базилик, морковь, томат"),
      pests: t("Попелиця, трипси, вершинна гниль", "Aphids, thrips, blossom-end rot", "Тля, трипсы, вершинная гниль"),
      fertilizer: t("Кальцій і калій, без надлишку азоту", "Calcium and potassium, avoid excess nitrogen", "Кальций и калий, без избытка азота"),
    }),
    genetics: section(SECTION_TRAIT_KEYS.genetics, {
      varietyType: t("Сорти та гібриди F1", "Open-pollinated and F1 hybrids", "Сорта и гибриды F1"),
      pollination: t("Самозапильна, можливе перехресне", "Mostly self-pollinating, some crossing", "Самоопыляемая, возможно перекрёстное"),
      habit: t("Кущ 40–80 см", "Bush 40–80 cm", "Куст 40–80 см"),
      ploidy: t("Диплоїд, 2n = 24", "Diploid, 2n = 24", "Диплоид, 2n = 24"),
      traits: t("Товсті стінки плоду, солодкий або гострий смак", "Thick fruit walls, sweet or hot flavor", "Толстые стенки плода, сладкий или острый вкус"),
    }),
    usage: section(SECTION_TRAIT_KEYS.usage, {
      purpose: t("Їжа, пряність", "Food, spice", "Еда, специя"),
      edibleParts: t("Плоди", "Fruit", "Плоды"),
      culinary: t("Свіжі, фарширування, лечо, сушіння", "Fresh, stuffing, stew, drying", "Свежие, фарширование, лечо, сушка"),
      harvest: t("Технічна або біологічна стиглість", "At technical or full ripeness", "Техническая или биологическая спелость"),
      storage: t("Холодильник 7–10 днів, або сушіння", "Fridge 7–10 days, or dry", "Холодильник 7–10 дней, или сушка"),
    }),
  },
  kb_species_raphanus_sativus: {
    imageUrl: "/plants/radish.svg",
    taxonomy: section(SECTION_TRAIT_KEYS.taxonomy, {
      family: t("Капустяні (Brassicaceae)", "Brassicaceae", "Капустные (Brassicaceae)"),
      genus: t("Редька (Raphanus)", "Raphanus", "Редька (Raphanus)"),
      species: t("Raphanus sativus", "Raphanus sativus", "Raphanus sativus"),
      lifeCycle: t("Швидка однорічна коренеплідна", "Fast annual root crop", "Быстрая однолетняя корнеплодная"),
      origin: t("Східна Азія", "East Asia", "Восточная Азия"),
      summary: t(
        "Швидкостигла культура з їстівним коренеплодом.",
        "Fast-maturing crop with an edible root.",
        "Скороспелая культура со съедобным корнеплодом."
      ),
    }),
    growing: section(SECTION_TRAIT_KEYS.growing, {
      yield: t("1–2 кг / м²", "1–2 kg / m²", "1–2 кг / м²"),
      plantTime: t("Березень–травень, серпень", "March–May, August", "Март–май, август"),
      maturity: t("25–40 днів", "25–40 days", "25–40 дней"),
      watering: t("Регулярно, не пересушувати", "Regularly, do not dry out", "Регулярно, не пересушивать"),
      soil: t("Легкий, без кірки", "Light, no crust", "Лёгкий, без корки"),
      climate: t("Прохолодна весна / осінь", "Cool spring / autumn", "Прохладная весна / осень"),
      light: t("Сонце або півтінь", "Sun or partial shade", "Солнце или полутень"),
      sowingDepth: t("1–1.5 см", "1–1.5 cm", "1–1.5 см"),

      seedRate: t("80–120 рослин / м²", "80–120 plants / m²", "80–120 растений / м²"),
      seedlings: t("Прямий посів у ґрунт", "Direct sow in soil", "Прямой посев в почву"),
      companions: t("Салат, морква, огірок", "Lettuce, carrot, cucumber", "Салат, морковь, огурец"),
      pests: t("Хрестоцвіті блішки, капустяна муха", "Flea beetles, cabbage fly", "Крестоцветные блошки, капустная муха"),
      fertilizer: t("Легка органіка, без свіжого гною", "Light organics, no fresh manure", "Лёгкая органика, без свежего навоза"),
    }),
    genetics: section(SECTION_TRAIT_KEYS.genetics, {
      varietyType: t("Відкрите запилення, рідше гібриди", "Mostly open-pollinated, some hybrids", "Открытое опыление, реже гибриды"),
      pollination: t("Перехресне, комахи", "Cross-pollinated by insects", "Перекрёстное, насекомые"),
      habit: t("Розетка листя, коренеплід", "Leaf rosette with a taproot", "Розетка листьев, корнеплод"),
      ploidy: t("Диплоїд, 2n = 18", "Diploid, 2n = 18", "Диплоид, 2n = 18"),
      traits: t("Швидкий коренеплід, гоструватий смак", "Fast root, mildly pungent flavor", "Быстрый корнеплод, островатый вкус"),
    }),
    usage: section(SECTION_TRAIT_KEYS.usage, {
      purpose: t("Їжа", "Food", "Еда"),
      edibleParts: t("Коренеплід, молоде листя", "Root, young leaves", "Корнеплод, молодые листья"),
      culinary: t("Салати, закуски, окріп недовго", "Salads, snacks, brief cooking", "Салаты, закуски, коротко в кипятке"),
      harvest: t("Не затримувати, інакше дерев’яніє", "Do not delay or it turns woody", "Не задерживать, иначе деревенеет"),
      storage: t("Коротко в холодильнику з гичкою зрізаною", "Short fridge storage, tops trimmed", "Кратко в холодильнике, ботва срезана"),
    }),
  },
  kb_species_ocimum_basilicum: {
    imageUrl: "/plants/basil.svg",
    taxonomy: section(SECTION_TRAIT_KEYS.taxonomy, {
      family: t("Глухокропивні (Lamiaceae)", "Lamiaceae", "Яснотковые (Lamiaceae)"),
      genus: t("Базилік (Ocimum)", "Ocimum", "Базилик (Ocimum)"),
      species: t("Ocimum basilicum", "Ocimum basilicum", "Ocimum basilicum"),
      lifeCycle: t("Однорічна пряна зелень", "Annual culinary herb", "Однолетняя пряная зелень"),
      origin: t("Тропічна Африка та Азія", "Tropical Africa and Asia", "Тропическая Африка и Азия"),
      summary: t(
        "Ароматична зелень для кухні та супроводу томатів.",
        "Aromatic herb for cooking and pairing with tomatoes.",
        "Ароматическая зелень для кухни и соседства с томатами."
      ),
    }),
    growing: section(SECTION_TRAIT_KEYS.growing, {
      yield: t("200–400 г зелені з куща", "200–400 g greens per plant", "200–400 г зелени с куста"),
      plantTime: t("Травень–червень", "May–June", "Май–июнь"),
      maturity: t("40–60 днів до зрізу", "40–60 days to first cut", "40–60 дней до срезки"),
      watering: t("Помірно, коли підсихає верх", "Moderate, when topsoil dries", "Умеренно, когда подсыхает верх"),
      soil: t("Легкий, добре дренований", "Light, well drained", "Лёгкий, хорошо дренированный"),
      climate: t("Тепло, без холодних ночей", "Warm, no cold nights", "Тепло, без холодных ночей"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("0.3–0.5 см", "0.3–0.5 cm", "0.3–0.5 см"),

      seedRate: t("9–16 рослин / м²", "9–16 plants / m²", "9–16 растений / м²"),
      seedlings: t("Розсада 30–40 днів", "30–40 day seedlings", "Рассада 30–40 дней"),
      companions: t("Помідор, перець, огірок", "Tomato, pepper, cucumber", "Томат, перец, огурец"),
      pests: t("Попелиця, равлики", "Aphids, slugs", "Тля, слизни"),
      fertilizer: t("Помірна органіка, без перегодовування", "Moderate organics, do not overfeed", "Умеренная органика, без перекорма"),
    }),
    genetics: section(SECTION_TRAIT_KEYS.genetics, {
      varietyType: t("Сорти за ароматом і кольором листя", "Cultivars by aroma and leaf color", "Сорта по аромату и цвету листьев"),
      pollination: t("Комахи", "Insect-pollinated", "Насекомые"),
      habit: t("Кущ 30–60 см", "Bush 30–60 cm", "Куст 30–60 см"),
      ploidy: t("Диплоїд, 2n = 48", "Diploid, 2n = 48", "Диплоид, 2n = 48"),
      traits: t("Ефірні олії, ніжне листя", "Essential oils, tender leaves", "Эфирные масла, нежные листья"),
    }),
    usage: section(SECTION_TRAIT_KEYS.usage, {
      purpose: t("Пряність, їжа", "Herb, food", "Специя, еда"),
      edibleParts: t("Листя, молоді пагони", "Leaves, young shoots", "Листья, молодые побеги"),
      culinary: t("Песто, салати, томати, олія", "Pesto, salads, tomatoes, oil", "Песто, салаты, томаты, масло"),
      harvest: t("До цвітіння, зрізати верхівки", "Before flowering, pinch tips", "До цветения, срезать верхушки"),
      storage: t("Свіжим коротко, або сушіння / заморозка", "Briefly fresh, or dry / freeze", "Свежим коротко, или сушка / заморозка"),
    }),
  },
  kb_species_mentha_piperita: {
    imageUrl: "/plants/mint.svg",
    taxonomy: section(SECTION_TRAIT_KEYS.taxonomy, {
      family: t("Глухокропивні (Lamiaceae)", "Lamiaceae", "Яснотковые (Lamiaceae)"),
      genus: t("М’ята (Mentha)", "Mentha", "Мята (Mentha)"),
      species: t("Mentha × piperita", "Mentha × piperita", "Mentha × piperita"),
      lifeCycle: t("Багаторічна гібридна м’ята", "Perennial hybrid mint", "Многолетняя гибридная мята"),
      origin: t("Європа, природний гібрид", "Europe, a natural hybrid", "Европа, природный гибрид"),
      summary: t(
        "Ароматична багаторічна зелень із ментоловим смаком.",
        "Aromatic perennial herb with a menthol flavor.",
        "Ароматическая многолетняя зелень с ментоловым вкусом."
      ),
    }),
    growing: section(SECTION_TRAIT_KEYS.growing, {
      yield: t("Багаторічний зріз зелені", "Perennial green harvests", "Многолетняя срезка зелени"),
      plantTime: t("Квітень–травень", "April–May", "Апрель–май"),
      maturity: t("З другого місяця росту", "From the second month of growth", "Со второго месяца роста"),
      watering: t("Часто, ґрунт вологий", "Often, keep soil moist", "Часто, почва влажная"),
      soil: t("Вологий суглинок", "Moist loam", "Влажный суглинок"),
      climate: t("Помірний, тіньовитривала", "Temperate, shade-tolerant", "Умеренный, теневыносливая"),
      light: t("Півтінь / сонце", "Partial shade / sun", "Полутень / солнце"),
      sowingDepth: t("Кореневище / 0.5 см", "Rhizome / 0.5 cm", "Корневище / 0.5 см"),

      seedRate: t("1 кущ у контейнері — стримує розповзання", "One plant in a pot to contain spread", "1 куст в контейнере — сдерживает расползание"),
      seedlings: t("Поділ кореневища, живці", "Rhizome division, cuttings", "Деление корневища, черенки"),
      companions: t("Капуста (відлякує шкідників), окрема грядка", "Cabbage (pest deterrent), own bed", "Капуста (отпугивает вредителей), отдельная грядка"),
      pests: t("Іржа м’яти, попелиця", "Mint rust, aphids", "Ржавчина мяты, тля"),
      fertilizer: t("Компост навесні, помірно", "Compost in spring, moderately", "Компост весной, умеренно"),
    }),
    genetics: section(SECTION_TRAIT_KEYS.genetics, {
      varietyType: t("Стерильний гібрид (перцева м’ята)", "Sterile hybrid (peppermint)", "Стерильный гибрид (перечная мята)"),
      pollination: t("Насіння майже не зав’язує, розмноження вегетативне", "Rarely sets seed, propagated vegetatively", "Семена почти не завязывает, размножение вегетативное"),
      habit: t("Повзучі кореневища, швидко розростається", "Creeping rhizomes, spreads quickly", "Ползучие корневища, быстро разрастается"),
      ploidy: t("Триплоїд (гібрид Mentha aquatica × spicata)", "Triploid hybrid of M. aquatica × spicata", "Триплоид (гибрид Mentha aquatica × spicata)"),
      traits: t("Високий вміст ментолу", "High menthol content", "Высокое содержание ментола"),
    }),
    usage: section(SECTION_TRAIT_KEYS.usage, {
      purpose: t("Чай, пряність, аромат", "Tea, herb, aroma", "Чай, специя, аромат"),
      edibleParts: t("Листя, молоді пагони", "Leaves, young shoots", "Листья, молодые побеги"),
      culinary: t("Настої, десерти, соуси, лимонад", "Infusions, desserts, sauces, lemonade", "Настои, десерты, соусы, лимонад"),
      harvest: t("До цвітіння, кілька зрізів за сезон", "Before flowering, several cuts a season", "До цветения, несколько срезок за сезон"),
      storage: t("Сушіння в тіні або заморозка", "Shade-dry or freeze", "Сушка в тени или заморозка"),
    }),
  },
  kb_species_fragaria_ananassa: {
    imageUrl: "/plants/strawberry.svg",
    taxonomy: section(SECTION_TRAIT_KEYS.taxonomy, {
      family: t("Розові (Rosaceae)", "Rosaceae", "Розовые (Rosaceae)"),
      genus: t("Суниця (Fragaria)", "Fragaria", "Земляника (Fragaria)"),
      species: t("Fragaria × ananassa", "Fragaria × ananassa", "Fragaria × ananassa"),
      lifeCycle: t("Багаторічна ягідна культура", "Perennial berry crop", "Многолетняя ягодная культура"),
      origin: t("Садовий гібрид двох американських видів", "Garden hybrid of two American species", "Садовый гибрид двух американских видов"),
      summary: t(
        "Садова суниця з великими запашними ягодами.",
        "Garden strawberry with large fragrant berries.",
        "Садовая земляника с крупными душистыми ягодами."
      ),
    }),
    growing: section(SECTION_TRAIT_KEYS.growing, {
      yield: t("0.5–1 кг з куща за сезон", "0.5–1 kg per plant per season", "0.5–1 кг с куста за сезон"),
      plantTime: t("Квітень або серпень–вересень", "April or August–September", "Апрель или август–сентябрь"),
      maturity: t("Перший урожай на 2-й рік / ремонтантні — у рік посадки", "First crop in year 2 / everbearing in planting year", "Первый урожай на 2-й год / ремонтантные — в год посадки"),
      watering: t("2–3 рази на тиждень у плодоношення", "2–3 times a week while fruiting", "2–3 раза в неделю в плодоношение"),
      soil: t("Легкий, кислуватий pH 5.5–6.5", "Light, slightly acidic pH 5.5–6.5", "Лёгкий, слабокислый pH 5.5–6.5"),
      climate: t("Помірний, з укриттям на зиму", "Temperate, winter protection", "Умеренный, с укрытием на зиму"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("Розсада / вуса — на рівні ґрунту", "Transplants / runners at soil level", "Рассада / усы — на уровне почвы"),

      seedRate: t("5–6 рослин / м²", "5–6 plants / m²", "5–6 растений / м²"),
      seedlings: t("Вуса або касетна розсада", "Runners or plug plants", "Усы или кассетная рассада"),
      companions: t("Часник, шпинат, чорнобривці", "Garlic, spinach, marigold", "Чеснок, шпинат, бархатцы"),
      pests: t("Сіра гниль, суничний кліщ, птахи", "Grey mold, strawberry mite, birds", "Серая гниль, земляничный клещ, птицы"),
      fertilizer: t("Компост, калій після збору", "Compost, potassium after harvest", "Компост, калий после сбора"),
    }),
    genetics: section(SECTION_TRAIT_KEYS.genetics, {
      varietyType: t("Октаплоїдний садовий гібрид", "Octoploid garden hybrid", "Октаплоидный садовый гибрид"),
      pollination: t("Комахи, перехресне запилення покращує ягоду", "Insects; cross-pollination improves berries", "Насекомые, перекрёстное опыление улучшает ягоду"),
      habit: t("Розетка, розмноження вусами", "Rosette, spreads by runners", "Розетка, размножение усами"),
      ploidy: t("Октаплоїд, 2n = 56", "Octoploid, 2n = 56", "Октаплоид, 2n = 56"),
      traits: t("Великі ягоди, ремонтантні та короткоденні сорти", "Large berries; everbearing and short-day cultivars", "Крупные ягоды, ремонтантные и короткодневные сорта"),
    }),
    usage: section(SECTION_TRAIT_KEYS.usage, {
      purpose: t("Їжа, десерт", "Food, dessert", "Еда, десерт"),
      edibleParts: t("Ягоди (несправжній плід)", "Berries (accessory fruit)", "Ягоды (ложный плод)"),
      culinary: t("Свіжі, варення, заморозка, десерти", "Fresh, jam, freezing, desserts", "Свежие, варенье, заморозка, десерты"),
      harvest: t("У повній стиглості, вранці", "Fully ripe, in the morning", "В полной спелости, утром"),
      storage: t("Коротко в холоді, краще одразу їсти або заморозити", "Briefly chilled; eat or freeze soon", "Кратко в холоде, лучше сразу есть или заморозить"),
    }),
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
