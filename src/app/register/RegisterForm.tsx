"use client";

import { useState } from "react";
import Image from "next/image";
import { ArchivoBlack } from "@/lib/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  redirectTo?: string;
};

export default function RegisterForm({ redirectTo }: Readonly<Props>) {
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.username.value;
    const emailInput = form.email.value;
    const passwordInput = form.password.value;

    if (!emailInput || !passwordInput || !nameInput) {
      setError("Preencha nome, email e senha para continuar.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://sticky-charil-react-blog-3b39d9e9.koyeb.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput,
            password: passwordInput,
            name: nameInput,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao criar conta.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);

      router.push(redirectTo || "/");
    } catch (err) {
      console.error(err);
      setError("Erro no registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Seja bem-vindo ao <br />
          <strong className={ArchivoBlack.className}>
            NexaShop
          </strong>
        </h1>

        {/* Nome */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-600"
          >
            Nome
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Digite seu nome..."
            required
            className="border border-gray-300 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
          />
        </div>

        {/* Email */}
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
            placeholder="Digite seu email..."
            required
            className="border border-gray-300 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
          />
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-600"
          >
            Senha
          </label>

          <div className="relative flex items-center">
            <input
              id="password"
              name="password"
              type={isShowingPassword ? "text" : "password"}
              placeholder="Digite sua senha..."
              required
              className="w-full border border-gray-300 rounded-lg p-3 pr-12 text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            />

            <button
              type="button"
              onClick={() =>
                setIsShowingPassword((prev) => !prev)
              }
              className="absolute right-3 p-1 hover:scale-110 transition"
            >
              <Image
                src={
                  isShowingPassword
                    ? "https://i.postimg.cc/YCgvvk7F/10435731.png"
                    : "https://i.postimg.cc/SRsXRMQQ/6684701.png"
                }
                alt="Toggle password visibility"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <p className="text-red-500 text-sm text-center -mt-2">
            {error}
          </p>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black hover:-translate-y-1 text-white p-3 rounded-lg font-medium hover:opacity-90 hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Criando conta..." : "Criar Conta"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}