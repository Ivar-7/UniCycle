import { ArrowLeft, LogIn, MapPin, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { useMessages } from '../state/useMessages';

const QUICK_REPLIES = [
  'Can I pick this up at North Hall today at 5pm?',
  'Is the item still available?',
  'Would you take an afternoon collection?',
] as const;

export function MessagesView() {
  const navigate = useNavigate();
  const {
    user,
    authLoading,
    status,
    threads,
    activeThreadId,
    setActiveThreadId,
    error,
    actionError,
    sendMessage,
    reload,
  } = useMessages();
  const [draft, setDraft] = useState<string>('');
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(Boolean(activeThreadId));

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0] ?? null;

  const handleSend = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || !activeThread) {
      return;
    }
    void sendMessage(activeThread, trimmed);
    setDraft('');
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Campus Inbox
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          Student Messages & Handovers
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Coordinate safe hall-to-hall pickups directly with verified student buyers and sellers.
        </p>
      </div>

      {actionError ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {actionError}
        </div>
      ) : null}

      {authLoading || (user && status === 'loading') ? (
        <LoadingState label="Loading campus conversations..." />
      ) : null}

      {!authLoading && !user ? (
        <EmptyState
          icon={<LogIn className="h-6 w-6" />}
          title="Sign in to view your inbox"
          description="Sign in with your university email to message student sellers and arrange residence hall pickups."
          actionLabel="Student Sign In"
          onAction={() => void navigate('/auth?redirect=/messages')}
        />
      ) : null}

      {user && status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

      {user && status === 'empty' ? (
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" />}
          title="No active conversations yet"
          description="Tap Message Seller on any item in the shop to start coordinating a pickup."
          actionLabel="Browse Shop"
          onAction={() => void navigate('/')}
        />
      ) : null}

      {user && status === 'success' && threads.length > 0 && activeThread ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-12"
        >
          {/* Thread List */}
          <div
            className={cn('space-y-3 lg:col-span-4 lg:block', mobileShowChat ? 'hidden' : 'block')}
          >
            {threads.map((thread) => {
              const isSelected = thread.id === activeThread.id;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setMobileShowChat(true);
                  }}
                  className={cn(
                    'flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition-all',
                    isSelected
                      ? 'border-zinc-400 bg-white shadow-xs dark:border-zinc-500 dark:bg-zinc-900'
                      : 'border-zinc-200 bg-white/60 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {thread.peerStudentName}
                    </span>
                    {thread.unreadCount > 0 ? (
                      <Badge tone="neutral">{thread.unreadCount} new</Badge>
                    ) : null}
                  </div>
                  <span className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {thread.itemTitle}
                  </span>
                  <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {thread.lastMessage}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Chat Pane */}
          <Card
            className={cn(
              'flex min-w-0 flex-col justify-between gap-5 lg:col-span-8 lg:flex',
              mobileShowChat ? 'flex' : 'hidden',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Back to conversations"
                  onClick={() => setMobileShowChat(false)}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 lg:hidden dark:border-zinc-800 dark:text-zinc-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {activeThread.peerStudentName}
                  </h2>
                  <p className="inline-flex max-w-full items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">Item: {activeThread.itemTitle}</span>
                  </p>
                </div>
              </div>
              <Badge tone="neutral">Verified Student</Badge>
            </div>

            <div className="flex min-h-64 max-h-96 flex-col gap-3 overflow-y-auto py-2">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex max-w-md flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm',
                    msg.sender === 'me'
                      ? 'self-end border border-zinc-300 bg-zinc-200/80 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-700 dark:text-zinc-100'
                      : 'self-start bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
                  )}
                >
                  <p className="break-words">{msg.text}</p>
                  <span className="text-xs opacity-65">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => handleSend(reply)}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(draft);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message to arrange campus pickup..."
                  aria-label="Message text"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-200/80 px-4 py-2.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-300/80 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}
