import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PM_navbar from '../../DEV-components/PM_navbar';
import { FolderKanban, Users, Calendar, MoreVertical, Loader2 } from 'lucide-react';

const PM_testing_projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock projects data with testing status
  const mockTestingProjects = [
    {
      _id: 'p-001',
      name: 'E-commerce Platform',
      description: 'Online shopping platform with payment integration and inventory management.',
      progress: 85,
      status: 'testing',
      priority: 'high',
      customer: { _id: 'c-001', company: 'Tech Solutions Inc.' },
      assignedTeam: [
        { _id: 'u-001', fullName: 'John Doe' },
        { _id: 'u-002', fullName: 'Jane Smith' },
        { _id: 'u-003', fullName: 'Mike Johnson' }
      ],
      dueDate: '2024-12-20',
    },
    {
      _id: 'p-002',
      name: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication.',
      progress: 92,
      status: 'testing',
      priority: 'urgent',
      customer: { _id: 'c-002', company: 'Digital Finance Corp' },
      assignedTeam: [
        { _id: 'u-004', fullName: 'Sarah Wilson' },
        { _id: 'u-005', fullName: 'David Brown' }
      ],
      dueDate: '2024-12-18',
    },
    {
      _id: 'p-003',
      name: 'Learning Management System',
      description: 'Educational platform for online courses and student management.',
      progress: 78,
      status: 'testing',
      priority: 'normal',
      customer: { _id: 'c-003', company: 'EduTech Solutions' },
      assignedTeam: [
        { _id: 'u-006', fullName: 'Lisa Davis' },
        { _id: 'u-007', fullName: 'Tom Wilson' }
      ],
      dueDate: '2025-01-10',
    },
    {
      _id: 'p-004',
      name: 'Restaurant Management System',
      description: 'Complete restaurant management with POS, inventory, and staff management.',
      progress: 88,
      status: 'testing',
      priority: 'normal',
      customer: { _id: 'c-004', company: 'Food Chain Corp' },
      assignedTeam: [
        { _id: 'u-008', fullName: 'Emma Taylor' },
        { _id: 'u-001', fullName: 'John Doe' }
      ],
      dueDate: '2024-12-30',
    }
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProjects(mockTestingProjects);
    } catch (error) {
      console.error('Error loading testing projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-primary/10 text-primary border-primary/20';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'testing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'active': return 'Active';
      case 'planning': return 'Planning';
      case 'on-hold': return 'On Hold';
      case 'testing': return 'Testing';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatPriority = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'High';
      case 'normal': return 'Normal';
      case 'low': return 'Low';
      default: return priority;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <PM_navbar />
      
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading testing projects...</span>
            </div>
          )}

          {/* Responsive Project Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((project) => (
                <div 
                  key={project._id} 
                  onClick={() => navigate(`/pm-project/${project._id}`)}
                  className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                {/* Header Section */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {project.name}
                        </h3>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle menu click
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 ml-1"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1.5 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {formatPriority(project.priority)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {formatStatus(project.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Progress Section */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{project.assignedTeam?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">
                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        }) : 'No date'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-700">
                      {(() => {
                        if (!project.dueDate) return 'No date';
                        
                        const now = new Date();
                        const dueDate = new Date(project.dueDate);
                        const diffTime = dueDate.getTime() - now.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        if (diffDays < 0) {
                          return `${Math.abs(diffDays)}d overdue`;
                        } else if (diffDays === 0) {
                          return 'Today';
                        } else if (diffDays === 1) {
                          return 'Tomorrow';
                        } else {
                          return `${diffDays}d left`;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && projects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No testing projects found</h3>
              <p className="text-gray-600">No projects are currently in testing phase</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PM_testing_projects;
