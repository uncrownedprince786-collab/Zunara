export type CelebrityRegion =
  | "Hollywood"
  | "Bollywood"
  | "K-Pop"
  | "Thai"
  | "Sports"
  | "Global";

export interface Celebrity {
  /** Birth month (1-12) */
  month: number;
  /** Birth day (1-31) */
  day: number;
  name: string;
  profession: string;
  region: CelebrityRegion;
  /** One-sentence bio / "star energy" note */
  star: string;
  /** Official public profile (Wikipedia) */
  url: string;
  /** Optional explicit Wikipedia slug to override auto-generation (for ambiguous names) */
  wiki?: string;
}

const C: Array<
  Pick<
    Celebrity,
    "month" | "day" | "name" | "profession" | "region" | "star" | "wiki"
  >
> = [
  // ---- January ----
  { month: 1, day: 3, name: "J. R. R. Tolkien", profession: "Author", region: "Global", star: "The architect of Middle-earth, who turned language and myth into a living legend." },
  { month: 1, day: 5, name: "Deepika Padukone", profession: "Actor", region: "Bollywood", star: "A luminous Bollywood star whose grace on and off screen has made her a global name." },
  { month: 1, day: 7, name: "Lewis Hamilton", profession: "Racing driver", region: "Sports", star: "A seven-time world champion whose speed and conviction rewrote the history of Formula One." },
  { month: 1, day: 8, name: "Elvis Presley", profession: "Singer", region: "Global", star: "The King of Rock and Roll, whose voice and magnetism changed popular music forever." },
  { month: 1, day: 13, name: "Orlando Bloom", profession: "Actor", region: "Hollywood", star: "A swashbuckling actor who rides across fantasy epics and historic wars alike." },
  { month: 1, day: 14, name: "Jason Bateman", profession: "Actor & director", region: "Hollywood", star: "A deadpan comedic master whose timing makes silence the funniest line." },
  { month: 1, day: 16, name: "Lin-Manuel Miranda", profession: "Composer & actor", region: "Global", star: "The playwright who turned history into hip-hop and made the room where it happens unforgettable." },
  { month: 1, day: 16, name: "Jennie", profession: "Singer", region: "K-Pop", star: "The magnetic heart of BLACKPINK, an idol whose stage presence burns into memory.", wiki: "Jennie_(singer)" },
  { month: 1, day: 18, name: "Kevin Costner", profession: "Actor & director", region: "Hollywood", star: "A cinematic everyman with an eye for sweeping American stories." },
  { month: 1, day: 23, name: "Princess Diana", profession: "Royal patron", region: "Global", star: "The people's princess, remembered for warmth, compassion and quiet revolution." },
  { month: 1, day: 27, name: "Mikhail Baryshnikov", profession: "Dancer", region: "Global", star: "A ballet legend whose leaps seem to defy the pull of gravity." },

  // ---- February ----
  { month: 2, day: 2, name: "Shakira", profession: "Singer", region: "Global", star: "A global pop force whose hips don't lie and whose lyrics carry meaning worldwide." },
  { month: 2, day: 4, name: "Rosa Parks", profession: "Civil rights activist", region: "Global", star: "A quiet act of defiance that became a defining moment in the fight for equality." },
  { month: 2, day: 11, name: "Jennifer Aniston", profession: "Actor", region: "Hollywood", star: "The friend everyone wants, whose comedic warmth made a generation feel at home." },
  { month: 2, day: 17, name: "Michael Jordan", profession: "Basketball player", region: "Sports", star: "The greatest to grace the court, whose competitive fire redefined greatness." },
  { month: 2, day: 21, name: "Elliot Page", profession: "Actor", region: "Hollywood", star: "A fearless performer who brings honesty and gravity to every role." },
  { month: 2, day: 26, name: "Shah Rukh Khan", profession: "Actor", region: "Bollywood", star: "The king of Bollywood romance, whose charisma spans continents." },

  // ---- March ----
  { month: 3, day: 1, name: "Justin Bieber", profession: "Singer", region: "Global", star: "From viral discovery to pop icon, a voice woven into the fabric of a generation." },
  { month: 3, day: 3, name: "Miranda Kerr", profession: "Model", region: "Global", star: "A supermodel turned entrepreneur glowing with Australian poise." },
  { month: 3, day: 9, name: "Suga", profession: "Rapper & producer", region: "K-Pop", star: "A BTS wordsmith whose introspective verses carry stadium-sized emotion." },
  { month: 3, day: 14, name: "Albert Einstein", profession: "Physicist", region: "Global", star: "The gentle genius whose imagination reshaped our understanding of the cosmos." },
  { month: 3, day: 18, name: "Yaya Urassaya", profession: "Actor", region: "Thai", star: "A Thai screen darling whose luminous smile anchors a generation of drama." },
  { month: 3, day: 20, name: "Spike Lee", profession: "Filmmaker", region: "Hollywood", star: "A director who turns the camera into a mirror held to society." },
  { month: 3, day: 24, name: "Usher", profession: "Singer", region: "Global", star: "An R&B icon whose smooth moves and falsetto define modern soul." },
  { month: 3, day: 26, name: "Keira Knightley", profession: "Actor", region: "Hollywood", star: "A period-drama favorite whose sharp wit grounds every costume piece." },

  // ---- April ----
  { month: 4, day: 3, name: "Alec Baldwin", profession: "Actor", region: "Hollywood", star: "A commanding actor with a voice tailor-made for political satire." },
  { month: 4, day: 8, name: "Patricia Arquette", profession: "Actor", region: "Hollywood", star: "A fiercely committed performer who disappears into every role." },
  { month: 4, day: 12, name: "Andy García", profession: "Actor", region: "Hollywood", star: "A magnetic leading man whose presence elevates every ensemble." },
  { month: 4, day: 21, name: "Iggy Pop", profession: "Singer", region: "Global", star: "The godfather of punk whose raw energy never dimmed." },
  { month: 4, day: 22, name: "Jack Nicholson", profession: "Actor", region: "Hollywood", star: "An icon of the silver screen whose grin can charm and unsettle in equal measure." },
  { month: 4, day: 25, name: "Renée Zellweger", profession: "Actor", region: "Hollywood", star: "An Oscar-winning actress whose transformations are the stuff of legend." },

  // ---- May ----
  { month: 5, day: 4, name: "Audrey Hepburn", profession: "Actor", region: "Hollywood", star: "An eternal style icon whose elegance and humanitarian heart still shine." },
  { month: 5, day: 6, name: "George Clooney", profession: "Actor & director", region: "Hollywood", star: "Hollywood's smoothest operator, equally at home behind the camera and in humanitarian work." },
  { month: 5, day: 14, name: "Cate Blanchett", profession: "Actor", region: "Hollywood", star: "A chameleon of the craft whose range seems without limit." },
  { month: 5, day: 21, name: "MrBeast", profession: "Creator & philanthropist", region: "Global", star: "The world's biggest creator, turning spectacle into massive acts of giving." },
  { month: 5, day: 27, name: "Paul Bettany", profession: "Actor", region: "Hollywood", star: "The voice and soul behind the Vision, equal parts intellect and heart." },

  // ---- June ----
  { month: 6, day: 3, name: "Tom Holland", profession: "Actor", region: "Hollywood", star: "An agile young star whose charm swung a generation into a new era of superheroes." },
  { month: 6, day: 7, name: "Tom Hanks", profession: "Actor", region: "Hollywood", star: "America's dad, whose warmth and craftsmanship made him one of the most beloved actors alive." },
  { month: 6, day: 13, name: "Chris Evans", profession: "Actor", region: "Hollywood", star: "The actor who made 'America's ass' a cultural icon with genuine heart." },
  { month: 6, day: 22, name: "Meryl Streep", profession: "Actor", region: "Hollywood", star: "The most celebrated actress of her generation, with a mastery that seems effortless." },
  { month: 6, day: 27, name: "Tobey Maguire", profession: "Actor", region: "Hollywood", star: "The original wall-crawler whose earnestness launched a superhero era." },

  // ---- July ----
  { month: 7, day: 3, name: "Tom Cruise", profession: "Actor", region: "Hollywood", star: "A daredevil star who performs his own stunts and refuses to slow down." },
  { month: 7, day: 8, name: "Sofia Vergara", profession: "Actor", region: "Hollywood", star: "A comedic tour de force whose larger-than-life presence lights up every scene." },
  { month: 7, day: 13, name: "Harrison Ford", profession: "Actor", region: "Hollywood", star: "The rugged hero of the blockbuster era, from Han Solo to Indiana Jones." },
  { month: 7, day: 18, name: "Nelson Mandela", profession: "Statesman", region: "Global", star: "A global leader whose forgiveness turned a prison sentence into a nation's freedom." },
  { month: 7, day: 25, name: "Matt LeBlanc", profession: "Actor", region: "Hollywood", star: "A sitcom legend whose humor made friendship a global religion." },
  { month: 7, day: 26, name: "Sandra Bullock", profession: "Actor", region: "Hollywood", star: "An Oscar-winning actress equally brilliant in comedy and drama." },

  // ---- August ----
  { month: 8, day: 5, name: "Neil Armstrong", profession: "Astronaut", region: "Global", star: "The first human to set foot on the Moon — a small step that became a giant leap for all." },
  { month: 8, day: 7, name: "David Duchovny", profession: "Actor", region: "Hollywood", star: "The truth-seeking agent whose deadpan intensity defined the paranormal drama." },
  { month: 8, day: 16, name: "Madonna", profession: "Singer", region: "Global", star: "The Queen of Pop, a chameleon who reinvented popular music for four decades." },
  { month: 8, day: 24, name: "Rupert Grint", profession: "Actor", region: "Hollywood", star: "The loyal redhead who made every young reader wish for a magical best friend." },
  { month: 8, day: 29, name: "Michael Jackson", profession: "Singer", region: "Global", star: "The King of Pop, whose music and movement defined an era of spectacle." },

  // ---- September ----
  { month: 9, day: 1, name: "Jungkook", profession: "Singer", region: "K-Pop", star: "The golden maknae of BTS, an all-round performer whose voice carries worldwide." },
  { month: 9, day: 4, name: "Beyoncé", profession: "Singer", region: "Global", star: "A once-in-a-generation artist whose voice, art and influence tower over pop culture." },
  { month: 9, day: 6, name: "Tim Roth", profession: "Actor", region: "Hollywood", star: "A fiercely independent actor prized for intensity and unpredictability." },
  { month: 9, day: 12, name: "RM", profession: "Rapper & leader", region: "K-Pop", star: "The thoughtful leader of BTS whose words and artistry shape a generation.", wiki: "RM_(musician)" },
  { month: 9, day: 16, name: "Madeline Zima", profession: "Actor", region: "Hollywood", star: "A versatile performer who grew up on screen with grace." },
  { month: 9, day: 21, name: "Stephen King", profession: "Author", region: "Global", star: "The master of horror who finds the everyday terror lurking beneath the surface." },
  { month: 9, day: 28, name: "Naomi Watts", profession: "Actor", region: "Hollywood", star: "An actress of luminous vulnerability, equally at home in drama and suspense." },
  { month: 9, day: 30, name: "Baifern Pimchanok", profession: "Actor", region: "Thai", star: "A beloved Thai actress whose roles made her a household name across Asia." },

  // ---- October ----
  { month: 10, day: 2, name: "Gandhi", profession: "Political leader", region: "Global", star: "A leader whose philosophy of non-violence moved a nation and the world." },
  { month: 10, day: 8, name: "Matt Damon", profession: "Actor", region: "Hollywood", star: "A leading man and writer whose intelligence anchors every role." },
  { month: 10, day: 14, name: "Ralph Lauren", profession: "Fashion designer", region: "Global", star: "A designer who built an American fashion empire on timeless elegance." },
  { month: 10, day: 13, name: "Jimin", profession: "Singer", region: "K-Pop", star: "A BTS star whose fluid grace and tender vocals soften the loudest of stages." },
  { month: 10, day: 22, name: "Ryan Reynolds", profession: "Actor", region: "Hollywood", star: "A quick-witted leading man whose self-aware humor broke the fourth wall worldwide." },
  { month: 10, day: 25, name: "Katy Perry", profession: "Singer", region: "Global", star: "A pop showwoman whose kaleidoscopic style fills stadiums worldwide." },

  // ---- November ----
  { month: 11, day: 2, name: "Kendall Jenner", profession: "Model", region: "Global", star: "A supermodel whose effortless cool defined a new generation of fashion." },
  { month: 11, day: 9, name: "Carl Sagan", profession: "Astronomer", region: "Global", star: "The astronomer who made the cosmos feel personal and infinitely wondrous." },
  { month: 11, day: 11, name: "Leonardo DiCaprio", profession: "Actor", region: "Hollywood", star: "An actor of restless ambition and a dedicated advocate for the planet." },
  { month: 11, day: 17, name: "Sophie Marceau", profession: "Actor", region: "Global", star: "A French screen icon whose elegance spans the Atlantic." },
  { month: 11, day: 22, name: "Scarlett Johansson", profession: "Actor", region: "Hollywood", star: "A versatile star equally commanding in comic blockbusters and intimate drama." },

  // ---- December ----
  { month: 12, day: 3, name: "Ozzy Osbourne", profession: "Singer", region: "Global", star: "The Prince of Darkness, a rock legend who turned chaos into anthems." },
  { month: 12, day: 4, name: "Jin", profession: "Singer", region: "K-Pop", star: "The gentle eldest of BTS, whose warmth and vocals open the door to stardom.", wiki: "Jin_(singer)" },
  { month: 12, day: 4, name: "Mario Maurer", profession: "Actor", region: "Thai", star: "A Thai cinema heartthrob whose charm made him a continental sensation." },
  { month: 12, day: 10, name: "Emily Dickinson", profession: "Poet", region: "Global", star: "A reclusive poet whose inward worlds became timeless verses." },
  { month: 12, day: 16, name: "Arthur C. Clarke", profession: "Writer & futurist", region: "Global", star: "A visionary who imagined space and intelligence with prophetic clarity." },
  { month: 12, day: 30, name: "V", profession: "Singer", region: "K-Pop", star: "The soulful vocalist and visual of BTS, beloved for depth beyond the spotlight.", wiki: "V_(singer)" },
];

const CELEBRITIES: Celebrity[] = C.map((c) => ({
  ...c,
  url: `https://en.wikipedia.org/wiki/${c.wiki ?? c.name.replace(/ /g, "_")}`,
}));

/** Everyone born on the given month/day, across all decades. */
export function celebritiesForDate(month: number, day: number): Celebrity[] {
  return CELEBRITIES.filter((c) => c.month === month && c.day === day);
}

export function regionsPresent(): CelebrityRegion[] {
  const set = new Set<CelebrityRegion>();
  for (const c of CELEBRITIES) set.add(c.region);
  return Array.from(set);
}
