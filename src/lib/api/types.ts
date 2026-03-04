// src/lib/api/types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface UploadDocumentResponse {
  url: string;
  fileName: string;
  fileType: string;
  size: number;
}