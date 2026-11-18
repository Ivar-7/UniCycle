import { ArrowLeft, CheckCircle2, Eye, EyeOff, GraduationCap, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, LoadingState } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { useStudentAuth } from '../state/useStudentAuth';

function resolveSafeRedirect(rawRedirect: string | null): string {
  if (
    rawRedirect &&
    rawRedirect.startsWith('/') &&
    !rawRedirect.startsWith('//') &&
    !rawRedirect.startsWith('/auth')
  ) {
    return rawRedirect;
  }
  return '/';
}

export function AuthView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const safeRedirect = resolveSafeRedirect(searchParams.get('redirect'));

  const {
    authLoading,
    session,
    isSubmitting,
    formError,
    setFormError,
    resetMessage,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    submitSignIn,
    submitRegister,
    submitPasswordReset,
  } = useStudentAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  if (authLoading) {
    return <LoadingState label="Checking campus session..." />;
  }

  if (session) {
    return <Navigate to={safeRedirect} replace />;
  }

  const handleFormSubmit = async () => {
    const ok = mode === 'signin' ? await submitSignIn() : await submitRegister();
    if (ok) {
      setShowPassword(false);
      void navigate(safeRedirect, { replace: true });
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
            Sign In & Account Access
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in with any email address to sell items, message buyers and sellers, and schedule
            campus pickups.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 self-start text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:self-auto dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid gap-6 md:grid-cols-12 lg:gap-8"
      >
        {/* Trust Info Column */}
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-zinc-200 bg-stone-100/80 p-6 sm:p-8 md:col-span-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-300">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Safe Campus Handovers
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Use any email address—personal or academic—to buy and sell pre-owned essentials with
              on-campus pickup meetup codes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 border-y border-zinc-200 py-4 dark:border-zinc-800">
            <div>
              <p className="text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                2,840+
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Items Reused</p>
            </div>
            <div>
              <p className="text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                Ksh 0 Fee
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Pickups</p>
            </div>
            <div>
              <p className="text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                18
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Campus Hubs</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-400" />
              Works with any personal or university email
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-400" />
              Zero platform fees on campus pickups
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-400" />
              Verified on-campus meetup codes
            </p>
          </div>
        </div>

        {/* Auth Form Card */}
        <Card className="space-y-6 p-6 sm:p-8 md:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setShowPassword(false);
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
                  setShowPassword(false);
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
              Any email
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
              <div className="space-y-1.5">
                <label
                  htmlFor="uni-fullname"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Full Name
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
            ) : null}

            <div className="space-y-1.5">
              <label
                htmlFor="uni-email"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email Address
              </label>
              <input
                id="uni-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                    disabled={isSubmitting || !email.trim()}
                    onClick={() => void submitPasswordReset()}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Forgot password?
                  </button>
                ) : null}
              </div>
              <div className="relative">
                <input
                  id="uni-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pr-10 pl-3.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:text-zinc-900 focus-visible:outline-none dark:text-zinc-500 dark:hover:text-zinc-200 dark:focus-visible:text-zinc-100"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
