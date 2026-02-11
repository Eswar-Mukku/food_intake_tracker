import type { User, FoodLog, WaterLog, WeightLog, ExerciseLog } from '../types/index';
import { supabase } from '../config/supabase';

const STORAGE_KEYS = {
    CURRENT_USER: 'healthify_current_user',
    USERS: 'healthify_users',
    FOOD_LOGS: 'healthify_food_logs',
    WATER_LOGS: 'healthify_water_logs',
    WEIGHT_LOGS: 'healthify_weight_logs',
    EXERCISE_LOGS: 'healthify_exercise_logs',
};

// Generic storage functions
const getFromStorage = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting ${key} from storage:`, error);
        return null;
    }
};

const saveToStorage = <T>(key: string, data: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
    }
};

// Cloud Sync logic
export const syncAllDataFromCloud = async (userId: string): Promise<void> => {
    try {
        // Fetch all logs in parallel
        const [foodData, waterData, exerciseData, weightData] = await Promise.all([
            supabase.from('food_logs').select('*').eq('userId', userId),
            supabase.from('water_logs').select('*').eq('userId', userId),
            supabase.from('exercise_logs').select('*').eq('userId', userId),
            supabase.from('weight_logs').select('*').eq('userId', userId),
        ]);

        if (foodData.data) saveToStorage(STORAGE_KEYS.FOOD_LOGS, foodData.data);
        if (waterData.data) saveToStorage(STORAGE_KEYS.WATER_LOGS, waterData.data);
        if (exerciseData.data) saveToStorage(STORAGE_KEYS.EXERCISE_LOGS, exerciseData.data);
        if (weightData.data) saveToStorage(STORAGE_KEYS.WEIGHT_LOGS, weightData.data);

        console.log('Successfully synced all data from cloud');
    } catch (error) {
        console.error('Error syncing data from cloud:', error);
    }
};

// User management
export const getCurrentUser = (): User | null => {
    return getFromStorage<User>(STORAGE_KEYS.CURRENT_USER);
};

export const saveCurrentUser = async (user: User): Promise<void> => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    // Sync to cloud in background
    saveUserToCloud(user);
};

export const clearCurrentUser = (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Cloud User management
export const saveUserToCloud = async (user: User): Promise<void> => {
    try {
        const { error } = await supabase.from('users').upsert(user);
        if (error) throw error;
    } catch (error) {
        console.error('Error saving user to cloud:', error);
    }
};

export const getUserFromCloud = async (userId: string): Promise<User | null> => {
    try {
        const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
        if (error) return null;
        return data as User;
    } catch (error) {
        console.error('Error getting user from cloud:', error);
        return null;
    }
};

export const getLoggedDates = (userId: string): string[] => {
    const allLogs = getFromStorage<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS) || [];
    const userLogs = allLogs.filter(log => log.userId === userId);
    const dates = userLogs.map(log => log.date);
    return [...new Set(dates)]; // Unique dates
};

// Food logs
export const getFoodLogs = (userId: string, date?: string): FoodLog[] => {
    const allLogs = getFromStorage<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS) || [];
    let userLogs = allLogs.filter(log => log.userId === userId);

    if (date) {
        userLogs = userLogs.filter(log => log.date === date);
    }

    return userLogs.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
};

export const saveFoodLog = async (log: FoodLog): Promise<void> => {
    const logs = getFromStorage<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS) || [];
    logs.push(log);
    saveToStorage(STORAGE_KEYS.FOOD_LOGS, logs);

    // Save to cloud in background (don't block UI)
    supabase.from('food_logs').upsert(log).then(({ error }) => {
        if (error) console.error('Error saving food log to cloud:', error);
    });
};

export const deleteFoodLog = async (logId: string): Promise<void> => {
    const logs = getFromStorage<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS) || [];
    const filtered = logs.filter(log => log.id !== logId);
    saveToStorage(STORAGE_KEYS.FOOD_LOGS, filtered);

    // Background delete from cloud
    supabase.from('food_logs').delete().eq('id', logId).then(({ error }) => {
        if (error) console.error('Error deleting food log from cloud:', error);
    });
};

// Water logs
export const getWaterLogs = (userId: string, date?: string): WaterLog[] => {
    const allLogs = getFromStorage<WaterLog[]>(STORAGE_KEYS.WATER_LOGS) || [];
    let userLogs = allLogs.filter(log => log.userId === userId);

    if (date) {
        userLogs = userLogs.filter(log => log.date === date);
    }

    return userLogs;
};

export const saveWaterLog = async (log: WaterLog): Promise<void> => {
    const logs = getFromStorage<WaterLog[]>(STORAGE_KEYS.WATER_LOGS) || [];
    logs.push(log);
    saveToStorage(STORAGE_KEYS.WATER_LOGS, logs);

    // Background save
    supabase.from('water_logs').upsert(log).then(({ error }) => {
        if (error) console.error('Error saving water log to cloud:', error);
    });
};

export const getTotalWaterForDate = (userId: string, date: string): number => {
    const logs = getWaterLogs(userId, date);
    return logs.reduce((total, log) => total + log.amount, 0);
};

export const removeLatestWaterLog = async (userId: string, date: string): Promise<void> => {
    const allLogs = getFromStorage<WaterLog[]>(STORAGE_KEYS.WATER_LOGS) || [];
    // Find the last entry for this user and date
    const index = [...allLogs].reverse().findIndex(log => log.userId === userId && log.date === date);

    if (index !== -1) {
        const actualIndex = allLogs.length - 1 - index;
        const removedLog = allLogs[actualIndex];
        allLogs.splice(actualIndex, 1);
        saveToStorage(STORAGE_KEYS.WATER_LOGS, allLogs);

        // Background delete from cloud
        supabase.from('water_logs').delete().eq('id', removedLog.id).then(({ error }) => {
            if (error) console.error('Error deleting water log from cloud:', error);
        });
    }
};

// Weight logs
export const getWeightLogs = (userId: string): WeightLog[] => {
    const allLogs = getFromStorage<WeightLog[]>(STORAGE_KEYS.WEIGHT_LOGS) || [];
    return allLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const saveWeightLog = async (log: WeightLog): Promise<void> => {
    const logs = getFromStorage<WeightLog[]>(STORAGE_KEYS.WEIGHT_LOGS) || [];
    logs.push(log);
    saveToStorage(STORAGE_KEYS.WEIGHT_LOGS, logs);

    // Background save
    supabase.from('weight_logs').upsert(log).then(({ error }) => {
        if (error) console.error('Error saving weight log to cloud:', error);
    });
};

export const getLatestWeight = (userId: string): WeightLog | null => {
    const logs = getWeightLogs(userId);
    return logs[0] || null;
};

// Exercise logs
export const getExerciseLogs = (userId: string, date?: string): ExerciseLog[] => {
    const allLogs = getFromStorage<ExerciseLog[]>(STORAGE_KEYS.EXERCISE_LOGS) || [];
    let userLogs = allLogs.filter(log => log.userId === userId);

    if (date) {
        userLogs = userLogs.filter(log => log.date === date);
    }

    return userLogs.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
};

export const saveExerciseLog = async (log: ExerciseLog): Promise<void> => {
    const logs = getFromStorage<ExerciseLog[]>(STORAGE_KEYS.EXERCISE_LOGS) || [];
    logs.push(log);
    saveToStorage(STORAGE_KEYS.EXERCISE_LOGS, logs);

    // Background save
    supabase.from('exercise_logs').upsert(log).then(({ error }) => {
        if (error) console.error('Error saving exercise log to cloud:', error);
    });
};

export const deleteExerciseLog = async (logId: string): Promise<void> => {
    const logs = getFromStorage<ExerciseLog[]>(STORAGE_KEYS.EXERCISE_LOGS) || [];
    const filtered = logs.filter(log => log.id !== logId);
    saveToStorage(STORAGE_KEYS.EXERCISE_LOGS, filtered);

    // Background delete from cloud
    supabase.from('exercise_logs').delete().eq('id', logId).then(({ error }) => {
        if (error) console.error('Error deleting exercise log from cloud:', error);
    });
};

export const getTotalCaloriesBurnedForDate = (userId: string, date: string): number => {
    const logs = getExerciseLogs(userId, date);
    return logs.reduce((total, log) => total + log.caloriesBurned, 0);
};

// Clear all data (for testing or logout)
export const clearAllData = (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
};
