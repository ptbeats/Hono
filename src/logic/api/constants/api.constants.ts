export const API_ENDPOINTS = {
  DEVICES: '/devices',
  DEVICE_CREDENTIALS: (deviceId: string) => `/devices/${deviceId}/credentials`,
  DEVICE_COMMANDS: (deviceId: string) => `/devices/${deviceId}/commands`,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  TEXT: 'text/plain',
} as const;

export const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  DEVICE_ALREADY_EXISTS: 'DEVICE_ALREADY_EXISTS',
  CREDENTIALS_INVALID: 'CREDENTIALS_INVALID',
  COMMAND_FAILED: 'COMMAND_FAILED',
} as const;