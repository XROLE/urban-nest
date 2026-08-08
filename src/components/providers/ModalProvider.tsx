'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import CreateProfileModal from '@/components/modals/CreateProfileModal';

interface ModalContextValue {
  openCreateProfile: () => void;
  closeCreateProfile: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [createProfileOpen, setCreateProfileOpen] = useState(false);

  const openCreateProfile = useCallback(() => {
    setCreateProfileOpen(true);
  }, []);

  const closeCreateProfile = useCallback(() => {
    setCreateProfileOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openCreateProfile, closeCreateProfile }),
    [openCreateProfile, closeCreateProfile]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <CreateProfileModal
        open={createProfileOpen}
        onClose={closeCreateProfile}
      />
    </ModalContext.Provider>
  );
}
