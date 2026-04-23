// Script to create a test user in the database
const { createClient } = require('@supabase/supabase-js');

async function createTestUser() {
  console.log('👤 Creating Test User...\n');
  
  // You need to set your actual Supabase credentials here
  const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your actual URL
  const supabaseKey = 'your_anon_key'; // Replace with your actual anon key
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const testUser = {
    emp_id: 'EMP001',
    email_id: 'test@example.com',
    name: 'Test User',
    contact_number: '+1234567890',
    employment_status: true,
    user_role: 4, // Employee role
    password: 'TestPassword123!' // This will be hashed by Supabase auth
  };
  
  try {
    // First create the user in auth system
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email_id,
      password: testUser.password,
      options: {
        data: {
          emp_id: testUser.emp_id,
          name: testUser.name,
          contact_number: testUser.contact_number,
          employment_status: testUser.employment_status,
          user_role: testUser.user_role
        }
      }
    });
    
    if (authError) {
      console.log('❌ Auth signup failed:', authError.message);
      return;
    }
    
    console.log('✅ Auth user created successfully');
    
    // Then create the user profile in leap_customer table
    const { data: profileData, error: profileError } = await supabase
      .from('leap_customer')
      .insert({
        customer_id: authData.user.id,
        client_id: 1, // Default client ID
        branch_id: 1, // Default branch ID
        emp_id: testUser.emp_id,
        email_id: testUser.email_id,
        name: testUser.name,
        contact_number: testUser.contact_number,
        employment_status: testUser.employment_status,
        user_role: testUser.user_role
      })
      .select();
    
    if (profileError) {
      console.log('❌ Profile creation failed:', profileError.message);
      return;
    }
    
    console.log('✅ Test user profile created successfully');
    console.log('📋 User Details:');
    console.log('- Auth ID:', authData.user.id);
    console.log('- Profile ID:', profileData[0].id);
    console.log('- Employee ID:', testUser.emp_id);
    console.log('- Email:', testUser.email_id);
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
  }
}

if (require.main === module) {
  createTestUser();
}
