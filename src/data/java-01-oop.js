SS.addQuestions('java', [
{
  cat: 'Java Core — nền móng',
  id: 'java-1xtbmda',
  q: 'OOP là gì?',
  answer:
    'Đây là câu mở màn kinh điển, và cũng là câu bị trả lời hời hợt nhất. Phần lớn ứng viên đọc thuộc lòng "lập trình hướng đối tượng, có 4 tính chất" rồi dừng lại. Người phỏng vấn không học được gì từ câu trả lời đó.\n' +
    '\n' +
    'Tôi sẽ đi từ định nghĩa → object thực sự chứa cái gì → vì sao cách tổ chức này lại có ích → và cuối cùng là một câu trả lời mẫu ở tầm Middle.\n' +
    '\n' +
    '## 1. Định nghĩa\n' +
    '\n' +
    '**OOP** — Object-Oriented Programming — là lập trình hướng đối tượng. Thay vì tổ chức chương trình thành một tập các hàm rời rạc thao tác lên dữ liệu chung, OOP tổ chức chương trình xoay quanh các **object**.\n' +
    '\n' +
    'Mỗi object gói trong nó hai thứ:\n' +
    '\n' +
    '- **State** — dữ liệu, trạng thái\n' +
    '- **Behavior** — hành vi, các phương thức thao tác lên chính state đó\n' +
    '\n' +
    'Điểm mấu chốt nằm ở chữ "chính": dữ liệu và code xử lý dữ liệu đó ở cùng một chỗ.\n' +
    '\n' +
    '## 2. Nhìn vào một object cụ thể\n' +
    '\n' +
    '```java\n' +
    'class BankAccount {\n' +
    '    private double balance;\n' +
    '\n' +
    '    public void deposit(double amount) {\n' +
    '        balance += amount;\n' +
    '    }\n' +
    '\n' +
    '    public double getBalance() {\n' +
    '        return balance;\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Tách ra sẽ thấy rõ hai phần:\n' +
    '\n' +
    '```\n' +
    'BankAccount\n' +
    '   |\n' +
    '   +-- state    : balance\n' +
    '   |\n' +
    '   +-- behavior : deposit()\n' +
    '   +-- behavior : getBalance()\n' +
    '```\n' +
    '\n' +
    'Không ai sửa được `balance` từ bên ngoài. Muốn đổi số dư thì phải đi qua `deposit()` — và `deposit()` là nơi ta đặt được luật.\n' +
    '\n' +
    '## 3. Vì sao lại tổ chức như vậy\n' +
    '\n' +
    'OOP giúp mô hình hoá **domain** gần với thực tế. Một hệ e-commerce có những khái niệm mà người làm nghiệp vụ cũng gọi tên đúng như vậy:\n' +
    '\n' +
    '```\n' +
    'User      Order      Product      Payment      Cart\n' +
    '```\n' +
    '\n' +
    'Mỗi object chịu trách nhiệm cho phần logic của chính nó. Khi luật tính giá thay đổi, bạn biết ngay phải mở file nào. Khi `Order` sai trạng thái, bạn biết chỉ có code trong `Order` mới đổi được trạng thái đó — không phải lục cả codebase.\n' +
    '\n' +
    'Đó là lợi ích thật sự: thu hẹp phạm vi cần đọc khi sửa và khi tìm lỗi.\n' +
    '\n' +
    '## 4. Nói gì khi phỏng vấn\n' +
    '\n' +
    'Một câu trả lời gọn mà vẫn có chất:\n' +
    '\n' +
    'OOP là paradigm tổ chức chương trình xoay quanh các object, trong đó object đóng gói state và behavior liên quan tới state đó. Mục tiêu không phải là "dùng class", mà là giảm phạm vi ảnh hưởng khi thay đổi — nhờ vậy hệ thống dễ maintain, dễ tái sử dụng và dễ mở rộng.\n' +
    '\n' +
    'Tóm lại:\n' +
    '\n' +
    '```\n' +
    'hàm + dữ liệu rời rạc  ->  object (state + behavior đi cùng nhau)\n' +
    '                              |\n' +
    '                              v\n' +
    '                    phạm vi thay đổi bị thu hẹp\n' +
    '                              |\n' +
    '                              v\n' +
    '                    hệ thống dễ bảo trì hơn\n' +
    '```\n' +
    '\n' +
    'Câu tiếp theo là bốn tính chất của OOP — hãy nhớ rằng chúng chỉ là phương tiện để đạt được mục tiêu vừa nói, không phải là mục tiêu.',
  essence:
    'OOP đặt dữ liệu và code xử lý dữ liệu vào chung một object, nhờ vậy thu hẹp phạm vi cần đọc và cần sửa khi hệ thống thay đổi. Bốn tính chất chỉ là phương tiện phục vụ mục tiêu đó.',
  example:
    'Trong một hệ thanh toán, `Wallet` giữ `balance` ở dạng `private` và chỉ mở ra `deposit()` / `withdraw()`. Khi kế toán yêu cầu "không cho rút quá hạn mức ngày", bạn chỉ sửa đúng một method trong `Wallet`. Nếu `balance` là `public` và mười service cùng sửa nó, bạn phải rà cả mười chỗ và chắc chắn sẽ sót.',
  viz: {
    type: 'compare',
    cols: ['Hướng thủ tục', 'Hướng đối tượng'],
    rows: [
      ['Tổ chức code', 'hàm rời rạc + dữ liệu dùng chung', 'object gói state và behavior'],
      ['Ai đổi được dữ liệu', 'bất kỳ hàm nào', 'chỉ method của chính object'],
      ['Khi đổi luật nghiệp vụ', 'phải rà mọi nơi chạm vào dữ liệu', 'sửa trong object sở hữu dữ liệu'],
      ['Rủi ro chính', 'trạng thái sai không rõ do ai gây ra', 'thiết kế sai ranh giới object'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Cùng một nghiệp vụ, hai cách tổ chức',
      code:
        '// CÁCH THỦ TỤC: dữ liệu trần, hàm nằm rải rác\n' +
        'class AccountData {\n' +
        '    public double balance;          // ai cũng sửa được\n' +
        '}\n' +
        'class AccountUtils {\n' +
        '    static void deposit(AccountData a, double amt) { a.balance += amt; }\n' +
        '}\n' +
        '// Vấn đề: sáu tháng sau có 12 chỗ trong codebase viết thẳng\n' +
        '//   account.balance = ... ;\n' +
        '// và không chỗ nào kiểm tra amt > 0. Muốn thêm luật, phải sửa cả 12 chỗ.\n' +
        '\n' +
        '// CÁCH HƯỚNG ĐỐI TƯỢNG: state private, behavior giữ luật\n' +
        'class BankAccount {\n' +
        '    private double balance;         // KHÔNG ai bên ngoài chạm tới\n' +
        '\n' +
        '    public void deposit(double amount) {\n' +
        '        if (amount <= 0)            // luật đặt ĐÚNG MỘT chỗ\n' +
        '            throw new IllegalArgumentException("số tiền phải dương");\n' +
        '        balance += amount;\n' +
        '    }\n' +
        '\n' +
        '    public double getBalance() { return balance; }\n' +
        '}\n' +
        '// Lợi ích thật sự không phải "dùng class cho sang", mà là:\n' +
        '// muốn biết balance có thể đổi ở đâu -> chỉ cần đọc BankAccount.java',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-1lqk5e4',
  q: '4 tính chất của OOP là gì?',
  answer:
    'Câu này ai cũng đọc thuộc được. Điều người phỏng vấn thật sự muốn biết là bạn có hiểu mỗi tính chất giải quyết vấn đề gì hay không — vì đó là thứ phân biệt người đọc sách với người đã dùng chúng để sửa một codebase rối.\n' +
    '\n' +
    'Bốn tính chất kinh điển:\n' +
    '\n' +
    '```\n' +
    'Encapsulation\n' +
    'Inheritance\n' +
    'Polymorphism\n' +
    'Abstraction\n' +
    '```\n' +
    '\n' +
    'Tôi sẽ đi lần lượt, mỗi cái kèm đúng một câu "nó chống lại điều gì".\n' +
    '\n' +
    '## 1. Encapsulation — đóng gói\n' +
    '\n' +
    'Đóng gói dữ liệu và kiểm soát cách truy cập vào dữ liệu đó.\n' +
    '\n' +
    '```java\n' +
    'class User {\n' +
    '    private String password;\n' +
    '\n' +
    '    public void changePassword(String password) {\n' +
    '        // validate ở đây: độ dài, độ mạnh, không trùng mật khẩu cũ\n' +
    '        this.password = password;\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Không cho phép bên ngoài viết `user.password = "123";`.\n' +
    '\n' +
    'Nó chống lại: trạng thái không hợp lệ len vào object mà không ai kiểm.\n' +
    '\n' +
    '## 2. Inheritance — kế thừa\n' +
    '\n' +
    'Class con kế thừa behavior và state từ class cha.\n' +
    '\n' +
    '```java\n' +
    'class Animal {\n' +
    '    void eat() { }\n' +
    '}\n' +
    '\n' +
    'class Dog extends Animal {\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '`Dog` có sẵn `eat()` mà không phải viết lại. Nó chống lại: lặp code giữa các class có phần chung.\n' +
    '\n' +
    'Nhưng đây cũng là tính chất dễ bị lạm dụng nhất — câu hỏi về **Composition vs Inheritance** ở phần sau sẽ nói kỹ.\n' +
    '\n' +
    '## 3. Polymorphism — đa hình\n' +
    '\n' +
    'Cùng một interface, nhiều behavior khác nhau.\n' +
    '\n' +
    '```java\n' +
    'interface Payment {\n' +
    '    void pay();\n' +
    '}\n' +
    '\n' +
    'class MomoPayment implements Payment {\n' +
    '    public void pay() { System.out.println("Pay by Momo"); }\n' +
    '}\n' +
    '\n' +
    'class VisaPayment implements Payment {\n' +
    '    public void pay() { System.out.println("Pay by Visa"); }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Code phía trên chỉ cần biết `Payment payment; payment.pay();` mà không cần biết implementation cụ thể. Nó chống lại: chuỗi `if/else` theo kiểu, phình ra mỗi lần thêm một loại mới.\n' +
    '\n' +
    '## 4. Abstraction — trừu tượng hoá\n' +
    '\n' +
    'Ẩn chi tiết cài đặt, chỉ để lộ ra thứ người dùng thật sự cần.\n' +
    '\n' +
    '```java\n' +
    'interface Payment {\n' +
    '    void pay();\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Người gọi chỉ cần biết `pay()`, không cần biết bên trong có bao nhiêu bước. Nó chống lại: người gọi phải hiểu quá nhiều thứ mới dùng được một chức năng.\n' +
    '\n' +
    '## 5. Bốn tính chất nhìn chung một mạch\n' +
    '\n' +
    '```\n' +
    'Encapsulation  ->  bảo vệ state, giữ invariant\n' +
    'Abstraction    ->  giảm thứ người gọi phải biết\n' +
    'Polymorphism   ->  giảm coupling vào implementation cụ thể\n' +
    'Inheritance    ->  tái dùng phần chung (dùng có chừng mực)\n' +
    '```\n' +
    '\n' +
    'Ba cái đầu gần như luôn có lợi. Cái thứ tư mới là chỗ người ta hay đi sai — và cũng là nơi câu hỏi tiếp theo về Encapsulation, rồi Composition vs Inheritance, sẽ đào sâu.',
  essence:
    'Encapsulation giữ invariant, Abstraction giảm thứ phải biết, Polymorphism giảm phụ thuộc vào implementation, Inheritance tái dùng phần chung. Ba cái đầu gần như luôn đúng; riêng Inheritance là con dao hai lưỡi.',
  example:
    'Một cổng thanh toán có Momo, Visa, PayPal. Abstraction cho ra `interface Payment`. Polymorphism cho phép `OrderService` gọi `payment.pay()` mà không biết là cổng nào. Encapsulation giữ `transactionId` không bị sửa từ ngoài. Còn Inheritance thì chỉ nên dùng nếu ba cổng thật sự chia sẻ phần cài đặt chung — nếu không, `interface` là đủ.',
  viz: {
    type: 'layers',
    title: 'Bốn tính chất và vấn đề chúng giải quyết',
    layers: [
      { name: 'Encapsulation', tag: 'giữ invariant', note: 'state private, mọi thay đổi đi qua method có kiểm tra' },
      { name: 'Abstraction', tag: 'giảm thứ phải biết', note: 'lộ ra "làm gì", giấu đi "làm thế nào"' },
      { name: 'Polymorphism', tag: 'giảm coupling', note: 'một reference, nhiều implementation — thay thế được lúc chạy' },
      { name: 'Inheritance', tag: 'tái dùng phần chung', note: 'mạnh nhưng gắn kết chặt — ưu tiên composition' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Bốn tính chất trong cùng một luồng nghiệp vụ',
      code:
        '// ABSTRACTION: contract nói "làm gì", không nói "làm thế nào"\n' +
        'interface Payment {\n' +
        '    PaymentResult pay(Money amount);\n' +
        '}\n' +
        '\n' +
        '// POLYMORPHISM: nhiều cài đặt cho cùng một contract\n' +
        'class MomoPayment implements Payment {\n' +
        '    public PaymentResult pay(Money a) { return momoApi.charge(a); }\n' +
        '}\n' +
        'class VisaPayment implements Payment {\n' +
        '    public PaymentResult pay(Money a) { return stripe.charge(a); }\n' +
        '}\n' +
        '\n' +
        '// ENCAPSULATION: state private + invariant được giữ trong chính object\n' +
        'class Order {\n' +
        '    private OrderStatus status = OrderStatus.CREATED;\n' +
        '\n' +
        '    void markPaid() {\n' +
        '        if (status != OrderStatus.CREATED)      // luật chuyển trạng thái\n' +
        '            throw new IllegalStateException("đơn không ở trạng thái chờ thanh toán");\n' +
        '        status = OrderStatus.PAID;\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '// Nơi cả bốn gặp nhau: OrderService KHÔNG biết cổng nào đang chạy\n' +
        'class OrderService {\n' +
        '    private final Payment payment;              // phụ thuộc vào ABSTRACTION\n' +
        '\n' +
        '    void checkout(Order order) {\n' +
        '        payment.pay(order.total());             // POLYMORPHISM: gọi đúng cài đặt\n' +
        '        order.markPaid();                       // ENCAPSULATION: luật nằm trong Order\n' +
        '    }\n' +
        '}\n' +
        '// Thêm PaypalPayment: viết 1 class mới, KHÔNG sửa dòng nào ở OrderService.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-c3eowq',
  q: 'Encapsulation là gì?',
  answer:
    'Encapsulation thường bị rút gọn thành "để field là `private` rồi sinh getter/setter". Đó là cách hiểu sai phổ biến nhất — vì một class có `private` field kèm setter công khai cho mọi field thì về bản chất không đóng gói gì cả.\n' +
    '\n' +
    'Định nghĩa đúng: encapsulation là đóng gói state cùng behavior, và kiểm soát cách state bị thay đổi.\n' +
    '\n' +
    '## 1. Ví dụ không tốt\n' +
    '\n' +
    '```java\n' +
    'class BankAccount {\n' +
    '    public double balance;\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Bất kỳ đoạn code nào trong hệ thống cũng viết được `account.balance = -999999;`.\n' +
    '\n' +
    'Khi số dư âm xuất hiện trên production, bạn không có cách nào biết ai đã gây ra — vì mọi dòng code đều là nghi phạm.\n' +
    '\n' +
    '## 2. Thiết kế tốt hơn\n' +
    '\n' +
    '```java\n' +
    'class BankAccount {\n' +
    '    private double balance;\n' +
    '\n' +
    '    public void withdraw(double amount) {\n' +
    '        if (amount <= 0) {\n' +
    '            throw new IllegalArgumentException();\n' +
    '        }\n' +
    '        if (amount > balance) {\n' +
    '            throw new IllegalArgumentException("Insufficient balance");\n' +
    '        }\n' +
    '        balance -= amount;\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Bây giờ mọi thay đổi đều phải chui qua một cái cổng duy nhất:\n' +
    '\n' +
    '```\n' +
    'External code\n' +
    '     |\n' +
    '     v\n' +
    'withdraw()\n' +
    '     |\n' +
    '     v\n' +
    'validate\n' +
    '     |\n' +
    '     v\n' +
    'modify balance\n' +
    '```\n' +
    '\n' +
    '## 3. Bản chất: bảo vệ invariant\n' +
    '\n' +
    '**Invariant** là mệnh đề luôn đúng với object trong suốt vòng đời của nó. Ở đây invariant là `balance >= 0`.\n' +
    '\n' +
    'Object tự đảm bảo luật này, không nhờ vào việc mọi người gọi nó đều cẩn thận. Đó mới là đóng gói.\n' +
    '\n' +
    'Từ đây suy ra một hệ quả quan trọng: **setter** cho mọi field là phản đóng gói. `setBalance(double)` mở lại đúng cái cửa mà `private` vừa đóng. Hãy đặt tên method theo nghiệp vụ — `withdraw`, `deposit`, `freeze` — chứ không theo field.\n' +
    '\n' +
    '## 4. Tóm lại\n' +
    '\n' +
    '```\n' +
    'private field         ->  chưa đủ\n' +
    '  + setter mọi field  ->  vô hiệu hoá luôn\n' +
    '  + method nghiệp vụ  ->  ĐÂY mới là encapsulation\n' +
    '```\n' +
    '\n' +
    'Câu tiếp theo chuyển sang Inheritance — tính chất mạnh nhất nhưng cũng phá vỡ đóng gói dễ nhất, vì class con nhìn thấy được phần `protected` của class cha.',
  essence:
    'Encapsulation không phải là "private + getter/setter" mà là buộc mọi thay đổi state đi qua method có kiểm tra, để object tự giữ được invariant của nó. Setter cho mọi field chính là phá bỏ điều đó.',
  example:
    'Với `Order`, đừng để lộ `setStatus(OrderStatus)`. Hãy mở `markPaid()`, `cancel()`, `ship()` — mỗi method tự kiểm tra trạng thái hiện tại có cho phép chuyển hay không. Nhờ vậy không ai đẩy được một đơn từ `CANCELLED` sang `SHIPPED`, kể cả khi họ vô ý.',
  demo: [
    {
      lang: 'java',
      title: 'private + setter đầy đủ = KHÔNG đóng gói',
      code:
        '// ĐÂY VẪN LÀ THIẾT KẾ HỎNG, dù mọi field đều private:\n' +
        'class Order {\n' +
        '    private OrderStatus status;\n' +
        '    private Money total;\n' +
        '\n' +
        '    public void setStatus(OrderStatus s) { this.status = s; }   // cửa mở toang\n' +
        '    public void setTotal(Money t)        { this.total  = t; }\n' +
        '}\n' +
        'order.setStatus(OrderStatus.SHIPPED);   // đơn CHƯA thanh toán vẫn ship được\n' +
        '\n' +
        '// ĐÓNG GÓI THẬT: method mang tên NGHIỆP VỤ, mỗi method giữ một luật\n' +
        'class Order2 {\n' +
        '    private OrderStatus status = OrderStatus.CREATED;\n' +
        '    private final Money total;\n' +
        '\n' +
        '    public void markPaid() {\n' +
        '        require(status == OrderStatus.CREATED, "chỉ đơn mới được thanh toán");\n' +
        '        status = OrderStatus.PAID;\n' +
        '    }\n' +
        '    public void ship() {\n' +
        '        require(status == OrderStatus.PAID, "chưa thanh toán thì chưa ship");\n' +
        '        status = OrderStatus.SHIPPED;\n' +
        '    }\n' +
        '    // KHÔNG có setTotal: tổng tiền là bất biến sau khi tạo đơn\n' +
        '}\n' +
        '// Câu hỏi tự kiểm tra: "trạng thái đơn có thể đổi ở những đâu?"\n' +
        '//   thiết kế 1 -> khắp codebase.  thiết kế 2 -> đúng 2 method.',
    },
    {
      lang: 'java',
      title: 'Rò rỉ đóng gói qua collection — lỗi rất hay gặp',
      code:
        'class Cart {\n' +
        '    private final List<Item> items = new ArrayList<>();\n' +
        '\n' +
        '    public List<Item> getItems() { return items; }   // RÒ RỈ!\n' +
        '}\n' +
        '// Người gọi lấy được chính list bên trong và sửa thẳng:\n' +
        'cart.getItems().clear();          // vượt qua mọi luật của Cart\n' +
        '\n' +
        '// CÁCH ĐÚNG: trả về bản chỉ đọc, và mở method nghiệp vụ để thay đổi\n' +
        'class Cart2 {\n' +
        '    private final List<Item> items = new ArrayList<>();\n' +
        '\n' +
        '    public List<Item> getItems() {\n' +
        '        return Collections.unmodifiableList(items);   // sửa -> ném exception\n' +
        '    }\n' +
        '    public void add(Item item) {\n' +
        '        if (items.size() >= 50) throw new IllegalStateException("giỏ đầy");\n' +
        '        items.add(item);\n' +
        '    }\n' +
        '}\n' +
        '// Nguyên tắc: đừng bao giờ trả ra tham chiếu tới cấu trúc MUTABLE bên trong.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-1jlpsw4',
  q: 'Inheritance là gì?',
  answer:
    'Inheritance cho phép class con kế thừa thuộc tính và phương thức từ class cha. Về mặt cú pháp thì đơn giản; cái đáng nói là khi nào nên dùng và khi nào không, vì đây là công cụ bị lạm dụng nhiều nhất trong OOP.\n' +
    '\n' +
    '## 1. Cú pháp và quan hệ\n' +
    '\n' +
    '```java\n' +
    'class Animal {\n' +
    '    void eat() {\n' +
    '        System.out.println("Eating");\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    'class Dog extends Animal {\n' +
    '    void bark() {\n' +
    '        System.out.println("Bark");\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    'Dog dog = new Dog();\n' +
    'dog.eat();     // kế thừa từ Animal\n' +
    'dog.bark();    // của riêng Dog\n' +
    '```\n' +
    '\n' +
    'Quan hệ giữa hai class:\n' +
    '\n' +
    '```\n' +
    'Animal\n' +
    '  ^\n' +
    '  |\n' +
    ' Dog\n' +
    '```\n' +
    '\n' +
    'Đọc là: Dog **is-a** Animal.\n' +
    '\n' +
    '## 2. Điều một Middle cần lưu ý\n' +
    '\n' +
    'Không nên lạm dụng inheritance. Phép thử đơn giản nhất là đọc to quan hệ lên. Nếu quan hệ thực tế là `Car has an Engine` thì tuyệt đối không viết:\n' +
    '\n' +
    '```java\n' +
    'class Car extends Engine\n' +
    '```\n' +
    '\n' +
    'mà phải viết:\n' +
    '\n' +
    '```java\n' +
    'class Car {\n' +
    '    private Engine engine;\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Nghe thì hiển nhiên, nhưng trong thực tế nó xuất hiện dưới dạng tinh vi hơn nhiều: `class ReportService extends JdbcTemplate` (để "dùng cho tiện"), hay `class UserDto extends UserEntity` (để "khỏi khai lại field"). Cả hai đều là has-a bị viết thành is-a.\n' +
    '\n' +
    '## 3. Cái giá phải trả\n' +
    '\n' +
    'Inheritance tạo **coupling** rất chặt, và là loại coupling khó thấy nhất:\n' +
    '\n' +
    '- Class con phụ thuộc vào chi tiết cài đặt của class cha, không chỉ vào contract.\n' +
    '- Class cha đổi một method `protected` là class con có thể vỡ, dù cả hai đều "không sai".\n' +
    '- Chỉ kế thừa được một class — dùng hết quyền đó cho việc tái dùng code là rất phí.\n' +
    '- Class con thấy được phần `protected`, tức là đóng gói bị mở ra một phần.\n' +
    '\n' +
    'Đây chính là lý do phải hiểu Composition vs Inheritance — câu hỏi ngay sau đây sẽ đi vào so sánh trực tiếp.\n' +
    '\n' +
    '## 4. Vậy khi nào inheritance là đúng\n' +
    '\n' +
    '```\n' +
    'Quan hệ đọc lên có tự nhiên là "is-a" không?\n' +
    '        | có\n' +
    '        v\n' +
    'Class con THAY THẾ được class cha ở mọi chỗ không? (Liskov)\n' +
    '        | có\n' +
    '        v\n' +
    'Có phần CÀI ĐẶT dùng chung thật sự không? (nếu không: dùng interface)\n' +
    '        | có\n' +
    '        v\n' +
    '   inheritance hợp lý\n' +
    '```\n' +
    '\n' +
    'Chỉ cần một câu trả lời "không", hãy chuyển sang composition hoặc interface.',
  essence:
    'Inheritance là quan hệ is-a và gắn class con vào chi tiết cài đặt của class cha, không chỉ vào contract. Phép thử: nếu đọc lên nghe là "has-a" thì đó phải là composition.',
  example:
    'Kinh điển trong Java chuẩn: `java.util.Stack extends Vector`. Vì kế thừa, `Stack` thừa hưởng luôn `add(int index, E e)` — bạn chèn được phần tử vào giữa một cái stack, phá tan ngữ nghĩa LIFO. Nếu `Stack` chỉ giữ một `Vector` bên trong thì lỗi thiết kế này đã không tồn tại.',
  viz: {
    type: 'compare',
    cols: ['extends (is-a)', 'field bên trong (has-a)'],
    rows: [
      ['Phép thử ngôn ngữ', 'Dog is a Animal', 'Car has an Engine'],
      ['Phụ thuộc vào', 'chi tiết cài đặt của cha', 'chỉ contract public'],
      ['Số lượng cho phép', 'một class cha duy nhất', 'bao nhiêu thành phần cũng được'],
      ['Đổi lúc chạy', 'không', 'có — thay object bên trong'],
      ['Đóng gói', 'bị mở qua protected', 'giữ nguyên'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Khi is-a bị dùng sai chỗ',
      code:
        '// SAI: quan hệ thực tế là "Car HAS AN Engine"\n' +
        'class Engine { void start() { } }\n' +
        'class Car extends Engine { }        // Car là một cái động cơ?!\n' +
        'new Car().start();                  // API vô nghĩa lộ ra ngoài\n' +
        '\n' +
        '// ĐÚNG: composition\n' +
        'class Car2 {\n' +
        '    private final Engine engine;\n' +
        '    Car2(Engine engine) { this.engine = engine; }\n' +
        '\n' +
        '    void drive() { engine.start(); }   // chọn LỘ RA cái gì\n' +
        '}\n' +
        '// Khác biệt cốt lõi: với extends bạn thừa hưởng TOÀN BỘ API của cha,\n' +
        '// kể cả những method không hợp với khái niệm của mình.\n' +
        '\n' +
        '// Ví dụ có thật trong JDK: java.util.Stack extends Vector\n' +
        'Stack<String> s = new Stack<>();\n' +
        's.push("a"); s.push("b");\n' +
        's.add(0, "chen-vao-giua");    // hợp lệ! LIFO bị phá vì thừa kế từ Vector\n' +
        '// -> Deque<String> d = new ArrayDeque<>();  mới là lựa chọn đúng hôm nay',
    },
    {
      lang: 'java',
      title: 'Vì sao kế thừa gây vỡ ngầm (fragile base class)',
      code:
        'class CountingSet<E> extends HashSet<E> {\n' +
        '    private int added = 0;\n' +
        '\n' +
        '    @Override public boolean add(E e) {\n' +
        '        added++;\n' +
        '        return super.add(e);\n' +
        '    }\n' +
        '    @Override public boolean addAll(Collection<? extends E> c) {\n' +
        '        added += c.size();\n' +
        '        return super.addAll(c);\n' +
        '    }\n' +
        '    public int added() { return added; }\n' +
        '}\n' +
        '\n' +
        'var set = new CountingSet<String>();\n' +
        'set.addAll(List.of("a", "b", "c"));\n' +
        'set.added();   // 6, KHÔNG phải 3!\n' +
        '\n' +
        '// Vì sao: HashSet.addAll() bên trong tự gọi add() cho từng phần tử.\n' +
        '// Đó là CHI TIẾT CÀI ĐẶT, không nằm trong tài liệu, và có thể đổi\n' +
        '// ở bản JDK sau. Class con lại phụ thuộc vào chính chi tiết đó.\n' +
        '// Composition không có vấn đề này: bạn chỉ gọi API public đã cam kết.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-1m8ejon',
  q: 'Polymorphism là gì?',
  answer:
    'Polymorphism — đa hình — là tính chất mà nhiều người mô tả đúng nhưng không nói được nó dùng để làm gì. Định nghĩa: một reference có thể trỏ tới nhiều implementation khác nhau, và lời gọi method sẽ đi tới đúng implementation của object thật.\n' +
    '\n' +
    '## 1. Cơ chế\n' +
    '\n' +
    '```java\n' +
    'interface Payment {\n' +
    '    void pay();\n' +
    '}\n' +
    '\n' +
    'class MomoPayment implements Payment {\n' +
    '    @Override public void pay() { System.out.println("Momo"); }\n' +
    '}\n' +
    '\n' +
    'class VisaPayment implements Payment {\n' +
    '    @Override public void pay() { System.out.println("Visa"); }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Sau đó:\n' +
    '\n' +
    '```java\n' +
    'Payment payment = new MomoPayment();\n' +
    'payment.pay();      // -> MomoPayment.pay()\n' +
    '\n' +
    'payment = new VisaPayment();\n' +
    'payment.pay();      // -> VisaPayment.pay()\n' +
    '```\n' +
    '\n' +
    'Kiểu của biến là `Payment`, nhưng method được chọn theo **kiểu thật của object lúc chạy**. Cơ chế này gọi là **dynamic dispatch** (hay late binding): JVM tra bảng method của object thật rồi mới nhảy.\n' +
    '\n' +
    '## 2. Hai loại đa hình\n' +
    '\n' +
    '| Loại | Cơ chế | Quyết định lúc nào |\n' +
    '| --- | --- | --- |\n' +
    '| Runtime polymorphism — **overriding** | class con ghi đè method của cha | lúc chạy, theo kiểu thật của object |\n' +
    '| Compile-time polymorphism — **overloading** | cùng tên method, khác danh sách tham số | lúc biên dịch, theo kiểu khai báo |\n' +
    '\n' +
    'Khi phỏng vấn nói "đa hình" mà không nói rõ, người ta thường muốn nói loại thứ nhất. Nhưng biết cả hai và phân biệt được là điểm cộng.\n' +
    '\n' +
    '## 3. Đây là nền tảng của Dependency Injection\n' +
    '\n' +
    'Nhờ đa hình, Spring có thể inject một `Payment` bất kỳ:\n' +
    '\n' +
    '```\n' +
    'OrderService  -->  Payment (interface)\n' +
    '                      |\n' +
    '          +-----------+-----------+\n' +
    '          |                       |\n' +
    '    MomoPayment             VisaPayment\n' +
    '```\n' +
    '\n' +
    'Code nghiệp vụ phụ thuộc vào `Payment`, không phụ thuộc vào `MomoPayment`. Đổi cổng thanh toán trở thành chuyện đổi cấu hình, không phải sửa code — và trong test, bạn thay bằng một implementation giả rất dễ.\n' +
    '\n' +
    '## 4. Giá trị thật sự\n' +
    '\n' +
    'Đa hình là thứ cho phép bạn xoá đi những chuỗi `if (type.equals("MOMO")) ... else if ...` rải khắp code. Mỗi loại tự biết cách làm việc của mình; nơi gọi chỉ cần biết contract.\n' +
    '\n' +
    'Đó cũng chính là cầu nối sang **Open/Closed Principle** ở phần SOLID phía sau: thêm loại mới mà không sửa code cũ.',
  essence:
    'Đa hình cho phép một reference kiểu trừu tượng trỏ tới nhiều implementation, và lời gọi được phân phối theo kiểu thật lúc chạy. Nhờ vậy code gọi không cần biết implementation nào, đây là nền tảng của DI và của Open/Closed.',
  example:
    'Một `NotificationService` nhận `List<Notifier>` gồm email, SMS, push. Nó chỉ lặp và gọi `notifier.send(msg)`. Khi sếp yêu cầu thêm Zalo, bạn viết `ZaloNotifier implements Notifier` và đăng ký bean — `NotificationService` không đổi một dòng.',
  viz: {
    type: 'compare',
    cols: ['Overriding (runtime)', 'Overloading (compile-time)'],
    rows: [
      ['Định nghĩa ở đâu', 'class con ghi đè method của cha', 'cùng class, cùng tên, khác tham số'],
      ['Chọn method khi nào', 'lúc chạy, theo kiểu THẬT của object', 'lúc biên dịch, theo kiểu KHAI BÁO'],
      ['Chữ ký method', 'phải giống hệt', 'bắt buộc phải khác'],
      ['Vai trò', 'cốt lõi của đa hình và DI', 'chỉ là tiện lợi cú pháp'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Đa hình xoá chuỗi if/else theo kiểu',
      code:
        '// TRƯỚC: mỗi lần thêm cổng thanh toán là sửa method này\n' +
        'void pay(String type, Money amount) {\n' +
        '    if ("MOMO".equals(type))       momoApi.charge(amount);\n' +
        '    else if ("VISA".equals(type))  stripe.charge(amount);\n' +
        '    else if ("PAYPAL".equals(type)) paypal.charge(amount);\n' +
        '    else throw new IllegalArgumentException(type);\n' +
        '}\n' +
        '// Chuỗi if này thường bị COPY sang chỗ khác: tính phí, hiển thị tên,\n' +
        '// kiểm tra hạn mức... rồi có chỗ quên cập nhật khi thêm loại mới.\n' +
        '\n' +
        '// SAU: mỗi loại tự biết việc của mình\n' +
        'interface Payment {\n' +
        '    String code();\n' +
        '    void pay(Money amount);\n' +
        '}\n' +
        '\n' +
        '@Service\n' +
        'class PaymentRouter {\n' +
        '    private final Map<String, Payment> byCode;\n' +
        '\n' +
        '    // Spring inject TẤT CẢ bean kiểu Payment vào đây\n' +
        '    PaymentRouter(List<Payment> all) {\n' +
        '        byCode = all.stream().collect(toMap(Payment::code, identity()));\n' +
        '    }\n' +
        '    void pay(String type, Money amount) {\n' +
        '        byCode.get(type).pay(amount);   // dynamic dispatch làm phần còn lại\n' +
        '    }\n' +
        '}\n' +
        '// Thêm ZaloPayPayment: 1 class mới, 0 dòng sửa ở PaymentRouter.',
    },
    {
      lang: 'java',
      title: 'Overriding chọn theo object thật, overloading chọn theo kiểu khai báo',
      code:
        'class Animal { void speak() { System.out.println("..."); } }\n' +
        'class Dog extends Animal { @Override void speak() { System.out.println("Gâu"); } }\n' +
        '\n' +
        'Animal a = new Dog();\n' +
        'a.speak();          // "Gâu"  <- OVERRIDING: theo kiểu THẬT (Dog)\n' +
        '\n' +
        '// ----------------------------------------------------------------\n' +
        'static void log(Object o) { System.out.println("object"); }\n' +
        'static void log(String s) { System.out.println("string"); }\n' +
        '\n' +
        'Object o = "tôi là String";\n' +
        'log(o);             // "object"  <- OVERLOADING: theo kiểu KHAI BÁO (Object)\n' +
        '\n' +
        '// Đây là bẫy hay gặp: người ta tưởng log(o) in ra "string".\n' +
        '// Overloading được compiler quyết định XONG từ lúc biên dịch,\n' +
        '// nó không hề biết lúc chạy o đang giữ cái gì.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-1g3lueg',
  q: 'Abstraction là gì?',
  answer:
    'Abstraction — trừu tượng hoá — là tập trung vào **what** thay vì **how**. Nói cách khác: quyết định xem người dùng một thành phần cần biết những gì, rồi giấu đi tất cả phần còn lại.\n' +
    '\n' +
    '## 1. Ví dụ\n' +
    '\n' +
    '```java\n' +
    'interface PaymentService {\n' +
    '    void pay();\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Người gọi chỉ cần biết là có `pay()`. Họ không cần biết bên trong đang xảy ra:\n' +
    '\n' +
    '```\n' +
    'validate card\n' +
    '  -> call payment gateway\n' +
    '  -> encrypt request\n' +
    '  -> send HTTP\n' +
    '  -> verify response\n' +
    '  -> save transaction\n' +
    '```\n' +
    '\n' +
    'Sáu bước đó là **how**. Cái duy nhất lộ ra ngoài là **what**: "thanh toán".\n' +
    '\n' +
    '## 2. Vì sao điều này quan trọng\n' +
    '\n' +
    'Mỗi chi tiết bạn để lộ ra ngoài là một thứ **bạn không còn tự do đổi**. Nếu `PaymentService` để lộ `HttpClient`, `RetryPolicy`, `EncryptionKey` trong chữ ký method, thì ngày bạn đổi sang gateway khác, mọi nơi gọi đều phải sửa.\n' +
    '\n' +
    'Abstraction vì thế không phải là "viết interface cho có". Nó là hành động thu hẹp **bề mặt tiếp xúc** giữa hai phần của hệ thống.\n' +
    '\n' +
    '## 3. Trong Java, abstraction được thực hiện qua\n' +
    '\n' +
    '- **Interface** — thuần contract, không mang cài đặt (trừ `default`/`static` method)\n' +
    '- **Abstract class** — contract cộng thêm phần cài đặt và state dùng chung\n' +
    '\n' +
    'Câu hỏi ngay sau đây sẽ so sánh trực tiếp hai lựa chọn này.\n' +
    '\n' +
    '## 4. Phân biệt với Encapsulation\n' +
    '\n' +
    'Hai khái niệm này rất hay bị lẫn:\n' +
    '\n' +
    '| | Giấu cái gì | Nhằm mục đích |\n' +
    '| --- | --- | --- |\n' +
    '| Encapsulation | giấu **dữ liệu** khỏi bị sửa bừa | giữ invariant của object |\n' +
    '| Abstraction | giấu **cách làm** khỏi người gọi | giảm thứ người gọi phải biết |\n' +
    '\n' +
    'Encapsulation trả lời "ai được sửa state này". Abstraction trả lời "người dùng cần biết bao nhiêu để dùng được". Hai câu hỏi khác nhau, dù cách thực hiện đều dính tới `private`.',
  essence:
    'Abstraction là chọn lộ ra "làm gì" và giấu đi "làm thế nào", nhờ đó thu hẹp bề mặt tiếp xúc và giữ được tự do thay đổi phần cài đặt. Nó khác Encapsulation ở chỗ Encapsulation giấu dữ liệu, còn Abstraction giấu cách làm.',
  example:
    '`JdbcTemplate` là một abstraction rất tốt: bạn gọi `query(sql, mapper)` mà không cần mở `Connection`, tạo `PreparedStatement`, lặp `ResultSet`, đóng tài nguyên và dịch `SQLException`. Sáu việc đó vẫn xảy ra, chỉ là bạn không phải biết.',
  demo: [
    {
      lang: 'java',
      title: 'Bề mặt tiếp xúc rộng vs hẹp',
      code:
        '// ABSTRACTION KÉM: chi tiết cài đặt rò ra chữ ký method\n' +
        'interface BadPaymentService {\n' +
        '    HttpResponse charge(HttpClient client, String apiKey,\n' +
        '                        RetryPolicy retry, JsonNode payload);\n' +
        '}\n' +
        '// Hậu quả: đổi từ REST sang gRPC -> mọi nơi gọi phải sửa.\n' +
        '// Người gọi buộc phải biết về HTTP, về JSON, về retry — toàn thứ\n' +
        '// không liên quan đến nghiệp vụ "thanh toán".\n' +
        '\n' +
        '// ABSTRACTION TỐT: chỉ có khái niệm nghiệp vụ\n' +
        'interface PaymentService {\n' +
        '    PaymentResult pay(OrderId order, Money amount);\n' +
        '}\n' +
        '\n' +
        'class StripePaymentService implements PaymentService {\n' +
        '    private final HttpClient http;      // chi tiết BỊ GIẤU ở đây\n' +
        '    private final String apiKey;\n' +
        '    private final RetryPolicy retry;\n' +
        '\n' +
        '    public PaymentResult pay(OrderId order, Money amount) {\n' +
        '        // 6 bước: validate -> encrypt -> gọi HTTP -> verify -> lưu -> map\n' +
        '        return PaymentResult.ok(...);\n' +
        '    }\n' +
        '}\n' +
        '// Đổi sang gRPC, đổi sang gateway khác, hay dùng bản giả trong test:\n' +
        '// code nghiệp vụ KHÔNG đổi, vì nó chỉ biết PaymentService.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-17f35tv',
  q: 'Interface khác Abstract Class thế nào?',
  answer:
    'Câu này gần như chắc chắn được hỏi, và câu trả lời hay bị dừng lại ở mức liệt kê cú pháp. Điều người phỏng vấn muốn nghe là **tiêu chí chọn**, không phải bảng so sánh.\n' +
    '\n' +
    '## 1. Bảng so sánh\n' +
    '\n' +
    '| | Interface | Abstract class |\n' +
    '| --- | --- | --- |\n' +
    '| Vai trò | mô tả **contract** | mô tả **base behavior** |\n' +
    '| Số lượng | một class implement nhiều interface | một class chỉ extends một class |\n' +
    '| Instance state | thường không có | có |\n' +
    '| Phù hợp cho | abstraction | shared implementation |\n' +
    '| Từ khoá | `implements` | `extends` |\n' +
    '\n' +
    '## 2. Ví dụ\n' +
    '\n' +
    'Interface khi bạn cần nhiều bên cùng tuân theo một cam kết:\n' +
    '\n' +
    '```java\n' +
    'interface Payment {\n' +
    '    void pay();\n' +
    '}\n' +
    '\n' +
    'class VisaPayment   implements Payment { }\n' +
    'class MomoPayment   implements Payment { }\n' +
    'class PaypalPayment implements Payment { }\n' +
    '```\n' +
    '\n' +
    'Abstract class khi các class con thật sự chia sẻ state và cài đặt:\n' +
    '\n' +
    '```java\n' +
    'abstract class Animal {\n' +
    '    protected String name;              // state dùng chung\n' +
    '\n' +
    '    abstract void sound();              // con phải tự cài\n' +
    '\n' +
    '    void eat() {                        // cài đặt dùng chung\n' +
    '        System.out.println("Eating");\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '## 3. Java 8 trở đi làm ranh giới mờ đi\n' +
    '\n' +
    'Interface nay có `default method` (có thân hàm), `static method`, và từ Java 9 có cả `private method`. Nhiều người vì thế hỏi: vậy còn cần abstract class không?\n' +
    '\n' +
    'Vẫn còn, và khác biệt cốt lõi thu về đúng hai điểm:\n' +
    '\n' +
    '```\n' +
    'Interface        : KHÔNG có instance state (chỉ hằng public static final)\n' +
    'Abstract class   : CÓ instance state, có constructor, có field protected\n' +
    '\n' +
    'Interface        : implement được NHIỀU\n' +
    'Abstract class   : extends được MỘT\n' +
    '```\n' +
    '\n' +
    '`default method` sinh ra để **tiến hoá interface mà không phá code cũ** (ví dụ thêm `stream()` vào `Collection` ở Java 8), chứ không phải để thay thế abstract class.\n' +
    '\n' +
    '## 4. Câu trả lời ở tầm Middle\n' +
    '\n' +
    'Tôi ưu tiên interface khi muốn định nghĩa contract hoặc abstraction giữa các thành phần — đặc biệt ở ranh giới giữa các tầng, vì nó cho phép mock trong test và không tiêu mất suất kế thừa duy nhất. Tôi dùng abstract class khi các class con có state chung hoặc có khung xử lý chung, ví dụ mẫu Template Method.\n' +
    '\n' +
    'Và một mẹo thực dụng: **bắt đầu bằng interface**. Chuyển từ interface sang abstract class về sau dễ hơn nhiều so với chiều ngược lại.',
  essence:
    'Interface là contract, không có instance state và implement được nhiều; abstract class mang state cùng cài đặt chung nhưng tiêu mất suất kế thừa duy nhất. Default method sinh ra để tiến hoá interface, không phải để thay abstract class.',
  example:
    'Trong Spring, `JpaRepository` là interface vì mỗi repository chỉ cần một contract và cần mock được khi test. Còn `AbstractAuthenticationProcessingFilter` là abstract class vì nó giữ sẵn khung xử lý filter cùng state chung, và class con chỉ điền phần "cách lấy thông tin xác thực".',
  viz: {
    type: 'compare',
    cols: ['Interface', 'Abstract class'],
    rows: [
      ['Ý nghĩa', 'contract — "làm được gì"', 'base — "phần chung đã cài sẵn"'],
      ['Instance state', 'không (chỉ hằng static final)', 'có, kèm constructor'],
      ['Số lượng kế thừa', 'nhiều', 'đúng một'],
      ['Từ Java 8', 'có default / static method', 'không đổi'],
      ['Chọn khi nào', 'ranh giới giữa các tầng, cần mock', 'có khung xử lý chung (Template Method)'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Khi nào interface, khi nào abstract class',
      code:
        '// INTERFACE: nhiều bên cùng cam kết một hành vi, không chia sẻ state\n' +
        'interface Exportable {\n' +
        '    byte[] export();\n' +
        '    default String fileName() { return "export.bin"; }  // tiến hoá không phá code cũ\n' +
        '}\n' +
        '// Một class implement được NHIỀU interface cùng lúc:\n' +
        'class Invoice implements Exportable, Comparable<Invoice>, Serializable { }\n' +
        '\n' +
        '// ABSTRACT CLASS: có khung xử lý + state dùng chung (Template Method)\n' +
        'abstract class ReportJob {\n' +
        '    protected final Clock clock;              // STATE — interface không có\n' +
        '    protected ReportJob(Clock clock) { this.clock = clock; }   // CONSTRUCTOR\n' +
        '\n' +
        '    public final Report run() {               // final: khung KHÔNG cho đổi\n' +
        '        var start = clock.instant();\n' +
        '        var data  = fetch();                  // con điền\n' +
        '        var body  = render(data);             // con điền\n' +
        '        return new Report(body, clock.instant().minusMillis(start.toEpochMilli()));\n' +
        '    }\n' +
        '    protected abstract List<Row> fetch();\n' +
        '    protected abstract String render(List<Row> rows);\n' +
        '}\n' +
        '\n' +
        '// Ranh giới thật sự chỉ còn 2 điểm:\n' +
        '//   1. abstract class có INSTANCE STATE + constructor, interface thì không\n' +
        '//   2. extends được MỘT, implements được NHIỀU\n' +
        '// Mẹo: bắt đầu bằng interface. Đổi sang abstract class sau dễ hơn ngược lại.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-fw6tq5',
  q: 'Composition khác Inheritance thế nào, và vì sao nên ưu tiên Composition?',
  answer:
    'Đây là câu phân loại rõ nhất giữa người học cú pháp và người đã bảo trì một hệ thống lớn. Nguyên tắc cần nhớ nằm ngay cuối bài: **favor composition over inheritance**.\n' +
    '\n' +
    '## 1. Hai quan hệ\n' +
    '\n' +
    'Inheritance là quan hệ **is-a**:\n' +
    '\n' +
    '```java\n' +
    'class Dog extends Animal\n' +
    '```\n' +
    '\n' +
    'Dog **is an** Animal.\n' +
    '\n' +
    'Composition là quan hệ **has-a**:\n' +
    '\n' +
    '```java\n' +
    'class Car {\n' +
    '    private Engine engine;\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Car **has an** Engine.\n' +
    '\n' +
    '## 2. Vì sao composition thường được ưu tiên\n' +
    '\n' +
    'Inheritance tạo coupling rất mạnh theo chiều dọc:\n' +
    '\n' +
    '```\n' +
    'Parent\n' +
    '  ^\n' +
    '  |   Parent đổi -> Child có thể vỡ\n' +
    'Child\n' +
    '```\n' +
    '\n' +
    'Class con phụ thuộc vào cả những thứ class cha **không hứa** — thứ tự các method gọi lẫn nhau bên trong, nội dung phần `protected`. Đó gọi là vấn đề **fragile base class**.\n' +
    '\n' +
    'Composition thì chỉ nối theo chiều ngang, qua contract công khai:\n' +
    '\n' +
    '```\n' +
    'Car ---> Engine\n' +
    '```\n' +
    '\n' +
    'Và quan trọng hơn: bạn thay được implementation lúc chạy.\n' +
    '\n' +
    '```java\n' +
    'interface PaymentGateway {\n' +
    '    void pay();\n' +
    '}\n' +
    '\n' +
    'class PaymentService {\n' +
    '    private final PaymentGateway gateway;\n' +
    '\n' +
    '    PaymentService(PaymentGateway gateway) {\n' +
    '        this.gateway = gateway;\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Có thể đưa vào `MomoGateway`, `VisaGateway`, `StripeGateway`, hay một bản giả khi test — mà `PaymentService` không đổi một dòng.\n' +
    '\n' +
    '## 3. Bảng đối chiếu\n' +
    '\n' +
    '| | Inheritance | Composition |\n' +
    '| --- | --- | --- |\n' +
    '| Quan hệ | is-a | has-a |\n' +
    '| Cố định khi nào | lúc biên dịch | có thể đổi lúc chạy |\n' +
    '| Phụ thuộc vào | cả chi tiết cài đặt của cha | chỉ contract công khai |\n' +
    '| Số lượng | một class cha | bao nhiêu thành phần cũng được |\n' +
    '| Test | khó tách khỏi cha | dễ — tiêm bản giả vào |\n' +
    '\n' +
    '## 4. Nguyên tắc\n' +
    '\n' +
    '**Favor composition over inheritance.** Đây là câu rất đáng nhớ khi phỏng vấn, nhưng đừng đọc nó như khẩu hiệu — hãy kèm lý do: inheritance gắn bạn vào chi tiết cài đặt và tiêu mất suất kế thừa duy nhất, trong khi composition chỉ gắn vào contract và đổi được lúc chạy.\n' +
    '\n' +
    'Vẫn dùng inheritance khi quan hệ is-a là thật, class con thay thế được class cha (Liskov), và có phần cài đặt chung thật sự.',
  essence:
    'Inheritance là is-a và cố định lúc biên dịch, gắn class con vào chi tiết cài đặt của cha; composition là has-a, chỉ gắn vào contract và thay được lúc chạy. Vì vậy mặc định nên chọn composition, còn inheritance chỉ dùng khi is-a là thật.',
  example:
    'Cần thêm cache cho `OrderRepository`. Cách kế thừa là `CachingOrderRepository extends JpaOrderRepository` — dính chặt vào JPA, và nếu class cha gọi chéo method nội bộ thì cache bị bỏ qua. Cách composition là `CachingOrderRepository implements OrderRepository` giữ một `OrderRepository` bên trong — dùng được với bất kỳ implementation nào, và lồng thêm lớp đo thời gian cũng dễ.',
  viz: {
    type: 'compare',
    cols: ['Inheritance', 'Composition'],
    rows: [
      ['Quan hệ', 'is-a', 'has-a'],
      ['Cố định lúc', 'biên dịch', 'chạy — đổi được'],
      ['Phụ thuộc', 'chi tiết cài đặt của cha', 'chỉ contract công khai'],
      ['Số lượng', 'một class cha duy nhất', 'không giới hạn'],
      ['Khi cha thay đổi', 'con có thể vỡ ngầm', 'không ảnh hưởng nếu contract giữ nguyên'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Thêm cache: kế thừa vs composition',
      code:
        '// CÁCH KẾ THỪA — dính chặt vào một implementation cụ thể\n' +
        'class CachingRepo extends JpaOrderRepository {\n' +
        '    private final Map<Long, Order> cache = new ConcurrentHashMap<>();\n' +
        '\n' +
        '    @Override public Order findById(Long id) {\n' +
        '        return cache.computeIfAbsent(id, super::findById);\n' +
        '    }\n' +
        '}\n' +
        '// Ba vấn đề:\n' +
        '//  1. chỉ cache được cho JPA, đổi sang MyBatis là viết lại\n' +
        '//  2. nếu findAll() bên trong cha tự gọi findById() thì cache bị BỎ QUA\n' +
        '//  3. đã tiêu mất suất extends duy nhất\n' +
        '\n' +
        '// CÁCH COMPOSITION — bọc bất kỳ implementation nào\n' +
        'class CachingRepo2 implements OrderRepository {\n' +
        '    private final OrderRepository delegate;      // HAS-A\n' +
        '    private final Map<Long, Order> cache = new ConcurrentHashMap<>();\n' +
        '\n' +
        '    CachingRepo2(OrderRepository delegate) { this.delegate = delegate; }\n' +
        '\n' +
        '    public Order findById(Long id) {\n' +
        '        return cache.computeIfAbsent(id, delegate::findById);\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '// Lồng được nhiều lớp, mỗi lớp một việc — chuyện bất khả thi với extends:\n' +
        'OrderRepository repo =\n' +
        '    new TimingRepo(\n' +
        '        new CachingRepo2(\n' +
        '            new JpaOrderRepository(em)));\n' +
        '// Và trong unit test: new CachingRepo2(new InMemoryOrderRepository())',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-1jjvtub',
  q: 'Khi nào nên dùng interface?',
  answer:
    'Câu hỏi này thực chất kiểm tra xem bạn có tạo abstraction đúng lúc hay không — vì tạo thừa cũng tệ ngang tạo thiếu.\n' +
    '\n' +
    'Có bốn tình huống mà interface gần như luôn đúng.\n' +
    '\n' +
    '## 1. Định nghĩa contract\n' +
    '\n' +
    '```java\n' +
    'interface Payment {\n' +
    '    void pay();\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Khi bạn muốn nói "bất cứ thứ gì đóng vai trò thanh toán đều phải làm được việc này", đó là contract.\n' +
    '\n' +
    '## 2. Có nhiều implementation\n' +
    '\n' +
    '```\n' +
    'Payment\n' +
    '  |-- MomoPayment\n' +
    '  |-- VisaPayment\n' +
    '  +-- PaypalPayment\n' +
    '```\n' +
    '\n' +
    '## 3. Giảm coupling\n' +
    '\n' +
    'Thay vì phụ thuộc vào một class cụ thể:\n' +
    '\n' +
    '```java\n' +
    'class OrderService {\n' +
    '    private MomoPayment payment;      // dính chặt vào Momo\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'hãy phụ thuộc vào trừu tượng:\n' +
    '\n' +
    '```java\n' +
    'class OrderService {\n' +
    '    private Payment payment;\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '## 4. Dependency Injection\n' +
    '\n' +
    'Đây là trường hợp cực kỳ phổ biến trong Spring:\n' +
    '\n' +
    '```java\n' +
    '@Service\n' +
    'class OrderService {\n' +
    '    private final Payment payment;\n' +
    '\n' +
    '    public OrderService(Payment payment) {\n' +
    '        this.payment = payment;\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Đi kèm với nó là lợi ích khi test: bạn tiêm một bản giả vào mà không cần chạm tới Momo thật.\n' +
    '\n' +
    '## 5. Khi nào KHÔNG cần interface\n' +
    '\n' +
    'Phần này quan trọng không kém, và ít người nói được:\n' +
    '\n' +
    '- Chỉ có **một** implementation và không thấy dấu hiệu sẽ có cái thứ hai. `UserServiceImpl` là implementation duy nhất của `UserService` suốt ba năm chỉ là một lớp gián tiếp vô ích.\n' +
    '- Class thuần dữ liệu (DTO, entity, value object).\n' +
    '- Chi tiết nội bộ trong một package, không ai bên ngoài chạm tới.\n' +
    '\n' +
    'Với framework mock hiện đại, lý do "cần interface để test" đã yếu đi nhiều — Mockito mock được class.\n' +
    '\n' +
    '```\n' +
    'Có >= 2 implementation, hoặc sẽ có?         -> interface\n' +
    'Đây là ranh giới giữa hai tầng/module?      -> interface\n' +
    'Cần thay implementation theo môi trường?    -> interface\n' +
    'Không cái nào ở trên?                       -> dùng class, thêm sau cũng kịp\n' +
    '```\n' +
    '\n' +
    'Nguyên tắc gọn: tạo interface khi bạn có lý do cụ thể, không phải vì thói quen.',
  essence:
    'Interface đáng có khi thật sự tồn tại nhiều implementation, khi nó đánh dấu ranh giới giữa hai tầng, hoặc khi implementation đổi theo môi trường. Một interface với đúng một implementation vĩnh viễn chỉ là lớp gián tiếp vô ích.',
  example:
    '`PaymentGateway` xứng đáng có interface: sandbox khi dev, Stripe khi production, bản giả khi test. Ngược lại `OrderMapper` chỉ chuyển entity sang DTO và sẽ mãi chỉ có một cách làm — tạo `OrderMapper` + `OrderMapperImpl` chỉ khiến người đọc phải mở thêm một file.',
  demo: [
    {
      lang: 'java',
      title: 'Interface đáng có và interface thừa',
      code:
        '// ĐÁNG CÓ: thật sự nhiều cài đặt, đổi theo môi trường\n' +
        'public interface PaymentGateway {\n' +
        '    PaymentResult charge(Money amount, String token);\n' +
        '}\n' +
        '@Profile("prod")  class StripeGateway  implements PaymentGateway { }\n' +
        '@Profile("dev")   class SandboxGateway implements PaymentGateway { }\n' +
        'class FakeGateway implements PaymentGateway { }      // dùng trong test\n' +
        '\n' +
        '// THỪA: một interface, một cài đặt, không bao giờ có cái thứ hai\n' +
        'public interface UserService { User findById(Long id); }\n' +
        'public class UserServiceImpl implements UserService {\n' +
        '    public User findById(Long id) { return repo.findById(id).orElseThrow(); }\n' +
        '}\n' +
        '// Cái giá: mỗi lần "go to definition" đều rơi vào interface rỗng,\n' +
        '// phải bấm thêm một lần nữa mới thấy code thật. Nhân với 200 class.\n' +
        '// Và Mockito mock được class -> lý do "để test" không còn đứng vững.\n' +
        '\n' +
        '// PHÉP THỬ trước khi tạo interface, trả lời được 1 câu là đủ:\n' +
        '//   - hiện có >= 2 cài đặt, hoặc chắc chắn sắp có?\n' +
        '//   - đây có phải ranh giới giữa hai module/tầng không?\n' +
        '//   - cài đặt có đổi theo profile/môi trường không?\n' +
        '//   - đây là điểm mở rộng cho người khác cắm vào (SPI) không?\n' +
        '// Không câu nào -> dùng class. Thêm interface sau chỉ mất 30 giây.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-fh1mrn',
  q: 'SOLID là gì?',
  answer:
    'SOLID là năm nguyên tắc thiết kế hướng đối tượng do Robert C. Martin tổng hợp. Đọc tên thì ai cũng thuộc; điều đáng nói là cả năm đều phục vụ đúng một mục tiêu chung.\n' +
    '\n' +
    '## 1. Năm nguyên tắc\n' +
    '\n' +
    '```\n' +
    'S - Single Responsibility Principle\n' +
    'O - Open/Closed Principle\n' +
    'L - Liskov Substitution Principle\n' +
    'I - Interface Segregation Principle\n' +
    'D - Dependency Inversion Principle\n' +
    '```\n' +
    '\n' +
    'Mục tiêu chung: giảm **coupling**, tăng **maintainability** và khả năng mở rộng.\n' +
    '\n' +
    '## 2. Từng nguyên tắc trong một câu\n' +
    '\n' +
    '**S — Single Responsibility.** Một class chỉ nên có một lý do để thay đổi. Chú ý cách diễn đạt: không phải "chỉ làm một việc", mà là "chỉ có một nhóm người có thể yêu cầu sửa nó". Một `Invoice` vừa tính thuế vừa xuất PDF có hai lý do đổi — luật thuế đổi, và bộ phận thiết kế đổi mẫu in.\n' +
    '\n' +
    '**O — Open/Closed.** Mở cho mở rộng, đóng cho sửa đổi. Thêm hành vi mới bằng cách thêm code, không phải bằng cách sửa code cũ đã chạy tốt.\n' +
    '\n' +
    '**L — Liskov Substitution.** Object của class con phải thay thế được object của class cha mà không phá vỡ hành vi kỳ vọng.\n' +
    '\n' +
    '**I — Interface Segregation.** Nhiều interface nhỏ và chuyên biệt tốt hơn một interface to. Đừng bắt người implement phải viết những method họ không dùng đến.\n' +
    '\n' +
    '**D — Dependency Inversion.** Module cấp cao không phụ thuộc trực tiếp vào module cấp thấp; cả hai cùng phụ thuộc vào abstraction.\n' +
    '\n' +
    '## 3. Chúng nối với nhau như thế nào\n' +
    '\n' +
    '```\n' +
    'SOLID\n' +
    '  |\n' +
    '  v\n' +
    'Low Coupling  +  High Cohesion\n' +
    '  |\n' +
    '  v\n' +
    'Maintainable System\n' +
    '```\n' +
    '\n' +
    'Ba nguyên tắc S, I hướng tới **cohesion** — mỗi đơn vị code tập trung vào một việc. Ba nguyên tắc O, L, D hướng tới **coupling thấp** — các đơn vị nối với nhau qua trừu tượng chứ không qua chi tiết.\n' +
    '\n' +
    '## 4. Một cảnh báo\n' +
    '\n' +
    'SOLID là **heuristic**, không phải luật. Áp dụng máy móc dẫn tới cái giá ngược lại: hai mươi interface cho một CRUD đơn giản, mỗi thay đổi phải mở sáu file. Trong thực tế, hãy đợi đến khi thấy **áp lực thay đổi thật sự** rồi mới trừu tượng hoá — quy tắc "lần thứ ba" khá hữu ích: trùng lặp lần thứ ba mới tách.\n' +
    '\n' +
    'Ba câu tiếp theo sẽ đào sâu ba nguyên tắc hay được hỏi nhất: D, O và L.',
  essence:
    'Năm nguyên tắc SOLID đều hướng tới một đích: coupling thấp và cohesion cao, để hệ thống dễ sửa. Nhưng chúng là heuristic chứ không phải luật — áp dụng khi đã thấy áp lực thay đổi thật, không phải ngay từ dòng code đầu tiên.',
  example:
    'Một `UserService` làm cả việc validate, gửi email, ghi log audit và gọi API bên thứ ba đã vi phạm S. Khi đội marketing muốn đổi nội dung email, họ phải sửa file mà đội bảo mật đang bảo trì. Tách phần gửi email ra `NotificationService` khiến hai đội không còn giẫm chân nhau — đó là giá trị thực tế của SRP.',
  viz: {
    type: 'layers',
    title: 'SOLID — năm nguyên tắc, hai mục tiêu',
    layers: [
      { name: 'S — Single Responsibility', tag: 'cohesion', note: 'một class chỉ nên có một lý do để thay đổi' },
      { name: 'O — Open/Closed', tag: 'coupling', note: 'thêm hành vi bằng cách thêm code, không sửa code cũ' },
      { name: 'L — Liskov Substitution', tag: 'coupling', note: 'class con phải thay được class cha ở mọi chỗ' },
      { name: 'I — Interface Segregation', tag: 'cohesion', note: 'nhiều interface nhỏ hơn một interface to' },
      { name: 'D — Dependency Inversion', tag: 'coupling', note: 'cả hai phía cùng phụ thuộc vào abstraction' },
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Năm nguyên tắc trên một class vi phạm cả năm',
      code:
        '// VI PHẠM TOÀN TẬP\n' +
        'class OrderManager {\n' +
        '    private final MySqlConnection db = new MySqlConnection();   // vi phạm D\n' +
        '    private final SmtpClient smtp = new SmtpClient();\n' +
        '\n' +
        '    void process(Order o, String type) {\n' +
        '        if ("VIP".equals(type))       { /* ... */ }             // vi phạm O\n' +
        '        else if ("NORMAL".equals(type)) { /* ... */ }\n' +
        '        db.execute("INSERT INTO orders ...");                   // vi phạm S:\n' +
        '        smtp.send(o.email(), "Đơn hàng của bạn");               //   lưu DB + gửi mail\n' +
        '        auditLog.write(o);                                      //   + ghi audit\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '// SAU KHI SỬA\n' +
        'interface OrderRepository { void save(Order o); }               // D: abstraction\n' +
        'interface Notifier        { void notify(Order o); }             // I: nhỏ, chuyên biệt\n' +
        'interface PricingRule     { boolean supports(Order o); Money price(Order o); }\n' +
        '\n' +
        '@Service\n' +
        'class OrderService {\n' +
        '    private final OrderRepository repo;        // D: phụ thuộc abstraction\n' +
        '    private final List<Notifier> notifiers;    // O: thêm kênh = thêm bean\n' +
        '    private final List<PricingRule> rules;     // O: thêm loại giá = thêm bean\n' +
        '\n' +
        '    void process(Order o) {\n' +
        '        Money price = rules.stream().filter(r -> r.supports(o))\n' +
        '                           .findFirst().orElseThrow().price(o);\n' +
        '        repo.save(o.withPrice(price));         // S: chỉ điều phối\n' +
        '        notifiers.forEach(n -> n.notify(o));\n' +
        '    }\n' +
        '}\n' +
        '// LƯU Ý: đừng làm bước này từ ngày đầu. Chờ đến khi CÓ THẬT loại thứ ba,\n' +
        '// hoặc khi hai đội khác nhau bắt đầu cùng sửa một file.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-1864hm8',
  q: 'Dependency Inversion là gì?',
  answer:
    'Nguyên tắc D trong SOLID, và cũng là nguyên tắc mà toàn bộ Spring dựng lên trên đó. Nó gồm hai mệnh đề.\n' +
    '\n' +
    '## 1. Hai mệnh đề\n' +
    '\n' +
    'Module cấp cao không nên phụ thuộc trực tiếp vào module cấp thấp.\n' +
    '\n' +
    'Cả hai nên phụ thuộc vào abstraction.\n' +
    '\n' +
    'Kèm theo một mệnh đề thứ ba ít được nhắc: abstraction không nên phụ thuộc vào chi tiết; chi tiết mới phải phụ thuộc vào abstraction.\n' +
    '\n' +
    '## 2. Ví dụ không tốt\n' +
    '\n' +
    '```java\n' +
    'class OrderService {\n' +
    '    private MomoPayment momoPayment = new MomoPayment();\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '`OrderService` — code nghiệp vụ, cấp cao — phụ thuộc thẳng vào `MomoPayment` — chi tiết hạ tầng, cấp thấp. Hệ quả: muốn thêm cổng thanh toán thì phải sửa `OrderService`; muốn test thì phải gọi API Momo thật.\n' +
    '\n' +
    '## 3. Thiết kế tốt\n' +
    '\n' +
    '```java\n' +
    'interface Payment {\n' +
    '    void pay();\n' +
    '}\n' +
    '\n' +
    'class OrderService {\n' +
    '    private final Payment payment;\n' +
    '\n' +
    '    OrderService(Payment payment) {\n' +
    '        this.payment = payment;\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Bây giờ:\n' +
    '\n' +
    '```\n' +
    'OrderService\n' +
    '     |\n' +
    '     v\n' +
    '  Payment\n' +
    '   /    \\\n' +
    'Momo    Visa\n' +
    '```\n' +
    '\n' +
    '## 4. Chữ "inversion" nghĩa là gì\n' +
    '\n' +
    'Đây là phần hay bị bỏ qua. "Đảo ngược" ở đây là đảo ngược **chiều của mũi tên phụ thuộc**:\n' +
    '\n' +
    '```\n' +
    'TRƯỚC:   OrderService  ---->  MomoPayment\n' +
    '         (cấp cao)            (cấp thấp)\n' +
    '\n' +
    'SAU:     OrderService  ---->  Payment  <----  MomoPayment\n' +
    '         (cấp cao)          (abstraction)     (cấp thấp)\n' +
    '```\n' +
    '\n' +
    'Mũi tên từ `MomoPayment` giờ **chỉ ngược lên**. Và điểm mấu chốt: `interface Payment` thuộc về **tầng nghiệp vụ**, không thuộc về tầng hạ tầng. Tầng nghiệp vụ tự định ra cái nó cần; tầng hạ tầng có nhiệm vụ đáp ứng.\n' +
    '\n' +
    'Đây chính là ý tưởng cốt lõi của **Hexagonal Architecture** và **Clean Architecture**.\n' +
    '\n' +
    '## 5. Phân biệt DIP, IoC và DI\n' +
    '\n' +
    'Ba khái niệm hay bị dùng lẫn:\n' +
    '\n' +
    '| Tên | Là gì |\n' +
    '| --- | --- |\n' +
    '| **DIP** | nguyên tắc thiết kế: phụ thuộc vào abstraction |\n' +
    '| **IoC** | mẫu tổng quát: khung điều khiển luồng, code của bạn được gọi |\n' +
    '| **DI** | kỹ thuật cụ thể thực hiện IoC: đưa phụ thuộc từ ngoài vào |\n' +
    '\n' +
    'Spring DI là công cụ; DIP là lý do bạn dùng công cụ đó. Chú ý: có `@Autowired` chưa chắc đã tuân thủ DIP — nếu bạn inject thẳng một class cụ thể thì mũi tên phụ thuộc vẫn chưa đảo.',
  essence:
    'DIP đảo chiều mũi tên phụ thuộc: tầng nghiệp vụ định ra interface nó cần, tầng hạ tầng phải đi theo. Có @Autowired chưa phải là có DIP — inject một class cụ thể thì phụ thuộc vẫn chưa đảo.',
  example:
    'Trong Clean Architecture, `interface OrderRepository` nằm trong package domain, còn `JpaOrderRepository` nằm trong package infrastructure. Nhờ vậy domain biên dịch được mà không cần JPA trên classpath — và ngày bạn đổi từ Postgres sang DynamoDB, package domain không đổi một dòng.',
  viz: {
    type: 'compare',
    cols: ['Không có DIP', 'Có DIP'],
    rows: [
      ['Chiều phụ thuộc', 'nghiệp vụ -> hạ tầng', 'cả hai -> abstraction'],
      ['Interface thuộc về ai', 'không có interface', 'tầng nghiệp vụ sở hữu'],
      ['Đổi công nghệ lưu trữ', 'sửa code nghiệp vụ', 'viết implementation mới'],
      ['Unit test', 'phải chạy DB/API thật', 'tiêm bản giả'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Đảo chiều phụ thuộc — interface thuộc về tầng nghiệp vụ',
      code:
        '// ===== package com.shop.domain  (KHÔNG import gì của JPA/HTTP) =====\n' +
        'public interface OrderRepository {          // domain TỰ ĐỊNH ra cái nó cần\n' +
        '    Optional<Order> findById(OrderId id);\n' +
        '    void save(Order order);\n' +
        '}\n' +
        '\n' +
        'public class PlaceOrderUseCase {            // cấp cao\n' +
        '    private final OrderRepository orders;   // phụ thuộc ABSTRACTION\n' +
        '    private final Payment payment;\n' +
        '\n' +
        '    public PlaceOrderUseCase(OrderRepository orders, Payment payment) {\n' +
        '        this.orders = orders; this.payment = payment;\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '// ===== package com.shop.infrastructure  (biết JPA, biết Stripe) =====\n' +
        '@Repository\n' +
        'class JpaOrderRepository implements OrderRepository {   // cấp thấp, mũi tên NGƯỢC LÊN\n' +
        '    private final EntityManager em;\n' +
        '    public Optional<Order> findById(OrderId id) { ... }\n' +
        '    public void save(Order order) { ... }\n' +
        '}\n' +
        '\n' +
        '// Phép thử xem đã đảo chiều thật chưa:\n' +
        '//   package domain có biên dịch được khi GỠ BỎ jpa/stripe khỏi classpath không?\n' +
        '//   Được -> đã có DIP.  Không -> mũi tên vẫn đang chỉ xuống hạ tầng.\n' +
        '\n' +
        '// Và lưu ý: dòng dưới đây CÓ @Autowired nhưng KHÔNG có DIP\n' +
        '@Service class Bad { @Autowired JpaOrderRepository repo; }   // class cụ thể!',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-oospvl',
  q: 'Open/Closed Principle là gì?',
  answer:
    'Phát biểu gốc: **open for extension, closed for modification** — mở cho việc mở rộng, đóng cho việc sửa đổi.\n' +
    '\n' +
    'Nghĩa là: hệ thống nên dễ mở rộng hành vi mà không phải sửa code cũ đã chạy ổn định.\n' +
    '\n' +
    '## 1. Ví dụ xấu\n' +
    '\n' +
    '```java\n' +
    'if (type.equals("MOMO")) {\n' +
    '    ...\n' +
    '} else if (type.equals("VISA")) {\n' +
    '    ...\n' +
    '} else if (type.equals("PAYPAL")) {\n' +
    '    ...\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Mỗi khi thêm một phương thức thanh toán mới, bạn phải mở lại đúng file này và sửa. Nguy hiểm nằm ở chỗ: file đó đã được test kỹ và đang chạy tốt trên production — mỗi lần sửa là một lần có nguy cơ làm hỏng phần đang đúng.\n' +
    '\n' +
    'Và trên thực tế, chuỗi `if` này thường bị nhân bản: một chỗ tính phí, một chỗ hiển thị tên, một chỗ kiểm tra hạn mức. Thêm loại mới mà quên cập nhật một trong số đó là sinh lỗi.\n' +
    '\n' +
    '## 2. Dùng polymorphism\n' +
    '\n' +
    '```java\n' +
    'interface Payment {\n' +
    '    void pay();\n' +
    '}\n' +
    '```\n' +
    '\n' +
    '```\n' +
    'Payment\n' +
    '  |-- MomoPayment\n' +
    '  |-- VisaPayment\n' +
    '  +-- PaypalPayment\n' +
    '```\n' +
    '\n' +
    'Thêm `BankTransferPayment` mà không cần sửa logic chính. Code cũ **đóng**, hệ thống vẫn **mở**.\n' +
    '\n' +
    '## 3. Cảnh báo quan trọng\n' +
    '\n' +
    'Không phải mọi `switch` đều cần biến thành hệ thống class. Với `enum` hoặc `sealed`, một `switch` đầy đủ nhánh còn được **compiler kiểm tra hộ** — thứ mà đa hình không cho bạn.\n' +
    '\n' +
    'Hãy tách khi có ít nhất một dấu hiệu:\n' +
    '\n' +
    '- mỗi nhánh dài, có logic con phức tạp\n' +
    '- cùng một `switch` xuất hiện ở nhiều nơi\n' +
    '- mỗi nhánh cần phụ thuộc khác nhau\n' +
    '- thêm nhánh mới là chuyện thường xuyên\n' +
    '- nhánh được nạp động theo cấu hình\n' +
    '\n' +
    'Ngược lại, hai ba nhánh mỗi nhánh một dòng thì `switch` là câu trả lời đúng. Trừu tượng hoá quá sớm thường tạo ra **ranh giới sai**, và ranh giới sai đắt hơn một `switch` dài rất nhiều.\n' +
    '\n' +
    '## 4. Tóm lại\n' +
    '\n' +
    '```\n' +
    'thêm hành vi mới =\n' +
    '   THÊM một class/bean        -> tuân thủ OCP\n' +
    '   SỬA một file đang chạy     -> vi phạm OCP\n' +
    '```\n' +
    '\n' +
    'Nhưng nhớ: OCP là mục tiêu để hướng tới khi đã thấy áp lực thay đổi, không phải bài tập bắt buộc làm từ dòng code đầu tiên.',
  essence:
    'OCP muốn bạn thêm hành vi bằng cách thêm code chứ không sửa code đang chạy. Nhưng chỉ tách khi đã có áp lực thay đổi thật — với vài nhánh ngắn và cố định, một switch được compiler kiểm tra hộ vẫn tốt hơn.',
  example:
    'Một hệ tính phí vận chuyển có ba mức. Nếu mỗi tháng lại thêm một hãng vận chuyển với công thức riêng và phụ thuộc riêng (gọi API tra khoảng cách, tra thời tiết), đó là lúc tách thành các `ShippingCostCalculator`. Còn nếu ba mức là cố định suốt hai năm, `switch` trên `enum` gọn và an toàn hơn.',
  demo: [
    {
      lang: 'java',
      title: 'Khi nào switch là đủ, khi nào phải tách',
      code:
        '// SWITCH VẪN TỐT: ít nhánh, mỗi nhánh ngắn, tập giá trị ổn định\n' +
        'Money shippingCost(Order o, ShippingMethod m) {\n' +
        '    return switch (m) {                       // enum -> compiler BẮT LỖI\n' +
        '        case STANDARD -> Money.vnd(30_000);   // nếu bạn quên một nhánh\n' +
        '        case EXPRESS  -> Money.vnd(50_000);\n' +
        '        case FREE     -> Money.ZERO;\n' +
        '    };\n' +
        '}\n' +
        '\n' +
        '// TÁCH RA khi có dấu hiệu: nhánh dài, cần phụ thuộc riêng, thêm thường xuyên\n' +
        'interface ShippingCostCalculator {\n' +
        '    String method();\n' +
        '    Money calculate(Order order);\n' +
        '}\n' +
        '\n' +
        '@Component\n' +
        'class ExpressShipping implements ShippingCostCalculator {\n' +
        '    private final DistanceService distances;   // CHỈ nhánh này cần\n' +
        '    private final WeatherService weather;      // -> dấu hiệu rõ để tách\n' +
        '\n' +
        '    public String method() { return "express"; }\n' +
        '    public Money calculate(Order o) { ... }\n' +
        '}\n' +
        '\n' +
        '@Service\n' +
        'class ShippingService {\n' +
        '    private final Map<String, ShippingCostCalculator> calculators;\n' +
        '\n' +
        '    ShippingService(List<ShippingCostCalculator> all) {   // Spring tiêm HẾT\n' +
        '        calculators = all.stream()\n' +
        '            .collect(toMap(ShippingCostCalculator::method, identity()));\n' +
        '    }\n' +
        '    Money cost(Order o, String method) {\n' +
        '        return calculators.get(method).calculate(o);\n' +
        '    }\n' +
        '}\n' +
        '// Thêm hãng mới = thêm 1 @Component. ShippingService KHÔNG đổi.\n' +
        '// QUY TẮC BA: đợi đến lần thứ ba mới trừu tượng hoá.',
    },
  ],
},
{
  cat: 'Java Core — nền móng',
  id: 'java-tphf5',
  q: 'Liskov Substitution Principle là gì?',
  answer:
    '**LSP**: object của subclass phải có thể thay thế object của superclass mà không phá vỡ hành vi kỳ vọng của chương trình.\n' +
    '\n' +
    'Đây là nguyên tắc khó nhất trong SOLID, vì nó không kiểm tra được bằng compiler — code vi phạm LSP vẫn biên dịch trót lọt.\n' +
    '\n' +
    '## 1. Ví dụ kinh điển\n' +
    '\n' +
    '```java\n' +
    'class Bird {\n' +
    '    void fly() { }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Nếu viết:\n' +
    '\n' +
    '```java\n' +
    'class Penguin extends Bird {\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'nhưng chim cánh cụt không bay được, thì abstraction ban đầu có vấn đề. Cách "chữa" phổ biến nhất lại càng sai:\n' +
    '\n' +
    '```java\n' +
    'class Penguin extends Bird {\n' +
    '    @Override void fly() {\n' +
    '        throw new UnsupportedOperationException();   // vi phạm LSP rõ ràng\n' +
    '    }\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Code gọi `bird.fly()` đang đúng với mọi `Bird` bỗng nổ khi gặp `Penguin`.\n' +
    '\n' +
    '## 2. Thiết kế tốt hơn\n' +
    '\n' +
    '```java\n' +
    'interface Bird {\n' +
    '}\n' +
    '\n' +
    'interface FlyingBird extends Bird {\n' +
    '    void fly();\n' +
    '}\n' +
    '```\n' +
    '\n' +
    'Khi đó cây phân cấp trở thành:\n' +
    '\n' +
    '```\n' +
    'Bird\n' +
    '  |-- Penguin\n' +
    '  +-- FlyingBird\n' +
    '        |-- Eagle\n' +
    '        +-- Sparrow\n' +
    '```\n' +
    '\n' +
    '## 3. Bản chất\n' +
    '\n' +
    'LSP không đơn giản là "class con extends class cha". Nó là: **class con phải tuân thủ contract của class cha** — kể cả phần contract không viết ra trong chữ ký method.\n' +
    '\n' +
    'Cụ thể, class con không được:\n' +
    '\n' +
    '- siết chặt điều kiện đầu vào (precondition) — cha nhận mọi số, con chỉ nhận số dương\n' +
    '- nới lỏng cam kết đầu ra (postcondition) — cha hứa trả về khác `null`, con trả `null`\n' +
    '- ném exception mới mà người gọi không lường trước\n' +
    '- phá vỡ **invariant** của class cha\n' +
    '\n' +
    '## 4. Dấu hiệu vi phạm\n' +
    '\n' +
    '```\n' +
    'override rồi ném UnsupportedOperationException   -> gần như chắc chắn vi phạm\n' +
    'người gọi phải if (x instanceof ConcreteType)    -> dấu hiệu rất mạnh\n' +
    'override rồi để thân hàm rỗng                    -> đáng ngờ\n' +
    'tài liệu ghi "đừng gọi method này với class con" -> vi phạm\n' +
    '```\n' +
    '\n' +
    'Kết lại phần OOP, hãy nhớ chuỗi logic thay vì bốn định nghĩa rời rạc: Encapsulation bảo vệ state, Abstraction giảm complexity, Polymorphism giảm coupling, Composition giúp dễ thay implementation — và từ đó dẫn tới SOLID, tới coupling thấp cùng cohesion cao, tới một hệ thống bảo trì được. Trả lời được theo mạch này mới là chất của một Middle.',
  essence:
    'LSP đòi hỏi class con giữ đúng contract của class cha, kể cả phần không viết trong chữ ký: không siết precondition, không nới postcondition, không ném exception lạ. Dấu hiệu vi phạm rõ nhất là override rồi ném UnsupportedOperationException, hoặc người gọi phải instanceof.',
  example:
    'Kinh điển: `Square extends Rectangle`. Người gọi kỳ vọng `setWidth(5); setHeight(4);` cho diện tích 20. Với `Square`, mỗi setter đổi cả hai cạnh nên kết quả là 16. Không dòng nào sai cú pháp, nhưng contract của `Rectangle` đã bị phá — và bug này chỉ lộ ra khi chạy.',
  viz: {
    type: 'compare',
    cols: ['Tuân thủ LSP', 'Vi phạm LSP'],
    rows: [
      ['Điều kiện đầu vào', 'giữ nguyên hoặc nới lỏng', 'siết chặt hơn class cha'],
      ['Cam kết đầu ra', 'giữ nguyên hoặc mạnh hơn', 'yếu hơn (ví dụ trả null)'],
      ['Exception', 'không thêm loại mới', 'ném UnsupportedOperationException'],
      ['Người gọi', 'không cần biết class con là gì', 'phải instanceof để xử lý riêng'],
    ],
  },
  demo: [
    {
      lang: 'java',
      title: 'Square extends Rectangle — vi phạm kinh điển',
      code:
        'class Rectangle {\n' +
        '    protected int width, height;\n' +
        '    void setWidth(int w)  { this.width = w; }\n' +
        '    void setHeight(int h) { this.height = h; }\n' +
        '    int area() { return width * height; }\n' +
        '}\n' +
        '\n' +
        'class Square extends Rectangle {          // "hình vuông LÀ hình chữ nhật" — toán học đúng\n' +
        '    @Override void setWidth(int w)  { this.width = w; this.height = w; }\n' +
        '    @Override void setHeight(int h) { this.width = h; this.height = h; }\n' +
        '}\n' +
        '\n' +
        '// Code viết cho Rectangle, đúng với mọi Rectangle:\n' +
        'void resize(Rectangle r) {\n' +
        '    r.setWidth(5);\n' +
        '    r.setHeight(4);\n' +
        '    assert r.area() == 20;      // VỠ khi r là Square: area() = 16\n' +
        '}\n' +
        '// Bài học: "is-a" trong toán học KHÔNG đảm bảo "thay thế được" trong code.\n' +
        '// Rectangle có invariant ngầm: đổi rộng KHÔNG đổi cao. Square phá nó.\n' +
        '\n' +
        '// CÁCH SỬA: bỏ kế thừa, và làm cho hình bất biến\n' +
        'record Rect(int width, int height) { int area() { return width * height; } }\n' +
        'record Square2(int side)           { int area() { return side * side; } }\n' +
        '// Không có setter -> không có invariant nào để phá.',
    },
    {
      lang: 'java',
      title: 'Ba dấu hiệu vi phạm dễ nhận ra trong code thật',
      code:
        '// DẤU HIỆU 1: override rồi ném UnsupportedOperationException\n' +
        'class ReadOnlyList<E> extends ArrayList<E> {\n' +
        '    @Override public boolean add(E e) {\n' +
        '        throw new UnsupportedOperationException();   // List hứa add() được\n' +
        '    }\n' +
        '}\n' +
        '// -> đúng ra phải implements một interface HẸP HƠN, ví dụ Iterable<E>\n' +
        '\n' +
        '// DẤU HIỆU 2: siết chặt precondition\n' +
        'class Account      { void withdraw(int amt) { /* nhận mọi amt > 0 */ } }\n' +
        'class SavingAccount extends Account {\n' +
        '    @Override void withdraw(int amt) {\n' +
        '        if (amt < 100_000) throw new IllegalArgumentException();  // SIẾT thêm\n' +
        '    }                                  // code cũ rút 50k bỗng nổ\n' +
        '}\n' +
        '\n' +
        '// DẤU HIỆU 3: người gọi buộc phải instanceof\n' +
        'void process(Payment p) {\n' +
        '    if (p instanceof CryptoPayment cp) cp.waitForConfirmations();  // xử lý riêng\n' +
        '    p.pay();\n' +
        '}\n' +
        '// Mỗi instanceof trong code gọi là một lời thú nhận rằng abstraction bị rò.\n' +
        '// -> đưa waitForConfirmations() vào contract, hoặc tách kiểu ra khỏi Payment.',
    },
  ],
},
]);
