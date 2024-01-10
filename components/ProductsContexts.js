import { createContext } from "react";
import useLocalStorageState from "use-local-storage-state";

export const ProductsContext = createContext({});

export function ProductsContextProvider({children}) {
    const [SelectedProducts, setSelectedProducts] = useLocalStorageState('cart',{defaultValue:[]});
    
    return (
        <ProductsContext.Provider value={{SelectedProducts,setSelectedProducts}}>{children}</ProductsContext.Provider>
    )
}