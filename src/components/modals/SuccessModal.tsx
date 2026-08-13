'use client';

import Modal from '@/components/Modal';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  details: string | string[];
  title?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

export default function SuccessModal({
  open,
  onClose,
  details,
  title = 'Success!',
  primaryLabel = 'Back to Dashboard',
  secondaryLabel = 'Dismiss',
  onPrimary,
  onSecondary,
}: SuccessModalProps) {
  const lines = Array.isArray(details) ? details : [details];

  const handlePrimary = () => {
    onPrimary?.();
    onClose();
  };

  const handleSecondary = () => {
    onSecondary?.();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="xs" title={title}>
      <div className="w-80 aspect-square flex flex-col items-center justify-center text-center px-4 py-5">
        {/* Success Icon Container */}
        <div className="w-24 h-24 bg-[#ECFDF5] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#34D399]/20 relative shrink-0">
          {/* Confetti accents (decorative) */}
          <div
            className="absolute w-2 h-2 rounded-full bg-secondary-container -top-2 left-2 animate-ping"
            style={{ animationDuration: '3s' }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-[#34D399] top-4 -right-3 animate-ping"
            style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
          />
          <span
            className="material-symbols-outlined text-[48px] text-[#059669]"
            style={{ fontVariationSettings: `'FILL' 1` }}
          >
            check_circle
          </span>
        </div>

        {/* Text Content */}
        <h2 className="font-display text-lg font-bold text-on-surface mb-1">
          {title}
        </h2>
        <div className="font-body text-sm text-on-surface-variant mb-5 px-2 space-y-1">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={handlePrimary}
            className="w-full bg-sky-blue hover:bg-[#0284C7] text-white font-body text-sm font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm hover:shadow-md active:scale-[0.98] duration-150 flex items-center justify-center gap-2"
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={handleSecondary}
            className="w-full bg-transparent hover:bg-surface-container border border-outline-variant text-primary-container font-body text-sm font-semibold py-3 px-6 rounded-lg transition-colors active:scale-[0.98] duration-150"
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}