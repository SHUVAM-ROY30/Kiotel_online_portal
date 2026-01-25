



// 'use client';

// import { useState, useRef, useEffect } from 'react';

// const PhotoCapture = ({ 
//   onCapture, 
//   onRetake, 
//   isCaptured, 
//   isLoading,
//   photoType // 'clock_in' or 'clock_out'
// }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [facingMode, setFacingMode] = useState('user'); // 'user' (front) or 'environment' (back)
//   const [cameraError, setCameraError] = useState('');

//   // Clean up stream on unmount or when switching cameras
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, []);

//   // Start or restart camera when facingMode or isCaptured changes
//   useEffect(() => {
//     if (!isCaptured) {
//       startCamera();
//     }
//   }, [isCaptured, facingMode]);

//   const startCamera = async () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }

//     try {
//       setCameraError('');
//       const constraints = {
//         video: {
//           facingMode: facingMode,
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         }
//       };

//       const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (err) {
//       console.error('Camera access error:', err);
//       let errorMsg = 'Unable to access camera.';
//       if (err.name === 'NotAllowedError') {
//         errorMsg = 'Camera access denied. Please allow camera permissions.';
//       } else if (err.name === 'NotFoundError') {
//         errorMsg = 'No camera found on this device.';
//       }
//       setCameraError(errorMsg);
//     }
//   };

//   const capturePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) return;
    
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
    
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
    
//     const ctx = canvas.getContext('2d');
//     // Flip image horizontally if using front camera (mirror effect)
//     if (facingMode === 'user') {
//       ctx.translate(canvas.width, 0);
//       ctx.scale(-1, 1);
//     }
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
//     setCapturedPhoto(dataUrl);
//     onCapture(dataUrl);
//   };

//   const retakePhoto = () => {
//     setCapturedPhoto(null);
//     onRetake();
//     // Camera will restart via useEffect
//   };

//   const toggleCamera = () => {
//     setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
//   };

//   const actionLabel = photoType === 'clock_in' ? 'Clock-in' : 'Clock-out';

//   if (isCaptured) return null;

//   return (
//     <div className="w-full max-w-md">
//       {/* Camera View */}
//       {!capturedPhoto ? (
//         <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
//           {cameraError ? (
//             <div className="w-full h-64 flex items-center justify-center bg-gray-900 text-red-400 text-center p-4">
//               <p>{cameraError}</p>
//             </div>
//           ) : (
//             <>
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className={`w-full ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
//                 style={{ aspectRatio: '4/3' }}
//               />
              
//               {/* Overlay frame */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="w-4/5 h-4/5 border-2 border-blue-400 border-dashed rounded-lg opacity-60"></div>
//               </div>

             
//             </>
//           )}
//         </div>
//       ) : (
//         // Preview captured photo
//         <div className="relative rounded-xl overflow-hidden shadow-lg">
//           <img 
//             src={capturedPhoto} 
//             alt="Captured" 
//             className="w-full"
//             style={{ aspectRatio: '4/3' }}
//           />
//           <button
//             onClick={retakePhoto}
//             disabled={isLoading}
//             className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-medium shadow-lg transition disabled:opacity-50"
//           >
//             Retake Photo
//           </button>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="mt-5 flex flex-col gap-3">
//         {!capturedPhoto && !cameraError && (
//           <button
//             onClick={capturePhoto}
//             disabled={isLoading}
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               `Capture ${actionLabel} Photo`
//             )}
//           </button>
//         )}

//         {cameraError && (
//           <button
//             onClick={startCamera}
//             className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition"
//           >
//             Retry Camera
//           </button>
//         )}
//       </div>

//       {/* Hidden canvas for capturing */}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };

// export default PhotoCapture;



'use client';

import { useState, useRef, useEffect } from 'react';

const PhotoCapture = ({ 
  onCapture, 
  onRetake, 
  isCaptured, 
  isLoading,
  photoType // 'clock_in' or 'clock_out'
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' (front) or 'environment' (back)
  const [cameraError, setCameraError] = useState('');

  // Clean up stream on unmount or when switching cameras
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start or restart camera when facingMode or isCaptured changes
  useEffect(() => {
    if (!isCaptured) {
      startCamera();
    }
  }, [isCaptured, facingMode]);

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      setCameraError('');
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMsg = 'Unable to access camera.';
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera access denied. Please allow camera permissions.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.';
      }
      setCameraError(errorMsg);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    // Flip image horizontally if using front camera (mirror effect)
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    onCapture(dataUrl);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    onRetake();
    // Camera will restart via useEffect
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const actionLabel = photoType === 'clock_in' ? 'Clock In' : 'Clock Out';
  const actionColor = photoType === 'clock_in' ? 'from-blue-600 to-blue-700' : 'from-indigo-600 to-indigo-700';

  if (isCaptured) return null;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {/* <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${actionColor}`}></div> */}
          {/* <h2 className="text-2xl font-bold text-gray-800">
            {actionLabel} Verification
          </h2> */}
        </div>
        {/* <p className="text-sm text-gray-500 ml-5">
          Position your face within the frame for attendance verification
        </p> */}
      </div>

      {/* Camera View Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {!capturedPhoto ? (
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {cameraError ? (
              <div className="w-full h-96 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 mb-6 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Access Required</h3>
                <p className="text-gray-600 text-sm max-w-sm">{cameraError}</p>
              </div>
            ) : (
              <>
                {/* Video Feed */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    style={{ aspectRatio: '4/2', objectFit: 'cover' }}
                  />
                  
                  {/* Gradient Overlays for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none"></div>
                  
                  {/* Face Frame Guide */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
                    <div className="relative w-full max-w-xs aspect-[3/4]">
                      {/* Corner Brackets */}
                      {/* <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl shadow-lg shadow-blue-500/50"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-900 rounded-tr-2xl shadow-lg shadow-blue-500/50"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl shadow-lg shadow-blue-500/50"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-400 rounded-br-2xl shadow-lg shadow-blue-500/50"></div> */}
                      
                      {/* Center guide text */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                        {/* <p className="text-white text-xs font-medium whitespace-nowrap">
                          Align your face here
                        </p> */}
                      </div>
                    </div>
                  </div>

                  {/* Top Controls Bar */}
                  <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4">
                    {/* Camera Type Indicator */}
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      <p className="text-white text-xs font-medium">
                        {/* {facingMode === 'user' ? '📷 Front Camera' : '📷 Rear Camera'} */}
                      </p>
                    </div>
                    
                    {/* Flip Camera Button */}
                    {/* <button
                      onClick={toggleCamera}
                      className="bg-white/90 backdrop-blur-md hover:bg-white p-2.5 rounded-full transition-all shadow-lg hover:shadow-xl border border-gray-200"
                      aria-label="Switch camera"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button> */}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          // Preview Captured Photo
          <div className="relative">
            <img 
              src={capturedPhoto} 
              alt="Captured verification photo" 
              className="w-full"
              style={{ aspectRatio: '4/2', objectFit: 'cover' }}
            />
            
            {/* Success Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent pointer-events-none"></div>
            
            {/* Success Badge */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Photo Captured</span>
            </div>

            {/* Retake Button */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <button
                onClick={retakePhoto}
                disabled={isLoading}
                className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-xl transition-all border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake Photo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {!capturedPhoto && !cameraError && (
          <button
            onClick={capturePhoto}
            disabled={isLoading}
            className={`w-full bg-gradient-to-r ${actionColor} hover:shadow-2xl text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg">Processing Verification...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">Capture {actionLabel} Photo</span>
              </>
            )}
          </button>
        )}

        {cameraError && (
          <button
            onClick={startCamera}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Camera Access
          </button>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Verification Tips</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Ensure your face is clearly visible and well-lit</li>
              {/* <li>• Remove any accessories that obscure your face</li> */}
              <li>• Position yourself within the frame guides</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCapture;