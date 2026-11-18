import java.util.*; import java.util.concurrent.*;
public class Race { record K(int v) implements Comparable<K>{ public int hashCode(){return v%4;} public int compareTo(K o){return Integer.compare(v,o.v);} }
 public static void main(String[] a) throws Exception { long end=System.currentTimeMillis()+45000; int round=0; Map<String,Integer> errs=new TreeMap<>();
  while(System.currentTimeMillis()<end){ round++; Map<K,Integer> m=new HashMap<>(); Thread[] ts=new Thread[8]; CountDownLatch go=new CountDownLatch(1);
   for(int t=0;t<8;t++){int id=t; ts[t]=new Thread(()->{try{go.await(); for(int i=0;i<3000;i++){K k=new K(id*3000+i); m.put(k,i); m.get(k); if(i%3==0)m.remove(k);}}catch(Throwable e){errs.merge(e.getClass().getSimpleName(),1,Integer::sum);}}); ts[t].setDaemon(true); ts[t].start();}
   go.countDown(); long dl=System.currentTimeMillis()+4000; for(Thread t:ts) t.join(Math.max(1,dl-System.currentTimeMillis()));
   for(Thread t:ts) if(t.isAlive()){ StackTraceElement[] st=t.getStackTrace(); System.out.println("HUNG round="+round+" state="+t.getState()); for(int i=0;i<Math.min(4,st.length);i++)System.out.println("  "+st[i]); System.out.println("errors="+errs); System.exit(0);} }
  System.out.println("no hang rounds="+round+" errors="+errs); } }
