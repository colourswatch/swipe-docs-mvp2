import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import TinderCard from 'react-tinder-card';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [acceptedFiles, setAcceptedFiles] = useState([]);

  const onDrop = (accepted) => {
    setFiles((prev) => [...prev, ...accepted]);
  };

  const onSwipe = (dir, file) => {
    if (dir === 'right') {
      setAcceptedFiles((prev) => [...prev, file]);
    }
  };

  const downloadZip = () => {
    const zip = new JSZip();
    acceptedFiles.forEach((file) => zip.file(file.name, file));
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'accepted_files.zip');
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv'],
    },
    onDrop,
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Swipe-to-Save Document Sorter</h1>

      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '2rem', marginBottom: '2rem' }}>
        <input {...getInputProps()} />
        <p>Drag and drop files here, or click to upload</p>
      </div>

      <div className="cardContainer" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {files.map((file, index) => (
          <TinderCard
            key={index}
            onSwipe={(dir) => onSwipe(dir, file)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{
                width: '300px',
                height: '200px',
                background: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '1rem',
                margin: '1rem',
              }}
            >
              <h3>{file.name}</h3>
              <p>Type: {file.type}</p>
            </div>
          </TinderCard>
        ))}
      </div>

      {acceptedFiles.length > 0 && (
        <button onClick={downloadZip} style={{ marginTop: '2rem', padding: '1rem' }}>
          Download {acceptedFiles.length} Accepted File(s)
        </button>
      )}
    </div>
  );
}
