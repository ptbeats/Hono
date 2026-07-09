import { ApiResponse, PaginationParams } from './common.types';
//设备接口
export interface Device {
  deviceId: string;
  name: string;
  description?: string;
  enabled: boolean;
  createdAt?: string;
}
//注册请求
export interface DeviceRegistrationRequest {
  deviceId: string;
  name: string;
  description?: string;
  enabled?: boolean;
}
//设备列表响应
export interface DeviceListResponse {
  tenantId: string;
  total: number;
  devices: Device[];
}
export type DeviceQueryParams = PaginationParams;//查询参数
export type DeviceApiResponse = ApiResponse<Device>;//单个设备响应
export type DeviceRegistrationApiResponse = ApiResponse<DeviceRegistrationRequest & { createdAt?: string }>;//设备注册响应
export type DeviceListApiResponse = ApiResponse<DeviceListResponse>;//设备列表响应