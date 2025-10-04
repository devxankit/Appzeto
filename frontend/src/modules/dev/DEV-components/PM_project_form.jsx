import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Combobox } from '../../../components/ui/combobox';
import { MultiSelect } from '../../../components/ui/multi-select';
import { DatePicker } from '../../../components/ui/date-picker';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building2, AlertCircle, Star, Clock, CheckCircle, X, ArrowLeft, Loader2, Upload, FileText } from 'lucide-react';
import PM_navbar from './PM_navbar';

const PM_project_form = ({ isOpen, onClose, onSubmit, projectData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Determine if this is edit mode (page) or create mode (dialog)
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: '',
    priority: 'normal',
    dueDate: '',
    assignedTeam: [],
    status: 'planning',
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Load users data when component mounts
  useEffect(() => {
    if (isOpen || isEditMode) {
      loadUsersData();
    }
  }, [isOpen, isEditMode]);

  // Load project data when in edit mode or when projectData is provided
  useEffect(() => {
    if (isEditMode && id) {
      loadProjectData();
    } else if (projectData && isOpen) {
      // Pre-fill form with projectData from PM_new_projects
      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        client: '', // Will be set after clients are loaded
        priority: projectData.priority || 'normal',
        dueDate: '',
        assignedTeam: [],
        status: 'planning',
        attachments: projectData.attachments || [],
      });
    }
  }, [isEditMode, id, projectData, isOpen]);

  // Set client after clients are loaded
  useEffect(() => {
    if (projectData && clients.length > 0 && !formData.client) {
      // Find client by matching client name
      const matchingClient = clients.find(client => 
        client.subtitle === projectData.client?.name || 
        client.label === projectData.client?.name ||
        client.label === projectData.client?.company
      );
      
      if (matchingClient) {
        setFormData(prev => ({ ...prev, client: matchingClient.value }));
      }
    }
  }, [clients, projectData, formData.client]);

  const loadUsersData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock clients data - including clients from PM_new_projects
      const mockClients = [
        { _id: 'c-001', company: 'Acme Corp', fullName: 'John Smith', avatar: 'JS' },
        { _id: 'c-002', company: 'Globex', fullName: 'Jane Doe', avatar: 'JD' },
        { _id: 'c-003', company: 'Initech', fullName: 'Mike Johnson', avatar: 'MJ' },
        { _id: 'c-004', company: 'Umbrella LLC', fullName: 'Sarah Wilson', avatar: 'SW' },
        { _id: 'c-005', company: 'Soylent', fullName: 'David Brown', avatar: 'DB' },
        { _id: 'c-006', company: 'Stark Industries', fullName: 'Lisa Davis', avatar: 'LD' },
        // Add customers from PM_new_projects
        { _id: 'c-007', company: 'Tech Solutions Inc.', fullName: 'Sarah Wilson', avatar: 'SW' },
        { _id: 'c-008', company: 'Digital Marketing Pro', fullName: 'Michael Chen', avatar: 'MC' },
        { _id: 'c-009', company: 'E-commerce Store', fullName: 'Emily Rodriguez', avatar: 'ER' },
        { _id: 'c-010', company: 'Restaurant Chain', fullName: 'James Thompson', avatar: 'JT' },
        { _id: 'c-011', company: 'Fitness Center', fullName: 'Lisa Anderson', avatar: 'LA' },
      ];

      // Mock team members data
      const mockTeamMembers = [
        { _id: 'u-001', fullName: 'John Doe', jobTitle: 'Developer', department: 'Engineering', avatar: 'JD' },
        { _id: 'u-002', fullName: 'Jane Smith', jobTitle: 'Designer', department: 'Design', avatar: 'JS' },
        { _id: 'u-003', fullName: 'Mike Johnson', jobTitle: 'QA Engineer', department: 'Engineering', avatar: 'MJ' },
        { _id: 'u-004', fullName: 'Sarah Wilson', jobTitle: 'Project Manager', department: 'Management', avatar: 'SW' },
        { _id: 'u-005', fullName: 'David Brown', jobTitle: 'DevOps Engineer', department: 'Engineering', avatar: 'DB' },
        { _id: 'u-006', fullName: 'Lisa Davis', jobTitle: 'UX Designer', department: 'Design', avatar: 'LD' },
        { _id: 'u-007', fullName: 'Tom Wilson', jobTitle: 'Security Engineer', department: 'Engineering', avatar: 'TW' },
        { _id: 'u-008', fullName: 'Emma Taylor', jobTitle: 'Business Analyst', department: 'Business', avatar: 'ET' },
      ];
      
      // Format clients data - prioritize client names over company names
      const formattedClients = mockClients.map(client => ({
        value: client._id,
        label: client.fullName, // Show client name as primary label
        subtitle: client.company, // Show company as subtitle
        icon: Building2,
        avatar: client.avatar
      }));
      
      // Format team members data
      const formattedTeamMembers = mockTeamMembers.map(member => ({
        value: member._id,
        label: member.fullName,
        subtitle: `${member.jobTitle} - ${member.department}`,
        avatar: member.avatar
      }));
      
      setClients(formattedClients);
      setTeamMembers(formattedTeamMembers);
    } catch (error) {
      console.error('Error loading users data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock project data for edit mode
      const mockProject = {
        name: 'Sample Project',
        description: 'This is a sample project for editing',
        customer: 'c-001',
        priority: 'high',
        dueDate: '2025-12-31',
        assignedTeam: ['u-001', 'u-002'],
        status: 'active',
        tags: ['web', 'mobile'],
        attachments: [
          { id: 'att-001', name: 'project-brief.pdf', size: 1024000, type: 'application/pdf' },
          { id: 'att-002', name: 'wireframes.fig', size: 2048000, type: 'application/figma' },
        ],
      };
      
      setFormData({
        name: mockProject.name || '',
        description: mockProject.description || '',
        client: mockProject.client || '',
        priority: mockProject.priority || 'normal',
        dueDate: mockProject.dueDate || '',
        assignedTeam: mockProject.assignedTeam || [],
        status: mockProject.status || 'planning',
        attachments: mockProject.attachments || [],
      });
    } catch (error) {
      console.error('Error loading project:', error);
      navigate('/pm-projects');
    } finally {
      setIsLoading(false);
    }
  };

  const priorities = [
    { value: 'urgent', label: 'Urgent', icon: AlertCircle },
    { value: 'high', label: 'High', icon: AlertCircle },
    { value: 'normal', label: 'Normal', icon: CheckCircle },
    { value: 'low', label: 'Low', icon: Clock }
  ];

  const statuses = [
    { value: 'planning', label: 'Planning', icon: Star },
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'on-hold', label: 'On Hold', icon: Clock },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: X }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file, index) => ({ 
      id: `att-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`, 
      name: file.name, 
      size: file.size, 
      type: file.type, 
      file 
    }));
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }));
  };

  const removeAttachment = (id) => {
    setFormData(prev => ({ ...prev, attachments: prev.attachments.filter(att => att.id !== id) }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.client.trim()) {
      newErrors.client = 'Client is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Creating project:', formData);
        await onSubmit(formData);
        handleClose();
      } catch (error) {
        console.error('Error creating project:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      client: '',
      priority: 'normal',
      dueDate: '',
      assignedTeam: [],
      status: 'planning',
      attachments: [],
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const renderFormContent = () => (
    <>
      {/* Project Name - Required */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          Project Name <span className="text-red-500 ml-1">*</span>
        </label>
        <Input
          type="text"
          placeholder="Enter project name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`h-12 rounded-xl border-2 transition-all duration-200 ${
            errors.name 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 focus:border-primary focus:ring-primary/20'
          }`}
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-sm flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Project Description */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <label className="text-sm font-semibold text-gray-700">Project Description</label>
        <Textarea
          placeholder="Describe the project goals, scope, and requirements..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="min-h-[100px] rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
        />
      </motion.div>

      {/* Client Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          Client <span className="text-red-500 ml-1">*</span>
        </label>
        <Combobox
          options={clients}
          value={formData.client}
          onChange={(value) => handleInputChange('client', value)}
          placeholder="Select a client"
          className="h-12 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
        />
        <AnimatePresence>
          {errors.client && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-sm flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.client}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Priority and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            Priority <span className="text-red-500 ml-1">*</span>
          </label>
          <Combobox
            options={priorities}
            value={formData.priority}
            onChange={(value) => handleInputChange('priority', value)}
            placeholder="Select priority"
            className="h-12 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <label className="text-sm font-semibold text-gray-700">Status</label>
          <Combobox
            options={statuses}
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            placeholder="Select status"
            className="h-12 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </motion.div>
      </div>

      {/* Due Date */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-2"
      >
        <label className="text-sm font-semibold text-gray-700">Due Date</label>
        <DatePicker
          value={formData.dueDate}
          onChange={(date) => handleInputChange('dueDate', date)}
          placeholder="Select due date"
          className="h-12 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
        />
        <AnimatePresence>
          {errors.dueDate && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-sm flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.dueDate}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Team Assignment */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-2"
      >
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Assign Team Members
        </label>
        <MultiSelect
          options={teamMembers}
          value={formData.assignedTeam}
          onChange={(value) => handleInputChange('assignedTeam', value)}
          placeholder="Select team members"
          className="min-h-[48px] rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all duration-200"
        />
        <AnimatePresence>
          {errors.assignedTeam && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-sm flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.assignedTeam}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Attachments */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-2"
      >
        <label className="text-sm font-semibold text-gray-700">Attachments</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary/50 transition-colors duration-200">
          <input 
            type="file" 
            multiple 
            accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar" 
            onChange={handleFileUpload} 
            className="hidden" 
            id="project-attachments" 
          />
          <label htmlFor="project-attachments" className="cursor-pointer">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Click to upload files</p>
            <p className="text-xs text-gray-500">Images, videos, PDFs, documents</p>
          </label>
        </div>
        {formData.attachments.length > 0 && (
          <div className="space-y-2">
            {formData.attachments.map((att, index) => (
              <div key={att.id || `attachment-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-1 bg-primary/10 rounded">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{att.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(att.size)}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeAttachment(att.id)} 
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );

  // Show loading state for edit mode
  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
        <PM_navbar />
        <main className="pt-16 pb-24 md:pt-20 md:pb-8">
          <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading project data...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Page layout for edit mode
  if (isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
        <PM_navbar />
        
        <main className="pt-16 pb-24 md:pt-20 md:pb-8">
          <div className="px-4 md:max-w-4xl md:mx-auto md:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate(`/project/${id}`)}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to Project</span>
              </button>
              
              <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Edit Project</h1>
                <p className="text-primary-foreground/80">
                  Update the project details below. Fields marked with * are required.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {renderFormContent()}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/project/${id}`)}
                    className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Project'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Dialog layout for create mode
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto p-0" onClose={handleClose}>
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold">
              {projectData ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80">
              {projectData 
                ? 'Update the project details below. Fields marked with * are required.'
                : 'Fill in the project details below. Fields marked with * are required.'
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {renderFormContent()}

          {/* Footer Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto h-12 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{projectData ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                projectData ? 'Update Project' : 'Create Project'
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PM_project_form;