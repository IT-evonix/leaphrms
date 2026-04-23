const { createClient } = require('@supabase/supabase-js');

async function createCustomerOnly() {
  console.log('👤 Creating Customer Record Only...\n');
  
  const supabaseUrl = 'https://bbiamotvmxkondwnqgko.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTgyNTY2OSwiZXhwIjoyMDM3NDAxNjY5fQ.HqKtV6PhUfbWe8a_Tjp3F3YZSlQZe4M_eqJNtgPk38E';
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  const testUser = {
    emp_id: 'EMP001',
    email_id: 'test@example.com',
    name: 'Test User',
    contact_number: '+1234567890',
    employment_status: true,
    user_role: 4
  };
  
  try {
    // Use existing valid combination: Client 3, Branch 8
    const clientId = 3;
    const branchId = 8;
    const customerId = 221; // From previous run
    
    // Step 1: Get auth user ID
    console.log('1. Getting auth user ID...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email_id,
      password: 'TestPassword123!'
    });
    
    if (signInError) {
      console.log('❌ Auth login failed:', signInError.message);
      return;
    }
    
    const userId = signInData.user?.id;
    if (!userId) {
      console.log('❌ Could not get user ID');
      return;
    }
    
    console.log('✅ Auth user ID:', userId);
    
    // Step 2: Create customer record
    console.log('\n2. Creating customer record...');
    const { data: customerData, error: customerError } = await supabase
      .from('leap_customer')
      .insert({
        customer_id: customerId, // Use integer
        client_id: clientId,
        branch_id: branchId,
        emp_id: testUser.emp_id,
        email_id: testUser.email_id,
        name: testUser.name,
        contact_number: testUser.contact_number,
        employment_status: testUser.employment_status,
        user_role: testUser.user_role,
        authUuid: userId, // Store the auth UUID
        auth_token: `${customerId}_TESTTOKEN123`, // Generate auth token
        notification_enabled: true,
        is_billable: true,
        must_change_password: false,
        date_of_joining: new Date().toISOString().split('T')[0]
      })
      .select();
    
    if (customerError) {
      console.log('❌ Customer record creation failed:', customerError.message);
      console.log('Error details:', JSON.stringify(customerError, null, 2));
      return;
    }
    
    console.log('✅ Test user created successfully!');
    console.log('📋 Created User Details:');
    console.log('- Customer ID:', customerData[0].customer_id);
    console.log('- Auth UUID:', customerData[0].authUuid);
    console.log('- Employee ID:', customerData[0].emp_id);
    console.log('- Email:', customerData[0].email_id);
    console.log('- Name:', customerData[0].name);
    console.log('- Client ID:', customerData[0].client_id);
    console.log('- Branch ID:', customerData[0].branch_id);
    console.log('- Auth Token:', customerData[0].auth_token);
    console.log('- Employment Status:', customerData[0].employment_status);
    console.log('- User Role:', customerData[0].user_role);
    
    // Step 3: Final verification
    console.log('\n3. Final verification...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('leap_customer')
      .select('*')
      .eq('email_id', testUser.email_id)
      .limit(1);
    
    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message);
      return;
    }
    
    if (verifyData.length === 0) {
      console.log('❌ User not found after creation');
      return;
    }
    
    console.log('✅ User verification successful!');
    console.log('🎉 Test user is ready for API testing!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: TestPassword123!');
    console.log('Employee ID: EMP001');
    console.log('\n🚀 Now run: npm run test:auth');
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

if (require.main === module) {
  createCustomerOnly();
}
