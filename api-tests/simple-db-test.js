const { createClient } = require('@supabase/supabase-js');

async function testSimpleConnection() {
  console.log('🔍 Testing Simple Database Connection...\n');
  
  // Use the exact credentials from your .env file
  const supabaseUrl = 'https://bbiamotvmxkondwnqgko.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NjksImV4cCI6MjAzNzQwMTY2OX0.s_k0uxO8wB5_N2AhMWtXSKE078bc8aN1dveixgFmmGE';
  
  console.log('Using Supabase URL:', supabaseUrl);
  console.log('Using key length:', supabaseKey.length);
  console.log('Key preview:', supabaseKey.substring(0, 20) + '...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Simple health check
    console.log('\n1. Testing simple health check...');
    const { data, error } = await supabase
      .from('leap_customer')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log('Total customers:', data[0].count);
    
    // Test basic auth
    console.log('\n2. Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'TestPassword123!'
    });
    
    if (authError) {
      console.log('❌ Auth test failed:', authError.message);
      return false;
    }
    
    console.log('✅ Authentication test passed');
    console.log('Session created:', authData.session ? '✅' : '❌');
    
    return true;
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Stack:', error.stack);
    return false;
  }
}

if (require.main === module) {
  testSimpleConnection();
}
