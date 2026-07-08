import { BaseService } from './base.service';
import { CredentialsRequest, CredentialsApiResponse } from '../types';

export class CredentialsService extends BaseService {
  private readonly basePath = '/devices';

  // 2. 配置设备凭证
  async configureCredentials(deviceId: string, credentials: CredentialsRequest): Promise<CredentialsApiResponse> {
    const url = this.buildUrl(this.basePath, deviceId, 'credentials');
    return this.post<string>(url, credentials);
  }
}

export const credentialsService = new CredentialsService();