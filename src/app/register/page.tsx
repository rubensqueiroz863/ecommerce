import RegisterForm from "./RegisterForm";

type Props = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: Readonly<Props>) {
  const params = await searchParams;

  return (
    <RegisterForm redirectTo={params.redirect} />
  );
}