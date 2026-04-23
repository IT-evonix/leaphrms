const { createClient } = require('@supabase/supabase-js');

async function createProperUser() {
  console.log('👤 Creating Proper Test User...\n');
  
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
    // Step 1: Get existing branches to use valid branch_id
    console.log('1. Getting available branches...');
    const { data: branches, error: branchError } = await supabase
      .from('leap_client_branch_details')
      .select('client_id, branch_id')
      .limit(5);
    
    if (branchError) {
      console.log('❌ Could not get branches:', branchError.message);
      return;
    }
    
    if (branches.length === 0) {
      console.log('❌ No branches found');
      return;
    }
    
    console.log('✅ Available branches:');
    branches.forEach(branch => {
      console.log(`  Client ${branch.client_id}, Branch ${branch.branch_id}`);
    });
    
    const validBranch = branches[0]; // Use first available branch
    console.log(`Using Client ${validBranch.client_id}, Branch ${validBranch.branch_id}`);
    
    // Step 2: Get next customer_id
    console.log('\n2. Getting next customer_id...');
    const { data: maxCustomer, error: maxError } = await supabase
      .from('leap_customer')
      .select('customer_id')
      .order('customer_id', { ascending: false })
      .limit(1);
    
    if (maxError) {
      console.log('❌ Could not get max customer ID:', maxError.message);
      return;
    }
    
    const nextCustomerId = maxCustomer.length > 0 ? maxCustomer[0].customer_id + 1 : 1;
    console.log('✅ Next customer ID:', nextCustomerId);
    
    // Step 3: Create auth user
    console.log('\n3. Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email_id,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        emp_id: testUser.emp_id,
        name: testUser.name,
        contact_number: testUser.contact_number
      }
    });
    
    if (authError && !authError.message.includes('already registered')) {
      console.log('❌ Auth user creation failed:', authError.message);
      return;
    }
    
    console.log('✅ Auth user created or already exists');
    
    // Step 4: Get auth user ID
    let userId;
    if (authData?.user?.id) {
      userId = authData.user.id;
    } else {
      // Sign in to get existing user
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: testUser.email_id,
        password: 'TestPassword123!'
      });
      userId = signInData.user?.id;
    }
    
    if (!userId) {
      console.log('❌ Could not get user ID');
      return;
    }
    
    console.log('✅ Auth user ID:', userId);
    
    // Step 5: Create customer record with proper structure
    console.log('\n4. Creating customer record...');
    const { data: customerData, error: customerError } = await supabase
      .from('leap_customer')
      .insert({
        customer_id: nextCustomerId, // Use integer
        client_id: validBranch.client_id,
        branch_id: validBranch.branch_id,
        emp_id: testUser.emp_id,
        email_id: testUser.email_id,
        name: testUser.name,
        contact_number: testUser.contact_number,
        employment_status: testUser.employment_status,
        user_role: testUser.user_role,
        authUuid: userId, // Store the auth UUID
        auth_token: `${nextCustomerId}_TESTTOKEN123`, // Generate auth token
        notification_enabled: true,
        is_billable: true,
        must_change_password: false
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
    
    // Step 6: Final verification
    console.log('\n5. Final verification...');
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
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

if (require.main === module) {
  createProperUser();
}
