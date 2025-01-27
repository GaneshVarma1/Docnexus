import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { useDebounce } from './useDebounce';

type Doctor = Database['public']['Tables']['doctors']['Row'];

interface FilterState {
  searchTerms: Record<string, string>;
  selectedValues: Record<string, string[]>;
  numberRanges: Record<string, { min: number; max: number }>;
}

const ITEMS_PER_PAGE = 20;

export function useDoctors(filters: FilterState) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const prevFilters = useRef<string>('');
  
  // Debounce filter changes to prevent too many requests
  const debouncedFilters = useDebounce(filters, 300);

  const fetchDoctors = useCallback(async (isLoadMore = false) => {
    try {
      const currentFilters = JSON.stringify(debouncedFilters);
      
      // Reset if filters changed
      if (prevFilters.current !== currentFilters && !isLoadMore) {
        setDoctors([]);
        setPage(0);
        setHasMore(true);
      }
      
      prevFilters.current = currentFilters;
      
      if (!hasMore && isLoadMore) return;
      
      setLoading(true);
      
      let query = supabase
        .from('doctors')
        .select('*')
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

      // Apply filters
      if (debouncedFilters.selectedValues['states']?.length > 0) {
        query = query.in('state', debouncedFilters.selectedValues['states']);
      }

      if (debouncedFilters.selectedValues['cities']?.length > 0) {
        query = query.in('city', debouncedFilters.selectedValues['cities']);
      }

      if (debouncedFilters.selectedValues['specialty']?.length > 0) {
        const specialtyConditions = debouncedFilters.selectedValues['specialty'].map(
          specialty => `specialty.ilike.%${specialty}%`
        );
        query = query.or(specialtyConditions.join(','));
      }

      if (debouncedFilters.searchTerms['name']) {
        query = query.ilike('name', `%${debouncedFilters.searchTerms['name']}%`);
      }

      if (debouncedFilters.searchTerms['npi_number']) {
        query = query.ilike('npi_number', `%${debouncedFilters.searchTerms['npi_number']}%`);
      }

      // Apply number range filters
      if (debouncedFilters.numberRanges['num_publications']) {
        const { min, max } = debouncedFilters.numberRanges['num_publications'];
        query = query
          .gte('num_publications', min)
          .lte('num_publications', max);
      }

      if (debouncedFilters.numberRanges['num_clinical_trials']) {
        const { min, max } = debouncedFilters.numberRanges['num_clinical_trials'];
        query = query
          .gte('num_clinical_trials', min)
          .lte('num_clinical_trials', max);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Update state based on whether we're loading more or resetting
      setDoctors(prev => isLoadMore ? [...prev, ...(data || [])] : (data || []));
      setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
      setPage(prev => isLoadMore ? prev + 1 : 0);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, page, hasMore]);

  // Initial fetch and filter changes
  useEffect(() => {
    fetchDoctors();
  }, [debouncedFilters]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchDoctors(true);
    }
  }, [loading, hasMore, fetchDoctors]);

  return { doctors, loading, error, hasMore, loadMore };
}