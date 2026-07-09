import { useState, useCallback } from 'react';
import { deviceService } from '../api/services';
import { Device, DeviceQueryParams, DeviceRegistrationRequest, DeviceListResponse } from '../api/types';

export const useDevices = () => {
  const [loading, setLoading] = useState(false);// 加载状态
  const [devices, setDevices] = useState<Device[]>([]);// 设备列表
  const [total, setTotal] = useState(0);
  const [tenantId, setTenantId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async (params?: DeviceQueryParams) => {// 设置加载状态和清除错误
    setLoading(true);
    setError(null);
    try {// 调用API获取设备列表
      const response = await deviceService.getDevices(params);
      if (response.success && response.data) {
        setDevices(response.data.devices || []);// 设置设备列表
        setTotal(response.data.total || 0);// 设置设备总数
        setTenantId(response.data.tenantId || '');// 设置设备列表、总数和租户ID
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
      const response = await deviceService.registerDevice(data);// 调用API注册设备
      if (response.success) {
        await fetchDevices();// 注册成功后刷新设备列表
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