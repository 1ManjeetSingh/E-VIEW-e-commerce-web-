import { createContext } from "react";
import useLocalStorageState from "use-local-storage-state";

export const EmailContext = createContext({});

export function EmailContextProvider({children}) {
    const [email, setEmail] = useLocalStorageState('email',{defaultValue:''});
    
    return (
        <EmailContext.Provider value={{email, setEmail}}>{children}</EmailContext.Provider>
    )
}