# HR Management System (HRMS)

A complete full-stack HR Management System built with Node.js, Express.js, MySQL, and Angular.

## Features

### Authentication
- JWT-based authentication
- Role-based access control (Admin/Employee)
- Secure password hashing with bcrypt

### Employee Management
- Employee onboarding and profile management
- Employee list with search and filter
- Employee deactivation (offboarding)

### Leave Management
- Leave application by employees
- Leave approval/rejection by admin
- Leave history and status tracking
- Multiple leave types (sick, casual, annual, maternity, paternity)

### Attendance Management
- Daily check-in/check-out
- Working hours calculation
- Attendance history and statistics
- Monthly attendance reports

### Payroll Management
- Automated salary calculation
- Payslip generation in PDF format
- Monthly payroll processing
- Allowances and deductions management

### Employee Portal
- Personal dashboard with statistics
- Quick actions (check-in/out, apply leave)
- Notifications and updates

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT + Bcrypt
- **PDF Generation**: Puppeteer

### Frontend
- **Framework**: Angular 17
- **UI Library**: Angular Material
- **Styling**: Tailwind CSS
- **HTTP Client**: Angular HttpClient

## Project Structure

```
hrms-project/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   ├── attendanceController.js
│   │   └── payrollController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Leave.js
│   │   ├── Attendance.js
│   │   ├── Payroll.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employee.js
│   │   ├── leave.js
│   │   ├── attendance.js
│   │   └── payroll.js
│   ├── utils/
│   │   └── seedData.sql
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── models/
│   │   │   ├── app.component.ts
│   │   │   └── app.routes.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── HRMS_API_Collection.postman_collection.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Angular CLI (v17 or higher)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Update .env file with your database credentials
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=hrms_db
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Create database and seed data**
   ```sql
   -- Run the SQL commands from utils/seedData.sql
   mysql -u root -p < utils/seedData.sql
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

   The backend server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally (if not installed)**
   ```bash
   npm install -g @angular/cli
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```

   The frontend application will run on `http://localhost:4200`

## Default Login Credentials

### Admin Account
- **Email**: admin@company.com
- **Password**: password123

### Employee Accounts
- **Email**: john.doe@company.com
- **Password**: password123

- **Email**: jane.smith@company.com
- **Password**: password123

- **Email**: mike.johnson@company.com
- **Password**: password123

## API Testing

Import the `HRMS_API_Collection.postman_collection.json` file into Postman to test all API endpoints.

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Employee Management
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee

#### Leave Management
- `GET /api/leaves` - Get all leaves (Admin)
- `GET /api/leaves/my-leaves` - Get employee's leaves
- `POST /api/leaves` - Apply for leave
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave

#### Attendance Management
- `GET /api/attendance` - Get all attendance (Admin)
- `GET /api/attendance/my-attendance` - Get employee's attendance
- `POST /api/attendance/checkin` - Check in
- `PUT /api/attendance/checkout` - Check out

#### Payroll Management
- `GET /api/payroll` - Get all payrolls (Admin)
- `GET /api/payroll/my-payroll` - Get employee's payroll
- `POST /api/payroll/generate` - Generate payroll
- `GET /api/payroll/:id/pdf` - Download payslip PDF

## Database Schema

### Users Table
- id, email, password, role, isActive

### Employees Table
- id, employeeId, firstName, lastName, email, phone, department, position, salary, joinDate, isActive, userId

### Leaves Table
- id, employeeId, leaveType, startDate, endDate, reason, status, approvedBy, approvedAt

### Attendances Table
- id, employeeId, date, checkIn, checkOut, workingHours, status

### Payrolls Table
- id, employeeId, month, year, basicSalary, allowances, deductions, netSalary, workingDays, presentDays

## Features Overview

### Admin Dashboard
- Employee statistics
- Pending leave requests
- Attendance overview
- Quick actions for HR operations

### Employee Dashboard
- Personal information
- Attendance status
- Leave balance
- Quick check-in/out actions

### Responsive Design
- Mobile-friendly interface
- Modern UI with Angular Material
- Tailwind CSS for styling

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 for process management
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build for production: `ng build --prod`
2. Deploy to web server (Apache/Nginx)
3. Configure routing for SPA

## Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.

## Support
For support and questions, please contact the development team.