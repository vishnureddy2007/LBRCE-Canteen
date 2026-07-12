-- =====================================================================
-- LBRCE Canteen Management System
-- Seed Data
--
-- Default admin credentials:
--   username: vishnureddy@gmail.com
--   password: Bunny@07
--
-- The password_hash below is a BCrypt hash of "Bunny@07" generated with
-- strength 10. If you need to regenerate it, you can use the Java helper
-- BCrypt.hashpw("Bunny@07", BCrypt.gensalt(10)) from the backend.
-- =====================================================================

USE lbrce_canteen;

-- ---------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------
-- BCrypt hash of "Bunny@07"
INSERT INTO admins (username, email, password_hash, full_name, phone)
VALUES (
    'vishnureddy@gmail.com',
    'vishnureddy@gmail.com',
    '$2a$10$4w5sg2P8wwxWEs869Kh2RuEnoneTW4bGsMiGmOKjibP8X0fjUIJH.',
    'LBRCE Canteen Admin',
    '+91-9876543210'
)
ON DUPLICATE KEY UPDATE username = username;

-- ---------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------
INSERT INTO categories (name, display_order, active) VALUES
    ('Breakfast', 1, TRUE),
    ('Lunch',     2, TRUE),
    ('Snacks',    3, TRUE),
    ('Beverages', 4, TRUE),
    ('Fast Foods', 5, TRUE);

-- ---------------------------------------------------------------------
-- Food items
-- ---------------------------------------------------------------------
-- Note: image_url points to a placeholder served by the backend under
-- /uploads/. Real images are uploaded by admin via the UI.
INSERT INTO food_items (name, description, price, category_id, available, rating_avg, rating_count)
VALUES
    ('Idli with Sambar',           'Soft steamed idlis served with hot sambar and coconut chutney.', 30.00, 1, TRUE, 4.50, 12),
    ('Poori with Curry',           'Crispy pooris served with potato curry and pickle.',             40.00, 1, TRUE, 4.20, 9),
    ('Upma',                       'Semolina cooked with mustard, curry leaves and vegetables.',     25.00, 1, TRUE, 4.00, 6),
    ('Veg Biryani',                'Fragrant basmati rice cooked with mixed vegetables and spices.',100.00, 2, TRUE, 4.60, 20),
    ('Chicken Biryani',            'Long-grain rice layered with marinated chicken and spices.',    120.00, 2, TRUE, 4.80, 35),
    ('Veg Fried Rice',             'Indo-Chinese style fried rice with crisp vegetables.',          90.00, 5, TRUE, 4.30, 14),
    ('Meals (Thali)',              'Full South Indian thali - rice, dal, sambar, rasam, curries.', 110.00, 2, TRUE, 4.70, 28),
    ('Samosa',                     'Crispy pastry filled with spiced potatoes and peas.',            15.00, 3, TRUE, 4.40, 22),
    ('Egg Puff',                   'Flaky puff pastry stuffed with spiced hard-boiled egg.',         25.00, 3, TRUE, 4.40, 15),
    ('Veg Noodles',                'Stir-fried noodles tossed with crisp vegetables and Indo-Chinese sauces.', 80.00, 5, TRUE, 4.50, 14),
    ('Chicken Manchuria',          'Crispy deep-fried chicken balls tossed in a sweet, savory, and spicy Manchurian sauce.', 100.00, 5, TRUE, 4.60, 18),
    ('Chicken Fried Rice',         'Stir-fried basmati rice cooked with chicken pieces, egg, vegetables, and Chinese spices.', 110.00, 5, TRUE, 4.70, 25),
    ('Chicken Noodles',            'Stir-fried noodles tossed with chicken shreds, vegetables, and savory sauces.', 100.00, 5, TRUE, 4.50, 16),
    ('Veg Manchuria',              'Crispy mixed vegetable balls cooked in a tangy and flavorful Manchurian gravy.', 80.00, 5, TRUE, 4.40, 15),
    ('Filter Coffee',              'Traditional South Indian filter coffee in a steel davara.',    20.00, 4, TRUE, 4.90, 40),
    ('Masala Chai',                'Hot spiced tea with milk - perfect refresher.',                  15.00, 4, TRUE, 4.60, 25),
    ('Fresh Lime Soda',            'Refreshing lime soda - sweet, salty or mixed.',                 25.00, 4, TRUE, 4.40, 16),
    ('Mango Lassi',                'Thick yogurt drink blended with ripe mango pulp.',              40.00, 4, TRUE, 4.70, 19);

-- Add a single unique image for each food item
INSERT INTO food_images (food_item_id, image_url, is_primary) VALUES
    ((SELECT id FROM food_items WHERE name = 'Idli with Sambar' LIMIT 1), 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Poori with Curry' LIMIT 1), 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Upma' LIMIT 1), 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Veg Biryani' LIMIT 1), 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Chicken Biryani' LIMIT 1), 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Veg Fried Rice' LIMIT 1), 'https://images.unsplash.com/photo-1603133872878-685f586b6d1d?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Meals (Thali)' LIMIT 1), 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Samosa' LIMIT 1), 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Egg Puff' LIMIT 1), 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Veg Noodles' LIMIT 1), 'https://images.unsplash.com/photo-1612966608963-47da3147d41a?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Chicken Manchuria' LIMIT 1), 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Chicken Fried Rice' LIMIT 1), 'https://images.unsplash.com/photo-1603133872878-685f586b6d1d?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Chicken Noodles' LIMIT 1), 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Veg Manchuria' LIMIT 1), 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Filter Coffee' LIMIT 1), 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Masala Chai' LIMIT 1), 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Fresh Lime Soda' LIMIT 1), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', TRUE),
    ((SELECT id FROM food_items WHERE name = 'Mango Lassi' LIMIT 1), 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80', TRUE);

-- ---------------------------------------------------------------------
-- Offers & announcements (sample)
-- ---------------------------------------------------------------------
INSERT INTO offers (title, description, discount_percent, active, valid_from, valid_to) VALUES
    ('Monsoon Special',       '10% off on all hot beverages every evening.', 10.00, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
    ('Combo Meal',            'Get a samosa + chai for just Rs.25.',        15.00, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY));

INSERT INTO announcements (title, body, active, starts_at, ends_at, created_by) VALUES
    ('Welcome to LBRCE Canteen!', 'Browse the menu, place orders online and skip the queue. Cash on pickup or simulated UPI supported.', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 1),
    ('New Lunch Menu',           'Try our new Veg Biryani and Chicken Biryani - freshly prepared every day.', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 1);