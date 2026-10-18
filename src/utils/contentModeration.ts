// Automatic content safety filter to detect and block sexual, violent, or harmful content
const SEXUAL_PATTERNS = [
  /\b(nsfw|porn|pornography|sex|sexual|nudity|nude|xxx|erotic|hardcore|blowjob|cock|penis|vagina|boobs|tits|anal|incest)\b/i,
  /\b(camgirl|onlyfans leaked|escort|hooker|prostitute|horny|orgasm)\b/i,
];

const VIOLENT_PATTERNS = [
  /\b(kill yourself|suicide|decapitate|slaughter|murder|massacre|genocide|bloodbath)\b/i,
  /\b(shoot up|stab to death|bombing|terrorist attack|behead|torture|lynch)\b/i,
  /\b(gore|snuff|mutilation|hang yourself)\b/i,
];

export interface ModerationResult {
  isSafe: boolean;
  violationType?: 'sexual' | 'violent';
  reasonEn?: string;
  reasonFr?: string;
}

export function checkContentSafety(text: string): ModerationResult {
  if (!text) return { isSafe: true };

  for (const pattern of SEXUAL_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isSafe: false,
        violationType: 'sexual',
        reasonEn: 'Content blocked: Explicit sexual or adult content is strictly prohibited on Hypitt.',
        reasonFr: 'Contenu bloqué : Le contenu sexuel ou explicite pour adultes est strictement interdit sur Hypitt.',
      };
    }
  }

  for (const pattern of VIOLENT_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isSafe: false,
        violationType: 'violent',
        reasonEn: 'Content blocked: Violent, harmful, or graphic content is strictly prohibited on Hypitt.',
        reasonFr: 'Contenu bloqué : Le contenu violent ou graphique est strictement interdit sur Hypitt.',
      };
    }
  }

  return { isSafe: true };
}
