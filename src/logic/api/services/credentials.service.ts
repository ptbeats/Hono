import { BaseService } from './base.service';
import { CredentialsRequest, CredentialsApiResponse } from '../types';

export class CredentialsService extends BaseService {//继承 BaseService 类
  private readonly basePath = '/devices';

  //配置设备凭证
  async configureCredentials(deviceId: string, credentials: CredentialsRequest): Promise<CredentialsApiResponse> {//构建请求
    const url = this.buildUrl(this.basePath, deviceId, 'credentials');//发送请求
    return this.post<string>(url, credentials);
  }
}

export const credentialsService = new CredentialsService();