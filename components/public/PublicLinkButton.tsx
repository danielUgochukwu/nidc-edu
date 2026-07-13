import Link from "next/link";

type PublicLinkButtonVariant = "primary" | "secondary" | "ghost";

type PublicLinkButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: PublicLinkButtonVariant;
  className?: string;
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-surface-secondary";

const variantClasses: Record<PublicLinkButtonVariant, string> = {
  primary: "bg-brand-lime text-text-on-light hover:bg-brand-green",
  secondary:
    "border border-brand-lime bg-transparent text-brand-lime hover:bg-surface-elevated",
  ghost: "bg-transparent text-text-primary hover:bg-surface-elevated",
};

export default function PublicLinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: PublicLinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
