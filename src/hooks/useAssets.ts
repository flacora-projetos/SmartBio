import { useState, useEffect, useCallback } from 'react';
import { fetchAssets, createAsset, updateAsset, deleteAsset, type DbAsset, type AssetPayload } from '@/lib/assets';
import { getOrCreateWorkspaceSmartBio } from '@/lib/smartbio-flow';
import { useAuth } from '@/contexts/AuthContext';

export function useAssets() {
  const { tenant } = useAuth();
  const [assets, setAssets] = useState<DbAsset[]>([]);
  const [smartbioId, setSmartbioId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tenant) return;
    try {
      setIsLoading(true);
      setError(null);
      const smartbio = await getOrCreateWorkspaceSmartBio(tenant);
      setSmartbioId(smartbio.id);
      const data = await fetchAssets(smartbio.id);
      setAssets(data);
    } catch {
      setError('Não foi possível carregar os ativos.');
    } finally {
      setIsLoading(false);
    }
  }, [tenant]);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (payload: Omit<AssetPayload, 'smartbio_id'>) => {
    if (!smartbioId) return;
    const nextSort = assets.length > 0 ? Math.max(...assets.map(a => a.sort_order)) + 1 : 0;
    const asset = await createAsset({
      ...payload,
      smartbio_id: smartbioId,
      sort_order: payload.sort_order ?? nextSort,
    });
    setAssets(prev => [...prev, asset]);
  }, [smartbioId, assets]);

  const update = useCallback(async (id: string, payload: Partial<AssetPayload>) => {
    await updateAsset(id, payload);
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...payload } as DbAsset : a));
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteAsset(id);
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  return { assets, smartbioId, isLoading, error, create, update, remove };
}
