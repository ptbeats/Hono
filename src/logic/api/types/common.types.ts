export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  error?: string;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  status?: number;
  data?: any;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface RequestConfig {
  timeout?: number;
  showLoading?: boolean;
  showError?: boolean;
  headers?: Record<string, string>;
}