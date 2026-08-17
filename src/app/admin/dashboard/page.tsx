'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Modal from '@/components/Modal';

interface Profile {
  id: string;
  name: string;
  area: string;
  budget: string;
  moveIn: string;
  occupation: string;
  status: 'Reviewing' | 'Matched' | 'New' | 'Paid';
}

interface MatchUserFace {
  name: string;
  id: string;
  imageUrl?: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  location: string;
  budget: string;
  moveIn: string;
  lifestyle: string[];
}

interface MatchPairTrack {
  id: string;
  pairNumber: string;
  matchPercent: number;
  userA: MatchUserFace;
  userB: MatchUserFace;
}

const DEFAULT_MATCH_PAIRS: MatchPairTrack[] = [
  {
    id: 'pair-102',
    pairNumber: 'PAIR #102',
    matchPercent: 92,
    userA: {
      name: 'Chidi O.',
      id: '#RM-104',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmWymzKQGmfTmpp5c9tS__Djk4KikXzuuGd1wBBtec-QosHtlBohmqwrpC_m6OUhvFM1E5CY46lzVTHYR9pcBr-P5aySlW8S-Tvo4HKr9C8-T293ViuhEbFNQkgEXUuUXxx0sJs1V6FBdv-WdvKZzYQJUK0OdpDrZnf9g6Y3ceJhTtOcuGfz8a90K2clle5c4Ewx_226Y9fPmJFBfJus73FRHbJ13RKojZzlpL5_kc14Fu7ZvQg4WkNw',
      initials: 'CO',
      avatarBg: '',
      avatarText: '',
      location: 'UNILAG Akoka, Yaba',
      budget: '₦200,000 / yr',
      moveIn: 'Immediate (Within 7 days)',
      lifestyle: ['Early Riser', 'Non-Smoker', 'Very Clean'],
    },
    userB: {
      name: 'Emeka K.',
      id: '#RM-208',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDBtXUSFPcOZ7yF7QDJXXCobop4sR36SZj7iFZAy45ZxC-7_ouzbz7Lbm-CU6doAKtuMk7Wftw0YJPk9HcS_VVekGwgfh0dAKG_Aj5b9vX0dUH7D_wcNceKNGEHdHYqqLyWmC-c3lCevGWbNZL_dVm22tIOn8oWBKBbIq82_xwEMb3YqWymu9p8yGBXrDfTMeB8EEXGGFC2TQQYbw-29UKQ8xXlgI1S4w89m5DM-4XgnrAnz1IVj5cfJA',
      initials: 'EK',
      avatarBg: '',
      avatarText: '',
      location: 'UNILAG Akoka, Abule Oja',
      budget: '₦220,000 / yr',
      moveIn: 'Flexible (Oct 15 - Oct 30)',
      lifestyle: ['Early Riser', 'Non-Smoker', 'Clean'],
    },
  },
  {
    id: 'pair-103',
    pairNumber: 'PAIR #103',
    matchPercent: 88,
    userA: {
      name: 'Tunde A.',
      id: '#RM-512',
      initials: 'TA',
      avatarBg: 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed-dim',
      avatarText: '',
      location: 'Yaba, Alagomeji',
      budget: '₦350,000 / yr',
      moveIn: 'Immediate',
      lifestyle: ['Night Owl', 'Non-Smoker'],
    },
    userB: {
      name: 'Samuel B.',
      id: '#RM-633',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBiTXA3PDZ1QUffP-fl2WBklZzlvnVThWKDputjLVz1iVpLFajkJmAGp0_J9q62WH4fXJUWEHw8t1EP3j7JohC47vepRA3ysEKn3cthABV39Q4mHpOuvqMxkC_dIQpi1Uv5QID4qxB9ZLwvUeYgSrcL6XGDhvRJjoXlU840C2ugGrUKwDgDLYN0rilWyLdadOvk-vL65iDM_89sdGr-HDn__Z_bw3IkCwj6u1vW03jE1Cyd7bpxkczo4Q',
      initials: 'SB',
      avatarBg: '',
      avatarText: '',
      location: 'Yaba, Sabo',
      budget: '₦300,000 / yr',
      moveIn: 'Immediate',
      lifestyle: ['Early Riser', 'Non-Smoker'],
    },
  },
  {
    id: 'pair-104',
    pairNumber: 'PAIR #104',
    matchPercent: 85,
    userA: {
      name: 'Femi D.',
      id: '#RM-421',
      initials: 'FD',
      avatarBg: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim',
      avatarText: '',
      location: 'Surulere, Adeniran Ogunsanya',
      budget: '₦400,000 / yr',
      moveIn: 'Flexible (Nov 1)',
      lifestyle: ['Social Drinker', 'Very Clean'],
    },
    userB: {
      name: 'Bisi L.',
      id: '#RM-710',
      initials: 'BL',
      avatarBg: 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed-dim',
      avatarText: '',
      location: 'Surulere, Bode Thomas',
      budget: '₦450,000 / yr',
      moveIn: 'Flexible (Nov 15)',
      lifestyle: ['Early Riser', 'Very Clean'],
    },
  },
  {
    id: 'pair-105',
    pairNumber: 'PAIR #105',
    matchPercent: 82,
    userA: {
      name: 'Ada M.',
      id: '#RM-912',
      initials: 'AM',
      avatarBg: 'bg-error-container text-on-error-container border-error-container/50',
      avatarText: '',
      location: 'Lekki Phase 1',
      budget: '₦1,200,000 / yr',
      moveIn: 'Immediate',
      lifestyle: ['Pet Friendly', 'Non-Smoker'],
    },
    userB: {
      name: 'Nnamdi C.',
      id: '#RM-944',
      initials: 'NC',
      avatarBg: 'bg-secondary-container text-on-secondary-container border-secondary-container/50',
      avatarText: '',
      location: 'Lekki Phase 1',
      budget: '₦1,500,000 / yr',
      moveIn: 'Flexible (Next Month)',
      lifestyle: ['Pet Friendly', 'Very Clean'],
    },
  },
];

interface MatchWorkspaceProps {
  pairs: MatchPairTrack[];
  onReject: (pairId: string) => void;
  onConfirm: (pairId: string) => void;
}

function MatchUserSide({ user }: { user: MatchUserFace }) {
  const rows = [
    { icon: 'location_on', label: 'Preferred Location', value: user.location },
    { icon: 'payments', label: 'Budget Limit', value: user.budget },
    { icon: 'calendar_month', label: 'Move-in Date', value: user.moveIn },
  ];

  return (
    <div className="px-5">
      <div className="flex items-center gap-3 mb-4">
        {user.imageUrl ? (
          <Image
            className="w-9 h-9 rounded-full object-cover border border-outline-variant"
            src={user.imageUrl}
            alt={user.name}
            width={36}
            height={36}
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border ${user.avatarBg}`}
          >
            {user.initials}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-sm text-primary">{user.name}</h4>
          <p className="text-[10px] text-on-surface-variant font-mono">{user.id}</p>
        </div>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-on-primary-container text-[16px] mt-0.5">
              {r.icon}
            </span>
            <div>
              <p className="text-[10px] text-on-surface-variant mb-0.5">{r.label}</p>
              <p className="text-[13px] font-medium text-primary">{r.value}</p>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-on-primary-container text-[16px] mt-0.5">
            psychology
          </span>
          <div>
            <p className="text-[10px] text-on-surface-variant mb-1">Lifestyle</p>
            <div className="flex flex-wrap gap-1.5">
              {user.lifestyle.map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container-low border border-surface-container-high px-2 py-0.5 rounded text-[11px] text-on-surface-variant"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({
  pair,
  onReject,
  onConfirm,
}: {
  pair: MatchPairTrack;
  onReject: (id: string) => void;
  onConfirm: (id: string) => void;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
      <div className="p-4 relative">
        <div className="absolute left-1/2 top-1/2 bg-surface border border-outline-variant rounded-full w-8 h-8 flex items-center justify-center font-bold text-[11px] text-primary shadow-sm z-10 -translate-x-1/2 -translate-y-1/2">
          VS
        </div>
        <div className="grid grid-cols-2 gap-0 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-surface-container-high -translate-x-1/2"></div>
          <MatchUserSide user={pair.userA} />
          <MatchUserSide user={pair.userB} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 p-4 border-t border-surface-container-high bg-surface-bright/50 flex-wrap">
        <div className="flex items-center gap-3">
          <h3 className="font-headline-md text-base text-primary">{pair.pairNumber}</h3>
          <div className="bg-[#10B981]/10 text-[#005236] px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-[#10B981]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            {pair.matchPercent}% Match
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onReject(pair.id)}
            className="text-on-surface-variant hover:text-error px-3 py-1.5 rounded-lg font-label-md text-xs transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => onConfirm(pair.id)}
            className="bg-primary text-white px-4 py-1.5 rounded-lg font-label-md text-xs transition-all flex items-center gap-2 shadow-sm hover:bg-dark-slate"
          >
            <span className="material-symbols-outlined fill-icon text-[16px]">check_circle</span>
            Confirm Match
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchWorkspace({
  pairs,
  onReject,
  onConfirm,
}: MatchWorkspaceProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-high rounded-full font-label-md text-label-md text-on-surface-variant shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>
              location_on
            </span>
            <select
              value="Lagos State"
              onChange={() => {}}
              className="bg-transparent outline-none cursor-pointer text-on-surface-variant"
              aria-label="State"
            >
              <option value="Lagos State">Lagos State</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onConfirm(pairs[0]?.id ?? '')}
            className="flex items-center gap-2 bg-sky-blue/90 text-white px-5 py-2 rounded-lg font-label-md text-sm shadow-sm hover:bg-secondary transition-colors"
          >
            <span className="material-symbols-outlined fill-icon text-[17px]">model_training</span>
            Run Global Auto-Match
          </button>
        </div>
      </div>

      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-fixed/20 text-on-secondary-container rounded-full font-label-md text-xs border border-secondary-container/30">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: 16 }}>
              pending_actions
            </span>
            {pairs.length} Proposed Pair{pairs.length === 1 ? '' : 's'} Pending Review
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-lg font-label-md text-xs transition-colors border border-outline-variant/30">
            <span className="material-symbols-outlined text-[17px]">refresh</span>
            Re-run Algorithm
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-lg font-label-md text-xs transition-colors border border-outline-variant/30">
            <span className="material-symbols-outlined text-[17px]">tune</span>
            Match Settings
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 pb-4 w-full relative z-10">
        {pairs.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 text-center">
            <p className="font-label-md text-sm text-on-surface-variant">
              All proposed pairs have been reviewed. Run auto-match to generate new pairs.
            </p>
          </div>
        ) : (
          pairs.map((pair) => (
            <MatchCard key={pair.id} pair={pair} onReject={onReject} onConfirm={onConfirm} />
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, hydrated, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [matchTriggered, setMatchTriggered] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'matches'>('dashboard');
  const [proposedPairs, setProposedPairs] = useState<MatchPairTrack[]>(DEFAULT_MATCH_PAIRS);

  const handleRejectMatch = (pairId: string) => {
    setProposedPairs((prev) => prev.filter((p) => p.id !== pairId));
  };

  const handleConfirmMatch = (pairId: string) => {
    setMatchTriggered(true);
    setTimeout(() => setMatchTriggered(false), 3000);
    handleRejectMatch(pairId);
  };

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace('/ambassador/login');
    } else if (user?.role !== 'admin') {
      router.replace('/ambassador/dashboard');
    }
  }, [hydrated, isAuthenticated, user?.role, router]);

  const adminName = user?.full_name || 'Admin';
  const firstName = adminName.trim().split(/\s+/)[0] || adminName;
  const initials =
    adminName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AD';

  const initialProfiles: Profile[] = [
    {
      id: '1',
      name: 'John D.',
      area: 'Lekki Phase 1',
      budget: '₦800k',
      moveIn: 'Imm.',
      occupation: 'Software Eng.',
      status: 'Reviewing',
    },
    {
      id: '2',
      name: 'Sarah K.',
      area: 'Yaba',
      budget: '₦450k',
      moveIn: '2 weeks',
      occupation: 'Marketer',
      status: 'Matched',
    },
    {
      id: '3',
      name: 'David E.',
      area: 'Lekki Phase 1',
      budget: '₦850k',
      moveIn: 'Imm.',
      occupation: 'Data Analyst',
      status: 'Reviewing',
    },
    {
      id: '4',
      name: 'Michael O.',
      area: 'Ikeja GRA',
      budget: '₦1.2M',
      moveIn: '1 month',
      occupation: 'Consultant',
      status: 'New',
    },
  ];

  const [targetProfile, setTargetProfile] = useState<Profile>(initialProfiles[0]);
  const [suggestedMatch, setSuggestedMatch] = useState<Profile>(initialProfiles[2]);

  const filteredProfiles = initialProfiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === 'All' || p.area.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

  const handleCreateMatch = () => {
    setMatchTriggered(true);
    setTimeout(() => setMatchTriggered(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/ambassador/login');
  };

  const confirmLogout = () => {
    setLogoutModalOpen(false);
    handleLogout();
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 h-16 px-6 fixed top-0 right-0 left-0 md:left-64 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-display font-bold text-lg text-primary md:hidden"
          >
            Roommate NG
          </Link>
          {activeView === 'matches' ? (
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-bright-cyan/10 text-bright-cyan flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">group_add</span>
              </span>
              <div className="leading-tight">
                <h2 className="font-display font-bold text-base text-dark-slate">
                  Roommate Matcher
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  Auto-match workspace
                </p>
              </div>
            </div>
          ) : (
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search profiles, areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-full border border-slate-200 text-xs w-64 outline-none focus:border-bright-cyan bg-slate-50"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-bright-cyan p-1.5 rounded-full hover:bg-slate-100">
            <span className="material-symbols-outlined text-xl">
              notifications
            </span>
          </button>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              {initials}
            </div>
            <div className="leading-tight">
              <span className="text-xs font-semibold text-dark-slate hidden sm:inline">
                Hi, {firstName}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">
                Admin Portal
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="bg-primary text-white w-64 fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col py-6 px-4">
        <div className="px-2 mb-8">
          <Link href="/" className="font-display font-extrabold text-2xl text-white block">
            Roommate NG
          </Link>
          <span className="text-[10px] text-bright-cyan uppercase tracking-widest font-bold">
            Matchmaking Control
          </span>
        </div>

        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-slate-800 text-bright-cyan font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('matches')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
              activeView === 'matches'
                ? 'bg-slate-800 text-bright-cyan font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">group</span>
            Match Workspace
          </button>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm"
          >
            <span className="material-symbols-outlined">payments</span>
            Payments
          </a>
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm"
          >
            <span className="material-symbols-outlined text-base">
              logout
            </span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 pt-20 px-4 md:px-8 pb-12 flex-1 max-w-[1280px]">
        {matchTriggered && (
          <div className="fixed top-20 right-8 bg-mint text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="material-symbols-outlined text-lg">bolt</span>
            <span className="font-semibold text-sm">
              Match triggered between {targetProfile.name} and {suggestedMatch.name}!
            </span>
          </div>
        )}

        {activeView === 'dashboard' ? (
          <>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold text-dark-slate mb-1">
            Operational Control Dashboard
          </h1>
          <p className="font-body text-xs text-slate-500">
            Real-time roommate matching and pipeline operations.
          </p>
        </div>

        {/* 1. Bento Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-primary text-xl">
                person
              </span>
              <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                +12 today
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-dark-slate">
              254
            </p>
            <span className="text-xs text-slate-400">Total Profiles</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-bright-cyan text-xl">
                group_add
              </span>
              <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Awaiting
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-dark-slate">
              48
            </p>
            <span className="text-xs text-slate-400">Potential Matches</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-amber-500 text-xl">
                schedule
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-dark-slate">
              12
            </p>
            <span className="text-xs text-slate-400">Waiting Payment</span>
          </div>

          <div className="bg-dark-slate text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-2">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-bright-cyan text-xl">
                account_balance_wallet
              </span>
              <span className="text-mint text-[11px] font-bold">+5%</span>
            </div>
            <p className="font-display text-2xl font-extrabold text-bright-cyan">
              ₦185,000
            </p>
            <span className="text-xs text-slate-400">Total Revenue</span>
          </div>
        </section>

        {/* 2. Global Pipeline Tracker */}
        <section className="mb-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">
            Operations Pipeline Stage
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs font-semibold">
            {[
              { label: 'New', active: false },
              { label: 'Reviewing', active: true },
              { label: 'Match Found', active: true },
              { label: 'Waiting', active: false },
              { label: 'Payment', active: false },
              { label: 'Paid', active: false },
              { label: 'Connected', active: false },
              { label: 'Closed', active: false },
            ].map((stage, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl border transition-all ${
                  stage.active
                    ? 'bg-bright-cyan/10 border-bright-cyan text-bright-cyan'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="font-bold text-[11px]">{stage.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Main Grid: Profiles Table & Matchmaker */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Active Profiles Table */}
          <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-display font-bold text-lg text-dark-slate">
                  Active Profiles
                </h3>
                <p className="text-xs text-slate-400">
                  Select a profile to load into the Matchmaker.
                </p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 text-xs">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-dark-slate font-semibold outline-none"
                >
                  <option value="All">All Locations</option>
                  <option value="Lekki">Lekki</option>
                  <option value="Yaba">Yaba</option>
                  <option value="Ikeja">Ikeja</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Area</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-body divide-y divide-slate-100">
                  {filteredProfiles.map((profile) => (
                    <tr
                      key={profile.id}
                      onClick={() => setTargetProfile(profile)}
                      className={`cursor-pointer transition-colors ${
                        targetProfile.id === profile.id
                          ? 'bg-bright-cyan/5 font-semibold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-dark-slate flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-dark-slate flex items-center justify-center font-bold text-xs">
                          {profile.name.substring(0, 2)}
                        </div>
                        {profile.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {profile.area}
                      </td>
                      <td className="py-3.5 px-4 text-dark-slate font-medium">
                        {profile.budget}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            profile.status === 'Matched'
                              ? 'bg-emerald-50 text-emerald-600'
                              : profile.status === 'Reviewing'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {profile.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTargetProfile(profile);
                          }}
                          className="text-xs bg-slate-100 hover:bg-bright-cyan hover:text-white px-3 py-1 rounded-full transition-colors font-semibold"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Match Analysis Side Panel */}
          <section className="xl:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-dark-slate">
                  Match Analysis
                </h3>
                <p className="text-xs text-slate-400">
                  Target profile vs top suggested room candidate.
                </p>
              </div>

              {/* Split Match Card */}
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs mx-auto mb-1">
                    {targetProfile.name.substring(0, 2)}
                  </div>
                  <span className="font-bold text-xs block text-dark-slate">
                    {targetProfile.name}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    Target
                  </span>
                </div>

                <div className="bg-bright-cyan text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  92% Match
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-bright-cyan text-white flex items-center justify-center font-bold text-xs mx-auto mb-1">
                    {suggestedMatch.name.substring(0, 2)}
                  </div>
                  <span className="font-bold text-xs block text-dark-slate">
                    {suggestedMatch.name}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    Candidate
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">
                  Compatibility Factors
                </h4>
                <div className="space-y-2 text-xs text-dark-slate">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                    <span>Area ({targetProfile.area})</span>
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                    <span>Budget Range ({targetProfile.budget})</span>
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                    <span>Move-in Timeline</span>
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateMatch}
              className="w-full bg-bright-cyan text-white font-display font-semibold py-3 rounded-full hover:bg-bright-cyan/90 transition-all shadow-md text-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">
                handshake
              </span>
              Create Match & Trigger Outreach
            </button>
          </section>
        </div>
          </>
        ) : (
          <MatchWorkspace
            pairs={proposedPairs}
            onReject={handleRejectMatch}
            onConfirm={handleConfirmMatch}
          />
        )}
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Log out"
        size="md"
        preventDismiss
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
              <span className="material-symbols-outlined text-3xl">logout</span>
            </span>
            <h3 className="font-display text-xl font-extrabold text-dark-slate mb-2">
              Log out of your account?
            </h3>
            <p className="font-body text-sm text-slate-500 max-w-sm">
              Are you sure you want to log out? You&apos;ll need to sign in again to
              access your dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => setLogoutModalOpen(false)}
              className="flex-1 py-3 rounded-full font-display font-semibold text-sm border border-slate-300 text-dark-slate hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmLogout}
              className="flex-1 py-3 rounded-full font-display font-semibold text-sm bg-red-600/90 text-white hover:bg-red-600/80 transition-colors shadow-md active:scale-[0.98]"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
