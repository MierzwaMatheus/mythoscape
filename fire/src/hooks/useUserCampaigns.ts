import { useEffect, useState } from 'react';
import { ref, get, child } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { database } from '@/lib/firebase';

export interface CampaignMeta {
  id: string;
  campaignName: string;
  system: string;
  summary: string;
  [key: string]: any;
}

export function useUserCampaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    async function fetchCampaigns() {
      try {
        const userCampaignsSnap = await get(ref(database, `users/${user.uid}/campaignsAsPlayer`));
        const campaignIds = userCampaignsSnap.exists() ? Object.keys(userCampaignsSnap.val()) : [];
        const metaPromises = campaignIds.map(async (id) => {
          const metaSnap = await get(ref(database, `campaigns/${id}/metadata`));
          if (metaSnap.exists()) {
            return { id, ...metaSnap.val() };
          }
          return null;
        });
        const metas = (await Promise.all(metaPromises)).filter(Boolean) as CampaignMeta[];
        setCampaigns(metas);
      } catch (err: any) {
        setError('Erro ao buscar campanhas');
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, [user]);

  return { campaigns, loading, error };
} 