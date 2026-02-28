import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [correctedImg, setCorrectedImg] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setCorrectedImg('');
      setResult('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      setResult(response.data.result);
      setCorrectedImg(response.data.corrected_image);
    } catch (err) {
      setError('Error processing image with OpenAI. Check your API key.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult('');
    setCorrectedImg('');
    setError('');
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <div className="header">
          <h1 className="title">✨ AI Vision Analyzer</h1>
          <p className="subtitle">Powered by GPT-4o</p>
        </div>

        <div className="content-section">
          
          <div className="input-panel">
            <div className="upload-area">
              <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} className="file-input" />
              <label htmlFor="fileInput" className="upload-label">
                {preview ? <img src={preview} alt="Original" className="mini-preview" /> : <div className="upload-icon">🖼️</div>}
                <p>Click to change image</p>
              </label>
            </div>

            <div className="input-actions">
              <button onClick={handleUpload} disabled={isLoading || !file} className="btn btn-primary">
                {isLoading ? "Analyzing..." : "🚀 Process & Analyze"}
              </button>
              <button onClick={handleClear} className="btn btn-secondary">Clear</button>
            </div>
          </div>


          <div className="output-panel">
            <div className="response-box">
              {error && <p className="error-message">{error}</p>}
              
              {correctedImg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="result-container">
                  <h3>Enhanced Image:</h3>
                  <img src={correctedImg} alt="Corrected" className="main-result-img" />
                  <div className="analysis-text">
                    <h4>AI Description:</h4>
                    <p>{result}</p>
                  </div>
                </motion.div>
              )}

              {!correctedImg && !isLoading && <p className="placeholder-text">Waiting for image...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;