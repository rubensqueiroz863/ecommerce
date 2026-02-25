import LoginForm from "./LoginForm";

type Props = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: Readonly<Props>) {
  const params = await searchParams;

  return <LoginForm redirectTo={params.redirect} />;
}