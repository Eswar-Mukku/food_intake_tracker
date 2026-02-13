import React, { useState } from 'react';
import type { User } from '../types/index';
import { saveCurrentUser, syncAllDataFromCloud } from '../utils/storage';
import { calculateCalorieGoal, calculateMacroGoals } from '../utils/helpers';
import { supabase } from '../config/supabase';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<User['activityLevel']>('moderate');
  const [goal, setGoal] = useState<User['goal']>('maintain');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatusMessage('Authenticating...');
    setLoading(true);

    // Safety timeout
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Connection timed out. Checking network...');
        setStatusMessage('');
      }
    }, 15000);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      clearTimeout(safetyTimeout);
      return;
    }

    try {
      // 0. Check Connection first
      setStatusMessage('Checking connection...');
      const { error: healthError } = await supabase.from('users').select('count', { count: 'exact', head: true });

      if (healthError && !healthError.message.includes('JSON object requested, multiple')) {
        console.warn('⚠️ Connection check warning:', healthError.message);
        // Don't stop, just warn. The auth might still work or fail with a better error.
      }

      console.log('🔐 Attempting login...');
      setStatusMessage('Authenticating...');

      // 1. Authenticate with Supabase (with timeout)
      const authPromise = supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      const { data: authData, error: authError } = await Promise.race([
        authPromise,
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 10000))
      ]);

      if (authError) {
        console.error('❌ Auth error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      setStatusMessage('Fetching profile...');
      console.log('✅ Auth successful, fetching profile...');

      // 2. Get Profile from Supabase (with timeout)
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const { data: profileData, error: profileError } = await Promise.race([
        profilePromise,
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 8000))
      ]);

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Profile fetch error:', profileError);
      }

      let userProfile = profileData as User | null;

      // 3. If no profile, create default
      if (!userProfile) {
        setStatusMessage('Creating profile...');
        console.warn('⚠️ No profile found, creating one...');

        userProfile = {
          id: authData.user.id,
          email: email.toLowerCase().trim(),
          name: email.split('@')[0],
          age: 25,
          gender: 'male',
          height: 170,
          currentWeight: 70,
          goalWeight: 65,
          activityLevel: 'moderate',
          goal: 'maintain',
          dailyCalorieGoal: 2000,
          dailyProteinGoal: 150,
          dailyCarbsGoal: 200,
          dailyFatGoal: 65,
          dailyWaterGoal: 2000,
          createdAt: new Date().toISOString(),
        };

        const { error: insertError } = await supabase.from('users').insert(userProfile);
        if (insertError) {
          console.error('❌ Profile creation failed:', insertError);
          // Don't block login if profile creation fails (likely due to missing table)
          console.warn('⚠️ Could not save profile to cloud (tables might be missing). Proceeding locally.');
        }
        console.log('✅ Profile created local object');
      }

      // 4. Sync and login (with timeout)
      setStatusMessage('Syncing data...');
      console.log('🔄 Syncing data...');
      try {
        await Promise.race([
          syncAllDataFromCloud(userProfile.id),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Sync timeout')), 5000))
        ]);
      } catch (syncError: any) {
        console.warn('⚠️ Sync failed, continuing anyway:', syncError.message);
      }

      saveCurrentUser(userProfile);
      console.log('✅ Login complete!');
      clearTimeout(safetyTimeout);
      onLogin(userProfile);

    } catch (err: any) {
      console.error('❌ Login failed:', err);
      // Special handling for "Relation does not exist" (missing tables)
      if (err.message && err.message.includes('relation "users" does not exist')) {
        setError('Database tables missing. Please run the SQL setup script.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      clearTimeout(safetyTimeout);
      setLoading(false);
      setStatusMessage('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !name || !age || !height || !currentWeight || !goalWeight) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      console.log('📝 Starting registration...');

      // 1. Prepare User Data
      const ageNum = parseInt(age, 10);
      const heightNum = parseInt(height, 10);
      const currentWeightNum = parseFloat(currentWeight);
      const goalWeightNum = parseFloat(goalWeight);

      console.log('📊 Parsed values:', { ageNum, heightNum, currentWeightNum, goalWeightNum });

      // 2. Create Supabase Auth Account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        if (authError.message.toLowerCase().includes('already') ||
          authError.message.toLowerCase().includes('exists')) {
          setError('Email already registered. Please login instead.');
          setTimeout(() => setIsLogin(true), 2000);
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Registration failed - no user created');
      }

      console.log('✅ Auth account created');

      // 3. Create User Profile
      const newUser: User = {
        id: authData.user.id,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        age: ageNum,
        gender,
        height: heightNum,
        currentWeight: currentWeightNum,
        goalWeight: goalWeightNum,
        activityLevel,
        goal,
        dailyCalorieGoal: 0,
        dailyProteinGoal: 0,
        dailyCarbsGoal: 0,
        dailyFatGoal: 0,
        dailyWaterGoal: 2000,
        createdAt: new Date().toISOString(),
      };

      // 4. Calculate Goals
      newUser.dailyCalorieGoal = Math.round(calculateCalorieGoal(newUser));
      const macros = calculateMacroGoals(newUser.dailyCalorieGoal);
      newUser.dailyProteinGoal = Math.round(macros.protein);
      newUser.dailyCarbsGoal = Math.round(macros.carbs);
      newUser.dailyFatGoal = Math.round(macros.fat);

      console.log('💾 Saving profile to database...');

      // 5. Save Profile to Supabase
      const { error: profileError } = await supabase.from('users').insert(newUser);

      if (profileError) {
        console.error('❌ Profile save error:', profileError);
        throw new Error(`Failed to save profile: ${profileError.message}`);
      }

      console.log('✅ Profile saved successfully');

      // 6. Login
      saveCurrentUser(newUser);
      console.log('✅ Registration complete!');
      onLogin(newUser);

    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🥗</span>
            <h1 className="logo-text">Food Tracker</h1>
          </div>
          <p className="auth-subtitle">Your personal calorie & nutrition tracker</p>
          <p style={{ fontSize: '10px', opacity: 0.5, marginTop: '5px' }}>v2.3 - Timeout Fix</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? (statusMessage || 'Processing...') : 'Login'}
            </button>


          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-form-grid">
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email *</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password *</label>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Age *</label>
                <input
                  type="number"
                  className="input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  min="10"
                  max="100"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Gender *</label>
                <select
                  className="input select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Height (cm) *</label>
                <input
                  type="number"
                  className="input"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="170"
                  min="100"
                  max="250"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Current Weight (kg) *</label>
                <input
                  type="number"
                  className="input"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="70"
                  step="0.1"
                  min="30"
                  max="300"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Goal Weight (kg) *</label>
                <input
                  type="number"
                  className="input"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  placeholder="65"
                  step="0.1"
                  min="30"
                  max="300"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Activity Level *</label>
                <select
                  className="input select"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as User['activityLevel'])}
                >
                  <option value="sedentary">Sedentary (Little/no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very-active">Very Active (Athlete)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Goal *</label>
                <select
                  className="input select"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as User['goal'])}
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? (statusMessage || 'Creating Account...') : 'Create Account'}
            </button>
          </form>
        )}

        {/* Emergency Demo Button */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', background: '#f8fafc', color: '#64748b', border: '1px solid #cbd5e1' }}
            onClick={() => {
              const demoUser: User = {
                id: 'demo-user-' + Date.now(),
                email: 'demo@example.com',
                name: 'Demo User',
                age: 25,
                gender: 'male',
                height: 175,
                currentWeight: 75,
                goalWeight: 70,
                activityLevel: 'moderate',
                goal: 'maintain',
                dailyCalorieGoal: 2000,
                dailyProteinGoal: 150,
                dailyCarbsGoal: 200,
                dailyFatGoal: 65,
                dailyWaterGoal: 2000,
                createdAt: new Date().toISOString(),
              };
              saveCurrentUser(demoUser);
              onLogin(demoUser);
            }}
          >
            Skip Login (Enter Demo Mode) 🚀
          </button>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          background: var(--bg-deep);
        }

        .auth-background {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 40%),
                      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 40%);
          z-index: 0;
        }


        .auth-card {
          background: #ffffff;
          width: 100%;
          max-width: 550px;
          padding: 3rem;
          border-radius: var(--radius-2xl);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--glass-border);
          position: relative;
          z-index: 10;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .logo-icon { font-size: 3.5rem; }

        .logo-text {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--primary-500);
          letter-spacing: -0.04em;
          margin: 0;
        }

        .auth-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 600;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
          background: #f1f5f9;
          padding: 0.4rem;
          border-radius: var(--radius-xl);
        }

        .auth-tab {
          padding: 0.8rem;
          border: none;
          background: transparent;
          border-radius: var(--radius-lg);
          font-weight: 800;
          cursor: pointer;
          transition: var(--transition);
          color: var(--text-tertiary);
          font-size: 0.95rem;
        }

        .auth-tab.active {
          background: #ffffff;
          color: var(--primary-500);
          box-shadow: var(--shadow-premium);
        }

        .auth-error {
          background: #fef2f2;
          color: #ef4444;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          border: 1px solid #fee2e2;
          font-size: 0.9rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .auth-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .auth-demo-note {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-tertiary);
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
          line-height: 1.5;
        }

        .auth-demo-note b { color: var(--primary-500); }

        .auth-submit-btn {
          width: 100%;
          padding: 1.25rem;
          font-size: 1.1rem;
          height: auto !important;
          border-radius: var(--radius-xl) !important;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .auth-card { padding: 2rem 1.5rem; }
          .auth-form-grid { grid-template-columns: 1fr; }
          .logo-text { font-size: 2rem; }
          .logo-icon { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
};
