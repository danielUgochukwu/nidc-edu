import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-primary">
<<<<<<< HEAD:app/(auth)/sign-up/[[...sign-up]]/page.tsx
      <SignUp forceRedirectUrl="/dashboard" />
=======
      <SignUp forceRedirectUrl="/applicant" />
>>>>>>> main:app/(auth)/sign-up/page.tsx
    </main>
  );
}
