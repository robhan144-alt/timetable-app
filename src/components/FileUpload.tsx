import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
  fileName: string | null;
}

export default function FileUpload({ onUpload, loading, fileName }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        alert('Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {loading ? (
        <div className="upload-inner">
          <div className="spinner" />
          <p>Parsing file…</p>
        </div>
      ) : fileName ? (
        <div className="upload-inner">
          <FileSpreadsheet size={36} className="upload-icon success" />
          <p className="upload-filename">{fileName}</p>
          <p className="upload-hint">Drop a new file or click to replace</p>
          <label className="upload-btn secondary">
            <Upload size={16} /> Replace File
            <input type="file" accept=".xlsx,.xls" onChange={handleChange} hidden />
          </label>
        </div>
      ) : (
        <div className="upload-inner">
          <Upload size={40} className="upload-icon" />
          <p className="upload-title">Drag &amp; drop your timetable Excel file here</p>
          <p className="upload-hint">Supports .xlsx and .xls files</p>
          <label className="upload-btn">
            Browse File
            <input type="file" accept=".xlsx,.xls" onChange={handleChange} hidden />
          </label>
        </div>
      )}
    </div>
  );
}
