import { ApiResponse } from './common.types';

export enum CommandStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
}

export enum ContentType {
  JSON = 'application/json',
  TEXT = 'text/plain',
  XML = 'application/xml',
  OCTET_STREAM = 'application/octet-stream',
}

export interface CommandRequest {
  commandName: string;
  payload: any;
  contentType?: ContentType;
  timeoutSeconds?: number;
}

export interface CommandResponse {
  deviceId: string;
  commandName: string;
  status: CommandStatus;
}

export type CommandApiResponse = ApiResponse<CommandResponse>;