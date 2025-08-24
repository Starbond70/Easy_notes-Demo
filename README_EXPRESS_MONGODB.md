# 🚀 Easy Notes - Express.js + MongoDB Backend

Your Easy Notes application has been successfully migrated from Firebase to a custom Express.js backend with MongoDB database!

## 🏗️ **New Architecture Overview**

### **Backend (Express.js + MongoDB)**
- **Server**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **File Storage**: Local file system with Multer
- **Security**: Helmet, CORS, Rate limiting, Input validation

### **Frontend (React.js)**
- **Framework**: React 19 with Vite
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom service layer
- **Authentication**: JWT token storage in localStorage

## 📁 **Project Structure**

```
Easy_notes-Demo/
├── src/                          # Frontend React code
│   ├── components/               # React components
│   ├── contexts/                 # React contexts (Auth, Notes)
│   ├── services/                 # API service layer
│   └── ...
├── server/                       # Backend Express.js code
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API endpoints
│   ├── middleware/               # Custom middleware
│   ├── uploads/                  # File storage directory
│   └── server.js                 # Main server file
└── package.json                  # Frontend dependencies
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### **1. Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in server/.env
```

### **2. Start Backend Server**
```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:5000`

### **3. Start Frontend**
```bash
# In a new terminal
cd ../
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 **Backend API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### **Notes**
- `GET /api/notes` - Get all notes (with filtering)
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes/upload` - Upload new note
- `POST /api/notes/:id/download` - Download note
- `POST /api/notes/:id/rate` - Rate a note
- `POST /api/notes/:id/comment` - Add comment
- `DELETE /api/notes/:id` - Delete note

### **Users**
- `GET /api/users/profile` - Get user profile with stats
- `GET /api/users/notes` - Get user's notes
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get public user profile
- `GET /api/users/search` - Search users

## 🗄️ **Database Models**

### **User Model**
- Basic info: displayName, email, password
- Role-based access: student, teacher, admin
- Statistics: uploadCount, downloadCount
- Timestamps: joinDate, lastLogin

### **Note Model**
- Content: title, description, tags
- Academic info: degree, semester, subject, unit
- File details: fileName, fileSize, fileType, fileUrl
- Engagement: downloads, rating, viewCount, comments
- Status: pending, approved, rejected

## 🔐 **Security Features**

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: express-validator middleware
- **Rate Limiting**: Prevent abuse
- **CORS Protection**: Configured for frontend
- **Helmet Security**: HTTP headers protection

## 📁 **File Upload System**

- **Supported Formats**: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG
- **File Size Limit**: 10MB per file
- **Storage**: Local file system (configurable for production)
- **Security**: File type validation, unique naming

## 🌐 **Environment Configuration**

### **Backend (.env)**
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/easy-notes
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### **Frontend (.env.local)**
```bash
VITE_API_URL=http://localhost:5000/api
```

## 🚀 **Deployment**

### **Backend Deployment**
1. **Environment Variables**: Set production values
2. **Database**: Use MongoDB Atlas or production MongoDB
3. **File Storage**: Use cloud storage (AWS S3, Google Cloud)
4. **Process Manager**: PM2 or similar
5. **Reverse Proxy**: Nginx or Apache

### **Frontend Deployment**
1. **Build**: `npm run build`
2. **Hosting**: Vercel, Netlify, or any static hosting
3. **Environment**: Update `VITE_API_URL` to production backend

## 🔄 **Migration Benefits**

### **From Firebase to Custom Backend**
- ✅ **Full Control**: Customize every aspect
- ✅ **Cost Effective**: No Firebase usage limits
- ✅ **Scalability**: Optimize for your specific needs
- ✅ **Data Ownership**: Complete control over your data
- ✅ **Custom Features**: Add any functionality you need

### **Performance Improvements**
- 🚀 **Faster Queries**: Optimized MongoDB indexes
- 🚀 **Better Caching**: Custom caching strategies
- 🚀 **Efficient File Handling**: Direct file system access
- 🚀 **Reduced Latency**: No external service dependencies

## 🧪 **Testing the API**

### **Health Check**
```bash
curl http://localhost:5000/api/health
```

### **Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Test User","email":"test@example.com","password":"password123"}'
```

### **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🐛 **Troubleshooting**

### **Common Issues**
1. **MongoDB Connection**: Ensure MongoDB is running
2. **Port Conflicts**: Check if port 5000 is available
3. **CORS Issues**: Verify frontend URL in backend config
4. **File Uploads**: Ensure uploads directory exists and is writable

### **Logs**
- Backend logs are displayed in the terminal
- Check MongoDB logs for database issues
- Frontend errors appear in browser console

## 📚 **Next Steps**

1. **Add More Features**: Comments, favorites, user profiles
2. **Implement Search**: Full-text search with MongoDB
3. **Add Admin Panel**: User management, content moderation
4. **Performance**: Add Redis caching, CDN for files
5. **Monitoring**: Add logging, metrics, health checks

---

**🎉 Congratulations!** Your Easy Notes app now has a robust, scalable backend that you control completely!
