import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiSearch, 
  FiFilter, 
  FiStar, 
  FiClock, 
  FiUsers, 
  FiTrendingUp,
  FiSend,
  FiCheckCircle,
  FiX,
  FiCode,
  FiSmartphone,
  FiGlobe,
  FiShoppingCart,
  FiBarChart,
  FiShield,
  FiHeadphones,
  FiCamera,
  FiZap
} from 'react-icons/fi'
import Client_navbar from '../../DEV-components/Client_navbar'

const Client_explore = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [showThankYouDialog, setShowThankYouDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)


  // Mock services data - Website and Mobile App focused
  const services = [
    {
      id: 1,
      title: 'Website Development',
      description: 'Custom website development with modern technologies and responsive design',
      category: 'website',
      icon: FiGlobe,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      price: '₹50,000 - ₹2,00,000',
      duration: '4-8 weeks',
      rating: 4.8,
      reviews: 156,
      features: ['Responsive Design', 'SEO Optimized', 'CMS Integration', 'Mobile Friendly', 'Fast Loading', 'Cross Browser Compatible'],
      technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Express'],
      popular: true,
      detailedDescription: 'We create stunning, high-performance websites that are perfectly optimized for all devices. Our websites are built with modern technologies and follow best practices for SEO, security, and user experience.',
      deliverables: ['Responsive Website', 'Admin Panel', 'SEO Optimization', 'Performance Optimization', 'Documentation', '3 Months Support']
    },
    {
      id: 2,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android',
      category: 'mobile',
      icon: FiSmartphone,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      price: '₹1,00,000 - ₹5,00,000',
      duration: '8-16 weeks',
      rating: 4.9,
      reviews: 89,
      features: ['Cross Platform', 'Native Performance', 'App Store Ready', 'Push Notifications', 'Offline Support', 'Real-time Sync'],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      popular: true,
      detailedDescription: 'We develop powerful mobile applications that work seamlessly across iOS and Android platforms. Our apps are optimized for performance, user experience, and app store compliance.',
      deliverables: ['iOS App', 'Android App', 'Admin Dashboard', 'Push Notifications', 'App Store Submission', '6 Months Support']
    },
    {
      id: 3,
      title: 'E-commerce Website',
      description: 'Complete e-commerce platforms with payment integration and inventory management',
      category: 'website',
      icon: FiShoppingCart,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      price: '₹75,000 - ₹3,00,000',
      duration: '6-12 weeks',
      rating: 4.7,
      reviews: 124,
      features: ['Payment Gateway', 'Inventory Management', 'Order Tracking', 'Admin Dashboard', 'Multi-vendor Support', 'Analytics'],
      technologies: ['React', 'Node.js', 'Stripe', 'PayPal', 'MongoDB'],
      popular: false,
      detailedDescription: 'Complete e-commerce solutions with secure payment processing, inventory management, and comprehensive admin controls. Perfect for online businesses of all sizes.',
      deliverables: ['E-commerce Website', 'Payment Integration', 'Admin Panel', 'Inventory System', 'Order Management', 'Analytics Dashboard']
    },
    {
      id: 4,
      title: 'Progressive Web App',
      description: 'Modern PWA that works like a native app on any device',
      category: 'website',
      icon: FiZap,
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
      price: '₹60,000 - ₹2,50,000',
      duration: '6-10 weeks',
      rating: 4.8,
      reviews: 67,
      features: ['Offline Functionality', 'Push Notifications', 'App-like Experience', 'Fast Loading', 'Installable', 'Responsive'],
      technologies: ['React', 'Service Workers', 'Web App Manifest', 'IndexedDB', 'PWA'],
      popular: false,
      detailedDescription: 'Progressive Web Apps combine the best of websites and mobile apps. They work offline, can be installed on devices, and provide native app-like experiences.',
      deliverables: ['PWA Website', 'Offline Support', 'Push Notifications', 'App Installation', 'Performance Optimization', 'Cross Platform']
    },
    {
      id: 5,
      title: 'Hybrid Mobile App',
      description: 'Cross-platform mobile apps using web technologies',
      category: 'mobile',
      icon: FiCode,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      price: '₹80,000 - ₹3,50,000',
      duration: '6-12 weeks',
      rating: 4.6,
      reviews: 45,
      features: ['Single Codebase', 'Cost Effective', 'Faster Development', 'Easy Maintenance', 'Cross Platform', 'Native Features'],
      technologies: ['Ionic', 'Cordova', 'Capacitor', 'Angular', 'React'],
      popular: false,
      detailedDescription: 'Hybrid mobile apps allow you to reach both iOS and Android users with a single codebase, reducing development time and costs while maintaining native functionality.',
      deliverables: ['iOS App', 'Android App', 'Single Codebase', 'Native Features', 'App Store Submission', 'Maintenance Support']
    },
    {
      id: 6,
      title: 'Website Redesign',
      description: 'Modern redesign of existing websites with improved UX/UI',
      category: 'website',
      icon: FiCamera,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      price: '₹30,000 - ₹1,50,000',
      duration: '3-6 weeks',
      rating: 4.9,
      reviews: 92,
      features: ['Modern Design', 'Improved UX', 'Mobile Optimization', 'Performance Boost', 'SEO Enhancement', 'Content Migration'],
      technologies: ['Modern CSS', 'JavaScript', 'Performance Tools', 'SEO Tools', 'Analytics'],
      popular: true,
      detailedDescription: 'Transform your existing website with modern design, improved user experience, and better performance. We maintain your content while enhancing the overall look and functionality.',
      deliverables: ['Redesigned Website', 'Improved Performance', 'Mobile Optimization', 'SEO Enhancement', 'Content Migration', 'Training']
    }
  ]

  const categories = [
    { key: 'all', label: 'All Services' },
    { key: 'website', label: 'Website Development' },
    { key: 'mobile', label: 'Mobile App Development' }
  ]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleServiceRequest = (service) => {
    setSelectedService(service)
    setShowConfirmationDialog(true)
  }

  const handleViewDetails = (service) => {
    setSelectedService(service)
    setShowDetailsDialog(true)
  }

  const handleConfirmRequest = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setShowConfirmationDialog(false)
    setShowThankYouDialog(true)
  }

  const handleCloseThankYou = () => {
    setShowThankYouDialog(false)
    setSelectedService(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Client_navbar />
      
      <main className="pt-16 pb-20 lg:pt-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Clean Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search our website and mobile app services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all duration-200"
                  />
                </div>
                
                {/* Filter Icon */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    showFilters 
                      ? 'bg-teal-50 border-teal-200 text-teal-600' 
                      : 'bg-white border-gray-200 text-gray-400 hover:border-teal-200 hover:text-teal-600'
                  }`}
                >
                  <FiFilter className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Options */}
              <motion.div
                initial={false}
                animate={{
                  height: showFilters ? 'auto' : 0,
                  opacity: showFilters ? 1 : 0
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0.0, 0.2, 1],
                  opacity: { duration: 0.3 }
                }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: showFilters ? 0 : -10 }}
                  transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                  className="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <motion.button
                        key={category.key}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: showFilters ? 1 : 0, 
                          scale: showFilters ? 1 : 0.8 
                        }}
                        transition={{ 
                          duration: 0.3, 
                          delay: showFilters ? index * 0.05 : 0,
                          ease: [0.4, 0.0, 0.2, 1]
                        }}
                        onClick={() => setSelectedCategory(category.key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category.key
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service, index) => {
              const IconComponent = service.icon
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg ${
                    service.popular ? 'border-teal-200' : 'border-gray-200'
                  }`}
                >
                  {/* Service Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {service.popular && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          <FiStar className="h-3 w-3 mr-1" />
                          Popular
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className={`p-2 rounded-lg ${
                        service.popular ? 'bg-teal-100' : 'bg-white/90'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          service.popular ? 'text-teal-600' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Quick Info */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center space-x-1">
                        <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{service.rating}</span>
                        <span className="text-gray-500">({service.reviews})</span>
                      </div>
                      <span className="font-semibold text-teal-600">{service.price}</span>
                    </div>

                     {/* Action Buttons */}
                     <div className="flex space-x-2.5">
                       <button
                         onClick={() => handleViewDetails(service)}
                         className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                       >
                         <FiSearch className="h-4 w-4" />
                         <span>View Details</span>
                       </button>
                       <button
                         onClick={() => handleServiceRequest(service)}
                         className="flex-1 bg-teal-600 text-white py-2 px-3 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                       >
                         <FiSend className="h-4 w-4" />
                         <span>Request</span>
                       </button>
                     </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Service Details Dialog */}
      {showDetailsDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailsDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedService && (
              <>
                {/* Header */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/90 rounded-xl">
                        <selectedService.icon className="h-8 w-8 text-teal-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedService.title}</h2>
                        {selectedService.popular && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                            <FiStar className="h-3 w-3 mr-1" />
                            Popular Service
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDetailsDialog(false)}
                      className="p-2 bg-white/90 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Description</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedService.detailedDescription}</p>
                      </div>

                      {/* Features */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedService.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <FiCheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedService.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Get</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedService.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <FiCheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0" />
                              <span className="text-gray-700">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Quick Info */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Price Range:</span>
                            <span className="font-semibold text-gray-900">{selectedService.price}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-semibold text-gray-900">{selectedService.duration}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center space-x-1">
                              <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-semibold text-gray-900">{selectedService.rating}</span>
                              <span className="text-gray-500">({selectedService.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setShowDetailsDialog(false)
                            handleServiceRequest(selectedService)
                          }}
                          className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <FiSend className="h-5 w-5" />
                          <span>Request This Service</span>
                        </button>
                        <button
                          onClick={() => setShowDetailsDialog(false)}
                          className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Service Request Confirmation Dialog */}
      {showConfirmationDialog && selectedService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmationDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <selectedService.icon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Service</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to request <strong>{selectedService.title}</strong>? 
                Our team will reach out to you within 24 hours to discuss your requirements.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmationDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRequest}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="h-4 w-4" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Thank You Dialog */}
      {showThankYouDialog && selectedService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseThankYou}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Sent!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for requesting <strong>{selectedService.title}</strong>. 
              Our team will contact you within 24 hours to discuss your project requirements.
            </p>
            <button
              onClick={handleCloseThankYou}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Client_explore
