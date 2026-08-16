'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { BASE_URL, parseApiError } from '@/lib/api';
import { LAGOS_AREAS } from '@/lib/lagosLocations';
import Modal from '@/components/Modal';
import SuccessModal from '@/components/modals/SuccessModal';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const contactFieldClass =
  'w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-dark-slate transition-all outline-none focus:ring-2 focus:ring-bright-cyan/30 focus:border-bright-cyan';

const CONTACT_SUBJECT_TITLES: Record<string, string> = {
  account: 'Account Access',
  earnings: 'Earnings & Payouts',
  referrals: 'Referral Tracking',
  other: 'Other Inquiry',
};

type View = 'dashboard' | 'referrals' | 'earnings' | 'activity' | 'notifications' | 'settings' | 'checkings';

interface StatusCfg {
  label: string;
  icon: string;
  className: string;
}

const VERIFICATION_STATUS_CONFIG: Record<string, StatusCfg> = {
  unverified: {
    label: 'Unverified',
    icon: 'person',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  pending: {
    label: 'Pending',
    icon: 'hourglass_bottom',
    className: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  verified: {
    label: 'Verified',
    icon: 'verified',
    className: 'bg-mint/10 text-mint border-mint/20',
  },
  rejected: {
    label: 'Rejected',
    icon: 'cancel',
    className: 'bg-error/10 text-error border-error/20',
  },
};

const AMBASSADOR_RANKING_CONFIG: Record<string, StatusCfg> = {
  bronze: {
    label: 'Bronze',
    icon: 'military_tech',
    className: 'from-amber-100 to-amber-200 text-amber-900',
  },
  silver: {
    label: 'Silver',
    icon: 'military_tech',
    className: 'from-slate-100 to-slate-200 text-slate-700',
  },
  gold: {
    label: 'Gold',
    icon: 'emoji_events',
    className: 'from-yellow-100 to-yellow-200 text-yellow-800',
  },
  platinum: {
    label: 'Platinum',
    icon: 'workspace_premium',
    className: 'from-cyan-100 to-cyan-200 text-cyan-800',
  },
  diamond: {
    label: 'Diamond',
    icon: 'diamond',
    className: 'from-teal-100 to-teal-200 text-teal-800',
  },
};

type SettingsTab =
  | 'Personal Details'
  | 'Payouts & Finance'
  | 'Network & Hubs'
  | 'Settings & Security';

interface ApiReferral {
  full_name: string;
  created_at: string;
  status: string;
  preferred_locations?: string[];
  state?: string;
}

interface ReferralRow {
  name: string;
  date: string;
  status: string;
  preferredLocations: string[];
  state: string;
}

const DEFAULT_STATUS_CHIP = 'bg-slate-100 text-slate-600';
const DEFAULT_STATUS_DOT = 'bg-slate-400';

const mapReferral = (r: ApiReferral): ReferralRow => ({
  name: r.full_name,
  date: formatReferralDate(r.created_at),
  status: r.status,
  preferredLocations: r.preferred_locations ?? [],
  state: r.state ?? '',
});

function formatReferralDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface NotificationItem {
  id: number;
  icon: string;
  iconBg: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'Referrals' | 'Payments' | 'Account';
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    icon: 'group',
    iconBg: 'bg-teal-50 text-teal-700',
    title: 'New Referral: Sarah Jenkins',
    message: 'Sarah Jenkins just joined using your link.',
    time: '2 mins ago',
    read: false,
    category: 'Referrals',
  },
  {
    id: 2,
    icon: 'payments',
    iconBg: 'bg-emerald-50 text-emerald-700',
    title: 'Payment Successful',
    message: 'Your reward for Michael Okafor has been paid.',
    time: '2 hours ago',
    read: false,
    category: 'Payments',
  },
  {
    id: 3,
    icon: 'person',
    iconBg: 'bg-slate-100 text-slate-500',
    title: 'Profile Update: David Balogun',
    message: 'David Balogun completed his roommate profile.',
    time: 'Yesterday',
    read: true,
    category: 'Account',
  },
  {
    id: 4,
    icon: 'hourglass_empty',
    iconBg: 'bg-slate-100 text-slate-500',
    title: 'Payment Processing',
    message: 'Your payout of ₦5,000 is currently being processed.',
    time: '2 days ago',
    read: true,
    category: 'Payments',
  },
];

type NotificationFilter =
  | 'All'
  | 'Unread'
  | 'Referrals'
  | 'Payments';

const colorForStatus: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-600',
  'Profile Complete': 'bg-sky-50 text-sky-600',
  'Signed Up': 'bg-slate-100 text-slate-600',
  'Match Found': 'bg-slate-200 text-dark-slate',
  new: 'bg-blue-50 text-blue-600',
  matched: 'bg-slate-200 text-dark-slate',
  completed: 'bg-sky-50 text-sky-600',
};

const dotForStatus: Record<string, string> = {
  Paid: 'bg-emerald-500',
  'Profile Complete': 'bg-sky-500',
  'Signed Up': 'bg-slate-400',
  'Match Found': 'bg-dark-slate',
  new: 'bg-blue-500',
  matched: 'bg-dark-slate',
  completed: 'bg-sky-500',
};

const PAGE_SIZE = 10;

interface EarningsFeedItem {
  name: string;
  hub: string;
  time: string;
  amount: number;
  status: 'Cleared' | 'Pending';
}

const SAMPLE_EARNINGS_FEED: EarningsFeedItem[] = [
  { name: 'Chidi O.', hub: 'UNILAG Hub', time: 'Today, 10:24 AM', amount: 1000, status: 'Cleared' },
  { name: 'Aisha M.', hub: 'UI Campus', time: 'Yesterday, 2:15 PM', amount: 1000, status: 'Pending' },
  { name: 'Tunde B.', hub: 'Yaba Referral', time: 'Aug 12, 2023', amount: 1000, status: 'Cleared' },
  { name: 'Ngozi K.', hub: 'UNN Hub', time: 'Aug 10, 2023', amount: 1000, status: 'Cleared' },
];

interface PayoutRow {
  date: string;
  ref: string;
  amount: number;
}

const SAMPLE_PAYOUT_HISTORY: PayoutRow[] = [
  { date: 'Aug 10, 2023', ref: 'TRF_9823719', amount: 15000 },
  { date: 'Jul 28, 2023', ref: 'TRF_7451902', amount: 22500 },
  { date: 'Jul 15, 2023', ref: 'TRF_3391004', amount: 10000 },
  { date: 'Jun 30, 2023', ref: 'TRF_1102934', amount: 5500 },
];

interface EarningsActivityRow {
  name: string;
  hub: string;
  date: string;
  time: string;
  category: 'Matching Fee' | 'Bonus Referral';
  amount: number;
  status: 'Cleared' | 'Pending';
}

const SAMPLE_EARNINGS_ACTIVITY: EarningsActivityRow[] = [
  { name: 'Chinedu Okeke', hub: 'Yaba Tech Hub', date: '12 Oct 2023', time: '14:32 WAT', category: 'Matching Fee', amount: 15000, status: 'Cleared' },
  { name: 'Funmi Ojo', hub: 'Lekki Phase 1', date: '11 Oct 2023', time: '09:15 WAT', category: 'Matching Fee', amount: 15000, status: 'Pending' },
  { name: 'Amaka Eze', hub: 'UNILAG Campus', date: '09 Oct 2023', time: '16:45 WAT', category: 'Bonus Referral', amount: 5000, status: 'Cleared' },
  { name: 'Ibrahim Babatunde', hub: 'Ibadan Central', date: '05 Oct 2023', time: '11:20 WAT', category: 'Matching Fee', amount: 15000, status: 'Cleared' },
  { name: 'Chidi O.', hub: 'UNILAG Hub', date: '03 Oct 2023', time: '10:24 WAT', category: 'Matching Fee', amount: 15000, status: 'Cleared' },
  { name: 'Aisha M.', hub: 'UI Campus', date: '01 Oct 2023', time: '14:15 WAT', category: 'Matching Fee', amount: 15000, status: 'Pending' },
  { name: 'Tunde B.', hub: 'Yaba Referral', date: '28 Sep 2023', time: '08:05 WAT', category: 'Bonus Referral', amount: 5000, status: 'Cleared' },
  { name: 'Ngozi K.', hub: 'UNN Hub', date: '25 Sep 2023', time: '17:40 WAT', category: 'Matching Fee', amount: 15000, status: 'Cleared' },
  { name: 'Kelechi Nduka', hub: 'Ojota Hub', date: '21 Sep 2023', time: '12:10 WAT', category: 'Matching Fee', amount: 15000, status: 'Pending' },
  { name: 'Rita Ani', hub: 'Enugu Central', date: '18 Sep 2023', time: '15:55 WAT', category: 'Bonus Referral', amount: 5000, status: 'Cleared' },
];

export default function AmbassadorDashboard() {
  const router = useRouter();
  const { user, profile, logout, isAuthenticated, session } = useAuth();
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    profile?.profile_picture_url ?? null
  );
  const profileImageRef = useRef<HTMLInputElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [settingsTab, setSettingsTab] =
    useState<SettingsTab>('Personal Details');
  const [view, setView] = useState<View>(
    (profile?.verification_status ?? 'unverified').toLowerCase() === 'unverified'
      ? 'checkings'
      : 'dashboard'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(true);
  const [referralsError, setReferralsError] = useState('');
  const [paymentSummary, setPaymentSummary] = useState({
    pendingPayments: 0,
    totalEarned: 0,
    availableBalance: 0,
    successfulPayments: 0,
  });
  const [activitySearch, setActivitySearch] = useState('');
  const [activityFilter, setActivityFilter] = useState<
    'All' | 'Cleared' | 'Pending'
  >('All');
  const [activityVisibleCount, setActivityVisibleCount] = useState(5);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
  const [notificationFilter, setNotificationFilter] =
    useState<NotificationFilter>('All');
  const [checkingsContact, setCheckingsContact] = useState({
    email: user?.email ?? 'jane.doe@example.com',
    whatsapp: user?.whatsapp_number ?? '+234 *** *** **99',
  });
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editContactDraft, setEditContactDraft] = useState({
    email: user?.email ?? 'jane.doe@example.com',
    whatsapp: user?.whatsapp_number ?? '+234 *** *** **99',
  });

  const [sessionVerified, setSessionVerified] = useState<{
    email: boolean;
    whatsapp: boolean;
  }>({ email: false, whatsapp: false });
  const [verifyChannel, setVerifyChannel] = useState<'email' | 'whatsapp' | null>(
    null
  );
  const [verifying, setVerifying] = useState<'email' | 'whatsapp' | null>(null);
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [verifyReference, setVerifyReference] = useState('');
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passSubmitting, setPassSubmitting] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccessOpen, setPassSuccessOpen] = useState(false);
  const [networkSuccessOpen, setNetworkSuccessOpen] = useState(false);
  const [networkError, setNetworkError] = useState('');
  const [networkSaving, setNetworkSaving] = useState(false);
  const [vettingSuccessOpen, setVettingSuccessOpen] = useState(false);
  const [vettingSaving, setVettingSaving] = useState(false);
  const [vettingError, setVettingError] = useState('');

  const initialNetwork = () => ({
    audienceCategory:
      (Array.isArray(profile?.audience_category) && profile!.audience_category![0]) ||
      '',
    institutionOrOrganization: profile?.institution_or_organization ?? '',
    primaryOperating: profile?.primary_operating ?? '',
    secondaryOperating: profile?.secondary_operating ?? '',
  });

  const [networkDraft, setNetworkDraft] = useState(initialNetwork);
  const [savedNetwork, setSavedNetwork] = useState(initialNetwork);
  const networkSeededRef = useRef(false);

  const hasUnsavedChanges =
    JSON.stringify(networkDraft) !== JSON.stringify(savedNetwork);

  const handleNetworkFieldChange = (
    field: keyof ReturnType<typeof initialNetwork>
  ) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNetworkError('');
    setNetworkDraft((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const saveNetworkChanges = async () => {
    setNetworkError('');

    const missing: string[] = [];
    if (!networkDraft.audienceCategory.trim())
      missing.push('target community');
    if (!networkDraft.institutionOrOrganization.trim())
      missing.push('institution / organization');
    if (!networkDraft.primaryOperating.trim())
      missing.push('primary location');

    if (missing.length > 0) {
      setNetworkError(
        `Please fill in the required field${missing.length > 1 ? 's' : ''}: ${missing.join(
          ', '
        )}.`
      );
      return;
    }

    setNetworkSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/ambassadors/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          audienceCategory: [networkDraft.audienceCategory],
          institutionOrOrganization: networkDraft.institutionOrOrganization,
          primaryOperating: networkDraft.primaryOperating,
          secondaryOperating: networkDraft.secondaryOperating,
        }),
      });

      if (!res.ok) {
        setNetworkError(await parseApiError(res));
        return;
      }

      const next = { ...networkDraft };
      setSavedNetwork(next);
      setNetworkSuccessOpen(true);
    } catch {
      setNetworkError('Something went wrong. Please try again.');
    } finally {
      setNetworkSaving(false);
    }
  };

  const discardNetworkChanges = () => {
    setNetworkDraft({ ...savedNetwork });
    setNetworkError('');
  };

  const handleContactSubmit = async () => {
    setContactError('');
    if (!contactForm.subject || !contactForm.message.trim()) {
      setContactError('Please select a subject and enter a message.');
      return;
    }

    setContactLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${BASE_URL}/support`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          title: CONTACT_SUBJECT_TITLES[contactForm.subject] ?? contactForm.subject,
          message: contactForm.message,
        }),
      });

      if (!res.ok) {
        setContactError(await parseApiError(res));
        return;
      }

      setContactForm({ subject: '', message: '' });
      setContactSent(true);
    } catch {
      setContactError('Something went wrong. Please try again.');
    } finally {
      clearTimeout(timeout);
      setContactLoading(false);
    }
  };

  const initialPersonal = () => ({
    emergencyName: profile?.emergency_contact?.name ?? '',
    emergencyPhone: profile?.emergency_contact?.phone ?? '',
    emergencyRelationship: profile?.emergency_contact?.relationship ?? '',
  });

  const [personalDraft, setPersonalDraft] = useState(initialPersonal);
  const [savedPersonal, setSavedPersonal] = useState(initialPersonal);
  const personalSeededRef = useRef(false);
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalError, setPersonalError] = useState('');
  const [personalSuccessOpen, setPersonalSuccessOpen] = useState(false);

  const personalHasChanges =
    JSON.stringify(personalDraft) !== JSON.stringify(savedPersonal);

  const handlePersonalFieldChange =
    (field: keyof ReturnType<typeof initialPersonal>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPersonalError('');
      setPersonalDraft((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const savePersonalChanges = async () => {
    setPersonalError('');

    const name = personalDraft.emergencyName.trim();
    const phone = personalDraft.emergencyPhone.trim();
    const relationship = personalDraft.emergencyRelationship.trim();

    const missing: string[] = [];
    if (!name) missing.push('emergency contact name');
    if (!phone) missing.push('emergency contact phone');
    if (!relationship) missing.push('relationship');

    if (missing.length > 0) {
      setPersonalError(
        `Please fill in the required field${missing.length > 1 ? 's' : ''}: ${missing.join(
          ', '
        )}.`
      );
      return;
    }

    setPersonalSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/ambassadors/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          emergencyContact: { name, phone, relationship },
        }),
      });

      if (!res.ok) {
        setPersonalError(await parseApiError(res));
        return;
      }

      setSavedPersonal({
        emergencyName: name,
        emergencyPhone: phone,
        emergencyRelationship: relationship,
      });
      setPersonalSuccessOpen(true);
    } catch {
      setPersonalError('Something went wrong. Please try again.');
    } finally {
      setPersonalSaving(false);
    }
  };

  const discardPersonalChanges = () => {
    setPersonalDraft({ ...savedPersonal });
    setPersonalError('');
  };

  const initializeVettingInfo = () => ({
    socialMediaPlatform:
      (Array.isArray(profile?.social_media_platform) &&
        profile!.social_media_platform![0]) ||
      '',
    socialMediaHandle: (profile?.social_media_handle ?? '').trim()
      ? `@${(profile?.social_media_handle ?? '').replace(/^@/, '')}`
      : '',
    socialMediaTargetAudience: profile?.social_media_target_audience ?? '',
  });

  const [vettingDraft, setVettingDraft] = useState(initializeVettingInfo);
  const [savedVetting, setSavedVetting] = useState(initializeVettingInfo);
  const vettingSeededRef = useRef(false);

  const vettingHasChanges =
    JSON.stringify(vettingDraft) !== JSON.stringify(savedVetting);

  const vettingCompleted =
    Boolean(savedVetting.socialMediaPlatform) &&
    Boolean(savedVetting.socialMediaHandle.trim()) &&
    Boolean(savedVetting.socialMediaTargetAudience);

  const handleVettingFieldChange =
    (field: keyof ReturnType<typeof initializeVettingInfo>) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setVettingError('');
      setVettingDraft((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleVettingHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVettingError('');
    const raw = e.target.value.replace(/^@/, '').replace(/\s+/g, '');
    setVettingDraft((prev) => ({
      ...prev,
      socialMediaHandle: raw ? `@${raw}` : '',
    }));
  };

  const submitVetting = async () => {
    setVettingError('');

    const platform = vettingDraft.socialMediaPlatform.trim();
    const handle = vettingDraft.socialMediaHandle.trim();
    const audience = vettingDraft.socialMediaTargetAudience.trim();

    if (!platform) {
      setVettingError('Please select your social media platform.');
      return;
    }
    if (!handle) {
      setVettingError('Please provide your social media handle.');
      return;
    }
    if (!audience) {
      setVettingError('Please select your target audience.');
      return;
    }

    setVettingSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/ambassadors/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          socialMediaPlatform: [platform],
          socialMediaHandle: handle,
          socialMediaTargetAudience: audience,
        }),
      });

      if (!res.ok) {
        setVettingError(await parseApiError(res));
        return;
      }

      setVettingSuccessOpen(true);
      setSavedVetting({ ...vettingDraft });
    } catch {
      setVettingError('Something went wrong. Please try again.');
    } finally {
      setVettingSaving(false);
    }
  };

  const emptyBank = {
    bankCode: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  };
  const [bankDraft, setBankDraft] = useState(emptyBank);
  const [savedBank, setSavedBank] = useState(emptyBank);
  const bankSeededRef = useRef(false);
  const [banks, setBanks] = useState<{ code: string; name: string }[]>([]);
  const [bankSaving, setBankSaving] = useState(false);
  const [bankVerifying, setBankVerifying] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);
  const [bankError, setBankError] = useState('');
  const [bankSuccessOpen, setBankSuccessOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/ambassadors/banks`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        if (!res.ok) return;
        const json = await res.json();
        const list: Record<string, unknown>[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : [];
        const normalized = list
          .map((b: Record<string, unknown>) => ({
            code: String(b.bankCode ?? b.code ?? b.id ?? ''),
            name: String(b.name ?? b.bankName ?? ''),
          }))
          .filter((x): x is { code: string; name: string } => !!x.code && !!x.name);
        if (active) setBanks(normalized);
      } catch {
        // ignore fetch errors; dropdown simply stays empty
      }
    })();
    return () => {
      active = false;
    };
  }, [session?.accessToken]);

  const openBankModal = () => {
    setBankError('');
    setBankVerified(false);
    setBankDraft({
      bankCode: savedBank.bankCode,
      bankName: savedBank.bankName,
      accountNumber: savedBank.accountNumber,
      accountName: savedBank.accountName || fullName,
    });
    setBankModalOpen(true);
  };

  const handleBankFieldChange =
    (field: keyof typeof emptyBank) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setBankError('');
      setBankDraft((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleBankSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const code = e.target.value;
    const option = banks.find((b) => b.code === code);
    setBankError('');
    setBankVerified(false);
    setBankDraft((prev) => ({
      ...prev,
      bankCode: code,
      bankName: option?.name ?? '',
      accountNumber: '',
      accountName: '',
    }));
  };

  const handleAccountNumberChange = (value: string) => {
    const numeric = value.replace(/\D/g, '').slice(0, 10);
    setBankError('');
    setBankVerified(false);
    setBankDraft((prev) => ({ ...prev, accountNumber: numeric, accountName: '' }));
    if (bankDraft.bankCode && /^\d{10}$/.test(numeric)) {
      verifyBankAccount(numeric);
    }
  };

  const verifyBankAccount = async (accountNumber: string) => {
    if (!accountNumber) return;
    setBankError('');
    setBankVerified(false);
    setBankVerifying(true);
    try {
      const res = await fetch(`${BASE_URL}/ambassadors/me/bank/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          bankCode: bankDraft.bankCode,
          accountNumber,
        }),
      });

      if (!res.ok) {
        setBankError(await parseApiError(res));
        return;
      }

      const data = await res.json();
      const accountName = data?.data?.accountName as string | undefined;
      if (accountName) {
        setBankDraft((prev) => ({ ...prev, accountName }));
        setBankVerified(true);
      } else {
        setBankError('Could not resolve the account name. Try again.');
      }
    } catch {
      setBankError('Something went wrong. Please try again.');
    } finally {
      setBankVerifying(false);
    }
  };

  const saveBankChanges = async () => {
    setBankError('');

    const bankName = bankDraft.bankName.trim();
    const accountNumber = bankDraft.accountNumber.trim();
    const accountName = bankDraft.accountName.trim();

    if (!bankDraft.bankCode || !bankName) {
      setBankError('Please select a bank.');
      return;
    }
    if (!/^\d{10}$/.test(accountNumber)) {
      setBankError('Account number must be exactly 10 digits.');
      return;
    }
    if (!accountName) {
      setBankError('Account name is required.');
      return;
    }
    if (accountName.length > 100) {
      setBankError('Account name must be at most 100 characters.');
      return;
    }
    if (!bankVerified) {
      setBankError('Please verify the account first.');
      return;
    }

    setBankSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/ambassadors/me/bank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          bankCode: bankDraft.bankCode,
          bankName,
          accountNumber,
          accountName,
        }),
      });

      if (!res.ok) {
        setBankError(await parseApiError(res));
        return;
      }

      const next = {
        bankCode: bankDraft.bankCode,
        bankName,
        accountNumber,
        accountName,
      };
      setSavedBank(next);
      setBankModalOpen(false);
      setBankSuccessOpen(true);
    } catch {
      setBankError('Something went wrong. Please try again.');
    } finally {
      setBankSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    setPassSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/ambassadors/me/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        setPassError(await parseApiError(res));
        return;
      }

      setPassSuccessOpen(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPassError('Something went wrong. Please try again.');
    } finally {
      setPassSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/ambassador/login');
    } else if (user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, user?.role, router]);

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;
    let active = true;
    (async () => {
      setReferralsLoading(true);
      setReferralsError('');
      try {
        const res = await fetch(`${BASE_URL}/ambassadors/me/referrals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await parseApiError(res));
        const json = (await res.json()) as {
          data?: { referrals?: ApiReferral[] };
        };
        const list = json?.data?.referrals ?? [];
        if (active) setReferrals(list.map(mapReferral));
      } catch (e) {
        if (active)
          setReferralsError(
            e instanceof Error
              ? e.message
              : 'Failed to load referrals. Please try again.'
          );
      } finally {
        if (active) setReferralsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [session?.accessToken]);

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/payments/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await parseApiError(res));
        const json = (await res.json()) as {
          data?: {
            pendingPayments?: number;
            totalEarned?: number;
            availableBalance?: number;
            successfulPayments?: number;
          };
        };
        if (!active) return;
        setPaymentSummary({
          pendingPayments: json?.data?.pendingPayments ?? 0,
          totalEarned: json?.data?.totalEarned ?? 0,
          availableBalance: json?.data?.availableBalance ?? 0,
          successfulPayments: json?.data?.successfulPayments ?? 0,
        });
      } catch {
        if (!active) return;
        setPaymentSummary({
          pendingPayments: 0,
          totalEarned: 0,
          availableBalance: 0,
          successfulPayments: 0,
        });
      }
    })();
    return () => {
      active = false;
    };
  }, [session?.accessToken]);

  useEffect(() => {
    if (profile && !networkSeededRef.current) {
      const seeded = {
        audienceCategory:
          (Array.isArray(profile.audience_category) &&
            profile.audience_category![0]) ||
          '',
        institutionOrOrganization: profile.institution_or_organization ?? '',
        primaryOperating: profile.primary_operating ?? '',
        secondaryOperating: profile.secondary_operating ?? '',
      };
      networkSeededRef.current = true;
      setNetworkDraft(seeded);
      setSavedNetwork(seeded);
    }
  }, [profile]);

  useEffect(() => {
    if (profile && !vettingSeededRef.current) {
      const seeded = {
        socialMediaPlatform:
          (Array.isArray(profile.social_media_platform) &&
            profile.social_media_platform[0]) ||
          '',
        socialMediaHandle: (profile.social_media_handle ?? '').trim()
          ? `@${(profile.social_media_handle ?? '').replace(/^@/, '')}`
          : '',
        socialMediaTargetAudience: profile.social_media_target_audience ?? '',
      };
      vettingSeededRef.current = true;
      setVettingDraft(seeded);
      setSavedVetting(seeded);
    }
  }, [profile]);

  useEffect(() => {
    if (profile && !personalSeededRef.current) {
      const seeded = {
        emergencyName: profile.emergency_contact?.name ?? '',
        emergencyPhone: profile.emergency_contact?.phone ?? '',
        emergencyRelationship: profile.emergency_contact?.relationship ?? '',
      };
      personalSeededRef.current = true;
      setPersonalDraft(seeded);
      setSavedPersonal(seeded);
    }
  }, [profile]);

  useEffect(() => {
    if (profile && !bankSeededRef.current) {
      const seeded = {
        bankCode: profile.bank_code ?? '',
        bankName: profile.bank_name ?? '',
        accountNumber: profile.account_number ?? '',
        accountName: profile.account_name ?? '',
      };
      bankSeededRef.current = true;
      setBankDraft(seeded);
      setSavedBank(seeded);
    }
  }, [profile]);

  const fullName = user?.full_name || 'Ambassador';
  const firstName = fullName.trim().split(/\s+/)[0] || 'Ambassador';

  const verificationStatus =
    (profile?.verification_status ?? 'unverified').toLowerCase();
  const status =
    VERIFICATION_STATUS_CONFIG[verificationStatus] ??
    VERIFICATION_STATUS_CONFIG.unverified;
  const isUnverified = verificationStatus === 'unverified';

  const emailVerified =
    Boolean(profile?.email_verified ?? user?.email_verified) || sessionVerified.email;
  const whatsappVerified =
    Boolean(profile?.whatsapp_verified ?? user?.whatsapp_verified) ||
    sessionVerified.whatsapp;
  const contactVerified = emailVerified && whatsappVerified;

  const ranking = (profile?.ambassador_ranking ?? 'bronze').toLowerCase();
  const rankingCfg =
    AMBASSADOR_RANKING_CONFIG[ranking] ?? AMBASSADOR_RANKING_CONFIG.bronze;

  const referralCode = profile?.referral_code || 'SN00';
  const referralLink = `https://urban-nest-tawny.vercel.app?ref=${referralCode}`;

  const whatsappCaption = `Hey! Are you (or someone you know)—whether a Corper, student, young professional, or relocating to Lagos—currently searching for a roommate or looking to split rent in a great location around Lagos? 🏠

Check out Roommate NG. You just share your budget, target area, and living habits, and we connect you with compatible, like-minded roommates.

No upfront fees are required until you are paired with a roommate 🚀

Fill out the short form here to get started:
👉 https://urban-nest-tawny.vercel.app?ref=${referralCode}`;

  const totalReferrals = profile?.total_referrals ?? 24;
  const totalEarnings = profile?.total_earnings_ngn ?? 6000;
  const pendingBalance = profile?.pending_balance_ngn ?? 4500;

  const maskAccountNumber = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.length <= 6) return clean || '0123456789';
    return `${clean.slice(0, 3)}****${clean.slice(-3)}`;
  };

  const downloadPayoutCsv = () => {
    const header = 'Date,Ref ID,Amount (NGN)';
    const rows = SAMPLE_PAYOUT_HISTORY.map(
      (r) => `${r.date},${r.ref},${r.amount.toFixed(2)}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payout-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReferralsPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;

    const BRAND_NAVY: [number, number, number] = [9, 20, 38];
    const BRAND_CYAN: [number, number, number] = [41, 182, 246];
    const DARK_SLATE: [number, number, number] = [30, 41, 59];
    const MUTED_SLATE: [number, number, number] = [100, 116, 139];
    const LIGHT_CYAN: [number, number, number] = [224, 247, 255];

    // Brand header bar (dark navy) with Roommate NG + Urban Nest parent mark
    doc.setFillColor(...BRAND_NAVY);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('ROOMMATE NG', margin, 19);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('A product of Urban Nest', pageWidth - margin, 19, {
      align: 'right',
    });

    // Title + subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...DARK_SLATE);
    doc.text('Referrals Report', margin, 48);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...MUTED_SLATE);
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}  |  ${filteredReferrals.length} referral${
        filteredReferrals.length === 1 ? '' : 's'
      }`,
      margin,
      55
    );

    // Prepared-for box personalized with ambassador name + referral code
    doc.setFillColor(...LIGHT_CYAN);
    doc.roundedRect(margin, 60, pageWidth - margin * 2, 28, 4, 4, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED_SLATE);
    doc.text('Prepared for:', 22, 72);
    doc.text('Referral Code:', 22, 81);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK_SLATE);
    doc.text(
      fullName,
      22 + doc.getTextWidth('Prepared for:') + 6,
      72
    );
    doc.text(
      referralCode,
      22 + doc.getTextWidth('Referral Code:') + 6,
      81
    );

    autoTable(doc, {
      startY: 94,
      head: [['Name', 'Date Referred', 'State', 'Preferred Locations', 'Status']],
      body: filteredReferrals.map((r) => [
        r.name,
        r.date,
        r.state || '—',
        r.preferredLocations.length > 0
          ? r.preferredLocations.join(', ')
          : '—',
        r.status,
      ]),
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        textColor: DARK_SLATE,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: BRAND_CYAN,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
      },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      margin: { left: 10, right: 10 },
    });

    // Footer with parent-company attribution
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...BRAND_CYAN);
    doc.text('Roommate NG  ·  A product of Urban Nest', pageWidth / 2, pageHeight - 10, {
      align: 'center',
    });

    doc.save('referrals-report.pdf');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(whatsappCaption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2500);
  };

  const openProfileModal = () => {
    setProfilePreview(profileImage);
    setSelectedProfileFile(null);
    setProfileError('');
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setProfilePreview(null);
    setSelectedProfileFile(null);
    setProfileError('');
  };

  const handleProfileFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setProfileError('');
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileError('Image must be at most 2MB.');
        return;
      }
      setSelectedProfileFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file) {
      setProfileError('Please select a valid image file.');
    }
    e.target.value = '';
  };

  const saveProfilePicture = async () => {
    if (!selectedProfileFile) {
      setProfileError('Please select an image to upload.');
      return;
    }
    setProfileError('');
    setProfileSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedProfileFile);

      const res = await fetch(`${BASE_URL}/ambassadors/me/picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        setProfileError(await parseApiError(res));
        return;
      }

      const data = (await res.json()) as {
        data?: { profile_picture_url?: string };
      };
      const url = data?.data?.profile_picture_url;
      if (url) setProfileImage(url);
      closeProfileModal();
    } catch {
      setProfileError('Something went wrong. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleWithdraw = () => {
    setWithdrawn(true);
    setTimeout(() => setWithdrawn(false), 3000);
  };

  const openEditContact = () => {
    setEditContactDraft(checkingsContact);
    setEditContactOpen(true);
  };

  const closeEditContact = () => {
    setEditContactOpen(false);
  };

  const saveEditContact = () => {
    setCheckingsContact(editContactDraft);
    setEditContactOpen(false);
  };

  const channelTarget = (channel: 'email' | 'whatsapp') =>
    channel === 'email'
      ? user?.email ?? checkingsContact.email
      : user?.whatsapp_number ?? checkingsContact.whatsapp;

  const sendVerification = async (channel: 'email' | 'whatsapp') => {
    setVerifyError('');
    setVerifySuccess('');
    setVerifying(channel);
    try {
      const res = await fetch(`${BASE_URL}/verification/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ channel, to: channelTarget(channel) }),
      });

      if (!res.ok) {
        setVerifyError(await parseApiError(res));
        return;
      }

      const data = (await res.json()) as {
        data?: { reference?: string; token?: string; id?: string; verificationId?: string };
      };
      const ref =
        data?.data?.reference ||
        data?.data?.token ||
        data?.data?.id ||
        data?.data?.verificationId ||
        '';
      setVerifyReference(ref);
      setVerifyChannel(channel);
      setOtp(['', '', '', '']);
      setCooldown(59);
    } catch {
      setVerifyError('Something went wrong. Please try again.');
    } finally {
      setVerifying(null);
    }
  };

  const confirmVerification = async () => {
    if (verifyChannel === null) return;
    const code = otp.join('');
    if (code.length !== 4) {
      setVerifyError('Please enter the 4-digit code.');
      return;
    }
    setVerifyError('');
    setVerifySubmitting(true);
    try {
      const body: {
        channel: 'email' | 'whatsapp';
        to: string;
        code: string;
        reference?: string;
      } = {
        channel: verifyChannel,
        to: channelTarget(verifyChannel),
        code,
      };
      if (verifyReference) body.reference = verifyReference;

      const res = await fetch(`${BASE_URL}/verification/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setVerifyError(await parseApiError(res));
        return;
      }

      if (verifyChannel === 'email')
        setSessionVerified((prev) => ({ ...prev, email: true }));
      else setSessionVerified((prev) => ({ ...prev, whatsapp: true }));

      setVerifySuccess(
        `Your ${verifyChannel === 'email' ? 'email address' : 'WhatsApp number'} has been verified successfully.`
      );
      setTimeout(() => {
        setVerifyChannel(null);
        setVerifySuccess('');
        setOtp(['', '', '', '']);
        setCooldown(0);
        setVerifyReference('');
      }, 1500);
    } catch {
      setVerifyError('Something went wrong. Please try again.');
    } finally {
      setVerifySubmitting(false);
    }
  };

  const resendCode = async () => {
    if (verifyChannel === null || cooldown > 0) return;
    setVerifyError('');
    setVerifySuccess('');
    setOtp(['', '', '', '']);
    await sendVerification(verifyChannel);
  };

  const closeVerifyModal = () => {
    setVerifyChannel(null);
    setOtp(['', '', '', '']);
    setCooldown(0);
    setVerifyReference('');
    setVerifyError('');
    setVerifySuccess('');
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) otpInputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleLogout = () => {
    logout();
    router.push('/ambassador/login');
  };

  const confirmLogout = () => {
    setLogoutModalOpen(false);
    handleLogout();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const referralStatusOptions = [
    'All',
    ...Array.from(new Set(referrals.map((r) => r.status))),
  ];

  const filteredReferrals = referrals.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredNotifications = notifications.filter((n) => {
    if (notificationFilter === 'Referrals') return n.category === 'Referrals';
    if (notificationFilter === 'Payments') return n.category === 'Payments';
    if (notificationFilter === 'Unread') return !n.read;
    return true;
  });

  const filteredActivity = SAMPLE_EARNINGS_ACTIVITY.filter((row) => {
    const q = activitySearch.toLowerCase();
    const matchesSearch =
      row.name.toLowerCase().includes(q) || row.hub.toLowerCase().includes(q);
    const matchesFilter =
      activityFilter === 'All' || row.status === activityFilter;
    return matchesSearch && matchesFilter;
  });
  const visibleActivity = filteredActivity.slice(0, activityVisibleCount);

  const totalPages = Math.max(1, Math.ceil(filteredReferrals.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageRows = filteredReferrals.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const applyView = (next: View) => {
    const locked =
      isUnverified &&
      (next === 'dashboard' ||
        next === 'referrals' ||
        next === 'earnings' ||
        next === 'activity' ||
        next === 'settings');
    const target = locked ? 'checkings' : next;
    setView(target);
    setSearchQuery('');
    setStatusFilter('All');
    setCurrentPage(1);
    setActivitySearch('');
    setActivityFilter('All');
    setActivityVisibleCount(5);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 z-30 transition-all duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden text-primary focus:outline-none p-2 rounded-full hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          {view === 'referrals' ? (
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full px-4 py-2 w-full max-w-xs focus-within:border-bright-cyan focus-within:ring-2 focus-within:ring-bright-cyan/20 transition-all hidden sm:flex">
              <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search referrals..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent outline-none text-sm text-dark-slate placeholder:text-slate-400 w-full"
              />
            </div>
          ) : view === 'settings' ? (
            <h2 className="font-display text-xl font-bold text-primary hidden md:block">
              Profile &amp; Settings
            </h2>
          ) : view === 'earnings' ? (
            <h2 className="font-display text-xl font-bold text-primary hidden md:block">
              Earnings &amp; Payouts
            </h2>
          ) : view === 'activity' ? (
            <h2 className="font-display text-xl font-bold text-primary hidden md:block">
              All Earnings Activity
            </h2>
        ) : (
            <h2 className="font-display text-xl font-bold text-primary hidden md:block">
              Ambassador Dashboard
            </h2>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="font-body text-sm font-semibold text-dark-slate hidden sm:inline">
            Hi, {firstName} 👋
          </span>
          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setNotificationsOpen((o) => !o)}
              className="relative text-slate-500 hover:text-bright-cyan transition-colors p-2 rounded-full hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-xl">
                {notificationsOpen ? 'notifications_active' : 'notifications'}
              </span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-bright-cyan border-2 border-white" />
              )}
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-display font-bold text-sm text-dark-slate">
                      Notifications
                    </h3>
                    <button
                      onClick={markAllRead}
                      className="font-body text-xs font-semibold text-bright-cyan hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-5 py-4 flex gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.iconBg}`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {n.icon}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p
                            className={`font-body text-sm ${
                              n.read
                                ? 'text-slate-500'
                                : 'text-dark-slate font-semibold'
                            }`}
                          >
                            {n.message}
                          </p>
                          <span className="font-body text-xs text-slate-400 mt-0.5">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      applyView('notifications');
                    }}
                    className="w-full py-3 font-body text-sm font-semibold text-bright-cyan hover:bg-slate-50 transition-colors border-t border-slate-100"
                  >
                    See all notifications
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <button
              aria-label="Help"
              onClick={() => setHelpOpen((o) => !o)}
              className="text-slate-500 hover:text-bright-cyan transition-colors p-2 rounded-full hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-xl">
                {helpOpen ? 'help' : 'help_outline'}
              </span>
            </button>

            {helpOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setHelpOpen(false)}
                />
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-5">
                    <h3 className="font-display font-bold text-sm text-dark-slate mb-3">
                      Need assistance?
                    </h3>
                    <button
                      onClick={() => {
                        setHelpOpen(false);
                        setContactSent(false);
                        setContactOpen(true);
                      }}
                      className="w-full bg-primary text-white font-body text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">
                        support_agent
                      </span>
                      Contact Support
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            aria-label="Open Settings"
            onClick={() => applyView('settings')}
            className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer hover:border-bright-cyan hover:ring-2 hover:ring-bright-cyan/30 transition-all"
          >
            <Image
              src={profileImage || '/default-avatar.svg'}
              alt="Profile avatar"
              width={36}
              height={36}
              unoptimized
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* SideNavBar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-primary text-white z-40 transition-transform duration-300 ${
          mobileSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="py-6 px-4 flex flex-col h-full">
          {/* Brand Area */}
          <div className="px-4 py-4 mb-6">
            <Link
              href="/ambassador/dashboard"
              className="font-display text-2xl font-extrabold text-white tracking-tight block"
            >
              Roommate NG
            </Link>
            <span className="font-body text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Ambassador Portal
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1">
            <button
              onClick={() => applyView('dashboard')}
              disabled={isUnverified}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg ${
                view === 'dashboard'
                  ? 'text-bright-cyan bg-slate-800/80 border-r-4 border-bright-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } ${isUnverified ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span
                className={`material-symbols-outlined ${
                  view === 'dashboard' ? 'icon-filled' : ''
                }`}
              >
                dashboard
              </span>
              <span className="font-body text-sm">Dashboard</span>
              {isUnverified && (
                <span className="material-symbols-outlined text-[8px] text-slate-400 ml-auto">
                  lock
                </span>
              )}
            </button>
            <button
              onClick={() => applyView('referrals')}
              disabled={isUnverified}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg ${
                view === 'referrals'
                  ? 'text-bright-cyan bg-slate-800/80 border-r-4 border-bright-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } ${isUnverified ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span
                className={`material-symbols-outlined ${
                  view === 'referrals' ? 'icon-filled' : ''
                }`}
              >
                group
              </span>
              <span className="font-body text-sm">Referrals</span>
              {isUnverified && (
                <span className="material-symbols-outlined text-[8px] text-slate-400 ml-auto">
                  lock
                </span>
              )}
            </button>
            <button
              onClick={() => applyView('earnings')}
              disabled={isUnverified}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg ${
                view === 'earnings' || view === 'activity'
                  ? 'text-bright-cyan bg-slate-800/80 border-r-4 border-bright-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } ${isUnverified ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span
                className={`material-symbols-outlined ${
                  view === 'earnings' || view === 'activity' ? 'icon-filled' : ''
                }`}
              >
                payments
              </span>
              <span className="font-body text-sm">Earnings</span>
              {isUnverified && (
                <span className="material-symbols-outlined text-[8px] text-slate-400 ml-auto">
                  lock
                </span>
              )}
            </button>
            <button
              onClick={() => applyView('settings')}
              disabled={isUnverified}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg ${
                view === 'settings'
                  ? 'text-bright-cyan bg-slate-800/80 border-r-4 border-bright-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } ${isUnverified ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span
                className={`material-symbols-outlined ${
                  view === 'settings' ? 'icon-filled' : ''
                }`}
              >
                settings
              </span>
              <span className="font-body text-sm">Settings</span>
              {isUnverified && (
                <span className="material-symbols-outlined text-[8px] text-slate-400 ml-auto">
                  lock
                </span>
              )}
            </button>
            <button
              onClick={() => applyView('checkings')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg ${
                view === 'checkings'
                  ? 'text-bright-cyan bg-slate-800/80 border-r-4 border-bright-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  view === 'checkings' ? 'icon-filled' : ''
                }`}
              >
                fact_check
              </span>
              <span className="font-body text-sm">Approval Status</span>
            </button>
          </nav>

          {/* CTA & Logout */}
          <div className="mt-auto border-t border-slate-800 pt-4 space-y-2">
            <button
              onClick={handleCopy}
              disabled={isUnverified}
              className="w-full bg-bright-cyan text-white font-display font-semibold py-2.5 rounded-xl hover:bg-bright-cyan/90 transition-all flex justify-center items-center gap-2 text-sm shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-bright-cyan"
            >
              <span className="material-symbols-outlined text-[8px]">
                {isUnverified ? 'lock' : 'content_copy'}
              </span>
              Copy Invite Link
            </button>

            <button
              onClick={() => setLogoutModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 pt-24 min-h-screen px-4 md:px-8 pb-16 max-w-[1280px]">
        {/* Toast Alert */}
        {copied && (
          <div className="fixed top-20 right-8 bg-mint text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="material-symbols-outlined text-lg">
              check_circle
            </span>
            <span className="font-semibold text-sm">
              Referral link copied to clipboard!
            </span>
          </div>
        )}

        {captionCopied && (
          <div className="fixed top-20 right-8 bg-mint text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="material-symbols-outlined text-lg">
              check_circle
            </span>
            <span className="font-semibold text-sm">
              WhatsApp caption copied to clipboard!
            </span>
          </div>
        )}

        {withdrawn && (
          <div className="fixed top-20 right-8 bg-bright-cyan text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="material-symbols-outlined text-lg">payments</span>
            <span className="font-semibold text-sm">
              Withdrawal request for ₦{pendingBalance.toLocaleString()} submitted!
            </span>
          </div>
        )}

        {view === 'dashboard' ? (
          <>
            {/* Header Section */}
            <div className="mb-5">
              <h1 className="font-display text-xl md:text-2xl font-extrabold text-dark-slate mb-1">
                Dashboard Overview
              </h1>
              <p className="font-body text-xs text-slate-500">
                Track your referrals, earnings, and access marketing resources.
              </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column: Referral Card & Tables */}
          <div className="lg:col-span-2 space-y-5">
            {/* Referral Sharing Card */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="flex-1 z-10 w-full space-y-2">
                <h3 className="font-display font-bold text-base text-dark-slate">
                  Your referral code is ready!
                </h3>
                <p className="font-body text-xs text-slate-500">
                  Share this code with friends looking for roommates or apartments in Nigeria.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 items-stretch pt-1">
                  <div className="flex-grow flex items-center bg-slate-100 rounded-full border border-slate-200 px-4 py-2">
                    <span className="font-display font-bold text-sm text-dark-slate tracking-wider">
                      {referralCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="bg-bright-cyan text-white font-display font-semibold px-5 py-2 rounded-full hover:bg-bright-cyan/90 transition-all flex items-center justify-center gap-1.5 shadow-sm text-xs"
                  >
                    <span className="material-symbols-outlined text-sm">
                      content_copy
                    </span>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <p className="font-body text-[11px] text-slate-400">
                  {referralLink}
                </p>
              </div>
            </section>

            {/* Overview Metrics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1.5 min-h-[120px]">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-bright-cyan text-xl">
                    group
                  </span>
                  <span className="bg-mint/10 text-mint text-[10px] font-bold px-2 py-0.5 rounded-full">
                    +12%
                  </span>
                </div>
                <h4 className="font-body text-[11px] text-slate-500 font-semibold uppercase">
                  Total Referrals
                </h4>
                <p className="font-display text-2xl font-extrabold text-dark-slate">
                  {totalReferrals}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1.5 min-h-[120px]">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-bright-cyan text-xl">
                    task_alt
                  </span>
                </div>
                <h4 className="font-body text-[11px] text-slate-500 font-semibold uppercase">
                  Successful Payments
                </h4>
                <p className="font-display text-2xl font-extrabold text-dark-slate">
                  {paymentSummary.successfulPayments}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1.5 min-h-[120px]">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-bright-cyan text-xl">
                    account_balance_wallet
                  </span>
                </div>
                <h4 className="font-body text-[11px] text-slate-500 font-semibold uppercase">
                  Total Earnings
                </h4>
                <p className="font-display text-2xl font-extrabold text-dark-slate">
                  ₦{totalEarnings.toLocaleString()}
                </p>
              </div>

              <div className="bg-dark-slate text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-1.5 min-h-[120px]">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-bright-cyan text-xl">
                    payments
                  </span>
                </div>
                <h4 className="font-body text-[11px] text-slate-400 font-semibold uppercase">
                  Available for Withdrawal
                </h4>
                <div className="flex justify-between items-end pt-0.5">
                  <p className="font-display text-2xl font-extrabold text-bright-cyan">
                    ₦{paymentSummary.availableBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <button
                    onClick={handleWithdraw}
                    className="bg-bright-cyan text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-bright-cyan/90 transition-colors"
                  >
                    Request
                  </button>
                </div>
              </div>
            </section>

            {/* Recent Referrals Table */}
            <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display font-bold text-base text-dark-slate">
                  Recent Referrals
                </h3>
                <button
                  onClick={() => applyView('referrals')}
                  className="text-bright-cyan text-xs font-bold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Date Joined</th>
                      <th className="py-2 px-3">State</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-body divide-y divide-slate-100">
                    {referralsLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-slate-400"
                        >
                          Loading referrals...
                        </td>
                      </tr>
                    ) : referralsError ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-red-500"
                        >
                          {referralsError}
                        </td>
                      </tr>
                    ) : referrals.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-slate-400"
                        >
                          No referrals yet.
                        </td>
                      </tr>
                    ) : (
                      referrals.slice(0, 4).map((r) => (
                        <tr key={r.name}>
                          <td className="py-2.5 px-3 font-semibold text-dark-slate">
                            {r.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {r.date}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {r.state || '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                colorForStatus[r.status] ?? DEFAULT_STATUS_CHIP
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Resources Panel */}
          <div className="lg:col-span-1 space-y-5">
            <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-display font-bold text-base text-dark-slate flex items-center gap-2">
                <span className="material-symbols-outlined text-bright-cyan text-xl">
                  auto_awesome
                </span>
                Ambassador Resources
              </h3>
              <p className="font-body text-xs text-slate-500">
                Marketing materials to help you share and convert.
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href="/marketing-flyer.png"
                  download="Roommate-NG-Marketing-Flyer.png"
                  className="p-3 rounded-xl border border-slate-200 hover:border-bright-cyan transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-bright-cyan text-xl">
                      campaign
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-dark-slate">
                        Marketing Flyer
                      </h4>
                      <p className="text-[11px] text-slate-400">PNG</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-bright-cyan">
                    download
                  </span>
                </a>

                <div
                  onClick={handleCopyCaption}
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500 text-xl">
                      chat
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-dark-slate">
                        WhatsApp Caption
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Ready-to-use text
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-500">
                    {captionCopied ? 'check' : 'content_copy'}
                  </span>
                </div>

                <a
                  href="/social_media_asset.png"
                  download="Roommate-NG-Social-Media-Asset.png"
                  className="p-3 rounded-xl border border-slate-200 hover:border-bright-cyan transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-bright-cyan text-xl">
                      image
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-dark-slate">
                        Social Media Assets
                      </h4>
                      <p className="text-[11px] text-slate-400">IG & Twitter</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-bright-cyan">
                    download
                  </span>
                </a>
              </div>
            </section>
          </div>
          </div>
          </>
        ) : view === 'referrals' ? (
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-dark-slate">
                All Referrals
              </h1>
              <p className="font-body text-sm text-slate-500">
                Track everyone referred through your unique code.
              </p>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="w-full sm:hidden flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent outline-none text-sm text-dark-slate placeholder:text-slate-400 w-full"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Status:
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(
                        e.target.value as string
                      );
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-bright-cyan"
                  >
                    {referralStatusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Date:
                  </span>
                  <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-bright-cyan">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>

              <button
                onClick={downloadReferralsPdf}
                className="hidden sm:flex items-center gap-2 border border-slate-300 text-dark-slate font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  download
                </span>
                Export
              </button>
            </div>

            {/* Referrals Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Date Referred</th>
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">Preferred Locations</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-body divide-y divide-slate-100">
                    {pageRows.map((r) => {
                      const initials = r.name
                        .split(' ')
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();
                      return (
                        <tr
                          key={r.name}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 text-primary flex items-center justify-center font-bold text-xs">
                                {initials}
                              </div>
                              <span className="font-semibold text-dark-slate">
                                {r.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{r.date}</td>
                          <td className="py-3 px-4 text-slate-500">
                            {r.state || '—'}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {r.preferredLocations.length > 0
                              ? r.preferredLocations.join(', ')
                              : '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                colorForStatus[r.status] ?? DEFAULT_STATUS_CHIP
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full mr-1.5 ${
                                  dotForStatus[r.status] ?? DEFAULT_STATUS_DOT
                                }`}
                              />
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {referralsLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-slate-400"
                        >
                          Loading referrals...
                        </td>
                      </tr>
                    ) : referralsError ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-red-500"
                        >
                          {referralsError}
                        </td>
                      </tr>
                    ) : pageRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-slate-400"
                        >
                          No referrals match your filters.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-xs text-slate-500">
                  {filteredReferrals.length === 0
                    ? '0 referrals'
                    : `Showing ${
                        (page - 1) * PAGE_SIZE + 1
                      }-${Math.min(
                        page * PAGE_SIZE,
                        filteredReferrals.length
                      )} of ${filteredReferrals.length} referrals`}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setCurrentPage(page - 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setCurrentPage(page + 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : view === 'earnings' ? (
          <div className="flex flex-col gap-5">
            {/* Page Header */}
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-primary mb-1">
                Transactions
              </h3>
              <p className="font-body text-sm text-slate-500">
                Manage your commissions and request transfers to your local
                bank.
              </p>
            </div>

            {/* Top Grid: Hero & Bank Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Money Hero */}
              <div className="lg:col-span-2 bg-dark-slate rounded-xl p-5 md:p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-mint/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
                <div>
                  <p className="font-body text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Available for Payout
                  </p>
                  <p className="font-display text-3xl md:text-4xl font-extrabold text-mint tracking-tight">
                    ₦{paymentSummary.availableBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-6 gap-5 z-10">
                  <div className="flex gap-7">
                    <div>
                      <p className="font-body text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Pending Earnings
                      </p>
                      <p className="font-body text-base text-white font-semibold">
                        ₦{paymentSummary.pendingPayments.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Lifetime Commissions
                      </p>
                      <p className="font-body text-base text-white font-semibold">
                        ₦{paymentSummary.totalEarned.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleWithdraw}
                    className="bg-mint text-white font-body text-sm font-semibold py-2.5 px-5 rounded-lg hover:brightness-110 transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-base">
                      account_balance_wallet
                    </span>
                    Request Payout
                  </button>
                </div>
              </div>

              {/* Payout Bank Account Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-bright-cyan/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-bright-cyan text-[20px]">
                        account_balance
                      </span>
                    </div>
                    <div>
                      <h4 className="font-body text-sm font-semibold text-dark-slate">
                        {savedBank.bankName || 'No bank added'}
                      </h4>
                      {savedBank.bankCode && (
                        <p className="font-body text-xs font-bold text-mint flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            verified
                          </span>
                          Verified
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={openBankModal}
                    aria-label="Edit bank account"
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                  </button>
                </div>
                <div className="mt-auto">
                  <p className="font-body text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Account Number
                  </p>
                  <p className="font-body text-base text-dark-slate font-bold tracking-widest font-mono mb-3">
                    {maskAccountNumber(savedBank.accountNumber)}
                  </p>
                  <p className="font-body text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Account Name
                  </p>
                  <p className="font-body text-sm text-dark-slate font-semibold">
                    {savedBank.accountName || 'Your Account Name'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Grid: Feed & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-1 border-b border-slate-200 pb-3.5">
                  <h4 className="font-display text-base font-bold text-dark-slate">
                    Recent Activity
                  </h4>
                  <button
                    onClick={() => applyView('activity')}
                    className="font-body text-xs font-bold text-bright-cyan hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="flex flex-col">
                  {SAMPLE_EARNINGS_FEED.map((item) => {
                    const cleared = item.status === 'Cleared';
                    return (
                      <div
                        key={`${item.name}-${item.time}`}
                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center ${
                              cleared
                                ? 'bg-mint/10 text-mint'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {cleared ? 'person_add' : 'hourglass_empty'}
                            </span>
                          </div>
                          <div>
                            <p className="font-body text-sm font-semibold text-dark-slate">
                              {item.name}{' '}
                              <span className="text-slate-500 font-normal">
                                - {item.hub}
                              </span>
                            </p>
                            <p className="font-body text-xs text-slate-400 mt-0.5">
                              {item.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-body text-sm font-bold ${
                              cleared ? 'text-mint' : 'text-amber-600'
                            }`}
                          >
                            +₦{item.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 uppercase tracking-wider ${
                              cleared
                                ? 'bg-mint/10 text-mint'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payout History */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-1 border-b border-slate-200 pb-3.5">
                  <h4 className="font-display text-base font-bold text-dark-slate">
                    Payout History
                  </h4>
                  <button
                    onClick={downloadPayoutCsv}
                    className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 font-body text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      download
                    </span>
                    CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-2.5 border-b border-slate-200">Date</th>
                        <th className="pb-2.5 border-b border-slate-200">
                          Ref ID
                        </th>
                        <th className="pb-2.5 border-b border-slate-200 text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-body text-sm">
                      {SAMPLE_PAYOUT_HISTORY.map((row) => (
                        <tr
                          key={row.ref}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 border-b border-slate-100 text-slate-500">
                            {row.date}
                          </td>
                          <td className="py-3 border-b border-slate-100 text-dark-slate font-mono">
                            {row.ref}
                          </td>
                          <td className="py-3 border-b border-slate-100 text-dark-slate font-bold text-right">
                            ₦{row.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : view === 'activity' ? (
          <div className="flex flex-col gap-5">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="inline-flex items-center space-x-1 font-body text-xs text-slate-500">
                <li className="inline-flex items-center">
                  <button
                    onClick={() => applyView('dashboard')}
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-sm mx-1">
                      chevron_right
                    </span>
                    <button
                      onClick={() => applyView('earnings')}
                      className="hover:text-primary transition-colors"
                    >
                      Earnings
                    </button>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-sm mx-1">
                      chevron_right
                    </span>
                    <span className="text-primary font-bold">All Activity</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Page Header & Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <h1 className="font-display text-xl md:text-2xl font-extrabold text-dark-slate">
                All Earnings Activity
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or hub..."
                    value={activitySearch}
                    onChange={(e) => {
                      setActivitySearch(e.target.value);
                      setActivityVisibleCount(5);
                    }}
                    className="bg-white border border-slate-200 text-dark-slate font-body text-sm rounded-lg focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan outline-none block w-full pl-10 pr-3 py-2.5 transition-all"
                  />
                </div>
                {/* Filter Chips */}
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                  {(['All', 'Cleared', 'Pending'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActivityFilter(f);
                        setActivityVisibleCount(5);
                      }}
                      className={`px-4 py-2 rounded-full font-body text-xs font-semibold whitespace-nowrap transition-colors ${
                        activityFilter === f
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {f === 'All' ? 'All Activity' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body text-sm">
                  <thead>
                    <tr className="text-slate-500 bg-slate-50 text-[11px] font-bold uppercase border-b border-slate-200">
                      <th className="px-5 py-3" scope="col">
                        User
                      </th>
                      <th className="px-5 py-3" scope="col">
                        Date / Time
                      </th>
                      <th className="px-5 py-3" scope="col">
                        Category
                      </th>
                      <th className="px-5 py-3 text-right" scope="col">
                        Amount
                      </th>
                      <th className="px-5 py-3 text-center" scope="col">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleActivity.map((row) => {
                      const initials = row.name
                        .split(' ')
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();
                      const cleared = row.status === 'Cleared';
                      return (
                        <tr
                          key={`${row.name}-${row.date}`}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-200 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="font-semibold text-dark-slate text-sm">
                                  {row.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {row.hub}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="text-dark-slate">{row.date}</div>
                            <div className="text-[11px] text-slate-400">
                              {row.time}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {row.category}
                          </td>
                          <td className="px-5 py-3.5 text-right font-bold text-dark-slate">
                            +₦{row.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                cleared
                                  ? 'bg-mint/10 text-mint'
                                  : 'bg-amber-50 text-amber-600'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {visibleActivity.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-slate-400"
                        >
                          No activity matches your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Load More */}
            <div className="flex flex-col items-center gap-2">
              {activityVisibleCount < filteredActivity.length && (
                <button
                  onClick={() => setActivityVisibleCount((c) => c + 5)}
                  className="px-6 py-2.5 rounded-lg border border-primary text-primary font-body text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Load More Activity
                </button>
              )}
              <span className="font-body text-[11px] text-slate-400">
                Showing {visibleActivity.length} of {filteredActivity.length}{' '}
                activities
              </span>
            </div>
          </div>
        ) : view === 'settings' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <input
                ref={profileImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileFileSelect}
              />
              {/* Hero Identity Card */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm lg:sticky lg:top-24">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">
                    <div className="relative shrink-0">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-bright-cyan/20">
                        <Image
                          src={profileImage || '/default-avatar.svg'}
                          alt="Profile avatar"
                          width={160}
                          height={160}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        aria-label="Change profile photo"
                        onClick={openProfileModal}
                        className="absolute bottom-0 right-0 bg-bright-cyan text-white p-2 rounded-full shadow-md hover:brightness-110 transition-all active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
                      <h2 className="font-display text-base font-bold text-dark-slate mb-1 break-words">
                        {fullName}
                      </h2>
                      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border mb-2 ${status.className}`}>
                        <span
                          className="material-symbols-outlined text-[14px]"
                          style={{ fontVariationSettings: `'FILL' 1` }}
                        >
                          {status.icon}
                        </span>
                        <span className="font-body text-[11px] font-bold uppercase tracking-wider">
                          {status.label}
                        </span>
                      </div>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-tr ${rankingCfg.className} shadow-sm`}>
                        <span className="material-symbols-outlined text-[13px] mr-1">
                          {rankingCfg.icon}
                        </span>
                        <span className="font-body text-[9px] font-bold uppercase tracking-wider">
                          {rankingCfg.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full pt-4 mt-4 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50">
                        <span className="text-[9px] font-body text-slate-500 uppercase tracking-wider mb-0.5">
                          Member Since
                        </span>
                        <span className="font-body text-xs text-dark-slate">
                          Oct 2023
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50">
                        <span className="text-[9px] font-body text-slate-500 uppercase tracking-wider mb-0.5">
                          Total Matches
                        </span>
                        <span className="font-body text-xs text-dark-slate">
                          142
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-3 text-primary">
                      <span className="material-symbols-outlined text-[15px]">
                        location_on
                      </span>
                      <span className="font-body text-xs">
                        Lagos, Nigeria
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-slate-200 mb-2 gap-5">
                  <button
                    type="button"
                    onClick={() => setSettingsTab('Personal Details')}
                    className={`font-body text-sm pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                      settingsTab === 'Personal Details'
                        ? 'text-primary border-bright-cyan'
                        : 'text-slate-500 border-transparent hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      person
                    </span>
                    Personal Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab('Payouts & Finance')}
                    className={`font-body text-sm pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                      settingsTab === 'Payouts & Finance'
                        ? 'text-primary border-bright-cyan'
                        : 'text-slate-500 border-transparent hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      account_balance_wallet
                    </span>
                    Payouts &amp; Finance
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab('Network & Hubs')}
                    className={`font-body text-sm pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                      settingsTab === 'Network & Hubs'
                        ? 'text-primary border-bright-cyan'
                        : 'text-slate-500 border-transparent hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      hub
                    </span>
                    Network &amp; Hubs
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab('Settings & Security')}
                    className={`font-body text-sm pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                      settingsTab === 'Settings & Security'
                        ? 'text-primary border-bright-cyan'
                        : 'text-slate-500 border-transparent hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      security
                    </span>
                    Settings &amp; Security
                  </button>
                </div>

                {/* Content Panel */}
                {settingsTab === 'Personal Details' ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="mb-5 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-display text-base font-bold text-dark-slate mb-1">
                        Personal Details
                      </h3>
                      <p className="font-body text-sm text-slate-500">
                        Manage your personal information and how we can reach
                        you.
                      </p>
                    </div>
                  </div>

                  <form className="space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 pr-10 font-body text-sm text-slate-500 cursor-not-allowed transition-all"
                          type="text"
                          value={fullName}
                          readOnly
                        />
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                          lock
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 pr-10 font-body text-sm text-slate-500 cursor-not-allowed transition-all"
                            type="email"
                            value={user?.email || 'bella.onyekachi@example.com'}
                            readOnly
                          />
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                            lock
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          WhatsApp Number
                        </label>
                        <div className="relative">
                          <input
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 pr-10 font-body text-sm text-slate-500 cursor-not-allowed transition-all"
                            type="tel"
                            value={user?.whatsapp_number || '+234 800 000 0000'}
                            readOnly
                          />
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                            lock
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Gender
                        </label>
                        <div className="relative">
                          <input
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 pr-10 font-body text-sm text-slate-500 cursor-not-allowed transition-all"
                            type="text"
                            value="Female"
                            readOnly
                          />
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                            lock
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Emergency Contact Name
                        </label>
                        <input
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all"
                          type="text"
                          placeholder="Full name"
                          value={personalDraft.emergencyName}
                          onChange={handlePersonalFieldChange('emergencyName')}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Emergency Contact Phone
                        </label>
                        <input
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all"
                          type="tel"
                          placeholder="+234 ..."
                          value={personalDraft.emergencyPhone}
                          onChange={handlePersonalFieldChange('emergencyPhone')}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Relationship
                        </label>
                        <input
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all"
                          type="text"
                          placeholder="e.g. Mother, Brother, Spouse"
                          value={personalDraft.emergencyRelationship}
                          onChange={handlePersonalFieldChange('emergencyRelationship')}
                        />
                      </div>
                    </div>

                    {personalError && (
                      <p className="font-body text-sm text-error flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {personalError}
                      </p>
                    )}
                  </form>
                </div>
                ) : settingsTab === 'Network & Hubs' ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="mb-5">
                    <h3 className="font-display text-base font-bold text-dark-slate mb-1">
                      Network Influence
                    </h3>
                    <p className="font-body text-sm text-slate-500">
                      Define your primary audience and geographic hubs to help
                      us match you with relevant campaigns.
                    </p>
                  </div>

                  <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Target Audience Category
                        </label>
                        <div className="relative">
                          <select
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all appearance-none cursor-pointer pr-10"
                            value={networkDraft.audienceCategory}
                            onChange={handleNetworkFieldChange('audienceCategory')}
                            required
                          >
                            <option value="">Select a category</option>
                            <option>NYSC</option>
                            <option>Students</option>
                            <option>Young Professionals</option>
                            <option>Expatriates</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            arrow_drop_down
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Institution / Organization
                        </label>
                        <input
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all"
                          type="text"
                          value={networkDraft.institutionOrOrganization}
                          onChange={handleNetworkFieldChange('institutionOrOrganization')}
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-200 my-5" />

                    <h4 className="font-body text-xs font-bold text-dark-slate uppercase tracking-wider mb-3">
                      Location Hubs
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Primary Operational Hub
                        </label>
                        <div className="relative">
                          <select
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all appearance-none cursor-pointer pr-10"
                            value={networkDraft.primaryOperating}
                            onChange={handleNetworkFieldChange('primaryOperating')}
                            required
                          >
                            <option value="">Select a location</option>
                            {LAGOS_AREAS.map((area) => (
                              <option key={area} value={area}>
                                {area}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            arrow_drop_down
                          </span>
                        </div>
                        <p className="font-body text-xs text-slate-400 mt-1">
                          Your main area of influence.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Secondary Operational Hub
                        </label>
                        <div className="relative">
                          <select
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all appearance-none cursor-pointer pr-10"
                            value={networkDraft.secondaryOperating}
                            onChange={handleNetworkFieldChange('secondaryOperating')}
                          >
                            <option value="">None</option>
                            {LAGOS_AREAS.map((area) => (
                              <option key={area} value={area}>
                                {area}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                        <p className="font-body text-xs text-slate-400 mt-1">
                          Optional secondary area.
                        </p>
                      </div>
                    </div>

                    {networkError && (
                      <p className="font-body text-sm text-error flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {networkError}
                      </p>
                    )}
                  </form>
                </div>
) : settingsTab === 'Settings & Security' ? (
                <div className="space-y-6">
                  {/* Change Password */}
                  <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-dark-slate">
                        <span className="material-symbols-outlined text-[20px]">
                          password
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-dark-slate">
                          Change Password
                        </h3>
                        <p className="font-body text-sm text-slate-500 mt-0.5">
                          Ensure your account is using a long, random password
                          to stay secure.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-2xl">
                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all pr-10"
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showCurrentPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all pr-10"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showNewPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all pr-10"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {passError && (
                        <p className="font-body text-sm text-error flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">error</span>
                          {passError}
                        </p>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={passSubmitting}
                          className="bg-bright-cyan text-white px-6 py-3 rounded-xl font-body text-sm hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {passSubmitting ? 'Updating…' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </section>

                  {/* Danger Zone */}
                  <section className="bg-white border border-error/30 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-error/10 pb-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center text-error">
                        <span className="material-symbols-outlined text-[20px]">
                          warning
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-error">
                          Danger Zone
                        </h3>
                        <p className="font-body text-sm text-slate-500 mt-0.5">
                          Irreversible actions concerning your ambassador
                          account.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-body text-sm font-bold text-dark-slate mb-1">
                          Delete Account
                        </h4>
                        <p className="font-body text-sm text-slate-500">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="border border-error text-error px-6 py-2.5 rounded-xl font-body text-sm hover:bg-error hover:text-white transition-all active:scale-95 whitespace-nowrap"
                      >
                        Delete Account
                      </button>
                    </div>
                  </section>
                </div>
                ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Available Balance */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-body text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Available Balance
                          </p>
                          <h3 className="font-display text-2xl font-extrabold text-dark-slate mt-1">
                            ₦{paymentSummary.availableBalance.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </h3>
                        </div>
                        <span className="material-symbols-outlined text-bright-cyan">
                          account_balance_wallet
                        </span>
                      </div>
                      <button
                        type="button"
                        className="w-full bg-bright-cyan text-white font-body text-sm py-2.5 rounded-lg hover:brightness-110 transition-all shadow-sm"
                      >
                        Request Withdrawal
                      </button>
                    </div>

                    {/* Primary Bank Account */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
                      <button
                        type="button"
                        onClick={openBankModal}
                        className="absolute top-4 right-4 text-slate-500 hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-secondary">
                          account_balance
                        </span>
                        <h3 className="font-body text-xs font-bold text-dark-slate uppercase tracking-wider">
                          Primary Bank Account
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-body text-sm text-slate-500">
                            Bank Name
                          </span>
                          <span className="font-body text-sm font-bold text-dark-slate">
                            {savedBank.bankName || 'Access Bank'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-body text-sm text-slate-500">
                            Account Number
                          </span>
                          <span className="font-body text-sm font-bold text-dark-slate">
                            {savedBank.accountNumber || '0123456789'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-body text-sm text-slate-500">
                            Account Name
                          </span>
                          <span className="font-body text-sm font-bold text-dark-slate">
                            {savedBank.accountName || 'Your Account Name'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Payouts */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-200">
                      <h3 className="font-display text-base font-bold text-dark-slate">
                        Recent Payouts
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                          <tr className="font-body text-xs text-slate-500 uppercase tracking-wider">
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Reference ID</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            {
                              date: 'Oct 24, 2023',
                              ref: 'PAY-8829-X1',
                              amount: '₦ 45,000.00',
                            },
                            {
                              date: 'Oct 18, 2023',
                              ref: 'PAY-7712-B4',
                              amount: '₦ 120,000.00',
                            },
                            {
                              date: 'Oct 10, 2023',
                              ref: 'PAY-6601-M9',
                              amount: '₦ 35,500.00',
                            },
                            {
                              date: 'Oct 02, 2023',
                              ref: 'PAY-5590-L2',
                              amount: '₦ 88,000.00',
                            },
                          ].map((row) => (
                            <tr
                              key={row.ref}
                              className="hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-5 py-3 font-body text-sm">
                                {row.date}
                              </td>
                              <td className="px-5 py-3 font-body text-sm font-mono">
                                {row.ref}
                              </td>
                              <td className="px-5 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-mint/10 text-mint uppercase">
                                  Successful
                                </span>
                              </td>
                              <td className="px-5 py-3 font-body text-sm font-bold text-dark-slate text-right">
                                {row.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                )}

                {/* Sticky Action Bar */}
                {personalHasChanges &&
                  settingsTab === 'Personal Details' && (
                <div className="sticky bottom-6 mt-8 flex items-center justify-between gap-4 px-5 py-3 z-20 rounded-xl bg-primary-container text-white shadow-lg">
                  <span className="font-body text-sm">
                    Unsaved changes detected
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={discardPersonalChanges}
                      className="font-body text-sm text-on-primary-container opacity-80 hover:brightness-110 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={savePersonalChanges}
                      disabled={personalSaving}
                      className="bg-bright-cyan text-white px-4 py-2 rounded-lg font-body text-sm hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-60"
                    >
                      {personalSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
                )}

                {hasUnsavedChanges &&
                  settingsTab === 'Network & Hubs' && (
                <div className="sticky bottom-6 mt-8 flex items-center justify-between gap-4 px-5 py-3 z-20 rounded-xl bg-primary-container text-white shadow-lg">
                  <span className="font-body text-sm">
                    Unsaved changes detected
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={discardNetworkChanges}
                      className="font-body text-sm text-on-primary-container opacity-80 hover:brightness-110 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={saveNetworkChanges}
                      disabled={networkSaving}
                      className="bg-bright-cyan text-white px-4 py-2 rounded-lg font-body text-sm hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-60"
                    >
                      {networkSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        ) : view === 'checkings' ? (
          <div className="flex flex-col gap-4">
            {/* Hero Section */}
            <section className="bg-surface-container-lowest border border-slate-200 rounded-[16px] p-5 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-fixed rounded-full blur-[100px] opacity-30 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="font-display text-2xl text-primary font-bold mb-1">
                  Complete your setup to start earning! 🚀
                </h2>
                <p className="font-body text-sm text-on-surface-variant max-w-2xl">
                  Verify your contact details and provide your social info to
                  submit your application for review.
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="relative z-10 pt-1">
                <div className="flex items-center justify-between w-full relative">
                  <div className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 -z-10" />
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-2 relative bg-surface-container-lowest px-4">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: `'FILL' 1` }}
                      >
                        check
                      </span>
                    </div>
                    <span className="font-body text-xs font-semibold text-primary">
                      Account Created
                    </span>
                  </div>
                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-2 relative bg-surface-container-lowest px-4">
                    {contactVerified ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: `'FILL' 1` }}
                          >
                            check
                          </span>
                        </div>
                        <span className="font-body text-xs font-semibold text-primary">
                          Verification
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-300 text-amber-600 flex items-center justify-center">
                          <div className="absolute -inset-1 border border-amber-300 rounded-full opacity-20 animate-ping" />
                          <span className="font-body text-xs font-bold">2</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-body text-xs font-semibold text-amber-600">
                            Verification
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-2 relative bg-surface-container-lowest px-4">
                    {vettingCompleted ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: `'FILL' 1` }}
                          >
                            check
                          </span>
                        </div>
                        <span className="font-body text-xs font-semibold text-primary">
                          Vetting Details
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center">
                          <span className="font-body text-xs font-bold">3</span>
                        </div>
                        <span className="font-body text-xs font-semibold text-on-surface-variant">
                          Vetting Details
                        </span>
                      </>
                    )}
                  </div>
                  {/* Step 4 */}
                  <div className="flex flex-col items-center gap-2 relative px-4">
                    <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">
                        lock
                      </span>
                    </div>
                    <span className="font-body text-xs font-semibold text-on-surface-variant">
                      Final Approval
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Main Action Column */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                {/* Verification Card */}
                <div className="bg-surface-container-lowest border border-slate-200 rounded-[16px] p-4 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)]">
                  {!contactVerified && (
                    <div className="mb-3 flex items-center gap-2 text-error opacity-80">
                      <span className="material-symbols-outlined text-[16px]">
                        info
                      </span>
                      <p className="text-xs font-medium">
                        Note: Verified contact details cannot be changed once
                        submitted.
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                    <span className="material-symbols-outlined text-sky-600 text-[24px]">
                      verified_user
                    </span>
                    <h3 className="font-display text-lg font-semibold text-primary">
                      Identity Verification
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Email Row */}
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-slate-200 hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined">mail</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <h4 className="font-body text-sm font-semibold text-primary mb-1">
                            Verify Email Address
                          </h4>
                          <p className="font-body text-sm text-on-surface-variant">
                            {checkingsContact.email}
                          </p>
                          {!emailVerified && (
                            <button
                              aria-label="Edit Email"
                              onClick={openEditContact}
                              className="ml-2 text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                edit
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                      {emailVerified ? (
                        <span className="flex items-center gap-1 text-mint font-body text-xs font-semibold px-4 py-2">
                          <span className="material-symbols-outlined text-[16px]">
                            verified
                          </span>
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => sendVerification('email')}
                          disabled={verifying === 'email'}
                          className="text-white px-4 py-2 rounded-lg font-body text-xs font-semibold bg-sky-blue hover:bg-sky-blue/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                          {verifying === 'email' && (
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          )}
                          {verifying === 'email' ? 'Sending...' : 'Verify Now'}
                        </button>
                      )}
                    </div>
                    {/* WhatsApp Row */}
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-slate-200 hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined">chat</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <h4 className="font-body text-sm font-semibold text-primary mb-1">
                            Verify WhatsApp Number
                          </h4>
                          <p className="font-body text-sm text-on-surface-variant">
                            {checkingsContact.whatsapp}
                          </p>
                          {!whatsappVerified && (
                            <button
                              aria-label="Edit WhatsApp Number"
                              onClick={openEditContact}
                              className="ml-2 text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                edit
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                      {whatsappVerified ? (
                        <span className="flex items-center gap-1 text-mint font-body text-xs font-semibold px-4 py-2">
                          <span className="material-symbols-outlined text-[16px]">
                            verified
                          </span>
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => sendVerification('whatsapp')}
                          disabled={verifying === 'whatsapp'}
                          className="text-white px-4 py-2 rounded-lg font-body text-xs font-semibold bg-sky-blue hover:bg-sky-blue/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                          {verifying === 'whatsapp' && (
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          )}
                          {verifying === 'whatsapp' ? 'Sending...' : 'Verify Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vetting Info Form */}
                <div className="bg-surface-container-lowest border border-slate-200 rounded-[16px] p-4 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden">
                  {!contactVerified && (
                    <div className="absolute inset-0 bg-surface/50 backdrop-blur-[2px] z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-surface-container-lowest border border-slate-200 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#D97706]">
                          warning
                        </span>
                        <span className="font-body text-xs font-semibold text-primary">
                          Complete verification steps above to unlock
                        </span>
                      </div>
                    </div>
                  )}
                  <div className={contactVerified ? '' : 'opacity-50 pointer-events-none'}>
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                      <span className="material-symbols-outlined text-sky-600 text-[24px]">
                        assignment_ind
                      </span>
                      <h3 className="font-display text-lg font-semibold text-primary">
                        Vetting Information
                      </h3>
                    </div>
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        submitVetting();
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-body text-xs font-semibold text-on-surface-variant">
                            Social Media Platform
                          </label>
                          <select
                            className="w-full bg-background border border-slate-200 rounded-[12px] px-4 py-2.5 text-on-surface-variant font-body text-sm focus:border-sky-blue focus:ring-1 focus:ring-sky-blue outline-none disabled:bg-surface-variant"
                            value={vettingDraft.socialMediaPlatform}
                            onChange={handleVettingFieldChange('socialMediaPlatform')}
                            required
                          >
                            <option value="">Select Platform</option>
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="twitter">X (Twitter)</option>
                            <option value="facebook">Facebook</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="snapchat">Snapchat</option>
                            <option value="youtube">YouTube</option>
                            <option value="telegram">Telegram</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-body text-xs font-semibold text-on-surface-variant">
                            Social Handle
                          </label>
                          <input
                            className="w-full bg-background border border-slate-200 rounded-[12px] px-4 py-2.5 text-on-surface-variant font-body text-sm focus:border-sky-blue focus:ring-1 focus:ring-sky-blue outline-none disabled:bg-surface-variant"
                            placeholder="@username"
                            type="text"
                            value={vettingDraft.socialMediaHandle}
                            onChange={handleVettingHandleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-body text-xs font-semibold text-on-surface-variant">
                          Target Audience
                        </label>
                        <select
                          className="w-full bg-background border border-slate-200 rounded-[12px] px-4 py-2.5 text-on-surface-variant font-body text-sm focus:border-sky-blue focus:ring-1 focus:ring-sky-blue outline-none disabled:bg-surface-variant"
                          value={vettingDraft.socialMediaTargetAudience}
                          onChange={handleVettingFieldChange('socialMediaTargetAudience')}
                          required
                        >
                          <option value="">Select Audience Type</option>
                          <option>NYSC</option>
                          <option>Students</option>
                          <option>Young Professionals</option>
                          <option>Expatriates</option>
                          <option>All Audiences</option>
                        </select>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-1">
                        {vettingError && (
                          <p className="text-xs font-medium text-error" role="alert">
                            {vettingError}
                          </p>
                        )}
                        <p className="text-xs text-on-surface-variant md:text-right">
                          {contactVerified
                            ? 'Your contact details are verified. Add your social info and submit.'
                            : 'Complete email and WhatsApp verification to submit your application.'}
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={!contactVerified || vettingSaving || !vettingHasChanges}
                        className={`mt-2 px-5 py-2.5 rounded-[12px] font-body text-xs font-semibold w-full md:w-auto md:self-end ${
                          contactVerified
                            ? 'bg-sky-blue text-white hover:bg-sky-blue/90 transition-colors disabled:opacity-60'
                            : 'bg-surface-variant text-on-surface-variant'
                        }`}
                      >
                        {vettingSaving ? 'Saving…' : 'Continue'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Gated Features Column */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div className="bg-surface-container-lowest border border-slate-200 rounded-[16px] p-4 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] h-full relative overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      Your Dashboard
                    </h3>
                    <span className="material-symbols-outlined text-outline">
                      lock
                    </span>
                  </div>
                  <div className="relative flex-grow rounded-lg overflow-hidden border border-slate-200/50">
                    {/* Simulated blurred content */}
                    <div className="absolute inset-0 bg-background blur-sm opacity-60">
                      <div className="p-3 grid gap-3">
                        <div className="h-16 bg-surface-variant rounded-lg" />
                        <div className="h-28 bg-surface-variant rounded-lg" />
                        <div className="h-16 bg-surface-variant rounded-lg" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-surface/20">
                      <div className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center text-secondary-fixed-dim mb-3 shadow-lg">
                        <span className="material-symbols-outlined text-[28px]">
                          query_stats
                        </span>
                      </div>
                      <h4 className="font-display text-lg font-semibold text-primary mb-1">
                        Metrics Locked
                      </h4>
                      <p className="font-body text-sm text-primary-container max-w-[200px] font-medium">
                        Complete verification to view your performance and
                        earnings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-extrabold text-dark-slate">
                  Notifications
                </h1>
                <p className="font-body text-sm text-slate-500">
                  Stay updated on your referrals, payments, and account
                  activity.
                </p>
              </div>
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-2 font-body text-sm font-semibold text-bright-cyan hover:underline"
              >
                <span className="material-symbols-outlined text-lg">
                  done_all
                </span>
                Mark all as read
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
              {(
                ['All', 'Unread', 'Referrals', 'Payments'] as NotificationFilter[]
              ).map((filter) => {
                const tabCount =
                  filter === 'Unread'
                    ? notifications.filter((n) => !n.read).length
                    : filter === 'Referrals'
                      ? notifications.filter((n) => n.category === 'Referrals')
                          .length
                      : filter === 'Payments'
                        ? notifications.filter((n) => n.category === 'Payments')
                            .length
                        : notifications.length;
                const active = notificationFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setNotificationFilter(filter)}
                    className={`relative pb-3 px-4 font-body text-sm font-semibold transition-colors ${
                      active ? 'text-bright-cyan' : 'text-slate-500 hover:text-dark-slate'
                    }`}
                  >
                    {filter}
                    {filter === 'Unread' && tabCount > 0 && (
                      <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-bold bg-bright-cyan text-white align-middle">
                        {tabCount}
                      </span>
                    )}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bright-cyan" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Notification List */}
            <div className="space-y-3">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-5 py-4 rounded-2xl border border-slate-100 shadow-sm transition-colors ${
                    n.read ? 'hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                      n.read ? n.iconBg : 'bg-bright-cyan/10 text-bright-cyan'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {n.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className={`font-body text-sm ${
                          n.read ? 'text-slate-600' : 'font-semibold text-dark-slate'
                        }`}
                      >
                        {n.title}
                      </h3>
                      <span className="font-body text-xs text-slate-400 flex-shrink-0 shrink-0">
                        {n.time}
                      </span>
                    </div>
                    <p className="font-body text-sm text-slate-500 mt-0.5">
                      {n.message}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-bright-cyan flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-2">
              <button className="font-body text-sm font-semibold text-bright-cyan border-2 border-bright-cyan rounded-full px-6 py-2.5 hover:bg-bright-cyan hover:text-white transition-colors">
                Load More
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Log out"
        size="md"
        preventDismiss
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
              <span className="material-symbols-outlined text-3xl">logout</span>
            </span>
            <h3 className="font-display text-xl font-extrabold text-dark-slate mb-2">
              Log out of your account?
            </h3>
            <p className="font-body text-sm text-slate-500 max-w-sm">
              Are you sure you want to log out? You&apos;ll need to sign in again to
              access your dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => setLogoutModalOpen(false)}
              className="flex-1 py-3 rounded-full font-display font-semibold text-sm border border-slate-300 text-dark-slate hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmLogout}
              className="flex-1 py-3 rounded-full font-display font-semibold text-sm bg-red-600/90 text-white hover:bg-red-600/80 transition-colors shadow-md active:scale-[0.98]"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>

      {/* Contact Support Modal */}
      <Modal
        open={contactOpen}
        onClose={() => {
          setContactOpen(false);
          setContactSent(false);
          setContactForm({ subject: '', message: '' });
          setContactError('');
        }}
        title="Contact Support"
        size="md"
      >
        {contactSent ? (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-4">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </span>
            <h3 className="font-display text-xl font-extrabold text-dark-slate">
              Message Sent!
            </h3>
            <p className="font-body text-sm text-slate-500 max-w-sm mt-2">
              Thanks for reaching out. Our team will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={() => {
                setContactOpen(false);
                setContactSent(false);
                setContactForm({ subject: '', message: '' });
                setContactError('');
              }}
              className="mt-8 w-full sm:w-auto px-8 py-3 rounded-full bg-bright-cyan text-white font-display font-semibold text-sm hover:bg-bright-cyan/90 transition-all shadow-md active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-bright-cyan/10 text-bright-cyan flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-dark-slate">
                    Contact Support
                  </h3>
                  <p className="font-body text-sm text-slate-500 mt-0.5">
                    Our team is here to help you. Send us a message and
                    we&apos;ll get back to you shortly.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-bold text-dark-slate uppercase tracking-wide"
                >
                  Subject
                </label>
                <div className="relative">
                  <select
                    id="contact-subject"
                    className={`${contactFieldClass} appearance-none pr-10 cursor-pointer`}
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, subject: e.target.value })
                    }
                  >
                    <option disabled value="">
                      Select an issue...
                    </option>
                    <option value="account">Account Access</option>
                    <option value="earnings">Earnings &amp; Payouts</option>
                    <option value="referrals">Referral Tracking</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-bold text-dark-slate uppercase tracking-wide"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="How can we help?"
                  className={`${contactFieldClass} resize-none`}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
              {contactError && (
                <p className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-body text-sm">
                  {contactError}
                </p>
              )}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setContactOpen(false);
                    setContactSent(false);
                    setContactForm({ subject: '', message: '' });
                    setContactError('');
                  }}
                  className="px-6 py-3 rounded-full font-display font-semibold text-sm border border-slate-300 text-dark-slate hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleContactSubmit}
                  disabled={contactLoading}
                  className="px-6 py-3 rounded-full flex items-center gap-2 bg-bright-cyan text-white font-display font-semibold text-sm hover:bg-bright-cyan/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {contactLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <span className="material-symbols-outlined text-lg">send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Edit Bank Account Modal */}
      <Modal
        open={bankModalOpen}
        onClose={() => setBankModalOpen(false)}
        title="Edit Bank Account"
        size="md"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-dark-slate flex items-center gap-2">
            <span className="material-symbols-outlined text-bright-cyan">
              account_balance
            </span>
            Edit Bank Account
          </h2>
          <button
            type="button"
            onClick={() => setBankModalOpen(false)}
            className="text-slate-500 hover:text-dark-slate rounded-full p-1 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form className="space-y-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="bank_name"
                className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide"
              >
                Bank Name
              </label>
              <div className="relative">
                <select
                  id="bank_name"
                  value={bankDraft.bankCode}
                  onChange={handleBankSelectChange}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all appearance-none cursor-pointer pr-10"
                >
                  <option disabled value="">
                    Select a bank
                  </option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="account_number"
                className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide"
              >
                Account Number
              </label>
              <input
                id="account_number"
                type="text"
                inputMode="numeric"
                maxLength={10}
                readOnly={!bankDraft.bankCode}
                value={bankDraft.accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                placeholder={bankDraft.bankCode ? 'Enter 10-digit account number' : 'Select a bank first'}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm font-mono text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              />
              {bankVerifying && (
                <p className="font-body text-xs text-bright-cyan flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] animate-spin">
                    progress_activity
                  </span>
                  Verifying account…
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="account_name"
                className="font-body text-xs font-bold text-dark-slate uppercase tracking-wide flex justify-between"
              >
                Account Name
              </label>
              <input
                id="account_name"
                type="text"
                maxLength={100}
                readOnly
                value={bankDraft.accountName}
                onChange={handleBankFieldChange('accountName')}
                placeholder="Account name appears after verification"
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 font-body text-sm text-dark-slate focus:outline-none focus:border-bright-cyan focus:ring-1 focus:ring-bright-cyan transition-all bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="font-body text-xs text-slate-400">
                Filled in automatically after your account is verified.
              </p>
            </div>

            {bankError && (
              <p className="font-body text-sm text-error flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {bankError}
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setBankModalOpen(false)}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-dark-slate font-body text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveBankChanges}
            disabled={!bankVerified || bankSaving}
            className="px-5 py-2.5 rounded-lg bg-bright-cyan text-white font-body text-sm hover:brightness-110 transition-all shadow-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {bankSaving ? 'Saving…' : 'Continue'}
          </button>
        </div>
      </Modal>

      {/* Edit Contact Details Modal */}
      {editContactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            aria-hidden="true"
            onClick={closeEditContact}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm z-40"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit Contact Details"
            className="relative z-50 w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden transform transition-all shadow-[0px_10px_15px_-3px_rgba(13,34,64,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/50">
              <h2 className="font-display text-xl text-on-surface">
                Edit Contact Details
              </h2>
              <button
                type="button"
                aria-label="Close modal"
                onClick={closeEditContact}
                className="text-on-surface-variant hover:text-on-surface transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Email Input Group */}
              <div className="space-y-2">
                <label
                  htmlFor="edit-email"
                  className="block font-body text-xs font-semibold text-on-surface-variant"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-[20px]">
                      mail
                    </span>
                  </div>
                  <input
                    id="edit-email"
                    type="email"
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors font-body text-sm text-on-surface placeholder:text-outline outline-none"
                    value={editContactDraft.email}
                    onChange={(e) =>
                      setEditContactDraft({
                        ...editContactDraft,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* WhatsApp Input Group */}
              <div className="space-y-2">
                <label
                  htmlFor="edit-whatsapp"
                  className="block font-body text-xs font-semibold text-on-surface-variant"
                >
                  WhatsApp Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-[20px]">
                      phone
                    </span>
                  </div>
                  <input
                    id="edit-whatsapp"
                    type="tel"
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors font-body text-sm text-on-surface placeholder:text-outline outline-none"
                    value={editContactDraft.whatsapp}
                    onChange={(e) =>
                      setEditContactDraft({
                        ...editContactDraft,
                        whatsapp: e.target.value,
                      })
                    }
                    placeholder="Enter your WhatsApp number"
                  />
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="px-6 py-4 bg-surface-container-low flex justify-end gap-2 border-t border-outline-variant/50 rounded-b-xl">
              <button
                type="button"
                onClick={closeEditContact}
                className="px-4 py-2 rounded-lg font-body text-xs font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-outline/50 border border-transparent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEditContact}
                className="px-4 py-2 rounded-lg font-body text-xs font-semibold text-white bg-sky-blue hover:bg-sky-blue/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-blue/50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {profileModalOpen && (
        <Modal open={profileModalOpen} onClose={closeProfileModal} size="md" title="Update Profile Picture">
          <div className="flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-on-surface">
                Update Profile Picture
              </h2>
              <button
                type="button"
                onClick={closeProfileModal}
                className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-full hover:bg-surface-variant/50"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center gap-5 overflow-y-auto">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl relative">
                <Image
                  src={profilePreview || profileImage || '/default-avatar.svg'}
                  alt="Current Profile Picture"
                  width={160}
                  height={160}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                {!profilePreview && profileImage && (
                  <div className="absolute inset-0 bg-primary/0" />
                )}
              </div>

              <button
                type="button"
                onClick={() => profileImageRef.current?.click()}
                className="w-full max-w-[320px] border-2 border-dashed border-outline-variant rounded-2xl py-5 flex flex-col items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container hover:border-primary-container/40 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">
                    cloud_upload
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-body text-sm text-on-surface">
                    <span className="font-bold text-primary-container">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    SVG, PNG, JPG or GIF · Max 2MB
                  </p>
                </div>
              </button>

              <p className="font-label-sm text-label-sm text-on-surface-variant text-center px-4">
                Recommended size: 400x400px.
              </p>

              {profileError && (
                <p className="font-body text-sm text-error flex items-center gap-1.5 w-full justify-center">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {profileError}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3 rounded-b-[16px]">
              <button
                type="button"
                onClick={closeProfileModal}
                className="px-5 py-2.5 rounded-[12px] border border-outline-variant font-body text-sm font-semibold text-primary-container hover:bg-surface-variant transition-colors bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveProfilePicture}
                disabled={profileSaving}
                className="px-5 py-2.5 rounded-[12px] font-body text-sm font-semibold text-white shadow-sm hover:shadow-md hover:brightness-110 active:scale-95 transition-all bg-bright-cyan disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {profileSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {passSuccessOpen && (
        <SuccessModal
          open={passSuccessOpen}
          onClose={() => setPassSuccessOpen(false)}
          details="Your password has been updated successfully."
          onPrimary={() => applyView('dashboard')}
        />
      )}

      {verifyChannel && (
        <Modal open onClose={closeVerifyModal} size="md" title="Enter Verification Code" preventDismiss={verifySubmitting}>
          <div className="relative p-8 pb-4 text-center">
            <button
              type="button"
              aria-label="Close modal"
              onClick={closeVerifyModal}
              disabled={verifySubmitting}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low disabled:opacity-40"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
              <span className="material-symbols-outlined text-3xl">
                lock_person
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-primary mb-2">
              Enter Verification Code
            </h3>
            <p className="font-body text-sm text-on-surface-variant px-4">
              We&apos;ve sent a 4-digit code to{' '}
              <span className="font-bold text-on-surface">
                {verifyChannel === 'email'
                  ? checkingsContact.email
                  : checkingsContact.whatsapp}
              </span>
              . Please enter it below to continue.
            </p>
          </div>

          <div className="p-8 pt-6">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                confirmVerification();
              }}
            >
              <div className="flex gap-2 sm:gap-3 justify-center" role="group" aria-label="Verification code">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpInputsRef.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    autoFocus={i === 0}
                    aria-label={`Digit ${i + 1}`}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center font-display text-xl text-primary bg-surface border border-outline-variant rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  />
                ))}
              </div>

              {verifyError && (
                <p className="font-body text-sm text-error flex items-center gap-1.5 justify-center">
                  <span className="material-symbols-outlined text-[16px]">
                    error
                  </span>
                  {verifyError}
                </p>
              )}

              {verifySuccess && (
                <p className="font-body text-sm text-mint flex items-center gap-1.5 justify-center">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  {verifySuccess}
                </p>
              )}

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={verifySubmitting || otp.join('').length !== 4 || Boolean(verifySuccess)}
                  className="w-full bg-sky-blue text-white font-body text-sm font-semibold py-4 rounded-xl hover:bg-[#0284c7] transition-colors shadow-[0_4px_14px_0_rgba(56,189,248,0.39)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifySubmitting && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {verifySubmitting ? 'Verifying...' : 'Verify Code'}
                </button>
                <div className="text-center font-body text-sm">
                  <span className="text-on-surface-variant">
                    Didn&apos;t receive the code?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={cooldown > 0 || verifySubmitting || Boolean(verifySuccess)}
                    className="text-secondary font-semibold hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend{' '}
                    {cooldown > 0 && (
                      <span className="text-on-surface-variant">({cooldown}s)</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {networkSuccessOpen && (
        <SuccessModal
          open={networkSuccessOpen}
          onClose={() => setNetworkSuccessOpen(false)}
          details="Your network influence details have been updated successfully."
          onSecondary={() => setNetworkSuccessOpen(false)}
        />
      )}

      {bankSuccessOpen && (
        <SuccessModal
          open={bankSuccessOpen}
          onClose={() => setBankSuccessOpen(false)}
          details="Your bank account details have been updated successfully."
          onPrimary={() => setBankSuccessOpen(false)}
        />
      )}

      {personalSuccessOpen && (
        <SuccessModal
          open={personalSuccessOpen}
          onClose={() => setPersonalSuccessOpen(false)}
          details="Your personal details have been updated successfully."
          onPrimary={() => setPersonalSuccessOpen(false)}
        />
      )}

      {vettingSuccessOpen && (
        <SuccessModal
          open={vettingSuccessOpen}
          onClose={() => setVettingSuccessOpen(false)}
          details="Your vetting information has been submitted for review successfully."
          onPrimary={() => setVettingSuccessOpen(false)}
        />
      )}
    </div>
  );
}
