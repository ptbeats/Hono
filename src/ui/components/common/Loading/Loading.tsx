import React from 'react';
import './Loading.module.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  message = '加载中...',
  fullScreen = false 
}) => {
  const sizeMap = {
    small: 20,
    medium: 30,
    large: 40
  };

  const spinnerSize = sizeMap[size];

  const content = (
    <div className="loading-container">
      <div 
        className="loading-spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: size === 'small' ? 2 : 3
        }}
      />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-fullscreen">{content}</div>;
  }

  return content;
};