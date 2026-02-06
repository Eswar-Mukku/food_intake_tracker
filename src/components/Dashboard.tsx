import React, { useState, useEffect } from 'react';
import type { User, DailySummary, WaterLog } from '../types/index';
import {
  getFoodLogs,
  getWaterLogs,
  getExerciseLogs,
  getLoggedDates,
  saveWaterLog,
  removeLatestWaterLog
} from '../utils/storage';
import {
  getTodayDate,
  calculatePercentage,
  formatNumber,
  calculateBMI,
  getBMICategory,
  calculateStreak,
  generateId,
  getCurrentTime
} from '../utils/helpers';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadDailySummary();
    const dates = getLoggedDates(user.id);
    setStreak(calculateStreak(dates));

    const handleUpdate = () => loadDailySummary();
    window.addEventListener('dataUpdated', handleUpdate);
    return () => window.removeEventListener('dataUpdated', handleUpdate);
  }, [user.id]);

  const loadDailySummary = () => {
    const today = getTodayDate();
    const foodLogs = getFoodLogs(user.id, today);
    const waterLogs = getWaterLogs(user.id, today);
    const exerciseLogs = getExerciseLogs(user.id, today);

    const consumed = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    const burned = exerciseLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
    const water = waterLogs.reduce((sum, log) => sum + log.amount, 0);

    const nutrients = foodLogs.reduce((acc, log) => ({
      protein: acc.protein + (log.protein || 0),
      carbs: acc.carbs + (log.carbs || 0),
      fat: acc.fat + (log.fat || 0),
      fiber: acc.fiber + (log.fiber || 0),
      saturatedFat: acc.saturatedFat + (log.saturatedFat || 0),
      cholesterol: acc.cholesterol + (log.cholesterol || 0),
      sodium: acc.sodium + (log.sodium || 0),
      potassium: acc.potassium + (log.potassium || 0),
      vitaminA: acc.vitaminA + (log.vitaminA || 0),
      vitaminC: acc.vitaminC + (log.vitaminC || 0),
      calcium: acc.calcium + (log.calcium || 0),
      iron: acc.iron + (log.iron || 0),
    }), {
      protein: 0, carbs: 0, fat: 0, fiber: 0, saturatedFat: 0,
      cholesterol: 0, sodium: 0, potassium: 0, vitaminA: 0,
      vitaminC: 0, calcium: 0, iron: 0
    });

    setDailySummary({
      date: today,
      caloriesConsumed: consumed,
      caloriesBurned: burned,
      netCalories: consumed - burned,
      water,
      ...nutrients,
      polyunsaturatedFat: 0,
      monounsaturatedFat: 0,
      transFat: 0,
      meals: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
    });
  };

  const handleAddWater = (amount: number) => {
    const log: WaterLog = {
      id: generateId(),
      userId: user.id,
      amount,
      date: getTodayDate(),
      time: getCurrentTime(),
    };
    saveWaterLog(log);
    loadDailySummary();
    window.dispatchEvent(new CustomEvent('dataUpdated'));
  };

  const handleRemoveWater = async () => {
    await removeLatestWaterLog(user.id, getTodayDate());
    loadDailySummary();
    window.dispatchEvent(new CustomEvent('dataUpdated'));
  };

  if (!dailySummary) return null;

  const waterGoal = user.dailyWaterGoal || 2000;
  const caloriesRemaining = user.dailyCalorieGoal - dailySummary.netCalories;
  const caloriesPercentage = calculatePercentage(dailySummary.netCalories, user.dailyCalorieGoal);
  const proteinPercentage = calculatePercentage(dailySummary.protein, user.dailyProteinGoal);
  const carbsPercentage = calculatePercentage(dailySummary.carbs, user.dailyCarbsGoal);
  const fatPercentage = calculatePercentage(dailySummary.fat, user.dailyFatGoal);
  const waterPercentage = calculatePercentage(dailySummary.water, waterGoal);
  const bmi = calculateBMI(user.currentWeight, user.height);
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-text">
          <h1>Healthy Morning, {user.name.split(' ')[0]} ☀️</h1>
          <p className="text-secondary">Your daily wellness summary</p>
        </div>
        <div className="streak-badge">
          <span className="streak-icon">🔥</span>
          <div className="streak-info">
            <span className="streak-count">{streak} Day Streak</span>
            <span className="streak-label">Keep it up!</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        {/* Calories Overview */}
        <div className="card summary-card calories-overview clickable" onClick={() => onNavigate('nutrition')}>
          <div className="summary-header">
            <h3>Calories</h3>
            <span className="view-link" onClick={(e) => { e.stopPropagation(); onNavigate('nutrition'); }}>View Nutrition →</span>
          </div>
          <div className="summary-content">
            <div className="ring-container">
              <svg className="dash-ring" viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r="44" />
                <circle
                  className="ring-fill"
                  cx="50" cy="50" r="44"
                  strokeDasharray="276.5"
                  strokeDashoffset={276.5 * (1 - Math.min(caloriesPercentage, 100) / 100)}
                  style={{ stroke: caloriesRemaining < 0 ? 'var(--error)' : 'var(--accent-500)' }}
                />
              </svg>
              <div className="ring-text">
                <span className="val">{formatNumber(Math.abs(caloriesRemaining), 0)}</span>
                <span className="label">{caloriesRemaining >= 0 ? 'Kcal Left' : 'Over Limit'}</span>
              </div>
            </div>
            <div className="summary-stats">
              <div className="sum-stat">
                <span className="s-label">Consumed</span>
                <span className="s-value">{dailySummary.caloriesConsumed}</span>
              </div>
              <div className="sum-stat">
                <span className="s-label">Burned</span>
                <span className="s-value">{dailySummary.caloriesBurned}</span>
              </div>
              <div className="sum-stat">
                <span className="s-label">Goal</span>
                <span className="s-value">{user.dailyCalorieGoal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="card summary-card macros-summary">
          <h3>Macros</h3>
          <div className="macros-progress-list">
            <div className="macro-row">
              <div className="m-info">
                <span>Protein</span>
                <span className="m-val">{Math.round(dailySummary.protein)}g / {user.dailyProteinGoal}g</span>
              </div>
              <div className="m-bar p"><div className="m-fill p" style={{ width: `${Math.min(proteinPercentage, 100)}%` }}></div></div>
            </div>
            <div className="macro-row">
              <div className="m-info">
                <span>Carbs</span>
                <span className="m-val">{Math.round(dailySummary.carbs)}g / {user.dailyCarbsGoal}g</span>
              </div>
              <div className="m-bar c"><div className="m-fill c" style={{ width: `${Math.min(carbsPercentage, 100)}%` }}></div></div>
            </div>
            <div className="macro-row">
              <div className="m-info">
                <span>Fat</span>
                <span className="m-val">{Math.round(dailySummary.fat)}g / {user.dailyFatGoal}g</span>
              </div>
              <div className="m-bar f"><div className="m-fill f" style={{ width: `${Math.min(fatPercentage, 100)}%` }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="secondary-grid">
        {/* Water Intake */}
        <div className="card stat-card">
          <div className="stat-card-header">
            <h4>Water Intake</h4>
            <span className="icon-badge blue">💧</span>
          </div>

          <div className="water-content">
            <div className="water-header">
              <span className="main-val">{formatNumber(dailySummary.water / 1000, 1)}L</span>
              <span className="sub-val">/ {formatNumber(waterGoal / 1000, 1)}L</span>
            </div>
            <div className="p-bar"><div className="p-fill water" style={{ width: `${Math.min(waterPercentage, 100)}%` }}></div></div>

            <div className="water-actions">
              <div className="quick-adds">
                <button onClick={(e) => { e.stopPropagation(); handleAddWater(250); }}>+250ml</button>
                <button onClick={(e) => { e.stopPropagation(); handleAddWater(500); }}>+500ml</button>
              </div>
              <button className="undo-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveWater(); }}>Undo</button>
            </div>
          </div>
        </div>

        {/* Weight & BMI */}
        <div className="card stat-card">
          <div className="stat-card-header">
            <h4>Weight & BMI</h4>
            <span className="icon-badge pink">⚖️</span>
          </div>
          <div className="weight-display">
            <div className="w-val">
              <span className="v">{formatNumber(user.currentWeight)}</span>
              <span className="u">kg</span>
            </div>
            <div className="bmi-indicator">
              <span>BMI: {formatNumber(bmi, 1)}</span>
              <span className={`status ${bmiCategory.toLowerCase() === 'normal' ? 'normal' : 'overweight'}`}>{bmiCategory}</span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="card stat-card">
          <div className="stat-card-header">
            <h4>Overview</h4>
            <span className="icon-badge purple">👤</span>
          </div>
          <div className="info-list">
            <div className="info-row"><span>Goal:</span> <strong style={{ color: 'var(--primary-500)' }}>{user.goal}</strong></div>
            <div className="info-row"><span>Height:</span> <strong style={{ color: 'var(--primary-500)' }}>{user.height}cm</strong></div>
            <div className="info-row"><span>Age:</span> <strong style={{ color: 'var(--primary-500)' }}>{user.age} yrs</strong></div>
          </div>
        </div>

        {/* AI Help Card */}
        <div className="card stat-card clickable" onClick={() => window.dispatchEvent(new CustomEvent('openAIChat'))}>
          <div className="stat-card-header">
            <h4>Need Help?</h4>
            <span className="icon-badge yellow">✨</span>
          </div>
          <div className="ai-help-content">
            <p>Unsure what to cook? Ask our AI for healthy recipes!</p>
            <button className="ai-trigger-btn">Ask AI</button>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 3rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .header-text h1 { font-size: 2rem; color: var(--primary-500); margin-bottom: 0.25rem; font-weight: 800; }
        
        .streak-badge {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #ffffff;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-premium);
        }

        .streak-icon { font-size: 1.5rem; }
        .streak-info { display: flex; flex-direction: column; }
        .streak-count { font-weight: 800; color: #f97316; font-size: 1rem; }
        .streak-label { font-size: 0.65rem; color: var(--text-tertiary); font-weight: 700; text-transform: uppercase; }

        .summary-section {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .view-link { color: var(--accent-500); font-size: 0.8rem; font-weight: 800; cursor: pointer; }

        .summary-content { display: flex; align-items: center; gap: 3rem; }
        
        .ring-container { position: relative; width: 160px; height: 160px; }
        .dash-ring { transform: rotate(-90deg); width: 100%; height: 100%; }
        .ring-bg { fill: none; stroke: #f1f5f9; stroke-width: 8; }
        .ring-fill { fill: none; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 1s ease-out; }
        
        .ring-text {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center;
        }
        .ring-text .val { font-size: 2.2rem; font-weight: 800; color: var(--primary-500); }
        .ring-text .label { font-size: 0.65rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; }

        .summary-stats { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
        .sum-stat { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f8fafc; }
        .s-label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; }
        .s-value { font-weight: 800; color: var(--primary-500); }

        .macros-summary h3 { margin-bottom: 1.5rem; }
        .macros-progress-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .macro-row { display: flex; flex-direction: column; gap: 0.5rem; }
        .m-info { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; }
        .m-bar { height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); }
        .m-bar.p { background: #fee2e2; }
        .m-bar.c { background: #dbeafe; }
        .m-bar.f { background: #fef3c7; }
        .m-fill { height: 100%; border-radius: 6px; transition: width 0.5s ease-out; box-shadow: 2px 0 5px rgba(0,0,0,0.1); }
        .m-fill.p { background: linear-gradient(90deg, #ef4444, #dc2626); }
        .m-fill.c { background: linear-gradient(90deg, #3b82f6, #2563eb); }
        .m-fill.f { background: linear-gradient(90deg, #f59e0b, #d97706); }

        .secondary-grid {
          display: grid;
        .secondary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
        }
        }

        .stat-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .stat-card h4 { font-size: 1rem; font-weight: 800; color: var(--primary-500); }
        .icon-badge {
          width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center;
          border-radius: 0.8rem; font-size: 1.2rem;
        }
        .icon-badge.blue { background: #e0f2fe; }
        .icon-badge.pink { background: #fce7f3; }
        .icon-badge.purple { background: #f3e8ff; }
        .icon-badge.yellow { background: #fef3c7; }

        .ai-help-content p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.4; }
        .ai-trigger-btn { width: 100%; padding: 0.75rem; background: var(--primary-500); color: white; border: none; border-radius: var(--radius-lg); font-weight: 700; cursor: pointer; transition: 0.2s; }
        .ai-trigger-btn:hover { background: var(--primary-600); }

        .main-val { font-size: 2.2rem; font-weight: 800; color: var(--primary-500); }
        .sub-val { font-size: 0.9rem; color: var(--text-tertiary); font-weight: 700; margin-left: 0.25rem; }
        
        .p-bar { height: 6px; background: #f1f5f9; border-radius: 3px; margin: 1rem 0; }
        .p-fill.water { background: #0ea5e9; border-radius: 3px; height: 100%; }

        .water-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
        .quick-adds { display: flex; gap: 0.5rem; }
        .quick-adds button {
          padding: 0.4rem 0.6rem; background: #f8fafc; border: 1px solid var(--glass-border);
          border-radius: 0.4rem; font-size: 0.7rem; font-weight: 700; cursor: pointer; color: var(--text-secondary);
        }
        .undo-btn { color: var(--text-tertiary); font-size: 0.7rem; font-weight: 700; cursor: pointer; background: none; border: none; }

        .weight-display { margin-top: 0.5rem; }
        .w-val { display: flex; align-items: baseline; gap: 0.1rem; }
        .w-val .v { font-size: 2.5rem; font-weight: 800; color: var(--primary-500); }
        .w-val .u { font-size: 0.9rem; color: var(--text-tertiary); font-weight: 700; }
        
        .bmi-indicator { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; font-weight: 700; font-size: 0.85rem; }
        .status { padding: 0.2rem 0.5rem; border-radius: 0.4rem; font-size: 0.65rem; text-transform: uppercase; }
        .status.normal { background: #dcfce7; color: #166534; }
        .status.overweight { background: #fef3c7; color: #92400e; }

        .info-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .info-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); }

        @media (max-width: 1024px) {
          .summary-section { grid-template-columns: 1fr; }
          .secondary-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .secondary-grid { grid-template-columns: 1fr; }
          .summary-content { flex-direction: column; gap: 2rem; align-items: flex-start; }
          .summary-stats { width: 100%; }
        }
      `}</style>
    </div>
  );
};
