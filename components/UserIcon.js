// components/UserIcon.js
// import Dropdown from './Dropdown'; // You need to create a Dropdown component
import { UserContext } from './UserContext';
import { useContext,useState,useEffect,useRef } from 'react';
import  { useRouter } from 'next/router';
import { DropdownContext } from './DropdownContext';
import { ProductsContext } from './ProductsContexts';

export default function UserIcon(){
  const { dropdownVisible, setDropdownVisible } = useContext(DropdownContext);
  const {SelectedProducts, setSelectedProducts} = useContext(ProductsContext);
  const { User, setUser } = useContext(UserContext);
  const router = useRouter();
  const [userPicture, setUserPicture] = useState(null);
  const [email, setEmail] = useState("");
  const userIconRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    setTimeout(()=>{
      setDropdownVisible(false);
    },3000);
  };
  

  const handleLogin = () => {
    setUser(null);
    router.push('/');
  }

  useEffect(() => {
    const fetchData = async () => {
      let userData = null;
      if (typeof window !== 'undefined') {
        userData = localStorage.getItem('User');
      }
      const parsedUser = JSON.parse(userData);
      setUserPicture(parsedUser?.data?.picture || null);
      setEmail(parsedUser?.data?.email || null);
      setIsAdmin(parsedUser?.data?.isAdmin || null)

    };

    fetchData();
  }, []);

  const handleLogout = () => {
    setSelectedProducts([]);
    setUser(null);
    router.push('/');
  };

  const handleIsAdmin=()=>{
    router.push('/adminPage');
  }

  const handleProfile = async () => {
    router.push('/profile');
  };

  const handleOrdersButton=()=>{
    router.push(`/orders?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="relative cursor-pointer px-3" ref={userIconRef} onClick={toggleDropdown}>
      {/* User Icon */}
      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-400 hover:border-blue-800 transition-all duration-300" >
        <img src={userPicture} alt='login' />
      </div>

      {/* Dropdown */}
      {dropdownVisible && (
         <div
         className="absolute top-10 right-2 bg-white border rounded shadow-md"
       >
          {/* UserProfile */}
          <div className="py-1 px-2 hover:bg-gray-100 cursor-pointer border-b">
            <button onClick={handleProfile}>Profile</button>
          </div>

          {/* Orders */}
          <div className="py-1 px-2 hover:bg-gray-100 cursor-pointer border-b">
            <button onClick={handleOrdersButton}>Orders</button>
          </div>

          {isAdmin && (
            <div className="py-1 px-2 hover:bg-gray-100 cursor-pointer border-b">
            <button onClick={handleIsAdmin}>Add_Item</button>
          </div>
          )}

          {/* Logout */}
          {(!User) ? (<div className="py-1 px-2 hover:bg-gray-100 cursor-pointer">
            <button onClick={handleLogin}>Login</button>
          </div>) : (<div className="py-1 px-2 hover:bg-gray-100 cursor-pointer">
            <button onClick={handleLogout}>Logout</button>
          </div>)}
       </div>
      )}
    </div>
  );
}
