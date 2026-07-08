import { useState, useCallback } from 'react';
import { commandService } from '../api/services';
import { CommandRequest } from '../api/types';

export const useCommands = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 下发命令
  const sendCommand = useCallback(async (deviceId: string, command: CommandRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commandService.sendCommand(deviceId, command);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || '发送命令失败');
    } catch (err: any) {
      setError(err.message || '发送命令失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    sendCommand,
  };
};