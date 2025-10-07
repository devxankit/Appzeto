import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PM_navbar from '../../DEV-components/PM_navbar';
import { Target, Users, Calendar, MoreVertical, Loader2, Lock, CheckCircle, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PM_testing_milestones = () => {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock milestones data with testing status
  const mockTestingMilestones = [
    {
      _id: 'm-001',
      title: 'User Authentication Module',
      description: 'Complete user login, registration, and password reset functionality with security testing.',
      progress: 85,
      status: 'testing',
      priority: 'high',
      project: { _id: 'p-001', name: 'E-commerce Platform' },
      assignedTeam: [
        { _id: 'u-001', fullName: 'John Doe' },
        { _id: 'u-002', fullName: 'Jane Smith' }
      ],
      dueDate: '2024-12-20',
      sequence: 1
    },
    {
      _id: 'm-002',
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe payment processing with comprehensive testing for all payment methods.',
      progress: 92,
      status: 'testing',
      priority: 'urgent',
      project: { _id: 'p-001', name: 'E-commerce Platform' },
      assignedTeam: [
        { _id: 'u-003', fullName: 'Mike Johnson' },
        { _id: 'u-004', fullName: 'Sarah Wilson' }
      ],
      dueDate: '2024-12-18',
      sequence: 2
    },
    {
      _id: 'm-003',
      title: 'Mobile App Security Testing',
      description: 'Comprehensive security testing for biometric authentication and data encryption.',
      progress: 78,
      status: 'testing',
      priority: 'high',
      project: { _id: 'p-002', name: 'Mobile Banking App' },
      assignedTeam: [
        { _id: 'u-005', fullName: 'David Brown' },
        { _id: 'u-006', fullName: 'Lisa Davis' }
      ],
      dueDate: '2024-12-22',
      sequence: 1
    },
    {
      _id: 'm-004',
      title: 'Course Management System',
      description: 'Testing course creation, enrollment, and progress tracking functionality.',
      progress: 88,
      status: 'testing',
      priority: 'normal',
      project: { _id: 'p-003', name: 'Learning Management System' },
      assignedTeam: [
        { _id: 'u-007', fullName: 'Tom Wilson' },
        { _id: 'u-008', fullName: 'Emma Taylor' }
      ],
      dueDate: '2025-01-10',
      sequence: 2
    },
    {
      _id: 'm-005',
      title: 'POS System Integration',
      description: 'Testing point-of-sale integration with inventory management and reporting.',
      progress: 75,
      status: 'testing',
      priority: 'normal',
      project: { _id: 'p-004', name: 'Restaurant Management System' },
      assignedTeam: [
        { _id: 'u-001', fullName: 'John Doe' },
        { _id: 'u-003', fullName: 'Mike Johnson' }
      ],
      dueDate: '2024-12-30',
      sequence: 1
    },
    {
      _id: 'm-006',
      title: 'API Performance Testing',
      description: 'Load testing and performance optimization for all backend APIs.',
      progress: 82,
      status: 'testing',
      priority: 'high',
      project: { _id: 'p-001', name: 'E-commerce Platform' },
      assignedTeam: [
        { _id: 'u-002', fullName: 'Jane Smith' },
        { _id: 'u-005', fullName: 'David Brown' }
      ],
      dueDate: '2024-12-25',
      sequence: 3
    }
  ];

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMilestones(mockTestingMilestones);
    } catch (error) {
      console.error('Error loading testing milestones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active':
      case 'in-progress': return 'bg-primary/10 text-primary border-primary/20'
      case 'planning':
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'testing': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatStatus = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'active': return 'Active'
      case 'planning': return 'Planning'
      case 'testing': return 'Testing'
      case 'pending': return 'Pending'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <PM_navbar />
      
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading testing milestones...</span>
            </div>
          )}

          {/* Milestone Cards */}
          {!isLoading && (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/pm-milestone/${milestone._id}`)}
                  className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300">
                            {milestone.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                            {formatStatus(milestone.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                            {milestone.priority}
                          </span>
                          <span className="text-xs text-gray-500">Seq: {milestone.sequence || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {milestone.description || 'No description available'}
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900 font-medium">{milestone.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${milestone.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{milestone.assignedTeam?.length || 0} assigned</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && milestones.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No testing milestones found</h3>
              <p className="text-gray-600">No milestones are currently in testing phase</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PM_testing_milestones;
