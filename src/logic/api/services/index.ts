//导入
import { BaseService } from './base.service';
import { DeviceService, deviceService } from './device.service';
import { CredentialsService, credentialsService } from './credentials.service';
import { CommandService, commandService } from './command.service';
//导出
export { BaseService } from './base.service';
export { DeviceService } from './device.service';
export { CredentialsService } from './credentials.service';
export { CommandService } from './command.service';
export { deviceService, credentialsService, commandService };
// 导出所有服务的集合
export const services = {
  device: deviceService,
  credentials: credentialsService,
  command: commandService,
};