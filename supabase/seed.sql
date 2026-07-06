-- Seed Data for Meal Database

-- Proteins
INSERT INTO public.meal_proteins (name, p_per_oz, f_per_oz, yield_key, active) VALUES
('Chicken breast', 8.75, 0.5, 'cb', true),
('Chicken thigh', 7.0, 1.8, 'ct', true),
('Steak strips', 7.5, 2.2, 'steak', true),
('Tri-tip', 7.5, 2.0, 'steak', true);

-- Flavors
INSERT INTO public.meal_flavors (name, active) VALUES
('Teriyaki', true), ('Chipotle', true), ('Lemon herb', true), 
('Garlic butter', true), ('Buffalo', true), ('Sweet chili', true), 
('Sesame ginger', true), ('Chimichurri', true), ('Buttery steakhouse', true), 
('Honey garlic', true), ('Smoky BBQ', true), ('Mediterranean', true), 
('Maple blaze', true);

-- Veg Mixes
INSERT INTO public.meal_veg_mixes (name) VALUES
('Broccoli'), ('Zucchini'), ('Green beans'), ('Asparagus'), 
('Mixed veg'), ('Roasted peppers'), ('Cauliflower'), 
('Brussels sprouts'), ('Snap peas + carrots'), ('Spinach + mushroom');

-- Dinners (base macros at 6oz protein)
INSERT INTO public.meal_dinners (name, base_p, base_c, base_f, protein_type, carb_side, veg) VALUES
('Teriyaki chicken + rice', 38, 55, 6, 'cb', 'jasmine_rice', 'broccoli'),
('Steak n'' mash', 40, 40, 16, 'steak', 'mashed_potato', 'green_beans'),
('Chile margarita chicken + rice', 38, 52, 7, 'cb', 'jasmine_rice', 'none'),
('Sweet chili chicken thigh + rice', 36, 56, 9, 'ct', 'jasmine_rice', 'none'),
('Maple blaze tri-tip + mashed potato', 40, 38, 14, 'steak', 'mashed_potato', 'none'),
('Smoky sweet chicken thigh + rice', 36, 54, 9, 'ct', 'jasmine_rice', 'none'),
('Sesame ginger chicken + rice', 38, 54, 7, 'cb', 'jasmine_rice', 'none'),
('Buffalo chicken + rice', 38, 52, 8, 'cb', 'jasmine_rice', 'broccoli'),
('Chipotle burrito bowl', 38, 58, 10, 'cb', 'jasmine_rice', 'mixed_veg'),
('Mediterranean chicken + rice', 38, 50, 9, 'cb', 'jasmine_rice', 'none'),
('Chicken alfredo + pasta', 36, 60, 14, 'cb', 'penne', 'none'),
('Spaghetti and meatballs', 36, 62, 15, 'meatball', 'spaghetti', 'none');

-- Breakfasts
INSERT INTO public.meal_breakfast (name, p, c, f) VALUES
('Scrambled eggs + turkey sausage + rice', 38, 42, 14),
('Greek yogurt parfait + granola + berries', 28, 38, 8),
('Egg white oats + banana', 30, 52, 4),
('Cottage cheese bowl + fruit + honey', 32, 30, 5),
('Rise and grind bowl', 34, 44, 10),
('Yogurt parfait', 22, 36, 6);

-- Snacks
INSERT INTO public.meal_snacks (name, p, c, f) VALUES
('Protein shake (whey + water)', 25, 4, 2),
('Greek yogurt + almonds', 18, 12, 10),
('Cottage cheese + cucumber', 20, 6, 2),
('Hard boiled eggs (2) + string cheese', 20, 2, 12),
('Protein bar (Quest/RX)', 20, 22, 8),
('Turkey roll-ups + mustard', 20, 2, 4),
('Beef jerky + apple slices', 18, 20, 3);
