#!/usr/bin/env bash
# Chạy lại các phép kiểm chứng của đợt rà soát Java.
#   ./run.sh         # các phép chạy nhanh
#   ./run.sh race    # thêm phép thử HashMap đa luồng, tối đa khoảng 1 phút
set -euo pipefail
cd "$(dirname "$0")"

OUT=.out
trap 'rm -rf "$OUT"' EXIT
rm -rf "$OUT"
mkdir -p "$OUT"

case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) SEP=';' ;;
  *) SEP=':' ;;
esac

java -version 2>&1 | head -1
javac -Xlint:none -XDignore.symbol.file -d "$OUT" Verify.java Intern.java T.java F.java G.java Race.java

echo; echo '== Collections, String, CHM, CompletableFuture'
java --add-opens java.base/java.util=ALL-UNNAMED -cp "$OUT" Verify

echo; echo '== Ví dụ đã sửa'
java -cp "$OUT" T
java -cp "$OUT" F
java -cp "$OUT" G

echo; echo '== Cờ JVM'
java -XX:+PrintFlagsFinal -version 2>/dev/null | grep -E ' UseBiasedLocking | UseG1GC | UseSerialGC | StringTableSize ' || true
echo '1 CPU:'
java -XX:ActiveProcessorCount=1 -XX:+PrintFlagsFinal -version 2>/dev/null | grep -E ' UseG1GC | UseSerialGC ' || true

echo; echo '== String table sau khi intern 2 triệu chuỗi'
java -Xmx2g -XX:+PrintStringTableStatistics -cp "$OUT" Intern 2>&1 | grep -A8 -i 'StringTable statistics' | grep 'Number of buckets' || true

echo; echo '== instanceof List<String> từ Object phải lỗi biên dịch'
if javac -d "$OUT/negative" negative/E.java 2>"$OUT/negative.log"; then
  echo 'KHÔNG như kỳ vọng: biên dịch thành công'; exit 1
fi
head -1 "$OUT/negative.log"

compat() {
  local dir=binary-compat/$1 main=$2 base="$OUT/$1"
  javac -d "$base/v1" "$dir"/v1/*.java
  javac -d "$base/v2" "$dir"/v2/Base.java
  echo "-- $1:"
  local output
  output=$(java -cp "$base/v2$SEP$base/v1" "$main" 2>&1 || true)
  grep -m1 IncompatibleClassChangeError <<<"$output" || { echo 'KHÔNG thấy lỗi như kỳ vọng'; exit 1; }
}
echo; echo '== Đổi interface và abstract class làm hỏng binary cũ'
compat interface-to-class Impl
compat class-to-interface Impl2

if [ "${1:-}" = race ]; then
  echo; echo '== HashMap dùng đa luồng'
  java -cp "$OUT" Race
fi
