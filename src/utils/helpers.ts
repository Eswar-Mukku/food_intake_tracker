import type { User } from '../types/index';

// BMR Calculation using Mifflin-St Jeor Equation
export const calculateBMR = (user: User): number => {
    const { currentWeight, height, age, gender } = user;

    if (gender === 'male') {
        return 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }
};

// TDEE Calculation (Total Daily Energy Expenditure)
export const calculateTDEE = (user: User): number => {
    const bmr = calculateBMR(user);
    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very-active': 1.9
    };

    return bmr * activityMultipliers[user.activityLevel];
};

// Calculate daily calorie goal based on user's goal
export const calculateCalorieGoal = (user: User): number => {
    const tdee = calculateTDEE(user);

    if (user.goal === 'lose') {
        return tdee - 500; // 500 calorie deficit for ~0.5kg weight loss per week
    } else if (user.goal === 'gain') {
        return tdee + 300; // 300 calorie surplus for gradual weight gain
    } else {
        return tdee;
    }
};

// Calculate macro goals
export const calculateMacroGoals = (calorieGoal: number) => {
    // Standard macro split: 30% protein, 40% carbs, 30% fat
    const protein = (calorieGoal * 0.30) / 4; // 4 calories per gram of protein
    const carbs = (calorieGoal * 0.40) / 4; // 4 calories per gram of carbs
    const fat = (calorieGoal * 0.30) / 9; // 9 calories per gram of fat

    return { protein, carbs, fat };
};

// Calculate BMI
export const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
};

// Get BMI category
export const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Get today's date as YYYY-MM-DD
export const getTodayDate = (): string => {
    return formatDate(new Date());
};

// Parse date string to Date object
export const parseDate = (dateString: string): Date => {
    return new Date(dateString);
};

// Check if two dates are the same day
export const isSameDay = (date1: string, date2: string): boolean => {
    return date1 === date2;
};

// Get formatted time (HH:MM)
export const getCurrentTime = (): string => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.min(Math.round((value / total) * 100), 100);
};

// Generate unique ID
export const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get days between two dates
export const getDaysBetween = (date1: string, date2: string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get date range for last N days
export const getDateRange = (days: number): string[] => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(formatDate(date));
    }

    return dates;
};

// Calculate average
export const calculateAverage = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

// Format number with decimals
export const formatNumber = (num: number, decimals: number = 1): string => {
    return num.toFixed(decimals);
};

// Get streak days
export const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;

    const uniqueDates = Array.from(new Set(dates)).sort().reverse();
    const today = getTodayDate();

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = formatDate(yesterdayDate);

    let streak = 0;
    let currentDateToCheck = today;

    // If today hasn't been logged, start checking from yesterday
    if (!uniqueDates.includes(today)) {
        if (uniqueDates.includes(yesterday)) {
            currentDateToCheck = yesterday;
        } else {
            return 0; // No log today or yesterday, streak is 0
        }
    }

    const checkDate = new Date(currentDateToCheck);

    while (true) {
        const dateString = formatDate(checkDate);
        if (uniqueDates.includes(dateString)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};
