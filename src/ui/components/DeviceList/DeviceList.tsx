import React, { useEffect, useState } from 'react';
import { useDevices } from '../../../logic/hooks/useDevices';
import { DeviceItem } from './DeviceItem';
import { Loading } from '../common/Loading/Loading';
import styles from './DeviceList.module.css';

export const DeviceList: React.FC = () => {
  const { devices, total, loading, fetchDevices } = useDevices();  // ✅ 移除 toggleDevice
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchDevices({ page, size: pageSize });
  }, [page, pageSize, fetchDevices]);

  const totalPages = Math.ceil(total / pageSize);

  if (loading) return <Loading />;

  return (
    <div className={styles['device-list-container']}>
      <div className={styles['device-list-header']}>
        <h2>设备列表</h2>
        <span className={styles['device-count']}>共 {total} 台设备</span>
      </div>

      <div className={styles['device-list']}>
        {devices.length === 0 ? (
          <div className={styles['device-list-empty']}>
            <p>暂无设备数据，请前往注册新设备</p>
          </div>
        ) : (
          devices.map(device => (
            <DeviceItem
              key={device.deviceId}
              device={device}
              // 不传 onToggle，禁用切换按钮
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles['device-list-pagination']}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className={styles['pagination-btn']}
          >
            上一页
          </button>
          <span className={styles['pagination-info']}>
            第 {page + 1} / {totalPages} 页
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className={styles['pagination-btn']}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};