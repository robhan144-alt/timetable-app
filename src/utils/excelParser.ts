import * as XLSX from 'xlsx';
import type { TimetableEntry } from '../types';

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[\s_-]+/g, '');
}

function mapRow(row: Record<string, unknown>, headers: string[]): TimetableEntry | null {
  const get = (keys: string[]): string => {
    for (const key of keys) {
      for (const h of headers) {
        if (normalizeHeader(h) === key) {
          return String(row[h] ?? '').trim();
        }
      }
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

export function parseExcelFile(file: File): Promise<TimetableEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

        if (jsonData.length === 0) {
          resolve([]);
          return;
        }

        const headers = Object.keys(jsonData[0]);
        const entries = jsonData
          .map(row => mapRow(row, headers))
          .filter((e): e is TimetableEntry => e !== null);

        resolve(entries);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function generateSampleExcel(): void {
  const data = [
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

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 22 }, { wch: 18 }, { wch: 12 },
    { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 8 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Timetable');
  XLSX.writeFile(workbook, 'sample-timetable.xlsx');
}
