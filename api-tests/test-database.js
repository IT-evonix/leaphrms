const { createClient } = require('@supabase/supabase-js');

async function testDatabaseConnection() {
  console.log('🗄️ Testing Database Connection...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic Supabase connection...');
    const supabase = createClient(
      'https://bbiamotvmxkondwnqgko.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NjksImV4cCI6MjAzNzQwMTY2OX0.s_k0uxO8wB5_N2AhMWtXSKE078bc8aN1dveixgFmmGE'
    );
    
    // Test 2: Check if we can reach leap_customer table
    console.log('\n2. Testing database table access...');
    const { data, error } = await supabase
      .from('leap_customer')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log('Total records in leap_customer:', data[0].count);
    
    // Test 3: Try to find our test user
    console.log('\n3. Testing test user lookup...');
    const { data: userData, error: userError } = await supabase
      .from('leap_customer')
      .select('*')
      .eq('emp_id', 'EMP001')
      .limit(1);
    
    if (userError) {
      console.log('❌ Test user lookup failed:', userError.message);
      return false;
    }
    
    if (userData.length === 0) {
      console.log('❌ Test user not found in database');
      console.log('💡 You need to create a test user first');
      return false;
    }
    
    console.log('✅ Test user found:', userData[0]);
    console.log('User details:');
    console.log('- ID:', userData[0].customer_id);
    console.log('- Email:', userData[0].email_id);
    console.log('- Employee ID:', userData[0].emp_id);
    console.log('- Employment Status:', userData[0].employment_status);
    
    return true;
    
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
    return false;
  }
}

// Main test runner
if (require.main === module) {
  testDatabaseConnection();
}
