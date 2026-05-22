import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const DEMO_EMAIL = 'ekrafhimatika@gmail.com';
  const DEMO_PASS  = 'EkrafHimaTika_UnUY0';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      setAuth(response.data.token, response.data.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      // Offline / demo mode fallback
      if (email === DEMO_EMAIL && password === DEMO_PASS) {
        setAuth('demo-token', {
          id: 'demo',
          email: DEMO_EMAIL,
          name: 'Admin TOKRAF',
          role: 'ADMIN',
        });
        navigate('/admin/dashboard');
        return;
      }
      setError(err.response?.data?.error || 'Login gagal. Periksa email & password kamu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-[2rem] p-8 shadow-xl border border-border">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Admin Portal</h1>
          <p className="text-foreground/60 mt-2">Sign in to manage TOKRAF content</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              placeholder="admin@tokraf.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold tracking-widest uppercase text-primary/60 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white font-heading font-bold text-lg py-4 rounded-xl hover:bg-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Dev hint */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
          <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold mb-1">Demo Credentials</p>
          <p className="text-sm font-mono text-foreground/70">ekrafhimatika@gmail.com</p>
          <p className="text-sm font-mono text-foreground/70">EkrafHimaTika_UnUY0</p>
        </div>
      </div>
    </div>
  );
}
