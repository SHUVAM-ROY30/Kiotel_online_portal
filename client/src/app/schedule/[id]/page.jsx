// // app/scheduling/[id]/page.js
// import { Suspense } from 'react';
// import ScheduleOverview from '../../components/scheduling/ScheduleOverview';
// import RoleGuard from '../../components/scheduling/RoleGuard';

// export default function ScheduleDetailPage({ params }) {
//   return (
//     <RoleGuard requiredPermissions={['VIEW_OWN_SCHEDULE']}>
//       <Suspense fallback={<div>Loading schedule...</div>}>
//         <ScheduleOverview scheduleId={params.id} />
//       </Suspense>
//     </RoleGuard>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import ScheduleEntryGrid from '@/components/scheduling/ScheduleEntryGrid';

export default function ScheduleEntriesPage({ params }) {
  const { id } = params;
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/schedule/schedules/${id}/entries`)
      .then((res) => res.json())
      .then((data) => setEntries(data.data || []));
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Schedule Entries</h1>
      <ScheduleEntryGrid entries={entries} />
    </div>
  );
}
