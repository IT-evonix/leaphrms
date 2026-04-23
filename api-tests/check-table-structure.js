const { createClient } = require('@supabase/supabase-js');

async function checkTableStructure() {
  console.log('🔍 Checking leap_customer table structure...\n');
  
  const supabaseUrl = 'https://bbiamotvmxkondwnqgko.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTgyNTY2OSwiZXhwIjoyMDM3NDAxNjY5fQ.HqKtV6PhUfbWe8a_Tjp3F3YZSlQZe4M_eqJNtgPk38E';
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  try {
    // Get table structure
    console.log('1. Getting table information...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'leap_customer')
      .order('ordinal_position');
    
    if (tablesError) {
      console.log('❌ Could not get table structure:', tablesError.message);
      return;
    }
    
    console.log('✅ Table structure found:');
    tables.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(required)'}`);
    });
    
    // Check existing records
    console.log('\n2. Checking existing records...');
    const { data: records, error: recordsError } = await supabase
      .from('leap_customer')
      .select('*')
      .limit(5);
    
    if (recordsError) {
      console.log('❌ Could not get records:', recordsError.message);
      return;
    }
    
    console.log(`✅ Found ${records.length} existing records:`);
    records.forEach((record, index) => {
      console.log(`\nRecord ${index + 1}:`);
      Object.keys(record).forEach(key => {
        console.log(`  ${key}: ${record[key]} (${typeof record[key]})`);
      });
    });
    
  } catch (error) {
    console.log('❌ Check failed:', error.message);
  }
}

if (require.main === module) {
  checkTableStructure();
}
