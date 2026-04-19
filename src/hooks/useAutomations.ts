import { useState, useEffect } from 'react';
import { AutomationAction } from '../types/workflow';
import { fetchAutomations } from '../api/mockApi';

export const useAutomations = () => {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchAutomations()
      .then((data) => {
        if (isMounted) {
          setActions(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError('Failed to load automations');
          setIsLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  return { actions, isLoading, error };
};
