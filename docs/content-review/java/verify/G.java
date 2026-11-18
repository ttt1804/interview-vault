import java.util.*; import java.time.*; import static java.util.stream.Collectors.*;
public class G { record E(String f,String m){} public static void main(String[] a){
 System.out.println(List.of(new E("email","x"),new E("email","y")).stream().collect(groupingBy(E::f,mapping(E::m,toList()))));
 Instant s=Instant.parse("2026-01-01T00:00:00Z"); System.out.println(Duration.between(s,s.plusSeconds(5))); } }
