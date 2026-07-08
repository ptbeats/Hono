import { useState, useCallback } from 'react';
import { deviceService } from '../api/services';
import { Device, DeviceQueryParams, DeviceRegistrationRequest, DeviceListResponse } from '../api/types';

export const useDevices = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [total, setTotal] = useState(0);
  const [tenantId, setTenantId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async (params?: DeviceQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deviceService.getDevices(params);
      if (response.success && response.data) {
        setDevices(response.data.devices || []);
        setTotal(response.data.total || 0);
        setTenantId(response.data.tenantId || '');
        return response.data;
      }
      throw new Error(response.message || '获取设备列表失败');
    } catch (err: any) {
      setError(err.message || '获取设备列表失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerDevice = useCallback(async (data: DeviceRegistrationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deviceService.registerDevice(data);
      if (response.success) {
        await fetchDevices();
        return response.data;
      }
      throw new Error(response.message || '注册设备失败');
    } catch (err: any) {
      setError(err.message || '注册设备失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDevices]);

  return {
    devices,
    total,
    tenantId,
    loading,
    error,
    fetchDevices,
    registerDevice,
  };
};