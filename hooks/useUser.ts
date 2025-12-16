import { useState, useEffect } from 'react';

export function useUser() {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve user ID from localStorage
    let id = localStorage.getItem('userId');
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', id);
    }
    setUserId(id);
  }, []);

  return { userId };
}
