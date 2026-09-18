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

const asteraceae = t("Айстрові (Asteraceae)", "Asteraceae", "Астровые (Asteraceae)")
const brassicaceae = t("Капустяні (Brassicaceae)", "Brassicaceae", "Капустные (Brassicaceae)")
const linaceae = t("Льонові (Linaceae)", "Linaceae", "Льновые (Linaceae)")
const papaveraceae = t("Макові (Papaveraceae)", "Papaveraceae", "Маковые (Papaveraceae)")

export const OILSEED_PROFILES: Record<string, PlantProfile> = {
  kb_species_helianthus_annuus: crop(
    "/plants/sunflower.svg",
    {
      family: asteraceae,
      genus: t("Соняшник (Helianthus)", "Helianthus", "Подсолнечник (Helianthus)"),
      species: t("Helianthus annuus", "Helianthus annuus", "Helianthus annuus"),
      lifeCycle: t("Однорічна олійна", "Annual oilseed", "Однолетняя масличная"),
      origin: t("Північна Америка", "North America", "Северная Америка"),
      summary: t(
        "Соняшник — головна олійна культура України.",
        "Sunflower is Ukraine's main oilseed crop.",
        "Подсолнечник — главная масличная культура Украины."
      ),
    },
    {
      yield: t("2–3.5 т/га насіння", "2–3.5 t/ha seed", "2–3.5 т/га семян"),
      plantTime: t("Квітень–травень, ґрунт >10 °C", "April–May, soil above 10 °C", "Апрель–май, почва >10 °C"),
      maturity: t("100–130 днів", "100–130 days", "100–130 дней"),
      watering: t("Критично бутонізація й налив", "Critical at budding and seed fill", "Критично бутонизация и налив"),
      soil: t("Чорноземи, pH 6–7.2, без перезволоження", "Chernozem, pH 6–7.2, no waterlogging", "Чернозёмы, pH 6–7.2, без переувлажнения"),
      climate: t("Тепло й сонце, степ і лісостеп", "Warm and sunny, steppe and forest-steppe", "Тепло и солнце, степь и лесостепь"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("5–7 см", "5–7 cm", "5–7 см"),
      seedRate: t("50–70 тис. рослин / га", "50–70 thousand plants / ha", "50–70 тыс. растений / га"),
      seedlings: t("Прямий посів, широкорядний", "Direct sow, wide rows", "Прямой посев, широкорядный"),
      companions: t("Після зернових, не після соняшника 6–8 років", "After cereals, not after sunflower for 6–8 years", "После зерновых, не после подсолнечника 6–8 лет"),
      pests: t("Вовчок, склеротинія, іржа, соняшникова вогнівка", "Broomrape, white mold, rust, sunflower moth", "Заразиха, склеротиния, ржавчина, огнёвка"),
      fertilizer: t("Азот помірно, фосфор і калій під посів", "Moderate N, P and K at sowing", "Азот умеренно, фосфор и калий под посев"),
    },
    {
      varietyType: t("Гібриди олійні, кондитерські, високолеїнові", "Oil, confectionery and high-oleic hybrids", "Гибриды масличные, кондитерские, высокоолеиновые"),
      pollination: t("Перехресне, комахи", "Cross-pollinated, insects", "Перекрёстное, насекомые"),
      habit: t("Один кошик на стеблі, 1.5–2.5 м", "Single head on a 1.5–2.5 m stem", "Одна корзинка на стебле, 1.5–2.5 м"),
      ploidy: t("Диплоїд, 2n = 34", "Diploid, 2n = 34", "Диплоид, 2n = 34"),
      traits: t("Висока олійність, фотоперіод, посухостійкість", "High oil content, photoperiod, drought tolerance", "Высокая масличность, фотопериод, засухоустойчивость"),
    },
    {
      purpose: t("Олія, шрот, насіння", "Oil, meal, seed", "Масло, шрот, семена"),
      edibleParts: t("Насіння, олія", "Seed, oil", "Семена, масло"),
      culinary: t("Рафінована олія, смажене насіння, халва", "Refined oil, roasted seed, halva", "Рафинированное масло, жареные семечки, халва"),
      harvest: t("Кошики бурі, вологість насіння 8–12%", "Heads brown, seed moisture 8–12%", "Корзинки бурые, влажность семян 8–12%"),
      storage: t("Сухо, до 8% вологи", "Dry, below 8% moisture", "Сухо, до 8% влаги"),
    }
  ),
  kb_species_brassica_napus: crop(
    "/plants/rapeseed.svg",
    {
      family: brassicaceae,
      genus: t("Капуста (Brassica)", "Brassica", "Капуста (Brassica)"),
      species: t("Brassica napus", "Brassica napus", "Brassica napus"),
      lifeCycle: t("Озимий або ярий однорічник", "Winter or spring annual", "Озимый или яровой однолетник"),
      origin: t("Середземномор'я / Європа", "Mediterranean / Europe", "Средиземноморье / Европа"),
      summary: t(
        "Ріпак — друга олійна України, озимий і ярий.",
        "Rapeseed is Ukraine's second oilseed, winter and spring types.",
        "Рапс — вторая масличная Украины, озимый и яровой."
      ),
    },
    {
      yield: t("Озимий 2.5–4 т/га, ярий 1.5–2.5 т/га", "Winter 2.5–4 t/ha, spring 1.5–2.5 t/ha", "Озимый 2.5–4 т/га, яровой 1.5–2.5 т/га"),
      plantTime: t("Озимий: серпень–вересень; ярий: березень–квітень", "Winter: Aug–Sep; spring: Mar–Apr", "Озимый: август–сентябрь; яровой: март–апрель"),
      maturity: t("Озимий 280–320 днів, ярий 90–110", "Winter 280–320 days, spring 90–110", "Озимый 280–320 дней, яровой 90–110"),
      watering: t("Не любить застою; критично цвітіння", "No standing water; critical at flowering", "Не любит застой; критично цветение"),
      soil: t("Середні суглинки, pH 6–7, без кислотності", "Medium loams, pH 6–7, not acid", "Средние суглинки, pH 6–7, без кислотности"),
      climate: t("Помірний; озимий потребує снігу або загартування", "Temperate; winter type needs snow or hardening", "Умеренный; озимому нужны снег или закалка"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("2–3 см", "2–3 cm", "2–3 см"),
      seedRate: t("0.6–1.2 млн схожих насінин / га", "0.6–1.2 million viable seeds / ha", "0.6–1.2 млн всхожих семян / га"),
      seedlings: t("Прямий посів, вузькорядний", "Direct sow, narrow rows", "Прямой посев, узкорядный"),
      companions: t("Після зернових, не після капустяних 4 роки", "After cereals, not after brassicas for 4 years", "После зерновых, не после капустных 4 года"),
      pests: t("Ріпаковий квіткоїд, кила, фомоз, склеротинія", "Pollen beetle, clubroot, phoma, white mold", "Рапсовый цветоед, кила, фомоз, склеротиния"),
      fertilizer: t("Азот дрібно, сірка обов'язкова, бор", "Split N, sulphur required, boron", "Азот дробно, сера обязательна, бор"),
    },
    {
      varietyType: t("00 (низький ерукова кислота й глюкозинолати), гібриди", "00 (low erucic acid and glucosinolates), hybrids", "00 (низкая эруковая кислота и глюкозинолаты), гибриды"),
      pollination: t("Переважно самозапилення, частина перехресного", "Mostly self, partly cross", "В основном самоопыление, часть перекрёстного"),
      habit: t("Розетка восени, стебло 1–1.8 м, стручки", "Autumn rosette, 1–1.8 m stem, siliques", "Розетка осенью, стебель 1–1.8 м, стручки"),
      ploidy: t("Амфідиплоїд, 2n = 38", "Amphidiploid, 2n = 38", "Амфидиплоид, 2n = 38"),
      traits: t("Холодостійкість озимих, висока олійність", "Winter hardiness, high oil content", "Холодостойкость озимых, высокая масличность"),
    },
    {
      purpose: t("Олія, біодизель, макуха", "Oil, biodiesel, cake", "Масло, биодизель, жмых"),
      edibleParts: t("Насіння (олія); зелена маса на корм", "Seed (oil); forage biomass", "Семена (масло); зелёная масса на корм"),
      culinary: t("Рапсова олія, маргарин", "Rapeseed oil, margarine", "Рапсовое масло, маргарин"),
      harvest: t("Стручки жовті, насіння чорне, вологість 8–12%", "Pods yellow, seed black, 8–12% moisture", "Стручки жёлтые, семена чёрные, влажность 8–12%"),
      storage: t("Сухо, прохолодно, тонкий шар", "Dry, cool, thin layer", "Сухо, прохладно, тонкий слой"),
    }
  ),
  kb_species_linum_usitatissimum: crop(
    "/plants/flax.svg",
    {
      family: linaceae,
      genus: t("Льон (Linum)", "Linum", "Лён (Linum)"),
      species: t("Linum usitatissimum", "Linum usitatissimum", "Linum usitatissimum"),
      lifeCycle: t("Однорічна олійна", "Annual oilseed", "Однолетняя масличная"),
      origin: t("Близький Схід", "Near East", "Ближний Восток"),
      summary: t(
        "Льон олійний — насіння на олію, макуху й клітковину.",
        "Oil flax is grown for seed oil, cake and fibre.",
        "Лён масличный — семена на масло, жмых и клетчатку."
      ),
    },
    {
      yield: t("1–1.8 т/га насіння", "1–1.8 t/ha seed", "1–1.8 т/га семян"),
      plantTime: t("Березень–квітень, рано", "March–April, early", "Март–апрель, рано"),
      maturity: t("85–110 днів", "85–110 days", "85–110 дней"),
      watering: t("Помірно; критично цвітіння", "Moderate; critical at flowering", "Умеренно; критично цветение"),
      soil: t("Легкі суглинки, pH 6–7", "Light loams, pH 6–7", "Лёгкие суглинки, pH 6–7"),
      climate: t("Прохолодна весна, лісостеп і північ степу", "Cool spring, forest-steppe and northern steppe", "Прохладная весна, лесостепь и север степи"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("2–3 см", "2–3 cm", "2–3 см"),
      seedRate: t("40–55 кг/га", "40–55 kg/ha", "40–55 кг/га"),
      seedlings: t("Прямий посів, суцільний", "Direct sow, solid stand", "Прямой посев, сплошной"),
      companions: t("Після зернових, не після льону 6–7 років", "After cereals, not after flax for 6–7 years", "После зерновых, не после льна 6–7 лет"),
      pests: t("Фузаріоз, іржа, трипси, льонниця", "Fusarium, rust, thrips, flax flea beetle", "Фузариоз, ржавчина, трипсы, льняная блошка"),
      fertilizer: t("Азот обережно, фосфор і калій", "Cautious N, phosphorus and potassium", "Азот осторожно, фосфор и калий"),
    },
    {
      varietyType: t("Олійні (кучерявець) і прядивні типи", "Oil (linseed) and fibre types", "Масличные (кудряш) и прядильные типы"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Гіллясте стебло 40–70 см, коробочки", "Branched 40–70 cm stem, capsules", "Ветвистый стебель 40–70 см, коробочки"),
      ploidy: t("Диплоїд, 2n = 30", "Diploid, 2n = 30", "Диплоид, 2n = 30"),
      traits: t("Омега-3 в олії, короткий вегетаційний період", "Omega-3 oil, short season", "Омега-3 в масле, короткий вегетационный период"),
    },
    {
      purpose: t("Олія, насіння, макуха", "Oil, seed, cake", "Масло, семена, жмых"),
      edibleParts: t("Насіння, олія", "Seed, oil", "Семена, масло"),
      culinary: t("Лляна олія, випічка, каша", "Linseed oil, baking, porridge", "Льняное масло, выпечка, каша"),
      harvest: t("Коробочки бурі, насіння гримить", "Capsules brown, seed rattles", "Коробочки бурые, семена гремят"),
      storage: t("Сухо; олія швидко гіркне, холодно", "Dry; oil turns rancid fast, keep cold", "Сухо; масло быстро горкнет, холодно"),
    }
  ),
  kb_species_sinapis_alba: crop(
    "/plants/mustard.svg",
    {
      family: brassicaceae,
      genus: t("Гірчиця (Sinapis)", "Sinapis", "Горчица (Sinapis)"),
      species: t("Sinapis alba", "Sinapis alba", "Sinapis alba"),
      lifeCycle: t("Однорічна олійна й сидерат", "Annual oilseed and green manure", "Однолетняя масличная и сидерат"),
      origin: t("Середземномор'я", "Mediterranean", "Средиземноморье"),
      summary: t(
        "Гірчиця біла — олія, приправа і швидкий сидерат.",
        "White mustard is oil, spice and a fast green manure.",
        "Горчица белая — масло, приправа и быстрый сидерат."
      ),
    },
    {
      yield: t("1–1.5 т/га насіння", "1–1.5 t/ha seed", "1–1.5 т/га семян"),
      plantTime: t("Квітень або пожнивно в липні–серпні", "April, or after harvest in July–August", "Апрель или пожнивно в июле–августе"),
      maturity: t("70–90 днів", "70–90 days", "70–90 дней"),
      watering: t("Посухостійка після сходів", "Drought-tolerant after emergence", "Засухоустойчива после всходов"),
      soil: t("Різні ґрунти, pH 5.5–7.5", "Various soils, pH 5.5–7.5", "Разные почвы, pH 5.5–7.5"),
      climate: t("Прохолодна весна, вся Україна", "Cool spring, all of Ukraine", "Прохладная весна, вся Украина"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("2–3 см", "2–3 cm", "2–3 см"),
      seedRate: t("10–16 кг/га на насіння, 18–25 кг/га на сидерат", "10–16 kg/ha for seed, 18–25 kg/ha as manure", "10–16 кг/га на семена, 18–25 кг/га на сидерат"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Після зернових; не перед капустою", "After cereals; not before cabbage", "После зерновых; не перед капустой"),
      pests: t("Блішки, квіткоїд, кила", "Flea beetles, pollen beetle, clubroot", "Блошки, цветоед, кила"),
      fertilizer: t("Невибаглива; сірка підвищує врожай насіння", "Undemanding; sulphur lifts seed yield", "Неприхотлива; сера повышает урожай семян"),
    },
    {
      varietyType: t("Олійні й сидеральні сорти", "Oil and green-manure cultivars", "Масличные и сидеральные сорта"),
      pollination: t("Перехресне, комахи", "Cross-pollinated, insects", "Перекрёстное, насекомые"),
      habit: t("Стебло 60–120 см, жовті квіти, опушені стручки", "60–120 cm stem, yellow flowers, hairy pods", "Стебель 60–120 см, жёлтые цветы, опушённые стручки"),
      ploidy: t("Диплоїд, 2n = 24", "Diploid, 2n = 24", "Диплоид, 2n = 24"),
      traits: t("Швидкий ріст, фітосанітарний ефект", "Fast growth, biofumigant effect", "Быстрый рост, фитосанитарный эффект"),
    },
    {
      purpose: t("Олія, приправа, сидерат", "Oil, spice, green manure", "Масло, приправа, сидерат"),
      edibleParts: t("Насіння", "Seed", "Семена"),
      culinary: t("Столова гірчиця, маринади", "Table mustard, pickles", "Столовая горчица, маринады"),
      harvest: t("Стручки жовті, насіння не осипається легко", "Pods yellow; seed does not shatter easily", "Стручки жёлтые, семена не сильно осыпаются"),
      storage: t("Сухо, герметично", "Dry, airtight", "Сухо, герметично"),
    }
  ),
  kb_species_brassica_juncea: crop(
    "/plants/brown-mustard.svg",
    {
      family: brassicaceae,
      genus: t("Капуста (Brassica)", "Brassica", "Капуста (Brassica)"),
      species: t("Brassica juncea", "Brassica juncea", "Brassica juncea"),
      lifeCycle: t("Однорічна олійна", "Annual oilseed", "Однолетняя масличная"),
      origin: t("Центральна Азія", "Central Asia", "Центральная Азия"),
      summary: t(
        "Сарептська гірчиця — теплолюбна олійна й гостра приправа.",
        "Brown mustard is a heat-loving oilseed and hot spice.",
        "Сарептская горчица — теплолюбивая масличная и острая приправа."
      ),
    },
    {
      yield: t("1.2–2 т/га насіння", "1.2–2 t/ha seed", "1.2–2 т/га семян"),
      plantTime: t("Квітень, ґрунт >8 °C", "April, soil above 8 °C", "Апрель, почва >8 °C"),
      maturity: t("80–100 днів", "80–100 days", "80–100 дней"),
      watering: t("Посухостійкіша за білу", "More drought-tolerant than white mustard", "Засухоустойчивее белой"),
      soil: t("Каштанові й чорноземи півдня, pH 6–7.5", "Southern chestnut soils and chernozem, pH 6–7.5", "Каштановые и чернозёмы юга, pH 6–7.5"),
      climate: t("Степ, спека переносить краще за ріпак", "Steppe; heat better than rapeseed", "Степь, жару переносит лучше рапса"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("2–3 см", "2–3 cm", "2–3 см"),
      seedRate: t("6–10 кг/га", "6–10 kg/ha", "6–10 кг/га"),
      seedlings: t("Прямий посів", "Direct sow", "Прямой посев"),
      companions: t("Після зернових, не після капустяних", "After cereals, not after brassicas", "После зерновых, не после капустных"),
      pests: t("Блішки, квіткоїд, альтернаріоз", "Flea beetles, pollen beetle, alternaria", "Блошки, цветоед, альтернариоз"),
      fertilizer: t("Азот помірно, сірка", "Moderate N, sulphur", "Азот умеренно, сера"),
    },
    {
      varietyType: t("Олійні й гірчичні сорти", "Oil and spice cultivars", "Масличные и горчичные сорта"),
      pollination: t("Само- і перехресне", "Self and cross", "Само- и перекрёстное"),
      habit: t("Стебло 1–1.5 м, жовті квіти, гладкі стручки", "1–1.5 m stem, yellow flowers, smooth pods", "Стебель 1–1.5 м, жёлтые цветы, гладкие стручки"),
      ploidy: t("Амфідиплоїд, 2n = 36", "Amphidiploid, 2n = 36", "Амфидиплоид, 2n = 36"),
      traits: t("Гостре насіння, жаростійкість", "Pungent seed, heat tolerance", "Острые семена, жаростойкость"),
    },
    {
      purpose: t("Олія, гостра гірчиця", "Oil, hot mustard", "Масло, острая горчица"),
      edibleParts: t("Насіння; молоде листя рідко", "Seed; young leaves rarely", "Семена; молодые листья редко"),
      culinary: t("Російська / сарептська гірчиця, олія", "Sarepta mustard, oil", "Сарептская горчица, масло"),
      harvest: t("Стручки бурі, вологість 10–12%", "Pods brown, 10–12% moisture", "Стручки бурые, влажность 10–12%"),
      storage: t("Сухо, герметично", "Dry, airtight", "Сухо, герметично"),
    }
  ),
  kb_species_camelina_sativa: crop(
    "/plants/camelina.svg",
    {
      family: brassicaceae,
      genus: t("Рижій (Camelina)", "Camelina", "Рыжик (Camelina)"),
      species: t("Camelina sativa", "Camelina sativa", "Camelina sativa"),
      lifeCycle: t("Однорічна олійна", "Annual oilseed", "Однолетняя масличная"),
      origin: t("Східна Європа / степ", "Eastern Europe / steppe", "Восточная Европа / степь"),
      summary: t(
        "Рижій — холодостійка дрібна олійна з омега-3.",
        "Camelina is a cold-hardy small oilseed rich in omega-3.",
        "Рыжик — холодостойкая мелкая масличная с омега-3."
      ),
    },
    {
      yield: t("1–2 т/га", "1–2 t/ha", "1–2 т/га"),
      plantTime: t("Березень–початок квітня; є озимі форми", "March–early April; winter forms exist", "Март–начало апреля; есть озимые формы"),
      maturity: t("80–100 днів", "80–100 days", "80–100 дней"),
      watering: t("Посухостійка, невибаглива", "Drought-tolerant, undemanding", "Засухоустойчива, неприхотлива"),
      soil: t("Бідні й піщані теж підходять, pH 5.5–7.5", "Poor and sandy soils ok, pH 5.5–7.5", "Бедные и песчаные тоже подходят, pH 5.5–7.5"),
      climate: t("Холодна весна, Полісся й лісостеп", "Cold spring, Polissia and forest-steppe", "Холодная весна, Полесье и лесостепь"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("1–2 см", "1–2 cm", "1–2 см"),
      seedRate: t("6–10 кг/га", "6–10 kg/ha", "6–10 кг/га"),
      seedlings: t("Прямий посів, дрібне насіння", "Direct sow, small seed", "Прямой посев, мелкие семена"),
      companions: t("Після зернових, добрий попередник", "After cereals, a good preceding crop", "После зерновых, хороший предшественник"),
      pests: t("Блішки, альтернаріоз; кила майже не вражає", "Flea beetles, alternaria; almost no clubroot", "Блошки, альтернариоз; кила почти не поражает"),
      fertilizer: t("Низькі норми азоту", "Low nitrogen rates", "Низкие нормы азота"),
    },
    {
      varietyType: t("Ярі й озимі", "Spring and winter", "Яровые и озимые"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Стебло 50–90 см, дрібні стручечки", "50–90 cm stem, small silicles", "Стебель 50–90 см, мелкие стручочки"),
      ploidy: t("Гексаплоїд, 2n = 40", "Hexaploid, 2n = 40", "Гексаплоид, 2n = 40"),
      traits: t("Короткий сезон, омега-3, біопаливо", "Short season, omega-3, biofuel", "Короткий сезон, омега-3, биотопливо"),
    },
    {
      purpose: t("Олія, біопаливо, макуха", "Oil, biofuel, cake", "Масло, биотопливо, жмых"),
      edibleParts: t("Насіння, олія", "Seed, oil", "Семена, масло"),
      culinary: t("Рижієва олія в салати, корм птиці", "Camelina oil for salads, poultry feed", "Рыжиковое масло в салаты, корм птице"),
      harvest: t("Стручечки жовті, осипання помірне", "Silicles yellow, moderate shatter", "Стручочки жёлтые, осыпание умеренное"),
      storage: t("Сухо; олія в холоді", "Dry; oil in the cold", "Сухо; масло в холоде"),
    }
  ),
  kb_species_carthamus_tinctorius: crop(
    "/plants/safflower.svg",
    {
      family: asteraceae,
      genus: t("Сафлор (Carthamus)", "Carthamus", "Сафлор (Carthamus)"),
      species: t("Carthamus tinctorius", "Carthamus tinctorius", "Carthamus tinctorius"),
      lifeCycle: t("Однорічна олійна", "Annual oilseed", "Однолетняя масличная"),
      origin: t("Близький Схід", "Near East", "Ближний Восток"),
      summary: t(
        "Сафлор — посухостійка олійна півдня України.",
        "Safflower is a drought-tolerant oilseed of southern Ukraine.",
        "Сафлор — засухоустойчивая масличная юга Украины."
      ),
    },
    {
      yield: t("1–1.5 т/га", "1–1.5 t/ha", "1–1.5 т/га"),
      plantTime: t("Квітень, ґрунт >8 °C", "April, soil above 8 °C", "Апрель, почва >8 °C"),
      maturity: t("110–140 днів", "110–140 days", "110–140 дней"),
      watering: t("Дуже посухостійкий, не любить мокрий ґрунт", "Very drought-tolerant, dislikes wet soil", "Очень засухоустойчив, не любит мокрую почву"),
      soil: t("Легкі й середні, південь, pH 6–8", "Light to medium southern soils, pH 6–8", "Лёгкие и средние, юг, pH 6–8"),
      climate: t("Спекотне сухе літо, степ", "Hot dry summer, steppe", "Жаркое сухое лето, степь"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("4–5 см", "4–5 cm", "4–5 см"),
      seedRate: t("15–25 кг/га, 200–300 тис. рослин / га", "15–25 kg/ha, 200–300 thousand plants / ha", "15–25 кг/га, 200–300 тыс. растений / га"),
      seedlings: t("Прямий посів, широкорядний", "Direct sow, wide rows", "Прямой посев, широкорядный"),
      companions: t("Після зернових, не після соняшника", "After cereals, not after sunflower", "После зерновых, не после подсолнечника"),
      pests: t("Іржа, попелиця, совки", "Rust, aphids, cutworms", "Ржавчина, тля, совки"),
      fertilizer: t("Помірний азот, фосфор", "Moderate N, phosphorus", "Умеренный азот, фосфор"),
    },
    {
      varietyType: t("Олійні безколючкові й фарбувальні", "Oil spineless and dye types", "Масличные бесколючковые и красильные"),
      pollination: t("Само- і перехресне, комахи", "Self and cross, insects", "Само- и перекрёстное, насекомые"),
      habit: t("Гіллясте стебло 60–120 см, колючі кошики", "Branched 60–120 cm stem, spiny heads", "Ветвистый стебель 60–120 см, колючие корзинки"),
      ploidy: t("Диплоїд, 2n = 24", "Diploid, 2n = 24", "Диплоид, 2n = 24"),
      traits: t("Лінолева олія, посухостійкість", "Linoleic oil, drought tolerance", "Линолевое масло, засухоустойчивость"),
    },
    {
      purpose: t("Олія; пелюстки — барвник", "Oil; petals as dye", "Масло; лепестки — краситель"),
      edibleParts: t("Насіння, олія", "Seed, oil", "Семена, масло"),
      culinary: t("Сафлорова олія для смаження", "Safflower oil for frying", "Сафлоровое масло для жарки"),
      harvest: t("Кошики сухі, насіння тверде", "Heads dry, seed hard", "Корзинки сухие, семена твёрдые"),
      storage: t("Сухо", "Dry", "Сухо"),
    }
  ),
  kb_species_papaver_somniferum: crop(
    "/plants/poppy.svg",
    {
      family: papaveraceae,
      genus: t("Мак (Papaver)", "Papaver", "Мак (Papaver)"),
      species: t("Papaver somniferum", "Papaver somniferum", "Papaver somniferum"),
      lifeCycle: t("Однорічна олійна", "Annual oilseed", "Однолетняя масличная"),
      origin: t("Середземномор'я / Мала Азія", "Mediterranean / Asia Minor", "Средиземноморье / Малая Азия"),
      summary: t(
        "Мак олійний — харчове насіння й олія, традиційна культура України.",
        "Oil poppy is grown for culinary seed and oil, a traditional Ukrainian crop.",
        "Мак масличный — пищевые семена и масло, традиционная культура Украины."
      ),
    },
    {
      yield: t("0.8–1.2 т/га насіння", "0.8–1.2 t/ha seed", "0.8–1.2 т/га семян"),
      plantTime: t("Березень–квітень, можна під зиму", "March–April, or late autumn", "Март–апрель, можно под зиму"),
      maturity: t("100–120 днів", "100–120 days", "100–120 дней"),
      watering: t("Рівномірно до цвітіння, потім сухіше", "Even until flowering, then drier", "Равномерно до цветения, затем суше"),
      soil: t("Пухкі родючі, pH 6–7.5, без кірки", "Loose fertile, pH 6–7.5, no crust", "Рыхлые плодородные, pH 6–7.5, без корки"),
      climate: t("Прохолодна весна, лісостеп", "Cool spring, forest-steppe", "Прохладная весна, лесостепь"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("0.5–1.5 см", "0.5–1.5 cm", "0.5–1.5 см"),
      seedRate: t("1.5–3 кг/га", "1.5–3 kg/ha", "1.5–3 кг/га"),
      seedlings: t("Прямий посів, дрібне насіння, проривання", "Direct sow, tiny seed, thin later", "Прямой посев, мелкие семена, прорывка"),
      companions: t("Після зернових і картоплі, не після маку", "After cereals and potato, not after poppy", "После зерновых и картофеля, не после мака"),
      pests: t("Сіра гниль коробочок, попелиця, маковий прихованохоботник", "Capsule mold, aphids, poppy weevil", "Серая гниль коробочек, тля, скрытнохоботник"),
      fertilizer: t("Азот до бутонізації, калій на налив", "N until budding, K at seed fill", "Азот до бутонизации, калий на налив"),
    },
    {
      varietyType: t("Харчові олійні сорти з сухими коробочками", "Culinary oil cultivars with dry capsules", "Пищевые масличные сорта с сухими коробочками"),
      pollination: t("Самозапильна", "Self-pollinating", "Самоопыляемая"),
      habit: t("Стебло 80–130 см, коробочка з насінням", "80–130 cm stem, seed capsule", "Стебель 80–130 см, коробочка с семенами"),
      ploidy: t("Диплоїд, 2n = 22", "Diploid, 2n = 22", "Диплоид, 2n = 22"),
      traits: t("Дрібне насіння з олією, декоративне цвітіння", "Oily small seed, ornamental bloom", "Мелкие масличные семена, декоративное цветение"),
    },
    {
      purpose: t("Харчове насіння, олія, випічка", "Culinary seed, oil, baking", "Пищевые семена, масло, выпечка"),
      edibleParts: t("Стигле насіння", "Ripe seed", "Зрелые семена"),
      culinary: t("Макотники, рулети, макова олія", "Poppy rolls, cakes, poppy seed oil", "Маковники, рулеты, маковое масло"),
      harvest: t("Коробочки гримлять, стулки ще закриті", "Capsules rattle, pores still closed", "Коробочки гремят, створки ещё закрыты"),
      storage: t("Сухо, від молі; насіння легко гіркне", "Dry, away from moths; seed turns rancid", "Сухо, от моли; семена легко горкнут"),
    }
  ),
}
