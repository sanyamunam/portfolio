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
  /** The mess distilled into 3-4 short shards for the stage's fragment stack. */
  fragments: string[];
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
    fragments: ["Her Highness’s office.", "Every decision examined.", "“Good enough” wasn’t.", "Many rooms, many opinions."],
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
    fragments: ["A full revamp to win.", "No screens to show.", "Only thinking."],
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
    fragments: ["The international FIBA stage.", "A site that didn’t match it.", "Fans, officials — all watching."],
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
    fragments: ["A national utility.", "Website, app, enterprise systems.", "Different eras, no shared language.", "The messiest it gets."],
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
      kicker: "Guide · Designing with AI",
      title: "Prompt Playbook",
      body: "A read-it-once playbook for writing prompts that generate client-ready UI — written because I got tired of explaining it one designer at a time.",
      href: "/prompt-playbook.html",
    },
    {
      kicker: "Reference · In the making",
      title: "Laws of UX",
      body: "My running collection of the principles I keep reaching for — mostly so I stop quoting them from memory and getting them slightly wrong.",
      comingSoon: true,
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

export const ABOUT = {
  originQuestion: "Who taught you to see like this?",
  moments: [
    {
      glyph: "workshop" as const,
      title: "A workshop.",
      body: "My first design-thinking workshop. A room full of people who disagreed about everything — and a wall of sticky notes that slowly changed their minds. I walked out rearranged.",
    },
    {
      glyph: "phone" as const,
      title: "An app.",
      body: "Watching my dad use Google Pay for the first time. Two taps, and delight on his face. That’s when I felt what a really good interface can do to a person.",
    },
    {
      glyph: "book" as const,
      title: "A book.",
      body: "The Steve Jobs biography. It made me realise design isn’t decoration — it’s central to whether a product succeeds, and in turn the company behind it.",
    },
  ],
  bridge: "Mostly, I just love figuring out people.",
  practiceQuestion: "So… what do you actually do?",
  answer:
    "I untangle complicated things — products, teams, decisions — and stay with the mess until it makes sense to everyone. People call that UX strategy. I call it listening, drawing, and asking “why” once more than is polite.",
  mapStages: ["Listen", "Untangle", "Align", "Ship"],
  mapNodes: [
    { id: "stakeholders", label: "14 stakeholders", stage: 0 },
    { id: "interviews", label: "user interviews", stage: 0 },
    { id: "complaints", label: "support tickets", stage: 0 },
    { id: "vendors", label: "3 vendors", stage: 1 },
    { id: "legacy", label: "legacy systems", stage: 1 },
    { id: "kpis", label: "conflicting KPIs", stage: 1 },
    { id: "owner", label: "no single owner", stage: 2 },
    { id: "workshop", label: "one workshop", stage: 2 },
    { id: "decision", label: "one decision", stage: 2 },
    { id: "roadmap", label: "a roadmap", stage: 3 },
    { id: "design-system", label: "a design system", stage: 3 },
    { id: "ship", label: "something shipped", stage: 3 },
  ],
  replayLabel: "make it messy again",
};

export const BENTO = {
  question: "How do you handle the messy middle?",
  anchor: {
    kicker: "The practical list",
    title: "Five disciplines, one loop.",
    body: "I don’t hand off between these. I carry the same problem through all five — that’s the whole trick.",
  },
  domains: [
    {
      domain: "Discovery",
      belief:
        "Fall in love with the problem before anyone mentions solutions. The first version of the problem is almost never the real one.",
      skills: ["UX Research", "Requirement Gathering", "Information Architecture"],
    },
    {
      domain: "Strategy",
      belief: "A strategy you can’t sketch on a whiteboard isn’t a strategy. It’s a document.",
      skills: ["UX Strategy", "Product Thinking", "Design Thinking"],
    },
    {
      domain: "Alignment",
      belief:
        "Alignment isn’t agreement. It’s everyone understanding the same thing well enough to argue productively.",
      skills: ["Stakeholder Workshops", "Client Communication", "Facilitation"],
    },
    {
      domain: "Leadership & Ops",
      belief:
        "Teams do their best work when the process disappears. Design ops is making the machine so quiet nobody notices it running.",
      skills: ["Managing Design Teams", "Design Operations", "Design Systems"],
    },
    {
      domain: "AI & Systems",
      belief:
        "AI doesn’t replace the thinking. It replaces the waiting between thoughts — I design workflows where it does exactly that.",
      skills: ["AI-assisted Product Design", "AI Workflow Design", "Digital Transformation"],
    },
  ],
};

export const WORKBENCH = {
  question: "And what do you make when nobody’s paying you?",
  intro: "Side projects are how I figure out what I actually think. Two I’m fond of:",
  playbook: {
    kicker: "Guide · Designing with AI",
    title: "Prompt Playbook",
    body: "A read-it-once playbook for writing prompts that generate client-ready UI — written because I got tired of explaining it one designer at a time.",
    href: "/prompt-playbook.html",
    chromeLabel: "prompt-playbook.html",
    cta: "Open the playbook",
    typewriter: [
      "Act as a senior product designer…",
      "Generate a client-ready dashboard…",
      "Refine the empty state copy…",
      "Audit this flow for friction…",
    ],
  },
  wip: {
    kicker: "Reference · In the making",
    title: "Laws of UX",
    body: "My running collection of the principles I keep reaching for — mostly so I stop quoting them from memory and getting them slightly wrong.",
    note: "still on the workbench — coming soon",
    laws: ["Hick’s Law", "Fitts’s Law", "Jakob’s Law", "Miller’s Law", "Peak–End Rule", "Aesthetic–Usability Effect"],
  },
  aside: {
    kicker: "Quietly proud of",
    text: "I keep a list of features I’ve talked teams out of building. It’s some of my best work.",
    strikes: ["a chatbot nobody asked for", "a nine-field signup form", "a dashboard for the dashboard"],
  },
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
