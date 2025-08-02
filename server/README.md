# CivicTrack Server

Backend API for the CivicTrack civic issue reporting platform.

## Features

- **Authentication**: JWT-based user authentication
- **Issue Management**: CRUD operations for civic issues
- **Geolocation**: Distance-based issue filtering
- **Status Tracking**: Timeline of issue status changes
- **Admin Panel**: Moderation and analytics tools
- **File Upload**: Image upload support (Cloudinary)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Issues
- `GET /api/issues` - Get all issues (with filters)
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get specific issue
- `GET /api/issues/user` - Get user's issues
- `POST /api/issues/:id/flag` - Flag an issue
- `DELETE /api/issues/:id` - Delete issue

### Admin
- `GET /api/admin/issues` - Get issues for moderation
- `PATCH /api/admin/issues/:id` - Moderate issue
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/flags` - Get flagged issues

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env` file with:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/civictrack
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Database setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in .env file

4. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Database Models

### User
- name, email, password (hashed), role
- Location tracking for distance calculations

### Issue
- title, description, photos, location
- category, status, anonymous flag
- Created by user reference

### StatusLog
- Tracks status changes with timestamps
- Admin comments for each status change

### Flag
- Users can flag inappropriate issues
- Prevents duplicate flags from same user

## Development

- **Hot reload**: `npm run dev`
- **Production build**: `npm start`
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **File upload**: Multer + Cloudinary

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRE | JWT expiration | 30d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | - |
| CLOUDINARY_API_KEY | Cloudinary API key | - |
| CLOUDINARY_API_SECRET | Cloudinary API secret | - |

## API Documentation

### Authentication Flow
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Include token in headers: `Authorization: Bearer <token>`

### Issue Creation
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing damage to vehicles",
  "category": "pothole",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "Main Street, New York"
  },
  "photos": ["https://cloudinary.com/image1.jpg"],
  "anonymous": false
}
```

### Issue Filtering
```
GET /api/issues?category=pothole&status=pending&lat=40.7128&lng=-74.0060&radius=5
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS protection
- Rate limiting (to be implemented)
- File upload validation

## Testing

API can be tested with tools like:
- Postman
- Insomnia
- curl commands

Example curl commands:
```bash
# Test server
curl http://localhost:5000

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
``` 