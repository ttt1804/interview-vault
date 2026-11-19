-- Phép thử một phiên cho MySQL. Chạy qua run.sh với mysql --force.
SET NAMES utf8mb4;
SET SESSION cte_max_recursion_depth = 100000;
SELECT '### moi-truong' AS ''; SELECT VERSION(), @@sql_mode, @@transaction_isolation;

CREATE TABLE a (x INT); CREATE TABLE b (x INT);
INSERT INTO a VALUES (1), (2); INSERT INTO b VALUES (2), (3);
SELECT '### 01-intersect-except' AS '';
SELECT x FROM a INTERSECT SELECT x FROM b;
SELECT x FROM a EXCEPT SELECT x FROM b;

SELECT '### 01-filter' AS '';
SELECT COUNT(*) FILTER (WHERE x > 1) FROM a;

SELECT '### 01-values-upsert' AS '';
CREATE TABLE products (sku VARCHAR(20) PRIMARY KEY, name VARCHAR(20), price INT);
INSERT INTO products VALUES ('S', 'A', 1) ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price);
SHOW WARNINGS;
INSERT INTO products VALUES ('S', 'B', 2) AS new ON DUPLICATE KEY UPDATE name = new.name, price = new.price;
SELECT * FROM products;

SELECT '### 01-ep-kieu' AS '';
CREATE TABLE users (id BIGINT PRIMARY KEY, code VARCHAR(20), phone VARCHAR(20), KEY idx_phone (phone));
INSERT INTO users VALUES (5, 'abc', '0901'), (6, 'xyz', '0902'), (7, '12', '0903');
SELECT id FROM users WHERE id = '5abc'; SHOW WARNINGS;
SELECT COUNT(*) AS khop_code_bang_0 FROM users WHERE code = 0;
EXPLAIN SELECT * FROM users WHERE phone = 901;
EXPLAIN SELECT * FROM users WHERE phone = '0901';
CREATE TABLE ord (id BIGINT PRIMARY KEY, customer_id VARCHAR(20), KEY idx_c (customer_id));
INSERT INTO ord VALUES (1, '5'), (2, '6');
EXPLAIN SELECT * FROM ord o JOIN users u ON o.customer_id = u.id;

SELECT '### 01-only-full-group-by' AS '';
SET @old = @@sql_mode;
SET SESSION sql_mode = 'ONLY_FULL_GROUP_BY';
SELECT @@sql_mode AS sau_khi_set;
SET SESSION sql_mode = @old;

SELECT '### 02-index-bieu-thuc' AS '';
CREATE TABLE d (id INT PRIMARY KEY, doc JSON, created_at DATETIME);
CREATE INDEX i_json ON d ((JSON_EXTRACT(doc, '$.k')));
CREATE INDEX i_json2 ON d ((CAST(doc->>'$.k' AS CHAR(64)) COLLATE utf8mb4_bin));
CREATE INDEX i_year_sai ON d (YEAR(created_at));
CREATE INDEX i_year ON d ((YEAR(created_at)));
SHOW INDEX FROM d;

SELECT '### 02-skip-scan-va-or' AS '';
CREATE TABLE s (id INT PRIMARY KEY AUTO_INCREMENT, st INT NOT NULL, v INT NOT NULL, email VARCHAR(30), phone VARCHAR(30),
  KEY i_st_v (st, v), KEY i_email (email), KEY i_phone (phone));
INSERT INTO s (st, v, email, phone)
WITH RECURSIVE n AS (SELECT 1 i UNION ALL SELECT i + 1 FROM n WHERE i < 20000)
SELECT i % 3, i, CONCAT('e', i), CONCAT('p', i) FROM n;
ANALYZE TABLE s;
EXPLAIN SELECT st, v FROM s WHERE v = 500;
EXPLAIN SELECT * FROM s WHERE email = 'e5' OR phone = 'p6';
EXPLAIN FORMAT=TREE SELECT COUNT(*) FROM a JOIN b ON a.x < b.x;

SELECT '### 04-enum-instant' AS '';
CREATE TABLE e (id INT PRIMARY KEY, st ENUM('A', 'B'));
ALTER TABLE e MODIFY st ENUM('A', 'B', 'C'), ALGORITHM = INSTANT;
SHOW CREATE TABLE e;
ALTER TABLE e MODIFY st ENUM('C', 'A', 'B'), ALGORITHM = INSTANT;

SELECT '### 01-unique-null-va-phu-thuoc-ham' AS '';
CREATE TABLE u2 (id INT PRIMARY KEY, name VARCHAR(20), code VARCHAR(20) UNIQUE);
INSERT INTO u2 VALUES (1, 'A', NULL), (2, 'B', NULL);
SELECT COUNT(*) AS hai_null_hop_le FROM u2;
SELECT id, name, COUNT(*) FROM u2 GROUP BY id;

SELECT '### 02-invisible-index' AS '';
ALTER TABLE s ALTER INDEX i_email INVISIBLE;
SELECT index_name, is_visible FROM information_schema.statistics
WHERE table_schema = 't' AND table_name = 's' AND index_name = 'i_email';

SELECT '### 05-lateral' AS '';
SELECT a.x, l.y FROM a JOIN LATERAL (SELECT b.x AS y FROM b WHERE b.x >= a.x ORDER BY b.x LIMIT 1) l ON TRUE;
