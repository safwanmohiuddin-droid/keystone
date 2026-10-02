import Dashboard from "@/components/dashboard";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ persona?: string }>;
}) {
  const params = await searchParams;
  return <Dashboard personaId={params.persona ?? "priya"} />;
}
