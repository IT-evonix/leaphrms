const { createClient } = require('@supabase/supabase-js');

async function createTestUser() {
  console.log('👤 Creating Test User for API Testing...\n');
  
  const supabaseUrl = 'https://bbiamotvmxkondwnqgko.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTgyNTY2OSwiZXhwIjoyMDM3NDAxNjY5fQ.HqKtV6PhUfbWe8a_Tjp3F3YZSlQZe4M_eqJNtgPk38E';
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  const testUser = {
    emp_id: 'EMP001',
    email_id: 'test@example.com',
    name: 'Test User',
    contact_number: '+1234567890',
    employment_status: true,
    user_role: 4,
    client_id: 1,
    branch_id: 1
  };
  
  try {
    // Step 1: Create auth user
    console.log('1. Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email_id,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        emp_id: testUser.emp_id,
        name: testUser.name,
        contact_number: testUser.contact_number,
        employment_status: testUser.employment_status,
        user_role: testUser.user_role
      }
    });
    
    if (authError && !authError.message.includes('already registered')) {
      console.log('❌ Auth user creation failed:', authError.message);
      return;
    }
    
    console.log('✅ Auth user created or already exists');
    
    // Step 2: Get auth user ID
    const userId = authData.user?.id;
    if (!userId) {
      console.log('🔍 Looking up existing user...');
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: testUser.email_id,
        password: 'TestPassword123!'
      });
      
      if (existingUser.user) {
        console.log('✅ Found existing user:', existingUser.user.id);
      } else {
        console.log('❌ Could not find existing user');
        return;
      }
    }
    
    // Step 3: Create customer record
    console.log('\n2. Creating customer record...');
    const { data: customerData, error: customerError } = await supabase
      .from('leap_customer')
      .upsert({
        customer_id: userId || existingUser.user.id,
        client_id: testUser.client_id,
        branch_id: testUser.branch_id,
        emp_id: testUser.emp_id,
        email_id: testUser.email_id,
        name: testUser.name,
        contact_number: testUser.contact_number,
        employment_status: testUser.employment_status,
        user_role: testUser.user_role
      })
      .select();
    
    if (customerError) {
      console.log('❌ Customer record creation failed:', customerError.message);
      console.log('Error details:', JSON.stringify(customerError, null, 2));
      return;
    }
    
    console.log('✅ Test user created successfully');
    console.log('📋 User Details:');
    console.log('- Customer ID:', customerData[0].customer_id);
    console.log('- Employee ID:', customerData[0].emp_id);
    console.log('- Email:', customerData[0].email_id);
    console.log('- Name:', customerData[0].name);
    console.log('- Employment Status:', customerData[0].employment_status);
    console.log('- User Role:', customerData[0].user_role);
    
    // Step 4: Verify user can be found
    console.log('\n3. Verifying user lookup...');
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
    
    console.log('✅ User verification successful');
    console.log('🎉 Test user is ready for API testing!');
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

if (require.main === module) {
  createTestUser();
}
