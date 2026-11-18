#!/usr/bin/env bash
# Chạy các phép kiểm chứng chỉ cần JDK 17+, không cần broker Kafka.
set -euo pipefail

src="$(cd "$(dirname "$0")" && pwd)"
out="$(mktemp -d)"
trap 'rm -rf "$out"' EXIT

javac -encoding UTF-8 -d "$out" "$src/Verify.java"
java -Dfile.encoding=UTF-8 -cp "$out" Verify

echo "--- Shutdown hook chỉ gọi wakeup:"
java -Dfile.encoding=UTF-8 -cp "$out" Verify nojoin || true
echo "--- Shutdown hook chờ luồng chính:"
java -Dfile.encoding=UTF-8 -cp "$out" Verify join || true
