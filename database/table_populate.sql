INSERT INTO employees (id,name,salary,shift_start,shift_end,manager,username,password,email)
VALUES
(1, 'Chee Surger', 31.5, '9:30:00', '23:30:00', true, 'burger_man', '0', 'chee@domain.com'),
(2, 'Chic Ken', 14.5, '10:00:00', '23:30:00', false, 'chickman', 'password', 'chic@domain.com'),
(3, 'Tenz Ders', 11.5, '10:00:00', '23:30:00', false, 'user1', 'pw1', 'tenz@domain.com'),
(4, 'Man Ger', 10.0, '10:00:00', '23:30:00', false, 'zero', 'zero', 'man@domain.com'),
(5, 'Han Surger', 12.0, '10:00:00', '23:30:00', false, 'ilovekids', 'password', 'han@domain.com'),
(6, 'John Mo', 31.5, '10:00:00', '23:30:00', true, 'username', 'pwd', 'johnmo@tamu.edu'),
(7, 'Ethan Van', 15.0, '10:00:00', '23:30:00', false, 'etUser', 'etPwd', 'etvan13@tamu.edu');

\copy inventory_items FROM 'inventory_items.csv' CSV HEADER;
\copy menu_items FROM 'menu_items.csv' CSV HEADER;
\copy ingredients FROM 'ingredients.csv' CSV HEADER;
\copy inventory_transactions FROM 'inventory_transactions.csv' CSV HEADER;
\copy inventory_item_orders FROM 'inventory_item_orders.csv' CSV HEADER;
\copy sales_transactions FROM 'sales_transactions.csv' CSV HEADER;
\copy sales_items FROM 'sales_items.csv' CSV HEADER;
\copy irremovable_ingredients FROM 'irremovable_ingredients.csv' CSV HEADER;

SELECT setval('sales_transactions_id_seq', (SELECT MAX(id) FROM sales_transactions));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));