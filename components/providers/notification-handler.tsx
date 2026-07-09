"use client";

import { useEffect, useRef } from "react";
import { useMessageStore } from "@/hooks/use-message-store";
import { useNotificationStore } from "@/hooks/use-notification-store";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

export function NotificationHandler() {
  const router = useRouter();
  const params = useParams();
  const activeWorkspaceId = params?.workspaceId as string || "default";
  const activeChannelId = params?.channelId as string;
  const activeDmId = params?.conversationId as string;

  const { soundEnabled, bannerEnabled, desktopEnabled } = useNotificationStore();
  const messages = useMessageStore((state) => state.messages);

  const prevCountsRef = useRef<Record<string, number>>({});

  // Initial populate counts
  useEffect(() => {
    Object.keys(messages).forEach((chatId) => {
      prevCountsRef.current[chatId] = messages[chatId].length;
    });
  }, []);

  useEffect(() => {
    const unsubscribe = useMessageStore.subscribe((state) => {
      const currentMessages = state.messages;
      Object.keys(currentMessages).forEach((chatId) => {
        const prevCount = prevCountsRef.current[chatId] || 0;
        const currentCount = currentMessages[chatId]?.length || 0;

        if (currentCount > prevCount) {
          const newMsg = currentMessages[chatId][currentCount - 1];
          const isUserOwn = newMsg?.author?.username === "user";
          const isActiveView = activeChannelId === chatId || activeDmId === chatId;

          // Alert only if it's a background message (not actively viewing, not own message)
          if (newMsg && !isUserOwn && !isActiveView) {
            // Determine type and label
            const isChannel = ["general", "random", "announcements"].includes(chatId);
            const targetLabel = isChannel ? `#${chatId}` : `@${newMsg.author.name}`;
            const path = isChannel
              ? `/workspace/${activeWorkspaceId}/channel/${chatId}`
              : `/workspace/${activeWorkspaceId}/dm/${chatId}`;

            // 1. Play sound alert
            if (soundEnabled) {
              try {
                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav");
                audio.volume = 0.35;
                audio.play();
              } catch (err) {
                console.warn("Audio play blocked or unavailable: ", err);
              }
            }

            // 2. Desktop notification popup
            if (desktopEnabled && typeof window !== "undefined" && "Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification(`New message in ${targetLabel}`, {
                  body: `${newMsg.author.name}: ${newMsg.body.replace(/\*\*|__/g, "")}`,
                  icon: newMsg.author.avatar || "/favicon.ico",
                });
              }
            }

            // 3. sonner banner toast alert
            if (bannerEnabled) {
              toast(`New message in ${targetLabel}`, {
                description: `${newMsg.author.name}: ${newMsg.body.replace(/\*\*|__/g, "")}`,
                action: {
                  label: "Jump",
                  onClick: () => router.push(path),
                },
              });
            }
          }
        }
        prevCountsRef.current[chatId] = currentCount;
      });
    });

    return () => unsubscribe();
  }, [activeChannelId, activeDmId, activeWorkspaceId, soundEnabled, bannerEnabled, desktopEnabled]);

  return null;
}
