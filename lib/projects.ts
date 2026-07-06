export type Project = {
  slug: string;
  index: string;
  client: string;
  title: string;
  year: string;
  role: string;
  sector: string;
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
  /* Real cases: process artifacts from the FigJam war room */
  process?: { src: string; caption: string; w: number }[];
};

export const projects: Project[] = [
  {
    slug: 'qatar-university',
    index: '01',
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
    index: '02',
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
    process: [
      { src: '/process/board.png', caption: 'The wall — one board, every decision', w: 400 },
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
    index: '03',
    client: 'Qatar Olympic Committee',
    title: 'Rebuilt around the athletes',
    year: '2025',
    role: 'UX Lead — Design Direction',
    sector: 'Sport · Government',
    specimen: { name: 'Sienna', hex: '#D6B292', rgb: '214, 178, 146', cmyk: '0, 17, 32, 16' },
    clientLogo: '/qoc-logo.svg',
    comingSoon: true,
    overviewHeading: 'Ask the athletes. Then redesign everything.',
    overview:
      'The Qatar Olympic Committee’s website needed a ground-up revamp. I led UX from research to wireframes — benchmarking committees at home and abroad, mapping personas in depth, interviewing Team Qatar Olympians — and gave design direction to an incredible UI team.',
    snapshot: [
      { label: 'Trigger', value: 'A digital home due for reinvention' },
      { label: 'Mandate', value: 'One experience for public & Team Qatar' },
      { label: 'Role', value: 'UX Lead — design direction' },
      { label: 'Research', value: 'Benchmarking · Personas · Olympian interviews' },
      { label: 'Status', value: 'In development — launching soon' },
    ],
    process: [
      { src: '/process-qoc/board.png', caption: 'The wall — one board, every decision', w: 400 },
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
        lead: 'An Olympic ambition, a dated digital home.',
        text: 'The QOC’s platform no longer matched the story Team Qatar was writing. The revamp had to serve two audiences at once — a public looking for stories and medals, and a sporting ecosystem looking for structure.',
      },
      {
        label: 'The approach',
        lead: 'Ask the athletes — then draw.',
        text: 'We benchmarked Olympic committees nationally and internationally, mapped personas in depth, and interviewed Team Qatar stars — including beach-volleyball Olympian Cherif Younousse. Only then did the wireframes begin, with design direction carried through an incredible UI team.',
      },
      {
        label: 'The outcome',
        lead: 'A full experience revamp — launching soon.',
        text: 'The entire QOC website experience was redesigned end to end. The platform is in development, on its way to launch.',
      },
    ],
    stats: [
      { value: '2', label: 'Benchmark tracks — national & international' },
      { value: '1:1', label: 'Interviews with Team Qatar Olympians' },
      { value: '2025', label: 'Experience redesigned end to end' },
    ],
  },
  {
    slug: 'almujadilah',
    index: '04',
    client: 'AlMujadilah',
    title: 'A mosque designed around her',
    year: '2025',
    role: 'UX Lead',
    sector: 'Culture · Community',
    specimen: { name: 'Orchid', hex: '#E5BDDF', rgb: '229, 189, 223', cmyk: '0, 18, 3, 10' },
    overview:
      'AlMujadilah is the first mosque and education centre designed specifically for women in Qatar. Its digital companion had to carry the same intention: programmes, prayer times, learning circles and community — designed with quietness and dignity.',
    chapters: [
      {
        label: 'The challenge',
        lead: 'Serene — without feeling empty.',
        text: 'Sacred space demands restraint. The product had to serve first-time visitors and daily members through the same calm surface.',
      },
      {
        label: 'The approach',
        lead: 'Translate the architecture into interface.',
        text: 'Light, geometry, threshold — rendered as generous whitespace, a soft rhythm of prayer-time anchors, and content that never shouts.',
      },
      {
        label: 'The outcome',
        lead: '“Part of the place itself.”',
        text: 'That’s how the community describes the companion app — used daily for prayer times, weekly for circles, lectures and gatherings.',
      },
    ],
    stats: [
      { value: '4.9', label: 'Store rating' },
      { value: '70%', label: 'Weekly active members' },
      { value: '120+', label: 'Programmes hosted' },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
