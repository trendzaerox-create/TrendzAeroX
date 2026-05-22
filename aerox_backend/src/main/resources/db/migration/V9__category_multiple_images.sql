-- V2__category_multiple_images.sql

-- 1. Create table for normal category images
CREATE TABLE IF NOT EXISTS category_images (
    category_id BIGINT NOT NULL,
    sort_order INTEGER NOT NULL,
    image_url VARCHAR(500),

    CONSTRAINT fk_category_images_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

-- 2. Create table for category banner images
CREATE TABLE IF NOT EXISTS category_banner_images (
    category_id BIGINT NOT NULL,
    sort_order INTEGER NOT NULL,
    image_url VARCHAR(500),

    CONSTRAINT fk_category_banner_images_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

-- 3. Create table for category thin banner images
CREATE TABLE IF NOT EXISTS category_thin_banner_images (
    category_id BIGINT NOT NULL,
    sort_order INTEGER NOT NULL,
    image_url VARCHAR(500),

    CONSTRAINT fk_category_thin_banner_images_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

-- 4. Move existing single image_url data into new multiple-image table
INSERT INTO category_images (category_id, sort_order, image_url)
SELECT id, 0, image_url
FROM categories
WHERE image_url IS NOT NULL AND image_url <> '';

-- 5. Move existing single banner_image_url data into new multiple-banner table
INSERT INTO category_banner_images (category_id, sort_order, image_url)
SELECT id, 0, banner_image_url
FROM categories
WHERE banner_image_url IS NOT NULL AND banner_image_url <> '';

-- 6. Move existing single thin_banner_image_url data into new multiple-thin-banner table
INSERT INTO category_thin_banner_images (category_id, sort_order, image_url)
SELECT id, 0, thin_banner_image_url
FROM categories
WHERE thin_banner_image_url IS NOT NULL AND thin_banner_image_url <> '';

-- 7. Add indexes for faster category image lookup
CREATE INDEX IF NOT EXISTS idx_category_images_category_id
ON category_images(category_id);

CREATE INDEX IF NOT EXISTS idx_category_banner_images_category_id
ON category_banner_images(category_id);

CREATE INDEX IF NOT EXISTS idx_category_thin_banner_images_category_id
ON category_thin_banner_images(category_id);