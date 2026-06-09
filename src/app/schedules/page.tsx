import { PageHeader } from "@/components/layout/PageHeader";

export default function SchedulesPage() {
  return (
    <>
      <PageHeader title="Schedules" />
      <div className="flex-1 p-4">
        <div className="text-center text-[var(--color-text-tertiary)] py-12">
          Payment schedules coming soon...
        </div>
      </div>
    </>
  );
}
