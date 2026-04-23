const { createClient } = require('@supabase/supabase-js');

async function simpleTableCheck() {
  console.log('🔍 Simple Table Check...\n');
  
  const supabaseUrl = 'https://bbiamotvmxkondwnqgko.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTgyNTY2OSwiZXhwIjoyMDM3NDAxNjY5fQ.HqKtV6PhUfbWe8a_Tjp3F3YZSlQZe4M_eqJNtgPk38E';
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  try {
    // Get a sample record to understand structure
    console.log('1. Getting sample records...');
    const { data: records, error: recordsError } = await supabase
      .from('leap_customer')
      .select('*')
      .limit(3);
    
    if (recordsError) {
      console.log('❌ Could not get records:', recordsError.message);
      return;
    }
    
    console.log(`✅ Found ${records.length} records:`);
    records.forEach((record, index) => {
      console.log(`\nRecord ${index + 1}:`);
      Object.keys(record).forEach(key => {
        const value = record[key];
        const type = typeof value;
        console.log(`  ${key}: ${value} (${type})`);
      });
    });
    
    // Try to find our test user
    console.log('\n2. Looking for test@example.com...');
    const { data: testUser, error: testError } = await supabase
      .from('leap_customer')
      .select('*')
      .eq('email_id', 'test@example.com')
      .limit(1);
    
    if (testError) {
      console.log('❌ Test user lookup failed:', testError.message);
      return;
    }
    
    if (testUser.length === 0) {
      console.log('❌ Test user not found in customer table');
      
      // Try to create with a simple integer ID
      console.log('\n3. Trying to create test user with integer ID...');
      const { data: newUser, error: createError } = await supabase
        .from('leap_customer')
        .insert({
          customer_id: 999999, // Use integer instead of UUID
          client_id: 1,
          branch_id: 1,
          emp_id: 'EMP001',
          email_id: 'test@example.com',
          name: 'Test User',
          contact_number: '+1234567890',
          employment_status: true,
          user_role: 4
        })
        .select();
      
      if (createError) {
        console.log('❌ User creation failed:', createError.message);
        console.log('Error details:', JSON.stringify(createError, null, 2));
      } else {
        console.log('✅ Test user created with integer ID');
        console.log('Created user:', newUser[0]);
      }
    } else {
      console.log('✅ Test user found:', testUser[0]);
    }
    
  } catch (error) {
    console.log('❌ Check failed:', error.message);
  }
}

if (require.main === module) {
  simpleTableCheck();
}
