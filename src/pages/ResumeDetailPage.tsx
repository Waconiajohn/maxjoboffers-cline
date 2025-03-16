import React, { useState } from 'react';
import { useParams, Link } from 'wasp/client/router';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { getResumeById } from 'wasp/queries/resume';
import { analyzeResume, changeResumeFormat } from 'wasp/actions/resume';

const ResumeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: resume, isLoading, error } = useQuery(getResumeById, { id });
  
  const [analyzeResumeAction] = useAction(analyzeResume);
  const [changeResumeFormatAction] = useAction(changeResumeFormat);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChangingFormat, setIsChangingFormat] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  
  const handleAnalyzeResume = async () => {
    if (!resume) return;
    
    setIsAnalyzing(true);
    try {
      await analyzeResumeAction({ resumeId: resume.id });
      // The query will automatically refetch with the updated resume
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleChangeFormat = async (format: string) => {
    if (!resume) return;
    
    setIsChangingFormat(true);
    try {
      await changeResumeFormatAction({ resumeId: resume.id, format });
      // The query will automatically refetch with the updated resume
      setShowFormatOptions(false);
    } catch (error) {
      console.error('Error changing resume format:', error);
    } finally {
      setIsChangingFormat(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading resume</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!resume) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Resume not found</h3>
        <p className="mt-2 text-sm text-gray-600">The resume you're looking for doesn't exist or has been deleted.</p>
        <div className="mt-6">
          <Link to="/resumes" className="text-blue-600 hover:text-blue-800">
            Back to Resumes
          </Link>
        </div>
      </div>
    );
  }
  
  const formatOptions = [
    { id: 'chronological', name: 'Chronological' },
    { id: 'functional', name: 'Functional' },
    { id: 'combination', name: 'Combination' },
    { id: 'targeted', name: 'Targeted' },
    { id: 'executive', name: 'Executive' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/resumes" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Resumes
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{resume.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Version {resume.version} • Last updated {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowFormatOptions(!showFormatOptions)}
                disabled={isChangingFormat}
              >
                {isChangingFormat ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Changing Format...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Change Format
                  </>
                )}
              </button>
              
              {showFormatOptions && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {formatOptions.map((format) => (
                      <button
                        key={format.id}
                        onClick={() => handleChangeFormat(format.id)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          resume.format === format.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        role="menuitem"
                      >
                        {format.name}
                        {resume.format === format.id && (
                          <span className="ml-2 text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                resume.isAtsOptimized
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={handleAnalyzeResume}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Optimizing...
                </>
              ) : resume.isAtsOptimized ? (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ATS Optimized
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Optimize for ATS
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Resume content */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: resume.content }} />
          </div>
        </div>
      </div>
      
      {/* Download and share options */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Resume Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {resume.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="-ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Original
              </a>
            )}
            
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="-ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Export as PDF
            </button>
            
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="-ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetailPage;
