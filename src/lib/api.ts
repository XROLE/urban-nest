export const BASE_URL = 'https://rmts-backend.onrender.com/api/v1';

export interface ProfileItem {
  id: string;
  full_name: string;
  phone_number: string | null;
  email: string | null;
  gender: string | null;
  age_range: string | null;
  state: string | null;
  marital_status: string | null;
  religion: string | null;
  preferred_locations: string[] | null;
  budget_min: number | null;
  budget_max: number | null;
  expected_move_in_date: string | null;
  occupation: string | null;
  smoking_habit: string | null;
  allows_pets: boolean | null;
  sleep_habit: string | null;
  personal_bio: string | null;
  referred_by_code: string | null;
  status: string | null;
  is_active: boolean | null;
  agreed_to_terms: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface ProfilesResponse {
  data: {
    items: ProfileItem[];
    pagination: PaginationMeta;
  };
}

export interface AmbassadorUserInfo {
  id: string;
  full_name: string | null;
  email: string | null;
  whatsapp_number: string | null;
  role: string | null;
  is_active: boolean | null;
  email_verified: boolean | null;
  whatsapp_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface AmbassadorItem {
  id: string;
  user_id: string;
  user: AmbassadorUserInfo | null;
  referral_code: string;
  total_referrals: number | null;
  total_earnings_ngn: number | null;
  pending_balance_ngn: number | null;
  available_balance_ngn: number | null;
  total_withdrawn_ngn: number | null;
  bank_code: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  campus_or_region: string | null;
  is_approved: boolean | null;
  profile_picture_url: string | null;
  verification_status: string | null;
  ambassador_ranking: string | null;
  state_covering: string[] | null;
  emergency_contact: unknown | null;
  audience_category: string[] | null;
  institution_or_organization: string | null;
  primary_operating: string | null;
  secondary_operating: string | null;
  social_media_platform: string[] | null;
  social_media_handle: string | null;
  social_media_target_audience: string | null;
  created_at: string;
  updated_at: string;
}

export interface AmbassadorsResponse {
  data: {
    items: AmbassadorItem[];
    pagination: PaginationMeta;
  };
}

export async function fetchAmbassadors(
  token: string,
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<AmbassadorsResponse['data']> {
  const res = await fetch(`${BASE_URL}/ambassadors?limit=${limit}&offset=${offset}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  const data = (await res.json()) as AmbassadorsResponse;
  return data.data;
}

export async function fetchProfiles(
  token: string,
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<ProfilesResponse['data']> {
  const res = await fetch(`${BASE_URL}/profiles?limit=${limit}&offset=${offset}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  const data = (await res.json()) as ProfilesResponse;
  return data.data;
}

export interface MatchBreakdown {
  location: number;
  state: number;
  budget: number;
  moveIn: number;
  gender: number;
  religion: number;
  occupation: number;
  smoking: number;
  pets: number;
}

export interface MatchItem {
  score: number;
  breakdown: MatchBreakdown;
  profiles: ProfileItem[];
}

export interface MatchesResponse {
  data: {
    items: MatchItem[];
    pagination: PaginationMeta;
  };
}

export async function fetchMatches(
  token: string,
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<MatchesResponse['data']> {
  const res = await fetch(`${BASE_URL}/matches?limit=${limit}&offset=${offset}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  const data = (await res.json()) as MatchesResponse;
  return data.data;
}

export interface ConfirmedMatch {
  id: string;
  roommate_profile_a_id?: string;
  roommate_profile_b_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateMatchResponse {
  data: {
    match: ConfirmedMatch;
    profiles: ProfileItem[];
  };
}

export async function createMatch(
  token: string,
  body: { roommateProfileAId: string; roommateProfileBId: string }
): Promise<CreateMatchResponse['data']> {
  const res = await fetch(`${BASE_URL}/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  const data = (await res.json()) as CreateMatchResponse;
  return data.data;
}

export interface FinancialOverview {
  paystackBalance: { currency: string; balanceKobo: number; balanceNgn: number };
  totalGrossRevenue: number;
  totalCommissions: number;
  totalPendingPayout: number;
  pendingAmbassadorCount: number;
  netPlatformEarnings: number;
}

export async function fetchPayoutBalance(token: string): Promise<number> {
  const res = await fetch(`${BASE_URL}/payments/balance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  const json = (await res.json()) as {
    data?: { currency: string; balanceKobo: number; balanceNgn: number }[];
  };
  return json?.data?.[0]?.balanceNgn ?? 0;
}

export async function fetchFinancialOverview(token: string): Promise<FinancialOverview> {
  const res = await fetch(`${BASE_URL}/payments/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  const json = (await res.json()) as { data?: FinancialOverview };
  if (!json?.data) throw new Error('No financial overview data returned');
  return json.data;
}

export async function parseApiError(res: Response): Promise<string> {
  let message = 'Something went wrong. Please try again.';
  try {
    const data = await res.json();
    if (typeof data?.message === 'string') message = data.message;
    else if (typeof data?.error === 'string') message = data.error;

    const details: string[] = [];
    if (Array.isArray(data?.errors)) {
      data.errors.forEach((e: unknown) => {
        if (typeof e === 'string') details.push(e);
        else if (e && typeof e === 'object') {
          const err = e as { field?: string; message?: string; msg?: string };
          const m = err.message || err.msg;
          if (m) details.push(err.field ? `${err.field}: ${m}` : m);
        }
      });
    } else if (data?.errors && typeof data?.errors === 'object') {
      Object.entries(data.errors).forEach(([k, v]) => {
        details.push(typeof v === 'string' ? `${k}: ${v}` : k);
      });
    }

    if (details.length > 0) message = details.join('\n');
  } catch {
    /* ignore body parse errors */
  }
  return message;
}