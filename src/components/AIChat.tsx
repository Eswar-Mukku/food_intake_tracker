import React, { useState, useRef, useEffect } from 'react';
import type { User, FoodLog } from '../types/index';
import { generateId } from '../utils/helpers';
import { saveFoodLog } from '../utils/storage';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  suggestions?: any[];
}

interface AIChatProps {
  user: User;
  onDataUpdate: (log: FoodLog) => void;
}

export const AIChat: React.FC<AIChatProps> = ({ user, onDataUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: generateId(), type: 'ai', text: `👨‍🍳 Hi ${user.name || 'there'}! I'm your AI Chef. Tell me what ingredients you have (e.g., "Chicken, Rice, Peppers"), and I'll create healthy recipes for you!` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('openAIChat', handleOpenChat);
    return () => window.removeEventListener('openAIChat', handleOpenChat);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: generateId(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Recipe Mode Logic
    setTimeout(() => {
      const cleanInput = inputValue.replace(/and/g, ',').replace(/\./g, ',');
      const items = cleanInput.split(',').map(i => i.trim()).filter(i => i.length > 1);

      const ingredients = items.map(i => i.charAt(0).toUpperCase() + i.slice(1));
      const aiText = `I've created 3 custom recipes using your ${ingredients.length} ingredients: ${ingredients.join(', ')}!`;

      const suggestions = [
        {
          id: generateId(),
          name: `Ultimate ${ingredients[0] || 'Health'} Fusion Bowl`,
          calories: 450, protein: 35, carbs: 40, fat: 15, fiber: 6,
          sodium: 480, potassium: 500, cholesterol: 100, vitaminA: 50, vitaminC: 20, calcium: 80, iron: 3,
          ingredients: [...ingredients, 'Olive Oil', 'Sea Salt', 'Black Pepper'],
          steps: [
            `Prep all your main ingredients: ${ingredients.join(', ')}.`,
            `Sauté ${ingredients.slice(0, 3).join(' and ')} in a large pan with olive oil.`,
            `Add the rest: ${ingredients.slice(3).join(', ')} and cook until tender.`,
            `Season with salt and pepper and serve in a deep bowl.`
          ]
        },
        {
          id: generateId(),
          name: `Quick ${ingredients[1] || 'Protein'} High-Energy Stir-fry`,
          calories: 380, protein: 42, carbs: 15, fat: 18, fiber: 4,
          sodium: 600, potassium: 350, cholesterol: 85, vitaminA: 30, vitaminC: 45, calcium: 60, iron: 2.5,
          ingredients: [...ingredients, 'Soy Sauce', 'Ginger', 'Garlic'],
          steps: [
            `Finely chop ${ingredients.join(' and ')}.`,
            `Heat a wok with a dash of oil and toss in garlic/ginger.`,
            `Stir-fry ${ingredients.join(', ')} on high heat for 8 minutes.`,
            `Drizzle soy sauce over the mix and toss one last time.`
          ]
        },
        {
          id: generateId(),
          name: `Fresh ${ingredients[2] || 'Garden'} Signature Platter`,
          calories: 310, protein: 28, carbs: 12, fat: 14, fiber: 8,
          sodium: 250, potassium: 600, cholesterol: 40, vitaminA: 120, vitaminC: 80, calcium: 100, iron: 4,
          ingredients: [...ingredients, 'Lemon juice', 'Fresh Cilantro'],
          steps: [
            `Steam ${ingredients.filter((_, i) => i % 2 === 0).join(' and ')} until soft.`,
            `Grill ${ingredients.filter((_, i) => i % 2 !== 0).join(' and ')} for a smoky flavor.`,
            `Assemble everything on a large platter.`,
            `Squeeze fresh lemon juice over your ${ingredients.length} items and enjoy.`
          ]
        }
      ];

      setMessages(prev => [...prev, {
        id: generateId(),
        type: 'ai',
        text: aiText,
        suggestions
      }]);
      setIsTyping(false);
    }, 1200);
  };


  const handleLogToMeal = (sug: any, mealType: string) => {
    const log: FoodLog = {
      id: generateId(),
      userId: user.id,
      foodId: 'recipe-' + generateId(),
      foodName: sug.name,
      mealType: mealType as any,
      servings: 1,
      calories: sug.calories,
      protein: sug.protein,
      carbs: sug.carbs,
      fat: sug.fat,
      fiber: sug.fiber || 0,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

      // Save Micronutrients

      // timestamp removed to match type
    };
    saveFoodLog(log); // Persist to storage
    onDataUpdate(log); // Update parent state

    setMessages(prev => [...prev, {
      id: generateId(),
      type: 'ai',
      text: `✅ Logged "${sug.name}" to ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}!`
    }]);
  };

  return (

    <>
      <button className={`ai-fab ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '×' : '✨'}
      </button>

      {isOpen && (
        <div className="ai-wrapper">
          <div className="ai-header-simple">
            <div className="header-top">
              <h3>👨‍🍳 Smart Chef</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
              </div>
            </div>
          </div>

          <div className="ai-chat-body" ref={scrollRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`chat-line ${msg.type}`}>
                <div className="chat-bubble-new">
                  <div className="msg-text">
                    {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="recipe-grid">
                      {msg.suggestions.map((s) => (
                        <div key={s.id} className={`recipe-card-mini ${expandedRecipe === s.id ? 'expanded' : ''}`}>
                          <div className="recipe-info">
                            <span className="r-name">{s.name}</span>
                            <span className="r-cals">{s.calories} kcal</span>
                          </div>

                          <button
                            className="btn-details"
                            onClick={() => setExpandedRecipe(expandedRecipe === s.id ? null : s.id)}
                          >
                            {expandedRecipe === s.id ? 'Hide Details' : 'View Recipe Details'}
                          </button>

                          {expandedRecipe === s.id && (
                            <div className="recipe-details-panel">
                              <div className="detail-sec">
                                <h5>Ingredients</h5>
                                <ul>{s.ingredients.map((ing: string, idx: number) => <li key={idx}>{ing}</li>)}</ul>
                              </div>
                              <div className="detail-sec">
                                <h5>Cooking Steps</h5>
                                <ol>{s.steps.map((step: string, idx: number) => <li key={idx}>{step}</li>)}</ol>
                              </div>
                            </div>
                          )}

                          <div className="meal-options">
                            <button className="meal-opt b" onClick={() => handleLogToMeal(s, 'breakfast')}>+Bk</button>
                            <button className="meal-opt l" onClick={() => handleLogToMeal(s, 'lunch')}>+Ln</button>
                            <button className="meal-opt d" onClick={() => handleLogToMeal(s, 'dinner')}>+Dn</button>
                            <button className="meal-opt s" onClick={() => handleLogToMeal(s, 'snack')}>+Sk</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-line ai">
                <div className="chat-bubble-new typing">Chef is cooking up ideas...</div>
              </div>
            )}
          </div>

          <div className="ai-chat-footer">
            <input
              type="text"
              className="chat-inp"
              placeholder="Enter ingredients (e.g. egg, rice, tomato)..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-send" onClick={handleSend} disabled={!inputValue.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        .ai-fab {
          position: fixed; bottom: 2rem; right: 2rem; width: 64px; height: 64px;
          border-radius: 50%; background: #3b82f6; color: white; border: none;
          font-size: 1.8rem; cursor: pointer; z-index: 9999;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s;
        }
        .ai-fab:hover { transform: scale(1.1); }

        .ai-wrapper {
          position: fixed; bottom: 6rem; right: 2rem; width: 450px; 
          height: auto; max-height: 80vh; min-height: 500px;
          background: #0f172a; border-radius: 20px; 
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 30px 60px rgba(0,0,0,0.6); z-index: 9998; 
          display: flex; flex-direction: column;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .ai-header-simple {
          background: #1e293b;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        .header-top {
          display: flex; justify-content: space-between; align-items: center;
        }
        .header-top h3 {
          margin: 0; color: white; font-size: 1.25rem; font-weight: 700;
        }
        .close-btn {
          background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;
        }
        .close-btn:hover { color: white; }

        .ai-chat-body {
          flex: 1; overflow-y: auto; padding: 1.5rem;
          display: flex; flex-direction: column; gap: 1rem;
        }

        .chat-line { display: flex; width: 100%; }
        .chat-line.user { justify-content: flex-end; }
        .chat-line.ai { justify-content: flex-start; }

        .chat-bubble-new {
          max-width: 85%; padding: 1rem 1.25rem; border-radius: 18px;
          font-size: 0.95rem; line-height: 1.5; color: #e2e8f0;
          background: #1e293b;
        }
        .chat-line.user .chat-bubble-new {
          background: #3b82f6; color: white;
          border-bottom-right-radius: 4px;
        }
        .chat-line.ai .chat-bubble-new {
          border-bottom-left-radius: 4px;
        }

        .ai-chat-footer {
          padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);
          background: #1e293b;
          display: flex; gap: 0.5rem;
          flex-shrink: 0;
        }
        .chat-inp {
          flex: 1; padding: 0.8rem 1rem; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.2); color: white; outline: none;
        }
        .chat-inp:focus { border-color: #3b82f6; }
        .chat-send {
          background: #3b82f6; color: white; border: none;
          width: 45px; border-radius: 10px; cursor: pointer;
          font-size: 1.2rem;
        }

        /* Recipe Card Styles */
        .recipe-grid { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
        .recipe-card-mini { background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
        .recipe-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 700; color: white; }
        .r-cals { color: #34d399; }
        .btn-details { width: 100%; padding: 0.5rem; margin: 0.5rem 0; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; border-radius: 6px; cursor: pointer; }
        .meal-options { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
        .meal-opt { padding: 4px; border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 0.75rem; font-weight: bold; }
        .meal-opt.b { background: #f59e0b; }
        .meal-opt.l { background: #10b981; }
        .meal-opt.d { background: #3b82f6; }
        .meal-opt.s { background: #8b5cf6; }

        .recipe-details-panel { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 0.85rem; }
        .detail-sec h5 { color: #94a3b8; margin: 5px 0; }
        .detail-sec ul, .detail-sec ol { padding-left: 20px; color: #cbd5e1; }

        @media (max-width: 480px) {
          .ai-wrapper { bottom: 0; right: 0; width: 100%; height: 100%; border-radius: 0; }
          .ai-fab { bottom: 1rem; right: 1rem; }
        }
      `}</style>
    </>
  );
};
