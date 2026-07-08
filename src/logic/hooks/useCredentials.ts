import { useState, useCallback } from 'react';
import { credentialsService } from '../api/services';

export const useCredentials = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configureCredentials = useCallback(async (deviceId: string, authId: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await credentialsService.configureCredentials(deviceId, { authId, password });
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || '配置凭证失败');
    } catch (err: any) {
      setError(err.message || '配置凭证失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    configureCredentials,
  };
};