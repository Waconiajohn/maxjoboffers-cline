import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { Link, useParams } from 'wasp/client/router';
import { getNetworkingStrategyById } from 'wasp/queries/linkedinContent';

const NetworkingStrategyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: strategy, isLoading, error } = useQuery(getNetworkingStrategyById, { id });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!strategy) return <div className="p-4">Strategy not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/linkedin-content" className="text-blue-600 hover:text-blue-800">
          &larr; Back to LinkedIn Content
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">LinkedIn Networking Strategy</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Executive Summary</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="whitespace-pre-wrap">{strategy.summary}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Connection Strategies</h2>
          <div className="grid gap-4">
            {strategy.connectionStrategies.map((s: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-xl font-medium mb-2">{s.title}</h3>
                <p className="mb-3">{s.description}</p>
                <div>
                  <h4 className="font-medium mb-2">Action Items:</h4>
                  <ul className="list-disc pl-5">
                    {s.actionItems.map((item: string, i: number) => (
                      <li key={i} className="mb-1">{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-medium">Timeframe: </span>
                  <span className="text-sm">{s.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Content Strategy</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Recommended Topics</h3>
              <ul className="list-disc pl-5">
                {strategy.contentStrategy.recommendedTopics.map((topic: string, index: number) => (
                  <li key={index} className="mb-1">{topic}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Posting Frequency</h3>
              <p>{strategy.contentStrategy.postingFrequency}</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Content Types</h3>
              <ul className="list-disc pl-5">
                {strategy.contentStrategy.contentTypes.map((type: string, index: number) => (
                  <li key={index} className="mb-1">{type}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Outreach Templates</h2>
          <div className="grid gap-4">
            {strategy.outreachTemplates.map((template: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-xl font-medium mb-2">{template.scenario}</h3>
                <div className="mb-3">
                  <h4 className="font-medium mb-2">Template:</h4>
                  <div className="bg-white p-3 border border-gray-200 rounded-md whitespace-pre-wrap">
                    {template.template}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(template.template);
                      alert('Template copied to clipboard!');
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Copy to clipboard
                  </button>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Follow-up Strategy:</h4>
                  <p>{template.followUpStrategy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Key Performance Indicators</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Metric</th>
                  <th className="px-4 py-2 text-left">Target</th>
                  <th className="px-4 py-2 text-left">Timeframe</th>
                </tr>
              </thead>
              <tbody>
                {strategy.kpis.map((kpi: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 border-t">{kpi.metric}</td>
                    <td className="px-4 py-2 border-t">{kpi.target}</td>
                    <td className="px-4 py-2 border-t">{kpi.timeframe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Download Strategy</h2>
          <button
            onClick={() => {
              const content = `
# LinkedIn Networking Strategy

## Executive Summary
${strategy.summary}

## Connection Strategies
${strategy.connectionStrategies.map((s: any) => `
### ${s.title}
${s.description}

**Action Items:**
${s.actionItems.map((item: string) => `- ${item}`).join('\n')}

**Timeframe:** ${s.timeframe}
`).join('\n')}

## Content Strategy

### Recommended Topics
${strategy.contentStrategy.recommendedTopics.map((topic: string) => `- ${topic}`).join('\n')}

### Posting Frequency
${strategy.contentStrategy.postingFrequency}

### Content Types
${strategy.contentStrategy.contentTypes.map((type: string) => `- ${type}`).join('\n')}

## Outreach Templates
${strategy.outreachTemplates.map((t: any) => `
### ${t.scenario}

**Template:**
${t.template}

**Follow-up Strategy:**
${t.followUpStrategy}
`).join('\n')}

## Key Performance Indicators
${strategy.kpis.map((kpi: any) => `- **${kpi.metric}:** ${kpi.target} (${kpi.timeframe})`).join('\n')}
`;

              const blob = new Blob([content], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'linkedin-networking-strategy.md';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Download as Markdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkingStrategyPage;
