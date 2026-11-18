import java.util.*; import java.util.concurrent.*; import java.util.concurrent.locks.*; import java.time.*;
public class T { interface I { int X = 1; }
 public static void main(String[] z) throws Exception {
  StringBuilder a=new StringBuilder("x"), b=a; a=new StringBuilder("y"); System.out.println("reassign a; b="+b);
  ReentrantLock A=new ReentrantLock(),B=new ReentrantLock();
  if(A.tryLock(1,TimeUnit.SECONDS)){try{ if(B.tryLock(1,TimeUnit.SECONDS)){} } finally{A.unlock();}}
  System.out.println("after demo lockA held="+A.isLocked()+" lockB held="+B.isLocked());
  Clock c=Clock.fixed(Instant.parse("2026-01-01T00:00:05Z"),ZoneOffset.UTC); Instant s=Instant.parse("2026-01-01T00:00:00Z");
  System.out.println("minusMillis="+c.instant().minusMillis(s.toEpochMilli())+" duration="+Duration.between(s,c.instant()));
  System.out.println("iface field mods="+java.lang.reflect.Modifier.toString(I.class.getField("X").getModifiers()));
  Set<Integer> bk=new HashSet<>(); for(int i=0;i<16;i++){int h=Integer.hashCode(i);bk.add((h^(h>>>16))&15);} System.out.println("16 Integer keys distinct buckets="+bk.size());
  List<Integer> im=new AbstractList<>(){public Integer get(int i){return 1;}public int size(){return 1;}}; try{im.add(2);}catch(Exception e){System.out.println("List.add on valid List: "+e.getClass().getSimpleName());}
 }}
