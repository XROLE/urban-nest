'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AmbassadorDashboard() {
  const [copied, setCopied] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const referralCode = 'GOODNESS01';
  const referralLink = `https://roommateng.com/r/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWithdraw = () => {
    setWithdrawn(true);
    setTimeout(() => setWithdrawn(false), 3000);
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
          <h2 className="font-display text-xl font-bold text-primary hidden md:block">
            Ambassador Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-body text-sm font-semibold text-dark-slate hidden sm:inline">
            Hi, John 👋
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
            JA
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
              href="/"
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
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-bright-cyan bg-slate-800/80 border-r-4 border-bright-cyan font-bold transition-all rounded-l-lg"
            >
              <span className="material-symbols-outlined icon-filled">
                dashboard
              </span>
              <span className="font-body text-sm">Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-lg"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="font-body text-sm">Referrals</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-lg"
            >
              <span className="material-symbols-outlined">payments</span>
              <span className="font-body text-sm">Earnings</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-lg"
            >
              <span className="material-symbols-outlined">library_books</span>
              <span className="font-body text-sm">Resources</span>
            </a>
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

            <Link
              href="/ambassador/login"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span>Log Out</span>
            </Link>
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

        {withdrawn && (
          <div className="fixed top-20 right-8 bg-bright-cyan text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="material-symbols-outlined text-lg">payments</span>
            <span className="font-semibold text-sm">
              Withdrawal request for ₦4,500 submitted!
            </span>
          </div>
        )}

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
                  24
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
                  ₦6,000
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
                    ₦4,500
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
                <div className="p-4 rounded-xl border border-slate-200 hover:border-bright-cyan transition-all flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-bright-cyan text-2xl">
                      campaign
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-dark-slate">
                        Marketing Flyer
                      </h4>
                      <p className="text-[11px] text-slate-400">PDF & PNG</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-bright-cyan">
                    download
                  </span>
                </div>

                <div
                  onClick={handleCopy}
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
                    content_copy
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 hover:border-bright-cyan transition-all flex items-center justify-between cursor-pointer group">
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
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
