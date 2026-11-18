# Nguồn đối chiếu Java

Ngày truy cập: 2026-11-18. Môi trường chạy thử: Java HotSpot 17.0.12.

## Java và JVM

| Nội dung | Nguồn | Phiên bản |
| --- | --- | --- |
| Memory model, `volatile`, `final` | [JLS chương 17](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html) | Java SE 21 |
| Tương thích binary | [JLS chương 13](https://docs.oracle.com/javase/specs/jls/se21/html/jls-13.html) | Java SE 21 |
| Field của interface | [JLS chương 9](https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html) | Java SE 21 |
| Tuỳ chọn `--finalization` | [Lệnh java](https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html) | JDK 21 |
| Biased locking | [JEP 374](https://openjdk.org/jeps/374) | Java 15 |
| Pattern switch | [JEP 441](https://openjdk.org/jeps/441) | Java 21 |
| G1 và humongous object | [G1 GC Guide](https://docs.oracle.com/en/java/javase/21/gctuning/garbage-first-g1-garbage-collector1.html) | JDK 21 |
| Exception | [Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html) | Tutorial |
| Collections và `ConcurrentHashMap` | [OpenJDK `java.util`](https://github.com/openjdk/jdk/tree/jdk-17-ga/src/java.base/share/classes/java/util) | `jdk-17-ga` |

## Spring và Spring Boot

| Nội dung | Nguồn | Phiên bản |
| --- | --- | --- |
| `@Autowired` | [Autowired](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired.html), [Qualifiers](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-qualifiers.html) | Bản hiện hành |
| Thứ tự chọn bean | [`DefaultListableBeanFactory`](https://github.com/spring-projects/spring-framework/blob/main/spring-beans/src/main/java/org/springframework/beans/factory/support/DefaultListableBeanFactory.java) | `main` |
| AOP proxy | [Proxying](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html) | Bản hiện hành |
| `@Transactional` | [Annotation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html) | Bản hiện hành |
| `@Async`, `@Scheduled` | [Scheduling](https://docs.spring.io/spring-framework/reference/integration/scheduling.html), [Javadoc post-processor](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/annotation/ScheduledAnnotationBeanPostProcessor.html) | Bản hiện hành |
| Validation MVC | [Validation](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html) | Bản hiện hành |
| Interceptor | [Interceptor](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/handlermapping-interceptor.html), [`DispatcherServlet`](https://github.com/spring-projects/spring-framework/blob/main/spring-webmvc/src/main/java/org/springframework/web/servlet/DispatcherServlet.java) | `main` |
| Context cache | [Context Caching](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/ctx-management/caching.html) | Bản hiện hành |
| Validation starter | [Boot 2.3 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.3-Release-Notes) | Boot 2.3 |
| Thứ tự cấu hình | [Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) | Bản hiện hành |
| Actuator | [Endpoints](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html) | Bản hiện hành |
| Task execution | [Task Execution](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html) | Bản hiện hành |
| Logging | [Logging](https://docs.spring.io/spring-boot/reference/features/logging.html), [starter logging](https://github.com/spring-projects/spring-boot/blob/v3.5.0/spring-boot-project/spring-boot-starters/spring-boot-starter-logging/build.gradle) | v3.5.0 |
| Docker layer | [Dockerfiles](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html) | Bản hiện hành |
| DevTools | [Maven Plugin](https://docs.spring.io/spring-boot/maven-plugin/packaging.html) | Bản hiện hành |
| Testcontainers | [Boot Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html), [JUnit 5](https://java.testcontainers.org/test_framework_integration/junit_5/) | Bản hiện hành |

## JPA, Hibernate và Security

| Nội dung | Nguồn | Phiên bản |
| --- | --- | --- |
| Entity, fetch join, `clear` | [Jakarta Persistence 3.1](https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html) | 3.1 |
| Flush, update | [Hibernate User Guide](https://docs.hibernate.org/orm/6.6/userguide/html_single/Hibernate_User_Guide.html) | 6.6 |
| `@BatchSize` | [Javadoc](https://docs.hibernate.org/orm/6.6/javadocs/org/hibernate/annotations/BatchSize.html) | 6.6 |
| Null vào primitive | [`SetterFieldImpl`](https://github.com/hibernate/hibernate-orm/blob/6.6/hibernate-core/src/main/java/org/hibernate/property/access/spi/SetterFieldImpl.java) | 6.6 |
| Query method | [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html) | Bản hiện hành |
| Locking | [Spring Data JPA Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html) | Bản hiện hành |
| Projection | [Projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html) | Bản hiện hành |
| Scroll | [Scrolling](https://docs.spring.io/spring-data/commons/reference/repositories/scrolling.html) | Bản hiện hành |
| Filter chain | [Security Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html), [Persistence](https://docs.spring.io/spring-security/reference/servlet/authentication/persistence.html) | Bản hiện hành |
| Thứ tự rule | [`AbstractRequestMatcherRegistry`](https://github.com/spring-projects/spring-security/blob/main/config/src/main/java/org/springframework/security/config/annotation/web/AbstractRequestMatcherRegistry.java) | `main` |
| CORS | [Fetch Standard](https://fetch.spec.whatwg.org/) | Living Standard |

## Chạy lại kiểm chứng

Cần JDK 17 trở lên và Bash:

```bash
docs/content-review/java/verify/run.sh
```

Phép thử `HashMap` đa luồng chạy riêng vì có thể mất khoảng một phút:

```bash
docs/content-review/java/verify/run.sh race
```
