import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export default function BatchDetail() {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchBatchDetail = useCallback(async () => {
    try {
      const res = await api.get(`/batches/${id}/`);
      setBatch(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBatchDetail();
  }, [fetchBatchDetail]);

  const handleCopy = async (text, uniqueId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(uniqueId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CopyButton = ({ text, uniqueId }) => {
    const isCopied = copiedId === uniqueId;
    return (
      <button
        onClick={() => handleCopy(text, uniqueId)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 border ${
          isCopied
            ? 'bg-gray-900 text-white border-gray-950'
            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900 shadow-xs active:scale-[0.97]'
        }`}
        title="Copy contents"
      >
        {isCopied ? (
          <>
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Copied</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy</span>
          </>
        )}
      </button>
    );
  };

  const parseYouTubeScript = (text) => {
    if (!text || typeof text !== 'string') return [];
    const lines = text.split('\n').filter(line => line.trim().includes('|'));
    return lines.map(line => {
      const match = line.match(/^(\d+:\d+)\s*-\s*(.+?)\s*\|\s*(.+)$/);
      if (match) {
        return {
          time: match[1],
          visuals: match[2].trim(),
          audio: match[3].trim()
        };
      }
      return null;
    }).filter(Boolean);
  };

  const parseShortsScript = (text) => {
    if (!text || typeof text !== 'string') return [];
    try {
      let cleaned = text.trim();
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      const parsed = JSON.parse(cleaned);
      return Array.isArray(parsed.script) ? parsed.script : [];
    } catch (e) {
      return [];
    }
  };

  const parseTwitterThread = (text) => {
    if (!text || typeof text !== 'string') return [];
    let cleaned = text.replace(/```[\s\S]*?```/g, '').trim();
    let parts = cleaned.split(/\n?\d+[\/.)]\s*/);
    return parts
      .map(part => part.trim())
      .filter(part => part.length > 20)
      .map(part => part.replace(/^\d+\s*/, '').trim());
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6 animate-pulse">
        <div className="h-4 w-28 bg-gray-200 rounded-lg" />
        <div className="space-y-2">
          <div className="h-8 w-2/3 bg-gray-200 rounded-xl" />
          <div className="h-4 w-1/3 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2 pt-6">
          <div className="h-[400px] bg-gray-100 rounded-3xl" />
          <div className="h-[400px] bg-gray-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-24 max-w-md mx-auto space-y-3">
        <p className="text-2xl font-bold text-gray-900">Batch details unavailable</p>
        <p className="text-sm text-gray-500">The historical generation model request could not be fetched.</p>
        <Link to="/dashboard" className="inline-block pt-2 text-sm font-semibold text-gray-900 hover:underline">Return to workspace</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 antialiased text-gray-900 selection:bg-gray-900/10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-gray-100 pb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-900 group transition-colors mb-1">
          <span className="inline-block transition-transform duration-150 group-hover:-translate-x-0.5">←</span> Back to dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {batch.idea?.topic || "Untitled Topic"}
          </h1>

          {/* New Metadata Tags extracted directly from the batch template idea object */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-lg">
              🎭 {batch.idea?.tone || "Exciting"}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-lg">
              📏 {batch.idea?.target_length || "Medium"}
            </span>
          </div>
        </div>

        <p className="text-gray-500 text-xs font-medium">
          Pipeline execution complete • {new Date(batch.created_at).toLocaleString()}
        </p>
      </div>

      {/* Content Columns Matrix */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {batch.contents?.map((content) => {
          const raw = content.raw_content || '';
          const isYouTube = content.platform === 'youtube';
          const isShorts = content.platform === 'shorts';
          const isTwitter = content.platform === 'twitter';

          let scriptData = [];
          let twitterTweets = [];
          let channelLabel = 'LinkedIn Post';
          let channelIcon = '💼';

          if (isYouTube) {
            scriptData = parseYouTubeScript(raw);
            channelLabel = 'YouTube Video';
            channelIcon = '📺';
          } else if (isShorts) {
            scriptData = parseShortsScript(raw);   
            channelLabel = 'Shorts / Reels';
            channelIcon = '📱';
          } else if (isTwitter) {
            twitterTweets = parseTwitterThread(raw);
            channelLabel = 'Twitter Thread';
            channelIcon = '🐦';
          }

          return (
            <div key={content.id} className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.01)] overflow-hidden flex flex-col">
              
              {/* Neutral Platform Header */}
              <div className="bg-gray-50/70 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  <span className="text-base leading-none">{channelIcon}</span>
                  {channelLabel}
                </span>
                {(isYouTube || isShorts) && (
                  <CopyButton text={raw} uniqueId={`batch-raw-${content.id}`} />
                )}
              </div>

              <div className="p-5 sm:p-6 flex-1">
                
                {/* 1. YouTube Panel */}
                {isYouTube && scriptData.length > 0 && (
                  <div className="overflow-hidden border border-gray-100 rounded-2xl bg-white shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100">
                            <th className="px-4 py-3 w-16">Timestamp</th>
                            <th className="px-4 py-3">Visual Direction</th>
                            <th className="px-4 py-3">Audio Script</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {scriptData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 py-3.5 font-mono text-xs text-gray-900 bg-gray-50/30 font-semibold align-top">{row.time}</td>
                              <td className="px-4 py-3.5 text-gray-500 text-xs font-medium align-top leading-relaxed">{row.visuals}</td>
                              <td className="px-4 py-3.5 text-gray-900 align-top leading-relaxed">{row.audio}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. YouTube Shorts / Reels Card Flow */}
                {isShorts && scriptData.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-xs uppercase text-gray-400 mb-2 font-semibold tracking-wider">Shorts Script Layout</p>
                    {scriptData.map((item, index) => (
                      <div key={index} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                              {index + 1}
                            </span>
                            <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                              {item.section}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Step {index + 1} of {scriptData.length}
                          </span>
                        </div>
                        
                        {/* Section Information Descriptions */}
                        <div className="text-[11px] text-gray-500 font-medium bg-white border border-gray-100 p-2.5 rounded-xl">
                          {item.section === "The Hook" && " Hook • First 3 seconds to aggressively stop the user's scroll"}
                          {item.section === "The Setup" && "⚙️ Setup • Establishes immediate structural context or problem background"}
                          {item.section === "The Value" && "💎 Value • Delivers the core insight, takeaway, or demonstration"}
                          {item.section === "The CTA" && "📣 CTA • Directs the viewer exactly what action to take next"}
                        </div>
                        
                        <div className="text-xs space-y-1.5 pt-1">
                          <p className="text-gray-900 leading-relaxed"><span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px] block mb-0.5">Audio read:</span>{item.audio}</p>
                          <p className="text-gray-500 italic"><span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px] block mb-0.5 not-italic">Visual flow:</span>{item.visuals}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Twitter Threads Matrix */}
                {isTwitter && twitterTweets.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs uppercase text-gray-400 mb-2 font-semibold tracking-wider">Generated Thread Sequence</p>
                    {twitterTweets.map((tweet, index) => {
                      const tweetKey = `twitter-${content.id}-${index}`;
                      return (
                        <div key={index} className="border border-gray-100 rounded-2xl p-4 bg-white hover:border-gray-200 transition-colors relative group space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-gray-900 text-white rounded-md text-[11px] font-mono font-bold tracking-tight">
                              {index + 1}/{twitterTweets.length}
                            </span>
                            <CopyButton text={tweet} uniqueId={tweetKey} />
                          </div>
                          <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                            {tweet}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 4. LinkedIn Documentation Panel */}
                {!isYouTube && !isShorts && !isTwitter && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Document Workspace</p>
                      <CopyButton text={raw} uniqueId={`linkedin-${content.id}`} />
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl max-h-[550px] overflow-y-auto text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {raw}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
