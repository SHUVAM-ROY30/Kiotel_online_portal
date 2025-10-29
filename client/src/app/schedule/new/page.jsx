// // app/scheduling/new/page.js
// import ScheduleForm from '../../components/scheduling/ScheduleForm';
// import RoleGuard from '../../components/scheduling/RoleGuard';
// import { hasPermission } from '@/lib/accessControl';

// // Get all possible role IDs that can create schedules
// const CREATE_SCHEDULE_ROLES = [1, 5]; // admin and HR

// export default function NewSchedulePage() {
//   return (
//     <RoleGuard requiredPermissions={['CREATE_SCHEDULE']}>
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Create New Schedule</h1>
//         <ScheduleForm />
//       </div>
//     </RoleGuard>
//   );
// }


'use client';
import ScheduleForm from '@/components/scheduling/ScheduleForm';

export default function NewSchedulePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Schedule</h1>
      <ScheduleForm />
    </div>
  );
}
