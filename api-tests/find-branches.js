const { createClient } = require('@supabase/supabase-js');

async function findBranches() {
  console.log('🔍 Finding Branch Tables...\n');
  
  const supabaseUrl = 'https://bbiamotvmxkondwnqgko.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTgyNTY2OSwiZXhwIjoyMDM3NDAxNjY5fQ.HqKtV6PhUfbWe8a_Tjp3F3YZSlQZe4M_eqJNtgPk38E';
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  try {
    // List all tables to find branch-related ones
    console.log('1. Looking for branch tables...');
    
    const possibleTables = [
      'leap_client_branch_details',
      'leap_branch_details', 
      'leap_branch',
      'client_branch_details',
      'branch_details'
    ];
    
    for (const tableName of possibleTables) {
      console.log(`\nChecking table: ${tableName}`);
      
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ ${tableName}: Found ${data.length} records`);
          if (data.length > 0) {
            console.log('Sample record:', Object.keys(data[0]));
          }
        }
      } catch (tableError) {
        console.log(`❌ ${tableName}: ${tableError.message}`);
      }
    }
    
    // Also check what client/branch combos exist in customer table
    console.log('\n2. Checking existing client/branch combinations...');
    const { data: customers, error: customerError } = await supabase
      .from('leap_customer')
      .select('client_id, branch_id')
      .not('client_id', 'is', null)
      .not('branch_id', 'is', null)
      .limit(10);
    
    if (customerError) {
      console.log('❌ Could not get customer combos:', customerError.message);
      return;
    }
    
    console.log('✅ Existing client/branch combinations:');
    customers.forEach(customer => {
      console.log(`  Client ${customer.client_id}, Branch ${customer.branch_id}`);
    });
    
    // Get unique combinations
    const uniqueCombos = [...new Set(customers.map(c => `${c.client_id}_${c.branch_id}`))];
    console.log(`\n✅ Found ${uniqueCombos.length} unique combinations`);
    
    // Use first available combo
    if (uniqueCombos.length > 0) {
      const [firstCombo] = uniqueCombos[0].split('_');
      console.log(`\n🎯 Using Client ${firstCombo[0]}, Branch ${firstCombo[1]}`);
      
      return {
        client_id: parseInt(firstCombo[0]),
        branch_id: parseInt(firstCombo[1])
      };
    }
    
  } catch (error) {
    console.log('❌ Search failed:', error.message);
  }
  
  return null;
}

if (require.main === module) {
  findBranches();
}
