# Online Billboard Booking System

A comprehensive web application for managing and booking billboards. Users can register, browse available billboards, and make bookings, while owners can manage their billboards and view bookings.

## Features

- **User Registration and Authentication**: Secure login and registration for users and billboard owners.
- **Billboard Management**: Owners can register and manage their billboards with location, size, and pricing details.
- **Booking System**: Users can search, view, and book available billboards.
- **Map Integration**: Interactive map to visualize billboard locations.
- **File Upload**: Support for uploading images related to billboards.
- **Email Notifications**: Automated emails for bookings and confirmations.
- **Admin Dashboard**: Separate dashboards for users and owners with relevant functionalities.

## Tech Stack

- **Backend**: Spring Boot (Java)
- **Frontend**: React.js with Vite
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Mapping**: Integrated map component for location selection
- **Styling**: Tailwind CSS for modern UI

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven (for backend)
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Online_Bill_Board_Booking
   ```

2. **Backend Setup**:
   - Navigate to the `demo` directory:
     ```bash
     cd demo
     ```
   - Copy `src/main/resources/application.properties.example` to `application.properties`:
     ```bash
     cp src/main/resources/application.properties.example src/main/resources/application.properties
     ```
   - Edit `application.properties` and update the database credentials and email settings with your own values.
   - Install dependencies and run:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

3. **Frontend Setup**:
   - Navigate to the `Frontend` directory:
     ```bash
     cd ../Frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Database Setup**:
   - Ensure MySQL is running.
   - Create a database named `adnow` (or as specified in `application.properties`).
   - The application will automatically create tables using JPA.

## Usage

- Access the frontend at `http://localhost:5173` (default Vite port).
- Backend API runs on `http://localhost:8080`.
- Register as a user or owner, then explore the features.

## API Endpoints

Some key API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/billboards` - List all billboards
- `POST /api/bookings` - Create a booking
- `GET /api/owners/{id}/billboards` - Get owner's billboards

For a full list, refer to the Postman collection in the repository.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -am 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.
