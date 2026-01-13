import React, { useState, useEffect } from 'react';
import { GithubUser, GithubRepo, Referrer } from '../types';
import { RepoList } from './RepoList';
import { ReferrerStats } from './ReferrerStats';
import { fetchRepos, fetchReferrers } from '../services/githubService';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

interface DashboardProps {
  token: string;
  user: GithubUser;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ token, user, onLogout }) => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingTraffic, setLoadingTraffic] = useState(false);
  const [trafficError, setTrafficError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

  // Initial load of repositories
  useEffect(() => {
    const loadRepos = async () => {
      setLoadingRepos(true);
      try {
        const data = await fetchRepos(token);
        setRepos(data);
        if (data.length > 0) {
          handleSelectRepo(data[0]);
        }
      } catch (error) {
        console.error("Failed to load repos", error);
      } finally {
        setLoadingRepos(false);
      }
    };
    loadRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSelectRepo = async (repo: GithubRepo) => {
    setSelectedRepo(repo);
    setSidebarOpen(false); // Close mobile sidebar on selection
    setLoadingTraffic(true);
    setTrafficError(null);
    setReferrers([]);

    try {
      const data = await fetchReferrers(token, user.login, repo.name);
      // Ensure data is sorted by count desc
      const sortedData = data.sort((a, b) => b.count - a.count);
      setReferrers(sortedData);
    } catch (err: any) {
      setTrafficError(err.message || "Failed to load traffic data");
    } finally {
      setLoadingTraffic(false);
    }
  };

  return (
    <div className="flex h-screen bg-github-darker overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`fixed inset-y-0 left-0 z-30 w-80 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-full border-r border-github-border bg-github-dark shadow-xl md:shadow-none`}>
          <div className="h-16 flex items-center px-4 border-b border-github-border justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
               <div className="p-1.5 bg-github-hover rounded-md border border-github-border">
                  <LayoutDashboard className="w-5 h-5 text-github-text" />
               </div>
               <span className="font-bold text-github-text">My Repositories</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <RepoList 
            repos={repos} 
            selectedRepo={selectedRepo} 
            onSelectRepo={handleSelectRepo}
            loading={loadingRepos}
          />
          
          <div className="p-4 border-t border-github-border bg-github-dark flex-shrink-0">
             <div className="flex items-center gap-3 mb-4 p-2 rounded-md hover:bg-github-hover transition-colors cursor-default">
                <img src={user.avatar_url} alt={user.login} className="w-9 h-9 rounded-full border border-github-border" />
                <div className="overflow-hidden">
                   <p className="text-sm font-semibold text-github-text truncate">{user.name || user.login}</p>
                   <p className="text-xs text-gray-500 truncate">@{user.login}</p>
                </div>
             </div>
             <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-medium text-red-400 border border-red-900/30 hover:bg-red-900/20 hover:border-red-900/50 transition-all"
             >
                <LogOut className="w-3 h-3" /> Sign Out
             </button>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-github-border flex items-center justify-between px-4 bg-github-dark">
           <button onClick={() => setSidebarOpen(true)} className="text-gray-400">
             <Menu className="w-6 h-6" />
           </button>
           <span className="font-semibold text-github-text truncate ml-2 flex-1">
             {selectedRepo ? selectedRepo.name : 'Dashboard'}
           </span>
        </div>

        {selectedRepo ? (
          <ReferrerStats 
            referrers={referrers} 
            repo={selectedRepo}
            loading={loadingTraffic}
            error={trafficError}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-500">
             <div className="max-w-md">
                <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-github-border" />
                <h3 className="text-xl font-semibold text-github-text mb-2">Select a Repository</h3>
                <p>Choose a repository from the sidebar to visualize its traffic sources and visitor insights.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};