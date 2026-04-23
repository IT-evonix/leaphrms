const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Test Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SUPABASE_URL = 'https://bbiamotvmxkondwnqgko.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NjksImV4cCI6MjAzNzQwMTY2OX0.s_k0uxO8wB5_N2AhMWtXSKE078bc8aN1dveixgFmmGE';
let authToken = '';

// Helper to check if user exists
async function checkUserExists(email) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase
    .from('leap_customer')
    .select('emp_id, email_id, name')
    .eq('email_id', email)
    .limit(1);
  
  return { data: data, error: error };
}

// Helper function to make authenticated requests
const authenticatedRequest = async (method, endpoint, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      ...(data && { 'Content-Type': 'application/json' }),
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    },
    ...(data && { data })
  };
  
  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
};

// Test Data
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  emp_id: 'EMP001'
};

// Authentication Tests
async function testAuthentication() {
  console.log('🔐 Testing Authentication APIs...\n');
  
  // Test 1: User Registration
  console.log('1. Testing User Registration...');
  const registerFormData = new FormData();
  registerFormData.append('name', 'Test User');
  registerFormData.append('email', testUser.email);
  registerFormData.append('password', testUser.password);
  registerFormData.append('emp_id', testUser.emp_id);
  registerFormData.append('contact_number', '+1234567890');
  
  const registerResult = await axios.post(`${BASE_URL}/api/auth/register`, registerFormData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  console.log('Registration Result:', registerResult.status === 200 ? '✅ SUCCESS' : '❌ FAILED');
  if (registerResult.status !== 200) {
    console.log('Error:', registerResult.data);
  }

  // Test 2: User Login with Email
  console.log('\n2. Testing User Login (Email)...');
  const loginEmailData = {
    semail: testUser.email,
    spassword: testUser.password,
    loginType: 'email'
  };
  
  const loginEmailResult = await authenticatedRequest('POST', '/api/auth/login', loginEmailData);
  console.log('Email Login Result:', loginEmailResult.status === 200 ? '✅ SUCCESS' : '❌ FAILED');
  if (loginEmailResult.status === 200) {
    authToken = loginEmailResult.data?.client_data?.auth_token || loginEmailResult.data?.auth_token;
    console.log('Auth Token Received:', authToken ? '✅' : '❌');
    console.log('Login Response Data:', JSON.stringify(loginEmailResult.data, null, 2));
  } else {
    console.log('Error Details:');
    console.log('- Status:', loginEmailResult.status);
    console.log('- Data:', JSON.stringify(loginEmailResult.data, null, 2));
    console.log('- Error:', loginEmailResult.data?.error || 'Unknown error');
  }

  // Test 3: User Login with Employee ID
  console.log('\n3. Testing User Login (Employee ID)...');
  const loginEmpData = {
    semail: testUser.emp_id,
    spassword: testUser.password,
    loginType: 'empID'
  };
  
  const loginEmpResult = await authenticatedRequest('POST', '/api/auth/login', loginEmpData);
  console.log('Employee ID Login Result:', loginEmpResult.status === 200 ? '✅ SUCCESS' : '❌ FAILED');
  if (loginEmpResult.status === 200 && !authToken) {
    authToken = loginEmpResult.data?.client_data?.auth_token || loginEmpResult.data?.auth_token;
  }

  // Test 4: Password Reset
  console.log('\n4. Testing Password Reset...');
  const resetFormData = new FormData();
  resetFormData.append('email', testUser.email);
  
  const resetResult = await axios.post(`${BASE_URL}/api/auth/update-password`, resetFormData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  console.log('Password Reset Result:', resetResult.status === 200 ? '✅ SUCCESS' : '❌ FAILED');
  if (resetResult.status !== 200) {
    console.log('Error:', resetResult.data?.error || 'Unknown error');
  }

  return authToken;
}

// User Profile Tests
async function testUserProfile(token) {
  console.log('\n👤 Testing User Profile APIs...\n');
  
  // Test 5: Get User Profile
  console.log('5. Testing Get User Profile...');
  const profileResult = await authenticatedRequest('POST', '/api/users/getUserProfile');
  console.log('Get Profile Result:', profileResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (profileResult.success) {
    console.log('User Data:', profileResult.data.data ? '✅ RECEIVED' : '❌ MISSING');
  }

  // Test 6: Update User Profile
  console.log('\n6. Testing Update User Profile...');
  const updateData = {
    name: 'Updated Test User',
    email: testUser.email
  };
  
  const updateResult = await authenticatedRequest('POST', '/api/users/updateEmployee', updateData);
  console.log('Update Profile Result:', updateResult.success ? '✅ SUCCESS' : '❌ FAILED');

  return profileResult.success;
}

// Client Management Tests
async function testClientManagement() {
  console.log('\n🏢 Testing Client Management APIs...\n');
  
  // Test 7: Get All Clients
  console.log('7. Testing Get All Clients...');
  const clientsResult = await authenticatedRequest('POST', '/api/client/getClients');
  console.log('Get Clients Result:', clientsResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (clientsResult.success) {
    console.log('Clients Count:', clientsResult.data.data?.length || 0);
  }

  // Test 8: Add New Client
  console.log('\n8. Testing Add New Client...');
  const newClientData = {
    company_name: 'Test Company',
    company_email: 'test@company.com',
    contact_number: '+1234567890',
    address: 'Test Address'
  };
  
  const addClientResult = await authenticatedRequest('POST', '/api/client/addClient', newClientData);
  console.log('Add Client Result:', addClientResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (addClientResult.success) {
    console.log('New Client ID:', addClientResult.data.data?.[0]?.id || '❌ MISSING');
  }

  return clientsResult.success;
}

// Task Management Tests
async function testTaskManagement() {
  console.log('\n📋 Testing Task Management APIs...\n');
  
  // Test 9: Get Task Types
  console.log('9. Testing Get Task Types...');
  const taskTypesResult = await authenticatedRequest('POST', '/api/users/getTaskTypes');
  console.log('Get Task Types Result:', taskTypesResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (taskTypesResult.success) {
    console.log('Task Types Count:', taskTypesResult.data.data?.length || 0);
  }

  // Test 10: Get Task Status
  console.log('\n10. Testing Get Task Status...');
  const taskStatusResult = await authenticatedRequest('POST', '/api/users/getTaskStatus');
  console.log('Get Task Status Result:', taskStatusResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 11: Add New Task
  console.log('\n11. Testing Add New Task...');
  const newTaskData = {
    task_details: 'Test Task Description',
    task_type_id: 1,
    sub_project_id: 1,
    total_hours: 2,
    total_minutes: 30,
    task_date: new Date().toISOString().split('T')[0]
  };
  
  const addTaskResult = await authenticatedRequest('POST', '/api/users/addTask', newTaskData);
  console.log('Add Task Result:', addTaskResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (addTaskResult.success) {
    console.log('New Task ID:', addTaskResult.data.data?.[0]?.id || '❌ MISSING');
  }

  return taskTypesResult.success;
}

// WhatsApp Integration Tests
async function testWhatsAppIntegration() {
  console.log('\n📱 Testing WhatsApp Integration APIs...\n');
  
  // Test 12: WhatsApp User Verification
  console.log('12. Testing WhatsApp User Verification...');
  const verifyData = {
    contact_number: '+1234567890'
  };
  
  const verifyResult = await authenticatedRequest('POST', '/api/chatBot/userVerificationCheck', verifyData);
  console.log('WhatsApp Verification Result:', verifyResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 13: WhatsApp Add Task
  console.log('\n13. Testing WhatsApp Add Task...');
  const whatsappTaskData = {
    whatsapp_number: '+1234567890',
    task_details: 'WhatsApp Test Task',
    task_type_id: 1,
    sub_project_id: 1,
    total_hours: 1,
    total_minutes: 30
  };
  
  const whatsappTaskResult = await authenticatedRequest('POST', '/api/chatBot/addTask', whatsappTaskData);
  console.log('WhatsApp Add Task Result:', whatsappTaskResult.success ? '✅ SUCCESS' : '❌ FAILED');

  return verifyResult.success;
}

// File Upload Tests
async function testFileUpload() {
  console.log('\n📁 Testing File Upload APIs...\n');
  
  // Test 14: Simple File Upload
  console.log('14. Testing File Upload...');
  
  // Create a test file
  const testContent = 'This is a test file content';
  const blob = new Blob([testContent], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, 'test.txt');
  
  try {
    const uploadResult = await axios.post(`${BASE_URL}/api/UploadFiles`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      }
    });
    console.log('File Upload Result:', uploadResult.status === 200 ? '✅ SUCCESS' : '❌ FAILED');
    return uploadResult.status === 200;
  } catch (error) {
    console.log('File Upload Error:', error.message);
    return false;
  }
}

// Error Handling Tests
async function testErrorHandling() {
  console.log('\n🚨 Testing Error Handling...\n');
  
  // Test 15: Invalid Login
  console.log('15. Testing Invalid Login...');
  const invalidLoginData = {
    semail: 'invalid@email.com',
    spassword: 'wrongpassword',
    loginType: 'email'
  };
  
  const invalidLoginResult = await authenticatedRequest('POST', '/api/auth/login', invalidLoginData);
  console.log('Invalid Login Result:', invalidLoginResult.success === false ? '✅ CORRECTLY REJECTED' : '❌ UNEXPECTEDLY ACCEPTED');

  // Test 16: Missing Required Fields
  console.log('\n16. Testing Missing Required Fields...');
  const missingFieldsData = {
    task_details: 'Task without required fields'
  };
  
  const missingFieldsResult = await authenticatedRequest('POST', '/api/users/addTask', missingFieldsData);
  console.log('Missing Fields Result:', missingFieldsResult.success === false ? '✅ CORRECTLY REJECTED' : '❌ UNEXPECTEDLY ACCEPTED');

  // Test 17: Unauthorized Access
  console.log('\n17. Testing Unauthorized Access...');
  const originalToken = authToken;
  authToken = 'invalid_token';
  
  const unauthorizedResult = await authenticatedRequest('POST', '/api/users/getUserProfile');
  authToken = originalToken;
  
  console.log('Unauthorized Result:', unauthorizedResult.success === false ? '✅ CORRECTLY REJECTED' : '❌ UNEXPECTEDLY ACCEPTED');
}

// Main Test Runner
async function runAllTests() {
  console.log('🚀 Starting Leap HRMS API Tests...\n');
  console.log('=====================================');
  
  try {
    // Phase 1: Authentication
    const token = await testAuthentication();
    
    if (!token) {
      console.log('\n❌ Authentication failed. Skipping authenticated tests.');
      return;
    }
    
    // Phase 2: User Management
    await testUserProfile(token);
    
    // Phase 3: Client Management
    await testClientManagement();
    
    // Phase 4: Task Management
    await testTaskManagement();
    
    // Phase 5: WhatsApp Integration
    await testWhatsAppIntegration();
    
    // Phase 6: File Upload
    await testFileUpload();
    
    // Phase 7: Error Handling
    await testErrorHandling();
    
    console.log('\n=====================================');
    console.log('✅ API Testing Complete!');
    
  } catch (error) {
    console.log('\n❌ Test Suite Error:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testAuthentication,
  testUserProfile,
  testClientManagement,
  testTaskManagement,
  testWhatsAppIntegration,
  testFileUpload,
  testErrorHandling
};
