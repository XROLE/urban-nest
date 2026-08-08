'use client';

import { useCallback } from 'react';
import Modal from '@/components/Modal';
import CreateProfileForm from '@/components/forms/CreateProfileForm';

interface CreateProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateProfileModal({
  open,
  onClose,
}: CreateProfileModalProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal open={open} onClose={handleClose} title="Create Profile" size="lg">
      <div className="flex items-center gap-3 shrink-0 px-5 pt-5 md:px-7 md:pt-6 pb-4 border-b border-surface-variant bg-gradient-to-b from-bright-cyan/10 to-transparent">
        <span className="w-10 h-10 rounded-xl bg-bright-cyan text-white flex items-center justify-center shrink-0 shadow-md shadow-bright-cyan/30">
          <span className="material-symbols-outlined icon-filled">person_add</span>
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-lg font-extrabold text-dark-slate leading-tight">
            Create Your Profile
          </h2>
          <p className="font-body text-xs text-slate-muted mt-0.5">
            3 quick steps to help us match you with the right roommate.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="p-2 rounded-full text-slate-muted hover:text-dark-slate hover:bg-surface-container-low transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <div className="overflow-y-auto flex-1 min-h-0 px-4 md:px-6 pb-6 md:pb-8">
        {open && <CreateProfileForm onClose={handleClose} />}
      </div>
    </Modal>
  );
}