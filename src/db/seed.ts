import { config } from "dotenv"
import { eq } from "drizzle-orm"

config({ path: ".env" })

type SeedSpecies = {
  id: string
  scientificName: string
  commonNameUk: string
  commonNameEn: string
}

type SeedCultivar = {
  id: string
  speciesId: string
  name: string
}

type SeedDisease = {
  id: string
  nameUk: string
  nameEn: string
}

type SeedGroup = {
  id: string
  nameUk: string
  nameEn: string
  type: "botanical" | "agricultural_use" | "used_part" | "life_cycle" | "cultivation"
}

type SeedValue = {
  id: string
  groupId: string
  nameUk: string
  nameEn: string
}

const SPECIES: SeedSpecies[] = [
  {
    id: "kb_species_solanum_lycopersicum",
    scientificName: "Solanum lycopersicum",
    commonNameUk: "Помідор",
    commonNameEn: "Tomato",
  },
  {
    id: "kb_species_cucumis_sativus",
    scientificName: "Cucumis sativus",
    commonNameUk: "Огірок",
    commonNameEn: "Cucumber",
  },
  {
    id: "kb_species_capsicum_annuum",
    scientificName: "Capsicum annuum",
    commonNameUk: "Перець",
    commonNameEn: "Pepper",
  },
  {
    id: "kb_species_raphanus_sativus",
    scientificName: "Raphanus sativus",
    commonNameUk: "Редиска",
    commonNameEn: "Radish",
  },
  {
    id: "kb_species_ocimum_basilicum",
    scientificName: "Ocimum basilicum",
    commonNameUk: "Базилік",
    commonNameEn: "Basil",
  },
  {
    id: "kb_species_mentha_piperita",
    scientificName: "Mentha × piperita",
    commonNameUk: "М'ята",
    commonNameEn: "Mint",
  },
  {
    id: "kb_species_fragaria_ananassa",
    scientificName: "Fragaria × ananassa",
    commonNameUk: "Полуниця",
    commonNameEn: "Strawberry",
  },
  {
    id: "kb_species_solanum_tuberosum",
    scientificName: "Solanum tuberosum",
    commonNameUk: "Картопля",
    commonNameEn: "Potato",
  },
  {
    id: "kb_species_solanum_melongena",
    scientificName: "Solanum melongena",
    commonNameUk: "Баклажан",
    commonNameEn: "Eggplant",
  },
  {
    id: "kb_species_cucurbita_pepo",
    scientificName: "Cucurbita pepo",
    commonNameUk: "Кабачок",
    commonNameEn: "Zucchini",
  },
  {
    id: "kb_species_cucurbita_maxima",
    scientificName: "Cucurbita maxima",
    commonNameUk: "Гарбуз",
    commonNameEn: "Pumpkin",
  },
  {
    id: "kb_species_brassica_oleracea_capitata",
    scientificName: "Brassica oleracea var. capitata",
    commonNameUk: "Капуста білоголова",
    commonNameEn: "Cabbage",
  },
  {
    id: "kb_species_brassica_oleracea_italica",
    scientificName: "Brassica oleracea var. italica",
    commonNameUk: "Броколі",
    commonNameEn: "Broccoli",
  },
  {
    id: "kb_species_brassica_oleracea_botrytis",
    scientificName: "Brassica oleracea var. botrytis",
    commonNameUk: "Цвітна капуста",
    commonNameEn: "Cauliflower",
  },
  {
    id: "kb_species_brassica_oleracea_gongylodes",
    scientificName: "Brassica oleracea var. gongylodes",
    commonNameUk: "Кольрабі",
    commonNameEn: "Kohlrabi",
  },
  {
    id: "kb_species_daucus_carota",
    scientificName: "Daucus carota",
    commonNameUk: "Морква",
    commonNameEn: "Carrot",
  },
  {
    id: "kb_species_petroselinum_crispum",
    scientificName: "Petroselinum crispum",
    commonNameUk: "Петрушка",
    commonNameEn: "Parsley",
  },
  {
    id: "kb_species_apium_graveolens",
    scientificName: "Apium graveolens",
    commonNameUk: "Селера",
    commonNameEn: "Celery",
  },
  {
    id: "kb_species_allium_cepa",
    scientificName: "Allium cepa",
    commonNameUk: "Цибуля ріпчаста",
    commonNameEn: "Onion",
  },
  {
    id: "kb_species_allium_sativum",
    scientificName: "Allium sativum",
    commonNameUk: "Часник",
    commonNameEn: "Garlic",
  },
  {
    id: "kb_species_allium_porrum",
    scientificName: "Allium porrum",
    commonNameUk: "Цибуля-порей",
    commonNameEn: "Leek",
  },
  {
    id: "kb_species_lactuca_sativa",
    scientificName: "Lactuca sativa",
    commonNameUk: "Салат",
    commonNameEn: "Lettuce",
  },
  {
    id: "kb_species_spinacia_oleracea",
    scientificName: "Spinacia oleracea",
    commonNameUk: "Шпинат",
    commonNameEn: "Spinach",
  },
  {
    id: "kb_species_pisum_sativum",
    scientificName: "Pisum sativum",
    commonNameUk: "Горох",
    commonNameEn: "Pea",
  },
  {
    id: "kb_species_phaseolus_vulgaris",
    scientificName: "Phaseolus vulgaris",
    commonNameUk: "Квасоля",
    commonNameEn: "Bean",
  },
  {
    id: "kb_species_beta_vulgaris",
    scientificName: "Beta vulgaris",
    commonNameUk: "Буряк столовий",
    commonNameEn: "Beet",
  },
  {
    id: "kb_species_zea_mays",
    scientificName: "Zea mays",
    commonNameUk: "Кукурудза цукрова",
    commonNameEn: "Sweet corn",
  },
  {
    id: "kb_species_pastinaca_sativa",
    scientificName: "Pastinaca sativa",
    commonNameUk: "Пастернак",
    commonNameEn: "Parsnip",
  },
  {
    id: "kb_species_anethum_graveolens",
    scientificName: "Anethum graveolens",
    commonNameUk: "Кріп",
    commonNameEn: "Dill",
  },
  {
    id: "kb_species_triticum_aestivum",
    scientificName: "Triticum aestivum",
    commonNameUk: "Пшениця м'яка",
    commonNameEn: "Bread wheat",
  },
  {
    id: "kb_species_triticum_durum",
    scientificName: "Triticum durum",
    commonNameUk: "Пшениця тверда",
    commonNameEn: "Durum wheat",
  },
  {
    id: "kb_species_triticum_spelta",
    scientificName: "Triticum spelta",
    commonNameUk: "Спельта",
    commonNameEn: "Spelt",
  },
  {
    id: "kb_species_secale_cereale",
    scientificName: "Secale cereale",
    commonNameUk: "Жито",
    commonNameEn: "Rye",
  },
  {
    id: "kb_species_hordeum_vulgare",
    scientificName: "Hordeum vulgare",
    commonNameUk: "Ячмінь",
    commonNameEn: "Barley",
  },
  {
    id: "kb_species_avena_sativa",
    scientificName: "Avena sativa",
    commonNameUk: "Овес",
    commonNameEn: "Oat",
  },
  {
    id: "kb_species_oryza_sativa",
    scientificName: "Oryza sativa",
    commonNameUk: "Рис",
    commonNameEn: "Rice",
  },
  {
    id: "kb_species_panicum_miliaceum",
    scientificName: "Panicum miliaceum",
    commonNameUk: "Просо",
    commonNameEn: "Proso millet",
  },
  {
    id: "kb_species_sorghum_bicolor",
    scientificName: "Sorghum bicolor",
    commonNameUk: "Сорго",
    commonNameEn: "Sorghum",
  },
  {
    id: "kb_species_fagopyrum_esculentum",
    scientificName: "Fagopyrum esculentum",
    commonNameUk: "Гречка",
    commonNameEn: "Buckwheat",
  },
  {
    id: "kb_species_triticosecale",
    scientificName: "× Triticosecale",
    commonNameUk: "Тритикале",
    commonNameEn: "Triticale",
  },
  {
    id: "kb_species_lens_culinaris",
    scientificName: "Lens culinaris",
    commonNameUk: "Сочевиця",
    commonNameEn: "Lentil",
  },
  {
    id: "kb_species_cicer_arietinum",
    scientificName: "Cicer arietinum",
    commonNameUk: "Нут",
    commonNameEn: "Chickpea",
  },
  {
    id: "kb_species_glycine_max",
    scientificName: "Glycine max",
    commonNameUk: "Соя",
    commonNameEn: "Soybean",
  },
  {
    id: "kb_species_lupinus_albus",
    scientificName: "Lupinus albus",
    commonNameUk: "Люпин білий",
    commonNameEn: "White lupin",
  },
  {
    id: "kb_species_trifolium_pratense",
    scientificName: "Trifolium pratense",
    commonNameUk: "Конюшина лучна",
    commonNameEn: "Red clover",
  },
  {
    id: "kb_species_medicago_sativa",
    scientificName: "Medicago sativa",
    commonNameUk: "Люцерна",
    commonNameEn: "Alfalfa",
  },
  {
    id: "kb_species_vicia_faba",
    scientificName: "Vicia faba",
    commonNameUk: "Біб городній",
    commonNameEn: "Fava bean",
  },
  {
    id: "kb_species_vicia_sativa",
    scientificName: "Vicia sativa",
    commonNameUk: "Вика посівна",
    commonNameEn: "Common vetch",
  },
  {
    id: "kb_species_arachis_hypogaea",
    scientificName: "Arachis hypogaea",
    commonNameUk: "Арахіс",
    commonNameEn: "Peanut",
  },
  {
    id: "kb_species_helianthus_annuus",
    scientificName: "Helianthus annuus",
    commonNameUk: "Соняшник",
    commonNameEn: "Sunflower",
  },
  {
    id: "kb_species_brassica_napus",
    scientificName: "Brassica napus",
    commonNameUk: "Ріпак",
    commonNameEn: "Oilseed rape",
  },
  {
    id: "kb_species_linum_usitatissimum",
    scientificName: "Linum usitatissimum",
    commonNameUk: "Льон олійний",
    commonNameEn: "Oil flax",
  },
  {
    id: "kb_species_sinapis_alba",
    scientificName: "Sinapis alba",
    commonNameUk: "Гірчиця біла",
    commonNameEn: "White mustard",
  },
  {
    id: "kb_species_brassica_juncea",
    scientificName: "Brassica juncea",
    commonNameUk: "Гірчиця сарептська",
    commonNameEn: "Brown mustard",
  },
  {
    id: "kb_species_camelina_sativa",
    scientificName: "Camelina sativa",
    commonNameUk: "Рижій посівний",
    commonNameEn: "Camelina",
  },
  {
    id: "kb_species_carthamus_tinctorius",
    scientificName: "Carthamus tinctorius",
    commonNameUk: "Сафлор",
    commonNameEn: "Safflower",
  },
  {
    id: "kb_species_papaver_somniferum",
    scientificName: "Papaver somniferum",
    commonNameUk: "Мак олійний",
    commonNameEn: "Oil poppy",
  },
  {
    id: "kb_species_rubus_idaeus",
    scientificName: "Rubus idaeus",
    commonNameUk: "Малина",
    commonNameEn: "Raspberry",
  },
  {
    id: "kb_species_rubus_fruticosus",
    scientificName: "Rubus fruticosus",
    commonNameUk: "Ожина",
    commonNameEn: "Blackberry",
  },
  {
    id: "kb_species_ribes_nigrum",
    scientificName: "Ribes nigrum",
    commonNameUk: "Смородина чорна",
    commonNameEn: "Blackcurrant",
  },
  {
    id: "kb_species_ribes_rubrum",
    scientificName: "Ribes rubrum",
    commonNameUk: "Смородина червона",
    commonNameEn: "Redcurrant",
  },
  {
    id: "kb_species_ribes_uva_crispa",
    scientificName: "Ribes uva-crispa",
    commonNameUk: "Аґрус",
    commonNameEn: "Gooseberry",
  },
  {
    id: "kb_species_vaccinium_corymbosum",
    scientificName: "Vaccinium corymbosum",
    commonNameUk: "Лохина",
    commonNameEn: "Highbush blueberry",
  },
  {
    id: "kb_species_hippophae_rhamnoides",
    scientificName: "Hippophae rhamnoides",
    commonNameUk: "Обліпиха",
    commonNameEn: "Sea buckthorn",
  },
  {
    id: "kb_species_lonicera_caerulea",
    scientificName: "Lonicera caerulea",
    commonNameUk: "Жимолость їстівна",
    commonNameEn: "Honeyberry",
  },
  {
    id: "kb_species_aronia_melanocarpa",
    scientificName: "Aronia melanocarpa",
    commonNameUk: "Аронія",
    commonNameEn: "Chokeberry",
  },
]

const CULTIVARS: SeedCultivar[] = [
  {
    id: "kb_cultivar_bychache_sertse",
    speciesId: "kb_species_solanum_lycopersicum",
    name: "Бичаче серце",
  },
  {
    id: "kb_cultivar_kornishony",
    speciesId: "kb_species_cucumis_sativus",
    name: "Корнішони",
  },
  {
    id: "kb_cultivar_solodkyi",
    speciesId: "kb_species_capsicum_annuum",
    name: "Солодкий",
  },
  {
    id: "kb_cultivar_genuezkyi",
    speciesId: "kb_species_ocimum_basilicum",
    name: "Генуезький",
  },
  {
    id: "kb_cultivar_pertseva",
    speciesId: "kb_species_mentha_piperita",
    name: "Перцева",
  },
  {
    id: "kb_cultivar_albion",
    speciesId: "kb_species_fragaria_ananassa",
    name: "Альбіон",
  },
  { id: "kb_cultivar_belaroza", speciesId: "kb_species_solanum_tuberosum", name: "Белароза" },
  { id: "kb_cultivar_almaz", speciesId: "kb_species_solanum_melongena", name: "Алмаз" },
  { id: "kb_cultivar_tsukesha", speciesId: "kb_species_cucurbita_pepo", name: "Цукеша" },
  { id: "kb_cultivar_hileia", speciesId: "kb_species_cucurbita_maxima", name: "Гілея" },
  { id: "kb_cultivar_amager", speciesId: "kb_species_brassica_oleracea_capitata", name: "Амагер 611" },
  { id: "kb_cultivar_tonus", speciesId: "kb_species_brassica_oleracea_italica", name: "Тонус" },
  {
    id: "kb_cultivar_snihova_kulia",
    speciesId: "kb_species_brassica_oleracea_botrytis",
    name: "Снігова куля",
  },
  {
    id: "kb_cultivar_videnska_bila",
    speciesId: "kb_species_brassica_oleracea_gongylodes",
    name: "Віденська біла",
  },
  { id: "kb_cultivar_nantska", speciesId: "kb_species_daucus_carota", name: "Нантська" },
  { id: "kb_cultivar_lystova", speciesId: "kb_species_petroselinum_crispum", name: "Листова" },
  { id: "kb_cultivar_yabluchnyi", speciesId: "kb_species_apium_graveolens", name: "Яблучний" },
  { id: "kb_cultivar_stuttgarter", speciesId: "kb_species_allium_cepa", name: "Штутгартер Різен" },
  { id: "kb_cultivar_liubasha", speciesId: "kb_species_allium_sativum", name: "Любаша" },
  { id: "kb_cultivar_karantanskyi", speciesId: "kb_species_allium_porrum", name: "Карантанський" },
  { id: "kb_cultivar_lollo_rossa", speciesId: "kb_species_lactuca_sativa", name: "Лолло Росса" },
  { id: "kb_cultivar_viktoriia", speciesId: "kb_species_spinacia_oleracea", name: "Вікторія" },
  { id: "kb_cultivar_alfa", speciesId: "kb_species_pisum_sativum", name: "Альфа" },
  { id: "kb_cultivar_saksa", speciesId: "kb_species_phaseolus_vulgaris", name: "Сакса" },
  { id: "kb_cultivar_bordo", speciesId: "kb_species_beta_vulgaris", name: "Бордо 237" },
  { id: "kb_cultivar_spirit", speciesId: "kb_species_zea_mays", name: "Спіріт" },
  { id: "kb_cultivar_kruhlyi", speciesId: "kb_species_pastinaca_sativa", name: "Круглий" },
  { id: "kb_cultivar_hrybovskyi", speciesId: "kb_species_anethum_graveolens", name: "Грибовський" },
  { id: "kb_cultivar_podolianka", speciesId: "kb_species_triticum_aestivum", name: "Подолянка" },
  { id: "kb_cultivar_kurant", speciesId: "kb_species_triticum_durum", name: "Курант" },
  { id: "kb_cultivar_zoria_ukrainy", speciesId: "kb_species_triticum_spelta", name: "Зоря України" },
  { id: "kb_cultivar_intensyvne", speciesId: "kb_species_secale_cereale", name: "Інтенсивне 99" },
  { id: "kb_cultivar_vakula", speciesId: "kb_species_hordeum_vulgare", name: "Вакула" },
  { id: "kb_cultivar_skakun", speciesId: "kb_species_avena_sativa", name: "Скакун" },
  { id: "kb_cultivar_ukraina_96", speciesId: "kb_species_oryza_sativa", name: "Україна 96" },
  { id: "kb_cultivar_myronivske_51", speciesId: "kb_species_panicum_miliaceum", name: "Миронівське 51" },
  { id: "kb_cultivar_vinets", speciesId: "kb_species_sorghum_bicolor", name: "Вінець" },
  { id: "kb_cultivar_antariia", speciesId: "kb_species_fagopyrum_esculentum", name: "Антарія" },
  { id: "kb_cultivar_ratne", speciesId: "kb_species_triticosecale", name: "Ратне" },
  { id: "kb_cultivar_linza", speciesId: "kb_species_lens_culinaris", name: "Лінза" },
  { id: "kb_cultivar_rozanna", speciesId: "kb_species_cicer_arietinum", name: "Розанна" },
  { id: "kb_cultivar_annushka", speciesId: "kb_species_glycine_max", name: "Аннушка" },
  { id: "kb_cultivar_olezh", speciesId: "kb_species_lupinus_albus", name: "Олеж" },
  { id: "kb_cultivar_darunok", speciesId: "kb_species_trifolium_pratense", name: "Дарунок" },
  { id: "kb_cultivar_nadiia", speciesId: "kb_species_medicago_sativa", name: "Надія" },
  { id: "kb_cultivar_ukrainski", speciesId: "kb_species_vicia_faba", name: "Українські" },
  { id: "kb_cultivar_bilotserkivska", speciesId: "kb_species_vicia_sativa", name: "Білоцерківська 7" },
  { id: "kb_cultivar_stepniak", speciesId: "kb_species_arachis_hypogaea", name: "Степняк" },
  { id: "kb_cultivar_yason", speciesId: "kb_species_helianthus_annuus", name: "Ясон" },
  { id: "kb_cultivar_atlant", speciesId: "kb_species_brassica_napus", name: "Атлант" },
  { id: "kb_cultivar_pivdenna_nich", speciesId: "kb_species_linum_usitatissimum", name: "Південна ніч" },
  { id: "kb_cultivar_talisman", speciesId: "kb_species_sinapis_alba", name: "Талісман" },
  { id: "kb_cultivar_roksana", speciesId: "kb_species_brassica_juncea", name: "Роксана" },
  { id: "kb_cultivar_stepova", speciesId: "kb_species_camelina_sativa", name: "Степова 1" },
  { id: "kb_cultivar_zhyvchyk", speciesId: "kb_species_carthamus_tinctorius", name: "Живчик" },
  { id: "kb_cultivar_berkut", speciesId: "kb_species_papaver_somniferum", name: "Беркут" },
  { id: "kb_cultivar_brusviana", speciesId: "kb_species_rubus_idaeus", name: "Брусвяна" },
  { id: "kb_cultivar_thornfree", speciesId: "kb_species_rubus_fruticosus", name: "Торнфрі" },
  { id: "kb_cultivar_sofiivska", speciesId: "kb_species_ribes_nigrum", name: "Софіївська" },
  { id: "kb_cultivar_jonkheer", speciesId: "kb_species_ribes_rubrum", name: "Йонкер ван Тетс" },
  { id: "kb_cultivar_neslukhivskyi", speciesId: "kb_species_ribes_uva_crispa", name: "Неслухівський" },
  { id: "kb_cultivar_duke", speciesId: "kb_species_vaccinium_corymbosum", name: "Дюк" },
  { id: "kb_cultivar_oranzheva", speciesId: "kb_species_hippophae_rhamnoides", name: "Оранжева" },
  { id: "kb_cultivar_bohdana", speciesId: "kb_species_lonicera_caerulea", name: "Богдана" },
  { id: "kb_cultivar_nero", speciesId: "kb_species_aronia_melanocarpa", name: "Неро" },
]

const GROUPS: SeedGroup[] = [
  {
    id: "kb_cg_botanical",
    nameUk: "Ботанічна родина",
    nameEn: "Botanical family",
    type: "botanical",
  },
  {
    id: "kb_cg_agricultural_use",
    nameUk: "Сільськогосподарське використання",
    nameEn: "Agricultural use",
    type: "agricultural_use",
  },
  {
    id: "kb_cg_used_part",
    nameUk: "Використовувана частина",
    nameEn: "Used part",
    type: "used_part",
  },
  {
    id: "kb_cg_life_cycle",
    nameUk: "Життєвий цикл",
    nameEn: "Life cycle",
    type: "life_cycle",
  },
  {
    id: "kb_cg_cultivation",
    nameUk: "Тип вирощування",
    nameEn: "Cultivation type",
    type: "cultivation",
  },
]

const VALUES: SeedValue[] = [
  // botanical
  { id: "kb_cv_poaceae", groupId: "kb_cg_botanical", nameUk: "Злакові", nameEn: "Poaceae" },
  { id: "kb_cv_fabaceae", groupId: "kb_cg_botanical", nameUk: "Бобові", nameEn: "Fabaceae" },
  { id: "kb_cv_solanaceae", groupId: "kb_cg_botanical", nameUk: "Пасльонові", nameEn: "Solanaceae" },
  { id: "kb_cv_brassicaceae", groupId: "kb_cg_botanical", nameUk: "Капустяні", nameEn: "Brassicaceae" },
  { id: "kb_cv_cucurbitaceae", groupId: "kb_cg_botanical", nameUk: "Гарбузові", nameEn: "Cucurbitaceae" },
  { id: "kb_cv_rosaceae", groupId: "kb_cg_botanical", nameUk: "Розові", nameEn: "Rosaceae" },
  { id: "kb_cv_apiaceae", groupId: "kb_cg_botanical", nameUk: "Зонтичні", nameEn: "Apiaceae" },
  { id: "kb_cv_asteraceae", groupId: "kb_cg_botanical", nameUk: "Айстрові", nameEn: "Asteraceae" },
  { id: "kb_cv_lamiaceae", groupId: "kb_cg_botanical", nameUk: "Глухокропивові", nameEn: "Lamiaceae" },
  { id: "kb_cv_amaryllidaceae", groupId: "kb_cg_botanical", nameUk: "Амарилісові", nameEn: "Amaryllidaceae" },
  { id: "kb_cv_amaranthaceae", groupId: "kb_cg_botanical", nameUk: "Щирицеві", nameEn: "Amaranthaceae" },
  { id: "kb_cv_polygonaceae", groupId: "kb_cg_botanical", nameUk: "Гречкові", nameEn: "Polygonaceae" },
  { id: "kb_cv_linaceae", groupId: "kb_cg_botanical", nameUk: "Льонові", nameEn: "Linaceae" },
  { id: "kb_cv_papaveraceae", groupId: "kb_cg_botanical", nameUk: "Макові", nameEn: "Papaveraceae" },
  { id: "kb_cv_grossulariaceae", groupId: "kb_cg_botanical", nameUk: "Аґрусові", nameEn: "Grossulariaceae" },
  { id: "kb_cv_ericaceae", groupId: "kb_cg_botanical", nameUk: "Вересові", nameEn: "Ericaceae" },
  { id: "kb_cv_elaeagnaceae", groupId: "kb_cg_botanical", nameUk: "Маслинкові", nameEn: "Elaeagnaceae" },
  { id: "kb_cv_caprifoliaceae", groupId: "kb_cg_botanical", nameUk: "Жимолостеві", nameEn: "Caprifoliaceae" },
  { id: "kb_cv_botanical_other", groupId: "kb_cg_botanical", nameUk: "Інші", nameEn: "Other" },
  // agricultural_use
  { id: "kb_cv_cereal", groupId: "kb_cg_agricultural_use", nameUk: "Зернова", nameEn: "Cereal" },
  { id: "kb_cv_legume", groupId: "kb_cg_agricultural_use", nameUk: "Зернобобова", nameEn: "Legume" },
  { id: "kb_cv_oilseed", groupId: "kb_cg_agricultural_use", nameUk: "Олійна", nameEn: "Oilseed" },
  { id: "kb_cv_vegetable", groupId: "kb_cg_agricultural_use", nameUk: "Овочева", nameEn: "Vegetable" },
  { id: "kb_cv_fruit", groupId: "kb_cg_agricultural_use", nameUk: "Плодова", nameEn: "Fruit" },
  { id: "kb_cv_berry", groupId: "kb_cg_agricultural_use", nameUk: "Ягідна", nameEn: "Berry" },
  { id: "kb_cv_melon", groupId: "kb_cg_agricultural_use", nameUk: "Баштанна", nameEn: "Melon" },
  { id: "kb_cv_root_crop", groupId: "kb_cg_agricultural_use", nameUk: "Коренеплідна", nameEn: "Root crop" },
  { id: "kb_cv_tuber_crop", groupId: "kb_cg_agricultural_use", nameUk: "Бульбоплідна", nameEn: "Tuber crop" },
  { id: "kb_cv_sugar_crop", groupId: "kb_cg_agricultural_use", nameUk: "Цукроносна", nameEn: "Sugar crop" },
  { id: "kb_cv_fiber", groupId: "kb_cg_agricultural_use", nameUk: "Прядивна", nameEn: "Fiber" },
  { id: "kb_cv_fodder", groupId: "kb_cg_agricultural_use", nameUk: "Кормова", nameEn: "Fodder" },
  { id: "kb_cv_medicinal", groupId: "kb_cg_agricultural_use", nameUk: "Лікарська", nameEn: "Medicinal" },
  { id: "kb_cv_herb", groupId: "kb_cg_agricultural_use", nameUk: "Пряна / зелена", nameEn: "Herb" },
  { id: "kb_cv_aromatic", groupId: "kb_cg_agricultural_use", nameUk: "Пряно-ароматична", nameEn: "Aromatic" },
  { id: "kb_cv_ornamental", groupId: "kb_cg_agricultural_use", nameUk: "Декоративна", nameEn: "Ornamental" },
  { id: "kb_cv_timber", groupId: "kb_cg_agricultural_use", nameUk: "Деревна", nameEn: "Timber" },
  { id: "kb_cv_bioenergy", groupId: "kb_cg_agricultural_use", nameUk: "Енергетична", nameEn: "Bioenergy" },
  { id: "kb_cv_green_manure", groupId: "kb_cg_agricultural_use", nameUk: "Сидеральна", nameEn: "Green manure" },
  // used_part
  { id: "kb_cv_part_grain", groupId: "kb_cg_used_part", nameUk: "Зерно", nameEn: "Grain" },
  { id: "kb_cv_part_seed", groupId: "kb_cg_used_part", nameUk: "Насіння", nameEn: "Seed" },
  { id: "kb_cv_part_root", groupId: "kb_cg_used_part", nameUk: "Корінь", nameEn: "Root" },
  { id: "kb_cv_part_root_crop", groupId: "kb_cg_used_part", nameUk: "Коренеплід", nameEn: "Root crop" },
  { id: "kb_cv_part_tuber", groupId: "kb_cg_used_part", nameUk: "Бульба", nameEn: "Tuber" },
  { id: "kb_cv_part_bulb", groupId: "kb_cg_used_part", nameUk: "Цибулина", nameEn: "Bulb" },
  { id: "kb_cv_part_rhizome", groupId: "kb_cg_used_part", nameUk: "Кореневище", nameEn: "Rhizome" },
  { id: "kb_cv_part_leaf", groupId: "kb_cg_used_part", nameUk: "Листя", nameEn: "Leaf" },
  { id: "kb_cv_part_stem", groupId: "kb_cg_used_part", nameUk: "Стебло", nameEn: "Stem" },
  { id: "kb_cv_part_shoot", groupId: "kb_cg_used_part", nameUk: "Пагін", nameEn: "Shoot" },
  { id: "kb_cv_part_flower", groupId: "kb_cg_used_part", nameUk: "Квітка", nameEn: "Flower" },
  { id: "kb_cv_part_fruit", groupId: "kb_cg_used_part", nameUk: "Плід", nameEn: "Fruit" },
  { id: "kb_cv_part_berry", groupId: "kb_cg_used_part", nameUk: "Ягода", nameEn: "Berry" },
  { id: "kb_cv_part_bark", groupId: "kb_cg_used_part", nameUk: "Кора", nameEn: "Bark" },
  { id: "kb_cv_part_wood", groupId: "kb_cg_used_part", nameUk: "Деревина", nameEn: "Wood" },
  { id: "kb_cv_part_sap", groupId: "kb_cg_used_part", nameUk: "Сік", nameEn: "Sap" },
  { id: "kb_cv_part_oil", groupId: "kb_cg_used_part", nameUk: "Олія", nameEn: "Oil" },
  { id: "kb_cv_part_fiber", groupId: "kb_cg_used_part", nameUk: "Волокно", nameEn: "Fiber" },
  { id: "kb_cv_part_resin", groupId: "kb_cg_used_part", nameUk: "Смола", nameEn: "Resin" },
  { id: "kb_cv_part_essential_oil", groupId: "kb_cg_used_part", nameUk: "Ефірна олія", nameEn: "Essential oil" },
  { id: "kb_cv_part_whole_plant", groupId: "kb_cg_used_part", nameUk: "Вся рослина", nameEn: "Whole plant" },
  // life_cycle
  { id: "kb_cv_annual", groupId: "kb_cg_life_cycle", nameUk: "Однорічна", nameEn: "Annual" },
  { id: "kb_cv_biennial", groupId: "kb_cg_life_cycle", nameUk: "Дворічна", nameEn: "Biennial" },
  { id: "kb_cv_perennial", groupId: "kb_cg_life_cycle", nameUk: "Багаторічна", nameEn: "Perennial" },
  // cultivation
  { id: "kb_cv_field", groupId: "kb_cg_cultivation", nameUk: "Польове", nameEn: "Field" },
  { id: "kb_cv_vegetable_garden", groupId: "kb_cg_cultivation", nameUk: "Город", nameEn: "Vegetable garden" },
  { id: "kb_cv_greenhouse", groupId: "kb_cg_cultivation", nameUk: "Теплиця", nameEn: "Greenhouse" },
  { id: "kb_cv_container", groupId: "kb_cg_cultivation", nameUk: "Контейнерне", nameEn: "Container" },
]

/** speciesId → classification value ids */
const SPECIES_CLASSIFICATIONS: Record<string, string[]> = {
  kb_species_solanum_lycopersicum: [
    "kb_cv_solanaceae",
    "kb_cv_vegetable",
    "kb_cv_part_fruit",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
    "kb_cv_greenhouse",
    "kb_cv_container",
  ],
  kb_species_cucumis_sativus: [
    "kb_cv_cucurbitaceae",
    "kb_cv_vegetable",
    "kb_cv_part_fruit",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_greenhouse",
  ],
  kb_species_capsicum_annuum: [
    "kb_cv_solanaceae",
    "kb_cv_vegetable",
    "kb_cv_part_fruit",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_greenhouse",
    "kb_cv_container",
  ],
  kb_species_raphanus_sativus: [
    "kb_cv_brassicaceae",
    "kb_cv_vegetable",
    "kb_cv_part_root",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_ocimum_basilicum: [
    "kb_cv_lamiaceae",
    "kb_cv_herb",
    "kb_cv_part_leaf",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_container",
  ],
  kb_species_mentha_piperita: [
    "kb_cv_lamiaceae",
    "kb_cv_herb",
    "kb_cv_medicinal",
    "kb_cv_part_leaf",
    "kb_cv_perennial",
    "kb_cv_vegetable_garden",
    "kb_cv_container",
  ],
  kb_species_fragaria_ananassa: [
    "kb_cv_rosaceae",
    "kb_cv_berry",
    "kb_cv_part_fruit",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
    "kb_cv_container",
  ],
  kb_species_solanum_tuberosum: [
    "kb_cv_solanaceae",
    "kb_cv_vegetable",
    "kb_cv_tuber_crop",
    "kb_cv_part_tuber",
    "kb_cv_annual",
    "kb_cv_perennial",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_solanum_melongena: [
    "kb_cv_solanaceae",
    "kb_cv_vegetable",
    "kb_cv_part_fruit",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_perennial",
    "kb_cv_vegetable_garden",
    "kb_cv_greenhouse",
    "kb_cv_container",
  ],
  kb_species_cucurbita_pepo: [
    "kb_cv_cucurbitaceae",
    "kb_cv_vegetable",
    "kb_cv_part_fruit",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
    "kb_cv_greenhouse",
  ],
  kb_species_cucurbita_maxima: [
    "kb_cv_cucurbitaceae",
    "kb_cv_vegetable",
    "kb_cv_melon",
    "kb_cv_part_fruit",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_brassica_oleracea_capitata: [
    "kb_cv_brassicaceae",
    "kb_cv_vegetable",
    "kb_cv_part_leaf",
    "kb_cv_annual",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_brassica_oleracea_italica: [
    "kb_cv_brassicaceae",
    "kb_cv_vegetable",
    "kb_cv_part_flower",
    "kb_cv_part_stem",
    "kb_cv_part_shoot",
    "kb_cv_annual",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_brassica_oleracea_botrytis: [
    "kb_cv_brassicaceae",
    "kb_cv_vegetable",
    "kb_cv_part_flower",
    "kb_cv_annual",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_brassica_oleracea_gongylodes: [
    "kb_cv_brassicaceae",
    "kb_cv_vegetable",
    "kb_cv_part_stem",
    "kb_cv_annual",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_daucus_carota: [
    "kb_cv_apiaceae",
    "kb_cv_vegetable",
    "kb_cv_root_crop",
    "kb_cv_part_root_crop",
    "kb_cv_part_leaf",
    "kb_cv_annual",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_petroselinum_crispum: [
    "kb_cv_apiaceae",
    "kb_cv_vegetable",
    "kb_cv_herb",
    "kb_cv_aromatic",
    "kb_cv_part_leaf",
    "kb_cv_part_root",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_container",
  ],
  kb_species_apium_graveolens: [
    "kb_cv_apiaceae",
    "kb_cv_vegetable",
    "kb_cv_herb",
    "kb_cv_part_stem",
    "kb_cv_part_leaf",
    "kb_cv_part_root",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_allium_cepa: [
    "kb_cv_amaryllidaceae",
    "kb_cv_vegetable",
    "kb_cv_part_bulb",
    "kb_cv_part_leaf",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_allium_sativum: [
    "kb_cv_amaryllidaceae",
    "kb_cv_vegetable",
    "kb_cv_aromatic",
    "kb_cv_medicinal",
    "kb_cv_part_bulb",
    "kb_cv_part_leaf",
    "kb_cv_annual",
    "kb_cv_perennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_allium_porrum: [
    "kb_cv_amaryllidaceae",
    "kb_cv_vegetable",
    "kb_cv_part_stem",
    "kb_cv_part_leaf",
    "kb_cv_part_shoot",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_lactuca_sativa: [
    "kb_cv_asteraceae",
    "kb_cv_vegetable",
    "kb_cv_part_leaf",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_container",
    "kb_cv_greenhouse",
  ],
  kb_species_spinacia_oleracea: [
    "kb_cv_amaranthaceae",
    "kb_cv_vegetable",
    "kb_cv_part_leaf",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
    "kb_cv_container",
  ],
  kb_species_pisum_sativum: [
    "kb_cv_fabaceae",
    "kb_cv_vegetable",
    "kb_cv_legume",
    "kb_cv_part_seed",
    "kb_cv_part_fruit",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_phaseolus_vulgaris: [
    "kb_cv_fabaceae",
    "kb_cv_vegetable",
    "kb_cv_legume",
    "kb_cv_part_fruit",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_beta_vulgaris: [
    "kb_cv_amaranthaceae",
    "kb_cv_vegetable",
    "kb_cv_root_crop",
    "kb_cv_part_root_crop",
    "kb_cv_part_leaf",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_zea_mays: [
    "kb_cv_poaceae",
    "kb_cv_vegetable",
    "kb_cv_cereal",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_pastinaca_sativa: [
    "kb_cv_apiaceae",
    "kb_cv_vegetable",
    "kb_cv_root_crop",
    "kb_cv_part_root_crop",
    "kb_cv_biennial",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
  ],
  kb_species_anethum_graveolens: [
    "kb_cv_apiaceae",
    "kb_cv_vegetable",
    "kb_cv_herb",
    "kb_cv_aromatic",
    "kb_cv_part_leaf",
    "kb_cv_part_seed",
    "kb_cv_part_stem",
    "kb_cv_annual",
    "kb_cv_vegetable_garden",
    "kb_cv_field",
    "kb_cv_container",
  ],
  kb_species_triticum_aestivum: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_triticum_durum: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_triticum_spelta: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_secale_cereale: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_fodder",
    "kb_cv_green_manure",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_hordeum_vulgare: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_fodder",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_avena_sativa: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_fodder",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_oryza_sativa: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_panicum_miliaceum: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_fodder",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_sorghum_bicolor: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_fodder",
    "kb_cv_bioenergy",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_part_stem",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_fagopyrum_esculentum: [
    "kb_cv_polygonaceae",
    "kb_cv_cereal",
    "kb_cv_green_manure",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_triticosecale: [
    "kb_cv_poaceae",
    "kb_cv_cereal",
    "kb_cv_fodder",
    "kb_cv_part_grain",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_lens_culinaris: [
    "kb_cv_fabaceae",
    "kb_cv_legume",
    "kb_cv_vegetable",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_cicer_arietinum: [
    "kb_cv_fabaceae",
    "kb_cv_legume",
    "kb_cv_vegetable",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_glycine_max: [
    "kb_cv_fabaceae",
    "kb_cv_legume",
    "kb_cv_oilseed",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_lupinus_albus: [
    "kb_cv_fabaceae",
    "kb_cv_legume",
    "kb_cv_fodder",
    "kb_cv_green_manure",
    "kb_cv_part_seed",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_trifolium_pratense: [
    "kb_cv_fabaceae",
    "kb_cv_fodder",
    "kb_cv_green_manure",
    "kb_cv_part_leaf",
    "kb_cv_part_whole_plant",
    "kb_cv_perennial",
    "kb_cv_field",
  ],
  kb_species_medicago_sativa: [
    "kb_cv_fabaceae",
    "kb_cv_fodder",
    "kb_cv_green_manure",
    "kb_cv_part_leaf",
    "kb_cv_part_whole_plant",
    "kb_cv_perennial",
    "kb_cv_field",
  ],
  kb_species_vicia_faba: [
    "kb_cv_fabaceae",
    "kb_cv_legume",
    "kb_cv_vegetable",
    "kb_cv_fodder",
    "kb_cv_part_seed",
    "kb_cv_part_fruit",
    "kb_cv_annual",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_vicia_sativa: [
    "kb_cv_fabaceae",
    "kb_cv_fodder",
    "kb_cv_green_manure",
    "kb_cv_part_seed",
    "kb_cv_part_whole_plant",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_arachis_hypogaea: [
    "kb_cv_fabaceae",
    "kb_cv_legume",
    "kb_cv_oilseed",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_helianthus_annuus: [
    "kb_cv_asteraceae",
    "kb_cv_oilseed",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_brassica_napus: [
    "kb_cv_brassicaceae",
    "kb_cv_oilseed",
    "kb_cv_bioenergy",
    "kb_cv_fodder",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_linum_usitatissimum: [
    "kb_cv_linaceae",
    "kb_cv_oilseed",
    "kb_cv_fiber",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_sinapis_alba: [
    "kb_cv_brassicaceae",
    "kb_cv_oilseed",
    "kb_cv_green_manure",
    "kb_cv_aromatic",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_brassica_juncea: [
    "kb_cv_brassicaceae",
    "kb_cv_oilseed",
    "kb_cv_aromatic",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_camelina_sativa: [
    "kb_cv_brassicaceae",
    "kb_cv_oilseed",
    "kb_cv_bioenergy",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_carthamus_tinctorius: [
    "kb_cv_asteraceae",
    "kb_cv_oilseed",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_papaver_somniferum: [
    "kb_cv_papaveraceae",
    "kb_cv_oilseed",
    "kb_cv_part_seed",
    "kb_cv_part_oil",
    "kb_cv_annual",
    "kb_cv_field",
  ],
  kb_species_rubus_idaeus: [
    "kb_cv_rosaceae",
    "kb_cv_berry",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_rubus_fruticosus: [
    "kb_cv_rosaceae",
    "kb_cv_berry",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_ribes_nigrum: [
    "kb_cv_grossulariaceae",
    "kb_cv_berry",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_ribes_rubrum: [
    "kb_cv_grossulariaceae",
    "kb_cv_berry",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
  kb_species_ribes_uva_crispa: [
    "kb_cv_grossulariaceae",
    "kb_cv_berry",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_vegetable_garden",
  ],
  kb_species_vaccinium_corymbosum: [
    "kb_cv_ericaceae",
    "kb_cv_berry",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
    "kb_cv_container",
  ],
  kb_species_hippophae_rhamnoides: [
    "kb_cv_elaeagnaceae",
    "kb_cv_berry",
    "kb_cv_medicinal",
    "kb_cv_part_berry",
    "kb_cv_part_oil",
    "kb_cv_perennial",
    "kb_cv_field",
  ],
  kb_species_lonicera_caerulea: [
    "kb_cv_caprifoliaceae",
    "kb_cv_berry",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_vegetable_garden",
  ],
  kb_species_aronia_melanocarpa: [
    "kb_cv_rosaceae",
    "kb_cv_berry",
    "kb_cv_medicinal",
    "kb_cv_part_berry",
    "kb_cv_perennial",
    "kb_cv_field",
    "kb_cv_vegetable_garden",
  ],
}

const DISEASES: SeedDisease[] = [
  { id: "kb_disease_late_blight", nameUk: "Фітофтороз", nameEn: "Late blight" },
  { id: "kb_disease_powdery_mildew", nameUk: "Борошниста роса", nameEn: "Powdery mildew" },
  { id: "kb_disease_downy_mildew", nameUk: "Пероноспороз", nameEn: "Downy mildew" },
  { id: "kb_disease_root_rot", nameUk: "Коренева гниль", nameEn: "Root rot" },
  { id: "kb_disease_gray_mold", nameUk: "Сіра гниль", nameEn: "Gray mold" },
  { id: "kb_disease_rust", nameUk: "Іржа", nameEn: "Rust" },
]

const SPECIES_DISEASES: Record<string, string[]> = {
  kb_species_solanum_lycopersicum: [
    "kb_disease_late_blight",
    "kb_disease_powdery_mildew",
    "kb_disease_gray_mold",
  ],
  kb_species_capsicum_annuum: ["kb_disease_late_blight", "kb_disease_root_rot"],
  kb_species_cucumis_sativus: [
    "kb_disease_powdery_mildew",
    "kb_disease_downy_mildew",
    "kb_disease_root_rot",
  ],
  kb_species_raphanus_sativus: ["kb_disease_root_rot"],
  kb_species_ocimum_basilicum: ["kb_disease_downy_mildew", "kb_disease_root_rot"],
  kb_species_mentha_piperita: ["kb_disease_powdery_mildew", "kb_disease_root_rot"],
  kb_species_fragaria_ananassa: ["kb_disease_gray_mold", "kb_disease_powdery_mildew"],
  kb_species_solanum_tuberosum: ["kb_disease_late_blight", "kb_disease_root_rot"],
  kb_species_solanum_melongena: ["kb_disease_late_blight", "kb_disease_root_rot"],
  kb_species_cucurbita_pepo: ["kb_disease_powdery_mildew", "kb_disease_downy_mildew"],
  kb_species_cucurbita_maxima: ["kb_disease_powdery_mildew", "kb_disease_root_rot"],
  kb_species_brassica_oleracea_capitata: ["kb_disease_downy_mildew", "kb_disease_root_rot"],
  kb_species_brassica_oleracea_italica: ["kb_disease_downy_mildew", "kb_disease_root_rot"],
  kb_species_brassica_oleracea_botrytis: ["kb_disease_downy_mildew", "kb_disease_root_rot"],
  kb_species_brassica_oleracea_gongylodes: ["kb_disease_downy_mildew", "kb_disease_root_rot"],
  kb_species_daucus_carota: ["kb_disease_root_rot"],
  kb_species_petroselinum_crispum: ["kb_disease_root_rot", "kb_disease_downy_mildew"],
  kb_species_apium_graveolens: ["kb_disease_root_rot", "kb_disease_downy_mildew"],
  kb_species_allium_cepa: ["kb_disease_downy_mildew", "kb_disease_root_rot"],
  kb_species_allium_sativum: ["kb_disease_downy_mildew", "kb_disease_root_rot"],
  kb_species_allium_porrum: ["kb_disease_downy_mildew", "kb_disease_root_rot"],
  kb_species_lactuca_sativa: ["kb_disease_downy_mildew", "kb_disease_gray_mold"],
  kb_species_spinacia_oleracea: ["kb_disease_downy_mildew"],
  kb_species_pisum_sativum: ["kb_disease_powdery_mildew", "kb_disease_root_rot"],
  kb_species_phaseolus_vulgaris: ["kb_disease_powdery_mildew", "kb_disease_root_rot"],
  kb_species_beta_vulgaris: ["kb_disease_root_rot"],
  kb_species_zea_mays: ["kb_disease_root_rot"],
  kb_species_pastinaca_sativa: ["kb_disease_root_rot"],
  kb_species_anethum_graveolens: ["kb_disease_powdery_mildew"],
  kb_species_triticum_aestivum: ["kb_disease_rust", "kb_disease_powdery_mildew", "kb_disease_root_rot"],
  kb_species_triticum_durum: ["kb_disease_rust", "kb_disease_root_rot"],
  kb_species_triticum_spelta: ["kb_disease_rust", "kb_disease_powdery_mildew"],
  kb_species_secale_cereale: ["kb_disease_rust", "kb_disease_powdery_mildew"],
  kb_species_hordeum_vulgare: ["kb_disease_rust", "kb_disease_powdery_mildew", "kb_disease_root_rot"],
  kb_species_avena_sativa: ["kb_disease_rust", "kb_disease_powdery_mildew"],
  kb_species_oryza_sativa: ["kb_disease_root_rot", "kb_disease_downy_mildew"],
  kb_species_panicum_miliaceum: ["kb_disease_rust", "kb_disease_root_rot"],
  kb_species_sorghum_bicolor: ["kb_disease_rust", "kb_disease_root_rot"],
  kb_species_fagopyrum_esculentum: ["kb_disease_root_rot", "kb_disease_powdery_mildew"],
  kb_species_triticosecale: ["kb_disease_rust", "kb_disease_powdery_mildew"],
  kb_species_lens_culinaris: ["kb_disease_root_rot", "kb_disease_powdery_mildew"],
  kb_species_cicer_arietinum: ["kb_disease_root_rot", "kb_disease_gray_mold"],
  kb_species_glycine_max: ["kb_disease_rust", "kb_disease_root_rot"],
  kb_species_lupinus_albus: ["kb_disease_root_rot", "kb_disease_powdery_mildew"],
  kb_species_trifolium_pratense: ["kb_disease_root_rot", "kb_disease_powdery_mildew"],
  kb_species_medicago_sativa: ["kb_disease_root_rot", "kb_disease_powdery_mildew"],
  kb_species_vicia_faba: ["kb_disease_root_rot", "kb_disease_gray_mold"],
  kb_species_vicia_sativa: ["kb_disease_root_rot", "kb_disease_powdery_mildew"],
  kb_species_arachis_hypogaea: ["kb_disease_root_rot", "kb_disease_gray_mold"],
  kb_species_helianthus_annuus: ["kb_disease_rust", "kb_disease_gray_mold", "kb_disease_root_rot"],
  kb_species_brassica_napus: ["kb_disease_root_rot", "kb_disease_powdery_mildew", "kb_disease_downy_mildew"],
  kb_species_linum_usitatissimum: ["kb_disease_rust", "kb_disease_root_rot"],
  kb_species_sinapis_alba: ["kb_disease_root_rot", "kb_disease_powdery_mildew"],
  kb_species_brassica_juncea: ["kb_disease_root_rot", "kb_disease_powdery_mildew"],
  kb_species_camelina_sativa: ["kb_disease_root_rot", "kb_disease_downy_mildew"],
  kb_species_carthamus_tinctorius: ["kb_disease_rust", "kb_disease_root_rot"],
  kb_species_papaver_somniferum: ["kb_disease_gray_mold", "kb_disease_root_rot"],
  kb_species_rubus_idaeus: ["kb_disease_gray_mold", "kb_disease_powdery_mildew"],
  kb_species_rubus_fruticosus: ["kb_disease_gray_mold", "kb_disease_rust"],
  kb_species_ribes_nigrum: ["kb_disease_powdery_mildew", "kb_disease_rust"],
  kb_species_ribes_rubrum: ["kb_disease_powdery_mildew", "kb_disease_gray_mold"],
  kb_species_ribes_uva_crispa: ["kb_disease_powdery_mildew", "kb_disease_rust"],
  kb_species_vaccinium_corymbosum: ["kb_disease_gray_mold", "kb_disease_root_rot"],
  kb_species_hippophae_rhamnoides: ["kb_disease_root_rot", "kb_disease_rust"],
  kb_species_lonicera_caerulea: ["kb_disease_gray_mold", "kb_disease_powdery_mildew"],
  kb_species_aronia_melanocarpa: ["kb_disease_gray_mold", "kb_disease_rust"],
}

function junctionId(left: string, right: string) {
  return `${left}::${right}`
}

async function upsertKbChange(
  appendKbChange: (
    entity:
      | "species"
      | "cultivar"
      | "disease"
      | "classification_group"
      | "classification_value"
      | "species_classification"
      | "species_disease"
      | "care_profile",
    entityId: string,
    operation: "upsert" | "delete"
  ) => Promise<number>,
  entity: Parameters<typeof appendKbChange>[0],
  entityId: string
) {
  await appendKbChange(entity, entityId, "upsert")
}

async function seed() {
  const { db } = await import("./index")
  const { appendKbChange } = await import("./change-log")
  const {
    careProfile,
    classificationGroup,
    classificationValue,
    cultivar,
    disease,
    species,
    speciesClassification,
    speciesDisease,
  } = await import("./schema")
  const { getPlantProfile } = await import("@/features/kb/plant-profiles")

  for (const item of GROUPS) {
    const [existing] = await db
      .select()
      .from(classificationGroup)
      .where(eq(classificationGroup.id, item.id))
      .limit(1)
    if (!existing) {
      await db.insert(classificationGroup).values(item)
    } else {
      await db
        .update(classificationGroup)
        .set({
          nameUk: item.nameUk,
          nameEn: item.nameEn,
          type: item.type,
          updatedAt: new Date(),
        })
        .where(eq(classificationGroup.id, item.id))
    }
    await upsertKbChange(appendKbChange, "classification_group", item.id)
  }

  for (const item of VALUES) {
    const [existing] = await db
      .select()
      .from(classificationValue)
      .where(eq(classificationValue.id, item.id))
      .limit(1)
    if (!existing) {
      await db.insert(classificationValue).values(item)
    } else {
      await db
        .update(classificationValue)
        .set({
          groupId: item.groupId,
          nameUk: item.nameUk,
          nameEn: item.nameEn,
          updatedAt: new Date(),
        })
        .where(eq(classificationValue.id, item.id))
    }
    await upsertKbChange(appendKbChange, "classification_value", item.id)
  }

  for (const item of SPECIES) {
    const [existing] = await db
      .select()
      .from(species)
      .where(eq(species.id, item.id))
      .limit(1)

    if (!existing) {
      await db.insert(species).values(item)
    } else {
      await db
        .update(species)
        .set({
          scientificName: item.scientificName,
          commonNameUk: item.commonNameUk,
          commonNameEn: item.commonNameEn,
          updatedAt: new Date(),
        })
        .where(eq(species.id, item.id))
    }
    await upsertKbChange(appendKbChange, "species", item.id)
  }

  for (const [speciesId, valueIds] of Object.entries(SPECIES_CLASSIFICATIONS)) {
    const rows = await db
      .select()
      .from(speciesClassification)
      .where(eq(speciesClassification.speciesId, speciesId))
    const existingValues = new Set(rows.map((row) => row.classificationValueId))

    for (const classificationValueId of valueIds) {
      if (!existingValues.has(classificationValueId)) {
        await db.insert(speciesClassification).values({
          speciesId,
          classificationValueId,
        })
      }
      await upsertKbChange(
        appendKbChange,
        "species_classification",
        junctionId(speciesId, classificationValueId)
      )
    }
  }

  for (const item of CULTIVARS) {
    const [existing] = await db
      .select()
      .from(cultivar)
      .where(eq(cultivar.id, item.id))
      .limit(1)

    if (!existing) {
      await db.insert(cultivar).values(item)
    } else {
      await db
        .update(cultivar)
        .set({
          speciesId: item.speciesId,
          name: item.name,
          updatedAt: new Date(),
        })
        .where(eq(cultivar.id, item.id))
    }
    await upsertKbChange(appendKbChange, "cultivar", item.id)
  }

  for (const item of DISEASES) {
    const [existing] = await db
      .select()
      .from(disease)
      .where(eq(disease.id, item.id))
      .limit(1)
    if (!existing) {
      await db.insert(disease).values(item)
    } else {
      await db
        .update(disease)
        .set({
          nameUk: item.nameUk,
          nameEn: item.nameEn,
          updatedAt: new Date(),
        })
        .where(eq(disease.id, item.id))
    }
    await upsertKbChange(appendKbChange, "disease", item.id)
  }

  for (const [speciesId, diseaseIds] of Object.entries(SPECIES_DISEASES)) {
    for (const diseaseId of diseaseIds) {
      const rows = await db
        .select()
        .from(speciesDisease)
        .where(eq(speciesDisease.speciesId, speciesId))
      const hasPair = rows.some((row) => row.diseaseId === diseaseId)
      if (!hasPair) {
        await db.insert(speciesDisease).values({ speciesId, diseaseId })
      }
      await upsertKbChange(
        appendKbChange,
        "species_disease",
        junctionId(speciesId, diseaseId)
      )
    }
  }

  for (const item of SPECIES) {
    const profile = getPlantProfile(item.id)
    const careId = `kb_care_${item.id.replace(/^kb_species_/, "")}`
    const payload = {
      id: careId,
      speciesId: item.id,
      imageUrl: profile.imageUrl || null,
      growing: profile.growing,
      genetics: profile.genetics,
      usage: profile.usage,
      updatedAt: new Date(),
    }
    const [existing] = await db
      .select()
      .from(careProfile)
      .where(eq(careProfile.id, careId))
      .limit(1)
    if (!existing) {
      await db.insert(careProfile).values(payload)
    } else {
      await db.update(careProfile).set(payload).where(eq(careProfile.id, careId))
    }
    await upsertKbChange(appendKbChange, "care_profile", careId)
  }

  console.info(
    `KB seed complete: ${SPECIES.length} species, ${CULTIVARS.length} cultivars, ${DISEASES.length} diseases, ${GROUPS.length} classification groups, ${VALUES.length} values`
  )
  process.exit(0)
}

seed().catch((error) => {
  const cause = error instanceof Error ? error.cause : undefined
  const refused =
    (cause instanceof Error && "code" in cause && cause.code === "ECONNREFUSED") ||
    String(error).includes("ECONNREFUSED")

  if (refused) {
    console.error(`PostgreSQL не запущений. Виконайте:

  docker compose up -d postgres
  npm run db:migrate
  npm run db:seed
`)
  } else {
    console.error(error)
  }
  process.exit(1)
})
