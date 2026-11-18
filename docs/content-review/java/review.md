# Rà soát kiến thức phần Java trong interview-vault

- Ngày rà soát: 2026-11-18
- Phạm vi: 8 file `src/data/java-*.js` và `assets/diagrams/java.js`
- Trạng thái: toàn bộ 90 điểm đã sửa trong commit `14b60ba`
- Lịch sử: [history.md](history.md)
- Nguồn: [sources.md](sources.md)

Nhãn kiểm chứng:

- **[Chạy]**: đã chạy thử trên JDK 17.0.12.
- **[Docs]**: đối chiếu tài liệu hoặc đặc tả chính thức.
- **[Source]**: đối chiếu mã nguồn hoặc Javadoc trong mã nguồn của dự án tương ứng.
- **[Đọc nội dung]**, **[Đọc code]**: lỗi chữ, lỗi đếm hoặc lỗi logic thấy trực tiếp trong file, không cần nguồn ngoài.

## 1. Sai, đã sửa trong nội dung

Cả 24 điểm dưới đây đã được sửa trong `src/data` và build đạt. Số dòng là vị trí trước khi sửa.

### Java core

- `java-01-oop.js:992,1019` Nói kế thừa làm cache bị bỏ qua khi lớp cha tự gọi `findById()`. Thực tế ngược lại: lời gọi đi vào bản override nên cache vẫn chạy. Chính decorator/composition mới bị bỏ qua khi `delegate` tự gọi nội bộ. **[Chạy]**
- `java-02-collections.js:2052-2062` Demo `h ^ (h >>> 16)` sai. Bit 28/29 dịch xuống thành bit 12/13, `& 15` vẫn ra 5 và 5. Đổi sang `(1 << 16) | 5` và `(1 << 17) | 5`: không trộn ra 5, 5; có trộn ra 4, 7. **[Chạy]**
- `java-02-collections.js:1945` `Long.hashCode(id)` không chữa được key là bội của 16, vì với id nhỏ hơn 2^32 kết quả giống `(int) id`. Dùng `Long.hashCode(id >>> 4)` nếu id luôn là bội của 16. **[Chạy]**
- `java-02-collections.js:1310,1325,1429,1527,1547,1557` Treeify không đảm bảo O(log n) khi các key trùng hash và không `Comparable`. Với 20.000 key như vậy, một lần `get` trượt gọi `equals` 20.001 lần; key `Comparable` chỉ cần 12 lần `compareTo`. `tieBreakOrder` chỉ phục vụ lúc chèn, không giúp tìm kiếm. **[Chạy]**
- `java-02-collections.js:1464` Xác suất bucket có 2 phần tử là 0,0758, không phải 0,15. **[Chạy]**
- `java-02-collections.js:840,1427,1436,2949` Treeify xảy ra khi thêm vào bucket đã có 8 node, tức lúc thành 9 node. Node thứ 8 vẫn là danh sách liên kết. **[Chạy]**
- `java-03-string-object-memory.js:762,806` Java 21 không tắt finalization mặc định. Mặc định vẫn là enabled, tắt bằng `--finalization=disabled`. **[Docs]**
- `java-03-string-object-memory.js:863,883,896` Với Hibernate, `NULL` vào field `int` không thành 0 mà ném `PropertyAccessException`. Chỉ `ResultSet.getInt` mới trả 0. **[Source]**
- `java-03-string-object-memory.js:347,363` 10.000 dòng x 5 ký tự phải copy khoảng 250 triệu ký tự, không phải 50 triệu. Đo thực tế khoảng 235 ms, không phải "vài giây"; `StringBuilder` khoảng 2 ms. **[Chạy]**
- `java-04-exception-generics-stream.js:280-284` Xoá `"b"` khỏi `[a, b, c]` trong for-each KHÔNG ném `ConcurrentModificationException`, vì đó là phần tử áp chót. Xoá `"a"` hoặc `"c"` mới ném. Đổi ví dụ và thêm nhận xét fail-fast chỉ là best-effort. **[Chạy]**
- `java-04-exception-generics-stream.js:309,339` `a instanceof List<String>` với `a` kiểu `List<String>` biên dịch được từ Java 16. Ví dụ không còn đúng khi ghi "lỗi biên dịch". Nên dùng `Object o; o instanceof List<String>`. **[Chạy]**
- `java-05-jvm-concurrency.js:12,36` Trên HotSpot hiện đại, biến static gắn với đối tượng `Class` trên heap, không nằm ở Metaspace. `staticFieldBase` trả về chính `class Verify`. **[Chạy]**
- `java-02-collections.js:1319,1321,2204,2246` Java 8+ vẫn có thể treo khi dùng `HashMap` đa luồng. Phép thử trên JDK 17 bị kẹt ở `HashMap$TreeNode.split` với thread vẫn `RUNNABLE`, kèm `ClassCastException`. Javadoc yêu cầu đồng bộ từ bên ngoài. Mã nguồn không nói chèn cuối chuỗi là để sửa lỗi đa luồng, nên bỏ khẳng định về lý do đó. **[Chạy + Source]**

### Spring và Spring Boot

- `java-06-spring-core.js:563,576-577,599-604` Thứ tự `@Autowired` sai và tự mâu thuẫn với dòng 564. Đúng là: theo kiểu, lọc `@Qualifier`, rồi `@Primary`, sau đó mới tới tên và `@Priority`. Thứ tự hai bước cuối đổi theo phiên bản Spring. **[Source]**
- `java-06-spring-core.js:1103,1107,1118` `@Scheduled` không chạy qua AOP proxy. `ScheduledAnnotationBeanPostProcessor` đăng ký method thành task với scheduler. Bỏ các ý "advice quanh proxy" và "self-invocation vô hiệu hoá" cho `@Scheduled`. **[Docs]**
- `java-06-spring-core.js:444,454,458,483-484` Từ Spring 6.0, method `protected` và package-private dùng được `@Transactional` với class-based proxy. `private` thì vẫn không. **[Docs]**
- `java-07-spring-boot.js:117,622,626,725,735` `spring-boot-starter-web` không còn kéo validation từ Boot 2.3. Phải thêm `spring-boot-starter-validation`. **[Docs]**
- `java-07-spring-boot.js:800-803,809,811,944-945` Thứ tự file cấu hình sai. Từ thấp đến cao: `application` trong jar, profile trong jar, `application` ngoài jar, profile ngoài jar. Dòng 954-959 đã đúng. **[Docs]**
- `java-07-spring-boot.js:3395-3396,3408,3424,3431-3432` Từ Spring 6.1, constraint đặt trực tiếp trên tham số controller được validate mà không cần `@Validated` ở class, và ném `HandlerMethodValidationException`. Tài liệu còn khuyên bỏ `@Validated` ở class để dùng cơ chế này. **[Docs]**
- `java-07-spring-boot.js:1871` Readiness mặc định không gồm DB hay Redis. Boot chỉ đưa `readinessState` vào; phụ thuộc ngoài phải tự `include`. **[Docs]**

### JPA

- `java-08-data-web-security.js:231-236` `@BatchSize` nên đặt trên class `Customer` hoặc trên collection. Javadoc chỉ mô tả hai vị trí này; đặt trên field `@ManyToOne` không phải cách dùng được mô tả. **[Docs]**
- `java-08-data-web-security.js:432-437` Spring Data phân giải phần sau `findBy` thành property, nên `IdForUpdate` và `IdShared` không khớp property nào của `Product`. Cần thêm `@Query`. Chưa chạy trong ứng dụng thật. **[Docs]**
- `java-08-data-web-security.js:612-619` Projection có `@Value("#{target...}")` là open projection, Spring Data không tối ưu được nên không thể ghi "SQL chỉ lấy id, total". **[Docs]**
- `java-08-data-web-security.js:496` Sai với Spring Data JPA: tài liệu Hibernate nói native query luôn kích hoạt flush khi dùng `EntityManager`. Không nên lấy đây làm lý do cần `saveAndFlush`. **[Docs]**

## 2. Chưa chính xác hoặc đã lỗi thời, đã sửa

Cả 39 điểm dưới đây đã được sửa. Số dòng là vị trí trước khi sửa.

### Java core và JVM

- `java-01-oop.js:859,906` "Đổi interface sang abstract class dễ hơn" không đứng vững. Đổi theo chiều nào cũng phá binary cũ: thử cả hai chiều đều ra `IncompatibleClassChangeError`. Nên nói: bắt đầu bằng interface, khi cần thì thêm abstract class hiện thực nó như `AbstractList`. **[Chạy]**
- `java-01-oop.js:1641` Javadoc ghi `List.add` là "optional operation" và cho phép `UnsupportedOperationException`. Nên nói `ArrayList` mới hứa `add()` chạy được. **[Source + Chạy]**
- `java-02-collections.js:62,352` `ArrayList` cần khoảng 23 lần grow để tới 100.000 và 29 lần để tới 1 triệu, không phải 17 và 35. **[Chạy]**
- `java-02-collections.js:437` Cột "tìm theo giá trị" của `HashMap` và `TreeMap` thực ra là tìm theo khoá. Javadoc chỉ cam kết O(1) và O(log n) cho thao tác theo khoá; `AbstractMap.containsValue` là tuyến tính. **[Source]**
- `java-02-collections.js:448` "LinkedList ngược lại" mâu thuẫn dòng 232. Javadoc nói thao tác theo index phải duyệt từ đầu hoặc cuối danh sách. **[Source]**
- `java-02-collections.js:1419,1437,1448` `UNTREEIFY_THRESHOLD = 6` chỉ dùng trong `split` lúc resize. Khi xoá node, `removeTreeNode` quyết định theo hình dạng cây. **[Source]**
- `java-02-collections.js:1917,1940` Bội của 16 chỉ dồn hết về bucket 0 khi `n = 16`. Bảng lớn hơn dùng nhiều bucket hơn, dù vẫn bỏ phí phần lớn. **[Chạy]**
- `java-02-collections.js:2331,2370` Trên Java 17, `computeIfAbsent` ghi lại cùng key ném `IllegalStateException: Recursive update`, không phải lúc nào cũng chết khoá. **[Chạy]**
- `java-02-collections.js:2512` `subMap(100, 200)` loại 200. Yêu cầu "từ 100 tới 200" cần `subMap(100, true, 200, true)`. **[Chạy]**
- `java-03-string-object-memory.js:56` `a = "Python"` chỉ gán lại tham chiếu, không ảnh hưởng `b` kể cả với kiểu mutable; đã thử bằng `StringBuilder`. Phải minh hoạ bằng thao tác sửa nội dung object. **[Chạy]**
- `java-03-string-object-memory.js:208,261` String table trên JDK 17 tự mở rộng: từ 65.536 lên 262.144 bucket trong phép thử. **[Chạy]**
- `java-04-exception-generics-stream.js:258` Fail-fast không "ngay lập tức" trong mọi trường hợp, xem lỗi for-each ở trên. **[Chạy]**
- `java-05-jvm-concurrency.js:170,200,208` G1 không phải lúc nào cũng là mặc định: với 1 CPU, JDK 17 chọn SerialGC. Điều này hay gặp trong container nhỏ. **[Chạy]**
- `java-05-jvm-concurrency.js:506,516,527` JLS định nghĩa `volatile` và `synchronized` bằng synchronizes-with và happens-before, không bằng "flush về main memory" hay "không đọc từ cache". Nên viết lại theo happens-before, khớp với dòng 593. **[Docs]**
- `java-05-jvm-concurrency.js:574,611` Danh sách synchronizes-with của JLS không có `final`. Đây là final field semantics riêng ở JLS §17.5, dựa trên freeze khi constructor kết thúc. **[Docs]**
- `java-05-jvm-concurrency.js:731-734` Demo `tryLock` bỏ quên `lockB`: chạy xong `lockA` đã nhả nhưng `lockB` vẫn bị giữ. **[Chạy]**
- `java-05-jvm-concurrency.js:958` `orTimeout` chỉ hoàn tất future bằng lỗi, task nền vẫn chạy tiếp. **[Chạy]**
- `java-05-jvm-concurrency.js:1084,1128` JEP 374 tắt biased locking mặc định từ Java 15, nên không kể nó là tối ưu hiện tại. JEP này không nói gì về việc `synchronized` và `ReentrantLock` tương đương từ Java 15, nên bỏ mốc đó. **[Docs + Chạy]**

### Spring và Boot

- `java-06-spring-core.js:21` Mặc định `@Autowired` trên field cũng là bắt buộc và thất bại khi không có bean phù hợp, nên "ẩn" là sai. Với singleton khởi tạo sớm, lỗi lộ ra lúc khởi động. **[Docs]**
- `java-06-spring-core.js:332` `ConfigurationPropertiesBindingPostProcessor` là `BeanPostProcessor`; `@Value` được `AutowiredAnnotationBeanPostProcessor` xử lý. BFPP chỉ đúng với phần đăng ký bộ thay thế `${...}`. **[Source]**
- `java-06-spring-core.js:1104,1131` Trong Boot, `@Async` mặc định dùng `ThreadPoolTaskExecutor` 8 core do auto-config tạo, trừ khi bật virtual thread hoặc có `Executor` riêng. **[Docs]**
- `java-06-spring-core.js:1151` Exception của `@Async void` mặc định được log, không biến mất hoàn toàn. **[Docs]**
- `java-07-spring-boot.js:1047,1091,1189,1220` Boot gắn `ApplicationConversionService` vào bean factory nên `@Value` chuyển được `Duration`, `DataSize`, `List`. Không cần tự parse. **[Source]**
- `java-07-spring-boot.js:930,976,1553,1569,1676` `/env` và `/configprops` mặc định che toàn bộ giá trị bằng `******`. **[Docs]**
- `java-07-spring-boot.js:1383` Jar không có `Main-Class` báo `no main manifest attribute`, không phải `ClassNotFoundException`. Phần JVM đã chạy thử; chưa chạy một dự án Maven thật thiếu plugin. **[Chạy]**
- `java-07-spring-boot.js:1402,1415,1507` Tài liệu hiện tại dùng `-Djarmode=tools`. **[Docs]**
- `java-07-spring-boot.js:2476-2491` Tài liệu Boot cảnh báo đúng tình huống này: container `static` bị dừng sau test class trong khi context vẫn được cache, nên test sau có thể lỗi. Nên quản lý container như Spring bean hoặc dùng singleton container. **[Docs]**
- `java-07-spring-boot.js:2853,2856` Starter logging có `log4j-to-slf4j` và `jul-to-slf4j`, không có cầu nối Log4j 1.x. **[Source]**
- `java-07-spring-boot.js:3227` Maven plugin loại devtools nhờ `excludeDevtools=true`; `optional` không phải cơ chế chính. **[Docs]**
- `java-07-spring-boot.js:3371` `toMap` sẽ ném `IllegalStateException` khi một field có hai lỗi validate. **[Chạy]**
- `java-07-spring-boot.js:3607,3619` `@MockBean` không đánh dấu context dirty; bean override là một phần của cache key. **[Docs]**
- `java-07-spring-boot.js:3668` Có cả `.properties` và YAML thì `.properties` được ưu tiên, không phải một file bị bỏ qua. **[Docs]**

### JPA, MVC và Security

- `java-08-data-web-security.js:65,79` Hibernate mặc định set mọi cột trừ định danh khi update. Chỉ `@DynamicUpdate` mới giới hạn ở cột đã đổi. **[Docs]**
- `java-08-data-web-security.js:124,128` Boot mặc định `spring.jpa.open-in-view=true`, nên ví dụ controller không ném `LazyInitializationException` trừ khi đã tắt thuộc tính này. **[Docs + Source]**
- `java-08-data-web-security.js:160` Fetch join có ngữ nghĩa như inner hoặc outer join tương ứng, nên `JOIN FETCH` loại đơn không có dòng nào. Dùng `LEFT JOIN FETCH`. **[Docs]**
- `java-08-data-web-security.js:847-848` `applyPostHandle` nằm ngay sau handler trong cùng khối `try`, nên handler ném lỗi thì `postHandle` bị bỏ qua; `afterCompletion` vẫn chạy. **[Source]**
- `java-08-data-web-security.js:926` `SecurityContextPersistenceFilter` đã deprecated, thay bằng `SecurityContextHolderFilter`. **[Docs + Source]**
- `java-08-data-web-security.js:982` Khai `requestMatchers` sau `anyRequest` làm cấu hình báo lỗi, không phải "mở toang". **[Source]**
- `java-08-data-web-security.js:1217-1219` Theo đặc tả JPA, `clear` chỉ làm entity thành detached, không nạp lại giá trị. Object `o` vẫn giữ `"NEW"`; phải đọc lại entity. **[Docs]**

## 3. Lỗi nhỏ, đã sửa

Cả 27 điểm dưới đây đã được sửa. Số dòng là vị trí trước khi sửa.

- `java-01-oop.js:564` `addAll` có mô tả trong Javadoc của `AbstractCollection`; nên nói `HashSet` không cam kết điều đó. **[Source]**
- `java-01-oop.js:807` "thường không có" nên là "không có" instance state: field của interface luôn `public static final`. **[Docs + Chạy]**
- `java-01-oop.js:897` Biểu thức hiện tại trả về `Instant` 1970-01-01T00:00:05Z thay vì khoảng thời gian. Dùng `Duration.between(start, clock.instant())`, ra `PT5S`. **[Chạy]**
- `java-01-oop.js:1202` "Ba nguyên tắc S, I" phải là "Hai". **[Đọc nội dung]**
- `java-01-oop.js:508` "Dog is a Animal" phải là "is an". **[Đọc nội dung]**
- `java-01-oop.js:1014,1030` Gọi DB trong `computeIfAbsent` trái với Javadoc `ConcurrentHashMap`: hàm tính nên ngắn và đơn giản vì có thể chặn thread khác. **[Source]**
- `java-02-collections.js:1221` Cần 17 key mới chắc chắn collision trên bảng 16 ô; 16 key `Integer` từ 0 đến 15 chiếm đủ 16 bucket. **[Chạy]**
- `java-02-collections.js:1716,1756` Lần resize cuối xảy ra khi vượt ngưỡng 786.432, nên dời khoảng 786.000 entry, không phải 1 triệu. **[Source]**
- `java-02-collections.js:2125` Entry vẫn xoá được qua iterator hoặc `keySet().removeIf`. **[Chạy]**
- `java-02-collections.js:2481,2520,2545` `TreeMap` nhận key null nếu comparator hỗ trợ. **[Chạy]**
- `java-02-collections.js:2807,2940` Chèn tăng dần: key 999 sâu 16 bước, key 999.999 sâu 37 bước, không phải ~10 và ~20. **[Chạy]**
- `java-03-string-object-memory.js:75,91,97,114` String có thể trả chính nó khi không có gì đổi. **[Chạy]**
- `java-03-string-object-memory.js:1562,1600` Đặc tả JPA yêu cầu constructor không tham số, class và persistent field không `final`; không yêu cầu setter. **[Docs]**
- `java-03-string-object-memory.js:1603-1611` Pattern switch được phát hành chính thức ở Java 21, nên ghi rõ phiên bản. **[Docs]**
- `java-03-string-object-memory.js:1763-1764` Comment xếp dòng khiến đọc thành "ĐÚNG -> dữ liệu cũ đọc sai". **[Đọc nội dung]**
- `java-04-exception-generics-stream.js:155-157` Oracle mô tả runtime exception là vấn đề lập trình. Thiếu số dư là tình huống nghiệp vụ, nên comment cần đổi; vẫn có thể giữ unchecked nếu đó là quy ước của dự án. **[Docs]**
- `java-05-jvm-concurrency.js:951` `ordersF` được tạo từ `userF` nên không phải hai việc song song. **[Đọc code]**
- `java-05-jvm-concurrency.js:870,878` Gọi API đối tác không liên quan HikariCP. **[Đọc nội dung]**
- `java-06-spring-core.js:404` CGLIB proxy của Spring được tạo qua Objenesis, không gọi constructor khi JVM cho phép. **[Docs + Source]**
- `java-06-spring-core.js:677` `ObjectProvider` thuộc `org.springframework.beans.factory`, tức chính là API của Spring. **[Source]**
- `java-07-spring-boot.js:1502` Boot 3.5 có `launch.LaunchedClassLoader`, không có `launch.LaunchedURLClassLoader`; dòng này lệch với dòng 1356. **[Source]**
- `java-07-spring-boot.js:2138` "phút thứ 20" phải là "giây thứ 20". **[Đọc nội dung]**
- `java-07-spring-boot.js:3792` "BA CÁI BẪY" nhưng liệt kê bốn. **[Đọc nội dung]**
- `java-08-data-web-security.js:762` Thiếu path variable trả 500; 400 chỉ áp dụng khi giá trị thành null sau chuyển đổi. **[Source]**
- `java-08-data-web-security.js:917` Theo Fetch Standard, `Content-Type: application/json` không thuộc nhóm an toàn nên cũng gây preflight. **[Docs]**
- `java-08-data-web-security.js:1110` Spring Data scroll trả `Window`, không phải `Slice`. **[Docs]**
- `assets/diagrams/java.js:115` Tài liệu G1 nêu ngoại lệ: humongous object được cấp phát thẳng vào old generation. **[Docs]**

## 4. Giới hạn của lần rà soát

- Đã đối chiếu hoặc kiểm tra xong toàn bộ 90 điểm còn giữ lại.
- Spring, Boot, Hibernate và Security chưa được chạy trong một ứng dụng thật. Các kết luận về chúng dựa trên tài liệu và mã nguồn.
- Tài liệu Spring và Boot là bản mới nhất trên trang chính thức, còn một số mã nguồn Boot lấy ở v3.5.0. Nếu vault nhắm Boot 3.2, nên ghi rõ mốc phiên bản trong câu trả lời.
- Hai tài liệu Hibernate 6.6 mô tả khác nhau về native query khi dùng `Session` thuần. Kết luận ở `java-08-data-web-security.js:496` chỉ áp dụng cho `EntityManager`, là thứ Spring Data JPA dùng.
- Các dòng không được liệt kê là không thấy lỗi đáng kể khi đọc, không có nghĩa từng dòng đã được chạy thử.

## 5. Điểm đã rút lại

- `java-05-jvm-concurrency.js:865` Lần rà trước nói `cores x (1 + W/C)` không phải công thức Little. Nhận xét đó quá chặt: với throughput `cores / C` và thời gian mỗi tác vụ `C + W`, công thức này suy ra trực tiếp từ `L = λW`. Không cần sửa dòng này.
