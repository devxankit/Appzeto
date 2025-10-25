import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // Check if server is available
  async checkServerAvailability() {
    try {
      const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
      const response = await fetch(`${serverUrl}/health`, { 
        method: 'GET',
        timeout: 5000 
      });
      return response.ok;
    } catch (error) {
      console.warn('Server health check failed:', error);
      return false;
    }
  }

  // Initialize socket connection
  async connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Check if server is available first
    const serverAvailable = await this.checkServerAvailability();
    if (!serverAvailable) {
      console.warn('Backend server not available, skipping WebSocket connection');
      return null;
    }

    const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    
    console.log('Attempting to connect to WebSocket server:', serverUrl);
    
    try {
      this.socket = io(serverUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        autoConnect: true
      });

      this.setupEventListeners();
      return this.socket;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      return null;
    }
  }

  // Setup socket event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection_status', { connected: false, reason });
      
      // Attempt to reconnect if not manually disconnected
      if (reason !== 'io client disconnect' && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      this.emit('connection_error', error);
      
      // Don't attempt to reconnect on authentication errors
      if (error.message && error.message.includes('Authentication error')) {
        console.warn('Authentication failed, not attempting to reconnect');
        return;
      }
    });

    // Authentication events
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('socket_error', error);
    });

    // Project events
    this.socket.on('project_updated', (data) => {
      console.log('Project updated:', data);
      this.emit('project_updated', data);
    });

    this.socket.on('project_created', (data) => {
      console.log('Project created:', data);
      this.emit('project_created', data);
    });

    this.socket.on('project_deleted', (data) => {
      console.log('Project deleted:', data);
      this.emit('project_deleted', data);
    });

    // Milestone events
    this.socket.on('milestone_updated', (data) => {
      console.log('Milestone updated:', data);
      this.emit('milestone_updated', data);
    });

    this.socket.on('milestone_created', (data) => {
      console.log('Milestone created:', data);
      this.emit('milestone_created', data);
    });

    this.socket.on('milestone_deleted', (data) => {
      console.log('Milestone deleted:', data);
      this.emit('milestone_deleted', data);
    });

    // Task events
    this.socket.on('task_updated', (data) => {
      console.log('Task updated:', data);
      this.emit('task_updated', data);
    });

    this.socket.on('task_created', (data) => {
      console.log('Task created:', data);
      this.emit('task_created', data);
    });

    this.socket.on('task_deleted', (data) => {
      console.log('Task deleted:', data);
      this.emit('task_deleted', data);
    });

    this.socket.on('task_status_changed', (data) => {
      console.log('Task status changed:', data);
      this.emit('task_status_changed', data);
    });

    this.socket.on('task_assigned', (data) => {
      console.log('Task assigned:', data);
      this.emit('task_assigned', data);
    });

    // Comment events
    this.socket.on('comment_added', (data) => {
      console.log('Comment added:', data);
      this.emit('comment_added', data);
    });

    // Team events
    this.socket.on('team_member_added', (data) => {
      console.log('Team member added:', data);
      this.emit('team_member_added', data);
    });

    this.socket.on('team_member_removed', (data) => {
      console.log('Team member removed:', data);
      this.emit('team_member_removed', data);
    });

    // Progress events
    this.socket.on('progress_updated', (data) => {
      console.log('Progress updated:', data);
      this.emit('progress_updated', data);
    });

    // Room events
    this.socket.on('joined_room', (data) => {
      console.log('Joined room:', data);
      this.emit('joined_room', data);
    });

    this.socket.on('left_room', (data) => {
      console.log('Left room:', data);
      this.emit('left_room', data);
    });
  }

  // Attempt to reconnect
  attemptReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.socket && !this.isConnected) {
        this.socket.connect();
      }
    }, delay);
  }

  // Join project room
  joinProject(projectId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_project', projectId);
    }
  }

  // Leave project room
  leaveProject(projectId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_project', projectId);
    }
  }

  // Join milestone room
  joinMilestone(milestoneId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_milestone', milestoneId);
    }
  }

  // Leave milestone room
  leaveMilestone(milestoneId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_milestone', milestoneId);
    }
  }

  // Join task room
  joinTask(taskId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_task', taskId);
    }
  }

  // Leave task room
  leaveTask(taskId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_task', taskId);
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Emit event to local listeners
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Send custom event
  sendEvent(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
