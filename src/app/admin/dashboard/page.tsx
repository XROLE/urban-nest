'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

interface Profile {
  id: string;
  name: string;
  area: string;
  budget: string;
  moveIn: string;
  occupation: string;
  status: 'Reviewing' | 'Matched' | 'New' | 'Paid';
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [matchTriggered, setMatchTriggered] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/ambassador/login');
    } else if (user?.role !== 'admin') {
      router.replace('/ambassador/dashboard');
    }
  }, [isAuthenticated, user?.role, router]);

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
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-bright-cyan font-bold rounded-xl text-sm"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm"
          >
            <span className="material-symbols-outlined">person_search</span>
            Profiles
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm"
          >
            <span className="material-symbols-outlined">group</span>
            Matches
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm"
          >
            <span className="material-symbols-outlined">payments</span>
            Payments
          </a>
        </nav>

        <div className="pt-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold px-2 py-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Public Site
          </Link>
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
      </main>
    </div>
  );
}
