import { useEffect } from "react";
import { useMessageStore } from "@/hooks/use-message-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { useParams } from "next/navigation";

export function useNotificationSimulator() {
  const { sendMessage } = useMessageStore();
  const { markChannelUnread, markDmUnread } = useWorkspaceStore();
  const params = useParams();

  const activeChannelId = params?.channelId as string;
  const activeDmId = params?.conversationId as string;

  useEffect(() => {
    // Simulate background Alice message in announcements after 12 seconds
    const announcementsTimer = setTimeout(() => {
      const targetId = "announcements";
      
      if (activeChannelId !== targetId) {
        markChannelUnread(targetId);
      }
      
      sendMessage(
        targetId,
        { username: "alice_w", name: "Alice Wood" },
        "Hi team! Just a quick reminder to post your progress reports in the project-board by the end of today. 👍"
      );
    }, 12000);

    // Simulate background Bob message in direct messages after 30 seconds
    const dmTimer = setTimeout(() => {
      const targetId = "bob";
      
      if (activeDmId !== targetId) {
        markDmUnread(targetId);
      }

      sendMessage(
        targetId,
        { username: "bob_smith", name: "Bob Smith" },
        "Hey! Did you have a chance to look over the new PDF design guidelines Alice uploaded in #general? Let me know."
      );
    }, 30000);

    return () => {
      clearTimeout(announcementsTimer);
      clearTimeout(dmTimer);
    };
  }, [sendMessage, markChannelUnread, markDmUnread, activeChannelId, activeDmId]);
}
