// pages/forgot-password.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const redirectToLogin = () => {
    router.push("/");
  };
  const handleResetPassword = async () => {
    if (email !== "") {
      alert("Please enter email");
      return;
    }

    try {
      const response = await fetch("/api/check-email-exist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        router.push(`/resetPassword?email=${encodeURIComponent(email)}`);
      } else {
        const data = await response.json();
        alert(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("An error occurred during password reset.");
    }
  };

  return (
    <>
    <div className="flex items-center justify-center h-screen">
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      </div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleResetPassword}
          className="w-full bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600 transition duration-300"
        >
          Reset Password
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <span
            onClick={redirectToLogin}
            className="text-indigo-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
    </>
  );
}
