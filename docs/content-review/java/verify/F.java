import java.util.*;
public class F { public static void main(String[] z){ int a=0b0000_0000_0000_0001_0000_0000_0000_0101,b=0b0000_0000_0000_0010_0000_0000_0000_0101;
 System.out.println((a&15)+","+(b&15)+" -> "+((a^(a>>>16))&15)+","+((b^(b>>>16))&15));
 Set<Integer> s=new TreeSet<>(); for(long id=16;id<=1600;id+=16){int h=Long.hashCode(id>>>4); s.add((h^(h>>>16))&15);} System.out.println("Long.hashCode(id>>>4) buckets="+s.size());
 List<String> l=new ArrayList<>(List.of("a","b","c")); try{for(String t:l) if(t.equals("a")) l.remove(t); System.out.println("no CME");}catch(ConcurrentModificationException e){System.out.println("remove a -> CME");} } }
