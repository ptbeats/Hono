// src/pages/DeviceRegister.tsx
import React, { useState, useMemo } from 'react';
import { Device, enabledStatusMap } from '../data';

const PAGE_SIZE = 20;

interface DeviceRegisterProps {
  devices: Device[];
  onAddDevice: (device: Omit<Device, 'createdAt'>) => Promise<void>;
}

const DeviceRegister: React.FC<DeviceRegisterProps> = ({ devices, onAddDevice }) => {
  const [searchName, setSearchName] = useState('');
  const [searchEnabled, setSearchEnabled] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);

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

  const handleAdd = async () => {
    if (!deviceId.trim() || !name.trim()) {
      alert('设备ID和名称不能为空');
      return;
    }
    await onAddDevice({
      deviceId: deviceId.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      enabled,
    });
    setShowModal(false);
    setDeviceId('');
    setName('');
    setDescription('');
    setEnabled(true);
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h2> 设备管理</h2>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ 注册设备</button>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999', padding: '30px' }}>暂无设备</td></tr>
            ) : (
              currentData.map(item => {
                const st = enabledStatusMap[String(item.enabled)] || { label: '未知', cls: '' };
                return (
                  <tr key={item.deviceId}>
                    <td><code>{item.deviceId}</code></td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.description || '-'}</td>
                    <td><span className={`status ${st.cls}`}>{st.label}</span></td>
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
            <h3 style={{ marginBottom: 16 }}>注册新设备</h3>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>设备ID *</label>
              <input type="text" value={deviceId} onChange={e => setDeviceId(e.target.value)} placeholder="唯一标识" />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>设备名称 *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="名称" />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>描述</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="可选" />
            </div>
            <div className="field" style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
              <label style={{ marginRight: 10 }}>启用</label>
              <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleAdd}>确认注册</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceRegister;