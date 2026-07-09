import { create } from "zustand";

export interface Attachment {
  name: string;
  url: string;
  type: "image" | "file";
  size?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // usernames
}

export interface Message {
  id: string;
  author: {
    username: string;
    name: string;
    avatar?: string;
  };
  body: string;
  timestamp: string; // ISO string
  attachments?: Attachment[];
  reactions?: Reaction[];
  isPending?: boolean;
  isPinned?: boolean;
  isSaved?: boolean;
  isEdited?: boolean;
}

interface MessageState {
  messages: Record<string, Message[]>; // Keyed by channelId or dmId
  replies: Record<string, Message[]>; // Keyed by parentMessageId
  sendMessage: (
    chatId: string,
    author: { username: string; name: string; avatar?: string },
    body: string,
    attachments?: Attachment[]
  ) => void;
  sendReply: (
    parentMessageId: string,
    author: { username: string; name: string; avatar?: string },
    body: string,
    attachments?: Attachment[]
  ) => void;
  toggleReaction: (chatId: string, messageId: string, emoji: string, username: string) => void;
  togglePinMessage: (chatId: string, messageId: string) => void;
  toggleSaveMessage: (chatId: string, messageId: string) => void;
  editMessage: (chatId: string, messageId: string, newBody: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
}

// Helper to toggle reactions on a message object
const toggleMsgReaction = (msg: Message, emoji: string, username: string): Message => {
  const currentReactions = msg.reactions || [];
  const existingReaction = currentReactions.find((r) => r.emoji === emoji);

  if (!existingReaction) {
    return {
      ...msg,
      reactions: [...currentReactions, { emoji, count: 1, users: [username] }],
    };
  }

  let newReactions;
  if (existingReaction.users.includes(username)) {
    newReactions = currentReactions
      .map((r) => {
        if (r.emoji !== emoji) return r;
        return {
          ...r,
          count: r.count - 1,
          users: r.users.filter((u) => u !== username),
        };
      })
      .filter((r) => r.count > 0);
  } else {
    newReactions = currentReactions.map((r) => {
      if (r.emoji !== emoji) return r;
      return {
        ...r,
        count: r.count + 1,
        users: [...r.users, username],
      };
    });
  }

  return { ...msg, reactions: newReactions };
};

// Generate ISO timestamps relative to now
const timeAgo = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};

export const useMessageStore = create<MessageState>((set) => ({
  messages: {
    general: [
      {
        id: "gen-1",
        author: { username: "alice_w", name: "Alice Wood" },
        body: "Hey team! Welcome to the new workspace. This is the **#general** channel.",
        timestamp: timeAgo(120),
        reactions: [{ emoji: "👋", count: 2, users: ["bob_smith", "user"] }],
      },
      {
        id: "gen-2",
        author: { username: "bob_smith", name: "Bob Smith" },
        body: "Glad to be here! The interface looks incredibly clean and responsive.",
        timestamp: timeAgo(115),
      },
      {
        id: "gen-3",
        author: { username: "bob_smith", name: "Bob Smith" },
        body: "Does anyone have the latest PDF design specifications for the .NET API integration? I'd like to read it over.",
        timestamp: timeAgo(114),
      },
      {
        id: "gen-4",
        author: { username: "alice_w", name: "Alice Wood" },
        body: "Yes, I got it! Here is the design spec file we will be coding in the upcoming phases.",
        timestamp: timeAgo(110),
        attachments: [
          {
            name: "timeslack_backend_architecture.pdf",
            url: "#",
            type: "file",
            size: "1.2 MB",
          },
        ],
      },
    ],
    random: [
      {
        id: "rand-1",
        author: { username: "bob_smith", name: "Bob Smith" },
        body: "Check out this awesome space animation! Let's keep things casual here.",
        timestamp: timeAgo(180),
      },
    ],
    announcements: [
      {
        id: "ann-1",
        author: { username: "alice_w", name: "Alice Wood" },
        body: "Please note that all team sync calls are scheduled for Mondays at 9:00 AM EST.",
        timestamp: timeAgo(240),
      },
    ],
    "ai-bot": [
      {
        id: "ai-1",
        author: { username: "ai-bot", name: "AI Assistant" },
        body: "Hello! I am your workspace **AI Assistant**. How can I help you today? You can ask me to write code, design schemas, or help draft messages.",
        timestamp: timeAgo(10),
      },
    ],
    alice: [
      {
        id: "ali-1",
        author: { username: "alice_w", name: "Alice Wood" },
        body: "Hey, let know when you are free for a quick pair-programming sync today.",
        timestamp: timeAgo(45),
      },
    ],
  },

  replies: {
    "gen-4": [
      {
        id: "rep-1",
        author: { username: "bob_smith", name: "Bob Smith" },
        body: "Wow, thanks Alice! That was exactly what I needed to read.",
        timestamp: timeAgo(100),
        reactions: [{ emoji: "🚀", count: 1, users: ["alice_w"] }],
      },
      {
        id: "rep-2",
        author: { username: "user", name: "User" },
        body: "Checking the spec out now, looks super solid.",
        timestamp: timeAgo(95),
      },
    ],
  },

  sendMessage: (chatId, author, body, attachments) => {
    const messageId = `msg-${Math.random().toString(36).substr(2, 9)}`;
    const pendingMessage: Message = {
      id: messageId,
      author,
      body,
      timestamp: new Date().toISOString(),
      attachments,
      isPending: true,
    };

    set((state) => {
      const currentList = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...currentList, pendingMessage],
        },
      };
    });

    setTimeout(() => {
      set((state) => {
        const currentList = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: currentList.map((m) =>
              m.id === messageId ? { ...m, isPending: false } : m
            ),
          },
        };
      });
    }, 400);
  },

  sendReply: (parentMessageId, author, body, attachments) => {
    const replyId = `rep-${Math.random().toString(36).substr(2, 9)}`;
    const pendingReply: Message = {
      id: replyId,
      author,
      body,
      timestamp: new Date().toISOString(),
      attachments,
      isPending: true,
    };

    set((state) => {
      const currentList = state.replies[parentMessageId] || [];
      return {
        replies: {
          ...state.replies,
          [parentMessageId]: [...currentList, pendingReply],
        },
      };
    });

    setTimeout(() => {
      set((state) => {
        const currentList = state.replies[parentMessageId] || [];
        return {
          replies: {
            ...state.replies,
            [parentMessageId]: currentList.map((r) =>
              r.id === replyId ? { ...r, isPending: false } : r
            ),
          },
        };
      });
    }, 400);
  },

  toggleReaction: (chatId, messageId, emoji, username) => {
    set((state) => {
      // 1. Try to toggle inside messages
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.map((msg) => {
        if (msg.id !== messageId) return msg;
        return toggleMsgReaction(msg, emoji, username);
      });

      // 2. Try to toggle inside replies
      const updatedReplies = { ...state.replies };
      let replyParentKey: string | null = null;
      for (const parentId in state.replies) {
        if (state.replies[parentId].some((r) => r.id === messageId)) {
          replyParentKey = parentId;
          break;
        }
      }

      if (replyParentKey) {
        updatedReplies[replyParentKey] = state.replies[replyParentKey].map((r) => {
          if (r.id !== messageId) return r;
          return toggleMsgReaction(r, emoji, username);
        });
      }

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
        replies: updatedReplies,
      };
    });
  },

  togglePinMessage: (chatId, messageId) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.map((msg) => {
        if (msg.id !== messageId) return msg;
        return { ...msg, isPinned: !msg.isPinned };
      });

      const updatedReplies = { ...state.replies };
      let replyParentKey: string | null = null;
      for (const parentId in state.replies) {
        if (state.replies[parentId].some((r) => r.id === messageId)) {
          replyParentKey = parentId;
          break;
        }
      }

      if (replyParentKey) {
        updatedReplies[replyParentKey] = state.replies[replyParentKey].map((r) => {
          if (r.id !== messageId) return r;
          return { ...r, isPinned: !r.isPinned };
        });
      }

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
        replies: updatedReplies,
      };
    });
  },

  toggleSaveMessage: (chatId, messageId) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.map((msg) => {
        if (msg.id !== messageId) return msg;
        return { ...msg, isSaved: !msg.isSaved };
      });

      const updatedReplies = { ...state.replies };
      let replyParentKey: string | null = null;
      for (const parentId in state.replies) {
        if (state.replies[parentId].some((r) => r.id === messageId)) {
          replyParentKey = parentId;
          break;
        }
      }

      if (replyParentKey) {
        updatedReplies[replyParentKey] = state.replies[replyParentKey].map((r) => {
          if (r.id !== messageId) return r;
          return { ...r, isSaved: !r.isSaved };
        });
      }

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
        replies: updatedReplies,
      };
    });
  },

  editMessage: (chatId, messageId, newBody) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.map((msg) => {
        if (msg.id !== messageId) return msg;
        return { ...msg, body: newBody, isEdited: true };
      });

      const updatedReplies = { ...state.replies };
      let replyParentKey: string | null = null;
      for (const parentId in state.replies) {
        if (state.replies[parentId].some((r) => r.id === messageId)) {
          replyParentKey = parentId;
          break;
        }
      }

      if (replyParentKey) {
        updatedReplies[replyParentKey] = state.replies[replyParentKey].map((r) => {
          if (r.id !== messageId) return r;
          return { ...r, body: newBody, isEdited: true };
        });
      }

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
        replies: updatedReplies,
      };
    });
  },

  deleteMessage: (chatId, messageId) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.filter((msg) => msg.id !== messageId);

      const updatedReplies = { ...state.replies };
      for (const parentId in state.replies) {
        if (state.replies[parentId].some((r) => r.id === messageId)) {
          updatedReplies[parentId] = state.replies[parentId].filter((r) => r.id !== messageId);
        }
      }

      if (updatedReplies[messageId]) {
        delete updatedReplies[messageId];
      }

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
        replies: updatedReplies,
      };
    });
  },
}));
