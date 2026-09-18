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

const rosaceae = t("Розові (Rosaceae)", "Rosaceae", "Розовые (Rosaceae)")
const grossulariaceae = t("Аґрусові (Grossulariaceae)", "Grossulariaceae", "Крыжовниковые (Grossulariaceae)")
const ericaceae = t("Вересові (Ericaceae)", "Ericaceae", "Вересковые (Ericaceae)")
const elaeagnaceae = t("Маслинкові (Elaeagnaceae)", "Elaeagnaceae", "Лоховые (Elaeagnaceae)")
const caprifoliaceae = t("Жимолостеві (Caprifoliaceae)", "Caprifoliaceae", "Жимолостные (Caprifoliaceae)")

export const BERRY_PROFILES: Record<string, PlantProfile> = {
  kb_species_rubus_idaeus: crop(
    "/plants/raspberry.svg",
    {
      family: rosaceae,
      genus: t("Ожина / малина (Rubus)", "Rubus", "Малина (Rubus)"),
      species: t("Rubus idaeus", "Rubus idaeus", "Rubus idaeus"),
      lifeCycle: t("Багаторічний кущ, пагони дворічні", "Perennial shrub, biennial canes", "Многолетний куст, побеги двулетние"),
      origin: t("Євразія", "Eurasia", "Евразия"),
      summary: t(
        "Малина — основна ягідна культура українського городу.",
        "Raspberry is the main berry of the Ukrainian garden.",
        "Малина — основная ягодная культура украинского огорода."
      ),
    },
    {
      yield: t("1.5–3 кг з куща, 8–12 т/га", "1.5–3 kg per bush, 8–12 t/ha", "1.5–3 кг с куста, 8–12 т/га"),
      plantTime: t("Жовтень або березень–квітень", "October or March–April", "Октябрь или март–апрель"),
      maturity: t("Літні сорти на 2-й рік пагона; ремонтантні — з кінця літа", "Summer types on 2nd-year canes; primocane from late summer", "Летние на 2-й год побега; ремонтантные — с конца лета"),
      watering: t("Рівномірно, критично налив ягід", "Even moisture, critical at fruit fill", "Равномерно, критично налив ягод"),
      soil: t("Легкі суглинки, pH 5.5–6.5, без застою", "Light loams, pH 5.5–6.5, no standing water", "Лёгкие суглинки, pH 5.5–6.5, без застоя"),
      climate: t("Помірний; лісостеп і Полісся", "Temperate; forest-steppe and Polissia", "Умеренный; лесостепь и Полесье"),
      light: t("Повне сонце або легка півтінь", "Full sun or light shade", "Полное солнце или лёгкая полутень"),
      sowingDepth: t("Садивна яма: коренева шийка на рівні ґрунту", "Planting hole: crown at soil level", "Посадочная яма: шейка на уровне почвы"),
      seedRate: t("3–5 рослин / м ряду, міжряддя 1.5–2 м", "3–5 plants / m of row, 1.5–2 m between rows", "3–5 растений / м ряда, междурядья 1.5–2 м"),
      seedlings: t("Кореневі паростки або контейнерні саджанці", "Suckers or container plants", "Корневые отпрыски или контейнерные саженцы"),
      companions: t("Часник, чорнобривці; не після пасльонових", "Garlic, marigold; not after nightshades", "Чеснок, бархатцы; не после паслёновых"),
      pests: t("Сіра гниль, малиновий жук, пагонова галиця", "Grey mold, raspberry beetle, cane midge", "Серая гниль, малиновый жук, побеговая галлица"),
      fertilizer: t("Компост навесні, калій після збору", "Compost in spring, potassium after harvest", "Компост весной, калий после сбора"),
    },
    {
      varietyType: t("Літні (дворічні пагони) і ремонтантні", "Floricane and primocane (everbearing)", "Летние (двулетние побеги) и ремонтантные"),
      pollination: t("Комахи; більшість самоплідні", "Insects; most are self-fertile", "Насекомые; большинство самоплодные"),
      habit: t("Кущ 1.2–2 м, шипи або без, коренева поросль", "1.2–2 m bush, thorny or not, suckers", "Куст 1.2–2 м, шипы или без, корневая поросль"),
      ploidy: t("Диплоїд, 2n = 14", "Diploid, 2n = 14", "Диплоид, 2n = 14"),
      traits: t("Агрегатна ягода, аромат, ремонтантність", "Aggregate fruit, aroma, primocane fruiting", "Сборная ягода, аромат, ремонтантность"),
    },
    {
      purpose: t("Їжа, заморозка, варення", "Food, freezing, jam", "Еда, заморозка, варенье"),
      edibleParts: t("Ягоди", "Berries", "Ягоды"),
      culinary: t("Свіжі, компот, сироп, сушка листя на чай", "Fresh, compote, syrup, dried-leaf tea", "Свежие, компот, сироп, сушка листьев на чай"),
      harvest: t("Легко знімається з плодоложа, через день", "Slips off the receptacle, pick every other day", "Легко снимается с плодоложа, через день"),
      storage: t("1–2 дні в холоді або одразу заморозка", "1–2 days chilled or freeze at once", "1–2 дня в холоде или сразу заморозка"),
    }
  ),
  kb_species_rubus_fruticosus: crop(
    "/plants/blackberry.svg",
    {
      family: rosaceae,
      genus: t("Ожина (Rubus)", "Rubus", "Ежевика (Rubus)"),
      species: t("Rubus fruticosus", "Rubus fruticosus", "Rubus fruticosus"),
      lifeCycle: t("Багаторічний кущ", "Perennial shrub", "Многолетний куст"),
      origin: t("Європа", "Europe", "Европа"),
      summary: t(
        "Ожина — пізні солодкі ягоди, часто безколючкові сорти.",
        "Blackberry is a late sweet berry, often thornless cultivars.",
        "Ежевика — поздние сладкие ягоды, часто бесколючковые сорта."
      ),
    },
    {
      yield: t("4–8 кг з куща", "4–8 kg per bush", "4–8 кг с куста"),
      plantTime: t("Квітень або жовтень", "April or October", "Апрель или октябрь"),
      maturity: t("Липень–вересень, на 2-й рік пагона", "July–September, on 2nd-year canes", "Июль–сентябрь, на 2-й год побега"),
      watering: t("Глибоко в спеку; мульча", "Deep watering in heat; mulch", "Глубоко в жару; мульча"),
      soil: t("Родючі суглинки, pH 5.5–6.5", "Fertile loams, pH 5.5–6.5", "Плодородные суглинки, pH 5.5–6.5"),
      climate: t("Тепліше за малину; лісостеп і степ з поливом", "Warmer than raspberry; forest-steppe and irrigated steppe", "Теплее малины; лесостепь и степь с поливом"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("Коренева шийка на рівні ґрунту", "Crown at soil level", "Корневая шейка на уровне почвы"),
      seedRate: t("Кущі через 1.5–2.5 м, шпалера", "Bushes 1.5–2.5 m apart, trellis", "Кусты через 1.5–2.5 м, шпалера"),
      seedlings: t("Саджанці, відсадки", "Nursery plants, layers", "Саженцы, отводки"),
      companions: t("Не садити в загущенні; провітрювання від гнилі", "Do not crowd; airflow against rot", "Не сажать в загущении; проветривание от гнили"),
      pests: t("Сіра гниль, іржа, довгоносик", "Grey mold, rust, weevil", "Серая гниль, ржавчина, долгоносик"),
      fertilizer: t("Компост, калій; азот помірно", "Compost, potassium; moderate N", "Компост, калий; азот умеренно"),
    },
    {
      varietyType: t("Колючі й безколючкові, прямостоячі й сланкі", "Thorny and thornless, erect and trailing", "Колючие и бесколючковые, прямостоячие и стелющиеся"),
      pollination: t("Комахи; більшість самоплідні", "Insects; most self-fertile", "Насекомые; большинство самоплодные"),
      habit: t("Довгі пагони на шпалері, 2–4 м", "Long canes on a trellis, 2–4 m", "Длинные побеги на шпалере, 2–4 м"),
      ploidy: t("Поліплоїдний комплекс", "Polyploid complex", "Полиплоидный комплекс"),
      traits: t("Ягода лишається з плодоложем, пізнє достигання", "Berry keeps the receptacle, late ripening", "Ягода остаётся с плодоложем, позднее созревание"),
    },
    {
      purpose: t("Їжа, варення, вино", "Food, jam, wine", "Еда, варенье, вино"),
      edibleParts: t("Ягоди", "Berries", "Ягоды"),
      culinary: t("Свіжі, джем, начинки", "Fresh, jam, fillings", "Свежие, джем, начинки"),
      harvest: t("Чорні, блискучі, легко відриваються", "Black, glossy, pick easily", "Чёрные, блестящие, легко отрываются"),
      storage: t("Коротко в холоді, краще заморозка", "Briefly chilled; freeze preferably", "Кратко в холоде, лучше заморозка"),
    }
  ),
  kb_species_ribes_nigrum: crop(
    "/plants/blackcurrant.svg",
    {
      family: grossulariaceae,
      genus: t("Смородина (Ribes)", "Ribes", "Смородина (Ribes)"),
      species: t("Ribes nigrum", "Ribes nigrum", "Ribes nigrum"),
      lifeCycle: t("Багаторічний кущ", "Perennial shrub", "Многолетний куст"),
      origin: t("Північна Європа та Сибір", "Northern Europe and Siberia", "Северная Европа и Сибирь"),
      summary: t(
        "Чорна смородина — вітамінна ягода українських садків.",
        "Blackcurrant is the vitamin berry of Ukrainian gardens.",
        "Чёрная смородина — витаминная ягода украинских садов."
      ),
    },
    {
      yield: t("3–6 кг з куща", "3–6 kg per bush", "3–6 кг с куста"),
      plantTime: t("Жовтень (краще) або березень", "October (better) or March", "Октябрь (лучше) или март"),
      maturity: t("Урожай з 2–3-го року, липень", "Crop from year 2–3, July", "Урожай со 2–3-го года, июль"),
      watering: t("Вологолюбна, особливо налив", "Moisture-loving, especially at fill", "Влаголюбива, особенно налив"),
      soil: t("Родючі, вологі, pH 6–7", "Fertile, moist, pH 6–7", "Плодородные, влажные, pH 6–7"),
      climate: t("Прохолода; Полісся й лісостеп", "Cool; Polissia and forest-steppe", "Прохлада; Полесье и лесостепь"),
      light: t("Сонце або півтінь", "Sun or partial shade", "Солнце или полутень"),
      sowingDepth: t("Заглибити на 5–8 см для додаткових коренів", "Set 5–8 cm deeper for extra roots", "Заглубить на 5–8 см для дополнительных корней"),
      seedRate: t("Кущі 1.2–1.5 м, міжряддя 2 м", "Bushes 1.2–1.5 m, rows 2 m", "Кусты 1.2–1.5 м, междурядья 2 м"),
      seedlings: t("Одно-дворічні саджанці, живці", "1–2 year plants, cuttings", "Одно-двухлетние саженцы, черенки"),
      companions: t("Кілька сортів поруч; цибуля від кліща", "Several cultivars together; onion vs mite", "Несколько сортов рядом; лук от клеща"),
      pests: t("Американська борошниста роса, бруньковий кліщ, іржа", "American mildew, bud mite, rust", "Американская мучнистая роса, почковый клещ, ржавчина"),
      fertilizer: t("Органіка восени, калій перед цвітінням", "Organic matter in autumn, K before bloom", "Органика осенью, калий перед цветением"),
    },
    {
      varietyType: t("Ранні–пізні; стійкі до борошнистої роси", "Early to late; mildew-resistant", "Ранние–поздние; устойчивые к мучнистой росе"),
      pollination: t("Частково самоплідна; краще 2–3 сорти", "Partly self-fertile; 2–3 cultivars better", "Частично самоплодная; лучше 2–3 сорта"),
      habit: t("Кущ 1–1.8 м, ароматичне листя", "1–1.8 m bush, aromatic leaves", "Куст 1–1.8 м, ароматные листья"),
      ploidy: t("Диплоїд, 2n = 16", "Diploid, 2n = 16", "Диплоид, 2n = 16"),
      traits: t("Високий вітамін C, ефірні олії в листі", "High vitamin C, leaf essential oils", "Высокий витамин C, эфирные масла в листьях"),
    },
    {
      purpose: t("Їжа, заготовки, листя на чай", "Food, preserves, leaf tea", "Еда, заготовки, листья на чай"),
      edibleParts: t("Ягоди; молоде листя", "Berries; young leaves", "Ягоды; молодые листья"),
      culinary: t("Варення, сік, желе, заморозка", "Jam, juice, jelly, freezing", "Варенье, сок, желе, заморозка"),
      harvest: t("Кетяги повністю чорні, не перетримувати", "Clusters fully black, do not overripe", "Кисти полностью чёрные, не передерживать"),
      storage: t("Заморозка, варення; свіжі — кілька днів", "Freeze or jam; fresh a few days", "Заморозка, варенье; свежие — несколько дней"),
    }
  ),
  kb_species_ribes_rubrum: crop(
    "/plants/redcurrant.svg",
    {
      family: grossulariaceae,
      genus: t("Смородина (Ribes)", "Ribes", "Смородина (Ribes)"),
      species: t("Ribes rubrum", "Ribes rubrum", "Ribes rubrum"),
      lifeCycle: t("Багаторічний кущ", "Perennial shrub", "Многолетний куст"),
      origin: t("Західна Європа", "Western Europe", "Западная Европа"),
      summary: t(
        "Червона смородина — кислі прозорі кетяги на желе й узвар.",
        "Redcurrant is a tart translucent berry for jelly and kompot.",
        "Красная смородина — кислые прозрачные кисти на желе и компот."
      ),
    },
    {
      yield: t("4–8 кг з куща", "4–8 kg per bush", "4–8 кг с куста"),
      plantTime: t("Жовтень або березень", "October or March", "Октябрь или март"),
      maturity: t("Липень, з 3-го року", "July, from year 3", "Июль, с 3-го года"),
      watering: t("Посухостійкіша за чорну, але полив на наливі", "More drought-tolerant than black, water at fill", "Засухоустойчивее чёрной, но полив на наливе"),
      soil: t("Легші ґрунти, pH 6–7, без кислотності", "Lighter soils, pH 6–7, not acid", "Более лёгкие почвы, pH 6–7, без кислотности"),
      climate: t("Вся Україна; спеку переносить краще за чорну", "All of Ukraine; heat better than blackcurrant", "Вся Украина; жару переносит лучше чёрной"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("Заглибити на 5 см", "Set 5 cm deeper", "Заглубить на 5 см"),
      seedRate: t("Кущі 1.2–1.5 м", "Bushes 1.2–1.5 m apart", "Кусты 1.2–1.5 м"),
      seedlings: t("Саджанці, здерев'янілі живці", "Nursery plants, hardwood cuttings", "Саженцы, одревесневшие черенки"),
      companions: t("Добре запилюється своїм сортом", "Sets fruit well with one cultivar", "Хорошо опыляется своим сортом"),
      pests: t("Борошниста роса, попелиця, сіра гниль", "Powdery mildew, aphids, grey mold", "Мучнистая роса, тля, серая гниль"),
      fertilizer: t("Помірний азот, калій", "Moderate N, potassium", "Умеренный азот, калий"),
    },
    {
      varietyType: t("Червоні й білі форми одного виду", "Red and white forms of one species", "Красные и белые формы одного вида"),
      pollination: t("Самоплідна", "Self-fertile", "Самоплодная"),
      habit: t("Прямий кущ 1–1.5 м, довгі кетяги", "Upright 1–1.5 m bush, long racemes", "Прямой куст 1–1.5 м, длинные кисти"),
      ploidy: t("Диплоїд, 2n = 16", "Diploid, 2n = 16", "Диплоид, 2n = 16"),
      traits: t("Кислота, пектин, ягоди довго висять", "Acidity, pectin, fruit hangs long", "Кислота, пектин, ягоды долго висят"),
    },
    {
      purpose: t("Желе, сік, десерти", "Jelly, juice, desserts", "Желе, сок, десерты"),
      edibleParts: t("Ягоди", "Berries", "Ягоды"),
      culinary: t("Желе, узвар, соуси до м'яса", "Jelly, kompot, sauces for meat", "Желе, компот, соусы к мясу"),
      harvest: t("Кетягами, коли ягоди прозорі", "Whole clusters when berries are translucent", "Кистями, когда ягоды прозрачные"),
      storage: t("Холод кілька днів; желе й заморозка", "Chill a few days; jelly and freeze", "Холод несколько дней; желе и заморозка"),
    }
  ),
  kb_species_ribes_uva_crispa: crop(
    "/plants/gooseberry.svg",
    {
      family: grossulariaceae,
      genus: t("Смородина / аґрус (Ribes)", "Ribes", "Крыжовник (Ribes)"),
      species: t("Ribes uva-crispa", "Ribes uva-crispa", "Ribes uva-crispa"),
      lifeCycle: t("Багаторічний кущ", "Perennial shrub", "Многолетний куст"),
      origin: t("Європа", "Europe", "Европа"),
      summary: t(
        "Аґрус — великі ягоди на варення, чутливий до борошнистої роси.",
        "Gooseberry is a large berry for jam, prone to powdery mildew.",
        "Крыжовник — крупные ягоды на варенье, чувствителен к мучнистой росе."
      ),
    },
    {
      yield: t("4–8 кг з куща", "4–8 kg per bush", "4–8 кг с куста"),
      plantTime: t("Жовтень або березень", "October or March", "Октябрь или март"),
      maturity: t("Червень–липень, з 3-го року", "June–July, from year 3", "Июнь–июль, с 3-го года"),
      watering: t("Помірно; не любить мокре листя", "Moderate; dislikes wet foliage", "Умеренно; не любит мокрую листву"),
      soil: t("Пухкі, без важкої кислотності, pH 6–7", "Loose, not strongly acid, pH 6–7", "Рыхлые, без сильной кислотности, pH 6–7"),
      climate: t("Помірний; провітрювані ділянки", "Temperate; airy sites", "Умеренный; проветриваемые участки"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("Заглибити на 5–6 см", "Set 5–6 cm deeper", "Заглубить на 5–6 см"),
      seedRate: t("Кущі 1.2–1.5 м", "Bushes 1.2–1.5 m apart", "Кусты 1.2–1.5 м"),
      seedlings: t("Саджанці, відсадки", "Nursery plants, layers", "Саженцы, отводки"),
      companions: t("Не загущувати; вирізати старі гілки", "Do not crowd; cut out old wood", "Не загущать; вырезать старые ветки"),
      pests: t("Борошниста роса, іржа, пильщик", "Powdery mildew, rust, sawfly", "Мучнистая роса, ржавчина, пилильщик"),
      fertilizer: t("Калій і фосфор; азот обережно (роса)", "K and P; cautious N (mildew)", "Калий и фосфор; азот осторожно (роса)"),
    },
    {
      varietyType: t("Європейські великоплідні й стійкі гібриди", "European large-fruit and resistant hybrids", "Европейские крупноплодные и устойчивые гибриды"),
      pollination: t("Самоплідна", "Self-fertile", "Самоплодная"),
      habit: t("Колючий кущ 0.8–1.4 м", "Thorny 0.8–1.4 m bush", "Колючий куст 0.8–1.4 м"),
      ploidy: t("Диплоїд, 2n = 16", "Diploid, 2n = 16", "Диплоид, 2n = 16"),
      traits: t("Велика ягода, шипи, чутливість до сферотеки", "Large berry, spines, mildew sensitivity", "Крупная ягода, шипы, чувствительность к сферотеке"),
    },
    {
      purpose: t("Варення, свіжі ягоди", "Jam, fresh fruit", "Варенье, свежие ягоды"),
      edibleParts: t("Ягоди (зелені на компот, стиглі свіжі)", "Berries (green for kompot, ripe fresh)", "Ягоды (зелёные на компот, спелые свежие)"),
      culinary: t("Царське варення, пироги", "Classic jam, pies", "Царское варенье, пироги"),
      harvest: t("У рукавицях; на варення трохи недозрілі", "Wear gloves; slightly underripe for jam", "В перчатках; на варенье слегка недозрелые"),
      storage: t("Холод тиждень; варення", "Chill a week; jam", "Холод неделю; варенье"),
    }
  ),
  kb_species_vaccinium_corymbosum: crop(
    "/plants/blueberry.svg",
    {
      family: ericaceae,
      genus: t("Чорниця / лохина (Vaccinium)", "Vaccinium", "Голубика (Vaccinium)"),
      species: t("Vaccinium corymbosum", "Vaccinium corymbosum", "Vaccinium corymbosum"),
      lifeCycle: t("Багаторічний кущ", "Perennial shrub", "Многолетний куст"),
      origin: t("Східна Північна Америка", "Eastern North America", "Восток Северной Америки"),
      summary: t(
        "Лохина потребує кислого ґрунту й двох сортів для запилення.",
        "Blueberry needs acid soil and two cultivars for pollination.",
        "Голубика требует кислой почвы и двух сортов для опыления."
      ),
    },
    {
      yield: t("2–4 кг з дорослого куща", "2–4 kg per mature bush", "2–4 кг со взрослого куста"),
      plantTime: t("Квітень або вересень–жовтень", "April or September–October", "Апрель или сентябрь–октябрь"),
      maturity: t("Перший збір на 3-й рік, повний з 5–6-го", "First crop in year 3, full from 5–6", "Первый сбор на 3-й год, полный с 5–6-го"),
      watering: t("М'яка вода, постійна волога, мульча корою", "Soft water, even moisture, bark mulch", "Мягкая вода, постоянная влага, мульча корой"),
      soil: t("Кислий pH 4.0–5.2, торф, пісок, без вапна", "Acid pH 4.0–5.2, peat, sand, no lime", "Кислый pH 4.0–5.2, торф, песок, без извести"),
      climate: t("Полісся й північ лісостепу; зима зі снігом", "Polissia and northern forest-steppe; snowy winter", "Полесье и север лесостепи; зима со снегом"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("Контейнер не заглиблювати; субстрат кислий", "Do not bury the container plant; acid mix", "Контейнер не заглублять; субстрат кислый"),
      seedRate: t("Кущі 1.2–1.8 м, мінімум два сорти", "Bushes 1.2–1.8 m, at least two cultivars", "Кусты 1.2–1.8 м, минимум два сорта"),
      seedlings: t("Контейнерні 2–3-річні саджанці", "2–3 year container plants", "Контейнерные 2–3-летние саженцы"),
      companions: t("Хвойна мульча; не садити з овочами на нейтральному ґрунті", "Pine mulch; not with veg on neutral soil", "Хвойная мульча; не сажать с овощами на нейтральной почве"),
      pests: t("Сіра гниль, кореневі гнилі при вапні, птахи", "Grey mold, root rot if limed, birds", "Серая гниль, корневые гнили при извести, птицы"),
      fertilizer: t("Добрива для вересових, без хлору й нітрату кальцію", "Ericaceous feed, no chlorine or calcium nitrate", "Удобрения для вересковых, без хлора и нитрата кальция"),
    },
    {
      varietyType: t("Високорослі північні гібриди, різні строки", "Northern highbush hybrids, staggered seasons", "Высокорослые северные гибриды, разные сроки"),
      pollination: t("Перехресне, джмелі; два сорти обов'язково", "Cross, bumblebees; two cultivars required", "Перекрёстное, шмели; два сорта обязательно"),
      habit: t("Кущ 1.5–2.5 м, поверхневі корені", "1.5–2.5 m bush, shallow roots", "Куст 1.5–2.5 м, поверхностные корни"),
      ploidy: t("Тетраплоїд, 2n = 48", "Tetraploid, 2n = 48", "Тетраплоид, 2n = 48"),
      traits: t("Мікориза, вимога кислотності, восковий наліт", "Mycorrhiza, acid requirement, bloom on fruit", "Микориза, требование кислотности, восковой налёт"),
    },
    {
      purpose: t("Свіжі ягоди, заморозка", "Fresh berries, freezing", "Свежие ягоды, заморозка"),
      edibleParts: t("Ягоди", "Berries", "Ягоды"),
      culinary: t("Свіжі, мафіни, варення", "Fresh, muffins, jam", "Свежие, маффины, варенье"),
      harvest: t("Ягода легко відривається, сизий наліт", "Berry picks easily, with bloom", "Ягода легко отрывается, сизый налёт"),
      storage: t("Холод до 10 днів; заморозка", "Chill up to 10 days; freeze", "Холод до 10 дней; заморозка"),
    }
  ),
  kb_species_hippophae_rhamnoides: crop(
    "/plants/sea-buckthorn.svg",
    {
      family: elaeagnaceae,
      genus: t("Обліпиха (Hippophae)", "Hippophae", "Облепиха (Hippophae)"),
      species: t("Hippophae rhamnoides", "Hippophae rhamnoides", "Hippophae rhamnoides"),
      lifeCycle: t("Багаторічний кущ або деревце", "Perennial shrub or small tree", "Многолетний куст или деревце"),
      origin: t("Євразія, узбережжя й річкові долини", "Eurasia, coasts and river valleys", "Евразия, побережья и речные долины"),
      summary: t(
        "Обліпиха дводомна: потрібен чоловічий кущ на кілька жіночих.",
        "Sea buckthorn is dioecious: one male for several females.",
        "Облепиха двудомная: нужен мужской куст на несколько женских."
      ),
    },
    {
      yield: t("8–15 кг з жіночого куща", "8–15 kg per female bush", "8–15 кг с женского куста"),
      plantTime: t("Березень–квітень", "March–April", "Март–апрель"),
      maturity: t("Вересень–жовтень, з 3–4-го року", "September–October, from year 3–4", "Сентябрь–октябрь, с 3–4-го года"),
      watering: t("Посухостійка після укорінення", "Drought-tolerant once established", "Засухоустойчива после укоренения"),
      soil: t("Легкі піщані, pH 6–8, без застою", "Light sandy, pH 6–8, no waterlogging", "Лёгкие песчаные, pH 6–8, без застоя"),
      climate: t("Сонце, вітер; степ і лісостеп", "Sun and wind; steppe and forest-steppe", "Солнце, ветер; степь и лесостепь"),
      light: t("Повне сонце", "Full sun", "Полное солнце"),
      sowingDepth: t("Не заглиблювати кореневу шийку", "Do not bury the crown", "Не заглублять корневую шейку"),
      seedRate: t("1 чоловічий на 5–8 жіночих, 2–3 м між кущами", "1 male per 5–8 females, 2–3 m apart", "1 мужской на 5–8 женских, 2–3 м между кустами"),
      seedlings: t("Саджанці відомої статі", "Plants of known sex", "Саженцы известного пола"),
      companions: t("Азотфіксація; не садити в тінь плодових", "Nitrogen-fixing; not in fruit-tree shade", "Азотфиксация; не сажать в тень плодовых"),
      pests: t("Кореневі гнилі на мокрому, обліпихова муха, іржа", "Root rot if wet, fruit fly, rust", "Корневые гнили на мокром, облепиховая муха, ржавчина"),
      fertilizer: t("Мало азоту; фосфор і калій", "Little N; P and K", "Мало азота; фосфор и калий"),
    },
    {
      varietyType: t("Жіночі великоплідні й чоловічі запилювачі", "Large-fruit females and male pollinizers", "Женские крупноплодные и мужские опылители"),
      pollination: t("Вітер; дводомна", "Wind; dioecious", "Ветер; двудомная"),
      habit: t("Колючий кущ 2–4 м, коренева поросль", "Thorny 2–4 m shrub, suckers", "Колючий куст 2–4 м, корневая поросль"),
      ploidy: t("Диплоїд, 2n = 24", "Diploid, 2n = 24", "Диплоид, 2n = 24"),
      traits: t("Олія в м'якоті, вітамін C, азотфіксація", "Pulp oil, vitamin C, nitrogen fixation", "Масло в мякоти, витамин C, азотфиксация"),
    },
    {
      purpose: t("Сік, олія, лікувальні заготовки", "Juice, oil, medicinal preserves", "Сок, масло, лечебные заготовки"),
      edibleParts: t("Ягоди; олія з м'якоті й насіння", "Berries; oil from pulp and seed", "Ягоды; масло из мякоти и семян"),
      culinary: t("Сік з медом, варення, олія", "Juice with honey, jam, oil", "Сок с мёдом, варенье, масло"),
      harvest: t("Після перших приморозків або зрізати гілки", "After first frost or cut fruiting shoots", "После первых заморозков или срезать ветки"),
      storage: t("Заморозка, сік, олія в холоді", "Freeze, juice, oil kept cold", "Заморозка, сок, масло в холоде"),
    }
  ),
  kb_species_lonicera_caerulea: crop(
    "/plants/honeyberry.svg",
    {
      family: caprifoliaceae,
      genus: t("Жимолость (Lonicera)", "Lonicera", "Жимолость (Lonicera)"),
      species: t("Lonicera caerulea", "Lonicera caerulea", "Lonicera caerulea"),
      lifeCycle: t("Багаторічний кущ", "Perennial shrub", "Многолетний куст"),
      origin: t("Сибір, Камчатка, гірська Євразія", "Siberia, Kamchatka, mountain Eurasia", "Сибирь, Камчатка, горная Евразия"),
      summary: t(
        "Їстівна жимолость — найраніша ягода, потрібні два сорти.",
        "Honeyberry is the earliest berry; two cultivars are required.",
        "Съедобная жимолость — самая ранняя ягода, нужны два сорта."
      ),
    },
    {
      yield: t("2–4 кг з куща", "2–4 kg per bush", "2–4 кг с куста"),
      plantTime: t("Жовтень або березень", "October or March", "Октябрь или март"),
      maturity: t("Травень–червень з 3-го року", "May–June from year 3", "Май–июнь с 3-го года"),
      watering: t("Вологолюбна навесні; мульча", "Moisture-loving in spring; mulch", "Влаголюбива весной; мульча"),
      soil: t("Пухкі, слабкокислі pH 5.5–6.5", "Loose, slightly acid pH 5.5–6.5", "Рыхлые, слабокислые pH 5.5–6.5"),
      climate: t("Морозостійка; Полісся й лісостеп, на півдні з поливом", "Very hardy; Polissia and forest-steppe, irrigate in the south", "Морозостойкая; Полесье и лесостепь, на юге с поливом"),
      light: t("Сонце або півтінь", "Sun or partial shade", "Солнце или полутень"),
      sowingDepth: t("Коренева шийка на рівні ґрунту", "Crown at soil level", "Корневая шейка на уровне почвы"),
      seedRate: t("Два різні сорти через 1.2–1.5 м", "Two different cultivars 1.2–1.5 m apart", "Два разных сорта через 1.2–1.5 м"),
      seedlings: t("Контейнерні саджанці", "Container plants", "Контейнерные саженцы"),
      companions: t("Обов'язково другий сорт-запилювач", "A second pollinizer cultivar is required", "Обязательно второй сорт-опылитель"),
      pests: t("Птахи, попелиця, сіра гниль в дощ", "Birds, aphids, grey mold in rain", "Птицы, тля, серая гниль в дождь"),
      fertilizer: t("Компост, калій після збору", "Compost, potassium after harvest", "Компост, калий после сбора"),
    },
    {
      varietyType: t("Камчатські та бакальські харчові сорти", "Kamchatka and Bakchar culinary cultivars", "Камчатские и бакчарские пищевые сорта"),
      pollination: t("Перехресне; один сорт майже не зав'язує", "Cross; a single cultivar sets poorly", "Перекрёстное; один сорт почти не завязывает"),
      habit: t("Кущ 1–1.8 м, сизі видовжені ягоди", "1–1.8 m bush, blue elongated berries", "Куст 1–1.8 м, сизые удлинённые ягоды"),
      ploidy: t("Диплоїд, 2n = 18", "Diploid, 2n = 18", "Диплоид, 2n = 18"),
      traits: t("Цвіте дуже рано, ягода осипається", "Very early bloom, fruit can drop", "Цветёт очень рано, ягода осыпается"),
    },
    {
      purpose: t("Свіжі ягоди, заморозка", "Fresh berries, freezing", "Свежие ягоды, заморозка"),
      edibleParts: t("Ягоди (не декоративні жимолості!)", "Berries (not ornamental honeysuckle!)", "Ягоды (не декоративные жимолости!)"),
      culinary: t("Свіжі, варення, смузі", "Fresh, jam, smoothies", "Свежие, варенье, смузи"),
      harvest: t("Синя по всій ягоді, кілька зборів", "Fully blue, several pickings", "Синяя по всей ягоде, несколько сборов"),
      storage: t("Заморозка; свіжі 2–3 дні", "Freeze; fresh 2–3 days", "Заморозка; свежие 2–3 дня"),
    }
  ),
  kb_species_aronia_melanocarpa: crop(
    "/plants/aronia.svg",
    {
      family: rosaceae,
      genus: t("Аронія (Aronia)", "Aronia", "Арония (Aronia)"),
      species: t("Aronia melanocarpa", "Aronia melanocarpa", "Aronia melanocarpa"),
      lifeCycle: t("Багаторічний кущ", "Perennial shrub", "Многолетний куст"),
      origin: t("Східна Північна Америка", "Eastern North America", "Восток Северной Америки"),
      summary: t(
        "Аронія — невибагливий кущ з терпкими чорними ягодами.",
        "Aronia is an undemanding shrub with astringent black berries.",
        "Арония — неприхотливый куст с терпкими чёрными ягодами."
      ),
    },
    {
      yield: t("5–10 кг з куща", "5–10 kg per bush", "5–10 кг с куста"),
      plantTime: t("Березень–квітень або жовтень", "March–April or October", "Март–апрель или октябрь"),
      maturity: t("Серпень–вересень з 3-го року", "August–September from year 3", "Август–сентябрь с 3-го года"),
      watering: t("Невибаглива; полив у посуху на наливі", "Undemanding; water in drought at fill", "Неприхотлива; полив в засуху на наливе"),
      soil: t("Різні ґрунти, pH 5.5–7.5", "Various soils, pH 5.5–7.5", "Разные почвы, pH 5.5–7.5"),
      climate: t("Морозостійка, вся Україна", "Very hardy, all of Ukraine", "Морозостойкая, вся Украина"),
      light: t("Повне сонце для цукру в ягоді", "Full sun for sugar in the fruit", "Полное солнце для сахара в ягоде"),
      sowingDepth: t("Коренева шийка на рівні ґрунту", "Crown at soil level", "Корневая шейка на уровне почвы"),
      seedRate: t("Кущі 1.5–2 м", "Bushes 1.5–2 m apart", "Кусты 1.5–2 м"),
      seedlings: t("Саджанці, коренева поросль", "Nursery plants, suckers", "Саженцы, корневая поросль"),
      companions: t("Жива огорожа; не затінювати", "Hedgerow; do not shade", "Живая изгородь; не затенять"),
      pests: t("Рідко: сіра гниль, іржа, птахи", "Rarely: grey mold, rust, birds", "Редко: серая гниль, ржавчина, птицы"),
      fertilizer: t("Компост раз на рік", "Compost once a year", "Компост раз в год"),
    },
    {
      varietyType: t("Великоплідні садові клони", "Large-fruit garden clones", "Крупноплодные садовые клоны"),
      pollination: t("Самоплідна, комахи", "Self-fertile, insects", "Самоплодная, насекомые"),
      habit: t("Густий кущ 1.5–2.5 м, осіннє забарвлення", "Dense 1.5–2.5 m bush, autumn colour", "Густой куст 1.5–2.5 м, осенняя окраска"),
      ploidy: t("Тетраплоїд, 2n = 68", "Tetraploid, 2n = 68", "Тетраплоид, 2n = 68"),
      traits: t("Терпкість, антоціани, стійкість", "Astringency, anthocyanins, hardiness", "Терпкость, антоцианы, устойчивость"),
    },
    {
      purpose: t("Сік, сушка, лікувальні заготовки", "Juice, drying, medicinal preserves", "Сок, сушка, лечебные заготовки"),
      edibleParts: t("Ягоди після приморозку м'якші", "Berries milder after frost", "Ягоды после заморозка мягче"),
      culinary: t("Сік з яблуком, варення, вино", "Juice with apple, jam, wine", "Сок с яблоком, варенье, вино"),
      harvest: t("Кетяги чорні; можна після приморозків", "Clusters black; may pick after frost", "Кисти чёрные; можно после заморозков"),
      storage: t("Сушка, заморозка, сік", "Dry, freeze, juice", "Сушка, заморозка, сок"),
    }
  ),
}
