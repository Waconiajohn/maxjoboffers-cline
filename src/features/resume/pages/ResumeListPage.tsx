import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { getResumes } from 'wasp/queries/resume';
import { deleteResume } from 'wasp/actions/resume';

const ResumeListPage: React.FC = () => {
  const { data: resumes, isLoading, error, refetch } = useQuery(getResumes);
  const [deleteResumeAction] = useAction(deleteResume);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [filterText, setFilterText] = useState('');

  const handleDeleteResume = async (id: string) => {
    try {
      await deleteResumeAction({ id });
      refetch();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const sortedAndFilteredResumes = () => {
    if (!resumes) return [];
    
    let filtered = resumes.filter(resume => 
      resume.title.toLowerCase().includes(filterText.toLowerCase())
    );
    
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <Link
          to="/resumes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Upload New Resume
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <label className="block text-gray-700 mb-2" htmlFor="filter">
              Search Resumes
            </label>
            <input
              id="filter"
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-md w-full md:w-64"
              placeholder="Search by title..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="sortBy">
              Sort By
            </label>
            <select
              id="sortBy"
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            >
              <option value="date">Last Updated</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading your resumes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            <p>Error loading resumes: {error.message}</p>
          </div>
        ) : !resumes || resumes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <h3 className="text-xl font-medium mb-2">No Resumes Found</h3>
            <p className="text-gray-600 mb-4">
              You haven't uploaded any resumes yet. Upload your first resume to get started.
            </p>
            <Link
              to="/resumes/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
            >
              Upload Resume
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4">
              {sortedAndFilteredResumes().map((resume) => (
                <div
                  key={resume.id}
                  className="border rounded-md p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-xl font-medium">
                        <Link
                          to={`/resumes/${resume.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {resume.title}
                        </Link>
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <span>Last updated: {formatDate(resume.updatedAt)}</span>
                        {resume.isAtsOptimized && (
                          <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                            ATS Optimized
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                      <Link
                        to={`/resumes/${resume.id}`}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-md"
                      >
                        View
                      </Link>
                      <Link
                        to={`/resumes/${resume.id}/edit`}
                        className="text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-md"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(resume.id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {confirmDelete === resume.id && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                      <p className="text-red-700 mb-2">
                        Are you sure you want to delete this resume? This action cannot be undone.
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to={`/resumes/${resume.id}/optimize`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Optimize for ATS
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to={`/resumes/${resume.id}/download`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Download
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to={`/jobs?resumeId=${resume.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Find Matching Jobs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Resume Management Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Keep Multiple Versions</h3>
            <p className="text-gray-700">
              Maintain different versions of your resume tailored to specific industries or job types. This allows you to quickly apply with the most relevant resume.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Optimize for ATS</h3>
            <p className="text-gray-700">
              Use our ATS optimization tool to ensure your resume passes through Applicant Tracking Systems. This increases your chances of getting your resume seen by human recruiters.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Update Regularly</h3>
            <p className="text-gray-700">
              Keep your resumes updated with your latest achievements, skills, and experiences. We recommend reviewing your resumes at least every 3 months.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Match to Job Descriptions</h3>
            <p className="text-gray-700">
              Use our AI tools to tailor your resume to specific job descriptions. This can significantly increase your chances of landing an interview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeListPage;
