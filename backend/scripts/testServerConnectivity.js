const fetch = require('node-fetch');

// Test server connectivity and authentication
const testServer = async () => {
  try {
    console.log('🔍 Testing server connectivity...');
    
    // Test server status
    const statusResponse = await fetch('http://localhost:5000/status');
    if (statusResponse.ok) {
      const status = await statusResponse.json();
      console.log('✅ Server is running:', status.server.status);
    } else {
      console.log('❌ Server status check failed:', statusResponse.status);
      return;
    }
    
    // Test admin login
    console.log('\n🔐 Testing admin login...');
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@appzeto.com',
        password: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Admin login successful');
      console.log('✅ Token received:', loginData.data.token ? 'Yes' : 'No');
      
      // Test protected route
      console.log('\n📊 Testing protected route...');
      const statsResponse = await fetch('http://localhost:5000/api/admin/projects/management-statistics', {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        console.log('✅ Statistics API working');
        console.log('📈 Projects:', stats.data?.projects?.total || 'N/A');
      } else {
        console.log('❌ Statistics API failed:', statsResponse.status, await statsResponse.text());
      }
      
    } else {
      console.log('❌ Admin login failed:', loginResponse.status, await loginResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run test
testServer();
