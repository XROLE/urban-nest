'use client';

import { useModal } from '@/components/providers/ModalProvider';

type CreateProfileButtonProps = {
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  onClick?: () => void;
};

export default function CreateProfileButton({
  children,
  className,
  showIcon = false,
  onClick,
}: CreateProfileButtonProps) {
  const { openCreateProfile } = useModal();

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        openCreateProfile();
      }}
      className={className}
    >
      {showIcon && (
        <span className="material-symbols-outlined text-lg">person_add</span>
      )}
      {children}
    </button>
  );
}
