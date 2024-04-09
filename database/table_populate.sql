INSERT INTO employees (id,name,salary,shift_start,shift_end,manager)
VALUES
(1, 'Chee Surger', 31.5, '9:30:00', '23:30:00', true),
(2, 'Chic Ken', 14.5, '10:00:00', '23:30:00', false),
(3, 'Tenz Ders', 11.5, '10:00:00', '23:30:00', false),
(4, 'Man Ger', 10.0, '10:00:00', '23:30:00', false),
(5, 'Han Surger', 12.0, '10:00:00', '23:30:00', false);

\copy inventory_items FROM 'inventory_items.csv' CSV HEADER;
ALTER TABLE inventory_items ADD COLUMN max_stock INT;
UPDATE inventory_items SET max_stock = ROUND(stock/50.0)*50;
\copy menu_items FROM 'menu_items.csv' CSV HEADER;
\copy ingredients FROM 'ingredients.csv' CSV HEADER;
\copy inventory_transactions FROM 'inventory_transactions.csv' CSV HEADER;
\copy inventory_item_orders FROM 'inventory_item_orders.csv' CSV HEADER;
\copy sales_transactions FROM 'sales_transactions.csv' CSV HEADER;
\copy sales_items FROM 'sales_items.csv' CSV HEADER;