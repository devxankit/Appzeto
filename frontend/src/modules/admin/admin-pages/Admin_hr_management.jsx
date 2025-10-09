import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Admin_navbar from '../admin-components/Admin_navbar'
import Admin_sidebar from '../admin-components/Admin_sidebar'
import { 
  Users, 
  UserCheck,
  X,
  Plus,
  Cake,
  Shield,
  User
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Combobox } from '../../../components/ui/combobox'
import Loading from '../../../components/ui/loading'

const Admin_hr_management = () => {
  const [loading, setLoading] = useState(true)
  const [showBirthdayModal, setShowBirthdayModal] = useState(false)
  const [birthdayData, setBirthdayData] = useState({
    personId: '',
    birthday: '',
    personType: 'employee' // 'employee' or 'pm'
  })

  // Birthday Statistics
  const [statistics, setStatistics] = useState({
    totalBirthdays: 8,
    todayBirthdays: 2,
    thisWeekBirthdays: 5,
    thisMonthBirthdays: 8
  })

  // Mock data
  const [employees, setEmployees] = useState([])
  const [projectManagers, setProjectManagers] = useState([])
  const [birthdays, setBirthdays] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Mock employees data with birthdays
      const mockEmployees = [
        {
          id: 1,
          name: "Priya Sharma",
          email: "priya.sharma@company.com",
          phone: "+91 98765 43210",
          role: "Senior Developer",
          department: "Engineering",
          status: "active",
          joinDate: "2023-06-01",
          birthday: "1995-03-15",
          age: 29,
          experience: 4.5,
          salary: 55000,
          performance: 95,
          avatar: "PS",
          team: "developer",
          manager: "Sarah Johnson"
        },
        {
          id: 2,
          name: "Rajesh Kumar",
          email: "rajesh.kumar@company.com",
          phone: "+91 87654 32109",
          role: "UI/UX Designer",
          department: "Design",
          status: "active",
          joinDate: "2023-08-15",
          birthday: "1992-07-22",
          age: 32,
          experience: 6.2,
          salary: 48000,
          performance: 88,
          avatar: "RK",
          team: "developer",
          manager: "Mike Wilson"
        },
        {
          id: 3,
          name: "Anjali Singh",
          email: "anjali.singh@company.com",
          phone: "+91 76543 21098",
          role: "QA Engineer",
          department: "Engineering",
          status: "active",
          joinDate: "2023-04-10",
          birthday: "1998-01-08",
          age: 26,
          experience: 2.8,
          salary: 42000,
          performance: 92,
          avatar: "AS",
          team: "developer",
          manager: "Lisa Davis"
        },
        {
          id: 4,
          name: "Vikram Mehta",
          email: "vikram.mehta@company.com",
          phone: "+91 65432 10987",
          role: "DevOps Engineer",
          department: "Engineering",
          status: "on-leave",
          joinDate: "2023-02-01",
          birthday: "1990-12-03",
          age: 34,
          experience: 8.1,
          salary: 60000,
          performance: 98,
          avatar: "VM",
          team: "developer",
          manager: "David Brown"
        },
        {
          id: 5,
          name: "Sneha Gupta",
          email: "sneha.gupta@company.com",
          phone: "+91 54321 09876",
          role: "Sales Executive",
          department: "Sales",
          status: "active",
          joinDate: "2023-09-01",
          birthday: "1996-05-18",
          age: 28,
          experience: 3.5,
          salary: 38000,
          performance: 85,
          avatar: "SG",
          team: "sales",
          manager: "Emma Taylor"
        },
        {
          id: 6,
          name: "Amit Patel",
          email: "amit.patel@company.com",
          phone: "+91 43210 98765",
          role: "Marketing Specialist",
          department: "Marketing",
          status: "active",
          joinDate: "2023-11-15",
          birthday: "1994-09-12",
          age: 30,
          experience: 5.2,
          salary: 45000,
          performance: 90,
          avatar: "AP",
          team: "sales",
          manager: "Emma Taylor"
        }
      ]

      // Mock project managers data with birthdays
      const mockPMs = [
        {
          id: 101,
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          phone: "+91 98765 12345",
          role: "Senior Project Manager",
          department: "Management",
          status: "active",
          joinDate: "2023-02-01",
          birthday: "1988-04-25",
          age: 36,
          experience: 10.5,
          salary: 75000,
          performance: 98,
          avatar: "SJ",
          projects: 5,
          teamSize: 12
        },
        {
          id: 102,
          name: "Mike Wilson",
          email: "mike.wilson@company.com",
          phone: "+91 87654 23456",
          role: "Project Manager",
          department: "Management",
          status: "active",
          joinDate: "2023-05-15",
          birthday: "1991-11-14",
          age: 33,
          experience: 8.2,
          salary: 68000,
          performance: 92,
          avatar: "MW",
          projects: 4,
          teamSize: 8
        },
        {
          id: 103,
          name: "Lisa Davis",
          email: "lisa.davis@company.com",
          phone: "+91 76543 34567",
          role: "Project Manager",
          department: "Management",
          status: "active",
          joinDate: "2023-08-01",
          birthday: "1989-06-30",
          age: 35,
          experience: 9.1,
          salary: 72000,
          performance: 95,
          avatar: "LD",
          projects: 3,
          teamSize: 6
        }
      ]

      // Mock birthdays data
      const mockBirthdays = [
        {
          id: 1,
          personId: 1,
          personName: "Priya Sharma",
          personType: "employee",
          birthday: "1995-03-15",
          age: 29,
          department: "Engineering",
          role: "Senior Developer"
        },
        {
          id: 2,
          personId: 2,
          personName: "Rajesh Kumar",
          personType: "employee",
          birthday: "1992-07-22",
          age: 32,
          department: "Design",
          role: "UI/UX Designer"
        },
        {
          id: 3,
          personId: 101,
          personName: "Sarah Johnson",
          personType: "pm",
          birthday: "1988-04-25",
          age: 36,
          department: "Management",
          role: "Senior Project Manager"
        }
      ]

      setEmployees(mockEmployees)
      setProjectManagers(mockPMs)
      setBirthdays(mockBirthdays)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get today's birthdays
  const getTodaysBirthdays = () => {
    const today = new Date()
    const todayStr = `${today.getMonth() + 1}-${today.getDate()}`
    
    return [...employees, ...projectManagers].filter(person => {
      if (!person.birthday) return false
      const birthday = new Date(person.birthday)
      const birthdayStr = `${birthday.getMonth() + 1}-${birthday.getDate()}`
      return birthdayStr === todayStr
    })
  }

  // Get this week's birthdays
  const getThisWeekBirthdays = () => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    return [...employees, ...projectManagers].filter(person => {
      if (!person.birthday) return false
      const birthday = new Date(person.birthday)
      const currentYear = today.getFullYear()
      birthday.setFullYear(currentYear)
      return birthday >= weekStart && birthday <= weekEnd
    })
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }


  // Handle birthday assignment
  const handleBirthdayAssignment = () => {
    if (!birthdayData.personId || !birthdayData.birthday) return

    const person = birthdayData.personType === 'employee' 
      ? employees.find(emp => emp.id.toString() === birthdayData.personId)
      : projectManagers.find(pm => pm.id.toString() === birthdayData.personId)

    if (person) {
      // Update person's birthday
      if (birthdayData.personType === 'employee') {
        setEmployees(prev => prev.map(emp => 
          emp.id.toString() === birthdayData.personId 
            ? { ...emp, birthday: birthdayData.birthday }
            : emp
        ))
      } else {
        setProjectManagers(prev => prev.map(pm => 
          pm.id.toString() === birthdayData.personId 
            ? { ...pm, birthday: birthdayData.birthday }
            : pm
        ))
      }

      // Add to birthdays list
      const newBirthday = {
        id: Date.now(),
        personId: birthdayData.personId,
        personName: person.name,
        personType: birthdayData.personType,
        birthday: birthdayData.birthday,
        age: new Date().getFullYear() - new Date(birthdayData.birthday).getFullYear(),
        department: person.department,
        role: person.role
      }
      setBirthdays(prev => [...prev, newBirthday])
    }

    // Reset form
    setBirthdayData({
      personId: '',
      birthday: '',
      personType: 'employee'
    })
    setShowBirthdayModal(false)
  }

  // Get person options for birthday assignment
  const getPersonOptions = () => {
    const employeeOptions = employees.map(emp => ({
      value: emp.id.toString(),
      label: `${emp.name} - ${emp.role} (Employee)`,
      icon: User,
      data: { ...emp, type: 'employee' }
    }))

    const pmOptions = projectManagers.map(pm => ({
      value: pm.id.toString(),
      label: `${pm.name} - ${pm.role} (PM)`,
      icon: Shield,
      data: { ...pm, type: 'pm' }
    }))

    return [...employeeOptions, ...pmOptions]
  }

  // Close modals
  const closeModals = () => {
    setShowBirthdayModal(false)
    setBirthdayData({
      personId: '',
      birthday: '',
      personType: 'employee'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Admin_navbar />
        <Admin_sidebar />
        <div className="ml-64 pt-20 p-8">
          <div className="max-w-7xl mx-auto">
            <Loading size="large" className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_navbar />
      <Admin_sidebar />
      
      {/* Main Content */}
      <div className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                HR Management
              </h1>
              <p className="text-gray-600 text-lg">Track and manage employee birthdays</p>
            </div>
          </motion.div>

          {/* Birthday Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Birthdays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Cake className="h-4 w-4 text-pink-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Total</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{statistics.totalBirthdays}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-pink-600 font-semibold">Birthdays</span>
                </div>
              </div>
            </motion.div>

            {/* Today's Birthdays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Cake className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Today</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{getTodaysBirthdays().length}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-purple-600 font-semibold">Birthdays</span>
                </div>
              </div>
            </motion.div>

            {/* This Week's Birthdays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Cake className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">This Week</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{getThisWeekBirthdays().length}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-600 font-semibold">Birthdays</span>
                </div>
              </div>
            </motion.div>

            {/* This Month's Birthdays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Cake className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-xs text-gray-500 font-medium">This Month</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{statistics.thisMonthBirthdays}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-green-600 font-semibold">Birthdays</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Today's Birthdays Card */}
          {getTodaysBirthdays().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <Cake className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Today's Birthdays</h3>
                    <p className="text-gray-600">Wish them a wonderful day!</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowBirthdayModal(true)}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Birthday
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getTodaysBirthdays().map((person) => (
                  <div key={person.id} className="bg-white rounded-lg p-4 border border-pink-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {person.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{person.name}</h4>
                        <p className="text-sm text-gray-600">{person.role}</p>
                        <p className="text-xs text-gray-500">{person.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl">🎂</div>
                        <p className="text-xs text-gray-500">Age {person.age}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Birthday Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Birthday Management</h2>
                  <p className="text-gray-600 mt-1">Track and manage employee birthdays</p>
                </div>
                <Button
                  onClick={() => setShowBirthdayModal(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <Cake className="h-4 w-4 mr-2" />
                  Add Birthday
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {birthdays.map((birthday) => (
                  <div key={birthday.id} className="bg-white rounded-lg border border-pink-200 p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {birthday.personName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{birthday.personName}</h3>
                        <p className="text-sm text-gray-600">{birthday.role}</p>
                        <p className="text-xs text-gray-500">{birthday.department}</p>
                      </div>
                    </div>
                    
                    <div className="bg-pink-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-pink-800">Birthday</p>
                          <p className="text-lg font-bold text-pink-900">{formatDate(birthday.birthday)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-pink-800">Age</p>
                          <p className="text-lg font-bold text-pink-900">{birthday.age}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Birthday Assignment Modal */}
          <AnimatePresence>
            {showBirthdayModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={closeModals}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Add Birthday</h3>
                      <p className="text-gray-600 text-sm mt-1">Assign birthday to an employee or PM</p>
                    </div>
                    <button
                      onClick={closeModals}
                      className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Person</label>
                      <Combobox
                        options={getPersonOptions()}
                        value={birthdayData.personId}
                        onChange={(value) => {
                          const selectedOption = getPersonOptions().find(opt => opt.value === value)
                          setBirthdayData({
                            ...birthdayData,
                            personId: value,
                            personType: selectedOption?.data?.type || 'employee'
                          })
                        }}
                        placeholder="Choose employee or PM..."
                        className="w-full h-12 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Birthday</label>
                      <input
                        type="date"
                        value={birthdayData.birthday}
                        onChange={(e) => setBirthdayData({...birthdayData, birthday: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={closeModals}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBirthdayAssignment}
                      disabled={!birthdayData.personId || !birthdayData.birthday}
                      className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Birthday
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Admin_hr_management
