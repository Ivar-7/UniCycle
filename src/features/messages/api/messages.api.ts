import { fetchCollectionWithSeed, upsertCollectionDocument } from '@/shared/firebase';
import {
  conversationThreadListSchema,
  conversationThreadSchema,
  sendMessageInputSchema,
} from './messages.schema';
import type { ConversationThread } from './messages.types';

export const SEED_THREADS: readonly ConversationThread[] = [
  {
    id: 'msg-thread-01',
    peerStudentName: 'Maya · North Hall Block B',
    itemTitle: 'Nordic Architect Desk Lamp',
    lastMessage: 'Yes, original braided cable and box included!',
    unreadCount: 1,
    updatedAt: '2026-11-08T09:30:00.000Z',
    messages: [
      {
        id: 'm1',
        sender: 'peer',
        text: 'Hi! Are you free to meet outside the Students Union at 4pm?',
        time: '14:20',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Hey! Yes, 4pm works great. Does it come with the power cable?',
        time: '14:22',
      },
      {
        id: 'm3',
        sender: 'peer',
        text: 'Yes, original braided cable and box included!',
        time: '14:25',
      },
    ],
  },
  {
    id: 'msg-thread-02',
    peerStudentName: 'Liam · Oakwood Student Village',
    itemTitle: 'Cast Iron Dutch Oven 4L',
    lastMessage: 'Yes, the induction base works on all hall hobs!',
    unreadCount: 0,
    updatedAt: '2026-11-07T19:15:00.000Z',
    messages: [
      {
        id: 'm2-1',
        sender: 'me',
        text: 'Hi Liam, does this Dutch oven work on the induction hobs in Oakwood?',
        time: '18:40',
      },
      {
        id: 'm2-2',
        sender: 'peer',
        text: 'Yes, the induction base works on all hall hobs!',
        time: '19:15',
      },
    ],
  },
  {
    id: 'msg-thread-03',
    peerStudentName: 'Chloe · Eastgate Courts',
    itemTitle: 'Ergonomic Mesh Study Chair',
    lastMessage: 'I can roll it down to the Eastgate lobby whenever you arrive.',
    unreadCount: 0,
    updatedAt: '2026-11-06T16:05:00.000Z',
    messages: [
      {
        id: 'm3-1',
        sender: 'peer',
        text: 'I can roll it down to the Eastgate lobby whenever you arrive.',
        time: '16:05',
      },
    ],
  },
];

export async function fetchConversationThreads(): Promise<ConversationThread[]> {
  return fetchCollectionWithSeed(
    'conversations',
    conversationThreadSchema,
    conversationThreadListSchema,
    SEED_THREADS,
  );
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
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updatedThread: ConversationThread = {
    ...thread,
    lastMessage: validated.text,
    unreadCount: 0,
    updatedAt: now.toISOString(),
    messages: [
      ...thread.messages,
      {
        id: `msg-${Date.now()}`,
        sender: 'me',
        text: validated.text,
        time: timeString,
      },
    ],
  };

  return upsertCollectionDocument(
    'conversations',
    updatedThread,
    conversationThreadSchema,
    conversationThreadListSchema,
    SEED_THREADS,
  );
}
