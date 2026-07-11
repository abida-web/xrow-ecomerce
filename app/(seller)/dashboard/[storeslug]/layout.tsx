import Sidbar from "../_components/Sidbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeslug: string }> | { storeslug: string };
}) {
  const { storeslug } = await params;

  return (
    <div className="min-h-screen ">
      <Sidbar storeSlug={storeslug} />

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
