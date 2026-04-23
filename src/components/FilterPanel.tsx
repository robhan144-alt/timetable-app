import { useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import type { TimetableEntry, FilterState } from '../types';

interface FilterPanelProps {
  entries: TimetableEntry[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean))).sort();
}

export default function FilterPanel({ entries, filters, onChange }: FilterPanelProps) {
  const professors = useMemo(() => unique(entries.map(e => e.professor)), [entries]);
  const gradeLevels = useMemo(() => unique(entries.map(e => e.gradeLevel)), [entries]);
  const majors = useMemo(() => unique(entries.map(e => e.major)), [entries]);

  const hasFilters =
    filters.professor || filters.gradeLevel || filters.major || filters.courseSearch;

  const clear = () =>
    onChange({ professor: '', gradeLevel: '', major: '', courseSearch: '' });

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <Filter size={18} />
        <span>Filter Timetable</span>
        {hasFilters && (
          <button className="clear-btn" onClick={clear}>
            <X size={14} /> Clear All
          </button>
        )}
      </div>
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="filter-professor">Professor</label>
          <select
            id="filter-professor"
            value={filters.professor}
            onChange={e => onChange({ ...filters, professor: e.target.value })}
          >
            <option value="">All Professors</option>
            {professors.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-grade">Grade Level</label>
          <select
            id="filter-grade"
            value={filters.gradeLevel}
            onChange={e => onChange({ ...filters, gradeLevel: e.target.value })}
          >
            <option value="">All Grades</option>
            {gradeLevels.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-major">Major</label>
          <select
            id="filter-major"
            value={filters.major}
            onChange={e => onChange({ ...filters, major: e.target.value })}
          >
            <option value="">All Majors</option>
            {majors.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-course">Course Name</label>
          <input
            id="filter-course"
            type="text"
            placeholder="Search courses…"
            value={filters.courseSearch}
            onChange={e => onChange({ ...filters, courseSearch: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
