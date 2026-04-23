import { useState } from 'react';
import type { TimetableEntry, FilterState } from './types';
import { parseExcelFile } from './utils/excelParser';
import FileUpload from './components/FileUpload';
import FilterPanel from './components/FilterPanel';
import TimetableGrid from './components/TimetableGrid';
import SampleDownload from './components/SampleDownload';
import './App.css';

function App() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    professor: '',
    gradeLevel: '',
    major: '',
    courseSearch: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await parseExcelFile(file);
      setEntries(data);
      setFileName(file.name);
      setFilters({ professor: '', gradeLevel: '', major: '', courseSearch: '' });
    } catch {
      setError('Failed to parse file. Please check the format.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filters.professor && entry.professor !== filters.professor) return false;
    if (filters.gradeLevel && entry.gradeLevel !== filters.gradeLevel) return false;
    if (filters.major && entry.major !== filters.major) return false;
    if (
      filters.courseSearch &&
      !entry.courseName.toLowerCase().includes(filters.courseSearch.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-icon">📅</span>
          <div>
            <h1>Interactive Timetable</h1>
            <p className="header-sub">Upload an Excel file to view and filter your schedule</p>
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="top-section">
          <FileUpload onUpload={handleUpload} loading={loading} fileName={fileName} />
          <SampleDownload />
        </div>
        {error && <div className="error-banner">{error}</div>}
        {entries.length > 0 && (
          <div className="stats-bar">
            Showing <strong>{filteredEntries.length}</strong> of{' '}
            <strong>{entries.length}</strong> entries
          </div>
        )}
        {entries.length > 0 && (
          <>
            <FilterPanel entries={entries} filters={filters} onChange={setFilters} />
            <TimetableGrid entries={filteredEntries} />
          </>
        )}
      </main>
      <footer className="app-footer">
        <p>Timetable App — all processing happens in your browser, no data is uploaded.</p>
      </footer>
    </div>
  );
}

export default App;
