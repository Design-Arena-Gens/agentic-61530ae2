'use client';

import { useState, useEffect } from 'react';

interface Status {
  status: string;
  environment: {
    pexelsConfigured: boolean;
    instagramConfigured: boolean;
  };
  stats: {
    totalVideosPosted: number;
    lastPosted: string | null;
  };
  recentLogs: string;
  recentPosts: Array<{
    videoId: number;
    caption: string;
    postedAt: string;
  }>;
}

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState('');

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAutomation = async () => {
    setTriggering(true);
    setMessage('');

    try {
      const response = await fetch('/api/trigger', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Automation triggered successfully!');
        setTimeout(() => fetchStatus(), 2000);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
            ✨ Luxury Instagram Automation
          </h1>
          <p className="text-xl text-gray-300">
            Automated daily luxury lifestyle content for Instagram
          </p>
        </header>

        {/* Configuration Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="mr-2">⚙️</span>
            Configuration Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className={`text-2xl mr-3 ${status?.environment.pexelsConfigured ? '✅' : '❌'}`}>
                {status?.environment.pexelsConfigured ? '✅' : '❌'}
              </span>
              <div>
                <div className="font-semibold">Pexels API</div>
                <div className="text-sm text-gray-300">
                  {status?.environment.pexelsConfigured ? 'Configured' : 'Not configured'}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`text-2xl mr-3 ${status?.environment.instagramConfigured ? '✅' : '❌'}`}>
                {status?.environment.instagramConfigured ? '✅' : '❌'}
              </span>
              <div>
                <div className="font-semibold">Instagram</div>
                <div className="text-sm text-gray-300">
                  {status?.environment.instagramConfigured ? 'Configured' : 'Not configured'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold mb-1">{status?.stats.totalVideosPosted || 0}</div>
            <div className="text-gray-300">Total Videos Posted</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30">
            <div className="text-4xl mb-2">🕐</div>
            <div className="text-lg font-bold mb-1">
              {status?.stats.lastPosted
                ? new Date(status.stats.lastPosted).toLocaleString()
                : 'Never'}
            </div>
            <div className="text-gray-300">Last Posted</div>
          </div>
        </div>

        {/* Manual Trigger */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-4">🚀 Manual Trigger</h2>
          <p className="text-gray-300 mb-4">
            Test the automation by manually triggering a video post
          </p>
          <button
            onClick={triggerAutomation}
            disabled={triggering}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {triggering ? '⏳ Running...' : '▶️ Trigger Now'}
          </button>
          {message && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg">
              <p className="font-mono text-sm">{message}</p>
            </div>
          )}
        </div>

        {/* Recent Posts */}
        {status?.recentPosts && status.recentPosts.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-4">📸 Recent Posts</h2>
            <div className="space-y-4">
              {status.recentPosts.map((post, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">Video #{post.videoId}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(post.postedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm">{post.caption}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Logs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-4">📋 Recent Logs</h2>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {status?.recentLogs || 'No logs yet'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400 text-sm">
          <p>Automated with Next.js • Powered by Pexels API</p>
          <p className="mt-2">
            Schedule: Daily at 10:00 AM (Configure via Vercel Cron or external service)
          </p>
        </footer>
      </div>
    </div>
  );
}
