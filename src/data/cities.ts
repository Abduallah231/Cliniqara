import { SelectionOption } from "@/models/selection";

const citiesByGovernorate: Record<
  string,
  SelectionOption[]
> = {
  alexandria: [
    { id: "alexandria", label: "Alexandria" },
    { id: "borg-el-arab", label: "Borg El Arab" },
  ],

  aswan: [
    { id: "aswan", label: "Aswan" },
    { id: "kom-ombo", label: "Kom Ombo" },
    { id: "edfu", label: "Edfu" },
    { id: "daraw", label: "Daraw" },
    { id: "nasr-el-nuba", label: "Nasr El Nuba" },
  ],

  asyut: [
    { id: "asyut", label: "Asyut" },
    { id: "dairut", label: "Dairut" },
    { id: "manfalut", label: "Manfalut" },
    { id: "el-qusiya", label: "El Qusiya" },
    { id: "abnoub", label: "Abnoub" },
    { id: "abu-tig", label: "Abu Tig" },
    { id: "el-badari", label: "El Badari" },
    { id: "sahel-selim", label: "Sahel Selim" },
    { id: "sedfa", label: "Sedfa" },
    { id: "el-fateh", label: "El Fath" },
  ],

  beheira: [
    { id: "damanhur", label: "Damanhur" },
    { id: "kafr-el-dawar", label: "Kafr El Dawar" },
    { id: "abu-hummus", label: "Abu Hummus" },
    { id: "abu-el-matamir", label: "Abu El Matamir" },
    { id: "delengat", label: "El Delengat" },
    { id: "itay-el-baroud", label: "Itay El Baroud" },
    { id: "kom-hamada", label: "Kom Hamada" },
    { id: "mahmoudiyah", label: "El Mahmoudiyah" },
    { id: "rashid", label: "Rashid" },
    { id: "shubrakhit", label: "Shubrakhit" },
    { id: "wadi-el-natroun", label: "Wadi El Natrun" },
    { id: "housh-issa", label: "Housh Issa" },
    { id: "edko", label: "Edko" },
    { id: "natrun", label: "Nubaria" },
  ],

  "beni-suef": [
    { id: "beni-suef", label: "Beni Suef" },
    { id: "al-wasta", label: "Al Wasta" },
    { id: "nasser", label: "Nasser" },
    { id: "ihnasia", label: "Ihnasia" },
    { id: "beba", label: "Beba" },
    { id: "samtasta", label: "Samtasta" },
    { id: "el-fashn", label: "El Fashn" },
  ],

  cairo: [
    { id: "cairo", label: "Cairo" },
  ],

  dakahlia: [
    { id: "mansoura", label: "Mansoura" },
    { id: "mit-ghamr", label: "Mit Ghamr" },
    { id: "talkha", label: "Talkha" },
    { id: "aga", label: "Aga" },
    { id: "belqas", label: "Belqas" },
    { id: "dikirnis", label: "Dikirnis" },
    { id: "el-senbellawein", label: "El Senbellawein" },
    { id: "manzala", label: "Manzala" },
    { id: "matareya", label: "El Matareya" },
    { id: "minyet-el-nasr", label: "Minyet El Nasr" },
    { id: "sharbin", label: "Sherbin" },
    { id: "tami-el-amdid", label: "Tami El Amdid" },
  ],

  damietta: [
    { id: "damietta", label: "Damietta" },
    { id: "new-damietta", label: "New Damietta" },
    { id: "faraskour", label: "Faraskour" },
    { id: "kafr-saad", label: "Kafr Saad" },
    { id: "kafr-el-bateekh", label: "Kafr El Bateekh" },
    { id: "zarqa", label: "El Zarqa" },
  ],

  faiyum: [
    { id: "faiyum", label: "Faiyum" },
    { id: "sinnuris", label: "Sinnuris" },
    { id: "ibshaway", label: "Ibshaway" },
    { id: "itsa", label: "Itsa" },
    { id: "tamiya", label: "Tamiya" },
    { id: "youssef-el-seddiq", label: "Youssef El Seddik" },
  ],

  gharbia: [
    { id: "tanta", label: "Tanta" },
    { id: "mahallet-kubra", label: "El Mahalla El Kubra" },
    { id: "kafr-el-zayat", label: "Kafr El Zayat" },
    { id: "zefta", label: "Zefta" },
    { id: "samannoud", label: "Samannoud" },
    { id: "basyoun", label: "Basyoun" },
    { id: "qutour", label: "Qutour" },
    { id: "santa", label: "El Santa" },
  ],

  giza: [
    { id: "giza", label: "Giza" },
    { id: "6th-of-october", label: "6th of October" },
    { id: "sheikh-zayed", label: "Sheikh Zayed" },
    { id: "al-hawamdeya", label: "Al Hawamdeya" },
    { id: "al-badrashin", label: "Al Badrashin" },
    { id: "atfih", label: "Atfih" },
    { id: "el-saff", label: "El Saff" },
    { id: "abou-el-nomros", label: "Abou El Nomros" },
    { id: "kirdasa", label: "Kerdasa" },
    { id: "embaba", label: "Imbaba" },
    { id: "awsim", label: "Awsim" },
    { id: "al-ayaat", label: "Al Ayat" },
    { id: "el-warraq", label: "El Warraq" },
  ],

  ismailia: [
    { id: "ismailia", label: "Ismailia" },
    { id: "fayed", label: "Fayed" },
    { id: "el-tall-el-kebir", label: "El Tall El Kebir" },
    { id: "abu-suweir", label: "Abu Suweir" },
    { id: "qantara-sharq", label: "Qantara Sharq" },
    { id: "qantara-gharb", label: "Qantara Gharb" },
    { id: "kasaseen", label: "Kasaseen" },
  ],

  "kafr-el-sheikh": [
    { id: "kafr-el-sheikh", label: "Kafr El Sheikh" },
    { id: "desouk", label: "Desouk" },
    { id: "fuwwah", label: "Fuwwah" },
    { id: "metoubes", label: "Metoubes" },
    { id: "hamoul", label: "Hamoul" },
    { id: "sidi-salem", label: "Sidi Salem" },
    { id: "qallin", label: "Qallin" },
    { id: "baltim", label: "Baltim" },
    { id: "borollos", label: "El Borollos" },
  ],

  luxor: [
    { id: "luxor", label: "Luxor" },
    { id: "esna", label: "Esna" },
    { id: "armant", label: "Armant" },
    { id: "el-tod", label: "El Tod" },
    { id: "el-qurna", label: "El Qurna" },
    { id: "al-bayadiya", label: "Al Bayadiya" },
    { id: "al-zineya", label: "Al Zineya" },
  ],

  matrouh: [
    { id: "marsa-matrouh", label: "Marsa Matrouh" },
    { id: "al-hammam", label: "Al Hammam" },
    { id: "alamein", label: "El Alamein" },
    { id: "dabaa", label: "El Dabaa" },
    { id: "sallum", label: "Sallum" },
    { id: "sidi-barrani", label: "Sidi Barrani" },
    { id: "siwa", label: "Siwa" },
    { id: "nagela", label: "El Nagela" },
  ],

  minya: [
    { id: "minya", label: "Minya" },
    { id: "abu-qurqas", label: "Abu Qurqas" },
    { id: "mallawi", label: "Mallawi" },
    { id: "maghagha", label: "Maghagha" },
    { id: "bani-mazar", label: "Bani Mazar" },
    { id: "samalut", label: "Samalut" },
    { id: "deir-mawas", label: "Deir Mawas" },
    { id: "matay", label: "Matay" },
    { id: "al-edwa", label: "Al Edwa" },
  ],

  monufia: [
    { id: "shebin-el-kom", label: "Shebin El Kom" },
    { id: "ashmoun", label: "Ashmoun" },
    { id: "menouf", label: "Menouf" },
    { id: "sadat-city", label: "Sadat City" },
    { id: "tala", label: "Tala" },
    { id: "berket-el-sabaa", label: "Berket El Sabaa" },
    { id: "quwaysna", label: "Quwaysna" },
    { id: "bagour", label: "Bagour" },
    { id: "shohada", label: "El Shohada" },
  ],

  "new-valley": [
    { id: "kharga", label: "Kharga" },
    { id: "dakhla", label: "Dakhla" },
    { id: "farafra", label: "Farafra" },
    { id: "baris", label: "Baris" },
    { id: "balat", label: "Balat" },
  ],

  "north-sinai": [
    { id: "arish", label: "Arish" },
    { id: "bir-el-abd", label: "Bir El Abd" },
    { id: "sheikh-zuweid", label: "Sheikh Zuweid" },
    { id: "rafah", label: "Rafah" },
    { id: "hasana", label: "Hasana" },
    { id: "nakhl", label: "Nakhl" },
  ],

  "port-said": [
    { id: "port-said", label: "Port Said" },
    { id: "port-fouad", label: "Port Fouad" },
  ],

  qalyubia: [
    { id: "banha", label: "Banha" },
    { id: "shubra-el-kheima", label: "Shubra El Kheima" },
    { id: "qalyub", label: "Qalyub" },
    { id: "khanka", label: "El Khanka" },
    { id: "kafr-shukr", label: "Kafr Shukr" },
    { id: "tukh", label: "Tukh" },
    { id: "shibin-el-qanater", label: "Shibin El Qanater" },
  ],

  qena: [
    { id: "qena", label: "Qena" },
    { id: "nag-hammadi", label: "Nag Hammadi" },
    { id: "qift", label: "Qift" },
    { id: "qus", label: "Qus" },
    { id: "dishna", label: "Dishna" },
    { id: "naqada", label: "Naqada" },
    { id: "abu-tesht", label: "Abu Tesht" },
    { id: "farshout", label: "Farshout" },
    { id: "el-waqf", label: "El Waqf" },
  ],

  "red-sea": [
    { id: "hurghada", label: "Hurghada" },
    { id: "safaga", label: "Safaga" },
    { id: "qusseir", label: "El Quseir" },
    { id: "marsa-alam", label: "Marsa Alam" },
    { id: "ras-ghareb", label: "Ras Ghareb" },
    { id: "shalateen", label: "Shalateen" },
    { id: "halayeb", label: "Halayeb" },
  ],

  sharqia: [
    { id: "zagazig", label: "Zagazig" },
    { id: "10th-of-ramadan", label: "10th of Ramadan" },
    { id: "belbeis", label: "Belbeis" },
    { id: "abu-kebir", label: "Abu Kebir" },
    { id: "abu-hammad", label: "Abu Hammad" },
    { id: "faqous", label: "Faqous" },
    { id: "hehia", label: "Hihya" },
    { id: "minya-el-qamh", label: "Minya El Qamh" },
    { id: "kafr-saqr", label: "Kafr Saqr" },
    { id: "el-ibrahimia", label: "El Ibrahimiya" },
    { id: "derb-negm", label: "Derb Negm" },
    { id: "el-husseiniya", label: "El Husseiniya" },
    { id: "el-qanayat", label: "El Qanayat" },
  ],

  sohag: [
    { id: "sohag", label: "Sohag" },
    { id: "akhmim", label: "Akhmim" },
    { id: "girga", label: "Girga" },
    { id: "tahta", label: "Tahta" },
    { id: "tama", label: "Tama" },
    { id: "maragha", label: "El Maragha" },
    { id: "juhayna", label: "Juhayna" },
    { id: "al-balyana", label: "Al Balyana" },
    { id: "el-mansha", label: "El Mansha" },
    { id: "dar-el-salam", label: "Dar El Salam" },
    { id: "saqultah", label: "Saqultah" },
  ],

  "south-sinai": [
    { id: "el-tor", label: "El Tor" },
    { id: "sharm-el-sheikh", label: "Sharm El Sheikh" },
    { id: "dahab", label: "Dahab" },
    { id: "nuweiba", label: "Nuweiba" },
    { id: "taba", label: "Taba" },
    { id: "saint-catherine", label: "Saint Catherine" },
    { id: "ras-sedr", label: "Ras Sedr" },
  ],

  suez: [
    { id: "suez", label: "Suez" },
    { id: "ain-sokhna", label: "Ain Sokhna" },
    { id: "ataqa", label: "Ataka" },
    { id: "ganayen", label: "Ganayen" },
    { id: "faisal", label: "Faisal" },
  ],
};

export default citiesByGovernorate;