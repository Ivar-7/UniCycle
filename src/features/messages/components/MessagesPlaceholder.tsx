import { MapPin, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Badge, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { useMessages } from '../state/useMessages';

const QUICK_REPLIES = [
  'Can I pick this up at North Hall today at 5pm?',
  'Is the item still available?',
  'Would you accept $5 less if I collect this afternoon?',
] as const;

export function MessagesPlaceholder() {
  const { status, threads, error, actionError, sendMessage, reload } = useMessages();
  const [selectedThreadId, setSelectedThreadId] = useState<string>('msg-thread-01');
  const [draft, setDraft] = useState<string>('');

  const activeThread = threads.find((t) => t.id === selectedThreadId) ?? threads[0];

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
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Student Messages & Handovers
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Coordinate safe hall-to-hall pickups directly with verified student buyers and sellers.
        </p>
      </div>

      {actionError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {actionError}
        </div>
      ) : null}

      {status === 'loading' ? <LoadingState label="Loading campus conversations..." /> : null}

      {status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

      {status === 'empty' ? (
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" />}
          title="No active messages"
          description="Message a student seller on any listing to coordinate pickup on campus."
          actionLabel="Load Sample Conversations"
          onAction={() => void reload()}
        />
      ) : null}

      {status === 'success' && threads.length > 0 && activeThread ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-12"
        >
          {/* Thread List */}
          <div className="space-y-3 lg:col-span-4">
            {threads.map((thread) => {
              const isSelected = thread.id === activeThread.id;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={cn(
                    'flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition-all',
                    isSelected
                      ? 'border-zinc-900 bg-white shadow-xs dark:border-zinc-100 dark:bg-zinc-900'
                      : 'border-zinc-200 bg-white/60 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {thread.peerStudentName}
                    </span>
                    {thread.unreadCount > 0 ? (
                      <Badge tone="emerald">{thread.unreadCount} new</Badge>
                    ) : null}
                  </div>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
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
          <Card className="flex flex-col justify-between gap-6 lg:col-span-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {activeThread.peerStudentName}
                </h2>
                <p className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-3 w-3" />
                  Item: {activeThread.itemTitle}
                </p>
              </div>
              <Badge tone="emerald">Verified Student</Badge>
            </div>

            {/* Messages Feed */}
            <div className="flex max-h-80 flex-col gap-3 overflow-y-auto py-2">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex max-w-md flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm',
                    msg.sender === 'me'
                      ? 'self-end bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                      : 'self-start bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
                  )}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-65">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Campus Meetup Chips & Composer */}
            <div className="space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => handleSend(reply)}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message to arrange campus pickup..."
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              </form>
            </div>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}
