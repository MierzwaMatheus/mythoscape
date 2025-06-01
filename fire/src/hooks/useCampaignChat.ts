import { useEffect, useState, useCallback } from 'react';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  htmlContent?: string;
  timestamp: number;
}

export function useCampaignChat(campaignId: string | undefined) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    const chatRef = ref(database, `campaigns/${campaignId}/history/chat`);
    const unsubscribe = onValue(chatRef, (snap) => {
      const msgs: ChatMessage[] = [];
      snap.forEach((child) => {
        const val = child.val();
        msgs.push({
          id: child.key!,
          userId: val.userId,
          content: val.content,
          htmlContent: val.htmlContent,
          timestamp: val.timestamp || 0
        });
      });
      setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [campaignId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user || !campaignId) return;
    const msgRef = push(ref(database, `campaigns/${campaignId}/history`));
    await set(msgRef, {
      userId: user.uid,
      content,
      timestamp: Date.now()
    });
  }, [user, campaignId]);

  return { messages, loading, sendMessage };
} 