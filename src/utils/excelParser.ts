import { readSheet } from 'read-excel-file/browser';
import type { Row } from 'read-excel-file/browser';
import type { TimetableEntry } from '../types';

function normalizeHeader(header: string): string {
  return String(header).toLowerCase().replace(/[\s_-]+/g, '');
}

function mapRow(cells: Row, headers: string[]): TimetableEntry | null {
  const get = (keys: string[]): string => {
    for (const key of keys) {
      const idx = headers.findIndex(h => normalizeHeader(h) === key);
      if (idx !== -1) return String(cells[idx] ?? '').trim();
    }
    return '';
  };

  const courseName = get(['coursename', 'course', 'subject']);
  const professor = get(['professor', 'teacher', 'instructor', 'lecturer']);
  const gradeLevel = get(['gradelevel', 'grade', 'year', 'level']);
  const major = get(['major', 'department', 'program', 'field']);
  const day = get(['day', 'weekday']);
  const timeSlot = get(['timeslot', 'time', 'period', 'slot', 'timeslots', 'hours']);
  const room = get(['room', 'classroom', 'venue', 'location']);

  if (!courseName && !day && !timeSlot) return null;

  return { courseName, professor, gradeLevel, major, day, timeSlot, room };
}

export async function parseExcelFile(file: File): Promise<TimetableEntry[]> {
  const rows = await readSheet(file);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => String(h ?? ''));
  return rows
    .slice(1)
    .map((row: Row) => mapRow(row, headers))
    .filter((e): e is TimetableEntry => e !== null);
}

const SAMPLE_ROWS = [
  ['Course Name', 'Professor', 'Grade Level', 'Major', 'Day', 'Time Slot', 'Room'],
  ['Mathematics 101', 'Dr. Smith', 'Year 1', 'Computer Science', 'Monday', '08:00-10:00', 'A101'],
  ['Physics I', 'Prof. Johnson', 'Year 1', 'Engineering', 'Monday', '10:00-12:00', 'B203'],
  ['Data Structures', 'Dr. Lee', 'Year 2', 'Computer Science', 'Tuesday', '08:00-10:00', 'C305'],
  ['Calculus II', 'Prof. Williams', 'Year 2', 'Mathematics', 'Tuesday', '13:00-15:00', 'A201'],
  ['Algorithms', 'Dr. Chen', 'Year 3', 'Computer Science', 'Wednesday', '09:00-11:00', 'C101'],
  ['Linear Algebra', 'Dr. Smith', 'Year 2', 'Mathematics', 'Wednesday', '14:00-16:00', 'A102'],
  ['Operating Systems', 'Prof. Davis', 'Year 3', 'Computer Science', 'Thursday', '08:00-10:00', 'C205'],
  ['Thermodynamics', 'Prof. Johnson', 'Year 2', 'Engineering', 'Thursday', '11:00-13:00', 'B301'],
  ['Software Engineering', 'Dr. Lee', 'Year 4', 'Computer Science', 'Friday', '10:00-12:00', 'C401'],
  ['Statistics', 'Prof. Williams', 'Year 3', 'Mathematics', 'Friday', '13:00-15:00', 'A305'],
];

export function generateSampleCsv(): void {
  const csv = SAMPLE_ROWS
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sample-timetable.csv';
  link.click();
  URL.revokeObjectURL(url);
}
