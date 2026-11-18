public class Intern {
    public static void main(String[] a) {
        for (int i = 0; i < 2_000_000; i++) ("s" + i).intern();
    }
}
