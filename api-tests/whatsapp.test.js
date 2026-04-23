const axios = require('axios');
const { authenticatedRequest } = require('./auth.test.js');

// WhatsApp Integration Tests
async function testWhatsAppIntegration() {
  console.log('📱 Testing WhatsApp Integration APIs...\n');
  
  // Test 1: User Verification Check
  console.log('1. Testing WhatsApp User Verification...');
  const verifyData = {
    contact_number: '+1234567890'
  };
  
  const verifyResult = await authenticatedRequest('POST', '/api/chatBot/userVerificationCheck', verifyData);
  console.log('WhatsApp Verification Result:', verifyResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (verifyResult.success) {
    console.log('User Verified:', verifyResult.data.data ? '✅ FOUND' : '❌ NOT FOUND');
  }

  // Test 2: Mark Attendance via WhatsApp
  console.log('\n2. Testing Mark Attendance via WhatsApp...');
  const attendanceData = {
    whatsapp_number: '+1234567890',
    attendance_type: 'start',
    location: {
      latitude: '40.7128',
      longitude: '-74.0060'
    },
    working_type_id: '1'
  };
  
  const attendanceResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', attendanceData);
  console.log('WhatsApp Mark Attendance Result:', attendanceResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 3: Add Task via WhatsApp
  console.log('\n3. Testing Add Task via WhatsApp...');
  const taskData = {
    whatsapp_number: '+1234567890',
    task_details: 'WhatsApp Test Task Description',
    task_type_id: '1',
    sub_project_id: '1',
    total_hours: '2',
    total_minutes: '30',
    task_date: new Date().toISOString().split('T')[0]
  };
  
  const taskResult = await authenticatedRequest('POST', '/api/chatBot/addTask', taskData);
  console.log('WhatsApp Add Task Result:', taskResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (taskResult.success) {
    console.log('Task Created:', taskResult.data.data?.[0]?.id ? '✅ YES' : '❌ NO');
  }

  // Test 4: Web Page Form Handling
  console.log('\n4. Testing WhatsApp Web Page Form...');
  const webFormData = {
    form_type: 'leave_application',
    contact_number: '+1234567890',
    form_data: {
      leave_type: 'sick_leave',
      from_date: '2024-02-01',
      to_date: '2024-02-02',
      reason: 'Medical appointment'
    }
  };
  
  const webFormResult = await authenticatedRequest('POST', '/api/chatBot/webPageForm', webFormData);
  console.log('WhatsApp Web Form Result:', webFormResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 5: Pause Attendance
  console.log('\n5. Testing Pause Attendance via WhatsApp...');
  const pauseData = {
    whatsapp_number: '+1234567890',
    attendance_type: 'pause',
    pause_reason: 'Break time'
  };
  
  const pauseResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', pauseData);
  console.log('WhatsApp Pause Result:', pauseResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 6: Resume Attendance
  console.log('\n6. Testing Resume Attendance via WhatsApp...');
  const resumeData = {
    whatsapp_number: '+1234567890',
    attendance_type: 'resume',
    working_type_id: '1'
  };
  
  const resumeResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', resumeData);
  console.log('WhatsApp Resume Result:', resumeResult.success ? '✅ SUCCESS' : '❌ FAILED');

  // Test 7: Stop Attendance
  console.log('\n7. Testing Stop Attendance via WhatsApp...');
  const stopData = {
    whatsapp_number: '+1234567890',
    attendance_type: 'stop',
    work_summary: 'Completed daily tasks'
  };
  
  const stopResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', stopData);
  console.log('WhatsApp Stop Result:', stopResult.success ? '✅ SUCCESS' : '❌ FAILED');

  return {
    verify: verifyResult.success,
    attendance: attendanceResult.success,
    task: taskResult.success,
    webForm: webFormResult.success
  };
}

// WhatsApp-Specific Error Handling Tests
async function testWhatsAppErrorHandling() {
  console.log('\n🚨 Testing WhatsApp Error Handling...\n');
  
  // Test 8: Invalid Contact Number
  console.log('8. Testing Invalid Contact Number...');
  const invalidContactData = {
    contact_number: 'invalid_number'
  };
  
  const invalidContactResult = await authenticatedRequest('POST', '/api/chatBot/userVerificationCheck', invalidContactData);
  console.log('Invalid Contact Result:', invalidContactResult.success === false ? '✅ CORRECTLY REJECTED' : '❌ UNEXPECTEDLY ACCEPTED');

  // Test 9: Missing WhatsApp Number
  console.log('\n9. Testing Missing WhatsApp Number...');
  const missingNumberData = {
    task_details: 'Task without whatsapp number'
  };
  
  const missingNumberResult = await authenticatedRequest('POST', '/api/chatBot/addTask', missingNumberData);
  console.log('Missing Number Result:', missingNumberResult.success === false ? '✅ CORRECTLY REJECTED' : '❌ UNEXPECTEDLY ACCEPTED');

  // Test 10: Invalid Attendance Type
  console.log('\n10. Testing Invalid Attendance Type...');
  const invalidTypeData = {
    whatsapp_number: '+1234567890',
    attendance_type: 'invalid_type'
  };
  
  const invalidTypeResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', invalidTypeData);
  console.log('Invalid Type Result:', invalidTypeResult.success === false ? '✅ CORRECTLY REJECTED' : '❌ UNEXPECTEDLY ACCEPTED');

  return {
    invalidContact: invalidContactResult.success === false,
    missingNumber: missingNumberResult.success === false,
    invalidType: invalidTypeResult.success === false
  };
}

// WhatsApp Flow Integration Test
async function testWhatsAppCompleteFlow() {
  console.log('\n🔄 Testing Complete WhatsApp Flow...\n');
  
  const testContactNumber = '+1234567890';
  
  // Step 1: Verify User
  console.log('Step 1: Verifying user...');
  const verifyData = { contact_number: testContactNumber };
  const verifyResult = await authenticatedRequest('POST', '/api/chatBot/userVerificationCheck', verifyData);
  
  if (!verifyResult.success) {
    console.log('❌ User verification failed. Cannot continue flow.');
    return false;
  }
  
  console.log('✅ User verified successfully');
  
  // Step 2: Start Attendance
  console.log('Step 2: Starting attendance...');
  const startData = {
    whatsapp_number: testContactNumber,
    attendance_type: 'start',
    working_type_id: '1'
  };
  
  const startResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', startData);
  if (!startResult.success) {
    console.log('❌ Attendance start failed.');
    return false;
  }
  
  console.log('✅ Attendance started successfully');
  
  // Step 3: Add Task
  console.log('Step 3: Adding task...');
  const taskData = {
    whatsapp_number: testContactNumber,
    task_details: 'Flow test task',
    task_type_id: '1',
    sub_project_id: '1',
    total_hours: '1',
    total_minutes: '30'
  };
  
  const taskResult = await authenticatedRequest('POST', '/api/chatBot/addTask', taskData);
  if (!taskResult.success) {
    console.log('❌ Task addition failed.');
    return false;
  }
  
  console.log('✅ Task added successfully');
  
  // Step 4: Pause Attendance
  console.log('Step 4: Pausing attendance...');
  const pauseData = {
    whatsapp_number: testContactNumber,
    attendance_type: 'pause',
    pause_reason: 'Lunch break'
  };
  
  const pauseResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', pauseData);
  if (!pauseResult.success) {
    console.log('❌ Attendance pause failed.');
    return false;
  }
  
  console.log('✅ Attendance paused successfully');
  
  // Step 5: Resume Attendance
  console.log('Step 5: Resuming attendance...');
  const resumeData = {
    whatsapp_number: testContactNumber,
    attendance_type: 'resume',
    working_type_id: '1'
  };
  
  const resumeResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', resumeData);
  if (!resumeResult.success) {
    console.log('❌ Attendance resume failed.');
    return false;
  }
  
  console.log('✅ Attendance resumed successfully');
  
  // Step 6: Stop Attendance
  console.log('Step 6: Stopping attendance...');
  const stopData = {
    whatsapp_number: testContactNumber,
    attendance_type: 'stop',
    work_summary: 'Completed day successfully'
  };
  
  const stopResult = await authenticatedRequest('POST', '/api/chatBot/markAttendance', stopData);
  if (!stopResult.success) {
    console.log('❌ Attendance stop failed.');
    return false;
  }
  
  console.log('✅ Attendance stopped successfully');
  console.log('\n🎉 Complete WhatsApp flow test finished successfully!');
  
  return true;
}

// Main WhatsApp Test Runner
async function runWhatsAppTests() {
  console.log('🚀 Starting WhatsApp Integration API Tests...\n');
  console.log('=====================================');
  
  try {
    // Basic functionality tests
    const basicResults = await testWhatsAppIntegration();
    
    // Error handling tests
    const errorResults = await testWhatsAppErrorHandling();
    
    // Complete flow test
    const flowResult = await testWhatsAppCompleteFlow();
    
    console.log('\n=====================================');
    console.log('✅ WhatsApp Integration Tests Complete!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('Basic Tests:', Object.values(basicResults).every(v => v) ? '✅ PASSED' : '❌ SOME FAILED');
    console.log('Error Handling:', Object.values(errorResults).every(v => v) ? '✅ PASSED' : '❌ SOME FAILED');
    console.log('Complete Flow:', flowResult ? '✅ PASSED' : '❌ FAILED');
    
  } catch (error) {
    console.log('\n❌ WhatsApp Test Suite Error:', error.message);
  }
}

module.exports = {
  runWhatsAppTests,
  testWhatsAppIntegration,
  testWhatsAppErrorHandling,
  testWhatsAppCompleteFlow
};
