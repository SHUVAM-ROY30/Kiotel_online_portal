// // src/components/scheduling/StatusBadge.js
// import { Badge } from '@/components/ui/badge';

// export default function StatusBadge({ status }) {
//   const variants = {
//     draft: 'secondary',
//     published: 'default',
//     archived: 'outline',
//     confirmed: 'default',
//     pending: 'warning',
//     requested: 'secondary'
//   };

//   return (
//     <Badge variant={variants[status] || 'secondary'}>
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </Badge>
//   );
// }

// src/components/scheduling/StatusBadge.js

export default function StatusBadge({ status }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'published':
        return 'bg-green-200 text-green-800';
      case 'archived':
        return 'bg-gray-400 text-white';
      case 'confirmed':
        return 'bg-blue-200 text-blue-800';
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'requested':
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(
        status
      )}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
}
