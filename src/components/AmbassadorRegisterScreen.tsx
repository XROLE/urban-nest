'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LegalModal from '@/components/LegalModal';
import { useAuth } from '@/components/providers/AuthProvider';

type FormValues = {
  full_name: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
  agreed_to_terms: boolean;
};

type FormErrors = Partial<FormValues>;

const initialValues: FormValues = {
  full_name: '',
  phone_number: '',
  email: '',
  password: '',
  confirm_password: '',
  agreed_to_terms: false,
};

const initialErrors: FormErrors = {};

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.full_name.trim()) {
    errors.full_name = 'Full name is required.';
  } else if (values.full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters.';
  }

  if (!values.phone_number.trim()) {
    errors.phone_number = 'Phone number is required.';
  } else if (!/^[0-9+\-\s()]{7,15}$/.test(values.phone_number.trim())) {
    errors.phone_number = 'Enter a valid phone number.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!values.confirm_password) {
    errors.confirm_password = 'Please confirm your password.';
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = 'Passwords do not match.';
  }

  if (!values.agreed_to_terms) {
    errors.agreed_to_terms = true;
  }

  return errors;
};

export default function AmbassadorRegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const setChange = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const user = await register({
        fullName: values.full_name.trim(),
        whatsappNumber: values.phone_number.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      router.push(
        user?.role === 'admin' ? '/admin/dashboard' : '/ambassador/dashboard'
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Lifestyle Image Banner */}
      <div className="hidden md:block md:w-1/2 relative bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full opacity-80 transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white space-y-3 z-10">
          <span className="inline-block bg-bright-cyan/20 border border-bright-cyan/30 text-bright-cyan px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Ambassador Portal
          </span>
          <h2 className="font-display text-3xl font-extrabold leading-tight">
            Earn rewards by connecting room-seekers across Nigeria.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Share your unique referral link, track your earnings in real time, and help build stronger co-living communities.
          </p>
        </div>
      </div>

      {/* Right Side: Registration Form Canvas */}
      <div className="w-full md:w-1/2 flex flex-col min-h-screen bg-white">
        {/* Navigation */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center w-full">
          <Link href="/" className="font-display font-bold text-xl text-primary">
            Roommate NG
          </Link>
          <Link
            href="/"
            className="text-secondary font-bold text-sm border-b-2 border-secondary hover:text-bright-cyan hover:border-bright-cyan transition-colors"
          >
            Back to Main Site
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-extrabold text-primary mb-2">
                Become an Ambassador
              </h1>
              <p className="font-body text-sm text-slate-500">
                Create your account and start earning rewards today.
              </p>
            </div>

            {submitError && (
              <div
                role="alert"
                className="mb-4 bg-error/10 text-error border border-error/20 rounded-2xl px-4 py-3 text-sm font-body"
              >
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  className="block font-label-bold text-xs font-bold text-dark-slate mb-1"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
                <input
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-dark-slate focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 transition-all font-body text-sm outline-none bg-slate-50"
                  id="full_name"
                  placeholder="e.g., Jane Doe"
                  type="text"
                  value={values.full_name}
                  onChange={(e) => setChange('full_name', e.target.value)}
                />
                {errors.full_name && (
                  <p className="mt-1 text-xs font-body font-semibold text-error">
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block font-label-bold text-xs font-bold text-dark-slate mb-1"
                  htmlFor="phone_number"
                >
                  WhatsApp Phone Number
                </label>
                <input
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-dark-slate focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 transition-all font-body text-sm outline-none bg-slate-50"
                  id="phone_number"
                  placeholder="e.g., 08012345678"
                  type="tel"
                  value={values.phone_number}
                  onChange={(e) => setChange('phone_number', e.target.value)}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-xs font-body font-semibold text-error">
                    {errors.phone_number}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block font-label-bold text-xs font-bold text-dark-slate mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-dark-slate focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 transition-all font-body text-sm outline-none bg-slate-50"
                  id="email"
                  placeholder="e.g., jane@example.com"
                  type="email"
                  value={values.email}
                  onChange={(e) => setChange('email', e.target.value)}
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-body font-semibold text-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block font-label-bold text-xs font-bold text-dark-slate mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-full border border-slate-300 px-4 py-3 text-dark-slate focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 transition-all font-body text-sm outline-none bg-slate-50"
                    id="password"
                    placeholder="Min. 8 characters"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={(e) => setChange('password', e.target.value)}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs font-body font-semibold text-error">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block font-label-bold text-xs font-bold text-dark-slate mb-1"
                  htmlFor="confirm_password"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-full border border-slate-300 px-4 py-3 text-dark-slate focus:border-bright-cyan focus:ring-2 focus:ring-bright-cyan/20 transition-all font-body text-sm outline-none bg-slate-50"
                    id="confirm_password"
                    placeholder="Re-enter your password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={values.confirm_password}
                    onChange={(e) =>
                      setChange('confirm_password', e.target.value)
                    }
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-xs font-body font-semibold text-error">
                    {errors.confirm_password}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <input
                    className="mt-0.5 w-4 h-4 rounded accent-bright-cyan text-bright-cyan"
                    id="agreed_to_terms"
                    type="checkbox"
                    checked={values.agreed_to_terms}
                    onChange={(e) =>
                      setChange('agreed_to_terms', e.target.checked)
                    }
                  />
                  <label
                    className="font-body text-xs text-slate-500 select-none"
                    htmlFor="agreed_to_terms"
                  >
                    I agree to the{' '}
                    <button
                      className="text-bright-cyan hover:underline inline"
                      type="button"
                      onClick={() => setShowTerms(true)}
                    >
                      Terms &amp; Conditions
                    </button>{' '}
                    and{' '}
                    <button
                      className="text-bright-cyan hover:underline inline"
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>
                {errors.agreed_to_terms && (
                  <p className="mt-1 text-xs font-body font-semibold text-error">
                    You must agree to the Terms &amp; Conditions.
                  </p>
                )}
              </div>

              <button
                className="w-full mt-6 rounded-full bg-bright-cyan text-white font-display font-semibold text-base py-3.5 hover:bg-bright-cyan/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink-0 mx-4 font-body text-xs text-slate-400">
                  Already have an account?
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>
              <div className="text-center">
                <Link
                  className="font-display font-semibold text-sm text-bright-cyan hover:underline"
                  href="/ambassador/login"
                >
                  Sign in to your dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 py-4 px-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Secure Ambassador Portal</span>
          </div>
          <div className="flex gap-4">
            <button
              className="hover:text-primary underline"
              type="button"
              onClick={() => setShowPrivacy(true)}
            >
              Privacy Policy
            </button>
            <button
              className="hover:text-primary underline"
              type="button"
              onClick={() => setShowTerms(true)}
            >
              Terms of Service
            </button>
          </div>
        </footer>
      </div>

      {/* Legal Modals */}
      <LegalModal
        type="terms"
        open={showTerms}
        onClose={() => setShowTerms(false)}
      />
      <LegalModal
        type="privacy"
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
}