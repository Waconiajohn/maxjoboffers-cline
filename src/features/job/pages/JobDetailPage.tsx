import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { Link, useParams } from 'wasp/client/router';
import { getJobById } from 'wasp/queries/job';
import { getResumes } from 'wasp/queries/resume';
import { getCoverLetters } from 'wasp/queries/coverLetter';
import { applyToJob } from 'wasp/actions/job';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading: jobLoading, error: jobError } = useQuery(getJobById, { id });
  const { data: resumes, isLoading: resumesLoading } = useQuery(getResumes);
  const { data: coverLetters, isLoading: coverLettersLoading } = useQuery(getCoverLetters);

  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<string>('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  const [applyToJobAction, { isLoading: isApplying }] = useAction(applyToJob);

  if (jobLoading) return <div className="p-4">Loading job details...</div>;
  if (jobError) return <div className="p-4 text-red-500">Error: {jobError.message}</div>;
  if (!job) return <div className="p-4">Job not found</div>;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedResumeId) {
      alert('Please select a resume');
      return;
    }
    
    try {
      await applyToJobAction({
        jobId: id,
        resumeId: selectedResumeId,
        coverLetterId: selectedCoverLetterId || undefined
      });
      
      alert('Application submitted successfully!');
      setShowApplyForm(false);
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  // Format salary range
  const formatSalary = (salary: any) => {
    if (!salary) return 'Not specified';
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/jobs" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Job Search
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <div className="flex flex-col md:flex-row md:justify-between mt-2">
            <div>
              <p className="text-xl font-medium">{job.company}</p>
              <p className="text-gray-600">{job.location}</p>
            </div>
            <div className="mt-2 md:mt-0 md:text-right">
              <p className="text-gray-700 font-medium">Salary: {formatSalary(job.salary)}</p>
              <p className="text-gray-500 text-sm">Source: {job.source || 'Direct listing'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Job Description</h2>
          <div className="text-gray-700 whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {job.requirements && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Requirements</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {job.requirements}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:justify-between items-center border-t pt-6">
          <div>
            {job.applicationUrl && (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block mr-4"
              >
                Apply on Company Website
              </a>
            )}
          </div>
          
          <button
            onClick={() => setShowApplyForm(!showApplyForm)}
            className="mt-4 md:mt-0 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            {showApplyForm ? 'Cancel' : 'Apply with MaxJobOffers'}
          </button>
        </div>

        {showApplyForm && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Apply to this Job</h2>
            
            {resumesLoading ? (
              <p>Loading your resumes...</p>
            ) : !resumes || resumes.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
                <p className="text-yellow-800">
                  You don't have any resumes yet. Please upload a resume first.
                </p>
                <Link
                  to="/resumes/new"
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                >
                  Upload Resume
                </Link>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="resume">
                    Select Resume*
                  </label>
                  <select
                    id="resume"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    required
                  >
                    <option value="">-- Select a Resume --</option>
                    {resumes.map((resume: any) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.title}
                      </option>
                    ))}
                  </select>
                  {selectedResumeId && (
                    <div className="mt-2">
                      <Link
                        to={`/resumes/${selectedResumeId}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Resume
                      </Link>
                      <span className="mx-2 text-gray-400">|</span>
                      <Link
                        to={`/resumes/${selectedResumeId}/optimize?jobId=${id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Optimize for this Job
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="coverLetter">
                    Select Cover Letter (Optional)
                  </label>
                  {coverLettersLoading ? (
                    <p>Loading cover letters...</p>
                  ) : !coverLetters || coverLetters.length === 0 ? (
                    <div className="flex items-center">
                      <p className="text-gray-500">No cover letters available.</p>
                      <Link
                        to={`/cover-letters/new?jobId=${id}`}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        Generate Cover Letter
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <select
                        id="coverLetter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={selectedCoverLetterId}
                        onChange={(e) => setSelectedCoverLetterId(e.target.value)}
                      >
                        <option value="">-- No Cover Letter --</option>
                        {coverLetters.map((letter: any) => (
                          <option key={letter.id} value={letter.id}>
                            {letter.title}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2">
                        <Link
                          to={`/cover-letters/new?jobId=${id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Generate New Cover Letter
                        </Link>
                        {selectedCoverLetterId && (
                          <>
                            <span className="mx-2 text-gray-400">|</span>
                            <Link
                              to={`/cover-letters/${selectedCoverLetterId}`}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Cover Letter
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={isApplying || !selectedResumeId}
                  >
                    {isApplying ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Prepare for Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Research the Company</h3>
            <p className="text-gray-700 mb-3">
              Learn about {job.company}'s culture, values, and recent news to stand out in your application.
            </p>
            <Link
              to={`/company-research?company=${encodeURIComponent(job.company)}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Research {job.company}
            </Link>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Optimize Your Resume</h3>
            <p className="text-gray-700 mb-3">
              Tailor your resume to match this job description and increase your chances of getting an interview.
            </p>
            <Link
              to={`/resumes/optimize?jobId=${id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Optimize Resume
            </Link>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Practice Interviews</h3>
            <p className="text-gray-700 mb-3">
              Prepare for potential interview questions specific to this role and company.
            </p>
            <Link
              to={`/interview-prep?jobId=${id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Start Interview Prep
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
