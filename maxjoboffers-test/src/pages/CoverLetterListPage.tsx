import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { getCoverLetters } from 'wasp/queries/coverLetter';
import { deleteCoverLetter } from 'wasp/actions/coverLetter';

const CoverLetterListPage: React.FC = () => {
  const { data: coverLetters, isLoading, error, refetch } = useQuery(getCoverLetters);
  const [deleteCoverLetterAction] = useAction(deleteCoverLetter);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [filterText, setFilterText] = useState('');

  const handleDeleteCoverLetter = async (id: string) => {
    try {
      await deleteCoverLetterAction({ id });
      refetch();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting cover letter:', error);
    }
  };

  const sortedAndFilteredCoverLetters = () => {
    if (!coverLetters) return [];
    
    let filtered = coverLetters.filter(letter => 
      letter.title.toLowerCase().includes(filterText.toLowerCase())
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
        <h1 className="text-3xl font-bold">My Cover Letters</h1>
        <Link
          to="/cover-letters/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Cover Letter
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <label className="block text-gray-700 mb-2" htmlFor="filter">
              Search Cover Letters
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
            <p className="text-gray-500">Loading your cover letters...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            <p>Error loading cover letters: {error.message}</p>
          </div>
        ) : !coverLetters || coverLetters.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <h3 className="text-xl font-medium mb-2">No Cover Letters Found</h3>
            <p className="text-gray-600 mb-4">
              You haven't created any cover letters yet. Create your first cover letter to get started.
            </p>
            <Link
              to="/cover-letters/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
            >
              Create Cover Letter
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4">
              {sortedAndFilteredCoverLetters().map((letter) => (
                <div
                  key={letter.id}
                  className="border rounded-md p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-xl font-medium">
                        <Link
                          to={`/cover-letters/${letter.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {letter.title}
                        </Link>
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <span>Last updated: {formatDate(letter.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                      <Link
                        to={`/cover-letters/${letter.id}`}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-md"
                      >
                        View
                      </Link>
                      <Link
                        to={`/cover-letters/${letter.id}/edit`}
                        className="text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-md"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(letter.id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Preview of cover letter content */}
                  <div className="mt-3">
                    <p className="text-gray-700 line-clamp-2">
                      {letter.content.substring(0, 200)}...
                    </p>
                  </div>

                  {confirmDelete === letter.id && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                      <p className="text-red-700 mb-2">
                        Are you sure you want to delete this cover letter? This action cannot be undone.
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteCoverLetter(letter.id)}
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
                      to={`/cover-letters/${letter.id}/download`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Download
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to={`/cover-letters/${letter.id}/duplicate`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Duplicate
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to={`/jobs?coverLetterId=${letter.id}`}
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
        <h2 className="text-2xl font-semibold mb-4">Cover Letter Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Personalize for Each Job</h3>
            <p className="text-gray-700">
              Tailor your cover letter to each specific job application. Reference the company name, position, and how your skills match their requirements.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Show, Don't Tell</h3>
            <p className="text-gray-700">
              Instead of just stating your qualifications, provide specific examples of how you've used your skills to achieve results in previous roles.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Keep It Concise</h3>
            <p className="text-gray-700">
              Aim for 3-4 paragraphs and no more than one page. Recruiters often scan cover letters quickly, so make every word count.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Address the Hiring Manager</h3>
            <p className="text-gray-700">
              Whenever possible, address your cover letter to a specific person rather than using "To Whom It May Concern" or "Dear Hiring Manager."
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/cover-letter-templates"
            className="text-blue-600 hover:text-blue-800"
          >
            Browse Cover Letter Templates
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">AI-Powered Cover Letter Generation</h2>
        <p className="text-gray-700 mb-4">
          Our AI can create personalized cover letters based on your resume and the job description. Simply provide the job details, and we'll generate a tailored cover letter that highlights your relevant skills and experience.
        </p>
        <div className="flex justify-center">
          <Link
            to="/cover-letters/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Generate Cover Letter with AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterListPage;
