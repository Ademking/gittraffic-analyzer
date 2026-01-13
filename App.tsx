import React, { useState, useEffect } from 'react';
import { TokenInput } from './components/TokenInput';
import { Dashboard } from './components/Dashboard';
import { GithubUser } from './types';
import { fetchUser } from './services/githubService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('gh_traffic_token');
    if (storedToken) {
      handleTokenSubmit(storedToken);
    }
  }, []);

  const handleTokenSubmit = async (newToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchUser(newToken);
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('gh_traffic_token', newToken);
    } catch (err: any) {
      setError(err.message || 'Failed to validate token');
      setToken(null);
      localStorage.removeItem('gh_traffic_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gh_traffic_token');
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-github-darker">
        <Loader2 className="w-10 h-10 text-github-accent animate-spin" />
      </div>
    );
  }

  if (!token || !user) {
    return <TokenInput onSubmit={handleTokenSubmit} error={error} loading={loading} />;
  }

  return <Dashboard token={token} user={user} onLogout={handleLogout} />;
};

export default App;