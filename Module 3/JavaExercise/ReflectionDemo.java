import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

public class ReflectionDemo {
    // Sample class for demonstration
    public static class SampleClass {
        private String name;
        public int value;
        
        public SampleClass() {
            this.name = "Default";
            this.value = 0;
        }
        
        public SampleClass(String name, int value) {
            this.name = name;
            this.value = value;
        }
        
        public void display() {
            System.out.println("Name: " + name + ", Value: " + value);
        }
        
        // Private method removed as it was unused
        
        public String getName() {
            return name;
        }
    }

    public static void main(String[] args) {
        try {
            // Get the Class object using the fully qualified name
            Class<?> clazz = Class.forName("ReflectionDemo$SampleClass");
            
            // Print class information
            System.out.println("=== Class Information ===");
            System.out.println("Class Name: " + clazz.getName());
            System.out.println("Simple Name: " + clazz.getSimpleName());
            System.out.println("Package: " + clazz.getPackageName());
            System.out.println("Modifiers: " + Modifier.toString(clazz.getModifiers()));
            
            // Get and print constructors
            System.out.println("\n=== Constructors ===");
            Constructor<?>[] constructors = clazz.getDeclaredConstructors();
            for (Constructor<?> constructor : constructors) {
                System.out.println("Constructor: " + constructor);
            }
            
            // Get and print methods
            System.out.println("\n=== Methods ===");
            Method[] methods = clazz.getDeclaredMethods();
            for (Method method : methods) {
                System.out.println("Method: " + method);
            }
            
            // Get and print fields
            System.out.println("\n=== Fields ===");
            Field[] fields = clazz.getDeclaredFields();
            for (Field field : fields) {
                System.out.println("Field: " + field);
            }
            
            // Create an instance using reflection
            System.out.println("\n=== Creating Instance ===");
            Constructor<?> constructor = clazz.getConstructor(String.class, int.class);
            Object instance = constructor.newInstance("Reflection", 42);
            
            // Invoke a method using reflection
            System.out.println("\n=== Invoking Methods ===");
            Method displayMethod = clazz.getMethod("display");
            displayMethod.invoke(instance);
            
            // Access and modify a field using reflection
            System.out.println("\n=== Accessing Fields ===");
            Field valueField = clazz.getField("value");
            System.out.println("Original value: " + valueField.getInt(instance));
            valueField.setInt(instance, 100);
            System.out.println("New value: " + valueField.getInt(instance));
            
            // Access private field
            System.out.println("\n=== Accessing Private Field ===");
            Field nameField = clazz.getDeclaredField("name");
            nameField.setAccessible(true); // Allow access to private field
            System.out.println("Private name field: " + nameField.get(instance));
            
            // Invoke private method
            System.out.println("\n=== Invoking Private Method ===");
            Method privateMethod = clazz.getDeclaredMethod("privateMethod");
            privateMethod.setAccessible(true);
            privateMethod.invoke(instance);
            
        } catch (Exception e) {
            System.err.println("Reflection error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
