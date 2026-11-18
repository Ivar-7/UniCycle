import { fetchUserCollection, upsertUserDocument } from '@/shared/firebase';
import { conversationThreadSchema, sendMessageInputSchema } from './messages.schema';
import type { ChatMessageItem, ConversationThread } from './messages.types';

function buildOutgoingMessage(text: string, now: Date): ChatMessageItem {
  return {
    id: `msg-${now.getTime()}`,
    sender: 'me',
    text,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function fetchConversationThreads(userId: string): Promise<ConversationThread[]> {
  return fetchUserCollection('conversations', conversationThreadSchema, {
    filterField: 'participantIds',
    filterOp: 'array-contains',
    userId,
    orderByField: 'updatedAt',
  });
}

export async function startConversationThread(
  userId: string,
  peerStudentName: string,
  itemTitle: string,
  initialText?: string,
  peerUserId?: string,
): Promise<ConversationThread> {
  const now = new Date();
  const text =
    initialText?.trim() ||
    `Hi ${peerStudentName.split(' ')[0] ?? 'there'}! Is "${itemTitle}" still available for campus pickup?`;

  const slug = itemTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 28);
  const threadId = `conv-${userId.slice(0, 8)}-${slug || 'item'}`;
  const participantIds = peerUserId && peerUserId !== userId ? [userId, peerUserId] : [userId];

  const thread: ConversationThread = {
    id: threadId,
    participantIds,
    peerStudentName,
    itemTitle,
    lastMessage: text,
    unreadCount: 0,
    updatedAt: now.toISOString(),
    messages: [buildOutgoingMessage(text, now)],
  };

  return upsertUserDocument('conversations', threadId, thread, conversationThreadSchema);
}

export async function sendThreadMessage(
  thread: ConversationThread,
  messageText: string,
): Promise<ConversationThread> {
  const validated = sendMessageInputSchema.parse({
    threadId: thread.id,
    text: messageText,
  });

  const now = new Date();

  const updatedThread: ConversationThread = {
    ...thread,
    lastMessage: validated.text,
    unreadCount: 0,
    updatedAt: now.toISOString(),
    messages: [...thread.messages, buildOutgoingMessage(validated.text, now)],
  };

  return upsertUserDocument('conversations', thread.id, updatedThread, conversationThreadSchema);
}
