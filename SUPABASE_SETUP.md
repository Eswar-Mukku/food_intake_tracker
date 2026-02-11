# Supabase Database Setup (Optional)

Your app currently works 100% locally without Supabase. If you want cloud sync, follow these steps:

## Step 1: Create Tables

Go to your Supabase SQL Editor and run:

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  height INTEGER NOT NULL,
  currentWeight DECIMAL NOT NULL,
  goalWeight DECIMAL NOT NULL,
  activityLevel TEXT NOT NULL,
  goal TEXT NOT NULL,
  dailyCalorieGoal INTEGER NOT NULL,
  dailyProteinGoal INTEGER NOT NULL,
  dailyCarbsGoal INTEGER NOT NULL,
  dailyFatGoal INTEGER NOT NULL,
  dailyWaterGoal INTEGER NOT NULL,
  createdAt TIMESTAMP NOT NULL
);

-- Food logs table
CREATE TABLE food_logs (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  foodId TEXT NOT NULL,
  foodName TEXT NOT NULL,
  mealType TEXT NOT NULL,
  servings DECIMAL NOT NULL,
  calories DECIMAL NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  fiber DECIMAL NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  saturatedFat DECIMAL,
  polyunsaturatedFat DECIMAL,
  monounsaturatedFat DECIMAL,
  transFat DECIMAL,
  cholesterol DECIMAL,
  sodium DECIMAL,
  potassium DECIMAL,
  vitaminA DECIMAL,
  vitaminC DECIMAL,
  calcium DECIMAL,
  iron DECIMAL
);

-- Water logs table
CREATE TABLE water_logs (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL
);

-- Weight logs table
CREATE TABLE weight_logs (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL NOT NULL,
  date TIMESTAMP NOT NULL,
  note TEXT
);

-- Exercise logs table
CREATE TABLE exercise_logs (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exerciseName TEXT NOT NULL,
  duration INTEGER NOT NULL,
  caloriesBurned INTEGER NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL
);
```

## Step 2: Enable Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

-- Users: Can read/write their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Food logs: Users can manage their own logs
CREATE POLICY "Users can view own food logs" ON food_logs
  FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert own food logs" ON food_logs
  FOR INSERT WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can delete own food logs" ON food_logs
  FOR DELETE USING (auth.uid()::text = userId);

-- Water logs: Users can manage their own logs
CREATE POLICY "Users can view own water logs" ON water_logs
  FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert own water logs" ON water_logs
  FOR INSERT WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can delete own water logs" ON water_logs
  FOR DELETE USING (auth.uid()::text = userId);

-- Weight logs: Users can manage their own logs
CREATE POLICY "Users can view own weight logs" ON weight_logs
  FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert own weight logs" ON weight_logs
  FOR INSERT WITH CHECK (auth.uid()::text = userId);

-- Exercise logs: Users can manage their own logs
CREATE POLICY "Users can view own exercise logs" ON exercise_logs
  FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert own exercise logs" ON exercise_logs
  FOR INSERT WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can delete own exercise logs" ON exercise_logs
  FOR DELETE USING (auth.uid()::text = userId);
```

## Step 3: Test

After running these SQL commands, your app will automatically start syncing to Supabase!
