// src/lib/api/search.ts
import client from "./client";

export interface SearchFilters {
  category?: string;
  level?: string;
  subject?: string;
  search?: string;
  curriculum_id?: number;
  curriculum_level_id?: number;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  success: boolean;
  data?: {
    sessions: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface CurriculumResponse {
  success: boolean;
  data?: Array<{
    id: number;
    uuid: string;
    name: string;
    code: string;
    description: string;
    country: string;
    levels: Array<{
      id: number;
      name: string;
      code: string;
      order_index: number;
    }>;
  }>;
  message?: string;
}

const searchApi = {
  searchSessions: (filters: SearchFilters): Promise<SearchResponse> =>
    client.get("/tuitions/search", filters),
  
  getLevels: (): Promise<{ success: boolean; data: { value: string; label: string }[] }> =>
    client.get("/tuitions/levels"),
  
  getCurriculums: (): Promise<CurriculumResponse> =>
    client.get("/tuitions/curriculums"),
};

export default searchApi;