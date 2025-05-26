-- Create and use the school database for exercises 31-32
CREATE DATABASE IF NOT EXISTS school;
USE school;

-- Create students table for Exercise 31-32
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Insert some sample data
INSERT INTO students (id, name) VALUES 
(1, 'John Doe'),
(2, 'Jane Smith'),
(3, 'Alice Johnson');

-- Create and use the bank database for exercise 33
CREATE DATABASE IF NOT EXISTS bank;
USE bank;

-- Create accounts table for Exercise 33
CREATE TABLE IF NOT EXISTS accounts (
    id INT PRIMARY KEY,
    balance DECIMAL(10, 2) NOT NULL
);

-- Insert some sample data
INSERT INTO accounts (id, balance) VALUES 
(1, 1000.00),
(2, 500.00);

-- Show the created data
SELECT 'School database and tables created successfully!' AS message;
SELECT * FROM school.students;

SELECT 'Bank database and tables created successfully!' AS message;
SELECT * FROM bank.accounts;
