'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  minimal?: boolean;
}

export default function Navbar({ minimal = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-warm-gray/80 backdrop-blur-md w-full top-0 sticky z-50 transition-all duration-300 border-b border-slate-200/50">
      <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 max-w-[1280px] mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-bright-cyan text-3xl icon-filled group-hover:scale-110 transition-transform">
            home
          </span>
          <span className="font-display text-2xl font-bold text-dark-slate">
            Roommate NG
          </span>
        </Link>

        {!minimal ? (
          <>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/#how-it-works"
                className="font-display font-semibold text-sm text-slate-muted hover:text-bright-cyan transition-colors duration-200"
              >
                How It Works
              </Link>
              <Link
                href="/ambassador/login"
                className="font-display font-semibold text-sm text-slate-muted hover:text-bright-cyan transition-colors duration-200"
              >
                Ambassador Portal
              </Link>
              {/* <Link
                href="/admin/dashboard"
                className="font-display font-semibold text-sm text-slate-muted hover:text-bright-cyan transition-colors duration-200"
              >
                Admin
              </Link> */}
              <Link
                href="/create-profile"
                className="font-display font-semibold text-sm bg-bright-cyan text-white px-6 py-3 rounded-full hover:bg-bright-cyan/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Create Profile
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden text-dark-slate p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </>
        ) : (
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-slate-muted font-display text-sm font-semibold hover:text-bright-cyan transition-colors duration-200"
            >
              Back to Home
            </Link>
          </nav>
        )}
      </div>

      {/* Mobile Drawer */}
      {!minimal && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display font-semibold text-base text-dark-slate hover:text-bright-cyan"
          >
            How It Works
          </Link>
          <Link
            href="/ambassador/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display font-semibold text-base text-dark-slate hover:text-bright-cyan"
          >
            Ambassador Portal
          </Link>
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display font-semibold text-base text-dark-slate hover:text-bright-cyan"
          >
            Admin Portal
          </Link>
          <div className="pt-2">
            <Link
              href="/create-profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center font-display font-semibold text-base bg-bright-cyan text-white px-6 py-3 rounded-full shadow-md"
            >
              Create Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
