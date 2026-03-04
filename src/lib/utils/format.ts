// src/lib/utils/format.ts

/**
 * Format time string from HH:MM:SS to HH:MM
 */
export const formatTimeForApi = (timeString: string): string => {
  if (!timeString) return timeString;
  
  // If it's already in HH:MM format, return as is
  if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
    return timeString;
  }
  
  // If it includes seconds (HH:MM:SS), remove the seconds part
  if (timeString.includes(':')) {
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      // Return only HH:MM
      return `${parts[0]}:${parts[1]}`;
    }
  }
  
  return timeString;
};

/**
 * Parse validation error messages from the API
 */
export const parseApiError = (error: any): string => {
  const errorMessage = error?.message || error?.toString() || "An unknown error occurred";
  
  if (errorMessage.includes("Validation failed")) {
    // Try to extract validation errors in a user-friendly way
    const matches = errorMessage.match(/"([^"]+)" with value "([^"]+)" fails to match/);
    if (matches) {
      const field = matches[1];
      const value = matches[2];
      return `Invalid format for ${field}: "${value}". Please use HH:MM format.`;
    }
    
    // If pattern doesn't match, clean up the message
    const parts = errorMessage.split("Validation failed: ");
    if (parts.length > 1) {
      const errors = parts[1].split(", ");
      // Return the first error in a user-friendly format
      return errors[0].replace(/"/g, "'");
    }
  }
  
  // Check for specific error patterns
  if (errorMessage.includes("schedule_configs")) {
    return "Please check your schedule configuration times. Use HH:MM format (e.g., 09:00, 14:30).";
  }
  
  return errorMessage;
};

// src/lib/utils/format.ts
export const formatDisplayName = (
  firstName?: string,
  lastName?: string,
  fullName?: string
): string => {
  if (firstName && lastName) {
    // Both names exist: "John D."
    return `${firstName} ${lastName.charAt(0)}.`;
  } else if (firstName) {
    // Only first name exists: "John"
    return firstName;
  } else if (lastName) {
    // Only last name exists: "Smith"
    return lastName;
  } else if (fullName) {
    // Try to parse full name
    const nameParts = fullName.trim().split(" ");
    if (nameParts.length > 1) {
      const firstName = nameParts[0];
      const lastNamePart = nameParts[nameParts.length - 1];
      return `${firstName} ${lastNamePart.charAt(0)}.`;
    } else {
      return nameParts[0];
    }
  }
  
  return "Student";
};