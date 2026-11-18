import { z } from 'zod';

export const chatMessageItemSchema = z.object({
  id: z.string().min(1),
  sender: z.enum(['peer', 'me']),
  text: z.string().min(1),
  time: z.string().min(1),
});

export const conversationThreadSchema = z.object({
  id: z.string().min(1),
  participantIds: z.array(z.string().min(1)).min(1).max(5),
  peerStudentName: z.string().min(1).max(120),
  itemTitle: z.string().min(1).max(160),
  lastMessage: z.string().min(1).max(500),
  unreadCount: z.number().int().nonnegative(),
  updatedAt: z.string().min(1),
  messages: z.array(chatMessageItemSchema).max(200),
});

export const sendMessageInputSchema = z.object({
  threadId: z.string().min(1),
  text: z.string().trim().min(1, 'Message cannot be empty').max(500, 'Message is too long'),
});
