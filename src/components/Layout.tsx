// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  currentPage: string;
  onMenuClick: (page: string) => void;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentPage, onMenuClick, children }) => {
  const menuItems = [
    { key: 'device-register', label: '设备管理' },
    { key: 'credential-manage', label: '凭证管理' },
    { key: 'command-dispatch', label: '命令下发' },
  ];

  const pageTitleMap: Record<string, string> = {
    'device-register': '设备管理',
    'credential-manage': '凭证管理',
    'command-dispatch': '命令下发',
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo"> <span>设备信息</span></div>
        <nav className="sidebar-menu">
          <div className="menu-group-title">设备中心</div>
          {menuItems.map(item => (
            <div
              key={item.key}
              className={`menu-item ${currentPage === item.key ? 'active' : ''}`}
              onClick={() => onMenuClick(item.key)}
            >
              <span>{item.label}</span>
            </div>
          ))}
          <div className="menu-group-title" style={{ marginTop: 20 }}></div>
          <div className="menu-item"><span></span></div>
        </nav>
      </aside>

      <div className="main-content">
        <header className="top-nav">
          <div className="top-nav-left">
            <span>首页 / <span style={{ color: '#333', fontWeight: 500 }}>{pageTitleMap[currentPage]}</span></span>
          </div>
          <div className="top-nav-right">
            <span></span>
            <div className="user">
              <div className="avatar">A</div>
              <span>admin</span>
            </div>
          </div>
        </header>
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;