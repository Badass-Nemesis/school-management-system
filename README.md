### 1. Project Name 📚
**School Management System**

### 2. Overview 🌟
This School Management System is a comprehensive backend API designed to manage various school operations such as user registration and authentication, class management, exam and result management, attendance tracking, and report generation. It uses Node.js, Express, MongoDB, and TypeScript to ensure a robust and scalable system. This project is an assignment for the Neina (Previously Nexorand) backend development internship.

### 3. Features ✨
- User Registration & Authentication
- Class Management
- Exam & Result Management
- Attendance Tracking
- Report Generation
- JWT-based Authentication for Admin Access
- Profile Image Management using Cloudinary

### 4. Technologies 🛠️
- **Node.js**: A JavaScript runtime built on Chrome's V8 engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **MongoDB**: A NoSQL database for storing application data.
- **TypeScript**: A statically typed superset of JavaScript that compiles to plain JavaScript.

### 5. Getting Started 🚀
Follow these instructions to get the project up and running on your local machine.

#### Prerequisites 📋
- Node.js
- MongoDB

#### Installation 🛠️
1. Clone the repository:
   ```sh
   git clone https://github.com/Badass-Nemesis/school-management-system.git
   cd school-management-system
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

#### Environment Variables 🔑
Create a `.env` file in the root directory and add the following environment variables:
```sh
PORT = 3000
MONGO_URI = your-mongo-db-URI-here
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-cloudinary-key
CLOUDINARY_API_SECRET = your-cloudinary-secret
JWT_SECRET = your-private-key
```

#### Running the Project 💻
To run the project, use the following command:
```sh
npm run dev
```
### 6. API Documentation 📄

#### **Note:** All endpoints require an `Authorization` header containing the token for role-based authorization, except for the register and login endpoints. The login endpoint will provide a token in the JSON response.

#### Authentication 🔒

##### Register a new user
- **URL:** `/auth/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password",
    "name": "User Name",
    "role": "student/teacher/admin",
    "subject": "subject name (if role is teacher)",
    "classId": "class-id (if role is student)"
  }
  ```

##### Login a user
- **URL:** `/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```

#### Users 👥

##### Get all students
- **URL:** `/students`
- **Method:** `GET`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Number of students per page (default: 10)

##### Get student by ID
- **URL:** `/students/:id`
- **Method:** `GET`

##### Update student by ID
- **URL:** `/students/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "classId": "new-class-id",
    "profileImageUrl": "new-cloudinary-url"
  }
  ```

##### Delete student by ID
- **URL:** `/students/:id`
- **Method:** `DELETE`

#### Teachers 👨‍🏫

##### Get all teachers
- **URL:** `/teachers`
- **Method:** `GET`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Number of teachers per page (default: 10)

##### Get teacher by ID
- **URL:** `/teachers/:id`
- **Method:** `GET`

##### Update teacher by ID
- **URL:** `/teachers/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "subject": "Updated Subject",
    "profileImageUrl": "new-cloudinary-url"
  }
  ```

##### Delete teacher by ID
- **URL:** `/teachers/:id`
- **Method:** `DELETE`

#### Classes 🏫

##### Create a new class
- **URL:** `/classes`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "Class Name",
    "teacherId": "teacher-id"
  }
  ```

##### Get all classes
- **URL:** `/classes`
- **Method:** `GET`

##### Get class by ID
- **URL:** `/classes/:id`
- **Method:** `GET`

##### Update class by ID
- **URL:** `/classes/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "name": "Updated Class Name",
    "teacherId": "new-teacher-id"
  }
  ```

##### Delete class by ID
- **URL:** `/classes/:id`
- **Method:** `DELETE`

#### Exams ✏️

##### Add a new exam
- **URL:** `/exams/add`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "Exam Name",
    "classId": "class-id",
    "date": "YYYY-MM-DD"
  }
  ```

#### Reports 📊

##### Generate a report for a class in JSON format
- **URL:** `/reports/class/:classId`
- **Method:** `GET`

##### Generate a report for a class in Excel or PDF format
- **URL:** `/reports/class/:classId/file`
- **Method:** `GET`
- **Query Parameters:**
  - `format`: `excel` or `pdf`

#### Results 📝

##### Record a new result
- **URL:** `/results/record`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "studentId": "student-id",
    "examId": "exam-id",
    "marksObtained": 90,
    "grade": "A"
  }
  ```

### 7. Utilities 🔧

#### Custom Error Class
- **File:** `utils/errorUtils.ts`
- **Description:** Defines a custom error class for consistent error handling.

#### Error Handling Middleware
- **File:** `utils/errorUtils.ts`
- **Description:** Handles errors globally in the application.

#### Catch Async Errors
- **File:** `utils/errorUtils.ts`
- **Description:** Wraps async functions to catch errors and pass them to the error handling middleware.

#### Password Utilities
- **File:** `utils/passwordUtils.ts`
- **Description:** Hashes and verifies passwords using bcrypt.

#### JWT Utilities
- **File:** `utils/jwtUtils.ts`
- **Description:** Generates and verifies JWT tokens.

#### Validation Utilities
- **File:** `utils/validationUtils.ts`
- **Description:** Validates email format, password strength, and other fields.

### 8. Postman Collection 📨
A Postman collection is provided to facilitate testing and interaction with the API. You can find the collection file named `Student Management.postman_collection.json` in the repository.

### 9. Additional Features 🌟
- **Attendance Tracking:** Track student attendance for each class.
- **Exam and Results Management:** Manage exams and record student results.
- **Report Generation:** Generate detailed reports for classes, including lists of students and assigned teachers.
