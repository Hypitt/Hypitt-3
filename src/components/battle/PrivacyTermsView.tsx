import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2, Lock, Scale, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../utils/i18n';

interface PrivacyTermsViewProps {
  initialTab?: 'privacy' | 'terms';
  language?: Language;
  onBack?: () => void;
}

export const PrivacyTermsView: React.FC<PrivacyTermsViewProps> = ({
  initialTab = 'privacy',
  language = 'en',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);
  const t = TRANSLATIONS[language];

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
              <span>HYPITT LEGAL CENTER</span>
              <span>·</span>
              <span>COMPLIANCE & USER PROTECTION</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-950 font-display tracking-tight">
              {activeTab === 'privacy'
                ? (language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy')
                : (language === 'fr' ? 'Conditions Générales d’Utilisation' : 'Terms of Service')}
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Confidentialité' : 'Privacy Policy'}</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Conditions d’Utilisation' : 'Terms of Service'}</span>
          </button>
        </div>
      </div>

      {/* Compliance highlight notice */}
      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-600 flex items-center gap-2 font-mono">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          {language === 'fr'
            ? 'Dernière mise à jour : 17 Octobre 2026 · Conforme RGPD, COPPA et règles internationales du streaming vidéo interactif.'
            : 'Last Updated: October 17, 2026 · Compliant with GDPR, COPPA and live video streaming regulatory standards.'}
        </span>
      </div>

      {/* Content Section: Privacy Policy */}
      {activeTab === 'privacy' && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 text-xs text-zinc-700 leading-relaxed shadow-xs">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <Lock className="w-4 h-4 text-zinc-700" />
              <span>{language === 'fr' ? '1. Collecte et Données Utilisateur' : '1. Information We Collect'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'Hypitt collecte uniquement les données nécessaires au bon fonctionnement de la plateforme : pseudonyme, adresse e-mail lors de la connexion, photo de profil, photo de couverture, et les médias partagés (photos, extraits audio et vidéos courtes de 90 secondes maximum). Aucune donnée bancaire réelle n’est conservée car tous les jetons et récompenses de la plateforme sont strictement virtuels.'
                : 'Hypitt collects only essential information required to operate the interactive battle experience: your display name, username handle, email via 1-click authentication, uploaded profile and cover photos, and published media assets (photos, audio stems, and short videos under 90 seconds). We do not collect credit cards or financial credentials as all platform tokens and coins are strictly virtual.'}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-700" />
              <span>{language === 'fr' ? '2. Autorisations de Caméra et Microphone' : '2. Camera & Microphone Permissions'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'Lorsque vous participez à une compétition en direct ou montez sur scène (Hot Mic), le navigateur vous demande l’accès au microphone et/ou à la caméra. Cet accès est exclusivement utilisé pour diffuser votre prestation en direct aux spectateurs et juges. Vous conservez le contrôle total pour couper ou réactiver votre microphone et masquer votre caméra à tout moment.'
                : 'When stepping onto the live competition stage or joining a Hot Mic slot, your browser requests local microphone and camera device permissions. This stream is broadcast exclusively to active session spectators and designated judges in real time. You retain constant self-control to mute/unmute your audio and turn off your video feed at any time.'}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <Scale className="w-4 h-4 text-zinc-700" />
              <span>{language === 'fr' ? '3. Modération et Protection des Données' : '3. Content Moderation & Data Protection'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'Les hôtes et organisateurs agissent en qualité de modérateurs de scène et disposent de la prérogative de couper le son d’un compétiteur ou de retirer un participant en cas de non-respect des règles de communauté. Vos données ne sont jamais vendues à des courtiers tiers. Vous pouvez demander la suppression définitive de votre compte et de vos médias à tout moment.'
                : 'Hosts and designated room moderators retain supervisory authority to mute participant microphones or remove competitors who violate community conduct standards. Your personal data is never sold or brokered to advertisers. You may request account and media removal at any time via your profile settings.'}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zinc-700" />
              <span>{language === 'fr' ? '4. Droits RGPD et Conformité' : '4. GDPR & User Rights'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'Conformément au RGPD et aux normes internationales de confidentialité, vous disposez d’un droit d’accès, de rectification, de portabilité et d’effacement de vos données personnelles. Pour toute demande légale, contactez : privacy@hypitt.com.'
                : 'In accordance with GDPR and global privacy standards, you have the right to access, rectify, export, and delete your personal information. For legal and privacy inquiries, reach out to: privacy@hypitt.com.'}
            </p>
          </div>
        </div>
      )}

      {/* Content Section: Terms of Service */}
      {activeTab === 'terms' && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 text-xs text-zinc-700 leading-relaxed shadow-xs">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <Scale className="w-4 h-4 text-zinc-700" />
              <span>{language === 'fr' ? '1. Acceptation des Conditions' : '1. Acceptance of Terms'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'En accédant à Hypitt, vous acceptez sans réserve les présentes Conditions Générales d’Utilisation. La plateforme s’adresse aux créateurs, compétiteurs artistiques et spectateurs passionnés de danse, chant, débat, freestyle, et stand-up.'
                : 'By accessing or using the Hypitt platform, you agree to be bound by these Terms of Service. The service is dedicated to creative performers, battlers, and spectators celebrating live dance, vocals, debate, roasts, and open-mic expression.'}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{language === 'fr' ? '2. Pièces Virtuelles et Absence de Valeur Réelle' : '2. Virtual Coins & Disclaimer'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'IMPORTANT : Toutes les pièces (pièces de vote mensuelles de 100 unités et pièces de récompense créateur) sont des jetons virtuels strictement simulés pour animer les votes, les pourboires et le déblocage de contenus. Ils ne possèdent aucune valeur monétaire réelle, ne sont pas convertibles en espèces et ne constituent aucun placement financier.'
                : 'IMPORTANT: All virtual coins (including monthly 100 voting coin stipends and creator reward balances) are simulated platform tokens designed solely for interactive voting, content unlocking, and community recognition. They hold zero monetary value, cannot be cashed out, and do not constitute legal tender or investment assets.'}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-700" />
              <span>{language === 'fr' ? '3. Règles des Compétitions en Direct et Scène Ouverte' : '3. Live Competition & Stage Rules'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'Chaque scène de compétition accueille jusqu’à 5 compétiteurs simultanément sur un seul écran. Les compétiteurs peuvent contrôler leur microphone et leur caméra. L’hôte de la compétition, en tant que modérateur, dispose du pouvoir de couper le son ou de modérer un compétiteur perturbateur. Les propos haineux, violents, diffamatoires ou contraires aux lois sont formellement prohibés et entraînent le bannissement immédiat.'
                : 'Live stages support up to 5 concurrent competitors on screen. Performers can control their own audio and video streams. The battle host, as session moderator, holds authority to mute participant audio or unseat participants who disrupt the event. Harassment, hate speech, or non-consensual content are strictly forbidden and trigger immediate suspension.'}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-700" />
              <span>{language === 'fr' ? '4. Règles de Publication de Contenu (90s Vidéo Max)' : '4. Media Content Guidelines (90s Max Video)'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'Les utilisateurs peuvent publier des photos, des extraits audio et des vidéos courtes. La durée maximale autorisée pour une vidéo est strictement limitée à 90 secondes. Vous certifiez détenir les droits sur les œuvres musicales et visuelles publiées.'
                : 'Users may upload images, audio stems, and short video clips. Video uploads are strictly capped at a 90-second duration limit. You represent and warrant that you own or possess the necessary rights and licenses for all published creative works.'}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 font-display flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zinc-700" />
              <span>{language === 'fr' ? '5. Rôle des Juges et Système de Vote' : '5. Judging Tribunal & Voting Formula'}</span>
            </h2>
            <p>
              {language === 'fr'
                ? 'Les juges désignés bénéficient d’une option exclusive "Cliquer pour Voter" avec un barème officiel. Les spectateurs peuvent exprimer leurs votes réguliers ou SuperVotes. Les décisions du tribunal et les résultats combinés sont calculés en temps réel et font foi pour la distribution virtuelle des récompenses.'
                : 'Designated tribunal judges enjoy exclusive Click-to-Vote pad functionality. Audience members participate via single votes or SuperVotes. Live results combine judge scores and spectator votes in real time to conclude rounds and allocate virtual pot shares.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
