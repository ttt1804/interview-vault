import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * Kiểm chứng các khẳng định của phần Kafka chỉ cần JDK, không cần broker.
 * Chạy bằng: docs/content-review/kafka/verify/run.sh
 */
public class Verify {
    public static void main(String[] args) throws Exception {
        if (args.length > 0) {
            hookDemo(args[0]);
            return;
        }

        // Math.abs(Integer.MIN_VALUE) vẫn âm, nên chỉ số worker có thể âm.
        String key = "polygenelubricants";
        int h = key.hashCode();
        System.out.println("hashCode(" + key + ") = " + h);
        System.out.println("Math.abs(h) % 8 = " + (Math.abs(h) % 8));
        System.out.println("Math.abs(h) % 7 = " + (Math.abs(h) % 7));
        System.out.println("Math.floorMod(h, 7) = " + Math.floorMod(h, 7));

        // Sizing ở kafka-05: 500 MB/s, RF=3, 3 ngày.
        double raw = 500e6 * 259200 * 3 / 1e12;
        System.out.printf("Đĩa thô = %.1f TB, cộng 35%% = %.1f TB, số broker 30 TB = %.1f%n",
                raw, raw * 1.35, raw * 1.35 / 30);

        // Sizing demo: 50 MB/s, 7 ngày, RF=3, dự phòng 30%, đơn vị MiB -> TiB.
        System.out.printf("Demo sizing = %.1f TiB%n", 50.0 * 86400 * 7 * 3 * 1.3 / (1024 * 1024));
    }

    /** Hook chỉ gọi wakeup rồi trả về, hoặc chờ luồng chính dọn xong. */
    private static void hookDemo(String mode) throws Exception {
        Thread main = Thread.currentThread();
        CountDownLatch wakeup = new CountDownLatch(1);
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            wakeup.countDown();
            if (mode.equals("join")) {
                try {
                    main.join();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }));
        new Thread(() -> System.exit(0)).start();
        wakeup.await(5, TimeUnit.SECONDS);
        Thread.sleep(500); // mô phỏng consumer.close() cần thời gian
        System.out.println("close() đã chạy xong");
    }
}
