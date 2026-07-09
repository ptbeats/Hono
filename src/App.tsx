// src/App.tsx
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DeviceRegister from './Pages/DeviceRegister';
import CredentialManage from './Pages/CredentialManage';
import CommandDispatch from './Pages/CommandDispatch';
import { useDevices, useCredentials, useCommands } from './logic';
import { Device } from './logic/api/types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('device-register');

  const { 
    devices, 
    loading, 
    error, 
    fetchDevices, 
    registerDevice
  } = useDevices();

  const { configureCredentials } = useCredentials();
  const { sendCommand } = useCommands();

  useEffect(() => {
    fetchDevices({ page: 0, size: 20 });
  }, []);  // 只在挂载时执行一次

  // 1. 注册设备
  const handleAddDevice = async (device: Omit<Device, 'createdAt'>) => {
    try {
      await registerDevice(device);
      alert('设备注册成功');
      // 注册成功后刷新列表（回到第一页）
      await fetchDevices({ page: 0, size: 20 });
    } catch (err: any) {
      // 错误已由 Hook 处理（存入 error 状态）
      alert(err.message || '注册失败');
    }
  };

  // 2. 配置凭证
  const handleConfigureCredential = async (deviceId: string, authId: string, password: string) => {
    try {
      await configureCredentials(deviceId, authId, password);
      alert('凭证配置成功');
    } catch (err: any) {
      alert(err.message || '配置凭证失败');
    }
  };

  // 3. 下发命令
  const handleDispatchCommand = async (
    deviceId: string,
    commandName: string,
    payload: object,
    timeoutSeconds: number = 10
  ) => {
    try {
      await sendCommand(deviceId, { commandName, payload, timeoutSeconds });
      alert('命令下发成功');
    } catch (err: any) {
      alert(err.message || '下发命令失败');
    }
  };

  // ---------- 页面渲染 ----------
  const renderPage = () => {
    switch (currentPage) {
      case 'device-register':
        return <DeviceRegister devices={devices} onAddDevice={handleAddDevice} />;
      case 'credential-manage':
        return <CredentialManage devices={devices} onConfigureCredential={handleConfigureCredential} />;
      case 'command-dispatch':
        return <CommandDispatch devices={devices} onDispatchCommand={handleDispatchCommand} />;
      default:
        return <DeviceRegister devices={devices} onAddDevice={handleAddDevice} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onMenuClick={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;