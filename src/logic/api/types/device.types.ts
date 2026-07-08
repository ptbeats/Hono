import { ApiResponse, PaginationParams } from './common.types';

export interface Device {
  deviceId: string;
  name: string;
  description?: string;
  enabled: boolean;
  createdAt?: string;
}

export interface DeviceRegistrationRequest {
  deviceId: string;
  name: string;
  description?: string;
  enabled?: boolean;
}

export interface DeviceListResponse {
  tenantId: string;
  total: number;
  devices: Device[];
}

export type DeviceQueryParams = PaginationParams;

export type DeviceApiResponse = ApiResponse<Device>;
export type DeviceRegistrationApiResponse = ApiResponse<DeviceRegistrationRequest & { createdAt?: string }>;
export type DeviceListApiResponse = ApiResponse<DeviceListResponse>;