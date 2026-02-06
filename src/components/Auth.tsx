import React, { useState } from 'react';
import type { User } from '../types/index';
import { getUserByEmail, saveCurrentUser, saveUserToCloud, getUserFromCloud, syncAllDataFromCloud } from '../utils/storage';
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

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (authError) {
        // If Auth fails, check local fallback
        const localUser = getUserByEmail(email);
        if (localUser) {
          saveCurrentUser(localUser);
          onLogin(localUser);
          return;
        }
        throw authError;
      }

      if (authData.user) {
        // 2. Get Profile from Cloud
        let cloudUser = await getUserFromCloud(authData.user.id);

        // 3. If no profile exists in cloud, check local or create default
        if (!cloudUser) {
          console.warn('Profile missing in cloud, searching local fallback...');
          const localUser = getUserByEmail(email);

          if (localUser) {
            // Update local user with new cloud ID if needed and save to cloud
            cloudUser = { ...localUser, id: authData.user.id };
            await saveUserToCloud(cloudUser);
          } else {
            // Create a minimal default profile if absolutely nothing found
            cloudUser = {
              id: authData.user.id,
              email: email.toLowerCase(),
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
            await saveUserToCloud(cloudUser);
          }
        }

        // 4. Success
        await syncAllDataFromCloud(cloudUser.id);
        saveCurrentUser(cloudUser);
        onLogin(cloudUser);
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(`Login failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
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

    try {
      // 1. Prepare User Data
      const ageNum = parseInt(age);
      const heightNum = parseInt(height);
      const currentWeightNum = parseFloat(currentWeight);
      const goalWeightNum = parseFloat(goalWeight);

      // 2. Try Supabase Auth SignUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
      });

      if (authError) {
        // Special case: already exists
        if (authError.message.toLowerCase().includes('already registered')) {
          setError('Email already registered. Please login instead.');
          setLoading(false);
          setIsLogin(true);
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Authentication failed - no user returned');
      }

      // 3. Create Profile Object
      const newUser: User = {
        id: authData.user.id,
        email: email.toLowerCase(),
        name,
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

      // Calculate Nutritional Goals
      newUser.dailyCalorieGoal = Math.round(calculateCalorieGoal(newUser));
      const macros = calculateMacroGoals(newUser.dailyCalorieGoal);
      newUser.dailyProteinGoal = Math.round(macros.protein);
      newUser.dailyCarbsGoal = Math.round(macros.carbs);
      newUser.dailyFatGoal = Math.round(macros.fat);

      // 4. Save to Cloud (Profile Table)
      const { error: profileError } = await supabase.from('users').upsert(newUser);
      if (profileError) {
        console.error('Profile creation error:', profileError);
        // We still have the auth account, so we proceed but warn
        console.warn('Auth account created but profile save failed.');
      }

      // 5. Success
      saveCurrentUser(newUser);
      onLogin(newUser);

    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(`Registration failed: ${err.message || 'Unknown error'}`);
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
              {loading ? 'Processing...' : 'Login'}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
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
