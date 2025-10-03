import React from 'react'
import PM_navbar from '../../DEV-components/PM_navbar'

const PM_tasks = () => {
  return (
    <div>
      <PM_navbar />
      <div className="pt-16 lg:pt-16 pb-20 lg:pb-0 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        </div>
      </div>
    </div>
  )
}

export default PM_tasks
