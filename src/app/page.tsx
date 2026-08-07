import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  const isThisYouCards = [
    {
      icon: 'school',
      title: 'NYSC Corpers',
      description: 'Looking for a safe, affordable place near your PPA with like-minded corpers.',
    },
    {
      icon: 'work',
      title: 'New Job Starters',
      description: 'Just landed a job in a new city and need a convenient spot without breaking the bank.',
    },
    {
      icon: 'savings',
      title: 'Beating High Rent',
      description: 'Want to live in a premium location by splitting costs with a reliable flatmate.',
    },
    {
      icon: 'group_off',
      title: 'Group Fatigue',
      description: 'Tired of unreliable group chats and want just one compatible person to share with.',
    },
  ];

  const steps = [
    {
      number: '1',
      icon: 'person_add',
      title: 'Create Profile',
      description: 'Tell us about yourself, your budget, and preferred locations.',
    },
    {
      number: '2',
      icon: 'tune',
      title: 'Review Preferences',
      description: 'Set your dealbreakers and what you value in a roommate.',
    },
    {
      number: '3',
      icon: 'mail',
      title: 'Receive Summaries',
      description: 'Get curated matches sent directly based on high compatibility.',
    },
    {
      number: '4',
      icon: 'handshake',
      title: 'Connect Directly',
      description: 'Chat with matches and decide if it’s the right fit before committing.',
    },
  ];

  const trustHighlights = [
    {
      title: 'Secure Data Handling',
      description: 'Your personal details are kept private and never shared publicly.',
    },
    {
      title: 'Curated Matching',
      description: 'Our algorithm reviews preferences and only suggests high-compatibility matches.',
    },
    {
      title: 'No Pressure',
      description: 'You review summaries anonymously and choose who you want to connect with.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-gray">
      <Navbar />

      <main className="flex-grow pb-16 md:pb-0">
        {/* 1. Hero Section */}
        <section className="px-4 md:px-16 py-12 md:py-20 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-bright-cyan/10 text-bright-cyan px-4 py-1.5 rounded-full border border-bright-cyan/20">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-display font-semibold text-xs md:text-sm">
                Nigeria&apos;s #1 Co-Living Matchmaker
              </span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-slate leading-tight tracking-tight">
              Looking for a roommate to beat high rent together?
            </h1>
            
            <p className="font-body text-base md:text-lg text-slate-muted leading-relaxed max-w-lg">
              Tell us what you&apos;re looking for, and we&apos;ll introduce you to people with similar housing preferences. You decide if they&apos;re the right fit before moving forward.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link
                href="/create-profile"
                className="w-full sm:w-auto text-center font-display font-semibold text-base bg-bright-cyan text-white px-8 py-4 rounded-full hover:bg-bright-cyan/90 transition-all shadow-[0_8px_16px_rgba(41,182,246,0.25)] hover:shadow-[0_12px_24px_rgba(41,182,246,0.35)] hover:-translate-y-1"
              >
                Create Your Profile
              </Link>
              
              <a
                href="#how-it-works"
                className="font-display font-semibold text-slate-muted hover:text-bright-cyan flex items-center gap-1 transition-colors py-2"
              >
                How It Works <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </a>
            </div>
          </div>

          <div className="relative w-full h-[380px] md:h-[480px] rounded-3xl bg-slate-100 border border-slate-200 shadow-xl flex items-center justify-center overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center w-full h-full opacity-90 transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-slate/60 via-transparent to-transparent" />

            {/* Floating Card Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/80 shadow-2xl transform translate-y-1 group-hover:translate-y-0 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-dark-slate mb-1">
                    Potential Match Found
                  </h3>
                  <p className="font-body text-xs md:text-sm text-slate-muted">
                    Lekki Phase 1 • 2 Bed / 2 Bath
                  </p>
                </div>
                <div className="bg-mint/10 text-mint px-3 py-1.5 rounded-full flex items-center gap-1 border border-mint/20">
                  <span className="material-symbols-outlined text-[16px] icon-filled">
                    verified
                  </span>
                  <span className="font-display font-bold text-xs">98% Match</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. "Is this you?" Section */}
        <section className="bg-white py-20 px-4 md:px-16 border-y border-slate-100">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-slate">
                Designed for People Moving Forward
              </h2>
              <p className="text-slate-muted font-body">
                Whether you&apos;re relocating, starting a job, or saving money, Roommate NG fits your journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {isThisYouCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-warm-gray p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 bg-bright-cyan/10 rounded-2xl flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-3xl text-bright-cyan">
                        {card.icon}
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-dark-slate mb-3">
                      {card.title}
                    </h3>
                    <p className="font-body text-sm text-slate-muted leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. "How It Works" Section */}
        <section className="py-24 px-4 md:px-16 max-w-[1280px] mx-auto" id="how-it-works">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-slate">
              How It Works
            </h2>
            <p className="font-body text-slate-muted">
              Simple 4-step process to connect with verified potential roommates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-200 z-0" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 text-center space-y-3">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-warm-gray shadow-md group hover:border-bright-cyan/30 transition-colors">
                  <span className="material-symbols-outlined text-3xl text-bright-cyan">
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-dark-slate">
                  {step.number}. {step.title}
                </h3>
                <p className="text-sm text-slate-muted px-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Trust & Transparency Section */}
        <section className="py-20 px-4 md:px-16 max-w-[1280px] mx-auto">
          <div className="bg-dark-slate rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
            <div className="flex-1 space-y-6 text-white">
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                What happens after you create your profile?
              </h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                We believe in complete transparency. Here&apos;s exactly what you can expect when you join our platform.
              </p>
            </div>

            <div className="flex-1 w-full space-y-4">
              {trustHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-bright-cyan mt-1">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Final CTA Section */}
        <section className="bg-dark-slate/95 text-white py-20 px-4 md:px-16 text-center border-t border-slate-800">
          <div className="max-w-[800px] mx-auto space-y-8">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
              Ready to find your perfect roommate?
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              Join thousands of flat-seekers splitting rent and living better.
            </p>
            <Link
              href="/create-profile"
              className="inline-block font-display font-semibold text-lg bg-bright-cyan text-white px-10 py-5 rounded-full hover:bg-bright-cyan/90 transition-all shadow-[0_8px_16px_rgba(41,182,246,0.25)] hover:shadow-[0_12px_24px_rgba(41,182,246,0.35)] hover:-translate-y-1"
            >
              Create Your Roommate Profile
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
