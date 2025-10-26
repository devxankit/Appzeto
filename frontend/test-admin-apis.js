// Test script for Admin Project Management APIs
// Run this in the browser console after logging in as admin

const testAdminAPIs = async () => {
  console.log('🧪 Testing Admin Project Management APIs...');
  
  try {
    // Check if admin token exists
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('❌ No admin token found. Please login as admin first.');
      return;
    }
    console.log('✅ Admin token found');
    
    // Test statistics API
    console.log('\n📊 Testing Statistics API...');
    const statsResponse = await fetch('http://localhost:5000/api/admin/projects/management-statistics', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Statistics API working');
      console.log('📈 Projects:', stats.data?.projects?.total || 'N/A');
      console.log('👥 Employees:', stats.data?.employees?.total || 'N/A');
      console.log('🏢 Clients:', stats.data?.clients?.total || 'N/A');
    } else {
      console.log('❌ Statistics API failed:', statsResponse.status, await statsResponse.text());
    }
    
    // Test pending projects API
    console.log('\n📁 Testing Pending Projects API...');
    const pendingResponse = await fetch('http://localhost:5000/api/admin/projects/pending?page=1&limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (pendingResponse.ok) {
      const pending = await pendingResponse.json();
      console.log('✅ Pending Projects API working');
      console.log('📋 Pending projects count:', pending.data?.length || 0);
    } else {
      console.log('❌ Pending Projects API failed:', pendingResponse.status, await pendingResponse.text());
    }
    
    // Test PMs for assignment API
    console.log('\n👥 Testing PMs for Assignment API...');
    const pmsResponse = await fetch('http://localhost:5000/api/admin/projects/pms-for-assignment', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (pmsResponse.ok) {
      const pms = await pmsResponse.json();
      console.log('✅ PMs for Assignment API working');
      console.log('👨‍💼 Available PMs:', pms.data?.length || 0);
    } else {
      console.log('❌ PMs for Assignment API failed:', pmsResponse.status, await pmsResponse.text());
    }
    
    // Test all projects API
    console.log('\n📊 Testing All Projects API...');
    const projectsResponse = await fetch('http://localhost:5000/api/admin/projects?page=1&limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (projectsResponse.ok) {
      const projects = await projectsResponse.json();
      console.log('✅ All Projects API working');
      console.log('📋 Total projects:', projects.total || 0);
      console.log('📋 Projects returned:', projects.data?.length || 0);
    } else {
      console.log('❌ All Projects API failed:', projectsResponse.status, await projectsResponse.text());
    }
    
    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testAdminAPIs();
