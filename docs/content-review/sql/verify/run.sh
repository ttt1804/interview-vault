#!/usr/bin/env bash
# Chạy phép thử SQL trên hai container riêng: ivsql-pg và ivsql-my.
# Không mở cổng, không đụng container khác. Tạo trước khi chạy:
#   docker run -d --name ivsql-pg -e POSTGRES_HOST_AUTH_METHOD=trust postgres:latest
#   docker run -d --name ivsql-my -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -e MYSQL_DATABASE=t mysql:lts
# Dọn bằng: docker rm -f ivsql-pg ivsql-my
set -u
cd "$(dirname "$0")"

pg() { docker exec -i ivsql-pg psql -U postgres -d verify -v ON_ERROR_STOP=0 -qAt "$@" 2>&1; }
my() { docker exec -i ivsql-my mysql -uroot -t --force t "$@" 2>&1; }

docker exec ivsql-pg psql -U postgres -qc 'DROP DATABASE IF EXISTS verify' -c 'DROP ROLE IF EXISTS app_owner' -c 'CREATE DATABASE verify'
docker exec ivsql-my mysql -uroot -e 'DROP DATABASE IF EXISTS t; CREATE DATABASE t'

pg < pg.sql
echo
my < mysql.sql

echo; echo '### tx-merge-dua-insert'
pg -c 'CREATE TABLE m (sku text PRIMARY KEY, n int)'
MERGE_SQL="MERGE INTO m USING (VALUES ('A', 1)) s(sku, n) ON m.sku = s.sku WHEN MATCHED THEN UPDATE SET n = m.n + 1 WHEN NOT MATCHED THEN INSERT VALUES (s.sku, s.n)"
UPSERT_SQL="INSERT INTO m VALUES ('B', 1) ON CONFLICT (sku) DO UPDATE SET n = m.n + 1"
{ printf 'BEGIN; %s; SELECT pg_sleep(1.5); COMMIT;\n' "$MERGE_SQL" | pg >/dev/null; } &
sleep 0.5; echo "$MERGE_SQL;" | pg; wait
{ printf 'BEGIN; %s; SELECT pg_sleep(1.5); COMMIT;\n' "$UPSERT_SQL" | pg >/dev/null; } &
sleep 0.5; echo "$UPSERT_SQL;" | pg; wait
pg -c 'SELECT * FROM m ORDER BY sku'

echo; echo '### tx-update-in-deadlock'
pg <<'SQL'
CREATE TABLE acc (id int PRIMARY KEY, balance int);
INSERT INTO acc VALUES (2, 100), (1, 100);
CREATE FUNCTION slow() RETURNS trigger AS $$ BEGIN PERFORM pg_sleep(0.7); RETURN NEW; END $$ LANGUAGE plpgsql;
CREATE TRIGGER t_slow BEFORE UPDATE ON acc FOR EACH ROW EXECUTE FUNCTION slow();
SQL
U="UPDATE acc SET balance = balance + CASE id WHEN 1 THEN -1 ELSE 1 END WHERE id IN (1, 2)"
{ printf 'SET enable_indexscan=off; SET enable_bitmapscan=off; %s;\n' "$U" | pg; } &
sleep 0.2; printf 'SET enable_seqscan=off; SET enable_bitmapscan=off; %s;\n' "$U" | pg; wait
pg -c 'DROP TRIGGER t_slow ON acc'

echo; echo '### tx-chuyen-tien-nguoc-chieu'
pg -c 'UPDATE acc SET balance = 100'
{ pg <<'SQL'
BEGIN; UPDATE acc SET balance = balance - 10 WHERE id = 1 AND balance >= 10; SELECT pg_sleep(0.7);
UPDATE acc SET balance = balance + 10 WHERE id = 2; COMMIT;
SQL
} &
sleep 0.2
pg <<'SQL'
BEGIN; UPDATE acc SET balance = balance - 10 WHERE id = 2 AND balance >= 10; SELECT pg_sleep(0.7);
UPDATE acc SET balance = balance + 10 WHERE id = 1; COMMIT;
SQL
wait

echo; echo '### tx-update-co-dieu-kien-danh-gia-lai'
pg -c 'UPDATE acc SET balance = 100'
{ printf 'BEGIN; UPDATE acc SET balance = balance - 80 WHERE id = 1 AND balance >= 80; SELECT pg_sleep(1); COMMIT;\n' | pg >/dev/null; } &
sleep 0.3; printf "UPDATE acc SET balance = balance - 80 WHERE id = 1 AND balance >= 80 RETURNING 'tru duoc';\nSELECT 'so du', balance FROM acc WHERE id = 1;\n" | pg; wait

echo; echo '### do-toc-do-nap (5000 hang, giay)'
pg -c 'CREATE TABLE ins (id int, v text)' 2>/dev/null
t() { local s e; s=$(date +%s.%N); "$@" >/dev/null; e=$(date +%s.%N); awk -v a="$s" -v b="$e" 'BEGIN { printf "%.2f\n", b - a }'; }
gen_single() { seq 1 5000 | sed "s/.*/INSERT INTO ins VALUES (&, 'x');/"; }
echo -n 'tung INSERT autocommit: '; t bash -c "$(declare -f pg gen_single); gen_single | pg"
echo -n 'tung INSERT trong mot transaction: '; t bash -c "$(declare -f pg gen_single); { echo BEGIN\;; gen_single; echo COMMIT\;; } | pg"
gen_multi() { echo 'INSERT INTO ins VALUES'; seq 1 4999 | sed "s/.*/(&,'x'),/"; echo "(5000,'x');"; }
echo -n 'mot INSERT nhieu hang: '; t bash -c "$(declare -f pg gen_multi); gen_multi | pg"
gen_copy() { echo 'COPY ins FROM STDIN;'; seq 1 5000 | sed 's/$/\tx/'; echo '\.'; }
echo -n 'COPY: '; t bash -c "$(declare -f pg gen_copy); gen_copy | pg"

echo; echo '### mysql-gap-lock'
docker exec -i ivsql-my mysql -uroot -t --force t <<'SQL' &
CREATE TABLE g (id INT PRIMARY KEY); INSERT INTO g VALUES (10), (20), (30);
BEGIN; SELECT * FROM g WHERE id BETWEEN 15 AND 25 FOR UPDATE;
SELECT index_name, lock_mode, lock_data FROM performance_schema.data_locks WHERE object_name = 'g' AND lock_type = 'RECORD';
SELECT SLEEP(25); ROLLBACK;
SQL
sleep 3
for v in 15 18 25 35; do
  echo "chen $v:"; printf 'SET innodb_lock_wait_timeout = 1; INSERT INTO g VALUES (%s); DELETE FROM g WHERE id = %s;\n' "$v" "$v" | my
done
wait

echo; echo '### pg-stat-sau-restart-sach'
pg -c 'SELECT count(*) FROM users WHERE id = 1' >/dev/null
pg -c 'SELECT pg_sleep(1.2)' >/dev/null
pg -c "SELECT 'truoc restart', idx_scan > 0 FROM pg_stat_user_indexes WHERE indexrelname = 'users_pkey'"
docker restart -t 30 ivsql-pg >/dev/null
for i in $(seq 1 30); do docker exec ivsql-pg pg_isready -U postgres -q && break; sleep 1; done
pg -c "SELECT 'sau restart', idx_scan > 0 FROM pg_stat_user_indexes WHERE indexrelname = 'users_pkey'"
