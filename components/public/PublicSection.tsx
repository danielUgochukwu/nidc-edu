type PublicSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

type SectionHeaderProps = {
  title: string;
  body?: string;
  className?: string;
};

type FeatureCardProps = {
  title: string;
  body: string;
  badge?: React.ReactNode;
};

export function PublicSection({
  children,
  className = "bg-surface-primary",
  id,
}: PublicSectionProps) {
  return (
    <section id={id} className={`${className} px-6 py-16 md:py-20`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeader({
  title,
  body,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <h2 className="font-heading text-3xl font-bold leading-tight text-text-primary">
        {title}
      </h2>
      {body ? (
        <p className="mt-5 text-base leading-relaxed text-text-secondary">
          {body}
        </p>
      ) : null}
    </div>
  );
}

export function FeatureCard({ title, body, badge }: FeatureCardProps) {
  return (
    <article className="rounded-md border border-surface-elevated bg-surface-secondary p-6 shadow-card">
      {badge ? <div className="mb-5">{badge}</div> : null}
      <h3 className="font-heading text-xl font-semibold leading-snug text-text-primary">
        {title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-text-secondary">
        {body}
      </p>
    </article>
  );
}

export function SectorBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex rounded-sm px-3 py-2 text-xs font-medium uppercase ${className}`}
    >
      {children}
    </span>
  );
}
