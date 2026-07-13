export default function UnauthorisedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-primary">
      <div className="text-center">
        <h1 className="mb-2 font-heading text-2xl font-semibold text-text-primary">
          Access Denied
        </h1>
        <p className="text-text-secondary">
          You do not have permission to view this page.
        </p>
      </div>
    </main>
  );
}
