// app/scheduling/[id]/entries/page.js
import ScheduleEntryGrid from '../../components/scheduling/ScheduleEntryGrid';
import RoleGuard from '../../components/scheduling/RoleGuard';

export default function ScheduleEntriesPage({ params }) {
  return (
    <RoleGuard requiredPermissions={['ASSIGN_SHIFTS']}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Shift Assignments</h1>
        <ScheduleEntryGrid scheduleId={params.id} />
      </div>
    </RoleGuard>
  );
}