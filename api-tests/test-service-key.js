const { createClient } = require('@supabase/supabase-js');

async function testServiceKey() {
  console.log('🔑 Testing Service Role Key...\n');
  
  // Use service role key from your environment
  const supabaseUrl = 'https://bbiamotvmxkondwnqgko.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTgyNTY2OSwiZXhwIjoyMDM3NDAxNjY5fQ.HqKtV6PhUfbWe8a_Tjp3F3YZSlQZe4M_eqJNtgPk38E';
  
  console.log('Using service role key length:', serviceRoleKey.length);
  console.log('Key preview:', serviceRoleKey.substring(0, 30) + '...');
  
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Test database access
    console.log('\n1. Testing database access...');
    const { data, error } = await supabase
      .from('leap_customer')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log('❌ Database access failed:', error.message);
      return false;
    }
    
    console.log('✅ Database access successful');
    console.log('Total customers:', data[0].count);
    
    // Test if we can create a user
    console.log('\n2. Testing user creation...');
    const testUser = {
      emp_id: 'EMP001',
      email_id: 'test@example.com',
      name: 'Test User',
      contact_number: '+1234567890',
      employment_status: true,
      user_role: 4,
      client_id: 1,
      branch_id: 1,
      password: 'TestPassword123!'
    };
    
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email_id,
      password: testUser.password,
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
      return false;
    }
    
    console.log('✅ Auth user created or already exists');
    
    // Create customer record
    const { data: customerData, error: customerError } = await supabase
      .from('leap_customer')
      .upsert({
        customer_id: authData.user?.id || 'existing-user-id',
        client_id: 1,
        branch_id: 1,
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
      return false;
    }
    
    console.log('✅ Test user created successfully');
    console.log('User ID:', customerData[0].customer_id);
    console.log('Employee ID:', customerData[0].emp_id);
    console.log('Email:', customerData[0].email_id);
    
    return true;
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Stack:', error.stack);
    return false;
  }
}

if (require.main === module) {
  testServiceKey();
}
