import React, { useState, useEffect } from 'react';
import type { User, FoodLog } from '../types/index';
import { foodDatabase, categories } from '../data/foodDatabase';
import type { FoodItem } from '../data/foodDatabase';
import { getFoodLogs, saveFoodLog, deleteFoodLog } from '../utils/storage';
import { getTodayDate, getCurrentTime, generateId, formatNumber } from '../utils/helpers';

interface FoodDiaryProps {
  user: User;
}

export const FoodDiary: React.FC<FoodDiaryProps> = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState('1');
  const [manualServingSize, setManualServingSize] = useState('100');
  const [manualServingUnit, setManualServingUnit] = useState('g');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (selectedFood) {
      setManualServingSize(selectedFood.servingSize);
      // Normalize 'piece', 'slice', etc. to 'unit' to match select dropdown
      const unit = ['piece', 'slice', 'plate', 'serving', 'unit'].includes(selectedFood.servingUnit.toLowerCase())
        ? 'unit'
        : selectedFood.servingUnit;
      setManualServingUnit(unit);
      setServings('1');
    }
  }, [selectedFood]);

  const calculateSizeRatio = () => {
    if (!selectedFood) return 1;
    const manualSize = parseFloat(manualServingSize) || 0;
    const baseSize = parseFloat(selectedFood.servingSize) || 1;

    const isBaseUnitPiece = ['piece', 'slice', 'plate', 'serving', 'unit'].includes(selectedFood.servingUnit.toLowerCase());
    const isManualUnitPiece = manualServingUnit === 'unit';
    const isManualUnitGram = manualServingUnit === 'g' || manualServingUnit === 'ml';
    const isBaseUnitGram = selectedFood.servingUnit === 'g' || selectedFood.servingUnit === 'ml';

    // Same logic: Piece to Piece or Gram to Gram
    if ((isBaseUnitPiece && isManualUnitPiece) || (isBaseUnitGram && manualServingUnit === selectedFood.servingUnit)) {
      return manualSize / baseSize;
    }

    // Cross logic: Piece base, Gram manual (Assume 1 piece = 100g for typical snacks/items)
    if (isBaseUnitPiece && isManualUnitGram) {
      return manualSize / (baseSize * 100);
    }

    // Cross logic: Gram base, Piece manual (Assume 1 piece = 100g)
    if (isBaseUnitGram && isManualUnitPiece) {
      return (manualSize * 100) / baseSize;
    }

    return manualSize / baseSize;
  };

  useEffect(() => {
    loadFoodLogs();

    const handleDataUpdate = () => loadFoodLogs();
    window.addEventListener('dataUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataUpdated', handleDataUpdate);
  }, [user.id, selectedDate]);

  const loadFoodLogs = () => {
    const logs = getFoodLogs(user.id, selectedDate);
    setFoodLogs(logs);
  };

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddFood = () => {
    if (!selectedFood) return;

    const servingsNum = parseFloat(servings) || 1;
    const sizeRatio = calculateSizeRatio();

    const log: FoodLog = {
      id: generateId(),
      userId: user.id,
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      mealType: selectedMealType,
      servings: servingsNum,
      calories: Math.max(0, selectedFood.calories * sizeRatio * servingsNum),
      protein: Math.max(0, selectedFood.protein * sizeRatio * servingsNum),
      carbs: Math.max(0, selectedFood.carbs * sizeRatio * servingsNum),
      fat: Math.max(0, selectedFood.fat * sizeRatio * servingsNum),
      fiber: Math.max(0, (selectedFood.fiber || 0) * sizeRatio * servingsNum),

      // Micronutrients
      saturatedFat: selectedFood.saturatedFat !== undefined ? selectedFood.saturatedFat * sizeRatio * servingsNum : undefined,
      sodium: selectedFood.sodium !== undefined ? selectedFood.sodium * sizeRatio * servingsNum : undefined,
      cholesterol: selectedFood.cholesterol !== undefined ? selectedFood.cholesterol * sizeRatio * servingsNum : undefined,
      potassium: selectedFood.potassium !== undefined ? selectedFood.potassium * sizeRatio * servingsNum : undefined,
      calcium: selectedFood.calcium !== undefined ? selectedFood.calcium * sizeRatio * servingsNum : undefined,
      iron: selectedFood.iron !== undefined ? selectedFood.iron * sizeRatio * servingsNum : undefined,
      vitaminA: selectedFood.vitaminA !== undefined ? selectedFood.vitaminA * sizeRatio * servingsNum : undefined,
      vitaminC: selectedFood.vitaminC !== undefined ? selectedFood.vitaminC * sizeRatio * servingsNum : undefined,

      date: selectedDate,
      time: getCurrentTime(),
    };

    saveFoodLog(log);
    loadFoodLogs();
    setSelectedFood(null);
    setServings('1');
    setSearchQuery('');

    // Close modal if food added
    setIsAddModalOpen(false);
  };



  const handleDeleteLog = (logId: string) => {
    setDeleteId(logId);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteFoodLog(deleteId);
      loadFoodLogs();
      setDeleteId(null);
    }
  };

  const getMealLogs = (mealType: string) => foodLogs.filter(log => log.mealType === mealType);
  const getMealCalories = (mealType: string) => getMealLogs(mealType).reduce((sum, log) => sum + log.calories, 0);

  const mealTypes = [
    { type: 'breakfast' as const, icon: '🌅', label: 'Breakfast' },
    { type: 'lunch' as const, icon: '☀️', label: 'Lunch' },
    { type: 'dinner' as const, icon: '🌙', label: 'Dinner' },
    { type: 'snack' as const, icon: '🍎', label: 'Snacks' },
  ];

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  return (
    <div className="food-diary">
      <div className="diary-top">
        <div className="header-text">
          <h1>My Food Diary</h1>
          <p className="text-tertiary">Keep track of your nutrition journey</p>
        </div>
        <div className="date-navigator">
          <button className="date-btn" onClick={() => changeDate(-1)}>‹</button>
          <span className="current-date">{selectedDate === getTodayDate() ? 'Today' : selectedDate}</span>
          <button className="date-btn" onClick={() => changeDate(1)} disabled={selectedDate === getTodayDate()}>›</button>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="food-modal" style={{ maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div className="modal-head" style={{ marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Add to {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}</h2>
                <p className="text-tertiary">Search 100,000+ foods or quick add</p>
              </div>
              <button className="close-modal" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div id="search-section" className="search-section">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    id="search-input"
                    type="text"
                    className="diary-search-input"
                    placeholder="Search foods (e.g. Mutton Biryani, Amla)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="categories">
                  {categories.slice(0, 8).map(cat => (
                    <button
                      key={cat}
                      className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>



                {searchQuery && (
                  <div className="search-results">
                    {filteredFoods.map(food => (
                      <div key={food.id} className="food-card" onClick={() => setSelectedFood(food)}>
                        <div className="f-name">{food.name}</div>
                        <div className="f-details">
                          <span className="f-meta">{food.servingSize}{food.servingUnit} • {food.category}</span>
                          <span className="f-cals">{Math.round(food.calories)} kcal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="meals-list">
        {mealTypes.map(({ type, icon, label }) => {
          const logs = getMealLogs(type);
          const cals = getMealCalories(type);
          return (
            <div key={type} className="meal-group">
              <div className="meal-header">
                <span className="meal-icon">{icon}</span>
                <h3>{label}</h3>
                <span className="meal-sum">{Math.round(cals)} kcal</span>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    setSelectedMealType(type);
                    setIsAddModalOpen(true);
                  }}
                >
                  + Add
                </button>
              </div>
              <div className="logged-items">
                {logs.length === 0 ? (
                  <p className="text-tertiary" style={{ padding: '1rem', fontSize: '0.9rem' }}>No items logged for {label.toLowerCase()}</p>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="logged-item">
                      <div className="item-info">
                        <div className="item-name">{log.foodName}</div>
                        <div className="item-meta">{log.servings} svg • {log.time}</div>
                      </div>
                      <div className="item-nutrition">
                        <div className="macro-dot"><span className="dot p"></span>{Math.round(log.protein)}g</div>
                        <div className="macro-dot"><span className="dot c"></span>{Math.round(log.carbs)}g</div>
                        <div className="macro-dot"><span className="dot f"></span>{Math.round(log.fat)}g</div>
                        <div className="f-cals" style={{ marginLeft: '1rem', minWidth: '60px', textAlign: 'right' }}>{Math.round(log.calories)}</div>
                      </div>
                      <button className="remove-log" onClick={() => handleDeleteLog(log.id)}>×</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedFood && (
        <div className="modal-overlay" onClick={() => setSelectedFood(null)}>
          <div className="food-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>{selectedFood.name}</h2>
                <p className="text-tertiary">{selectedFood.category} • Verified Quality</p>
              </div>
              <button className="close-modal" onClick={() => setSelectedFood(null)}>×</button>
            </div>

            <div className="nutrition-focus">
              <div className="nut-box">
                <span className="nut-val">{Math.round(selectedFood.calories * calculateSizeRatio() * parseFloat(servings))}</span>
                <span className="nut-lab">Calories</span>
              </div>
              <div className="nut-box">
                <span className="nut-val" style={{ color: '#ef4444' }}>{Math.round(selectedFood.protein * calculateSizeRatio() * parseFloat(servings))}g</span>
                <span className="nut-lab">Protein</span>
              </div>
              <div className="nut-box">
                <span className="nut-val" style={{ color: '#3b82f6' }}>{Math.round(selectedFood.carbs * calculateSizeRatio() * parseFloat(servings))}g</span>
                <span className="nut-lab">Carbs</span>
              </div>
              <div className="nut-box">
                <span className="nut-val" style={{ color: '#f59e0b' }}>{Math.round(selectedFood.fat * calculateSizeRatio() * parseFloat(servings))}g</span>
                <span className="nut-lab">Fat</span>
              </div>
            </div>

            <div className="serving-control">
              <div className="label-row">
                <label>Serving Size</label>
                <span className="text-tertiary" style={{ fontSize: '0.8rem', fontWeight: '700' }}>Base: {selectedFood.servingSize}{selectedFood.servingUnit}</span>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  className="servings-input"
                  value={manualServingSize}
                  onChange={e => setManualServingSize(e.target.value)}
                  disabled={['unit', 'cup'].includes(manualServingUnit)}
                  style={{ opacity: ['unit', 'cup'].includes(manualServingUnit) ? 0.5 : 1 }}
                />
                <select
                  className="unit-select"
                  value={manualServingUnit}
                  onChange={e => {
                    const newUnit = e.target.value;
                    setManualServingUnit(newUnit);
                    if (['unit', 'cup'].includes(newUnit)) {
                      setManualServingSize('1');
                    }
                  }}
                >
                  <option value="g">Grams (g)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="cup">Cup</option>
                  <option value="unit">Unit/Piece</option>
                </select>
              </div>
            </div>

            <div className="serving-control">
              <div className="label-row">
                <label>Number of Servings</label>
              </div>
              <input
                type="number"
                className="servings-input"
                value={servings}
                onChange={e => setServings(e.target.value)}
                step="0.5"
                min="0.1"
              />
            </div>

            {(() => {
              const servingsNum = parseFloat(servings) || 1;
              const sizeRatio = calculateSizeRatio();

              return (
                <div className="micronutrients-detail">
                  <h4 style={{ color: 'var(--primary-500)', marginBottom: '1rem', fontSize: '1rem', fontWeight: '800' }}>Nutrient Breakdown</h4>
                  <div className="micro-grid">
                    <div className="micro-item">
                      <span className="micro-label">Fiber</span>
                      <span className="micro-value">{formatNumber((selectedFood.fiber || 0) * sizeRatio * servingsNum)}g</span>
                    </div>
                    {selectedFood.saturatedFat !== undefined && (
                      <div className="micro-item">
                        <span className="micro-label">Sat. Fat</span>
                        <span className="micro-value">{formatNumber(selectedFood.saturatedFat * sizeRatio * servingsNum)}g</span>
                      </div>
                    )}
                    {selectedFood.sodium !== undefined && (
                      <div className="micro-item">
                        <span className="micro-label">Sodium</span>
                        <span className="micro-value">{formatNumber(selectedFood.sodium * sizeRatio * servingsNum)}mg</span>
                      </div>
                    )}
                    {selectedFood.potassium !== undefined && (
                      <div className="micro-item">
                        <span className="micro-label">Potassium</span>
                        <span className="micro-value">{formatNumber(selectedFood.potassium * sizeRatio * servingsNum)}mg</span>
                      </div>
                    )}
                    {selectedFood.cholesterol !== undefined && (
                      <div className="micro-item">
                        <span className="micro-label">Cholesterol</span>
                        <span className="micro-value">{formatNumber(selectedFood.cholesterol * sizeRatio * servingsNum)}mg</span>
                      </div>
                    )}
                    {selectedFood.calcium !== undefined && (
                      <div className="micro-item">
                        <span className="micro-label">Calcium</span>
                        <span className="micro-value">{formatNumber(selectedFood.calcium * sizeRatio * servingsNum)}mg</span>
                      </div>
                    )}
                    {selectedFood.iron !== undefined && (
                      <div className="micro-item">
                        <span className="micro-label">Iron</span>
                        <span className="micro-value">{formatNumber(selectedFood.iron * sizeRatio * servingsNum)}mg</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem', padding: '1.25rem', fontSize: '1.1rem' }}
              onClick={handleAddFood}
            >
              Add to {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
            </button>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="food-modal" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-500)' }}>Delete Entry?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Are you sure you want to remove this item from your log?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="btn"
                style={{ background: '#f1f5f9', color: 'var(--text-secondary)', padding: '0.8rem 2rem' }}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: '#ef4444', padding: '0.8rem 2rem' }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .food-diary {
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 2rem;
        }

        .diary-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-text h1 { font-size: 2rem; font-weight: 800; color: var(--primary-500); margin-bottom: 0.25rem; }

        .date-navigator {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-premium);
        }

        .date-btn {
          background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--primary-500);
          padding: 0.25rem; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
        }
        .date-btn:hover:not(:disabled) { background: #f1f5f9; }
        .date-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .current-date { font-weight: 800; color: var(--primary-500); font-size: 1.1rem; }

        .search-section {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: var(--radius-2xl);
          border: 1px solid var(--glass-border);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-lg);
        }

        .search-box { position: relative; margin-bottom: 1.25rem; }
        .search-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); font-size: 1.2rem; }
        .diary-search-input {
          width: 100%; padding: 1rem 1.25rem 1rem 3.5rem; border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border); background: #f8fafc; font-size: 1rem;
          transition: var(--transition);
        }
        .diary-search-input:focus { border-color: var(--primary-500); background: #ffffff; outline: none; }

        .categories { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .cat-btn {
          padding: 0.6rem 1.25rem; border-radius: var(--radius-full); border: 1px solid var(--glass-border);
          background: #ffffff; color: var(--text-secondary); font-size: 0.85rem; font-weight: 700; cursor: pointer;
          transition: var(--transition);
        }
        .cat-btn:hover { background: #f1f5f9; border-color: var(--primary-500); }
        .cat-btn.active { background: var(--primary-500); color: #ffffff; border-color: var(--primary-500); }

        .search-results {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
          margin-top: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .food-card {
          padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid var(--glass-border);
          background: #ffffff; cursor: pointer; transition: var(--transition);
        }
        .food-card:hover { transform: translateY(-3px); border-color: var(--accent-500); box-shadow: var(--shadow-lg); }

        .f-name { font-weight: 800; color: var(--primary-500); font-size: 1.1rem; margin-bottom: 0.25rem; }
        .f-details { display: flex; justify-content: space-between; align-items: center; }
        .f-meta { font-size: 0.8rem; color: var(--text-tertiary); font-weight: 600; }
        .f-cals { font-weight: 900; color: var(--accent-500); font-size: 1.1rem; }

        .meal-group { margin-bottom: 2.5rem; }
        .meal-header {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;
          padding-bottom: 0.75rem; border-bottom: 2px solid var(--glass-border);
        }
        .meal-header h3 { font-size: 1.3rem; font-weight: 800; color: var(--primary-500); }
        .meal-icon { font-size: 1.5rem; }
        .meal-sum { margin-left: auto; font-weight: 800; color: var(--text-tertiary); font-size: 0.9rem; }

        .logged-item {
          display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem;
          background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--glass-border);
          margin-bottom: 0.75rem; transition: var(--transition);
        }
        .logged-item:hover { border-color: var(--primary-400); transform: translateX(5px); }
        
        .item-info { flex: 1; }
        .item-name { font-weight: 800; color: var(--primary-500); font-size: 1rem; }
        .item-meta { font-size: 0.8rem; color: var(--text-tertiary); font-weight: 600; }
        
        .item-nutrition { display: flex; gap: 1.5rem; align-items: center; }
        .macro-dot { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.p { background: #ef4444; }
        .dot.c { background: #3b82f6; }
        .dot.f { background: #f59e0b; }
        
        .remove-log {
          background: none; border: none; color: #cbd5e1; font-size: 1.2rem; cursor: pointer;
          padding: 0.5rem; border-radius: 50%; transition: var(--transition);
        }
        .remove-log:hover { color: var(--error); background: #fee2e2; }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .food-modal {
          background: #ffffff; width: 90%; max-width: 500px;
          max-height: 90vh; overflow-y: auto; /* Fix for tall content */
          border-radius: var(--radius-2xl);
          padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); border: 1px solid var(--glass-border);
        }

        .modal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .modal-head h2 { font-size: 1.8rem; color: var(--primary-500); font-weight: 800; margin-bottom: 0.25rem; }
        .close-modal { background: #f1f5f9; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary); width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        .nutrition-focus {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
          margin-bottom: 2rem; background: #f8fafc; padding: 1.5rem; border-radius: var(--radius-xl);
        }
        .nut-box { text-align: center; display: flex; flex-direction: column; gap: 0.25rem; }
        .nut-val { font-size: 1.3rem; font-weight: 900; color: var(--primary-500); }
        .nut-lab { font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; }

        .serving-control { margin-bottom: 1.5rem; }
        .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .label-row label { font-weight: 800; color: var(--primary-500); font-size: 1rem; }
        
        .input-group { display: flex; gap: 1rem; }
        .servings-input { flex: 1; padding: 0.8rem 1rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); font-size: 1rem; font-weight: 700; color: var(--primary-500); background: #f8fafc; }
        .unit-select { padding: 0.8rem 1rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); background: #ffffff; font-weight: 700; color: var(--primary-500); }

        .micronutrients-detail {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--glass-border);
        }

        .micro-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .micro-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border-radius: var(--radius-md);
        }

        .micro-label { font-size: 0.8rem; font-weight: 700; color: var(--text-tertiary); }
        .micro-value { font-size: 0.85rem; font-weight: 800; color: var(--primary-500); }

        .q-add-btn { 
          padding: 0.5rem; border-radius: 0.75rem; border: none; font-size: 0.7rem; 
          font-weight: 800; cursor: pointer; color: white; transition: 0.2s;
        }
        .q-add-btn.b { background: #f59e0b; }
        .q-add-btn.l { background: #10b981; }
        .q-add-btn.d { background: #3b82f6; }
        .q-add-btn.s { background: #8b5cf6; }
        .q-add-btn:hover { opacity: 0.8; transform: translateY(-2px); }

        @media (max-width: 768px) {
          .diary-top { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .item-nutrition { display: none; }
          .modal-overlay { align-items: flex-end; }
          .food-modal { border-bottom-left-radius: 0; border-bottom-right-radius: 0; width: 100%; max-width: 100%; }
        }
      `}</style>
    </div>
  );
};
