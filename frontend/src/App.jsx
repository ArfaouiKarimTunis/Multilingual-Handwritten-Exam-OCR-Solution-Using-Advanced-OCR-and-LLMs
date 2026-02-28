import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');
    setResult('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      setResult(response.data.message || response.data.result || 'Analysis complete');
    } catch (error) {
      setError('Failed to process image. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult('');
    setError('');
  };

  return (
    <div className="app-wrapper">
      <div className="background-elements">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="app-container">
        <div className="header">
          <h1 className="title">✨ AI Image Analyzer</h1>
          <p className="subtitle">Upload an image and let AI analyze it</p>
        </div>

        <div className="content-section">
          <div className="input-panel">
            <div className="panel-header">
              <h2>📤 Upload Image</h2>
            </div>
            
            <div className="upload-area">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input"
              />
              <label htmlFor="fileInput" className="upload-label">
                <div className="upload-icon">🖼️</div>
                <p className="upload-title">Click to upload or drag image</p>
                <p className="upload-subtitle">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {file && (
              <div className="file-preview">
                <p className="file-name">📁 {file.name}</p>
                <p className="file-size">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            <div className="input-actions">
              <button
                onClick={handleUpload}
                disabled={isLoading || !file}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  <> 🚀 Analyze Image</>
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="btn btn-secondary"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="output-panel">
            <div className="panel-header">
              <h2>📊 Response</h2>
            </div>
            <div className="response-box">
              {error ? (
                <p className="error-message">{error}</p>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="result-text">{result}</p>
                </motion.div>
              ) : (
                <p className="placeholder-text">
                  {isLoading ? '⏳ Processing your image...' : '👇 Upload an image to see results'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;