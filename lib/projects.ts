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
    title: 'One ecosystem for Team Qatar',
    year: '2024',
    role: 'UX Lead',
    sector: 'Sport · Government',
    specimen: { name: 'Sienna', hex: '#D6B292', rgb: '214, 178, 146', cmyk: '0, 17, 32, 16' },
    overview:
      'From grassroots programmes to Olympic delegations, the QOC touches every athlete in the country. We designed the unified digital ecosystem — public storytelling on one face, athlete and federation services on the other.',
    chapters: [
      {
        label: 'The challenge',
        lead: 'One brand. Two audiences with opposite needs.',
        text: 'The public wanted stories and medals; athletes and federations needed forms, accreditation and logistics. Previous attempts served neither.',
      },
      {
        label: 'The approach',
        lead: 'A public stage in front, a working backstage behind.',
        text: 'Two faces bound by one design language — with content modelling before visual design, so every story, athlete and event lived once and appeared everywhere.',
      },
      {
        label: 'The outcome',
        lead: 'One system, carried through a full games cycle.',
        text: 'A bilingual platform for Team Qatar — and a service backbone the federations now build on.',
      },
    ],
    stats: [
      { value: '30+', label: 'Federations unified' },
      { value: '2', label: 'Languages, one system' },
      { value: '60%', label: 'Faster accreditation' },
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
