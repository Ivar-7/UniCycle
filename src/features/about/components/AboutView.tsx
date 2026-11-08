import { ArrowRight, ChevronDown, Leaf, Recycle, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { useAbout } from '../state/useAbout';

export function AboutView() {
  const { status, data, error, openFaqId, toggleFaq, reload } = useAbout();

  if (status === 'loading') {
    return <LoadingState label="Loading UniCycle mission..." />;
  }

  if (status === 'error' && error) {
    return <ErrorState error={error} onRetry={reload} />;
  }

  if (!data) {
    return (
      <EmptyState
        title="Information unavailable"
        description="Unable to load the About page content."
        actionLabel="Retry"
        onAction={() => void reload()}
      />
    );
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Header */}
      <section className="rounded-3xl border border-zinc-200 bg-stone-100/80 px-6 py-14 sm:px-12 lg:py-20 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Our Circular Campus Mission
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
            Ending end-of-term landfill waste, one dorm room at a time.
          </h1>
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Every June, thousands of perfectly good desk lamps, kettles, chairs, and cookware sets
            are discarded when students move out of halls—only for incoming students to buy the
            exact same items brand new in September. UniCycle closes the loop.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Browse Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Explore 3D Studio
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section aria-label="Sustainability Impact Metrics" className="grid gap-6 sm:grid-cols-3">
        {data.metrics.map((metric, idx) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <Card className="space-y-2">
              <p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                {metric.value}
              </p>
              <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {metric.label}
              </h2>
              <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {metric.detail}
              </p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* 3 Pillars */}
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Recycle,
            title: '1. List in 60 Seconds',
            body: 'Snap a photo, tag your residence hall, and set a student-friendly price before moving out.',
          },
          {
            icon: Sparkles,
            title: '2. Inspect with Clarity',
            body: 'Buyers filter by category, colour, price, and rating—or inspect flagship gear in our 3D studio.',
          },
          {
            icon: ShieldCheck,
            title: '3. Safe Hall Handover',
            body: 'Meet at verified residence hall receptions or the Students Union with zero shipping packaging.',
          },
        ].map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.title} className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {step.body}
              </p>
            </Card>
          );
        })}
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-1 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            FAQ
          </span>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {data.faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="p-5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-zinc-500 transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isOpen ? (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
