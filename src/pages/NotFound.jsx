import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Home className="w-5 h-5" />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  )
}
