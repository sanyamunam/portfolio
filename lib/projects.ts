export type Project = {
  slug: string;
  index: string;
  client: string;
  title: string;
  year: string;
  role: string;
  sector: string;
  /* No public copy yet — listed but not clickable */
  disabled?: boolean;
  /* Work-grid thumbnail: a looping snippet or still of the platform */
  cardMedia?: { type: 'video' | 'image'; src: string };
  /* Color specimen identity — the dyslove.design color-card motif */
  specimen: {
    name: string;
    hex: string;
    rgb: string;
    cmyk: string;
  };
  overview: string;
  /* Three-act story — lead is the scannable takeaway, text is the support */
  chapters: { label: string; lead: string; text: string }[];
  stats: { value: string; label: string }[];
  /* Optional real-case media */
  clientLogo?: string;
  video?: string;
  videoCaption?: string;
  partner?: { name: string; logo: string };
  /* Real cases: scannable brief (replaces the color-specimen plate) + live link */
  snapshot?: { label: string; value: string }[];
  liveUrl?: string;
  /* Real cases: standfirst heading above the overview paragraph */
  overviewHeading?: string;
  /* Real cases not yet shipped: renders a "coming soon" showcase plate */
  comingSoon?: boolean;
  /* Real cases: artifact strip (process work or photography).
     processLead is a featured wide shot shown before the strip;
     processTitle/processNote override the default section header. */
  processLead?: { src: string; caption: string; meta: string };
  process?: { src: string; caption: string; w: number }[];
  processTitle?: string;
  processNote?: string;
};

const projectList: Project[] = [
  {
    slug: 'qatar-university',
    index: '04',
    disabled: true,
    client: 'Qatar University',
    title: 'A campus that fits in your hand',
    year: '2023',
    role: 'UX Lead',
    sector: 'Education',
    specimen: { name: 'Wine Ash', hex: '#9D6B80', rgb: '157, 107, 128', cmyk: '0, 32, 18, 38' },
    overview:
      'Qatar University serves more than twenty-five thousand students across a sprawling campus — and a sprawl of disconnected portals to match. We consolidated registration, timetables, campus wayfinding and student services into one calm, bilingual digital campus.',
    chapters: [
      {
        label: 'The challenge',
        lead: 'Eleven portals, two languages, zero patience left.',
        text: 'Legacy systems built for desks served a student body that lived on phones. Every semester began with queues that had no reason to exist.',
      },
      {
        label: 'The approach',
        lead: 'Follow the student, not the org chart.',
        text: 'We shadowed students through a full registration cycle and rebuilt the journey around moments instead of departments — Arabic-first RTL designed in parallel, never mirrored as an afterthought.',
      },
      {
        label: 'The outcome',
        lead: 'Days of queuing became minutes on a phone.',
        text: 'A single sign-on campus companion, adopted by the entire undergraduate population within two semesters.',
      },
    ],
    stats: [
      { value: '25k+', label: 'Students served' },
      { value: '11 → 1', label: 'Portals consolidated' },
      { value: '92%', label: 'Task-success rate' },
    ],
  },
  {
    slug: 'qatar-basketball-federation',
    index: '01',
    cardMedia: { type: 'video', src: '/qbf-home.mp4' },
    client: 'Qatar Basketball Federation',
    title: 'A federation ready for the world stage',
    year: '2025',
    role: 'UX Strategy & Design Direction',
    sector: 'Sport',
    specimen: { name: 'Turquoise', hex: '#99E1D9', rgb: '153, 225, 217', cmyk: '32, 0, 4, 12' },
    clientLogo: '/qbf-logo.svg',
    video: '/qbf-home.mp4',
    videoCaption: 'The revamped QBF homepage',
    partner: { name: 'Microsoft Qatar', logo: '/microsoft-logo.svg' },
    liveUrl: 'https://www.qatarbasketball.qa/',
    overviewHeading: 'From national court to world stage.',
    processLead: {
      src: '/process/board.png',
      caption: 'The FigJam board — the whole redesign, thought out loud',
      meta: '234 artifacts · one board',
    },
    process: [
      { src: '/process/bench-icc.jpg', caption: 'Benchmarking — ICC’s fan experience', w: 200 },
      { src: '/process/bench-fantasy.jpg', caption: 'Benchmarking — live-game engagement', w: 420 },
      { src: '/process/bench-wnba.jpg', caption: 'Benchmarking — WNBA’s content engine', w: 560 },
      { src: '/process/concept-mascot.jpg', caption: 'Exploration — a matchday companion', w: 220 },
      { src: '/process/concept-schedules.jpg', caption: 'Concept — schedules, reimagined', w: 320 },
      { src: '/process/concept-home.jpg', caption: 'Concept — the new homepage', w: 300 },
    ],
    snapshot: [
      { label: 'Trigger', value: 'FIBA World Cup 2027' },
      { label: 'Mandate', value: 'National site → international stage' },
      { label: 'Role', value: 'UX strategy & design direction' },
      { label: 'Partner', value: 'Microsoft Qatar' },
      { label: 'Process', value: 'Benchmarking · Personas · Concept' },
    ],
    overview:
      'Qatar is hosting the FIBA World Cup 2027 — I led the UX strategy and directed the redesign that carried the federation’s digital home from a national site onto an international stage.',
    chapters: [
      {
        label: 'The challenge',
        lead: 'A local platform. A global deadline.',
        text: 'The existing site spoke only to a national audience while the federation prepared to welcome the world — and multiple high-stakes stakeholders had to align behind one direction before the redesign could move a single pixel.',
      },
      {
        label: 'The approach',
        lead: 'Evidence before pixels — benchmark, personas, then one concept.',
        text: 'We studied leading international federations, built personas spanning local fans, international followers, media and officials, and — working alongside Microsoft Qatar — distilled the research into a concept that won genuine enthusiasm across the table.',
      },
      {
        label: 'The outcome',
        lead: 'One concept, carried all the way to launch.',
        text: 'The revamped QBF website: elevated beyond its national audience, ready to represent Qatari basketball on the road to FIBA World Cup 2027.',
      },
    ],
    stats: [
      { value: '2027', label: 'The FIBA World Cup deadline that shaped it' },
      { value: '2', label: 'Audiences served — national & international' },
      { value: '01', label: 'Winning concept, carried through to launch' },
    ],
  },
  {
    slug: 'qatar-olympic-committee',
    index: '02',
    cardMedia: { type: 'image', src: '/process-qoc/board.png' },
    client: 'Qatar Olympic Committee',
    title: 'Preparing the stage for 2036',
    year: '2025',
    role: 'UX Lead — Design Direction',
    sector: 'Sport · Government',
    specimen: { name: 'Sienna', hex: '#D6B292', rgb: '214, 178, 146', cmyk: '0, 17, 32, 16' },
    clientLogo: '/qoc-logo.svg',
    comingSoon: true,
    partner: { name: 'Microsoft', logo: '/microsoft-logo.svg' },
    overviewHeading: 'The bid begins at home.',
    overview:
      'Qatar has put its name forward to host the 2036 Olympic Games — and a bid brings the world’s eyes with it. In partnership with Microsoft, I led the UX revamp of the QOC’s digital home to be ready for that spotlight, from research and wireframes through design direction for an incredible UI team.',
    snapshot: [
      { label: 'Trigger', value: 'Qatar’s bid to host the 2036 Games' },
      { label: 'Mandate', value: 'A digital home ready for world scrutiny' },
      { label: 'Role', value: 'UX Lead — design direction' },
      { label: 'Partner', value: 'Microsoft' },
      { label: 'Research', value: 'Benchmarking · Personas · Olympian interviews' },
      { label: 'Status', value: 'In development — launching soon' },
    ],
    processLead: {
      src: '/process-qoc/board.png',
      caption: 'The FigJam board — where the revamp was thought out loud',
      meta: '543 artifacts · one board',
    },
    process: [
      { src: '/process-qoc/bench-nz.jpg', caption: 'Benchmarking — how NOCs tell athlete stories', w: 220 },
      { src: '/process-qoc/bench-chile.jpg', caption: 'Benchmarking — international committees', w: 260 },
      { src: '/process-qoc/bench-saudi.jpg', caption: 'Benchmarking — regional neighbours', w: 500 },
      { src: '/process-qoc/archive-book.jpg', caption: 'Archive research — Qatar’s sporting history', w: 540 },
      { src: '/process-qoc/pain-points.jpg', caption: 'Research — key pain points, mapped', w: 440 },
      { src: '/process-qoc/bench-stats.jpg', caption: 'Benchmarking — stats & records patterns', w: 500 },
    ],
    chapters: [
      {
        label: 'The challenge',
        lead: 'When you bid for the Games, the world looks you up.',
        text: 'With Qatar putting its name forward for the 2036 Olympics, the committee’s dated platform risked telling the wrong story. The revamp was preparation — a digital home that could stand beside a bid.',
      },
      {
        label: 'The approach',
        lead: 'Ask the athletes — then draw.',
        text: 'In partnership with Microsoft, we benchmarked Olympic committees nationally and internationally, mapped personas in depth, and interviewed Team Qatar stars — including beach-volleyball Olympian Cherif Younousse. Only then did the wireframes begin, with design direction carried through an incredible UI team.',
      },
      {
        label: 'The outcome',
        lead: 'Redesigned end to end — ready for the spotlight.',
        text: 'The full QOC experience was revamped and is now in development. The reveal lands with the launch, on the road to 2036.',
      },
    ],
    stats: [
      { value: '2036', label: 'The Games Qatar is bidding to host' },
      { value: '2', label: 'Benchmark tracks — national & international' },
      { value: '1:1', label: 'Interviews with Team Qatar Olympians' },
    ],
  },
  {
    slug: 'almujadilah',
    index: '03',
    cardMedia: { type: 'video', src: '/almujadilah-home.mp4' },
    client: 'AlMujadilah',
    title: 'A mosque designed around her',
    year: '2022',
    role: 'Project Manager',
    sector: 'Culture · Community',
    specimen: { name: 'Orchid', hex: '#E5BDDF', rgb: '229, 189, 223', cmyk: '0, 18, 3, 10' },
    clientLogo: '/almujadilah-logo.svg',
    liveUrl: 'https://almujadilah.qa/en',
    video: '/almujadilah-home.mp4',
    videoCaption: 'almujadilah.qa — the live platform',
    overviewHeading: 'An initiative of Her Highness. Delivered.',
    overview:
      'AlMujadilah is a landmark mosque and education centre for women in Doha — an initiative of Her Highness Sheikha Moza bint Nasser, inaugurated in her presence. As Project Manager, I led its digital platform from design through development to go-live.',
    snapshot: [
      { label: 'Trigger', value: 'An initiative of HH Sheikha Moza' },
      { label: 'Mandate', value: 'A digital home for a mosque for women' },
      { label: 'Role', value: 'Project Manager — design → go-live' },
      { label: 'Scope', value: 'Design · Development · Launch' },
      { label: 'Status', value: 'Live since 2022' },
    ],
    processTitle: 'The place itself',
    processNote: 'AlMujadilah, in moments — hover to develop',
    process: [
      {
        src: '/process-am/inauguration.jpg',
        caption: 'The inauguration — Her Highness Sheikha Moza bint Nasser',
        w: 340,
      },
      { src: '/process-am/hall.jpg', caption: 'The hall — lectures under the lattice light', w: 440 },
      { src: '/process-am/space.jpg', caption: 'The space — dialogue inside AlMujadilah’s curves', w: 440 },
      { src: '/process-am/circles.jpg', caption: 'Community — learning circles at work', w: 440 },
      { src: '/process-am/programmes.jpg', caption: 'Programmes — research talks to Ramadan nights', w: 440 },
    ],
    chapters: [
      {
        label: 'The mandate',
        lead: 'A first-of-its-kind mosque deserves a first-rate launch.',
        text: 'AlMujadilah is a mosque and education centre built around women — an initiative of Her Highness Sheikha Moza, inaugurated in her presence. Its digital platform had to carry the same care, and it had to be ready for the moment.',
      },
      {
        label: 'The delivery',
        lead: 'One thread from design to go-live.',
        text: 'As Project Manager I carried the platform across every hand-off — aligning designers, developers and the client team, protecting the design intent through the build, and clearing the road to launch.',
      },
      {
        label: 'The outcome',
        lead: 'Live — and part of the community’s rhythm.',
        text: 'The platform shipped in 2022 and serves the community today: programmes, learning circles, research and prayer times, one calm digital home.',
      },
    ],
    stats: [
      { value: '2022', label: 'Launched — live ever since' },
      { value: 'E2E', label: 'Led from design through development to go-live' },
      { value: '01', label: 'A first — a mosque designed around women' },
    ],
  },
];

export const projects: Project[] = [...projectList].sort((a, b) =>
  a.index.localeCompare(b.index),
);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
