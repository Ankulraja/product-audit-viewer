import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// API Base URL - uses environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const SheetViewer = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sheetType = searchParams.get('type')
  const scrollContainerRef = useRef(null)
  
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [modalData, setModalData] = useState(null)
  const [showRequirementModal, setShowRequirementModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [jumpToPage, setJumpToPage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/product-audit`)
        const result = await response.json()
        
        if (result.success) {
          setData(result.data)
          setFilteredData(result.data)
        } else {
          setError(result.error || 'Failed to fetch data')
        }
      } catch (err) {
        setError('Failed to connect to server. Please make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sheetType])

  // Filter data based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(data)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = data.filter(item => 
        item.query?.toLowerCase().includes(query) ||
        item.query_agent_response?.core_product?.toLowerCase().includes(query) ||
        item.query_agent_response?.user_requirement?.toLowerCase().includes(query)
      )
      setFilteredData(filtered)
    }
    setCurrentIndex(0)
  }, [searchQuery, data])

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
    setModalData(null)
    setShowRequirementModal(false)
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(filteredData.length - 1, prev + 1))
    setModalData(null)
    setShowRequirementModal(false)
  }

  const handleJumpToPage = (e) => {
    e.preventDefault()
    const pageNum = parseInt(jumpToPage)
    if (pageNum >= 1 && pageNum <= filteredData.length) {
      setCurrentIndex(pageNum - 1)
      setModalData(null)
      setShowRequirementModal(false)
    }
    setJumpToPage('')
  }

  const openSpecModal = (result) => {
    setModalData(result)
  }

  const closeModal = () => {
    setModalData(null)
  }

  const getRelevanceBadgeStyle = (relevance) => {
    const lower = (relevance || '').toLowerCase()
    if (lower.includes('highly relevant')) {
      return 'bg-green-600 text-white'
    } else if (lower.includes('relevant')) {
      return 'bg-blue-600 text-white'
    } else if (lower.includes('not relevant') || lower.includes('irrelevant')) {
      return 'bg-red-600 text-white'
    }
    return 'bg-gray-600 text-white'
  }

  const currentGroup = filteredData[currentIndex]

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm">Loading data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-md text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-2">Error Loading Data</h3>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!currentGroup) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">No data available</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-2 sm:px-4 py-1.5 sm:py-2 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
          {/* Left - Back Button */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden xs:inline sm:inline">Back</span>
          </button>
          
          {/* Center - Title */}
          <h1 className="text-white font-medium text-xs sm:text-sm order-first sm:order-none w-full sm:w-auto text-center sm:text-left">Product Audit</h1>
          
          {/* Right - Navigation */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0 || filteredData.length === 0}
              className="p-1 sm:px-2 sm:py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs sm:text-sm rounded transition-colors flex items-center gap-0.5"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden md:inline">Prev</span>
            </button>
            <span className="text-slate-400 text-xs sm:text-sm px-1">
              {filteredData.length > 0 ? `${currentIndex + 1} / ${filteredData.length}` : '0 / 0'}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === filteredData.length - 1 || filteredData.length === 0}
              className="p-1 sm:px-2 sm:py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs sm:text-sm rounded transition-colors flex items-center gap-0.5"
            >
              <span className="hidden md:inline">Next</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Search and Jump - Full width on mobile */}
          <div className="flex items-center gap-2 w-full mt-1 sm:mt-0 sm:w-auto sm:flex-1 sm:max-w-lg sm:mx-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by query, core product..."
                className="w-full pl-7 sm:pl-8 pr-7 py-1 sm:py-1.5 bg-slate-700/50 border border-slate-600 rounded text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Jump to Page */}
            <form onSubmit={handleJumpToPage} className="flex items-center gap-1">
              <span className="text-slate-500 text-xs hidden lg:inline">Go to:</span>
              <input
                type="number"
                min="1"
                max={filteredData.length}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                placeholder="#"
                className="w-12 sm:w-14 px-1.5 py-1 sm:py-1.5 bg-slate-700/50 border border-slate-600 rounded text-white text-xs sm:text-sm text-center placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > filteredData.length}
                className="px-2 py-1 sm:py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs sm:text-sm rounded transition-colors"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* No Results State */}
        {filteredData.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-slate-400 text-lg font-medium mb-2">No results found</h3>
              <p className="text-slate-500 text-sm mb-4">
                No queries match "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Query Info Section */}
        {currentGroup && (
        <>
        <div className="bg-slate-850 border-b border-slate-700 px-2 sm:px-4 py-2 flex-shrink-0" style={{ backgroundColor: '#1a2332' }}>
          <div className="max-w-screen-2xl mx-auto">
            {/* Search Keyword */}
            <div className="mb-1.5">
              <span className="text-slate-500 text-[10px] uppercase tracking-wide">Search Keyword</span>
              <h2 className="text-white text-sm sm:text-base font-semibold">{currentGroup.query}</h2>
            </div>

            {/* Query Agent Response */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
              <div className="bg-slate-800/50 rounded p-1.5 sm:p-2 relative">
                <span className="text-slate-500 text-[10px] block">User Requirement</span>
                <p className="text-slate-200 text-xs line-clamp-1">
                  {currentGroup.query_agent_response?.user_requirement || 'N/A'}
                </p>
                {currentGroup.query_agent_response?.user_requirement && 
                 currentGroup.query_agent_response.user_requirement.length > 40 && (
                  <button 
                    onClick={() => setShowRequirementModal(true)}
                    className="text-blue-400 hover:text-blue-300 text-[10px] transition-colors"
                  >
                    more...
                  </button>
                )}
              </div>
              <div className="bg-slate-800/50 rounded p-1.5 sm:p-2">
                <span className="text-slate-500 text-[10px] block">Query Type</span>
                <span className="inline-block px-1.5 py-0.5 bg-blue-600/30 text-blue-400 rounded text-[10px] sm:text-xs font-medium">
                  {currentGroup.query_agent_response?.query_type || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded p-1.5 sm:p-2">
                <span className="text-slate-500 text-[10px] block">Core Product</span>
                <span className="inline-block px-1.5 py-0.5 bg-emerald-600/30 text-emerald-400 rounded text-[10px] sm:text-xs font-medium">
                  {currentGroup.query_agent_response?.core_product || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded p-1.5 sm:p-2">
                <span className="text-slate-500 text-[10px] block">Predicted Attributes</span>
                <div className="flex flex-wrap gap-0.5">
                  {currentGroup.query_agent_response?.predicted_attributes && 
                   Object.keys(currentGroup.query_agent_response.predicted_attributes).length > 0 ? (
                    Object.entries(currentGroup.query_agent_response.predicted_attributes).slice(0, 3).map(([key, value], i) => (
                      <span key={i} className="px-1 py-0.5 bg-amber-600/20 text-amber-400 rounded text-[10px]">
                        {key}: {value}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-[10px]">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section Header */}
        <div className="bg-slate-800/50 border-b border-slate-700 px-2 sm:px-4 py-1 flex-shrink-0">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            <h3 className="text-slate-300 text-xs sm:text-sm font-medium flex items-center gap-2">
              Product Agent's Response
              <div className="flex items-center gap-1">
                <button className="p-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </h3>
            <span className="text-slate-500 text-[10px] sm:text-xs">
              {currentGroup.product_agent_response?.total_results || 0} products
            </span>
          </div>
        </div>

        {/* Products Horizontal Scroll */}
        <div className="flex-1 overflow-hidden px-2 sm:px-4 py-2">
          <div 
            ref={scrollContainerRef}
            className="max-w-screen-2xl mx-auto h-full overflow-x-auto overflow-y-hidden scrollbar-thin"
            style={{ scrollbarColor: '#475569 #1e293b' }}
          >
            <div className="flex gap-3 h-full pb-2" style={{ minWidth: 'max-content' }}>
              {currentGroup.product_agent_response?.results?.map((result, resultIndex) => {
                return (
                  <div 
                    key={resultIndex}
                    className="bg-slate-800 rounded-lg border border-slate-700 flex-shrink-0 flex flex-col w-56 sm:w-64 md:w-72"
                    style={{ height: 'calc(100% - 8px)' }}
                  >
                    {/* Card Header */}
                    <div className="bg-slate-700/50 px-2 py-1.5 flex items-center justify-between border-b border-slate-700 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] sm:text-xs font-medium rounded">
                          Result {result.result_number || resultIndex + 1}
                        </span>
                        <span className="text-slate-400 text-[10px] sm:text-xs">ID: {result.display_id || 'N/A'}</span>
                      </div>
                      {/* Spec Button in Header */}
                      <button 
                        onClick={() => openSpecModal(result)}
                        className="px-1.5 py-0.5 text-[10px] sm:text-xs font-medium rounded border border-slate-500 text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        Spec
                      </button>
                    </div>

                    {/* Product Image */}
                    <div className="relative h-36 sm:h-44 md:h-48 bg-slate-700/30 flex-shrink-0 overflow-hidden">
                      {result.image ? (
                        <img 
                          src={result.image} 
                          alt={result.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className={`absolute inset-0 ${result.image ? 'hidden' : 'flex'} items-center justify-center bg-slate-700/50`}
                      >
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-700"></div>

                    {/* Product Info */}
                    <div className="p-2 sm:p-2.5 flex-1 overflow-y-auto flex flex-col">
                      <h4 className="text-white font-medium text-xs sm:text-sm line-clamp-2 mb-1">
                        {result.title || 'Untitled Product'}
                      </h4>

                      {/* Divider */}
                      <div className="border-t border-slate-700/50 my-1"></div>

                      {/* All Relevance Badges */}
                      <div className="space-y-1.5 mt-auto">
                        {/* Manual Relevance */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-500 text-[10px] sm:text-xs min-w-[55px] sm:min-w-[70px]">Manual:</span>
                          <span className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded ${getRelevanceBadgeStyle(result.relevance || 'N/A')}`}>
                            {result.relevance || 'N/A'}
                          </span>
                        </div>
                        
                        {/* Critical Relevance */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-500 text-[10px] sm:text-xs min-w-[55px] sm:min-w-[70px]">Critical:</span>
                          <span className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded ${getRelevanceBadgeStyle(result.critical_relevance || 'N/A')}`}>
                            {result.critical_relevance || 'N/A'}
                          </span>
                        </div>
                        
                        {/* Super Audit - show if available */}
                        {(result.super_audit_relevance || result.superaudit_relevance) && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-slate-500 text-[10px] sm:text-xs min-w-[55px] sm:min-w-[70px]">SuperAudit:</span>
                            <span className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded ${getRelevanceBadgeStyle(result.super_audit_relevance || result.superaudit_relevance)}`}>
                              {result.super_audit_relevance || result.superaudit_relevance}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      {/* User Requirement Modal */}
      {showRequirementModal && currentGroup && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowRequirementModal(false)}
        >
          <div 
            className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-700/50 px-4 py-3 flex items-center justify-between border-b border-slate-700 flex-shrink-0">
              <h3 className="text-white font-medium text-sm">User Requirement</h3>
              <button 
                onClick={() => setShowRequirementModal(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {currentGroup.query_agent_response?.user_requirement || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Specification Modal */}
      {modalData && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-700/50 px-4 py-3 flex items-center justify-between border-b border-slate-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                  Result {modalData.result_number || ''}
                </span>
                <span className="text-slate-400 text-sm font-mono">
                  ID: {modalData.display_id || 'N/A'}
                </span>
              </div>
              <button 
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Product Image */}
                <div className="w-full sm:w-48 h-40 sm:h-48 bg-slate-700/30 rounded-lg overflow-hidden flex-shrink-0">
                  {modalData.image ? (
                    <img 
                      src={modalData.image} 
                      alt={modalData.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full ${modalData.image ? 'hidden' : 'flex'} items-center justify-center bg-slate-700/50`}
                  >
                    <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Product Title & Basic Info */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-3">
                    {modalData.title || 'Untitled Product'}
                  </h3>
                  <div className="space-y-2">
                    {modalData.relevance && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">Manual Relevance:</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getRelevanceBadgeStyle(modalData.relevance)}`}>
                          {modalData.relevance}
                        </span>
                      </div>
                    )}
                    {modalData.critical_relevance && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">Critical Relevance:</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getRelevanceBadgeStyle(modalData.critical_relevance)}`}>
                          {modalData.critical_relevance}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {modalData.specifications && (
                <div className="mb-4">
                  <h4 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Specifications
                  </h4>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{modalData.specifications}</p>
                  </div>
                </div>
              )}

              {/* Relevance Reasoning */}
              {modalData.relevance_reasoning && (
                <div className="mb-4">
                  <h4 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Relevance Reasoning
                  </h4>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-slate-300 text-sm">{modalData.relevance_reasoning}</p>
                  </div>
                </div>
              )}

              {/* Critical Relevance Reasoning */}
              {modalData.critical_relevance_reasoning && (
                <div className="mb-4">
                  <h4 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Critical Relevance Reasoning
                  </h4>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-slate-300 text-sm">{modalData.critical_relevance_reasoning}</p>
                  </div>
                </div>
              )}

              {/* View Product Link */}
              {modalData.search_page_url && (
                <a 
                  href={modalData.search_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors"
                >
                  View Product Page
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SheetViewer
