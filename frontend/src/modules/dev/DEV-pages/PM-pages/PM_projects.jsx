import React from 'react'
import PM_navbar from '../../DEV-components/PM_navbar'
import PM_project_card from '../../DEV-components/PM_project_card'

const PM_projects = () => {
  const projects = [
    {
      id: 'p-001',
      name: 'Website Redesign',
      description: 'Complete overhaul of marketing site with new brand guidelines and CMS migration.',
      progress: 68,
      status: 'In Progress',
      client: 'Acme Corp',
      dueDate: '2025-10-30',
    },
    {
      id: 'p-002',
      name: 'Mobile App v2',
      description: 'Second major version including offline mode, push notifications, and analytics.',
      progress: 35,
      status: 'In Progress',
      client: 'Globex',
      accelerated: true,
      dueDate: '2025-12-12',
    },
    {
      id: 'p-003',
      name: 'Data Warehouse Setup',
      description: 'Migrate reporting to unified warehouse with dbt, Airflow, and Looker.',
      progress: 82,
      status: 'Completed',
      client: 'Initech',
      dueDate: '2025-10-15',
    },
    {
      id: 'p-004',
      name: 'Customer Portal',
      description: 'Build self-service portal for enterprise customers to manage subscriptions.',
      progress: 20,
      status: 'On Hold',
      client: 'Umbrella LLC',
      dueDate: '2026-01-15',
    },
    {
      id: 'p-005',
      name: 'Security Hardening',
      description: 'Company-wide security improvements, SSO rollout, and pentest remediations.',
      progress: 55,
      status: 'In Progress',
      client: 'Soylent',
      dueDate: '2025-11-25',
    },
    {
      id: 'p-006',
      name: 'Billing System Upgrade',
      description: 'Move to usage-based billing with tiered pricing and better invoicing.',
      progress: 12,
      status: 'Blocked',
      client: 'Stark Industries',
      dueDate: '2026-02-10',
    },
  ]

  const total = projects.length
  const completed = projects.filter(p => Number(p.progress) >= 100 || String(p.status).toLowerCase().includes('complete')).length
  const inProgress = projects.filter(p => String(p.status).toLowerCase().includes('progress')).length
  const atRisk = projects.filter(p => String(p.status).toLowerCase().includes('block') || Number(p.progress) < 25).length
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / Math.max(1, total))

  return (
    <div>
      <PM_navbar />
      <div className="pt-16 lg:pt-16 pb-20 lg:pb-0 min-h-screen bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          

          {/* Project Management CTA Card */}
          <div className="mt-0 mb-6">
            <div className="bg-teal-50 rounded-xl shadow-sm border border-teal-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Manage your projects</h2>
                  <p className="text-sm text-gray-600">Create and track project progress</p>
                </div>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:from-teal-600 hover:to-teal-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-semibold">Create</span>
                </button>
              </div>
            </div>
          </div>

          {/* Project Status Tiles */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              {/* All - Highlighted */}
              <div className="bg-teal-500 rounded-xl p-6 text-center cursor-pointer hover:bg-teal-600 transition-colors duration-200">
                <div className="text-white text-sm font-medium mb-1">All</div>
                <div className="text-white text-3xl font-bold">{total}</div>
              </div>
              
              {/* Active */}
              <div className="bg-white rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200">
                <div className="text-gray-900 text-sm font-medium mb-1">Active</div>
                <div className="text-gray-900 text-3xl font-bold">{inProgress}</div>
              </div>
              
              {/* Planning */}
              <div className="bg-white rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200">
                <div className="text-gray-900 text-sm font-medium mb-1">Planning</div>
                <div className="text-gray-900 text-3xl font-bold">{atRisk}</div>
              </div>
              
              {/* Done */}
              <div className="bg-white rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200">
                <div className="text-gray-900 text-sm font-medium mb-1">Done</div>
                <div className="text-gray-900 text-3xl font-bold">{completed}</div>
              </div>
            </div>
          </div>

          {/* Projects grid */}
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-black">All Projects</h2>
              <div className="text-sm text-black">Showing {total} items</div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <PM_project_card
                  key={project.id}
                  name={project.name}
                  description={project.description}
                  progress={project.progress}
                  status={project.status}
                  client={project.client}
                  accelerated={project.accelerated}
                  dueDate={project.dueDate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PM_projects
