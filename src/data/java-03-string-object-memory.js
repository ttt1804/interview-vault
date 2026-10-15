SS.addQuestions('java', [
{
  cat: 'String / Object / Memory',
  id: 'java-edhwix',
  q: 'Tại sao String immutable?',
  answer:
    'Phần này rất quan trọng vì nó kiểm tra bạn có thực sự hiểu object, reference và bộ nhớ trong Java hay chỉ biết cú pháp. Và `String` là cửa vào.\n' +
    '\n' +
    '## 1. Immutable nghĩa là gì\n' +
    '\n' +
    'Sau khi một `String` object được tạo ra, nội dung bên trong nó **không thể thay đổi**.\n' +
    '\n' +
    '```java\n' +
    'String s = "Hello";\n' +
    's = s + " World";\n' +
    '```\n' +
    '\n' +
    'Nhiều người nghĩ object `"Hello"` đã được sửa thành `"Hello World"`. **Không phải.** Thực tế:\n' +
    '\n' +
    '```\n' +
    '"Hello"\n' +
    '   ^\n' +
    '   s\n' +
    '\n' +
    'sau  s = s + " World"\n' +
    '\n' +
    '"Hello"          "Hello World"\n' +
    '   ^                   ^\n' +
    'object cũ          object mới\n' +
    '                       ^\n' +
    '                       s\n' +
    '```\n' +
    '\n' +
    'Java tạo một `String` mới; object cũ vẫn nguyên vẹn và trở thành rác nếu không ai còn trỏ tới.\n' +
    '\n' +
    '## 2. Bốn lý do\n' +
    '\n' +
    '**Security.** `String` thường chứa `username`, `password`, `file path`, `URL`, `database connection string`. Nếu `String` có thể thay đổi sau khi được kiểm tra, sẽ phát sinh vấn đề — cụ thể là lỗ hổng **TOCTOU**: kiểm tra đường dẫn hợp lệ xong, kẻ tấn công sửa nội dung, rồi hệ thống mở đúng cái file khác.\n' +
    '\n' +
    '**String Pool.** Immutable giúp Java share cùng một `String` object:\n' +
    '\n' +
    '```java\n' +
    'String a = "Java";\n' +
    'String b = "Java";\n' +
    '```\n' +
    '\n' +
    '```\n' +
    '  String Pool\n' +
    '       |\n' +
    '       v\n' +
    '     "Java"\n' +
    '     ^     ^\n' +
    '     a     b\n' +
    '```\n' +
    '\n' +
    'Nếu `String` mutable, `a = "Python"` sẽ kéo theo `b` bị ảnh hưởng. Immutable giải quyết vấn đề này.\n' +
    '\n' +
    '**Thread safety.** Nhiều thread đọc cùng một `String` mà không thread nào thay đổi được nội dung:\n' +
    '\n' +
    '```\n' +
    'Thread A --+\n' +
    'Thread B --+--> "vu"\n' +
    'Thread C --+\n' +
    '```\n' +
    '\n' +
    'Không cần lock chỉ để đọc.\n' +
    '\n' +
    '**HashMap key.** `String` rất phù hợp làm key vì `hashCode()` không đổi sau khi object được tạo — đúng yêu cầu đã nói ở phần Collections. Java còn cache luôn giá trị hash trong một field, nên tính một lần rồi dùng mãi.\n' +
    '\n' +
    '## 3. Java làm điều đó bằng cách nào\n' +
    '\n' +
    '```\n' +
    'final class String              // không kế thừa để phá được\n' +
    'private final byte[] value      // mảng nội dung là private final\n' +
    'không có method nào sửa mảng    // mọi method đều trả về String mới\n' +
    '```\n' +
    '\n' +
    'Ba lớp bảo vệ, thiếu một là hỏng. Đặc biệt `final class` là cần thiết: nếu kế thừa được, ai đó có thể viết class con ghi đè `substring()` để trả về nội dung khác nhau mỗi lần gọi.\n' +
    '\n' +
    'Câu tiếp theo sẽ nói kỹ về String Pool — nơi tính immutable phát huy giá trị lớn nhất.',
  essence:
    'String immutable vì bốn lý do: an toàn khi dùng làm tham số nhạy cảm, cho phép chia sẻ object qua String Pool, đọc đa luồng không cần khoá, và giữ hashCode ổn định để làm key. Java đảm bảo điều đó bằng final class, mảng private final và không có method nào sửa nội dung.',
  example:
    'Nếu `String` mutable, một hàm kiểm tra quyền `checkAccess(path)` có thể bị qua mặt: kiểm tra xong `"/tmp/safe.txt"`, thread khác sửa nội dung thành `"/etc/passwd"`, rồi hàm mở file. Tính bất biến khiến toàn bộ lớp tấn công này không tồn tại.',
  viz: {
    type: 'layers',
    title: 'Ba lớp bảo vệ tính bất biến của String',
    layers: [
      { name: 'final class String', tag: 'không kế thừa được', note: 'ngăn class con ghi đè method để trả nội dung khác nhau' },
      { name: 'private final byte[] value', tag: 'mảng bị khoá', note: 'không ai bên ngoài lấy được tham chiếu tới mảng thật' },
      { name: 'mọi method trả String mới', tag: 'không sửa tại chỗ', note: 'substring, replace, toUpperCase đều tạo object mới' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Mọi method của String đều trả về object mới',
      code:
        'String s = "Hello";\n' +
        's.concat(" World");        // trả về String MỚI\n' +
        'System.out.println(s);     // "Hello"  <- s KHÔNG đổi\n' +
        '\n' +
        's = s.concat(" World");    // phải GÁN LẠI mới thấy thay đổi\n' +
        '\n' +
        '// Lỗi hay gặp: gọi method mà quên gán\n' +
        'String name = "  vu  ";\n' +
        'name.trim();               // vô nghĩa — kết quả bị vứt đi\n' +
        'name = name.trim();        // đúng\n' +
        '\n' +
        '// BA LỚP BẢO VỆ trong mã nguồn JDK:\n' +
        'public final class String {              // 1. final -> không kế thừa\n' +
        '    private final byte[] value;          // 2. mảng private final\n' +
        '    private int hash;                    //    hash được CACHE lại\n' +
        '    // 3. không method nào sửa value, tất cả trả về String mới\n' +
        '}\n' +
        '\n' +
        '// VÌ SAO CẦN final class: nếu kế thừa được thì\n' +
        'class EvilString extends String {        // (giả định)\n' +
        '    @Override public String substring(int b, int e) {\n' +
        '        return random() ? "/tmp/safe" : "/etc/passwd";   // đổi mỗi lần gọi\n' +
        '    }\n' +
        '}\n' +
        '// -> mọi kiểm tra bảo mật dựa trên String đều vô hiệu.\n' +
        '\n' +
        '// HỆ QUẢ CHO MẬT KHẨU: String nằm lại trong bộ nhớ tới khi GC dọn,\n' +
        '// bạn không xoá được nội dung. Vì vậy API mật khẩu dùng char[]:\n' +
        'char[] pwd = console.readPassword();\n' +
        'try { authenticate(pwd); }\n' +
        'finally { Arrays.fill(pwd, \'\\0\'); }     // XOÁ được ngay sau khi dùng',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-101fhab',
  q: 'String Pool là gì?',
  answer:
    'String Pool là một vùng quản lý các **String literal** có thể được JVM reuse. Nó tồn tại được chính là nhờ `String` immutable.\n' +
    '\n' +
    '## 1. Với literal\n' +
    '\n' +
    '```java\n' +
    'String a = "hello";\n' +
    'String b = "hello";\n' +
    '```\n' +
    '\n' +
    'Hai biến có thể cùng trỏ tới một object trong pool:\n' +
    '\n' +
    '```\n' +
    '  String Pool\n' +
    '       |\n' +
    '       v\n' +
    '    "hello"\n' +
    '    ^      ^\n' +
    '    a      b\n' +
    '```\n' +
    '\n' +
    'Do đó `a == b` có thể là `true`.\n' +
    '\n' +
    '## 2. Nhưng new String() thì sao\n' +
    '\n' +
    '```java\n' +
    'String a = "hello";\n' +
    'String b = new String("hello");\n' +
    '```\n' +
    '\n' +
    'Có thể hình dung:\n' +
    '\n' +
    '```\n' +
    'String Pool          Heap\n' +
    '    |                 |\n' +
    '    v                 v\n' +
    ' "hello"    new String("hello")\n' +
    '    ^                 ^\n' +
    '    a                 b\n' +
    '```\n' +
    '\n' +
    'Vì vậy:\n' +
    '\n' +
    '```\n' +
    'a == b        -> false\n' +
    'a.equals(b)   -> true\n' +
    '```\n' +
    '\n' +
    '## 3. Câu hỏi interviewer hay hỏi\n' +
    '\n' +
    '```java\n' +
    'String a = "Java";\n' +
    'String b = "Java";\n' +
    'System.out.println(a == b);      // true — literal đã được intern\n' +
    '\n' +
    'String c = new String("Java");\n' +
    'String d = new String("Java");\n' +
    'System.out.println(c == d);      // false\n' +
    '```\n' +
    '\n' +
    'Một biến thể khó hơn: nối chuỗi từ **hằng số** được compiler gộp ngay lúc biên dịch nên vẫn vào pool, còn nối từ **biến** thì tạo object mới lúc chạy.\n' +
    '\n' +
    '```java\n' +
    'String x = "Ja" + "va";          // compiler gộp -> "Java", cùng pool\n' +
    'String y = part + "va";          // tính lúc chạy -> object mới trên heap\n' +
    '```\n' +
    '\n' +
    '## 4. Vài điều nên biết thêm\n' +
    '\n' +
    'Từ Java 7, String Pool nằm trong **heap** chứ không còn ở PermGen — nhờ vậy nó được GC dọn và không còn gây `OutOfMemoryError: PermGen space` như trước.\n' +
    '\n' +
    'Method `intern()` cho phép đưa một chuỗi vào pool thủ công, nhưng hãy cẩn thận: pool là một bảng băm cố định kích thước, `intern()` hàng triệu chuỗi khác nhau sẽ làm nó thoái hoá.\n' +
    '\n' +
    'Và bài học thực dụng nhất: **đừng bao giờ dùng `==` để so sánh `String`**. Nó có thể đúng trong test rồi sai trên production, chỉ vì chuỗi ở production đến từ database chứ không phải từ literal.',
  essence:
    'String Pool cho phép các literal giống nhau dùng chung một object, nên == trả về true với literal nhưng false với new String(). Từ Java 7 pool nằm trong heap và được GC dọn — và bài học thực dụng là đừng bao giờ so sánh String bằng ==.',
  example:
    'Bug kinh điển: `if (status == "ACTIVE")` chạy đúng trong unit test vì cả hai đều là literal đã intern. Lên production, `status` đọc từ database nên là object mới trên heap, so sánh trả về `false`, và cả một nhánh nghiệp vụ im lặng không bao giờ chạy.',
  viz: {
    type: 'compare',
    cols: ['String literal', 'new String("...")'],
    rows: [
      ['Nằm ở đâu', 'String Pool', 'vùng heap thường'],
      ['Có tái sử dụng không', 'có — cùng nội dung dùng chung object', 'không — mỗi lần một object mới'],
      ['So sánh bằng ==', 'true nếu cùng nội dung', 'false'],
      ['So sánh bằng equals', 'true', 'true'],
      ['Khi nào nên dùng', 'gần như luôn luôn', 'gần như không bao giờ'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Pool, heap và bốn tình huống hay bị hỏi',
      code:
        'String a = "Java";\n' +
        'String b = "Java";\n' +
        'a == b;                       // true  — cùng object trong pool\n' +
        '\n' +
        'String c = new String("Java");\n' +
        'a == c;                       // false — c là object riêng trên heap\n' +
        'a.equals(c);                  // true  — nội dung giống nhau\n' +
        'a == c.intern();              // true  — intern() trả về object trong pool\n' +
        '\n' +
        '// NỐI CHUỖI: hằng số vs biến\n' +
        'String x = "Ja" + "va";       // compiler GỘP lúc biên dịch -> vào pool\n' +
        'a == x;                       // true\n' +
        '\n' +
        'String part = "Ja";\n' +
        'String y = part + "va";       // tính LÚC CHẠY -> object mới trên heap\n' +
        'a == y;                       // false !\n' +
        '\n' +
        'final String fpart = "Ja";    // final + gán hằng -> compiler gộp được\n' +
        'String z = fpart + "va";\n' +
        'a == z;                       // true\n' +
        '\n' +
        '// BUG KINH ĐIỂN TRÊN PRODUCTION:\n' +
        'if (status == "ACTIVE") { ... }\n' +
        '//   unit test : status = "ACTIVE" (literal)      -> true,  test XANH\n' +
        '//   production: status = rs.getString("status")  -> false, nhánh KHÔNG chạy\n' +
        '//   Không exception, không log — chỉ là nghiệp vụ im lặng bỏ qua.\n' +
        'if ("ACTIVE".equals(status)) { ... }    // đúng, và null-safe luôn\n' +
        '\n' +
        '// Từ Java 7 pool nằm trong HEAP (trước đó ở PermGen)\n' +
        '// -> được GC dọn, không còn OutOfMemoryError: PermGen space.\n' +
        '// Cẩn thận với intern(): pool là bảng băm kích thước cố định,\n' +
        '// intern hàng triệu chuỗi khác nhau sẽ làm nó thoái hoá.',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-1s2m73',
  q: 'String khác StringBuilder thế nào?',
  answer:
    'Hệ quả trực tiếp của tính bất biến: nối `String` trong vòng lặp là một trong những lỗi hiệu năng phổ biến nhất trong Java.\n' +
    '\n' +
    '## 1. String — immutable\n' +
    '\n' +
    '```java\n' +
    'String s = "A";\n' +
    's = s + "B";\n' +
    's = s + "C";\n' +
    '```\n' +
    '\n' +
    'Mỗi lần nối có thể tạo `String` mới:\n' +
    '\n' +
    '```\n' +
    '"A"\n' +
    ' |\n' +
    ' v\n' +
    '"AB"\n' +
    ' |\n' +
    ' v\n' +
    '"ABC"\n' +
    '```\n' +
    '\n' +
    'Nếu nối rất nhiều lần:\n' +
    '\n' +
    '```java\n' +
    'for (...) {\n' +
    '    s += value;\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'có thể tạo nhiều object và gây overhead. Tệ hơn: mỗi lần nối phải **copy lại toàn bộ** nội dung đã có, nên tổng chi phí là O(n²).\n' +
    '\n' +
    '## 2. StringBuilder — mutable\n' +
    '\n' +
    '```java\n' +
    'StringBuilder sb = new StringBuilder();\n' +
    'sb.append("A");\n' +
    'sb.append("B");\n' +
    'sb.append("C");\n' +
    '```\n' +
    '\n' +
    '```\n' +
    'StringBuilder\n' +
    '     |\n' +
    '     v\n' +
    'mutable buffer\n' +
    '[A][B][C]\n' +
    '```\n' +
    '\n' +
    'Không cần tạo `String` mới sau mỗi `append()`. Buffer chỉ được mở rộng khi đầy, giống cách `ArrayList` resize.\n' +
    '\n' +
    '## 3. Một hiểu lầm cần đính chính\n' +
    '\n' +
    'Nói "nối `String` bằng `+` luôn chậm" là **sai**. Với một biểu thức đơn:\n' +
    '\n' +
    '```java\n' +
    'String msg = "Xin chào " + name + ", bạn có " + n + " tin nhắn";\n' +
    '```\n' +
    '\n' +
    'compiler tự chuyển thành một `StringBuilder` duy nhất — thậm chí từ Java 9 là `invokedynamic` còn tối ưu hơn. Viết `+` ở đây vừa dễ đọc vừa nhanh.\n' +
    '\n' +
    'Vấn đề chỉ xuất hiện khi phép nối nằm **trong vòng lặp**: mỗi vòng tạo một `StringBuilder` mới rồi vứt đi.\n' +
    '\n' +
    '## 4. Quy tắc gọn\n' +
    '\n' +
    '```\n' +
    'Nối trong MỘT biểu thức     -> dùng +, compiler lo\n' +
    'Nối trong VÒNG LẶP          -> StringBuilder\n' +
    'Ghép collection             -> String.join hoặc Collectors.joining\n' +
    'Chuỗi có tham số            -> String.format hoặc text block\n' +
    '```\n' +
    '\n' +
    'Câu tiếp theo so sánh `StringBuilder` với người anh em cũ hơn của nó.',
  essence:
    'Nối String trong vòng lặp là O(n²) vì mỗi lần phải copy lại toàn bộ nội dung; StringBuilder dùng buffer mutable nên chỉ là O(n). Nhưng nối trong một biểu thức đơn thì compiler đã tự tối ưu — chỗ cần sửa chỉ là vòng lặp.',
  example:
    'Ghép 10.000 dòng CSV bằng `s += line` phải copy khoảng 50 triệu ký tự và tạo 10.000 object rác — mất vài giây. Cùng công việc đó với `StringBuilder` mất vài mili giây. Đây là tối ưu rẻ nhất mà bạn có thể làm cho một job xử lý văn bản.',
  demo: [
    {
      lang: 'java',
      title: 'Khi nào + là đủ, khi nào bắt buộc StringBuilder',
      code:
        '// ỔN — compiler tự dùng StringBuilder cho MỘT biểu thức\n' +
        'String msg = "Xin chào " + name + ", bạn có " + count + " tin nhắn";\n' +
        '// Java 9+ còn dùng invokedynamic (StringConcatFactory), tối ưu hơn nữa.\n' +
        '// Viết + ở đây vừa dễ đọc vừa nhanh — đừng "tối ưu" thành StringBuilder.\n' +
        '\n' +
        '// KHÔNG ỔN — trong VÒNG LẶP\n' +
        'String s = "";\n' +
        'for (String line : lines) {\n' +
        '    s += line + "\\n";      // mỗi vòng: tạo StringBuilder MỚI,\n' +
        '}                          // copy TOÀN BỘ s, rồi vứt đi\n' +
        '// 10.000 dòng x 5 ký tự -> copy ~50 TRIỆU ký tự  ->  O(n^2)\n' +
        '\n' +
        '// ĐÚNG\n' +
        'StringBuilder sb = new StringBuilder(lines.size() * 32);   // đặt trước capacity\n' +
        'for (String line : lines) {\n' +
        '    sb.append(line).append(\'\\n\');    // buffer mutable -> O(n)\n' +
        '}\n' +
        'String result = sb.toString();       // chỉ MỘT lần tạo String\n' +
        '\n' +
        '// GỌN HƠN cho các trường hợp thường gặp:\n' +
        'String.join("\\n", lines);\n' +
        'lines.stream().collect(Collectors.joining(", ", "[", "]"));\n' +
        'String.format("Xin chào %s, bạn có %d tin nhắn", name, count);\n' +
        '\n' +
        '// Chú ý append(\'\\n\') dùng CHAR nhanh hơn append("\\n") dùng String.',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-1drxna3',
  q: 'StringBuilder khác StringBuffer thế nào?',
  answer:
    'Cả hai đều mutable và có API gần như giống hệt nhau. Điểm khác biệt chính chỉ có một.\n' +
    '\n' +
    '## 1. Khác biệt\n' +
    '\n' +
    '```\n' +
    'StringBuilder\n' +
    '  -> không synchronized\n' +
    '\n' +
    'StringBuffer\n' +
    '  -> synchronized\n' +
    '```\n' +
    '\n' +
    '`StringBuilder` nhanh hơn trong môi trường single-thread thông thường:\n' +
    '\n' +
    '```java\n' +
    'StringBuilder sb = new StringBuilder();\n' +
    '```\n' +
    '\n' +
    '`StringBuffer` có synchronization:\n' +
    '\n' +
    '```java\n' +
    'StringBuffer sb = new StringBuffer();\n' +
    '```\n' +
    '\n' +
    'nên phù hợp hơn nếu thực sự cần shared mutable buffer giữa nhiều thread.\n' +
    '\n' +
    '## 2. Lịch sử\n' +
    '\n' +
    '`StringBuffer` có từ Java 1.0 và được `synchronized` theo tinh thần thời đó — cứ đồng bộ hoá cho an toàn. `StringBuilder` ra đời ở Java 5 chính là bản bỏ `synchronized` đi, vì người ta nhận ra 99% trường hợp buffer chỉ dùng trong một thread, một method.\n' +
    '\n' +
    '## 3. Vì sao StringBuffer gần như vô dụng\n' +
    '\n' +
    'Đây là ý đáng nói khi phỏng vấn: `StringBuffer` chỉ làm **từng lời gọi** an toàn, không làm cả chuỗi thao tác an toàn.\n' +
    '\n' +
    '```java\n' +
    'if (sb.length() > 0) {\n' +
    '    sb.append(x);          // giữa hai dòng, thread khác có thể chen vào\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Kết quả vẫn sai. Mà nếu đã phải tự khoá quanh cả khối thì `synchronized` bên trong `StringBuffer` chỉ còn là chi phí thừa.\n' +
    '\n' +
    'Nói cách khác: nếu thật sự cần chia sẻ buffer giữa các thread, `StringBuffer` cũng không đủ. Thiết kế đúng thường là mỗi thread có buffer riêng rồi ghép kết quả lại.\n' +
    '\n' +
    '## 4. Trong thực tế\n' +
    '\n' +
    'Backend Java hiện đại: **`StringBuilder` thường được ưu tiên**, trừ khi có yêu cầu concurrency cụ thể — mà yêu cầu đó gần như không bao giờ được đáp ứng đúng bằng `StringBuffer`.\n' +
    '\n' +
    'Bạn sẽ chỉ gặp `StringBuffer` trong code cũ hoặc trong một số API JDK lâu đời như `Matcher.appendReplacement`.',
  essence:
    'Hai class giống hệt nhau trừ việc StringBuffer synchronized còn StringBuilder thì không. Nhưng StringBuffer chỉ an toàn cho từng lời gọi chứ không cho chuỗi thao tác, nên nó gần như không giải quyết được vấn đề đa luồng thật — hãy luôn dùng StringBuilder.',
  example:
    'JIT thường loại bỏ được khoá của `StringBuffer` khi nhận ra object không thoát khỏi method (lock elision), nên khác biệt hiệu năng có khi không đo được. Lý do chọn `StringBuilder` vì thế không phải tốc độ, mà là biểu đạt đúng ý định: buffer này chỉ thuộc về một thread.',
  demo: [
    {
      lang: 'java',
      title: 'Vì sao synchronized của StringBuffer không cứu được gì',
      code:
        '// API giống hệt nhau, chỉ khác một từ khoá:\n' +
        'public synchronized StringBuffer  append(String s) { ... }   // StringBuffer\n' +
        'public              StringBuilder append(String s) { ... }   // StringBuilder\n' +
        '\n' +
        '// CẠM BẪY: từng lời gọi an toàn, CHUỖI lời gọi thì không\n' +
        'StringBuffer sb = new StringBuffer();\n' +
        '// Thread A và B cùng chạy:\n' +
        'if (sb.length() == 0) {      // (1) an toàn\n' +
        '    sb.append("header\\n");   // (2) an toàn\n' +
        '}                            // nhưng GIỮA (1) và (2) thread kia chen vào\n' +
        '                             // -> header bị ghi HAI lần\n' +
        '\n' +
        '// Muốn đúng thì vẫn phải tự khoá cả khối:\n' +
        'synchronized (sb) {\n' +
        '    if (sb.length() == 0) sb.append("header\\n");\n' +
        '}\n' +
        '// -> đã khoá ngoài rồi thì synchronized bên trong chỉ là chi phí THỪA.\n' +
        '\n' +
        '// THIẾT KẾ ĐÚNG khi nhiều thread cùng sinh văn bản:\n' +
        'String result = items.parallelStream()\n' +
        '    .map(this::render)            // mỗi thread có buffer RIÊNG\n' +
        '    .collect(Collectors.joining("\\n"));   // ghép lại ở cuối\n' +
        '\n' +
        '// Trong thực tế: LUÔN dùng StringBuilder.\n' +
        '// StringBuffer chỉ còn gặp trong code cũ và vài API JDK lâu đời\n' +
        '// như Matcher.appendReplacement(StringBuffer, String).',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-pc6h7a',
  q: '`==` khác `equals()` thế nào?',
  answer:
    'Đây là câu **rất hay bị hỏi**, và cũng là nguồn của rất nhiều bug thật.\n' +
    '\n' +
    '## 1. Toán tử ==\n' +
    '\n' +
    'Với object, `==` so sánh **reference** — hai biến có trỏ tới cùng một object hay không.\n' +
    '\n' +
    '```java\n' +
    'User a = new User();\n' +
    'User b = new User();\n' +
    'System.out.println(a == b);      // false\n' +
    '```\n' +
    '\n' +
    'Dù hai object có thể có dữ liệu giống hệt nhau.\n' +
    '\n' +
    '## 2. Method equals()\n' +
    '\n' +
    'So sánh **logical equality**, tuỳ class định nghĩa.\n' +
    '\n' +
    '```java\n' +
    'String a = new String("Java");\n' +
    'String b = new String("Java");\n' +
    'a.equals(b);                     // true\n' +
    '```\n' +
    '\n' +
    '## 3. Hình dung\n' +
    '\n' +
    '```\n' +
    'a ------> User #1\n' +
    'b ------> User #2\n' +
    '\n' +
    'a == b   -> false\n' +
    '```\n' +
    '\n' +
    'Nhưng nếu `User #1` và `User #2` có cùng dữ liệu và `equals()` được override phù hợp thì `a.equals(b)` trả `true`.\n' +
    '\n' +
    '## 4. Với primitive thì khác\n' +
    '\n' +
    'Với `int`, `long`, `double`… thì `==` so sánh **giá trị**, và đó là cách duy nhất — primitive không có method.\n' +
    '\n' +
    '```\n' +
    'primitive : ==  so sánh GIÁ TRỊ\n' +
    'object    : ==  so sánh ĐỊA CHỈ\n' +
    'object    : equals()  so sánh theo LUẬT của class\n' +
    '```\n' +
    '\n' +
    'Chính chỗ này sinh ra cạm bẫy lớn nhất: `Integer` là object, nên `==` trên nó so sánh địa chỉ — dẫn thẳng tới câu hỏi về Integer cache ở phần sau.\n' +
    '\n' +
    '## 5. Ba quy tắc thực hành\n' +
    '\n' +
    '- So sánh nội dung object: luôn dùng `equals()`.\n' +
    '- Đặt hằng số ở bên trái: `"ACTIVE".equals(status)` — an toàn với `null`.\n' +
    '- So sánh `enum`: dùng `==` là đúng và tốt hơn, vì mỗi hằng enum là một instance duy nhất, và `==` không ném `NullPointerException`.',
  essence:
    '== so sánh địa chỉ với object và so sánh giá trị với primitive; equals() so sánh theo luật của class. Vì Integer và String là object, dùng == trên chúng cho kết quả phụ thuộc vào cache và String Pool — nguồn của rất nhiều bug chỉ lộ ra trên production.',
  example:
    'Với `enum` thì ngược lại: `status == OrderStatus.PAID` vừa đúng vừa an toàn hơn `status.equals(...)`, vì mỗi hằng enum là instance duy nhất và toán tử `==` không nổ khi `status` là `null`.',
  viz: {
    type: 'compare',
    cols: ['==', 'equals()'],
    rows: [
      ['Với primitive', 'so sánh giá trị — cách duy nhất', 'không dùng được'],
      ['Với object', 'so sánh địa chỉ', 'so sánh theo luật của class'],
      ['Mặc định của Object', '—', 'chính là =='],
      ['Với null', 'an toàn', 'ném NullPointerException nếu vế trái null'],
      ['Với enum', 'nên dùng', 'không cần thiết'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Bốn tình huống và câu trả lời đúng cho từng cái',
      code:
        '// 1. OBJECT — == so sánh ĐỊA CHỈ\n' +
        'User a = new User("vu");\n' +
        'User b = new User("vu");\n' +
        'a == b;               // false — hai vùng nhớ khác nhau\n' +
        'a.equals(b);          // true NẾU User đã override equals()\n' +
        '                      // false nếu chưa — vì Object.equals() chính là ==\n' +
        '\n' +
        '// 2. PRIMITIVE — == so sánh GIÁ TRỊ, và là cách duy nhất\n' +
        'int x = 1000, y = 1000;\n' +
        'x == y;               // true\n' +
        '\n' +
        '// 3. WRAPPER — cạm bẫy vì nó là OBJECT\n' +
        'Integer p = 1000, q = 1000;\n' +
        'p == q;               // false !  (xem câu về Integer cache)\n' +
        'p.equals(q);          // true\n' +
        '\n' +
        '// 4. ENUM — dùng == là ĐÚNG và tốt hơn\n' +
        'if (status == OrderStatus.PAID) { }     // mỗi hằng enum là instance duy nhất\n' +
        'if (status.equals(OrderStatus.PAID)) { } // nổ NPE nếu status == null\n' +
        '\n' +
        '// QUY TẮC: đặt hằng số ở BÊN TRÁI để an toàn với null\n' +
        'status.equals("ACTIVE");     // NullPointerException nếu status null\n' +
        '"ACTIVE".equals(status);     // false, không nổ\n' +
        'Objects.equals(status, "ACTIVE");   // null-safe cả hai phía\n' +
        '\n' +
        '// Với số thực còn một bẫy riêng:\n' +
        '0.1 + 0.2 == 0.3;            // false ! sai số dấu phẩy động\n' +
        'Math.abs(0.1 + 0.2 - 0.3) < 1e-9;   // cách so sánh đúng\n' +
        '// Với tiền tệ: dùng BigDecimal, và so bằng compareTo() chứ không equals()\n' +
        '// vì new BigDecimal("1.0").equals(new BigDecimal("1.00")) là false.',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-1meksx3',
  q: '`final` có nghĩa gì?',
  answer:
    '`final` nghĩa là **không thể thay đổi** — nhưng "cái gì không đổi" thì phụ thuộc vào chỗ bạn đặt nó.\n' +
    '\n' +
    '## 1. final variable\n' +
    '\n' +
    '```java\n' +
    'final int x = 10;\n' +
    '```\n' +
    '\n' +
    'Không thể `x = 20;`.\n' +
    '\n' +
    '## 2. final method\n' +
    '\n' +
    '```java\n' +
    'class Parent {\n' +
    '    final void execute() {\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Subclass không được override method này. Đây là cách bảo vệ một khung xử lý — chính là mẫu Template Method: lớp cha giữ trình tự, lớp con chỉ điền các bước.\n' +
    '\n' +
    '## 3. final class\n' +
    '\n' +
    '```java\n' +
    'final class User {\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Không thể `class Admin extends User`. `String`, `Integer` và mọi wrapper đều là `final` vì lý do đã nói ở câu về tính bất biến.\n' +
    '\n' +
    '## 4. Điều quan trọng nhất: final reference ≠ immutable object\n' +
    '\n' +
    'Đây là chỗ sai phổ biến nhất.\n' +
    '\n' +
    '```java\n' +
    'final List<String> list = new ArrayList<>();\n' +
    'list.add("Java");\n' +
    '```\n' +
    '\n' +
    'Điều này **vẫn hợp lệ**. Vì:\n' +
    '\n' +
    '```\n' +
    'final\n' +
    '  |\n' +
    '  v\n' +
    'reference không được trỏ sang object khác\n' +
    '```\n' +
    '\n' +
    'chứ không có nghĩa:\n' +
    '\n' +
    '```\n' +
    'object không thể thay đổi\n' +
    '```\n' +
    '\n' +
    'Hình dung:\n' +
    '\n' +
    '```\n' +
    'list ---------> ArrayList\n' +
    '  ^                 ^\n' +
    'reference final   nội dung VẪN đổi được\n' +
    '```\n' +
    '\n' +
    'Không được `list = new ArrayList<>();` nhưng vẫn được `list.add("Java");`.\n' +
    '\n' +
    '## 5. Muốn thật sự bất biến thì làm gì\n' +
    '\n' +
    '```java\n' +
    'private final List<String> items = List.copyOf(input);   // bản sao, không sửa được\n' +
    '```\n' +
    '\n' +
    'Chú ý phân biệt: `List.of(...)` và `List.copyOf(...)` tạo collection **thật sự** bất biến, còn `Collections.unmodifiableList(x)` chỉ là một lớp bọc — nếu ai đó còn giữ tham chiếu tới `x` gốc thì họ vẫn sửa được, và bản bọc phản ánh thay đổi đó.\n' +
    '\n' +
    'Ngoài ra `final` còn một vai trò ít được nhắc: field `final` có **đảm bảo về bộ nhớ** trong mô hình đa luồng — sau khi constructor kết thúc, mọi thread đều thấy giá trị đã gán, không cần đồng bộ hoá.',
  essence:
    'final khoá biến, method hoặc class tuỳ chỗ đặt, nhưng với biến tham chiếu nó chỉ khoá cái tham chiếu chứ không khoá object. Muốn bất biến thật thì phải dùng collection bất biến, và nhớ rằng unmodifiableList chỉ là lớp bọc chứ không phải bản sao.',
  example:
    'Trong cấu hình Spring, `private final List<Handler> handlers` chỉ đảm bảo không ai gán lại danh sách khác. Nếu bạn nhận danh sách từ ngoài rồi giữ nguyên tham chiếu, người gọi vẫn thêm bớt được phần tử phía sau lưng bạn — `List.copyOf` giải quyết chuyện đó.',
  viz: {
    type: 'compare',
    cols: ['final reference', 'immutable object'],
    rows: [
      ['Cấm điều gì', 'trỏ biến sang object khác', 'thay đổi nội dung bên trong'],
      ['`list = new ArrayList<>()`', 'lỗi biên dịch', '—'],
      ['`list.add("x")`', 'vẫn chạy được', 'ném UnsupportedOperationException'],
      ['Cách đạt được', 'từ khoá final', 'List.of / List.copyOf / record'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'final khoá tham chiếu, không khoá nội dung',
      code:
        'final List<String> list = new ArrayList<>();\n' +
        'list.add("Java");        // HỢP LỆ — nội dung vẫn đổi được\n' +
        'list.clear();            // HỢP LỆ\n' +
        'list = new ArrayList<>(); // LỖI BIÊN DỊCH — chỉ tham chiếu bị khoá\n' +
        '\n' +
        '// MUỐN BẤT BIẾN THẬT — và phân biệt ba mức:\n' +
        'var source = new ArrayList<>(List.of("a", "b"));\n' +
        '\n' +
        'List<String> view = Collections.unmodifiableList(source);   // chỉ là LỚP BỌC\n' +
        'view.add("c");           // UnsupportedOperationException\n' +
        'source.add("c");         // nhưng ĐƯỢC — và view.size() giờ là 3 !\n' +
        '\n' +
        'List<String> copy = List.copyOf(source);   // BẢN SAO thật sự\n' +
        'source.add("d");                            // copy KHÔNG đổi\n' +
        '\n' +
        '// Vì vậy trong constructor, đừng giữ nguyên tham chiếu từ ngoài:\n' +
        'class Config {\n' +
        '    private final List<String> hosts;\n' +
        '    Config(List<String> hosts) {\n' +
        '        this.hosts = List.copyOf(hosts);    // người gọi không sửa được nữa\n' +
        '    }\n' +
        '    public List<String> hosts() { return hosts; }   // trả ra cũng an toàn\n' +
        '}\n' +
        '\n' +
        '// VAI TRÒ ÍT ĐƯỢC NHẮC: final field có ĐẢM BẢO VỀ BỘ NHỚ.\n' +
        '// Sau khi constructor kết thúc, mọi thread đều thấy giá trị đã gán\n' +
        '// mà không cần synchronized hay volatile (final field freeze).\n' +
        '// Với field không final, thread khác có thể thấy giá trị mặc định.',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-1ca1eky',
  q: '`final`, `finally` và `finalize()` khác nhau thế nào?',
  answer:
    'Ba khái niệm hoàn toàn khác nhau, chỉ giống nhau ở mấy chữ cái đầu. Câu này thường dùng để kiểm tra bạn có đọc kỹ hay chỉ nhớ mang máng.\n' +
    '\n' +
    '## 1. final\n' +
    '\n' +
    'Là **keyword**:\n' +
    '\n' +
    '```java\n' +
    'final int x = 10;\n' +
    '```\n' +
    '\n' +
    'Khoá biến, method hoặc class — như câu trước đã nói.\n' +
    '\n' +
    '## 2. finally\n' +
    '\n' +
    'Là **block** thường dùng trong exception handling:\n' +
    '\n' +
    '```java\n' +
    'try {\n' +
    '    ...\n' +
    '} catch (Exception e) {\n' +
    '    ...\n' +
    '} finally {\n' +
    '    ...\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '`finally` thường được dùng để cleanup resource, và nó chạy **kể cả khi có `return`** trong `try`.\n' +
    '\n' +
    'Tuy nhiên với resource hiện đại nên ưu tiên **try-with-resources**:\n' +
    '\n' +
    '```java\n' +
    'try (InputStream in = ...) {\n' +
    '    ...\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Nó tự đóng theo thứ tự ngược, và giữ được exception gốc thay vì để exception lúc đóng che mất.\n' +
    '\n' +
    '## 3. finalize()\n' +
    '\n' +
    'Đây là cơ chế cũ liên quan tới GC, **đã bị deprecated và không nên sử dụng** trong code hiện đại. Nó bị bỏ vì:\n' +
    '\n' +
    '- Không có gì đảm bảo nó được gọi, cũng không biết bao giờ\n' +
    '- Nó làm chậm quá trình thu hồi object\n' +
    '- Exception ném ra trong đó bị nuốt im lặng\n' +
    '\n' +
    'Không nên dựa vào `finalize()` để cleanup resource. Từ Java 18 nó bị deprecated for removal, và Java 21 đã tắt mặc định.\n' +
    '\n' +
    '## 4. Một cạm bẫy của finally\n' +
    '\n' +
    'Đừng `return` bên trong `finally`. Nó **nuốt mất** cả giá trị trả về lẫn exception đang được ném:\n' +
    '\n' +
    '```java\n' +
    'try {\n' +
    '    throw new RuntimeException("lỗi thật");\n' +
    '} finally {\n' +
    '    return "ok";      // exception BIẾN MẤT hoàn toàn\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Hàm trả về `"ok"` như thể mọi chuyện bình thường. Đây là một trong những cách giấu lỗi hiệu quả nhất — và tệ nhất.',
  essence:
    'final là từ khoá khoá biến/method/class, finally là block luôn chạy để dọn dẹp, finalize() là cơ chế GC cũ đã bị loại bỏ. Cạm bẫy đáng nhớ nhất: return bên trong finally sẽ nuốt mất exception đang được ném.',
  example:
    'Thay vì `finally { conn.close(); }` — vốn có thể ném exception mới và che mất lỗi gốc — hãy dùng `try (var conn = ds.getConnection())`. Java sẽ đóng tự động và gắn lỗi lúc đóng vào phần *suppressed* của exception gốc, nên bạn không mất thông tin nào.',
  demo: [
    {
      lang: 'java',
      title: 'Ba khái niệm và cạm bẫy return trong finally',
      code:
        '// 1. final — TỪ KHOÁ\n' +
        'final int max = 100;\n' +
        '\n' +
        '// 2. finally — BLOCK, luôn chạy kể cả khi try có return\n' +
        'int f() {\n' +
        '    try { return 1; }\n' +
        '    finally { System.out.println("vẫn chạy"); }   // in ra TRƯỚC khi trả về 1\n' +
        '}\n' +
        '\n' +
        '// CẠM BẪY: return trong finally NUỐT exception\n' +
        'String bad() {\n' +
        '    try { throw new RuntimeException("lỗi thật"); }\n' +
        '    finally { return "ok"; }      // exception BIẾN MẤT, hàm trả "ok"\n' +
        '}\n' +
        '// Không log, không stack trace — cách giấu lỗi hiệu quả nhất và tệ nhất.\n' +
        '\n' +
        '// 3. finalize() — cơ chế GC cũ, ĐỪNG DÙNG\n' +
        '@Override protected void finalize() { file.close(); }   // deprecated\n' +
        '// Vì: không đảm bảo được gọi, không biết bao giờ, làm chậm thu hồi\n' +
        '// object, và exception ném ra bị nuốt im lặng.\n' +
        '// Java 18 deprecated for removal, Java 21 tắt mặc định.\n' +
        '\n' +
        '// CÁCH ĐÚNG HÔM NAY — try-with-resources\n' +
        'try (var conn = ds.getConnection();\n' +
        '     var ps   = conn.prepareStatement(sql)) {     // đóng theo thứ tự NGƯỢC\n' +
        '    ps.execute();\n' +
        '}\n' +
        '// Nếu cả thân try lẫn lúc close đều ném lỗi:\n' +
        '//   finally thủ công -> lỗi lúc close CHE MẤT lỗi gốc\n' +
        '//   try-with-resources -> giữ lỗi gốc, lỗi close vào getSuppressed()\n' +
        '\n' +
        '// Cần dọn dẹp gắn với vòng đời object: dùng java.lang.ref.Cleaner',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-17dunwj',
  q: 'Wrapper class là gì?',
  answer:
    'Wrapper class là **object representation** của primitive type. Java có tám primitive và tám wrapper tương ứng.\n' +
    '\n' +
    '## 1. Bảng đối chiếu\n' +
    '\n' +
    '| Primitive | Wrapper |\n' +
    '| --- | --- |\n' +
    '| `int` | `Integer` |\n' +
    '| `long` | `Long` |\n' +
    '| `double` | `Double` |\n' +
    '| `float` | `Float` |\n' +
    '| `boolean` | `Boolean` |\n' +
    '| `char` | `Character` |\n' +
    '| `byte` | `Byte` |\n' +
    '| `short` | `Short` |\n' +
    '\n' +
    '```java\n' +
    'int x = 10;\n' +
    'Integer y = 10;\n' +
    '```\n' +
    '\n' +
    '## 2. Tại sao cần wrapper\n' +
    '\n' +
    'Một số API và collection yêu cầu object:\n' +
    '\n' +
    '```java\n' +
    'List<Integer> numbers;\n' +
    '```\n' +
    '\n' +
    'Không thể viết `List<int>` — generic trong Java chỉ làm việc với kiểu tham chiếu.\n' +
    '\n' +
    'Ngoài ra wrapper cung cấp các method tiện ích:\n' +
    '\n' +
    '```java\n' +
    'Integer.parseInt("100");\n' +
    'Integer.max(10, 20);\n' +
    '```\n' +
    '\n' +
    'Và một khác biệt quan trọng về ngữ nghĩa: **wrapper có thể `null`, primitive thì không**. Đó là lý do entity JPA nên dùng `Integer` chứ không phải `int` cho cột cho phép `NULL` — với `int`, giá trị `NULL` trong database sẽ thành `0` và bạn không phân biệt được "không có" với "bằng không".\n' +
    '\n' +
    '## 3. Cái giá\n' +
    '\n' +
    'Một `int` chiếm 4 byte. Một `Integer` chiếm khoảng 16 byte cộng thêm 4–8 byte cho tham chiếu trỏ tới nó — gấp khoảng 5 lần. Với `List<Integer>` một triệu phần tử, khác biệt là vài chục megabyte và một triệu object cho GC phải quét.\n' +
    '\n' +
    'Vì vậy trong vòng lặp nóng hãy dùng `IntStream` thay vì `Stream<Integer>`, và `int[]` thay vì `List<Integer>`.\n' +
    '\n' +
    '## 4. Quy tắc chọn\n' +
    '\n' +
    '```\n' +
    'Có thể vắng giá trị?        -> wrapper (Integer)\n' +
    'Phải bỏ vào collection?     -> wrapper (bắt buộc)\n' +
    'Còn lại, nhất là tính toán  -> primitive (int)\n' +
    '```\n' +
    '\n' +
    'Câu tiếp theo nói về cơ chế chuyển đổi qua lại giữa hai thế giới này.',
  essence:
    'Wrapper là phiên bản object của primitive, cần thiết vì generic và collection chỉ làm việc với kiểu tham chiếu. Khác biệt ngữ nghĩa quan trọng nhất là wrapper có thể null; cái giá là tốn khoảng năm lần bộ nhớ và tạo áp lực cho GC.',
  example:
    'Một entity JPA có cột `discount_percent` cho phép `NULL`. Nếu khai là `int`, Hibernate đưa `NULL` thành `0` và hệ thống hiểu nhầm thành "giảm giá 0%" thay vì "chưa thiết lập". Khai là `Integer` giữ đúng ngữ nghĩa.',
  demo: [
    {
      lang: 'java',
      title: 'Khi nào wrapper, khi nào primitive',
      code:
        '// BẮT BUỘC wrapper: generic không nhận primitive\n' +
        'List<Integer> nums = new ArrayList<>();\n' +
        '// List<int> -> lỗi biên dịch\n' +
        'Map<String, Long> counts = new HashMap<>();\n' +
        '\n' +
        '// KHÁC BIỆT NGỮ NGHĨA: wrapper có thể null\n' +
        '@Entity class Product {\n' +
        '    private int discountPercent;       // SAI: NULL trong DB -> 0\n' +
        '                                       // không phân biệt "chưa đặt" với "0%"\n' +
        '    private Integer discountPercent2;  // ĐÚNG: null nghĩa là chưa thiết lập\n' +
        '}\n' +
        '\n' +
        '// CÁI GIÁ BỘ NHỚ (JVM 64-bit):\n' +
        '//   int      : 4 byte\n' +
        '//   Integer  : ~16 byte object + 4-8 byte tham chiếu = gấp ~5 lần\n' +
        '// List<Integer> 1 triệu phần tử: ~20MB và 1 TRIỆU object cho GC quét\n' +
        '// int[]        1 triệu phần tử: ~4MB và MỘT object\n' +
        '\n' +
        '// TRONG VÒNG LẶP NÓNG — dùng chuyên biệt cho primitive:\n' +
        'IntStream.range(0, n).sum();                    // không boxing\n' +
        'Stream.iterate(0, i -> i + 1).limit(n)          // boxing MỖI phần tử\n' +
        '      .mapToInt(Integer::intValue).sum();\n' +
        '\n' +
        '// Cũng vì vậy JDK có sẵn các biến thể chuyên biệt:\n' +
        '//   IntStream, LongStream, DoubleStream\n' +
        '//   IntPredicate, ToIntFunction, IntBinaryOperator\n' +
        '//   OptionalInt, OptionalLong\n' +
        '\n' +
        '// Method tiện ích nằm ở wrapper:\n' +
        'Integer.parseInt("100");\n' +
        'Integer.MAX_VALUE;\n' +
        'Integer.toBinaryString(10);      // "1010"\n' +
        'Integer.compare(a, b);           // KHÔNG dùng a - b (tràn số)',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-hvij1e',
  q: 'Autoboxing và Unboxing là gì?',
  answer:
    'Java tự chuyển đổi qua lại giữa primitive và wrapper. Tiện, nhưng chính sự tiện lợi này giấu đi hai vấn đề thật.\n' +
    '\n' +
    '## 1. Autoboxing\n' +
    '\n' +
    'Primitive chuyển sang wrapper một cách tự động.\n' +
    '\n' +
    '```java\n' +
    'int x = 10;\n' +
    'Integer y = x;\n' +
    '```\n' +
    '\n' +
    'Java tự động chuyển `int` thành `Integer` — thực chất là gọi `Integer.valueOf(x)`.\n' +
    '\n' +
    '## 2. Unboxing\n' +
    '\n' +
    'Wrapper chuyển về primitive.\n' +
    '\n' +
    '```java\n' +
    'Integer x = 10;\n' +
    'int y = x;\n' +
    '```\n' +
    '\n' +
    'Thực chất là gọi `x.intValue()`.\n' +
    '\n' +
    '## 3. Ví dụ nguy hiểm\n' +
    '\n' +
    '```java\n' +
    'Integer value = null;\n' +
    'int x = value;\n' +
    '```\n' +
    '\n' +
    'Có thể xảy ra `NullPointerException`, vì Java phải unbox bằng `value.intValue()` nhưng `value == null`.\n' +
    '\n' +
    'Điều khó chịu là dòng code trông hoàn toàn vô hại — không có dấu `.` nào để bạn nghi ngờ. Trường hợp hay gặp nhất là:\n' +
    '\n' +
    '```java\n' +
    'int total = map.get("missing-key");      // get trả null -> NPE\n' +
    'if (booleanWrapper) { ... }              // null -> NPE\n' +
    '```\n' +
    '\n' +
    '## 4. Vấn đề thứ hai: hiệu năng\n' +
    '\n' +
    '```java\n' +
    'Long sum = 0L;\n' +
    'for (long i = 0; i < 1_000_000; i++) {\n' +
    '    sum += i;                            // unbox, cộng, box lại\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Vòng lặp này tạo một triệu object `Long` rồi vứt đi ngay. Chỉ cần đổi khai báo thành `long sum` là nhanh hơn hàng chục lần. Đây là một lỗi rất khó thấy khi đọc code.\n' +
    '\n' +
    '## 5. Vì vậy\n' +
    '\n' +
    'Đừng quên: `Integer != int`. **Wrapper có thể `null`, primitive thì không.**\n' +
    '\n' +
    'Và cạm bẫy thứ ba — so sánh wrapper bằng `==` — là nội dung của câu ngay sau đây.',
  essence:
    'Autoboxing gọi valueOf, unboxing gọi intValue, và cả hai đều vô hình trong code. Hệ quả là NullPointerException từ những dòng trông hoàn toàn vô hại, cùng với vòng lặp tạo hàng triệu object rác chỉ vì một chữ hoa trong tên kiểu.',
  example:
    'Dòng `int count = countByStatus.get(status);` sẽ ném `NullPointerException` khi trạng thái đó chưa có trong map — vì `get` trả `null` rồi Java unbox nó. Dùng `getOrDefault(status, 0)` là xong, nhưng phải biết cạm bẫy mới nghĩ tới.',
  viz: {
    type: 'flow',
    title: 'Điều gì thật sự xảy ra khi autobox / unbox',
    nodes: ['Integer y = x;', 'Integer.valueOf(x)', 'int z = y;', 'y.intValue()'],
    steps: [
      { to: 1, label: 'bạn viết Integer y = x; compiler chèn ngầm Integer.valueOf(x) — có thể lấy object có sẵn từ cache [-128, 127]' },
      { to: 3, label: 'chiều ngược lại: int z = y; compiler chèn ngầm y.intValue()' },
      { to: 3, label: 'chính lời gọi ngầm này ném NullPointerException khi y là null — dòng code không hề có dấu chấm nào để bạn nghi ngờ' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'NullPointerException từ dòng code trông vô hại',
      code:
        '// Compiler chèn ngầm hai lời gọi này:\n' +
        'Integer y = 10;      // thực chất: Integer.valueOf(10)\n' +
        'int z = y;           // thực chất: y.intValue()\n' +
        '\n' +
        '// BẪY 1 — NPE mà không có dấu chấm nào để nghi ngờ\n' +
        'Map<String, Integer> counts = new HashMap<>();\n' +
        'int total = counts.get("chua-co");      // get trả null -> NPE khi unbox\n' +
        'int safe  = counts.getOrDefault("chua-co", 0);   // đúng\n' +
        '\n' +
        'Boolean flag = config.get("enabled");   // null nếu chưa cấu hình\n' +
        'if (flag) { }                           // NPE! phải viết Boolean.TRUE.equals(flag)\n' +
        '\n' +
        '// Cả toán tử ba ngôi cũng unbox ngầm:\n' +
        'Integer a = null;\n' +
        'Integer r = cond ? a : 0;               // NPE! vì có 0 (int) nên cả\n' +
        '                                        // biểu thức bị unbox về int\n' +
        '\n' +
        '// BẪY 2 — hiệu năng: một chữ HOA làm chậm hàng chục lần\n' +
        'Long sum = 0L;                          // WRAPPER\n' +
        'for (long i = 0; i < 1_000_000; i++) {\n' +
        '    sum += i;      // unbox -> cộng -> Long.valueOf() -> 1 TRIỆU object rác\n' +
        '}\n' +
        '\n' +
        'long sum2 = 0L;                         // PRIMITIVE\n' +
        'for (long i = 0; i < 1_000_000; i++) sum2 += i;   // 0 object, nhanh hơn ~20 lần\n' +
        '\n' +
        '// Lỗi này KHÔNG có exception, không có cảnh báo — chỉ chậm.\n' +
        '// Cách phát hiện: bật cảnh báo autoboxing của IDE trong vòng lặp.',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-r4b432',
  q: 'Integer cache là gì?',
  answer:
    'Đây là câu rất hay dùng để test xem bạn có thực sự hiểu `==` hay không. Nó gộp cả ba chủ đề trước: `==` với object, wrapper, và autoboxing.\n' +
    '\n' +
    '## 1. Hiện tượng\n' +
    '\n' +
    '```java\n' +
    'Integer a = 100;\n' +
    'Integer b = 100;\n' +
    'System.out.println(a == b);\n' +
    '```\n' +
    '\n' +
    'Thông thường in ra `true`, vì Java có **Integer cache** cho một range giá trị nhỏ, với range mặc định phổ biến là:\n' +
    '\n' +
    '```\n' +
    '-128 -> 127\n' +
    '```\n' +
    '\n' +
    'Hai biến cùng reference tới cached object.\n' +
    '\n' +
    'Nhưng:\n' +
    '\n' +
    '```java\n' +
    'Integer a = 1000;\n' +
    'Integer b = 1000;\n' +
    'System.out.println(a == b);\n' +
    '```\n' +
    '\n' +
    'thường in ra `false`, vì không nhất thiết cùng object.\n' +
    '\n' +
    '## 2. Vì sao có cache này\n' +
    '\n' +
    '`Integer.valueOf()` — hàm mà autoboxing gọi — kiểm tra xem giá trị có nằm trong khoảng cache không. Nếu có thì trả về object đã dựng sẵn, nếu không thì `new Integer(...)`.\n' +
    '\n' +
    'Lý do: các giá trị nhỏ được dùng cực kỳ nhiều (chỉ số vòng lặp, bộ đếm, cờ), nên dựng sẵn 256 object một lần rẻ hơn nhiều so với tạo mới liên tục.\n' +
    '\n' +
    '## 3. Các wrapper khác\n' +
    '\n' +
    '```\n' +
    'Boolean          : TRUE và FALSE luôn cache\n' +
    'Byte             : cache toàn bộ, vì chỉ có 256 giá trị\n' +
    'Short, Long      : -128 đến 127\n' +
    'Character        : 0 đến 127\n' +
    'Float, Double    : KHÔNG có cache\n' +
    '```\n' +
    '\n' +
    'Giới hạn trên của `Integer` còn có thể chỉnh bằng `-XX:AutoBoxCacheMax` — nghĩa là hành vi của `==` phụ thuộc vào tham số JVM. Đó là một lý do quá đủ để không bao giờ dựa vào nó.\n' +
    '\n' +
    '## 4. Điều cần nhớ\n' +
    '\n' +
    'Với wrapper: **dùng `equals()` để so sánh giá trị, không dùng `==`**.\n' +
    '\n' +
    '```java\n' +
    'a.equals(b)\n' +
    '```\n' +
    '\n' +
    'Điều nguy hiểm nhất của bug này là nó **hoạt động đúng với dữ liệu test nhỏ** rồi sai trên production khi số vượt 127. Kiểu lỗi ngủ đông đó rất khó truy.',
  essence:
    'Integer.valueOf cache sẵn các giá trị từ -128 đến 127, nên == trả về true với số nhỏ và false với số lớn. Đây là loại bug ngủ đông: đúng với dữ liệu test nhỏ, sai trên production khi giá trị vượt 127 — luôn dùng equals cho wrapper.',
  example:
    'Một điều kiện `if (order.getQuantity() == expected)` với `Integer` chạy đúng suốt quá trình phát triển vì số lượng test luôn dưới 100. Khi có đơn hàng 150 sản phẩm, so sánh trả về `false` và nhánh xử lý bị bỏ qua âm thầm — không exception, không log.',
  viz: {
    type: 'compare',
    cols: ['Integer trong [-128, 127]', 'Integer ngoài khoảng đó'],
    rows: [
      ['valueOf trả về', 'object có sẵn trong cache', 'object mới mỗi lần'],
      ['a == b', 'true', 'false'],
      ['a.equals(b)', 'true', 'true'],
      ['Vì sao có cache', 'giá trị nhỏ được dùng rất nhiều', '—'],
      ['Kết luận', 'đừng dựa vào', 'luôn dùng equals'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Cùng một đoạn code, hai kết quả khác nhau',
      code:
        'Integer a = 100,  b = 100;\n' +
        'a == b;              // true   — cả hai lấy từ cache\n' +
        '\n' +
        'Integer c = 1000, d = 1000;\n' +
        'c == d;              // false  — mỗi biến một object mới\n' +
        'c.equals(d);         // true   — LUÔN dùng cách này\n' +
        '\n' +
        '// Vì sao: autoboxing gọi Integer.valueOf(), và hàm đó là:\n' +
        'public static Integer valueOf(int i) {\n' +
        '    if (i >= IntegerCache.low && i <= IntegerCache.high)\n' +
        '        return IntegerCache.cache[i + (-IntegerCache.low)];   // object CÓ SẴN\n' +
        '    return new Integer(i);                                    // object MỚI\n' +
        '}\n' +
        '\n' +
        '// CÁC WRAPPER KHÁC:\n' +
        '//   Boolean          : TRUE / FALSE luôn cache\n' +
        '//   Byte             : cache TOÀN BỘ (chỉ 256 giá trị)\n' +
        '//   Short, Long      : -128..127\n' +
        '//   Character        : 0..127\n' +
        '//   Float, Double    : KHÔNG cache -> == luôn false\n' +
        '\n' +
        '// Giới hạn trên còn CHỈNH ĐƯỢC bằng tham số JVM:\n' +
        '//   java -XX:AutoBoxCacheMax=10000 App\n' +
        '// -> hành vi của == phụ thuộc vào cách khởi chạy JVM.\n' +
        '// Đủ để không bao giờ dựa vào nó.\n' +
        '\n' +
        '// BUG NGỦ ĐÔNG điển hình:\n' +
        'if (order.getQuantity() == expectedQty) { ... }   // Integer!\n' +
        '//   test  : quantity = 5    -> true,  mọi thứ ổn\n' +
        '//   thật  : quantity = 150  -> false, nhánh bị bỏ qua ÂM THẦM\n' +
        'if (Objects.equals(order.getQuantity(), expectedQty)) { ... }   // đúng',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-1te49yb',
  q: 'Object class có những method quan trọng nào?',
  answer:
    'Mọi Java class đều trực tiếp hoặc gián tiếp kế thừa `Object`. Vì vậy chín method này có mặt trên **mọi** object bạn từng viết.\n' +
    '\n' +
    '## 1. Danh sách\n' +
    '\n' +
    '```\n' +
    'equals()\n' +
    'hashCode()\n' +
    'toString()\n' +
    'getClass()\n' +
    'clone()\n' +
    'finalize()   // legacy/deprecated\n' +
    'wait()\n' +
    'notify()\n' +
    'notifyAll()\n' +
    '```\n' +
    '\n' +
    '## 2. Từng method\n' +
    '\n' +
    '**`equals()`** — so sánh logical equality. Mặc định chính là `==`.\n' +
    '\n' +
    '**`hashCode()`** — dùng trong hash-based collections. Đi cặp với `equals()` như đã nói.\n' +
    '\n' +
    '**`toString()`** — String representation của object.\n' +
    '\n' +
    '```java\n' +
    'System.out.println(user);\n' +
    '```\n' +
    '\n' +
    'Java có thể gọi `user.toString()`. Mặc định trả về `TênClass@hashCodeHex` — gần như vô dụng khi đọc log, nên hãy override cho mọi class xuất hiện trong log.\n' +
    '\n' +
    '**`getClass()`** — lấy runtime class:\n' +
    '\n' +
    '```java\n' +
    'user.getClass();\n' +
    '```\n' +
    '\n' +
    'Đây là cổng vào **reflection**, và cũng là thứ để phân biệt kiểu thật khi `equals()` cần chặt chẽ.\n' +
    '\n' +
    '**`clone()`** — shallow copy, cùng với `Cloneable`; sẽ nói riêng ở câu sau.\n' +
    '\n' +
    '**`wait()` / `notify()` / `notifyAll()`** — liên quan tới coordination giữa thread và monitor. Chúng nằm ở `Object` chứ không phải ở `Thread`, vì trong Java **mọi object đều có một monitor** — chính là cái mà `synchronized` khoá lên.\n' +
    '\n' +
    '## 3. Ba method bạn thật sự cần quan tâm\n' +
    '\n' +
    '```\n' +
    'equals()    -> gần như luôn phải override cùng hashCode()\n' +
    'hashCode()  -> nt\n' +
    'toString()  -> nên override cho mọi class xuất hiện trong log\n' +
    '```\n' +
    '\n' +
    'Sáu method còn lại: `clone()` nên tránh, `finalize()` đã bị bỏ, và bộ ba `wait/notify` gần như không nên dùng trực tiếp nữa — `java.util.concurrent` cho bạn `CountDownLatch`, `BlockingQueue`, `Semaphore` với API rõ ràng và ít sai sót hơn nhiều.\n' +
    '\n' +
    'Một lưu ý về `toString()` trong log: cẩn thận với dữ liệu nhạy cảm. `@ToString` của Lombok trên một entity `User` sẽ vui vẻ in cả trường `password` ra file log.',
  essence:
    'Object cho mọi class chín method, nhưng chỉ ba cái thật sự đáng quan tâm là equals, hashCode và toString. Bộ wait/notify nằm ở Object vì mọi object đều có monitor, còn clone và finalize là di sản nên tránh.',
  example:
    'Log dòng `Đơn hàng lỗi: com.shop.Order@6d06d69c` không giúp ai gỡ lỗi được. Override `toString()` để in mã đơn, trạng thái và tổng tiền biến cùng dòng log đó thành thứ dùng được — nhưng nhớ loại bỏ dữ liệu nhạy cảm.',
  demo: [
    {
      lang: 'java',
      title: 'Ba method đáng quan tâm và một cạm bẫy khi log',
      code:
        '// toString() mặc định gần như vô dụng:\n' +
        'System.out.println(order);      // com.shop.Order@6d06d69c\n' +
        '\n' +
        '@Override public String toString() {\n' +
        '    return "Order{no=" + orderNo + ", status=" + status + ", total=" + total + "}";\n' +
        '}\n' +
        'System.out.println(order);      // Order{no=A100, status=PAID, total=250000}\n' +
        '\n' +
        '// CẠM BẪY: toString sinh tự động làm rò rỉ dữ liệu nhạy cảm\n' +
        '@Data                            // Lombok sinh toString từ MỌI field\n' +
        '@Entity class User {\n' +
        '    private String email;\n' +
        '    private String passwordHash;  // sẽ NẰM TRONG FILE LOG\n' +
        '    private String creditCard;    // và cả đây nữa\n' +
        '}\n' +
        'log.info("user={}", user);       // rò rỉ toàn bộ\n' +
        '\n' +
        '@ToString(exclude = {"passwordHash", "creditCard"})   // hoặc viết tay\n' +
        '\n' +
        '// wait/notify nằm ở Object vì MỌI object đều có một monitor —\n' +
        '// chính là thứ mà synchronized khoá lên:\n' +
        'synchronized (lock) {\n' +
        '    while (!ready) lock.wait();   // luôn dùng while, không dùng if\n' +
        '}                                 // (spurious wakeup)\n' +
        '\n' +
        '// NHƯNG hôm nay hầu như không cần dùng trực tiếp nữa:\n' +
        'var latch = new CountDownLatch(1);   latch.await();   latch.countDown();\n' +
        'var queue = new LinkedBlockingQueue<Task>();  queue.take();  queue.put(t);\n' +
        '// API rõ ràng hơn, ít chỗ sai hơn hẳn.',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-1myoiq8',
  q: 'Shallow copy khác Deep copy thế nào?',
  answer:
    'Khác biệt nằm ở chỗ các object con được **chia sẻ** hay được **nhân bản**.\n' +
    '\n' +
    '## 1. Shallow copy\n' +
    '\n' +
    'Copy object nhưng các reference bên trong vẫn trỏ tới object con cũ.\n' +
    '\n' +
    '```\n' +
    'Original\n' +
    '   |\n' +
    '   +-- name\n' +
    '   |\n' +
    '   +-- address -----> Address #1\n' +
    '\n' +
    'Shallow Copy\n' +
    '   |\n' +
    '   +-- name\n' +
    '   |\n' +
    '   +-- address -----> Address #1\n' +
    '```\n' +
    '\n' +
    'Hai object dùng chung `Address`. Sửa địa chỉ qua bản sao thì bản gốc cũng đổi theo — thường là điều bạn không hề mong muốn.\n' +
    '\n' +
    '## 2. Deep copy\n' +
    '\n' +
    'Copy luôn object được reference.\n' +
    '\n' +
    '```\n' +
    'Original\n' +
    '   |\n' +
    '   +-- address -----> Address #1\n' +
    '\n' +
    'Deep Copy\n' +
    '   |\n' +
    '   +-- address -----> Address #2\n' +
    '```\n' +
    '\n' +
    'Thay đổi `Address #2` không ảnh hưởng `Address #1`.\n' +
    '\n' +
    '## 3. Ví dụ\n' +
    '\n' +
    '```java\n' +
    'class User {\n' +
    '    String name;\n' +
    '    Address address;\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '```\n' +
    'Shallow:            Deep:\n' +
    'User A              User A\n' +
    '  +--> Address X      +--> Address X\n' +
    'User B              User B\n' +
    '  +--> Address X      +--> Address Y\n' +
    '```\n' +
    '\n' +
    '## 4. Một điểm quan trọng\n' +
    '\n' +
    'Nếu **mọi field đều immutable** thì shallow copy đã là đủ — không có gì để sửa nên không thể ảnh hưởng lẫn nhau. Đây là lý do các class immutable dễ dùng đến vậy: bạn không bao giờ phải hỏi "cái này copy sâu hay nông".\n' +
    '\n' +
    'Và cạm bẫy hay gặp nhất trong thực tế:\n' +
    '\n' +
    '```java\n' +
    'new ArrayList<>(other.items)     // copy DANH SÁCH, không copy PHẦN TỬ\n' +
    '```\n' +
    '\n' +
    'Đây là **shallow copy một mức**. Danh sách là mới, nhưng các phần tử vẫn dùng chung. Nếu phần tử mutable thì bạn vẫn dính đúng vấn đề cũ.\n' +
    '\n' +
    'Câu tiếp theo nói về `Cloneable` — cơ chế mà Java từng đưa ra để giải quyết chuyện này, và vì sao nó không được ưa dùng.',
  essence:
    'Shallow copy chia sẻ các object con, deep copy nhân bản toàn bộ đồ thị. Nếu mọi field đều immutable thì shallow là đủ — và nhớ rằng new ArrayList<>(other) chỉ copy danh sách chứ không copy các phần tử bên trong.',
  example:
    'Một `Order` giữ `List<OrderLine>`. Bạn tạo bản nháp để người dùng chỉnh sửa bằng `new ArrayList<>(order.lines())`. Danh sách là mới nên thêm/xoá dòng không ảnh hưởng bản gốc — nhưng sửa số lượng trên một dòng thì đơn gốc đổi theo, vì `OrderLine` vẫn dùng chung.',
  viz: {
    type: 'compare',
    cols: ['Shallow copy', 'Deep copy'],
    rows: [
      ['Object ngoài cùng', 'mới', 'mới'],
      ['Object con', 'dùng chung với bản gốc', 'nhân bản riêng'],
      ['Sửa object con', 'ảnh hưởng cả hai', 'độc lập'],
      ['Chi phí', 'rẻ', 'đắt, tỉ lệ với kích thước đồ thị'],
      ['Khi mọi field immutable', 'đã đủ an toàn', 'không cần thiết'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Shallow một mức — cạm bẫy hay gặp nhất',
      code:
        'class Address { String city; }\n' +
        'class User { String name; Address address; List<String> tags; }\n' +
        '\n' +
        '// SHALLOW: object mới, nhưng address DÙNG CHUNG\n' +
        'User copy = new User();\n' +
        'copy.name    = original.name;        // String immutable -> an toàn\n' +
        'copy.address = original.address;     // CÙNG object!\n' +
        'copy.address.city = "Hà Nội";        // original.address.city cũng đổi\n' +
        '\n' +
        '// DEEP: nhân bản cả object con\n' +
        'User deep = new User();\n' +
        'deep.name    = original.name;\n' +
        'deep.address = new Address(original.address.city);   // object RIÊNG\n' +
        'deep.tags    = new ArrayList<>(original.tags);       // list RIÊNG\n' +
        '\n' +
        '// CẠM BẪY: "shallow một mức" — rất hay bị nhầm là deep copy\n' +
        'List<OrderLine> lines = new ArrayList<>(order.lines());\n' +
        '//   DANH SÁCH là mới  -> thêm/xoá dòng KHÔNG ảnh hưởng bản gốc\n' +
        '//   PHẦN TỬ vẫn chung -> sửa số lượng một dòng thì đơn GỐC cũng đổi\n' +
        'lines.get(0).setQuantity(99);        // order gốc bị đổi theo!\n' +
        '\n' +
        '// Muốn deep thật thì phải copy từng phần tử:\n' +
        'List<OrderLine> deepLines = order.lines().stream()\n' +
        '    .map(OrderLine::copy).toList();\n' +
        '\n' +
        '// CÁCH TRÁNH TOÀN BỘ VẤN ĐỀ: làm cho mọi thứ immutable\n' +
        'record Address2(String city) { }\n' +
        'record User2(String name, Address2 address, List<String> tags) {\n' +
        '    User2 { tags = List.copyOf(tags); }   // compact constructor\n' +
        '}\n' +
        '// Không có gì sửa được -> câu hỏi "sâu hay nông" biến mất.',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-143l08b',
  q: '`Cloneable` là gì và có vấn đề gì?',
  answer:
    '`Cloneable` là một **marker interface** trong Java — interface rỗng, không khai báo method nào.\n' +
    '\n' +
    '## 1. Cách dùng\n' +
    '\n' +
    '```java\n' +
    'class User implements Cloneable {\n' +
    '    @Override\n' +
    '    public User clone() throws CloneNotSupportedException {\n' +
    '        return (User) super.clone();\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '`super.clone()` mặc định thực hiện **shallow copy** — copy từng field theo bit.\n' +
    '\n' +
    '## 2. Vấn đề\n' +
    '\n' +
    '`Cloneable` có thiết kế khá cũ và dễ gây confusion, đặc biệt với object graph phức tạp. Cụ thể:\n' +
    '\n' +
    '- `Cloneable` là interface **rỗng**, nó không hề khai báo `clone()`. Nó chỉ là một lá cờ báo cho `Object.clone()` biết là "được phép".\n' +
    '- `clone()` lại nằm ở `Object` và là `protected` — người gọi bên ngoài không dùng được nếu bạn không tự mở rộng phạm vi.\n' +
    '- `super.clone()` **không chạy constructor**, nên field `final` không thể gán lại — bạn không deep-copy được một field `final`.\n' +
    '- Nó ném `CloneNotSupportedException` là checked exception, dù gần như không bao giờ xảy ra.\n' +
    '- Kết quả mặc định là shallow, nên với mọi field mutable bạn vẫn phải tự copy tay.\n' +
    '\n' +
    'Chính Josh Bloch — tác giả *Effective Java* và cũng là người thiết kế phần lớn Java Collections — khuyên nên tránh.\n' +
    '\n' +
    '## 3. Các lựa chọn thay thế\n' +
    '\n' +
    '```\n' +
    'copy constructor\n' +
    'factory method\n' +
    'builder\n' +
    'mapping framework\n' +
    'explicit copy method\n' +
    '```\n' +
    '\n' +
    'Ví dụ:\n' +
    '\n' +
    '```java\n' +
    'public User copy() {\n' +
    '    return new User(\n' +
    '        this.name,\n' +
    '        new Address(this.address)\n' +
    '    );\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Code rõ ràng hơn hẳn về việc copy sâu hay nông — bạn đọc là thấy ngay, không phải đoán.\n' +
    '\n' +
    '## 4. Và lựa chọn tốt nhất\n' +
    '\n' +
    'Là **không cần copy gì cả**. Nếu object immutable, chia sẻ tham chiếu đã an toàn tuyệt đối. `record` cho bạn điều đó gần như miễn phí, cùng với `withX()` kiểu tạo bản mới chỉ đổi một field.\n' +
    '\n' +
    'Câu tiếp theo sẽ nói về chính `record`.',
  essence:
    'Cloneable là marker interface rỗng, clone() nằm ở Object và là protected, không chạy constructor nên không gán lại được field final, và kết quả chỉ là shallow copy. Copy constructor rõ ràng hơn hẳn, còn tốt nhất là làm object immutable để khỏi phải copy.',
  example:
    'Với `class Order { private final List<OrderLine> lines; }`, `clone()` không giúp gì: `super.clone()` cho bạn một object dùng chung list, và vì `lines` là `final` nên bạn không gán lại được bản sao. Copy constructor giải quyết trong một dòng.',
  demo: [
    {
      lang: 'java',
      title: 'Vì sao Cloneable là thiết kế hỏng, và dùng gì thay thế',
      code:
        'class Order implements Cloneable {\n' +
        '    private String id;\n' +
        '    private List<String> items;\n' +
        '\n' +
        '    @Override protected Order clone() throws CloneNotSupportedException {\n' +
        '        Order c = (Order) super.clone();   // SHALLOW: copy từng field theo bit\n' +
        '        c.items = new ArrayList<>(items);  // phải TỰ copy từng field mutable\n' +
        '        return c;\n' +
        '    }\n' +
        '}\n' +
        '// NĂM VẤN ĐỀ:\n' +
        '//  1. Cloneable là interface RỖNG, không khai báo clone()\n' +
        '//  2. clone() nằm ở Object và là protected -> người gọi khó dùng\n' +
        '//  3. super.clone() KHÔNG chạy constructor -> field final không gán lại được\n' +
        '//  4. ném checked CloneNotSupportedException dù gần như không xảy ra\n' +
        '//  5. mặc định là shallow -> vẫn phải tự copy tay mọi field mutable\n' +
        '\n' +
        '// VẤN ĐỀ 3 chặn đứng bạn khi field là final:\n' +
        'class Order2 implements Cloneable {\n' +
        '    private final List<String> items;      // final\n' +
        '    @Override protected Order2 clone() throws CloneNotSupportedException {\n' +
        '        Order2 c = (Order2) super.clone();\n' +
        '        // c.items = new ArrayList<>(items);   -> LỖI BIÊN DỊCH: final\n' +
        '        return c;                              // buộc phải shallow\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '// THAY THẾ 1 — copy constructor: rõ ràng, không ma thuật\n' +
        'class Order3 {\n' +
        '    private final String id;\n' +
        '    private final List<String> items;\n' +
        '    Order3(Order3 other) {\n' +
        '        this.id    = other.id;\n' +
        '        this.items = new ArrayList<>(other.items);   // deep TƯỜNG MINH\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '// THAY THẾ 2 — tốt nhất: immutable thì khỏi cần copy\n' +
        'record Order4(String id, List<String> items) {\n' +
        '    Order4 { items = List.copyOf(items); }\n' +
        '    Order4 withId(String newId) { return new Order4(newId, items); }\n' +
        '}',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-tcssf9',
  q: '`record` trong Java là gì?',
  answer:
    '`record` là một dạng class đặc biệt dành cho **data carrier** — object mà mục đích chính là mang dữ liệu.\n' +
    '\n' +
    '## 1. Cú pháp\n' +
    '\n' +
    '```java\n' +
    'public record User(\n' +
    '    Long id,\n' +
    '    String name,\n' +
    '    String email\n' +
    ') {}\n' +
    '```\n' +
    '\n' +
    'Java tự cung cấp:\n' +
    '\n' +
    '```\n' +
    'constructor\n' +
    'accessors\n' +
    'equals()\n' +
    'hashCode()\n' +
    'toString()\n' +
    '```\n' +
    '\n' +
    '```java\n' +
    'User user = new User(1L, "Vu", "vu@example.com");\n' +
    'user.name();\n' +
    'user.email();\n' +
    '```\n' +
    '\n' +
    'Chú ý accessor tên là `name()` chứ không phải `getName()`. Thay vì phải viết nhiều boilerplate như class truyền thống, bạn có tất cả trong một dòng.\n' +
    '\n' +
    'Quan trọng hơn: `equals()`/`hashCode()` do compiler sinh nên **luôn nhất quán** — loại bỏ hẳn nhóm lỗi đã nói ở phần Collections.\n' +
    '\n' +
    '## 2. Record phù hợp khi nào\n' +
    '\n' +
    'Các object chủ yếu mang dữ liệu:\n' +
    '\n' +
    '```\n' +
    'DTO\n' +
    'Request/Response model\n' +
    'Value object\n' +
    'Data carrier\n' +
    '```\n' +
    '\n' +
    'Thêm hai chỗ rất hợp: **key của map** (immutable, equals/hashCode chuẩn) và **kiểu trả về nhiều giá trị** thay cho việc trả về một mảng `Object[]`.\n' +
    '\n' +
    '## 3. Nhưng record không có nghĩa mọi thứ bên trong immutable tuyệt đối\n' +
    '\n' +
    'Đây là điểm rất đáng nói khi phỏng vấn.\n' +
    '\n' +
    '```java\n' +
    'record User(List<String> roles) {}\n' +
    '```\n' +
    '\n' +
    'Reference `roles` không đổi, nhưng `List` bên trong vẫn có thể mutable. Do đó:\n' +
    '\n' +
    '```\n' +
    'record\n' +
    '  ≠\n' +
    'deep immutable object\n' +
    '```\n' +
    '\n' +
    'Cách chữa là **compact constructor**: sao chép phòng vệ ngay lúc dựng object.\n' +
    '\n' +
    '## 4. Giới hạn cần biết\n' +
    '\n' +
    '- Không kế thừa được class khác (`record` đã ngầm extends `Record`), nhưng implement interface thì được.\n' +
    '- Mọi field đều `final`, không thêm được field instance nào khác.\n' +
    '- Vì thế **không dùng làm JPA entity** — Hibernate cần constructor rỗng và setter.\n' +
    '\n' +
    'Ngược lại, `record` kết hợp rất tốt với `sealed interface` và `switch` pattern matching — bộ ba đó là cách mô hình hoá dữ liệu hiện đại trong Java.',
  essence:
    'record sinh sẵn constructor, accessor, equals, hashCode và toString cho các object mang dữ liệu, và equals/hashCode luôn nhất quán. Nhưng nó chỉ bất biến ở mức tham chiếu — field kiểu List vẫn sửa được, phải dùng compact constructor để sao chép phòng vệ.',
  example:
    'Thay `class OrderKey` viết tay 40 dòng cùng nguy cơ quên `hashCode()`, `record OrderKey(String shopId, String orderNo) {}` cho bạn một key hoàn toàn an toàn cho `HashMap` trong đúng một dòng.',
  demo: [
    {
      lang: 'java',
      title: 'record, và vì sao nó không bất biến sâu',
      code:
        'public record User(Long id, String name, String email) { }\n' +
        '// Compiler sinh: constructor, id()/name()/email(), equals, hashCode, toString\n' +
        'var u = new User(1L, "Vu", "vu@example.com");\n' +
        'u.name();                          // KHÔNG phải getName()\n' +
        '\n' +
        '// BẤT BIẾN CHỈ Ở MỨC THAM CHIẾU:\n' +
        'record Team(String name, List<String> members) { }\n' +
        'var list = new ArrayList<>(List.of("An"));\n' +
        'var t = new Team("A", list);\n' +
        'list.add("Bình");                  // sửa được từ BÊN NGOÀI\n' +
        't.members();                       // [An, Bình] — record đã "đổi"\n' +
        't.members().add("Cường");          // và sửa được từ BÊN TRONG luôn\n' +
        '\n' +
        '// CHỮA bằng COMPACT CONSTRUCTOR — sao chép phòng vệ + validate\n' +
        'record Team2(String name, List<String> members) {\n' +
        '    Team2 {                                     // không có dấu ngoặc tham số\n' +
        '        Objects.requireNonNull(name);\n' +
        '        if (name.isBlank()) throw new IllegalArgumentException();\n' +
        '        members = List.copyOf(members);         // gán lại THAM SỐ\n' +
        '    }\n' +
        '    Team2 withName(String n) { return new Team2(n, members); }\n' +
        '}\n' +
        '\n' +
        '// GIỚI HẠN:\n' +
        '//  - không extends class khác (đã ngầm extends Record); implements thì được\n' +
        '//  - mọi field final, không thêm field instance\n' +
        '//  - KHÔNG dùng làm JPA entity: Hibernate cần constructor rỗng + setter\n' +
        '\n' +
        '// KẾT HỢP RẤT TỐT với sealed + pattern matching:\n' +
        'sealed interface Shape permits Circle, Rect { }\n' +
        'record Circle(double r)            implements Shape { }\n' +
        'record Rect(double w, double h)    implements Shape { }\n' +
        '\n' +
        'double area(Shape s) {\n' +
        '    return switch (s) {                        // compiler kiểm tra ĐỦ nhánh\n' +
        '        case Circle c -> Math.PI * c.r() * c.r();\n' +
        '        case Rect r   -> r.w() * r.h();\n' +
        '    };\n' +
        '}',
    },
  ],
},
{
  cat: 'String / Object / Memory',
  id: 'java-1347sdt',
  q: '`enum` hoạt động thế nào?',
  answer:
    '`enum` dùng để biểu diễn một **tập giá trị cố định**. Nhưng nó mạnh hơn nhiều so với cách phần lớn người ta dùng.\n' +
    '\n' +
    '## 1. Cơ bản\n' +
    '\n' +
    '```java\n' +
    'enum OrderStatus {\n' +
    '    CREATED,\n' +
    '    PAID,\n' +
    '    SHIPPED,\n' +
    '    CANCELLED\n' +
    '}\n' +
    '\n' +
    'OrderStatus status = OrderStatus.PAID;\n' +
    '```\n' +
    '\n' +
    '## 2. Enum không chỉ là constant\n' +
    '\n' +
    'Enum có thể có **field**, **constructor**, **method**, và **implement interface**.\n' +
    '\n' +
    '```java\n' +
    'enum OrderStatus {\n' +
    '    CREATED("Created"),\n' +
    '    PAID("Paid"),\n' +
    '    CANCELLED("Cancelled");\n' +
    '\n' +
    '    private final String description;\n' +
    '\n' +
    '    OrderStatus(String description) {\n' +
    '        this.description = description;\n' +
    '    }\n' +
    '\n' +
    '    public String getDescription() {\n' +
    '        return description;\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Mạnh hơn nữa: mỗi hằng có thể **ghi đè method riêng** — biến enum thành một dạng Strategy pattern gọn gàng, xoá luôn chuỗi `switch` theo trạng thái.\n' +
    '\n' +
    '## 3. Enum về bản chất\n' +
    '\n' +
    'Các enum constant là **instance của enum type**.\n' +
    '\n' +
    '```\n' +
    'OrderStatus\n' +
    '   |-- CREATED\n' +
    '   |-- PAID\n' +
    '   +-- CANCELLED\n' +
    '```\n' +
    '\n' +
    'Các constant được tạo và quản lý bởi JVM lúc class được khởi tạo, và **chỉ một lần duy nhất**. Đây cũng là lý do enum là cách cài đặt singleton an toàn nhất trong Java: nó chống được cả reflection lẫn deserialization.\n' +
    '\n' +
    '## 4. Một điểm rất hay khi phỏng vấn\n' +
    '\n' +
    'Không nên so sánh enum bằng:\n' +
    '\n' +
    '```java\n' +
    'status.name().equals("PAID")\n' +
    '```\n' +
    '\n' +
    'mà thường:\n' +
    '\n' +
    '```java\n' +
    'status == OrderStatus.PAID\n' +
    '```\n' +
    '\n' +
    'Vì mỗi enum constant là một instance duy nhất, `==` vừa nhanh hơn, vừa an toàn với `null`, vừa được compiler kiểm tra kiểu.\n' +
    '\n' +
    '## 5. Hai cạm bẫy khi lưu trữ\n' +
    '\n' +
    'Đừng dùng `ordinal()` để lưu vào database. Chèn một hằng mới vào giữa danh sách là mọi dữ liệu cũ đọc sai. Với JPA, luôn dùng `@Enumerated(EnumType.STRING)`.\n' +
    '\n' +
    'Và với `Map`/`Set` có khoá là enum, hãy dùng `EnumMap`/`EnumSet` — chúng dựa trên mảng và bit mask nên nhanh hơn `HashMap`/`HashSet` rất nhiều.\n' +
    '\n' +
    '## 6. Khép lại phần này\n' +
    '\n' +
    'Chuỗi tư duy cần nắm cho toàn bộ phần String / Object / Memory:\n' +
    '\n' +
    '```\n' +
    'String immutable\n' +
    '   -> String Pool dùng chung object\n' +
    '   -> thread-safe khi chỉ đọc\n' +
    '   -> phù hợp làm HashMap key\n' +
    '\n' +
    'StringBuilder mutable -> nối chuỗi trong vòng lặp\n' +
    'StringBuffer          -> synchronized, gần như không dùng\n' +
    '\n' +
    'Object:  ==  -> reference identity\n' +
    '         equals() -> logical equality -> đi cặp hashCode() -> HashMap/HashSet\n' +
    '\n' +
    'int --autoboxing--> Integer -> Integer cache -> cẩn thận với ==\n' +
    '```\n' +
    '\n' +
    'Và đặc biệt nhớ: **final reference ≠ immutable object**.\n' +
    '\n' +
    'Nếu người phỏng vấn muốn đào sâu, họ sẽ đi theo chuỗi: vì sao `String` immutable, String Pool hoạt động ra sao, `StringBuilder` nhanh hơn ở chỗ nào, `==` khác `equals()` thế nào, `equals()` liên quan gì tới `hashCode()`, Integer cache ra sao, `final` reference có immutable không, và `record` có thực sự immutable không. Hiểu được **mối liên hệ giữa các câu** sẽ tốt hơn nhiều so với việc học thuộc mười lăm định nghĩa rời rạc.',
  essence:
    'Mỗi hằng enum là một instance duy nhất do JVM tạo một lần, nên so sánh bằng == vừa đúng vừa an toàn với null. Enum mang được field, constructor và method riêng cho từng hằng — nhưng đừng bao giờ lưu ordinal() xuống database.',
  example:
    'Thay vì một `switch` dài theo trạng thái đơn hàng nằm rải rác ở ba service, hãy để mỗi hằng của `OrderStatus` tự khai báo trạng thái nào chuyển được sang trạng thái nào. Luật chuyển trạng thái khi đó nằm gọn trong một file và compiler nhắc bạn khi thêm trạng thái mới.',
  viz: {
    type: 'compare',
    cols: ['enum', 'hằng String / int'],
    rows: [
      ['Kiểm tra lúc biên dịch', 'có — sai tên là lỗi compile', 'không — gõ sai chỉ lộ lúc chạy'],
      ['So sánh', '== an toàn và nhanh', 'phải dùng equals, dễ NPE'],
      ['Mang được dữ liệu, hành vi', 'có', 'không'],
      ['switch đủ nhánh', 'compiler nhắc được', 'không'],
      ['Cấu trúc chuyên dụng', 'EnumMap, EnumSet', 'HashMap, HashSet'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Enum mang hành vi — xoá luôn switch theo trạng thái',
      code:
        '// MỖI HẰNG ghi đè method riêng: Strategy pattern gọn gàng\n' +
        'public enum OrderStatus {\n' +
        '    CREATED("Đã tạo")   { public boolean canTransitTo(OrderStatus s) { return s == PAID || s == CANCELLED; } },\n' +
        '    PAID("Đã trả")      { public boolean canTransitTo(OrderStatus s) { return s == SHIPPED; } },\n' +
        '    SHIPPED("Đã giao")  { public boolean canTransitTo(OrderStatus s) { return false; } },\n' +
        '    CANCELLED("Đã huỷ") { public boolean canTransitTo(OrderStatus s) { return false; } };\n' +
        '\n' +
        '    private final String label;\n' +
        '    OrderStatus(String label) { this.label = label; }\n' +
        '    public String label() { return label; }\n' +
        '    public abstract boolean canTransitTo(OrderStatus s);\n' +
        '}\n' +
        '// Luật chuyển trạng thái nằm GỌN một chỗ, thay vì switch rải ở 3 service.\n' +
        '\n' +
        '// SO SÁNH: dùng == chứ không dùng equals hay name()\n' +
        'if (status == OrderStatus.PAID) { }          // đúng, nhanh, null-safe\n' +
        'if (status.name().equals("PAID")) { }        // gõ sai chuỗi -> lỗi lúc chạy\n' +
        '\n' +
        '// ENUM LÀ SINGLETON AN TOÀN NHẤT — chống cả reflection lẫn deserialization\n' +
        'public enum Config {\n' +
        '    INSTANCE;\n' +
        '    private final Properties props = load();\n' +
        '    public String get(String k) { return props.getProperty(k); }\n' +
        '}\n' +
        '\n' +
        '// CẠM BẪY LƯU TRỮ: đừng bao giờ lưu ordinal()\n' +
        '@Enumerated(EnumType.ORDINAL)   // SAI: chèn hằng mới vào giữa\n' +
        '@Enumerated(EnumType.STRING)    // ĐÚNG   -> mọi dữ liệu cũ đọc sai\n' +
        'private OrderStatus status;\n' +
        '\n' +
        '// CẤU TRÚC CHUYÊN DỤNG — nhanh hơn HashMap/HashSet nhiều\n' +
        'var counts = new EnumMap<OrderStatus, Integer>(OrderStatus.class);  // mảng\n' +
        'var active = EnumSet.of(CREATED, PAID);                             // bit mask',
    },
  ],
},
]);
