import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ErrorReportGenerator from './components/ErrorReportGenerator';
import './App.css';

import logo from './log.png'; // Replace './path/to/logo.png' with the actual path to your logo image file

function App() {
  const [files, setFiles] = useState([]);
  return (
    <div className="my-app-container">
      <img src={logo} alt="Logo" className="my-app-logo" /> {/* Add the logo image */}
      <h1 className="my-app-title">Code Error Reporter</h1>
      <FileUpload setFiles={setFiles} />
      <ErrorReportGenerator files={files} />
    </div>
  );
}

export default App;
