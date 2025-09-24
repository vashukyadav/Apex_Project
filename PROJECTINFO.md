# HRMS Project - Complete Information

## 🏢 Project Overview
**Enterprise HRMS (Human Resource Management System)**
- Full-stack web application for HR operations
- Modern UI with glass morphism design
- Role-based access control (Admin/Employee)
- Real-time data management

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT + Bcrypt
- **PDF Generation**: Puppeteer
- **Port**: 3000

### Frontend
- **Framework**: Angular 17
- **UI Library**: Angular Material
- **Styling**: Tailwind CSS + Custom SCSS
- **Fonts**: Inter, Poppins
- **HTTP Client**: Angular HttpClient
- **Port**: 4200

## 📁 Project Structure
```
hrms-project/
├── backend/
│   ├── config/database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   ├── attendanceController.js
│   │   └── payrollController.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Leave.js
│   │   ├── Attendance.js
│   │   └── Payroll.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employee.js
│   │   ├── leave.js
│   │   ├── attendance.js
│   │   └── payroll.js
│   ├── utils/seedData.sql
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── auth/login.component.ts
│   │   │   ├── dashboard/dashboard.component.ts
│   │   │   ├── admin/admin-dashboard.component.ts
│   │   │   ├── employee/
│   │   │   │   ├── employee-list.component.ts
│   │   │   │   ├── leave-management.component.ts
│   │   │   │   ├── attendance.component.ts
│   │   │   │   └── payroll.component.ts
│   │   │   └── shared/navbar.component.ts
│   │   ├── services/
│   │   ├── guards/
│   │   ├── models/
│   │   └── app.routes.ts
│   ├── styles.scss
│   └── tailwind.config.js
└── HRMS_API_Collection.postman_collection.json
```

## 🎯 Core Features

### 1. Authentication & Authorization
- JWT-based secure login
- Role-based access (Admin/Employee)
- Password encryption with bcrypt
- Route guards for protected pages

### 2. Employee Management
- Employee registration and profiles
- Employee list with search/filter
- Employee activation/deactivation
- Department and position management

### 3. Leave Management
- Leave application system
- Multiple leave types (sick, casual, annual, maternity, paternity)
- Admin approval/rejection workflow
- Leave history tracking
- **NEW**: Clear leave history functionality

### 4. Attendance Management
- Daily check-in/check-out system
- Working hours calculation
- Attendance history and reports
- Monthly attendance statistics

### 5. Payroll Management
- Automated salary calculations
- PDF payslip generation
- Monthly payroll processing
- Allowances and deductions

### 6. Employee Offboarding
- Exit process workflow management
- Multiple offboarding reasons (resignation, termination, retirement, contract end)
- Exit interview and asset return tracking
- Final settlement calculations
- Employee deactivation with history

### 7. Notification System
- Real-time notifications for employees
- Leave approval/rejection alerts
- Payroll generation notifications
- Attendance alerts
- Offboarding process updates
- Unread count tracking

## 🎨 UI/UX Features

### Modern Design Elements
- **Glass Morphism**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Multi-color gradients throughout
- **Animations**: Slide-in, fade-in, floating animations
- **Neon Glow Effects**: Subtle glowing on key elements
- **Custom Scrollbar**: Styled with gradient colors

### Enhanced Components
- **Login Page**: Animated background with floating orbs
- **Sidebar Navigation**: Glass effect with hover animations
- **Dashboard Cards**: Gradient cards with hover effects
- **Interactive Buttons**: Scale and rotation animations
- **Typography**: Modern font combinations (Inter + Poppins)

## 🔐 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Role-based route protection
- Input validation and sanitization
- CORS configuration
- Admin-only endpoints protection

## 📊 Database Schema

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

### Offboardings Table
- id, employeeId, initiatedBy, reason, lastWorkingDay, exitInterviewCompleted, assetsReturned, finalSettlementAmount, status, notes

### Notifications Table
- id, userId, type, title, message, isRead, relatedId

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Employee Management
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee

### Leave Management
- `GET /api/leaves` - Get all leaves (Admin)
- `GET /api/leaves/my-leaves` - Get employee's leaves
- `POST /api/leaves` - Apply for leave
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave
- `DELETE /api/leaves/clear-all` - Clear all leaves (Admin)
- `DELETE /api/leaves/clear-my-leaves` - Clear user's leaves

### Attendance Management
- `GET /api/attendance` - Get all attendance (Admin)
- `GET /api/attendance/my-attendance` - Get employee's attendance
- `POST /api/attendance/checkin` - Check in
- `PUT /api/attendance/checkout` - Check out

### Payroll Management
- `GET /api/payroll` - Get all payrolls (Admin)
- `GET /api/payroll/my-payroll` - Get employee's payroll
- `POST /api/payroll/generate` - Generate payroll
- `GET /api/payroll/:id/pdf` - Download payslip PDF

### Offboarding Management
- `GET /api/offboarding` - Get all offboarding records (Admin)
- `POST /api/offboarding` - Initiate offboarding (Admin)
- `PUT /api/offboarding/:id` - Update offboarding record (Admin)
- `PUT /api/offboarding/:id/complete` - Complete offboarding (Admin)

### Notification Management
- `GET /api/notifications/my-notifications` - Get user's notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read

## 👥 Default User Accounts

### Admin Account
- **Email**: admin@company.com
- **Password**: password123
- **Role**: Admin
- **Access**: Full system access

### Employee Accounts
- **Email**: john.doe@company.com
- **Password**: password123
- **Role**: Employee

- **Email**: jane.smith@company.com
- **Password**: password123
- **Role**: Employee

- **Email**: mike.johnson@company.com
- **Password**: password123
- **Role**: Employee

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- Angular CLI (v17+)

### Backend Setup
```bash
cd backend
npm install
# Configure .env file
mysql -u root -p < utils/seedData.sql
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## 🎨 Custom Styling Features

### Tailwind Extensions
- Custom animations (fade-in, slide-in, float)
- Glass morphism utilities
- Gradient text classes
- Custom shadows and glows
- Extended color palette

### SCSS Enhancements
- Custom scrollbar styling
- Material Design overrides
- Animation keyframes
- Responsive utilities

## 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Flexible grid layouts
- Touch-friendly interactions

## 🔄 Recent Updates
- Enhanced UI with glass morphism design
- Added leave history clear functionality
- Improved animations and transitions
- Better typography and spacing
- Enhanced color scheme and gradients
- **NEW**: Employee Offboarding workflow system
- **NEW**: Real-time notification system with unread count
- **NEW**: Exit process management with settlement tracking

## 📈 Performance Features
- Lazy loading components
- Optimized bundle sizes
- Efficient API calls
- Smooth animations (60fps)
- Responsive image handling

## 🛡️ Error Handling
- Global error interceptors
- User-friendly error messages
- Validation feedback
- Loading states
- Retry mechanisms

## 📋 Testing
- Postman collection included
- API endpoint testing
- Component testing setup
- Error scenario coverage

## 🚀 Deployment Ready
- Production build configurations
- Environment variable setup
- Docker support ready
- CI/CD pipeline compatible

## 📞 Support & Maintenance
- Modular code structure
- Comprehensive documentation
- Easy feature additions
- Scalable architecture
- Regular updates support3