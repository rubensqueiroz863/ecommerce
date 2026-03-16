"use client";

import { useState } from "react";
import { ArchivoBlack } from "@/lib/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RedirectProps } from "../types/generics";

export default function LoginClient({ redirectTo }: Readonly<RedirectProps>) {
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget as HTMLFormElement;
    const emailInput = form.email.value;
    const passwordInput = form.password.value;

    if (!emailInput || !passwordInput) {
      setError("Fill in your name, email, and password to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://sticky-charil-react-blog-3b39d9e9.koyeb.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput,
            password: passwordInput,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error in the server.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      document.cookie = `token=${data.token}; path=/`;

      router.push(redirectTo || "/");
    } catch (err) {
      console.error(err);
      setError("Error in signing in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6"
      >
        <h1 className="text-2xl text-center text-gray-800">
          Welcome back to {" "}
          <strong className={ArchivoBlack.className}>NexaShop</strong>
        </h1>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email..."
            required
            className="border border-gray-300 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-600"
          >
            Password
          </label>

          <div className="relative flex items-center">
            <input
              id="password"
              name="password"
              type={isShowingPassword ? "text" : "password"}
              placeholder="Enter your password..."
              required
              className="w-full border border-gray-300 rounded-lg p-3 pr-12 text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            />
            <button
              type="button"
              onClick={() =>
                setIsShowingPassword((prev) => !prev)
              }
              className="absolute text-(--bg-secondary) cursor-pointer right-3 p-1 hover:scale-110 transition"
            >
                {isShowingPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={20}
                    height={20}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={20}
                    height={20}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.77 21.77 0 0 1 5.06-6.94" />
                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.79 21.79 0 0 1-3.06 4.94" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center -mt-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-black hover:-translate-y-1 cursor-pointer text-white p-3 rounded-lg font-medium hover:opacity-90 hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-black font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}