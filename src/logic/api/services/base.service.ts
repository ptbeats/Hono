// base.service.ts
//导入 api 对象
import { api } from '../client';
import { ApiResponse, ApiError, RequestConfig } from '../../api/types';

export class BaseService {
  protected async request<T = any>(//默认泛型 T，async request 方法，返回 Promise<ApiResponse<T>> 
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {//提取请求配置
      const requestConfig = {
        timeout: config?.timeout,
        headers: {
          ...config?.headers,
        },
      };

      let response;//返回结果
      //HTTP方法处理
      switch (method) {
        case 'get':
          response = await api.get<T>(url, { ...requestConfig, params: data });
          break;
        case 'post':
          response = await api.post<T>(url, data, requestConfig);
          break;
        case 'put':
          response = await api.put<T>(url, data, requestConfig);
          break;
        case 'delete':
          response = await api.delete<T>(url, { ...requestConfig, params: data });
          break;
        case 'patch':
          response = await api.patch<T>(url, data, requestConfig);
          break;
        default:
          throw new Error(`不支持请求方法: ${method}`);
      }
      
      // 处理响应
      const responseData = response && typeof response === 'object' && 'data' in response//判断 response 是否包含 data 属性，如果包含则使用 response.data，否则直接使用 response
        ? (response as any).data
        : response;

      if (responseData && typeof responseData === 'object') {
        if ('success' in responseData) {
          return responseData as ApiResponse<T>;
        }
        // 如果响应数据没有 success 字段，则默认认为请求成功，返回一个标准的 ApiResponse 对象
        return {
          success: true,
          message: '请求成功',
          data: responseData as T,
        };
      }
      
      return {
        success: true,
        message: '请求成功',
        data: responseData,
      };
    } catch (error: any) {
      // 如果错误已经是标准格式，直接抛出
      if (error && error.success === false) {
        throw error;
      }
      
      // 构建标准错误
      const apiError: ApiError = {
        success: false,
        code: error?.code || 'UNKNOWN_ERROR',//优先使用 error.code，如果没有则使用 'UNKNOWN_ERROR'
        message: error?.message || '请求失败，请稍后重试',
        status: error?.status,
        data: error?.data,
      };
      
      throw apiError;
    }
  }
//封装常用的 HTTP 方法，方便子类调用
  protected get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('get', url, params, config);
  }

  protected post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('post', url, data, config);
  }

  protected put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('put', url, data, config);
  }

  protected delete<T = any>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('delete', url, params, config);
  }

  protected patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('patch', url, data, config);
  }

  protected buildUrl(basePath: string, ...segments: (string | number)[]): string {
    const path = [basePath, ...segments.map(s => String(s))].join('/');
    return path.replace(/\/+/g, '/');
  }
}