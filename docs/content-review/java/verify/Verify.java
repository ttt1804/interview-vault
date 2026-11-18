import java.lang.reflect.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Verify {
    static int sf = 7;
    static void p(String k, Object v) { System.out.println(k + " => " + v); }

    static class Parent {
        String findById(long id) { return "db"; }
        List<String> findAll() { return List.of(findById(1)); }
    }
    static class CachingChild extends Parent {
        int calls;
        @Override String findById(long id) { calls++; return "cache"; }
    }
    static final class SameHash {
        static long eq; final int v; SameHash(int v) { this.v = v; }
        @Override public int hashCode() { return 1; }
        @Override public boolean equals(Object o) { eq++; return o instanceof SameHash s && s.v == v; }
    }
    static final class SameHashCmp implements Comparable<SameHashCmp> {
        static long cmp; final int v; SameHashCmp(int v) { this.v = v; }
        @Override public int hashCode() { return 1; }
        @Override public boolean equals(Object o) { return o instanceof SameHashCmp s && s.v == v; }
        @Override public int compareTo(SameHashCmp o) { cmp++; return Integer.compare(v, o.v); }
    }
    static class MKey { String n; MKey(String n) { this.n = n; }
        @Override public int hashCode() { return n.hashCode(); }
        @Override public boolean equals(Object o) { return o instanceof MKey m && m.n.equals(n); } }

    static int grows(int target) { int cap = 10, g = 0; while (cap < target) { cap += cap >> 1; g++; } return g; }

    static String binType(Map<?, ?> m) throws Exception {
        Field t = HashMap.class.getDeclaredField("table"); t.setAccessible(true);
        Object[] tab = (Object[]) t.get(m);
        for (Object o : tab) if (o != null) return tab.length + ":" + o.getClass().getSimpleName();
        return "empty";
    }
    static int depth(TreeMap<Integer, ?> m, int key) throws Exception {
        Field r = TreeMap.class.getDeclaredField("root"); r.setAccessible(true);
        Object n = r.get(m); int d = 0;
        Class<?> c = Class.forName("java.util.TreeMap$Entry");
        Field k = c.getDeclaredField("key"), left = c.getDeclaredField("left"), right = c.getDeclaredField("right");
        k.setAccessible(true); left.setAccessible(true); right.setAccessible(true);
        while (n != null) { d++; int kk = (Integer) k.get(n); if (key == kk) return d; n = key < kk ? left.get(n) : right.get(n); }
        return -1;
    }

    public static void main(String[] x) throws Exception {
        // 04 CME demo
        for (String target : List.of("a", "b", "c")) {
            List<String> l = new ArrayList<>(List.of("a", "b", "c"));
            String r = "no exception, list=";
            try { for (String s : l) if (s.equals(target)) l.remove(s); r += l; }
            catch (ConcurrentModificationException e) { r = "CME"; }
            p("foreach remove " + target, r);
        }
        // 04 instanceof generic compiles on 16+
        List<String> a = new ArrayList<>();
        p("a instanceof List<String> compiles/value", a instanceof List<String>);
        // 01 inheritance self call
        CachingChild cc = new CachingChild(); p("extends self-call result", cc.findAll() + " overrideCalls=" + cc.calls);
        // 02 spread
        int ha = 0b0001_0000_0000_0000_0000_0000_0000_0101, hb = 0b0010_0000_0000_0000_0000_0000_0000_0101;
        p("spread bit28/29 buckets", ((ha ^ (ha >>> 16)) & 15) + "," + ((hb ^ (hb >>> 16)) & 15));
        int fa = (1 << 16) | 5, fb = (1 << 17) | 5;
        p("no-spread bit16/17", (fa & 15) + "," + (fb & 15));
        p("spread bit16/17", ((fa ^ (fa >>> 16)) & 15) + "," + ((fb ^ (fb >>> 16)) & 15));
        // Long.hashCode
        Set<Integer> bk = new TreeSet<>(); for (long id = 16; id <= 1600; id += 16) { int h = Long.hashCode(id); bk.add((h ^ (h >>> 16)) & 15); }
        p("Long.hashCode(multiples of 16) buckets n=16", bk);
        for (int n : new int[]{16, 64, 1024}) { Set<Integer> s = new HashSet<>(); for (long id = 16; id <= 160000; id += 16) { int h = (int) id; s.add((h ^ (h >>> 16)) & (n - 1)); } p("multiples16 distinct buckets n=" + n, s.size()); }
        // grow
        p("ArrayList grows to 100k / 1M (from cap 10)", grows(100_000) + " / " + grows(1_000_000));
        // Poisson
        double f = Math.exp(-0.5); StringBuilder sb = new StringBuilder(); double fact = 1;
        for (int k = 0; k <= 8; k++) { if (k > 0) fact *= k; sb.append(k).append('=').append(String.format("%.8f ", f * Math.pow(.5, k) / fact)); }
        p("Poisson 0.5", sb);
        // treeify threshold
        Map<SameHashCmp, Integer> tm = new HashMap<>(128);
        for (int i = 1; i <= 10; i++) { tm.put(new SameHashCmp(i), i); p("bin after put#" + i, binType(tm)); }
        // non comparable lookups
        int n = 20000; Map<SameHash, Integer> m1 = new HashMap<>(1 << 16); for (int i = 0; i < n; i++) m1.put(new SameHash(i), i);
        SameHash.eq = 0; m1.get(new SameHash(-1)); p("same hash NOT comparable, equals calls on miss (n=20000), bin=" + binType(m1), SameHash.eq);
        Map<SameHashCmp, Integer> m2 = new HashMap<>(1 << 16); for (int i = 0; i < n; i++) m2.put(new SameHashCmp(i), i);
        SameHashCmp.cmp = 0; m2.get(new SameHashCmp(-1)); p("same hash Comparable, compareTo calls on miss", SameHashCmp.cmp);
        // last resize
        p("last resize moves", (1 << 20) * 3 / 4 + 1);
        // mutable key
        MKey k = new MKey("vu"); Map<MKey, String> mm = new HashMap<>(); mm.put(k, "x"); k.n = "new";
        p("mutated get/remove", mm.get(k) + "/" + mm.remove(k) + " size=" + mm.size());
        mm.keySet().removeIf(q -> q == k); p("after keySet.removeIf size", mm.size());
        // String returns this
        String s = "ABC"; p("String this-returning", (s.trim() == s) + "," + (s.substring(0) == s) + "," + (s.toUpperCase() == s) + "," + (s.concat("") == s) + "," + (s.replace('x', 'y') == s));
        // concat cost
        long copied = 0, len = 0; for (int i = 0; i < 10000; i++) { copied += len; len += 5; } p("chars copied 10k x 5", copied);
        long t0 = System.nanoTime(); String c = ""; for (int i = 0; i < 10000; i++) c += "abcd\n"; p("string += ms", (System.nanoTime() - t0) / 1_000_000 + " len=" + c.length());
        t0 = System.nanoTime(); StringBuilder b = new StringBuilder(); for (int i = 0; i < 10000; i++) b.append("abcd\n"); p("StringBuilder ms", (System.nanoTime() - t0) / 1_000_000.0);
        // TreeMap depth
        TreeMap<Integer, String> t1 = new TreeMap<>(); for (int i = 1; i <= 1000; i++) t1.put(i, ""); p("TreeMap seq depth key 999 of 1000", depth(t1, 999));
        TreeMap<Integer, String> t2 = new TreeMap<>(); for (int i = 0; i < 1_000_000; i++) t2.put(i, ""); p("TreeMap seq depth key 999999 of 1M", depth(t2, 999_999));
        // TreeMap null
        TreeMap<String, Integer> tn = new TreeMap<>(Comparator.nullsFirst(Comparator.naturalOrder())); tn.put(null, 1); p("TreeMap nullsFirst null key", tn);
        // subMap
        TreeMap<Integer, String> sm = new TreeMap<>(); sm.put(100, ""); sm.put(200, ""); p("subMap(100,200)", sm.subMap(100, 200).keySet());
        // CHM recursion
        ExecutorService ex = Executors.newSingleThreadExecutor(r -> { Thread th = new Thread(r); th.setDaemon(true); return th; });
        Future<String> fu = ex.submit(() -> { var ch = new ConcurrentHashMap<String, Integer>(); try { ch.computeIfAbsent("a", q -> { ch.put("a", 1); return 2; }); return "ok"; } catch (Exception e) { return e.toString(); } });
        try { p("CHM recursive same key", fu.get(3, TimeUnit.SECONDS)); } catch (TimeoutException e) { p("CHM recursive same key", "hang"); }
        // orTimeout
        AtomicBoolean finished = new AtomicBoolean();
        var cf = CompletableFuture.runAsync(() -> { try { Thread.sleep(600); finished.set(true); } catch (InterruptedException e) { } }).orTimeout(100, TimeUnit.MILLISECONDS);
        try { cf.join(); } catch (Exception e) { p("orTimeout result", e.getCause().getClass().getSimpleName()); }
        Thread.sleep(800); p("task still completed after orTimeout", finished.get());
        // statics via Unsafe
        Field uf = Class.forName("sun.misc.Unsafe").getDeclaredField("theUnsafe"); uf.setAccessible(true); sun.misc.Unsafe u = (sun.misc.Unsafe) uf.get(null);
        p("staticFieldBase of Verify.sf", u.staticFieldBase(Verify.class.getDeclaredField("sf")));
        // toMap duplicates
        try { java.util.stream.Stream.of("email", "email").collect(java.util.stream.Collectors.toMap(q -> q, q -> "m")); } catch (Exception e) { p("toMap duplicate", e.getClass().getSimpleName()); }
    }
}
