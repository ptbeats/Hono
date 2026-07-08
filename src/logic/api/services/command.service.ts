import { BaseService } from './base.service';
import { CommandRequest, CommandResponse, CommandApiResponse } from '../types';

export class CommandService extends BaseService {
  private readonly basePath = '/devices';

  // 4. 下发命令
  async sendCommand(deviceId: string, command: CommandRequest): Promise<CommandApiResponse> {
    const url = this.buildUrl(this.basePath, deviceId, 'commands');
    return this.post<CommandResponse>(url, command);
  }
}

export const commandService = new CommandService();