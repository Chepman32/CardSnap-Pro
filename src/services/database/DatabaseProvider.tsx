/**
 * Database Provider
 * WatermelonDB setup and provider
 */

import React, {createContext, useContext, useEffect, useState} from 'react';
import {database} from './database';
import {DatabaseProvider as WatermelonProvider} from '@nozbe/watermelondb/react';

interface DatabaseContextType {
  isReady: boolean;
  database: typeof database;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isReady: false,
  database,
});

export const useDatabaseContext = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      // Database is already initialized in database.ts
      // Just need to wait for it to be ready
      await database.write(async () => {
        // Simple test query to ensure database is ready
        await database.get('contacts').query().fetch();
      });
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Set ready anyway to allow app to load
      setIsReady(true);
    }
  };

  return (
    <WatermelonProvider database={database}>
      <DatabaseContext.Provider value={{isReady, database}}>
        {children}
      </DatabaseContext.Provider>
    </WatermelonProvider>
  );
};
