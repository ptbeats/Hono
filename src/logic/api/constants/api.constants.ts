//集中管理API相关的常量
export const API_ENDPOINTS = {
  DEVICES: '/devices',//基础设备管理接口
  DEVICE_CREDENTIALS: (deviceId: string) => `/devices/${deviceId}/credentials`,//管理设备凭证的接口
  DEVICE_COMMANDS: (deviceId: string) => `/devices/${deviceId}/commands`,//管理设备命令的接口
} as const;
//定义HTTP状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,//认证但没有权限
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
//请求和响应声明
export const CONTENT_TYPES = {
  JSON: 'application/json',
  TEXT: 'text/plain',
} as const;
//定义业务错误码常量
export const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',//网络失败
  TIMEOUT: 'TIMEOUT',
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  DEVICE_ALREADY_EXISTS: 'DEVICE_ALREADY_EXISTS',
  CREDENTIALS_INVALID: 'CREDENTIALS_INVALID',//无效
  COMMAND_FAILED: 'COMMAND_FAILED',//失败
} as const;