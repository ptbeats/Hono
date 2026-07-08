// src/api/services/device.service.ts
import { BaseService } from './base.service';
import {
  DeviceRegistrationRequest,
  DeviceListResponse,
  DeviceQueryParams,
  DeviceRegistrationApiResponse,
  DeviceListApiResponse,
} from '../types';

export class DeviceService extends BaseService {
  private readonly basePath = '/devices';

  async registerDevice(data: DeviceRegistrationRequest): Promise<DeviceRegistrationApiResponse> {
    return this.post<DeviceRegistrationRequest & { createdAt?: string }>(this.basePath, data);
  }

  async getDevices(params?: DeviceQueryParams): Promise<DeviceListApiResponse> {
    return this.get<DeviceListResponse>(this.basePath, params);
  }
}

export const deviceService = new DeviceService();