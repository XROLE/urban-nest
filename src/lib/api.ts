export const BASE_URL = 'https://rmts-backend.onrender.com/api/v1';

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