# Billboard Booking System

A full-stack web application for online billboard booking with Java Spring Boot backend and React.js frontend.

## Features

### Frontend (React + Tailwind CSS)
- **Landing Page**: Brief intro with call-to-action
- **Interactive Map**: View billboard locations using Leaflet.js
- **Booking Form**: Date selection, user details, and image upload
- **Dashboard**: Admin view for managing bookings
- **Responsive Design**: Modern UI with Tailwind CSS

### Backend (Spring Boot + MySQL)
- **REST APIs**: Complete CRUD operations for billboards and bookings
- **File Upload**: Image upload with local file storage
- **Database**: MySQL with JPA/Hibernate
- **CORS Support**: Configured for frontend integration
- **Validation**: Input validation and error handling

## Tech Stack

- **Backend**: Java 8, Spring Boot 2.7.18, MySQL, Maven
- **Frontend**: React 18, Tailwind CSS, Leaflet.js, Axios
- **Database**: MySQL
- **Build Tools**: Maven (backend), npm (frontend)

## Prerequisites

- Java 8 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Maven 3.6+

## Setup Instructions

### 1. Database Setup

Create a MySQL database:
```sql
CREATE DATABASE billboard_booking;
```

Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/billboard_booking?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Backend Setup

1. Navigate to the project root directory
2. Install dependencies and run the application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start at `http://localhost:3000`

## API Endpoints

### Billboard APIs
- `GET /api/billboards` - Get all billboards
- `GET /api/billboards/available` - Get available billboards
- `GET /api/billboards/{id}` - Get billboard by ID
- `POST /api/billboards` - Create new billboard
- `PUT /api/billboards/{id}` - Update billboard
- `PUT /api/billboards/{id}/availability` - Update availability
- `DELETE /api/billboards/{id}` - Delete billboard

### Booking APIs
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `POST /api/bookings` - Create new booking (with file upload)
- `GET /api/bookings/availability` - Check availability
- `PUT /api/bookings/{id}/status` - Update booking status
- `DELETE /api/bookings/{id}` - Delete booking

### File APIs
- `GET /api/files/{fileName}` - Serve uploaded files

## Database Schema

### Billboard Table
- `id` (Primary Key)
- `name` (Billboard name)
- `address` (Location address)
- `latitude` (GPS coordinate)
- `longitude` (GPS coordinate)
- `size` (Billboard dimensions)
- `is_available` (Availability status)
- `price` (Daily rate)
- `description` (Optional description)
- `image_url` (Optional image)

### Booking Table
- `id` (Primary Key)
- `billboard_id` (Foreign Key)
- `user_name` (Customer name)
- `email` (Customer email)
- `contact_number` (Customer phone)
- `start_date` (Booking start date)
- `end_date` (Booking end date)
- `image_path` (Uploaded creative file)
- `image_url` (File access URL)
- `total_price` (Calculated total cost)
- `status` (PENDING/CONFIRMED/CANCELLED/COMPLETED)
- `created_at` (Booking creation date)

## Sample Data

The application includes sample billboard data that gets loaded automatically on startup:
- Times Square Billboard (New York)
- Downtown LA Billboard (Los Angeles)
- Chicago Loop Billboard (Chicago)
- Miami Beach Billboard (Miami)
- Las Vegas Strip Billboard (Las Vegas)
- San Francisco Bay Area Billboard (San Francisco)

## Usage

1. **Browse Billboards**: Visit the map page to view available billboard locations
2. **View Details**: Click on map markers to see billboard details and pricing
3. **Book Billboard**: Click "Book Now" to fill out the booking form
4. **Upload Creative**: Optionally upload your advertisement image
5. **Manage Bookings**: Use the dashboard to view and manage all bookings
6. **Update Status**: Admin can confirm, cancel, or complete bookings

## File Storage

Uploaded images are stored in the `./uploads` directory. The application creates this directory automatically if it doesn't exist.

## Development

- Backend runs on port 8080
- Frontend runs on port 3000 with proxy to backend
- Hot reload enabled for both frontend and backend development
- CORS configured for cross-origin requests

## Production Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Package the backend:
```bash
mvn clean package
```

3. Run the JAR file:
```bash
java -jar target/billboard-booking-0.0.1-SNAPSHOT.jar
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.