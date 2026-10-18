import { CuratedIdea } from '../types';

export const CURATED_VIRAL_IDEAS: CuratedIdea[] = [
  // --- ROOMMATE APPS ---
  {
    id: 'passivenote',
    name: 'PassiveNote',
    tagline: 'Satirical official citations & chore arbitration for roommates',
    category: 'roommates',
    nicheTribe: 'Young Urban Roommates & Flatmates (45M+ renters)',
    estimatedTAM: '$30M roommate utilities & premium group tools',
    viralMultiplier: 'Shared Grievance & Group Chat Drama',
    socialHook: 'Instead of having uncomfortable passive-aggressive text arguments, roommates issue hilarious "Official Apartment Citations" with fines and community service penalties.',
    theArtifact: {
      title: 'Apartment Violation Citation',
      description: 'An official bureaucratic municipal citation card formatted for iMessage / WhatsApp',
      defaultData: {
        offense: 'Sink Archaeology (Dishes left unwashed > 48h)',
        severity: 'Class A Felony',
        perpetrator: 'The Roommate Who "Soaks" Pans',
        mandatedFine: 'Buying 1 Six-Pack of Oat Milk',
        appealDeadline: 'Tonight at 11:59 PM',
        citationId: 'APT-4B-0941'
      }
    },
    whyItSpreads: 'Direct conflict is awkward; shared satire diffuses tension while still getting the message across. It instantly gets forwarded into apartment group chats.',
    viralLoopSteps: [
      'Frustrated roommate selects an infraction (hair in drain, empty Brita, 3 AM microwave cooking)',
      'App renders an official-looking gold-embossed "Bureau of Domestic Peace" ticket',
      'User drops ticket into the roommate group chat',
      'Other roommates react, laugh, and download the app to issue counter-citations'
    ],
    launchTactic: 'Short comedy skits on TikTok staging roommate confrontations with printed citation slips. High meme velocity.',
    monetization: '$1.99 per custom framed physical citation print + $2.99/mo for Apartment Group War Room with chore point ledger.',
    mvpBuildDays: 2,
    sampleHooks: [
      'Stop texting your roommate about the dirty dishes. Send them this official citation instead.',
      'We created a legal ticket for roommates who leave 2 drops of water in the Brita pitcher.',
      'The group chat just went nuclear after this citation was dropped.'
    ]
  },
  {
    id: 'fridge-forensics',
    name: 'FridgeForensics',
    tagline: 'The unsolved refrigerator crime scene & food theft tribunal',
    category: 'roommates',
    nicheTribe: 'College dorms, shared flats, and co-living houses',
    estimatedTAM: '$15M collegiate and young adult social tools',
    viralMultiplier: 'Whodunit Investigation & Public Trial',
    socialHook: 'Someone drank the last oat milk or ate the leftovers. FridgeForensics lets roommates upload a photo, declare a crime scene, and generate an FBI-style dossier with suspect lineup.',
    theArtifact: {
      title: 'Crime Scene Dossier & Suspect Warrant',
      description: 'Official Cold Case FBI-style case file card with evidence tags and primary suspects',
      defaultData: {
        stolenItem: "Trader Joe's Soup Dumplings (6-pack)",
        crimeScene: 'Shelf 2, Behind the Sriracha',
        timeOfDeath: 'Estimated between 1:30 AM - 3:15 AM',
        primeSuspect: 'Roommate with late-night munchies history',
        evidenceFound: '1 discarded soy sauce packet in trash',
        verdictBounty: 'Immediate restitution in DoorDash credit'
      }
    },
    whyItSpreads: 'Food theft is the #1 universal communal living grievance. Turning petty fridge theft into an exaggerated true-crime mystery creates viral group chat entertainment.',
    viralLoopSteps: [
      'User snaps a photo or logs the missing snack and selects suspected housemates',
      'App generates an "Active Food Crime Bulletin" with fingerprint graphics and suspect mugshots',
      'User posts it to the house WhatsApp or Instagram Story tagging the suspects',
      'Housemates vote on the anonymous poll "Who Did It?" — losers must pay restitution'
    ],
    launchTactic: 'TikTok series investigating real missing food cases submitted by dorm students.',
    monetization: '$0.99 for instant anonymous poll voting + DoorDash/Instacart affiliate link to "Replace Stolen Item".',
    mvpBuildDays: 2,
    sampleHooks: [
      'If you have a roommate who eats your food, this app files a formal federal indictment.',
      'We solved a 3-month cold case about missing string cheese using this dossier.',
      'Tag the roommate who always says "I thought this was for everyone".'
    ]
  },
  {
    id: 'flatmate-duel',
    name: 'FlatmateDuel',
    tagline: 'The passive-aggressive roommate compatibility radar & chore test',
    category: 'roommates',
    nicheTribe: 'Prospective roommates, lease renewals, and couples moving in together',
    estimatedTAM: '$22M apartment finding and co-living matchmaking',
    viralMultiplier: 'Versus Duel & Unfiltered Truth',
    socialHook: 'Both roommates take a secret 10-question quiz (e.g. "Do you wash dishes before bed?", "Do you turn off lights?"). It generates a side-by-side radar chart exposing the hygiene and friction delta.',
    theArtifact: {
      title: 'Roommate Compatibility Radar Chart',
      description: 'A sleek comparison card displaying Cleanliness, Noise, Guest Tolerance, and Drama Index',
      defaultData: {
        compatibilityScore: '68% (Moderate Friction Risk)',
        cleanlinessDelta: 'Alex: 92% vs Sam: 41%',
        biggestFlashpoint: 'Unwashed skillet left overnight',
        sleepScheduleSync: 'Complete mismatch (Night Owl vs Early Bird)',
        arbitrationVerdict: 'Mandatory weekly maid service required'
      }
    },
    whyItSpreads: 'People love taking quizzes about their relationships and publicly comparing scores with friends to see who is the "toxic" one.',
    viralLoopSteps: [
      'User completes the 60-second Roommate Quiz and sends invite link to their roommate',
      'Roommate answers anonymously without seeing first person’s answers',
      'App unmasks the results in a dramatic reveal screen with side-by-side radar graphs',
      'Both share the summary card on social media: "Proof I am 3x cleaner than my roommate"'
    ],
    launchTactic: 'Collab with college meme pages on Instagram and Reddit r/badroommates.',
    monetization: '$4.99 for full Deep Conflict Report + Splitwise/cleaning service referral commissions.',
    mvpBuildDays: 3,
    sampleHooks: [
      'Make your roommate take this quiz before you sign another 12-month lease.',
      'We took this test and found out who actually carries our entire apartment.',
      'Is your roommate a neat freak or a biohazard? Send them this link.'
    ]
  },

  // --- GEN Z VS MILLENNIAL APPS ---
  {
    id: 'cringecourt',
    name: 'CringeCourt',
    tagline: 'The Gen Z vs Millennial emoji, slang, and cultural alignment tribunal',
    category: 'genz-vs-millennials',
    nicheTribe: '20-something and 30-something internet natives, office workers, and social creators',
    estimatedTAM: '$25M viral entertainment & creator monetization',
    viralMultiplier: 'Generational Warfare & Identity Signaling',
    socialHook: 'Do you still use the crying-laughing emoji 😂 or "doggo"? Do you write in all-lowercase and spam 💀? CringeCourt audits your texts, social bio, or emails and renders your Generational Alignment Dossier.',
    theArtifact: {
      title: 'Generational Alignment Dossier',
      description: 'A bold, split-screen fluorescent verdict card ranking Millennial Cringe vs Gen Z Brainrot',
      defaultData: {
        generationalVerdict: '78% Elder Millennial / 22% Gen Z Imposter',
        capitalCrimes: 'Used "adulting", side part, and 😂 in one sentence',
        brainrotIndex: '0.4% (Zero knowledge of Skibidi or Rizz)',
        fashionAlignment: 'Ankle socks and skinny jeans detected',
        tribalSentence: 'Sentenced to 48 hours of TikTok brainrot rehabilitation'
      }
    },
    whyItSpreads: 'The Gen Z vs Millennial cultural war is an eternal internet goldmine. People passionately defend their aesthetic choices (side part vs middle part, socks, slang, emojis).',
    viralLoopSteps: [
      'User pastes a recent text message, social bio, or answers 5 lightning cultural questions',
      'CringeCourt generates a high-contrast split card grading their generational age',
      'User posts the card to TikTok/Instagram with caption: "I refuse to give up my ankle socks"',
      'Followers immediately test their own texts using the link on the card'
    ],
    launchTactic: 'TikTok creators reacting to their own parents or older siblings getting roasted by the algorithm.',
    monetization: '$2.99 for custom Roast Badges + branded affiliate drops (baggy streetwear vs retro merch).',
    mvpBuildDays: 2,
    sampleHooks: [
      'This app reads your texting style and tells you if you are giving old person energy.',
      'If you still use this emoji 😂, I have bad news about your generational age.',
      'Gen Z vs Millennials: test your text messages in the Cringe Court.'
    ]
  },
  {
    id: 'corp-unmask',
    name: 'CorpUnmask',
    tagline: 'Millennial corporate-speak to Gen Z raw honesty translator',
    category: 'genz-vs-millennials',
    nicheTribe: 'Tech workers, corporate climbers, and entry-level Gen Z employees',
    estimatedTAM: '$35M workplace humor, Slack apps, and career tools',
    viralMultiplier: 'Workplace Catharsis & Shared Rebellion',
    socialHook: 'Paste in a polite, passive-aggressive corporate email ("Per my last email", "Happy to jump on a quick sync!"). It translates it into what you actually mean in blunt Gen Z vernacular, or vice versa.',
    theArtifact: {
      title: 'Corporate Decryption Receipt',
      description: 'Sleek Slack-style message card revealing "Polite Email vs What You Actually Meant"',
      defaultData: {
        incomingEmail: '"Just following up on this to see if you had a chance to review!"',
        genZTranslation: '"You have been ignoring me for 4 days and I am ready to quit."',
        passiveAggressiveLevel: '94% (Hazardous Radiation)',
        recommendedReply: '"Respectfully, I am not doing that."',
        careerSafetyScore: '12 / 100 (Instant HR Escalation)'
      }
    },
    whyItSpreads: 'Corporate communication is notoriously fake. Exposing the absurd subtext of polite workplace emails is the most viral genre on LinkedIn and TikTok #corporate.',
    viralLoopSteps: [
      'Employee pastes a dreaded email from their boss or client',
      'App renders an aesthetic "Translation Slip" exposing the true passive-aggressive subtext',
      'User screenshots and posts to LinkedIn or TikTok with "Corporate America is not real"',
      'Colleagues bookmark and run their own boss\'s emails through the decoder'
    ],
    launchTactic: 'Post daily "Translating wild CEO emails" videos on TikTok and LinkedIn.',
    monetization: '$4.99/mo for Slack & Gmail browser extension + resume roast upsells.',
    mvpBuildDays: 2,
    sampleHooks: [
      'What "Per my last email" actually means according to this corporate translator...',
      'Paste your boss\'s email into this app to see how passive aggressive it really is.',
      'I ran my entire company handbook through this translator and it’s hilarious.'
    ]
  },
  {
    id: 'decade-duel',
    name: 'DecadeDuel',
    tagline: 'The head-to-head Millennial vs Gen Z childhood nostalgia showdown',
    category: 'genz-vs-millennials',
    nicheTribe: '90s babies, 2000s kids, and TikTok culture debaters',
    estimatedTAM: '$20M trivia, party games, and brand partnerships',
    viralMultiplier: 'Nostalgia Wars & In-Group Pride',
    socialHook: 'Pairs 90s/2000s Millennial staples (Club Penguin, Tamagotchi, Vine, LimeWire) against Gen Z equivalents (Roblox, TikTok, Discord, Co-Star) in a 60-second rapid-fire debate duel.',
    theArtifact: {
      title: 'Nostalgia Superiority Certificate',
      description: 'Y2K retro aesthetic badge proving which generation had the superior childhood',
      defaultData: {
        generationWinner: 'Elder Millennial (64% Childhood Dominance)',
        superiorCulturePick: 'Vine was objectively funnier than TikTok',
        traumaPoint: 'Dial-up internet connection sound',
        nostalgiaScore: '92 / 100 Golden Era Index',
        ruling: 'Legally certified to complain that "kids these days don\'t go outside"'
      }
    },
    whyItSpreads: 'Nothing unites or divides the internet like childhood nostalgia. Generating an official "Nostalgia Superiority Badge" provokes instant heated debates in comments.',
    viralLoopSteps: [
      'User votes on 8 iconic childhood comparisons (Vine vs TikTok, MySpace vs Instagram)',
      'App generates a Y2K holographic certificate declaring their generation\'s superiority score',
      'User shares the certificate with a direct duel link to an opposite-generation friend',
      'Friend accepts duel to defend their childhood generation'
    ],
    launchTactic: 'Host live TikTok battles where Millennial creators debate Gen Z creators with live audience voting.',
    monetization: '$1.99 party mode deck + retro merch group buys + Y2K apparel affiliates.',
    mvpBuildDays: 3,
    sampleHooks: [
      'Prove your childhood was better than Gen Z once and for all.',
      'We compared Vine vs TikTok and the internet is in shambles.',
      'Did 2000s kids actually have more fun? Test your nostalgia index.'
    ]
  },

  // --- SUBCULTURE VIRAL APPS ---
  {
    id: 'paceshame',
    name: 'PaceShame',
    tagline: 'The ego-puncturing Strava activity title and vanity auditor',
    category: 'subcultures',
    nicheTribe: 'Strava Runners & Hybrid Athletes (120M+ users)',
    estimatedTAM: '$45M niche micro-subscriptions & brand drops',
    viralMultiplier: 'Ego Bait / Self-Deprecating Flex',
    socialHook: 'Runners obsess over funny activity titles. PaceShame analyzes your pace, elevation, and heart rate to generate a brutally funny graphic card.',
    theArtifact: {
      title: 'Strava Vanity Roast Card',
      description: 'A fluorescent high-contrast running card ready for Instagram Stories & Strava feed',
      defaultData: {
        distance: '5.2 mi',
        pace: '8:42 /mi',
        title: 'Zone 2 Delusion (Actually Stopped 4 Times for Photos)',
        sin: 'Paced specifically to flex on a former high school rival',
        percentile: 'Top 8% Pretending to Enjoy Recovery',
        shameRating: '8.4 / 10'
      }
    },
    whyItSpreads: 'Runners already share screenshots of their maps. Giving them a personalized meme that validates their grind while poking fun at their vanity guarantees an instant story repost.',
    viralLoopSteps: [
      'Runner enters their workout stats or links activity',
      'PaceShame generates an aesthetic fluorescent 9:16 card with a hilarious diagnosis',
      'User posts to Instagram Story or Twitter to self-deprecate ("I feel personally attacked")',
      'Friends see the watermarked QR code at the bottom and immediately run their own workout'
    ],
    launchTactic: 'Seed 20 micro-running influencers with custom roasts. Post side-by-side on r/running and #runningtok.',
    monetization: '$3.99/mo for Pro Roast Library + Automated Strava Sync, plus footwear & gel drops.',
    mvpBuildDays: 2,
    sampleHooks: [
      'If you run with Strava, this new app just called you out on your "easy run"...',
      'I put my marathon split into this generator and it told me to apologize to my knees.',
      'Show this to the friend who pauses their Garmin at every red light.'
    ]
  },
  {
    id: 'extraction-police',
    name: 'ExtractionPolice',
    tagline: 'The third-wave specialty coffee pretentiousness auditor',
    category: 'subcultures',
    nicheTribe: 'Specialty Coffee Geeks & Espresso Home Baristas',
    estimatedTAM: '$18M gear affiliates & roaster subscriptions',
    viralMultiplier: 'Cult In-Group Status Signaling',
    socialHook: 'Espresso nerds spend $3,000 on grinders and obsess over channeling. This tool rates your setup, bean origin, and technique with snobbish precision.',
    theArtifact: {
      title: 'Thermal Barista Receipt',
      description: 'Black-and-white minimalist thermal receipt grading grind uniformity and gear pretentiousness',
      defaultData: {
        grinder: 'Niche Zero (Single Dose)',
        brewMethod: 'V60 4:6 Method',
        beanOrigin: 'Ethiopia Yirgacheffe Washed',
        pretentiousnessScore: '94 / 100',
        ruling: 'Legally prohibited from drinking diner coffee',
        waterTDS: '75 ppm (Custom Minerals Detected)'
      }
    },
    whyItSpreads: 'Coffee nerds crave validation for their excessive precision. A shareable receipt that crowns them "Certified Coffee Snob" gives them social license to brag about their $800 grinder.',
    viralLoopSteps: [
      'Barista selects gear, brew ratio, and extraction time',
      'Generates a crumpled thermal-style printed receipt with itemized coffee sins',
      'User shares to r/espresso, Instagram, and Discord communities',
      'Peers duel them by submitting their own setups to see who has higher purity ratings'
    ],
    launchTactic: 'Post "We audited the top 10 coffee setups on Reddit" on TikTok and YouTube Shorts.',
    monetization: 'High-ticket affiliate revenue on grinders, scales, and curated specialty bean subscription drops.',
    mvpBuildDays: 3,
    sampleHooks: [
      'This app will tell you if your $2,000 espresso setup actually makes good coffee.',
      'Are you a casual coffee drinker or an insufferable purist? Test your ratio here.',
      'The coffee community is arguing over this pretentiousness receipt.'
    ]
  },
  {
    id: 'romantasy-matrix',
    name: 'TropeMatrix',
    tagline: 'BookTok romance reader DNA, spice levels, and heartbreak index',
    category: 'subcultures',
    nicheTribe: 'BookTok Romance & Romantasy Readers (200B+ TikTok views)',
    estimatedTAM: '$60M author promotions, box sets, and merchandise',
    viralMultiplier: 'Identity Projection & Subculture Badge',
    socialHook: 'BookTok readers identify deeply with tropes ("Enemies to Lovers", "Morally Gray Shadow Daddy", "Only One Bed"). This app builds your psychological romance DNA card.',
    theArtifact: {
      title: 'Romance Reader Trope DNA Card',
      description: 'Dreamy dark-romance aesthetic card with spice level, favorite tropes, and toxic boyfriend quotient',
      defaultData: {
        primaryTrope: 'Enemies to Lovers (With Knives)',
        spiceIndex: '🌶️🌶️🌶️🌶️ (Extreme Thermal Hazard)',
        emotionalDamage: '98% Irreversible Heartbreak',
        readingArchetype: 'The 3 AM Chapter Binger',
        shadowDaddyLevel: 'Maximum Overdrive',
        holyGrailBook: 'A Court of Mist and Fury'
      }
    },
    whyItSpreads: 'BookTok is the single highest-engagement community on TikTok. Readers proudly share their trope profiles, spice tolerances, and reading rosters on Stories and feeds.',
    viralLoopSteps: [
      'Reader inputs their top 3 recent reads and answers 4 preference dilemmas',
      'App generates a gorgeous Gothic/Pastel aesthetic Reader Dossier',
      'Reader posts card to TikTok/Instagram with sound: "What your tropes say about you"',
      'Followers compare their Spice Index and challenge each other'
    ],
    launchTactic: 'Collab with 10 BookTok creators with 50k-200k followers to reveal their spice ratings.',
    monetization: 'Direct affiliate integration with Kindle Unlimited, Bookshop.org, and indie author sponsorships.',
    mvpBuildDays: 3,
    sampleHooks: [
      'This test tells you exactly how toxic your BookTok reading taste is.',
      'Show me your top 3 romance tropes and I will guess your deepest attachment style.',
      'The spice rating on this card is causing major controversy on BookTok.'
    ]
  },

  // --- FREELANCE & WORK APPS ---
  {
    id: 'ghost-invoice',
    name: 'GhostInvoice',
    tagline: 'The scope creep & late client invoice shamer for creatives',
    category: 'freelance-work',
    nicheTribe: 'Freelancers, Designers, Developers & Independent Creatives (70M+)',
    estimatedTAM: '$80M invoicing tools & factoring solutions',
    viralMultiplier: 'Shared Trauma & Industry Catharsis',
    socialHook: 'Clients asking for "one more quick tweak" or ignoring 60-day invoices is a universal freelance nightmare. GhostInvoice itemizes the hidden emotional costs into a viral statement.',
    theArtifact: {
      title: 'Delinquency & Scope Creep Audit',
      description: 'Sleek corporate invoice parody itemizing "Just One More Little Change" fees',
      defaultData: {
        unpaidDays: '47 Days Past Due',
        scopeCreepItems: '14 Unpaid Revisions ("Can we make the logo pop?")',
        emotionalTollFee: '$750.00',
        urgencyIgnoredRate: '99.2%',
        auditDiagnosis: 'Client is likely "on a quick retreat in Joshua Tree"',
        totalOutstanding: '$4,250.00 + Sanity'
      }
    },
    whyItSpreads: 'Freelancers constantly vent on LinkedIn and X about clients ghosting invoices. A clean, professional-looking invoice graphic that weaponizes humor gets insane repost numbers.',
    viralLoopSteps: [
      'Freelancer inputs days overdue and client excuse ("Accounts Payable is on vacation")',
      'Generates a stunning branded "Scope Creep & Delinquency Invoice"',
      'User posts screenshot to LinkedIn/Twitter with caption: "Thinking about sending this for real"',
      'Fellow freelancers comment in solidarity and generate their own client audits'
    ],
    launchTactic: 'Post on LinkedIn and Twitter with screenshots of real anonymous client excuses.',
    monetization: 'Upsell to real automated client payment reminder tool + invoice factoring affiliate links.',
    mvpBuildDays: 2,
    sampleHooks: [
      'I made an invoice for every time a client asked to "make the logo pop"...',
      'When your client is 60 days late on payment, send them this statement.',
      'Freelancers: what is the single wildest excuse a client has given you for not paying?'
    ]
  }
];
