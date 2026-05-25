import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.post('/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      // Toggle custom premium success component state instead of a disruptive alert modal
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4 antialiased text-gray-900 selection:bg-indigo-500/10 relative overflow-hidden">
      
      {/* Structural background linear grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
					{/* Flex container wrapper to center and align the brand elements inline */}
					<div className="inline-flex items-center gap-2 font-bold text-gray-900 tracking-tight text-lg mb-3">
						<span className="w-7 h-7 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-sans">⚡</span>
						<span>Forge.ai</span>
					</div>
					
					<h2 className="text-2xl font-bold tracking-tight text-gray-900">
						Create your workspace
					</h2>
					<p className="text-gray-500 text-sm mt-1.5">
						Get started with your automated content engine today.
					</p>
				</div>

        {/* Form Container Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative min-h-[350px] flex flex-col justify-center">
          
          {success ? (
            /* Premium Success Feedback Transition Screen */
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-xs text-xl">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Account created successfully!</h3>
                <p className="text-gray-500 text-sm mt-1">Preparing your workspace routing...</p>
              </div>
              <div className="pt-2">
                <div className="h-1 w-24 bg-gray-100 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full animate-[loading-bar_2.5s_ease-out-forward]" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-150"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-150"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              {/* Password Inputs Grid for Desktop Layout Efficiency */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-150"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Confirm
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-150"
                    placeholder="••••••••"
                    value={formData.password2}
                    onChange={(e) => setFormData({...formData, password2: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Error Message Feedback Banner */}
              {error && (
                <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-3.5 rounded-2xl text-rose-800 text-xs font-medium leading-relaxed">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Form Submission Action Target */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 px-4 rounded-2xl text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-50 active:scale-[0.99] flex items-center justify-center gap-2 pt-4"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Configuring initial parameters...</span>
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          )}

          {/* Footer Backlinks */}
          {!success && (
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-gray-900 hover:text-indigo-600 font-semibold inline-flex items-center gap-0.5 group transition-colors">
                  Sign in
                  <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
