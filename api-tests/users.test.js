const axios = require('axios');
const { authenticatedRequest } = require('./auth.test.js');

// User Management Tests
async function testUserManagement() {
  console.log('👥 Testing User Management APIs...\n');
  
  // Test 1: Get User Profile
  console.log('1. Testing Get User Profile...');
  const profileResult = await authenticatedRequest('POST', '/api/users/getUserProfile');
  console.log('Get Profile Result:', profileResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (profileResult.success) {
    console.log('User Data Fields:', Object.keys(profileResult.data.data || {}).length > 0 ? '✅ PRESENT' : '❌ EMPTY');
  }

  // Test 2: Update Employee Address
  console.log('\n2. Testing Update Employee Address...');
  const addressData = {
    address_line1: '123 Test Street',
    address_line2: 'Apt 4B',
    city: 'Test City',
    state: 'Test State',
    postal_code: '12345',
    country: 'Test Country'
  };
  
  const addressResult = await authenticatedRequest('POST', '/api/users/updateEmployee/updateEmpAddress', addressData);
  console.log('Update Address Result:', addressResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 3: Update Employee Bank Details
  console.log('\n3. Testing Update Employee Bank Details...');
  const bankData = {
    bank_name: 'Test Bank',
    account_number: '1234567890',
    ifsc_code: 'TEST123',
    account_holder_name: 'Test User'
  };
  
  const bankResult = await authenticatedRequest('POST', '/api/users/updateEmployee/updateEmpBankDetails', bankData);
  console.log('Update Bank Result:', bankResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 4: Update Employment Details
  console.log('\n4. Testing Update Employment Details...');
  const employmentData = {
    employee_type: 'permanent',
    department: 'IT',
    designation: 'Software Developer',
    date_of_joining: '2024-01-01',
    work_location: 'Office'
  };
  
  const employmentResult = await authenticatedRequest('POST', '/api/users/updateEmployee/updateEmpEmployment', employmentData);
  console.log('Update Employment Result:', employmentResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 5: Reset Device ID
  console.log('\n5. Testing Reset Device ID...');
  const deviceData = {
    customer_id: '1'
  };
  
  const deviceResult = await authenticatedRequest('POST', '/api/users/resetUserDeviceID', deviceData);
  console.log('Reset Device Result:', deviceResult.success ? '✅ SUCCESS' : '❌ FAILED');

  return profileResult.success;
}

// Attendance Management Tests
async function testAttendanceManagement() {
  console.log('\n⏰ Testing Attendance Management APIs...\n');
  
  // Test 6: Get My Attendance
  console.log('6. Testing Get My Attendance...');
  const attendanceData = {
    customer_id: '1',
    start_date: '2024-01-01',
    end_date: '2024-01-31'
  };
  
  const attendanceResult = await authenticatedRequest('POST', '/api/users/get_my_Attendance', attendanceData);
  console.log('Get Attendance Result:', attendanceResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (attendanceResult.success) {
    console.log('Attendance Records:', attendanceResult.data.data?.length || 0);
  }

  // Test 7: Mark Attendance (Admin)
  console.log('\n7. Testing Mark Attendance (Admin)...');
  const markAttendanceData = {
    customer_id: '1',
    attendance_date: new Date().toISOString().split('T')[0],
    check_in_time: '09:00',
    check_out_time: '18:00',
    working_hours: '9'
  };
  
  const markResult = await authenticatedRequest('POST', '/api/clientAdmin/mark_emp_attendance', markAttendanceData);
  console.log('Mark Attendance Result:', markResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 8: Update Attendance Location
  console.log('\n8. Testing Update Attendance Location...');
  const locationData = {
    customer_id: '1',
    latitude: '40.7128',
    longitude: '-74.0060',
    location_address: 'New York, NY'
  };
  
  const locationResult = await authenticatedRequest('POST', '/api/updateAttendanceLocation', locationData);
  console.log('Update Location Result:', locationResult.success ? '✅ SUCCESS' : '❌ FAILED');

  return attendanceResult.success;
}

// Leave Management Tests
async function testLeaveManagement() {
  console.log('\n🏖️ Testing Leave Management APIs...\n');
  
  // Test 9: Get Leave Types
  console.log('9. Testing Get Leave Types...');
  const leaveTypesResult = await authenticatedRequest('POST', '/api/users/showLeaveType');
  console.log('Get Leave Types Result:', leaveTypesResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (leaveTypesResult.success) {
    console.log('Leave Types Count:', leaveTypesResult.data.data?.length || 0);
  }

  // Test 10: Apply for Leave
  console.log('\n10. Testing Apply for Leave...');
  const applyLeaveData = {
    leave_type_id: '1',
    from_date: '2024-02-01',
    to_date: '2024-02-05',
    leave_reason: 'Personal work',
    total_days: '5'
  };
  
  const applyResult = await authenticatedRequest('POST', '/api/users/applyLeave', applyLeaveData);
  console.log('Apply Leave Result:', applyResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 11: Get Leave Balance
  console.log('\n11. Testing Get Leave Balance...');
  const balanceData = {
    customer_id: '1'
  };
  
  const balanceResult = await authenticatedRequest('POST', '/api/users/getLeaveBalance', balanceData);
  console.log('Get Leave Balance Result:', balanceResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (balanceResult.success) {
    console.log('Leave Balance Data:', balanceResult.data.data ? '✅ RECEIVED' : '❌ EMPTY');
  }

  return leaveTypesResult.success;
}

// Support Management Tests
async function testSupportManagement() {
  console.log('\n🎫 Testing Support Management APIs...\n');
  
  // Test 12: Raise Support Ticket
  console.log('12. Testing Raise Support Ticket...');
  const supportData = {
    client_id: '1',
    customer_id: '1',
    branch_id: '1',
    type_id: '1',
    description: 'Test support ticket description',
    priority_level: '2'
  };
  
  const raiseResult = await authenticatedRequest('POST', '/api/users/support/raiseSupport', supportData);
  console.log('Raise Support Result:', raiseResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 13: Get Support List
  console.log('\n13. Testing Get Support List...');
  const supportListData = {
    page: '1',
    customer_id: '1'
  };
  
  const listResult = await authenticatedRequest('POST', '/api/users/support/supportList', supportListData);
  console.log('Get Support List Result:', listResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (listResult.success) {
    console.log('Support Tickets Count:', listResult.data.data?.length || 0);
  }

  return raiseResult.success;
}

// Project Management Tests
async function testProjectManagement() {
  console.log('\n📊 Testing Project Management APIs...\n');
  
  // Test 14: Add Project
  console.log('14. Testing Add Project...');
  const projectData = {
    project_name: 'Test Project',
    project_description: 'Test project description',
    project_type_id: '1',
    team_lead_id: '1',
    project_manager_id: '1'
  };
  
  const addProjectResult = await authenticatedRequest('POST', '/api/users/project/addProject', projectData);
  console.log('Add Project Result:', addProjectResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 15: Add Sub-Project
  console.log('\n15. Testing Add Sub-Project...');
  const subProjectData = {
    project_id: '1',
    sub_project_name: 'Test Sub-Project',
    description: 'Test sub-project description'
  };
  
  const addSubProjectResult = await authenticatedRequest('POST', '/api/users/project/addSubProject', subProjectData);
  console.log('Add Sub-Project Result:', addSubProjectResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 16: Get Sub-Projects
  console.log('\n16. Testing Get Sub-Projects...');
  const getSubProjectData = {
    client_id: '1'
  };
  
  const getSubResult = await authenticatedRequest('POST', '/api/users/project/getProjectSubProject', getSubProjectData);
  console.log('Get Sub-Projects Result:', getSubResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (getSubResult.success) {
    console.log('Sub-Projects Count:', getSubResult.data.data?.length || 0);
  }

  return addProjectResult.success;
}

// Document Management Tests
async function testDocumentManagement() {
  console.log('\n📄 Testing Document Management APIs...\n');
  
  // Test 17: Document Upload
  console.log('17. Testing Document Upload...');
  const testContent = 'Test document content';
  const blob = new Blob([testContent], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, 'test-doc.txt');
  formData.append('customer_id', '1');
  formData.append('doc_type_id', '1');
  
  try {
    const uploadResult = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/UploadFiles/uploadDocuments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${require('./auth.test.js').authToken || ''}`
      }
    });
    console.log('Document Upload Result:', uploadResult.status === 200 ? '✅ SUCCESS' : '❌ FAILED');
    return uploadResult.status === 200;
  } catch (error) {
    console.log('Document Upload Error:', error.message);
    return false;
  }
}

// Notification Tests
async function testNotifications() {
  console.log('\n🔔 Testing Notification APIs...\n');
  
  // Test 18: Disable Notifications
  console.log('18. Testing Disable Notifications...');
  const disableData = {
    customer_id: '1'
  };
  
  const disableResult = await authenticatedRequest('POST', '/api/users/notificationDisable', disableData);
  console.log('Disable Notifications Result:', disableResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 19: Enable/Disable Notifications
  console.log('\n19. Testing Enable/Disable Notifications...');
  const enableData = {
    client_id: '1',
    customer_id: '1',
    permission_id: '1',
    is_allowed: false
  };
  
  const enableResult = await authenticatedRequest('POST', '/api/users/notificationEnableDisable', enableData);
  console.log('Enable/Disable Notifications Result:', enableResult.success ? '✅ SUCCESS' : '❌ FAILED');

  return disableResult.success;
}

// Main User Management Test Runner
async function runUserTests() {
  console.log('🚀 Starting User Management API Tests...\n');
  console.log('=====================================');
  
  try {
    await testUserManagement();
    await testAttendanceManagement();
    await testLeaveManagement();
    await testSupportManagement();
    await testProjectManagement();
    await testDocumentManagement();
    await testNotifications();
    
    console.log('\n=====================================');
    console.log('✅ User Management Tests Complete!');
    
  } catch (error) {
    console.log('\n❌ User Management Test Suite Error:', error.message);
  }
}

module.exports = {
  runUserTests,
  testUserManagement,
  testAttendanceManagement,
  testLeaveManagement,
  testSupportManagement,
  testProjectManagement,
  testDocumentManagement,
  testNotifications
};
