import { RedirectPromiseProps } from "../types/generics";
import LoginClient from "./LoginClient";

export default async function LoginPage({
  searchParams,
}: Readonly<RedirectPromiseProps>) {
  const params = await searchParams;

  return <LoginClient redirectTo={params.redirect} />;
}