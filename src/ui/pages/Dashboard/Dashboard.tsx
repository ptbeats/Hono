import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { StatCard } from '../../components/Dashboard/StatCard';
import { DeviceList } from '../../components/DeviceList/DeviceList';
import { DeviceRegister } from '../../components/DeviceRegister/DeviceRegister';
import { CredentialsConfig } from '../../components/CredentialsConfig/CredentialsConfig';
import { CommandSender } from '../../components/CommandSender/CommandSender';
import { useDevices } from '../../../logic/hooks/useDevices';
import './Dashboard.css';

type TabType = 'dashboard' | 'devices' | 'register' | 'credentials' | 'commands';

const getPageTitle = (tab: TabType): string => {
  const titles: Record<TabType, string> = {
    dashboard: '仪表盘',
    devices: '设备管理',
    register: '注册设备',
    credentials: '凭证管理',
    commands: '命令下发',
  };
  return titles[tab] || '仪表盘';
};

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { devices, loading, fetchDevices } = useDevices();
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    active: 0,
  });

  useEffect(() => {
    fetchDevices({ page: 0, size: 100 });
  }, [fetchDevices]);

  useEffect(() => {
    if (devices && devices.length > 0) {
      const online = devices.filter(d => d.enabled).length;
      const offline = devices.filter(d => !d.enabled).length;
      setStats({
        total: devices.length,
        online,
        offline,
        active: Math.round((online / devices.length) * 100) || 0,
      });
    }
  }, [devices]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <StatCard 
                title="设备总数" 
                value={stats.total} 
                icon="📱" 
                color="primary"
                trend={{ value: 12, isUp: true }}
              />
              <StatCard 
                title="在线设备" 
                value={stats.online} 
                icon="🟢" 
                color="success"
                trend={{ value: 8, isUp: true }}
              />
              <StatCard 
                title="离线设备" 
                value={stats.offline} 
                icon="🔴" 
                color="danger"
                trend={{ value: 5, isUp: false }}
              />
              <StatCard 
                title="活跃率" 
                value={`${stats.active}%`} 
                icon="📊" 
                color="info"
                trend={{ value: 3, isUp: true }}
              />
            </div>
            
            <div className="dashboard-devices">
              <div className="section-header">
                <h2>设备列表</h2>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => setActiveTab('devices')}
                >
                  查看全部 →
                </button>
              </div>
              <DeviceList />
            </div>
          </div>
        );
      case 'devices':
        return <DeviceList />;
      case 'register':
        return <DeviceRegister />;
      case 'credentials':
        return <CredentialsConfig />;
      case 'commands':
        return <CommandSender />;
      default:
        return <DeviceList />;
    }
  };

  if (loading && activeTab === 'dashboard') {
    return (
      <Layout 
        activeTab={activeTab} 
        onTabChange={(tab: string) => setActiveTab(tab as TabType)}
        pageTitle={getPageTitle(activeTab)}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={(tab: string) => setActiveTab(tab as TabType)}
      pageTitle={getPageTitle(activeTab)}
    >
      {renderContent()}
    </Layout>
  );
};