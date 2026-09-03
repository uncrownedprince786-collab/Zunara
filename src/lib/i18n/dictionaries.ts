export type Locale = "en" | "ur" | "ar" | "es" | "zh";

export const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl"; htmlLang: string }[] = [
  { code: "en", label: "English", dir: "ltr", htmlLang: "en" },
  { code: "ur", label: "اردو", dir: "rtl", htmlLang: "ur" },
  { code: "ar", label: "العربية", dir: "rtl", htmlLang: "ar" },
  { code: "es", label: "Español", dir: "ltr", htmlLang: "es" },
  { code: "zh", label: "中文", dir: "ltr", htmlLang: "zh" },
];

export const LOCALE_COOKIE = "zunara-locale";

export const DEFAULT_LOCALE: Locale = "en";

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ur" || locale === "ar" ? "rtl" : "ltr";
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && LOCALES.some((l) => l.code === value);
}

export type Dict = typeof en;

export const en = {
  nav: {
    horoscopes: "Horoscopes",
    today: "Today",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    publication: "The publication",
    astronomy: "The astronomy",
    cosmicFacts: "Cosmic traits & facts",
    about: "About & method",
    privacy: "Privacy",
    terms: "Terms",
    disclaimer: "Disclaimer",
    home: "Home",
  },
  footer: {
    tagline:
      "An editorial astrology publication. Every position is calculated from real astronomical data; no myth, only the mathematics of the sky.",
    allSigns: "All signs",
    columnHoroscopes: "Horoscopes",
    columnPublication: "The publication",
    theTwelve: "The twelve signs",
    copyright: "Written in the stars. All astrological content is for entertainment and reflection, not professional advice.",
  },
  common: {
    readToday: "Read today's horoscope for your sign",
    pickSign: "Pick any of the twelve signs and start with a fresh reading. Your choice stays for this visit only.",
    browseSigns: "Browse the signs",
    yourDailyOrbit: "Your daily orbit",
    language: "Language",
  },
  home: {
    heroTitle: "Written in the stars.",
    heroSubtitle:
      "A premium editorial astrology publication. Daily, weekly, monthly and yearly horoscopes for all twelve signs — calculated from real astronomical data. No myths, just the mathematics of the sky.",
    heroCtaPrimary: "Read today's horoscope",
    heroCtaSecondary: "The astronomy",
    skyTonight: "The sky, tonight",
    yourHoroscope: "Your horoscope",
    fourHorizons: "Four horizons",
    ourMethod: "Our method",
  },
};

export const ur: Dict = {
  nav: {
    horoscopes: "زائچے",
    today: "آج",
    weekly: "ہفتہ وار",
    monthly: "ماہانہ",
    yearly: "سالانہ",
    publication: "رسالہ",
    astronomy: "فلکیات",
    cosmicFacts: "برجوں کی خصوصیات اور حقائق",
    about: "تعارف و طریقہ",
    privacy: "رازداری",
    terms: "شرائط",
    disclaimer: "اعلانِ دستبرداری",
    home: "ہوم",
  },
  footer: {
    tagline:
      "ایک ادبی نجومیات رسالہ۔ ہر مقام اصلی فلکیاتی اعداد سے شمار کیا جاتا ہے؛ نہ کوئی افسانہ، صرف آسمان کی ریاضی۔",
    allSigns: "تمام برج",
    columnHoroscopes: "زائچے",
    columnPublication: "رسالہ",
    theTwelve: "بارہ برج",
    copyright: "ستاروں میں لکھا ہوا۔ تمام نجومی مواد صرف تفریح اور غور و فکر کے لیے ہے، پیشہ ورانہ مشورہ نہیں۔",
  },
  common: {
    readToday: "اپنے برج کا آج کا زائچہ پڑھیں",
    pickSign: "بارہ برجوں میں سے کوئی ایک منتخب کریں اور نئے سرے سے پڑھائی شروع کریں۔ آپ کا انتخاب صرف اس دورے کے لیے رہے گا۔",
    browseSigns: "برج دیکھیں",
    yourDailyOrbit: "آپ کا روزانہ مدار",
    language: "زبان",
  },
  home: {
    heroTitle: "ستاروں میں لکھا ہوا۔",
    heroSubtitle:
      "ایک اعلیٰ ادبی نجومیات رسالہ۔ بارہوں برجوں کے روزانہ، ہفتہ وار، ماہانہ اور سالانہ زائچے — اصلی فلکیاتی اعداد سے شمار کیے گئے۔ نہ کوئی افسانہ، صرف آسمان کی ریاضی۔",
    heroCtaPrimary: "آج کا زائچہ پڑھیں",
    heroCtaSecondary: "فلکیات",
    skyTonight: "آج رات کا آسمان",
    yourHoroscope: "آپ کا زائچہ",
    fourHorizons: "چار افق",
    ourMethod: "ہمارا طریقہ",
  },
};

export const ar: Dict = {
  nav: {
    horoscopes: "الأبراج",
    today: "اليوم",
    weekly: "أسبوعي",
    monthly: "شهري",
    yearly: "سنوي",
    publication: "النشرة",
    astronomy: "علم الفلك",
    cosmicFacts: "سمات وحقائق الأبراج",
    about: "منهجنا",
    privacy: "الخصوصية",
    terms: "الشروط",
    disclaimer: "إخلاء المسؤولية",
    home: "الرئيسية",
  },
  footer: {
    tagline:
      "مجلة فلكية تحريرية. كل موضع يُحسب من بيانات فلكية حقيقية؛ لا أسطورة، فقط رياضيات السماء.",
    allSigns: "كل الأبراج",
    columnHoroscopes: "الأبراج",
    columnPublication: "النشرة",
    theTwelve: "الأبراج الاثنا عشر",
    copyright: "مكتوب في النجوم. كل المحتوى الفلكي للترفيه والتأمل وليس نصيحة مهنية.",
  },
  common: {
    readToday: "اقرأ برجك لليوم",
    pickSign: "اختر أيًا من الأبراج الاثني عشر وابدأ قراءة جديدة. يبقى اختيارك لهذه الزيارة فقط.",
    browseSigns: "تصفح الأبراج",
    yourDailyOrbit: "مدارك اليومي",
    language: "اللغة",
  },
  home: {
    heroTitle: "مكتوب في النجوم.",
    heroSubtitle:
      "مجلة فلكية تحريرية مميزة. أبراج يومية وأسبوعية وشهرية وسنوية للأبراج الاثني عشر — محسوبة من بيانات فلكية حقيقية. لا خرافات، فقط رياضيات السماء.",
    heroCtaPrimary: "اقرأ برجك لليوم",
    heroCtaSecondary: "علم الفلك",
    skyTonight: "السماء الليلة",
    yourHoroscope: "برجك",
    fourHorizons: "أربعة آفاق",
    ourMethod: "منهجنا",
  },
};

export const es: Dict = {
  nav: {
    horoscopes: "Horóscopos",
    today: "Hoy",
    weekly: "Semanal",
    monthly: "Mensual",
    yearly: "Anual",
    publication: "La publicación",
    astronomy: "La astronomía",
    cosmicFacts: "Rasgos y datos cósmicos",
    about: "Acerca y método",
    privacy: "Privacidad",
    terms: "Términos",
    disclaimer: "Aviso legal",
    home: "Inicio",
  },
  footer: {
    tagline:
      "Una publicación editorial de astrología. Cada posición se calcula con datos astronómicos reales; sin mito, solo las matemáticas del cielo.",
    allSigns: "Todos los signos",
    columnHoroscopes: "Horóscopos",
    columnPublication: "La publicación",
    theTwelve: "Los doce signos",
    copyright: "Escrito en las estrellas. Todo el contenido astrológico es para entretenimiento y reflexión, no consejo profesional.",
  },
  common: {
    readToday: "Lee el horóscopo de hoy de tu signo",
    pickSign: "Elige cualquiera de los doce signos y empieza una lectura nueva. Tu elección dura solo esta visita.",
    browseSigns: "Explorar los signos",
    yourDailyOrbit: "Tu órbita diaria",
    language: "Idioma",
  },
  home: {
    heroTitle: "Escrito en las estrellas.",
    heroSubtitle:
      "Una publicación editorial de astrología premium. Horóscopos diarios, semanales, mensuales y anuales para los doce signos — calculados con datos astronómicos reales. Sin mitos, solo las matemáticas del cielo.",
    heroCtaPrimary: "Lee el horóscopo de hoy",
    heroCtaSecondary: "La astronomía",
    skyTonight: "El cielo, esta noche",
    yourHoroscope: "Tu horóscopo",
    fourHorizons: "Cuatro horizontes",
    ourMethod: "Nuestro método",
  },
};

export const zh: Dict = {
  nav: {
    horoscopes: "星座运势",
    today: "今日",
    weekly: "周运",
    monthly: "月运",
    yearly: "年运",
    publication: "刊物",
    astronomy: "天文",
    cosmicFacts: "星座特质与资料",
    about: "关于与方法",
    privacy: "隐私",
    terms: "条款",
    disclaimer: "免责声明",
    home: "首页",
  },
  footer: {
    tagline:
      "一份编辑型占星刊物。每个位置都基于真实的天文数据计算；没有神话，只有天空的数学。",
    allSigns: "所有星座",
    columnHoroscopes: "星座运势",
    columnPublication: "刊物",
    theTwelve: "十二星座",
    copyright: "写在星辰之中。所有占星内容仅供娱乐与反思，并非专业建议。",
  },
  common: {
    readToday: "查看你星座的今日运势",
    pickSign: "从十二个星座中任选一个，开始全新的阅读。你的选择仅在本次访问中保留。",
    browseSigns: "浏览星座",
    yourDailyOrbit: "你的每日星轨",
    language: "语言",
  },
  home: {
    heroTitle: "写在星辰之中。",
    heroSubtitle:
      "一份高端编辑型占星刊物。为十二星座提供每日、每周、每月和每年的运势——基于真实的天文数据计算。没有神话，只有天空的数学。",
    heroCtaPrimary: "查看今日运势",
    heroCtaSecondary: "天文",
    skyTonight: "今夜星空",
    yourHoroscope: "你的运势",
    fourHorizons: "四个视野",
    ourMethod: "我们的方法",
  },
};

export const dictionaries: Record<Locale, Dict> = { en, ur, ar, es, zh };
