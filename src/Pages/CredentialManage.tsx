// src/pages/CredentialManage.tsx
import React, { useState, useMemo } from 'react';
import { Device, enabledStatusMap } from '../data';

const PAGE_SIZE = 20;

interface CredentialManageProps {
  devices: Device[];
  onConfigureCredential: (deviceId: string, authId: string, password: string) => Promise<void>;
}

const CredentialManage: React.FC<CredentialManageProps> = ({ devices, onConfigureCredential }) => {
  const [searchName, setSearchName] = useState('');
  const [searchEnabled, setSearchEnabled] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [targetDeviceId, setTargetDeviceId] = useState('');
  const [authId, setAuthId] = useState('');
  const [password, setPassword] = useState('');

  const filteredData = useMemo(() => {
    return devices.filter(item => {
      const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchEnabled = searchEnabled !== '' ? String(item.enabled) === searchEnabled : true;
      return matchName && matchEnabled;
    });
  }, [devices, searchName, searchEnabled]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const handleOpenModal = (deviceId: string) => {
    setTargetDeviceId(deviceId);
    setAuthId('');
    setPassword('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!authId.trim() || !password.trim()) {
      alert('请输入认证ID和密码');
      return;
    }
    await onConfigureCredential(targetDeviceId, authId.trim(), password.trim());
    setShowModal(false);
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h2> 凭证管理</h2>
      </div>

      <div className="search-bar">
        <div className="field">
          <label>设备名称</label>
          <input type="text" placeholder="请输入" value={searchName} onChange={e => setSearchName(e.target.value)} />
        </div>
        <div className="field">
          <label>启用状态</label>
          <select value={searchEnabled} onChange={e => setSearchEnabled(e.target.value)}>
            <option value="">全部</option>
            <option value="true">启用</option>
            <option value="false">禁用</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setCurrentPage(1)}> 搜索</button>
        <button className="btn" onClick={() => { setSearchName(''); setSearchEnabled(''); setCurrentPage(1); }}>重置</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>设备ID</th>
              <th>设备名称</th>
              <th>描述</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: '30px' }}>暂无设备</td></tr>
            ) : (
              currentData.map(item => {
                const st = enabledStatusMap[String(item.enabled)] || { label: '未知', cls: '' };
                return (
                  <tr key={item.deviceId}>
                    <td><code>{item.deviceId}</code></td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.description || '-'}</td>
                    <td><span className={`status ${st.cls}`}>{st.label}</span></td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenModal(item.deviceId)}
                      >
                        配置凭证
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="info">共 {filteredData.length} 条</span>
        <button className={`page-btn ${currentPage <= 1 ? 'disabled' : ''}`} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>‹</button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
          <button key={p} className={`page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
        ))}
        <button className={`page-btn ${currentPage >= totalPages ? 'disabled' : ''}`} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>›</button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: 24, width: 420,
            maxWidth: '90%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>配置设备凭证</h3>
            <div style={{ marginBottom: 12, color: '#666' }}>设备ID：<strong>{targetDeviceId}</strong></div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>认证ID *</label>
              <input type="text" value={authId} onChange={e => setAuthId(e.target.value)} placeholder="authId" />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>密码 *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSubmit}>确认配置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialManage;