const { createClient } = require('@supabase/supabase-js');

async function fixUserRecord() {
  console.log('🔧 Fixing Test User Record...\n');
  
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
    // Step 1: Get auth user ID
    console.log('1. Getting auth user ID...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testUser.email_id,
      password: 'TestPassword123!'
    });
    
    if (authError) {
      console.log('❌ Auth login failed:', authError.message);
      return;
    }
    
    const userId = authData.user.id;
    console.log('✅ Auth user ID:', userId);
    
    // Step 2: Check if customer record exists
    console.log('\n2. Checking customer record...');
    const { data: existingCustomer, error: checkError } = await supabase
      .from('leap_customer')
      .select('*')
      .eq('email_id', testUser.email_id)
      .limit(1);
    
    if (checkError) {
      console.log('❌ Check failed:', checkError.message);
      return;
    }
    
    if (existingCustomer.length > 0) {
      console.log('✅ Customer record already exists');
      console.log('Customer ID:', existingCustomer[0].customer_id);
      console.log('Employee ID:', existingCustomer[0].emp_id);
      console.log('Status:', existingCustomer[0].employment_status);
      return;
    }
    
    // Step 3: Create customer record
    console.log('\n3. Creating customer record...');
    const { data: customerData, error: customerError } = await supabase
      .from('leap_customer')
      .insert({
        customer_id: userId,
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
    
    console.log('✅ Customer record created successfully');
    console.log('📋 Created User Details:');
    console.log('- Customer ID:', customerData[0].customer_id);
    console.log('- Employee ID:', customerData[0].emp_id);
    console.log('- Email:', customerData[0].email_id);
    console.log('- Name:', customerData[0].name);
    console.log('- Employment Status:', customerData[0].employment_status);
    console.log('- User Role:', customerData[0].user_role);
    
    // Step 4: Final verification
    console.log('\n4. Final verification...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('leap_customer')
      .select('*')
      .eq('email_id', testUser.email_id)
      .limit(1);
    
    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message);
      return;
    }
    
    console.log('✅ User is ready for API testing!');
    console.log('🎉 All authentication tests should now pass!');
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

if (require.main === module) {
  fixUserRecord();
}
