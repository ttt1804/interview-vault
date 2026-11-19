# Nguồn đối chiếu SQL

Ngày truy cập: 2026-11-19.

## Môi trường chạy thử

| Thành phần | Phiên bản | Cách chạy |
| --- | --- | --- |
| PostgreSQL | 18.7, locale `en_US.utf8`, `wal_level = replica` | Container `postgres:latest` riêng, không mở cổng |
| MySQL | 9.7.4, cấu hình mặc định, `REPEATABLE-READ` | Container `mysql:lts` riêng, không mở cổng |
| SQLite | 3.50.6 cho `FILTER`; `sql.js` trong repo cho bài tập | Chạy cục bộ |

Lệnh chạy nằm trong [verify/run.sh](verify/run.sh). Kiểm tra `viz` và bài tập bằng [verify/check-data.mjs](verify/check-data.mjs).

## PostgreSQL 18

| Nội dung | Nguồn |
| --- | --- |
| Wraparound, freeze, VACUUM định kỳ | [Routine Vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html), [VACUUM](https://www.postgresql.org/docs/18/sql-vacuum.html) |
| MERGE khi chạy đồng thời | [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [MERGE](https://www.postgresql.org/docs/18/sql-merge.html) |
| Foreign key action | [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) |
| Generated column | [Generated Columns](https://www.postgresql.org/docs/18/ddl-generated-columns.html) |
| Row security | [Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) |
| `synchronous_commit` | [WAL Configuration](https://www.postgresql.org/docs/18/runtime-config-wal.html) |
| Thống kê sau restart | [Cumulative Statistics](https://www.postgresql.org/docs/18/monitoring-stats.html) |
| Index nhiều cột, skip scan | [Multicolumn Indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html) |
| `text_pattern_ops` | [Operator Classes](https://www.postgresql.org/docs/18/indexes-opclass.html) |
| Fillfactor | [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html), [CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html) |
| `READ ONLY DEFERRABLE` | [SET TRANSACTION](https://www.postgresql.org/docs/18/sql-set-transaction.html) |
| `PREPARE` | [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html) |

## Hệ khác và thư viện

| Nội dung | Nguồn | Phiên bản |
| --- | --- | --- |
| SQL Server `GROUP BY` | [GROUP BY](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-group-by-transact-sql?view=sql-server-ver17) | SQL Server 2025 docs |
| SQL Server UNIQUE và NULL | [Unique constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/unique-constraints-and-check-constraints?view=sql-server-ver17) | SQL Server 2025 docs |
| SQL Server `MERGE`, `HOLDLOCK` | [MERGE](https://learn.microsoft.com/en-us/sql/t-sql/statements/merge-transact-sql?view=sql-server-ver17) | SQL Server 2025 docs |
| PgBouncer pool mode | [Features](https://www.pgbouncer.org/features.html) | Bản hiện hành |
| DynamoDB | [Trang sản phẩm](https://aws.amazon.com/dynamodb/) | Bản hiện hành |
| Spring dịch SQLSTATE | [SQLStateSQLExceptionTranslator](https://github.com/spring-projects/spring-framework/blob/main/spring-jdbc/src/main/java/org/springframework/jdbc/support/SQLStateSQLExceptionTranslator.java), [JdbcAccessor](https://github.com/spring-projects/spring-framework/blob/main/spring-jdbc/src/main/java/org/springframework/jdbc/support/JdbcAccessor.java) | Nhánh `main` |
| Exception deprecated | [CannotSerializeTransactionException](https://github.com/spring-projects/spring-framework/blob/main/spring-tx/src/main/java/org/springframework/dao/CannotSerializeTransactionException.java), [DeadlockLoserDataAccessException](https://github.com/spring-projects/spring-framework/blob/main/spring-tx/src/main/java/org/springframework/dao/DeadlockLoserDataAccessException.java) | Nhánh `main` |
| Thứ tự advice của retry | [EnableRetry](https://github.com/spring-projects/spring-retry/blob/main/src/main/java/org/springframework/retry/annotation/EnableRetry.java) | Nhánh `main` |
| `@SQLRestriction` | [SQLRestriction](https://github.com/hibernate/hibernate-orm/blob/main/hibernate-core/src/main/java/org/hibernate/annotations/SQLRestriction.java) | Nhánh `main`, có từ 6.3 |

## Chưa truy cập được

Các trang `dev.mysql.com/doc/refman` trả về trang "Technical Difficulties" cho công cụ tải. Hồ sơ không dùng chúng làm bằng chứng.
