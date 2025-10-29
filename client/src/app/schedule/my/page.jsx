// // app/scheduling/my/page.js
// import MyScheduleView from '../../components/scheduling/MyScheduleView';
// import RoleGuard from '../../components/scheduling/RoleGuard';

// export default function MySchedulePage() {
//   return (
//     <RoleGuard requiredPermissions={['VIEW_OWN_SCHEDULE']}>
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
//         <MyScheduleView />
//       </div>
//     </RoleGuard>
//   );
// }


'use client';
import { useEffect, useState } from 'react';
import MyScheduleView from '@/components/scheduling/MyScheduleView';

export default function MySchedulePage() {
  const [entries, setEntries] = useState([]);
  const userId = 10; // mock user ID

  useEffect(() => {
    fetch(`/api/scheduling/my-schedule/${userId}`)
      .then((res) => res.json())
      .then((data) => setEntries(data.data || []));
  }, [userId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Schedule</h1>
      <MyScheduleView entries={entries} />
    </div>
  );
}
