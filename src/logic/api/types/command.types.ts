import { ApiResponse } from './common.types';
//定义命令状态枚举
export enum CommandStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
}
//内容
export enum ContentType {
  JSON = 'application/json',
  TEXT = 'text/plain',
  XML = 'application/xml',
  OCTET_STREAM = 'application/octet-stream',//二进制数据
}

//接口定义
export interface CommandRequest {
  commandName: string;
  payload: any;
  contentType?: ContentType;
  timeoutSeconds?: number;
}

export interface CommandResponse {
  deviceId: string;
  commandName: string;
  status: CommandStatus;//状态
}
//结合，返回
export type CommandApiResponse = ApiResponse<CommandResponse>;