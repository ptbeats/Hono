// src/api.ts
import axios from 'axios';

// 使用模拟数据（可随时切换回真实接口）
const USE_MOCK = true; // 设为 false 则调用真实后端

// ----- 类型定义 -----
export interface Device {
  deviceId: string;
  name: string;
  description?: string;
  enabled: boolean;
  createdAt?: string;
}

// ----- 模拟数据 -----
const mockDevices: Device[] = [
  { deviceId: 'sensor-001', name: '温度传感器', description: '3号楼机房', enabled: true, createdAt: '2026-07-01T10:00:00' },
  { deviceId: 'sensor-002', name: '湿度传感器', description: '实验室A', enabled: true, createdAt: '2026-07-02T11:00:00' },
  { deviceId: 'gateway-001', name: '智能网关', description: '主控室', enabled: false, createdAt: '2026-07-03T09:00:00' },
  { deviceId: 'camera-001', name: '监控摄像头', description: '门口', enabled: true, createdAt: '2026-07-04T14:00:00' },
];

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 1. 注册设备
export const registerDevice = async (device: Omit<Device, 'createdAt'>) => {
  if (USE_MOCK) {
    await delay(500);
    const exists = mockDevices.some(d => d.deviceId === device.deviceId);
    if (exists) {
      return { data: { success: false, message: '设备已存在', data: null } };
    }
    const newDevice: Device = { ...device, createdAt: new Date().toISOString() };
    mockDevices.push(newDevice);
    return { data: { success: true, message: '设备注册成功', data: newDevice } };
  } else {
    return axios.post('/api/devices', device);
  }
};

// 2. 配置凭证
export const configureCredential = async (deviceId: string, authId: string, password: string) => {
  if (USE_MOCK) {
    await delay(500);
    const exists = mockDevices.some(d => d.deviceId === deviceId);
    if (!exists) {
      return { data: { success: false, message: `设备不存在: ${deviceId}`, data: null } };
    }
    return { data: { success: true, message: '设备凭证配置成功', data: deviceId } };
  } else {
    return axios.post(`/api/devices/${deviceId}/credentials`, { authId, password });
  }
};

// 3. 获取设备列表（分页）
export const getDevices = async (page: number = 0, size: number = 20) => {
  if (USE_MOCK) {
    await delay(300);
    const start = page * size;
    const end = start + size;
    const paged = mockDevices.slice(start, end);
    return {
      data: {
        success: true,
        message: '查询成功',
        data: {
          tenantId: 'DEFAULT_TENANT',
          total: mockDevices.length,
          devices: paged,
        },
      },
    };
  } else {
    return axios.get(`/api/devices?page=${page}&size=${size}`);
  }
};

// 4. 下发命令（模拟）
export const dispatchCommand = async (
  deviceId: string,
  commandName: string,
  payload: object,
  contentType: string = 'application/json',
  timeoutSeconds: number = 10
) => {
  if (USE_MOCK) {
    await delay(600);
    const device = mockDevices.find(d => d.deviceId === deviceId);
    if (!device) {
      return { data: { success: false, message: `设备不存在: ${deviceId}`, data: null } };
    }
    // 模拟命令发送成功
    return {
      data: {
        success: true,
        message: '命令下发请求已提交',
        data: { deviceId, commandName, status: 'SENT' },
      },
    };
  } else {
    return axios.post(`/api/devices/${deviceId}/commands`, { commandName, payload, contentType, timeoutSeconds });
  }
};