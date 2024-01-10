// pages/reset-password.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);

  const redirectToForgotPassword = () => {
    router.push('/forgot-password');
  }

  const handleResetPassword = async () => {
    if (!password || password==="") {
      alert('Please enter a new password');
      return;
    }

    try {
      const email = decodeURIComponent(router.query.email); // Get the email from the query parameter

      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success('Password reset successfully!');
        router.push('/'); // Redirect to the login page or any other page
      } else {
        const data = await response.json();
        toast.error(data.error || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      toast.error('An error occurred during password reset.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <div className="flex my-4">
              <input
                type={ShowPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 border border-gray-100 rounded"
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
        <button
          onClick={handleResetPassword}
          className="w-full bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600 transition duration-300"
        >
          Reset Password
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          
        <span onClick={redirectToForgotPassword} className="text-indigo-500 cursor-pointer">
               Change Email
              </span>
        </p>
      </div>
    </div>
  );
}
