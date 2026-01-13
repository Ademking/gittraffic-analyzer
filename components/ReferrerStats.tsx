import React, { useMemo } from 'react';
import { Referrer, GithubRepo } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Eye, Users, MousePointer2, ExternalLink } from 'lucide-react';

interface ReferrerStatsProps {
  referrers: Referrer[];
  repo: GithubRepo;
  loading: boolean;
  error: string | null;
}

const COLORS = ['#58a6ff', '#238636', '#a371f7', '#f1e05a', '#f85149', '#ea4aaa', '#ff7b72', '#d2a8ff'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-github-dark border border-github-border p-3 rounded shadow-xl">
        <p className="font-semibold text-github-text mb-1">{label}</p>
        <p className="text-sm text-blue-400">
          Views: <span className="font-mono">{payload[0].value}</span>
        </p>
        {payload[1] && (
          <p className="text-sm text-green-400">
            Uniques: <span className="font-mono">{payload[1].value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const ReferrerStats: React.FC<ReferrerStatsProps> = ({ referrers, repo, loading, error }) => {
  const stats = useMemo(() => {
    const totalViews = referrers.reduce((acc, curr) => acc + curr.count, 0);
    const totalUniques = referrers.reduce((acc, curr) => acc + curr.uniques, 0);
    return { totalViews, totalUniques };
  }, [referrers]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center h-full">
         <div className="text-center space-y-4">
             <div className="w-12 h-12 border-4 border-github-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
             <p className="text-gray-400">Fetching traffic data...</p>
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center h-full">
        <div className="text-center max-w-md bg-github-dark border border-red-900/50 p-6 rounded-lg">
          <h3 className="text-red-400 font-bold text-lg mb-2">Error Loading Traffic</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (referrers.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center h-full text-center">
         <div className="bg-github-dark p-8 rounded-lg border border-github-border max-w-lg">
             <MousePointer2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
             <h3 className="text-xl font-semibold text-github-text mb-2">No Referral Traffic</h3>
             <p className="text-gray-400">
               We couldn't find any referrer data for <strong>{repo.name}</strong> in the last 14 days. 
               This usually means the repository hasn't been visited from external links recently.
             </p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-github-darker">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-github-border">
          <div>
            <h2 className="text-2xl font-bold text-github-text flex items-center gap-2">
              {repo.name}
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-github-accent">
                <ExternalLink className="w-5 h-5" />
              </a>
            </h2>
            <p className="text-gray-400 text-sm mt-1">{repo.description || 'No description'}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-github-dark px-3 py-1.5 rounded-full border border-github-border">
             Last 14 Days Data
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-github-dark border border-github-border rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Referral Views</p>
              <p className="text-3xl font-bold text-github-text">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="bg-github-dark border border-github-border rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Unique Visitors</p>
              <p className="text-3xl font-bold text-github-text">{stats.totalUniques.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Bar Chart */}
            <div className="lg:col-span-2 bg-github-dark border border-github-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-github-text mb-6">Top Referrers</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={referrers} layout="vertical" margin={{ left: 20, right: 20, top: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
                            <XAxis type="number" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis dataKey="referrer" type="category" width={100} stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#21262d' }} />
                            <Bar dataKey="count" fill="#58a6ff" radius={[0, 4, 4, 0]} barSize={20} name="Views" />
                            <Bar dataKey="uniques" fill="#238636" radius={[0, 4, 4, 0]} barSize={20} name="Uniques" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart Distribution */}
            <div className="bg-github-dark border border-github-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-github-text mb-6">Traffic Share</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={referrers}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="referrer"
                            >
                                {referrers.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9' }}
                                itemStyle={{ color: '#c9d1d9' }}
                            />
                            <Legend 
                                layout="horizontal" 
                                verticalAlign="bottom" 
                                align="center"
                                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-github-dark border border-github-border rounded-lg overflow-hidden">
             <div className="px-6 py-4 border-b border-github-border">
                <h3 className="text-lg font-semibold text-github-text">Referrer Details</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-github-hover text-xs uppercase text-gray-300">
                        <tr>
                            <th className="px-6 py-3 font-medium">Source</th>
                            <th className="px-6 py-3 font-medium text-right">Total Views</th>
                            <th className="px-6 py-3 font-medium text-right">Unique Visitors</th>
                            <th className="px-6 py-3 font-medium text-right w-32">Visualize</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-github-border">
                        {referrers.map((ref, idx) => (
                            <tr key={idx} className="hover:bg-github-hover/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-github-text">{ref.referrer}</td>
                                <td className="px-6 py-4 text-right font-mono text-blue-400">{ref.count}</td>
                                <td className="px-6 py-4 text-right font-mono text-green-400">{ref.uniques}</td>
                                <td className="px-6 py-4">
                                    <div className="h-2 w-full bg-github-border rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-github-accent" 
                                            style={{ width: `${(ref.count / stats.totalViews) * 100}%` }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>

      </div>
    </div>
  );
};