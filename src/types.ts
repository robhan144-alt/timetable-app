export interface TimetableEntry {
  courseName: string;
  professor: string;
  gradeLevel: string;
  major: string;
  day: string;
  timeSlot: string;
  room?: string;
}

export interface FilterState {
  professor: string;
  gradeLevel: string;
  major: string;
  courseSearch: string;
}
