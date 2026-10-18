export interface CuratedIdea {
  id: string;
  name: string;
  tagline: string;
  category: 'roommates' | 'genz-vs-millennials' | 'subcultures' | 'freelance-work';
  nicheTribe: string;
  estimatedTAM: string;
  viralMultiplier: string;
  socialHook: string;
  theArtifact: {
    title: string;
    description: string;
    defaultData: Record<string, string | number>;
  };
  whyItSpreads: string;
  viralLoopSteps: string[];
  launchTactic: string;
  monetization: string;
  mvpBuildDays: number;
  sampleHooks: string[];
}

export interface GeneratedIdeaBlueprint {
  name: string;
  oneLiner: string;
  targetTribe: string;
  theViralArtifact: string;
  theWedge: string;
  theLoop: string[];
  hooks: string[];
  monetizationPlan: string;
  brutalTruth: string;
  mvpFeatures: string[];
  fallback?: boolean;
}

export interface RoastResult {
  roast: string;
  thePivot: string;
  viralArtifactConcept: string;
  viralHooks: string[];
  viralScore: number;
  fallback?: boolean;
}
