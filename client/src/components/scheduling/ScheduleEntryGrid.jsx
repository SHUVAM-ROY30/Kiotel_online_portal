// // src/components/scheduling/ScheduleEntryGrid.js
// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';

// export default function ScheduleEntryGrid({ scheduleId }) {
//   const [entries, setEntries] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch schedule entries
//         const entriesRes = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schedules/${scheduleId}/entries`,
//           { withCredentials: true }
//         );
        
//         // Fetch employees
//         const employeesRes = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employees`,
//           { withCredentials: true }
//         );
        
//         setEntries(entriesRes.data);
//         setEmployees(employeesRes.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
    
//     fetchData();
//   }, [scheduleId]);

//   const handleAssignEmployee = async (entryId, employeeId) => {
//     try {
//       setLoading(true);
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schedule-entries/${entryId}`,
//         { employee_id: employeeId },
//         { withCredentials: true }
//       );
      
//       // Update local state
//       setEntries(prev => 
//         prev.map(entry => 
//           entry.id === entryId ? {...entry, employee_id: employeeId} : entry
//         )
//       );
//     } catch (error) {
//       console.error('Error assigning employee:', error);
//       alert('Failed to assign employee');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="border rounded-md">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Date</TableHead>
//             <TableHead>Shift Type</TableHead>
//             <TableHead>Assigned Employee</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {entries.map((entry) => (
//             <TableRow key={entry.id}>
//               <TableCell>
//                 {new Date(entry.date).toLocaleDateString()}
//               </TableCell>
//               <TableCell>
//                 <Badge variant="secondary">
//                   {entry.shift_type || 'Standard'}
//                 </Badge>
//               </TableCell>
//               <TableCell>
//                 <Select
//                   value={entry.employee_id?.toString() || ''}
//                   onValueChange={(value) => handleAssignEmployee(entry.id, parseInt(value))}
//                   disabled={loading}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Assign employee" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {employees.map((emp) => (
//                       <SelectItem key={emp.id} value={emp.id.toString()}>
//                         {emp.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </TableCell>
//               <TableCell>
//                 <Button variant="ghost" size="sm" disabled={loading}>
//                   Edit
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }


export default function ScheduleEntryGrid({ entries }) {
  if (!entries.length) return <p>No entries available.</p>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Employee</th>
            <th className="p-3">Shift</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{e.entry_date}</td>
              <td className="p-3">{e.employee_name}</td>
              <td className="p-3">{e.shift_name}</td>
              <td className="p-3">{e.assignment_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
