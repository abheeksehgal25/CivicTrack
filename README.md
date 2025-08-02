# CivicTrack

A civic issue reporting platform that allows citizens to report local issues (potholes, garbage, etc.) and track their resolution within a 3-5km neighborhood radius.

## Project Structure

```
civic/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route definitions
│   │   ├── context/       # React context providers
│   │   ├── api/           # API service functions
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend
- **React** with Vite for fast development
- **Tailwind CSS** for styling
- **React Router DOM** for routing
- **Leaflet.js** for map integration

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads

### Deployment
- **Vercel** (frontend)
- **Render** (backend)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd civic
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Environment Setup**
   - Copy `.env.example` to `.env` in the server directory
   - Update the environment variables with your configuration

5. **Start Development Servers**

   **Client (Frontend)**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on http://localhost:5173

   **Server (Backend)**
   ```bash
   cd server
   npm run dev
   ```
   Backend will run on http://localhost:5000

## Features

### User Features
- Report civic issues with photos and location
- View issues within 3-5km radius
- Anonymous reporting option
- Track issue resolution status

### Admin Features
- Moderate reported issues
- View analytics and statistics
- Manage user accounts
- Update issue status

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Issues
- `GET /api/issues` - Get issues in radius
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get specific issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue

### Admin
- `GET /api/admin/issues` - Get issues for moderation
- `PUT /api/admin/issues/:id` - Moderate issue
- `GET /api/admin/analytics` - Get analytics data

## Development Status

This project is currently in **Step 1: Project Initialization** phase.

### Completed
- ✅ Project structure setup
- ✅ Frontend and backend folder organization
- ✅ Dependencies installation
- ✅ Basic Express server setup
- ✅ Placeholder files and components

### Next Steps
- Step 2: Frontend UI Components
- Step 3: Backend API Development
- Step 4: Database Integration
- Step 5: Authentication System
- Step 6: Image Upload & Storage
- Step 7: Map Integration
- Step 8: Deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.
