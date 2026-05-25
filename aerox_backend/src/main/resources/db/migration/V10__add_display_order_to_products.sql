ALTER TABLE products
ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_display_order
ON products(display_order);

-- Preserve current admin order: latest product first
WITH ordered_products AS (
    SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY id DESC) AS new_display_order
    FROM products
)
UPDATE products p
SET display_order = ordered_products.new_display_order
FROM ordered_products
WHERE p.id = ordered_products.id;