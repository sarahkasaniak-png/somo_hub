// src/app/tutor/sessions/create/components/ScheduleConfig.tsx

import { useState } from "react";
import { PlusCircle, Trash2, Clock } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 1;
  return { value: hour.toString().padStart(2, "0"), label: hour.toString() };
});

const MINUTES = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString().padStart(2, "0"),
  label: i.toString().padStart(2, "0"),
}));

interface ScheduleConfig {
  day_of_week: number;
  start_time: string; // Stored in 24-hour format in DB
  end_time: string; // Stored in 24-hour format in DB
}

interface ScheduleConfigProps {
  value: ScheduleConfig[];
  onChange: (configs: ScheduleConfig[]) => void;
  startDate?: string;
  endDate?: string;
}

export default function ScheduleConfig({
  value = [],
  onChange,
  startDate,
  endDate,
}: ScheduleConfigProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default to Monday

  // 12-hour input state for start time
  const [startHour, setStartHour] = useState<string>("09");
  const [startMinute, setStartMinute] = useState<string>("00");
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM");

  // 12-hour input state for end time
  const [endHour, setEndHour] = useState<string>("10");
  const [endMinute, setEndMinute] = useState<string>("00");
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("AM");

  // Convert 12-hour format to 24-hour format for storage
  const convertTo24Hour = (
    hour: string,
    minute: string,
    period: "AM" | "PM",
  ): string => {
    let hour24 = parseInt(hour);

    // Handle 12 AM (midnight) - should be 00:00
    if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    // Handle 12 PM (noon) - should be 12:00
    else if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    }
    // For 1-11 AM, hour stays the same
    // For 12 PM, hour stays 12

    return `${hour24.toString().padStart(2, "0")}:${minute}`;
  };

  // Convert 24-hour format to 12-hour format for display
  const formatTimeForDisplay = (time24: string): string => {
    const [hour24, minute] = time24.split(":");
    const hour = parseInt(hour24);

    const period = hour >= 12 ? "PM" : "AM";
    let hour12 = hour % 12;
    hour12 = hour12 === 0 ? 12 : hour12;

    return `${hour12}:${minute} ${period}`;
  };

  const addSchedule = () => {
    // Validate inputs
    if (!startHour || !startMinute || !endHour || !endMinute) {
      alert("Please select all time fields");
      return;
    }

    const startTime24 = convertTo24Hour(startHour, startMinute, startPeriod);
    const endTime24 = convertTo24Hour(endHour, endMinute, endPeriod);

    // Validate that end time is after start time
    if (startTime24 >= endTime24) {
      alert("End time must be after start time");
      return;
    }

    // Check if this exact schedule already exists
    const exists = value.some(
      (s) =>
        s.day_of_week === selectedDay &&
        s.start_time === startTime24 &&
        s.end_time === endTime24,
    );

    if (exists) {
      alert("This schedule already exists");
      return;
    }

    const newSchedule = {
      day_of_week: selectedDay,
      start_time: startTime24,
      end_time: endTime24,
    };

    onChange([...value, newSchedule]);

    // Reset to default values for next entry
    setStartHour("09");
    setStartMinute("00");
    setStartPeriod("AM");
    setEndHour("10");
    setEndMinute("00");
    setEndPeriod("AM");
  };

  const removeSchedule = (index: number) => {
    const newConfigs = value.filter((_, i) => i !== index);
    onChange(newConfigs);
  };

  const getDayLabel = (day: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === day)?.label || "Unknown";
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    const diffMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
  };

  const getTotalClassesCount = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    let total = 0;

    value.forEach((config) => {
      const current = new Date(start);
      while (current <= end) {
        if (current.getDay() === config.day_of_week) {
          total++;
        }
        current.setDate(current.getDate() + 1);
      }
    });

    return total;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Class Schedule *
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Add all class times for this session. You can add multiple times for
          the same day.
        </p>
      </div>

      {/* Schedule input form - with 12-hour time selection */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Day Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Time Section */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Start Time
            </label>
            <div className="flex gap-2">
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              >
                {HOURS.map((hour) => (
                  <option key={hour.value} value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
              <span className="text-gray-500 self-center">:</span>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              >
                {MINUTES.map((minute) => (
                  <option key={minute.value} value={minute.value}>
                    {minute.label}
                  </option>
                ))}
              </select>
              <select
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value as "AM" | "PM")}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* End Time Section */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              End Time
            </label>
            <div className="flex gap-2">
              <select
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              >
                {HOURS.map((hour) => (
                  <option key={hour.value} value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
              <span className="text-gray-500 self-center">:</span>
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              >
                {MINUTES.map((minute) => (
                  <option key={minute.value} value={minute.value}>
                    {minute.label}
                  </option>
                ))}
              </select>
              <select
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value as "AM" | "PM")}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={addSchedule}
            className="px-6 py-2 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add to Schedule
          </button>
        </div>

        {/* Duration preview for current selection */}
        {startHour && endHour && (
          <div className="text-sm text-green-600 flex items-center gap-1 bg-green-50 p-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>
              Duration:{" "}
              {calculateDuration(
                convertTo24Hour(startHour, startMinute, startPeriod),
                convertTo24Hour(endHour, endMinute, endPeriod),
              )}
            </span>
          </div>
        )}
      </div>

      {/* Schedule List */}
      {value.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Day
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Start Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  End Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {value.map((config, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {getDayLabel(config.day_of_week)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatTimeForDisplay(config.start_time)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatTimeForDisplay(config.end_time)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {calculateDuration(config.start_time, config.end_time)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Remove schedule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {value.length > 0 && startDate && endDate && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Schedule Summary
          </h4>
          <p className="text-sm text-blue-700">
            • Total unique time slots: {value.length}
            <br />• Total classes between{" "}
            {new Date(startDate).toLocaleDateString()} and{" "}
            {new Date(endDate).toLocaleDateString()}: {getTotalClassesCount()}
          </p>
        </div>
      )}
    </div>
  );
}
