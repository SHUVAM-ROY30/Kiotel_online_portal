// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
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

// const fmt = (amount) => {
//   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
// };

// export default function CustomerDashboard() {
//   const router = useRouter();
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
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/properties`,
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
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/service-plan`,
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
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/service-plan/history`,
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
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/service-plan/change-request`,
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
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/agent-schedule`,
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
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/property-links`,
//         { params: { property_id: selectedProperty.property_id }, withCredentials: true }
//       );
//       setPropertyLinks(res.data);
//     } catch (err) {
//       console.error("Failed to fetch property links:", err);
//     }
//   };

//   const handleOpenReports = () => {
//     if (!selectedProperty?.property_id) return;
//     const params = new URLSearchParams({
//       device_id: selectedProperty.property_id,
//       property_name: selectedProperty.property_name || "",
//     });
//     router.push(`/customer/transaction-reports?${params.toString()}`);
//   };

//   const handleRequestChange = async () => {
//     if (!selectedPlan || !requestRemarks.trim()) {
//       alert("Please select a plan and provide remarks");
//       return;
//     }
//     setRequestingChange(true);
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/service-plan/change-request`,
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
//                           <p className="text-base font-bold text-blue-700">${currentPlan.monthly_price}</p>
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

//             {/* ===== ROW 2: Links from CM_PROPERTY_LINKS & Reports ===== */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              
//               <div
//                 onClick={handleOpenReports}
//                 className="bg-white rounded-xl border border-slate-200 p-5 fade-up fade-up-4 cursor-pointer hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 transition-all active:scale-[0.99]"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
//                       <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900">Transaction Reports</p>
//                       <p className="text-[11px] text-slate-400 mt-0.5">View external API logs</p>
//                     </div>
//                   </div>
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
//                       <p className="text-xs font-semibold text-blue-700">${currentPlan.monthly_price}</p>
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
//                           <span className="font-semibold text-slate-700">${plan.monthly_price}/mo</span>
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
//           <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
//             {/* Modal Header */}
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

//               {/* Step 1: Service Type */}
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
//                     <p className="text-sm font-semibold text-slate-900">Dedicated Service</p>
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
//                     <p className="text-sm font-semibold text-slate-900">Shared Service</p>
//                     <p className="text-[11px] text-slate-500 mt-0.5">Cost-effective shared solution</p>
//                   </button>
//                 </div>
//               </div>

//               {/* Step 2: Plan Selection — matching admin format */}
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
//                         className={`relative rounded-lg border-2 transition-all text-left overflow-hidden ${selectedPlan?.id === plan.id ? 'border-blue-500' : 'border-slate-200 hover:border-slate-300'}`}
//                       >
//                         {/* Card Header */}
//                         <div className={`px-3 py-2.5 text-center text-white ${selectedPlan?.id === plan.id ? 'bg-blue-600' : 'bg-slate-700'}`}>
//                           {selectedPlan?.id === plan.id && (
//                             <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
//                               <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
//                             </div>
//                           )}
//                           <p className="text-sm font-bold">{plan.hours} Hour</p>
//                           <p className="text-[10px] opacity-80">{plan.shifts} Shift{plan.shifts > 1 ? 's' : ''}</p>
//                         </div>

//                         {/* Card Body */}
//                         <div className={`p-3.5 ${selectedPlan?.id === plan.id ? 'bg-blue-50' : 'bg-white'}`}>
//                           {/* Price */}
//                           <div className="text-center pb-3 mb-3 border-b border-slate-100">
//                             <p className="text-xl font-extrabold text-slate-900">{fmt(plan.monthlyFee)}</p>
//                             <p className="text-[11px] text-slate-500 font-medium">{fmt(plan.hourlyRate)}/hr</p>
//                             <p className="text-[10px] text-slate-400 mt-0.5">Kiosk subscription fee monthly</p>
//                           </div>

//                           {/* One-time fees */}
//                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">One-Time Fees</p>
//                           <div className="space-y-1 text-[11px] mb-2.5">
//                             <div className="flex justify-between">
//                               <span className="text-slate-500">Onboarding</span>
//                               <span className="font-semibold text-slate-800">{fmt(plan.onboardingFee)}</span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="text-slate-500">Installation</span>
//                               <span className="font-semibold text-slate-800">{fmt(plan.installationFee)}</span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="text-slate-500">Hardware</span>
//                               <span className={`font-semibold ${plan.hardwareCost === 0 ? 'text-slate-300' : 'text-slate-800'}`}>$0</span>
//                             </div>
//                           </div>

//                           <div className="border-t border-slate-100 pt-2.5">
//                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Add-ons</p>
//                             <div className="space-y-1 text-[11px]">
//                               <div className="flex justify-between">
//                                 <span className="text-slate-500">Additional shifts</span>
//                                 <span className={`font-semibold ${plan.additionalShifts === 0 ? 'text-slate-300' : 'text-slate-800'}`}>
//                                   {plan.additionalShifts > 0 ? `$${plan.additionalShifts}/hr` : '$0'}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="text-slate-500">Cash machine</span>
//                                 <span className="font-semibold text-slate-800">${plan.cashMachine}</span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="text-slate-500">Remote Support</span>
//                                 <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
//                                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
//                                   included
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="text-slate-500">On-Site Support</span>
//                                 <span className="font-semibold text-slate-800">${plan.onsiteSupport}/trip</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Step 3: Remarks */}
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
import { useRouter } from "next/navigation";
import axios from "axios";

// Plan data remains unchanged
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
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  }).format(amount);
};

export default function CustomerDashboard() {
  // All state and logic remains exactly the same
  const router = useRouter();
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/properties`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/service-plan`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/service-plan/history`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/service-plan/change-request`,
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
      let internalData = {};
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/agent-schedule`,
          { params: { property_id: selectedProperty.property_id }, withCredentials: true }
        );
        internalData = res.data || {};
      } catch (err) {
        console.warn("Internal agent fetch failed:", err);
      }

      const externalApiToken = process.env.NEXT_PUBLIC_EXTERNAL_API_TOKEN;
      const API_EXT = process.env.NEXT_PUBLIC_URL_ext || 'http://localhost:3001';
      let externalData = null;

      try {
        const extRes = await axios.get(
          `${API_EXT}api/v1/external/devices/${selectedProperty.property_id}/active-agent`,
          { headers: { Authorization: `Bearer ${externalApiToken}` } }
        );
        externalData = extRes.data;
      } catch (extErr) {
        console.error("External agent fetch failed:", extErr.response?.data || extErr.message);
      }

      if (externalData && externalData.active) {
        setActiveAgent({
          status: 'ACTIVE',
          agent_name: externalData.agent_name,
          agent_id: externalData.agent_id,
          shift_start: internalData.shift_start || '--:--',
          shift_end: internalData.shift_end || '--:--'
        });
      } else if (externalData && !externalData.active) {
        setActiveAgent({ status: 'NO_ACTIVE_AGENT' });
      } else if (internalData?.status === 'ACTIVE') {
        setActiveAgent(internalData);
      } else {
        setActiveAgent({ status: 'NO_ACTIVE_AGENT' });
      }

    } catch (err) {
      console.error("Agent fetch process failed:", err);
      setActiveAgent({ status: 'NO_ACTIVE_AGENT' });
    } finally {
      setLoadingAgent(false);
    }
  };

  const fetchPropertyLinks = async () => {
    if (!selectedProperty) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/property-links`,
        { params: { property_id: selectedProperty.property_id }, withCredentials: true }
      );
      setPropertyLinks(res.data);
    } catch (err) {
      console.error("Failed to fetch property links:", err);
    }
  };

  const handleOpenReports = () => {
    if (!selectedProperty?.property_id) return;
    const params = new URLSearchParams({
      device_id: selectedProperty.property_id,
      property_name: selectedProperty.property_name || "",
    });
    router.push(`/customer/transaction-reports?${params.toString()}`);
  };

  const handleRequestChange = async () => {
    if (!selectedPlan || !requestRemarks.trim()) {
      alert("Please select a plan and provide remarks");
      return;
    }
    setRequestingChange(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/service-plan/change-request`,
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Access restricted state
  if (userRole !== 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 mb-4">
            <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-500">This portal is securely locked for customer access only.</p>
        </div>
      </div>
    );
  }

  const isPlanChangeRequested = currentPlan?.status === 'PENDING_CHANGE' || (changeRequest && changeRequest.status === 'PENDING');
  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good Morning" : today.getHours() < 18 ? "Good Afternoon" : "Good Evening";

  const hasSharedFolder = propertyLinks?.shared_folder_url;
  const hasInvoicePortal = propertyLinks?.invoice_portal_url;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* ========== HEADER ========== */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">{greeting}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{userFname}</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {customerProperties.length > 1 && (
                <div className="relative">
                  <select
                    value={selectedProperty?.property_id || ""}
                    onChange={(e) => {
                      const property = customerProperties.find(p => p.property_id === e.target.value);
                      handlePropertyChange(property);
                    }}
                    className="appearance-none h-10 w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    {customerProperties.map((property) => (
                      <option key={property.property_id} value={property.property_id}>
                        {property.property_name}
                      </option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
              
              <div className="inline-flex items-center rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 border border-green-200">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                System Online
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {!selectedProperty ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-500 max-w-sm">You currently do not have any properties assigned. Please contact support to configure your account.</p>
          </div>
        ) : (
          <>
            {/* ===== ROW 1: Service Plan + Agent ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Service Plan Card */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Service Plan Configuration
                    </h2>
                    <button 
                      onClick={() => setShowPlanModal(true)} 
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View History 
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {loadingPlan ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4"></div>
                      <p className="text-gray-500 font-medium">Retrieving plan details...</p>
                    </div>
                  ) : currentPlan ? (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{currentPlan.plan_name}</h3>
                            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                              {currentPlan.status}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{currentPlan.service_type} Architecture</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Daily Coverage</p>
                          <p className="text-2xl font-bold text-gray-900">{currentPlan.shift_hours}<span className="text-base font-medium text-gray-500 ml-1">hrs</span></p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Service Type</p>
                          <p className="text-xl font-bold text-gray-900 capitalize mt-1">{currentPlan.service_type}</p>
                        </div>
                        <div className="rounded-xl bg-blue-600 p-5 text-white">
                          <p className="text-xs font-medium text-blue-100 mb-2 uppercase tracking-wide">Monthly Billing</p>
                          <p className="text-2xl font-bold text-white">${currentPlan.monthly_price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowRequestModal(true)}
                        disabled={isPlanChangeRequested}
                        className="w-full inline-flex h-11 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isPlanChangeRequested ? "Modification Request Pending..." : "Request Plan Upgrade / Modification"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-lg font-semibold text-gray-900">No Active Plan</p>
                      <p className="text-gray-500 mt-1">Please contact administration to provision your services.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Card */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-5">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Active Remote Agent
                  </h2>
                </div>

                <div className="p-6">
                  {loadingAgent ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-green-500 animate-spin mb-4"></div>
                      <p className="text-gray-500 font-medium">Connecting to terminal...</p>
                    </div>
                  ) : activeAgent?.status === 'ACTIVE' ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-200">
                            <span className="text-xl font-bold text-green-700">{activeAgent.agent_name?.charAt(0).toUpperCase() || 'A'}</span>
                          </div>
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></span>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{activeAgent.agent_name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <p className="text-sm font-medium text-green-600">Currently monitoring</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <p className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">Shift Schedule</p>
                        <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                          <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">{activeAgent.shift_start}</span>
                          <div className="flex-1 mx-4 flex items-center">
                            <div className="h-0.5 w-full bg-gray-200"></div>
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mx-1 flex-shrink-0"></div>
                            <div className="h-0.5 w-full bg-gray-200"></div>
                          </div>
                          <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">{activeAgent.shift_end}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">Terminal Offline</p>
                      <p className="text-sm text-gray-500 mt-1">No agent is currently assigned to this shift block.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== ROW 2: Resources ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div
                onClick={() => { if (hasSharedFolder) window.open(propertyLinks.shared_folder_url, '_blank', 'noopener,noreferrer'); }}
                className={`group rounded-2xl border border-gray-200 bg-white p-6 transition-all ${hasSharedFolder ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : 'opacity-60 cursor-not-allowed'}`}
              >
                <div className="flex flex-col h-full justify-between gap-5">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${hasSharedFolder ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-300'}`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Shared Documents</h3>
                    <p className="text-sm text-gray-500 mt-1">{hasSharedFolder ? 'Access secure drive externally' : 'Not configured'}</p>
                  </div>
                  {hasSharedFolder && (
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Open Drive
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => { if (hasInvoicePortal) window.open(propertyLinks.invoice_portal_url, '_blank', 'noopener,noreferrer'); }}
                className={`group rounded-2xl border border-gray-200 bg-white p-6 transition-all ${hasInvoicePortal ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : 'opacity-60 cursor-not-allowed'}`}
              >
                <div className="flex flex-col h-full justify-between gap-5">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${hasInvoicePortal ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-300'}`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Billing Portal</h3>
                    <p className="text-sm text-gray-500 mt-1">{hasInvoicePortal ? 'Manage invoices & payments' : 'Not configured'}</p>
                  </div>
                  {hasInvoicePortal && (
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Open Portal
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Card 3 */}
              <div
                onClick={handleOpenReports}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all cursor-pointer hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex flex-col h-full justify-between gap-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Transaction Logs</h3>
                    <p className="text-sm text-gray-500 mt-1">Audit external terminal events</p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-600 group-hover:text-green-700">
                    View Reports
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </main>

      {/* ========== PLAN HISTORY MODAL ========== */}
      {showPlanModal && currentPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowPlanModal(false)}>
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-gray-200 flex flex-col overflow-hidden max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Service Plan History</h3>
              <button onClick={() => setShowPlanModal(false)} className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Current Assignment</p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{currentPlan.plan_name}</h4>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">{currentPlan.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm divide-x divide-gray-200">
                    <div className="pr-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Architecture</p>
                      <p className="font-medium text-gray-900 capitalize">{currentPlan.service_type}</p>
                    </div>
                    <div className="px-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Coverage</p>
                      <p className="font-medium text-gray-900">{currentPlan.shift_hours}h/day</p>
                    </div>
                    <div className="pl-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Billing</p>
                      <p className="font-medium text-gray-900">${currentPlan.monthly_price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {planHistory.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Historical Logs</p>
                  <div className="space-y-3">
                    {planHistory.map((plan, index) => (
                      <div key={index} className="rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{plan.plan_name}</p>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{plan.status}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="capitalize">{plan.service_type}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                          <span>{plan.shift_hours}h/day</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                          <span>${plan.monthly_price}/mo</span>
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => { setShowRequestModal(false); resetRequestForm(); }}>
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl border border-gray-200 flex flex-col overflow-hidden max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Modify Service Configuration</h3>
                <p className="text-sm text-gray-500 mt-1">Select a new tier for property: <span className="font-medium text-blue-600">{selectedProperty.property_name}</span></p>
              </div>
              <button onClick={() => { setShowRequestModal(false); resetRequestForm(); }} className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8">
              {/* Step 1 */}
              <div className="space-y-4">
                <label className="flex items-center text-sm font-medium text-gray-900 uppercase tracking-wide">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm mr-3 font-medium">1</span>
                  Select Architecture
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => { setSelectedServiceType('dedicated'); setSelectedPlan(null); }}
                    className={`relative rounded-xl border-2 p-5 text-left transition-all ${selectedServiceType === 'dedicated' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                  >
                    {selectedServiceType === 'dedicated' && (
                      <div className="absolute top-3 right-3">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="font-semibold text-gray-900 text-lg mb-1">Dedicated Terminal</div>
                    <div className="text-sm text-gray-500">Exclusive agent monitoring for high-volume operations</div>
                  </button>
                  <button
                    onClick={() => { setSelectedServiceType('shared'); setSelectedPlan(null); }}
                    className={`relative rounded-xl border-2 p-5 text-left transition-all ${selectedServiceType === 'shared' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                  >
                    {selectedServiceType === 'shared' && (
                      <div className="absolute top-3 right-3">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="font-semibold text-gray-900 text-lg mb-1">Shared Resources</div>
                    <div className="text-sm text-gray-500">Cost-effective shared routing for standard workloads</div>
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              {selectedServiceType && (
                <div className="space-y-4">
                  <label className="flex items-center text-sm font-medium text-gray-900 uppercase tracking-wide">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm mr-3 font-medium">2</span>
                    Select Coverage Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {PLANS[selectedServiceType].map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative rounded-xl border-2 text-left transition-all flex flex-col ${selectedPlan?.id === plan.id ? 'border-blue-500 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                      >
                        <div className={`p-5 border-b ${selectedPlan?.id === plan.id ? 'bg-blue-600 border-blue-700' : 'bg-gray-50 border-gray-200'}`}>
                          <div className={`font-semibold text-lg ${selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-900'}`}>{plan.hours} Hours / Day</div>
                          <div className={`text-sm font-medium mt-1 ${selectedPlan?.id === plan.id ? 'text-blue-100' : 'text-gray-500'}`}>{plan.shifts} Shift{plan.shifts > 1 ? 's' : ''}</div>
                        </div>
                        <div className={`p-5 flex-1 ${selectedPlan?.id === plan.id ? 'bg-blue-50' : 'bg-white'}`}>
                          <div className="text-2xl font-bold text-gray-900 mb-4">{fmt(plan.monthlyFee)}<span className="text-sm font-medium text-gray-400">/mo</span></div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center"><span className="text-gray-500">Rate</span><span className="font-medium text-gray-900">{fmt(plan.hourlyRate)}/hr</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-500">Setup</span><span className="font-medium text-gray-900">{fmt(plan.onboardingFee)}</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-500">Support</span><span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Included</span></div>
                          </div>
                        </div>
                        {selectedPlan?.id === plan.id && (
                          <div className="absolute top-4 right-4 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                            <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {selectedPlan && (
                <div className="space-y-4">
                  <label className="flex items-center text-sm font-medium text-gray-900 uppercase tracking-wide">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm mr-3 font-medium">3</span>
                    Authorization Remarks
                  </label>
                  <div>
                    <textarea
                      value={requestRemarks}
                      onChange={(e) => setRequestRemarks(e.target.value)}
                      className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all resize-none"
                      placeholder="Provide business justification or special handling instructions for this provisioning request..."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={() => { setShowRequestModal(false); resetRequestForm(); }}
                disabled={requestingChange}
                className="inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestChange}
                disabled={!selectedPlan || !requestRemarks.trim() || requestingChange}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {requestingChange ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Request...
                  </>
                ) : "Submit Provisioning Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}