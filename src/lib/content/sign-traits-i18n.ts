import type { Locale } from "@/lib/i18n/client";

/**
 * Localized zodiac-sign traits. The English source is `ZodiacSign.traits` in
 * `zodiac.ts`; this map holds the same list translated per locale so the trait
 * pills render in the active language instead of leaking English on non-English
 * pages. Values are " · "-joined; a missing locale falls back to English, so an
 * incomplete map degrades gracefully (never breaks the build).
 *
 * es/zh/hi/ar/ur are a best-effort translation reusing standard personality
 * vocabulary — safe for launch, open to native-speaker refinement.
 */
const SIGN_TRAITS: Record<string, Partial<Record<Locale, string>>> = {
  aries: {
    en: "Courageous · Determined · Confident · Enthusiastic · Optimistic · Honest · Passionate",
    es: "Valiente · Decidido · Seguro · Entusiasta · Optimista · Honesto · Apasionado",
    zh: "勇敢 · 果断 · 自信 · 热情 · 乐观 · 诚实 · 热忱",
    hi: "साहसी · दृढ़निश्चयी · आत्मविश्वासी · उत्साही · आशावादी · ईमानदार · भावुक",
    ar: "شجاع · عازم · واثق · متحمس · متفائل · صادق · شغوف",
    ur: "بہادر · پُرعزم · پُراعتماد · پُرجوش · پُرامید · ایماندار · پُرشوق",
  },
  taurus: {
    en: "Reliable · Patient · Practical · Devoted · Responsible · Stable · Determined",
    es: "Fiable · Paciente · Práctico · Devoto · Responsable · Estable · Decidido",
    zh: "可靠 · 耐心 · 务实 · 忠诚 · 负责 · 稳定 · 果断",
    hi: "विश्वसनीय · धैर्यवान · व्यावहारिक · समर्पित · ज़िम्मेदार · स्थिर · दृढ़निश्चयी",
    ar: "موثوق · صبور · عملي · مخلص · مسؤول · مستقر · عازم",
    ur: "قابلِ اعتماد · صابر · عملی · وفا شعار · ذمہ دار · مستحکم · پُرعزم",
  },
  gemini: {
    en: "Curious · Adaptable · Communicative · Intellectual · Witty · Youthful · Versatile",
    es: "Curioso · Adaptable · Comunicativo · Intelectual · Ingenioso · Juvenil · Versátil",
    zh: "好奇 · 适应力强 · 善于沟通 · 睿智 · 机智 · 年轻 · 多才多艺",
    hi: "जिज्ञासु · अनुकूलनीय · संवादशील · बौद्धिक · हाज़िरजवाब · युवा · बहुमुखी",
    ar: "فضولي · متكيّف · تواصلي · مثقّف · سريع البديهة · شبابي · متعدد المواهب",
    ur: "متجسس · ہم آہنگ · اظہار پسند · فکری · حاضر جواب · نوجوان · ہمہ جہت",
  },
  cancer: {
    en: "Nurturing · Sensitive · Intuitive · Tenacious · Imaginative · Protective · Emotional",
    es: "Afectuoso · Sensible · Intuitivo · Tenaz · Imaginativo · Protector · Emotivo",
    zh: "呵护 · 敏感 · 直觉 · 坚韧 · 富有想象力 · 保护 · 感性",
    hi: "पोषक · संवेदनशील · सहज-बोध · दृढ़ · कल्पनाशील · रक्षक · भावुक",
    ar: "راعٍ · حسّاس · حدسي · مثابر · خيالي · حامٍ · عاطفي",
    ur: "پرورش کرنے والا · حساس · وجدانی · ثابت قدم · تخیلاتی · محافظ · جذباتی",
  },
  leo: {
    en: "Confident · Creative · Generous · Charismatic · Warm · Dramatic · Loyal",
    es: "Seguro · Creativo · Generoso · Carismático · Cálido · Dramático · Leal",
    zh: "自信 · 创造力 · 慷慨 · 有魅力 · 温暖 · 戏剧化 · 忠诚",
    hi: "आत्मविश्वासी · रचनात्मक · उदार · करिश्माई · गर्मजोश · नाटकीय · वफादार",
    ar: "واثق · مبدع · كريم · جذّاب · دافئ · درامي · وفيّ",
    ur: "پُراعتماد · تخلیقی · سخی · پُرکشش · گرمجوش · ڈرامائی · وفادار",
  },
  virgo: {
    en: "Analytical · Practical · Meticulous · Reliable · Modest · Helpful · Precise",
    es: "Analítico · Práctico · Meticuloso · Fiable · Modesto · Servicial · Preciso",
    zh: "善于分析 · 务实 · 细致 · 可靠 · 谦逊 · 乐于助人 · 精确",
    hi: "विश्लेषणात्मक · व्यावहारिक · सूक्ष्म · विश्वसनीय · विनम्र · सहायक · सटीक",
    ar: "تحليلي · عملي · دقيق · موثوق · متواضع · متعاون · مضبوط",
    ur: "تجزیاتی · عملی · باریک بین · قابلِ اعتماد · منکسر · مددگار · درست",
  },
  libra: {
    en: "Diplomatic · Fair · Charming · Social · Artistic · Balanced · Graceful",
    es: "Diplomático · Justo · Encantador · Sociable · Artístico · Equilibrado · Elegante",
    zh: "圆融 · 公正 · 迷人 · 善交际 · 艺术 · 平衡 · 优雅",
    hi: "कूटनीतिक · निष्पक्ष · आकर्षक · मिलनसार · कलात्मक · संतुलित · सुशोभित",
    ar: "دبلوماسي · عادل · ساحر · اجتماعي · فنّي · متوازن · رشيق",
    ur: "سفارتی · منصف · دلکش · ملنسار · فنکارانہ · متوازن · باوقار",
  },
  scorpio: {
    en: "Intense · Perceptive · Resourceful · Brave · Passionate · Magnetic · Invested",
    es: "Intenso · Perceptivo · Ingenioso · Valiente · Apasionado · Magnético · Comprometido",
    zh: "强烈 · 敏锐 · 足智多谋 · 勇敢 · 热忱 · 有吸引力 · 投入",
    hi: "तीव्र · गहरी समझ वाला · साधन-संपन्न · बहादुर · भावुक · चुंबकीय · प्रतिबद्ध",
    ar: "كثيف · فطن · واسع الحيلة · شجاع · شغوف · جذّاب · ملتزم",
    ur: "شدید · باشعور · تدبیر والا · نڈر · پُرشوق · مقناطیسی · لگن والا",
  },
  sagittarius: {
    en: "Adventurous · Optimistic · Philosophical · Independent · Honest · Expansive · Fun-loving",
    es: "Aventurero · Optimista · Filosófico · Independiente · Honesto · Expansivo · Divertido",
    zh: "爱冒险 · 乐观 · 富有哲思 · 独立 · 诚实 · 开阔 · 爱玩乐",
    hi: "साहसिक · आशावादी · दार्शनिक · स्वतंत्र · ईमानदार · विस्तृत · मौज-मस्ती पसंद",
    ar: "مغامر · متفائل · فلسفي · مستقل · صادق · منفتح · مرح",
    ur: "مہم جو · پُرامید · فلسفیانہ · خودمختار · ایماندار · وسیع · خوش مزاج",
  },
  capricorn: {
    en: "Ambitious · Disciplined · Practical · Responsible · Patient · Strategic · Dependable",
    es: "Ambicioso · Disciplinado · Práctico · Responsable · Paciente · Estratégico · Confiable",
    zh: "有抱负 · 自律 · 务实 · 负责 · 耐心 · 有策略 · 可信赖",
    hi: "महत्वाकांक्षी · अनुशासित · व्यावहारिक · ज़िम्मेदार · धैर्यवान · रणनीतिक · भरोसेमंद",
    ar: "طموح · منضبط · عملي · مسؤول · صبور · استراتيجي · يُعتمد عليه",
    ur: "بلند حوصلہ · نظم و ضبط والا · عملی · ذمہ دار · صابر · حکمتِ عملی والا · بھروسے مند",
  },
  aquarius: {
    en: "Independent · Inventive · Humanitarian · Original · Progressive · Detached · Intellectual",
    es: "Independiente · Inventivo · Humanitario · Original · Progresista · Desapegado · Intelectual",
    zh: "独立 · 善于创新 · 人道 · 独创 · 进步 · 超然 · 睿智",
    hi: "स्वतंत्र · आविष्कारी · मानवतावादी · मौलिक · प्रगतिशील · निर्लिप्त · बौद्धिक",
    ar: "مستقل · مبتكر · إنساني · أصيل · تقدّمي · منفصل · مثقّف",
    ur: "خودمختار · موجد · انسان دوست · اصلی · ترقی پسند · لاتعلق · فکری",
  },
  pisces: {
    en: "Compassionate · Artistic · Intuitive · Gentle · Selfless · Wise · Imaginative",
    es: "Compasivo · Artístico · Intuitivo · Amable · Altruista · Sabio · Imaginativo",
    zh: "富有同情心 · 艺术 · 直觉 · 温和 · 无私 · 智慧 · 富有想象力",
    hi: "करुणामय · कलात्मक · सहज-बोध · सौम्य · निःस्वार्थ · बुद्धिमान · कल्पनाशील",
    ar: "رحيم · فنّي · حدسي · لطيف · إيثاري · حكيم · خيالي",
    ur: "ہمدرد · فنکارانہ · وجدانی · نرم مزاج · بے غرض · دانا · تخیلاتی",
  },
};

/** Localized trait list for a sign; falls back to English for any gap. */
export function signTraits(slug: string, locale: Locale): string[] {
  const m = SIGN_TRAITS[slug];
  const value = (m && (m[locale] ?? m.en)) ?? "";
  return value.split(" · ").filter(Boolean);
}

/**
 * Localized sign descriptions (the paragraph shown on the sign profile). English
 * source is `ZodiacSign.description` in `zodiac.ts`; a missing locale falls back
 * to English so the map degrades gracefully. es/zh/hi/ar/ur are a best-effort
 * translation, open to native-speaker refinement.
 */
const SIGN_DESCRIPTIONS: Record<string, Partial<Record<Locale, string>>> = {
  aries: {
    en: "Aries, the first sign of the zodiac, is ruled by Mars and embodies the spark of beginnings. Cardinal fire, it initiates with courage and a pioneering spirit. Those under Aries are natural leaders who move with directness, energy, and an unflinching willingness to start anew.",
    es: "Aries, el primer signo del zodiaco, está regido por Marte y encarna la chispa de los comienzos. Fuego cardinal, inicia con valentía y espíritu pionero. Los aries son líderes naturales que se mueven con franqueza, energía y una disposición inquebrantable a empezar de nuevo.",
    zh: "白羊座是黄道十二宫的第一个星座，由火星守护，象征着开端的火花。作为基本宫的火象星座，它以勇气与开拓精神开启一切。白羊座的人天生是领导者，行事直接、充满活力，怀着重新出发的坚定意愿。",
    hi: "मेष, राशिचक्र का पहला चिह्न, मंगल द्वारा शासित है और नई शुरुआत की चिंगारी का प्रतीक है। यह चर अग्नि राशि साहस और अग्रणी भावना के साथ पहल करती है। मेष राशि के लोग स्वाभाविक नेता होते हैं जो सीधेपन, ऊर्जा और फिर से आरंभ करने की अटूट इच्छा के साथ आगे बढ़ते हैं।",
    ar: "الحمل، أول أبراج دائرة البروج، يحكمه المريخ ويجسّد شرارة البدايات. برج ناري منقلب، يبدأ بشجاعة وروح ريادية. مواليد الحمل قادة بالفطرة يتحركون بصراحة وطاقة ورغبة لا تلين في البدء من جديد.",
    ur: "حمل، زائچے کا پہلا برج، مریخ کے زیرِ اثر ہے اور نئی ابتدا کی چنگاری کی علامت ہے۔ آتشی منقلب برج، یہ ہمت اور پیش قدمی کے جذبے سے آغاز کرتا ہے۔ حمل کے لوگ فطری رہنما ہیں جو صاف گوئی، توانائی اور نئے سرے سے شروع کرنے کے غیر متزلزل عزم کے ساتھ آگے بڑھتے ہیں۔",
  },
  taurus: {
    en: "Taurus, ruled by Venus, is the fixed earth sign of steadiness and sensual appreciation. Those born under Taurus value security, consistency, and the quiet pleasures of the material world. Patience is their gift, and persistence their quiet superpower.",
    es: "Tauro, regido por Venus, es el signo de tierra fijo de la constancia y el disfrute sensorial. Los tauro valoran la seguridad, la coherencia y los placeres serenos del mundo material. La paciencia es su don, y la perseverancia su superpoder silencioso.",
    zh: "金牛座由金星守护，是固定宫的土象星座，代表稳健与感官的品味。金牛座的人重视安全感、稳定，以及物质世界中宁静的愉悦。耐心是他们的天赋，坚持则是他们低调的超能力。",
    hi: "वृषभ, शुक्र द्वारा शासित, स्थिरता और सांसारिक आनंद की स्थिर पृथ्वी राशि है। वृषभ राशि के लोग सुरक्षा, निरंतरता और भौतिक जगत के शांत सुखों को महत्व देते हैं। धैर्य उनका उपहार है और दृढ़ता उनकी मौन महाशक्ति।",
    ar: "الثور، الذي تحكمه الزهرة، هو برج ترابي ثابت يمثّل الرسوخ وتذوّق الحسّيات. مواليد الثور يقدّرون الأمان والثبات وملذّات العالم المادي الهادئة. الصبر هبتهم، والمثابرة قوّتهم الخفية.",
    ur: "ثور، جس پر زہرہ حاکم ہے، استحکام اور حسّی لطف کا خاکی ثابت برج ہے۔ ثور کے لوگ تحفظ، تسلسل اور مادی دنیا کی پُرسکون لذتوں کو اہمیت دیتے ہیں۔ صبر ان کی نعمت ہے اور ثابت قدمی ان کی خاموش طاقت۔",
  },
  gemini: {
    en: "Gemini, governed by Mercury, is the mutable air sign of communication and curiosity. Geminis are quick-witted, adaptable, and endlessly inquisitive. They gather ideas like constellations gather stars, connecting people, thoughts, and worlds with effortless fluency.",
    es: "Géminis, gobernado por Mercurio, es el signo de aire mutable de la comunicación y la curiosidad. Los géminis son ágiles de mente, adaptables e infinitamente inquisitivos. Reúnen ideas como las constelaciones reúnen estrellas, conectando personas, pensamientos y mundos con fluidez natural.",
    zh: "双子座由水星主宰，是变动宫的风象星座，代表沟通与好奇。双子座的人机敏、灵活，充满无尽的求知欲。他们像星座汇聚繁星一样收集想法，以毫不费力的流畅连接人、思想与世界。",
    hi: "मिथुन, बुध द्वारा शासित, संचार और जिज्ञासा की द्विस्वभाव वायु राशि है। मिथुन राशि के लोग तीव्र बुद्धि वाले, अनुकूलनशील और अनवरत जिज्ञासु होते हैं। वे विचारों को ऐसे बटोरते हैं जैसे नक्षत्र तारे, और सहजता से लोगों, विचारों और दुनियाओं को जोड़ते हैं।",
    ar: "الجوزاء، الذي يحكمه عطارد، هو برج هوائي متحرك للتواصل والفضول. مواليد الجوزاء سريعو البديهة، قابلون للتكيّف، ولا ينضب فضولهم. يجمعون الأفكار كما تجمع الكوكبات نجومها، فيصلون بين الناس والأفكار والعوالم بسلاسة عفوية.",
    ur: "جوزا، جس پر عطارد حاکم ہے، رابطے اور تجسس کا ہوائی متحرک برج ہے۔ جوزا کے لوگ تیز فہم، ہم آہنگ اور بے پناہ متجسس ہوتے ہیں۔ وہ خیالات کو یوں سمیٹتے ہیں جیسے کہکشائیں ستارے، اور لوگوں، خیالوں اور دنیاؤں کو بے تکلفی سے جوڑتے ہیں۔",
  },
  cancer: {
    en: "Cancer, ruled by the Moon, is the cardinal water sign of intuition and care. Deeply attuned to emotion and memory, those under Cancer nurture the people and places they love with quiet devotion. Their strength lies in feeling deeply and protecting fiercely.",
    es: "Cáncer, regido por la Luna, es el signo de agua cardinal de la intuición y el cuidado. Profundamente sintonizados con la emoción y la memoria, los cáncer cuidan a las personas y los lugares que aman con devoción serena. Su fuerza reside en sentir hondo y proteger con fiereza.",
    zh: "巨蟹座由月亮守护，是基本宫的水象星座，代表直觉与关怀。巨蟹座的人与情感和记忆深深相连，以静默的深情呵护所爱的人与地方。他们的力量在于深切地感受，也在于坚定地守护。",
    hi: "कर्क, चंद्रमा द्वारा शासित, अंतर्ज्ञान और देखभाल की चर जल राशि है। भावना और स्मृति से गहराई से जुड़े कर्क राशि के लोग अपने प्रियजनों और स्थानों का मौन समर्पण से पोषण करते हैं। उनकी शक्ति गहराई से महसूस करने और प्रबलता से रक्षा करने में है।",
    ar: "السرطان، الذي يحكمه القمر، هو برج مائي منقلب للحدس والرعاية. لشدّة انسجامهم مع المشاعر والذكرى، يرعى مواليد السرطان من يحبّون من أشخاص وأماكن بإخلاص هادئ. قوّتهم في عمق شعورهم وشراسة حمايتهم.",
    ur: "سرطان، جس پر چاند حاکم ہے، وجدان اور دیکھ بھال کا آبی منقلب برج ہے۔ جذبات اور یادوں سے گہرے جُڑے سرطان کے لوگ اپنے پیاروں اور مقامات کی خاموش لگن سے پرورش کرتے ہیں۔ ان کی طاقت گہرائی سے محسوس کرنے اور شدت سے حفاظت کرنے میں ہے۔",
  },
  leo: {
    en: "Leo, ruled by the Sun, is the fixed fire sign of radiance and heart. Generous, creative, and magnetically warm, those under Leo carry a natural dignity that draws others into their orbit. Their loyalty is fierce and their creative fire unwavering.",
    es: "Leo, regido por el Sol, es el signo de fuego fijo del resplandor y el corazón. Generosos, creativos y magnéticamente cálidos, los leo poseen una dignidad natural que atrae a los demás a su órbita. Su lealtad es feroz y su fuego creativo, inquebrantable.",
    zh: "狮子座由太阳守护，是固定宫的火象星座，代表光芒与真心。慷慨、富有创造力、温暖而具吸引力，狮子座的人带着天然的尊贵气度，将他人吸引到自己的轨道中。他们的忠诚炽烈，创造之火从不熄灭。",
    hi: "सिंह, सूर्य द्वारा शासित, तेज और हृदय की स्थिर अग्नि राशि है। उदार, रचनात्मक और चुंबकीय रूप से गर्मजोश, सिंह राशि के लोग एक स्वाभाविक गरिमा धारण करते हैं जो दूसरों को उनकी ओर खींचती है। उनकी वफादारी प्रबल और रचनात्मक अग्नि अटल होती है।",
    ar: "الأسد، الذي تحكمه الشمس، هو برج ناري ثابت للتألّق والقلب. كرماء، مبدعون، دافئون بجاذبية، يحمل مواليد الأسد وقاراً فطرياً يجذب الآخرين إلى مدارهم. ولاؤهم شديد ونارهم الإبداعية لا تخبو.",
    ur: "اسد، جس پر سورج حاکم ہے، تابانی اور دل کا آتشی ثابت برج ہے۔ سخی، تخلیقی اور مقناطیسی گرمجوشی کے حامل، اسد کے لوگ ایک فطری وقار رکھتے ہیں جو دوسروں کو اپنی طرف کھینچتا ہے۔ ان کی وفاداری شدید اور تخلیقی آگ غیر متزلزل ہے۔",
  },
  virgo: {
    en: "Virgo, governed by Mercury, is the mutable earth sign of refinement and service. Meticulous, analytical, and quietly practical, Virgos see the small details others overlook and turn them into order and usefulness. Their devotion is expressed through precision and care.",
    es: "Virgo, gobernado por Mercurio, es el signo de tierra mutable del refinamiento y el servicio. Meticulosos, analíticos y discretamente prácticos, los virgo ven los pequeños detalles que otros pasan por alto y los convierten en orden y utilidad. Su devoción se expresa mediante la precisión y el cuidado.",
    zh: "处女座由水星主宰，是变动宫的土象星座，代表精致与服务。细致、善于分析、低调务实，处女座的人能看见他人忽略的细节，并将其化为秩序与实用。他们的热忱透过精确与用心得以表达。",
    hi: "कन्या, बुध द्वारा शासित, परिष्कार और सेवा की द्विस्वभाव पृथ्वी राशि है। सूक्ष्म, विश्लेषणात्मक और चुपचाप व्यावहारिक, कन्या राशि के लोग उन छोटी बातों को देखते हैं जिन्हें अन्य अनदेखा कर देते हैं, और उन्हें व्यवस्था तथा उपयोगिता में बदल देते हैं। उनका समर्पण सटीकता और देखभाल से प्रकट होता है।",
    ar: "العذراء، الذي يحكمه عطارد، هو برج ترابي متحرك للإتقان والخدمة. دقيقون، تحليليون، وعمليون بهدوء، يرى مواليد العذراء التفاصيل الصغيرة التي يغفلها الآخرون فيحوّلونها إلى نظام ونفع. يتجلّى إخلاصهم في الدقّة والعناية.",
    ur: "سنبلہ، جس پر عطارد حاکم ہے، نفاست اور خدمت کا خاکی متحرک برج ہے۔ باریک بین، تجزیاتی اور خاموشی سے عملی، سنبلہ کے لوگ وہ چھوٹی تفصیلات دیکھ لیتے ہیں جنہیں دوسرے نظرانداز کر دیتے ہیں، اور انہیں ترتیب اور افادیت میں بدل دیتے ہیں۔ ان کی لگن درستی اور خیال داری میں ظاہر ہوتی ہے۔",
  },
  libra: {
    en: "Libra, ruled by Venus, is the cardinal air sign of balance and beauty. Represented by the scales, Libra seeks harmony in relationships and fairness in all things. Their grace, diplomacy, and aesthetic eye bring equilibrium to the world around them.",
    es: "Libra, regido por Venus, es el signo de aire cardinal del equilibrio y la belleza. Representado por la balanza, Libra busca la armonía en las relaciones y la justicia en todo. Su gracia, diplomacia y sentido estético aportan equilibrio al mundo que lo rodea.",
    zh: "天秤座由金星守护，是基本宫的风象星座，代表平衡与美。以天平为象征，天秤座在关系中追求和谐，在万事中追求公正。他们的优雅、圆融与审美眼光为周遭世界带来平衡。",
    hi: "तुला, शुक्र द्वारा शासित, संतुलन और सौंदर्य की चर वायु राशि है। तराजू द्वारा दर्शाई गई, तुला रिश्तों में सामंजस्य और हर बात में निष्पक्षता चाहती है। उनकी शालीनता, कूटनीति और सौंदर्यदृष्टि अपने चारों ओर की दुनिया में संतुलन लाती है।",
    ar: "الميزان، الذي تحكمه الزهرة، هو برج هوائي منقلب للتوازن والجمال. يرمز إليه بالميزان، ويسعى إلى الانسجام في العلاقات والإنصاف في كل شيء. رقّته ودبلوماسيته وذوقه الجمالي تُضفي توازناً على العالم من حوله.",
    ur: "میزان، جس پر زہرہ حاکم ہے، توازن اور حسن کا ہوائی منقلب برج ہے۔ ترازو سے ظاہر، میزان رشتوں میں ہم آہنگی اور ہر شے میں انصاف چاہتا ہے۔ اس کی شائستگی، سفارت کاری اور جمالیاتی نظر اپنے گرد کی دنیا میں توازن لاتی ہے۔",
  },
  scorpio: {
    en: "Scorpio, ruled by Pluto, is the fixed water sign of depth and transformation. Intense, perceptive, and fiercely committed, Scorpios feel everything at full force and are drawn to the truths beneath the surface. Their courage transforms themselves and others.",
    es: "Escorpio, regido por Plutón, es el signo de agua fijo de la profundidad y la transformación. Intensos, perceptivos y ferozmente comprometidos, los escorpio sienten todo con plena fuerza y se sienten atraídos por las verdades ocultas bajo la superficie. Su valor los transforma a sí mismos y a los demás.",
    zh: "天蝎座由冥王星守护，是固定宫的水象星座，代表深度与蜕变。强烈、敏锐、极度投入，天蝎座的人以全部力量去感受一切，被表象之下的真相所吸引。他们的勇气既改变自己，也改变他人。",
    hi: "वृश्चिक, प्लूटो द्वारा शासित, गहराई और रूपांतरण की स्थिर जल राशि है। तीव्र, गहरी समझ वाले और प्रबलता से प्रतिबद्ध, वृश्चिक राशि के लोग हर चीज़ को पूरी शक्ति से महसूस करते हैं और सतह के नीचे छिपे सत्य की ओर खिंचते हैं। उनका साहस स्वयं को और दूसरों को बदल देता है।",
    ar: "العقرب، الذي يحكمه بلوتو، هو برج مائي ثابت للعمق والتحوّل. كثيفو المشاعر، فطنون، وملتزمون بشدّة، يشعر مواليد العقرب بكل شيء بكامل قوّته وينجذبون إلى الحقائق تحت السطح. شجاعتهم تُحوّلهم وتُحوّل غيرهم.",
    ur: "عقرب، جس پر پلوٹو حاکم ہے، گہرائی اور تبدیلی کا آبی ثابت برج ہے۔ شدید، باشعور اور بھرپور طور پر پُرعزم، عقرب کے لوگ ہر شے کو پوری شدت سے محسوس کرتے ہیں اور سطح کے نیچے چھپے سچ کی طرف کھنچتے ہیں۔ ان کی ہمت خود کو اور دوسروں کو بدل دیتی ہے۔",
  },
  sagittarius: {
    en: "Sagittarius, ruled by Jupiter, is the mutable fire sign of adventure and wisdom. Bold, optimistic, and philosophical, Sagittarians seek meaning through experience. The archer aims high, always reaching toward the horizon of bigger ideas and wider worlds.",
    es: "Sagitario, regido por Júpiter, es el signo de fuego mutable de la aventura y la sabiduría. Audaces, optimistas y filosóficos, los sagitario buscan sentido a través de la experiencia. El arquero apunta alto, siempre tendiendo hacia el horizonte de ideas más grandes y mundos más amplios.",
    zh: "射手座由木星守护，是变动宫的火象星座，代表冒险与智慧。大胆、乐观、富有哲思，射手座的人通过经历寻找意义。射手瞄准高处，始终朝着更宏大的思想与更广阔的世界的地平线迈进。",
    hi: "धनु, बृहस्पति द्वारा शासित, साहस और ज्ञान की द्विस्वभाव अग्नि राशि है। निर्भीक, आशावादी और दार्शनिक, धनु राशि के लोग अनुभव के माध्यम से अर्थ खोजते हैं। धनुर्धर ऊँचा निशाना लगाता है, सदा बड़े विचारों और व्यापक दुनियाओं के क्षितिज की ओर बढ़ता है।",
    ar: "القوس، الذي يحكمه المشتري، هو برج ناري متحرك للمغامرة والحكمة. جريئون، متفائلون، وفلسفيون، يبحث مواليد القوس عن المعنى عبر التجربة. الرامي يصوّب عالياً، متطلّعاً دائماً إلى أفق أفكار أكبر وعوالم أوسع.",
    ur: "قوس، جس پر مشتری حاکم ہے، مہم جوئی اور دانائی کا آتشی متحرک برج ہے۔ نڈر، پُرامید اور فلسفیانہ، قوس کے لوگ تجربے کے ذریعے معنی تلاش کرتے ہیں۔ تیرانداز بلند نشانہ لگاتا ہے، ہمیشہ بڑے خیالات اور وسیع تر دنیاؤں کے اُفق کی طرف بڑھتا ہے۔",
  },
  capricorn: {
    en: "Capricorn, ruled by Saturn, is the cardinal earth sign of achievement and mastery. Ambitious, disciplined, and profoundly patient, Capricorns build their lives with care and foresight. The goat climbs steadily, refusing to be deterred by the steepness of the ascent.",
    es: "Capricornio, regido por Saturno, es el signo de tierra cardinal del logro y la maestría. Ambiciosos, disciplinados y profundamente pacientes, los capricornio construyen su vida con cuidado y previsión. La cabra asciende con firmeza, sin dejarse disuadir por lo empinado del camino.",
    zh: "摩羯座由土星守护，是基本宫的土象星座，代表成就与精通。有抱负、自律、极具耐心，摩羯座的人以细心与远见构筑人生。山羊稳步攀登，绝不因山势的陡峭而退缩。",
    hi: "मकर, शनि द्वारा शासित, उपलब्धि और महारत की चर पृथ्वी राशि है। महत्वाकांक्षी, अनुशासित और गहन धैर्यवान, मकर राशि के लोग सावधानी और दूरदर्शिता से अपना जीवन गढ़ते हैं। बकरा स्थिरता से चढ़ता है, चढ़ाई की कठिनता से विचलित हुए बिना।",
    ar: "الجدي، الذي يحكمه زحل، هو برج ترابي منقلب للإنجاز والإتقان. طموحون، منضبطون، وصبورون إلى أبعد حدّ، يبني مواليد الجدي حياتهم بعناية وبُعد نظر. يتسلّق الجدي بثبات، رافضاً أن يثنيه انحدار الصعود.",
    ur: "جدی، جس پر زحل حاکم ہے، کامیابی اور مہارت کا خاکی منقلب برج ہے۔ بلند حوصلہ، منظم اور نہایت صابر، جدی کے لوگ احتیاط اور دور اندیشی سے اپنی زندگی تعمیر کرتے ہیں۔ بکرا مستقل مزاجی سے چڑھتا ہے، چڑھائی کی دشواری سے مایوس ہوئے بغیر۔",
  },
  aquarius: {
    en: "Aquarius, ruled by Uranus, is the fixed air sign of innovation and collective vision. Independent, inventive, and deeply humanitarian, Aquarians look toward the future and champion the causes of the many. They value progress, originality, and freedom of thought.",
    es: "Acuario, regido por Urano, es el signo de aire fijo de la innovación y la visión colectiva. Independientes, inventivos y profundamente humanitarios, los acuario miran hacia el futuro y defienden las causas de la mayoría. Valoran el progreso, la originalidad y la libertad de pensamiento.",
    zh: "水瓶座由天王星守护，是固定宫的风象星座，代表创新与集体愿景。独立、善于创新、极富人道精神，水瓶座的人放眼未来，为众人的事业奔走。他们珍视进步、独创与思想的自由。",
    hi: "कुंभ, यूरेनस द्वारा शासित, नवाचार और सामूहिक दृष्टि की स्थिर वायु राशि है। स्वतंत्र, आविष्कारी और गहन मानवतावादी, कुंभ राशि के लोग भविष्य की ओर देखते हैं और अनेक लोगों के हित की पैरवी करते हैं। वे प्रगति, मौलिकता और विचार की स्वतंत्रता को महत्व देते हैं।",
    ar: "الدلو، الذي يحكمه أورانوس، هو برج هوائي ثابت للابتكار والرؤية الجماعية. مستقلون، مبتكرون، وإنسانيون بعمق، يتطلّع مواليد الدلو إلى المستقبل ويناصرون قضايا الكثيرين. يقدّرون التقدّم والأصالة وحرية الفكر.",
    ur: "دلو، جس پر یورینس حاکم ہے، جدت اور اجتماعی بصیرت کا ہوائی ثابت برج ہے۔ خودمختار، موجد اور گہرے انسان دوست، دلو کے لوگ مستقبل کی طرف دیکھتے ہیں اور بہتوں کے مقاصد کی حمایت کرتے ہیں۔ وہ ترقی، اصلیت اور آزادیِ فکر کو اہمیت دیتے ہیں۔",
  },
  pisces: {
    en: "Pisces, ruled by Neptune, is the mutable water sign of imagination and compassion. Intuitive, artistic, and deeply empathetic, Pisceans feel the currents of emotion that flow beneath everyday life. Their gift is to see the invisible and give it form.",
    es: "Piscis, regido por Neptuno, es el signo de agua mutable de la imaginación y la compasión. Intuitivos, artísticos y profundamente empáticos, los piscis sienten las corrientes de emoción que fluyen bajo la vida cotidiana. Su don es ver lo invisible y darle forma.",
    zh: "双鱼座由海王星守护，是变动宫的水象星座，代表想象力与慈悲。直觉敏锐、富有艺术气质、深具共情，双鱼座的人能感受到日常生活之下涌动的情感暗流。他们的天赋是看见无形，并赋予它形态。",
    hi: "मीन, नेपच्यून द्वारा शासित, कल्पना और करुणा की द्विस्वभाव जल राशि है। सहज-बोध वाले, कलात्मक और गहन सहानुभूतिपूर्ण, मीन राशि के लोग रोज़मर्रा के जीवन के नीचे बहती भावनाओं की धाराओं को महसूस करते हैं। उनका उपहार अदृश्य को देखना और उसे रूप देना है।",
    ar: "الحوت، الذي يحكمه نبتون، هو برج مائي متحرك للخيال والرحمة. حدسيون، فنّيون، وشديدو التعاطف، يشعر مواليد الحوت بتيّارات المشاعر التي تجري تحت الحياة اليومية. هبتهم أن يروا ما لا يُرى ويمنحوه شكلاً.",
    ur: "حوت، جس پر نیپچون حاکم ہے، تخیل اور رحم دلی کا آبی متحرک برج ہے۔ وجدانی، فنکارانہ اور گہرے ہمدرد، حوت کے لوگ روزمرہ زندگی کے نیچے بہتی جذبات کی لہروں کو محسوس کرتے ہیں۔ ان کا تحفہ یہ ہے کہ وہ اَن دیکھے کو دیکھ لیں اور اسے صورت دیں۔",
  },
};

/** Localized sign description; falls back to English for any gap. */
export function signDescription(slug: string, locale: Locale): string {
  const m = SIGN_DESCRIPTIONS[slug];
  return (m && (m[locale] ?? m.en)) ?? "";
}
