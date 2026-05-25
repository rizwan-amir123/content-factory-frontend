import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Dashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/batches/');
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchBatches();
  };

  // Helper mapping to translate platform tags into crisp indicators
  const getPlatformIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('youtube')) return '📺 YouTube';
    if (p.includes('short') || p.includes('reel')) return '📱 Shorts';
    if (p.includes('twitter') || p.includes('x')) return '🐦 Twitter';
    if (p.includes('linkedin')) return '💼 LinkedIn';
    return `📄 ${platform}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-10 antialiased selection:bg-gray-900/10 text-gray-900">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Content Workspace
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage, iterate, and distribute your automated media funnels.
          </p>
        </div>
        
        {/* Action Controls Toolbar Layout */}
        <div className="flex items-center gap-2">
          {/* Minimalist Monochrome Sync/Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={loading || isRefreshing}
            className="inline-flex items-center justify-center p-3 text-gray-700 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 shadow-sm transition active:scale-[0.97] disabled:opacity-50 group"
            title="Refresh feed"
          >
            <svg 
              className={`w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>

          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Content
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      {loading && !isRefreshing ? (
        /* Modernized Skeleton Loading Grid (Skip if background refreshing) */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded-lg w-2/3" />
                <div className="h-5 bg-gray-200 rounded-full w-16" />
              </div>
              <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
              <div className="flex gap-2 pt-2">
                <div className="h-5 bg-gray-200 rounded-full w-12" />
                <div className="h-5 bg-gray-200 rounded-full w-14" />
              </div>
            </div>
          ))}
        </div>
      ) : batches.length === 0 ? (
        /* Minimalist High-End Empty State */
        <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl px-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold text-lg">No content generations found</p>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mt-1">
            Get started by spinning up your first content matrix.
          </p>
          <Link 
            to="/create" 
            className="mt-5 inline-flex items-center gap-1 bg-white text-gray-900 border border-gray-200 text-sm font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            Create first batch →
          </Link>
        </div>
      ) : (
        /* Bento-Style Content Grid */
        <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${isRefreshing ? 'opacity-60' : 'opacity-100'}`}>
          {batches.map((batch) => (
            <Link
              key={batch.id}
              to={`/batch/${batch.id}`}
              className="bg-white border border-gray-100 rounded-3xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight line-clamp-2 group-hover:text-gray-900 transition-colors duration-200">
                    {batch.idea?.topic || 'Untitled Topic'}
                  </h3>
                  
                  {/* High-fidelity Status Badges */}
                  <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wide uppercase ${
                    batch.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : batch.status === 'failed' 
                      ? 'bg-rose-50 text-rose-700 border-rose-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {batch.status}
                  </span> 
                </div>

                {/* Tone and Target Length Metadata Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    🎭 {batch.tone || batch.idea?.tone || "Exciting"}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    📏 {batch.target_length || batch.idea?.target_length || "Medium"}
                  </span>
                </div>

                <p className="text-xs font-mono text-gray-400 mb-6">
                  {new Date(batch.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Platforms Distribution Footer Container */}
              {batch.contents && batch.contents.length > 0 && (
                <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-1.5">
                  {batch.contents.map((c, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-xl font-medium shadow-2xs"
                    >
                      {getPlatformIcon(c.platform)}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Discrete Micro-Arrow Indicator */}
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 hidden lg:block">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
