import { createContext } from "react";
import useLocalStorageState from "use-local-storage-state";

export const OrdersContext = createContext({});

export function OrdersContextProvider({children}) {
    const [Orders, setOrders] = useLocalStorageState('orders',{defaultValue:[]});
    
    return (
        <OrdersContext.Provider value={{Orders, setOrders}}>{children}</OrdersContext.Provider>
    )
}