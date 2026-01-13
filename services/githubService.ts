import { GithubRepo, GithubUser, Referrer } from '../types';

const API_BASE = 'https://api.github.com';

const getHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

export const fetchUser = async (token: string): Promise<GithubUser> => {
  const response = await fetch(`${API_BASE}/user`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Invalid token');
    throw new Error('Failed to fetch user');
  }

  return response.json();
};

export const fetchRepos = async (token: string, page = 1, perPage = 100): Promise<GithubRepo[]> => {
  // Fetching user repos sorted by update time to show most relevant first
  const response = await fetch(`${API_BASE}/user/repos?sort=updated&direction=desc&per_page=${perPage}&page=${page}`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }

  return response.json();
};

export const fetchReferrers = async (token: string, owner: string, repo: string): Promise<Referrer[]> => {
  const response = await fetch(`${API_BASE}/repos/${owner}/${repo}/traffic/popular/referrers`, {
    headers: getHeaders(token),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Access denied. Push access is required to view traffic data.');
    }
    if (response.status === 404) {
      // Sometimes 404 means no data or repo not found, but API spec says 404 if not found
      return []; 
    }
    throw new Error('Failed to fetch traffic data');
  }

  return response.json();
};
