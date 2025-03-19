import React, { useState, useCallback } from 'react';
import { useAction } from 'wasp/client/operations';
import { uploadResume } from 'wasp/actions/resume';
import { Link } from 'wasp/client/router';

const ResumeUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadResumeAction] = useAction(uploadResume);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  }, []);

  const handleFileSelection = (selectedFile: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    // Auto-generate title from filename if not set
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setTitle(fileName);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        clearInterval(interval);
        progress = 95; // Hold at 95% until actual completion
      }
      setUploadProgress(Math.min(progress, 95));
    }, 300);
    
    return () => clearInterval(interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!title.trim()) {
      setError('Please provide a title for your resume');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    // Start progress simulation
    const stopProgress = simulateProgress();
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result?.toString().split(',')[1];
        
        if (!base64File) {
          throw new Error('Failed to convert file to base64');
        }
        
        await uploadResumeAction({
          title,
          fileContent: base64File,
          fileName: file.name,
          fileType: file.type
        });
        
        // Complete progress
        setUploadProgress(100);
        setUploadSuccess(true);
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setTitle('');
          setFile(null);
          setUploadProgress(0);
          setIsUploading(false);
        }, 2000);
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
    } catch (err: any) {
      stopProgress();
      setError(err.message || 'Failed to upload resume');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/resumes" className="text-blue-600 hover:text-blue-800">
          &larr; Back to My Resumes
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Upload Resume</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {uploadSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-2">Resume Uploaded Successfully!</h2>
            <p className="mb-6">Your resume has been uploaded and is ready to use.</p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/resumes"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                View All Resumes
              </Link>
              <button
                onClick={() => {
                  setUploadSuccess(false);
                  setTitle('');
                  setFile(null);
                }}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Upload Another Resume
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="title">
                Resume Title*
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Software Engineer Resume 2025"
                required
                disabled={isUploading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Give your resume a descriptive name to easily identify it later
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Resume File*
              </label>
              <div
                className={`border-2 border-dashed rounded-md p-8 text-center ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${file ? 'bg-gray-50' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {file ? (
                  <div>
                    <div className="text-green-500 text-3xl mb-2">✓</div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      className="mt-3 text-blue-600 hover:text-blue-800"
                      onClick={() => setFile(null)}
                      disabled={isUploading}
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 text-4xl mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="font-medium mb-1">Drag & drop your resume here</p>
                    <p className="text-sm text-gray-500 mb-3">or</p>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileInputChange}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-3">
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {isUploading && (
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isUploading || !file}
              >
                {isUploading ? 'Uploading...' : 'Upload Resume'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Resume Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Format Matters</h3>
            <p className="text-gray-700">
              Use a clean, professional format with clear section headings. Avoid fancy graphics or fonts that may not parse well with ATS systems.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Tailor to Job Descriptions</h3>
            <p className="text-gray-700">
              Customize your resume for each job application. Our AI tools can help you optimize your resume for specific job descriptions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Quantify Achievements</h3>
            <p className="text-gray-700">
              Use numbers and metrics to demonstrate your impact. For example, "Increased sales by 20%" is more powerful than "Increased sales."
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Keywords are Key</h3>
            <p className="text-gray-700">
              Include relevant keywords from the job description. Many companies use ATS systems that scan for specific terms.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/resume-templates"
            className="text-blue-600 hover:text-blue-800"
          >
            Browse Resume Templates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
