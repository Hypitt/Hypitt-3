import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ChatMessage, UserProfile, BattleCategory, ConversationMember } from '../../types/battleTypes';
import {
  Phone,
  Video,
  Send,
  Paperclip,
  FileText,
  Music,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Download,
  Users,
  Search,
  Plus,
  Play,
  Pause,
  Mic,
  MicOff,
  Flame,
  Heart,
  Smile,
  X,
  Eye,
  Info,
  ShieldCheck,
  Swords,
  ChevronRight,
  MoreVertical,
  Reply,
  CornerDownRight,
  User as UserIcon
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { DocPreviewModal } from './DocPreviewModal';
import { Language } from '../../utils/i18n';

interface MessagesCallsViewProps {
  conversations: Conversation[];
  activeConvId: string;
  onSelectConv: (id: string) => void;
  onStartCall: (type: 'audio' | 'video', name: string, isGroup: boolean) => void;
  user: UserProfile;
  onViewProfile?: (creator: any) => void;
  language?: Language;
}

export const MessagesCallsView: React.FC<MessagesCallsViewProps> = ({
  conversations,
  activeConvId,
  onSelectConv,
  onStartCall,
  user,
  onViewProfile,
  language = 'en',
}) => {
  const [convList, setConvList] = useState<Conversation[]>(conversations);
  const [activeId, setActiveId] = useState<string>(activeConvId || conversations[0]?.id || 'conv_1');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'group' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  // Replying to a specific message
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);

  // Typing indicator simulation
  const [isTypingPartner, setIsTypingPartner] = useState<boolean>(false);

  // Document upload state
  const [selectedAttachment, setSelectedAttachment] = useState<{
    name: string;
    size: string;
    type: 'doc' | 'audio' | 'image' | 'video';
    description?: string;
  } | null>(null);

  // Voice note recording simulation
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  // Preview Document Modal state
  const [previewDoc, setPreviewDoc] = useState<{
    name: string;
    size: string;
    type: 'doc' | 'audio' | 'image' | 'video';
    description?: string;
  } | null>(null);

  // Voice playback simulation
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // New Chat & New Group modals
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSelectedMembers, setNewGroupSelectedMembers] = useState<string[]>([]);

  // Right Drawer Info
  const [showInfoSidebar, setShowInfoSidebar] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep convList synced with prop changes
  useEffect(() => {
    if (activeConvId && activeConvId !== activeId) {
      setActiveId(activeConvId);
    }
  }, [activeConvId]);

  const currentConv = convList.find((c) => c.id === activeId) || convList[0] || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConv?.messages?.length, isTypingPartner]);

  // Candidates for starting a chat
  const platformContacts = [
    { id: 'c_1', name: 'Kai Skater', handle: '@kai_skates', avatar: 'KS', role: 'Roast Champion', bio: 'Street freestyler and skate crew host.' },
    { id: 'c_2', name: 'Sarah Chemex', handle: '@sarah_pourover', avatar: 'SC', role: 'Debater', bio: 'Millennial culture finalist defending single-origin coffee.' },
    { id: 'c_3', name: 'Malik Moves', handle: '@malik_steps', avatar: 'MM', role: 'Krump Dancer', bio: 'Choreographer and Krump battle finalist.' },
    { id: 'c_5', name: 'Jordan Melody', handle: '@jordan_vocals', avatar: 'JM', role: 'Vocal Producer', bio: 'Neo-soul singer and 24-bit stem creator.' },
    { id: 'c_9', name: 'Sammy Jokez', handle: '@sammy_standup', avatar: 'SJ', role: 'Standup Comedian', bio: 'Live comedy club champion and roast judge.' },
  ];

  // Filter conversations
  const filteredConversations = convList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'direct') return c.type === 'direct';
    if (filterType === 'group') return c.type === 'group';
    if (filterType === 'unread') return c.unreadCount > 0;
    return true;
  });

  // Handle Send Text / Reply / Attachment
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedAttachment) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      text: inputText.trim(),
      timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
      attachment: selectedAttachment || undefined,
      status: 'sent',
      replyTo: replyingToMessage
        ? {
            id: replyingToMessage.id,
            senderName: replyingToMessage.senderName,
            text: replyingToMessage.text || 'Attached media',
          }
        : undefined,
    };

    setConvList((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          const updatedShared = selectedAttachment
            ? [
                {
                  name: selectedAttachment.name,
                  size: selectedAttachment.size,
                  type: selectedAttachment.type === 'audio' ? ('audio' as const) : ('doc' as const),
                  timestamp: 'Today',
                },
                ...(c.sharedDocs || []),
              ]
            : c.sharedDocs;

          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: newMsg.text || `Attached ${newMsg.attachment?.name}`,
            lastMessageTime: language === 'fr' ? 'À l’instant' : 'Just now',
            sharedDocs: updatedShared,
          };
        }
        return c;
      })
    );

    sounds.playCheer();
    setInputText('');
    setSelectedAttachment(null);
    setReplyingToMessage(null);

    // Interactive automated reply if direct conversation
    if (currentConv && currentConv.type === 'direct') {
      const partnerName = currentConv.name;
      const partnerAvatar = currentConv.avatar;

      setTimeout(() => {
        setIsTypingPartner(true);
      }, 700);

      setTimeout(() => {
        setIsTypingPartner(false);
        const replyPool = language === 'fr' ? [
          `Bien reçu ton message ! Je suis chaud pour notre prochaine compétition sur Hypitt.`,
          `Merci pour ta réponse ! On règle les critères de vote et on monte sur scène.`,
          `Super, j'ai vu tes créations sur Hypitt. Prêt quand tu veux pour concourir !`,
          `Parfait, on se capte en direct sur la scène Hypitt !`
        ] : [
          `Got your message! I'm gearing up for the next live competition on Hypitt.`,
          `Appreciate your reply! Let's lock in the rules and step on stage.`,
          `Awesome, checked your Hypitt showcase. Ready whenever you are to compete!`,
          `Locked in. Catch you live on stage soon!`
        ];

        const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];

        const automatedReply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: `partner_${Date.now()}`,
          senderName: partnerName,
          senderAvatar: partnerAvatar,
          text: randomReply,
          timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
          status: 'read',
          replyTo: {
            id: newMsg.id,
            senderName: user.name,
            text: newMsg.text || 'Message',
          },
        };

        setConvList((prev) =>
          prev.map((c) => {
            if (c.id === activeId) {
              return {
                ...c,
                messages: [...c.messages, automatedReply],
                lastMessage: automatedReply.text,
                lastMessageTime: language === 'fr' ? 'À l’instant' : 'Just now',
              };
            }
            return c;
          })
        );
        sounds.playVineBoom();
      }, 2100);
    }
  };

  // Handle Voice Note Record
  const handleStartVoiceRecording = () => {
    sounds.playVineBoom();
    setIsRecordingVoice(true);
    setVoiceSeconds(0);
    const interval = setInterval(() => {
      setVoiceSeconds((prev) => {
        if (prev >= 60) {
          clearInterval(interval);
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleCancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    setVoiceSeconds(0);
  };

  const handleSendVoiceNote = () => {
    sounds.playCheer();
    setIsRecordingVoice(false);
    const newVoiceMsg: ChatMessage = {
      id: `vn_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      text: '',
      timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
      isVoiceNote: true,
      voiceDuration: `0:${voiceSeconds < 10 ? '0' : ''}${voiceSeconds}`,
      status: 'sent',
      replyTo: replyingToMessage
        ? {
            id: replyingToMessage.id,
            senderName: replyingToMessage.senderName,
            text: replyingToMessage.text || 'Voice reply',
          }
        : undefined,
    };

    setConvList((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: [...c.messages, newVoiceMsg],
            lastMessage: `Voice note (${newVoiceMsg.voiceDuration})`,
            lastMessageTime: language === 'fr' ? 'À l’instant' : 'Just now',
          };
        }
        return c;
      })
    );

    setReplyingToMessage(null);
  };

  // Reactions
  const handleToggleReaction = (msgId: string, emoji: string) => {
    sounds.playVineBoom();
    setConvList((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          const updatedMsgs = c.messages.map((m) => {
            if (m.id === msgId) {
              const reactions = { ...(m.reactions || {}) };
              let userReaction = m.userReaction;
              if (userReaction === emoji) {
                reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
                if (reactions[emoji] === 0) delete reactions[emoji];
                userReaction = undefined;
              } else {
                reactions[emoji] = (reactions[emoji] || 0) + 1;
                userReaction = emoji;
              }
              return { ...m, reactions, userReaction };
            }
            return m;
          });
          return { ...c, messages: updatedMsgs };
        }
        return c;
      })
    );
  };

  // Attach Preset Document
  const handleAttachPresetDoc = (name: string, size: string, type: 'doc' | 'audio', description?: string) => {
    sounds.playVineBoom();
    setSelectedAttachment({ name, size, type, description });
  };

  // Start new 1-on-1 chat
  const handleStartPrivateChat = (contact: typeof platformContacts[0]) => {
    sounds.playCheer();
    const existing = convList.find((c) => c.name.toLowerCase() === contact.name.toLowerCase());
    if (existing) {
      setActiveId(existing.id);
      onSelectConv(existing.id);
    } else {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        type: 'direct',
        name: contact.name,
        handle: contact.handle,
        avatar: contact.avatar,
        status: language === 'fr' ? 'En ligne' : 'Active Now',
        isOnline: true,
        lastMessage: language === 'fr' ? 'Conversation privée ouverte' : 'Started private conversation',
        lastMessageTime: language === 'fr' ? 'À l’instant' : 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `init_${Date.now()}`,
            senderId: contact.id,
            senderName: contact.name,
            senderAvatar: contact.avatar,
            text: language === 'fr'
              ? `Salut ! Prêt à échanger et concourir sur Hypitt.`
              : `Hey ${user.name}! Ready to connect and compete on Hypitt.`,
            timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
            status: 'read',
          },
        ],
        sharedDocs: [],
      };
      setConvList([newConv, ...convList]);
      setActiveId(newConv.id);
      onSelectConv(newConv.id);
    }
    setShowNewChatModal(false);
  };

  // Create new Group Squad
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    sounds.playCheer();
    const membersList: ConversationMember[] = newGroupSelectedMembers.map((id) => {
      const c = platformContacts.find((p) => p.id === id);
      return {
        id: c?.id || id,
        name: c?.name || 'Creator',
        handle: c?.handle || '@member',
        avatar: c?.avatar || 'CR',
        role: 'member' as const,
        isOnline: true,
      };
    });

    membersList.push({
      id: user.id,
      name: user.name,
      handle: user.handle,
      avatar: user.avatar,
      role: 'admin' as const,
      isOnline: true,
    });

    const newGroupConv: Conversation = {
      id: `group_${Date.now()}`,
      type: 'group',
      name: newGroupName.trim(),
      handle: `@${newGroupName.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: newGroupName.slice(0, 2).toUpperCase(),
      status: language === 'fr' ? 'Équipe formée · Prête pour la compétition' : 'Squad Formed · Ready to Compete',
      isOnline: true,
      membersCount: membersList.length,
      members: membersList,
      lastMessage: language === 'fr' ? 'Équipe créée. Appels et partage actifs.' : 'Squad created. Group calls and document sharing enabled.',
      lastMessageTime: language === 'fr' ? 'À l’instant' : 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `gm_init_${Date.now()}`,
          senderId: user.id,
          senderName: user.name,
          senderAvatar: user.avatar,
          text: language === 'fr'
            ? `Bienvenue dans ${newGroupName.trim()} ! Les appels audio & vidéo de groupe et le partage de documents sont actifs.`
            : `Welcome to ${newGroupName.trim()}! Group audio & video calls and document sharing are active.`,
          timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
          status: 'read',
        },
      ],
      sharedDocs: [],
    };

    setConvList([newGroupConv, ...convList]);
    setActiveId(newGroupConv.id);
    onSelectConv(newGroupConv.id);
    setShowNewGroupModal(false);
    setNewGroupName('');
    setNewGroupSelectedMembers([]);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-950 text-white text-xs font-mono rounded-xl shadow-2xl border border-zinc-700 animate-in fade-in flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
            <span>{language === 'fr' ? 'SUITE DE COMMUNICATION' : 'COMMUNICATION SUITE'}</span>
            <span>·</span>
            <span>{language === 'fr' ? 'CHATS PRIVÉS & RÉPONSES' : 'PRIVATE DMS & REPLIES'}</span>
            <span>·</span>
            <span>{language === 'fr' ? 'APPELS AUDIO/VIDÉO HD' : 'HD AUDIO & VIDEO CALLS'}</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 font-display tracking-tight">
            {language === 'fr' ? 'Messages Privés, Équipes & Appels' : 'Direct Messages, Squads & Calls'}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {language === 'fr'
              ? 'Ouvrez un chat, répondez directement aux messages, lancez des appels vidéo et proposez des défis de compétition.'
              : 'Open any conversation, reply directly to messages with quotes, conduct calls, and propose live challenges.'}
          </p>
        </div>

        {/* Top Action Buttons: New Private Chat & New Squad Group */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewChatModal(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-600" />
            <span>{language === 'fr' ? 'Nouveau Chat Privé' : 'New Private Chat'}</span>
          </button>
          <button
            onClick={() => setShowNewGroupModal(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-zinc-900 hover:bg-black text-white rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Créer une Équipe' : 'Create Squad Group'}</span>
          </button>
        </div>
      </div>

      {/* Main Messenger UI Container */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col md:flex-row min-h-[640px] max-h-[750px] overflow-hidden">
        
        {/* Left Column: Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-zinc-200 flex flex-col bg-zinc-50/50">
          
          {/* Search & Filter Header */}
          <div className="p-3.5 border-b border-zinc-200 space-y-2 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'fr' ? 'Rechercher discussions ou contacts...' : 'Search chats, creators, squads...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {[
                { id: 'all', label: language === 'fr' ? 'Tous' : 'All' },
                { id: 'direct', label: language === 'fr' ? 'Privé' : 'DMs' },
                { id: 'group', label: language === 'fr' ? 'Équipes' : 'Squads' },
                { id: 'unread', label: language === 'fr' ? 'Non lus' : 'Unread' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id as any)}
                  className={`flex-1 py-1 rounded-lg text-center transition cursor-pointer ${
                    filterType === f.id
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400 font-mono">
                {language === 'fr' ? 'Aucune conversation trouvée' : 'No conversations found'}
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === activeId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveId(c.id);
                      onSelectConv(c.id);
                      setReplyingToMessage(null);
                    }}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                      isSelected ? 'bg-zinc-100/90 border-l-4 border-zinc-950' : 'hover:bg-zinc-100/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center font-mono font-bold text-xs text-zinc-800">
                        {c.avatar}
                      </div>
                      {c.isOnline && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute bottom-0 right-0" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-zinc-900 truncate">{c.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono shrink-0 ml-1">
                          {c.lastMessageTime}
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-500 truncate mt-0.5 font-sans">
                        {c.lastMessage}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-mono text-zinc-400">
                        {c.type === 'group' ? (
                          <span className="flex items-center gap-1 text-zinc-600">
                            <Users className="w-3 h-3" />
                            <span>{c.membersCount || 4} members</span>
                          </span>
                        ) : (
                          <span>{c.handle}</span>
                        )}
                        {c.unreadCount > 0 && (
                          <span className="ml-auto px-1.5 py-0.2 bg-zinc-950 text-white rounded-full text-[9px] font-bold">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center / Right Column: Active Conversation Stream */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          
          {/* Conversation Top Header */}
          <div className="p-3.5 border-b border-zinc-200 flex items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div
                onClick={() => onViewProfile && onViewProfile({ name: currentConv.name, handle: currentConv.handle, avatar: currentConv.avatar })}
                className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono font-bold text-xs text-zinc-800 shrink-0 cursor-pointer hover:opacity-80 transition"
                title="View Creator Profile"
              >
                {currentConv.avatar}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    onClick={() => onViewProfile && onViewProfile({ name: currentConv.name, handle: currentConv.handle, avatar: currentConv.avatar })}
                    className="font-bold text-sm text-zinc-900 truncate font-display cursor-pointer hover:underline"
                  >
                    {currentConv.name}
                  </h3>
                  {currentConv.type === 'group' && (
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[9px] font-mono font-bold uppercase border border-zinc-200">
                      Squad
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <span>{currentConv.status}</span>
                  {onViewProfile && currentConv.type === 'direct' && (
                    <>
                      <span>·</span>
                      <button
                        onClick={() => onViewProfile({ name: currentConv.name, handle: currentConv.handle, avatar: currentConv.avatar })}
                        className="text-zinc-800 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <UserIcon className="w-2.5 h-2.5" />
                        <span>{language === 'fr' ? 'Voir Profil' : 'View Profile'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Call & Action Icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() =>
                  onStartCall('audio', currentConv.name, currentConv.type === 'group')
                }
                className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Start Voice Call"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Audio' : 'Voice'}</span>
              </button>

              <button
                onClick={() =>
                  onStartCall('video', currentConv.name, currentConv.type === 'group')
                }
                className="p-2 bg-zinc-900 hover:bg-black text-white rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs"
                title="Start Video Call"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Vidéo' : 'Video'}</span>
              </button>

              <button
                onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  showInfoSidebar
                    ? 'bg-zinc-100 border-zinc-300 text-zinc-900'
                    : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900'
                }`}
                title="Conversation Info"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/40">
            {currentConv.messages.map((m) => {
              const isMine = m.senderId === user.id;

              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 max-w-[85%] relative group ${
                    isMine ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    onClick={() => onViewProfile && onViewProfile({ name: m.senderName, avatar: m.senderAvatar })}
                    className="w-7 h-7 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-800 shrink-0 cursor-pointer hover:opacity-80"
                    title={`View ${m.senderName}'s Profile`}
                  >
                    {m.senderAvatar}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`text-[10px] font-mono text-zinc-400 flex items-center gap-2 ${
                        isMine ? 'justify-end' : ''
                      }`}
                    >
                      <span className="font-semibold">{m.senderName}</span>
                      <span>·</span>
                      <span>{m.timestamp}</span>
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs relative ${
                        isMine
                          ? 'bg-zinc-900 text-white rounded-tr-none'
                          : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                      }`}
                    >
                      {/* Quoted Reply Block */}
                      {m.replyTo && (
                        <div
                          className={`mb-2 p-2 rounded-lg border-l-2 text-[11px] ${
                            isMine
                              ? 'bg-zinc-800 border-amber-400 text-zinc-300'
                              : 'bg-zinc-100 border-zinc-900 text-zinc-600'
                          }`}
                        >
                          <div className="font-bold text-[10px] flex items-center gap-1">
                            <CornerDownRight className="w-2.5 h-2.5 text-amber-500" />
                            <span>{m.replyTo.senderName}</span>
                          </div>
                          <p className="truncate line-clamp-1 italic text-[10px] opacity-90 mt-0.5">
                            "{m.replyTo.text}"
                          </p>
                        </div>
                      )}

                      {/* Regular Text */}
                      {m.text && !m.isVoiceNote && <p>{m.text}</p>}

                      {/* Voice Note Player */}
                      {m.isVoiceNote && (
                        <div className="flex items-center gap-3 py-1">
                          <button
                            onClick={() => {
                              sounds.playVineBoom();
                              setPlayingVoiceId(playingVoiceId === m.id ? null : m.id);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                              isMine ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
                            }`}
                          >
                            {playingVoiceId === m.id ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5 ml-0.5" />
                            )}
                          </button>

                          {/* Sound wave visualizer bars */}
                          <div className="flex items-center gap-0.5 h-5 flex-1 max-w-[140px]">
                            {[6, 12, 18, 10, 14, 20, 15, 8, 16, 22, 14, 18, 9, 12].map((h, idx) => (
                              <div
                                key={idx}
                                style={{ height: `${h}px` }}
                                className={`w-1 rounded-full ${
                                  playingVoiceId === m.id
                                    ? isMine ? 'bg-amber-300 animate-pulse' : 'bg-emerald-600 animate-pulse'
                                    : isMine ? 'bg-zinc-600' : 'bg-zinc-300'
                                }`}
                              />
                            ))}
                          </div>

                          <span className="text-[10px] font-mono opacity-80 font-bold">
                            {m.voiceDuration || '0:20'}
                          </span>
                        </div>
                      )}

                      {/* Document Attachment Card */}
                      {m.attachment && (
                        <div
                          className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                            isMine
                              ? 'bg-zinc-800 border-zinc-700 text-white'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {m.attachment.type === 'audio' ? (
                              <Music className="w-4 h-4 text-amber-500 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                            )}
                            <div className="truncate text-left">
                              <div className="font-bold text-[11px] truncate max-w-[150px]">
                                {m.attachment.name}
                              </div>
                              <div className="text-[9px] opacity-70 font-mono">
                                {m.attachment.size} · Verified Stems/Doc
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setPreviewDoc(m.attachment!)}
                              className="p-1.5 rounded-lg bg-zinc-700/40 hover:bg-zinc-700 transition cursor-pointer"
                              title="Preview Document Inside App"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                sounds.playCheer();
                                setToastNotice(`Downloading ${m.attachment?.name}... File saved to local downloads.`);
                                setTimeout(() => setToastNotice(null), 3500);
                              }}
                              className="p-1.5 rounded-lg bg-zinc-700/40 hover:bg-zinc-700 transition cursor-pointer"
                              title="Download File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Read receipts indicator */}
                      {isMine && (
                        <div className="flex justify-end items-center gap-1 mt-1 text-[9px] opacity-60 font-mono">
                          <span>Delivered</span>
                          <CheckCheck className="w-3 h-3 text-emerald-400" />
                        </div>
                      )}
                    </div>

                    {/* Reactions Display */}
                    {m.reactions && Object.keys(m.reactions).length > 0 && (
                      <div className={`flex flex-wrap gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                        {Object.entries(m.reactions).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(m.id, emoji)}
                            className={`px-2 py-0.5 rounded-full text-[11px] font-mono border flex items-center gap-1 cursor-pointer transition ${
                              m.userReaction === emoji
                                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span className="text-[9px] font-bold">{count}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply & Reaction Hover Bar */}
                    <div className="opacity-0 group-hover:opacity-100 transition absolute -top-3 right-2 flex items-center gap-1 bg-white border border-zinc-200 rounded-full px-2 py-0.5 shadow-sm z-10">
                      {/* Explicit Reply Button */}
                      <button
                        onClick={() => {
                          sounds.playVineBoom();
                          setReplyingToMessage(m);
                        }}
                        className="flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-700 hover:text-zinc-950 px-1 py-0.5 rounded hover:bg-zinc-100 transition cursor-pointer"
                        title={language === 'fr' ? 'Répondre à ce message' : 'Reply to this message'}
                      >
                        <Reply className="w-3 h-3 text-zinc-600" />
                        <span>{language === 'fr' ? 'Répondre' : 'Reply'}</span>
                      </button>

                      <span className="w-px h-3 bg-zinc-200 mx-0.5" />

                      {['🔥', '❤️', '👏', '💯', '🎤'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(m.id, emoji)}
                          className="hover:scale-125 transition text-xs cursor-pointer p-0.5"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Partner Typing Indicator */}
            {isTypingPartner && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono py-1 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-[9px]">
                  {currentConv.avatar}
                </div>
                <span>{currentConv.name} {language === 'fr' ? 'est en train d’écrire...' : 'is typing...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Document Chips */}
          <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-200 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
            <span className="text-zinc-500 uppercase text-[10px] shrink-0 font-bold">
              {language === 'fr' ? 'Partage Rapide :' : 'Quick Stems & Docs:'}
            </span>
            <button
              onClick={() =>
                handleAttachPresetDoc('Competition_Rules_Hypitt.pdf', '1.2 MB', 'doc', 'Official arena rules & scoring breakdown')
              }
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 shrink-0 transition cursor-pointer shadow-2xs"
            >
              Competition_Rules.pdf
            </button>
            <button
              onClick={() =>
                handleAttachPresetDoc('Cypher_Beat_140BPM_Stems.wav', '18.4 MB', 'audio', '24-bit 140BPM cypher master stems')
              }
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 shrink-0 transition cursor-pointer shadow-2xs"
            >
              140BPM_Stems.wav
            </button>
            <button
              onClick={() =>
                handleAttachPresetDoc('Freestyle_Punchlines_Notes.txt', '24 KB', 'doc', 'Draft lyrics and rebuttal notes')
              }
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 shrink-0 transition cursor-pointer shadow-2xs"
            >
              Punchlines.txt
            </button>
          </div>

          {/* Composer Area with Reply-to-Quote Preview */}
          <div className="p-3 border-t border-zinc-200 bg-white">
            
            {/* Replying-To Preview Banner */}
            {replyingToMessage && (
              <div className="mb-2 p-2 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2 truncate">
                  <Reply className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span className="font-bold text-zinc-900">{replyingToMessage.senderName}:</span>
                  <span className="text-zinc-600 truncate italic">
                    "{replyingToMessage.text?.slice(0, 70) || 'Attachment'}"
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingToMessage(null)}
                  className="p-1 text-zinc-400 hover:text-zinc-900 cursor-pointer"
                  title="Cancel reply"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Attached file chip */}
            {selectedAttachment && (
              <div className="mb-2 p-2 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-between text-xs font-mono text-zinc-800">
                <div className="flex items-center gap-2 truncate">
                  {selectedAttachment.type === 'audio' ? <Music className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  <span className="truncate">Ready to share: {selectedAttachment.name} ({selectedAttachment.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAttachment(null)}
                  className="text-zinc-400 hover:text-zinc-900 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Voice Recording In-Progress Banner */}
            {isRecordingVoice ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="text-xs font-bold text-red-900 font-mono">
                    Recording Voice Note... 0:{voiceSeconds < 10 ? '0' : ''}{voiceSeconds}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelVoiceRecording}
                    className="px-3 py-1 bg-white border border-red-200 text-red-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendVoiceNote}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Send Audio</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Paperclip attachment button */}
                <button
                  type="button"
                  onClick={() =>
                    handleAttachPresetDoc(
                      `Competition_Contract_${Date.now().toString().slice(-4)}.pdf`,
                      '1.8 MB',
                      'doc',
                      'Custom competition rules and stake terms'
                    )
                  }
                  className="p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
                  title="Attach Document or Stems"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Voice Note record button */}
                <button
                  type="button"
                  onClick={handleStartVoiceRecording}
                  className="p-2.5 text-zinc-500 hover:text-red-600 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
                  title="Record Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    replyingToMessage
                      ? (language === 'fr' ? `Répondre à ${replyingToMessage.senderName}...` : `Replying to ${replyingToMessage.senderName}...`)
                      : (language === 'fr' ? 'Écrire un message privé ou répondre...' : 'Send a private message or reply...')
                  }
                  className="flex-1 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-zinc-900 outline-none transition"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedAttachment}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-black disabled:opacity-40 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>{replyingToMessage ? (language === 'fr' ? 'Répondre' : 'Reply') : (language === 'fr' ? 'Envoyer' : 'Send')}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Info & Shared Stems Drawer */}
        {showInfoSidebar && (
          <div className="w-72 border-l border-zinc-200 p-4 space-y-4 bg-zinc-50/70 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h4 className="text-xs font-bold font-mono uppercase text-zinc-900">
                {language === 'fr' ? 'Détails du Chat' : 'Conversation Info'}
              </h4>
              <button
                onClick={() => setShowInfoSidebar(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div
                onClick={() => onViewProfile && onViewProfile({ name: currentConv.name, handle: currentConv.handle, avatar: currentConv.avatar })}
                className="w-14 h-14 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center font-mono font-bold text-sm text-zinc-800 mx-auto cursor-pointer hover:opacity-80"
              >
                {currentConv.avatar}
              </div>
              <div className="font-bold text-xs text-zinc-900">{currentConv.name}</div>
              <div className="text-[10px] text-zinc-500 font-mono">{currentConv.handle}</div>
              {onViewProfile && currentConv.type === 'direct' && (
                <button
                  onClick={() => onViewProfile({ name: currentConv.name, handle: currentConv.handle, avatar: currentConv.avatar })}
                  className="text-xs font-mono font-semibold text-zinc-900 underline mt-1 cursor-pointer block mx-auto"
                >
                  {language === 'fr' ? 'Voir le Profil Créateur' : 'View Full Creator Profile'}
                </button>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
                {language === 'fr' ? 'Fichiers & Documents Partagés' : 'Shared Documents & Stems'}
              </div>
              <div className="space-y-1.5">
                {(currentConv.sharedDocs || []).map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white border border-zinc-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {doc.type === 'audio' ? (
                        <Music className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      )}
                      <span className="truncate text-[11px]">{doc.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playCheer();
                        setToastNotice(`Downloading ${doc.name}...`);
                        setTimeout(() => setToastNotice(null), 3500);
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-800 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 space-y-2">
              <button
                onClick={() => onStartCall('video', currentConv.name, currentConv.type === 'group')}
                className="w-full py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Appel Vidéo' : 'Start Video Call'}</span>
              </button>
              <button
                onClick={() => onStartCall('audio', currentConv.name, currentConv.type === 'group')}
                className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl border border-zinc-200 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Appel Audio' : 'Start Voice Call'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Private Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-zinc-900 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold font-display">
                {language === 'fr' ? 'Démarrer un Nouveau Chat Privé' : 'Start a New Private Chat'}
              </h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-zinc-400 hover:text-zinc-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              {language === 'fr'
                ? 'Sélectionnez un créateur ou compétiteur sur Hypitt pour ouvrir une messagerie privée :'
                : 'Select any competitor or creator on Hypitt to open private messaging, calls, and stem sharing:'}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {platformContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleStartPrivateChat(contact)}
                  className="p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-mono font-bold text-zinc-800">
                      {contact.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-zinc-900">{contact.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{contact.handle} · {contact.role}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Squad Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-zinc-900 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold font-display">
                {language === 'fr' ? 'Créer un Groupe d’Équipe' : 'Create a Squad Group Chat'}
              </h3>
              <button onClick={() => setShowNewGroupModal(false)} className="text-zinc-400 hover:text-zinc-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1">
                  {language === 'fr' ? 'Nom de l’Équipe' : 'Squad Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Drill Cypher League, Beatbox Kings..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-mono uppercase mb-1">
                  {language === 'fr' ? 'Sélectionner les Membres' : 'Select Squad Members'}
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-zinc-200 rounded-xl p-2 bg-zinc-50">
                  {platformContacts.map((c) => {
                    const isSelected = newGroupSelectedMembers.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          if (isSelected) {
                            setNewGroupSelectedMembers(newGroupSelectedMembers.filter((id) => id !== c.id));
                          } else {
                            setNewGroupSelectedMembers([...newGroupSelectedMembers, c.id]);
                          }
                        }}
                        className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition ${
                          isSelected ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-800 border border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold">{c.avatar}</span>
                          <span>{c.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewGroupModal(false)}
                  className="px-4 py-2 border border-zinc-300 rounded-xl text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim() || newGroupSelectedMembers.length === 0}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-black disabled:opacity-40 cursor-pointer"
                >
                  {language === 'fr' ? 'Créer l’Équipe' : 'Create Squad Chat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document In-App Preview Modal */}
      <DocPreviewModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
      />
    </div>
  );
};
