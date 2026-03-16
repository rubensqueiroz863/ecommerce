export type RedirectProps = {
  redirectTo?: string;
};

export type RedirectPromiseProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};
