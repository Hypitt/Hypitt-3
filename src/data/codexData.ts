export interface ViralLaw {
  number: string;
  title: string;
  summary: string;
  theSecret: string;
  realWorldExample: string;
}

export const VIRAL_LAWS: ViralLaw[] = [
  {
    number: '01',
    title: 'The Artifact Rule',
    summary: 'People never share apps or links. People share stylized mirrors of their own identity.',
    theSecret: 'If your app produces a text paragraph or a plain confirmation message, it is dead on arrival. The output must be a self-contained, gorgeous graphic asset (receipt, certificate, tarot card, radar chart, or scoreboard) designed specifically for 9:16 Instagram Stories and Twitter timelines.',
    realWorldExample: 'Spotify Wrapped, Receiptify, and Locket all exploded because the user output was a badge of taste, not a utilitarian report.'
  },
  {
    number: '02',
    title: 'The Status Asymmetry Wedge',
    summary: 'Give users a legitimate, socially acceptable excuse to brag or playfully commiserate.',
    theSecret: 'Nobody can tweet "Look how fast I ran today" without feeling like a braggart. But if an app generates a meme saying "Zone 2 Delusion: Top 2% Pace", the user can share it under the guise of self-deprecation while secretly flexing their speed.',
    realWorldExample: 'Strava year-end summaries, Wordle grids (sharing the green squares allowed people to flex their vocabulary without seeming pompous).'
  },
  {
    number: '03',
    title: 'The Obsessive Micro-Tribe',
    summary: 'A broad audience has zero velocity. An obsessive subculture has infinite word-of-mouth.',
    theSecret: 'Target communities with high internal slang, intense gatekeeping, and dedicated subreddits (e.g., espresso home baristas, mechanical keyboard builders, BookTok readers). When you speak their exact dialect, they feel seen and adopt the tool as an in-group ritual.',
    realWorldExample: 'Letterboxd for cinephiles, Discord originally for MMORPG guild raids, Strava for cyclists.'
  },
  {
    number: '04',
    title: 'The 45-Second Friction Cap',
    summary: 'From first landing page load to exported viral asset must take less than 45 seconds.',
    theSecret: 'Do not require an email confirmation, a password, or a credit card upfront. Allow anonymous immediate generation. Hook them with the dopamine of their personalized result first; gate secondary features or saved history later.',
    realWorldExample: 'How Old Do I Look, BeReal 2-minute prompt, Photobooth browser apps.'
  },
  {
    number: '05',
    title: 'The Non-Intrusive Watermark Flywheel',
    summary: 'Every exported card is an organic billboard that leads directly into the next user’s loop.',
    theSecret: 'Every shareable graphic must have a tiny, tasteful domain or QR code at the footer (e.g., "Tested with PaceShame.app"). When the recipient sees their friend’s result, curiosity and competitive ego drive them to the site in 1 click.',
    realWorldExample: 'TikTok watermark on downloaded clips, "Sent from my iPhone", Wordle URL link.'
  },
  {
    number: '06',
    title: 'The Versus / Challenge Duel',
    summary: 'Virality doubles when the artifact directly invites a second person to compare.',
    theSecret: 'Build a 1-click comparison mode: "Challenge your running partner", "Audit your roommate’s chore record", "Duel with your espresso setup". This transforms single-player vanity into multiplayer social friction.',
    realWorldExample: 'Gas app polls ("Who is most likely to become a CEO?"), QuizUp, Duolingo friend streaks.'
  }
];

export const NICHE_PRESETS = [
  { label: 'Roommates & Renters', niche: 'Urban Apartment Roommates & Flatmates', hook: 'Satirical Grievance Ticket' },
  { label: 'Gen Z vs Millennials', niche: 'Gen Z vs Millennial Slang & Emoji Warfare', hook: 'Cringe Court Alignment' },
  { label: 'Corporate Slack & Email', niche: 'Tech & Corporate Employees Battling Passive-Aggression', hook: 'Email Subtext Unmasker' },
  { label: 'Strava Runners & Athletes', niche: 'Strava Runners & Marathoners', hook: 'Ego Flex & Title Roast' },
  { label: 'Third-Wave Coffee Snobs', niche: 'Specialty Coffee Geeks & Espresso Purists', hook: 'Pretentiousness Audit' },
  { label: 'BookTok Romance Readers', niche: 'BookTok Romance & Romantasy Readers', hook: 'Reader DNA & Spice Rating' },
  { label: 'Freelancers & Agencies', niche: 'Freelance Designers & Independent Creatives', hook: 'Scope Creep Invoice Shamer' },
  { label: 'Mechanical Keyboard Nerds', niche: 'Custom Mechanical Keyboard Audiophiles', hook: 'Acoustic Thock Grade' },
  { label: 'Sourdough & Fermenters', niche: 'Sourdough Bakers & Wild Yeast Obsessives', hook: 'Hydration & Crumb Inspection' },
  { label: 'Fragrance & Scent Collectors', niche: 'Niche Perfume & Cologne Collectors', hook: 'Silage & Scent Signature Flex' },
  { label: 'Indie Hackers & Builders', niche: 'Solo SaaS Founders & Indie Developers', hook: 'MRR Delusion & Reality Check' }
];
