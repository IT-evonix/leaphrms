const axios = require('axios');

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function healthCheck() {
  console.log('🏥 API Health Check...\n');
  
  const tests = [
    { name: 'Base URL', url: BASE_URL },
    { name: 'Auth Login', url: `${BASE_URL}/api/auth/login` },
    { name: 'User Profile', url: `${BASE_URL}/api/users/getUserProfile` },
    { name: 'Client List', url: `${BASE_URL}/api/client/getClients` },
    { name: 'Task Types', url: `${BASE_URL}/api/users/getTaskTypes` }
  ];
  
  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await axios.get(test.url, { timeout: 5000 });
      console.log(`${test.name}: ${response.status === 200 ? '✅ UP' : '❌ DOWN'} (${response.status})`);
    } catch (error) {
      console.log(`${test.name}: ❌ ERROR - ${error.message}`);
    }
  }
  
  console.log('\n📊 Environment Variables:');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
}

if (require.main === module) {
  healthCheck();
}
