import { createContext } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [User, setUser] = useLocalStorageState('User', null);
  // You can include additional user-related state or functions as needed
  return (
    <UserContext.Provider value={{ User, setUser}}>
      {children}
    </UserContext.Provider>
  );
}
