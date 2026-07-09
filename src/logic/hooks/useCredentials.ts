import { useState, useCallback } from 'react';
import { credentialsService } from '../api/services';

export const useCredentials = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configureCredentials = useCallback(async (deviceId: string, authId: string, password: string) => {
    setLoading(true);
    setError(null);
    try {// 调用API配置凭证
      const response = await credentialsService.configureCredentials(deviceId, { authId, password });
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || '配置凭证失败');
    } catch (err: any) {
      setError(err.message || '配置凭证失败');// 捕获错误并设置错误状态，提供给 UI展示
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);//为空确保函数引用稳定
//返回接口
  return {
    loading,
    error,
    configureCredentials,
  };
};