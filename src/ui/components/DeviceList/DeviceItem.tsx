import React from 'react';
import { Device } from '../../../logic/api/types';
import styles from './DeviceList.module.css';

interface DeviceItemProps {
  device: Device;
  onToggle?: (deviceId: string, enabled: boolean) => void;
}

export const DeviceItem: React.FC<DeviceItemProps> = ({ device, onToggle }) => {
  const statusClass = device.enabled ? styles['status-enabled'] : styles['status-disabled'];
  const statusText = device.enabled ? '已启用' : '已禁用';

  return (
    <div className={styles['device-item']}>
      <div className={styles['device-item-info']}>
        <div className={styles['device-item-name']}>
          {device.name || device.deviceId}
        </div>
        <div className={styles['device-item-id']}>
          ID: {device.deviceId}
        </div>
        {device.description && (
          <div className={styles['device-item-description']}>
            {device.description}
          </div>
        )}
      </div>

      <div className={styles['device-item-actions']}>
        <span className={`${styles['device-status']} ${statusClass}`}>
          {statusText}
        </span>
        {onToggle && (
          <button
            onClick={() => onToggle(device.deviceId, !device.enabled)}
            className={styles['toggle-btn']}
          >
            {device.enabled ? '禁用' : '启用'}
          </button>
        )}
      </div>
    </div>
  );
};