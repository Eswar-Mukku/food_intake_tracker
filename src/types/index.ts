export interface User {
    id: string;
    email: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    height: number; // in cm
    currentWeight: number; // in kg
    goalWeight: number; // in kg
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
    goal: 'lose' | 'maintain' | 'gain';
    dailyCalorieGoal: number;
    dailyProteinGoal: number;
    dailyCarbsGoal: number;
    dailyFatGoal: number;
    dailyWaterGoal: number;
    createdAt: string;
}

export interface FoodLog {
    id: string;
    userId: string;
    foodId: string;
    foodName: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    servings: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;

    // Detailed Fats
    saturatedFat?: number;
    polyunsaturatedFat?: number;
    monounsaturatedFat?: number;
    transFat?: number;

    // Other Nutrients
    cholesterol?: number;
    sodium?: number;
    potassium?: number;
    vitaminA?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;

    date: string; // YYYY-MM-DD
    time: string;
}

export interface WaterLog {
    id: string;
    userId: string;
    amount: number; // in ml
    date: string;
    time: string;
}

export interface WeightLog {
    id: string;
    userId: string;
    weight: number; // in kg
    date: string;
    note?: string;
}

export interface ExerciseLog {
    id: string;
    userId: string;
    exerciseName: string;
    duration: number; // in minutes
    caloriesBurned: number;
    date: string;
    time: string;
    type: 'cardio' | 'strength' | 'yoga' | 'sports' | 'other';
}

export interface DailySummary {
    date: string;
    caloriesConsumed: number;
    caloriesBurned: number;
    netCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;

    saturatedFat: number;
    polyunsaturatedFat: number;
    monounsaturatedFat: number;
    transFat: number;
    cholesterol: number;
    sodium: number;
    potassium: number;
    vitaminA: number;
    vitaminC: number;
    calcium: number;
    iron: number;

    water: number;
    meals: {
        breakfast: number;
        lunch: number;
        dinner: number;
        snack: number;
    };
}
