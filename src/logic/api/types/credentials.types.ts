import { ApiResponse } from './common.types';

export interface CredentialsRequest {
  authId: string;
  password: string;
}

export type CredentialsApiResponse = ApiResponse<string>;  // 返回 authId