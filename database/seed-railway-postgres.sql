-- =====================================================
-- Khadamati PostgreSQL Seed Data
-- Admin User + Service Categories
-- =====================================================

-- =====================================================
-- 1. ADMIN USER
-- =====================================================
-- Password: admin123 (hashed with bcrypt)
INSERT INTO "user" (email, password, first_name, middle_name, last_name, phone, role, created_at)
VALUES (
    'admin@khadamati.com',
    '$2b$10$5nhBslLkuhGWFLtW.Znv2.ob0DAkB3kHMkzBto/JxyeLs4LeoOuTq',
    'Admin',
    NULL,
    'User',
    '70000000',
    'admin',
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Get the user_id for admin (will be 1 if this is first insert)
INSERT INTO admin (user_id)
SELECT user_id FROM "user" WHERE email = 'admin@khadamati.com' LIMIT 1
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. SERVICE CATEGORIES (6 Categories - Bilingual)
-- =====================================================

INSERT INTO category (name_ar, name_en, description_ar, description_en, icon, created_at)
VALUES
-- 1. Plumbing
(
    'سباكة',
    'Plumbing',
    'خدمات السباكة',
    'Plumbing services',
    '🔧',
    CURRENT_TIMESTAMP
),

-- 2. Electrical
(
    'كهرباء',
    'Electrical',
    'خدمات الكهرباء',
    'Electrical services',
    '⚡',
    CURRENT_TIMESTAMP
),

-- 3. Cleaning
(
    'تنظيف',
    'Cleaning',
    'خدمات التنظيف',
    'Cleaning services',
    '🧹',
    CURRENT_TIMESTAMP
),

-- 4. Painting
(
    'دهان',
    'Painting',
    'خدمات الدهان',
    'Painting services',
    '🎨',
    CURRENT_TIMESTAMP
),

-- 5. AC Repair
(
    'تصليح مكيفات',
    'AC Repair',
    'خدمات تصليح المكيفات',
    'AC Repair services',
    '❄️',
    CURRENT_TIMESTAMP
),

-- 6. Carpentry
(
    'نجارة',
    'Carpentry',
    'خدمات النجارة',
    'Carpentry services',
    '🪵',
    CURRENT_TIMESTAMP
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the data was inserted:

-- Check admin user
-- SELECT * FROM "user" WHERE email = 'admin@khadamati.com';

-- Check categories
-- SELECT category_id, name_en, name_ar FROM category ORDER BY category_id;

-- Count total records
-- SELECT 
--     (SELECT COUNT(*) FROM "user" WHERE role = 'admin') as admin_count,
--     (SELECT COUNT(*) FROM category) as category_count;
