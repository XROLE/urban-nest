import Link from 'next/link';

interface FooterProps {
  showMobileStickyCta?: boolean;
}

export default function Footer({ showMobileStickyCta = true }: FooterProps) {
  return (
    <>
      <footer className="bg-dark-slate border-t border-slate-800 px-4 md:px-16 py-12 text-slate-300 mt-auto">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-bright-cyan text-2xl icon-filled">
                home
              </span>
              <span className="font-display text-xl font-bold text-white">
                Roommate NG
              </span>
            </div>
            <p className="font-body text-sm text-slate-400 max-w-xs leading-relaxed">
              Building better co-living experiences through thoughtful, compatible roommate matching across Nigeria.
            </p>
          </div>

          <div className="md:col-span-8 flex flex-col sm:flex-row justify-end gap-8 md:gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-white font-display font-semibold text-sm uppercase tracking-wider">
                Legal
              </span>
              <Link href="#" className="font-body text-sm text-slate-400 hover:text-bright-cyan transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="font-body text-sm text-slate-400 hover:text-bright-cyan transition-colors">
                Terms of Service
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-white font-display font-semibold text-sm uppercase tracking-wider">
                Support & Portals
              </span>
              <Link href="/ambassador/login" className="font-body text-sm text-slate-400 hover:text-bright-cyan transition-colors">
                Ambassador Login
              </Link>
              <Link href="/admin/dashboard" className="font-body text-sm text-slate-400 hover:text-bright-cyan transition-colors">
                Admin Dashboard
              </Link>
              <Link href="#" className="font-body text-sm text-slate-400 hover:text-bright-cyan transition-colors">
                Safety Tips
              </Link>
            </div>
          </div>

          <div className="md:col-span-12 mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="font-body text-sm text-slate-500">
              © {new Date().getFullYear()} Roommate NG. All rights reserved. Your data is encrypted and secure.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA Bar */}
      {showMobileStickyCta && (
        <div className="bg-white/90 backdrop-blur-md shadow-[0_-4px_12px_rgba(30,41,59,0.08)] md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-center items-center border-t border-slate-200 py-3 px-4">
          <Link
            href="/create-profile"
            className="flex flex-row items-center justify-center bg-bright-cyan text-white rounded-full px-8 py-3 w-full hover:bg-bright-cyan/90 active:scale-95 transition-all shadow-md font-display font-semibold text-sm gap-2"
          >
            <span className="material-symbols-outlined text-xl">person_add</span>
            Create Profile
          </Link>
        </div>
      )}
    </>
  );
}
