import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function CreateContent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    target_platforms: [],
    tone: 'Professional',
    target_length: 'Medium',
    extra_instructions: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const platforms = [
    { value: 'youtube', label: 'YouTube', desc: 'Long-form scripts', icon: '📺' },
    { value: 'shorts', label: 'Shorts / Reels', desc: 'Vertical bite-sized media', icon: '📱' },
    { value: 'twitter', label: 'Twitter / X', desc: 'High-engagement threads', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', desc: 'Authority-building posts', icon: '💼' },
  ];

  const tones = ['Professional', 'Casual', 'Exciting', 'Educational', 'Technical'];
  const lengths = ['Short', 'Medium', 'Long'];

  const handlePlatformChange = (platform) => {
    setFormData(prev => ({
      ...prev,
      target_platforms: prev.target_platforms.includes(platform)
        ? prev.target_platforms.filter(p => p !== platform)
        : [...prev.target_platforms, platform]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.target_platforms.length === 0) {
      setError("Please select at least one target platform for your content generation matrix.");
      setLoading(false);
      return;
    }

    try {
      await api.post('/ideas/', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to initiate autonomous generation task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8 antialiased selection:bg-indigo-500/10 text-gray-900">
      
      {/* Structural Navigation & Title Header */}
      <div className="space-y-2 border-b border-gray-100 pb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-900 group transition-colors mb-2">
          <span className="inline-block transition-transform duration-150 group-hover:-translate-x-0.5">←</span> Back to workspace
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Forge New Content
        </h1>
        <p className="text-gray-500 text-sm">
          Configure parameters to prompt your autonomous multi-platform generation agent.
        </p>
      </div>

      {success ? (
        /* Premium Inline Transition Success UI */
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm animate-fade-in mt-10">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Generation pipelines initialized</h3>
            <p className="text-gray-500 text-sm mt-1">Spinning up worker models. Routing back to dashboard...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Card: Topic Core Input */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Core Topic or Idea
              </label>
              <input
                type="text"
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-150"
                placeholder="e.g., How AI Agents will redefine solo software engineering workflows"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Contextual Description <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-150"
                placeholder="Provide unique source documentation, angles, hooks, or reference files you want maintained..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Section: Target Platforms Multi-Select Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Target Distribution Platforms
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {platforms.map((plat) => {
                const isSelected = formData.target_platforms.includes(plat.value);
                return (
                  <button
                    type="button"
                    key={plat.value}
                    onClick={() => handlePlatformChange(plat.value)}
                    className={`flex items-center text-left p-4 border rounded-2xl transition-all duration-200 ${
                      isSelected 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-900'
                    }`}
                  >
                    <span className="text-2xl mr-4 shrink-0">{plat.icon}</span>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm tracking-tight">{plat.label}</p>
                      <p className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{plat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Style Parameters Segmented Selectors */}
          <div className="grid gap-6 sm:grid-cols-2">
            
            {/* Custom Tone Picker Chips */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Target Output Tone
              </label>
              <div className="bg-gray-100/70 p-1 rounded-2xl flex flex-wrap gap-1">
                {tones.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setFormData({ ...formData, tone: t })}
                    className={`flex-1 min-w-[75px] text-center px-2 py-2 text-xs font-medium rounded-xl transition ${
                      formData.tone === t 
                        ? 'bg-white text-gray-900 shadow-xs border border-gray-200/50' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Length Segmented Controller */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Target Script Length
              </label>
              <div className="bg-gray-100/70 p-1 rounded-2xl flex gap-1">
                {lengths.map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => setFormData({ ...formData, target_length: l })}
                    className={`flex-1 text-center py-2 text-xs font-medium rounded-xl transition ${
                      formData.target_length === l 
                        ? 'bg-white text-gray-900 shadow-xs border border-gray-200/50' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Section: Extra Instructions Textarea */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Extra Structural Instructions <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-150"
              placeholder="e.g., Include clean technical code blocks, format structural output templates, avoid standard clichés, etc."
              value={formData.extra_instructions}
              onChange={(e) => setFormData({...formData, extra_instructions: e.target.value})}
            />
          </div>

          {/* Error Notice Display Alert */}
          {error && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-800 text-xs font-medium leading-relaxed">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Execution Submission Trigger Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-4 rounded-2xl text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-50 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Deploying Agent Pipelines...</span>
              </>
            ) : (
              'Generate content matrix'
            )}
          </button>

        </form>
      )}
    </div>
  );
}
