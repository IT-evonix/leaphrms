const axios = require('axios');

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function debugLogin() {
  console.log('🔍 Debugging Login API...\n');
  
  try {
    // Test 1: Simple login request
    console.log('1. Testing simple login...');
    const loginData = {
      semail: 'test@example.com',
      spassword: 'TestPassword123!',
      loginType: 'email'
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status Code:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('Full Response:', response);
    
    // Test 2: Check if user exists first
    console.log('\n2. Testing if test user exists...');
    const testUserResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      semail: 'test@example.com',
      spassword: 'TestPassword123!',
      loginType: 'email'
    });
    
    console.log('Test User Status:', testUserResponse.status);
    console.log('Test User Data:', JSON.stringify(testUserResponse.data, null, 2));
    
  } catch (error) {
    console.log('Debug Error:', error.message);
    console.log('Debug Response:', error.response?.data);
  }
}

// Run debug tests
if (require.main === module) {
  debugLogin();
}
