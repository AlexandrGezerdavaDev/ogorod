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

const poaceae = t("Злакові (Poaceae)", "Poaceae", "Злаковые (Poaceae)")
const polygonaceae = t("Гречкові (Polygonaceae)", "Polygonaceae", "Гречишные (Polygonaceae)")

export const CEREAL_PROFILES: Record<string, PlantProfile> = {
  kb_species_triticum_aestivum: crop(
    "/plants/wheat.svg",
    {
      family: poaceae,
      genus: t("Пшениця (Triticum)", "Triticum", "Пшеница (Triticum)"),
      species: t("Triticum aestivum", "Triticum aestivum", "Triticum aestivum"),
      lifeCycle: t("Однорічна, озима або яра", "Annual, winter or spring", "Однолетняя, озимая или яровая"),
      origin: t("Родючий півмісяць, селекція", "Fertile Crescent, then breeding", "Плодородный полумесяц, селекция"),
      summary: t("Основна хлібна зернова культура.", "The main bread cereal.", "Основная хлебная зерновая культура."),
    },
    {
      yield: t("4–7 т/га в полі", "4–7 t/ha in the field", "4–7 т/га в поле"),
      plantTime: t("Вересень озима; березень–квітень яра", "September winter; March–April spring", "Сентябрь озимая; март–апрель яровая"),
      maturity: t("Озима 240–280 днів; яра 90–110", "Winter 240–280 days; spring 90–110", "Озимая 240–280 дней; яровая 90–110"),
      watering: t("Критично кущіння й налив зерна", "Critical at tillering and grain fill", "Критично кущение и налив зерна"),
      soil: t("Чорнозем, pH 6.0–7.5", "Chernozem, pH 6.0–7.5", "Чернозём, pH 6.0–7.5"),
      climate: t("Помірний; озима потребує яровизації", "Temperate; winter types need vernalization", "Умеренный; озимой нужна яровизация"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–5 см", "3–5 cm", "3–5 см"),
      seedRate: t("180–250 кг/га", "180–250 kg/ha", "180–250 кг/га"),
      seedlings: t("Прямий посів у поле", "Direct sow in the field", "Прямой посев в поле"),
      companions: t("Після пари або бобових", "After fallow or legumes", "После пара или бобовых"),
      pests: t("Іржа, борошниста роса, фузаріоз колоса", "Rust, powdery mildew, Fusarium head blight", "Ржавчина, мучнистая роса, фузариоз колоса"),
      fertilizer: t("NPK за фазами; азот на кущіння й трубку", "NPK by stage; nitrogen at tillering and stem", "NPK по фазам; азот на кущение и трубку"),
    },
    {
      varietyType: t("Озимі й ярі м’які сорти", "Winter and spring bread cultivars", "Озимые и яровые мягкие сорта"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Злак із колосом", "Grass with an ear", "Злак с колосом"),
      ploidy: t("Гексаплоїд, 2n = 42", "Hexaploid, 2n = 42", "Гексаплоид, 2n = 42"),
      traits: t("Клейковина для хліба", "Gluten for bread", "Клейковина для хлеба"),
    },
    {
      purpose: t("Їжа, зерно", "Food, grain", "Еда, зерно"),
      edibleParts: t("Зерно", "Grain", "Зерно"),
      culinary: t("Борошно, хліб, крупа", "Flour, bread, groats", "Мука, хлеб, крупа"),
      harvest: t("Повна стиглість, вологість 14–16%", "Full ripeness, 14–16% moisture", "Полная спелость, влажность 14–16%"),
      storage: t("Сухо, <14% вологи", "Dry, under 14% moisture", "Сухо, <14% влаги"),
    }
  ),
  kb_species_triticum_durum: crop(
    "/plants/durum.svg",
    {
      family: poaceae,
      genus: t("Пшениця (Triticum)", "Triticum", "Пшеница (Triticum)"),
      species: t("Triticum durum", "Triticum durum", "Triticum durum"),
      lifeCycle: t("Однорічна, частіше яра", "Annual, usually spring", "Однолетняя, чаще яровая"),
      origin: t("Середземномор’я", "Mediterranean", "Средиземноморье"),
      summary: t("Тверда пшениця для макаронів і крупи.", "Durum wheat for pasta and groats.", "Твёрдая пшеница для макарон и крупы."),
    },
    {
      yield: t("3–5 т/га", "3–5 t/ha", "3–5 т/га"),
      plantTime: t("Березень–квітень", "March–April", "Март–апрель"),
      maturity: t("100–120 днів", "100–120 days", "100–120 дней"),
      watering: t("Посухостійкіша за м’яку, волога в налив", "More drought-tolerant; moisture at fill", "Засухоустойчивее мягкой, влага в налив"),
      soil: t("Теплі чорноземи степу", "Warm steppe chernozem", "Тёплые чернозёмы степи"),
      climate: t("Тепле сухе літо", "Warm dry summer", "Тёплое сухое лето"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("4–6 см", "4–6 cm", "4–6 см"),
      seedRate: t("180–220 кг/га", "180–220 kg/ha", "180–220 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Після чорного пару", "After black fallow", "После чёрного пара"),
      pests: t("Іржа, сажка, клоп-черепашка", "Rust, smut, sunn pest", "Ржавчина, головня, клоп-черепашка"),
      fertilizer: t("Фосфор і азот помірно", "Phosphorus and moderate nitrogen", "Фосфор и азот умеренно"),
    },
    {
      varietyType: t("Ярі тверді сорти", "Spring durum cultivars", "Яровые твёрдые сорта"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Остистий колос, скловидне зерно", "Awned ear, vitreous grain", "Остистый колос, стекловидное зерно"),
      ploidy: t("Тетраплоїд, 2n = 28", "Tetraploid, 2n = 28", "Тетраплоид, 2n = 28"),
      traits: t("Високий білок, жовтий ендосперм", "High protein, yellow endosperm", "Высокий белок, жёлтый эндосперм"),
    },
    {
      purpose: t("Їжа", "Food", "Еда"),
      edibleParts: t("Зерно", "Grain", "Зерно"),
      culinary: t("Макарони, кускус, крупа", "Pasta, couscous, groats", "Макароны, кускус, крупа"),
      harvest: t("Повна стиглість, скловидність", "Full ripeness, vitreous grain", "Полная спелость, стекловидность"),
      storage: t("Сухо, <14% вологи", "Dry, under 14% moisture", "Сухо, <14% влаги"),
    }
  ),
  kb_species_triticum_spelta: crop(
    "/plants/spelt.svg",
    {
      family: poaceae,
      genus: t("Пшениця (Triticum)", "Triticum", "Пшеница (Triticum)"),
      species: t("Triticum spelta", "Triticum spelta", "Triticum spelta"),
      lifeCycle: t("Однорічна, здебільшого озима", "Annual, mostly winter", "Однолетняя, в основном озимая"),
      origin: t("Близький Схід, Європа", "Near East, Europe", "Ближний Восток, Европа"),
      summary: t("Плівчаста пшениця з міцним колосом.", "Hulled wheat with a tough ear.", "Плёнчатая пшеница с прочным колосом."),
    },
    {
      yield: t("2.5–4.5 т/га", "2.5–4.5 t/ha", "2.5–4.5 т/га"),
      plantTime: t("Вересень–жовтень", "September–October", "Сентябрь–октябрь"),
      maturity: t("Пізніше м’якої пшениці", "Later than bread wheat", "Позже мягкой пшеницы"),
      watering: t("Посухо- й холодостійка", "Drought- and cold-tolerant", "Засухо- и холодостойкая"),
      soil: t("Бідніші ґрунти, ніж у м’якої", "Poorer soils than bread wheat", "Беднее почвы, чем у мягкой"),
      climate: t("Помірний, вологий", "Temperate, moist", "Умеренный, влажный"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("4–6 см", "4–6 cm", "4–6 см"),
      seedRate: t("200–250 кг/га в плівках", "200–250 kg/ha in hulls", "200–250 кг/га в плёнках"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Сівозміна з бобовими", "Rotation with legumes", "Севооборот с бобовыми"),
      pests: t("Іржа, борошниста роса — менше, ніж у м’якої", "Less rust and mildew than bread wheat", "Ржавчина, мучнистая роса — меньше, чем у мягкой"),
      fertilizer: t("Помірний азот, не вилягає так легко", "Moderate nitrogen, lodges less easily", "Умеренный азот, не полегает так легко"),
    },
    {
      varietyType: t("Озимі плівчасті сорти", "Winter hulled cultivars", "Озимые плёнчатые сорта"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Високий злак, ламкий колос при обмолоті", "Tall grass; ear brittle at threshing", "Высокий злак, ломкий колос при обмолоте"),
      ploidy: t("Гексаплоїд, 2n = 42", "Hexaploid, 2n = 42", "Гексаплоид, 2n = 42"),
      traits: t("Зерно в плівках, насичений смак", "Grain in hulls, rich flavour", "Зерно в плёнках, насыщенный вкус"),
    },
    {
      purpose: t("Їжа", "Food", "Еда"),
      edibleParts: t("Зерно після обрушення", "Grain after dehulling", "Зерно после обрушения"),
      culinary: t("Хліб, крупа, пластівці", "Bread, groats, flakes", "Хлеб, крупа, хлопья"),
      harvest: t("Повна стиглість, потім обрушення", "Full ripeness, then dehull", "Полная спелость, затем обрушение"),
      storage: t("У плівках довше лежить сухо", "Keeps longer dry in hulls", "В плёнках дольше лежит сухо"),
    }
  ),
  kb_species_secale_cereale: crop(
    "/plants/rye.svg",
    {
      family: poaceae,
      genus: t("Жито (Secale)", "Secale", "Рожь (Secale)"),
      species: t("Secale cereale", "Secale cereale", "Secale cereale"),
      lifeCycle: t("Однорічна, здебільшого озима", "Annual, mostly winter", "Однолетняя, в основном озимая"),
      origin: t("Анатолія, Європа", "Anatolia, Europe", "Анатолия, Европа"),
      summary: t("Холодостійка зернова й сидеральна культура.", "Cold-hardy grain and green-manure crop.", "Холодостойкая зерновая и сидеральная культура."),
    },
    {
      yield: t("3–5 т/га зерна", "3–5 t/ha grain", "3–5 т/га зерна"),
      plantTime: t("Вересень–початок жовтня", "September–early October", "Сентябрь–начало октября"),
      maturity: t("Липень наступного року", "July of the following year", "Июль следующего года"),
      watering: t("Посухостійке після укорінення", "Drought-tolerant once rooted", "Засухоустойчивая после укоренения"),
      soil: t("Кислі піски, бідні ґрунти", "Acid sands, poor soils", "Кислые пески, бедные почвы"),
      climate: t("Холодні зими, раннє відростання", "Cold winters, early spring growth", "Холодные зимы, раннее отрастание"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–4 см", "3–4 cm", "3–4 см"),
      seedRate: t("140–180 кг/га на зерно; густіше на сидерат", "140–180 kg/ha grain; denser as manure", "140–180 кг/га на зерно; гуще на сидерат"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Перед картоплею як сидерат", "Before potato as green manure", "Перед картофелем как сидерат"),
      pests: t("Іржа, снігова пліснява, ріжки", "Rust, snow mold, ergot", "Ржавчина, снежная плесень, спорынья"),
      fertilizer: t("Помірний азот, інакше вилягає", "Moderate nitrogen or it lodges", "Умеренный азот, иначе полегает"),
    },
    {
      varietyType: t("Озимі диплоїдні й тетраплоїдні", "Winter diploid and tetraploid", "Озимые диплоидные и тетраплоидные"),
      pollination: t("Перехресне, вітер", "Cross-pollinated by wind", "Перекрёстное, ветер"),
      habit: t("Високий злак, довгий колос", "Tall grass with a long ear", "Высокий злак, длинный колос"),
      ploidy: t("Диплоїд 2n = 14 або тетраплоїд", "Diploid 2n = 14 or tetraploid", "Диплоид 2n = 14 или тетраплоид"),
      traits: t("Алкалаза, кислий хліб, глибоке коріння", "Amylase, sour bread, deep roots", "Амилаза, кислый хлеб, глубокие корни"),
    },
    {
      purpose: t("Їжа, корм, сидерат", "Food, fodder, green manure", "Еда, корм, сидерат"),
      edibleParts: t("Зерно", "Grain", "Зерно"),
      culinary: t("Житній хліб, борошно, квас", "Rye bread, flour, kvass", "Ржаной хлеб, мука, квас"),
      harvest: t("Воскова–повна стиглість", "Waxy to full ripeness", "Восковая–полная спелость"),
      storage: t("Сухо; зерно гігроскопічне", "Dry; grain is hygroscopic", "Сухо; зерно гигроскопично"),
    }
  ),
  kb_species_hordeum_vulgare: crop(
    "/plants/barley.svg",
    {
      family: poaceae,
      genus: t("Ячмінь (Hordeum)", "Hordeum", "Ячмень (Hordeum)"),
      species: t("Hordeum vulgare", "Hordeum vulgare", "Hordeum vulgare"),
      lifeCycle: t("Однорічна, яра або озима", "Annual, spring or winter", "Однолетняя, яровая или озимая"),
      origin: t("Родючий півмісяць", "Fertile Crescent", "Плодородный полумесяц"),
      summary: t("Зерно на крупу, солод і фураж.", "Grain for groats, malt and feed.", "Зерно на крупу, солод и фураж."),
    },
    {
      yield: t("3.5–6 т/га", "3.5–6 t/ha", "3.5–6 т/га"),
      plantTime: t("Березень ярий; вересень озимий", "March spring; September winter", "Март яровой; сентябрь озимый"),
      maturity: t("Ярий 70–90 днів", "Spring 70–90 days", "Яровой 70–90 дней"),
      watering: t("Посухостійкий, волога в колосіння", "Drought-tolerant; moisture at heading", "Засухоустойчивый, влага в колошение"),
      soil: t("Легкі суглинки, не кислі", "Light loams, not acidic", "Лёгкие суглинки, не кислые"),
      climate: t("Прохолодно на старті", "Cool at the start", "Прохладно на старте"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–5 см", "3–5 cm", "3–5 см"),
      seedRate: t("160–220 кг/га", "160–220 kg/ha", "160–220 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Після просапних", "After row crops", "После пропашных"),
      pests: t("Іржа, борошниста роса, гельмінтоспоріоз", "Rust, powdery mildew, net blotch", "Ржавчина, мучнистая роса, гельминтоспориоз"),
      fertilizer: t("Азот помірно для пивоварного", "Moderate nitrogen for malting", "Азот умеренно для пивоваренного"),
    },
    {
      varietyType: t("Дворядний пивоварний і шестирядний фуражний", "Two-row malting and six-row feed", "Двурядный пивоваренный и шестирядный фуражный"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Остистий колос", "Awned ear", "Остистый колос"),
      ploidy: t("Диплоїд, 2n = 14", "Diploid, 2n = 14", "Диплоид, 2n = 14"),
      traits: t("Плівчасте зерно, ферменти солоду", "Hulled grain, malt enzymes", "Плёнчатое зерно, ферменты солода"),
    },
    {
      purpose: t("Їжа, солод, корм", "Food, malt, fodder", "Еда, солод, корм"),
      edibleParts: t("Зерно", "Grain", "Зерно"),
      culinary: t("Крупа, ячмінний хліб, пиво", "Groats, barley bread, beer", "Крупа, ячменный хлеб, пиво"),
      harvest: t("Повна стиглість, не осипати", "Full ripeness, avoid shatter", "Полная спелость, не осыпать"),
      storage: t("Сухо, <14.5% вологи", "Dry, under 14.5% moisture", "Сухо, <14.5% влаги"),
    }
  ),
  kb_species_avena_sativa: crop(
    "/plants/oat.svg",
    {
      family: poaceae,
      genus: t("Овес (Avena)", "Avena", "Овёс (Avena)"),
      species: t("Avena sativa", "Avena sativa", "Avena sativa"),
      lifeCycle: t("Однорічна яра", "Annual spring cereal", "Однолетняя яровая"),
      origin: t("Євразія", "Eurasia", "Евразия"),
      summary: t("Зерно на крупу, пластівці й зелений корм.", "Grain for groats, flakes and green feed.", "Зерно на крупу, хлопья и зелёный корм."),
    },
    {
      yield: t("2.5–4.5 т/га", "2.5–4.5 t/ha", "2.5–4.5 т/га"),
      plantTime: t("Березень–квітень, якомога раніше", "March–April, as early as possible", "Март–апрель, как можно раньше"),
      maturity: t("80–110 днів", "80–110 days", "80–110 дней"),
      watering: t("Любить вологу, не спеку", "Likes moisture, not heat", "Любит влагу, не жару"),
      soil: t("Кисліші ґрунти, ніж пшениця", "More acidic soils than wheat", "Кислее почвы, чем пшеница"),
      climate: t("Прохолодно, вологий клімат", "Cool, moist climate", "Прохладно, влажный климат"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–4 см", "3–4 cm", "3–4 см"),
      seedRate: t("150–200 кг/га", "150–200 kg/ha", "150–200 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Із горохом на зелений корм", "With pea for green feed", "С горохом на зелёный корм"),
      pests: t("Корончаста іржа, сажка, попелиця", "Crown rust, smut, aphids", "Корончатая ржавчина, головня, тля"),
      fertilizer: t("Азот помірно, калій на легких ґрунтах", "Moderate nitrogen; potassium on light soils", "Азот умеренно, калий на лёгких почвах"),
    },
    {
      varietyType: t("Плівчасті й голозерні", "Hulled and naked types", "Плёнчатые и голозёрные"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Розлога волоть", "Spreading panicle", "Раскидистая метёлка"),
      ploidy: t("Гексаплоїд, 2n = 42", "Hexaploid, 2n = 42", "Гексаплоид, 2n = 42"),
      traits: t("β-глюкани, плівки навколо зерна", "Beta-glucans, hulls around the grain", "β-глюканы, плёнки вокруг зерна"),
    },
    {
      purpose: t("Їжа, корм", "Food, fodder", "Еда, корм"),
      edibleParts: t("Зерно", "Grain", "Зерно"),
      culinary: t("Вівсянка, пластівці, толокно", "Porridge, flakes, oatmeal", "Овсянка, хлопья, толокно"),
      harvest: t("Повна стиглість верхньої волоті", "When the upper panicle is ripe", "Полная спелость верхней метёлки"),
      storage: t("Сухо; зерно швидко гіркне в теплі", "Dry; grain turns rancid in heat", "Сухо; зерно быстро горкнет в тепле"),
    }
  ),
  kb_species_oryza_sativa: crop(
    "/plants/rice.svg",
    {
      family: poaceae,
      genus: t("Рис (Oryza)", "Oryza", "Рис (Oryza)"),
      species: t("Oryza sativa", "Oryza sativa", "Oryza sativa"),
      lifeCycle: t("Однорічна", "Annual", "Однолетняя"),
      origin: t("Східна Азія", "East Asia", "Восточная Азия"),
      summary: t("Теплолюбна зернова культура заливних полів.", "Warm-season cereal of flooded fields.", "Теплолюбивая зерновая культура заливных полей."),
    },
    {
      yield: t("5–8 т/га на зрошенні", "5–8 t/ha under irrigation", "5–8 т/га на орошении"),
      plantTime: t("Квітень–травень, коли тепло", "April–May when warm", "Апрель–май, когда тепло"),
      maturity: t("120–150 днів", "120–150 days", "120–150 дней"),
      watering: t("Затоплення або постійна волога", "Flooding or constant moisture", "Затопление или постоянная влага"),
      soil: t("Важкі, що тримають воду", "Heavy soils that hold water", "Тяжёлые, держащие воду"),
      climate: t("Тепло, без холодних ночей", "Warm, no cold nights", "Тепло, без холодных ночей"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("1–2 см або розсада в чеки", "1–2 cm, or transplants in paddies", "1–2 см или рассада в чеки"),
      seedRate: t("150–200 кг/га прямим посівом", "150–200 kg/ha direct seeded", "150–200 кг/га прямым посевом"),
      seedlings: t("Прямий посів або розсада 25–30 днів", "Direct sow or 25–30 day seedlings", "Прямой посев или рассада 25–30 дней"),
      companions: t("Сівозміна з люцерною", "Rotation with alfalfa", "Севооборот с люцерной"),
      pests: t("Пірикуляріоз, кореневі гнилі", "Blast, root rots", "Пирикуляриоз, корневые гнили"),
      fertilizer: t("Азот дрібно, не пізно", "Split nitrogen, not late", "Азот дробно, не поздно"),
    },
    {
      varietyType: t("Індика й японіка; кругло- й довгозерні", "Indica and japonica; short- and long-grain", "Индика и японика; кругло- и длиннозёрные"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Злак із волоттю, вузли на стеблі", "Grass with a panicle and stem nodes", "Злак с метёлкой, узлы на стебле"),
      ploidy: t("Диплоїд, 2n = 24", "Diploid, 2n = 24", "Диплоид, 2n = 24"),
      traits: t("Крохмаль амілоза/амілопектин", "Amylose/amylopectin starch", "Крахмал амилоза/амилопектин"),
    },
    {
      purpose: t("Їжа", "Food", "Еда"),
      edibleParts: t("Зерно після обрушення", "Grain after milling", "Зерно после обрушения"),
      culinary: t("Каша, гарнір, борошно", "Porridge, side dish, flour", "Каша, гарнир, мука"),
      harvest: t("Воскова стиглість, злив чеків", "Waxy ripeness after draining", "Восковая спелость, слив чеков"),
      storage: t("Сухе обрушене зерно", "Dry milled grain", "Сухое обрушенное зерно"),
    }
  ),
  kb_species_panicum_miliaceum: crop(
    "/plants/millet.svg",
    {
      family: poaceae,
      genus: t("Просо (Panicum)", "Panicum", "Просо (Panicum)"),
      species: t("Panicum miliaceum", "Panicum miliaceum", "Panicum miliaceum"),
      lifeCycle: t("Однорічна", "Annual", "Однолетняя"),
      origin: t("Східна Азія, Центральна Азія", "East and Central Asia", "Восточная и Центральная Азия"),
      summary: t("Посухостійка круп’яна культура.", "Drought-tolerant groat cereal.", "Засухоустойчивая крупяная культура."),
    },
    {
      yield: t("1.5–3 т/га", "1.5–3 t/ha", "1.5–3 т/га"),
      plantTime: t("Травень, ґрунт >12 °C", "May, soil above 12 °C", "Май, почва >12 °C"),
      maturity: t("60–90 днів", "60–90 days", "60–90 дней"),
      watering: t("Посухостійке, критичний налив", "Drought-tolerant; fill is critical", "Засухоустойчивое, критичен налив"),
      soil: t("Легкі, теплі", "Light, warm", "Лёгкие, тёплые"),
      climate: t("Тепле літо степу", "Warm steppe summer", "Тёплое лето степи"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–4 см", "3–4 cm", "3–4 см"),
      seedRate: t("20–30 кг/га", "20–30 kg/ha", "20–30 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Після озимих або пару", "After winter cereals or fallow", "После озимых или пара"),
      pests: t("Іржа, просяний комарик", "Rust, millet midge", "Ржавчина, просяной комарик"),
      fertilizer: t("Азот помірно, фосфор на старті", "Moderate nitrogen, phosphorus at start", "Азот умеренно, фосфор на старте"),
    },
    {
      varietyType: t("Розлогі, стиснуті й комові волоті", "Spreading, contracted and club panicles", "Раскидистые, сжатые и комовые метёлки"),
      pollination: t("Самозапильна, частково вітер", "Mostly selfing, some wind", "Самоопыляемая, частично ветер"),
      habit: t("Кущистий злак із волоттю", "Tillering grass with a panicle", "Кустистый злак с метёлкой"),
      ploidy: t("Тетраплоїд, 2n = 36", "Tetraploid, 2n = 36", "Тетраплоид, 2n = 36"),
      traits: t("Дрібне плівчасте зерно, пшоно", "Small hulled grain, millet groats", "Мелкое плёнчатое зерно, пшено"),
    },
    {
      purpose: t("Їжа, корм", "Food, fodder", "Еда, корм"),
      edibleParts: t("Зерно (пшоно)", "Grain (millet groats)", "Зерно (пшено)"),
      culinary: t("Каша, хлібці", "Porridge, flatbreads", "Каша, хлебцы"),
      harvest: t("Коли зерно в верхівці тверде", "When grain at the tip is hard", "Когда зерно на верхушке твёрдое"),
      storage: t("Сухо після обрушення", "Dry after dehulling", "Сухо после обрушения"),
    }
  ),
  kb_species_sorghum_bicolor: crop(
    "/plants/sorghum.svg",
    {
      family: poaceae,
      genus: t("Сорго (Sorghum)", "Sorghum", "Сорго (Sorghum)"),
      species: t("Sorghum bicolor", "Sorghum bicolor", "Sorghum bicolor"),
      lifeCycle: t("Однорічна", "Annual", "Однолетняя"),
      origin: t("Африка", "Africa", "Африка"),
      summary: t("Посухостійке зерно, силос і біомаса.", "Drought-tolerant grain, silage and biomass.", "Засухоустойчивое зерно, силос и биомасса."),
    },
    {
      yield: t("3–6 т/га зерна; силосна маса вища", "3–6 t/ha grain; higher as silage", "3–6 т/га зерна; силосная масса выше"),
      plantTime: t("Травень, ґрунт >14 °C", "May, soil above 14 °C", "Май, почва >14 °C"),
      maturity: t("90–120 днів", "90–120 days", "90–120 дней"),
      watering: t("Дуже посухостійке", "Very drought-tolerant", "Очень засухоустойчивое"),
      soil: t("Теплі, не заболочені", "Warm, not waterlogged", "Тёплые, не заболоченные"),
      climate: t("Спекотне літо", "Hot summer", "Жаркое лето"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–5 см", "3–5 cm", "3–5 см"),
      seedRate: t("10–25 кг/га зернове; густіше силосне", "10–25 kg/ha grain; denser for silage", "10–25 кг/га зерновое; гуще силосное"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Після озимих", "After winter cereals", "После озимых"),
      pests: t("Попелиця, іржа, летюча сажка", "Aphids, rust, loose smut", "Тля, ржавчина, пыльная головня"),
      fertilizer: t("Азот і калій, як кукурудза але менше води", "Nitrogen and potassium, like maize with less water", "Азот и калий, как кукуруза, но меньше воды"),
    },
    {
      varietyType: t("Зернове, цукрове, віничне", "Grain, sweet and broom types", "Зерновое, сахарное, веничное"),
      pollination: t("Самозапильна, частково вітер", "Mostly selfing, some wind", "Самоопыляемая, частично ветер"),
      habit: t("Високе стебло, волоть", "Tall stem with a panicle", "Высокий стебель, метёлка"),
      ploidy: t("Диплоїд, 2n = 20", "Diploid, 2n = 20", "Диплоид, 2n = 20"),
      traits: t("Восковий наліт, інколи синильна кислота в молодому листі", "Waxy bloom; young leaves may have HCN", "Восковой налёт, иногда синильная кислота в молодой листве"),
    },
    {
      purpose: t("Їжа, корм, біомаса", "Food, fodder, biomass", "Еда, корм, биомасса"),
      edibleParts: t("Зерно; цукрове — сік стебла", "Grain; sweet types also stem sap", "Зерно; сахарное — сок стебля"),
      culinary: t("Каша, борошно без клейковини", "Porridge, gluten-free flour", "Каша, мука без клейковины"),
      harvest: t("Зерно — повна стиглість; силос — молочно-воскова", "Grain at full ripeness; silage at milk-wax", "Зерно — полная спелость; силос — молочно-восковая"),
      storage: t("Сухе зерно", "Dry grain", "Сухое зерно"),
    }
  ),
  kb_species_fagopyrum_esculentum: crop(
    "/plants/buckwheat.svg",
    {
      family: polygonaceae,
      genus: t("Гречка (Fagopyrum)", "Fagopyrum", "Гречиха (Fagopyrum)"),
      species: t("Fagopyrum esculentum", "Fagopyrum esculentum", "Fagopyrum esculentum"),
      lifeCycle: t("Однорічна круп’яна", "Annual groat crop", "Однолетняя крупяная"),
      origin: t("Південно-Західний Китай", "Southwest China", "Юго-Западный Китай"),
      summary: t("Гречка — псевдозлак для крупи й сидерату.", "Buckwheat is a pseudocereal for groats and green manure.", "Гречиха — псевдозлак для крупы и сидерата."),
    },
    {
      yield: t("1–2 т/га зерна", "1–2 t/ha grain", "1–2 т/га зерна"),
      plantTime: t("Травень–червень після заморозків", "May–June after frost", "Май–июнь после заморозков"),
      maturity: t("70–90 днів", "70–90 days", "70–90 дней"),
      watering: t("Волога в цвітіння, не спека", "Moisture at flowering, not heat", "Влага в цветение, не жара"),
      soil: t("Легкі, не вапновані надміру", "Light, not over-limed", "Лёгкие, без избытка извести"),
      climate: t("Помірний, боїться заморозків і спеки >25 °C", "Temperate; fears frost and heat above 25 °C", "Умеренный, боится заморозков и жары >25 °C"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–5 см", "3–5 cm", "3–5 см"),
      seedRate: t("70–100 кг/га", "70–100 kg/ha", "70–100 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Медонос біля пасіки; сидерат перед овочами", "Bee forage; green manure before vegetables", "Медонос у пасеки; сидерат перед овощами"),
      pests: t("Попелиця, кореневі гнилі, град осипає", "Aphids, root rot; hail shatters seed", "Тля, корневые гнили, град осыпает"),
      fertilizer: t("Без свіжого гною, калій корисний", "No fresh manure; potassium helps", "Без свежего навоза, калий полезен"),
    },
    {
      varietyType: t("Детермінантні й звичайні сорти", "Determinate and common cultivars", "Детерминантные и обычные сорта"),
      pollination: t("Комахи, диморфні квітки", "Insects, dimorphic flowers", "Насекомые, диморфные цветки"),
      habit: t("Гіллясте стебло, щиткоподібні суцвіття", "Branched stem, corymb-like flowers", "Ветвистый стебель, щитковидные соцветия"),
      ploidy: t("Диплоїд, 2n = 16", "Diploid, 2n = 16", "Диплоид, 2n = 16"),
      traits: t("Тригранний горішок, немає клейковини", "Triangular achene, no gluten", "Трёхгранный орешек, нет клейковины"),
    },
    {
      purpose: t("Їжа, сидерат, мед", "Food, green manure, honey", "Еда, сидерат, мёд"),
      edibleParts: t("Зерно (ядриця)", "Grain (groat)", "Зерно (ядрица)"),
      culinary: t("Каша, борошно, млинці", "Porridge, flour, pancakes", "Каша, мука, блины"),
      harvest: t("75% бурих зерен, рано вранці", "75% brown seed, early morning", "75% бурых зёрен, рано утром"),
      storage: t("Суха ядриця", "Dry groats", "Сухая ядрица"),
    }
  ),
  kb_species_triticosecale: crop(
    "/plants/triticale.svg",
    {
      family: poaceae,
      genus: t("Тритикале (× Triticosecale)", "× Triticosecale", "Тритикале (× Triticosecale)"),
      species: t("× Triticosecale", "× Triticosecale", "× Triticosecale"),
      lifeCycle: t("Однорічна, озима або яра", "Annual, winter or spring", "Однолетняя, озимая или яровая"),
      origin: t("Гібрид пшениці й жита", "Wheat × rye hybrid", "Гибрид пшеницы и ржи"),
      summary: t("Зернофуражна культура з зимостійкістю жита.", "Feed grain with rye winter hardiness.", "Зернофуражная культура с зимостойкостью ржи."),
    },
    {
      yield: t("4–7 т/га", "4–7 t/ha", "4–7 т/га"),
      plantTime: t("Вересень озиме; березень яре", "September winter; March spring", "Сентябрь озимое; март яровое"),
      maturity: t("Близько до пшениці", "Similar to wheat", "Близко к пшенице"),
      watering: t("Посухостійкіше за пшеницю", "More drought-tolerant than wheat", "Засухоустойчивее пшеницы"),
      soil: t("Бідніші й кисліші, ніж під пшеницю", "Poorer and more acidic than wheat", "Беднее и кислее, чем под пшеницу"),
      climate: t("Холодні зими", "Cold winters", "Холодные зимы"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("3–5 см", "3–5 cm", "3–5 см"),
      seedRate: t("180–220 кг/га", "180–220 kg/ha", "180–220 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Сівозміна як у зернових", "Same rotation as other cereals", "Севооборот как у зерновых"),
      pests: t("Іржа, борошниста роса — менше, ніж у пшениці", "Less rust and mildew than wheat", "Ржавчина, мучнистая роса — меньше, чем у пшеницы"),
      fertilizer: t("Азот як у пшениці, стежити за виляганням", "Nitrogen like wheat; watch lodging", "Азот как у пшеницы, следить за полеганием"),
    },
    {
      varietyType: t("Озимі гексаплоїдні сорти", "Winter hexaploid cultivars", "Озимые гексаплоидные сорта"),
      pollination: t("Самозапильна з частковим перехресним", "Mostly selfing, some outcrossing", "Самоопыляемая с частичным перекрёстным"),
      habit: t("Колос як у пшениці, ості як у жита", "Wheat-like ear, rye-like awns", "Колос как у пшеницы, ости как у ржи"),
      ploidy: t("Гексаплоїд, 2n = 42", "Hexaploid, 2n = 42", "Гексаплоид, 2n = 42"),
      traits: t("Вищий білок, ніж у жита; корм і хліб", "Higher protein than rye; feed and bread", "Выше белок, чем у ржи; корм и хлеб"),
    },
    {
      purpose: t("Корм, їжа", "Fodder, food", "Корм, еда"),
      edibleParts: t("Зерно", "Grain", "Зерно"),
      culinary: t("Комбікорм, хліб у суміші з пшеницею", "Feed, bread mixed with wheat", "Комбикорм, хлеб в смеси с пшеницей"),
      harvest: t("Повна стиглість", "Full ripeness", "Полная спелость"),
      storage: t("Сухо, як пшеницю", "Dry, like wheat", "Сухо, как пшеницу"),
    }
  ),
}
