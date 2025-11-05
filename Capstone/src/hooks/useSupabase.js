import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for data fetching with Supabase
export const useSupabaseQuery = (table, query = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let supabaseQuery = supabase?.from(table);
        
        // Apply select if provided
        if (query?.select) {
          supabaseQuery = supabaseQuery?.select(query?.select);
        } else {
          supabaseQuery = supabaseQuery?.select('*');
        }

        // Apply filters if provided
        if (query?.filters) {
          query?.filters?.forEach(filter => {
            const { column, operator, value } = filter;
            supabaseQuery = supabaseQuery?.[operator](column, value);
          });
        }

        // Apply ordering if provided
        if (query?.orderBy) {
          const { column, ascending = true } = query?.orderBy;
          supabaseQuery = supabaseQuery?.order(column, { ascending });
        }

        // Apply limit if provided
        if (query?.limit) {
          supabaseQuery = supabaseQuery?.limit(query?.limit);
        }

        const { data: result, error: queryError } = await supabaseQuery;

        if (queryError) throw queryError;
        
        setData(result || []);
      } catch (err) {
        setError(err?.message || 'An error occurred');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(query)]);

  return { data, loading, error, refetch: () => fetchData() };
};

// Custom hook for real-time subscriptions
export const useSupabaseSubscription = (table, callback) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase?.channel(`${table}-changes`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        callback
      )?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [table, callback, user]);
};

// Custom hook for CRUD operations
export const useSupabaseMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const insert = async (table, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error: insertError } = await supabase?.from(table)?.insert(data)?.select();
      
      if (insertError) throw insertError;
      return { data: result, error: null };
    } catch (err) {
      const errorMessage = err?.message || 'Insert failed';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const update = async (table, data, filters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase?.from(table)?.update(data);
      
      // Apply filters for update
      if (filters) {
        filters?.forEach(filter => {
          const { column, operator, value } = filter;
          query = query?.[operator](column, value);
        });
      }

      const { data: result, error: updateError } = await query?.select();
      
      if (updateError) throw updateError;
      return { data: result, error: null };
    } catch (err) {
      const errorMessage = err?.message || 'Update failed';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const remove = async (table, filters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase?.from(table);
      
      // Apply filters for delete
      if (filters) {
        filters?.forEach(filter => {
          const { column, operator, value } = filter;
          query = query?.[operator](column, value);
        });
      }

      const { error: deleteError } = await query?.delete();
      
      if (deleteError) throw deleteError;
      return { error: null };
    } catch (err) {
      const errorMessage = err?.message || 'Delete failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { insert, update, remove, loading, error };
};