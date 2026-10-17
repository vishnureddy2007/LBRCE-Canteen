-- Safe, reversible image URL migration for TiDB Cloud
-- Updates food_images table so that each food item references its matching dish photography.
-- Does NOT drop tables, does NOT delete food items, categories, or orders.

UPDATE food_images SET image_url = '/uploads/idli_sambar.png' WHERE food_item_id = 1;
UPDATE food_images SET image_url = '/uploads/poori_curry.png' WHERE food_item_id = 2;
UPDATE food_images SET image_url = '/uploads/upma.png' WHERE food_item_id = 3;
UPDATE food_images SET image_url = '/uploads/veg_biryani.png' WHERE food_item_id = 4;
UPDATE food_images SET image_url = '/uploads/chicken_biryani.png' WHERE food_item_id = 5;
UPDATE food_images SET image_url = '/uploads/veg_fried_rice.png' WHERE food_item_id = 6;
UPDATE food_images SET image_url = '/uploads/meals_thali.png' WHERE food_item_id = 7;
UPDATE food_images SET image_url = '/uploads/samosa.png' WHERE food_item_id = 8;
UPDATE food_images SET image_url = '/uploads/filter_coffee.png' WHERE food_item_id = 11;
UPDATE food_images SET image_url = '/uploads/masala_chai.png' WHERE food_item_id = 12;
UPDATE food_images SET image_url = '/uploads/fresh_lime_soda.png' WHERE food_item_id = 13;
UPDATE food_images SET image_url = '/uploads/mango_lassi.png' WHERE food_item_id = 14;
UPDATE food_images SET image_url = '/uploads/egg_puff.png' WHERE food_item_id = 15;
UPDATE food_images SET image_url = '/uploads/veg_noodles.png' WHERE food_item_id = 16;
UPDATE food_images SET image_url = '/uploads/chicken_manchuria.png' WHERE food_item_id = 17;
UPDATE food_images SET image_url = '/uploads/chicken_fried_rice.png' WHERE food_item_id = 18;
UPDATE food_images SET image_url = '/uploads/chicken_noodles.png' WHERE food_item_id = 19;
UPDATE food_images SET image_url = '/uploads/veg_manchuria.png' WHERE food_item_id = 20;
