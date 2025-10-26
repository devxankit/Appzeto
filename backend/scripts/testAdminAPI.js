const fetch = require('node-fetch');

const testAdminAPI = async () => {
  try {
    console.log('🔐 Testing admin login...');
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
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData.success);
    
    if (loginData.success) {
      console.log('🔑 Token received:', loginData.data.token ? 'Yes' : 'No');
      
      console.log('\n👥 Testing users API...');
      const usersResponse = await fetch('http://localhost:5000/api/admin/users?role=admin', {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const usersData = await usersResponse.json();
      console.log('✅ Users API response structure:', Object.keys(usersData));
      console.log('✅ Users API success:', usersData.success);
      console.log('✅ Users API data type:', typeof usersData.data);
      
      console.log('\n📊 Testing project statistics API...');
      const statsResponse = await fetch('http://localhost:5000/api/admin/projects/management-statistics', {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const statsData = await statsResponse.json();
      console.log('✅ Stats API response structure:', Object.keys(statsData));
      console.log('✅ Stats API success:', statsData.success);
      console.log('✅ Stats API data type:', typeof statsData.data);
      
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testAdminAPI();
