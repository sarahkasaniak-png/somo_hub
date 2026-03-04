// src/lib/api/search.ts
import client from "./client";

export interface SearchFilters {
  category?: string;
  level?: string;
  subject?: string;
  search?: string;
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

const searchApi = {
  searchSessions: (filters: SearchFilters): Promise<SearchResponse> =>
    client.get("/tuitions/search", filters),
  
  getLevels: (): Promise<{ success: boolean; data: { value: string; label: string }[] }> =>
    client.get("/tuitions/levels"),
};

export default searchApi;