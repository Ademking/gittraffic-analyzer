import React, { useState } from "react";
import { Key, ExternalLink, Github, Loader2, AlertCircle } from "lucide-react";

interface TokenInputProps {
  onSubmit: (token: string) => void;
  error: string | null;
  loading: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  onSubmit,
  error,
  loading,
}) => {
  const [inputToken, setInputToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim()) {
      onSubmit(inputToken.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-github-darker p-4">
      <div className="max-w-md w-full bg-github-dark border border-github-border rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-github-hover rounded-full flex items-center justify-center mb-4">
            <Github className="w-8 h-8 text-github-text" />
          </div>
          <h1 className="text-2xl font-bold text-github-text">
            GitTraffic Analyzer
          </h1>
          <p className="text-gray-400 text-center mt-2">
            Enter your GitHub Personal Access Token to view repository traffic
            insights.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Personal Access Token
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                id="token"
                className="block w-full pl-10 pr-3 py-2.5 bg-github-darker border border-github-border rounded-md text-github-text placeholder-gray-600 focus:ring-2 focus:ring-github-accent focus:border-transparent outline-none transition-all"
                placeholder="ghp_..."
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-md">
            <h4 className="text-sm font-semibold text-blue-200 mb-2">
              Permissions Required
            </h4>
            <ul className="text-xs text-blue-200/80 list-disc list-inside space-y-1">
              <li>Read access to your repositories</li>
              <li>
                <strong>Repo</strong> scope (required for traffic data)
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || !inputToken}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-github-success hover:bg-[#2c974b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-github-dark focus:ring-github-success transition-colors ${
              loading || !inputToken ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Analyze Traffic"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="https://github.com/settings/tokens/new?scopes=repo&description=GitTraffic%20Analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-github-accent hover:underline"
          >
            You don't have a token? Generate one here
            <ExternalLink className="ml-1 w-3 h-3" />
          </a>
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500">
          <a
            href="https://github.com/Ademking/gittraffic-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-github-accent transition-colors"
          >
            <Github className="w-4 h-4 -mt-1" />
            <span>Star on GitHub</span>
          </a>
          <span className="mx-2 text-gray-600">|</span>
          <span>
            Made by{" "}
            <a
              href="https://github.com/Ademking"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-github-accent transition-colors"
            >
              Adem Kouki
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
};
