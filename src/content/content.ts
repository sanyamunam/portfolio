export type CaseMedia = {
  mp4: string;
  webm: string;
  poster: string;
  href: string;
};

export type CaseStudy = {
  id: string;
  n: string;
  client: string;
  tag: string;
  url: string;
  /** Peak light temperature of this case's valley (2 = wine, 3 = jet). */
  depth: number;
  mess: string;
  turn: string;
  resolution: string;
  outcome: string;
  media?: CaseMedia;
};

export const GREETING = {
  label: "Sanya Munam — UX Strategy & Design Operations · Doha",
  hello: "Hi. I’m Sanya.",
  premise:
    "You probably have questions. Good — questions are how I make a living.",
  cue: "go on, ask",
};

export const WHAT_I_DO = {
  question: "So… what do you actually do?",
  answer: [
    "I untangle complicated things. Products with too many stakeholders. Teams with too many opinions. Systems nobody fully understands anymore.",
    "I sit with the mess until it makes sense — then I make sure it makes sense to everyone else. People call that UX strategy. I mostly call it listening, drawing, and asking “why” one more time than is polite.",
  ],
  brief: {
    heading: "In a hurry? The short version.",
    name: "Sanya Munam",
    roles: ["UX Consultant", "UX Strategist", "UX Lead", "Design Operations Lead"],
    base: "Doha, Qatar",
    focus: [
      "UX strategy",
      "Discovery & research",
      "Stakeholder alignment",
      "Design ops & teams",
      "AI-assisted design",
      "Digital transformation",
    ],
  },
};

export const WORK = {
  question: "What does that look like in real life?",
  intro:
    "A few real ones. Fair warning: they all start in the dark — that’s where the interesting problems live.",
};

export const CASES: CaseStudy[] = [
  {
    id: "qf",
    n: "01",
    client: "Qatar Foundation",
    tag: "Design Lead · Government & Education",
    url: "qf.org.qa",
    depth: 2.4,
    mess: "A flagship initiative under Her Highness’s office. Every decision examined at the highest level — many rooms, many opinions, and a bar where “good enough” simply wasn’t.",
    turn: "I led the design direction: translating a high-level vision into a coherent, defensible experience that stakeholders could stand behind — and keep standing behind when the scrutiny arrived.",
    resolution: "A design that met the standard its patronage demanded, delivered under intense visibility.",
    outcome: "Held the highest bar in the room",
  },
  {
    id: "qu",
    n: "02",
    client: "Qatar University",
    tag: "UX Strategy · Presales · Higher Education",
    url: "qu.edu.qa",
    depth: 1.6,
    mess: "The university needed a full website revamp — and we had to win the work before a single screen existed. Nothing to show. Only thinking.",
    turn: "I built the UX strategy for the pitch: a clear, opinionated point of view on the experience — strong enough to be the deliverable itself.",
    resolution: "We won the project.",
    outcome: "Strategy won the room",
  },
  {
    id: "qbf",
    n: "03",
    client: "Qatar Basketball Federation",
    tag: "UX Strategy · Sport (FIBA)",
    url: "qbf.qa",
    depth: 2.0,
    mess: "A federation playing on the international FIBA stage, with a web presence that no longer matched its standing. Fans, officials, and international expectations — all watching.",
    turn: "I led the strategy and redesign, restructuring the experience around what fans and the federation actually needed from it — not what the old sitemap said.",
    resolution: "A revamped site fit for the federation’s profile. See for yourself — it’s live.",
    outcome: "Live on the international stage",
    media: {
      mp4: "/media/qbf-hero.mp4",
      webm: "/media/qbf-hero.webm",
      poster: "/media/qbf-hero-poster.jpg",
      href: "https://www.qatarbasketball.qa/",
    },
  },
  {
    id: "kahramaa",
    n: "04",
    client: "Kahramaa",
    tag: "UX Strategy · National Utility (Public + Enterprise)",
    url: "km.qa",
    depth: 3,
    mess: "Qatar’s national water & electricity authority. A public website, a mobile app, and a tangle of internal enterprise systems — each built in a different era, none speaking the same language. This is the messiest it gets.",
    turn: "I led UX strategy across the entire portfolio, bringing one coherent standard to citizens, employees, and everything in between.",
    resolution: "A unified experience across a national utility — public to enterprise.",
    outcome: "One standard, portfolio-wide",
  },
];

export const MESSY_MIDDLE = {
  question: "How do you handle the messy middle?",
  beliefs: [
    {
      domain: "Discovery",
      statement:
        "Fall in love with the problem before anyone mentions solutions. The first version of the problem is almost never the real one.",
    },
    {
      domain: "Strategy",
      statement:
        "A strategy you can’t sketch on a whiteboard isn’t a strategy. It’s a document.",
    },
    {
      domain: "Alignment",
      statement:
        "Alignment isn’t agreement. It’s everyone understanding the same thing well enough to argue productively.",
    },
    {
      domain: "Leadership & Ops",
      statement:
        "Teams do their best work when the process disappears. Design ops is making the machine so quiet nobody notices it running.",
    },
    {
      domain: "AI & Systems",
      statement:
        "AI doesn’t replace the thinking. It replaces the waiting between thoughts — I design workflows where it does exactly that.",
    },
  ],
  skillsHeading: "The practical list",
  skillsIntro: "For the scanners — no hard feelings, I skim too.",
  skills: [
    {
      group: "Strategy & Thinking",
      items: ["UX Strategy", "Product Thinking", "Design Thinking", "Digital Transformation"],
    },
    {
      group: "Research & Discovery",
      items: ["UX Research", "Requirement Gathering", "Information Architecture"],
    },
    {
      group: "People & Rooms",
      items: ["Stakeholder Workshops", "Client Communication", "Facilitation"],
    },
    {
      group: "Teams & Ops",
      items: ["Managing Design Teams", "Design Operations", "Design Systems"],
    },
    {
      group: "AI",
      items: ["AI-assisted Product Design", "AI Workflow Design"],
    },
  ],
};

export const STORY = {
  question: "Who taught you to see like this?",
  moments: [
    {
      title: "A workshop.",
      body: "My first design-thinking workshop. A room full of people who disagreed about everything — and a wall of sticky notes that slowly changed their minds. I walked out rearranged.",
    },
    {
      title: "An app.",
      body: "Watching my dad use Google Pay for the first time. Two taps, and delight on his face. Somebody had thought about him without ever meeting him. I wanted to be that somebody.",
    },
    {
      title: "A book.",
      body: "The Steve Jobs biography. Not the myth — the obsession. The idea that caring about details nobody sees is the whole job.",
    },
  ],
  close: "Mostly, I just love figuring out people.",
};

export const PLAYGROUND = {
  question: "And what do you make when nobody’s paying you?",
  intro: "Side projects are how I figure out what I actually think. A couple I’m fond of:",
  items: [
    {
      kicker: "Guide · AI workflows",
      title: "AI Prompt Guide",
      body: "A practical guide to getting real work out of AI — written because I got tired of explaining it one designer at a time.",
      href: "/ai-prompt-guide.html",
    },
    {
      kicker: "Reference · For the team",
      title: "Laws of UX",
      body: "My running collection of the principles I keep reaching for — mostly so I stop quoting them from memory and getting them slightly wrong.",
    },
  ],
  aside: {
    kicker: "Quietly proud of",
    text: "I keep a list of features I’ve talked teams out of building. It’s some of my best work.",
  },
};

export const INVITATION = {
  question: "Got a wonderfully complicated problem?",
  answer:
    "My turn to ask. I’d genuinely love to hear it — the messier the better. Bring the version with all the stakeholders still attached.",
  cta: "Tell me about it",
  email: "sanyamunam95@gmail.com",
  footer: "Sanya Munam · Doha · replies within a day",
};

export const BEATS = [
  { id: "hello", label: "Hello" },
  { id: "what", label: "What I do" },
  { id: "work", label: "Real life" },
  { id: "how", label: "The messy middle" },
  { id: "story", label: "How I learned to see" },
  { id: "play", label: "Playground" },
  { id: "talk", label: "Say hello" },
] as const;
