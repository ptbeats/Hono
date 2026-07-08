// client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10);

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return response.data;
    }
    return { success: true, data: response.data };
  },
  (error: AxiosError) => {
    // 详细日志输出
    console.error('[API Error Details]', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      }
    });

    const status = error.response?.status;
    const responseData = error.response?.data as any;
    
    let errorMessage = '请求失败，请稍后重试';
    let errorCode = 'UNKNOWN_ERROR';

    // 处理网络错误（后端未启动）
    if (error.code === 'ERR_NETWORK') {
      errorMessage = '无法连接到服务器，请确保后端服务已启动';
      errorCode = 'NETWORK_ERROR';
      console.error('[Network Error] 后端服务可能未启动，请检查:');
      console.error(`  1. 后端服务是否运行在 ${API_BASE_URL}`);
      console.error('  2. 网络连接是否正常');
      console.error('  3. CORS 配置是否正确');
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请检查网络连接';
      errorCode = 'TIMEOUT';
    } else if (error.request) {
      errorMessage = '服务器无响应，请检查网络连接';
      errorCode = 'NETWORK_ERROR';
    } else if (status) {
      switch (status) {
        case 400:
          errorMessage = responseData?.message || '请求参数错误';
          errorCode = 'BAD_REQUEST';
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          errorCode = 'UNAUTHORIZED';
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = '没有权限执行此操作';
          errorCode = 'FORBIDDEN';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          errorCode = 'NOT_FOUND';
          break;
        case 409:
          errorMessage = responseData?.message || '资源已存在或冲突';
          errorCode = 'CONFLICT';
          break;
        case 422:
          errorMessage = responseData?.message || '数据验证失败';
          errorCode = 'VALIDATION_ERROR';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          errorCode = 'SERVER_ERROR';
          break;
        case 503:
          errorMessage = '服务暂时不可用';
          errorCode = 'SERVICE_UNAVAILABLE';
          break;
        default:
          errorMessage = responseData?.message || `请求失败 (${status})`;
          errorCode = `HTTP_${status}`;
      }
    }

    // 构建标准错误对象（确保 message 是字符串）
    const apiError = {
      success: false,
      code: errorCode,
      message: errorMessage,  // 确保是字符串
      status: status,
      data: responseData,
    };

    console.error('[API Error Formatted]', apiError);

    return Promise.reject(apiError);
  }
);

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.patch<T>(url, data, config),
};