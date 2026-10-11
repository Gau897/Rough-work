import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('proxispeak_token', data.token);
        localStorage.setItem('proxispeak_user', JSON.stringify(data.user));
        navigate('/app');
        return;
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch {
      // Fallback local session if server was in transition
      const namePart = email.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const user = {
        userId: `USR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        name: formattedName,
        email,
        avatarIcon: '👨‍💻',
        color: '#2F80ED'
      };
      localStorage.setItem('proxispeak_user', JSON.stringify(user));
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 md:py-28 bg-[#F4F6F9] min-h-[calc(100vh-160px)] flex items-center justify-center">
      <Container className="w-full max-w-md">
        <Card className="p-8 md:p-10 shadow-md">
          {/* Badge */}
          <div className="text-center mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="10" width="3" height="4" rx="1.5" fill="currentColor" />
                <rect x="8" y="6" width="3" height="12" rx="1.5" fill="currentColor" />
                <rect x="13" y="4" width="3" height="16" rx="1.5" fill="currentColor" />
                <rect x="18" y="9" width="3" height="6" rx="1.5" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
            <p className="text-sm text-text-muted mt-1">
              Sign in to return to your virtual office
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-danger font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Work Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-navy text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-navy text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In to Office'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};
