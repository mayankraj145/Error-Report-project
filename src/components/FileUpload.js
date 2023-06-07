import React from 'react';

function FileUpload({ setFiles }) {
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
  };

  return (
    <div>
      {/* <input type="file" multiple onChange={handleFileUpload} /> */}
    </div>
  );
}

export default FileUpload;
