import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { searchJobs } from 'wasp/actions/job';
import { Link } from 'wasp/client/router';

const JobSearch: React.FC = () => {
  // Search form state
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(25);
  const [workType, setWorkType] = useState('all');
  const [datePosted, setDatePosted] = useState('all');
  const [minSalary, setMinSalary] = useState<number | ''>('');
  const [maxSalary, setMaxSalary] = useState<number | ''>('');

  // Search results state
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Action
  const [searchJobsAction, { isLoading }] = useAction(searchJobs);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const results = await searchJobsAction({
        query,
        location,
        radius,
        filters: {
          workType: workType !== 'all' ? workType : undefined,
          datePosted: datePosted !== 'all' ? datePosted : undefined,
          minSalary: minSalary !== '' ? Number(minSalary) : undefined,
          maxSalary: maxSalary !== '' ? Number(maxSalary) : undefined
        }
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Format salary range
  const formatSalary = (salary: any) => {
    if (!salary) return 'Not specified';
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Search</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="query">
                Job Title, Keywords, or Company
              </label>
              <input
                id="query"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Software Engineer, Marketing, Google"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA, Remote"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="radius">
                Radius (miles)
              </label>
              <select
                id="radius"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              >
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="workType">
                Work Type
              </label>
              <select
                id="workType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="datePosted">
                Date Posted
              </label>
              <select
                id="datePosted"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={datePosted}
                onChange={(e) => setDatePosted(e.target.value)}
              >
                <option value="all">Any time</option>
                <option value="today">Today</option>
                <option value="3days">Last 3 days</option>
                <option value="week">Last week</option>
                <option value="month">Last month</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Salary Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Min"
                  min="0"
                />
                <span>-</span>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search Jobs'}
            </button>
          </div>
        </form>
      </div>

      {isSearching ? (
        <div className="text-center py-8">
          <p className="text-lg">Searching for jobs...</p>
        </div>
      ) : searchResults ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {searchResults.totalCount} {searchResults.totalCount === 1 ? 'Job' : 'Jobs'} Found
            </h2>
            <div className="text-sm text-gray-500">
              Showing {searchResults.jobs.length} of {searchResults.totalCount} results
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {searchResults.jobs.map((job: any) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                    <p className="text-lg font-medium">{job.company}</p>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700 font-medium">
                      {formatSalary(job.salary)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700">
                    {job.description.length > 300
                      ? `${job.description.substring(0, 300)}...`
                      : job.description}
                  </p>
                </div>
                
                {job.requirements && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <p className="text-gray-700">
                      {job.requirements.length > 200
                        ? `${job.requirements.substring(0, 200)}...`
                        : job.requirements}
                    </p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-between items-center">
                  <Link
                    to={`/job/${job.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </Link>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // This would be implemented to save the job
                        alert('Job saved!');
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Save
                    </button>
                    <Link
                      to={`/apply/${job.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default JobSearch;
