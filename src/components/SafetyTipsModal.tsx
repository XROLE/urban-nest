'use client';

import Modal from '@/components/Modal';

interface SafetyTipsModalProps {
  open: boolean;
  onClose: () => void;
}

const sections = [
  {
    icon: 'group',
    title: 'First Meetings',
    description: 'Play it safe when you first meet someone new.',
    tips: [
      'Always meet in a public location (e.g., a cafe or mall) for your first conversation.',
      'Share your meeting details and live location with a trusted friend or relative.',
    ],
  },
  {
    icon: 'account_balance_wallet',
    title: 'Financial Protection',
    description: 'Protect yourself from scams and loss of funds.',
    tips: [
      'Roommate NG matching is 100% free upfront. You only pay our ₦2,000 service fee after a mutual match is confirmed.',
      'Never transfer rent, agency fees, or deposit money before physically inspecting the property and confirming legal ownership.',
    ],
  },
  {
    icon: 'home',
    title: 'Apartment & Co-Living Inspection',
    description: 'Verify the space before you commit.',
    tips: [
      'Inspect properties during daylight hours.',
      'Clearly discuss rent splits, utility sharing, and house rules with your prospective roommate before making financial commitments.',
    ],
  },
];

export default function SafetyTipsModal({
  open,
  onClose,
}: SafetyTipsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Safety Tips" size="md" preventDismiss>
      <div className="flex flex-col min-h-0 h-full max-h-[90vh]">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-br from-primary/5 to-transparent">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-bright-cyan/10 text-bright-cyan mb-4">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-dark-slate">
            Roommate NG Safety Guidelines
          </h2>
          <p className="font-body text-sm text-slate-500 leading-relaxed mt-2 max-w-md">
            Your safety and peace of mind are our top priorities. Follow these
            essential tips when connecting with potential roommates.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 py-6 space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex items-start gap-3.5">
                <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-bright-cyan shadow-sm">
                  <span className="material-symbols-outlined text-xl">
                    {section.icon}
                  </span>
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm text-dark-slate">
                    {section.title}
                  </h3>
                  <p className="font-body text-xs text-slate-400 mt-0.5">
                    {section.description}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2.5">
                {section.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="font-body text-sm text-slate-600 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-bright-cyan mt-2" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-bright-cyan text-white font-display font-semibold text-base py-3.5 rounded-full hover:bg-bright-cyan/90 transition-all shadow-md active:scale-[0.98]"
          >
            I Understand
          </button>
        </div>
      </div>
    </Modal>
  );
}