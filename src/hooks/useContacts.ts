/**
 * useContacts Hook
 * Hook for managing contacts data
 */

import {useState, useEffect, useCallback} from 'react';
import {Contact} from '../models';
import ContactService from '../services/database/ContactService';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allContacts = await ContactService.getAllContacts();
      setContacts(allContacts);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const refresh = useCallback(() => {
    return loadContacts();
  }, [loadContacts]);

  const deleteContact = useCallback(
    async (contactId: string) => {
      try {
        await ContactService.deleteContact(contactId);
        await refresh();
      } catch (err) {
        setError(err as Error);
      }
    },
    [refresh],
  );

  const toggleFavorite = useCallback(
    async (contactId: string) => {
      try {
        await ContactService.toggleFavorite(contactId);
        await refresh();
      } catch (err) {
        setError(err as Error);
      }
    },
    [refresh],
  );

  return {
    contacts,
    loading,
    error,
    refresh,
    deleteContact,
    toggleFavorite,
  };
};
