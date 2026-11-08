export interface ChatMessageItem {
  readonly id: string;
  readonly sender: 'peer' | 'me';
  readonly text: string;
  readonly time: string;
}

export interface ConversationThread {
  readonly id: string;
  readonly peerStudentName: string;
  readonly itemTitle: string;
  readonly lastMessage: string;
  readonly unreadCount: number;
  readonly updatedAt: string;
  readonly messages: readonly ChatMessageItem[];
}
