import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './ErrorReportGenerator.css';

const ErrorReportGenerator = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [reportData, setReportData] = useState([]);

  const handleFileSelect = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const generateReport = async () => {
    const errorReport = [];

    for (const file of selectedFiles) {
      const report = await executeCode(file);
      errorReport.push(report);
    }

    setReportData(errorReport);
  };

  const executeCode = async (file) => {
    try {
      const runtimeResponse = await axios.get(
        'https://emkc.org/api/v2/piston/runtimes'
      );
      const runtimes = runtimeResponse.data;

      const pythonRuntime = runtimes.find(
        (runtime) => runtime.language === 'python'
      );

      const fileContent = await readFileContent(file);
      const executionResponse = await axios.post(
        'https://emkc.org/api/v2/piston/execute',
        {
          language: pythonRuntime.language,
          version: pythonRuntime.version,
          files: [
            {
              name: file.name,
              content: fileContent,
            },
          ],
        }
      );

      console.log('Execution response:', executionResponse);

      if (executionResponse.status === 200) {
        const report = {
          fileName: file.name,
          code: fileContent,
          language: pythonRuntime.language,
          executionTime: executionResponse.data.time,
          reportGenerationTime: new Date().toLocaleString(),
        };

        return report;
      } else {
        return {
          fileName: file.name,
          error: 'An error occurred while executing the code.',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        fileName: file.name,
        error: 'An error occurred while executing the code.',
      };
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target.result;
        resolve(content);
      };

      reader.onerror = (event) => {
        reject(new Error('Error reading file.'));
      };

      reader.readAsText(file);
    });
  };

  const generatePdfReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Error Report', 15, 15);

    let y = 30;

    for (const item of reportData) {
      doc.setFontSize(12);
      doc.text(`File Name: ${item.fileName}`, 15, y + 10);
      doc.text(`Language: ${item.language}`, 15, y + 20);
      doc.text(`Execution Time: ${item.executionTime} ms`, 15, y + 30);
      doc.text(`Report Generation Time: ${item.reportGenerationTime}`, 15, y + 40);
      
      doc.setFontSize(12);
      doc.text(`Code:`, 15, y + 60);
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);
      doc.text(item.code, 15, y + 65);

      y += 100;
    }

    doc.save('error_report.pdf');
  };

  return (
    <div>
      <input type="file" multiple className="upload-button" onChange={handleFileSelect} />
      <button className="generate-button" onClick={generateReport}>Generate Report</button>

      <table className="report-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Report</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.fileName}</td>
              <td>
                {item.error ? (
                  <span className="error-message">{item.error}</span>
                ) : (
                  <button className="download-button" onClick={generatePdfReport}>Download Report</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorReportGenerator;
