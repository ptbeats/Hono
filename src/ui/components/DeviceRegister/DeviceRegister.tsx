import React, { useState } from 'react';
import { useDevices } from '../../../logic/hooks/useDevices';
import { Card } from '../common/Card/Card';
import { Toast } from '../common/Toast/Toast';
// 模块化导入样式，修复ts2882报错
import styles from './DeviceRegister.module.css';

export const DeviceRegister: React.FC = () => {
  const { registerDevice, loading } = useDevices();
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    description: '',
    enabled: true,
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerDevice(formData);
      setToast({ type: 'success', message: '设备注册成功！' });
      // 清空表单
      setFormData({ deviceId: '', name: '', description: '', enabled: true });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || '注册失败，请重试' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className={styles['device-register']}>
      <Card>
        {/* 表单标题，对应css .form-title */}
        <h2 className={styles['form-title']}>注册新设备</h2>
        <form onSubmit={handleSubmit} className={styles['register-form']}>
          {/* 设备ID */}
          <div className={styles['form-group']}>
            <label htmlFor="deviceId">设备ID *</label>
            <input
              id="deviceId"
              name="deviceId"
              type="text"
              value={formData.deviceId}
              onChange={handleChange}
              required
              placeholder="例：device-001，全局唯一标识"
            />
            <span className={styles['form-tip']}>设备唯一编号，不可重复创建</span>
          </div>

          {/* 设备名称 */}
          <div className={styles['form-group']}>
            <label htmlFor="name">设备名称 *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="例：实验室温湿度传感器-01"
            />
            <span className={styles['form-tip']}>前端页面展示用名称</span>
          </div>

          {/* 设备描述 改为多行文本域 */}
          <div className={styles['form-group']}>
            <label htmlFor="description">设备描述</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="填写设备位置、用途等备注信息（选填）"
            />
            <span className={styles['form-tip']}>信息会存入设备扩展字段</span>
          </div>

          {/* 启用复选框 */}
          <div className={`${styles['form-group']} ${styles.checkbox}`}>
            <label>
              <input
                name="enabled"
                type="checkbox"
                checked={formData.enabled}
                onChange={handleChange}
              />
              启用设备
            </label>
            <span className={styles['form-tip']}>关闭后设备无法接入平台上报数据</span>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className={styles['submit-btn']}
            disabled={loading}
          >
            {loading ? '注册中...' : '注册设备'}
          </button>
        </form>
      </Card>

      {/* 消息提示弹窗 */}
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