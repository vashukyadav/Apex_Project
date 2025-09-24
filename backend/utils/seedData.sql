-- Create database
CREATE DATABASE IF NOT EXISTS hrms_db;
USE hrms_db;

-- Sample data for Users table
INSERT INTO Users (email, password, role, isActive, createdAt, updatedAt) VALUES
('admin@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1, NOW(), NOW()),
('john.doe@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 1, NOW(), NOW()),
('jane.smith@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 1, NOW(), NOW()),
('mike.johnson@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 1, NOW(), NOW());

-- Sample data for Employees table
INSERT INTO Employees (employeeId, firstName, lastName, email, phone, department, position, salary, joinDate, isActive, userId, createdAt, updatedAt) VALUES
('EMP001', 'John', 'Doe', 'john.doe@company.com', '+1234567890', 'IT', 'Software Developer', 75000.00, '2023-01-15', 1, 2, NOW(), NOW()),
('EMP002', 'Jane', 'Smith', 'jane.smith@company.com', '+1234567891', 'HR', 'HR Manager', 65000.00, '2023-02-01', 1, 3, NOW(), NOW()),
('EMP003', 'Mike', 'Johnson', 'mike.johnson@company.com', '+1234567892', 'Finance', 'Accountant', 55000.00, '2023-03-10', 1, 4, NOW(), NOW());

-- Sample data for Leaves table
INSERT INTO Leaves (employeeId, leaveType, startDate, endDate, reason, status, createdAt, updatedAt) VALUES
(1, 'sick', '2024-01-15', '2024-01-17', 'Flu symptoms', 'approved', NOW(), NOW()),
(2, 'annual', '2024-02-20', '2024-02-25', 'Family vacation', 'pending', NOW(), NOW()),
(3, 'casual', '2024-01-10', '2024-01-10', 'Personal work', 'approved', NOW(), NOW());

-- Sample data for Attendance table
INSERT INTO Attendances (employeeId, date, checkIn, checkOut, workingHours, status, createdAt, updatedAt) VALUES
(1, '2024-01-08', '09:00:00', '17:30:00', 8.5, 'present', NOW(), NOW()),
(1, '2024-01-09', '09:15:00', '17:45:00', 8.5, 'present', NOW(), NOW()),
(2, '2024-01-08', '08:45:00', '17:15:00', 8.5, 'present', NOW(), NOW()),
(2, '2024-01-09', '09:00:00', '17:30:00', 8.5, 'present', NOW(), NOW()),
(3, '2024-01-08', '09:30:00', '18:00:00', 8.5, 'present', NOW(), NOW());

-- Sample data for Payrolls table
INSERT INTO Payrolls (employeeId, month, year, basicSalary, allowances, deductions, netSalary, workingDays, presentDays, createdAt, updatedAt) VALUES
(1, 12, 2023, 75000.00, 15000.00, 7500.00, 82500.00, 22, 20, NOW(), NOW()),
(2, 12, 2023, 65000.00, 13000.00, 6500.00, 71500.00, 22, 22, NOW(), NOW()),
(3, 12, 2023, 55000.00, 11000.00, 5500.00, 60500.00, 22, 21, NOW(), NOW());

-- Note: Password for all users is 'password123'