SS.addQuestions('java', [
{
  cat: 'Java Core & OOP',
  id: 'java-sb2w3j',
  q: 'JDK, JRE và JVM khác nhau như thế nào?',
  answer:
    '`JVM` (Java Virtual Machine) là máy ảo thực thi bytecode: nó nạp class, verify, JIT-compile sang mã máy, đồng thời quản lý bộ nhớ và GC. Bản thân JVM chỉ là một đặc tả (spec) và có nhiều hiện thực khác nhau như HotSpot hay OpenJ9.\n' +
    '\n' +
    '`JRE` (Java Runtime Environment) gồm JVM cộng thư viện chuẩn (rt.jar / module java.base…) và các file cấu hình. Chừng đó đủ để **chạy** một ứng dụng Java, nhưng không biên dịch được.\n' +
    '\n' +
    '`JDK` (Java Development Kit) là JRE cộng thêm bộ công cụ phát triển: `javac` (compiler), `jar`, `javadoc`, `jdb`, `jlink`, `jshell`… Có JDK là đủ để **viết, biên dịch và chạy**.\n' +
    '\n' +
    'Từ Java 11, Oracle không phát hành gói JRE riêng nữa — bạn tải JDK rồi tự cắt một runtime tối giản bằng `jlink`.',
  essence:
    'Ba thứ lồng trong nhau: JDK chứa JRE, JRE chứa JVM. JVM là thứ tạo nên tính "write once run anywhere", vì bytecode không phụ thuộc nền tảng còn phần phụ thuộc OS/CPU đã được JVM gánh hết.',
  example:
    'Trên CI bạn cần `eclipse-temurin:17-jdk` để chạy `mvn package`. Nhưng image production chỉ cần phần runtime, nên hãy dùng `jlink` tạo một custom JRE khoảng 40MB chứa đúng những module ứng dụng dùng, rồi copy vào image `distroless` — nhẹ hơn rất nhiều so với đóng gói cả JDK.',
  viz: {
    type: 'layers',
    title: 'JDK ⊃ JRE ⊃ JVM',
    layers: [
      { name: 'JDK', tag: 'viết + biên dịch + chạy', note: 'JRE + công cụ: javac, jar, javadoc, jlink, jshell…' },
      { name: 'JRE', tag: 'chỉ chạy', note: 'JVM + thư viện chuẩn (module java.base…) + file cấu hình' },
      { name: 'JVM', tag: 'thực thi bytecode', note: 'nạp/verify class, JIT, quản lý bộ nhớ + GC. Là spec: HotSpot, OpenJ9' },
    ],
  },
  demo: [
    {
      lang: "bash",
      title: "Ranh giới JDK / JRE / JVM nhìn thấy được trên máy",
      code:
        "# javac chỉ có trong JDK — JRE không biên dịch được\n" +
        "javac -version      # javac 17.0.10   -> đang dùng JDK\n" +
        "java -version       # openjdk 17.0.10 -> phần runtime (JRE) nằm trong JDK\n" +
        "\n" +
        "# Biên dịch: .java -> .class (bytecode, độc lập OS/CPU)\n" +
        "javac App.java\n" +
        "javap -c App.class  # xem bytecode: đây mới là thứ JVM thực sự thực thi\n" +
        "\n" +
        "# jlink cắt runtime tối giản: chỉ lấy đúng module ứng dụng cần\n" +
        "jlink --add-modules java.base,java.logging \\\n" +
        "      --strip-debug --no-man-pages --compress=2 \\\n" +
        "      --output /opt/jre-min\n" +
        "/opt/jre-min/bin/java -version   # ~40MB thay vì ~180MB cả JDK",
    },
    {
      lang: "dockerfile",
      title: "Dockerfile multi-stage: build bằng JDK, chạy bằng runtime",
      code:
        "# Stage 1 cần JDK vì phải chạy javac/maven\n" +
        "FROM eclipse-temurin:17-jdk AS build\n" +
        "COPY . /src\n" +
        "RUN cd /src && ./mvnw -q package\n" +
        "\n" +
        "# Stage 2 chỉ cần runtime -> image nhỏ hơn, ít CVE hơn\n" +
        "FROM eclipse-temurin:17-jre\n" +
        "COPY --from=build /src/target/app.jar /app.jar\n" +
        "ENTRYPOINT [\"java\", \"-jar\", \"/app.jar\"]",
    },
  ],
},
{
  cat: 'Java Core & OOP',
  id: 'java-ls9e9k',
  q: 'Overloading và Overriding khác nhau ra sao, và mỗi loại được phân giải bằng static hay dynamic dispatch?',
  answer:
    '**Overloading** (nạp chồng) là nhiều method trùng tên nhưng khác danh sách tham số, nằm trong cùng một class hoặc trong quan hệ kế thừa. Compiler phân giải chúng ngay lúc **biên dịch**, dựa trên kiểu tĩnh của tham số — đây là *static dispatch*.\n' +
    '\n' +
    '**Overriding** (ghi đè) là khi lớp con định nghĩa lại method có cùng chữ ký của lớp cha. Việc chọn phiên bản nào diễn ra lúc **chạy**, dựa trên kiểu thực của object — đây là *dynamic dispatch*, thực hiện qua virtual method table.\n' +
    '\n' +
    'Khi override, bạn phải giữ chữ ký giống hệt; kiểu trả về được phép covariant; không được thu hẹp access modifier; không được ném checked exception rộng hơn; và nên đánh dấu `@Override` để compiler bắt lỗi giúp.',
  essence:
    'Overloading trả lời câu hỏi "gọi method nào" và do compiler quyết dựa trên kiểu khai báo. Overriding trả lời "chạy phiên bản nào của method đó" và do JVM quyết dựa trên object thật — đây chính là nền tảng của đa hình.',
  example:
    'Có một bug kinh điển: với `List<Integer> l`, lời gọi `l.remove(1)` thực ra chạy `remove(int index)` (overload) chứ không phải `remove(Object)`, nên nó xoá nhầm phần tử ở vị trí 1. Muốn xoá giá trị 1 thì phải viết `l.remove(Integer.valueOf(1))`. Đây đúng là overloading được phân giải lúc compile.',
  viz: {
    type: 'compare',
    cols: ['Overloading', 'Overriding'],
    rows: [
      ['Chữ ký', 'khác danh sách tham số', 'giống hệt lớp cha'],
      ['Phạm vi', 'cùng class / kế thừa', 'lớp con định nghĩa lại của lớp cha'],
      ['Phân giải', 'lúc biên dịch (kiểu tĩnh)', 'lúc chạy (kiểu thực của object)'],
      ['Cơ chế', 'static dispatch', 'dynamic dispatch (virtual method table)'],
    ],
  },
  demo: [
    {
      lang: "java",
      title: "Static dispatch theo kiểu khai báo, dynamic dispatch theo kiểu thực tế",
      code:
        "class Animal {\n" +
        "    void speak() { System.out.println(\"Animal\"); }\n" +
        "    static void info() { System.out.println(\"static Animal\"); }\n" +
        "}\n" +
        "class Dog extends Animal {\n" +
        "    @Override void speak() { System.out.println(\"Dog\"); }   // OVERRIDE\n" +
        "    static void info() { System.out.println(\"static Dog\"); }\n" +
        "}\n" +
        "\n" +
        "class Printer {\n" +
        "    void print(Object o) { System.out.println(\"Object\"); }  // OVERLOAD\n" +
        "    void print(String s) { System.out.println(\"String\"); }\n" +
        "}\n" +
        "\n" +
        "Animal a = new Dog();\n" +
        "a.speak();        // \"Dog\" — dynamic dispatch: chọn theo object THỰC TẾ lúc chạy\n" +
        "Animal.info();    // static method KHÔNG được override, chỉ bị che (hiding)\n" +
        "a.info();         // \"static Animal\" — chọn theo kiểu KHAI BÁO -> đừng viết kiểu này\n" +
        "\n" +
        "Object o = \"xin chào\";\n" +
        "new Printer().print(o);   // \"Object\", KHÔNG phải \"String\"!\n" +
        "// Overload được chốt lúc BIÊN DỊCH theo kiểu khai báo của biến (Object),\n" +
        "// runtime không chọn lại dù object thật là String.",
    },
  ],
},
{
  cat: 'Java Core & OOP',
  id: 'java-1ixi33r',
  q: 'Checked exception khác unchecked exception ở đâu, và khi nào nên dùng loại nào?',
  answer:
    'Cây kế thừa bắt đầu từ `Throwable`, chia thành `Error` (lỗi hệ thống, không nên catch) và `Exception`. Bản thân `Exception` lại tách thành `RuntimeException` cùng các lớp con của nó (**unchecked**) và toàn bộ phần còn lại (**checked**).\n' +
    '\n' +
    'Với **checked**, compiler bắt buộc bạn `catch` hoặc khai báo `throws`, như `IOException` và `SQLException`. Ý đồ của nhóm này là những lỗi có thể phục hồi và caller nên xử lý.\n' +
    '\n' +
    'Với **unchecked**, bạn không phải khai báo gì, như `NullPointerException`, `IllegalArgumentException` hay `IllegalStateException`. Ý đồ là những lỗi do lập trình sai hoặc những điều kiện không phục hồi được.\n' +
    '\n' +
    'Xu hướng hiện đại — Spring và nhiều framework khác — là ưu tiên unchecked để tránh cảnh `throws` lan truyền khắp nơi cùng đống boilerplate, rồi bọc checked exception thành runtime exception có nghĩa hơn.',
  essence:
    'Checked là "hợp đồng lỗi" được ghi thẳng vào chữ ký method, ép caller phải quyết định. Unchecked là loại lỗi mà ta không kỳ vọng caller xử lý ngay tại chỗ. Chọn loại nào là quyết định về thiết kế API chứ không thuần tuý kỹ thuật.',
  example:
    'Spring bọc `SQLException` (checked) thành `DataAccessException` (unchecked) với một cây con rõ nghĩa như `DuplicateKeyException` hay `DeadlockLoserDataAccessException`. Nhờ vậy tầng service không phải rải `try/catch SQLException` khắp nơi, và code cũng không bị khoá chặt vào JDBC.',
  viz: {
    type: 'tree',
    title: 'Cây Throwable',
    root: {
      label: 'Throwable',
      children: [
        { label: 'Error', note: 'lỗi hệ thống — không catch' },
        {
          label: 'Exception',
          children: [
            { label: 'RuntimeException + con', note: 'UNCHECKED — NPE, IllegalArgument/State; không bắt buộc khai báo' },
            { label: 'các Exception còn lại', note: 'CHECKED — IOException, SQLException; bắt buộc catch hoặc throws' },
          ],
        },
      ],
    },
  },
  demo: [
    {
      lang: "java",
      title: "Chọn loại exception và bọc lại cho đúng tầng",
      code:
        "// Unchecked (RuntimeException): lỗi do lập trình sai / vi phạm invariant.\n" +
        "// Không bắt buộc khai báo, và không nên bắt rồi nuốt.\n" +
        "public class InsufficientBalanceException extends RuntimeException {\n" +
        "    public InsufficientBalanceException(String accountId) {\n" +
        "        super(\"Tài khoản \" + accountId + \" không đủ số dư\");\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "// Checked: sự cố NGOẠI CẢNH mà caller có thể xử lý được (retry, fallback).\n" +
        "public class PaymentGatewayException extends Exception {\n" +
        "    public PaymentGatewayException(String msg, Throwable cause) {\n" +
        "        super(msg, cause);       // LUÔN giữ cause, đừng làm mất stack trace gốc\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "void charge(String id) throws PaymentGatewayException {\n" +
        "    try {\n" +
        "        gateway.call(id);\n" +
        "    } catch (IOException e) {\n" +
        "        // Bọc lại theo ngôn ngữ nghiệp vụ của tầng mình, giữ nguyên nguyên nhân\n" +
        "        throw new PaymentGatewayException(\"Gọi cổng thanh toán thất bại\", e);\n" +
        "    }\n" +
        "    // catch (Exception ignored) {}   <- anti-pattern tệ nhất: nuốt lỗi im lặng\n" +
        "}",
    },
  ],
},
{
  cat: 'Java Core & OOP',
  id: 'java-1cfgdaw',
  q: 'try-with-resources hoạt động thế nào, và hơn gì so với tự dọn tài nguyên trong `finally`?',
  answer:
    'Mọi object implements `AutoCloseable` (hoặc `Closeable`) mà bạn khai báo trong ngoặc `try (...)` đều được gọi `close()` tự động khi rời khỏi block, kể cả khi có exception hay `return`.\n' +
    '\n' +
    'Nếu khai báo nhiều resource, chúng được đóng theo **thứ tự ngược** với lúc khai báo. Trường hợp thân `try` ném exception mà `close()` cũng ném, exception của `close()` sẽ bị **suppressed** và gắn kèm vào exception chính (đọc qua `getSuppressed()`), nên lỗi gốc không bị che mất.\n' +
    '\n' +
    'So với `finally` viết tay, cách này giúp bạn khỏi phải kiểm tra null, khỏi lồng nhiều tầng `try/finally`, và không vô tình nuốt mất exception gốc mỗi khi `close()` lỗi.',
  essence:
    'Compiler sinh sẵn cho bạn một khối `finally` đúng chuẩn — null-safe, đóng ngược thứ tự, giữ lại suppressed exception — và nhờ đó xoá bỏ cả một lớp bug về tài nguyên.',
  example:
    'Với `try (var in = Files.newInputStream(p); var out = Files.newOutputStream(q)) { in.transferTo(out); }`, cả hai stream đều được đóng đúng cách. Nếu ổ đĩa đầy lúc ghi, `IOException` gốc vẫn hiện ra, còn lỗi phát sinh khi `close()` chỉ được đính kèm chứ không thay thế nó.',
  viz: {
    type: 'flow',
    title: 'Đóng resource theo thứ tự ngược',
    nodes: ['mở A', 'mở B', 'thân try', 'close B', 'close A'],
    steps: [
      { to: 0, label: 'mở resource A (AutoCloseable) trong try (...)' },
      { to: 1, label: 'mở resource B' },
      { to: 2, label: 'chạy thân try — có thể ném exception' },
      { to: 3, label: 'close B trước (ngược thứ tự khai báo)' },
      { to: 4, label: 'close A — lỗi khi close bị suppressed, không che lỗi gốc' },
    ],
  },
  demo: [
    {
      lang: "java",
      title: "try-with-resources vs finally thủ công",
      code:
        "// CÁCH CŨ: dài, dễ sai, và exception trong close() NUỐT MẤT exception gốc\n" +
        "InputStream in = null;\n" +
        "try {\n" +
        "    in = new FileInputStream(\"a.txt\");\n" +
        "    read(in);\n" +
        "} finally {\n" +
        "    if (in != null) in.close();   // nếu close() ném lỗi -> mất luôn lỗi của read()\n" +
        "}\n" +
        "\n" +
        "// CÁCH ĐÚNG: compiler tự sinh finally, đóng NGƯỢC thứ tự khai báo\n" +
        "try (InputStream in = new FileInputStream(\"a.txt\");\n" +
        "     OutputStream out = new FileOutputStream(\"b.txt\")) {   // out đóng trước, in đóng sau\n" +
        "    in.transferTo(out);\n" +
        "} catch (IOException e) {\n" +
        "    // Lỗi từ close() không biến mất mà được gắn kèm làm \"suppressed\"\n" +
        "    for (Throwable s : e.getSuppressed()) log.warn(\"lỗi khi đóng\", s);\n" +
        "}",
    },
    {
      lang: "java",
      title: "Điều kiện: resource phải implement AutoCloseable",
      code:
        "class Tx implements AutoCloseable {\n" +
        "    private boolean committed = false;\n" +
        "\n" +
        "    void commit() { committed = true; }\n" +
        "\n" +
        "    @Override\n" +
        "    public void close() {                 // close = dọn dẹp, không chỉ là \"đóng file\"\n" +
        "        if (!committed) rollback();       // chưa commit thì tự rollback\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "try (Tx tx = beginTransaction()) {\n" +
        "    repo.save(order);\n" +
        "    tx.commit();                          // không tới được dòng này -> rollback\n" +
        "}",
    },
  ],
},
{
  cat: 'Collections',
  id: 'java-1f1t11f',
  q: 'Iterator fail-fast khác fail-safe thế nào, và `ConcurrentModificationException` sinh ra từ đâu?',
  answer:
    'Iterator **fail-fast** — của `ArrayList`, `HashMap`… — theo dõi một biến đếm tên `modCount`. Nếu collection bị sửa cấu trúc giữa lúc duyệt mà không thông qua `iterator.remove()`, lần gọi `next()` kế tiếp sẽ thấy `modCount` lệch và ném `ConcurrentModificationException` ngay lập tức, kể cả khi chỉ có một thread duy nhất.\n' +
    '\n' +
    'Iterator **fail-safe** — của `CopyOnWriteArrayList`, `ConcurrentHashMap` — lại duyệt trên một bản snapshot hoặc một weakly-consistent view, nên nó không ném exception nhưng đổi lại có thể không thấy được thay đổi mới nhất.',
  essence:
    '`ConcurrentModificationException` là cơ chế phát hiện lỗi "sửa collection khi đang duyệt" chứ không phải một lỗi đa luồng thuần tuý. Cách sửa đúng là dùng `iterator.remove()`, `removeIf()`, hoặc gom thay đổi lại rồi áp dụng sau khi duyệt xong.',
  example:
    'Đoạn `for (Order o : orders) if (o.isExpired()) orders.remove(o);` sẽ ném CME. Hãy sửa thành `orders.removeIf(Order::isExpired)`. Còn nếu bạn thật sự cần xử lý song song trong lúc duyệt thì chuyển sang `ConcurrentHashMap` hoặc `CopyOnWriteArrayList`.',
  viz: {
    type: 'compare',
    cols: ['fail-fast', 'fail-safe'],
    rows: [
      ['Ví dụ', 'ArrayList, HashMap', 'CopyOnWriteArrayList, ConcurrentHashMap'],
      ['Cơ chế', 'theo dõi biến đếm modCount', 'duyệt snapshot / weakly-consistent view'],
      ['Khi sửa lúc duyệt', 'ném ConcurrentModificationException', 'không ném, có thể bỏ sót thay đổi mới'],
      ['Sửa đúng', 'iterator.remove(), removeIf()', '—'],
    ],
  },
  demo: [
    {
      lang: "java",
      title: "ConcurrentModificationException đến từ đâu và ba cách tránh",
      code:
        "List<String> list = new ArrayList<>(List.of(\"a\", \"b\", \"c\"));\n" +
        "\n" +
        "// SAI: sửa collection trong khi for-each đang duyệt\n" +
        "for (String s : list) {\n" +
        "    if (s.equals(\"b\")) list.remove(s);   // -> ConcurrentModificationException\n" +
        "}\n" +
        "// Cơ chế: ArrayList giữ biến đếm modCount. Iterator nhớ expectedModCount lúc tạo;\n" +
        "// mỗi lần next() nó so hai giá trị, lệch nhau là ném CME ngay (fail-FAST).\n" +
        "// Đây là cảnh báo lỗi lập trình, KHÔNG phải bảo đảm an toàn luồng.\n" +
        "\n" +
        "// Đúng 1: xoá qua chính iterator (nó tự cập nhật expectedModCount)\n" +
        "Iterator<String> it = list.iterator();\n" +
        "while (it.hasNext()) if (it.next().equals(\"b\")) it.remove();\n" +
        "\n" +
        "// Đúng 2: removeIf — ngắn gọn nhất\n" +
        "list.removeIf(s -> s.equals(\"b\"));\n" +
        "\n" +
        "// Đúng 3: collection fail-SAFE — duyệt trên bản snapshot, không bao giờ ném CME\n" +
        "List<String> safe = new CopyOnWriteArrayList<>(list);  // mỗi lần ghi là copy cả mảng\n" +
        "for (String s : safe) safe.remove(s);   // chạy được, nhưng vòng lặp thấy dữ liệu CŨ\n" +
        "// -> chỉ hợp khi đọc nhiều ghi rất ít (danh sách listener, config)",
    },
  ],
},
{
  cat: 'Generics',
  id: 'java-1lvyiqn',
  q: 'Type erasure là gì, và `? extends` khác `? super` thế nào (nguyên tắc PECS)?',
  answer:
    'Generics của Java chỉ tồn tại ở mức **compile-time**: sau khi biên dịch, thông tin kiểu bị **xoá** đi (erasure), nên `List<String>` và `List<Integer>` đều trở thành `List` ở runtime. Chính vì vậy bạn không viết được `new T[]`, `T.class` hay `instanceof List<String>`.\n' +
    '\n' +
    'Wildcard đi theo nguyên tắc **PECS — Producer Extends, Consumer Super**:\n' +
    '- `List<? extends Number>` chỉ để **đọc** (lấy ra `Number`), không add được gì ngoài null. Đây là nguồn cung cấp dữ liệu.\n' +
    '- `List<? super Integer>` chỉ để **ghi** (`add(Integer)`), còn đọc ra thì chỉ chắc chắn được kiểu `Object`. Đây là nơi nhận dữ liệu.',
  essence:
    'Erasure tồn tại để giữ tương thích ngược với code viết trước Java 5. Wildcard bù lại cho phép API vừa an toàn kiểu vừa linh hoạt: chọn `extends` hay `super` tuỳ theo method đang sản xuất hay tiêu thụ phần tử.',
  example:
    'Hãy nhìn `Collections.copy(List<? super T> dest, List<? extends T> src)`: `src` là producer vì ta đọc phần tử từ nó nên dùng `extends`, còn `dest` là consumer vì ta ghi phần tử vào nên dùng `super`. Nhờ cách khai báo này mà bạn copy được `List<Integer>` sang `List<Number>`.',
  viz: {
    type: 'compare',
    cols: ['? extends T — Producer', '? super T — Consumer'],
    rows: [
      ['Đọc ra', 'chắc chắn là T', 'chỉ chắc là Object'],
      ['Ghi vào', 'không (trừ null)', 'add(T) được'],
      ['Vai trò', 'nguồn cung cấp dữ liệu', 'nơi nhận dữ liệu'],
      ['Trong copy(dest, src)', 'src', 'dest'],
    ],
  },
  demo: [
    {
      lang: "java",
      title: "Những gì biến mất lúc chạy",
      code:
        "// Lúc chạy thông tin generic bị XOÁ: List<String> và List<Integer> cùng là List\n" +
        "List<String> a = new ArrayList<>();\n" +
        "List<Integer> b = new ArrayList<>();\n" +
        "System.out.println(a.getClass() == b.getClass());   // true\n" +
        "\n" +
        "// Hệ quả: những việc sau không làm được\n" +
        "// if (a instanceof List<String>) {}   // lỗi biên dịch\n" +
        "// new T[10];                          // không tạo được mảng generic\n" +
        "// class X<T> { static T field; }      // static không dùng được T\n" +
        "\n" +
        "// Cách lách khi thật sự cần kiểu lúc runtime: truyền Class<T> vào\n" +
        "static <T> T parse(String json, Class<T> type) { return mapper.readValue(json, type); }",
    },
    {
      lang: "java",
      title: "PECS — Producer Extends, Consumer Super",
      code:
        "// extends: chỉ ĐỌC ra (producer). Không add được vì không biết kiểu con cụ thể.\n" +
        "static double sum(List<? extends Number> src) {\n" +
        "    double s = 0;\n" +
        "    for (Number n : src) s += n.doubleValue();   // đọc: OK\n" +
        "    // src.add(1);                               // ghi: lỗi biên dịch\n" +
        "    return s;\n" +
        "}\n" +
        "\n" +
        "// super: chỉ GHI vào (consumer). Đọc ra thì chỉ chắc chắn được là Object.\n" +
        "static void fill(List<? super Integer> dst) {\n" +
        "    dst.add(1);                     // ghi: OK\n" +
        "    Object o = dst.get(0);          // đọc: chỉ được Object\n" +
        "}\n" +
        "\n" +
        "// Cả hai gặp nhau trong chữ ký chuẩn của thư viện:\n" +
        "// static <T> void copy(List<? super T> dst, List<? extends T> src)",
    },
  ],
},
{
  cat: 'Java 8+',
  id: 'java-x6nh74',
  q: 'Stream API lazy ở chỗ nào, intermediate khác terminal ra sao, và `map` khác `flatMap` thế nào?',
  answer:
    'Stream mô tả một **pipeline xử lý** đặt trên nguồn dữ liệu, bản thân nó không lưu dữ liệu.\n' +
    '\n' +
    '- Các phép **intermediate** như `filter`, `map`, `sorted`, `distinct` trả về một stream mới và hoàn toàn **lazy** — tới đây chưa có gì chạy cả.\n' +
    '- Các phép **terminal** như `collect`, `forEach`, `reduce`, `count`, `findFirst` mới kích hoạt pipeline, và chỉ chạy được **một lần**; sau đó stream không tái sử dụng được nữa.\n' +
    '\n' +
    'Nhờ lazy cộng với fusion, các phép được ghép lại và nguồn dữ liệu chỉ bị duyệt **một lần**; riêng `findFirst` và `limit` còn cho phép short-circuit.\n' +
    '\n' +
    'Về hai phép biến đổi: `map` biến một phần tử thành một phần tử, còn `flatMap` biến một phần tử thành một stream rồi **nối phẳng** tất cả lại — đây là cách để "mở" các collection lồng nhau.',
  essence:
    'Stream là một công thức xử lý chứ không phải dữ liệu, nên chưa có terminal thì chưa có gì được tính. Còn `flatMap` chính là `map` cộng thêm bước làm phẳng, dành cho quan hệ một-nhiều.',
  example:
    'Muốn lấy toàn bộ line-item của các đơn hàng, hãy viết `orders.stream().flatMap(o -> o.getItems().stream()).filter(i -> i.getQty() > 0).collect(toList())`. Nếu dùng `map` ở vị trí đó, kết quả sẽ là `Stream<List<Item>>` chứ không phải `Stream<Item>`.',
  viz: {
    type: 'flow',
    title: 'Không có terminal thì không tính toán',
    nodes: ['nguồn', 'filter (lazy)', 'map (lazy)', 'collect (terminal)'],
    steps: [
      { to: 2, label: 'xâu chuỗi các phép intermediate — chưa duyệt phần tử nào' },
      { to: 3, label: 'terminal kích hoạt: duyệt nguồn 1 lần, các phép được fusion; limit/findFirst → short-circuit' },
    ],
  },
  demo: [
    {
      lang: "java",
      title: "Lazy, short-circuit và map vs flatMap",
      code:
        "// Intermediate (map/filter/sorted) LƯỜI: chưa chạy gì tới khi có terminal\n" +
        "Stream<String> s = list.stream().peek(x -> System.out.println(\"thấy \" + x));\n" +
        "// ...tới đây vẫn chưa in ra gì cả\n" +
        "\n" +
        "// Terminal (collect/forEach/reduce/count) mới kích hoạt cả pipeline\n" +
        "List<String> out = s.filter(x -> x.length() > 3).collect(Collectors.toList());\n" +
        "\n" +
        "// Mỗi phần tử chạy HẾT chuỗi toán tử rồi mới tới phần tử sau (không phải xong\n" +
        "// từng tầng), nên findFirst/anyMatch/limit dừng sớm được:\n" +
        "Optional<String> first = Stream.of(\"a\", \"bb\", \"ccc\")\n" +
        "        .peek(x -> System.out.println(\"xét \" + x))\n" +
        "        .filter(x -> x.length() == 2)\n" +
        "        .findFirst();               // chỉ in \"xét a\", \"xét bb\" rồi dừng\n" +
        "\n" +
        "// map: 1 phần tử -> 1 phần tử\n" +
        "List<Integer> lens = words.stream().map(String::length).toList();\n" +
        "\n" +
        "// flatMap: 1 phần tử -> N phần tử, rồi LÀM PHẲNG một tầng\n" +
        "List<List<String>> nested = List.of(List.of(\"a\", \"b\"), List.of(\"c\"));\n" +
        "List<String> flat = nested.stream().flatMap(List::stream).toList();  // [a, b, c]\n" +
        "// map(List::stream) sẽ cho Stream<Stream<String>> — sai kiểu",
    },
  ],
},
{
  cat: 'Java 8+',
  id: 'java-ot9o23',
  q: 'Dùng `Optional` thế nào cho đúng, và đâu là những anti-pattern phổ biến?',
  answer:
    '`Optional<T>` là kiểu trả về diễn đạt ý "có thể không có giá trị", buộc caller phải xử lý trường hợp rỗng thay vì quên mất việc check null.\n' +
    '\n' +
    'Cách dùng đúng là trả về nó từ tầng dữ liệu, ví dụ `return repo.findById(id);` với kiểu `Optional<User>`, rồi phía gọi xử lý bằng `opt.map(...).orElseThrow(() -> new NotFoundException())` hoặc `.orElseGet(supplier)`.\n' +
    '\n' +
    'Còn đây là những anti-pattern hay gặp:\n' +
    '- Dùng `Optional` làm **field** hoặc **tham số method**, trong khi nó không `Serializable` và chỉ thêm rác.\n' +
    '- Gọi `opt.get()` mà không kiểm tra, dẫn tới `NoSuchElementException` — chẳng khá hơn NPE là bao.\n' +
    '- Viết `opt.isPresent()` rồi mới `opt.get()`, tức là quay về đúng kiểu null-check cũ.\n' +
    '- Bọc collection trong `Optional`, trong khi trả về một list rỗng vẫn tốt hơn `Optional<List>`.',
  essence:
    'Optional là công cụ thiết kế API ở **ranh giới giá trị trả về**, không phải thứ để thay thế mọi null trong hệ thống. Giá trị của nó nằm ở chỗ ép người gọi phải xử lý nhánh rỗng.',
  example:
    'Dòng `userRepo.findByEmail(email).map(User::getId).orElseThrow(() -> new BusinessException("Email chưa đăng ký"))` vừa gọn vừa không cho phép bạn quên nhánh "không tìm thấy", khác hẳn cách viết `user.getId()` luôn tiềm ẩn NPE.',
  viz: {
    type: 'flow',
    title: 'Optional ở ranh giới trả về',
    nodes: ['findByEmail(email)', 'Optional<User>', '.map(User::getId)', '.orElseThrow(...)'],
    steps: [
      { to: 1, label: 'repo trả Optional — không bao giờ trả null' },
      { to: 2, label: 'map: có giá trị thì biến đổi, rỗng thì giữ rỗng' },
      { to: 3, label: 'rỗng → ném BusinessException; không dùng get() trần, không isPresent()+get()' },
    ],
  },
  demo: [
    {
      lang: "java",
      title: "Dùng đúng chỗ, và bốn anti-pattern hay gặp",
      code:
        "// ĐÚNG: giá trị trả về của method có thể \"không tìm thấy\"\n" +
        "Optional<User> findByEmail(String email);\n" +
        "\n" +
        "String name = findByEmail(e)\n" +
        "        .map(User::name)                          // biến đổi khi có giá trị\n" +
        "        .filter(n -> !n.isBlank())\n" +
        "        .orElseGet(() -> loadDefaultName());      // lười: chỉ chạy khi rỗng\n" +
        "findByEmail(e).ifPresentOrElse(this::send, () -> log.warn(\"không có user\"));\n" +
        "User u = findByEmail(e).orElseThrow(() -> new UserNotFoundException(e));\n" +
        "\n" +
        "// ANTI-PATTERN 1: get() không kiểm tra — chỉ đổi NPE thành NoSuchElementException\n" +
        "String bad = findByEmail(e).get();\n" +
        "\n" +
        "// ANTI-PATTERN 2: if (o.isPresent()) o.get() — dài dòng hơn cả null check\n" +
        "if (findByEmail(e).isPresent()) { }\n" +
        "\n" +
        "// ANTI-PATTERN 3: orElse với biểu thức tốn kém — LUÔN được tính dù có giá trị\n" +
        "String eager = findByEmail(e).map(User::name).orElse(loadDefaultName()); // gọi thừa\n" +
        "// -> dùng orElseGet(...) như ở trên\n" +
        "\n" +
        "// ANTI-PATTERN 4: Optional làm field / tham số / phần tử collection\n" +
        "class User { private Optional<String> phone; }   // không Serializable, tốn bộ nhớ\n" +
        "// -> field cứ để null; chỉ bọc Optional ở ranh giới TRẢ VỀ",
    },
  ],
},
{
  cat: 'Java 8+',
  id: 'java-22uu33',
  q: 'Functional interface, lambda và method reference khác nhau thế nào?',
  answer:
    '**Functional interface** là interface có đúng **một** abstract method (viết tắt là SAM), bên cạnh đó vẫn được phép có default hoặc static method; đánh dấu `@FunctionalInterface` để compiler kiểm tra giúp. Quen thuộc nhất là `Runnable`, `Callable`, `Function<T,R>`, `Predicate<T>`, `Supplier<T>` và `Consumer<T>`.\n' +
    '\n' +
    '**Lambda** là biểu thức hiện thực chính cái SAM đó, chẳng hạn `(a, b) -> a + b`. Nó không phải anonymous class: compiler dịch nó thành `invokedynamic` cộng một method ẩn, nên không sinh file `$1.class` và cũng không tạo ra `this` mới — `this` bên trong lambda vẫn trỏ tới class bao ngoài.\n' +
    '\n' +
    '**Method reference** là cách viết rút gọn của những lambda chỉ gọi lại một method có sẵn: `User::getName` tương đương `u -> u.getName()`, tương tự có `System.out::println` hay `ArrayList::new`.',
  essence:
    'Functional interface đóng vai trò "kiểu" của một hành vi, còn lambda và method reference là hai cách viết ra giá trị hành vi đó. So với anonymous class, lambda nhẹ hơn cả về ngữ nghĩa `this` lẫn bytecode sinh ra.',
  example:
    'Bạn gặp chúng khắp nơi: `list.forEach(System.out::println)` hay `stream.map(String::trim).filter(s -> !s.isBlank())`. Trong Spring cũng vậy — `jdbcTemplate.query(sql, (rs, i) -> new User(rs.getLong("id"), rs.getString("name")))` viết được như thế vì `RowMapper` là một functional interface.',
  viz: {
    type: 'compare',
    cols: ['Functional interface', 'Lambda', 'Method reference'],
    rows: [
      ['Là gì', 'interface đúng 1 abstract method (SAM)', 'biểu thức hiện thực SAM đó', 'rút gọn lambda chỉ gọi 1 method'],
      ['Ví dụ', 'Function, Predicate, Runnable', '(a, b) -> a + b', 'User::getName, ArrayList::new'],
      ['Bytecode', '—', 'invokedynamic, không sinh $1.class', 'như lambda'],
      ['this', '—', 'trỏ class bao ngoài', 'trỏ class bao ngoài'],
    ],
  },
  demo: [
    {
      lang: "java",
      title: "Ba khái niệm và bốn dạng method reference",
      code:
        "// Functional interface = interface đúng MỘT abstract method\n" +
        "@FunctionalInterface                 // không bắt buộc, nhưng nên có: compiler sẽ\n" +
        "interface Validator<T> {             // báo lỗi nếu lỡ thêm abstract method thứ hai\n" +
        "    boolean test(T value);\n" +
        "    default Validator<T> and(Validator<T> other) {\n" +
        "        return v -> this.test(v) && other.test(v);\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "// Lambda = cách viết ngắn để tạo một instance của interface đó\n" +
        "Validator<String> notBlank = v -> v != null && !v.isBlank();\n" +
        "// Lambda KHÔNG sinh anonymous class: compiler dùng invokedynamic + LambdaMetafactory\n" +
        "// -> ít class file hơn, và `this` trong lambda là `this` của lớp bao ngoài\n" +
        "// (khác anonymous class, nơi `this` trỏ vào chính object ẩn danh).\n" +
        "\n" +
        "// 4 dạng method reference — chỉ là lambda viết gọn\n" +
        "Supplier<List<String>> ctor   = ArrayList::new;        // constructor\n" +
        "Function<String, Integer> stt = Integer::parseInt;     // static method\n" +
        "Function<String, String> inst = String::toUpperCase;   // instance method của tham số\n" +
        "Predicate<String> bound       = prefix::startsWith;    // instance method của object cụ thể\n" +
        "\n" +
        "// Biến bắt vào lambda phải \"effectively final\"\n" +
        "int count = 0;\n" +
        "Runnable r = () -> System.out.println(count);   // OK khi count không bị gán lại\n" +
        "// count++;   // thêm dòng này là lambda ở trên lỗi biên dịch",
    },
  ],
},
{
  cat: 'Java Core & OOP',
  id: 'java-fzjkh0',
  q: 'Java truyền tham số theo pass-by-value hay pass-by-reference?',
  answer:
    'Java **luôn pass-by-value**. Với primitive, cái value đó chính là giá trị. Với object, value là **bản sao của tham chiếu** — không phải bản sao object, cũng không phải chính biến gốc.\n' +
    '\n' +
    'Từ đó suy ra hai hệ quả:\n' +
    '- Gán lại tham số bên trong method (`param = new X()`) **không** ảnh hưởng gì tới biến ở caller.\n' +
    '- Nhưng gọi method làm thay đổi trạng thái object (`param.setName(...)`) thì **có** ảnh hưởng, vì cả hai reference cùng trỏ tới một object.\n' +
    '\n' +
    'Nhiều người nhầm đây là pass-by-reference chỉ vì thấy object bị sửa; thực chất nó là "pass reference by value".',
  essence:
    'Thứ được copy khi truyền tham số là ô nhớ chứa reference chứ không phải bản thân object. Vì vậy sửa xuyên qua reference thì caller thấy, còn thay hẳn reference thì caller không thấy.',
  example:
    'Với `void reset(User u) { u = new User(); }`, sau khi gọi xong biến ở ngoài vẫn nguyên. Nhưng với `void deactivate(User u) { u.setActive(false); }`, biến ở ngoài sẽ thấy `active=false`. Đây cũng chính là lý do bạn không viết được method `swap(a, b)` kiểu C trong Java.',
  viz: {
    type: 'compare',
    cols: ['param = new User()', 'param.setActive(false)'],
    rows: [
      ['Thao tác', 'gán lại tham số', 'sửa trạng thái qua reference'],
      ['Caller có thấy?', 'KHÔNG', 'CÓ'],
      ['Vì sao', 'chỉ đổi bản sao của reference', 'cả hai reference cùng trỏ 1 object trên heap'],
    ],
  },
  demo: [
    {
      lang: "java",
      title: "Java LUÔN pass-by-value — kể cả với object",
      code:
        "static void reassign(StringBuilder sb) {\n" +
        "    sb = new StringBuilder(\"mới\");     // chỉ đổi BẢN SAO của tham chiếu\n" +
        "}\n" +
        "static void mutate(StringBuilder sb) {\n" +
        "    sb.append(\" đã sửa\");              // sửa chính object mà tham chiếu trỏ tới\n" +
        "}\n" +
        "\n" +
        "StringBuilder s = new StringBuilder(\"gốc\");\n" +
        "reassign(s);\n" +
        "System.out.println(s);      // \"gốc\"         <- không đổi\n" +
        "mutate(s);\n" +
        "System.out.println(s);      // \"gốc đã sửa\"  <- có đổi\n" +
        "\n" +
        "// Giải thích: Java copy GIÁ TRỊ của biến khi truyền vào method.\n" +
        "// Với object, giá trị của biến chính là \"địa chỉ\" -> copy địa chỉ.\n" +
        "// Sửa object qua địa chỉ đó thì bên ngoài thấy; gán lại địa chỉ thì không.\n" +
        "// Nếu Java thật sự pass-by-reference thì reassign() đã đổi được s.\n" +
        "\n" +
        "int x = 1;\n" +
        "static void inc(int n) { n++; }   // n là bản sao hoàn toàn\n" +
        "inc(x);\n" +
        "System.out.println(x);      // 1",
    },
  ],
},
]);
