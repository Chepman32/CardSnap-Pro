/**
 * useSearch Hook
 * Hook for search functionality
 */

import {useState, useCallback, useEffect} from 'react';
import {Contact} from '../models';
import SearchService from '../services/search/SearchService';
import {SearchFilters} from '../types';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters | null>(null);
  const [results, setResults] = useState<Contact[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(
    async (searchQuery: string, searchFilters?: SearchFilters) => {
      try {
        setLoading(true);
        const contacts = await SearchService.searchContacts(
          searchQuery,
          searchFilters || filters || undefined,
        );
        setResults(contacts);

        // Save to history
        if (searchQuery.trim()) {
          await SearchService.saveSearchHistory(
            searchQuery,
            searchFilters || filters,
            contacts.length,
          );
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const results = await SearchService.getSearchSuggestions(searchQuery);
    setSuggestions(results);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        search(query);
        getSuggestions(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, getSuggestions]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const updateFilters = useCallback((newFilters: SearchFilters | null) => {
    setFilters(newFilters);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters(null);
    setResults([]);
    setSuggestions([]);
  }, []);

  return {
    query,
    filters,
    results,
    suggestions,
    loading,
    updateQuery,
    updateFilters,
    search,
    clearSearch,
  };
};
