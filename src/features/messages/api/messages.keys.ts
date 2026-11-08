export const messagesKeys = {
  all: ['messages'] as const,
  threads: (userId: string) => [...messagesKeys.all, 'threads', userId] as const,
  threadDetail: (threadId: string) => [...messagesKeys.all, 'thread', threadId] as const,
};
