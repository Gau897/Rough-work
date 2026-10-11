import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roomName, setRoomName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    setErrorMsg('');
    setLoading(true);

    let userId = `USR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    try {
      // 1. Register user in database
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          avatarIcon: '👨‍💻',
          color: '#2F80ED'
        })
      });

      const regData = await regRes.json();
      if (regRes.ok && regData.success) {
        userId = regData.user.userId;
        localStorage.setItem('proxispeak_token', regData.token);
        localStorage.setItem('proxispeak_user', JSON.stringify(regData.user));
      } else if (!regRes.ok) {
        setErrorMsg(regData.error || 'Registration failed');
        setLoading(false);
        return;
      }
    } catch {
      // Fallback local persistence
      const userProfile = {
        userId,
        name: name.trim(),
        email: email.trim(),
        avatarIcon: '👨‍💻',
        color: '#2F80ED'
      };
      localStorage.setItem('proxispeak_user', JSON.stringify(userProfile));
    }

    try {
      // 2. Create team office space
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: roomName.trim() || `${name.trim()}'s Office`,
          leaderId: userId
        })
      });

      if (res.ok) {
        const data = await res.json();
        const code = data.room.code;
        localStorage.setItem('proxispeak_last_room', code);
        navigate(`/room/${code}`);
        return;
      }
    } catch (err) {
      console.warn('Backend API room creation fallback to local code:', err);
    }

    const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('proxispeak_last_room', fallbackCode);
    navigate(`/room/${fallbackCode}`);
  };

  return (
    <div className="py-20 md:py-28 bg-[#F4F6F9] min-h-[calc(100vh-160px)] flex items-center justify-center">
      <Container className="w-full max-w-md">
        <Card className="p-8 md:p-10 shadow-md">
          {/* Badge */}
          <div className="text-center mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white mx-auto mb-3 shadow-xs">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="10" width="3" height="4" rx="1.5" fill="currentColor" />
                <rect x="8" y="6" width="3" height="12" rx="1.5" fill="currentColor" />
                <rect x="13" y="4" width="3" height="16" rx="1.5" fill="currentColor" />
                <rect x="18" y="9" width="3" height="6" rx="1.5" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-navy">Create Account</h1>
            <p className="text-sm text-text-muted mt-1">
              Sign up to set up your team's virtual office
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-danger font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-navy text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Work Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-navy text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-navy text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-room" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Office / Team Name
              </label>
              <input
                id="signup-room"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Design Studio, Core Eng"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-navy text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account & Start Office'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};
