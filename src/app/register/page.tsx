import { RedirectPromiseProps } from "../types/generics";
import RegisterClient from "./RegisterClient";

export default async function RegisterPage({
  searchParams,
}: Readonly<RedirectPromiseProps>) {
  const params = await searchParams;

  return <RegisterClient redirectTo={params.redirect} />;
}