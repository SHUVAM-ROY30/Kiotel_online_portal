
// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../../../context/ProtectedRoute";

// export default function TicketDetails({ params }) {
//   const ticketId = params.createdbyid;
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null); // State to hold user data
//   const router = useRouter();

//   // Fetch ticket details
//   useEffect(() => {
//     if (ticketId) {
//       const fetchTicketDetails = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forms_PropertyOnBoardingForm/${ticketId}`,
//             {
//               withCredentials: true,
//             }
//           );
//           setTicketDetails(response.data);
//         } catch (err) {
//           console.error("Error fetching ticket details:", err);
//           setError(err.response?.data?.message || "An error occurred");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchTicketDetails();
//     }
//   }, [ticketId]);

//   // Fetch the user's session


//   if (loading) return <p className="text-center text-gray-700">Loading...</p>;
//   if (error)
//     return (
//       <p className="text-center text-red-600">
//         Error loading ticket details: {error}
//       </p>
//     );

//   if (!ticketDetails) {
//     return (
//       <p className="text-center text-gray-700">No data available.</p>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       {/* Navbar */}
//       <nav className="bg-gray-100 text-black py-4 shadow-lg mb-6">
//         <div className="container mx-auto flex justify-between items-center">
//           {/* User's Name */}
//           <div>
//             {user && (
//               <span className="text-lg font-bold">Welcome, {user.name}</span>
//             )}
//           </div>

//           {/* Centered Image */}
//           <div
//             className="cursor-pointer"
//             onClick={() => router.push("/Dashboard")}
//           >
//             <img
//               src="/Kiotel logo.jpg"
//               alt="Dashboard Logo"
//               className="h-12 w-auto mx-auto"
//             />
//           </div>

//           <div></div> {/* Empty div for balancing the layout */}
//         </div>
//       </nav>

//       {/* Main Section */}
//       <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
        
//       </div>
//     </ProtectedRoute>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../../context/ProtectedRoute";

// export default function TicketDetails({ params }) {
//   const ticketId = params?.createdbyid;
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null); // State to hold user data
//   const router = useRouter();

//   // Fetch ticket details
// //   useEffect(() => {
// //     if (!ticketId) {
// //       setError("Ticket ID is not available.");
// //       setLoading(false);
// //       return;
// //     }

// //     const fetchTicketDetails = async () => {
// //       try {
// //         setLoading(true);
// //         console.log(
// //           `Fetching ticket details for ID: ${ticketId} from ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forms_PropertyOnBoardingForm/${ticketId}`
// //         );
// //         const response = await axios.get(
// //           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forms_PropertyOnBoardingForm/${ticketId}`,
// //           { withCredentials: true }
// //         );
// //         setTicketDetails(response.data);
// //         setLoading(false);
// //       } catch (err) {
// //         console.error("Error fetching ticket details:", err);
// //         setError(err.response?.data?.message || "An error occurred.");
// //         setLoading(false);
// //       }
// //     };

// //     fetchTicketDetails();
// //   }, [ticketId]);

//   if (loading) return <p className="text-center text-gray-700">Loading...</p>;
// //   if (error)
// //     return (
// //       <p className="text-center text-red-600">
// //         Error loading ticket details: {error}
// //       </p>
// //     );

//   if (!ticketDetails) {
//     return <p className="text-center text-gray-700">No data available.</p>;
//   }

//   return (
//     <ProtectedRoute>
//       {/* Navbar */}
//       <nav className="bg-gray-100 text-black py-4 shadow-lg mb-6">
//         <div className="container mx-auto flex justify-between items-center">
//           {/* User's Name */}
//           <div>
//             {user && (
//               <span className="text-lg font-bold">Welcome, {user.name}</span>
//             )}
//           </div>

//           {/* Centered Image */}
//           <div
//             className="cursor-pointer"
//             onClick={() => router.push("/Dashboard")}
//           >
//             <img
//               src="/Kiotel logo.jpg"
//               alt="Dashboard Logo"
//               className="h-12 w-auto mx-auto"
//             />
//           </div>

//           <div></div> {/* Empty div for balancing the layout */}
//         </div>
//       </nav>

//       {/* Main Section */}
//       <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//         <div className="container mx-auto">
//           {/* Ticket Details */}
          

//           {/* Section 1 */}
//           <section className="mb-12">
//             <h2 className="text-2xl font-bold text-center mb-4">Ratings Page 1</h2>
//             <div className="rounded-md overflow-hidden shadow-lg">
//               <iframe
//                 src="https://www.tripadvisor.com/Hotel_Review-g60304-d230297-Reviews-Baymont_by_Wyndham_Stevens_Point-Stevens_Point_Wisconsin.html#REVIEWS"
//                 title="Ratings Page 1"
//                 className="w-full h-96 border-none"
//               ></iframe>
//             </div>
//           </section>

//           {/* Section 2 */}
//           <section className="mb-12">
//             <h2 className="text-2xl font-bold text-center mb-4">Ratings Page 2</h2>
//             <div className="rounded-md overflow-hidden shadow-lg">
//               <iframe
//                 src="https://example.com/ratings-page-2"
//                 title="Ratings Page 2"
//                 className="w-full h-96 border-none"
//               ></iframe>
//             </div>
//           </section>

//           {/* Section 3 */}
//           <section className="mb-12">
//             <h2 className="text-2xl font-bold text-center mb-4">Ratings Page 3</h2>
//             <div className="rounded-md overflow-hidden shadow-lg">
//               <iframe
//                 src="https://example.com/ratings-page-3"
//                 title="Ratings Page 3"
//                 className="w-full h-96 border-none"
//               ></iframe>
//             </div>
//           </section>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../context/ProtectedRoute";

export default function TicketDetails() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      {/* Navbar */}
      <nav className="bg-gray-100 text-black py-4 shadow-lg mb-6">
        <div className="container mx-auto flex justify-between items-center">
          {/* Centered Image */}
          <div
            className="cursor-pointer"
            onClick={() => router.push("/Dashboard")}
          >
            <img
              src="/Kiotel logo.jpg"
              alt="Dashboard Logo"
              className="h-12 w-auto mx-auto"
            />
          </div>

          <div></div> {/* Empty div for balancing the layout */}
        </div>
      </nav>

      {/* Main Section */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
        <div className="container mx-auto">
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-4">Tripadviser.com</h2>
            <div className="rounded-md overflow-hidden shadow-lg">
              <iframe
                src="https://www.tripadvisor.com/Hotel_Review-g60304-d230297-Reviews-Baymont_by_Wyndham_Stevens_Point-Stevens_Point_Wisconsin.html#REVIEWS"
                title="Ratings Page 1"
                className="w-full h-96 border-none"
              ></iframe>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-4">Ratings Page 2</h2>
            <div className="rounded-md overflow-hidden shadow-lg">
              {/* <iframe
                // src="https://www.google.com"
                src="https://www.expedia.co.in/Stevens-Point-Hotels-Baymont-By-Wyndham-Stevens-Point.h459591.Hotel-Information"
                title="Ratings Page 2"
                className="w-full h-96 border-none"
              ></iframe> */}
              <iframe
  src="http://localhost:8080/proxy?url=https://www.expedia.co.in/Stevens-Point-Hotels-Baymont-By-Wyndham-Stevens-Point.h459591.Hotel-Information"
  title="Ratings Page 2"
  className="w-full h-96 border-none"
></iframe>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-4">Ratings Page 3</h2>
            <div className="rounded-md overflow-hidden shadow-lg">
              <iframe
                src="https://www.skyscanner.co.in/hotels/united-states/stevens-point-hotels/baymont-by-wyndham-stevens-point/ht-136219440"
                title="Ratings Page 3"
                className="w-full h-96 border-none"
              ></iframe>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
