# Leap HRMS API Testing Suite

This comprehensive testing suite verifies all Leap HRMS APIs are working accurately before deployment.

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Tests
```bash
# Test all authentication APIs
npm run test:auth

# Test all user management APIs
npm run test:users

# Test all WhatsApp integration APIs
npm run test:whatsapp

# Run all tests
npm run test:all
```

## 📋 Test Categories

### 🔐 Authentication Tests (`auth.test.js`)
- User registration with email/password
- User login with email and employee ID
- Password reset functionality
- Token validation and refresh

### 👥 User Management Tests (`users.test.js`)
- Profile retrieval and updates
- Address and bank details management
- Employment details updates
- Device ID reset
- Attendance management (marking, tracking)
- Leave application and approval
- Support ticket creation and management
- Project and sub-project management
- Document upload and management
- Notification preferences

### 📱 WhatsApp Integration Tests (`whatsapp.test.js`)
- User verification via WhatsApp
- Attendance marking (start/pause/resume/stop)
- Task creation via WhatsApp
- Complete workflow testing
- Error handling for invalid inputs

## 📊 Test Results Interpretation

### ✅ Success Indicators
- `✅ SUCCESS` - API returned expected response
- `✅ RECEIVED` - Data was properly returned
- `✅ FOUND` - User/data was found
- `✅ PASSED` - Error handling worked correctly

### ❌ Failure Indicators
- `❌ FAILED` - API call failed
- `❌ EMPTY` - No data returned
- `❌ MISSING` - Required data missing
- `❌ UNEXPECTEDLY ACCEPTED` - Should have been rejected but wasn't

## 🔧 Configuration

### Environment Variables Required
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

### Test Data
The tests use predefined test data:
- Email: `test@example.com`
- Password: `TestPassword123!`
- Employee ID: `EMP001`
- Contact: `+1234567890`

## 🎯 Critical Test Cases

### Must Pass for Deployment
1. **Authentication Flow** - User can register, login, and reset password
2. **Profile Management** - User can view and update profile information
3. **Attendance System** - Attendance can be marked and tracked
4. **WhatsApp Integration** - All WhatsApp bot endpoints work correctly
5. **Error Handling** - Invalid data is properly rejected
6. **File Upload** - Documents can be uploaded successfully

## 🚨 Troubleshooting

### Common Issues
1. **Connection Refused** - Ensure the application is running on port 3000
2. **Authentication Errors** - Check Supabase credentials in .env
3. **Missing Dependencies** - Run `npm install` to install axios
4. **Permission Errors** - Ensure user has proper permissions in database

### Debug Mode
To enable detailed logging:
```bash
DEBUG=true npm run test:auth
```

## 📈 Coverage Areas

### Functional Coverage
- ✅ Authentication & Authorization
- ✅ User Profile Management
- ✅ Attendance Tracking
- ✅ Leave Management
- ✅ Task Management
- ✅ Support System
- ✅ Document Management
- ✅ WhatsApp Integration
- ✅ Notifications
- ✅ Error Handling

### Edge Cases Tested
- ✅ Invalid authentication
- ✅ Missing required fields
- ✅ Duplicate data handling
- ✅ Large file uploads
- ✅ Concurrent requests
- ✅ SQL injection prevention
- ✅ Rate limiting

## 🚀 Deployment Readiness

Run the complete test suite before deployment:

```bash
npm run test:all
```

### Green Light Indicators
- All authentication tests pass
- User management functions work
- WhatsApp integration responds correctly
- File uploads succeed
- Error handling rejects invalid requests
- Response times are under 2 seconds

### Red Light Indicators
- Any authentication test fails
- Database connection errors
- File upload failures
- WhatsApp endpoints not responding
- Missing dependencies or configuration issues

## 📞 Support

If tests fail:
1. Check the application is running: `npm run dev`
2. Verify environment variables in `.env`
3. Check Supabase connection and permissions
4. Review error messages in test output
5. Ensure all dependencies are installed: `npm install`

## 📝 Notes

- Tests are designed to be non-destructive
- Test data is isolated from production data
- All tests include proper cleanup
- Results are logged for easy debugging
- Tests can be run individually or as a complete suite
