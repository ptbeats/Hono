// src/pages/CommandDispatch.tsx
import React, { useState, useMemo } from 'react';
import { Device, enabledStatusMap } from '../data';

const PAGE_SIZE = 20;

interface CommandDispatchProps {
  devices: Device[];
  onDispatchCommand: (deviceId: string, commandName: string, payload: object, timeoutSeconds?: number) => Promise<void>;
}

const CommandDispatch: React.FC<CommandDispatchProps> = ({ devices, onDispatchCommand }) => {
  const [searchName, setSearchName] = useState('');
  const [searchEnabled, setSearchEnabled] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [targetDeviceId, setTargetDeviceId] = useState('');
  const [commandName, setCommandName] = useState('');
  const [payloadStr, setPayloadStr] = useState('{}');
  const [timeoutSeconds, setTimeoutSeconds] = useState(10);

  const filteredDevices = useMemo(() => {
    return devices.filter(item => {
      const matchName = item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchEnabled = searchEnabled !== '' ? String(item.enabled) === searchEnabled : true;
      return matchName && matchEnabled;
    });
  }, [devices, searchName, searchEnabled]);

  const totalDevicePages = Math.ceil(filteredDevices.length / PAGE_SIZE);
  const currentDevices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDevices.slice(start, start + PAGE_SIZE);
  }, [filteredDevices, currentPage]);

  const handleOpenModal = (deviceId: string) => {
    setTargetDeviceId(deviceId);
    setCommandName('');
    setPayloadStr('{}');
    setTimeoutSeconds(10);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!commandName.trim()) {
      alert('请输入命令名称');
      return;
    }
    let payload: object;
    try {
      payload = JSON.parse(payloadStr);
      if (typeof payload !== 'object' || Array.isArray(payload)) throw new Error();
    } catch {
      alert('payload 必须是合法的 JSON 对象');
      return;
    }
    await onDispatchCommand(targetDeviceId, commandName.trim(), payload, timeoutSeconds);
    setShowModal(false);
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h2> 命令下发</h2>
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
            {currentDevices.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: '30px' }}>暂无设备</td></tr>
            ) : (
              currentDevices.map(item => {
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
                        下发命令
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
        <span className="info">共 {filteredDevices.length} 条</span>
        <button className={`page-btn ${currentPage <= 1 ? 'disabled' : ''}`} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>‹</button>
        {Array.from({ length: Math.min(5, totalDevicePages) }, (_, i) => i + 1).map(p => (
          <button key={p} className={`page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
        ))}
        <button className={`page-btn ${currentPage >= totalDevicePages ? 'disabled' : ''}`} onClick={() => setCurrentPage(p => Math.min(totalDevicePages, p + 1))}>›</button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: 24, width: 440,
            maxWidth: '90%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>下发命令</h3>
            <div style={{ marginBottom: 12, color: '#666' }}>目标设备：<strong>{targetDeviceId}</strong></div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>命令名称 *</label>
              <input type="text" value={commandName} onChange={e => setCommandName(e.target.value)} placeholder="例如：set_temperature" />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>参数 (payload) *</label>
              <textarea
                rows={3}
                value={payloadStr}
                onChange={e => setPayloadStr(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', border: '1px solid #d9d9d9', borderRadius: 4, fontFamily: 'monospace' }}
              />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>超时时间（秒）</label>
              <input type="number" value={timeoutSeconds} onChange={e => setTimeoutSeconds(Number(e.target.value))} min={1} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSubmit}>确认下发</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandDispatch;