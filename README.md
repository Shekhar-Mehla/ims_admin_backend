# Internship Management System (IMS) - Backend

This is the backend API for the Internship Management System (IMS) Admin Portal. It provides a robust, secure, and scalable foundation for managing users, internships, and applications.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt for password hashing
- **Validation**: Joi
- **File Uploads**: Cloudinary & Multer
- **Email Service**: Nodemailer
- **WebSockets**: Socket.io (for real-time notifications)
- **Monitoring**: Nodemon (development)

## 🛠 Features

- **RBAC (Role-Based Access Control)**: Secure endpoints for Admins and Staff.
- **User Management**: Administrative creation, updating, and deletion of user profiles.
- **Internship Management**: Full CRUD operations for internship listings, including slug generation and status tracking.
- **Application Management**: Tracking and updating application statuses with dynamic applicant counts for internships.
- **Auth System**: Support for login, logout, password reset via token, and staff invitations.
- **Automated Emails**: Sending credentials to invited staff and password reset links.

## 🚦 Getting Started

### Prerequisites

- Node.js installed
- MongoDB connection string
- Cloudinary credentials (for file uploads)
- SMTP server credentials (for emails)

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Configure environment variables (Create a `.env` file):
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   SMTP_HOST=your_host
   SMTP_PORT=your_port
   SMTP_USER=your_user
   SMTP_PASS=your_pass
   ROOT_URL=http://localhost:5173
   ```

3. Run in development mode:
   ```bash
   yarn dev
   ```

4. Run in production:
   ```bash
   yarn start
   ```

## 📂 Project Structure

- `src/controllers/`: Application logic for handling requests.
- `src/models/`: Mongoose schemas and data models.
- `src/routes/`: API endpoint definitions.
- `src/middlewares/`: Authentication and permission checks.
- `src/utility/`: Helper functions (JWT, password hashing, etc.).
- `src/services/`: External services (Email, Cloudinary).
