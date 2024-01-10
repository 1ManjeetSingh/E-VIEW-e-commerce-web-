import { createContext } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export const DropdownContext = createContext({});

export function DropdownContextProvider({ children }) {
  const [dropdownVisible, setDropdownVisible] = useLocalStorageState('DropdownVisible', null);
  // You can include additional user-related state or functions as needed
  return (
    <DropdownContext.Provider value={{dropdownVisible, setDropdownVisible}}>
      {children}
    </DropdownContext.Provider>
  );
}
