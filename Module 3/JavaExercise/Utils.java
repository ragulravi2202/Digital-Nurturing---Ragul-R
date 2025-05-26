/**
 * A utility class that provides greeting functionality.
 * This class is part of a Java module system example.
 */
public class Utils {
    
    /**
     * Returns a greeting message for the given name.
     * 
     * @param name the name to include in the greeting
     * @return a personalized greeting message
     */
    public static String greet(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        return "Hello, " + name.trim() + "! Welcome to Java Modules!";
    }
}
