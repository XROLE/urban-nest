'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Modal from '@/components/Modal';

type View = 'dashboard' | 'referrals';

interface ReferralRow {
  name: string;
  date: string;
  status: 'Paid' | 'Profile Complete' | 'Signed Up' | 'Match Found';
  location: string;
  reward: number;
}

const STATUSES: Array<ReferralRow['status'] | 'All'> = [
  'All',
  'Paid',
  'Profile Complete',
  'Signed Up',
  'Match Found',
];

const colorForStatus: Record<ReferralRow['status'], string> = {
  Paid: 'bg-emerald-50 text-emerald-600',
  'Profile Complete': 'bg-sky-50 text-sky-600',
  'Signed Up': 'bg-slate-100 text-slate-600',
  'Match Found': 'bg-slate-200 text-dark-slate',
};

const dotForStatus: Record<ReferralRow['status'], string> = {
  Paid: 'bg-emerald-500',
  'Profile Complete': 'bg-sky-500',
  'Signed Up': 'bg-slate-400',
  'Match Found': 'bg-dark-slate',
};

const SAMPLE_REFERRALS: ReferralRow[] = [
  { name: 'Sarah Jenkins', date: 'Oct 24, 2023', status: 'Paid', location: 'Lagos', reward: 2000 },
  { name: 'Michael Okafor', date: 'Oct 22, 2023', status: 'Profile Complete', location: 'Abuja', reward: 0 },
  { name: 'Emeka Anya', date: 'Oct 20, 2023', status: 'Signed Up', location: 'Port Harcourt', reward: 0 },
  { name: 'David Balogun', date: 'Oct 18, 2023', status: 'Match Found', location: 'Lagos', reward: 0 },
  { name: 'Chioma Adeyemi', date: 'Oct 15, 2023', status: 'Paid', location: 'Ibadan', reward: 2000 },
  { name: 'Tunde Olatunji', date: 'Oct 12, 2023', status: 'Profile Complete', location: 'Lagos', reward: 0 },
  { name: 'Favour Nwachukwu', date: 'Oct 10, 2023', status: 'Paid', location: 'Enugu', reward: 2000 },
  { name: 'Kingsley Eze', date: 'Oct 08, 2023', status: 'Match Found', location: 'Abuja', reward: 0 },
  { name: 'Aisha Mohammed', date: 'Oct 05, 2023', status: 'Signed Up', location: 'Kano', reward: 0 },
  { name: 'Joy Udo', date: 'Oct 01, 2023', status: 'Paid', location: 'Uyo', reward: 2000 },
  { name: 'Blessing Okoye', date: 'Sep 28, 2023', status: 'Profile Complete', location: 'Lagos', reward: 0 },
  { name: 'Ibrahim Musa', date: 'Sep 25, 2023', status: 'Paid', location: 'Kano', reward: 2000 },
  { name: 'Ngozi Chukwu', date: 'Sep 22, 2023', status: 'Signed Up', location: 'Enugu', reward: 0 },
  { name: 'Peter Obi', date: 'Sep 20, 2023', status: 'Match Found', location: 'Onitsha', reward: 0 },
  { name: 'Adaora Ibe', date: 'Sep 18, 2023', status: 'Paid', location: 'Lagos', reward: 2000 },
  { name: 'Chinedu Nwosu', date: 'Sep 15, 2023', status: 'Profile Complete', location: 'Ibadan', reward: 0 },
  { name: 'Fatima Bello', date: 'Sep 12, 2023', status: 'Signed Up', location: 'Kaduna', reward: 0 },
  { name: 'Tola Adebiyi', date: 'Sep 10, 2023', status: 'Paid', location: 'Lagos', reward: 2000 },
  { name: 'Yemi Ojo', date: 'Sep 08, 2023', status: 'Match Found', location: 'Abeokuta', reward: 0 },
  { name: 'Halima Sani', date: 'Sep 05, 2023', status: 'Profile Complete', location: 'Kano', reward: 0 },
  { name: 'Emeka Obi', date: 'Sep 02, 2023', status: 'Paid', location: 'Enugu', reward: 2000 },
  { name: 'Zainab Ibrahim', date: 'Aug 30, 2023', status: 'Signed Up', location: 'Abuja', reward: 0 },
  { name: 'Kelechi Nduka', date: 'Aug 28, 2023', status: 'Match Found', location: 'Lagos', reward: 0 },
  { name: 'Amina Yusuf', date: 'Aug 25, 2023', status: 'Paid', location: 'Kaduna', reward: 2000 },
  { name: 'Seyi Adewale', date: 'Aug 22, 2023', status: 'Profile Complete', location: 'Lagos', reward: 0 },
  { name: 'Nneka Okafor', date: 'Aug 20, 2023', status: 'Signed Up', location: 'Onitsha', reward: 0 },
  { name: 'Musa Jibrin', date: 'Aug 18, 2023', status: 'Paid', location: 'Abuja', reward: 2000 },
  { name: 'Chiamaka Eze', date: 'Aug 15, 2023', status: 'Match Found', location: 'Lagos', reward: 0 },
  { name: 'Tunde Bakare', date: 'Aug 12, 2023', status: 'Profile Complete', location: 'Ibadan', reward: 0 },
  { name: 'Rita Ani', date: 'Aug 10, 2023', status: 'Paid', location: 'Enugu', reward: 2000 },
  { name: 'Damilola Ogun', date: 'Aug 08, 2023', status: 'Signed Up', location: 'Lagos', reward: 0 },
  { name: 'Hauwa Bala', date: 'Aug 05, 2023', status: 'Match Found', location: 'Kano', reward: 0 },
  { name: 'Emeka Uche', date: 'Aug 02, 2023', status: 'Paid', location: 'Port Harcourt', reward: 2000 },
  { name: 'Bolaji Adesina', date: 'Jul 30, 2023', status: 'Profile Complete', location: 'Lagos', reward: 0 },
  { name: 'Kemi Olawale', date: 'Jul 28, 2023', status: 'Signed Up', location: 'Ibadan', reward: 0 },
  { name: 'Yusuf Abdullahi', date: 'Jul 25, 2023', status: 'Paid', location: 'Kaduna', reward: 2000 },
  { name: 'Amara Nwankwo', date: 'Jul 22, 2023', status: 'Match Found', location: 'Enugu', reward: 0 },
  { name: 'Femi Adeyemi', date: 'Jul 20, 2023', status: 'Profile Complete', location: 'Lagos', reward: 0 },
  { name: 'Ijeoma Obasi', date: 'Jul 18, 2023', status: 'Paid', location: 'Onitsha', reward: 2000 },
  { name: 'Chukwuma Okafor', date: 'Jul 15, 2023', status: 'Signed Up', location: 'Abuja', reward: 0 },
  { name: 'Bisi Adeyemi', date: 'Jul 12, 2023', status: 'Match Found', location: 'Lagos', reward: 0 },
  { name: 'Omotola Adekunle', date: 'Jul 10, 2023', status: 'Paid', location: 'Ibadan', reward: 2000 },
];

const PAGE_SIZE = 10;

export default function AmbassadorDashboard() {
  const router = useRouter();
  const { user, profile, logout, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralRow['status'] | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/ambassador/login');
    } else if (user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, user?.role, router]);

  const fullName = user?.full_name || 'Ambassador';
  const firstName = fullName.trim().split(/\s+/)[0] || 'Ambassador';
  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AM';

  const referralCode = profile?.referral_code || 'SN00';
  const referralLink = `https://urban-nest-tawny.vercel.app?ref=${referralCode}`;

  const whatsappCaption = `Hey! Are you (or someone you know)—whether a Corper, student, young professional, or relocating to Lagos—currently searching for a roommate or looking to split rent in a great location around Lagos? 🏠

Check out Roommate NG. You just share your budget, target area, and living habits, and we connect you with compatible, like-minded roommates.

No upfront fees are required until you are paired with a roommate 🚀

Fill out the short form here to get started:
👉 https://urban-nest-tawny.vercel.app?ref=${referralCode}`;

  const totalReferrals = profile?.total_referrals ?? 24;
  const totalEarnings = profile?.total_earnings_ngn ?? 6000;
  const pendingBalance = profile?.pending_balance_ngn ?? 4500;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(whatsappCaption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2500);
  };

  const handleWithdraw = () => {
    setWithdrawn(true);
    setTimeout(() => setWithdrawn(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/ambassador/login');
  };

  const confirmLogout = () => {
    setLogoutModalOpen(false);
    handleLogout();
  };

  const filteredReferrals = SAMPLE_REFERRALS.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredReferrals.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageRows = filteredReferrals.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const applyView = (next: View) => {
    setView(next);
    setSearchQuery('');
    setStatusFilter('All');
    setCurrentPage(1);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 z-30 transition-all duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden text-primary focus:outline-none p-2 rounded-full hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          {view === 'referrals' ? (
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full px-4 py-2 w-full max-w-xs focus-within:border-bright-cyan focus-within:ring-2 focus-within:ring-bright-cyan/20 transition-all hidden sm:flex">
              <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search referrals..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent outline-none text-sm text-dark-slate placeholder:text-slate-400 w-full"
              />
            </div>
          ) : (
            <h2 className="font-display text-xl font-bold text-primary hidden md:block">
              Ambassador Dashboard
            </h2>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="font-body text-sm font-semibold text-dark-slate hidden sm:inline">
            Hi, {firstName} 👋
          </span>
          <button
            aria-label="Notifications"
            className="text-slate-500 hover:text-bright-cyan transition-colors p-2 rounded-full hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-xl">
              notifications
            </span>
          </button>
          <button
            aria-label="Help"
            className="text-slate-500 hover:text-bright-cyan transition-colors p-2 rounded-full hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-xl">
              help_outline
            </span>
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center font-bold text-xs text-primary">
            {initials}
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-primary text-white z-40 transition-transform duration-300 ${
          mobileSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="py-6 px-4 flex flex-col h-full">
          {/* Brand Area */}
          <div className="px-4 py-4 mb-6">
            <Link
              href="/ambassador/dashboard"
              className="font-display text-2xl font-extrabold text-white tracking-tight block"
            >
              Roommate NG
            </Link>
            <span className="font-body text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Ambassador Portal
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1">
            <button
              onClick={() => applyView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg ${
                view === 'dashboard'
                  ? 'text-bright-cyan bg-slate-800/80 border-r-4 border-bright-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  view === 'dashboard' ? 'icon-filled' : ''
                }`}
              >
                dashboard
              </span>
              <span className="font-body text-sm">Dashboard</span>
            </button>
            <button
              onClick={() => applyView('referrals')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg ${
                view === 'referrals'
                  ? 'text-bright-cyan bg-slate-800/80 border-r-4 border-bright-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  view === 'referrals' ? 'icon-filled' : ''
                }`}
              >
                group
              </span>
              <span className="font-body text-sm">Referrals</span>
            </button>
          </nav>

          {/* CTA & Logout */}
          <div className="mt-auto border-t border-slate-800 pt-4 space-y-2">
            <button
              onClick={handleCopy}
              className="w-full bg-bright-cyan text-white font-display font-semibold py-2.5 rounded-xl hover:bg-bright-cyan/90 transition-all flex justify-center items-center gap-2 text-sm shadow-md"
            >
              <span className="material-symbols-outlined text-base">
                content_copy
              </span>
              Copy Invite Link
            </button>

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
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 pt-24 min-h-screen px-4 md:px-8 pb-16 max-w-[1280px]">
        {/* Toast Alert */}
        {copied && (
          <div className="fixed top-20 right-8 bg-mint text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="material-symbols-outlined text-lg">
              check_circle
            </span>
            <span className="font-semibold text-sm">
              Referral link copied to clipboard!
            </span>
          </div>
        )}

        {captionCopied && (
          <div className="fixed top-20 right-8 bg-mint text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="material-symbols-outlined text-lg">
              check_circle
            </span>
            <span className="font-semibold text-sm">
              WhatsApp caption copied to clipboard!
            </span>
          </div>
        )}

        {withdrawn && (
          <div className="fixed top-20 right-8 bg-bright-cyan text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="material-symbols-outlined text-lg">payments</span>
            <span className="font-semibold text-sm">
              Withdrawal request for ₦{pendingBalance.toLocaleString()} submitted!
            </span>
          </div>
        )}

        {view === 'dashboard' ? (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-dark-slate mb-1">
                Dashboard Overview
              </h1>
              <p className="font-body text-sm text-slate-500">
                Track your referrals, earnings, and access marketing resources.
              </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Referral Card & Tables */}
          <div className="lg:col-span-2 space-y-8">
            {/* Referral Sharing Card */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
              <div className="flex-1 z-10 w-full space-y-3">
                <h3 className="font-display font-bold text-xl text-dark-slate">
                  Your referral code is ready!
                </h3>
                <p className="font-body text-sm text-slate-500">
                  Share this code with friends looking for roommates or apartments in Nigeria.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch pt-2">
                  <div className="flex-grow flex items-center bg-slate-100 rounded-full border border-slate-200 px-5 py-2.5">
                    <span className="font-display font-bold text-dark-slate tracking-wider">
                      {referralCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="bg-bright-cyan text-white font-display font-semibold px-6 py-2.5 rounded-full hover:bg-bright-cyan/90 transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                  >
                    <span className="material-symbols-outlined text-base">
                      content_copy
                    </span>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <p className="font-body text-xs text-slate-400 pt-1">
                  {referralLink}
                </p>
              </div>
            </section>

            {/* Overview Metrics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-bright-cyan text-2xl">
                    group
                  </span>
                  <span className="bg-mint/10 text-mint text-xs font-bold px-2.5 py-1 rounded-full">
                    +12%
                  </span>
                </div>
                <h4 className="font-body text-xs text-slate-500 font-semibold uppercase">
                  Total Referrals
                </h4>
                <p className="font-display text-3xl font-extrabold text-dark-slate">
                  {totalReferrals}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-bright-cyan text-2xl">
                    task_alt
                  </span>
                </div>
                <h4 className="font-body text-xs text-slate-500 font-semibold uppercase">
                  Successful Payments
                </h4>
                <p className="font-display text-3xl font-extrabold text-dark-slate">
                  10
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-bright-cyan text-2xl">
                    account_balance_wallet
                  </span>
                </div>
                <h4 className="font-body text-xs text-slate-500 font-semibold uppercase">
                  Total Earnings
                </h4>
                <p className="font-display text-3xl font-extrabold text-dark-slate">
                  ₦{totalEarnings.toLocaleString()}
                </p>
              </div>

              <div className="bg-dark-slate text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-bright-cyan text-2xl">
                    payments
                  </span>
                </div>
                <h4 className="font-body text-xs text-slate-400 font-semibold uppercase">
                  Available for Withdrawal
                </h4>
                <div className="flex justify-between items-end pt-1">
                  <p className="font-display text-3xl font-extrabold text-bright-cyan">
                    ₦{pendingBalance.toLocaleString()}
                  </p>
                  <button
                    onClick={handleWithdraw}
                    className="bg-bright-cyan text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-bright-cyan/90 transition-colors"
                  >
                    Request
                  </button>
                </div>
              </div>
            </section>

            {/* Recent Referrals Table */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-lg text-dark-slate">
                  Recent Referrals
                </h3>
                <button className="text-bright-cyan text-xs font-bold hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Date Joined</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-body divide-y divide-slate-100">
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-dark-slate">
                        John A.
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">Oct 24, 2023</td>
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Profile Created
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-dark-slate">
                        Sarah O.
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">Oct 22, 2023</td>
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                          Match Found
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-dark-slate">
                        David E.
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">Oct 20, 2023</td>
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
                          Payment Pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-dark-slate">
                        Grace K.
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">Oct 18, 2023</td>
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                          Paid
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Resources Panel */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-dark-slate flex items-center gap-2">
                <span className="material-symbols-outlined text-bright-cyan">
                  auto_awesome
                </span>
                Ambassador Resources
              </h3>
              <p className="font-body text-xs text-slate-500">
                Marketing materials to help you share and convert.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href="/marketing-flyer.png"
                  download="Roommate-NG-Marketing-Flyer.png"
                  className="p-4 rounded-xl border border-slate-200 hover:border-bright-cyan transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-bright-cyan text-2xl">
                      campaign
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-dark-slate">
                        Marketing Flyer
                      </h4>
                      <p className="text-[11px] text-slate-400">PNG</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-bright-cyan">
                    download
                  </span>
                </a>

                <div
                  onClick={handleCopyCaption}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500 text-2xl">
                      chat
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-dark-slate">
                        WhatsApp Caption
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Ready-to-use text
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-500">
                    {captionCopied ? 'check' : 'content_copy'}
                  </span>
                </div>

                <a
                  href="/social_media_asset.png"
                  download="Roommate-NG-Social-Media-Asset.png"
                  className="p-4 rounded-xl border border-slate-200 hover:border-bright-cyan transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-bright-cyan text-2xl">
                      image
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-dark-slate">
                        Social Media Assets
                      </h4>
                      <p className="text-[11px] text-slate-400">IG & Twitter</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-bright-cyan">
                    download
                  </span>
                </a>
              </div>
            </section>
          </div>
          </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-dark-slate">
                All Referrals
              </h1>
              <p className="font-body text-sm text-slate-500">
                Track everyone referred through your unique code.
              </p>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="w-full sm:hidden flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent outline-none text-sm text-dark-slate placeholder:text-slate-400 w-full"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Status:
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(
                        e.target.value as ReferralRow['status'] | 'All'
                      );
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-bright-cyan"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Date:
                  </span>
                  <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-bright-cyan">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>

              <button className="hidden sm:flex items-center gap-2 border border-slate-300 text-dark-slate font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">
                  download
                </span>
                Export
              </button>
            </div>

            {/* Referrals Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Date Referred</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4 text-right">Reward Earned</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-body divide-y divide-slate-100">
                    {pageRows.map((r) => {
                      const initials = r.name
                        .split(' ')
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();
                      return (
                        <tr
                          key={r.name}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 text-primary flex items-center justify-center font-bold text-xs">
                                {initials}
                              </div>
                              <span className="font-semibold text-dark-slate">
                                {r.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{r.date}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorForStatus[r.status]}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full mr-1.5 ${dotForStatus[r.status]}`}
                              />
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {r.location}
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-medium ${
                              r.reward ? 'text-dark-slate' : 'text-slate-500'
                            }`}
                          >
                            ₦{r.reward.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                    {pageRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-slate-400"
                        >
                          No referrals match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-xs text-slate-500">
                  {filteredReferrals.length === 0
                    ? '0 referrals'
                    : `Showing ${
                        (page - 1) * PAGE_SIZE + 1
                      }-${Math.min(
                        page * PAGE_SIZE,
                        filteredReferrals.length
                      )} of ${filteredReferrals.length} referrals`}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setCurrentPage(page - 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setCurrentPage(page + 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
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
