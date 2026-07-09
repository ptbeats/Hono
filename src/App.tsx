// src/App.tsx
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DeviceRegister from './Pages/DeviceRegister';
import CredentialManage from './Pages/CredentialManage';
import CommandDispatch from './Pages/CommandDispatch';
import { Device } from './data';
import { getDevices, registerDevice, configureCredential, dispatchCommand } from './api';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('device-register');
  const [devices, setDevices] = useState<Device[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPageNum, setCurrentPageNum] = useState(0);
  const [loading, setLoading] = useState(false);

  // 加载设备列表
  const loadDevices = async (page: number = 0, size: number = 20) => {
    setLoading(true);
    try {
      const res = await getDevices(page, size);
      if (res.data.success) {
        setDevices(res.data.data.devices);
        setTotal(res.data.data.total);
        setCurrentPageNum(page);
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      alert('加载设备列表失败：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices(0, 20);
  }, []);

  // 注册设备
  const addDevice = async (device: Omit<Device, 'createdAt'>) => {
    try {
      const res = await registerDevice(device);
      if (res.data.success) {
        alert(res.data.message);
        await loadDevices(0, 20);
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      alert('注册失败：' + err.message);
    }
  };

  // 配置凭证
  const handleConfigureCredential = async (deviceId: string, authId: string, password: string) => {
    try {
      const res = await configureCredential(deviceId, authId, password);
      if (res.data.success) {
        alert(res.data.message);
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      alert('配置凭证失败：' + err.message);
    }
  };

  // 下发命令
  const handleDispatchCommand = async (
    deviceId: string,
    commandName: string,
    payload: object,
    timeoutSeconds: number = 10
  ) => {
    try {
      const res = await dispatchCommand(deviceId, commandName, payload, 'application/json', timeoutSeconds);
      if (res.data.success) {
        alert(`命令下发成功：${res.data.message}`);
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      alert('下发命令失败：' + err.message);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'device-register':
        return <DeviceRegister devices={devices} onAddDevice={addDevice} />;
      case 'credential-manage':
        return <CredentialManage devices={devices} onConfigureCredential={handleConfigureCredential} />;
      case 'command-dispatch':
        return <CommandDispatch devices={devices} onDispatchCommand={handleDispatchCommand} />;
      default:
        return <DeviceRegister devices={devices} onAddDevice={addDevice} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onMenuClick={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;