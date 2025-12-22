# 🎫 Helpdesk Ticket Management System

A comprehensive helpdesk system built for efficient ticket management. The system provides a unified platform for employees to raise tickets and administrators to manage them.

## ✨ Features

### 🔐 User Roles

#### Administrator
- Secure authentication (Email + Mobile OTP)
- Manage employees and projects
- View system-wide ticket analytics
- Update ticket status and assignments
- Create announcements
- System settings management

#### Employees
- **No login required**
- Create tickets via the employee portal
- Check ticket status using Employee ID
- View complete ticket timeline with admin comments
- File attachments support

### 🎯 Core Functionality

- **Ticket Lifecycle**: Open → Under Review → Assigned → In Progress → Pending → Resolved → Closed
- **Priority System**: Low / Medium / High / Urgent
- **Project Management**: Organize tickets by projects
- **File Attachments**: Support for screenshots and documents
- **Real-time Updates**: Timeline tracking with comments
- **Email Notifications**: Automated emails for ticket updates

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update MongoDB URI
   - Set JWT secret
   - Configure email SMTP settings (for OTP and notifications)

3. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongodb://localhost:27017
   ```

4. **Run the Application**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

5. **Access the Application**
   - Admin Portal: `http://localhost:3000/admin`
   - Employee Portal: `http://localhost:3000/`

## 🎯 DEMO CREDENTIALS

### 👔 Administrator
```
URL:      http://localhost:3000/admin/login.html
Email:    admin@helpdesk.com
Password: Admin@123
```

**Note:** OTP verification is required. In development mode, check the server console for the OTP code.

### 👥 Employee Portal (No Login Required)
```
URL:      http://localhost:3000/
```
**Note:** Employees don't need to login - just use Employee ID to create/check tickets.



## 📁 Project Structure

```
helpdesk/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # Admin users
│   │   ├── Employee.js          # Employees
│   │   ├── Project.js           # Projects
│   │   ├── Ticket.js            # Support tickets
│   │   └── Announcement.js      # Admin announcements
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── employeeController.js
│   │   ├── projectController.js
│   │   ├── ticketController.js
│   │   └── announcementController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── projects.js
│   │   ├── tickets.js
│   │   └── announcements.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   └── emailService.js      # Email notifications
│   └── server.js                # Express app entry point
├── frontend/
│   ├── shared/
│   │   ├── css/
│   │   │   └── styles.css       # Premium design system
│   │   └── js/
│   │       └── api.js           # API client & utilities
│   ├── admin/                   # Admin dashboard
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── tickets.html
│   │   ├── employees.html
│   │   ├── projects.html
│   │   ├── announcements.html
│   │   └── settings.html
│   ├── index.html               # Employee portal landing
│   ├── create-ticket.html       # Ticket creation form
│   └── check-status.html        # Status checking
├── uploads/                      # File storage
├── .env                          # Environment variables
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/verify-otp` - Verify OTP after login
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/me` - Get current user

### Employees (Admin)
- `POST /api/employees` - Add employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee
- `POST /api/employees/bulk-import` - Bulk import employees

### Projects (Admin)
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Deactivate project

### Tickets
- `POST /api/tickets` - Create ticket (Public - Employee)
- `GET /api/tickets/employee` - Get employee tickets (Public, using query param or ID)
- `GET /api/tickets/by-ticket-id/:ticketId` - Get ticket details (Public)
- `GET /api/tickets` - Get all tickets (Admin)
- `PUT /api/tickets/:id` - Update ticket status (Admin)
- `GET /api/tickets/stats` - Get ticket statistics (Admin)

### Announcements
- `POST /api/announcements` - Create announcement (Admin)
- `GET /api/announcements` - Get announcements (Public)
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

## 🎨 Design System

The application uses a premium design system with:
- **Inter Font Family** - Clean, modern typography
- **Gradient Backgrounds** - Purple-themed gradients
- **Smooth Animations** - Micro-interactions for better UX
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **Consistent Spacing** - Design tokens for spacing, colors, shadows
- **Status Colors** - Clear visual indicators for ticket status and priority

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Email Verification** - Verified admin accounts
- **OTP Verification** - Two-factor authentication for admin login
- **Role-based Access Control** - Granular permissions
- **File Upload Validation** - Secure file handling
- **Input Sanitization** - XSS protection

## 📊 Business Features

- **Analytics Dashboard** - System-wide insights

## 🚧 Roadmap

### Phase 1 (Current - MVP)
- ✅ Admin Module
- ✅ Employee Ticket Portal
- ✅ Basic Reporting
- ✅ Priority System
- ✅ File Uploads

### Phase 2 (Upcoming)
- [ ] Advanced Analytics & Charts
- [ ] Excel/PDF Report Generation
- [ ] SLA Timer & Tracking
- [ ] SMS OTP Integration (Twilio)
- [ ] Email Templates Customization
- [ ] Ticket Assignment Automation

### Phase 3 (Future)
- [ ] Live Chat Support
- [ ] Mobile App (React Native)
- [ ] API Webhooks
- [ ] Custom Fields for Tickets
- [ ] Knowledge Base
- [ ] Customer Satisfaction Surveys

## 🛠️ Development

### Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Email (SMTP) - Optional for demo
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=
```

### Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# The project is ready to deploy - just needs:
# 1. MongoDB connection
# 2. Email SMTP configuration
# 3. Optional: Twilio for SMS OTP
```

## 📝 Usage Guide

### Creating Tickets (Employee)

1. Visit `http://localhost:3000/`
2. Click "Create Ticket"
3. Fill form with issue details
4. Upload screenshots (optional)
5. Submit and receive Ticket ID

### Checking Status (Employee)

1. Visit employee portal
2. Click "Check Status"
3. Enter Employee ID or Ticket ID
4. View all tickets and their timeline

### Managing Tickets (Admin)

1. Login at `http://localhost:3000/admin/login.html`
2. View dashboard for analytics
3. Manage tickets, employees, and projects
4. Post announcements
5. Update system settings

## 📧 Support

For questions or support, please contact the development team.

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for enterprise ticket management**
