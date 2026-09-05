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
  /** Portrait thumbnail (Wikimedia Commons) */
  image?: string;
}

const C: Array<
  Pick<
    Celebrity,
    "month" | "day" | "name" | "profession" | "region" | "star" | "wiki" | "image"
  >
> = [
  // ---- January ----
  { month: 1, day: 3, name: "J. R. R. Tolkien", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J._R._R._Tolkien%2C_ca._1925.jpg/330px-J._R._R._Tolkien%2C_ca._1925.jpg", profession: "Author", region: "Global", star: "The architect of Middle-earth, who turned language and myth into a living legend." },
  { month: 1, day: 5, name: "Deepika Padukone", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Deepika_Padukone_2025_%281%29.png/330px-Deepika_Padukone_2025_%281%29.png", profession: "Actor", region: "Bollywood", star: "A luminous Bollywood star whose grace on and off screen has made her a global name." },
  { month: 1, day: 7, name: "Lewis Hamilton", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg/330px-Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg", profession: "Racing driver", region: "Sports", star: "A seven-time world champion whose speed and conviction rewrote the history of Formula One." },
  { month: 1, day: 8, name: "Elvis Presley", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elvis_Presley_promoting_Jailhouse_Rock.jpg/330px-Elvis_Presley_promoting_Jailhouse_Rock.jpg", profession: "Singer", region: "Global", star: "The King of Rock and Roll, whose voice and magnetism changed popular music forever." },
  { month: 1, day: 13, name: "Orlando Bloom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Orlando_Bloom_at_the_2024_Toronto_International_Film_Festival_%28cropped2%29.jpg/330px-Orlando_Bloom_at_the_2024_Toronto_International_Film_Festival_%28cropped2%29.jpg", profession: "Actor", region: "Hollywood", star: "A swashbuckling actor who rides across fantasy epics and historic wars alike." },
  { month: 1, day: 14, name: "Jason Bateman", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Jason_Bateman.jpg/330px-Jason_Bateman.jpg", profession: "Actor & director", region: "Hollywood", star: "A deadpan comedic master whose timing makes silence the funniest line." },
  { month: 1, day: 16, name: "Lin-Manuel Miranda", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Lin-Manuel_Miranda_%26_James_McAvoy_%2848383681926%29_%28cropped%29.jpg/330px-Lin-Manuel_Miranda_%26_James_McAvoy_%2848383681926%29_%28cropped%29.jpg", profession: "Composer & actor", region: "Global", star: "The playwright who turned history into hip-hop and made the room where it happens unforgettable." },
  { month: 1, day: 16, name: "Jennie", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/20260526_Jennie_Kim_04.jpg/330px-20260526_Jennie_Kim_04.jpg", profession: "Singer", region: "K-Pop", star: "The magnetic heart of BLACKPINK, an idol whose stage presence burns into memory.", wiki: "Jennie_(singer)" },
  { month: 1, day: 18, name: "Kevin Costner", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Kevin_Costner_at_81st_Venice_Film_Festival_%28cropped%29.jpg/330px-Kevin_Costner_at_81st_Venice_Film_Festival_%28cropped%29.jpg", profession: "Actor & director", region: "Hollywood", star: "A cinematic everyman with an eye for sweeping American stories." },
  { month: 1, day: 23, name: "Princess Diana", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/330px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg", profession: "Royal patron", region: "Global", star: "The people's princess, remembered for warmth, compassion and quiet revolution." },
  { month: 1, day: 27, name: "Mikhail Baryshnikov", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mikhail_Baryshnikov.jpg/330px-Mikhail_Baryshnikov.jpg", profession: "Dancer", region: "Global", star: "A ballet legend whose leaps seem to defy the pull of gravity." },

  // ---- February ----
  { month: 2, day: 2, name: "Shakira", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2023-11-16_Gala_de_los_Latin_Grammy%2C_03_%28cropped%2902.jpg/330px-2023-11-16_Gala_de_los_Latin_Grammy%2C_03_%28cropped%2902.jpg", profession: "Singer", region: "Global", star: "A global pop force whose hips don't lie and whose lyrics carry meaning worldwide." },
  { month: 2, day: 4, name: "Rosa Parks", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rosa_Parks%2C_November_1956_%28cropped%29.jpg/330px-Rosa_Parks%2C_November_1956_%28cropped%29.jpg", profession: "Civil rights activist", region: "Global", star: "A quiet act of defiance that became a defining moment in the fight for equality." },
  { month: 2, day: 11, name: "Jennifer Aniston", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/JenniferAnistonHWoFFeb2012.jpg/330px-JenniferAnistonHWoFFeb2012.jpg", profession: "Actor", region: "Hollywood", star: "The friend everyone wants, whose comedic warmth made a generation feel at home." },
  { month: 2, day: 17, name: "Michael Jordan", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/330px-Michael_Jordan_in_2014.jpg", profession: "Basketball player", region: "Sports", star: "The greatest to grace the court, whose competitive fire redefined greatness." },
  { month: 2, day: 21, name: "Elliot Page", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Elliot_Page_2026.jpg/330px-Elliot_Page_2026.jpg", profession: "Actor", region: "Hollywood", star: "A fearless performer who brings honesty and gravity to every role." },
  { month: 2, day: 26, name: "Shah Rukh Khan", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg/330px-Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg", profession: "Actor", region: "Bollywood", star: "The king of Bollywood romance, whose charisma spans continents." },

  // ---- March ----
  { month: 3, day: 1, name: "Justin Bieber", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/P20260719DT-1213_President_Donald_J._Trump_and_First_Lady_Melania_Trump_attend_the_FIFA_World_Cup_Final_%28cropped_2%29.jpg/330px-P20260719DT-1213_President_Donald_J._Trump_and_First_Lady_Melania_Trump_attend_the_FIFA_World_Cup_Final_%28cropped_2%29.jpg", profession: "Singer", region: "Global", star: "From viral discovery to pop icon, a voice woven into the fabric of a generation." },
  { month: 3, day: 3, name: "Miranda Kerr", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Miranda_Kerr_-_Abbot_Kinney_2025.jpg/330px-Miranda_Kerr_-_Abbot_Kinney_2025.jpg", profession: "Model", region: "Global", star: "A supermodel turned entrepreneur glowing with Australian poise." },
  { month: 3, day: 9, name: "Suga", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Suga_for_Valentino_and_Marie_Claire_Korea_06.jpg/330px-Suga_for_Valentino_and_Marie_Claire_Korea_06.jpg", profession: "Rapper & producer", region: "K-Pop", star: "A BTS wordsmith whose introspective verses carry stadium-sized emotion." },
  { month: 3, day: 14, name: "Albert Einstein", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Albert_Einstein_Head_cleaned.jpg/330px-Albert_Einstein_Head_cleaned.jpg", profession: "Physicist", region: "Global", star: "The gentle genius whose imagination reshaped our understanding of the cosmos." },
  { month: 3, day: 18, name: "Yaya Urassaya", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Urassaya_Sperbund_in_October_2022.png/330px-Urassaya_Sperbund_in_October_2022.png", profession: "Actor", region: "Thai", star: "A Thai screen darling whose luminous smile anchors a generation of drama." },
  { month: 3, day: 20, name: "Spike Lee", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Neil_Grabosky_-_Spike_Lee_-_NEG_0876_%2854865282335%29.jpg/330px-Neil_Grabosky_-_Spike_Lee_-_NEG_0876_%2854865282335%29.jpg", profession: "Filmmaker", region: "Hollywood", star: "A director who turns the camera into a mirror held to society." },
  { month: 3, day: 24, name: "Usher", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Usher_Milan_2026.jpg/330px-Usher_Milan_2026.jpg", profession: "Singer", region: "Global", star: "An R&B icon whose smooth moves and falsetto define modern soul.", wiki: "Usher_(musician)" },
  { month: 3, day: 26, name: "Keira Knightley", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Knightley_Bafta_2015_07.png/330px-Knightley_Bafta_2015_07.png", profession: "Actor", region: "Hollywood", star: "A period-drama favorite whose sharp wit grounds every costume piece." },

  // ---- April ----
  { month: 4, day: 3, name: "Alec Baldwin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Alec_Baldwin_Taxi_Driver_Tribeca_Festival_2026-26.jpg/330px-Alec_Baldwin_Taxi_Driver_Tribeca_Festival_2026-26.jpg", profession: "Actor", region: "Hollywood", star: "A commanding actor with a voice tailor-made for political satire." },
  { month: 4, day: 8, name: "Patricia Arquette", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/PatriciaArquette.jpg/330px-PatriciaArquette.jpg", profession: "Actor", region: "Hollywood", star: "A fiercely committed performer who disappears into every role." },
  { month: 4, day: 12, name: "Andy García", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Andy_Garcia_at_the_2026_Cannes_Film_Festival_03.jpg/330px-Andy_Garcia_at_the_2026_Cannes_Film_Festival_03.jpg", profession: "Actor", region: "Hollywood", star: "A magnetic leading man whose presence elevates every ensemble." },
  { month: 4, day: 21, name: "Iggy Pop", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Iggy_Pop_door_Dirk_Annemans_2025_03_%28cropped%29.png/330px-Iggy_Pop_door_Dirk_Annemans_2025_03_%28cropped%29.png", profession: "Singer", region: "Global", star: "The godfather of punk whose raw energy never dimmed." },
  { month: 4, day: 22, name: "Jack Nicholson", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jack_Nicholson_2002.jpg/330px-Jack_Nicholson_2002.jpg", profession: "Actor", region: "Hollywood", star: "An icon of the silver screen whose grin can charm and unsettle in equal measure." },
  { month: 4, day: 23, name: "John Cena", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/John_Cena_July_2018.jpg/330px-John_Cena_July_2018.jpg", profession: "Wrestler & actor", region: "Sports", star: "A wrestling megastar whose never-give-up mantra transcended the ring into Hollywood." },
  { month: 4, day: 23, name: "William Shakespeare", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/330px-Shakespeare.jpg", profession: "Playwright & poet", region: "Global", star: "The Bard, whose words gave the English language more than a thousand phrases." },
  { month: 4, day: 25, name: "Renée Zellweger", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ren%C3%A9e_Zellweger_Berlinale_2010_%28cropped%29.jpg/330px-Ren%C3%A9e_Zellweger_Berlinale_2010_%28cropped%29.jpg", profession: "Actor", region: "Hollywood", star: "An Oscar-winning actress whose transformations are the stuff of legend." },

  // ---- May ----
  { month: 5, day: 2, name: "The Rock", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Dwayne_%22The_Rock%22_Johnson_at_the_2024_BAFTA%27s_%28cropped%29.jpg/330px-Dwayne_%22The_Rock%22_Johnson_at_the_2024_BAFTA%27s_%28cropped%29.jpg", profession: "Wrestler & actor", region: "Sports", star: "From People's Champion to global superstar, the rock that lifted an entire genre of entertainment.", wiki: "Dwayne_Johnson" },
  { month: 5, day: 4, name: "Audrey Hepburn", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/AudreyKHepburn.jpg/330px-AudreyKHepburn.jpg", profession: "Actor", region: "Hollywood", star: "An eternal style icon whose elegance and humanitarian heart still shine." },
  { month: 5, day: 6, name: "George Clooney", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/George_Clooney_Jay_Kelly-19_%28cropped%29.jpg/330px-George_Clooney_Jay_Kelly-19_%28cropped%29.jpg", profession: "Actor & director", region: "Hollywood", star: "Hollywood's smoothest operator, equally at home behind the camera and in humanitarian work." },
  { month: 5, day: 14, name: "Cate Blanchett", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Cate_Blanchett-63298_%28cropped_2%29.jpg/330px-Cate_Blanchett-63298_%28cropped_2%29.jpg", profession: "Actor", region: "Hollywood", star: "A chameleon of the craft whose range seems without limit." },
  { month: 5, day: 21, name: "MrBeast", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/MrBeast_in_2026_%28cropped_4%29.png/330px-MrBeast_in_2026_%28cropped_4%29.png", profession: "Creator & philanthropist", region: "Global", star: "The world's biggest creator, turning spectacle into massive acts of giving." },
  { month: 5, day: 27, name: "Paul Bettany", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/PaulBettany-byPhilipRomano.jpg/330px-PaulBettany-byPhilipRomano.jpg", profession: "Actor", region: "Hollywood", star: "The voice and soul behind the Vision, equal parts intellect and heart." },

  // ---- June ----
  { month: 6, day: 3, name: "Tom Holland", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/TomHolland-byPhilipRomano.jpg/330px-TomHolland-byPhilipRomano.jpg", profession: "Actor", region: "Hollywood", star: "An agile young star whose charm swung a generation into a new era of superheroes." },
  { month: 6, day: 7, name: "Tom Hanks", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/TomHanksPrincEdw031223_%2811_of_41%29_%28cropped%29.jpg/330px-TomHanksPrincEdw031223_%2811_of_41%29_%28cropped%29.jpg", profession: "Actor", region: "Hollywood", star: "America's dad, whose warmth and craftsmanship made him one of the most beloved actors alive." },
  { month: 6, day: 13, name: "Chris Evans", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Chris_Evans_at_the_2025_Toronto_International_Film_Festival_%28cropped%29.jpg/330px-Chris_Evans_at_the_2025_Toronto_International_Film_Festival_%28cropped%29.jpg", profession: "Actor", region: "Hollywood", star: "The actor who made 'America's ass' a cultural icon with genuine heart.", wiki: "Chris_Evans_(actor)" },
  { month: 6, day: 22, name: "Meryl Streep", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Meryl_Streep-_Press_conference_for_the_film_%22The_Devil_Wears_Prada_2%22_-_55194765350_%28cropped1%29.jpg/330px-Meryl_Streep-_Press_conference_for_the_film_%22The_Devil_Wears_Prada_2%22_-_55194765350_%28cropped1%29.jpg", profession: "Actor", region: "Hollywood", star: "The most celebrated actress of her generation, with a mastery that seems effortless." },
  { month: 6, day: 27, name: "Tobey Maguire", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Tobey_Maguire_2014.jpg/330px-Tobey_Maguire_2014.jpg", profession: "Actor", region: "Hollywood", star: "The original wall-crawler whose earnestness launched a superhero era." },

  // ---- July ----
  { month: 7, day: 3, name: "Tom Cruise", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Tom_Cruise_at_53rd_Saturn_Awards_2026-01.jpg/330px-Tom_Cruise_at_53rd_Saturn_Awards_2026-01.jpg", profession: "Actor", region: "Hollywood", star: "A daredevil star who performs his own stunts and refuses to slow down." },
  { month: 7, day: 8, name: "Sofia Vergara", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Sof%C3%ADa_Vergara_2019_by_Glenn_Francis.jpg/330px-Sof%C3%ADa_Vergara_2019_by_Glenn_Francis.jpg", profession: "Actor", region: "Hollywood", star: "A comedic tour de force whose larger-than-life presence lights up every scene." },
  { month: 7, day: 13, name: "Harrison Ford", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Harrison_Ford_-_Televerse_2025-03.jpg/330px-Harrison_Ford_-_Televerse_2025-03.jpg", profession: "Actor", region: "Hollywood", star: "The rugged hero of the blockbuster era, from Han Solo to Indiana Jones." },
  { month: 7, day: 18, name: "Nelson Mandela", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/330px-Nelson_Mandela_1994.jpg", profession: "Statesman", region: "Global", star: "A global leader whose forgiveness turned a prison sentence into a nation's freedom." },
  { month: 7, day: 25, name: "Matt LeBlanc", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Matt_LeBlanc%2C_Arqiva_British_Academy_Television_Awards%2C_2013.jpg/330px-Matt_LeBlanc%2C_Arqiva_British_Academy_Television_Awards%2C_2013.jpg", profession: "Actor", region: "Hollywood", star: "A sitcom legend whose humor made friendship a global religion." },
  { month: 7, day: 26, name: "Sandra Bullock", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Sandra_Bullock_at_The_Egyptian_Theatre_2024.jpg/330px-Sandra_Bullock_at_The_Egyptian_Theatre_2024.jpg", profession: "Actor", region: "Hollywood", star: "An Oscar-winning actress equally brilliant in comedy and drama." },
  { month: 7, day: 31, name: "J. K. Rowling", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/330px-J._K._Rowling_2010.jpg", profession: "Author", region: "Global", star: "The author who conjured a world of magic that captivated an entire generation.", wiki: "J._K._Rowling" },

  // ---- August ----
  { month: 8, day: 5, name: "Neil Armstrong", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Neil_Armstrong_pose.jpg/330px-Neil_Armstrong_pose.jpg", profession: "Astronaut", region: "Global", star: "The first human to set foot on the Moon — a small step that became a giant leap for all." },
  { month: 8, day: 7, name: "David Duchovny", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/David_Duchovny_-_LATFOB_2026-02.jpg/330px-David_Duchovny_-_LATFOB_2026-02.jpg", profession: "Actor", region: "Hollywood", star: "The truth-seeking agent whose deadpan intensity defined the paranormal drama." },
  { month: 8, day: 16, name: "Madonna", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MadonnaO2171023_%2897_of_133%29_%2853269593787%29_%28cropped%29.jpg/330px-MadonnaO2171023_%2897_of_133%29_%2853269593787%29_%28cropped%29.jpg", profession: "Singer", region: "Global", star: "The Queen of Pop, a chameleon who reinvented popular music for four decades." },
  { month: 8, day: 24, name: "Rupert Grint", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Rupert_Grint_at_Berlin_Film_Festival_2026%2C_%28P1230675%29_%28cropped2%29.jpg/330px-Rupert_Grint_at_Berlin_Film_Festival_2026%2C_%28P1230675%29_%28cropped2%29.jpg", profession: "Actor", region: "Hollywood", star: "The loyal redhead who made every young reader wish for a magical best friend." },
  { month: 8, day: 29, name: "Michael Jackson", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg/330px-Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg", profession: "Singer", region: "Global", star: "The King of Pop, whose music and movement defined an era of spectacle." },

  // ---- September ----
  { month: 9, day: 1, name: "Jungkook", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Jung_Kook_of_BTS%2C_February_12%2C_2026_%281%29.png/330px-Jung_Kook_of_BTS%2C_February_12%2C_2026_%281%29.png", profession: "Singer", region: "K-Pop", star: "The golden maknae of BTS, an all-round performer whose voice carries worldwide." },
  { month: 9, day: 3, name: "Charlie Sheen", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Charlie_Sheen_March_2009.JPG/330px-Charlie_Sheen_March_2009.JPG", profession: "Actor", region: "Hollywood", star: "A brash comedic icon whose rapid-fire charisma defined an era of blockbuster comedy." },
  { month: 9, day: 3, name: "Shaun White", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Shaun_White_in_2018_181222-D-PB383-014_%2846423162561%29_%28cropped%29.jpg/330px-Shaun_White_in_2018_181222-D-PB383-014_%2846423162561%29_%28cropped%29.jpg", profession: "Snowboarder", region: "Sports", star: "The three-time Olympic champion who redefined what a board can do in the halfpipe." },
  { month: 9, day: 3, name: "Garrett Hedlund", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Garrett_Hedlund_by_Gage_Skidmore_2.jpg/330px-Garrett_Hedlund_by_Gage_Skidmore_2.jpg", profession: "Actor", region: "Hollywood", star: "A rugged leading man equally at home in westerns, epics and road-trip romances." },
  { month: 9, day: 4, name: "Beyoncé", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beyonc%C3%A9_-_Tottenham_Hotspur_Stadium_-_1st_June_2023_%2810_of_118%29_%2852946364598%29_%28best_crop%29.jpg/330px-Beyonc%C3%A9_-_Tottenham_Hotspur_Stadium_-_1st_June_2023_%2810_of_118%29_%2852946364598%29_%28best_crop%29.jpg", profession: "Singer", region: "Global", star: "A once-in-a-generation artist whose voice, art and influence tower over pop culture." },
  { month: 9, day: 6, name: "Tim Roth", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Tim_Roth_by_Gage_Skidmore_2.jpg/330px-Tim_Roth_by_Gage_Skidmore_2.jpg", profession: "Actor", region: "Hollywood", star: "A fiercely independent actor prized for intensity and unpredictability." },
  { month: 9, day: 12, name: "RM", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/RM_at_W_Korea_Love_Your_W%2C_November_2023.jpg/330px-RM_at_W_Korea_Love_Your_W%2C_November_2023.jpg", profession: "Rapper & leader", region: "K-Pop", star: "The thoughtful leader of BTS whose words and artistry shape a generation.", wiki: "RM_(musician)" },
  { month: 9, day: 16, name: "Madeline Zima", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Madeline_Zima_Cinequest_2026_05.jpg/330px-Madeline_Zima_Cinequest_2026_05.jpg", profession: "Actor", region: "Hollywood", star: "A versatile performer who grew up on screen with grace." },
  { month: 9, day: 21, name: "Stephen King", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Stephen_King_at_the_2024_Toronto_International_Film_Festival_2_%28cropped%29.jpg/330px-Stephen_King_at_the_2024_Toronto_International_Film_Festival_2_%28cropped%29.jpg", profession: "Author", region: "Global", star: "The master of horror who finds the everyday terror lurking beneath the surface." },
  { month: 9, day: 28, name: "Naomi Watts", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Naomi_Watts_at_the_2024_New_York_Film_Festival_2_%28cropped%29.jpg/330px-Naomi_Watts_at_the_2024_New_York_Film_Festival_2_%28cropped%29.jpg", profession: "Actor", region: "Hollywood", star: "An actress of luminous vulnerability, equally at home in drama and suspense." },
  { month: 9, day: 30, name: "Baifern Pimchanok", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Baifern_Pimchanok_%40_A_Tale_Of_Ylang_Ylang.png/330px-Baifern_Pimchanok_%40_A_Tale_Of_Ylang_Ylang.png", profession: "Actor", region: "Thai", star: "A beloved Thai actress whose roles made her a household name across Asia." },

  // ---- October ----
  { month: 10, day: 2, name: "Gandhi", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/330px-Mahatma-Gandhi%2C_studio%2C_1931.jpg", profession: "Political leader", region: "Global", star: "A leader whose philosophy of non-violence moved a nation and the world." },
  { month: 10, day: 8, name: "Matt Damon", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/MattDamon-byPhilipRomano2.jpg/330px-MattDamon-byPhilipRomano2.jpg", profession: "Actor", region: "Hollywood", star: "A leading man and writer whose intelligence anchors every role." },
  { month: 10, day: 14, name: "Ralph Lauren", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Ralph_Lauren_2013.jpg/330px-Ralph_Lauren_2013.jpg", profession: "Fashion designer", region: "Global", star: "A designer who built an American fashion empire on timeless elegance." },
  { month: 10, day: 13, name: "Jimin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Jimin_on_the_way_to_SBS_Radio%2C_31_March_2023_%282%29.jpg/330px-Jimin_on_the_way_to_SBS_Radio%2C_31_March_2023_%282%29.jpg", profession: "Singer", region: "K-Pop", star: "A BTS star whose fluid grace and tender vocals soften the loudest of stages." },
  { month: 10, day: 22, name: "Ryan Reynolds", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Deadpool_2_Japan_Premiere_Red_Carpet_Ryan_Reynolds_%28cropped%29.jpg/330px-Deadpool_2_Japan_Premiere_Red_Carpet_Ryan_Reynolds_%28cropped%29.jpg", profession: "Actor", region: "Hollywood", star: "A quick-witted leading man whose self-aware humor broke the fourth wall worldwide." },
  { month: 10, day: 25, name: "Katy Perry", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Katy_Perry_2026_Tribeca_Film_Festival_%28cropped_1%29.jpg/330px-Katy_Perry_2026_Tribeca_Film_Festival_%28cropped_1%29.jpg", profession: "Singer", region: "Global", star: "A pop showwoman whose kaleidoscopic style fills stadiums worldwide." },

  // ---- November ----
  { month: 11, day: 2, name: "Kendall Jenner", image: "https://upload.wikimedia.org/wikipedia/commons/5/54/Kendall_Jenner_for_Adanola_2_%28cropped%29.jpg", profession: "Model", region: "Global", star: "A supermodel whose effortless cool defined a new generation of fashion." },
  { month: 11, day: 9, name: "Carl Sagan", image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Carl_Sagan_Planetary_Society.JPG", profession: "Astronomer", region: "Global", star: "The astronomer who made the cosmos feel personal and infinitely wondrous." },
  { month: 11, day: 7, name: "Marie Curie", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/330px-Marie_Curie_c._1920s.jpg", profession: "Physicist & chemist", region: "Global", star: "The pioneer of radioactivity whose persistence won two Nobel Prizes across two sciences.", wiki: "Marie_Curie" },
  { month: 11, day: 11, name: "Leonardo DiCaprio", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/LeoPTABFI191125-28_%28cropped%29.jpg/330px-LeoPTABFI191125-28_%28cropped%29.jpg", profession: "Actor", region: "Hollywood", star: "An actor of restless ambition and a dedicated advocate for the planet." },
  { month: 11, day: 17, name: "Sophie Marceau", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Sophie_Marceau_Cabourg_2012.jpg/330px-Sophie_Marceau_Cabourg_2012.jpg", profession: "Actor", region: "Global", star: "A French screen icon whose elegance spans the Atlantic." },
  { month: 11, day: 22, name: "Scarlett Johansson", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Scarlett_Johansson-8588.jpg/330px-Scarlett_Johansson-8588.jpg", profession: "Actor", region: "Hollywood", star: "A versatile star equally commanding in comic blockbusters and intimate drama." },

  // ---- December ----
  { month: 12, day: 3, name: "Ozzy Osbourne", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ozzy_Osbourne_in_1970_%28medium-sized_crop%29.jpg/330px-Ozzy_Osbourne_in_1970_%28medium-sized_crop%29.jpg", profession: "Singer", region: "Global", star: "The Prince of Darkness, a rock legend who turned chaos into anthems." },
  { month: 12, day: 4, name: "Jin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/BTS_Jin_at_Maison_Fred%2C_13_March_2025_04.png/330px-BTS_Jin_at_Maison_Fred%2C_13_March_2025_04.png", profession: "Singer", region: "K-Pop", star: "The gentle eldest of BTS, whose warmth and vocals open the door to stardom.", wiki: "Jin_(singer)" },
  { month: 12, day: 4, name: "Mario Maurer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Mario_Maurer_in_May_2024.png/330px-Mario_Maurer_in_May_2024.png", profession: "Actor", region: "Thai", star: "A Thai cinema heartthrob whose charm made him a continental sensation." },
  { month: 12, day: 10, name: "Emily Dickinson", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Black-white_photograph_of_Emily_Dickinson2.png/330px-Black-white_photograph_of_Emily_Dickinson2.png", profession: "Poet", region: "Global", star: "A reclusive poet whose inward worlds became timeless verses." },
  { month: 12, day: 16, name: "Arthur C. Clarke", image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Arthur_C._Clarke_1965_%28cropped%29.jpg", profession: "Writer & futurist", region: "Global", star: "A visionary who imagined space and intelligence with prophetic clarity." },
  { month: 12, day: 30, name: "V", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/BTS%27s_V_20251004_04.jpg/330px-BTS%27s_V_20251004_04.jpg", profession: "Singer", region: "K-Pop", star: "The soulful vocalist and visual of BTS, beloved for depth beyond the spotlight.", wiki: "V_(singer)" },
];

import { SUPPLEMENTARY_POOL, type SupplementaryCelebrity } from "./celebrity-pool";

const CELEBRITIES: Celebrity[] = C.map((c) => ({
  ...c,
  url: `https://en.wikipedia.org/wiki/${c.wiki ?? c.name.replace(/ /g, "_")}`,
}));

/**
 * Deterministic hash: given a month, day, and index, produces a stable
 * non-negative integer.  Uses a simple multiplicative hash so the same
 * inputs always yield the same output regardless of runtime.
 */
function dateHash(month: number, day: number, index: number): number {
  let h = 2166136261;
  h = (h ^ month) >>> 0;
  h = Math.imul(h, 16777619);
  h = (h ^ day) >>> 0;
  h = Math.imul(h, 16777619);
  h = (h ^ index) >>> 0;
  h = Math.imul(h, 16777619);
  return h >>> 0;
}

/**
 * Convert a SupplementaryCelebrity into a full Celebrity with a generated URL.
 */
function supplementToCelebriant(s: SupplementaryCelebrity): Celebrity {
  return {
    ...s,
    url: `https://en.wikipedia.org/wiki/${s.name.replace(/ /g, "_")}`,
  };
}

/**
 * Diversity-preserving selection: picks `count` items from `pool` using a
 * deterministic hash, trying to balance across regions and professions.
 */
function diversitySelect(
  month: number,
  day: number,
  pool: SupplementaryCelebrity[],
  count: number,
): SupplementaryCelebrity[] {
  if (pool.length <= count) return pool;

  const selected: SupplementaryCelebrity[] = [];
  const usedIndices = new Set<number>();
  const usedRegions = new Set<string>();
  const usedProfessions = new Set<string>();

  // Try to get one from each region first (priority pass)
  const regions: CelebrityRegion[] = [
    "Hollywood",
    "Bollywood",
    "K-Pop",
    "Thai",
    "Sports",
    "Global",
  ];
  for (const region of regions) {
    if (selected.length >= count) break;
    const candidates = pool
      .map((entry, i) => ({ entry, i }))
      .filter(
        ({ entry, i }) =>
          entry.region === region && !usedIndices.has(i),
      );
    if (candidates.length > 0) {
      const pick =
        candidates[dateHash(month, day, selected.length) % candidates.length];
      selected.push(pick.entry);
      usedIndices.add(pick.i);
      usedRegions.add(region);
      usedProfessions.add(pick.entry.profession);
    }
  }

  // Fill remaining slots via shuffled round-robin
  let offset = 0;
  while (selected.length < count) {
    const idx =
      dateHash(month, day, 1000 + offset) % pool.length;
    offset++;
    if (usedIndices.has(idx)) continue;
    const entry = pool[idx];
    // Prefer entries from under-represented regions/professions
    if (
      usedRegions.size < regions.length &&
      usedRegions.has(entry.region) &&
      usedProfessions.has(entry.profession)
    ) {
      // skip if we can still diversify
      if (offset < pool.length * 2) continue;
    }
    selected.push(entry);
    usedIndices.add(idx);
    usedRegions.add(entry.region);
    usedProfessions.add(entry.profession);
  }

  return selected;
}

/**
 * Everyone born on the given month/day only.
 *
 * Strict date filtering: matches are pulled from the primary list plus the
 * same-date entries of the supplementary pool. Entries from other dates are
 * never surfaced, so a visitor on any day always sees people who genuinely
 * share that birthday.
 */
export function celebritiesForDate(month: number, day: number): Celebrity[] {
  const primary = CELEBRITIES.filter((c) => c.month === month && c.day === day);

  if (primary.length >= 6) return primary;

  // Exclude primary slugs and names from supplementary candidates to avoid duplicates
  const primarySlugs = new Set(
    primary.map((c) => c.wiki ?? c.name.replace(/ /g, "_")),
  );
  const usedNames = new Set(primary.map((c) => c.name.toLowerCase()));
  const slug = (s: SupplementaryCelebrity) => s.name.replace(/ /g, "_");

  // Same-date supplementary entries only.
  const datePool = SUPPLEMENTARY_POOL.filter(
    (s) =>
      s.month === month &&
      s.day === day &&
      !primarySlugs.has(slug(s)) &&
      !usedNames.has(s.name.toLowerCase()),
  );

  const slots = 6 - primary.length;
  const picked = diversitySelect(
    month,
    day,
    datePool,
    Math.min(slots, datePool.length),
  );

  return [...primary, ...picked.map(supplementToCelebriant)];
}

export function regionsPresent(): CelebrityRegion[] {
  const set = new Set<CelebrityRegion>();
  for (const c of CELEBRITIES) set.add(c.region);
  return Array.from(set);
}

export type CelebrityIndustry =
  | "Acting"
  | "Music"
  | "Sports"
  | "Wrestling"
  | "Literature"
  | "Science";

const INDUSTRY_MATCH: Record<CelebrityIndustry, RegExp> = {
  Acting: /actor|actress|model|filmmaker|director/i,
  Music: /sing|rapper|composer|music|rap|pop|soul|rock|idol|vocal|producer/i,
  Sports: /sport|basketball|football|snowboard|racer|baseball|tennis|soccer|athlet|box|cricket|golf|swim/i,
  Wrestling: /wrestl/i,
  Literature: /author|writer|poet|novel|playwright/i,
  Science: /physicist|astronomer|astronaut|scientist|engineer|chemist|inventor/i,
};

/** Every industry that at least one celebrity in the hub represents. */
export function industriesPresent(): CelebrityIndustry[] {
  return (Object.keys(INDUSTRY_MATCH) as CelebrityIndustry[]).filter((industry) =>
    CELEBRITIES.some((c) => INDUSTRY_MATCH[industry].test(c.profession)),
  );
}
