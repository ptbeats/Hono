// src/data.ts

// 设备类型（与 API 一致）
export interface Device {
  deviceId: string;
  name: string;
  description?: string;
  enabled: boolean;
  createdAt?: string;
}

// 凭证配置（仅用于前端表单）
export interface CredentialForm {
  authId: string;
  password: string;
}

// 命令下发表单
export interface CommandForm {
  commandName: string;
  payload: Record<string, any>;
  timeoutSeconds?: number;
}

// 状态映射（用于显示 enabled），使用 Record 支持字符串索引
export const enabledStatusMap: Record<string, { label: string; cls: string }> = {
  true: { label: '启用', cls: 'status-active' },
  false: { label: '禁用', cls: 'status-inactive' },
};