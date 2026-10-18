export type Language = 'en' | 'fr';

export interface Translations {
  nav: {
    home: string;
    battles: string;
    search: string;
    create: string;
    media: string;
    squads: string;
    chats: string;
    profile: string;
    login: string;
    signup: string;
    logout: string;
    monthlyCoins: string;
    inviteEarn: string;
    inviteButton: string;
  };
  categories: {
    all: string;
    roasting: string;
    dance: string;
    singing: string;
    debate: string;
    custom_debate?: string;
    genz_vs_millennial?: string;
    comedy: string;
    clout: string;
  };
  judgeMode: {
    title: string;
    designateButton: string;
    autoElectButton: string;
    activeJudges: string;
    designateModalTitle: string;
    designateModalDesc: string;
    pickThreePrompt: string;
    designatedBadge: string;
    publicElectedBadge: string;
    aiJudgeBadge: string;
    weightFormula: string;
    judgesWeightLabel: string;
    publicWeightLabel: string;
    combinedResultTitle: string;
    currentLeader: string;
    updateScore: string;
    scoreCardTitle: string;
    judgeNotes: string;
    confirmDesignation: string;
    cancel: string;
    deliberationNotice: string;
    audiencePoolTitle: string;
  };
  battleArena: {
    liveStage: string;
    prizePot: string;
    round: string;
    stepOnStage: string;
    aiJudgeButton: string;
    aiJudgingInProgress: string;
    aiSparringButton: string;
    tugOfWarTitle: string;
    publicVoteA: string;
    publicVoteB: string;
    freeVote: string;
    superVote5: string;
    superVote10: string;
    likeBoostNotice: string;
    likeBoostButton: string;
    predictionTitle: string;
    potentialPayout: string;
    lockBet: string;
    betAmount: string;
    liveAudienceQueue: string;
    liveChatTitle: string;
    sendComment: string;
    typeComment: string;
    cameraUnlockedBanner: string;
    videoLiveHD: string;
    audioActiveMic: string;
    speakingLive: string;
    battleRewardsTitle: string;
    hostCutLabel: string;
    battlersCutLabel: string;
    distributeRewardsBtn: string;
    rewardsDistributedNotice: string;
  };
  economy: {
    votingCoinsTitle: string;
    votingCoinsDesc: string;
    creatorRewardCoinsTitle: string;
    creatorRewardCoinsDesc: string;
    virtualDisclaimer: string;
    claimMonthlyStipend: string;
    monthlyClaimedBadge: string;
    costPerVote: string;
  };
  content: {
    followToUnlockNotice: string;
    followToUnlockBtn: string;
    followingUnlockedBadge: string;
    fiveCoinUnlockBtn: string;
    downloadedBadge: string;
    simulatedSalesLabel: string;
    contentUnlocksLabel: string;
    setVirtualPriceNotice: string;
  };
  searchFeeds: {
    allContent: string;
    freeBattles: string;
    picturesFeed: string;
    videosFeed: string;
    dreamBattles: string;
    topCreators: string;
    searchPlaceholder: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    rewardHistoryTitle: string;
    virtualBalancesTitle: string;
    followerGrowthTitle: string;
    battlePerformanceTitle: string;
    simulatedSalesTitle: string;
  };
  legal?: {
    privacyPolicy: string;
    termsOfService: string;
    complianceNotice: string;
  };
  common: {
    coins: string;
    followers: string;
    wins: string;
    losses: string;
    download: string;
    free: string;
    paid: string;
    switchLang: string;
  };
  profileSection: {
    myProfile: string;
    creatorDashboard: string;
    changeCover: string;
    changeAvatar: string;
    postPhoto: string;
    postAudio: string;
    postVideo90: string;
    reposts: string;
    shareToMyProfile: string;
    repostedSuccess: string;
    videoMaxLimitNotice: string;
  };
  liveCompetitions: {
    customDisciplineLabel: string;
    customDisciplinePlaceholder: string;
    multiStreams: string;
    streamChannels: string;
    fiveCompetitorsOnStage: string;
    addCompetitorSlot: string;
    muteMic: string;
    unmuteMic: string;
    turnCamOn: string;
    turnCamOff: string;
    judgeOnlyClickVote: string;
    judgeVoteCastSuccess: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      battles: 'Live Competitions',
      search: 'Search & Feeds',
      create: 'Host & Compete',
      media: 'Media Hub',
      squads: 'Squads',
      chats: 'Chats & Calls',
      profile: 'Creator Dashboard',
      login: 'Log In',
      signup: 'Sign Up',
      logout: 'Log Out',
      monthlyCoins: '+100 Monthly Coins',
      inviteEarn: 'INVITE & EARN:',
      inviteButton: 'Invite Friends',
    },
    categories: {
      all: 'All Competitions',
      genz_vs_millennial: 'Gen Z vs. Millennials',
      custom_debate: 'Customized Debates',
      debate: 'General Debates',
      roasting: 'Roast Competition',
      dance: 'Dance Competition',
      singing: 'Open-Mic Vocals',
      comedy: 'Standup Comedy',
      clout: 'Follow Competitions',
    },
    judgeMode: {
      title: '50% Judges / 50% Public Judge Mode',
      designateButton: 'Designate 3 Audience Judges',
      autoElectButton: 'Auto-Elect from Audience',
      activeJudges: 'Active 3-Judge Tribunal',
      designateModalTitle: 'Organizer Judge Designation',
      designateModalDesc: 'Select 3 active live audience members from the spectator queue to serve as official judges.',
      pickThreePrompt: 'Designate exactly 3 audience members below:',
      designatedBadge: 'Audience Designated',
      publicElectedBadge: 'Crowd Auto-Elected',
      aiJudgeBadge: 'AI Juror',
      weightFormula: 'Official 50/50 Scoring Formula: 50% Judges Average + 50% Public Vote Percentage',
      judgesWeightLabel: 'Judges Score (50%)',
      publicWeightLabel: 'Public Vote (50%)',
      combinedResultTitle: 'Combined Live Total Result',
      currentLeader: 'Current Hypitt Leader',
      updateScore: 'Live Judge Score',
      scoreCardTitle: 'Official Judge Scorecard Breakdown',
      judgeNotes: 'Deliberation notes',
      confirmDesignation: 'Confirm 3 Designated Judges',
      cancel: 'Cancel',
      deliberationNotice: 'Judges live scores update the combined winner immediately in real time.',
      audiencePoolTitle: 'Live Audience Spectator Pool',
    },
    battleArena: {
      liveStage: 'Live Stage',
      prizePot: 'VIRTUAL PRIZE POT',
      round: 'ROUND',
      stepOnStage: 'Step On Stage',
      aiJudgeButton: 'AI Judge Score',
      aiJudgingInProgress: 'Analyzing...',
      aiSparringButton: 'AI Counter Bars',
      tugOfWarTitle: 'Real-Time Audience & Judges 50/50 Balance',
      publicVoteA: 'Votes',
      publicVoteB: 'Votes',
      freeVote: 'Vote (1 Coin)',
      superVote5: 'SuperVote (5 Coins)',
      superVote10: 'SuperVote (10 Coins)',
      likeBoostNotice: 'Like boosted battle score & prize pool!',
      likeBoostButton: 'Like Boost (+1 to Battle)',
      predictionTitle: 'Prediction Betting (Stake Virtual Coins)',
      potentialPayout: 'Potential Win',
      lockBet: 'Lock Prediction',
      betAmount: 'Bet Amount',
      liveAudienceQueue: 'Live Audience & Spectator Judges',
      liveChatTitle: 'Live Crowd Comments & Reactions',
      sendComment: 'Post',
      typeComment: 'Type your live reaction or bar critique...',
      cameraUnlockedBanner: 'Camera Unlocked! Leading competitor is now live on video stream.',
      videoLiveHD: 'Live Video Stream',
      audioActiveMic: 'Audio Open-Mic (Auto-Camera Unlock on Lead)',
      speakingLive: 'On Stage · Hot Mic',
      battleRewardsTitle: 'Automatic Battle Rewards Distribution (20% Host / 80% Battlers)',
      hostCutLabel: '20% Host & Organizer Virtual Cut',
      battlersCutLabel: '80% Battlers Proportional Share',
      distributeRewardsBtn: 'Calculate & Settle Rewards',
      rewardsDistributedNotice: 'Rewards automatically distributed: 20% to host, 80% shared between battlers by votes!',
    },
    economy: {
      votingCoinsTitle: 'Voting Coins',
      votingCoinsDesc: 'Monthly 100 coin allowance to vote in battles and support performers (1 coin per vote, 5 or 10 for SuperVote).',
      creatorRewardCoinsTitle: 'Creator Reward Coins',
      creatorRewardCoinsDesc: 'Virtual rewards earned from battle wins, host cuts, viewer like boosts, and 5-coin content downloads.',
      virtualDisclaimer: 'IMPORTANT: All coins, earnings, and balances are 100% simulated virtual tokens with NO cash value, NO monetary payout, and NO withdrawal option.',
      claimMonthlyStipend: 'Claim 100 Monthly Voting Coins',
      monthlyClaimedBadge: '100 Monthly Coins Claimed',
      costPerVote: '1 Coin per Regular Vote · 5/10 for SuperVotes',
    },
    content: {
      followToUnlockNotice: 'Follow creator to unlock full video playback',
      followToUnlockBtn: 'Follow to Unlock',
      followingUnlockedBadge: 'Following · Full Video Unlocked',
      fiveCoinUnlockBtn: 'Unlock Download (5 Coins)',
      downloadedBadge: 'Downloaded',
      simulatedSalesLabel: 'Simulated Content Sales',
      contentUnlocksLabel: 'Content Unlocks',
      setVirtualPriceNotice: 'Virtual 5 Coin price set for download simulation (No real money).',
    },
    searchFeeds: {
      allContent: 'All Content',
      freeBattles: 'Free Live Battles',
      picturesFeed: 'Pictures Feed',
      videosFeed: 'Videos Feed',
      dreamBattles: 'Public Dream Battles',
      topCreators: 'Top Ranked Creators',
      searchPlaceholder: 'Search live free battles, pictures, videos, music stems, or creators...',
    },
    dashboard: {
      title: 'Creator Dashboard & Virtual Wallet',
      subtitle: 'Track your dual virtual balances, content downloads, battle performance, and reward history.',
      rewardHistoryTitle: 'Virtual Reward Distribution History',
      virtualBalancesTitle: 'Separated Virtual Balances',
      followerGrowthTitle: 'Followers & Reach',
      battlePerformanceTitle: 'Battle Performance Record',
      simulatedSalesTitle: 'Simulated Content Sales & Unlocks',
    },
    legal: {
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      complianceNotice: 'Compliant with GDPR, COPPA & live interactive streaming policies.',
    },
    common: {
      coins: 'Coins',
      followers: 'Followers',
      wins: 'Wins',
      losses: 'Losses',
      download: 'Download',
      free: 'Free',
      paid: '5 Coins',
      switchLang: 'Language / Langue',
    },
    profileSection: {
      myProfile: 'My Profile',
      creatorDashboard: 'Dashboard & Wallet',
      changeCover: 'Change Cover Photo',
      changeAvatar: 'Change Profile Photo',
      postPhoto: 'Post Picture',
      postAudio: 'Post Short Audio',
      postVideo90: 'Post Short Video (Max 90s)',
      reposts: 'Shared to Profile',
      shareToMyProfile: 'Share to My Profile',
      repostedSuccess: 'Shared to your profile feed!',
      videoMaxLimitNotice: 'Short videos are strictly capped at 90 seconds max.',
    },
    liveCompetitions: {
      customDisciplineLabel: 'Custom Discipline Theme',
      customDisciplinePlaceholder: 'e.g. Freestyle Beatbox, Vogue Ballroom, Speed Chess Roast...',
      multiStreams: 'Multiple Live Streams',
      streamChannels: 'Live Channels',
      fiveCompetitorsOnStage: 'Up to 5 Competitors on Screen',
      addCompetitorSlot: '+ Add Stage Competitor (Max 5)',
      muteMic: 'Mute Mic',
      unmuteMic: 'Unmute Mic',
      turnCamOn: 'Camera On',
      turnCamOff: 'Camera Off',
      judgeOnlyClickVote: 'Official Judges 1-Click Vote',
      judgeVoteCastSuccess: 'Official Judge Score Submitted Publicly!',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      battles: 'Compétitions en Direct',
      search: 'Recherche & Flux',
      create: 'Organiser & Concourir',
      media: 'Médiathèque',
      squads: 'Équipes',
      chats: 'Discussions & Appels',
      profile: 'Tableau de Bord Créateur',
      login: 'Connexion',
      signup: 'Inscription',
      logout: 'Déconnexion',
      monthlyCoins: '+100 Pièces Mensuelles',
      inviteEarn: 'PARRAINAGE & GAINS :',
      inviteButton: 'Inviter des Amis',
    },
    categories: {
      all: 'Toutes les Compétitions',
      genz_vs_millennial: 'Gen Z vs. Millennials',
      custom_debate: 'Débats Personnalisés',
      debate: 'Débats Généraux',
      roasting: 'Compétition de Roast',
      dance: 'Compétition de Danse',
      singing: 'Chant Micro Ouvert',
      comedy: 'Comédie Stand-up',
      clout: 'Compétitions de Notoriété',
    },
    judgeMode: {
      title: 'Mode Juge 50% Juges / 50% Vote Public',
      designateButton: 'Désigner 3 Juges du Public',
      autoElectButton: 'Auto-Élire parmi le Public',
      activeJudges: 'Tribunal Actif des 3 Juges',
      designateModalTitle: 'Désignation des Juges par l’Organisateur',
      designateModalDesc: 'Sélectionnez 3 membres actifs parmi le public spectateur en direct pour siéger en tant que juges officiels.',
      pickThreePrompt: 'Désignez exactement 3 membres du public ci-dessous :',
      designatedBadge: 'Désigné du Public',
      publicElectedBadge: 'Auto-Élu par la Foule',
      aiJudgeBadge: 'Juré IA',
      weightFormula: 'Formule Officielle 50/50 : 50% Moyenne des Juges + 50% Pourcentage du Vote Public',
      judgesWeightLabel: 'Note des Juges (50%)',
      publicWeightLabel: 'Vote du Public (50%)',
      combinedResultTitle: 'Résultat Total Combiné en Direct',
      currentLeader: 'Meneur Actuel sur Hypitt',
      updateScore: 'Note du Juge en Direct',
      scoreCardTitle: 'Feuille de Score Officielle des Juges',
      judgeNotes: 'Notes de délibération',
      confirmDesignation: 'Confirmer les 3 Juges Désignés',
      cancel: 'Annuler',
      deliberationNotice: 'Les notes en direct des juges actualisent immédiatement le vainqueur en temps réel.',
      audiencePoolTitle: 'File des Spectateurs du Public en Direct',
    },
    battleArena: {
      liveStage: 'Scène en Direct',
      prizePot: 'CAGNOTTE VIRTUELLE',
      round: 'MANCHE',
      stepOnStage: 'Monter sur Scène',
      aiJudgeButton: 'Score du Juge IA',
      aiJudgingInProgress: 'Analyse en cours...',
      aiSparringButton: 'Contre-Rimes IA',
      tugOfWarTitle: 'Équilibre 50/50 Public & Juges en Temps Réel',
      publicVoteA: 'Votes',
      publicVoteB: 'Votes',
      freeVote: 'Voter (1 Pièce)',
      superVote5: 'SuperVote (5 Pièces)',
      superVote10: 'SuperVote (10 Pièces)',
      likeBoostNotice: 'Le Like a boosté la compétition et la cagnotte !',
      likeBoostButton: 'Booster par Like (+1 à la Compétition)',
      predictionTitle: 'Paris & Prédictions (Misez vos Pièces Virtuelles)',
      potentialPayout: 'Gain Potentiel',
      lockBet: 'Confirmer le Pari',
      betAmount: 'Montant de la Mise',
      liveAudienceQueue: 'File du Public & Juges Spectateurs',
      liveChatTitle: 'Commentaires & Réactions du Public en Direct',
      sendComment: 'Publier',
      typeComment: 'Écrivez votre réaction ou critique de punchline...',
      cameraUnlockedBanner: 'Caméra Débloquée ! Le compétiteur en tête est désormais en vidéo direct.',
      videoLiveHD: 'Flux Vidéo HD en Direct',
      audioActiveMic: 'Micro Ouvert Audio (Déblocage Caméra si en Tête)',
      speakingLive: 'Sur Scène · Micro Chaud',
      battleRewardsTitle: 'Distribution Automatique des Récompenses (20% Hôte / 80% Compétiteurs)',
      hostCutLabel: '20% Part Virtuelle de l’Hôte & Organisateur',
      battlersCutLabel: '80% Part Proportionnelle des Compétiteurs',
      distributeRewardsBtn: 'Calculer & Distribuer les Récompenses',
      rewardsDistributedNotice: 'Récompenses distribuées automatiquement : 20% pour l’hôte, 80% partagé entre les compétiteurs selon les votes !',
    },
    economy: {
      votingCoinsTitle: 'Pièces de Vote',
      votingCoinsDesc: 'Allocation mensuelle de 100 pièces pour voter dans les compétitions et soutenir les créateurs (1 pièce par vote, 5 ou 10 pour un SuperVote).',
      creatorRewardCoinsTitle: 'Pièces de Récompense Créateur',
      creatorRewardCoinsDesc: 'Récompenses virtuelles gagnées lors des compétitions, parts d’hôte, boosts de likes, et déblocages de contenu à 5 pièces.',
      virtualDisclaimer: 'IMPORTANT : Toutes les pièces et récompenses sont des jetons virtuels 100% simulés SANS valeur financière réelle, SANS paiement en espèces et SANS retrait possible.',
      claimMonthlyStipend: 'Réclamer 100 Pièces de Vote Mensuelles',
      monthlyClaimedBadge: '100 Pièces Mensuelles Réclamées',
      costPerVote: '1 Pièce par Vote Régulier · 5 ou 10 pour SuperVote',
    },
    content: {
      followToUnlockNotice: 'Suivre le créateur pour débloquer la vidéo complète',
      followToUnlockBtn: 'Suivre pour Débloquer',
      followingUnlockedBadge: 'Abonné · Vidéo Complète Débloquée',
      fiveCoinUnlockBtn: 'Débloquer Téléchargement (5 Pièces)',
      downloadedBadge: 'Téléchargé',
      simulatedSalesLabel: 'Ventes de Contenu Simulées',
      contentUnlocksLabel: 'Déblocages de Contenu',
      setVirtualPriceNotice: 'Prix fixé à 5 pièces virtuelles pour la simulation de téléchargement (Sans argent réel).',
    },
    searchFeeds: {
      allContent: 'Tout le Contenu',
      freeBattles: 'Compétitions Gratuites en Direct',
      picturesFeed: 'Flux de Photos',
      videosFeed: 'Flux de Vidéos',
      dreamBattles: 'Compétitions de Rêve Publiques',
      topCreators: 'Meilleurs Créateurs',
      searchPlaceholder: 'Rechercher compétitions gratuites, photos, vidéos, instrumentales, ou créateurs...',
    },
    dashboard: {
      title: 'Tableau de Bord Créateur & Portefeuille Virtuel',
      subtitle: 'Suivez vos deux soldes virtuels séparés, déblocages de contenu, performances en duel et historique des gains.',
      rewardHistoryTitle: 'Historique des Distributions de Récompenses Virtuelles',
      virtualBalancesTitle: 'Soldes Virtuels Séparés',
      followerGrowthTitle: 'Croissance des Abonnés',
      battlePerformanceTitle: 'Bilan des Compétitions',
      simulatedSalesTitle: 'Ventes & Déblocages de Contenu Simulés',
    },
    legal: {
      privacyPolicy: 'Politique de Confidentialité',
      termsOfService: 'Conditions d’Utilisation',
      complianceNotice: 'Conforme RGPD, COPPA & règles des plateformes de streaming en direct.',
    },
    common: {
      coins: 'Pièces',
      followers: 'Abonnés',
      wins: 'Victoires',
      losses: 'Défaites',
      download: 'Télécharger',
      free: 'Gratuit',
      paid: '5 Pièces',
      switchLang: 'Langue / Language',
    },
    profileSection: {
      myProfile: 'Mon Profil',
      creatorDashboard: 'Tableau de Bord & Portefeuille',
      changeCover: 'Changer la Couverture',
      changeAvatar: 'Changer la Photo de Profil',
      postPhoto: 'Publier une Photo',
      postAudio: 'Publier un Audio Court',
      postVideo90: 'Publier une Vidéo Courte (Max 90s)',
      reposts: 'Partages sur le Profil',
      shareToMyProfile: 'Partager sur mon profil',
      repostedSuccess: 'Partagé sur votre fil de profil !',
      videoMaxLimitNotice: 'Les vidéos courtes sont strictement limitées à 90 secondes maximum.',
    },
    liveCompetitions: {
      customDisciplineLabel: 'Thème de Discipline Personnalisé',
      customDisciplinePlaceholder: 'ex. Beatbox Freestyle, Vogue Ballroom, Échecs Rapides Clash...',
      multiStreams: 'Multiples Flux en Direct',
      streamChannels: 'Chaînes en Direct',
      fiveCompetitorsOnStage: 'Jusqu’à 5 Compétiteurs à l’Écran',
      addCompetitorSlot: '+ Ajouter un Compétiteur (Max 5)',
      muteMic: 'Couper Micro',
      unmuteMic: 'Activer Micro',
      turnCamOn: 'Allumer Caméra',
      turnCamOff: 'Éteindre Caméra',
      judgeOnlyClickVote: 'Vote 1-Clic Réservé aux Juges Officiels',
      judgeVoteCastSuccess: 'Score du juge officiel enregistré et affiché publiquement !',
    },
  },
};
