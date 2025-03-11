import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { Link, useParams } from 'wasp/client/router';
import { getLinkedInPostById } from 'wasp/queries/linkedinContent';

const LinkedInPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useQuery(getLinkedInPostById, { id });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!post) return <div className="p-4">Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/linkedin-content" className="text-blue-600 hover:text-blue-800">
          &larr; Back to LinkedIn Content
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Post Content</h2>
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Hashtags</h2>
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag: string, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {post.suggestedImage && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Suggested Image</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>{post.suggestedImage}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Engagement Tips</h2>
          <ul className="list-disc pl-5">
            {post.engagementTips.map((tip: string, index: number) => (
              <li key={index} className="mb-2">{tip}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Copy to Clipboard</h2>
          <button
            onClick={() => {
              navigator.clipboard.writeText(post.content);
              alert('Post content copied to clipboard!');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-4"
          >
            Copy Content
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(post.hashtags.map((tag: string) => `#${tag}`).join(' '));
              alert('Hashtags copied to clipboard!');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Copy Hashtags
          </button>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Share</h2>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0077B5] text-white px-4 py-2 rounded-md hover:bg-[#006699] inline-flex items-center"
          >
            Share on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPostPage;
