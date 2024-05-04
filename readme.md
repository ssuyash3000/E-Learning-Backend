# E-Learning Backend

## Features

### 1. User APIs

#### User Registration

Allow users to register by providing necessary details such as name, email, and password. Implement validation for email uniqueness and password strength.

#### User Profile

Enable users to view and update their profile information, including name, email, and password.

### 2. Course APIs

#### Get Courses

Provide an API endpoint to fetch courses available on the platform. Implement filtering options based on parameters such as category, level, popularity, etc. Enable pagination to handle large datasets efficiently.

#### CRUD Operations for Superadmin

Implement Create, Read, Update, and Delete operations for courses. Only superadmin users should have permission to perform these operations.

### 3. User Enrollment APIs

#### Course Enrollment

Allow users to enroll in courses they are interested in. Implement validation to ensure users can't enroll in the same course multiple times.

#### View Enrolled Courses

Provide an API endpoint for users to view the courses they have enrolled in.

### 4. Filters and Pagination

Implement filtering options for the courses API to enable users to refine their search based on criteria such as category, level, etc. Enable pagination to limit the number of results returned per request and improve performance when dealing with large datasets.

### 5. Database and Email Integration

Utilize the free tier of neon.tech database for storing user information, course details, and enrollment data.

Integrate with resend.com's free tier for handling email communications, such as user registration confirmation, password reset requests, and course enrollment notifications.

### 6. Security and Authentication

Implement secure authentication mechanisms, such as JWT (JSON Web Tokens), to authenticate users for accessing protected endpoints.

Ensure sensitive data, such as passwords, is securely hashed before storage in the database.

### 7. Error Handling and Logging

Implement robust error handling mechanisms to provide meaningful error messages to clients.

Utilize logging to track API requests, responses, and any potential errors or exceptions for debugging purposes.

---

## Expected Environment Variables

### Neon.tech Postgres

- **PGHOST:** [Insert value for PGHOST here] example - ......55zj.ap-southeast-1.aws.neon.tech
- **PGDATABASE:** eLearning
- **PGUSER:** eLearning_owner
- **PGPASSWORD:** [Insert value for PGPASSWORD here] example - ep-rapid-base-a
- **ENDPOINT_ID:** ep-rapid-base-[Insert additional details for ENDPOINT_ID here]

### JWT Token Authentication

- **JWT_SECRET:** [Insert value for JWT_SECRET here]

### Sending Email - Resend Mail Service API

- **RE_SEND_API_KEY:** re-[Insert value for RE_SEND_API_KEY here]


---

