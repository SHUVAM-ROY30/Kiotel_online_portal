// // src/components/scheduling/ScheduleForm.js
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// export default function ScheduleForm({ schedule = null }) {
//   const [formData, setFormData] = useState({
//     name: schedule?.name || '',
//     start_date: schedule?.start_date || '',
//     end_date: schedule?.end_date || '',
//     status: schedule?.status || 'draft',
//     property_id: schedule?.property_id || ''
//   });
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Fetch properties on mount
//   useState(() => {
//     const fetchProperties = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/properties`,
//           { withCredentials: true }
//         );
//         setProperties(res.data);
//       } catch (error) {
//         console.error('Failed to fetch properties:', error);
//       }
//     };
//     fetchProperties();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const url = schedule 
//         ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schedules/${schedule.id}`
//         : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schedules`;
      
//       const method = schedule ? 'PUT' : 'POST';
      
//       await axios({
//         method,
//         url,
//         data: formData,
//         withCredentials: true
//       });
      
//       router.push('/scheduling');
//     } catch (error) {
//       console.error('Error saving schedule:', error);
//       alert('Failed to save schedule');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{schedule ? 'Edit Schedule' : 'Create Schedule'}</CardTitle>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Schedule Name</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               required
//             />
//           </div>
          
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="start_date">Start Date</Label>
//               <Input
//                 id="start_date"
//                 type="date"
//                 value={formData.start_date}
//                 onChange={(e) => setFormData({...formData, start_date: e.target.value})}
//                 required
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="end_date">End Date</Label>
//               <Input
//                 id="end_date"
//                 type="date"
//                 value={formData.end_date}
//                 onChange={(e) => setFormData({...formData, end_date: e.target.value})}
//                 required
//               />
//             </div>
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="property_id">Property</Label>
//             <Select
//               value={formData.property_id}
//               onValueChange={(value) => setFormData({...formData, property_id: value})}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select property" />
//               </SelectTrigger>
//               <SelectContent>
//                 {properties.map((property) => (
//                   <SelectItem key={property.id} value={property.id.toString()}>
//                     {property.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
          
//           <div className="space-y-2">
//             <Label>Status</Label>
//             <Select
//               value={formData.status}
//               onValueChange={(value) => setFormData({...formData, status: value})}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="draft">Draft</SelectItem>
//                 <SelectItem value="published">Published</SelectItem>
//                 <SelectItem value="archived">Archived</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
        
//         <CardFooter className="flex justify-end space-x-2">
//           <Button 
//             type="button" 
//             variant="outline" 
//             onClick={() => router.back()}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" disabled={loading}>
//             {loading ? 'Saving...' : (schedule ? 'Update' : 'Create')}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }


import { useState } from 'react';

export default function ScheduleForm() {
  const [form, setForm] = useState({
    property_id: '',
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    created_by: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/schedule/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) alert('Schedule created!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <input
        type="text"
        placeholder="Title"
        className="w-full border rounded p-2"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        className="w-full border rounded p-2"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="flex gap-4">
        <input
          type="date"
          className="w-1/2 border rounded p-2"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />
        <input
          type="date"
          className="w-1/2 border rounded p-2"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
        Create Schedule
      </button>
    </form>
  );
}
