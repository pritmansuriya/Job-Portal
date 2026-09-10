# 💼 Job Portal - MERN Stack

A full-stack **Job Portal web application** built using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**.

The platform allows **job seekers** to create accounts, search and apply for jobs, while **recruiters/admins** can create job postings, manage applications, and manage candidates.

---

## 🚀 Features

### 👤 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Secure password hashing using bcrypt
* Protected routes
* Role-based access control
* Logout functionality
* Separate access for job seekers and recruiters/admins

### 🔎 Job Seeker Features

* Create and manage user profile
* Browse available jobs
* Search jobs by title, company, or location
* Filter jobs by category and job type
* View complete job details
* Apply for jobs
* Track applied jobs
* Manage profile information
* Upload/manage resume *(if implemented)*

### 🏢 Recruiter / Admin Features

* Recruiter/admin authentication
* Create new job postings
* Update existing job postings
* Delete job postings
* View posted jobs
* Manage job applications
* View candidate information
* Update application status
* Manage users and job listings

### 📋 Job Management

* Job title
* Company name
* Job description
* Location
* Salary
* Job type
* Experience level
* Skills/requirements
* Application deadline
* Job category

### 📱 Responsive Design

* Fully responsive user interface
* Desktop and mobile-friendly design
* Clean and modern dashboard
* Responsive navigation and job cards

---

## 🛠️ Technologies Used

### Frontend

* **React.js**
* **JavaScript**
* **React Router DOM**
* **Tailwind CSS**
* **Axios**
* **Context API / Redux** *(if implemented)*

### Backend

* **Node.js**
* **Express.js**
* **REST API**
* **JWT Authentication**
* **bcrypt / bcryptjs**
* **Mongoose**

### Database

* **MongoDB**
* **MongoDB Atlas**

### Development Tools

* **Git**
* **GitHub**
* **Postman**
* **VS Code**
* **npm**

---

## 📂 Project Structure

```text
Job-Portal/
│
├── client/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🔐 Authentication Flow

The application uses **JWT (JSON Web Token)** for authentication.

### Registration

```text
User
  ↓
Registration Form
  ↓
Express API
  ↓
Password Hashing
  ↓
MongoDB
  ↓
User Created
```

### Login

```text
User
  ↓
Login Form
  ↓
Express API
  ↓
Verify Email & Password
  ↓
Generate JWT Token
  ↓
Return Token
  ↓
Access Protected Routes
```

---

## 🔄 Application Flow

### Job Seeker

```text
Register / Login
       ↓
   User Dashboard
       ↓
   Browse Jobs
       ↓
 Search / Filter Jobs
       ↓
  View Job Details
       ↓
   Apply for Job
       ↓
Track Application
```

### Recruiter

```text
Register / Login
       ↓
Recruiter Dashboard
       ↓
Create Job
       ↓
Publish Job
       ↓
Receive Applications
       ↓
View Candidates
       ↓
Update Application Status
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Job-Portal.git
```

Move into the project:

```bash
cd Job-Portal
```

---

## 📦 Install Frontend Dependencies

Open the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

---

## 📦 Install Backend Dependencies

Open another terminal and navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

### Example

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/job_portal
JWT_SECRET=my_super_secret_key
```

> Never upload your `.env` file to GitHub.

Add it to `.gitignore`:

```gitignore
.env
node_modules
```

---

## ▶️ Run the Application

### Start Backend

Inside the `server` folder:

```bash
npm run dev
```

or:

```bash
npm start
```

Backend will run on:

```text
http://localhost:5000
```

### Start Frontend

Inside the `client` folder:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |
| GET    | `/api/auth/profile`  | Get user profile    |

### Jobs

| Method | Endpoint        | Description   |
| ------ | --------------- | ------------- |
| GET    | `/api/jobs`     | Get all jobs  |
| GET    | `/api/jobs/:id` | Get job by ID |
| POST   | `/api/jobs`     | Create a job  |
| PUT    | `/api/jobs/:id` | Update a job  |
| DELETE | `/api/jobs/:id` | Delete a job  |

### Applications

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/api/applications`     | Apply for a job           |
| GET    | `/api/applications`     | Get applications          |
| GET    | `/api/applications/:id` | Get application details   |
| PUT    | `/api/applications/:id` | Update application status |
| DELETE | `/api/applications/:id` | Delete application        |

> Update the endpoint names above if your actual backend routes are different.

---

## 🧪 API Testing

The backend REST APIs can be tested using **Postman**.

Example:

```text
POST http://localhost:5000/api/auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Login:

```text
POST http://localhost:5000/api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

## 🗄️ Database

This project uses **MongoDB** as the database.

Main collections can include:

```text
Users
Jobs
Applications
```

### User

```text
User
 ├── name
 ├── email
 ├── password
 ├── role
 └── createdAt
```

### Job

```text
Job
 ├── title
 ├── company
 ├── location
 ├── salary
 ├── description
 ├── skills
 ├── jobType
 └── createdAt
```

### Application

```text
Application
 ├── user
 ├── job
 ├── resume
 ├── status
 └── appliedAt
```

---

## 🔒 Security

The application implements common security practices such as:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Role-based authorization
* Environment variables for sensitive information
* Validation of user input
* Secure database connection

---

## 🌿 Git Branching Strategy

The project uses Git branches for feature development.

Example:

```text
main
 │
 ├── feature/authentication
 │
 ├── feature/dashboard
 │
 ├── feature/jobs
 │
 └── feature/applications
```

Create a new feature branch:

```bash
git checkout -b feature/dashboard
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Update dashboard"
```

Push the branch:

```bash
git push origin feature/dashboard
```

After testing, the feature branch can be merged into `main`.

---

## 📸 Screenshots

Add screenshots of your application here.

Example:

```text
screenshots/
├── home.png
├── login.png
├── register.png
├── jobs.png
├── job-details.png
└── dashboard.png
```

You can add them to this README using:

```markdown
![Home Page](screenshots/home.png)
```

---

## 🚀 Future Improvements

Some features that can be added in the future:

* Resume upload
* Email notifications
* Job bookmarking
* Advanced job search
* Saved jobs
* Recruiter profiles
* Company profiles
* Real-time notifications
* Admin analytics dashboard
* Pagination
* Forgot password
* Email verification
* Application tracking
* Job recommendations
* Online interview scheduling

---

## 🎯 Project Goals

The main goals of this project are:

* Build a real-world MERN Stack application
* Practice React frontend development
* Build RESTful APIs using Express.js
* Work with MongoDB and Mongoose
* Implement JWT authentication
* Implement role-based authorization
* Practice CRUD operations
* Connect frontend and backend
* Learn Git and GitHub workflow
* Build a project suitable for a developer portfolio

---

## 👨‍💻 Author

**Prit Mansuriya**

### Skills Demonstrated

* React.js
* JavaScript
* Node.js
* Express.js
* MongoDB
* Mongoose
* REST API
* JWT Authentication
* Tailwind CSS
* Git & GitHub

---

## 📄 License

This project is created for **learning and portfolio purposes**.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
