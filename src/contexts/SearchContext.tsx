'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { Product } from '@/lib/types'

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: Product[]
  isSearching: boolean
  showMobileSearch: boolean
  setShowMobileSearch: (show: boolean) => void
}


interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: Product[]
  isSearching: boolean
  showMobileSearch: boolean
  setShowMobileSearch: (show: boolean) => void
  showResults: boolean
  setShowResults: (show: boolean) => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }, [])

  const fetchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setSearchResults(data.products || [])
      setShowResults(true)
    } catch (error) {
      console.error('Error searching products:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, fetchResults])

  useEffect(() => {
    if (!showMobileSearch) {
      clearSearch()
    }
  }, [showMobileSearch, clearSearch])

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      showMobileSearch,
      setShowMobileSearch,
      showResults,
      setShowResults,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}