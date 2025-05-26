import java.util.concurrent.atomic.AtomicInteger;

/**
 * Demo of Java 21 Virtual Threads
 * 
 * This example demonstrates the use of virtual threads, which are lightweight threads
 * that are managed by the Java runtime rather than the operating system.
 * 
 * Virtual threads are particularly useful for I/O-bound tasks where threads spend
 * most of their time waiting for I/O operations to complete.
 */
public class VirtualThreadDemo {
    
    // Counter to track the number of active threads
    private static final AtomicInteger threadCounter = new AtomicInteger(0);
    
    public static void main(String[] args) {
        System.out.println("=== Java 21 Virtual Threads Demo ===");
        System.out.println("Starting 100,000 virtual threads...");
        System.out.println("(This may take a moment to complete)");
        
        long startTime = System.currentTimeMillis();
        
        // Create and start 100,000 virtual threads
        for (int i = 0; i < 100_000; i++) {
            int threadNumber = i + 1;
            
            // Start a virtual thread using Thread.startVirtualThread()
            Thread.startVirtualThread(() -> {
                int activeThreads = threadCounter.incrementAndGet();
                
                // Simulate some work (I/O operation, network call, etc.)
                try {
                    // Sleep for a short time to simulate work
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                
                // Print a message every 10,000 threads
                if (threadNumber % 10_000 == 0) {
                    System.out.printf("Thread #%,d completed. Active threads: %,d%n", 
                                     threadNumber, activeThreads);
                }
                
                threadCounter.decrementAndGet();
            });
        }
        
        // Wait for all virtual threads to complete
        // In a real application, you'd use ExecutorService or Structured Concurrency
        while (threadCounter.get() > 0) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        System.out.printf("\nAll virtual threads completed in %,d ms%n", duration);
        
        // Demonstrate virtual thread behavior with blocking operations
        System.out.println("\n=== Virtual Threads with Blocking Operations ===");
        
        // Platform thread (traditional)
        Thread platformThread = new Thread(() -> {
            System.out.println("Platform thread running...");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("Platform thread completed");
        });
        
        // Virtual thread
        Thread virtualThread = Thread.startVirtualThread(() -> {
            System.out.println("Virtual thread running...");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("Virtual thread completed");
        });
        
        // Start both threads
        platformThread.start();
        
        // Wait for both threads to complete
        try {
            platformThread.join();
            virtualThread.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("\n=== Virtual Threads Demo Completed ===");
    }
}
