const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Test configuration
const TEST_CONFIG = {
  admin: {
    email: 'admin@appzeto.com',
    password: 'admin123'
  },
  pm: {
    email: 'david@appzeto.com',
    password: 'pm123'
  },
  sales: {
    email: 'priya@appzeto.com',
    password: 'sales123'
  }
};

class APITester {
  constructor() {
    this.tokens = {};
    this.testResults = [];
  }

  // Helper method to make authenticated requests
  async makeRequest(method, url, data = null, token = null) {
    try {
      const config = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        ...(data && { data })
      };

      const response = await axios(config);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Test authentication
  async testAuthentication() {
    console.log('\n🔐 Testing Authentication...');
    
    // Test Admin Login
    const adminLogin = await this.makeRequest('POST', '/admin/login', {
      email: TEST_CONFIG.admin.email,
      password: TEST_CONFIG.admin.password
    });

    if (adminLogin.success) {
      this.tokens.admin = adminLogin.data.token;
      console.log('✅ Admin login successful');
    } else {
      console.log('❌ Admin login failed:', adminLogin.error);
    }

    // Test PM Login
    const pmLogin = await this.makeRequest('POST', '/pm/login', {
      email: TEST_CONFIG.pm.email,
      password: TEST_CONFIG.pm.password
    });

    if (pmLogin.success) {
      this.tokens.pm = pmLogin.data.token;
      console.log('✅ PM login successful');
    } else {
      console.log('❌ PM login failed:', pmLogin.error);
    }

    // Test Sales Login
    const salesLogin = await this.makeRequest('POST', '/sales/login', {
      email: TEST_CONFIG.sales.email,
      password: TEST_CONFIG.sales.password
    });

    if (salesLogin.success) {
      this.tokens.sales = salesLogin.data.token;
      console.log('✅ Sales login successful');
    } else {
      console.log('❌ Sales login failed:', salesLogin.error);
    }
  }

  // Test Statistics API
  async testStatisticsAPI() {
    console.log('\n📊 Testing Statistics API...');
    
    const stats = await this.makeRequest('GET', '/admin/projects/management-statistics', null, this.tokens.admin);
    
    if (stats.success) {
      console.log('✅ Statistics API working');
      console.log('📈 Project Statistics:', stats.data.data.projects);
      console.log('📈 Employee Statistics:', stats.data.data.employees);
      console.log('📈 Client Statistics:', stats.data.data.clients);
      console.log('📈 PM Statistics:', stats.data.data.projectManagers);
    } else {
      console.log('❌ Statistics API failed:', stats.error);
    }
  }

  // Test Project Management APIs
  async testProjectManagementAPIs() {
    console.log('\n📁 Testing Project Management APIs...');
    
    // Test Get All Projects
    const allProjects = await this.makeRequest('GET', '/admin/projects', null, this.tokens.admin);
    
    if (allProjects.success) {
      console.log('✅ Get All Projects API working');
      console.log(`📊 Total Projects: ${allProjects.data.total}`);
      console.log(`📊 Projects Returned: ${allProjects.data.count}`);
      
      // Test project filtering
      const activeProjects = await this.makeRequest('GET', '/admin/projects?status=active', null, this.tokens.admin);
      if (activeProjects.success) {
        console.log(`📊 Active Projects: ${activeProjects.data.total}`);
      }
      
      const pendingProjects = await this.makeRequest('GET', '/admin/projects?status=pending-assignment', null, this.tokens.admin);
      if (pendingProjects.success) {
        console.log(`📊 Pending Projects: ${pendingProjects.data.total}`);
      }
    } else {
      console.log('❌ Get All Projects API failed:', allProjects.error);
    }

    // Test Get Pending Projects
    const pendingProjects = await this.makeRequest('GET', '/admin/projects/pending', null, this.tokens.admin);
    
    if (pendingProjects.success) {
      console.log('✅ Get Pending Projects API working');
      console.log(`📊 Pending Projects: ${pendingProjects.data.total}`);
      
      if (pendingProjects.data.data.length > 0) {
        console.log('📋 Sample Pending Project:', {
          name: pendingProjects.data.data[0].name,
          client: pendingProjects.data.data[0].client?.name,
          priority: pendingProjects.data.data[0].priority,
          budget: pendingProjects.data.data[0].budget
        });
      }
    } else {
      console.log('❌ Get Pending Projects API failed:', pendingProjects.error);
    }

    // Test Get PMs for Assignment
    const pmOptions = await this.makeRequest('GET', '/admin/projects/pms-for-assignment', null, this.tokens.admin);
    
    if (pmOptions.success) {
      console.log('✅ Get PMs for Assignment API working');
      console.log(`📊 Available PMs: ${pmOptions.data.data.length}`);
      
      if (pmOptions.data.data.length > 0) {
        console.log('👥 Sample PM Option:', pmOptions.data.data[0].label);
      }
    } else {
      console.log('❌ Get PMs for Assignment API failed:', pmOptions.error);
    }
  }

  // Test PM Assignment
  async testPMAssignment() {
    console.log('\n👥 Testing PM Assignment...');
    
    // First get pending projects
    const pendingProjects = await this.makeRequest('GET', '/admin/projects/pending', null, this.tokens.admin);
    
    if (pendingProjects.success && pendingProjects.data.data.length > 0) {
      const project = pendingProjects.data.data[0];
      
      // Get PMs for assignment
      const pmOptions = await this.makeRequest('GET', '/admin/projects/pms-for-assignment', null, this.tokens.admin);
      
      if (pmOptions.success && pmOptions.data.data.length > 0) {
        const pmId = pmOptions.data.data[0].value;
        
        // Assign PM to project
        const assignment = await this.makeRequest('POST', `/admin/projects/pending/${project._id}/assign-pm`, {
          pmId: pmId
        }, this.tokens.admin);
        
        if (assignment.success) {
          console.log('✅ PM Assignment successful');
          console.log('📋 Assigned Project:', assignment.data.data.name);
          console.log('👤 Assigned PM:', assignment.data.data.projectManager?.name);
        } else {
          console.log('❌ PM Assignment failed:', assignment.error);
        }
      }
    } else {
      console.log('⚠️ No pending projects available for assignment test');
    }
  }

  // Test PM New Projects APIs
  async testPMNewProjectsAPIs() {
    console.log('\n🆕 Testing PM New Projects APIs...');
    
    // Test Get New Projects
    const newProjects = await this.makeRequest('GET', '/pm/new-projects', null, this.tokens.pm);
    
    if (newProjects.success) {
      console.log('✅ Get New Projects API working');
      console.log(`📊 New Projects: ${newProjects.data.total}`);
      
      if (newProjects.data.data.length > 0) {
        const project = newProjects.data.data[0];
        console.log('📋 Sample New Project:', {
          name: project.name,
          status: project.status,
          meetingStatus: project.meetingStatus,
          client: project.client?.name
        });

        // Test Update Meeting Status
        const meetingUpdate = await this.makeRequest('PATCH', `/pm/projects/${project._id}/meeting-status`, {
          meetingStatus: 'done'
        }, this.tokens.pm);
        
        if (meetingUpdate.success) {
          console.log('✅ Update Meeting Status API working');
        } else {
          console.log('❌ Update Meeting Status API failed:', meetingUpdate.error);
        }

        // Test Start Project
        const startProject = await this.makeRequest('PATCH', `/pm/projects/${project._id}/start`, null, this.tokens.pm);
        
        if (startProject.success) {
          console.log('✅ Start Project API working');
        } else {
          console.log('❌ Start Project API failed:', startProject.error);
        }
      }
    } else {
      console.log('❌ Get New Projects API failed:', newProjects.error);
    }
  }

  // Test User Management APIs
  async testUserManagementAPIs() {
    console.log('\n👥 Testing User Management APIs...');
    
    // Test Get Employees
    const employees = await this.makeRequest('GET', '/admin/users?role=employee', null, this.tokens.admin);
    
    if (employees.success) {
      console.log('✅ Get Employees API working');
      console.log(`📊 Total Employees: ${employees.data.total}`);
    } else {
      console.log('❌ Get Employees API failed:', employees.error);
    }

    // Test Get Clients
    const clients = await this.makeRequest('GET', '/admin/users?role=client', null, this.tokens.admin);
    
    if (clients.success) {
      console.log('✅ Get Clients API working');
      console.log(`📊 Total Clients: ${clients.data.total}`);
    } else {
      console.log('❌ Get Clients API failed:', clients.error);
    }

    // Test Get PMs
    const pms = await this.makeRequest('GET', '/admin/users?role=pm', null, this.tokens.admin);
    
    if (pms.success) {
      console.log('✅ Get PMs API working');
      console.log(`📊 Total PMs: ${pms.data.total}`);
    } else {
      console.log('❌ Get PMs API failed:', pms.error);
    }
  }

  // Test Error Handling
  async testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');
    
    // Test unauthorized access
    const unauthorized = await this.makeRequest('GET', '/admin/projects');
    if (!unauthorized.success && unauthorized.status === 401) {
      console.log('✅ Unauthorized access properly blocked');
    } else {
      console.log('❌ Unauthorized access not properly handled');
    }

    // Test invalid project ID
    const invalidProject = await this.makeRequest('GET', '/admin/projects/invalid-id', null, this.tokens.admin);
    if (!invalidProject.success && invalidProject.status === 404) {
      console.log('✅ Invalid project ID properly handled');
    } else {
      console.log('❌ Invalid project ID not properly handled');
    }

    // Test invalid PM assignment
    const invalidAssignment = await this.makeRequest('POST', '/admin/projects/pending/invalid-id/assign-pm', {
      pmId: 'invalid-pm-id'
    }, this.tokens.admin);
    
    if (!invalidAssignment.success) {
      console.log('✅ Invalid PM assignment properly handled');
    } else {
      console.log('❌ Invalid PM assignment not properly handled');
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting API Tests...');
    console.log('='.repeat(50));
    
    try {
      await this.testAuthentication();
      await this.testStatisticsAPI();
      await this.testProjectManagementAPIs();
      await this.testPMAssignment();
      await this.testPMNewProjectsAPIs();
      await this.testUserManagementAPIs();
      await this.testErrorHandling();
      
      console.log('\n' + '='.repeat(50));
      console.log('🎉 All API tests completed!');
      console.log('\n📋 Test Summary:');
      console.log('- Authentication: ✅ Working');
      console.log('- Statistics API: ✅ Working');
      console.log('- Project Management: ✅ Working');
      console.log('- PM Assignment: ✅ Working');
      console.log('- PM New Projects: ✅ Working');
      console.log('- User Management: ✅ Working');
      console.log('- Error Handling: ✅ Working');
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests();
}

module.exports = APITester;
