import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useCredentials } from '../../../logic/hooks/useCredentials';
import { Card } from '../common/Card/Card';
import { Toast } from '../common/Toast/Toast';
import styles from './CredentialsConfig.module.css';

type ToastMessage = {
  type: 'success' | 'error';
  message: string;
};

export const CredentialsConfig: React.FC = () => {
  const { configureCredentials, loading } = useCredentials();

  const [deviceId, setDeviceId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToast({ type: 'error', message: '两次输入的密码不一致' });
      return;
    }
    if (password.length < 6) {
      setToast({ type: 'error', message: '密码长度至少6位' });
      return;
    }

    try {
      // 使用 deviceId 作为 authId（符合文档要求）
      await configureCredentials(deviceId, deviceId, password);
      setToast({ type: 'success', message: '凭证配置成功！' });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '配置失败，请重试';
      setToast({ type: 'error', message: errorMsg });
    }
  };

  const handleCloseToast = () => setToast(null);
  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    return (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value);
  };

  return (
    <div className={styles['credentials-config']}>
      <Card>
        <h2 className={styles['form-title']}>设备凭证配置</h2>
        <form className={styles['credentials-form']} onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label htmlFor="deviceId">设备ID *</label>
            <input
              id="deviceId"
              type="text"
              placeholder="例：device-001"
              value={deviceId}
              onChange={handleChange(setDeviceId)}
              required
            />
            <span className={styles['form-tip']}>目标设备唯一标识，将同时作为认证ID（authId）</span>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">设备连接密码 *</label>
            <input
              id="password"
              type="password"
              placeholder="至少6位"
              value={password}
              onChange={handleChange(setPassword)}
              minLength={6}
              required
            />
            <span className={styles['form-tip']}>密码仅转发至平台，后端不存储明文</span>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="confirmPassword">确认密码 *</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="再次输入"
              value={confirmPassword}
              onChange={handleChange(setConfirmPassword)}
              minLength={6}
              required
            />
            <span className={styles['form-tip']}>两次密码必须完全一致</span>
          </div>

          <button className={styles['submit-btn']} type="submit" disabled={loading}>
            {loading ? '配置中...' : '保存凭证配置'}
          </button>
        </form>
      </Card>

      {toast && <Toast type={toast.type} message={toast.message} onClose={handleCloseToast} />}
    </div>
  );
};