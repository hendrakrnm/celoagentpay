import { PageHeader } from "@/components/layout/PageHeader";

export default function HistoryPage() {
  return (
    <>
      <PageHeader title="History" />
      <div className="flex-1 p-4">
        <div className="text-center text-[var(--color-text-tertiary)] py-12">
          Transaction history coming soon...
        </div>
      </div>
    </>
  );
}
