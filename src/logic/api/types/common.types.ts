export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  error?: string;
  timestamp?: string;
}
//错误类型
export interface ApiError {
  success: false;
  code: string;
  message: string;
  status?: number;
  data?: any;
}
//分页
export interface PaginationParams {
  page?: number;
  size?: number;
}
//请求
export interface RequestConfig {
  timeout?: number;
  showLoading?: boolean;
  showError?: boolean;
  headers?: Record<string, string>;
}