import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { getLinkedInPosts, getNetworkingStrategies } from 'wasp/queries/linkedinContent';
import { generateLinkedInPost, generateNetworkingStrategy } from 'wasp/actions/linkedinContent';
import { Link } from 'wasp/client/router';

const LinkedInContent: React.FC = () => {
  // State for post generation form
  const [postTopic, setPostTopic] = useState('');
  const [postIndustry, setPostIndustry] = useState('');
  const [postTone, setPostTone] = useState('professional');
  const [postLength, setPostLength] = useState('medium');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [targetAudience, setTargetAudience] = useState('');

  // State for networking strategy form
  const [industry, setIndustry] = useState('');
  const [careerStage, setCareerStage] = useState('');
  const [goals, setGoals] = useState('');
  const [networkSize, setNetworkSize] = useState('medium');
  const [targetRoles, setTargetRoles] = useState('');
  const [targetCompanies, setTargetCompanies] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('medium');

  // Fetch existing posts and strategies
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery(getLinkedInPosts);
  const { data: strategies, isLoading: strategiesLoading, error: strategiesError } = useQuery(getNetworkingStrategies);

  // Actions
  const [generatePost, { isLoading: isGeneratingPost }] = useAction(generateLinkedInPost);
  const [generateStrategy, { isLoading: isGeneratingStrategy }] = useAction(generateNetworkingStrategy);

  // Handle post generation
  const handleGeneratePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generatePost({
        topic: postTopic,
        industry: postIndustry,
        tone: postTone,
        length: postLength as 'short' | 'medium' | 'long',
        includeHashtags,
        targetAudience: targetAudience || undefined
      });
      // Reset form
      setPostTopic('');
      setPostIndustry('');
      setPostTone('professional');
      setPostLength('medium');
      setIncludeHashtags(true);
      setTargetAudience('');
    } catch (error) {
      console.error('Error generating post:', error);
    }
  };

  // Handle networking strategy generation
  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generateStrategy({
        industry,
        careerStage,
        goals: goals.split(',').map(goal => goal.trim()),
        currentNetworkSize: networkSize as 'small' | 'medium' | 'large',
        targetRoles: targetRoles ? targetRoles.split(',').map(role => role.trim()) : undefined,
        targetCompanies: targetCompanies ? targetCompanies.split(',').map(company => company.trim()) : undefined,
        timeCommitment: timeCommitment as 'low' | 'medium' | 'high'
      });
      // Reset form
      setIndustry('');
      setCareerStage('');
      setGoals('');
      setNetworkSize('medium');
      setTargetRoles('');
      setTargetCompanies('');
      setTimeCommitment('medium');
    } catch (error) {
      console.error('Error generating strategy:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">LinkedIn Content & Networking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LinkedIn Post Generation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Generate LinkedIn Post</h2>
          <form onSubmit={handleGeneratePost}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="postTopic">
                Topic*
              </label>
              <input
                id="postTopic"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={postTopic}
                onChange={(e) => setPostTopic(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="postIndustry">
                Industry*
              </label>
              <input
                id="postIndustry"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={postIndustry}
                onChange={(e) => setPostIndustry(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="postTone">
                Tone
              </label>
              <select
                id="postTone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={postTone}
                onChange={(e) => setPostTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="inspirational">Inspirational</option>
                <option value="educational">Educational</option>
                <option value="thought-provoking">Thought-provoking</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="postLength">
                Length
              </label>
              <select
                id="postLength"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={postLength}
                onChange={(e) => setPostLength(e.target.value)}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="targetAudience">
                Target Audience
              </label>
              <input
                id="targetAudience"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., HR professionals, tech leaders"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={includeHashtags}
                  onChange={(e) => setIncludeHashtags(e.target.checked)}
                />
                <span className="text-gray-700">Include hashtags</span>
              </label>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isGeneratingPost}
            >
              {isGeneratingPost ? 'Generating...' : 'Generate Post'}
            </button>
          </form>
        </div>

        {/* Networking Strategy Generation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Generate Networking Strategy</h2>
          <form onSubmit={handleGenerateStrategy}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="industry">
                Industry*
              </label>
              <input
                id="industry"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="careerStage">
                Career Stage*
              </label>
              <input
                id="careerStage"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={careerStage}
                onChange={(e) => setCareerStage(e.target.value)}
                placeholder="e.g., entry-level, mid-career, executive"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="goals">
                Career Goals* (comma-separated)
              </label>
              <textarea
                id="goals"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g., promotion, career change, leadership role"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="networkSize">
                Current Network Size
              </label>
              <select
                id="networkSize"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={networkSize}
                onChange={(e) => setNetworkSize(e.target.value)}
              >
                <option value="small">Small (&lt; 500 connections)</option>
                <option value="medium">Medium (500-1000 connections)</option>
                <option value="large">Large (&gt; 1000 connections)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="targetRoles">
                Target Roles (comma-separated)
              </label>
              <input
                id="targetRoles"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={targetRoles}
                onChange={(e) => setTargetRoles(e.target.value)}
                placeholder="e.g., Product Manager, CTO, Director of Marketing"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="targetCompanies">
                Target Companies (comma-separated)
              </label>
              <input
                id="targetCompanies"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={targetCompanies}
                onChange={(e) => setTargetCompanies(e.target.value)}
                placeholder="e.g., Google, Microsoft, Amazon"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="timeCommitment">
                Time Commitment
              </label>
              <select
                id="timeCommitment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
              >
                <option value="low">Low (1-2 hours/week)</option>
                <option value="medium">Medium (3-5 hours/week)</option>
                <option value="high">High (6+ hours/week)</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isGeneratingStrategy}
            >
              {isGeneratingStrategy ? 'Generating...' : 'Generate Strategy'}
            </button>
          </form>
        </div>
      </div>

      {/* LinkedIn Posts List */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Your LinkedIn Posts</h2>
        {postsLoading ? (
          <p>Loading posts...</p>
        ) : postsError ? (
          <p className="text-red-500">Error loading posts: {postsError.message}</p>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.content.substring(0, 150)}...</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.hashtags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/linkedin-post/${post.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Full Post
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts yet. Generate your first LinkedIn post above!</p>
        )}
      </div>

      {/* Networking Strategies List */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Your Networking Strategies</h2>
        {strategiesLoading ? (
          <p>Loading strategies...</p>
        ) : strategiesError ? (
          <p className="text-red-500">Error loading strategies: {strategiesError.message}</p>
        ) : strategies && strategies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold mb-2">Networking Strategy</h3>
                <p className="text-gray-700 mb-4">{strategy.summary.substring(0, 200)}...</p>
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900">Key Strategies:</h4>
                  <ul className="list-disc pl-5 mt-2">
                    {strategy.connectionStrategies.slice(0, 2).map((s, index) => (
                      <li key={index} className="text-gray-700">{s.title}</li>
                    ))}
                    {strategy.connectionStrategies.length > 2 && <li>...</li>}
                  </ul>
                </div>
                <Link
                  to={`/networking-strategy/${strategy.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Full Strategy
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No strategies yet. Generate your first networking strategy above!</p>
        )}
      </div>
    </div>
  );
};

export default LinkedInContent;
