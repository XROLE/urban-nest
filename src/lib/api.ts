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