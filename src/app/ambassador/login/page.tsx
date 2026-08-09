'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AmbassadorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/ambassador/dashboard');
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Lifestyle Image Banner */}
      <div className="hidden md:block md:w-1/2 relative bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full opacity-80 transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white space-y-3 z-10">
          <span className="inline-block bg-bright-cyan/20 border border-bright-cyan/30 text-bright-cyan px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Ambassador Portal
          </span>
          <h2 className="font-display text-3xl font-extrabold leading-tight">
            Earn rewards by connecting room-seekers across Nigeria.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Share your unique referral link, track your earnings in real time, and help build stronger co-living communities.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form Canvas */}
      <div className="w-full md:w-1/2 flex flex-col min-h-screen bg-white">
        {/* Navigation */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center w-full">
          <Link href="/" className="font-display font-bold text-xl text-primary">
            Roommate NG
          </Link>
          <Link
            href="/"
            className="text-secondary font-bold text-sm border-b-2 border-secondary hover:text-bright-cyan hover:border-bright-cyan transition-colors"
          >
            Back to Main Site
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-extrabold text-primary mb-2">
                Ambassador Login
              </h1>
              <p className="font-body text-sm text-slate-500">
                Access your referral dashboard and track your growth.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block font-label-bold text-xs font-bold text-dark-slate mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  required
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-dark-slate focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 transition-all font-body text-sm outline-none bg-slate-50"
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label
                    className="block font-label-bold text-xs font-bold text-dark-slate"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="font-body text-xs text-bright-cyan hover:underline"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    required
                    className="w-full rounded-full border border-slate-300 px-4 py-3 text-dark-slate focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 transition-all font-body text-sm outline-none bg-slate-50"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                className="w-full mt-6 rounded-full bg-bright-cyan text-white font-display font-semibold text-base py-3.5 hover:bg-bright-cyan/90 transition-all shadow-md active:scale-[0.98]"
                type="submit"
              >
                Sign In to Dashboard
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink-0 mx-4 font-body text-xs text-slate-400">
                  New to the program?
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>
              <div className="text-center">
                <Link
                  className="font-display font-semibold text-sm text-bright-cyan hover:underline"
                  href="/ambassador/register"
                >
                  Become an Ambassador
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 py-4 px-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Secure Ambassador Portal</span>
          </div>
          <div className="flex gap-4">
            <a className="hover:text-primary underline" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary underline" href="#">
              Terms of Service
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
