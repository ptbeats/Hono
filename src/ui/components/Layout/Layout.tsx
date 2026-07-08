import React, { useState, useEffect } from 'react';
// @ts-ignore: CSS side-effect import without type declarations
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  pageTitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  pageTitle = '仪表盘'
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: '📊' },
    { id: 'devices', label: '设备管理', icon: '📱' },
    { id: 'register', label: '注册设备', icon: '➕' },
    { id: 'credentials', label: '凭证管理', icon: '🔑' },
    { id: 'commands', label: '命令下发', icon: '📨' },
  ];

  return (
    <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {isMobile && mobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
      )}
      
      <aside className={`sidebar ${isMobile ? '' : sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">⚡</div>
          {!isMobile && !sidebarCollapsed && <span className="brand-text">Hono管理</span>}
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                onTabChange(item.id);
                if (isMobile) setMobileSidebarOpen(false);
              }}
              title={sidebarCollapsed && !isMobile ? item.label : undefined}
            >
              <span className="menu-icon">{item.icon}</span>
              {(!sidebarCollapsed || isMobile) && <span className="menu-label">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button className="sidebar-menu-item" title="设置">
            <span className="menu-icon">⚙️</span>
            {(!sidebarCollapsed || isMobile) && <span className="menu-label">设置</span>}
          </button>
        </div>
      </aside>
      
      <header className="header">
        <div className="header-left">
          <button className="header-menu-btn" onClick={handleMenuToggle}>
            ☰
          </button>
          <h1 className="header-title">{pageTitle}</h1>
        </div>
        
        <div className="header-right">
          <button className="header-btn" title="通知">
            🔔
            <span className="notification-badge">3</span>
          </button>
          
          <div className="user-menu-container">
            <button className="header-btn user-btn">
              👤
            </button>
          </div>
        </div>
      </header>
      
      <main className="layout-main">
        <div className="layout-content">
          {children}
        </div>
      </main>
    </div>
  );
};