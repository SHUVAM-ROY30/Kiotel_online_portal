// // Attendance/PhotoCapture.jsx



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
import { FaCamera, FaRedo, FaSyncAlt, FaVideo } from 'react-icons/fa';

const PhotoCapture = ({ 
  onCapture, 
  onRetake, 
  isCaptured, 
  isLoading,
  photoType
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Clean up stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start camera
  useEffect(() => {
    if (!isCaptured) {
      startCamera();
    }
  }, [isCaptured, facingMode]);

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    setIsInitializing(true);

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
      setIsInitializing(false);
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMsg = 'Unable to access camera.';
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera access denied. Please allow camera permissions.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.';
      }
      setCameraError(errorMsg);
      setIsInitializing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
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
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const actionLabel = photoType === 'clock_in' ? 'Clock-in' : 'Clock-out';

  if (isCaptured) return null;

  return (
    <div className="w-full">
      {/* Camera View */}
      {!capturedPhoto ? (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-200">
          {cameraError ? (
            <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <FaCamera className="text-red-400 text-2xl" />
              </div>
              <p className="text-center text-sm font-medium mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-semibold transition-all border border-white/20"
              >
                Retry Camera
              </button>
            </div>
          ) : isInitializing ? (
            <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <FaCamera className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl" />
              </div>
              <p className="text-white font-medium mt-4">Initializing camera...</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full aspect-[4/3] object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              
              {/* Overlay frame with gradient border */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[85%] h-[85%] rounded-2xl border-4 border-dashed border-blue-400/60 backdrop-blur-[1px]"></div>
              </div>

              {/* Instructions */}
              <div className="absolute top-4 left-0 right-0 flex justify-center">
                <div className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                  <FaCamera />
                  Position yourself in the frame
                </div>
              </div>

              {/* Camera switch button (if available) */}
              <button
                onClick={toggleCamera}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                title="Switch Camera"
              >
                <FaSyncAlt className="text-blue-600 text-lg" />
              </button>
            </>
          )}
        </div>
      ) : (
        // Preview captured photo
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-green-200">
          <img 
            src={capturedPhoto} 
            alt="Captured" 
            className="w-full aspect-[4/3] object-cover"
          />
          
          {/* Success overlay */}
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <div className="bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
              <span className="text-lg">✓</span>
              Photo captured successfully
            </div>
          </div>

          {/* Retake button */}
          <button
            onClick={retakePhoto}
            disabled={isLoading}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-xl transition-all disabled:opacity-50 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <FaRedo />
            Retake Photo
          </button>
        </div>
      )}

      {/* Capture Button */}
      {!capturedPhoto && !cameraError && !isInitializing && (
        <div className="mt-6">
          <button
            onClick={capturePhoto}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-60 flex items-center justify-center gap-3 text-lg hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <>
                <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaCamera className="text-xl" />
                </div>
                Capture {actionLabel} Photo
              </>
            )}
          </button>

          {/* Instruction text */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Make sure your face is clearly visible in the frame
          </p>
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCapture;