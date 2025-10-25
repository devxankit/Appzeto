const axios = require('axios');

const displayServerStatus = async () => {
  try {
    const response = await axios.get('http://localhost:5000/status');
    const data = response.data;
    
    // Clear console
    console.clear();
    
    // Beautiful status display
    console.log('\n');
    console.log('📊 ' + '='.repeat(60));
    console.log('   🎯 APPZETO SERVER STATUS DASHBOARD');
    console.log('📊 ' + '='.repeat(60));
    console.log('');
    
    // Server Status
    console.log('🖥️  SERVER STATUS:');
    console.log(`   ✅ Status: ${data.server.status}`);
    console.log(`   ⏱️  Uptime: ${data.server.uptime}`);
    console.log(`   💾 Memory: ${data.server.memory.used} / ${data.server.memory.total}`);
    console.log('');
    
    // WebSocket Status
    console.log('📡 WEBSOCKET STATUS:');
    console.log(`   🔌 Status: ${data.websocket.status}`);
    console.log(`   👥 Connected Users: ${data.websocket.connectedUsers}`);
    console.log(`   🏠 Active Rooms: ${data.websocket.activeRooms}`);
    console.log('');
    
    // Database Status
    console.log('🗄️  DATABASE STATUS:');
    console.log(`   🔗 Status: ${data.database.status}`);
    console.log(`   🌐 Host: ${data.database.host}`);
    console.log('');
    
    // Timestamp
    console.log('⏰ LAST UPDATED:');
    console.log(`   📅 ${new Date(data.timestamp).toLocaleString()}`);
    console.log('');
    console.log('📊 ' + '='.repeat(60));
    console.log('');
    
  } catch (error) {
    console.log('\n');
    console.log('❌ ' + '='.repeat(50));
    console.log('   🚨 SERVER STATUS CHECK FAILED');
    console.log('❌ ' + '='.repeat(50));
    console.log('   Error:', error.message);
    console.log('   🔧 Make sure the server is running on port 5000');
    console.log('❌ ' + '='.repeat(50));
    console.log('');
  }
};

// Run the status display
displayServerStatus();
