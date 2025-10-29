// // src/components/scheduling/ScheduleList.js
// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import StatusBadge from './StatusBadge';

// const hasPermission = (roleId, permission) => {
//   const permissions = {
//     ASSIGN_SHIFTS: [1, 5],
//     EDIT_SCHEDULE: [1, 5],
//     VIEW_OWN_SCHEDULE: [1, 5, 2, 3, 4, 6, 7, 8, 9, 10]
//   };
//   return permissions[permission]?.includes(roleId) || false;
// };

// export default function ScheduleList() {
//   const [schedules, setSchedules] = useState([]);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserRoleAndSchedules = async () => {
//       try {
//         // Fetch user role
//         const userResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         const roleId = userResponse.data.role_id;
//         setUserRole(roleId);

//         // Fetch schedules based on role
//         const endpoint = hasPermission(roleId, 'ASSIGN_SHIFTS') 
//           ? '/api/schedules' 
//           : `/api/schedules?userId=${userResponse.data.id}`;
        
//         const schedulesResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
//           { withCredentials: true }
//         );
//         setSchedules(schedulesResponse.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRoleAndSchedules();
//   }, []);

//   if (loading) {
//     return <div className="flex items-center justify-center py-8">Loading schedules...</div>;
//   }

//   return (
//     <div className="border rounded-lg overflow-hidden">
//       <table className="w-full">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Schedule</th>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Period</th>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {schedules.map((schedule) => (
//             <tr key={schedule.id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 text-sm font-medium text-gray-900">{schedule.name}</td>
//               <td className="px-6 py-4 text-sm text-gray-500">
//                 {new Date(schedule.start_date).toLocaleDateString()} - 
//                 {new Date(schedule.end_date).toLocaleDateString()}
//               </td>
//               <td className="px-6 py-4">
//                 <StatusBadge status={schedule.status} />
//               </td>
//               <td className="px-6 py-4">
//                 <button
//                   onClick={() => router.push(`/scheduling/${schedule.id}`)}
//                   className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium mr-4"
//                 >
//                   View
//                 </button>
                
//                 {userRole && hasPermission(userRole, 'EDIT_SCHEDULE') && (
//                   <button
//                     onClick={() => router.push(`/scheduling/${schedule.id}/entries`)}
//                     className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
//                   >
//                     Manage
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


export default function ScheduleList({ schedules }) {
  if (!schedules.length) return <p>No schedules found.</p>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Property</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">End Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{s.title}</td>
              <td className="p-3">{s.property_name}</td>
              <td className="p-3">{s.start_date}</td>
              <td className="p-3">{s.end_date}</td>
              <td className="p-3 capitalize">{s.status}</td>
              <td className="p-3">
                <a
                  href={`/schedule/${s.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
