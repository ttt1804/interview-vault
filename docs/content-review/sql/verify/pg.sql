-- Phép thử một phiên cho PostgreSQL. Chạy qua run.sh trên database tạm.
\set ON_ERROR_STOP off
\pset pager off
\pset format unaligned
\pset tuples_only on
SET client_min_messages = notice;

\echo '### moi-truong'
SELECT version();
SELECT datcollate FROM pg_database WHERE datname = current_database();
SHOW autovacuum_freeze_max_age;
SHOW vacuum_failsafe_age;
SHOW max_prepared_transactions;
SHOW wal_level;

CREATE TABLE orders (
  id bigint PRIMARY KEY, customer_id bigint NOT NULL, status text NOT NULL,
  amount numeric(12,2) NOT NULL, created_at timestamptz NOT NULL
);
INSERT INTO orders
SELECT g, g % 2000, (ARRAY['NEW','PAID','SHIPPED'])[1 + g % 3], g % 1000,
       timestamptz '2026-01-01' + (g % 300) * interval '1 day'
FROM generate_series(1, 200000) g;
CREATE TABLE users (id bigint PRIMARY KEY, email text, phone text, name text);
INSERT INTO users SELECT g, 'u' || g || '@x.com', '09' || g, 'Nguyen ' || g FROM generate_series(1, 100000) g;
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_phone ON users (phone);
ANALYZE orders; ANALYZE users;

\echo '### 01-having-day-xuong-scan'
EXPLAIN (COSTS OFF) SELECT customer_id, count(*) FROM orders GROUP BY customer_id HAVING customer_id > 100;

\echo '### 01-date-tru-date'
SELECT pg_typeof(date '2026-01-02' - date '2026-01-01'), pg_typeof(timestamp '2026-01-02' - timestamp '2026-01-01');

\echo '### 01-ep-kieu-text-so'
SELECT * FROM users WHERE phone = 84901234567;
SELECT count(*) FROM users WHERE id = '123';

\echo '### 01-no-action'
CREATE TABLE p (id int PRIMARY KEY);
CREATE TABLE c1 (pid int REFERENCES p(id) ON DELETE NO ACTION);
CREATE TABLE c2 (pid int REFERENCES p(id) ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED);
INSERT INTO p VALUES (1), (2); INSERT INTO c1 VALUES (1); INSERT INTO c2 VALUES (2);
BEGIN; DELETE FROM p WHERE id = 1; ROLLBACK;
BEGIN; DELETE FROM p WHERE id = 2; INSERT INTO p VALUES (2); COMMIT;
SELECT 'deferrable xoa roi chen lai: ok', count(*) FROM p;

\echo '### 01-upsert-where-bo-sot-name'
CREATE TABLE products (sku text PRIMARY KEY, name text, price int, updated_at timestamptz);
INSERT INTO products VALUES ('S', 'Cu', 100, now());
INSERT INTO products VALUES ('S', 'Moi', 100, now())
ON CONFLICT (sku) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price
WHERE products.price IS DISTINCT FROM EXCLUDED.price;
SELECT 'chi so sanh price ->', name FROM products;
INSERT INTO products VALUES ('S', 'Moi', 100, now())
ON CONFLICT (sku) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price
WHERE (products.name, products.price) IS DISTINCT FROM (EXCLUDED.name, EXCLUDED.price);
SELECT 'so sanh ca hai ->', name FROM products;

\echo '### 01-merge-demo'
MERGE INTO products p USING (VALUES ('SKU-1', 'Ao', 100000)) AS s(sku, name, price) ON p.sku = s.sku
WHEN MATCHED THEN UPDATE SET name = s.name, price = s.price
WHEN NOT MATCHED THEN INSERT (sku, name, price) VALUES (s.sku, s.name, s.price);

\echo '### 01-filter-chuan-sql'
SELECT feature_id, feature_name, is_supported FROM information_schema.sql_features
WHERE feature_id IN ('T612', 'F302', 'F304') AND sub_feature_id = '';

\echo '### 02-composite-ca-ba-cot'
CREATE INDEX idx_orders ON orders (customer_id, status, created_at);
EXPLAIN (COSTS OFF) SELECT * FROM orders
WHERE customer_id = 1 AND created_at > '2026-01-01' AND status = 'PAID';

\echo '### 02-skip-scan'
CREATE INDEX idx_orders_status_created ON orders (status, created_at);
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT id FROM orders WHERE created_at = '2026-02-01';

\echo '### 02-or-bitmap'
EXPLAIN (COSTS OFF) SELECT * FROM users WHERE email = 'u5@x.com' OR phone = '096';

\echo '### 02-join-bat-dang-thuc'
SET enable_nestloop = off;
EXPLAIN (COSTS OFF) SELECT * FROM users a JOIN users b ON a.id < b.id WHERE a.id < 3 AND b.id < 5;
RESET enable_nestloop;

\echo '### 02-generated-va-expression'
ALTER TABLE orders ADD COLUMN d1 date GENERATED ALWAYS AS (created_at::date) STORED;
CREATE INDEX idx_orders_year ON orders (EXTRACT(YEAR FROM created_at));
CREATE INDEX idx_orders_day_bad ON orders ((created_at::date));
ALTER TABLE orders ADD COLUMN created_date date GENERATED ALWAYS AS ((created_at AT TIME ZONE 'UTC')::date) STORED;
CREATE INDEX idx_orders_created_date ON orders (created_date);
CREATE INDEX idx_orders_year_utc ON orders (EXTRACT(YEAR FROM created_at AT TIME ZONE 'UTC'));
ALTER TABLE orders ADD COLUMN v_total numeric GENERATED ALWAYS AS (amount * 2) VIRTUAL;
SELECT 'virtual ->', attname, attgenerated FROM pg_attribute WHERE attrelid = 'orders'::regclass AND attname IN ('created_date', 'v_total');
CREATE INDEX idx_orders_v ON orders (v_total);
ALTER TABLE orders DROP COLUMN v_total;

\echo '### 02-like-collation'
CREATE INDEX idx_users_name ON users (name);
CREATE INDEX idx_users_name_lower ON users (lower(name));
ANALYZE users;
EXPLAIN (COSTS OFF) SELECT * FROM users WHERE name LIKE 'Nguyen 12345%';
EXPLAIN (COSTS OFF) SELECT * FROM users WHERE lower(name) LIKE 'nguyen 12345%';
CREATE INDEX idx_users_name_lower_p ON users (lower(name) text_pattern_ops);
EXPLAIN (COSTS OFF) SELECT * FROM users WHERE lower(name) LIKE 'nguyen 12345%';

\echo '### 02-index-trung'
CREATE TABLE dup (a int, b int);
CREATE INDEX dup_a ON dup (a); CREATE INDEX dup_ab ON dup (a, b);
SELECT 'truy van demo ->', indrelid::regclass, array_agg(indexrelid::regclass)
FROM pg_index WHERE indrelid = 'dup'::regclass GROUP BY indrelid, indkey HAVING count(*) > 1;
SELECT 'truy van demo xong';
SELECT 'tien to ->', a.indexrelid::regclass, b.indexrelid::regclass
FROM pg_index a JOIN pg_index b ON a.indrelid = b.indrelid AND a.indexrelid <> b.indexrelid
 AND a.indpred IS NULL AND b.indpred IS NULL AND a.indexprs IS NULL AND b.indexprs IS NULL
 AND b.indkey::text LIKE a.indkey::text || ' %'
WHERE a.indrelid = 'dup'::regclass AND NOT a.indisunique;

\echo '### 02-hot-va-cot-co-index'
CREATE TABLE sessions (id int PRIMARY KEY, last_seen timestamptz, hits int) WITH (fillfactor = 70);
CREATE INDEX idx_sessions_seen ON sessions (last_seen);
INSERT INTO sessions SELECT g, now(), 0 FROM generate_series(1, 1000) g;
UPDATE sessions SET last_seen = last_seen + interval '1 second' WHERE id <= 100;
SELECT pg_stat_force_next_flush();
SELECT 'doi cot co index ->', n_tup_upd, n_tup_hot_upd FROM pg_stat_user_tables WHERE relname = 'sessions';
UPDATE sessions SET hits = hits + 1 WHERE id > 900;
SELECT pg_stat_force_next_flush();
SELECT 'them doi cot khong index ->', n_tup_upd, n_tup_hot_upd FROM pg_stat_user_tables WHERE relname = 'sessions';

\echo '### 03-advisory'
SELECT pg_advisory_xact_lock(hashtext('order'), 5::bigint);
SELECT pg_advisory_xact_lock(hashtext('order:' || 5::bigint));
SELECT 'mot khoa bigint ok';

\echo '### 03-queue-cte'
CREATE TABLE jobs (id bigserial PRIMARY KEY, payload jsonb NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'PENDING',
  attempts int NOT NULL DEFAULT 0, run_after timestamptz NOT NULL DEFAULT now(), locked_at timestamptz);
INSERT INTO jobs (payload) SELECT '{}' FROM generate_series(1, 30);
WITH picked AS (
  SELECT id FROM jobs WHERE status = 'PENDING' AND run_after <= now()
  ORDER BY run_after LIMIT 10 FOR UPDATE SKIP LOCKED
)
UPDATE jobs j SET status = 'PROCESSING', locked_at = now(), attempts = attempts + 1
FROM picked WHERE j.id = picked.id RETURNING j.id \g /dev/null
SELECT 'cte lay duoc', count(*) FROM jobs WHERE status = 'PROCESSING';

\echo '### 04-demo-kieu-du-lieu'
CREATE TABLE t_float (id int,
  SELECT 0.1::float + 0.2::float = 0.3::float;
);
SELECT 0.1::float + 0.2::float = 0.3::float;

\echo '### 04-enum'
CREATE TYPE order_status AS ENUM ('NEW', 'PAID');
ALTER TYPE order_status RENAME VALUE 'PAID' TO 'SETTLED';
SELECT enum_range(NULL::order_status);

\echo '### 04-audit-trigger'
CREATE TABLE o2 (id bigserial PRIMARY KEY, v int);
CREATE TABLE o2h (history_id bigserial PRIMARY KEY, order_id bigint NOT NULL, data jsonb NOT NULL, operation text NOT NULL, changed_at timestamptz NOT NULL DEFAULT now());
CREATE FUNCTION log_o2() RETURNS trigger AS $$
BEGIN
  INSERT INTO o2h (order_id, data, operation, changed_at)
  VALUES (COALESCE(NEW.id, OLD.id), to_jsonb(COALESCE(NEW, OLD)), TG_OP, now());
  RETURN COALESCE(NEW, OLD);
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER t_o2 AFTER INSERT OR UPDATE OR DELETE ON o2 FOR EACH ROW EXECUTE FUNCTION log_o2();
INSERT INTO o2 (v) VALUES (1); UPDATE o2 SET v = 2; DELETE FROM o2;
SELECT operation, order_id, data FROM o2h ORDER BY history_id;

\echo '### 04-partition-pruning'
CREATE TABLE events (id bigserial, created_at timestamptz NOT NULL, data jsonb) PARTITION BY RANGE (created_at);
CREATE TABLE events_2026_09 PARTITION OF events FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE events_2026_10 PARTITION OF events FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE created_at >= '2026-09-01';
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE created_at >= '2026-09-01' AND created_at < '2026-10-01';
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE date(created_at) = '2026-09-05';

\echo '### 04-rls-chu-bang'
CREATE ROLE app_owner LOGIN;
GRANT CREATE ON SCHEMA public TO app_owner;
SET ROLE app_owner;
CREATE TABLE t_orders (id int, tenant_id bigint);
INSERT INTO t_orders VALUES (1, 42), (2, 7);
ALTER TABLE t_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON t_orders USING (tenant_id = current_setting('app.tenant_id')::bigint);
SET app.tenant_id = '42';
SELECT 'chu bang, chua FORCE ->', count(*) FROM t_orders;
ALTER TABLE t_orders FORCE ROW LEVEL SECURITY;
SELECT 'chu bang, co FORCE ->', count(*) FROM t_orders;
RESET ROLE;

\echo '### 04-index-demo-thieu-cot'
CREATE TABLE o3 (id bigserial PRIMARY KEY, customer_id bigint NOT NULL, status text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE UNIQUE INDEX uq_o3_number ON o3 (order_number);

\echo '### 04-toast-khi-update-cot-khac'
CREATE TABLE wide_users (id int PRIMARY KEY, last_login timestamptz, avatar bytea);
ALTER TABLE wide_users ALTER COLUMN avatar SET STORAGE EXTERNAL;
INSERT INTO wide_users SELECT g, now(), decode(repeat('ab', 50000), 'hex') FROM generate_series(1, 200) g;
SELECT 'truoc: heap, toast ->', pg_relation_size('wide_users'), pg_relation_size(reltoastrelid) FROM pg_class WHERE relname = 'wide_users';
UPDATE wide_users SET last_login = now();
SELECT 'sau: heap, toast ->', pg_relation_size('wide_users'), pg_relation_size(reltoastrelid) FROM pg_class WHERE relname = 'wide_users';

\echo '### 04-thu-tu-cot-va-ten-dai'
SELECT pg_column_size(row(1::bigint, true, 1::int)), pg_column_size(row(true, 1::bigint, 1::int));
CREATE TABLE t_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (id int);

\echo '### 04-mau-khac'
SELECT '9' > '100' COLLATE "C";
SELECT uuidv7() IS NOT NULL;
CREATE EXTENSION btree_gist;
CREATE TABLE bookings (room_id int, during tstzrange);
ALTER TABLE bookings ADD CONSTRAINT no_overlap EXCLUDE USING GIST (room_id WITH =, during WITH &&);
CREATE TABLE metrics (device_id bigint NOT NULL, ts timestamptz NOT NULL, metric text NOT NULL, value double precision NOT NULL,
  PRIMARY KEY (device_id, metric, ts)) PARTITION BY RANGE (ts);
CREATE INDEX idx_metrics_ts_brin ON metrics USING BRIN (ts) WITH (pages_per_range = 32);
SELECT 'mau khac xong';

\echo '### 05-distinct-on-doc-bao-nhieu-hang'
CREATE INDEX idx_orders_cust_created ON orders (customer_id, created_at DESC);
VACUUM ANALYZE orders;
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT DISTINCT ON (customer_id) id FROM orders ORDER BY customer_id, created_at DESC;

\echo '### 05-window-recursive-fts'
CREATE TABLE daily_revenue (ngay date, doanh_thu int);
INSERT INTO daily_revenue VALUES ('2026-01-01', 10), ('2026-01-03', 20), ('2026-01-09', 30);
SELECT ngay, AVG(doanh_thu) OVER (ORDER BY ngay RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW)::numeric(6,2) FROM daily_revenue;
CREATE TABLE g (id int, parent int);
INSERT INTO g VALUES (1, 2), (2, 1);
WITH RECURSIVE r AS (SELECT id, parent FROM g WHERE id = 1 UNION ALL SELECT g.id, g.parent FROM g JOIN r ON g.id = r.parent)
CYCLE id SET is_cycle USING path SELECT count(*) FROM r;
CREATE TABLE articles (id int, title text, body text);
ALTER TABLE articles ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') || setweight(to_tsvector('simple', coalesce(body, '')), 'B')) STORED;
SELECT 'fts xong';

\echo '### 05-cho-lsn'
SELECT proname FROM pg_proc WHERE proname LIKE '%wal_replay_wait%' OR proname LIKE '%wait_for_lsn%';
SELECT 'so ham tim thay', count(*) FROM pg_proc WHERE proname LIKE '%wal_replay_wait%';
SELECT pg_wal_replay_wait('0/16B3748');

\echo '### 05-pg-partition-guc'
SHOW partition_pruning;
SHOW enable_partition_pruning;
SHOW constraint_exclusion;

\echo '### 05-unlogged-va-wal'
CREATE TABLE b1 (id int, v text);
CREATE TABLE b2 (id int, v text);
SELECT pg_current_wal_insert_lsn() AS l0 \gset
INSERT INTO b1 SELECT g, repeat('x', 100) FROM generate_series(1, 200000) g;
SELECT pg_current_wal_insert_lsn() AS l1 \gset
ALTER TABLE b2 SET UNLOGGED;
INSERT INTO b2 SELECT g, repeat('x', 100) FROM generate_series(1, 200000) g;
ALTER TABLE b2 SET LOGGED;
SELECT pg_current_wal_insert_lsn() AS l2 \gset
SELECT 'wal MB: nap thuong, unlogged roi logged ->',
  round(pg_wal_lsn_diff(:'l1', :'l0') / 1048576.0), round(pg_wal_lsn_diff(:'l2', :'l1') / 1048576.0);

\echo '### 05-do-toc-do-nap'
\timing on
CREATE TABLE ins (id int, v text);
\echo 'xem run.sh cho phep do toc do nap'
\timing off
