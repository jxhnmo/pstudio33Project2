INSERT INTO employees (id,name,salary,shift_start,shift_end,manager,username,password)
VALUES
(1, 'Chee Surger', 31.5, '9:30:00', '23:30:00', true, 'burger_man', '0'),
(2, 'Chic Ken', 14.5, '10:00:00', '23:30:00', false, 'chickman', 'password'),
(3, 'Tenz Ders', 11.5, '10:00:00', '23:30:00', false, 'user1', 'pw1'),
(4, 'Man Ger', 10.0, '10:00:00', '23:30:00', false, 'zero', 'zero'),
(5, 'Han Surger', 12.0, '10:00:00', '23:30:00', false, 'ilovekids', 'password');

\copy inventory_items FROM 'inventory_items.csv' CSV HEADER;
\copy menu_items FROM 'menu_items.csv' CSV HEADER;
\copy ingredients FROM 'ingredients.csv' CSV HEADER;
\copy inventory_transactions FROM 'inventory_transactions.csv' CSV HEADER;
\copy inventory_item_orders FROM 'inventory_item_orders.csv' CSV HEADER;
\copy sales_transactions FROM 'sales_transactions.csv' CSV HEADER;
\copy sales_items FROM 'sales_items.csv' CSV HEADER;
\copy irremovable_ingredients FROM 'irremovable_ingredients.csv' CSV HEADER;
