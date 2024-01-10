import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@/components/UserContext";
import { ProductsContext } from "@/components/ProductsContexts";
import { OrdersContext } from "@/components/OrdersContext";
import { EmailContext } from "@/components/EmailContext";


export default function Login(){
  const {User,setUser} = useContext(UserContext);
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);
  const {SelectedProducts, setSelectedProducts} = useContext(ProductsContext)
  const {Orders, setOrders} = useContext(OrdersContext);
  const {setEmail} = useContext(EmailContext);

  
  const redirectToForgotPassword = () => {
    router.push('/forgot-password');
  }
  const redirectToSignup = () => {
    router.push('/register');
  }
  const handleLogin = async () => {
    if (!email || !password || email==="" || password==="") {
      alert("Please enter both email and password");
      return;
    }

    try {
      // Call your authentication endpoint (for example, a Next.js API route)
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedProducts(data.cart);
        setOrders(data.orders);
        setUser({data});
        setEmail(email);
        router.push(`/homepage?email=${encodeURIComponent(email)}`);
        
      } else {
        // If login fails, you can handle errors accordingly
        const data = await response.json();
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 h-screen">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center items-center text-2xl font-bold w-full pb-10">Login</div>  
          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-200 rounded"
                placeholder="xyz@gmail.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
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
              onClick={handleLogin}
            >
              Log In
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Dont have an account?{" "}
              <span onClick={redirectToSignup} className="text-indigo-500 cursor-pointer">
               Sign up here.
              </span>
            </p>
          </div>
          <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
        <span onClick={redirectToForgotPassword} className="text-indigo-500 cursor-pointer">
               Forgot your password?
              </span>
        </p>
      </div>
        </div>
      </div>
    </>
  );
}
