'use client';

import { useState, useEffect, useRef } from 'react';
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
  onOpenSettings: () => void;
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
  onOpenSettings,
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
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-lg font-label-md text-xs transition-colors border border-outline-variant/30"
          >
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

function MatchSettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [weights, setWeights] = useState({ budget: 40, lifestyle: 30, location: 20, moveIn: 10 });
  const [minScore, setMinScore] = useState(75);
  const [strictSmoker, setStrictSmoker] = useState(true);
  const [enforceGender, setEnforceGender] = useState(false);

  const setWeight = (key: keyof typeof weights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  return open ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm h-full bg-surface-container-lowest rounded-xl shadow-xl flex flex-col overflow-hidden border border-outline-variant/20 animate-in slide-in-from-right duration-300">
        <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div>
            <h2 className="font-headline-md text-lg text-primary">Match Settings</h2>
            <p className="text-xs text-on-surface-variant">Tune the auto-matching algorithm weights</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors"
            aria-label="Close settings"
          >
            <span className="material-symbols-outlined text-lg text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          <section>
            <h3 className="font-label-md text-xs text-primary mb-4 uppercase tracking-wider">
              Weighting Controls
            </h3>
            <div className="space-y-5">
              {(
                [
                  ['budget', 'Budget Match'],
                  ['lifestyle', 'Lifestyle Compatibility'],
                  ['location', 'Location Proximity'],
                  ['moveIn', 'Move-in Date Alignment'],
                ] as [keyof typeof weights, string][]
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-[13px] font-medium text-primary">
                    <span>{label}</span>
                    <span className="text-secondary">{weights[key]}%</span>
                  </div>
                  <input
                    className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-sky-blue"
                    type="range"
                    min={0}
                    max={100}
                    value={weights[key]}
                    onChange={(e) => setWeight(key, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-label-md text-xs text-primary mb-4 uppercase tracking-wider">
              Threshold Settings
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[13px] font-medium text-primary">
                <span>Minimum Match Score</span>
                <span className="text-secondary">{minScore}%</span>
              </div>
              <input
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-sky-blue"
                type="range"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
              />
            </div>
          </section>

          <section>
            <h3 className="font-label-md text-xs text-primary mb-4 uppercase tracking-wider">
              Lifestyle Toggles
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-on-surface-variant">Strict Smoker Match</span>
                <button
                  onClick={() => setStrictSmoker((v) => !v)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    strictSmoker ? 'bg-sky-blue' : 'bg-surface-container-high'
                  }`}
                  aria-pressed={strictSmoker}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                      strictSmoker ? 'right-0.5' : 'left-0.5'
                    }`}
                  ></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-on-surface-variant">Gender Preference Enforcement</span>
                <button
                  onClick={() => setEnforceGender((v) => !v)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    enforceGender ? 'bg-sky-blue' : 'bg-surface-container-high'
                  }`}
                  aria-pressed={enforceGender}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                      enforceGender ? 'right-0.5' : 'left-0.5'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="px-5 py-4 border-t border-outline-variant/20 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-surface-container-low text-on-surface-variant py-2.5 rounded-lg font-label-md text-xs hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-sky-blue text-white py-2.5 rounded-lg font-label-md text-xs shadow-md hover:bg-secondary transition-all active:scale-95 shadow-sky-blue/20"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

interface DirectoryRow {
  id: string;
  initials: string;
  name: string;
  seekerId: string;
  state: string;
  location: string;
  budget: string;
  moveIn: string;
  status: string;
  ambassador: string;
}

const DIRECTORY_ROWS: DirectoryRow[] = [
  {
    id: 'RM-104',
    initials: 'CO',
    name: 'Chidi O.',
    seekerId: '#RM-104',
    state: 'Lagos',
    location: 'UNILAG / Akoka',
    budget: '₦200k/yr',
    moveIn: 'Sept 2026',
    status: 'Seeking',
    ambassador: 'Ref: AMB-JIDE',
  },
  {
    id: 'RM-105',
    initials: 'AM',
    name: 'Amina M.',
    seekerId: '#RM-105',
    state: 'Lagos',
    location: 'Yaba',
    budget: '₦350k/yr',
    moveIn: 'Oct 2026',
    status: 'Matched & Paid',
    ambassador: '-',
  },
  {
    id: 'RM-106',
    initials: 'BO',
    name: 'Blessing O.',
    seekerId: '#RM-106',
    state: 'Lagos',
    location: 'Lekki Ph 1',
    budget: '₦800k/yr',
    moveIn: 'Aug 2026',
    status: 'Pending Payment',
    ambassador: 'Ref: AMB-TOLA',
  },
  {
    id: 'RM-107',
    initials: 'EN',
    name: 'Emeka N.',
    seekerId: '#RM-107',
    state: 'Abuja',
    location: 'Gwarinpa',
    budget: '₦450k/yr',
    moveIn: 'Nov 2026',
    status: 'Rematch Requested',
    ambassador: '-',
  },
  {
    id: 'RM-108',
    initials: 'FE',
    name: 'Faith E.',
    seekerId: '#RM-108',
    state: 'Abuja',
    location: 'Gwarinpa',
    budget: '₦450k/yr',
    moveIn: 'Nov 2026',
    status: 'Seeking',
    ambassador: '-',
  },
  {
    id: 'RM-109',
    initials: 'IK',
    name: 'Ibrahim K.',
    seekerId: '#RM-109',
    state: 'Lagos',
    location: 'Ikeja',
    budget: '₦600k/yr',
    moveIn: 'Jan 2027',
    status: 'Matched & Paid',
    ambassador: 'Ref: AMB-TOLA',
  },
  {
    id: 'RM-110',
    initials: 'ZA',
    name: 'Zainab A.',
    seekerId: '#RM-110',
    state: 'Oyo',
    location: 'Ibadan',
    budget: '₦150k/yr',
    moveIn: 'Dec 2026',
    status: 'Pending Payment',
    ambassador: '-',
  },
  {
    id: 'RM-111',
    initials: 'OS',
    name: 'Oluwatobi S.',
    seekerId: '#RM-111',
    state: 'Lagos',
    location: 'Lekki Ph 1',
    budget: '₦1.2M/yr',
    moveIn: 'Oct 2026',
    status: 'Rematch Requested',
    ambassador: 'Ref: AMB-JIDE',
  },
  {
    id: 'RM-112',
    initials: 'CV',
    name: 'Chioma V.',
    seekerId: '#RM-112',
    state: 'Lagos',
    location: 'Yaba',
    budget: '₦300k/yr',
    moveIn: 'Sept 2026',
    status: 'Seeking',
    ambassador: '-',
  },
  {
    id: 'RM-113',
    initials: 'MY',
    name: 'Musa Y.',
    seekerId: '#RM-113',
    state: 'Kano',
    location: 'Tarauni',
    budget: '₦200k/yr',
    moveIn: 'Feb 2027',
    status: 'Matched & Paid',
    ambassador: 'Ref: AMB-TOLA',
  },
];

const EXTRA_NAMES: [string, string][] = [
  ['Ada', 'Adeyemi'],
  ['Tunde', 'Bello'],
  ['Funmi', 'Coker'],
  ['Segun', 'Dada'],
  ['Hauwa', 'Eze'],
  ['Ngozi', 'Fagbemi'],
  ['Ifeanyi', 'Garba'],
  ['Kemi', 'Hassan'],
  ['Lola', 'Ibrahim'],
  ['Mubarak', 'Jallow'],
  ['Nneka', 'Kalu'],
  ['Obinna', 'Lawal'],
  ['Precious', 'Mohammed'],
  ['Rukayat', 'Nwachukwu'],
  ['Sade', 'Okafor'],
  ['Tayo', 'Peters'],
  ['Uche', 'Quadri'],
  ['Victoria', 'Raji'],
  ['Wale', 'Salami'],
  ['Yemi', 'Tijani'],
  ['Zara', 'Umar'],
  ['Akin', 'Victor'],
  ['Bola', 'Williams'],
  ['Chinwe', 'Xavier'],
  ['Dayo', 'Yusuf'],
  ['Emeka', 'Adeleke'],
  ['Femi', 'Balogun'],
  ['Gbenga', 'Chukwu'],
  ['Halima', 'Danladi'],
  ['Ireti', 'Ekwere'],
];

const EXTRA_STATES: [string, string][] = [
  ['Lagos', 'Surulere'],
  ['Lagos', 'Victoria Island'],
  ['Lagos', 'Ajegunle'],
  ['Abuja', 'Wuse 2'],
  ['Abuja', 'Maitama'],
  ['Oyo', 'Ogbomoso'],
  ['Oyo', 'Iwo'],
  ['Kano', 'Fagge'],
  ['Kano', 'Nassarawa'],
  ['Rivers', 'Port Harcourt'],
  ['Rivers', 'Trans Amadi'],
  ['Enugu', 'Independence Layout'],
  ['Kaduna', 'Barnawa'],
  ['Anambra', 'Awka'],
  ['Delta', 'Warri'],
];

const EXTRA_BUDGETS = [
  '₦180k/yr',
  '₦250k/yr',
  '₦320k/yr',
  '₦410k/yr',
  '₦520k/yr',
  '₦650k/yr',
  '₦780k/yr',
  '₦900k/yr',
  '₦1.1M/yr',
  '₦1.4M/yr',
];

const EXTRA_MOVE_INS = [
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
  'Aug 2026',
  'Sept 2026',
  'Oct 2026',
  'Nov 2026',
  'Dec 2026',
];

const EXTRA_STATUSES = [
  'Seeking',
  'Matched & Paid',
  'Pending Payment',
  'Rematch Requested',
];

const EXTRA_AMBASSADORS = ['Ref: AMB-JIDE', 'Ref: AMB-TOLA', 'Ref: AMB-SIMA', '-'];

const EXTRA_MOCK_ROWS: DirectoryRow[] = EXTRA_NAMES.map(([first, last], i) => {
  const id = 114 + i;
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const [state, location] = EXTRA_STATES[i % EXTRA_STATES.length];
  return {
    id: `RM-${id}`,
    initials,
    name: `${first} ${last.charAt(0)}.`,
    seekerId: `#RM-${id}`,
    state,
    location,
    budget: EXTRA_BUDGETS[i % EXTRA_BUDGETS.length],
    moveIn: EXTRA_MOVE_INS[i % EXTRA_MOVE_INS.length],
    status: EXTRA_STATUSES[i % EXTRA_STATUSES.length],
    ambassador: EXTRA_AMBASSADORS[i % EXTRA_AMBASSADORS.length],
  };
});

const DIRECTORY_ALL_ROWS: DirectoryRow[] = [...DIRECTORY_ROWS, ...EXTRA_MOCK_ROWS];

const STATUS_BADGE: Record<string, string> = {
  Seeking: 'bg-[#E0F2FE] text-[#0369A1]',
  'Matched & Paid': 'bg-[#D1FAE5] text-[#047857]',
  'Pending Payment': 'bg-[#FEF3C7] text-[#B45309]',
  'Rematch Requested': 'bg-error-container text-on-error-container',
};

interface UserDetailData {
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  ageBracket: string;
  religion: string;
  marStatus: string;
  occupation: string;
  schedule: string;
  prefAreas: string;
  budgetRange: string;
  moveInDate: string;
  bio: string;
  feesPaid: string;
  paymentsCount: string;
  referralSource: string;
  referralAttribution: string;
  activeMatches: string;
}

const USER_DETAILS: Record<string, UserDetailData> = {
  'RM-104': {
    fullName: 'Chidi Okonkwo',
    phone: '+234 812 345 6789',
    email: 'chidi.o@gmail.com',
    gender: 'Male',
    ageBracket: '22 - 25',
    religion: 'Christian',
    marStatus: 'Single',
    occupation: 'Software Engineer',
    schedule: 'Hybrid',
    prefAreas: 'UNILAG/Yaba',
    budgetRange: '₦250k - ₦350k',
    moveInDate: '15 Sept 2026',
    bio: '"Quiet and organized tech guy looking for a neat roommate. I mostly work from home during the day and value a peaceful environment."',
    feesPaid: '₦15,000',
    paymentsCount: '3 Successful Payments',
    referralSource: 'AMB-JIDE',
    referralAttribution: 'Attributed to Jide Adeshina',
    activeMatches: '2',
  },
};

const FALLBACK_USER_DETAILS = (
  row: DirectoryRow,
  idx: number
): UserDetailData => ({
  fullName: row.name,
  phone: '+234 8' + String(10 + (idx % 90)) + ' 000 000' + String(idx % 10),
  email: `seeker${row.id.replace(/[^0-9]/g, '')}@gmail.com`,
  gender: idx % 2 === 0 ? 'Male' : 'Female',
  ageBracket: ['18 - 21', '22 - 25', '26 - 29'][idx % 3],
  religion: ['Christian', 'Muslim'][idx % 2],
  marStatus: 'Single',
  occupation: ['Software Engineer', 'Designer', 'Student', 'Analyst'][idx % 4],
  schedule: ['Remote', 'Hybrid', 'On-Site'][idx % 3],
  prefAreas: row.location,
  budgetRange: row.budget,
  moveInDate: row.moveIn,
  bio: `"Looking for a clean, respectful roommate in ${row.location}. Prefers a calm and organized living environment."`,
  feesPaid: '₦' + String(10000 + idx * 5000),
  paymentsCount: `${1 + (idx % 4)} Successful Payment${(1 + (idx % 4)) === 1 ? '' : 's'}`,
  referralSource: row.ambassador.startsWith('Ref:') ? row.ambassador.replace('Ref: ', '') : 'Direct',
  referralAttribution: row.ambassador.startsWith('Ref:') ? 'Attributed to ambassador referral' : 'No referral attribution',
  activeMatches: String(idx % 3),
});

function getUserDetail(row: DirectoryRow): UserDetailData {
  if (USER_DETAILS[row.id]) return USER_DETAILS[row.id];
  const idx = DIRECTORY_ALL_ROWS.findIndex((r) => r.id === row.id);
  return FALLBACK_USER_DETAILS(row, idx >= 0 ? idx : 0);
}

function RoommateDirectory({ onSelect }: { onSelect: (row: DirectoryRow) => void }) {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('State: Lagos');
  const [statusFilter, setStatusFilter] = useState('Status: All Statuses');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const filteredRows = DIRECTORY_ALL_ROWS.filter((row) => {
    const q = query.toLowerCase();
    const matchesSearch =
      row.name.toLowerCase().includes(q) ||
      row.seekerId.toLowerCase().includes(q);
    const matchesState = stateFilter.includes(row.state);
    return matchesSearch && matchesState;
  });

  const buildStatus = (row: DirectoryRow) => {
    if (statusFilter === 'Status: Seeking') return row.status === 'Seeking';
    if (statusFilter === 'Status: Matched & Paid') return row.status === 'Matched & Paid';
    return true;
  };

  const rows = filteredRows.filter(buildStatus);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Profiles', value: 254, icon: 'group', iconBg: 'bg-surface-container', iconColor: 'text-on-surface-variant' },
          { label: 'Seeking Unmatched', value: 48, icon: 'search', iconBg: 'bg-[#E0F2FE]', iconColor: 'text-[#0369A1]' },
          { label: 'Pending Payment', value: 12, icon: 'payments', iconBg: 'bg-[#FEF3C7]', iconColor: 'text-[#B45309]' },
          { label: 'Matched & Paid', value: 194, icon: 'task_alt', iconBg: 'bg-[#D1FAE5]', iconColor: 'text-[#047857]' },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              {c.label}
            </span>
            <div className="mt-3 flex items-end justify-between">
              <span className="font-headline-xl text-2xl font-extrabold text-dark-slate">
                {c.value}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${c.iconBg} ${c.iconColor}`}>
                <span className="material-symbols-outlined text-[18px]">{c.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Action Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-3 items-start xl:items-center justify-between">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 text-[13px] transition-all"
            placeholder="Search by name, phone, or Seeker ID (#RM-104)..."
            type="text"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[13px] text-dark-slate focus:outline-none focus:border-bright-cyan"
          >
            <option>State: Lagos</option>
            <option>State: Abuja</option>
            <option>State: Oyo</option>
            <option>State: Kano</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[13px] text-dark-slate focus:outline-none focus:border-bright-cyan">
            <option>Loc: All</option>
            <option>Loc: UNILAG / Akoka</option>
            <option>Loc: Yaba</option>
            <option>Loc: Lekki</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[13px] text-dark-slate focus:outline-none focus:border-bright-cyan"
          >
            <option>Status: All Statuses</option>
            <option>Status: Seeking</option>
            <option>Status: Matched & Paid</option>
            <option>Status: Pending Payment</option>
            <option>Status: Rematch Requested</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[13px] text-dark-slate focus:outline-none focus:border-bright-cyan">
            <option>Budget: Any Range</option>
            <option>Budget: &lt; 100k</option>
            <option>Budget: 100k - 300k</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-auto max-h-[560px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                {['Seeker Name & ID', 'State & Location', 'Budget & Move-In', 'Status', 'Ambassador', ''].map((h, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold ${
                      i === 5 ? 'text-right' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelect(row)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                        {row.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-dark-slate">{row.name}</p>
                        <p className="text-[11px] text-slate-400">{row.seekerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] uppercase font-semibold">
                        {row.state}
                      </span>
                      <span className="text-[13px] text-slate-500">{row.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-dark-slate">{row.budget}</p>
                    <p className="text-[11px] text-slate-400">{row.moveIn}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${STATUS_BADGE[row.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-slate-500">{row.ambassador}</span>
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === row.id ? null : row.id);
                      }}
                      className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100"
                    >
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                    {openMenuId === row.id && (
                      <div
                        ref={menuRef}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1.5"
                      >
                        {[
                          { icon: 'person', label: 'View Full Profile' },
                          { icon: 'group_add', label: 'Manual Match Workspace' },
                          { icon: 'message', label: 'Send WhatsApp Reminder' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => setOpenMenuId(null)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px] text-slate-500">
                              {item.icon}
                            </span>
                            <span className="text-[13px] text-dark-slate">{item.label}</span>
                          </button>
                        ))}
                        <div className="my-1.5 border-t border-slate-100" />
                        <button
                          onClick={() => setOpenMenuId(null)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[17px] text-red-600">
                            delete
                          </span>
                          <span className="text-[13px] text-red-600">Archive Profile</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 flex items-center justify-between sm:px-5">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-slate-400">
                Showing <span className="font-medium text-dark-slate">1</span> to{' '}
                <span className="font-medium text-dark-slate">{rows.length}</span> of{' '}
                <span className="font-medium text-dark-slate">{DIRECTORY_ALL_ROWS.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <a className="relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-slate-200 bg-white text-xs font-medium text-slate-400 hover:bg-slate-100" href="#">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </a>
                {[1, 2, 3].map((n) => (
                  <a
                    key={n}
                    href="#"
                    className={`relative inline-flex items-center px-3.5 py-1.5 border text-xs font-medium ${
                      n === 1
                        ? 'z-10 bg-[#E0F2FE] border-sky-400 text-[#0369A1]'
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {n}
                  </a>
                ))}
                <span className="relative inline-flex items-center px-3.5 py-1.5 border border-slate-200 bg-white text-xs font-medium text-slate-400">
                  ...
                </span>
                <a className="relative inline-flex items-center px-3.5 py-1.5 border border-slate-200 bg-white text-xs font-medium text-slate-400 hover:bg-slate-100" href="#">
                  25
                </a>
                <a className="relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-slate-200 bg-white text-xs font-medium text-slate-400 hover:bg-slate-100" href="#">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AmbassadorRow {
  id: string;
  name: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  state: string;
  location: string;
  status: 'Verified' | 'Pending' | 'Unverified';
  seekers: number;
  matches: number;
  commission: string;
  imageUrl?: string;
}

interface AmbassadorDetailData {
  fullName: string;
  code: string;
  joined: string;
  unverified: boolean;
  email: string;
  phone: string;
  socials: string[];
  emergencyName: string;
  emergencyPhone: string;
  institution: string;
  targetAudience: string;
  jurisdictions: string[];
  commissionRate: string;
  bankName: string;
  bankNumber: string;
  referralCount: number;
  conversionPercent: number;
  pendingBalance: string;
  settledPayouts: string;
  payoutNote: string;
  checklist: string[];
}

const AMBASSADOR_DETAILS: Record<string, AmbassadorDetailData> = {
  'amb-1': {
    fullName: 'Jide Adeshina',
    code: 'AMB-JIDE',
    joined: '14 March 2026',
    unverified: false,
    email: 'jide@unilag.edu.ng',
    phone: '+234 801 234 5678',
    socials: ['@jide_unilag (IG)', '@jide_dev (X)', '@jide_housing (TikTok)'],
    emergencyName: 'Mrs. Folake Adeshina (Mother)',
    emergencyPhone: '+234 802 987 6543',
    institution: 'University of Lagos (UNILAG)',
    targetAudience: 'Undergraduates & Freshers (200L CS)',
    jurisdictions: ['UNILAG (Akoka)', 'Yaba / Sabo'],
    commissionRate: '50% Commission',
    bankName: 'Kuda Bank',
    bankNumber: '2012345678',
    referralCount: 38,
    conversionPercent: 68,
    pendingBalance: '₦45,000',
    settledPayouts: '₦180,000',
    payoutNote: 'Historically via Paystack',
    checklist: [
      'Phone & WhatsApp Active',
      'Social Media Handles Cross-Checked',
      'Bank Account Name Match Confirmed',
      'Primary & Secondary Locations Assigned',
    ],
  },
  'amb-2': {
    fullName: 'Chioma Okafor',
    code: 'AMB-CHIOMA',
    joined: '2 February 2026',
    unverified: false,
    email: 'chioma@gwarinpa.edu.ng',
    phone: '+234 803 555 1122',
    socials: ['@chioma_o (IG)', '@chioma_abuja (X)'],
    emergencyName: 'Mr. Ike Okafor (Father)',
    emergencyPhone: '+234 805 444 7788',
    institution: 'University of Abuja',
    targetAudience: 'NYSC Members & Professionals',
    jurisdictions: ['Gwarinpa', 'Kubwa'],
    commissionRate: '50% Commission',
    bankName: 'OPay',
    bankNumber: '8091234567',
    referralCount: 42,
    conversionPercent: 71,
    pendingBalance: '₦30,000',
    settledPayouts: '₦150,000',
    payoutNote: 'Historically via Paystack',
    checklist: [
      'Phone & WhatsApp Active',
      'Social Media Handles Cross-Checked',
      'Bank Account Name Match Confirmed',
      'Primary & Secondary Locations Assigned',
    ],
  },
  'amb-3': {
    fullName: 'Emeka Eze',
    code: 'AMB-EMEKA',
    joined: '20 March 2026',
    unverified: true,
    email: 'emeka@ikeja.edu.ng',
    phone: '+234 806 222 3344',
    socials: ['@emeka_e (IG)', '@emeka_dev (X)'],
    emergencyName: 'Mrs. Ngozi Eze (Mother)',
    emergencyPhone: '+234 807 111 8899',
    institution: 'Lagos State University',
    targetAudience: 'Undergraduates (LASU Ojo)',
    jurisdictions: ['Ikeja', 'Ojota'],
    commissionRate: '40% Commission',
    bankName: 'Kuda Bank',
    bankNumber: '2044567890',
    referralCount: 12,
    conversionPercent: 55,
    pendingBalance: '₦20,000',
    settledPayouts: '₦50,000',
    payoutNote: 'Pending verification',
    checklist: [
      'Phone & WhatsApp Active',
      'Social Media Handles Cross-Checked',
    ],
  },
  'amb-4': {
    fullName: 'Amina Bello',
    code: 'AMB-AMINA',
    joined: '11 January 2026',
    unverified: false,
    email: 'amina@buk.edu.ng',
    phone: '+234 808 333 5566',
    socials: ['@amina_b (IG)', '@amina_kano (TikTok)'],
    emergencyName: 'Mr. Sani Bello (Father)',
    emergencyPhone: '+234 809 222 4455',
    institution: 'Bayero University Kano',
    targetAudience: 'Undergraduates (BUK)',
    jurisdictions: ['BUK / Old Site', 'BUK / New Site'],
    commissionRate: '50% Commission',
    bankName: 'Kuda Bank',
    bankNumber: '2056789012',
    referralCount: 35,
    conversionPercent: 66,
    pendingBalance: '₦40,000',
    settledPayouts: '₦140,000',
    payoutNote: 'Historically via Paystack',
    checklist: [
      'Phone & WhatsApp Active',
      'Social Media Handles Cross-Checked',
      'Bank Account Name Match Confirmed',
      'Primary & Secondary Locations Assigned',
    ],
  },
  'amb-5': {
    fullName: 'Tunde Salami',
    code: 'AMB-TUNDE',
    joined: '5 April 2026',
    unverified: true,
    email: 'tunde@ui.edu.ng',
    phone: '+234 810 444 6677',
    socials: ['@tunde_s (IG)'],
    emergencyName: 'Mrs. Bukola Salami (Mother)',
    emergencyPhone: '+234 811 333 2211',
    institution: 'University of Ibadan',
    targetAudience: 'Undergraduates (UI)',
    jurisdictions: ['UI / Agbowo'],
    commissionRate: '40% Commission',
    bankName: 'OPay',
    bankNumber: '8085566778',
    referralCount: 8,
    conversionPercent: 40,
    pendingBalance: '₦10,000',
    settledPayouts: '₦25,000',
    payoutNote: 'Pending verification',
    checklist: [
      'Phone & WhatsApp Active',
    ],
  },
  'amb-6': {
    fullName: 'Fatima Kailani',
    code: 'AMB-FATIMA',
    joined: '18 March 2026',
    unverified: false,
    email: 'fatima@abu.edu.ng',
    phone: '+234 812 555 8899',
    socials: ['@fatima_k (IG)', '@fatima_zaria (X)'],
    emergencyName: 'Mr. Musa Kailani (Father)',
    emergencyPhone: '+234 813 444 5566',
    institution: 'Ahmadu Bello University',
    targetAudience: 'Undergraduates (ABU Zaria)',
    jurisdictions: ['Zaria / Samaru'],
    commissionRate: '50% Commission',
    bankName: 'Kuda Bank',
    bankNumber: '2067890123',
    referralCount: 19,
    conversionPercent: 62,
    pendingBalance: '₦25,000',
    settledPayouts: '₦75,000',
    payoutNote: 'Historically via Paystack',
    checklist: [
      'Phone & WhatsApp Active',
      'Social Media Handles Cross-Checked',
      'Bank Account Name Match Confirmed',
      'Primary & Secondary Locations Assigned',
    ],
  },
  'amb-7': {
    fullName: 'Chidi Nwosu',
    code: 'AMB-CHIDI',
    joined: '28 February 2026',
    unverified: true,
    email: 'chidi@unn.edu.ng',
    phone: '+234 814 666 3344',
    socials: ['@chidi_n (IG)', '@chidi_unn (TikTok)'],
    emergencyName: 'Mrs. Ada Nwosu (Mother)',
    emergencyPhone: '+234 815 555 7788',
    institution: 'University of Nigeria, Nsukka',
    targetAudience: 'Undergraduates (UNN)',
    jurisdictions: ['UNN / Nsukka'],
    commissionRate: '50% Commission',
    bankName: 'OPay',
    bankNumber: '8086677889',
    referralCount: 52,
    conversionPercent: 74,
    pendingBalance: '₦60,000',
    settledPayouts: '₦225,000',
    payoutNote: 'Historically via Paystack',
    checklist: [
      'Phone & WhatsApp Active',
      'Social Media Handles Cross-Checked',
      'Bank Account Name Match Confirmed',
    ],
  },
  'amb-8': {
    fullName: 'Ngozi Peters',
    code: 'AMB-NGOZI',
    joined: '9 March 2026',
    unverified: false,
    email: 'ngozi@uniport.edu.ng',
    phone: '+234 816 777 9900',
    socials: ['@ngozi_p (IG)', '@ngozi_port (X)'],
    emergencyName: 'Mr. Emeka Peters (Father)',
    emergencyPhone: '+234 817 666 1122',
    institution: 'University of Port Harcourt',
    targetAudience: 'Undergraduates (Uniport)',
    jurisdictions: ['Uniport / Choba'],
    commissionRate: '50% Commission',
    bankName: 'Kuda Bank',
    bankNumber: '2078901234',
    referralCount: 15,
    conversionPercent: 58,
    pendingBalance: '₦18,000',
    settledPayouts: '₦55,000',
    payoutNote: 'Historically via Paystack',
    checklist: [
      'Phone & WhatsApp Active',
      'Social Media Handles Cross-Checked',
      'Bank Account Name Match Confirmed',
      'Primary & Secondary Locations Assigned',
    ],
  },
  'amb-9': {
    fullName: 'Ibrahim Musa',
    code: 'AMB-IBRAHIM',
    joined: '22 April 2026',
    unverified: true,
    email: 'ibrahim@buk.edu.ng',
    phone: '+234 818 888 4455',
    socials: ['@ibrahim_m (IG)'],
    emergencyName: 'Mrs. Hauwa Musa (Mother)',
    emergencyPhone: '+234 819 777 8899',
    institution: 'Bayero University Kano',
    targetAudience: 'Undergraduates (BUK)',
    jurisdictions: ['BUK / New Site'],
    commissionRate: '40% Commission',
    bankName: 'OPay',
    bankNumber: '8087788990',
    referralCount: 9,
    conversionPercent: 38,
    pendingBalance: '₦8,000',
    settledPayouts: '₦20,000',
    payoutNote: 'Pending verification',
    checklist: ['Phone & WhatsApp Active'],
  },
  'amb-10': {
    fullName: 'Zainab Lawal',
    code: 'AMB-ZAINAB',
    joined: '15 January 2026',
    unverified: false,
    email: 'zainab@edu.ng',
    phone: '+234 820 999 1122',
    socials: ['@zainab_l (IG)', '@zainab_abj (TikTok)'],
    emergencyName: 'Mr. Lawal (Father)',
    emergencyPhone: '+234 821 888 3344',
    institution: 'University of Abuja',
    targetAudience: 'NYSC Members & Professionals',
    jurisdictions: ['Gwarinpa', 'Wuse'],
    commissionRate: '50% Commission',
    bankName: 'Kuda Bank',
    bankNumber: '2089012345',
    referralCount: 38,
    conversionPercent: 70,
    pendingBalance: '₦35,000',
    settledPayouts: '₦155,000',
    payoutNote: 'Historically via Paystack',
    checklist: [
      'Phone & WhatsApp Active',
      'Social Media Handles Cross-Checked',
      'Bank Account Name Match Confirmed',
      'Primary & Secondary Locations Assigned',
    ],
  },
};

const AMBASSADOR_ROWS: AmbassadorRow[] = [
  { id: 'amb-1', name: 'Jide A.', tier: 'Gold', state: 'Lagos', location: 'UNILAG / Akoka', status: 'Verified', seekers: 24, matches: 18, commission: '₦90,000' },
  { id: 'amb-2', name: 'Chioma O.', tier: 'Silver', state: 'Abuja', location: 'Gwarinpa', status: 'Verified', seekers: 42, matches: 30, commission: '₦150,000' },
  { id: 'amb-3', name: 'Emeka E.', tier: 'Silver', state: 'Lagos', location: 'Ikeja', status: 'Pending', seekers: 12, matches: 10, commission: '₦50,000' },
  { id: 'amb-4', name: 'Amina B.', tier: 'Gold', state: 'Kano', location: 'BUK / Old Site', status: 'Verified', seekers: 35, matches: 28, commission: '₦140,000' },
  { id: 'amb-5', name: 'Tunde S.', tier: 'Bronze', state: 'Oyo', location: 'UI / Agbowo', status: 'Unverified', seekers: 8, matches: 5, commission: '₦25,000' },
  { id: 'amb-6', name: 'Fatima K.', tier: 'Silver', state: 'Kaduna', location: 'Zaria / Samaru', status: 'Verified', seekers: 19, matches: 15, commission: '₦75,000' },
  { id: 'amb-7', name: 'Chidi N.', tier: 'Gold', state: 'Enugu', location: 'UNN / Nsukka', status: 'Pending', seekers: 52, matches: 45, commission: '₦225,000' },
  { id: 'amb-8', name: 'Ngozi P.', tier: 'Bronze', state: 'Rivers', location: 'Uniport / Choba', status: 'Verified', seekers: 15, matches: 11, commission: '₦55,000' },
  { id: 'amb-9', name: 'Ibrahim M.', tier: 'Silver', state: 'Kano', location: 'BUK / New Site', status: 'Unverified', seekers: 9, matches: 4, commission: '₦20,000' },
  { id: 'amb-10', name: 'Zainab L.', tier: 'Gold', state: 'Abuja', location: 'Gwarinpa', status: 'Verified', seekers: 38, matches: 31, commission: '₦155,000' },
];

const AMBASSADOR_AVATARS: Record<string, string> = {
  'amb-1': 'https://lh3.googleusercontent.com/aida/AP1WRLu55m5g8d6QBQiBic9Lr7CDc5r2BqvinbLI9RJiyLI3LouQWwKiOOu3_1Ra0qFYVJrsFwZcp5Engo8pclem6vm4ZqlMkvPBcDzqdT-AIO_0ru_suBD9gupkLA3SlOt5qVAU3XobM7agm_eaOCY0g_8YET_7FeVJ1lLMZDK8jc04fAXZgDhY-mSSDYPWV9GHnw8VqQ56Hm8-306s1wzuCvd9zRNSwF4VH5HWsJ-Tk8nN3d_8wOB5fk3c3iJ5',
  'amb-2': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'amb-3': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'amb-4': 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150',
  'amb-5': 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=150',
  'amb-6': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  'amb-7': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
};

const TIER_BADGE: Record<AmbassadorRow['tier'], string> = {
  Gold: 'bg-amber-100 text-amber-800',
  Silver: 'bg-slate-200 text-slate-700',
  Bronze: 'bg-orange-100 text-orange-800',
};

const AMB_STATUS_BADGE: Record<AmbassadorRow['status'], { icon: string; cls: string; label: string }> = {
  Verified: { icon: 'check_circle', cls: 'text-[#00a472]', label: 'Verified' },
  Pending: { icon: 'pending', cls: 'text-amber-500', label: 'Pending' },
  Unverified: { icon: 'error', cls: 'text-outline', label: 'Unverified' },
};

function AmbassadorDirectory({ onSelect }: { onSelect: (row: AmbassadorRow) => void }) {
  const [query, setQuery] = useState('');
  const [verification, setVerification] = useState('Verification: All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const filteredRows = AMBASSADOR_ROWS.filter((row) => {
    const q = query.toLowerCase();
    const matchesSearch =
      row.name.toLowerCase().includes(q) ||
      row.location.toLowerCase().includes(q);
    const matchesVerification =
      verification === 'Verification: All' || row.status === verification;
    return matchesSearch && matchesVerification;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Section Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00668a] to-[#00a472] p-5 shadow-sm flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white icon-filled">badge</span>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-white leading-tight">
            Ambassador Network
          </h2>
          <p className="text-[12px] text-white/80 font-medium">
            Referral performance, commission splits &amp; payout management
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { icon: 'group', iconCls: 'text-[#00668a]', label: 'Total Ambassadors', value: '32' },
          { icon: 'person_add', iconCls: 'text-[#40c2fd]', label: 'Total Referrals', value: '412', badge: 'Seekers', badgeCls: 'bg-[#c4e7ff] text-[#001e2d]' },
          { icon: 'pending_actions', iconCls: 'text-amber-500', label: 'Pending Payouts', value: '₦240,000', badge: 'Action Needed', badgeCls: 'bg-amber-100 text-amber-800' },
          { icon: 'payments', iconCls: 'text-[#00a472]', label: 'Settled Commissions', value: '₦1.2M', badge: 'Cleared', badgeCls: 'bg-[#4edea3] text-[#002113]' },
          { icon: 'person_off', iconCls: 'text-outline', label: 'Unverified Ambassadors', value: '12' },
          { icon: 'verified_user', iconCls: 'text-amber-500', label: 'Verification Requests', value: '5', badge: 'Action Needed', badgeCls: 'bg-amber-100 text-amber-800' },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-slate-500">
              <span className={`material-symbols-outlined text-[17px] ${c.iconCls}`}>{c.icon}</span>
              <span className="text-[12px] font-medium">{c.label}</span>
            </div>
            <div className="flex items-end justify-between gap-2">
              <span className="font-display text-2xl font-extrabold text-dark-slate leading-none">
                {c.value}
              </span>
              {c.badge && (
                <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-bold ${c.badgeCls}`}>
                  {c.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 transition-all text-sm text-dark-slate"
            placeholder="Search by ambassador name, referral code (AMB-JIDE), or campus..."
            type="text"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-dark-slate focus:outline-none focus:border-bright-cyan">
            <option>State (Lagos)</option>
            <option>State (Abuja)</option>
            <option>State (Kano)</option>
            <option>State (Oyo)</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-dark-slate focus:outline-none focus:border-bright-cyan">
            <option>Location (UNILAG / Akoka)</option>
            <option>Location (Gwarinpa)</option>
            <option>Location (Ikeja)</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-dark-slate focus:outline-none focus:border-bright-cyan">
            <option>All Payout States</option>
            <option>Pending</option>
            <option>Cleared</option>
          </select>
          <select
            value={verification}
            onChange={(e) => setVerification(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-dark-slate focus:outline-none focus:border-bright-cyan"
          >
            <option>Verification: All</option>
            <option>Verified</option>
            <option>Unverified</option>
            <option>Pending</option>
          </select>
          <div className="h-8 border-l border-slate-200 mx-1" />
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            <button className="p-1 rounded bg-bright-cyan/10 text-bright-cyan">
              <span className="material-symbols-outlined text-sm block">table_rows</span>
            </button>
            <button className="p-1 rounded text-slate-400 hover:text-dark-slate">
              <span className="material-symbols-outlined text-sm block">grid_view</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {['Ambassador', 'Tier', 'State', 'Location', 'Status', 'Referrals & Matches', 'Commission', ''].map((h, i) => (
                  <th
                    key={i}
                    className={`p-4 text-[11px] text-slate-500 uppercase tracking-wider font-semibold whitespace-nowrap ${
                      i === 7 ? 'w-12 text-center' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row) => {
                const st = AMB_STATUS_BADGE[row.status];
                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelect(row)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img
                            src={AMBASSADOR_AVATARS[row.id] ?? `https://i.pravatar.cc/100?u=${row.id}`}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                            alt={row.name}
                          />
                          <span className="material-symbols-outlined icon-filled absolute -bottom-1 -right-1 bg-white rounded-full text-[#00668a] text-sm p-0.5">
                            verified
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-dark-slate">{row.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${TIER_BADGE[row.tier]}`}>
                        {row.tier}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex max-w-max px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {row.state}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-500">{row.location}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined icon-filled text-sm ${st.cls}`}>
                          {st.icon}
                        </span>
                        <span className="text-xs text-dark-slate">{st.label}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-dark-slate">
                      {row.seekers} Seekers | {row.matches} Paid Matches
                    </td>
                    <td className="p-4 text-sm font-semibold text-dark-slate">{row.commission}</td>
                    <td className="p-4 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === row.id ? null : row.id);
                        }}
                        className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100"
                      >
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                      {openMenuId === row.id && (
                        <div
                          ref={menuRef}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1.5"
                        >
                          {[
                            { icon: 'person', label: 'View Profile' },
                            { icon: 'payments', label: 'Manage Payouts' },
                            { icon: 'message', label: 'Send Message' },
                          ].map((item) => (
                            <button
                              key={item.label}
                              onClick={() => setOpenMenuId(null)}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[17px] text-slate-500">
                                {item.icon}
                              </span>
                              <span className="text-[13px] text-dark-slate">{item.label}</span>
                            </button>
                          ))}
                          <div className="my-1.5 border-t border-slate-100" />
                          <button
                            onClick={() => setOpenMenuId(null)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-red-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px] text-red-600">
                              block
                            </span>
                            <span className="text-[13px] text-red-600">Suspend Ambassador</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200 rounded-b-xl">
          <span className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-dark-slate">1</span> to{' '}
            <span className="font-semibold text-dark-slate">{filteredRows.length}</span> of{' '}
            <span className="font-semibold text-dark-slate">{AMBASSADOR_ROWS.length}</span> ambassadors
          </span>
          <div className="flex items-center gap-2">
            <button disabled className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-sm block">chevron_left</span>
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  n === 1 ? 'bg-[#00668a] text-white' : 'hover:bg-slate-50'
                }`}
              >
                {n}
              </button>
            ))}
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-sm block">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmbassadorDetail({
  ambassador,
  onBack,
}: {
  ambassador: AmbassadorRow;
  onBack: () => void;
}) {
  const d = AMBASSADOR_DETAILS[ambassador.id];
  const [verified, setVerified] = useState(!d.unverified);

  const initials = d.fullName
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-primary flex items-center gap-1.5 transition-colors font-medium">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Ambassadors
        </button>
        <span className="mx-1 text-slate-300">/</span>
        <span className="text-primary font-semibold">{d.code}</span>
      </div>

      {/* Profile Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-display text-2xl font-bold shadow-sm">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-3xl font-bold text-dark-slate tracking-tight">
                {d.fullName}
              </h1>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-bold uppercase tracking-wider">
                {d.code}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                Joined: {d.joined}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className={`flex items-center gap-1.5 font-medium ${verified ? 'text-[#00a472]' : 'text-amber-600'}`}>
                <span className="material-symbols-outlined text-[16px]">{verified ? 'check_circle' : 'pending'}</span>
                {verified ? 'Verified Account' : 'Unverified Account'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">flag</span>
            Flag Account
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#00668a] border border-[#00668a]/20 rounded-lg font-medium text-sm hover:bg-sky-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Contact
          </button>
          <button
            onClick={() => setVerified((v) => !v)}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {verified ? 'Mark as Unverified' : 'Mark as Verified'}
          </button>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <span className="material-symbols-outlined text-[20px]">group</span>
            <h3 className="font-medium text-sm">Total Referrals</h3>
          </div>
          <div className="flex items-end gap-2">
            <p className="font-display text-3xl font-bold text-dark-slate leading-none">{d.referralCount}</p>
            <span className="text-sm text-slate-500 mb-0.5">Seekers</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
            <h3 className="font-medium text-sm">Conversion Rate</h3>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <p className="font-display text-3xl font-bold text-dark-slate leading-none">{d.conversionPercent}%</p>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[12px] font-semibold mb-0.5">Paid Matches</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#10B981] h-full rounded-full" style={{ width: `${d.conversionPercent}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <div className="flex items-center gap-3 mb-3 text-slate-500 pl-2">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <h3 className="font-medium text-sm">Pending Balance</h3>
          </div>
          <p className="font-display text-3xl font-bold text-dark-slate leading-none pl-2">{d.pendingBalance}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <span className="material-symbols-outlined text-[20px]">payments</span>
            <h3 className="font-medium text-sm">Settled Payouts</h3>
          </div>
          <p className="font-display text-3xl font-bold text-dark-slate leading-none mb-2">{d.settledPayouts}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px]">history</span>
            {d.payoutNote}
          </p>
        </div>
      </section>

      {/* Tabs + Overview */}
      <section className="flex flex-col gap-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-2 md:p-8">
        <div className="flex border-b border-slate-200 w-full overflow-x-auto">
          <button className="px-6 py-4 text-[15px] text-primary border-b-2 border-[#00668a] font-semibold whitespace-nowrap">
            Overview &amp; Details
          </button>
          <button className="px-6 py-4 text-[15px] text-slate-500 hover:text-primary transition-colors whitespace-nowrap font-medium flex items-center gap-2">
            Referred Seekers <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold">{d.referralCount}</span>
          </button>
          <button className="px-6 py-4 text-[15px] text-slate-500 hover:text-primary transition-colors whitespace-nowrap font-medium">
            Payout History
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-base font-semibold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">person</span>
                Personal Information
              </h3>
              <div className="flex flex-col gap-5 text-[15px]">
                <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <span className="font-medium text-slate-500">Email</span>
                  <span className="text-primary font-medium">{d.email}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <span className="font-medium text-slate-500">Phone</span>
                  <span className="text-primary font-medium">{d.phone}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
                  <span className="font-medium text-slate-500 mt-1.5">Socials</span>
                  <div className="flex flex-wrap gap-2">
                    {d.socials.map((s) => (
                      <span key={s} className="px-3 py-1.5 bg-slate-100 rounded-md text-[13px] text-primary font-medium border border-slate-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
                  <span className="font-medium text-slate-500 mt-0.5">Emergency Contact</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-primary font-medium">{d.emergencyName}</span>
                    <span className="text-primary font-medium">{d.emergencyPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-base font-semibold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">school</span>
                Institutional Reach &amp; Context
              </h3>
              <div className="flex flex-col gap-5 text-[15px]">
                <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <span className="font-medium text-slate-500">State</span>
                  <span className="text-primary font-medium">{ambassador.state} State</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <span className="font-medium text-slate-500">Institution</span>
                  <span className="text-primary font-medium">{d.institution}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <span className="font-medium text-slate-500">Target Audience</span>
                  <span className="text-primary font-medium">{d.targetAudience}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-base font-semibold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">location_on</span>
                Operational Details
              </h3>
              <div className="flex flex-col gap-8">
                <div>
                  <span className="block font-medium text-[13px] text-slate-500 mb-3">Assigned Jurisdiction</span>
                  <div className="flex flex-wrap gap-2">
                    {d.jurisdictions.map((j) => (
                      <span key={j} className="px-3 py-1.5 bg-sky-100/60 text-sky-900 rounded-md font-medium text-sm">
                        {j}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="block font-medium text-[13px] text-slate-500">Payout Account</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold text-primary uppercase tracking-wider">
                      {d.commissionRate}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-[#4B1273] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                      {initials[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[15px] text-primary flex items-center gap-1.5 mb-1">
                        {d.fullName.toUpperCase()}
                        <span className="material-symbols-outlined icon-filled text-[16px] text-[#10B981]">verified</span>
                      </p>
                      <p className="text-sm text-slate-500 font-medium">{d.bankName} • {d.bankNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="text-base font-semibold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">fact_check</span>
                Verification Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {d.checklist.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="material-symbols-outlined icon-filled text-[#10B981] text-[20px]">check_circle</span>
                    <span className="text-sm font-medium text-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function UserDetail({ user, onBack }: { user: DirectoryRow; onBack: () => void }) {
  const d = getUserDetail(user);
  const initials = user.initials;

  const Field = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
    <div className="flex flex-col gap-1">
      <dt className="text-slate-500 font-medium text-[13px]">{label}</dt>
      <dd className={`text-primary ${strong ? 'font-bold text-[16px]' : 'font-semibold text-[15px]'}`}>{value}</dd>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Back */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-primary flex items-center gap-1.5 transition-colors font-medium">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Users
        </button>
        <span className="mx-1 text-slate-300">/</span>
        <span className="text-primary font-semibold">{user.seekerId}</span>
      </div>

      {/* Header Banner */}
      <section className="bg-white rounded-2xl shadow-sm p-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold text-[24px] shrink-0 border-4 border-white shadow-sm">
            {initials}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-xl text-primary tracking-tight">{d.fullName}</h2>
              <span className="bg-slate-100 text-slate-500 font-bold text-xs px-2.5 py-1 rounded-md">{user.seekerId}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-amber-50 text-amber-700 font-semibold text-[13px] px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-100/50">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Seeking Roommate
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-semibold text-[13px] px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-100/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Account Active
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <button className="bg-[#38BDF8] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#38BDF8]/90 transition-colors flex items-center gap-2 flex-1 xl:flex-none justify-center">
            <span className="material-symbols-outlined text-[18px]">bolt</span> Force Manual Match
          </button>
          <button className="bg-white border border-emerald-200 text-emerald-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-2 flex-1 xl:flex-none justify-center shadow-sm">
            <span className="material-symbols-outlined text-[18px]">chat</span> Contact on WhatsApp
          </button>
          <button className="bg-white border border-red-200 text-red-500 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2 flex-1 xl:flex-none justify-center shadow-sm">
            <span className="material-symbols-outlined text-[18px]">block</span> Suspend Account
          </button>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 border border-slate-100">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-widest text-slate-400">Total Match Fees Paid</span>
            <span className="material-symbols-outlined text-emerald-500 text-[20px]">payments</span>
          </div>
          <div className="font-bold text-3xl text-primary">{d.feesPaid}</div>
          <div className="text-emerald-600 font-medium text-[13px] bg-emerald-50 self-start px-3 py-1 rounded-md">{d.paymentsCount}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 border border-slate-100">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-widest text-slate-400">Referral Source</span>
            <span className="material-symbols-outlined text-[#38BDF8] text-[20px]">share</span>
          </div>
          <div className="font-bold text-3xl text-primary">{d.referralSource}</div>
          <div className="text-slate-600 font-medium text-[13px] bg-slate-100 self-start px-3 py-1 rounded-md">{d.referralAttribution}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 border border-slate-100">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-widest text-slate-400">Active Matches</span>
            <span className="material-symbols-outlined text-[#38BDF8] text-[20px]">sync</span>
          </div>
          <div className="font-bold text-3xl text-primary">{d.activeMatches}</div>
          <div className="text-blue-600 font-medium text-[13px] bg-blue-50 self-start px-3 py-1 rounded-md">In Progress</div>
        </div>
      </section>

      {/* Tabbed Content */}
      <section className="bg-white rounded-2xl shadow-sm flex flex-col border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50">
          <button className="px-6 py-4 text-sm text-primary border-b-2 border-primary font-bold transition-colors">Profile &amp; Preferences</button>
          <button className="px-6 py-4 text-sm text-slate-500 font-medium hover:text-primary transition-colors">Match History (4)</button>
          <button className="px-6 py-4 text-sm text-slate-500 font-medium hover:text-primary transition-colors">Paystack Transactions (3)</button>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <h3 className="font-bold text-lg text-primary border-b border-slate-100 pb-4">Demographics &amp; Contact</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
              <Field label="Phone/WhatsApp" value={d.phone} />
              <Field label="Email" value={d.email} />
              <Field label="Gender" value={d.gender} />
              <Field label="Age Bracket" value={d.ageBracket} />
              <Field label="Religion" value={d.religion} />
              <Field label="Status" value={d.marStatus} />
              <Field label="Occupation" value={d.occupation} />
              <Field label="Schedule" value={d.schedule} />
            </dl>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="font-bold text-lg text-primary border-b border-slate-100 pb-4">Location, Budget &amp; Co-living</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
              <Field label="State" value={user.state} />
              <Field label="Preferred Areas" value={d.prefAreas} />
              <Field label="Target Budget" value={user.budget} strong />
              <Field label="Budget Range" value={d.budgetRange} />
              <div className="col-span-full flex flex-col gap-1">
                <dt className="text-slate-500 font-medium text-[13px]">Target Move-in Date</dt>
                <dd className="text-primary font-semibold text-[15px]">{d.moveInDate}</dd>
              </div>
            </dl>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mt-2">
              <h4 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400">format_quote</span>
                User Bio
              </h4>
              <p className="font-medium text-[15px] leading-relaxed text-slate-600 italic">{d.bio}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface PaymentRow {
  id: string;
  ref: string;
  date: string;
  seeker: string;
  seekerId: string;
  match: string;
  matchId: string;
  fee: string;
  attribution: string;
  split: string;
  status: 'Paid' | 'Pending';
}

const PAYMENT_ROWS: PaymentRow[] = [
  { id: 'p1', ref: 'T902183910', date: '17 Aug 2026', seeker: 'Chidi O.', seekerId: '#RM-104', match: 'Emeka K.', matchId: '#RM-208', fee: '₦2,000', attribution: 'Ref: AMB-JIDE', split: '(₦1,000 Split)', status: 'Paid' },
  { id: 'p2', ref: 'T902183911', date: '17 Aug 2026', seeker: 'Sarah A.', seekerId: '#RM-105', match: 'Bella N.', matchId: '#RM-209', fee: '₦2,000', attribution: 'Ref: AMB-MARK', split: '(₦1,000 Split)', status: 'Pending' },
  { id: 'p3', ref: 'T902183912', date: '16 Aug 2026', seeker: 'John D.', seekerId: '#RM-106', match: 'Paul S.', matchId: '#RM-210', fee: '₦2,000', attribution: 'Direct', split: '(No split)', status: 'Paid' },
  { id: 'p4', ref: 'T902183913', date: '16 Aug 2026', seeker: 'Amina K.', seekerId: '#RM-107', match: 'David L.', matchId: '#RM-211', fee: '₦2,000', attribution: 'Ref: AMB-CHRIS', split: '(₦1,000 Split)', status: 'Paid' },
  { id: 'p5', ref: 'T902183914', date: '15 Aug 2026', seeker: 'Femi A.', seekerId: '#RM-108', match: 'Grace E.', matchId: '#RM-212', fee: '₦2,000', attribution: 'Direct', split: '(No split)', status: 'Pending' },
  { id: 'p6', ref: 'T902183915', date: '15 Aug 2026', seeker: 'Ibrahim M.', seekerId: '#RM-109', match: 'Hope S.', matchId: '#RM-213', fee: '₦2,000', attribution: 'Ref: AMB-JIDE', split: '(₦1,000 Split)', status: 'Paid' },
  { id: 'p7', ref: 'T902183916', date: '14 Aug 2026', seeker: 'Kelechi U.', seekerId: '#RM-110', match: 'Linda O.', matchId: '#RM-214', fee: '₦2,000', attribution: 'Direct', split: '(No split)', status: 'Paid' },
  { id: 'p8', ref: 'T902183917', date: '14 Aug 2026', seeker: 'Musa B.', seekerId: '#RM-111', match: 'Ngozi P.', matchId: '#RM-215', fee: '₦2,000', attribution: 'Ref: AMB-MARK', split: '(₦1,000 Split)', status: 'Pending' },
];

function PaymentControl() {
  const [query, setQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const filteredRows = PAYMENT_ROWS.filter((r) =>
    r.ref.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Financial Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 1: Paystack Payout Balance (Highlighted) */}
        <div className="bg-primary text-white rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-28 border border-slate-800">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <span className="material-symbols-outlined icon-filled text-6xl">account_balance</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Paystack Payout Balance</p>
            <h3 className="font-display text-xl font-bold">₦520,000</h3>
          </div>
          <div className="mt-auto self-start">
            <button className="bg-[#40c2fd] hover:bg-[#7bd0ff] text-white text-xs px-3 py-1 rounded-md font-bold shadow-sm transition-all">
              Top Up
            </button>
          </div>
        </div>
        {/* Card 2: Total Gross Revenue */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-xs text-slate-500 mb-1">Total Gross Revenue</p>
            <h3 className="font-display text-xl font-bold text-dark-slate">₦1,850,000</h3>
          </div>
          <div className="mt-auto">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12%
            </span>
          </div>
        </div>
        {/* Card 3: Pending Match Payments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-xs text-slate-500 mb-1">Pending Match Payments</p>
            <h3 className="font-display text-xl font-bold text-dark-slate">14 Seekers</h3>
          </div>
          <div className="mt-auto">
            <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md text-xs font-semibold border border-sky-100">
              <span className="material-symbols-outlined text-[14px]">hourglass_empty</span>
              Awaiting action
            </span>
          </div>
        </div>
        {/* Card 4: Pending Ambassador Payouts */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-xs text-slate-500 mb-1">Pending Ambassador Payouts</p>
            <h3 className="font-display text-xl font-bold text-dark-slate">₦240,000</h3>
          </div>
          <div className="mt-auto">
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">people</span>
              8 pending
            </span>
          </div>
        </div>
        {/* Card 5: Net Platform Earnings */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-28 relative overflow-hidden">
          <div>
            <p className="text-xs text-slate-500 mb-1">Net Platform Earnings</p>
            <h3 className="font-display text-xl font-bold text-emerald-700">₦925,000</h3>
          </div>
          <div className="mt-auto">
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[50%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Control Canvas */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="border-b border-slate-200 flex px-4 pt-2 bg-slate-50">
          <button className="px-6 py-3 text-sm text-primary font-bold border-b-2 border-primary relative -mb-[1px]">
            Inbound Match Fees &amp; Links
          </button>
          <button className="px-6 py-3 text-sm text-slate-500 font-medium hover:bg-slate-100 transition-colors relative -mb-[1px] flex items-center gap-2">
            Ambassador Payout Queue
            <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">8</span>
          </button>
          <button className="px-6 py-3 text-sm text-slate-500 font-medium hover:bg-slate-100 transition-colors relative -mb-[1px]">
            Refunds &amp; Disputes
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-0 flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white">
            <div className="relative max-w-sm w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                search
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#40c2fd] focus:ring-2 focus:ring-[#40c2fd]/20 transition-all"
                placeholder="Search payment reference (T90218)..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Status: All
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Date Range
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button className="flex items-center justify-center p-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-sm">file_download</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Paystack Ref &amp; Date</th>
                  <th className="px-4 py-3 font-semibold">Seeker &amp; Match Pair</th>
                  <th className="px-4 py-3 font-semibold text-right">Match Fee</th>
                  <th className="px-4 py-3 font-semibold">Ambassador Attribution</th>
                  <th className="px-4 py-3 font-semibold">Payment Status</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-on-surface">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm font-semibold text-slate-800">{row.ref}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{row.date}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{row.seeker}</span>
                        <span className="text-slate-400 text-xs">{row.seekerId}</span>
                        <span className="material-symbols-outlined text-slate-400 text-xs">arrow_forward</span>
                        <span className="font-medium text-sm">{row.match}</span>
                        <span className="text-slate-400 text-xs">{row.matchId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-right font-medium text-sm">{row.fee}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-sm">{row.attribution}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{row.split}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {row.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 px-2 py-1 rounded-md text-xs border border-sky-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00658d]" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-center relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                        className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100"
                      >
                        <span className="material-symbols-outlined text-sm">more_vert</span>
                      </button>
                      {openMenuId === row.id && (
                        <div
                          ref={menuRef}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1.5 text-left"
                        >
                          {[
                            { icon: 'receipt_long', label: 'View Receipt' },
                            { icon: 'link', label: 'Resend Payment Link' },
                            { icon: 'check_circle', label: 'Mark as Paid' },
                          ].map((item) => (
                            <button
                              key={item.label}
                              onClick={() => setOpenMenuId(null)}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[17px] text-slate-500">
                                {item.icon}
                              </span>
                              <span className="text-[13px] text-slate-800">{item.label}</span>
                            </button>
                          ))}
                          <div className="my-1.5 border-t border-slate-100" />
                          <button
                            onClick={() => setOpenMenuId(null)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-red-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px] text-red-600">
                              currency_exchange
                            </span>
                            <span className="text-[13px] text-red-600">Refund</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <span className="text-sm text-slate-500">Showing 1 to 3 of 124 entries</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1 rounded text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded bg-[#40c2fd] text-white text-sm flex items-center justify-center">1</button>
              {[2, 3].map((n) => (
                <button key={n} className="w-8 h-8 rounded hover:bg-slate-100 text-slate-500 text-sm flex items-center justify-center transition-colors">
                  {n}
                </button>
              ))}
              <button className="p-1 rounded text-slate-400 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, hydrated, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [matchSettingsOpen, setMatchSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [matchTriggered, setMatchTriggered] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'matches' | 'users' | 'ambassadors' | 'ambassador-detail' | 'user-detail' | 'payments'>('dashboard');
  const [selectedAmbassador, setSelectedAmbassador] = useState<AmbassadorRow | null>(null);
  const [selectedUser, setSelectedUser] = useState<DirectoryRow | null>(null);
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
          ) : activeView === 'users' ? (
            <h2 className="font-display font-bold text-base text-dark-slate hidden md:block">
              Roommate Directory &amp; Operations
            </h2>
          ) : activeView === 'user-detail' ? (
            <h2 className="font-display font-bold text-base text-dark-slate hidden md:block">
              User Profile
            </h2>
          ) : activeView === 'payments' ? (
            <h2 className="font-display font-bold text-base text-dark-slate hidden md:block">
              Payments
            </h2>
          ) : activeView === 'ambassadors' ? (
            <h2 className="font-display font-bold text-base text-dark-slate hidden md:block">
              Ambassador Network &amp; Payout Operations
            </h2>
          ) : activeView === 'ambassador-detail' ? (
            <h2 className="font-display font-bold text-base text-dark-slate hidden md:block">
              Ambassador Profile
            </h2>
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
          <button
            onClick={() => setActiveView('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
              activeView === 'users'
                ? 'bg-slate-800 text-bright-cyan font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">person</span>
            Users
          </button>
          <button
            onClick={() => setActiveView('ambassadors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
              activeView === 'ambassadors'
                ? 'bg-slate-800 text-bright-cyan font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">badge</span>
            Ambassadors
          </button>
          <button
            onClick={() => setActiveView('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
              activeView === 'payments'
                ? 'bg-slate-800 text-bright-cyan font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">payments</span>
            Payments
          </button>
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
        ) : activeView === 'users' ? (
          <RoommateDirectory onSelect={(row) => { setSelectedUser(row); setActiveView('user-detail'); }} />
        ) : activeView === 'user-detail' && selectedUser ? (
          <UserDetail user={selectedUser} onBack={() => setActiveView('users')} />
        ) : activeView === 'ambassadors' ? (
          <AmbassadorDirectory onSelect={(row) => { setSelectedAmbassador(row); setActiveView('ambassador-detail'); }} />
        ) : activeView === 'ambassador-detail' && selectedAmbassador ? (
          <AmbassadorDetail ambassador={selectedAmbassador} onBack={() => setActiveView('ambassadors')} />
        ) : activeView === 'payments' ? (
          <PaymentControl />
        ) : (
          <MatchWorkspace
            pairs={proposedPairs}
            onReject={handleRejectMatch}
            onConfirm={handleConfirmMatch}
            onOpenSettings={() => setMatchSettingsOpen(true)}
          />
        )}
      </main>

      <MatchSettingsModal
        open={matchSettingsOpen}
        onClose={() => setMatchSettingsOpen(false)}
      />

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
