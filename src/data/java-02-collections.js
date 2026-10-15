SS.addQuestions('java', [
{
  cat: 'Java Collections',
  id: 'java-y0rcpl',
  q: 'ArrayList hoạt động thế nào?',
  answer:
    'Collections là một trong những phần quan trọng nhất khi phỏng vấn Java Middle, và `ArrayList` là cửa vào. Người phỏng vấn hiếm khi dừng ở "ArrayList là danh sách" — họ sẽ đi tiếp tới mảng nội bộ, resize, rồi complexity.\n' +
    '\n' +
    '## 1. Bên trong là một mảng động\n' +
    '\n' +
    '`ArrayList` là một implementation của `List`, bên trong sử dụng **mảng động** kiểu `Object[]`.\n' +
    '\n' +
    '```java\n' +
    'List<String> names = new ArrayList<>();\n' +
    'names.add("A");\n' +
    'names.add("B");\n' +
    'names.add("C");\n' +
    '```\n' +
    '\n' +
    'Có thể hình dung:\n' +
    '\n' +
    '```\n' +
    'ArrayList\n' +
    '    |\n' +
    '    v\n' +
    'Object[]\n' +
    '+-----+-----+-----+-----+\n' +
    '|  A  |  B  |  C  |     |\n' +
    '+-----+-----+-----+-----+\n' +
    '   0     1     2    (trống)\n' +
    '```\n' +
    '\n' +
    'Hai con số cần phân biệt: **size** là số phần tử thật (3), **capacity** là độ dài mảng nội bộ (4). `size()` trả về cái đầu; capacity không lộ ra ngoài.\n' +
    '\n' +
    '## 2. Vì sao get(index) nhanh\n' +
    '\n' +
    '```java\n' +
    'names.get(1);\n' +
    '```\n' +
    '\n' +
    'Phần tử nằm liên tục trong mảng nên địa chỉ tính được trực tiếp: `base + index * kích_thước_ô`. Không phải duyệt gì cả — đó là O(1).\n' +
    '\n' +
    'Việc nằm liên tục còn cho một lợi thế ít được nhắc: **cache locality**. CPU nạp cả một dòng cache 64 byte, nên khi bạn duyệt tuần tự, các phần tử kế tiếp đã sẵn trong cache. Đây là lý do thực tế khiến `ArrayList` thường nhanh hơn `LinkedList` ngay cả ở những thao tác mà lý thuyết nói ngược lại.\n' +
    '\n' +
    '## 3. Complexity\n' +
    '\n' +
    '| Operation | Complexity |\n' +
    '| --- | --- |\n' +
    '| `get(index)` | O(1) |\n' +
    '| `set(index)` | O(1) |\n' +
    '| `add` cuối | O(1) amortized |\n' +
    '| `add` giữa | O(n) |\n' +
    '| `remove` giữa | O(n) |\n' +
    '| `contains` | O(n) |\n' +
    '\n' +
    'Chữ **amortized** ở dòng thứ ba là chỗ dễ bị hỏi vặn — câu về resize phía sau sẽ giải thích.\n' +
    '\n' +
    'Câu tiếp theo là `LinkedList`, cấu trúc đối lập hoàn toàn: không có mảng, không có cache locality, nhưng chèn/xoá ở đầu lại rất rẻ.',
  essence:
    'ArrayList là mảng Object[] động: phần tử nằm liên tục nên get(index) là O(1) và duyệt tuần tự rất thân thiện với cache CPU. Cái giá là chèn/xoá ở giữa phải dịch mảng, tức O(n).',
  example:
    'Khi đọc 100.000 dòng từ database vào danh sách rồi chỉ duyệt và hiển thị, `ArrayList` là lựa chọn mặc định. Nếu biết trước số lượng, `new ArrayList<>(100_000)` giúp tránh khoảng 17 lần cấp phát mảng mới cùng ngần ấy lần copy.',
  viz: {
    type: 'bars',
    title: 'ArrayList — chi phí tương đối các thao tác',
    unit: 'chi phí',
    items: [
      { label: 'get(index)', value: 1, note: 'O(1) — tính địa chỉ trực tiếp' },
      { label: 'add cuối', value: 2, note: 'O(1) amortized — thỉnh thoảng phải resize' },
      { label: 'add đầu', value: 90, note: 'O(n) — dịch toàn bộ sang phải' },
      { label: 'contains', value: 80, note: 'O(n) — duyệt tuần tự' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'size, capacity và cái giá của việc không đặt trước',
      code:
        'List<String> names = new ArrayList<>();   // capacity 0, mảng rỗng chia sẻ chung\n' +
        'names.add("A");                          // lần add ĐẦU TIÊN mới cấp phát 10 ô\n' +
        '\n' +
        '// size() = số phần tử thật; capacity không có API công khai\n' +
        'names.size();        // 1   <- capacity lúc này là 10\n' +
        '\n' +
        '// get(index) là O(1) vì phần tử nằm LIÊN TỤC trong bộ nhớ:\n' +
        '//   địa chỉ = base + index * 4 (hoặc 8) byte  -> không duyệt gì cả\n' +
        'names.get(0);\n' +
        '\n' +
        '// BIẾT TRƯỚC SỐ LƯỢNG thì đặt capacity ngay từ đầu:\n' +
        'List<Row> rows = new ArrayList<>(100_000);   // 1 lần cấp phát\n' +
        '// Không đặt: 0 -> 10 -> 15 -> 22 -> ... -> ~100k, khoảng 25 lần\n' +
        '// cấp phát mảng mới + copy, và tạo rác cho GC.\n' +
        '\n' +
        '// XOÁ TRONG VÒNG LẶP: bẫy kinh điển\n' +
        'for (String s : names) {\n' +
        '    if (s.isBlank()) names.remove(s);    // ConcurrentModificationException\n' +
        '}\n' +
        'names.removeIf(String::isBlank);         // cách đúng, O(n) một lượt',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1m3qwbd',
  q: 'LinkedList hoạt động thế nào?',
  answer:
    '`LinkedList` trong Java là **doubly linked list** — danh sách liên kết đôi. Đây là điểm khác biệt nền tảng so với `ArrayList`: không có mảng nào cả.\n' +
    '\n' +
    '## 1. Cấu trúc node\n' +
    '\n' +
    'Mỗi node chứa ba thứ:\n' +
    '\n' +
    '```\n' +
    'prev\n' +
    'item\n' +
    'next\n' +
    '```\n' +
    '\n' +
    'Nối lại thành chuỗi:\n' +
    '\n' +
    '```\n' +
    'null\n' +
    '  ^\n' +
    '  |\n' +
    ' [A] <-> [B] <-> [C]\n' +
    '                   |\n' +
    '                   v\n' +
    '                  null\n' +
    '```\n' +
    '\n' +
    'Với node B: `prev -> A`, `item -> B`, `next -> C`.\n' +
    '\n' +
    '`LinkedList` giữ sẵn tham chiếu tới cả `first` và `last`, nên thao tác ở hai đầu là O(1) thật sự.\n' +
    '\n' +
    '## 2. Nó implement nhiều interface\n' +
    '\n' +
    '```\n' +
    'List\n' +
    'Deque\n' +
    'Queue\n' +
    '```\n' +
    '\n' +
    'Nên nó vừa dùng được như `List`, vừa dùng được như `Queue`/`Deque`. Đây từng là lý do chính người ta chọn nó.\n' +
    '\n' +
    '## 3. Cái giá phải trả\n' +
    '\n' +
    'Mỗi phần tử không chỉ tốn chỗ cho dữ liệu mà còn tốn cả một object `Node` với hai tham chiếu. Trên JVM 64-bit thông thường, một node chiếm khoảng 24 byte header + con trỏ, trong khi `ArrayList` chỉ tốn 4 byte cho một ô tham chiếu nén.\n' +
    '\n' +
    'Tệ hơn: các node nằm **rải rác** trên heap. Duyệt danh sách nghĩa là nhảy lung tung trong bộ nhớ, mỗi bước có thể là một lần cache miss.\n' +
    '\n' +
    '## 4. Thực tế\n' +
    '\n' +
    'Ngày nay, khi cần hàng đợi hai đầu, `ArrayDeque` gần như luôn tốt hơn `LinkedList`: nó dùng mảng vòng, không tạo node, và thân thiện với cache. Bản thân tác giả của Java Collections cũng nói rằng nếu được viết lại thì `LinkedList` có lẽ không nên tồn tại.\n' +
    '\n' +
    'Câu tiếp theo sẽ so sánh trực tiếp hai cấu trúc này — và làm rõ một hiểu lầm rất phổ biến về "chèn xoá O(1)".',
  essence:
    'LinkedList là danh sách liên kết đôi, mỗi phần tử là một object Node nằm rải rác trên heap. Thao tác ở hai đầu là O(1) thật, nhưng chi phí bộ nhớ và cache miss khiến ArrayDeque hầu như luôn là lựa chọn tốt hơn.',
  example:
    'Cần một hàng đợi cho luồng xử lý sự kiện: đừng dùng `new LinkedList<>()`. `new ArrayDeque<>()` cùng API `Deque` nhưng nhanh hơn nhiều lần và tốn ít bộ nhớ hơn, vì nó là mảng vòng thay vì hàng nghìn object nhỏ.',
  viz: {
    type: 'compare',
    cols: ['ArrayList', 'LinkedList'],
    rows: [
      ['Cấu trúc', 'mảng Object[] liên tục', 'các node rải rác, nối bằng con trỏ'],
      ['Bộ nhớ mỗi phần tử', 'một ô tham chiếu', 'một object Node + 2 con trỏ'],
      ['Cache CPU', 'tốt — đọc tuần tự', 'kém — nhảy khắp heap'],
      ['Thao tác hai đầu', 'đầu O(n), cuối O(1)', 'cả hai O(1)'],
      ['Nên dùng hôm nay', 'mặc định cho List', 'gần như không — chọn ArrayDeque'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'LinkedList vừa là List vừa là Deque — nhưng vẫn nên chọn ArrayDeque',
      code:
        'LinkedList<String> ll = new LinkedList<>();\n' +
        'll.add("giữa");              // dùng như List\n' +
        'll.addFirst("đầu");          // dùng như Deque — O(1) thật\n' +
        'll.addLast("cuối");          // O(1) vì giữ sẵn tham chiếu first/last\n' +
        'll.poll();                   // dùng như Queue\n' +
        '\n' +
        '// NHƯNG get theo index phải ĐI BỘ từ đầu (hoặc từ cuối, tuỳ bên nào gần):\n' +
        'll.get(500_000);             // duyệt ~500k node -> O(n)\n' +
        '\n' +
        '// Chi phí bộ nhớ cho MỖI phần tử (JVM 64-bit, compressed oops):\n' +
        '//   ArrayList  : ~4 byte  (một ô tham chiếu trong mảng)\n' +
        '//   LinkedList : ~24 byte (object header + prev + item + next)\n' +
        '// Với 1 triệu phần tử: ~4MB so với ~24MB, và 1 triệu object cho GC quét.\n' +
        '\n' +
        '// LỰA CHỌN ĐÚNG cho hàng đợi hôm nay:\n' +
        'Deque<String> dq = new ArrayDeque<>();   // mảng vòng, không tạo node\n' +
        'dq.addFirst("a");\n' +
        'dq.addLast("b");\n' +
        '// Cùng API Deque, nhanh hơn nhiều lần, ít rác hơn hẳn.\n' +
        '// (ArrayDeque không cho phép null — đó là khác biệt duy nhất cần nhớ.)',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-123cers',
  q: 'ArrayList khác LinkedList thế nào?',
  answer:
    'Câu này gần như luôn được hỏi ngay sau hai câu trên, và cũng là nơi phần lớn ứng viên đọc thuộc một bảng sai lệch.\n' +
    '\n' +
    '## 1. Bảng so sánh\n' +
    '\n' +
    '| | ArrayList | LinkedList |\n' +
    '| --- | --- | --- |\n' +
    '| Cấu trúc bên trong | Dynamic array | Doubly linked list |\n' +
    '| `get(index)` | O(1) | O(n) |\n' +
    '| Add cuối | O(1) amortized | O(1) |\n' +
    '| Add đầu | O(n) | O(1) |\n' +
    '| Remove đầu | O(n) | O(1) |\n' +
    '| Memory | thấp hơn | cao hơn |\n' +
    '| Cache locality | tốt | kém |\n' +
    '\n' +
    '## 2. Một hiểu lầm rất phổ biến\n' +
    '\n' +
    'Nhiều người học thuộc:\n' +
    '\n' +
    '```\n' +
    'LinkedList insert/delete = O(1)\n' +
    '```\n' +
    '\n' +
    'Điều này **chưa đầy đủ**. Nếu bạn đã có sẵn tham chiếu tới node cần chèn hoặc xoá thì thao tác đúng là O(1). Nhưng nếu phải **tìm vị trí trước**:\n' +
    '\n' +
    '```java\n' +
    'list.add(500000, value);\n' +
    '```\n' +
    '\n' +
    'thì việc đi bộ tới node thứ 500.000 đã mất O(n) rồi. Tổng lại vẫn là O(n) — không hơn gì `ArrayList`.\n' +
    '\n' +
    'Nói cách khác: O(1) của `LinkedList` chỉ hiện thực khi bạn thao tác qua `Iterator` hoặc ở hai đầu danh sách.\n' +
    '\n' +
    '## 3. Vì sao ArrayList thắng ngay cả khi lý thuyết nói ngược\n' +
    '\n' +
    'Việc dịch mảng trong `ArrayList` được thực hiện bằng `System.arraycopy` — một lệnh native, copy khối liên tục, tận dụng cache tối đa. Trong khi `LinkedList` chỉ đi qua vài trăm node đã có thể tốn nhiều cache miss hơn.\n' +
    '\n' +
    'Kết quả thực đo trên phần cứng hiện đại: `ArrayList` thường nhanh hơn ngay cả ở tình huống chèn giữa, trừ khi danh sách rất lớn và bạn thao tác qua iterator.\n' +
    '\n' +
    '## 4. Kết luận thực dụng\n' +
    '\n' +
    '```\n' +
    'Cần một List?          -> ArrayList\n' +
    'Cần Queue/Deque?       -> ArrayDeque\n' +
    'Cần LinkedList?        -> gần như không bao giờ\n' +
    '```\n' +
    '\n' +
    'Trong backend Java thực tế, `ArrayList` được dùng nhiều hơn `LinkedList` rất nhiều — và đó là lựa chọn đúng, không phải thói quen xấu.',
  essence:
    'ArrayList thắng ở get(index), bộ nhớ và cache; LinkedList chỉ thắng ở thao tác hai đầu. Câu "LinkedList chèn xoá O(1)" chỉ đúng khi đã có sẵn tham chiếu node — nếu phải tìm theo index thì vẫn là O(n).',
  example:
    'Một danh sách 100.000 phần tử cần chèn liên tục vào giữa. Người ta hay nghĩ `LinkedList` sẽ nhanh hơn, nhưng benchmark thường cho kết quả ngược lại: `list.add(50000, x)` trên `LinkedList` phải đi bộ 50.000 node, còn `ArrayList` chỉ gọi một lệnh `System.arraycopy` trên khối bộ nhớ liên tục.',
  demo: [
    {
      lang: 'java',
      title: 'Vì sao "LinkedList chèn nhanh hơn" thường sai',
      code:
        '// TÌNH HUỐNG: chèn vào giữa danh sách 1 triệu phần tử\n' +
        'arrayList.add(500_000, "x");\n' +
        '//   -> System.arraycopy dịch 500k ô: MỘT lệnh native, bộ nhớ liên tục,\n' +
        '//      CPU đọc theo dòng cache 64 byte -> rất nhanh trên thực tế\n' +
        '\n' +
        'linkedList.add(500_000, "x");\n' +
        '//   -> đi bộ qua 500k node để TÌM vị trí (O(n)), mỗi bước là một lần\n' +
        '//      nhảy tới địa chỉ ngẫu nhiên trên heap -> cache miss liên tục\n' +
        '//   -> rồi mới nối con trỏ (phần O(1) mà mọi người hay nhớ)\n' +
        '\n' +
        '// O(1) của LinkedList CHỈ hiện thực khi đã có sẵn vị trí:\n' +
        'ListIterator<String> it = linkedList.listIterator();\n' +
        'while (it.hasNext()) {\n' +
        '    if (it.next().isBlank()) it.remove();   // ĐÂY mới thật sự là O(1)\n' +
        '}\n' +
        '\n' +
        '// QUY TẮC CHỌN trong thực tế:\n' +
        '//   cần List           -> new ArrayList<>()\n' +
        '//   cần Queue/Deque    -> new ArrayDeque<>()\n' +
        '//   cần LinkedList     -> hầu như không có tình huống nào',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-hr1ntm',
  q: 'ArrayList resize thế nào?',
  answer:
    'Mảng trong Java có kích thước cố định, vậy `ArrayList` "động" bằng cách nào? Câu trả lời là nó không hề mở rộng mảng — nó **thay mảng khác**.\n' +
    '\n' +
    '## 1. Ba bước\n' +
    '\n' +
    'Khi mảng nội bộ không còn đủ capacity:\n' +
    '\n' +
    '```\n' +
    'old array\n' +
    '+---+---+---+\n' +
    '| A | B | C |\n' +
    '+---+---+---+\n' +
    '```\n' +
    '\n' +
    'thêm phần tử mới thì cần một mảng lớn hơn. `ArrayList` sẽ:\n' +
    '\n' +
    '```\n' +
    '1. tạo array mới\n' +
    '2. copy phần tử cũ sang\n' +
    '3. chuyển reference sang array mới\n' +
    '```\n' +
    '\n' +
    'Kết quả:\n' +
    '\n' +
    '```\n' +
    'old\n' +
    '[A][B][C]\n' +
    '     |  resize\n' +
    '     v\n' +
    'new\n' +
    '[A][B][C][D][ ][ ][ ]\n' +
    '```\n' +
    '\n' +
    'Mảng cũ trở thành rác cho GC.\n' +
    '\n' +
    '## 2. Tăng bao nhiêu\n' +
    '\n' +
    'Trong OpenJDK hiện đại, capacity mới khoảng **1.5 lần** capacity cũ — cụ thể là `old + (old >> 1)`. Chuỗi thường thấy khi bắt đầu từ mặc định:\n' +
    '\n' +
    '```\n' +
    '10 -> 15 -> 22 -> 33 -> 49 -> 73 -> ...\n' +
    '```\n' +
    '\n' +
    'Chú ý phân biệt với `HashMap`, vốn tăng **gấp đôi** vì cần giữ capacity là luỹ thừa của 2.\n' +
    '\n' +
    '## 3. Vì sao add cuối vẫn là O(1) amortized\n' +
    '\n' +
    'Đây là điểm người phỏng vấn hay đào. Một lần resize tốn O(n) vì phải copy. Nhưng nó **hiếm khi xảy ra**, và càng ngày càng hiếm hơn: mỗi lần resize lại cho bạn thêm khoảng nửa capacity nữa để dùng.\n' +
    '\n' +
    'Chia tổng chi phí cho tổng số lần `add`, trung bình mỗi lần vẫn là hằng số. Đó là ý nghĩa của **amortized**: không phải "mọi lần đều O(1)", mà là "trung bình trên chuỗi thao tác là O(1)".\n' +
    '\n' +
    '## 4. Hệ quả thực tế\n' +
    '\n' +
    'Nếu biết trước dữ liệu lớn, hãy đặt initial capacity:\n' +
    '\n' +
    '```java\n' +
    'List<Row> rows = new ArrayList<>(100_000);\n' +
    '```\n' +
    '\n' +
    'Việc này tránh được hàng chục lần cấp phát và copy, đồng thời giảm áp lực GC. Trong vòng lặp nóng, khác biệt đo được rõ.\n' +
    '\n' +
    'Câu tiếp theo sẽ tổng hợp complexity của cả `ArrayList` lẫn `LinkedList` — và giải thích vì sao remove ở giữa lại là O(n).',
  essence:
    'ArrayList không mở rộng mảng mà tạo mảng mới lớn hơn khoảng 1.5 lần rồi copy sang. Một lần resize là O(n) nhưng ngày càng thưa dần, nên trung bình mỗi lần add cuối vẫn là hằng số — đó chính là nghĩa của amortized O(1).',
  example:
    'Đọc 1 triệu bản ghi mà không đặt capacity: JVM phải cấp phát khoảng 35 mảng liên tiếp và copy tổng cộng vài triệu tham chiếu, để lại một đống rác kích thước lớn — thứ dễ rơi thẳng vào old generation và kích hoạt full GC. Một tham số trong constructor loại bỏ toàn bộ chuyện đó.',
  demo: [
    {
      lang: 'java',
      title: 'Chuỗi resize và chi phí thật',
      code:
        '// Công thức trong OpenJDK (ArrayList.grow):\n' +
        '//   newCapacity = oldCapacity + (oldCapacity >> 1)    // ~1.5 lần\n' +
        '\n' +
        'List<Integer> l = new ArrayList<>();     // capacity 0\n' +
        'l.add(1);                                // -> 10  (mặc định khi add đầu tiên)\n' +
        '// tiếp tục add: 10 -> 15 -> 22 -> 33 -> 49 -> 73 -> 109 -> ...\n' +
        '\n' +
        '// Mỗi lần grow thực chất là:\n' +
        '//   Object[] bigger = new Object[newCap];\n' +
        '//   System.arraycopy(old, 0, bigger, 0, size);   // O(n)\n' +
        '//   elementData = bigger;                        // mảng cũ -> rác GC\n' +
        '\n' +
        '// AMORTIZED nghĩa là gì: thêm 100 phần tử vào list rỗng\n' +
        '//   số lần copy: 10 + 15 + 22 + 33 + 49 + 73 = 202 phần tử được copy\n' +
        '//   chia cho 100 lần add -> ~2 thao tác/lần = HẰNG SỐ\n' +
        '//   (không phải "mọi lần add đều O(1)", mà là trung bình trên chuỗi)\n' +
        '\n' +
        '// BIẾT TRƯỚC KÍCH THƯỚC -> bỏ hẳn chuỗi trên:\n' +
        'List<Row> rows = new ArrayList<>(expectedSize);\n' +
        '\n' +
        '// Khác biệt với HashMap: HashMap tăng GẤP ĐÔI (16 -> 32 -> 64)\n' +
        '// vì bắt buộc phải giữ capacity là luỹ thừa của 2.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1g5u185',
  q: 'Complexity của get, add, remove là bao nhiêu?',
  answer:
    'Câu này thường được hỏi như một bài kiểm tra nhanh, nhưng cách trả lời tốt là kèm luôn **lý do** cho mỗi con số.\n' +
    '\n' +
    '## 1. ArrayList\n' +
    '\n' +
    '```\n' +
    'get         O(1)\n' +
    'set         O(1)\n' +
    'add end     O(1) amortized\n' +
    'add mid     O(n)\n' +
    'remove mid  O(n)\n' +
    '```\n' +
    '\n' +
    'Tại sao remove ở giữa là O(n)? Vì mảng phải liền mạch, không được có lỗ hổng:\n' +
    '\n' +
    '```\n' +
    '[A][B][C][D][E]\n' +
    '```\n' +
    '\n' +
    'remove C:\n' +
    '\n' +
    '```\n' +
    '[A][B][D][E]\n' +
    '```\n' +
    '\n' +
    'D và E phải dịch sang trái. Trung bình phải dịch n/2 phần tử, tức O(n).\n' +
    '\n' +
    '## 2. LinkedList\n' +
    '\n' +
    '```\n' +
    'get             O(n)\n' +
    'add/remove đầu  O(1)\n' +
    'add/remove cuối O(1)\n' +
    '```\n' +
    '\n' +
    'Nhưng để tìm node theo index thì phải đi bộ:\n' +
    '\n' +
    '```\n' +
    'head -> ... -> node\n' +
    '```\n' +
    '\n' +
    'nên đó là O(n). (Java có tối ưu nhỏ: nếu index nằm ở nửa sau, nó đi ngược từ `last` — nhưng vẫn là O(n).)\n' +
    '\n' +
    '## 3. Bảng gộp cho các cấu trúc hay gặp\n' +
    '\n' +
    '| | get theo index | tìm theo giá trị | thêm cuối | thêm đầu |\n' +
    '| --- | --- | --- | --- | --- |\n' +
    '| `ArrayList` | O(1) | O(n) | O(1)* | O(n) |\n' +
    '| `LinkedList` | O(n) | O(n) | O(1) | O(1) |\n' +
    '| `ArrayDeque` | — | O(n) | O(1)* | O(1)* |\n' +
    '| `HashMap` | — | O(1) trung bình | O(1)* | — |\n' +
    '| `TreeMap` | — | O(log n) | O(log n) | — |\n' +
    '\n' +
    'Dấu `*` nghĩa là amortized.\n' +
    '\n' +
    '## 4. Một lưu ý về Big-O\n' +
    '\n' +
    'Big-O bỏ qua hằng số, mà hằng số ở đây khác nhau tới hàng chục lần. `System.arraycopy` copy 1000 tham chiếu liên tục có thể nhanh hơn việc đi qua 100 node rải rác. Vì vậy với dữ liệu nhỏ và vừa, hãy chọn theo **API phù hợp**, đừng chọn theo bảng Big-O.\n' +
    '\n' +
    'Từ đây chúng ta chuyển sang nhóm `Set` và `Map` — nơi Big-O bắt đầu thật sự quyết định, vì khác biệt là O(1) so với O(n).',
  essence:
    'ArrayList O(1) cho truy cập theo index và O(n) khi chèn/xoá giữa vì phải dịch mảng; LinkedList ngược lại. Nhưng Big-O bỏ qua hằng số, và hằng số của bộ nhớ liên tục nhỏ hơn nhiều — nên với dữ liệu vừa, hãy chọn theo API chứ đừng chọn theo bảng.',
  example:
    'Cần kiểm tra một mã sản phẩm có nằm trong danh sách 50.000 mã hay không, gọi hàng nghìn lần mỗi giây. `list.contains(code)` là O(n) và sẽ giết CPU. Đổi sang `Set<String>` cho O(1) — đây là loại tối ưu mà Big-O thật sự quyết định.',
  demo: [
    {
      lang: 'java',
      title: 'Chọn cấu trúc theo thao tác chiếm ưu thế',
      code:
        '// remove ở giữa ArrayList là O(n) vì mảng KHÔNG được có lỗ hổng:\n' +
        '//   [A][B][C][D][E]  --remove(C)-->  [A][B][D][E]\n' +
        '//   D, E phải dịch sang trái -> trung bình n/2 phép copy\n' +
        '\n' +
        '// SAI LẦM HAY GẶP: dùng List để tra cứu thành viên\n' +
        'List<String> blocked = loadBlockedCodes();   // 50.000 phần tử\n' +
        'if (blocked.contains(code)) { ... }          // O(n), gọi 1000 lần/giây\n' +
        '                                             // = 50 triệu phép so sánh/giây\n' +
        '\n' +
        '// SỬA: đổi cấu trúc, không đổi thuật toán\n' +
        'Set<String> blockedSet = new HashSet<>(loadBlockedCodes());\n' +
        'if (blockedSet.contains(code)) { ... }       // O(1) trung bình\n' +
        '\n' +
        '// Bảng chọn nhanh theo thao tác CHIẾM ƯU THẾ:\n' +
        '//   duyệt + get theo index      -> ArrayList\n' +
        '//   thêm/xoá hai đầu            -> ArrayDeque\n' +
        '//   kiểm tra tồn tại            -> HashSet\n' +
        '//   tra theo khoá               -> HashMap\n' +
        '//   cần thứ tự / truy vấn range -> TreeMap, TreeSet\n' +
        '//   giữ thứ tự chèn             -> LinkedHashMap, LinkedHashSet',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-x3tsf0',
  q: 'HashSet hoạt động thế nào?',
  answer:
    '`HashSet` là ví dụ đẹp của việc tái sử dụng: nó không tự cài đặt gì cả, mà **dùng một `HashMap` bên trong**.\n' +
    '\n' +
    '## 1. Bên trong là một HashMap\n' +
    '\n' +
    '```java\n' +
    'Set<String> set = new HashSet<>();\n' +
    'set.add("Java");\n' +
    '```\n' +
    '\n' +
    'thực chất gần giống:\n' +
    '\n' +
    '```\n' +
    'HashMap\n' +
    '\n' +
    'key       value\n' +
    '----------------\n' +
    '"Java"    PRESENT\n' +
    '```\n' +
    '\n' +
    '`PRESENT` là một object dummy dùng chung — `HashSet` chỉ quan tâm đến **key**, còn value chỉ để lấp chỗ. Trong mã nguồn JDK, `HashSet.add(e)` thực chất là `map.put(e, PRESENT) == null`.\n' +
    '\n' +
    'Cũng vì vậy, toàn bộ đặc tính của `HashSet` là đặc tính của `HashMap`: `add`, `contains`, `remove` đều O(1) trung bình, và thứ tự lặp không được đảm bảo.\n' +
    '\n' +
    '## 2. Vì vậy nó phụ thuộc vào hai method\n' +
    '\n' +
    '```\n' +
    'hashCode()\n' +
    'equals()\n' +
    '```\n' +
    '\n' +
    'để xác định một phần tử đã tồn tại hay chưa. Trước hết `hashCode()` chỉ ra bucket cần tìm; sau đó `equals()` xác nhận đúng phần tử.\n' +
    '\n' +
    'Hệ quả trực tiếp: **nếu bạn override `equals()` mà quên `hashCode()`, `HashSet` sẽ chứa hai object mà bạn coi là bằng nhau.** Đây là bug kinh điển và câu hỏi về contract giữa hai method này sẽ nói kỹ.\n' +
    '\n' +
    '## 3. Điều dễ bị bỏ qua\n' +
    '\n' +
    'Vì phụ thuộc vào `hashCode()`, `HashSet` cũng thừa hưởng cạm bẫy của **key mutable**: nếu bạn thêm một object vào set rồi sửa field tham gia tính hash, `contains()` có thể trả về `false` cho chính object đó.\n' +
    '\n' +
    'Câu tiếp theo so sánh `HashSet` với `TreeSet` — hai cách tổ chức hoàn toàn khác nhau cho cùng một khái niệm "tập hợp".',
  essence:
    'HashSet chỉ là một HashMap mà value là object dummy dùng chung, nên mọi đặc tính của nó đến từ HashMap: O(1) trung bình, không đảm bảo thứ tự, và phụ thuộc hoàn toàn vào hashCode() cùng equals().',
  example:
    'Khử trùng lặp một danh sách email: `new HashSet<>(emails)` là cách gọn nhất. Nhưng nếu phần tử là object `Customer` do bạn tự viết mà chưa override `equals`/`hashCode`, set sẽ không khử được gì cả — mỗi instance là một phần tử riêng theo địa chỉ bộ nhớ.',
  demo: [
    {
      lang: 'java',
      title: 'HashSet chính là HashMap trá hình',
      code:
        '// Mã nguồn JDK (rút gọn):\n' +
        'public class HashSet<E> {\n' +
        '    private transient HashMap<E, Object> map;\n' +
        '    private static final Object PRESENT = new Object();   // dummy DÙNG CHUNG\n' +
        '\n' +
        '    public boolean add(E e)      { return map.put(e, PRESENT) == null; }\n' +
        '    public boolean contains(Object o) { return map.containsKey(o); }\n' +
        '    public boolean remove(Object o)   { return map.remove(o) == PRESENT; }\n' +
        '}\n' +
        '// -> mọi đặc tính của HashSet đều là đặc tính của HashMap.\n' +
        '\n' +
        '// HỆ QUẢ: quên hashCode() thì Set không khử được trùng\n' +
        'class Customer {\n' +
        '    final String email;\n' +
        '    @Override public boolean equals(Object o) {          // CHỈ override equals\n' +
        '        return o instanceof Customer c && email.equals(c.email);\n' +
        '    }\n' +
        '    // THIẾU hashCode() -> dùng bản mặc định theo địa chỉ bộ nhớ\n' +
        '}\n' +
        'var set = new HashSet<Customer>();\n' +
        'set.add(new Customer("a@x.com"));\n' +
        'set.add(new Customer("a@x.com"));\n' +
        'set.size();      // 2 !  hai hashCode khác nhau -> rơi vào hai bucket khác nhau\n' +
        '                 // -> equals() không bao giờ được gọi để so sánh\n' +
        '\n' +
        '// Thêm hashCode() là xong:\n' +
        '//   @Override public int hashCode() { return email.hashCode(); }',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-3drjs8',
  q: 'HashSet khác TreeSet thế nào?',
  answer:
    'Cùng là `Set`, nhưng hai cấu trúc dữ liệu hoàn toàn khác nhau, dẫn tới hai bộ đánh đổi khác nhau.\n' +
    '\n' +
    '## 1. Bảng so sánh\n' +
    '\n' +
    '| | HashSet | TreeSet |\n' +
    '| --- | --- | --- |\n' +
    '| Structure | Hash table | Red-Black Tree |\n' +
    '| Ordering | không đảm bảo | có sort |\n' +
    '| Average search | O(1) | O(log n) |\n' +
    '| Null | thường cho phép 1 null | thường không cho null với natural ordering |\n' +
    '| Requirement | `hashCode`/`equals` | `Comparable`/`Comparator` |\n' +
    '\n' +
    '## 2. Ví dụ\n' +
    '\n' +
    '```java\n' +
    'Set<Integer> set = new TreeSet<>();\n' +
    'set.add(30);\n' +
    'set.add(10);\n' +
    'set.add(20);\n' +
    '```\n' +
    '\n' +
    'Kết quả khi lặp:\n' +
    '\n' +
    '```\n' +
    '10\n' +
    '20\n' +
    '30\n' +
    '```\n' +
    '\n' +
    'Không phải theo thứ tự chèn, mà theo **thứ tự sắp xếp**. `TreeSet` phù hợp khi cần ordered set.\n' +
    '\n' +
    '## 3. Điều TreeSet làm được mà HashSet không\n' +
    '\n' +
    'Đây mới là lý do thật sự để chọn `TreeSet`, chứ không chỉ là "có sắp xếp":\n' +
    '\n' +
    '```java\n' +
    'first(), last()                 // nhỏ nhất, lớn nhất\n' +
    'floor(x), ceiling(x)            // phần tử gần nhất phía dưới / trên\n' +
    'headSet(x), tailSet(x)          // các phần tử nhỏ hơn / lớn hơn\n' +
    'subSet(from, to)                // truy vấn khoảng\n' +
    'descendingSet()                 // duyệt ngược\n' +
    '```\n' +
    '\n' +
    'Tất cả đều là O(log n). Với `HashSet`, muốn có cùng kết quả bạn phải duyệt hết — O(n).\n' +
    '\n' +
    '## 4. Một cạm bẫy quan trọng\n' +
    '\n' +
    '`TreeSet` xác định "trùng nhau" bằng `compareTo()` trả về 0, **không** bằng `equals()`. Nếu hai method này không nhất quán, bạn sẽ gặp hành vi rất khó hiểu: một phần tử `equals` khác nhau nhưng bị `TreeSet` coi là trùng và loại bỏ.\n' +
    '\n' +
    '```\n' +
    'HashSet  : trùng  <=>  hashCode giống VÀ equals true\n' +
    'TreeSet  : trùng  <=>  compareTo() == 0\n' +
    '```\n' +
    '\n' +
    'Vì vậy tài liệu Java khuyến nghị: thứ tự tự nhiên nên **nhất quán với equals**.',
  essence:
    'HashSet là bảng băm cho O(1) nhưng không có thứ tự; TreeSet là cây đỏ-đen cho O(log n) đổi lấy khả năng sắp xếp và truy vấn khoảng. Chú ý TreeSet xác định trùng lặp bằng compareTo() == 0 chứ không bằng equals().',
  example:
    'Cần lấy "các mốc giá gần nhất phía trên và phía dưới một giá cho trước" trong một tập giá: `TreeSet.floor(price)` và `ceiling(price)` cho kết quả trong O(log n). Với `HashSet`, bạn phải duyệt toàn bộ tập mỗi lần hỏi.',
  viz: {
    type: 'compare',
    cols: ['HashSet', 'TreeSet'],
    rows: [
      ['Cấu trúc', 'bảng băm', 'cây đỏ-đen (Red-Black Tree)'],
      ['Tìm kiếm', 'O(1) trung bình', 'O(log n) đảm bảo'],
      ['Thứ tự lặp', 'không đảm bảo', 'theo thứ tự sắp xếp'],
      ['Yêu cầu ở phần tử', 'hashCode + equals', 'Comparable hoặc Comparator'],
      ['Xác định trùng', 'hashCode + equals', 'compareTo() == 0'],
      ['Truy vấn khoảng', 'không có — phải duyệt hết', 'floor/ceiling/subSet, O(log n)'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Sức mạnh thật của TreeSet: truy vấn theo thứ tự',
      code:
        'TreeSet<Integer> prices = new TreeSet<>(List.of(10, 20, 30, 50, 80));\n' +
        '\n' +
        'prices.first();          // 10   — nhỏ nhất, O(log n)\n' +
        'prices.last();           // 80\n' +
        'prices.floor(45);        // 30   — phần tử lớn nhất <= 45\n' +
        'prices.ceiling(45);      // 50   — phần tử nhỏ nhất >= 45\n' +
        'prices.subSet(20, 60);   // [20, 30, 50]  — truy vấn KHOẢNG\n' +
        'prices.descendingSet();  // [80, 50, 30, 20, 10]\n' +
        '// Với HashSet, mỗi dòng trên đều phải duyệt toàn bộ tập -> O(n).\n' +
        '\n' +
        '// CẠM BẪY: TreeSet xác định trùng bằng compareTo(), KHÔNG bằng equals()\n' +
        'record Product(String id, String name) implements Comparable<Product> {\n' +
        '    public int compareTo(Product o) { return name.compareTo(o.name); }  // so theo TÊN\n' +
        '}\n' +
        'var set = new TreeSet<Product>();\n' +
        'set.add(new Product("P1", "Áo"));\n' +
        'set.add(new Product("P2", "Áo"));   // id KHÁC, equals() = false\n' +
        'set.size();   // 1 !  vì compareTo() trả 0 -> TreeSet coi là TRÙNG\n' +
        '\n' +
        '// Quy tắc: thứ tự tự nhiên nên NHẤT QUÁN với equals.\n' +
        '// Sửa: compareTo so theo cùng tập field mà equals dùng.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-unnvtd',
  q: 'HashSet khác LinkedHashSet thế nào?',
  answer:
    '`LinkedHashSet` kế thừa ý tưởng của `HashSet` nhưng thêm một thứ: **duy trì insertion order** — thứ tự chèn.\n' +
    '\n' +
    '## 1. Ví dụ\n' +
    '\n' +
    '```java\n' +
    'Set<String> set = new LinkedHashSet<>();\n' +
    'set.add("C");\n' +
    'set.add("A");\n' +
    'set.add("B");\n' +
    '```\n' +
    '\n' +
    'Lặp qua sẽ ra đúng thứ tự đã thêm:\n' +
    '\n' +
    '```\n' +
    'C\n' +
    'A\n' +
    'B\n' +
    '```\n' +
    '\n' +
    'Trong khi `HashSet` không đảm bảo thứ tự iteration — nó phụ thuộc vào hash và capacity, và có thể đổi sau một lần resize.\n' +
    '\n' +
    '## 2. Bản chất\n' +
    '\n' +
    '`LinkedHashSet` sử dụng cấu trúc **hash + linked list**: vẫn là bảng băm để tra cứu O(1), nhưng mỗi entry còn được nối thêm vào một danh sách liên kết đôi ghi lại thứ tự.\n' +
    '\n' +
    '```\n' +
    'bảng băm  (tra cứu O(1))\n' +
    '   +\n' +
    'danh sách liên kết đôi  (giữ thứ tự chèn)\n' +
    '```\n' +
    '\n' +
    'Cái giá là mỗi phần tử tốn thêm hai tham chiếu `before`/`after`, tức nhiều bộ nhớ hơn `HashSet` khoảng 20–30%.\n' +
    '\n' +
    '## 3. Ba lựa chọn, ba loại thứ tự\n' +
    '\n' +
    '| | Thứ tự lặp | Tìm kiếm |\n' +
    '| --- | --- | --- |\n' +
    '| `HashSet` | không đảm bảo | O(1) |\n' +
    '| `LinkedHashSet` | thứ tự chèn | O(1) |\n' +
    '| `TreeSet` | thứ tự sắp xếp | O(log n) |\n' +
    '\n' +
    '## 4. Khi nào chọn LinkedHashSet\n' +
    '\n' +
    'Khi kết quả hiển thị cho người dùng và thứ tự bất ổn định trông như lỗi. Ví dụ danh sách tag đã chọn, các bước trong một quy trình, hay danh sách cột báo cáo — người dùng mong thấy đúng thứ tự họ đã tạo.\n' +
    '\n' +
    'Một lời khuyên thực dụng: trong test, `LinkedHashSet` giúp kết quả **lặp lại được**, tránh những test lúc xanh lúc đỏ vì thứ tự đổi.',
  essence:
    'LinkedHashSet là HashSet cộng thêm một danh sách liên kết đôi ghi lại thứ tự chèn, nên vẫn O(1) nhưng tốn thêm bộ nhớ. Chọn nó khi thứ tự có ý nghĩa với người dùng hoặc khi cần kết quả lặp lại được trong test.',
  example:
    'Một form cho phép chọn nhiều thẻ. Nếu dùng `HashSet`, thứ tự thẻ hiển thị lại sau khi lưu có thể khác lúc người dùng chọn — trông như bug dù không phải. `LinkedHashSet` giữ đúng thứ tự và loại bỏ hoàn toàn phản ánh loại này.',
  demo: [
    {
      lang: 'java',
      title: 'Ba loại Set và thứ tự lặp',
      code:
        'var hash   = new HashSet<>(List.of("C", "A", "B"));\n' +
        'var linked = new LinkedHashSet<>(List.of("C", "A", "B"));\n' +
        'var tree   = new TreeSet<>(List.of("C", "A", "B"));\n' +
        '\n' +
        'System.out.println(hash);     // [A, B, C] — TÌNH CỜ, không phải cam kết\n' +
        'System.out.println(linked);   // [C, A, B] — đúng thứ tự chèn\n' +
        'System.out.println(tree);     // [A, B, C] — đúng thứ tự sắp xếp\n' +
        '\n' +
        '// CẢNH BÁO: đừng bao giờ dựa vào thứ tự của HashSet.\n' +
        '// Nó phụ thuộc hashCode và capacity hiện tại, và ĐỔI sau một lần resize\n' +
        '// hoặc khi nâng phiên bản JDK.\n' +
        '\n' +
        '// Bên trong LinkedHashSet: entry có thêm 2 con trỏ giữ thứ tự\n' +
        '//   HashMap.Node      : hash, key, value, next\n' +
        '//   LinkedHashMap.Entry: ... + before, after   <- danh sách liên kết đôi\n' +
        '// -> tốn thêm ~20-30% bộ nhớ, đổi lấy thứ tự ổn định.\n' +
        '\n' +
        '// MẸO: khử trùng lặp mà VẪN giữ thứ tự gốc\n' +
        'List<String> unique = new ArrayList<>(new LinkedHashSet<>(input));',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-zb7hsy',
  q: 'HashMap hoạt động thế nào?',
  answer:
    'Đây là câu **cực kỳ quan trọng** — thường là câu mở đầu của một chuỗi mười câu đào sâu liên tiếp. Trả lời được mạch xuyên suốt của nó gần như quyết định ấn tượng cho cả phần Collections.\n' +
    '\n' +
    '## 1. Toàn cảnh một lần put\n' +
    '\n' +
    '```java\n' +
    'Map<String, Integer> map = new HashMap<>();\n' +
    'map.put("Vũ", 100);\n' +
    '```\n' +
    '\n' +
    'Quá trình đơn giản hoá:\n' +
    '\n' +
    '```\n' +
    '"Vũ"\n' +
    '  |\n' +
    '  v\n' +
    'hashCode()\n' +
    '  |\n' +
    '  v\n' +
    'hash spreading   h ^ (h >>> 16)\n' +
    '  |\n' +
    '  v\n' +
    'bucket index     (n - 1) & hash\n' +
    '  |\n' +
    '  v\n' +
    'HashMap table[index]\n' +
    '```\n' +
    '\n' +
    'Bốn bước, và mỗi bước là một câu hỏi riêng ở phần sau.\n' +
    '\n' +
    '## 2. Cấu trúc lưu trữ\n' +
    '\n' +
    '`HashMap` có một mảng bucket:\n' +
    '\n' +
    '```\n' +
    'table\n' +
    '+-----+-----+-----+-----+-----+\n' +
    '|  0  |  1  |  2  |  3  | ... |\n' +
    '+-----+-----+-----+-----+-----+\n' +
    '         |\n' +
    '         v\n' +
    '       Node\n' +
    '```\n' +
    '\n' +
    'Mỗi node chứa đại khái:\n' +
    '\n' +
    '```\n' +
    'hash\n' +
    'key\n' +
    'value\n' +
    'next\n' +
    '```\n' +
    '\n' +
    'Trường `hash` được lưu sẵn để so sánh nhanh trước khi phải gọi `equals()` — một tối ưu nhỏ nhưng hiệu quả.\n' +
    '\n' +
    'Nếu nhiều key rơi vào cùng bucket thì xảy ra **collision**, và các node nối với nhau qua `next`.\n' +
    '\n' +
    '## 3. Khi lookup\n' +
    '\n' +
    '```\n' +
    'get(key)\n' +
    '  -> tính hash, tìm bucket\n' +
    '  -> so sánh trường hash trước (rẻ)\n' +
    '  -> nếu hash giống thì mới gọi equals() (đắt)\n' +
    '  -> tìm thấy: trả value.  không: trả null\n' +
    '```\n' +
    '\n' +
    'Vì vậy `HashMap` cần **cả hai** method: `hashCode()` để tìm đúng bucket, `equals()` để xác nhận đúng key.\n' +
    '\n' +
    '## 4. Chuỗi câu hỏi sẽ đến\n' +
    '\n' +
    'Nếu người phỏng vấn mở đầu bằng câu này, rất có thể họ sẽ đi tiếp: `hashCode()` để làm gì, `equals()` để làm gì, collision xử lý ra sao, khi nào treeify, Red-Black Tree là gì, load factor, resize, vì sao capacity là luỹ thừa của 2, và vì sao lại `h ^ (h >>> 16)`.\n' +
    '\n' +
    'Toàn bộ chuỗi đó nằm ngay trong các câu tiếp theo.',
  essence:
    'HashMap lưu dữ liệu trong mảng bucket: hashCode của key được trộn lại rồi lấy vài bit thấp để chọn bucket, các key trùng bucket nối thành chuỗi và được phân biệt bằng equals(). Toàn bộ đặc tính O(1) đến từ việc chọn bucket trực tiếp thay vì duyệt.',
  example:
    'Một cache tra cứu theo mã sản phẩm với 1 triệu bản ghi: `HashMap` cho `get` gần như tức thời vì chỉ tính hash rồi nhảy thẳng vào một ô mảng. So với việc duyệt `List` 1 triệu phần tử, khác biệt là vài chục nano giây so với vài mili giây.',
  viz: {
    type: 'flow',
    title: 'map.put(key, value) đi qua những bước nào',
    nodes: ['key.hashCode()', 'h ^ (h >>> 16)', '(n-1) & hash', 'bucket', 'equals()', 'treeify'],
    steps: [
      { to: 1, label: 'lấy hashCode của key, rồi trộn 16 bit cao xuống bit thấp để giảm collision' },
      { to: 2, label: 'lấy k bit thấp làm chỉ số bucket bằng phép AND — nhanh hơn phép chia dư nhiều lần' },
      { to: 3, label: 'bucket rỗng thì chèn node mới ngay và xong' },
      { to: 4, label: 'có collision: so trường hash trước (rẻ), trùng mới gọi equals() — trùng key thì thay value, không thì nối thêm node' },
      { to: 5, label: 'chuỗi đạt 8 node và table đã >= 64 ô thì chuyển bucket sang Red-Black Tree' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Cấu trúc bên trong và đường đi của một phép put',
      code:
        '// Node trong JDK (rút gọn):\n' +
        'static class Node<K,V> {\n' +
        '    final int hash;      // LƯU SẴN — so sánh int rẻ hơn gọi equals()\n' +
        '    final K key;\n' +
        '    V value;\n' +
        '    Node<K,V> next;      // nối các key cùng bucket (collision)\n' +
        '}\n' +
        '\n' +
        '// put("Vũ", 100) đi qua:\n' +
        '//   1. h = "Vũ".hashCode()\n' +
        '//   2. hash = h ^ (h >>> 16)          <- trộn bit cao xuống\n' +
        '//   3. i = (table.length - 1) & hash  <- chọn bucket bằng phép AND\n' +
        '//   4. table[i] rỗng?  -> đặt node mới\n' +
        '//      không rỗng?     -> đi theo next, mỗi node so:\n' +
        '//                         node.hash == hash  &&  node.key.equals(key)\n' +
        '//                         trùng -> thay value;  hết chuỗi -> nối node mới\n' +
        '//   5. ++size > threshold?  -> resize()\n' +
        '\n' +
        '// VÌ SAO cần CẢ HAI method:\n' +
        'map.get("Vũ");\n' +
        '//   hashCode() -> biết PHẢI TÌM Ở BUCKET NÀO   (không có nó: phải quét cả bảng)\n' +
        '//   equals()   -> biết ĐÚNG KEY NÀO trong bucket (không có nó: không phân biệt\n' +
        '//                 được các key cùng rơi vào một bucket)',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1sng6ve',
  q: '`hashCode()` là gì?',
  answer:
    '`hashCode()` trả về một số nguyên đại diện cho object. `HashMap` dùng con số đó để xác định bucket.\n' +
    '\n' +
    '## 1. Ví dụ\n' +
    '\n' +
    '```java\n' +
    'String key = "Java";\n' +
    'int hash = key.hashCode();\n' +
    '```\n' +
    '\n' +
    'Từ số này, `HashMap` tính ra chỉ số ô trong mảng bucket — thay vì phải duyệt tìm.\n' +
    '\n' +
    '## 2. Contract quan trọng\n' +
    '\n' +
    'Nếu `a.equals(b) == true` thì bắt buộc `a.hashCode() == b.hashCode()`.\n' +
    '\n' +
    'Nhưng chiều ngược lại **không bắt buộc**:\n' +
    '\n' +
    '```\n' +
    'equals true\n' +
    '    |\n' +
    '    v\n' +
    'hashCode phải giống\n' +
    '\n' +
    'hashCode giống\n' +
    '    |\n' +
    '    v\n' +
    'KHÔNG có nghĩa equals true\n' +
    '```\n' +
    '\n' +
    'Chiều ngược lại không thể bắt buộc, vì `hashCode()` trả về `int` — chỉ có khoảng 4 tỷ giá trị, trong khi số object phân biệt được là vô hạn. Trùng hash là điều tất yếu, và đó chính là **collision**.\n' +
    '\n' +
    '## 3. Ba điều khoản đầy đủ của contract\n' +
    '\n' +
    '- **Nhất quán**: gọi nhiều lần trên cùng object không đổi, miễn là dữ liệu dùng để tính không đổi.\n' +
    '- **Tương thích với equals**: hai object bằng nhau phải có cùng hash.\n' +
    '- **Không bắt buộc phân biệt**: hai object khác nhau *nên* có hash khác nhau để hiệu năng tốt, nhưng không bắt buộc.\n' +
    '\n' +
    '## 4. Một hashCode tồi vẫn đúng nhưng rất chậm\n' +
    '\n' +
    '```java\n' +
    '@Override public int hashCode() { return 1; }   // hợp lệ về contract!\n' +
    '```\n' +
    '\n' +
    'Mọi key rơi vào cùng một bucket, `HashMap` thoái hoá thành danh sách liên kết: `get` từ O(1) tụt xuống O(n). Đây là lý do nên dùng `Objects.hash(...)` hoặc để IDE sinh, thay vì tự chế.\n' +
    '\n' +
    'Câu tiếp theo là người anh em của nó — `equals()`.',
  essence:
    'hashCode() cho HashMap biết phải tìm ở bucket nào. Contract chỉ ràng buộc một chiều: equals bằng nhau thì hash phải bằng nhau, còn hash bằng nhau không suy ra equals — vì int chỉ có 4 tỷ giá trị nên collision là tất yếu.',
  example:
    'Nếu `hashCode()` của `Order` chỉ trả về `status.ordinal()`, cả triệu đơn hàng sẽ dồn vào 5 bucket. Map vẫn cho kết quả đúng, nhưng mỗi lần `get` phải duyệt hàng trăm nghìn node — sự cố hiệu năng loại này rất khó tìm ra vì không có exception nào cả.',
  demo: [
    {
      lang: 'java',
      title: 'hashCode tốt, hashCode tồi và hashCode sai',
      code:
        '// SAI CONTRACT: equals bằng nhau nhưng hash khác nhau\n' +
        'class Bad1 {\n' +
        '    final String id;\n' +
        '    @Override public boolean equals(Object o) { return o instanceof Bad1 b && id.equals(b.id); }\n' +
        '    // thiếu hashCode -> dùng địa chỉ bộ nhớ -> HashMap/HashSet hỏng\n' +
        '}\n' +
        '\n' +
        '// ĐÚNG CONTRACT nhưng TỒI về hiệu năng\n' +
        'class Bad2 {\n' +
        '    @Override public int hashCode() { return 1; }   // hợp lệ!\n' +
        '}\n' +
        '// Mọi key vào chung 1 bucket -> HashMap thoái hoá thành linked list\n' +
        '// get() từ O(1) tụt xuống O(n). Không lỗi, chỉ là chậm khủng khiếp.\n' +
        '\n' +
        '// ĐÚNG VÀ TỐT: dùng đúng tập field mà equals dùng\n' +
        'class Good {\n' +
        '    private final String id;\n' +
        '    private final int version;\n' +
        '\n' +
        '    @Override public boolean equals(Object o) {\n' +
        '        return o instanceof Good g && version == g.version && Objects.equals(id, g.id);\n' +
        '    }\n' +
        '    @Override public int hashCode() {\n' +
        '        return Objects.hash(id, version);      // CÙNG tập field với equals\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '// GỌN NHẤT: record tự sinh cả hai theo đúng contract\n' +
        'record GoodRecord(String id, int version) { }\n' +
        '\n' +
        '// Vì sao hash giống KHÔNG suy ra equals: hashCode trả về int,\n' +
        '// chỉ ~4.3 tỷ giá trị cho vô hạn object -> trùng là tất yếu.\n' +
        '"Aa".hashCode() == "BB".hashCode();   // true! cùng 2112',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1rarfce',
  q: '`equals()` là gì?',
  answer:
    '`equals()` dùng để xác định hai object có **logical equality** hay không — nghĩa là "có được coi là cùng một giá trị" theo luật của class, chứ không phải "có cùng địa chỉ bộ nhớ".\n' +
    '\n' +
    '## 1. Ví dụ\n' +
    '\n' +
    '```java\n' +
    'String a = new String("Java");\n' +
    'String b = new String("Java");\n' +
    '```\n' +
    '\n' +
    '```\n' +
    'a == b        -> false\n' +
    'a.equals(b)   -> true\n' +
    '```\n' +
    '\n' +
    'Hai object nằm ở hai vị trí khác nhau trên heap nên `==` cho `false`. Nhưng nội dung hai chuỗi giống nhau nên `equals()` cho `true`.\n' +
    '\n' +
    '## 2. Mặc định của Object\n' +
    '\n' +
    'Nếu class của bạn không override, `Object.equals()` so sánh chính là `==`:\n' +
    '\n' +
    '```java\n' +
    'public boolean equals(Object obj) {\n' +
    '    return (this == obj);\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Nghĩa là hai object có mọi field giống hệt nhau vẫn không bằng nhau. Đây là lý do bạn phải override khi viết value object.\n' +
    '\n' +
    '## 3. Năm điều khoản của contract\n' +
    '\n' +
    'Một `equals()` đúng phải:\n' +
    '\n' +
    '- **Reflexive**: `x.equals(x)` luôn `true`\n' +
    '- **Symmetric**: `x.equals(y)` thì `y.equals(x)`\n' +
    '- **Transitive**: `x.equals(y)` và `y.equals(z)` thì `x.equals(z)`\n' +
    '- **Consistent**: gọi nhiều lần cho cùng kết quả nếu dữ liệu không đổi\n' +
    '- **Non-null**: `x.equals(null)` luôn `false`\n' +
    '\n' +
    'Điều khoản dễ vi phạm nhất là **symmetric**, thường xuất hiện khi bạn dùng `instanceof` giữa class cha và class con — một chiều cho `true`, chiều kia cho `false`.\n' +
    '\n' +
    '## 4. Hai cạm bẫy\n' +
    '\n' +
    '```java\n' +
    'public boolean equals(MyClass o) { ... }   // KHÔNG phải override!\n' +
    '```\n' +
    '\n' +
    'Tham số phải là `Object`; viết kiểu cụ thể là **overload**, và `HashMap` sẽ không bao giờ gọi tới. Annotation `@Override` sẽ bắt được lỗi này ngay lúc biên dịch.\n' +
    '\n' +
    'Cạm bẫy thứ hai: override `equals()` mà quên `hashCode()` — nội dung của câu ngay sau đây.',
  essence:
    'equals() định nghĩa "bằng nhau về mặt giá trị", khác với == vốn so sánh tham chiếu. Mặc định của Object chính là ==, nên value object phải override — và tham số bắt buộc là Object, nếu không thì đó chỉ là overload.',
  example:
    'Hai instance `Money(100, "VND")` đọc từ hai truy vấn khác nhau phải được coi là bằng nhau, nếu không thì mọi so sánh trong test lẫn trong nghiệp vụ đều sai. Ngược lại, hai `User` cùng email nhưng khác `id` thì thường không nên bằng nhau — chọn tập field cho `equals` là một quyết định thiết kế, không phải thủ tục máy móc.',
  demo: [
    {
      lang: 'java',
      title: 'Ba lỗi equals hay gặp nhất',
      code:
        '// LỖI 1: overload thay vì override — HashMap không bao giờ gọi tới\n' +
        'class Wrong1 {\n' +
        '    public boolean equals(Wrong1 o) { return true; }   // tham số SAI kiểu\n' +
        '}\n' +
        '// Cách phòng: LUÔN viết @Override, compiler sẽ báo lỗi ngay.\n' +
        '\n' +
        '// LỖI 2: vi phạm tính đối xứng (symmetric)\n' +
        'class Point { int x, y;\n' +
        '    @Override public boolean equals(Object o) {\n' +
        '        return o instanceof Point p && x == p.x && y == p.y;\n' +
        '    }\n' +
        '}\n' +
        'class ColorPoint extends Point { Color c;\n' +
        '    @Override public boolean equals(Object o) {\n' +
        '        return o instanceof ColorPoint cp && super.equals(o) && c == cp.c;\n' +
        '    }\n' +
        '}\n' +
        'Point p = new Point(1, 1);\n' +
        'ColorPoint cp = new ColorPoint(1, 1, RED);\n' +
        'p.equals(cp);    // true   <- Point chỉ so x, y\n' +
        'cp.equals(p);    // false  <- ColorPoint đòi phải là ColorPoint\n' +
        '// Không đối xứng -> List.contains() cho kết quả khác nhau tuỳ thứ tự!\n' +
        '// Cách chữa: dùng getClass() != o.getClass() thay cho instanceof,\n' +
        '// hoặc bỏ kế thừa, dùng composition.\n' +
        '\n' +
        '// LỖI 3: dùng field MUTABLE trong equals rồi đem làm key\n' +
        '//   -> xem câu "key mutable thì chuyện gì xảy ra"\n' +
        '\n' +
        '// CÁCH AN TOÀN NHẤT: để record tự sinh\n' +
        'record Money(long amount, String currency) { }   // equals/hashCode/toString chuẩn',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-azg9bq',
  q: 'Contract giữa `equals()` và `hashCode()` là gì?',
  answer:
    'Đây là câu interviewer rất thích hỏi, vì nó phát hiện được ngay người chỉ dùng thư viện và người hiểu vì sao thư viện hoạt động.\n' +
    '\n' +
    '## 1. Contract\n' +
    '\n' +
    'Nếu `a.equals(b)` là `true` thì `a.hashCode()` phải bằng `b.hashCode()`.\n' +
    '\n' +
    '```java\n' +
    'class User {\n' +
    '    private Long id;\n' +
    '\n' +
    '    @Override\n' +
    '    public boolean equals(Object o) {\n' +
    '        ...\n' +
    '    }\n' +
    '\n' +
    '    @Override\n' +
    '    public int hashCode() {\n' +
    '        ...\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '## 2. Điều gì xảy ra nếu vi phạm\n' +
    '\n' +
    'Nếu override `equals()` mà không override `hashCode()` thì có thể phá `HashMap` và `HashSet`.\n' +
    '\n' +
    '```java\n' +
    'Set<User> users = new HashSet<>();\n' +
    '```\n' +
    '\n' +
    'Tình huống xảy ra:\n' +
    '\n' +
    '```\n' +
    'User A.equals(User B) == true\n' +
    'nhưng\n' +
    'A.hashCode() != B.hashCode()\n' +
    '```\n' +
    '\n' +
    'Hai object rơi vào **hai bucket khác nhau**, nên `equals()` thậm chí không bao giờ được gọi để so sánh. `HashSet` coi chúng là hai phần tử riêng biệt.\n' +
    '\n' +
    'Triệu chứng điển hình: bạn `put` rồi `get` bằng một key "giống hệt" nhưng nhận về `null`.\n' +
    '\n' +
    '## 3. Quy tắc nhớ\n' +
    '\n' +
    '```\n' +
    'equals()   = logic equality\n' +
    'hashCode() = giúp tìm bucket nhanh\n' +
    '\n' +
    'HashMap cần cả hai.\n' +
    '```\n' +
    '\n' +
    'Cách nghĩ hình ảnh: `hashCode()` là số ngăn tủ, `equals()` là chìa khoá. Sai số ngăn thì có chìa đúng cũng vô nghĩa, vì bạn đang đứng trước ngăn khác.\n' +
    '\n' +
    '## 4. Quy tắc thực hành\n' +
    '\n' +
    '- Override **cùng nhau**, dùng **cùng một tập field**.\n' +
    '- Tập field đó nên là **immutable**.\n' +
    '- Ưu tiên `record` hoặc để IDE sinh, thay vì viết tay.\n' +
    '- Với JPA entity, cẩn thận: `id` có thể là `null` trước khi persist — đây là một trong những chỗ dễ sai nhất trong thực tế.\n' +
    '\n' +
    'Từ đây chúng ta đi vào phần kỹ thuật bên trong `HashMap`: collision và cách xử lý nó.',
  essence:
    'equals bằng nhau bắt buộc hashCode phải bằng nhau, vì hashCode quyết định bucket còn equals chỉ được gọi bên trong bucket đó. Override một mà quên cái kia khiến put rồi get bằng key giống hệt vẫn trả về null.',
  example:
    'Rất hay gặp với JPA entity dùng Lombok `@Data`: `equals`/`hashCode` được sinh từ mọi field, trong đó có collection lazy. Kết quả là gọi `hashCode()` kích hoạt lazy loading, hoặc hash đổi sau khi entity được flush — entity bỏ vào `HashSet` rồi không tìm lại được.',
  viz: {
    type: 'compare',
    cols: ['Đúng contract', 'Sai contract'],
    rows: [
      ['equals true, hash bằng nhau', 'hai object vào cùng bucket', '—'],
      ['equals true, hash khác nhau', '—', 'hai bucket khác nhau, equals không được gọi'],
      ['Triệu chứng', 'map hoạt động như mong đợi', 'put rồi get trả về null'],
      ['Set khử trùng lặp', 'đúng', 'giữ lại cả hai phần tử'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'put rồi get vẫn ra null — vì sao',
      code:
        'class OrderKey {\n' +
        '    final String shopId; final String orderNo;\n' +
        '    OrderKey(String s, String o) { shopId = s; orderNo = o; }\n' +
        '\n' +
        '    @Override public boolean equals(Object o) {\n' +
        '        return o instanceof OrderKey k\n' +
        '            && shopId.equals(k.shopId) && orderNo.equals(k.orderNo);\n' +
        '    }\n' +
        '    // QUÊN hashCode()\n' +
        '}\n' +
        '\n' +
        'var map = new HashMap<OrderKey, Order>();\n' +
        'map.put(new OrderKey("S1", "A100"), order);\n' +
        'map.get(new OrderKey("S1", "A100"));   // null !\n' +
        '\n' +
        '// VÌ SAO: hashCode mặc định lấy theo địa chỉ object\n' +
        '//   key lúc put : hash = 1a2b3c -> bucket 12\n' +
        '//   key lúc get : hash = 9f8e7d -> bucket 45\n' +
        '// HashMap tìm ở bucket 45, thấy rỗng, trả null.\n' +
        '// equals() KHÔNG HỀ được gọi — nó chỉ chạy bên trong một bucket.\n' +
        '\n' +
        '// Ví von: hashCode = SỐ NGĂN TỦ, equals = CHÌA KHOÁ.\n' +
        '// Đứng sai ngăn thì chìa đúng cũng vô dụng.\n' +
        '\n' +
        '// SỬA — hoặc thêm hashCode cùng tập field:\n' +
        '//   @Override public int hashCode() { return Objects.hash(shopId, orderNo); }\n' +
        '// Hoặc gọn hơn hẳn:\n' +
        'record OrderKey2(String shopId, String orderNo) { }\n' +
        '\n' +
        '// LƯU Ý VỚI JPA ENTITY: đừng dùng @Data của Lombok cho entity —\n' +
        '// nó đưa MỌI field vào equals/hashCode, kể cả collection lazy và id\n' +
        '// vốn còn null trước khi persist -> hash đổi sau khi lưu.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1b6uq90',
  q: 'Collision trong HashMap là gì?',
  answer:
    'Collision xảy ra khi **hai key có cùng bucket index**. Đây là hiện tượng không thể tránh, chỉ có thể giảm bớt.\n' +
    '\n' +
    '## 1. Ví dụ\n' +
    '\n' +
    '```\n' +
    'Key A --hash--> bucket 5\n' +
    'Key B --hash--> bucket 5\n' +
    '```\n' +
    '\n' +
    'Ta có:\n' +
    '\n' +
    '```\n' +
    'bucket 5\n' +
    '[A] -> [B] -> [C]\n' +
    '```\n' +
    '\n' +
    'Đây là collision.\n' +
    '\n' +
    '## 2. Hai nguyên nhân khác nhau\n' +
    '\n' +
    'Cần phân biệt rõ:\n' +
    '\n' +
    '- **Trùng hashCode**: hai key thật sự có cùng giá trị hash. Ví dụ `"Aa".hashCode()` và `"BB".hashCode()` đều bằng 2112.\n' +
    '- **Trùng bucket dù khác hash**: phổ biến hơn nhiều. Bucket index chỉ lấy vài bit thấp của hash, nên hai hash rất khác nhau vẫn có thể chỉ về cùng một ô.\n' +
    '\n' +
    '```\n' +
    'hash = ...0110 0101   -> & 1111 -> bucket 5\n' +
    'hash = ...1011 0101   -> & 1111 -> bucket 5     (khác hash, cùng bucket)\n' +
    '```\n' +
    '\n' +
    'Với một bảng 16 ô, chỉ cần 16 key là chắc chắn có collision.\n' +
    '\n' +
    '## 3. Lưu ý\n' +
    '\n' +
    'Hai key có cùng `hashCode` **chưa chắc đã bằng nhau**. Đó là lý do `HashMap` không thể dừng ở hash mà phải gọi `equals()` để xác nhận.\n' +
    '\n' +
    '## 4. Vì sao collision đáng quan tâm\n' +
    '\n' +
    'Vì nó là thứ quyết định `HashMap` có còn là O(1) hay không:\n' +
    '\n' +
    '```\n' +
    'ít collision   -> mỗi bucket 1-2 node   -> get gần như O(1)\n' +
    'nhiều collision -> bucket dài            -> get tiến tới O(n)\n' +
    '```\n' +
    '\n' +
    'Toàn bộ các kỹ thuật sau đây — hash spreading, load factor, resize, treeify — đều sinh ra để kiểm soát collision. Câu tiếp theo sẽ nói cách `HashMap` xử lý khi collision đã xảy ra.',
  essence:
    'Collision là khi hai key rơi vào cùng một bucket, và nó tất yếu vì bucket index chỉ lấy vài bit thấp của hash. Mức độ collision chính là thứ quyết định HashMap còn giữ được O(1) hay tụt về O(n).',
  example:
    'Đây từng là một lỗ hổng bảo mật thật: kẻ tấn công gửi hàng nghìn tham số HTTP có tên được chọn sao cho cùng bucket. Web framework đưa chúng vào `HashMap`, mọi key dồn vào một chuỗi, và CPU máy chủ bị chiếm 100% bởi một request duy nhất — gọi là **hash collision DoS**.',
  demo: [
    {
      lang: 'java',
      title: 'Hai loại collision và cách quan sát',
      code:
        '// LOẠI 1: trùng hashCode thật sự (hiếm nhưng có thật)\n' +
        '"Aa".hashCode();   // 2112\n' +
        '"BB".hashCode();   // 2112  <- cùng giá trị!\n' +
        '// Cũng vì vậy có thể sinh ra vô số chuỗi cùng hash:\n' +
        '// "AaAa", "AaBB", "BBAa", "BBBB" ... đều cùng hashCode.\n' +
        '\n' +
        '// LOẠI 2: khác hash nhưng cùng bucket (phổ biến hơn NHIỀU)\n' +
        'int n = 16;                 // capacity\n' +
        'int h1 = 0b0110_0101;       // 101\n' +
        'int h2 = 0b1011_0101;       // 181\n' +
        'int i1 = (n - 1) & h1;      // 5\n' +
        'int i2 = (n - 1) & h2;      // 5   <- cùng bucket dù hash rất khác\n' +
        '// Vì index chỉ lấy 4 BIT THẤP, mọi bit cao bị bỏ qua hoàn toàn.\n' +
        '\n' +
        '// HỆ QUẢ AN NINH có thật: hash collision DoS\n' +
        '//   kẻ tấn công gửi 10.000 tham số HTTP có tên cùng bucket\n' +
        '//   -> framework đưa vào HashMap -> 1 bucket dài 10.000 node\n' +
        '//   -> mỗi lần tra là 10.000 phép so sánh -> CPU 100% vì MỘT request\n' +
        '// Java 8 chống lại bằng cách treeify bucket quá dài -> O(log n).\n' +
        '\n' +
        '// Vì hash trùng KHÔNG suy ra bằng nhau, HashMap luôn phải xác nhận:\n' +
        '//   if (node.hash == hash && (node.key == key || key.equals(node.key)))',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-jkyfyz',
  q: 'HashMap xử lý collision thế nào?',
  answer:
    'Có nhiều chiến lược xử lý collision trong lý thuyết; Java chọn **separate chaining** — nối các phần tử cùng bucket thành một chuỗi.\n' +
    '\n' +
    '## 1. Bucket là một chuỗi\n' +
    '\n' +
    'Ban đầu có thể là linked list:\n' +
    '\n' +
    '```\n' +
    'bucket\n' +
    '  |\n' +
    '  v\n' +
    'Node A -> Node B -> Node C\n' +
    '```\n' +
    '\n' +
    '## 2. Khi tìm key\n' +
    '\n' +
    '```\n' +
    'hash\n' +
    '  |\n' +
    '  v\n' +
    'bucket\n' +
    '  |\n' +
    '  v\n' +
    'compare hash      (rẻ — so sánh int)\n' +
    '  |\n' +
    '  v\n' +
    'equals()          (đắt — chỉ gọi khi hash đã giống)\n' +
    '```\n' +
    '\n' +
    'Nếu tìm thấy key thì trả về value; nếu không thì chèn node mới.\n' +
    '\n' +
    'Thứ tự hai bước này là một tối ưu đáng chú ý: so sánh `int` gần như miễn phí, còn `equals()` trên một chuỗi dài hoặc một object phức tạp thì đắt. Kiểm tra rẻ trước, đắt sau.\n' +
    '\n' +
    '## 3. Khi bucket quá dài\n' +
    '\n' +
    'Từ Java 8, khi bucket quá dài và thoả điều kiện treeification, chuỗi được chuyển sang **Red-Black Tree**. Nhờ đó tình huống xấu nhất từ O(n) giảm còn O(log n).\n' +
    '\n' +
    '```\n' +
    'bucket ngắn  -> linked list  -> tìm O(k)\n' +
    'bucket dài   -> đỏ-đen tree  -> tìm O(log k)\n' +
    '```\n' +
    '\n' +
    '## 4. Một chi tiết dễ bị hỏi vặn\n' +
    '\n' +
    'Java 7 chèn node mới vào **đầu** chuỗi; Java 8 đổi sang chèn vào **cuối**. Lý do không phải hiệu năng mà là để tránh một lỗi kinh điển: trong Java 7, việc resize đồng thời từ nhiều thread có thể tạo ra **vòng lặp vô tận** trong chuỗi, khiến `get()` treo CPU ở 100% mãi mãi.\n' +
    '\n' +
    'Java 8 vẫn không làm `HashMap` thread-safe, chỉ là không còn tạo vòng lặp nữa. Câu về thread-safety phía sau sẽ nói kỹ.\n' +
    '\n' +
    'Câu tiếp theo đi vào chi tiết quá trình treeify.',
  essence:
    'Java dùng separate chaining: các key cùng bucket nối thành chuỗi, và khi tìm thì so trường hash trước rồi mới gọi equals. Bucket quá dài sẽ được chuyển thành cây đỏ-đen để tình huống xấu nhất là O(log n) thay vì O(n).',
  example:
    'Trong một map dùng `String` làm key, so sánh trường `hash` trước giúp bỏ qua gần hết các node không khớp mà không phải so từng ký tự. Với key là chuỗi dài như URL hay JSON, khác biệt này rất đáng kể.',
  viz: {
    type: 'flow',
    title: 'get(key) đi qua bucket có collision',
    nodes: ['tính hash', 'chọn bucket', 'so trường hash', 'gọi equals()', 'đi tiếp next'],
    steps: [
      { to: 1, label: 'tính hashCode rồi trộn bit, lấy (n-1) & hash để ra chỉ số bucket' },
      { to: 2, label: 'bucket rỗng thì trả null ngay; không rỗng thì so trường hash đã lưu sẵn — so int rất rẻ, loại bỏ gần hết node sai' },
      { to: 3, label: 'chỉ khi hash trùng mới gọi equals() — thao tác đắt, để sau cùng' },
      { to: 4, label: 'chưa khớp thì đi tiếp theo next; hết chuỗi mà không thấy thì trả null' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Separate chaining và tối ưu so hash trước equals',
      code:
        '// Vòng lặp tìm key trong bucket (JDK, rút gọn):\n' +
        'for (Node<K,V> e = first; e != null; e = e.next) {\n' +
        '    if (e.hash == hash &&                       // (1) so int — RẺ\n' +
        '        (e.key == key || key.equals(e.key)))    // (2) equals — ĐẮT\n' +
        '        return e;\n' +
        '}\n' +
        '// Thứ tự có chủ đích: e.hash == hash loại bỏ gần hết node sai\n' +
        '// mà không phải so từng ký tự của chuỗi dài.\n' +
        '// e.key == key kiểm tra CÙNG OBJECT trước — rẻ hơn nữa.\n' +
        '\n' +
        '// KHÁC BIỆT JAVA 7 vs 8 khi chèn node mới:\n' +
        '//   Java 7: chèn vào ĐẦU chuỗi (head insertion)\n' +
        '//   Java 8: chèn vào CUỐI chuỗi (tail insertion)\n' +
        '//\n' +
        '// Vì sao đổi: trong Java 7, hai thread cùng resize có thể ĐẢO NGƯỢC\n' +
        '// chuỗi và tạo ra vòng lặp:  A -> B -> A -> B -> ...\n' +
        '// Sau đó get() trên bucket đó lặp VÔ TẬN, CPU 100% và không bao giờ dừng.\n' +
        '// Đây là sự cố production kinh điển của HashMap dùng sai trong đa luồng.\n' +
        '//\n' +
        '// Java 8 không còn tạo vòng lặp, NHƯNG HashMap vẫn KHÔNG thread-safe:\n' +
        '// vẫn mất dữ liệu, vẫn đọc được trạng thái dở dang.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1oorltc',
  q: 'Treeify là gì?',
  answer:
    'Treeify là quá trình chuyển một bucket từ **linked list thành tree**. Đây là cải tiến quan trọng của Java 8 cho `HashMap`.\n' +
    '\n' +
    '## 1. Vấn đề\n' +
    '\n' +
    'Bucket ban đầu là một chuỗi:\n' +
    '\n' +
    '```\n' +
    'bucket\n' +
    '  |\n' +
    '  v\n' +
    'A -> B -> C -> D -> E -> F -> G -> H\n' +
    '```\n' +
    '\n' +
    'Tìm trong chuỗi này là O(n) — với n là độ dài chuỗi, không phải kích thước map.\n' +
    '\n' +
    '## 2. Sau khi treeify\n' +
    '\n' +
    '```\n' +
    '        D\n' +
    '      /   \\\n' +
    '     B     F\n' +
    '    / \\   / \\\n' +
    '   A   C E   G\n' +
    '            \\\n' +
    '             H\n' +
    '```\n' +
    '\n' +
    'Thay vì tìm tuần tự O(n), tree tìm khoảng O(log n).\n' +
    '\n' +
    '## 3. Điều kiện quan trọng\n' +
    '\n' +
    'Trong Java `HashMap`, ngưỡng treeification liên quan đến hai hằng số:\n' +
    '\n' +
    '```\n' +
    'TREEIFY_THRESHOLD    = 8\n' +
    'MIN_TREEIFY_CAPACITY = 64\n' +
    '```\n' +
    '\n' +
    'Nghĩa là bucket đủ dài **chưa chắc lập tức treeify** nếu table còn quá nhỏ — trong trường hợp đó `HashMap` ưu tiên **resize trước**. Lý do rất hợp lý: bảng nhỏ thì bucket dài thường là do thiếu chỗ chứ không phải do hash tồi, và resize sẽ tự phân tán lại.\n' +
    '\n' +
    'Có thêm hằng số thứ ba ít được nhắc:\n' +
    '\n' +
    '```\n' +
    'UNTREEIFY_THRESHOLD = 6\n' +
    '```\n' +
    '\n' +
    'Khi cây co lại còn 6 node, nó quay về linked list. Khoảng đệm giữa 8 và 6 nhằm tránh việc chuyển qua chuyển lại liên tục quanh ngưỡng.\n' +
    '\n' +
    '## 4. Vì sao chọn số 8\n' +
    '\n' +
    'Với hash phân bố tốt, xác suất một bucket có 8 phần tử là khoảng 0,00000006 theo phân phối Poisson. Nói cách khác: nếu bucket của bạn dài tới 8, gần như chắc chắn `hashCode()` của bạn có vấn đề — hoặc bạn đang bị tấn công.\n' +
    '\n' +
    'Vì vậy treeify chủ yếu là **lưới an toàn**, không phải đường chạy thường ngày. Câu tiếp theo sẽ nói về chính cấu trúc cây đó.',
  essence:
    'Treeify chuyển bucket dài từ linked list sang cây đỏ-đen để tình huống xấu nhất là O(log n). Điều kiện là chuỗi đạt 8 node VÀ bảng đã có ít nhất 64 ô — bảng nhỏ hơn thì HashMap chọn resize trước, vì bucket dài lúc đó là do thiếu chỗ.',
  example:
    'Một hệ thống dùng `HashMap` với key là object tự viết có `hashCode()` chỉ dựa trên một field ít giá trị. Nhờ treeify, hiệu năng xấu nhất chỉ giảm còn O(log n) thay vì sập hẳn — nhưng đó là dấu hiệu cần sửa `hashCode()`, không phải lý do để yên tâm.',
  viz: {
    type: 'compare',
    cols: ['Bucket dạng chuỗi', 'Bucket đã treeify'],
    rows: [
      ['Cấu trúc', 'linked list', 'cây đỏ-đen'],
      ['Tìm kiếm trong bucket', 'O(k)', 'O(log k)'],
      ['Điều kiện chuyển sang', 'mặc định', 'chuỗi >= 8 VÀ table >= 64'],
      ['Quay lại chuỗi khi', '—', 'còn <= 6 node'],
      ['Yêu cầu ở key', 'chỉ equals', 'so sánh được, hoặc dùng hash và tên class'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Ba hằng số quyết định treeify',
      code:
        '// Trong java.util.HashMap:\n' +
        'static final int TREEIFY_THRESHOLD    = 8;    // chuỗi dài >= 8  -> xét treeify\n' +
        'static final int UNTREEIFY_THRESHOLD  = 6;    // cây còn <= 6    -> quay về list\n' +
        'static final int MIN_TREEIFY_CAPACITY = 64;   // table phải >= 64 ô\n' +
        '\n' +
        '// Logic thật (rút gọn) khi một bucket vượt ngưỡng:\n' +
        'if (binCount >= TREEIFY_THRESHOLD - 1) {\n' +
        '    treeifyBin(tab, hash);\n' +
        '}\n' +
        'final void treeifyBin(Node<K,V>[] tab, int hash) {\n' +
        '    if (tab == null || tab.length < MIN_TREEIFY_CAPACITY)\n' +
        '        resize();          // <- bảng còn nhỏ: MỞ RỘNG chứ không dựng cây\n' +
        '    else\n' +
        '        // chuyển chuỗi thành cây đỏ-đen\n' +
        '}\n' +
        '\n' +
        '// VÌ SAO số 8: với hash phân bố tốt, theo phân phối Poisson\n' +
        '//   bucket có 1 phần tử : ~0.30\n' +
        '//   bucket có 2 phần tử : ~0.15\n' +
        '//   ...\n' +
        '//   bucket có 8 phần tử : ~0.00000006\n' +
        '// -> chạm 8 nghĩa là hashCode() của bạn tồi, hoặc đang bị tấn công.\n' +
        '// Treeify là LƯỚI AN TOÀN, không phải đường chạy thường ngày.\n' +
        '\n' +
        '// Khoảng đệm 8 <-> 6 để tránh chuyển qua chuyển lại liên tục\n' +
        '// khi số node dao động quanh ngưỡng (hysteresis).',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1m46fze',
  q: 'Red-Black Tree trong HashMap dùng để làm gì?',
  answer:
    '**Red-Black Tree** là cây tìm kiếm nhị phân **tự cân bằng**. Trong `HashMap`, nó được dùng để xử lý những bucket có quá nhiều collision.\n' +
    '\n' +
    '## 1. Ý tưởng\n' +
    '\n' +
    'Mỗi node được đánh dấu màu:\n' +
    '\n' +
    '```\n' +
    'RED\n' +
    'hoặc\n' +
    'BLACK\n' +
    '```\n' +
    '\n' +
    'Các quy tắc về màu giúp cây không bị lệch quá nhiều. Mục tiêu là để:\n' +
    '\n' +
    '```\n' +
    'search\n' +
    'insert\n' +
    'delete\n' +
    '```\n' +
    '\n' +
    'đều có complexity khoảng `O(log n)`.\n' +
    '\n' +
    '## 2. Vì sao không dùng BST thường\n' +
    '\n' +
    'BST thường có thể bị biến thành:\n' +
    '\n' +
    '```\n' +
    'A\n' +
    ' \\\n' +
    '  B\n' +
    '   \\\n' +
    '    C\n' +
    '     \\\n' +
    '      D\n' +
    '```\n' +
    '\n' +
    'Khi dữ liệu vào theo thứ tự tăng dần, cây suy biến thành danh sách và trở lại O(n) — đúng cái mà ta đang muốn tránh. Red-Black Tree giữ chiều cao ở mức logarithmic bằng **rotation** và **recoloring** sau mỗi lần chèn/xoá.\n' +
    '\n' +
    '## 3. Chi tiết riêng của HashMap\n' +
    '\n' +
    'Có một câu hỏi thú vị: cây tìm kiếm cần so sánh các key, nhưng key của `HashMap` đâu bắt buộc phải `Comparable`?\n' +
    '\n' +
    '`HashMap` xử lý theo thứ tự ưu tiên:\n' +
    '\n' +
    '```\n' +
    '1. so theo trường hash đã lưu\n' +
    '2. nếu hash bằng nhau và key là Comparable -> compareTo()\n' +
    '3. nếu vẫn không phân định -> so theo tên class, rồi identityHashCode\n' +
    '```\n' +
    '\n' +
    'Bước thứ ba là một giải pháp thoả hiệp: nó không có ý nghĩa thứ tự nào, chỉ cần **ổn định** để cây hoạt động được.\n' +
    '\n' +
    '## 4. Vì sao chọn Red-Black chứ không phải AVL\n' +
    '\n' +
    'AVL cân bằng chặt hơn nên tìm kiếm nhanh hơn chút, nhưng phải xoay nhiều hơn khi chèn và xoá. `HashMap` cần cân bằng giữa đọc và ghi, nên Red-Black là lựa chọn hợp lý hơn.\n' +
    '\n' +
    'Cùng cấu trúc này còn được dùng ở `TreeMap` và `TreeSet` — nơi nó là cấu trúc chính chứ không phải phương án dự phòng.',
  essence:
    'Red-Black Tree là cây nhị phân tự cân bằng bằng đổi màu và xoay, giữ chiều cao logarithmic nên mọi thao tác là O(log n). HashMap dùng nó làm phương án dự phòng cho bucket quá dài, còn TreeMap/TreeSet dùng nó làm cấu trúc chính.',
  example:
    'Nếu key được chèn theo thứ tự tăng dần vào một BST thường, cây suy biến thành danh sách và tra cứu trở lại O(n) — đúng kịch bản mà kẻ tấn công muốn. Red-Black Tree tự xoay lại sau mỗi lần chèn nên chiều cao luôn bị chặn.',
  demo: [
    {
      lang: 'java',
      title: 'Cách HashMap so sánh key trong cây khi key không Comparable',
      code:
        '// Cây tìm kiếm cần THỨ TỰ, nhưng key của HashMap không bắt buộc Comparable.\n' +
        '// HashMap giải quyết theo ba bước (TreeNode.find / comparableClassFor):\n' +
        '\n' +
        '//   1. so theo trường hash đã lưu sẵn\n' +
        'if (ph > h)      dir = -1;\n' +
        'else if (ph < h) dir =  1;\n' +
        '\n' +
        '//   2. hash bằng nhau -> nếu key là Comparable thì dùng compareTo()\n' +
        'else if ((kc = comparableClassFor(k)) != null)\n' +
        '    dir = compareComparables(kc, k, pk);\n' +
        '\n' +
        '//   3. vẫn không phân định -> tiebreak theo tên class rồi identityHashCode\n' +
        'static int tieBreakOrder(Object a, Object b) {\n' +
        '    int d = a.getClass().getName().compareTo(b.getClass().getName());\n' +
        '    if (d == 0) d = System.identityHashCode(a) <= System.identityHashCode(b) ? -1 : 1;\n' +
        '    return d;\n' +
        '}\n' +
        '// Bước 3 KHÔNG mang ý nghĩa thứ tự nào — chỉ cần ỔN ĐỊNH để cây chạy được.\n' +
        '\n' +
        '// VÌ SAO Red-Black chứ không phải AVL:\n' +
        '//   AVL cân bằng chặt hơn -> tìm nhanh hơn chút, nhưng XOAY NHIỀU hơn\n' +
        '//   khi chèn/xoá. HashMap cần cân bằng cả đọc lẫn ghi -> Red-Black hợp hơn.\n' +
        '\n' +
        '// Cùng cấu trúc này là NỀN của TreeMap và TreeSet,\n' +
        '// nơi nó là cấu trúc chính chứ không phải phương án dự phòng.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-k2brfp',
  q: 'Load factor là gì?',
  answer:
    'Load factor xác định **khi nào `HashMap` nên resize**. Nó là một trong hai tham số bạn có thể truyền vào constructor.\n' +
    '\n' +
    '## 1. Công thức\n' +
    '\n' +
    'Giá trị mặc định thường là `0.75`. Công thức đơn giản:\n' +
    '\n' +
    '```\n' +
    'threshold = capacity x loadFactor\n' +
    '```\n' +
    '\n' +
    'Ví dụ:\n' +
    '\n' +
    '```\n' +
    'capacity   = 16\n' +
    'loadFactor = 0.75\n' +
    'threshold  = 12\n' +
    '```\n' +
    '\n' +
    'Khi `size` vượt threshold thì resize.\n' +
    '\n' +
    '## 2. Tại sao không dùng 1.0\n' +
    '\n' +
    'Nếu bucket quá đầy:\n' +
    '\n' +
    '```\n' +
    'collision tăng\n' +
    'performance giảm\n' +
    '```\n' +
    '\n' +
    'Điều quan trọng cần hiểu: collision bắt đầu xuất hiện **rất sớm**, không phải khi bảng đầy. Theo nghịch lý ngày sinh, chỉ cần khoảng √n phần tử là đã có collision đầu tiên với xác suất cao. Chờ tới `loadFactor = 1.0` là quá muộn.\n' +
    '\n' +
    '## 3. Tại sao không dùng số quá thấp\n' +
    '\n' +
    'Nếu load factor quá thấp:\n' +
    '\n' +
    '```\n' +
    'ít collision\n' +
    'nhưng\n' +
    'memory lãng phí\n' +
    '```\n' +
    '\n' +
    'Và còn một cái giá nữa: bảng lớn hơn thì dữ liệu nằm thưa hơn trong bộ nhớ, cache CPU kém hiệu quả hơn.\n' +
    '\n' +
    '## 4. Vì sao là 0.75\n' +
    '\n' +
    '```\n' +
    '0.75 là trade-off giữa:\n' +
    '\n' +
    'memory\n' +
    '   vs\n' +
    'lookup performance\n' +
    '```\n' +
    '\n' +
    'Tài liệu JDK còn nêu một lý do đẹp: với `0.75`, phân phối số phần tử trong bucket tuân theo Poisson với tham số 0.5, cho xác suất bucket dài rất thấp. Ngoài ra `0.75 = 3/4` tính được bằng dịch bit, không cần phép nhân thực.\n' +
    '\n' +
    'Thực tế: gần như không bao giờ nên đổi giá trị này. Thứ đáng chỉnh là **initial capacity**, chứ không phải load factor. Câu tiếp theo sẽ nói rõ về resize.',
  essence:
    'Load factor 0.75 quyết định ngưỡng resize theo công thức capacity × loadFactor. Nó là điểm cân bằng giữa bộ nhớ và tốc độ tra cứu — trong thực tế hầu như không nên đổi, thứ đáng chỉnh là initial capacity.',
  example:
    'Cần một map chứa 1000 phần tử. Nếu dùng `new HashMap<>()` mặc định, JVM sẽ resize 7 lần và rehash lại toàn bộ. Đặt `new HashMap<>(1400)` cho đủ chỗ ngay từ đầu — chú ý chia cho 0.75, vì threshold mới là con số thật sự giới hạn.',
  demo: [
    {
      lang: 'java',
      title: 'Tính initial capacity cho đúng',
      code:
        '// threshold = capacity * loadFactor\n' +
        'new HashMap<>();              // capacity 16, threshold 12\n' +
        '// -> chèn phần tử thứ 13 là resize, DÙ mới dùng 12/16 ô\n' +
        '\n' +
        '// SAI LẦM HAY GẶP: truyền thẳng số phần tử dự kiến\n' +
        'Map<String,Row> m = new HashMap<>(1000);\n' +
        '// capacity làm tròn lên luỹ thừa 2 = 1024, threshold = 768\n' +
        '// -> chèn tới phần tử 769 VẪN resize. Không đạt mục đích.\n' +
        '\n' +
        '// ĐÚNG: chia cho load factor\n' +
        'Map<String,Row> m2 = new HashMap<>((int) (1000 / 0.75f) + 1);   // 1334 -> 2048\n' +
        '\n' +
        '// GỌN VÀ RÕ HƠN (Java 19+):\n' +
        'Map<String,Row> m3 = HashMap.newHashMap(1000);   // tự tính hộ\n' +
        '\n' +
        '// VÌ SAO 0.75 chứ không phải 1.0:\n' +
        '//   Collision xuất hiện RẤT SỚM (nghịch lý ngày sinh): với bảng n ô,\n' +
        '//   chỉ cần ~sqrt(n) phần tử là đã có collision đầu tiên.\n' +
        '//   Với n = 16 -> chỉ 4-5 phần tử. Chờ tới 1.0 là quá muộn.\n' +
        '//\n' +
        '// VÌ SAO không dùng 0.5:\n' +
        '//   tốn gấp đôi bộ nhớ, và bảng thưa hơn -> cache CPU kém hơn.\n' +
        '//\n' +
        '// 0.75 = 3/4 còn tính được bằng dịch bit, không cần phép nhân thực.\n' +
        '// Kết luận: đừng đổi load factor, hãy đặt đúng initial capacity.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1amrer8',
  q: 'Resize của HashMap xảy ra khi nào?',
  answer:
    'Resize là thao tác đắt nhất trong vòng đời một `HashMap`, và nó xảy ra âm thầm.\n' +
    '\n' +
    '## 1. Điều kiện\n' +
    '\n' +
    '```\n' +
    'capacity   = 16\n' +
    'loadFactor = 0.75\n' +
    'threshold  = 12\n' +
    '```\n' +
    '\n' +
    'Khi số phần tử vượt threshold thì resize. Capacity thường **tăng gấp đôi**:\n' +
    '\n' +
    '```\n' +
    '16 -> 32 -> 64 -> 128\n' +
    '```\n' +
    '\n' +
    'Chú ý khác biệt với `ArrayList` vốn tăng 1.5 lần: `HashMap` phải giữ capacity là luỹ thừa của 2, nên chỉ có thể nhân đôi.\n' +
    '\n' +
    '## 2. Vì sao đắt\n' +
    '\n' +
    'Resize có cost vì phải phân bố lại toàn bộ cấu trúc bucket. Mọi entry đều phải được đặt lại vị trí trong bảng mới.\n' +
    '\n' +
    'Đây là lý do nếu biết trước số lượng dữ liệu lớn, nên cân nhắc initial capacity phù hợp.\n' +
    '\n' +
    '## 3. Một tối ưu rất đẹp của Java 8\n' +
    '\n' +
    'Java 7 phải tính lại chỉ số bucket cho từng entry. Java 8 nhận ra một tính chất: khi capacity nhân đôi, mỗi entry chỉ có đúng **hai** khả năng.\n' +
    '\n' +
    '```\n' +
    'capacity 16 -> 32,  entry đang ở bucket i\n' +
    '\n' +
    'bit mới (giá trị 16) trong hash bằng 0  ->  ở lại bucket i\n' +
    'bit mới bằng 1                          ->  chuyển tới bucket i + 16\n' +
    '```\n' +
    '\n' +
    'Nhờ vậy `HashMap` chỉ cần tách mỗi chuỗi thành hai chuỗi con — không phải tính lại hash, không phải chia dư.\n' +
    '\n' +
    '## 4. Chi phí thực tế\n' +
    '\n' +
    'Một `HashMap` đi từ rỗng tới 1 triệu phần tử phải resize khoảng 17 lần, và lần cuối cùng phải di chuyển ~1 triệu entry cùng lúc — một đợt tạm dừng đủ để thấy trong biểu đồ độ trễ.\n' +
    '\n' +
    'Với `ConcurrentHashMap` thì tệ hơn nữa vì resize phải phối hợp giữa các thread. Đặt đúng initial capacity là một trong những tối ưu rẻ nhất mà bạn có thể làm.',
  essence:
    'HashMap resize khi size vượt capacity × loadFactor, và luôn nhân đôi capacity để giữ tính chất luỹ thừa của 2. Java 8 tối ưu bằng cách tách mỗi chuỗi thành hai — entry chỉ có thể ở lại chỗ cũ hoặc dời đúng một khoảng bằng capacity cũ.',
  example:
    'Một service nạp bảng tra cứu 2 triệu dòng vào `HashMap` lúc khởi động. Không đặt capacity, quá trình nạp mất vài giây và sinh ra hàng chục mảng lớn cho GC dọn. Đặt sẵn capacity, thời gian nạp giảm rõ rệt và biểu đồ GC phẳng hẳn.',
  viz: {
    type: 'flow',
    title: 'Một lần resize từ 16 lên 32',
    nodes: ['size > threshold', 'cấp mảng gấp đôi', 'duyệt bucket cũ', 'xét bit mới', 'tách lo / hi'],
    steps: [
      { to: 0, label: 'size vượt threshold — ví dụ chèn phần tử thứ 13 khi capacity là 16' },
      { to: 1, label: 'cấp mảng mới newCap = oldCap << 1, threshold cũng nhân đôi theo' },
      { to: 2, label: 'duyệt từng bucket cũ, mỗi chuỗi sẽ được tách làm hai' },
      { to: 3, label: 'xét đúng MỘT bit mới của hash: (hash & oldCap) bằng 0 hay khác 0' },
      { to: 4, label: 'bit bằng 0 thì ở lại bucket i, bằng 1 thì sang bucket i + oldCap — không phải tính lại hash cho entry nào' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Vì sao Java 8 không phải tính lại hash khi resize',
      code:
        '// Khi capacity 16 -> 32, mặt nạ index đổi từ 0b01111 sang 0b11111:\n' +
        '//   chỉ THÊM đúng 1 bit (bit có giá trị 16).\n' +
        '// -> mỗi entry chỉ có HAI khả năng, không cần tính lại gì:\n' +
        '\n' +
        'hash = ...0_0101   & 01111 = 5    // bit mới = 0 -> Ở LẠI bucket 5\n' +
        'hash = ...1_0101   & 11111 = 21   // bit mới = 1 -> SANG bucket 5 + 16 = 21\n' +
        '\n' +
        '// Code JDK 8 (rút gọn) — tách mỗi chuỗi thành hai chuỗi con:\n' +
        'if ((e.hash & oldCap) == 0) { /* nối vào loHead */ }   // ở lại index j\n' +
        'else                        { /* nối vào hiHead */ }   // sang index j + oldCap\n' +
        'newTab[j]          = loHead;\n' +
        'newTab[j + oldCap] = hiHead;\n' +
        '// Java 7 phải gọi indexFor() lại cho từng entry -> chậm hơn.\n' +
        '\n' +
        '// CHI PHÍ THẬT: từ rỗng lên 1 triệu phần tử\n' +
        '//   16 -> 32 -> ... -> 2.097.152 : khoảng 17 lần resize\n' +
        '//   lần cuối phải dời ~1 triệu entry TRONG MỘT LẦN -> khựng thấy rõ\n' +
        '// Với ConcurrentHashMap còn tệ hơn vì phải phối hợp giữa các thread.\n' +
        '\n' +
        '// Vì sao HashMap nhân ĐÔI mà ArrayList chỉ 1.5 lần:\n' +
        '// HashMap BẮT BUỘC giữ capacity là luỹ thừa của 2 để dùng phép AND.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1i151i5',
  q: 'Tại sao capacity của HashMap thường là power of 2?',
  answer:
    'Câu hỏi này kiểm tra xem bạn có tò mò về phần bên trong hay chỉ dùng API.\n' +
    '\n' +
    '## 1. Các giá trị capacity\n' +
    '\n' +
    '```\n' +
    '16\n' +
    '32\n' +
    '64\n' +
    '128\n' +
    '256\n' +
    '```\n' +
    '\n' +
    'Lý do quan trọng là giúp tính bucket index hiệu quả bằng **bit operation**.\n' +
    '\n' +
    '## 2. Thay phép chia dư bằng phép AND\n' +
    '\n' +
    'Thay vì:\n' +
    '\n' +
    '```java\n' +
    'hash % n\n' +
    '```\n' +
    '\n' +
    '`HashMap` có thể dùng:\n' +
    '\n' +
    '```java\n' +
    '(hash & (n - 1))\n' +
    '```\n' +
    '\n' +
    'với `n` là luỹ thừa của 2.\n' +
    '\n' +
    '```\n' +
    'n     = 16  =  10000\n' +
    'n - 1 = 15  =  01111\n' +
    '```\n' +
    '\n' +
    'Mask này giúp lấy các bit thấp của hash rất nhanh. Phép chia số nguyên tốn khoảng 20–40 chu kỳ CPU, trong khi AND tốn 1 chu kỳ — và đây là thao tác chạy trong **mọi** lần `get` và `put`.\n' +
    '\n' +
    '## 3. Còn hai lợi ích nữa ít được nhắc\n' +
    '\n' +
    '**Resize rẻ hơn.** Khi nhân đôi capacity, mặt nạ chỉ thêm đúng một bit, nên mỗi entry chỉ có hai khả năng: ở lại chỗ cũ, hoặc dời đi đúng `oldCap` ô. Không cần tính lại hash.\n' +
    '\n' +
    '**Phép AND không âm.** Với `hash % n` trên số âm, Java trả về kết quả âm — sẽ gây `ArrayIndexOutOfBoundsException`. Phép AND với `n-1` luôn cho kết quả trong khoảng `[0, n-1]`.\n' +
    '\n' +
    '## 4. Cái giá và cách bù\n' +
    '\n' +
    'Đánh đổi là: phép AND chỉ dùng **các bit thấp**, hoàn toàn bỏ qua bit cao. Nếu `hashCode()` có phân bố kém ở phần thấp thì mọi key dồn vào ít bucket.\n' +
    '\n' +
    'Đó chính là lý do tồn tại của bước hash spreading `h ^ (h >>> 16)` — hai câu tiếp theo sẽ đi vào đúng chỗ này.\n' +
    '\n' +
    'Cuối cùng, một chi tiết thực dụng: nếu bạn truyền `new HashMap<>(100)`, JDK tự làm tròn lên 128. Bạn không đặt được capacity không phải luỹ thừa của 2.',
  essence:
    'Capacity luỹ thừa của 2 cho phép thay phép chia dư bằng phép AND một chu kỳ CPU, đồng thời khiến resize chỉ cần tách chuỗi làm đôi và loại bỏ nguy cơ index âm. Cái giá là chỉ dùng bit thấp, và bước trộn hash sinh ra để bù lại.',
  example:
    'Thao tác tính index chạy trong mọi lần `get`/`put`. Với một service xử lý hàng triệu lượt tra cứu mỗi giây, thay phép chia bằng phép AND là khác biệt đo được — đó là lý do JDK chấp nhận ràng buộc luỹ thừa của 2 cho toàn bộ thiết kế.',
  demo: [
    {
      lang: 'java',
      title: 'AND thay cho chia dư, và vì sao phải luỹ thừa 2',
      code:
        '// Với n là luỹ thừa của 2, hai biểu thức cho CÙNG kết quả:\n' +
        'int n = 16;\n' +
        'int hash = 0b1011_0110;      // 182\n' +
        '\n' +
        'hash % n;                    // 6   — phép chia: ~20-40 chu kỳ CPU\n' +
        'hash & (n - 1);              // 6   — phép AND : 1 chu kỳ\n' +
        '\n' +
        '//   1011 0110\n' +
        '// & 0000 1111    (n-1 = 15)\n' +
        '//   ---------\n' +
        '//   0000 0110    -> bucket 6\n' +
        '\n' +
        '// LỢI ÍCH 2 — không bao giờ ra index âm:\n' +
        '(-7) % 16;                   // -7  -> ArrayIndexOutOfBoundsException!\n' +
        '(-7) & 15;                   //  9  -> luôn nằm trong [0, n-1]\n' +
        '\n' +
        '// LỢI ÍCH 3 — resize chỉ thêm ĐÚNG MỘT BIT vào mặt nạ:\n' +
        '//   16 -> 32 :  01111  ->  11111\n' +
        '//   entry chỉ có 2 khả năng: ở lại i, hoặc sang i + 16\n' +
        '\n' +
        '// CÁI GIÁ: chỉ dùng BIT THẤP, bỏ qua hoàn toàn bit cao\n' +
        '//   -> hashCode phân bố kém ở phần thấp = mọi key dồn vào vài bucket\n' +
        '//   -> đây chính là lý do có bước h ^ (h >>> 16)\n' +
        '\n' +
        '// JDK tự làm tròn LÊN luỹ thừa 2, bạn không đặt được số khác:\n' +
        'new HashMap<>(100);          // capacity thật = 128\n' +
        'new HashMap<>(1000);         // capacity thật = 1024',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1dkbmk8',
  q: 'Vì sao HashMap dùng `(n - 1) & hash` để tính bucket index?',
  answer:
    'Đây là câu nên hiểu bản chất, vì nó nối thẳng với hai câu trước và sau.\n' +
    '\n' +
    '## 1. Tính toán cụ thể\n' +
    '\n' +
    'Giả sử `n = 16`, thì `n - 1 = 15`, nhị phân là `01111`.\n' +
    '\n' +
    'Nếu `hash = 10110110` thì:\n' +
    '\n' +
    '```\n' +
    '  10110110\n' +
    '&\n' +
    '  00001111\n' +
    '  ----------\n' +
    '  00000110\n' +
    '```\n' +
    '\n' +
    'Kết quả là bucket `6`.\n' +
    '\n' +
    '## 2. Tại sao không dùng `%`\n' +
    '\n' +
    'Với capacity là luỹ thừa của 2:\n' +
    '\n' +
    '```\n' +
    'hash % 16\n' +
    '```\n' +
    '\n' +
    'tương đương về mặt kết quả với:\n' +
    '\n' +
    '```\n' +
    'hash & 15\n' +
    '```\n' +
    '\n' +
    'nhưng bitwise operation rất hiệu quả. Với số dương hai biểu thức cho kết quả giống nhau; với số âm thì `%` cho kết quả âm còn `&` thì không — thêm một lý do để chọn `&`.\n' +
    '\n' +
    '## 3. Điều kiện\n' +
    '\n' +
    'Điều này chỉ đúng khi:\n' +
    '\n' +
    '```\n' +
    'n = 2^k\n' +
    '```\n' +
    '\n' +
    'Nếu capacity không phải luỹ thừa của 2, mặt nạ `n-1` sẽ có bit 0 xen giữa, và một số bucket **không bao giờ được chọn tới**. Ví dụ với `n = 12`, mặt nạ là `1011` — bucket nào có bit thứ 3 bật đều bị bỏ trống.\n' +
    '\n' +
    'Đây là lý do `HashMap` bắt buộc làm tròn capacity lên luỹ thừa của 2.\n' +
    '\n' +
    '## 4. Hệ quả cần nhớ\n' +
    '\n' +
    'Vì phép AND này chỉ giữ lại `k` bit thấp, toàn bộ phần cao của `hashCode()` bị vứt bỏ. Một `hashCode()` phân biệt rất tốt ở bit cao nhưng đơn điệu ở bit thấp sẽ khiến `HashMap` hoạt động tệ.\n' +
    '\n' +
    'Câu tiếp theo — về `h ^ (h >>> 16)` — chính là lời giải cho vấn đề vừa nêu.',
  essence:
    'Với capacity luỹ thừa của 2, phép AND với n-1 tương đương phép chia dư nhưng nhanh hơn nhiều lần và không bao giờ ra số âm. Đổi lại nó chỉ dùng k bit thấp của hash, nên phần cao bị vứt bỏ hoàn toàn.',
  example:
    'Nếu key là số nguyên bội của 16 — như id sinh theo lô, hay địa chỉ bộ nhớ đã căn chỉnh — thì bốn bit thấp của chúng luôn là 0. Mọi key dồn vào bucket 0, và `HashMap` trở thành một danh sách liên kết.',
  demo: [
    {
      lang: 'java',
      title: 'Điều gì xảy ra nếu capacity không phải luỹ thừa của 2',
      code:
        '// TRƯỜNG HỢP ĐÚNG: n = 16, mặt nạ 01111 — mọi bucket 0..15 đều tới được\n' +
        'for (int h = 0; h < 32; h++) System.out.print((h & 15) + " ");\n' +
        '// 0 1 2 ... 15 0 1 2 ... 15     <- phân bố đều\n' +
        '\n' +
        '// TRƯỜNG HỢP SAI: n = 12, mặt nạ 11 = 1011\n' +
        'for (int h = 0; h < 16; h++) System.out.print((h & 11) + " ");\n' +
        '// 0 1 2 3 0 1 2 3 8 9 10 11 8 9 10 11\n' +
        '// -> các bucket 4, 5, 6, 7 KHÔNG BAO GIỜ được dùng!\n' +
        '// Vì mặt nạ có bit 0 ở giữa (1011), bit đó luôn bị xoá.\n' +
        '// Đây là lý do HashMap BẮT BUỘC làm tròn lên luỹ thừa của 2.\n' +
        '\n' +
        '// HỆ QUẢ THỰC TẾ: key có bit thấp đơn điệu -> thảm hoạ\n' +
        'class BatchId {\n' +
        '    final long id;                    // luôn là bội của 16 (sinh theo lô)\n' +
        '    @Override public int hashCode() { return (int) id; }\n' +
        '}\n' +
        '// id = 16, 32, 48, 64 ... -> 4 bit thấp LUÔN là 0000\n' +
        '// -> (n-1) & hash == 0 với mọi key -> TẤT CẢ vào bucket 0\n' +
        '// -> HashMap thoái hoá thành linked list, get() = O(n)\n' +
        '\n' +
        '// May là bước h ^ (h >>> 16) trộn bit cao xuống, giảm nhẹ tình huống này.\n' +
        '// Nhưng cách chữa đúng vẫn là viết hashCode() phân bố tốt:\n' +
        '//   @Override public int hashCode() { return Long.hashCode(id); }',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-18hwala',
  q: 'Tại sao HashMap dùng `h ^ (h >>> 16)`?',
  answer:
    'Đây là câu hỏi rất hay để phân biệt người **hiểu** `HashMap` với người chỉ học thuộc. Nó khép lại chuỗi ba câu về cách tính bucket index.\n' +
    '\n' +
    '## 1. HashMap không lấy nguyên hashCode\n' +
    '\n' +
    'Nó thực hiện một bước **hash spreading**:\n' +
    '\n' +
    '```\n' +
    'h ^ (h >>> 16)\n' +
    '```\n' +
    '\n' +
    'Ý tưởng:\n' +
    '\n' +
    '```\n' +
    'high bits\n' +
    '   |\n' +
    '   v\n' +
    'dịch xuống\n' +
    '   |\n' +
    '   v\n' +
    'XOR\n' +
    '   |\n' +
    '   v\n' +
    'trộn với low bits\n' +
    '```\n' +
    '\n' +
    '## 2. Tại sao cần bước này\n' +
    '\n' +
    'Bởi vì bucket index:\n' +
    '\n' +
    '```\n' +
    '(n - 1) & hash\n' +
    '```\n' +
    '\n' +
    'chủ yếu sử dụng **các bit thấp**. Nếu `hashCode` có phân bố không tốt ở low bits nhưng high bits tốt:\n' +
    '\n' +
    '```\n' +
    'high bits: tốt\n' +
    'low bits : tệ\n' +
    '```\n' +
    '\n' +
    'thì nhiều key có thể rơi vào cùng bucket. Spreading giúp high bits ảnh hưởng tới low bits.\n' +
    '\n' +
    '## 3. Hình dung\n' +
    '\n' +
    '```\n' +
    'Original hash:\n' +
    '\n' +
    'HHHHHHHH LLLLLLLL\n' +
    '\n' +
    '        h >>> 16\n' +
    '00000000 HHHHHHHH\n' +
    '\n' +
    '        XOR\n' +
    '\n' +
    'HHHHHHHH\n' +
    '  XOR\n' +
    'LLLLLLLL\n' +
    '\n' +
    '        =\n' +
    'mixed hash\n' +
    '```\n' +
    '\n' +
    'Mục tiêu: giảm khả năng collision do phân bố bit không tốt.\n' +
    '\n' +
    '## 4. Vì sao chỉ một phép XOR mà không phải hàm băm mạnh hơn\n' +
    '\n' +
    'Đây là điểm tinh tế đáng nói khi phỏng vấn. Một hàm trộn mạnh như MurmurHash sẽ phân tán tốt hơn nhiều, nhưng nó chạy trong **mọi** lần `get`/`put`. JDK cố ý chọn phương án cực rẻ — một phép dịch bit và một phép XOR — và chấp nhận chất lượng trộn vừa phải, vì đã có `treeify` làm lưới an toàn cho tình huống xấu.\n' +
    '\n' +
    'Đó là một quyết định đánh đổi rất điển hình: đừng trả giá đắt ở đường chạy chính cho một trường hợp hiếm mà bạn đã có phương án dự phòng.\n' +
    '\n' +
    'Câu tiếp theo chuyển sang một loại lỗi khác hẳn: khi chính key bị thay đổi sau khi đã đưa vào map.',
  essence:
    'Vì bucket index chỉ lấy bit thấp, HashMap trộn bit cao xuống bằng h ^ (h >>> 16) để phần cao của hashCode cũng có ảnh hưởng. JDK cố ý chọn phép trộn siêu rẻ thay vì hàm băm mạnh, vì nó chạy trong mọi lần get/put và đã có treeify làm lưới an toàn.',
  example:
    '`Float.hashCode()` cho các giá trị nhỏ tạo ra những số mà phần khác biệt nằm hết ở bit cao. Không có bước spreading, một map dùng `Float` làm key sẽ dồn vào rất ít bucket. Một phép XOR đưa phần khác biệt đó xuống vùng bit được dùng để chọn bucket.',
  viz: {
    type: 'flow',
    title: 'Từ hashCode tới bucket index',
    nodes: ['h = key.hashCode()', 'h >>> 16', 'h ^ (h >>> 16)', '& (n - 1)'],
    steps: [
      { to: 0, label: 'lấy hashCode: 32 bit, chất lượng phân bố tuỳ từng class' },
      { to: 1, label: 'dịch phải KHÔNG DẤU 16 bit, đưa nửa cao xuống nửa thấp' },
      { to: 2, label: 'XOR hai giá trị — từ giờ bit cao có ảnh hưởng tới bit thấp' },
      { to: 3, label: 'giữ k bit thấp làm chỉ số bucket; nhờ bước trộn, hai hash chỉ khác nhau ở bit cao không còn dồn vào một ô' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Bước trộn cứu HashMap khỏi hashCode có bit thấp đơn điệu',
      code:
        '// Mã nguồn JDK 8:\n' +
        'static final int hash(Object key) {\n' +
        '    int h;\n' +
        '    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);\n' +
        '}\n' +
        '\n' +
        '// VÍ DỤ: hashCode chỉ khác nhau ở BIT CAO\n' +
        'int a = 0b0001_0000_0000_0000_0000_0000_0000_0101;   // khác ở bit 28\n' +
        'int b = 0b0010_0000_0000_0000_0000_0000_0000_0101;   // khác ở bit 29\n' +
        '\n' +
        '// KHÔNG trộn, capacity 16:\n' +
        'a & 15;                    // 5\n' +
        'b & 15;                    // 5   <- COLLISION dù hash rất khác nhau\n' +
        '\n' +
        '// CÓ trộn:\n' +
        '(a ^ (a >>> 16)) & 15;     // 5 ^ (bit 12 của a) -> khác\n' +
        '(b ^ (b >>> 16)) & 15;     // 5 ^ (bit 13 của b) -> khác\n' +
        '// -> hai key vào hai bucket khác nhau.\n' +
        '\n' +
        '// VÌ SAO chỉ 1 phép XOR mà không dùng hàm băm mạnh (MurmurHash...)?\n' +
        '//   - hàm này chạy trong MỌI lần get/put -> chi phí nhân lên hàng triệu\n' +
        '//   - >>> 16 rồi ^ chỉ tốn 2 chỉ thị CPU\n' +
        '//   - chất lượng trộn "đủ dùng", còn trường hợp xấu đã có treeify đỡ\n' +
        '// Đây là đánh đổi kinh điển: đừng trả giá đắt ở đường chạy chính\n' +
        '// cho một trường hợp hiếm mà đã có phương án dự phòng.\n' +
        '\n' +
        '// Chú ý >>> (dịch KHÔNG DẤU) chứ không phải >> :\n' +
        '// với hash âm, >> giữ bit dấu và bơm toàn số 1 vào -> trộn hỏng.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-atjp9z',
  q: 'Nếu key của HashMap là mutable thì chuyện gì xảy ra?',
  answer:
    'Một câu rất đáng hỏi, vì nó gây ra loại bug im lặng nhất: dữ liệu vẫn nằm trong map nhưng bạn không lấy ra được.\n' +
    '\n' +
    '## 1. Kịch bản\n' +
    '\n' +
    '```java\n' +
    'class User {\n' +
    '    String username;\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Dùng:\n' +
    '\n' +
    '```java\n' +
    'User user = new User("vu");\n' +
    'Map<User, String> map = new HashMap<>();\n' +
    'map.put(user, "Developer");\n' +
    '```\n' +
    '\n' +
    'Sau đó thay đổi:\n' +
    '\n' +
    '```java\n' +
    'user.username = "newVu";\n' +
    '```\n' +
    '\n' +
    '## 2. Điều gì xảy ra bên trong\n' +
    '\n' +
    'Nếu `hashCode()` phụ thuộc vào `username` thì:\n' +
    '\n' +
    '```\n' +
    'hashCode cũ\n' +
    '     |\n' +
    '     v\n' +
    'bucket cũ        <- object vẫn NẰM Ở ĐÂY\n' +
    '\n' +
    'hashCode mới\n' +
    '     |\n' +
    '     v\n' +
    'bucket mới       <- HashMap đi TÌM Ở ĐÂY\n' +
    '```\n' +
    '\n' +
    'Khi gọi `map.get(user)`, `HashMap` tính hash mới, tìm ở bucket mới và không thấy gì — mặc dù object vẫn tồn tại trong map.\n' +
    '\n' +
    '## 3. Hậu quả đầy đủ\n' +
    '\n' +
    'Không chỉ `get` trả `null`. Entry đó trở thành **không thể xoá**: `remove(user)` cũng tìm sai bucket. Nó chiếm bộ nhớ vĩnh viễn cho tới khi cả map bị thu hồi — một dạng rò rỉ bộ nhớ thật sự.\n' +
    '\n' +
    'Và `keySet()` vẫn duyệt ra nó, khiến việc gỡ lỗi càng khó tin: bạn nhìn thấy key ngay trước mắt nhưng `get` vẫn trả `null`.\n' +
    '\n' +
    '## 4. Quy tắc\n' +
    '\n' +
    'Key của `HashMap` nên có state dùng cho `equals()` và `hashCode()` **không thay đổi sau khi insert**.\n' +
    '\n' +
    'Đây là một trong những lý do **immutable object rất phù hợp làm key**: `String`, `Integer`, `UUID`, `record` với các field immutable, hay `enum`.\n' +
    '\n' +
    'Trường hợp hay gặp trong thực tế là **JPA entity**: `id` còn `null` khi chưa persist, rồi được gán sau khi flush — hash đổi ngay giữa vòng đời. Đó là lý do không nên dùng entity làm key trong `HashSet`/`HashMap`, hoặc nếu buộc phải thì `equals`/`hashCode` chỉ dùng khoá nghiệp vụ bất biến.',
  essence:
    'Sửa field tham gia tính hash sau khi đã put khiến object nằm ở bucket cũ trong khi HashMap tìm ở bucket mới: get trả null, remove cũng không xoá được, và entry rò rỉ vĩnh viễn. Vì vậy key phải là immutable ở phần dùng cho equals/hashCode.',
  example:
    'Rất hay gặp với JPA: bạn `put` một entity chưa persist vào `HashSet`, `id` đang là `null`. Sau `flush`, Hibernate gán `id` và `hashCode()` đổi. Từ lúc đó `set.contains(entity)` trả `false` cho chính object vừa thêm vào.',
  demo: [
    {
      lang: 'java',
      title: 'Entry mất tích ngay trong map',
      code:
        'class MutableKey {\n' +
        '    String name;\n' +
        '    MutableKey(String n) { name = n; }\n' +
        '    @Override public boolean equals(Object o) {\n' +
        '        return o instanceof MutableKey k && name.equals(k.name);\n' +
        '    }\n' +
        '    @Override public int hashCode() { return name.hashCode(); }\n' +
        '}\n' +
        '\n' +
        'var key = new MutableKey("vu");\n' +
        'var map = new HashMap<MutableKey, String>();\n' +
        'map.put(key, "Developer");\n' +
        '\n' +
        'key.name = "newVu";           // SỬA field tham gia tính hash\n' +
        '\n' +
        'map.get(key);                 // null   — tìm ở bucket MỚI, object ở bucket CŨ\n' +
        'map.containsKey(key);         // false\n' +
        'map.remove(key);              // KHÔNG xoá được -> rò rỉ bộ nhớ\n' +
        'map.size();                   // 1      — nó vẫn còn đó!\n' +
        'for (var k : map.keySet()) System.out.println(k.name);   // in ra "newVu"\n' +
        '// Nhìn thấy key trước mắt nhưng get() trả null -> rất khó gỡ lỗi.\n' +
        '\n' +
        '// KHÓ CHỊU NHẤT: JPA entity\n' +
        'var order = new Order();      // id = null\n' +
        'set.add(order);               // hash tính từ id = null\n' +
        'em.persist(order);            // Hibernate gán id = 42\n' +
        'set.contains(order);          // false !  hash đã đổi\n' +
        '\n' +
        '// QUY TẮC: key phải IMMUTABLE ở phần dùng cho equals/hashCode\n' +
        'record OrderKey(String shopId, String orderNo) { }   // an toàn\n' +
        '// Hoặc dùng String, Integer, UUID, enum — đều immutable sẵn.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-2khcwt',
  q: 'HashMap có thread-safe không?',
  answer:
    '**Không.** `HashMap` không đảm bảo an toàn khi nhiều thread đồng thời modify.\n' +
    '\n' +
    '## 1. Vấn đề\n' +
    '\n' +
    '```\n' +
    'Thread A -> put()\n' +
    'Thread B -> put()\n' +
    'Thread C -> get()\n' +
    '```\n' +
    '\n' +
    'có thể dẫn đến race condition cùng các vấn đề về visibility và consistency.\n' +
    '\n' +
    '## 2. Cụ thể hỏng thế nào\n' +
    '\n' +
    'Có ba mức hậu quả, từ nhẹ tới nặng:\n' +
    '\n' +
    '- **Mất dữ liệu.** Hai thread cùng chèn vào một bucket, cả hai đọc cùng một `next`, và một trong hai bản ghi bị ghi đè mất.\n' +
    '- **Sai `size`.** `size++` không nguyên tử, nên số đếm lệch dần, kéo theo resize sai thời điểm.\n' +
    '- **Vòng lặp vô tận trong Java 7.** Hai thread cùng resize có thể tạo ra chuỗi node quay vòng, khiến `get()` chạy mãi và CPU đứng ở 100%. Đây là sự cố production nổi tiếng.\n' +
    '\n' +
    'Java 8 đã loại bỏ được vòng lặp đó bằng cách đổi sang chèn cuối chuỗi, nhưng hai vấn đề đầu vẫn còn nguyên. `HashMap` vẫn hoàn toàn không thread-safe.\n' +
    '\n' +
    '## 3. Nếu cần concurrent access\n' +
    '\n' +
    '```\n' +
    'ConcurrentHashMap\n' +
    '```\n' +
    '\n' +
    'hoặc synchronization phù hợp.\n' +
    '\n' +
    '## 4. Ba lựa chọn và khác biệt\n' +
    '\n' +
    '| | Cơ chế | Ghi chú |\n' +
    '| --- | --- | --- |\n' +
    '| `Hashtable` | `synchronized` mọi method | cổ, chậm, đừng dùng |\n' +
    '| `Collections.synchronizedMap` | khoá toàn bộ map | vẫn phải tự khoá khi lặp |\n' +
    '| `ConcurrentHashMap` | khoá theo từng bucket | lựa chọn đúng |\n' +
    '\n' +
    'Một lưu ý quan trọng cho hai phương án đầu: chúng chỉ làm từng thao tác đơn lẻ an toàn. Khi bạn **lặp** qua map, vẫn phải tự đồng bộ hoá quanh vòng lặp, nếu không sẽ nhận `ConcurrentModificationException`.\n' +
    '\n' +
    'Câu tiếp theo sẽ đi vào `ConcurrentHashMap` — và một cạm bẫy mà rất nhiều người mắc phải với nó.',
  essence:
    'HashMap không thread-safe: ghi đồng thời có thể mất dữ liệu, làm sai size, và ở Java 7 còn tạo vòng lặp vô tận khiến CPU đứng 100%. Java 8 xoá được vòng lặp nhưng không làm nó an toàn — cần đồng thời thì dùng ConcurrentHashMap.',
  example:
    'Một `HashMap` dùng làm cache tĩnh trong service Spring — mà mỗi request là một thread — là lỗi rất hay gặp. Nó chạy đúng hàng tháng trời với tải thấp, rồi mất bản ghi hoặc treo CPU đúng vào lúc lưu lượng cao nhất.',
  demo: [
    {
      lang: 'java',
      title: 'Ba cách hỏng khi dùng HashMap đa luồng',
      code:
        '// HỎNG 1 — MẤT DỮ LIỆU khi hai thread cùng chèn vào một bucket\n' +
        '//   T1 đọc bucket[5] = nodeA, chuẩn bị nối nodeB\n' +
        '//   T2 đọc bucket[5] = nodeA, chuẩn bị nối nodeC\n' +
        '//   T1 ghi: bucket[5] -> nodeA -> nodeB\n' +
        '//   T2 ghi: bucket[5] -> nodeA -> nodeC     <- nodeB BIẾN MẤT\n' +
        '\n' +
        '// HỎNG 2 — size sai vì ++size không nguyên tử\n' +
        'map.size();   // nhỏ hơn số phần tử thật -> resize sai thời điểm\n' +
        '\n' +
        '// HỎNG 3 (Java 7) — VÒNG LẶP VÔ TẬN sau resize đồng thời\n' +
        '//   chuỗi bị đảo thành  A -> B -> A -> B -> ...\n' +
        '//   get() chạy mãi, CPU 100%, thread không bao giờ thoát\n' +
        '//   Java 8 sửa bằng cách chèn CUỐI chuỗi -> hết vòng lặp,\n' +
        '//   nhưng HỎNG 1 và 2 vẫn còn nguyên.\n' +
        '\n' +
        '// BA LỰA CHỌN AN TOÀN — và khác biệt thật sự:\n' +
        'Map<K,V> m1 = new Hashtable<>();                      // cổ, synchronized tất, chậm\n' +
        'Map<K,V> m2 = Collections.synchronizedMap(new HashMap<>());\n' +
        'Map<K,V> m3 = new ConcurrentHashMap<>();              // ĐÚNG\n' +
        '\n' +
        '// CẠM BẪY của m2: từng thao tác an toàn, nhưng LẶP thì không\n' +
        'synchronized (m2) {                  // BẮT BUỘC tự khoá\n' +
        '    for (var e : m2.entrySet()) { ... }\n' +
        '}\n' +
        '// ConcurrentHashMap không cần: iterator của nó weakly consistent,\n' +
        '// không bao giờ ném ConcurrentModificationException.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-18cm4yp',
  q: 'ConcurrentHashMap khác HashMap thế nào?',
  answer:
    '`ConcurrentHashMap` được thiết kế cho **concurrent access**. Nhưng nó không phải là "HashMap có khoá" — cách nó hoạt động và cách dùng đúng đều khác.\n' +
    '\n' +
    '## 1. Tư duy đơn giản\n' +
    '\n' +
    'Với một `HashMap` được đồng bộ hoá thô:\n' +
    '\n' +
    '```\n' +
    'Thread A\n' +
    '   |\n' +
    '   v\n' +
    '[ entire map ]     <- khoá toàn bộ\n' +
    '   ^\n' +
    '   |\n' +
    'Thread B\n' +
    '```\n' +
    '\n' +
    '`ConcurrentHashMap` cố gắng cho phép:\n' +
    '\n' +
    '```\n' +
    'Thread A -> bucket/operation A\n' +
    'Thread B -> bucket/operation B\n' +
    'Thread C -> bucket/operation C\n' +
    '```\n' +
    '\n' +
    'nhiều hoạt động có thể tiến hành đồng thời.\n' +
    '\n' +
    'Cụ thể trong Java 8: **đọc hoàn toàn không khoá** (dựa vào `volatile`), còn ghi chỉ khoá đúng bucket liên quan bằng `synchronized` trên node đầu, và trường hợp bucket rỗng thì dùng CAS. Đây là thay đổi lớn so với Java 7 vốn chia map thành 16 segment.\n' +
    '\n' +
    '## 2. Cạm bẫy lớn nhất\n' +
    '\n' +
    '`ConcurrentHashMap` **không** có nghĩa là mọi chuỗi nhiều operation tự động atomic.\n' +
    '\n' +
    '```java\n' +
    'if (!map.containsKey(key)) {\n' +
    '    map.put(key, value);\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'vẫn có race condition: giữa `containsKey` và `put`, một thread khác có thể chen vào.\n' +
    '\n' +
    'Có thể dùng các API atomic:\n' +
    '\n' +
    '```java\n' +
    'map.putIfAbsent(key, value);\n' +
    'map.computeIfAbsent(key, k -> createValue());\n' +
    'map.merge(key, 1, Integer::sum);\n' +
    '```\n' +
    '\n' +
    'Mỗi lời gọi là một thao tác nguyên tử duy nhất.\n' +
    '\n' +
    '## 3. Khác biệt còn lại\n' +
    '\n' +
    '| | HashMap | ConcurrentHashMap |\n' +
    '| --- | --- | --- |\n' +
    '| Thread-safe | không | có |\n' +
    '| `null` key/value | cho phép | **không** cho phép |\n' +
    '| Iterator | fail-fast, ném `ConcurrentModificationException` | weakly consistent, không ném |\n' +
    '| `size()` | chính xác | ước lượng tại thời điểm gọi |\n' +
    '\n' +
    'Chi tiết `null` có lý do sâu: với map đồng thời, `get(k)` trả `null` sẽ mơ hồ giữa "không có key" và "có key với value null" — mà bạn không thể dùng `containsKey` để phân định vì trạng thái có thể đổi ngay sau đó.\n' +
    '\n' +
    '## 4. Một lưu ý về computeIfAbsent\n' +
    '\n' +
    'Hàm lambda truyền vào chạy **trong khi bucket đang bị khoá**. Vì vậy tuyệt đối không gọi I/O chậm, không gọi mạng, và đặc biệt không đụng lại chính map đó bên trong lambda — sẽ chết khoá.',
  essence:
    'ConcurrentHashMap cho đọc không khoá và ghi chỉ khoá đúng một bucket, thay vì khoá cả map. Nhưng nó chỉ làm từng thao tác nguyên tử — chuỗi containsKey rồi put vẫn có race, phải dùng putIfAbsent, computeIfAbsent hoặc merge.',
  example:
    'Đếm số lần xuất hiện theo khoá trong môi trường đa luồng: `map.merge(key, 1L, Long::sum)` là nguyên tử và đúng. Còn `map.put(key, map.getOrDefault(key, 0L) + 1)` là ba thao tác rời rạc và sẽ đếm thiếu ngay khi có tải.',
  viz: {
    type: 'compare',
    cols: ['HashMap', 'ConcurrentHashMap'],
    rows: [
      ['Thread-safe', 'không', 'có'],
      ['Cơ chế ghi', '—', 'CAS khi bucket rỗng, synchronized trên node đầu'],
      ['Cơ chế đọc', '—', 'không khoá, dựa vào volatile'],
      ['null key/value', 'cho phép', 'ném NullPointerException'],
      ['Iterator', 'fail-fast', 'weakly consistent, không ném exception'],
      ['size()', 'chính xác', 'ước lượng tại thời điểm gọi'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Thao tác nguyên tử và cạm bẫy check-then-act',
      code:
        'var map = new ConcurrentHashMap<String, Long>();\n' +
        '\n' +
        '// SAI — ba thao tác rời rạc, mỗi cái an toàn nhưng CHUỖI thì không\n' +
        'if (!map.containsKey(k)) map.put(k, 1L);        // thread khác chen vào giữa\n' +
        'map.put(k, map.getOrDefault(k, 0L) + 1);        // đếm thiếu khi có tải\n' +
        '\n' +
        '// ĐÚNG — mỗi lời gọi là MỘT thao tác nguyên tử\n' +
        'map.putIfAbsent(k, 1L);\n' +
        'map.merge(k, 1L, Long::sum);                    // đếm chuẩn\n' +
        'map.computeIfAbsent(k, key -> loadFromDb(key)); // chỉ tính MỘT lần\n' +
        'map.compute(k, (key, old) -> old == null ? 1L : old + 1);\n' +
        '\n' +
        '// CẠM BẪY computeIfAbsent: lambda chạy KHI BUCKET ĐANG BỊ KHOÁ\n' +
        'map.computeIfAbsent(k, key -> {\n' +
        '    return httpClient.get(key);      // I/O chậm -> GIỮ KHOÁ bucket rất lâu\n' +
        '});\n' +
        'map.computeIfAbsent(k, key -> {\n' +
        '    map.put("khac", 1L);             // đụng lại CHÍNH map -> có thể CHẾT KHOÁ\n' +
        '    return 1L;\n' +
        '});\n' +
        '// -> lambda phải NGẮN, THUẦN TÍNH TOÁN, không I/O, không đụng lại map.\n' +
        '\n' +
        '// KHÔNG cho phép null — và đây là lựa chọn có chủ đích:\n' +
        'map.put("a", null);        // NullPointerException\n' +
        '// Vì get() trả null sẽ MƠ HỒ: "không có key" hay "có key, value null"?\n' +
        '// Trong môi trường đồng thời, containsKey() không phân định được —\n' +
        '// trạng thái có thể đổi ngay sau lời gọi đó.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1ehvecy',
  q: 'TreeMap hoạt động thế nào?',
  answer:
    '`TreeMap` là `Map` được tổ chức bằng **Red-Black Tree** — không có bảng băm, không có bucket, không dùng `hashCode()` một chút nào.\n' +
    '\n' +
    '## 1. Ví dụ\n' +
    '\n' +
    '```java\n' +
    'Map<Integer, String> map = new TreeMap<>();\n' +
    'map.put(30, "C");\n' +
    'map.put(10, "A");\n' +
    'map.put(20, "B");\n' +
    '```\n' +
    '\n' +
    'Iteration theo key luôn cho thứ tự sắp xếp:\n' +
    '\n' +
    '```\n' +
    '10 -> A\n' +
    '20 -> B\n' +
    '30 -> C\n' +
    '```\n' +
    '\n' +
    'Không phụ thuộc thứ tự chèn, và **ổn định** giữa các lần chạy — khác hẳn `HashMap`.\n' +
    '\n' +
    '## 2. Complexity\n' +
    '\n' +
    '```\n' +
    'get     O(log n)\n' +
    'put     O(log n)\n' +
    'remove  O(log n)\n' +
    '```\n' +
    '\n' +
    'Vì Red-Black Tree giữ chiều cao logarithmic.\n' +
    '\n' +
    'Chú ý một điểm đáng nói: O(log n) này là **đảm bảo**, còn O(1) của `HashMap` chỉ là **trung bình**. Với dữ liệu do người dùng kiểm soát, tính đảm bảo đôi khi quý hơn tốc độ trung bình.\n' +
    '\n' +
    '## 3. Nó dùng gì để so sánh\n' +
    '\n' +
    '`TreeMap` cần một thứ tự, lấy từ một trong hai nguồn:\n' +
    '\n' +
    '```java\n' +
    'new TreeMap<>()                               // dùng Comparable của key\n' +
    'new TreeMap<>(Comparator.comparing(...))      // dùng Comparator truyền vào\n' +
    '```\n' +
    '\n' +
    'Nếu key không `Comparable` và bạn cũng không truyền `Comparator`, `put` đầu tiên sẽ ném `ClassCastException` — lỗi lúc chạy, không phải lúc biên dịch.\n' +
    '\n' +
    '## 4. Điều TreeMap làm được mà HashMap không\n' +
    '\n' +
    'Đây mới là lý do thật để chọn nó, cả họ `NavigableMap`:\n' +
    '\n' +
    '```java\n' +
    'firstKey(), lastKey()\n' +
    'floorKey(k), ceilingKey(k)      // gần nhất phía dưới / trên\n' +
    'headMap(k), tailMap(k)\n' +
    'subMap(from, to)                // truy vấn khoảng\n' +
    'descendingMap()\n' +
    '```\n' +
    '\n' +
    'Tất cả đều O(log n). Với `HashMap` bạn phải duyệt hết — O(n).\n' +
    '\n' +
    'Câu tiếp theo sẽ so sánh trực tiếp hai lựa chọn này.',
  essence:
    'TreeMap là cây đỏ-đen nên mọi thao tác là O(log n) đảm bảo và thứ tự lặp luôn theo key. Nó không dùng hashCode mà dùng Comparable hoặc Comparator — đổi lấy khả năng truy vấn theo thứ tự và theo khoảng.',
  example:
    'Bảng giá theo bậc số lượng: mua 1–9 giá A, 10–49 giá B, từ 50 giá C. Với `TreeMap<Integer, Price>` chỉ cần `floorEntry(quantity)` là ra đúng bậc trong O(log n). Với `HashMap` bạn phải duyệt toàn bộ bậc để tìm mốc phù hợp.',
  demo: [
    {
      lang: 'java',
      title: 'Truy vấn theo thứ tự — thứ HashMap không làm được',
      code:
        '// Bảng giá theo bậc: từ số lượng nào thì áp giá nào\n' +
        'TreeMap<Integer, Long> tiers = new TreeMap<>();\n' +
        'tiers.put(1,  100_000L);\n' +
        'tiers.put(10,  90_000L);\n' +
        'tiers.put(50,  75_000L);\n' +
        '\n' +
        'tiers.floorEntry(37).getValue();    // 90_000  — bậc lớn nhất <= 37\n' +
        '// Một lời gọi O(log n). Với HashMap phải duyệt HẾT các bậc.\n' +
        '\n' +
        '// Cả họ NavigableMap:\n' +
        'tiers.firstKey();                   // 1\n' +
        'tiers.lastEntry();                  // 50=75000\n' +
        'tiers.ceilingKey(11);               // 50   — mốc nhỏ nhất >= 11\n' +
        'tiers.headMap(50);                  // {1=100000, 10=90000}\n' +
        'tiers.subMap(1, true, 10, true);    // truy vấn KHOẢNG\n' +
        'tiers.descendingMap();              // duyệt ngược\n' +
        '\n' +
        '// Không Comparable và không truyền Comparator -> lỗi LÚC CHẠY:\n' +
        'class Item { }                      // không implements Comparable\n' +
        'var m = new TreeMap<Item, String>();\n' +
        'm.put(new Item(), "x");             // ClassCastException ngay put đầu tiên\n' +
        '\n' +
        '// Cách chữa: truyền Comparator vào constructor\n' +
        'var ok = new TreeMap<Item, String>(Comparator.comparing(Item::name));\n' +
        '\n' +
        '// Chú ý: TreeMap KHÔNG cho phép key null (phải so sánh được),\n' +
        '// trong khi HashMap cho phép đúng một key null.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1sg58y0',
  q: 'TreeMap khác HashMap thế nào?',
  answer:
    'Hai hiện thực của cùng một interface `Map`, nhưng dựa trên hai cấu trúc dữ liệu hoàn toàn khác nhau.\n' +
    '\n' +
    '## 1. Bảng so sánh\n' +
    '\n' +
    '| | HashMap | TreeMap |\n' +
    '| --- | --- | --- |\n' +
    '| Structure | Hash table | Red-Black Tree |\n' +
    '| Ordering | không đảm bảo | sorted |\n' +
    '| `get` | Average O(1) | O(log n) |\n' +
    '| `put` | Average O(1) | O(log n) |\n' +
    '| Requirement | `equals`/`hashCode` | `Comparable`/`Comparator` |\n' +
    '| Use case | lookup nhanh | cần sorted/range |\n' +
    '\n' +
    '## 2. Ví dụ chọn TreeMap\n' +
    '\n' +
    'Khi yêu cầu là:\n' +
    '\n' +
    '```\n' +
    'Tất cả user có ID từ 100 -> 200\n' +
    '```\n' +
    '\n' +
    '`TreeMap` phù hợp hơn vì hỗ trợ các operation dựa trên thứ tự và khoảng: `subMap(100, 200)` trả về ngay, còn `HashMap` buộc phải duyệt toàn bộ và lọc.\n' +
    '\n' +
    '## 3. Ba điểm khác biệt ít được nhắc\n' +
    '\n' +
    '**Xác định trùng key.** `HashMap` dùng `equals()`; `TreeMap` dùng `compareTo() == 0`. Nếu hai method không nhất quán, cùng một tập dữ liệu sẽ cho hai kết quả khác nhau.\n' +
    '\n' +
    '**Đảm bảo so với trung bình.** O(log n) của `TreeMap` là chặn trên chắc chắn; O(1) của `HashMap` là trung bình và có thể xấu đi khi `hashCode()` tồi.\n' +
    '\n' +
    '**Key null.** `HashMap` chấp nhận đúng một key `null`; `TreeMap` thì không, vì `null` không so sánh được.\n' +
    '\n' +
    '## 4. Còn LinkedHashMap\n' +
    '\n' +
    'Đừng quên lựa chọn thứ ba, thường bị bỏ sót:\n' +
    '\n' +
    '```\n' +
    'HashMap        -> nhanh nhất, không thứ tự\n' +
    'LinkedHashMap  -> nhanh như HashMap, giữ thứ tự CHÈN\n' +
    'TreeMap        -> chậm hơn, thứ tự SẮP XẾP + truy vấn khoảng\n' +
    '```\n' +
    '\n' +
    'Nếu bạn chỉ cần thứ tự ổn định để hiển thị chứ không cần sắp xếp, `LinkedHashMap` cho bạn điều đó mà không phải trả giá O(log n).',
  essence:
    'HashMap cho O(1) trung bình và không có thứ tự; TreeMap cho O(log n) đảm bảo cùng khả năng truy vấn theo thứ tự và khoảng. Nếu chỉ cần thứ tự ổn định để hiển thị thì LinkedHashMap là lựa chọn giữa, nhanh như HashMap.',
  example:
    'Một hệ thống rate limit lưu timestamp các request: `TreeMap<Long, Integer>` cho phép `headMap(now - 60_000)` để xoá gọn toàn bộ bản ghi cũ hơn một phút trong một lời gọi. Với `HashMap` bạn phải duyệt hết mọi entry mỗi lần dọn.',
  viz: {
    type: 'compare',
    cols: ['HashMap', 'LinkedHashMap', 'TreeMap'],
    rows: [
      ['Cấu trúc', 'bảng băm', 'bảng băm + danh sách liên kết', 'cây đỏ-đen'],
      ['get / put', 'O(1) trung bình', 'O(1) trung bình', 'O(log n) đảm bảo'],
      ['Thứ tự lặp', 'không đảm bảo', 'thứ tự chèn', 'thứ tự sắp xếp'],
      ['Truy vấn khoảng', 'không', 'không', 'có — subMap, floorKey'],
      ['Key null', 'một key null', 'một key null', 'không cho phép'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Ba loại Map và tình huống đúng cho từng loại',
      code:
        '// 1. HashMap — mặc định khi chỉ cần tra cứu theo khoá\n' +
        'Map<String, User> byId = new HashMap<>();\n' +
        '\n' +
        '// 2. LinkedHashMap — cần thứ tự ỔN ĐỊNH để hiển thị / để test lặp lại được\n' +
        'Map<String, String> headers = new LinkedHashMap<>();\n' +
        '// Bonus: làm LRU cache chỉ với một dòng override\n' +
        'var lru = new LinkedHashMap<String, Object>(16, 0.75f, true) {\n' +
        '    @Override protected boolean removeEldestEntry(Map.Entry<String,Object> e) {\n' +
        '        return size() > 1000;          // accessOrder=true -> LRU thật sự\n' +
        '    }\n' +
        '};\n' +
        '\n' +
        '// 3. TreeMap — cần thứ tự sắp xếp hoặc truy vấn KHOẢNG\n' +
        'TreeMap<Long, Integer> hits = new TreeMap<>();\n' +
        'hits.headMap(System.currentTimeMillis() - 60_000).clear();\n' +
        '// Một lời gọi xoá SẠCH mọi bản ghi cũ hơn 1 phút.\n' +
        '// Với HashMap: phải duyệt toàn bộ entry mỗi lần dọn.\n' +
        '\n' +
        '// KHÁC BIỆT NGẦM: cách xác định "trùng key"\n' +
        '//   HashMap : hashCode() giống VÀ equals() = true\n' +
        '//   TreeMap : compareTo() == 0   (equals KHÔNG được dùng!)\n' +
        '// -> comparator so theo ít field hơn equals sẽ khiến TreeMap\n' +
        '//    ghi đè những entry mà HashMap coi là khác nhau.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-767d3a',
  q: 'Comparable khác Comparator thế nào?',
  answer:
    'Hai cách định nghĩa thứ tự trong Java, và ranh giới giữa chúng rất rõ ràng: **thứ tự đó thuộc về ai**.\n' +
    '\n' +
    '## 1. Comparable — object tự định nghĩa\n' +
    '\n' +
    'Đây là **natural ordering**, do chính class quyết định.\n' +
    '\n' +
    '```java\n' +
    'class User implements Comparable<User> {\n' +
    '    private int age;\n' +
    '\n' +
    '    @Override\n' +
    '    public int compareTo(User other) {\n' +
    '        return Integer.compare(this.age, other.age);\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Dùng:\n' +
    '\n' +
    '```java\n' +
    'Collections.sort(users);\n' +
    '```\n' +
    '\n' +
    '## 2. Comparator — định nghĩa từ bên ngoài\n' +
    '\n' +
    '```java\n' +
    'users.sort(\n' +
    '    Comparator.comparing(User::getAge)\n' +
    ');\n' +
    '```\n' +
    '\n' +
    'Class `User` không cần biết gì về việc này.\n' +
    '\n' +
    '## 3. Tư duy\n' +
    '\n' +
    '```\n' +
    'Comparable\n' +
    '    |\n' +
    '    v\n' +
    '"Object này tự biết cách sort"\n' +
    '\n' +
    'Comparator\n' +
    '    |\n' +
    '    v\n' +
    '"Code bên ngoài quyết định cách sort"\n' +
    '```\n' +
    '\n' +
    '## 4. Khi nào dùng Comparator\n' +
    '\n' +
    'Khi cần nhiều cách sort:\n' +
    '\n' +
    '```\n' +
    'sort by age\n' +
    'sort by name\n' +
    'sort by salary\n' +
    'sort by createdAt\n' +
    '```\n' +
    '\n' +
    'Không thể nhét tất cả vào một `compareTo()`. Ngoài ra, `Comparator` là lựa chọn duy nhất khi class không phải của bạn và bạn không sửa được nó.\n' +
    '\n' +
    '## 5. Ba quy tắc phải nhớ\n' +
    '\n' +
    '**Nhất quán với equals.** Nếu `compareTo()` trả 0 mà `equals()` trả `false`, `TreeSet`/`TreeMap` sẽ hành xử khác hẳn `HashSet`/`HashMap` trên cùng dữ liệu.\n' +
    '\n' +
    '**Đừng dùng phép trừ.** `return this.age - other.age;` bị tràn số khi gặp giá trị âm lớn, cho kết quả sai. Dùng `Integer.compare()`.\n' +
    '\n' +
    '**Phải nhất quán.** Nếu `compare()` mâu thuẫn với chính nó, `Collections.sort` ném `IllegalArgumentException: Comparison method violates its general contract!` — một lỗi chỉ xuất hiện với dữ liệu đủ lớn, rất khó tái hiện.',
  essence:
    'Comparable là thứ tự tự nhiên do chính class định nghĩa, Comparator là thứ tự do bên ngoài áp đặt nên có thể có nhiều bộ. Hai lỗi hay gặp: dùng phép trừ gây tràn số, và comparator không nhất quán khiến sort ném lỗi chỉ khi dữ liệu đủ lớn.',
  example:
    'Một `Order` có natural ordering theo thời gian tạo — đó là ý nghĩa mặc định của "sắp xếp đơn hàng". Nhưng màn hình quản trị cần sắp theo tổng tiền, theo trạng thái, theo tên khách. Bốn `Comparator` tĩnh giải quyết gọn mà không đụng vào `Order`.',
  viz: {
    type: 'compare',
    cols: ['Comparable', 'Comparator'],
    rows: [
      ['Thứ tự thuộc về', 'chính class', 'code bên ngoài'],
      ['Số lượng', 'đúng một (natural ordering)', 'bao nhiêu cũng được'],
      ['Method', 'compareTo(T other)', 'compare(T a, T b)'],
      ['Sửa được class không?', 'phải sửa được', 'không cần'],
      ['Dùng khi', 'có một thứ tự hiển nhiên', 'nhiều tiêu chí, hoặc class của người khác'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Comparator ghép nhiều tiêu chí, và hai lỗi kinh điển',
      code:
        '// GHÉP NHIỀU TIÊU CHÍ — đọc gần như tiếng Anh\n' +
        'users.sort(Comparator\n' +
        '    .comparing(User::getDepartment)\n' +
        '    .thenComparing(User::getSalary, Comparator.reverseOrder())\n' +
        '    .thenComparing(User::getName));\n' +
        '\n' +
        '// Xử lý null an toàn\n' +
        'Comparator.comparing(User::getNickname,\n' +
        '                     Comparator.nullsLast(Comparator.naturalOrder()));\n' +
        '\n' +
        '// LỖI 1 — dùng phép TRỪ: tràn số nguyên\n' +
        'Comparator<User> bad = (a, b) -> a.getAge() - b.getAge();\n' +
        '// age = Integer.MIN_VALUE, b.age = 1  ->  MIN_VALUE - 1 = TRÀN thành số DƯƠNG\n' +
        '// -> sort ra thứ tự sai hoàn toàn, không có exception nào cả.\n' +
        'Comparator<User> good = Comparator.comparingInt(User::getAge);   // đúng\n' +
        '\n' +
        '// LỖI 2 — comparator KHÔNG NHẤT QUÁN\n' +
        'Comparator<Task> wrong = (a, b) -> a.priority() > b.priority() ? 1 : -1;\n' +
        '// hai task cùng priority: compare(a,b) = -1 VÀ compare(b,a) = -1  -> mâu thuẫn\n' +
        '// Với ít phần tử thì im lặng; đủ lớn thì TimSort phát hiện và ném:\n' +
        '//   IllegalArgumentException: Comparison method violates its general contract!\n' +
        '// Bug loại này chỉ nổ trên production với dữ liệu thật -> rất khó tái hiện.\n' +
        'Comparator<Task> right = Comparator.comparingInt(Task::priority);\n' +
        '\n' +
        '// QUY TẮC: compareTo() nên NHẤT QUÁN với equals(), nếu không thì\n' +
        '// TreeSet và HashSet cho kết quả khác nhau trên cùng dữ liệu.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-1m2o82b',
  q: 'Red-Black Tree là gì?',
  answer:
    'Red-Black Tree là một **self-balancing binary search tree** — cây tìm kiếm nhị phân tự cân bằng. Nó là nền của `TreeMap`, `TreeSet` và của phần treeify trong `HashMap`.\n' +
    '\n' +
    '## 1. Ý tưởng\n' +
    '\n' +
    'Cây có các thuộc tính về màu đỏ/đen để giới hạn chiều cao. Mục tiêu:\n' +
    '\n' +
    '```\n' +
    'search -> O(log n)\n' +
    'insert -> O(log n)\n' +
    'delete -> O(log n)\n' +
    '```\n' +
    '\n' +
    'Ví dụ một cây hợp lệ:\n' +
    '\n' +
    '```\n' +
    '        20(B)\n' +
    '       /     \\\n' +
    '   10(R)     30(R)\n' +
    '   /  \\      /  \\\n' +
    '  5   15    25   40\n' +
    '```\n' +
    '\n' +
    '## 2. Năm quy tắc\n' +
    '\n' +
    '- Mỗi node là đỏ hoặc đen\n' +
    '- Node gốc là đen\n' +
    '- Mọi node lá (null) coi là đen\n' +
    '- Node đỏ không có con đỏ — không có hai node đỏ liền nhau\n' +
    '- Mọi đường đi từ một node xuống các lá có **cùng số node đen**\n' +
    '\n' +
    'Từ hai quy tắc cuối suy ra một tính chất then chốt: đường dài nhất không quá **gấp đôi** đường ngắn nhất. Đó chính là điều giữ chiều cao ở mức logarithmic.\n' +
    '\n' +
    '## 3. Cân bằng bằng gì\n' +
    '\n' +
    'Khi insert hoặc delete làm mất cân bằng, cây dùng:\n' +
    '\n' +
    '```\n' +
    'rotation\n' +
    '   +\n' +
    'recoloring\n' +
    '```\n' +
    '\n' +
    'Ví dụ một phép xoay:\n' +
    '\n' +
    '```\n' +
    '    30                    20\n' +
    '   /                     /  \\\n' +
    '  20        ->         10    30\n' +
    ' /\n' +
    '10\n' +
    '```\n' +
    '\n' +
    'Chuỗi ba node lệch một bên được biến thành cây cân đối.\n' +
    '\n' +
    '## 4. Trong Java\n' +
    '\n' +
    'Red-Black Tree được sử dụng trong:\n' +
    '\n' +
    '```\n' +
    'TreeMap\n' +
    'TreeSet\n' +
    'HashMap bucket sau treeification\n' +
    '```\n' +
    '\n' +
    'Vì sao chọn nó thay vì AVL: AVL cân bằng chặt hơn nên tìm nhanh hơn chút, nhưng phải xoay nhiều hơn khi ghi. Red-Black chấp nhận cân bằng lỏng hơn để đổi lấy chi phí ghi thấp hơn — đúng nhu cầu của một cấu trúc dùng chung.',
  essence:
    'Red-Black Tree giữ cây cân bằng bằng quy tắc màu, xoay và đổi màu, đảm bảo đường dài nhất không quá gấp đôi đường ngắn nhất nên chiều cao luôn logarithmic. Java chọn nó thay AVL vì nó xoay ít hơn khi ghi, cân bằng tốt cho cả đọc lẫn ghi.',
  example:
    'Nếu chèn 1, 2, 3, …, 1000 theo thứ tự tăng dần vào một BST thường, cây thành một chuỗi thẳng và tìm kiếm là O(n). Red-Black Tree xoay lại sau mỗi lần chèn nên chiều cao chỉ khoảng 10–20 — đúng bản chất của "tự cân bằng".',
  demo: [
    {
      lang: 'java',
      title: 'Vì sao cần tự cân bằng — và cái giá phải trả',
      code:
        '// BST THƯỜNG với dữ liệu vào theo thứ tự tăng dần -> suy biến\n' +
        '//   1\n' +
        '//    \\\n' +
        '//     2\n' +
        '//      \\\n' +
        '//       3          chiều cao = n  ->  tìm kiếm O(n)\n' +
        '//        \\         (đúng thứ mà cây sinh ra để tránh)\n' +
        '//         4\n' +
        '\n' +
        '// RED-BLACK TREE tự xoay sau mỗi lần chèn:\n' +
        '//       2(B)\n' +
        '//      /    \\\n' +
        '//    1(B)   3(B)      chiều cao ~ log n  ->  O(log n)\n' +
        '//              \\\n' +
        '//              4(R)\n' +
        '\n' +
        '// NĂM QUY TẮC:\n' +
        '//   1. mỗi node đỏ hoặc đen\n' +
        '//   2. gốc là đen\n' +
        '//   3. lá (null) coi là đen\n' +
        '//   4. node đỏ KHÔNG có con đỏ\n' +
        '//   5. mọi đường từ một node xuống lá có CÙNG số node đen\n' +
        '// Từ 4 và 5 suy ra: đường dài nhất <= 2 x đường ngắn nhất\n' +
        '// -> chiều cao bị chặn ở 2*log2(n+1)\n' +
        '\n' +
        '// Thực tế trong Java, bạn không tự viết cây này:\n' +
        'TreeMap<Integer, String> map = new TreeMap<>();   // đã là red-black tree\n' +
        'for (int i = 1; i <= 1000; i++) map.put(i, "v" + i);   // vào tăng dần\n' +
        'map.get(999);   // vẫn ~10 phép so sánh, không phải 999\n' +
        '\n' +
        '// VÌ SAO Red-Black chứ không AVL:\n' +
        '//   AVL  : cân bằng chặt -> tìm nhanh hơn, nhưng XOAY NHIỀU khi ghi\n' +
        '//   R-B  : cân bằng lỏng hơn -> ghi rẻ hơn, tìm chỉ chậm hơn chút\n' +
        '// Cấu trúc dùng chung cần cân bằng cả đọc lẫn ghi -> chọn Red-Black.',
    },
  ],
},
{
  cat: 'Java Collections',
  id: 'java-10c1lle',
  q: 'Vì sao TreeMap có complexity O(log n)?',
  answer:
    'Câu này khép lại toàn bộ phần Collections, và câu trả lời gói gọn trong một chữ: **chiều cao**.\n' +
    '\n' +
    '## 1. Lý do\n' +
    '\n' +
    'Vì `TreeMap` sử dụng Red-Black Tree, và Red-Black Tree đảm bảo chiều cao của cây được giới hạn ở mức logarithmic.\n' +
    '\n' +
    'Ví dụ lý tưởng:\n' +
    '\n' +
    '```\n' +
    '         50\n' +
    '       /    \\\n' +
    '     25      75\n' +
    '    /  \\    /  \\\n' +
    '   10  30  60   90\n' +
    '```\n' +
    '\n' +
    'Tìm 60:\n' +
    '\n' +
    '```\n' +
    '50\n' +
    ' |  60 > 50, đi phải\n' +
    ' v\n' +
    '75\n' +
    ' |  60 < 75, đi trái\n' +
    ' v\n' +
    '60\n' +
    '```\n' +
    '\n' +
    'Chỉ cần đi qua một số node bằng đúng chiều cao cây. Do `height ≈ O(log n)` nên `search = O(log n)`.\n' +
    '\n' +
    'Con số cụ thể cho dễ hình dung: với 1 triệu phần tử, chiều cao khoảng 20. Hai mươi phép so sánh cho một triệu bản ghi.\n' +
    '\n' +
    '## 2. Tổng kết HashMap — phần interviewer rất thích đào\n' +
    '\n' +
    'Bạn nên thuộc flow này:\n' +
    '\n' +
    '```\n' +
    'map.put(key, value)\n' +
    '       |\n' +
    '       v\n' +
    'key.hashCode()\n' +
    '       |\n' +
    '       v\n' +
    'h ^ (h >>> 16)\n' +
    '       |\n' +
    '       v\n' +
    'bucket index  (n - 1) & hash\n' +
    '       |\n' +
    '       v\n' +
    '   [ Bucket ]\n' +
    '       |\n' +
    '       +-- rỗng  -> chèn\n' +
    '       |\n' +
    '       +-- collision\n' +
    '              |\n' +
    '              v\n' +
    '        so trường hash\n' +
    '              |\n' +
    '              v\n' +
    '           equals()\n' +
    '          /        \\\n' +
    '       true        false\n' +
    '         |            |\n' +
    '      replace     node kế tiếp\n' +
    '                      |\n' +
    '                      v\n' +
    '               chuỗi quá dài?\n' +
    '                      |\n' +
    '                      v\n' +
    '                   Treeify\n' +
    '                      |\n' +
    '                      v\n' +
    '               Red-Black Tree\n' +
    '```\n' +
    '\n' +
    'Và nhớ các con số quan trọng:\n' +
    '\n' +
    '```\n' +
    'Default load factor  ~ 0.75\n' +
    'TREEIFY_THRESHOLD    = 8\n' +
    'MIN_TREEIFY_CAPACITY = 64\n' +
    'Capacity: 16 -> 32 -> 64 -> 128 -> ...\n' +
    '```\n' +
    '\n' +
    '## 3. Một câu trả lời phỏng vấn mẫu\n' +
    '\n' +
    '`HashMap` lưu dữ liệu trong một array bucket. Khi put một key, Java lấy `hashCode()` của key, thực hiện hash spreading bằng `h ^ (h >>> 16)`, sau đó tính bucket index bằng `(n - 1) & hash` khi capacity là luỹ thừa của 2. Nếu nhiều key cùng rơi vào một bucket thì xảy ra collision, ban đầu được xử lý bằng linked nodes, và khi bucket đủ lớn cùng thoả điều kiện treeification thì có thể chuyển thành Red-Black Tree. Load factor mặc định là 0.75, và khi size vượt threshold thì `HashMap` resize. Khi lookup, `HashMap` dùng hash để tìm bucket rồi dùng `equals()` để xác định đúng key.\n' +
    '\n' +
    'Đây là kiểu trả lời **có flow nội bộ**, tốt hơn nhiều so với việc đọc từng định nghĩa rời rạc.\n' +
    '\n' +
    'Phần tiếp theo chuyển sang String, Object và Memory — nơi interviewer thường hỏi vì sao `String` immutable, String Pool hoạt động thế nào, và `==` khác `equals()` ra sao.',
  essence:
    'TreeMap là O(log n) vì cây đỏ-đen giữ chiều cao logarithmic, nên mọi thao tác chỉ đi qua số node bằng chiều cao — một triệu phần tử chỉ khoảng 20 bước. Đây cũng là chốt của mạch HashMap: hashCode, trộn bit, chọn bucket, equals, treeify.',
  example:
    'Nếu bạn nhớ được đúng một mạch trả lời cho phần Collections thì hãy nhớ chuỗi này: `hashCode()` chọn bucket, `h ^ (h >>> 16)` để bit cao có ảnh hưởng, `(n-1) & hash` thay phép chia, `equals()` xác nhận key, và treeify là lưới an toàn khi bucket quá dài. Mười câu hỏi đào sâu của người phỏng vấn đều nằm trên chuỗi đó.',
  viz: {
    type: 'bars',
    title: 'Số phép so sánh để tìm một khoá',
    unit: 'phép so sánh',
    items: [
      { label: 'HashMap, 1 triệu phần tử', value: 1, note: 'O(1) trung bình — tính bucket rồi so vài node' },
      { label: 'TreeMap, 1 triệu phần tử', value: 20, note: 'O(log n) đảm bảo — chiều cao khoảng 20' },
      { label: 'Bucket đã treeify', value: 3, note: 'O(log k) trong bucket, k là số node của bucket' },
      { label: 'List.contains, 1 triệu', value: 500, note: 'O(n) — vẽ theo thang thu nhỏ' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Chiều cao cây quyết định tất cả',
      code:
        '// Chiều cao cây đỏ-đen bị chặn: h <= 2 * log2(n + 1)\n' +
        '//   n = 1.000        ->  h ~ 10\n' +
        '//   n = 1.000.000    ->  h ~ 20\n' +
        '//   n = 1.000.000.000 -> h ~ 30\n' +
        '// Mỗi bước đi xuống loại bỏ MỘT NỬA số ứng viên còn lại.\n' +
        '\n' +
        'TreeMap<Integer, String> map = new TreeMap<>();\n' +
        'for (int i = 0; i < 1_000_000; i++) map.put(i, "v");\n' +
        'map.get(999_999);      // ~20 phép so sánh, không phải 1 triệu\n' +
        '\n' +
        '// ============ MẠCH TRẢ LỜI CHO CẢ PHẦN COLLECTIONS ============\n' +
        '// map.put(key, value)\n' +
        '//   -> key.hashCode()              lấy số đại diện\n' +
        '//   -> h ^ (h >>> 16)              trộn bit cao xuống thấp\n' +
        '//   -> (n - 1) & hash              chọn bucket, cần capacity = 2^k\n' +
        '//   -> bucket rỗng?  chèn\n' +
        '//      collision?     so hash -> equals() -> thay hoặc nối node\n' +
        '//   -> chuỗi >= 8 và table >= 64?  treeify thành Red-Black Tree\n' +
        '//   -> size > capacity * 0.75?     resize gấp đôi\n' +
        '//\n' +
        '// Các con số phải thuộc:\n' +
        '//   load factor 0.75 | TREEIFY 8 | UNTREEIFY 6 | MIN_TREEIFY_CAPACITY 64\n' +
        '//   capacity 16 -> 32 -> 64 -> 128 ...\n' +
        '//\n' +
        '// Trả lời theo MẠCH này tốt hơn hẳn việc đọc từng định nghĩa rời rạc.',
    },
  ],
},
]);
