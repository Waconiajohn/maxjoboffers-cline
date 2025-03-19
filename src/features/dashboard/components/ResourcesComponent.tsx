import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getResources } from 'wasp/queries/resources';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const ResourcesComponent: React.FC = () => {
  const { data: resources, isLoading, error } = useQuery(getResources);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Career Resources</h1>
        <div className="text-center py-12">
          <p className="text-lg">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Career Resources</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>Error loading resources: {error.message}</p>
        </div>
      </div>
    );
  }

  // Get unique categories
  const categories = Array.from(new Set(resources.map((resource: Resource) => resource.category)));

  // Filter resources by category and search query
  const filteredResources = resources.filter((resource: Resource) => {
    const matchesCategory = selectedCategory ? resource.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Career Resources</h1>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 mb-2" htmlFor="search">
              Search Resources
            </label>
            <input
              id="search"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 mb-2" htmlFor="category">
              Filter by Category
            </label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource: Resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{resource.title}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {resource.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  View Resource
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No resources found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Resource Categories */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Resource Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryResources = resources.filter((r: Resource) => r.category === category);
            return (
              <div
                key={category}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedCategory === category ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <h3 className="text-lg font-medium mb-2">{category}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {categoryResources.length} {categoryResources.length === 1 ? 'resource' : 'resources'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(
                    new Set(categoryResources.flatMap((r: Resource) => r.tags).slice(0, 3))
                  ).map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {categoryResources.flatMap((r: Resource) => r.tags).length > 3 && (
                    <span className="text-gray-500 text-xs">+ more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResourcesComponent;
