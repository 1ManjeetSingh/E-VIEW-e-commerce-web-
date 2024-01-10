import '@/styles/globals.css';
import { ProductsContextProvider } from '@/components/ProductsContexts';
import { UserContextProvider } from '../components/UserContext';
import { DropdownContextProvider } from '@/components/DropdownContext';
import { OrdersContextProvider } from '@/components/OrdersContext';
import { EmailContextProvider } from '@/components/EmailContext';

export default function App({ Component, pageProps }) {
  return (
    <EmailContextProvider>
    <OrdersContextProvider>
    <DropdownContextProvider>
    <UserContextProvider>
      <ProductsContextProvider>
        <Component {...pageProps} />
      </ProductsContextProvider>
    </UserContextProvider>
    </DropdownContextProvider>
    </OrdersContextProvider>
    </EmailContextProvider>
  );
}
