import React, { useState } from 'react';
import { useCommands } from '../../../logic/hooks/useCommands';
import { ContentType } from '../../../logic/api/types';
import { Card } from '../common/Card/Card';
import { Toast } from '../common/Toast/Toast';
// 修复css modules导入，解决ts(2882)报错
import styles from './CommandSender.module.css';

export const CommandSender: React.FC = () => {
  const { sendCommand, loading } = useCommands();
  const [formData, setFormData] = useState({
    deviceId: '',
    commandName: '',
    payload: '',
    contentType: ContentType.JSON,
    timeoutSeconds: 10,
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let payload: any = formData.payload;
      if (formData.contentType === ContentType.JSON) {
        try {
          payload = JSON.parse(formData.payload);
        } catch {
          setToast({ type: 'error', message: 'JSON格式无效，请检查' });
          return;
        }
      }

      await sendCommand(formData.deviceId, {
        commandName: formData.commandName,
        contentType: formData.contentType as ContentType,
        payload,
        timeoutSeconds: formData.timeoutSeconds,
      });

      setToast({ type: 'success', message: '命令发送成功！' });
      setFormData(prev => ({ ...prev, payload: '' }));
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || '发送失败，请重试' });
    }
  };

  return (
    <div className={styles['command-sender']}>
      <Card>
        <h2 className={styles['form-title']}>设备命令下发</h2>
        <form onSubmit={handleSubmit} className={styles['command-form']}>
          <div className={styles['form-group']}>
            <label htmlFor="deviceId">设备ID *</label>
            <input
              id="deviceId"
              type="text"
              value={formData.deviceId}
              onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
              required
              placeholder="请输入目标设备ID"
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="commandName">命令名称 *</label>
            <input
              id="commandName"
              type="text"
              value={formData.commandName}
              onChange={(e) => setFormData({ ...formData, commandName: e.target.value })}
              required
              placeholder="例如：setTemperature / switch"
            />
          </div>

          <div className={styles['form-row']}>
            <div className={styles['form-group']}>
              <label htmlFor="contentType">内容类型</label>
              <select
                id="contentType"
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
              >
                <option value={ContentType.JSON}>JSON</option>
                <option value={ContentType.TEXT}>文本</option>
              </select>
              <span className={styles['form-tip']}>切换载荷数据格式</span>
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="timeoutSeconds">超时时间（秒）</label>
              <input
                id="timeoutSeconds"
                type="number"
                value={formData.timeoutSeconds}
                onChange={(e) => setFormData({ ...formData, timeoutSeconds: parseInt(e.target.value) || 10 })}
                min={1}
                max={60}
              />
              <span className={styles['form-tip']}>等待设备响应超时时间</span>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="payload">命令载荷内容</label>
            {formData.contentType === ContentType.JSON ? (
              <>
                <textarea
                  id="payload"
                  value={formData.payload}
                  onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                  placeholder='{"targetTemperature": 26}'
                  rows={4}
                  className={styles['textarea-json']}
                />
                <span className={styles['form-tip']}>标准JSON格式，填写错误会提交拦截</span>
              </>
            ) : (
              <>
                <input
                  id="payload"
                  type="text"
                  value={formData.payload}
                  onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                  placeholder="例如：ON / OFF"
                />
                <span className={styles['form-tip']}>纯文本简单指令</span>
              </>
            )}
          </div>

          <button
            type="submit"
            className={styles['submit-btn']}
            disabled={loading}
          >
            {loading ? '发送中...' : '发送命令'}
          </button>
        </form>
      </Card>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};