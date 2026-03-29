// src/lib/api/curriculum.ts
import client from "./client";

export interface CurriculumLevel {
  id: number;
  name: string;
  code: string;
  order_index: number;
}

export interface Curriculum {
  id: number;
  uuid: string;
  name: string;
  code: string;
  description: string;
  country: string;
  levels: CurriculumLevel[];
}

export interface SelectedCurriculum {
  curriculum_id: number;
  curriculum_level_id: number | null;
}

export const getCurriculums = async (): Promise<Curriculum[]> => {
  try {
    const response = await client.get<{ success: boolean; data: Curriculum[] }>(
      "/tutor/curriculums"
    );
    
    console.log("Curriculum API response:", response);
    
    if (response.success && response.data) {
      // Ensure data is an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      console.error("Curriculum data is not an array:", response.data);
      return [];
    }
    
    console.error("Failed to fetch curriculums:", response);
    return [];
  } catch (error) {
    console.error("Error fetching curriculums:", error);
    return [];
  }
};

export const getCurriculumLevels = async (curriculumId: number): Promise<CurriculumLevel[]> => {
  try {
    const response = await client.get<{ success: boolean; data: CurriculumLevel[] }>(
      `/tutor/curriculums/${curriculumId}/levels`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching curriculum levels:", error);
    return [];
  }
};