// // src/components/scheduling/MyScheduleView.js
// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Calendar } from 'lucide-react';

// export default function MyScheduleView() {
//   const [myShifts, setMyShifts] = useState([]);
//   const [availability, setAvailability] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMySchedule = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schedules/my-shifts`,
//           { withCredentials: true }
//         );
//         setMyShifts(res.data);
//       } catch (error) {
//         console.error('Error fetching shifts:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchMySchedule();
//   }, []);

//   const requestChange = async (shiftId) => {
//     if (!confirm('Request a change for this shift?')) return;
    
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shift-requests`,
//         { schedule_entry_id: shiftId },
//         { withCredentials: true }
//       );
//       alert('Change request submitted');
//     } catch (error) {
//       console.error('Error requesting change:', error);
//       alert('Failed to submit request');
//     }
//   };

//   const toggleAvailability = async (dateStr) => {
//     const newStatus = !availability[dateStr];
//     setAvailability(prev => ({...prev, [dateStr]: newStatus}));
    
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/availability`,
//         { date: dateStr, available: newStatus },
//         { withCredentials: true }
//       );
//     } catch (error) {
//       console.error('Error updating availability:', error);
//       setAvailability(prev => ({...prev, [dateStr]: !newStatus})); // Revert
//     }
//   };

//   if (loading) return <div>Loading your schedule...</div>;

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>My Assigned Shifts</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {myShifts.length === 0 ? (
//             <p className="text-gray-500">No shifts assigned yet</p>
//           ) : (
//             <div className="space-y-3">
//               {myShifts.map((shift) => (
//                 <div 
//                   key={shift.id} 
//                   className="flex justify-between items-center p-3 border rounded-lg"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       {new Date(shift.date).toLocaleDateString('en-US', {
//                         weekday: 'long',
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </p>
//                     <Badge variant={shift.status === 'confirmed' ? 'default' : 'secondary'}>
//                       {shift.shift_type || 'Standard'} • {shift.status}
//                     </Badge>
//                   </div>
//                   <Button 
//                     variant="outline" 
//                     size="sm"
//                     onClick={() => requestChange(shift.id)}
//                   >
//                     Request Change
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader>
//           <CardTitle>
//             <div className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               Set Availability
//             </div>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="mb-4 text-sm text-gray-600">
//             Mark dates when you're available to work
//           </p>
//           <div className="grid grid-cols-7 gap-1">
//             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//               <div key={day} className="text-center py-1 text-xs font-medium text-gray-500">
//                 {day}
//               </div>
//             ))}
//             {Array.from({ length: 35 }).map((_, i) => {
//               const date = new Date();
//               date.setDate(date.getDate() + i - (date.getDay() || 7));
//               const dateStr = date.toISOString().split('T')[0];
//               const isCurrentMonth = date.getMonth() === new Date().getMonth();
              
//               return (
//                 <Button
//                   key={dateStr}
//                   variant={availability[dateStr] ? 'default' : 'outline'}
//                   size="sm"
//                   className={`h-8 text-xs ${!isCurrentMonth ? 'opacity-50' : ''}`}
//                   onClick={() => toggleAvailability(dateStr)}
//                 >
//                   {date.getDate()}
//                 </Button>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


export default function MyScheduleView({ entries }) {
  if (!entries.length) return <p>No upcoming shifts assigned.</p>;

  return (
    <div className="grid gap-3">
      {entries.map((e) => (
        <div key={e.id} className="border rounded-lg p-3 flex justify-between">
          <div>
            <h3 className="font-semibold">{e.shift_name}</h3>
            <p className="text-sm text-gray-600">{e.entry_date}</p>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{e.assignment_status}</span>
        </div>
      ))}
    </div>
  );
}
