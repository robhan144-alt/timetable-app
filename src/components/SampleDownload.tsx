import { Download } from 'lucide-react';
import { generateSampleExcel } from '../utils/excelParser';

export default function SampleDownload() {
  return (
    <div className="sample-download">
      <p className="sample-text">
        Need a template? Download a sample Excel file to see the expected format.
      </p>
      <button className="sample-btn" onClick={generateSampleExcel}>
        <Download size={16} /> Download Sample
      </button>
    </div>
  );
}
