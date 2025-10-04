import React from 'react'
import Employee_navbar from '../../DEV-components/Employee_navbar'

const Employee_leaderboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:bg-gray-50">
      <Employee_navbar />
      <main className="pt-16 pb-24 md:pt-20 md:pb-8">
        <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Employee Leaderboard</h1>
          <p className="text-gray-600 mt-2">Coming soon.</p>
        </div>
      </main>
    </div>
  )
}

export default Employee_leaderboard

