# 🎯 Online Billboard Booking System

A modern, full-stack web application for managing and booking billboards. The platform enables users to browse and book billboards while allowing owners to manage their billboard inventory and track bookings.

![Tech Stack](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### For Users (Advertisers)
- 🔍 **Browse Billboards**: View available billboards with detailed information
- 🗺️ **Interactive Map View**: Visualize billboard locations on an interactive map with color-coded availability
- 📅 **Easy Booking**: Book billboards with a modern, intuitive booking form
- 📊 **Booking History**: Track all your bookings and their status
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations

### For Owners
- ➕ **Billboard Management**: Add, edit, and delete billboard listings
- 📸 **Image Upload**: Upload billboard images with built-in cropping tool
- 📈 **Dashboard Analytics**: View statistics and booking insights
- 📋 **Booking Management**: Track all bookings for your billboards
- 💼 **Profile Management**: Manage your business profile and settings

### Technical Features
- 🔐 **Secure Authentication**: JWT-based authentication system
- 🎭 **Role-Based Access**: Separate dashboards for users and owners
- 📧 **Email Notifications**: Automated booking confirmations
- 🌍 **Location Services**: Integrated mapping with Leaflet
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.x (Java 17)
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Email**: JavaMailSender

### Frontend (Frontend_2.0)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Maps**: Leaflet with React-Leaflet
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Image Handling**: React Easy Crop

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 17 or higher
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **MySQL**: Version 8.0 or higher
- **Maven**: Version 3.6 or higher
- **Git**: For version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhav2703/Online_Bill_Board_Booking.git
cd Online_Bill_Board_Booking
```

### 2. Database Setup

1. **Start MySQL Server**:
   ```bash
   # On Windows (if MySQL is installed as a service)
   net start MySQL80
   
   # On Linux/Mac
   sudo systemctl start mysql
   ```

2. **Create Database**:
   ```sql
   mysql -u root -p
   CREATE DATABASE adnow;
   EXIT;
   ```

3. **Verify Database**:
   ```sql
   mysql -u root -p
   SHOW DATABASES;
   USE adnow;
   ```

### 3. Backend Setup

1. **Navigate to Backend Directory**:
   ```bash
   cd demo
   ```

2. **Configure Application Properties**:
   
   Create `src/main/resources/application.properties` with the following content:
   
   ```properties
   # Server Configuration
   server.port=8080
   
   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/adnow
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   # JPA/Hibernate Configuration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
   spring.jpa.properties.hibernate.format_sql=true
   
   # JWT Configuration
   jwt.secret=YOUR_SECRET_KEY_HERE_MAKE_IT_LONG_AND_SECURE
   jwt.expiration=86400000
   
   # File Upload Configuration
   spring.servlet.multipart.max-file-size=10MB
   spring.servlet.multipart.max-request-size=10MB
   file.upload-dir=./uploads
   
   # Email Configuration (Gmail example)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-specific-password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   
   # Logging
   logging.level.com.billboardbooking=DEBUG
   ```

   > **Important**: Replace `YOUR_MYSQL_PASSWORD`, `YOUR_SECRET_KEY_HERE`, and email credentials with your actual values.

3. **Create Uploads Directory**:
   ```bash
   mkdir uploads
   ```

4. **Install Dependencies & Run**:
   ```bash
   # Clean and install dependencies
   mvn clean install
   
   # Run the application
   mvn spring-boot:run
   ```

5. **Verify Backend is Running**:
   - Open browser and navigate to `http://localhost:8080`
   - You should see the application running
   - Check console for "Started DemoApplication" message

### 4. Frontend Setup (Frontend_2.0)

1. **Navigate to Frontend Directory**:
   ```bash
   cd ../Frontend_2.0
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional):
   
   Create a `.env` file in the `Frontend_2.0` directory:
   
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173`
   - You should see the billboard booking platform homepage

## 📁 Project Structure

```
Online_Bill_Board_Booking/
├── demo/                           # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/billboardbooking/demo/
│   │   │   │       ├── controller/      # REST Controllers
│   │   │   │       ├── model/           # Entity Models
│   │   │   │       ├── repository/      # JPA Repositories
│   │   │   │       ├── service/         # Business Logic
│   │   │   │       ├── security/        # JWT & Security Config
│   │   │   │       └── dto/             # Data Transfer Objects
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── uploads/                    # Uploaded billboard images
│   └── pom.xml
│
├── Frontend_2.0/                   # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Images and static files
│   │   │   └── images/
│   │   ├── components/             # Reusable components
│   │   │   ├── layout/             # Header, Footer
│   │   │   ├── ui/                 # UI components
│   │   │   └── user/               # User-specific components
│   │   ├── context/                # React Context (Auth)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                  # Page components
│   │   │   ├── auth/               # Login, Register
│   │   │   ├── user/               # User dashboard pages
│   │   │   └── owner/              # Owner dashboard pages
│   │   ├── services/               # API service layer
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── billboardService.js
│   │   │   ├── bookingService.js
│   │   │   └── ownerService.js
│   │   ├── utils/                  # Utility functions
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── imageUtils.js
│   │   ├── App.jsx                 # Main app component
│   │   ├── App.css
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── .env                        # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register/user` - Register new user (advertiser)
- `POST /auth/register/owner` - Register new owner
- `POST /auth/login` - User/Owner login

### Billboards
- `GET /billboards` - Get all billboards
- `GET /billboards/{id}` - Get billboard by ID
- `GET /billboards/available` - Get available billboards
- `POST /owner/billboards` - Create new billboard (Owner only)
- `PUT /owner/billboards/{id}` - Update billboard (Owner only)
- `DELETE /owner/billboards/{id}` - Delete billboard (Owner only)
- `GET /owner/billboards` - Get owner's billboards

### Bookings
- `POST /bookings` - Create new booking
- `GET /bookings/user` - Get user's bookings
- `GET /bookings/owner` - Get owner's bookings
- `PUT /bookings/{id}/status` - Update booking status

### File Upload
- `POST /upload` - Upload billboard image

## 🎮 Usage Guide

### For Users (Advertisers)

1. **Register an Account**:
   - Click "Register" → "As User"
   - Fill in your details
   - You'll be automatically logged in

2. **Browse Billboards**:
   - View all available billboards on the dashboard
   - Use the search bar to find specific locations
   - Switch to map view to see billboard locations

3. **Book a Billboard**:
   - Click on a billboard card to view details
   - Click "Book Now" on available billboards
   - Fill in booking details (dates, company info)
   - Submit your booking

4. **Manage Bookings**:
   - Navigate to "My Bookings"
   - View all your active and past bookings
   - Check booking status

### For Owners

1. **Register as Owner**:
   - Click "Register" → "As Owner"
   - Provide business details
   - Login to your dashboard

2. **Add Billboard**:
   - Click "Add Billboard"
   - Fill in billboard details (location, size, price)
   - Upload billboard image
   - Crop image if needed
   - Submit to create listing

3. **Manage Billboards**:
   - View all your billboards on the dashboard
   - Edit billboard details
   - Delete billboards
   - View booking statistics

4. **Track Bookings**:
   - Navigate to "Bookings"
   - See all bookings for your billboards
   - View customer details

## 🎨 Frontend Features (Frontend_2.0)

### Modern UI Components
- **Hero Section**: Eye-catching landing page with animated gradients
- **Billboard Cards**: Beautiful card layouts with hover effects
- **Interactive Map**: Leaflet-based map with custom markers
- **Booking Modal**: Smooth popup with form validation
- **Dashboard Stats**: Visual analytics for owners
- **Responsive Design**: Mobile-first approach

### Key Technologies
- **Tailwind CSS**: Utility-first styling with custom theme
- **React Router**: Client-side routing with protected routes
- **Axios Interceptors**: Automatic JWT token handling
- **Context API**: Global authentication state
- **React Hot Toast**: Beautiful notifications
- **Leaflet**: Interactive maps with custom markers

## 🔧 Development

### Backend Development

```bash
cd demo

# Run with hot reload
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Frontend Development

```bash
cd Frontend_2.0

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Database connection error
```
Solution: 
1. Verify MySQL is running
2. Check database credentials in application.properties
3. Ensure database 'adnow' exists
```

**Problem**: Port 8080 already in use
```
Solution:
1. Change server.port in application.properties
2. Or stop the process using port 8080
```

**Problem**: File upload fails
```
Solution:
1. Ensure 'uploads' directory exists in demo/
2. Check file size limits in application.properties
```

### Frontend Issues

**Problem**: API calls failing (CORS errors)
```
Solution:
1. Ensure backend is running on port 8080
2. Check VITE_API_BASE_URL in .env
3. Verify CORS configuration in backend
```

**Problem**: Map not displaying
```
Solution:
1. Check browser console for errors
2. Ensure billboards have valid lat/lng coordinates
3. Verify Leaflet CSS is loaded
```

**Problem**: Images not loading
```
Solution:
1. Check if images exist in demo/uploads/
2. Verify image paths in database
3. Ensure backend serves static files correctly
```

## 🚀 Deployment

### Backend Deployment

1. **Build JAR**:
   ```bash
   cd demo
   mvn clean package
   ```

2. **Run JAR**:
   ```bash
   java -jar target/demo-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment

1. **Build Production Bundle**:
   ```bash
   cd Frontend_2.0
   npm run build
   ```

2. **Deploy** the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

## 📝 Environment Variables

### Backend (application.properties)
- `server.port` - Server port (default: 8080)
- `spring.datasource.url` - Database URL
- `spring.datasource.username` - Database username
- `spring.datasource.password` - Database password
- `jwt.secret` - JWT secret key
- `jwt.expiration` - Token expiration time
- `spring.mail.*` - Email configuration

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8080)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Vaibhav Narwade** - [GitHub](https://github.com/vaibhav2703)

## 🙏 Acknowledgments

- Spring Boot for the robust backend framework
- React team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- Leaflet for the interactive maps

## 📧 Contact

For questions or support, please open an issue on GitHub or contact the development team.

---

**Happy Billboard Booking! 🎯**
