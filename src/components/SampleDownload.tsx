import { Download } from 'lucide-react';
import { generateSampleCsv } from '../utils/excelParser';

export default function SampleDownload() {
  return (
    <div className="sample-download">
      <p className="sample-text">
        Need a template? Download a sample CSV to see the expected column format, then save it as .xlsx to upload.
      </p>
      <button className="sample-btn" onClick={generateSampleCsv}>
        <Download size={16} /> Download Sample (CSV)
      </button>
    </div>
  );
}
