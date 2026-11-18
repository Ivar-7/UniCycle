import { CheckCircle2, GraduationCap, KeyRound, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Button, Card, LoadingState } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { useStudentAuth } from '../state/useStudentAuth';

export function AuthView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const {
    authLoading,
    session,
    isSubmitting,
    formError,
    setFormError,
    resetMessage,
    universityEmail,
    setUniversityEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    residenceHall,
    setResidenceHall,
    submitSignIn,
    submitRegister,
    submitPasswordReset,
    signOutStudent,
  } = useStudentAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  if (authLoading) {
    return <LoadingState label="Checking campus session..." />;
  }

  const handleFormSubmit = async () => {
    const ok = mode === 'signin' ? await submitSignIn() : await submitRegister();
    if (ok && redirectPath && redirectPath.startsWith('/')) {
      void navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="w-full space-y-8 pb-16 sm:space-y-10">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Campus Access
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            University Student Verification
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in with your verified academic email (.ac.uk or .edu) to sell items, message
            students, and schedule hall pickups.
          </p>
        </div>

        {session ? (
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => void signOutStudent()}
            className="self-start sm:self-auto"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        ) : null}
      </div>

      {session ? (
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {session.fullName}
                  </h2>
                  {session.verifiedCampusDomain ? (
                    <Badge tone="neutral">Verified Student</Badge>
                  ) : null}
                </div>
                <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{session.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button variant="outline" size="sm" onClick={() => void navigate('/profile')}>
                View Profile
              </Button>
              <Button variant="secondary" size="sm" onClick={() => void navigate('/listings')}>
                My Listings
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-6 md:grid-cols-12 lg:gap-8"
        >
          {/* Trust Info Column */}
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-zinc-200 bg-stone-100/80 p-6 md:col-span-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-200/80 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Verified Students Only
              </h2>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Every buyer and seller on UniCycle authenticates with a university domain so hall
                handovers stay safe, local, and scam-free.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-zinc-200 pt-4 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-700 dark:text-zinc-300" />
                Instant .ac.uk & .edu domain verification
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-700 dark:text-zinc-300" />
                Zero platform fees on campus pickups
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-700 dark:text-zinc-300" />
                Residence hall reception meetup codes
              </p>
            </div>
          </div>

          {/* Auth Form Card */}
          <Card className="space-y-6 md:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setMode('signin');
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    mode === 'signin'
                      ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-950 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400',
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setMode('register');
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    mode === 'register'
                      ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-950 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400',
                  )}
                >
                  Create Account
                </button>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <KeyRound className="h-3.5 w-3.5" />
                .ac.uk / .edu
              </span>
            </div>

            {formError ? (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              >
                {formError}
              </div>
            ) : null}

            {resetMessage ? (
              <div
                role="status"
                className="rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {resetMessage}
              </div>
            ) : null}

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void handleFormSubmit();
              }}
            >
              {mode === 'register' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="uni-fullname"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Full Student Name
                    </label>
                    <input
                      id="uni-fullname"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Alex Rivera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="uni-hall"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Residence Hall
                    </label>
                    <input
                      id="uni-hall"
                      type="text"
                      required
                      placeholder="North Hall Residence"
                      value={residenceHall}
                      onChange={(e) => setResidenceHall(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <label
                  htmlFor="uni-email"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  University Email (.ac.uk / .edu)
                </label>
                <input
                  id="uni-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@university.edu"
                  value={universityEmail}
                  onChange={(e) => setUniversityEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="uni-password"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Password
                  </label>
                  {mode === 'signin' ? (
                    <button
                      type="button"
                      disabled={isSubmitting || !universityEmail.trim()}
                      onClick={() => void submitPasswordReset()}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      Forgot password?
                    </button>
                  ) : null}
                </div>
                <input
                  id="uni-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <Button type="submit" variant="secondary" disabled={isSubmitting} className="w-full">
                {isSubmitting
                  ? 'Please wait...'
                  : mode === 'signin'
                    ? 'Sign In'
                    : 'Create Verified Account'}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
