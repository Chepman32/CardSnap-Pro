/**
 * Database Provider
 * WatermelonDB setup and provider
 */

import React, {createContext, useContext, useEffect, useState} from 'react';

interface DatabaseContextType {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isReady: false,
});

export const useDatabaseContext = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      // Initialize WatermelonDB here
      // Setup models, schema, and migrations
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  };

  return (
    <DatabaseContext.Provider value={{isReady}}>
      {children}
    </DatabaseContext.Provider>
  );
};
