import { CheckCircle2, GraduationCap, KeyRound, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { useStudentAuth } from '../state/useStudentAuth';

export function AuthPlaceholder() {
  const {
    status,
    session,
    error,
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
    signOutStudent,
    simulateStatus,
  } = useStudentAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-16">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Campus Access · Firebase Auth
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            University Student Verification
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in with your verified academic email (.ac.uk or .edu) to buy, sell, and schedule
            hall pickups.
          </p>
        </div>

        {status === 'success' && session ? (
          <Button type="button" variant="ghost" onClick={() => void signOutStudent()}>
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        ) : null}
      </div>

      {status === 'loading' ? <LoadingState label="Verifying university credentials..." /> : null}

      {status === 'error' && error ? (
        <ErrorState
          error={error}
          onRetry={() => void (mode === 'signin' ? submitSignIn() : submitRegister())}
        />
      ) : null}

      {status === 'empty' ? (
        <EmptyState
          icon={<KeyRound className="h-6 w-6" />}
          title="Signed out of UniCycle"
          description="Sign in with your university email account to access campus listings and messages."
          actionLabel="Sign In Verified Student"
          onAction={() => simulateStatus('success')}
        />
      ) : null}

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-8 md:grid-cols-12"
        >
          {/* Left Editorial Trust Column */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-stone-100/80 p-6 md:col-span-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Exclusive to Verified University Students
              </h2>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Every buyer and seller on UniCycle is authenticated via their university domain to
                keep residence hall handovers safe and scam-free.
              </p>

              {session ? (
                <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-950/70">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Active Session: {session.fullName}
                  </p>
                  <p className="mt-0.5 text-zinc-500 dark:text-zinc-400">{session.email}</p>
                  <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                    Hall: {session.residenceHall}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="space-y-2.5 border-t border-zinc-200 pt-4 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Instant .ac.uk & .edu domain check
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Zero platform fees for students
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Verified residence hall pickup zones
              </p>
            </div>
          </div>

          {/* Right Form Card */}
          <Card className="space-y-6 md:col-span-7">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
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
                  onClick={() => setMode('register')}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    mode === 'register'
                      ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-950 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400',
                  )}
                >
                  Create Student Account
                </button>
              </div>

              {session?.verifiedCampusDomain ? (
                <Badge tone="emerald">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </Badge>
              ) : null}
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (mode === 'signin') {
                  void submitSignIn();
                } else {
                  void submitRegister();
                }
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
                  value={universityEmail}
                  onChange={(e) => setUniversityEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="uni-password"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <input
                  id="uni-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <Button type="submit" variant="secondary" className="w-full">
                {mode === 'signin'
                  ? 'Sign In with Firebase Auth'
                  : 'Create Verified Campus Account'}
              </Button>
            </form>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}
