Task Management System Dashboard
Overview
This project is a full-stack Task Management System designed to help users create, update, view, filter, and delete tasks from a centralized dashboard. It includes features for secure authentication, real-time audit logging of every action, and easy navigation. Built with Java (Spring Boot), HTML, CSS, JavaScript, and a SQL database, it showcases seamless integration between frontend and backend to provide a responsive and user-friendly experience.

Features
CRUD operations: Create, Read, Update, Delete tasks

Filter/search tasks by title or description

Paginated task view for better data management

Edit/Delete actions for each task in the dashboard table

Audit Log section tracking all create, update, delete actions

Color-coded log entries for quick understanding

Frontend and backend validation and input sanitization

Static Basic Authentication (username: admin, password: password123)

Responsive UI design

Technology Stack
Backend: Java, Spring Boot, Spring Data JPA, Spring Security

Frontend: HTML, CSS, JavaScript

Database: SQL MySQL

Setup
Clone the repository.

Set up the SQL database and configure connection in application.properties.

Build the backend with Maven and run the Spring Boot application.

Open index.html in your browser for the frontend dashboard.

Use Basic Auth credentials to access all API endpoints.

How to Use
Navigate tasks via the sidebar, add or update via modals, and monitor all changes in the Audit Logs section.

Search and filter tasks easily; paginate views for data clarity.

All sensitive operations require Basic Authentication.

License
Open-source for educational and demonstration purposes.
