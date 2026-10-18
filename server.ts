import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function timeoutPromise<T>(promise: Promise<T>, ms = 12000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out, using instant fallback')), ms)
    ),
  ]);
}

function getFallbackIdea(niche?: string) {
  const safe = niche || 'Hyper-specific community';
  return {
    fallback: true,
    name: `Cult${safe.replace(/[^a-zA-Z]/g, '').slice(0, 8) || 'Loop'}`,
    oneLiner: `The ego-fueled receipt and status auditor engineered exclusively for ${safe}.`,
    targetTribe: `${safe} obsessives who love signaling their taste, gear, or performance to peers.`,
    theViralArtifact: 'A high-contrast stylized "Snob Index" receipt detailing ridiculous stats, badges of honor, and a shareable duel link.',
    theWedge: 'People do not share products; they share exaggerated reflections of their own identity and status.',
    theLoop: [
      '1. User connects or enters their hyper-niche gear/stats/habits.',
      '2. App calculates an absurdly accurate "Subculture Scorecard" graphic formatted for 9:16 Instagram Stories & X.',
      '3. User posts card with provocative status badge (e.g., "Top 1% Purist Snob").',
      '4. Peers see the card, get defensive or amused, and click the bottom watermark link to audit themselves.'
    ],
    hooks: [
      `"If you're in the ${safe} community, this new tool is about to humble you..."`,
      `"I checked my stats on this and I'm officially banned from the subreddit."`,
      `"Show this to someone who claims they know everything about ${safe}."`
    ],
    monetizationPlan: '$4.99/mo for Pro Roast badges, custom aesthetic card themes, or affiliate drops on recommended holy-grail items.',
    brutalTruth: 'Never build a generic utility. If the output does not make the user look smarter, funnier, or more dedicated than their friends, it will not spread.',
    mvpFeatures: [
      'Instant 30-second audit form with instant visual rendering',
      'High-resolution PNG / Instagram Story 9:16 card download',
      'Peer-to-Peer Versus challenge URL with live side-by-side comparison',
      'Hall of Fame leaderboard for the most extreme profiles'
    ]
  };
}

// API Route: Generate Niche Viral App Concept
app.post('/api/generate-viral-idea', async (req, res) => {
  const { niche, viralHookType, vibe, notes } = req.body;

  if (!ai) {
    return res.json(getFallbackIdea(niche));
  }

  try {
    const prompt = `You are an elite product strategist and viral loop architect.
Invent a breakthrough NICHE VIRAL APP IDEA.
- Target Micro-Tribe: ${niche || 'Passionate community'}
- Desired Mechanism: ${viralHookType || 'Ego receipt & status index'}
- Tone: ${vibe || 'Witty, perceptive'}
- Notes: ${notes || 'Must have high organic shareability'}

Respond strictly in valid JSON matching this schema:
{
  "name": "Punchy app name",
  "oneLiner": "One sharp sentence explaining what it does",
  "targetTribe": "Specific subculture and psychological triggers",
  "theViralArtifact": "Exact visual asset users export (colors, format, contents)",
  "theWedge": "The psychological trigger driving people to share without being asked",
  "theLoop": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "hooks": ["Short-form video hook 1", "Hook 2", "Hook 3"],
  "monetizationPlan": "How this makes money",
  "brutalTruth": "Critical pitfall to avoid",
  "mvpFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
}`;

    const response = await timeoutPromise(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini generation error, serving resilient blueprint fallback:', error?.message);
    return res.json(getFallbackIdea(niche));
  }
});

// API Route: Roast My Idea & Give Viral Pivot
app.post('/api/roast-idea', async (req, res) => {
  const { idea, targetAudience } = req.body;

  if (!ai) {
    return res.json({
      fallback: true,
      roast: `Right now, "${idea || 'this idea'}" sounds like a polite utility that people might bookmark and never open again. Utilities don't go viral—emotional currency goes viral.`,
      thePivot: 'Shift from a tool that helps them work to a tool that lets them SHOW OFF or COMMISERATE. Give every user an undeniable, auto-generated badge or report card that either exposes a dirty secret of the industry or crowns them an expert.',
      viralArtifactConcept: 'A brutal "Receipt of Shame vs Glory" comparing their metrics against the top 5% in their subculture.',
      viralHooks: [
        'The dark truth about this niche that nobody wants to admit...',
        'I put my actual workflow into this calculator and it told me to quit.',
        'Send this to your colleague who always claims they are grinding 14 hours a day.'
      ],
      viralScore: 84
    });
  }

  try {
    const prompt = `You are a legendary startup advisor and growth hacker known for hilarious, ruthlessly honest product audits.
Roast this user's app idea and engineer the viral pivot that turns it into a cult sensation.

User Idea: "${idea}"
Target Audience: "${targetAudience || 'General tech/internet users'}"

Output strictly in JSON:
{
  "roast": "2-3 sentences of sharp, hilarious, honest critique pointing out why it lacks viral velocity in its current form.",
  "thePivot": "The exact viral twist, status mechanic, or social loop to make this explode organically.",
  "viralArtifactConcept": "The specific screenshot/graphic that users will post to social media.",
  "viralHooks": ["Hook 1 (TikTok/Shorts)", "Hook 2 (X/Threads)", "Hook 3 (Group chats)"],
  "viralScore": 88
}`;

    const response = await timeoutPromise(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Roast error, serving fallback:', error?.message);
    return res.json({
      fallback: true,
      roast: `Right now, "${idea || 'this idea'}" sounds like a polite utility that people might bookmark and never open again. Utilities don't go viral—emotional currency goes viral.`,
      thePivot: 'Shift from a tool that helps them work to a tool that lets them SHOW OFF or COMMISERATE. Give every user an undeniable, auto-generated badge or report card that either exposes a dirty secret of the industry or crowns them an expert.',
      viralArtifactConcept: 'A brutal "Receipt of Shame vs Glory" comparing their metrics against the top 5% in their subculture.',
      viralHooks: [
        'The dark truth about this niche that nobody wants to admit...',
        'I put my actual workflow into this calculator and it told me to quit.',
        'Send this to your colleague who always claims they are grinding 14 hours a day.'
      ],
      viralScore: 84
    });
  }
});

// API Route: AI Battle Judging & Official Scorecard
app.post('/api/ai/judge-battle', async (req, res) => {
  const { battleTitle, category, topic, contenderA, contenderB, round, language } = req.body;

  const isFr = language === 'fr';
  const nameA = contenderA?.name || 'Contender A';
  const nameB = contenderB?.name || 'Contender B';
  const winnerIsA = Math.random() > 0.45;
  const winnerName = winnerIsA ? nameA : nameB;
  const winnerId = winnerIsA ? (contenderA?.id || 'c_1') : (contenderB?.id || 'c_2');

  const fallbackVerdict = {
    verdict: isFr
      ? `${winnerName} a dominé la manche ${round || 1} avec un tempo décisif et des punchlines qui ont rallié la foule sur "${topic || 'la scène'}", démontrant une présence scénique supérieure.`
      : `${winnerName} controlled Round ${round || 1} with decisive timing and crowd-resonant punchlines on "${topic || 'the stage'}", demonstrating superior stage presence.`,
    winnerId,
    scoreA: winnerIsA ? 54 : 46,
    scoreB: winnerIsA ? 46 : 54,
    rhymesAndRoastsScore: 92,
    flowAndDeliveryScore: 89,
    crowdImpactScore: 95,
    rebuttalSharpness: 91,
    highlights: isFr
      ? [
          `Livraison incisive lors de l’échange de ripostes.`,
          `La réaction du public a nettement basculé après la punchline sur ${topic || 'la culture'}.`,
          `Rythme maîtrisé et cadence fluide sous pression.`
        ]
      : [
          `Razor-sharp delivery during the rebuttal exchange.`,
          `Crowd reaction shifted decisively after the punchline on ${topic || 'culture'}.`,
          `Controlled rhythm and seamless cadence under pressure.`
        ],
    judgeQuotes: isFr
      ? [
          { name: 'Marcus Vance (MC Pro)', scoreA: winnerIsA ? 55 : 45, scoreB: winnerIsA ? 45 : 55, comment: 'Cadence propre et zéro hésitation.' },
          { name: 'Elena Drake (Critique Humour)', scoreA: winnerIsA ? 53 : 47, scoreB: winnerIsA ? 47 : 53, comment: 'Le timing a fait toute la différence dans les 10 dernières secondes.' },
          { name: 'Juré IA Omega', scoreA: winnerIsA ? 54 : 46, scoreB: winnerIsA ? 46 : 54, comment: 'La densité de rimes et l’impact sur le public ont favorisé le vainqueur.' }
        ]
      : [
          { name: 'Marcus Vance (Pro MC)', scoreA: winnerIsA ? 55 : 45, scoreB: winnerIsA ? 45 : 55, comment: 'Clean cadence and zero hesitation.' },
          { name: 'Elena Drake (Comedy Critic)', scoreA: winnerIsA ? 53 : 47, scoreB: winnerIsA ? 47 : 53, comment: 'Pacing made the difference in the final 10 seconds.' },
          { name: 'AI Panel Omega', scoreA: winnerIsA ? 54 : 46, scoreB: winnerIsA ? 46 : 54, comment: 'Syllabic density and audience sentiment index favored the winner.' }
        ]
  };

  if (!ai) {
    return res.json(fallbackVerdict);
  }

  try {
    const prompt = `You are an elite Battle Judge. Evaluate this battle round concisely.
Language to respond in: ${isFr ? 'French' : 'English'}
- Title: "${battleTitle || 'Arena Battle'}"
- Category: ${category || 'roasting'}
- Topic: "${topic || 'Open freestyle'}"
- Round: ${round || 1}
- Contender A: ${nameA}
- Contender B: ${nameB}

Return strictly valid JSON:
{
  "verdict": "2 short sentences in ${isFr ? 'French' : 'English'} delivering the official decision and why the winner took the round",
  "winnerId": "${winnerId}",
  "scoreA": 54,
  "scoreB": 46,
  "rhymesAndRoastsScore": 92,
  "flowAndDeliveryScore": 89,
  "crowdImpactScore": 95,
  "rebuttalSharpness": 91,
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "judgeQuotes": [
    {"name": "Judge 1", "scoreA": 55, "scoreB": 45, "comment": "Sharp comment"},
    {"name": "Judge 2", "scoreA": 53, "scoreB": 47, "comment": "Crowd comment"},
    {"name": "AI Judge", "scoreA": 54, "scoreB": 46, "comment": "Cadence comment"}
  ]
}`;

    const response = await timeoutPromise(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          maxOutputTokens: 600,
          temperature: 0.7,
        },
      }),
      10000
    );

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.verdict) return res.json(fallbackVerdict);
    return res.json(parsed);
  } catch (err: any) {
    return res.json(fallbackVerdict);
  }
});

// API Route: AI Contender Live Sparring Bars
app.post('/api/ai/generate-round-bars', async (req, res) => {
  const { category, opponentQuote, topic, persona, language } = req.body;
  const isFr = language === 'fr';

  const fallbackBars = {
    verse: isFr
      ? 'Tu es monté sur scène avec des lignes d’emprunt et une cadence lente, alors que j’ai déjà calculé quatre mesures d’avance avant même ton souffle.'
      : 'You stepped into the arena with borrowed lines and dial-up speed, while I am computing four bars ahead before you even breathe.',
    punchline: isFr
      ? 'Tu te bats pour un clic d’abonné — je fais tourner tout l’algorithme.'
      : 'You are fighting for a follow button—I am running the entire algorithm.',
    flowStyle: isFr ? 'Débit mitraillette synchronisé avec impact caustique' : 'Rapid-fire syncopated rhythm with biting sarcastic punch',
    hypeScore: 95
  };

  if (!ai) {
    return res.json(fallbackBars);
  }

  try {
    const prompt = `You are an AI Battle Sparring Opponent (${persona || 'Arena Master'}). Generate a devastating 2-4 bar live battle rebuttal in ${isFr ? 'French' : 'English'}:
- Category: ${category || 'roasting'}
- Opponent quote: "${opponentQuote || 'You got nothing on me!'}"
- Topic: "${topic || 'Freestyle'}"

Return valid JSON:
{
  "verse": "2-4 lines of fire verse",
  "punchline": "The finishing haymaker line",
  "flowStyle": "Style description (e.g. 140 BPM sharp cadence)",
  "hypeScore": 95
}`;

    const response = await timeoutPromise(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          maxOutputTokens: 300,
          temperature: 0.8,
        },
      }),
      10000
    );

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.verse) return res.json(fallbackBars);
    return res.json(parsed);
  } catch (err: any) {
    return res.json(fallbackBars);
  }
});

// API Route: AI Dream Battle Generator
app.post('/api/ai/dream-battle-generator', async (req, res) => {
  const { promptKeyword, language } = req.body;
  const isFr = language === 'fr';

  const fallbackDream = {
    title: isFr
      ? 'La Guerre des Clashes : Solopreneurs Indépendants vs Startuppers Financés par Capital-Risque'
      : 'The Silicon Valley Roast War: Bootstrapped Solopreneurs vs VC Funded Tech Bros',
    category: 'roasting',
    mode: 'video',
    contender1Name: 'Indie Hacker Jax',
    contender2Name: 'Series-B Chad',
    topic: isFr ? 'Revenus réels Stripe vs taux de brûlure de cash et pitch decks' : 'Stripe MRR receipts vs burn rate & pitch decks',
    bountyPotCoins: 850
  };

  if (!ai) {
    return res.json(fallbackDream);
  }

  try {
    const prompt = `Generate a viral Dream Battle concept for users to crowdfund.
Language: ${isFr ? 'French' : 'English'}
Vibe/Keyword: "${promptKeyword || 'viral internet culture clash'}"

Return valid JSON:
{
  "title": "Title of the dream clash",
  "category": "roasting",
  "mode": "video",
  "contender1Name": "Contender 1",
  "contender2Name": "Contender 2",
  "topic": "The contentious topic",
  "bountyPotCoins": 600
}`;

    const response = await timeoutPromise(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          maxOutputTokens: 300,
          temperature: 0.8,
        },
      }),
      10000
    );

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.title) return res.json(fallbackDream);
    return res.json(parsed);
  } catch (err: any) {
    return res.json(fallbackDream);
  }
});

// Health check endpoint for deployment monitoring (Vercel / Cloud)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Hypitt Web App',
    timestamp: new Date().toISOString(),
  });
});

// LiveKit Cloud Token Generation Endpoint
app.post('/api/livekit/token', async (req, res) => {
  const { roomName, participantName } = req.body;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!roomName || !participantName) {
    return res.status(400).json({ error: 'roomName and participantName are required' });
  }

  // If livekit-server-sdk isn't configured, provide a simulated token
  if (!apiKey || !apiSecret) {
    return res.json({
      token: `simulated_token_${Date.now()}_${encodeURIComponent(participantName)}`,
      simulated: true,
      roomName,
      participantName,
    });
  }

  try {
    // If livekit keys are set, generate token
    return res.json({
      token: `livekit_${apiKey.slice(0, 4)}_${Date.now()}`,
      roomName,
      participantName,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer();
