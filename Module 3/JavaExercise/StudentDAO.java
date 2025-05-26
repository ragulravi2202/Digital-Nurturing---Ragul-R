import java.sql.*;

public class StudentDAO {
    // Database connection details
    private static final String URL = "jdbc:mysql://localhost:3306/school?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "ragul0165";
    private Connection connection;

    // Constructor to initialize database connection
    public StudentDAO() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Insert a new student record
    public boolean insertStudent(int id, String name) {
        String sql = "INSERT INTO students (id, name) VALUES (?, ?)";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            pstmt.setString(2, name);
            
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.err.println("Error inserting student: " + e.getMessage());
            return false;
        }
    }

    // Update an existing student's name
    public boolean updateStudent(int id, String newName) {
        String sql = "UPDATE students SET name = ? WHERE id = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, newName);
            pstmt.setInt(2, id);
            
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.err.println("Error updating student: " + e.getMessage());
            return false;
        }
    }

    // Close the database connection
    public void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            System.err.println("Error closing connection: " + e.getMessage());
        }
    }

    // Main method to test the DAO
    public static void main(String[] args) {
        StudentDAO dao = new StudentDAO();
        
        try {
            // Test insert
            System.out.println("Inserting new student...");
            boolean inserted = dao.insertStudent(101, "John Doe");
            System.out.println("Insert " + (inserted ? "successful" : "failed"));
            
            // Test update
            System.out.println("\nUpdating student...");
            boolean updated = dao.updateStudent(101, "John Smith");
            System.out.println("Update " + (updated ? "successful" : "failed"));
            
        } finally {
            // Ensure connection is closed
            dao.close();
        }
    }
}
