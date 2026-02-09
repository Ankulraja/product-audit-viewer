import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SheetSelector = () => {
  const navigate = useNavigate()
  const [selectedSheet, setSelectedSheet] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sheetOptions = [
    { value: 'product-audit', label: 'Product-Audit' }
  ]

  const handleSelect = (option) => {
    setSelectedSheet(option.value)
    setIsOpen(false)
  }

  const handleViewSheet = () => {
    if (selectedSheet) {
      navigate(`/sheet-viewer?type=${selectedSheet}`)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedLabel = sheetOptions.find(opt => opt.value === selectedSheet)?.label

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
      <label className="block text-white text-lg font-medium mb-3">
        Which sheet would you like to see?
      </label>
      
      {/* Custom Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer text-left flex items-center justify-between transition-all duration-200 hover:bg-white/25"
        >
          <span className={selectedSheet ? 'text-white' : 'text-white/60'}>
            {selectedLabel || 'Select a sheet...'}
          </span>
          <svg
            className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
            {sheetOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left text-lg transition-all duration-200 flex items-center gap-3
                  ${selectedSheet === option.value 
                    ? 'bg-purple-600/50 text-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {selectedSheet === option.value && (
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={selectedSheet === option.value ? '' : 'ml-8'}>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedSheet && (
        <div className="mt-6">
          <button 
            onClick={handleViewSheet}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            View Sheet
          </button>
        </div>
      )}
    </div>
  )
}

export default SheetSelector
