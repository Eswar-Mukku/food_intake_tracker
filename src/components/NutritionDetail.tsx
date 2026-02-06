import React, { useState, useEffect } from 'react';
import type { User, DailySummary } from '../types/index';
import { getFoodLogs, saveCurrentUser } from '../utils/storage';
import { getTodayDate, calculatePercentage, formatNumber } from '../utils/helpers';

interface NutritionDetailProps {
    user: User;
    onUserUpdate: (updatedUser: User) => void;
    onBack: () => void;
}

export const NutritionDetail: React.FC<NutritionDetailProps> = ({ user, onUserUpdate, onBack }) => {
    const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
    const [activeTab, setActiveTab] = useState<'calories' | 'nutrients' | 'macros'>('nutrients');
    const [goals, setGoals] = useState({
        calories: user.dailyCalorieGoal,
        protein: user.dailyProteinGoal,
        carbs: user.dailyCarbsGoal,
        fat: user.dailyFatGoal
    });

    const today = getTodayDate();

    useEffect(() => {
        loadNutrition();
    }, [user.id, today]);

    const loadNutrition = () => {
        const logs = getFoodLogs(user.id, today);

        const summary: DailySummary = {
            date: today,
            caloriesConsumed: logs.reduce((s, l) => s + l.calories, 0),
            caloriesBurned: 0,
            netCalories: 0,
            protein: logs.reduce((s, l) => s + l.protein, 0),
            carbs: logs.reduce((s, l) => s + l.carbs, 0),
            fat: logs.reduce((s, l) => s + l.fat, 0),
            fiber: logs.reduce((s, l) => s + l.fiber, 0),
            saturatedFat: logs.reduce((s, l) => s + (l.saturatedFat || 0), 0),
            polyunsaturatedFat: logs.reduce((s, l) => s + (l.polyunsaturatedFat || 0), 0),
            monounsaturatedFat: logs.reduce((s, l) => s + (l.monounsaturatedFat || 0), 0),
            transFat: logs.reduce((s, l) => s + (l.transFat || 0), 0),
            cholesterol: logs.reduce((s, l) => s + (l.cholesterol || 0), 0),
            sodium: logs.reduce((s, l) => s + (l.sodium || 0), 0),
            potassium: logs.reduce((s, l) => s + (l.potassium || 0), 0),
            vitaminA: logs.reduce((s, l) => s + (l.vitaminA || 0), 0),
            vitaminC: logs.reduce((s, l) => s + (l.vitaminC || 0), 0),
            calcium: logs.reduce((s, l) => s + (l.calcium || 0), 0),
            iron: logs.reduce((s, l) => s + (l.iron || 0), 0),
            water: 0,
            meals: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
        };
        summary.netCalories = summary.caloriesConsumed;
        setDailySummary(summary);
    };

    const handleSaveGoals = async () => {
        const updatedUser = {
            ...user,
            dailyCalorieGoal: goals.calories,
            dailyProteinGoal: goals.protein,
            dailyCarbsGoal: goals.carbs,
            dailyFatGoal: goals.fat
        };
        await saveCurrentUser(updatedUser);
        onUserUpdate(updatedUser);
        setActiveTab('nutrients');
    };

    if (!dailySummary) return null;

    const nutrientRows = [
        { label: 'Saturated Fat', value: dailySummary.saturatedFat, goal: 20, unit: 'g' },
        { label: 'Polyunsaturated Fat', value: dailySummary.polyunsaturatedFat, goal: null, unit: 'g' },
        { label: 'Monounsaturated Fat', value: dailySummary.monounsaturatedFat, goal: null, unit: 'g' },
        { label: 'Trans Fat', value: dailySummary.transFat, goal: 0, unit: 'g' },
        { label: 'Cholesterol', value: dailySummary.cholesterol, goal: 300, unit: 'mg' },
        { label: 'Sodium', value: dailySummary.sodium, goal: 2300, unit: 'mg' },
        { label: 'Potassium', value: dailySummary.potassium, goal: 3500, unit: 'mg' },
        { label: 'Vitamin A', value: dailySummary.vitaminA, goal: 100, unit: 'mcg' },
        { label: 'Vitamin C', value: dailySummary.vitaminC, goal: 100, unit: 'mg' },
        { label: 'Calcium', value: dailySummary.calcium, goal: 100, unit: 'mg' },
        { label: 'Iron', value: dailySummary.iron, goal: 18, unit: 'mg' },
    ];

    return (
        <div className="nutrition-page premium-dark">
            <div className="nav-header">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <h2>Detailed Nutrition Analysis 🍎</h2>
                <div style={{ width: 60 }}></div>
            </div>

            <div className="nutrition-summary-cards">
                <div className="summary-card card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Macronutrients</h3>
                    <div className="detailed-macros">
                        <div className="macro-bar-group">
                            <div className="bar-labels">
                                <span>Protein</span>
                                <span>{Math.round(dailySummary.protein)}g / {user.dailyProteinGoal}g</span>
                            </div>
                            <div className="full-bar p"><div className="fill protein-fill" style={{ width: `${calculatePercentage(dailySummary.protein, user.dailyProteinGoal)}%` }}></div></div>
                        </div>
                        <div className="macro-bar-group">
                            <div className="bar-labels">
                                <span>Carbs</span>
                                <span>{Math.round(dailySummary.carbs)}g / {user.dailyCarbsGoal}g</span>
                            </div>
                            <div className="full-bar c"><div className="fill carbs-fill" style={{ width: `${calculatePercentage(dailySummary.carbs, user.dailyCarbsGoal)}%` }}></div></div>
                        </div>
                        <div className="macro-bar-group">
                            <div className="bar-labels">
                                <span>Fats</span>
                                <span>{Math.round(dailySummary.fat)}g / {user.dailyFatGoal}g</span>
                            </div>
                            <div className="full-bar f"><div className="fill fat-fill" style={{ width: `${calculatePercentage(dailySummary.fat, user.dailyFatGoal)}%` }}></div></div>
                        </div>
                    </div>
                </div>

                <div className="summary-card card">
                    <div className="card-header">
                        <h3>Micronutrients</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => setActiveTab(activeTab === 'calories' ? 'nutrients' : 'calories')}>
                            {activeTab === 'calories' ? 'Show Nutrients' : 'Edit Goals'}
                        </button>
                    </div>

                    {activeTab !== 'calories' ? (
                        <div className="nutrients-list">
                            <div className="list-header">
                                <span>Nutrient</span>
                                <div className="header-values">
                                    <span>Total</span>
                                    <span>Goal</span>
                                    <span>Left</span>
                                </div>
                            </div>
                            {nutrientRows.map((row, i) => (
                                <div key={i} className="nutrient-row">
                                    <span className="label">{row.label}</span>
                                    <div className="values">
                                        <span className="current">{formatNumber(row.value)}</span>
                                        <span className="goal">{row.goal !== null ? formatNumber(row.goal) : '-'}</span>
                                        <span className="left">{row.goal !== null ? formatNumber(Math.max(0, row.goal - row.value)) : row.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="goal-inputs-mini">
                            <div className="input-field">
                                <label style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Calories (kcal)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={goals.calories}
                                    onChange={e => {
                                        const cals = Number(e.target.value);
                                        setGoals({
                                            calories: cals,
                                            protein: Math.round((cals * 0.3) / 4),
                                            carbs: Math.round((cals * 0.45) / 4),
                                            fat: Math.round((cals * 0.25) / 9)
                                        });
                                    }}
                                />
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={handleSaveGoals}>Save Goals</button>
                        </div>
                    )}
                </div>
            </div>


            <style>{`
                .nutrition-page {
                    min-height: 100vh;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .nav-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                }

                .nav-header h2 { font-size: 1.8rem; font-weight: 800; color: var(--text-primary); }

                .nutrition-summary-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .nutrition-summary-cards { grid-template-columns: 1fr; }
                    .nav-header h2 { font-size: 1.4rem; }
                }

                .goal-inputs-mini {
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: var(--radius-xl);
                    border: 1px solid var(--glass-border);
                }

                .list-header {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem 0;
                    border-bottom: 1px solid var(--glass-border);
                    color: var(--text-tertiary);
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .header-values { display: flex; gap: 2rem; }
                .header-values span { width: 50px; text-align: right; }

                .nutrient-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 1.25rem 0;
                    border-bottom: 1px solid var(--glass-border);
                    align-items: center;
                }

                .nutrient-row:last-child { border-bottom: none; }
                .nutrient-row .label { font-weight: 600; color: var(--text-primary); }
                .nutrient-row .values { display: flex; gap: 2rem; }
                .nutrient-row .values span { width: 50px; text-align: right; font-weight: 500; font-size: 0.95rem; color: var(--text-secondary); }
                .nutrient-row .values .current { color: var(--primary-400); font-weight: 700; }

                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                
                .macro-bar-group { margin-bottom: 1.75rem; }
                .bar-labels { display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 10px; color: var(--text-secondary); font-size: 0.9rem; }
                .full-bar { height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); }
                .full-bar.p { background: #fee2e2; }
                .full-bar.c { background: #dbeafe; }
                .full-bar.f { background: #fef3c7; }
                .fill { height: 100%; border-radius: 6px; }
                .protein-fill { background: linear-gradient(90deg, #ef4444, #dc2626); }
                .carbs-fill { background: linear-gradient(90deg, #3b82f6, #2563eb); }
                .fat-fill { background: linear-gradient(90deg, #f59e0b, #d97706); }
            `}</style>
        </div>
    );
};
