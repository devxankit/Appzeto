// Simple test to verify admin authentication
// Run this in browser console after navigating to admin login page

const testAdminAuth = async () => {
  console.log('🧪 Testing Admin Authentication...');
  
  try {
    // Test login
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
    console.log('✅ Login response:', loginData);
    
    if (loginData.success) {
      console.log('🔑 Token received:', loginData.data.token ? 'Yes' : 'No');
      
      // Store token in localStorage
      localStorage.setItem('adminToken', loginData.data.token);
      console.log('💾 Token stored in localStorage');
      
      // Test protected route
      const statsResponse = await fetch('http://localhost:5000/api/admin/projects/management-statistics', {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const statsData = await statsResponse.json();
      console.log('📊 Stats API response:', statsData);
      
      if (statsData.success) {
        console.log('✅ Authentication working!');
        console.log('📈 Projects:', statsData.data?.projects?.total || 'N/A');
      } else {
        console.log('❌ Stats API failed:', statsData);
      }
      
    } else {
      console.log('❌ Login failed:', loginData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testAdminAuth();
