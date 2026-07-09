import { BaseService } from './base.service';
import { CommandRequest, CommandResponse, CommandApiResponse } from '../types';

export class CommandService extends BaseService {//继承 BaseService 类
  private readonly basePath = '/devices';

  // 下发命令
  async sendCommand(deviceId: string, command: CommandRequest): Promise<CommandApiResponse> {
    const url = this.buildUrl(this.basePath, deviceId, 'commands');//发送请求
    return this.post<CommandResponse>(url, command);//post
  }
}
//导出
export const commandService = new CommandService();