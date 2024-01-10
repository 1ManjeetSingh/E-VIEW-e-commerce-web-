import { useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  // const [isExist, setIsExist] = useState(false);
  const [ShowPassword, setShowPassword] = useState(false);
  
  const redirectToLogin = () => {
    router.push('/');
  };

  const handleRegister = async () => {
    if(!name || !email || !password || name==="" || email==="" || password===""){
      alert("Please fill all Sections")
      return;
    }
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setIsVisible(true);
        setTimeout(() => {
          router.push('/');
          setIsVisible(false);
        }, 1000);
      } else {
        if (response.status === 400) {
          // setIsExist(true);
          // setTimeout(() => {
          //   setIsExist(false);
          // }, 2000);
        }
        console.error('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };

  return (
    <>
      {isVisible && (
        <div className={`block fixed top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-green-100 shadow-md z-50 rounded-full`}>
          ✅ Signup successful
        </div>
      )}
      {/* {isExist && (
        <div className={`block fixed top-8 left-1/2 font-bold text-red-700 transform -translate-x-1/2 -translate-y-1/2 p-2 shadow-md z-50 rounded-xl`}>
          User with this email already exists!
        </div>
      )} */}
      <div className="flex justify-center items-center bg-gray-100 h-screen">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <div className="flex justify-center items-center text-2xl font-bold w-full pb-10">Register</div>
          <form className="space-y-4">
          <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-gray-200 rounded"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-200 rounded"
                placeholder="xyz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password:
              </label>
              <div className="flex">
              <input
                type={ShowPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 border border-gray-200 rounded"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="flex items-center cursor-pointer"
                onClick={() => setShowPassword(!ShowPassword)}
              >
                {ShowPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </span>
              </div>
            </div>
            <button
              type="button"
              className="w-full bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600 transition duration-300"
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <span onClick={redirectToLogin} className="text-indigo-500 cursor-pointer">
                Log in here.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
