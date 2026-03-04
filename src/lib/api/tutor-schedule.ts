// src/lib/api/tutor-schedule.ts
import client from "./client";

export interface TutorSessionSchedule {
  id: number;
  tutor_course_session_id: number;
  week_number: number;
  class_number: number;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  mode: "virtual" | "in_person" | "hybrid";
  meeting_platform: "bbb" | "zoom" | "google_meet" | "teams" | "jitsi" | "other";
  meeting_link: string | null;
  meeting_id: string | null;
  meeting_passcode: string | null;
  meeting_metadata: Record<string, any>;
  location: string | null;
  topics: string[];
  learning_objectives: string[];
  materials: string[];
  assignments: any[];
  prerecorded_video_url: string | null;
  status: "scheduled" | "ongoing" | "completed" | "cancelled" | "rescheduled";
  notes: string | null;
  recorded_session_url: string | null;
  attendance_taken: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  course_title?: string;
  course_subject?: string;
  session_name?: string;
  session_code?: string;
}

export interface JoinSessionResponse {
  meeting_link: string;
  schedule_id: number;
  session_id: number;
  session_name: string;
  class_title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

// Get all schedules for a session
const getSessionSchedules = (sessionId: number): Promise<{ success: boolean; data: TutorSessionSchedule[] }> =>
  client.get(`/tutor/sessions/${sessionId}/schedules`);

// Get a specific schedule by ID
const getScheduleById = (scheduleId: number): Promise<{ success: boolean; data: TutorSessionSchedule }> =>
  client.get(`/tutor/schedules/${scheduleId}`);

// Join a scheduled session
const joinScheduledSession = (scheduleId: number): Promise<{ success: boolean; data: JoinSessionResponse }> =>
  client.post(`/tutor/schedules/${scheduleId}/join`);

// Update schedule status
const updateScheduleStatus = (
  scheduleId: number,
  status: "ongoing" | "completed" | "cancelled"
): Promise<{ success: boolean; data: TutorSessionSchedule }> =>
  client.put(`/tutor/schedules/${scheduleId}/status`, { status });

// Get upcoming schedules for tutor
const getUpcomingSchedules = (limit: number = 10): Promise<{ success: boolean; data: TutorSessionSchedule[] }> =>
  client.get("/tutor/schedules/upcoming", { limit });

// Get today's schedules for tutor
const getTodaySchedules = (): Promise<{ success: boolean; data: TutorSessionSchedule[] }> =>
  client.get("/tutor/schedules/today");

const tutorScheduleApi = {
  getSessionSchedules,
  getScheduleById,
  joinScheduledSession,
  updateScheduleStatus,
  getUpcomingSchedules,
  getTodaySchedules,
};

export default tutorScheduleApi;