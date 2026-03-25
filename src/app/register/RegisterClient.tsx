"use client";

import { useState } from "react";
import { ArchivoBlack } from "@/lib/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RedirectProps } from "../types/generics";

export default function RegisterClient({ redirectTo }: Readonly<RedirectProps>) {
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.username.value;
    const emailInput = form.email.value;
    const passwordInput = form.password.value;

    if (!emailInput || !passwordInput || !nameInput) {
      setError("Fill in all fields to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput,
            password: passwordInput,
            name: nameInput,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Server error.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      document.cookie = `token=${data.token}; path=/`;

      router.push(redirectTo || "/");
    } catch (err) {
      console.error(err);
      setError("Error signing up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-[var(--bg-card)] p-8 rounded-2xl shadow-lg flex flex-col gap-6 border border-[var(--soft-border)]"
      >
        <h1 className="text-2xl text-center text-[var(--text-main)]">
          Welcome to{" "}
          <strong className={`${ArchivoBlack.className} text-[var(--primary-color)]`}>
            NexaShop
          </strong>
        </h1>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[var(--text-secondary)]">
            Name
          </label>
          <input
            name="username"
            type="text"
            placeholder="Enter your name..."
            required
            className="bg-[var(--bg-soft)] border border-[var(--soft-border)] rounded-lg p-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[var(--text-secondary)]">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email..."
            required
            className="bg-[var(--bg-soft)] border border-[var(--soft-border)] rounded-lg p-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[var(--text-secondary)]">
            Password
          </label>
          <div className="relative flex items-center">
            <input
              name="password"
              type={isShowingPassword ? "text" : "password"}
              placeholder="Enter your password..."
              required
              className="w-full bg-[var(--bg-soft)] border border-[var(--soft-border)] rounded-lg p-3 pr-12 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
            />
            <button
              type="button"
              onClick={() => setIsShowingPassword((prev) => !prev)}
              className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-main)] cs transition"
            >
              {isShowingPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.77 21.77 0 0 1 5.06-6.94" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.79 21.79 0 0 1-3.06 4.94" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {error && (
          <p className="text-[var(--error)] text-sm text-center -mt-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--primary-color)] text-[var(--text-light)] font-semibold p-3 rounded-lg cs hover:opacity-90 hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-sm text-center text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--primary-color)] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}