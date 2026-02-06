export interface FoodItem {
    id: string;
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    servingSize: string;
    servingUnit: string;

    // Optional micronutrients
    saturatedFat?: number;
    sodium?: number;
    cholesterol?: number;
    potassium?: number;
    calcium?: number;
    iron?: number;
    vitaminA?: number;
    vitaminC?: number;
}

export const foodDatabase: FoodItem[] = [
    // --- BREADS & GRAINS ---
    { id: 'b1', name: 'White Bread', category: 'Grains', calories: 265, protein: 9, carbs: 49, fat: 3, fiber: 2.7, servingSize: '100', servingUnit: 'g', sodium: 490, potassium: 100, calcium: 100, iron: 3, vitaminA: 0, vitaminC: 0 },
    { id: 'b2', name: 'Whole Wheat Bread', category: 'Grains', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, servingSize: '100', servingUnit: 'g', sodium: 450, potassium: 250, calcium: 60, iron: 3.5, vitaminA: 0, vitaminC: 0 },
    { id: 'b3', name: 'Brown Bread', category: 'Grains', calories: 250, protein: 8, carbs: 45, fat: 3, fiber: 5, servingSize: '100', servingUnit: 'g', sodium: 470, potassium: 200, calcium: 80, iron: 3, vitaminA: 0, vitaminC: 0 },
    { id: 'b4', name: 'Multigrain Bread', category: 'Grains', calories: 265, protein: 12, carbs: 43, fat: 4, fiber: 6, servingSize: '100', servingUnit: 'g', sodium: 460, potassium: 230, calcium: 90, iron: 3.2, vitaminA: 0, vitaminC: 0 },
    { id: 'b5', name: 'Pav (Indian Bread Roll)', category: 'Grains', calories: 280, protein: 8, carbs: 55, fat: 3, fiber: 2, servingSize: '1', servingUnit: 'piece', sodium: 300, potassium: 90, calcium: 50, iron: 2, vitaminA: 0, vitaminC: 0 },
    { id: 'b6', name: 'Burger Bun', category: 'Grains', calories: 150, protein: 5, carbs: 28, fat: 2, fiber: 1.5, servingSize: '1', servingUnit: 'piece', sodium: 220, potassium: 70, calcium: 60, iron: 1.5, vitaminA: 0, vitaminC: 0 },
    { id: 'b7', name: 'Oats (Rolled, Dry)', category: 'Grains', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, servingSize: '100', servingUnit: 'g', sodium: 2, potassium: 429, calcium: 54, iron: 4.7, vitaminA: 0, vitaminC: 0 },
    { id: 'b8', name: 'Quinoa (Cooked)', category: 'Grains', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, servingSize: '100', servingUnit: 'g', sodium: 7, potassium: 172, calcium: 17, iron: 1.5, vitaminA: 0, vitaminC: 0 },
    { id: 'b9', name: 'Cornflakes', category: 'Grains', calories: 357, protein: 8, carbs: 84, fat: 0.4, fiber: 3, servingSize: '100', servingUnit: 'g', sodium: 720, potassium: 150, calcium: 10, iron: 28, vitaminA: 100, vitaminC: 10 },
    { id: 'b10', name: 'Muesli', category: 'Grains', calories: 340, protein: 10, carbs: 65, fat: 5, fiber: 8, servingSize: '100', servingUnit: 'g', sodium: 250, potassium: 350, calcium: 40, iron: 5, vitaminA: 50, vitaminC: 2 },

    // --- PROTEIN & EGGS ---
    { id: 'p1', name: 'Egg (Large, Whole)', category: 'Protein', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, servingSize: '1', servingUnit: 'piece', cholesterol: 186, sodium: 71, potassium: 69, calcium: 28, iron: 1, vitaminA: 80, vitaminC: 0, saturatedFat: 1.6 },
    { id: 'p2', name: 'Egg White (Large)', category: 'Protein', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0, servingSize: '1', servingUnit: 'piece', cholesterol: 0, sodium: 55, potassium: 54, calcium: 2, iron: 0, vitaminA: 0, vitaminC: 0, saturatedFat: 0 },
    { id: 'p3', name: 'Chicken Breast (Cooked, Skinless)', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100', servingUnit: 'g', cholesterol: 85, sodium: 74, potassium: 256, calcium: 15, iron: 1, vitaminA: 5, vitaminC: 0, saturatedFat: 1 },
    { id: 'p4', name: 'Chicken Thigh (Cooked, No Skin)', category: 'Protein', calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0, servingSize: '100', servingUnit: 'g', cholesterol: 95, sodium: 85, potassium: 230, calcium: 12, iron: 1.2, vitaminA: 20, vitaminC: 0, saturatedFat: 3 },
    { id: 'p5', name: 'Ground Beef (90% Lean, Cooked)', category: 'Protein', calories: 214, protein: 26, carbs: 0, fat: 11, fiber: 0, servingSize: '100', servingUnit: 'g', cholesterol: 80, sodium: 70, potassium: 350, calcium: 20, iron: 2.7, vitaminA: 0, vitaminC: 0, saturatedFat: 4.5 },
    { id: 'p6', name: 'Fish (Salmon, Cooked)', category: 'Protein', calories: 208, protein: 22, carbs: 0, fat: 13, fiber: 0, servingSize: '100', servingUnit: 'g', cholesterol: 55, sodium: 60, potassium: 363, calcium: 10, iron: 0.5, vitaminA: 50, vitaminC: 0, saturatedFat: 3 },
    { id: 'p7', name: 'Fish (Cod/White fish, Cooked)', category: 'Protein', calories: 105, protein: 23, carbs: 0, fat: 0.9, fiber: 0, servingSize: '100', servingUnit: 'g', cholesterol: 45, sodium: 90, potassium: 400, calcium: 15, iron: 0.4, vitaminA: 10, vitaminC: 1, saturatedFat: 0.2 },
    { id: 'p8', name: 'Paneer (Indian Cottage Cheese)', category: 'Protein', calories: 295, protein: 19, carbs: 3, fat: 23, fiber: 0, servingSize: '100', servingUnit: 'g', cholesterol: 60, sodium: 20, potassium: 120, calcium: 400, iron: 0.2, vitaminA: 180, vitaminC: 0, saturatedFat: 14 },
    { id: 'p9', name: 'Tofu (Firm)', category: 'Protein', calories: 144, protein: 16, carbs: 4, fat: 8, fiber: 2, servingSize: '100', servingUnit: 'g', cholesterol: 0, sodium: 15, potassium: 120, calcium: 350, iron: 5.4, vitaminA: 0, vitaminC: 0, saturatedFat: 1 },
    { id: 'p10', name: 'Whey Protein Isolate', category: 'Protein', calories: 120, protein: 25, carbs: 2, fat: 1, fiber: 0, servingSize: '30', servingUnit: 'g', cholesterol: 5, sodium: 50, potassium: 150, calcium: 100, iron: 0.5, vitaminA: 0, vitaminC: 0, saturatedFat: 0.5 },

    // --- INDIAN BREAKFAST ---
    { id: 'ib1', name: 'Idli (Medium)', category: 'Indian Breakfast', calories: 39, protein: 1, carbs: 8, fat: 0.1, fiber: 0.5, servingSize: '1', servingUnit: 'piece', sodium: 5, potassium: 30, calcium: 5, iron: 0.5, vitaminA: 0, vitaminC: 0 },
    { id: 'ib2', name: 'Dosa (Plain, Medium)', category: 'Indian Breakfast', calories: 133, protein: 3, carbs: 22, fat: 4, fiber: 1.5, servingSize: '1', servingUnit: 'piece', sodium: 80, potassium: 60, calcium: 10, iron: 1, vitaminA: 0, vitaminC: 0 },
    { id: 'ib3', name: 'Masala Dosa', category: 'Indian Breakfast', calories: 250, protein: 5, carbs: 36, fat: 9, fiber: 2.5, servingSize: '1', servingUnit: 'piece', sodium: 220, potassium: 150, calcium: 30, iron: 2, vitaminA: 20, vitaminC: 5, saturatedFat: 3 },
    { id: 'ib4', name: 'Uttapam (Plain)', category: 'Indian Breakfast', calories: 180, protein: 4, carbs: 32, fat: 4, fiber: 2, servingSize: '1', servingUnit: 'piece', sodium: 150, potassium: 100, calcium: 20, iron: 1.5, vitaminA: 10, vitaminC: 2 },
    { id: 'ib5', name: 'Poha (Cooked)', category: 'Indian Breakfast', calories: 180, protein: 3, carbs: 35, fat: 4, fiber: 2, servingSize: '100', servingUnit: 'g', sodium: 120, potassium: 110, calcium: 15, iron: 4, vitaminA: 0, vitaminC: 5 },
    { id: 'ib6', name: 'Upma (Semolina)', category: 'Indian Breakfast', calories: 220, protein: 5, carbs: 40, fat: 5, fiber: 3, servingSize: '100', servingUnit: 'g', sodium: 280, potassium: 90, calcium: 15, iron: 1, vitaminA: 50, vitaminC: 0 },
    { id: 'ib7', name: 'Aloo Paratha', category: 'Indian Breakfast', calories: 280, protein: 6, carbs: 42, fat: 10, fiber: 4, servingSize: '1', servingUnit: 'piece', sodium: 320, potassium: 250, calcium: 40, iron: 3, vitaminA: 10, vitaminC: 8 },
    { id: 'ib8', name: 'Paneer Paratha', category: 'Indian Breakfast', calories: 320, protein: 10, carbs: 38, fat: 14, fiber: 3, servingSize: '1', servingUnit: 'piece', sodium: 350, potassium: 200, calcium: 150, iron: 2, vitaminA: 60, vitaminC: 2, saturatedFat: 6 },
    { id: 'ib9', name: 'Appam', category: 'Indian Breakfast', calories: 120, protein: 2, carbs: 22, fat: 3, fiber: 1, servingSize: '1', servingUnit: 'piece', sodium: 80, potassium: 50, calcium: 10, iron: 0.5, vitaminA: 0, vitaminC: 0 },
    { id: 'ib10', name: 'Vada (Medu Vada)', category: 'Snacks', calories: 97, protein: 3, carbs: 8, fat: 6, fiber: 1, servingSize: '1', servingUnit: 'piece', sodium: 110, potassium: 60, calcium: 15, iron: 1, vitaminA: 0, vitaminC: 0 },

    // --- INDIAN MAIN COURSE ---
    { id: 'im1', name: 'Dal Tadka', category: 'Indian Main', calories: 120, protein: 7, carbs: 18, fat: 3, fiber: 6, servingSize: '100', servingUnit: 'g', sodium: 320, potassium: 280, calcium: 30, iron: 2.5, vitaminA: 20, vitaminC: 5 },
    { id: 'im2', name: 'Dal Makhani', category: 'Indian Main', calories: 160, protein: 6, carbs: 15, fat: 9, fiber: 4, servingSize: '100', servingUnit: 'g', sodium: 350, potassium: 300, calcium: 40, iron: 3, vitaminA: 50, vitaminC: 2, saturatedFat: 5 },
    { id: 'im3', name: 'Paneer Butter Masala', category: 'Indian Main', calories: 240, protein: 9, carbs: 8, fat: 18, fiber: 1, servingSize: '100', servingUnit: 'g', sodium: 400, potassium: 150, calcium: 200, iron: 1, vitaminA: 120, vitaminC: 10, saturatedFat: 10 },
    { id: 'im4', name: 'Palak Paneer', category: 'Indian Main', calories: 180, protein: 10, carbs: 6, fat: 12, fiber: 2.5, servingSize: '100', servingUnit: 'g', sodium: 380, potassium: 350, calcium: 250, iron: 4, vitaminA: 300, vitaminC: 20, saturatedFat: 6 },
    { id: 'im5', name: 'Mix Veg Curry', category: 'Indian Main', calories: 110, protein: 3, carbs: 12, fat: 6, fiber: 4, servingSize: '100', servingUnit: 'g', sodium: 280, potassium: 250, calcium: 40, iron: 1.5, vitaminA: 150, vitaminC: 25 },
    { id: 'im6', name: 'Aloo Gobi', category: 'Indian Main', calories: 130, protein: 3, carbs: 16, fat: 7, fiber: 4, servingSize: '100', servingUnit: 'g', sodium: 300, potassium: 320, calcium: 30, iron: 1.5, vitaminA: 30, vitaminC: 30 },
    { id: 'im7', name: 'Butter Chicken', category: 'Indian Main', calories: 220, protein: 16, carbs: 6, fat: 14, fiber: 1, servingSize: '100', servingUnit: 'g', sodium: 450, potassium: 250, calcium: 30, iron: 1.5, vitaminA: 100, vitaminC: 5, saturatedFat: 7 },
    { id: 'im8', name: 'Chana Masala', category: 'Indian Main', calories: 140, protein: 6, carbs: 22, fat: 4, fiber: 7, servingSize: '100', servingUnit: 'g', sodium: 350, potassium: 350, calcium: 50, iron: 4, vitaminA: 20, vitaminC: 10 },
    { id: 'im9', name: 'Fish Fry (Tawa)', category: 'Indian Main', calories: 180, protein: 20, carbs: 4, fat: 10, fiber: 1, servingSize: '100', servingUnit: 'g', sodium: 250, potassium: 300, calcium: 20, iron: 1, vitaminA: 10, vitaminC: 2 },
    { id: 'im10', name: 'Mutton Biryani', category: 'Indian Main', calories: 450, protein: 20, carbs: 55, fat: 16, fiber: 3, servingSize: '1', servingUnit: 'plate', saturatedFat: 5, cholesterol: 80, sodium: 600, potassium: 300, iron: 3.5, calcium: 50, vitaminA: 40, vitaminC: 5 },
    { id: 'im11', name: 'Chicken Biryani', category: 'Indian Main', calories: 400, protein: 22, carbs: 50, fat: 12, fiber: 2, servingSize: '1', servingUnit: 'plate', saturatedFat: 3, cholesterol: 70, sodium: 550, potassium: 320, iron: 2, calcium: 40, vitaminA: 30, vitaminC: 5 },
    { id: 'im12', name: 'Veg Biryani', category: 'Indian Main', calories: 320, protein: 8, carbs: 55, fat: 8, fiber: 5, servingSize: '1', servingUnit: 'plate', saturatedFat: 2, cholesterol: 5, sodium: 450, potassium: 350, iron: 2.5, calcium: 60, vitaminA: 150, vitaminC: 25 },
    { id: 'im13', name: 'Egg Biryani', category: 'Indian Main', calories: 350, protein: 12, carbs: 50, fat: 10, fiber: 2, servingSize: '1', servingUnit: 'plate', saturatedFat: 3, cholesterol: 200, sodium: 500, potassium: 280, iron: 2.5, calcium: 55, vitaminA: 80, vitaminC: 5 },
    { id: 'im14', name: 'Prawns Biryani', category: 'Indian Main', calories: 420, protein: 24, carbs: 52, fat: 14, fiber: 2, servingSize: '1', servingUnit: 'plate', saturatedFat: 3, cholesterol: 150, sodium: 700, potassium: 300, iron: 3, calcium: 90, vitaminA: 40, vitaminC: 5 },
    { id: 'im15', name: 'Paneer Biryani', category: 'Indian Main', calories: 450, protein: 18, carbs: 54, fat: 18, fiber: 3, servingSize: '1', servingUnit: 'plate', saturatedFat: 8, cholesterol: 40, sodium: 550, potassium: 250, iron: 1.5, calcium: 300, vitaminA: 100, vitaminC: 10 },

    // --- GRAINS, RICE & ROTI ---
    { id: 'gr1', name: 'White Rice (Cooked)', category: 'Grains', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, servingSize: '100', servingUnit: 'g', sodium: 1, potassium: 35, calcium: 10, iron: 0.2, vitaminA: 0, vitaminC: 0 },
    { id: 'gr2', name: 'Basmati Rice (Cooked)', category: 'Grains', calories: 121, protein: 3.5, carbs: 25, fat: 0.4, fiber: 0.5, servingSize: '100', servingUnit: 'g', sodium: 1, potassium: 30, calcium: 8, iron: 0.4, vitaminA: 0, vitaminC: 0 },
    { id: 'gr3', name: 'Brown Rice (Cooked)', category: 'Grains', calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8, servingSize: '100', servingUnit: 'g', sodium: 1, potassium: 43, calcium: 10, iron: 0.4, vitaminA: 0, vitaminC: 0 },
    { id: 'gr4', name: 'Roti (Phulka, Whole Wheat)', category: 'Grains', calories: 85, protein: 3, carbs: 18, fat: 0.5, fiber: 3, servingSize: '1', servingUnit: 'piece', sodium: 5, potassium: 80, calcium: 15, iron: 1, vitaminA: 0, vitaminC: 0 },
    { id: 'gr5', name: 'Chapati (with Ghee)', category: 'Grains', calories: 110, protein: 3, carbs: 18, fat: 3, fiber: 3, servingSize: '1', servingUnit: 'piece', sodium: 5, potassium: 80, calcium: 15, iron: 1, vitaminA: 20, vitaminC: 0, saturatedFat: 1.5 },
    { id: 'gr6', name: 'Naan (Plain)', category: 'Grains', calories: 260, protein: 9, carbs: 45, fat: 5, fiber: 2, servingSize: '1', servingUnit: 'piece', sodium: 350, potassium: 120, calcium: 40, iron: 2, vitaminA: 0, vitaminC: 0 },
    { id: 'gr7', name: 'Garlic Naan', category: 'Grains', calories: 290, protein: 10, carbs: 48, fat: 7, fiber: 2, servingSize: '1', servingUnit: 'piece', sodium: 400, potassium: 130, calcium: 45, iron: 2.2, vitaminA: 0, vitaminC: 2 },

    // --- SNACKS, PUFFS & FAST FOOD ---
    { id: 'sf1', name: 'Samosa (Medium)', category: 'Snacks', calories: 260, protein: 5, carbs: 30, fat: 12, fiber: 2, servingSize: '1', servingUnit: 'piece', sodium: 400, potassium: 180, calcium: 30, iron: 2, vitaminA: 50, vitaminC: 4, saturatedFat: 4 },
    { id: 'sf2', name: 'Chicken Puff', category: 'Snacks', calories: 320, protein: 12, carbs: 28, fat: 18, fiber: 1, servingSize: '1', servingUnit: 'piece', sodium: 450, potassium: 200, calcium: 40, iron: 2, vitaminA: 60, vitaminC: 2, saturatedFat: 8 },
    { id: 'sf3', name: 'Egg Puff', category: 'Snacks', calories: 280, protein: 9, carbs: 26, fat: 15, fiber: 1, servingSize: '1', servingUnit: 'piece', sodium: 420, potassium: 160, calcium: 35, iron: 1.8, vitaminA: 70, vitaminC: 0, saturatedFat: 6 },
    { id: 'sf4', name: 'Veg Puff / Curry Puff', category: 'Snacks', calories: 250, protein: 4, carbs: 32, fat: 12, fiber: 2, servingSize: '1', servingUnit: 'piece', sodium: 380, potassium: 150, calcium: 30, iron: 1.5, vitaminA: 80, vitaminC: 5, saturatedFat: 5 },
    { id: 'sf5', name: 'Paneer Puff', category: 'Snacks', calories: 300, protein: 8, carbs: 28, fat: 18, fiber: 1, servingSize: '1', servingUnit: 'piece', sodium: 420, potassium: 180, calcium: 120, iron: 1.5, vitaminA: 100, vitaminC: 2, saturatedFat: 9 },
    { id: 'sf6', name: 'Kachori', category: 'Snacks', calories: 190, protein: 4, carbs: 18, fat: 11, fiber: 2, servingSize: '1', servingUnit: 'piece', sodium: 320, potassium: 120, calcium: 25, iron: 1.5, vitaminA: 0, vitaminC: 2, saturatedFat: 4 },
    { id: 'sf7', name: 'Spring Roll (Veg)', category: 'Snacks', calories: 120, protein: 2, carbs: 15, fat: 6, fiber: 1, servingSize: '1', servingUnit: 'piece', sodium: 250, potassium: 80, calcium: 20, iron: 1, vitaminA: 40, vitaminC: 5 },
    { id: 'sf8', name: 'Pizza (Margherita Slice)', category: 'Fast Food', calories: 250, protein: 10, carbs: 30, fat: 10, fiber: 2, servingSize: '1', servingUnit: 'slice', sodium: 550, potassium: 150, calcium: 150, iron: 2, vitaminA: 100, vitaminC: 5, saturatedFat: 4 },
    { id: 'sf9', name: 'Burger (Chicken)', category: 'Fast Food', calories: 450, protein: 25, carbs: 38, fat: 22, fiber: 3, servingSize: '1', servingUnit: 'piece', sodium: 850, potassium: 350, calcium: 80, iron: 3, vitaminA: 50, vitaminC: 5, saturatedFat: 8 },
    { id: 'sf10', name: 'French Fries (Large)', category: 'Fast Food', calories: 450, protein: 5, carbs: 60, fat: 22, fiber: 6, servingSize: '1', servingUnit: 'serving', sodium: 350, potassium: 800, calcium: 20, iron: 1.5, vitaminA: 0, vitaminC: 15, saturatedFat: 4 },
    { id: 'sf11', name: 'Chicken Nuggets (6 pieces)', category: 'Fast Food', calories: 280, protein: 15, carbs: 18, fat: 16, fiber: 1, servingSize: '1', servingUnit: 'serving', sodium: 500, potassium: 250, calcium: 15, iron: 1, vitaminA: 0, vitaminC: 0, saturatedFat: 3 },

    // --- BEVERAGES & DRINKS ---
    { id: 'bv1', name: 'Thums Up (Can)', category: 'Beverages', calories: 130, protein: 0, carbs: 33, fat: 0, fiber: 0, servingSize: '300', servingUnit: 'ml', sodium: 30, potassium: 5, calcium: 5, iron: 0, vitaminA: 0, vitaminC: 0 },
    { id: 'bv2', name: 'Coca Cola (Can)', category: 'Beverages', calories: 139, protein: 0, carbs: 35, fat: 0, fiber: 0, servingSize: '330', servingUnit: 'ml', sodium: 35, potassium: 5, calcium: 5, iron: 0, vitaminA: 0, vitaminC: 0 },
    { id: 'bv3', name: 'Pepsi (Can)', category: 'Beverages', calories: 140, protein: 0, carbs: 36, fat: 0, fiber: 0, servingSize: '330', servingUnit: 'ml', sodium: 35, potassium: 10, calcium: 5, iron: 0, vitaminA: 0, vitaminC: 0 },
    { id: 'bv4', name: 'Sprite (Can)', category: 'Beverages', calories: 120, protein: 0, carbs: 30, fat: 0, fiber: 0, servingSize: '330', servingUnit: 'ml', sodium: 30, potassium: 5, calcium: 5, iron: 0, vitaminA: 0, vitaminC: 0 },
    { id: 'bv5', name: 'Fanta (Can)', category: 'Beverages', calories: 150, protein: 0, carbs: 38, fat: 0, fiber: 0, servingSize: '330', servingUnit: 'ml', sodium: 30, potassium: 5, calcium: 5, iron: 0, vitaminA: 0, vitaminC: 0 },
    { id: 'bv6', name: 'Red Bull (Energy Drink)', category: 'Beverages', calories: 112, protein: 0.3, carbs: 27, fat: 0, fiber: 0, servingSize: '250', servingUnit: 'ml', sodium: 100, potassium: 10, calcium: 5, iron: 0.1, vitaminA: 0, vitaminC: 0 },
    { id: 'bv7', name: 'Monster Energy (Can)', category: 'Beverages', calories: 210, protein: 0, carbs: 54, fat: 0, fiber: 0, servingSize: '500', servingUnit: 'ml', sodium: 180, potassium: 20, calcium: 10, iron: 0.2, vitaminA: 0, vitaminC: 0 },
    { id: 'bv8', name: 'Maaza / Frooti (Mango Drink)', category: 'Beverages', calories: 150, protein: 0, carbs: 37, fat: 0, fiber: 0, servingSize: '250', servingUnit: 'ml', sodium: 20, potassium: 50, calcium: 5, iron: 0.1, vitaminA: 20, vitaminC: 5 },
    { id: 'bv9', name: 'Mountain Dew (Can)', category: 'Beverages', calories: 140, protein: 0, carbs: 37, fat: 0, fiber: 0, servingSize: '330', servingUnit: 'ml', sodium: 40, potassium: 5, calcium: 5, iron: 0, vitaminA: 0, vitaminC: 0 },
    { id: 'bv10', name: '7UP (Can)', category: 'Beverages', calories: 115, protein: 0, carbs: 29, fat: 0, fiber: 0, servingSize: '330', servingUnit: 'ml', sodium: 30, potassium: 5, calcium: 5, iron: 0, vitaminA: 0, vitaminC: 0 },
    { id: 'bv11', name: 'Sting Energy Drink', category: 'Beverages', calories: 70, protein: 0, carbs: 17, fat: 0, fiber: 0, servingSize: '250', servingUnit: 'ml', sodium: 50, potassium: 10, calcium: 5, iron: 0, vitaminA: 0, vitaminC: 0 },
    { id: 'bv12', name: 'Coconut Water', category: 'Beverages', calories: 46, protein: 1.7, carbs: 9, fat: 0.5, fiber: 2.6, servingSize: '250', servingUnit: 'ml', sodium: 250, potassium: 600, calcium: 60, iron: 0.7, vitaminA: 0, vitaminC: 5.8 },
    { id: 'bv13', name: 'Fresh Lime Soda (Sweet)', category: 'Beverages', calories: 90, protein: 0, carbs: 23, fat: 0, fiber: 0, servingSize: '250', servingUnit: 'ml', sodium: 200, potassium: 20, calcium: 10, iron: 0.1, vitaminA: 5, vitaminC: 20 },

    // --- DAIRY ---
    { id: 'd1', name: 'Milk (Cow, Whole)', category: 'Dairy', calories: 60, protein: 3.2, carbs: 4.8, fat: 3.2, fiber: 0, servingSize: '100', servingUnit: 'ml', calcium: 120, sodium: 50, potassium: 150, iron: 0.03, vitaminA: 46, vitaminC: 0, saturatedFat: 1.9 },
    { id: 'd2', name: 'Milk (Skimmed)', category: 'Dairy', calories: 35, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, servingSize: '100', servingUnit: 'ml', calcium: 125, sodium: 52, potassium: 156, iron: 0.03, vitaminA: 0, vitaminC: 0, saturatedFat: 0.05 },
    { id: 'd3', name: 'Curd/Yogurt (Whole Milk)', category: 'Dairy', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, servingSize: '100', servingUnit: 'g', calcium: 121, sodium: 46, potassium: 155, iron: 0.05, vitaminA: 27, vitaminC: 0.5, saturatedFat: 2.1 },
    { id: 'd4', name: 'Butter (Salted)', category: 'Dairy', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, servingSize: '100', servingUnit: 'g', calcium: 24, sodium: 640, potassium: 24, iron: 0.02, vitaminA: 684, vitaminC: 0, saturatedFat: 51 },
    { id: 'd5', name: 'Ghee', category: 'Dairy', calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0, servingSize: '100', servingUnit: 'g', calcium: 0, sodium: 0, potassium: 0, iron: 0, vitaminA: 900, vitaminC: 0, saturatedFat: 60 },

    // --- FRUITS ---
    { id: 'f1', name: 'Apple (with skin)', category: 'Fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, servingSize: '100', servingUnit: 'g', vitaminC: 4.6, potassium: 107, calcium: 6, iron: 0.12, sodium: 1, vitaminA: 3, saturatedFat: 0 },
    { id: 'f2', name: 'Banana', category: 'Fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, servingSize: '100', servingUnit: 'g', potassium: 358, vitaminC: 8.7, calcium: 5, iron: 0.26, sodium: 1, vitaminA: 3, saturatedFat: 0.1 },
    { id: 'f3', name: 'Mango (Ripe)', category: 'Fruits', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, servingSize: '100', servingUnit: 'g', vitaminA: 54, vitaminC: 36.4, potassium: 168, calcium: 11, iron: 0.16, sodium: 1, saturatedFat: 0 },
    { id: 'f4', name: 'Orange', category: 'Fruits', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, servingSize: '100', servingUnit: 'g', vitaminC: 53, potassium: 181, calcium: 40, iron: 0.1, sodium: 0, vitaminA: 11, saturatedFat: 0 },
    { id: 'f5', name: 'Amla (Indian Gooseberry)', category: 'Fruits', calories: 44, protein: 0.9, carbs: 10, fat: 0.6, fiber: 4.3, servingSize: '100', servingUnit: 'g', vitaminC: 600, potassium: 198, calcium: 25, iron: 1.2, sodium: 1, vitaminA: 15, saturatedFat: 0 },
    { id: 'f6', name: 'Guava', category: 'Fruits', calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, servingSize: '100', servingUnit: 'g', vitaminC: 228, potassium: 417, calcium: 18, iron: 0.26, sodium: 2, vitaminA: 31, saturatedFat: 0.3 },
    { id: 'f7', name: 'Papaya', category: 'Fruits', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, servingSize: '100', servingUnit: 'g', vitaminC: 62, potassium: 182, calcium: 20, iron: 0.25, sodium: 8, vitaminA: 47, saturatedFat: 0.1 },
    { id: 'f8', name: 'Watermelon', category: 'Fruits', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, servingSize: '100', servingUnit: 'g', vitaminC: 8.1, potassium: 112, calcium: 7, iron: 0.24, sodium: 1, vitaminA: 28, saturatedFat: 0 },
    { id: 'f9', name: 'Pomegranate', category: 'Fruits', calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4, servingSize: '100', servingUnit: 'g', vitaminC: 10.2, potassium: 236, calcium: 10, iron: 0.3, sodium: 3, vitaminA: 0, saturatedFat: 0.1 },
    { id: 'f10', name: 'Pineapple', category: 'Fruits', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, servingSize: '100', servingUnit: 'g', vitaminC: 47.8, potassium: 109, calcium: 13, iron: 0.29, sodium: 1, vitaminA: 3, saturatedFat: 0 },
    { id: 'f11', name: 'Grapes (Green)', category: 'Fruits', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, servingSize: '100', servingUnit: 'g', vitaminC: 3.2, potassium: 191, calcium: 10, iron: 0.36, sodium: 2, vitaminA: 3, saturatedFat: 0.1 },
    { id: 'f12', name: 'Muskmelon', category: 'Fruits', calories: 34, protein: 0.8, carbs: 8, fat: 0.2, fiber: 0.9, servingSize: '100', servingUnit: 'g', vitaminC: 36.7, potassium: 267, calcium: 9, iron: 0.21, sodium: 16, vitaminA: 169, saturatedFat: 0 },
    { id: 'f13', name: 'Mosambi (Sweet Lime)', category: 'Fruits', calories: 43, protein: 0.8, carbs: 9.3, fat: 0.3, fiber: 0.5, servingSize: '100', servingUnit: 'g', vitaminC: 50, potassium: 490, calcium: 40, iron: 0.7, sodium: 2, vitaminA: 10, saturatedFat: 0 },


    // --- VEGETABLES ---
    { id: 'v1', name: 'Broccoli (Raw)', category: 'Vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, servingSize: '100', servingUnit: 'g', vitaminC: 89, vitaminA: 31, potassium: 316, calcium: 47, iron: 0.73, sodium: 33, saturatedFat: 0 },
    { id: 'v2', name: 'Spinach (Raw)', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, servingSize: '100', servingUnit: 'g', iron: 2.7, vitaminA: 469, vitaminC: 28, potassium: 558, calcium: 99, sodium: 79, saturatedFat: 0 },
    { id: 'v3', name: 'Potato (Boiled)', category: 'Vegetables', calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2, servingSize: '100', servingUnit: 'g', potassium: 421, vitaminC: 19, calcium: 12, iron: 0.8, sodium: 6, vitaminA: 0, saturatedFat: 0 },
    { id: 'v4', name: 'Tomato (Red)', category: 'Vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, servingSize: '100', servingUnit: 'g', vitaminC: 13.7, vitaminA: 42, potassium: 237, calcium: 10, iron: 0.27, sodium: 5, saturatedFat: 0 },
    { id: 'v5', name: 'Onion (Raw)', category: 'Vegetables', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, servingSize: '100', servingUnit: 'g', vitaminC: 7.4, vitaminA: 2, potassium: 146, calcium: 23, iron: 0.21, sodium: 4, saturatedFat: 0 },
    { id: 'v6', name: 'Cucumber (Peeled)', category: 'Vegetables', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, servingSize: '100', servingUnit: 'g', vitaminC: 2.8, vitaminA: 5, potassium: 147, calcium: 16, iron: 0.28, sodium: 2, saturatedFat: 0 },
    { id: 'v7', name: 'Carrot (Raw)', category: 'Vegetables', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, servingSize: '100', servingUnit: 'g', vitaminC: 5.9, vitaminA: 835, potassium: 320, calcium: 33, iron: 0.3, sodium: 69, saturatedFat: 0 },
    { id: 'v8', name: 'Cauliflower', category: 'Vegetables', calories: 25, protein: 2, carbs: 5, fat: 0.3, fiber: 2, servingSize: '100', servingUnit: 'g', vitaminC: 48, vitaminA: 0, potassium: 299, calcium: 22, iron: 0.42, sodium: 30, saturatedFat: 0 },
    { id: 'v9', name: 'Cabbage', category: 'Vegetables', calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5, servingSize: '100', servingUnit: 'g', vitaminC: 36.6, vitaminA: 5, potassium: 170, calcium: 40, iron: 0.47, sodium: 18, saturatedFat: 0 },
    { id: 'v10', name: 'Bhindi (Okra)', category: 'Vegetables', calories: 33, protein: 1.9, carbs: 7, fat: 0.2, fiber: 3.2, servingSize: '100', servingUnit: 'g', vitaminC: 23, vitaminA: 36, potassium: 299, calcium: 82, iron: 0.62, sodium: 7, saturatedFat: 0 },
    { id: 'v11', name: 'Brinjal (Eggplant)', category: 'Vegetables', calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, servingSize: '100', servingUnit: 'g', vitaminC: 2.2, vitaminA: 1, potassium: 229, calcium: 9, iron: 0.23, sodium: 2, saturatedFat: 0 },
    { id: 'v12', name: 'Bottle Gourd (Lauki)', category: 'Vegetables', calories: 15, protein: 0.6, carbs: 4, fat: 0.1, fiber: 1, servingSize: '100', servingUnit: 'g', vitaminC: 10.1, vitaminA: 0, potassium: 150, calcium: 26, iron: 0.2, sodium: 2, saturatedFat: 0 },
    { id: 'v13', name: 'Bitter Gourd (Karela)', category: 'Vegetables', calories: 17, protein: 1, carbs: 4, fat: 0.2, fiber: 2.8, servingSize: '100', servingUnit: 'g', vitaminC: 84, vitaminA: 471, potassium: 296, calcium: 19, iron: 0.43, sodium: 5, saturatedFat: 0 },
    { id: 'v14', name: 'Green Peas (Matar)', category: 'Vegetables', calories: 81, protein: 5, carbs: 14, fat: 0.4, fiber: 5, servingSize: '100', servingUnit: 'g', vitaminC: 40, vitaminA: 38, potassium: 244, calcium: 25, iron: 1.5, sodium: 5, saturatedFat: 0.1 },
    { id: 'v15', name: 'French Beans', category: 'Vegetables', calories: 31, protein: 1.8, carbs: 7, fat: 0.2, fiber: 2.7, servingSize: '100', servingUnit: 'g', vitaminC: 12.2, vitaminA: 35, potassium: 211, calcium: 37, iron: 1, sodium: 6, saturatedFat: 0 },


    // --- SPICES & INGREDIENTS ---
    { id: 'sp1', name: 'Turmeric Powder', category: 'Spices', calories: 312, protein: 7.8, carbs: 65, fat: 3.2, fiber: 21, servingSize: '100', servingUnit: 'g', iron: 41, potassium: 2525, calcium: 183, sodium: 38, vitaminC: 25, vitaminA: 0, saturatedFat: 3.1 },
    { id: 'sp2', name: 'Red Chili Powder', category: 'Spices', calories: 282, protein: 13, carbs: 50, fat: 14, fiber: 35, servingSize: '100', servingUnit: 'g', vitaminA: 260, vitaminC: 14, potassium: 1950, calcium: 330, iron: 15, sodium: 30, saturatedFat: 2.5 },
    { id: 'sp3', name: 'Maggi Masala', category: 'Spices', calories: 200, protein: 5, carbs: 35, fat: 5, fiber: 2, servingSize: '100', servingUnit: 'g', sodium: 8000, potassium: 400, calcium: 150, iron: 5, vitaminA: 100, vitaminC: 10, saturatedFat: 2 },
    { id: 'sp4', name: 'Ginger Garlic Paste', category: 'Spices', calories: 120, protein: 3, carbs: 20, fat: 1, fiber: 2, servingSize: '100', servingUnit: 'g', sodium: 300, potassium: 400, calcium: 50, iron: 2, vitaminA: 10, vitaminC: 5, saturatedFat: 0 },
    { id: 'sp5', name: 'Sugar', category: 'Ingredients', calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, servingSize: '100', servingUnit: 'g', sodium: 0, potassium: 0, calcium: 0, iron: 0, vitaminA: 0, vitaminC: 0, saturatedFat: 0 },
    { id: 'sp6', name: 'Salt', category: 'Ingredients', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, servingSize: '100', servingUnit: 'g', sodium: 38758, potassium: 8, calcium: 24, iron: 0.3, vitaminA: 0, vitaminC: 0, saturatedFat: 0 },
    { id: 'sp7', name: 'Jaggery (Gur)', category: 'Ingredients', calories: 383, protein: 0.4, carbs: 98, fat: 0.1, fiber: 0, servingSize: '100', servingUnit: 'g', sodium: 30, potassium: 1050, calcium: 80, iron: 11, vitaminA: 0, vitaminC: 0, saturatedFat: 0 },
    { id: 'ns1', name: 'Almonds', category: 'Snacks', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, servingSize: '100', servingUnit: 'g', sodium: 1, potassium: 733, calcium: 269, iron: 3.7, vitaminA: 0, vitaminC: 0, saturatedFat: 3.8 },
    { id: 'ns2', name: 'Walnuts', category: 'Snacks', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, servingSize: '100', servingUnit: 'g', sodium: 2, potassium: 441, calcium: 98, iron: 2.9, vitaminA: 1, vitaminC: 1.3, saturatedFat: 6 },
    { id: 'ns3', name: 'Cashews', category: 'Snacks', calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, servingSize: '100', servingUnit: 'g', sodium: 12, potassium: 660, calcium: 37, iron: 6.7, vitaminA: 0, vitaminC: 0.5, saturatedFat: 7.8 },
    { id: 'ns4', name: 'Peanuts (Roasted)', category: 'Snacks', calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, servingSize: '100', servingUnit: 'g', sodium: 6, potassium: 705, calcium: 92, iron: 4.6, vitaminA: 0, vitaminC: 0, saturatedFat: 6.3 },
    { id: 'ns5', name: 'Chia Seeds', category: 'Grains', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, servingSize: '100', servingUnit: 'g', sodium: 16, potassium: 407, calcium: 631, iron: 7.7, vitaminA: 54, vitaminC: 1.6, saturatedFat: 3.3 },

];

export const categories = [
    'All',
    'Grains',
    'Protein',
    'Indian Breakfast',
    'Indian Main',
    'Dairy',
    'Fruits',
    'Vegetables',
    'Snacks',
    'Fast Food',
    'Beverages',
    'Spices',
    'Ingredients'
];
