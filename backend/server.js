const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const leaveRoutes = require('./routes/leave');
const attendanceRoutes = require('./routes/attendance');
const payrollRoutes = require('./routes/payroll');
const offboardingRoutes = require('./routes/offboarding');
const notificationRoutes = require('./routes/notification');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/offboarding', offboardingRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3002;

// Create database if it doesn't exist
const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.end();
    console.log('Database created/verified');
  } catch (error) {
    console.error('Database creation error:', error.message);
  }
}

// Create sample data
async function createSampleData() {
  const bcrypt = require('bcryptjs');
  const { User, Employee, Leave, Attendance, Payroll, Notification, Offboarding } = require('./models');
  
  try {
    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@company.com' },
      defaults: { email: 'admin@company.com', password: hashedPassword, role: 'admin' }
    });
    
    const [johnUser] = await User.findOrCreate({
      where: { email: 'john.doe@company.com' },
      defaults: { email: 'john.doe@company.com', password: hashedPassword, role: 'employee' }
    });
    
    const [janeUser] = await User.findOrCreate({
      where: { email: 'jane.smith@company.com' },
      defaults: { email: 'jane.smith@company.com', password: hashedPassword, role: 'employee' }
    });
    
    // Create employees
    const [john] = await Employee.findOrCreate({
      where: { employeeId: 'EMP001' },
      defaults: {
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1234567890',
        department: 'IT',
        position: 'Software Developer',
        salary: 75000,
        joinDate: '2023-01-15',
        userId: johnUser.id
      }
    });
    
    const [jane] = await Employee.findOrCreate({
      where: { employeeId: 'EMP002' },
      defaults: {
        employeeId: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1234567891',
        department: 'HR',
        position: 'HR Manager',
        salary: 65000,
        joinDate: '2023-02-01',
        userId: janeUser.id
      }
    });
    
    // Create sample leaves
    await Leave.findOrCreate({
      where: { employeeId: john.id, startDate: '2024-01-15' },
      defaults: {
        employeeId: john.id,
        leaveType: 'sick',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        reason: 'Flu symptoms',
        status: 'approved'
      }
    });
    
    await Leave.findOrCreate({
      where: { employeeId: jane.id, startDate: '2024-02-20' },
      defaults: {
        employeeId: jane.id,
        leaveType: 'annual',
        startDate: '2024-02-20',
        endDate: '2024-02-25',
        reason: 'Family vacation',
        status: 'pending'
      }
    });
    
    // Create sample attendance
    await Attendance.findOrCreate({
      where: { employeeId: john.id, date: '2024-01-08' },
      defaults: {
        employeeId: john.id,
        date: '2024-01-08',
        checkIn: '09:00:00',
        checkOut: '17:30:00',
        workingHours: 8.5,
        status: 'present'
      }
    });
    
    await Attendance.findOrCreate({
      where: { employeeId: jane.id, date: '2024-01-08' },
      defaults: {
        employeeId: jane.id,
        date: '2024-01-08',
        checkIn: '08:45:00',
        checkOut: '17:15:00',
        workingHours: 8.5,
        status: 'present'
      }
    });
    
    // Create sample payroll
    await Payroll.findOrCreate({
      where: { employeeId: john.id, month: 12, year: 2023 },
      defaults: {
        employeeId: john.id,
        month: 12,
        year: 2023,
        basicSalary: 75000,
        allowances: 15000,
        deductions: 7500,
        netSalary: 82500,
        workingDays: 22,
        presentDays: 20
      }
    });
    
    console.log('✅ Sample data created successfully!');
    
  } catch (error) {
    console.log('Sample data creation error:', error.message);
  }
}

// Sync database and start server
createDatabase().then(() => {
  return db.sync({ force: false });
}).then(() => {
  console.log('Database synced');
  return createSampleData();
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Login credentials:');
    console.log('Admin: admin@company.com / password123');
    console.log('Employee: john.doe@company.com / password123');
  });
}).catch(err => {
  console.error('Database sync error:', err);
});