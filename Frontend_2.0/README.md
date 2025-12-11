# Billboard Booking Platform - Frontend

Modern React-based frontend for the Online Billboard Booking Platform.

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context (Auth)
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Maps**: Leaflet (planned)

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:8080`

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (optional):
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` if your backend runs on a different port

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🌐 Available Routes

### Public Routes
- `/login` - Login page
- `/register/user` - User (Advertiser) registration
- `/register/owner` - Owner registration

### User Routes (Advertiser)
- `/user` - Browse available billboards
- `/user/map` - Map view of billboards (planned)
- `/user/bookings` - Booking history (planned)
- `/user/profile` - User profile (planned)

### Owner Routes
- `/owner` - Owner dashboard with billboard management
- `/owner/add` - Add new billboard (planned)
- `/owner/bookings` - View bookings (planned)
- `/owner/profile` - Owner profile (planned)

## 🎨 Features Implemented

### ✅ Core Features
- [x] Modern, responsive UI with Tailwind CSS
- [x] JWT-based authentication
- [x] Role-based routing (USER/OWNER)
- [x] Auto-login after registration
- [x] Protected routes
- [x] Toast notifications
- [x] Form validation
- [x] Billboard listing with search
- [x] Owner dashboard with stats

### 🚧 Planned Features
- [ ] Map view with Leaflet
- [ ] Booking flow with modal
- [ ] Booking history
- [ ] User/Owner profile management
- [ ] Add/Edit billboard forms
- [ ] Image upload
- [ ] Password reset flow
- [ ] Advanced filtering
- [ ] Pagination

## 📁 Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── layout/      # Header, Footer
│   └── ui/          # UI components (LoadingSpinner, EmptyState)
├── context/         # React Context (AuthContext)
├── pages/           # Page components
│   ├── auth/        # Login, Register pages
│   ├── user/        # User dashboard pages
│   └── owner/       # Owner dashboard pages
├── services/        # API service layer
│   ├── api.js       # Axios instance
│   ├── authService.js
│   ├── billboardService.js
│   ├── bookingService.js
│   └── ownerService.js
├── utils/           # Utility functions
│   ├── validators.js
│   └── formatters.js
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

## 🔧 API Integration

The frontend communicates with the Spring Boot backend via Axios. All API calls include JWT tokens automatically.

### API Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register/user` - User registration
- `POST /auth/register/owner` - Owner registration
- `GET /billboards` - Get all billboards
- `GET /owner/billboards` - Get owner's billboards
- `DELETE /owner/billboards/:id` - Delete billboard

## 🎯 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🧪 Development

- **Hot reload**: Vite provides instant HMR
- **Linting**: ESLint configured for React
- **Formatting**: Prettier (optional)

## 📝 Notes

- The application uses localStorage for JWT token storage
- Unauthorized requests (401/403) automatically redirect to login
- Image uploads use multipart/form-data
- Currency is formatted in INR (₹)

## 🤝 Contributing

This is an MVP implementation. Future enhancements include:
- Complete booking flow
- Map integration
- Advanced analytics
- Payment gateway
- Notifications system

## 📄 License

MIT License
