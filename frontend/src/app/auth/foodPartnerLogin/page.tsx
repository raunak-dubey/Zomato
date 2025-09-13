"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import axios from "axios";
import Link from "next/link";

export default function FoodPartnerLogin() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/partner/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);

      // Redirect to create food page after login
      router.push("../partner/create-food");
    } catch (error) {
      console.error("Login failed", error);
      // You can add toast/error UI here
    }
  };

  return (
     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Partner Login</h1>
          <p className="mt-2 text-sm text-gray-400">
             Access your dashboard and manage orders.
          </p>
        </div>

        {/* Switch nav */}
        <nav className="my-4 text-sm text-gray-400 text-center">
          <strong className="font-semibold">Switch:</strong>{" "}
          <Link href="/auth/userLogin" className="text-indigo-400 hover:underline">
            User
          </Link>{" "}
          •{" "}
          <Link href="/auth/foodPartnerRegister" className="text-indigo-400 hover:underline">
            Food partner
          </Link>
        </nav>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="business@example.com"
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-sm text-indigo-400 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-700"></div>
          <div className="h-px flex-1 bg-gray-700"></div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
            New Partner?{" "}
          <Link href="/auth/foodPartnerRegister" className="text-indigo-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}