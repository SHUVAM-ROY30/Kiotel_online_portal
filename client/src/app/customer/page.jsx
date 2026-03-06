// // app/dashboard/customer/page.js
// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// // Plan pricing data from images
// const PLANS = {
//   dedicated: [
//     {
//       id: 'ded_8hr',
//       name: '8 Hour Service',
//       shifts: 1,
//       hours: 8,
//       monthlyFee: 1800,
//       hourlyRate: 7.50,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 7,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     },
//     {
//       id: 'ded_16hr',
//       name: '16 Hour Service',
//       shifts: 2,
//       hours: 16,
//       monthlyFee: 2880,
//       hourlyRate: 6.00,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 7,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     },
//     {
//       id: 'ded_24hr',
//       name: '24 Hour Service',
//       shifts: 3,
//       hours: 24,
//       monthlyFee: 3600,
//       hourlyRate: 5.00,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 0,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     }
//   ],
//   shared: [
//     {
//       id: 'shr_8hr',
//       name: '8 Hour Service',
//       shifts: 1,
//       hours: 8,
//       monthlyFee: 1400,
//       hourlyRate: 5.83,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 7,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     },
//     {
//       id: 'shr_16hr',
//       name: '16 Hour Service',
//       shifts: 2,
//       hours: 16,
//       monthlyFee: 1900,
//       hourlyRate: 3.96,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 7,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     },
//     {
//       id: 'shr_24hr',
//       name: '24 Hour Service',
//       shifts: 3,
//       hours: 24,
//       monthlyFee: 2400,
//       hourlyRate: 3.33,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 0,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     }
//   ]
// };

// export default function CustomerDashboard() {
//   const [userFname, setUserFname] = useState("");
//   const [userRole, setUserRole] = useState(null);
//   const [userEmail, setUserEmail] = useState("");
//   const [userUniqueID, setUserUniqueID] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Service plan data
//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [planHistory, setPlanHistory] = useState([]);
//   const [loadingPlan, setLoadingPlan] = useState(false);
//   const [showPlanModal, setShowPlanModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [changeRequest, setChangeRequest] = useState(null);

//   // New plan selection state
//   const [selectedServiceType, setSelectedServiceType] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [requestRemarks, setRequestRemarks] = useState("");
//   const [requestingChange, setRequestingChange] = useState(false);

//   // Agent schedule data
//   const [customerProperties, setCustomerProperties] = useState([]);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [activeAgent, setActiveAgent] = useState(null);
//   const [loadingAgent, setLoadingAgent] = useState(false);

//   // Redirect links
//   const [propertyLinks, setPropertyLinks] = useState(null);

//   // Fetch user details
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );

//         setUserFname(res.data.fname);
//         setUserRole(res.data.role);
//         setUserEmail(res.data.email);
//         setUserUniqueID(res.data.unique_id);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         setError("Failed to fetch user details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Fetch customer data
//   useEffect(() => {
//     if (userUniqueID && userRole === 4) {
//       fetchCustomerProperties();
//     }
//   }, [userUniqueID, userRole]);

//   // Fetch data when property is selected
//   useEffect(() => {
//     if (selectedProperty) {
//       fetchServicePlan();
//       fetchActiveAgent();
//       fetchPropertyLinks();
//       fetchChangeRequest();
//       fetchPlanHistory();
//     }
//   }, [selectedProperty]);

//   const fetchCustomerProperties = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/properties`,
//         { 
//           params: { customer_id: userUniqueID },
//           withCredentials: true 
//         }
//       );
      
//       setCustomerProperties(res.data || []);
//       if (res.data && res.data.length > 0) {
//         setSelectedProperty(res.data[0]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch properties:", err);
//     }
//   };

//   const fetchServicePlan = async () => {
//     if (!selectedProperty) return;
    
//     setLoadingPlan(true);
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan`,
//         { 
//           params: { 
//             customer_id: userUniqueID,
//             property_id: selectedProperty.property_id 
//           },
//           withCredentials: true 
//         }
//       );
//       setCurrentPlan(res.data);
//     } catch (err) {
//       console.error("Failed to fetch service plan:", err);
//     } finally {
//       setLoadingPlan(false);
//     }
//   };

//   const fetchPlanHistory = async () => {
//     if (!selectedProperty) return;
    
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/history`,
//         { 
//           params: { customer_id: userUniqueID },
//           withCredentials: true 
//         }
//       );
//       setPlanHistory(res.data || []);
//     } catch (err) {
//       console.error("Failed to fetch plan history:", err);
//     }
//   };

//   const fetchChangeRequest = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/change-request`,
//         { 
//           params: { customer_id: userUniqueID },
//           withCredentials: true 
//         }
//       );
//       setChangeRequest(res.data);
//     } catch (err) {
//       console.error("Failed to fetch change request:", err);
//     }
//   };

//   const fetchActiveAgent = async () => {
//     if (!selectedProperty) return;
    
//     setLoadingAgent(true);
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/agent-schedule`,
//         { 
//           params: { property_id: selectedProperty.property_id },
//           withCredentials: true 
//         }
//       );
//       setActiveAgent(res.data);
//     } catch (err) {
//       console.error("Failed to fetch active agent:", err);
//       setActiveAgent({ status: 'NO_ACTIVE_AGENT' });
//     } finally {
//       setLoadingAgent(false);
//     }
//   };

//   const fetchPropertyLinks = async () => {
//     if (!selectedProperty) return;
    
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/property-links`,
//         { 
//           params: { property_id: selectedProperty.property_id },
//           withCredentials: true 
//         }
//       );
//       setPropertyLinks(res.data);
//     } catch (err) {
//       console.error("Failed to fetch property links:", err);
//     }
//   };

//   const handleRequestChange = async () => {
//     if (!selectedPlan || !requestRemarks.trim()) {
//       alert("Please select a plan and provide remarks");
//       return;
//     }

//     setRequestingChange(true);
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/change-request`,
//         {
//           customer_id: userUniqueID,
//           property_id: selectedProperty.property_id,
//           current_plan_id: currentPlan.id,
//           requested_plan_name: selectedPlan.name,
//           requested_service_type: selectedServiceType,
//           requested_shift_hours: selectedPlan.hours.toString(),
//           requested_monthly_price: selectedPlan.monthlyFee.toString(),
//           remarks: requestRemarks
//         },
//         { withCredentials: true }
//       );

//       alert("Package change request submitted successfully!");
//       setShowRequestModal(false);
//       resetRequestForm();
//       fetchServicePlan();
//       fetchChangeRequest();
//     } catch (err) {
//       console.error("Failed to submit request:", err);
//       alert("Failed to submit request. Please try again.");
//     } finally {
//       setRequestingChange(false);
//     }
//   };

//   const resetRequestForm = () => {
//     setSelectedServiceType(null);
//     setSelectedPlan(null);
//     setRequestRemarks("");
//   };

//   const handlePropertyChange = (property) => {
//     setSelectedProperty(property);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative w-24 h-24 mx-auto mb-6">
//             <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
//             <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
//             <div className="absolute inset-2 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
//           </div>
//           <p className="text-gray-700 font-semibold text-lg">Loading your workspace...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold mb-2 text-gray-900">Something went wrong</h2>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }


//   if (userRole !== 4) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
//           <p className="text-gray-600">This portal is exclusively for customers Hello this is the way you should 
            
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const isPlanChangeRequested = currentPlan?.status === 'PENDING_CHANGE' || 
//                                  (changeRequest && changeRequest.status === 'PENDING');

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        
//         * {
//           font-family: 'Manrope', system-ui, -apple-system, sans-serif;
//         }

//         body {
//           overflow-x: hidden;
//         }

//         @keyframes float-slow {
//           0%, 100% { transform: translate(0, 0) rotate(0deg); }
//           33% { transform: translate(30px, -30px) rotate(5deg); }
//           66% { transform: translate(-20px, 20px) rotate(-5deg); }
//         }

//         @keyframes gradient-shift {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }

//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-slide-up {
//           animation: slide-up 0.6s ease-out forwards;
//         }

//         .fluid-card {
//           background: rgba(255, 255, 255, 0.7);
//           backdrop-filter: blur(20px);
//           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .fluid-card:hover {
//           background: rgba(255, 255, 255, 0.9);
//           transform: translateY(-4px);
//           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
//         }

//         .gradient-text {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .floating-shape {
//           animation: float-slow 20s ease-in-out infinite;
//         }

//         .btn-gradient {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           background-size: 200% 200%;
//           animation: gradient-shift 3s ease infinite;
//         }

//         /* Custom Scrollbar */
//         ::-webkit-scrollbar {
//           width: 10px;
//         }

//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }

//         ::-webkit-scrollbar-thumb {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           border-radius: 5px;
//         }

//         ::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
//         }
//       `}</style>

//       {/* Floating Background Shapes */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//         <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-blue-300/30 rounded-full blur-3xl floating-shape"></div>
//         <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl floating-shape" style={{animationDelay: '3s'}}></div>
//         <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl floating-shape" style={{animationDelay: '6s'}}></div>
//       </div>

//       {/* Header */}
//       <header className="relative z-10 border-b border-white/40 backdrop-blur-xl bg-white/50">
//         <div className="w-full px-8 lg:px-12 py-6">
//           <div className="flex items-center justify-between">
//             <div className="animate-slide-up">
//               <h1 className="text-4xl lg:text-5xl font-extrabold gradient-text mb-2">Customer Portal</h1>
//               <p className="text-gray-600">
//                 Welcome back, <span className="font-bold text-gray-900">{userFname}</span>
//               </p>
//             </div>
            
//             <div className="hidden md:flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-3 rounded-full border border-purple-200/50 shadow-lg">
//               <div className="relative">
//                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
//                 <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
//               </div>
//               <span className="text-sm font-bold text-gray-700">System Active</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="relative z-10 w-full px-4 md:px-8 lg:px-12 py-8">
//         {/* Property Selector */}
//         {customerProperties.length > 1 && (
//           <div className="mb-8 animate-slide-up">
//             <div className="fluid-card rounded-2xl p-6 border border-white/50">
//               <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Active Property</label>
//               <select
//                 value={selectedProperty?.property_id || ""}
//                 onChange={(e) => {
//                   const property = customerProperties.find(p => p.property_id === e.target.value);
//                   handlePropertyChange(property);
//                 }}
//                 className="w-full md:w-auto px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-900 font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all cursor-pointer"
//               >
//                 {customerProperties.map((property) => (
//                   <option key={property.property_id} value={property.property_id}>
//                     {property.property_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}

//         {!selectedProperty ? (
//           <div className="fluid-card rounded-3xl p-20 text-center border border-white/50 animate-slide-up">
//             <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Available</h3>
//             <p className="text-gray-600">Contact your administrator to set up your properties</p>
//           </div>
//         ) : (
//           <>
//             {/* Full-Width Grid Layout */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
//               {/* Service Plan - Full Width on Mobile, Half on Desktop */}
//               <div className="fluid-card rounded-3xl p-8 lg:p-10 border border-white/50 animate-slide-up" style={{animationDelay: '0.1s'}}>
//                 <div className="flex items-start justify-between mb-8">
//                   <div>
//                     <div className="inline-flex items-center gap-3 mb-4">
//                       <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
//                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <h2 className="text-2xl font-extrabold text-gray-900">Service Plan</h2>
//                         <p className="text-gray-500 text-sm">Your active subscription</p>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowPlanModal(true)}
//                     className="text-purple-600 hover:text-purple-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-purple-50 transition-all"
//                   >
//                     View History →
//                   </button>
//                 </div>

//                 {loadingPlan ? (
//                   <div className="text-center py-16">
//                     <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-500">Loading plan...</p>
//                   </div>
//                 ) : currentPlan ? (
//                   <div className="space-y-6">
//                     <div>
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Active Plan</p>
//                       <h3 className="text-4xl font-black text-gray-900">{currentPlan.plan_name}</h3>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
//                         <p className="text-xs font-bold text-gray-500 uppercase mb-2">Service Type</p>
//                         <p className="text-xl font-bold text-gray-900">{currentPlan.service_type}</p>
//                       </div>
//                       <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
//                         <p className="text-xs font-bold text-gray-500 uppercase mb-2">Coverage</p>
//                         <p className="text-xl font-bold text-gray-900">{currentPlan.shift_hours}h / Day</p>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 rounded-2xl p-6 border border-purple-200">
//                       <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Monthly Investment</p>
//                       <div className="flex items-baseline gap-3 mb-4">
//                         <span className="text-5xl font-black gradient-text">₹{currentPlan.monthly_price}</span>
//                         <span className="text-gray-600 text-lg">/month</span>
//                       </div>
//                       <div className="inline-flex items-center gap-2 bg-emerald-500 px-4 py-2 rounded-full">
//                         <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
//                         <span className="text-white text-sm font-bold">{currentPlan.status}</span>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => setShowRequestModal(true)}
//                       disabled={isPlanChangeRequested}
//                       className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-gradient shadow-lg hover:shadow-xl"
//                     >
//                       {isPlanChangeRequested ? (
//                         <span className="flex items-center justify-center gap-2">
//                           <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           Change Request Pending
//                         </span>
//                       ) : (
//                         "Request Plan Change"
//                       )}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="text-center py-16">
//                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <p className="text-gray-700 font-semibold text-lg">No Active Plan</p>
//                     <p className="text-gray-500 text-sm mt-1">Contact your administrator</p>
//                   </div>
//                 )}
//               </div>

//               {/* Agent - Full Width on Mobile, Half on Desktop */}
//               <div className="fluid-card rounded-3xl p-8 lg:p-10 border border-white/50 animate-slide-up" style={{animationDelay: '0.2s'}}>
//                 <div className="inline-flex items-center gap-3 mb-8">
//                   <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
//                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-extrabold text-gray-900">On-Duty Agent</h2>
//                     <p className="text-gray-500 text-sm">Real-time status</p>
//                   </div>
//                 </div>

//                 {loadingAgent ? (
//                   <div className="text-center py-16">
//                     <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-500">Checking status...</p>
//                   </div>
//                 ) : activeAgent?.status === 'ACTIVE' ? (
//                   <div className="space-y-6">
//                     <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
//                       <div className="flex items-center gap-4 mb-6">
//                         <div className="relative">
//                           <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-3xl shadow-lg">
//                             {activeAgent.agent_name?.charAt(0).toUpperCase() || 'A'}
//                           </div>
//                           <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-400 rounded-full border-4 border-white flex items-center justify-center">
//                             <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-2xl font-bold text-gray-900 mb-1">{activeAgent.agent_name}</p>
//                           <div className="flex items-center gap-2">
//                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
//                             <span className="text-emerald-700 font-bold">Active Now</span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-100">
//                           <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Shift Start</p>
//                           <p className="text-lg font-bold text-gray-900">{activeAgent.shift_start}</p>
//                         </div>
//                         <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-100">
//                           <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Shift End</p>
//                           <p className="text-lg font-bold text-gray-900">{activeAgent.shift_end}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-16">
//                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                       </svg>
//                     </div>
//                     <p className="text-gray-700 font-semibold text-lg">No Agent On Duty</p>
//                     <p className="text-gray-500 text-sm mt-1">Check back later</p>
//                   </div>
//                 )}
//               </div>

//               {/* Quick Access Links - Full Width */}
//               <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 lg:gap-8">
//                 {/* Quick Access 1 */}
//                 <a 
//                   href={propertyLinks?.link1_url || "#"} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="fluid-card rounded-3xl p-8 lg:p-10 border border-white/50 group animate-slide-up"
//                   style={{animationDelay: '0.3s'}}
//                   onClick={(e) => {
//                     if (!propertyLinks?.link1_url) e.preventDefault();

//                   }}
//                 >
//                   <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
//                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                         </svg>
//                       </div>
//                       <div>
//                         <h2 className="text-xl font-bold text-gray-900">
//                           {propertyLinks?.link1_title || "Quick Access 1"}
//                         </h2>
//                         <p className="text-gray-500 text-sm">External resource</p>
//                       </div>
//                     </div>
//                     <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>

//                   <div className="flex items-center justify-center py-12">
//                     <div className="text-center">
//                       <div className="w-24 h-24 bg-gradient-to-br from-fuchsia-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//                         <svg className="w-12 h-12 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                         </svg>
//                       </div>
//                       <p className="text-gray-900 font-bold mb-1">
//                         {propertyLinks?.link1_url ? "Click to Access" : "Not Configured"}
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         {propertyLinks?.link1_url ? "Opens in new tab" : "Contact administrator"}
//                       </p>
//                     </div>
//                   </div>
//                 </a>

//                 {/* Quick Access 2 */}
//                 <a 
//                   href={propertyLinks?.link2_url || "#"} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="fluid-card rounded-3xl p-8 lg:p-10 border border-white/50 group animate-slide-up"
//                   style={{animationDelay: '0.4s'}}
//                   onClick={(e) => {
//                     if (!propertyLinks?.link2_url) e.preventDefault();
//                   }}
//                 >
//                   <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
//                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                         </svg>
//                       </div>
//                       <div>
//                         <h2 className="text-xl font-bold text-gray-900">
//                           {propertyLinks?.link2_title || "Quick Access 2"}
//                         </h2>
//                         <p className="text-gray-500 text-sm">External resource</p>
//                       </div>
//                     </div>
//                     <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>

//                   <div className="flex items-center justify-center py-12">
//                     <div className="text-center">
//                       <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//                         <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                         </svg>
//                       </div>
//                       <p className="text-gray-900 font-bold mb-1">
//                         {propertyLinks?.link2_url ? "Click to Access" : "Not Configured"}
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         {propertyLinks?.link2_url ? "Opens in new tab" : "Contact administrator"}
//                       </p>
//                     </div>
//                   </div>
//                 </a>
//               </div>

//             </div>
//           </>
//         )}
//       </main>

//       {/* Plan History Modal */}
//       {showPlanModal && currentPlan && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
//           <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
//             <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-bold text-white">Plan History</h3>
//                   <p className="text-white/80 text-sm mt-1">View your subscription timeline</p>
//                 </div>
//                 <button
//                   onClick={() => setShowPlanModal(false)}
//                   className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl transition-all flex items-center justify-center"
//                 >
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-8 space-y-6">
//               {/* Current Plan */}
//               <div>
//                 <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Current Plan</h4>
//                 <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
//                   <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentPlan.plan_name}</h3>
//                   <div className="grid sm:grid-cols-2 gap-4">
//                     <div className="bg-white/70 rounded-xl p-4">
//                       <p className="text-xs font-bold text-gray-500 uppercase mb-2">Service</p>
//                       <p className="text-gray-900 font-bold">{currentPlan.service_type}</p>
//                     </div>
//                     <div className="bg-white/70 rounded-xl p-4">
//                       <p className="text-xs font-bold text-gray-500 uppercase mb-2">Hours</p>
//                       <p className="text-gray-900 font-bold">{currentPlan.shift_hours}h/day</p>
//                     </div>
//                     <div className="bg-white/70 rounded-xl p-4">
//                       <p className="text-xs font-bold text-gray-500 uppercase mb-2">Price</p>
//                       <p className="gradient-text font-bold text-xl">₹{currentPlan.monthly_price}</p>
//                     </div>
//                     <div className="bg-white/70 rounded-xl p-4">
//                       <p className="text-xs font-bold text-gray-500 uppercase mb-2">Status</p>
//                       <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
//                         {currentPlan.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* History */}
//               {planHistory.length > 0 && (
//                 <div>
//                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Previous Plans</h4>
//                   <div className="space-y-3">
//                     {planHistory.map((plan, index) => (
//                       <div key={index} className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
//                         <div className="flex items-start justify-between mb-3">
//                           <p className="font-bold text-gray-900 text-lg">{plan.plan_name}</p>
//                           <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
//                             {plan.status}
//                           </span>
//                         </div>
//                         <div className="grid grid-cols-3 gap-3">
//                           <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-xs text-gray-500 mb-1">Type</p>
//                             <p className="text-sm text-gray-900 font-bold">{plan.service_type}</p>
//                           </div>
//                           <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-xs text-gray-500 mb-1">Hours</p>
//                             <p className="text-sm text-gray-900 font-bold">{plan.shift_hours}h</p>
//                           </div>
//                           <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-xs text-gray-500 mb-1">Price</p>
//                             <p className="text-sm text-gray-900 font-bold">₹{plan.monthly_price}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Request Plan Change Modal */}
//       {showRequestModal && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
//           <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-6xl w-full overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
//             <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-bold text-white">Request Plan Change</h3>
//                   <p className="text-white/80 text-sm mt-1">Choose your new service plan</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowRequestModal(false);
//                     resetRequestForm();
//                   }}
//                   className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl transition-all flex items-center justify-center"
//                 >
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-8 space-y-8">
//               {/* Step 1 */}
//               <div>
//                 <div className="flex items-center mb-5">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold mr-3 shadow-lg">1</div>
//                   <div>
//                     <h4 className="font-bold text-gray-900 text-lg">Select Service Type</h4>
//                     <p className="text-gray-600 text-sm">Dedicated or Shared</p>
//                   </div>
//                 </div>
                
//                 <div className="grid sm:grid-cols-2 gap-5">
//                   <button
//                     onClick={() => {
//                       setSelectedServiceType('dedicated');
//                       setSelectedPlan(null);
//                     }}
//                     className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
//                       selectedServiceType === 'dedicated'
//                         ? 'border-purple-500 bg-purple-50'
//                         : 'border-gray-200 hover:border-gray-300 bg-white'
//                     }`}
//                   >
//                     {selectedServiceType === 'dedicated' && (
//                       <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
//                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                     )}
                    
//                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
//                       <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <h5 className="font-bold text-gray-900 text-xl mb-2">Dedicated Service</h5>
//                     <p className="text-gray-600 text-sm">Exclusive agent for your property</p>
//                   </button>

//                   <button
//                     onClick={() => {
//                       setSelectedServiceType('shared');
//                       setSelectedPlan(null);
//                     }}
//                     className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
//                       selectedServiceType === 'shared'
//                         ? 'border-purple-500 bg-purple-50'
//                         : 'border-gray-200 hover:border-gray-300 bg-white'
//                     }`}
//                   >
//                     {selectedServiceType === 'shared' && (
//                       <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
//                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                     )}
                    
//                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg">
//                       <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                       </svg>
//                     </div>
//                     <h5 className="font-bold text-gray-900 text-xl mb-2">Shared Service</h5>
//                     <p className="text-gray-600 text-sm">Cost-effective solution</p>
//                   </button>
//                 </div>
//               </div>

//               {/* Step 2 */}
//               {selectedServiceType && (
//                 <div>
//                   <div className="flex items-center mb-5">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold mr-3 shadow-lg">2</div>
//                     <div>
//                       <h4 className="font-bold text-gray-900 text-lg">Choose Your Plan</h4>
//                       <p className="text-gray-600 text-sm">Select coverage hours</p>
//                     </div>
//                   </div>
                  
//                   <div className="grid sm:grid-cols-3 gap-5">
//                     {PLANS[selectedServiceType].map((plan) => (
//                       <button
//                         key={plan.id}
//                         onClick={() => setSelectedPlan(plan)}
//                         className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
//                           selectedPlan?.id === plan.id
//                             ? 'border-purple-500 bg-purple-50 scale-105'
//                             : 'border-gray-200 hover:border-gray-300 bg-white'
//                         }`}
//                       >
//                         {selectedPlan?.id === plan.id && (
//                           <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
//                             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </div>
//                         )}
                        
//                         <div className="mb-4">
//                           <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold mb-3">
//                             {plan.shifts} Shift{plan.shifts > 1 ? 's' : ''}
//                           </div>
//                           <h5 className="font-bold text-gray-900 text-2xl mb-1">{plan.hours} Hours</h5>
//                           <p className="text-gray-500 text-xs">Daily coverage</p>
//                         </div>
                        
//                         <div className="mb-5 pb-5 border-b border-gray-200">
//                           <div className="text-3xl font-bold gradient-text mb-1">₹{plan.monthlyFee.toLocaleString()}</div>
//                           <div className="text-sm text-gray-500">₹{plan.hourlyRate}/hour</div>
//                         </div>

//                         <div className="space-y-2 text-sm">
//                           <div className="flex items-center text-gray-600">
//                             <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                             24/7 Remote Support
//                           </div>
//                           {plan.additionalShifts > 0 && (
//                             <div className="flex items-center text-gray-600">
//                               <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                               </svg>
//                               Extra: ₹{plan.additionalShifts}/hr
//                             </div>
//                           )}
//                         </div>
//                       </button>
//                     ))}
//                   </div>

//                   {selectedPlan && (
//                     <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-2xl border border-purple-200">
//                       <h5 className="font-bold text-gray-900 mb-3 text-sm flex items-center">
//                         <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         One-Time Fees
//                       </h5>
//                       <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
//                         <div className="flex justify-between">
//                           <span>Onboarding:</span>
//                           <span className="font-bold">₹{selectedPlan.onboardingFee}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Installation:</span>
//                           <span className="font-bold">₹{selectedPlan.installationFee}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Cash Machine:</span>
//                           <span className="font-bold">₹{selectedPlan.cashMachine}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>On-site Support:</span>
//                           <span className="font-bold">₹{selectedPlan.onsiteSupport}/trip</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Step 3 */}
//               {selectedPlan && (
//                 <div>
//                   <div className="flex items-center mb-5">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold mr-3 shadow-lg">3</div>
//                     <div>
//                       <h4 className="font-bold text-gray-900 text-lg">Reason for Change <span className="text-red-500">*</span></h4>
//                       <p className="text-gray-600 text-sm">Tell us why</p>
//                     </div>
//                   </div>
                  
//                   <textarea
//                     value={requestRemarks}
//                     onChange={(e) => setRequestRemarks(e.target.value)}
//                     className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all resize-none"
//                     rows="5"
//                     placeholder="Please provide details about why you need to change your plan..."
//                   ></textarea>
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex gap-4 pt-6 border-t border-gray-200">
//                 <button
//                   onClick={() => {
//                     setShowRequestModal(false);
//                     resetRequestForm();
//                   }}
//                   className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all font-bold"
//                   disabled={requestingChange}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleRequestChange}
//                   disabled={!selectedPlan || !requestRemarks.trim() || requestingChange}
//                   className="flex-1 px-8 py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-gradient shadow-lg hover:shadow-xl"
//                 >
//                   {requestingChange ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Submitting...
//                     </span>
//                   ) : (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       Submit Request
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// // Plan pricing data
// const PLANS = {
//   dedicated: [
//     {
//       id: 'ded_8hr',
//       name: '8 Hour Service',
//       shifts: 1,
//       hours: 8,
//       monthlyFee: 1800,
//       hourlyRate: 7.50,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 7,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     },
//     {
//       id: 'ded_16hr',
//       name: '16 Hour Service',
//       shifts: 2,
//       hours: 16,
//       monthlyFee: 2880,
//       hourlyRate: 6.00,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 7,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     },
//     {
//       id: 'ded_24hr',
//       name: '24 Hour Service',
//       shifts: 3,
//       hours: 24,
//       monthlyFee: 3600,
//       hourlyRate: 5.00,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 0,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     }
//   ],
//   shared: [
//     {
//       id: 'shr_8hr',
//       name: '8 Hour Service',
//       shifts: 1,
//       hours: 8,
//       monthlyFee: 1400,
//       hourlyRate: 5.83,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 7,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     },
//     {
//       id: 'shr_16hr',
//       name: '16 Hour Service',
//       shifts: 2,
//       hours: 16,
//       monthlyFee: 1900,
//       hourlyRate: 3.96,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 7,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     },
//     {
//       id: 'shr_24hr',
//       name: '24 Hour Service',
//       shifts: 3,
//       hours: 24,
//       monthlyFee: 2400,
//       hourlyRate: 3.33,
//       onboardingFee: 1500,
//       installationFee: 1500,
//       hardwareCost: 0,
//       additionalShifts: 0,
//       cashMachine: 999,
//       remoteSupport: true,
//       onsiteSupport: 800
//     }
//   ]
// };

// export default function CustomerDashboard() {
//   const [userFname, setUserFname] = useState("");
//   const [userRole, setUserRole] = useState(null);
//   const [userEmail, setUserEmail] = useState("");
//   const [userUniqueID, setUserUniqueID] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [planHistory, setPlanHistory] = useState([]);
//   const [loadingPlan, setLoadingPlan] = useState(false);
//   const [showPlanModal, setShowPlanModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [changeRequest, setChangeRequest] = useState(null);

//   const [selectedServiceType, setSelectedServiceType] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [requestRemarks, setRequestRemarks] = useState("");
//   const [requestingChange, setRequestingChange] = useState(false);

//   const [customerProperties, setCustomerProperties] = useState([]);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [activeAgent, setActiveAgent] = useState(null);
//   const [loadingAgent, setLoadingAgent] = useState(false);

//   const [propertyLinks, setPropertyLinks] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserFname(res.data.fname);
//         setUserRole(res.data.role);
//         setUserEmail(res.data.email);
//         setUserUniqueID(res.data.unique_id);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         setError("Failed to fetch user details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (userUniqueID && userRole === 4) {
//       fetchCustomerProperties();
//     }
//   }, [userUniqueID, userRole]);

//   useEffect(() => {
//     if (selectedProperty) {
//       fetchServicePlan();
//       fetchActiveAgent();
//       fetchPropertyLinks();
//       fetchChangeRequest();
//       fetchPlanHistory();
//     }
//   }, [selectedProperty]);

//   const fetchCustomerProperties = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/properties`,
//         { params: { customer_id: userUniqueID }, withCredentials: true }
//       );
//       setCustomerProperties(res.data || []);
//       if (res.data && res.data.length > 0) {
//         setSelectedProperty(res.data[0]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch properties:", err);
//     }
//   };

//   const fetchServicePlan = async () => {
//     if (!selectedProperty) return;
//     setLoadingPlan(true);
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan`,
//         { params: { customer_id: userUniqueID, property_id: selectedProperty.property_id }, withCredentials: true }
//       );
//       setCurrentPlan(res.data);
//     } catch (err) {
//       console.error("Failed to fetch service plan:", err);
//     } finally {
//       setLoadingPlan(false);
//     }
//   };

//   const fetchPlanHistory = async () => {
//     if (!selectedProperty) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/history`,
//         { params: { customer_id: userUniqueID }, withCredentials: true }
//       );
//       setPlanHistory(res.data || []);
//     } catch (err) {
//       console.error("Failed to fetch plan history:", err);
//     }
//   };

//   const fetchChangeRequest = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/change-request`,
//         { params: { customer_id: userUniqueID }, withCredentials: true }
//       );
//       setChangeRequest(res.data);
//     } catch (err) {
//       console.error("Failed to fetch change request:", err);
//     }
//   };

//   const fetchActiveAgent = async () => {
//     if (!selectedProperty) return;
//     setLoadingAgent(true);
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/agent-schedule`,
//         { params: { property_id: selectedProperty.property_id }, withCredentials: true }
//       );
//       setActiveAgent(res.data);
//     } catch (err) {
//       console.error("Failed to fetch active agent:", err);
//       setActiveAgent({ status: 'NO_ACTIVE_AGENT' });
//     } finally {
//       setLoadingAgent(false);
//     }
//   };

//   const fetchPropertyLinks = async () => {
//     if (!selectedProperty) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/property-links`,
//         { params: { property_id: selectedProperty.property_id }, withCredentials: true }
//       );
//       setPropertyLinks(res.data);
//     } catch (err) {
//       console.error("Failed to fetch property links:", err);
//     }
//   };

//   const handleRequestChange = async () => {
//     if (!selectedPlan || !requestRemarks.trim()) {
//       alert("Please select a plan and provide remarks");
//       return;
//     }
//     setRequestingChange(true);
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/change-request`,
//         {
//           customer_id: userUniqueID,
//           property_id: selectedProperty.property_id,
//           current_plan_id: currentPlan.id,
//           requested_plan_name: selectedPlan.name,
//           requested_service_type: selectedServiceType,
//           requested_shift_hours: selectedPlan.hours.toString(),
//           requested_monthly_price: selectedPlan.monthlyFee.toString(),
//           remarks: requestRemarks
//         },
//         { withCredentials: true }
//       );
//       alert("Package change request submitted successfully!");
//       setShowRequestModal(false);
//       resetRequestForm();
//       fetchServicePlan();
//       fetchChangeRequest();
//     } catch (err) {
//       console.error("Failed to submit request:", err);
//       alert("Failed to submit request. Please try again.");
//     } finally {
//       setRequestingChange(false);
//     }
//   };

//   const resetRequestForm = () => {
//     setSelectedServiceType(null);
//     setSelectedPlan(null);
//     setRequestRemarks("");
//   };

//   const handlePropertyChange = (property) => {
//     setSelectedProperty(property);
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-500 text-sm font-medium">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-4">
//         <div className="text-center max-w-sm">
//           <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h2>
//           <p className="text-gray-500 text-sm">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   // Access Restricted
//   if (userRole !== 4) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-4">
//         <div className="text-center max-w-sm">
//           <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-semibold text-gray-900 mb-1">Access Restricted</h2>
//           <p className="text-gray-500 text-sm">This portal is exclusively for customers.</p>
//         </div>
//       </div>
//     );
//   }

//   const isPlanChangeRequested = currentPlan?.status === 'PENDING_CHANGE' ||
//     (changeRequest && changeRequest.status === 'PENDING');

//   const today = new Date();
//   const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";

//   return (
//     <div className="min-h-screen bg-gray-50/80">
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
//         * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
//         .delay-1 { animation-delay: 0.05s; }
//         .delay-2 { animation-delay: 0.1s; }
//         .delay-3 { animation-delay: 0.15s; }
//         .delay-4 { animation-delay: 0.2s; }
//       `}</style>

//       {/* Header */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
//           <div className="flex items-center justify-between">
//             <div className="animate-fadeIn">
//               <p className="text-sm text-gray-500 mb-0.5">{greeting},</p>
//               <h1 className="text-2xl font-bold text-gray-900">{userFname}</h1>
//             </div>
//             <div className="flex items-center gap-3">
//               {/* Property Selector in Header */}
//               {customerProperties.length > 1 && (
//                 <select
//                   value={selectedProperty?.property_id || ""}
//                   onChange={(e) => {
//                     const property = customerProperties.find(p => p.property_id === e.target.value);
//                     handlePropertyChange(property);
//                   }}
//                   className="text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
//                 >
//                   {customerProperties.map((property) => (
//                     <option key={property.property_id} value={property.property_id}>
//                       {property.property_name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
//                 <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                 <span className="text-xs font-medium text-blue-700">Active</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {!selectedProperty ? (
//           <div className="bg-white rounded-xl border border-gray-200 p-16 text-center animate-fadeIn">
//             <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">No Properties Available</h3>
//             <p className="text-sm text-gray-500">Contact your administrator to set up your properties.</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {/* Top Row - Service Plan & Agent */}
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

//               {/* Service Plan Card - Takes 3/5 */}
//               <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 animate-fadeIn delay-1" style={{opacity: 0}}>
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
//                       <svg className="w-[18px] h-[18px] text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <h2 className="text-base font-semibold text-gray-900">Service Plan</h2>
//                   </div>
//                   <button
//                     onClick={() => setShowPlanModal(true)}
//                     className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
//                   >
//                     View History
//                   </button>
//                 </div>

//                 <div className="p-6">
//                   {loadingPlan ? (
//                     <div className="text-center py-12">
//                       <div className="w-8 h-8 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
//                       <p className="text-sm text-gray-400">Loading plan...</p>
//                     </div>
//                   ) : currentPlan ? (
//                     <div className="space-y-5">
//                       {/* Plan Name & Status */}
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <h3 className="text-xl font-bold text-gray-900">{currentPlan.plan_name}</h3>
//                           <p className="text-sm text-gray-500 mt-0.5">{currentPlan.service_type} Service</p>
//                         </div>
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
//                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                           {currentPlan.status}
//                         </span>
//                       </div>

//                       {/* Metrics Row */}
//                       <div className="grid grid-cols-3 gap-3">
//                         <div className="bg-gray-50 rounded-lg px-4 py-3">
//                           <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Coverage</p>
//                           <p className="text-lg font-bold text-gray-900">{currentPlan.shift_hours}<span className="text-sm font-normal text-gray-500">h/day</span></p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg px-4 py-3">
//                           <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Service</p>
//                           <p className="text-lg font-bold text-gray-900">{currentPlan.service_type}</p>
//                         </div>
//                         <div className="bg-blue-50 rounded-lg px-4 py-3">
//                           <p className="text-[11px] font-medium text-blue-500 uppercase tracking-wide mb-1">Monthly</p>
//                           <p className="text-lg font-bold text-blue-700">₹{currentPlan.monthly_price}</p>
//                         </div>
//                       </div>

//                       {/* Change Plan Button */}
//                       <button
//                         onClick={() => setShowRequestModal(true)}
//                         disabled={isPlanChangeRequested}
//                         className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
//                       >
//                         {isPlanChangeRequested ? (
//                           <span className="flex items-center justify-center gap-2">
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Change Request Pending
//                           </span>
//                         ) : (
//                           "Request Plan Change"
//                         )}
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
//                         <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
//                         </svg>
//                       </div>
//                       <p className="text-sm font-medium text-gray-700">No Active Plan</p>
//                       <p className="text-xs text-gray-400 mt-0.5">Contact your administrator</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Agent Card - Takes 2/5 */}
//               <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 animate-fadeIn delay-2" style={{opacity: 0}}>
//                 <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
//                   <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
//                     <svg className="w-[18px] h-[18px] text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                     </svg>
//                   </div>
//                   <h2 className="text-base font-semibold text-gray-900">On-Duty Agent</h2>
//                 </div>

//                 <div className="p-6">
//                   {loadingAgent ? (
//                     <div className="text-center py-12">
//                       <div className="w-8 h-8 border-[3px] border-green-100 border-t-green-600 rounded-full animate-spin mx-auto mb-3"></div>
//                       <p className="text-sm text-gray-400">Checking status...</p>
//                     </div>
//                   ) : activeAgent?.status === 'ACTIVE' ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-3">
//                         <div className="relative">
//                           <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold">
//                             {activeAgent.agent_name?.charAt(0).toUpperCase() || 'A'}
//                           </div>
//                           <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900">{activeAgent.agent_name}</p>
//                           <p className="text-xs text-green-600 font-medium">Active Now</p>
//                         </div>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">Current Shift</p>
//                         <div className="flex items-center justify-between">
//                           <div className="text-center">
//                             <p className="text-xs text-gray-400 mb-1">Start</p>
//                             <p className="text-sm font-semibold text-gray-900">{activeAgent.shift_start}</p>
//                           </div>
//                           <div className="flex-1 mx-4 border-t-2 border-dashed border-gray-200 relative">
//                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-xs text-gray-400 mb-1">End</p>
//                             <p className="text-sm font-semibold text-gray-900">{activeAgent.shift_end}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
//                         <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM6.75 9.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
//                         </svg>
//                       </div>
//                       <p className="text-sm font-medium text-gray-700">No Agent On Duty</p>
//                       <p className="text-xs text-gray-400 mt-0.5">Check back later</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Row - Quick Access Links */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Link 1 */}
//               <a
//                 href={propertyLinks?.link1_url || "#"}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => { if (!propertyLinks?.link1_url) e.preventDefault(); }}
//                 className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all animate-fadeIn delay-3"
//                 style={{opacity: 0}}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
//                       <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{propertyLinks?.link1_title || "Quick Access 1"}</p>
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {propertyLinks?.link1_url ? "Opens in new tab" : "Not configured"}
//                       </p>
//                     </div>
//                   </div>
//                   <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//                   </svg>
//                 </div>
//               </a>

//               {/* Link 2 */}
//               <a
//                 href={propertyLinks?.link2_url || "#"}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => { if (!propertyLinks?.link2_url) e.preventDefault(); }}
//                 className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all animate-fadeIn delay-4"
//                 style={{opacity: 0}}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
//                       <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{propertyLinks?.link2_title || "Quick Access 2"}</p>
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {propertyLinks?.link2_url ? "Opens in new tab" : "Not configured"}
//                       </p>
//                     </div>
//                   </div>
//                   <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//                   </svg>
//                 </div>
//               </a>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Plan History Modal */}
//       {showPlanModal && currentPlan && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPlanModal(false)}>
//           <div className="bg-white rounded-xl max-w-2xl w-full overflow-hidden max-h-[85vh] overflow-y-auto shadow-xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
//               <h3 className="text-lg font-semibold text-gray-900">Plan History</h3>
//               <button
//                 onClick={() => setShowPlanModal(false)}
//                 className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
//               >
//                 <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               {/* Current Plan */}
//               <div>
//                 <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Current Plan</p>
//                 <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
//                   <div className="flex items-start justify-between mb-4">
//                     <h4 className="text-lg font-bold text-gray-900">{currentPlan.plan_name}</h4>
//                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                       {currentPlan.status}
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-3">
//                     <div className="bg-white rounded-md px-3 py-2.5">
//                       <p className="text-[11px] text-gray-400 uppercase mb-0.5">Service</p>
//                       <p className="text-sm font-semibold text-gray-900">{currentPlan.service_type}</p>
//                     </div>
//                     <div className="bg-white rounded-md px-3 py-2.5">
//                       <p className="text-[11px] text-gray-400 uppercase mb-0.5">Hours</p>
//                       <p className="text-sm font-semibold text-gray-900">{currentPlan.shift_hours}h/day</p>
//                     </div>
//                     <div className="bg-white rounded-md px-3 py-2.5">
//                       <p className="text-[11px] text-gray-400 uppercase mb-0.5">Monthly</p>
//                       <p className="text-sm font-semibold text-blue-700">₹{currentPlan.monthly_price}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* History */}
//               {planHistory.length > 0 && (
//                 <div>
//                   <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Previous Plans</p>
//                   <div className="space-y-2">
//                     {planHistory.map((plan, index) => (
//                       <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
//                         <div className="flex items-center justify-between mb-2">
//                           <p className="font-semibold text-gray-900">{plan.plan_name}</p>
//                           <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">{plan.status}</span>
//                         </div>
//                         <div className="flex items-center gap-4 text-xs text-gray-500">
//                           <span>{plan.service_type}</span>
//                           <span>•</span>
//                           <span>{plan.shift_hours}h/day</span>
//                           <span>•</span>
//                           <span className="font-medium text-gray-700">₹{plan.monthly_price}/mo</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Request Plan Change Modal */}
//       {showRequestModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowRequestModal(false); resetRequestForm(); }}>
//           <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Request Plan Change</h3>
//                 <p className="text-xs text-gray-400 mt-0.5">Choose your new service plan</p>
//               </div>
//               <button
//                 onClick={() => { setShowRequestModal(false); resetRequestForm(); }}
//                 className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
//               >
//                 <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Step 1: Service Type */}
//               <div>
//                 <div className="flex items-center gap-2 mb-3">
//                   <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">1</span>
//                   <p className="text-sm font-semibold text-gray-900">Select Service Type</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => { setSelectedServiceType('dedicated'); setSelectedPlan(null); }}
//                     className={`relative p-4 rounded-lg border-2 transition-all text-left ${
//                       selectedServiceType === 'dedicated'
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300 bg-white'
//                     }`}
//                   >
//                     {selectedServiceType === 'dedicated' && (
//                       <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
//                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                     )}
//                     <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-2">
//                       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
//                       </svg>
//                     </div>
//                     <p className="font-semibold text-sm text-gray-900">Dedicated</p>
//                     <p className="text-xs text-gray-500 mt-0.5">Exclusive agent</p>
//                   </button>

//                   <button
//                     onClick={() => { setSelectedServiceType('shared'); setSelectedPlan(null); }}
//                     className={`relative p-4 rounded-lg border-2 transition-all text-left ${
//                       selectedServiceType === 'shared'
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300 bg-white'
//                     }`}
//                   >
//                     {selectedServiceType === 'shared' && (
//                       <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
//                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                     )}
//                     <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-2">
//                       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
//                       </svg>
//                     </div>
//                     <p className="font-semibold text-sm text-gray-900">Shared</p>
//                     <p className="text-xs text-gray-500 mt-0.5">Cost-effective</p>
//                   </button>
//                 </div>
//               </div>

//               {/* Step 2: Plan */}
//               {selectedServiceType && (
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">2</span>
//                     <p className="text-sm font-semibold text-gray-900">Choose Plan</p>
//                   </div>

//                   <div className="grid grid-cols-3 gap-3">
//                     {PLANS[selectedServiceType].map((plan) => (
//                       <button
//                         key={plan.id}
//                         onClick={() => setSelectedPlan(plan)}
//                         className={`relative p-4 rounded-lg border-2 transition-all text-left ${
//                           selectedPlan?.id === plan.id
//                             ? 'border-blue-500 bg-blue-50'
//                             : 'border-gray-200 hover:border-gray-300 bg-white'
//                         }`}
//                       >
//                         {selectedPlan?.id === plan.id && (
//                           <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
//                             <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </div>
//                         )}
//                         <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded mb-2">
//                           {plan.shifts} Shift{plan.shifts > 1 ? 's' : ''}
//                         </span>
//                         <p className="text-lg font-bold text-gray-900">{plan.hours}h</p>
//                         <p className="text-xs text-gray-400 mb-3">Daily coverage</p>
//                         <div className="border-t border-gray-100 pt-3">
//                           <p className="text-base font-bold text-blue-700">₹{plan.monthlyFee.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/mo</span></p>
//                           <p className="text-[11px] text-gray-400">₹{plan.hourlyRate}/hr</p>
//                         </div>
//                         <div className="mt-3 space-y-1">
//                           <p className="text-[11px] text-gray-500 flex items-center gap-1">
//                             <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
//                             </svg>
//                             Remote Support
//                           </p>
//                           {plan.additionalShifts > 0 && (
//                             <p className="text-[11px] text-gray-500 flex items-center gap-1">
//                               <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
//                               </svg>
//                               Extra: ₹{plan.additionalShifts}/hr
//                             </p>
//                           )}
//                         </div>
//                       </button>
//                     ))}
//                   </div>

//                   {/* One-time Fees */}
//                   {selectedPlan && (
//                     <div className="mt-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
//                       <p className="text-xs font-medium text-gray-500 mb-2">One-Time Fees</p>
//                       <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-600">
//                         <div className="flex justify-between">
//                           <span>Onboarding</span>
//                           <span className="font-semibold text-gray-900">₹{selectedPlan.onboardingFee}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Installation</span>
//                           <span className="font-semibold text-gray-900">₹{selectedPlan.installationFee}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Cash Machine</span>
//                           <span className="font-semibold text-gray-900">₹{selectedPlan.cashMachine}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>On-site Support</span>
//                           <span className="font-semibold text-gray-900">₹{selectedPlan.onsiteSupport}/trip</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Step 3: Remarks */}
//               {selectedPlan && (
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">3</span>
//                     <p className="text-sm font-semibold text-gray-900">Reason for Change <span className="text-red-500">*</span></p>
//                   </div>
//                   <textarea
//                     value={requestRemarks}
//                     onChange={(e) => setRequestRemarks(e.target.value)}
//                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none"
//                     rows="4"
//                     placeholder="Please describe why you'd like to change your plan..."
//                   ></textarea>
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex gap-3 pt-4 border-t border-gray-100">
//                 <button
//                   onClick={() => { setShowRequestModal(false); resetRequestForm(); }}
//                   className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
//                   disabled={requestingChange}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleRequestChange}
//                   disabled={!selectedPlan || !requestRemarks.trim() || requestingChange}
//                   className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
//                 >
//                   {requestingChange ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Submitting...
//                     </span>
//                   ) : (
//                     "Submit Request"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// const PLANS = {
//   dedicated: [
//     {
//       id: 'ded_8hr', name: '8 Hour Service', shifts: 1, hours: 8,
//       monthlyFee: 1800, hourlyRate: 7.50, onboardingFee: 1500,
//       installationFee: 1500, hardwareCost: 0, additionalShifts: 7,
//       cashMachine: 999, remoteSupport: true, onsiteSupport: 800
//     },
//     {
//       id: 'ded_16hr', name: '16 Hour Service', shifts: 2, hours: 16,
//       monthlyFee: 2880, hourlyRate: 6.00, onboardingFee: 1500,
//       installationFee: 1500, hardwareCost: 0, additionalShifts: 7,
//       cashMachine: 999, remoteSupport: true, onsiteSupport: 800
//     },
//     {
//       id: 'ded_24hr', name: '24 Hour Service', shifts: 3, hours: 24,
//       monthlyFee: 3600, hourlyRate: 5.00, onboardingFee: 1500,
//       installationFee: 1500, hardwareCost: 0, additionalShifts: 0,
//       cashMachine: 999, remoteSupport: true, onsiteSupport: 800
//     }
//   ],
//   shared: [
//     {
//       id: 'shr_8hr', name: '8 Hour Service', shifts: 1, hours: 8,
//       monthlyFee: 1400, hourlyRate: 5.83, onboardingFee: 1500,
//       installationFee: 1500, hardwareCost: 0, additionalShifts: 7,
//       cashMachine: 999, remoteSupport: true, onsiteSupport: 800
//     },
//     {
//       id: 'shr_16hr', name: '16 Hour Service', shifts: 2, hours: 16,
//       monthlyFee: 1900, hourlyRate: 3.96, onboardingFee: 1500,
//       installationFee: 1500, hardwareCost: 0, additionalShifts: 7,
//       cashMachine: 999, remoteSupport: true, onsiteSupport: 800
//     },
//     {
//       id: 'shr_24hr', name: '24 Hour Service', shifts: 3, hours: 24,
//       monthlyFee: 2400, hourlyRate: 3.33, onboardingFee: 1500,
//       installationFee: 1500, hardwareCost: 0, additionalShifts: 0,
//       cashMachine: 999, remoteSupport: true, onsiteSupport: 800
//     }
//   ]
// };

// export default function CustomerDashboard() {
//   const [userFname, setUserFname] = useState("");
//   const [userRole, setUserRole] = useState(null);
//   const [userEmail, setUserEmail] = useState("");
//   const [userUniqueID, setUserUniqueID] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [planHistory, setPlanHistory] = useState([]);
//   const [loadingPlan, setLoadingPlan] = useState(false);
//   const [showPlanModal, setShowPlanModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [changeRequest, setChangeRequest] = useState(null);

//   const [selectedServiceType, setSelectedServiceType] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [requestRemarks, setRequestRemarks] = useState("");
//   const [requestingChange, setRequestingChange] = useState(false);

//   const [customerProperties, setCustomerProperties] = useState([]);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [activeAgent, setActiveAgent] = useState(null);
//   const [loadingAgent, setLoadingAgent] = useState(false);

//   const [propertyLinks, setPropertyLinks] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserFname(res.data.fname);
//         setUserRole(res.data.role);
//         setUserEmail(res.data.email);
//         setUserUniqueID(res.data.unique_id);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         setError("Failed to fetch user details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (userUniqueID && userRole === 4) {
//       fetchCustomerProperties();
//     }
//   }, [userUniqueID, userRole]);

//   useEffect(() => {
//     if (selectedProperty) {
//       fetchServicePlan();
//       fetchActiveAgent();
//       fetchPropertyLinks();
//       fetchChangeRequest();
//       fetchPlanHistory();
//     }
//   }, [selectedProperty]);

//   const fetchCustomerProperties = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/properties`,
//         { params: { customer_id: userUniqueID }, withCredentials: true }
//       );
//       setCustomerProperties(res.data || []);
//       if (res.data && res.data.length > 0) {
//         setSelectedProperty(res.data[0]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch properties:", err);
//     }
//   };

//   const fetchServicePlan = async () => {
//     if (!selectedProperty) return;
//     setLoadingPlan(true);
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan`,
//         { params: { customer_id: userUniqueID, property_id: selectedProperty.property_id }, withCredentials: true }
//       );
//       setCurrentPlan(res.data);
//     } catch (err) {
//       console.error("Failed to fetch service plan:", err);
//     } finally {
//       setLoadingPlan(false);
//     }
//   };

//   const fetchPlanHistory = async () => {
//     if (!selectedProperty) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/history`,
//         { params: { customer_id: userUniqueID }, withCredentials: true }
//       );
//       setPlanHistory(res.data || []);
//     } catch (err) {
//       console.error("Failed to fetch plan history:", err);
//     }
//   };

//   const fetchChangeRequest = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/change-request`,
//         { params: { customer_id: userUniqueID }, withCredentials: true }
//       );
//       setChangeRequest(res.data);
//     } catch (err) {
//       console.error("Failed to fetch change request:", err);
//     }
//   };

//   const fetchActiveAgent = async () => {
//     if (!selectedProperty) return;
//     setLoadingAgent(true);
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/agent-schedule`,
//         { params: { property_id: selectedProperty.property_id }, withCredentials: true }
//       );
//       setActiveAgent(res.data);
//     } catch (err) {
//       console.error("Failed to fetch active agent:", err);
//       setActiveAgent({ status: 'NO_ACTIVE_AGENT' });
//     } finally {
//       setLoadingAgent(false);
//     }
//   };

//   const fetchPropertyLinks = async () => {
//     if (!selectedProperty) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/property-links`,
//         { params: { property_id: selectedProperty.property_id }, withCredentials: true }
//       );
//       setPropertyLinks(res.data);
//     } catch (err) {
//       console.error("Failed to fetch property links:", err);
//     }
//   };

//   const handleRequestChange = async () => {
//     if (!selectedPlan || !requestRemarks.trim()) {
//       alert("Please select a plan and provide remarks");
//       return;
//     }
//     setRequestingChange(true);
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/change-request`,
//         {
//           customer_id: userUniqueID,
//           property_id: selectedProperty.property_id,
//           current_plan_id: currentPlan.id,
//           requested_plan_name: selectedPlan.name,
//           requested_service_type: selectedServiceType,
//           requested_shift_hours: selectedPlan.hours.toString(),
//           requested_monthly_price: selectedPlan.monthlyFee.toString(),
//           remarks: requestRemarks
//         },
//         { withCredentials: true }
//       );
//       alert("Package change request submitted successfully!");
//       setShowRequestModal(false);
//       resetRequestForm();
//       fetchServicePlan();
//       fetchChangeRequest();
//     } catch (err) {
//       console.error("Failed to submit request:", err);
//       alert("Failed to submit request. Please try again.");
//     } finally {
//       setRequestingChange(false);
//     }
//   };

//   const resetRequestForm = () => {
//     setSelectedServiceType(null);
//     setSelectedPlan(null);
//     setRequestRemarks("");
//   };

//   const handlePropertyChange = (property) => {
//     setSelectedProperty(property);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-slate-400 text-sm font-medium">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-4">
//         <div className="text-center max-w-sm">
//           <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h2>
//           <p className="text-slate-500 text-sm">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (userRole !== 4) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-4">
//         <div className="text-center max-w-sm">
//           <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-semibold text-slate-900 mb-1">Access Restricted</h2>
//           <p className="text-slate-500 text-sm">This portal is exclusively for customers.</p>
//         </div>
//       </div>
//     );
//   }

//   const isPlanChangeRequested = currentPlan?.status === 'PENDING_CHANGE' ||
//     (changeRequest && changeRequest.status === 'PENDING');

//   const today = new Date();
//   const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";

//   const hasSharedFolder = propertyLinks?.shared_folder_url;
//   const hasInvoicePortal = propertyLinks?.invoice_portal_url;

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//         * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .fade-up { animation: fadeUp 0.35s ease-out forwards; opacity: 0; }
//         .fade-up-1 { animation-delay: 0.04s; }
//         .fade-up-2 { animation-delay: 0.08s; }
//         .fade-up-3 { animation-delay: 0.12s; }
//         .fade-up-4 { animation-delay: 0.16s; }
//       `}</style>

//       {/* ========== HEADER ========== */}
//       <header className="bg-white border-b border-slate-200">
//         <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="fade-up">
//               <p className="text-xs font-medium text-blue-600 tracking-wide uppercase mb-0.5">{greeting}</p>
//               <h1 className="text-xl font-bold text-slate-900">{userFname}</h1>
//             </div>
//             <div className="flex items-center gap-3">
//               {customerProperties.length > 1 && (
//                 <select
//                   value={selectedProperty?.property_id || ""}
//                   onChange={(e) => {
//                     const property = customerProperties.find(p => p.property_id === e.target.value);
//                     handlePropertyChange(property);
//                   }}
//                   className="text-sm px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
//                 >
//                   {customerProperties.map((property) => (
//                     <option key={property.property_id} value={property.property_id}>
//                       {property.property_name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
//                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
//                 <span className="text-[11px] font-semibold text-blue-700 tracking-wide">ONLINE</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ========== MAIN ========== */}
//       <main className="w-full px-4 sm:px-6 lg:px-8 py-5">
//         {!selectedProperty ? (
//           <div className="bg-white rounded-xl border border-slate-200 p-16 text-center fade-up">
//             <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-slate-900 mb-1">No Properties Available</h3>
//             <p className="text-sm text-slate-500">Contact your administrator to set up your properties.</p>
//           </div>
//         ) : (
//           <div className="space-y-5">

//             {/* ===== ROW 1: Service Plan + Agent ===== */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

//               {/* Service Plan Card */}
//               <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 fade-up fade-up-1">
//                 <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
//                   <div className="flex items-center gap-2.5">
//                     <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <h2 className="text-sm font-semibold text-slate-900">Service Plan</h2>
//                   </div>
//                   <button
//                     onClick={() => setShowPlanModal(true)}
//                     className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
//                   >
//                     History →
//                   </button>
//                 </div>

//                 <div className="p-5">
//                   {loadingPlan ? (
//                     <div className="text-center py-10">
//                       <div className="w-7 h-7 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
//                       <p className="text-xs text-slate-400">Loading plan...</p>
//                     </div>
//                   ) : currentPlan ? (
//                     <div className="space-y-4">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <h3 className="text-lg font-bold text-slate-900">{currentPlan.plan_name}</h3>
//                           <p className="text-xs text-slate-500 mt-0.5">{currentPlan.service_type} Service</p>
//                         </div>
//                         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
//                           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
//                           {currentPlan.status}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-3 gap-3">
//                         <div className="bg-slate-50 rounded-lg px-3.5 py-3 border border-slate-100">
//                           <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Coverage</p>
//                           <p className="text-base font-bold text-slate-900">{currentPlan.shift_hours}<span className="text-xs font-medium text-slate-400 ml-0.5">h/day</span></p>
//                         </div>
//                         <div className="bg-slate-50 rounded-lg px-3.5 py-3 border border-slate-100">
//                           <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</p>
//                           <p className="text-base font-bold text-slate-900">{currentPlan.service_type}</p>
//                         </div>
//                         <div className="bg-blue-50 rounded-lg px-3.5 py-3 border border-blue-100">
//                           <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1">Monthly</p>
//                           <p className="text-base font-bold text-blue-700">₹{currentPlan.monthly_price}</p>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() => setShowRequestModal(true)}
//                         disabled={isPlanChangeRequested}
//                         className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
//                       >
//                         {isPlanChangeRequested ? (
//                           <span className="flex items-center justify-center gap-1.5">
//                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Change Request Pending
//                           </span>
//                         ) : "Request Plan Change"}
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="text-center py-10">
//                       <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
//                         <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
//                         </svg>
//                       </div>
//                       <p className="text-sm font-medium text-slate-600">No Active Plan</p>
//                       <p className="text-xs text-slate-400 mt-0.5">Contact your administrator</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Agent Card */}
//               <div className="bg-white rounded-xl border border-slate-200 fade-up fade-up-2">
//                 <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
//                   <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
//                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                     </svg>
//                   </div>
//                   <h2 className="text-sm font-semibold text-slate-900">On-Duty Agent</h2>
//                 </div>

//                 <div className="p-5">
//                   {loadingAgent ? (
//                     <div className="text-center py-10">
//                       <div className="w-7 h-7 border-[3px] border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
//                       <p className="text-xs text-slate-400">Checking status...</p>
//                     </div>
//                   ) : activeAgent?.status === 'ACTIVE' ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-3">
//                         <div className="relative">
//                           <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white text-base font-semibold">
//                             {activeAgent.agent_name?.charAt(0).toUpperCase() || 'A'}
//                           </div>
//                           <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-slate-900">{activeAgent.agent_name}</p>
//                           <p className="text-[11px] text-emerald-600 font-semibold">Active Now</p>
//                         </div>
//                       </div>

//                       <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
//                         <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-3">Current Shift</p>
//                         <div className="flex items-center justify-between">
//                           <div className="text-center">
//                             <p className="text-[10px] text-blue-400 font-medium mb-1">START</p>
//                             <p className="text-sm font-bold text-blue-900">{activeAgent.shift_start}</p>
//                           </div>
//                           <div className="flex-1 mx-3 relative">
//                             <div className="border-t-2 border-dashed border-blue-200"></div>
//                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-[10px] text-blue-400 font-medium mb-1">END</p>
//                             <p className="text-sm font-bold text-blue-900">{activeAgent.shift_end}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-10">
//                       <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
//                         <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM6.75 9.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
//                         </svg>
//                       </div>
//                       <p className="text-sm font-medium text-slate-600">No Agent On Duty</p>
//                       <p className="text-xs text-slate-400 mt-0.5">Check back later</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* ===== ROW 2: Links from CM_PROPERTY_LINKS ===== */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               {/* Shared Folder */}
//               <div
//                 onClick={() => { if (hasSharedFolder) window.open(propertyLinks.shared_folder_url, '_blank', 'noopener,noreferrer'); }}
//                 className={`bg-white rounded-xl border border-slate-200 p-5 fade-up fade-up-3 transition-all ${hasSharedFolder ? 'cursor-pointer hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 active:scale-[0.99]' : 'opacity-60'}`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasSharedFolder ? 'bg-blue-100' : 'bg-slate-100'}`}>
//                       <svg className={`w-5 h-5 ${hasSharedFolder ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900">Shared Folder</p>
//                       <p className="text-[11px] text-slate-400 mt-0.5">{hasSharedFolder ? 'Tap to open in new tab' : 'Not configured yet'}</p>
//                     </div>
//                   </div>
//                   {hasSharedFolder && (
//                     <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
//                       <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Invoice Portal */}
//               <div
//                 onClick={() => { if (hasInvoicePortal) window.open(propertyLinks.invoice_portal_url, '_blank', 'noopener,noreferrer'); }}
//                 className={`bg-white rounded-xl border border-slate-200 p-5 fade-up fade-up-4 transition-all ${hasInvoicePortal ? 'cursor-pointer hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 active:scale-[0.99]' : 'opacity-60'}`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasInvoicePortal ? 'bg-blue-100' : 'bg-slate-100'}`}>
//                       <svg className={`w-5 h-5 ${hasInvoicePortal ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900">Invoice Portal</p>
//                       <p className="text-[11px] text-slate-400 mt-0.5">{hasInvoicePortal ? 'Tap to open in new tab' : 'Not configured yet'}</p>
//                     </div>
//                   </div>
//                   {hasInvoicePortal && (
//                     <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
//                       <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//           </div>
//         )}
//       </main>

//       {/* ========== PLAN HISTORY MODAL ========== */}
//       {showPlanModal && currentPlan && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPlanModal(false)}>
//           <div className="bg-white rounded-xl max-w-xl w-full overflow-hidden max-h-[85vh] overflow-y-auto shadow-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
//               <h3 className="text-base font-bold text-slate-900">Plan History</h3>
//               <button onClick={() => setShowPlanModal(false)} className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors">
//                 <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-5 space-y-5">
//               <div>
//                 <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-2">Current Plan</p>
//                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
//                   <div className="flex items-start justify-between mb-3">
//                     <h4 className="text-base font-bold text-slate-900">{currentPlan.plan_name}</h4>
//                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
//                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
//                       {currentPlan.status}
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2">
//                     <div className="bg-white rounded-md px-2.5 py-2">
//                       <p className="text-[10px] text-slate-400 uppercase mb-0.5">Service</p>
//                       <p className="text-xs font-semibold text-slate-900">{currentPlan.service_type}</p>
//                     </div>
//                     <div className="bg-white rounded-md px-2.5 py-2">
//                       <p className="text-[10px] text-slate-400 uppercase mb-0.5">Hours</p>
//                       <p className="text-xs font-semibold text-slate-900">{currentPlan.shift_hours}h/day</p>
//                     </div>
//                     <div className="bg-white rounded-md px-2.5 py-2">
//                       <p className="text-[10px] text-slate-400 uppercase mb-0.5">Monthly</p>
//                       <p className="text-xs font-semibold text-blue-700">₹{currentPlan.monthly_price}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {planHistory.length > 0 && (
//                 <div>
//                   <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Previous Plans</p>
//                   <div className="space-y-2">
//                     {planHistory.map((plan, index) => (
//                       <div key={index} className="bg-white rounded-lg p-3.5 border border-slate-100 hover:border-slate-200 transition-colors">
//                         <div className="flex items-center justify-between mb-1.5">
//                           <p className="text-sm font-semibold text-slate-900">{plan.plan_name}</p>
//                           <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">{plan.status}</span>
//                         </div>
//                         <div className="flex items-center gap-3 text-[11px] text-slate-500">
//                           <span>{plan.service_type}</span>
//                           <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
//                           <span>{plan.shift_hours}h/day</span>
//                           <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
//                           <span className="font-semibold text-slate-700">₹{plan.monthly_price}/mo</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== REQUEST PLAN CHANGE MODAL ========== */}
//       {showRequestModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowRequestModal(false); resetRequestForm(); }}>
//           <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
//               <div>
//                 <h3 className="text-base font-bold text-slate-900">Request Plan Change</h3>
//                 <p className="text-[11px] text-slate-400 mt-0.5">Choose your new service plan</p>
//               </div>
//               <button onClick={() => { setShowRequestModal(false); resetRequestForm(); }} className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors">
//                 <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-5 space-y-6">
//               {/* Step 1 */}
//               <div>
//                 <div className="flex items-center gap-2 mb-3">
//                   <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
//                   <p className="text-sm font-semibold text-slate-900">Select Service Type</p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => { setSelectedServiceType('dedicated'); setSelectedPlan(null); }}
//                     className={`relative p-4 rounded-lg border-2 transition-all text-left ${selectedServiceType === 'dedicated' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
//                   >
//                     {selectedServiceType === 'dedicated' && (
//                       <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
//                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
//                       </div>
//                     )}
//                     <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-2">
//                       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
//                     </div>
//                     <p className="text-sm font-semibold text-slate-900">Dedicated</p>
//                     <p className="text-[11px] text-slate-500 mt-0.5">Exclusive agent for your property</p>
//                   </button>
//                   <button
//                     onClick={() => { setSelectedServiceType('shared'); setSelectedPlan(null); }}
//                     className={`relative p-4 rounded-lg border-2 transition-all text-left ${selectedServiceType === 'shared' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
//                   >
//                     {selectedServiceType === 'shared' && (
//                       <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
//                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
//                       </div>
//                     )}
//                     <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-2">
//                       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
//                     </div>
//                     <p className="text-sm font-semibold text-slate-900">Shared</p>
//                     <p className="text-[11px] text-slate-500 mt-0.5">Cost-effective shared solution</p>
//                   </button>
//                 </div>
//               </div>

//               {/* Step 2 */}
//               {selectedServiceType && (
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
//                     <p className="text-sm font-semibold text-slate-900">Choose Plan</p>
//                   </div>
//                   <div className="grid grid-cols-3 gap-3">
//                     {PLANS[selectedServiceType].map((plan) => (
//                       <button
//                         key={plan.id}
//                         onClick={() => setSelectedPlan(plan)}
//                         className={`relative p-4 rounded-lg border-2 transition-all text-left ${selectedPlan?.id === plan.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
//                       >
//                         {selectedPlan?.id === plan.id && (
//                           <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
//                             <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
//                           </div>
//                         )}
//                         <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded mb-2">
//                           {plan.shifts} Shift{plan.shifts > 1 ? 's' : ''}
//                         </span>
//                         <p className="text-lg font-bold text-slate-900">{plan.hours}h</p>
//                         <p className="text-[10px] text-slate-400 mb-2.5">Daily coverage</p>
//                         <div className="border-t border-slate-100 pt-2.5">
//                           <p className="text-base font-bold text-blue-700">₹{plan.monthlyFee.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal">/mo</span></p>
//                           <p className="text-[10px] text-slate-400 mt-0.5">₹{plan.hourlyRate}/hr</p>
//                         </div>
//                         <div className="mt-2.5 space-y-1">
//                           <p className="text-[10px] text-slate-500 flex items-center gap-1">
//                             <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
//                             Remote Support
//                           </p>
//                           {plan.additionalShifts > 0 && (
//                             <p className="text-[10px] text-slate-500 flex items-center gap-1">
//                               <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
//                               Extra: ₹{plan.additionalShifts}/hr
//                             </p>
//                           )}
//                         </div>
//                       </button>
//                     ))}
//                   </div>

//                   {selectedPlan && (
//                     <div className="mt-3 bg-slate-50 rounded-lg p-3.5 border border-slate-100">
//                       <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">One-Time Fees</p>
//                       <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[12px] text-slate-600">
//                         <div className="flex justify-between"><span>Onboarding</span><span className="font-semibold text-slate-900">₹{selectedPlan.onboardingFee}</span></div>
//                         <div className="flex justify-between"><span>Installation</span><span className="font-semibold text-slate-900">₹{selectedPlan.installationFee}</span></div>
//                         <div className="flex justify-between"><span>Cash Machine</span><span className="font-semibold text-slate-900">₹{selectedPlan.cashMachine}</span></div>
//                         <div className="flex justify-between"><span>On-site Support</span><span className="font-semibold text-slate-900">₹{selectedPlan.onsiteSupport}/trip</span></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Step 3 */}
//               {selectedPlan && (
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">3</span>
//                     <p className="text-sm font-semibold text-slate-900">Reason for Change <span className="text-red-500">*</span></p>
//                   </div>
//                   <textarea
//                     value={requestRemarks}
//                     onChange={(e) => setRequestRemarks(e.target.value)}
//                     className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none"
//                     rows="4"
//                     placeholder="Please describe why you'd like to change your plan..."
//                   ></textarea>
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex gap-3 pt-4 border-t border-slate-100">
//                 <button
//                   onClick={() => { setShowRequestModal(false); resetRequestForm(); }}
//                   className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
//                   disabled={requestingChange}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleRequestChange}
//                   disabled={!selectedPlan || !requestRemarks.trim() || requestingChange}
//                   className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
//                 >
//                   {requestingChange ? (
//                     <span className="flex items-center justify-center gap-1.5">
//                       <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Submitting...
//                     </span>
//                   ) : (
//                     "Submit Request"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const PLANS = {
  dedicated: [
    {
      id: 'ded_8hr', name: '8 Hour Service', shifts: 1, hours: 8,
      monthlyFee: 1800, hourlyRate: 7.50, onboardingFee: 1500,
      installationFee: 1500, hardwareCost: 0, additionalShifts: 7,
      cashMachine: 999, remoteSupport: true, onsiteSupport: 800
    },
    {
      id: 'ded_16hr', name: '16 Hour Service', shifts: 2, hours: 16,
      monthlyFee: 2880, hourlyRate: 6.00, onboardingFee: 1500,
      installationFee: 1500, hardwareCost: 0, additionalShifts: 7,
      cashMachine: 999, remoteSupport: true, onsiteSupport: 800
    },
    {
      id: 'ded_24hr', name: '24 Hour Service', shifts: 3, hours: 24,
      monthlyFee: 3600, hourlyRate: 5.00, onboardingFee: 1500,
      installationFee: 1500, hardwareCost: 0, additionalShifts: 0,
      cashMachine: 999, remoteSupport: true, onsiteSupport: 800
    }
  ],
  shared: [
    {
      id: 'shr_8hr', name: '8 Hour Service', shifts: 1, hours: 8,
      monthlyFee: 1400, hourlyRate: 5.83, onboardingFee: 1500,
      installationFee: 1500, hardwareCost: 0, additionalShifts: 7,
      cashMachine: 999, remoteSupport: true, onsiteSupport: 800
    },
    {
      id: 'shr_16hr', name: '16 Hour Service', shifts: 2, hours: 16,
      monthlyFee: 1900, hourlyRate: 3.96, onboardingFee: 1500,
      installationFee: 1500, hardwareCost: 0, additionalShifts: 7,
      cashMachine: 999, remoteSupport: true, onsiteSupport: 800
    },
    {
      id: 'shr_24hr', name: '24 Hour Service', shifts: 3, hours: 24,
      monthlyFee: 2400, hourlyRate: 3.33, onboardingFee: 1500,
      installationFee: 1500, hardwareCost: 0, additionalShifts: 0,
      cashMachine: 999, remoteSupport: true, onsiteSupport: 800
    }
  ]
};

const fmt = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
};

export default function CustomerDashboard() {
  const [userFname, setUserFname] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userUniqueID, setUserUniqueID] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPlan, setCurrentPlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [changeRequest, setChangeRequest] = useState(null);

  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [requestRemarks, setRequestRemarks] = useState("");
  const [requestingChange, setRequestingChange] = useState(false);

  const [customerProperties, setCustomerProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [loadingAgent, setLoadingAgent] = useState(false);

  const [propertyLinks, setPropertyLinks] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUserFname(res.data.fname);
        setUserRole(res.data.role);
        setUserEmail(res.data.email);
        setUserUniqueID(res.data.unique_id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userUniqueID && userRole === 4) {
      fetchCustomerProperties();
    }
  }, [userUniqueID, userRole]);

  useEffect(() => {
    if (selectedProperty) {
      fetchServicePlan();
      fetchActiveAgent();
      fetchPropertyLinks();
      fetchChangeRequest();
      fetchPlanHistory();
    }
  }, [selectedProperty]);

  const fetchCustomerProperties = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/properties`,
        { params: { customer_id: userUniqueID }, withCredentials: true }
      );
      setCustomerProperties(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedProperty(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };

  const fetchServicePlan = async () => {
    if (!selectedProperty) return;
    setLoadingPlan(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan`,
        { params: { customer_id: userUniqueID, property_id: selectedProperty.property_id }, withCredentials: true }
      );
      setCurrentPlan(res.data);
    } catch (err) {
      console.error("Failed to fetch service plan:", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const fetchPlanHistory = async () => {
    if (!selectedProperty) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/history`,
        { params: { customer_id: userUniqueID }, withCredentials: true }
      );
      setPlanHistory(res.data || []);
    } catch (err) {
      console.error("Failed to fetch plan history:", err);
    }
  };

  const fetchChangeRequest = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/change-request`,
        { params: { customer_id: userUniqueID }, withCredentials: true }
      );
      setChangeRequest(res.data);
    } catch (err) {
      console.error("Failed to fetch change request:", err);
    }
  };

  const fetchActiveAgent = async () => {
    if (!selectedProperty) return;
    setLoadingAgent(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/agent-schedule`,
        { params: { property_id: selectedProperty.property_id }, withCredentials: true }
      );
      setActiveAgent(res.data);
    } catch (err) {
      console.error("Failed to fetch active agent:", err);
      setActiveAgent({ status: 'NO_ACTIVE_AGENT' });
    } finally {
      setLoadingAgent(false);
    }
  };

  const fetchPropertyLinks = async () => {
    if (!selectedProperty) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/property-links`,
        { params: { property_id: selectedProperty.property_id }, withCredentials: true }
      );
      setPropertyLinks(res.data);
    } catch (err) {
      console.error("Failed to fetch property links:", err);
    }
  };

  const handleRequestChange = async () => {
    if (!selectedPlan || !requestRemarks.trim()) {
      alert("Please select a plan and provide remarks");
      return;
    }
    setRequestingChange(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cust/customer/service-plan/change-request`,
        {
          customer_id: userUniqueID,
          property_id: selectedProperty.property_id,
          current_plan_id: currentPlan.id,
          requested_plan_name: selectedPlan.name,
          requested_service_type: selectedServiceType,
          requested_shift_hours: selectedPlan.hours.toString(),
          requested_monthly_price: selectedPlan.monthlyFee.toString(),
          remarks: requestRemarks
        },
        { withCredentials: true }
      );
      alert("Package change request submitted successfully!");
      setShowRequestModal(false);
      resetRequestForm();
      fetchServicePlan();
      fetchChangeRequest();
    } catch (err) {
      console.error("Failed to submit request:", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setRequestingChange(false);
    }
  };

  const resetRequestForm = () => {
    setSelectedServiceType(null);
    setSelectedPlan(null);
    setRequestRemarks("");
  };

  const handlePropertyChange = (property) => {
    setSelectedProperty(property);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h2>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (userRole !== 4) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Access Restricted</h2>
          <p className="text-slate-500 text-sm">This portal is exclusively for customers.</p>
        </div>
      </div>
    );
  }

  const isPlanChangeRequested = currentPlan?.status === 'PENDING_CHANGE' ||
    (changeRequest && changeRequest.status === 'PENDING');

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";

  const hasSharedFolder = propertyLinks?.shared_folder_url;
  const hasInvoicePortal = propertyLinks?.invoice_portal_url;

  return (
    <div className="min-h-screen bg-slate-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease-out forwards; opacity: 0; }
        .fade-up-1 { animation-delay: 0.04s; }
        .fade-up-2 { animation-delay: 0.08s; }
        .fade-up-3 { animation-delay: 0.12s; }
        .fade-up-4 { animation-delay: 0.16s; }
      `}</style>

      {/* ========== HEADER ========== */}
      <header className="bg-white border-b border-slate-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="fade-up">
              <p className="text-xs font-medium text-blue-600 tracking-wide uppercase mb-0.5">{greeting}</p>
              <h1 className="text-xl font-bold text-slate-900">{userFname}</h1>
            </div>
            <div className="flex items-center gap-3">
              {customerProperties.length > 1 && (
                <select
                  value={selectedProperty?.property_id || ""}
                  onChange={(e) => {
                    const property = customerProperties.find(p => p.property_id === e.target.value);
                    handlePropertyChange(property);
                  }}
                  className="text-sm px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  {customerProperties.map((property) => (
                    <option key={property.property_id} value={property.property_id}>
                      {property.property_name}
                    </option>
                  ))}
                </select>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span className="text-[11px] font-semibold text-blue-700 tracking-wide">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========== MAIN ========== */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-5">
        {!selectedProperty ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center fade-up">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No Properties Available</h3>
            <p className="text-sm text-slate-500">Contact your administrator to set up your properties.</p>
          </div>
        ) : (
          <div className="space-y-5">

            {/* ===== ROW 1: Service Plan + Agent ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Service Plan Card */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 fade-up fade-up-1">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-semibold text-slate-900">Service Plan</h2>
                  </div>
                  <button
                    onClick={() => setShowPlanModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
                  >
                    History →
                  </button>
                </div>

                <div className="p-5">
                  {loadingPlan ? (
                    <div className="text-center py-10">
                      <div className="w-7 h-7 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-xs text-slate-400">Loading plan...</p>
                    </div>
                  ) : currentPlan ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{currentPlan.plan_name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{currentPlan.service_type} Service</p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          {currentPlan.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 rounded-lg px-3.5 py-3 border border-slate-100">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Coverage</p>
                          <p className="text-base font-bold text-slate-900">{currentPlan.shift_hours}<span className="text-xs font-medium text-slate-400 ml-0.5">h/day</span></p>
                        </div>
                        <div className="bg-slate-50 rounded-lg px-3.5 py-3 border border-slate-100">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</p>
                          <p className="text-base font-bold text-slate-900">{currentPlan.service_type}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg px-3.5 py-3 border border-blue-100">
                          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1">Monthly</p>
                          <p className="text-base font-bold text-blue-700">${currentPlan.monthly_price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowRequestModal(true)}
                        disabled={isPlanChangeRequested}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                      >
                        {isPlanChangeRequested ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Change Request Pending
                          </span>
                        ) : "Request Plan Change"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No Active Plan</p>
                      <p className="text-xs text-slate-400 mt-0.5">Contact your administrator</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Card */}
              <div className="bg-white rounded-xl border border-slate-200 fade-up fade-up-2">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-slate-900">On-Duty Agent</h2>
                </div>

                <div className="p-5">
                  {loadingAgent ? (
                    <div className="text-center py-10">
                      <div className="w-7 h-7 border-[3px] border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-xs text-slate-400">Checking status...</p>
                    </div>
                  ) : activeAgent?.status === 'ACTIVE' ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white text-base font-semibold">
                            {activeAgent.agent_name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{activeAgent.agent_name}</p>
                          <p className="text-[11px] text-emerald-600 font-semibold">Active Now</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-3">Current Shift</p>
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-[10px] text-blue-400 font-medium mb-1">START</p>
                            <p className="text-sm font-bold text-blue-900">{activeAgent.shift_start}</p>
                          </div>
                          <div className="flex-1 mx-3 relative">
                            <div className="border-t-2 border-dashed border-blue-200"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-blue-400 font-medium mb-1">END</p>
                            <p className="text-sm font-bold text-blue-900">{activeAgent.shift_end}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM6.75 9.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No Agent On Duty</p>
                      <p className="text-xs text-slate-400 mt-0.5">Check back later</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== ROW 2: Links from CM_PROPERTY_LINKS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div
                onClick={() => { if (hasSharedFolder) window.open(propertyLinks.shared_folder_url, '_blank', 'noopener,noreferrer'); }}
                className={`bg-white rounded-xl border border-slate-200 p-5 fade-up fade-up-3 transition-all ${hasSharedFolder ? 'cursor-pointer hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 active:scale-[0.99]' : 'opacity-60'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasSharedFolder ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <svg className={`w-5 h-5 ${hasSharedFolder ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Shared Folder</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{hasSharedFolder ? 'Tap to open in new tab' : 'Not configured yet'}</p>
                    </div>
                  </div>
                  {hasSharedFolder && (
                    <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div
                onClick={() => { if (hasInvoicePortal) window.open(propertyLinks.invoice_portal_url, '_blank', 'noopener,noreferrer'); }}
                className={`bg-white rounded-xl border border-slate-200 p-5 fade-up fade-up-4 transition-all ${hasInvoicePortal ? 'cursor-pointer hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 active:scale-[0.99]' : 'opacity-60'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasInvoicePortal ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <svg className={`w-5 h-5 ${hasInvoicePortal ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Invoice Portal</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{hasInvoicePortal ? 'Tap to open in new tab' : 'Not configured yet'}</p>
                    </div>
                  </div>
                  {hasInvoicePortal && (
                    <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* ========== PLAN HISTORY MODAL ========== */}
      {showPlanModal && currentPlan && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPlanModal(false)}>
          <div className="bg-white rounded-xl max-w-xl w-full overflow-hidden max-h-[85vh] overflow-y-auto shadow-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">Plan History</h3>
              <button onClick={() => setShowPlanModal(false)} className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-2">Current Plan</p>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-base font-bold text-slate-900">{currentPlan.plan_name}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      {currentPlan.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-md px-2.5 py-2">
                      <p className="text-[10px] text-slate-400 uppercase mb-0.5">Service</p>
                      <p className="text-xs font-semibold text-slate-900">{currentPlan.service_type}</p>
                    </div>
                    <div className="bg-white rounded-md px-2.5 py-2">
                      <p className="text-[10px] text-slate-400 uppercase mb-0.5">Hours</p>
                      <p className="text-xs font-semibold text-slate-900">{currentPlan.shift_hours}h/day</p>
                    </div>
                    <div className="bg-white rounded-md px-2.5 py-2">
                      <p className="text-[10px] text-slate-400 uppercase mb-0.5">Monthly</p>
                      <p className="text-xs font-semibold text-blue-700">${currentPlan.monthly_price}</p>
                    </div>
                  </div>
                </div>
              </div>
              {planHistory.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Previous Plans</p>
                  <div className="space-y-2">
                    {planHistory.map((plan, index) => (
                      <div key={index} className="bg-white rounded-lg p-3.5 border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-semibold text-slate-900">{plan.plan_name}</p>
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">{plan.status}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span>{plan.service_type}</span>
                          <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                          <span>{plan.shift_hours}h/day</span>
                          <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                          <span className="font-semibold text-slate-700">${plan.monthly_price}/mo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== REQUEST PLAN CHANGE MODAL ========== */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowRequestModal(false); resetRequestForm(); }}>
          <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900">Request Plan Change</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Choose your new service plan</p>
              </div>
              <button onClick={() => { setShowRequestModal(false); resetRequestForm(); }} className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-6">

              {/* Step 1: Service Type */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
                  <p className="text-sm font-semibold text-slate-900">Select Service Type</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setSelectedServiceType('dedicated'); setSelectedPlan(null); }}
                    className={`relative p-4 rounded-lg border-2 transition-all text-left ${selectedServiceType === 'dedicated' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    {selectedServiceType === 'dedicated' && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Dedicated Service</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Exclusive agent for your property</p>
                  </button>
                  <button
                    onClick={() => { setSelectedServiceType('shared'); setSelectedPlan(null); }}
                    className={`relative p-4 rounded-lg border-2 transition-all text-left ${selectedServiceType === 'shared' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    {selectedServiceType === 'shared' && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Shared Service</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Cost-effective shared solution</p>
                  </button>
                </div>
              </div>

              {/* Step 2: Plan Selection — matching admin format */}
              {selectedServiceType && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
                    <p className="text-sm font-semibold text-slate-900">Choose Plan</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {PLANS[selectedServiceType].map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative rounded-lg border-2 transition-all text-left overflow-hidden ${selectedPlan?.id === plan.id ? 'border-blue-500' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        {/* Card Header */}
                        <div className={`px-3 py-2.5 text-center text-white ${selectedPlan?.id === plan.id ? 'bg-blue-600' : 'bg-slate-700'}`}>
                          {selectedPlan?.id === plan.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                          )}
                          <p className="text-sm font-bold">{plan.hours} Hour</p>
                          <p className="text-[10px] opacity-80">{plan.shifts} Shift{plan.shifts > 1 ? 's' : ''}</p>
                        </div>

                        {/* Card Body */}
                        <div className={`p-3.5 ${selectedPlan?.id === plan.id ? 'bg-blue-50' : 'bg-white'}`}>
                          {/* Price */}
                          <div className="text-center pb-3 mb-3 border-b border-slate-100">
                            <p className="text-xl font-extrabold text-slate-900">{fmt(plan.monthlyFee)}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{fmt(plan.hourlyRate)}/hr</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Kiosk subscription fee monthly</p>
                          </div>

                          {/* One-time fees */}
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">One-Time Fees</p>
                          <div className="space-y-1 text-[11px] mb-2.5">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Onboarding</span>
                              <span className="font-semibold text-slate-800">{fmt(plan.onboardingFee)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Installation</span>
                              <span className="font-semibold text-slate-800">{fmt(plan.installationFee)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Hardware</span>
                              <span className={`font-semibold ${plan.hardwareCost === 0 ? 'text-slate-300' : 'text-slate-800'}`}>$0</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-2.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Add-ons</p>
                            <div className="space-y-1 text-[11px]">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Additional shifts</span>
                                <span className={`font-semibold ${plan.additionalShifts === 0 ? 'text-slate-300' : 'text-slate-800'}`}>
                                  {plan.additionalShifts > 0 ? `$${plan.additionalShifts}/hr` : '$0'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Cash machine</span>
                                <span className="font-semibold text-slate-800">${plan.cashMachine}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Remote Support</span>
                                <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                  included
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">On-Site Support</span>
                                <span className="font-semibold text-slate-800">${plan.onsiteSupport}/trip</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Remarks */}
              {selectedPlan && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">3</span>
                    <p className="text-sm font-semibold text-slate-900">Reason for Change <span className="text-red-500">*</span></p>
                  </div>
                  <textarea
                    value={requestRemarks}
                    onChange={(e) => setRequestRemarks(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none"
                    rows="4"
                    placeholder="Please describe why you'd like to change your plan..."
                  ></textarea>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => { setShowRequestModal(false); resetRequestForm(); }}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                  disabled={requestingChange}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestChange}
                  disabled={!selectedPlan || !requestRemarks.trim() || requestingChange}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                >
                  {requestingChange ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}