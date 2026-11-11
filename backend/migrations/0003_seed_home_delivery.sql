INSERT INTO pickup_locations (slug, name_en, name_hi, name_mr, address, locality, postal_code)
VALUES ('home-delivery', 'Home Delivery', 'होम डिलीवरी', 'होम डिलिव्हरी', '', 'Pune', NULL)
ON CONFLICT (slug) DO NOTHING;
