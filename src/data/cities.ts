import { SelectionOption } from "@/models/selection";

const citiesByGovernorate: Record<
  string,
  SelectionOption[]
> = {
  /*
   * ======================================================
   * CAIRO
   * 38 districts + new cities
   * ======================================================
   */
  cairo: [
    // Northern Area
    {
      id: "shubra",
      label: "Shubra",
    },
    {
      id: "el-zawia-el-hamra",
      label: "El Zawia El Hamra",
    },
    {
      id: "hadayek-el-kobba",
      label: "Hadayek El Kobba",
    },
    {
      id: "rod-el-farag",
      label: "Rod El Farag",
    },
    {
      id: "el-sharabia",
      label: "El Sharabia",
    },
    {
      id: "el-sahel",
      label: "El Sahel",
    },
    {
      id: "el-zaitoun",
      label: "El Zaitoun",
    },
    {
      id: "el-amirya",
      label: "El Amirya",
    },

    // Eastern Area
    {
      id: "heliopolis",
      label: "Masr El Gedida",
    },
    {
      id: "el-nozha",
      label: "El Nozha",
    },
    {
      id: "nasr-city-east",
      label: "Nasr City East",
    },
    {
      id: "nasr-city-west",
      label: "Nasr City West",
    },
    {
      id: "ain-shams",
      label: "Ain Shams",
    },
    {
      id: "el-salam-first",
      label: "El Salam First",
    },
    {
      id: "el-salam-second",
      label: "El Salam Second",
    },
    {
      id: "el-matariya",
      label: "El Matariya",
    },
    {
      id: "el-marg",
      label: "El Marg",
    },

    // Western Area
    {
      id: "manshiet-nasser",
      label: "Manshiet Nasser",
    },
    {
      id: "el-waily",
      label: "El Waily",
    },
    {
      id: "downtown",
      label: "Downtown",
    },
    {
      id: "bulaq",
      label: "Bulaq",
    },
    {
      id: "west-cairo",
      label: "West Cairo",
    },
    {
      id: "abdeen",
      label: "Abdeen",
    },
    {
      id: "azbakeya",
      label: "Azbakeya",
    },
    {
      id: "mousky",
      label: "Mousky",
    },
    {
      id: "bab-el-shaaria",
      label: "Bab El Shaaria",
    },

    // Southern Area
    {
      id: "old-cairo",
      label: "Old Cairo",
    },
    {
      id: "el-khalifa",
      label: "El Khalifa",
    },
    {
      id: "el-moqattam",
      label: "El Mokattam",
    },
    {
      id: "el-basatin",
      label: "El Basatin",
    },
    {
      id: "dar-el-salam",
      label: "Dar El Salam",
    },
    {
      id: "el-sayeda-zeinab",
      label: "El Sayeda Zeinab",
    },
    {
      id: "el-tebin",
      label: "El Tebin",
    },
    {
      id: "helwan",
      label: "Helwan",
    },
    {
      id: "el-maasara",
      label: "El Maasara",
    },
    {
      id: "el-maadi",
      label: "El Maadi",
    },
    {
      id: "torah",
      label: "Tora",
    },
    {
      id: "15th-of-may",
      label: "15th of May",
    },

    // New cities administered by Cairo
    {
      id: "new-cairo",
      label: "New Cairo",
    },
    {
      id: "el-shorouk",
      label: "El Shorouk",
    },
    {
      id: "badr",
      label: "Badr",
    },
  ],

  /*
   * ======================================================
   * ALEXANDRIA
   * 9 districts + Borg El Arab Center
   * ======================================================
   */
  alexandria: [
    {
      id: "montaza-first",
      label: "Montaza First",
    },
    {
      id: "montaza-second",
      label: "Montaza Second",
    },
    {
      id: "east",
      label: "East",
    },
    {
      id: "central",
      label: "Central",
    },
    {
      id: "west",
      label: "West",
    },
    {
      id: "gomrok",
      label: "Gomrok",
    },
    {
      id: "agamy",
      label: "Agamy",
    },
    {
      id: "amreya-first",
      label: "Amreya First",
    },
    {
      id: "amreya-second",
      label: "Amreya Second",
    },
    {
      id: "borg-el-arab",
      label: "Borg El Arab",
    },
  ],

  /*
   * ======================================================
   * GIZA
   * 9 Centers + 10 Districts
   * ======================================================
   */
  giza: [
    {
      id: "badrashin",
      label: "Badrashin",
    },
    {
      id: "el-saff",
      label: "El Saff",
    },
    {
      id: "atfih",
      label: "Atfih",
    },
    {
      id: "el-ayat",
      label: "El Ayat",
    },
    {
      id: "bahariya-oasis",
      label: "Bahariya Oasis",
    },
    {
      id: "manshaet-el-qanater",
      label: "Manshaet El Qanater",
    },
    {
      id: "oseem",
      label: "Oseem",
    },
    {
      id: "kerdasa",
      label: "Kerdasa",
    },
    {
      id: "abu-el-nomros",
      label: "Abu El Nomros",
    },

    {
      id: "imbaba",
      label: "Imbaba",
    },
    {
      id: "el-monira-el-gharbia",
      label: "El Monira El Gharbia",
    },
    {
      id: "south-giza",
      label: "South Giza",
    },
    {
      id: "agouza",
      label: "Agouza",
    },
    {
      id: "omrania",
      label: "Omrania",
    },
    {
      id: "el-haram",
      label: "El Haram",
    },
    {
      id: "talbia",
      label: "Talbia",
    },
    {
      id: "bulaq-el-dakrour",
      label: "Bulaq El Dakrour",
    },
    {
      id: "el-warraq",
      label: "El Warraq",
    },
    {
      id: "dokki",
      label: "Dokki",
    },
    {
      id: "sheikh-zayed",
      label: "Sheikh Zayed",
    },
    {
      id: "6th-of-october",
      label: "6th of October",
    },
  ],

  /*
   * ======================================================
   * QALYUBIA
   * 7 Centers + Shubra El Kheima East/West
   * + other independently administered urban areas
   * ======================================================
   */
  qalyubia: [
    {
      id: "banha",
      label: "Banha",
    },
    {
      id: "qalyub",
      label: "Qalyub",
    },
    {
      id: "qanater-el-khayreya",
      label: "Qanater El Khayreya",
    },
    {
      id: "el-khanka",
      label: "El Khanka",
    },
    {
      id: "kafr-shukr",
      label: "Kafr Shukr",
    },
    {
      id: "tukh",
      label: "Tukh",
    },
    {
      id: "shibin-el-qanater",
      label: "Shibin El Qanater",
    },
    {
      id: "shubra-el-kheima-east",
      label: "Shubra El Kheima East",
    },
    {
      id: "shubra-el-kheima-west",
      label: "Shubra El Kheima West",
    },
    {
      id: "el-obour",
      label: "El Obour",
    },
  ],

  /*
   * ======================================================
   * BEHEIRA - 15 Centers
   * ======================================================
   */
  beheira: [
    {
      id: "damanhur",
      label: "Damanhur",
    },
    {
      id: "kafr-el-dawar",
      label: "Kafr El Dawar",
    },
    {
      id: "rashid",
      label: "Rashid",
    },
    {
      id: "edku",
      label: "Edku",
    },
    {
      id: "abu-el-matamir",
      label: "Abu El Matamir",
    },
    {
      id: "abu-hummus",
      label: "Abu Hummus",
    },
    {
      id: "el-delengat",
      label: "El Delengat",
    },
    {
      id: "el-mahmoudiyah",
      label: "El Mahmoudiyah",
    },
    {
      id: "el-rahmaniya",
      label: "El Rahmaniya",
    },
    {
      id: "itay-el-baroud",
      label: "Itay El Baroud",
    },
    {
      id: "hosh-issa",
      label: "Hosh Issa",
    },
    {
      id: "shubrakhit",
      label: "Shubrakhit",
    },
    {
      id: "kom-hamada",
      label: "Kom Hamada",
    },
    {
      id: "badr",
      label: "Badr",
    },
    {
      id: "wadi-el-natroun",
      label: "Wadi El Natrun",
    },
  ],

  /*
   * ======================================================
   * DAKAHLIA - 17 Centers
   * ======================================================
   */
  dakahlia: [
    {
      id: "mansoura",
      label: "Mansoura",
    },
    {
      id: "talkha",
      label: "Talkha",
    },
    {
      id: "mit-ghamr",
      label: "Mit Ghamr",
    },
    {
      id: "dikirnis",
      label: "Dikirnis",
    },
    {
      id: "aga",
      label: "Aga",
    },
    {
      id: "minyet-el-nasr",
      label: "Minyet El Nasr",
    },
    {
      id: "sinbellawein",
      label: "Sinbellawein",
    },
    {
      id: "beni-ebeid",
      label: "Beni Ebeid",
    },
    {
      id: "manzala",
      label: "Manzala",
    },
    {
      id: "temay-el-amdid",
      label: "Temay El Amdid",
    },
    {
      id: "el-gamaliya",
      label: "El Gamaliya",
    },
    {
      id: "sherbin",
      label: "Sherbin",
    },
    {
      id: "el-matareya",
      label: "El Matareya",
    },
    {
      id: "belqas",
      label: "Belqas",
    },
    {
      id: "mit-salsil",
      label: "Mit Salsil",
    },
    {
      id: "mahalla-damnah",
      label: "Mahalla Damanah",
    },
    {
      id: "nabrouh",
      label: "Nabrouh",
    },
  ],

  /*
   * ======================================================
   * DAMIETTA - 5 Centers
   * ======================================================
   */
  damietta: [
    {
      id: "damietta",
      label: "Damietta",
    },
    {
      id: "faraskour",
      label: "Faraskour",
    },
    {
      id: "kafr-saad",
      label: "Kafr Saad",
    },
    {
      id: "el-zarqa",
      label: "El Zarqa",
    },
    {
      id: "kafr-el-bateekh",
      label: "Kafr El Bateekh",
    },
  ],

  /*
   * ======================================================
   * KAFR EL SHEIKH - 10 Centers
   * ======================================================
   */
  "kafr-el-sheikh": [
    {
      id: "kafr-el-sheikh",
      label: "Kafr El Sheikh",
    },
    {
      id: "desouk",
      label: "Desouk",
    },
    {
      id: "fuwwah",
      label: "Fuwwah",
    },
    {
      id: "metoubes",
      label: "Metoubes",
    },
    {
      id: "burullus",
      label: "Burullus",
    },
    {
      id: "el-hamoul",
      label: "El Hamoul",
    },
    {
      id: "beyala",
      label: "Beyala",
    },
    {
      id: "el-reyad",
      label: "El Reyad",
    },
    {
      id: "sidi-salem",
      label: "Sidi Salem",
    },
    {
      id: "qallin",
      label: "Qallin",
    },
  ],

  /*
   * ======================================================
   * GHARBIA - 8 Centers
   * ======================================================
   */
  gharbia: [
    {
      id: "tanta",
      label: "Tanta",
    },
    {
      id: "el-mahalla-el-kubra",
      label: "El Mahalla El Kubra",
    },
    {
      id: "kafr-el-zayat",
      label: "Kafr El Zayat",
    },
    {
      id: "zefta",
      label: "Zefta",
    },
    {
      id: "el-santa",
      label: "El Santa",
    },
    {
      id: "qutour",
      label: "Qutour",
    },
    {
      id: "basyoun",
      label: "Basyoun",
    },
    {
      id: "samannoud",
      label: "Samannoud",
    },
  ],

  /*
   * ======================================================
   * MONUFIA - 9 Centers
   * ======================================================
   */
  monufia: [
    {
      id: "shebin-el-kom",
      label: "Shebin El Kom",
    },
    {
      id: "sadat",
      label: "Sadat",
    },
    {
      id: "menouf",
      label: "Menouf",
    },
    {
      id: "ashmoun",
      label: "Ashmoun",
    },
    {
      id: "bagour",
      label: "Bagour",
    },
    {
      id: "quwaysna",
      label: "Quwaysna",
    },
    {
      id: "berket-el-sabaa",
      label: "Berket El Sabaa",
    },
    {
      id: "tala",
      label: "Tala",
    },
    {
      id: "el-shohada",
      label: "El Shohada",
    },
  ],

  /*
   * ======================================================
   * SHARQIA - 13 Centers + 2 Districts
   * ======================================================
   */
  sharqia: [
    {
      id: "zagazig",
      label: "Zagazig",
    },
    {
      id: "minya-el-qamh",
      label: "Minya El Qamh",
    },
    {
      id: "belbeis",
      label: "Belbeis",
    },
    {
      id: "mashtoul-el-souq",
      label: "Mashtoul El Souq",
    },
    {
      id: "abu-hammad",
      label: "Abu Hammad",
    },
    {
      id: "hihya",
      label: "Hihya",
    },
    {
      id: "abu-kebir",
      label: "Abu Kebir",
    },
    {
      id: "faqous",
      label: "Faqous",
    },
    {
      id: "ibrahimia",
      label: "Ibrahimia",
    },
    {
      id: "diarb-negm",
      label: "Diarb Negm",
    },
    {
      id: "kafr-saqr",
      label: "Kafr Saqr",
    },
    {
      id: "awlad-saqr",
      label: "Awlad Saqr",
    },
    {
      id: "el-husseiniya",
      label: "El Husseiniya",
    },
    {
      id: "zagazig-first",
      label: "Zagazig First",
    },
    {
      id: "zagazig-second",
      label: "Zagazig Second",
    },
  ],

  /*
   * ======================================================
   * ISMAILIA - 7 Centers
   * ======================================================
   */
  ismailia: [
    {
      id: "ismailia",
      label: "Ismailia",
    },
    {
      id: "fayed",
      label: "Fayed",
    },
    {
      id: "qantara-east",
      label: "Qantara East",
    },
    {
      id: "qantara-west",
      label: "Qantara West",
    },
    {
      id: "tell-el-kebir",
      label: "Tell El Kebir",
    },
    {
      id: "abu-suweir",
      label: "Abu Suweir",
    },
    {
      id: "qassasin",
      label: "Qassasin",
    },
  ],

  /*
   * ======================================================
   * NORTH SINAI - 6 Centers
   * ======================================================
   */
  "north-sinai": [
    {
      id: "arish",
      label: "Arish",
    },
    {
      id: "sheikh-zuweid",
      label: "Sheikh Zuweid",
    },
    {
      id: "rafah",
      label: "Rafah",
    },
    {
      id: "bir-el-abd",
      label: "Bir El Abd",
    },
    {
      id: "el-hassana",
      label: "El Hassana",
    },
    {
      id: "nakhl",
      label: "Nakhl",
    },
  ],

  /*
   * ======================================================
   * BENI SUEF - 7 Centers
   * ======================================================
   */
  "beni-suef": [
    {
      id: "beni-suef",
      label: "Beni Suef",
    },
    {
      id: "el-wasta",
      label: "El Wasta",
    },
    {
      id: "nasser",
      label: "Nasser",
    },
    {
      id: "ihnasia",
      label: "Ihnasia",
    },
    {
      id: "beba",
      label: "Beba",
    },
    {
      id: "samtasta",
      label: "Samtasta",
    },
    {
      id: "el-fashn",
      label: "El Fashn",
    },
  ],

  /*
   * ======================================================
   * FAIYUM - 6 Centers
   * ======================================================
   */
  faiyum: [
    {
      id: "faiyum",
      label: "Faiyum",
    },
    {
      id: "tamiya",
      label: "Tamiya",
    },
    {
      id: "sinnuris",
      label: "Sinnuris",
    },
    {
      id: "itsa",
      label: "Itsa",
    },
    {
      id: "ibshaway",
      label: "Ibshaway",
    },
    {
      id: "youssef-el-seddik",
      label: "Youssef El Seddik",
    },
  ],

  /*
   * ======================================================
   * MINYA - 9 Centers
   * ======================================================
   */
  minya: [
    {
      id: "minya",
      label: "Minya",
    },
    {
      id: "el-adwa",
      label: "El Adwa",
    },
    {
      id: "maghagha",
      label: "Maghagha",
    },
    {
      id: "beni-mazar",
      label: "Beni Mazar",
    },
    {
      id: "matay",
      label: "Matay",
    },
    {
      id: "samalut",
      label: "Samalut",
    },
    {
      id: "abu-qurqas",
      label: "Abu Qurqas",
    },
    {
      id: "mallawi",
      label: "Mallawi",
    },
    {
      id: "deir-mawas",
      label: "Deir Mawas",
    },
  ],

  /*
   * ======================================================
   * ASYUT - 11 Centers
   * ======================================================
   */
  asyut: [
    {
      id: "asyut",
      label: "Asyut",
    },
    {
      id: "dairut",
      label: "Dairut",
    },
    {
      id: "manfalut",
      label: "Manfalut",
    },
    {
      id: "el-qusiya",
      label: "El Qusiya",
    },
    {
      id: "abnoub",
      label: "Abnoub",
    },
    {
      id: "abu-tig",
      label: "Abu Tig",
    },
    {
      id: "ghanayem",
      label: "El Ghanayem",
    },
    {
      id: "sahel-selim",
      label: "Sahel Selim",
    },
    {
      id: "el-badari",
      label: "El Badari",
    },
    {
      id: "sedfa",
      label: "Sedfa",
    },
    {
      id: "el-fateh",
      label: "El Fath",
    },
  ],

  /*
   * ======================================================
   * NEW VALLEY - 5 Centers
   * ======================================================
   */
  "new-valley": [
    {
      id: "kharga",
      label: "Kharga",
    },
    {
      id: "paris",
      label: "Paris",
    },
    {
      id: "dakhla",
      label: "Dakhla",
    },
    {
      id: "farafra",
      label: "Farafra",
    },
    {
      id: "balat",
      label: "Balat",
    },
  ],

  /*
   * ======================================================
   * SOHAG - 12 Centers
   * ======================================================
   */
  sohag: [
    {
      id: "sohag",
      label: "Sohag",
    },
    {
      id: "akhmim",
      label: "Akhmim",
    },
    {
      id: "balyana",
      label: "Balyana",
    },
    {
      id: "el-maragha",
      label: "El Maragha",
    },
    {
      id: "el-mansha",
      label: "El Mansha",
    },
    {
      id: "dar-el-salam",
      label: "Dar El Salam",
    },
    {
      id: "girga",
      label: "Girga",
    },
    {
      id: "juhayna",
      label: "Juhayna",
    },
    {
      id: "saqultah",
      label: "Saqultah",
    },
    {
      id: "tama",
      label: "Tama",
    },
    {
      id: "tahta",
      label: "Tahta",
    },
    {
      id: "el-asirat",
      label: "El Asirat",
    },
  ],

  /*
   * ======================================================
   * QENA - 9 Centers
   * ======================================================
   */
  qena: [
    {
      id: "qena",
      label: "Qena",
    },
    {
      id: "abu-tesht",
      label: "Abu Tesht",
    },
    {
      id: "nag-hammadi",
      label: "Nag Hammadi",
    },
    {
      id: "dishna",
      label: "Dishna",
    },
    {
      id: "el-waqf",
      label: "El Waqf",
    },
    {
      id: "qift",
      label: "Qift",
    },
    {
      id: "naqada",
      label: "Naqada",
    },
    {
      id: "qus",
      label: "Qus",
    },
    {
      id: "farshout",
      label: "Farshout",
    },
  ],

  /*
   * ======================================================
   * LUXOR - 7 Centers
   * ======================================================
   */
  luxor: [
    {
      id: "luxor",
      label: "Luxor",
    },
    {
      id: "el-bayadiya",
      label: "El Bayadiya",
    },
    {
      id: "el-tod",
      label: "El Tod",
    },
    {
      id: "el-qurna",
      label: "El Qurna",
    },
    {
      id: "armant",
      label: "Armant",
    },
    {
      id: "esna",
      label: "Esna",
    },
    {
      id: "el-zinia",
      label: "El Zinia",
    },
  ],

  /*
   * ======================================================
   * ASWAN - 5 Centers
   * ======================================================
   */
  aswan: [
    {
      id: "aswan",
      label: "Aswan",
    },
    {
      id: "daraw",
      label: "Daraw",
    },
    {
      id: "kom-ombo",
      label: "Kom Ombo",
    },
    {
      id: "nasr-el-nuba",
      label: "Nasr El Nuba",
    },
    {
      id: "edfu",
      label: "Edfu",
    },
  ],

  /*
   * ======================================================
   * MATROUH - 8 Centers
   * ======================================================
   */
  matrouh: [
    {
      id: "marsa-matrouh",
      label: "Marsa Matrouh",
    },
    {
      id: "el-hammam",
      label: "El Hammam",
    },
    {
      id: "el-alamein",
      label: "El Alamein",
    },
    {
      id: "el-dabaa",
      label: "El Dabaa",
    },
    {
      id: "el-nagila",
      label: "El Nagila",
    },
    {
      id: "sidi-barrani",
      label: "Sidi Barrani",
    },
    {
      id: "sallum",
      label: "Sallum",
    },
    {
      id: "siwa",
      label: "Siwa",
    },
  ],

  /*
   * ======================================================
   * PORT SAID - Urban districts
   * ======================================================
   */
  "port-said": [
    {
      id: "el-sharq",
      label: "El Sharq",
    },
    {
      id: "el-arab",
      label: "El Arab",
    },
    {
      id: "el-manakh",
      label: "El Manakh",
    },
    {
      id: "el-dawahy",
      label: "El Dawahy",
    },
    {
      id: "el-zohour",
      label: "El Zohour",
    },
    {
      id: "el-janoub",
      label: "El Janoub",
    },
    {
      id: "el-gharb",
      label: "El Gharb",
    },
    {
      id: "port-fouad",
      label: "Port Fouad",
    },
  ],

  /*
   * ======================================================
   * SUEZ - 5 Districts
   * ======================================================
   */
  suez: [
    {
      id: "suez-district",
      label: "Suez",
    },
    {
      id: "arbaeen",
      label: "El Arbaeen",
    },
    {
      id: "faisal",
      label: "Faisal",
    },
    {
      id: "ataqa",
      label: "Ataka",
    },
    {
      id: "ganayen",
      label: "El Ganayen",
    },
  ],

  /*
   * ======================================================
   * SOUTH SINAI
   * Official local administrative cities
   * ======================================================
   */
  "south-sinai": [
    {
      id: "el-tor",
      label: "El Tor",
    },
    {
      id: "sharm-el-sheikh",
      label: "Sharm El Sheikh",
    },
    {
      id: "dahab",
      label: "Dahab",
    },
    {
      id: "nuweiba",
      label: "Nuweiba",
    },
    {
      id: "taba",
      label: "Taba",
    },
    {
      id: "ras-sedr",
      label: "Ras Sedr",
    },
    {
      id: "abu-rudeis",
      label: "Abu Rudeis",
    },
    {
      id: "abu-zenima",
      label: "Abu Zenima",
    },
    {
      id: "saint-catherine",
      label: "Saint Catherine",
    },
  ],

  /*
   * ======================================================
   * RED SEA
   * Official local administrative cities
   * ======================================================
   */
  "red-sea": [
    {
      id: "hurghada",
      label: "Hurghada",
    },
    {
      id: "ras-ghareb",
      label: "Ras Ghareb",
    },
    {
      id: "safaga",
      label: "Safaga",
    },
    {
      id: "el-quseir",
      label: "El Quseir",
    },
    {
      id: "marsa-alam",
      label: "Marsa Alam",
    },
    {
      id: "shalateen",
      label: "Shalateen",
    },
    {
      id: "halayeb",
      label: "Halayeb",
    },
  ],
};

export default citiesByGovernorate;