import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-primary">
<<<<<<< HEAD:app/(auth)/sign-in/[[...sign-in]]/page.tsx
      <SignIn forceRedirectUrl="/dashboard" />
=======
      <SignIn forceRedirectUrl="/applicant" />
>>>>>>> main:app/(auth)/sign-in/page.tsx
    </main>
  );
}
