import { useMemo } from 'react';
import type { TimetableEntry } from '../types';

interface TimetableGridProps {
  entries: TimetableEntry[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const PALETTE = [
  '#4f86c6', '#e07b54', '#5ab08a', '#9b6cb9',
  '#d4a843', '#c95f8a', '#3aada8', '#e05c5c',
];

function colorForKey(key: string, cache: Map<string, string>): string {
  if (cache.has(key)) return cache.get(key)!;
  const color = PALETTE[cache.size % PALETTE.length];
  cache.set(key, color);
  return color;
}

export default function TimetableGrid({ entries }: TimetableGridProps) {
  const colorCache = useMemo(() => new Map<string, string>(), []);

  const timeSlots = useMemo(() => {
    const slots = Array.from(new Set(entries.map(e => e.timeSlot).filter(Boolean)));
    return slots.sort((a, b) => {
      const toMin = (t: string) => {
        const part = t.split(/[-–]/)[0].trim();
        const [h, m] = part.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
      };
      return toMin(a) - toMin(b);
    });
  }, [entries]);

  const cellMap = useMemo(() => {
    const map = new Map<string, TimetableEntry[]>();
    for (const entry of entries) {
      const key = `${entry.day}|${entry.timeSlot}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(entry);
    }
    return map;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="grid-empty">
        <p>No entries match the current filters.</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="grid-empty">
        <p>No time slot information found in the uploaded file.</p>
      </div>
    );
  }

  return (
    <div className="timetable-wrapper">
      <div className="timetable-scroll">
        <table className="timetable">
          <thead>
            <tr>
              <th className="th-time">Time</th>
              {DAYS.map(day => (
                <th key={day} className="th-day">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td className="td-time">{slot}</td>
                {DAYS.map(day => {
                  const cell = cellMap.get(`${day}|${slot}`) ?? [];
                  return (
                    <td key={day} className={`td-cell ${cell.length ? 'has-entry' : ''}`}>
                      {cell.map((entry, i) => {
                        const color = colorForKey(entry.major || entry.gradeLevel || 'default', colorCache);
                        return (
                          <div
                            key={i}
                            className="entry-card"
                            style={{ borderLeftColor: color, background: `${color}18` }}
                          >
                            <div className="entry-course">{entry.courseName || '—'}</div>
                            {entry.professor && (
                              <div className="entry-detail">{entry.professor}</div>
                            )}
                            {entry.major && (
                              <div className="entry-tag" style={{ background: color }}>
                                {entry.major}
                              </div>
                            )}
                            {entry.gradeLevel && (
                              <div className="entry-grade">{entry.gradeLevel}</div>
                            )}
                            {entry.room && (
                              <div className="entry-room">📍 {entry.room}</div>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
