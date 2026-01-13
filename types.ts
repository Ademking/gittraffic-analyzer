export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export interface Referrer {
  referrer: string;
  count: number;
  uniques: number;
}
