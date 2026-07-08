import React from 'react';
// @ts-ignore
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend 
}) => {
  const colorMap = {
    primary: 'stat-card-primary',
    success: 'stat-card-success',
    warning: 'stat-card-warning',
    danger: 'stat-card-danger',
    info: 'stat-card-info',
  };

  return (
    <div className={`stat-card ${colorMap[color]}`}>
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
        <span className="stat-card-title">{title}</span>
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        {trend && (
          <span className={`stat-card-trend ${trend.isUp ? 'up' : 'down'}`}>
            {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
};