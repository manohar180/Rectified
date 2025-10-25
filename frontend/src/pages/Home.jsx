import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useBusiness } from '../contexts/BusinessContext'
import BusinessCard from '../components/BusinessCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Filter, SortAsc, SortDesc, Search, MapPin, Star, TrendingUp, Clock } from 'lucide-react'

const Home = () => {
  const { businesses, loading, fetchBusinesses } = useBusiness()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    keyword: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minRating: searchParams.get('minRating') || '',
    sortBy: 'createdAt',
    order: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchBusinesses(filters)
  }, [filters])

  // Update filters when URL search params change
  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam !== null && searchParam !== filters.keyword) {
      setFilters(prev => ({ ...prev, keyword: searchParam }))
    }
  }, [searchParams])

  // Update search params when filters change (only for user-facing filters)
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.keyword) params.set('search', filters.keyword)
    if (filters.category) params.set('category', filters.category)
    if (filters.minRating) params.set('minRating', filters.minRating)
    // Don't include sortBy and order in URL unless they're different from defaults
    if (filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy)
    if (filters.order !== 'desc') params.set('order', filters.order)
    
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      minRating: '',
      sortBy: 'createdAt',
      order: 'desc'
    })
    setSearchParams({})
  }

  const categories = [
    'Restaurant', 'Retail', 'Service', 'Technology', 'Healthcare',
    'Education', 'Entertainment', 'Automotive', 'Real Estate', 'Other'
  ]

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Discover Amazing <span className="text-gradient">Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Find, explore, and connect with local businesses in your area. 
            Rate, review, and save your favorites.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary-500" />
              <span>Local Businesses</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              <span>Community Rated</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              <span>Always Growing</span>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="card p-6 mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Find Your Perfect Business</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    placeholder="Search businesses..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Rating</option>
                  <option value="1">1+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="input-field flex-1"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="name">Name</option>
                    <option value="averageRating">Rating</option>
                    <option value="likes">Likes</option>
                  </select>
                  <button
                    onClick={() => handleFilterChange('order', filters.order === 'desc' ? 'asc' : 'desc')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {filters.order === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {businesses.length} {businesses.length === 1 ? 'Business' : 'Businesses'} Found
          </h2>
          {businesses.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>Updated just now</span>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No businesses found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              We couldn't find any businesses matching your criteria. Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business, index) => (
              <div 
                key={business._id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home


