import React, { useState, useEffect } from 'react';
import type { User, WaterLog, ExerciseLog } from '../types/index';
import { getWaterLogs, saveWaterLog, removeLatestWaterLog, getExerciseLogs, saveExerciseLog, deleteExerciseLog } from '../utils/storage';
import { getTodayDate, getCurrentTime, generateId } from '../utils/helpers';

interface ActivityProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export const Activity: React.FC<ActivityProps> = ({ user }) => {
  const [selectedDate] = useState(getTodayDate());
  const [waterIntake, setWaterIntake] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  // Exercise form state
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('30');
  const [caloriesBurned, setCaloriesBurned] = useState('240');
  const [exerciseType, setExerciseType] = useState<'cardio' | 'strength' | 'yoga' | 'sports' | 'other'>('cardio');

  // Exercise database for auto-calculation (Calories per minute)
  const exerciseFactors: Record<string, number> = {
    'running': 11.4,
    'walking': 4.5,
    'cycling': 8.5,
    'swimming': 9.8,
    'yoga': 3.2,
    'strength': 5.5,
    'weightlifting': 6.0,
    'hiit': 12.5,
    'football': 10.0,
    'basketball': 9.5,
    'tennis': 8.0,
    'cardio': 8.0,
    'sports': 9.0,
    'other': 5.0
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('dataUpdated', handleUpdate);
    return () => window.removeEventListener('dataUpdated', handleUpdate);
  }, [user.id, selectedDate]);

  useEffect(() => {
    if (!duration) return;

    // Determine the factor
    let factor = exerciseFactors[exerciseType] || 5.0;

    // Check if name matches a specific common exercise
    const nameLow = exerciseName.toLowerCase();
    for (const key in exerciseFactors) {
      if (nameLow.includes(key)) {
        factor = exerciseFactors[key];
        break;
      }
    }

    const calculated = Math.round(parseFloat(duration) * factor);
    setCaloriesBurned(calculated.toString());
  }, [duration, exerciseType, exerciseName]);

  const loadData = () => {
    const wLogs = getWaterLogs(user.id, selectedDate);
    const totalWater = wLogs.reduce((sum, log) => sum + log.amount, 0);
    setWaterIntake(totalWater);

    const eLogs = getExerciseLogs(user.id, selectedDate);
    setExerciseLogs(eLogs);
  };

  const handleAddWater = (amount: number) => {
    const log: WaterLog = {
      id: generateId(),
      userId: user.id,
      amount,
      date: selectedDate,
      time: getCurrentTime(),
    };
    saveWaterLog(log);
    loadData();
    window.dispatchEvent(new CustomEvent('dataUpdated'));
  };

  const handleResetWater = async () => {
    // validation removed as per user request
    await removeLatestWaterLog(user.id, selectedDate);
    loadData();
    window.dispatchEvent(new CustomEvent('dataUpdated'));
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    const log: ExerciseLog = {
      id: generateId(),
      userId: user.id,
      exerciseName,
      duration: parseInt(duration),
      caloriesBurned: parseInt(caloriesBurned),
      date: selectedDate,
      time: getCurrentTime(),
      type: exerciseType
    };
    saveExerciseLog(log);
    loadData();
    setShowExerciseModal(false);
    setExerciseName('');
    window.dispatchEvent(new CustomEvent('dataUpdated'));
  };

  const handleDeleteExercise = (id: string) => {
    if (confirm('Delete this exercise entry?')) {
      deleteExerciseLog(id);
      loadData();
      window.dispatchEvent(new CustomEvent('dataUpdated'));
    }
  };

  const waterGoal = user.dailyWaterGoal || 2000;
  const waterProgress = Math.min(100, (waterIntake / waterGoal) * 100);
  const totalBurned = exerciseLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h1>Health & Activity</h1>
        <p className="text-tertiary">Monitor your vital stats and hydration</p>
      </div>

      <div className="activity-grid">
        {/* Hydration Card */}
        <div className="activity-card water-card">
          <div className="card-top-flex">
            <h3>Hydration</h3>
            <span className="water-summary">{waterIntake} / {waterGoal} ml</span>
          </div>

          <div className="water-viz-container">
            <div className="water-progress-outer">
              <div
                className="water-progress-inner"
                style={{ height: `${waterProgress}%` }}
              >
                <div className="water-wave"></div>
              </div>
              <div className="water-stats">
                <span className="water-pct">{Math.round(waterProgress)}%</span>
                <span className="water-lab">of daily goal</span>
              </div>
            </div>

            <div className="water-actions">
              <div className="quick-adds">
                <button className="water-btn" onClick={() => handleAddWater(250)}>
                  <span className="btn-icon">🥛</span>
                  <div className="btn-text">
                    <span className="amount">+250ml</span>
                    <span className="label">Small Glass</span>
                  </div>
                </button>
                <button className="water-btn" onClick={() => handleAddWater(500)}>
                  <span className="btn-icon">🧴</span>
                  <div className="btn-text">
                    <span className="amount">+500ml</span>
                    <span className="label">Bottle</span>
                  </div>
                </button>
              </div>
              <button
                className="btn btn-secondary btn-lg"
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={handleResetWater}
              >
                Remove Latest Entry
              </button>
            </div>
          </div>
        </div>

        {/* Exercise Card - Replacing Macros as requested */}
        <div className="activity-card exercise-card">
          <div className="card-top-flex">
            <h3>Exercise & Activity</h3>
            <span className="burned-summary">{totalBurned} kcal burned</span>
          </div>

          <div className="exercise-list">
            {exerciseLogs.length === 0 ? (
              <div className="empty-state">
                <p className="text-tertiary">No exercise logged today. Stay active!</p>
              </div>
            ) : (
              exerciseLogs.map(log => (
                <div key={log.id} className="exercise-item-row">
                  <div className="ex-icon">{
                    log.type === 'cardio' ? '🏃' :
                      log.type === 'strength' ? '💪' :
                        log.type === 'yoga' ? '🧘' :
                          log.type === 'sports' ? '⚽' : '🔥'
                  }</div>
                  <div className="ex-info">
                    <span className="ex-name">{log.exerciseName}</span>
                    <span className="ex-meta">{log.duration} mins • {log.time}</span>
                  </div>
                  <div className="ex-cals">-{log.caloriesBurned}</div>
                  <button className="btn-delete-ex" onClick={() => handleDeleteExercise(log.id)}>×</button>
                </div>
              ))
            )}
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setShowExerciseModal(true)}>
            + Log Exercise
          </button>
        </div>
      </div>

      {showExerciseModal && (
        <div className="modal-overlay" onClick={() => setShowExerciseModal(false)}>
          <div className="activity-modal" onClick={e => e.stopPropagation()}>
            <h2>Log Activity</h2>
            <form onSubmit={handleAddExercise}>
              <div className="input-field-group">
                <label>What did you do?</label>
                <input
                  type="text"
                  className="activity-input"
                  placeholder="e.g. Running, Swimming..."
                  value={exerciseName}
                  onChange={e => setExerciseName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="modal-row-grid">
                <div className="input-field-group">
                  <label>Duration (mins)</label>
                  <input
                    type="number"
                    className="activity-input"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="input-field-group">
                  <label>Calories</label>
                  <input
                    type="number"
                    className="activity-input"
                    value={caloriesBurned}
                    onChange={e => setCaloriesBurned(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-field-group">
                <label>Category</label>
                <select
                  className="activity-select"
                  value={exerciseType}
                  onChange={e => setExerciseType(e.target.value as any)}
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="yoga">Yoga</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowExerciseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-lg">Add Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .activity-page { max-width: 1200px; margin: 0 auto; }
        .activity-header { margin-bottom: 2.5rem; }
        .activity-header h1 { font-size: 2.2rem; font-weight: 800; color: var(--primary-500); margin-bottom: 0.25rem; }

        .activity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .activity-card {
          background: #ffffff; padding: 2.5rem; border-radius: var(--radius-2xl);
          border: 1px solid var(--glass-border); box-shadow: var(--shadow-premium);
          display: flex; flex-direction: column;
        }

        .card-top-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .card-top-flex h3 { font-size: 1.5rem; font-weight: 800; color: var(--primary-500); }
        .water-summary, .burned-summary { font-weight: 800; color: var(--text-tertiary); font-size: 1.1rem; }

        .water-viz-container { display: flex; gap: 3rem; align-items: center; }
        
        .water-progress-outer {
          position: relative; width: 180px; height: 180px; border-radius: 50%; border: 12px solid #f1f5f9;
          overflow: hidden; display: flex; align-items: center; justify-content: center; background: #ffffff;
          flex-shrink: 0;
        }
        .water-progress-inner {
          position: absolute; bottom: 0; left: 0; right: 0; background: #3b82f6;
          transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .water-wave {
          position: absolute; top: -10px; left: -50%; width: 200%; height: 20px;
          background: radial-gradient(circle at 50% 100%, #3b82f6 0%, transparent 100%);
          animation: wave 2s infinite linear;
        }
        @keyframes wave { 0% { transform: translateX(0); } 100% { transform: translateX(25%); } }

        .water-stats { position: relative; z-index: 2; text-align: center; display: flex; flex-direction: column; }
        .water-pct { font-size: 2.5rem; font-weight: 900; color: var(--primary-500); mix-blend-mode: difference; }
        .water-lab { font-size: 0.8rem; font-weight: 700; color: var(--text-tertiary); mix-blend-mode: difference; }

        .water-actions { flex: 1; display: flex; flex-direction: column; gap: 1rem; min-height: 180px; }
        .quick-adds { display: flex; flex-direction: column; gap: 0.75rem; }
        .water-btn {
          display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border); background: #f8fafc; cursor: pointer; transition: var(--transition);
        }
        .water-btn:hover { border-color: #3b82f6; transform: translateX(5px); background: #ffffff; }
        .btn-icon { font-size: 1.5rem; }
        .btn-text { display: flex; flex-direction: column; align-items: flex-start; }
        .btn-text .amount { font-weight: 800; color: var(--primary-500); font-size: 1rem; }
        .btn-text .label { font-size: 0.75rem; color: var(--text-tertiary); font-weight: 700; }

        .exercise-list { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; max-height: 300px; padding-right: 0.5rem; }
        .exercise-item-row { 
          display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: #f8fafc; 
          border-radius: var(--radius-xl); border: 1px solid var(--glass-border); transition: var(--transition);
        }
        .exercise-item-row:hover { border-color: var(--primary-500); transform: translateX(5px); }
        .ex-icon { font-size: 1.5rem; width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-premium); }
        .ex-info { flex: 1; display: flex; flex-direction: column; }
        .ex-name { font-weight: 800; color: var(--primary-500); font-size: 1rem; }
        .ex-meta { font-size: 0.8rem; color: var(--text-tertiary); font-weight: 700; }
        .ex-cals { font-weight: 900; color: var(--error); font-size: 1.1rem; }
        .btn-delete-ex { background: none; border: none; font-size: 1.5rem; color: #cbd5e1; cursor: pointer; transition: var(--transition); padding: 0.5rem; }
        .btn-delete-ex:hover { color: var(--error); }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .activity-modal {
          background: #ffffff; width: 90%; max-width: 450px; padding: 2.5rem; border-radius: var(--radius-2xl);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); border: 1px solid var(--glass-border);
        }
        .activity-modal h2 { font-size: 1.8rem; font-weight: 800; color: var(--primary-500); margin-bottom: 2rem; }
        
        .modal-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .input-field-group { margin-bottom: 1.5rem; }
        .input-field-group label { display: block; font-weight: 800; color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.75rem; }
        .activity-input, .activity-select { width: 100%; padding: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); background: #f8fafc; font-size: 1rem; font-weight: 700; color: var(--primary-500); outline: none; }
        .activity-input:focus { border-color: var(--primary-500); background: #ffffff; }

        .modal-actions { display: flex; gap: 1rem; margin-top: 1rem; }
        .btn-cancel { flex: 1; padding: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); background: #ffffff; font-weight: 700; cursor: pointer; }

        @media (max-width: 1024px) {
          .activity-grid { grid-template-columns: 1fr; }
          .water-viz-container { flex-direction: column; }
          .water-actions { width: 100%; min-height: auto; }
        }
      `}</style>
    </div>
  );
};
