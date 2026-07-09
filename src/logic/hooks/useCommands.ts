import { useState, useCallback } from 'react';
import { commandService } from '../api/services';
import { CommandRequest } from '../api/types';
//定义hook进行封装
export const useCommands = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 下发命令
  const sendCommand = useCallback(async (deviceId: string, command: CommandRequest) => {
    setLoading(true);//设置为true
    setError(null);//清空错误信息
    try {
      const response = await commandService.sendCommand(deviceId, command);//调用commandService的sendCommand方法发送命令
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