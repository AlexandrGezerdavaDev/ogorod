import type {
  GeneticsKey,
  GrowingKey,
  LocalizedText,
  PlantProfile,
  TaxonomyKey,
  UsageKey,
} from "@/features/kb/plant-profiles"

const dash: LocalizedText = { uk: "—", en: "—", ru: "—" }

function t(uk: string, en: string, ru: string): LocalizedText {
  return { uk, en, ru }
}

function section<K extends string>(
  keys: readonly K[],
  values?: Partial<Record<K, LocalizedText>>
): Record<K, LocalizedText> {
  return Object.fromEntries(
    keys.map((key) => [key, values?.[key] ?? dash])
  ) as Record<K, LocalizedText>
}

const TAXONOMY_KEYS = [
  "family",
  "genus",
  "species",
  "lifeCycle",
  "origin",
  "summary",
] as const satisfies readonly TaxonomyKey[]

const GROWING_KEYS = [
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
] as const satisfies readonly GrowingKey[]

const GENETICS_KEYS = [
  "varietyType",
  "pollination",
  "habit",
  "ploidy",
  "traits",
] as const satisfies readonly GeneticsKey[]

const USAGE_KEYS = [
  "purpose",
  "edibleParts",
  "culinary",
  "harvest",
  "storage",
] as const satisfies readonly UsageKey[]

function crop(
  imageUrl: string,
  taxonomy: Partial<Record<TaxonomyKey, LocalizedText>>,
  growing: Partial<Record<GrowingKey, LocalizedText>>,
  genetics: Partial<Record<GeneticsKey, LocalizedText>>,
  usage: Partial<Record<UsageKey, LocalizedText>>
): PlantProfile {
  return {
    imageUrl,
    taxonomy: section(TAXONOMY_KEYS, taxonomy),
    growing: section(GROWING_KEYS, growing),
    genetics: section(GENETICS_KEYS, genetics),
    usage: section(USAGE_KEYS, usage),
  }
}

const fabaceae = t("Бобові (Fabaceae)", "Fabaceae", "Бобовые (Fabaceae)")

export const LEGUME_PROFILES: Record<string, PlantProfile> = {
  kb_species_lens_culinaris: crop(
    "/plants/lentil.svg",
    {
      family: fabaceae,
      genus: t("Сочевиця (Lens)", "Lens", "Чечевица (Lens)"),
      species: t("Lens culinaris", "Lens culinaris", "Lens culinaris"),
      lifeCycle: t("Однорічна зернобобова", "Annual pulse", "Однолетняя зернобобовая"),
      origin: t("Близький Схід", "Near East", "Ближний Восток"),
      summary: t("Дрібнонасінна культура з високим білком.", "Small-seeded high-protein pulse.", "Мелкосеменная культура с высоким белком."),
    },
    {
      yield: t("1–2 т/га", "1–2 t/ha", "1–2 т/га"),
      plantTime: t("Березень–квітень", "March–April", "Март–апрель"),
      maturity: t("70–100 днів", "70–100 days", "70–100 дней"),
      watering: t("Посухостійка, волога в цвітіння", "Drought-tolerant; moisture at flowering", "Засухоустойчивая, влага в цветение"),
      soil: t("Легкі, не кислі, без застою", "Light, not acidic, no waterlogging", "Лёгкие, не кислые, без застоя"),
      climate: t("Прохолодно на старті, сухе дозрівання", "Cool start, dry ripening", "Прохладно на старте, сухое созревание"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–4 см", "3–4 cm", "3–4 см"),
      seedRate: t("60–90 кг/га", "60–90 kg/ha", "60–90 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Після зернових, не після бобових", "After cereals, not after legumes", "После зерновых, не после бобовых"),
      pests: t("Попелиця, кореневі гнилі, аскохітоз", "Aphids, root rot, ascochyta", "Тля, корневые гнили, аскохитоз"),
      fertilizer: t("Фосфор і калій, без надлишку азоту", "Phosphorus and potassium, little nitrogen", "Фосфор и калий, без избытка азота"),
    },
    {
      varietyType: t("Червоні, зелені, тарілчасті", "Red, green and plate types", "Красные, зелёные, тарелочные"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Низький кущ, дрібні стручки", "Low bush with small pods", "Низкий куст, мелкие стручки"),
      ploidy: t("Диплоїд, 2n = 14", "Diploid, 2n = 14", "Диплоид, 2n = 14"),
      traits: t("Азотфіксація, двосім’ядольні насіння", "Nitrogen fixation, two-cotyledon seed", "Азотфиксация, двусемядольные семена"),
    },
    {
      purpose: t("Їжа", "Food", "Еда"),
      edibleParts: t("Насіння", "Seed", "Семена"),
      culinary: t("Супи, пюре, гарнір", "Soups, puree, side dish", "Супы, пюре, гарнир"),
      harvest: t("Коли нижні стручки бурі, не осипати", "When lower pods brown, avoid shatter", "Когда нижние стручки бурые, не осыпать"),
      storage: t("Сухо, <14% вологи", "Dry, under 14% moisture", "Сухо, <14% влаги"),
    }
  ),
  kb_species_cicer_arietinum: crop(
    "/plants/chickpea.svg",
    {
      family: fabaceae,
      genus: t("Нут (Cicer)", "Cicer", "Нут (Cicer)"),
      species: t("Cicer arietinum", "Cicer arietinum", "Cicer arietinum"),
      lifeCycle: t("Однорічна зернобобова", "Annual pulse", "Однолетняя зернобобовая"),
      origin: t("Південно-Східна Туреччина", "Southeastern Turkey", "Юго-Восточная Турция"),
      summary: t("Посухостійкий нут для степу й городу.", "Drought-tolerant chickpea for steppe and garden.", "Засухоустойчивый нут для степи и огорода."),
    },
    {
      yield: t("1.5–2.5 т/га", "1.5–2.5 t/ha", "1.5–2.5 т/га"),
      plantTime: t("Квітень, ґрунт >8 °C", "April, soil above 8 °C", "Апрель, почва >8 °C"),
      maturity: t("90–120 днів", "90–120 days", "90–120 дней"),
      watering: t("Посухостійкий, не замочувати корінь", "Drought-tolerant, do not waterlog", "Засухоустойчивый, не замачивать корень"),
      soil: t("Легкі суглинки, pH 6.5–8", "Light loam, pH 6.5–8", "Лёгкие суглинки, pH 6.5–8"),
      climate: t("Тепле сухе літо", "Warm dry summer", "Тёплое сухое лето"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("6–8 см", "6–8 cm", "6–8 см"),
      seedRate: t("80–120 кг/га", "80–120 kg/ha", "80–120 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Після озимих зернових", "After winter cereals", "После озимых зерновых"),
      pests: t("Аскохітоз, совка, кореневі гнилі", "Ascochyta, armyworm, root rot", "Аскохитоз, совка, корневые гнили"),
      fertilizer: t("Фосфор, інокулянт бульбочок", "Phosphorus, rhizobium inoculant", "Фосфор, инокулянт клубеньков"),
    },
    {
      varietyType: t("Кабулі й десі", "Kabuli and desi types", "Кабули и деси"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Кущ 40–70 см, опушені стручки", "Bush 40–70 cm, hairy pods", "Куст 40–70 см, опушённые стручки"),
      ploidy: t("Диплоїд, 2n = 16", "Diploid, 2n = 16", "Диплоид, 2n = 16"),
      traits: t("Дзьобик на насінині, азотфіксація", "Beaked seed, nitrogen fixation", "Клювик на семени, азотфиксация"),
    },
    {
      purpose: t("Їжа", "Food", "Еда"),
      edibleParts: t("Насіння", "Seed", "Семена"),
      culinary: t("Хумус, варка, смаження", "Hummus, boiling, roasting", "Хумус, варка, жарка"),
      harvest: t("Коли рослина жовтіє, стручки сухі", "When the plant yellows and pods are dry", "Когда растение желтеет, стручки сухие"),
      storage: t("Сухо, прохолодно", "Dry, cool", "Сухо, прохладно"),
    }
  ),
  kb_species_glycine_max: crop(
    "/plants/soybean.svg",
    {
      family: fabaceae,
      genus: t("Соя (Glycine)", "Glycine", "Соя (Glycine)"),
      species: t("Glycine max", "Glycine max", "Glycine max"),
      lifeCycle: t("Однорічна олійна зернобобова", "Annual oilseed pulse", "Однолетняя масличная зернобобовая"),
      origin: t("Східна Азія", "East Asia", "Восточная Азия"),
      summary: t("Соя на білок, олію й корм.", "Soybean for protein, oil and feed.", "Соя на белок, масло и корм."),
    },
    {
      yield: t("2–3.5 т/га", "2–3.5 t/ha", "2–3.5 т/га"),
      plantTime: t("Травень, ґрунт >12 °C", "May, soil above 12 °C", "Май, почва >12 °C"),
      maturity: t("100–130 днів", "100–130 days", "100–130 дней"),
      watering: t("Критично цвітіння й налив бобів", "Critical at flowering and pod fill", "Критично цветение и налив бобов"),
      soil: t("Теплі чорноземи, pH 6–7", "Warm chernozem, pH 6–7", "Тёплые чернозёмы, pH 6–7"),
      climate: t("Тепло, чутлива до довжини дня", "Warm, day-length sensitive", "Тепло, чувствительна к длине дня"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–5 см", "3–5 cm", "3–5 см"),
      seedRate: t("80–120 кг/га, 50–70 рослин / м²", "80–120 kg/ha, 50–70 plants / m²", "80–120 кг/га, 50–70 растений / м²"),
      seedlings: t("Прямий посів, інокулянт", "Direct sow with inoculant", "Прямой посев, инокулянт"),
      companions: t("Після зернових, не після сої 2–3 роки", "After cereals, not after soy for 2–3 years", "После зерновых, не после сои 2–3 года"),
      pests: t("Акацієва вогнівка, іржа, склеротинія", "Pod borer, rust, white mold", "Акациевая огнёвка, ржавчина, склеротиния"),
      fertilizer: t("Фосфор, калій, інокулянт замість азоту", "Phosphorus, potassium, inoculant instead of N", "Фосфор, калий, инокулянт вместо азота"),
    },
    {
      varietyType: t("Ультраранні–середні, харчові й кормові", "Ultra-early to mid, food and feed", "Ультраранние–средние, пищевые и кормовые"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Кущ, трійчасте листя, боби з 2–4 насінинами", "Bush, trifoliate leaves, 2–4 seeds per pod", "Куст, тройчатые листья, бобы с 2–4 семенами"),
      ploidy: t("Диплоїд, 2n = 40", "Diploid, 2n = 40", "Диплоид, 2n = 40"),
      traits: t("Високий білок і олія, азотфіксація", "High protein and oil, nitrogen fixation", "Высокий белок и масло, азотфиксация"),
    },
    {
      purpose: t("Їжа, олія, корм", "Food, oil, fodder", "Еда, масло, корм"),
      edibleParts: t("Насіння; едамаме — зелені боби", "Seed; edamame is green pods", "Семена; эдамаме — зелёные бобы"),
      culinary: t("Тофу, олія, молоко, шрот", "Tofu, oil, milk, meal", "Тофу, масло, молоко, шрот"),
      harvest: t("Боби сухі, листя опало, вологість 12–14%", "Dry pods, leaves dropped, 12–14% moisture", "Бобы сухие, листья опали, влажность 12–14%"),
      storage: t("Сухо, прохолодно", "Dry, cool", "Сухо, прохладно"),
    }
  ),
  kb_species_lupinus_albus: crop(
    "/plants/lupin.svg",
    {
      family: fabaceae,
      genus: t("Люпин (Lupinus)", "Lupinus", "Люпин (Lupinus)"),
      species: t("Lupinus albus", "Lupinus albus", "Lupinus albus"),
      lifeCycle: t("Однорічна", "Annual", "Однолетняя"),
      origin: t("Середземномор’я", "Mediterranean", "Средиземноморье"),
      summary: t("Білий люпин на зерно, корм і сидерат.", "White lupin for grain, feed and green manure.", "Белый люпин на зерно, корм и сидерат."),
    },
    {
      yield: t("2–3.5 т/га зерна", "2–3.5 t/ha grain", "2–3.5 т/га зерна"),
      plantTime: t("Березень–квітень", "March–April", "Март–апрель"),
      maturity: t("110–140 днів", "110–140 days", "110–140 дней"),
      watering: t("Посухостійкий після укорінення", "Drought-tolerant once rooted", "Засухоустойчивый после укоренения"),
      soil: t("Легкі, навіть кислі; боїться вапна", "Light, even acidic; dislikes lime", "Лёгкие, даже кислые; боится извести"),
      climate: t("Помірний, не спекотний цвіт", "Temperate, not hot at flowering", "Умеренный, не жаркое цветение"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–4 см", "3–4 cm", "3–4 см"),
      seedRate: t("180–220 кг/га", "180–220 kg/ha", "180–220 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Сидерат перед зерновими й картоплею", "Green manure before cereals and potato", "Сидерат перед зерновыми и картофелем"),
      pests: t("Антракноз, попелиця, фузаріоз", "Anthracnose, aphids, fusarium", "Антракноз, тля, фузариоз"),
      fertilizer: t("Без азоту, фосфор на пісках", "No nitrogen; phosphorus on sands", "Без азота, фосфор на песках"),
    },
    {
      varietyType: t("Солодкі низькоалкалоїдні сорти", "Sweet low-alkaloid cultivars", "Сладкие низкоалкалоидные сорта"),
      pollination: t("Самозапильна, частково комахи", "Mostly selfing, some insects", "Самоопыляемая, частично насекомые"),
      habit: t("Пальчасте листя, білі китиці", "Palmate leaves, white racemes", "Пальчатые листья, белые кисти"),
      ploidy: t("Диплоїд, 2n = 50", "Diploid, 2n = 50", "Диплоид, 2n = 50"),
      traits: t("Глибоке коріння, білок; гіркі сорти — алкалоїди", "Deep roots, protein; bitter types have alkaloids", "Глубокие корни, белок; горькие сорта — алкалоиды"),
    },
    {
      purpose: t("Корм, їжа, сидерат", "Fodder, food, green manure", "Корм, еда, сидерат"),
      edibleParts: t("Солодке насіння після вимочування", "Sweet seed after soaking", "Сладкие семена после вымачивания"),
      culinary: t("Борошно, закуски; лише солодкі сорти", "Flour, snacks; sweet types only", "Мука, закуски; только сладкие сорта"),
      harvest: t("Боби сухі, нижні потріскують", "Dry pods, lower ones rattle", "Бобы сухие, нижние потрескивают"),
      storage: t("Сухо", "Dry", "Сухо"),
    }
  ),
  kb_species_trifolium_pratense: crop(
    "/plants/clover.svg",
    {
      family: fabaceae,
      genus: t("Конюшина (Trifolium)", "Trifolium", "Клевер (Trifolium)"),
      species: t("Trifolium pratense", "Trifolium pratense", "Trifolium pratense"),
      lifeCycle: t("Багаторічна кормова", "Perennial forage", "Многолетняя кормовая"),
      origin: t("Європа, Західна Азія", "Europe, West Asia", "Европа, Западная Азия"),
      summary: t("Конюшина лучна на сіно, випас і сидерат.", "Red clover for hay, grazing and green manure.", "Клевер луговой на сено, выпас и сидерат."),
    },
    {
      yield: t("4–8 т/га сіна за рік", "4–8 t/ha hay per year", "4–8 т/га сена за год"),
      plantTime: t("Березень–квітень або під покрив", "March–April or under a cover crop", "Март–апрель или под покров"),
      maturity: t("Перший укіс на 2-й місяць; повне використання 2–3 роки", "First cut in month 2; used 2–3 years", "Первый укос на 2-й месяц; использование 2–3 года"),
      watering: t("Любить вологу, не спеку й посуху", "Likes moisture, not heat and drought", "Любит влагу, не жару и засуху"),
      soil: t("Родючі суглинки, pH 6–7", "Fertile loam, pH 6–7", "Плодородные суглинки, pH 6–7"),
      climate: t("Помірний, зимує", "Temperate, overwinters", "Умеренный, зимует"),
      light: t("Сонце / легка півтінь", "Sun / light shade", "Солнце / лёгкая тень"),
      sowingDepth: t("1–1.5 см", "1–1.5 cm", "1–1.5 см"),
      seedRate: t("12–18 кг/га чистою сівбою", "12–18 kg/ha in pure stand", "12–18 кг/га чистым посевом"),
      seedlings: t("Прямий посів, дрібне насіння", "Direct sow, small seed", "Прямой посев, мелкие семена"),
      companions: t("З тимофіївкою, під покрив ячменю", "With timothy, under barley", "С тимофеевкой, под покров ячменя"),
      pests: t("Довгоносик, рак конюшини, борошниста роса", "Weevil, clover rot, powdery mildew", "Долгоносик, рак клевера, мучнистая роса"),
      fertilizer: t("Фосфор, калій, вапно; азот майже не потрібен", "P, K, lime; almost no nitrogen", "Фосфор, калий, известь; азот почти не нужен"),
    },
    {
      varietyType: t("Ранні двоукісні й пізні одноукісні", "Early two-cut and late one-cut", "Ранние двухукосные и поздние одноукосные"),
      pollination: t("Джмелі, перехресне", "Bumblebees, cross-pollinated", "Шмели, перекрёстное"),
      habit: t("Кущ із трійчастим листям і червоною головкою", "Bush with trifoliate leaves and a red head", "Куст с тройчатыми листьями и красной головкой"),
      ploidy: t("Диплоїд 2n = 14 або тетраплоїд", "Diploid 2n = 14 or tetraploid", "Диплоид 2n = 14 или тетраплоид"),
      traits: t("Азотфіксація, медонос", "Nitrogen fixation, bee forage", "Азотфиксация, медонос"),
    },
    {
      purpose: t("Корм, сидерат, мед", "Fodder, green manure, honey", "Корм, сидерат, мёд"),
      edibleParts: t("Молоді листки й квітки (рідко в їжу)", "Young leaves and flowers (rarely eaten)", "Молодые листья и цветки (редко в пищу)"),
      culinary: t("Чай із квіток, паростки", "Flower tea, sprouts", "Чай из цветков, ростки"),
      harvest: t("Укіс на початку цвітіння", "Cut at early bloom", "Укос в начале цветения"),
      storage: t("Сіно сухе, силос", "Dry hay, silage", "Сено сухое, силос"),
    }
  ),
  kb_species_medicago_sativa: crop(
    "/plants/alfalfa.svg",
    {
      family: fabaceae,
      genus: t("Люцерна (Medicago)", "Medicago", "Люцерна (Medicago)"),
      species: t("Medicago sativa", "Medicago sativa", "Medicago sativa"),
      lifeCycle: t("Багаторічна кормова", "Perennial forage", "Многолетняя кормовая"),
      origin: t("Центральна Азія, Іран", "Central Asia, Iran", "Центральная Азия, Иран"),
      summary: t("Люцерна — основна багаторічна бобова на сіно.", "Alfalfa is the main perennial forage legume.", "Люцерна — основная многолетняя бобовая на сено."),
    },
    {
      yield: t("8–15 т/га сіна за 3–4 укоси", "8–15 t/ha hay in 3–4 cuts", "8–15 т/га сена за 3–4 укоса"),
      plantTime: t("Березень–травень, без покриву краще", "March–May, better without cover", "Март–май, без покрова лучше"),
      maturity: t("Перший укіс за 60–70 днів; живе 4–6 років", "First cut in 60–70 days; stands 4–6 years", "Первый укос за 60–70 дней; живёт 4–6 лет"),
      watering: t("Глибоке коріння, полив підвищує укоси", "Deep roots; irrigation raises cuts", "Глубокие корни, полив повышает укосы"),
      soil: t("Не кислі, дреновані, pH 6.5–7.5", "Not acidic, drained, pH 6.5–7.5", "Не кислые, дренированные, pH 6.5–7.5"),
      climate: t("Посухостійка, боїться застою води взимку", "Drought-tolerant, hates winter waterlogging", "Засухоустойчивая, боится застоя воды зимой"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("1–2 см", "1–2 cm", "1–2 см"),
      seedRate: t("12–20 кг/га", "12–20 kg/ha", "12–20 кг/га"),
      seedlings: t("Прямий посів, інокулянт Sinorhizobium", "Direct sow with Sinorhizobium", "Прямой посев, инокулянт Sinorhizobium"),
      companions: t("Зі злаковими травами на випас", "With grasses for grazing", "Со злаковыми травами на выпас"),
      pests: t("Довгоносик, бура плямистість, фузаріоз", "Weevil, leaf spot, fusarium", "Долгоносик, бурая пятнистость, фузариоз"),
      fertilizer: t("Фосфор, калій, вапно; азот не давати", "P, K, lime; do not apply nitrogen", "Фосфор, калий, известь; азот не давать"),
    },
    {
      varietyType: t("Сорти за зимостійкістю й спокоєм", "Cultivars by winter hardiness and dormancy", "Сорта по зимостойкости и покою"),
      pollination: t("Бджоли, перехресне", "Bees, cross-pollinated", "Пчёлы, перекрёстное"),
      habit: t("Кущ, трійчасте листя, фіолетові китиці", "Bush, trifoliate leaves, purple racemes", "Куст, тройчатые листья, фиолетовые кисти"),
      ploidy: t("Тетраплоїд, 2n = 32", "Tetraploid, 2n = 32", "Тетраплоид, 2n = 32"),
      traits: t("Стрижневий корінь на метри вниз, азотфіксація", "Taproot metres deep, nitrogen fixation", "Стержневой корень на метры вниз, азотфиксация"),
    },
    {
      purpose: t("Корм, сидерат", "Fodder, green manure", "Корм, сидерат"),
      edibleParts: t("Молоді паростки (мікрозелень)", "Young sprouts (microgreens)", "Молодые ростки (микрозелень)"),
      culinary: t("Паростки в салат; основне — сіно", "Sprouts in salad; mainly hay", "Ростки в салат; основное — сено"),
      harvest: t("Укіс на бутонізації–початку цвітіння", "Cut at bud to early bloom", "Укос на бутонизации–начале цветения"),
      storage: t("Сіно, сінаж, люцернове борошно", "Hay, haylage, alfalfa meal", "Сено, сенаж, люцерновая мука"),
    }
  ),
  kb_species_vicia_faba: crop(
    "/plants/fava.svg",
    {
      family: fabaceae,
      genus: t("Горошок / біб (Vicia)", "Vicia", "Горошек / боб (Vicia)"),
      species: t("Vicia faba", "Vicia faba", "Vicia faba"),
      lifeCycle: t("Однорічна зернобобова", "Annual pulse", "Однолетняя зернобобовая"),
      origin: t("Близький Схід, Середземномор’я", "Near East, Mediterranean", "Ближний Восток, Средиземноморье"),
      summary: t("Крупне насіння для городу, крупи й фуражу.", "Large seed for garden, groats and feed.", "Крупные семена для огорода, крупы и фуража."),
    },
    {
      yield: t("2–4 т/га; 1–2 кг з м² на городі", "2–4 t/ha; 1–2 kg / m² in the garden", "2–4 т/га; 1–2 кг с м² на огороде"),
      plantTime: t("Березень, якомога раніше", "March, as early as possible", "Март, как можно раньше"),
      maturity: t("90–120 днів", "90–120 days", "90–120 дней"),
      watering: t("Волога в цвітіння, не спека", "Moisture at flowering, not heat", "Влага в цветение, не жара"),
      soil: t("Важчі суглинки, вологі", "Heavier moist loams", "Более тяжёлые влажные суглинки"),
      climate: t("Прохолодно, боїться спеки >25 °C", "Cool; fears heat above 25 °C", "Прохладно, боится жары >25 °C"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("5–7 см", "5–7 cm", "5–7 см"),
      seedRate: t("200–300 кг/га; 10–15 рослин / м²", "200–300 kg/ha; 10–15 plants / m²", "200–300 кг/га; 10–15 растений / м²"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Картопля, кукурудза, салат", "Potato, corn, lettuce", "Картофель, кукуруза, салат"),
      pests: t("Попелиця чорна, шоколадні плями, гнилі", "Black aphid, chocolate spot, rots", "Чёрная тля, шоколадные пятна, гнили"),
      fertilizer: t("Фосфор, калій, без азоту", "Phosphorus, potassium, no nitrogen", "Фосфор, калий, без азота"),
    },
    {
      varietyType: t("Дрібнонасінні кормові й крупнонасінні столові", "Small-seeded feed and large table types", "Мелкосеменные кормовые и крупносеменные столовые"),
      pollination: t("Комахи, частково самозапилення", "Insects, partly selfing", "Насекомые, частично самоопыление"),
      habit: t("Пряме стебло 80–140 см, великі боби", "Upright stem 80–140 cm, large pods", "Прямой стебель 80–140 см, крупные бобы"),
      ploidy: t("Диплоїд, 2n = 12", "Diploid, 2n = 12", "Диплоид, 2n = 12"),
      traits: t("Азотфіксація, віцин у сирому насінні", "Nitrogen fixation; vicine in raw seed", "Азотфиксация, вицин в сырых семенах"),
    },
    {
      purpose: t("Їжа, корм", "Food, fodder", "Еда, корм"),
      edibleParts: t("Зелені боби, зріле насіння", "Green pods, mature seed", "Зелёные бобы, зрелые семена"),
      culinary: t("Варіння, тушкування; добре проварювати", "Boiling, stewing; cook thoroughly", "Варка, тушение; хорошо проваривать"),
      harvest: t("Зелені — налиті; зерно — чорні рубчики", "Green when filled; dry when hilum blackens", "Зелёные — налитые; зерно — чёрные рубчики"),
      storage: t("Сухе зерно; зелені — коротко", "Dry grain; greens briefly", "Сухое зерно; зелёные — кратко"),
    }
  ),
  kb_species_vicia_sativa: crop(
    "/plants/vetch.svg",
    {
      family: fabaceae,
      genus: t("Горошок (Vicia)", "Vicia", "Горошек (Vicia)"),
      species: t("Vicia sativa", "Vicia sativa", "Vicia sativa"),
      lifeCycle: t("Однорічна кормова", "Annual forage", "Однолетняя кормовая"),
      origin: t("Середземномор’я, Європа", "Mediterranean, Europe", "Средиземноморье, Европа"),
      summary: t("Вика на зелений корм, сіно й сидерат.", "Vetch for green feed, hay and green manure.", "Вика на зелёный корм, сено и сидерат."),
    },
    {
      yield: t("15–25 т/га зеленої маси", "15–25 t/ha green mass", "15–25 т/га зелёной массы"),
      plantTime: t("Березень яра; серпень–вересень озима суміш", "March spring; August–September winter mix", "Март яровая; август–сентябрь озимая смесь"),
      maturity: t("60–80 днів до укосу", "60–80 days to cutting", "60–80 дней до укоса"),
      watering: t("Любить вологу", "Likes moisture", "Любит влагу"),
      soil: t("Різні, крім дуже кислих і сухих пісків", "Many soils except very acid dry sand", "Разные, кроме очень кислых и сухих песков"),
      climate: t("Прохолодно, яра боїться спеки", "Cool; spring types dislike heat", "Прохладно, яровая боится жары"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–4 см", "3–4 cm", "3–4 см"),
      seedRate: t("80–120 кг/га чистою; у суміші з вівсом менше", "80–120 kg/ha pure; less in oat mix", "80–120 кг/га чистой; в смеси с овсом меньше"),
      seedlings: t("Прямий посів, часто з вівсом як опорою", "Direct sow, often with oat as support", "Прямой посев, часто с овсом как опорой"),
      companions: t("Овес, жито, гірчиця в сидераті", "Oat, rye, mustard in green manure", "Овёс, рожь, горчица в сидерате"),
      pests: t("Попелиця, борошниста роса, довгоносик", "Aphids, powdery mildew, weevil", "Тля, мучнистая роса, долгоносик"),
      fertilizer: t("Фосфор, без азоту", "Phosphorus, no nitrogen", "Фосфор, без азота"),
    },
    {
      varietyType: t("Ярі й озимі кормові сорти", "Spring and winter forage cultivars", "Яровые и озимые кормовые сорта"),
      pollination: t("Самозапильна, частково комахи", "Mostly selfing, some insects", "Самоопыляемая, частично насекомые"),
      habit: t("Слабка ліана з вусиками", "Weak vine with tendrils", "Слабая лиана с усиками"),
      ploidy: t("Диплоїд, 2n = 12", "Diploid, 2n = 12", "Диплоид, 2n = 12"),
      traits: t("Азотфіксація, швидка маса", "Nitrogen fixation, fast biomass", "Азотфиксация, быстрая масса"),
    },
    {
      purpose: t("Корм, сидерат", "Fodder, green manure", "Корм, сидерат"),
      edibleParts: t("Не для столу; зерно — корм", "Not a table crop; seed is feed", "Не для стола; зерно — корм"),
      culinary: t("Не харчова", "Not culinary", "Не пищевая"),
      harvest: t("Укіс на початку цвітіння; сидерат — до насіння", "Cut at early bloom; manure before seed set", "Укос в начале цветения; сидерат — до семян"),
      storage: t("Сіно, силос, заорювання", "Hay, silage, plough-in", "Сено, силос, запашка"),
    }
  ),
  kb_species_arachis_hypogaea: crop(
    "/plants/peanut.svg",
    {
      family: fabaceae,
      genus: t("Арахіс (Arachis)", "Arachis", "Арахис (Arachis)"),
      species: t("Arachis hypogaea", "Arachis hypogaea", "Arachis hypogaea"),
      lifeCycle: t("Однорічна", "Annual", "Однолетняя"),
      origin: t("Південна Америка", "South America", "Южная Америка"),
      summary: t("Арахіс зав’язує боби в ґрунті; олія й насіння.", "Peanut sets pods in soil; oil and seed.", "Арахис завязывает бобы в почве; масло и семена."),
    },
    {
      yield: t("1.5–3 т/га; 0.3–0.6 кг / м² на городі", "1.5–3 t/ha; 0.3–0.6 kg / m² in the garden", "1.5–3 т/га; 0.3–0.6 кг / м² на огороде"),
      plantTime: t("Травень, ґрунт >15 °C", "May, soil above 15 °C", "Май, почва >15 °C"),
      maturity: t("120–150 днів", "120–150 days", "120–150 дней"),
      watering: t("Рівномірно в цвітіння, сухо перед викопуванням", "Even at flowering, dry before digging", "Равномерно в цветение, сухо перед выкопкой"),
      soil: t("Легкий піщаний, теплий, pH 5.8–6.5", "Light sandy, warm, pH 5.8–6.5", "Лёгкий песчаный, тёплый, pH 5.8–6.5"),
      climate: t("Тепло, довге літо без заморозків", "Warm long frost-free summer", "Тепло, длинное лето без заморозков"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("5–6 см", "5–6 cm", "5–6 см"),
      seedRate: t("80–100 кг/га; 8–12 рослин / м²", "80–100 kg/ha; 8–12 plants / m²", "80–100 кг/га; 8–12 растений / м²"),
      seedlings: t("Прямий посів ядрами в оболонці", "Direct sow kernels in skins", "Прямой посев ядрами в оболочке"),
      companions: t("Кукурудза по краю, не затінювати", "Corn at the edge, do not shade", "Кукуруза по краю, не затенять"),
      pests: t("Гнилі бобів, трипси, попелиця", "Pod rots, thrips, aphids", "Гнили бобов, трипсы, тля"),
      fertilizer: t("Кальцій для наливу бобів, без свіжого гною", "Calcium for pod fill, no fresh manure", "Кальций для налива бобов, без свежего навоза"),
    },
    {
      varietyType: t("Кущові валенсія / раннер", "Bunch Valencia / runner types", "Кустовые валенсия / раннер"),
      pollination: t("Самозапильна; гінофор заглиблює зав’язь", "Selfing; gynophore buries the ovary", "Самоопыляемая; гинофор заглубляет завязь"),
      habit: t("Стелючий або кущовий, боби під землею", "Spreading or bunch, pods underground", "Стелющийся или кустовой, бобы под землёй"),
      ploidy: t("Тетраплоїд, 2n = 40", "Tetraploid, 2n = 40", "Тетраплоид, 2n = 40"),
      traits: t("Геокарпія, олія в насінні", "Geocarpy, oil in the seed", "Геокарпия, масло в семенах"),
    },
    {
      purpose: t("Їжа, олія", "Food, oil", "Еда, масло"),
      edibleParts: t("Насіння", "Seed", "Семена"),
      culinary: t("Смаження, паста, олія", "Roasting, butter, oil", "Жарка, паста, масло"),
      harvest: t("Коли кущ жовтіє, викопати й просушити", "When the bush yellows, dig and dry", "Когда куст желтеет, выкопать и просушить"),
      storage: t("Сухі боби в стручках, прохолодно", "Dry in pods, cool", "Сухие бобы в стручках, прохладно"),
    }
  ),
}
