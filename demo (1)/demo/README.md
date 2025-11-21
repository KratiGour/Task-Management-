# Task Manager Dashboard

A full-stack Task Manager application built with Java Spring Boot, HTML, CSS, JavaScript, and H2 Database.

## Features

- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Search & Filter**: Search tasks by title or description
- **Pagination**: 5 tasks per page
- **Audit Logs**: Track all task operations with timestamps
- **Basic Authentication**: Secured API endpoints
- **Responsive Design**: Works on desktop and tablet

## Tech Stack

- **Backend**: Java 21, Spring Boot 3.5.8, Spring Security, Spring Data JPA
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: H2 (In-memory)
- **Build Tool**: Maven

## Authentication

- **Username**: admin
- **Password**: password123

## API Endpoints

### Tasks
- `GET /api/tasks` - Get paginated tasks (supports search parameter)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update existing task
- `DELETE /api/tasks/{id}` - Delete task

### Audit Logs
- `GET /api/logs` - Get all audit logs

## Running the Application

1. **Prerequisites**: Java 21, Maven

2. **Clone and navigate to project**:
   ```bash
   cd demo
   ```

3. **Run the application**:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

4. **Access the application**:
   - Main App: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console
     - JDBC URL: `jdbc:h2:mem:taskdb`
     - Username: `sa`
     - Password: (leave empty)

## Project Structure

```
src/
├── main/
│   ├── java/com/example/demo/
│   │   ├── config/          # Security configuration
│   │   ├── controller/      # REST controllers
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   └── DemoApplication.java
│   └── resources/
│       ├── static/          # Frontend files
│       │   ├── css/
│       │   ├── js/
│       │   └── index.html
│       └── application.properties
```

## Security Features

- Basic Authentication for all API endpoints
- Input validation (frontend & backend)
- XSS prevention through input sanitization
- CSRF protection disabled for API endpoints
- Proper error handling without exposing stack traces

## Database Schema

### Tasks Table
- `id` (Long, Primary Key)
- `title` (String, max 100 chars)
- `description` (String, max 500 chars)
- `created_at` (LocalDateTime)

### Audit Logs Table
- `id` (Long, Primary Key)
- `timestamp` (LocalDateTime)
- `action` (String)
- `task_id` (Long)
- `updated_content` (Text)

## Demo Video

Create a 3-5 minute screen recording showing:
1. Application running locally
2. Task creation, update, and deletion
3. Search and pagination functionality
4. Audit logs with color-coded actions
5. Responsive design on different screen sizes

## Challenges Faced

During development, the main challenges were:
1. **Security Configuration**: Setting up Spring Security with Basic Auth while allowing static resources
2. **CORS Handling**: Ensuring frontend can communicate with backend API
3. **Input Validation**: Implementing both client-side and server-side validation
4. **Responsive Design**: Creating a layout that works well on both desktop and tablet
5. **Audit Logging**: Tracking only changed fields during updates and formatting JSON properly