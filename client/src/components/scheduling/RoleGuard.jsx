// // src/components/scheduling/RoleGuard.js
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { hasPermission } from '@/lib/accessControl';

// export default function RoleGuard({ 
//   children, 
//   requiredPermissions = [], 
//   fallback = null 
// }) {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserRole(response.data.role_id); // Note: using role_id from your API
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setError("Failed to fetch user role");
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     if (!loading && userRole !== null) {
//       const hasRequiredPermission = requiredPermissions.some(perm => 
//         hasPermission(userRole, perm)
//       );
      
//       if (!hasRequiredPermission) {
//         router.push('/unauthorized');
//       }
//     }
//   }, [userRole, loading, requiredPermissions, router]);

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   if (error || userRole === null) {
//     return <div className="flex items-center justify-center min-h-screen text-red-500">Error loading permissions</div>;
//   }

//   const hasRequiredPermission = requiredPermissions.some(perm => 
//     hasPermission(userRole, perm)
//   );

//   if (!hasRequiredPermission) {
//     return fallback || null;
//   }

//   return children;
// }



// export default function RoleGuard({ requiredPermissions = [], userRoleId, children }) {
//   const canAccess = requiredPermissions.some((perm) => hasPermission(userRoleId, perm));
//   if (!canAccess) return null;
//   return children;
// }


'use client';

import React from 'react';
import { hasPermission } from '@/lib/accessControl';

/**
 * RoleGuard component
 * Restricts rendering of children based on user role permissions
 *
 * @param {Array<string>} requiredPermissions - List of permissions required to access the content
 * @param {number|null} userRoleId - The logged-in user's role_id
 * @param {React.ReactNode} children - Components to render if permission is granted
 */
export default function RoleGuard({ requiredPermissions = [], userRoleId, children }) {
  // If userRoleId is not yet loaded (e.g., while fetching user session)
  if (userRoleId == null) {
    return null;
  }

  // Check if any of the required permissions are granted
  const canAccess = requiredPermissions.some((perm) =>
    hasPermission(userRoleId, perm)
  );

  if (!canAccess) {
    return null; // User doesn't have permission, hide content
  }

  return <>{children}</>;
}
