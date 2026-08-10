'use client';

import Modal from '@/components/Modal';

type LegalType = 'privacy' | 'terms';

const LEGAL_PDFS: Record<LegalType, { src: string; title: string }> = {
  privacy: {
    src: '/legal/Roommate_NG_Privacy_Policy.pdf',
    title: 'Privacy Policy',
  },
  terms: {
    src: '/legal/Roommate_NG_Terms_and_Conditions.pdf',
    title: 'Terms of Service',
  },
};

interface LegalModalProps {
  type: LegalType;
  open: boolean;
  onClose: () => void;
}

export default function LegalModal({ type, open, onClose }: LegalModalProps) {
  const legal = LEGAL_PDFS[type];

  return (
    <Modal open={open} onClose={onClose} title={legal.title}>
      <div className="flex flex-col min-h-0 h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-display text-xl font-extrabold text-dark-slate">
            {legal.title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-grow min-h-0">
          <iframe
            src={legal.src}
            title={legal.title}
            className="w-full h-full min-h-[60vh] border-0"
          />
        </div>
      </div>
    </Modal>
  );
}