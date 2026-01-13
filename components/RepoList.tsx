import React, { useState } from 'react';
import { GithubRepo } from '../types';
import { Search, GitFork, Star, Lock, BookMarked } from 'lucide-react';

interface RepoListProps {
  repos: GithubRepo[];
  selectedRepo: GithubRepo | null;
  onSelectRepo: (repo: GithubRepo) => void;
  loading: boolean;
}

const getLanguageColor = (lang: string | null) => {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Ruby: '#701516',
    PHP: '#4F5D95',
    "C++": '#f34b7d',
    C: '#555555',
    Shell: '#89e051',
    Vue: '#41b883',
    React: '#61dafb'
  };
  return lang ? (colors[lang] || '#8b949e') : '#8b949e';
};

export const RepoList: React.FC<RepoListProps> = ({ repos, selectedRepo, onSelectRepo, loading }) => {
  const [search, setSearch] = useState('');

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-github-dark">
      <div className="px-4 py-3 border-b border-github-border sticky top-0 bg-github-dark z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-github-accent transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-1.5 bg-github-darker border border-github-border rounded-md text-sm text-github-text placeholder-gray-600 focus:ring-1 focus:ring-github-accent focus:border-github-accent outline-none transition-all"
            placeholder="Filter repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {loading ? (
          <div className="space-y-2">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="h-16 bg-github-hover/50 rounded-md animate-pulse" />
             ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredRepos.map(repo => {
              const isSelected = selectedRepo?.id === repo.id;
              return (
                <li key={repo.id}>
                  <button
                    onClick={() => onSelectRepo(repo)}
                    className={`w-full text-left p-3 rounded-md transition-all duration-200 flex flex-col gap-2 border ${
                      isSelected 
                        ? 'bg-github-accent/10 border-github-accent/30 shadow-sm' 
                        : 'bg-transparent border-transparent hover:bg-github-hover hover:border-github-border/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        <BookMarked className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-github-accent' : 'text-gray-500'}`} />
                        <span className={`font-semibold text-sm truncate ${isSelected ? 'text-github-accent' : 'text-github-text'}`}>
                          {repo.name}
                        </span>
                      </div>
                      {repo.private && <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                       {repo.language && (
                         <div className="flex items-center gap-1.5">
                            <span 
                              className="w-2 h-2 rounded-full ring-1 ring-white/10"
                              style={{ backgroundColor: getLanguageColor(repo.language) }} 
                            />
                            <span className="truncate max-w-[80px]">{repo.language}</span>
                         </div>
                       )}
                       <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" /> {repo.stargazers_count}
                       </span>
                       <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" /> {repo.forks_count}
                         </span>
                    </div>
                  </button>
                </li>
              );
            })}
            {filteredRepos.length === 0 && (
              <li className="py-8 text-center px-4">
                 <p className="text-sm text-gray-400">No repositories found matching "{search}"</p>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};