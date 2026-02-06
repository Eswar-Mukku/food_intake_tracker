import React, { useState, useEffect } from 'react';
import type { User, WeightLog } from '../types/index';
import { getWeightLogs, saveWeightLog, saveCurrentUser } from '../utils/storage';
import { generateId, formatNumber, calculateCalorieGoal, calculateMacroGoals } from '../utils/helpers';

interface ProfileProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUserUpdate, onLogout }) => {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState(user.currentWeight.toString());
  const [weightNote, setWeightNote] = useState('');
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState<User['goal']>(user.goal);

  useEffect(() => {
    const logs = getWeightLogs(user.id);
    setWeightLogs(logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [user.id]);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(newWeight);
    if (isNaN(weightVal)) return;

    const newLog: WeightLog = {
      id: generateId(),
      userId: user.id,
      weight: weightVal,
      date: new Date().toISOString(),
      note: weightNote || undefined,
    };

    saveWeightLog(newLog);

    const updatedUser = { ...user, currentWeight: weightVal };
    saveCurrentUser(updatedUser);
    onUserUpdate(updatedUser);

    const updatedLogs = getWeightLogs(user.id);
    setWeightLogs(updatedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    setShowWeightModal(false);
    setWeightNote('');
  };

  const handleUpdateGoal = () => {
    // calculate new targets
    const tempUser = { ...user, goal: newGoal };
    const newCalories = Math.round(calculateCalorieGoal(tempUser));
    const newMacros = calculateMacroGoals(newCalories);

    const updatedUser: User = {
      ...tempUser,
      dailyCalorieGoal: newCalories,
      dailyProteinGoal: Math.round(newMacros.protein),
      dailyCarbsGoal: Math.round(newMacros.carbs),
      dailyFatGoal: Math.round(newMacros.fat),
    };

    saveCurrentUser(updatedUser);
    onUserUpdate(updatedUser);
    setShowGoalModal(false);
  };

  const bmi = user.currentWeight / ((user.height / 100) * (user.height / 100));
  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p className="text-tertiary">Personal statistics and goals</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="card-top">
            <div className="avatar-large">{user.name.charAt(0)}</div>
            <div className="user-intro">
              <h2>{user.name}</h2>
              <p className="text-tertiary">{user.email}</p>
            </div>
          </div>

          <div className="user-info-rows">
            <div className="info-row">
              <span className="info-label">Current Weight</span>
              <span className="info-val">{user.currentWeight} kg</span>
            </div>
            <div className="info-row">
              <span className="info-label">Goal Weight</span>
              <span className="info-val">{user.goalWeight} kg</span>
            </div>
            <div className="info-row">
              <span className="info-label">Height</span>
              <span className="info-val">{user.height} cm</span>
            </div>
            <div className="info-row">
              <span className="info-label">Daily Calories</span>
              <span className="info-val">{user.dailyCalorieGoal} kcal</span>
            </div>
            <div className="info-row">
              <span className="info-label">Goal</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="info-val" style={{ textTransform: 'capitalize' }}>{user.goal.replace('-', ' ')}</span>
                <button className="btn-edit-mini" onClick={() => setShowGoalModal(true)}>✎</button>
              </div>
            </div>
            <button
              className="btn btn-danger"
              style={{ width: '100%', marginTop: '2rem', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', fontWeight: '800' }}
              onClick={onLogout}
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="profile-card bmi-card">
          <h3>Body Mass Index (BMI)</h3>
          <div className="bmi-viz">
            <div className="bmi-circle">
              <div className="bmi-num">{formatNumber(bmi, 1)}</div>
              <div className="bmi-tag">{bmiCategory}</div>
            </div>
            <div className="bmi-legend">
              <div className="legend-item"><span className="dot" style={{ background: '#f59e0b' }}></span> Under: &lt;18.5</div>
              <div className="legend-item"><span className="dot" style={{ background: '#10b981' }}></span> Normal: 18.5-25</div>
              <div className="legend-item"><span className="dot" style={{ background: '#f87171' }}></span> Over: 25+</div>
            </div>
          </div>
        </div>

        <div className="profile-card weight-history-card">
          <div className="card-head-flex">
            <h3>Weight Journey</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowWeightModal(true)}>Log New weight</button>
          </div>

          <div className="weight-logs-list">
            {weightLogs.length === 0 ? (
              <p className="text-tertiary">No entries yet. Start tracking today!</p>
            ) : (
              weightLogs.map(log => (
                <div key={log.id} className="weight-log-item">
                  <div className="log-date">{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                  <div className="log-weight">{log.weight} kg</div>
                  {log.note && <div className="log-note">{log.note}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showWeightModal && (
        <div className="modal-overlay" onClick={() => setShowWeightModal(false)}>
          <div className="weight-modal" onClick={e => e.stopPropagation()}>
            <h2>Update Weight</h2>
            <form onSubmit={handleAddWeight}>
              <div className="input-field-group">
                <label>Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="weight-input"
                  value={newWeight}
                  onChange={e => setNewWeight(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="input-field-group">
                <label>Note / Motivation</label>
                <textarea
                  className="weight-note"
                  value={weightNote}
                  onChange={e => setWeightNote(e.target.value)}
                  placeholder="How are you feeling today?"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowWeightModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-lg">Save Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGoalModal && (
        <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
          <div className="weight-modal" onClick={e => e.stopPropagation()}>
            <h2>Update Goal</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Changing your goal will recalculate your daily calorie and macro targets.</p>
            <div className="input-field-group">
              <label>Select New Goal</label>
              <select
                className="weight-input"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value as User['goal'])}
                style={{ fontSize: '1rem' }}
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowGoalModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary btn-lg" onClick={handleUpdateGoal}>Update Goals</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .profile-page { max-width: 1000px; margin: 0 auto; }
        .profile-header { margin-bottom: 2.5rem; }
        .profile-header h1 { font-size: 2.2rem; font-weight: 800; color: var(--primary-500); margin-bottom: 0.25rem; }

        .profile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        .profile-card {
          background: #ffffff; padding: 2rem; border-radius: var(--radius-2xl);
          border: 1px solid var(--glass-border); box-shadow: var(--shadow-premium);
        }

        .card-top { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); }
        .avatar-large {
          width: 70px; height: 70px; border-radius: 50%; background: var(--primary-500);
          color: white; font-size: 2rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
        }
        .user-intro h2 { font-size: 1.5rem; font-weight: 800; color: var(--primary-500); }

        .user-info-rows { display: flex; flex-direction: column; gap: 1rem; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f8fafc; }
        .info-label { font-weight: 700; color: var(--text-secondary); font-size: 0.9rem; }
        .info-val { font-weight: 800; color: var(--primary-500); font-size: 1rem; }

        .bmi-card { display: flex; flex-direction: column; }
        .bmi-card h3 { font-size: 1.25rem; font-weight: 800; color: var(--primary-500); margin-bottom: 1.5rem; }
        .bmi-viz { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
        .bmi-circle {
          width: 150px; height: 150px; border-radius: 50%; border: 8px solid var(--primary-500);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .bmi-num { font-size: 3rem; font-weight: 900; color: var(--primary-500); line-height: 1; }
        .bmi-tag { font-size: 0.9rem; font-weight: 800; color: var(--text-tertiary); margin-top: 0.25rem; }
        .bmi-legend { display: flex; gap: 1.5rem; }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); }
        .dot { width: 10px; height: 10px; border-radius: 50%; }

        .weight-history-card { grid-column: span 2; }
        .card-head-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .card-head-flex h3 { font-size: 1.25rem; font-weight: 800; color: var(--primary-500); }

        .weight-logs-list { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; }
        .weight-log-item {
          min-width: 140px; background: #f8fafc; padding: 1.5rem; border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border); text-align: center; transition: var(--transition);
        }
        .weight-log-item:hover { transform: translateY(-3px); border-color: var(--primary-500); }
        .log-date { font-size: 0.8rem; font-weight: 800; color: var(--text-tertiary); margin-bottom: 0.5rem; }
        .log-weight { font-size: 1.5rem; font-weight: 900; color: var(--primary-500); }
        .log-note { font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .weight-modal {
          background: #ffffff; width: 90%; max-width: 400px; padding: 2.5rem; border-radius: var(--radius-2xl);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); border: 1px solid var(--glass-border);
        }
        .weight-modal h2 { font-size: 1.5rem; font-weight: 800; color: var(--primary-500); margin-bottom: 2rem; }
        
        .input-field-group { margin-bottom: 1.5rem; }
        .input-field-group label { display: block; font-weight: 800; color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.75rem; }
        .weight-input { width: 100%; padding: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); background: #f8fafc; font-size: 1.2rem; font-weight: 800; color: var(--primary-500); }
        .weight-note { width: 100%; padding: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); background: #f8fafc; min-height: 100px; font-family: inherit; }
        
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        .btn-cancel { flex: 1; padding: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); background: #ffffff; font-weight: 700; cursor: pointer; }
        .modal-actions .btn-primary { flex: 2; }

        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr; }
          .weight-history-card { grid-column: span 1; }
        }

        .btn-edit-mini {
          background: none; border: none; cursor: pointer; color: var(--text-tertiary);
          font-size: 1rem; padding: 0.2rem; border-radius: 4px; transition: var(--transition);
        }
        .btn-edit-mini:hover { color: var(--primary-500); background: #f1f5f9; }
      `}</style>
    </div>
  );
};
